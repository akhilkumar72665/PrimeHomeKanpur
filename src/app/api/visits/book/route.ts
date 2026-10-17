import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

export const ALLOWED_TIME_SLOTS = [
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (1:00 PM - 4:00 PM)',
  'Evening (4:00 PM - 7:00 PM)',
] as const

const bookVisitSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date in YYYY-MM-DD format is required'),
  preferredTime: z.enum(ALLOWED_TIME_SLOTS, {
    message: 'Please select an authorized time slot.',
  }),
  message: z
    .string()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
    .nullable(),
})

export async function POST(request: Request) {
  try {
    // 1. Session verification: User must be signed in
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to schedule a property visit.' },
        { status: 401 }
      )
    }

    // 2. Rate limiting: Prevent bot visit flooding
    const ip = request.headers.get('x-forwarded-for') || user.id
    const limit = rateLimit(`book-visit-${user.id}`, 6, 60000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before scheduling another visit.' },
        { status: 429 }
      )
    }

    // 3. Payload validation
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Missing or malformed JSON payload.' },
        { status: 400 }
      )
    }

    const validation = bookVisitSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid booking parameters' },
        { status: 400 }
      )
    }

    const { propertyId, preferredDate, preferredTime, message } = validation.data

    // 4. Server-Side Date Constraints (Must be tomorrow or later, max 30 days ahead)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const visitDate = new Date(preferredDate + 'T00:00:00')

    if (isNaN(visitDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid visit date specified.' },
        { status: 400 }
      )
    }

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (visitDate < tomorrow) {
      return NextResponse.json(
        { error: 'Visit date must be scheduled at least 1 day in advance.' },
        { status: 400 }
      )
    }

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 30)

    if (visitDate > maxDate) {
      return NextResponse.json(
        { error: 'Visits cannot be scheduled more than 30 days in advance.' },
        { status: 400 }
      )
    }

    // 5. Property Availability Check
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('id, title, status, address')
      .eq('id', propertyId)
      .maybeSingle()

    if (propErr || !property) {
      return NextResponse.json(
        { error: 'Specified property was not found.' },
        { status: 404 }
      )
    }

    if (property.status === 'RENTED' || property.status === 'INACTIVE' || property.status === 'HIDDEN') {
      return NextResponse.json(
        {
          error: `This property is currently ${property.status.toLowerCase()} and is not accepting visit requests.`,
        },
        { status: 400 }
      )
    }

    // 6. Duplicate Booking Prevention (Active booking for same property and date)
    const { data: existingBooking } = await supabase
      .from('property_visits')
      .select('id, preferred_date, preferred_time, status')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed'])
      .eq('preferred_date', preferredDate)
      .maybeSingle()

    if (existingBooking) {
      return NextResponse.json(
        {
          error: `You already have an active visit booking (${existingBooking.status}) scheduled for this property on ${preferredDate}.`,
        },
        { status: 409 }
      )
    }

    // 7. Honest Database Persistence (Pay on physical visit - No fake payment records)
    const adminNote = 'Physical Visit Booking · ₹300 visit fee payable on-site to field agent during physical walkthrough (Free Online Reservation)'

    const { data: visit, error: insertErr } = await supabase
      .from('property_visits')
      .insert({
        user_id: user.id,
        property_id: propertyId,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message?.trim() || null,
        status: 'pending',
        admin_note: adminNote,
      })
      .select('id, status, preferred_date, preferred_time')
      .single()

    if (insertErr) {
      console.error('[DATABASE ERROR] Failed to persist visit booking:', insertErr)
      return NextResponse.json(
        { error: 'Failed to record visit reservation in database.' },
        { status: 500 }
      )
    }

    // 8. Audit Logging
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'user',
        action: 'VISIT_BOOKED',
        entity: 'property_visits',
        entity_id: visit.id,
        metadata: {
          propertyId,
          propertyTitle: property.title,
          preferredDate,
          preferredTime,
          paymentModel: 'PAY_ON_VISIT',
          feeAmount: 300,
          currency: 'INR',
        },
      })
    } catch {
      // Non-blocking activity log
    }

    return NextResponse.json({
      success: true,
      visitId: visit.id,
      status: visit.status,
      paymentModel: 'PAY_ON_VISIT',
      feeAmount: 300,
      currency: 'INR',
      message: 'Visit request submitted successfully. ₹300 fee is payable upon physical tour.',
      details: {
        propertyTitle: property.title,
        propertyAddress: property.address,
        preferredDate: visit.preferred_date,
        preferredTime: visit.preferred_time,
      },
    })
  } catch (err: any) {
    console.error('[SERVER ERROR] Visit booking error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while scheduling your visit.' },
      { status: 500 }
    )
  }
}
