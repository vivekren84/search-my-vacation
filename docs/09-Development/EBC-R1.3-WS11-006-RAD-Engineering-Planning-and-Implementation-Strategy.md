# EBC-R1.3-WS11-006 — SMV Workspace Engineering Planning & Implementation Strategy

| Document Information | |
|---|---|
| Document Name | SMV Workspace Engineering Planning & Implementation Strategy |
| Persona | Rad — Engineering and Implementation Specialist |
| Status | Approved — Engineering Planning complete. Workstream 0 authorised to begin. |
| Version | 1.2 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| Feature | FEAT-R1.3-013 — SMV Workspace |
| EBC | EBC-R1.3-WS11-006 |
| Last Updated | 16 September 2026 |
| Predecessor | `EBC-R1.3-WS11-004-ARCHIE-Architecture-Baseline-and-Engineering-Readiness.md`, `EBC-R1.3-WS11-005-TIGER-Product-Ratification-and-Release-Governance-Synchronisation.md` |
| Nature of this EBC | Engineering planning and readiness validation only — **no production code, no React components, no database migrations, no source-code modification, no repository folder created.** |

---

## Document Change History

| Version | Date | Change |
|---|---|---|
| 1.0 | 16 September 2026 | Initial Engineering Planning & Implementation Strategy delivered for Product Owner / Tiger review. |
| 1.1 | 16 September 2026 | Added Section 11 (Engineering Governance Clarifications Addendum), answering the three Product Owner/Tiger governance questions raised on review of v1.0: repository structure necessity for the three proposed folders, `@supabase/ssr` dependency due diligence, and the FCR-023 UI component library trigger point. No other section changed. |
| 1.2 | 16 September 2026 | Product Owner approved Repository Structure, `@supabase/ssr`, and the FCR-023 governance approach (recorded in new Section 12). Section 6.4 and Section 11.1 revised: the `workspace/` vs `(workspace)/` naming point is now logged strictly as an Architecture observation, not resolved by Engineering — the Architecture package will establish the canonical convention before implementation of that route segment. Section 5 revised to add a terminology clarification distinguishing Engineering implementation phases (WS-Eng-0 through WS-Eng-8) from Release Workstream identifiers (e.g. WS11). Engineering Planning phase approved, subject to this clarification. |

---

## 0. Workspace Readiness Check

| Check | Result |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed, folder connected this session |
| Branch | `main` |
| Working tree | Not clean at task start — five pre-existing untracked `Claude outputs/*.md` reports, unrelated to this card and not touched by this activity |
| Remote sync | `main` is 1 commit ahead of `origin/main` (`abdacc8`, "Release 1.3 WS11: Complete architecture baseline and transition to engineering") — pre-existing state, not created by this card, not pushed by this card |
| Recent history | `abdacc8` confirms the Architecture baseline (six `docs/20-Architecture/workspace/` documents) and `EBC-R1.3-WS11-004` are already committed to `main` |
| Repository structure | No folder created, renamed or moved by this review |
| Branch switch performed | No |
| Commit/push performed | No |
| Code files read | Read-only inspection of `web/package.json`, `web/tsconfig.json`, `web/next.config.ts`, `web/lib/journey-leads/`, `web/lib/journey-passport-otp/`, `web/lib/geo-validation/`, `supabase/migrations/*.sql`, `web/app/**`, `web/app/api/**`, `web/config/*`, `web/.env.example` — no file modified |

Project Instructions §15 Session Startup Checklist items 1–13 are confirmed complete as of this table.

---

## 1. Executive Summary

The Product, UX and Architecture phases for WS11 (SMV Workspace) are complete and ratified. `EBC-R1.3-WS11-004` certified the six-document Architecture package "Ready for Engineering, subject to two named conditions," and `EBC-R1.3-WS11-005` recorded the Product Owner's ratification of both conditions (AD-WS11-002 — Supabase Auth/RLS; AD-WS11-006 — Destination Profile/`geo_places` separation) plus OQ-001 (Administrator/Privilege User operating model). **No outstanding Product decision blocks Engineering.**

This review independently re-verifies that finding against the actual repository state (not just the governance record) and finds it accurate: the codebase has **zero** existing authentication, authorisation, or `workspace_*` schema surface to reconcile against, so Engineering starts from a clean foundation rather than needing to migrate or retrofit existing Workspace code.

