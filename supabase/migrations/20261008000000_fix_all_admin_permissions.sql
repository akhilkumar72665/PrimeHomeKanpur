-- ==============================================================================
-- Migration: 20261008000000_fix_all_admin_permissions.sql
-- Description: Full Table Grants, Cascading Deletes, RLS Policies & 25+ Kanpur Locations
-- ==============================================================================

-- 1. Table & Sequence Grants to authenticated & anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role, authenticated, anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role, authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role, authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, service_role, authenticated, anon;

-- 2. Foreign Key Fixes for Properties Deletion
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_property_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_property_id_fkey;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;

ALTER TABLE public.property_visits DROP CONSTRAINT IF EXISTS property_visits_property_id_fkey;
ALTER TABLE public.property_visits ADD CONSTRAINT property_visits_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- 3. RBAC Functions
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated, anon;

-- 4. Seed 25+ Kanpur Locations
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
