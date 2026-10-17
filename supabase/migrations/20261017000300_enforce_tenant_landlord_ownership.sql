-- ==============================================================================
-- Migration: 20261017000300_enforce_tenant_landlord_ownership.sql
-- Description: Task 6 - Enforce Tenant and Landlord Ownership, Multi-Tenant Data
--              Isolation, Prevention of Ownership Spoofing, and Hardened RLS.
-- ==============================================================================

-- 1. Drop all legacy/additive policies across properties, images, visits, leads, wishlists, reviews
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

-- 2. Ensure RLS is enabled on all relevant tables
ALTER TABLE IF EXISTS public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. PROPERTIES POLICIES (Landlord & Public Isolation)
-- ==============================================================================

-- SELECT: Public can view active listings; Landlords can view ALL their own listings; Admins can view all
CREATE POLICY "properties_select_isolated" ON public.properties
  FOR SELECT
  USING (
    status IN ('AVAILABLE', 'RENTED', 'RESERVED')
    OR (auth.uid() IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin()
  );

-- INSERT: Authenticated users can insert properties for themselves; Admins can insert any
CREATE POLICY "properties_insert_isolated" ON public.properties
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND (created_by = auth.uid() OR created_by IS NULL))
    OR public.is_admin()
  );

-- UPDATE: Landlords can update ONLY their own properties; Admins can update any
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

-- DELETE: Only the owning landlord or an Admin can delete properties
CREATE POLICY "properties_delete_isolated" ON public.properties
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin()
  );

-- ==============================================================================
-- 4. PROPERTY IMAGES POLICIES
-- ==============================================================================

-- SELECT: Public can view images for viewable properties; Landlords can view their own
CREATE POLICY "property_images_select_isolated" ON public.property_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
        AND (
          p.status IN ('AVAILABLE', 'RENTED', 'RESERVED')
          OR (auth.uid() IS NOT NULL AND p.created_by = auth.uid())
          OR public.is_admin()
        )
    )
  );

-- INSERT / UPDATE / DELETE: Only the property owner landlord or an Admin
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

-- ==============================================================================
-- 5. PROPERTY VISITS POLICIES (Tenant & Landlord Strict Isolation)
-- ==============================================================================

-- SELECT: Tenant can view own visits; Landlord can view visits for their owned properties; Admin can view all
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

-- INSERT: Authenticated tenant can schedule a visit for themselves
CREATE POLICY "property_visits_insert_isolated" ON public.property_visits
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
    OR public.is_admin()
  );

-- UPDATE:
-- Tenant can cancel their pending visit.
-- Landlord can confirm or complete visit on their owned property.
-- Admin has full update capability.
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

-- DELETE: Only Admin
CREATE POLICY "property_visits_delete_isolated" ON public.property_visits
  FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 6. CONTACT MESSAGES & INQUIRIES POLICIES (Tenant & Landlord Lead Isolation)
-- ==============================================================================

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
  FOR INSERT
  WITH CHECK (true);

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
  FOR DELETE
  USING (public.is_admin());

-- Handle inquiries table if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inquiries') THEN
    EXECUTE '
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

-- ==============================================================================
-- 7. WISHLISTS & FAVORITES POLICIES (Strict Tenant Isolation)
-- ==============================================================================

CREATE POLICY "wishlists_select_isolated" ON public.wishlists
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));

CREATE POLICY "wishlists_insert_isolated" ON public.wishlists
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "wishlists_delete_isolated" ON public.wishlists
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR public.is_admin()));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
    EXECUTE '
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

-- ==============================================================================
-- 8. REVIEWS POLICIES
-- ==============================================================================

CREATE POLICY "reviews_select_isolated" ON public.reviews
  FOR SELECT
  USING (
    status = 'approved'
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
    AND status = 'pending'
  );

CREATE POLICY "reviews_update_isolated" ON public.reviews
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid() AND status = 'pending')
    OR public.is_admin()
  );

CREATE POLICY "reviews_delete_isolated" ON public.reviews
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.is_admin()
  );

-- ==============================================================================
-- 9. ANTI-SPOOFING TRIGGERS (Defend against client payload tampering)
-- ==============================================================================

-- 9.1 Property Ownership Anti-Spoofing Trigger
CREATE OR REPLACE FUNCTION public.handle_property_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.created_by := auth.uid();
    ELSIF NEW.created_by IS NULL THEN
      NEW.created_by := auth.uid();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.created_by IS DISTINCT FROM NEW.created_by AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Security violation: Property ownership cannot be modified by non-admin callers.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_property_ownership ON public.properties;
CREATE TRIGGER tr_property_ownership
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_property_ownership();

-- 9.2 Visit Ownership Anti-Spoofing Trigger
CREATE OR REPLACE FUNCTION public.handle_visit_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.user_id := auth.uid();
    ELSIF NEW.user_id IS NULL THEN
      NEW.user_id := auth.uid();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.user_id IS DISTINCT FROM NEW.user_id AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Security violation: Visit reservation owner cannot be modified.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_visit_ownership ON public.property_visits;
CREATE TRIGGER tr_visit_ownership
  BEFORE INSERT OR UPDATE ON public.property_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_visit_ownership();
