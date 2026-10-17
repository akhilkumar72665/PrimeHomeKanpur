import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import {
  MAX_DOCUMENT_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
  validateDocumentMagicBytes,
  sanitizeDocumentFileName,
} from '@/lib/documents'
import path from 'path'

const VALID_DOC_TYPES = [
  'IDENTITY_PROOF',
  'ADDRESS_PROOF',
  'EMPLOYMENT_PROOF',
  'OWNERSHIP_PROOF',
  'ELECTRICITY_BILL',
  'TAX_RECEIPT',
  'OTHER',
]

// GET: Retrieve authenticated user's documents (or all if authorized admin)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view documents.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope')

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

    let query = supabase
      .from('verification_documents')
      .select(`
        *,
        property:properties(id, title, slug)
      `)
      .order('created_at', { ascending: false })

    if (scope === 'all' && isAdmin) {
      // Admin viewing all documents
    } else {
      // Standard caller viewing only their own documents
      query = query.eq('user_id', user.id)
    }

    const { data: docs, error } = await query

    if (error) {
      console.error('[DATABASE ERROR] Failed to fetch documents:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve documents.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      documents: docs || [],
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

// POST: Securely upload private verification document
export async function POST(request: Request) {
  try {
    // 1. Session verification
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to upload documents.' },
        { status: 401 }
      )
    }

    // 2. Rate limiting: max 10 uploads per hour per user
    const limit = rateLimit(`doc-upload-${user.id}`, 10, 3600000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // 3. Parse Multipart Form Data
    const formData = await request.formData().catch(() => null)
    if (!formData) {
      return NextResponse.json(
        { error: 'Invalid form data payload.' },
        { status: 400 }
      )
    }

    const file = formData.get('file') as File | null
    const documentType = formData.get('documentType') as string | null
    const title = (formData.get('title') as string | null)?.trim()
    const propertyId = formData.get('propertyId') as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'A valid document file is required.' },
        { status: 400 }
      )
    }

    if (!documentType || !VALID_DOC_TYPES.includes(documentType)) {
      return NextResponse.json(
        { error: 'A valid document type must be specified.' },
        { status: 400 }
      )
    }

    if (!title || title.length < 3 || title.length > 120) {
      return NextResponse.json(
        { error: 'Document title must be between 3 and 120 characters.' },
        { status: 400 }
      )
    }

    // 4. File Size Enforcement (10MB)
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 10MB.' },
        { status: 400 }
      )
    }

    // 5. File Extension Enforcement
    const originalExt = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(originalExt as any)) {
      return NextResponse.json(
        { error: 'Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      )
    }

    // 6. Magic Bytes Verification (Defend against MIME-spoofing)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const magicValidation = validateDocumentMagicBytes(buffer)

    if (!magicValidation.valid || !magicValidation.detectedMime) {
      return NextResponse.json(
        { error: magicValidation.error || 'Invalid file binary format.' },
        { status: 400 }
      )
    }

    // 7. Safe Filename Sanitization and Folder Isolation
    const safeName = sanitizeDocumentFileName(file.name)
    const storagePath = `${user.id}/${Date.now()}-${safeName}`

    // 8. Upload to Private Supabase Storage Bucket ('property-documents')
    const { error: uploadError } = await supabase.storage
      .from('property-documents')
      .upload(storagePath, buffer, {
        contentType: magicValidation.detectedMime,
        upsert: false,
      })

    if (uploadError) {
      console.error('[STORAGE ERROR] Failed to upload document buffer:', uploadError)
      return NextResponse.json(
        { error: 'Failed to store document in secure vault.' },
        { status: 500 }
      )
    }

    // 9. Persist Document Record (Strictly forced status: 'PENDING_REVIEW')
    const { data: newDoc, error: insertError } = await supabase
      .from('verification_documents')
      .insert({
        user_id: user.id, // Strictly derived from session
        property_id: propertyId || null,
        document_type: documentType,
        title,
        file_name: safeName,
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: magicValidation.detectedMime,
        status: 'PENDING_REVIEW', // Client cannot self-approve!
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('[DATABASE ERROR] Failed to record verification document:', insertError)
      // Rollback orphaned storage object
      await supabase.storage.from('property-documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to record document metadata.' },
        { status: 500 }
      )
    }

    // 10. Audit Logging (Zero sensitive PII logged)
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'user',
        action: 'DOCUMENT_UPLOADED',
        entity: 'verification_documents',
        entity_id: newDoc.id,
        summary: `Document uploaded: ${title} (${documentType})`,
        details: {
          documentType,
          fileSize: file.size,
          mimeType: magicValidation.detectedMime,
        },
      })
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Document securely uploaded for verification.',
        document: newDoc,
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[SERVER ERROR] Document upload exception:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during upload.' },
      { status: 500 }
    )
  }
}
