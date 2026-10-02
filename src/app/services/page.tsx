import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/sections/SectionHeading'
import { Search, Shield, FileText, Calendar, Check, ArrowRight, Users, Home, Key } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Rental Search',
      description: 'Find your perfect rental from our verified listings across Kanpur.',
      features: ['Advanced filtering', 'Verified listings', 'Real-time availability'],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Property Verification',
      description: 'Every property is physically verified before listing to ensure authenticity.',
      features: ['In-person verification', 'Photo verification', 'Background checks'],
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Site Visit Assistance',
      description: 'Schedule property visits at your convenience with our agents.',
      features: ['Flexible scheduling', 'Agent accompaniment', 'Transport assistance'],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Tenant Assistance',
      description: 'Complete support for tenants from search to move-in.',
      features: ['Personalized matching', 'Negotiation support', 'Documentation help'],
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Documentation Support',
      description: 'Professional assistance with all rental paperwork and legal formalities.',
      features: ['Lease drafting', 'Registration support', 'Legal guidance'],
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: 'Move-in Support',
      description: 'End-to-end support to ensure a smooth transition to your new home.',
      features: ['Utility connections', 'Change of address', 'Settling-in assistance'],
    },
  ]

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
                  Services
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[0.98] tracking-[-0.04em] mb-6">
                Complete <span className="text-primary">rental services</span> for your needs
              </h1>
              
              <p className="text-text-secondary text-lg mb-8 max-w-2xl">
                From finding your perfect home to handling all the paperwork, PrimeHomeKanpur offers end-to-end rental services designed to make your experience seamless and stress-free.
              </p>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-primary cursor-pointer hover:underline">Home</span>
                <span>/</span>
                <span>Services</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="bg-bg py-20">
          <div className="container-custom">
            <SectionHeading
              title="Our comprehensive"
              highlight="rental services"
              description="We currently focus only on rentals — helping tenants find their perfect home and landlords rent hassle-free, backed by unparalleled results and expertise."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.title} className="feature-card bg-surface border border-border rounded-2xl p-6">
                  <div className="icon-shell w-14 h-14 mb-4 text-primary">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-bg-purple py-20">
          <div className="container-custom">
            <SectionHeading
              pill="Process"
              title="How our"
              highlight="services work"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: <Search className="w-8 h-8" />,
                  title: 'Tell Us Your Needs',
                  description: 'Share your requirements — budget, location, BHK, and preferences.',
                },
                {
                  step: '2',
                  icon: <Home className="w-8 h-8" />,
                  title: 'We Find Matches',
                  description: 'Our team shortlists verified properties that match your criteria.',
                },
                {
                  step: '3',
                  icon: <Calendar className="w-8 h-8" />,
                  title: 'Visit & Choose',
                  description: 'Schedule visits, see properties, and select your favorite.',
                },
                {
                  step: '4',
                  icon: <Key className="w-8 h-8" />,
                  title: 'Move In',
                  description: 'We handle paperwork, agreements, and help you settle in.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-gray-900 font-bold text-2xl">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-violet-deep border border-violet flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{item.icon}</div>
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
            <div className="bg-surface-elevated border border-border rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to get <span className="text-primary">started?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Whether you're looking for a rental or need help renting out your property, our team is here to assist you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Browse Rentals
                </Button>
                <Button variant="secondary" size="lg">
                  Contact Us <ArrowRight className="w-4 h-4 ml-2" />
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
