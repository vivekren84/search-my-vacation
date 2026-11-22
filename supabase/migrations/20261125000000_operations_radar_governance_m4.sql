-- Migration: 20261125000000_operations_radar_governance_m4.sql
-- Release 1.5 Milestone 4: Operations Command Center, Concierge Intelligence Radar & Governance
-- Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
-- Chartered Items: US-011 (Trip Pipeline), US-012 (Voucher Vault), US-013 (SLA Alerts), US-018 (Concierge Radar),
-- US-014 (Vendor Directory), US-015 (Financial Summary), US-016 (Document Masking)
-- Invariant: BOUND-01 Public Decoupling (Strict internal workspace schema under workspace_*).

-- 1. Create public.workspace_trip_pipeline (US-011)
CREATE TABLE IF NOT EXISTS public.workspace_trip_pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  assigned_advisor_id uuid REFERENCES public.workspace_users(user_id),
  stage text NOT NULL CHECK (stage IN ('inquiry', 'proposal_sent', 'deposit_paid', 'vendors_confirmed', 'in_transit', 'post_trip')) DEFAULT 'inquiry',
  trip_title text NOT NULL,
  departure_date date,
  return_date date,
  total_value numeric(12, 2) NOT NULL DEFAULT 0.00,
  deposit_collected numeric(12, 2) NOT NULL DEFAULT 0.00,
  balance_due numeric(12, 2) NOT NULL DEFAULT 0.00,
  deposit_due_date date,
  is_vip boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_trip_pipeline
  ADD COLUMN IF NOT EXISTS itinerary_id uuid REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS assigned_advisor_id uuid REFERENCES public.workspace_users(user_id),
  ADD COLUMN IF NOT EXISTS stage text DEFAULT 'inquiry',
  ADD COLUMN IF NOT EXISTS trip_title text,
  ADD COLUMN IF NOT EXISTS departure_date date,
  ADD COLUMN IF NOT EXISTS return_date date,
  ADD COLUMN IF NOT EXISTS total_value numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS deposit_collected numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS deposit_due_date date,
  ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_workspace_trip_pipeline_stage
  ON public.workspace_trip_pipeline (stage);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_pipeline_advisor
  ON public.workspace_trip_pipeline (assigned_advisor_id);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_pipeline_departure
  ON public.workspace_trip_pipeline (departure_date);

-- 2. Create public.workspace_segment_vouchers (US-012)
CREATE TABLE IF NOT EXISTS public.workspace_segment_vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id uuid NOT NULL REFERENCES public.workspace_itinerary_segments(id) ON DELETE CASCADE,
  itinerary_id uuid NOT NULL REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  booking_reference text NOT NULL,
  vendor_contact_name text NOT NULL,
  emergency_phone_e164 text NOT NULL,
  voucher_status text NOT NULL CHECK (voucher_status IN ('pending', 'confirmed', 'issued', 'cancelled')) DEFAULT 'pending',
  attachments jsonb DEFAULT '[]'::jsonb,
  notes text,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_segment_vouchers_segment
  ON public.workspace_segment_vouchers (segment_id);

CREATE INDEX IF NOT EXISTS idx_workspace_segment_vouchers_itinerary
  ON public.workspace_segment_vouchers (itinerary_id);

-- 3. Create public.workspace_operational_alerts (US-013)
CREATE TABLE IF NOT EXISTS public.workspace_operational_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.workspace_trip_pipeline(id) ON DELETE CASCADE,
  itinerary_id uuid REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('unconfirmed_vendor_72h', 'overdue_deposit', 'missing_document_14d', 'ground_advisory', 'flight_delay')),
  severity text NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message text NOT NULL,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.workspace_users(user_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_operational_alerts_severity
  ON public.workspace_operational_alerts (severity, is_resolved);

-- 4. Create public.workspace_vendors (US-014)
CREATE TABLE IF NOT EXISTS public.workspace_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  destination text NOT NULL,
  category text NOT NULL CHECK (category IN ('hospitality', 'aviation', 'yachts', 'guides', 'fleet', 'dining', 'experiences')),
  tier text NOT NULL CHECK (tier IN ('signature_palace', 'heritage_sanctuary', 'executive_charter', 'curated_artisan')),
  contact_person text,
  contact_email text,
  contact_phone_e164 text,
  contracted_net_rate_terms text,
  cancellation_policy text,
  payment_terms text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_trip_pipeline
  ADD COLUMN IF NOT EXISTS itinerary_id uuid REFERENCES public.workspace_itineraries(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS assigned_advisor_id uuid REFERENCES public.workspace_users(user_id),
  ADD COLUMN IF NOT EXISTS stage text DEFAULT 'inquiry',
  ADD COLUMN IF NOT EXISTS trip_title text,
  ADD COLUMN IF NOT EXISTS departure_date date,
  ADD COLUMN IF NOT EXISTS return_date date,
  ADD COLUMN IF NOT EXISTS total_value numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS deposit_collected numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS deposit_due_date date,
  ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.workspace_vendors
  ADD COLUMN IF NOT EXISTS vendor_name text,
  ADD COLUMN IF NOT EXISTS destination text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS tier text,
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone_e164 text,
  ADD COLUMN IF NOT EXISTS contracted_net_rate_terms text,
  ADD COLUMN IF NOT EXISTS cancellation_policy text,
  ADD COLUMN IF NOT EXISTS payment_terms text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_destination
  ON public.workspace_vendors (destination);

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_category
  ON public.workspace_vendors (category);

-- 5. Create public.workspace_client_documents (US-016)
CREATE TABLE IF NOT EXISTS public.workspace_client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('passport', 'visa', 'id_card', 'insurance')),
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_size_bytes integer,
  masked_identifier text NOT NULL, -- e.g. 'XXXX-8421'
  encrypted_key_ref text NOT NULL,
  uploaded_by uuid REFERENCES public.workspace_users(user_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_client_documents_client
  ON public.workspace_client_documents (client_id);

-- 6. Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.workspace_trip_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_segment_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_operational_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_client_documents ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from anon and public (BOUND-01)
REVOKE ALL ON public.workspace_trip_pipeline FROM anon, public;
REVOKE ALL ON public.workspace_segment_vouchers FROM anon, public;
REVOKE ALL ON public.workspace_operational_alerts FROM anon, public;
REVOKE ALL ON public.workspace_vendors FROM anon, public;
REVOKE ALL ON public.workspace_client_documents FROM anon, public;

-- Grant permissions to authenticated staff & service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_trip_pipeline TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_segment_vouchers TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_operational_alerts TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_vendors TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_client_documents TO authenticated, service_role;

-- Policies for internal staff
DROP POLICY IF EXISTS workspace_trip_pipeline_staff_all ON public.workspace_trip_pipeline;
CREATE POLICY workspace_trip_pipeline_staff_all ON public.workspace_trip_pipeline FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS workspace_segment_vouchers_staff_all ON public.workspace_segment_vouchers;
CREATE POLICY workspace_segment_vouchers_staff_all ON public.workspace_segment_vouchers FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS workspace_operational_alerts_staff_all ON public.workspace_operational_alerts;
CREATE POLICY workspace_operational_alerts_staff_all ON public.workspace_operational_alerts FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS workspace_vendors_staff_all ON public.workspace_vendors;
CREATE POLICY workspace_vendors_staff_all ON public.workspace_vendors FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS workspace_client_documents_staff_all ON public.workspace_client_documents;
CREATE POLICY workspace_client_documents_staff_all ON public.workspace_client_documents FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
