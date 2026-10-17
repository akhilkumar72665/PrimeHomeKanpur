import crypto from 'crypto'

export const PAYMENT_CONFIG = {
  VISIT_FEE_INR: 300,
  VISIT_FEE_PAISE: 30000,
  CURRENCY: 'INR',
} as const

export interface RazorpaySignatureVerificationParams {
  orderId: string
  paymentId: string
  signature: string
  secret: string
}

/**
 * Validates a Razorpay payment signature using HMAC-SHA256 with timing-safe comparison.
 *
 * Security guarantees:
 * 1. Fails closed: Missing parameters return false immediately.
 * 2. Constant-time comparison: Uses crypto.timingSafeEqual to prevent side-channel timing attacks.
 * 3. Safe buffer length comparison: Avoids RangeError exception when signature length differs.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: RazorpaySignatureVerificationParams): boolean {
  if (!orderId || !paymentId || !signature || !secret) {
    return false
  }

  // Generate canonical HMAC SHA256 digest
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(generatedSignature, 'utf8')
  const receivedBuffer = Buffer.from(signature, 'utf8')

  // Both buffers MUST be of equal length for crypto.timingSafeEqual
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

/**
 * Generates an HMAC-SHA256 signature for Razorpay verification (used for testing and webhook validation)
 */
export function generateRazorpaySignature(orderId: string, paymentId: string, secret: string): string {
  if (!orderId || !paymentId || !secret) {
    throw new Error('orderId, paymentId, and secret are required to generate signature')
  }
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}
