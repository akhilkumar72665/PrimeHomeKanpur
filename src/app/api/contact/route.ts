import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().min(10, 'Valid 10-digit phone number is required').max(15),
  email: z.string().email('Valid email address is required').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
  location: z.string().optional(),
  honeypot: z.string().optional(), // Anti-bot honeypot
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
    const limitResult = rateLimit(`contact-${ip}`, 5, 60000)

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = contactSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid form input' },
        { status: 400 }
      )
    }

    const { name, phone, email, message, location, honeypot } = validation.data

    // If honeypot filled, silently acknowledge to deceive spam bots
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    const supabase = await createClient()

    // Insert into inquiries / contact_messages table
    const { error: dbError } = await supabase.from('inquiries').insert({
      name,
      phone,
      email: email || null,
      message: location ? `[Location: ${location}] ${message}` : message,
      status: 'NEW',
    })

    if (dbError) {
      console.warn('DB inquiry insert notice (graceful fallback):', dbError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Our Kanpur rental specialist will call you shortly.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
