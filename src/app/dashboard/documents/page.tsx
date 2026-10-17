'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  ShieldCheck,
  Upload,
  FileCheck,
  AlertCircle,
  Lock,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react'
import type { VerificationDocument, VerificationDocumentType } from '@/types'

const DOC_TYPE_LABELS: Record<VerificationDocumentType, string> = {
  IDENTITY_PROOF: 'Aadhaar / Passport / Voter ID',
  ADDRESS_PROOF: 'Permanent Address Proof',
  EMPLOYMENT_PROOF: 'Employment / Student ID',
  OWNERSHIP_PROOF: 'Property Ownership Registry',
  ELECTRICITY_BILL: 'Electricity / Municipal Tax Bill',
  TAX_RECEIPT: 'House Tax / Water Tax Receipt',
  OTHER: 'Other Verification Document',
}

export default function TenantDocumentsPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth()
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Upload modal / form state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState<VerificationDocumentType>('IDENTITY_PROOF')
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
        setDocuments([])
      } else {
        setDocuments(data.documents || [])
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error loading documents.')
      setDocuments([])
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
      setErrorMsg('Please choose a document file to upload.')
      return
    }

    setUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentType', docType)
      formData.append('title', docTitle.trim() || DOC_TYPE_LABELS[docType])

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

      setSuccessMsg('Document securely uploaded to encrypted vault. Verification is pending review.')
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
    if (!confirm('Are you sure you want to permanently delete this document from the vault?')) {
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
            <ShieldCheck size={20} className="text-primary" /> Verified Tenant Documents
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Encrypted document vault for mandatory Uttar Pradesh police tenant verification &amp; lease drafting
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto shadow-md"
          >
            <Plus size={15} />
            <span>Upload New Document</span>
          </button>
        )}
      </div>

      {/* Security Banner */}
      <div className="rounded-2xl border border-purple-800/30 bg-[#160D33]/60 p-4 flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-white">Bank-Grade 256-bit Encryption:</strong> Your identity documents are stored in private, restricted-access buckets and accessed only through short-lived signed URLs. They are never indexed publicly or shared with unauthorized third parties.
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

      {/* Unauthenticated State */}
      {!isAuthenticated && !authLoading && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-10 text-center">
          <Lock size={32} className="text-primary mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Sign In Required</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
            Please sign in to securely access or upload your tenant verification documents.
          </p>
          <button
            onClick={() => openAuthModal('Please sign in to view documents.')}
            className="btn btn-primary px-5 py-2 rounded-xl text-xs font-bold"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Documents List */}
      {isAuthenticated && !loading && (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-10 text-center">
              <FileCheck size={32} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Documents Uploaded</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
                Upload your Aadhaar or address proof to get verified for faster rental lease approval in Kanpur.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Upload size={14} /> Upload First Document
              </button>
            </div>
          ) : (
            documents.map((doc) => {
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
                        {doc.file_name} · {DOC_TYPE_LABELS[doc.document_type] || doc.document_type} · {(doc.file_size_bytes / 1024).toFixed(1)} KB · Uploaded {new Date(doc.created_at).toLocaleDateString()}
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
                <Upload size={18} className="text-primary" /> Upload Identity / Proof
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
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as VerificationDocumentType)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="IDENTITY_PROOF">Identity Proof (Aadhaar, Voter ID, Passport)</option>
                  <option value="ADDRESS_PROOF">Permanent Address Proof</option>
                  <option value="EMPLOYMENT_PROOF">Employment Offer Letter / Student ID</option>
                  <option value="OTHER">Other Official Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Document Label / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Masked Aadhaar Card"
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
                <span className="font-semibold text-white">Privacy Note:</span> Uploads are validated against binary signatures and saved into our private encrypted vault. Download URLs expire within 60 seconds.
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
