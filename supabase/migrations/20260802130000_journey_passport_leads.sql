-- EBC-009: Journey Passport lead capture and operational event timeline.
-- This migration is additive: it does not drop or replace existing objects.

create table if not exists public.journey_passport_leads (
  id uuid primary key default gen_random_uuid(),
  passport_reference text unique not null
    check (passport_reference ~ '^(SMV-[A-Z2-9]{8}|JY-[A-Z2-9]{4}-[A-Z2-9]{4})$'),
  guest_name text not null check (char_length(guest_name) between 2 and 80),
  mobile_number text not null check (char_length(mobile_number) between 10 and 24),
  mobile_normalized text not null check (mobile_normalized ~ '^[0-9]{10,15}$'),
  traveller_type text,
  companions jsonb,
  primary_dream text,
  travel_styles jsonb not null default '[]'::jsonb,
  timing jsonb,
  exact_dates jsonb,
  destination_mode text check (destination_mode is null or destination_mode in ('known', 'discovery')),
  destination_free_text text,
  entry_context jsonb,
  passport_summary jsonb not null,
  source text not null default 'journey-passport',
  status text not null default 'entered-journey-director',
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed', 'not-configured')),
  notification_attempted_at timestamptz,
  notification_sent_at timestamptz,
  notification_error_code text,
  notification_claim_token uuid,
  whatsapp_handoff_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journey_passport_leads_created_at_idx
  on public.journey_passport_leads (created_at desc);

create table if not exists public.journey_passport_events (
  id uuid primary key default gen_random_uuid(),
  passport_reference text not null
    references public.journey_passport_leads (passport_reference)
    on update cascade on delete cascade,
  event_type text not null check (event_type in (
    'passport_issued',
    'lead_saved',
    'notification_sent',
    'notification_failed',
    'journey_director_entered',
    'whatsapp_handoff_opened'
  )),
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (passport_reference, event_type)
);

create index if not exists journey_passport_events_reference_idx
  on public.journey_passport_events (passport_reference);

create index if not exists journey_passport_events_type_created_idx
  on public.journey_passport_events (event_type, created_at desc);

alter table public.journey_passport_leads enable row level security;
alter table public.journey_passport_events enable row level security;

revoke all on table public.journey_passport_leads from anon, authenticated;
revoke all on table public.journey_passport_events from anon, authenticated;
grant select, insert, update on table public.journey_passport_leads to service_role;
grant select, insert, update on table public.journey_passport_events to service_role;

create or replace function public.claim_journey_passport_notification(
  p_passport_reference text,
  p_claim_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.journey_passport_leads
  set notification_status = 'pending',
      notification_attempted_at = now(),
      notification_error_code = null,
      notification_claim_token = p_claim_token,
      updated_at = now()
  where passport_reference = p_passport_reference
    and (
      (notification_status = 'pending' and notification_claim_token is null)
      or (notification_status = 'pending' and notification_attempted_at < now() - interval '10 minutes')
      or notification_status in ('failed', 'not-configured')
    );

  return found;
end;
$$;

revoke all on function public.claim_journey_passport_notification(text, uuid) from public, anon, authenticated;
grant execute on function public.claim_journey_passport_notification(text, uuid) to service_role;

comment on table public.journey_passport_leads is
  'Server-managed Journey Passport leads. Public Data API access is intentionally denied.';
comment on table public.journey_passport_events is
  'PII-minimised operational timeline for Journey Passport lead activity.';
