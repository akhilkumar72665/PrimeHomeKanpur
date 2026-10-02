import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  ShieldCheck,
  FileCheck,
  Building2,
  Check,
  Phone,
  ArrowRight
} from 'lucide-react'
import { OurServicesPill, FindRentalIcon, ListRentalHouseIcon, RenewalsDocIcon } from '@/components/ui/Service3DIcons'

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Page Hero */}
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Services</span>
            </div>

            <OurServicesPill text="Our Services" />
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Transparent rental solutions for <span className="hl">tenants &amp; landlords</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              We handle everything from finding verified homes to physical tours, tenant background screening, and legal lease drafting with complete price transparency.
            </p>
          </div>
        </section>

        {/* 2. Core Services (3 x 2 Grid) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <OurServicesPill text="Core Services" />
              <h2 className="mx-auto">What we offer to make <span className="hl">renting effortless</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                From search to move-in across 40+ Kanpur neighborhoods.
              </p>
            </div>

            <div className="services">
              {/* Service 1 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <FindRentalIcon className="w-14 h-14 mb-6" />
                  <h3 className="text-white font-bold text-xl mb-2">Tenant Home Discovery</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Browse verified rentals matched to your budget, preferred area, and move-in date with scheduled physical visits.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      '15 days rent as brokerage (payable on deal)',
                      '₹300 visit charge per physical tour',
                      'Free call consultation anytime',
                      '100% physically verified listings',
                      'Landlord terms & paper verification',
                      'Rent negotiation & lease drafting',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/rentals" className="btn orange w-full btn-loop-shine">
                  Browse Listings
                </Link>
              </div>

              {/* Service 2 */}
              <div className="svc flex flex-col justify-between border-primary shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
                <div className="absolute top-3 right-3 bg-[#EA580C] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Most Requested
                </div>
                <div>
                  <ListRentalHouseIcon className="w-14 h-14 mb-6" />
                  <h3 className="text-white font-bold text-xl mb-2">List Your Property</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Get your property cataloged, photographed by our team, screened, and rented out to verified tenants.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Rent > ₹10,000/mo: ₹2,000 listing charge',
                      'Rent < ₹10,000/mo: ₹1,000 listing charge',
                      '15 days rent brokerage after deal completed',
                      'Physical property inspection & photos',
                      'Thorough tenant background screening',
                      'Standard lease agreement execution',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn orange w-full">
                  List Your Property
                </Link>
              </div>

              {/* Service 3 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <RenewalsDocIcon className="w-14 h-14 mb-6" />
                  <h3 className="text-white font-bold text-xl mb-2">Market Rent Appraisal</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Get realistic Kanpur rent estimates based on active demand in Kakadeo, Civil Lines, Swaroop Nagar, and surrounding areas.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Free call consultation & appraisal',
                      'Comparable neighborhood rent data',
                      'Lease renewal negotiation',
                      'Security deposit advisory',
                      'Rental agreement amendments',
                      'Vacancy reduction strategy',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Get Free Consultation
                </Link>
              </div>

              {/* Service 4 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Tenant Verification</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Peace of mind for landlords. Comprehensive background and identity checks before signing any rental agreement.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Government ID check (Aadhaar, PAN)',
                      'Employment & student credential check',
                      'Previous landlord reference check',
                      'Family and occupancy confirmation',
                      'Police verification assistance',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Request Verification
                </Link>
              </div>

              {/* Service 5 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Lease Documentation</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Legally compliant rental agreements drafted to protect both landlords and tenants without ambiguity.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Standard 11-month lease drafting',
                      'Custom maintenance & deposit terms',
                      'Rent escalation clauses',
                      'Stamp paper coordination',
                      'Move-in checklist documentation',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Draft Agreement
                </Link>
              </div>

              {/* Service 6 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Property Management</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Dedicated support for property owners managing rentals from outside Kanpur or seeking hands-off oversight.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Prompt tenant replacement on vacancy',
                      'Maintenance coordination with verified staff',
                      'Regular on-site inspection visits',
                      'Direct owner communication channel',
                      'Local Kanpur management team',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Contact Management
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Pricing / Service Fees Summary */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Pricing Structure</span>
              <h2 className="mx-auto">Clear, honest <span className="hl">brokerage charges</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                Transparent fees for both tenants and landlords across Kanpur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* For Tenants */}
              <div className="card p-8 flex flex-col justify-between bg-[#0E0B1F] rounded-2xl border border-white/10">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">For Tenants</h3>
                  <div className="price text-3xl mb-1 text-primary">15 Days Rent</div>
                  <p className="text-text-muted text-xs mb-6">Brokerage payable only upon deal completion</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      '₹300 visit charge per physical tour',
                      'Free call consultation anytime',
                      '100% verified property listings',
                      'All site visits accompanied by agent',
                      'Lease agreement drafted & reviewed',
                      'No charges if deal is not finalized',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/rentals" className="btn orange w-full btn-loop-shine">
                  Browse Verified Rentals
                </Link>
              </div>

              {/* For Landlords */}
              <div className="card p-8 flex flex-col justify-between bg-[#0E0B1F] rounded-2xl border-primary shadow-[0_20px_50px_rgba(124,58,237,0.3)] relative">
                <div className="absolute top-4 right-4 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Landlord Tiers
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">For Landlords</h3>
                  <div className="price text-2xl mb-1 text-primary">
                    ₹1,000 / ₹2,000 <small className="text-xs text-text-muted">+ 15 Days Brokerage</small>
                  </div>
                  <p className="text-text-muted text-xs mb-6">Listing fee based on property rent tier</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Rent > ₹10,000/mo: ₹2,000 listing fee + 15 days brokerage after deal',
                      'Rent < ₹10,000/mo: ₹1,000 listing fee + 15 days brokerage after deal',
                      'Professional photography & cataloging',
                      'Tenant screening & identity verification',
                      'Lease drafting and handover support',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn orange w-full">
                  List Your Property
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Final CTA */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Have questions about our <span className="hl">rental brokerage?</span>
              </h2>
              <p>
                Call our team directly at <span className="text-white font-bold">+91 9151435647</span> or request a free consultation.
              </p>
              <div className="cta-btns">
                <Link href="/faq" className="btn orange">
                  Read FAQs
                </Link>
                <a href="tel:+919151435647" className="btn dark">
                  <Phone size={14} className="mr-1 text-accent-pink" /> Call +91 9151435647
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
