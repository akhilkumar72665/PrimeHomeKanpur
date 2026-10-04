'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building,
  Star,
  MessageSquare,
  MapPin,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  XCircle,
  Phone,
  ArrowRight,
  TrendingUp,
  Clock,
  History,
} from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { WhatsAppLogo } from '@/components/ui/SocialSquircleIcons'
import { AdminReview, AdminInquiry, ActivityLogItem } from '@/types/admin'

export default function AdminDashboardPage() {
  const { can, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    pendingReviews: 0,
    newInquiries: 0,
    totalLocations: 0,
    totalTeam: 0,
    totalUsers: 0,
  })
  const [pendingReviews, setPendingReviews] = useState<AdminReview[]>([])
  const [latestInquiries, setLatestInquiries] = useState<AdminInquiry[]>([])
  const [recentActivities, setRecentActivities] = useState<ActivityLogItem[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // 1. Stats Queries in parallel
      const [
        { count: totalProps },
        { count: availProps },
        { count: rentProps },
        { count: pendReviews },
        { count: newInq },
        { count: totalLocs },
        { count: totalTeamCount },
        { count: totalUsersCount },
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE'),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'RENTED'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
        supabase.from('locations').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        totalProperties: totalProps || 0,
        availableProperties: availProps || 0,
        rentedProperties: rentProps || 0,
        pendingReviews: pendReviews || 0,
        newInquiries: newInq || 0,
        totalLocations: totalLocs || 0,
        totalTeam: totalTeamCount || 0,
        totalUsers: totalUsersCount || 0,
      })

      // 2. Latest Pending Reviews
      const { data: revs } = await supabase
        .from('reviews')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(5)

      setPendingReviews((revs as AdminReview[]) || [])

      // 3. Latest Inquiries
      const { data: inqs } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(id, title, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setLatestInquiries((inqs as AdminInquiry[]) || [])

      // 4. Recent Activity Logs (if permitted)
      if (can('activity_logs.view')) {
        const { data: acts } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setRecentActivities((acts as ActivityLogItem[]) || [])
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleReviewAction = async (reviewId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(reviewId)
      const { error } = await supabase
        .from('reviews')
        .update({
          status: newStatus,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)

      if (!error) {
        // Log activity
        await supabase.from('activity_logs').insert({
          actor_id: user?.id,
          actor_email: user?.email,
          action: newStatus === 'APPROVED' ? 'APPROVE' : 'REJECT',
          entity: 'review',
          entity_id: reviewId,
          summary: `${newStatus === 'APPROVED' ? 'Approved' : 'Rejected'} property review`,
        })

        // Refresh pending reviews
        setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId))
        setStats((prev) => ({
          ...prev,
          pendingReviews: Math.max(0, prev.pendingReviews - 1),
        }))
      }
    } catch (err) {
      console.error('Review moderation error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Real-time summary of Kanpur rental operations, verification pipeline, and team actions.
        </p>
      </div>

      {/* 8 Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          {
            label: 'Total Properties',
            value: stats.totalProperties,
            sub: `${stats.availableProperties} available · ${stats.rentedProperties} rented`,
            icon: Building,
            href: '/admin/properties',
            color: 'from-blue-600 to-cyan-500',
          },
          {
            label: 'Pending Reviews',
            value: stats.pendingReviews,
            sub: stats.pendingReviews > 0 ? 'Requires approval' : 'All clear',
            icon: Star,
            href: '/admin/reviews',
            color: stats.pendingReviews > 0 ? 'from-amber-600 to-yellow-500' : 'from-emerald-600 to-teal-500',
            badge: stats.pendingReviews > 0,
          },
          {
            label: 'New Inquiries',
            value: stats.newInquiries,
            sub: 'Unaddressed visits / leads',
            icon: MessageSquare,
            href: '/admin/inquiries',
            color: 'from-purple-600 to-pink-500',
          },
          {
            label: 'Kanpur Areas',
            value: stats.totalLocations,
            sub: 'Active coverage locations',
            icon: MapPin,
            href: '/admin/locations',
            color: 'from-emerald-600 to-teal-500',
          },
        ].map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative p-5 rounded-2xl border border-white/10 bg-[#0E0A20] hover:border-primary/40 transition-all duration-300 shadow-lg shadow-black/30 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {loading ? '...' : card.value}
              </div>

              <p className="text-[11px] text-text-muted truncate">{card.sub}</p>
            </Link>
          )
        })}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Pending Reviews */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-400" />
                <h2 className="text-base font-bold text-white">Pending Reviews Moderation</h2>
              </div>
              <Link href="/admin/reviews" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-text-muted">Loading pending reviews...</div>
            ) : pendingReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                🎉 No pending reviews waiting for moderation.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">{rev.reviewer_name || 'Anonymous Tenant'}</span>
                        <span className="text-[11px] text-text-muted ml-2">
                          on {rev.property?.title || 'Property'}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary italic line-clamp-2">&ldquo;{rev.comment}&rdquo;</p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        disabled={actionLoading === rev.id}
                        onClick={() => handleReviewAction(rev.id, 'REJECTED')}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === rev.id}
                        onClick={() => handleReviewAction(rev.id, 'APPROVED')}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold text-[#04121a] bg-primary hover:bg-primary/90 font-bold transition-all flex items-center gap-1 shadow"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Latest Inquiries */}
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <h2 className="text-base font-bold text-white">Latest Customer Inquiries</h2>
              </div>
              <Link href="/admin/inquiries" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-text-muted">Loading inquiries...</div>
            ) : latestInquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">No inquiries received yet.</div>
            ) : (
              <div className="space-y-3">
                {latestInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                        <StatusBadge status={inq.status} />
                      </div>
                      <p className="text-[11px] text-text-muted truncate">
                        {inq.property?.title ? `For: ${inq.property.title}` : inq.message || 'General inquiry'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inq.phone && (
                        <>
                          <a
                            href={`tel:${inq.phone}`}
                            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center justify-center transition-colors"
                            title="Call Customer"
                          >
                            <Phone size={14} />
                          </a>
                          <a
                            href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <WhatsAppLogo className="h-3.5 w-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity Log */}
      {can('activity_logs.view') && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0A20] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <History size={18} className="text-purple-400" />
              <h2 className="text-base font-bold text-white">System Audit &amp; Activity Log</h2>
            </div>
            <Link href="/admin/activity" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Full Audit Trail <ArrowRight size={12} />
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-muted">No activity logs recorded yet.</div>
          ) : (
            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={act.action} />
                    <div>
                      <span className="text-white font-medium">{act.summary}</span>
                      <span className="text-[11px] text-text-muted ml-2">by {act.actor_email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
