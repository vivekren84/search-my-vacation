-- Rollback Migration: 20261125000000_operations_radar_governance_m4.rollback.sql
-- Release 1.5 Milestone 4 Rollback

DROP TABLE IF EXISTS public.workspace_client_documents CASCADE;
DROP TABLE IF EXISTS public.workspace_vendors CASCADE;
DROP TABLE IF EXISTS public.workspace_operational_alerts CASCADE;
DROP TABLE IF EXISTS public.workspace_segment_vouchers CASCADE;
DROP TABLE IF EXISTS public.workspace_trip_pipeline CASCADE;
