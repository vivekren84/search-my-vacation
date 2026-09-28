-- EBC-R1.3-WS13-005 Phase 0, migration M09 (EBC-R1.3-WS13-004 §6.2,
-- WP-0.9). AD-WS13-004: operational state is DERIVED through one summary
-- view (and one pure TypeScript module, derivations.ts), never stored.
--
-- Every list, summary-strip count, KPI, tab badge and Dashboard panel reads
-- this view, so counts always equal list sizes (FR-JW-34 AC1). It is a
-- security_invoker view: the caller's own RLS applies to every base table.
-- Dates are evaluated in the business time zone (workspace_business_today,
-- M05), never UTC.
--
-- Readiness (POD-01, BR-028, FR-JW-22/23), as defined in the Product
-- baseline:
--   * only items of the Journey's current template set (superseded_at IS
--     NULL) count;
--   * only MANDATORY items that are not Not Applicable determine the state;
--     Optional items never block (FR-JW-22 AC4, FR-JW-09 AC4);
--   * manual item resolved = status 'complete';
--   * system item 'all_bookings_booked' resolved = every non-Cancelled
--     booking is Booked (WS13-001 §11.1 "Supplier readiness complete");
--   * system item 'all_required_documents_received' resolved = every
--     Mandatory Journey Document is Received, Verified or Not Applicable
--     (FR-JW-23 AC3);
--   * state: 'ready' when no mandatory item is unresolved (and a template
--     is assigned); otherwise 'at_risk' when departure is within the AL-03
--     readiness window; otherwise 'not_ready'.
-- The readiness state is only meaningful for active Journeys (is_active).
--
-- Rollback (forward-fix): drop view. Nothing depends on it at the database
-- level.

