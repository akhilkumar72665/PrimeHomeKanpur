'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  Heart,
  Calendar,
  Star,
  ArrowRight,
  MapPin,
  Clock3,
  CheckCircle2,
  Building
} from 'lucide-react'

export default function DashboardOverviewPage() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({
    wishlist: 0,
    visits: 0,
    reviews: 0,
  })
  const [recentVisits, setRecentVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return
      try {
        // Fetch counts in parallel
        const [wishlistRes, visitsRes, reviewsRes] = await Promise.all([
          supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('property_visits').select('id, preferred_date, preferred_time, status, property:properties(title, address, price)', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
          supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        ])

        setCounts({
          wishlist: wishlistRes.count || 0,
          visits: visitsRes.count || 0,
          reviews: reviewsRes.count || 0,
        })

        if (visitsRes.data) {
          setRecentVisits(visitsRes.data)
        }
      } catch (err) {
        console.error('Failed to load user overview stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id, supabase])

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wishlist Card */}
        <Link
          href="/dashboard/wishlist"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 hover:border-primary/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Heart size={22} className="fill-current" />
            </div>
            <span className="text-xs text-text-muted group-hover:text-white flex items-center gap-1 transition-colors">
              View <ArrowRight size={13} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : counts.wishlist}
          </div>
          <div className="text-xs text-text-secondary mt-1 font-medium">
            Saved Properties
          </div>
        </Link>

        {/* Visits Card */}
        <Link
          href="/dashboard/visits"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 hover:border-primary/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Calendar size={22} />
            </div>
            <span className="text-xs text-text-muted group-hover:text-white flex items-center gap-1 transition-colors">
              View <ArrowRight size={13} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : counts.visits}
          </div>
          <div className="text-xs text-text-secondary mt-1 font-medium">
            Visit Requests
          </div>
        </Link>

        {/* Reviews Card */}
        <Link
          href="/dashboard/reviews"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 hover:border-primary/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Star size={22} className="fill-current" />
            </div>
            <span className="text-xs text-text-muted group-hover:text-white flex items-center gap-1 transition-colors">
              View <ArrowRight size={13} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : counts.reviews}
          </div>
          <div className="text-xs text-text-secondary mt-1 font-medium">
            Submitted Reviews
          </div>
        </Link>
      </div>

      {/* Quick Actions & Recent Visits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Building size={18} className="text-accent-cyan" /> Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/rentals"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-white">Explore Verified Rentals</p>
                <p className="text-[11px] text-text-muted">Browse 40+ Kanpur locations with physical verification</p>
              </div>
              <ArrowRight size={14} className="text-text-muted" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-white">Need Free Consultation?</p>
                <p className="text-[11px] text-text-muted">Call us at +91 9151435647 or send an inquiry</p>
              </div>
              <ArrowRight size={14} className="text-text-muted" />
            </Link>

            <Link
              href="/faq"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-white">Brokerage & Fees FAQ</p>
                <p className="text-[11px] text-text-muted">Learn about 15-day tenant brokerage & ₹300 visit fee</p>
              </div>
              <ArrowRight size={14} className="text-text-muted" />
            </Link>
          </div>
        </div>

        {/* Recent Visits Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Recent Visit Requests
            </h3>
            <Link href="/dashboard/visits" className="text-xs text-accent-cyan hover:underline">
              See All
            </Link>
          </div>

          {recentVisits.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-xs text-text-secondary">No visit requests scheduled yet.</p>
              <Link
                href="/rentals"
                className="btn btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold mt-3 rounded-lg"
              >
                Browse Homes
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentVisits.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-[200px]">
                      {v.property?.title || 'Property Visit'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-text-muted mt-1">
                      <span>{v.preferred_date}</span>
                      <span>·</span>
                      <span className="truncate max-w-[120px]">{v.preferred_time}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      v.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : v.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-text-secondary'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
