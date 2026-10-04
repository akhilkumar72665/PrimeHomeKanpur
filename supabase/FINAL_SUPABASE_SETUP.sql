-- ==============================================================================
-- PRIMEHOME KANPUR: FINAL UNIFIED SUPABASE SETUP SCRIPT
-- ==============================================================================
-- Includes:
-- 1. Extensions & Custom Types
-- 2. Complete Database Schema (Tables, Foreign Keys, Indexes, Constraints)
-- 3. Automatic Authentication & Profile Creation Triggers
-- 4. Storage Buckets (Images, Videos, Avatars, Documents) & Storage RLS Policies
-- 5. Row Level Security (RLS) Policies for Public, Tenant, and Admin Access
-- 6. Role-Based Access Control (RBAC) Functions (is_admin, claim_team_access, has_permission)
-- 7. Production Seed Data (Kanpur Locations, Properties, Agents, Team, Stats, FAQs)
--
-- Instructions: Run this entire script in your Supabase SQL Editor once.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- 2.1 PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'TENANT',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'TENANT';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2.2 TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  phone TEXT,
  photo_url TEXT,
  profile_photo TEXT,
  designation TEXT NOT NULL,
  team_role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (team_role IN ('OWNER', 'MANAGER', 'EDITOR', 'SUPPORT')),
  role TEXT NOT NULL DEFAULT 'agent',
  bio TEXT,
  whatsapp TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2.3 LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL DEFAULT 'Kanpur',
  description TEXT,
  image TEXT,
  display_order INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2.4 AGENTS TABLE
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Rental Specialist',
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  photo_url TEXT,
  avatar TEXT,
  bio TEXT,
  description TEXT,
  experience_years INT DEFAULT 5,
  deals_count INT DEFAULT 0,
  rating NUMERIC(3, 1) DEFAULT 4.9,
  years_active INT DEFAULT 5,
  specializations TEXT[] DEFAULT '{}',
  areas TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2.5 PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  security_deposit INTEGER,
  maintenance INTEGER DEFAULT 0,
  property_type TEXT NOT NULL DEFAULT 'Flat',
  listing_type TEXT NOT NULL DEFAULT 'RENT',
  bhk INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER DEFAULT 1,
  area_sqft INTEGER NOT NULL DEFAULT 1000,
  floor INTEGER DEFAULT 1,
  total_floors INTEGER DEFAULT 4,
  tenant_type TEXT NOT NULL DEFAULT 'Any',
  furnishing TEXT DEFAULT 'Semi-Furnished',
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('DRAFT', 'AVAILABLE', 'RESERVED', 'RENTED', 'INACTIVE', 'HIDDEN')),
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  featured BOOLEAN DEFAULT false,
  available_from DATE DEFAULT CURRENT_DATE,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 2.6 PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 WISHLISTS & FAVORITES
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_wishlists_user_property UNIQUE (user_id, property_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_favorites_user_property UNIQUE (user_id, property_id)
);

-- 2.8 PROPERTY VISITS TABLE
CREATE TABLE IF NOT EXISTS public.property_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'pending', 'approved', 'rejected')),
  moderation_note TEXT,
  admin_note TEXT,
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_reviews_property_user UNIQUE (property_id, user_id)
);

-- 2.10 INQUIRIES & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'IN_PROGRESS', 'CLOSED', 'new', 'read', 'contacted', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compatibility alias table for contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.11 PAGE SETTINGS
CREATE TABLE IF NOT EXISTS public.page_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.12 SITE STATISTICS
CREATE TABLE IF NOT EXISTS public.site_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT UNIQUE,
  key TEXT UNIQUE,
  label TEXT NOT NULL,
  value TEXT,
  value_number INTEGER,
  value_suffix TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.13 ACTIVITY LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.14 FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location_id);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_user ON public.property_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property ON public.reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- 4. AUTHENTICATION & PROFILE AUTOMATION TRIGGERS
-- ==============================================================================

