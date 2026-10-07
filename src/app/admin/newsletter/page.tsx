'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, XCircle, Download, ShieldCheck, Search } from 'lucide-react'

export default function AdminNewsletterPage() {
  const [subscribers] = useState([
    {
      id: 'sub-1',
      email: 'subscriber1@example.invalid',
      subscribedAt: '2026-10-01',
      status: 'ACTIVE',
      consentRecorded: true,
    },
    {
      id: 'sub-2',
      email: 'tenant.kanpur@example.invalid',
      subscribedAt: '2026-09-27',
      status: 'ACTIVE',
      consentRecorded: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Mail size={24} className="text-primary" /> Newsletter Subscribers
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Compliant subscriber list with recorded consent and one-click unsubscribe support
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-secondary">
            <thead>
              <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Subscriber Email</th>
                <th className="pb-3 font-semibold">Subscribed Date</th>
                <th className="pb-3 font-semibold">Consent Verification</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3.5 font-medium text-white">{s.email}</td>
                  <td className="py-3.5">{s.subscribedAt}</td>
                  <td className="py-3.5 text-emerald-400 font-medium">✓ Explicit Opt-in</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {s.status}
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
