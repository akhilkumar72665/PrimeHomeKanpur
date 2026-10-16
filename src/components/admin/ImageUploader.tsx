'use client'

import React, { useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinaryUpload'
import {
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  Star,
  AlertCircle,
  Cloud,
  CheckCircle2,
} from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  folder?: string
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 12,
  folder = 'primehomekanpur/properties',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null)
  const [currentPercent, setCurrentPercent] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

      // Validation: Size <= 10MB
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the maximum allowed size of 10MB.`)
        continue
      }

      // Validation: format jpg/png/webp/avif
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif', 'image/heic']
      if (!validTypes.includes(file.type.toLowerCase())) {
        setErrorMessage(`"${file.name}" is not a supported format. Please upload JPG, PNG, WEBP, or AVIF.`)
        continue
      }

      setUploadProgressText(`Uploading ${i + 1} of ${files.length}...`)
      setCurrentPercent(0)

      try {
        const result = await uploadToCloudinary(file, {
          folder,
          resourceType: 'image',
          onProgress: (pct) => {
            setCurrentPercent(pct)
          },
        })

        if (result?.secure_url) {
          uploadedUrls.push(result.secure_url)
        }
      } catch (err: unknown) {
        console.error('Cloudinary image upload failed:', err)
        setErrorMessage(
          `Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls])
    }

    setUploading(false)
    setUploadProgressText(null)
    setCurrentPercent(0)
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

  const handleSetPrimary = (index: number) => {
    if (index === 0) return
    const updated = [...images]
    const [selected] = updated.splice(index, 1)
    updated.unshift(selected)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Property Photos ({images.length}/{maxImages})
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-semibold">
            <Cloud size={10} /> Cloudinary CDN
          </span>
        </div>
        <span className="text-[11px] text-text-muted">
          First photo is used as Cover Photo
        </span>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
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
                idx === 0 ? 'border-primary ring-2 ring-primary/40 shadow-lg' : 'border-white/10'
              }`}
            >
              <img
                src={url}
                alt={`Property photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Cover Badge */}
              {idx === 0 ? (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-[#04121a] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star size={10} className="fill-current" /> Cover Photo
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  title="Make Cover Photo"
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 hover:bg-primary hover:text-black text-white text-[10px] font-medium transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                >
                  <Star size={10} /> Set Cover
                </button>
              )}

              {/* Controls on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'left')}
                    title="Move Left"
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
                    title="Move Right"
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
        <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-white/15 hover:border-primary/60 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
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
            {uploading
              ? `${uploadProgressText || 'Uploading to Cloudinary...'} ${currentPercent}%`
              : 'Click or Drag photos to upload to Cloudinary'}
          </p>

          {uploading && (
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-200"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
          )}

          <p className="text-xs text-text-muted mt-1">
            JPEG, PNG, WEBP, or AVIF up to 10MB each ({images.length}/{maxImages} uploaded)
          </p>
        </label>
      )}
    </div>
  )
}
