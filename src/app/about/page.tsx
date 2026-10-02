import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/sections/SectionHeading'
import { Check, Target, Eye, Heart, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-bg purple-glow diagonal-pattern py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-deep border border-violet mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  About Us
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Connecting Kanpur families & professionals with <span className="text-primary">their perfect home</span>
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                Since 2012, PrimeHomeKanpur has been Kanpur&apos;s most trusted rental marketplace. With deep local knowledge and a client-first approach, we make renting simple, transparent, and stress-free.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>About Us</span>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Visual */}
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.3)] diagonal-pattern"></div>

              {/* Content */}
              <div>
                <SectionHeading
                  pill="Our Story"
                  title="Building Kanpur's most trusted"
                  highlight="rental platform"
                />

                <div className="space-y-6 text-text-secondary">
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

        {/* Stats */}
        <section className="bg-bg-purple border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              <StatItem number="14+" label="Years of Experience" />
              <StatItem number="500+" label="Families Helped" />
              <StatItem number="67+" label="Active Listings" />
              <StatItem number="98%" label="Satisfaction Rate" />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Our Core Values"
              title="What drives us every"
              highlight="single day"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Target className="w-8 h-8" />,
                  title: 'Our Mission',
                  description: 'To make renting in Kanpur fair, transparent, and hassle-free — for both tenants and landlords.',
                },
                {
                  icon: <Eye className="w-8 h-8" />,
                  title: 'Our Vision',
                  description: 'To become Kanpur\'s #1 rental marketplace by 2028, powered by technology and trusted relationships.',
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: 'Integrity First',
                  description: 'Honest advice, no hidden fees, and listings that always match reality. That\'s our promise to you.',
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'Client First',
                  description: 'We don\'t close deals — we build relationships. 60% of our clients come from referrals.',
                },
              ].map((item) => (
                <div key={item.title} className="feature-card bg-surface border border-border rounded-2xl p-6 text-center">
                  <div className="icon-shell w-16 h-16 mx-auto mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Leadership"
              title="Meet the people behind"
              highlight="PrimeHomeKanpur"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              ].map((person) => (
                <div key={person.name} className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-violet/60 transition-all duration-200 hover:-translate-y-1">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${person.gradient} flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg border-2 border-white/10`}>
                    {person.initials}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{person.name}</h3>
                  <p className="text-primary text-xs uppercase tracking-wider font-semibold mb-3">{person.role}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{person.bio}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/agents">
                <Button variant="primary" size="md">
                  Meet Our Full Team <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-bg-purple py-20 border-t border-border/40">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <SectionHeading
                  pill="Why Choose Us"
                  title="Not just brokers — your"
                  highlight="rental partners for life"
                />

                <ul className="space-y-4 mb-8">
                  {[
                    'Every listing physically verified before going live — no fake photos, no ghost properties.',
                    'Transparent 1-month brokerage for tenants. Landlords list free for the first 60 days.',
                    'End-to-end support: shortlisting, visits, verification, lease drafting, and move-in.',
                    'Deep local expertise across 43 Kanpur neighborhoods — we know which societies have 24×7 water and which don\'t.',
                    '98% of our clients would recommend us to a friend. That\'s the trust we\'ve built since 2012.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/rentals">
                    <Button variant="primary" size="md">
                      Browse Our Listings
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" size="md">
                      Talk to Founder
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/30 shadow-[0_20px_50px_rgba(0,194,217,0.25)] grid-pattern"></div>
            </div>
          </div>
        </section>

        {/* Client Love */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Client Love"
              title="What our"
              highlight="clients say"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  initials: 'VG',
                  name: 'Vinod Gupta',
                  role: 'Family · Vijay Nagar',
                  quote: 'Rajesh ji helped us find a 3BHK in Vijay Nagar within 5 days. We are a family of 5 with specific needs — he patiently showed us 8 properties and negotiated the rent down by ₹4,000. Truly professional service!',
                },
                {
                  initials: 'RS',
                  name: 'Rohan Singh',
                  role: 'Software Engineer · Kakadeo',
                  quote: 'As a bachelor moving to Kanpur from Delhi, I was worried about getting scammed. PrimeHomeKanpur verified listings gave me confidence. I signed my Kakadeo flat within 48 hours and everything matched the photos exactly.',
                },
                {
                  initials: 'MT',
                  name: 'Meeta Trivedi',
                  role: 'Property Owner · 4 Properties',
                  quote: 'I own 4 properties in Awadhpuri and Swaroop Nagar. Earlier I was managing everything myself — bad tenants, delayed rent, constant calls. Since handing everything to PrimeHomeKanpur 3 years ago, I haven\'t had a single vacancy for more than 2 weeks. Worth every rupee.',
                },
              ].map((testimonial) => (
                <div key={testimonial.name} className="bg-surface border border-border rounded-xl p-6">
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-violet-dark flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-text-muted text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="bg-surface-elevated border border-border rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to start your <span className="text-primary">rental journey?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Whether you're looking for a home or need help renting out your property, our team is ready to help you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Browse Rentals
                </Button>
                <Button variant="secondary" size="lg">
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{number}</div>
      <div className="text-text-muted text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}