create or replace view public.workspace_journey_operational_summary
with (security_invoker = true)
as
with cfg as (
  select
    coalesce((select (c.value -> 'AL-03' ->> 'readinessWindowDays')::int
              from public.workspace_configuration c where c.key = 'alert_thresholds'), 14) as readiness_window_days,
    coalesce((select (c.value #>> '{}')::int
              from public.workspace_configuration c where c.key = 'departure_window_days'), 14) as departure_window_days,
    coalesce((select (c.value #>> '{}')::int
              from public.workspace_configuration c where c.key = 'archive_retention_days'), 60) as archive_retention_days,
    public.workspace_business_today() as today,
    coalesce((select c.value #>> '{}' from public.workspace_configuration c where c.key = 'business_timezone'),
             'Asia/Kolkata') as tz
),
bookings as (
  select
    b.journey_id,
    count(*) filter (where b.status <> 'cancelled') as bookings_active,
    count(*) filter (where b.status = 'booked') as bookings_booked,
    count(*) filter (where b.status in ('requested', 'pending_information')) as bookings_pending,
    count(*) filter (where b.status = 'draft') as bookings_draft,
    count(*) filter (where b.status = 'requested') as bookings_requested,
    count(*) filter (where b.status = 'pending_information') as bookings_pending_information,
    count(*) filter (where b.status = 'confirmed') as bookings_confirmed,
    count(*) filter (where b.status = 'cancelled') as bookings_cancelled
  from public.workspace_journey_vendor_bookings b
  group by b.journey_id
),
documents as (
  select
    d.journey_id,
    count(*) filter (where d.status = 'outstanding') as documents_outstanding,
    count(*) filter (where d.status = 'received') as documents_received,
    count(*) filter (where d.status = 'verified') as documents_verified,
    count(*) filter (where d.status = 'not_applicable') as documents_not_applicable,
    count(*) filter (where d.requirement = 'mandatory' and d.status = 'outstanding') as documents_mandatory_outstanding
  from public.workspace_journey_documents d
  group by d.journey_id
),
readiness as (
  select
    i.journey_id,
    count(*) filter (where i.requirement = 'mandatory' and i.status <> 'not_applicable') as readiness_mandatory_total,
    count(*) filter (
      where i.requirement = 'mandatory'
        and i.status <> 'not_applicable'
        and (
          (i.item_kind = 'manual' and i.status <> 'complete')
          or (i.item_kind = 'system' and i.system_rule = 'all_bookings_booked'
              and coalesce(bk.bookings_active, 0) <> coalesce(bk.bookings_booked, 0))
          or (i.item_kind = 'system' and i.system_rule = 'all_required_documents_received'
              and coalesce(dc.documents_mandatory_outstanding, 0) > 0)
        )
    ) as readiness_mandatory_unresolved,
    count(*) filter (where i.requirement = 'optional' and i.status = 'outstanding' and i.item_kind = 'manual') as readiness_optional_outstanding
  from public.workspace_journey_readiness_items i
  left join bookings bk on bk.journey_id = i.journey_id
  left join documents dc on dc.journey_id = i.journey_id
  where i.superseded_at is null
  group by i.journey_id
)
select
  j.id as journey_id,
  j.journey_reference,
  j.journey_planning_record_id,
  j.owner_id,
  j.stage,
  j.outcome,
  j.on_hold,
  j.on_hold_since,
  j.archived_at,
  j.adoption_status,
  j.service_category,
  j.destination_region,
  j.confirmed_start_date,
  j.confirmed_end_date,
  j.readiness_template_id,
  j.supersedes_journey_id,
  (j.stage = 'journey_closed' or j.outcome is not null) as is_terminal,
  (j.stage <> 'journey_closed' and j.outcome is null and j.archived_at is null) as is_active,
  (j.confirmed_start_date - cfg.today) as days_to_departure,
  case when j.on_hold then (cfg.today - (j.on_hold_since at time zone cfg.tz)::date) end as days_on_hold,
  (
    j.stage <> 'journey_closed' and j.outcome is null and j.archived_at is null and not j.on_hold
    and j.confirmed_start_date is not null
    and j.confirmed_start_date between cfg.today and cfg.today + cfg.departure_window_days
  ) as departing_within_window,
  coalesce(bk.bookings_active, 0)::int as bookings_active,
  coalesce(bk.bookings_booked, 0)::int as bookings_booked,
  coalesce(bk.bookings_pending, 0)::int as bookings_pending,
  coalesce(bk.bookings_draft, 0)::int as bookings_draft,
  coalesce(bk.bookings_requested, 0)::int as bookings_requested,
  coalesce(bk.bookings_pending_information, 0)::int as bookings_pending_information,
  coalesce(bk.bookings_confirmed, 0)::int as bookings_confirmed,
  coalesce(bk.bookings_cancelled, 0)::int as bookings_cancelled,
  coalesce(dc.documents_outstanding, 0)::int as documents_outstanding,
  coalesce(dc.documents_received, 0)::int as documents_received,
  coalesce(dc.documents_verified, 0)::int as documents_verified,
  coalesce(dc.documents_not_applicable, 0)::int as documents_not_applicable,
  coalesce(rd.readiness_mandatory_total, 0)::int as readiness_mandatory_total,
  coalesce(rd.readiness_mandatory_unresolved, 0)::int as readiness_mandatory_unresolved,
  coalesce(rd.readiness_optional_outstanding, 0)::int as readiness_optional_outstanding,
  case
    when j.readiness_template_id is null then 'not_ready'
    when coalesce(rd.readiness_mandatory_unresolved, 0) = 0 then 'ready'
    when j.confirmed_start_date is not null
         and j.confirmed_start_date - cfg.today <= cfg.readiness_window_days then 'at_risk'
    else 'not_ready'
  end as readiness_state,
  (
    j.stage = 'journey_closed' and j.archived_at is null and j.closed_at is not null
    and (j.closed_at at time zone cfg.tz)::date + cfg.archive_retention_days < cfg.today
  ) as archive_eligible
from public.workspace_journeys j
cross join cfg
left join bookings bk on bk.journey_id = j.id
left join documents dc on dc.journey_id = j.id
left join readiness rd on rd.journey_id = j.id;

comment on view public.workspace_journey_operational_summary is
  'AD-WS13-004: derived per-Journey operational state (activity, departure, booking/document counts, readiness, archive eligibility). security_invoker; business time zone. Single source for lists, KPIs and badges.';

revoke all on public.workspace_journey_operational_summary from anon, authenticated;
grant select on public.workspace_journey_operational_summary to authenticated;
