-- EBC-R1.3-WS12-010: QA Defect Resolution — Defect D1b (Tasks &
-- Follow-ups UI). The original workspace_audit_log CHECK constraint
-- (20260921060000_workspace_shared_audit_log.sql) did not include task
-- events, since no consumer of the shared Tasks module existed at that
-- point. Its own comment already states the intended convention --
-- "event_type is extended, never replaced, as future modules add event
-- kinds" -- so this migration extends the existing constraint rather than
-- introducing a parallel one.

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
    'task_updated'
  ));
