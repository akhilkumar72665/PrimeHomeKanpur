'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { FileText, CheckCircle2, XCircle, Clock, ShieldCheck, User, AlertCircle } from 'lucide-react'

export default function LandlordApplicationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const supabase = createClient()

  const loadApplications = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      // 1. Fetch landlord's owned properties
      const { data: props, error: propsError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('created_by', user.id)

      if (propsError || !props || props.length === 0) {
        setApplications([])
        setLoading(false)
        return
      }

      const propIds = props.map((p) => p.id)
      const propMap = new Map(props.map((p) => [p.id, p.title]))

      // 2. Fetch rental_applications on owned properties
      const { data: apps, error: appsError } = await supabase
        .from('rental_applications')
        .select('*')
        .in('property_id', propIds)
        .order('created_at', { ascending: false })

      if (appsError) {
        console.warn('Landlord applications notice:', appsError)
        setApplications([])
      } else {
        const enriched = (apps || []).map((app) => ({
          ...app,
          propertyTitle: propMap.get(app.property_id) || 'Listed Property',
        }))
        setApplications(enriched)
      }
    } catch (err: any) {
      console.error('Landlord applications error:', err)
      setErrorMsg(err.message || 'Error loading tenant applications.')
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

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setActionId(id)
    setErrorMsg(null)

    try {
      const { error } = await supabase
        .from('rental_applications')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        setErrorMsg('Failed to update application status.')
      } else {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        )
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating status.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText size={20} className="text-primary" /> Tenant Applications
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Review tenant background information, employment status, and approve rental agreements
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
          <p className="text-xs text-text-muted">Loading tenant applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Applications Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            When tenants apply for your listed Kanpur properties, their profile and proposed move-in dates will appear here for your review and lease approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    Application #{app.id.substring(0, 8)} · Applied {new Date(app.created_at).toLocaleDateString()}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Tenant Applicant
                  </h3>
                  <p className="text-xs text-accent-cyan mt-0.5">{app.propertyTitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'UNDER_REVIEW' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                        disabled={actionId === app.id}
                        className="btn px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 size={14} /> Accept Tenant
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        disabled={actionId === app.id}
                        className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 border border-rose-500/20 hover:bg-rose-500/10"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                <div>
                  <span className="text-text-muted block text-[11px]">Proposed Move-in</span>
                  <span className="text-white font-medium">
                    {app.move_in_date ? new Date(app.move_in_date).toLocaleDateString() : 'Flexible'}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Occupants</span>
                  <span className="text-white font-medium">{app.occupants || 1} Member(s)</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Police Verification</span>
                  <span className="text-emerald-400 font-medium">Assisted by PrimeHome</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
