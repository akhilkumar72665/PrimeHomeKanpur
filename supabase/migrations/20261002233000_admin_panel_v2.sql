-- ============================================================================
-- Migration: 20261002233000_admin_panel_v2.sql
-- Description: Complete production-ready Admin Panel, RBAC, RLS, & Audit Trail
-- Idempotent and safe to run multiple times.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE CHECK CONSTRAINT ENSURANCE
-- profiles.role must be uppercase 'ADMIN' or 'TENANT'
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'TENANT' CHECK (role IN ('ADMIN', 'TENANT')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- In case profiles already exists with different check, ensure role constraint
DO $$
BEGIN
  -- Normalize existing lowercase values if any
  UPDATE public.profiles SET role = 'ADMIN' WHERE role ILIKE 'admin%' OR role ILIKE 'super_admin%';
  UPDATE public.profiles SET role = 'TENANT' WHERE role NOT IN ('ADMIN', 'TENANT');
END $$;

-- 3. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  photo_url TEXT,
  designation TEXT,
  team_role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (team_role IN ('OWNER', 'MANAGER', 'EDITOR', 'SUPPORT')),
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lowercase email index and trigger
CREATE OR REPLACE FUNCTION public.normalize_team_member_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = LOWER(TRIM(NEW.email));
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalize_team_member_email ON public.team_members;
CREATE TRIGGER trg_normalize_team_member_email
  BEFORE INSERT OR UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.normalize_team_member_email();

-- Ensure at least one active OWNER remains
CREATE OR REPLACE FUNCTION public.check_owner_constraint()
RETURNS TRIGGER AS $$
DECLARE
  owner_count INT;
BEGIN
  IF (TG_OP = 'DELETE') OR (TG_OP = 'UPDATE' AND (OLD.team_role = 'OWNER' AND (NEW.team_role <> 'OWNER' OR NEW.is_active = false))) THEN
    SELECT COUNT(*) INTO owner_count FROM public.team_members WHERE team_role = 'OWNER' AND is_active = true AND id <> OLD.id;
    IF owner_count = 0 THEN
      RAISE EXCEPTION 'Cannot remove or deactivate the last remaining active OWNER.';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_owner_constraint ON public.team_members;
CREATE TRIGGER trg_check_owner_constraint
  BEFORE UPDATE OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.check_owner_constraint();

-- 4. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Kanpur',
  slug TEXT UNIQUE,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sort_order if not exists
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Unique index on (lower(name), city)
CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_name_city ON public.locations (LOWER(TRIM(name)), LOWER(TRIM(city)));

-- 5. AGENTS TABLE
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

-- 6. PROPERTIES TABLE
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
  tenant_type TEXT NOT NULL DEFAULT 'Any' CHECK (tenant_type IN ('Family', 'Bachelor', 'Professional', 'Any')),
  furnishing TEXT DEFAULT 'Semi-Furnished',
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('DRAFT', 'AVAILABLE', 'RESERVED', 'RENTED', 'INACTIVE', 'HIDDEN')),
  location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
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

-- Ensure all required columns exist on properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  moderation_note TEXT,
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_reviews_property_user UNIQUE (property_id, user_id)
);

-- Add moderation fields if table existed
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS moderation_note TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- 8. INQUIRIES TABLE
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

ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS email TEXT;

