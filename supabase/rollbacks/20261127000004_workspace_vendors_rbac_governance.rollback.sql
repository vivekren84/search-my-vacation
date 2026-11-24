-- Rollback: 20261127000004_workspace_vendors_rbac_governance.rollback.sql
DROP TRIGGER IF EXISTS trg_enforce_vendor_governance_locks ON public.workspace_vendors;
DROP FUNCTION IF EXISTS public.fn_enforce_vendor_governance_locks();

DROP POLICY IF EXISTS workspace_vendors_select_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_insert_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_update_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_delete_policy ON public.workspace_vendors;

CREATE POLICY workspace_vendors_staff_policy ON public.workspace_vendors
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
