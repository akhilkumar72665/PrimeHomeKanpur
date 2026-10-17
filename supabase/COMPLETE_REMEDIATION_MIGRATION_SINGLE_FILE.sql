-- ==============================================================================
-- PRIMEHOMEKANPUR: ALL-IN-ONE CONSOLIDATED PRODUCTION MIGRATION (RESILIENT)
-- Generated: 2026-10-17
-- 
-- This single SQL script combines all 8 production remediation migrations:
-- 1. Admin Privilege Escalation Fix & Secure Role Management
-- 2. Public Profile Data Isolation & PII Protection
-- 3. Database Least-Privilege Grants & Routine Security (Dynamic & Resilient)
-- 4. Tenant & Landlord Ownership Multi-Tenant Isolation
-- 5. Private Document Vault (property-documents storage bucket & table)
-- 6. Newsletter Subscription Hardening & Secure Unsubscribe Tokens
-- 7. Tenant Notifications & Rental Applications Schema
-- 8. Payment Transactions Schema & Admin Audit Ledger
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" -> "New query"
-- 3. Paste this ENTIRE file and click "Run" (Ctrl+Enter / Cmd+Enter)
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- PART 1: FIX ADMIN PRIVILEGE ESCALATION (TASK 1)
-- ==============================================================================

-- 1. Hardened is_admin() function (Safe from user_metadata tampering)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  p_role TEXT;
  tm_exists BOOLEAN;
