import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCloudinarySignature, isCloudinaryConfigured } from '@/lib/cloudinary'

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

    const body = await request.json().catch(() => ({}))
    const folder = body.folder || 'primehomekanpur/properties'
    const resourceType = body.resourceType || 'image'

    const timestamp = Math.round(new Date().getTime() / 1000)
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY

    // Parameters to sign
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
    }

    const signature = generateCloudinarySignature(paramsToSign)

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      resourceType,
    })
  } catch (err: any) {
    console.error('Cloudinary sign route error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
