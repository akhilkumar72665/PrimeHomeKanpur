'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import PropertyMediaViewer from '@/components/properties/PropertyMediaViewer'
import BookVisitModal from '@/components/modals/BookVisitModal'
import WriteReviewModal from '@/components/modals/WriteReviewModal'
import PropertyCard from '@/components/cards/PropertyCard'
import { useAuth } from '@/contexts/AuthContext'
import { Property } from '@/types'
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Building,
  Check,
  ArrowRight,
  Shield,
  Lightbulb,
  Compass,
  Heart,
  Star,
  Calendar,
  Share2,
  Film
} from 'lucide-react'

interface PropertyDetailClientProps {
  property: Property
  similarProperties: Property[]
}

export default function PropertyDetailClient({
  property,
  similarProperties,
}: PropertyDetailClientProps) {
  const [bookVisitOpen, setBookVisitOpen] = useState(false)
  const [writeReviewOpen, setWriteReviewOpen] = useState(false)
  const { user, isAuthenticated, openAuthModal } = useAuth()

  const handleBookVisitClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in to schedule a property visit.')
    } else {
      setBookVisitOpen(true)
    }
  }

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in to write a review for this property.')
    } else {
      setWriteReviewOpen(true)
    }
  }

  return (
    <div>
      {/* 1. Page Header */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/rentals">Rentals</Link>
            <span>/</span>
            <span className="truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="pill mb-3"><span className="dot" />Verified Kanpur Rental</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <MapPin className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>{property.address || property.location?.name || 'Kanpur'}, Kanpur</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBookVisitClick}
                className="btn btn-primary px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-900/40 btn-loop-shine"
              >
                <Calendar size={16} /> Schedule Visit (₹300)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Media Gallery & Main Content */}
      <section className="sect pt-8 bg-bg">
        <div className="wrap">
          {/* Photos / Video Media Viewer */}
          <div className="mb-10">
            <PropertyMediaViewer
              images={property.images}
              videoUrl={property.video_url}
              title={property.title}
            />
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Price Card */}
              <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                  <div className="price text-3xl md:text-4xl font-extrabold text-white">
                    ₹{property.price.toLocaleString()} <small className="text-sm text-text-muted">/ month</small>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                    {property.status || 'AVAILABLE'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5 text-xs sm:text-sm text-text-secondary">
                  <div>
                    <span className="text-text-muted">Deposit:</span> ₹{(property.security_deposit || property.price * 2).toLocaleString()}
                  </div>
                  <div>·</div>
                  <div>
                    <span className="text-text-muted">Maintenance:</span> ₹{(property.maintenance || Math.round(property.price * 0.05)).toLocaleString()}/mo
                  </div>
                  <div>·</div>
                  <div>
                    <span className="text-text-muted">Furnishing:</span> {property.furnishing || 'Semi-Furnished'}
                  </div>
                  <div>·</div>
                  <div>
                    <span className="text-text-muted">Tenant:</span> {property.tenant_type}
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6">Property Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                    <div className="text-2xl font-extrabold text-primary mb-1">{property.bhk}</div>
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Bedrooms (BHK)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                    <div className="text-2xl font-extrabold text-primary mb-1">{property.bathrooms || 2}</div>
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Bathrooms</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                    <div className="text-2xl font-extrabold text-primary mb-1">{property.area_sqft.toLocaleString()}</div>
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Super Builtup (sqft)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A0719] border border-white/5 text-center">
                    <div className="text-2xl font-extrabold text-primary mb-1">{property.floor || 2} / {property.total_floors || 4}</div>
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Floor Level</div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6">Amenities &amp; Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    'Covered Two-Wheeler Parking',
                    '24×7 Water Supply',
                    'Power Backup Provision',
                    'Balcony / Garden View',
                    'Gated Residential Building',
                    'Modular Kitchen Setup',
                    'AC Points in Bedrooms',
                    'Independent Electric Meter',
                    'Family-Friendly Neighborhood',
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2.5 text-text-secondary text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-accent-cyan shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Detailed Description</h3>
                <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                  <p>{property.description}</p>
                  <p>
                    Verified physically by PrimeHomeKanpur listing executives. Complete inspection conducted for water storage, electrical lines, and neighborhood access.
                  </p>
                </div>
              </div>

              {/* Review / Testimonial Action */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#1A0F3D] to-[#110A29] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-400 fill-current" /> Have you visited or rented this property?
                  </h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Help fellow tenants in Kanpur by sharing your verified feedback.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleWriteReviewClick}
                  className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-semibold shrink-0 text-white border border-white/10 hover:border-amber-400"
                >
                  Write a Review
                </button>
              </div>
            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Agent Card */}
              <div className="card p-6 text-center bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#00C2D9] flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-3 shadow-md">
                  AP
                </div>
                <h4 className="text-base font-bold text-white">Abhishek Pathak</h4>
                <p className="text-accent-cyan text-xs font-semibold uppercase tracking-wider mb-4">
                  Founder &amp; Listing Lead · 14 yrs exp
                </p>

                <div className="space-y-2.5">
                  <a href="tel:+919151435647" className="btn orange w-full text-xs font-bold py-2.5">
                    <Phone className="w-4 h-4 mr-1 text-[#EC4899]" /> Call: +91 9151435647
                  </a>
                  <a
                    href="https://wa.me/919151435647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn outline w-full text-xs font-semibold py-2.5"
                  >
                    <MessageSquare className="w-4 h-4 mr-1 text-[#25D366]" /> Chat on WhatsApp
                  </a>
                  <a href="mailto:primehomekanpur@gmail.com" className="btn dark w-full text-xs font-semibold py-2.5">
                    <Mail className="w-4 h-4 mr-1" /> Email PrimeHome
                  </a>
                </div>
              </div>

              {/* Transparent Fees Notice */}
              <div className="card p-6 bg-gradient-to-b from-[#1E1145] to-[#0E0A20] rounded-2xl border border-purple-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Transparent Brokerage &amp; Fees</h4>
                </div>
                <ul className="space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                    <span><strong>15 Days Rent</strong> as brokerage upon deal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                    <span><strong>₹300 visit charge</strong> per physical tour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                    <span><strong>Free call consultation</strong> anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                    <span>Standard 11-month lease agreement drafted free</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Similar Rentals */}
      {similarProperties.length > 0 && (
        <section className="sect gray">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <span className="pill"><span className="dot" />Similar Rentals</span>
                <h2 className="mt-4">You might also <span className="hl">like these in Kanpur</span></h2>
              </div>
              <Link href="/rentals" className="btn orange shrink-0">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="listings">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <BookVisitModal
        property={property}
        isOpen={bookVisitOpen}
        onClose={() => setBookVisitOpen(false)}
      />

      <WriteReviewModal
        property={property}
        isOpen={writeReviewOpen}
        onClose={() => setWriteReviewOpen(false)}
      />
    </div>
  )
}
