// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'property_manager'
  | 'listing_manager'
  | 'review_manager'
  | 'user'
  | 'ADMIN'
  | 'TENANT'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          role: UserRole
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          price: number
          security_deposit: number | null
          maintenance: number | null
          property_type: string
          listing_type: string
          bhk: number
          bathrooms: number | null
          area_sqft: number
          floor: number | null
          total_floors: number | null
          tenant_type: 'Family' | 'Bachelor' | 'Professional' | 'Any'
          furnishing: string | null
          status: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE'
          location_id: string | null
          address: string
          latitude: number | null
          longitude: number | null
          featured: boolean
          available_from: string | null
          video_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          price: number
          security_deposit?: number | null
          maintenance?: number | null
          property_type: string
          listing_type?: string
          bhk: number
          bathrooms?: number | null
          area_sqft: number
          floor?: number | null
          total_floors?: number | null
          tenant_type?: 'Family' | 'Bachelor' | 'Professional' | 'Any'
          furnishing?: string | null
          status?: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE'
          location_id?: string | null
          address: string
          latitude?: number | null
          longitude?: number | null
          featured?: boolean
          available_from?: string | null
          video_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          price?: number
          security_deposit?: number | null
          maintenance?: number | null
          property_type?: string
          listing_type?: string
          bhk?: number
          bathrooms?: number | null
          area_sqft?: number
          floor?: number | null
          total_floors?: number | null
          tenant_type?: 'Family' | 'Bachelor' | 'Professional' | 'Any'
          furnishing?: string | null
          status?: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE'
          location_id?: string | null
          address?: string
          latitude?: number | null
          longitude?: number | null
          featured?: boolean
          available_from?: string | null
          video_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          city: string
          description: string | null
          image: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          city?: string
          description?: string | null
          image?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          city?: string
          description?: string | null
          image?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      property_visits: {
        Row: {
          id: string
          user_id: string
          property_id: string
          preferred_date: string
          preferred_time: string
          message: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          admin_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          preferred_date: string
          preferred_time: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          admin_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          preferred_date?: string
          preferred_time?: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          admin_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          rating: number
          title: string | null
          comment: string
          status: 'pending' | 'approved' | 'rejected'
          admin_note: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          rating: number
          title?: string | null
          comment: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_note?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          rating?: number
          title?: string | null
          comment?: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_note?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          slug: string
          profile_photo: string | null
          designation: string
          phone: string
          email: string
          whatsapp: string | null
          bio: string | null
          role: string
          permissions: string[] | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          profile_photo?: string | null
          designation: string
          phone: string
          email: string
          whatsapp?: string | null
          bio?: string | null
          role?: string
          permissions?: string[] | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          profile_photo?: string | null
          designation?: string
          phone?: string
          email?: string
          whatsapp?: string | null
          bio?: string | null
          role?: string
          permissions?: string[] | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          user_id: string | null
          property_id: string | null
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'read' | 'contacted' | 'archived'
          consent_given: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'read' | 'contacted' | 'archived'
          consent_given?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'read' | 'contacted' | 'archived'
          consent_given?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_statistics: {
        Row: {
          id: string
          stat_key: string
          label: string
          value_number: number
          value_suffix: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stat_key: string
          label: string
          value_number: number
          value_suffix?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stat_key?: string
          label?: string
          value_number?: number
          value_suffix?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          actor_id: string | null
          actor_email: string | null
          action: string
          entity: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          actor_email?: string | null
          action: string
          entity: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          actor_email?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

// Frontend Model Types
export interface Property {
  id: string
  slug: string
  title: string
  description: string
  price: number
  security_deposit: number | null
  maintenance: number | null
  property_type: string
  listing_type?: string
  bhk: number
  bathrooms: number | null
  area_sqft: number
  floor?: number | null
  total_floors?: number | null
  tenant_type: 'Family' | 'Bachelor' | 'Professional' | 'Any'
  furnishing: string | null
  status: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE'
  location_id: string | null
  address: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  available_from: string | null
  video_url?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
  location?: Location
  images?: PropertyImage[]
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Location {
  id: string
  name: string
  slug: string
  city: string
  description: string | null
  image: string | null
  display_order?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  profile_photo: string | null
  avatar?: string | null
  designation: string
  role: string
  phone: string
  email: string
  whatsapp: string | null
  bio: string | null
  description?: string | null
  permissions?: string[] | null
  display_order: number
  is_active: boolean
  deals_count?: number
  rating?: number
  experience_years?: number
  years_active?: number
  created_at: string
  updated_at: string
}

export type Agent = TeamMember

export interface PropertyVisit {
  id: string
  user_id: string
  property_id: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  admin_note: string | null
  created_at: string
  updated_at: string
  property?: Property
  user_profile?: UserProfile
}

export interface Review {
  id: string
  user_id: string
  property_id: string | null
  rating: number
  title: string | null
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
  property?: Property
  user_profile?: UserProfile
}

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string | null
  quote: string
  avatar_initials: string
  rating: number
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  user_id: string | null
  property_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  status: 'new' | 'read' | 'contacted' | 'archived'
  consent_given: boolean
  created_at: string
  updated_at: string
  property?: Property
}

export interface SiteStatistic {
  id: string
  stat_key: string
  label: string
  value_number: number
  value_suffix: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  entity: string
  entity_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface UserProfile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  property_id: string
  created_at: string
  property?: Property
}
