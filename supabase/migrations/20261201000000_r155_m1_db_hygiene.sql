-- Release 1.5.5 Milestone 1: Database Foundations, CRM Hygiene & Master Data
-- EPIC 1.2 (Yearly Trip ID Alignment & Preview), EPIC 6.1 (Multi-Contact JSONB),
-- EPIC 6.2 (Destinations Master & Spelling Normalization), EPIC 6.3 (Vendor GST Columns)

-- ============================================================================
-- 1. Destinations Master Table (public.destinations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT UNIQUE NOT NULL,
  aliases TEXT[] NOT NULL DEFAULT '{}'::text[],
  country TEXT NOT NULL DEFAULT 'India',
  category TEXT NOT NULL DEFAULT 'Domestic',
  iana_timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  is_public_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_destinations_canonical_lower
  ON public.destinations (lower(canonical_name));

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.destinations FROM PUBLIC;
GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT ALL ON public.destinations TO authenticated, service_role;

DROP POLICY IF EXISTS destinations_read_all ON public.destinations;
CREATE POLICY destinations_read_all ON public.destinations
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS destinations_staff_write ON public.destinations;
CREATE POLICY destinations_staff_write ON public.destinations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed 28 public-destinations.config.ts entries + active CRM/Vendor cities & countries
INSERT INTO public.destinations (canonical_name, aliases, country, category, iana_timezone, is_public_featured)
VALUES
  -- 28 Public Featured Destinations
  ('Agra', ARRAY['agra'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Amritsar', ARRAY['amritsar'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Andaman', ARRAY['Andaman & Nicobar', 'Andaman and Nicobar', 'Havelock', 'Port Blair', 'Neil'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Assam', ARRAY['assam'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Goa', ARRAY['goa'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Gujarat', ARRAY['gujarat'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Himachal Pradesh', ARRAY['Himachal'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Hyderabad', ARRAY['hyderabad'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Karnataka', ARRAY['karnataka'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Kashmir', ARRAY['kashmir', 'Srinagar', 'Gulmarg', 'Pahalgam'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Kerala', ARRAY['State of Kerala', 'kerala'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Northeast', ARRAY['North East'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Pondicherry', ARRAY['Puducherry'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Rajasthan', ARRAY['rajasthan'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Tamil Nadu', ARRAY['Tamilnadu'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Vizag', ARRAY['Visakhapatnam', 'AndraPradesh / Vizag', 'Andhra Pradesh'], 'India', 'Domestic', 'Asia/Kolkata', true),
  ('Bali', ARRAY['Bali (Indonesia)', 'Bali, Indonesia'], 'Indonesia', 'International', 'Asia/Makassar', true),
  ('Dubai', ARRAY['UAE'], 'United Arab Emirates', 'International', 'Asia/Dubai', true),
  ('Malaysia', ARRAY['malaysia'], 'Malaysia', 'International', 'Asia/Kuala_Lumpur', true),
  ('Singapore', ARRAY['Singpore', 'Sinapore', 'SNG'], 'Singapore', 'International', 'Asia/Singapore', true),
  ('Sri Lanka', ARRAY['Srilanka', 'Sri lanka', 'Across, Sri Lanka'], 'Sri Lanka', 'International', 'Asia/Colombo', true),
  ('Thailand', ARRAY['thailand'], 'Thailand', 'International', 'Asia/Bangkok', true),
  ('Vietnam', ARRAY['vietnam'], 'Vietnam', 'International', 'Asia/Ho_Chi_Minh', true),
  ('Bandipur', ARRAY['bandipur'], 'India', 'Wildlife', 'Asia/Kolkata', true),
  ('Corbett', ARRAY['Ramnagar (Corbett)', 'Jim Corbett'], 'India', 'Wildlife', 'Asia/Kolkata', true),
  ('Kabini', ARRAY['kabini'], 'India', 'Wildlife', 'Asia/Kolkata', true),
  ('Masinagudi', ARRAY['masinagudi'], 'India', 'Wildlife', 'Asia/Kolkata', true),
  ('Wildlife experiences', ARRAY['Wildlife'], 'India', 'Wildlife', 'Asia/Kolkata', true),

  -- Active CRM Trips, Vendors & Lead Destinations
  ('Alwarthirunagari', ARRAY['ALWARTHIRUNAGARI'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Auli', ARRAY['auli'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Bangkok', ARRAY['bangkok'], 'Thailand', 'International', 'Asia/Bangkok', false),
  ('Bangladesh', ARRAY['Bangaladesh'], 'Bangladesh', 'International', 'Asia/Dhaka', false),
  ('Bengaluru', ARRAY['Bangalore'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Beruwala, Sri Lanka', ARRAY['Peruvalla, Sri Lanka'], 'Sri Lanka', 'International', 'Asia/Colombo', false),
  ('Bhutan', ARRAY['bhutan'], 'Bhutan', 'International', 'Asia/Thimphu', false),
  ('Cambodia', ARRAY['Combodia'], 'Cambodia', 'International', 'Asia/Phnom_Penh', false),
  ('Chennai', ARRAY['chennai'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Chikmagalur', ARRAY['Chikkamagaluru'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Coorg', ARRAY['Kodagu'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Cordelia Cruise', ARRAY['Cordila Cruise'], 'India', 'Cruise', 'Asia/Kolkata', false),
  ('Dalhousie', ARRAY['dalhousie'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Dehradun', ARRAY['dehradun'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Delhi', ARRAY['New Delhi'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Dharamshala', ARRAY['Dharamashala', 'Dharmashala'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Europe', ARRAY['Eurpore'], 'Europe', 'International', 'Europe/Zurich', false),
  ('Gangtok', ARRAY['gangtok'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Golden Triangle', ARRAY['golden triangle'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Guruvayur', ARRAY['Gurvayoor', 'Guruvayoor'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Guwahati', ARRAY['guwahati'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Hanoi', ARRAY['hanoi'], 'Vietnam', 'International', 'Asia/Ho_Chi_Minh', false),
  ('Jaipur', ARRAY['jaipur'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Japan', ARRAY['japan'], 'Japan', 'International', 'Asia/Tokyo', false),
  ('Kanyakumari', ARRAY['Kanniyakumari'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Kasol', ARRAY['kasol'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Kochi', ARRAY['Cochin'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Kodaikanal', ARRAY['Kodaikkanal'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Kolkata', ARRAY['Calcutta'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Kotagiri', ARRAY['kotagiri'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Krabi, Thailand', ARRAY['Karabi, Thailand'], 'Thailand', 'International', 'Asia/Bangkok', false),
  ('Kuala Lumpur', ARRAY['KL'], 'Malaysia', 'International', 'Asia/Kuala_Lumpur', false),
  ('Lakshadweep', ARRAY['Lakshadeep'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Leh Ladakh', ARRAY['Ladakh', 'Leh'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Madurai', ARRAY['madurai'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Maldives', ARRAY['Maldevies', 'Maldivies'], 'Maldives', 'International', 'Indian/Maldives', false),
  ('Manali', ARRAY['manali'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Mangaluru', ARRAY['Mangalore'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Meghalaya', ARRAY['meghalaya'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Mumbai', ARRAY['Bombay'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Munnar', ARRAY['munnar'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Mussoorie', ARRAY['mussoorie'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Mysuru', ARRAY['Mysore'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Nuwara Eliya, Sri Lanka', ARRAY['Nuwaraelliya, Sri Lanka'], 'Sri Lanka', 'International', 'Asia/Colombo', false),
  ('Odisha', ARRAY['Orrisa', 'Orissa'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Ooty', ARRAY['Udhagamandalam'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Pauri Garhwal', ARRAY['pauri garhwal'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Phuket, Thailand', ARRAY['Phuket'], 'Thailand', 'International', 'Asia/Bangkok', false),
  ('Pokhara', ARRAY['Pokhra'], 'Nepal', 'International', 'Asia/Kathmandu', false),
  ('Pune', ARRAY['pune'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Ramayana Circuit', ARRAY['Ramayana Circut'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Ranthambore', ARRAY['ranthambore'], 'India', 'Wildlife', 'Asia/Kolkata', false),
  ('Rishikesh', ARRAY['rishikesh'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Riyadh', ARRAY['riyadh'], 'Saudi Arabia', 'International', 'Asia/Riyadh', false),
  ('Sakleshpur', ARRAY['Sakalana', 'Sakalespur'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Shimla', ARRAY['Simla'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Shirdi', ARRAY['shirdi'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Sikkim', ARRAY['sikkim'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Switzerland', ARRAY['switzerland'], 'Switzerland', 'International', 'Europe/Zurich', false),
  ('Thekkady', ARRAY['thekkady'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Tindivanam', ARRAY['Thindivanam'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Udaipur', ARRAY['udaipur'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Uttarakhand', ARRAY['uttarakhand'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Varanasi', ARRAY['Varnasi', 'Benaras'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Varkala', ARRAY['varkala'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Vrindavan', ARRAY['Vindhavan'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Wayanad', ARRAY['Wayand'], 'India', 'Domestic', 'Asia/Kolkata', false),
  ('Yercaud', ARRAY['yercaud'], 'India', 'Domestic', 'Asia/Kolkata', false)
ON CONFLICT (canonical_name) DO UPDATE
SET
  aliases = EXCLUDED.aliases,
  country = EXCLUDED.country,
  category = EXCLUDED.category,
  iana_timezone = EXCLUDED.iana_timezone,
  is_public_featured = public.destinations.is_public_featured OR EXCLUDED.is_public_featured,
  updated_at = now();

-- ============================================================================
-- 2. Destination Normalization Function & Historical Data Cleanup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_normalize_destination(p_raw TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_clean TEXT;
  v_match TEXT;
  v_parts TEXT[];
  v_part TEXT;
  v_norm_part TEXT;
  v_out TEXT[] := ARRAY[]::TEXT[];
  v_sep TEXT;
BEGIN
  IF p_raw IS NULL OR trim(p_raw) = '' THEN
    RETURN p_raw;
  END IF;

  v_clean := trim(p_raw);

  -- Strip ExcelJS richText JSON wrapper if present
  IF v_clean LIKE '{"richText":%' THEN
    BEGIN
      SELECT string_agg(elem->>'text', '')
      INTO v_clean
      FROM jsonb_array_elements((v_clean::jsonb)->'richText') AS elem;
      v_clean := trim(COALESCE(v_clean, p_raw));
    EXCEPTION WHEN OTHERS THEN
      v_clean := trim(p_raw);
    END;
  END IF;

  -- Preserve historical non-destination triage placeholders untouched
  IF lower(v_clean) IN (
    'bespoke journey', 'under discussion', 'no stay', 'domestic',
    'multi', 'multiple', 'resort with activities', 'ooty or any bacholer place to enjoy'
  ) THEN
    RETURN v_clean;
  END IF;

  -- Exact match on canonical_name or aliases (case-insensitive)
  SELECT canonical_name INTO v_match
  FROM public.destinations
  WHERE lower(canonical_name) = lower(v_clean)
     OR EXISTS (
       SELECT 1 FROM unnest(aliases) AS a
       WHERE lower(trim(a)) = lower(v_clean)
     )
  LIMIT 1;

  IF v_match IS NOT NULL THEN
    RETURN v_match;
  END IF;

  -- Normalize prefix 'State of Kerala...'
  IF lower(v_clean) LIKE 'state of kerala%' THEN
    RETURN 'Kerala';
  END IF;

  -- Token-wise normalization for multi-destination strings (preserving primary delimiter)
  IF v_clean ~ '(\s*\|\s*|\s*/\s*|\s*&\s*|,\s*)' THEN
    v_sep := CASE
      WHEN v_clean LIKE '%|%' THEN ' | '
      WHEN v_clean LIKE '%/%' THEN ' / '
      WHEN v_clean LIKE '%&%' THEN ' & '
      ELSE ', '
    END;

    v_parts := regexp_split_to_array(v_clean, '\s*(?:\||/|&|,)\s*');
    FOREACH v_part IN ARRAY v_parts LOOP
      v_part := trim(v_part);
      IF v_part = '' THEN
        CONTINUE;
      END IF;
      SELECT canonical_name INTO v_norm_part
      FROM public.destinations
      WHERE lower(canonical_name) = lower(v_part)
         OR EXISTS (
           SELECT 1 FROM unnest(aliases) AS a
           WHERE lower(trim(a)) = lower(v_part)
         )
      LIMIT 1;

      v_out := array_append(v_out, COALESCE(v_norm_part, v_part));
    END LOOP;

    IF array_length(v_out, 1) > 0 THEN
      RETURN array_to_string(v_out, v_sep);
    END IF;
  END IF;

  RETURN v_clean;
END;
$$;

-- Apply idempotent normalization to workspace_trips, workspace_vendors, and journey_passport_leads
UPDATE public.workspace_trips
SET destination = public.fn_normalize_destination(destination)
WHERE destination IS NOT NULL
  AND destination IS DISTINCT FROM public.fn_normalize_destination(destination);

UPDATE public.workspace_vendors
SET destination = public.fn_normalize_destination(destination)
WHERE destination IS NOT NULL
  AND destination IS DISTINCT FROM public.fn_normalize_destination(destination);

UPDATE public.workspace_vendors v
SET destinations_served = (
  SELECT COALESCE(array_agg(public.fn_normalize_destination(d)), '{}'::text[])
  FROM unnest(v.destinations_served) AS d
)
WHERE destinations_served IS NOT NULL
  AND array_length(destinations_served, 1) > 0;

UPDATE public.journey_passport_leads
SET destination_free_text = public.fn_normalize_destination(destination_free_text)
WHERE destination_free_text IS NOT NULL
  AND length(destination_free_text) <= 40
  AND destination_free_text IS DISTINCT FROM public.fn_normalize_destination(destination_free_text);

-- ============================================================================
-- 3. Multi-Contact JSONB Schema, GST Columns & Migration (EPIC 6.1 & 6.3)
-- ============================================================================
ALTER TABLE public.workspace_customers
  ADD COLUMN IF NOT EXISTS contacts JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.workspace_vendors
  ADD COLUMN IF NOT EXISTS contacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gst_number TEXT,
  ADD COLUMN IF NOT EXISTS gst_treatment TEXT,
  ADD COLUMN IF NOT EXISTS zoho_contact_id TEXT;

CREATE INDEX IF NOT EXISTS idx_workspace_vendors_gst_number
  ON public.workspace_vendors (gst_number)
  WHERE gst_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.crm_hygiene_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  raw_value TEXT,
  issue_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

REVOKE ALL ON public.crm_hygiene_audit_log FROM anon, public;
GRANT ALL ON public.crm_hygiene_audit_log TO authenticated, service_role;

-- Helper to split delimited emails/phones, deduplicate, and validate
CREATE OR REPLACE FUNCTION public.fn_split_clean_tokens(p_raw TEXT)
RETURNS TEXT[]
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_arr TEXT[];
  v_tok TEXT;
  v_res TEXT[] := ARRAY[]::TEXT[];
BEGIN
  IF p_raw IS NULL OR trim(p_raw) = '' THEN
    RETURN v_res;
  END IF;
  v_arr := regexp_split_to_array(p_raw, '[,;/|\r\n]+');
  FOREACH v_tok IN ARRAY v_arr LOOP
    v_tok := trim(v_tok);
    IF v_tok <> '' AND NOT (v_tok = ANY(v_res)) THEN
      v_res := array_append(v_res, v_tok);
    END IF;
  END LOOP;
  RETURN v_res;
END;
$$;

-- Migrate existing workspace_customers -> contacts JSONB (only where contacts is still empty)
DO $$
DECLARE
  r RECORD;
  v_emails TEXT[];
  v_phones TEXT[];
  v_valid_emails TEXT[];
  v_valid_phones TEXT[];
  v_sec_phones TEXT[];
  v_tok TEXT;
  v_contacts JSONB;
BEGIN
  FOR r IN
    SELECT id, primary_name, primary_email, primary_mobile, secondary_mobile
    FROM public.workspace_customers
    WHERE jsonb_array_length(contacts) = 0
      AND (primary_email IS NOT NULL OR primary_mobile IS NOT NULL OR secondary_mobile IS NOT NULL)
  LOOP
    v_emails := public.fn_split_clean_tokens(r.primary_email);
    v_phones := public.fn_split_clean_tokens(r.primary_mobile);
    v_sec_phones := public.fn_split_clean_tokens(r.secondary_mobile);
    v_valid_emails := ARRAY[]::TEXT[];
    v_valid_phones := ARRAY[]::TEXT[];

    FOREACH v_tok IN ARRAY v_emails LOOP
      IF v_tok ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' THEN
        v_valid_emails := array_append(v_valid_emails, lower(v_tok));
      ELSE
        INSERT INTO public.crm_hygiene_audit_log (entity_type, entity_id, field_name, raw_value, issue_reason)
        VALUES ('customer', r.id, 'primary_email', v_tok, 'Invalid email format skipped during R1.5.5 M1 migration');
      END IF;
    END LOOP;

    FOREACH v_tok IN ARRAY v_phones LOOP
      IF regexp_replace(v_tok, '[^0-9]', '', 'g') ~ '^[0-9]{7,15}$' THEN
        v_valid_phones := array_append(v_valid_phones, v_tok);
      ELSE
        INSERT INTO public.crm_hygiene_audit_log (entity_type, entity_id, field_name, raw_value, issue_reason)
        VALUES ('customer', r.id, 'primary_mobile', v_tok, 'Invalid phone format skipped during R1.5.5 M1 migration');
      END IF;
    END LOOP;

    v_contacts := jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'name', COALESCE(NULLIF(trim(r.primary_name), ''), 'Primary Contact'),
        'designation', 'Primary Traveller',
        'emails', to_jsonb(v_valid_emails),
        'phones', to_jsonb(v_valid_phones),
        'is_primary', true
      )
    );

    IF array_length(v_sec_phones, 1) > 0 THEN
      v_contacts := v_contacts || jsonb_build_array(
        jsonb_build_object(
          'id', gen_random_uuid()::text,
          'name', 'Secondary Contact',
          'designation', 'Secondary',
          'emails', '[]'::jsonb,
          'phones', to_jsonb(v_sec_phones),
          'is_primary', false
        )
      );
    END IF;

    UPDATE public.workspace_customers
    SET
      contacts = v_contacts,
      primary_email = COALESCE(v_valid_emails[1], primary_email),
      primary_mobile = COALESCE(v_valid_phones[1], primary_mobile)
    WHERE id = r.id;
  END LOOP;
END $$;

-- Migrate existing workspace_vendors -> contacts JSONB (only where contacts is still empty)
DO $$
DECLARE
  r RECORD;
  v_emails TEXT[];
  v_phones TEXT[];
  v_valid_emails TEXT[];
  v_valid_phones TEXT[];
  v_tok TEXT;
  v_contacts JSONB;
BEGIN
  FOR r IN
    SELECT id, poc_name, email, poc_mobile, office_phone
    FROM public.workspace_vendors
    WHERE jsonb_array_length(contacts) = 0
      AND (email IS NOT NULL OR poc_mobile IS NOT NULL OR office_phone IS NOT NULL OR poc_name IS NOT NULL)
  LOOP
    v_emails := public.fn_split_clean_tokens(r.email);
    v_phones := public.fn_split_clean_tokens(COALESCE(r.poc_mobile, '') || ',' || COALESCE(r.office_phone, ''));
    v_valid_emails := ARRAY[]::TEXT[];
    v_valid_phones := ARRAY[]::TEXT[];

    FOREACH v_tok IN ARRAY v_emails LOOP
      IF v_tok ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' THEN
        v_valid_emails := array_append(v_valid_emails, lower(v_tok));
      ELSE
        INSERT INTO public.crm_hygiene_audit_log (entity_type, entity_id, field_name, raw_value, issue_reason)
        VALUES ('vendor', r.id, 'email', v_tok, 'Invalid email format skipped during R1.5.5 M1 migration');
      END IF;
    END LOOP;

    FOREACH v_tok IN ARRAY v_phones LOOP
      IF regexp_replace(v_tok, '[^0-9]', '', 'g') ~ '^[0-9]{7,15}$' THEN
        v_valid_phones := array_append(v_valid_phones, v_tok);
      ELSE
        INSERT INTO public.crm_hygiene_audit_log (entity_type, entity_id, field_name, raw_value, issue_reason)
        VALUES ('vendor', r.id, 'phone', v_tok, 'Invalid phone format skipped during R1.5.5 M1 migration');
      END IF;
    END LOOP;

    v_contacts := jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'name', COALESCE(NULLIF(trim(r.poc_name), ''), 'Primary Contact'),
        'designation', 'Reservations / Sales',
        'emails', to_jsonb(v_valid_emails),
        'phones', to_jsonb(v_valid_phones),
        'is_primary', true
      )
    );

    UPDATE public.workspace_vendors
    SET
      contacts = v_contacts,
      email = COALESCE(v_valid_emails[1], email),
      poc_mobile = COALESCE(v_valid_phones[1], poc_mobile)
    WHERE id = r.id;
  END LOOP;
END $$;

-- Sync triggers to keep primary_email / primary_mobile (customers) and email / poc_mobile (vendors) aligned with contacts[0]
CREATE OR REPLACE FUNCTION public.fn_sync_customer_primary_from_contacts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contacts IS NOT NULL AND jsonb_typeof(NEW.contacts) = 'array' AND jsonb_array_length(NEW.contacts) > 0 THEN
    IF jsonb_array_length(COALESCE(NEW.contacts->0->'emails', '[]'::jsonb)) > 0 THEN
      NEW.primary_email := NULLIF(trim(NEW.contacts->0->'emails'->>0), '');
    END IF;
    IF jsonb_array_length(COALESCE(NEW.contacts->0->'phones', '[]'::jsonb)) > 0 THEN
      NEW.primary_mobile := NULLIF(trim(NEW.contacts->0->'phones'->>0), '');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_customer_primary_from_contacts ON public.workspace_customers;
CREATE TRIGGER trg_sync_customer_primary_from_contacts
  BEFORE INSERT OR UPDATE OF contacts ON public.workspace_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_sync_customer_primary_from_contacts();

CREATE OR REPLACE FUNCTION public.fn_sync_vendor_primary_from_contacts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contacts IS NOT NULL AND jsonb_typeof(NEW.contacts) = 'array' AND jsonb_array_length(NEW.contacts) > 0 THEN
    IF NULLIF(trim(COALESCE(NEW.contacts->0->>'name', '')), '') IS NOT NULL THEN
      NEW.poc_name := trim(NEW.contacts->0->>'name');
    END IF;
    IF jsonb_array_length(COALESCE(NEW.contacts->0->'emails', '[]'::jsonb)) > 0 THEN
      NEW.email := NULLIF(trim(NEW.contacts->0->'emails'->>0), '');
    END IF;
    IF jsonb_array_length(COALESCE(NEW.contacts->0->'phones', '[]'::jsonb)) > 0 THEN
      NEW.poc_mobile := NULLIF(trim(NEW.contacts->0->'phones'->>0), '');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_vendor_primary_from_contacts ON public.workspace_vendors;
CREATE TRIGGER trg_sync_vendor_primary_from_contacts
  BEFORE INSERT OR UPDATE OF contacts ON public.workspace_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_sync_vendor_primary_from_contacts();

-- ============================================================================
-- 4. Yearly Trip ID Generator Alignment (IST Creation Year) & Preview RPC
-- ============================================================================
-- Seed/align deal_id_sequences from existing valid DDSMV/VDSMV-YY-XXX records
INSERT INTO public.deal_id_sequences (deal_channel, year, last_val)
SELECT
  CASE WHEN deal_reference_id LIKE 'VDSMV-%' THEN 'VENDOR' ELSE 'DIRECT' END AS deal_channel,
  2000 + (regexp_match(deal_reference_id, '^[DV]DSMV-([0-9]{2})-([0-9]+)$'))[1]::INTEGER AS year,
  MAX((regexp_match(deal_reference_id, '^[DV]DSMV-([0-9]{2})-([0-9]+)$'))[2]::INTEGER) AS last_val
FROM public.workspace_trips
WHERE deal_reference_id ~ '^[DV]DSMV-[0-9]{2}-[0-9]+$'
GROUP BY 1, 2
ON CONFLICT (deal_channel, year) DO UPDATE
SET last_val = GREATEST(public.deal_id_sequences.last_val, EXCLUDED.last_val);

CREATE OR REPLACE FUNCTION public.fn_generate_deal_reference_id()
RETURNS TRIGGER AS $$
DECLARE
  v_year INTEGER;
  v_short_year TEXT;
  v_next_val INTEGER;
  v_prefix TEXT;
  v_seq_str TEXT;
BEGIN
  -- Always derive YY from Asia/Kolkata creation year (resets 001 each Jan 1 IST)
  v_year := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'))::INTEGER;
  v_short_year := lpad((v_year % 100)::TEXT, 2, '0');
  v_prefix := CASE WHEN NEW.deal_channel = 'VENDOR' THEN 'VDSMV' ELSE 'DDSMV' END;

  INSERT INTO public.deal_id_sequences (deal_channel, year, last_val)
  VALUES (NEW.deal_channel, v_year, 1)
  ON CONFLICT (deal_channel, year)
  DO UPDATE SET last_val = public.deal_id_sequences.last_val + 1
  RETURNING last_val INTO v_next_val;

  v_seq_str := CASE
    WHEN v_next_val < 1000 THEN lpad(v_next_val::TEXT, 3, '0')
    ELSE v_next_val::TEXT
  END;

  NEW.deal_reference_id := v_prefix || '-' || v_short_year || '-' || v_seq_str;
  NEW.travel_year := COALESCE(NEW.travel_year, v_year);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Read-only preview RPC for + New Journey modal (non-authoritative; does not increment)
CREATE OR REPLACE FUNCTION public.preview_next_deal_reference_id(
  p_deal_channel TEXT DEFAULT 'DIRECT'
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_channel TEXT := CASE WHEN upper(COALESCE(p_deal_channel, 'DIRECT')) = 'VENDOR' THEN 'VENDOR' ELSE 'DIRECT' END;
  v_year INTEGER := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'))::INTEGER;
  v_short_year TEXT := lpad((v_year % 100)::TEXT, 2, '0');
  v_prefix TEXT := CASE WHEN v_channel = 'VENDOR' THEN 'VDSMV' ELSE 'DDSMV' END;
  v_last_val INTEGER := 0;
  v_next_val INTEGER;
  v_seq_str TEXT;
BEGIN
  SELECT COALESCE(last_val, 0)
  INTO v_last_val
  FROM public.deal_id_sequences
  WHERE deal_channel = v_channel AND year = v_year;

  v_next_val := COALESCE(v_last_val, 0) + 1;
  v_seq_str := CASE
    WHEN v_next_val < 1000 THEN lpad(v_next_val::TEXT, 3, '0')
    ELSE v_next_val::TEXT
  END;

  RETURN v_prefix || '-' || v_short_year || '-' || v_seq_str;
END;
$$;

REVOKE ALL ON FUNCTION public.preview_next_deal_reference_id FROM anon, public;
GRANT EXECUTE ON FUNCTION public.preview_next_deal_reference_id TO authenticated, service_role;

-- Auto-normalize destination on workspace_trips & workspace_vendors before insert/update
CREATE OR REPLACE FUNCTION public.fn_trg_normalize_destination()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.destination IS NOT NULL THEN
    NEW.destination := public.fn_normalize_destination(NEW.destination);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_workspace_trips_normalize_destination ON public.workspace_trips;
CREATE TRIGGER trg_workspace_trips_normalize_destination
  BEFORE INSERT OR UPDATE OF destination ON public.workspace_trips
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_trg_normalize_destination();

DROP TRIGGER IF EXISTS trg_workspace_vendors_normalize_destination ON public.workspace_vendors;
CREATE TRIGGER trg_workspace_vendors_normalize_destination
  BEFORE INSERT OR UPDATE OF destination ON public.workspace_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_trg_normalize_destination();
