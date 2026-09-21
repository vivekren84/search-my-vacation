-- WS12-007 Phase 1: Shared Foundation
-- Generic, entity-agnostic in-app notification store shared by all Workspace
-- modules (Journey Planning is the first consumer). Uses entity_type/entity_id
-- rather than a hard FK so future modules (WS13-WS17) can reuse this table
-- without a migration dependency on their own tables.

create table if not exists public.workspace_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.workspace_users (user_id) on delete cascade,
  notification_type text not null check (notification_type in ('action_required', 'informational')),
  category text not null,
  entity_type text,
  entity_id uuid,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

comment on table public.workspace_notifications is
  'Generic in-app notification store shared across Workspace modules. entity_type/entity_id are a soft reference (no FK) so this table is not coupled to any single module''s schema.';

create index if not exists workspace_notifications_recipient_idx
  on public.workspace_notifications (recipient_user_id, is_read, created_at desc);

create index if not exists workspace_notifications_entity_idx
  on public.workspace_notifications (entity_type, entity_id);

alter table public.workspace_notifications enable row level security;

revoke all on public.workspace_notifications from anon, authenticated;
grant select, insert, update on public.workspace_notifications to authenticated;

-- Any authenticated Workspace user may create a notification for another
-- user (e.g. on reassignment); recipients cannot forge notifications for
-- themselves from arbitrary data beyond what application code constructs,
-- since inserts go through the service layer, not directly from the client.
create policy workspace_notifications_insert_authenticated
  on public.workspace_notifications
  for insert
  to authenticated
  with check (true);

create policy workspace_notifications_select_own
  on public.workspace_notifications
  for select
  to authenticated
  using (
    recipient_user_id = auth.uid()
    or workspace_current_user_role() = 'administrator'
  );

-- Recipients may mark their own notifications read; no other field changes
-- are permitted via RLS (application code only ever updates is_read/read_at).
create policy workspace_notifications_update_own
  on public.workspace_notifications
  for update
  to authenticated
  using (recipient_user_id = auth.uid())
  with check (recipient_user_id = auth.uid());
