-- EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
-- Establishes workspace_users (Supabase Auth-linked) and the Workspace RBAC
-- foundation only: the mechanism (role storage, RLS, the
-- workspace_current_user_role() helper), per AD-WS11-002 (Supabase Auth +
-- RLS) and AD-WS11-003 (workspace_ table prefix). No business permission
-- matrix is implemented here — OQ-001's per-screen capability matrix is not
-- yet ratified, so every Workspace user is simply one of exactly two roles.
-- This migration is additive: it does not drop or replace any existing
-- object. This is also the first migration in this repository to reference
-- auth.users — Supabase Auth has no prior usage here (AD-WS11-002).

create table if not exists public.workspace_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null
    check (role in ('administrator', 'privilege_user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_users is
  'One row per SMV Workspace staff account (Administrator or Privilege User), one-to-one with auth.users. WS11 foundation only (EBC-R1.3-WS11-007) — no per-screen capability matrix yet (OQ-001).';

create index if not exists workspace_users_role_idx
  on public.workspace_users (role);

-- updated_at maintenance. This repository has no shared updated_at trigger
-- convention to reuse (existing tables set it explicitly at the application
-- layer); a small dedicated trigger is added here since workspace_users is
-- the first Auth-linked, Administrator-editable table, where a missed
-- application-level write would otherwise go unnoticed.
create or replace function public.set_workspace_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspace_users_set_updated_at on public.workspace_users;
create trigger workspace_users_set_updated_at
  before update on public.workspace_users
  for each row
  execute function public.set_workspace_users_updated_at();

alter table public.workspace_users enable row level security;
revoke all on table public.workspace_users from anon, authenticated;
grant select on table public.workspace_users to authenticated;

-- SECURITY DEFINER: reads the calling user's own role without recursing
-- through the RLS policies defined below (a policy on workspace_users
-- cannot safely query workspace_users again under the caller's own
-- row-level permissions). Returns null for a signed-in Auth user with no
-- workspace_users row (not yet provisioned as Workspace staff) rather than
-- raising, so callers can treat "no role" as "no Workspace access" without
-- a separate existence check.
create or replace function public.workspace_current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.workspace_users
  where user_id = auth.uid();
$$;

grant execute on function public.workspace_current_user_role() to authenticated;

-- A Workspace user may always read their own row.
create policy workspace_users_select_own
  on public.workspace_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- An Administrator may read every Workspace user's row (RLS foundation for
-- the future user-management screens).
create policy workspace_users_select_administrator
  on public.workspace_users
  for select
  to authenticated
  using (public.workspace_current_user_role() = 'administrator');

-- No insert/update/delete policy is created for `authenticated` in this
-- migration: provisioning a workspace_users row (assigning the first role
-- to a newly invited Auth user) is Administrator-initiated user creation,
-- which is explicitly WS-Eng-1 scope (Section 8 of this EBC lists only the
-- RBAC *mechanism*, not the creation flow). Until that ships, rows are
-- written only via the service_role key (bypasses RLS) — e.g. directly in
-- the Supabase dashboard, which is also how this phase's manual test user
-- must be provisioned to functionally verify sign-in end-to-end.
