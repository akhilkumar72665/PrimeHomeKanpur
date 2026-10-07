import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, RotateCcw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | PrimeHomeKanpur',
  description: 'Understand the ₹300 visit fee refund rules, tenant/landlord cancellations, rescheduling terms, and refund processing timelines at PrimeHomeKanpur.',
  alternates: {
    canonical: '/refund-policy',
  },
}

export default function RefundPolicyPage() {
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
              <span>Refund &amp; Cancellation Policy</span>
            </div>
            <span className="pill mb-3"><span className="dot" />Legal &amp; Consumer Protection</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              Refund &amp; <span className="hl">Cancellation Policy</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl">
              Last updated: October 2026 · Transparent terms governing our ₹300 physical property visit fee, cancellations, rescheduling, and brokerage transactions.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="sect bg-bg py-12 md:py-16">
          <div className="wrap max-w-4xl mx-auto space-y-10">

            {/* Quick Summary Box */}
            <div className="card p-6 md:p-8 bg-[#0E0B1F] rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-accent-cyan">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h2 className="text-lg font-bold text-white">Summary of Key Refund Terms</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-text-secondary">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-semibold text-white block mb-1">Tenant Cancellation &gt; 4 hrs</span>
                  100% full refund or free rescheduling if cancelled at least 4 hours before the scheduled slot.
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-semibold text-white block mb-1">Landlord / Agent Cancellation</span>
                  100% instant refund if our agent or property owner is unable to attend the scheduled tour.
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-semibold text-white block mb-1">Property Already Rented Out</span>
                  100% refund or free credit towards another property tour of your choice across Kanpur.
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-semibold text-white block mb-1">Processing Timeline</span>
                  Refunds are credited to the original payment source within 3–5 working banking days.
                </div>
              </div>
            </div>

            {/* Section 1: Physical Visit Fee */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                1. The ₹300 Property Visit Fee
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                PrimeHomeKanpur charges a nominal ₹300 visit fee per assisted physical walkthrough. This fee covers our dedicated field agent’s travel, scheduling coordination with landlords, physical accompaniment, and keys facilitation.
              </p>
            </div>

            {/* Section 2: Cancellation & Rescheduling Rules */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                2. Cancellation &amp; Rescheduling Eligibility
              </h2>
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">Timely Tenant Cancellation:</strong> Cancellations requested through your tenant dashboard or via WhatsApp support at least 4 hours prior to the slot are eligible for a full 100% refund.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">Free Rescheduling:</strong> You may reschedule your visit date and time slot up to 2 hours before the appointment without any additional fee.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">Late Cancellations &amp; No-Shows:</strong> If a tenant fails to show up at the property without prior notice, or cancels within 1 hour of the appointed time after the agent has already arrived on-site, the ₹300 visit fee is non-refundable.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">Property Unavailable / Discrepancy:</strong> If a property listed as available is found to be already rented or inaccessible upon arrival, tenant receives an immediate full refund plus priority viewing access.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Brokerage & Deal Commission */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                3. Brokerage Charges &amp; Lease Finalization
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our standard service fee is <strong>15 Days Rent</strong> upon successful lease signing. Brokerage is only due when you finalize a property and both tenant and owner sign the tenancy agreement. If you do not choose to rent the property after viewing, no brokerage is payable.
              </p>
            </div>

            {/* Section 4: Refund Initiation & Support */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                4. How to Request a Refund
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                You can cancel and request a refund directly from your <Link href="/dashboard/visits" className="text-accent-cyan underline">Dashboard &gt; My Visits</Link> section, or contact our support team:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-text-secondary space-y-1">
                <div><strong>Email:</strong> primehomekanpur@gmail.com</div>
                <div><strong>Phone / WhatsApp:</strong> +91 9151435647</div>
                <div><strong>Support Hours:</strong> Monday to Sunday, 9:00 AM – 8:00 PM IST</div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
