-- Migration: 20261126000000_release_1_5_1_customer_trips_crm.sql
-- Release 1.5.1: Normalized Customer Master (CUST-XXXXX), Deal Tracking (DDSMV/VDSMV), Staff Atelier Profile & Storage
-- Authored for Vivek Renganathan (Super Admin / Owner)
-- Non-Negotiable Invariants: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

-- 1. Purge QA Sandbox Travellers & Test Journeys
DELETE FROM public.workspace_journey_operational_contacts;
DELETE FROM public.workspace_journey_documents;
DELETE FROM public.workspace_journey_vendor_bookings;
DELETE FROM public.workspace_journey_readiness_items;
DELETE FROM public.workspace_journey_activities;
DELETE FROM public.workspace_journey_change_records;
DELETE FROM public.workspace_client_activities;
DELETE FROM public.workspace_itineraries;
UPDATE public.workspace_journeys SET supersedes_journey_id = NULL;
DELETE FROM public.workspace_journeys;

DELETE FROM public.workspace_planning_activities;
DELETE FROM public.workspace_vendor_quotations;
DELETE FROM public.workspace_proposals;
DELETE FROM public.workspace_journey_planning_records;

DELETE FROM public.workspace_client_companions;
DELETE FROM public.workspace_client_tags;
DELETE FROM public.workspace_client_documents;
DELETE FROM public.workspace_trip_pipeline;
DELETE FROM public.workspace_travellers;

-- 2. Customer Sequence starting at 100 (for CUST-00100)
CREATE SEQUENCE IF NOT EXISTS public.customer_code_seq START WITH 100 INCREMENT BY 1;