BEGIN
  -- Unauthenticated callers can never be admin
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Layer 1: Trusted server-controlled app_metadata in JWT
  -- (Writable ONLY by Supabase service_role / Admin Auth API; NEVER by client user_metadata)
  IF (auth.jwt()->'app_metadata'->>'role' = 'admin') THEN
    RETURN true;
  END IF;

  -- Layer 2: Check verified active team member record (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
    SELECT EXISTS (
      SELECT 1 FROM public.team_members
      WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')))
        AND is_active = true
    ) INTO tm_exists;

    IF tm_exists = true THEN
      RETURN true;
    END IF;
  END IF;

  -- Layer 3: Check database-persisted profile role (if profiles exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    SELECT role INTO p_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF p_role ILIKE 'admin%' THEN
      RETURN true;
    END IF;
  END IF;

  -- Fail-closed default: Not an authorized admin
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth, pg_temp;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Hardened trigger to prevent self-elevation of profiles.role (if profiles exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    EXECUTE '
      CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
      RETURNS TRIGGER AS $func$
      BEGIN
        IF OLD.role IS DISTINCT FROM NEW.role THEN
          IF NOT public.is_admin() THEN
            RAISE EXCEPTION ''Forbidden: Ordinary users cannot modify their own account role.'';
          END IF;
        END IF;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, pg_temp;

      DROP TRIGGER IF EXISTS tr_prevent_self_role_escalation ON public.profiles;
      CREATE TRIGGER tr_prevent_self_role_escalation
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.prevent_self_role_escalation();
    ';
  END IF;
END $$;

-- 3. Update team_role() and has_permission() with explicit secure search_path
CREATE OR REPLACE FUNCTION public.team_role()
RETURNS TEXT AS $$
DECLARE
  m_role TEXT;
  p_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
    SELECT team_role INTO m_role
    FROM public.team_members
    WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')))
      AND is_active = true
    LIMIT 1;

    IF m_role IS NOT NULL THEN
      RETURN m_role;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    SELECT role INTO p_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF p_role ILIKE 'admin%' THEN
      RETURN 'OWNER';
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth, pg_temp;

GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated, anon;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth, pg_temp;

GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated, anon;


-- ==============================================================================
-- PART 2: FIX PUBLIC PROFILE DATA EXPOSURE (TASK 2)
-- ==============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    EXECUTE '
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
      DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_view_all" ON public.profiles;
      DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
      DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
      DROP POLICY IF EXISTS "Admins with role_change can update profiles" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

      DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

      CREATE POLICY "profiles_select_isolated" ON public.profiles
        FOR SELECT
        USING (
          auth.uid() = id
          OR (public.is_admin() AND public.has_permission(''users.view''))
          OR auth.role() = ''service_role''
        );

      CREATE POLICY "profiles_update_isolated" ON public.profiles
        FOR UPDATE
        USING (
          auth.uid() = id
          OR (public.is_admin() AND public.has_permission(''users.role_change''))
          OR auth.role() = ''service_role''
        )
        WITH CHECK (
          (
            auth.uid() = id AND (
              role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
              OR (public.is_admin() AND public.has_permission(''users.role_change''))
            )
          )
          OR (public.is_admin() AND public.has_permission(''users.role_change''))
          OR auth.role() = ''service_role''
        );

      CREATE POLICY "profiles_insert_isolated" ON public.profiles
        FOR INSERT
        WITH CHECK (
          (auth.uid() = id AND role = ''TENANT'')
          OR public.is_admin()
          OR auth.role() = ''service_role''
        );

      CREATE POLICY "profiles_delete_isolated" ON public.profiles
        FOR DELETE
        USING (
          auth.uid() = id
          OR public.is_admin()
          OR auth.role() = ''service_role''
        );
    ';
  END IF;
END $$;


-- ==============================================================================
-- PART 3: ENFORCE DATABASE LEAST PRIVILEGE (TASK 3) - RESILIENT DYNAMIC GRANTS
-- ==============================================================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Dynamic table grants that verify table existence to prevent 42P01 errors
DO $$
DECLARE
  tbl text;
BEGIN
  -- Tables to grant SELECT to anon (marketing & discovery)
  FOREACH tbl IN ARRAY ARRAY[
    'properties', 'property_images', 'locations', 'agents', 'faqs', 
    'testimonials', 'reviews', 'page_settings', 'site_statistics'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT SELECT ON TABLE public.%I TO anon', tbl);
    END IF;
  END LOOP;

  -- Tables to grant INSERT to anon (public leads & forms)
  FOREACH tbl IN ARRAY ARRAY['inquiries', 'contact_messages', 'newsletter_subscribers']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT INSERT ON TABLE public.%I TO anon', tbl);
    END IF;
  END LOOP;

  -- Tables to REVOKE from anon explicitly
  FOREACH tbl IN ARRAY ARRAY['profiles', 'team_members', 'activity_logs', 'property_visits', 'wishlists', 'favorites']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', tbl);
    END IF;
  END LOOP;

  -- Tables to grant SELECT to authenticated users
  FOREACH tbl IN ARRAY ARRAY[
    'properties', 'property_images', 'locations', 'agents', 'faqs', 
    'testimonials', 'reviews', 'page_settings', 'site_statistics', 
    'profiles', 'property_visits', 'wishlists', 'favorites', 
    'inquiries', 'contact_messages', 'team_members', 'activity_logs'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated', tbl);
    END IF;
  END LOOP;

  -- Tables to grant INSERT to authenticated users
  FOREACH tbl IN ARRAY ARRAY[
    'properties', 'property_images', 'reviews', 'inquiries', 'contact_messages', 
    'newsletter_subscribers', 'property_visits', 'wishlists', 'favorites', 
    'profiles', 'team_members', 'activity_logs'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT INSERT ON TABLE public.%I TO authenticated', tbl);
    END IF;
  END LOOP;

  -- Tables to grant UPDATE to authenticated users
  FOREACH tbl IN ARRAY ARRAY[
    'properties', 'property_images', 'locations', 'agents', 'reviews', 
    'inquiries', 'contact_messages', 'property_visits', 'wishlists', 
    'favorites', 'profiles', 'team_members', 'page_settings', 'site_statistics'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT UPDATE ON TABLE public.%I TO authenticated', tbl);
    END IF;
  END LOOP;

  -- Tables to grant DELETE to authenticated users
  FOREACH tbl IN ARRAY ARRAY[
    'properties', 'property_images', 'reviews', 'property_visits', 
    'wishlists', 'favorites', 'profiles', 'team_members', 'agents'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('GRANT DELETE ON TABLE public.%I TO authenticated', tbl);
    END IF;
  END LOOP;
END $$;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, service_role;


-- ==============================================================================
-- PART 4: ENFORCE TENANT & LANDLORD OWNERSHIP (TASK 6)
-- ==============================================================================

-- Clean existing policies on active tables
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'properties',
        'property_images',
        'property_visits',
        'contact_messages',
        'inquiries',
        'wishlists',
        'favorites',
        'reviews'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Properties policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
    EXECUTE '
      ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "properties_select_isolated" ON public.properties
        FOR SELECT
        USING (
          status IN (''AVAILABLE'', ''RENTED'', ''RESERVED'')
          OR (auth.uid() IS NOT NULL AND created_by = auth.uid())
          OR public.is_admin()
        );

      CREATE POLICY "properties_insert_isolated" ON public.properties
        FOR INSERT
        WITH CHECK (
          (auth.uid() IS NOT NULL AND (created_by = auth.uid() OR created_by IS NULL))
          OR public.is_admin()
        );

      CREATE POLICY "properties_update_isolated" ON public.properties
        FOR UPDATE
        USING (
          (auth.uid() IS NOT NULL AND created_by = auth.uid())
          OR public.is_admin()
        )
        WITH CHECK (
          (auth.uid() IS NOT NULL AND created_by = auth.uid())
          OR public.is_admin()
        );

      CREATE POLICY "properties_delete_isolated" ON public.properties
        FOR DELETE
        USING (
          (auth.uid() IS NOT NULL AND created_by = auth.uid())
          OR public.is_admin()
        );

      CREATE OR REPLACE FUNCTION public.handle_property_ownership()
      RETURNS TRIGGER AS $func$
      BEGIN
        IF TG_OP = ''INSERT'' THEN
          IF NOT public.is_admin() THEN
            NEW.created_by := auth.uid();
          ELSIF NEW.created_by IS NULL THEN
            NEW.created_by := auth.uid();
          END IF;
        ELSIF TG_OP = ''UPDATE'' THEN
          IF OLD.created_by IS DISTINCT FROM NEW.created_by AND NOT public.is_admin() THEN
            RAISE EXCEPTION ''Security violation: Property ownership cannot be modified by non-admin callers.'';
          END IF;
        END IF;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

      DROP TRIGGER IF EXISTS tr_property_ownership ON public.properties;
      CREATE TRIGGER tr_property_ownership
        BEFORE INSERT OR UPDATE ON public.properties
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_property_ownership();
    ';
  END IF;
END $$;

-- Property images policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'property_images') THEN
    EXECUTE '
      ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "property_images_select_isolated" ON public.property_images
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (
                p.status IN (''AVAILABLE'', ''RENTED'', ''RESERVED'')
                OR (auth.uid() IS NOT NULL AND p.created_by = auth.uid())
                OR public.is_admin()
              )
          )
        );

      CREATE POLICY "property_images_insert_isolated" ON public.property_images
        FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.created_by = auth.uid() OR public.is_admin())
          )
        );

      CREATE POLICY "property_images_update_isolated" ON public.property_images
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.created_by = auth.uid() OR public.is_admin())
          )
        );

      CREATE POLICY "property_images_delete_isolated" ON public.property_images
        FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.created_by = auth.uid() OR public.is_admin())
          )
        );
    ';
  END IF;
