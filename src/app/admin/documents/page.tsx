'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import type { VerificationDocument } from '@/types'

export default function AdminDocumentsPage() {
  const { user, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth()
  const [docs, setDocs] = useState<VerificationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED'>('ALL')

  // Review modal state
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const loadDocuments = async () => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/documents?scope=all')
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to retrieve documents for audit.')
        setDocs([])
      } else {
        setDocs(data.documents || [])
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error loading documents.')
      setDocs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadDocuments()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated])

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    setErrorMsg(null)
    setActionMsg(null)

    try {
      const res = await fetch(`/api/documents/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFIED' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to approve document.')
      } else {
        setActionMsg('Document successfully verified and marked in system.')
        loadDocuments()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating document status.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingDocId) return

    setProcessingId(rejectingDocId)
    setErrorMsg(null)
    setActionMsg(null)

    try {
      const res = await fetch(`/api/documents/${rejectingDocId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim() || 'Document did not meet verification criteria.',
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to reject document.')
      } else {
        setActionMsg('Document rejected and recorded.')
        setRejectingDocId(null)
        setRejectionReason('')
        loadDocuments()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error rejecting document.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleInspectDocument = async (id: string) => {
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/documents/${id}/download`)
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to generate download URL.')
        return
      }

      if (data.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to open document.')
    }
  }

  const filteredDocs = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.document_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-primary" /> Identity &amp; Verification Vault
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Audit private tenant verification documents and landlord ownership papers
          </p>
        </div>

        <button
          onClick={loadDocuments}
          disabled={loading}
          className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {actionMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <CheckCircle2 size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title, file, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-[#0E0B1F] border border-white/10 pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              {filter === 'ALL'
                ? 'All'
                : filter === 'PENDING_REVIEW'
                ? 'Pending Audit'
                : filter === 'VERIFIED'
                ? 'Verified'
                : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Document Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">Uploaded</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3.5">
                      <strong className="text-white block">{d.title}</strong>
                      <span className="text-text-muted text-[11px]">{d.file_name}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-secondary font-medium">
                        {d.document_type}
                      </span>
                    </td>
                    <td className="py-3.5">{(d.file_size_bytes / 1024).toFixed(1)} KB</td>
                    <td className="py-3.5">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold ${
                          d.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : d.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleInspectDocument(d.id)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
                        title="Inspect Document via Short-Lived Signed URL"
                      >
                        <Eye size={15} />
                      </button>
                      {d.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(d.id)}
                            disabled={processingId === d.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingDocId(d.id)
                              setRejectionReason('')
                            }}
                            disabled={processingId === d.id}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle size={18} className="text-rose-400" /> Reject Document
            </h3>
            <p className="text-xs text-text-secondary">
              Provide a reason for rejecting this document so the user can re-upload a valid copy.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Illegible scan, name mismatch, expired document"
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingDocId(null)}
                  className="btn btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId !== null}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
