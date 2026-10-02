import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
}

const slugGradientClass: Record<string, string> = {
  'spacious-2bhk': 'p1',
  'cozy-studio': 'p2',
  'luxurious-3bhk': 'p3',
  'modern-2bhk': 'p4',
  'budget-friendly': 'p5',
  'premium-3bhk': 'p6',
  'newly-built': 'p7',
  'near-metro': 'p8',
  'heritage-3bhk': 'p9',
  'park-facing': 'p10',
  'compact-1bhk': 'p11',
  '3bhk-with-terrace': 'p12',
}

const fallbackClasses = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12']

export default function PropertyCard({ property }: PropertyCardProps) {
  let gradClass = ''
  for (const [key, val] of Object.entries(slugGradientClass)) {
    if (property.slug.includes(key)) {
      gradClass = val
      break
    }
  }

  if (!gradClass) {
    const idx = (property.id || '').charCodeAt(0) % fallbackClasses.length
    gradClass = fallbackClasses[idx]
  }

  const isPremium = property.slug.includes('heritage')
  const showBadge = property.featured || isPremium
  const badgeText = isPremium ? 'Premium' : 'Featured'

  return (
    <Link href={`/rentals/${property.slug}`} className="card property-card">
      {/* 4:3 Photo Area */}
      <div className={`photo ${gradClass}`}>
        <span className="tag rent">For Rent</span>
        {showBadge && (
          <span className={`tag ${isPremium ? 'premium' : 'featured'}`}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="property-card-body">
        {/* Price */}
        <div className="price mb-1">
          ₹{property.price.toLocaleString()} <small>/ month</small>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1">{property.title}</h3>

        {/* Location with pink pin icon */}
        <div className="card-location">
          <MapPin size={14} className="text-[#EC4899] shrink-0" />
          <span className="truncate">{property.location?.name || 'Kanpur'}</span>
        </div>

        {/* Facts & Tenant Tag Divider */}
        <div className="facts">
          <span>{property.bhk} BHK</span>
          <span>·</span>
          <span>{property.area_sqft.toLocaleString()} sqft</span>
          <span className="tt">{property.tenant_type}</span>
        </div>
      </div>
    </Link>
  )
}