END $$;

-- Property visits policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'property_visits') THEN
    EXECUTE '
      ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "property_visits_select_isolated" ON public.property_visits
        FOR SELECT
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_visits.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "property_visits_insert_isolated" ON public.property_visits
        FOR INSERT
        WITH CHECK (
          (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
          OR public.is_admin()
        );

      CREATE POLICY "property_visits_update_isolated" ON public.property_visits
        FOR UPDATE
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_visits.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "property_visits_delete_isolated" ON public.property_visits
        FOR DELETE
        USING (public.is_admin());

      CREATE OR REPLACE FUNCTION public.handle_visit_ownership()
      RETURNS TRIGGER AS $func$
      BEGIN
        IF TG_OP = ''INSERT'' THEN
          IF NOT public.is_admin() THEN
            NEW.user_id := auth.uid();
          ELSIF NEW.user_id IS NULL THEN
            NEW.user_id := auth.uid();
          END IF;
        ELSIF TG_OP = ''UPDATE'' THEN
          IF OLD.user_id IS DISTINCT FROM NEW.user_id AND NOT public.is_admin() THEN
            RAISE EXCEPTION ''Security violation: Visit reservation owner cannot be modified.'';
          END IF;
        END IF;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

      DROP TRIGGER IF EXISTS tr_visit_ownership ON public.property_visits;
      CREATE TRIGGER tr_visit_ownership
        BEFORE INSERT OR UPDATE ON public.property_visits
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_visit_ownership();
    ';
  END IF;
END $$;

-- Contact messages policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
    EXECUTE '
      ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "contact_messages_select_isolated" ON public.contact_messages
        FOR SELECT
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = contact_messages.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "contact_messages_insert_isolated" ON public.contact_messages
        FOR INSERT WITH CHECK (true);

      CREATE POLICY "contact_messages_update_isolated" ON public.contact_messages
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = contact_messages.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "contact_messages_delete_isolated" ON public.contact_messages
        FOR DELETE USING (public.is_admin());
    ';
  END IF;
END $$;

-- Inquiries policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inquiries') THEN
    EXECUTE '
      ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "inquiries_select_isolated" ON public.inquiries
        FOR SELECT
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = inquiries.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "inquiries_insert_isolated" ON public.inquiries
        FOR INSERT WITH CHECK (true);

      CREATE POLICY "inquiries_update_isolated" ON public.inquiries
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = inquiries.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "inquiries_delete_isolated" ON public.inquiries
        FOR DELETE USING (public.is_admin());
    ';
  END IF;
END $$;

-- Wishlists & favorites policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wishlists') THEN
    EXECUTE '
      ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "wishlists_select_isolated" ON public.wishlists
        FOR SELECT
        USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));

      CREATE POLICY "wishlists_insert_isolated" ON public.wishlists
        FOR INSERT
        WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

      CREATE POLICY "wishlists_delete_isolated" ON public.wishlists
        FOR DELETE
        USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));
    ';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
    EXECUTE '
      ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "favorites_select_isolated" ON public.favorites
        FOR SELECT
        USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));

      CREATE POLICY "favorites_insert_isolated" ON public.favorites
        FOR INSERT
        WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

      CREATE POLICY "favorites_delete_isolated" ON public.favorites
        FOR DELETE
        USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));
    ';
  END IF;
