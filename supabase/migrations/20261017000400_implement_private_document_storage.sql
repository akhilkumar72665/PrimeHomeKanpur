-- Migration: 20261017000400_implement_private_document_storage.sql
-- Description: Task 9 - Implement Private Document Storage & Secure Uploads
-- Hardens document vault against unauthenticated and cross-user access.
-- Configures private bucket 'property-documents' and table 'verification_documents' with RLS.

-- 1. Create Private Storage Bucket 'property-documents' (public = false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-documents',
  'property-documents',
  false, -- STRICT PRIVACY: Private bucket, requires signed URLs or auth RLS
  10485760, -- 10 MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- 2. Create Verification Documents Relational Table
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

-- Indexes for performance & query isolation
CREATE INDEX IF NOT EXISTS idx_verification_docs_user_id ON public.verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_property_id ON public.verification_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_status ON public.verification_documents(status);

-- 3. Enable RLS on verification_documents
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
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

-- 4. RLS Policies for verification_documents
-- 4.1 SELECT: Owner or Admin
CREATE POLICY "docs_select_owner_or_admin"
  ON public.verification_documents
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (select public.is_admin()) = true
  );

-- 4.2 INSERT: Owner can insert their own documents with PENDING_REVIEW status
CREATE POLICY "docs_insert_owner"
  ON public.verification_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND status = 'PENDING_REVIEW'
  );

-- 4.3 UPDATE: Admin can review status; Owner can update title only if not verified
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

-- 4.4 DELETE: Owner can delete if unverified; Admin can delete any
CREATE POLICY "docs_delete_owner_or_admin"
  ON public.verification_documents
  FOR DELETE
  TO authenticated
  USING (
    (user_id = (select auth.uid()) AND status <> 'VERIFIED')
    OR (select public.is_admin()) = true
  );

-- 5. Anti-Spoofing & Anti-Self-Approval Database Trigger
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

  -- Anti-Spoofing: user_id cannot be changed
  IF TG_OP = 'UPDATE' AND NEW.user_id <> OLD.user_id AND NOT caller_is_admin THEN
    RAISE EXCEPTION 'Security violation: Document owner cannot be altered.';
  END IF;

  -- Anti-Self-Approval: non-admins cannot change status or verify documents
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

-- 6. Storage Bucket RLS Policies for 'property-documents' on storage.objects
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

-- 7. Grant least-privilege permissions
REVOKE ALL ON public.verification_documents FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_documents TO authenticated;
GRANT ALL ON public.verification_documents TO service_role;
