# EBC-R1.2-WS5-03 — Journey Passport OTP Verification: Consolidated Implementation Brief

```text
Document Type : Implementation Brief (Tiger consolidation — no new architecture, UX or
                product decisions)
EBC ID        : EBC-R1.2-WS5-03
Persona       : Rad — Engineering and Implementation Specialist (recipient/executor)
Prepared By   : Tiger — Programme and Delivery Lead
Workstream    : WS5 — International Phone Number & OTP Verification
Tracker Tasks : R1.2-05.21 through R1.2-05.30 (primary); consolidates the Archie/Rad share of
                R1.2-05.15 and R1.2-05.17 (E.164 storage/normalisation, a build prerequisite)
Source Docs   : EBC-R1.2-WS5-01 (Archie — Architecture, Approved 22-Aug-2026)
                EBC-R1.2-WS5-02 (Sophie — UX Review, Approved 22-Aug-2026)
Reviewer      : Tiger | Business Owner: Vivek
Status        : Approved — Implementation Brief (consolidation only)
Approved By   : Product Owner — Vivek; Delivery Lead — Tiger
Approval Date : 22 Aug 2026
Implementation: This document consolidates already-approved architecture (WS5-01) and UX
                (WS5-02) guidance into one actionable brief for Rad. The three Product Owner
                decisions this brief originally gated on are now Approved — `DEC-R1.2-016`
                (SMS provider: MSG91), `DEC-R1.2-017` (`libphonenumber-js`), and
                `DEC-R1.2-018` (legacy `+91` phone backfill) — recorded in the Release 1.2
                Decision Log (Section 3 below). This document remains a governance/
                consolidation artefact: it does not itself replace Rad's own EBC execution
                kickoff, engineering validation (Project Instructions §28), or Keerthi's
                independent functional validation (§29).
```

---

## 0. Purpose and Provenance

This document performs the Team Satvi Stage 5 consolidation (Project Instructions §12): it merges Archie's approved architecture review (`EBC-R1.2-WS5-01`) and Sophie's approved UX review (`EBC-R1.2-WS5-02`) into a single, sequenced implementation brief for Rad. It introduces **no new technical, UX, or product decisions** — every requirement below cites the specific source section it is drawn from. Where WS5-01 or WS5-02 left an implementation-time judgement call to Rad (explicitly marked as such in those documents), that is carried forward here unchanged, not resolved.

This brief does not replace WS5-01 or WS5-02. Rad should read both in full before implementation; this document is the sequencing and traceability layer on top of them, not a substitute for their detail.

---

## 1. Scope

