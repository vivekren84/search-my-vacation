# Search My Vacation

# EBC-R1.3-WS12-005 — Journey Planning Solution Architecture

**Persona:** Archie — Technical Architect / Solution Architect
**Release:** 1.3
**Workstream:** WS12 — Journey Planning (first Workspace Business Module)
**Phase:** Solution Architecture
**Status:** Solution Architecture Complete — ready for Rad (WS12-006, Engineering Planning) and Keerthi (future QA design)
**Date:** 21 September 2026

---

## 0. Repository Readiness Check (Mandatory Execution Gate)

| Check | Result |
|---|---|
| Repository access confirmed | **Yes.** Folder `/Users/viveksophu/Documents/Projects/SearchMyVacation` connected this session via the device bridge |
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed |
| Current Git branch | `main` |
| Working tree reviewed (read-only) | `git status` shows the branch **7 commits ahead of `origin/main`** (unpushed, not this card's concern — no push is performed by this card, per Project Instructions §26) and **one pre-existing untracked file**: `docs/09-Development/EBC-R1.3-WS12-004-SOPHIE-UX-Design-and-User-Experience-Specification-Journey-Planning.md` (Sophie's UX specification, evidently written to the repository by a prior session but not yet committed). This file was **not created or modified by this card** and is left exactly as found — disclosed here per Project Instructions §17 (do not silently resolve material conditions found in the working tree), not actioned |
| Destination folder exists | **Yes.** `docs/09-Development/` exists and holds every prior WS11/WS12 EBC in this workstream |
| Destination filename verified | `docs/09-Development/EBC-R1.3-WS12-005-ARCHIE-Solution-Architecture-Journey-Planning.md` — does not yet exist; this card creates it |
| Supporting architecture folder | `docs/20-Architecture/journey-planning/` does not exist. Per this EBC's own instruction ("only create additional documents where they materially improve architectural clarity... avoid documentation for its own sake"), **no supporting documents are created** — this single Solution Architecture document is sufficient; see §16 |
| Repository First applied | Every claim about the existing platform below (module structure, shipped tables, shipped RBAC/permission code, current Journey Planning route state) was verified by direct repository inspection this session, not assumed from prior EBC text alone (§1) |

---

## 1. Inputs Consumed (Mandatory)

Reviewed in full, this session, before drafting:

**Journey Planning workstream**

- `EBC-R1.3-WS12-001` (Tiger) — Workstream Initiation & Scope Definition.
- `EBC-R1.3-WS12-002` (Arjun) — Business Domain Discovery, including its second/final continuation's three Product Owner ratifications: **Decision 1** (Proposal Model — Proposal is primary, Proposal Version is its revision history, Vendor Quotation is a distinct supplier-owned object), **Decision 2** (Journey Planning Entry Model — eight origin channels, Mandatory Association, Duplicate Prevention), **Decision 3** (Single Business Object Principle — Journey is canonical, no duplication, no reopening a booked Journey).
- `EBC-R1.3-WS12-003` (Arjun) — Business Analysis & Functional Requirements: the seven-stage lifecycle with entry/exit criteria (§5), the full Business Object Catalogue (§6), all 30 approved Functional Requirements `FR-JP-01`–`30` (§7), Business Rules (§8), Validation Rules (§9), Permissions (§10), Notifications (§11), Search (§12), Audit (§13), Reporting (§14), Exception Scenarios (§15), Integration Points (§17), Open Questions (§20, notably `OQ-A` traveller communication channel and `OQ-B` Corporate Point of Contact data ownership — both explicitly handed to this card).
- `EBC-R1.3-WS12-004` (Sophie) — UX Design & User Experience Specification: 13 screens/panels, 11 interaction flows, Information Architecture, the reused-component catalogue, and this card's own two inherited Open Items (`OQ-A`, `OQ-B`, restated as R-UX-2/R-UX-3).

**Workspace Foundation (WS11) architecture baseline** — read in full from the repository, `docs/20-Architecture/workspace/`:

- `WORKSPACE-ARCHITECTURE-DISCOVERY.md`, `WORKSPACE-SOLUTION-ARCHITECTURE.md` — overall structure (single Next.js app, new protected route segment), architectural layers, module boundaries (nine modules mirroring the Product Specification), dependency rules (a module's `service.ts` may call another module's `service.ts`, never its `repository.ts`; `shared/*` has no dependency on any operational/knowledge module), server/client boundary (Server Components for reads, API Route Handlers for writes, no Server Actions, no `service_role` key client-side).
- `WORKSPACE-DOMAIN-MODEL.md` — the approved core business entities (Lead, Traveller, Journey Planning Record, Journey, Proposal Version, Vendor Quotation, Master/Traveller Itinerary, Vendor, Destination Profile, Notification, Task, Follow-up, Document, and the architecture-introduced `WorkspaceUser`), aggregate boundaries, the Generic Ownership Model as a reusable opt-in column set, and the archive-only/no-delete invariant.
- `WORKSPACE-DATA-ARCHITECTURE.md` — persistence strategy (`public` schema, `workspace_` table prefix, no ORM, hand-written PostgREST/RPC access), the central Supabase Auth + Row Level Security decision (`AD-WS11-002`, Product-Owner-approved), the data-ownership table (module → tables), audit strategy (`workspace_audit_log`), versioning strategy (append-only, current-flag pattern), and the historical-preservation implementation (no `DELETE` grant/function for the six archive-only object types).
- `WORKSPACE-INTEGRATION-ARCHITECTURE.md` — the Lead ingestion boundary with `journey_passport_leads` (`AD-WS11-007`, read-only adapter), the Destination Profile/`geo_places` boundary (`AD-WS11-006`, Product-Owner-approved), external integrations (Supabase, Resend, Vercel — no new dependency), the API boundary convention, and the Vercel-Cron event-flow pattern for threshold-based Notifications.
- `WORKSPACE-ARCHITECTURAL-DECISIONS.md` — the consolidated decision register `AD-WS11-001`–`013`, distinguishing Approved from Proposed, which this card extends rather than restates.
- `EBC-R1.3-WS11-004` (Architecture Baseline & Engineering Readiness) and `EBC-R1.3-WS11-011B` (Workspace UX Architecture Review) — confirming the baseline's acceptance and the actually-shipped UX refinement it was reviewed against.

**Repository inspection (this session, read-only)** — the actual shipped state, not merely the WS11 documents' description of it:

