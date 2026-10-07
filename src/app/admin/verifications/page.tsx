'use client'

import React, { useState } from 'react'
import { ShieldCheck, CheckCircle2, XCircle, Clock, MapPin, Camera, Home, FileText, Check } from 'lucide-react'

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState([
    {
      id: 'ver-1',
      propertyTitle: 'Independent 3BHK Builder Floor (Swaroop Nagar)',
      landlord: 'Abhishek Pathak (+91 9151435647)',
      location: 'Swaroop Nagar, Kanpur',
      price: '₹26,000/mo',
      submittedDate: '2026-10-02',
      inspector: 'Rental Specialist 1',
      checklist: {
        physicalWalkthrough: true,
        authenticPhotos: true,
        waterInspection: true,
        electricitySubmeter: true,
        ownershipDocVerified: true,
        rentAgreementDrafted: true,
      },
      status: 'VERIFIED',
    },
    {
      id: 'ver-2',
      propertyTitle: '2BHK Family Flat (Kakadeo)',
      landlord: 'Rajesh Gupta (+91 9839445566)',
      location: 'Kakadeo, Kanpur',
      price: '₹15,000/mo',
      submittedDate: '2026-10-05',
      inspector: 'Unassigned',
      checklist: {
        physicalWalkthrough: false,
        authenticPhotos: false,
        waterInspection: false,
        electricitySubmeter: false,
        ownershipDocVerified: false,
        rentAgreementDrafted: false,
      },
      status: 'INSPECTION_PENDING',
    },
  ])

  const handleApproveInspection = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'VERIFIED',
              inspector: 'Current Admin',
              checklist: {
                physicalWalkthrough: true,
                authenticPhotos: true,
                waterInspection: true,
                electricitySubmeter: true,
                ownershipDocVerified: true,
                rentAgreementDrafted: true,
              },
            }
          : v
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-accent-cyan" /> Property Physical Verifications
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Perform and approve on-site physical audits before granting public verified status
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {verifications.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-text-muted">
                  Audit #{v.id} · Submitted {v.submittedDate}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{v.propertyTitle}</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  <MapPin size={13} className="inline mr-1 text-accent-cyan" />
                  {v.location} · {v.price} · Landlord: {v.landlord}
                </p>
              </div>

              <div>
                {v.status === 'VERIFIED' ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 100% Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApproveInspection(v.id)}
                    className="btn btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={14} /> Mark Physical Audit Passed
                  </button>
                )}
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.physicalWalkthrough ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>On-site Inspection</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.authenticPhotos ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>Genuine Photos &amp; Video</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.waterInspection ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>Water Supply Audit</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.electricitySubmeter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>Electric Meter Checked</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.ownershipDocVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>Ownership Verified</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${v.checklist.rentAgreementDrafted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-muted'}`}>
                  ✓
                </span>
                <span>Standard Agreement</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