END $$;

-- Reviews policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
    EXECUTE '
      ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "reviews_select_isolated" ON public.reviews
        FOR SELECT
        USING (
          status = ''approved''
          OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = reviews.property_id
              AND p.created_by = auth.uid()
          )
          OR public.is_admin()
        );

      CREATE POLICY "reviews_insert_isolated" ON public.reviews
        FOR INSERT
        WITH CHECK (
          auth.uid() IS NOT NULL
          AND user_id = auth.uid()
          AND status = ''pending''
        );

      CREATE POLICY "reviews_update_isolated" ON public.reviews
        FOR UPDATE
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid() AND status = ''pending'')
          OR public.is_admin()
        );

      CREATE POLICY "reviews_delete_isolated" ON public.reviews
        FOR DELETE
        USING (
          (auth.uid() IS NOT NULL AND user_id = auth.uid())
          OR public.is_admin()
        );
    ';
  END IF;
END $$;


-- ==============================================================================
-- PART 5: IMPLEMENT PRIVATE DOCUMENT STORAGE (TASK 9)
-- ==============================================================================

-- 1. Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-documents',
  'property-documents',
  false,
  10485760, -- 10 MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- 2. Verification documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'IDENTITY_PROOF',
    'ADDRESS_PROOF',
    'EMPLOYMENT_PROOF',
    'OWNERSHIP_PROOF',
    'ELECTRICITY_BILL',
    'TAX_RECEIPT',
    'OTHER'
  )),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'VERIFIED', 'REJECTED')),
  rejection_reason TEXT,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_verification_docs_user_id ON public.verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_property_id ON public.verification_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_status ON public.verification_documents(status);

ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'verification_documents'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.verification_documents', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "docs_select_owner_or_admin"
  ON public.verification_documents
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (select public.is_admin()) = true
  );

CREATE POLICY "docs_insert_owner"
  ON public.verification_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND status = 'PENDING_REVIEW'
  );

CREATE POLICY "docs_update_owner_or_admin"
  ON public.verification_documents
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (select public.is_admin()) = true
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR (select public.is_admin()) = true
  );

CREATE POLICY "docs_delete_owner_or_admin"
  ON public.verification_documents
  FOR DELETE
  TO authenticated
  USING (
    (user_id = (select auth.uid()) AND status <> 'VERIFIED')
    OR (select public.is_admin()) = true
  );

CREATE OR REPLACE FUNCTION public.fn_enforce_document_security()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  caller_is_admin BOOLEAN;
BEGIN
  caller_is_admin := public.is_admin();

  IF TG_OP = 'UPDATE' AND NEW.user_id <> OLD.user_id AND NOT caller_is_admin THEN
    RAISE EXCEPTION 'Security violation: Document owner cannot be altered.';
  END IF;

  IF TG_OP = 'UPDATE' AND (NEW.status <> OLD.status OR NEW.verified_by IS NOT NULL) AND NOT caller_is_admin THEN
    RAISE EXCEPTION 'Security violation: Only administrators can approve, reject, or mark documents verified.';
  END IF;

  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_document_security ON public.verification_documents;
CREATE TRIGGER tr_document_security
  BEFORE UPDATE ON public.verification_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_enforce_document_security();

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'prop_docs_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "prop_docs_select_owner_or_admin"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-documents'
    AND (
      (select auth.uid())::text = (storage.foldername(name))[1]
      OR (select public.is_admin()) = true
    )
  );

CREATE POLICY "prop_docs_insert_owner"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-documents'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "prop_docs_delete_owner_or_admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-documents'
    AND (
      (select auth.uid())::text = (storage.foldername(name))[1]
      OR (select public.is_admin()) = true
    )
  );

