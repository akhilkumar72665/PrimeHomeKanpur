'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Building, Plus, MapPin, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default function LandlordPropertiesPage() {
  const [properties] = useState([
    {
      id: 'prop-1',
      slug: 'spacious-2bhk-apartment-gurudev-chauraha',
      title: 'Spacious 2BHK Apartment',
      location: 'Gurudev Chauraha, Kanpur',
      price: 18000,
      bhk: 2,
      furnishing: 'Semi-Furnished',
      status: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      lastVerified: '2026-09-28',
      leadsCount: 8,
      visitsCount: 6,
    },
    {
      id: 'prop-2',
      slug: 'modern-3bhk-flat-swaroop-nagar',
      title: 'Modern 3BHK Flat',
      location: 'Swaroop Nagar, Kanpur',
      price: 26000,
      bhk: 3,
      furnishing: 'Fully Furnished',
      status: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      lastVerified: '2026-10-02',
      leadsCount: 14,
      visitsCount: 12,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building size={20} className="text-primary" /> My Listed Properties
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your properties, inspect verification status, and toggle rental availability
          </p>
        </div>

        <Link
          href="/landlord/properties/new"
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto shadow-md"
        >
          <Plus size={15} /> Add New Property
        </Link>
      </div>

      <div className="space-y-4">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 transition-all hover:border-white/20"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> {prop.verificationStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold">
                    {prop.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{prop.title}</h3>
                <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-accent-cyan" /> {prop.location} · {prop.bhk} BHK · {prop.furnishing}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-left md:text-right mr-2">
                  <div className="text-lg font-black text-white">₹{prop.price.toLocaleString()}<small className="text-xs text-text-muted">/mo</small></div>
                  <div className="text-[11px] text-text-muted">Last Verified: {prop.lastVerified}</div>
                </div>

                <Link
                  href={`/rentals/${prop.slug}`}
                  target="_blank"
                  className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 hover:border-accent-cyan"
                >
                  <Eye size={14} /> View Live Listing
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-text-secondary">
              <div>
                <span className="text-text-muted block text-[11px]">Tenant Leads</span>
                <span className="text-white font-bold text-sm">{prop.leadsCount} Interested</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Physical Tours</span>
                <span className="text-white font-bold text-sm">{prop.visitsCount} Conducted</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Water Inspection</span>
                <span className="text-emerald-400 font-medium">Verified (24x7)</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Assigned Agent</span>
                <span className="text-white font-medium">Abhishek Pathak</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
