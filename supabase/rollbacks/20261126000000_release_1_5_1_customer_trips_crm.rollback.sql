-- Rollback: 20261126000000_release_1_5_1_customer_trips_crm.rollback.sql
-- Reverts Release 1.5.1 customer/trips schema, triggers, and storage bucket

-- 1. Remove storage bucket policy and bucket
DELETE FROM storage.objects WHERE bucket_id = 'staff-avatars';
DELETE FROM storage.buckets WHERE id = 'staff-avatars';

-- 2. Drop View and Triggers
DROP TRIGGER IF EXISTS trg_workspace_users_governance_locks ON public.workspace_users;
DROP FUNCTION IF EXISTS public.fn_enforce_workspace_user_governance_locks();

DROP TRIGGER IF EXISTS trg_workspace_trips_deal_reference_id ON public.workspace_trips;
DROP FUNCTION IF EXISTS public.fn_generate_deal_reference_id();

-- 3. Drop Tables and Recreate workspace_travellers as table
DROP VIEW IF EXISTS public.workspace_travellers CASCADE;
DROP TABLE IF EXISTS public.workspace_trips CASCADE;
DROP TABLE IF EXISTS public.deal_id_sequences CASCADE;
DROP TABLE IF EXISTS public.workspace_customers CASCADE;
DROP SEQUENCE IF EXISTS public.customer_code_seq;

-- Recreate empty workspace_travellers table
CREATE TABLE IF NOT EXISTS public.workspace_travellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_by_user_id UUID REFERENCES public.workspace_users(user_id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  phone_e164 TEXT,
  nationality TEXT,
  dob DATE,
  lead_source TEXT,
  is_vip BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Reconnect child tables to workspace_travellers
ALTER TABLE public.workspace_client_companions
  DROP CONSTRAINT IF EXISTS workspace_client_companions_client_id_fkey;
ALTER TABLE public.workspace_client_companions
  ADD CONSTRAINT workspace_client_companions_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_tags
  DROP CONSTRAINT IF EXISTS workspace_client_tags_client_id_fkey;
ALTER TABLE public.workspace_client_tags
  ADD CONSTRAINT workspace_client_tags_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_activities
  DROP CONSTRAINT IF EXISTS workspace_client_activities_client_id_fkey;
ALTER TABLE public.workspace_client_activities
  ADD CONSTRAINT workspace_client_activities_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_client_documents
  DROP CONSTRAINT IF EXISTS workspace_client_documents_client_id_fkey;
ALTER TABLE public.workspace_client_documents
  ADD CONSTRAINT workspace_client_documents_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_itineraries
  DROP CONSTRAINT IF EXISTS workspace_itineraries_client_id_fkey;
ALTER TABLE public.workspace_itineraries
  ADD CONSTRAINT workspace_itineraries_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

ALTER TABLE public.workspace_trip_pipeline
  DROP CONSTRAINT IF EXISTS workspace_trip_pipeline_client_id_fkey;
ALTER TABLE public.workspace_trip_pipeline
  ADD CONSTRAINT workspace_trip_pipeline_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.workspace_travellers(id) ON DELETE CASCADE;

-- 4. Revert workspace_users columns
ALTER TABLE public.workspace_users
  DROP COLUMN IF EXISTS professional_title,
  DROP COLUMN IF EXISTS department,
  DROP COLUMN IF EXISTS destination_specializations,
  DROP COLUMN IF EXISTS spoken_languages,
  DROP COLUMN IF EXISTS signature_archetype,
  DROP COLUMN IF EXISTS client_bio,
  DROP COLUMN IF EXISTS timezone_working_hours,
  DROP COLUMN IF EXISTS emergency_standby_contact,
  DROP COLUMN IF EXISTS avatar_preset_id,
  DROP COLUMN IF EXISTS avatar_image_url;
