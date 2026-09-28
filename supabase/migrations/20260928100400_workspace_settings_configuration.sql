-- EBC-R1.3-WS13-005 Phase 0, migration M05 (EBC-R1.3-WS13-004 §6.2, §7,
-- WP-0.5). AD-WS13-006: database-backed configuration and Readiness
-- Template structure (D-04, D-05, D-08, BR-018, BR-041, BR-042, DEP-12).
--
-- Seeds ONLY values already approved in the Product baseline
-- (WS13-001 Revision 3 §11.2, §16, §17, D-08; DEC-R1.3-020 time zone).
-- Content still owed by the Product Owner (EP-02) is NOT invented:
--   * document_types and vendor_service_types are seeded as EMPTY lists;
--   * the Domestic and International templates are seeded as headers only,
--     with no items.
-- That content arrives later in a separate content migration (M05b, Phase
-- 2), so this schema never waits for content and content is never
-- fabricated (EBC-R1.3-WS13-004 §6.1, R-ARC-JW-03).
--
-- Release 1.3 has no configuration UI (DEP-12). An Administrator changes a
-- value as a data operation (SQL editor / service role), with no code
-- change (FR-JW-26 AC3, FR-JW-23 AC1). Every seed uses
-- "on conflict do nothing", so re-running never overwrites a later change.
--
-- List shape (every *_categories / *_types key):
--   [{ "code": text, "label": text, "active": boolean, "sort": integer, ... }]
-- A value is retired by setting "active": false, never by removing it, so
-- historic records keep rendering.
--
-- Rollback (forward-fix): drop the two helper functions, the three tables.
-- No pre-existing object is changed.

create table if not exists public.workspace_configuration (
  key text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  value jsonb not null,
  description text,
  updated_by uuid references public.workspace_users (user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_configuration is
  'AD-WS13-006: Workspace configuration (thresholds, windows, retention, business time zone, reference lists). Read by the application; edited by an Administrator as a data operation in Release 1.3 (no UI, DEP-12).';

create trigger workspace_configuration_set_updated_at
  before update on public.workspace_configuration
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_configuration enable row level security;
revoke all on public.workspace_configuration from anon, authenticated;
grant select on public.workspace_configuration to authenticated;

-- Read-only for provisioned Workspace Users. No insert/update/delete grant:
-- changes are made with the service role (Supabase dashboard / SQL editor).
create policy workspace_configuration_select_workspace_users
  on public.workspace_configuration for select to authenticated
  using (public.workspace_current_user_role() is not null);

create table if not exists public.workspace_readiness_templates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_]*$'),
  name text not null check (length(trim(name)) > 0),
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspace_readiness_templates is
  'AD-WS13-006 / BR-041 / POD-01: Readiness Templates (configuration). Release 1.3 defaults: Domestic, International. New templates are added by data, without code.';

create trigger workspace_readiness_templates_set_updated_at
  before update on public.workspace_readiness_templates
  for each row execute function public.set_workspace_updated_at();

create table if not exists public.workspace_readiness_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workspace_readiness_templates (id) on delete restrict,
  category text not null check (
    category in ('booking_confirmations', 'documentation', 'traveller_readiness', 'supplier_readiness')
  ),
  label text not null check (length(trim(label)) > 0),
  requirement text not null default 'mandatory' check (requirement in ('mandatory', 'optional')),
  allows_not_applicable boolean not null default false,
  item_kind text not null default 'manual' check (item_kind in ('system', 'manual')),
  system_rule text check (system_rule in ('all_bookings_booked', 'all_required_documents_received')),
  document_type text,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_readiness_template_items_kind_rule_check check (
    (item_kind = 'system' and system_rule is not null) or (item_kind = 'manual' and system_rule is null)
  )
);

comment on table public.workspace_readiness_template_items is
  'AD-WS13-006 / POD-01 / BR-028 / BR-041: items of a Readiness Template: category (4 fixed), Mandatory/Optional, whether Not Applicable is permitted, system or manual, and (Documentation) the Document Type code. Item content is Product Owner content (EP-02).';

create index if not exists workspace_readiness_template_items_template_idx
  on public.workspace_readiness_template_items (template_id, category, sort);

create trigger workspace_readiness_template_items_set_updated_at
  before update on public.workspace_readiness_template_items
  for each row execute function public.set_workspace_updated_at();

alter table public.workspace_readiness_templates enable row level security;
alter table public.workspace_readiness_template_items enable row level security;
revoke all on public.workspace_readiness_templates from anon, authenticated;
revoke all on public.workspace_readiness_template_items from anon, authenticated;
grant select on public.workspace_readiness_templates to authenticated;
grant select on public.workspace_readiness_template_items to authenticated;

create policy workspace_readiness_templates_select_workspace_users
  on public.workspace_readiness_templates for select to authenticated
  using (public.workspace_current_user_role() is not null);
create policy workspace_readiness_template_items_select_workspace_users
  on public.workspace_readiness_template_items for select to authenticated
  using (public.workspace_current_user_role() is not null);

-- Helper: is p_code present (and, optionally, active) in the configured
-- list stored under p_key? Used by WS13 RPCs (e.g. the conversion RPC's
-- Service Category check). SECURITY DEFINER so it works inside other
-- definer functions regardless of the caller.
create or replace function public.workspace_config_has_code(p_key text, p_code text, p_active_only boolean default true)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_configuration c,
         jsonb_array_elements(case when jsonb_typeof(c.value) = 'array' then c.value else '[]'::jsonb end) as item
    where c.key = p_key
      and item ->> 'code' = p_code
      and (not p_active_only or coalesce((item ->> 'active')::boolean, true))
  );
