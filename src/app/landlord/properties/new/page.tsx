'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Building, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export default function NewLandlordPropertyPage() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [title, setTitle] = useState('')
  const [locality, setLocality] = useState('Kakadeo')
  const [address, setAddress] = useState('')
  const [bhk, setBhk] = useState('2')
  const [bathrooms, setBathrooms] = useState('2')
  const [rent, setRent] = useState('')
  const [deposit, setDeposit] = useState('')
  const [maintenance, setMaintenance] = useState('0')
  const [furnishing, setFurnishing] = useState('Semi-Furnished')
  const [tenantType, setTenantType] = useState('Family')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdProperty, setCreatedProperty] = useState<{
    id: string
    title: string
    slug: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isAuthenticated) {
      openAuthModal('Please sign in to list your property for verification.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/landlord/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          locality: locality.trim(),
          address: address.trim(),
          bhk: Number(bhk),
          bathrooms: Number(bathrooms),
          rent: Number(rent),
          deposit: deposit ? Number(deposit) : null,
          maintenance: maintenance ? Number(maintenance) : 0,
          furnishing,
          tenantType,
          description: description.trim() || undefined,
          phone: phone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoading(false)
        setErrorMsg(data.error || 'Failed to submit property listing.')
        return
      }

      setLoading(false)
      setCreatedProperty({
        id: data.property.id,
        title: data.property.title,
        slug: data.property.slug,
      })
      setSuccess(true)
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || 'A network error occurred while submitting.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Link
          href="/landlord/properties"
          className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building size={20} className="text-primary" /> Submit Rental for Verification
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Fill out property specifications. Our field executive will visit to inspect and take professional photos.
          </p>
        </div>
      </div>

      {success ? (
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Property Submitted for Verification!</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
            Thank you! Your listing <strong className="text-white">&ldquo;{createdProperty?.title}&rdquo;</strong> has been saved in <span className="text-purple-300 font-semibold">DRAFT (Pending Review)</span>.
          </p>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Our Kanpur field executive will contact you to schedule the free physical walkthrough, verify documents, and activate your listing on the public marketplace.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/landlord/properties" className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
              View My Listed Properties
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-[#0E0B1F] p-6 sm:p-8">
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider">
              1. Basic Property Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spacious 2BHK Near Coaching Hub"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Kanpur Locality *
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="Kakadeo">Kakadeo</option>
                  <option value="Swaroop Nagar">Swaroop Nagar</option>
                  <option value="Civil Lines">Civil Lines</option>
                  <option value="Kalyanpur">Kalyanpur</option>
                  <option value="Gurudev Chauraha">Gurudev Chauraha</option>
                  <option value="Shyam Nagar">Shyam Nagar</option>
                  <option value="Kidwai Nagar">Kidwai Nagar</option>
                  <option value="Tilak Nagar">Tilak Nagar</option>
                  <option value="Arya Nagar">Arya Nagar</option>
                  <option value="Awas Vikas">Awas Vikas</option>
                  <option value="Barra">Barra</option>
                  <option value="Govind Nagar">Govind Nagar</option>
                  <option value="Vijay Nagar">Vijay Nagar</option>
                  <option value="Rawatpur">Rawatpur</option>
                  <option value="Cantt">Cantt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No., Road, Landmark, Kanpur"
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section 2: Configuration & Pricing */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider">
              2. Configuration &amp; Commercial Terms
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Bedrooms (BHK)</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Bathrooms</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm"
                >
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Furnishing</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Preferred Tenant</label>
                <select
                  value={tenantType}
                  onChange={(e) => setTenantType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#140F2B] border border-white/10 text-white text-sm"
                >
                  <option value="Family">Family Only</option>
                  <option value="Bachelor">Bachelors / Students</option>
                  <option value="Professional">Working Professionals</option>
                  <option value="Any">Any / Open</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  placeholder="e.g. 18000"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="e.g. 36000"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Maintenance (₹/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Description */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider">
              3. Description &amp; Direct Phone
            </h3>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Direct Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number for agent coordination"
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Property Description &amp; Highlights
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention key highlights: 24h water, balcony view, nearby landmarks, vehicle parking..."
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Verification Protocol Badge */}
          <div className="rounded-xl bg-purple-950/40 border border-purple-800/30 p-4 flex items-start gap-3 text-xs text-text-secondary">
            <ShieldCheck className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Physical Verification Guarantee:</strong> No property is published until an on-site visit is performed by PrimeHomeKanpur. Photos and video are taken free of cost.
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting for Verification...' : 'Submit Listing for Free Inspection'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
