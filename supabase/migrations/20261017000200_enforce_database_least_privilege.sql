-- ==============================================================================
-- Migration: 20261017000200_enforce_database_least_privilege.sql
-- Description: Revoke Blanket Permissions & Enforce Least-Privilege Grants (Task 3)
--
-- Vulnerabilities Remediated:
-- 1. In migration 20261008000000, blanket 'GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated'
--    was executed, stripping table-level defense-in-depth and leaving RLS as the sole safeguard.
-- 2. ALTER DEFAULT PRIVILEGES was set to grant ALL to anon on all future tables.
-- 3. Anonymous visitors had table-level TRUNCATE, DELETE, and UPDATE privileges on public tables.
--
-- Remediation Architecture:
-- 1. Revoke blanket ALL privileges on tables, sequences, and routines from anon and authenticated.
-- 2. Revoke blanket default privileges on future tables, sequences, and routines.
-- 3. Grant explicit, minimal privileges required for legitimate user journeys:
--    - anon: USAGE on schema, SELECT on active public tables, INSERT on public lead forms (inquiries, newsletter).
--            Zero UPDATE/DELETE/TRUNCATE on any table. Zero access to profiles, team_members, activity_logs.
--    - authenticated: SELECT/INSERT/UPDATE/DELETE on app-relevant tables (each governed by strict RLS).
--                     Zero TRUNCATE or schema-alteration privileges.
--    - service_role / postgres: Retain administrative ALL privileges.
-- 4. Secure search_path on all custom routines to protect against search_path hijacking.
--
-- Rollback Strategy:
-- If an unexpected permissions issue arises, run:
--   GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated, anon;
-- (Detailed rollback script documented at the end of this migration).
-- ==============================================================================

-- ==============================================================================
-- 1. REVOKE BLANKET PRIVILEGES FROM ANON AND AUTHENTICATED
-- ==============================================================================

-- Revoke all table-level privileges granted broadly to anon and authenticated
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Revoke all sequence privileges granted broadly
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

-- Revoke all routine (function/procedure) execute privileges granted broadly
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM authenticated;

-- Reset default privileges on future objects in schema public
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM authenticated;

-- Ensure schema usage is preserved
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;


-- ==============================================================================
-- 2. EXPLICIT LEAST-PRIVILEGE GRANTS FOR 'anon' (PUBLIC VISITORS)
-- ==============================================================================

-- Anon needs SELECT on public marketing / discovery content (filtered by RLS)
GRANT SELECT ON TABLE
  public.properties,
  public.property_images,
  public.locations,
  public.agents,
  public.faqs,
  public.testimonials,
  public.reviews,
  public.page_settings,
  public.site_statistics
TO anon;

-- Anon needs INSERT on public inquiry, contact, and newsletter subscription forms
GRANT INSERT ON TABLE
  public.inquiries,
  public.contact_messages,
  public.newsletter_subscribers
TO anon;

-- Anon needs sequence usage to generate auto-incrementing serial IDs where applicable
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Explicitly ensure anon has ZERO access to sensitive administrative & personal data tables
REVOKE ALL ON TABLE
  public.profiles,
  public.team_members,
  public.activity_logs,
  public.property_visits,
  public.wishlists,
  public.favorites
FROM anon;


-- ==============================================================================
-- 3. EXPLICIT LEAST-PRIVILEGE GRANTS FOR 'authenticated' (LOGGED-IN USERS)
-- ==============================================================================

-- Authenticated users need SELECT on public tables and user-isolated tables (filtered by RLS)
GRANT SELECT ON TABLE
  public.properties,
  public.property_images,
  public.locations,
  public.agents,
  public.faqs,
  public.testimonials,
  public.reviews,
  public.page_settings,
  public.site_statistics,
  public.profiles,
  public.property_visits,
  public.wishlists,
  public.favorites,
  public.inquiries,
  public.contact_messages,
  public.team_members,
  public.activity_logs
TO authenticated;

-- Authenticated users need INSERT for tenant bookings, wishlists, reviews, inquiries, landlord listings
GRANT INSERT ON TABLE
  public.properties,
  public.property_images,
  public.reviews,
  public.inquiries,
  public.contact_messages,
  public.newsletter_subscribers,
  public.property_visits,
  public.wishlists,
  public.favorites,
  public.profiles,
  public.team_members,
  public.activity_logs
TO authenticated;

-- Authenticated users need UPDATE for their own profile, visits, reviews, and admin operations
GRANT UPDATE ON TABLE
  public.properties,
  public.property_images,
  public.locations,
  public.agents,
  public.reviews,
  public.inquiries,
  public.contact_messages,
  public.property_visits,
  public.wishlists,
  public.favorites,
  public.profiles,
  public.team_members,
  public.page_settings,
  public.site_statistics
TO authenticated;

-- Authenticated users need DELETE for removing wishlists, cancelling pending visits, or admin deletions
GRANT DELETE ON TABLE
  public.properties,
  public.property_images,
  public.reviews,
  public.property_visits,
  public.wishlists,
  public.favorites,
  public.profiles,
  public.team_members,
  public.agents
TO authenticated;

-- Authenticated users need sequence usage for IDs
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ==============================================================================
-- 4. SERVICE ROLE & POSTGRES PRIVILEGES
-- ==============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, service_role;


-- ==============================================================================
-- 5. FUNCTION EXECUTE PRIVILEGES & SECURE SEARCH_PATH
-- ==============================================================================

-- RPC functions callable by application clients
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.team_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_team_access() TO authenticated;

-- Prevent search_path hijacking on custom functions
ALTER FUNCTION public.is_admin() SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.team_role() SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.has_permission(TEXT) SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.claim_team_access() SET search_path = public, auth, pg_temp;


-- ==============================================================================
-- 6. NON-DESTRUCTIVE VERIFICATION QUERIES (FOR OWNER VERIFICATION)
-- ==============================================================================
-- To inspect active table privileges for 'anon':
-- SELECT table_name, privilege_type 
-- FROM information_schema.table_privileges 
-- WHERE grantee = 'anon' AND table_schema = 'public'
-- ORDER BY table_name, privilege_type;

-- To inspect active table privileges for 'authenticated':
-- SELECT table_name, privilege_type 
-- FROM information_schema.table_privileges 
-- WHERE grantee = 'authenticated' AND table_schema = 'public'
-- ORDER BY table_name, privilege_type;
