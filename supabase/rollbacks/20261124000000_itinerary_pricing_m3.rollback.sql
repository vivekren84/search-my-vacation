-- Rollback Migration: 20261124000000_itinerary_pricing_m3.rollback.sql
-- Release 1.5 Milestone 3 Rollback
-- Drops tables created for Milestone 3

DROP TABLE IF EXISTS public.workspace_proposal_versions CASCADE;
DROP TABLE IF EXISTS public.workspace_margin_overrides CASCADE;
DROP TABLE IF EXISTS public.workspace_itinerary_segments CASCADE;
DROP TABLE IF EXISTS public.workspace_itinerary_days CASCADE;
DROP TABLE IF EXISTS public.workspace_itineraries CASCADE;
