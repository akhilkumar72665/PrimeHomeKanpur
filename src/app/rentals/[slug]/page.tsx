import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyDetailClient from '@/components/properties/PropertyDetailClient'
import LocalityHubClient, { LocalityInfo } from '@/components/properties/LocalityHubClient'
import { getPropertyBySlug, getProperties } from '@/lib/data/properties'
import { notFound } from 'next/navigation'

const KANPUR_LOCALITIES: Record<string, LocalityInfo> = {
  'kakadeo': {
    name: 'Kakadeo',
    slug: 'kakadeo',
    tagline: 'Kanpur’s Premier Educational & Coaching Epicenter',
    description: 'Kakadeo is renowned as the primary education, competitive exam coaching, and student accommodation hub of Kanpur. Featuring high rental demand from students, professors, and resident families, Kakadeo offers exceptional connectivity to Naveen Nagar, Sharda Nagar, and Geeta Nagar.',
    avgRent1BHK: '₹7,000 – ₹10,000',
    avgRent2BHK: '₹14,000 – ₹18,000',
    avgRent3BHK: '₹22,000 – ₹28,000',
    landmarks: ['Major Coaching Institutes (IIT-JEE / NEET)', 'Deoki Cinema & Market', 'Sharda Nagar Market', 'Rave Moti Mall (Nearby)'],
    connectivity: 'Well-connected via GT Road, auto-rickshaw hubs, and nearby Rawatpur railway station and metro line.',
    faqs: [
      {
        q: 'Are bachelor accommodations easily available in Kakadeo?',
        a: 'Yes, Kakadeo has the highest concentration of student hostels, bachelor flats, and independent 1BHK/2BHK rooms in Kanpur.',
      },
      {
        q: 'How does PrimeHomeKanpur verify properties in Kakadeo?',
        a: 'We conduct physical audits to verify drinking water availability, independent submeters, and landlord letting rules.',
      },
    ],
  },
  'swaroop-nagar': {
    name: 'Swaroop Nagar',
    slug: 'swaroop-nagar',
    tagline: 'Upscale Residential Neighborhood with Modern Cafes & Lake Views',
    description: 'Swaroop Nagar is widely considered one of Kanpur’s most desirable, upscale residential localities. Bordering Motijheel and GSVM Medical College, it offers premium builder floors, gated complexes, multi-cuisine restaurants, and top medical facilities.',
    avgRent1BHK: '₹12,000 – ₹16,000',
    avgRent2BHK: '₹22,000 – ₹28,000',
    avgRent3BHK: '₹35,000 – ₹55,000',
    landmarks: ['Motijheel Park & Lake', 'GSVM Medical College & Hallet Hospital', 'Famous Swaroop Nagar Food Street', 'Lala Lajpat Rai Hospital'],
    connectivity: 'Central Kanpur hub with direct wide-road access to Benajhabar, Civil Lines, and Kanpur Metro network.',
    faqs: [
      {
        q: 'What types of rentals are available in Swaroop Nagar?',
        a: 'Swaroop Nagar features luxury 2BHK and 3BHK builder floors, serviced apartments, and gated family flats.',
      },
    ],
  },
  'civil-lines': {
    name: 'Civil Lines',
    slug: 'civil-lines',
    tagline: 'Prestigious Administrative & Executive District',
    description: 'Civil Lines is Kanpur’s premier administrative and heritage residential zone. Lined with colonial bungalows, high-end apartments, green boulevards, and corporate offices, it provides an elite living environment.',
    avgRent1BHK: '₹14,000 – ₹18,000',
    avgRent2BHK: '₹25,000 – ₹32,000',
    avgRent3BHK: '₹40,000 – ₹65,000',
    landmarks: ['Green Park International Stadium', 'Kanpur Court Complex & VIP Road', 'Z Square Mall', 'Ganga Barrage Link'],
    connectivity: 'Prime location connecting central government offices, Kanpur Central railway station, and VIP Road corridor.',
    faqs: [
      {
        q: 'Is Civil Lines suitable for corporate and doctor families?',
        a: 'Yes, Civil Lines is preferred by corporate executives, doctors, and legal professionals due to its quiet, green atmosphere and 24/7 security.',
      },
    ],
  },
  'kalyanpur': {
    name: 'Kalyanpur',
    slug: 'kalyanpur',
    tagline: 'Academic Corridor Near IIT Kanpur & CSJM University',
    description: 'Kalyanpur is a fast-growing locality situated along the GT Road corridor. Home to CSJM Kanpur University and adjacent to IIT Kanpur, Kalyanpur offers modern gated residential societies and family apartments.',
    avgRent1BHK: '₹6,500 – ₹9,000',
    avgRent2BHK: '₹12,000 – ₹17,000',
    avgRent3BHK: '₹20,000 – ₹26,000',
    landmarks: ['IIT Kanpur Main Gate', 'CSJM Kanpur University Campus', 'Kalyanpur Metro Station', 'Panki Temple Road'],
    connectivity: 'Kanpur Metro Orange Line provides swift connectivity straight to Motijheel and Central Railway Station.',
    faqs: [
      {
        q: 'Does Kalyanpur have metro connectivity?',
        a: 'Yes, Kalyanpur is a major operational station on the Kanpur Metro Orange line.',
      },
    ],
  },
  'shyam-nagar': {
    name: 'Shyam Nagar',
    slug: 'shyam-nagar',
    tagline: 'Prominent South-Eastern Family Residential Hub',
    description: 'Shyam Nagar is one of South Kanpur’s most organized residential sectors, offering wide roads, peaceful gated blocks, top CBSE schools, and quick highway access.',
    avgRent1BHK: '₹7,000 – ₹9,500',
    avgRent2BHK: '₹13,000 – ₹17,500',
    avgRent3BHK: '₹20,000 – ₹26,000',
    landmarks: ['Chakeri Airport Road', 'GT Road Link', 'Pacemaker Hospital', 'Railway Overbridge'],
    connectivity: 'Directly linked to GT Road, Ring Road, and Chakeri Civil Airport.',
    faqs: [
      {
        q: 'Is Shyam Nagar good for family living?',
        a: 'Yes, Shyam Nagar has extensive parks, reputable schools, daily markets, and wide residential lanes.',
      },
    ],
  },
  'kidwai-nagar': {
    name: 'Kidwai Nagar',
    slug: 'kidwai-nagar',
    tagline: 'Vibrant South Kanpur Market & Residential Hub',
    description: 'Kidwai Nagar offers vibrant shopping markets, multi-specialty hospitals, and spacious residential builder floors with great public transport.',
    avgRent1BHK: '₹6,500 – ₹9,000',
    avgRent2BHK: '₹12,500 – ₹16,500',
    avgRent3BHK: '₹18,000 – ₹25,000',
    landmarks: ['Kidwai Nagar Market', 'Deep Cinema Crossing', 'Gaushala Chauraha', 'Saket Nagar Link'],
    connectivity: 'Central node for South Kanpur connecting Barra, Govind Nagar, and Yashoda Nagar.',
    faqs: [
      {
        q: 'What is the average security deposit in Kidwai Nagar?',
        a: 'Typically 1 to 2 months rent as security deposit, verified transparently by PrimeHomeKanpur.',
      },
    ],
  },
  'tilak-nagar': {
    name: 'Tilak Nagar',
    slug: 'tilak-nagar',
    tagline: 'Peaceful Central Residential Colony',
    description: 'Tilak Nagar is an established, quiet residential colony in Central Kanpur characterized by independent family houses, green avenues, and close proximity to Arya Nagar.',
    avgRent1BHK: '₹10,000 – ₹14,000',
    avgRent2BHK: '₹18,000 – ₹24,000',
    avgRent3BHK: '₹28,000 – ₹40,000',
    landmarks: ['Brijendra Swaroop Park', 'Top Convent Schools', 'Arya Nagar Crossing'],
    connectivity: 'Walkable distance to Swaroop Nagar, Motijheel, and Benajhabar.',
    faqs: [
      {
        q: 'Are independent floors available in Tilak Nagar?',
        a: 'Yes, Tilak Nagar features spacious independent builder floors with dedicated parking.',
      },
    ],
  },
  'gurudev-chauraha': {
    name: 'Gurudev Chauraha',
    slug: 'gurudev-chauraha',
    tagline: 'Central Transit Hub & Vibrant Residential Area',
    description: 'Gurudev Chauraha is a strategic central intersection connecting GT Road, Kakadeo, and Vikas Nagar. Highly preferred by both working professionals and families.',
    avgRent1BHK: '₹8,000 – ₹11,000',
    avgRent2BHK: '₹15,000 – ₹20,000',
    avgRent3BHK: '₹24,000 – ₹30,000',
    landmarks: ['Gurudev Cinema Crossing', 'GT Road Flyover', 'Lakhanpur Hospital Belt'],
    connectivity: 'Continuous 24/7 public transport, buses, e-rickshaws, and Kanpur metro accessibility.',
    faqs: [
      {
        q: 'How fast can I book a visit in Gurudev Chauraha?',
        a: 'Our field agents operate directly around Gurudev Chauraha and can facilitate assisted walkthroughs within 2 hours.',
      },
    ],
  },
  'barra': {
    name: 'Barra',
    slug: 'barra',
    tagline: 'Affordable, Well-Connected Residential Suburb',
    description: 'Barra is an expansive, budget-friendly residential area in South Kanpur with multiple numbered sectors (Barra 1 to 8), thriving local markets, and family flats.',
    avgRent1BHK: '₹5,000 – ₹7,500',
    avgRent2BHK: '₹9,000 – ₹13,500',
    avgRent3BHK: '₹15,000 – ₹20,000',
    landmarks: ['Barra Bypass', 'Meharban Singh Ka Purwa Road', 'Sachan Guest House Crossing'],
    connectivity: 'Connected directly to NH-19 Highway, Govind Nagar, and Kidwai Nagar.',
    faqs: [
      {
        q: 'Is Barra suitable for budget-conscious families?',
        a: 'Yes, Barra offers the most affordable verified 2BHK and 3BHK rental rates in Kanpur.',
      },
    ],
  },
  'awas-vikas': {
    name: 'Awas Vikas',
    slug: 'awas-vikas',
    tagline: 'Planned Residential Colony with Broad Roads & Parks',
    description: 'Awas Vikas sectors (including Awas Vikas 1, 2, and 3 in Kalyanpur/Hanspur) feature planned layouts, independent residential plots, and community amenities.',
    avgRent1BHK: '₹6,000 – ₹8,500',
    avgRent2BHK: '₹11,000 – ₹15,000',
    avgRent3BHK: '₹18,000 – ₹24,000',
    landmarks: ['Awas Vikas Community Park', 'Kalyanpur Road Link', 'Panki Industrial Link'],
    connectivity: 'Direct road access to Kalyanpur, IIT Kanpur, and Panki.',
    faqs: [
      {
        q: 'Are independent houses available for rent in Awas Vikas?',
        a: 'Yes, Awas Vikas is well-known for independent ground/first floor family residences.',
      },
    ],
  },
  'govind-nagar': {
    name: 'Govind Nagar',
    slug: 'govind-nagar',
    tagline: 'Established Commercial & Residential Neighborhood',
    description: 'Govind Nagar is an established South Kanpur locality known for Govindpuri Junction, bustling commercial bazaars, and family apartments.',
    avgRent1BHK: '₹6,000 – ₹8,500',
    avgRent2BHK: '₹11,000 – ₹15,500',
    avgRent3BHK: '₹17,000 – ₹23,000',
    landmarks: ['Govindpuri Railway Junction', 'Govind Nagar Market', 'Nandlal Chauraha'],
    connectivity: 'Railway junction connectivity and easy access to Fazalganj industrial area.',
    faqs: [
      {
        q: 'How close is Govind Nagar to commercial employment hubs?',
        a: 'Govind Nagar is just 5-10 minutes from Fazalganj and Dada Nagar commercial zones.',
      },
    ],
  },
  'vijay-nagar': {
    name: 'Vijay Nagar',
    slug: 'vijay-nagar',
    tagline: 'Prime Commercial & Arterial Connectivity Center',
    description: 'Vijay Nagar is situated at a key arterial intersection connecting Shastri Nagar, Kakadeo, and Dada Nagar with wide multi-lane roads.',
    avgRent1BHK: '₹7,500 – ₹10,000',
    avgRent2BHK: '₹13,500 – ₹18,000',
    avgRent3BHK: '₹22,000 – ₹28,000',
    landmarks: ['Vijay Nagar Chauraha', 'Double Road Market', 'Dada Nagar Flyover Link'],
    connectivity: 'Direct arterial transit between North and South Kanpur.',
    faqs: [
      {
        q: 'Are apartments available for working professionals in Vijay Nagar?',
        a: 'Yes, Vijay Nagar has high availability of semi-furnished and fully furnished 2BHK flats.',
      },
    ],
  },
  'vikas-nagar': {
    name: 'Vikas Nagar',
    slug: 'vikas-nagar',
    tagline: 'Quiet Residential Enclave near Lakhanpur',
    description: 'Vikas Nagar offers a tranquil residential setting with parks, local clinics, and close proximity to Gurudev Chauraha and Rawatpur.',
    avgRent1BHK: '₹7,000 – ₹9,500',
    avgRent2BHK: '₹13,000 – ₹17,000',
    avgRent3BHK: '₹20,000 – ₹26,000',
    landmarks: ['Vikas Nagar Park', 'Lakhanpur Road', 'KESCO Power House'],
    connectivity: 'Minutes from GT Road and Rawatpur railway station.',
    faqs: [
      {
        q: 'Are pets allowed in Vikas Nagar rentals?',
        a: 'Many independent builder floors in Vikas Nagar welcome pets, verified on each listing.',
      },
    ],
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.toLowerCase()

  // 1. Check if Locality Hub
  if (KANPUR_LOCALITIES[slug]) {
    const loc = KANPUR_LOCALITIES[slug]
    return {
      title: `Rental Properties in ${loc.name}, Kanpur | Verified Flats & Houses`,
      description: `Find 100% physically verified rental flats, independent houses, and builder floors in ${loc.name}, Kanpur. 15-day brokerage, ₹300 assisted tours.`,
      alternates: {
        canonical: `/rentals/${slug}`,
      },
      openGraph: {
        title: `Rental Properties in ${loc.name}, Kanpur | PrimeHomeKanpur`,
        description: `Explore verified rental homes in ${loc.name}, Kanpur. Physical walkthroughs and transparent pricing.`,
      },
    }
  }

  // 2. Check if Property Detail
  const property = await getPropertyBySlug(slug)
  if (property) {
    return {
      title: `${property.title} in ${property.address || property.location?.name || 'Kanpur'} | PrimeHomeKanpur`,
      description: `${property.bhk} BHK ${property.property_type} for rent in ${property.address || 'Kanpur'} at ₹${property.price.toLocaleString()}/month. 100% physically verified.`,
      alternates: {
        canonical: `/rentals/${slug}`,
      },
      openGraph: {
        title: `${property.title} | PrimeHomeKanpur`,
        description: `₹${property.price.toLocaleString()}/mo · ${property.bhk} BHK in ${property.address || 'Kanpur'}. Book ₹300 assisted tour.`,
      },
    }
  }

  return {
    title: 'Rental Listing | PrimeHomeKanpur',
    description: 'Explore verified rental listings in Kanpur.',
  }
}

export default async function RentalSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.toLowerCase()

  // 1. If matches Kanpur Locality Hub
  if (KANPUR_LOCALITIES[slug]) {
    const locality = KANPUR_LOCALITIES[slug]
    const allProperties = await getProperties()
    const localityProperties = allProperties.filter(
      (p) =>
        p.location?.slug === slug ||
        p.location?.name.toLowerCase() === locality.name.toLowerCase() ||
        p.address.toLowerCase().includes(locality.name.toLowerCase())
    )

    // JSON-LD LocalBusiness & RealEstateListing Structured Data
    const localityJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: `PrimeHomeKanpur - ${locality.name} Rentals`,
      description: locality.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality.name,
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
      areaServed: locality.name,
    }

    return (
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localityJsonLd) }}
        />
        <Header />
        <main className="flex-1">
          <LocalityHubClient
            locality={locality}
            properties={localityProperties.length > 0 ? localityProperties : allProperties.slice(0, 3)}
          />
        </main>
        <Footer />
      </div>
    )
  }

  // 2. If matches Property Detail Slug
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  const allProperties = await getProperties()
  const similarProperties = allProperties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 3)

  // Property JSON-LD Structured Data
  const propertyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: property.title,
    description: property.description,
    price: property.price,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    itemOffered: {
      '@type': 'Accommodation',
      name: property.title,
      numberOfBedrooms: property.bhk,
      numberOfBathroomsTotal: property.bathrooms || 1,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.area_sqft,
        unitCode: 'FTK',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address,
        addressLocality: 'Kanpur',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <PropertyDetailClient
          property={property}
          similarProperties={similarProperties}
        />
      </main>
      <Footer />
    </div>
  )
}
