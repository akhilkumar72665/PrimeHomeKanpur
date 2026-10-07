-- ============================================================================
-- FIX ACTIVITY LOGS PERMISSIONS & RLS
-- ============================================================================

-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for fast search & sorting
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.activity_logs(actor_id);

-- 3. Grant PostgreSQL table privileges to Supabase roles
GRANT ALL ON TABLE public.activity_logs TO postgres, service_role;
GRANT SELECT, INSERT ON TABLE public.activity_logs TO authenticated;
GRANT SELECT ON TABLE public.activity_logs TO anon;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent duplicate conflicts
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Authorized admins can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Authorized users can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins or system can insert logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Authorized users can insert activity logs" ON public.activity_logs;

-- 6. Re-create robust Select Policy
CREATE POLICY "Authorized users can view activity logs" ON public.activity_logs
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR public.is_admin()
    OR public.has_permission('activity_logs.view')
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

-- 7. Re-create robust Insert Policy
CREATE POLICY "Authorized users can insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
    OR auth.uid() IS NOT NULL
  );
