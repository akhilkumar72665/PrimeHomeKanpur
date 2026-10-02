'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Review } from '@/types'
import WriteReviewModal from '@/components/modals/WriteReviewModal'
import {
  Star,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react'

export default function MyReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const supabase = createClient()

  const loadReviews = async () => {
    if (!user?.id) return
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setReviews(data as Review[])
      } else {
        setReviews([])
      }
    } catch (err) {
      console.error('Failed to load reviews:', err)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [user?.id])

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 size={11} /> Published on Website
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock3 size={11} /> In Admin Review
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle size={11} /> Not Approved
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star size={20} className="text-amber-400 fill-current" /> My Reviews & Testimonials
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            View the moderation status of feedback and property reviews you have submitted
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl self-start sm:self-auto shadow-md"
        >
          <Plus size={14} /> Write New Review
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading your reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Star size={30} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">You haven't submitted any reviews yet</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
            Share your experience renting or visiting homes through PrimeHomeKanpur. Reviews appear on the site once approved by our team.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-900/30"
          >
            <Plus size={15} /> Write a Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= review.rating ? 'fill-amber-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {review.rating}.0
                  </span>
                  {review.title && (
                    <span className="text-xs font-semibold text-white truncate max-w-xs">
                      · {review.title}
                    </span>
                  )}
                </div>

                <div>{getStatusBadge(review.status)}</div>
              </div>

              {review.property && (
                <div className="text-xs text-text-muted flex items-center gap-1.5">
                  <Building size={13} className="text-accent-cyan" />
                  <span>Property: {review.property.title}</span>
                </div>
              )}

              <p className="text-sm text-text-secondary leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                "{review.comment}"
              </p>

              {review.admin_note && (
                <p className="text-xs text-accent-cyan pt-1">
                  <span className="font-semibold text-white">Moderator Note:</span> {review.admin_note}
                </p>
              )}

              <div className="text-[11px] text-text-muted pt-1">
                Submitted on {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          loadReviews()
        }}
      />
    </div>
  )
}
