import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const orderSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time slot is required'),
  message: z.string().optional(),
})

// STRICT SERVER-SIDE ENFORCEMENT: Client can never manipulate visit fee
const VISIT_FEE_INR = 300
const VISIT_FEE_PAISE = VISIT_FEE_INR * 100

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

    const body = await request.json()
    const validation = orderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid booking parameters' },
        { status: 400 }
      )
    }

    const { propertyId, preferredDate, preferredTime, message } = validation.data

    // Order reference generated server-side
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Insert pending visit record
    await supabase.from('property_visits').insert({
      user_id: user.id,
      property_id: propertyId,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: message || null,
      status: 'pending',
      admin_note: `Order ID: ${orderId} · Fee: ₹${VISIT_FEE_INR}`,
    })

    return NextResponse.json({
      success: true,
      orderId,
      amount: VISIT_FEE_INR,
      amountPaise: VISIT_FEE_PAISE,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to initialize visit order.' },
      { status: 500 }
    )
  }
}
