'use client'

import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Film,
  Image as ImageIcon
} from 'lucide-react'
import { PropertyImage } from '@/types'

interface PropertyMediaViewerProps {
  images?: PropertyImage[]
  videoUrl?: string | null
  title: string
  fallbackGradientClass?: string
}

export default function PropertyMediaViewer({
  images = [],
  videoUrl,
  title,
  fallbackGradientClass = 'p1',
}: PropertyMediaViewerProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos')
  const validImages = (images || [])
    .map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return {
          id: `img-${idx}`,
          property_id: '',
          image_url: img,
          is_primary: idx === 0,
          sort_order: idx,
          created_at: '',
        }
      }
      return img
    })
    .filter((img: any) => img && (img.image_url || typeof img === 'string'))

  const handlePrev = () => {
    if (validImages.length === 0) return
    setActiveImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    if (validImages.length === 0) return
    setActiveImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full">
      {/* Media Type Switcher if video exists */}
      {videoUrl && (
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'photos'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/5 text-text-secondary hover:text-white'
            }`}
          >
            <ImageIcon size={14} /> Photos ({validImages.length || 1})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/5 text-text-secondary hover:text-white'
            }`}
          >
            <Film size={14} /> Property Video
          </button>
        </div>
      )}

      {/* Media Container */}
      {activeTab === 'photos' ? (
        <div className="space-y-3">
          {/* Main Photo Display */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#140F2B] border border-white/10 group">
            {validImages.length > 0 ? (
              <img
                src={validImages[activeImageIndex]?.image_url}
                alt={`${title} - Photo ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full photo ${fallbackGradientClass} flex items-center justify-center`}>
                <span className="text-white/40 font-bold text-lg">{title}</span>
              </div>
            )}

            {/* Navigation Arrows (if >1 image) - Always visible on mobile, hover-revealed on desktop */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Fullscreen Button */}
            {validImages.length > 0 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 text-xs gap-1.5 transition-all"
              >
                <Maximize2 size={14} /> Fullscreen
              </button>
            )}

            {/* Photo Counter Badge */}
            {validImages.length > 1 && (
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/10">
                {activeImageIndex + 1} / {validImages.length}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {validImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {validImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-primary shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-102'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Video Player Section */
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-white/10">
          {videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be') ? (
            <iframe
              src={
                videoUrl.includes('watch?v=')
                  ? videoUrl.replace('watch?v=', 'embed/')
                  : videoUrl.replace('youtu.be/', 'youtube.com/embed/')
              }
              title={`${title} - Tour Video`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl || undefined}
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            >
              Your browser does not support HTML5 video.
            </video>
          )}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && validImages.length > 0 && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validImages[activeImageIndex]?.image_url}
              alt={title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white hover:bg-black/90 border border-white/20 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white hover:bg-black/90 border border-white/20 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div className="text-white text-sm font-semibold mt-4">
            {activeImageIndex + 1} / {validImages.length} — {title}
          </div>
        </div>
      )}
    </div>
  )
}
