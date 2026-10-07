-- EBC-R1.3-WS13-022 (Phase 1, Milestone A), migration M11.
-- Engineering baseline: EBC-R1.3-WS13-020 Revision 2 §9 (approved
-- 4-Oct-2026, DEC-R1.3-026); architecture review EBC-R1.3-WS13-020A
-- (conditions AC-1 … AC-9).
--
-- Journey lifecycle RPCs (AD-WS13-001, AD-WS13-002). FUNCTIONS ONLY:
-- no table, column, constraint, index, view, policy or data change. Every
-- audit event type written here already exists in the M02 CHECK
-- (20260928100100).
--
-- Public functions (execute granted to authenticated):
--   1 workspace_journey_transition            FR-JW-08/09; BR-025, BR-028
--   2 workspace_journey_place_on_hold         FR-JW-10; BR-029
--   3 workspace_journey_resume                FR-JW-10; BR-029
--   4 workspace_journey_cancel                FR-JW-11; BR-030
--   5 workspace_journey_close                 FR-JW-11 (Mark as Completed)
--   6 workspace_journey_reassign              FR-JW-03/31; BR-026
--   7 workspace_journey_assign_template       FR-JW-23; BR-041 (Start preparation)
--   8 workspace_journey_set_service_category  FR-JW-01 AC5; BR-043
--   9 workspace_journey_adopt_legacy          BR-036, BR-040, BR-043; PO Decision 5
--
-- Internal helpers (execute revoked from public, anon and authenticated;
-- callable only from the functions above, which run as the owner):
--   workspace_journey_lock_for_change     common guard G1–G6 (plan §9.1)
--   workspace_journey_derive_template_items  AC-2: one readiness-item builder
--   workspace_journey_notify              AC-6 and WS13-001 §16 recipient rules
--
-- Conventions (AC-1): SECURITY DEFINER, search_path = public, every object
-- public.-qualified, p_/v_ naming, the actor is always auth.uid() (AD-WS13-002;
-- no p_actor_id parameter). Each error is raised as its code (message);
-- errcode 42501 for not_authorised, P0002 for not_found, P0001 otherwise.
-- The application maps codes to messages (lib/workspace/journey-workspace).
--
-- Lockstep: the stage pairs accepted by workspace_journey_transition, and
-- the holdable / cancellable stages, mirror JOURNEY_STAGE_TRANSITIONS,
-- JOURNEY_HOLDABLE_STAGES and JOURNEY_CANCELLABLE_STAGES in
-- web/lib/workspace/journey-workspace/types.ts. Change both together.
--
-- History order: every audit row written here sets created_at =
-- clock_timestamp() (not the column default now(), which is the
-- transaction start), so events written by one call (template assigned →
-- stage changed; task created → cancelled; adopted → contact changed) keep
-- their written order under ORDER BY created_at. No column change.
--
-- Readiness (PO Decision 4): the BR-028 gate reads the operational summary
-- view (AC-3). With no readiness template items configured it never blocks;
-- template content (Phase 2) activates it with no change here.
--
-- Backward compatible: additive functions only; no deployed code calls
-- them. Rollback (engineering forward-fix, prepared separately, AC-7): drop
-- the nine public functions and the three internal helpers. No data
-- rollback is needed: rows written by these functions satisfy the M07
-- constraints.

-- =====================================================================
-- Internal helpers
-- =====================================================================

-- G1–G6 (plan §9.1). p_mode: 'change' (owner or Administrator, adopted
-- Journey) or 'adopt' (Administrator, legacy_pending Journey). Locks the
-- Journey row FOR UPDATE for the caller's transaction.
create or replace function public.workspace_journey_lock_for_change(p_journey_id uuid, p_mode text)
returns public.workspace_journeys
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.workspace_users%rowtype;
  v_journey public.workspace_journeys%rowtype;