**Finding: Engineering may begin.** No genuine blocker was found. Nine implementation workstreams are proposed below (Section 5), sequenced to build the shared authentication/ownership/notification/audit mechanism first, then the Operational and Knowledge modules in the order the ratified Architecture baseline itself recommends, with Dashboard last (it aggregates every other module) and Destination Intelligence last among the Knowledge modules (its schema references `geo_places`, WS1's own concern).

Three items are surfaced for Product Owner/Tiger visibility before Rad's first implementation commit — none of them blocks starting Workstream 0 (foundational scaffolding), and none reopens a Product or Architecture decision:

1. **New repository folders** the ratified Architecture requires but that do not yet exist (Section 6) — flagged for confirmation per this project's own established convention (the `docs/20-Architecture/workspace/` precedent), even though they are already implied by the certified baseline.
2. **One new npm dependency** (`@supabase/supabase-js` and/or `@supabase/ssr`) needed to implement Supabase Auth session handling in a Next.js App Router application — the existing repository has never used a Supabase SDK (every existing feature uses hand-written `fetch` against PostgREST), so this is a genuine "new dependency" under Project Instructions §21, distinct from the already-approved *architectural* decision to use Supabase Auth.
3. **`FCR-023`'s UI component/data-grid library gap** — already logged in `FUTURE-CONSIDERATIONS.md`, restated here because it sits directly on this plan's critical path for the first Operational-module screen.

No Functional-Requirement-level, business-rule-level, or architecture-level question is raised in this document — every open item below is either an implementation-sequencing recommendation (Rad's own authority) or one of the three items above (routed to Section 9 for Product Owner/Tiger visibility, none blocking).

---

## 2. Repository Review — Current Engineering State

### 2.1 Application Structure

A single Next.js 16.2.10 App Router application (`web/`), React 19.2.4, TypeScript 5 (strict mode), Tailwind CSS 4. The sibling `apps/` directory is empty (`.DS_Store` only) and is not a precedent for a second application.

```
web/app/            about, contact, destinations, experiences, journey, journey-director,
                     journey-passport, privacy-policy, terms-and-conditions,
                     travel-inspiration, traveller-stories, api/
web/app/api/         journey-passport/{otp, destinations, leads, callback, events}
web/lib/             callback-preferences.ts, geo-validation/, journey-director/,
                     journey-itineraries/, journey-leads/, journey-passport/,
                     journey-passport-otp/, traveller-stories/
web/config/          brand, contact, destination-images, experiences, journey-director,
                     journey-passport-otp, journey-passport, public-destinations, site,
                     travellerStories.data (nine static, deploy-time config modules)
supabase/migrations/ 9 hand-written SQL files, additive, timestamp-prefixed
```

**No `web/middleware.ts` exists.** No route is currently gated by session or role. Every existing surface is public and anonymous.

### 2.2 Established Module Pattern (the precedent Engineering will extend)

Five precedents (`journey-leads`, `journey-passport-otp`, `geo-validation`, `journey-director`, `traveller-stories`) all follow the same shape, confirmed by direct inspection of `web/lib/journey-leads/` (`client.ts`, `email.ts`, `rate-limit.ts`, `repository.ts`, `service.ts`, `types.ts`, `validation.ts`) and `web/lib/journey-passport-otp/` (`client.ts`, `repository.ts`, `service.ts`, `sms.ts`, `types.ts`, `validation.ts`):

- No ORM. Hand-written PostgREST `fetch` calls, `apikey`/`Authorization: Bearer <SUPABASE_SECRET_KEY>` headers built inline (`createHeaders()` in `journey-passport-otp/repository.ts`).
- A typed `<Feature>RepositoryError` class per module (e.g. `JourneyPassportOtpRepositoryError`), never a bare thrown string.
- `SECURITY DEFINER` RPC functions in Postgres for anything requiring multi-row atomicity (the OTP send/verify functions), invoked the same way as any other RPC call, not a special code path.
- Environment validation happens inside the repository factory function itself (`createSupabaseJourneyPassportOtpRepository`), which throws a typed `database_not_configured` error if `NEXT_PUBLIC_SUPABASE_URL`/`SUPABASE_SECRET_KEY` are missing or the URL doesn't match the expected project — not a startup-time crash.
- Configuration is centralised under `web/config/*.config.ts` for static, deploy-time values.

This pattern is mature and directly reusable; the Architecture package's own recommendation (Solution Architecture §3–§4) to extend it for every `web/lib/workspace/<module>/` directory is confirmed correct by this inspection, not just accepted on the Architecture package's word.

### 2.3 Database

Nine migrations exist, all additive, all following one consistent security convention confirmed by direct read: RLS enabled, `REVOKE ALL ... FROM anon, authenticated`, `GRANT ... TO service_role` only, `SECURITY DEFINER` + explicit `REVOKE`/`GRANT EXECUTE` on every RPC. **No `auth.*` schema usage exists anywhere** (confirmed by repository-wide search) — no Supabase Auth account has ever been created in this project. This directly confirms Architecture Discovery §9's central finding: SMV Workspace will be the first consumer of Supabase Auth, from a standing start.

### 2.4 Dependencies

`web/package.json` dependencies: `next`, `react`, `react-dom`, `libphonenumber-js` only. Dev dependencies: Tailwind, ESLint, TypeScript, `sharp`, `fast-xml-parser`, `fflate`, type packages. **No `@supabase/supabase-js`, no `@supabase/ssr`, no UI component or data-grid library, no state-management library.** Confirmed by direct read of `package.json` — the Architecture package's own Discovery §10/§11 finding (R-ARCH-06) is accurate: nothing in the current dependency graph supports either Supabase Auth session handling or a dense operational UI.

### 2.5 Environment Variables

`web/.env.example` already declares `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (present but **unused anywhere in `web/` today** — confirmed by search) and `SUPABASE_SECRET_KEY`. The publishable key is exactly what a Supabase Auth client-side sign-in flow needs, and it is already provisioned in the example file without any code depending on it yet — a small, favourable pre-existing condition for Workstream 1 (Section 5).

### 2.6 Testing/Verification Convention

Every major feature has a matching `npm run verify:<feature>` script (`package.json`) — a dedicated `tsconfig.<feature>-verification.json` compiling a narrow slice of the codebase, then a Node script asserting expected behaviour (e.g. `verify:journey-leads`, `verify:geo-validation-coupling`). This is this repository's substitute for a conventional test runner (no Jest/Vitest dependency exists) and is the pattern Engineering should extend for `workspace_*` modules rather than introducing a new testing framework.

### 2.7 Deployment

Single Vercel project (unchanged by this Feature). **No `vercel.json` exists at the repository root or in `web/`** — relevant because Integration Architecture §5 proposes a Vercel Cron job for threshold-based Notifications; Vercel Cron schedules are declared in `vercel.json`, so this file will need to be created (Section 6).

### 2.8 Documents Reviewed

Every document this EBC's Read First section names was read in full: `docs/02-Product/workspace/` (2 files), `docs/04-UX/workspace/` (6 files), `docs/20-Architecture/workspace/` (6 files), `EBC-R1.3-WS11-004`, `EBC-R1.3-WS11-005`, `RELEASE-1.3.md` (§5 WS11 row, §7 Decision Log), `RELEASE-1.3-FEATURE-REGISTER.md` (`FEAT-R1.3-013`), `FUTURE-CONSIDERATIONS.md` (FCR-022, FCR-023). No document named in the Read First section was missing.

---

## 3. Engineering Readiness Assessment

**Can Engineering begin? Yes.**

| Readiness dimension | Finding |
|---|---|
| Product baseline | Approved, v2.0 (Specification + RTM), certified Ready for UX Architecture (`DEC-R1.3-006`) |
| UX baseline | Approved, six documents, certified Ready for Solution Architecture (`DEC-R1.3-007`) |
| Architecture baseline | Approved, six documents, certified Ready for Engineering (`DEC-R1.3-008`, `EBC-R1.3-WS11-004`) |
| Product ratification | AD-WS11-002, AD-WS11-006, OQ-001 approved (`DEC-R1.3-009`, `EBC-R1.3-WS11-005`) |
| Repository state | Confirmed clean of any conflicting Workspace code, migration, or dependency (Section 2) |
| Module/table/screen specification depth | Sufficient to begin building: 9 modules + Settings, ~20 tables (Data Architecture §3), 43 screens (Screen Inventory §11), every business invariant named with its enforcement mechanism (Domain Model §5) |
| Engineering-level unknowns | Three, all non-blocking to starting Workstream 0 (Section 9) |

**Blockers found: none.** The two named conditions from `EBC-R1.3-WS11-004`'s "Ready, with two named conditions" verdict are both resolved (Section 2.3 there; confirmed again in `RELEASE-1.3-FEATURE-REGISTER.md` v1.3). This review does not find a third gating condition — the items in Section 9 are visibility items, not blockers, because none of them prevents Workstream 0 (Section 5) from starting today.

---

## 4. Implementation Strategy

### 4.1 Overall Approach

Extend the existing repository's proven conventions rather than introducing new ones, per Project Instructions §18/§21 and the Architecture package's own explicit direction:

- **One application, new route segment** (`web/app/workspace/**`), not a second Next.js app — AD-WS11-001.
- **Extend, do not replace, the five-file module pattern** (`types.ts`, `validation.ts`, `repository.ts`, `service.ts`, `client.ts`) for every `web/lib/workspace/<module>/` directory — AD-WS11-004, confirmed reusable by Section 2.2's direct inspection.
- **Server Components for reads, API Route Handlers under `web/app/api/workspace/**` for writes**, mirroring `web/app/api/journey-passport/**` exactly (Solution Architecture §6).
- **No ORM, no ORM-adjacent query builder.** Hand-written PostgREST calls and `SECURITY DEFINER` RPC functions, consistent with every existing module.
- **Additive-only migrations** under `supabase/migrations/`, one logical unit per file, `workspace_`-prefixed tables (AD-WS11-003, Data Architecture §2).
- **No message queue, no background-job framework.** Synchronous, in-process notification emission; a single Vercel Cron job for threshold checks (AD-WS11-005).
- **Extend the existing `npm run verify:*` convention** (Section 2.6) with `workspace`-scoped verification scripts, rather than introducing Jest/Vitest as a new testing dependency — consistent with Project Instructions §21 (minimise dependencies) and §28 (testing/definition of done). This is Rad's own engineering-convention recommendation, not an Architecture-mandated decision, and is offered here for Tiger/Product Owner awareness rather than treated as pre-decided.

### 4.2 Two Genuinely New Engineering Capabilities

Everything above is a direct extension of an existing pattern. Two capabilities have **no existing precedent anywhere in this repository** and deserve explicit engineering strategy, not just "extend the pattern":

1. **Authentication and session handling.** No prior feature in this codebase has ever needed to know "who is making this request." The Data Architecture document (§4.4) explicitly leaves session-mechanism specifics as an implementation detail. Recommended approach: Supabase's own `@supabase/ssr` package (purpose-built for exactly this — cookie-based session handling in a Next.js App Router application, first-party-maintained by Supabase, the same vendor already providing the database), used only for session establishment/refresh in `web/middleware.ts` and in Server Components that need the current user's identity. This is the minimal-dependency path to a working, secure session — the alternative (hand-rolling JWT verification and cookie handling against Supabase Auth's REST API) would be a materially larger, higher-risk, and non-standard implementation for no benefit, and Project Instructions §21 favours the smaller, standard dependency here over the larger bespoke one. Flagged in Section 9 for Tiger/Product Owner visibility as a new dependency, not because there is a credible alternative worth debating.
2. **Row Level Security policy authoring.** Also with no precedent (every existing RLS policy in this repository is "deny all except `service_role`" — a single, uniform policy, not a role-differentiated one). The `workspace_current_user_role()` `SECURITY DEFINER` helper function (Data Architecture §4.2) is the one new SQL pattern Engineering must design carefully and test thoroughly, since an incorrect policy here is the single highest-impact class of bug this Feature can introduce (cross-user data exposure). Recommended: build and verify this helper function and a minimal RLS policy against one throwaway table first, as an isolated engineering spike within Workstream 0, before applying the pattern to all ~20 `workspace_*` tables.

### 4.3 What This Strategy Deliberately Does Not Do

- It does not re-litigate any Architecture Decision (AD-WS11-001 through AD-WS11-013) — every one is treated as the adopted baseline (Section 3).
- It does not invent field-level validation rules for the ~185 undrafted Functional Requirements (OQ-018) — Engineering builds to the level of detail that is Approved (Vision, Business Purpose, Business Objects, Business Rules), exactly as the Architecture package itself did.
- It does not resolve OQ-008, OQ-012, OQ-014, OQ-020, OQ-021, or OQ-022 — each already has a non-blocking architectural treatment (Architectural Decisions §3–§4) that this plan builds against as stated, without waiting for the underlying Product confirmation.
- It does not select specific screen layouts, wireframes, or visual designs — those remain `FCR-022`'s future wireframing stage, sequenced against this plan in Section 5.

---

## 5. Implementation Workstreams

**Terminology clarification (added at Product Owner request, v1.2):** the "WS-Eng-0" through "WS-Eng-8" labels used throughout this section are internal **Engineering implementation phases**, sequenced by this document for delivery purposes only. They are **not** Release Workstream identifiers in the Release-governance sense (e.g. `WS1`, `WS2`, `WS3`, `WS4`, `WS11`, as used in EBC naming and the Release 1.3 tracker). All nine `WS-Eng-*` phases below sit entirely inside the single Release Workstream **WS11 — SMV Workspace**; none of them is, or should be read as, a new or separate Release Workstream.

Nine engineering workstreams, sequenced primarily by dependency, not by module list order. This restates and extends `EBC-R1.3-WS11-004`'s own five-point sequencing recommendation (§4.2 there) to task-package granularity, without contradicting it.

### WS-Eng-0 — Foundational Scaffolding (no dependency; start immediately)

**Scope:** `web/lib/workspace/shared/` (ownership column helpers, `workspace_audit_log` writer, `shared/notifications` emitter scaffold with no consumers yet, `shared/rbac` module shell), the `workspace_users` table and its one-to-one link to `auth.users`, the `workspace_current_user_role()` helper function (built and spike-tested per §4.2), `web/middleware.ts` (session validation only — no route-specific role checks yet), the first `workspace_` migration establishing naming/RLS conventions for everything that follows, and the `web/lib/workspace/` directory scaffolding itself (empty module directories with `types.ts`/`validation.ts`/`repository.ts`/`service.ts` stubs for every module named in Section 5.2 below, so every later workstream starts from the same shape).

**Depends on:** nothing. **Blocks:** every other workstream (every module imports `shared/`, per Solution Architecture §4.2's dependency rule: "every module depends on `shared/`, never the reverse").

**Why first:** matches `EBC-R1.3-WS11-004` §4.2 point 1 exactly ("foundational, unconditional work first... nothing here depends on AD-WS11-002 or AD-WS11-006"), and additionally front-loads the two genuinely novel engineering risks (§4.2 above) into the workstream with the smallest blast radius if something needs rework.

### WS-Eng-1 — Authentication, RBAC Mechanism and Personal Settings

**Scope:** Supabase Auth wiring (sign-in, session refresh, sign-out), the Administrator/Privilege User two-role RBAC mechanism (Discovery §13's OQ-001 recommendation: "the *mechanism* is ready before the *capability matrix* is confirmed... a conservative (Administrator-only) default until confirmed" — note OQ-001's operating-model ratification, per `EBC-R1.3-WS11-005` §10 Recommendation 1, does **not** yet supply the granular per-screen capability matrix, so this conservative default remains the correct implementation posture today, not a stale caveat), Administrator-initiated user creation/invitation, self-service and Administrator-initiated password reset (both explicitly approved, `AD-WS11-002`/Data Architecture §4.4's Authentication Lifecycle), and **SET-01 (Personal Preferences — profile, password, photo, appearance)**.

**Depends on:** WS-Eng-0. **Blocks:** every screen requiring a signed-in identity — i.e. everything else.

### WS-Eng-2 — Traveller Hub and Vendor Management (Knowledge, low cross-dependency)

**Scope:** `workspace_travellers`, `workspace_traveller_flags` (TH-01–TH-03); `workspace_vendors`, `workspace_vendor_performance_notes` (VM-01–VM-03; VM-04, the global Vendor Confirmations queue, is deferred to WS-Eng-4 since it reads Journey data that does not exist yet). The Lead-ingestion adapter (`web/lib/workspace/journey-planning/leadIngestion.ts`, Integration Architecture §2.1) and its mobile-matching lookup against `workspace_travellers` is built here, alongside Traveller Hub, since the adapter's own logic depends on this table existing.

**Depends on:** WS-Eng-1 (RBAC; both modules have Administrator-scoped actions — Vendor lifecycle changes, Preferred Partner designation). **Rationale for going early:** both are referenced by Journey Planning (WS-Eng-3) but own no dependency the other direction — building them first means Journey Planning's UI has real data to link against from day one, rather than needing stub/mock data.

### WS-Eng-3 — Journey Planning (Operational)

**Scope:** `workspace_journey_planning_records`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes`; the Generic Ownership Model applied to Journey Planning Record (Claim/Assign/Reassign); the seven-stage lifecycle (PD-JP-005) as deliberate, owner-driven transitions only; the BR-010 partial unique index; JP-01–JP-09 (9 screens). Requires a *thin* Itinerary Studio slice (at minimum, the ability to reference a Master Itinerary from a Proposal Version, JP-05) — see WS-Eng-5 note below.

**Depends on:** WS-Eng-0, WS-Eng-1, WS-Eng-2 (Traveller reference, Lead ingestion, Vendor reference for Vendor Quotations).

### WS-Eng-4 — Journey Workspace (Operational)

**Scope:** `workspace_journeys`, `workspace_vendor_confirmations`, `workspace_operational_readiness_items`; the BR-012 one-way conversion `SECURITY DEFINER` RPC (the one genuinely atomic, cross-aggregate operation in this data model — Data Architecture §6); JW-01–JW-08 (8 screens); VM-04 (global Vendor Confirmations queue, deferred from WS-Eng-2).

**Depends on:** WS-Eng-3 (a Journey can only be created by converting a Journey Planning Record — there is nothing to convert until WS-Eng-3 exists).

### WS-Eng-5 — Itinerary Studio (Knowledge)

**Scope:** `workspace_master_itineraries`, `workspace_traveller_itineraries`, `workspace_itinerary_versions`, `workspace_itinerary_learnings`; the Master→Traveller foreign key + copy-provenance field (AD-WS11-009); the Draft/Under Review/Approved governance workflow for Master Itinerary changes; the Learning Repository and Promotion workflows (PD-IS-005/007/008); IS-01–IS-07 (7 screens).

**Depends on:** WS-Eng-0, WS-Eng-1. **Sequencing note:** Itinerary Studio's *full* feature set (governance review, Learning Repository, Promotion) has no hard dependency on Journey Planning, so it can run in parallel with WS-Eng-3 once WS-Eng-1 is done — consistent with `EBC-R1.3-WS11-004`'s "Knowledge modules alongside Operational modules — no cross-dependency blocks parallel work here." However, JP-05 (Proposal Version Detail/Editor) needs *at minimum* IS-01/IS-02/IS-03 to exist to attach a Traveller Itinerary to a Proposal Version — Rad's recommendation is to build Master Itinerary Library/Detail/Traveller Itinerary Editor (IS-01–IS-03) as the first slice of this workstream, in parallel with WS-Eng-3's early tasks, and treat Version History/Learning Repository/Promotion (IS-04–IS-07) as a second slice that can trail slightly behind without blocking Journey Planning.

### WS-Eng-6 — Destination Intelligence (Knowledge, last among modules)

**Scope:** `workspace_destination_profiles`, its nullable read-only `geo_place_id` reference (AD-WS11-006), the Draft/Under Review/Approved governance lifecycle (PD-DI-004, versioned in place, no child version table — Data Architecture §6); DI-01–DI-04 (4 screens).

**Depends on:** WS-Eng-0, WS-Eng-1. **Why last:** matches `EBC-R1.3-WS11-004` §4.2 point 5 exactly — its schema references the existing `geo_places` table (WS1's concern), and while AD-WS11-006 is now ratified (no longer a gate), sequencing it last still minimises the window in which two workstreams (WS1 and WS11) touch related-but-distinct tables concurrently.

### WS-Eng-7 — Notifications and Threshold Automation

**Scope:** the full `shared/notifications` implementation (Informational/Action Required classification, BR-017's condition-based resolution), NOT-01/NOT-02 (Notification Log, Configuration); the Vercel Cron-based threshold check (`web/app/api/workspace/cron/check-thresholds/route.ts`, `vercel.json` addition, FR-WS-032's unclaimed-Lead threshold) — Integration Architecture §5.

**Depends on:** WS-Eng-0 (emitter scaffold) for the synchronous half; WS-Eng-3/4 existing and producing real trigger events before the threshold job has anything meaningful to check. **Rationale for sequencing after the operational modules rather than with WS-Eng-0:** the *scaffold* (emit function signature, `workspace_notifications` table) belongs in WS-Eng-0 since every module calls it: the *full* Notification Log/Configuration UI and the Cron job are more efficiently built and tested once there are real notification-producing events (a claim, a stage advance, an overdue confirmation) to verify against, rather than against synthetic data.

### WS-Eng-8 — Settings (Administration) and Dashboard (cross-module aggregator)

**Scope:** SET-02 (Users & Roles), SET-03 (Operational Queues configuration, FR-WS-038), SET-04 (organisation-wide Notification configuration); Workspace Configuration as runtime, database-backed configuration (`workspace_configuration` table, BR-018 "Configuration Over Code" — explicitly *not* a `web/config/*.ts` file, Discovery §10); then **Dashboard (DASH-01/02)** last of all, since it is a read-only aggregator over every other module's `service.ts` (Solution Architecture §4.2) and cannot be meaningfully built, let alone tested, before the modules it summarises exist.

**Depends on:** WS-Eng-1 (Users & Roles needs RBAC); SET-03 depends on the operational queues (WS-Eng-3/4) existing to configure; Dashboard depends on every other workstream.

### 5.1 Sequencing Diagram

```
WS-Eng-0 (Foundation)
   │
WS-Eng-1 (Auth/RBAC/Personal Settings)
   │
   ├── WS-Eng-2 (Traveller Hub, Vendor Mgmt) ──┐
   │                                            ├── WS-Eng-3 (Journey Planning) ── WS-Eng-4 (Journey Workspace)
   ├── WS-Eng-5 (Itinerary Studio) ─────────────┘                                        │
   │                                                                                      │
   ├── WS-Eng-6 (Destination Intelligence)                                               │
   │                                                                                      │
   └── WS-Eng-7 (Notifications/Cron, scaffold in WS-Eng-0, full build after) ─────────────┤
                                                                                           │
                                              WS-Eng-8 (Settings, then Dashboard) ─────────┘
```

### 5.2 Module → Workstream Cross-Reference

| Module (Solution Architecture §4) | Workstream | Tables owned | Screens |
|---|---|---|---|
| `shared/` (ownership, notifications, RBAC, audit) | WS-Eng-0 / WS-Eng-1 (RBAC) / WS-Eng-7 (notifications, full build) | `workspace_users`, `workspace_notifications`, `workspace_audit_log`, `workspace_tasks`, `workspace_follow_ups`, `workspace_documents` | — |
| `dashboard` | WS-Eng-8 (last) | none | 2 |
| `journey-planning` | WS-Eng-3 | `workspace_journey_planning_records`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes` | 9 |
| `journey-workspace` | WS-Eng-4 | `workspace_journeys`, `workspace_vendor_confirmations`, `workspace_operational_readiness_items` | 8 |
| `traveller-hub` | WS-Eng-2 | `workspace_travellers`, `workspace_traveller_flags` | 3 |
| `itinerary-studio` | WS-Eng-5 | `workspace_master_itineraries`, `workspace_traveller_itineraries`, `workspace_itinerary_versions`, `workspace_itinerary_learnings` | 7 |
| `destination-intelligence` | WS-Eng-6 | `workspace_destination_profiles` | 4 |
| `vendor-management` | WS-Eng-2 (VM-01–03) / WS-Eng-4 (VM-04) | `workspace_vendors`, `workspace_vendor_performance_notes` | 4 |
| `settings` | WS-Eng-8 | `workspace_configuration`, `workspace_personal_preferences` | 4 |
| Notifications (cross-cutting) | WS-Eng-0 (scaffold) / WS-Eng-7 (full) | (above, `shared`-owned) | 2 |

Total: 9 modules + Settings, ~20 tables, 43 screens (Screen Inventory §11) — fully accounted for across the nine workstreams with no gap and no duplication.

### 5.3 A Note on Parallelism

Everything downstream of WS-Eng-1 that does not have a direct arrow to another box in §5.1 (Traveller Hub/Vendor Management, Itinerary Studio's first slice, Destination Intelligence) can be assigned to different engineers and built concurrently, per `EBC-R1.3-WS11-004`'s own finding that "no cross-dependency blocks parallel work" among the Knowledge modules. Journey Planning → Journey Workspace is a genuine, hard sequential dependency (Section 5, WS-Eng-4) and should not be parallelised.

---

## 6. Repository Impact Assessment

### 6.1 New Files (within existing, already-approved top-level directories — no repository restructuring)

| Path pattern | Purpose |
|---|---|
| `supabase/migrations/<timestamp>_workspace_*.sql` | Additive, timestamp-prefixed, one logical unit per file (Data Architecture §2), e.g. a foundational migration (`workspace_users`, RLS helper function), then one per module's table set |
| `web/middleware.ts` | Session validation for `/workspace/**` routes (new file at the existing `web/` root — not a new folder) |
| `web/lib/workspace/shared/*.ts` | Ownership, notifications, RBAC, audit — five-file convention per sub-concern |
| `web/lib/workspace/{dashboard,journey-planning,journey-workspace,traveller-hub,itinerary-studio,destination-intelligence,vendor-management,settings}/*.ts` | Five-file convention per module (`types.ts`, `validation.ts`, `repository.ts`, `service.ts`, `client.ts` where a client-callable surface exists) |
| `web/app/workspace/**` | New route segment: `layout.tsx` (Primary Navigation Rail + Header Bar, shared across all Workspace screens) plus one subtree per module for the 43 screens in the Screen Inventory |
| `web/app/api/workspace/**` | New API route namespace, one Route Handler per mutation-shaped operation, mirroring `web/app/api/journey-passport/**` |
| `web/app/api/workspace/cron/check-thresholds/route.ts` | Vercel Cron-invoked endpoint (Integration Architecture §5), authenticated by a Cron secret, not a Workspace User session |
| `vercel.json` (repository root or `web/`, wherever the existing Vercel project root is configured) | **Does not currently exist anywhere in the repository.** Required to declare the Vercel Cron schedule for the threshold-check endpoint |
| `web/config/workspace.config.ts` (if any Workspace value is genuinely static/deploy-time, per Discovery §10's config-file-vs-database-config distinction) | Follows the existing nine-file `web/config/` convention |
| `tsconfig.workspace-verification.json` (or one per module, following the existing per-feature pattern) | Extends the existing `npm run verify:*` convention (Section 2.6) rather than introducing a new test runner |

### 6.2 Existing Files Touched

- `web/package.json` — one new dependency added (Section 4.2/Section 9, item 2): `@supabase/ssr` (and/or `@supabase/supabase-js` if a direct client is also needed for any client-side Auth UI interaction, e.g. the sign-in form).
- `web/.env.example` — no new *variable names* are strictly required for Supabase Auth itself (`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`/`SUPABASE_SECRET_KEY` already exist, Section 2.5); one new variable is required for the Vercel Cron secret (e.g. `WORKSPACE_CRON_SECRET`, following the existing naming convention), documented with no value, per Project Instructions §25.
- `web/next.config.ts` — not expected to require a change for routing (App Router directory-based routing handles the new segment natively); revisited only if a redirect or rewrite is later found necessary.

### 6.3 New Folders — Flagged for Visibility, Not Treated as a Silent Given

Per this EBC's own Repository Governance instruction, and consistent with this project's established precedent (Archie's own Architecture Discovery §2 explicitly reported creating `docs/20-Architecture/workspace/` — itself just a subfolder of an already-existing top-level folder — to the Product Owner before creating it), the following genuinely new directories do not yet exist and are named here for visibility rather than created silently:

- `web/lib/workspace/` (and its module subdirectories)
- `web/app/workspace/` (or `web/app/(workspace)/` — see Section 6.4)
- `web/app/api/workspace/`

**Assessment:** unlike the `docs/20-Architecture/workspace/` precedent (where no prior decision had specified that folder), these three are not a discretionary choice being made now — they are the literal, already-ratified Solution Architecture (§2, §4) and Architectural Decisions (AD-WS11-001, AD-WS11-004), certified "Ready for Engineering" by `EBC-R1.3-WS11-004` and reconfirmed with no outstanding condition by `EBC-R1.3-WS11-005`. This review's recommendation is that Rad may create them as part of Workstream 0 without a further approval round-trip, since doing so simply instantiates a folder structure the Product Owner has already reviewed and ratified in named form. This is disclosed here, rather than assumed silently, precisely because the project's own convention treats folder creation as worth surfacing even when — as here — the answer is already clearly "yes, proceed."

### 6.4 Naming Inconsistency — Logged as an Architecture Observation (Not Resolved by Engineering)

Architecture Discovery §12 (A-ARCH-02) names the new route segment `web/app/(workspace)/...` (a Next.js *route group* — no URL segment) as an example, while the Solution Architecture diagram (§2), its own Section 6, and the Integration Architecture's API route example (§4) consistently use `web/app/workspace/**` (a real URL path segment).

**Per Product Owner direction on review of this document's v1.1 (Section 12), this inconsistency is logged strictly as an Architecture observation and is not resolved by Engineering.** The Architecture package will be updated to establish a single canonical convention before implementation of this route segment begins. Engineering will implement whichever convention that update specifies; no route-segment naming decision has been made independently in this document, and the v1.1 recommendation previously stated here has been withdrawn accordingly.

---

## 7. Technical Risks

| ID | Risk | Likelihood / Impact | Mitigation |
|---|---|---|---|
| R-ENG-01 | An incorrect RLS policy or a bug in `workspace_current_user_role()` silently exposes cross-user data (e.g. a Privilege User seeing another user's claimed-but-not-theirs records) | Low likelihood if built carefully / **High impact** — the single highest-impact class of bug this Feature can introduce | Build and verify the RBAC helper function and one RLS policy in isolation first (§4.2, Workstream 0), before applying the pattern to all ~20 tables; extend the existing `verify:*` convention with an explicit negative-access test suite before Workstream 1 is considered done |
| R-ENG-02 | The BR-012 Journey Planning Record → Journey conversion RPC has a partial-failure bug, leaving a Journey created without its originating record correctly closed (or vice versa) | Low likelihood with a single transactional RPC (Data Architecture §6's own mitigation) / High impact if it occurs — a data-integrity defect visible to every Workspace User | Implement as a single `SECURITY DEFINER` PL/pgSQL function exactly as Data Architecture §6 specifies (mirroring the existing OTP send/verify precedent); add an explicit "attempt conversion twice" and "simulate mid-transaction failure" test to the `verify:*` suite before Workstream 4 is considered done |
| R-ENG-03 | `FCR-023` (no UI component/data-grid library selected) is not resolved before Workstream 3's first queue-view screen (JP-01) is due to start, causing either a rushed, unreviewed dependency choice or a delayed start | Medium likelihood given current sequencing / Medium impact (delay, not defect) | Already logged and its own suggested review timing ("before Rad begins implementation of the first SMV Workspace queue-view screen") is restated here as a concrete trigger: this decision is needed no later than partway through Workstream 2, so it is ready before Workstream 3 begins |
| R-ENG-04 | `@supabase/ssr` (or an equivalent) is adopted without Tiger/Product Owner visibility, and is later found to conflict with an unstated preference or constraint | Low likelihood (small, standard, first-party package) / Low-Medium impact if it happens | Flagged explicitly in Section 9 before Workstream 0 begins, rather than added silently mid-implementation |
| R-ENG-05 | The ~185 undrafted Functional Requirements (OQ-018) turn out, once drafted, to require a field or validation rule this schema does not accommodate | Medium likelihood given the scale of the gap / Low-Medium impact per instance (an additive migration, not a redesign, given the schema's deliberately generous/flexible field choices — e.g. Journey's `operational_stage` free-form-but-enumerated field, Data Architecture's explicit design-for-this) | No action needed now — Architecture already designed for this (Domain Model §6); Engineering should keep additive-migration discipline (Project Instructions §26) so a later FR-driven field addition never requires a destructive schema change |
| R-ENG-06 | Concurrent claim race condition — two Workspace Users claim the same unclaimed Journey Planning Record/Journey/Task at effectively the same moment | Low likelihood (internal team tool, bounded concurrency) / Medium impact if it occurs (silently overwritten ownership) | Implement Claim as a conditional `UPDATE ... WHERE owner_id IS NULL` (or the RPC equivalent), not a read-then-write from the application layer, so the database itself resolves the race; add this as an explicit `verify:*` case |
| R-ENG-07 | Workstream 7's Vercel Cron endpoint is reachable by anyone who guesses the URL if the Cron-secret check is implemented incorrectly (it is authenticated differently from every other route — by a secret header, not a Workspace User session) | Low likelihood / Medium impact (an unauthenticated caller could trigger threshold-notification generation early, not a data-exposure risk since the endpoint only reads/writes `workspace_*` tables via the same service-layer functions any authorised path would use) | Follow the exact pattern Integration Architecture §5 specifies (Vercel Cron secret header check before any service-layer call); add an explicit "call without the secret header" negative test |

No risk above rises to a Genuine Blocker as defined in Section 3 — each has a concrete, already-specified mitigation that fits inside the workstream sequencing in Section 5.

---

## 8. Engineering Dependencies

### 8.1 Internal Dependencies (within this repository)

| Dependency | Direction | Nature |
|---|---|---|
| `web/lib/journey-leads` (`journey_passport_leads` table) | SMV Workspace **reads**, never writes | Lead ingestion adapter (WS-Eng-2/3), read-only, via existing `service_role` access pattern — Integration Architecture §2.1 |
| `geo_places`/`geo_aliases` (WS1 Bootstrap Generator) | SMV Workspace **reads**, never writes | Destination Profile's nullable `geo_place_id` reference (WS-Eng-6) — Integration Architecture §2.2 |
| `web/lib/journey-leads/validation.ts`'s mobile-normalisation logic | SMV Workspace **reuses**, does not reimplement | BR-001 mobile-number matching (WS-Eng-2), per Project Instructions §18 (prefer extension over parallel implementation) |
| `web/lib/journey-passport-otp/repository.ts`'s RPC-invocation pattern | SMV Workspace **follows the same shape** | Precedent for the BR-012 conversion RPC (WS-Eng-4) and any other multi-row atomic operation |
| `web/lib/journey-leads/email.ts`'s Resend direct-REST pattern | SMV Workspace **reuses, conditional on OQ-008** | Any future Workspace outbound notification email — additive, not required for Release 1.3 completion as currently scoped |

### 8.2 External Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Supabase Postgres | Existing, extended | Same project, new `workspace_*` schema — no new vendor |
| Supabase Auth | Existing platform capability, newly activated | Already part of the existing Supabase project; no new vendor, no new cost tier expected at this user scale (an internal team tool, not a public-facing auth workload) — Tiger/Product Owner should confirm this assumption holds at the actual Supabase plan tier in use, since this review does not have visibility into current plan/usage limits |
| `@supabase/ssr` (and/or `@supabase/supabase-js`) | **New npm dependency** | Flagged in Section 9 |
| A UI component/data-grid library (`FCR-023`) | **New npm dependency, not yet selected** | Flagged in Section 9 and Section 7 (R-ENG-03) |
| Resend | Existing, reused | Conditional on OQ-008; no action needed unless/until confirmed |
| Vercel Cron | Existing platform feature, newly used | No new vendor; requires `vercel.json` (Section 6.1) |
| Vercel (deployment) | Existing, unchanged | Single project, no change |

### 8.3 Infrastructure Dependencies

- **Supabase Auth must be enabled/configured on the project's Supabase dashboard** (outside this repository) before any code in Workstream 1 can be meaningfully tested end-to-end — an operational/account-configuration step, not a code dependency, and outside Rad's repository-only authority. Flagged for Tiger/Product Owner awareness as a parallel-track action item, not a coding blocker (Workstream 0 does not require it).
- **A Vercel Cron schedule must be added to the Vercel project configuration** (via `vercel.json`, committed with Workstream 7) — no separate infrastructure action needed beyond the file itself, since Vercel Cron is declared in-repository.
- **No new environment/region/scaling infrastructure is required** — Architecture Discovery §8 confirms Postgres/Supabase already scales adequately for this workload.

---

## 9. Product Owner / Tiger Clarifications Required

Restated from Section 1, with the explicit test this EBC requires ("List only genuine blockers. Do NOT ask questions already answered by repository documentation.") applied to each:

1. **Confirm Rad may create the three new directories in Section 6.3** (`web/lib/workspace/`, `web/app/workspace/`, `web/app/api/workspace/`) as part of Workstream 0. This review's own assessment (Section 6.3) is that the answer is already "yes" by virtue of the ratified Architecture baseline — this item is surfaced for the same reason Archie surfaced the `docs/20-Architecture/workspace/` folder despite an equally clear answer: this project's own convention treats new-folder creation as worth a visible confirmation, not a silent assumption. **This does not block Workstream 0 from starting** — the recommendation in Section 6.3 is to proceed, with this item serving as the visible record of that judgement call rather than a gate.
2. **Confirm the addition of `@supabase/ssr` (and/or `@supabase/supabase-js`) as a new npm dependency**, per Project Instructions §21's "new dependencies require Archie's assessment and project-owner approval." Section 4.2 gives Rad's engineering rationale (the standard, first-party, minimal-dependency path to implement the already-approved Supabase Auth decision) and Section 7 (R-ENG-04) names the risk of proceeding without this visibility. **Recommended resolution:** a lightweight Archie sign-off, not a full architecture review, since the underlying capability (Supabase Auth) is already approved — only the specific SDK choice is new information.
3. **`FCR-023`'s UI component/data-grid library selection** needs an owner and a decision timeline. It is already logged in `FUTURE-CONSIDERATIONS.md` with a suggested review timing ("before Rad begins implementation of the first SMV Workspace queue-view screen") — this review restates it with a concrete trigger point (partway through Workstream 2, ahead of Workstream 3) so it does not silently slip past its own suggested timing. **This does not block Workstream 0 or Workstream 1.**

No other question is raised. Every remaining Open Question (OQ-008, OQ-012, OQ-014, OQ-018, OQ-020, OQ-021, OQ-022) already has a non-blocking architectural treatment this plan builds against as specified (Architectural Decisions §3–§4), and this review found no repository evidence contradicting any of them.

---

## 10. Engineering Readiness Certification

- [x] Complete repository review performed — Section 2, verified by direct inspection, not assumed from the Architecture package's own description of the codebase.
- [x] Product Specification, RTM, Business Lifecycle and UX Design Brief understood — Section 0/2.8.
- [x] All six UX Architecture documents understood — Section 0/2.8, screen inventory cross-referenced directly against the implementation plan (Section 5.2).
- [x] All six Architecture documents understood and treated as the implementation baseline — Sections 3–6.
- [x] Implementation strategy proposed — Section 4.
- [x] Implementation sequencing proposed and justified — Section 5.
- [x] Repository impact identified, including every new file, every touched file, and every new folder (flagged per Repository Governance, not created) — Section 6.
- [x] Technical risks identified with named mitigations — Section 7.
- [x] Engineering dependencies (internal, external, infrastructure) identified — Section 8.
- [x] Genuine Product Owner/Tiger clarifications isolated from implementation-sequencing detail — Section 9 (three items, none blocking).
- [x] No production code written. No React component created. No database migration created. No source file modified. No repository folder created.

**Certification: Engineering (Rad) may begin implementation of the complete, ratified WS11 Architecture baseline, starting with Workstream 0 (Section 5), without awaiting resolution of any item in Section 9.**

The three items in Section 9 should be resolved in parallel with Workstream 0/1 (not sequentially before them) — none gates the start of engineering work, consistent with this review's overall finding that no genuine blocker exists.

## 11. Engineering Governance Clarifications (Addendum)

Added in response to three Product Owner/Tiger governance questions raised on review of this document's v1.0. No prior section of this document is changed by this addendum; nothing here reopens a Product, UX or Architecture decision, and no repository folder has been created — the folders discussed below remain proposed only, pending the confirmation this section requests.

### 11.1 Repository Structure — the Three Proposed Folders

The Product Owner's stated repository principle — *"All Workspace implementation shall remain encapsulated within the dedicated Workspace implementation boundary and shall not introduce Workspace business logic into existing public website modules unless explicitly approved by the Product Owner"* — is accepted as the governing constraint for everything below. Each of the three folders exists, in this review's assessment, specifically **because** it is the structural mechanism that satisfies this principle; none is a convenience choice.

**Folder 1 — `web/lib/workspace/`**

| | |
|---|---|
| Exact path | `web/lib/workspace/` (with one subdirectory per module beneath it: `shared/`, `dashboard/`, `journey-planning/`, `journey-workspace/`, `traveller-hub/`, `itinerary-studio/`, `destination-intelligence/`, `vendor-management/`, `settings/`) |
| Purpose | Houses every line of Workspace business logic (repository/service/validation/types/client code), one module per subdirectory, following the existing five-file convention |
| Why existing structure is insufficient | `web/lib/` today contains five public-site feature modules (`journey-leads`, `journey-passport-otp`, `geo-validation`, `journey-director`, `traveller-stories`) as flat siblings directly under `web/lib/`. Adding nine Workspace modules as further flat siblings at that same level would place internal, staff-only business logic in the identical, undifferentiated location as public-site business logic — with no directory-level signal distinguishing the two. That is the exact outcome the Product Owner's encapsulation principle rules out. |
| Necessitating document | Solution Architecture §4 (Module Boundaries diagram, showing `web/lib/workspace/` as the container for all nine modules) and AD-WS11-004 (module boundary decision, part of the ratified Architecture baseline) |
| Mandatory or preferred | **Mandatory.** It is the direct, already-ratified implementation of AD-WS11-004, and this review did not find any alternative location that both matches the ratified module list and keeps Workspace code visibly separate from public-site code. |

**Folder 2 — `web/app/workspace/`**

| | |
|---|---|
| Exact path | `web/app/workspace/` (real URL path segment `/workspace/**`, not a route group — **provisional**, pending the Architecture package update described in the naming note below) |
| Purpose | The new, session/role-gated route segment holding all 43 Workspace screens (Screen Inventory §2–§10) |
| Why existing structure is insufficient | Every existing route under `web/app/` (`destinations`, `journey`, `journey-passport`, `experiences`, etc.) is public and anonymous; the repository has no session-gated route today (`web/middleware.ts` does not exist). Placing Workspace screens inside or alongside an existing public route subtree would make it structurally possible for Workspace-only code to be reached without the authentication boundary, or for public-site code to accidentally depend on Workspace-only logic — again, precisely what the encapsulation principle is written to prevent. |
| Necessitating document | Solution Architecture §2 (overall architecture diagram — "SMV Workspace Surface," a named, separate subtree of `web/app/`) and §6 (server/client boundary); AD-WS11-001 (new route segment within the existing application, not a second application) |
| Mandatory or preferred | **Mandatory.** AD-WS11-001 already rejected the only structural alternative (a second Next.js application) as disproportionate; a route segment is the one remaining way to give 43 authenticated screens a clean, single-point authentication boundary without a second deployable. |

*Naming note, updated in v1.2 per Product Owner direction (Section 12): Architecture Discovery §12 names this segment `web/app/(workspace)/...` (a route group — no URL segment) in one place, while the Solution Architecture diagram, its own §6, and the Integration Architecture's API example consistently use `web/app/workspace/**` (a real path segment) elsewhere. This is logged strictly as an Architecture observation, not resolved by Engineering. The Architecture package will be updated to fix a single canonical convention before implementation of this route segment begins, and Engineering will build to whichever convention that update specifies. The v1.1 recommendation previously stated here has been withdrawn. Flagged again here only because it directly affects Folder 2's exact path above, which is provisional until that update is issued.*

**Folder 3 — `web/app/api/workspace/`**

| | |
|---|---|
| Exact path | `web/app/api/workspace/` |
| Purpose | New API Route Handler namespace for every Workspace write operation (claim, advance stage, record a Vendor Confirmation, the BR-012 conversion, etc.), one Route Handler per mutation-shaped operation |
| Why existing structure is insufficient | `web/app/api/journey-passport/**` already exists as a distinct namespace for a different feature's writes. Nesting Workspace's mutation endpoints inside it would misattribute them to Journey Passport in the codebase and — more materially — would make it impossible to apply one uniform "this entire namespace requires an authenticated Workspace session" rule at the namespace level, which is exactly how Integration Architecture §4 specifies the API boundary should work ("every route under `/api/workspace/**` requires an authenticated session"). |
| Necessitating document | Integration Architecture §4 (API Boundary) and Solution Architecture §6 (writes performed through API Route Handlers) |
| Mandatory or preferred | **Mandatory**, for the same namespace-level-authentication reason. The exact number and naming of individual route files beneath it is Rad's own implementation detail and is not fixed by this review. |

**Confirmation:** no folder will be created until the Product Owner provides approval. This section is provided so that approval can be given (or withheld, or redirected) with full visibility of purpose and necessity, consistent with the encapsulation principle stated above. No Workspace business logic is proposed to be added to any existing public-site file, module, or route at any point in this plan.

### 11.2 `@supabase/ssr` — Dependency Due Diligence

| Question | Answer |
|---|---|
| Is it the officially recommended package from Supabase for Next.js? | **Yes.** Supabase's own Server-Side Rendering documentation states the package was built by Supabase specifically for this purpose, and its adoption is recommended there. It is the direct, Supabase-authored successor to the `@supabase/auth-helpers-*` packages, which Supabase's own changelog states are "no longer supported by the team." |
| Is it actively maintained by Supabase? | **Yes.** It lives in the `supabase` GitHub organisation (not a third party), with 127+ commits, a latest release (v0.12.0, June 2026) among 60+ total releases, written in TypeScript, with ongoing releases continuing since. |
| Is it open source and free for our intended usage? | **Yes.** MIT licence, published on the public npm registry. It is a client library, not a hosted service — it talks to the Supabase project we already operate, using the credentials that project already issues. There is no separate account, subscription, or paid tier associated with the package itself. |
| Does it introduce any additional runtime services, licensing obligations, or commercial commitments beyond the already-approved Supabase platform? | **No new service, no new vendor, no new billing line.** It is a thin wrapper around `@supabase/supabase-js` (which becomes a transitive dependency) whose only job is correct cookie-based session handling for a server-rendered framework — the exact gap Data Architecture §4.4 leaves open as "an implementation detail within the 'use Supabase Auth' decision." One point disclosed plainly rather than glossed over: as of Supabase's own most recent public roadmap statement, the package has not yet reached a 1.0.0 stable release (it remains on a 0.x version), and Supabase's own changelog states pre-1.0 minor releases may include breaking changes, with a 1.0.0 release described as coming "in the coming months" as of that changelog. This is a normal characteristic of an actively-developed official package, not a defect — the fully deprecated predecessor is the only alternative to accepting it — but it does mean Engineering may need to apply a minor-version upgrade at some point during Workstream 0/1, at no cost and introducing no new vendor risk beyond the Supabase Auth decision already approved under AD-WS11-002. |
| Is there a technically equivalent alternative that should reasonably be considered? | Two were assessed and rejected: (1) **`@supabase/auth-helpers-nextjs`** — Supabase's own predecessor package, explicitly deprecated and no longer supported by Supabase itself; not a reasonable choice today. (2) **`@supabase/server`** — a separate, newer package in the same Supabase GitHub organisation, but built for stateless, header-based auth in Edge Functions, Workers, and specific backend framework adapters (Hono, Nuxt/H3, Elysia, NestJS); it has **no Next.js adapter** and is not what Supabase's own documentation points to for a Next.js App Router application — not applicable to this stack. A third option, hand-writing cookie/session-refresh logic directly against Supabase's Auth REST API (extending this repository's existing "raw `fetch`" convention rather than adopting any SDK), was also considered and rejected: it would mean re-implementing, in-house, the cookie-refresh and edge-case handling that Supabase's own team has iterated on across multiple release cycles, for no benefit and materially higher risk of a session-handling bug. |

**Recommendation:** adopt `@supabase/ssr` (with `@supabase/supabase-js` as its underlying dependency) as the one new npm dependency for this Feature. It is free, MIT-licensed, published and maintained directly by the vendor already approved for this platform, and is the only package that both exists for this purpose and fits this specific stack (Next.js App Router). The pre-1.0 versioning caveat above is disclosed for the record, not as a reason to prefer an alternative — there is no better-positioned alternative for this stack today.

*Sources consulted: [Supabase Server-Side Rendering guide](https://supabase.com/docs/guides/auth/server-side), [supabase/ssr on GitHub](https://github.com/supabase/ssr), [supabase/ssr updates and roadmap towards v1.0.0](https://supabase.com/changelog/27037-supabase-ssr-updates-and-roadmap-towards-v1-0-0), [supabase/server on GitHub](https://github.com/supabase/server).*

### 11.3 FCR-023 — Engineering Trigger Clarification (Not a Library Selection)

No library is recommended in this section, per the Product Owner's explicit instruction. This section answers only the question asked: when does the decision become necessary, and what happens if it is delayed.

- **At what implementation milestone does a UI component library become necessary?** Not at Workstream 0 (foundational scaffolding) or Workstream 1 (authentication/RBAC mechanism, Personal Preferences screen) — both can be built with this repository's existing plain Tailwind CSS utility classes, exactly as every current public-site screen is. The trigger point is the **first genuinely dense, multi-record, filterable/groupable queue-board screen** — concretely, **JP-01 "Journey Planning Queue"** (Workstream 3 in Section 5's sequencing), the first screen in the Screen Inventory requiring records grouped by lifecycle stage, filterable by owner/destination, with an inline claim action per row.
- **Can Engineering begin implementation without selecting a library?** **Yes.** Workstream 0, Workstream 1, and the simpler list screens early in Workstream 2 (Traveller Search/List — TH-01; Vendor Directory — VM-01, both closer to a plain filterable list than a queue board) do not depend on this decision at all. A library choice is needed before Workstream 3 begins, not before Engineering begins.
- **Which specific Workspace capabilities create the need?** Multi-column, filterable/sortable queue boards with inline actions (JP-01, JW-01 Active Journeys Queue, VM-04 Vendor Confirmations Queue); dense record-detail views carrying many fields across contextual tabs (JP-02–JP-09, JW-02–JW-08); and any in-place tabular editing (e.g. Itinerary Studio's day-by-day itinerary editor, IS-03). The simpler library/list screens (TH-01, VM-01, IS-01 Master Itinerary Library, DI-01 Destination Profile Library) do not themselves require it and could proceed with a hand-rolled list if the decision were delayed further — though delaying past Workstream 3's start is not recommended, for the reasons below.
- **What risks exist if Engineering delays the decision?** (1) Rad would otherwise hand-roll a bespoke table/queue-board component for JP-01 under implementation time pressure, which then either has to be discarded and rebuilt once a library is eventually chosen (pure rework cost), or quietly becomes the de facto standard for every subsequent screen without ever having been an approved decision — the specific outcome the Product Owner's instruction is designed to prevent. (2) Accessibility, keyboard-navigation and reduced-motion requirements (Project Instructions §23) are materially harder to retrofit onto a hand-rolled table after several screens already depend on its shape than to satisfy from the start with a library built for them. (3) Eight further Operational screens and several Knowledge-module list screens all inherit whatever pattern JP-01 establishes, so a rushed or wrong choice compounds across roughly 30 remaining screens rather than staying contained to one.

**Commitment:** when Workstream 2 is partway complete (ahead of Workstream 3's start), Rad will bring a full recommendation in the format requested — recommended library, alternatives considered, licensing implications, maintenance considerations, accessibility considerations, bundle-size/performance considerations, and reasons for the recommendation — as its own Product-Owner-approved decision. No UI component library will be added to `web/package.json` before that approval.

## 12. Product Owner Decision Record — Engineering Planning Approval

Recorded on review of this document's v1.1. This section is a record of decisions already made by the Product Owner; it does not itself make any new decision.

| Item | Decision |
|---|---|
| Repository Structure — `web/lib/workspace/`, `web/app/workspace/`, `web/app/api/workspace/` (Section 11.1) | **Approved.** All three folders are confirmed mandatory to preserve the encapsulation boundary between the public website and SMV Workspace. Rad may create them as part of Workstream 0. |
| Route-segment naming (`workspace/` vs `(workspace)/`) (Section 6.4, 11.1) | **Not resolved by Engineering.** Logged as an Architecture observation only. The Architecture package will be updated to establish a single canonical convention before implementation of this route segment begins; Engineering implements whichever convention that update specifies. |
| `@supabase/ssr` dependency (Section 11.2) | **Approved** as an Engineering dependency, on the basis of Rad's confirmation that it is the officially recommended Supabase package for Next.js, actively maintained, MIT licensed, free for SMV's intended usage, and introduces no additional vendor, licensing or commercial commitment beyond the already-approved Supabase platform. No further Product approval is required for this dependency. |
| FCR-023 — UI component library (Section 11.3) | **Approved** as a governance approach, not as a library selection. Engineering may proceed without a UI component library. The decision point is immediately before implementation of JP-01 — Journey Planning Queue, at which point Engineering will present a separate evaluation covering: recommended library, alternatives considered, licensing implications, accessibility considerations, performance considerations, maintenance considerations, and engineering recommendation. No UI component library is approved at this time. |
| Engineering-phase terminology (Section 5) | Clarified, not a decision: the `WS-Eng-0` through `WS-Eng-8` labels are internal Engineering implementation phases within the single Release Workstream WS11, and are not Release Workstream identifiers. |

**Engineering Planning Approval:** subject only to the terminology clarification above (Section 5) and the reframing of the naming point as an Architecture observation (Section 6.4, 11.1) — both incorporated in this v1.2 — the Product Owner approves the Engineering Planning and Implementation Strategy. No further Product, UX or Architecture decisions remain outstanding for this planning phase. Engineering (Rad) is authorised to begin implementation of Workstream 0 (Section 5).

---

*Prepared by Rad (Engineering and Implementation Specialist) on behalf of Team Satvi, per `EBC-R1.3-WS11-006`.*
*This document is an engineering planning and readiness deliverable only. It introduces no Product, UX or Architecture decision, redesigns nothing already approved, and modifies no repository file. Success Criteria confirmed: the complete repository was reviewed; the Product, UX and Architecture baselines were understood; an implementation strategy and justified sequencing were proposed; repository impact and genuine Product Owner decisions were identified; no production code was written.*
