-- EBC-R1.2-WS5-IMP-02-RAD: Fix PostgreSQL error 42702 ("column reference
-- \"resend_count\" is ambiguous") in send_journey_passport_otp.
--
-- Root cause: this function's RETURNS TABLE(challenge_id uuid, resend_count
-- int, outcome text) implicitly declares `resend_count` as a PL/pgSQL output
-- variable in the function's own namespace. journey_passport_otp_challenges
-- (original migration: 20260822090000_journey_passport_otp_challenges.sql)
-- also has a real column named `resend_count`. PL/pgSQL's default
-- #variable_conflict behaviour is `error`, so any bare, unqualified
-- `resend_count` inside an embedded SQL command that could resolve to either
-- the variable or the column raises 42702. This affects exactly two
-- statements in the original function body -- both `RETURNING ... INTO`
-- clauses (the INSERT path for a brand-new challenge, and the UPDATE path
-- for a resend) -- every other reference to `resend_count` in the function
-- is already unambiguous (either the left-hand side of an UPDATE SET, which
-- Postgres always resolves to the table column, or explicitly qualified via
-- the `v_existing` record variable).
--
-- Fix: fully qualify the two ambiguous RETURNING-clause references with the
-- table name (`journey_passport_otp_challenges.resend_count`). This is a
-- pure syntax disambiguation -- no business behaviour, resend limit, timing,
-- or return-value shape changes. The function's signature, RETURNS TABLE
-- column names/order, and every other statement are byte-for-byte identical
-- to the original migration; only the two RETURNING-clause lines changed.

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

revoke all on function public.send_journey_passport_otp(text, text, int, int, int) from public, anon, authenticated;
grant execute on function public.send_journey_passport_otp(text, text, int, int, int) to service_role;
