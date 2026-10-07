import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
    const limit = rateLimit(`unsub-${ip}`, 5, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few moments.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = unsubscribeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to unsubscribe.' },
      { status: 500 }
    )
  }
}
