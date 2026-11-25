-- Migration: 20261129000001_release_1_5_3_m2_proposal_versions_nullable.sql
-- Release 1.5.3 Milestone 2: Allow itinerary-direct white-label proposal snapshots in workspace_proposal_versions
-- (Drops legacy NOT NULL on proposal_id when exporting directly from workspace_itineraries)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workspace_proposal_versions'
      AND column_name = 'proposal_id'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.workspace_proposal_versions ALTER COLUMN proposal_id DROP NOT NULL;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
