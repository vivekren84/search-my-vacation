-- EBC-R1.3-WS13-005 Phase 0, migration M10 (EBC-R1.3-WS13-004 §6.2/§6.3,
-- WP-0.10). AD-WS13-003 (conversion v2, JRN reference, supersession);
-- CM-01 (confirmed dates at conversion), CM-02 (replacement linkage),
-- CM-05 (POD-06 Policies 1-2: owner required, dates-nights block), CM-07
-- (Service Category optional in planning, mandatory at conversion), PD-A
-- (Number of Nights required), BR-046 / WS13-004A AC-03 and AC-06
-- (replacement conversion carries the contact and documents).
--
-- 1. Journey Planning record gains:
--      service_category    optional while planning (POD-07)
--      replaces_journey_id set only by the material-change RPC (Phase 4)
--    with at most one OPEN replacement planning record per Journey.
-- 2. The 2-argument conversion function is DROPPED and replaced by a
--    4-argument version. Postgres overloads by argument list, so leaving
--    the old one callable would bypass the date, owner, nights and category
--    gates. THIS DROP REQUIRES EXPLICIT APPROVAL AT MIGRATION REVIEW
--    (EBC-R1.3-WS13-004 §6.1). Dropping a function loses no data.
-- 3. The new function is self-authorising (fixes SEC-01): the caller must
--    be the record owner or an Administrator, and an active Workspace User.
--
-- Error codes (raised as the exception message; errcode P0001 unless
-- noted), mapped to field messages by the application (UX Rev 4a §36.3):
--   workspace_conversion_actor_mismatch            (28000)
--   workspace_journey_planning_record_not_found    (P0002)
--   workspace_conversion_not_authorised            (42501)
--   workspace_journey_planning_record_not_in_decision_stage
--   workspace_journey_planning_record_already_converted
--   workspace_conversion_owner_required
--   workspace_conversion_dates_required
--   workspace_conversion_dates_invalid
--   workspace_conversion_nights_required
--   workspace_conversion_dates_nights_mismatch
--   workspace_conversion_service_category_required
--   workspace_conversion_service_category_invalid
--   workspace_conversion_original_not_on_hold
--
-- Deployment coupling (R-07): apply together with M07-M09 and deploy the
-- Phase 0 application immediately afterwards (EBC-R1.3-WS13-005 Phase 0
-- report, Deployment Considerations).
--
-- Rollback (engineering, forward-fix): drop the 4-argument function and
-- re-create the 2-argument function body exactly as in
-- 20260921070600_workspace_journey_planning_conversion.sql, and relax the
-- M07 adopted_required CHECK. The two new columns may stay.

alter table public.workspace_journey_planning_records
  add column if not exists service_category text,
  add column if not exists replaces_journey_id uuid references public.workspace_journeys (id) on delete restrict;

alter table public.workspace_journey_planning_records
  add constraint workspace_journey_planning_records_service_category_format_check
  check (service_category is null or service_category ~ '^[a-z][a-z0-9_]*$');

create unique index if not exists workspace_journey_planning_records_open_replacement_uidx
  on public.workspace_journey_planning_records (replaces_journey_id)
  where replaces_journey_id is not null and stage <> 'closed';

comment on column public.workspace_journey_planning_records.service_category is
  'POD-07 / BR-043 / CM-07: Service Category code (configuration service_categories). Optional while planning; required for conversion.';
comment on column public.workspace_journey_planning_records.replaces_journey_id is
  'AD-WS13-003 / CM-02: the On Hold Journey this planning record replaces (material change). Set only by workspace_journey_start_material_change (Phase 4).';

drop function if exists public.workspace_convert_journey_planning_record(uuid, uuid);