-- 9. PAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.page_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed defaults for 'rentals' page
INSERT INTO public.page_settings (key, value)
VALUES (
  'rentals',
  '{
    "title": "Rental Properties in Kanpur",
    "subtitle": "Find your perfect home",
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
      "description": "Browse physically verified apartments, flats, and houses for rent in Kanpur with PrimeHomeKanpur."
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 10. ACTIVITY LOGS (IMMUTABLE AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, APPROVE, REJECT, ROLE_CHANGE, INVITE, LOGIN...
  entity TEXT NOT NULL, -- property, location, review, team_member, page_settings, agent, inquiry, user
  entity_id TEXT,
  summary TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.activity_logs(actor_id);

-- ============================================================================
-- 11. RBAC & SECURITY FUNCTIONS
-- ============================================================================

-- Function: is_admin()
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

  RETURN (user_role = 'ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: team_role()
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

-- Function: has_permission(perm text)
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
    RETURN false;
  END IF;

  -- Permission Matrix
  IF trole = 'OWNER' THEN
    RETURN true; -- OWNER has all permissions
  ELSIF trole = 'MANAGER' THEN
    RETURN perm IN (
      'properties.create', 'properties.update', 'properties.delete',
      'page_settings.update', 'locations.manage', 'reviews.moderate',
      'inquiries.manage', 'agents.manage', 'users.view', 'activity_logs.view'
    );
  ELSIF trole = 'EDITOR' THEN
    RETURN perm IN ('properties.create', 'properties.update');
  ELSIF trole = 'SUPPORT' THEN
    RETURN perm IN ('reviews.moderate', 'inquiries.manage');
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: claim_team_access()
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

  -- Get email from auth.users
  SELECT email INTO caller_email
  FROM auth.users
  WHERE id = caller_id;

  IF caller_email IS NULL THEN
    RETURN NULL;
  END IF;

  -- Check matching active team_members row (case-insensitive)
  SELECT * INTO tm_record
  FROM public.team_members
  WHERE LOWER(email) = LOWER(caller_email) AND is_active = true
  LIMIT 1;

  IF tm_record.id IS NOT NULL THEN
    -- Link user_id in team_members
    UPDATE public.team_members
    SET user_id = caller_id, updated_at = NOW()
    WHERE id = tm_record.id;

    -- Upsert profile with role = 'ADMIN'
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

    -- Log activity
    INSERT INTO public.activity_logs (actor_id, actor_email, action, entity, entity_id, summary)
    VALUES (caller_id, caller_email, 'LOGIN', 'team_member', tm_record.id::text, 'Admin session claimed via claim_team_access()');

    RETURN tm_record.team_role;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.claim_team_access() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ============================================================================
-- 12. SEED INITIAL OWNER ACCOUNTS
-- ============================================================================
INSERT INTO public.team_members (email, name, designation, team_role, is_active)
VALUES
  ('pathak424448@gmail.com', 'Admin Owner', 'Founder & Owner', 'OWNER', true),
  ('namikaze.krz@gmail.com', 'System Owner', 'Co-Founder & Technical Lead', 'OWNER', true)
ON CONFLICT (email) DO UPDATE
SET team_role = 'OWNER', is_active = true, updated_at = NOW();

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS POLICIES)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ----------------- PROFILES RLS -----------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.has_permission('users.view'));

DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
CREATE POLICY "Users can update own profile non-role" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) OR public.has_permission('users.role_change')
    )
  );

DROP POLICY IF EXISTS "Admins with role_change can update profiles" ON public.profiles;
CREATE POLICY "Admins with role_change can update profiles" ON public.profiles
  FOR UPDATE USING (public.has_permission('users.role_change'));

-- ----------------- TEAM MEMBERS RLS -----------------
DROP POLICY IF EXISTS "Active admins can view team members" ON public.team_members;
CREATE POLICY "Active admins can view team members" ON public.team_members
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Only team.manage can insert team members" ON public.team_members;
CREATE POLICY "Only team.manage can insert team members" ON public.team_members
  FOR INSERT WITH CHECK (public.has_permission('team.manage'));

DROP POLICY IF EXISTS "Only team.manage can update team members" ON public.team_members;
CREATE POLICY "Only team.manage can update team members" ON public.team_members
  FOR UPDATE USING (public.has_permission('team.manage'));

DROP POLICY IF EXISTS "Only team.manage can delete team members" ON public.team_members;
CREATE POLICY "Only team.manage can delete team members" ON public.team_members
  FOR DELETE USING (public.has_permission('team.manage'));

-- ----------------- LOCATIONS RLS -----------------
DROP POLICY IF EXISTS "Public can view active locations" ON public.locations;
CREATE POLICY "Public can view active locations" ON public.locations
  FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Locations manage permission for insert" ON public.locations;
CREATE POLICY "Locations manage permission for insert" ON public.locations
  FOR INSERT WITH CHECK (public.has_permission('locations.manage'));

DROP POLICY IF EXISTS "Locations manage permission for update" ON public.locations;
CREATE POLICY "Locations manage permission for update" ON public.locations
  FOR UPDATE USING (public.has_permission('locations.manage'));

DROP POLICY IF EXISTS "Locations manage permission for delete" ON public.locations;
CREATE POLICY "Locations manage permission for delete" ON public.locations
  FOR DELETE USING (public.has_permission('locations.manage'));

-- ----------------- AGENTS RLS -----------------
DROP POLICY IF EXISTS "Public can view active agents" ON public.agents;
CREATE POLICY "Public can view active agents" ON public.agents
  FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Agents manage permission for insert" ON public.agents;
CREATE POLICY "Agents manage permission for insert" ON public.agents
  FOR INSERT WITH CHECK (public.has_permission('agents.manage'));

DROP POLICY IF EXISTS "Agents manage permission for update" ON public.agents;
CREATE POLICY "Agents manage permission for update" ON public.agents
  FOR UPDATE USING (public.has_permission('agents.manage'));

DROP POLICY IF EXISTS "Agents manage permission for delete" ON public.agents;
CREATE POLICY "Agents manage permission for delete" ON public.agents
  FOR DELETE USING (public.has_permission('agents.manage'));

