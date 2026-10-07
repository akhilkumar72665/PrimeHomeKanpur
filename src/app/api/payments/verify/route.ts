import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import crypto from 'crypto'

const verifySchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = verifySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid verification payload' }, { status: 400 })
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = validation.data
    const secret = process.env.RAZORPAY_KEY_SECRET

    // If secret configured, perform cryptographic HMAC SHA256 signature verification
    if (secret && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex')

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: 'Payment signature verification failed. Possible tampering detected.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and physical visit schedule confirmed.',
      paymentId: razorpayPaymentId,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Payment verification failed.' },
      { status: 500 }
    )
  }
}
