-- WS12-007 Phase 1: Shared Foundation
-- Generic task / follow-up tracking shared across Workspace modules.
-- entity_type/entity_id (soft reference, no FK) for the same reason as
-- workspace_notifications: this table is not owned by Journey Planning and
-- must not depend on Journey Planning's own tables existing first.

create table if not exists public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  title text not null,
  description text,
  due_at timestamptz,
  status text not null default 'open' check (status in ('open', 'completed', 'cancelled')),
  assigned_to_user_id uuid references public.workspace_users (user_id) on delete set null,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

comment on table public.workspace_tasks is
  'Generic task/follow-up entries shared across Workspace modules, linked to their owning record via entity_type/entity_id rather than a hard FK.';

create index if not exists workspace_tasks_entity_idx
  on public.workspace_tasks (entity_type, entity_id);

create index if not exists workspace_tasks_assignee_idx
  on public.workspace_tasks (assigned_to_user_id, status, due_at);

create trigger workspace_tasks_set_updated_at
  before update on public.workspace_tasks
  for each row
  execute function public.set_workspace_updated_at();

alter table public.workspace_tasks enable row level security;

revoke all on public.workspace_tasks from anon, authenticated;
grant select, insert, update on public.workspace_tasks to authenticated;

create policy workspace_tasks_select_authenticated
  on public.workspace_tasks
  for select
  to authenticated
  using (true);

create policy workspace_tasks_insert_authenticated
  on public.workspace_tasks
  for insert
  to authenticated
  with check (created_by_user_id = auth.uid());

create policy workspace_tasks_update_assignee_or_creator
  on public.workspace_tasks
  for update
  to authenticated
  using (
    assigned_to_user_id = auth.uid()
    or created_by_user_id = auth.uid()
    or workspace_current_user_role() = 'administrator'
  )
  with check (
    assigned_to_user_id = auth.uid()
    or created_by_user_id = auth.uid()
    or workspace_current_user_role() = 'administrator'
  );
