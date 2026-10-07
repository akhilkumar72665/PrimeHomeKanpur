'use client'

import React, { useState } from 'react'
import { ShieldCheck, Upload, FileCheck, AlertCircle, Lock, Eye, Download, Trash2 } from 'lucide-react'

export default function TenantDocumentsPage() {
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'Tenant Aadhaar / National ID Card',
      docType: 'IDENTITY_PROOF',
      fileName: 'aadhaar_card_masked.pdf',
      status: 'VERIFIED',
      uploadedAt: '2026-09-25',
    },
    {
      id: 'doc-2',
      title: 'Permanent Address Proof',
      docType: 'ADDRESS_PROOF',
      fileName: 'permanent_address.pdf',
      status: 'VERIFIED',
      uploadedAt: '2026-09-25',
    },
  ])

  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploading(true)
      setUploadMsg(null)

      setTimeout(() => {
        setDocuments((prev) => [
          ...prev,
          {
            id: `doc-${Date.now()}`,
            title: 'Employment / Student ID Proof',
            docType: 'EMPLOYMENT_PROOF',
            fileName: file.name,
            status: 'UNDER_REVIEW',
            uploadedAt: new Date().toISOString().split('T')[0],
          },
        ])
        setUploading(false)
        setUploadMsg('Document securely uploaded for encrypted verification.')
      }, 1200)
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

        <label className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer self-start sm:self-auto shadow-md">
          <Upload size={15} />
          <span>{uploading ? 'Encrypting & Uploading...' : 'Upload New Document'}</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleSimulateUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Security Banner */}
      <div className="rounded-2xl border border-purple-800/30 bg-[#160D33]/60 p-4 flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-white">Bank-Grade 256-bit Encryption:</strong> Your identity documents are stored in private, restricted-access buckets and accessed only through short-lived signed URLs. They are never indexed publicly or shared with unauthorized third parties.
        </div>
      </div>

      {uploadMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <FileCheck size={16} />
          <span>{uploadMsg}</span>
        </div>
      )}

      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc) => (
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
                  {doc.fileName} · Uploaded on {doc.uploadedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {doc.status === 'VERIFIED' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  Under Audit
                </span>
              )}

              <button
                type="button"
                onClick={() => alert('Secure signed URL generation simulated for authorized user session.')}
                className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                title="View Encrypted Document"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
