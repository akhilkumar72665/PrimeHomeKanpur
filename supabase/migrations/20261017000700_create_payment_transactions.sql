-- Migration: 20261017000700_create_payment_transactions.sql
-- Description: Task 13 - Create payment_transactions table & RLS policies for admin & user audits

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

-- RLS: User can view their own transactions; Admin can view all
CREATE POLICY "payments_select_owner_or_admin"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) 
    OR (select public.is_admin()) = true
  );

-- RLS: Admin or service role can manage payment transactions
CREATE POLICY "payments_manage_admin"
  ON public.payment_transactions
  FOR ALL
  TO authenticated
  USING ((select public.is_admin()) = true)
  WITH CHECK ((select public.is_admin()) = true);

-- Least privilege table permissions
REVOKE ALL ON public.payment_transactions FROM anon, public;
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
