import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import { getProperties } from '@/lib/data/properties'
import { Search, Heart, Phone, ArrowRight, Check, Calendar, Key } from 'lucide-react'

export default async function RentalsPage() {
  const properties = await getProperties()

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Page Hero */}
        <section className="page-hero">
          <div className="wrap">
            {/* Breadcrumb */}
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Rentals</span>
            </div>

            <span className="pill mb-4"><span className="dot" />Rental Listings</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Find your perfect <span className="hl">rental home</span> in Kanpur
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl leading-relaxed">
              Browse 67+ verified listings across prime locations. Filter by budget, BHK, tenant type, and more to find exactly what you need.
            </p>
          </div>
        </section>

        {/* 2. Filter Bar Overlapping Hero */}
        <section className="searchbar">
          <div className="wrap">
            <form action="/rentals" method="GET" className="card-s">
              <div className="field">
                <label htmlFor="rentals-location">Location</label>
                <select id="rentals-location" name="location" defaultValue="">
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
                <label htmlFor="rentals-bhk">BHK</label>
                <select id="rentals-bhk" name="bhk" defaultValue="">
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="rentals-price">Price Range</label>
                <select id="rentals-price" name="price" defaultValue="">
                  <option value="">Any budget</option>
                  <option value="under-10k">Under ₹10,000</option>
                  <option value="10k-20k">₹10,000 – ₹20,000</option>
                  <option value="20k-30k">₹20,000 – ₹30,000</option>
                  <option value="above-30k">Above ₹30,000</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="rentals-tenant">Tenant Type</label>
                <select id="rentals-tenant" name="tenant" defaultValue="">
                  <option value="">Any tenant type</option>
                  <option value="Family">Family</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <button type="submit" className="btn orange w-full">
                  <Search className="w-4 h-4 mr-1" /> Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 3. All Rental Properties Grid */}
        <section className="sect bg-bg">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <h2>
                  All <span className="hl">Rental</span> Properties
                </h2>
                <p className="result-info mt-2">Showing {properties.length} rentals across Kanpur</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="btn dark">
                  <Heart className="w-4 h-4 mr-1.5 text-accent-pink" /> Shortlist
                </button>
                <Link href="/contact" className="btn orange">
                  <Phone className="w-4 h-4 mr-1.5 text-accent-pink" /> Get Assistance
                </Link>
              </div>
            </div>

            <div className="listings">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. How It Works (4 Simple Steps) */}
        <section className="sect gray">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="pill mx-auto mb-4"><span className="dot" />How It Works</span>
              <h2 className="mx-auto">Find your rental in <span className="hl">4 simple steps</span></h2>
              <p className="text-text-secondary text-sm md:text-base mt-4 leading-relaxed">
                Our streamlined process gets you from browsing to move-in faster than you thought possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  num: '1',
                  icon: <Search className="w-6 h-6 text-primary" />,
                  title: 'Browse Listings',
                  desc: 'Filter and explore our verified listings across 43+ Kanpur neighborhoods.',
                },
                {
                  num: '2',
                  icon: <Calendar className="w-6 h-6 text-primary" />,
                  title: 'Schedule Visit',
                  desc: 'Book a visit online or call our agent to see the property in person.',
                },
                {
                  num: '3',
                  icon: <Check className="w-6 h-6 text-primary" />,
                  title: 'Apply & Verify',
                  desc: 'Submit documents and complete tenant verification with our guidance.',
                },
                {
                  num: '4',
                  icon: <Key className="w-6 h-6 text-primary" />,
                  title: 'Move In',
                  desc: 'Sign the lease, pay deposit, and get your keys. Welcome home!',
                },
              ].map((step) => (
                <div key={step.num} className="step text-center">
                  <div className="step-num mx-auto mb-4">
                    {step.num}
                  </div>
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="sect pt-0">
          <div className="wrap">
            <div className="cta-section">
              <h2>
                Need help <span className="hl">finding the perfect place?</span>
              </h2>
              <p>
                Our rental experts know every corner of Kanpur. Tell us your requirements and we&apos;ll shortlist the best matches for you — free of charge.
              </p>
              <div className="cta-btns">
                <Link href="/contact" className="btn orange">
                  Talk to an Expert
                </Link>
                <Link href="/agents" className="btn dark">
                  Meet Our Agents <ArrowRight className="w-4 h-4 ml-1" />
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
