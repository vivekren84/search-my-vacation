-- Migration: 20261129000000_release_1_5_3_m2_itinerary_trip_link.sql
-- Release 1.5.3 Milestone 2: Link workspace_itineraries directly to workspace_trips (DDSMV/VDSMV)
-- Non-Negotiable Guardrails: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

ALTER TABLE public.workspace_itineraries
  ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES public.workspace_trips(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_itineraries_trip
  ON public.workspace_itineraries (trip_id);

NOTIFY pgrst, 'reload schema';
