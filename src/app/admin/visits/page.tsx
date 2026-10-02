'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PropertyVisit } from '@/types'
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  Phone,
  Building,
  User,
  Check,
  X,
  AlertCircle
} from 'lucide-react'

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<PropertyVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .select(`
          *,
          property:properties(id, title, slug, address, price)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setVisits(data as PropertyVisit[])
        const notes: Record<string, string> = {}
        data.forEach((v: any) => {
          if (v.admin_note) notes[v.id] = v.admin_note
        })
        setAdminNotes(notes)
      } else {
        setVisits([])
      }
    } catch {
      setVisits([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisits()
  }, [])

  const handleUpdateStatus = async (
    visitId: string,
    newStatus: PropertyVisit['status']
  ) => {
    setProcessingId(visitId)
    const note = adminNotes[visitId] || null

    try {
      const { error } = await supabase
        .from('property_visits')
        .update({
          status: newStatus,
          admin_note: note,
        })
        .eq('id', visitId)

      if (!error) {
        setVisits((prev) =>
          prev.map((v) =>
            v.id === visitId ? { ...v, status: newStatus, admin_note: note } : v
          )
        )
      }
    } catch (err) {
      console.error('Visit status update error:', err)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredVisits = visits.filter(
    (v) => statusFilter === 'ALL' || v.status === statusFilter
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar size={22} className="text-amber-400" /> Visit Requests Manager
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage physical property tour schedules, assign agents, and confirm bookings
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-white/5 text-text-muted hover:text-white border border-white/5'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading visit requests...</p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <Calendar size={32} className="text-text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">No visit requests found</h3>
          <p className="text-xs text-text-muted">
            There are currently no visits matching the selected status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">
                      {visit.property?.title || 'Rental Listing'}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        visit.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : visit.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                      }`}
                    >
                      {visit.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {visit.property?.address || 'Kanpur'} · User ID: {visit.user_id.slice(0, 8)}...
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{visit.preferred_date}</p>
                    <p className="text-[11px] text-text-muted">{visit.preferred_time}</p>
                  </div>
                  <Clock size={20} className="text-accent-cyan" />
                </div>
              </div>

              {visit.message && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                  <span className="font-semibold text-white">User Message:</span> {visit.message}
                </div>
              )}

              {/* Admin Note Input */}
              <div>
                <label className="block text-[11px] text-text-muted mb-1 font-medium">
                  Internal Listing Agent Note
                </label>
                <input
                  type="text"
                  value={adminNotes[visit.id] || ''}
                  onChange={(e) =>
                    setAdminNotes({ ...adminNotes, [visit.id]: e.target.value })
                  }
                  placeholder="e.g. Tour confirmed for 11:30 AM with Akhil Kumar"
                  className="w-full h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-medium">Fee: ₹300 visit charge</span>
                </div>

                <div className="flex items-center gap-2">
                  {visit.status !== 'confirmed' && (
                    <button
                      type="button"
                      disabled={processingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'confirmed')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}

                  {visit.status !== 'completed' && (
                    <button
                      type="button"
                      disabled={processingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'completed')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {visit.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={processingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