-- 3. Customer Master Table: public.workspace_customers
CREATE TABLE IF NOT EXISTS public.workspace_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code TEXT UNIQUE NOT NULL DEFAULT ('CUST-' || lpad(nextval('public.customer_code_seq')::text, 5, '0')),
  primary_name TEXT NOT NULL,
  primary_mobile TEXT,
  secondary_mobile TEXT,
  primary_email TEXT,
  zoho_synced BOOLEAN NOT NULL DEFAULT false,
  needs_contact_enrichment BOOLEAN NOT NULL DEFAULT false,
  created_by_user_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Partial Unique Index on primary_mobile (allows multiple NULLs for historical records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_customers_primary_mobile 
  ON public.workspace_customers (primary_mobile) 
  WHERE primary_mobile IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_customers_secondary_mobile 
  ON public.workspace_customers (secondary_mobile) 
  WHERE secondary_mobile IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_customers_email_lower 
  ON public.workspace_customers (lower(primary_email)) 
  WHERE primary_email IS NOT NULL;

-- 4. Deal Concurrency Sequence Counter: public.deal_id_sequences
CREATE TABLE IF NOT EXISTS public.deal_id_sequences (
  deal_channel TEXT NOT NULL CHECK (deal_channel IN ('DIRECT', 'VENDOR')),
  year INTEGER NOT NULL,
  last_val INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (deal_channel, year)
);

-- 5. Trip / Deal Records Table: public.workspace_trips
CREATE TABLE IF NOT EXISTS public.workspace_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.workspace_customers(id) ON DELETE CASCADE,
  deal_reference_id TEXT UNIQUE NOT NULL,
  deal_channel TEXT NOT NULL CHECK (deal_channel IN ('DIRECT', 'VENDOR')),
  lead_owner_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  travel_year INTEGER NOT NULL,
  travel_month TEXT,
  duration_label TEXT,
  nights INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  booking_date DATE,
  travel_party_type TEXT CHECK (travel_party_type IN ('Solo', 'Family', 'Group', 'Corporate', 'Other')) DEFAULT 'Family',
  pax_adults INTEGER NOT NULL DEFAULT 1,
  pax_children INTEGER NOT NULL DEFAULT 0,
  deal_stage TEXT NOT NULL CHECK (deal_stage IN ('Enquiry', 'In Progress', 'Booked/Won', 'Lost', 'On Hold')) DEFAULT 'Enquiry',
  payment_status TEXT NOT NULL CHECK (payment_status IN ('To Start', 'In Progress', 'Won', 'Lost', 'On Hold')) DEFAULT 'To Start',
  trip_status TEXT NOT NULL CHECK (trip_status IN ('To Start', 'In Progress', 'Complete', 'Lost', 'On Hold')) DEFAULT 'To Start',
  booked_properties TEXT,
  booked_transport TEXT,
  notes TEXT,
  -- Financial columns (NUMERIC 12,2)
  actual_cost NUMERIC(12,2) DEFAULT 0.00,
  quote_price NUMERIC(12,2) DEFAULT 0.00,
  pre_tax_amount NUMERIC(12,2) DEFAULT 0.00,
  gst_amount NUMERIC(12,2) DEFAULT 0.00,
  profit NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_workspace_trips_customer 
  ON public.workspace_trips (customer_id);

CREATE INDEX IF NOT EXISTS idx_workspace_trips_reference 
  ON public.workspace_trips (deal_reference_id);

CREATE INDEX IF NOT EXISTS idx_workspace_trips_owner 
  ON public.workspace_trips (lead_owner_id);

CREATE INDEX IF NOT EXISTS idx_workspace_trips_stage 
  ON public.workspace_trips (deal_stage, trip_status);

-- 6. Atomic Deal Reference Generator Trigger Function
CREATE OR REPLACE FUNCTION public.fn_generate_deal_reference_id()
RETURNS TRIGGER AS $$
DECLARE
  v_year INTEGER;
  v_short_year TEXT;
  v_next_val INTEGER;
  v_prefix TEXT;
BEGIN
  v_year := COALESCE(NEW.travel_year, EXTRACT(YEAR FROM COALESCE(NEW.booking_date, now()))::INTEGER);
  v_short_year := lpad((v_year % 100)::TEXT, 2, '0');
  v_prefix := CASE WHEN NEW.deal_channel = 'VENDOR' THEN 'VDSMV' ELSE 'DDSMV' END;

  -- Row-level lock on sequence counter for channel and year
  INSERT INTO public.deal_id_sequences (deal_channel, year, last_val)
  VALUES (NEW.deal_channel, v_year, 1)
  ON CONFLICT (deal_channel, year)
  DO UPDATE SET last_val = public.deal_id_sequences.last_val + 1
  RETURNING last_val INTO v_next_val;

  NEW.deal_reference_id := v_prefix || '-' || v_short_year || '-' || lpad(v_next_val::TEXT, 3, '0');
  NEW.travel_year := v_year;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_workspace_trips_deal_reference_id ON public.workspace_trips;
CREATE TRIGGER trg_workspace_trips_deal_reference_id
  BEFORE INSERT ON public.workspace_trips
  FOR EACH ROW
  WHEN (NEW.deal_reference_id IS NULL OR NEW.deal_reference_id = '')
  EXECUTE FUNCTION public.fn_generate_deal_reference_id();

-- 7. Advisor Atelier Columns on workspace_users
ALTER TABLE public.workspace_users
  ADD COLUMN IF NOT EXISTS professional_title TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Bespoke Travel Atelier',
  ADD COLUMN IF NOT EXISTS destination_specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS spoken_languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
  ADD COLUMN IF NOT EXISTS signature_archetype TEXT,
  ADD COLUMN IF NOT EXISTS client_bio TEXT,
  ADD COLUMN IF NOT EXISTS timezone_working_hours TEXT DEFAULT 'Asia/Kolkata (09:30 - 18:30)',
  ADD COLUMN IF NOT EXISTS emergency_standby_contact TEXT,
  ADD COLUMN IF NOT EXISTS avatar_preset_id TEXT DEFAULT 'monogram',
  ADD COLUMN IF NOT EXISTS avatar_image_url TEXT;

-- 8. Governance Immutability Trigger on workspace_users
CREATE OR REPLACE FUNCTION public.fn_enforce_workspace_user_governance_locks()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  SELECT role INTO v_caller_role FROM public.workspace_users WHERE user_id = auth.uid();
  
  IF v_caller_role IS DISTINCT FROM 'super_admin' AND v_caller_role IS DISTINCT FROM 'administrator' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Governance lock: Role cannot be modified without Super Admin authorization.';
    END IF;
    IF NEW.registered_mobile IS DISTINCT FROM OLD.registered_mobile THEN
      RAISE EXCEPTION 'Governance lock: Registered mobile cannot be modified without Super Admin authorization.';
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_workspace_users_governance_locks ON public.workspace_users;
CREATE TRIGGER trg_workspace_users_governance_locks
  BEFORE UPDATE ON public.workspace_users
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_enforce_workspace_user_governance_locks();

-- 9. Re-parenting CRM Child Tables to workspace_customers
ALTER TABLE public.workspace_client_companions
  DROP CONSTRAINT IF EXISTS workspace_client_companions_client_id_fkey;

ALTER TABLE public.workspace_client_companions
  ADD CONSTRAINT workspace_client_companions_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_tags
  DROP CONSTRAINT IF EXISTS workspace_client_tags_client_id_fkey;

ALTER TABLE public.workspace_client_tags
  ADD CONSTRAINT workspace_client_tags_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_activities
  DROP CONSTRAINT IF EXISTS workspace_client_activities_client_id_fkey;

ALTER TABLE public.workspace_client_activities
  ADD CONSTRAINT workspace_client_activities_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_documents
  DROP CONSTRAINT IF EXISTS workspace_client_documents_client_id_fkey;

ALTER TABLE public.workspace_client_documents
  ADD CONSTRAINT workspace_client_documents_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_itineraries
  DROP CONSTRAINT IF EXISTS workspace_itineraries_client_id_fkey;

ALTER TABLE public.workspace_itineraries
  ADD CONSTRAINT workspace_itineraries_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_trip_pipeline
  DROP CONSTRAINT IF EXISTS workspace_trip_pipeline_client_id_fkey;

ALTER TABLE public.workspace_trip_pipeline
  ADD CONSTRAINT workspace_trip_pipeline_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_customers(id) ON DELETE CASCADE;

-- 10. Backward-Compatible View for workspace_travellers
DROP TABLE IF EXISTS public.workspace_travellers CASCADE;

CREATE OR REPLACE VIEW public.workspace_travellers AS
  SELECT
    id,
    primary_name AS full_name,
    primary_email AS email,
    primary_mobile AS phone,
    primary_mobile AS phone_e164,
    created_by_user_id,
    created_at,
    updated_at,
    NULL::text AS nationality,
    NULL::date AS dob,
    'website'::text AS lead_source,
    false AS is_vip,
    metadata
  FROM public.workspace_customers;

-- 11. Row Level Security & Permissions
ALTER TABLE public.workspace_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_trips ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.workspace_customers FROM anon, public;
REVOKE ALL ON public.workspace_trips FROM anon, public;

GRANT ALL ON public.workspace_customers TO authenticated, service_role;
GRANT ALL ON public.workspace_trips TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_customers_staff_policy ON public.workspace_customers;
CREATE POLICY workspace_customers_staff_policy ON public.workspace_customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS workspace_trips_staff_policy ON public.workspace_trips;
CREATE POLICY workspace_trips_staff_policy ON public.workspace_trips
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Storage Bucket: staff-avatars with Owner-Only Policy
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'staff-avatars',
  'staff-avatars',
  true,
  524288, -- 500 KB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 524288,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

DROP POLICY IF EXISTS "Staff Avatar Owner Management" ON storage.objects;
CREATE POLICY "Staff Avatar Owner Management" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'staff-avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'staff-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Public Staff Avatar Read" ON storage.objects;
CREATE POLICY "Public Staff Avatar Read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'staff-avatars');
