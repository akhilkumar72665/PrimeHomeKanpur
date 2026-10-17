-- ==============================================================================
-- Migration: 20261017000100_fix_public_profile_exposure.sql
-- Description: Fix Public Profile Data Exposure & Enforce Least-Privilege PII Isolation (Task 2)
--
-- Vulnerabilities Remediated:
-- 1. Drops legacy permissive SELECT policies on public.profiles:
--    - "Profiles are viewable by everyone" (from 002_rls_policies.sql)
--    - "Public can view basic profiles" (from 004_full_platform_schema.sql)
--    - "profiles_select_policy" and related legacy definitions
-- 2. Restricts SELECT on profiles strictly to:
--    - The authenticated user themselves (auth.uid() = id)
--    - Authorized administrators holding 'users.view' permission
--    - Supabase service_role
-- 3. Prohibits anonymous (anon) users from reading user full names, emails, phone numbers,
--    and role assignments.
-- 4. Enforces strict UPDATE/INSERT constraints ensuring ordinary users cannot modify
--    another user's profile or change their own role.
-- ==============================================================================

-- 1. Ensure RLS is enabled on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop all legacy and potentially additive permissive policies on profiles
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

-- 3. Create strict, isolated SELECT policy
-- An individual can ONLY read their own profile; admins can read for user management
CREATE POLICY "profiles_select_isolated" ON public.profiles
  FOR SELECT
  USING (
    -- Authenticated owner reading their own record
    auth.uid() = id
    -- Verified administrator holding the 'users.view' privilege
    OR (public.is_admin() AND public.has_permission('users.view'))
    -- Backend service role
    OR auth.role() = 'service_role'
  );

-- 4. Create strict UPDATE policy
-- Users can only modify their own profile, and cannot modify role
CREATE POLICY "profiles_update_isolated" ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR (public.is_admin() AND public.has_permission('users.role_change'))
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    (
      auth.uid() = id AND (
        role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
        OR (public.is_admin() AND public.has_permission('users.role_change'))
      )
    )
    OR (public.is_admin() AND public.has_permission('users.role_change'))
    OR auth.role() = 'service_role'
  );

-- 5. Create strict INSERT policy
-- Registration inserts must default to TENANT unless created by service_role or admin
CREATE POLICY "profiles_insert_isolated" ON public.profiles
  FOR INSERT
  WITH CHECK (
    (auth.uid() = id AND role = 'TENANT')
    OR public.is_admin()
    OR auth.role() = 'service_role'
  );

-- 6. Create strict DELETE policy
-- Users can delete their own account (GDPR/privacy compliance), or admins
CREATE POLICY "profiles_delete_isolated" ON public.profiles
  FOR DELETE
  USING (
    auth.uid() = id
    OR public.is_admin()
    OR auth.role() = 'service_role'
  );
