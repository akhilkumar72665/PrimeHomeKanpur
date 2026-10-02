import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import AnimatedStatCounter from '@/components/ui/AnimatedStatCounter'
import { getFeaturedProperties } from '@/lib/data/properties'
import { Star, Search, Shield, Clock, Award, Check, ArrowRight, Building, Sparkles } from 'lucide-react'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties(6)

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Hero Section */}
        <section className="hero" id="top">
          <div className="wrap hero-inner">
            {/* Trusted Avatar Stack */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                {['AP', 'PP', 'AK'].map((initials) => (
                  <div
                    key={initials}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border-2 border-bg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[#EF4444]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-text-secondary text-sm font-medium">83+ Verified Client Reviews</span>
            </div>

            {/* H1 Heading */}
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white mb-6">
              Find your next rental with <span className="hl">PrimeHomeKanpur</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Find your perfect rental with ease. Explore verified listings, transparent 15-day brokerage, ₹300 visit fee, and move in with confidence.
            </p>

            {/* CTA Button */}
            <div className="mb-14 flex flex-wrap items-center gap-4">
              <Link href="/rentals" className="btn orange text-base btn-loop-shine">
                Explore Rentals <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link href="/contact" className="btn dark text-base">
                Free Call Consultation
              </Link>
            </div>

            {/* 4-Field Search Bar Card */}
            <form action="/rentals" method="GET" className="card-s">
              <div className="field">
                <label htmlFor="hero-location">Location</label>
                <select id="hero-location" name="location" defaultValue="">
                  <option value="">All Kanpur areas</option>
                  <option value="Gurudev Chauraha">Gurudev Chauraha</option>
                  <option value="Kakadeo">Kakadeo</option>
                  <option value="Vijay Nagar">Vijay Nagar</option>
                  <option value="Vikas Nagar">Vikas Nagar</option>
                  <option value="Awas Vikas">Awas Vikas</option>
                  <option value="Swaroop Nagar">Swaroop Nagar</option>
                  <option value="Civil Lines">Civil Lines</option>
                  <option value="Barra">Barra</option>
                  <option value="Kalyanpur">Kalyanpur</option>
                  <option value="Kidwai Nagar">Kidwai Nagar</option>
                  <option value="Govind Nagar">Govind Nagar</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="hero-bhk">BHK</label>
                <select id="hero-bhk" name="bhk" defaultValue="">
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="hero-price">Price Range</label>
                <select id="hero-price" name="price" defaultValue="">
                  <option value="">Any budget</option>
                  <option value="under-10k">Under ₹10,000</option>
                  <option value="10k-20k">₹10,000 – ₹20,000</option>
                  <option value="20k-30k">₹20,000 – ₹30,000</option>
                  <option value="above-30k">Above ₹30,000</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="hero-tenant">Tenant Type</label>
                <select id="hero-tenant" name="tenant" defaultValue="">
                  <option value="">Any tenant type</option>
                  <option value="Family">Family</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <button type="submit" className="btn orange w-full">
                  <Search className="w-4 h-4 mr-1" /> Search Rentals
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 2. Stats Strip with Dual Digit Animation (1st up, 2nd down) */}
        <section className="statsbar">
          <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedStatCounter value={83} label="Total Reviews" />
            <AnimatedStatCounter value={14} label="Years of Experience" />
            <AnimatedStatCounter value={67} label="Rentals Listed" />
            <AnimatedStatCounter value={98} suffix="%" label="Satisfaction Rate" />
          </div>
        </section>

        {/* 3. Rental Listings Grid */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <span className="pill"><span className="dot" />Rental Listings</span>
                <h2 className="mt-4">Explore Premium <span className="hl">Rentals</span> Chosen For You</h2>
              </div>
              <Link href="/rentals" className="btn orange shrink-0 btn-loop-shine">
                View All Rentals <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <p className="result-info mb-8">Showing verified rentals across Kanpur</p>

            <div className="listings">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Popular Working Areas (Marquee) */}
        <section className="sect gray">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <span className="pill"><span className="dot" />Popular Areas</span>
                <h2 className="mt-4">Our Rental Expertise Across Diverse <span className="hl">Working Areas</span></h2>
              </div>
              <Link href="/agents" className="btn orange shrink-0">
                View All Locations <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="marquee mt-6">
            <div className="marquee-track">
              {[
                { name: 'Gurudev Chauraha', grad: 'p1' },
                { name: 'Kakadeo', grad: 'p7' },
                { name: 'Vijay Nagar', grad: 'p2' },
                { name: 'Vikas Nagar', grad: 'p6' },
                { name: 'Awas Vikas', grad: 'p8' },
                { name: 'Swaroop Nagar', grad: 'p10' },
                { name: 'Civil Lines', grad: 'p9' },
                { name: 'Govind Nagar', grad: 'p11' },
                { name: 'Kalyanpur', grad: 'p12' },
                { name: 'Barra', grad: 'p1' },
                { name: 'Kidwai Nagar', grad: 'p7' },
                { name: 'Awadhpuri', grad: 'p2' },
              ].concat([
                { name: 'Gurudev Chauraha', grad: 'p1' },
                { name: 'Kakadeo', grad: 'p7' },
                { name: 'Vijay Nagar', grad: 'p2' },
                { name: 'Vikas Nagar', grad: 'p6' },
                { name: 'Awas Vikas', grad: 'p8' },
                { name: 'Swaroop Nagar', grad: 'p10' },
                { name: 'Civil Lines', grad: 'p9' },
                { name: 'Govind Nagar', grad: 'p11' },
                { name: 'Kalyanpur', grad: 'p12' },
                { name: 'Barra', grad: 'p1' },
                { name: 'Kidwai Nagar', grad: 'p7' },
                { name: 'Awadhpuri', grad: 'p2' },
              ]).map((area, idx) => (
                <div key={`${area.name}-${idx}`} className={`area-card ${area.grad}`}>
                  <div className="area-content">
                    <h3>{area.name}</h3>
                    <p>Kanpur</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Client Success Stories (Testimonials) */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />Testimonials</span>
              <h2 className="mx-auto">Clients <span className="hl">Success Stories</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4 leading-relaxed">
                Our clients&apos; success stories highlight verified physical visits, fair 15-day brokerage, and prompt lease completion across Kanpur.
              </p>
            </div>

            {/* Featured Quote with Floating Avatars */}
            <div className="relative py-8 my-6">
              {/* Floating Avatars */}
              <div className="hidden md:flex absolute top-4 left-8 w-11 h-11 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] border-2 border-primary/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar">
                AS
              </div>
              <div className="hidden md:flex absolute top-10 right-12 w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-2 border-violet/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '0.9s' }}>
                VM
              </div>
              <div className="hidden md:flex absolute bottom-8 left-14 w-9 h-9 rounded-full bg-gradient-to-br from-[#0F766E] to-[#00C2D9] border-2 border-primary/40 items-center justify-center text-white text-[11px] font-bold shadow-lg float-avatar" style={{ animationDelay: '1.4s' }}>
                RV
              </div>
              <div className="hidden md:flex absolute bottom-6 right-16 w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border-2 border-violet/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '1.9s' }}>
                KP
              </div>

              {/* Main Featured Card */}
              <div className="max-w-3xl mx-auto rounded-3xl p-8 md:p-12 text-center border border-line bg-gradient-to-b from-[#150F30] to-[#0E0A20] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
                <div className="flex items-center justify-center gap-1 text-[#EF4444] mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-white text-lg md:text-2xl mb-8 leading-relaxed font-semibold">
                  &ldquo;PrimeHomeKanpur found me a verified 2BHK within 48 hours of shifting to Kanpur. The transparent ₹300 visit fee and clear 15 days brokerage saved me from unverified market brokers.&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border-2 border-primary/50 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    AS
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base">Dr. Ananya Shukla</p>
                    <p className="text-text-secondary text-sm">Resident Doctor · Swaroop Nagar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  initials: 'VM',
                  name: 'Vikas Malhotra',
                  role: 'Tech Lead · Civil Lines',
                  quote: 'Booking a visit online was instant. The agent walked us through every single detail, verified landlord papers, and managed lease drafting seamlessly.',
                },
                {
                  initials: 'RV',
                  name: 'Rohan & Sneha Verma',
                  role: 'Property Owners · Vijay Nagar',
                  quote: 'Listed our duplex on PrimeHomeKanpur. Their listing manager verified the flat the same afternoon and we had a family tenant signed in a week.',
                },
                {
                  initials: 'KP',
                  name: 'Kavita Pandey',
                  role: 'Tenant · Kakadeo',
                  quote: 'The verified listings saved us endless phone calls. Photos matched reality exactly, zero hidden charges, and honest guidance throughout.',
                },
              ].map((t) => (
                <div key={t.name} className="feat flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-[#EF4444] mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center text-white font-bold text-sm shadow">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-text-muted text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Why Choose Our Rental Expertise */}
        <section className="sect gray">
          <div className="wrap">
            <div className="why-grid items-center gap-12">
              <div className="relative w-full aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/40 shadow-[0_25px_60px_rgba(0,194,217,0.25)] p1" />
              </div>

              <div>
                <span className="pill mb-4"><span className="dot" />Why Choose Us</span>
                <h2 className="mb-8">Why choose our <span className="hl">rental expertise</span></h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Search className="w-5 h-5 text-[#04121a]" />,
                      title: 'Expert Kanpur Guidance',
                      description: 'Find rentals with complete clarity on rent, maintenance, deposit, and verified landlord preferences.',
                    },
                    {
                      icon: <Shield className="w-5 h-5 text-[#04121a]" />,
                      title: 'Physically Verified Listings',
                      description: 'Every rental is inspected in person before it reaches our catalog, so photos always match reality.',
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-[#04121a]" />,
                      title: 'Transparent Pricing Structure',
                      description: '15 days rent as brokerage, ₹300 visit charge, and free call consultation with no hidden surprises.',
                    },
                    {
                      icon: <Award className="w-5 h-5 text-[#04121a]" />,
                      title: 'Proven 14-Year Track Record',
                      description: 'Over 14 years of dedicated rental matching across 40+ Kanpur neighborhoods.',
                    },
                  ].map((item, idx) => (
                    <div key={item.title} className={`flex gap-4 items-start ${idx > 0 ? 'pt-4 border-t border-line/60' : ''}`}>
                      <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Our Rental Services */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <span className="pill"><span className="dot" />Our Services</span>
                <h2 className="mt-4">We offer a complete spectrum of <span className="hl">rental services</span></h2>
              </div>
              <p className="text-text-secondary text-sm max-w-md hidden md:block">
                Focused on Kanpur rentals — helping tenants discover verified homes and landlords rent hassle-free.
              </p>
            </div>

            <div className="services mt-8">
              {[
                {
                  title: 'Find a Rental',
                  description: 'Discover verified homes with physical on-site visits.',
                  bullets: ['15 days brokerage on deal', '₹300 visit charge', 'Free call consultation'],
                  featured: false,
                },
                {
                  title: 'List Your Rental',
                  description: 'Professional listing and tenant screening for landlords.',
                  bullets: ['Rent > ₹10k: ₹2,000 listing charge', 'Rent < ₹10k: ₹1,000 listing charge', '15 days brokerage after deal'],
                  featured: true,
                },
                {
                  title: 'Lease & Documentation',
                  description: 'Complete legal lease drafting and verification support.',
                  bullets: ['Police verification support', 'Standard lease agreements', 'Move-in assistance'],
                  featured: false,
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className={`svc flex flex-col justify-between ${service.featured ? 'border-primary shadow-[0_20px_50px_rgba(124,58,237,0.25)]' : ''}`}
                >
                  {service.featured && (
                    <div className="absolute top-3 right-3 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Landlord Choice
                    </div>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                      <Building className="w-6 h-6" />
                    </div>

                    <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed">{service.description}</p>

                    <ul className="space-y-3 mb-8">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2.5 text-text-secondary text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/services"
                    className={`btn w-full ${service.featured ? 'orange' : 'outline'}`}
                  >
                    Read Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Final CTA Section */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Ready to find your <span className="hl">dream rental in Kanpur?</span>
              </h2>
              <p>
                Call us directly at <span className="text-white font-bold">+91 9151435647</span> or browse verified homes with immediate tour scheduling.
              </p>
              <div className="cta-btns">
                <Link href="/rentals" className="btn orange btn-loop-shine">
                  Browse Rentals
                </Link>
                <a href="tel:+919151435647" className="btn dark">
                  Call +91 9151435647
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