create or replace function public.workspace_convert_journey_planning_record(
  p_record_id uuid,
  p_actor_id uuid,
  p_confirmed_start_date date,
  p_confirmed_end_date date
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.workspace_journey_planning_records%rowtype;
  v_actor public.workspace_users%rowtype;
  v_original public.workspace_journeys%rowtype;
  v_journey_id uuid;
  v_reference text;
  v_accepted_version_id uuid;
  v_contact_source text := 'party';
  v_contact_name text;
  v_contact_org text;
  v_contact_phone text;
  v_contact_email text;
  v_contact_type text;
begin
  if p_actor_id is distinct from auth.uid() then
    raise exception 'workspace_conversion_actor_mismatch' using errcode = '28000';
  end if;

  select * into v_actor from public.workspace_users where user_id = p_actor_id;
  if not found or v_actor.deactivated_at is not null then
    raise exception 'workspace_conversion_not_authorised' using errcode = '42501';
  end if;

  select * into v_record
  from public.workspace_journey_planning_records
  where id = p_record_id
  for update;

  if not found then
    raise exception 'workspace_journey_planning_record_not_found' using errcode = 'P0002';
  end if;

  -- SEC-01: the RPC authorises itself (owner or Administrator).
  if not (v_actor.role = 'administrator' or v_record.owner_id = p_actor_id) then
    raise exception 'workspace_conversion_not_authorised' using errcode = '42501';
  end if;

  if v_record.stage <> 'decision' then
    raise exception 'workspace_journey_planning_record_not_in_decision_stage' using errcode = 'P0001';
  end if;

  if exists (select 1 from public.workspace_journeys where journey_planning_record_id = p_record_id) then
    raise exception 'workspace_journey_planning_record_already_converted' using errcode = 'P0001';
  end if;

  -- BR-026 / POD-06 Policy 1 / D-03.
  if v_record.owner_id is null then
    raise exception 'workspace_conversion_owner_required' using errcode = 'P0001';
  end if;

  -- BR-027 / D-02 / CM-01.
  if p_confirmed_start_date is null or p_confirmed_end_date is null then
    raise exception 'workspace_conversion_dates_required' using errcode = 'P0001';
  end if;
  if p_confirmed_end_date < p_confirmed_start_date then
    raise exception 'workspace_conversion_dates_invalid' using errcode = 'P0001';
  end if;

  -- PD-A: Number of Nights required. POD-06 Policy 2 / I-05: nights must
  -- equal end - start; never auto-corrected.
  if v_record.nights is null then
    raise exception 'workspace_conversion_nights_required' using errcode = 'P0001';
  end if;
  if (p_confirmed_end_date - p_confirmed_start_date) <> v_record.nights then
    raise exception 'workspace_conversion_dates_nights_mismatch' using errcode = 'P0001';
  end if;

  -- POD-07 / BR-043 / CM-07.
  if v_record.service_category is null then
    raise exception 'workspace_conversion_service_category_required' using errcode = 'P0001';
  end if;
  if not public.workspace_config_has_code('service_categories', v_record.service_category, true) then
    raise exception 'workspace_conversion_service_category_invalid' using errcode = 'P0001';
  end if;

  -- CM-02 / D-13 / BR-039: a replacement converts only while the original
  -- Journey is On Hold and not terminal.
  if v_record.replaces_journey_id is not null then
    select * into v_original
    from public.workspace_journeys
    where id = v_record.replaces_journey_id
    for update;

    if not found
       or not v_original.on_hold
       or v_original.outcome is not null
       or v_original.stage = 'journey_closed'
       or v_original.archived_at is not null then
      raise exception 'workspace_conversion_original_not_on_hold' using errcode = 'P0001';
    end if;
  end if;

  select current_version_id into v_accepted_version_id
  from public.workspace_proposals
  where journey_planning_record_id = p_record_id;

  insert into public.workspace_journeys (
    journey_planning_record_id, traveller_id, corporate_contact_id,
    owner_id, destination_region, service_category,
    confirmed_start_date, confirmed_end_date,
    adults, children, infants, nights, departure_city,
    accepted_proposal_version_id,
    stage, stage_changed_at, adoption_status,
    supersedes_journey_id, updated_by
  )
  values (
    p_record_id, v_record.traveller_id, v_record.corporate_contact_id,
    v_record.owner_id, v_record.destination_region, v_record.service_category,
    p_confirmed_start_date, p_confirmed_end_date,
    v_record.adults, v_record.children, v_record.infants, v_record.nights, v_record.preferred_departure_city,
    v_accepted_version_id,
    'confirmed', now(), 'adopted',
    v_record.replaces_journey_id, p_actor_id
  )
  returning id, journey_reference into v_journey_id, v_reference;

  -- Primary Operational Contact. Replacement: copied from the original's
  -- current primary contact (WS13-004A AC-03, BR-046). Otherwise: from the
  -- party (I-04).
  if v_record.replaces_journey_id is not null then
    select c.contact_type, c.name, c.organisation, c.phone, c.email
      into v_contact_type, v_contact_name, v_contact_org, v_contact_phone, v_contact_email
    from public.workspace_journey_operational_contacts c
    where c.journey_id = v_record.replaces_journey_id and c.is_primary;
    if found then
      v_contact_source := 'original_journey';
    end if;
  end if;

  if v_contact_source = 'party' then
    if v_record.corporate_contact_id is not null then
      select 'corporate_organisation', cc.contact_name, cc.company_name, cc.contact_phone, cc.contact_email
        into v_contact_type, v_contact_name, v_contact_org, v_contact_phone, v_contact_email
      from public.workspace_corporate_contacts cc where cc.id = v_record.corporate_contact_id;
    else
      select 'individual_traveller', t.full_name, null, t.phone, t.email
        into v_contact_type, v_contact_name, v_contact_org, v_contact_phone, v_contact_email
      from public.workspace_travellers t where t.id = v_record.traveller_id;
    end if;
  end if;

  if v_contact_name is not null then
    insert into public.workspace_journey_operational_contacts
      (journey_id, is_primary, contact_type, name, organisation, phone, email, created_by)
    values
      (v_journey_id, true, v_contact_type, v_contact_name, v_contact_org, v_contact_phone, v_contact_email, p_actor_id);
  end if;

  -- Replacement: carry Journey Documents with a verification reset
  -- (WS13-004A AC-06, BR-046, O-A4): Verified -> Received; Not Applicable
  -- -> Outstanding (previous reason kept in notes). Rows are copied, never
  -- moved; the original is not modified.
  if v_record.replaces_journey_id is not null then
    insert into public.workspace_journey_documents (
      journey_id, document_type, traveller_id, traveller_label, requirement, source,
      status, external_reference, external_link, notes, carried_from_document_id,
      status_changed_at, status_changed_by, created_by
    )
    select
      v_journey_id, d.document_type, d.traveller_id, d.traveller_label, d.requirement, 'carried',
      case d.status when 'verified' then 'received' when 'not_applicable' then 'outstanding' else d.status end,
      d.external_reference, d.external_link,
      concat_ws(E'\n',
        'Carried from ' || v_original.journey_reference,
        case when d.status = 'not_applicable' then 'Previously marked Not Applicable on ' || v_original.journey_reference || '.' end,
        nullif(d.notes, '')
      ),
      d.id,
      now(), p_actor_id, p_actor_id
    from public.workspace_journey_documents d
    where d.journey_id = v_record.replaces_journey_id
    order by d.created_at, d.id;

    insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
    select 'journey', v_journey_id, 'document_added', p_actor_id,
           jsonb_build_object('document_id', d.id, 'carried_from_document_id', d.carried_from_document_id)
    from public.workspace_journey_documents d
    where d.journey_id = v_journey_id and d.carried_from_document_id is not null;

    -- Supersede the original in the same business event (FR-JW-12 AC3).
    update public.workspace_journeys
    set outcome = 'superseded',
        outcome_reason = 'Material Amendment',
        on_hold = false,
        on_hold_reason = null,
        on_hold_since = null,
        updated_by = p_actor_id
    where id = v_original.id;

    insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
    values ('journey', v_original.id, 'journey_superseded', p_actor_id,
            jsonb_build_object(
              'superseded_by_journey_id', v_journey_id,
              'superseded_by_journey_reference', v_reference,
              'reason', 'Material Amendment'
            ));
  end if;

  -- Close the planning record (unchanged WS12 behaviour).
  update public.workspace_journey_planning_records
  set stage = 'closed', outcome = 'confirmed'
  where id = p_record_id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_converted', p_actor_id,
    jsonb_build_object(
      'journey_id', v_journey_id,
      'journey_reference', v_reference,
      'confirmed_start_date', p_confirmed_start_date,
      'confirmed_end_date', p_confirmed_end_date
    )
  );

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_closed', p_actor_id,
    jsonb_build_object('outcome', 'confirmed')
  );

  -- F-05 / G-03: the Journey's own first Timeline event.
  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey', v_journey_id, 'journey_created', p_actor_id,
    jsonb_build_object(
      'journey_planning_record_id', p_record_id,
      'journey_reference', v_reference,
      'owner_id', v_record.owner_id,
      'service_category', v_record.service_category,
      'confirmed_start_date', p_confirmed_start_date,
      'confirmed_end_date', p_confirmed_end_date,
      'contact_source', v_contact_source,
      'supersedes_journey_id', v_record.replaces_journey_id
    )
  );

  -- IN-01 "Journey confirmed" to the owner (FR-JW-07 AC3).
  insert into public.workspace_notifications
    (recipient_user_id, notification_type, category, entity_type, entity_id, message)
  values
    (v_record.owner_id, 'informational', 'journey_confirmed', 'journey', v_journey_id,
     'Journey ' || v_reference || ' confirmed: ' || v_record.title);

  -- IN-05 "Journey Superseded" to the owner(s) of both Journeys (FR-JW-27).
  if v_record.replaces_journey_id is not null then
    insert into public.workspace_notifications
      (recipient_user_id, notification_type, category, entity_type, entity_id, message)
    select distinct u, 'informational', 'journey_superseded', 'journey', v_journey_id,
           'Journey ' || v_original.journey_reference || ' was superseded by ' || v_reference || ' (Material Amendment).'
    from unnest(array[v_original.owner_id, v_record.owner_id]) as u
    where u is not null;
  end if;

  return v_journey_id;
end;
$$;

comment on function public.workspace_convert_journey_planning_record(uuid, uuid, date, date) is
  'AD-WS13-003 conversion v2 (CM-01/02/05/07, PD-A, BR-046): self-authorising; validates owner, confirmed dates, nights consistency and Service Category; creates the owned, dated Journey with its JRN reference and Primary Operational Contact; for a replacement, carries contact and documents and supersedes the original; closes the planning record; audits all three entities; sends IN-01 (and IN-05). One transaction.';

revoke all on function public.workspace_convert_journey_planning_record(uuid, uuid, date, date) from public, anon;
grant execute on function public.workspace_convert_journey_planning_record(uuid, uuid, date, date) to authenticated;
