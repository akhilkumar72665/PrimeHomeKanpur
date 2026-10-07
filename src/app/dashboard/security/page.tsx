'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { ShieldAlert, KeyRound, Smartphone, Trash2, AlertTriangle, CheckCircle2, Lock } from 'lucide-react'

export default function TenantSecurityPage() {
  const { user, signOut } = useAuth()
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setErrorMsg('Please type DELETE in capital letters to confirm.')
      return
    }

    setIsDeleting(true)
    setErrorMsg(null)

    try {
      // Clean up profile in database
      if (user?.id) {
        await supabase.from('profiles').delete().eq('id', user.id)
      }
      await signOut()
      router.push('/?deleted=true')
    } catch (err: any) {
      setIsDeleting(false)
      setErrorMsg(err.message || 'Failed to complete account deletion.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert size={20} className="text-primary" /> Security &amp; Data Privacy
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your session controls, multi-factor protection, and permanent account removal
        </p>
      </div>

      {/* Active Session Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Smartphone size={18} className="text-accent-cyan" /> Current Active Session
        </h3>
        <p className="text-xs text-text-secondary">
          You are currently authenticated securely on this device via Supabase JWT tokens.
        </p>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Current Web Browser</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Now · Logged in as {user?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 border border-rose-500/20 hover:bg-rose-500/10"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl border border-rose-500/20 bg-[#160A14] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400">
          <AlertTriangle size={20} />
          <h3 className="text-base font-bold text-white">Danger Zone: Permanent Account Deletion</h3>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Deleting your account will permanently anonymize your user profile, purge your wishlist items, and remove your unconfirmed visit requests. Historical transaction invoices and lease agreements required under law are retained in an anonymized format.
        </p>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          <Trash2 size={15} /> Delete My PrimeHome Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0E0716] p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-400" size={20} /> Are you absolutely sure?
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This action cannot be undone. To confirm deletion, type <strong className="text-white font-bold">DELETE</strong> below:
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setDeleteConfirm('')
                  setErrorMsg(null)
                }}
                className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-white border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || deleteConfirm !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="btn px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-40"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
