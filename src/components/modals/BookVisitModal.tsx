'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import { X, Calendar, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'

interface BookVisitModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function BookVisitModal({ property, isOpen, onClose, onSuccess }: BookVisitModalProps) {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM - 1:00 PM)')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    preferredDate: string
    preferredTime: string
  } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isAuthenticated) {
      onClose()
      openAuthModal('Please sign in to schedule a property visit.')
      return
    }

    if (!preferredDate) {
      setErrorMsg('Please select a preferred visit date.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/visits/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          preferredDate,
          preferredTime,
          message: message.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoading(false)
        setErrorMsg(data.error || 'Failed to submit visit request. Please try again.')
        return
      }

      setLoading(false)
      setConfirmedBooking({
        preferredDate,
        preferredTime,
      })
      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || 'A network error occurred while booking.')
    }
  }

  // Get tomorrow's date string for min date (minimum 1 day in advance)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Max date (up to 30 days in advance)
  const maxDateObj = new Date()
  maxDateObj.setDate(maxDateObj.getDate() + 30)
  const maxDate = maxDateObj.toISOString().split('T')[0]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-8 shadow-2xl shadow-purple-950/60"
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Physical Visit Confirmed!</h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto mb-4">
              Your appointment is recorded for{' '}
              <span className="text-white font-semibold">{property.title}</span>.
            </p>

            {confirmedBooking && (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 text-xs text-left space-y-1.5 mb-5 max-w-sm mx-auto">
                <div className="flex items-center justify-between text-text-muted">
                  <span>Scheduled Date:</span>
                  <span className="text-white font-medium">{confirmedBooking.preferredDate}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>Slot Window:</span>
                  <span className="text-white font-medium">{confirmedBooking.preferredTime}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[11px]">Pending Agent Assignment</span>
                </div>
              </div>
            )}

            <div className="bg-purple-950/40 rounded-xl p-3 text-xs text-text-secondary mb-6 border border-purple-800/30 leading-relaxed text-left">
              <span className="text-white font-semibold block mb-0.5">Pay-on-Visit Model:</span>
              ₹300 visit fee is payable directly on-site to our Kanpur listing executive during the walkthrough. You can track tour status in{' '}
              <span className="text-accent-cyan font-medium">My Visits</span>.
            </div>

            <button
              onClick={() => {
                setSuccess(false)
                onClose()
              }}
              className="btn btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan uppercase tracking-wider mb-1">
                <Calendar size={14} /> Schedule Physical Tour
              </div>
              <h3 className="text-xl font-bold text-white">{property.title}</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {property.address || property.location?.name || 'Kanpur'} · ₹{property.price.toLocaleString()}/mo
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Preferred Date (Advance Booking)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={minDate}
                    max={maxDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Message / Special Request (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Coming with family, interested in parking space..."
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Fee Notice */}
              <div className="rounded-xl bg-purple-950/40 border border-purple-800/30 p-3 text-xs text-text-secondary flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">Transparent Pricing:</span> Free online reservation. Standard ₹300 visit fee is collected on-site by our field agent during the walkthrough. 15 days brokerage only upon finalized lease.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 mt-2"
              >
                {loading ? 'Submitting Reservation...' : 'Confirm Physical Tour Booking'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
