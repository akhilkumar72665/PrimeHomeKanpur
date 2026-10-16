export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  format?: string
  resource_type?: string
  bytes?: number
  width?: number
  height?: number
  duration?: number
}

export interface UploadOptions {
  folder?: string
  resourceType?: 'image' | 'video' | 'auto'
  onProgress?: (percent: number) => void
}

/**
 * Uploads a file (image or video) to Cloudinary.
 * Uses signed client-side upload for high performance and no size-limit bottlenecks.
 * Falls back to server upload route if needed.
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const folder = options.folder || 'primehomekanpur/properties'
  const isVideo = file.type.startsWith('video/')
  const resourceType = options.resourceType || (isVideo ? 'video' : 'image')

  // Step 1: Request signed upload params from our secure backend API
  let signData: {
    signature: string
    timestamp: number
    apiKey: string
    cloudName: string
    folder: string
  } | null = null

  try {
    const signRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder, resourceType }),
    })

    if (signRes.ok) {
      signData = await signRes.json()
    } else {
      const errJson = await signRes.json().catch(() => ({}))
      throw new Error(errJson.error || 'Failed to initialize upload signature')
    }
  } catch (signErr: any) {
    // If sign failed, check if unsigned preset is available as fallback
    const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (publicCloudName && uploadPreset) {
      return uploadUnsigned(file, publicCloudName, uploadPreset, folder, resourceType, options.onProgress)
    }

    // Try server-side fallback
    return uploadViaServerRoute(file, folder, resourceType, options.onProgress)
  }

  if (!signData) {
    throw new Error('Failed to retrieve Cloudinary upload signature.')
  }

  // Step 2: Perform direct signed upload to Cloudinary CDN
  const { signature, timestamp, apiKey, cloudName } = signData

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('folder', folder)

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    if (options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          options.onProgress?.(percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve({
            secure_url: response.secure_url,
            public_id: response.public_id,
            format: response.format,
            resource_type: response.resource_type,
            bytes: response.bytes,
            width: response.width,
            height: response.height,
            duration: response.duration,
          })
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'))
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText)
          reject(new Error(errRes.error?.message || `Cloudinary upload failed (status ${xhr.status})`))
        } catch {
          reject(new Error(`Upload failed with HTTP status ${xhr.status}`))
        }
      }
    }

    xhr.onerror = () => {
      // Fallback to server route if direct browser upload had a network error
      uploadViaServerRoute(file, folder, resourceType, options.onProgress)
        .then(resolve)
        .catch(reject)
    }

    xhr.send(formData)
  })
}

/**
 * Fallback: Upload via server-side API route (/api/cloudinary/upload)
 */
async function uploadViaServerRoute(
  file: File,
  folder: string,
  resourceType: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  onProgress?.(25)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  formData.append('resourceType', resourceType)

  const res = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: formData,
  })

  onProgress?.(75)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Server upload failed')
  }

  const data = await res.json()
  onProgress?.(100)
  return {
    secure_url: data.url,
    public_id: data.publicId,
    format: data.format,
    resource_type: data.resourceType,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    duration: data.duration,
  }
}

/**
 * Fallback: Upload unsigned using Cloudinary upload preset
 */
function uploadUnsigned(
  file: File,
  cloudName: string,
  preset: string,
  folder: string,
  resourceType: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)
  formData.append('folder', folder)

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
          format: response.format,
          resource_type: response.resource_type,
          bytes: response.bytes,
        })
      } else {
        const errRes = JSON.parse(xhr.responseText || '{}')
        reject(new Error(errRes.error?.message || 'Unsigned upload failed.'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during unsigned upload.'))
    xhr.send(formData)
  })
}
