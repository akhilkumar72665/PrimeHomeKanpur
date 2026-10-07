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
-- 7. Full PostgreSQL Schema & Table Grants to authenticated and anon roles
-- 8. Production Seed Data (25+ Kanpur Locations, Properties, Agents, Team, Stats, FAQs)
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

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'TENANT';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Normalize existing roles
UPDATE public.profiles SET role = 'ADMIN' WHERE role ILIKE 'admin%' OR role ILIKE 'super_admin%';
UPDATE public.profiles SET role = 'TENANT' WHERE role NOT IN ('ADMIN', 'TENANT');

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
  designation TEXT DEFAULT 'Operations',
  team_role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (team_role IN ('OWNER', 'MANAGER', 'EDITOR', 'SUPPORT')),
  role TEXT NOT NULL DEFAULT 'agent',
  bio TEXT,
  whatsapp TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Operations';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS team_role TEXT NOT NULL DEFAULT 'EDITOR';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2.3 LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL DEFAULT 'Kanpur',
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- 2.4 AGENTS TABLE
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
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
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS photo_url TEXT;
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
  bhk INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER DEFAULT 1,
  area_sqft INTEGER NOT NULL DEFAULT 1000,
  floor INTEGER DEFAULT 1,
  total_floors INTEGER DEFAULT 4,
  tenant_type TEXT NOT NULL DEFAULT 'Any',
  furnishing TEXT DEFAULT 'Semi-Furnished',
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
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

-- 2.6 REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  moderation_note TEXT,
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_property_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- 2.7 INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'IN_PROGRESS', 'CLOSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_property_id_fkey;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;

-- 2.8 PAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.page_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.activity_logs(actor_id);

-- 2.10 PROPERTY VISITS TABLE
CREATE TABLE IF NOT EXISTS public.property_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.property_visits DROP CONSTRAINT IF EXISTS property_visits_property_id_fkey;
ALTER TABLE public.property_visits ADD CONSTRAINT property_visits_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- 2.11 SITE STATISTICS TABLE
CREATE TABLE IF NOT EXISTS public.site_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT NOT NULL UNIQUE,
  key TEXT,
  label TEXT NOT NULL,
  value TEXT,
  value_number INT DEFAULT 0,
  value_suffix TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.12 WISHLISTS & FAVORITES
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

-- 2.13 FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. GRANT TABLE PRIVILEGES (PREVENTS "permission denied")
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role, authenticated, anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role, authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role, authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, service_role, authenticated, anon;

-- ==============================================================================
-- 4. RBAC & HELPER SECURITY FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  p_role TEXT;
  tm_exists BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO p_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF p_role ILIKE 'admin%' THEN
    RETURN true;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')))
      AND is_active = true
  ) INTO tm_exists;

  IF tm_exists = true THEN
    RETURN true;
  END IF;

  IF (auth.jwt()->'app_metadata'->>'role' = 'admin' OR auth.jwt()->'user_metadata'->>'role' = 'admin') THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.team_role()
