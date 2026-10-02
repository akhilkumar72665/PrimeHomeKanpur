import Link from 'next/link'
import { MapPin } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
}

const propertyGradients: Record<string, string> = {
  'spacious-2bhk': 'bg-gradient-to-br from-[#0F766E] to-[#00C2D9]',
  'cozy-studio': 'bg-gradient-to-br from-[#7F1D1D] to-[#EF4444]',
  'luxurious-3bhk': 'bg-gradient-to-br from-[#1F2937] to-[#6B7280]',
  'modern-2bhk': 'bg-gradient-to-br from-[#0891B2] to-[#22D3EE]',
  'budget-friendly': 'bg-gradient-to-br from-[#9F3A3A] to-[#F87171]',
  'premium-3bhk': 'bg-gradient-to-br from-[#134E4A] to-[#2DD4BF]',
  'newly-built': 'bg-gradient-to-br from-[#4C1D95] to-[#7C3AED]',
  'near-metro': 'bg-gradient-to-br from-[#5B21B6] to-[#8B5CF6]',
  'heritage-3bhk': 'bg-gradient-to-br from-[#831843] to-[#EC4899]',
  'park-facing': 'bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]',
  'compact-1bhk': 'bg-gradient-to-br from-[#166534] to-[#22C55E]',
  '3bhk-with-terrace': 'bg-gradient-to-br from-[#92400E] to-[#EAB308]',
}

const fallbackGradients = [
  'bg-gradient-to-br from-[#0F766E] to-[#00C2D9]',
  'bg-gradient-to-br from-[#7F1D1D] to-[#EF4444]',
  'bg-gradient-to-br from-[#1F2937] to-[#6B7280]',
  'bg-gradient-to-br from-[#0891B2] to-[#22D3EE]',
  'bg-gradient-to-br from-[#9F3A3A] to-[#F87171]',
  'bg-gradient-to-br from-[#134E4A] to-[#2DD4BF]',
]

export default function PropertyCard({ property }: PropertyCardProps) {
  let gradient = ''
  for (const [key, val] of Object.entries(propertyGradients)) {
    if (property.slug.includes(key)) {
      gradient = val
      break
    }
  }
  if (!gradient) {
    const idx = (property.id || '').charCodeAt(0) % fallbackGradients.length
    gradient = fallbackGradients[idx]
  }

  const isPremium = property.slug.includes('heritage')
  const showBadge = property.featured || isPremium

  return (
    <Link href={`/rentals/${property.slug}`} className="property-card group block h-full">
      <div className="h-full flex flex-col">
        {/* Image Area */}
        <div className={`card-media relative aspect-[4/3] ${gradient} grid-pattern`}>
          {/* For Rent Badge */}
          <Badge variant="rent" className="absolute top-4 left-4">
            For Rent
          </Badge>

          {/* Featured/Premium Badge */}
          {showBadge && (
            <Badge variant="featured" className="absolute top-4 right-4">
              {isPremium ? 'Premium' : 'Featured'}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-white">
              ₹{property.price.toLocaleString()}
            </span>
            <span className="text-text-muted text-sm">/month</span>
          </div>

          {/* Title & Location */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
            <MapPin className="w-4 h-4 text-accent-pink flex-shrink-0" />
            <span className="truncate">
              {property.location?.name || 'Kanpur'}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-text-muted text-sm">
              <span>{property.bhk} BHK</span>
              <span>·</span>
              <span>{property.area_sqft.toLocaleString()} sqft</span>
            </div>

            <Badge variant="default" className="text-xs">
              {property.tenant_type}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