$$;

revoke all on function public.workspace_config_has_code(text, text, boolean) from public, anon;
grant execute on function public.workspace_config_has_code(text, text, boolean) to authenticated;

-- Helper: today's date in the configured business time zone (AD-WS13 §4.4:
-- date gates and alerts are evaluated in the business time zone, never UTC).
-- Falls back to Asia/Kolkata (DEC-R1.3-020) if the key is missing.
create or replace function public.workspace_business_today()
returns date
language sql
stable
security definer
set search_path = public
as $$
  select (now() at time zone coalesce(
    (select c.value #>> '{}' from public.workspace_configuration c where c.key = 'business_timezone'),
    'Asia/Kolkata'
  ))::date;
$$;

revoke all on function public.workspace_business_today() from public, anon;
grant execute on function public.workspace_business_today() to authenticated;

-- ---------------------------------------------------------------------
-- Seeds: approved Release 1.3 values only.
-- ---------------------------------------------------------------------
insert into public.workspace_configuration (key, value, description) values
  ('business_timezone', '"Asia/Kolkata"'::jsonb,
   'Business time zone for date gates, alerts and "today" (DEC-R1.3-020, EP-09).'),
  ('departure_window_days', '14'::jsonb,
   'Upcoming Departures window in days (WS13-001 §17; default equals the AL-03 readiness window).'),
  ('archive_retention_days', '60'::jsonb,
   'Days after Journey Closed before a Journey is Archive Eligible (D-08, BR-038).'),
  ('alert_thresholds', '{
      "AL-03": {"readinessWindowDays": 14},
      "AL-04": {"documentWindowDays": 21},
      "AL-05": {"daysInStatus": 3},
      "AL-06": {"daysAfterStart": 0},
      "AL-07": {"daysAfterEnd": 1},
      "AL-08": {"daysAfterEnd": 7},
      "AL-09": {"daysOnHold": 14},
      "AL-12": {"daysBeforeDue": 0},
      "AL-13": {"daysBeforeDue": 0},
      "AL-14": {"daysBeforeDue": 0}
    }'::jsonb,
   'Alert thresholds and windows (WS13-001 §16 Release 1.3 defaults; BR-042). AL-15 uses archive_retention_days.'),
  ('service_categories', '[
      {"code": "domestic",        "label": "Domestic",        "active": true, "sort": 10},
      {"code": "international",   "label": "International",   "active": true, "sort": 20},
      {"code": "weekend_getaway", "label": "Weekend Getaway", "active": true, "sort": 30},
      {"code": "honeymoon",       "label": "Honeymoon",       "active": true, "sort": 40},
      {"code": "family",          "label": "Family",          "active": true, "sort": 50},
      {"code": "solo",            "label": "Solo",            "active": true, "sort": 60},
      {"code": "pilgrimage",      "label": "Pilgrimage",      "active": true, "sort": 70}
    ]'::jsonb,
   'Service Categories (POD-02, WS13-001 §11.2, BR-043).'),
  ('document_type_categories', '[
      {"code": "traveller_identity",   "label": "Traveller Identity",   "active": true, "sort": 10},
      {"code": "travel",               "label": "Travel",               "active": true, "sort": 20},
      {"code": "accommodation",        "label": "Accommodation",        "active": true, "sort": 30},
      {"code": "activities",           "label": "Activities",           "active": true, "sort": 40},
      {"code": "insurance_health",     "label": "Insurance & Health",   "active": true, "sort": 50},
      {"code": "financial_booking",    "label": "Financial / Booking",  "active": true, "sort": 60},
      {"code": "internal_operational", "label": "Internal Operational", "active": true, "sort": 70}
    ]'::jsonb,
   'Document Type categories (POD-03, WS13-001 §11.2, BR-044).'),
  ('document_types', '[]'::jsonb,
   'Document Types: {code,label,category,active,sort}. Product Owner content pending (EP-02); loaded by the Phase 2 content migration.'),
  ('vendor_service_types', '[]'::jsonb,
   'Vendor Service Types: {code,label,active,sort}. Product Owner content pending (EP-02, POD-05); loaded by the Phase 2 content migration.'),
  ('change_categories', '[
      {"code": "itinerary",     "label": "Itinerary",     "active": true, "sort": 10},
      {"code": "traveller",     "label": "Traveller",     "active": true, "sort": 20},
      {"code": "accommodation", "label": "Accommodation", "active": true, "sort": 30},
      {"code": "transport",     "label": "Transport",     "active": true, "sort": 40},
      {"code": "activities",    "label": "Activities",    "active": true, "sort": 50},
      {"code": "operational",   "label": "Operational",   "active": true, "sort": 60},
      {"code": "documentation", "label": "Documentation", "active": true, "sort": 70}
    ]'::jsonb,
   'Change Categories (POD-04, WS13-001 §11.2, BR-045). Classification only.'),
  ('task_categories', '[
      {"code": "operational",         "label": "Operational",         "active": true, "sort": 10, "defaultKind": "task"},
      {"code": "traveller_follow_up", "label": "Traveller follow-up", "active": true, "sort": 20, "defaultKind": "follow_up"},
      {"code": "payment",             "label": "Payment",             "active": true, "sort": 30, "defaultKind": "follow_up"}
    ]'::jsonb,
   'Task categories (FR-JW-24 minimum set; D-05; I-01).')
on conflict (key) do nothing;

insert into public.workspace_readiness_templates (code, name, active, sort) values
  ('domestic', 'Domestic', true, 10),
  ('international', 'International', true, 20)
on conflict (code) do nothing;
