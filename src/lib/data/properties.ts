import { createClient } from '@/lib/supabase/server'
import { Property, PropertyImage } from '@/types'
import { mockProperties } from '@/lib/data/mockData'

function normalizePropertyImages(p: any): Property {
  let images: PropertyImage[] = []

  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images.map((im: any, idx: number) => {
      if (typeof im === 'string') {
        return {
          id: `img-${p.id || 'prop'}-${idx}`,
          property_id: p.id || '',
          image_url: im,
          is_primary: idx === 0,
          sort_order: idx,
          created_at: p.created_at || new Date().toISOString(),
        }
      }
      return {
        id: im.id || `img-${idx}`,
        property_id: im.property_id || p.id || '',
        image_url: im.image_url || im.url || '',
        is_primary: im.is_primary ?? idx === 0,
        sort_order: im.sort_order ?? idx,
        created_at: im.created_at || new Date().toISOString(),
      }
    })
  } else if (Array.isArray(p.property_images) && p.property_images.length > 0) {
    images = p.property_images.map((im: any, idx: number) => ({
      id: im.id || `img-${idx}`,
      property_id: im.property_id || p.id || '',
      image_url: im.image_url || im.url || '',
      is_primary: im.is_primary ?? idx === 0,
      sort_order: im.sort_order ?? idx,
      created_at: im.created_at || new Date().toISOString(),
    }))
  }

  return {
    ...p,
    images,
  }
}

export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(*)
      `)
      .in('status', ['AVAILABLE', 'RESERVED', 'RENTED'])
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      const featured = mockProperties.filter((p) => p.featured)
      const rest = mockProperties.filter((p) => !p.featured)
      return [...featured, ...rest].slice(0, limit).map(normalizePropertyImages)
    }

    return data.map(normalizePropertyImages)
  } catch {
    const featured = mockProperties.filter((p) => p.featured)
    const rest = mockProperties.filter((p) => !p.featured)
    return [...featured, ...rest].slice(0, limit).map(normalizePropertyImages)
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(*)
      `)
      .eq('slug', slug)
      .maybeSingle()

    if (error || !data) {
      const found =
        mockProperties.find(
          (p) => p.slug === slug || p.slug.startsWith(slug) || slug.startsWith(p.slug)
        ) || null
      return found ? normalizePropertyImages(found) : null
    }

    return normalizePropertyImages(data)
  } catch {
    const found =
      mockProperties.find(
        (p) => p.slug === slug || p.slug.startsWith(slug) || slug.startsWith(p.slug)
      ) || null
    return found ? normalizePropertyImages(found) : null
  }
}

export async function getProperties(filters?: {
  location?: string
  bhk?: string
  priceRange?: string
  tenantType?: string
  propertyType?: string
  status?: string
}): Promise<Property[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('properties')
      .select(`
        *,
        location:locations(*)
      `)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    } else {
      query = query.in('status', ['AVAILABLE', 'RESERVED', 'RENTED'])
    }

    if (filters?.location) {
      query = query.or(`location_id.eq.${filters.location},address.ilike.%${filters.location}%`)
    }

    if (filters?.bhk) {
      const bhkNum = parseInt(filters.bhk, 10)
      if (!isNaN(bhkNum)) {
        query = query.eq('bhk', bhkNum)
      }
    }

    if (filters?.tenantType && filters.tenantType !== 'Any') {
      query = query.eq('tenant_type', filters.tenantType)
    }

    if (filters?.propertyType && filters.propertyType !== 'All') {
      query = query.ilike('property_type', `%${filters.propertyType}%`)
    }

    if (filters?.priceRange) {
      const [minStr, maxStr] = filters.priceRange.split('-')
      if (minStr) {
        const min = parseInt(minStr, 10)
        if (!isNaN(min)) query = query.gte('price', min)
      }
      if (maxStr) {
        const max = parseInt(maxStr, 10)
        if (!isNaN(max)) query = query.lte('price', max)
      }
    }

    const { data, error } = await query.order('featured', { ascending: false }).order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      let result = [...mockProperties]
      if (filters?.bhk) result = result.filter((p) => p.bhk === parseInt(filters.bhk!))
      if (filters?.tenantType && filters.tenantType !== 'Any') {
        result = result.filter((p) => p.tenant_type === filters.tenantType)
      }
      if (filters?.propertyType && filters.propertyType !== 'All') {
        result = result.filter((p) => p.property_type.toLowerCase().includes(filters.propertyType!.toLowerCase()))
      }
      return result.map(normalizePropertyImages)
    }

    return data.map(normalizePropertyImages)
  } catch {
    return mockProperties.map(normalizePropertyImages)
  }
}
