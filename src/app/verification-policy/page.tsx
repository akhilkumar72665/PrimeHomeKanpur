import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ShieldCheck, CheckCircle2, Search, Home, FileText, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Property Verification Policy & Standards | PrimeHomeKanpur',
  description: 'Learn how PrimeHomeKanpur conducts 100% on-site physical inspections, water and power audits, photo verification, and ownership authentication in Kanpur.',
  alternates: {
    canonical: '/verification-policy',
  },
}

export default function VerificationPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Verification Policy</span>
            </div>
            <span className="pill mb-3"><span className="dot" />Quality &amp; Trust Assurance</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              Property <span className="hl">Verification Policy</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl">
              PrimeHomeKanpur’s core promise is 100% physical on-site verification. Discover our multi-point inspection protocol that protects tenants from fake photos, hidden charges, and ghost listings.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="sect bg-bg py-12 md:py-16">
          <div className="wrap max-w-4xl mx-auto space-y-10">

            {/* 6-Pillar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">1. Authentic Photography &amp; Video</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Every photo and walkthrough video published on PrimeHomeKanpur is captured on-site by our field executives. We never permit stock renders, airbrushed mockups, or photos from other properties.
                </p>
              </div>

              <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan mb-3">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">2. Physical Utility &amp; Water Check</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  We inspect overhead water tanks, submersible pump arrangements, independent electric sub-meters, seepage/dampness, and ventilation before approving the listing.
                </p>
              </div>

              <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">3. Landlord Ownership &amp; Identity</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  We confirm property ownership or legal letting authority with the landlord to prevent unauthorized subletting, disputes, or fraudulent middlemen.
                </p>
              </div>

              <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-accent-cyan mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">4. Transparent Rent &amp; Deposit Audit</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Rent, security deposit amount, maintenance dues, and tenant restrictions (Family / Bachelor / Dietary rules) are documented and agreed upon in writing prior to publishing.
                </p>
              </div>
            </div>

            {/* Re-verification & Stale Listing Control */}
            <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-3">Continuous Availability Monitoring &amp; Stale Detection</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                To guarantee that tenants never waste time calling for already-rented homes, PrimeHomeKanpur performs automated and weekly phone audits with property owners.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Listings unverified for over 30 days are automatically marked with <strong>&quot;Availability needs confirmation&quot;</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Listings marked rented are immediately transitioned to <strong>RENTED</strong> status and taken off active visit scheduling</span>
                </li>
              </ul>
            </div>

            {/* Reporting Suspicious Listings */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Community Reporting</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                If you ever find an inaccuracy, discrepancy, or rented property still showing as available, click <strong>&quot;Report Listing&quot;</strong> on the property page. Our team investigates every report within 24 hours.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
