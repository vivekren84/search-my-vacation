-- EBC-R1.3-WS12-013: Journey Planning Enhancement -- Planning Parameters &
-- Discovery Gate Implementation.
--
-- Adds "trip_basics_updated" to the workspace_audit_log event_type CHECK
-- constraint, for the new Trip Basics update action
-- (journey-planning service.ts, updateJourneyPlanningTripBasics). Follows
-- the same extend-never-replace convention already used by
-- 20260922080100_workspace_audit_log_task_events.sql (itself following
-- the original migration's own stated convention).

alter table public.workspace_audit_log
  drop constraint workspace_audit_log_event_type_check;

alter table public.workspace_audit_log
  add constraint workspace_audit_log_event_type_check
  check (event_type in (
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
    'trip_basics_updated'
  ));
