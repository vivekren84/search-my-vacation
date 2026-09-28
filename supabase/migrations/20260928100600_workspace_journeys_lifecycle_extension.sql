-- EBC-R1.3-WS13-005 Phase 0, migration M07 (EBC-R1.3-WS13-004 §6.2,
-- §6.5, WP-0.7). AD-WS13-001 (lifecycle persistence), AD-WS13-003
-- (JRN-#### reference, supersession link), POD-02/POD-07/PD-C (Service
-- Category), BR-036 (legacy adoption).
--
-- Extends the bootstrap workspace_journeys table (DEC-R1.3-013: extend,
-- never re-create).
--
-- Lifecycle model (AD-WS13-001):
--   stage   : the seven D-01 stages; 'journey_closed' is the successful
--             terminal stage (UI label "Completed", UX-04; no data value
--             "completed" is introduced).
--   outcome : NULL, 'cancelled' or 'superseded'. A terminal outcome freezes
--             the stage at the stage reached.
--   on_hold : overlay; stage is unchanged while held (resume = clear flag).
--   archive : overlay columns, independent of stage and outcome; an
--             Archived Journey is read-only (POD-08), no unarchive in R1.3.
--   terminal: stage = 'journey_closed' OR outcome IS NOT NULL.
--
-- The bootstrap `status` column is deprecated, NOT dropped (TD-WS13-001):
-- WS13 code neither reads nor writes it.
--
-- Legacy adoption (BR-036, AD-WS13-001, PD-C): every Journey that exists
-- before this migration becomes adoption_status = 'legacy_pending'. Only
-- values derivable without fabrication are backfilled (owner, destination,
-- trip parameters, accepted proposal version, reference). Confirmed dates,
-- Readiness Template and Service Category are NOT derivable and stay NULL
-- until an Administrator adopts the Journey (JW-17, Phase 1). The Primary
-- Operational Contact is backfilled in M08, once its table exists.
--
-- Deployment coupling (R-07, EBC-R1.3-WS13-004 §6.6): after this migration
-- the WS12 conversion RPC can no longer insert a Journey (owner, dates and
-- Service Category are required for adopted Journeys). M10 replaces it. M07
-- to M10 must be applied together and followed immediately by the Phase 0
-- application deployment.
--
-- Rollback (engineering, forward-fix): drop the integrity CHECKs added
-- below and re-create the 2-argument conversion RPC from
-- 20260921070600 (see M10). Columns can stay (additive, harmless to older
-- code). Data recovery is a separate control (logical backup).

create sequence if not exists public.workspace_journey_reference_seq start with 1001 minvalue 1;

alter table public.workspace_journeys
  add column if not exists journey_reference text,
  add column if not exists owner_id uuid references public.workspace_users (user_id) on delete restrict,
  add column if not exists destination_region text,
  add column if not exists service_category text,
  add column if not exists confirmed_start_date date,
  add column if not exists confirmed_end_date date,
  add column if not exists adults integer,
  add column if not exists children integer,
  add column if not exists infants integer,
  add column if not exists nights integer,
  add column if not exists departure_city text,
  add column if not exists accepted_proposal_version_id uuid
    references public.workspace_proposal_versions (id) on delete restrict,
  add column if not exists stage text not null default 'confirmed',
  add column if not exists stage_changed_at timestamptz not null default now(),
  add column if not exists outcome text,
  add column if not exists outcome_reason text,
  add column if not exists on_hold boolean not null default false,
  add column if not exists on_hold_reason text,
  add column if not exists on_hold_since timestamptz,
  add column if not exists closed_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references public.workspace_users (user_id) on delete restrict,
  add column if not exists archive_reason text,
  add column if not exists readiness_template_id uuid
    references public.workspace_readiness_templates (id) on delete restrict,
  add column if not exists supersedes_journey_id uuid
    references public.workspace_journeys (id) on delete restrict,
  add column if not exists adoption_status text not null default 'adopted',
  add column if not exists updated_by uuid references public.workspace_users (user_id) on delete restrict;

-- ---------------------------------------------------------------------
-- Legacy backfill (before the integrity constraints are added).
-- ---------------------------------------------------------------------
update public.workspace_journeys j
set
  adoption_status = 'legacy_pending',
  owner_id = r.owner_id,
  destination_region = r.destination_region,
  adults = r.adults,
  children = r.children,
  infants = r.infants,
  nights = r.nights,
  departure_city = r.preferred_departure_city,
  accepted_proposal_version_id = p.current_version_id,
  stage = 'confirmed',
  stage_changed_at = j.created_at
from public.workspace_journey_planning_records r
left join public.workspace_proposals p on p.journey_planning_record_id = r.id
where r.id = j.journey_planning_record_id;

