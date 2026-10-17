'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building,
  Plus,
  MapPin,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react'

interface LandlordProperty {
  id: string
  slug: string
  title: string
  price: number
  bhk: number
  bathrooms?: number
  furnishing: string
  tenant_type: string
  status: 'DRAFT' | 'AVAILABLE' | 'RENTED' | 'RESERVED' | 'INACTIVE' | 'HIDDEN'
  address: string
  created_at: string
  location?: {
    name: string
  }
}

export default function LandlordPropertiesPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth()
  const [properties, setProperties] = useState<LandlordProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loadProperties = async () => {
    if (!user?.id) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/landlord/properties')
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to load properties.')
        setProperties([])
      } else {
        setProperties(data.properties || [])
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error loading properties.')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadProperties()
      } else {
        setLoading(false)
      }
    }
  }, [authLoading, isAuthenticated, user?.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building size={20} className="text-primary" /> My Listed Properties
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your rental listings, inspect physical verification status, and monitor visibility
          </p>
        </div>

        {isAuthenticated && (
          <Link
            href="/landlord/properties/new"
            className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto shadow-md"
          >
            <Plus size={15} /> Add New Property
          </Link>
        )}
      </div>

      {!isAuthenticated && !authLoading && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-purple-500/10 text-primary flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Landlord Sign-In Required</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            Please sign in to view and manage your verified Kanpur properties and review inspection walkthroughs.
          </p>
          <button
            onClick={() => openAuthModal('Please sign in to view your properties.')}
            className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
          >
            Sign In to Dashboard
          </button>
        </div>
      )}

      {isAuthenticated && loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-text-muted">Loading your listed properties...</p>
        </div>
      )}

      {isAuthenticated && !loading && errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-300">
          <AlertCircle size={18} className="shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Error Loading Properties</p>
            <p className="text-rose-400/90 mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={loadProperties}
            className="btn btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {isAuthenticated && !loading && !errorMsg && properties.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Building size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Listed Properties Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6 leading-relaxed">
            You have not listed any rental properties yet. Submit your Kanpur property for free physical verification and professional photography.
          </p>
          <Link
            href="/landlord/properties/new"
            className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus size={15} /> List Your First Property
          </Link>
        </div>
      )}

      {isAuthenticated && !loading && !errorMsg && properties.length > 0 && (
        <div className="space-y-4">
          {properties.map((prop) => {
            const isDraft = prop.status === 'DRAFT'
            const isLive = prop.status === 'AVAILABLE'

            return (
              <div
                key={prop.id}
                className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-5 sm:p-6 transition-all hover:border-white/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {isDraft ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                          <Clock size={12} /> DRAFT (PENDING VERIFICATION)
                        </span>
                      ) : isLive ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> LIVE (VERIFIED)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold">
                          {prop.status}
                        </span>
                      )}

                      <span className="text-[11px] text-text-muted">
                        Submitted: {new Date(prop.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{prop.title}</h3>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} className="text-accent-cyan" /> {prop.address || prop.location?.name || 'Kanpur'} · {prop.bhk} BHK · {prop.furnishing}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left md:text-right mr-2">
                      <div className="text-lg font-black text-white">
                        ₹{prop.price.toLocaleString()}
                        <small className="text-xs text-text-muted">/mo</small>
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {isDraft ? 'Inspection Walkthrough Pending' : 'Publicly Listed'}
                      </div>
                    </div>

                    {isLive ? (
                      <Link
                        href={`/rentals/${prop.slug}`}
                        target="_blank"
                        className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 hover:border-accent-cyan"
                      >
                        <Eye size={14} /> View Live Listing
                      </Link>
                    ) : (
                      <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-text-muted flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-400" /> Awaiting Field Inspection
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-text-secondary">
                  <div>
                    <span className="text-text-muted block text-[11px]">Preferred Tenant</span>
                    <span className="text-white font-medium">{prop.tenant_type}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Field Inspection Walkthrough</span>
                    <span className={isDraft ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      {isDraft ? 'Scheduled within 24h' : 'Completed & Verified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Listing Protocol</span>
                    <span className="text-accent-cyan font-medium">Free Photos &amp; Verified Badge</span>
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
