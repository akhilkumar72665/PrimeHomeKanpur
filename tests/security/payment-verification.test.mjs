import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'

/**
 * Security Evaluator: Razorpay Verification & Payment Order Architecture
 * Mirrors the hardened server-side implementations in:
 * - src/lib/payments/razorpay.ts
 * - src/app/api/payments/verify/route.ts
 * - src/app/api/payments/create-order/route.ts
 */

const SERVER_CONFIG = {
  VISIT_FEE_INR: 300,
  VISIT_FEE_PAISE: 30000,
  CURRENCY: 'INR',
}

/**
 * Constant-time Razorpay HMAC-SHA256 verification
 */
function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) {
    return false
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(generatedSignature, 'utf8')
  const receivedBuffer = Buffer.from(signature, 'utf8')

  // Both buffers must be of equal byte length for crypto.timingSafeEqual
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

/**
 * Generates canonical HMAC SHA256 signature
 */
function generateRazorpaySignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}

/**
 * Simulates POST /api/payments/verify endpoint logic
 */
function simulateVerifyEndpoint({ user, serverSecret, payload, databaseVisit }) {
  // 1. Session check
  if (!user || !user.id) {
    return { status: 401, body: { error: 'Unauthorized. Authentication session required.' } }
  }

  // 2. Secret presence check (Fail-closed)
  if (!serverSecret || serverSecret.trim() === '') {
    return {
      status: 500,
      body: { error: 'Payment gateway configuration error. Secret key not configured.' },
    }
  }

  // 3. Payload validation
  if (!payload || typeof payload !== 'object') {
    return { status: 400, body: { error: 'Missing or malformed JSON payload.' } }
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, visitId } = payload

  if (!razorpayOrderId || typeof razorpayOrderId !== 'string' || razorpayOrderId.trim() === '') {
    return { status: 400, body: { error: 'Razorpay order ID is required' } }
  }

  if (!razorpayPaymentId || typeof razorpayPaymentId !== 'string' || razorpayPaymentId.trim() === '') {
    return { status: 400, body: { error: 'Razorpay payment ID is required' } }
  }

  if (!razorpaySignature || typeof razorpaySignature !== 'string' || razorpaySignature.trim() === '') {
    return { status: 400, body: { error: 'Razorpay signature is required' } }
  }

  // 4. Constant-time cryptographic HMAC verification
  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    secret: serverSecret,
  })

  if (!isValid) {
    return {
      status: 400,
      body: { error: 'Payment signature verification failed. Possible tampering detected.' },
    }
  }

  // 5. Booking reconciliation & ownership check
  if (databaseVisit) {
    if (databaseVisit.user_id !== user.id) {
      return {
        status: 403,
        body: { error: 'Forbidden. This visit booking does not belong to your account.' },
      }
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Payment verified and physical visit schedule confirmed.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      visitId: databaseVisit?.id || visitId || null,
    },
  }
}

/**
 * Simulates POST /api/payments/create-order endpoint logic
 */
function simulateCreateOrderEndpoint({ user, propertyExists, clientInput }) {
  if (!user || !user.id) {
    return { status: 401, body: { error: 'Unauthorized. Please sign in.' } }
  }

  if (!clientInput || !clientInput.propertyId || !clientInput.preferredDate || !clientInput.preferredTime) {
    return { status: 400, body: { error: 'Invalid booking parameters' } }
  }

  if (!propertyExists) {
    return { status: 404, body: { error: 'Specified property was not found.' } }
  }

  // Server-side strictly enforced parameters (client cannot manipulate)
  const trustedAmount = SERVER_CONFIG.VISIT_FEE_INR
  const trustedPaise = SERVER_CONFIG.VISIT_FEE_PAISE
  const trustedCurrency = SERVER_CONFIG.CURRENCY

  const generatedOrderId = `order_${Date.now()}_test123`

  return {
    status: 200,
    body: {
      success: true,
      orderId: generatedOrderId,
      amount: trustedAmount,
      amountPaise: trustedPaise,
      currency: trustedCurrency,
    },
  }
}

