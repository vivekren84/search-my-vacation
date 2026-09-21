-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- AD-WS12-001 (Bootstrap Ownership Principle): minimal Journey table,
-- created now so the Decision-stage conversion (BR-012, WS12-005 Section
-- 6.5) has somewhere to write to, since Journey Workspace (WS13) does not
-- exist yet. Nominally owned by WS13 -- extend, do not re-create.
--
-- One-to-one with workspace_journey_planning_records (unique FK): a
-- Journey Planning record converts to at most one Journey, enforced here
-- and re-checked in the conversion RPC (see the final Phase 2 migration).

create table if not exists public.workspace_journeys (
  id uuid primary key default gen_random_uuid(),
  journey_planning_record_id uuid not null unique
    references public.workspace_journey_planning_records (id) on delete restrict,
  traveller_id uuid references public.workspace_travellers (id) on delete restrict,
  corporate_contact_id uuid references public.workspace_corporate_contacts (id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_journeys is
  'Bootstrap journey record (AD-WS12-001), created only via the Journey Planning conversion RPC. Nominally owned by the future Journey Workspace workstream (WS13) -- extend, do not re-create.';

create index if not exists workspace_journeys_traveller_idx on public.workspace_journeys (traveller_id);
create index if not exists workspace_journeys_corporate_contact_idx on public.workspace_journeys (corporate_contact_id);

create trigger workspace_journeys_set_updated_at
  before update on public.workspace_journeys
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_journeys enable row level security;
revoke all on public.workspace_journeys from anon, authenticated;
grant select on public.workspace_journeys to authenticated;

-- No direct insert/update policy for authenticated users: rows are written
-- only by the SECURITY DEFINER conversion RPC (final Phase 2 migration),
-- which runs with elevated privilege and bypasses RLS by design -- the
-- same reasoning already applied to other SECURITY DEFINER functions in
-- this schema (e.g. workspace_current_user_role()).
create policy workspace_journeys_select_authenticated
  on public.workspace_journeys for select to authenticated using (true);
