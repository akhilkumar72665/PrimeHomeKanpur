import { TeamRole } from '@/lib/permissions'

export interface Profile {
  id: string
  email?: string | null
  full_name?: string | null
  phone?: string | null
  role: 'ADMIN' | 'TENANT'
  avatar_url?: string | null
  created_at: string
  updated_at?: string
}

export interface TeamMember {
  id: string
  user_id: string | null
  email: string
  name: string | null
  phone: string | null
  photo_url: string | null
  designation: string | null
  team_role: TeamRole
  is_active: boolean
  invited_at: string
  created_at: string
  updated_at: string
}

export interface LocationItem {
  id: string
  name: string
  city: string
  slug: string
  description?: string | null
  image?: string | null
  is_active: boolean
  sort_order: number
  properties_count?: number
  created_at: string
  updated_at?: string
}

export interface AdminProperty {
  id: string
  slug: string
  title: string
  description: string
  price: number
  security_deposit: number | null
  maintenance: number | null
  property_type: string
  bhk: number
  bathrooms: number | null
  area_sqft: number
  floor: number | null
  total_floors: number | null
  tenant_type: 'Family' | 'Bachelor' | 'Professional' | 'Any'
  furnishing: string | null
  status: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE' | 'HIDDEN'
  location_id: string | null
  location?: LocationItem | null
  address: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  available_from: string | null
  amenities: string[]
  images: string[]
  video_url: string | null
  agent_id: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  photo_url?: string | null
  bio?: string | null
  is_active: boolean
  created_at: string
}

export type AdminAgent = Agent

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'

export interface Inquiry {
  id: string
  property_id?: string | null
  property?: { id: string; title: string; slug: string } | null
  name: string
  email?: string | null
  phone?: string | null
  message?: string | null
  status: InquiryStatus
  created_at: string
}

export type AdminInquiry = Inquiry

export interface AdminReview {
  id: string
  property_id: string
  property?: { id: string; title: string; slug: string } | null
  user_id: string
  reviewer_name: string | null
  rating: number
  comment: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  moderation_note: string | null
  moderated_by: string | null
  moderated_at: string | null
  created_at: string
  updated_at: string
}

export interface RentalsPageSettings {
  title: string
  subtitle: string
  bannerImage: string | null
  filters: {
    location: boolean
    type: boolean
    rent: boolean
    bedrooms: boolean
    furnishing: boolean
    search: boolean
  }
  listing: {
    sort: 'newest' | 'price-asc' | 'price-desc' | 'featured'
    perPage: number
    layout: 'grid' | 'list'
    showRented: boolean
    showRatings: boolean
  }
  featured: {
    enabled: boolean
    title: string
    max: number
  }
  seo: {
    title: string
    description: string
  }
}

export interface ActivityLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  entity: string
  entity_id: string | null
  summary: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export type ActivityLogItem = ActivityLog
