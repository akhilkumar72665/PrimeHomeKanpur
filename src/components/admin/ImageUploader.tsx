'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, ArrowLeft, ArrowRight, Image as ImageIcon, Star, AlertCircle } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  bucketName?: string
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  bucketName = 'property-images',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setErrorMessage(null)
    const currentCount = images.length
    if (currentCount + files.length > maxImages) {
      setErrorMessage(`You can only upload up to ${maxImages} images (currently ${currentCount}).`)
      return
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validation: Size <= 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the maximum allowed size of 5MB.`)
        continue
      }

      // Validation: format jpg/png/webp
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a valid format. Please upload JPG, PNG, or WEBP.`)
        continue
      }

      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `properties/${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (err: unknown) {
        console.error('Image upload failed:', err)
        setErrorMessage(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls])
    }

    setUploading(false)
    setUploadProgress(null)
    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    const updated = [...images]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border bg-[#150F30] ${
                idx === 0 ? 'border-primary ring-2 ring-primary/40' : 'border-white/10'
              }`}
            >
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

              {/* Cover Badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-[#04121a] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star size={10} className="fill-current" /> Cover Photo
                </div>
              )}

              {/* Controls on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'left')}
                    title="Move Left (Earlier)"
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft size={14} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove Image"
                  className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors shadow"
                >
                  <X size={14} />
                </button>

                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'right')}
                    title="Move Right (Later)"
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  >
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < maxImages && (
        <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 hover:border-primary/50 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={handleFileUpload}
            className="sr-only"
          />

          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {uploading ? (
              <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Upload size={22} />
            )}
          </div>

          <p className="text-sm font-semibold text-white mb-1">
            {uploading ? uploadProgress || 'Uploading...' : 'Click or Drag images to upload'}
          </p>
          <p className="text-xs text-text-muted">
            PNG, JPG, or WEBP up to 5MB each ({images.length}/{maxImages} uploaded)
          </p>
        </label>
      )}
    </div>
  )
}
