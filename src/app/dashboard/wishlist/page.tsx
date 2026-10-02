'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Property, WishlistItem } from '@/types'
import { mockProperties } from '@/lib/data/mockData'
import PropertyCard from '@/components/cards/PropertyCard'
import { Heart, Trash2, Calendar, ArrowRight, Building } from 'lucide-react'

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadWishlist = async () => {
    if (!user?.id) return
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          property_id,
          property:properties(
            *,
            location:locations(*),
            images:property_images(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const props = data
          .map((item: any) => item.property)
          .filter(Boolean) as Property[]
        setWishlistProperties(props)
      } else {
        setWishlistProperties([])
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err)
      setWishlistProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [user?.id])

  const handleFavoriteToggle = (propertyId: string, isFav: boolean) => {
    if (!isFav) {
      setWishlistProperties((prev) => prev.filter((p) => p.id !== propertyId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart size={20} className="text-rose-400 fill-current" /> My Saved Wishlist
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Properties you have marked for quick access and tour scheduling
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white">
          {wishlistProperties.length} {wishlistProperties.length === 1 ? 'Home' : 'Homes'}
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading your wishlist...</p>
        </div>
      ) : wishlistProperties.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Heart size={30} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No saved properties yet</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
            Click the heart icon on any rental card while browsing to save properties here for easy comparison and booking.
          </p>
          <Link
            href="/rentals"
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-900/30"
          >
            Explore Verified Rentals <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              initialIsFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