In scope for this brief: R1.2-05.15 and 05.17 (E.164 phone storage/normalisation, insofar as OTP delivery depends on it), R1.2-05.18–05.30 (OTP send, verify, expiry, resend, invalid-code handling, mobile masking, phone-change invalidation, submission guardrail, abuse protection). Out of scope: R1.2-05.01–05.14 (country selector, calling-code UI, non-OTP phone capture work — a separate, largely independent Workstream 5 track); R1.2-05.31–05.35 (Keerthi's QA/regression/smoke-test tasks — functional validation follows implementation, per Project Instructions §29, and is not part of this Rad brief); any OTP expansion beyond Journey Passport (explicitly out of scope per `DEC-R1.2-006` and `OPEN-R1.2-006`).

---

## 2. What Is Already Decided (do not re-litigate)

Per `DEC-R1.2-002`, `DEC-R1.2-006`, and WS5-01/WS5-02 in full: Journey Passport submissions require successful mobile OTP verification before final submission; phone numbers move to E.164 storage with India default; OTP is scoped to Journey Passport only (not Contact, Callback Request, or Plan My Experience); OTP is a lead-quality control, not an authentication/login/account feature; verification happens inside the existing closure screen, not a redirect or dialog; the Passport Stamp must fire only after successful, verified submission — never before; no Supabase Auth is introduced; the bespoke OTP table + RPC approach (mirroring the existing lead/callback pattern) is the approved architecture, not Supabase Auth's phone-OTP or Twilio Verify.

---

## 3. Product Owner Decisions — Resolved

Per WS5-01 §18, three items were recommended by Archie but not yet approved when this brief was first issued. The Product Owner has since approved all three, recorded in the Release 1.2 Decision Log (`docs/10-Backlog/RELEASE-1.2.md`, Section 7):

| # | Decision | Recommendation (WS5-01) | Ratified as | Build status |
|---|---|---|---|---|
| 1 | SMS provider selection and commercial engagement | MSG91 primary; Twilio held as future fallback (WS5-01 §4.3) | `DEC-R1.2-016` — MSG91 approved, with the implementation constraint that the provider be abstracted behind an internal service interface | Unblocked — Rad may write and enable the outbound SMS `fetch` call behind the required interface. India DLT template registration should begin immediately given its multi-day lead time (WS5-01 §11) — this is an operational action for Vivek/Tiger, not something that waits for Rad to reach this build step |
| 2 | New dependency: `libphonenumber-js` | Approve (WS5-01 §3) | `DEC-R1.2-017` — approved as the standard international phone validation library | Unblocked — the dependency may be added to `web/package.json`; the E.164 validation change to `journey-leads/validation.ts` and the country-selector data source (Section 4, step 4) may proceed |
| 3 | Legacy phone-record backfill to `+91` | Approve the mechanical prefix backfill for existing `journey_passport_leads` rows (WS5-01 §3) | `DEC-R1.2-018` — approved, with explicit migration requirements: existing `+`-prefixed values remain unchanged; the migration must be idempotent; new Journey Passport submissions must always use international format | Unblocked, but still sequenced — execute only as part of Rad's E.164 migration work (R1.2-05.15, Section 4 step 4), not run ahead of or independent of that implementation step |

None of Sections 4–9 below required a substantive change as a result — WS5-01 §16 already noted the shape of the solution is stable regardless of how these three decisions resolved, and that remains true now that they have.

---

## 4. Implementation Sequence

Execution order, per WS5-01 §14 (Rad's own component-impact table is WS5-01 §9 — treat that as the authoritative file-level list; this section is the order to work through it):

1. **Supabase migration** — `journey_passport_otp_challenges` table plus `send_journey_passport_otp` and `verify_journey_passport_otp` `SECURITY DEFINER` RPC functions (WS5-01 §4.4–4.6). Additive only, matching the existing migration convention ("does not drop or replace existing objects"). RLS enabled; `anon`/`authenticated` revoked; `service_role` granted only — identical posture to `journey_passport_leads` (WS5-01 §2.7, §4.4). Nothing downstream can be built or tested against real data without this step.
2. **`journey-passport-otp` library module** — validation → repository → service, in that order, mirroring `journey-leads`'s existing four-layer shape exactly (WS5-01 §9, §13). Repository layer must use plain `fetch` to the REST/RPC endpoints, matching `journey-leads/repository.ts` — no `@supabase/supabase-js` dependency is to be introduced.
3. **Two new API routes** — `POST /api/journey-passport/otp/send`, `POST /api/journey-passport/otp/verify` — same three-layer shape as `leads/route.ts` (rate-limit → strict parse → service; WS5-01 §2.2, §9).
4. **E.164 validation and shared-type updates** — extend `journey-leads/validation.ts` from `/^\d{10}$/` to E.164-aware validation using `libphonenumber-js`; update `JourneyLeadSubmission`/`parseJourneyLeadSubmission` to add the required `verification_token` field; update `mobile` field semantics in `JourneyPassportState`/`JourneyPassportSnapshot` (WS5-01 §9). Depends on `DEC-R1.2-017` (Section 3, item 2 — now Approved); may proceed in parallel with step 2/3.
5. **Closure-screen UI and state-machine change** — `JourneyPassport.tsx`, per WS5-02 §3/§8 in full: OTP as a second internal stage of the existing closure `<form>`, not a new dialog or modal (WS5-02 §3.1); single `<input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}>`, not a segmented six-box input (WS5-02 §2, §6, §8.2); reuse existing input styling, `role="alert"`/`role="status"` split, and `headingRef.current?.focus()` convention verbatim (WS5-02 §8.3–8.5); `journey-passport-reveal` transition class for entry (WS5-02 §8.6); masked-number display format `+91 98765 ••210` as a small pure display-formatting helper (WS5-02 §2, §8.8); ghost-button treatment for "Change number" and "Resend code" (WS5-02 §8.7). **This step also carries the mandatory Passport Stamp resequencing — see Section 6 below.** Build and review this step last, once the API surface from steps 1–4 is stable (WS5-01 §14), and give it its own explicit Sophie UX pass given the resequencing risk (WS5-01 §11, WS5-02 §8.9).

---

## 5. Configuration

Per WS5-01 §5, add a single new config module `web/config/journey-passport-otp.config.ts` (never scatter `process.env` reads across files, unlike the current lead-notification code's pattern). Values, read once at module load, validated and defaulted, never re-read mid-request:

| Concern | Variable | Default | Consumed by |
|---|---|---|---|
| OTP expiry duration | `JOURNEY_PASSPORT_OTP_EXPIRY_SECONDS` | 300 | `verify_journey_passport_otp` RPC call site |
| Resend delay | `JOURNEY_PASSPORT_OTP_RESEND_DELAY_SECONDS` | 30 | `send_journey_passport_otp` RPC call site |
| Maximum resends | `JOURNEY_PASSPORT_OTP_MAX_RESENDS` | 2 (must match the approved decision) | Resend route |
| Maximum verify attempts | `JOURNEY_PASSPORT_OTP_MAX_VERIFY_ATTEMPTS` | 5 | Verify RPC call site |
| Rate limit window / max | `JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS` / `JOURNEY_PASSPORT_OTP_RATE_LIMIT_MAX` | 600 / 5 | New OTP-specific rate limiter |
| Provider request timeout | `JOURNEY_PASSPORT_OTP_PROVIDER_TIMEOUT_MS` | 7000 | SMS send call |
| SMS provider credentials | `SMS_PROVIDER_API_KEY`, `SMS_PROVIDER_SENDER_ID` | — required; fails closed if absent | SMS send call |

Add every variable name (not value) to `.env.example`; actual values are set in Vercel project settings by whoever holds them, per Project Instructions §25 — Rad does not fabricate or request secret values through this brief.

---

## 6. Passport Stamp Resequencing — Hard Prerequisite, Not Optional Polish

Both source documents independently flag this at high severity (WS5-01 §1, §8, §11; WS5-02 §1, §8.9): today, `JourneyPassport.tsx`'s `closureStage` sequences `closing → stamping → contact → departing` — the Stamp fires **before** the traveller even enters their phone number, directly contradicting the already-approved decision "Passport Stamp only after successful submission." This must become, in effect, `closing → contact-and-verify → stamping → departing`, with the Stamp firing only after `submitJourneyPassportLead` succeeds with a valid, verified token. This is not a new architectural component but is a real, non-trivial reordering of an already-shipped animation. It is a required part of this EBC's "done," not deferrable to a later pass (WS5-02 §8.9).

---

## 7. Security and Abuse Protection (non-negotiable, WS5-01 §6)

Server-generated OTP only (`crypto.randomInt`, never `Math.random()`), 6 digits, zero-padded; stored as a salted hash, never plaintext; every state transition (send, verify, resend) implemented as an atomic `SECURITY DEFINER` RPC with a single conditional `UPDATE ... WHERE ... RETURNING`, matching `claim_journey_passport_notification`'s exact shape, so concurrent/duplicate requests cannot double-count attempts or double-issue a token; single-use `verification_token`, never persisted to `sessionStorage`, consumed exactly once by the `/leads` route; OTP-specific rate limiting enforced at the database layer (durable, cross-instance-safe counters), not the existing in-memory `Map`-based limiter alone, since OTP abuse costs SMV real money per SMS (WS5-01 §6.5); logging masks the mobile number and never logs the code itself, extending the existing `maskPassportReference` convention.

---

## 8. Acceptance and Definition of Done

This EBC's implementation is complete only when, per Project Instructions §28 and the Release 1.2 Workstream 5 acceptance criteria:

Journey Passport cannot be submitted without a successful OTP verification (R1.2-05.29); OTP verification applies only to Journey Passport, with Callback Request/Contact/Plan My Experience unchanged; expiry, resend (max 2, cooldown), and invalid-code (max 5 attempts) handling all behave per WS5-01 §4.5–4.6 and §7; changing the phone number mid-flow invalidates any in-progress or completed verification (R1.2-05.28, WS5-01 §7); the mobile number is masked on the verification screen per WS5-02 §2/§4; the Passport Stamp resequencing (Section 6 above) is implemented, not deferred; all seven configuration values (Section 5) are environment-variable-driven with no hardcoded operational constant; lint, TypeScript, and production build all pass (Project Instructions §28); the rollback approach (Section 9 below) is in place before this ships. Functional validation of all of the above is Keerthi's responsibility under R1.2-05.31–05.35, not Rad's self-certification, per Project Instructions §28's own distinction between Rad's technical completion and Keerthi's functional approval.

---

## 9. Rollback Plan (WS5-01 §15)

The new table and RPC functions are additive and can remain in place even if OTP is later disabled without affecting any other feature. The actual feature toggle point is the `/leads` route's requirement for a `verification_token`: if OTP needs to be disabled quickly post-launch, the token check should be isolated enough (a single guarded block, not threaded through the whole validation function) to be feature-flagged off via an environment variable without a redeploy of unrelated logic. Rad and Archie must agree at build time whether an unconfigured SMS provider should fail-open (bypass the requirement, risking silently defeating `DEC-R1.2-006`) or fail-closed (block all submissions) — WS5-01 flags this explicitly as unresolved and it is not decided by this brief.

---

## 10. Explicitly Out of Scope

Per Project Instructions §20/§24 and the Release 1.2 tracker: CAPTCHA, email verification, login/account creation, any additional traveller information capture, budget capture, OTP for any form other than Journey Passport (`OPEN-R1.2-006` remains Deferred), and any broader identity/authentication system. None of the above should be introduced as a byproduct of this implementation.

---

## 11. Traceability

| This brief | Source | Release 1.2 Tracker |
|---|---|---|
| §4.1 (migration) | WS5-01 §4.4–4.6, §9 | R1.2-05.18, 05.19, 05.30 |
| §4.2–4.3 (library + routes) | WS5-01 §9, §13, §14 | R1.2-05.21, 05.23 |
| §4.4 (E.164 validation) | WS5-01 §3, §9 | R1.2-05.15, 05.17 |
| §4.5 (closure-screen UI) | WS5-02 §3, §8 | R1.2-05.22, 05.24–05.27 |
| §6 (Stamp resequencing) | WS5-01 §8, §11; WS5-02 §1, §8.9 | R1.2-05.29 (implementation dependency, not a separate tracker line) |
| §7 (security) | WS5-01 §6 | R1.2-05.30 |
| §5 (configuration) | WS5-01 §5 | — (cross-cutting) |

---

## 12. Governance Statement

This brief is a consolidation document. It does not itself approve a product decision, alter architecture, or change UX direction beyond what WS5-01 and WS5-02 already record as approved, or what the Release 1.2 Decision Log separately records under `DEC-R1.2-016`, `DEC-R1.2-017`, and `DEC-R1.2-018` (Section 3 above). One item remains genuinely open and is outside this document's scope to resolve: the draft traveller-facing copy in WS5-02 §4 still requires separate Arjun/Vivek copy approval before production use (WS5-02's own Approval Note). No implementation branch has been created and no code, configuration, database, or dependency change has been made as part of producing or updating this document.


---

## 13. Implementation Amendments (recorded post-approval, per Project Instructions §32)

Two implementation-time findings surfaced after this brief and WS5-01/02 were approved. Both were reported and resolved through the Product Owner before being implemented — neither was decided unilaterally by Rad.

### 13.1 Dual-field mobile number strategy (supersedes the Section 3 `mobile_normalized` approach)

Implementing WS5-01 §3's E.164 migration by rewriting `journey_passport_leads.mobile_number`/`mobile_normalized` in place (the approach this brief and WS5-01 originally described) was found, empirically via `npm run verify:journey-leads`, to silently break the existing, already-shipped Callback Request feature (EBC-013): `claim_journey_passport_callback`'s strict equality match against `mobile_normalized` fails once that column carries a country code, because the Callback path was correctly left out of OTP/E.164 scope and still submits a bare national number.

**Approved resolution (Product Owner, dual-field strategy):** `mobile_number`/`mobile_normalized` keep their original bare-national-number format and contract completely unchanged — the Callback flow and RPC are functionally identical to before this EBC. A new, independent `mobile_e164` column (migration: `supabase/migrations/20260822090500_journey_passport_leads_e164_backfill.sql`, additive only) and a new `mobileE164` field on `ValidatedJourneyLead` carry the E.164 form, used for OTP verification/SMS delivery and intended for progressive adoption by future features. Historical rows are intentionally left with `mobile_e164 = null`; a backfill of historical rows is a separate, explicit follow-up decision for Tiger/Arjun, not executed as part of this EBC.

DEC-R1.2-018 (historical `+91` backfill of `mobile_number`/`mobile_normalized`) is superseded by this resolution — no automatic production data migration of those two columns is required or was performed for Release 1.2.

### 13.2 MSG91 `template_id` and `otp_expiry` correction

While answering a Product Owner question about MSG91 procurement, a review of MSG91's SendOTP API against the original `sms.ts` implementation found two gaps, since fixed:

- `template_id` is a mandatory MSG91 SendOTP parameter (confirmed against MSG91's public documentation and an open-source v5 API wrapper — the primary `docs.msg91.com` API reference pages did not return usable content when fetched during this session, so this has not yet been confirmed against a live MSG91 account/API call). The original implementation never sent one. `createJourneyPassportOtpSmsProvider` now also requires `SMS_PROVIDER_TEMPLATE_ID` (new environment variable, `.env.example` updated) and fails closed — same as a missing API key/sender id — when it is unset.
- `otp_expiry` was hardcoded to `0`. MSG91 documents this value in minutes with a minimum of 1; `0` was invalid. Now derived from `journeyPassportOtpConfig.expirySeconds` (`Math.ceil(expirySeconds / 60)`, floored at 1 minute).

This value is independent of and redundant with SMV's own DB-side expiry — SMV never calls MSG91's own verify/resend-OTP endpoints and owns the pass/fail decision itself in the `verify_journey_passport_otp` RPC (WS5-01 §4.3), so this correction affects only how long MSG91 itself considers the code current, not SMV's verification outcome.

**Known limitation carried forward:** whether MSG91's v5 SendOTP API still reads a per-request `sender` value once a `template_id` is supplied (templates are configured with their own sender id/name on the MSG91 dashboard) could not be confirmed from public documentation during this session. The field is still sent as a harmless no-op if ignored. This should be confirmed against MSG91's dashboard/support once account access exists, before relying on it — flagged for Archie/whoever completes MSG91 account setup.
