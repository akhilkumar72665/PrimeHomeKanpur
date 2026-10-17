'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Users, Phone, Home, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react'

export default function LandlordLeadsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const loadLeads = async () => {
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
        console.error('Failed to load owned properties:', propsError)
        setErrorMsg('Failed to query properties.')
        setLoading(false)
        return
      }

      if (!props || props.length === 0) {
        setLeads([])
        setLoading(false)
        return
      }

      const propIds = props.map((p) => p.id)
      const propMap = new Map(props.map((p) => [p.id, p.title]))

      // 2. Fetch inquiries for these properties
      const { data: inqs, error: inqsError } = await supabase
        .from('inquiries')
        .select('*')
        .in('property_id', propIds)
        .order('created_at', { ascending: false })

      if (inqsError) {
        console.error('Failed to load inquiries:', inqsError)
        setErrorMsg('Failed to retrieve tenant leads.')
        setLeads([])
      } else {
        const enriched = (inqs || []).map((lead) => ({
          ...lead,
          propertyTitle: propMap.get(lead.property_id) || 'Listed Property',
        }))
        setLeads(enriched)
      }
    } catch (err: any) {
      console.error('Landlord leads error:', err)
      setErrorMsg(err.message || 'Error loading tenant leads.')
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadLeads()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={20} className="text-primary" /> Tenant Inquiries &amp; Leads
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Prospective tenants inquiring directly about your Kanpur rental listings
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
          <p className="text-xs text-text-muted">Loading tenant inquiries...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Inquiries Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            When tenants view your verified listings and submit an inquiry or callback request, they will appear here with direct contact details.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-text-muted">
                    Received on {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{lead.name}</h3>
                  <p className="text-xs text-accent-cyan flex items-center gap-1.5 mt-0.5">
                    <Home size={13} /> {lead.propertyTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="btn btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Phone size={13} /> Call Tenant
                  </a>
                </div>
              </div>

              {lead.message && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                  <span className="text-text-muted block text-[11px] mb-0.5">Tenant Message:</span>
                  &ldquo;{lead.message}&rdquo;
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary">
                <div>
                  <span className="text-text-muted block text-[11px]">Phone Contact:</span>
                  <span className="text-white font-medium">{lead.phone}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Status:</span>
                  <span className="text-emerald-400 font-medium">{lead.status || 'NEW'}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Field Support:</span>
                  <span className="text-accent-cyan font-medium">Assisted by PrimeHome Agent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
