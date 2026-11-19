-- 20261119000000_journey_passport_otp_rate_limiting.sql
--
-- Release 1.3 Milestone 1: OTP Rate Limiting, Abuse Hardening & Idempotent Lead Recovery
-- Backlog Items: TD-07 (Persistent OTP limits & resend caps), TD-09 (Abuse protection),
--                UX-01 (Idempotent lead recovery), UX-03 (Lost challenge recovery)
-- Design & Architecture: docs/09-Development/EBC-R1.3-WS1-001-OTP-Hardening-Architecture.md
-- Rollback: supabase/rollbacks/20261119000000_journey_passport_otp_rate_limiting.rollback.sql
--
-- 1. Adds optional `passport_reference` column to public.journey_passport_otp_challenges
--    to support idempotent lead creation retry without token exhaustion.
-- 2. Updates `send_journey_passport_otp` to enforce database-backed, mobile-keyed rate limits:
--    - Rolling 1-hour cap: max 5 OTP requests per mobile number.
--    - Rolling 24-hour cap: max 10 OTP requests per mobile number.
--    - Terminal state cooldown: mandatory 15-minute lockout if the latest challenge is 'exhausted'.
--    - Challenge ID return on 'resend_too_soon': enables client recovery when response was lost (UX-03).
-- 3. Updates `consume_journey_passport_otp_token` with an idempotent 10-minute retry window
--    keyed on the same passport_reference, eliminating post-OTP lead persistence dead-ends (UX-01).

-- 1. Schema Extensions --------------------------------------------------------

alter table public.journey_passport_otp_challenges
  add column if not exists passport_reference text;

create index if not exists journey_passport_otp_challenges_mobile_idx
  on public.journey_passport_otp_challenges (mobile_number, created_at desc);

create index if not exists journey_passport_otp_challenges_reference_idx
  on public.journey_passport_otp_challenges (passport_reference)
  where passport_reference is not null;

-- 2. send_journey_passport_otp Function ---------------------------------------

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
  v_last_challenge public.journey_passport_otp_challenges%rowtype;
  v_hourly_count int;
  v_daily_count int;
  v_challenge_id uuid;
  v_resend_count int;
