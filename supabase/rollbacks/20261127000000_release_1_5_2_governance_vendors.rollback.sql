-- Rollback: 20261127000000_release_1_5_2_governance_vendors.rollback.sql
-- Reverses Release 1.5.2 vendor table creation and governance trigger updates

DROP TABLE IF EXISTS public.workspace_vendors CASCADE;
DROP SEQUENCE IF EXISTS public.vendor_code_seq;
