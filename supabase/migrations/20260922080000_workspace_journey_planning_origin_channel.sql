-- EBC-R1.3-WS12-010: QA Defect Resolution — Defect D3 (Origin Channel
-- missing from Journey Planning records).
--
-- FR-JP-06 (WS12-003): Journey Planning shall accept an opportunity from
-- any of eight recognised origin channels: Website enquiry, WhatsApp,
-- Phone, Walk-in, Referral, Existing Traveller, Corporate enquiry, Manual
-- Workspace initiation.
-- FR-JP-07: Every Journey Planning Record shall record its origin channel
-- at creation.
--
-- Added as a nullable column, backfilled to 'manual_workspace_initiation'
-- for any pre-existing rows (this table has no live production data in
-- any environment as of this migration — see WS12-007's own disclosure
-- that no migration in this module has been applied against a live
-- database yet — but the nullable-then-backfill-then-NOT-NULL sequence is
-- followed regardless, as the safe pattern for an already-created column
-- on a table that may carry rows by the time this runs), then made
-- NOT NULL so FR-JP-07 is enforced at the database layer for every row
-- created from this point forward, not just at the application layer.

alter table public.workspace_journey_planning_records
  add column if not exists origin_channel text;

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_origin_channel_check
  check (
    origin_channel in (
      'website_enquiry',
      'whatsapp',
      'phone',
      'walk_in',
      'referral',
      'existing_traveller',
      'corporate_enquiry',
      'manual_workspace_initiation'
    )
  );

update public.workspace_journey_planning_records
  set origin_channel = 'manual_workspace_initiation'
  where origin_channel is null;

alter table public.workspace_journey_planning_records
  alter column origin_channel set not null;

comment on column public.workspace_journey_planning_records.origin_channel is
  'FR-JP-06/FR-JP-07: the opportunity''s origin channel, recorded at creation. One of the eight ratified channels; enforced by a CHECK constraint and by application validation (journey-planning/validation.ts).';
