-- Rollback: 20261127000003_workspace_vendors_constraints_harmonization.rollback.sql
ALTER TABLE public.workspace_vendors DROP CONSTRAINT IF EXISTS workspace_vendors_vendor_code_format_check;
ALTER TABLE public.workspace_vendors ADD CONSTRAINT workspace_vendors_vendor_code_format_check 
  CHECK (vendor_code ~ '^VEN-[0-9]{5}$');

NOTIFY pgrst, 'reload schema';
