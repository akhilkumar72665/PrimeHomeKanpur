'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, IndianRupee, Users, SlidersHorizontal, X, Check, ArrowRight } from 'lucide-react'

const KANPUR_LOCATIONS = [
  'All Kanpur areas',
  'Gurudev Chauraha',
  'Kakadeo',
  'Vijay Nagar',
  'Vikas Nagar',
  'Awas Vikas',
  'Swaroop Nagar',
  'Civil Lines',
  'Barra',
  'Kalyanpur',
  'Kidwai Nagar',
  'Govind Nagar',
]

const BHK_OPTIONS = [
  { label: 'Any BHK', value: '' },
  { label: '1 BHK', value: '1' },
  { label: '2 BHK', value: '2' },
  { label: '3 BHK', value: '3' },
  { label: '4+ BHK', value: '4' },
]

const PRICE_OPTIONS = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹10k', value: 'under-10k' },
  { label: '₹10k – ₹20k', value: '10k-20k' },
  { label: '₹20k – ₹30k', value: '20k-30k' },
  { label: 'Above ₹30k', value: 'above-30k' },
]

const TENANT_OPTIONS = [
  { label: 'Any Tenant', value: '' },
  { label: 'Family', value: 'Family' },
  { label: 'Bachelor', value: 'Bachelor' },
  { label: 'Professional', value: 'Professional' },
]

export default function HomeSearchSection() {
  const router = useRouter()
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  // Filter States
  const [location, setLocation] = useState('')
  const [bhk, setBhk] = useState('')
  const [price, setPrice] = useState('')
  const [tenant, setTenant] = useState('')

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setMobileSheetOpen(false)

    const params = new URLSearchParams()
    if (location && location !== 'All Kanpur areas') params.set('location', location)
    if (bhk) params.set('bhk', bhk)
    if (price) params.set('price', price)
    if (tenant && tenant !== 'Any') params.set('tenant', tenant)

    router.push(`/rentals${params.toString() ? `?${params.toString()}` : ''}`)
  }

  // Active filters count
  const activeCount = [
    location && location !== 'All Kanpur areas',
    bhk,
    price,
    tenant && tenant !== 'Any'
  ].filter(Boolean).length

  return (
    <div className="w-full">
      {/* 1. DESKTOP SEARCH BAR (Hidden on small mobile screens) */}
      <div className="hidden md:block">
        <form onSubmit={handleSearchSubmit} className="card-s">
          <div className="field">
            <label htmlFor="desk-hero-location">Location</label>
            <select
              id="desk-hero-location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {KANPUR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc === 'All Kanpur areas' ? '' : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="desk-hero-bhk">BHK</label>
            <select
              id="desk-hero-bhk"
              name="bhk"
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
            >
              {BHK_OPTIONS.map((b) => (
                <option key={b.label} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="desk-hero-price">Price Range</label>
            <select
              id="desk-hero-price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              {PRICE_OPTIONS.map((p) => (
                <option key={p.label} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="desk-hero-tenant">Tenant Type</label>
            <select
              id="desk-hero-tenant"
              name="tenant"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            >
              {TENANT_OPTIONS.map((t) => (
                <option key={t.label} value={t.value === 'Any Tenant' ? '' : t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit" className="btn orange w-full">
              <Search className="w-4 h-4 mr-1" /> Search Rentals
            </button>
          </div>
        </form>
      </div>

      {/* 2. MOBILE ENHANCED SEARCH CARD */}
      <div className="md:hidden">
        <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#18113C]/95 via-[#130D33]/95 to-[#0E0A24]/95 p-4 shadow-2xl backdrop-blur-xl space-y-3.5">
          {/* Location Selector */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10">
            <MapPin size={18} className="text-[#00C2D9] shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor="mobile-hero-location" className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Location in Kanpur
              </label>
              <select
                id="mobile-hero-location"
                aria-label="Select Kanpur Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer truncate"
              >
                {KANPUR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc === 'All Kanpur areas' ? '' : loc} className="bg-[#0E0A24] text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Chips (BHK + More Filters Button) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {BHK_OPTIONS.slice(1).map((b) => {
              const isSelected = bhk === b.value
              return (
                <button
                  type="button"
                  key={b.label}
                  onClick={() => setBhk(isSelected ? '' : b.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-[#00C2D9] text-black border-[#00C2D9] shadow-md shadow-cyan-950/50'
                      : 'bg-white/[0.04] text-white/90 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {b.label}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setMobileSheetOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                activeCount > 0
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white/[0.06] text-white/90 border-white/15'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>{activeCount > 0 ? `${activeCount} Filters` : 'More Filters'}</span>
            </button>
          </div>

          {/* Search CTA */}
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00C2D9] to-[#22D3EE] text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 active:scale-[0.98] transition-transform btn-loop-shine"
          >
            <Search size={17} />
            <span>Search Kanpur Rentals</span>
          </button>
        </div>
      </div>

      {/* 3. MOBILE BOTTOM SHEET MODAL */}
      {mobileSheetOpen && (
        <div
          className="fixed inset-0 z-[9999] md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="w-full max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-white/15 bg-[#0E0A24] p-5 shadow-2xl space-y-5"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                <h3 className="text-base font-bold text-white">Filter Kanpur Rentals</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:text-white bg-white/5"
                aria-label="Close search filters"
              >
                <X size={18} />
              </button>
            </div>

            {/* 1. Location Selection */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-accent-pink" /> Location / Area
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm font-medium focus:outline-none focus:border-primary"
              >
                {KANPUR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc === 'All Kanpur areas' ? '' : loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. BHK Chips */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Home size={14} className="text-primary" /> Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BHK_OPTIONS.map((b) => {
                  const isSelected = bhk === b.value
                  return (
                    <button
                      type="button"
                      key={b.label}
                      onClick={() => setBhk(isSelected ? '' : b.value)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-primary text-black border-primary shadow-md shadow-cyan-900/40'
                          : 'bg-white/[0.04] text-white border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      {b.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Price Range Chips */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <IndianRupee size={14} className="text-emerald-400" /> Monthly Rent Budget
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRICE_OPTIONS.map((p) => {
                  const isSelected = price === p.value
                  return (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setPrice(isSelected ? '' : p.value)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                          : 'bg-white/[0.04] text-white border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Tenant Preference Chips */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={14} className="text-violet-400" /> Tenant Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TENANT_OPTIONS.map((t) => {
                  const val = t.value === 'Any Tenant' ? '' : t.value
                  const isSelected = tenant === val
                  return (
                    <button
                      type="button"
                      key={t.label}
                      onClick={() => setTenant(isSelected ? '' : val)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                          : 'bg-white/[0.04] text-white border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLocation('')
                  setBhk('')
                  setPrice('')
                  setTenant('')
                }}
                className="h-12 px-4 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-text-muted hover:text-white"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent-cyan text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/50"
              >
                <Search size={16} /> Search Verified Rentals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
