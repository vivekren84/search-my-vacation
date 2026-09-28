-- EBC-R1.3-WS13-005 Phase 0, migration M02 (EBC-R1.3-WS13-004 §6.2/§6.4,
-- WP-0.2). AD-WS13-005 (system actor) and AD-WS13-004 (Recent Activity
-- feed index).
--
-- 1. Extends the event_type CHECK once, with the complete WS13 list, so
--    later phases do not need to drop and re-add it again. Follows the
--    extend-never-replace convention of 20260922080100 and 20260922090100:
--    every existing value is kept.
-- 2. Allows actor_id to be NULL for system-originated events ONLY
--    (alert_raised, alert_resolved, legacy_backfilled), enforced by a CHECK.
--    Human events still require an actor, and the existing insert policy
--    (actor_id = auth.uid()) still stops an authenticated user from writing
--    a NULL-actor row directly: a NULL actor can only be written by a
--    SECURITY DEFINER function or the service role.
-- 3. Adds (entity_type, created_at desc) for the Dashboard Recent Activity
--    feed (FR-JW-33).
--
-- Rollback (forward-fix): re-add the previous 13-value CHECK only after no
-- WS13 rows exist; set actor_id NOT NULL only after no NULL rows exist;
-- drop the index. The audit log is append-only; no existing row changes.

alter table public.workspace_audit_log
  drop constraint workspace_audit_log_event_type_check;

alter table public.workspace_audit_log
  add constraint workspace_audit_log_event_type_check
  check (event_type in (
    -- WS12 (unchanged)
    'created',
    'claimed',
    'reassigned',
    'stage_transition',
    'proposal_version_created',
    'proposal_sent',
    'vendor_quotation_recorded',
    'record_converted',
    'record_closed',
    'archived',
    'task_created',
    'task_updated',
    'trip_basics_updated',
    -- WS13 Journey Workspace (EBC-R1.3-WS13-004 §6.4)
    'journey_created',
    'journey_stage_changed',
    'journey_stage_stepped_back',
    'journey_on_hold',
    'journey_resumed',
    'journey_cancelled',
    'journey_closed',
    'journey_superseded',
    'journey_reassigned',
    'journey_archived',
    'journey_service_category_changed',
    'journey_contact_changed',
    'journey_template_assigned',
    'journey_template_changed',
    'journey_legacy_adopted',
    'readiness_item_updated',
    'vendor_booking_created',
    'vendor_booking_status_changed',
    'vendor_booking_updated',
    'document_added',
    'document_status_changed',
    'document_updated',
    'document_reference_updated',
    'change_record_created',
    'activity_logged',
    'note_added',
    'material_change_started',
    -- System events (actor_id may be NULL; AD-WS13-005)
    'alert_raised',
    'alert_resolved',
    'legacy_backfilled'
  ));

alter table public.workspace_audit_log
  alter column actor_id drop not null;

alter table public.workspace_audit_log
  add constraint workspace_audit_log_system_actor_check
  check (
    actor_id is not null
    or event_type in ('alert_raised', 'alert_resolved', 'legacy_backfilled')
  );

comment on column public.workspace_audit_log.actor_id is
  'The Workspace User who caused the event. NULL only for system events (alert_raised, alert_resolved, legacy_backfilled; AD-WS13-005), shown as "Workspace (automatic)" (UX §21, PD-ARC-08).';

create index if not exists workspace_audit_log_entity_type_created_idx
  on public.workspace_audit_log (entity_type, created_at desc);
