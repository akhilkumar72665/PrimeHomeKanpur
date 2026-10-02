import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import { getFeaturedProperties } from '@/lib/data/properties'
import { Star, Search, Shield, Clock, Award, Check, ArrowRight } from 'lucide-react'

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
                {['JM', 'AR', 'KP'].map((initials) => (
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
              <span className="text-text-secondary text-sm font-medium">Trusted by 40+ clients</span>
            </div>

            {/* H1 Heading */}
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white mb-6">
              Find your next rental with <span className="hl">PrimeHomeKanpur</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Find your perfect rental with ease. Explore verified listings, get landlord-ready support, and move in with confidence.
            </p>

            {/* CTA Button */}
            <div className="mb-14">
              <Link href="/rentals" className="btn orange text-base">
                Explore Rentals <ArrowRight className="w-4 h-4 ml-1" />
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
                  <option value="Panki">Panki</option>
                  <option value="Kidwai Nagar">Kidwai Nagar</option>
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

        {/* 2. Stats Strip */}
        <section className="statsbar">
          <div className="wrap">
            <div className="cell">
              <b>83</b>
              <span>Total Reviews</span>
            </div>
            <div className="cell">
              <b>14</b>
              <span>Years of Experience</span>
            </div>
            <div className="cell">
              <b>67</b>
              <span>Rentals Listed</span>
            </div>
            <div className="cell">
              <b>98%</b>
              <span>Satisfaction Rate</span>
            </div>
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
              <Link href="/rentals" className="btn orange shrink-0">
                View All Rentals <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <p className="result-info mb-8">Showing {featuredProperties.length} rentals across Kanpur</p>

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
                { name: 'Arya Nagar', grad: 'p11' },
                { name: 'Kalyanpur', grad: 'p12' },
                { name: 'Barra', grad: 'p1' },
                { name: 'Panki', grad: 'p2' },
                { name: 'Kidwai Nagar', grad: 'p7' },
              ].concat([
                { name: 'Gurudev Chauraha', grad: 'p1' },
                { name: 'Kakadeo', grad: 'p7' },
                { name: 'Vijay Nagar', grad: 'p2' },
                { name: 'Vikas Nagar', grad: 'p6' },
                { name: 'Awas Vikas', grad: 'p8' },
                { name: 'Swaroop Nagar', grad: 'p10' },
                { name: 'Civil Lines', grad: 'p9' },
                { name: 'Arya Nagar', grad: 'p11' },
                { name: 'Kalyanpur', grad: 'p12' },
                { name: 'Barra', grad: 'p1' },
                { name: 'Panki', grad: 'p2' },
                { name: 'Kidwai Nagar', grad: 'p7' },
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
                Our clients&apos; success stories highlight achievements, satisfaction, and results, reflecting our expertise, dedication, and trusted partnerships.
              </p>
            </div>

            {/* Featured Quote with Floating Avatars */}
            <div className="relative py-8 my-6">
              {/* 6 Floating Avatars */}
              <div className="hidden md:flex absolute top-4 left-8 w-11 h-11 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] border-2 border-primary/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar">
                JM
              </div>
              <div className="hidden md:flex absolute top-10 right-12 w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-2 border-violet/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '0.9s' }}>
                KP
              </div>
              <div className="hidden md:flex absolute bottom-8 left-14 w-9 h-9 rounded-full bg-gradient-to-br from-[#0F766E] to-[#00C2D9] border-2 border-primary/40 items-center justify-center text-white text-[11px] font-bold shadow-lg float-avatar" style={{ animationDelay: '1.4s' }}>
                SL
              </div>
              <div className="hidden md:flex absolute bottom-6 right-16 w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border-2 border-violet/40 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '1.9s' }}>
                AR
              </div>
              <div className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#8B5CF6] border border-white/20 items-center justify-center text-white text-[10px] font-bold opacity-80 float-avatar" style={{ animationDelay: '0.5s' }}>
                RS
              </div>
              <div className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#0891B2] to-[#22D3EE] border border-white/20 items-center justify-center text-white text-[10px] font-bold opacity-80 float-avatar" style={{ animationDelay: '1.6s' }}>
                NM
              </div>

              {/* Main Featured Card */}
              <div className="max-w-3xl mx-auto rounded-3xl p-8 md:p-12 text-center border border-line bg-gradient-to-b from-[#150F30] to-[#0E0A20] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
                <div className="flex items-center justify-center gap-1 text-[#EF4444] mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-white text-lg md:text-2xl mb-8 leading-relaxed font-semibold">
                  &ldquo;PrimeHomeKanpur made the entire rental-search process surprisingly easy. The interface is smooth, the details are clear, and I actually enjoyed comparing different places.&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border-2 border-primary/50 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    JM
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base">Jyoti Mishra</p>
                    <p className="text-text-secondary text-sm">Tenant · Kakadeo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  initials: 'AR',
                  name: 'Ankit Rao',
                  role: 'Working Professional',
                  quote: 'Found my 2BHK in Vikas Nagar within a week. The agent was responsive and the paperwork was handled professionally.',
                },
                {
                  initials: 'KP',
                  name: 'Kavita Pathak',
                  role: 'Property Owner',
                  quote: 'As a landlord, they screened tenants thoroughly and my property was vacant for only 10 days. Highly recommended.',
                },
                {
                  initials: 'SL',
                  name: 'Shubham Lal',
                  role: 'Bachelor · Swaroop Nagar',
                  quote: 'The verified listings saved me a lot of time. Photos matched reality exactly and the rent was fair.',
                },
              ].map((t) => (
                <div key={t.name} className="feat flex flex-col justify-between">
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
              {/* Left Visual: Overlapping Gradient Frame */}
              <div className="relative w-full aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/40 shadow-[0_25px_60px_rgba(0,194,217,0.25)] p1" />
              </div>

              {/* Right Content */}
              <div>
                <span className="pill mb-4"><span className="dot" />Why Choose Us</span>
                <h2 className="mb-8">Why choose our <span className="hl">rental expertise</span></h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Search className="w-5 h-5 text-[#04121a]" />,
                      title: 'Expert Guidance',
                      description: 'Find rentals by filtering for application competition and recent rent updates to make informed decisions easily.',
                    },
                    {
                      icon: <Shield className="w-5 h-5 text-[#04121a]" />,
                      title: 'Verified Rental Selection',
                      description: 'Every listing is checked in person before it reaches our catalog, so photos always match reality.',
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-[#04121a]" />,
                      title: 'Stress-Free Process',
                      description: 'We track applications, deposits, and lease deadlines so you are never chasing a document.',
                    },
                    {
                      icon: <Award className="w-5 h-5 text-[#04121a]" />,
                      title: 'Proven Track Record',
                      description: 'Over a decade of leases signed across 43 neighborhoods and counting.',
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
                <h2 className="mt-4">We offer a complete spectrum of <span className="hl">rental services for your needs</span></h2>
              </div>
              <p className="text-text-secondary text-sm max-w-md hidden md:block">
                We currently focus only on rentals — helping landlords rent hassle free, backed by unparalleled results and expertise.
              </p>
            </div>

            <div className="services mt-8">
              {[
                {
                  title: 'Find a rental',
                  description: 'Discover verified rental properties across Kanpur.',
                  bullets: ['Neighborhood matching', 'Move-in date filtering', 'Verified listings only'],
                  featured: false,
                },
                {
                  title: 'List your rental',
                  description: 'Free professional listing for landlords.',
                  bullets: ['Free professional photos', 'Tenant screening', 'Lease drafting'],
                  featured: true,
                },
                {
                  title: 'Renewals & appraisal',
                  description: 'Expert support for lease renewals.',
                  bullets: ['Market rent appraisal', 'Lease renewal support', 'Deposit handling'],
                  featured: false,
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className={`svc flex flex-col justify-between ${service.featured ? 'border-primary shadow-[0_20px_50px_rgba(124,58,237,0.25)]' : ''}`}
                >
                  {service.featured && (
                    <div className="absolute top-3 right-3 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Most requested
                    </div>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#2A1566] border border-[#7C3AED]/40 flex items-center justify-center mb-6 text-primary">
                      <Search className="w-6 h-6" />
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
                    Read more
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
                Ready to find your <span className="hl">dream rental?</span>
              </h2>
              <p>
                Join hundreds of happy tenants and landlords who trust PrimeHomeKanpur for all their rental needs in Kanpur.
              </p>
              <div className="cta-btns">
                <Link href="/rentals" className="btn orange">
                  Browse Rentals
                </Link>
                <Link href="/contact" className="btn dark">
                  List Your Property
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
