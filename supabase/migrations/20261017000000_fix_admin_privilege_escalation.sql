-- ==============================================================================
-- Migration: 20261017000000_fix_admin_privilege_escalation.sql
-- Description: Critical Security Fix for Admin Privilege Escalation (Task 1)
-- 
-- Vulnerabilities Remediated:
-- 1. Disallows privilege escalation via client-modifiable auth.jwt()->'user_metadata'->>'role'.
-- 2. Restricts admin evaluation strictly to trusted server-controlled claims:
--    - auth.jwt()->'app_metadata'->>'role' (only settable via Supabase Service Role API)
--    - Active status in public.team_members table
--    - Verified 'ADMIN' role in public.profiles table
-- 3. Adds BEFORE UPDATE trigger on public.profiles to prevent users from self-elevating
--    their own profiles.role column via client SDK updates.
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

  -- Layer 2: Check verified active team member record
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt()->>'email', '')))
      AND is_active = true
  ) INTO tm_exists;

  IF tm_exists = true THEN
    RETURN true;
  END IF;

  -- Layer 3: Check database-persisted profile role
  SELECT role INTO p_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF p_role ILIKE 'admin%' THEN
    RETURN true;
  END IF;

  -- Fail-closed default: Not an authorized admin
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth, pg_temp;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Hardened trigger to prevent self-elevation of profiles.role
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- If role column is being modified, verify the caller has administrative privileges
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Forbidden: Ordinary users cannot modify their own account role.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth, pg_temp;

DROP TRIGGER IF EXISTS tr_prevent_self_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_self_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_role_escalation();

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
