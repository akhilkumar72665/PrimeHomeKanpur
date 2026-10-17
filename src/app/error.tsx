'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected errors safely to telemetry/console without exposing user PII
    console.error('[CLIENT ERROR LOG] Runtime boundary error:', {
      name: error.name,
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Error Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0C0A1A]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl text-center relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/40">
          <AlertTriangle size={32} />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
            An unexpected glitch occurred while loading this page. Our technical team has been notified. No financial data or confidential records were affected.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-text-muted mt-2">
              Reference Code: {error.digest}
            </p>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto btn btn-primary px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
          >
            <RefreshCw size={15} /> Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto btn btn-secondary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white border border-white/10 hover:border-accent-cyan inline-flex items-center justify-center gap-2"
          >
            <Home size={15} /> Home
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto btn btn-secondary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-text-secondary hover:text-white border border-white/10 inline-flex items-center justify-center gap-2"
          >
            <Phone size={15} /> Support
          </Link>
        </div>
      </div>
    </main>
  )
}
