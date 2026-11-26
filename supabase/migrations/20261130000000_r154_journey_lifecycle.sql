-- Migration: 20261130000000_r154_journey_lifecycle.sql
-- Release 1.5.4: End-to-End Journey Creation, Lifecycle Maintenance & Stage Governance
-- Non-Negotiable Guardrails: ZERO occurrences of prohibited brand term; BOUND-01 Public Decoupling.

-- 1. Expand workspace_trips constraints & add Release 1.5.4 lifecycle columns
ALTER TABLE public.workspace_trips
  DROP CONSTRAINT IF EXISTS workspace_trips_deal_stage_check;
ALTER TABLE public.workspace_trips
  ADD CONSTRAINT workspace_trips_deal_stage_check
  CHECK (deal_stage IN ('Enquiry', 'In Progress', 'Booked/Won', 'Lost', 'On Hold', 'Cancelled'));

ALTER TABLE public.workspace_trips
  DROP CONSTRAINT IF EXISTS workspace_trips_payment_status_check;
ALTER TABLE public.workspace_trips
  ADD CONSTRAINT workspace_trips_payment_status_check
  CHECK (payment_status IN ('To Start', 'In Progress', 'Won', 'Lost', 'On Hold', 'Cancelled'));

ALTER TABLE public.workspace_trips
  DROP CONSTRAINT IF EXISTS workspace_trips_trip_status_check;
ALTER TABLE public.workspace_trips
  ADD CONSTRAINT workspace_trips_trip_status_check
  CHECK (trip_status IN ('To Start', 'In Progress', 'Complete', 'Lost', 'On Hold', 'Cancelled'));

ALTER TABLE public.workspace_trips
  ADD COLUMN IF NOT EXISTS trip_scope TEXT CHECK (trip_scope IN ('Domestic', 'International')) DEFAULT 'Domestic',
  ADD COLUMN IF NOT EXISTS lead_source TEXT,
  ADD COLUMN IF NOT EXISTS hold_reason TEXT,
  ADD COLUMN IF NOT EXISTS loss_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_date DATE,
  ADD COLUMN IF NOT EXISTS cancellation_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS cloned_from_trip_id UUID REFERENCES public.workspace_trips(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS readiness_checklist JSONB NOT NULL DEFAULT '{"stays_confirmed":false,"transport_assigned":false,"roster_verified":false,"itinerary_exported":false,"payment_settled":false,"voucher_published":false}'::jsonb,
  ADD COLUMN IF NOT EXISTS pinned_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voucher_published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voucher_payload JSONB;

CREATE INDEX IF NOT EXISTS idx_workspace_trips_follow_up_date
  ON public.workspace_trips (follow_up_date)
  WHERE follow_up_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_trips_start_date
  ON public.workspace_trips (start_date)
  WHERE start_date IS NOT NULL;

-- 2. Immutable Journey Activity Timeline: public.workspace_trip_events
CREATE TABLE IF NOT EXISTS public.workspace_trip_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  actor_name TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'JOURNEY_CREATED',
    'STAGE_CHANGED',
    'STAGE_REOPENED',
    'AMENDMENT_LOGGED',
    'PAYMENT_LOGGED',
    'BOOKING_UPDATED',
    'LEAD_REASSIGNED',
    'CLONED',
    'CANCELLED',
    'NOTE_ADDED',
    'CHECKLIST_UPDATED',
    'VOUCHER_PUBLISHED',
    'ARCHIVED'
  )),
  previous_state JSONB,
  new_state JSONB,
  reason_code TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_events_trip_chronological
  ON public.workspace_trip_events (trip_id, created_at DESC);

ALTER TABLE public.workspace_trip_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_trip_events FROM anon, public;
GRANT SELECT, INSERT ON public.workspace_trip_events TO authenticated;
GRANT ALL ON public.workspace_trip_events TO service_role;

DROP POLICY IF EXISTS workspace_trip_events_select_policy ON public.workspace_trip_events;
CREATE POLICY workspace_trip_events_select_policy
  ON public.workspace_trip_events FOR SELECT TO authenticated, service_role USING (true);

DROP POLICY IF EXISTS workspace_trip_events_insert_policy ON public.workspace_trip_events;
CREATE POLICY workspace_trip_events_insert_policy
  ON public.workspace_trip_events FOR INSERT TO authenticated, service_role WITH CHECK (true);

-- 3. Multi-Tranche Payment Receipt Ledger: public.workspace_trip_payments
CREATE TABLE IF NOT EXISTS public.workspace_trip_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  tranche_label TEXT NOT NULL,
  amount_inr NUMERIC(12,2) NOT NULL CHECK (amount_inr >= 0),
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('UPI', 'NEFT/IMPS', 'Card', 'Payment Gateway', 'Cash')),
  transaction_ref TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('Verified', 'Pending Verification', 'Rejected')) DEFAULT 'Pending Verification',
  recorded_by UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  recorded_by_name TEXT,
  verified_by UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  verified_by_name TEXT,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_payments_trip
  ON public.workspace_trip_payments (trip_id, created_at DESC);