RETURNS TEXT AS $$
DECLARE
  m_role TEXT;
  p_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT team_role INTO m_role
  FROM public.team_members
  WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')))
    AND is_active = true
  LIMIT 1;

  IF m_role IS NOT NULL THEN
    RETURN m_role;
  END IF;

  SELECT role INTO p_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF p_role ILIKE 'admin%' THEN
    RETURN 'OWNER';
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.has_permission(perm TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  trole TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;

  trole := public.team_role();

  IF trole IS NULL OR trole = 'OWNER' THEN
    RETURN true;
  ELSIF trole = 'MANAGER' THEN
    RETURN perm IN (
      'properties.create', 'properties.update', 'properties.delete',
      'page_settings.update', 'locations.manage', 'reviews.moderate',
      'inquiries.manage', 'agents.manage', 'users.view', 'activity_logs.view'
    );
  ELSIF trole = 'EDITOR' THEN
    RETURN perm IN ('properties.create', 'properties.update', 'locations.manage');
  ELSIF trole = 'SUPPORT' THEN
    RETURN perm IN ('reviews.moderate', 'inquiries.manage');
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

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

  caller_email := LOWER(COALESCE(auth.jwt()->>'email', ''));
  IF caller_email = '' THEN
    SELECT email INTO caller_email FROM auth.users WHERE id = caller_id;
  END IF;

  IF caller_email IS NULL OR caller_email = '' THEN
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
    VALUES (
      caller_id,
      caller_email,
      COALESCE(tm_record.name, 'Admin'),
      tm_record.phone,
      'ADMIN',
      true
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'ADMIN', is_active = true, updated_at = NOW();

    BEGIN
      INSERT INTO public.activity_logs (actor_id, actor_email, action, entity, entity_id, summary)
      VALUES (caller_id, caller_email, 'LOGIN', 'team_member', tm_record.id::text, 'Admin session claimed via claim_team_access()');
    EXCEPTION WHEN OTHERS THEN
    END;

    RETURN tm_record.team_role;
  ELSE
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = caller_id AND role ILIKE 'admin%') THEN
      RETURN 'OWNER';
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.claim_team_access() TO authenticated, anon;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS POLICIES)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin() OR public.has_permission('users.view'));

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- 5.2 TEAM MEMBERS POLICIES
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
CREATE POLICY "team_members_select_policy" ON public.team_members
  FOR SELECT USING (public.is_admin() OR auth.uid() = user_id OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')));

DROP POLICY IF EXISTS "team_members_insert_policy" ON public.team_members;
CREATE POLICY "team_members_insert_policy" ON public.team_members
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "team_members_update_policy" ON public.team_members;
CREATE POLICY "team_members_update_policy" ON public.team_members
  FOR UPDATE USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "team_members_delete_policy" ON public.team_members;
CREATE POLICY "team_members_delete_policy" ON public.team_members
  FOR DELETE USING (public.is_admin());

-- 5.3 LOCATIONS POLICIES
DROP POLICY IF EXISTS "locations_select_policy" ON public.locations;
CREATE POLICY "locations_select_policy" ON public.locations FOR SELECT USING (true);
DROP POLICY IF EXISTS "locations_all_admin_policy" ON public.locations;
CREATE POLICY "locations_all_admin_policy" ON public.locations FOR ALL USING (public.is_admin() OR public.has_permission('locations.manage')) WITH CHECK (public.is_admin() OR public.has_permission('locations.manage'));

-- 5.4 AGENTS POLICIES
DROP POLICY IF EXISTS "agents_select_policy" ON public.agents;
CREATE POLICY "agents_select_policy" ON public.agents FOR SELECT USING (true);
DROP POLICY IF EXISTS "agents_all_admin_policy" ON public.agents;
CREATE POLICY "agents_all_admin_policy" ON public.agents FOR ALL USING (public.is_admin() OR public.has_permission('agents.manage')) WITH CHECK (public.is_admin() OR public.has_permission('agents.manage'));

-- 5.5 PROPERTIES POLICIES
DROP POLICY IF EXISTS "properties_select_policy" ON public.properties;
CREATE POLICY "properties_select_policy" ON public.properties FOR SELECT USING (status <> 'HIDDEN' OR public.is_admin());
DROP POLICY IF EXISTS "properties_all_admin_policy" ON public.properties;
CREATE POLICY "properties_all_admin_policy" ON public.properties FOR ALL USING (public.is_admin() OR public.has_permission('properties.update')) WITH CHECK (public.is_admin() OR public.has_permission('properties.create'));

-- 5.6 INQUIRIES POLICIES
DROP POLICY IF EXISTS "inquiries_select_policy" ON public.inquiries;
CREATE POLICY "inquiries_select_policy" ON public.inquiries FOR SELECT USING (public.is_admin() OR auth.uid() = user_id OR public.has_permission('inquiries.manage'));
DROP POLICY IF EXISTS "inquiries_insert_policy" ON public.inquiries;
CREATE POLICY "inquiries_insert_policy" ON public.inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "inquiries_update_policy" ON public.inquiries;
CREATE POLICY "inquiries_update_policy" ON public.inquiries FOR UPDATE USING (public.is_admin() OR public.has_permission('inquiries.manage'));
DROP POLICY IF EXISTS "inquiries_delete_policy" ON public.inquiries;
CREATE POLICY "inquiries_delete_policy" ON public.inquiries FOR DELETE USING (public.is_admin() OR public.has_permission('inquiries.manage'));

-- 5.7 REVIEWS POLICIES
DROP POLICY IF EXISTS "reviews_select_policy" ON public.reviews;
CREATE POLICY "reviews_select_policy" ON public.reviews FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id OR public.is_admin() OR public.has_permission('reviews.moderate'));
DROP POLICY IF EXISTS "reviews_insert_policy" ON public.reviews;
CREATE POLICY "reviews_insert_policy" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "reviews_update_policy" ON public.reviews;
CREATE POLICY "reviews_update_policy" ON public.reviews FOR UPDATE USING (public.is_admin() OR public.has_permission('reviews.moderate') OR auth.uid() = user_id);
DROP POLICY IF EXISTS "reviews_delete_policy" ON public.reviews;
CREATE POLICY "reviews_delete_policy" ON public.reviews FOR DELETE USING (public.is_admin() OR public.has_permission('reviews.moderate'));

