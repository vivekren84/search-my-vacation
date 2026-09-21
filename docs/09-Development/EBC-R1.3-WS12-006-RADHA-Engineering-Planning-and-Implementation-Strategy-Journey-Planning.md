# Search My Vacation

# EBC-R1.3-WS12-006 — Journey Planning Engineering Planning & Implementation Strategy

**Persona:** Radha — Senior Software Engineer, Engineering Lead
**Release:** 1.3
**Workstream:** WS12 — Journey Planning (first Workspace Business Module)
**Phase:** Engineering Planning & Implementation Strategy (no production implementation)
**Status:** Engineering Planning Complete — ready for Tiger/Product Owner sign-off on the three flagged Proposed architecture decisions, then WS12-007 (Engineering Implementation)
**Date:** 21 September 2026

---

## 0. Repository Readiness Check (Mandatory Execution Gate — Project Instructions §14/§15)

| Check | Result |
|---|---|
| Repository access confirmed | **Yes.** Folder `/Users/viveksophu/Documents/Projects/SearchMyVacation` connected this session via the device bridge (folder access was not yet granted at session start; requested and granted before any repository activity) |
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed |
| Current Git branch | `main` |
| Working tree (read-only review) | **Clean.** `git status` returns "nothing to commit, working tree clean." Branch is **8 commits ahead of `origin/main`** (unpushed) — pre-existing state, not created by this card, not pushed by this card (Project Instructions §26) |
| Destination folder | `docs/09-Development/` exists and holds every prior WS11/WS12 EBC in this workstream |
| Destination filename | `docs/09-Development/EBC-R1.3-WS12-006-RADHA-Engineering-Planning-and-Implementation-Strategy-Journey-Planning.md` — does not yet exist; this card creates it |
| Workspace implementation reviewed | `web/app/workspace/**`, `web/components/workspace/**`, `web/lib/workspace/**`, `web/hooks/*.ts` — inspected directly, read-only (Section 2) |
| Supabase migrations reviewed | `supabase/migrations/` — 10 files, all read (Section 2.3) |
| Authentication implementation reviewed | `web/lib/workspace/shared/auth/*` — read in full (Section 2.2) |
| RBAC implementation reviewed | `web/lib/workspace/shared/rbac/*` — read in full (Section 2.2) |
| Repository First applied | Every claim below about shipped code, shipped schema, or shipped RBAC state was verified by direct inspection this session, not assumed from WS12-005's own description of it |

---

## 1. Inputs Consumed (Mandatory)

**Journey Planning workstream — all four prior cards read in full this session:**

- `EBC-R1.3-WS12-001` (Tiger) — Workstream Initiation & Scope Definition: business vision, the enquiry → planning → journey bridge, stakeholder analysis, Workspace Foundation dependency (confirmed satisfied).
- `EBC-R1.3-WS12-002` (Arjun) — Business Domain Discovery, including the second continuation's three Product Owner ratifications: **Decision 1** (Proposal Model — Proposal primary, Proposal Version its revision history, Vendor Quotation a distinct supplier-owned object), **Decision 2** (Journey Planning Entry Model — eight origin channels, Mandatory Association, Duplicate Prevention), **Decision 3** (Single Business Object Principle — Journey canonical, no duplication, no reopening).
- `EBC-R1.3-WS12-003` (Arjun) — Business Analysis & Functional Requirements: the seven-stage lifecycle with entry/exit criteria and Allowed/Invalid Transitions (§5), the full Business Object Catalogue (§6), all 30 approved Functional Requirements `FR-JP-01`–`30` (§7), Business Rules (§8), Validation Rules (§9), Permissions (§10), Notifications (§11), Search (§12), Audit (§13), Reporting Requirements (§14), Exception Scenarios (§15), Integration Points (§17), Open Questions (§20).
- `EBC-R1.3-WS12-004` (Sophie) — UX Design & User Experience Specification: 13 screens/panels (`JP-01`–`JP-13`), 11 interaction flows (§8.1–8.11), Information Architecture, the reused-component catalogue (§11, including three genuinely new component groups and the confirmation that none requires a new dependency), responsive behaviour, and the two inherited Open Items (`OQ-A` traveller communication channel, `OQ-B` Corporate Point of Contact ownership, both handed to Architecture).
- `EBC-R1.3-WS12-005` (Archie) — Solution Architecture: this is this card's **primary, authoritative technical input**. In particular: the module structure (§5.1), the presentation route map (§5.2), the corrected Proposal/Proposal Version two-table model (§6.2, `AD-WS12-002`), the Bootstrap Table decision for Traveller/Vendor/Journey (§6.4, `AD-WS12-001`), the Corporate Point of Contact ownership resolution (§6.6, `AD-WS12-003`), the one-way conversion RPC design (§6.5), the full data architecture including key constraints and RLS (§7), the API route list (§8.4), the application service function list (§9), the RBAC extension requirement (§10.2), the error-handling convention (§12), and the six Architecture Risks (§13) — three of which (`R-AR-1`, `R-AR-6`, and the engineering-sequencing note in §7.2) are addressed directly by this plan's sequencing (Section 12/18).

**Workspace Foundation (WS11) — engineering precedent:**

