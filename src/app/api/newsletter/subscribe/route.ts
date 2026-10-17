import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(150, 'Email address is too long'),
  source: z.string().max(50).optional().default('footer_form'),
})

export async function POST(request: Request) {
  try {
    // 1. IP-based rate limiting: max 5 subscription attempts per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip'
    const limit = rateLimit(`newsletter-${ip}`, 5, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again in a few moments.' },
        { status: 429 }
      )
    }

    // 2. Parse & validate JSON payload
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Missing or malformed JSON payload.' },
        { status: 400 }
      )
    }

    const validation = subscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid email address.' },
        { status: 400 }
      )
    }

    const { email: normalizedEmail, source } = validation.data
    const supabase = await createClient()

    // 3. Check for existing subscriber (idempotent handling to avoid duplicate error & avoid email disclosure)
    const { data: existing, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('[DATABASE NOTICE] Query existing subscriber error:', selectError)
    }

    if (existing) {
      if (!existing.is_active) {
        // Resubscribe previously unsubscribed user
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            unsubscribed_at: null,
            consent_recorded: true,
            consent_timestamp: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      }

      // PRIVACY DEFENSE: Do not disclose whether email was previously registered
      return NextResponse.json({
        success: true,
        message: 'You have been successfully subscribed to PrimeHomeKanpur property alerts!',
      })
    }

    // 4. Insert new verified subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
        is_active: true,
        consent_recorded: true,
        consent_timestamp: new Date().toISOString(),
        source,
      })

    if (insertError) {
      // If unique constraint race condition occurred, treat idempotently
      if (insertError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'You have been successfully subscribed to PrimeHomeKanpur property alerts!',
        })
      }

      console.error('[DATABASE ERROR] Failed to record subscriber:', insertError)
      return NextResponse.json(
        { error: 'Unable to process subscription at this time. Please try again.' },
        { status: 500 }
      )
    }

    // 5. Audit Logging (Zero secrets/PII logged)
    try {
      await supabase.from('activity_logs').insert({
        action: 'NEWSLETTER_SUBSCRIBED',
        entity: 'newsletter_subscribers',
        summary: `New subscription recorded from source: ${source}`,
        details: { source, ipMasked: ip.split('.').slice(0, 2).join('.') + '.x.x' },
      })
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json(
      {
        success: true,
        message: 'You have been successfully subscribed to PrimeHomeKanpur property alerts!',
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[SERVER ERROR] Newsletter subscription error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during subscription.' },
      { status: 500 }
    )
  }
}
