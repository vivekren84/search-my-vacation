-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- The core Journey Planning record: one row per lead/opportunity moving
-- through the seven-stage lifecycle (WS12-003 Section 5). Created before
-- workspace_journeys (Phase 2, next migration) precisely to avoid the
-- forward-FK-reference problem in WS12-006's own suggested ordering
-- (Section 5.3): journeys.journey_planning_record_id needs this table to
-- already exist. Recorded in the WS12-007 Engineering Decision Log as an
-- implementation-detail sequencing correction, not a change to any
-- approved architecture.
--
-- destination_region is a nullable free-text column, not an FK, because
-- Destination Intelligence (WS17) does not exist yet -- an engineering
-- implementation-detail decision (no structured destination model exists
-- to reference), recorded in the WS12-007 Engineering Decision Log.
--
-- stage/outcome model the seven-stage lifecycle: stage carries the current
-- lifecycle position; outcome is only set once stage = 'closed' and records
-- which of the three closure kinds applied (WS12-003 Section 5, WS12-006
-- Section "Implementation Strategy"). Transitions between stages are
-- enforced in application code (advanceStage(), Phase 3 service layer),
-- never at the database layer alone, per WS12-003 Section 5's explicit
-- direction.

create table if not exists public.workspace_journey_planning_records (
  id uuid primary key default gen_random_uuid(),
  record_kind text not null check (record_kind in ('individual', 'corporate')),
  traveller_id uuid references public.workspace_travellers (id) on delete restrict,
  corporate_contact_id uuid references public.workspace_corporate_contacts (id) on delete restrict,
  title text not null,
  destination_region text,
  stage text not null default 'lead_created' check (
    stage in ('lead_created', 'discovery', 'planning', 'proposal_shared', 'revision', 'decision', 'closed')
  ),
  outcome text check (outcome in ('confirmed', 'lost', 'archived')),
  owner_id uuid references public.workspace_users (user_id) on delete set null,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_journey_planning_records_party_check check (
    (record_kind = 'individual' and traveller_id is not null and corporate_contact_id is null)
    or (record_kind = 'corporate' and corporate_contact_id is not null)
  ),
  constraint workspace_journey_planning_records_outcome_check check (
    (stage = 'closed' and outcome is not null) or (stage <> 'closed' and outcome is null)
  )
);

comment on table public.workspace_journey_planning_records is
  'Journey Planning''s primary record (WS12-003 Section 5). One row per lead/opportunity moving through the seven-stage lifecycle. Stage transitions are validated in application code, not by a database constraint alone.';

create index if not exists workspace_journey_planning_records_stage_idx
  on public.workspace_journey_planning_records (stage);
create index if not exists workspace_journey_planning_records_owner_idx
  on public.workspace_journey_planning_records (owner_id);
create index if not exists workspace_journey_planning_records_traveller_idx
  on public.workspace_journey_planning_records (traveller_id);
create index if not exists workspace_journey_planning_records_corporate_contact_idx
  on public.workspace_journey_planning_records (corporate_contact_id);

create trigger workspace_journey_planning_records_set_updated_at
  before update on public.workspace_journey_planning_records
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_journey_planning_records enable row level security;
revoke all on public.workspace_journey_planning_records from anon, authenticated;
grant select, insert, update on public.workspace_journey_planning_records to authenticated;

-- WS12-005 Section 7.4: Journey Planning is a collaborative operational
-- queue -- every Workspace User can see every record (so an unclaimed
-- record is discoverable), not just records they own. Claim/reassign/edit
-- authorization is enforced in application code via
-- shared/rbac/permissions.ts's record-scoped functions, not by RLS alone;
-- RLS here provides the coarse authenticated/administrator boundary.
create policy workspace_journey_planning_records_select_authenticated
  on public.workspace_journey_planning_records for select to authenticated using (true);
create policy workspace_journey_planning_records_insert_authenticated
  on public.workspace_journey_planning_records for insert to authenticated with check (created_by_user_id = auth.uid());
create policy workspace_journey_planning_records_update_authenticated
  on public.workspace_journey_planning_records for update to authenticated using (true) with check (true);
