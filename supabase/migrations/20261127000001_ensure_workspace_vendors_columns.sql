-- Migration: 20261127000001_ensure_workspace_vendors_columns.sql
-- Release 1.5.2: Ensure all vendor columns exist on pre-existing workspace_vendors table

CREATE SEQUENCE IF NOT EXISTS public.vendor_code_seq START WITH 100 INCREMENT BY 1;

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

-- Ensure sequence is default on vendor_code
ALTER TABLE public.workspace_vendors 
  ALTER COLUMN vendor_code SET DEFAULT ('VND-' || lpad(nextval('public.vendor_code_seq')::text, 4, '0'));

-- Allow service_role imports by making created_by_user_id nullable or defaulting to Super Admin
ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id DROP NOT NULL;
ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id SET DEFAULT '89782ecc-b5f9-4e44-b9e5-db3e310a933e'::uuid;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
