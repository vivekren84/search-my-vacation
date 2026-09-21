-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- AD-WS12-001 (Bootstrap Ownership Principle, ratified via DEC-R1.3-013):
-- minimal Traveller and Vendor tables, field shapes drawn from WS11's
-- already-approved Domain Model, created now because Journey Planning
-- cannot function without them and Traveller Hub (WS14) / Vendor
-- Management (WS16) do not exist yet. These tables are nominally owned by
-- those future workstreams and must be EXTENDED (never re-created) when
-- they are eventually scoped -- see WS12-005 Solution Architecture Section
-- 6.2 and WS12-006 Section 4.

create table if not exists public.workspace_travellers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_travellers is
  'Bootstrap traveller record (AD-WS12-001). Minimal fields only, nominally owned by the future Traveller Hub workstream (WS14) -- extend, do not re-create.';

create trigger workspace_travellers_set_updated_at
  before update on public.workspace_travellers
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_travellers enable row level security;
revoke all on public.workspace_travellers from anon, authenticated;
grant select, insert, update on public.workspace_travellers to authenticated;

create policy workspace_travellers_select_authenticated
  on public.workspace_travellers for select to authenticated using (true);
create policy workspace_travellers_insert_authenticated
  on public.workspace_travellers for insert to authenticated with check (created_by_user_id = auth.uid());
create policy workspace_travellers_update_authenticated
  on public.workspace_travellers for update to authenticated using (true) with check (true);

create table if not exists public.workspace_vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vendor_type text,
  contact_email text,
  contact_phone text,
  created_by_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_vendors is
  'Bootstrap vendor record (AD-WS12-001). Minimal fields only, nominally owned by the future Vendor Management workstream (WS16) -- extend, do not re-create.';

create trigger workspace_vendors_set_updated_at
  before update on public.workspace_vendors
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_vendors enable row level security;
revoke all on public.workspace_vendors from anon, authenticated;
grant select, insert, update on public.workspace_vendors to authenticated;

create policy workspace_vendors_select_authenticated
  on public.workspace_vendors for select to authenticated using (true);
create policy workspace_vendors_insert_authenticated
  on public.workspace_vendors for insert to authenticated with check (created_by_user_id = auth.uid());
create policy workspace_vendors_update_authenticated
  on public.workspace_vendors for update to authenticated using (true) with check (true);