- `EBC-R1.3-WS11-006` (Rad) — the Workspace-wide Engineering Planning & Implementation Strategy. This card follows its own established conventions directly rather than inventing new ones: the five-file module pattern, the `WS-Eng-N` phase-labelling convention (here relabelled `WS-Eng-JP-N` to avoid collision with WS11's own phase numbers, since both sit inside different Release Workstreams), the Repository Impact Assessment format, the Technical Risk register format, and the "flag new folders/dependencies for visibility, don't block on them" governance pattern established there and ratified by the Product Owner (its own §12, Product Owner Decision Record).
- `EBC-R1.3-WS11-007` and its continuations (`-007A` through `-011I`) — read for what actually shipped (cross-checked directly against the repository in Section 2, not taken on the reports' word alone).

**Repository inspection (this session, read-only) — the actual shipped state:**

- `web/app/workspace/**` — confirmed: `layout.tsx` (bare, unauthenticated shell for `sign-in`/`reset-password`), `sign-in/`, `reset-password/`, and a `(dashboard)` route group whose `layout.tsx` calls `requireWorkspaceUser()` and renders `WorkspaceShell`. Every module page under `(dashboard)`, including `journey-planning/page.tsx`, is a one-line `<ComingSoon moduleName="..." />` — confirmed by direct read. **Journey Planning has zero business logic today.**
- `web/lib/workspace/shared/{rbac,auth,supabase}/*`, `types.ts`, `constants.ts` — read in full. Confirms exactly what WS12-005 described: `rbac/roles.ts` (two roles, `describeWorkspaceRoleLabel()` mapping `privilege_user` → "Workspace User" in product-facing copy only); `rbac/permissions.ts` (`hasWorkspaceCapability()` — a single-argument, role-only stub returning `true` only for `administrator`, with its own comment confirming it is deliberately temporary "until the screen implementing it defines... its actual capability"); `rbac/guard.ts` (`requireWorkspaceUser()`, already reused by the dashboard layout); `auth/service.ts` (`getWorkspaceAuthState()`, a three-state discriminated union — `unauthenticated` / `unauthorized` / `ok` — already the shape a Journey Planning Server Component can call directly).
- `web/components/workspace/{layout,navigation,dashboard,shared}/*` — confirmed shipped: `WorkspaceShell`, navigation, dashboard cards, and `ComingSoon`/`EmptyState` under `shared/`. `ComingSoon` is the exact placeholder Journey Planning's route currently renders and the one this workstream's first commit replaces.
- `supabase/migrations/` — **10 files**, confirmed by direct listing. Exactly **one** is `workspace_`-prefixed: `20260916090000_workspace_users_and_roles.sql`, read in full (Section 2.3). **No `workspace_journeys`, `workspace_travellers`, `workspace_vendors`, `workspace_audit_log`, `workspace_notifications`, `workspace_tasks`, `workspace_follow_ups`, or any Journey-Planning-owned table exists.** This confirms WS12-005 §1's finding independently and is the single fact that most shapes this plan's Phase 1 (Section 12).
- `web/package.json` — confirmed: Next.js `16.2.10`, React `19.2.4`, TypeScript `5`, Tailwind `4`. Dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `libphonenumber-js`, `next`, `react`, `react-dom` only. **No ORM, no schema-validation library, no UI component/data-grid library, no state-management library.** `npm run verify:*` convention confirmed live (nine `tsconfig.<feature>-verification.json` files under `web/`) — this is the repository's substitute for a conventional test runner, extended by every module to date rather than replaced.
- `web/lib/journey-leads/` — confirmed as the mature five-file-plus-validation-subfolder precedent (`client.ts`, `email.ts`, `rate-limit.ts`, `repository.ts`, `service.ts`, `types.ts`, `validation.ts`, `validation/`) this plan's module structure (Section 8) extends.
- `docs/10-Backlog/RELEASE-1.3.md` — WS12's Master Workstream Tracker row confirmed still `🔒 Reserved`, **not** `In Progress`, as of this session — WS12-005 also found this; it remains a Tiger governance action, not something this card or WS12-005 resolves (Section 20).
- `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` — `FCR-023` (no UI component/data-grid library selected) confirmed still **Deferred**, with its own suggested review timing: "before Rad begins implementation of the first SMV Workspace queue-view screen." **Journey Planning's `JP-01` Queue is that screen** (Section 14, Section 19).
- `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` — `PEB-001` (Journey Amendment) confirmed as a hard scope boundary this plan respects: Journey Planning's conversion is one-way; no amendment capability is built here.

No referenced artefact was found missing. No conflict was found between the Business Analysis, the UX Specification and the Architecture baseline that Architecture itself had not already disclosed and resolved or deferred (WS12-005 §1). This card raises exactly one new, previously-undisclosed engineering-level finding of its own (Section 15, `R-ENG-JP-08`, the Traveller Itinerary reference boundary) and otherwise sequences, rather than reinterprets, what WS12-002 through WS12-005 have already decided.

---

## 2. Current Repository Assessment

### 2.1 Application Structure (as it bears on Journey Planning)

Single Next.js 16.2.10 App Router application (`web/`). The Workspace surface lives entirely under `web/app/workspace/**`, `web/lib/workspace/**`, and (once created) `web/app/api/workspace/**` — a structurally separate subtree from the public site, per the encapsulation principle WS11-006 §11.1 already established and ratified (Product Owner, `EBC-R1.3-WS11-006` §12). Journey Planning adds no exception to this boundary.

```
web/app/workspace/
  layout.tsx                  — bare shell for sign-in/reset-password (unauthenticated)
  sign-in/, reset-password/
  (dashboard)/                — route group, adds no URL segment
    layout.tsx                — requireWorkspaceUser() + WorkspaceShell
    itinerary-studio/page.tsx         — ComingSoon
    traveller-hub/page.tsx            — ComingSoon
    destination-intelligence/page.tsx — ComingSoon
    journey-workspace/page.tsx        — ComingSoon
    vendor-management/page.tsx        — ComingSoon
    journey-planning/page.tsx         — ComingSoon  ← this workstream replaces this subtree
```

### 2.2 Shared Foundation — What Exists, What Journey Planning Is First to Need

| `shared/` concern | State | Consequence for this plan |
|---|---|---|
| `rbac/roles.ts`, `guard.ts` | Shipped, functioning | Reused unmodified |
| `rbac/permissions.ts` | Shipped **as a deliberate stub** — `hasWorkspaceCapability(role)`, single-argument, role-only | Journey Planning is the first module needing **record-scoped** authorisation (an Owner-vs-not-Owner distinction `hasWorkspaceCapability()` cannot express). This is Architecture's own finding (WS12-005 §10.2) and this plan's Phase 1 implements the extension it specifies (Section 8.2). |
| `auth/*`, `supabase/*` | Shipped, functioning | Reused unmodified |
| `shared/audit` (`workspace_audit_log`) | **Approved in WS11 design, never migrated, no module exists** | Journey Planning is the first consumer. First-time migration and a thin `shared/audit` writer module both fall into this workstream's Phase 1 (Section 12), not into a future workstream, exactly as WS12-005 §7.2 disclosed as an engineering-sequencing note rather than an architecture decision. |
| `shared/notifications` | **Approved in WS11 design, never migrated, no module exists** | Same as audit — Journey Planning is first consumer; scaffold in Phase 1, full trigger wiring in a later phase once real events exist to fire against (mirroring WS11-006's own WS-Eng-0/WS-Eng-7 split, Section 12). |
| `shared/ownership` (Claim/Assign/Reassign column/helper set) | **Approved in WS11 design (Generic Ownership Model), never built as a shared helper** | Journey Planning is first consumer; a small, genuinely shared helper (not duplicated per-module logic), Phase 1. |
| `workspace_tasks`, `workspace_follow_ups` | **Approved in WS11 design, never migrated** | Journey Planning is first consumer (`FR-JP-24`/`25`); migrated in Phase 1 alongside the audit/notification tables, since all four are `shared/`-owned regardless of who migrates them first (WS12-005 §7.2). |

This table is this plan's single most consequential finding: **every `shared/` capability Journey Planning's own Functional Requirements depend on (audit, notifications, ownership, tasks, follow-ups) is architecturally approved but has never been built.** Journey Planning's engineering pass is necessarily also the first real build of most of the Workspace's cross-cutting shared layer, not a pure "extend what exists" exercise the way WS11-006's own Workstream 3 (Journey Planning, in that document's *different*, wider-scope numbering) was originally envisioned to be once Traveller Hub and Vendor Management had already landed. This is disclosed here because it changes the true size and sequencing of "Phase 1" relative to what a reader of WS12-005 alone might expect (Section 12, Section 16).

### 2.3 Database — Current State

10 migrations total; 9 pre-date the Workspace (public-site features — Journey Passport, geo validation, etc., unchanged and untouched by this plan). The one Workspace migration:

`20260916090000_workspace_users_and_roles.sql` — creates `workspace_users` (one row per staff account, one-to-one with `auth.users`), the `workspace_current_user_role()` `SECURITY DEFINER` helper (the pattern every future RLS policy call-site reuses), RLS enabled with two `SELECT` policies (own row; Administrator reads all), and an `updated_at` trigger. **No `INSERT`/`UPDATE`/`DELETE` policy exists for `authenticated`** — provisioning is `service_role`-only today, a WS-Eng-1-equivalent gap this plan does not need to close (user provisioning is Foundation scope, already functioning operationally per the WS11 report even though the self-service flow was deferred).

This one migration is the **only** precedent in the repository for: a `workspace_`-prefixed table, a `SECURITY DEFINER` role-lookup helper, and an `authenticated`-role RLS policy pair. Every pattern Architecture's Data Architecture section (WS12-005 §7) specifies for Journey Planning's own ~10 tables extends this file's conventions directly (naming, comment style, `REVOKE`/`GRANT` discipline, trigger-based `updated_at`) — confirmed by direct read, not assumed.

### 2.4 Component/Module Precedent

`web/lib/journey-leads/` (five files plus a `validation/` subfolder) and `web/lib/journey-passport-otp/` (five files) are the two mature precedents for the module shape Journey Planning's own `web/lib/workspace/journey-planning/` will follow (Section 8). Both use hand-written PostgREST `fetch`, a typed `<Feature>RepositoryError` class, and `SECURITY DEFINER` RPC functions for atomic multi-row operations (the OTP send/verify RPCs are the direct precedent for Journey Planning's own conversion RPC, Section 10).

### 2.5 Governance State

WS12 remains `🔒 Reserved` in `RELEASE-1.3.md`'s Master Workstream Tracker (confirmed by direct read this session) — not yet `In Progress`. This is unchanged since WS12-005 also found it so. Moving it to `In Progress` is a Tiger governance action this plan does not perform (Section 20, Recommended Next Workstream).

---

## 3. Implementation Strategy

### 3.1 Overall Approach

Extend, do not fork, exactly as WS11-006 §4.1 already established and as Architecture's own Goal 1 (WS12-005 §2) restates for this module specifically:

- **One application, existing route segment.** `web/app/workspace/(dashboard)/journey-planning/**` replaces the `ComingSoon` stub; no new top-level route pattern.
- **Five-file module convention**, extended with a `validation/` subfolder if field-level validation warrants splitting (mirroring `journey-leads/validation/`), for `web/lib/workspace/journey-planning/`.
- **Server Components for reads, API Route Handlers under `web/app/api/workspace/journey-planning/**` for writes** — no Server Actions, matching the Solution Architecture's server/client boundary (WS12-005 §5.2, §8.4) exactly.
- **No ORM.** Hand-written PostgREST + `SECURITY DEFINER` RPC, matching every existing module and Architecture's own explicit non-introduction of one (WS12-005 §1, package.json review).
- **Additive-only migrations**, `workspace_`-prefixed, one logical unit per file, extending `workspace_users_and_roles.sql`'s own conventions.
- **Extend `shared/rbac`, do not fork it.** The record-scoped capability functions (Section 8.2) live in `shared/rbac`, per Architecture's own module-boundary reasoning (WS12-005 §10.2) — Journey Planning does not grow its own parallel permission file.
- **Extend the existing `npm run verify:*` convention** with Journey-Planning-scoped verification scripts (`verify:workspace-journey-planning`, or split further if warranted, e.g. `verify:workspace-journey-planning-conversion` for the highest-risk RPC in isolation) rather than introducing Jest/Vitest — matching WS11-006 §4.1's own explicit recommendation and Project Instructions §21/§28.

### 3.2 What This Strategy Deliberately Does Not Do

- It does not re-litigate any Product, UX or Architecture decision (WS12-002 through WS12-005) — every one is the adopted baseline this plan sequences against.
- It does not resolve `OQ-A` (traveller communication channel) — Architecture deliberately deferred it (WS12-005 §11, `R-AR-4`) and this plan builds against the Discovery-Notes-as-interim-capture workaround the UX specification already adopted, with no schema decision assuming a future resolution.
- It does not select a UI component/data-grid library (`FCR-023`) — Section 14 restates the existing trigger point rather than pre-empting the decision.
- It does not write migration SQL, Route Handler code, or component code — this is a planning document (Explicit Non-Goals, Section 21).
- It does not resequence or reopen `AD-WS12-001`/`002`/`003` — it treats each as Proposed-pending-sign-off exactly as Architecture left them (Section 4, Section 20).

---

## 4. Engineering Readiness Assessment

**Can engineering begin? Conditionally yes — Phase 1 (Section 12) may start immediately; two items gate Phase 2.**

| Readiness dimension | Finding |
|---|---|
| Product baseline | Approved — 30/30 Functional Requirements drafted and traceable (`WS12-003` §7, §19) |
| UX baseline | Approved — 13 screens, 11 flows, no Architecture or Engineering decision left unaddressed (`WS12-004` §21) |
| Architecture baseline | Complete (`WS12-005`) — but carries **three Proposed decisions** (`AD-WS12-001` bootstrap tables, `AD-WS12-002` Proposal/Version split, `AD-WS12-003` Corporate Point of Contact ownership) that WS12-005 itself recommends receive explicit Tiger/Product Owner sign-off **before Rad begins implementation** (WS12-005, "Recommended Next Workstream" section) — not before Rad begins *planning*, which is this card. |
| Repository state | Confirmed clean of any conflicting Journey Planning code, migration, or dependency (Section 2) |
| Shared foundation state | **Materially thinner than a first read of WS11-006 alone would suggest** (Section 2.2) — audit, notifications, ownership, tasks and follow-ups are all still unbuilt; this shapes Phase 1's real scope |
| Engineering-level unknowns | Four, listed in Section 19 — one repeated from Architecture (`FCR-023`), three new to this pass |
| Governance state | WS12 still `🔒 Reserved`, not `In Progress` (Section 2.5) — a Tiger action, not a Rad blocker to *planning*, but recommended to be resolved before WS12-007 *implementation* commits land |

**Genuine blockers found: none to starting Phase 1.** Two items gate the start of Phase 2 and are escalated, not silently proceeded past (Section 19, Section 20): the three Proposed architecture decisions need sign-off before any table both Phase 1 and Phase 2 depend on is finalised in its exact shape, and the UI library decision (`FCR-023`) needs resolution before `JP-01` (Phase 3) specifically, matching its own long-standing suggested trigger point.

---

## 5. Repository Impact Assessment (No Code Changes — Identification Only)

### 5.1 New Folders

| Path | Purpose |
|---|---|
| `web/lib/workspace/journey-planning/` | Five-file module (types, validation, repository, service, client) |
| `web/lib/workspace/shared/audit/` | New — first build of the shared audit-log writer (Section 2.2) |
| `web/lib/workspace/shared/notifications/` | New — first build of the shared notification emitter scaffold |
| `web/lib/workspace/shared/ownership/` | New — first build of the shared Claim/Assign/Reassign helper |
| `web/lib/workspace/shared/tasks-follow-ups/` | New — first build of the shared Task/Follow-up module (used by, but not owned by, Journey Planning — Architecture's own boundary, WS12-005 §7.2) |
| `web/app/workspace/(dashboard)/journey-planning/**` | Replaces the `ComingSoon` stub with the 10-route subtree (Section 9) |
| `web/app/api/workspace/journey-planning/**` | New API namespace, 8 route groups (Section 10) |

All seven are net-new but sit inside already-approved, already-existing parent directories (`web/lib/workspace/`, `web/app/workspace/`, `web/app/api/`) — none requires the kind of "new top-level directory" visibility check WS11-006 §11.1 needed; that check already covered these parents and was already ratified.

### 5.2 New Files — By Module

| Module | Files |
|---|---|
| `journey-planning` | `types.ts`, `validation.ts` (or `validation/` if split), `repository.ts`, `service.ts`, `client.ts` |
| `shared/audit` | `types.ts`, `repository.ts`, `service.ts` (a writer — `recordAuditEvent()` — no `client.ts` needed, server-only) |
| `shared/notifications` | `types.ts`, `repository.ts`, `service.ts` (`emit()` scaffold, no consumers wired until Phase 6) |
| `shared/ownership` | `types.ts`, `service.ts` (a thin `claim()`/`assign()`/`reassign()` helper set operating generically over any table with `owner_id`) |
| `shared/tasks-follow-ups` | `types.ts`, `repository.ts`, `service.ts`, `client.ts` |
| `shared/rbac` | **Extended, not new** — `permissions.ts` gains the six record-scoped functions (Section 8.2); `roles.ts`/`guard.ts` unchanged |

### 5.3 New Migrations (Additive, `supabase/migrations/`)

One logical unit per file, following `workspace_users_and_roles.sql`'s own convention, sequenced per Section 12:

1. `workspace_audit_log` (+ RLS, `SECURITY DEFINER` writer function if warranted)
2. `workspace_notifications` (+ RLS)
3. `workspace_tasks`, `workspace_follow_ups` (+ RLS) — two tables, one migration, since both are simple and co-designed (WS11 Data Architecture §3)
4. `workspace_travellers`, `workspace_vendors`, `workspace_journeys` (bootstrap shapes, `AD-WS12-001`) — **pending sign-off (Section 4, Section 19)**
5. `workspace_corporate_contacts` (`AD-WS12-003`) — **pending sign-off**
6. `workspace_journey_planning_records` (+ `CHECK`/unique constraints, Section 7.3 below)
7. `workspace_proposals`, `workspace_proposal_versions` (`AD-WS12-002`) — **pending sign-off**
8. `workspace_vendor_quotations`, `workspace_discovery_notes`, `workspace_activities`
9. The conversion `SECURITY DEFINER` RPC (`convert_journey_planning_record_to_journey()` or equivalent name) — its own migration, isolated for review and rollback clarity given its risk class (Section 15, `R-ENG-JP-02`)
10. `shared/rbac` capability-function additions, if any are more naturally expressed as SQL helpers rather than pure TypeScript (a Phase 1/2 engineering-detail decision, not fixed here)

### 5.4 Existing Files Touched

- `web/app/workspace/(dashboard)/journey-planning/page.tsx` — replaced (currently one line, `<ComingSoon />`).
- `web/lib/workspace/shared/rbac/permissions.ts` — extended with six new exported functions (Section 8.2); the existing `hasWorkspaceCapability()` is **not removed** (Section 8.2 notes why).
- `web/lib/workspace/shared/constants.ts` — gains `WORKSPACE_JOURNEY_PLANNING_API_PREFIX` or equivalent, following the file's own established constant-per-concern pattern; the existing `WORKSPACE_JOURNEY_PLANNING_PATH` constant is already present and reused unchanged.
- `web/package.json` — **no new dependency in Phases 1–2.** A UI component/data-grid library is a Phase 3 (`JP-01`) decision, not yet made (Section 14).

### 5.5 Reusable, Unmodified Folders

`web/components/workspace/{layout,navigation}/*`, `web/lib/workspace/shared/{auth,supabase}/*`, `web/lib/workspace/shared/rbac/{roles,guard}.ts` — all confirmed shipped and reused exactly as-is, no modification.

---

## 6. Database Strategy

### 6.1 Migration Ordering Principle

Foundation before Feature: `shared/`-owned tables (audit, notifications, tasks/follow-ups) migrate before any Journey-Planning-owned table that writes to them, and bootstrap tables (Traveller, Vendor, Journey) migrate before Journey Planning's own tables that foreign-key to them — matching the dependency direction Architecture's own module-boundary rule already establishes (WS12-005 §9: "every module depends on `shared/`, never the reverse") and extending it to migration ordering, not only to code.

### 6.2 Bootstrap Entities — Engineering Consequence of `AD-WS12-001`

Architecture's Option 3 (WS12-005 §6.4) means Journey Planning's own migration set contains three tables nominally owned by future workstreams (`WS13`/`WS14`/`WS16`). This plan's engineering consequence, not previously specified by Architecture: **each bootstrap migration's header comment must explicitly state its future-owner workstream and link back to `WS12-005` §6.4**, so a future Archie/Rad pass scoping WS13/14/16 finds the disclosure at the point of highest visibility (the migration file itself), not only in a document they might not think to re-read. This is a documentation-discipline recommendation, not a schema decision — it costs nothing and directly mitigates Architecture's own highest-severity risk (`R-AR-1`).

### 6.3 Future Ownership Transfers

No schema change is anticipated at transfer time beyond additive columns (Architecture's own field-set reasoning, WS12-005 §6.4) — a future WS13/14/16 Archie pass extends these tables' columns and takes over their `repository.ts` ownership, never re-creates them. This plan records the mechanism (additive migration, `repository.ts` ownership handoff) as the expected pattern; it does not schedule when that handoff happens.

### 6.4 RLS and Grants

Extends `workspace_users_and_roles.sql`'s own pattern exactly: `REVOKE ALL ... FROM anon, authenticated` as the default, then narrow `GRANT`/policy pairs. Per Architecture §7.4/§7.5: `workspace_journey_planning_records` and its child objects (Proposals, Vendor Quotations, Discovery Notes, Activities) get broad authenticated-read policies with owner-or-administrator write policies; `workspace_vendor_quotations` gets **no** non-staff grant at any level (`FR-JP-21`, structural enforcement). No `DELETE` grant exists anywhere in this migration set for archive-only object types, matching `AD-WS11-011`'s already-established convention.

---

## 7. Application Architecture Mapping

Direct mapping of Architecture's logical layers (WS12-005 §5) onto file paths — no new layer introduced:

| Architecture layer | Engineering artefact |
|---|---|
| `types.ts` | `JourneyPlanningRecord`, `Proposal`, `ProposalVersion`, `VendorQuotation`, `DiscoveryNote`, `Activity`, `CorporateContact`, `OriginChannel` (8-value union), `LifecycleStage` (7-value union), plus the bootstrap-table shapes (`Traveller`, `Vendor`, `Journey` — minimal fields only, per §6.4) |
| `validation.ts` | Mandatory Association check, origin-channel/stage enum validation, the Section 5.4 (WS12-005) transition table encoded as a lookup structure |
| `repository.ts` | PostgREST calls against every table in Section 5.3 above, including the three bootstrap tables (temporary ownership, disclosed per Section 6.2); no `delete()` export for archive-only types |
| `service.ts` | Business-rule orchestration — see Section 9 (Application Services) below, restated from Architecture §9 with engineering sequencing attached |
| `client.ts` | Thin client-side surface for the seven Client Components the UX spec names (Section 9) |

---

## 8. Component Reuse Analysis

| Category | Reused unmodified | Extended | New |
|---|---|---|---|
| **Shell/Layout** | `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceNav`, `WorkspaceMobileNav`, `WorkspaceUserMenu`, `(dashboard)/layout.tsx`'s `requireWorkspaceUser()` gate | — | — |
| **Empty states** | `EmptyState` (existing `icon`/`action` props) | — | — |
| **Auth/Session** | `auth/service.ts` (`getWorkspaceAuthState()`), `supabase/{server,browser}.ts` | — | — |
| **RBAC** | `roles.ts`, `guard.ts` | `permissions.ts` (Section 8.2, six new functions) | — |
| **Validation** | `libphonenumber-js`-based mobile normalisation from `journey-leads/validation.ts`, per `BR-001`'s existing pattern (reused for Corporate Point of Contact phone fields, Architecture §6.6) | — | — |
| **Error handling** | `<Feature>RepositoryError` class pattern | — | `JourneyPlanningValidationError`, `JourneyPlanningRepositoryError` (Section 11 below, matching Architecture §12) |
| **Services** | `shared/audit`, `shared/notifications`, `shared/ownership` (called, once built in Phase 1) | — | `shared/audit`, `shared/notifications`, `shared/ownership`, `shared/tasks-follow-ups` themselves are new builds (Section 5) |
| **UI components** | Existing Tailwind utility patterns (cards, form fields) from `journey-passport`/public-site conventions where visually applicable | — | Stage badge, origin-channel icon set (8 inline SVGs, no new library), owner avatar chip (extends `WorkspaceUserMenu`'s existing avatar treatment), Association selector, duplicate-check panel, Proposal composer, timeline list item — all confirmed by Sophie (`WS12-004` §11) to need **no new third-party dependency** |
| **Data-dense list/board** | — | — | **Open** — `FCR-023`, Section 14 |

---

## 9. API Planning (Logical Endpoints — No Implementation)

Restating Architecture §8.4 with each route's owning phase attached (Section 12):

| Route | Method | Purpose | Phase |
|---|---|---|---|
| `/api/workspace/journey-planning` | `POST` | Create record (`FR-JP-06`–11) | 2 |
| `/api/workspace/journey-planning/[id]/claim` | `POST` | Claim (`FR-JP-02`/03) | 2 |
| `/api/workspace/journey-planning/[id]/advance-stage` | `POST` | Stage transition (`FR-JP-05`/26) | 2 |
| `/api/workspace/journey-planning/[id]/reassign` | `POST` | Administrator reassignment (`FR-JP-22`) | 2 |
| `/api/workspace/journey-planning/[id]/proposal/versions` | `POST` | Create/revise Proposal Version (`FR-JP-14`–18) | 3 |
| `/api/workspace/journey-planning/[id]/proposal/send` | `POST` | Send action (`FR-JP-16`) | 3 |
| `/api/workspace/journey-planning/[id]/vendor-quotations` | `POST` | Record Vendor Quotation (`FR-JP-19`–21) | 3 |
| `/api/workspace/journey-planning/[id]/decision` | `POST` | Confirm/Lost/Archived, conversion RPC on Confirmed (`FR-JP-27`–30) | 4 |

Every route requires `requireWorkspaceUser()` (already shipped, reused unmodified) — no public surface, matching Architecture §8.4 and the UX spec's own confirmation (§18 there) that Journey Planning has no traveller-facing interface.

---

## 10. Data Access Strategy

- **Server Components** for every read: `JP-01` (queue), `JP-02` (detail overview + tabs), `JP-06`/`JP-07`/`JP-09`/`JP-11` (read-heavy screens) all call `journey-planning/service.ts` directly from the Server Component, matching the Solution Architecture's server/client boundary (WS12-005 §5.2) and the existing `(dashboard)/layout.tsx` pattern.
- **API Route Handlers** for every write — no Server Actions, matching the repository-wide convention (no existing feature uses Server Actions).
- **Supabase** — hand-written PostgREST `fetch`, `SECURITY DEFINER` RPC for the one atomic, multi-table operation (conversion). No ORM.
- **Caching** — none introduced. Server Component reads hit Postgres directly on every request, matching `AD-WS11-005`'s "no new infrastructure at this scale" reasoning, restated by Architecture (WS12-005 §11) and not revisited by this plan.

---

## 11. State Management Strategy

No client-side state-management library is introduced or needed. Client Components requiring local state (the Association selector, the Proposal composer's autosave, the Decision confirmation flow) use React's own `useState`/`useReducer`, matching every existing Client Component in this repository (e.g. `journey-passport`'s OTP entry flow). Autosave (Proposal composer, UX §8.3) is implemented as a debounced `POST` to the Proposal Version endpoint from `client.ts`, not a new state layer.

---

## 12. Validation Strategy

Three tiers, matching Architecture §12 and the existing `journey-leads`/`journey-passport-otp` precedent exactly — no schema-validation library (`zod` or equivalent) introduced, consistent with the repository's established hand-written-validation convention:

1. **Input validation** (`validation.ts`) — field presence, format (mobile numbers via the existing `libphonenumber-js` helper), enum membership (origin channel, stage).
2. **Business validation** (`service.ts`, calling into `validation.ts`) — Mandatory Association (`FR-JP-09`/10), duplicate-prevention lookup (`FR-JP-08`), stage-transition legality (`FR-JP-26`, the Section 5.4 lookup table from Architecture), Proposal singularity (`FR-JP-14`).
3. **Permission validation** (`shared/rbac`, Section 8.2) — the six record-scoped capability functions, called at the top of every `service.ts` mutation function before any write is attempted.

---

## 13. Security Review

- **Authentication** — unchanged, reused (`getWorkspaceAuthState()`, already shipped and functioning).
- **RBAC** — extended per Section 8.2; this is the first genuinely record-scoped (not merely role-scoped) authorisation logic in the codebase, flagged by Architecture (WS12-005 §10.2, §13 `R-AR-3`) as the module's highest security-design-attention item. This plan's mitigation: implement and unit-verify the six functions in isolation (Phase 1, before any route calls them) against synthetic Owner/non-Owner/Administrator fixtures, before Phase 2 wires them into live routes.
- **RLS** — defence-in-depth for the same rules (Section 6.4), matching `AD-WS11-002`'s own stated reasoning ("a single missed application-layer check would otherwise expose cross-user data").
- **Audit** — every mutation (claim, reassign, stage transition, Proposal Version created/sent, Vendor Quotation recorded, decision recorded) writes to `workspace_audit_log` via the new `shared/audit` module, satisfying `WS12-003` §13 in full.
- **Session** — unchanged; no `service_role` key reaches client code (already enforced by the existing `browser.ts`/`server.ts` separation).

---

## 14. Performance Review

- **Scale assumption unchanged** — an internal team tool, matching `AD-WS11-001`/`005`'s own repeated characterisation; this plan introduces no caching layer or read-model on that basis (Section 10).
- **Indexing** — standard B-tree indexes on `current_stage`, `owner_id`, `destination_region`, `origin_channel`, `created_at` on `workspace_journey_planning_records`, supporting the six-dimension filter requirement (`WS12-003` §12) without new infrastructure — restated from Architecture §11, confirmed as sufficient for this scale.
- **`JP-01` queue-scan performance at volume** — flagged by both UX (`R-UX-1`) and Architecture (`R-AR-5`) as unquantified; this plan does not attempt to design against it speculatively, consistent with both prior findings.
- **`FCR-023` (UI component/data-grid library)** — **this plan's one concrete performance-adjacent engineering decision point.** Confirmed still Deferred (Section 2, Section 19), with its own suggested trigger ("before Rad begins implementation of the first SMV Workspace queue-view screen") now directly applicable: `JP-01` **is** that screen, and it falls in Phase 3 of this plan (Section 12/18). **Recommendation to Tiger: this decision must be made before Phase 3 begins**, following the same evaluation format WS11-006 §11.3 already committed to (recommended library, alternatives considered, licensing, accessibility, performance, maintenance) — this plan does not pre-empt that evaluation or select a library.

---

## 15. Engineering Risks

| ID | Risk | Likelihood / Impact | Mitigation |
|---|---|---|---|
| R-ENG-JP-01 | The `shared/rbac` record-scoped extension (Section 8.2) is the first authorisation logic in this codebase needing the acting user's identity *and* the record's `owner_id` together; an implementation error is a cross-user data-exposure risk | Low likelihood if isolated first / **High impact** | Build and verify the six functions in isolation against fixtures before any route calls them (Section 13); RLS provides a second, independent layer (Section 6.4) |
| R-ENG-JP-02 | The one-way conversion RPC (`FR-JP-28`–30) is this module's only atomic, multi-table, irreversible operation; a partial-failure bug could create a Journey without correctly closing its originating record, or vice versa | Low likelihood (single `SECURITY DEFINER` transaction, matching the existing OTP send/verify precedent) / **High impact** (a data-integrity defect visible to every Workspace User, and — because the Journey side is a *bootstrap* table with no owning module yet to help diagnose it — harder than usual to unwind) | Implement as a single PL/pgSQL function exactly as Architecture §6.5 specifies; its own migration file (Section 5.3, item 9), isolated for focused review; add an explicit "attempt conversion twice," "attempt on a non-Decision-stage record," and "simulate mid-transaction failure" case to the `verify:*` suite before this phase is considered done |
| R-ENG-JP-03 | The three bootstrap tables (`AD-WS12-001`) are Proposed, not yet Tiger/Product-Owner-ratified (Section 4, Section 19); if Phase 2 proceeds on an unratified shape and the ratification changes it, migrations 4–6 (Section 5.3) need rework | Low likelihood (the shapes are drawn directly from WS11's own already-Product-Owner-reviewed Domain Model, per Architecture §6.4) / Medium impact if it occurs (a migration correction, not a redesign) | Do not begin Phase 2 migrations until sign-off is recorded (Section 19); Phase 1 has no dependency on this ratification and may proceed regardless (Section 12) |
| R-ENG-JP-04 | Concurrent claim race — two Workspace Users claim the same unclaimed record at effectively the same moment | Low likelihood (internal tool, bounded concurrency) / Medium impact (silently overwritten ownership) | `shared/ownership`'s `claim()` implemented as a conditional `UPDATE ... WHERE owner_id IS NULL`, database-resolved, not read-then-write from the application layer — matching WS11-006's own `R-ENG-06` mitigation exactly; add an explicit `verify:*` case |
| R-ENG-JP-05 | `shared/notifications`' full build (threshold-based unclaimed-record check) has no real trigger events to test against until Journey Planning's own mutations exist | Low likelihood / Low impact (a testing-order inconvenience, not a defect risk) | Sequence the scaffold (Phase 1, emit-function signature and table only) ahead of the full threshold/Cron build (Phase 6), matching WS11-006's own WS-Eng-0/WS-Eng-7 split exactly (Section 12) |
| R-ENG-JP-06 | `FCR-023` remains unresolved into Phase 3; without it, `JP-01`'s queue view either gets a rushed hand-rolled table (rework risk) or Phase 3 stalls | Medium likelihood given current timing / Medium impact (delay, not defect) | Restated with a concrete trigger (Section 14, Section 19) — the same mitigation WS11-006 §7 `R-ENG-03` already used for the Workspace-wide version of this exact risk |
| R-ENG-JP-07 | The eight new `shared/*` modules (Section 5.2) are being built for the first time under commercial/lifecycle time pressure from Journey Planning's own delivery, risking a rushed shared-layer design that every future Workspace module then inherits | Medium likelihood (this is genuinely more shared-layer work than "extend Journey Planning" alone) / Medium-High impact (a poor `shared/audit`/`shared/notifications` shape compounds across five remaining modules, WS13–17) | Treat Phase 1 (Section 12) as its own reviewable milestone with the same rigor as a full workstream's foundation phase, not as an incidental side-effect of Journey Planning's own build — explicitly recommended to Tiger (Section 20) as worth a dedicated review checkpoint before Phase 2 begins |
| R-ENG-JP-08 | **New finding, this pass:** `FR-JP-17`/Architecture §6.2 note a Proposal Version may reference a Traveller Itinerary (from Itinerary Studio, WS15) as its content basis — but Itinerary Studio does not exist as a module or table, and Architecture's own bootstrap treatment (§6.4) does not name it as a fourth bootstrap table the way Traveller/Vendor/Journey were named | Medium likelihood the gap is real (Itinerary Studio is, like WS13/14/16, a reserved identifier with zero engineering) / Low-Medium impact (the field can ship as a nullable free-text or nullable-reference placeholder without blocking Journey Planning's other 29 Functional Requirements) | **Not resolved by this card** (an architecture-scope question, not an engineering-sequencing one) — flagged explicitly to Archie/Tiger as a fourth candidate for the same bootstrap-or-defer treatment §6.4 gave the other three references (Section 19, Section 20). This plan's own working assumption, pending that answer: ship `workspace_proposal_versions.itinerary_reference` as a nullable, unconstrained field in Phase 3, not a foreign key, so no bootstrap table is silently required |

No risk above is treated as a Genuine Blocker to Phase 1 starting (Section 4); `R-ENG-JP-03` and `R-ENG-JP-08` gate Phase 2/3 respectively, not Phase 1.

---

## 16. Implementation Dependencies

### 16.1 Workspace Foundation

Satisfied in full (Section 2) — Authentication, RBAC mechanism, Navigation, Dashboard shell, Workspace Shell all confirmed shipped and reused unmodified.

### 16.2 Future Modules (Bootstrap Boundary)

Traveller Hub (WS14), Journey Workspace (WS13), Vendor Management (WS16) — Journey Planning's engineering pass **creates** minimal versions of their tables (Section 6.2) rather than depending on them existing first, per `AD-WS12-001`. Itinerary Studio (WS15) — **not yet given the same treatment** (`R-ENG-JP-08`); this plan's Phase 3 proceeds with a non-blocking nullable-field placeholder pending that architecture answer.

### 16.3 Bootstrap Ownership

Recorded in Section 6.2/6.3 as a migration-file documentation discipline; no dependency on any future workstream's timing.

### 16.4 Proposal Model

`AD-WS12-002`'s two-table correction (Section 5.3, item 7) is lower-stakes than the bootstrap/Corporate-Contact decisions per Architecture's own assessment (WS12-005, "Recommendation to Tiger" section) but is sequenced identically (pending sign-off) in this plan for consistency, since all three Proposed decisions gate the same Phase 2 boundary (Section 19).

---

## 17. Testing Readiness (Preparation Only — No QA Execution)

This plan prepares Keerthi's future functional validation by ensuring every Functional Requirement (`FR-JP-01`–30) and every Exception Scenario (`WS12-003` §15) maps to a concrete engineering artefact this plan names (Section 9's API list, Section 9's service list) — so QA scenario authorship (Keerthi's own future task) has a 1:1 implementation surface to test against, not an abstract requirement alone. The `verify:*` suite (Section 12, Section 3.1) provides engineering-level (not functional/QA-level) confidence ahead of Keerthi's own independent pass, per Project Instructions §29's own distinction between Rad's technical completion and Keerthi's functional approval — this plan does not conflate the two.

---

## 18. Implementation Order

Nine phases, sequenced by hard dependency first, then by risk-isolation (highest-risk, most irreversible operations built and tested in relative isolation rather than bundled with routine CRUD). Labelled `WS-Eng-JP-N` to avoid collision with WS11-006's own `WS-Eng-0`–`8` numbering (a different Release Workstream's internal phase labels, per that document's own terminology clarification, WS11-006 §5).

### WS-Eng-JP-1 — Shared Foundation Extension (no external dependency beyond WS11 Foundation; start immediately)

**Scope:** `shared/audit`, `shared/notifications` (scaffold only), `shared/ownership`, `shared/tasks-follow-ups` modules and their four/five migrations (Section 5.3, items 1–3); the `shared/rbac` six-function extension (Section 8.2), built and unit-verified in isolation against fixtures (Section 13) before anything calls it. **Recommended by this plan (Section 15, `R-ENG-JP-07`) as its own reviewable milestone**, given its genuinely Workspace-wide (not just Journey-Planning-scoped) blast radius.

**Depends on:** nothing beyond the already-shipped WS11 Foundation. **Blocks:** every later phase.

### WS-Eng-JP-2 — Data Foundation: Journey Planning + Bootstrap Tables

**Scope:** migrations 4–8 (Section 5.3) — the three bootstrap tables, Corporate Point of Contact, the Journey Planning Record itself, the Proposal/Proposal Version pair, Vendor Quotations, Discovery Notes, Activities; `journey-planning/{types,validation,repository}.ts`.

**Depends on:** WS-Eng-JP-1 (foreign keys to `workspace_users`, `shared/ownership`'s column conventions); **and explicit Tiger/Product Owner sign-off on `AD-WS12-001`/`002`/`003`** (Section 4, Section 19) — this is a genuine gate, not a recommendation Rad can waive.

### WS-Eng-JP-3 — Core Record Lifecycle

**Scope:** `journey-planning/service.ts`'s `createRecord()`, `claimRecord()`, `reassignRecord()`, `advanceStage()`, `checkDuplicate()`; the four Phase-2 API routes (Section 9); `JP-01` (Queue), `JP-02`/`JP-02a` (Overview + Traveller panel), `JP-03` (Create), `JP-04` (Discovery). **`JP-01` is the `FCR-023` trigger point (Section 14)** — this phase does not begin its UI half until that decision is made.

**Depends on:** WS-Eng-JP-2.

### WS-Eng-JP-4 — Proposal & Vendor Quotation Workflows

**Scope:** `createProposalVersion()`/`reviseProposal()`/`sendProposalVersion()`, `recordVendorQuotation()`; `JP-05` (Proposal Workspace), `JP-06` (Vendor Quotation View), `JP-07` (Proposal History), `JP-08` (Corporate Point of Contact panel). The `itinerary_reference` nullable-field placeholder (`R-ENG-JP-08`) is implemented here.

**Depends on:** WS-Eng-JP-3.

### WS-Eng-JP-5 — Tasks, Follow-ups, Search

**Scope:** `JP-12` (Tasks & Follow-ups tab, consuming `shared/tasks-follow-ups` built in Phase 1), `JP-10` (Search & Filters, the six-dimension filter bar).

**Depends on:** WS-Eng-JP-1 (module exists), WS-Eng-JP-3 (records exist to filter/attach to).

### WS-Eng-JP-6 — History, Notifications, Archive

**Scope:** `JP-09` (read-only Audit/History timeline, querying `workspace_audit_log`), `JP-11` (Archive View); `shared/notifications`' full build — trigger wiring for every event named in `WS12-003` §11, the Vercel Cron threshold-check endpoint and `vercel.json` addition (mirroring WS11-006's own WS-Eng-7 design, since Journey Planning is first consumer, Section 2.2).

**Depends on:** WS-Eng-JP-3/4 existing and producing real events to test notification/audit triggers against (matching WS11-006's own stated rationale for sequencing full notification-build after, not with, the modules that produce its events).

### WS-Eng-JP-7 — Decision & Conversion (isolated, highest risk)

**Scope:** `recordDecision()`, the conversion `SECURITY DEFINER` RPC (its own migration, Section 5.3 item 9), `JP-13` (Confirm/Close Record). Built and tested in relative isolation per `R-ENG-JP-02`'s mitigation, with its own dedicated `verify:*` cases before this phase is considered done.

**Depends on:** WS-Eng-JP-3 (a record must exist and be progressable to Decision stage), WS-Eng-JP-2 (the `workspace_journeys` bootstrap table it writes into).

### WS-Eng-JP-8 — Notification Threshold Automation Completion

**Scope:** the unclaimed-record threshold specifically (`FR-JP` support, `WS12-003` §11) — separated from Phase 6's broader notification build because it depends on real queue-age data existing, which only accumulates once Phase 3 has been live. In practice this is a late-stage tuning/verification pass on infrastructure Phase 6 already built, not new infrastructure.

**Depends on:** WS-Eng-JP-6.

### WS-Eng-JP-9 — Final Integration and Handoff to Keerthi

**Scope:** full `verify:*` suite run end-to-end; lint/type/build checks (Project Instructions §28); a final Repository Impact reconciliation (did every file in Section 5 actually get created, nothing extra); handoff package for Keerthi's independent functional validation (Section 17).

**Depends on:** every prior phase.

### 18.1 Sequencing Diagram

```
WS-Eng-JP-1 (Shared Foundation: audit, notifications-scaffold, ownership,
             tasks/follow-ups, rbac extension)
   │
   ├── [GATE: AD-WS12-001/002/003 sign-off — Section 19]
   │
WS-Eng-JP-2 (Data Foundation: bootstrap tables, Corporate Contact,
             Journey Planning Record, Proposal/Version, Vendor Quotation,
             Discovery Notes, Activities)
   │
   ├── [GATE: FCR-023 — Section 14]
   │
WS-Eng-JP-3 (Core Lifecycle: create, claim, stage transitions, JP-01–04)
   │
   ├── WS-Eng-JP-4 (Proposal & Vendor Quotation, JP-05–08)
   │       │
   │       └── WS-Eng-JP-7 (Decision & Conversion, JP-13) ──┐
   │                                                          │
   ├── WS-Eng-JP-5 (Tasks/Follow-ups/Search, JP-10/12)       │
   │                                                          │
   └── WS-Eng-JP-6 (History/Notifications/Archive, JP-09/11) │
           │                                                  │
           └── WS-Eng-JP-8 (Threshold automation tuning) ─────┤
                                                                │
                                          WS-Eng-JP-9 (Final Integration) ──┘
```

### 18.2 Parallelism

WS-Eng-JP-5 and WS-Eng-JP-6 have no dependency on each other and can run concurrently once WS-Eng-JP-3 lands, matching WS11-006 §5.3's own reasoning for parallelising independent, non-sequential workstreams. WS-Eng-JP-4 → WS-Eng-JP-7 is a genuine hard sequential dependency (the conversion RPC needs a Proposal to exist) and should not be parallelised, mirroring WS11-006's own treatment of its Journey Planning → Journey Workspace dependency.

---

## 19. Release Readiness Assessment

**May engineering begin? Phase 1: yes, immediately. Phase 2 onward: conditional on two items, neither a redesign.**

| # | Item | Blocks | Recommended Resolution |
|---|---|---|---|
| 1 | Tiger/Product Owner sign-off on `AD-WS12-001` (bootstrap tables), `AD-WS12-002` (Proposal/Version split), `AD-WS12-003` (Corporate Point of Contact ownership) | Phase 2 (Section 18) | A lightweight sign-off, not a full re-review — Architecture's own recommendation (WS12-005, "Recommendation to Tiger"), restated here because it is now also an engineering-sequencing gate, not only a governance nicety |
| 2 | `FCR-023` — UI component/data-grid library selection | Phase 3's UI half (`JP-01`) | Resolve using the same evaluation format WS11-006 §11.3 already committed to; this plan does not select or recommend a library |
| 3 | `R-ENG-JP-08` — Traveller Itinerary reference boundary (new finding, this pass) | Nothing in Phases 1–2; a Phase 4 detail only | Flagged to Archie as a fourth bootstrap-or-defer candidate alongside `AD-WS12-001`'s three; this plan's own working assumption (nullable, unconstrained field) may proceed without blocking if no answer arrives before Phase 4 |
| 4 | WS12's governance status (`🔒 Reserved`, not `In Progress`) | Nothing engineering-technical; a Tiger housekeeping item | Recommend Tiger update `RELEASE-1.3.md`/`RELEASE-1.3-FEATURE-REGISTER.md` before WS12-007's first implementation commit, for governance-record accuracy, not as an engineering gate |

**No item above is a redesign risk.** Items 1 and 3 are sign-off/disclosure items on already-well-reasoned Architecture content; item 2 is a pre-existing, already-scheduled decision point reaching its own trigger; item 4 is pure governance bookkeeping.

---

## 20. Engineering Decision Log

| Decision | Rationale | Alternative Considered |
|---|---|---|
| Relabel engineering phases `WS-Eng-JP-1`–`9` rather than reusing WS11-006's `WS-Eng-0`–`8` numbering | Avoids collision/ambiguity between two different Release Workstreams' internal phase labels; WS11-006 §5 itself establishes that these labels are workstream-internal, not release-wide, so a fresh sequence for WS12 is the correct application of its own convention, not a departure from it | Continuing WS11-006's numbering from `WS-Eng-9` — rejected: would wrongly imply WS12's engineering is a continuation of WS11's own phase plan rather than a new workstream's own |
| Build the full `shared/audit`/`shared/notifications`/`shared/ownership`/`shared/tasks-follow-ups` layer inside WS12-007 rather than requesting a separate, dedicated "Shared Platform" workstream first | These modules are already-approved WS11 design (Section 2.2) with no new architecture decision required to build them — treating them as a blocking prerequisite workstream would delay Journey Planning for pure process reasons; WS-Eng-JP-1 gives them the isolated review attention they need without a separate governance card | A dedicated `WS-Eng-0`-style pre-workstream, mirroring WS11's own Foundation-first structure exactly — considered and not recommended, since unlike WS11 (a genuinely new platform), this is a well-specified, low-ambiguity extension of an already-designed layer; Tiger may override this judgement if visibility is preferred (Section 21, Recommendation 2) |
| Treat the three Proposed architecture decisions as a Phase 2 gate rather than proceeding on Rad's own reading of them | Matches Architecture's own explicit recommendation (WS12-005) and Project Instructions §5 (Rad must not reinterpret architecture); Phase 1 has genuinely no dependency on any of the three, so the gate costs no calendar time if sign-off happens promptly | Proceeding on the Proposed shapes without formal sign-off, treating WS12-005's own reasoning as sufficient — rejected, since two of the three (`AD-WS12-001`, `AD-WS12-003`) carry consequences (workstream sequencing, future data ownership) genuinely beyond Rad's own authority to finalise |
| Recommend a fourth bootstrap-or-defer question (Traveller Itinerary) rather than silently defaulting to a nullable field without flagging it | Consistent with this project's own repeated convention (disclose, don't silently resolve, Project Instructions §17) — Architecture named three bootstrap references and this pass found a fourth candidate Architecture's own document did not name | Silently implementing the nullable-field workaround without flagging it upward — rejected as inconsistent with the disclosure standard every prior card in this workstream has held itself to |

---

## 21. Recommendations to Tiger

1. **Route `AD-WS12-001`/`002`/`003` sign-off to the Product Owner before Phase 2 begins** (Section 19, item 1) — this is the one item genuinely on Journey Planning's own critical path.
2. **Consider whether WS-Eng-JP-1 (Section 18) warrants its own visible review checkpoint**, given its wider-than-Journey-Planning blast radius (`R-ENG-JP-07`) — this plan's own judgement (Section 20) is that a separate governance card is not required, but Tiger may weigh the process cost differently.
3. **Route the fourth bootstrap-or-defer question (Traveller Itinerary reference, `R-ENG-JP-08`) to Archie** for the same treatment `AD-WS12-001` gave Traveller/Vendor/Journey — non-blocking to Phases 1–3, but worth resolving before Phase 4.
4. **Update `RELEASE-1.3.md`/`RELEASE-1.3-FEATURE-REGISTER.md`** to move WS12 from `🔒 Reserved` to `In Progress` once Product Owner sign-off (Recommendation 1) is given — a governance-record-accuracy item, not an engineering blocker, restated here because WS12-005 also found it outstanding and it remains so.
5. **Resolve `FCR-023` ahead of Phase 3**, per its own long-standing suggested trigger point, now concretely reached (Section 14, Section 19 item 2).

---

## Explicit Non-Goals — Confirmed Observed

Per this EBC's own instruction, this document does **not**: write production code; create database migrations; implement UI; change architecture; change UX; modify business rules; redefine Product Owner decisions; perform QA; create test cases. All confirmed absent from this document by its own review — every migration, route, and component named above is planned, not written; every file path named is a target, not a diff.

---

## Deliverables Created (Mandatory)

**Primary deliverable:** `docs/09-Development/EBC-R1.3-WS12-006-RADHA-Engineering-Planning-and-Implementation-Strategy-Journey-Planning.md` — this document.

**Supporting deliverables:** No supporting engineering-planning documents created. Per this EBC's own instruction to create supporting documents "only if they add genuine engineering value," this single document is judged sufficient — Journey Planning is one module's engineering plan, not a platform-scale plan requiring WS11-006's own separate addendum treatment (that addendum resolved genuinely novel governance questions — new dependency due diligence, new-folder necessity — that this plan does not need to re-litigate, since the folders and dependencies it uses are either already-approved or explicitly flagged inline, Section 5/Section 19).

---

## Repository Verification (Mandatory)

| Check | Result |
|---|---|
| Repository connected | Yes, throughout this session |
| Repository root verified | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Branch confirmed | `main` |
| Working tree reviewed (before and after) | Before: clean, 8 commits ahead of `origin/main`. After this card's write: the same, plus this document as one new untracked file |
| Destination verified | `docs/09-Development/` exists; filename follows this workstream's exact naming convention |
| File written successfully | Yes |
| Only intended files modified | Yes — this document only. No Product, UX, Architecture, code, configuration, schema, or Supabase object was created, modified, or removed |
| Repository ready for Tiger review | Yes |

---

## Repository Status (Mandatory)

- **Branch:** `main`.
- **Working tree:** was clean at task start; now holds one new untracked file — this document. 8 local commits remain unpushed to `origin/main` (pre-existing, not from this card). Neither commit nor push is performed by this card, per Project Instructions §26 — that remains the Product Owner's own action, consistent with this project's standing convention observed throughout the WS11/WS12 record.
- **Files created:** one — this document.
- **Files modified:** none.

---

## Recommended Next Workstream

**Two parallel tracks, both consistent with this plan's own gating (Section 19):**

1. **Tiger** — route the three Proposed architecture decisions (`AD-WS12-001`/`002`/`003`) to the Product Owner for sign-off, and resolve `FCR-023` ahead of Phase 3, per Section 21's recommendations.
2. **Rad (`EBC-R1.3-WS12-007` — Engineering Implementation, WS-Eng-JP-1)** — may begin **immediately**, in parallel with Track 1: WS-Eng-JP-1 (Shared Foundation Extension, Section 18) has no dependency on either gating item and is the correct starting point regardless of how long Tiger/Product Owner sign-off takes.

---

## Confirmations

- Only this Engineering Planning document was produced. No application code, configuration, schema, or Supabase object was created, modified, or removed.
- No Product Discovery, Business Analysis, UX redesign, or QA activity was performed.
- No Product Owner decision was altered — the seven-stage lifecycle, the ratified Proposal Model, the Journey Planning Entry Model, and the Single Business Object Principle are all planned for exactly as ratified.
- No Architecture decision was altered — every structural choice in `WS12-005` is sequenced, not redesigned; the three Proposed decisions are treated as pending sign-off, not as already-final, and not as blocked either (Phase 1 proceeds regardless).
- One new engineering-level finding is disclosed rather than silently resolved (`R-ENG-JP-08`, the Traveller Itinerary reference boundary) and routed to the correct persona (Archie) rather than decided here.
- The Workspace Foundation was reused throughout; every new module/folder in Section 5 is either a direct extension of an already-approved pattern or an already-approved-but-unbuilt `shared/` capability Journey Planning is disclosed as being first to need (Section 2.2) — no duplicate service, business object, or parallel architectural model is introduced.
- Repository connected, branch and working tree verified before and after; only this one file was created; nothing was committed or pushed (Project Instructions §26).

---

*Prepared by Radha, Senior Software Engineer / Engineering Lead, on behalf of Team Satvi, per `EBC-R1.3-WS12-006`. This Engineering Planning & Implementation Strategy is Journey Planning's canonical implementation roadmap and is submitted for Tiger/Product Owner review. WS-Eng-JP-1 may begin immediately; Phase 2 onward awaits sign-off per Section 19.*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01L6KYAiNwVu86RMW3fEXWsh
