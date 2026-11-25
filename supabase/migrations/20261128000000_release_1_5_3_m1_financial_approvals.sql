-- Migration: 20261128000000_release_1_5_3_m1_financial_approvals.sql
-- Release 1.5.3 Milestone 1: Trip Financial Approval Queue (Single-Concurrence) & Privilege Role Alignment
-- Non-Negotiable Guardrails: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

-- 1. Create public.workspace_trip_financial_approvals for desk_user financial proposals
CREATE TABLE IF NOT EXISTS public.workspace_trip_financial_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  deal_reference_id TEXT NOT NULL,
  requested_by_user_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  requested_by_email TEXT NOT NULL,
  requested_by_name TEXT,
  proposed_quote_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  proposed_actual_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  proposed_pre_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  proposed_gst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  proposed_profit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  previous_quote_price NUMERIC(12,2) DEFAULT 0.00,
  previous_actual_cost NUMERIC(12,2) DEFAULT 0.00,
  previous_profit NUMERIC(12,2) DEFAULT 0.00,
  justification TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'superseded')) DEFAULT 'pending',
  reviewed_by_user_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  reviewed_by_email TEXT,
  reviewed_by_name TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_fin_approvals_status
  ON public.workspace_trip_financial_approvals (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_fin_approvals_trip
  ON public.workspace_trip_financial_approvals (trip_id, status);

-- 2. Enable RLS & Enforce BOUND-01 Public Decoupling
ALTER TABLE public.workspace_trip_financial_approvals ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.workspace_trip_financial_approvals FROM anon, public;
GRANT ALL ON public.workspace_trip_financial_approvals TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_trip_financial_approvals_staff_policy
  ON public.workspace_trip_financial_approvals;
CREATE POLICY workspace_trip_financial_approvals_staff_policy
  ON public.workspace_trip_financial_approvals
  FOR ALL TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- 3. Align Anand's role to privilege_user (per PO Financial RBAC confirmation)
UPDATE public.workspace_users
SET role = 'privilege_user', updated_at = now()
WHERE display_name ILIKE '%Anand%'
  AND role = 'desk_user';

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
