-- Migration: 20261129000002_release_1_5_3_m2_proposal_versions_drop_legacy_not_null.sql
-- Release 1.5.3 Milestone 2: Drop legacy NOT NULL constraints (e.g. proposal_id, version_number)
-- on workspace_proposal_versions so itinerary-direct white-label exports succeed cleanly.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workspace_proposal_versions'
      AND is_nullable = 'NO'
      AND column_name NOT IN ('id', 'created_at', 'currency', 'is_override_approved')
  LOOP
    EXECUTE format('ALTER TABLE public.workspace_proposal_versions ALTER COLUMN %I DROP NOT NULL', r.column_name);
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
