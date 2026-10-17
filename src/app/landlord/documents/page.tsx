'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  ShieldCheck,
  Upload,
  FileCheck,
  Lock,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
} from 'lucide-react'
import type { VerificationDocument, VerificationDocumentType } from '@/types'

const LANDLORD_DOC_LABELS: Record<string, string> = {
  OWNERSHIP_PROOF: 'Property Registry / Sale Deed',
  ELECTRICITY_BILL: 'Electricity / Power Corporation Bill',
  TAX_RECEIPT: 'Municipal Corporation Tax Receipt',
  IDENTITY_PROOF: 'Landlord Government ID (Aadhaar / PAN)',
  OTHER: 'Other Ownership Paperwork',
}

export default function LandlordDocumentsPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth()
  const [docs, setDocs] = useState<VerificationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState<VerificationDocumentType>('OWNERSHIP_PROOF')
  const [docTitle, setDocTitle] = useState('')
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadDocuments = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/documents')
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to retrieve documents.')
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
  }, [authLoading, isAuthenticated, user?.id])

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setErrorMsg('Please select a document file to upload.')
      return
    }

    setUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentType', docType)
      formData.append('title', docTitle.trim() || LANDLORD_DOC_LABELS[docType] || 'Ownership Proof')

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to upload document.')
        setUploading(false)
        return
      }

      setSuccessMsg('Ownership document securely uploaded. PrimeHomeKanpur officers will audit during physical walkthrough.')
      setSelectedFile(null)
      setDocTitle('')
      setShowUploadModal(false)
      setUploading(false)
      loadDocuments()
    } catch (err: any) {
      setUploading(false)
      setErrorMsg(err.message || 'An unexpected error occurred during upload.')
    }
  }

  const handleViewDocument = async (docId: string) => {
    setViewingId(docId)
    setErrorMsg(null)

    try {
      const res = await fetch(`/api/documents/${docId}/download`)
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to access document.')
        return
      }

      if (data.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to open document.')
    } finally {
      setViewingId(null)
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to permanently delete this document?')) {
      return
    }

    setDeletingId(docId)
    setErrorMsg(null)

    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to delete document.')
      } else {
        setSuccessMsg('Document successfully removed.')
        loadDocuments()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting document.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" /> Property Ownership &amp; Verification Docs
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Encrypted records proving ownership authority for PrimeHomeKanpur verified listings
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto shadow-md"
          >
            <Plus size={15} />
            <span>Upload Ownership Document</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-purple-800/30 bg-[#160D33]/60 p-4 flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-white">Strict Privacy Guarantee:</strong> Property documents are stored securely with zero public exposure. Only PrimeHome inspection officers verify documents to grant the <strong>&quot;Verified by PrimeHomeKanpur&quot;</strong> badge.
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <FileCheck size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isAuthenticated && !authLoading && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-10 text-center">
          <Lock size={32} className="text-primary mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Sign In Required</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
            Please sign in as a landlord to access or manage your property ownership paperwork.
          </p>
          <button
            onClick={() => openAuthModal('Please sign in to view documents.')}
            className="btn btn-primary px-5 py-2 rounded-xl text-xs font-bold"
          >
            Sign In
          </button>
        </div>
      )}

      {isAuthenticated && !loading && (
        <div className="space-y-3">
          {docs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-10 text-center">
              <FileCheck size={32} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Ownership Documents Uploaded</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
                Upload electricity bills or property registry papers to verify your property and earn the Verified Badge.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Upload size={14} /> Upload Ownership Document
              </button>
            </div>
          ) : (
            docs.map((doc) => {
              const isVerified = doc.status === 'VERIFIED'
              const isRejected = doc.status === 'REJECTED'

              return (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        {doc.file_name} · {LANDLORD_DOC_LABELS[doc.document_type] || doc.document_type} · {(doc.file_size_bytes / 1024).toFixed(1)} KB · Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      {doc.rejection_reason && (
                        <p className="text-[11px] text-rose-400 mt-1">
                          Reason: {doc.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {isVerified ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Verified
                      </span>
                    ) : isRejected ? (
                      <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1">
                        <XCircle size={13} /> Rejected
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1">
                        <Clock size={13} /> Under Review
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleViewDocument(doc.id)}
                      disabled={viewingId === doc.id}
                      className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                      title="View Encrypted Document via Short-Lived URL"
                    >
                      <Eye size={16} />
                    </button>

                    {!isVerified && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={deletingId === doc.id}
                        className="p-2 rounded-xl text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload size={18} className="text-primary" /> Upload Ownership Paperwork
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as VerificationDocumentType)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="OWNERSHIP_PROOF">Property Registry / Sale Deed</option>
                  <option value="ELECTRICITY_BILL">Electricity / KESCO Power Bill</option>
                  <option value="TAX_RECEIPT">Municipal Corporation Tax Receipt</option>
                  <option value="IDENTITY_PROOF">Landlord National ID (Aadhaar / PAN)</option>
                  <option value="OTHER">Other Ownership Proof</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Document Description / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., KESCO Electricity Bill 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  maxLength={120}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Choose File (PDF, PNG, JPEG up to 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-[11px] text-text-muted mt-1.5">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-text-secondary">
                <span className="font-semibold text-white">Confidentiality Guarantee:</span> Ownership papers are encrypted at rest. They are only inspected by verified field officers during listing approval.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="btn btn-primary px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  {uploading ? 'Encrypting & Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
