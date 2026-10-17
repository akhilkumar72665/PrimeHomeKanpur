'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock, User, CheckCircle2, Phone, AlertCircle, Home } from 'lucide-react'

export default function LandlordVisitsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const loadVisits = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      // 1. Fetch landlord's owned properties
      const { data: props, error: propsError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('created_by', user.id)

      if (propsError) {
        console.error('Failed to query properties:', propsError)
        setErrorMsg('Failed to query properties.')
        setLoading(false)
        return
      }

      if (!props || props.length === 0) {
        setVisits([])
        setLoading(false)
        return
      }

      const propIds = props.map((p) => p.id)
      const propMap = new Map(props.map((p) => [p.id, p.title]))

      // 2. Fetch property_visits for owned properties
      const { data: visitsData, error: visitsError } = await supabase
        .from('property_visits')
        .select('*')
        .in('property_id', propIds)
        .order('preferred_date', { ascending: false })

      if (visitsError) {
        console.error('Failed to load visits:', visitsError)
        setErrorMsg('Failed to retrieve scheduled visits.')
        setVisits([])
      } else {
        const enriched = (visitsData || []).map((v) => ({
          ...v,
          propertyTitle: propMap.get(v.property_id) || 'Listed Property',
        }))
        setVisits(enriched)
      }
    } catch (err: any) {
      console.error('Landlord visits error:', err)
      setErrorMsg(err.message || 'Error loading visits.')
      setVisits([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadVisits()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> Scheduled Physical Visits
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Upcoming assisted property tours booked by prospective tenants on your Kanpur listings
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading scheduled visits...</p>
        </div>
      ) : visits.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Scheduled Tours Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            When tenants schedule an on-site visit for your verified properties, our certified field agent coordinates the physical walkthrough and records it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => {
            const isConfirmed = v.status === 'confirmed' || v.status === 'CONFIRMED'
            const isCompleted = v.status === 'completed' || v.status === 'COMPLETED'
            const isCancelled = v.status === 'cancelled' || v.status === 'CANCELLED'

            return (
              <div
                key={v.id}
                className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isCompleted
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          : isConfirmed
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : isCancelled
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}
                    >
                      {isCompleted
                        ? 'TOUR COMPLETED'
                        : isConfirmed
                        ? 'TOUR CONFIRMED'
                        : isCancelled
                        ? 'VISIT CANCELLED'
                        : 'VISIT REQUEST PENDING'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{v.propertyTitle}</h3>
                    <p className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                      <Clock size={13} className="text-accent-cyan" /> Slot: {v.preferred_time || 'General Tour'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                  <div>
                    <span className="text-text-muted block text-[11px]">Scheduled Date</span>
                    <span className="text-white font-bold">{new Date(v.preferred_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Field Coordination</span>
                    <span className="text-accent-cyan font-medium">Assisted by PrimeHome Agent</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Visit Model</span>
                    <span className="text-emerald-400 font-medium">₹300 On-Site Collection</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
