import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const explicitNext = searchParams.get('next')
  const authError = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (authError) {
    console.error('OAuth error from provider:', authError, errorDescription)
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(errorDescription || authError)}`, origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      // 1. Call claim_team_access() RPC to auto-promote pre-approved emails to ADMIN
      let teamRole: string | null = null
      try {
        const { data: claimedRole } = await supabase.rpc('claim_team_access')
        teamRole = claimedRole
      } catch (err) {
        console.warn('Error claiming team access in callback:', err)
      }

      // 2. Fetch existing profile or detect admin
      let isAdminUser = !!teamRole
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profile?.role === 'ADMIN') {
          isAdminUser = true
        }
      } catch (profFetchErr) {
        console.warn('Error checking existing profile:', profFetchErr)
      }

      // 3. Ensure user profile exists (especially for first-time Google sign-ins)
      try {
        const meta = data.user.user_metadata || {}
        const fullName =
          meta.full_name || meta.name || data.user.email?.split('@')[0] || 'User'
        const avatarUrl = meta.avatar_url || meta.picture || null

        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName,
            avatar_url: avatarUrl,
            role: isAdminUser ? 'ADMIN' : 'TENANT',
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id', ignoreDuplicates: false }
        )
      } catch (profileUpsertErr) {
        console.warn('Profile upsert fallback in callback:', profileUpsertErr)
      }

      // 4. Determine and sanitize redirect destination (prevent Open Redirect CWE-601)
      let targetDestination = isAdminUser ? '/admin' : '/dashboard'
      if (explicitNext) {
        const sanitized = explicitNext.trim()
        if (
          sanitized.startsWith('/') &&
          !sanitized.startsWith('//') &&
          !sanitized.startsWith('/\\') &&
          !sanitized.includes(':')
        ) {
          targetDestination = sanitized
        }
      }

      // Safe base URL calculation (prefer configured NEXT_PUBLIC_SITE_URL or request origin)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      const baseUrl = siteUrl ? siteUrl.replace(/\/$/, '') : origin

      return NextResponse.redirect(new URL(targetDestination, baseUrl))
    }
  }

  // Return the user to signin on failure
  return NextResponse.redirect(new URL('/signin?error=auth_callback_failed', origin))
}
