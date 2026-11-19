-- 20261119000000_journey_passport_otp_rate_limiting.rollback.sql
--
-- Rollback for 20261119000000_journey_passport_otp_rate_limiting.sql.
-- Restores `send_journey_passport_otp` and `consume_journey_passport_otp_token`
-- to their pre-Milestone-1 baseline (20260826120000 and 20260822090000).

-- 1. Restore send_journey_passport_otp ----------------------------------------

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
    returning id, journey_passport_otp_challenges.resend_count into v_challenge_id, v_resend_count;

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
  returning id, journey_passport_otp_challenges.resend_count into v_challenge_id, v_resend_count;

  return query select v_challenge_id, v_resend_count, 'sent'::text;
end;
$$;

-- 2. Restore consume_journey_passport_otp_token -------------------------------

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

-- 3. Cleanup Schema Extensions ------------------------------------------------

drop index if exists public.journey_passport_otp_challenges_reference_idx;

alter table public.journey_passport_otp_challenges
  drop column if exists passport_reference;
