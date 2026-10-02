'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  role: UserRole | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isStaff: boolean
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

const ADMIN_ROLES: UserRole[] = ['super_admin', 'admin', 'property_manager', 'listing_manager', 'review_manager', 'ADMIN']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMessage, setAuthModalMessage] = useState('Please sign in to continue.')
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      // Primary admin email override
      const isSuperAdminEmail = authUser.email === 'primehomekanpur@gmail.com'

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error || !data) {
        // Fallback default profile
        const defaultProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          phone: authUser.user_metadata?.phone || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          role: isSuperAdminEmail ? 'super_admin' : (authUser.user_metadata?.role || 'user'),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(defaultProfile)
        return defaultProfile
      }

      // If email is super admin email, enforce super_admin role
      if (isSuperAdminEmail && data.role !== 'super_admin') {
        data.role = 'super_admin'
      }

      setProfile(data as UserProfile)
      return data as UserProfile
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

      let userRole: UserRole = 'user'
      if (data.user) {
        const p = await fetchProfile(data.user)
        userRole = p?.role || (data.user.email === 'primehomekanpur@gmail.com' ? 'super_admin' : 'user')
      }

      const isStaffRole = ADMIN_ROLES.includes(userRole) || email === 'primehomekanpur@gmail.com'

      if (explicitRedirect) {
        router.push(explicitRedirect)
      } else if (isStaffRole) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }

      setIsLoading(false)
      return { error: null, role: userRole }
    } catch (err: any) {
      setIsLoading(false)
      return { error: err }
    }
  }

  const signInWithGoogle = async (explicitRedirect?: string) => {
    setIsLoading(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      const redirectTo = `${origin}/auth/callback${explicitRedirect ? `?next=${encodeURIComponent(explicitRedirect)}` : ''}`

      const { data, error } = await supabase.auth.signInWithOAuth({
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
    } catch (err: any) {
      setIsLoading(false)
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setIsLoading(true)
    try {
      const isSuperAdminEmail = email === 'primehomekanpur@gmail.com'
      const role = isSuperAdminEmail ? 'super_admin' : 'user'

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
            role,
          },
        },
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      if (data.user && data.session) {
        await fetchProfile(data.user)
        if (isSuperAdminEmail) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }

      setIsLoading(false)
      return { error: null, session: data.session }
    } catch (err: any) {
      setIsLoading(false)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Sign out error:', err)
      router.push('/')
    }
  }

  const openAuthModal = (message?: string) => {
    if (message) setAuthModalMessage(message)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }

  const role = profile?.role || (user?.email === 'primehomekanpur@gmail.com' ? 'super_admin' : null)
  const isSuperAdmin = role === 'super_admin' || user?.email === 'primehomekanpur@gmail.com'
  const isStaff = isSuperAdmin || (role ? ADMIN_ROLES.includes(role) : false)
  const isAdmin = isStaff
  const isAuthenticated = Boolean(user)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isStaff,
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
