'use client'

import React from 'react'
import Link from 'next/link'
import { Building, Users, Calendar, PlusCircle, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react'

export default function LandlordOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-white">2</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 size={12} /> 100% Verified by PrimeHome
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tenant Leads</span>
            <Users className="w-5 h-5 text-accent-cyan" />
          </div>
          <div className="text-3xl font-black text-white">14</div>
          <p className="text-[11px] text-accent-cyan mt-1 font-medium">
            +3 new inquiries this week
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Tours</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">4</div>
          <p className="text-[11px] text-text-secondary mt-1 font-medium">
            Assisted by Field Agents
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Brokerage Rate</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">15 Days</div>
          <p className="text-[11px] text-text-muted mt-1 font-medium">
            Due only upon tenant move-in
          </p>
        </div>
      </div>

      {/* Verification Protocol Notice */}
      <div className="rounded-2xl border border-purple-800/30 bg-gradient-to-r from-[#1E1145] to-[#0E0A24] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> PrimeHome Physical Verification
          </span>
          <h3 className="text-lg font-bold text-white">Have an empty rental property in Kanpur?</h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl leading-relaxed">
            Our certified field agents conduct free on-site photography, water &amp; electrical audits, and list your home directly to thousands of verified tenants.
          </p>
        </div>

        <Link
          href="/landlord/properties/new"
          className="btn btn-primary px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap self-start sm:self-auto shadow-lg"
        >
          <PlusCircle size={16} /> Submit Property Now
        </Link>
      </div>

      {/* Recent Properties & Actions */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white">My Properties</h3>
          <Link href="/landlord/properties" className="text-xs text-accent-cyan hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                VERIFIED &amp; AVAILABLE
              </span>
              <h4 className="text-sm font-bold text-white mt-1.5">Spacious 2BHK Apartment (Gurudev Chauraha)</h4>
              <p className="text-xs text-text-muted mt-0.5">₹18,000/month · Semi-Furnished · 6 Visits Conducted</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/rentals/spacious-2bhk-apartment-gurudev-chauraha"
                target="_blank"
                className="btn btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 hover:border-accent-cyan"
              >
                View Live Page
              </Link>
            </div>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                VERIFIED &amp; AVAILABLE
              </span>
              <h4 className="text-sm font-bold text-white mt-1.5">Independent 3BHK Builder Floor (Swaroop Nagar)</h4>
              <p className="text-xs text-text-muted mt-0.5">₹26,000/month · Fully Furnished · 12 Visits Conducted</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/rentals"
                className="btn btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 hover:border-accent-cyan"
              >
                View Live Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
