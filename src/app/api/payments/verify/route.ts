import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { verifyRazorpaySignature } from '@/lib/payments/razorpay'

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
  visitId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    // 1. Session verification: User session is strictly required
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Authentication session required to verify visit payment.' },
        { status: 401 }
      )
    }

    // 2. Secret presence verification: Fail closed if secret key is missing (never allow bypass)
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret || secret.trim() === '') {
      console.error(
        '[SECURITY ALERT] Payment verification rejected: RAZORPAY_KEY_SECRET is not configured on server.'
      )
      return NextResponse.json(
        { error: 'Payment gateway configuration error. Secret key not configured.' },
        { status: 500 }
      )
    }

    // 3. Payload parsing & validation
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Missing or malformed JSON payload.' },
        { status: 400 }
      )
    }

    const validation = verifySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid verification payload',
          details: validation.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, visitId } = validation.data

    // 4. Constant-time cryptographic HMAC SHA256 signature verification
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      secret,
    })

    if (!isValidSignature) {
      console.warn(
        `[SECURITY WARNING] Invalid payment signature detected for order ${razorpayOrderId} by user ${user.id}`
      )
      return NextResponse.json(
        { error: 'Payment signature verification failed. Possible tampering detected.' },
        { status: 400 }
      )
    }

    // 5. Database booking reconciliation & ownership enforcement
    let matchedVisitId: string | null = null

    try {
      let visitQuery = supabase
        .from('property_visits')
        .select('id, user_id, status, admin_note')

      if (visitId) {
        visitQuery = visitQuery.eq('id', visitId)
      } else {
        visitQuery = visitQuery.ilike('admin_note', `%${razorpayOrderId}%`)
      }

      const { data: matchedVisit } = await visitQuery.maybeSingle()

      if (matchedVisit) {
        // Enforce ownership: Prevent cross-user payment confirmation attacks
        if (matchedVisit.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Forbidden. This visit booking does not belong to your account.' },
            { status: 403 }
          )
        }

        matchedVisitId = matchedVisit.id

        // Mark visit as confirmed with payment transaction note
        const paymentDetails = `Payment Verified: ${razorpayPaymentId} · Order: ${razorpayOrderId} · Fee: ₹300`
        const updatedAdminNote = matchedVisit.admin_note
          ? `${matchedVisit.admin_note} | ${paymentDetails}`
          : paymentDetails

        await supabase
          .from('property_visits')
          .update({
            status: 'confirmed',
            admin_note: updatedAdminNote,
            updated_at: new Date().toISOString(),
          })
          .eq('id', matchedVisit.id)
      }
    } catch (dbErr) {
      console.error('[DATABASE ERROR] Failed to reconcile visit booking:', dbErr)
      // Continue to record activity log and return verified response if payment signature was authentic
    }

    // 6. Security Audit trail
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'user',
        action: 'PAYMENT_VERIFIED',
        entity: 'property_visits',
        entity_id: matchedVisitId || razorpayOrderId,
        metadata: {
          razorpayOrderId,
          razorpayPaymentId,
          amount: 300,
          currency: 'INR',
          verifiedAt: new Date().toISOString(),
        },
      })
    } catch {
      // Non-blocking activity log insert
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and physical visit schedule confirmed.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      visitId: matchedVisitId || visitId || null,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Payment verification encountered an unexpected error.' },
      { status: 500 }
    )
  }
}