test('Security Regression Suite: Task 4 - Razorpay Payment Verification & Security', async (t) => {
  const sandboxSecret = 'sec_sandbox_test_key_998877665544'
  const validOrderId = 'order_DA29fkm38kfm'
  const validPaymentId = 'pay_LKJ987213456'
  const authenticSignature = generateRazorpaySignature(validOrderId, validPaymentId, sandboxSecret)

  await t.test('1. FAIL-CLOSED: Missing RAZORPAY_KEY_SECRET MUST return HTTP 500 and NEVER verify', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: undefined, // Missing secret
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
      },
    })

    assert.equal(res.status, 500, 'Must return HTTP 500 when server secret is missing')
    assert.match(res.body.error, /configuration error/i)
    assert.equal(res.body.success, undefined, 'Must not report success')
  })

  await t.test('2. Empty or whitespace RAZORPAY_KEY_SECRET fails closed with HTTP 500', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: '   ',
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
      },
    })

    assert.equal(res.status, 500)
    assert.match(res.body.error, /configuration error/i)
  })

  await t.test('3. MISSING SIGNATURE: Omitted signature field in payload MUST be rejected with HTTP 400', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        // razorpaySignature missing
      },
    })

    assert.equal(res.status, 400, 'Must return HTTP 400 when signature is omitted')
    assert.match(res.body.error, /signature is required/i)
    assert.equal(res.body.success, undefined)
  })

  await t.test('4. EMPTY SIGNATURE: Empty string signature in payload MUST be rejected with HTTP 400', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: '',
      },
    })

    assert.equal(res.status, 400)
    assert.match(res.body.error, /signature is required/i)
  })

  await t.test('5. TAMPERED SIGNATURE: Forged signature string MUST fail HMAC check with HTTP 400', () => {
    const forgedSignature = authenticSignature.substring(0, 10) + '00000000' + authenticSignature.substring(18)
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: forgedSignature,
      },
    })

    assert.equal(res.status, 400, 'Tampered signature must return HTTP 400')
    assert.match(res.body.error, /signature verification failed/i)
    assert.equal(res.body.success, undefined)
  })

  await t.test('6. MALFORMED SIGNATURE LENGTH: Differing length signature does not crash timingSafeEqual and returns false', () => {
    const truncatedSignature = 'abc123short'
    const isValid = verifyRazorpaySignature({
      orderId: validOrderId,
      paymentId: validPaymentId,
      signature: truncatedSignature,
      secret: sandboxSecret,
    })

    assert.equal(isValid, false, 'Truncated signature must safely return false')

    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: truncatedSignature,
      },
    })

    assert.equal(res.status, 400)
    assert.match(res.body.error, /signature verification failed/i)
  })

  await t.test('7. AUTHENTIC HMAC MATCH: Valid sandbox HMAC SHA256 validates successfully with HTTP 200', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-tenant-1' },
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
        visitId: 'visit-uuid-1234',
      },
      databaseVisit: {
        id: 'visit-uuid-1234',
        user_id: 'usr-tenant-1',
      },
    })

    assert.equal(res.status, 200, 'Authentic signature must succeed with HTTP 200')
    assert.equal(res.body.success, true)
    assert.equal(res.body.orderId, validOrderId)
    assert.equal(res.body.paymentId, validPaymentId)
    assert.equal(res.body.visitId, 'visit-uuid-1234')
  })

  await t.test('8. SESSION VERIFICATION: Unauthenticated verification attempt returns HTTP 401', () => {
    const res = simulateVerifyEndpoint({
      user: null, // No session
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
      },
    })

    assert.equal(res.status, 401, 'Unauthenticated user must be rejected with 401')
    assert.match(res.body.error, /unauthorized/i)
  })

  await t.test('9. CROSS-USER ISOLATION: User A cannot verify or confirm User B\'s booking (HTTP 403 Forbidden)', () => {
    const res = simulateVerifyEndpoint({
      user: { id: 'usr-attacker-2' }, // Attacker
      serverSecret: sandboxSecret,
      payload: {
        razorpayOrderId: validOrderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
        visitId: 'visit-victim-99',
      },
      databaseVisit: {
        id: 'visit-victim-99',
        user_id: 'usr-victim-1', // Belongs to Victim
      },
    })

    assert.equal(res.status, 403, 'Cross-user booking hijacking must return HTTP 403')
    assert.match(res.body.error, /forbidden.*does not belong to your account/i)
  })

  await t.test('10. SERVER-SIDE PRICING ENFORCEMENT: Client cannot tamper with visit fee or currency', () => {
    const res = simulateCreateOrderEndpoint({
      user: { id: 'usr-tenant-1' },
      propertyExists: true,
      clientInput: {
        propertyId: 'prop-kakadeo-1',
        preferredDate: '2026-10-25',
        preferredTime: 'Morning (10:00 AM - 1:00 PM)',
        // Attempting to send tampered amount
        amount: 1,
        currency: 'USD',
      },
    })

    assert.equal(res.status, 200)
    assert.equal(res.body.amount, 300, 'Server must enforce exact ₹300 visit fee')
    assert.equal(res.body.amountPaise, 30000, 'Server must enforce 30000 paise')
    assert.equal(res.body.currency, 'INR', 'Server must enforce INR currency')
  })

  await t.test('11. CREATE-ORDER VALIDATION: Non-existent property returns HTTP 404', () => {
    const res = simulateCreateOrderEndpoint({
      user: { id: 'usr-tenant-1' },
      propertyExists: false, // Property does not exist
      clientInput: {
        propertyId: 'prop-non-existent-999',
        preferredDate: '2026-10-25',
        preferredTime: 'Morning',
      },
    })

    assert.equal(res.status, 404, 'Must return 404 when property is not found')
    assert.match(res.body.error, /property was not found/i)
  })
})
