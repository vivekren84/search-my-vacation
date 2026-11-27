-- Migration: 20261130000001_backfill_international_trip_scope.sql
-- Backfill trip_scope = 'International' for historical international journeys
-- Non-Negotiable Guardrails: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

UPDATE public.workspace_trips
SET trip_scope = 'International', updated_at = now()
WHERE deal_reference_id IN (
  'DDSMV-26-118', -- Sri Lanka (Production)
  'DDSMV-25-080', -- Hanoi (Production)
  'DDSMV-26-083', -- Vietnam (Pre-Prod)
  'DDSMV-27-126'  -- Singapore (Pre-Prod)
)
AND trip_scope IS DISTINCT FROM 'International';

NOTIFY pgrst, 'reload schema';
