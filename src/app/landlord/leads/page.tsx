'use client'

import React, { useState } from 'react'
import { Users, Phone, Mail, Calendar, Home, CheckCircle2, MessageSquare } from 'lucide-react'

export default function LandlordLeadsPage() {
  const [leads] = useState([
    {
      id: 'lead-1',
      tenantName: 'Vikas Agarwal',
      phone: '+91 9839012345',
      property: 'Spacious 2BHK Apartment (Gurudev Chauraha)',
      tenantType: 'Family (4 Members)',
      preferredMoveIn: 'Immediate',
      budget: '₹18,000',
      status: 'VISIT_REQUESTED',
      date: '2026-10-04',
    },
    {
      id: 'lead-2',
      tenantName: 'Dr. Priya Sharma',
      phone: '+91 9415098765',
      property: 'Modern 3BHK Flat (Swaroop Nagar)',
      tenantType: 'Working Professional (Doctor)',
      preferredMoveIn: 'Within 15 Days',
      budget: '₹26,000',
      status: 'CONTACTED',
      date: '2026-10-03',
    },
  ])

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={20} className="text-primary" /> Tenant Inquiries &amp; Leads
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Verified prospective tenants inquiring about your Kanpur rental listings
        </p>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-text-muted">Received on {lead.date}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{lead.tenantName}</h3>
                <p className="text-xs text-accent-cyan flex items-center gap-1.5 mt-0.5">
                  <Home size={13} /> {lead.property}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="btn btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                >
                  <Phone size={13} /> Call Tenant
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
              <div>
                <span className="text-text-muted block text-[11px]">Tenant Category</span>
                <span className="text-white font-medium">{lead.tenantType}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Target Move-In</span>
                <span className="text-white font-medium">{lead.preferredMoveIn}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Agreed Budget</span>
                <span className="text-white font-medium">{lead.budget}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Coordination</span>
                <span className="text-emerald-400 font-medium">Assisted by Agent</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
