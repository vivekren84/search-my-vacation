-- EBC-R1.3-WS12-007 Phase 2: Database Foundation.
-- The one-way, atomic Decision-stage-to-Journey conversion (WS12-005
-- Solution Architecture Section 6.5, BR-012), flagged in WS12-006 as
-- R-ENG-JP-02, the highest-risk single operation in this module: it must
-- validate stage, validate no pre-existing Journey, insert the bootstrap
-- Journey, close the Journey Planning record, and write both audit entries
-- in one transaction, or not at all.
--
-- SECURITY DEFINER because it writes to workspace_journeys, which
-- intentionally has no direct authenticated INSERT policy (see that
-- table's own migration) -- the RPC is the only sanctioned write path.
-- p_actor_id is re-validated against auth.uid() inside the function so a
-- caller cannot forge the audit trail's actor even though the function
-- itself runs with elevated privilege.
--
-- Authorization (does the caller have permission to record a Decision /
-- trigger conversion on THIS record) is enforced in the Phase 3/4
-- application layer via shared/rbac/permissions.ts's canRecordDecision()
-- before this RPC is ever called -- this function enforces data integrity
-- invariants, not business authorization, matching the separation already
-- used elsewhere in this schema (RLS for authorization, RPC for
-- transactional integrity).

create or replace function public.workspace_convert_journey_planning_record(
  p_record_id uuid,
  p_actor_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.workspace_journey_planning_records%rowtype;
  v_journey_id uuid;
begin
  if p_actor_id is distinct from auth.uid() then
    raise exception 'workspace_conversion_actor_mismatch' using errcode = '28000';
  end if;

  select * into v_record
  from public.workspace_journey_planning_records
  where id = p_record_id
  for update;

  if not found then
    raise exception 'workspace_journey_planning_record_not_found' using errcode = 'P0002';
  end if;

  if v_record.stage <> 'decision' then
    raise exception 'workspace_journey_planning_record_not_in_decision_stage' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.workspace_journeys where journey_planning_record_id = p_record_id
  ) then
    raise exception 'workspace_journey_planning_record_already_converted' using errcode = 'P0001';
  end if;

  insert into public.workspace_journeys (journey_planning_record_id, traveller_id, corporate_contact_id, status)
  values (p_record_id, v_record.traveller_id, v_record.corporate_contact_id, 'active')
  returning id into v_journey_id;

  update public.workspace_journey_planning_records
  set stage = 'closed', outcome = 'confirmed'
  where id = p_record_id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_converted', p_actor_id,
    jsonb_build_object('journey_id', v_journey_id)
  );

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_closed', p_actor_id,
    jsonb_build_object('outcome', 'confirmed')
  );

  return v_journey_id;
end;
$$;

comment on function public.workspace_convert_journey_planning_record(uuid, uuid) is
  'Atomic, one-way Decision-stage-to-Journey conversion (R-ENG-JP-02). Validates stage, validates no pre-existing Journey, inserts the bootstrap Journey, closes the Journey Planning record with outcome=confirmed, and writes both audit entries in one transaction.';

revoke all on function public.workspace_convert_journey_planning_record(uuid, uuid) from public, anon;
grant execute on function public.workspace_convert_journey_planning_record(uuid, uuid) to authenticated;
