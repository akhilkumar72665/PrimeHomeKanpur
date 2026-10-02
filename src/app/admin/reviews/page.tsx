'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Review } from '@/types'
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquare,
  Clock3,
  Check,
  X,
  AlertCircle,
  Building
} from 'lucide-react'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setReviews(data as Review[])
        const notes: Record<string, string> = {}
        data.forEach((r: any) => {
          if (r.admin_note) notes[r.id] = r.admin_note
        })
        setAdminNotes(notes)
      } else {
        setReviews([])
      }
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handleUpdateStatus = async (
    reviewId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    setProcessingId(reviewId)
    const note = adminNotes[reviewId] || null

    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          status: newStatus,
          admin_note: note,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', reviewId)

      if (!error) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, status: newStatus, admin_note: note } : r
          )
        )
      }
    } catch (err) {
      console.error('Moderation error:', err)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return
    setProcessingId(reviewId)

    try {
      await supabase.from('reviews').delete().eq('id', reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredReviews = reviews.filter((r) => r.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star size={22} className="text-amber-400 fill-current" /> Reviews Moderation CMS
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Approve or reject tenant reviews before they appear on the public website
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-white/5 p-1 border border-white/5 max-w-md">
        {(['pending', 'approved', 'rejected'] as const).map((tab) => {
          const count = reviews.filter((r) => r.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all capitalize flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span>{tab}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-white font-bold">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading review queue...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">
            No {activeTab} reviews found
          </h3>
          <p className="text-xs text-text-muted">
            {activeTab === 'pending'
              ? 'All incoming reviews have been moderated!'
              : `No reviews currently marked as ${activeTab}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={s <= review.rating ? 'fill-amber-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {review.rating}.0 Stars
                  </span>
                  {review.title && (
                    <span className="text-xs font-semibold text-white">
                      · {review.title}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-text-muted">
                  Submitted on {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>

              {review.property && (
                <div className="text-xs text-accent-cyan flex items-center gap-1.5">
                  <Building size={13} />
                  <span>Property: {review.property.title}</span>
                </div>
              )}

              <p className="text-xs text-text-secondary leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                "{review.comment}"
              </p>

              {/* Admin Internal Note Input */}
              <div>
                <label className="block text-[11px] text-text-muted mb-1 font-medium">
                  Internal Moderator Note (Optional)
                </label>
                <input
                  type="text"
                  value={adminNotes[review.id] || ''}
                  onChange={(e) =>
                    setAdminNotes({ ...adminNotes, [review.id]: e.target.value })
                  }
                  placeholder="e.g. Verified tenant move-in, approved for public display"
                  className="w-full h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  disabled={processingId === review.id}
                  onClick={() => handleDeleteReview(review.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  <Trash2 size={14} /> Delete
                </button>

                <div className="flex items-center gap-2">
                  {review.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={processingId === review.id}
                      onClick={() => handleUpdateStatus(review.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
                    >
                      <X size={13} /> Reject
                    </button>
                  )}

                  {review.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={processingId === review.id}
                      onClick={() => handleUpdateStatus(review.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      <Check size={13} /> Approve & Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
