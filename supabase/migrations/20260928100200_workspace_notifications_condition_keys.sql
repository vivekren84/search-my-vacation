-- EBC-R1.3-WS13-005 Phase 0, migration M03 (EBC-R1.3-WS13-004 §6.2,
-- WP-0.3). AD-WS13-005: condition-keyed alerts with condition-based
-- resolution (FR-JW-26, BR-017, BR-042).
--
-- condition_key identifies the business condition an Action Required alert
-- is about (for example 'journey:<id>:AL-05:booking:<id>'). The partial
-- unique index guarantees at most ONE active (unresolved) notification per
-- condition and recipient (FR-JW-26 AC1). Reading a notification (is_read)
-- never resolves it; only resolved_at does (BR-017). Informational
-- notifications and every pre-existing row keep condition_key NULL and are
-- unaffected.
--
-- Additive only. Rollback (forward-fix): drop the index, the CHECK and the
-- three columns.

alter table public.workspace_notifications
  add column if not exists condition_key text,
  add column if not exists resolved_at timestamptz,
  add column if not exists resolution text;

alter table public.workspace_notifications
  add constraint workspace_notifications_resolution_check
  check (
    (resolved_at is null and resolution is null)
    or (resolved_at is not null and resolution in ('condition_cleared', 'journey_terminal', 'superseded'))
  );

create unique index if not exists workspace_notifications_active_condition_uidx
  on public.workspace_notifications (condition_key, recipient_user_id)
  where resolved_at is null and condition_key is not null;

comment on column public.workspace_notifications.condition_key is
  'AD-WS13-005: stable key of the business condition an Action Required alert is about. NULL for informational notifications and all pre-WS13 rows.';
comment on column public.workspace_notifications.resolved_at is
  'AD-WS13-005 / BR-017: set only when the underlying condition resolves (never by reading or acknowledging).';
