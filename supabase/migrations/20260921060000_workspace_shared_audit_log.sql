-- EBC-R1.3-WS12-007: Journey Planning Engineering Implementation (Phase 1,
-- Shared Foundation). Establishes the shared, entity-agnostic audit log
-- design that WS11's Data Architecture already approved but never migrated
-- (disclosed by EBC-R1.3-WS12-006 Section 2.2/5.3). Journey Planning is the
-- first consumer, per WS12-005 Solution Architecture Section 7.5: one
-- generic table, extended (not replaced, not duplicated) as future modules
-- need it.
--
-- Also establishes public.set_workspace_updated_at(), a single reusable
-- updated_at trigger function for every subsequent workspace_* table in
-- this and later migrations -- a deliberate, minor improvement over
-- workspace_users_and_roles.sql's own single-table-named
-- set_workspace_users_updated_at() precedent (that table's own trigger is
-- left unchanged; only new tables from this migration forward use the
-- shared function), justified because duplicating a near-identical
-- function once per table would itself violate this project's
-- no-duplicate-utility principle across the ~8 additional mutable tables
-- this workstream introduces. Recorded in the Engineering Decision Log,
-- EBC-R1.3-WS12-007 Section "Engineering Decision Log".
--
-- Additive only: creates new objects, does not alter or drop any existing
-- table, column, function, or policy.

create or replace function public.set_workspace_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.workspace_audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null
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
      'archived'
    )),
  actor_id uuid not null references public.workspace_users (user_id),
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.workspace_audit_log is
  'Shared, entity-agnostic audit trail for every Workspace module (WORKSPACE-DATA-ARCHITECTURE.md audit strategy, approved under WS11, first migrated under WS12-007 as Journey Planning is the first real consumer). event_type is extended, never replaced, as future modules add event kinds -- see WS12-005 Solution Architecture Section 7.5.';

create index if not exists workspace_audit_log_entity_idx
  on public.workspace_audit_log (entity_type, entity_id, created_at desc);

create index if not exists workspace_audit_log_actor_idx
  on public.workspace_audit_log (actor_id);

-- Append-only: no update/delete policy or grant is ever created for this
-- table (matches the archive-not-delete, append-only convention already
-- established for versioned/historical objects elsewhere in this schema).
alter table public.workspace_audit_log enable row level security;
revoke all on table public.workspace_audit_log from anon, authenticated;

-- Broad authenticated read: an audit trail's value is in being visible to
-- every Workspace User investigating a record's history (WS12-005 Section
-- 7.4's "collaborative operational platform" reasoning, already applied to
-- workspace_users' own Administrator-read policy).
grant select on table public.workspace_audit_log to authenticated;
create policy workspace_audit_log_select_authenticated
  on public.workspace_audit_log
  for select
  to authenticated
  using (true);

-- A signed-in Workspace User may only write an audit entry attributed to
-- themselves -- the application layer decides *what* gets logged; RLS only
-- guarantees no user can log an event as impersonating someone else.
grant insert on table public.workspace_audit_log to authenticated;
create policy workspace_audit_log_insert_own
  on public.workspace_audit_log
  for insert
  to authenticated
  with check (actor_id = auth.uid());
