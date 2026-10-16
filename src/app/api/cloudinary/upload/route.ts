import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to upload media.' },
        { status: 401 }
      )
    }

    // 2. Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            'Cloudinary is not fully configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.',
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'primehomekanpur/properties'
    const resourceType =
      (formData.get('resourceType') as 'image' | 'video' | 'raw' | 'auto') || 'auto'

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await uploadBufferToCloudinary(buffer, {
      folder,
      resource_type: resourceType,
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
    })
  } catch (err: any) {
    console.error('Cloudinary upload route error:', err)
    return NextResponse.json(
      { error: err.message || 'Server upload failed' },
      { status: 500 }
    )
  }
}