begin
  -- 1. Parameter Validation
  if p_mobile_number is null or p_mobile_number !~ '^\+[1-9][0-9]{7,18}$'
     or p_otp_hash is null or char_length(p_otp_hash) < 32
     or p_expiry_seconds is null or p_expiry_seconds < 30 or p_expiry_seconds > 3600
     or p_resend_delay_seconds is null or p_resend_delay_seconds < 0 or p_resend_delay_seconds > 3600
     or p_max_resends is null or p_max_resends < 0 or p_max_resends > 10 then
    return query select null::uuid, null::int, 'invalid_request'::text;
    return;
  end if;

  -- 2. Check Exhaustion Cooldown Lockout (15 minutes)
  select * into v_last_challenge
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number
  order by created_at desc
  limit 1;

  if v_last_challenge.id is not null
     and v_last_challenge.status = 'exhausted'
     and v_last_challenge.updated_at > (now() - interval '15 minutes') then
    return query select v_last_challenge.id, v_last_challenge.resend_count, 'cooldown_lockout'::text;
    return;
  end if;

  -- 3. Check Rolling 1-Hour Cap (Max 5 attempts across all states)
  select count(*) into v_hourly_count
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number
    and created_at >= (now() - interval '1 hour');

  if v_hourly_count >= 5 then
    return query select null::uuid, null::int, 'rate_limit_exceeded'::text;
    return;
  end if;

  -- 4. Check Rolling 24-Hour Cap (Max 10 attempts across all states)
  select count(*) into v_daily_count
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number
    and created_at >= (now() - interval '24 hours');

  if v_daily_count >= 10 then
    return query select null::uuid, null::int, 'rate_limit_exceeded'::text;
    return;
  end if;

  -- 5. Lock on current pending challenge (if any)
  select * into v_existing
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number and status = 'pending'
  order by created_at desc
  limit 1
  for update;

  -- 6. Expire stale pending challenge if its window passed
  if v_existing.id is not null and v_existing.expires_at <= now() then
    update public.journey_passport_otp_challenges
    set status = 'expired', updated_at = now()
    where id = v_existing.id;

    v_existing := null;
  end if;

  -- 7. Insert fresh challenge if no active pending challenge exists
  if v_existing.id is null then
    insert into public.journey_passport_otp_challenges (
      mobile_number, otp_hash, attempt_count, resend_count, status, expires_at, next_resend_at
    ) values (
      p_mobile_number, p_otp_hash, 0, 0, 'pending',
      now() + make_interval(secs => p_expiry_seconds),
      now() + make_interval(secs => p_resend_delay_seconds)
    )
    returning id, journey_passport_otp_challenges.resend_count into v_challenge_id, v_resend_count;

    return query select v_challenge_id, v_resend_count, 'sent'::text;
    return;
  end if;

  -- 8. Existing pending challenge cooldown check (UX-03 recovery returns challenge ID)
  if v_existing.next_resend_at > now() then
    return query select v_existing.id, v_existing.resend_count, 'resend_too_soon'::text;
    return;
  end if;

  -- 9. Existing pending challenge resend cap check
  if v_existing.resend_count >= p_max_resends then
    return query select v_existing.id, v_existing.resend_count, 'resend_limit_exceeded'::text;
    return;
  end if;

  -- 10. Update existing pending challenge with fresh OTP hash
  update public.journey_passport_otp_challenges
  set otp_hash = p_otp_hash,
      attempt_count = 0,
      resend_count = v_existing.resend_count + 1,
      expires_at = now() + make_interval(secs => p_expiry_seconds),
      next_resend_at = now() + make_interval(secs => p_resend_delay_seconds),
      updated_at = now()
  where id = v_existing.id
  returning id, journey_passport_otp_challenges.resend_count into v_challenge_id, v_resend_count;

  return query select v_challenge_id, v_resend_count, 'sent'::text;
end;
$$;

revoke all on function public.send_journey_passport_otp(text, text, int, int, int) from public, anon, authenticated;
grant execute on function public.send_journey_passport_otp(text, text, int, int, int) to service_role;

-- 3. consume_journey_passport_otp_token with Idempotent Recovery Window ---------

create or replace function public.consume_journey_passport_otp_token(
  p_mobile_number text,
  p_verification_token uuid,
  p_passport_reference text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_challenge public.journey_passport_otp_challenges%rowtype;
begin
  if p_mobile_number is null or p_verification_token is null then
    return false;
  end if;

  select * into v_challenge
  from public.journey_passport_otp_challenges
  where mobile_number = p_mobile_number
    and verification_token = p_verification_token
    and status = 'verified'
  for update;

  if v_challenge.id is null then
    return false;
  end if;

  -- First-time consumption: mark consumed and bind passport reference
  if v_challenge.verification_token_consumed_at is null then
    update public.journey_passport_otp_challenges
    set verification_token_consumed_at = now(),
        passport_reference = coalesce(p_passport_reference, v_challenge.passport_reference),
        updated_at = now()
    where id = v_challenge.id;
    return true;
  end if;

  -- Idempotent retry: allow same passport reference to retry within 10 minutes of initial consumption
  if p_passport_reference is not null
     and v_challenge.passport_reference = p_passport_reference
     and v_challenge.verification_token_consumed_at > (now() - interval '10 minutes') then
    return true;
  end if;

  -- Otherwise reject token replay
  return false;
end;
$$;

revoke all on function public.consume_journey_passport_otp_token(text, uuid, text) from public, anon, authenticated;
grant execute on function public.consume_journey_passport_otp_token(text, uuid, text) to service_role;
