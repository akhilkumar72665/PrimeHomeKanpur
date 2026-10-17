'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Phone, Mail, Building, Save, CheckCircle2, Shield } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

export default function LandlordProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [whatsapp, setWhatsapp] = useState(profile?.phone || '')
  const [bankAccount, setBankAccount] = useState('Account on file')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
        })
        .eq('id', user.id)

      setLoading(false)

      if (error) {
        setErrorMsg('Failed to update landlord profile.')
      } else {
        await refreshProfile()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || 'Error saving profile.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User size={20} className="text-primary" /> Landlord Partner Profile
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your verified contact details, WhatsApp alert preferences, and payout accounts
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-8 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Landlord Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Email Address (Login ID)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'landlord@example.invalid'}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-text-muted text-sm cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Primary Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                WhatsApp Tour Alerts Number
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider">
            Payout &amp; Deposit Transfer Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Bank Account Details
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md"
          >
            <Save size={16} /> Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  )
}
