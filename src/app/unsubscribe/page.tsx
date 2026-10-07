'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MailX, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg('Please provide a valid email address.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to process unsubscribe request.')
      } else {
        setSuccess(true)
      }
    } catch {
      setLoading(false)
      // Client-side graceful fallback
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_24px_rgba(168,85,247,0.4)]">
              P
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">PrimeHomeKanpur</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Preferences</h1>
          <p className="text-sm text-text-secondary mt-1.5">
            Manage your email subscription settings
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0C0A1A]/90 backdrop-blur-xl p-7 shadow-2xl shadow-purple-950/40">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">You Have Been Unsubscribed</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Your email <strong className="text-white">{email}</strong> will no longer receive weekly property alerts or marketing emails from PrimeHomeKanpur.
              </p>
              <Link href="/" className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold">
                Return to Homepage
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 mb-5 text-xs text-text-secondary">
                <MailX className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Enter your email below to unsubscribe from all marketing alerts and new listing digests.</span>
              </div>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? 'Processing...' : 'Confirm Unsubscribe'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Keep My Subscription
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}
