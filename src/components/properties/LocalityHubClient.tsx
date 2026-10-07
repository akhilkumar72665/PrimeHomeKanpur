'use client'

import React from 'react'
import Link from 'next/link'
import PropertyCard from '@/components/cards/PropertyCard'
import { Property } from '@/types'
import {
  MapPin,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  ArrowRight,
  School,
  Bus,
  Shield,
  HelpCircle,
  Phone
} from 'lucide-react'

export interface LocalityInfo {
  name: string
  slug: string
  tagline: string
  description: string
  avgRent1BHK: string
  avgRent2BHK: string
  avgRent3BHK: string
  landmarks: string[]
  connectivity: string
  faqs: { q: string; a: string }[]
}

interface LocalityHubClientProps {
  locality: LocalityInfo
  properties: Property[]
}

export default function LocalityHubClient({ locality, properties }: LocalityHubClientProps) {
  return (
    <div>
      {/* 1. Page Hero */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/rentals">Rentals</Link>
            <span>/</span>
            <span>{locality.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="pill"><span className="dot" />Kanpur Locality Hub</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} /> Physically Verified Area
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                Rental Properties in <span className="hl">{locality.name}</span>, Kanpur
              </h1>
              <p className="text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
                {locality.tagline} · Browse 100% physically inspected flats, independent builder floors, and student accommodations with transparent brokerage.
              </p>
            </div>

            <Link
              href={`/contact?location=${encodeURIComponent(locality.name)}`}
              className="btn btn-primary px-5 py-3 rounded-xl font-bold text-xs sm:text-sm self-start md:self-auto shadow-lg shadow-purple-900/40"
            >
              Request Assisted Tour
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Listings Grid */}
      <section className="sect bg-bg py-10">
        <div className="wrap">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Verified Rentals in {locality.name} ({properties.length})
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Every listing is physically verified by our Kanpur field inspection team
              </p>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 text-text-muted flex items-center justify-center mx-auto mb-3">
                <Building size={28} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">New Listings Arriving This Week</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto mb-5 leading-relaxed">
                Our field team is actively inspecting new flats in {locality.name}. Contact us for direct offline matching.
              </p>
              <Link href="/contact" className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
                Speak with {locality.name} Specialist
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Locality Overview & Rental Price Trends */}
      <section className="sect gray py-12">
        <div className="wrap max-w-5xl mx-auto space-y-10">
          <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-3">About {locality.name} Rental Market</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              {locality.description}
            </p>

            {/* Average Rent Table */}
            <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider mb-3">
              Estimated Monthly Rent Overview ({locality.name})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                <div className="text-text-muted mb-1 font-semibold">1 BHK Apartment</div>
                <div className="text-lg font-extrabold text-white">{locality.avgRent1BHK}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                <div className="text-text-muted mb-1 font-semibold">2 BHK Family Flat</div>
                <div className="text-lg font-extrabold text-primary">{locality.avgRent2BHK}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                <div className="text-text-muted mb-1 font-semibold">3 BHK Builder Floor</div>
                <div className="text-lg font-extrabold text-white">{locality.avgRent3BHK}</div>
              </div>
            </div>
          </div>

          {/* Landmarks & Connectivity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <School size={18} className="text-accent-cyan" /> Key Landmarks &amp; Amenities
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                {locality.landmarks.map((l) => (
                  <li key={l} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Bus size={18} className="text-accent-cyan" /> Connectivity &amp; Transport
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {locality.connectivity}
              </p>
            </div>
          </div>

          {/* Locality FAQs */}
          {locality.faqs.length > 0 && (
            <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-primary" /> Frequently Asked Questions in {locality.name}
              </h2>
              <div className="divide-y divide-white/5">
                {locality.faqs.map((faq, i) => (
                  <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                    <h4 className="text-sm font-bold text-white mb-1">{faq.q}</h4>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
