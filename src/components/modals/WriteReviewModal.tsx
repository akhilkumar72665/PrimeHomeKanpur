'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Property } from '@/types'
import { X, Star, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

interface WriteReviewModalProps {
  property?: Property
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function WriteReviewModal({ property, isOpen, onClose, onSuccess }: WriteReviewModalProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isAuthenticated) {
      onClose()
      openAuthModal('Please sign in to submit a review.')
      return
    }

    if (!comment.trim()) {
      setErrorMsg('Please enter your review comments.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user!.id,
          property_id: property?.id || null,
          rating,
          title: title || null,
          comment: comment.trim(),
          status: 'pending',
        })

      setLoading(false)

      if (error) {
        setErrorMsg(error.message || 'Failed to submit review.')
      } else {
        setSuccess(true)
        if (onSuccess) onSuccess()
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || 'An error occurred while submitting review.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-8 shadow-2xl shadow-purple-950/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto mb-6">
              Thank you for sharing your feedback. Your review is currently in moderation and will appear publicly once approved.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                onClose()
              }}
              className="btn btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan uppercase tracking-wider mb-1">
                <Star size={14} className="fill-current" /> Share Your Experience
              </div>
              <h3 className="text-xl font-bold text-white">
                {property ? `Review for ${property.title}` : 'Write a Testimonial'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Help other tenants and landlords in Kanpur make verified decisions
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 hover:scale-115 transition-transform"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={24}
                        className={
                          (hoverRating ? star <= hoverRating : star <= rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-white ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smooth moving process, transparent pricing"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Detailed Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the property condition, landlord interaction, area, and PrimeHomeKanpur's support..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Moderation Workflow Note */}
              <div className="rounded-xl bg-blue-950/40 border border-blue-800/30 p-3 text-xs text-text-secondary flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">Moderation Notice:</span> To ensure authenticity, submissions undergo admin review before appearing on the public website.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 mt-2"
              >
                {loading ? 'Submitting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
