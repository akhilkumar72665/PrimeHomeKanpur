import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'
import { PAYMENT_CONFIG } from '@/lib/payments/razorpay'

const orderSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time slot is required'),
  message: z.string().optional(),
})

export async function POST(request: Request) {
  try {
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

    const ip = request.headers.get('x-forwarded-for') || user.id
    const limit = rateLimit(`order-${ip}`, 10, 60000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before creating new orders.' },
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

    const validation = orderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid booking parameters' },
        { status: 400 }
      )
    }

    const { propertyId, preferredDate, preferredTime, message } = validation.data

    // Verify property existence in database
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('id, title, status')
      .eq('id', propertyId)
      .maybeSingle()

    if (propErr || !property) {
      return NextResponse.json(
        { error: 'Specified property was not found.' },
        { status: 404 }
      )
    }

    // STRICT SERVER-SIDE ENFORCEMENT: Client can never manipulate visit fee or currency
    const amountInr = PAYMENT_CONFIG.VISIT_FEE_INR
    const amountPaise = PAYMENT_CONFIG.VISIT_FEE_PAISE
    const currency = PAYMENT_CONFIG.CURRENCY

    // Order reference generated server-side
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Razorpay credentials
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // If live/test Razorpay API credentials are provided, call Razorpay Orders API
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      try {
        const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify({
            amount: amountPaise,
            currency,
            receipt: `rcpt_${Date.now().toString(36)}`,
            notes: {
              property_id: propertyId,
              user_id: user.id,
            },
          }),
        })

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json()
          if (rzpData?.id) {
            orderId = rzpData.id
          }
        } else {
          console.warn('[PAYMENT] Razorpay Orders API returned non-200. Using internal order reference.')
        }
      } catch (networkErr) {
        console.warn('[PAYMENT] Razorpay Orders API network error. Using internal order reference:', networkErr)
      }
    }

    // Insert pending visit record associated with this order
    const { data: visit, error: visitErr } = await supabase
      .from('property_visits')
      .insert({
        user_id: user.id,
        property_id: propertyId,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || null,
        status: 'pending',
        admin_note: `Order ID: ${orderId} · Fee: ₹${amountInr} · Currency: ${currency}`,
      })
      .select('id')
      .single()

    if (visitErr) {
      console.error('[DATABASE ERROR] Failed to record visit booking:', visitErr)
      return NextResponse.json(
        { error: 'Failed to record visit booking in database.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId,
      visitId: visit.id,
      amount: amountInr,
      amountPaise,
      currency,
      keyId: keyId || 'rzp_test_placeholder',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to initialize visit order.' },
      { status: 500 }
    )
  }
}
