import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: Generate short-lived signed URL for private document download
export async function GET(request: Request, { params }: RouteParams) {
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
        { error: 'Unauthorized. Please sign in to access documents.' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin =
      profile?.role === 'admin' ||
      profile?.role === 'super_admin' ||
      profile?.role === 'ADMIN'

    // Fetch document record
    const { data: doc, error } = await supabase
      .from('verification_documents')
      .select('id, user_id, storage_path, file_name, status')
      .eq('id', id)
      .maybeSingle()

    if (error || !doc) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
    }

    // Ownership & Authorization verification: caller must be document owner OR admin
    if (doc.user_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to access this document.' },
        { status: 403 }
      )
    }

    // Generate short-lived signed URL (expires in 60 seconds)
    const { data: signedData, error: signError } = await supabase.storage
      .from('property-documents')
      .createSignedUrl(doc.storage_path, 60)

    if (signError || !signedData?.signedUrl) {
      console.error('[STORAGE ERROR] Failed to create signed URL')
      return NextResponse.json(
        { error: 'Failed to generate secure document access link.' },
        { status: 500 }
      )
    }

    // STRICT PRIVACY: NEVER log the signed URL or contents!
    return NextResponse.json({
      success: true,
      fileName: doc.file_name,
      signedUrl: signedData.signedUrl,
      expiresInSeconds: 60,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
