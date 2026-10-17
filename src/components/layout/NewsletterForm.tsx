'use client'

import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'footer_form' }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.')
        return
      }

      setSuccess(true)
      setEmail('')
    } catch {
      setLoading(false)
      setErrorMsg('Network error. Please try again later.')
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 flex items-center gap-2.5 text-xs text-emerald-300">
        <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
        <div>
          <span className="font-semibold block text-emerald-200">Subscribed successfully!</span>
          <span>We&apos;ll deliver Kanpur rental alerts straight to your inbox.</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-label="Email address for newsletter"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0A0719] px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary h-11 px-5 text-sm font-bold rounded-xl whitespace-nowrap active:scale-95 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <p className="text-[11px] text-text-muted mt-2">
        By subscribing, you agree to receive property updates in Kanpur. Unsubscribe anytime.
      </p>
    </div>
  )
}
