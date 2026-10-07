'use client'

import React, { useState } from 'react'
import { ShieldCheck, Lock, FileCheck, CheckCircle2, XCircle, Eye, Download, Search } from 'lucide-react'

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState([
    {
      id: 'doc-101',
      userName: 'Vikas Agarwal',
      userEmail: 'vikas.agarwal@example.invalid',
      docType: 'Tenant Aadhaar / National ID',
      role: 'TENANT',
      uploadedAt: '2026-10-01',
      status: 'VERIFIED',
    },
    {
      id: 'doc-102',
      userName: 'Abhishek Pathak (Owner)',
      userEmail: 'abhishek.pathak@example.invalid',
      docType: 'Electricity Bill (Gurudev Property Proof)',
      role: 'LANDLORD',
      uploadedAt: '2026-09-28',
      status: 'VERIFIED',
    },
    {
      id: 'doc-103',
      userName: 'Dr. Priya Sharma',
      userEmail: 'priya.sharma@example.invalid',
      docType: 'Doctor Medical Council ID & Address Proof',
      role: 'TENANT',
      uploadedAt: '2026-10-04',
      status: 'PENDING_AUDIT',
    },
  ])

  const handleApprove = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'VERIFIED' } : d))
    )
  }

  const handleReject = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'REJECTED' } : d))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-primary" /> Identity &amp; Verification Vault
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Audit private tenant verification documents and landlord ownership papers
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Document Type</th>
                <th className="pb-3 font-semibold">Uploaded</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {docs.map((d) => (
                <tr key={d.id}>
                  <td className="py-3.5">
                    <strong className="text-white block">{d.userName}</strong>
                    <span className="text-text-muted text-[11px]">{d.userEmail}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-secondary font-medium">
                      {d.role}
                    </span>
                  </td>
                  <td className="py-3.5 text-white font-medium">{d.docType}</td>
                  <td className="py-3.5">{d.uploadedAt}</td>
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
                      onClick={() => alert('Generating secure 60-second presigned URL for document inspection.')}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
                      title="Inspect Document"
                    >
                      <Eye size={15} />
                    </button>
                    {d.status === 'PENDING_AUDIT' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(d.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(d.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
