-- EBC-R1.2-WS5-IMP-03-RAD: Fix PostgreSQL error 42702 ("column reference
-- \"verification_token\" is ambiguous") in verify_journey_passport_otp.
--
-- Root cause: this function's RETURNS TABLE(outcome text, verification_token
-- uuid, attempts_remaining int) implicitly declares `verification_token` as a
-- PL/pgSQL output variable in the function's own namespace.
-- journey_passport_otp_challenges (original migration:
-- 20260822090000_journey_passport_otp_challenges.sql) also has a real column
-- named `verification_token`. PL/pgSQL's default #variable_conflict = error
-- behaviour means any bare, unqualified `verification_token` inside an
-- embedded SQL command that could resolve to either the variable or the
-- column raises 42702. This is the exact same bug class already fixed once
-- in send_journey_passport_otp (20260826120000_...), in a sibling function.
--
-- This affects exactly one statement in the original function body: the
-- `RETURNING verification_token INTO v_token` clause in the success
-- ("otp_hash matches") branch. Every other reference to `verification_token`
-- in the function is already unambiguous: `v_row.verification_token` is
-- qualified via the record variable, and `verification_token =
-- gen_random_uuid()` is the left-hand side of an UPDATE SET target, which
-- Postgres always resolves to the table column. This matches the reported
-- runtime evidence exactly: every other branch (not_found, exhausted,
-- expired, incorrect) has no RETURNING clause and works; only the one
-- success path that verifies a correct OTP hits this error.
--
-- Fix: fully qualify the ambiguous RETURNING-clause reference with the table
-- name (`journey_passport_otp_challenges.verification_token`). This is a
-- pure syntax disambiguation -- no business behaviour, attempt-count,
-- expiry, or return-value shape changes. The function's signature, RETURNS
-- TABLE column names/order, and every other statement are byte-for-byte
-- identical to the original migration; only the single line corresponding to
-- the original migration's line 184 changed.

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
    returning journey_passport_otp_challenges.verification_token into v_token;

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
