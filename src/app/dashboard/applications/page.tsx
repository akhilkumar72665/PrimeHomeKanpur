'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FileText, Clock, CheckCircle2, XCircle, Home, ArrowRight, Plus } from 'lucide-react'

export default function TenantApplicationsPage() {
  const [applications] = useState([
    {
      id: 'app-101',
      propertyTitle: 'Spacious 2BHK Apartment',
      location: 'Gurudev Chauraha, Kanpur',
      price: 18000,
      appliedDate: '2026-10-01',
      status: 'UNDER_REVIEW', // UNDER_REVIEW, APPROVED, REJECTED, LEASE_GENERATED
      landlordName: 'Abhishek Pathak (Verified Owner)',
      moveInDate: '2026-11-01',
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={20} className="text-primary" /> Rental Applications
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track your rental application approvals and lease agreement status
          </p>
        </div>

        <Link
          href="/rentals"
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          <Plus size={15} /> Apply to New Rental
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Active Applications</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            You have not applied for any rental properties yet. Browse verified Kanpur listings and submit an application.
          </p>
          <Link href="/rentals" className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
            Explore Rentals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 transition-all hover:border-white/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-text-muted tracking-wider uppercase">
                    Application #{app.id} · Applied on {app.appliedDate}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{app.propertyTitle}</h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                    <Home size={13} className="text-accent-cyan" /> {app.location} · ₹{app.price.toLocaleString()}/mo
                  </p>
                </div>

                <div className="self-start sm:self-auto">
                  {app.status === 'UNDER_REVIEW' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                      <Clock size={13} /> Under Landlord Review
                    </span>
                  )}
                  {app.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={13} /> Approved
                    </span>
                  )}
                  {app.status === 'REJECTED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                      <XCircle size={13} /> Not Selected
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary mb-4">
                <div>
                  <span className="text-text-muted block text-[11px]">Proposed Move-in:</span>
                  <span className="text-white font-medium">{app.moveInDate}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Property Owner:</span>
                  <span className="text-white font-medium">{app.landlordName}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Agreement Drafting:</span>
                  <span className="text-accent-cyan font-medium">Included (11 Months Standard)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="text-text-muted">Direct phone assistance available via support.</span>
                <Link
                  href="/contact"
                  className="text-accent-cyan hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Contact Support <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
