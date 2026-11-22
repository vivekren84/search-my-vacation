-- Rollback Migration: 20261122000000_staff_auth_rbac_m1.rollback.sql
-- Release 1.5 Milestone 1: Rollback script for Staff Authentication, Smart Single-Channel OTP & RBAC Foundation

-- 1. Revert workspace_audit_log constraints
ALTER TABLE public.workspace_audit_log
  DROP CONSTRAINT IF EXISTS workspace_audit_log_system_actor_check;

ALTER TABLE public.workspace_audit_log
  ADD CONSTRAINT workspace_audit_log_system_actor_check
  CHECK (((actor_id IS NOT NULL) OR (event_type = ANY (ARRAY['alert_raised'::text, 'alert_resolved'::text, 'legacy_backfilled'::text]))));

ALTER TABLE public.workspace_audit_log
  DROP CONSTRAINT IF EXISTS workspace_audit_log_event_type_check;

ALTER TABLE public.workspace_audit_log
  ADD CONSTRAINT workspace_audit_log_event_type_check
  CHECK ((event_type = ANY (ARRAY['created'::text, 'claimed'::text, 'reassigned'::text, 'stage_transition'::text, 'proposal_version_created'::text, 'proposal_sent'::text, 'vendor_quotation_recorded'::text, 'record_converted'::text, 'record_closed'::text, 'archived'::text, 'task_created'::text, 'task_updated'::text, 'trip_basics_updated'::text, 'journey_created'::text, 'journey_stage_changed'::text, 'journey_stage_stepped_back'::text, 'journey_on_hold'::text, 'journey_resumed'::text, 'journey_cancelled'::text, 'journey_closed'::text, 'journey_superseded'::text, 'journey_reassigned'::text, 'journey_archived'::text, 'journey_service_category_changed'::text, 'journey_contact_changed'::text, 'journey_template_assigned'::text, 'journey_template_changed'::text, 'journey_legacy_adopted'::text, 'readiness_item_updated'::text, 'vendor_booking_created'::text, 'vendor_booking_status_changed'::text, 'vendor_booking_updated'::text, 'document_added'::text, 'document_status_changed'::text, 'document_updated'::text, 'document_reference_updated'::text, 'change_record_created'::text, 'activity_logged'::text, 'note_added'::text, 'material_change_started'::text, 'alert_raised'::text, 'alert_resolved'::text, 'legacy_backfilled'::text])));

-- 2. Drop staff_otp_challenges table
DROP TABLE IF EXISTS public.staff_otp_challenges CASCADE;

-- 3. Revert workspace_users constraints and columns
ALTER TABLE public.workspace_users
  DROP CONSTRAINT IF EXISTS workspace_users_last_otp_channel_check;

ALTER TABLE public.workspace_users
  DROP CONSTRAINT IF EXISTS workspace_users_role_check;

ALTER TABLE public.workspace_users
  ADD CONSTRAINT workspace_users_role_check
  CHECK ((role = ANY (ARRAY['administrator'::text, 'privilege_user'::text])));

ALTER TABLE public.workspace_users
  DROP COLUMN IF EXISTS last_otp_channel,
  DROP COLUMN IF EXISTS last_login_at,
  DROP COLUMN IF EXISTS registered_mobile;
