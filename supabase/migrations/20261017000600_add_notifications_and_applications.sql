-- Migration: 20261017000600_add_notifications_and_applications.sql
-- Description: Task 11 - Add real tables and RLS for Tenant Notifications and Rental Applications

-- 1. Create notifications table
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

-- Enable RLS on notifications
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

-- RLS: Tenant can select their own notifications
CREATE POLICY "notifications_select_owner"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- RLS: Tenant can update read status on their own notifications
CREATE POLICY "notifications_update_owner"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- RLS: Tenant can delete their own notifications
CREATE POLICY "notifications_delete_owner"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- 2. Create rental_applications table
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

-- Enable RLS on rental_applications
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

-- RLS: Tenant can view their own submitted applications; Landlord who owns property can view applications on their property; Admin can view all
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

-- RLS: Authenticated user can submit application for themselves
CREATE POLICY "rental_apps_insert_owner"
  ON public.rental_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND status = 'UNDER_REVIEW'
  );

-- RLS: Property owner (landlord) or Admin can update status
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

-- RLS: Tenant can cancel/delete unapproved application; Admin can delete any
CREATE POLICY "rental_apps_delete_isolated"
  ON public.rental_applications
  FOR DELETE
  TO authenticated
  USING (
    (user_id = (select auth.uid()) AND status = 'UNDER_REVIEW')
    OR (select public.is_admin()) = true
  );

-- 3. Least-privilege permissions
REVOKE ALL ON public.notifications FROM anon, public;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

REVOKE ALL ON public.rental_applications FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rental_applications TO authenticated;
GRANT ALL ON public.rental_applications TO service_role;