do $$
declare
  v_id uuid;
begin
  for v_id in
    select id from public.workspace_journeys where journey_reference is null order by created_at, id
  loop
    update public.workspace_journeys
    set journey_reference = 'JRN-' || nextval('public.workspace_journey_reference_seq')::text
    where id = v_id;
  end loop;
end;
$$;

insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
select 'journey', j.id, 'legacy_backfilled', null,
       jsonb_build_object(
         'journey_reference', j.journey_reference,
         'journey_planning_record_id', j.journey_planning_record_id,
         'source', 'EBC-R1.3-WS13-005 M07'
       )
from public.workspace_journeys j
where j.adoption_status = 'legacy_pending';

-- ---------------------------------------------------------------------
-- Integrity constraints (AD-WS13-001).
-- ---------------------------------------------------------------------
alter table public.workspace_journeys
  alter column journey_reference set default ('JRN-' || nextval('public.workspace_journey_reference_seq')::text),
  alter column journey_reference set not null;

alter table public.workspace_journeys
  add constraint workspace_journeys_journey_reference_key unique (journey_reference),
  add constraint workspace_journeys_supersedes_journey_id_key unique (supersedes_journey_id),
  add constraint workspace_journeys_stage_value_check check (
    stage in ('confirmed', 'in_preparation', 'ready_to_travel', 'travelling', 'travel_complete', 'post_travel', 'journey_closed')
  ),
  add constraint workspace_journeys_outcome_value_check check (outcome is null or outcome in ('cancelled', 'superseded')),
  add constraint workspace_journeys_outcome_reason_check check (
    (outcome is null and outcome_reason is null) or (outcome is not null and length(trim(coalesce(outcome_reason, ''))) > 0)
  ),
  add constraint workspace_journeys_outcome_stage_check check (outcome is null or stage <> 'journey_closed'),
  add constraint workspace_journeys_adoption_status_check check (adoption_status in ('adopted', 'legacy_pending')),
  add constraint workspace_journeys_adopted_required_check check (
    adoption_status = 'legacy_pending'
    or (owner_id is not null and confirmed_start_date is not null and confirmed_end_date is not null and service_category is not null)
  ),
  add constraint workspace_journeys_confirmed_dates_order_check check (
    confirmed_start_date is null or confirmed_end_date is null or confirmed_end_date >= confirmed_start_date
  ),
  add constraint workspace_journeys_on_hold_check check (
    not on_hold
    or (
      stage in ('confirmed', 'in_preparation', 'ready_to_travel')
      and outcome is null
      and length(trim(coalesce(on_hold_reason, ''))) > 0
      and on_hold_since is not null
    )
  ),
  add constraint workspace_journeys_closed_at_check check (stage <> 'journey_closed' or closed_at is not null),
  add constraint workspace_journeys_archive_overlay_check check (
    (archived_at is null and archived_by is null and archive_reason is null)
    or (archived_at is not null and archived_by is not null and length(trim(coalesce(archive_reason, ''))) > 0)
  ),
  add constraint workspace_journeys_trip_parameters_check check (
    (adults is null or adults >= 1)
    and (children is null or children >= 0)
    and (infants is null or infants >= 0)
    and (nights is null or nights >= 0)
  ),
  add constraint workspace_journeys_supersedes_self_check check (supersedes_journey_id is null or supersedes_journey_id <> id);

create index if not exists workspace_journeys_owner_idx on public.workspace_journeys (owner_id);
create index if not exists workspace_journeys_stage_idx on public.workspace_journeys (stage, archived_at);
create index if not exists workspace_journeys_start_date_idx on public.workspace_journeys (confirmed_start_date);

comment on column public.workspace_journeys.status is
  'DEPRECATED (AD-WS13-001, TD-WS13-001): bootstrap status from WS12. Not read or written by WS13 code; see stage / outcome / on_hold / archived_at. Removal is a later, approved cleanup.';
comment on column public.workspace_journeys.stage is
  'AD-WS13-001 / D-01: confirmed, in_preparation, ready_to_travel, travelling, travel_complete, post_travel, journey_closed (UI label "Completed").';
comment on column public.workspace_journeys.adoption_status is
  'BR-036: adopted (normal) or legacy_pending (Journey created before WS13; completed by an Administrator in JW-17).';
comment on column public.workspace_journeys.service_category is
  'POD-02/POD-07/BR-043: primary Service Category code (configuration service_categories). Required for adopted Journeys; NULL allowed only while legacy_pending (PD-C).';
comment on column public.workspace_journeys.supersedes_journey_id is
  'AD-WS13-003 / D-13: set on the replacement Journey; "superseded by" is derived by reverse lookup (single source of truth).';
