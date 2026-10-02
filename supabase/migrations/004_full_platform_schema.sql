-- ==============================================================================
-- 004_full_platform_schema.sql
-- PrimeHomeKanpur: Full Platform Schema, Roles, Security, RLS & Storage
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLE ENUM & PROFILES TABLE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'super_admin',
      'admin',
      'property_manager',
      'listing_manager',
      'review_manager',
      'user'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure admin email has super_admin role when created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  IF NEW.email = 'primehomekanpur@gmail.com' THEN
    assigned_role := 'super_admin';
  ELSE
    assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  END IF;

  INSERT INTO public.profiles (id, email, full_name, phone, avatar_url, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = CASE WHEN EXCLUDED.email = 'primehomekanpur@gmail.com' THEN 'super_admin' ELSE profiles.role END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is admin/staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('super_admin', 'admin', 'property_manager', 'listing_manager', 'review_manager', 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL DEFAULT 'Kanpur',
  description TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  security_deposit INTEGER,
  maintenance INTEGER,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL DEFAULT 'RENT',
  bhk INTEGER NOT NULL,
  bathrooms INTEGER,
  area_sqft INTEGER NOT NULL,
  floor INTEGER,
  total_floors INTEGER,
  tenant_type TEXT NOT NULL DEFAULT 'Any',
  furnishing TEXT,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  featured BOOLEAN DEFAULT false,
  available_from DATE,
  video_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WISHLISTS TABLE (with duplicate prevention constraint)
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Also support favorites alias if needed
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 6. PROPERTY VISITS TABLE
CREATE TABLE IF NOT EXISTS property_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. REVIEWS TABLE (Moderation Workflow)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TEAM MEMBERS & AGENTS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  profile_photo TEXT,
  designation TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'agent',
  permissions JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CONTACT MESSAGES / INQUIRIES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'contacted', 'archived')),
  consent_given BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SITE STATISTICS (Admin-editable)
CREATE TABLE IF NOT EXISTS site_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value_number INTEGER NOT NULL,
  value_suffix TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_property ON wishlists(property_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_user ON property_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_property ON property_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- PROFILES POLICIES
CREATE POLICY "Public can view basic profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (
    -- Normal users cannot escalate their own role
    role = (SELECT role FROM profiles WHERE id = auth.uid()) OR
    public.is_admin_or_staff(auth.uid())
  ));

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- LOCATIONS POLICIES
CREATE POLICY "Public can view active locations" ON locations
  FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admins can manage locations" ON locations
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- PROPERTIES POLICIES
CREATE POLICY "Public can view available properties" ON properties
  FOR SELECT USING (status = 'AVAILABLE' OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admins can manage properties" ON properties
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- PROPERTY IMAGES POLICIES
CREATE POLICY "Public can view property images" ON property_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage property images" ON property_images
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- WISHLISTS POLICIES
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wishlists" ON wishlists
  FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

-- FAVORITES POLICIES (Alias compat)
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- PROPERTY VISITS POLICIES
CREATE POLICY "Users can view own visits" ON property_visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can book a visit" ON property_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own pending visit" ON property_visits
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

CREATE POLICY "Admins can manage all visits" ON property_visits
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- REVIEWS POLICIES
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Authenticated users can submit a review" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- TEAM MEMBERS POLICIES
CREATE POLICY "Public can view active team members" ON team_members
  FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can submit contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own messages" ON contact_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage contact messages" ON contact_messages
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- SITE STATISTICS POLICIES
CREATE POLICY "Public can view active statistics" ON site_statistics
  FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admins can manage site statistics" ON site_statistics
  FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admins and system can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_staff(auth.uid()));

-- ==============================================================================
-- INITIAL DEFAULT SEED DATA (If tables empty)
-- ==============================================================================
INSERT INTO site_statistics (stat_key, label, value_number, value_suffix, display_order)
VALUES
  ('total_reviews', 'Total Reviews', 83, '', 1),
  ('years_experience', 'Years of Experience', 14, '+', 2),
  ('rentals_listed', 'Rentals Listed', 67, '+', 3),
  ('satisfaction_rate', 'Satisfaction Rate', 98, '%', 4)
ON CONFLICT (stat_key) DO NOTHING;

INSERT INTO team_members (name, slug, designation, phone, email, whatsapp, bio, role, display_order, is_active)
VALUES
  ('Abhishek Pathak', 'abhishek-pathak', 'Founder & CEO', '+91 9151435647', 'primehomekanpur@gmail.com', '+91 9151435647', '14+ years in Kanpur rentals, leading market strategy, verified property standards, and tenant experience.', 'super_admin', 1, true),
  ('Piyush Pandey', 'piyush-pandey', 'Co-Founder', '+91 9151435647', 'primehomekanpur@gmail.com', '+91 9151435647', 'Oversees strategic growth, partner relations, landlord onboarding, and end-to-end rental deal execution.', 'admin', 2, true),
  ('Akhil Kumar', 'akhil-kumar', 'Head of Listing & Management', '+91 9151435647', 'primehomekanpur@gmail.com', '+91 9151435647', 'Leads physical property verification, on-site tours, lease documentation, and property management operations.', 'listing_manager', 3, true)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  designation = EXCLUDED.designation,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp;
