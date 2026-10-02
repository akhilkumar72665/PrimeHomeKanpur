import { createClient } from '@/lib/supabase/server'
import { Property } from '@/types'
import { mockProperties } from '@/lib/data/mockData'

export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(*),
        images:property_images(*)
      `)
      .eq('status', 'AVAILABLE')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      // Fallback to mock data when Supabase is empty or unavailable
      const featured = mockProperties.filter(p => p.featured)
      const rest = mockProperties.filter(p => !p.featured)
      return [...featured, ...rest].slice(0, limit)
    }

    return data
  } catch {
    // Fallback to mock data on any error
    const featured = mockProperties.filter(p => p.featured)
    const rest = mockProperties.filter(p => !p.featured)
    return [...featured, ...rest].slice(0, limit)
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(*),
        images:property_images(*)
      `)
      .eq('slug', slug)
      .eq('status', 'AVAILABLE')
      .single()

    if (error || !data) {
      // Fallback to mock data
      return mockProperties.find(p => p.slug === slug || p.slug.startsWith(slug) || slug.startsWith(p.slug)) || null
    }

    return data
  } catch {
    return mockProperties.find(p => p.slug === slug || p.slug.startsWith(slug) || slug.startsWith(p.slug)) || null
  }
}

export async function getProperties(filters?: {
  location?: string
  bhk?: string
  priceRange?: string
  tenantType?: string
}): Promise<Property[]> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('properties')
      .select(`
        *,
        location:locations(*),
        images:property_images(*)
      `)
      .eq('status', 'AVAILABLE')

    if (filters?.location) {
      query = query.eq('location_id', filters.location)
    }

    if (filters?.bhk) {
      query = query.eq('bhk', parseInt(filters.bhk))
    }

    if (filters?.tenantType && filters.tenantType !== 'Any') {
      query = query.eq('tenant_type', filters.tenantType)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      // Fallback to mock data with client-side filtering
      let result = [...mockProperties]
      if (filters?.bhk) result = result.filter(p => p.bhk === parseInt(filters.bhk!))
      if (filters?.tenantType && filters.tenantType !== 'Any') {
        result = result.filter(p => p.tenant_type === filters.tenantType)
      }
      return result
    }

    return data
  } catch {
    return mockProperties
  }
}
