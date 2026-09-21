-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- Planning Activities: the Discovery-stage notes and structured vendor
-- quotations a Workspace User records against a Journey Planning record
-- (WS12-003 Section 5 Discovery stage; WS12-004 UX screens JP-04, JP-06).
-- Kept as two tables rather than one generic table because vendor
-- quotations carry structured, queryable fields (amount, currency, status)
-- that free-text activity notes do not -- collapsing them would force
-- either a sparse generic schema or jsonb fields that lose the benefit of
-- typed columns for a genuinely different use case.

create table if not exists public.workspace_planning_activities (
  id uuid primary key default gen_random_uuid(),
  journey_planning_record_id uuid not null
    references public.workspace_journey_planning_records (id) on delete cascade,
  activity_type text not null check (activity_type in ('discovery_note', 'internal_comment', 'vendor_contact_log')),
  content text not null,
  author_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now()
);

comment on table public.workspace_planning_activities is
  'Free-text planning activity entries (discovery notes, internal comments, vendor contact logs) against a Journey Planning record. Append-only -- no update/delete policy, matching this schema''s existing convention for historical entries.';

create index if not exists workspace_planning_activities_record_idx
  on public.workspace_planning_activities (journey_planning_record_id, created_at desc);

alter table public.workspace_planning_activities enable row level security;
revoke all on public.workspace_planning_activities from anon, authenticated;
grant select, insert on public.workspace_planning_activities to authenticated;

create policy workspace_planning_activities_select_authenticated
  on public.workspace_planning_activities for select to authenticated using (true);
create policy workspace_planning_activities_insert_authenticated
  on public.workspace_planning_activities for insert to authenticated with check (author_user_id = auth.uid());

create table if not exists public.workspace_vendor_quotations (
  id uuid primary key default gen_random_uuid(),
  journey_planning_record_id uuid not null
    references public.workspace_journey_planning_records (id) on delete cascade,
  vendor_id uuid not null references public.workspace_vendors (id) on delete restrict,
  quotation_amount numeric(12, 2),
  currency text,
  notes text,
  status text not null default 'requested' check (status in ('requested', 'received', 'accepted', 'rejected')),
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_vendor_quotations is
  'Structured vendor quotation records against a Journey Planning record (WS12-004 UX screen JP-06).';

create index if not exists workspace_vendor_quotations_record_idx
  on public.workspace_vendor_quotations (journey_planning_record_id);
create index if not exists workspace_vendor_quotations_vendor_idx
  on public.workspace_vendor_quotations (vendor_id);

create trigger workspace_vendor_quotations_set_updated_at
  before update on public.workspace_vendor_quotations
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_vendor_quotations enable row level security;
revoke all on public.workspace_vendor_quotations from anon, authenticated;
grant select, insert, update on public.workspace_vendor_quotations to authenticated;

create policy workspace_vendor_quotations_select_authenticated
  on public.workspace_vendor_quotations for select to authenticated using (true);
create policy workspace_vendor_quotations_insert_authenticated
  on public.workspace_vendor_quotations for insert to authenticated with check (created_by_user_id = auth.uid());
create policy workspace_vendor_quotations_update_authenticated
  on public.workspace_vendor_quotations for update to authenticated using (true) with check (true);