ALTER TABLE public.workspace_trip_payments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_trip_payments FROM anon, public;
GRANT ALL ON public.workspace_trip_payments TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_trip_payments_staff_policy ON public.workspace_trip_payments;
CREATE POLICY workspace_trip_payments_staff_policy
  ON public.workspace_trip_payments FOR ALL TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- 4. Structured Stay, Cab & Supplier Allocation Ledger: public.workspace_trip_bookings
CREATE TABLE IF NOT EXISTS public.workspace_trip_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('Stay', 'Transport/Cab', 'Activity/Experience', 'Flight/Rail', 'Visa/Insurance')),
  client_facing_title TEXT NOT NULL,
  internal_vendor_dmc TEXT,
  confirmation_ref TEXT,
  start_date DATE,
  end_date DATE,
  booking_status TEXT NOT NULL CHECK (booking_status IN ('Pending', 'Requested', 'Confirmed', 'Cancelled')) DEFAULT 'Pending',
  operational_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_bookings_trip
  ON public.workspace_trip_bookings (trip_id, start_date ASC NULLS LAST);

ALTER TABLE public.workspace_trip_bookings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_trip_bookings FROM anon, public;
GRANT ALL ON public.workspace_trip_bookings TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_trip_bookings_staff_policy ON public.workspace_trip_bookings;
CREATE POLICY workspace_trip_bookings_staff_policy
  ON public.workspace_trip_bookings FOR ALL TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- 5. Journey Co-Traveller Roster & Private Document Vault (US-154-07)
CREATE TABLE IF NOT EXISTS public.workspace_trip_companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.workspace_client_companions(id) ON DELETE CASCADE,
  is_lead_traveller BOOLEAN NOT NULL DEFAULT false,
  dietary_notes TEXT,
  mobility_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, companion_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_companions_trip
  ON public.workspace_trip_companions (trip_id);

ALTER TABLE public.workspace_trip_companions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_trip_companions FROM anon, public;
GRANT ALL ON public.workspace_trip_companions TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_trip_companions_staff_policy ON public.workspace_trip_companions;
CREATE POLICY workspace_trip_companions_staff_policy
  ON public.workspace_trip_companions FOR ALL TO authenticated, service_role
  USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.workspace_trip_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.workspace_trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Hotel Voucher', 'Cab/Transfer', 'Tickets', 'Visa/Insurance', 'Client ID')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  uploaded_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_trip_documents_trip
  ON public.workspace_trip_documents (trip_id, created_at DESC);

ALTER TABLE public.workspace_trip_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_trip_documents FROM anon, public;
GRANT ALL ON public.workspace_trip_documents TO authenticated, service_role;

DROP POLICY IF EXISTS workspace_trip_documents_staff_policy ON public.workspace_trip_documents;
CREATE POLICY workspace_trip_documents_staff_policy
  ON public.workspace_trip_documents FOR ALL TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- Private Storage Bucket: trip-documents (BOUND-01 staff-only RLS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trip-documents',
  'trip-documents',
  false,
  10485760, -- 10 MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

DROP POLICY IF EXISTS "Staff Trip Documents Access" ON storage.objects;
CREATE POLICY "Staff Trip Documents Access" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'trip-documents')
  WITH CHECK (bucket_id = 'trip-documents');