REVOKE ALL ON public.verification_documents FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_documents TO authenticated;
GRANT ALL ON public.verification_documents TO service_role;


-- ==============================================================================
-- PART 6: HARDEN NEWSLETTER SUBSCRIBERS (TASK 10)
-- ==============================================================================

-- Ensure table exists first
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  ADD COLUMN IF NOT EXISTS consent_recorded BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'footer_form',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_token 
  ON public.newsletter_subscribers(unsubscribe_token);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
  ON public.newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active 
  ON public.newsletter_subscribers(is_active);

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.newsletter_subscribers', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_select_admin_only"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING ((select public.is_admin()) = true);

CREATE POLICY "newsletter_insert_public"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND is_active = true
  );

CREATE POLICY "newsletter_update_admin"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING ((select public.is_admin()) = true);

CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(
  p_token TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_updated_count INT := 0;
BEGIN
  IF p_token IS NOT NULL AND trim(p_token) <> '' THEN
    UPDATE public.newsletter_subscribers
    SET 
      is_active = false,
      unsubscribed_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
    WHERE unsubscribe_token = trim(p_token) AND is_active = true;
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  ELSIF p_email IS NOT NULL AND trim(p_email) <> '' THEN
    UPDATE public.newsletter_subscribers
    SET 
      is_active = false,
      unsubscribed_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
    WHERE lower(trim(email)) = lower(trim(p_email)) AND is_active = true;
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'You have been successfully unsubscribed.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_newsletter(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(TEXT, TEXT) TO anon, authenticated, service_role;

REVOKE ALL ON public.newsletter_subscribers FROM anon, public;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;


-- ==============================================================================
-- PART 7: NOTIFICATIONS & RENTAL APPLICATIONS (TASK 11)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('visit', 'price', 'document', 'system', 'application')),
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'notifications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "notifications_select_owner"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "notifications_update_owner"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "notifications_delete_owner"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE TABLE IF NOT EXISTS public.rental_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  move_in_date DATE,
  occupants INT DEFAULT 1,
  employment_status TEXT,
  monthly_income NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'UNDER_REVIEW' CHECK (status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED', 'LEASE_GENERATED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rental_applications_user ON public.rental_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_property ON public.rental_applications(property_id);
CREATE INDEX IF NOT EXISTS idx_rental_applications_status ON public.rental_applications(status);

ALTER TABLE public.rental_applications ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'rental_applications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.rental_applications', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "rental_apps_select_isolated"
  ON public.rental_applications
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = rental_applications.property_id 
        AND p.created_by = (select auth.uid())
    )
    OR (select public.is_admin()) = true
  );

CREATE POLICY "rental_apps_insert_owner"
  ON public.rental_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND status = 'UNDER_REVIEW'
  );

CREATE POLICY "rental_apps_update_owner_or_admin"
  ON public.rental_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = rental_applications.property_id 
        AND p.created_by = (select auth.uid())
    )
    OR (select public.is_admin()) = true
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = rental_applications.property_id 
        AND p.created_by = (select auth.uid())
    )
    OR (select public.is_admin()) = true
  );

CREATE POLICY "rental_apps_delete_isolated"
  ON public.rental_applications
  FOR DELETE
  TO authenticated
  USING (
    (user_id = (select auth.uid()) AND status = 'UNDER_REVIEW')
    OR (select public.is_admin()) = true
  );

REVOKE ALL ON public.notifications FROM anon, public;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

REVOKE ALL ON public.rental_applications FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rental_applications TO authenticated;
GRANT ALL ON public.rental_applications TO service_role;


-- ==============================================================================
-- PART 8: PAYMENT TRANSACTIONS SCHEMA (TASK 13)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES public.property_visits(id) ON DELETE SET NULL,
  order_id TEXT NOT NULL,
  payment_id TEXT,
  signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
  description TEXT,
  gateway TEXT NOT NULL DEFAULT 'Razorpay',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment ON public.payment_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'payment_transactions'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.payment_transactions', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "payments_select_owner_or_admin"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) 
    OR (select public.is_admin()) = true
  );

CREATE POLICY "payments_manage_admin"
  ON public.payment_transactions
  FOR ALL
  TO authenticated
  USING ((select public.is_admin()) = true)
  WITH CHECK ((select public.is_admin()) = true);

REVOKE ALL ON public.payment_transactions FROM anon, public;
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;

COMMIT;

-- ==============================================================================
-- END OF RESILIENT CONSOLIDATED MIGRATION
-- ==============================================================================
