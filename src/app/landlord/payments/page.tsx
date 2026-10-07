'use client'

import React from 'react'
import { CreditCard, ShieldCheck, CheckCircle2, Download, AlertCircle } from 'lucide-react'

export default function LandlordPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard size={20} className="text-primary" /> Brokerage &amp; Financial Ledger
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Transparent transaction records and standard 15-day brokerage invoices
        </p>
      </div>

      {/* Brokerage Model Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-3">
        <div className="flex items-center gap-2 text-accent-cyan">
          <ShieldCheck size={18} />
          <h3 className="text-base font-bold text-white">PrimeHome Transparent Pricing Guarantee</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary pt-2">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Listing &amp; Photography</strong>
            100% Free · No upfront listing or inspection fee.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Standard Brokerage</strong>
            15 Days Rent upon successful lease execution only.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">Lease Drafting</strong>
            Free standard 11-month legal agreement included.
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
        <h3 className="text-base font-bold text-white mb-4">Transaction History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Transaction ID</th>
                <th className="pb-3 font-semibold">Property</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3.5 font-mono text-white">TXN-7821</td>
                <td className="py-3.5 font-semibold text-white">Spacious 2BHK (Gurudev)</td>
                <td className="py-3.5">Physical Inspection &amp; Media Audit</td>
                <td className="py-3.5 text-emerald-400 font-bold">₹0 (Complimentary)</td>
                <td className="py-3.5">2026-09-28</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