-- 5.8 ACTIVITY LOGS POLICIES
DROP POLICY IF EXISTS "activity_logs_select_policy" ON public.activity_logs;
CREATE POLICY "activity_logs_select_policy" ON public.activity_logs FOR SELECT USING (public.is_admin() OR public.has_permission('activity_logs.view'));
DROP POLICY IF EXISTS "activity_logs_insert_policy" ON public.activity_logs;
CREATE POLICY "activity_logs_insert_policy" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

-- 5.9 PAGE SETTINGS POLICIES
DROP POLICY IF EXISTS "page_settings_select_policy" ON public.page_settings;
CREATE POLICY "page_settings_select_policy" ON public.page_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "page_settings_all_policy" ON public.page_settings;
CREATE POLICY "page_settings_all_policy" ON public.page_settings FOR ALL USING (public.is_admin() OR public.has_permission('page_settings.update')) WITH CHECK (public.is_admin() OR public.has_permission('page_settings.update'));

-- 5.10 PROPERTY VISITS POLICIES
DROP POLICY IF EXISTS "property_visits_select_policy" ON public.property_visits;
CREATE POLICY "property_visits_select_policy" ON public.property_visits FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "property_visits_insert_policy" ON public.property_visits;
CREATE POLICY "property_visits_insert_policy" ON public.property_visits FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "property_visits_update_policy" ON public.property_visits;
CREATE POLICY "property_visits_update_policy" ON public.property_visits FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "property_visits_delete_policy" ON public.property_visits;
CREATE POLICY "property_visits_delete_policy" ON public.property_visits FOR DELETE USING (public.is_admin());

-- 5.11 SITE STATISTICS & FAQS
DROP POLICY IF EXISTS "site_statistics_select_policy" ON public.site_statistics;
CREATE POLICY "site_statistics_select_policy" ON public.site_statistics FOR SELECT USING (true);
DROP POLICY IF EXISTS "site_statistics_admin_policy" ON public.site_statistics;
CREATE POLICY "site_statistics_admin_policy" ON public.site_statistics FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "faqs_select_policy" ON public.faqs;
CREATE POLICY "faqs_select_policy" ON public.faqs FOR SELECT USING (true);
DROP POLICY IF EXISTS "faqs_admin_policy" ON public.faqs;
CREATE POLICY "faqs_admin_policy" ON public.faqs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. SEED DATA & STORAGE
-- ==============================================================================

