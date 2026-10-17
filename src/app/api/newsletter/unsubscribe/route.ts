import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  token: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email().optional(),
}).refine((data) => Boolean(data.token || data.email), {
  message: 'Either an unsubscribe token or valid email address must be provided.',
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip'
    const limit = rateLimit(`unsub-${ip}`, 5, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few moments.' },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Missing or malformed JSON payload.' },
        { status: 400 }
      )
    }

    const validation = unsubscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid unsubscribe parameters.' },
        { status: 400 }
      )
    }

    const { token, email } = validation.data
    const supabase = await createClient()

    // Execute unsubscribe via secure database function
    try {
      await supabase.rpc('unsubscribe_newsletter', {
        p_token: token || null,
        p_email: email || null,
      })
    } catch {
      // Fallback direct table update if RPC is pending migration deployment
      if (token) {
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: false,
            unsubscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('unsubscribe_token', token)
      } else if (email) {
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: false,
            unsubscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)
      }
    }

    // PRIVACY DEFENSE: Always return generic success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from PrimeHomeKanpur property alerts.',
    })
  } catch (err: any) {
    console.error('[SERVER ERROR] Unsubscribe error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to process unsubscribe request.' },
      { status: 500 }
    )
  }
}
