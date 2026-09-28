-- EBC-R1.3-WS13-005 Phase 0, migration M08 (EBC-R1.3-WS13-004 §6.2,
-- WP-0.8). AD-WS13-001/002/006; D-07, D-10, D-12; POD-01, POD-03, POD-04;
-- BR-033, BR-037, BR-040, BR-044, BR-045.
--
-- Journey child entities (the Journey is the aggregate root):
--   workspace_journey_operational_contacts  Primary Operational Contact (D-12)
--   workspace_journey_vendor_bookings       Vendor Booking (D-07)
--   workspace_journey_readiness_items       Readiness Items (POD-01, BR-041)
--   workspace_journey_documents             Journey Documents (POD-03, D-10)
--   workspace_journey_change_records        Change Records (D-06, POD-04)
--   workspace_journey_activities            Communications, Notes, vendor
--                                           coordination log (FR-JW-18/19/20)
--
-- Write model (AD-WS13-002):
--   * Status/lifecycle changes that must be atomic with audit (booking
--     status, template change, change record + booking re-entry) are done
--     by SECURITY DEFINER RPCs in later phases. Direct UPDATE grants are
--     therefore COLUMN-LIMITED: e.g. a booking's status can never be changed
--     by a plain UPDATE.
--   * Single-row child writes use RLS keyed on workspace_can_edit_journey():
--     the caller is the Journey owner or an Administrator, the caller is an
--     active Workspace User, and the Journey is adopted, not terminal and
--     not archived (POD-08: Archived = read-only).
--   * No DELETE grant exists on any table (BR-033, FR-JW-31). Change records
--     and activities are append-only (no UPDATE grant).
--   * Reads are collaborative (BR-035): any provisioned Workspace User.
--
-- Also backfills a Primary Operational Contact for every legacy Journey
-- from its party (I-04), which M07 could not do before this table existed.
--
-- Additive only (new objects). Rollback (forward-fix): drop the six tables
-- and workspace_can_edit_journey().

create or replace function public.workspace_can_edit_journey(p_journey_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_journeys j
    join public.workspace_users u on u.user_id = auth.uid()
    where j.id = p_journey_id
      and u.deactivated_at is null
      and j.adoption_status = 'adopted'
      and j.archived_at is null
      and j.outcome is null
      and j.stage <> 'journey_closed'
      and (j.owner_id = u.user_id or u.role = 'administrator')
  );
$$;

comment on function public.workspace_can_edit_journey(uuid) is
  'AD-WS13-002: true when the caller (active Workspace User) is the Journey owner or an Administrator AND the Journey is adopted, not terminal and not archived (POD-08).';

