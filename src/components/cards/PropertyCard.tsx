'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Heart } from 'lucide-react'
import { Property } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface PropertyCardProps {
  property: Property
  initialIsFavorite?: boolean
  onFavoriteToggle?: (propertyId: string, isFav: boolean) => void
}

const slugGradientClass: Record<string, string> = {
  'spacious-2bhk': 'p1',
  'cozy-studio': 'p2',
  'luxurious-3bhk': 'p3',
  'modern-2bhk': 'p4',
  'modern-1bhk': 'p4',
  'budget-friendly': 'p5',
  'independent-house': 'p5',
  'premium-3bhk': 'p6',
  'affordable-1bhk': 'p7',
  'compact-2bhk': 'p8',
  'executive-4bhk': 'p9',
  'well-lit-2bhk': 'p10',
  'family-ready': 'p11',
  '3bhk-with-terrace': 'p12',
}

const fallbackClasses = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12']

export default function PropertyCard({ property, initialIsFavorite = false, onFavoriteToggle }: PropertyCardProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isToggling, setIsToggling] = useState(false)
  const supabase = createClient()

  // Check if property is in user's wishlist when authenticated
  useEffect(() => {
    let isMounted = true
    if (isAuthenticated && user?.id && !initialIsFavorite) {
      supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .maybeSingle()
        .then(({ data }) => {
          if (isMounted && data) {
            setIsFavorite(true)
          }
        })
    }
    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user?.id, property.id, initialIsFavorite, supabase])

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      openAuthModal('Please sign in to save properties to your wishlist.')
      return
    }

    if (isToggling) return
    setIsToggling(true)

    const nextState = !isFavorite
    setIsFavorite(nextState)

    try {
      if (nextState) {
        // Add to wishlist (upsert / conflict-safe)
        await supabase
          .from('wishlists')
          .insert({
            user_id: user!.id,
            property_id: property.id,
          })
      } else {
        // Remove from wishlist
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user!.id)
          .eq('property_id', property.id)
      }

      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, nextState)
      }
    } catch (err) {
      // Revert on failure
      setIsFavorite(!nextState)
    } finally {
      setIsToggling(false)
    }
  }

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

  const isPremium = property.slug.includes('executive') || property.slug.includes('luxurious') || property.price >= 25000
  const showBadge = property.featured || isPremium
  const badgeText = isPremium ? 'Premium' : 'Featured'
  const primaryImg = property.images?.find((img) => img.is_primary)?.image_url || property.images?.[0]?.image_url

  return (
    <Link href={`/rentals/${property.slug}`} className="card property-card group block relative w-full overflow-hidden">
      {/* 4:3 Photo Area with fixed aspect ratio */}
      <div className={`photo ${gradClass} relative overflow-hidden aspect-[4/3] w-full bg-[#140B36]`}>
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={property.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-semibold">
            PrimeHome Kanpur
          </div>
        )}

        {/* Badges Stack on Top-Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap max-w-[calc(100%-54px)] pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#FFE4E6] text-[#E11D48] shadow-sm">
            For Rent
          </span>
          {showBadge && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm ${
              isPremium
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white'
                : 'bg-[#00C2D9] text-[#04121a]'
            }`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Wishlist Button Top-Right (44x44px touch target) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2 right-2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 active:scale-95 ${
            isFavorite
              ? 'bg-rose-500/95 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105'
              : 'bg-black/60 border-white/20 text-white hover:bg-black/90 hover:border-white/40'
          }`}
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="property-card-body p-4">
        {/* Price */}
        <div className="price mb-1 text-lg sm:text-xl font-bold text-white">
          ₹{property.price.toLocaleString()} <small className="text-xs text-text-muted font-normal">/ month</small>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location with pin icon */}
        <div className="card-location flex items-center gap-1.5 text-xs text-text-secondary mt-1.5">
          <MapPin size={13} className="text-[#EC4899] shrink-0" />
          <span className="truncate">{property.location?.name || property.address || 'Kanpur'}</span>
        </div>

        {/* Facts & Tenant Tag Divider */}
        <div className="facts flex items-center justify-between text-xs text-text-muted mt-3 pt-2.5 border-t border-white/10">
          <span className="font-semibold text-text-secondary">{property.bhk} BHK • {property.area_sqft.toLocaleString()} sqft</span>
          <span className="tt px-2 py-0.5 rounded bg-white/10 text-white font-medium text-[11px]">{property.tenant_type}</span>
        </div>
      </div>
    </Link>
  )
}