- `web/app/workspace/**` — confirmed: `layout.tsx`, `sign-in/`, `reset-password/`, and a `(dashboard)` route group whose `layout.tsx` calls `requireWorkspaceUser()` and renders `WorkspaceShell`. Every module page (`journey-planning/page.tsx` included) currently renders `<ComingSoon moduleName="..." />` — **Journey Planning has zero business logic implemented today**; this card designs onto a clean slate within the Foundation shell, not around existing Journey Planning code.
- `web/lib/workspace/shared/{rbac,auth,supabase}` — confirmed shipped: `rbac/roles.ts` (two roles, `administrator` and `privilege_user`, with `describeWorkspaceRoleLabel()` mapping `privilege_user` → the product-facing label "Workspace User" per the Product Owner's 17-Sep-2026 naming decision — **no rename is approved**, this card uses "Workspace User" only in product-facing prose, `privilege_user` in every schema/code reference); `rbac/permissions.ts` (a deliberate **stub** — `hasWorkspaceCapability()` currently returns `true` only for `administrator`, with its own comment stating every gated action defaults Administrator-only "until the screen implementing it defines... its actual capability" — Journey Planning is the first module to need to extend this); `rbac/guard.ts` (`requireWorkspaceUser()`, the standard protected-entry-point pattern); `auth/*` and `supabase/*` (Supabase Auth session handling, already functioning).
- `web/components/workspace/{layout,navigation}/*` — confirmed shipped: `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceUserMenu`, `WorkspaceNav`, `WorkspaceMobileNav`, exactly as Sophie's UX specification described them (WS12-004 Inputs Consumed) — the component catalogue this Architecture reuses (§8) is verified real, not merely documented.
- `supabase/migrations/` — confirmed: **exactly one** `workspace_*` migration exists in the repository, `20260916090000_workspace_users_and_roles.sql` (`workspace_users`, RLS, `workspace_current_user_role()`). **No `workspace_journeys`, `workspace_travellers`, `workspace_vendors`, or any Journey-Planning-owned table has been created yet.** This is the single most material finding of this repository inspection and drives §6/§13 below.
- `web/package.json` — confirmed: Next.js `16.2.10`, React `19.2.4`, no ORM, no schema-validation library (no `zod` or equivalent) — validation in this codebase is hand-written, matching `journey-leads/validation.ts`'s existing convention, which this Architecture follows rather than introducing a new dependency.
- `web/lib/journey-leads/*` — confirmed as the existing five-file-module and typed-error precedent (`JourneyLeadRepositoryError extends Error`, etc.) this Architecture's error-handling strategy (§12) extends rather than invents.

**Governance**

- `docs/10-Backlog/RELEASE-1.3.md` §5/§7 — `DEC-R1.3-009` (WS11 architectural ratifications), `DEC-R1.3-011` (WS11 closed as Foundation-only baseline), `DEC-R1.3-012` (WS12–WS17 reserved identifiers, no implied sequencing, WS12 **not yet marked In Progress** by this card — that is a Tiger governance action).
- `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` §9 — `PEB-001` (Journey Amendment): confirmed as a hard scope boundary this Architecture respects (§6.7, §14) — Journey Planning's conversion is one-way and Journey Planning never reopens a booked Journey.
- Team Satvi Operating Principles (SMV Claude Project Instructions v2.1), §5 (Archie's mandate and limits), §16.3 (Archie prerequisites), §21 (Architecture Principles), §24 (Journey Passport/Journey Director guardrails — not directly engaged by this module, confirmed out of scope), §36.

No referenced artefact was found missing. No conflict was found between the Business Analysis (`WS12-003`), the UX Specification (`WS12-004`) and the WS11 Architecture baseline **except** the one disclosed and resolved in §6.1 (the Proposal/Proposal Version shape) and the one disclosed and **not** silently resolved in §13 (the three-workstream sequencing dependency) — both handled per Project Instructions §17, "do not silently resolve material conflicts."

---

## 2. Architecture Goals

1. **Extend, not fork, the Workspace Foundation.** Every structural decision below reuses a pattern the WS11 Architecture baseline already established and the repository already ships (module five-file convention, Supabase Auth + RLS, Server Components for reads, API routes for writes, `workspace_` table prefix, archive-not-delete, append-only versioning, the shared audit log, the shared notification engine, the shared ownership column set) — Journey Planning introduces no new architectural style.
2. **Implement the ratified business model precisely**, including where it corrects WS11's own earlier, more provisional treatment of the Proposal object (§6.1) — architecture follows business, not the reverse (Project Instructions §5, "Business Before Architecture").
3. **Make the UX's enforced business rules structurally true**, not merely policy: exactly one active Proposal, mandatory Traveller-or-Corporate-Point-of-Contact association, no `DELETE` path for archive-only objects, no reopening a Closed record, one atomic conversion path to Journey.
4. **Resolve, rather than merely restate, the two Business-Analysis Open Questions handed to this card** (`OQ-A` traveller communication channel is explicitly out of this card's ability to resolve without a Product decision — restated as deferred, §11; `OQ-B` Corporate Point of Contact data ownership **is** resolved here, §6.6).
5. **Disclose, rather than silently work around, the one genuine architectural gap this inspection found**: Journey Planning's two most fundamental referenced aggregates — Traveller and Journey — belong to modules (`WS14` Traveller Hub, `WS13` Journey Workspace) that are reserved identifiers with **zero engineering**, not yet even a migration. This card's answer (§6.4, §13, `AD-WS12-001`) is offered as architecture, not as a silent scope expansion into WS13/WS14's own future work.
6. **Leave engineering sequencing and exact implementation detail to Rad** (WS12-006) — this document defines structure, data model, integration boundaries and constraints; it does not write migration SQL, API handler code, or a sprint plan.

---

## 3. Architecture Drivers

| Driver | Source | Architectural consequence |
|---|---|---|
| Exactly one active Proposal per record (`FR-JP-14`) | `WS12-003` §7, §9; Ratified Decision 1 | Requires a stable "Proposal" identity distinct from any one version (§6.1) — not just a bag of version rows |
| Mandatory, mutually exclusive Traveller/Corporate POC association (`FR-JP-09`/`10`) | `WS12-003` §7, §9 | A `CHECK` constraint enforcing exactly one of two nullable foreign keys is populated (§6.4, §9) |
| Duplicate prevention before creation (`FR-JP-08`) | `WS12-003` §7; Ratified Decision 2 | A partial unique index plus a pre-submit lookup query (§9), not a hard block on every possible race — advisory-with-a-safety-net, matching `BR-010`'s existing WS11 treatment |
| One-way, atomic, no-duplicate conversion to Journey (`FR-JP-28`–`30`) | `WS12-003` §8, §16; Ratified Decision 3; `PEB-001` | A single `SECURITY DEFINER` RPC, mirroring the WS11 Domain Model's own prescribed pattern (§2.4, §6 there) — and, materially, requires a `workspace_journeys` table to exist at all (§6.4, `AD-WS12-001`) |
| Eight-channel origin model, all must be representable (`FR-JP-06`/`07`) | `WS12-003` §7; Ratified Decision 2 | An enumerated `origin_channel` column, `CHECK`-constrained, matching the existing `workspace_users.role` convention |
| Internal-only Vendor Quotation, never vendor-facing (`FR-JP-21`) | `WS12-003` §7 | No public/authenticated-non-staff grant is ever created on `workspace_vendor_quotations`; enforced at the same grant level as every other `workspace_*` table (§10) |
| Journey Planning is the first module to need a real permission matrix | Repository inspection, `shared/rbac/permissions.ts` | `hasWorkspaceCapability()`'s Administrator-only stub must be extended, not bypassed (§10) |
| Journey Planning is the first module engineering actually builds | Repository inspection, `supabase/migrations/` | No `workspace_*` table this module depends on exists yet, including ones nominally owned by other, unstarted workstreams (§6.4, §13) |
| No UI component/data-grid library exists yet for a dense operational interface (`FCR-023`) | `EBC-R1.3-WS11-004` | Carried forward as a Future Architecture Opportunity (§15), not solved by this card |

---

## 4. Context Diagram — Journey Planning within Workspace

```
                              Vercel (single project, unchanged)
                                          │
                         web/  (Next.js 16.2.10 App Router)
                                          │
        ┌─────────────────────────────────┴─────────────────────────────────┐
        │                    SMV Workspace Surface                          │
        │              web/app/workspace/(dashboard)/**                     │
        │         (WorkspaceShell / WorkspaceHeader / WorkspaceNav —        │
        │              already shipped, WS11 Foundation)                    │
        │                                                                    │
        │   ┌────────────────────────────────────────────────────────┐     │
        │   │            Journey Planning module (this EBC)            │     │
        │   │        web/app/workspace/(dashboard)/journey-planning/** │     │
        │   │        web/lib/workspace/journey-planning/**             │     │
        │   │        web/app/api/workspace/journey-planning/**         │     │
        │   └───────┬───────────────┬──────────────────┬───────────────┘    │
        │           │               │                  │                    │
        │   ┌───────┴───────┐ ┌─────┴──────┐  ┌────────┴─────────┐         │
        │   │ shared/ownership│ │shared/      │  │ shared/notifications│    │
        │   │ shared/rbac     │ │audit        │  │ shared/tasks-       │    │
        │   │ (WS11, extended)│ │(WS11, reused)│  │ follow-ups (WS11)   │    │
        │   └─────────────────┘ └─────────────┘  └──────────────────────┘  │
        └───────────────────────────┬────────────────────────────────────┘
                                     │
                    Supabase Postgres (single project, `public` schema)
      ┌──────────────────────────────┼────────────────────────────────────┐
      │ existing tables (unchanged,  │  workspace_journey_planning_records │
      │ service_role-only):           │  workspace_proposals /_versions    │
      │  journey_passport_leads       │  workspace_vendor_quotations       │
      │  geo_places / geo_aliases     │  workspace_discovery_notes         │
      │                                │  workspace_activities              │
      │  read-only reference only ────┼─▶ workspace_corporate_contacts      │
      │  (AD-WS11-006, AD-WS11-007)   │  workspace_travellers  (bootstrap) │
      │                                │  workspace_vendors     (bootstrap) │
      │                                │  workspace_journeys    (bootstrap) │
      │                                │  — the three tables §6.4 below    │
      │                                │    resolves as WS12-authored      │
      │                                │    stubs pending WS13/WS14/WS16    │
      └────────────────────────────────┴────────────────────────────────────┘
```

Journey Planning sits entirely inside the SMV Workspace protected surface. It has no direct relationship with the public site beyond the existing, unchanged, read-only Lead-ingestion adapter WS11 already defined (`AD-WS11-007`) — Journey Planning's own origin-channel model (§6.4) is a superset of that one channel, and this Architecture does not modify the ingestion adapter itself, only consumes its output the same way WS11 always intended.

---

## 5. Logical Architecture

### 5.1 Module: `web/lib/workspace/journey-planning/`

Following the established five-file convention exactly (`AD-WS11-004`, verified live in `journey-leads/`):

| File | Responsibility |
|---|---|
| `types.ts` | `JourneyPlanningRecord`, `Proposal`, `ProposalVersion`, `VendorQuotation`, `DiscoveryNote`, `Activity`, `CorporateContact`, the eight-value `OriginChannel` union, the seven-value `LifecycleStage` union, and the narrow cross-module reference shapes this module publishes (`JourneyPlanningRecordReference`, consumed by the future `journey-workspace` module per `AD-WS11-004`'s own dependency rule) |
| `validation.ts` | Hand-written validation functions (no schema-validation library — matches the repository's existing no-dependency convention, §1), including the Mandatory Association check (`FR-JP-09`/`10`), origin-channel enum validation, and lifecycle-transition validity (Section 5.4's allowed-transitions table) |
| `repository.ts` | Direct PostgREST `fetch` calls against `workspace_journey_planning_records`, `workspace_proposals`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes`, `workspace_activities`, `workspace_corporate_contacts` — and, per §6.4, the bootstrap tables `workspace_travellers`, `workspace_vendors`, `workspace_journeys` until their owning modules exist. Exposes no `delete()` for any archive-only object type (`archive()` only), mirroring `AD-WS11-011` exactly |
| `service.ts` | Orchestrates business-rule enforcement: duplicate-prevention lookups, the Mandatory Association check, stage-transition validation, Proposal-singularity enforcement, the one-way conversion call (via the `SECURITY DEFINER` RPC, §6.5), and calls to `shared/notifications`, `shared/audit`, `shared/ownership` — never calls another module's `repository.ts` directly (`AD-WS11-004`'s dependency rule) |
| `client.ts` | The thin client-side surface for the Client Components named in the UX spec (claim button, association selector, duplicate-check panel, stage-advance control, Proposal composer autosave, Send confirmation, Record Decision control) |

### 5.2 Presentation: `web/app/workspace/(dashboard)/journey-planning/**`

Replaces the current `<ComingSoon moduleName="Journey Planning" />` placeholder (confirmed shipped, §1) with the 13 screens/panels Sophie's UX specification defines (`WS12-004` §7), mapped to routes:

| Route | Screen(s) | Component type |
|---|---|---|
| `/workspace/journey-planning` | JP-01 Queue (+ JP-10 filter bar) | Server Component (read), Client Components for claim/filter actions |
| `/workspace/journey-planning/new` (modal/panel, not a full navigation per UX §7) | JP-03 Create | Client Component form, posting to the API boundary |
| `/workspace/journey-planning/[recordId]` | JP-02 Overview, with in-place JP-02a/JP-08 panels | Server Component (read) + tab bar |
| `/workspace/journey-planning/[recordId]/discovery` | JP-04 | Server Component + Client edit surfaces |
| `/workspace/journey-planning/[recordId]/proposal` | JP-05 Proposal Workspace, JP-07 Proposal History | Server Component (current state) + Client Component (composer, autosave, Send) |
| `/workspace/journey-planning/[recordId]/vendor-quotations` | JP-06 | Server Component + Client create form |
| `/workspace/journey-planning/[recordId]/tasks` | JP-12 | Server Component, reusing `shared`'s existing Task/Follow-up presentation, not a new one |
| `/workspace/journey-planning/[recordId]/history` | JP-09 | Server Component, read-only, queries `workspace_audit_log` filtered to this record |
| `/workspace/journey-planning/[recordId]/decision` | JP-13 Confirm/Close | Client Component — the one deliberately heavier flow (§9's "not a lightweight inline action") |
| `/workspace/journey-planning/archive` | JP-11 | Server Component, same list rendering as JP-01 minus the primary create action |

This follows the Solution Architecture's server/client boundary exactly (`WORKSPACE-SOLUTION-ARCHITECTURE.md` §6, verified against the shipped `(dashboard)/layout.tsx`): every read is a Server Component calling `journey-planning/service.ts` directly; every write goes through an API Route Handler (§8).

### 5.3 Reused, Unmodified Foundation Components

`WorkspaceShell`, `WorkspaceHeader`, `WorkspaceNav`, `WorkspaceMobileNav`, `WorkspaceUserMenu`, `EmptyState`, the `(dashboard)` route group's `requireWorkspaceUser()` gate — all verified shipped and unmodified by this Architecture, exactly as Sophie's UX specification assumed (§10, §11 of `WS12-004`) and as Team Satvi's "Reuse Before Create" principle requires.

### 5.4 Lifecycle State Machine (implementation detail for the seven stages)

`WS12-003` §5 defines the seven stages and their Allowed/Invalid Transitions at the business level. This Architecture implements it as: a `CHECK`-constrained `current_stage` text column (matching the existing `workspace_users.role`/`vendors.lifecycle_state` convention — **no new generic state-machine library or column type is introduced**, per Project Instructions §21), with the allowed-transition table itself enforced in `journey-planning/service.ts`'s `advanceStage()` function — never at the database layer alone, and never as a free-text edit (`BR-004`/`BR-005`, already an established WS11 pattern this module inherits rather than reinvents).

---

## 6. Domain Model — Journey Planning Objects

Validating and extending the WS11 `WORKSPACE-DOMAIN-MODEL.md`'s treatment of Journey Planning's own objects against the now-ratified business model (`WS12-002`/`003`).

### 6.1 Journey Planning Record

Confirmed unchanged in shape from WS11's Domain Model §2.3, with three additions this Architecture proposes to close ratified business gaps WS11 could not have anticipated (it predates Decisions 1–3):

- `origin_channel` — new column, one of the eight ratified values (`FR-JP-06`/`07`).
- `corporate_contact_id` — new, nullable foreign key to `workspace_corporate_contacts` (§6.6), mutually exclusive with `traveller_id` via a `CHECK` constraint (`FR-JP-09`/`10`).
- The existing `BR-010` partial unique index (WS11 Domain Model §2.3) is extended to key on **either** `traveller_id` or `corporate_contact_id`, not `traveller_id` alone, so a Corporate-enquiry-origin record is covered by the same duplicate-prevention invariant.

Aggregate root: owns Proposal (and its Versions), Vendor Quotations, Discovery Notes, Activities — unchanged from WS11 Domain Model §3, with Activity added as a sixth child type (WS11 did not model it separately; `WS12-003` §6.10 does).

### 6.2 Proposal and Proposal Version — resolving a genuine WS11/WS12 divergence

**Disclosed, not silently resolved (Project Instructions §17):** WS11's Domain Model (§2.5, written 14-Sep-2026) modelled only a `Proposal Version` entity, describing it in language that treats it as the primary traveller-facing object ("a traveller-facing document created by Search My Vacation"). The subsequent, later-dated Product Owner ratification (`WS12-002` Decision 1, 19-Sep-2026) corrects this: **Proposal** is the primary object (exactly one active per record); **Proposal Version** is its revision history, not a separate primary object. WS11's proposed *persistence mechanism* — an append-only table with an `is_current` flag, one row per version, a partial unique index enforcing exactly one current row per record — already technically satisfies the ratified model's cardinality constraint. What it lacks is a **stable identity for "the Proposal" that survives across versions**, which the ratified model and the UX specification both need: `FR-JP-14`/`15` speak of "the Proposal" as a persistent thing being revised, and JP-05/JP-07 present "the Proposal" as a persistent screen with subordinate version history, not a bare list of version rows.

**Architecture decision (`AD-WS12-002`, Proposed):** introduce a thin `workspace_proposals` header table (`proposal_id`, `journey_planning_record_id` — unique, enforcing exactly one Proposal per record structurally, not only by application check — `current_version_id`, `status` [`draft`/`shared`], `created_at`), with `workspace_proposal_versions` (WS11's already-designed shape, unchanged) carrying `proposal_id` as its parent reference instead of `journey_planning_record_id` directly. This is the smallest possible correction that makes the now-ratified business model (Proposal primary, Version subordinate) structurally true, rather than merely true by convention — consistent with Team Satvi's "make the wrong action difficult to reach rather than merely possible-but-warned-against" principle already applied at the UX layer (`WS12-004` §2) and now carried into the schema. **Alternative considered and rejected:** keeping WS11's single-table shape and treating "the Proposal" as a purely conceptual aggregation of version rows with no table of its own — rejected because it gives the API boundary (§8) and the audit trail (§10) no stable Proposal identity to reference, and because a genuinely single-row-per-record `is_current` constraint, while enforceable, does not read as an accurate implementation of "Proposal is the primary object" to a future engineer without re-deriving that intent from the version table's constraints alone.

### 6.3 Vendor Quotation

Confirmed unchanged from WS11 Domain Model §2.6 and Data Architecture §3 (owned by `journey-planning`). The one addition: `vendor_id` becomes a foreign key to the bootstrap `workspace_vendors` table (§6.4) rather than the fully-built Vendor Management entity WS11's Domain Model described, since that module (WS16) does not exist yet.

### 6.4 The Bootstrap Problem — Traveller, Vendor, and Journey (`AD-WS12-001`, Proposed)

**This is the most architecturally material finding of this card**, surfaced by direct repository inspection (§1) rather than assumed from prior documentation: WS11's Data Architecture (§3) assigns table ownership as follows — `workspace_travellers` to `traveller-hub` (**WS14**, a reserved identifier, zero engineering); `workspace_journeys` to `journey-workspace` (**WS13**, a reserved identifier, zero engineering); and (implicitly, via Vendor Quotation's foreign key) `workspace_vendors` to `vendor-management` (**WS16**, a reserved identifier, zero engineering). Journey Planning is the **first** Workspace Business Module to reach engineering, and it depends on all three of these not-yet-built aggregates for its own core Functional Requirements: `FR-JP-10` (Traveller association), `FR-JP-19`–`20` (Vendor Quotation referencing an existing Vendor), and `FR-JP-28` (conversion into exactly one Journey) — none of which Journey Planning can satisfy against a table that does not exist.

**Options considered:**

1. **Block WS12 engineering until WS13/WS14/WS16 are scoped and built.** Rejected — contradicts the Product Owner's own explicit `DEC-R1.3-012` guidance that the six reserved identifiers carry no implied sequencing and that Journey Planning was deliberately opened first; also contradicts `WS12-001`'s own confirmed finding (§7.4 there) that Journey Planning has no dependency on any of the other five reserved modules.
2. **Have Journey Planning silently expand its own scope to build the full Traveller Hub, Journey Workspace and Vendor Management modules.** Rejected outright — a severe violation of Project Instructions §20 (scope control) and §5 (Archie must not independently change product scope); those three modules have their own approved business capabilities (`WS12-002` §7, the wider Product Specification) far beyond what Journey Planning needs from them.
3. **Journey Planning creates minimal, field-accurate bootstrap tables for exactly the three referenced aggregates it needs, using the field-level shape WS11's own already-approved Domain Model already specified for Traveller (§2.2) and Journey (§2.4)** — and a comparably minimal shape for Vendor (§2.8), since no more than `FR-JP-19` requires — **with those tables later extended, never re-created, by WS13/WS14/WS16 when those workstreams are eventually scoped.**

**Decision: Option 3.** This is not new architectural design — every field named below already appears in WS11's Product-Owner-reviewed Domain Model; this card only sequences *when* the already-approved shape is first migrated, and by *which* workstream's engineering pass does so out of practical necessity. This is offered as architecture requiring **Tiger/Product Owner sign-off on sequencing**, not unilaterally enacted (Archie's own limits, Project Instructions §5) — specifically because it means WS12's own migration set will contain tables nominally "owned" by WS13/14/16 per WS11's Data Architecture, a state that must be explicitly disclosed to whichever team scopes those workstreams later so they extend rather than duplicate.

**Bootstrap table shapes (minimal, not the full future module):**

| Table | Fields (this card's minimal scope only) | Full future owner | What the future workstream adds |
|---|---|---|---|
| `workspace_travellers` | `id`, `full_name`, `mobile_number` (normalised, matched via the existing `journey-leads/validation.ts` logic per `AD-WS11-007`), `email` (nullable), `created_at` | Traveller Hub (WS14) | Operational Flags, Timeline (derived), repeat-traveller status, and any Traveller Hub-specific UI — none of which Journey Planning builds or needs |
| `workspace_vendors` | `id`, `organisation_name`, `vendor_type` (free text for this minimal scope), `lifecycle_state` (`prospective`/`active`/`inactive`, matching the terminology WS11 already corrected — `Deactivated` is never used), `created_at` | Vendor Management (WS16) | Service categories, geographic coverage, full contact model, Preferred Partner designation, performance notes |
| `workspace_journeys` | `id`, `journey_planning_record_id` (not-null, set once at conversion, never repointed — `BR-012`), `traveller_id` or `corporate_contact_id` (carried from the originating record), `destination_region`, `travel_dates`, `owner_id` (unclaimed by default, per the WS11 Domain Model's own explicit note that ownership does **not** carry over automatically, §2.4 there), `status` (`active`/`successfully_completed`/`cancelled`/`archived`), `created_at` | Journey Workspace (WS13) | Vendor Confirmations, Operational Readiness items, its own Tasks/Follow-ups extension, Documents, and the full Phase-2 delivery lifecycle |

`workspace_corporate_contacts` (§6.6) is a genuinely new, Journey-Planning-owned table, not a bootstrap of another module's future scope — it is addressed separately below because no other workstream currently claims it.

**Consequence for `FR-JP-28` (conversion):** the one-way conversion RPC (§6.5) inserts into this minimal `workspace_journeys` bootstrap table. It does **not** implement any Journey Workspace capability beyond row creation and the originating-record linkage `BR-012` requires — Journey Workspace (WS13), when scoped, extends the same table and builds its own module around it, per Team Satvi's "Evolution Over Replacement" principle, rather than Journey Planning building any part of WS13's actual operational surface.

### 6.5 The Conversion Operation

Confirmed as WS11 Domain Model/Data Architecture already prescribed (§2.4, §6 there): a single `SECURITY DEFINER` Postgres function, mirroring the existing `send_journey_passport_otp`/`claim_journey_passport_callback` transactional-RPC precedent already in this codebase. This function, invoked only from `journey-planning/service.ts`'s `recordDecision()` path when the outcome is Confirmed:

1. Validates the record is in stage Decision (rejects otherwise — `FR-JP-26`).
2. Validates no Journey already references this record (`FR-JP-30`, Single Business Object Principle — belt-and-suspenders alongside the not-null, never-repointed foreign key).
3. Inserts exactly one row into `workspace_journeys` (bootstrap shape, §6.4), carrying forward the Traveller-or-Corporate-Point-of-Contact association, destination/region, and current Proposal Version reference.
4. Sets the Journey Planning Record's stage to Closed/Confirmed.
5. Writes both audit-log entries (record closed, Journey created) in the same transaction.

No application code path outside this one function may insert a `workspace_journeys` row — the same structural guarantee WS11's Domain Model required (§2.4 there), now made concrete for Journey Planning's own implementation.

### 6.6 Corporate Point of Contact — resolving `OQ-B`

`WS12-003` §20 explicitly hands this Open Question to Architecture: is Corporate Point of Contact owned by Traveller Hub (as a corporate-flavoured Traveller variant) or an independent store?

**Resolved: independent store, owned by `journey-planning`.** `workspace_corporate_contacts` (`id`, `full_name`, `role_title`, `company_name`, `phone`, `email`, `created_at`), referenced by `workspace_journey_planning_records.corporate_contact_id` (§6.1).

**Rationale:** Traveller Hub's own Traveller entity (WS11 Domain Model §2.2, and `WS12-002`/`003`'s own citations of it) is specifically "the person(s) travelling" — a Corporate Point of Contact is not necessarily a traveller at all (a corporate travel coordinator arranging trips for others is the common real-world shape this object exists to capture, per the business narrative in `WS12-002` §9). Forcing it into Traveller Hub's model would require Traveller Hub to carry a "is this actually a traveller?" flag it has no other reason to need, and — per §6.4 — Traveller Hub does not exist as a workstream yet, so there is nothing to attach a variant to without engineering scope from WS14 arriving alongside WS12's own work, which `DEC-R1.3-012` does not require and `WS12-001` §7.4 confirms is unnecessary. Keeping it as Journey Planning's own table is the smaller, more reversible commitment: when Traveller Hub (WS14) is eventually scoped, it can choose to relate to (via a nullable reference) or absorb this table without Journey Planning needing to change — a strictly easier migration than the reverse. This is offered as **`AD-WS12-003`, Proposed**, for Tiger/Product Owner confirmation, consistent with `OQ-B`'s own framing as an item for this card to answer rather than merely restate.

### 6.7 Journey — reference boundary only

Per `PEB-001` and the Single Business Object Principle (already fully addressed in §6.4/§6.5): Journey Planning's relationship to Journey is create-once, read-never-again. No Journey Planning screen, service function, or repository query reads back from `workspace_journeys` after conversion beyond the one confirmation link the UX specification names (`WS12-004` §8.9, point 4 — a direct link shown once, at the moment of conversion, not an ongoing read relationship).

---

## 7. Data Architecture

### 7.1 Persistence — unchanged from WS11

`public` schema, `workspace_` table prefix, no ORM, hand-written PostgREST + `SECURITY DEFINER` RPC, additive timestamp-prefixed migrations under `supabase/migrations/` — every WS11 Data Architecture decision (§2 there) is inherited without modification.

### 7.2 New Tables (this EBC's proposed migration scope)

| Table | Owner (this card) | Notes |
|---|---|---|
| `workspace_journey_planning_records` | `journey-planning` | §6.1 |
| `workspace_proposals` | `journey-planning` | §6.2, new relative to WS11 |
| `workspace_proposal_versions` | `journey-planning` | §6.2, WS11 shape retained, re-parented |
| `workspace_vendor_quotations` | `journey-planning` | §6.3 |
| `workspace_discovery_notes` | `journey-planning` | Unchanged from WS11 Data Architecture §3 |
| `workspace_activities` | `journey-planning` | New — implements `WS12-003` §6.10's Activity object, absent from WS11's Domain Model |
| `workspace_corporate_contacts` | `journey-planning` | §6.6, new |
| `workspace_travellers` | Bootstrap — nominal future owner `traveller-hub` (WS14) | §6.4 |
| `workspace_vendors` | Bootstrap — nominal future owner `vendor-management` (WS16) | §6.4 |
| `workspace_journeys` | Bootstrap — nominal future owner `journey-workspace` (WS13) | §6.4 |

`workspace_tasks`, `workspace_follow_ups`, `workspace_notifications`, `workspace_audit_log` are **not created by this card** — they are `shared/`-owned per WS11 Data Architecture §3 and already exist in that document's approved (if not yet migrated) design; Journey Planning's engineering pass (Rad, WS12-006) is the natural point to also migrate these `shared/` tables for the first time, since Journey Planning is the first module that actually needs them, but their ownership boundary (`shared/`, not `journey-planning/`) is unchanged by this card. This is disclosed as an engineering-sequencing note for WS12-006, not an architecture decision of this card's own.

### 7.3 Key Constraints

- `workspace_journey_planning_records`: `CHECK ((traveller_id IS NOT NULL) <> (corporate_contact_id IS NOT NULL))` — exactly one, never both, never neither (`FR-JP-10`). Partial unique index on `(traveller_id, destination_region)` and on `(corporate_contact_id, destination_region)` `WHERE current_stage != 'closed_lost'` (`BR-010`, extended per §6.1). `CHECK` on `origin_channel` (eight values) and `current_stage` (seven values), matching the `workspace_users.role` `CHECK` convention already shipped.
- `workspace_proposals`: unique on `journey_planning_record_id` (structurally enforces "exactly one Proposal per record," §6.2).
- `workspace_proposal_versions`: partial unique index on `(proposal_id) WHERE is_current`, matching WS11's original mechanism.
- `workspace_journeys` (bootstrap): unique, not-null `journey_planning_record_id` — the one-way, never-repointed conversion link (`BR-012`).
- No `DELETE` grant, no `delete()` repository function, for `workspace_journey_planning_records` or `workspace_journeys` (archive-only, `AD-WS11-011` extended to these new tables). `workspace_proposals`/`_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes`, `workspace_activities` follow the same archive-only posture as their parent record, since none is independently meaningful once detached from it.

### 7.4 Row Level Security

Extending `AD-WS11-002`'s already-Approved pattern (Supabase Auth + RLS, `authenticated` role granted `SELECT`/`INSERT`/`UPDATE` on `workspace_*` tables subject to policy, `service_role` retains full access for the conversion RPC) — no new authentication mechanism, no new grant pattern. Per the Product Owner's own WS11 clarification (Data Architecture §4, "Workspace is a collaborative operational platform... authenticated Workspace Users may view shared operational information unless an Approved Business Requirement explicitly requires otherwise"): Journey Planning Records, Proposals, Vendor Quotations, Discovery Notes and Activities are **readable by any authenticated Workspace User** (matching `WS12-003` §10's Permissions table, which grants read access broadly), with `UPDATE`/ownership-changing policies scoped to the acting user's own claimed records **or** the `administrator` role (via `workspace_current_user_role()`, already shipped) — implementing `FR-JP-22`/`23` at the RLS layer for defence-in-depth, alongside the application-layer permission check (§10), consistent with WS11 Data Architecture §4.3's own stated reasoning for choosing Postgres-native RLS over application-code-only authorisation.

`workspace_vendor_quotations` carries no policy granting any non-staff, non-`authenticated` access at any grant level — implementing `FR-JP-21`'s internal-only boundary structurally, not only through the absence of a vendor-facing UI.

### 7.5 Audit and Versioning

Reuses `workspace_audit_log` (`shared`, WS11-designed) unmodified in shape, with its `event_type` enumeration **extended** (not replaced) to cover Journey Planning's own events beyond WS11's original three (`stage_transition`, `reassignment`, `claim`): `proposal_version_created`, `proposal_sent`, `vendor_quotation_recorded`, `record_converted`. This satisfies `WS12-003` §13's audit requirement (every Proposal Version, every send, every Vendor Quotation, every Task/Follow-up) using the one existing generic, entity-agnostic audit table — not a second, Journey-Planning-specific log table, per Team Satvi's Single Source of Truth principle.

Versioning follows WS11's established append-only, current-flag pattern exactly (§6.2 above; Data Architecture §6).

---

## 8. Integration Architecture

### 8.1 Journey Passport / Lead Ingestion — unchanged

Journey Planning consumes the existing, already-designed `AD-WS11-007` adapter (`web/lib/workspace/journey-planning/leadIngestion.ts` — not yet built, since no module has needed it until now, but its shape is unchanged from WS11's own proposal) for the Website-enquiry origin channel specifically. The adapter never writes to `journey_passport_leads`; Journey Planning's own `origin_channel` model (§6.1, eight values) is a strict superset — the other seven channels have no external system to integrate with at all, and are simply Journey Planning Record creation with a different `origin_channel` value and no `journey_passport_lead_id` populated.

### 8.2 Traveller Hub, Vendor Management, Journey Workspace — bootstrap boundary, not integration

Per §6.4, these are not external integrations in the WS11 Integration Architecture's sense (a different, already-existing system this module reads from) — they are **not-yet-built internal modules whose future `repository.ts`/`service.ts` this card's bootstrap tables anticipate.** Journey Planning's own `repository.ts` is, for now, the only code that touches `workspace_travellers`, `workspace_vendors`, and `workspace_journeys` (write path; conversion RPC only for the last). When WS13/WS14/WS16 are eventually scoped, their own Architecture cards should treat these three tables exactly as WS11's Data Architecture treats every existing table this repository already has: read the schema Journey Planning shipped, extend it additively, and take over `repository.ts` ownership — never re-create the table. This boundary is recorded here explicitly so a future Archie pass on WS13/14/16 does not duplicate it.

### 8.3 Destination Intelligence — reference only, unchanged

Journey Planning Record's `destination_region` field references a Destination Profile (owned by `destination-intelligence`, WS17, also not yet built) exactly the way WS11's Domain Model already designed (§6.7 there) — read-only, nullable where a Destination Profile does not yet exist, matching the same pre-launch-authoring allowance `AD-WS11-006` already established for Destination Profile's own relationship to `geo_places`. No new reconciliation decision is needed; this card simply confirms Journey Planning follows the existing one.

### 8.4 API Boundary

New route namespace `web/app/api/workspace/journey-planning/**`, mirroring the existing `web/app/api/journey-passport/**` convention exactly (WS11 Solution Architecture §6, Integration Architecture §4) and the still-unbuilt-but-designed `web/app/api/workspace/**` namespace WS11 anticipated:

- `POST /api/workspace/journey-planning` — create (`FR-JP-06`–`11`).
- `POST /api/workspace/journey-planning/[id]/claim`
- `POST /api/workspace/journey-planning/[id]/advance-stage`
- `POST /api/workspace/journey-planning/[id]/reassign` (Administrator-only, `FR-JP-22`)
- `POST /api/workspace/journey-planning/[id]/proposal/versions` (create/revise) and `POST /api/workspace/journey-planning/[id]/proposal/send`
- `POST /api/workspace/journey-planning/[id]/vendor-quotations`
- `POST /api/workspace/journey-planning/[id]/decision` (the Confirm/Lost/Archived outcome — invokes the conversion RPC on Confirmed, §6.5)

Every route requires an authenticated session (`requireWorkspaceUser()`, already shipped) — no public surface, consistent with `WS12-004`'s own confirmation that Journey Planning is an internal-only tool with no traveller-facing interface (§18 there).

### 8.5 Notifications

Reuses `shared/notifications`' `emit()` pattern (WS11 Solution Architecture §5) synchronously, within the same request as the triggering write — for every trigger `WS12-003` §11 names except the one threshold-based trigger (unclaimed-record), which follows WS11's own already-designed Vercel Cron pattern (Integration Architecture §5) unmodified; Journey Planning's `service.ts` supplies the query `check-thresholds` calls, not a new scheduling mechanism.

### 8.6 External Services

No new external service is introduced. Resend email integration remains conditional on `OQ-008` (Notification delivery channel), exactly as WS11 left it — Journey Planning does not resolve that Open Question and does not need to; its Notification *generation* is channel-agnostic per the existing design.

---

## 9. Application Services

| Service function (`journey-planning/service.ts`) | Implements | Calls |
|---|---|---|
| `createRecord()` | `FR-JP-06`–`11` | `validation.ts` (Mandatory Association), `repository.ts` (duplicate-check query, insert), `shared/audit` |
| `claimRecord()` | `FR-JP-02`/`03` | `shared/ownership`, `shared/audit` |
| `reassignRecord()` | `FR-JP-22` | `shared/rbac` (Administrator check), `shared/ownership`, `shared/audit` |
| `advanceStage()` | `FR-JP-05`/`26` | `validation.ts` (transition table, §5.4), `shared/audit`, `shared/notifications` |
| `createProposalVersion()` / `reviseProposal()` | `FR-JP-14`–`15` | `repository.ts` (enforces one-active-Proposal via the unique constraint, §7.3) |
| `sendProposalVersion()` | `FR-JP-16` | `shared/audit`, `shared/notifications` |
| `recordVendorQuotation()` | `FR-JP-19`–`21` | `repository.ts` against the bootstrap `workspace_vendors` table (§6.4) |
| `recordDecision()` | `FR-JP-27`–`30` | The conversion RPC (§6.5) on Confirmed; `shared/audit`, `shared/notifications` on any outcome |
| `checkDuplicate()` | `FR-JP-08` | Read-only, called both at creation-time UX (§9's inline pattern, `WS12-004` §8.1) and again defensively before the insert commits |

No service function in this module calls another module's `repository.ts` directly (`AD-WS11-004`'s dependency rule, reaffirmed) — where Journey Planning's own `repository.ts` currently owns the bootstrap tables (§6.4), that is Journey Planning's own repository, not a cross-module call, and is disclosed as a temporary condition (§6.4, §13) rather than a permanent exception to the rule.

---

## 10. Security Architecture

### 10.1 Authentication

Unchanged from WS11 — Supabase Auth, `workspace_users` profile table, already shipped and functioning (§1). Journey Planning introduces no new authentication mechanism.

### 10.2 Authorisation — extending the RBAC stub

The single most material security-architecture task this card identifies: `shared/rbac/permissions.ts`'s `hasWorkspaceCapability()` is, today, a deliberate placeholder returning `true` only for `administrator` — its own comment states this is temporary, pending the first module that needs a real capability matrix. **Journey Planning is that module.** This Architecture proposes extending `shared/rbac` (not replacing it, not building a parallel Journey-Planning-specific permission file) with capability functions matching `WS12-003` §10's Permissions table precisely:

```
canClaimRecord(user)                        → any authenticated Workspace User
canReassignRecord(user, record)              → administrator only
canEditRecord(user, record)                  → administrator, or privilege_user who owns it
canAdvanceStage(user, record)                → administrator, or privilege_user who owns it
canRecordDecision(user, record)              → administrator, or privilege_user who owns it
canArchiveOutsideNormalClosure(user, record) → administrator only
```

This is the first genuine, record-scoped (not merely role-scoped) authorisation logic in the codebase — every function above needs the record's `owner_id`, not just the caller's role, which `hasWorkspaceCapability()`'s current single-argument shape cannot express. This is flagged explicitly for Rad (WS12-006) as a required, approved extension to `shared/rbac`, not a new module — consistent with `AD-WS11-004`'s module boundary (`shared/rbac` is exactly where centralised authorisation checks belong, per that document's own §4.1 table).

### 10.3 RBAC at the Data Layer

RLS policies (§7.4) provide defence-in-depth for the same rules `shared/rbac` enforces in application code — matching WS11 Data Architecture §4.3's own stated reasoning for RLS over application-code-only checks ("a single missed application-layer check would otherwise expose cross-user data").

### 10.4 Session Considerations

Unchanged from WS11 — server-validated Supabase session, no `service_role` key ever reaches client code (§1, confirmed shipped in `shared/supabase/browser.ts` vs. `server.ts`'s separation).

---

## 11. Performance Considerations

- **Expected usage:** an internal team tool, "an internal team tool" scale exactly as WS11's own architecture repeatedly characterises the whole Workspace initiative (`AD-WS11-001`, `AD-WS11-005`) — Journey Planning does not change this scale assumption.
- **Indexing:** standard B-tree indexes on `current_stage`, `owner_id`, `destination_region`, `origin_channel`, `created_at` on `workspace_journey_planning_records`, supporting the six-dimension filter/search requirement (`WS12-003` §12) without any additional infrastructure.
- **Caching:** none introduced, consistent with `AD-WS11-005`'s "no message queue, no new infrastructure at this scale" reasoning — Server Component reads hit Postgres directly, as every other Workspace read already does.
- **Queue-scan performance at volume (conceptual only, per this EBC's own scope boundary):** Sophie's UX specification already flags this as a risk (`R-UX-1`, `WS12-004` §19) and records a future kanban-board iteration as a Future UX Opportunity (§20 there), contingent on real production volume. This Architecture does not propose a materialized view or read-model optimisation now — no evidence of the actual record volume exists yet to justify one — but records it as a Future Architecture Opportunity (§15) should `R-UX-1` prove out in practice.

---

## 12. Error Handling Strategy

Extends the existing typed-error convention (`JourneyLeadRepositoryError`, `JourneyLeadSubmissionError`, `JourneyCallbackProcessingError` — confirmed shipped, §1) rather than introducing a new error-handling library or pattern:

| Layer | Error type | Examples |
|---|---|---|
| Business/validation failure | `JourneyPlanningValidationError extends Error` | Missing/dual association (`FR-JP-09`/`10`); invalid stage transition (`FR-JP-26`); a second active Proposal attempted (`FR-JP-14`) |
| Repository/data failure | `JourneyPlanningRepositoryError extends Error` | Constraint violation surfaced from Postgres (the `CHECK`/unique-index constraints in §7.3), connection failure |
| Integration failure | Reuses the existing typed pattern at the call site (e.g. a `journey_passport_leads` read failure surfaces through the existing `JourneyLeadRepositoryError`, not a new Journey-Planning-specific wrapper around someone else's table) | Lead-ingestion adapter read failure |

Every API Route Handler under `web/app/api/workspace/journey-planning/**` catches these typed errors and returns a typed error response, matching `web/app/api/journey-passport/leads/route.ts`'s existing shape — no new response-envelope convention is introduced.

---

## 13. Architecture Risks

| # | Risk | Severity | Mitigation / Disclosure |
|---|---|---|---|
| R-AR-1 | **Sequencing risk from the bootstrap tables (§6.4).** If WS13 (Journey Workspace), WS14 (Traveller Hub) or WS16 (Vendor Management) are scoped by a future Archie pass without reading this document, there is a real risk of that pass proposing a second, conflicting `workspace_travellers`/`workspace_journeys`/`workspace_vendors` table, or duplicating logic Journey Planning already owns | **High** | This document is the disclosure. Recommend Tiger record a standing cross-reference from any future WS13/WS14/WS16 EBC back to this card's §6.4/§8.2, and recommend the future Archie pass's own Repository Readiness Check include reading this document specifically, not only the WS11 baseline |
| R-AR-2 | The bootstrap tables' minimal field sets (§6.4) may not match what WS13/14/16's own future, fuller Business Analysis eventually requires, forcing a migration rather than a clean extension | Medium | Every field in the bootstrap shapes traces directly to WS11's own Product-Owner-reviewed Domain Model (§2.2, §2.4, §2.8 there) — the risk is bounded to genuinely new fields those future Business Analyses surface, not a wholesale redesign |
| R-AR-3 | `shared/rbac/permissions.ts`'s extension (§10.2) is the first record-scoped (not just role-scoped) authorisation logic in this codebase; an implementation error here is a cross-user data exposure risk, the exact failure mode `AD-WS11-002`'s own reasoning for choosing RLS was meant to guard against | Medium | RLS (§7.4) provides a second, independent enforcement layer for the same rules — an application-layer bug does not, by itself, expose data, matching WS11's own defence-in-depth reasoning |
| R-AR-4 | `OQ-A` (traveller communication channel) remains unresolved and this card does not resolve it (§8, deliberately) — Discovery Notes remain the interim capture mechanism the UX specification already adopted (`R-UX-2`, `WS12-004` §19); no schema decision in this document assumes a specific future resolution, so none needs to be revisited when it is answered | Low | No mitigation needed — disclosed as deferred, consistent with the UX specification's own handling |
| R-AR-5 | The queue-scan performance concern (`R-UX-1`) is real but unquantified — no production data exists yet to size it | Low | Recorded as a Future Architecture Opportunity (§15), not designed against speculatively |
| R-AR-6 | `shared/` tables (`workspace_tasks`, `workspace_follow_ups`, `workspace_notifications`, `workspace_audit_log`) are approved in design (WS11 Data Architecture §3) but, per this session's repository inspection, **not yet migrated** — Journey Planning's engineering pass is the first to need them and will necessarily be the first to migrate them | Low | Disclosed as an engineering-sequencing note (§7.2) for Rad, not an architecture risk requiring a design change — the design itself is already WS11-approved |

---

## 14. Future Architecture Opportunities (Not Current Scope)

- **A materialized read-model or summary view for the Journey Planning queue**, should `R-UX-1`'s scan-performance concern prove real at production volume — pairs naturally with Sophie's own recorded kanban-board future opportunity (`WS12-004` §20), but is not designed now for lack of evidence.
- **Formal extraction of `workspace_travellers`/`workspace_vendors`/`workspace_journeys` repository ownership** into their own `traveller-hub`/`vendor-management`/`journey-workspace` modules once WS13/14/16 are scoped — the natural resolution of §6.4/§8.2's bootstrap boundary, explicitly anticipated rather than merely possible.
- **A resolution to `OQ-A`** (traveller communication channel) may eventually warrant a dedicated `workspace_communications` table and its own tab on JP-02, replacing the Discovery-Notes-as-communication-log workaround — not designed here, per §8's own deferral.
- **A UI component/data-grid library** for dense operational interfaces, already recorded as `FCR-023` at the WS11 baseline — Journey Planning's own Queue and filter screens are the first concrete pressure-test of this gap, but this card does not select or introduce one, consistent with Project Instructions §21 (justify any new dependency) and the absence of a Product Owner decision to do so.

---

## 15. Traceability

| This document's decision | Business Analysis (`WS12-003`) | UX (`WS12-004`) | Product Owner Decision |
|---|---|---|---|
| Seven-stage `CHECK`-constrained lifecycle (§5.4) | §5 | §5, §18 Decision 1 | `PD-JP-005` |
| Proposal/Proposal Version two-table model (§6.2) | §6.2–6.3 | §18 Decision 2 | Ratified Decision 1 (`WS12-002`) |
| Mandatory Association `CHECK` constraint (§6.1, §7.3) | §7, §9 (`FR-JP-09`/`10`) | §8.1, §18 Decision 4 | Ratified Decision 2 (`WS12-002`) |
| Duplicate-prevention partial unique index (§7.3) | §7, §9 (`FR-JP-08`) | §8.1, §18 Decision 5 | Ratified Decision 2 (`WS12-002`) |
| Bootstrap tables for Traveller/Vendor/Journey (§6.4) | §6.1, §6.4, §6.12 (object existence, not persistence) | — (UX does not address persistence) | `DEC-R1.3-012` (no implied sequencing); `WS12-001` §7.4 (no dependency on other modules) |
| Corporate Point of Contact as independent table (§6.6) | §20 `OQ-B` (handed to Architecture) | §7 JP-08, §19 `R-UX-3` | This card's own resolution, `AD-WS12-003` |
| One-way conversion RPC (§6.5) | §7 (`FR-JP-28`–30), §8 | §8.9 | `BR-012`; Ratified Decision 3; `PEB-001` |
| No Reopen control / no data path (§6.5, §7.3) | §7 (`FR-JP-29`) | §8.10, §18 Decision 3 | Ratified Decision 3 |
| Vendor Quotation internal-only RLS (§7.4) | §7 (`FR-JP-21`) | §2, §18 Decision 6 | Ratified Decision 1 |
| `shared/rbac` extension (§10.2) | §10 | — | `DEC-R1.3-009` (Administrator/Privilege User operating model) |

---

## 16. Architecture Review Checklist

- [x] Product decisions preserved — every ratified decision (Proposal Model, Entry Model, Single Business Object Principle) is implemented, not reinterpreted; §6.2 explicitly corrects WS11's *own* earlier, pre-ratification treatment rather than any Product decision.
- [x] UX preserved — every screen, flow and component in `WS12-004` maps to a concrete structural element above (§5.2, §5.3); no UX decision (stage-grouped list over kanban, no Reopen control, Proposal Version subordinate to Proposal, blocking-only-where-genuinely-required validation) is second-guessed by this Architecture.
- [x] No engineering introduced — no migration SQL, no Route Handler code, no component code is written by this card; §5–§10 define structure and constraints for Rad (WS12-006) to implement against.
- [x] Workspace Foundation reused — every structural pattern (module five-file convention, Supabase Auth/RLS, Server Components for reads, API routes for writes, `workspace_` prefix, archive-not-delete, append-only versioning, shared audit/notifications/ownership) is inherited from the WS11 baseline, verified shipped by direct repository inspection, not merely assumed from documentation.
- [x] Repository First followed — §1 records what was actually found in the repository (one migration, `ComingSoon` placeholder, the RBAC stub), and §6.4/§10.2's two most material decisions are driven directly by that inspection, not by the WS11 documents' description of an intended future state.
- [x] No unapproved scope expansion — the bootstrap tables (§6.4) are the minimal WS11-already-approved shape, explicitly bounded against building any part of WS13/14/16's own future capability; flagged for Tiger/Product Owner sign-off rather than unilaterally enacted.

---

## 17. Explicit Non-Goals — Confirmed Observed

Per this EBC's own instruction, this document does **not**: modify any Product Owner decision; redesign any UX decision; implement code; create database migrations; define detailed API request/response contracts beyond the route list in §8.4; create test cases; or perform engineering planning. All of the above are confirmed absent from this document by its own review.

---

## Deliverables Created (Mandatory)

**Primary deliverable:** `docs/09-Development/EBC-R1.3-WS12-005-ARCHIE-Solution-Architecture-Journey-Planning.md` — this document.

**Supporting deliverables:** No supporting architecture documents created under `docs/20-Architecture/journey-planning/`. Per this EBC's own instruction to avoid documentation for its own sake, this single document is judged sufficient — it is materially self-contained (domain model, data architecture, integration architecture, security architecture and decision register are each a section here, not a separate WS11-style document set) because Journey Planning is one module extending an already-fully-documented Foundation, not a second platform requiring its own six-document architecture package.

---

## Repository Verification (Mandatory)

| Check | Result |
|---|---|
| Repository connected | Yes, throughout this session |
| Branch confirmed | `main` |
| Working tree reviewed before and after | Before: 7 commits ahead of `origin/main`, one pre-existing untracked file (`EBC-R1.3-WS12-004`, not this card's). After this card's write: the same, plus this document as a second untracked file |
| Destination verified | `docs/09-Development/` exists; filename follows this workstream's exact naming convention |
| File written successfully | Yes |
| Only intended repository file modified | Yes — this document only. No Product, UX, or other Architecture document was opened for writing; no code file was created or modified; no migration was written |
| Repository ready for Tiger review | Yes |

---

## Repository Status (Mandatory)

- **Branch:** `main`.
- **Working tree:** not clean — 7 unpushed local commits (pre-existing, not from this card) and now two untracked `docs/09-Development/` files: `EBC-R1.3-WS12-004` (pre-existing, Sophie's) and this card's own `EBC-R1.3-WS12-005`. Neither commit nor push is performed by this card, per Project Instructions §26 — that remains the Product Owner's own action, consistent with this project's standing convention observed throughout the WS11/WS12 record.
- **Files created:** one — this document.
- **Files modified:** none.

---

## Recommended Next Workstream

**`EBC-R1.3-WS12-006` — Rad, Engineering Planning & Implementation Strategy.**

This is now unblocked: Business Analysis (`WS12-003`), UX Design (`WS12-004`) and Solution Architecture (this card) are all complete, internally consistent, and traceable to the same ratified business model. Rad's engineering-planning pass should specifically pick up two items this card flags rather than resolves: (1) the bootstrap-table migration sequencing (§6.4, §7.2) — including the `shared/` tables Journey Planning is first to need — and (2) the `shared/rbac` capability-function extension (§10.2). Both are structural decisions this document makes; Rad's job is sequencing and implementation, not re-deciding them.

**Recommendation to Tiger, not actioned by this card:** the two Proposed architecture decisions this document introduces that carry sequencing implications beyond Journey Planning itself — `AD-WS12-001` (bootstrap tables) and `AD-WS12-003` (Corporate Point of Contact ownership) — should receive explicit Product Owner/Tiger sign-off before Rad begins implementation, consistent with how `AD-WS11-002`/`AD-WS11-006` were carried to ratification before WS11's own engineering began. `AD-WS12-002` (Proposal/Proposal Version two-table correction) is lower-stakes and implementation-detail-shaped, but is listed alongside them for completeness.

---

## Confirmations

- Only this Solution Architecture document was created. No Product, UX, code, configuration, schema, or Supabase object was created, modified, or removed.
- No Product Discovery, Business Analysis, UX redesign, Engineering implementation, or QA activity was performed.
- No Product Owner decision was altered — the seven-stage lifecycle, the ratified Proposal Model, the Journey Planning Entry Model, and the Single Business Object Principle are all implemented as ratified; §6.2's correction is to WS11's own pre-ratification architecture, not to any Product decision.
- No UX decision was altered — every screen, flow, and component decision in `WS12-004` is preserved and mapped to a structural element.
- The Workspace Foundation was reused throughout; no duplicate service, business object, or parallel architectural model was introduced except where explicitly disclosed and justified (the three bootstrap tables, §6.4, and the Corporate Point of Contact table, §6.6) — both flagged for Tiger/Product Owner sign-off rather than unilaterally enacted.
- Repository connected, branch and working tree verified before and after; only this one file was created; nothing was committed or pushed (Project Instructions §26).

---

*Prepared by Archie, Technical Architect, on behalf of Team Satvi, per `EBC-R1.3-WS12-005`. This Solution Architecture is Journey Planning's canonical architectural baseline and is submitted for Tiger/Product Owner review ahead of Engineering Planning (`WS12-006`, Rad).*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01CQAUWQwrdH7DwMbUSbauKt
