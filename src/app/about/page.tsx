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
                    PrimeHomeKanpur started as a small family-run real estate consultancy in Awadhpuri in 2012. Back then, most rental transactions happened through word of mouth and shady brokers — tenants were often scammed, and landlords struggled to find reliable occupants.
                  </p>
                  <p>
                    We set out to change that by focusing on three simple rules: verify every listing in person, be transparent about fees, and stay with the client until the keys are handed over. Fourteen years later, those same rules guide everything we do.
                  </p>
                  <p>
                    Today, we&apos;ve helped over 500 families and professionals find homes across 43 Kanpur neighborhoods — from the tree-lined streets of Civil Lines to the vibrant markets of Kakadeo.
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
              <b>500+</b>
              <span>Families Helped</span>
            </div>
            <div className="cell">
              <b>67+</b>
              <span>Active Listings</span>
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
                  desc: 'To become Kanpur\'s #1 rental marketplace by 2028, powered by technology and trusted relationships.',
                },
                {
                  icon: <Heart className="w-6 h-6 text-primary" />,
                  title: 'Integrity First',
                  desc: 'Honest advice, no hidden fees, and listings that always match reality. That\'s our promise to you.',
                },
                {
                  icon: <Users className="w-6 h-6 text-primary" />,
                  title: 'Client First',
                  desc: 'We don\'t close deals — we build relationships. 60% of our clients come from referrals.',
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

        {/* 5. Leadership */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Leadership</span>
              <h2 className="mx-auto">Meet the people behind <span className="hl">PrimeHomeKanpur</span></h2>
            </div>

            <div className="team-grid mb-10">
              {[
                {
                  initials: 'RP',
                  gradient: 'from-[#3B82F6] to-[#00C2D9]',
                  name: 'Rajesh Pathak',
                  role: 'Founder & CEO',
                  bio: '14+ years in Kanpur real estate. Ex-banker turned entrepreneur with a passion for making renting fair.',
                },
                {
                  initials: 'SP',
                  gradient: 'from-[#F97316] to-[#EF4444]',
                  name: 'Shikha Pathak',
                  role: 'Co-Founder · Operations',
                  bio: 'Leads tenant verification, lease management, and the 7-member client support team.',
                },
                {
                  initials: 'AK',
                  gradient: 'from-[#0F766E] to-[#3B82F6]',
                  name: 'Amit Kumar',
                  role: 'Head of Listings',
                  bio: 'Verifies every property in person before it goes live — maintains our quality benchmark.',
                },
                {
                  initials: 'NM',
                  gradient: 'from-[#8B5CF6] to-[#EC4899]',
                  name: 'Neha Mishra',
                  role: 'Senior Agent · West Kanpur',
                  bio: 'Expert in Vikas Nagar, Kakadeo, and Vijay Nagar markets. 180+ deals closed.',
                },
              ].map((p) => (
                <div key={p.name} className="agent-card">
                  <div className={`agent-avatar ${p.gradient}`}>
                    {p.initials}
                  </div>
                  <h3 className="agent-name">{p.name}</h3>
                  <p className="agent-role">{p.role}</p>
                  <p className="agent-bio">{p.bio}</p>
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

        {/* 6. Why Choose Us (Partners for Life) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="why-grid items-center gap-12">
              <div>
                <span className="pill mb-4"><span className="dot" />Why Choose Us</span>
                <h2 className="mb-6">Not just brokers — your <span className="hl">rental partners for life</span></h2>

                <ul className="space-y-4 mb-8">
                  {[
                    'Every listing physically verified before going live — no fake photos, no ghost properties.',
                    'Transparent 1-month brokerage for tenants. Landlords list free for the first 60 days.',
                    'End-to-end support: shortlisting, visits, verification, lease drafting, and move-in.',
                    'Deep local expertise across 43 Kanpur neighborhoods — we know which societies have 24×7 water and which don\'t.',
                    '98% of our clients would recommend us to a friend. That\'s the trust we\'ve built since 2012.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/rentals" className="btn orange">
                    Browse Our Listings
                  </Link>
                  <Link href="/contact" className="btn dark">
                    Talk to Founder
                  </Link>
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
                  quote: 'Rajesh ji helped us find a 3BHK in Vijay Nagar within 5 days. We\'re a family of 5 with specific needs — he patiently showed us 8 properties and negotiated the rent down by ₹4,000. Truly professional service!',
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
                  quote: 'I own 4 properties in Awadhpuri and Swaroop Nagar. Earlier I was managing everything myself — bad tenants, delayed rent, constant calls. Since handing everything to PrimeHomeKanpur 3 years ago, I haven\'t had a single vacancy for more than 2 weeks. Worth every rupee.',
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
                Whether you&apos;re looking for a home or need help renting out your property, our team is ready to help you every step of the way.
              </p>
              <div className="cta-btns">
                <Link href="/rentals" className="btn orange">
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
