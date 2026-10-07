import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer & Legal Notice | PrimeHomeKanpur',
  description: 'Legal disclaimer and limitation of liability for PrimeHomeKanpur property rental and brokerage platform.',
  alternates: {
    canonical: '/disclaimer',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main className="flex-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Disclaimer</span>
            </div>
            <span className="pill mb-3"><span className="dot" />Legal Information</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              Disclaimer &amp; <span className="hl">Legal Notice</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl">
              Last updated: October 2026 · Important details regarding property representations, third-party agreements, and liability limitations.
            </p>
          </div>
        </section>

        <section className="sect bg-bg py-12 md:py-16">
          <div className="wrap max-w-4xl mx-auto space-y-8 text-sm text-text-secondary leading-relaxed">
            <div className="card p-6 bg-[#0E0B1F] rounded-2xl border border-white/10 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white mb-1">Platform Disclaimer</h3>
                <p className="text-xs sm:text-sm">
                  PrimeHomeKanpur acts as a verified rental marketplace and facilitation intermediary connecting tenants and landlords across Kanpur. While we conduct physical on-site audits, all final rental contracts are entered into directly between the landlord and tenant.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">1. Property Information Accuracy</h2>
              <p>
                Property descriptions, prices, photographs, and amenity details published on PrimeHomeKanpur reflect conditions observed at the time of physical inspection. While we take every effort to maintain real-time accuracy, property availability and landlord terms can change.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">2. Tenancy Agreements &amp; Police Verification</h2>
              <p>
                Both tenant and landlord are required under Uttar Pradesh state regulations to complete mandatory police tenant verification. PrimeHomeKanpur assists with drafting standard 11-month lease agreements but is not liable for personal disputes, defaults, or breaches occurring during the tenancy period.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">3. Third-Party Payments &amp; Direct Transactions</h2>
              <p>
                PrimeHomeKanpur only collects the official ₹300 visit fee and standard 15-day brokerage fee upon lease execution. Never transfer security deposits or advance rent to any personal account or third party without verifying ownership documents and signing a formal agreement.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">4. Contact &amp; Grievance Redressal</h2>
              <p>
                For questions regarding this disclaimer, please contact us at:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm">
                <div><strong>PrimeHomeKanpur Support</strong></div>
                <div>Email: primehomekanpur@gmail.com</div>
                <div>Phone: +91 9151435647</div>
                <div>Address: Kanpur, Uttar Pradesh 208001</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
