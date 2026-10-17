-- Migration: 20261017000500_harden_newsletter_subscribers.sql
-- Description: Task 10 - Connect Newsletter Subscription & Secure Unsubscribe
-- Adds secure unsubscribe tokens, consent tracking, and tightens RLS to prevent email harvesting.

-- 1. Add missing security and audit columns to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  ADD COLUMN IF NOT EXISTS consent_recorded BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'footer_form',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- Ensure unique index on unsubscribe_token
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_token 
  ON public.newsletter_subscribers(unsubscribe_token);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
  ON public.newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active 
  ON public.newsletter_subscribers(is_active);

-- 2. Drop legacy permissive policies on newsletter_subscribers
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

-- 3. RLS Policies
-- 3.1 SELECT: ONLY administrators can view the subscriber list (Anti-Harvesting Defense)
CREATE POLICY "newsletter_select_admin_only"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING ((select public.is_admin()) = true);

-- 3.2 INSERT: Anonymous & authenticated users can subscribe with normalized email
CREATE POLICY "newsletter_insert_public"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND is_active = true
  );

-- 3.3 UPDATE: Admin can manage; Unsubscribe function updates via service role or secure token
CREATE POLICY "newsletter_update_admin"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING ((select public.is_admin()) = true);

-- 4. Secure RPC function for token-based or email-based unsubscribe (SECURITY DEFINER)
-- Prevents disclosing whether arbitrary emails exist in the database
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

  -- Always return generic success to prevent email enumeration attacks
  RETURN jsonb_build_object(
    'success', true,
    'message', 'You have been successfully unsubscribed.'
  );
END;
$$;

-- Grant execution to anon and authenticated
REVOKE ALL ON FUNCTION public.unsubscribe_newsletter(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(TEXT, TEXT) TO anon, authenticated, service_role;

-- 5. Least-Privilege table permissions
REVOKE ALL ON public.newsletter_subscribers FROM anon, public;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
