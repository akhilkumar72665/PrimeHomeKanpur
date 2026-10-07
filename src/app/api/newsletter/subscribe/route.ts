import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
    const limit = rateLimit(`newsletter-${ip}`, 5, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = subscribeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid email' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully subscribed to PrimeHomeKanpur property alerts!',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred during subscription.' },
      { status: 500 }
    )
  }
}
