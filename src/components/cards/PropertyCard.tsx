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
    <Link href={`/rentals/${property.slug}`} className="card property-card group block relative">
      {/* 4:3 Photo Area */}
      <div className={`photo ${gradClass} relative overflow-hidden`}>
        {primaryImg && (
          <img
            src={primaryImg}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* Badges Stack on Top-Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap max-w-[calc(100%-48px)] pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFE4E6] text-[#E11D48] shadow-sm">
            For Rent
          </span>
          {showBadge && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${
              isPremium
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white'
                : 'bg-[#00C2D9] text-[#04121a]'
            }`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Wishlist Button Top-Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isFavorite
              ? 'bg-rose-500/95 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105'
              : 'bg-black/50 border-white/20 text-white hover:bg-black/80 hover:scale-110 hover:border-white/40'
          }`}
        >
          <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="property-card-body">
        {/* Price */}
        <div className="price mb-1">
          ₹{property.price.toLocaleString()} <small>/ month</small>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>

        {/* Location with pin icon */}
        <div className="card-location">
          <MapPin size={14} className="text-[#EC4899] shrink-0" />
          <span className="truncate">{property.location?.name || property.address || 'Kanpur'}</span>
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