begin
  select * into v_actor from public.workspace_users where user_id = auth.uid();
  if not found or v_actor.deactivated_at is not null then
    raise exception 'workspace_journey_not_authorised' using errcode = '42501';
  end if;

  select * into v_journey from public.workspace_journeys where id = p_journey_id for update;
  if not found then
    raise exception 'workspace_journey_not_found' using errcode = 'P0002';
  end if;

  if v_journey.archived_at is not null then
    raise exception 'workspace_journey_archived' using errcode = 'P0001';
  end if;

  if v_journey.stage = 'journey_closed' or v_journey.outcome is not null then
    raise exception 'workspace_journey_terminal' using errcode = 'P0001';
  end if;

  if p_mode = 'adopt' then
    if v_journey.adoption_status <> 'legacy_pending' then
      raise exception 'workspace_journey_not_legacy' using errcode = 'P0001';
    end if;
    if v_actor.role <> 'administrator' then
      raise exception 'workspace_journey_not_authorised' using errcode = '42501';
    end if;
  else
    if v_journey.adoption_status <> 'adopted' then
      raise exception 'workspace_journey_legacy_pending' using errcode = 'P0001';
    end if;
    if not (v_actor.role = 'administrator' or v_journey.owner_id = v_actor.user_id) then
      raise exception 'workspace_journey_not_authorised' using errcode = '42501';
    end if;
  end if;

  return v_journey;
end;
$$;

comment on function public.workspace_journey_lock_for_change(uuid, text) is
  'M11 internal (EBC-R1.3-WS13-020 §9.1 G1–G6): active caller; Journey exists (locked FOR UPDATE), not archived, not terminal; owner-or-Administrator on an adopted Journey (change) or Administrator on a legacy_pending Journey (adopt).';

