-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- AD-WS12-003: workspace_corporate_contacts is an independent,
-- Journey-Planning-owned table -- explicitly NOT a Traveller Hub variant
-- (a corporate point of contact is not itself a traveller; WS12-005
-- Solution Architecture Section 6.3).

create table if not exists public.workspace_corporate_contacts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  contact_email text,
  contact_phone text,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_corporate_contacts is
  'Corporate point-of-contact record for corporate Journey Planning records (AD-WS12-003). Independently owned by Journey Planning, not a Traveller Hub variant.';

create trigger workspace_corporate_contacts_set_updated_at
  before update on public.workspace_corporate_contacts
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_corporate_contacts enable row level security;
revoke all on public.workspace_corporate_contacts from anon, authenticated;
grant select, insert, update on public.workspace_corporate_contacts to authenticated;

create policy workspace_corporate_contacts_select_authenticated
  on public.workspace_corporate_contacts for select to authenticated using (true);
create policy workspace_corporate_contacts_insert_authenticated
  on public.workspace_corporate_contacts for insert to authenticated with check (created_by_user_id = auth.uid());
create policy workspace_corporate_contacts_update_authenticated
  on public.workspace_corporate_contacts for update to authenticated using (true) with check (true);
