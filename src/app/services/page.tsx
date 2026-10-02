import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Search,
  UploadCloud,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Building2,
  Check,
} from 'lucide-react'

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

            <span className="pill mb-4"><span className="dot" />Our Services</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Complete rental solutions for <span className="hl">tenants &amp; landlords</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              We handle everything from finding the perfect tenant to drafting lease agreements. Whether you&apos;re a first-time renter or a seasoned property owner, we have a service tailored for you.
            </p>
          </div>
        </section>

        {/* 2. Core Services (3 x 2 Grid) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Core Services</span>
              <h2 className="mx-auto">What we offer to make <span className="hl">renting effortless</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                From search to move-in — and everything in between. Pick the service that fits your needs.
              </p>
            </div>

            <div className="services">
              {/* Service 1 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Find a Rental</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Browse verified rentals matched to your budget, preferred area, and move-in date. Personalised shortlisting and site visits arranged on your schedule.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Neighborhood & budget matching',
                      'Move-in date filtering',
                      '100% verified listings only',
                      'Personalised property shortlist',
                      'Unlimited site visits until you decide',
                      'Rent negotiation support',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/rentals" className="btn orange w-full">
                  Browse Listings
                </Link>
              </div>

              {/* Service 2 */}
              <div className="svc flex flex-col justify-between border-primary shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
                <div className="absolute top-3 right-3 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Most Requested
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">List Your Rental</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Get your property listed, professionally photographed, and rented out fast. We handle tenant screening, visits, and paperwork so you don&apos;t have to.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Free professional photography',
                      'Listed on 4+ rental platforms',
                      'Comprehensive tenant screening',
                      'Lease agreement drafting',
                      'Rent collection coordination',
                      'Security deposit escrow handling',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn orange w-full">
                  List Property Free
                </Link>
              </div>

              {/* Service 3 */}
              <div className="svc flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Renewals &amp; Appraisal</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    Market conditions change every quarter. Get a free, data-backed rent appraisal so your renewals and pricing are always fair and competitive.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Data-driven market rent appraisal',
                      'Comparable property analysis',
                      'Lease renewal negotiation',
                      'Security deposit return handling',
                      'Rental agreement amendments',
                      'Vacancy marketing support',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Get Free Appraisal
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
                    Peace of mind for landlords. Our multi-layer verification checks every tenant&apos;s background, employment, and financial stability before you sign.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Government ID verification (Aadhaar, PAN)',
                      'Employment & salary verification',
                      'Previous landlord reference check',
                      'Credit & CIBIL score check',
                      'Criminal / police background check',
                      'Family / personal reference call',
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
                    Legally sound rental agreements drafted by experienced property lawyers. Avoid disputes with watertight contracts that protect both parties.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Standard 11-month lease drafting',
                      'Long-term lease agreements',
                      'Custom clauses (pets, maintenance)',
                      'Rent escalation terms',
                      'Stamp paper & registration support',
                      'Addendum & amendment drafting',
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
                    Sit back and relax while we manage everything for you — from monthly rent collection to maintenance coordination. Perfect for NRIs and outstation owners.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Monthly rent collection & remittance',
                      'Maintenance & repair coordination',
                      'Utility bill payment tracking',
                      'Quarterly property inspection',
                      'Monthly statement & P&L report',
                      'Dedicated relationship manager',
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-text-secondary text-xs md:text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Process Section */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Process</span>
              <h2 className="mx-auto">How our service delivery <span className="hl">actually works</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                No black boxes, no hidden steps. A clear 4-stage process that keeps you in the loop at every stage.
              </p>
            </div>

            <div className="process">
              {[
                {
                  num: '1',
                  title: 'Consultation',
                  desc: 'We start by understanding your exact requirements — budget, area, BHK, timeline, and non-negotiables. This takes 15 minutes over a call.',
                },
                {
                  num: '2',
                  title: 'Shortlisting',
                  desc: 'Our agent curates 5–8 verified properties that match your brief. You get photos, floor plans, and exact pricing on WhatsApp within 24 hours.',
                },
                {
                  num: '3',
                  title: 'Site Visits',
                  desc: 'We coordinate with landlords and schedule site visits on your schedule. Our agent accompanies you, points out pros & cons, and answers every question.',
                },
                {
                  num: '4',
                  title: 'Closure & Support',
                  desc: 'Once you finalise, we handle verification, lease drafting, payment coordination, and handover. We\'re available for 30 days post-move-in for any issues.',
                },
              ].map((step) => (
                <div key={step.num} className="step text-center">
                  <div className="step-num mx-auto">{step.num}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pricing / Service Fees */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Pricing</span>
              <h2 className="mx-auto">Simple, transparent <span className="hl">service fees</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4">
                No hidden charges. What you see is exactly what you pay — once.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* For Tenants */}
              <div className="card p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">For Tenants</h3>
                  <div className="price text-3xl mb-1 text-primary">1 Month Rent</div>
                  <p className="text-text-muted text-xs mb-6">One-time brokerage · No recurring fees</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited listings access',
                      'Personalised shortlisting',
                      'All site visits included',
                      'Lease agreement drafted free',
                      '30-day post-move-in support',
                      'Pay only after you sign the lease',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/rentals" className="btn outline w-full">
                  Start Searching
                </Link>
              </div>

              {/* For Landlords (Featured) */}
              <div className="card p-8 flex flex-col justify-between border-primary shadow-[0_20px_50px_rgba(124,58,237,0.3)] relative">
                <div className="absolute top-4 right-4 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Best Value
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">For Landlords</h3>
                  <div className="price text-3xl mb-1 text-primary">50% Off First Time</div>
                  <p className="text-text-muted text-xs mb-6">Half month rent as introduction offer</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Professional photography (Free)',
                      'Cross-platform listing (Free)',
                      'Full tenant verification',
                      'Lease agreement drafting (Free)',
                      'Rent & deposit coordination',
                      'Listing active for 90 days',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn orange w-full">
                  List Property Now
                </Link>
              </div>

              {/* Annual Management */}
              <div className="card p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">Annual Management</h3>
                  <div className="price text-3xl mb-1 text-primary">5% of Annual Rent</div>
                  <p className="text-text-muted text-xs mb-6">All-inclusive · Monthly reports</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Complete tenant management',
                      'Monthly rent collection',
                      'Maintenance coordination',
                      'Quarterly property inspection',
                      'Utility payments handled',
                      'Dedicated account manager',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn outline w-full">
                  Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQ Teaser */}
        <section className="sect gray">
          <div className="wrap">
            <div className="cta-section">
              <span className="pill mx-auto mb-4"><span className="dot" />Frequently Asked</span>
              <h2>
                Questions about our <span className="hl">services?</span>
              </h2>
              <p>
                Still unsure which service is right for you? Read our FAQ or talk to our team — consultations are always free.
              </p>
              <div className="cta-btns">
                <Link href="/faq" className="btn orange">
                  Read All FAQs
                </Link>
                <Link href="/contact" className="btn dark">
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
