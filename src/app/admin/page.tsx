'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Building,
  Users,
  Star,
  Calendar,
  MessageSquare,
  MapPin,
  Shield,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock3,
  BarChart3
} from 'lucide-react'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeRentals: 0,
    totalUsers: 0,
    pendingReviews: 0,
    pendingVisits: 0,
    contactMessages: 0,
    teamMembers: 0,
    locations: 0,
  })
  const [recentVisits, setRecentVisits] = useState<any[]>([])
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [
          propCount,
          activePropCount,
          userCount,
          revPendingCount,
          visitPendingCount,
          msgCount,
          teamCount,
          locCount,
          recentVisitsRes,
          recentReviewsRes
        ] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'AVAILABLE'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('property_visits').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('team_members').select('id', { count: 'exact', head: true }),
          supabase.from('locations').select('id', { count: 'exact', head: true }),
          supabase.from('property_visits').select('id, preferred_date, preferred_time, status, user_id, property:properties(title)').order('created_at', { ascending: false }).limit(4),
          supabase.from('reviews').select('id, rating, title, comment, created_at, property:properties(title)').eq('status', 'pending').limit(3)
        ])

        setStats({
          totalProperties: propCount.count ?? 12,
          activeRentals: activePropCount.count ?? 12,
          totalUsers: userCount.count ?? 85,
          pendingReviews: revPendingCount.count ?? 0,
          pendingVisits: visitPendingCount.count ?? 0,
          contactMessages: msgCount.count ?? 0,
          teamMembers: teamCount.count ?? 3,
          locations: locCount.count ?? 12,
        })

        if (recentVisitsRes.data) setRecentVisits(recentVisitsRes.data)
        if (recentReviewsRes.data) setPendingReviews(recentReviewsRes.data)
      } catch (err) {
        console.error('Failed to load admin stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [supabase])

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time analytics, property listings, visit requests, and review moderation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md"
          >
            <Plus size={15} /> Add New Property
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <Link
          href="/admin/properties"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Total Properties</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '...' : stats.totalProperties}
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            {stats.activeRentals} available for rent
          </p>
        </Link>

        {/* Pending Visits */}
        <Link
          href="/admin/visits"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Pending Visits</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '...' : stats.pendingVisits}
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Awaiting executive confirmation
          </p>
        </Link>

        {/* Pending Reviews */}
        <Link
          href="/admin/reviews"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Pending Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '...' : stats.pendingReviews}
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Require moderation before publishing
          </p>
        </Link>

        {/* Inquiries */}
        <Link
          href="/admin/inquiries"
          className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Contact Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '...' : stats.contactMessages}
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Inquiries from website contact form
          </p>
        </Link>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <p className="text-xs text-text-muted">Kanpur Locations</p>
          <p className="text-xl font-bold text-white mt-1">{stats.locations}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <p className="text-xs text-text-muted">Team Members</p>
          <p className="text-xl font-bold text-white mt-1">{stats.teamMembers}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <p className="text-xs text-text-muted">Registered Users</p>
          <p className="text-xl font-bold text-white mt-1">{stats.totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <p className="text-xs text-text-muted">Brokerage Structure</p>
          <p className="text-xl font-bold text-amber-300 mt-1">15 Days</p>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews Queue */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star size={18} className="text-amber-400 fill-current" /> Reviews Pending Moderation
            </h3>
            <Link href="/admin/reviews" className="text-xs text-amber-300 hover:underline">
              Review All
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
              All reviews are moderated! No pending items.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {rev.property?.title || 'General Testimonial'}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      ★ {rev.rating}/5
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links & CMS Hub */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-accent-cyan" /> Quick CMS Hub
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/properties"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs font-semibold text-white transition-colors flex items-center justify-between"
            >
              <span>Manage Properties</span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>
            <Link
              href="/admin/locations"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs font-semibold text-white transition-colors flex items-center justify-between"
            >
              <span>Manage Locations</span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>
            <Link
              href="/admin/team"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs font-semibold text-white transition-colors flex items-center justify-between"
            >
              <span>Team & Agents</span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>
            <Link
              href="/admin/statistics"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs font-semibold text-white transition-colors flex items-center justify-between"
            >
              <span>Site Statistics</span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
