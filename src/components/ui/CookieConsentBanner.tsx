'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('primehome_cookie_consent')
      if (!consent) {
        const timer = setTimeout(() => setShowBanner(true), 150)
        return () => clearTimeout(timer)
      }
    } catch {
      // ignore
    }
  }, [])

  const acceptAll = () => {
    try {
      localStorage.setItem('primehome_cookie_consent', 'accepted')
    } catch {
      // ignore
    }
    setShowBanner(false)
  }

  const declineNonEssential = () => {
    try {
      localStorage.setItem('primehome_cookie_consent', 'essential_only')
    } catch {
      // ignore
    }
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9998] animate-fade-in">
      <div className="rounded-2xl border border-white/15 bg-[#0E0B1F]/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/80">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan shrink-0">
            <Cookie size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Privacy &amp; Cookie Preferences</h4>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              We use essential cookies to manage your secure authentication session and saved property preferences.{' '}
              <Link href="/cookie-policy" className="text-accent-cyan underline hover:text-white">
                Learn more
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={declineNonEssential}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="btn btn-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow-md"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
