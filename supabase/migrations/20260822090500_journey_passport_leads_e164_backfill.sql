-- EBC-R1.2-WS5-03: adds a dedicated E.164 phone number column to
-- journey_passport_leads for OTP verification / SMS delivery and future
-- international-phone use (dual-field strategy).
--
-- This migration supersedes an earlier draft (same filename/timestamp, never
-- applied to any environment) that instead rewrote mobile_number/
-- mobile_normalized in place to E.164. That approach was reviewed and
-- rejected during implementation: it silently breaks the existing, approved
-- Callback Request feature, whose claim_journey_passport_callback RPC
-- (supabase/migrations/20260803120000_journey_passport_callbacks.sql) does a
-- strict equality match on mobile_normalized against a bare, non-E.164
-- traveller-entered value. Reproduced empirically via
-- `npm run verify:journey-leads`, which failed with
-- JourneyCallbackProcessingError("lead_not_found") once mobile_normalized
-- carried a country code.
--
-- Product Owner-approved resolution (dual-field strategy): mobile_number and
-- mobile_normalized keep their original bare-national-number format and
-- contract UNCHANGED — the existing Callback flow and RPC behaviour remain
-- functionally identical. A new, independent mobile_e164 column carries the
-- E.164 form for Journey Passport OTP verification / SMS delivery, and is
-- intended for progressive adoption by future features. This migration is
-- purely additive: it does not alter, backfill, or drop any existing column.
-- Historical rows are intentionally left with mobile_e164 = null; a backfill
-- of historical rows (deriving +91 + mobile_normalized) is a separate,
-- explicit follow-up decision for Tiger/Arjun, not executed here, since it
-- is a one-way transformation over live records (Project Instructions §18).

alter table public.journey_passport_leads
  add column if not exists mobile_e164 text
    check (mobile_e164 is null or mobile_e164 ~ '^\+[1-9][0-9]{7,18}$');

comment on column public.journey_passport_leads.mobile_e164 is
  'E.164-formatted mobile number captured at Journey Passport OTP verification time (EBC-R1.2-WS5-03). Independent of mobile_number/mobile_normalized, which retain their original bare-national-number format for Callback RPC backward compatibility. Null for historical rows pending a separate backfill decision.';
