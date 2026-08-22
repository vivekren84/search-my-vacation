-- EBC-R1.2-WS5-03: Journey Passport OTP verification.
-- Mirrors the existing journey_passport_leads / claim_journey_passport_notification
-- pattern exactly (bespoke table + SECURITY DEFINER RPCs, no Supabase Auth), per
-- EBC-R1.2-WS5-01 §4. This migration is additive: it does not drop or replace
-- existing objects.

create table if not exists public.journey_passport_otp_challenges (
  id uuid primary key default gen_random_uuid(),
  mobile_number text not null
    check (mobile_number ~ '^\+[1-9][0-9]{7,18}$'),
  otp_hash text not null check (char_length(otp_hash) >= 32),
  attempt_count int not null default 0 check (attempt_count >= 0),
  resend_count int not null default 0 check (resend_count >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'expired', 'exhausted')),
  expires_at timestamptz not null,
  next_resend_at timestamptz not null,
  verification_token uuid,
  verification_token_consumed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journey_passport_otp_challenges_mobile_idx
  on public.journey_passport_otp_challenges (mobile_number, created_at desc);

create unique index if not exists journey_passport_otp_challenges_token_idx
  on public.journey_passport_otp_challenges (verification_token)
  where verification_token is not null;

alter table public.journey_passport_otp_challenges enable row level security;
revoke all on table public.journey_passport_otp_challenges from anon, authenticated;
grant select, insert, update on table public.journey_passport_otp_challenges to service_role;

