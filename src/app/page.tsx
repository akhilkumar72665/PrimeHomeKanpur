import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import AnimatedStatCounter from '@/components/ui/AnimatedStatCounter'
import HomeSearchSection from '@/components/home/HomeSearchSection'
import { getFeaturedProperties } from '@/lib/data/properties'
import { Star, Shield, Clock, Award, Check, ArrowRight, MapPin, Search } from 'lucide-react'
import { OurServicesPill, FindRentalIcon, ListRentalHouseIcon, RenewalsDocIcon } from '@/components/ui/Service3DIcons'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties(6)

  const popularAreas = [
    { name: 'Gurudev Chauraha', count: '14+ Listings', grad: 'from-[#0F766E] to-[#00C2D9]' },
    { name: 'Kakadeo', count: '22+ Listings', grad: 'from-[#831843] to-[#EC4899]' },
    { name: 'Vijay Nagar', count: '10+ Listings', grad: 'from-[#1E3A8A] to-[#3B82F6]' },
    { name: 'Swaroop Nagar', count: '18+ Listings', grad: 'from-[#4C1D95] to-[#7C3AED]' },
    { name: 'Civil Lines', count: '12+ Listings', grad: 'from-[#166534] to-[#22C55E]' },
    { name: 'Awas Vikas', count: '15+ Listings', grad: 'from-[#92400E] to-[#EAB308]' },
    { name: 'Vikas Nagar', count: '9+ Listings', grad: 'from-[#134E4A] to-[#2DD4BF]' },
    { name: 'Barra', count: '16+ Listings', grad: 'from-[#7F1D1D] to-[#EF4444]' },
    { name: 'Kalyanpur', count: '19+ Listings', grad: 'from-[#5B21B6] to-[#8B5CF6]' },
    { name: 'Kidwai Nagar', count: '11+ Listings', grad: 'from-[#0891B2] to-[#22D3EE]' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="hero py-12 md:py-20" id="top">
          <div className="wrap hero-inner max-w-7xl mx-auto">
            {/* Trusted Avatar Stack */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6">
              <div className="flex -space-x-2 shrink-0">
                {['AP', 'PP', 'AK'].map((initials) => (
                  <div
                    key={initials}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border-2 border-[#07050F] flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[#EF4444] shrink-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                ))}
              </div>
              <span className="text-text-secondary text-xs sm:text-sm font-medium">83+ Verified Client Reviews</span>
            </div>

            {/* H1 Heading */}
            <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white mb-4 sm:mb-6">
              Find your next rental with <span className="hl">PrimeHomeKanpur</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-sm sm:text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Find your perfect rental with ease. Explore 100% physically verified homes across Kanpur, schedule instant physical visits, and move into your ideal home hassle-free.
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/rentals" className="btn orange text-sm sm:text-base btn-loop-shine justify-center py-3">
                Explore Rentals <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link href="/contact" className="btn dark text-sm sm:text-base justify-center py-3">
                Free Call Consultation
              </Link>
            </div>

            {/* Mobile-First Responsive Search Bar / Bottom Sheet */}
            <HomeSearchSection />
          </div>
        </section>

        {/* 2. Stats Strip with Large Animated Digits */}
        <section className="statsbar py-8 sm:py-10 bg-[#0E0A24]/60 border-y border-white/5">
          <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatedStatCounter value={83} suffix="+" label="Total Reviews" />
            <AnimatedStatCounter value={5} suffix="+" label="Years of Experience" />
            <AnimatedStatCounter value={67} suffix="+" label="Rentals Listed" />
            <AnimatedStatCounter value={98} suffix="%" label="Satisfaction Rate" />
          </div>
        </section>

        {/* 3. Rental Listings Grid */}
        <section className="sect bg-bg">
          <div className="wrap max-w-7xl mx-auto">
            <div className="sect-head row flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <span className="pill"><span className="dot" />Rental Listings</span>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Explore Premium <span className="hl">Rentals</span> Chosen For You
                </h2>
              </div>
              <Link href="/rentals" className="btn orange shrink-0 btn-loop-shine text-xs sm:text-sm py-2.5 px-4 self-start sm:self-auto">
                View All Rentals <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <p className="result-info text-text-muted text-xs sm:text-sm mb-6 sm:mb-8">Showing verified rentals across Kanpur</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Popular Working Areas (Swipeable Carousel on Mobile) */}
        <section className="sect gray overflow-hidden">
          <div className="wrap max-w-7xl mx-auto">
            <div className="sect-head row flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="pill"><span className="dot" />Popular Areas</span>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Our Rental Expertise Across Diverse <span className="hl">Working Areas</span>
                </h2>
              </div>
              <Link href="/rentals" className="btn orange shrink-0 text-xs sm:text-sm py-2.5 px-4 self-start sm:self-auto">
                View All Locations <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Swipeable Scroll Container on Mobile / Grid on Desktop */}
          <div className="wrap max-w-7xl mx-auto mt-4">
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 overflow-x-auto sm:overflow-x-visible pb-4 pt-2 snap-x snap-mandatory scrollbar-none">
              {popularAreas.map((area) => (
                <Link
                  key={area.name}
                  href={`/rentals?location=${encodeURIComponent(area.name)}`}
                  className={`snap-start shrink-0 w-[200px] sm:w-auto p-4 rounded-2xl bg-gradient-to-br ${area.grad} border border-white/15 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/30 block`}
                >
                  <div className="flex items-center gap-2 text-white/90 text-xs font-semibold mb-1">
                    <MapPin size={13} className="shrink-0" /> Kanpur
                  </div>
                  <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight truncate">
                    {area.name}
                  </h3>
                  <p className="text-white/80 text-xs mt-2 font-medium">
                    {area.count}
                  </p>
                </Link>
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

        {/* 7. Our Rental Services (Matching Image 1 & 5 with top lining & animations) */}
        <section className="sect bg-bg py-14" id="services">
          <div className="wrap">
            {/* Header matching Image 1 */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <OurServicesPill text="Our Services" />
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-white tracking-[-0.03em] leading-tight mb-3">
                We offer a complete spectrum of rental services for your needs
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                We currently focus only on rentals — helping tenants and landlords rent hassle free, backed by unparalleled results and expertise.
              </p>
            </div>

            {/* 3 Compact Services Cards with Top Lining & Animations */}
            <div className="grid gap-5 md:gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
              {/* Card 1: Find a rental */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[#120c29] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00C2D9]/50 hover:shadow-[0_18px_50px_rgba(0,194,217,0.18)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#00C2D9] before:to-transparent">
                <div>
                  <FindRentalIcon className="w-[52px] h-[52px] mb-5" />
                  <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-[#67E8F9] transition-colors">
                    Find a rental
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
                    Browse verified rentals matched to your budget and move-in date.
                  </p>
                  <div className="border-t border-white/5 pt-4 mb-6">
                    <ul className="space-y-3">
                      {[
                        'Neighborhood matching',
                        'Move-in date filtering',
                        'Verified listings only',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E2E8F0] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#00C2D9] shrink-0" strokeWidth={3} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href="/rentals"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#170f36] px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-[#20154a] hover:border-white/20 hover:scale-[1.01]"
                >
                  Read more
                </Link>
              </div>

              {/* Card 2: List your rental (Most Requested) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[#120c29] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#EA580C]/50 hover:shadow-[0_18px_50px_rgba(234,88,12,0.18)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#F97316] before:to-transparent">
                {/* Most requested badge */}
                <div className="absolute right-5 top-5 rounded-full bg-[#EA580C] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(234,88,12,0.45)]">
                  Most requested
                </div>

                <div>
                  <ListRentalHouseIcon className="w-[52px] h-[52px] mb-5" />
                  <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-[#FDBA74] transition-colors">
                    List your rental
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
                    Get your property listed, screened, and rented out fast.
                  </p>
                  <div className="border-t border-white/5 pt-4 mb-6">
                    <ul className="space-y-3">
                      {[
                        'Free listing photos',
                        'Tenant screening',
                        'Lease drafting',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E2E8F0] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#00C2D9] shrink-0" strokeWidth={3} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#00C2D9] px-4 py-3 text-center text-sm font-bold text-[#051824] shadow-[0_6px_20px_rgba(0,194,217,0.35)] transition-all duration-300 hover:bg-[#22D3EE] hover:shadow-[0_8px_24px_rgba(34,211,238,0.5)] hover:scale-[1.01]"
                >
                  Read more
                </Link>
              </div>

              {/* Card 3: Renewals & appraisal */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[#120c29] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8B5CF6]/50 hover:shadow-[0_18px_50px_rgba(139,92,246,0.18)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#A855F7] before:to-transparent">
                <div>
                  <RenewalsDocIcon className="w-[52px] h-[52px] mb-5" />
                  <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-[#C084FC] transition-colors">
                    Renewals &amp; appraisal
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
                    Get a free rent appraisal so pricing and renewals are always fair.
                  </p>
                  <div className="border-t border-white/5 pt-4 mb-6">
                    <ul className="space-y-3">
                      {[
                        'Market rent appraisal',
                        'Lease renewal support',
                        'Deposit handling',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E2E8F0] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#00C2D9] shrink-0" strokeWidth={3} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#170f36] px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-[#20154a] hover:border-white/20 hover:scale-[1.01]"
                >
                  Read more
                </Link>
              </div>
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
