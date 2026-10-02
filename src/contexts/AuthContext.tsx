'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'
import { TeamRole, Permission, can } from '@/lib/permissions'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  role: 'ADMIN' | 'TENANT' | null
  teamRole: TeamRole | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  can: (permission: Permission) => boolean
  signIn: (email: string, password: string, redirectTo?: string) => Promise<{ error: Error | null; role?: string }>
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null; session?: Session | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  authModalOpen: boolean
  authModalMessage: string
  openAuthModal: (message?: string) => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [teamRole, setTeamRole] = useState<TeamRole | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMessage, setAuthModalMessage] = useState('Please sign in to continue.')
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      // 1. Call claim_team_access RPC to promote pre-approved emails immediately
      let claimedRole: string | null = null
      try {
        const { data: rpcRole, error: rpcErr } = await supabase.rpc('claim_team_access')
        if (!rpcErr && rpcRole) {
          claimedRole = rpcRole
        }
      } catch (err) {
        console.warn('claim_team_access RPC notice:', err)
      }

      // 2. Fetch profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      // 3. Fetch team role from team_members
      const { data: memberData } = await supabase
        .from('team_members')
        .select('team_role, is_active')
        .or(`user_id.eq.${authUser.id},email.eq.${authUser.email?.toLowerCase()}`)
        .eq('is_active', true)
        .maybeSingle()

      const resolvedTeamRole = (claimedRole || memberData?.team_role || (data?.role === 'ADMIN' ? 'OWNER' : null)) as TeamRole | null
      setTeamRole(resolvedTeamRole)

      const isAdminRole = !!claimedRole || memberData?.is_active || data?.role === 'ADMIN'

      if (error || !data) {
        const defaultProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Admin',
          phone: authUser.user_metadata?.phone || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          role: isAdminRole ? 'ADMIN' : 'TENANT',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(defaultProfile)
        return defaultProfile
      }

      const userProfile = {
        ...data,
        role: isAdminRole ? 'ADMIN' : ('TENANT' as 'ADMIN' | 'TENANT'),
      } as UserProfile

      setProfile(userProfile)
      return userProfile
    } catch {
      return null
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (isMounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          if (initialSession?.user) {
            await fetchProfile(initialSession.user)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfile(currentSession.user)
        } else {
          setProfile(null)
          setTeamRole(null)
        }

        setIsLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string, explicitRedirect?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      // Call claim_team_access RPC to check and promote pre-approved emails
      let claimedRole: string | null = null
      try {
        const { data: rpcRole } = await supabase.rpc('claim_team_access')
        claimedRole = rpcRole
      } catch (rpcErr) {
        console.error('RPC claim_team_access error:', rpcErr)
      }

      let userRole: 'ADMIN' | 'TENANT' = 'TENANT'
      if (data.user) {
        const p = await fetchProfile(data.user)
        userRole = p?.role === 'ADMIN' || !!claimedRole ? 'ADMIN' : 'TENANT'
      }

      const isAdminUser = userRole === 'ADMIN' || !!claimedRole

      if (explicitRedirect) {
        router.push(explicitRedirect)
      } else if (isAdminUser) {
        router.push('/admin')
      } else {
        router.push('/')
      }

      setIsLoading(false)
      return { error: null, role: userRole }
    } catch (err: unknown) {
      setIsLoading(false)
      return { error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  const signInWithGoogle = async (explicitRedirect?: string) => {
    setIsLoading(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      const redirectTo = `${origin}/auth/callback${explicitRedirect ? `?next=${encodeURIComponent(explicitRedirect)}` : ''}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      return { error: null }
    } catch (err: unknown) {
      setIsLoading(false)
      return { error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
            role: 'TENANT',
          },
        },
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      if (data.user && data.session) {
        // Try claiming team access in case this was a pre-approved email
        try {
          await supabase.rpc('claim_team_access')
        } catch {
          // ignore
        }
        const p = await fetchProfile(data.user)
        if (p?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }

      setIsLoading(false)
      return { error: null, session: data.session }
    } catch (err: unknown) {
      setIsLoading(false)
      return { error: err instanceof Error ? err : new Error(String(err)) }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setTeamRole(null)
      setSession(null)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const openAuthModal = (message?: string) => {
    if (message) setAuthModalMessage(message)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }

  const hasPermission = (permission: Permission) => {
    return can(teamRole, permission)
  }

  const isAdmin = profile?.role === 'ADMIN' || !!teamRole

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role: (profile?.role === 'ADMIN' ? 'ADMIN' : 'TENANT') as 'ADMIN' | 'TENANT',
        teamRole,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        can: hasPermission,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        refreshProfile,
        authModalOpen,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
