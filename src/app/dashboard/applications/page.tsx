'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { RentalApplication } from '@/types'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Home,
  ArrowRight,
  Plus,
  AlertCircle,
  Trash2,
} from 'lucide-react'

export default function TenantApplicationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const supabase = createClient()

  const loadApplications = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase
        .from('rental_applications')
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

      if (error) {
        // Handle gracefully if table is empty or newly provisioned
        console.warn('Applications query notice:', error)
        setApplications([])
      } else {
        setApplications(data || [])
      }
    } catch (err: any) {
      console.error('Failed to load rental applications:', err)
      setErrorMsg(err.message || 'Error loading applications.')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadApplications()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  const handleCancelApplication = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw this rental application?')) return
    setCancellingId(appId)

    try {
      const { error } = await supabase
        .from('rental_applications')
        .delete()
        .eq('id', appId)
        .eq('user_id', user!.id)

      if (!error) {
        setApplications((prev) => prev.filter((a) => a.id !== appId))
      } else {
        setErrorMsg('Unable to withdraw application. It may already be in review.')
      }
    } catch (err) {
      console.error('Failed to withdraw application:', err)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={20} className="text-primary" /> Rental Applications
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track your rental application approvals and lease agreement status
          </p>
        </div>

        <Link
          href="/rentals"
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto shadow-md"
        >
          <Plus size={15} /> Apply to New Rental
        </Link>
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
          <p className="text-xs text-text-muted">Loading your rental applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Active Applications</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            You have not applied for any rental properties yet. Browse verified Kanpur listings and schedule an on-site physical tour or submit an application.
          </p>
          <Link href="/rentals" className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
            Explore Verified Rentals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const prop = app.property
            const isUnderReview = app.status === 'UNDER_REVIEW'
            const isApproved = app.status === 'APPROVED'
            const isRejected = app.status === 'REJECTED'
            const isLeaseGen = app.status === 'LEASE_GENERATED'

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 transition-all hover:border-white/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[11px] font-semibold text-text-muted tracking-wider uppercase">
                      Application #{app.id.substring(0, 8)} · Applied on {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {prop?.title || 'Rental Property'}
                    </h3>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                      <Home size={13} className="text-accent-cyan" />{' '}
                      {prop?.address || prop?.location?.name || 'Kanpur'} · ₹{prop?.price ? prop.price.toLocaleString() : 'N/A'}/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isUnderReview && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                        <Clock size={13} /> Under Landlord Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 size={13} /> Approved
                      </span>
                    )}
                    {isLeaseGen && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                        <FileText size={13} /> Lease Prepared
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                        <XCircle size={13} /> Not Selected
                      </span>
                    )}

                    {isUnderReview && (
                      <button
                        type="button"
                        onClick={() => handleCancelApplication(app.id)}
                        disabled={cancellingId === app.id}
                        className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Withdraw Application"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                  <div>
                    <span className="text-text-muted block text-[11px]">Proposed Move-in:</span>
                    <span className="text-white font-medium">
                      {app.move_in_date ? new Date(app.move_in_date).toLocaleDateString() : 'Flexible'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Occupants:</span>
                    <span className="text-white font-medium">{app.occupants || 1} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Verification Status:</span>
                    <span className="text-accent-cyan font-medium">Documents Under Review</span>
                  </div>
                </div>

                {prop?.slug && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <Link
                      href={`/rentals/${prop.slug}`}
                      className="text-xs text-text-secondary hover:text-white flex items-center gap-1 font-semibold transition-colors"
                    >
                      View Property Details <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
