-- EBC-R1.3-WS13-005 Phase 0, migration M06 (EBC-R1.3-WS13-004 §6.2,
-- WP-0.6). AD-WS13-006 (vendor lifecycle) and POD-05 / PD-D (Vendor
-- baseline, Spec v2.0 §20).
--
-- Extends the bootstrap workspace_vendors table (AD-WS12-001: extend, never
-- re-create). Vendor Management (WS16) still owns the Vendor object;
-- Journey Workspace only reads Active vendors (FR-JW-15 AC1).
--
-- * lifecycle_state: prospective / active / inactive. Existing rows default
--   to active (POD-05: "existing imported Vendors default to Active unless
--   explicitly overridden").
-- * vendor_code: VEN- followed by five digits, sequential, zero-padded,
--   starting at VEN-00001 (PD-D; Spec v2.0 §20 as clarified by O-12).
--   System-generated, unique and immutable (a trigger rejects changes).
--   Internal relationships keep using id (POD-05).
-- * POD-05 minimum attributes not already present: service_type,
--   destinations_served, address, contracted_rates_link. Existing
--   contact_email / contact_phone are the Email and Phone attributes.
--   The old free-text vendor_type column is left untouched.
--
-- Vendor data itself is business data, loaded later by a Product Owner-run
-- seed script from the vendor spreadsheet (EP-03), never by migration.
--
-- Rollback (forward-fix): drop the trigger and function, the new columns
-- and the sequence. Existing vendor rows keep all their pre-existing data.

create sequence if not exists public.workspace_vendor_code_seq start with 1 minvalue 1;

alter table public.workspace_vendors
  add column if not exists lifecycle_state text not null default 'active',
  add column if not exists vendor_code text,
  add column if not exists service_type text,
  add column if not exists destinations_served text[] not null default '{}',
  add column if not exists address text,
  add column if not exists contracted_rates_link text;

alter table public.workspace_vendors
  add constraint workspace_vendors_lifecycle_state_check
  check (lifecycle_state in ('prospective', 'active', 'inactive'));

alter table public.workspace_vendors
  add constraint workspace_vendors_contracted_rates_link_check
  check (contracted_rates_link is null or contracted_rates_link ~* '^https://[^[:space:]]+$');

-- Backfill codes for existing rows in creation order, then enforce.
do $$
declare
  v_id uuid;
begin
  for v_id in
    select id from public.workspace_vendors where vendor_code is null order by created_at, id
  loop
    update public.workspace_vendors
    set vendor_code = 'VEN-' || lpad(nextval('public.workspace_vendor_code_seq')::text, 5, '0')
    where id = v_id;
  end loop;
end;
$$;

alter table public.workspace_vendors
  alter column vendor_code set default ('VEN-' || lpad(nextval('public.workspace_vendor_code_seq')::text, 5, '0')),
  alter column vendor_code set not null;

alter table public.workspace_vendors
  add constraint workspace_vendors_vendor_code_key unique (vendor_code);

alter table public.workspace_vendors
  add constraint workspace_vendors_vendor_code_format_check
  check (vendor_code ~ '^VEN-[0-9]{5,}$');

create or replace function public.workspace_vendors_protect_vendor_code()
returns trigger
language plpgsql
as $$
begin
  if new.vendor_code is distinct from old.vendor_code then
    raise exception 'workspace_vendor_code_immutable' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger workspace_vendors_protect_vendor_code
  before update of vendor_code on public.workspace_vendors
  for each row execute function public.workspace_vendors_protect_vendor_code();

create index if not exists workspace_vendors_lifecycle_state_idx
  on public.workspace_vendors (lifecycle_state, name);

comment on column public.workspace_vendors.lifecycle_state is
  'POD-05 / AD-WS13-006: prospective / active / inactive. Only Active vendors can be chosen for new Vendor Bookings (FR-JW-15 AC1).';
comment on column public.workspace_vendors.vendor_code is
  'PD-D / Spec v2.0 §20: VEN-00001 style business identifier; system-generated, unique, immutable. Internal relationships use id.';
comment on column public.workspace_vendors.service_type is
  'POD-05: the vendor''s Service Type code (vendor_service_types configuration list, EP-02). Distinct from the Journey Service Category (BR-043).';
