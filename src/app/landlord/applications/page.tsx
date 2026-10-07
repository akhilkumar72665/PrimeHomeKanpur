'use client'

import React, { useState } from 'react'
import { FileText, CheckCircle2, XCircle, Clock, ShieldCheck, User } from 'lucide-react'

export default function LandlordApplicationsPage() {
  const [applications, setApplications] = useState([
    {
      id: 'app-901',
      tenantName: 'Vikas Agarwal',
      tenantEmail: 'vikas.agarwal@example.invalid',
      tenantPhone: '+91 9839012345',
      property: 'Spacious 2BHK Apartment (Gurudev Chauraha)',
      membersCount: 4,
      occupation: 'Senior Engineer at Tata Motors',
      policeVerificationReady: true,
      status: 'PENDING',
    },
  ])

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    )
  }

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText size={20} className="text-primary" /> Tenant Applications
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Review tenant background information, employment status, and approve rental agreements
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Application #{app.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{app.tenantName}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{app.property}</p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(app.id)}
                      className="btn px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 size={14} /> Accept Tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(app.id)}
                      className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 border border-rose-500/20 hover:bg-rose-500/10"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {app.status}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
              <div>
                <span className="text-text-muted block text-[11px]">Occupation / Employer</span>
                <span className="text-white font-medium">{app.occupation}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Family Composition</span>
                <span className="text-white font-medium">{app.membersCount} Family Members</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Verification Documents</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck size={14} /> Aadhaar &amp; Address Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
