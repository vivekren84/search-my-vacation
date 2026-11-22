-- Migration: 20261124000000_itinerary_pricing_m3.sql
-- Release 1.5 Milestone 3: Bespoke Itinerary Builder, Dynamic Pricing Engine & Margin Governance
-- Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
-- Chartered Items: US-007 (Itinerary Builder), US-008 (Pricing Engine), US-009 (Margin Override), US-010 (Proposal Export)
-- Invariant: BOUND-01 Public Customer Decoupling (Strict internal workspace schema under workspace_*).

-- 1. Create public.workspace_itineraries
CREATE TABLE IF NOT EXISTS public.workspace_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES public.workspace_journeys(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.workspace_users(id) ON DELETE SET NULL,
  title text NOT NULL,
  circuit_summary text,
  start_date date,
  end_date date,
  duration_days integer NOT NULL DEFAULT 1,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL CHECK (status IN ('draft', 'proposal_sent', 'confirmed', 'archived')) DEFAULT 'draft',
  current_version text NOT NULL DEFAULT 'v1.0',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_itineraries_client
  ON public.workspace_itineraries (client_id);

CREATE INDEX IF NOT EXISTS idx_workspace_itineraries_status
  ON public.workspace_itineraries (status);

-- 2. Create public.workspace_itinerary_days
CREATE TABLE IF NOT EXISTS public.workspace_itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text NOT NULL,
  destination text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_itinerary_day UNIQUE (itinerary_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_workspace_itinerary_days_itinerary
  ON public.workspace_itinerary_days (itinerary_id, day_number);

-- 3. Create public.workspace_itinerary_segments
CREATE TABLE IF NOT EXISTS public.workspace_itinerary_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid NOT NULL REFERENCES public.workspace_itinerary_days(id) ON DELETE CASCADE,
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  segment_type text NOT NULL CHECK (segment_type IN ('hotel', 'transfer', 'activity', 'guide', 'dining', 'aviation')),
  title text NOT NULL,
  description text,
  vendor_name text,
  vendor_contact text,
  net_cost numeric(12, 2) NOT NULL DEFAULT 0.00,
  markup_percent numeric(5, 2) NOT NULL DEFAULT 15.00,
  markup_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
  tax_percent numeric(5, 2) NOT NULL DEFAULT 18.00,
  tax_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
  selling_price numeric(12, 2) NOT NULL DEFAULT 0.00,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_itinerary_segments_day
  ON public.workspace_itinerary_segments (day_id, order_index);

CREATE INDEX IF NOT EXISTS idx_workspace_itinerary_segments_itinerary
  ON public.workspace_itinerary_segments (itinerary_id);

-- 4. Create public.workspace_margin_overrides
CREATE TABLE IF NOT EXISTS public.workspace_margin_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES public.workspace_users(id),
  target_selling_price numeric(12, 2) NOT NULL,
  net_cost numeric(12, 2) NOT NULL,
  proposed_margin_percent numeric(5, 2) NOT NULL,
  floor_margin_percent numeric(5, 2) NOT NULL DEFAULT 12.00,
  justification text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.workspace_users(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_margin_overrides_itinerary
  ON public.workspace_margin_overrides (itinerary_id);

CREATE INDEX IF NOT EXISTS idx_workspace_margin_overrides_status
  ON public.workspace_margin_overrides (status);

-- 5. Create public.workspace_proposal_versions
CREATE TABLE IF NOT EXISTS public.workspace_proposal_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  version_label text NOT NULL,
  gross_selling_price numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  client_snapshot jsonb NOT NULL,
  is_override_approved boolean NOT NULL DEFAULT false,
  exported_by uuid NOT NULL REFERENCES public.workspace_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_itinerary_version UNIQUE (itinerary_id, version_label)
);

CREATE INDEX IF NOT EXISTS idx_workspace_proposal_versions_itinerary
  ON public.workspace_proposal_versions (itinerary_id, version_label);

-- 6. Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.workspace_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_itinerary_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_margin_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_proposal_versions ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from anon and public (BOUND-01)
REVOKE ALL ON public.workspace_itineraries FROM anon, public;
REVOKE ALL ON public.workspace_itinerary_days FROM anon, public;
REVOKE ALL ON public.workspace_itinerary_segments FROM anon, public;
REVOKE ALL ON public.workspace_margin_overrides FROM anon, public;
REVOKE ALL ON public.workspace_proposal_versions FROM anon, public;

-- Grant permissions to authenticated staff & service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_itineraries TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_itinerary_days TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_itinerary_segments TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_margin_overrides TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_proposal_versions TO authenticated, service_role;

-- RLS Policies
CREATE POLICY workspace_itineraries_staff_all
  ON public.workspace_itineraries
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY workspace_itinerary_days_staff_all
  ON public.workspace_itinerary_days
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY workspace_itinerary_segments_staff_all
  ON public.workspace_itinerary_segments
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY workspace_margin_overrides_staff_all
  ON public.workspace_margin_overrides
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY workspace_proposal_versions_staff_all
  ON public.workspace_proposal_versions
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);
