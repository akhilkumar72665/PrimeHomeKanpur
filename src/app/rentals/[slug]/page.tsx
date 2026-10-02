import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import PropertyCard from '@/components/cards/PropertyCard'
import { getPropertyBySlug, getProperties } from '@/lib/data/properties'
import { MapPin, Phone, Mail, MessageSquare, Calendar, Clock, Square, Building, Check, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PropertyDetailsPage({ params }: { params: { slug: string } }) {
  const property = await getPropertyBySlug(params.slug)
  
  if (!property) {
    notFound()
  }

  const similarProperties = await getProperties()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-bg purple-glow diagonal-pattern py-12 md:py-20">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-deep border border-violet mb-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  Property Details
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-3 text-text-secondary mb-6">
                <MapPin className="w-5 h-5 text-accent-pink" />
                <span>{property.location?.name || 'Kanpur'}, Kanpur · Available for rent</span>
              </div>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span className="text-primary cursor-pointer hover:underline">Rentals</span>
                <span>/</span>
                <span>{property.title}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-bg py-8">
          <div className="container-custom">
            <div className="feature-card bg-surface border border-border rounded-[1.5rem] overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-teal-700 to-cyan-400 grid-pattern"></div>
              <div className="grid grid-cols-4 gap-1 p-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-violet to-violet-dark rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-bg py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Price & Quick Facts */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-white">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-text-muted">/month</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickFact icon={<Building className="w-5 h-5" />} label="BHK" value={`${property.bhk} BHK`} />
                    <QuickFact icon={<Square className="w-5 h-5" />} label="Area" value={`${property.area_sqft.toLocaleString()} sqft`} />
                    <QuickFact icon={<Building className="w-5 h-5" />} label="Floor" value={property.floor ? `${property.floor} of ${property.total_floors}` : 'N/A'} />
                    <QuickFact icon={<Clock className="w-5 h-5" />} label="Furnishing" value={property.furnishing || 'Semi-Furnished'} />
                  </div>
                </div>

                {/* Description */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                  <p className="text-text-secondary leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Parking',
                      'Power Backup',
                      '24x7 Water',
                      'Elevator',
                      'High-Speed WiFi',
                      'Balcony',
                      'Security',
                      'Washing Machine',
                      'Modular Kitchen',
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-text-secondary">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
                  <div className="flex items-start gap-3 text-text-secondary mb-4">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>{property.address}</p>
                  </div>
                  <div className="aspect-video bg-surface-elevated border border-border rounded-xl grid-pattern"></div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Agent Card */}
                <div className="feature-card bg-surface-elevated border border-border rounded-[1.5rem] p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet to-violet-dark flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
                      RP
                    </div>
                    <h3 className="text-white font-bold text-lg">Rajesh Pathak</h3>
                    <p className="text-primary text-sm font-semibold">Founder & CEO</p>
                    <p className="text-text-muted text-xs mt-1">14+ years experience</p>
                  </div>

                  <div className="space-y-3">
                    <Button variant="primary" size="md" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button variant="secondary" size="md" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Agent
                    </Button>
                    <Button variant="outline" size="md" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Schedule Visit Form */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Schedule a Visit</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted text-xs uppercase tracking-wider mb-2">
                        Preferred Time
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-white text-sm focus:outline-none focus:border-primary">
                        <option>Morning (9AM - 12PM)</option>
                        <option>Afternoon (12PM - 4PM)</option>
                        <option>Evening (4PM - 7PM)</option>
                      </select>
                    </div>
                    <Button variant="primary" size="md" className="w-full">
                      Schedule Tour
                    </Button>
                  </form>
                </div>

                {/* Tenant Tips */}
                <div className="feature-card bg-surface border border-border rounded-[1.5rem] p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Tenant Tips</h3>
                  <ul className="space-y-3 text-text-secondary text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Carry valid ID proof for verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Check water pressure and electricity during visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Verify neighborhood amenities nearby</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Clarify maintenance charges in advance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-white mb-8">
              You might also like <span className="text-primary">these</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.slice(0, 4).map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-lg bg-violet-deep border border-violet flex items-center justify-center mx-auto mb-2">
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  )
}
