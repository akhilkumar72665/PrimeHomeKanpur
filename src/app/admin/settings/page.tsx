'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Settings,
  ShieldCheck,
  Mail,
  Phone,
  Building,
  KeyRound,
  CheckCircle2,
  Database,
  Lock
} from 'lucide-react'

export default function AdminSettingsPage() {
  const { user, profile } = useAuth()

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings size={22} className="text-amber-400" /> Platform & Security Settings
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          System configurations, business constants, Supabase RLS security, and super admin access
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Information Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building size={18} className="text-accent-cyan" /> PrimeHomeKanpur Identity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Primary Admin Email</span>
              <span className="font-semibold text-white font-mono">primehomekanpur@gmail.com</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Official Phone Number</span>
              <span className="font-semibold text-white font-mono">+91 9151435647</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Tenant Brokerage</span>
              <span className="font-semibold text-amber-300">15 Days Rent</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Visit Charge</span>
              <span className="font-semibold text-accent-cyan">₹300 Per Tour</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Call Consultation</span>
              <span className="font-semibold text-emerald-400">100% Free</span>
            </div>
          </div>
        </div>

        {/* Security & RLS Status Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" /> Security & Access Controls
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Row Level Security (RLS) Active</p>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  Tenant wishlists, private visits, unapproved reviews, and CMS mutations are protected server-side by PostgreSQL policies.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-start gap-2.5">
              <Lock size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Role-Based Route Protection</p>
                <p className="text-[11px] text-purple-300/80 mt-0.5">
                  Direct visits to /admin routes by unauthorized roles return HTTP 403 Access Denied.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Your Current Role</span>
              <span className="font-extrabold text-amber-300 uppercase">
                {profile?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