-- Trigger function: Creates or updates profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  tm_match RECORD;
BEGIN
  -- Check if email matches active team member
  SELECT team_role INTO tm_match
  FROM public.team_members
  WHERE LOWER(email) = LOWER(NEW.email) AND is_active = true
  LIMIT 1;

  IF tm_match.team_role IS NOT NULL THEN
    assigned_role := 'ADMIN';
  ELSE
    assigned_role := COALESCE(UPPER(NEW.raw_user_meta_data->>'role'), 'TENANT');
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    avatar_url,
    role,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    role = CASE WHEN assigned_role = 'ADMIN' THEN 'ADMIN' ELSE profiles.role END,
    updated_at = NOW();

  -- Link user_id in team_members if exists
  UPDATE public.team_members
  SET user_id = NEW.id, updated_at = NOW()
  WHERE LOWER(email) = LOWER(NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. RBAC HELPER FUNCTIONS
-- ==============================================================================

-- Check if caller is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN (user_role ILIKE 'admin%' OR user_role ILIKE 'super_admin%');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check team role
CREATE OR REPLACE FUNCTION public.team_role()
RETURNS TEXT AS $$
DECLARE
  m_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT team_role INTO m_role
  FROM public.team_members
  WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(auth.jwt()->>'email'))
    AND is_active = true
  LIMIT 1;

  RETURN m_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check specific permission
