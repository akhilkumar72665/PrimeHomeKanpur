'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Save
} from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    setStatusMsg(null)
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
        })
        .eq('id', user.id)

      setLoading(false)

      if (error) {
        setStatusMsg({ type: 'error', text: error.message || 'Failed to update profile.' })
      } else {
        await refreshProfile()
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' })
      }
    } catch (err: any) {
      setLoading(false)
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred.' })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    setStatusMsg(null)
    setPwdLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      setPwdLoading(false)

      if (error) {
        setStatusMsg({ type: 'error', text: error.message || 'Failed to change password.' })
      } else {
        setNewPassword('')
        setStatusMsg({ type: 'success', text: 'Password changed successfully!' })
      }
    } catch (err: any) {
      setPwdLoading(false)
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred.' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User size={20} className="text-primary" /> Profile & Account Settings
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your personal information and account security
        </p>
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Profile Details Form */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7">
        <h3 className="text-base font-bold text-white mb-4">Personal Details</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Email Address (Cannot be changed)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-text-muted text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Shield size={14} />
              <span>{profile?.role?.replace('_', ' ') || 'User'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md"
            >
              <Save size={16} />
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <KeyRound size={18} className="text-accent-cyan" /> Change Password
        </h3>
        <p className="text-xs text-text-secondary mb-4">
          Update your account password securely.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={pwdLoading}
              className="btn btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:border-primary text-white"
            >
              {pwdLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