-- AC-2: the single readiness-item builder used by Start preparation and
-- legacy adoption. Creates one item per ACTIVE template item. Returns the
-- number created (0 in Phase 1: template items arrive with M05b, TL-04).
create or replace function public.workspace_journey_derive_template_items(
  p_journey_id uuid,
  p_template_id uuid,
  p_actor_id uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.workspace_journey_readiness_items (
    journey_id, template_item_id, source, category, label, requirement,
    allows_not_applicable, item_kind, system_rule, created_by
  )
  select
    p_journey_id, ti.id, 'template', ti.category, ti.label, ti.requirement,
    ti.allows_not_applicable, ti.item_kind, ti.system_rule, p_actor_id
  from public.workspace_readiness_template_items ti
  where ti.template_id = p_template_id
    and ti.active
  order by ti.sort, ti.id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

comment on function public.workspace_journey_derive_template_items(uuid, uuid, uuid) is
  'M11 internal (AC-2): creates the template-sourced readiness items for a Journey from the active items of a Readiness Template. Used by workspace_journey_assign_template and workspace_journey_adopt_legacy only.';

-- Informational notifications (WS13-001 §16 IN-02/03/04; AC-6): skipped when
-- there is no recipient, when the recipient is the caller, or when the
-- recipient is deactivated.
create or replace function public.workspace_journey_notify(
  p_recipient_id uuid,
  p_category text,
  p_journey_id uuid,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_recipient_id is null or p_recipient_id = auth.uid() then
    return;
  end if;

  if not exists (
    select 1 from public.workspace_users u
    where u.user_id = p_recipient_id and u.deactivated_at is null
  ) then
    return;
  end if;

  insert into public.workspace_notifications
    (recipient_user_id, notification_type, category, entity_type, entity_id, message)
  values
    (p_recipient_id, 'informational', p_category, 'journey', p_journey_id, p_message);
end;
$$;

comment on function public.workspace_journey_notify(uuid, text, uuid, text) is
  'M11 internal (AC-6): inserts an informational Journey notification unless the recipient is missing, is the caller, or is deactivated.';

revoke all on function public.workspace_journey_lock_for_change(uuid, text) from public, anon, authenticated;
revoke all on function public.workspace_journey_derive_template_items(uuid, uuid, uuid) from public, anon, authenticated;
revoke all on function public.workspace_journey_notify(uuid, text, uuid, text) from public, anon, authenticated;

-- =====================================================================
-- 1. Stage transition (advance, step back)
-- =====================================================================
-- Pairs handled here: in_preparation→ready_to_travel,
-- ready_to_travel→travelling, ready_to_travel→in_preparation (step back),
-- travelling→travel_complete, travel_complete→post_travel.
-- confirmed→in_preparation is Start preparation (function 7);
-- post_travel→journey_closed is Mark as Completed (function 5).
create or replace function public.workspace_journey_transition(
  p_journey_id uuid,
  p_expected_stage text,
  p_to_stage text,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_unresolved integer;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if v_journey.on_hold then
    raise exception 'workspace_journey_on_hold' using errcode = 'P0001';
  end if;

  if not (
    (v_journey.stage = 'in_preparation' and p_to_stage = 'ready_to_travel')
    or (v_journey.stage = 'ready_to_travel' and p_to_stage in ('travelling', 'in_preparation'))
    or (v_journey.stage = 'travelling' and p_to_stage = 'travel_complete')
    or (v_journey.stage = 'travel_complete' and p_to_stage = 'post_travel')
  ) then
    raise exception 'workspace_journey_transition_not_allowed' using errcode = 'P0001';
  end if;

  if length(coalesce(v_note, '')) > 1000 then
    raise exception 'workspace_journey_note_too_long' using errcode = 'P0001';
  end if;

  -- BR-028 (AC-3: read from the summary view; PO Decision 4).
  if p_to_stage = 'ready_to_travel' then
    if v_journey.readiness_template_id is null then
      raise exception 'workspace_journey_readiness_incomplete' using errcode = 'P0001';
    end if;
    select s.readiness_mandatory_unresolved into v_unresolved
    from public.workspace_journey_operational_summary s
    where s.journey_id = v_journey.id;
    if coalesce(v_unresolved, 0) > 0 then
      raise exception 'workspace_journey_readiness_incomplete' using errcode = 'P0001';
    end if;
  end if;

  -- FR-JW-09: date gates in the business time zone.
  if p_to_stage = 'travelling'
     and (v_journey.confirmed_start_date is null
          or v_journey.confirmed_start_date > public.workspace_business_today()) then
    raise exception 'workspace_journey_start_date_not_reached' using errcode = 'P0001';
  end if;

  if p_to_stage = 'travel_complete'
     and (v_journey.confirmed_end_date is null
          or v_journey.confirmed_end_date > public.workspace_business_today()) then
    raise exception 'workspace_journey_end_date_not_reached' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set stage = p_to_stage,
      stage_changed_at = now(),
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values (
    'journey', v_journey.id,
    case when v_journey.stage = 'ready_to_travel' and p_to_stage = 'in_preparation'
         then 'journey_stage_stepped_back' else 'journey_stage_changed' end,
    auth.uid(),
    jsonb_build_object('from', v_journey.stage, 'to', p_to_stage, 'note', v_note),
    clock_timestamp()
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_transition(uuid, text, text, text) is
  'M11 (WS13-001 §10.2; BR-025, BR-028; FR-JW-08/09): advance or step back a Journey stage with optimistic concurrency, readiness and date gates; audited.';

-- =====================================================================
-- 2. Place on hold
-- =====================================================================
create or replace function public.workspace_journey_place_on_hold(
  p_journey_id uuid,
  p_expected_stage text,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_reason text := trim(coalesce(p_reason, ''));
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if v_journey.on_hold then
    raise exception 'workspace_journey_already_on_hold' using errcode = 'P0001';
  end if;

  if v_journey.stage not in ('confirmed', 'in_preparation', 'ready_to_travel') then
    raise exception 'workspace_journey_hold_not_allowed' using errcode = 'P0001';
  end if;

  if v_reason = '' then
    raise exception 'workspace_journey_reason_required' using errcode = 'P0001';
  end if;
  if length(v_reason) > 500 then
    raise exception 'workspace_journey_reason_too_long' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set on_hold = true,
      on_hold_reason = v_reason,
      on_hold_since = now(),
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_on_hold', auth.uid(),
          jsonb_build_object('stage', v_journey.stage, 'reason', v_reason), clock_timestamp());

  perform public.workspace_journey_notify(
    v_journey.owner_id, 'journey_on_hold', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was placed on hold.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_place_on_hold(uuid, text, text) is
  'M11 (BR-029; FR-JW-10): place a Journey on hold from Confirmed, In Preparation or Ready to Travel with a reason; audited; IN-03.';

-- =====================================================================
-- 3. Resume
-- =====================================================================
create or replace function public.workspace_journey_resume(
  p_journey_id uuid,
  p_expected_stage text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if not v_journey.on_hold then
    raise exception 'workspace_journey_not_on_hold' using errcode = 'P0001';
  end if;

  -- Protects the Phase 4 replacement flow (AD-WS13-003; Archie 020A §2).
  if exists (
    select 1 from public.workspace_journey_planning_records r
    where r.replaces_journey_id = v_journey.id and r.stage <> 'closed'
  ) then
    raise exception 'workspace_journey_replacement_open' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set on_hold = false,
      on_hold_reason = null,
      on_hold_since = null,
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_resumed', auth.uid(),
          jsonb_build_object('stage', v_journey.stage,
                             'held_since', v_journey.on_hold_since,
                             'reason', v_journey.on_hold_reason), clock_timestamp());

  perform public.workspace_journey_notify(
    v_journey.owner_id, 'journey_resumed', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was resumed.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_resume(uuid, text) is
  'M11 (BR-029; FR-JW-10): resume a held Journey to its held-from stage (stage is unchanged while held, AD-WS13-001); audited; IN-03.';

-- =====================================================================
-- 4. Cancel
-- =====================================================================
create or replace function public.workspace_journey_cancel(
  p_journey_id uuid,
  p_expected_stage text,
  p_reason text,
  p_cancellation_task_booking_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_reason text := trim(coalesce(p_reason, ''));
  v_booking_ids uuid[];
  v_assignee uuid;
  v_task record;
  v_task_count integer := 0;
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if v_journey.stage not in ('confirmed', 'in_preparation', 'ready_to_travel', 'travelling') then
    raise exception 'workspace_journey_cancel_not_allowed' using errcode = 'P0001';
  end if;

  if v_reason = '' then
    raise exception 'workspace_journey_reason_required' using errcode = 'P0001';
  end if;
  if length(v_reason) > 500 then
    raise exception 'workspace_journey_reason_too_long' using errcode = 'P0001';
  end if;

  select coalesce(array_agg(distinct b), '{}') into v_booking_ids
  from unnest(coalesce(p_cancellation_task_booking_ids, '{}'::uuid[])) as b
  where b is not null;

  if exists (
    select 1 from unnest(v_booking_ids) as b
    where not exists (
      select 1 from public.workspace_journey_vendor_bookings vb
      where vb.id = b and vb.journey_id = v_journey.id and vb.status <> 'cancelled'
    )
  ) then
    raise exception 'workspace_journey_booking_invalid' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.workspace_journey_planning_records r
    where r.replaces_journey_id = v_journey.id and r.stage <> 'closed'
  ) then
    raise exception 'workspace_journey_replacement_open' using errcode = 'P0001';
  end if;

  -- Cancelling from On Hold: clear the hold in the same statement as the
  -- outcome (M07 workspace_journeys_on_hold_check).
  update public.workspace_journeys
  set outcome = 'cancelled',
      outcome_reason = v_reason,
      on_hold = false,
      on_hold_reason = null,
      on_hold_since = null,
      updated_by = auth.uid()
  where id = v_journey.id;

  -- FR-JW-11 AC2. Assignee: the owner, or the caller when the owner is
  -- deactivated (Archie AR-F6; Arjun confirms before Phase 2).
  select case when exists (
           select 1 from public.workspace_users u
           where u.user_id = v_journey.owner_id and u.deactivated_at is null
         ) then v_journey.owner_id else auth.uid() end
  into v_assignee;

  for v_task in
    insert into public.workspace_tasks
      (entity_type, entity_id, title, category, kind, assigned_to_user_id, created_by_user_id)
    select 'journey', v_journey.id,
           'Cancel vendor booking: ' || v.name || ' · ' || vb.service_type,
           'operational', 'task', v_assignee, auth.uid()
    from public.workspace_journey_vendor_bookings vb
    join public.workspace_vendors v on v.id = vb.vendor_id
    where vb.id = any (v_booking_ids)
    order by vb.created_at, vb.id
    returning id, title
  loop
    v_task_count := v_task_count + 1;
    insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
    values ('journey', v_journey.id, 'task_created', auth.uid(),
            jsonb_build_object('task_id', v_task.id, 'title', v_task.title, 'source', 'journey_cancelled'), clock_timestamp());
  end loop;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_cancelled', auth.uid(),
          jsonb_build_object('stage', v_journey.stage, 'reason', v_reason,
                             'was_on_hold', v_journey.on_hold,
                             'cancellation_tasks', v_task_count), clock_timestamp());

  perform public.workspace_journey_notify(
    v_journey.owner_id, 'journey_cancelled', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was cancelled.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_cancel(uuid, text, text, uuid[]) is
  'M11 (BR-030; FR-JW-11): cancel a Journey (Confirmed through Travelling, or On Hold) with a reason; optional vendor-cancellation tasks for selected bookings; audited; IN-04.';

-- =====================================================================
-- 5. Close (Mark as Completed)
-- =====================================================================
create or replace function public.workspace_journey_close(
  p_journey_id uuid,
  p_expected_stage text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_open_tasks integer;
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if v_journey.stage <> 'post_travel' then
    raise exception 'workspace_journey_close_not_allowed' using errcode = 'P0001';
  end if;

  select count(*) into v_open_tasks
  from public.workspace_tasks t
  where t.entity_type = 'journey' and t.entity_id = v_journey.id and t.status = 'open';

  -- AD-WS13-001: closed_at is set on entering journey_closed only.
  update public.workspace_journeys
  set stage = 'journey_closed',
      stage_changed_at = now(),
      closed_at = now(),
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_closed', auth.uid(),
          jsonb_build_object('from', 'post_travel', 'open_tasks', v_open_tasks), clock_timestamp());

  perform public.workspace_journey_notify(
    v_journey.owner_id, 'journey_closed', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was marked as Completed.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_close(uuid, text) is
  'M11 (FR-JW-11; BR-030): Mark as Completed from Post Travel (stage journey_closed, UI label "Completed"); audited; IN-04.';

-- =====================================================================
-- 6. Reassign
-- =====================================================================
create or replace function public.workspace_journey_reassign(
  p_journey_id uuid,
  p_expected_owner_id uuid,
  p_new_owner_id uuid,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.owner_id is distinct from p_expected_owner_id then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if p_new_owner_id is null or not exists (
    select 1 from public.workspace_users u
    where u.user_id = p_new_owner_id and u.deactivated_at is null
  ) then
    raise exception 'workspace_journey_new_owner_invalid' using errcode = 'P0001';
  end if;

  if p_new_owner_id = v_journey.owner_id then
    raise exception 'workspace_journey_owner_unchanged' using errcode = 'P0001';
  end if;

  if length(coalesce(v_note, '')) > 1000 then
    raise exception 'workspace_journey_note_too_long' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set owner_id = p_new_owner_id,
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_reassigned', auth.uid(),
          jsonb_build_object('from', v_journey.owner_id, 'to', p_new_owner_id, 'note', v_note), clock_timestamp());

  perform public.workspace_journey_notify(
    p_new_owner_id, 'journey_assigned', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was assigned to you.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_reassign(uuid, uuid, uuid, text) is
  'M11 (FR-JW-03/31; BR-026): owner assigns own Journey or Administrator reassigns any, before a terminal outcome, to an active Workspace User; audited; IN-02.';

-- =====================================================================
-- 7. Assign template (Start preparation)
-- =====================================================================
create or replace function public.workspace_journey_assign_template(
  p_journey_id uuid,
  p_expected_stage text,
  p_template_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_template public.workspace_readiness_templates%rowtype;
  v_items integer;
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_journey.stage is distinct from p_expected_stage then
    raise exception 'workspace_journey_stale' using errcode = 'P0001';
  end if;

  if v_journey.stage <> 'confirmed' then
    raise exception 'workspace_journey_transition_not_allowed' using errcode = 'P0001';
  end if;

  if v_journey.on_hold then
    raise exception 'workspace_journey_on_hold' using errcode = 'P0001';
  end if;

  select * into v_template
  from public.workspace_readiness_templates t
  where t.id = p_template_id and t.active;
  if not found then
    raise exception 'workspace_journey_template_invalid' using errcode = 'P0001';
  end if;

  -- Changing a template is Phase 2 (workspace_journey_change_template).
  if v_journey.readiness_template_id is not null
     and v_journey.readiness_template_id <> p_template_id then
    raise exception 'workspace_journey_template_already_assigned' using errcode = 'P0001';
  end if;

  if v_journey.readiness_template_id is null then
    update public.workspace_journeys
    set readiness_template_id = p_template_id
    where id = v_journey.id;

    v_items := public.workspace_journey_derive_template_items(v_journey.id, p_template_id, auth.uid());

    insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
    values ('journey', v_journey.id, 'journey_template_assigned', auth.uid(),
            jsonb_build_object('template_id', v_template.id, 'template_code', v_template.code,
                               'template_name', v_template.name, 'items_created', v_items), clock_timestamp());
  end if;

  -- BR-041 gate satisfied in the same transaction.
  update public.workspace_journeys
  set stage = 'in_preparation',
      stage_changed_at = now(),
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_stage_changed', auth.uid(),
          jsonb_build_object('from', 'confirmed', 'to', 'in_preparation', 'note', null), clock_timestamp());

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_assign_template(uuid, text, uuid) is
  'M11 (BR-041; FR-JW-23): Start preparation — assigns the Readiness Template (or keeps the one set at adoption), derives its items (AC-2) and moves Confirmed → In Preparation; audited.';

-- =====================================================================
-- 8. Set Service Category
-- =====================================================================
create or replace function public.workspace_journey_set_service_category(
  p_journey_id uuid,
  p_service_category text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_code text := nullif(trim(coalesce(p_service_category, '')), '');
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'change');

  if v_code is null or not public.workspace_config_has_code('service_categories', v_code, true) then
    raise exception 'workspace_journey_service_category_invalid' using errcode = 'P0001';
  end if;

  if v_code = v_journey.service_category then
    raise exception 'workspace_journey_service_category_unchanged' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set service_category = v_code,
      updated_by = auth.uid()
  where id = v_journey.id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_service_category_changed', auth.uid(),
          jsonb_build_object('from', v_journey.service_category, 'to', v_code), clock_timestamp());

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_set_service_category(uuid, text) is
  'M11 (BR-043; FR-JW-01 AC5; FR-JW-30): change the primary Service Category of an adopted, non-terminal Journey; audited.';

-- =====================================================================
-- 9. Adopt legacy Journey
-- =====================================================================
create or replace function public.workspace_journey_adopt_legacy(
  p_journey_id uuid,
  p_owner_id uuid,
  p_confirmed_start_date date,
  p_confirmed_end_date date,
  p_service_category text,
  p_readiness_template_id uuid,
  p_contact_type text,
  p_contact_name text,
  p_contact_organisation text,
  p_contact_phone text,
  p_contact_email text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.workspace_journeys%rowtype;
  v_template public.workspace_readiness_templates%rowtype;
  v_contact public.workspace_journey_operational_contacts%rowtype;
  v_code text := nullif(trim(coalesce(p_service_category, '')), '');
  v_nights integer;
  v_nights_source text;
  v_items integer;
  v_name text := nullif(trim(coalesce(p_contact_name, '')), '');
  v_org text := nullif(trim(coalesce(p_contact_organisation, '')), '');
  v_phone text := nullif(trim(coalesce(p_contact_phone, '')), '');
  v_email text := nullif(trim(coalesce(p_contact_email, '')), '');
  v_contact_changed boolean := false;
begin
  v_journey := public.workspace_journey_lock_for_change(p_journey_id, 'adopt');

  if p_owner_id is null or not exists (
    select 1 from public.workspace_users u
    where u.user_id = p_owner_id and u.deactivated_at is null
  ) then
    raise exception 'workspace_journey_new_owner_invalid' using errcode = 'P0001';
  end if;

  if p_confirmed_start_date is null or p_confirmed_end_date is null then
    raise exception 'workspace_journey_dates_required' using errcode = 'P0001';
  end if;
  if p_confirmed_end_date < p_confirmed_start_date then
    raise exception 'workspace_journey_dates_invalid' using errcode = 'P0001';
  end if;

  -- PO Decision 5: stored nights must match the dates; missing nights are
  -- derived from the dates the Administrator enters (recorded in History).
  if v_journey.nights is null then
    v_nights := p_confirmed_end_date - p_confirmed_start_date;
    v_nights_source := 'derived_from_dates';
  elsif (p_confirmed_end_date - p_confirmed_start_date) <> v_journey.nights then
    raise exception 'workspace_journey_dates_nights_mismatch' using errcode = 'P0001';
  else
    v_nights := v_journey.nights;
    v_nights_source := 'stored';
  end if;

  if v_code is null then
    raise exception 'workspace_journey_service_category_required' using errcode = 'P0001';
  end if;
  if not public.workspace_config_has_code('service_categories', v_code, true) then
    raise exception 'workspace_journey_service_category_invalid' using errcode = 'P0001';
  end if;

  select * into v_template
  from public.workspace_readiness_templates t
  where t.id = p_readiness_template_id and t.active;
  if not found then
    raise exception 'workspace_journey_template_invalid' using errcode = 'P0001';
  end if;

  -- BR-040.
  if p_contact_type is null
     or p_contact_type not in ('individual_traveller', 'corporate_organisation', 'b2b_travel_partner', 'other_authorised_entity')
     or v_name is null
     or (p_contact_type in ('corporate_organisation', 'b2b_travel_partner') and v_org is null)
     or (v_phone is null and v_email is null) then
    raise exception 'workspace_journey_contact_invalid' using errcode = 'P0001';
  end if;

  update public.workspace_journeys
  set owner_id = p_owner_id,
      confirmed_start_date = p_confirmed_start_date,
      confirmed_end_date = p_confirmed_end_date,
      nights = v_nights,
      service_category = v_code,
      readiness_template_id = v_template.id,
      adoption_status = 'adopted',
      updated_by = auth.uid()
  where id = v_journey.id;

  v_items := public.workspace_journey_derive_template_items(v_journey.id, v_template.id, auth.uid());

  select * into v_contact
  from public.workspace_journey_operational_contacts c
  where c.journey_id = v_journey.id and c.is_primary
  for update;

  if found then
    v_contact_changed :=
      v_contact.contact_type is distinct from p_contact_type
      or v_contact.name is distinct from v_name
      or v_contact.organisation is distinct from v_org
      or v_contact.phone is distinct from v_phone
      or v_contact.email is distinct from v_email;

    if v_contact_changed then
      update public.workspace_journey_operational_contacts
      set contact_type = p_contact_type,
          name = v_name,
          organisation = v_org,
          phone = v_phone,
          email = v_email,
          updated_by = auth.uid()
      where id = v_contact.id;
    end if;
  else
    v_contact_changed := true;
    insert into public.workspace_journey_operational_contacts
      (journey_id, is_primary, contact_type, name, organisation, phone, email, created_by)
    values
      (v_journey.id, true, p_contact_type, v_name, v_org, v_phone, v_email, auth.uid());
  end if;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
  values ('journey', v_journey.id, 'journey_legacy_adopted', auth.uid(),
          jsonb_build_object(
            'owner_id', p_owner_id,
            'confirmed_start_date', p_confirmed_start_date,
            'confirmed_end_date', p_confirmed_end_date,
            'service_category', v_code,
            'template_id', v_template.id,
            'template_code', v_template.code,
            'nights_source', v_nights_source,
            'nights', v_nights,
            'items_created', v_items
          ), clock_timestamp());

  -- AC-5: names and types only; no phone or email values in audit.
  if v_contact_changed then
    insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data, created_at)
    values ('journey', v_journey.id, 'journey_contact_changed', auth.uid(),
            jsonb_build_object(
              'source', 'adoption',
              'before', case when v_contact.id is null then null else jsonb_build_object(
                          'type', v_contact.contact_type, 'name', v_contact.name,
                          'organisation', v_contact.organisation) end,
              'after', jsonb_build_object('type', p_contact_type, 'name', v_name, 'organisation', v_org),
              'phone_changed', v_contact.phone is distinct from v_phone,
              'email_changed', v_contact.email is distinct from v_email
            ), clock_timestamp());
  end if;

  perform public.workspace_journey_notify(
    p_owner_id, 'journey_assigned', v_journey.id,
    'Journey ' || v_journey.journey_reference || ' was adopted and assigned to you.'
  );

  return v_journey.id;
end;
$$;

comment on function public.workspace_journey_adopt_legacy(uuid, uuid, date, date, text, uuid, text, text, text, text, text) is
  'M11 (BR-036, BR-040, BR-043; PO Decision 5): Administrator completes a legacy_pending Journey — owner, confirmed dates (nights stored must match; missing nights derived and recorded), Service Category, Readiness Template (items derived, AC-2), Primary Operational Contact; audited; IN-02.';

-- =====================================================================
-- Grants (AC-1)
-- =====================================================================
revoke all on function public.workspace_journey_transition(uuid, text, text, text) from public, anon;
revoke all on function public.workspace_journey_place_on_hold(uuid, text, text) from public, anon;
revoke all on function public.workspace_journey_resume(uuid, text) from public, anon;
revoke all on function public.workspace_journey_cancel(uuid, text, text, uuid[]) from public, anon;
revoke all on function public.workspace_journey_close(uuid, text) from public, anon;
revoke all on function public.workspace_journey_reassign(uuid, uuid, uuid, text) from public, anon;
revoke all on function public.workspace_journey_assign_template(uuid, text, uuid) from public, anon;
revoke all on function public.workspace_journey_set_service_category(uuid, text) from public, anon;
revoke all on function public.workspace_journey_adopt_legacy(uuid, uuid, date, date, text, uuid, text, text, text, text, text) from public, anon;

grant execute on function public.workspace_journey_transition(uuid, text, text, text) to authenticated;
grant execute on function public.workspace_journey_place_on_hold(uuid, text, text) to authenticated;
grant execute on function public.workspace_journey_resume(uuid, text) to authenticated;
grant execute on function public.workspace_journey_cancel(uuid, text, text, uuid[]) to authenticated;
grant execute on function public.workspace_journey_close(uuid, text) to authenticated;
grant execute on function public.workspace_journey_reassign(uuid, uuid, uuid, text) to authenticated;
grant execute on function public.workspace_journey_assign_template(uuid, text, uuid) to authenticated;
grant execute on function public.workspace_journey_set_service_category(uuid, text) to authenticated;
grant execute on function public.workspace_journey_adopt_legacy(uuid, uuid, date, date, text, uuid, text, text, text, text, text) to authenticated;