CREATE OR REPLACE FUNCTION public.has_permission(perm TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  trole TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;

  trole := public.team_role();
  IF trole IS NULL THEN
    RETURN true; -- Direct ADMIN role fallback
  END IF;

  IF trole = 'OWNER' THEN
    RETURN true;
  ELSIF trole = 'MANAGER' THEN
    RETURN perm IN (
      'properties.create', 'properties.update', 'properties.delete',
      'page_settings.update', 'locations.manage', 'reviews.moderate',
      'inquiries.manage', 'agents.manage', 'users.view', 'activity_logs.view'
    );
  ELSIF trole = 'EDITOR' THEN
    RETURN perm IN ('properties.create', 'properties.update', 'properties.view');
  ELSIF trole = 'SUPPORT' THEN
    RETURN perm IN ('reviews.moderate', 'inquiries.manage');
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Claim admin session
CREATE OR REPLACE FUNCTION public.claim_team_access()
RETURNS TEXT AS $$
DECLARE
  caller_id UUID;
  caller_email TEXT;
  tm_record RECORD;
BEGIN
  caller_id := auth.uid();
  IF caller_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT email INTO caller_email FROM auth.users WHERE id = caller_id;
  IF caller_email IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO tm_record
  FROM public.team_members
  WHERE LOWER(email) = LOWER(caller_email) AND is_active = true
  LIMIT 1;

  IF tm_record.id IS NOT NULL THEN
    UPDATE public.team_members
    SET user_id = caller_id, updated_at = NOW()
    WHERE id = tm_record.id;

    INSERT INTO public.profiles (id, email, full_name, phone, role, is_active)
    VALUES (caller_id, caller_email, COALESCE(tm_record.name, 'Admin'), tm_record.phone, 'ADMIN', true)
    ON CONFLICT (id) DO UPDATE SET role = 'ADMIN', is_active = true, updated_at = NOW();

    INSERT INTO public.activity_logs (actor_id, actor_email, action, entity, entity_id, summary)
    VALUES (caller_id, caller_email, 'LOGIN', 'team_member', tm_record.id::text, 'Admin claimed team access');

    RETURN tm_record.team_role;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.claim_team_access() TO authenticated;

-- ==============================================================================
-- 6. STORAGE BUCKETS (IMAGES & VIDEOS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('property-videos', 'property-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('agent-photos', 'agent-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('team-photos', 'team-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('site-assets', 'site-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
CREATE POLICY "Public Read Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'avatars', 'site-assets'));

DROP POLICY IF EXISTS "Authenticated Upload Storage" ON storage.objects;
CREATE POLICY "Authenticated Upload Storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'avatars', 'site-assets')
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Authenticated Update Storage" ON storage.objects;
CREATE POLICY "Authenticated Update Storage" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'avatars', 'site-assets')
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Authenticated Delete Storage" ON storage.objects;
CREATE POLICY "Authenticated Delete Storage" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'avatars', 'site-assets')
    AND (public.is_admin() OR auth.uid() = owner)
  );

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES FOR DATABASE TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Drop all existing public table policies to ensure clean state
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 7.1 PROFILES POLICIES
CREATE POLICY "Profiles are readable by authenticated users and admins" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins full profiles access" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 7.2 TEAM MEMBERS POLICIES
CREATE POLICY "Public can view active team members" ON public.team_members
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (public.is_admin());

-- 7.3 LOCATIONS POLICIES
CREATE POLICY "Public can view active locations" ON public.locations
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage locations" ON public.locations
  FOR ALL USING (public.is_admin());

-- 7.4 AGENTS POLICIES
CREATE POLICY "Public can view active agents" ON public.agents
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage agents" ON public.agents
  FOR ALL USING (public.is_admin());

-- 7.5 PROPERTIES POLICIES
CREATE POLICY "Public can view active properties" ON public.properties
  FOR SELECT USING (status <> 'HIDDEN' OR public.is_admin());

CREATE POLICY "Admins can manage properties" ON public.properties
  FOR ALL USING (public.is_admin());

-- 7.6 PROPERTY IMAGES POLICIES
CREATE POLICY "Public can view property images" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage property images" ON public.property_images
  FOR ALL USING (public.is_admin());

-- 7.7 WISHLISTS & FAVORITES POLICIES
CREATE POLICY "Users can manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7.8 PROPERTY VISITS POLICIES
CREATE POLICY "Users can view own visits or admin" ON public.property_visits
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can book visit" ON public.property_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visit or admin" ON public.property_visits
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage visits" ON public.property_visits
  FOR ALL USING (public.is_admin());

-- 7.9 REVIEWS POLICIES
CREATE POLICY "Public can view approved reviews or own" ON public.reviews
  FOR SELECT USING (status IN ('APPROVED', 'approved') OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews or admin" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- 7.10 INQUIRIES & CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users view own inquiries or admin" ON public.inquiries
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- 7.11 PAGE SETTINGS POLICIES
CREATE POLICY "Public can view page settings" ON public.page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage page settings" ON public.page_settings
  FOR ALL USING (public.is_admin());

-- 7.12 SITE STATISTICS POLICIES
CREATE POLICY "Public can view site statistics" ON public.site_statistics
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage site statistics" ON public.site_statistics
  FOR ALL USING (public.is_admin());

-- 7.13 ACTIVITY LOGS POLICIES
CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins or system can insert logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin());

-- 7.14 FAQS POLICIES
CREATE POLICY "Public can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage faqs" ON public.faqs
  FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 8. SEED DATA (INITIAL PLATFORM SETUP)
-- ==============================================================================

-- 8.1 Initial Team Owners
-- Replace these example.invalid addresses before the listed owners sign in.
INSERT INTO public.team_members (email, name, designation, team_role, is_active)
VALUES
  ('owner1@example.invalid', 'PrimeHome Owner', 'Founder & Director', 'OWNER', true),
  ('owner2@example.invalid', 'Team Owner 2', 'Founder & Strategy Lead', 'OWNER', true),
  ('owner3@example.invalid', 'Team Owner 3', 'Technical Co-Founder', 'OWNER', true)
ON CONFLICT (email) DO UPDATE
SET team_role = 'OWNER', is_active = true, updated_at = NOW();

-- 8.2 Page Settings
INSERT INTO public.page_settings (key, value)
VALUES (
  'rentals',
  '{
    "title": "Rental Properties in Kanpur",
    "subtitle": "Explore verified apartments, independent houses, and villas",
    "bannerImage": null,
    "filters": {
      "location": true,
      "type": true,
      "rent": true,
      "bedrooms": true,
      "furnishing": true,
      "search": true
    },
    "listing": {
      "sort": "newest",
      "perPage": 9,
      "layout": "grid",
      "showRented": true,
      "showRatings": true
    },
    "featured": {
      "enabled": true,
      "title": "Featured Rentals",
      "max": 3
    },
    "seo": {
      "title": "Rental Properties in Kanpur | PrimeHomeKanpur",
      "description": "Find 100% physically verified rental flats, independent houses, and apartments in Kanpur."
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 8.3 Site Statistics
INSERT INTO public.site_statistics (stat_key, key, label, value, value_number, value_suffix, display_order)
VALUES
  ('total_reviews', 'total_reviews', 'Total Reviews', '83', 83, '', 1),
  ('years_experience', 'years_experience', 'Years of Experience', '14+', 14, '+', 2),
  ('rentals_listed', 'rentals_listed', 'Rentals Listed', '67+', 67, '+', 3),
  ('satisfaction_rate', 'satisfaction_rate', 'Satisfaction Rate', '98%', 98, '%', 4)
ON CONFLICT (stat_key) DO UPDATE
SET
  value_number = EXCLUDED.value_number,
  value_suffix = EXCLUDED.value_suffix,
  label = EXCLUDED.label;

-- 8.4 Top Kanpur Locations
INSERT INTO public.locations (name, slug, city, description, is_active, display_order, sort_order)
VALUES
  ('Swaroop Nagar', 'swaroop-nagar', 'Kanpur', 'Prime upscale residential neighborhood with cafes, hospitals, and parks.', true, 1, 1),
  ('Kakadeo', 'kakadeo', 'Kanpur', 'Prominent educational & coaching hub with student accommodations and family flats.', true, 2, 2),
  ('Civil Lines', 'civil-lines', 'Kanpur', 'Prestigious commercial & residential zone with wide roads and colonial charm.', true, 3, 3),
  ('Shyam Nagar', 'shyam-nagar', 'Kanpur', 'Rapidly developing south-eastern locality near GT Road and highway access.', true, 4, 4),
  ('Kalyanpur', 'kalyanpur', 'Kanpur', 'Close to IIT Kanpur and prestigious universities, offering modern residential complexes.', true, 5, 5),
  ('Kidwai Nagar', 'kidwai-nagar', 'Kanpur', 'Established residential area in South Kanpur with vibrant markets and transport links.', true, 6, 6),
  ('Tilak Nagar', 'tilak-nagar', 'Kanpur', 'Central Kanpur neighborhood known for peaceful residences and top schools.', true, 7, 7),
  ('Arya Nagar', 'arya-nagar', 'Kanpur', 'Bustling residential hub close to Benajhabar and Motijheel.', true, 8, 8)
ON CONFLICT (slug) DO NOTHING;

-- 8.5 Expert Agents
INSERT INTO public.agents (name, slug, role, phone, email, whatsapp, experience_years, deals_count, rating, specializations, areas, is_active)
VALUES
  ('Rental Specialist 1', 'rental-specialist-1', 'Founder & Senior Specialist', NULL, NULL, NULL, 14, 150, 4.9, ARRAY['Luxury Flats', 'Independent Houses', 'Corporate Rentals'], ARRAY['Swaroop Nagar', 'Civil Lines', 'Tilak Nagar'], true),
  ('Rental Specialist 2', 'rental-specialist-2', 'Co-Founder & Property Lead', NULL, NULL, NULL, 10, 110, 4.8, ARRAY['Student Housing', 'Commercial Spaces', 'Family Apartments'], ARRAY['Kakadeo', 'Kalyanpur', 'Arya Nagar'], true),
  ('Rental Specialist 3', 'rental-specialist-3', 'Listing & Verification Manager', NULL, NULL, NULL, 6, 85, 4.9, ARRAY['Physical Inspection', 'Lease Agreements', 'Tenant Relations'], ARRAY['Shyam Nagar', 'Kidwai Nagar', 'Saket Nagar'], true)
ON CONFLICT (slug) DO NOTHING;

-- 8.6 FAQs
INSERT INTO public.faqs (question, answer, category, display_order, is_active)
VALUES
  ('How does PrimeHomeKanpur verify properties?', 'Every listing on our platform undergoes physical on-site inspection by our field agents to confirm water storage, electrical lines, photos, and landlord details.', 'General', 1, true),
  ('Are there any brokerage charges for scheduling visits?', 'Booking and scheduling a physical walkthrough visit is completely free. You can choose your date and time slot directly on the property detail page.', 'Visits', 2, true),
  ('Can I list my property as a landlord?', 'Yes! You can contact our listing executives via WhatsApp or through our Contact page, and our team will schedule a physical inspection to verify and list your home.', 'Landlords', 3, true),
  ('What documents are required for rental agreements in Kanpur?', 'Typically, valid Aadhaar card, PAN card, permanent address proof, and passport-size photographs are required for police verification and rental agreements in Kanpur.', 'Legal', 4, true)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- SETUP COMPLETE
-- ==============================================================================
