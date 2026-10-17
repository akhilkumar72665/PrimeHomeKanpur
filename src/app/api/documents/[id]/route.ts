import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE: Remove a verification document from storage vault and database
export async function DELETE(request: Request, { params }: RouteParams) {
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

    // Check if caller is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin =
      profile?.role === 'admin' ||
      profile?.role === 'super_admin' ||
      profile?.role === 'ADMIN'

    // Fetch document
    const { data: doc, error } = await supabase
      .from('verification_documents')
      .select('id, user_id, storage_path, status, title')
      .eq('id', id)
      .maybeSingle()

    if (error || !doc) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
    }

    // Permission check: owner or admin
    if (doc.user_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete this document.' },
        { status: 403 }
      )
    }

    // If tenant/landlord owner is deleting, prohibit deletion if document is already verified (compliance/audit lock)
    if (doc.user_id === user.id && !isAdmin && doc.status === 'VERIFIED') {
      return NextResponse.json(
        { error: 'Verified documents cannot be deleted directly. Please contact support.' },
        { status: 400 }
      )
    }

    // 1. Delete from Supabase Storage
    await supabase.storage.from('property-documents').remove([doc.storage_path])

    // 2. Delete from database
    const { error: deleteError } = await supabase
      .from('verification_documents')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('[DATABASE ERROR] Failed to delete document record:', deleteError)
      return NextResponse.json({ error: 'Failed to delete document record.' }, { status: 500 })
    }

    // 3. Record audit log
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'user',
        action: 'DOCUMENT_DELETED',
        entity: 'verification_documents',
        entity_id: id,
        summary: `Document deleted: ${doc.title}`,
      })
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully from secure storage.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
