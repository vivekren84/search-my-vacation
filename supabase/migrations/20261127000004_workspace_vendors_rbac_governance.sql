-- Migration: 20261127000004_workspace_vendors_rbac_governance.sql
-- Release 1.5.2: Role-Based Governance for Vetted Vendors Directory
--
-- Governance Rules:
-- 1. SELECT (View): ALL staff (super_admin, administrator, privilege_user, desk_user)
-- 2. INSERT (Add): super_admin, administrator, privilege_user (Blocked for desk_user)
-- 3. UPDATE (Edit): super_admin, administrator, privilege_user (Blocked for desk_user)
-- 4. DELETE (Delete): Restricted strictly to super_admin (Blocked for administrator, privilege_user, desk_user)

-- Drop legacy broad policy
DROP POLICY IF EXISTS workspace_vendors_staff_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_staff_all ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_select_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_insert_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_update_policy ON public.workspace_vendors;
DROP POLICY IF EXISTS workspace_vendors_delete_policy ON public.workspace_vendors;

-- 1. SELECT Policy (All authenticated staff & service role can view all vendors)
CREATE POLICY workspace_vendors_select_policy ON public.workspace_vendors
  FOR SELECT TO authenticated, service_role
  USING (true);

-- 2. INSERT Policy (super_admin, administrator, privilege_user only)
CREATE POLICY workspace_vendors_insert_policy ON public.workspace_vendors
  FOR INSERT TO authenticated, service_role
  WITH CHECK (
    current_setting('request.jwt.claim.role', true) = 'service_role'
    OR auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM public.workspace_users 
      WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'administrator', 'privilege_user')
    )
  );

-- 3. UPDATE Policy (super_admin, administrator, privilege_user only)
CREATE POLICY workspace_vendors_update_policy ON public.workspace_vendors
  FOR UPDATE TO authenticated, service_role
  USING (
    current_setting('request.jwt.claim.role', true) = 'service_role'
    OR auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM public.workspace_users 
      WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'administrator', 'privilege_user')
    )
  )
  WITH CHECK (
    current_setting('request.jwt.claim.role', true) = 'service_role'
    OR auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM public.workspace_users 
      WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'administrator', 'privilege_user')
    )
  );

-- 4. DELETE Policy (super_admin only)
CREATE POLICY workspace_vendors_delete_policy ON public.workspace_vendors
  FOR DELETE TO authenticated, service_role
  USING (
    current_setting('request.jwt.claim.role', true) = 'service_role'
    OR auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM public.workspace_users 
      WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    )
  );

-- 5. Trigger-Level Governance Lock for Hard Deletes
CREATE OR REPLACE FUNCTION public.fn_enforce_vendor_governance_locks()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
  v_auth_role TEXT;
BEGIN
  v_auth_role := current_setting('request.jwt.claim.role', true);
  IF v_auth_role = 'service_role' OR auth.uid() IS NULL THEN
    RETURN OLD;
  END IF;

  SELECT role INTO v_caller_role FROM public.workspace_users WHERE user_id = auth.uid();
  IF v_caller_role IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Governance lock: Vendor records can only be permanently deleted by the Super Admin.';
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_vendor_governance_locks ON public.workspace_vendors;
CREATE TRIGGER trg_enforce_vendor_governance_locks
  BEFORE DELETE ON public.workspace_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_enforce_vendor_governance_locks();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
