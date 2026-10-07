'use client'

import React, { useState } from 'react'
import { Property } from '@/types'
import { X, Flag, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ReportListingModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

const REPORT_REASONS = [
  'Property unavailable',
  'Incorrect rent',
  'Incorrect photos',
  'Incorrect information',
  'Suspicious listing',
  'Already rented',
  'Other',
] as const

export default function ReportListingModal({ property, isOpen, onClose }: ReportListingModalProps) {
  const [reason, setReason] = useState<typeof REPORT_REASONS[number]>('Already rented')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await fetch('/api/properties/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertySlug: property.slug,
          reason,
          details: details || `Reported reason: ${reason}`,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit report.')
      } else {
        setSuccess(true)
      }
    } catch {
      setLoading(false)
      setSuccess(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Report Received</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-5">
              Thank you for helping keep PrimeHomeKanpur accurate. Our verification team will review this listing within 24 hours.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                onClose()
              }}
              className="btn btn-primary px-5 py-2 rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              <Flag size={14} /> Report Listing Discrepancy
            </div>
            <h3 className="text-base font-bold text-white truncate">{property.title}</h3>
            <p className="text-xs text-text-muted mb-4">
              Help us maintain 100% verified accuracy in Kanpur
            </p>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Details &amp; Observations *
                </label>
                <textarea
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain what was inaccurate or different from the listing..."
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
