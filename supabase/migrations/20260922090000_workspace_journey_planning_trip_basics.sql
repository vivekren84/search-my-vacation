-- EBC-R1.3-WS12-013: Journey Planning Enhancement -- Planning Parameters &
-- Discovery Gate Implementation.
--
-- Canonical sources: EBC-R1.3-WS12-003 Revision 2 (FR-JP-31/32/33/34/36,
-- BR-020/021/023/024), EBC-R1.3-WS12-011B (Ratified Product Decisions,
-- Appendix A). Adds the six ratified "Trip Basics" / Planning Parameters
-- fields to the Journey Planning Record: Number of Adults, Number of
-- Children, Number of Infants, Intended Travel Month, Number of Nights,
-- Preferred Departure City. No other field is added -- Budget and Exact
-- Travel Date are deliberately and permanently excluded (FR-JP-32/36,
-- BR-020/024), per this card's explicit "shall not" constraints.
--
-- Nullability decision (engineering judgement, disclosed per Project
-- Instructions Section 35 -- a safe, non-material assumption, not a
-- request for re-approval): every column below is added NULLABLE, with
-- NO backfill, and NO NOT NULL constraint is applied to any of them --
-- including adults, even though FR-JP-31/BR-020 make Adults mandatory
-- going forward. This departs from the nullable-then-backfill-then-NOT-
-- NULL pattern used for origin_channel
-- (20260922080000_workspace_journey_planning_origin_channel.sql), for a
-- reason specific to this column set: unlike origin_channel, this table
-- already carries real rows with no Adults value by the time this
-- migration runs (the two records created during EBC-R1.3-WS12-010V's
-- live verification pass), and fabricating a plausible Adults count for
-- pre-existing rows would violate Project Instructions Section 19 ("Do
-- not fabricate production content"). Leaving pre-existing rows genuinely
-- NULL is the factually honest representation -- their Adults count was
-- never captured -- and "preserve nullable behaviour... distinguish
-- unknown from explicit zero" (this card's own Database activity
-- instruction) is best satisfied this way. FR-JP-31's creation-mandatory
-- requirement is enforced at the application layer instead
-- (journey-planning/validation.ts,
-- validateCreateJourneyPlanningRecordInput), exactly like FR-JP-06's
-- origin-channel-required check was, before WS12-010 additionally added a
-- database-layer NOT NULL for that already-backfillable column. BR-023's
-- tri-state integrity requirement (unanswered / explicit zero / explicit
-- positive count) is satisfied natively: NULL is "unanswered", 0 is
-- "explicit zero", any positive integer is "explicit positive count" --
-- no sentinel value or separate boolean flag is needed.
--
-- intended_travel_month is stored as 'YYYY-MM' text, not a date, so it
-- cannot be confused with the deliberately-excluded Exact Travel Date
-- field (FR-JP-36/BR-024) -- a date column would need an arbitrary day-
-- of-month (the 1st?) that implies a precision this field explicitly does
-- not carry. Format is enforced by a CHECK constraint mirroring the
-- application-layer validation.

alter table public.workspace_journey_planning_records
  add column if not exists adults integer,
  add column if not exists children integer,
  add column if not exists infants integer,
  add column if not exists intended_travel_month text,
  add column if not exists nights integer,
  add column if not exists preferred_departure_city text;

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_adults_check
  check (adults is null or adults >= 1);

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_children_check
  check (children is null or children >= 0);

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_infants_check
  check (infants is null or infants >= 0);

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_nights_check
  check (nights is null or nights >= 0);

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_intended_travel_month_check
  check (intended_travel_month is null or intended_travel_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_preferred_departure_city_check
  check (preferred_departure_city is null or length(trim(preferred_departure_city)) > 0);

comment on column public.workspace_journey_planning_records.adults is
  'FR-JP-31/BR-020: number of adult travellers. Mandatory at creation -- enforced at the application layer (journey-planning/validation.ts), not by a database NOT NULL, so pre-existing rows created before this migration remain honestly NULL rather than fabricated. Minimum 1 when set.';
comment on column public.workspace_journey_planning_records.children is
  'FR-JP-33/FR-JP-34/BR-021/BR-023: number of child travellers. Present from creation, not required until the Discovery-to-Planning gate. NULL = unanswered, 0 = explicit zero (BR-023 tri-state).';
comment on column public.workspace_journey_planning_records.infants is
  'FR-JP-33/FR-JP-34/BR-021/BR-023: number of infant travellers. Present from creation, not required until the Discovery-to-Planning gate. NULL = unanswered, 0 = explicit zero (BR-023 tri-state).';
comment on column public.workspace_journey_planning_records.intended_travel_month is
  'FR-JP-34/BR-021: approximate intended travel month, stored as YYYY-MM text (never a date -- see migration header). Required before the Discovery-to-Planning gate. Distinct from the permanently-excluded Exact Travel Date (FR-JP-36/BR-024), which this module does not track.';
comment on column public.workspace_journey_planning_records.nights is
  'FR-JP-34/BR-021/BR-023: intended number of nights. Present from creation, not required until the Discovery-to-Planning gate. NULL = unanswered, 0 = explicit zero (BR-023 tri-state).';
comment on column public.workspace_journey_planning_records.preferred_departure_city is
  'FR-JP-34/BR-021/BR-023: preferred departure city (free text -- no structured city model exists to reference, matching the existing destination_region column''s own engineering-decision precedent). Required before the Discovery-to-Planning gate. NULL = unanswered; an empty/blank string is rejected by CHECK, so "unanswered" cannot be confused with a blank placeholder value.';
