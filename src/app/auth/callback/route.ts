import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const explicitNext = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      // Call claim_team_access() RPC to auto-promote pre-approved emails to ADMIN
      let teamRole: string | null = null
      try {
        const { data: claimedRole } = await supabase.rpc('claim_team_access')
        teamRole = claimedRole
      } catch (err) {
        console.error('Error claiming team access in callback:', err)
      }

      // Check user role from profile if RPC didn't return
      let isAdminUser = !!teamRole
      if (!isAdminUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        isAdminUser = profile?.role === 'ADMIN'
      }

      // Determine and sanitize redirect destination (prevent Open Redirect CWE-601)
      let targetDestination = '/'
      if (explicitNext) {
        // Strict relative path validation: must start with single '/', no protocol, no '//'
        const sanitized = explicitNext.trim()
        if (sanitized.startsWith('/') && !sanitized.startsWith('//') && !sanitized.startsWith('/\\') && !sanitized.includes(':')) {
          targetDestination = sanitized
        }
      } else if (isAdminUser) {
        targetDestination = '/admin'
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
