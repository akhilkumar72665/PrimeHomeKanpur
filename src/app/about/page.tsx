import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Check, Target, Eye, Heart, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
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
              <span>About Us</span>
            </div>

            <span className="pill mb-4"><span className="dot" />About Us</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Connecting Kanpur families & professionals with <span className="hl">their perfect home</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Since 2012, PrimeHomeKanpur has been Kanpur&apos;s most trusted rental marketplace. With deep local knowledge and a client-first approach, we make renting simple, transparent, and stress-free.
            </p>
          </div>
        </section>

        {/* 2. Story Section */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="about items-center gap-12">
              {/* Visual Block with diagonal pattern */}
              <div className="art violet" />

              {/* Story Content */}
              <div>
                <span className="pill mb-4"><span className="dot" />Our Story</span>
                <h2 className="mb-6">Building Kanpur&apos;s most trusted <span className="hl">rental platform</span></h2>

                <div className="space-y-6 text-text-secondary leading-relaxed">
                  <p>
                    PrimeHomeKanpur started as a dedicated local real estate consultancy in Awadhpuri in 2012. Back then, rental transactions were burdened by unreliable broker networks, hidden charges, and unverified properties.
                  </p>
                  <p>
                    We set out to change that with three clear principles: physically verify every rental listing, provide straightforward 15-day brokerage with a transparent ₹300 visit charge, and stand by tenants and landlords through agreement signing and move-in.
                  </p>
                  <p>
                    Fourteen years later, our team has helped hundreds of families find verified homes across 40+ Kanpur neighborhoods — from Civil Lines and Swaroop Nagar to Kakadeo and Kalyanpur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Stats Strip */}
        <section className="statsbar">
          <div className="wrap">
            <div className="cell">
              <b>14+</b>
              <span>Years of Experience</span>
            </div>
            <div className="cell">
              <b>83+</b>
              <span>Verified Reviews</span>
            </div>
            <div className="cell">
              <b>67+</b>
              <span>Active Rentals</span>
            </div>
            <div className="cell">
              <b>98%</b>
              <span>Satisfaction Rate</span>
            </div>
          </div>
        </section>

        {/* 4. Core Values (4 Cards) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Our Core Values</span>
              <h2 className="mx-auto">What drives us every <span className="hl">single day</span></h2>
            </div>

            <div className="feat-grid">
              {[
                {
                  icon: <Target className="w-6 h-6 text-primary" />,
                  title: 'Our Mission',
                  desc: 'To make renting in Kanpur fair, transparent, and hassle-free — for both tenants and landlords.',
                },
                {
                  icon: <Eye className="w-6 h-6 text-primary" />,
                  title: 'Our Vision',
                  desc: 'To deliver Kanpur\'s most trusted, digitally-enabled rental discovery and property management experience.',
                },
                {
                  icon: <Heart className="w-6 h-6 text-primary" />,
                  title: 'Integrity First',
                  desc: 'Honest advice, 15-day transparent brokerage, ₹300 visit charge, and listings that strictly match reality.',
                },
                {
                  icon: <Users className="w-6 h-6 text-primary" />,
                  title: 'Client First',
                  desc: 'We don\'t just close deals — we build long-term relationships backed by dedicated local support.',
                },
              ].map((item) => (
                <div key={item.title} className="feat text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Leadership (3 Team Members, 4th Removed) */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Leadership</span>
              <h2 className="mx-auto">Meet the team behind <span className="hl">PrimeHomeKanpur</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 max-w-5xl mx-auto">
              {[
                {
                  initials: 'AP',
                  bgGradient: 'bg-gradient-to-tr from-[#3B82F6] via-[#6366F1] to-[#00C2D9]',
                  glowColor: 'shadow-[0_0_28px_rgba(59,130,246,0.45)] border-[#00C2D9]/40',
                  name: 'Abhishek Pathak',
                  role: 'Founder & CEO',
                  bio: '14+ years in Kanpur real estate. Leading company vision, verified property benchmarks, and tenant satisfaction.',
                },
                {
                  initials: 'PP',
                  bgGradient: 'bg-gradient-to-tr from-[#F97316] via-[#EA580C] to-[#EC4899]',
                  glowColor: 'shadow-[0_0_28px_rgba(249,115,22,0.45)] border-[#F97316]/40',
                  name: 'Piyush Pandey',
                  role: 'Co-Founder',
                  bio: 'Oversees landlord partnerships, business growth, strategic listings, and end-to-end lease execution.',
                },
                {
                  initials: 'AK',
                  bgGradient: 'bg-gradient-to-tr from-[#0F766E] via-[#10B981] to-[#3B82F6]',
                  glowColor: 'shadow-[0_0_28px_rgba(16,185,129,0.45)] border-[#10B981]/40',
                  name: 'Akhil Kumar',
                  role: 'Head of Listing & Management',
                  bio: 'Personally inspects properties before cataloging, coordinates tour schedules, and handles documentation.',
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-3xl border border-white/10 bg-[#120C29] p-8 sm:p-9 text-center flex flex-col items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-amber-400/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]"
                >
                  <div className="flex flex-col items-center">
                    {/* Vibrant Colored Circle */}
                    <div
                      className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full ${p.bgGradient} ${p.glowColor} border-2 flex items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-tight mb-5 shadow-lg transform transition-transform group-hover:scale-105`}
                    >
                      {p.initials}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
                      {p.name}
                    </h3>
                    <p className="text-sm font-bold text-[#00C2D9] uppercase tracking-wider mb-4">
                      {p.role}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                      {p.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/agents" className="btn orange">
                Meet Our Full Team <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="why-grid items-center gap-12">
              <div>
                <span className="pill mb-4"><span className="dot" />Why Choose Us</span>
                <h2 className="mb-6">Not just brokers — your <span className="hl">rental partners for life</span></h2>

                <ul className="space-y-4 mb-8">
                  {[
                    'Every listing physically verified before going live — no fake photos, no ghost properties.',
                    'Clear 15 days rent brokerage for tenants, ₹300 visit charge, and free call consultation.',
                    'End-to-end support: shortlisting, scheduled visits, landlord verification, and lease drafting.',
                    'Deep local expertise across 40+ Kanpur neighborhoods — from water storage details to society bylaws.',
                    '98% client satisfaction backed by 14+ years of dedicated service in Kanpur.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/rentals" className="btn orange btn-loop-shine">
                    Browse Our Listings
                  </Link>
                  <a href="tel:+919151435647" className="btn dark">
                    Call +91 9151435647
                  </a>
                </div>
              </div>

              <div className="art cyan" />
            </div>
          </div>
        </section>

        {/* 7. Client Love Testimonials */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Client Love</span>
              <h2 className="mx-auto">What our <span className="hl">clients say</span> about us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  initials: 'VG',
                  name: 'Vinod Gupta',
                  role: 'Family · Vijay Nagar',
                  quote: 'Abhishek ji and team helped us find a 3BHK in Vijay Nagar within 5 days. We\'re a family of 5 with specific needs — they patiently showed us verified properties and managed the lease paperwork smoothly.',
                },
                {
                  initials: 'RS',
                  name: 'Rohan Singh',
                  role: 'Software Engineer · Kakadeo',
                  quote: 'As a bachelor moving to Kanpur from Delhi, I was worried about getting scammed. PrimeHomeKanpur\'s verified listings gave me confidence. I signed my Kakadeo flat within 48 hours and everything matched the photos exactly.',
                },
                {
                  initials: 'MT',
                  name: 'Meeta Trivedi',
                  role: 'Property Owner · 4 Properties',
                  quote: 'I own properties in Awadhpuri and Swaroop Nagar. Since handing tenant screening to PrimeHomeKanpur, I haven\'t had a single vacancy for more than 2 weeks. Truly professional Kanpur service.',
                },
              ].map((item) => (
                <div key={item.name} className="feat flex flex-col justify-between">
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center text-white font-bold text-sm shadow">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.name}</p>
                      <p className="text-text-muted text-xs">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Ready to start your <span className="hl">rental journey?</span>
              </h2>
              <p>
                Whether you&apos;re looking for a home or need help renting out your property, our team is ready to help you at every step.
              </p>
              <div className="cta-btns">
                <Link href="/rentals" className="btn orange btn-loop-shine">
                  Browse Rentals
                </Link>
                <Link href="/contact" className="btn dark">
                  Get in Touch
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
