-- Migration: 20261127000002_workspace_vendors_created_by_nullable.sql
-- Allow service_role imports by making created_by_user_id nullable or defaulting to Super Admin

ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id DROP NOT NULL;
ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id SET DEFAULT '89782ecc-b5f9-4e44-b9e5-db3e310a933e'::uuid;

NOTIFY pgrst, 'reload schema';
