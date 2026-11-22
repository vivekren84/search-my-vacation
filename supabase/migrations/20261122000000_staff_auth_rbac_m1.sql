-- Migration: 20261122000000_staff_auth_rbac_m1.sql
-- Release 1.5 Milestone 1: Staff Authentication, Smart Single-Channel OTP & RBAC Foundation
-- Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
-- Chartered Items: US-001 (Account Provisioning), US-002 (Smart OTP), US-003 (Step-Up PII), US-017 (Audit Log)
-- Invariants: Preserves BOUND-01 public customer conversion isolation.

-- 1. Enhance public.workspace_users for registered mobile and desk_user role
ALTER TABLE public.workspace_users
  ADD COLUMN IF NOT EXISTS registered_mobile text,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_otp_channel text;

-- Update role check constraint to include desk_user
ALTER TABLE public.workspace_users
  DROP CONSTRAINT IF EXISTS workspace_users_role_check;

ALTER TABLE public.workspace_users
  ADD CONSTRAINT workspace_users_role_check
  CHECK (role = ANY (ARRAY['administrator'::text, 'privilege_user'::text, 'desk_user'::text]));

-- Check constraint for last_otp_channel
ALTER TABLE public.workspace_users
  DROP CONSTRAINT IF EXISTS workspace_users_last_otp_channel_check;

ALTER TABLE public.workspace_users
  ADD CONSTRAINT workspace_users_last_otp_channel_check
  CHECK (last_otp_channel IS NULL OR last_otp_channel = ANY (ARRAY['email'::text, 'sms'::text]));

-- 2. Create staff_otp_challenges table for isolated internal single-channel OTP dispatch
CREATE TABLE IF NOT EXISTS public.staff_otp_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email', 'sms')),
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  cooldown_until timestamptz NOT NULL,
  verified_at timestamptz,
  purpose text NOT NULL DEFAULT 'login' CHECK (purpose IN ('login', 'pii_unmask')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_otp_challenges_user_lookup
  ON public.staff_otp_challenges (user_id, purpose, expires_at);

CREATE INDEX IF NOT EXISTS idx_staff_otp_challenges_cooldown
  ON public.staff_otp_challenges (user_id, cooldown_until);

-- Row Level Security on staff_otp_challenges: Strictly service_role / internal backend
ALTER TABLE public.staff_otp_challenges ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.staff_otp_challenges FROM public, anon, authenticated;
GRANT ALL ON public.staff_otp_challenges TO service_role;

-- 3. Enhance public.workspace_audit_log to accommodate staff security and PII unmasking events
ALTER TABLE public.workspace_audit_log
  DROP CONSTRAINT IF EXISTS workspace_audit_log_event_type_check;

ALTER TABLE public.workspace_audit_log
  ADD CONSTRAINT workspace_audit_log_event_type_check
  CHECK (event_type = ANY (ARRAY[
    -- Existing workspace events
    'created'::text, 'claimed'::text, 'reassigned'::text, 'stage_transition'::text,
    'proposal_version_created'::text, 'proposal_sent'::text, 'vendor_quotation_recorded'::text,
    'record_converted'::text, 'record_closed'::text, 'archived'::text, 'task_created'::text,
    'task_updated'::text, 'trip_basics_updated'::text, 'journey_created'::text,
    'journey_stage_changed'::text, 'journey_stage_stepped_back'::text, 'journey_on_hold'::text,
    'journey_resumed'::text, 'journey_cancelled'::text, 'journey_closed'::text,
    'journey_superseded'::text, 'journey_reassigned'::text, 'journey_archived'::text,
    'journey_service_category_changed'::text, 'journey_contact_changed'::text,
    'journey_template_assigned'::text, 'journey_template_changed'::text, 'journey_legacy_adopted'::text,
    'readiness_item_updated'::text, 'vendor_booking_created'::text, 'vendor_booking_status_changed'::text,
    'vendor_booking_updated'::text, 'document_added'::text, 'document_status_changed'::text,
    'document_updated'::text, 'document_reference_updated'::text, 'change_record_created'::text,
    'activity_logged'::text, 'note_added'::text, 'material_change_started'::text,
    'alert_raised'::text, 'alert_resolved'::text, 'legacy_backfilled'::text,
    -- Release 1.5 Staff Portal Security Events
    'staff_login_otp_dispatched'::text,
    'staff_login_succeeded'::text,
    'staff_login_failed'::text,
    'staff_session_invalidated'::text,
    'pii_unmask_requested'::text,
    'pii_unmask_succeeded'::text,
    'user_provisioned'::text,
    'user_deactivated'::text,
    'user_reactivated'::text,
    'role_changed'::text,
    'margin_override_requested'::text,
    'margin_override_approved'::text,
    'margin_override_rejected'::text,
    'financial_export_generated'::text
  ]));

-- Allow system events where actor_id might be null during pre-auth challenge
ALTER TABLE public.workspace_audit_log
  DROP CONSTRAINT IF EXISTS workspace_audit_log_system_actor_check;

ALTER TABLE public.workspace_audit_log
  ADD CONSTRAINT workspace_audit_log_system_actor_check
  CHECK (
    actor_id IS NOT NULL OR event_type = ANY (ARRAY[
      'alert_raised'::text, 'alert_resolved'::text, 'legacy_backfilled'::text,
      'staff_login_otp_dispatched'::text, 'staff_login_failed'::text
    ])
  );

-- Enforce Immutability on workspace_audit_log (US-017)
REVOKE UPDATE, DELETE ON public.workspace_audit_log FROM public, anon, authenticated;
