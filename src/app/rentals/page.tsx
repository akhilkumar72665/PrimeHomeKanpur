import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import PropertyCard from '@/components/cards/PropertyCard'
import SectionHeading from '@/components/sections/SectionHeading'
import Select from '@/components/ui/Select'
import { getProperties } from '@/lib/data/properties'
import { Search, Heart, Phone, ArrowRight, Check, Calendar, MapPin, Key } from 'lucide-react'

export default async function RentalsPage() {
  const properties = await getProperties()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-bg purple-glow teal-glow diagonal-pattern py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-deep border border-violet mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  Rental Listings
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Find your perfect <span className="text-primary">rental home</span> in Kanpur
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                Browse 67+ verified listings across prime locations. Filter by budget, BHK, tenant type, and more to find exactly what you need.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>Rentals</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="bg-bg -mt-8 relative z-10">
          <div className="container-custom">
            <div className="hero-panel border border-border rounded-[1.5rem] p-5 md:p-6 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <Select>
                    <option>All Kanpur areas</option>
                    <option>Gurudev Chauraha</option>
                    <option>Kakadeo</option>
                    <option>Vijay Nagar</option>
                    <option>Vikas Nagar</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                    BHK
                  </label>
                  <Select>
                    <option>Any BHK</option>
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4+ BHK</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                    Price Range
                  </label>
                  <Select>
                    <option>Any budget</option>
                    <option>Under ₹10,000</option>
                    <option>₹10,000 - ₹20,000</option>
                    <option>₹20,000 - ₹30,000</option>
                    <option>Above ₹30,000</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                    Tenant Type
                  </label>
                  <Select>
                    <option>Any tenant type</option>
                    <option>Family</option>
                    <option>Bachelor</option>
                    <option>Professional</option>
                  </Select>
                </div>
              </div>
              <Button variant="primary" size="md" className="mt-4">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Property Grid */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  All <span className="text-primary">Rental</span> Properties
                </h2>
                <p className="text-text-muted">Showing {properties.length} rentals across Kanpur</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="md">
                  <Heart className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
                <Button variant="primary" size="md">
                  <Phone className="w-4 h-4 mr-2 text-accent-pink" />
                  Get Assistance
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-bg-purple py-20">
          <div className="container-custom">
            <SectionHeading
              pill="How It Works"
              title="Find your rental in"
              highlight="4 simple steps"
              description="Our streamlined process gets you from browsing to move-in faster than you thought possible."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: <Search className="w-8 h-8" />,
                  title: 'Browse Listings',
                  description: 'Filter and explore our verified listings across 16+ Kanpur neighborhoods.',
                },
                {
                  step: '2',
                  icon: <Calendar className="w-8 h-8" />,
                  title: 'Schedule Visit',
                  description: 'Book a visit online or call our agent to see the property in person.',
                },
                {
                  step: '3',
                  icon: <Check className="w-8 h-8" />,
                  title: 'Apply & Verify',
                  description: 'Submit documents and complete tenant verification with our guidance.',
                },
                {
                  step: '4',
                  icon: <Key className="w-8 h-8" />,
                  title: 'Move In',
                  description: 'Sign the lease, pay deposit, and get your keys. Welcome home!',
                },
              ].map((item) => (
                <div key={item.step} className="feature-card text-center rounded-2xl p-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-gray-900 font-bold text-2xl shadow-md">
                    {item.step}
                  </div>
                  <div className="icon-shell w-12 h-12 rounded-lg mx-auto mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <div className="bg-surface-elevated border border-border rounded-[2rem] p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-4">
                Need help <span className="text-primary">finding the perfect place?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Our rental experts know every corner of Kanpur. Tell us your requirements and we'll shortlist the best matches for you — free of charge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Talk to an Expert
                </Button>
                <Button variant="secondary" size="lg">
                  Meet Our Agents <ArrowRight className="w-4 h-4 ml-2" />
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
