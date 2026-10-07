'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, CheckCircle2, Phone } from 'lucide-react'

export default function LandlordVisitsPage() {
  const [visits] = useState([
    {
      id: 'visit-101',
      tenantName: 'Rahul Verma',
      tenantPhone: '+91 9151435647',
      property: 'Spacious 2BHK Apartment (Gurudev Chauraha)',
      scheduledDate: '2026-10-07',
      slot: 'Morning (11:00 AM)',
      agentAssigned: 'Abhishek Pathak',
      status: 'CONFIRMED',
      visitFeePaid: true,
    },
    {
      id: 'visit-102',
      tenantName: 'Ananya Shukla',
      tenantPhone: '+91 9839112233',
      property: 'Modern 3BHK Flat (Swaroop Nagar)',
      scheduledDate: '2026-10-08',
      slot: 'Afternoon (3:00 PM)',
      agentAssigned: 'Abhishek Pathak',
      status: 'CONFIRMED',
      visitFeePaid: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> Scheduled Physical Visits
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Upcoming assisted property tours booked by prospective tenants
        </p>
      </div>

      <div className="space-y-4">
        {visits.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  TOUR CONFIRMED · ₹300 FEE COLLECTED
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{v.property}</h3>
                <p className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                  <User size={13} className="text-accent-cyan" /> Tenant: <strong>{v.tenantName}</strong> ({v.tenantPhone})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${v.tenantPhone}`}
                  className="btn btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 hover:border-accent-cyan"
                >
                  <Phone size={13} /> Call Tenant
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
              <div>
                <span className="text-text-muted block text-[11px]">Appointment Slot</span>
                <span className="text-white font-bold">{v.scheduledDate} · {v.slot}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Field Agent Accompaniment</span>
                <span className="text-accent-cyan font-medium">{v.agentAssigned}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Key Coordination</span>
                <span className="text-emerald-400 font-medium">Agent will call 1 hr prior</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
