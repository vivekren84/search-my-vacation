-- Migration: 20261123000000_client_crm_m2.sql
-- Release 1.5 Milestone 2: Master Client CRM, Structured Preference Tagging & Lead Briefing Workspace
-- Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
-- Chartered Items: US-004 (Master Client Profiles), US-005 (Preference Tags & Attribution), US-006 (Activity Feed), GAP-04 (Handoff Briefing)
-- Invariant: BOUND-01 Public Customer Decoupling (No foreign keys to public tables).

-- 1. Enhance public.workspace_travellers with CRM master fields
ALTER TABLE public.workspace_travellers
  ADD COLUMN IF NOT EXISTS phone_e164 text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS dob date,
  ADD COLUMN IF NOT EXISTS lead_source text,
  ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Constraint on lead_source
ALTER TABLE public.workspace_travellers
  DROP CONSTRAINT IF EXISTS workspace_travellers_lead_source_check;

ALTER TABLE public.workspace_travellers
  ADD CONSTRAINT workspace_travellers_lead_source_check
  CHECK (lead_source IS NULL OR lead_source = ANY (ARRAY[
    'founder_network'::text,
    'client_referral'::text,
    'instagram'::text,
    'website'::text,
    'concierge_partner'::text,
    'other'::text
  ]));

-- Index for instant duplicate detection on normalized phone and email
CREATE INDEX IF NOT EXISTS idx_workspace_travellers_phone_e164
  ON public.workspace_travellers (phone_e164);

CREATE INDEX IF NOT EXISTS idx_workspace_travellers_email_lower
  ON public.workspace_travellers (lower(email));

-- 2. Create public.workspace_client_companions for linked household members & co-travellers
CREATE TABLE IF NOT EXISTS public.workspace_client_companions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('spouse', 'child', 'parent', 'friend', 'colleague', 'other')),
  dob date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_client_companions_client
  ON public.workspace_client_companions (client_id);

ALTER TABLE public.workspace_client_companions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_client_companions FROM public, anon;
GRANT ALL ON public.workspace_client_companions TO authenticated, service_role;

CREATE POLICY workspace_client_companions_authenticated ON public.workspace_client_companions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Create public.workspace_client_tags for structured preference tagging
CREATE TABLE IF NOT EXISTS public.workspace_client_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('dietary', 'pace', 'accommodation', 'comfort', 'general')),
  tag_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_client_tags_lookup
  ON public.workspace_client_tags (client_id, category);

CREATE INDEX IF NOT EXISTS idx_workspace_client_tags_search
  ON public.workspace_client_tags (tag_value);

ALTER TABLE public.workspace_client_tags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_client_tags FROM public, anon;
GRANT ALL ON public.workspace_client_tags TO authenticated, service_role;

CREATE POLICY workspace_client_tags_authenticated ON public.workspace_client_tags
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Create public.workspace_client_activities for chronological timeline & notes
CREATE TABLE IF NOT EXISTS public.workspace_client_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.workspace_travellers(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES public.workspace_journeys(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.workspace_users(user_id) ON DELETE SET NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('system', 'call', 'whatsapp', 'meeting', 'note')),
  body text NOT NULL,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_client_activities_client_chronological
  ON public.workspace_client_activities (client_id, created_at DESC);

ALTER TABLE public.workspace_client_activities ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.workspace_client_activities FROM public, anon;
GRANT ALL ON public.workspace_client_activities TO authenticated, service_role;

CREATE POLICY workspace_client_activities_authenticated ON public.workspace_client_activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