revoke all on function public.workspace_can_edit_journey(uuid) from public, anon;
grant execute on function public.workspace_can_edit_journey(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Primary Operational Contact (D-12, BR-040, I-04)
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_operational_contacts (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  is_primary boolean not null default true,
  contact_type text not null check (
    contact_type in ('individual_traveller', 'corporate_organisation', 'b2b_travel_partner', 'other_authorised_entity')
  ),
  name text not null check (length(trim(name)) > 0),
  organisation text,
  phone text,
  email text,
  created_by uuid references public.workspace_users (user_id) on delete restrict,
  updated_by uuid references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists workspace_journey_operational_contacts_primary_uidx
  on public.workspace_journey_operational_contacts (journey_id) where is_primary;

create trigger workspace_journey_operational_contacts_set_updated_at
  before update on public.workspace_journey_operational_contacts
  for each row execute function public.set_workspace_updated_at();

-- ---------------------------------------------------------------------
-- Vendor Bookings (D-07, BR-033, BR-037, FR-JW-15/16)
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_vendor_bookings (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  vendor_id uuid not null references public.workspace_vendors (id) on delete restrict,
  service_type text not null check (length(trim(service_type)) > 0),
  service_start_date date,
  service_end_date date,
  booking_reference text,
  status text not null default 'draft' check (
    status in ('draft', 'requested', 'pending_information', 'confirmed', 'booked', 'cancelled')
  ),
  status_reason text,
  status_changed_at timestamptz not null default now(),
  status_changed_by uuid references public.workspace_users (user_id) on delete restrict,
  notes text,
  created_by uuid not null references public.workspace_users (user_id) on delete restrict,
  updated_by uuid references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_journey_vendor_bookings_booked_reference_check check (
    status <> 'booked' or length(trim(coalesce(booking_reference, ''))) > 0
  ),
  constraint workspace_journey_vendor_bookings_reason_check check (
    status not in ('pending_information', 'cancelled') or length(trim(coalesce(status_reason, ''))) > 0
  ),
  constraint workspace_journey_vendor_bookings_dates_check check (
    service_start_date is null or service_end_date is null or service_end_date >= service_start_date
  )
);

create index if not exists workspace_journey_vendor_bookings_journey_idx
  on public.workspace_journey_vendor_bookings (journey_id, status);
create index if not exists workspace_journey_vendor_bookings_status_idx
  on public.workspace_journey_vendor_bookings (status, status_changed_at);
create index if not exists workspace_journey_vendor_bookings_vendor_idx
  on public.workspace_journey_vendor_bookings (vendor_id);

create trigger workspace_journey_vendor_bookings_set_updated_at
  before update on public.workspace_journey_vendor_bookings
  for each row execute function public.set_workspace_updated_at();

-- ---------------------------------------------------------------------
-- Readiness Items (POD-01, BR-028, BR-041, FR-JW-22/23)
-- Overall readiness is DERIVED (M09), never stored.
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_readiness_items (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  template_item_id uuid references public.workspace_readiness_template_items (id) on delete restrict,
  source text not null check (source in ('template', 'manual')),
  category text not null check (
    category in ('booking_confirmations', 'documentation', 'traveller_readiness', 'supplier_readiness')
  ),
  label text not null check (length(trim(label)) > 0),
  requirement text not null default 'mandatory' check (requirement in ('mandatory', 'optional')),
  allows_not_applicable boolean not null default false,
  item_kind text not null default 'manual' check (item_kind in ('system', 'manual')),
  system_rule text check (system_rule in ('all_bookings_booked', 'all_required_documents_received')),
  status text not null default 'outstanding' check (status in ('outstanding', 'complete', 'not_applicable')),
  not_applicable_reason text,
  status_changed_at timestamptz,
  status_changed_by uuid references public.workspace_users (user_id) on delete restrict,
  superseded_at timestamptz,
  created_by uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_journey_readiness_items_source_link_check check (
    (source = 'template' and template_item_id is not null) or (source = 'manual' and template_item_id is null)
  ),
  constraint workspace_journey_readiness_items_kind_rule_check check (
    (item_kind = 'system' and system_rule is not null) or (item_kind = 'manual' and system_rule is null)
  ),
  constraint workspace_journey_readiness_items_not_applicable_check check (
    status <> 'not_applicable'
    or (allows_not_applicable and length(trim(coalesce(not_applicable_reason, ''))) > 0)
  ),
  constraint workspace_journey_readiness_items_system_status_check check (item_kind = 'manual' or status = 'outstanding' or status = 'not_applicable')
);

create index if not exists workspace_journey_readiness_items_journey_idx
  on public.workspace_journey_readiness_items (journey_id) where superseded_at is null;

create trigger workspace_journey_readiness_items_set_updated_at
  before update on public.workspace_journey_readiness_items
  for each row execute function public.set_workspace_updated_at();

-- ---------------------------------------------------------------------
-- Journey Documents (POD-03, D-10, BR-044, FR-JW-21). Metadata only.
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_documents (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  document_type text not null check (length(trim(document_type)) > 0),
  traveller_id uuid references public.workspace_travellers (id) on delete restrict,
  traveller_label text,
  requirement text check (requirement in ('mandatory', 'optional')),
  source text not null default 'manual' check (source in ('template', 'manual', 'carried')),
  readiness_item_id uuid references public.workspace_journey_readiness_items (id) on delete restrict,
  status text not null default 'outstanding' check (status in ('outstanding', 'received', 'verified', 'not_applicable')),
  external_reference text,
  external_link text check (external_link is null or external_link ~* '^https://[^[:space:]]+$'),
  notes text,
  carried_from_document_id uuid references public.workspace_journey_documents (id) on delete restrict,
  status_changed_at timestamptz,
  status_changed_by uuid references public.workspace_users (user_id) on delete restrict,
  created_by uuid not null references public.workspace_users (user_id) on delete restrict,
  updated_by uuid references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.workspace_journey_documents.external_reference is
  'Sensitive (passport / visa references). Masked to the last four characters in list read models; never written to audit event_data (WS13-003 §4.9, PD-ARC-09).';

create index if not exists workspace_journey_documents_journey_idx
  on public.workspace_journey_documents (journey_id, status);

create trigger workspace_journey_documents_set_updated_at
  before update on public.workspace_journey_documents
  for each row execute function public.set_workspace_updated_at();

-- ---------------------------------------------------------------------
-- Change Records (D-06, POD-04, BR-032, BR-045). Append-only.
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_change_records (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  change_category text not null check (length(trim(change_category)) > 0),
  what_changed text not null check (length(trim(what_changed)) > 0),
  reason text not null check (length(trim(reason)) > 0),
  requested_by text not null check (requested_by in ('traveller', 'smv', 'vendor')),
  affected_booking_ids uuid[] not null default '{}',
  created_by uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists workspace_journey_change_records_journey_idx
  on public.workspace_journey_change_records (journey_id, created_at desc);

-- ---------------------------------------------------------------------
-- Activities: communications, operational notes, vendor coordination.
-- Append-only; a correction is a new note linked to the original.
-- ---------------------------------------------------------------------
create table if not exists public.workspace_journey_activities (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.workspace_journeys (id) on delete restrict,
  kind text not null check (kind in ('communication', 'note', 'vendor_coordination')),
  vendor_booking_id uuid references public.workspace_journey_vendor_bookings (id) on delete restrict,
  contact_target text check (contact_target in ('primary_operational_contact', 'traveller')),
  channel text,
  direction text check (direction in ('inbound', 'outbound')),
  content text not null check (length(trim(content)) > 0),
  corrects_activity_id uuid references public.workspace_journey_activities (id) on delete restrict,
  author_user_id uuid not null references public.workspace_users (user_id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint workspace_journey_activities_vendor_link_check check (
    kind <> 'vendor_coordination' or vendor_booking_id is not null
  )
);

create index if not exists workspace_journey_activities_journey_idx
  on public.workspace_journey_activities (journey_id, created_at desc);

-- ---------------------------------------------------------------------
-- Grants and RLS
-- ---------------------------------------------------------------------
alter table public.workspace_journey_operational_contacts enable row level security;
alter table public.workspace_journey_vendor_bookings enable row level security;
alter table public.workspace_journey_readiness_items enable row level security;
alter table public.workspace_journey_documents enable row level security;
alter table public.workspace_journey_change_records enable row level security;
alter table public.workspace_journey_activities enable row level security;

revoke all on public.workspace_journey_operational_contacts from anon, authenticated;
revoke all on public.workspace_journey_vendor_bookings from anon, authenticated;
revoke all on public.workspace_journey_readiness_items from anon, authenticated;
revoke all on public.workspace_journey_documents from anon, authenticated;
revoke all on public.workspace_journey_change_records from anon, authenticated;
revoke all on public.workspace_journey_activities from anon, authenticated;

-- Contacts: created by the conversion RPC (definer); edited in place.
grant select on public.workspace_journey_operational_contacts to authenticated;
grant update (contact_type, name, organisation, phone, email, updated_by)
  on public.workspace_journey_operational_contacts to authenticated;

-- Bookings: created as Draft by the owner; status only via RPC (Phase 2).
grant select on public.workspace_journey_vendor_bookings to authenticated;
grant insert (journey_id, vendor_id, service_type, service_start_date, service_end_date, notes, created_by)
  on public.workspace_journey_vendor_bookings to authenticated;
grant update (service_type, service_start_date, service_end_date, notes, updated_by)
  on public.workspace_journey_vendor_bookings to authenticated;

-- Readiness items: template items are created by RPC; manual items and
-- manual status changes are single-row writes.
grant select on public.workspace_journey_readiness_items to authenticated;
grant insert (journey_id, source, category, label, requirement, allows_not_applicable, item_kind, created_by)
  on public.workspace_journey_readiness_items to authenticated;
grant update (label, status, not_applicable_reason, status_changed_at, status_changed_by)
  on public.workspace_journey_readiness_items to authenticated;

-- Documents: metadata edits and status changes are single-row writes.
grant select on public.workspace_journey_documents to authenticated;
grant insert (journey_id, document_type, traveller_id, traveller_label, requirement, status,
              external_reference, external_link, notes, created_by)
  on public.workspace_journey_documents to authenticated;
grant update (document_type, traveller_id, traveller_label, status, external_reference, external_link,
              notes, status_changed_at, status_changed_by, updated_by)
  on public.workspace_journey_documents to authenticated;

-- Change records: created by RPC only (Phase 2), never edited.
grant select on public.workspace_journey_change_records to authenticated;

-- Activities: append-only.
grant select on public.workspace_journey_activities to authenticated;
grant insert (journey_id, kind, vendor_booking_id, contact_target, channel, direction, content,
              corrects_activity_id, author_user_id)
  on public.workspace_journey_activities to authenticated;

create policy workspace_journey_operational_contacts_select
  on public.workspace_journey_operational_contacts for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_journey_operational_contacts_update
  on public.workspace_journey_operational_contacts for update to authenticated
  using (public.workspace_can_edit_journey(journey_id))
  with check (public.workspace_can_edit_journey(journey_id) and updated_by = auth.uid());

create policy workspace_journey_vendor_bookings_select
  on public.workspace_journey_vendor_bookings for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_journey_vendor_bookings_insert
  on public.workspace_journey_vendor_bookings for insert to authenticated
  with check (public.workspace_can_edit_journey(journey_id) and created_by = auth.uid() and status = 'draft');
create policy workspace_journey_vendor_bookings_update
  on public.workspace_journey_vendor_bookings for update to authenticated
  using (public.workspace_can_edit_journey(journey_id) and status <> 'cancelled')
  with check (public.workspace_can_edit_journey(journey_id) and updated_by = auth.uid());

create policy workspace_journey_readiness_items_select
  on public.workspace_journey_readiness_items for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_journey_readiness_items_insert
  on public.workspace_journey_readiness_items for insert to authenticated
  with check (
    public.workspace_can_edit_journey(journey_id)
    and created_by = auth.uid()
    and source = 'manual'
    and item_kind = 'manual'
  );
create policy workspace_journey_readiness_items_update
  on public.workspace_journey_readiness_items for update to authenticated
  using (public.workspace_can_edit_journey(journey_id) and superseded_at is null and item_kind = 'manual')
  with check (public.workspace_can_edit_journey(journey_id) and status_changed_by = auth.uid());

create policy workspace_journey_documents_select
  on public.workspace_journey_documents for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_journey_documents_insert
  on public.workspace_journey_documents for insert to authenticated
  with check (public.workspace_can_edit_journey(journey_id) and created_by = auth.uid());
create policy workspace_journey_documents_update
  on public.workspace_journey_documents for update to authenticated
  using (public.workspace_can_edit_journey(journey_id))
  with check (public.workspace_can_edit_journey(journey_id) and updated_by = auth.uid());

create policy workspace_journey_change_records_select
  on public.workspace_journey_change_records for select to authenticated
  using (public.workspace_current_user_role() is not null);

create policy workspace_journey_activities_select
  on public.workspace_journey_activities for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_journey_activities_insert
  on public.workspace_journey_activities for insert to authenticated
  with check (public.workspace_can_edit_journey(journey_id) and author_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Legacy backfill: Primary Operational Contact from the party (I-04).
-- ---------------------------------------------------------------------
insert into public.workspace_journey_operational_contacts
  (journey_id, is_primary, contact_type, name, organisation, phone, email, created_by)
select
  j.id,
  true,
  case when j.corporate_contact_id is not null then 'corporate_organisation' else 'individual_traveller' end,
  coalesce(cc.contact_name, t.full_name),
  cc.company_name,
  coalesce(cc.contact_phone, t.phone),
  coalesce(cc.contact_email, t.email),
  null
from public.workspace_journeys j
left join public.workspace_travellers t on t.id = j.traveller_id
left join public.workspace_corporate_contacts cc on cc.id = j.corporate_contact_id
where coalesce(cc.contact_name, t.full_name) is not null
  and not exists (
    select 1 from public.workspace_journey_operational_contacts c where c.journey_id = j.id and c.is_primary
  );
