'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PropertyVisit } from '@/types'
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock3,
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export default function MyVisitsPage() {
  const { user } = useAuth()
  const [visits, setVisits] = useState<PropertyVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadVisits = async () => {
    if (!user?.id) return
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .select(`
          *,
          property:properties(
            id,
            slug,
            title,
            address,
            price,
            bhk,
            location:locations(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setVisits(data as PropertyVisit[])
      } else {
        setVisits([])
      }
    } catch (err) {
      console.error('Failed to load visits:', err)
      setVisits([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisits()
  }, [user?.id])

  const handleCancelVisit = async (visitId: string) => {
    if (!confirm('Are you sure you want to cancel this visit request?')) return
    setCancellingId(visitId)

    try {
      const { error } = await supabase
        .from('property_visits')
        .update({ status: 'cancelled' })
        .eq('id', visitId)
        .eq('user_id', user!.id)

      if (!error) {
        setVisits((prev) =>
          prev.map((v) => (v.id === visitId ? { ...v, status: 'cancelled' } : v))
        )
      }
    } catch (err) {
      console.error('Cancel visit error:', err)
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusBadge = (status: PropertyVisit['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <CheckCircle2 size={13} /> Completed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock3 size={13} /> Pending Confirmation
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">
            <XCircle size={13} /> Cancelled
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle size={13} /> Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-primary" /> My Visit Bookings
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track scheduling status for your on-site physical property visits in Kanpur
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
          <ShieldCheck size={14} className="text-accent-cyan" />
          <span>₹300 visit charge payable at tour</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading your visit requests...</p>
        </div>
      ) : visits.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
            <Calendar size={30} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Your visit requests will appear here</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
            When you find a rental you like, schedule an on-site visit with our listing agent.
          </p>
          <Link
            href="/rentals"
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-900/30"
          >
            Find a Rental to Visit <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 transition-all hover:border-white/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">
                      {visit.property?.title || 'Rental Property'}
                    </h3>
                    {getStatusBadge(visit.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-accent-pink" />
                      {visit.property?.address || (visit.property?.location as any)?.name || 'Kanpur'}
                    </span>
                    {visit.property?.price && (
                      <span className="font-semibold text-white">
                        ₹{visit.property.price.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>

                {/* Date & Time Badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{visit.preferred_date}</p>
                    <p className="text-[11px] text-text-muted">{visit.preferred_time}</p>
                  </div>
                  <Clock size={20} className="text-accent-cyan" />
                </div>
              </div>

              {/* Message & Admin Note */}
              {(visit.message || visit.admin_note) && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                  {visit.message && (
                    <p className="text-text-secondary">
                      <span className="text-text-muted font-medium">Your Note:</span> {visit.message}
                    </p>
                  )}
                  {visit.admin_note && (
                    <p className="text-accent-cyan">
                      <span className="font-semibold text-white">Listing Executive Note:</span> {visit.admin_note}
                    </p>
                  )}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {visit.property?.slug && (
                    <Link
                      href={`/rentals/${visit.property.slug}`}
                      className="text-xs text-accent-cyan font-semibold hover:underline"
                    >
                      View Property Details
                    </Link>
                  )}
                  <a
                    href="tel:+919151435647"
                    className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Phone size={12} /> Call Support
                  </a>
                </div>

                {visit.status === 'pending' && (
                  <button
                    type="button"
                    disabled={cancellingId === visit.id}
                    onClick={() => handleCancelVisit(visit.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors disabled:opacity-50"
                  >
                    {cancellingId === visit.id ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
