// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          role: 'ADMIN' | 'TENANT'
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
          role?: 'ADMIN' | 'TENANT'
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
          role?: 'ADMIN' | 'TENANT'
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
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          city: string
          description?: string | null
          image?: string | null
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
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          slug: string
          role: string
          description: string
          avatar: string | null
          phone: string
          email: string
          whatsapp: string | null
          experience_years: number
          deals_count: number
          rating: number
          years_active: number
          specializations: string[] | null
          areas: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          role: string
          description: string
          avatar?: string | null
          phone: string
          email: string
          whatsapp?: string | null
          experience_years: number
          deals_count: number
          rating: number
          years_active: number
          specializations?: string[] | null
          areas?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          role?: string
          description?: string
          avatar?: string | null
          phone?: string
          email?: string
          whatsapp?: string | null
          experience_years?: number
          deals_count?: number
          rating?: number
          years_active?: number
          specializations?: string[] | null
          areas?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          name: string
          phone: string
          message: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          name: string
          phone: string
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          name?: string
          phone?: string
          message?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
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
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          role: string
          location?: string | null
          quote: string
          avatar_initials: string
          rating?: number
          is_featured?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          location?: string | null
          quote?: string
          avatar_initials?: string
          rating?: number
          is_featured?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Frontend Types
export interface Property {
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
  status: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'INACTIVE'
  location_id: string | null
  address: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  available_from: string | null
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
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  slug: string
  role: string
  description: string
  avatar: string | null
  phone: string
  email: string
  whatsapp: string | null
  experience_years: number
  deals_count: number
  rating: number
  years_active: number
  specializations: string[] | null
  areas: string[] | null
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

export interface Inquiry {
  id: string
  property_id: string | null
  user_id: string | null
  name: string
  phone: string
  message: string | null
  preferred_date: string | null
  preferred_time: string | null
  status: 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'
  created_at: string
  updated_at: string
  property?: Property
}

export interface UserProfile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  role: 'ADMIN' | 'TENANT'
  is_active: boolean
  created_at: string
  updated_at: string
}
