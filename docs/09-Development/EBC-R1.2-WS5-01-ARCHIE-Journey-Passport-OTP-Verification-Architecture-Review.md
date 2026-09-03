# EBC-R1.2-WS5-01 — Journey Passport OTP Verification: Technical Architecture & Design Review

```text
Document Type : Technical Architecture Review (pre-ADR — recommendation, not yet ratified)
EBC ID        : EBC-R1.2-WS5-01
Persona       : Archie — Technical Architect
Workstream    : WS5 — International Phone Number & OTP Verification
Tracker Tasks : R1.2-05.18 (Evaluate OTP providers), R1.2-05.19 (Architecture review for OTP
                verification), and the Archie-owned share of R1.2-05.05, R1.2-05.15, R1.2-05.30
Reviewer      : Tiger | Business Owner: Vivek
Status        : Approved
Approved By   : Product Owner — Vivek; Delivery Lead — Tiger
Approval Date : 22 Aug 2026
Implementation: NOT authorised by this document (architecture only). Consolidated Rad
                implementation guidance is at EBC-R1.2-WS5-03. Three items in Section 18
                (SMS provider selection, libphonenumber-js dependency, legacy phone backfill
                to +91) remain open Product Owner decisions and must be individually approved
                before Rad begins the corresponding build steps — this approval covers the
                architecture in Sections 1–17, not those three pending decisions.
```

