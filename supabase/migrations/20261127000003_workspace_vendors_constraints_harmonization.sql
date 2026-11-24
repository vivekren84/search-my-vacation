-- Migration: 20261127000003_workspace_vendors_constraints_harmonization.sql
-- Release 1.5.2: Harmonize workspace_vendors check constraints and column defaults

-- 1. Drop strict vendor code check constraint and allow both VEN- and VND- formats
ALTER TABLE public.workspace_vendors DROP CONSTRAINT IF EXISTS workspace_vendors_vendor_code_format_check;
ALTER TABLE public.workspace_vendors ADD CONSTRAINT workspace_vendors_vendor_code_format_check 
  CHECK (vendor_code ~ '^(VEN|VND)-[0-9]{4,6}$');

-- 2. Ensure destinations_served is not strictly blocking imports
ALTER TABLE public.workspace_vendors 
  ALTER COLUMN destinations_served SET DEFAULT '{}'::text[];

DO $$
BEGIN
  ALTER TABLE public.workspace_vendors ALTER COLUMN destinations_served DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 3. Ensure sequence is updated to 5 digits (e.g. VND-00100)
ALTER TABLE public.workspace_vendors 
  ALTER COLUMN vendor_code SET DEFAULT ('VND-' || lpad(nextval('public.vendor_code_seq')::text, 5, '0'));

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
