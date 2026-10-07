'use client'

import React, { useState } from 'react'
import { Flag, AlertTriangle, CheckCircle2, XCircle, Home, ShieldAlert, Eye, MessageSquare } from 'lucide-react'

export default function AdminReportsPage() {
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      propertyTitle: '2BHK Apartment (Kakadeo)',
      propertySlug: '2bhk-kakadeo-coaching-hub',
      reportedBy: 'Tenant (User #481)',
      reason: 'Already Rented',
      details: 'Owner confirmed over call that flat was rented yesterday, but status is still Available.',
      status: 'OPEN', // OPEN, INVESTIGATING, RESOLVED, DISMISSED
      createdAt: '2026-10-04 14:30',
    },
    {
      id: 'rep-2',
      propertyTitle: 'Independent House (Barra)',
      propertySlug: 'independent-house-barra',
      reportedBy: 'Tenant (User #312)',
      reason: 'Incorrect Rent',
      details: 'Listed as 12,000 but landlord asked for 14,000 during visit.',
      status: 'INVESTIGATING',
      createdAt: '2026-10-03 09:15',
    },
  ])

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'RESOLVED' } : r))
    )
  }

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'DISMISSED' } : r))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Flag size={24} className="text-rose-400" /> Listing Reports &amp; Moderation
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Investigate community-reported discrepancies, fake prices, or already-rented homes
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
                    {rep.reason}
                  </span>
                  <span className="text-xs text-text-muted">Report #{rep.id} · {rep.createdAt}</span>
                </div>
                <h3 className="text-base font-bold text-white">{rep.propertyTitle}</h3>
                <p className="text-xs text-text-muted mt-0.5">Reported by: {rep.reportedBy}</p>
              </div>

              <div className="flex items-center gap-2">
                {rep.status !== 'RESOLVED' && rep.status !== 'DISMISSED' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleResolve(rep.id)}
                      className="btn px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 size={14} /> Resolve &amp; Update Status
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(rep.id)}
                      className="btn btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white border border-white/10"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rep.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/5 text-text-muted border border-white/10'
                    }`}
                  >
                    {rep.status}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary leading-relaxed">
              <strong className="text-white block mb-0.5">User Report Details:</strong>
              {rep.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
