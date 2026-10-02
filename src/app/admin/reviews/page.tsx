'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { AdminReview } from '@/types/admin'
import {
  Star,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  MessageSquare,
  Filter,
} from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export default function AdminReviewsPage() {
  const { user, can } = useAuth()
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<AdminReview | null>(null)
  const [editComment, setEditComment] = useState('')
  const [editNote, setEditNote] = useState('')

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<AdminReview | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const supabase = createClient()

  const loadReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews((data as AdminReview[]) || [])
    } catch (err: unknown) {
      console.error('Error loading reviews:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const filteredReviews = useMemo(() => {
    if (currentTab === 'ALL') return reviews
    return reviews.filter((r) => r.status === currentTab)
  }, [reviews, currentTab])

  const pendingCount = useMemo(() => reviews.filter((r) => r.status === 'PENDING').length, [reviews])

  const handleApprove = async (rev: AdminReview) => {
    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('reviews')
        .update({
          status: 'APPROVED',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', rev.id)

      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'APPROVE',
        entity: 'review',
        entity_id: rev.id,
        summary: `Approved review by ${rev.reviewer_name || 'Anonymous'} for ${rev.property?.title || 'Property'}`,
      })

      setSuccessMessage('Review approved and published to public property page.')
      loadReviews()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error approving review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectTarget) return

    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('reviews')
        .update({
          status: 'REJECTED',
          moderation_note: rejectNote.trim() || 'Rejected by moderator',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', rejectTarget.id)

      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'REJECT',
        entity: 'review',
        entity_id: rejectTarget.id,
        summary: `Rejected review by ${rejectTarget.reviewer_name || 'Anonymous'}: ${rejectNote}`,
      })

      setSuccessMessage('Review rejected.')
      setRejectModalOpen(false)
      setRejectTarget(null)
      setRejectNote('')
      loadReviews()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error rejecting review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview) return

    try {
      setSubmitting(true)
      const note = editNote.trim()
        ? `[Edited by moderator: ${editNote.trim()}]`
        : '[Edited for clarity / formatting by moderator]'

      const { error } = await supabase
        .from('reviews')
        .update({
          comment: editComment.trim(),
          moderation_note: note,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', editingReview.id)

      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'UPDATE',
        entity: 'review',
        entity_id: editingReview.id,
        summary: `Edited review comment for property: ${editingReview.property?.title}`,
      })

      setSuccessMessage('Review text updated.')
      setEditModalOpen(false)
      setEditingReview(null)
      loadReviews()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error updating review text')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setSubmitting(true)
      const { error } = await supabase.from('reviews').delete().eq('id', deleteTarget.id)
      if (error) throw error

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'DELETE',
        entity: 'review',
        entity_id: deleteTarget.id,
        summary: `Deleted review from ${deleteTarget.reviewer_name || 'Anonymous'}`,
      })

      setSuccessMessage('Review permanently deleted.')
      setDeleteConfirmOpen(false)
      setDeleteTarget(null)
      loadReviews()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error deleting review')
    } finally {
      setSubmitting(false)
    }
  }

  // Bulk Actions
  const handleBulkAction = async (action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    if (selectedIds.length === 0) return

    try {
      setSubmitting(true)
      if (action === 'DELETE') {
        await supabase.from('reviews').delete().in('id', selectedIds)
      } else {
        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        await supabase
          .from('reviews')
          .update({
            status: newStatus,
            moderated_by: user?.id,
            moderated_at: new Date().toISOString(),
          })
          .in('id', selectedIds)
      }

      await supabase.from('activity_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: action === 'DELETE' ? 'DELETE' : action === 'APPROVE' ? 'APPROVE' : 'REJECT',
        entity: 'review',
        summary: `Bulk ${action.toLowerCase()} on ${selectedIds.length} reviews`,
      })

      setSuccessMessage(`Bulk ${action.toLowerCase()} completed for ${selectedIds.length} reviews.`)
      setSelectedIds([])
      loadReviews()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Bulk action failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Reviews Moderation CMS
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Review customer submissions before they become publicly visible on property pages.
          </p>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs Bar & Bulk Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'PENDING', label: 'Pending Moderation', badge: pendingCount },
            { id: 'APPROVED', label: 'Approved & Public' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'ALL', label: 'All Reviews' },
          ].map((tab) => {
            const active = currentTab === tab.id
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id as any)
                  setSelectedIds([])
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-primary text-[#04121a] font-bold shadow-md shadow-cyan-950/40'
                    : 'bg-white/[0.04] text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      active ? 'bg-[#04121a] text-primary' : 'bg-amber-500 text-[#04121a]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && can('reviews.moderate') && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{selectedIds.length} selected:</span>
            <button
              type="button"
              onClick={() => handleBulkAction('APPROVE')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Approve All
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('REJECT')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('DELETE')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              Delete All
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0A20] shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-text-muted">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-xs text-text-muted">
            No reviews found in &ldquo;{currentTab}&rdquo; tab.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredReviews.map((rev) => {
              const isSelected = selectedIds.includes(rev.id)
              return (
                <div
                  key={rev.id}
                  className={`p-4 sm:p-6 transition-colors ${
                    isSelected ? 'bg-primary/5' : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Checkbox + Details */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {can('reviews.moderate') && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, rev.id])
                            } else {
                              setSelectedIds((prev) => prev.filter((id) => id !== rev.id))
                            }
                          }}
                          className="mt-1 rounded border-white/20 bg-white/5 text-primary"
                        />
                      )}

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-bold text-white text-sm">
                            {rev.reviewer_name || 'Verified Tenant'}
                          </span>
                          <StatusBadge status={rev.status} />
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={13} className="fill-current" />
                            ))}
                          </div>
                        </div>

                        {/* Property Link */}
                        <div className="text-xs text-text-muted flex items-center gap-1.5">
                          <span>Property:</span>
                          <a
                            href={`/rentals/${rev.property?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium inline-flex items-center gap-1 truncate max-w-sm"
                          >
                            {rev.property?.title || 'Unknown Property'}
                            <ExternalLink size={11} />
                          </a>
                          <span>·</span>
                          <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-text-secondary leading-relaxed pt-1 whitespace-pre-wrap">
                          {rev.comment}
                        </p>

                        {/* Moderation note if any */}
                        {rev.moderation_note && (
                          <p className="text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg inline-block mt-2">
                            Note: {rev.moderation_note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {can('reviews.moderate') && (
                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                        {rev.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(rev)}
                            disabled={submitting}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                            title="Approve Review"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                        )}

                        {rev.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setRejectTarget(rev)
                              setRejectNote('')
                              setRejectModalOpen(true)
                            }}
                            disabled={submitting}
                            className="px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold transition-all flex items-center gap-1.5"
                            title="Reject Review"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingReview(rev)
                            setEditComment(rev.comment)
                            setEditNote('')
                            setEditModalOpen(true)
                          }}
                          className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit Review Text"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(rev)
                            setDeleteConfirmOpen(true)
                          }}
                          className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0E0A20] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Reject Customer Review</h3>
            <p className="text-xs text-text-secondary mb-4">
              Enter an internal reason for rejecting this review.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={3}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="e.g. Inappropriate language, spam, or unsubstantiated claim..."
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Rejecting...' : 'Reject Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Text Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E0A20] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Edit Review Text</h3>
            <p className="text-xs text-text-secondary mb-4">
              Fix typos or format text. An audit note will be appended automatically.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Review Comment *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Moderator Note / Explanation (Optional)
                </label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="e.g. Corrected spelling and removed contact number"
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-[#04121a] font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Review Permanently?"
        description="Are you sure you want to delete this customer review? This action cannot be undone."
        confirmText="Delete Review"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
