'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  Building,
  Users,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

export default function LandlordOverviewPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth()
  const [stats, setStats] = useState({
    activeListings: 0,
    draftListings: 0,
    totalVisits: 0,
    totalLeads: 0,
  })
  const [recentProperties, setRecentProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const loadDashboardData = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      // 1. Fetch landlord's owned properties
      const { data: props, error: propsError } = await supabase
        .from('properties')
        .select('id, title, slug, price, status, bhk, furnishing, created_at')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (propsError) {
        console.error('Failed to load landlord properties:', propsError)
        setErrorMsg('Failed to load properties.')
        setLoading(false)
        return
      }

      const ownedProps = props || []
      const activeCount = ownedProps.filter((p) => p.status === 'AVAILABLE').length
      const draftCount = ownedProps.filter((p) => p.status === 'DRAFT').length

      let visitsCount = 0
      let leadsCount = 0

      if (ownedProps.length > 0) {
        const propIds = ownedProps.map((p) => p.id)

        // 2. Fetch visits on landlord's properties
        const { count: vCount } = await supabase
          .from('property_visits')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propIds)

        visitsCount = vCount || 0

        // 3. Fetch inquiries/leads on landlord's properties
        const { count: lCount } = await supabase
          .from('inquiries')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propIds)

        leadsCount = lCount || 0
      }

      setStats({
        activeListings: activeCount,
        draftListings: draftCount,
        totalVisits: visitsCount,
        totalLeads: leadsCount,
      })

      setRecentProperties(ownedProps.slice(0, 3))
    } catch (err: any) {
      console.error('Landlord overview exception:', err)
      setErrorMsg(err.message || 'Error loading dashboard metrics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadDashboardData()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  return (
    <div className="space-y-8">
      {/* Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Listings */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Listings</span>
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? '...' : stats.activeListings}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 size={12} /> Verified &amp; Public
          </p>
        </div>

        {/* Tenant Leads */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tenant Leads</span>
            <Users className="w-5 h-5 text-accent-cyan" />
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? '...' : stats.totalLeads}
          </div>
          <p className="text-[11px] text-accent-cyan mt-1 font-medium">
            Direct property inquiries
          </p>
        </div>

        {/* Scheduled Tours */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Physical Visits</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? '...' : stats.totalVisits}
          </div>
          <p className="text-[11px] text-text-secondary mt-1 font-medium">
            Field agent accompanied
          </p>
        </div>

        {/* Pending Inspection Walkthroughs */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 shadow-lg">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Audit</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? '...' : stats.draftListings}
          </div>
          <p className="text-[11px] text-amber-300 mt-1 font-medium">
            Walkthrough within 24h
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Protocol Notice */}
      <div className="rounded-2xl border border-purple-800/30 bg-gradient-to-r from-[#1E1145] to-[#0E0A24] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> PrimeHome Physical Verification
          </span>
          <h3 className="text-lg font-bold text-white">List Your Kanpur Property for Free</h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl leading-relaxed">
            Our certified field agents conduct free on-site photography, water &amp; electrical audits, and connect your home with verified tenants.
          </p>
        </div>

        <Link
          href="/landlord/properties/new"
          className="btn btn-primary px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap self-start sm:self-auto shadow-lg"
        >
          <PlusCircle size={16} /> Submit Property Now
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white">My Properties</h3>
          <Link href="/landlord/properties" className="text-xs text-accent-cyan hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-text-muted">Loading properties...</div>
        ) : recentProperties.length === 0 ? (
          <div className="py-8 text-center">
            <Building size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-xs text-text-secondary">No properties listed yet.</p>
            <Link
              href="/landlord/properties/new"
              className="btn btn-primary px-4 py-1.5 rounded-xl text-xs font-bold mt-3 inline-flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Add Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentProperties.map((prop) => (
              <div key={prop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      prop.status === 'AVAILABLE'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    {prop.status === 'AVAILABLE' ? 'VERIFIED & LIVE' : 'DRAFT (AUDIT PENDING)'}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{prop.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    ₹{prop.price.toLocaleString()}/month · {prop.furnishing} · {prop.bhk} BHK
                  </p>
                </div>
                {prop.status === 'AVAILABLE' ? (
                  <Link
                    href={`/rentals/${prop.slug}`}
                    target="_blank"
                    className="btn btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 hover:border-accent-cyan self-start sm:self-auto"
                  >
                    View Live Listing
                  </Link>
                ) : (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={12} className="text-amber-400" /> Walkthrough Scheduled
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
