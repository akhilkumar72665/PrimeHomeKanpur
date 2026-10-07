'use client'

import React, { useState } from 'react'
import { ShieldCheck, Upload, FileCheck, Lock, Eye, Download } from 'lucide-react'

export default function LandlordDocumentsPage() {
  const [docs, setDocs] = useState([
    {
      id: 'ldoc-1',
      title: 'Electricity / Municipal Tax Bill (Ownership Proof)',
      property: 'Spacious 2BHK Apartment (Gurudev Chauraha)',
      fileName: 'kesco_electric_bill_2026.pdf',
      status: 'VERIFIED',
      uploadedAt: '2026-09-26',
    },
    {
      id: 'ldoc-2',
      title: 'Landlord Government ID (Aadhaar / PAN)',
      property: 'Account Owner ID',
      fileName: 'landlord_pan_card.pdf',
      status: 'VERIFIED',
      uploadedAt: '2026-09-26',
    },
  ])

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

        <label className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer self-start sm:self-auto shadow-md">
          <Upload size={15} />
          <span>Upload Ownership Document</span>
          <input type="file" className="hidden" />
        </label>
      </div>

      <div className="rounded-2xl border border-purple-800/30 bg-[#160D33]/60 p-4 flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-white">Strict Privacy Guarantee:</strong> Property documents are stored securely with zero public exposure. Only PrimeHome inspection officers verify documents to grant the <strong>&quot;Verified by PrimeHomeKanpur&quot;</strong> badge.
        </div>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
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
                  {doc.fileName} · {doc.property}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Verified
              </span>
              <button
                type="button"
                onClick={() => alert('Accessing private signed URL for verified session.')}
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