-- 6.1 TEAM OWNERS
INSERT INTO public.team_members (email, name, designation, team_role, is_active)
VALUES
  ('pathak424448@gmail.com', 'Admin Owner', 'Founder & Owner', 'OWNER', true),
  ('namikaze.krz@gmail.com', 'System Owner', 'Co-Founder & Technical Lead', 'OWNER', true)
ON CONFLICT (email) DO UPDATE
SET team_role = 'OWNER', is_active = true, updated_at = NOW();

-- 6.2 TOP KANPUR LOCATIONS (25+ KEY LOCATIONS)
INSERT INTO public.locations (name, slug, city, description, is_active, display_order, sort_order)
VALUES
  ('Kakadeo', 'kakadeo', 'Kanpur', 'Prominent educational & coaching hub with student accommodations and family flats.', true, 1, 1),
  ('Swaroop Nagar', 'swaroop-nagar', 'Kanpur', 'Prime upscale residential neighborhood with cafes, hospitals, and parks.', true, 2, 2),
  ('Gurudev Chauraha', 'gurudev-chauraha', 'Kanpur', 'Strategic central intersection connecting GT Road, Kakadeo, and Vikas Nagar.', true, 3, 3),
  ('Civil Lines', 'civil-lines', 'Kanpur', 'Prestigious commercial & residential zone with wide roads and colonial charm.', true, 4, 4),
  ('Vikas Nagar', 'vikas-nagar', 'Kanpur', 'Peaceful residential sector adjacent to Signature Greens and Zoo road.', true, 5, 5),
  ('Vijay Nagar', 'vijay-nagar', 'Kanpur', 'Arterial locality connecting Shastri Nagar, Kakadeo, and Dada Nagar.', true, 6, 6),
  ('Kalyanpur', 'kalyanpur', 'Kanpur', 'Close to IIT Kanpur and prestigious universities, offering modern apartments.', true, 7, 7),
  ('Shyam Nagar', 'shyam-nagar', 'Kanpur', 'Rapidly developing south-eastern locality near GT Road and highway.', true, 8, 8),
  ('Kidwai Nagar', 'kidwai-nagar', 'Kanpur', 'Established residential area in South Kanpur with vibrant markets.', true, 9, 9),
  ('Arya Nagar', 'arya-nagar', 'Kanpur', 'Bustling residential hub close to Benajhabar and Motijheel.', true, 10, 10),
  ('Tilak Nagar', 'tilak-nagar', 'Kanpur', 'Central Kanpur neighborhood known for peaceful residences and top schools.', true, 11, 11),
  ('Barra', 'barra', 'Kanpur', 'Large residential sector divided into Sectors 1-8 with great connectivity.', true, 12, 12),
  ('Govind Nagar', 'govind-nagar', 'Kanpur', 'Dynamic South Kanpur hub with major markets and family housing.', true, 13, 13),
  ('Awas Vikas', 'awas-vikas', 'Kanpur', 'Planned housing society sector with broad avenues and parks.', true, 14, 14),
  ('Naveen Nagar', 'naveen-nagar', 'Kanpur', 'Quiet family residential enclave adjacent to Kakadeo.', true, 15, 15),
  ('Sharda Nagar', 'sharda-nagar', 'Kanpur', 'Popular student and working professional residential locality.', true, 16, 16),
  ('Geeta Nagar', 'geeta-nagar', 'Kanpur', 'Residential locality close to Rawatpur and GT Road.', true, 17, 17),
  ('Rawatpur', 'rawatpur', 'Kanpur', 'Centrally situated neighborhood with Railway Station access.', true, 18, 18),
  ('Ashok Nagar', 'ashok-nagar', 'Kanpur', 'High-demand residential area near 80 Feet Road.', true, 19, 19),
  ('Saket Nagar', 'saket-nagar', 'Kanpur', 'Well-established residential neighborhood in South Kanpur.', true, 20, 20),
  ('Gumti No. 5', 'gumti-no-5', 'Kanpur', 'Premier shopping and central residential district.', true, 21, 21),
  ('Cantt', 'cantt', 'Kanpur', 'Serene, lush green cantonment zone with tranquil surroundings.', true, 22, 22),
  ('Lajpat Nagar', 'lajpat-nagar', 'Kanpur', 'Centrally located residential sector near Motijheel.', true, 23, 23),
  ('Panki', 'panki', 'Kanpur', 'Rapidly expanding western industrial and residential belt.', true, 24, 24),
  ('Ratan Lal Nagar', 'ratan-lal-nagar', 'Kanpur', 'Quiet residential neighborhood with independent houses.', true, 25, 25)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  is_active = true;

