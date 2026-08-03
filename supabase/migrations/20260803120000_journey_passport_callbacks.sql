-- EBC-013: callback preferences attached to the existing Journey Passport lifecycle.
-- This migration is additive and creates no new tables.

alter table public.journey_passport_leads
  add column if not exists initial_notification_email_id text,
  add column if not exists initial_notification_message_id text,
  add column if not exists callback_preference jsonb,
  add column if not exists callback_preference_fingerprint text,
  add column if not exists callback_requested_at timestamptz,
  add column if not exists callback_notification_status text
    check (callback_notification_status is null or callback_notification_status in ('pending', 'sent', 'failed', 'not-configured')),
  add column if not exists callback_notification_attempted_at timestamptz,
  add column if not exists callback_notification_sent_at timestamptz,
  add column if not exists callback_notification_error_code text,
  add column if not exists callback_notification_claim_token uuid,
  add column if not exists callback_notification_claim_fingerprint text,
  add column if not exists callback_notified_fingerprint text,
  add column if not exists callback_notification_email_id text,
  add column if not exists callback_notification_message_id text;

alter table public.journey_passport_events
  drop constraint if exists journey_passport_events_event_type_check;

alter table public.journey_passport_events
  add constraint journey_passport_events_event_type_check check (event_type in (
    'passport_issued',
    'lead_saved',
    'notification_sent',
    'notification_failed',
    'journey_director_entered',
    'whatsapp_handoff_opened',
    'callback_preference_updated'
  ));

create or replace function public.claim_journey_passport_callback(
  p_passport_reference text,
  p_guest_name text,
  p_mobile_normalized text,
  p_preferred_date date,
  p_preferred_time_window text,
  p_additional_comments text,
  p_fingerprint text,
  p_claim_token uuid
)
returns table (
  notification_claimed boolean,
  initial_provider_request_id text,
  initial_message_id text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claimed boolean := false;
  v_initial_provider_request_id text;
  v_initial_message_id text;
begin
  if p_passport_reference is null
    or p_guest_name is null
    or p_mobile_normalized is null
    or p_preferred_date is null
    or p_preferred_date < (now() at time zone 'Asia/Kolkata')::date
    or extract(isodow from p_preferred_date) = 7
    or p_preferred_time_window is null
    or p_preferred_time_window not in ('10:00 AM–1:00 PM', '1:00 PM–4:00 PM', '4:00 PM–7:00 PM')
    or char_length(coalesce(p_additional_comments, '')) > 500
    or p_fingerprint is null
    or p_fingerprint !~ '^[a-f0-9]{64}$'
    or p_claim_token is null then
    return;
  end if;

  update public.journey_passport_leads as lead
  set callback_preference = jsonb_build_object(
        'preferredDate', p_preferred_date::text,
        'preferredTimeWindow', p_preferred_time_window,
        'additionalComments', coalesce(p_additional_comments, '')
      ),
      callback_preference_fingerprint = p_fingerprint,
      callback_requested_at = now(),
      updated_at = now()
  where lead.passport_reference = p_passport_reference
    and lead.guest_name = p_guest_name
    and lead.mobile_normalized = p_mobile_normalized
    and char_length(lead.guest_name) between 2 and 80
    and lead.mobile_normalized ~ '^[0-9]{10,15}$'
  returning lead.initial_notification_email_id, lead.initial_notification_message_id
    into v_initial_provider_request_id, v_initial_message_id;

  if not found then
    return;
  end if;

  update public.journey_passport_leads as lead
  set callback_notification_status = 'pending',
      callback_notification_attempted_at = now(),
      callback_notification_error_code = null,
      callback_notification_claim_token = p_claim_token,
      callback_notification_claim_fingerprint = p_fingerprint,
      updated_at = now()
  where lead.passport_reference = p_passport_reference
    and lead.callback_notified_fingerprint is distinct from p_fingerprint
    and (
      lead.callback_notification_claim_fingerprint is distinct from p_fingerprint
      or lead.callback_notification_attempted_at is null
      or lead.callback_notification_attempted_at < now() - interval '10 minutes'
    );

  v_claimed := found;
  return query select v_claimed, v_initial_provider_request_id, v_initial_message_id;
end;
$$;

revoke all on function public.claim_journey_passport_callback(text, text, text, date, text, text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.claim_journey_passport_callback(text, text, text, date, text, text, text, uuid)
  to service_role;

comment on function public.claim_journey_passport_callback(text, text, text, date, text, text, text, uuid) is
  'Updates an existing Passport callback preference and atomically claims one notification for each distinct value.';
