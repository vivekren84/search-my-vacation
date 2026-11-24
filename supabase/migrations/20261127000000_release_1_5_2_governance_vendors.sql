-- Migration: 20261127000000_release_1_5_2_governance_vendors.sql
-- Release 1.5.2: Governance Trigger Fix, Staff Mobile Updates, and Workspace Vendors Architecture
-- Authored for Search My Vacation (SMV) — Super Admin Vivek Renganathan
-- Non-Negotiable Guardrails: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

-- 1. Governance Trigger Fix (Permit Service Role & Postgres Admin)
CREATE OR REPLACE FUNCTION public.fn_enforce_workspace_user_governance_locks()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
  v_auth_role TEXT;
BEGIN
  -- Service role and direct database operations are unrestricted
  v_auth_role := current_setting('request.jwt.claim.role', true);
  IF v_auth_role = 'service_role' OR auth.uid() IS NULL THEN
    NEW.updated_at := now();
    RETURN NEW;
  END IF;

  SELECT role INTO v_caller_role FROM public.workspace_users WHERE user_id = auth.uid();
  
  IF v_caller_role IS DISTINCT FROM 'super_admin' AND v_caller_role IS DISTINCT FROM 'administrator' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Governance lock: Role cannot be modified without Super Admin authorization.';
    END IF;
    IF NEW.registered_mobile IS DISTINCT FROM OLD.registered_mobile THEN
      RAISE EXCEPTION 'Governance lock: Registered mobile cannot be modified without Super Admin authorization.';
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Update Mobile Numbers for Dinesh & Keerthi
UPDATE public.workspace_users
SET registered_mobile = '+918925838542', updated_at = now()
WHERE display_name ILIKE '%Dinesh%' OR user_id IN ('720346ac-aab7-496f-b6e8-ecbb38316a94', 'a1d7bade-59fe-430b-bad6-364451a62be1');

UPDATE public.workspace_users
SET registered_mobile = '+918925838544', updated_at = now()
WHERE display_name ILIKE '%Keerthi%' OR user_id IN ('2010d027-8ea5-4390-9cd5-3c8d8b69f9cf', 'c351b2e1-3d89-4d20-9b39-aaa86f8eac11');

-- 3. Sequence for Vendor Code (VND-0100 onward)
CREATE SEQUENCE IF NOT EXISTS public.vendor_code_seq START WITH 100 INCREMENT BY 1;

-- 4. Vendor Directory Table: public.workspace_vendors
CREATE TABLE IF NOT EXISTS public.workspace_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_code TEXT UNIQUE NOT NULL DEFAULT ('VND-' || lpad(nextval('public.vendor_code_seq')::text, 4, '0')),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('property', 'cab', 'dmc', 'agency', 'activity', 'other')),
  destination TEXT,
  region TEXT,
  star_rating TEXT,
  poc_name TEXT,
  poc_mobile TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  rate_card_link TEXT,
  b2b_rates TEXT,
  comments TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Ensure all columns exist if table was previously provisioned with partial columns
ALTER TABLE public.workspace_vendors
  ADD COLUMN IF NOT EXISTS vendor_code TEXT DEFAULT ('VND-' || lpad(nextval('public.vendor_code_seq')::text, 4, '0')),
  ADD COLUMN IF NOT EXISTS star_rating TEXT,
  ADD COLUMN IF NOT EXISTS poc_name TEXT,
  ADD COLUMN IF NOT EXISTS poc_mobile TEXT,
  ADD COLUMN IF NOT EXISTS office_phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS rate_card_link TEXT,
  ADD COLUMN IF NOT EXISTS b2b_rates TEXT,
  ADD COLUMN IF NOT EXISTS comments TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Ensure sequence is applied to vendor_code if it was null
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_vendors' AND column_name = 'vendor_code') THEN
    ALTER TABLE public.workspace_vendors ALTER COLUMN vendor_code SET DEFAULT ('VND-' || lpad(nextval('public.vendor_code_seq')::text, 4, '0'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_category 
  ON public.workspace_vendors (category);

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_destination 
  ON public.workspace_vendors (destination);

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_name 
  ON public.workspace_vendors (name);

-- 5. Row Level Security for workspace_vendors
ALTER TABLE public.workspace_vendors ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.workspace_vendors FROM anon, public;
GRANT ALL ON public.workspace_vendors TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_vendors_staff_policy ON public.workspace_vendors;
CREATE POLICY workspace_vendors_staff_policy ON public.workspace_vendors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
