'use client'

import React, { useState } from 'react'
import { CreditCard, CheckCircle2, RotateCcw, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

export default function AdminPaymentsPage() {
  const [payments] = useState([
    {
      id: 'PAY-8921',
      tenant: 'Rahul Verma (User #512)',
      property: 'Spacious 2BHK (Gurudev Chauraha)',
      type: 'Physical Visit Booking Fee',
      amount: '₹300',
      gateway: 'Razorpay UPI (Verified Server-Side)',
      date: '2026-10-06 09:15',
      status: 'CAPTURED',
    },
    {
      id: 'PAY-8920',
      tenant: 'Ananya Shukla (User #498)',
      property: 'Modern 3BHK (Swaroop Nagar)',
      type: 'Physical Visit Booking Fee',
      amount: '₹300',
      gateway: 'Razorpay UPI (Verified Server-Side)',
      date: '2026-10-05 16:40',
      status: 'CAPTURED',
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CreditCard size={24} className="text-primary" /> Payment Ledger &amp; Transactions
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time audit of ₹300 visit charges, brokerage reconciliations, and refund processing
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Visit Fees Collected (MTD)</span>
          <div className="text-2xl font-black text-white mt-1">₹14,700</div>
          <span className="text-[11px] text-emerald-400 font-medium">49 Paid Tours Conducted</span>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Pending Refunds</span>
          <div className="text-2xl font-black text-white mt-1">₹0</div>
          <span className="text-[11px] text-emerald-400 font-medium">100% Reconciled</span>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0E0B1F]">
          <span className="text-xs font-semibold text-text-muted uppercase">Brokerage Settled</span>
          <div className="text-2xl font-black text-white mt-1">₹1,84,000</div>
          <span className="text-[11px] text-text-secondary font-medium">14 Deals Finalized</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Payment ID</th>
                <th className="pb-3 font-semibold">Payer / Property</th>
                <th className="pb-3 font-semibold">Transaction Type</th>
                <th className="pb-3 font-semibold">Gateway / Security</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3.5 font-mono text-white font-bold">{p.id}</td>
                  <td className="py-3.5">
                    <strong className="text-white block">{p.tenant}</strong>
                    <span className="text-[11px] text-text-muted">{p.property}</span>
                  </td>
                  <td className="py-3.5">{p.type}</td>
                  <td className="py-3.5 text-accent-cyan font-medium">{p.gateway}</td>
                  <td className="py-3.5 text-white font-bold text-sm">{p.amount}</td>
                  <td className="py-3.5">{p.date}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {p.status}
                    </span>
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
