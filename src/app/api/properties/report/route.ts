import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const reportSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  propertySlug: z.string().min(1, 'Property slug is required'),
  reason: z.enum([
    'Property unavailable',
    'Incorrect rent',
    'Incorrect photos',
    'Incorrect information',
    'Suspicious listing',
    'Already rented',
    'Other',
  ]),
  details: z.string().min(5, 'Please provide details for your report').max(1000),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
    const limit = rateLimit(`report-${ip}`, 5, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many report submissions. Please wait a moment.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = reportSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid report payload' },
        { status: 400 }
      )
    }

    const { propertyId, propertySlug, reason, details } = validation.data
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Log activity
    await supabase.from('activity_logs').insert({
      actor_id: user?.id || null,
      actor_email: user?.email || 'Anonymous Community User',
      action: 'LISTING_REPORTED',
      entity: 'property',
      entity_id: propertyId,
      summary: `Property reported: ${reason}`,
      details: {
        propertySlug,
        reason,
        details,
        reporterId: user?.id || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you. Our moderation team has received your report and will investigate promptly.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to submit report.' },
      { status: 500 }
    )
  }
}
