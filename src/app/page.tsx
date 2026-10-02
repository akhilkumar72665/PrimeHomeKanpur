import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import PropertyCard from '@/components/cards/PropertyCard'
import SectionHeading from '@/components/sections/SectionHeading'
import { getFeaturedProperties } from '@/lib/data/properties'
import { Star, Search, MapPin, Shield, Clock, Award, Check, ArrowRight, Phone, MessageSquare } from 'lucide-react'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties(6)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-bg purple-glow diagonal-pattern overflow-hidden">
          <div className="container-custom py-20 md:py-28 lg:py-32">
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-violet-dark border-2 border-bg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    >
                      {['JM', 'AR', 'KP'][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                </div>
                <span className="text-text-secondary text-sm">Trusted by 40+ clients</span>
              </div>

              <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-white mb-6">
                Find your next rental with <span className="text-primary">PrimeHomeKanpur</span>
              </h1>

              <p className="text-text-secondary text-lg mb-8 max-w-xl">
                Find your perfect rental with ease. Explore verified listings, get landlord-ready support, and move in with confidence.
              </p>

              <Button variant="primary" size="lg" className="mb-12">
                Explore Rentals <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="hero-panel border border-border rounded-[1.5rem] p-5 md:p-6 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-text-muted text-[10px] uppercase tracking-[0.18em] mb-2">
                      Location
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      <option>All Kanpur areas</option>
                      <option>Gurudev Chauraha</option>
                      <option>Kakadeo</option>
                      <option>Vijay Nagar</option>
                      <option>Vikas Nagar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted text-[10px] uppercase tracking-[0.18em] mb-2">
                      BHK
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      <option>Any BHK</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4+ BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted text-[10px] uppercase tracking-[0.18em] mb-2">
                      Price Range
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      <option>Any budget</option>
                      <option>Under ₹10,000</option>
                      <option>₹10,000 - ₹20,000</option>
                      <option>₹20,000 - ₹30,000</option>
                      <option>Above ₹30,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted text-[10px] uppercase tracking-[0.18em] mb-2">
                      Tenant Type
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      <option>Any tenant type</option>
                      <option>Family</option>
                      <option>Bachelor</option>
                      <option>Professional</option>
                    </select>
                  </div>
                </div>
                <Button variant="primary" size="md" className="w-full md:w-auto mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Search Rentals
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-bg-purple border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              <StatItem number="83" label="Total Reviews" />
              <StatItem number="14" label="Years of Experience" />
              <StatItem number="67" label="Rentals Listed" />
              <StatItem number="98%" label="Satisfaction Rate" />
            </div>
          </div>
        </section>

        {/* Rental Listings */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Rental Listings"
              title="Explore Premium"
              highlight="Rentals Chosen For You"
              rightAction={
                <Button variant="primary" size="md">
                  View All Rentals <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              }
            />
            <p className="text-text-muted mb-8">Showing {featuredProperties.length} rentals across Kanpur</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Areas */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Popular Areas"
              title="Our Rental Expertise Across Diverse"
              highlight="Working Areas"
              rightAction={
                <Button variant="primary" size="md">
                  View All Locations <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              }
            />

            <div className="marquee">
              <div className="marquee-track">
                {[
                  { name: 'Gurudev Chauraha', gradient: 'from-[#0F766E] to-[#00C2D9]' },
                  { name: 'Kakadeo', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
                  { name: 'Vijay Nagar', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
                  { name: 'Vikas Nagar', gradient: 'from-[#134E4A] to-[#2DD4BF]' },
                  { name: 'Awas Vikas', gradient: 'from-[#5B21B6] to-[#8B5CF6]' },
                  { name: 'Swaroop Nagar', gradient: 'from-[#1E3A8A] to-[#3B82F6]' },
                  { name: 'Civil Lines', gradient: 'from-[#831843] to-[#EC4899]' },
                  { name: 'Arya Nagar', gradient: 'from-[#166534] to-[#22C55E]' },
                  { name: 'Kalyanpur', gradient: 'from-[#92400E] to-[#EAB308]' },
                  { name: 'Barra', gradient: 'from-[#0F766E] to-[#00C2D9]' },
                  { name: 'Panki', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
                  { name: 'Kidwai Nagar', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
                ].concat([
                  { name: 'Gurudev Chauraha', gradient: 'from-[#0F766E] to-[#00C2D9]' },
                  { name: 'Kakadeo', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
                  { name: 'Vijay Nagar', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
                  { name: 'Vikas Nagar', gradient: 'from-[#134E4A] to-[#2DD4BF]' },
                  { name: 'Awas Vikas', gradient: 'from-[#5B21B6] to-[#8B5CF6]' },
                  { name: 'Swaroop Nagar', gradient: 'from-[#1E3A8A] to-[#3B82F6]' },
                  { name: 'Civil Lines', gradient: 'from-[#831843] to-[#EC4899]' },
                  { name: 'Arya Nagar', gradient: 'from-[#166534] to-[#22C55E]' },
                  { name: 'Kalyanpur', gradient: 'from-[#92400E] to-[#EAB308]' },
                  { name: 'Barra', gradient: 'from-[#0F766E] to-[#00C2D9]' },
                  { name: 'Panki', gradient: 'from-[#7F1D1D] to-[#EF4444]' },
                  { name: 'Kidwai Nagar', gradient: 'from-[#4C1D95] to-[#7C3AED]' },
                ]).map((area, index) => (
                  <div
                    key={`${area.name}-${index}`}
                    className={`relative w-[220px] shrink-0 aspect-[4/3] rounded-2xl bg-gradient-to-br ${area.gradient} grid-pattern overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-base md:text-lg leading-snug">{area.name}</h3>
                      <p className="text-white/70 text-xs md:text-sm">Kanpur</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Testimonials"
              title="Clients"
              highlight="Success Stories"
              description="Our clients' success stories highlight achievements, satisfaction, and results, reflecting our expertise, dedication, and trusted partnerships."
            />

            <div className="relative py-6 my-4">
              <div className="hidden md:flex absolute top-4 left-8 w-11 h-11 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] border-2 border-primary/30 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar">
                JM
              </div>
              <div className="hidden md:flex absolute top-12 right-12 w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-2 border-violet/30 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '0.8s' }}>
                KP
              </div>
              <div className="hidden md:flex absolute bottom-8 left-16 w-9 h-9 rounded-full bg-gradient-to-br from-[#0F766E] to-[#00C2D9] border-2 border-primary/30 items-center justify-center text-white text-[11px] font-bold shadow-lg float-avatar" style={{ animationDelay: '1.2s' }}>
                SL
              </div>
              <div className="hidden md:flex absolute bottom-6 right-20 w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border-2 border-violet/30 items-center justify-center text-white text-xs font-bold shadow-lg float-avatar" style={{ animationDelay: '1.8s' }}>
                AR
              </div>
              <div className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#8B5CF6] border border-white/20 items-center justify-center text-white text-[10px] font-bold opacity-75 float-avatar" style={{ animationDelay: '0.4s' }}>
                RS
              </div>
              <div className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#0891B2] to-[#22D3EE] border border-white/20 items-center justify-center text-white text-[10px] font-bold opacity-75 float-avatar" style={{ animationDelay: '1.4s' }}>
                NM
              </div>

              <div className="bg-surface-elevated border border-border rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center shadow-2xl relative z-10">
                <p className="text-white text-lg md:text-2xl mb-6 leading-relaxed font-medium">
                  &ldquo;PrimeHomeKanpur made the entire rental-search process surprisingly easy. The interface is smooth, the details are clear, and I actually enjoyed comparing different places.&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] border-2 border-primary/40 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    JM
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base">Jyoti Mishra</p>
                    <p className="text-text-secondary text-sm">Tenant · Kakadeo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
              ].map((testimonial) => (
                <div key={testimonial.name} className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-violet/50 transition-colors">
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
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

        {/* Why Choose Us */}
        <section className="bg-bg-purple py-20 border-t border-border/40">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Visual - Two overlapping cards */}
              <div className="relative w-full aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                {/* Back card - Purple gradient */}
                <div className="absolute top-0 left-0 w-[78%] h-[78%] rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7c3aed] border-2 border-violet/30 shadow-[0_20px_50px_rgba(124,58,237,0.35)]" />
                {/* Front card - Teal/cyan gradient */}
                <div className="absolute bottom-0 right-0 w-[78%] h-[78%] rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#00c2d9] border-2 border-primary/40 shadow-[0_25px_60px_rgba(0,194,217,0.25)] grid-pattern" />
              </div>

              {/* Content */}
              <div>
                <SectionHeading
                  pill="Why Choose Us"
                  title="Why choose our"
                  highlight="rental expertise"
                />

                <div className="space-y-6">
                  {[
                    {
                      icon: <Search className="w-6 h-6" />,
                      title: 'Expert Guidance',
                      description: 'Find rentals by filtering for application competition and recent rent updates to make informed decisions easily.',
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: 'Verified Rental Selection',
                      description: 'Every listing is checked in person before it reaches our catalog, so photos always match reality.',
                    },
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: 'Stress-Free Process',
                      description: 'We track applications, deposits, and lease deadlines so you are never chasing a document.',
                    },
                    {
                      icon: <Award className="w-6 h-6" />,
                      title: 'Proven Track Record',
                      description: 'Over a decade of leases signed across 43 neighborhoods and counting.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <div className="text-gray-900">{item.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Our Services"
              title="We offer a complete spectrum of"
              highlight="rental services for your needs"
              description="We currently focus only on rentals — helping landlords rent hassle free, backed by unparalleled results and expertise."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className={`relative rounded-2xl p-6 border ${
                    service.featured
                      ? 'bg-surface-elevated border-primary shadow-[0_20px_60px_rgba(124,58,237,0.25)]'
                      : 'bg-surface border-border'
                  }`}
                >
                  {service.featured && (
                    <div className="absolute -top-3 -right-3 bg-danger-badge text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most requested
                    </div>
                  )}
                  
                  <div className="w-12 h-12 rounded-lg bg-violet-deep border border-violet flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={service.featured ? 'primary' : 'outline'}
                    size="md"
                    className="w-full"
                  >
                    Read more
                  </Button>
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
                Ready to find your <span className="text-primary">dream rental?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of happy tenants and landlords who trust PrimeHomeKanpur for all their rental needs in Kanpur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Browse Rentals
                </Button>
                <Button variant="secondary" size="lg">
                  List Your Property
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