-- 6. Atomic RPC: create_journey_with_optional_customer (US-154-01)
CREATE OR REPLACE FUNCTION public.create_journey_with_optional_customer(
  p_customer_id UUID DEFAULT NULL,
  p_primary_name TEXT DEFAULT NULL,
  p_primary_mobile TEXT DEFAULT NULL,
  p_primary_email TEXT DEFAULT NULL,
  p_deal_channel TEXT DEFAULT 'DIRECT',
  p_trip_scope TEXT DEFAULT 'Domestic',
  p_destination TEXT DEFAULT '',
  p_travel_year INTEGER DEFAULT EXTRACT(YEAR FROM now())::INTEGER,
  p_travel_month TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_duration_label TEXT DEFAULT NULL,
  p_nights INTEGER DEFAULT 0,
  p_travel_party_type TEXT DEFAULT 'Family',
  p_pax_adults INTEGER DEFAULT 1,
  p_pax_children INTEGER DEFAULT 0,
  p_lead_source TEXT DEFAULT NULL,
  p_lead_owner_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL,
  p_actor_name TEXT DEFAULT NULL,
  p_quote_price NUMERIC DEFAULT 0,
  p_actual_cost NUMERIC DEFAULT 0,
  p_pre_tax_amount NUMERIC DEFAULT 0,
  p_gst_amount NUMERIC DEFAULT 0,
  p_profit NUMERIC DEFAULT 0,
  p_cloned_from_trip_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id UUID := p_customer_id;
  v_norm_mobile TEXT;
  v_digits TEXT;
  v_existing_cust RECORD;
  v_trip RECORD;
  v_channel TEXT := CASE WHEN upper(COALESCE(p_deal_channel, 'DIRECT')) = 'VENDOR' THEN 'VENDOR' ELSE 'DIRECT' END;
  v_scope TEXT := CASE WHEN initcap(COALESCE(p_trip_scope, 'Domestic')) = 'International' THEN 'International' ELSE 'Domestic' END;
BEGIN
  IF NULLIF(trim(COALESCE(p_destination, '')), '') IS NULL THEN
    RAISE EXCEPTION 'DESTINATION_REQUIRED: Destination is required.';
  END IF;

  IF v_customer_id IS NULL THEN
    IF NULLIF(trim(COALESCE(p_primary_name, '')), '') IS NULL THEN
      RAISE EXCEPTION 'CUSTOMER_NAME_REQUIRED: Customer name is required when creating a new customer.';
    END IF;

    IF NULLIF(trim(COALESCE(p_primary_mobile, '')), '') IS NOT NULL THEN
      v_digits := regexp_replace(trim(p_primary_mobile), '[^0-9+]', '', 'g');
      IF v_digits ~ '^[0-9]{10}$' THEN
        v_norm_mobile := '+91' || v_digits;
      ELSIF v_digits ~ '^91[0-9]{10}$' THEN
        v_norm_mobile := '+' || v_digits;
      ELSIF v_digits ~ '^\+[0-9]{8,15}$' THEN
        v_norm_mobile := v_digits;
      ELSE
        v_norm_mobile := trim(p_primary_mobile);
      END IF;

      SELECT id, customer_code, primary_name
      INTO v_existing_cust
      FROM public.workspace_customers
      WHERE primary_mobile = v_norm_mobile
      LIMIT 1;

      IF FOUND THEN
        RAISE EXCEPTION 'DUPLICATE_CUSTOMER:%:%:%', v_existing_cust.id, v_existing_cust.customer_code, v_existing_cust.primary_name;
      END IF;
    END IF;

    INSERT INTO public.workspace_customers (
      primary_name,
      primary_mobile,
      primary_email,
      created_by_user_id
    )
    VALUES (
      trim(p_primary_name),
      v_norm_mobile,
      NULLIF(trim(COALESCE(p_primary_email, '')), ''),
      p_actor_id
    )
    RETURNING id INTO v_customer_id;
  END IF;

  INSERT INTO public.workspace_trips (
    customer_id,
    deal_channel,
    trip_scope,
    destination,
    travel_year,
    travel_month,
    start_date,
    end_date,
    duration_label,
    nights,
    travel_party_type,
    pax_adults,
    pax_children,
    lead_source,
    lead_owner_id,
    notes,
    deal_stage,
    payment_status,
    trip_status,
    quote_price,
    actual_cost,
    pre_tax_amount,
    gst_amount,
    profit,
    cloned_from_trip_id
  )
  VALUES (
    v_customer_id,
    v_channel,
    v_scope,
    trim(p_destination),
    COALESCE(p_travel_year, EXTRACT(YEAR FROM COALESCE(p_start_date, now()))::INTEGER),
    NULLIF(trim(COALESCE(p_travel_month, '')), ''),
    p_start_date,
    p_end_date,
    NULLIF(trim(COALESCE(p_duration_label, '')), ''),
    COALESCE(p_nights, 0),
    COALESCE(NULLIF(trim(COALESCE(p_travel_party_type, '')), ''), 'Family'),
    GREATEST(1, COALESCE(p_pax_adults, 1)),
    GREATEST(0, COALESCE(p_pax_children, 0)),
    NULLIF(trim(COALESCE(p_lead_source, '')), ''),
    p_lead_owner_id,
    NULLIF(trim(COALESCE(p_notes, '')), ''),
    'In Progress',
    'To Start',
    'To Start',
    COALESCE(p_quote_price, 0),
    COALESCE(p_actual_cost, 0),
    COALESCE(p_pre_tax_amount, 0),
    COALESCE(p_gst_amount, 0),
    COALESCE(p_profit, 0),
    p_cloned_from_trip_id
  )
  RETURNING * INTO v_trip;

  INSERT INTO public.workspace_trip_events (
    trip_id,
    actor_id,
    actor_name,
    event_type,
    new_state,
    comment
  )
  VALUES (
    v_trip.id,
    p_actor_id,
    COALESCE(NULLIF(trim(COALESCE(p_actor_name, '')), ''), 'Portal Staff'),
    CASE WHEN p_cloned_from_trip_id IS NOT NULL THEN 'CLONED' ELSE 'JOURNEY_CREATED' END,
    jsonb_build_object(
      'deal_reference_id', v_trip.deal_reference_id,
      'destination', v_trip.destination,
      'deal_stage', v_trip.deal_stage,
      'trip_scope', v_trip.trip_scope
    ),
    CASE
      WHEN p_cloned_from_trip_id IS NOT NULL THEN 'Journey cloned into ' || v_trip.deal_reference_id
      ELSE 'Journey initiated as ' || v_trip.deal_reference_id
    END
  );

  RETURN jsonb_build_object(
    'trip_id', v_trip.id,
    'deal_reference_id', v_trip.deal_reference_id,
    'customer_id', v_customer_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_journey_with_optional_customer FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_journey_with_optional_customer TO authenticated, service_role;

-- 7. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
