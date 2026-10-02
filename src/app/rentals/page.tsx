import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import { getProperties } from '@/lib/data/properties'
import { createClient } from '@/lib/supabase/server'
import { Search, Heart, Phone, ArrowRight, Check, Calendar, Key } from 'lucide-react'
import { Metadata } from 'next'

interface RentalsPageProps {
  searchParams?: Promise<{
    location?: string
    bhk?: string
    price?: string
    tenant?: string
    search?: string
  }>
}

const DEFAULT_SETTINGS = {
  title: 'Rental Properties in Kanpur',
  subtitle: 'Find your perfect home',
  bannerImage: null,
  filters: {
    location: true,
    type: true,
    rent: true,
    bedrooms: true,
    furnishing: true,
    search: true,
  },
  listing: {
    sort: 'newest',
    perPage: 9,
    layout: 'grid',
    showRented: true,
    showRatings: true,
  },
  featured: {
    enabled: true,
    title: 'Featured Rentals',
    max: 3,
  },
  seo: {
    title: 'Rental Properties in Kanpur | PrimeHomeKanpur',
    description: 'Browse verified rental properties, flats, houses and rooms across prime Kanpur locations.',
  },
}

async function getPageSettings() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('page_settings')
      .select('value')
      .eq('key', 'rentals')
      .single()

    if (data?.value) {
      return { ...DEFAULT_SETTINGS, ...data.value }
    }
  } catch {}
  return DEFAULT_SETTINGS
}

async function getActiveLocations() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('locations')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (data && data.length > 0) return data
  } catch {}

  // Fallback defaults
  return [
    { id: '1', name: 'Gurudev Chauraha', slug: 'gurudev-chauraha' },
    { id: '2', name: 'Kakadeo', slug: 'kakadeo' },
    { id: '3', name: 'Vijay Nagar', slug: 'vijay-nagar' },
    { id: '4', name: 'Vikas Nagar', slug: 'vikas-nagar' },
    { id: '5', name: 'Awas Vikas', slug: 'awas-vikas' },
    { id: '6', name: 'Swaroop Nagar', slug: 'swaroop-nagar' },
    { id: '7', name: 'Civil Lines', slug: 'civil-lines' },
    { id: '8', name: 'Barra', slug: 'barra' },
    { id: '9', name: 'Panki', slug: 'panki' },
    { id: '10', name: 'Kidwai Nagar', slug: 'kidwai-nagar' },
  ]
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPageSettings()
  return {
    title: settings.seo?.title || DEFAULT_SETTINGS.seo.title,
    description: settings.seo?.description || DEFAULT_SETTINGS.seo.description,
  }
}

export default async function RentalsPage({ searchParams }: RentalsPageProps) {
  const params = (await searchParams) || {}
  const [settings, locations, allProperties] = await Promise.all([
    getPageSettings(),
    getActiveLocations(),
    getProperties({
      location: params.location,
      bhk: params.bhk,
      priceRange: params.price,
      tenantType: params.tenant,
    }),
  ])

  // Filter out RENTED if settings disable it
  let properties = allProperties
  if (settings.listing?.showRented === false) {
    properties = properties.filter((p) => p.status === 'AVAILABLE')
  }

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
              {settings.title ? (
                <span>{settings.title}</span>
              ) : (
                <>
                  Find your perfect <span className="hl">rental home</span> in Kanpur
                </>
              )}
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl leading-relaxed">
              {settings.subtitle ||
                'Browse verified listings across prime locations. Filter by budget, BHK, tenant type, and more to find exactly what you need.'}
            </p>
          </div>
        </section>

        {/* 2. Filter Bar Overlapping Hero */}
        <section className="searchbar">
          <div className="wrap">
            <form action="/rentals" method="GET" className="card-s">
              {/* Location Filter */}
              {settings.filters?.location !== false && (
                <div className="field">
                  <label htmlFor="rentals-location">Location</label>
                  <select
                    id="rentals-location"
                    name="location"
                    defaultValue={params.location || ''}
                  >
                    <option value="">All Kanpur areas</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* BHK Filter */}
              {settings.filters?.bedrooms !== false && (
                <div className="field">
                  <label htmlFor="rentals-bhk">BHK</label>
                  <select id="rentals-bhk" name="bhk" defaultValue={params.bhk || ''}>
                    <option value="">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              {settings.filters?.rent !== false && (
                <div className="field">
                  <label htmlFor="rentals-price">Price Range</label>
                  <select id="rentals-price" name="price" defaultValue={params.price || ''}>
                    <option value="">Any budget</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-20k">₹10,000 – ₹20,000</option>
                    <option value="20k-30k">₹20,000 – ₹30,000</option>
                    <option value="above-30k">Above ₹30,000</option>
                  </select>
                </div>
              )}

              {/* Tenant Type Filter */}
              {settings.filters?.type !== false && (
                <div className="field">
                  <label htmlFor="rentals-tenant">Tenant Type</label>
                  <select id="rentals-tenant" name="tenant" defaultValue={params.tenant || ''}>
                    <option value="">Any tenant type</option>
                    <option value="Family">Family</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              )}

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
                <p className="result-info mt-2">
                  Showing {properties.length} rentals across Kanpur
                </p>
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

        {/* 4. How It Works */}
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
                  desc: 'Filter and explore our verified listings across Kanpur neighborhoods.',
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
                  <div className="step-num mx-auto mb-4">{step.num}</div>
                  <div className="flex justify-center mb-4">{step.icon}</div>
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