-- ----------------- PROPERTIES RLS -----------------
DROP POLICY IF EXISTS "Public can view visible properties" ON public.properties;
CREATE POLICY "Public can view visible properties" ON public.properties
  FOR SELECT USING (status <> 'HIDDEN' OR public.has_permission('properties.update'));

DROP POLICY IF EXISTS "Properties create permission for insert" ON public.properties;
CREATE POLICY "Properties create permission for insert" ON public.properties
  FOR INSERT WITH CHECK (public.has_permission('properties.create'));

DROP POLICY IF EXISTS "Properties update permission for update" ON public.properties;
CREATE POLICY "Properties update permission for update" ON public.properties
  FOR UPDATE USING (public.has_permission('properties.update'));

DROP POLICY IF EXISTS "Properties delete permission for delete" ON public.properties;
CREATE POLICY "Properties delete permission for delete" ON public.properties
  FOR DELETE USING (public.has_permission('properties.delete'));

-- ----------------- INQUIRIES RLS -----------------
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own inquiries or admin" ON public.inquiries;
CREATE POLICY "Users can view own inquiries or admin" ON public.inquiries
  FOR SELECT USING (auth.uid() = user_id OR public.has_permission('inquiries.manage'));

DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE USING (public.has_permission('inquiries.manage'));

DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Admins can delete inquiries" ON public.inquiries
  FOR DELETE USING (public.has_permission('inquiries.manage'));

-- ----------------- REVIEWS RLS -----------------
DROP POLICY IF EXISTS "Public can view approved reviews or own reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews or own reviews" ON public.reviews
  FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id OR public.has_permission('reviews.moderate'));

DROP POLICY IF EXISTS "Authenticated users can insert pending review" ON public.reviews;
CREATE POLICY "Authenticated users can insert pending review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'PENDING');

DROP POLICY IF EXISTS "Users can update own pending review or moderator" ON public.reviews;
CREATE POLICY "Users can update own pending review or moderator" ON public.reviews
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'PENDING') OR public.has_permission('reviews.moderate')
  )
  WITH CHECK (
    public.has_permission('reviews.moderate') OR (auth.uid() = user_id AND status = 'PENDING')
  );

DROP POLICY IF EXISTS "Moderators can delete reviews" ON public.reviews;
CREATE POLICY "Moderators can delete reviews" ON public.reviews
  FOR DELETE USING (public.has_permission('reviews.moderate'));

-- ----------------- PAGE SETTINGS RLS -----------------
DROP POLICY IF EXISTS "Public can view page settings" ON public.page_settings;
CREATE POLICY "Public can view page settings" ON public.page_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update page settings" ON public.page_settings;
CREATE POLICY "Admins can update page settings" ON public.page_settings
  FOR ALL USING (public.has_permission('page_settings.update'));

-- ----------------- ACTIVITY LOGS RLS (IMMUTABLE) -----------------
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.activity_logs;
CREATE POLICY "Admins can insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authorized admins can view activity logs" ON public.activity_logs;
CREATE POLICY "Authorized admins can view activity logs" ON public.activity_logs
  FOR SELECT USING (public.has_permission('activity_logs.view'));

-- ============================================================================
-- 14. STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-images', 'property-images', true),
  ('property-videos', 'property-videos', true),
  ('agent-photos', 'agent-photos', true),
  ('team-photos', 'team-photos', true),
  ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Public Access for PrimeHome Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets'));

DROP POLICY IF EXISTS "Admin Upload for PrimeHome Storage" ON storage.objects;
CREATE POLICY "Admin Upload for PrimeHome Storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('property-images', 'property-videos', 'agent-photos', 'team-photos', 'site-assets')
    AND public.is_admin()
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

-- ============================================================================
-- 15. WISHLISTS & FAVORITES (TENANT FEATURES)
-- ============================================================================
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

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 16. PROPERTY VISITS (SCHEDULING WORKFLOW)
-- ============================================================================
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

ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own visits" ON public.property_visits;
CREATE POLICY "Users can view own visits" ON public.property_visits
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can book a visit" ON public.property_visits;
CREATE POLICY "Users can book a visit" ON public.property_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can cancel own pending visit" ON public.property_visits;
CREATE POLICY "Users can cancel own pending visit" ON public.property_visits
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'pending') OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can manage all visits" ON public.property_visits;
CREATE POLICY "Admins can manage all visits" ON public.property_visits
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 17. SITE STATISTICS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active statistics" ON public.site_statistics;
CREATE POLICY "Public can view active statistics" ON public.site_statistics
  FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage site statistics" ON public.site_statistics;
CREATE POLICY "Admins can manage site statistics" ON public.site_statistics
  FOR ALL USING (public.has_permission('page_settings.update'));