-- Sends a fresh OTP, or treats the call as a resend of the mobile number's
-- current pending challenge (WS5-01 §4.6): checks next_resend_at cooldown and
-- the configured max-resend cap atomically via a row lock (SELECT ... FOR
-- UPDATE), then either inserts a new row or overwrites the existing one so
-- the previous code can never verify successfully afterward.
create or replace function public.send_journey_passport_otp(
  p_mobile_number text,
  p_otp_hash text,
  p_expiry_seconds int,
  p_resend_delay_seconds int,
  p_max_resends int
)
returns table (
  challenge_id uuid,
  resend_count int,
  outcome text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.journey_passport_otp_challenges%rowtype;
  v_challenge_id uuid;
  v_resend_count int;
begin
  if p_mobile_number is null or p_mobile_number !~ '^\+[1-9][0-9]{7,18}$'
     or p_otp_hash is null or char_length(p_otp_hash) < 32
     or p_expiry_seconds is null or p_expiry_seconds < 30 or p_expiry_seconds > 3600
     or p_resend_delay_seconds is null or p_resend_delay_seconds < 0 or p_resend_delay_seconds > 3600
     or p_max_resends is null or p_max_resends < 0 or p_max_resends > 10 then
    return query select null::uuid, null::int, 'invalid_request'::text;
    return;
  end if;

  select * into v_existing
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number and status = 'pending'
  order by created_at desc
  limit 1
  for update;

  if v_existing.id is null then
    insert into public.journey_passport_otp_challenges (
      mobile_number, otp_hash, attempt_count, resend_count, status, expires_at, next_resend_at
    ) values (
      p_mobile_number, p_otp_hash, 0, 0, 'pending',
      now() + make_interval(secs => p_expiry_seconds),
      now() + make_interval(secs => p_resend_delay_seconds)
    )
    returning id, resend_count into v_challenge_id, v_resend_count;

    return query select v_challenge_id, v_resend_count, 'sent'::text;
    return;
  end if;

  if v_existing.next_resend_at > now() then
    return query select v_existing.id, v_existing.resend_count, 'resend_too_soon'::text;
    return;
  end if;

  if v_existing.resend_count >= p_max_resends then
    return query select v_existing.id, v_existing.resend_count, 'resend_limit_exceeded'::text;
    return;
  end if;

  update public.journey_passport_otp_challenges
  set otp_hash = p_otp_hash,
      attempt_count = 0,
      resend_count = v_existing.resend_count + 1,
      expires_at = now() + make_interval(secs => p_expiry_seconds),
      next_resend_at = now() + make_interval(secs => p_resend_delay_seconds),
      updated_at = now()
  where id = v_existing.id
  returning id, resend_count into v_challenge_id, v_resend_count;

  return query select v_challenge_id, v_resend_count, 'sent'::text;
end;
$$;

revoke all on function public.send_journey_passport_otp(text, text, int, int, int) from public, anon, authenticated;
grant execute on function public.send_journey_passport_otp(text, text, int, int, int) to service_role;

-- Atomically checks a submitted code against the challenge row: locks the row
-- (SELECT ... FOR UPDATE) so two concurrent verify attempts cannot both
-- succeed or corrupt the attempt counter (WS5-01 §4.5/§6), expires the
-- challenge if past expires_at, exhausts it once p_max_attempts wrong
-- guesses accumulate, and issues a single-use verification_token on success.
create or replace function public.verify_journey_passport_otp(
  p_mobile_number text,
  p_challenge_id uuid,
  p_otp_hash text,
  p_max_attempts int
)
returns table (
  outcome text,
  verification_token uuid,
  attempts_remaining int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.journey_passport_otp_challenges%rowtype;
  v_new_attempt_count int;
  v_token uuid;
begin
  if p_mobile_number is null or p_challenge_id is null or p_otp_hash is null
     or p_max_attempts is null or p_max_attempts < 1 then
    return query select 'not_found'::text, null::uuid, null::int;
    return;
  end if;

  select * into v_row
  from public.journey_passport_otp_challenges
  where id = p_challenge_id and mobile_number = p_mobile_number
  for update;

  if v_row.id is null then
    return query select 'not_found'::text, null::uuid, null::int;
    return;
  end if;

  if v_row.status = 'verified' then
    return query select 'verified'::text, v_row.verification_token, greatest(p_max_attempts - v_row.attempt_count, 0);
    return;
  end if;

  if v_row.status = 'exhausted' then
    return query select 'exhausted'::text, null::uuid, 0;
    return;
  end if;

  if v_row.status = 'expired' or (v_row.status = 'pending' and v_row.expires_at <= now()) then
    update public.journey_passport_otp_challenges
    set status = 'expired', updated_at = now()
    where id = v_row.id;
    return query select 'expired'::text, null::uuid, 0;
    return;
  end if;

  if v_row.otp_hash = p_otp_hash then
    update public.journey_passport_otp_challenges
    set status = 'verified',
        verification_token = gen_random_uuid(),
        verification_token_consumed_at = null,
        updated_at = now()
    where id = v_row.id
    returning verification_token into v_token;

    return query select 'verified'::text, v_token, greatest(p_max_attempts - v_row.attempt_count, 0);
    return;
  end if;

  v_new_attempt_count := v_row.attempt_count + 1;
  if v_new_attempt_count >= p_max_attempts then
    update public.journey_passport_otp_challenges
    set attempt_count = v_new_attempt_count, status = 'exhausted', updated_at = now()
    where id = v_row.id;
    return query select 'exhausted'::text, null::uuid, 0;
    return;
  end if;

  update public.journey_passport_otp_challenges
  set attempt_count = v_new_attempt_count, updated_at = now()
  where id = v_row.id;
  return query select 'incorrect'::text, null::uuid, (p_max_attempts - v_new_attempt_count);
end;
$$;

revoke all on function public.verify_journey_passport_otp(text, uuid, text, int) from public, anon, authenticated;
grant execute on function public.verify_journey_passport_otp(text, uuid, text, int) to service_role;

-- Consumed exactly once by the /leads route inside the same request that
-- creates the lead row, so a captured token cannot be replayed against a
-- second submission (WS5-01 §6).
create or replace function public.consume_journey_passport_otp_token(
  p_mobile_number text,
  p_verification_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_mobile_number is null or p_verification_token is null then
    return false;
  end if;

  update public.journey_passport_otp_challenges
  set verification_token_consumed_at = now(),
      updated_at = now()
  where mobile_number = p_mobile_number
    and verification_token = p_verification_token
    and status = 'verified'
    and verification_token_consumed_at is null;

  return found;
end;
$$;

revoke all on function public.consume_journey_passport_otp_token(text, uuid) from public, anon, authenticated;
grant execute on function public.consume_journey_passport_otp_token(text, uuid) to service_role;

comment on table public.journey_passport_otp_challenges is
  'Server-managed Journey Passport OTP challenges (DEC-R1.2-006). Public Data API access is intentionally denied. The OTP code itself is never stored in plaintext.';
