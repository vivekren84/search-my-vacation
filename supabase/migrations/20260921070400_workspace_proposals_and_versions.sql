-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- DEC-R1.3-013 (Proposal Hierarchy Principle, ratified): Proposal is the
-- primary object; Proposal Versions are immutable historical revisions
-- belonging to a Proposal. One Proposal per Journey Planning record
-- (structurally unique).
--
-- DEC-R1.3-014 (Proposal Version Itinerary Principle, ratified): every
-- Proposal Version owns an immutable itinerary snapshot. Itineraries are
-- NOT independently versioned -- any itinerary change creates a new
-- Proposal Version with a new snapshot; all previous versions/snapshots
-- remain unchanged. Engineering therefore stores the itinerary as an
-- append-only jsonb column on workspace_proposal_versions itself, never as
-- a separate mutable "itinerary" table or a foreign key to one -- the
-- absence of a separate itinerary table IS the implementation of this
-- principle, not an omission.
--
-- "Current version" is tracked exclusively via
-- workspace_proposals.current_version_id, not via a boolean column on
-- workspace_proposal_versions. This is a deliberate engineering choice
-- (WS12-007 Engineering Decision Log): a boolean "is_current" flag on this
-- table would require updating a previous version row when a new one
-- becomes current, which would compromise true immutability and require an
-- UPDATE grant this table intentionally does not have. Pointing at the
-- current version from the mutable parent (workspace_proposals) instead
-- keeps workspace_proposal_versions genuinely insert-only.
--
-- itinerary_snapshot's field-level jsonb shape is an engineering
-- implementation decision (recorded in the WS12-007 Engineering Decision
-- Log): no prior artefact specifies Traveller Itinerary field-level
-- content, since Itinerary Studio (WS15) has not been speced. The shape
-- below is intentionally minimal and is validated at the application layer
-- (Phase 3 validation.ts), not by a jsonb schema constraint, so it can be
-- extended by a future workstream without a migration:
--   {
--     "destinations": [{ "name": string, "nights": number, "notes": string|null }],
--     "startDate": string|null,   -- ISO date
--     "endDate": string|null,     -- ISO date
--     "travellerCount": number|null,
--     "priceEstimate": { "amount": number, "currency": string }|null,
--     "inclusions": string[],
--     "notes": string|null
--   }

create table if not exists public.workspace_proposals (
  id uuid primary key default gen_random_uuid(),
  journey_planning_record_id uuid not null unique
    references public.workspace_journey_planning_records (id) on delete restrict,
  current_version_id uuid,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_proposals is
  'Proposal header (DEC-R1.3-013 Proposal Hierarchy Principle). One Proposal per Journey Planning record; current_version_id points at the current workspace_proposal_versions row (the single source of truth for "current", per the WS12-007 Engineering Decision Log).';

create trigger workspace_proposals_set_updated_at
  before update on public.workspace_proposals
  for each row execute function public.set_workspace_updated_at();

create table if not exists public.workspace_proposal_versions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.workspace_proposals (id) on delete cascade,
  version_number integer not null,
  itinerary_snapshot jsonb not null,
  summary text,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (proposal_id, version_number)
);

comment on table public.workspace_proposal_versions is
  'Append-only, immutable Proposal Versions (DEC-R1.3-014). Each row owns its own itinerary_snapshot and is never updated or deleted after creation -- a new itinerary change always inserts a new row and repoints workspace_proposals.current_version_id at it.';

-- Now that workspace_proposal_versions exists, wire the forward reference.
alter table public.workspace_proposals
  add constraint workspace_proposals_current_version_id_fkey
  foreign key (current_version_id) references public.workspace_proposal_versions (id) on delete set null;

create index if not exists workspace_proposal_versions_proposal_idx
  on public.workspace_proposal_versions (proposal_id, version_number desc);

alter table public.workspace_proposals enable row level security;
revoke all on public.workspace_proposals from anon, authenticated;
grant select, insert, update on public.workspace_proposals to authenticated;

create policy workspace_proposals_select_authenticated
  on public.workspace_proposals for select to authenticated using (true);
create policy workspace_proposals_insert_authenticated
  on public.workspace_proposals for insert to authenticated with check (created_by_user_id = auth.uid());
-- In practice application code only ever updates current_version_id (and
-- updated_at); RLS grants the general authenticated boundary here, matching
-- the pattern already used for workspace_journey_planning_records.
create policy workspace_proposals_update_authenticated
  on public.workspace_proposals for update to authenticated using (true) with check (true);

alter table public.workspace_proposal_versions enable row level security;
revoke all on public.workspace_proposal_versions from anon, authenticated;
-- Insert only: no UPDATE or DELETE grant exists for this table at all, by
-- design -- this is the database-level enforcement of the
-- immutable-snapshot principle in DEC-R1.3-014.
grant select, insert on public.workspace_proposal_versions to authenticated;

create policy workspace_proposal_versions_select_authenticated
  on public.workspace_proposal_versions for select to authenticated using (true);
create policy workspace_proposal_versions_insert_authenticated
  on public.workspace_proposal_versions for insert to authenticated with check (created_by_user_id = auth.uid());
