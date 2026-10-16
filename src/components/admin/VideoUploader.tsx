'use client'

import React, { useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinaryUpload'
import {
  Film,
  Upload,
  X,
  AlertCircle,
  Cloud,
  CheckCircle2,
  Play,
  Link as LinkIcon,
} from 'lucide-react'

interface VideoUploaderProps {
  videoUrl: string | null
  onChange: (url: string) => void
  folder?: string
}

export function VideoUploader({
  videoUrl,
  onChange,
  folder = 'primehomekanpur/property-videos',
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>('upload')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)

    // Validation: Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('Video file must be less than 100MB.')
      return
    }

    // Validation: Video types
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']
    if (!allowed.includes(file.type.toLowerCase())) {
      setErrorMessage('Please upload a valid video file (MP4, WebM, or MOV).')
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const result = await uploadToCloudinary(file, {
        folder,
        resourceType: 'video',
        onProgress: (pct) => setProgress(pct),
      })

      if (result?.secure_url) {
        onChange(result.secure_url)
      } else {
        throw new Error('Video upload did not return a valid URL')
      }
    } catch (err: unknown) {
      console.error('Cloudinary video upload failed:', err)
      setErrorMessage(
        `Video upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    } finally {
      setUploading(false)
      setProgress(0)
      e.target.value = ''
    }
  }

  const handleApplyUrl = () => {
    const trimmed = inputUrl.trim()
    if (!trimmed) return
    onChange(trimmed)
    setInputUrl('')
  }

  const isYouTube =
    videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Property Walkthrough Video
          </label>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-semibold">
            <Cloud size={10} /> Cloudinary Video
          </span>
        </div>

        {/* Mode selector */}
        {!videoUrl && (
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-1 rounded-md transition-all ${
                mode === 'upload'
                  ? 'bg-primary text-[#04121a] font-bold shadow'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-1 rounded-md transition-all ${
                mode === 'url'
                  ? 'bg-primary text-[#04121a] font-bold shadow'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Paste URL
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Video Preview if attached */}
      {videoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/70 p-2.5 group">
          {isYouTube ? (
            <div className="p-4 flex items-center justify-between bg-white/[0.03] rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Play size={20} className="fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">YouTube Walkthrough Attached</p>
                  <p className="text-[11px] text-text-muted truncate max-w-sm sm:max-w-md">{videoUrl}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-56 rounded-xl object-contain bg-black"
                preload="metadata"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-cyan-300 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} className="text-emerald-400" /> Cloudinary Stream Ready
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-4 right-4 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-rose-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg border border-white/10"
          >
            <X size={14} /> Remove Video
          </button>
        </div>
      ) : mode === 'upload' ? (
        /* Video Upload Dropzone */
        <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 hover:border-primary/60 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group">
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            disabled={uploading}
            onChange={handleFileUpload}
            className="sr-only"
          />

          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            {uploading ? (
              <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Film size={20} />
            )}
          </div>

          <p className="text-sm font-semibold text-white mb-0.5">
            {uploading ? `Uploading Video to Cloudinary... ${progress}%` : 'Upload Property Walkthrough Video'}
          </p>

          {uploading && (
            <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden my-2">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <p className="text-xs text-text-muted">
            MP4, WebM or MOV up to 100MB • Stored and streamed via Cloudinary
          </p>
        </label>
      ) : (
        /* Direct URL input */
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <LinkIcon size={16} />
            </div>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or direct MP4 URL"
              style={{ paddingLeft: '2.5rem' }}
              className="w-full h-11 pr-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 h-11 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-xs transition-all shrink-0"
          >
            Attach URL
          </button>
        </div>
      )}
    </div>
  )
}
