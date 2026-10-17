import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary server-side instance (server-only)
if (typeof window === 'undefined') {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export { cloudinary }

/**
 * Checks if the minimal required Cloudinary credentials are configured.
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  return Boolean(cloudName && apiKey && apiSecret)
}

/**
 * Generates signature for secure client-side direct uploads.
 * This avoids routing large image/video payloads through Next.js server limits.
 * STRICT SECURITY: Throws if called on client.
 */
export function generateCloudinarySignature(params: Record<string, any>) {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Cloudinary signing cannot be executed in the browser context.')
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET is not configured in server environment variables.')
  }

  const signature = cloudinary.utils.api_sign_request(params, apiSecret)
  return signature
}

/**
 * Uploads a file buffer directly to Cloudinary (for server-side operations).
 * STRICT SECURITY: Throws if called on client.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    public_id?: string
  } = {}
): Promise<{
  secure_url: string
  public_id: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  duration?: number
}> {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Direct buffer upload cannot be executed in the browser context.')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'primehomekanpur/properties',
        resource_type: options.resource_type || 'auto',
        public_id: options.public_id,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration,
          })
        } else {
          reject(new Error('Cloudinary upload returned empty response'))
        }
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Deletes a Cloudinary asset by public_id.
 * STRICT SECURITY: Throws if called on client.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
) {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Cloudinary asset deletion cannot be executed in the browser context.')
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  })
}

/**
 * Utility to generate an auto-optimized, auto-formatted Cloudinary image URL.
 */
export function getOptimizedCloudinaryUrl(
  urlOrPublicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
  } = {}
): string {
  if (!urlOrPublicId) return ''

  // If already a full URL
  if (urlOrPublicId.startsWith('http')) {
    if (urlOrPublicId.includes('res.cloudinary.com')) {
      const parts = urlOrPublicId.split('/upload/')
      if (parts.length === 2) {
        const transforms = [
          'f_auto',
          'q_auto',
          options.width ? `w_${options.width}` : '',
          options.height ? `h_${options.height}` : '',
          options.crop ? `c_${options.crop}` : '',
        ]
          .filter(Boolean)
          .join(',')

        return `${parts[0]}/upload/${transforms}/${parts[1]}`
      }
    }
    return urlOrPublicId
  }

  // If public_id
  return cloudinary.url(urlOrPublicId, {
    fetch_format: 'auto',
    quality: 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'limit',
    secure: true,
  })
}
