import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/cards/PropertyCard'
import { getPropertyBySlug, getProperties } from '@/lib/data/properties'
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Building,
  Check,
  ArrowRight,
  Shield,
  Lightbulb,
  Compass,
} from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const property = await getPropertyBySlug(resolvedParams.slug)

  if (!property) {
    notFound()
  }

  const allProperties = await getProperties()
  const similarProperties = allProperties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Hero */}
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/rentals">Rentals</Link>
              <span>/</span>
              <span>{property.title}</span>
            </div>

            <span className="pill mb-4"><span className="dot" />Property Details</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.8rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-4">
              {property.title}
            </h1>

            <div className="flex items-center gap-2.5 text-text-secondary text-base">
              <MapPin className="w-5 h-5 text-[#EC4899] shrink-0" />
              <span>{property.location?.name || 'Kanpur'}, Kanpur · Available for rent</span>
            </div>
          </div>
        </section>

        {/* 2. Gallery & Main Content */}
        <section className="sect pt-8 bg-bg">
          <div className="wrap">
            {/* Gallery Container */}
            <div className="mb-10 rounded-2xl overflow-hidden border border-line bg-surface">
              <div className="aspect-[21/9] w-full p4 photo relative">
                <span className="tag rent">For Rent</span>
                {property.featured && <span className="tag featured">Featured</span>}
              </div>
              <div className="grid grid-cols-4 gap-2 p-3 bg-[#0A0719]">
                {['p1', 'p2', 'p3', 'p4'].map((cls) => (
                  <div
                    key={cls}
                    className={`aspect-[16/9] rounded-xl ${cls} border border-white/10 cursor-pointer hover:opacity-90 transition-opacity`}
                  />
                ))}
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Price Card */}
                <div className="card p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                    <div className="price text-3xl md:text-4xl">
                      ₹{property.price.toLocaleString()} <small className="text-lg">/ month</small>
                    </div>
                    <span className="text-xs text-text-muted font-medium">Listed 3 days ago</span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-line text-sm text-text-secondary">
                    <div><span className="text-text-muted">Deposit:</span> ₹{(property.price * 2).toLocaleString()}</div>
                    <div>·</div>
                    <div><span className="text-text-muted">Maintenance:</span> ₹1,200/mo</div>
                    <div>·</div>
                    <div><span className="text-text-muted">Available:</span> Immediate</div>
                    <div>·</div>
                    <div><span className="text-text-muted">Furnishing:</span> {property.furnishing || 'Semi-Furnished'}</div>
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="card p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Facts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#0A0719] border border-line text-center">
                      <div className="text-2xl font-extrabold text-primary mb-1">{property.bhk}</div>
                      <div className="text-xs text-text-muted uppercase tracking-wider">Bedrooms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0719] border border-line text-center">
                      <div className="text-2xl font-extrabold text-primary mb-1">2</div>
                      <div className="text-xs text-text-muted uppercase tracking-wider">Bathrooms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0719] border border-line text-center">
                      <div className="text-2xl font-extrabold text-primary mb-1">{property.area_sqft.toLocaleString()}</div>
                      <div className="text-xs text-text-muted uppercase tracking-wider">Sqft Area</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0719] border border-line text-center">
                      <div className="text-2xl font-extrabold text-primary mb-1">{property.floor || 3} of {property.total_floors || 6}</div>
                      <div className="text-xs text-text-muted uppercase tracking-wider">Floor</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="card p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'Parking Available',
                      'Power Backup',
                      '24×7 Water',
                      'Elevator',
                      'High-Speed WiFi',
                      'Balcony / Garden',
                      'Senior Friendly',
                      'Gated Society',
                      'Washing Machine',
                      'Modular Kitchen',
                      'AC in Bedrooms',
                      'DTH Connection',
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2.5 text-text-secondary text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="card p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Property Description</h3>
                  <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
                    <p>
                      This beautifully designed {property.bhk}BHK apartment in the heart of {property.location?.name || 'Kanpur'} offers modern living at an affordable price. The apartment is on a well-maintained building with elevator access, power backup, and 24-hour water supply.
                    </p>
                    <p>
                      The spacious living room opens to a private balcony overlooking a green park — perfect for morning tea or evening relaxation. Both bedrooms come with built-in wardrobes and AC points. The modular kitchen is equipped with a chimney, cabinets, and has a separate utility area.
                    </p>
                    <p>
                      Located just 5 minutes from the main market, schools, hospitals, and public transport are all within walking distance. The gated society offers reserved covered parking, CCTV surveillance, and a children&apos;s play area.
                    </p>
                    <p>
                      Preferred tenants: Working professionals, small families, or couples. Non-negotiable: No smoking inside, 11-month lease agreement with 2 months security deposit.
                    </p>
                  </div>
                </div>

                {/* Location Advantages */}
                <div className="card p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Location Advantages</h3>
                  <div className="space-y-4 text-sm text-text-secondary">
                    <div className="flex gap-3 items-start">
                      <Building className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Nearby Schools:</strong> Delhi Public School (1.2 km), St. Xavier&apos;s (2.0 km), UP Public School (800m)
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Hospitals:</strong> Regency Hospital (1.8 km), Apollo Clinic (1.1 km), Metro Hospital (2.5 km)
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Compass className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Shopping:</strong> Local Market (500m), Rave@Moti Mall (3.2 km), Z Square Mall (5.0 km)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Location */}
                <div className="card p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Map Location</h3>
                  <div className="aspect-[21/9] rounded-xl bg-[#0A0719] border border-line flex flex-col items-center justify-center text-center p-6 photo p1">
                    <MapPin className="w-8 h-8 text-primary mb-2" />
                    <p className="text-white font-bold text-base">{property.location?.name || 'Kanpur'}, Kanpur</p>
                    <p className="text-white/80 text-xs mt-1">26.3131° N, 80.2785° E</p>
                  </div>
                </div>
              </div>

              {/* Right Sticky Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Agent Card */}
                <div className="card p-6 text-center">
                  <div className="agent-avatar mx-auto mb-3 bg-gradient-to-br from-[#3B82F6] to-[#00C2D9]">
                    RP
                  </div>
                  <h4 className="text-lg font-bold text-white">Rajesh Pathak</h4>
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                    Senior Rental Agent · 14 yrs exp
                  </p>

                  <div className="agent-stats mb-6">
                    <div>
                      <div className="agent-stat-val">240+</div>
                      <div className="agent-stat-lbl">Deals</div>
                    </div>
                    <div>
                      <div className="agent-stat-val">4.9★</div>
                      <div className="agent-stat-lbl">Rating</div>
                    </div>
                    <div>
                      <div className="agent-stat-val">45</div>
                      <div className="agent-stat-lbl">Listings</div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <a href="tel:+916398987290" className="btn orange w-full">
                      <Phone className="w-4 h-4 mr-1 text-[#EC4899]" /> Call Agent
                    </a>
                    <a href="mailto:pathak424448@gmail.com" className="btn dark w-full">
                      <Mail className="w-4 h-4 mr-1" /> Email Agent
                    </a>
                    <a
                      href="https://wa.me/916398987290"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn outline w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-1 text-[#25D366]" /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Schedule a Visit Form */}
                <div id="schedule-visit" className="card p-6">
                  <h4 className="text-lg font-bold text-white mb-2">Schedule a Site Visit</h4>
                  <p className="text-text-muted text-xs mb-6">
                    Fill the form and we&apos;ll confirm your visit within 2 hours.
                  </p>

                  <form className="space-y-4">
                    <div className="field">
                      <label htmlFor="visit-name">Your Full Name</label>
                      <input id="visit-name" type="text" placeholder="John Doe" required />
                    </div>

                    <div className="field">
                      <label htmlFor="visit-phone">Phone Number</label>
                      <input id="visit-phone" type="tel" placeholder="+91 98765 43210" required />
                    </div>

                    <div className="field">
                      <label htmlFor="visit-date">Preferred Date</label>
                      <input id="visit-date" type="date" required />
                    </div>

                    <div className="field">
                      <label htmlFor="visit-time">Preferred Time</label>
                      <select id="visit-time" defaultValue="morning">
                        <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                        <option value="afternoon">Afternoon (1:00 PM – 4:00 PM)</option>
                        <option value="evening">Evening (4:00 PM – 7:00 PM)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn orange w-full mt-2">
                      Schedule Tour
                    </button>
                  </form>
                </div>

                {/* Tenant Tips */}
                <div className="card p-6 bg-gradient-to-b from-[#1A0F42] to-[#0E0A20]">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-white">Tenant Tips</h4>
                  </div>
                  <p className="text-text-muted text-xs mb-4">
                    Before scheduling a visit, here&apos;s what you should know:
                  </p>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Carry 2 government ID proofs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Deposit is 2 months&apos; rent (refundable)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Minimum 11-month lease agreement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Brokerage: 1 month rent (one-time)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Similar Rentals */}
        <section className="sect gray">
          <div className="wrap">
            <div className="sect-head row">
              <div>
                <span className="pill"><span className="dot" />Similar Rentals</span>
                <h2 className="mt-4">You might also <span className="hl">like these</span></h2>
              </div>
              <Link href="/rentals" className="btn orange shrink-0">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="listings">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