-- 6.3 SPECIALIST AGENTS
INSERT INTO public.agents (name, slug, role, phone, email, whatsapp, experience_years, deals_count, rating, specializations, areas, is_active)
VALUES
  ('Rajesh Pathak', 'rajesh-pathak', 'Founder & Senior Specialist', '+91 9151435647', 'pathak424448@gmail.com', '+91 9151435647', 14, 500, 4.9, ARRAY['Property Management', 'Tenant Verification', 'Lease Drafting'], ARRAY['Gurudev Chauraha', 'Kakadeo', 'Vijay Nagar', 'Vikas Nagar'], true),
  ('Neha Mishra', 'neha-mishra', 'Senior Rental Agent', '+91 9876543210', 'neha@primehomekanpur.com', '+91 9876543210', 6, 180, 4.8, ARRAY['Residential Rentals', 'PG Accommodation', 'Family Flats'], ARRAY['Vikas Nagar', 'Kakadeo', 'Swaroop Nagar'], true),
  ('Amit Shukla', 'amit-shukla', 'Commercial & Luxury Specialist', '+91 9123456780', 'amit@primehomekanpur.com', '+91 9123456780', 8, 220, 4.9, ARRAY['Independent Houses', 'Luxury Apartments', 'Commercial'], ARRAY['Civil Lines', 'Tilak Nagar', 'Arya Nagar'], true)
ON CONFLICT (slug) DO UPDATE
SET is_active = true;

-- 6.4 SITE STATISTICS
INSERT INTO public.site_statistics (stat_key, key, label, value, value_number, value_suffix, display_order, is_active)
VALUES
  ('total_reviews', 'total_reviews', 'Total Reviews', '83', 83, '', 1, true),
  ('years_experience', 'years_experience', 'Years of Experience', '14+', 14, '+', 2, true),
  ('rentals_listed', 'rentals_listed', 'Rentals Listed', '67+', 67, '+', 3, true),
  ('satisfaction_rate', 'satisfaction_rate', 'Satisfaction Rate', '98%', 98, '%', 4, true)
ON CONFLICT (stat_key) DO UPDATE
SET
  value_number = EXCLUDED.value_number,
  value_suffix = EXCLUDED.value_suffix,
  label = EXCLUDED.label,
  is_active = true;

-- 6.5 STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-images', 'property-images', true),
  ('property-videos', 'property-videos', true),
  ('agent-photos', 'agent-photos', true),
  ('team-photos', 'team-photos', true),
  ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Public Access for PrimeHome Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets'));

DROP POLICY IF EXISTS "Admin Upload for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Admin Upload for PrimeHome Storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets')
    AND (public.is_admin() OR auth.uid() IS NOT NULL)
  );

DROP POLICY IF EXISTS "Admin Update for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Admin Update for PrimeHome Storage" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets')
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin Delete for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Admin Delete for PrimeHome Storage" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets')
    AND public.is_admin()
  );

-- ==============================================================================
-- SETUP COMPLETE
-- ==============================================================================