## 0. Session, Repository and Input Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via the device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ewp-r1.2-ws4-003-visual-card-consistency`. Working tree was clean before this review. This document is the only file this exercise adds; no source code, configuration, database, Supabase, or package-dependency changes were made, per this EBC's Implementation Restriction.
- **Primary tracker input read in full:** `docs/10-Backlog/RELEASE-1.2.md` — Workstream 5 goal/scope/dependencies/risks/acceptance criteria (Section "Workstream 5 — International Phone Number & OTP Verification") and the WS5 task table (Section 6.5, R1.2-05.01–R1.2-05.35), decisions `DEC-R1.2-002` and `DEC-R1.2-006`, open item `OPEN-R1.2-006`, risk `RISK-R1.2-010`. This EBC's own "Existing Functional Decisions (Already Approved)" list was cross-checked against the tracker and found consistent — nothing here revisits those decisions.
- **Repository source code inspected directly (full files unless noted):** `web/hooks/useJourneyPassport.ts`, `web/components/journey-passport/JourneyPassport.tsx`, `web/components/journey-passport/JourneyPassportMoments.tsx`, `web/context/JourneySessionContext.tsx`, `web/lib/journey-passport/entry-context.ts`, `web/config/journey-passport.config.ts`, `web/types/journey-passport.types.ts`, `web/lib/journey-leads/{types,validation,service,repository,client,rate-limit,email}.ts`, `web/lib/callback-preferences.ts`, `web/app/api/journey-passport/{leads,callback,events}/route.ts`, `web/lib/journey-director/{passport-adapter,journey-synopsis}.ts` (mobile/reference handling only), `web/types/journey-director.ts` (`JourneyPassportSnapshot` shape), `supabase/migrations/20260802130000_journey_passport_leads.sql`, `supabase/migrations/20260803120000_journey_passport_callbacks.sql`, `web/package.json` (dependency inventory), `web/.env.example` and `web/.env.local` (variable **names** only — no secret values were read or are reproduced anywhere in this document, per Project Instructions Section 25), `web/next.config.ts`, `web/config/*.config.ts` directory listing.
- **Repository documentation read for conventions:** `docs/09-Development/EBC-EXECUTION-STANDARD.md`, `docs/09-Development/EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md` (structural precedent for an Archie architecture deliverable), `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (ADR template — not used here since this document is a review/recommendation, not yet a ratified decision record; `docs/03-ADR/ADR-000.md` and `DECISIONS.md` are present but empty, confirming `docs/20-Architecture` is the active ADR location for a future ratified version of this review, if Tiger/Vivek choose to formalise one).
- **Repository-wide search performed:** no existing OTP implementation, OTP-named file, or OTP-related migration exists anywhere in `web/`, `docs/`, or `supabase/` (`grep -rli "otp"` returns only planning references inside `RELEASE-1.2.md` and two unrelated substring matches). This is a greenfield design within an established codebase, not an extension of partial prior work.
- **Filed at:** `docs/09-Development/EBC-R1.2-WS5-01-ARCHIE-Journey-Passport-OTP-Verification-Architecture-Review.md`, matching the location convention set by the WS3 precedent architecture EBC.

---

## 1. Executive Summary

Search My Vacation's Journey Passport currently captures a traveller's name and a 10-digit India-only mobile number, submits it directly to Supabase, and treats every submission as trustworthy. `DEC-R1.2-006` requires that, going forward, a Journey Passport submission is accepted only after the traveller has verified ownership of the mobile number via a one-time password sent by SMS; `DEC-R1.2-002` requires that phone numbers move to international E.164 storage. Both decisions are already approved — this document does not revisit them. Its job is to say *how*.

The existing lead-capture architecture is unusually consistent and worth preserving exactly as-is: every external dependency (Supabase, Resend) is called through plain server-side `fetch`, never an SDK; Supabase is used purely as a REST/PostgREST + RPC backend under a service-role key, with Row Level Security denying all `anon`/`authenticated` access and Postgres `SECURITY DEFINER` functions performing every atomic state transition (`claim_journey_passport_notification`, `claim_journey_passport_callback`); validation is hand-written, allow-listed, and defensive rather than schema-library-driven; and there is **no Supabase Auth usage anywhere in the application** — no session, no login, no identity concept beyond a per-submission passport reference. This review's central architectural recommendation is to extend that exact pattern rather than introduce a new one: a bespoke OTP challenge table plus two new `SECURITY DEFINER` RPC functions (mirroring the two that already exist), an SMS delivery call made via `fetch` exactly like the existing Resend integration, and no Supabase Auth. Adopting Supabase Auth's phone-OTP flow was evaluated and is not recommended — see Section 12.1.

The review also surfaces one finding that is not optional to fix and is not itself an architecture decision, only an engineering-sequencing one: the current Journey Passport closure UI shows the Passport Stamp **before** the traveller has even entered their mobile number, let alone verified it (`web/components/journey-passport/JourneyPassport.tsx`) — directly contradicting this EBC's already-approved decision "Passport Stamp only after successful submission." Section 8 and Section 10 detail the required resequencing; it is a Rad implementation concern, not a new product decision, but it must not be missed.

Six deliverables follow: current-architecture findings and the integration point (Sections 2–3), the OTP and phone-number architecture with a provider recommendation (Sections 4–5), configuration and security design (Sections 6–7), failure and state handling (Sections 8–9), a full data-flow sequence and risk register (Sections 10–11), and, closing the review, the trade-off analysis, implementation recommendation, required code changes, rollback plan, and readiness assessment Rad needs to execute (Sections 12–17). Three items require a decision from Tiger/Vivek before Rad can begin — they are collected in Section 18 rather than resolved unilaterally here, per Project Instructions Section 35.

---

## 2. Current Architecture Review

### 2.1 Journey Passport flow and state management

The Passport is a seven-step wizard (`journeyMoments` in `web/config/journey-passport.config.ts`: `welcome → about-you → companions → dream-journey → pace-and-timing → destination → discover`) driven by a single `useReducer` in `web/hooks/useJourneyPassport.ts`. State lives only in memory plus `sessionStorage` (`smv:journey-passport:v1`, 24-hour max draft age, restored via a "Continue where you left off?" prompt); there is no server-side session and no cookie. Browser back/forward is implemented by hand with `window.history.pushState`/`popstate`, replaying `journeyMoment` markers into `history.state` — not the framework router.

Critically, **the mobile number is not part of this seven-step wizard.** It is collected separately, after the wizard's final "discover" step, inside the closure/acknowledgement screen rendered directly by `JourneyPassport.tsx` (the `showAcknowledgement` branch), alongside the traveller's name, immediately before the single POST to `/api/journey-passport/leads`. This matters for Section 3: the optimal OTP integration point sits in this same closure screen, not inside the wizard's `journeyMoments` machinery.

### 2.2 Submission workflow and API pattern

One synchronous path today: `JourneyPassport.tsx`'s `continueToDirector` handler client-validates name (≥2 chars) and mobile (`/^\d{10}$/` after stripping non-digits, rejecting `0000000000`), builds a `JourneyPassportSnapshot`, and calls `submitJourneyPassportLead` (`web/lib/journey-leads/client.ts`), a thin `fetch` wrapper around `POST /api/journey-passport/leads`. The route (`web/app/api/journey-passport/leads/route.ts`) is a single Next.js Route Handler (`runtime = "nodejs"`) that: caps request size (32 KB, checked twice — `Content-Length` header and actual byte length), applies an IP-keyed rate limit, re-validates and re-parses the entire payload server-side via `parseJourneyLeadSubmission` (never trusting client validation), then calls `processJourneyLead` (`web/lib/journey-leads/service.ts`), which upserts the lead, records two audit events, and attempts an email notification via an idempotent claim-then-send pattern. The same three-layer shape (rate-limit → strict parse → service) repeats identically in the `callback` and `events` routes. This is the pattern any new OTP route must match.

### 2.3 Supabase integration — REST/RPC, not the SDK, and no Auth

`web/lib/journey-leads/repository.ts` does not import `@supabase/supabase-js` — it is not a dependency of this project at all (confirmed against `web/package.json`; the only production dependencies are `next`, `react`, `react-dom`). Every database operation is a hand-built `fetch` to `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/...` or `.../rest/v1/rpc/...`, authenticated with the service-role `SUPABASE_SECRET_KEY` sent as both `apikey` and `Authorization: Bearer`. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is declared in `.env.example`/`.env.local` but is not referenced anywhere in the codebase I could find — it is currently unused, reserved capacity, not an active integration point. There is no Supabase Auth session, no `auth.users` row, no JWT-based RLS policy anywhere in this repository; RLS on `journey_passport_leads`/`journey_passport_events` instead **denies** `anon`/`authenticated` outright and grants only `service_role` (see the migration excerpt in Section 2.7). All request-scoped concurrency safety (duplicate notification sends, duplicate callback claims) is achieved with atomic Postgres `SECURITY DEFINER` functions taking a client-supplied `claim_token`, not with database transactions issued from the Node runtime. This is the load-bearing pattern for Section 4.

### 2.4 Validation strategy

Entirely hand-written, no schema library (no `zod`, `yup`, or similar in `package.json`). The pattern in `web/lib/journey-leads/validation.ts` is: an explicit `Set` of allowed top-level keys (`hasOnlyKeys`, rejecting any unrecognised field — an anti-mass-assignment control), per-field regex/length/enum checks, a `cleanSingleLine` normaliser stripping control characters, and a discriminated `{ ok: true, value } | { ok: false, code }` result type consumed by the route. Phone-specific: `MOBILE_NUMBER_PATTERN = /^\d{10}$/`, a `MOBILE_REJECTED_NUMBERS` denylist (currently just `0000000000`), and `normalizeJourneyMobile` (digit-stripping only — no country-code awareness exists anywhere in this layer today).

### 2.5 Environment configuration and existing "config" pattern

Two genuinely different conventions coexist and must not be conflated. `web/config/*.config.ts` (nine files, e.g. `journey-passport.config.ts`, `journey-director.config.ts`) are **compile-time, hand-authored TypeScript constants** — option catalogues, moment definitions, validation predicates — never read from `process.env` and never intended to change without a code deploy. Separately, a handful of **operational/behavioural** values are read from `process.env` directly inside route handlers and library functions at call time (`RESEND_API_KEY`, `JOURNEY_LEAD_FROM_EMAIL`, `JOURNEY_LEAD_NOTIFICATION_EMAILS`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`) — but there is, today, **no example anywhere in the codebase of an operational numeric/behavioural value (a timeout, a limit, a window) being environment-configurable.** Every such value found is a hardcoded module-level constant: `WINDOW_MS = 10 * 60 * 1000` and `MAX_ATTEMPTS = 10` in `web/lib/journey-leads/rate-limit.ts`; `AbortSignal.timeout(7000)` repeated at three call sites in `repository.ts` and twice in `email.ts`; `MAX_REQUEST_BYTES` per route; the notification re-claim window `interval '10 minutes'` hardcoded directly inside the SQL function body. This is the gap this EBC's Section 4 (Configuration Strategy) exists to close, and Section 5 below proposes the first environment-configurable behavioural values this codebase will have.

### 2.6 Service layer

`web/lib/journey-leads/service.ts` is the orchestration layer the route handlers call into; it never touches `fetch`, `process.env`, or Supabase URLs directly — those are injected as `repository`/`notifier` dependencies (a small but real dependency-inversion boundary, enabling `verify:journey-leads`'s test harness to substitute fakes; see `web/package.json` scripts). Every side effect (event recording) is wrapped in `recordEventSafely`, which swallows and logs rather than propagating — audit-trail writes are explicitly best-effort and must never fail the primary operation. This convention should extend to OTP audit events.

### 2.7 Existing security and abuse-prevention patterns

Directly reusable precedent for Section 6/Section 7:

```sql
alter table public.journey_passport_leads enable row level security;
revoke all on table public.journey_passport_leads from anon, authenticated;
grant select, insert, update on table public.journey_passport_leads to service_role;
```
— every table this application owns is invisible to `anon`/`authenticated` by default; only the Node server, via the service-role key, can reach it. `claim_journey_passport_notification(p_passport_reference, p_claim_token)` is a `SECURITY DEFINER` function that atomically transitions state only if a specific `where` predicate holds (pending-and-unclaimed, or claimed-but-stale-after-10-minutes, or previously-failed) and returns whether the caller won the claim — this exact shape (atomic conditional UPDATE ... RETURNING found, called from Node, no application-side locking) is the correct precedent for OTP resend-cooldown and verify-attempt counting, both of which must be safe under concurrent/duplicate requests. IP-keyed, in-memory rate limiting (`web/lib/journey-leads/rate-limit.ts`) is the only other abuse control; see Section 6.5 for why it is insufficient, on its own, for OTP.

### 2.8 Phone number — current state (baseline for Section 3)

India-only, 10 digits, no country code, enforced identically (and separately, with drift risk) in three places: the closure-screen `<input>` (`maxLength={10}`, `inputMode="numeric"`, digits-only `onChange` strip), `MOBILE_NUMBER_PATTERN` in `validation.ts`, and the Postgres check `mobile_number ... between 10 and 24` / `mobile_normalized ~ '^[0-9]{10,15}$'`. That last constraint is the one interesting exception: the **database schema already tolerates 10–15 digit normalized numbers** — wider than the application currently allows. This was very likely deliberate headroom, not an oversight, and materially de-risks the E.164 migration in Section 3 (no destructive schema change is required, only a widening of what's already permitted plus a `+` prefix).

### 2.9 Optimal integration point

Given 2.1–2.2, OTP verification integrates as a **new phase between the existing closure-screen contact form and the existing `/api/journey-passport/leads` POST** — not inside the seven-step wizard, and not as a modification to the wizard's `journeyMoments` validation model. Concretely: the traveller enters name + phone (already E.164-aware per Section 3) in the closure screen exactly as today; on submit, instead of calling `submitJourneyPassportLead` directly, the client calls a new `POST /api/journey-passport/otp/send`; a new OTP-entry sub-state is shown in place of (not instead of) the current form; on successful verify, the client is issued a short-lived, single-use **verification token** which it must include in the existing `submitJourneyPassportLead` payload; the existing `/leads` route is extended with one new required-and-checked field, and rejects the request if the token is missing, expired, mismatched, or already consumed. This confines every OTP-specific change to the closure screen and two new library modules — it does not touch `useJourneyPassport.ts`, `journeyMoments`, or any of the seven Passport steps, honouring the Product guardrail already recorded in `RELEASE-1.2.md`: *"introducing verification only immediately before final submission rather than earlier in the flow."*

---

## 3. Phone Number Strategy

`DEC-R1.2-002` (already approved) settles *that* SMV moves to E.164 with India default; this section settles *how*, to the extent it affects OTP.

**Format.** Canonical storage and the value the OTP is sent to must be full E.164 (`+<countrycode><nationalnumber>`, e.g. `+919876543210`) — never a bare national number with an implicit country. `mobile_number` currently stores the raw traveller-entered string and `mobile_normalized` a digits-only derivative; both columns should carry E.164 going forward (`mobile_number` = the exact E.164 string, `mobile_normalized` becomes redundant with `mobile_number` once both are E.164 — Section 5 below revisits whether to keep it or drop it during implementation planning, and flags this as a Rad/Archie call at build time, not a decision this document needs to force now).

**Validation library — recommended, justified new dependency.** International phone validation (is `+44 20 7946 0958` structurally valid vs. `+44 2079460958` vs. a UK landline vs. a mobile) is not something a hand-rolled regex can do correctly across 190+ countries, and getting it wrong directly undermines OTP delivery cost and success rate. Recommend `libphonenumber-js` (a maintained, dependency-free JS port of Google's `libphonenumber`, ~145 KB, MIT-licensed, no native bindings, works identically in the Node route handler and the browser). This is a genuine new dependency and requires the project-owner approval Section 21 of the Project Instructions calls for — it is listed as a decision in Section 18, not assumed here. The alternative (a hand-maintained international regex/length table) was considered and rejected: it is exactly the kind of "governance liability that grows over time" the WS3 ADR's Architectural Principle 2 warns against, for a much higher-stakes field (phone numbers gate SMS spend and OTP delivery) than that ADR's own subject matter.

**Country selector.** Architecturally this is a static, config-driven list (country name, ISO code, calling code, default-selected flag for India) — the same shape as every existing `config/*.config.ts` file (Section 2.5), not a new runtime dependency. `libphonenumber-js` ships its own metadata (country → calling code, example numbers) which the selector list should be generated from or validated against once, rather than hand-maintained separately — avoiding a second, driftable source of the same facts. Flag rendering and the actual selector interaction are Sophie/Rad UX territory (R1.2-05.06–05.10), out of this document's scope.

**Storage/DB impact.** `mobile_number` column: constraint `char_length(mobile_number) between 10 and 24` already accommodates a `+`-prefixed international number (up to 24 chars covers every real E.164 value, which maxes at 16 chars including `+`) — no widening needed. `mobile_normalized`: constraint `^[0-9]{10,15}$` is digits-only and would reject a leading `+`; either drop the `+` when writing `mobile_normalized` (keep it purely numeric, which is what E.164's own digit-count limit of 15 already assumes) or retire the column in favour of always parsing `mobile_number` — Rad's implementation-time call, flagged for Archie sign-off at that point, not blocking this review.

**Existing-record backward compatibility (the risk `RELEASE-1.2.md` itself names).** Every `mobile_normalized` value already in `journey_passport_leads` is a bare 10-digit Indian number with no country code, because the application has only ever accepted India. Technically, the correct and safe interpretation of that legacy data is unambiguous: prefix every existing record with `+91`. This is a mechanical inference from the application's own prior behaviour (10-digit-only validation, no country selector, India-only market to date), not a new business judgement call, so Archie can state it as the recommended approach; it should still be named explicitly to Tiger/Arjun before Rad executes it, since it is a one-way data transformation over live lead records (see Section 18).

---

## 4. OTP Architecture

### 4.1 Generation

Server-generated only (never client-generated), 6 numeric digits, produced with `crypto.randomInt(0, 1_000_000)` (Node's `crypto` module, already imported in `service.ts` for `createHash`/`randomUUID` — no new dependency) zero-padded to 6 digits — never `Math.random()`, which is not cryptographically secure and must not be used for anything that gates account/lead trust.

### 4.2 Storage — hashed, never plaintext

The OTP itself must never be stored in plaintext, mirroring the general principle (Project Instructions Section 25) of never persisting secrets in readable form, even though this specific value is short-lived. Store a salted SHA-256 (or equivalent) hash of the code, exactly as a password would be handled, in a new table (Section 4.4). The plaintext code exists only transiently in the request that generates it and the outbound SMS payload.

### 4.3 Provider evaluation and recommendation (R1.2-05.18)

Two credible shapes exist, evaluated against India-primary + growing-international coverage, cost, and — critically — fit with the existing "plain `fetch`, no SDK" architecture (Section 2.3):

| Option | Delivery reliability (India) | International capability | Architecture fit | Relative cost | Notes |
|---|---|---|---|---|---|
| **MSG91** (recommended primary) | Strong — India-first provider, direct telecom routes, mature DLT-template tooling | Adequate for a growing but still India-majority traveller base; weaker than Twilio in some international corridors | Excellent — simple REST API, one `fetch` POST per send, same shape as the existing Resend integration in `email.ts` | Low | Requires DLT (Distributed Ledger Technology / TRAI) template pre-registration for any transactional SMS to Indian numbers — an operational, not technical, prerequisite; see Section 11 |
| **Twilio (plain Messages API, not Twilio Verify)** | Good | Best-in-class global coverage | Excellent — same `fetch`-based fit | Higher (per-SMS pricing plus India surcharges) | Twilio *also* requires India DLT registration for India-destined transactional SMS; no exemption |
| Twilio Verify (hosted OTP-as-a-service) | Good | Best-in-class | **Poor fit** — Verify owns code generation, expiry, and attempt-counting itself, which would mean *not* building the SMV-owned state machine this EBC's approved decisions require (SMV-specific max-2-resends, SMV-configurable delay) and duplicating that logic against a black-box API | Highest (per-verification-check billing) | Rejected — see rationale below |
| Supabase Auth phone sign-in (any backing SMS provider) | Depends on backing provider | Depends on backing provider | **Poor fit** — introduces an authentication/session concept nowhere else in this application; see Section 12.1 | N/A | Rejected |

**Recommendation:** MSG91 as the primary delivery provider for the plain SMS-send API (not an OTP/Verify product — SMV owns the OTP state machine per Section 4.4–4.6), with Twilio evaluated as a fallback/secondary if international delivery quality proves inadequate post-launch (consistent with `RISK-R1.2-010`'s own mitigation list, which names "provider fallback" as a future consideration, not a Release 1.2 requirement). **This is a recommendation, not a selection** — engaging either provider is a paid, ongoing operational commitment and requires Vivek's explicit approval per Project Instructions Section 35 ("paid dependency"); see Section 18.

### 4.4 Data model — new table, not new columns on `journey_passport_leads`

OTP verification must happen **before** a lead row exists (Section 2.9: verification gates the call to `/leads`, which is what creates the row via `upsertLead`). A new table is therefore required rather than extending `journey_passport_leads`:

```sql
create table public.journey_passport_otp_challenges (
  id uuid primary key default gen_random_uuid(),
  mobile_number text not null,               -- E.164, per Section 3
  otp_hash text not null,                     -- salted hash, never plaintext
  attempt_count int not null default 0,
  resend_count int not null default 0,
  status text not null default 'pending'      -- pending | verified | expired | exhausted
    check (status in ('pending', 'verified', 'expired', 'exhausted')),
  expires_at timestamptz not null,
  next_resend_at timestamptz not null,
  verification_token uuid,                    -- issued only on successful verify; single-use
  verification_token_consumed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
Row Level Security enabled, `anon`/`authenticated` revoked, `service_role` granted — identical posture to `journey_passport_leads` (Section 2.7). This is illustrative of shape and intent for Rad's implementation planning, not a migration ready to run; exact columns/constraints are an implementation-time detail, not an architecture decision.

### 4.5 Validation flow (state machine)

```
pending  --(correct code, before expiry, attempt_count < max)-->  verified
pending  --(wrong code)-->  pending, attempt_count += 1
pending  --(attempt_count reaches max)-->  exhausted   (terminal; traveller must request a new OTP)
pending  --(expires_at passed)-->  expired             (terminal; traveller must request a new OTP)
verified --(new OTP requested, or phone number changed)-->  new pending row created, old row superseded
```
Every transition is an atomic `SECURITY DEFINER` RPC (`verify_journey_passport_otp(p_mobile, p_code_hash, ...)`), following `claim_journey_passport_notification`'s exact shape: one conditional `UPDATE ... WHERE ... RETURNING`, so two concurrent verify attempts (e.g. a double-click, or a retried network request) cannot both succeed or corrupt the attempt counter — this is the same race the existing notification-claim RPC was built to prevent, applied to a new problem.

### 4.6 Lifecycle, resend, and expiry

Already-approved, non-negotiable per this EBC: maximum 2 resends; resend delay configurable; previous OTP invalidated whenever a new OTP is generated. Implementation: `send_journey_passport_otp` RPC checks `next_resend_at` (mirroring the notification claim's staleness window pattern) before allowing a new send, increments `resend_count`, and rejects once `resend_count` exceeds the configured maximum (Section 5) — returning a distinct, user-facing "resend limit exceeded" state rather than a generic failure. "Previous OTP invalidated whenever a new OTP is generated" means: generating a new code always overwrites `otp_hash`/`expires_at` on the same challenge row (or supersedes it — implementation detail) such that the old code can never verify successfully afterward, even if it is still technically inside its original expiry window.

---

## 5. Configuration Strategy

Per Section 2.5, this codebase has no precedent for environment-configurable behavioural values — every existing tunable (rate-limit window, attempt cap, request timeout) is a hardcoded constant. This EBC's explicit requirement ("Release 1.2 shall not hardcode operational values") is therefore a deliberate, narrow extension of convention for this feature specifically, not a retrofit of the whole codebase — it should not be read as licence to also externalise unrelated existing constants as part of this work (that would be exactly the "opportunistic refactoring" Project Instructions Section 19 prohibits).

Recommended: Vercel Environment Variables (the same mechanism already used for `RESEND_API_KEY` etc.), read via `process.env` inside a single new, small config module (`web/config/journey-passport-otp.config.ts`) that centralises parsing and safe defaults, consumed by the OTP routes/service — never `process.env` scattered across multiple files, unlike the current lead-notification code's pattern of reading the same four Supabase/Resend variables independently inside three different route handlers (a minor existing inconsistency this new module should not repeat).

| Concern | Proposed variable | Default (if unset) | Consumed by |
|---|---|---|---|
| OTP expiry duration | `JOURNEY_PASSPORT_OTP_EXPIRY_SECONDS` | 300 (5 min) | `verify_journey_passport_otp` RPC call site |
| Resend delay | `JOURNEY_PASSPORT_OTP_RESEND_DELAY_SECONDS` | 30 | `send_journey_passport_otp` RPC call site |
| Maximum resends | `JOURNEY_PASSPORT_OTP_MAX_RESENDS` | 2 (matches the already-approved decision — configurable, but the default must equal what's approved) | Resend route |
| Maximum verify attempts | `JOURNEY_PASSPORT_OTP_MAX_VERIFY_ATTEMPTS` | 5 | Verify RPC call site |
| Rate limit window / max | `JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS` / `JOURNEY_PASSPORT_OTP_RATE_LIMIT_MAX` | 600 / 5 | New OTP-specific rate limiter (Section 6.5) |
| Provider request timeout | `JOURNEY_PASSPORT_OTP_PROVIDER_TIMEOUT_MS` | 7000 (matches existing `AbortSignal.timeout(7000)` convention in `repository.ts`/`email.ts`) | SMS send call |
| SMS provider credentials | `SMS_PROVIDER_API_KEY`, `SMS_PROVIDER_SENDER_ID` | — (required; feature fails closed if absent, exactly as `email.ts`'s notifier returns `{status:"not-configured"}` when Resend is unconfigured) | SMS send call |

All values are read once, validated (numeric, positive, within a sane bound), and defaulted at module load — never re-read mid-request — matching how `journey-passport.config.ts` is imported once and treated as static for the life of the process.

---

## 6. Security Review

**OTP generation security** — `crypto.randomInt`, 6 digits, 1,000,000 possible values; combined with the approved max-5-verify-attempts (Section 5) and a 5-minute expiry, brute-force probability per challenge is bounded and negligible, provided attempt-counting is atomic (Section 4.5) — non-atomic counting (e.g. a race allowing two verify requests to both read `attempt_count = 4` and both proceed) is the actual risk, not the code space itself.

**OTP storage** — hashed (Section 4.2), never logged. The existing `maskPassportReference` convention (`repository.ts`) — logging a masked identifier rather than raw PII — should extend to OTP: log the challenge `id` and masked mobile number, never the code, never the full mobile number, in any `console.error` path.

**Replay attack prevention** — single-use `verification_token` (Section 4.4), consumed exactly once by the `/leads` route inside the same request that creates the lead row (an atomic RPC or a `WHERE verification_token_consumed_at IS NULL` conditional update), so a captured token cannot be replayed against a second submission. The OTP code itself becomes unusable immediately upon successful verification (transition to `verified`, Section 4.5) even before the token is consumed downstream.

**Brute-force mitigation** — layered: (a) the atomic per-challenge `attempt_count` cap (Section 4.5/5), (b) a new OTP-specific IP-keyed rate limiter (Section 6.5) distinct from the existing lead-submission limiter, since OTP send/verify is a materially different abuse surface (SMS-bombing a third party's phone number costs SMV real money per message, unlike a rejected lead submission).

**Expired OTP handling** — the verify RPC checks `expires_at` server-side on every attempt (never trust a client-side "expired" flag); an expired challenge transitions to `expired` and cannot be revived — the traveller must request a new code, which is the approved resend path, not a special "extend" path.

**Resend abuse prevention** — the `next_resend_at` cooldown plus the hard `max resends = 2` cap (Section 4.6) is the primary control; the OTP-specific rate limiter (Section 6.5) is the second, IP-based layer catching a script cycling through many different phone numbers rather than hammering one.

**Session handling** — there is no session to handle in the authentication sense (Section 2.3: no Supabase Auth, no cookie). The only "session-like" artefact this feature introduces is the single-use `verification_token`, scoped to one passport reference and one mobile number, consumed once, with no broader identity or persistence implication — consistent with the Product guardrail already recorded in the tracker: *"not an authentication, login or account-management feature."*

### 6.5 Why the existing rate limiter cannot simply be reused, unmodified

`web/lib/journey-leads/rate-limit.ts` is a per-process `Map` — it has no persistence and no cross-instance sharing. On Vercel's serverless Node runtime, concurrent or geographically distributed invocations do not share this `Map`; a determined caller can trivially exceed the "limit" by having requests land on different function instances. This is an acceptable, already-accepted risk for the existing lead-submission limiter (worst case: a few extra emails/DB writes). It is **not** acceptable for OTP send, where the abuse cost is real money spent on SMS to a third party's number and potential SMS-provider reputation damage. Recommendation: OTP send/verify rate limiting should be enforced at the database layer (inside the same atomic RPCs, keyed by mobile number and/or a request fingerprint, using the row's own `created_at`/`resend_count`/`next_resend_at` columns as the durable, cross-instance-safe counters) rather than relying on the in-memory limiter alone. The in-memory IP limiter can still run as a cheap first-pass filter in front of it, exactly as today, but must not be the only control.

---

## 7. Failure Handling

| Scenario | Expected behaviour |
|---|---|
| Invalid phone number (fails `libphonenumber-js` validation) | Rejected client-side before any send is attempted; server re-validates independently (never trusts client validation, per the existing `parseJourneyLeadSubmission` convention) and rejects with a specific error code if the client check was bypassed |
| SMS delivery failure (provider error/timeout) | Challenge row remains `pending`; traveller sees a clear, non-technical failure message and a retry/resend option; provider error detail is logged server-side only (masked), never surfaced to the traveller — matching `safeNotificationErrorCode`'s existing pattern in `repository.ts` |
| Expired OTP | Verify attempt rejected with an "expired, please request a new code" state; challenge transitions to `expired` (Section 6) |
| Incorrect OTP | Verify attempt rejected; `attempt_count` incremented atomically; remaining-attempts messaging is a Sophie/Rad UX decision, out of this document's scope |
| Resend limit exceeded | Resend request rejected once `resend_count` reaches the configured maximum (default 2); traveller is directed to re-enter/change their phone number, which starts a fresh challenge (see next row) |
| Verification timeout (traveller abandons the OTP screen) | No special server action needed — the challenge simply expires per its normal `expires_at`; no cleanup job is required for correctness, though a periodic purge of old `expired`/`exhausted` rows is good hygiene (operational, not architectural) |
| Traveller edits phone number mid-flow | Per `RELEASE-1.2.md` task R1.2-05.28 (already scoped, not introduced here): editing the number must invalidate any in-progress or completed verification for the old number — the client must treat a phone-number change as returning to the "send OTP" state, and the server must not accept a `verification_token` whose bound mobile number differs from the number in the final submission payload |
| Network interruption (send or verify request fails outright) | Standard `fetch` failure handling identical to the existing `JourneyLeadSubmissionError` pattern in `client.ts` — a friendly retry message, no partial state exposed to the traveller |

---

## 8. State Management

**During OTP verification** — lives in the closure-screen component's local React state (`useState`), exactly as `contactSubmission`/`contactError` already do for the existing name/mobile form — not in the `useJourneyPassport` reducer, consistent with Section 2.9's integration point.

**Browser refresh** — the seven-step wizard's draft (`sessionStorage`) already excludes `mobile` from anything meaningfully restorable mid-OTP (mobile is captured only in the closure screen, not the wizard state persisted by `useJourneyPassport`'s effect). A refresh during OTP entry should be treated as abandoning that specific attempt: the traveller returns to the closure screen's initial contact form, not an OTP-entry screen, and must re-request a code. **A `verification_token`, if one exists, must never be persisted to `sessionStorage`** — an OTP-verified flag surviving in browser storage across a refresh would be a spoofable "already verified" signal; verification must always be re-established fresh, or the server must independently re-check the token's validity (not just its presence) on the final submit regardless of what the client claims.

**Browser back navigation** — the existing `popstate` handler in `useJourneyPassport.ts` operates entirely within the seven `journeyMoments`; since OTP sits outside that reducer (Section 2.9), no change to that mechanism is required. The closure screen's own "Review my Passport" button already provides an equivalent "go back" affordance and should, when used mid-OTP, discard the in-progress challenge state client-side (the server-side row will simply expire on its own).

**Mobile interruptions** (app backgrounded, OS killed the tab, etc.) — no different from "browser refresh" above from the server's point of view; the challenge row expires on its own timer regardless of what the client does.

**Verification success** — issues the single-use `verification_token` (Section 4.4/6); this is the exact point at which Rad must trigger the resequencing named in Section 1: today, `complete()` shows the Passport Stamp animation *before* the contact form even renders. Per this EBC's already-approved decision ("Passport Stamp only after successful submission"), the stamp must move to render only after `submitJourneyPassportLead` (now gated by a verified token) succeeds — i.e., after OTP verification *and* successful lead storage, not before either. This is a closure-screen state-machine change (`closureStage` in `JourneyPassport.tsx` currently sequences `closing → stamping → contact → departing`; it needs to become, in effect, `closing → contact-and-verify → stamping → departing`), not a new architectural component, but it is a real, non-trivial reordering Rad must plan for, not a cosmetic tweak.

**Verification failure** — no wizard state is affected; the traveller remains on the closure screen, can retry verification or request a resend within the approved limits, or edit their phone number (which invalidates the prior challenge, per Section 7).

---

## 9. Component Impact Analysis

| Layer | File | Change |
|---|---|---|
| React component | `web/components/journey-passport/JourneyPassport.tsx` | Modify — closure-screen state machine gains an OTP sub-flow; stamp-sequencing fix (Section 8) |
| React component | New: `web/components/journey-passport/OtpVerification.tsx` (or similar) | New — OTP entry UI, resend affordance, error states (masked-number display per R1.2-05.27 is Sophie/Rad's call) |
| Hook | Possibly new: `web/hooks/useJourneyPassportOtp.ts` | New — encapsulates send/verify/resend client calls and local state, kept separate from `useJourneyPassport.ts` per Section 2.9/8 |
| Client library | New: `web/lib/journey-passport-otp/client.ts` | New — `fetch` wrappers for the two new routes, mirroring `journey-leads/client.ts`'s shape |
| Service layer | New: `web/lib/journey-passport-otp/service.ts` | New — orchestration, mirroring `journey-leads/service.ts` |
| Validation | New: `web/lib/journey-passport-otp/validation.ts` | New — request parsing/allow-listing, mirroring `journey-leads/validation.ts` |
| Repository | New: `web/lib/journey-passport-otp/repository.ts` | New — REST/RPC calls to the new table and RPC functions, mirroring `journey-leads/repository.ts`'s `fetch`-only pattern |
| Supabase layer | New migration under `supabase/migrations/` | New — `journey_passport_otp_challenges` table, `send_journey_passport_otp`/`verify_journey_passport_otp` RPC functions, RLS posture matching existing tables |
| API routes | New: `web/app/api/journey-passport/otp/send/route.ts`, `web/app/api/journey-passport/otp/verify/route.ts` | New — same three-layer shape as `leads/route.ts` (Section 2.2) |
| API route | `web/app/api/journey-passport/leads/route.ts` | Modify — require and validate `verification_token`, reject if missing/invalid/mismatched/consumed |
| Validation/types | `web/lib/journey-leads/validation.ts`, `web/lib/journey-leads/types.ts` | Modify — add the token field to `JourneyLeadSubmission`/`parseJourneyLeadSubmission`; extend mobile validation from `/^\d{10}$/` to E.164-aware (Section 3) |
| Shared types | `web/types/journey-passport.types.ts`, `web/types/journey-director.ts` | Modify — `mobile` field semantics change from bare-10-digit to E.164 string across `JourneyPassportState`/`JourneyPassportSnapshot` |
| Config | New: `web/config/journey-passport-otp.config.ts` | New — Section 5's environment-variable-backed configuration module |
| Config | New: a country-list config (shape per Section 3) | New — feeds the country selector; Sophie/Rad-owned UX, Archie-reviewed data source |
| Utilities | New dependency: `libphonenumber-js` (pending approval, Section 18) | New — phone parsing/validation/formatting, used in both the client form and server-side validation |
| Environment variables | `.env.example`, Vercel project settings | Modify/add — every variable listed in Section 5, plus `SMS_PROVIDER_API_KEY`/`SMS_PROVIDER_SENDER_ID` (pending provider approval, Section 18) |

---

## 10. Data Flow

```
Journey Passport (7-step wizard, unchanged)
        │
        ▼
Closure screen — name + phone (E.164-aware) entered
        │
        ▼
Send OTP  ── POST /api/journey-passport/otp/send
        │      (rate-limit → validate E.164 → RPC: create/replace pending
        │       challenge, invalidate any prior challenge for this number →
        │       SMS provider fetch)
        ▼
SMS Delivery (MSG91/Twilio — provider selection pending, Section 4.3/18)
        │
        ▼
Traveller enters code
        │
        ▼
Verify OTP  ── POST /api/journey-passport/otp/verify
        │      (rate-limit → RPC: atomic attempt-check + hash compare →
        │       on success: issue single-use verification_token;
        │       on failure: increment attempt_count, or expire/exhaust)
        ▼
Journey Passport Submission  ── POST /api/journey-passport/leads
        │      (existing validate/rate-limit/service pipeline, PLUS:
        │       verification_token required, checked against the challenge
        │       table, consumed atomically — request rejected otherwise)
        ▼
Passport Stamp  (moved to fire only here — see Section 8 resequencing)
        │
        ▼
Journey Landing (savePassport → /journey-director, unchanged)
        │
        ▼
Journey Director Notification  (existing Resend email path, unchanged —
                                 now guaranteed to represent a phone-verified
                                 enquiry, per DEC-R1.2-006's intent)
```
Recommended improvement over the EBC's own illustrative sequence: **OTP verification must precede Passport Submission, and Passport Submission must be the sole gate for the Stamp** — both already reflected above and already required by the approved decisions; the diagram exists here mainly to make explicit that "Journey Passport Submission" is a single, still-atomic POST (not split into two), with the token as its new required input, rather than the OTP flow becoming a second parallel write path into `journey_passport_leads`.

---

## 11. Risks

| Risk | Category | Mitigation |
|---|---|---|
| SMS provider outage or delivery failure blocks all Journey Passport submissions | Operational (already tracked as `RISK-R1.2-010`) | Graceful, honest failure messaging (Section 7); resend capability; provider fallback evaluated but not required for R1.2 (Section 4.3) |
| India DLT (TRAI) transactional-SMS template registration is an unavoidable prerequisite for either recommended provider, and is a multi-day account/compliance process, not a code task | Operational | Must be started by Vivek/Tiger well before Rad's implementation window opens — flagged explicitly in Section 18, not something Archie or Rad can shortcut |
| In-memory rate limiting is not safe across serverless instances for a real-money-cost abuse surface (Section 6.5) | Technical / scalability | Durable, DB-backed counters inside the atomic RPCs, not the existing `Map`-based limiter alone |
| Legacy 10-digit lead records have no explicit country code | Technical / data | Backfill as `+91` (Section 3) — a mechanical, low-risk inference, but still a one-way transformation over live data requiring Tiger/Arjun sign-off before execution |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is declared but unused anywhere in the codebase | Maintainability (observation, not a blocker) | No action required for this EBC; noted so a future engineer doesn't assume it is load-bearing for OTP or anything else |
| Introducing a phone-validation library plus an SMS provider are the first two genuinely new runtime dependencies added to a codebase that has deliberately stayed at three (`next`, `react`, `react-dom`) | Maintainability | Both are justified by real correctness/delivery needs (Section 3/4.3) rather than convenience; both require explicit approval (Section 18), consistent with Project Instructions Section 21 |
| Passport Stamp resequencing (Section 8) is easy to under-scope as "just add an OTP screen" when it also requires moving an existing, already-shipped animation later in the flow | Technical / UX regression | Named explicitly here and in Section 8/9 so Rad's implementation estimate and Sophie's UX review both account for it up front |
| A verify RPC race (two concurrent verify requests against the same challenge) could, if not built atomically, allow an attempt-count bypass | Technical / security | Mandated atomic `SECURITY DEFINER` RPC pattern (Section 4.5), matching the two existing claim functions exactly |

---

## 12. Trade-off Analysis

### 12.1 Supabase Auth phone OTP vs. bespoke OTP (recommended)

Supabase Auth's `signInWithOtp({ phone })` would remove the need to build Section 4's table/RPCs/hashing by hand — Supabase would own code generation, storage, and expiry. It was rejected for three concrete reasons specific to this codebase, not as a general critique of the feature: (1) it requires configuring a phone provider *inside* Supabase Auth settings — Twilio/MessageBird/Vonage — which still means selecting and paying a third-party SMS vendor, so it does not actually avoid Section 4.3's provider decision, only relocates where the integration lives; (2) it would create the application's *first* Supabase Auth session/JWT concept, a second identity model running alongside the existing, deliberately session-less, service-role-only architecture (Section 2.3) — the RLS posture on every existing table would need to be reconsidered, since `anon`/`authenticated` are currently blanket-revoked and a Supabase-Auth-authenticated phone session is neither `service_role` nor today's `anon`; (3) Supabase Auth's OTP expiry/resend/attempt behaviour is configured at the project level and is materially less granular than the per-feature, environment-variable-driven control this EBC's approved decisions call for (a specific, configurable max-2-resends is a Journey-Passport-specific business rule, not a global auth-project setting). Given the existing architecture is deliberately simple and consistent, the bespoke approach (Section 4) is the smaller total change, even though it means writing more code up front.

### 12.2 SMS provider — MSG91 vs. Twilio vs. Twilio Verify

Covered in Section 4.3's table. Summary trade-off: MSG91 costs less and fits India-primary traffic well but has a materially smaller footprint outside India; Twilio costs more but is safer for international coverage as that traveller segment grows; Twilio Verify would reduce SMV's own code but conflicts with the already-approved, SMV-specific resend/attempt policy and costs the most. Recommendation stands as stated in 4.3: MSG91 primary, Twilio as a named future fallback, neither Verify product adopted.

### 12.3 In-app OTP entry vs. an external verification page/redirect

Not seriously considered as an alternative — an external redirect would break the "low-friction... immediately before final submission" guardrail already recorded in the tracker, and every comparable flow in this codebase (callback preferences, contact) is in-page. Noted here only to record that it was considered and dismissed, not silently omitted.

---

## 13. Implementation Recommendation

Proceed with the bespoke, REST/RPC-based OTP architecture described in Sections 3–9: new `journey_passport_otp_challenges` table and two `SECURITY DEFINER` RPC functions following the existing claim-function pattern exactly; a new, parallel `journey-passport-otp` library module mirroring `journey-leads`'s four-layer shape (validation → service → repository → client); two new API routes plus one modification to the existing `/leads` route to require and consume a single-use verification token; `libphonenumber-js` for phone parsing/validation; MSG91 as the primary SMS delivery provider with Twilio held in reserve; all OTP operational parameters environment-variable-configurable per Section 5; no Supabase Auth. This keeps the feature architecturally indistinguishable, in shape, from the lead-capture and callback-notification systems already in production, which is the single strongest risk-reduction lever available — Rad, Keerthi, and any future maintainer are extending a pattern they already know, not learning a new one.

---

## 14. Required Code Changes (for Rad — planning input, not implementation)

Section 9's table is the authoritative file-level list. In execution order: (1) the Supabase migration (table + RPCs) — nothing else can be built or tested against real data without it; (2) the `journey-passport-otp` library (validation → repository → service, in that order, matching how `journey-leads` was evidently built and is still organised); (3) the two new API routes; (4) the `libphonenumber-js`-based E.164 validation change to `journey-leads/validation.ts` and the shared type updates (Section 9's "shared types" row) — this can proceed in parallel with (2)/(3) since it is largely independent; (5) the closure-screen UI and state-machine change in `JourneyPassport.tsx`, including the Stamp resequencing (Section 8) — this should be built and reviewed last, once the API surface it calls is stable, and should get its own explicit Sophie UX pass given the resequencing risk named in Section 11.

---

## 15. Rollback Considerations

The new table and RPC functions are additive (matching this repository's existing migration convention — "This migration is additive: it does not drop or replace existing objects," per both prior lead/callback migrations) — they can be left in place even if OTP is later disabled without affecting any other feature. The actual feature toggle point is the `/leads` route's requirement for a `verification_token`: if OTP needs to be disabled quickly post-launch (e.g. provider outage with no fallback yet configured), the cleanest rollback is *not* a schema rollback but a route-level short-circuit — Rad's implementation should keep the token check isolated enough (a single guarded block, not threaded through the whole validation function) that it can be feature-flagged off via an environment variable without a redeploy of unrelated logic. This is a Rad implementation-planning note, not a new configuration requirement beyond what Section 5 already lists — it can reuse a boolean read alongside the other `JOURNEY_PASSPORT_OTP_*` variables (e.g. treating an unset SMS provider key as automatically bypassing the requirement, the same "fail soft to not-configured" convention `email.ts`'s notifier already uses when Resend isn't configured — worth Rad and Archie agreeing at build time whether OTP should fail-open or fail-closed in that specific unconfigured case, since fail-open would silently defeat `DEC-R1.2-006`).

---

## 16. Implementation Readiness Assessment

| Success criterion (from this EBC) | Status |
|---|---|
| Current architecture fully analysed | Complete — Section 2 |
| OTP architecture recommended, with rationale | Complete — Section 4, pending provider approval (Section 18) |
| Integration point identified | Complete — Section 2.9 |
| Phone number strategy documented | Complete — Section 3, pending library approval (Section 18) |
| Configuration strategy documented | Complete — Section 5 |
| Security reviewed | Complete — Section 6 |
| Risks documented | Complete — Section 11 |
| Implementation guidance ready for Rad | Complete — Sections 9, 13, 14 |
| All documentation resides within the repository | Confirmed — filed at `docs/09-Development/EBC-R1.2-WS5-01-ARCHIE-Journey-Passport-OTP-Verification-Architecture-Review.md` |
| No files exist outside the repository, no temporary artefacts | Confirmed — this document is the only artefact produced |
| No code, configuration, database, or dependency changes made | Confirmed — Section 0; `git status` unaffected by anything but this new file |

**Overall assessment: architecturally ready for Rad to begin detailed implementation planning, contingent on the three decisions in Section 18 below.** Nothing in Sections 2–15 depends on those three decisions being resolved in any particular direction — the shape of the solution is stable either way — but Rad cannot write the SMS-send call or add `libphonenumber-js` to `package.json` until they are.

---

## 17. Traceability to Release 1.2 Tracker (`docs/10-Backlog/RELEASE-1.2.md`, Section 6.5)

This document is the deliverable for **R1.2-05.18** (Evaluate OTP providers — Section 4.3) and **R1.2-05.19** (Architecture review for OTP verification — this document in full), and informs Archie's share of **R1.2-05.05** (phone-capture convention for future forms — Section 3's E.164/library approach), **R1.2-05.15** (E.164 storage/data-model assessment — Section 3), and **R1.2-05.30** (OTP abuse protection architecture — Section 6.5). It does not perform, and should not be read as pre-empting, **R1.2-05.20** (Arjun/Sophie's OTP flow definition) — Section 2.9/8's flow description is offered as the architectural constraint that flow must fit inside, not as a substitute for Arjun and Sophie's own pass.

---

## 18. Decisions Required From Project Owner / Tiger

Per Project Instructions Section 35 (material scope, architecture, and paid-dependency decisions require escalation, not silent resolution), the following three items are ready for a decision but are not Archie's to make alone:

1. **SMS provider selection and commercial engagement.** Recommendation: MSG91 primary (Section 4.3). Requires Vivek's approval as a new paid, ongoing operational dependency, and should trigger the India DLT template registration process (Section 11) as early as possible given its lead time — this is on the critical path for Rad's build window, not a detail that can wait until implementation starts.
2. **New dependency: `libphonenumber-js`.** Recommendation: approve (Section 3) — justified by correctness needs a hand-rolled regex cannot meet, and it is the first of only two new runtime dependencies this review proposes.
3. **Legacy phone-record backfill to `+91`.** Recommendation: approve the mechanical `+91` prefix backfill described in Section 3 for all existing `journey_passport_leads` rows, timed to Rad's E.164 migration work (R1.2-05.15) — flagged to Tiger/Arjun specifically because it is a one-way transformation of live records, even though the inference itself is not in question.

No other open question in this document blocks Rad from beginning detailed implementation planning against Sections 2–17.
