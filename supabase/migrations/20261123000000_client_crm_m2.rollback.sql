-- Rollback Migration: 20261123000000_client_crm_m2.rollback.sql
-- Release 1.5 Milestone 2: Rollback script for Master Client CRM, Preference Tags & Activities

-- 1. Drop client activities, tags, companions
DROP TABLE IF EXISTS public.workspace_client_activities CASCADE;
DROP TABLE IF EXISTS public.workspace_client_tags CASCADE;
DROP TABLE IF EXISTS public.workspace_client_companions CASCADE;

-- 2. Drop indexes and columns from workspace_travellers
DROP INDEX IF EXISTS idx_workspace_travellers_email_lower;
DROP INDEX IF EXISTS idx_workspace_travellers_phone_e164;

ALTER TABLE public.workspace_travellers
  DROP CONSTRAINT IF EXISTS workspace_travellers_lead_source_check;

ALTER TABLE public.workspace_travellers
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS is_vip,
  DROP COLUMN IF EXISTS lead_source,
  DROP COLUMN IF EXISTS dob,
  DROP COLUMN IF EXISTS nationality,
  DROP COLUMN IF EXISTS phone_e164;
