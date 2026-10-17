import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const reviewSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().max(500).optional().nullable(),
})

// POST: Admin audits and approves or rejects a verification document
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid document ID is required.' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Verify Admin authorization
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin =
      profile?.role === 'admin' ||
      profile?.role === 'super_admin' ||
      profile?.role === 'ADMIN'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. Only administrators can review verification documents.' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Missing review payload.' }, { status: 400 })
    }

    const validation = reviewSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid review data' },
        { status: 400 }
      )
    }

    const { status, rejectionReason } = validation.data

    const { data: updatedDoc, error: updateError } = await supabase
      .from('verification_documents')
      .update({
        status,
        rejection_reason: status === 'REJECTED' ? rejectionReason || 'Document did not meet verification criteria.' : null,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !updatedDoc) {
      console.error('[DATABASE ERROR] Failed to review document:', updateError)
      return NextResponse.json({ error: 'Failed to update document status.' }, { status: 500 })
    }

    // Record audit log
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'admin',
        action: 'DOCUMENT_REVIEWED',
        entity: 'verification_documents',
        entity_id: id,
        summary: `Document ${id} marked as ${status}`,
        details: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
        },
      })
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json({
      success: true,
      message: `Document status updated to ${status}.`,
      document: updatedDoc,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
