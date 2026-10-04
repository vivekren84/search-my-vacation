# Search My Vacation

# Technical Debt Register

```text
Document Type : Engineering Governance Register (documentation only — no code, no configuration, no schema change)
Release       : Established during Release 1.3 (`EBC-R1.3-WS12-008`); intended to remain live and release-independent across future releases
Persona       : Tiger — Programme and Delivery Lead
Status        : ACTIVE — 11 open items (TD-WS12-001 to -005, TD-WS13-001 to -006); none resolved (updated 4-Oct-2026, `EBC-R1.3-WS13-021`)
Owner         : Rad (Engineering and Implementation Specialist) — day-to-day custodian; Tiger — governance and prioritisation oversight
Related documents : docs/10-Backlog/RELEASE-1.3-BACKLOG.md §9 (historical, WS5-sourced Engineering Technical Debt — superseded for new entries, not migrated); docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md; docs/10-Backlog/FUTURE-CONSIDERATIONS.md; docs/10-Backlog/RELEASE-1.3.md; docs/09-Development/EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md
Distinct from : RELEASE-1.3-BACKLOG.md (product decisions, candidate features and vision items — not engineering-internal quality items), PRODUCT-EVOLUTION-BACKLOG.md (Product Owner-approved future business capabilities, module/workstream-scale), FUTURE-CONSIDERATIONS.md (tactical items a completed workstream's own review explicitly deferred, spanning any discipline — Product, UX, Architecture or Engineering), RELEASE-1.3-GOVERNANCE-BACKLOG.md (process/playbook recommendations). This register holds only engineering-internal quality debt — code, architecture, performance, accessibility, security, infrastructure, developer experience, documentation and testing — never product enhancements, feature requests, roadmap items or future releases. See Section 6 for the full relationship analysis.
```

## Document Information

| Field | Value |
|---|---|
| Origin EBC | `EBC-R1.3-WS12-008` — Tiger, Technical Debt Register Establishment |
| Context | Raised during WS12 (Journey Planning) Engineering Phase 2, following successful engineering smoke validation (`EBC-R1.3-WS12-007`) |
| Explicitly out of scope | Product enhancements, feature requests, roadmap items, future-release scope. None of those belongs here — they continue to be tracked in the Product Backlog (`RELEASE-1.3-BACKLOG.md` and, for module-scale future capability, `PRODUCT-EVOLUTION-BACKLOG.md`). |
| Canonical Copy | This document (`docs/10-Backlog/TECH-DEBT.md`) is the canonical source of truth. A working copy is also maintained in the Claude Project for governance traceability, but this repository document governs in the event of any difference — consistent with this project's established convention. |

## Document Change History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 21-Sep-2026 | Tiger | Initial establishment, per `EBC-R1.3-WS12-008`. Defines the Technical Debt Register's purpose, ownership, prioritisation model, lifecycle, and its relationship to the Product Backlog and Release Planning. Defines nine debt categories and the standard entry format. Seeds three initial entries (`TD-WS12-001`–`003`) identified during WS12 engineering smoke validation. Cross-referenced from `RELEASE-1.3-BACKLOG.md` §9 and `PRODUCT-EVOLUTION-BACKLOG.md`'s "Distinct from" table (one line each, disclosed in Section 11 below) — no product backlog item content changed. |
| 1.1 | 22-Sep-2026 | Rad | Lifecycle review per `EBC-R1.3-WS12-010` (QA Defect Resolution). `TD-WS12-001`, `TD-WS12-002`, `TD-WS12-003` reviewed: none marked Resolved. `TD-WS12-001` annotated (not resolved) — WS12-010 incidentally added `id`/`name` attributes to the Journey Planning module's own form controls while fixing an unrelated defect; the register's own cross-Workspace scope is unaddressed, so Status remains Open. `TD-WS12-002`/`TD-WS12-003` untouched by WS12-010 (no images or preload changes made); Status remains Open on both. No entry deleted or renumbered. |
| 1.2 | 28-Sep-2026 | Rad | Added `TD-WS13-002` (fresh-replay constraint-name collision, OBS-P0-01) under new §10A, per `EBC-R1.3-WS13-005-P0` Addendum A. *Row added retrospectively on 30-Sep-2026 by Tiger (`EBC-R1.3-WS13-006`): the entry was added without a change-history row.* |
| 1.3 | 30-Sep-2026 | Tiger | Phase 0 synchronisation per `EBC-R1.3-WS13-006`. Logged the items `EBC-R1.3-WS13-004` GO-09 assigned to Tiger: `TD-WS13-001` (deprecated `workspace_journeys.status`), `TD-WS12-004` (SEC-02, JP `using (true)` UPDATE policies), `TD-WS12-005` (SEC-03, open notification INSERT). Added `TD-WS13-003` (unused `fetchWorkspaceUserRole`, OBS-P0-03). Set a suggested release on `TD-WS13-002`. Header status line brought current. |
| 1.4 | 1-Oct-2026 | Tiger | Phase 0 QA review per `EBC-R1.3-WS13-016`. Added `TD-WS13-004` (success toast not announced to screen readers, OBS-P0-QA-01) and `TD-WS13-005` (browser session kept after authorisation refusal, OBS-P0-QA-06). Other QA observations reviewed and not logged as debt (planned work, UX decisions or unconfirmed performance findings — see the card's §C). |
| 1.5 | 4-Oct-2026 | Tiger | Phase 1 implementation authorisation per `EBC-R1.3-WS13-021` / `DEC-R1.3-026`. Added `TD-WS13-006` (deactivation not enforced in RLS read policies; Archie AR-F1, `EBC-R1.3-WS13-020A` AC-8), routed to the RLS hardening card with `TD-WS12-004`/`-005`; `OBS-P1-04` noted for the same card. Phase 1 dispositions of `TD-WS13-003`/`-004`/`-005` (In) and `TD-WS13-001`/`-002` (Deferred) are recorded in `EBC-R1.3-WS13-020` Rev 2 §11; entries unchanged until resolved. |

---

## 0. Workspace Readiness Check (Project Instructions §14, and the standing "repository-first" principle established in `EBC-R1.3-WS12-003`'s Prerequisites)

| Check | Result |
|---|---|
| Local repository connection this session | Connected — folder access confirmed for `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed |
| Branch | `main` |
| Working tree before this task | **Not clean, but not created by this task.** Two pre-existing modified files (`web/app/workspace/(dashboard)/journey-planning/page.tsx`, `web/lib/workspace/shared/rbac/permissions.ts`) and a substantial set of pre-existing untracked files — ten Supabase migrations, the Journey Planning API/UI/service-layer source tree, and `docs/09-Development/EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md` — all attributable to Rad's WS12-007 engineering implementation, awaiting the Product Owner's own commit per this project's standing convention (§26). None of this pre-existing state is touched by this activity. |
| Repository structure | Confirmed — `docs/10-Backlog/` exists; no folder created, moved, or renamed |
| Existing documentation reviewed | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (§9, Engineering Technical Debt — found to already exist, see Section 6 below); `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md`; `docs/10-Backlog/RELEASE-1.3.md` (Decision Log, WS12 row); `docs/00-Project-Compass/DOCUMENT-INDEX.md` (checked — does not systematically catalogue individual `docs/10-Backlog/` files; no update made there, consistent with `PRODUCT-EVOLUTION-BACKLOG.md`'s own precedent of not requiring one); `docs/09-Development/EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md` (reviewed for corroborating detail — see Section 10 note) |
| Unauthorised folder creation | None — this document is placed in the existing `docs/10-Backlog/` folder, per this card's own Deliverable 1 |
| Canonical source | This repository document, once committed, is the canonical Technical Debt Register. A Claude Project copy is maintained for governance traceability but does not govern in the event of any difference. |

---

## 1. Purpose

Engineering work surfaces small, non-blocking quality findings that are correct to note and incorrect to action immediately — a missing HTML attribute, a performance recommendation, a build-tool warning. Until now, this repository had no dedicated home for that class of finding. `RELEASE-1.3-BACKLOG.md` §9 carries an "Engineering Technical Debt" section, but it is scoped specifically to the Release 1.2 WS5 Engineering Review (Section 6 below explains why that scope does not extend forward), and no other register is engineering-owned or accessible independent of a specific release's own backlog document.

Without a dedicated, durable register, such findings either get lost in EBC prose (visible only by reading every implementation report in full) or get inflated into full backlog/feature items that dilute the Product Backlog's own release-scoping purpose. The Technical Debt Register is that dedicated home: an engineering-owned, release-independent register for architectural, code-quality, performance, accessibility, security, infrastructure, developer-experience, documentation and testing debt — populated as work happens, referenced by ID from implementation reports, and worked down as engineering capacity allows.

---

## 2. Scope

### 2.1 In Scope

- Architectural cleanup and refactoring opportunities identified during implementation.
- Code-quality issues (duplication, inconsistent patterns, missing abstractions) that do not block acceptance criteria.
- Performance findings (layout shift, bundle size, unnecessary re-renders, missing caching) below the threshold of a release-blocking defect.
- Accessibility gaps found through tooling (browser DevTools, linting) rather than through a dedicated accessibility/QA review.
- Security hardening items that are not active vulnerabilities requiring immediate remediation.
- Infrastructure and build-tooling findings (deployment configuration, dependency hygiene, build warnings).
- Developer-experience friction (slow local builds, unclear conventions, missing tooling).
- Documentation gaps internal to engineering (missing code comments, absent architecture notes) — distinct from product/UX documentation.
- Testing gaps (missing automated coverage, manual-only validation that should be automated).

### 2.2 Explicitly Out of Scope

- **Product enhancements and feature requests** — belong in `RELEASE-1.3-BACKLOG.md` (current release) or `PRODUCT-EVOLUTION-BACKLOG.md` (future, module-scale capability).
- **Roadmap items** — belong in `docs/02-Product/PRODUCT-ROADMAP.md`.
- **Future releases** — this register carries no target release or sprint commitment; see Section 5 (Lifecycle) and Section 7 (Relationship with Release Planning).
- **UX/interaction improvements to already-scoped features** — belong in `RELEASE-1.3-BACKLOG.md`'s UX Improvements section, unless the finding is purely an accessibility-tooling output with no interaction-design judgment involved (see Section 8.4).
- **Active defects blocking an acceptance criterion** — those return to Rad through the originating EBC's own defect/remediation cycle (Project Instructions §29), not this register. This register is for debt, not open bugs.

---

## 3. Ownership

- **Rad (Engineering and Implementation Specialist)** is the day-to-day custodian: logging new items discovered during implementation or engineering validation, proposing category/priority, and (once actioned) implementing the resolution.
- **Tiger (Programme and Delivery Lead)** holds governance oversight: confirming an item's categorisation, sequencing it against release/workstream priorities, and keeping this register's own structure and cross-references current.
- **Archie (Technical Architect)** is consulted for any item classified Architecture, or for any item whose resolution would materially change application architecture, data models, or integration boundaries (Project Instructions §5, Architecture approval triggers).
- No item in this register is self-approved: an item Rad logs is not the same as an item Rad has been authorised to resolve. Resolution still requires the same EBC-based authorisation discipline as any other repository change (Project Instructions §19).

---

## 4. Prioritisation

| Priority | Meaning |
|---|---|
| Critical | Actively degrading production reliability, security, or data integrity, but not yet severe enough to be treated as a release-blocking defect. Should be escalated to Tiger immediately, not left to routine prioritisation. |
| High | Meaningful risk or cost if left unaddressed across multiple release cycles (e.g. missing automated regression coverage for a critical flow). |
| Medium | Real but bounded impact; reasonable to defer to a dedicated hardening pass. |
| Low | Minor, isolated impact (e.g. a single accessibility attribute, a single performance recommendation). |
| Very Low | Informational; worth recording so it isn't re-discovered and re-investigated from scratch, but carries negligible standalone impact. |

Priority is set by whoever logs the item (typically Rad) and may be revised by Tiger during periodic review (Section 5). Priority in this register does not carry a release/sprint commitment — see Section 7.

---

## 5. Lifecycle

```text
Open → Acknowledged → Scheduled → In Progress → Resolved
                    ↘ Won't Fix (with recorded rationale)
                    ↘ Superseded (with recorded rationale, e.g. absorbed by a later architectural change)
```

- **Open** — logged, not yet reviewed by Tiger.
- **Acknowledged** — reviewed by Tiger; category, priority and workstream confirmed or corrected.
- **Scheduled** — assigned to a specific future release, sprint, or engineering hardening pass (Suggested Release / Sprint field updated from "Not yet scheduled" to the actual target).
- **In Progress** — an approved EBC authorising the resolution is active.
- **Resolved** — implemented, verified (per Project Instructions §28, checks actually run, not assumed), and the resolving EBC/commit referenced.
- **Won't Fix** / **Superseded** — closed without implementation; rationale recorded in the entry itself, item never silently deleted (this project's supersede-not-erase convention, consistent with `RELEASE-1.3-FEATURE-REGISTER.md`'s and `RELEASE-1.3.md`'s own practice).

This register is reviewed periodically by Tiger (at minimum, at each workstream's engineering-phase closure) to move items through this lifecycle and to confirm no item has silently stalled.

---

## 6. Relationship with the Product Backlog

**Disclosed finding, not silently resolved:** `RELEASE-1.3-BACKLOG.md` already contains a Section 9, "Engineering Technical Debt," with nine entries (`TD-R1.3-001`–`009`), all sourced from the Release 1.2 WS5 Engineering Review and formally deferred into Release 1.3 (`DEC-R1.2-020`–`025`). That section is **not renamed, renumbered, migrated, or otherwise altered** by this card — its nine entries remain exactly as recorded, a historical, review-specific register tied to WS5's own governance trail.

**Going forward, the two registers are distinguished as follows:**

| | `RELEASE-1.3-BACKLOG.md` §9 | `docs/10-Backlog/TECH-DEBT.md` (this document) |
|---|---|---|
| ID prefix | `TD-R1.3-###` | `TD-WS<workstream>-###` |
| Scope | Historical — WS5 Engineering Review 1 only, closed | Live — any workstream, ongoing |
| New entries accepted | No — that section is closed; its own Change History (v1.6) already records "Review 1 is now closed... every open observation now has a documented disposition" | Yes — this is the register for all new engineering technical debt from this point forward |
| Governance trail | WS5's own `EBC-R1.2-WS5-GOV-*` sequence | This document's own Change History, plus the originating implementation EBC per entry |

This mirrors the precedent already established for the Feature Register (`EBC-R1.3-GOV-002`, "`RELEASE-1.3-FEATURE-REGISTER.md` established as canonical going forward — `RELEASE-1.3.md` §15 marked superseded, not deleted or rewritten"). The same supersede-not-erase, cross-reference-not-migrate pattern is applied here.

**Distinction from the Product Backlog's non-technical-debt sections:** `RELEASE-1.3-BACKLOG.md`'s other sections (UX Improvements, WS3 Search Behaviour Observations, Homepage Improvements, and its core Decision/Candidate Feature sections) are unaffected and unrelated — those are product-facing or UX-facing items, never engineering-internal debt, and continue to belong there.

**Distinction from the Product Evolution Backlog:** `PRODUCT-EVOLUTION-BACKLOG.md` §2.1 already explicitly excludes "Engineering improvements — code-level refactoring, performance, or hardening work," pointing to "`RELEASE-1.3-BACKLOG.md` §9 (Technical Debt) or a future release's equivalent." That pointer is now updated to also name this document (Section 11 below) — the underlying principle (Product Evolution Items are module-scale business capabilities, never engineering-internal debt) is unchanged.

---

## 7. Relationship with Release Planning

This register carries no target release, sprint, or delivery commitment by default (`Suggested Release / Sprint` starts as "Not yet scheduled" on every new entry). Moving an item into a specific release or sprint is a Tiger sequencing decision, made during release planning, and is recorded by updating that item's own field plus its Status to **Scheduled** — the same evidence discipline Project Instructions §28 expects of any Definition-of-Done claim. This register does not, by itself, authorise implementation: an item reaching Scheduled or In Progress still requires its own approved EBC before Rad touches repository code, per Project Instructions §19.

---

## 8. Technical Debt Categories

### 8.1 Architecture
Structural or design-pattern debt — component boundaries, data flow, module coupling. Archie is consulted per Section 3.

### 8.2 Code Quality
Duplication, inconsistent patterns, missing abstractions, complexity that does not yet block delivery but increases the cost of future change.

### 8.3 Performance
Load time, rendering efficiency, bundle size, layout shift, caching, and related runtime-efficiency findings.

### 8.4 Accessibility
Findings from automated tooling (browser DevTools, linting, axe-style scanners) that surface a concrete technical gap (missing attribute, contrast ratio, ARIA wiring). A finding requiring interaction-design judgment (not merely a technical fix) is routed to Sophie/UX instead, per Section 2.2.

### 8.5 Security
Hardening opportunities that are not active, exploitable vulnerabilities (an active vulnerability is a defect, escalated immediately, not logged here at routine priority).

### 8.6 Infrastructure
Deployment configuration, environment/build pipeline, dependency hygiene, hosting-platform findings.

### 8.7 Developer Experience
Friction in the day-to-day engineering workflow — slow builds, unclear local-dev setup, missing internal tooling.

### 8.8 Documentation
Engineering-internal documentation gaps (code comments, architecture notes, runbooks) — distinct from product, UX, or user-facing documentation.

### 8.9 Testing
Missing or manual-only automated coverage, gaps in the `verify:*` script suite, and related test-infrastructure debt.

---

## 9. Standard Entry Format

Every entry records:

| Field | Description |
|---|---|
| ID | `TD-WS<workstream-number>-###`, sequential within that workstream (e.g. `TD-WS12-001`). A release-level or cross-workstream item uses `TD-GEN-###` instead. |
| Title | Short, specific, action-oriented. |
| Category | One of Section 8's nine categories. |
| Workstream | The workstream during which the item was identified (does not imply the resolution is scoped to that workstream). |
| Priority | Per Section 4. |
| Description | What was found, and how (tooling, review, manual observation). |
| Reason | Why this is debt rather than a defect, and why it is safe to defer. |
| Impact | The concrete consequence of leaving it unresolved. |
| Suggested Resolution | A proposed fix direction — not an authorisation to implement. |
| Suggested Release / Sprint | Target, or "Not yet scheduled." |
| Status | Per Section 5's lifecycle. |
| Date Logged | Date first recorded in this register. |

---

## 10. Initial Entries — WS12 Engineering Smoke Validation

**Source disclosure:** these three items were supplied verbatim in this card's own text (`EBC-R1.3-WS12-008`), attributed to Chrome DevTools output and Next.js console warnings observed during WS12 engineering smoke validation following `EBC-R1.3-WS12-007`. No standalone smoke-validation report documenting these specific findings was found committed to the repository or recorded in the Claude Project at the time of this update (`EBC-R1.3-WS12-007` itself does not mention them). Per this project's Source of Truth precedence (Project Instructions §17, "latest explicit instruction from the project owner" ranks above even a committed document), this card's own text is treated as sufficient authority to seed these three entries; recorded transparently rather than silently assumed, consistent with how this project has handled comparable gaps before (e.g. `EBC-R1.3-WS12-003` §0's disclosure of the WS12-002 ratification lag).

### TD-WS12-001 — Workspace form controls missing `id` / `name` attributes

| Field | Value |
|---|---|
| ID | `TD-WS12-001` |
| Title | Workspace form controls missing `id` / `name` attributes |
| Category | Accessibility |
| Workstream | WS12 — Journey Planning |
| Priority | Low |
| Description | Chrome DevTools reports form controls without `id` or `name` attributes, observed during WS12 engineering smoke validation. |
| Reason | A tooling-surfaced technical gap, not an interaction-design issue — routed here (Section 8.4) rather than to Sophie/UX. Does not block any WS12 acceptance criterion; forms remain functionally usable. |
| Impact | Degrades browser autofill; reduces accessibility (label/control association for assistive technology); reduces reliability of automated/tooling-based testing that targets controls by `id`/`name`. |
| Suggested Resolution | Review Workspace forms and provide consistent `id` and `name` attributes across form controls. |
| Suggested Release / Sprint | Not yet scheduled |
| Status | Open |
| Date Logged | 21-Sep-2026 |
| Note (22-Sep-2026, Rad, `EBC-R1.3-WS12-010`) | While resolving an unrelated QA defect, the Journey Planning module's own Create and Detail screen controls (`NewJourneyPlanningRecordForm.tsx`, `JourneyPlanningRecordDetailView.tsx`) incidentally gained `id`/`name` attributes on previously-bare inputs. This is disclosed for accuracy only — it does not resolve this item, since this entry's scope is Workspace-wide (all modules), not Journey Planning alone, and no project-wide form audit was authorised or performed. Status remains **Open**. |

### TD-WS12-002 — Explicit dimensions for Workspace lazy-loaded images

| Field | Value |
|---|---|
| ID | `TD-WS12-002` |
| Title | Explicit dimensions for Workspace lazy-loaded images |
| Category | Performance |
| Workstream | WS12 — Journey Planning |
| Priority | Low |
| Description | Chrome DevTools recommends explicit dimensions for lazy-loaded images to reduce layout shift, observed during WS12 engineering smoke validation. |
| Reason | A performance-tooling recommendation below release-blocking severity; no reported visual defect or acceptance-criterion failure. |
| Impact | Not itemised in the source card. General risk category DevTools flags for this class of finding is layout shift (Cumulative Layout Shift) during image load, which can affect perceived page stability. Recorded rather than assumed further, per this register's own no-invention discipline. |
| Suggested Resolution | Add explicit `width`/`height` (or CSS `aspect-ratio`) to Workspace lazy-loaded images. |
| Suggested Release / Sprint | Not yet scheduled |
| Status | Open |
| Date Logged | 21-Sep-2026 |

### TD-WS12-003 — Review Next.js preload warnings

| Field | Value |
|---|---|
| ID | `TD-WS12-003` |
| Title | Review Next.js preload warnings |
| Category | Performance |
| Workstream | WS12 — Journey Planning |
| Priority | Very Low |
| Description | Review preload warnings produced during development and determine whether optimisation is beneficial, per console output observed during WS12 engineering smoke validation. |
| Reason | Explicitly framed by the source as an investigation item ("determine whether optimisation is beneficial"), not a confirmed defect — appropriately Very Low until reviewed. |
| Impact | Not itemised in the source card. Informational at present; a bundling/resource-loading inefficiency is possible but unconfirmed pending review. |
| Suggested Resolution | Review the console preload warnings during a future Next.js/build-tooling audit; determine whether a resource-hint or bundling change is warranted before taking any action. |
| Suggested Release / Sprint | Not yet scheduled |
| Status | Open |
| Date Logged | 21-Sep-2026 |

---

## 10A. WS13 Entries

`TD-WS13-001` was reserved for Tiger's log per `EBC-R1.3-WS13-004` GO-09; it is recorded below (30-Sep-2026, `EBC-R1.3-WS13-006`) together with the two WS12 security items GO-09 also assigned (`TD-WS12-004`, `TD-WS12-005`, in §10B).

### TD-WS13-002 — Constraint-name collision prevents a fresh replay of migration `20260921070200`

| Field | Value |
|---|---|
| ID | `TD-WS13-002` |
| Title | Constraint-name collision prevents a fresh replay of migration `20260921070200` |
| Category | Infrastructure |
| Workstream | WS13 — Journey Workspace (found during Phase 0 local migration testing) |
| Priority | Low |
| Description | In `supabase/migrations/20260921070200_workspace_journey_planning_records.sql`, the inline column CHECK on `outcome` (line 34) receives PostgreSQL's automatic name `workspace_journey_planning_records_outcome_check`, which is also the explicit name of the table-level constraint on line 43. Replaying all migrations on an empty PostgreSQL 17.6 database fails at this file with "constraint … already exists". Found by Rad while testing `EBC-R1.3-WS13-005-P0` migrations locally (OBS-P0-01). |
| Reason | The file is already recorded as applied on the shared Supabase project, so the live database and the normal `db push` path are unaffected. It only matters when the full history is replayed. |
| Impact | `supabase db reset`, a new Supabase branch or a new environment built from migrations fails until worked around. |
| Suggested Resolution | Archie/Rad to choose a non-destructive fix (for example, a baseline or squash approach, or an agreed amendment to the historical file) without changing the live schema. Phase 0 migrations already avoid the pattern by using explicit, distinct constraint names. |
| Suggested Release / Sprint | Release 1.4 — before any new environment is built (prerequisite for the environment-isolation review, `RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.9). Proposed 30-Sep-2026, Product Owner to confirm. |
| Status | Open |
| Date Logged | 28-Sep-2026 |

### TD-WS13-001 — Deprecated `workspace_journeys.status` column still present

| Field | Value |
|---|---|
| ID | `TD-WS13-001` |
| Title | Remove the deprecated `workspace_journeys.status` column after WS13 stabilises |
| Category | Architecture |
| Workstream | WS13 — Journey Workspace |
| Priority | Low |
| Description | AD-WS13-001 replaces the old `status` column with the `stage` lifecycle. M07 (`20260928100600`) keeps `status` and marks it "deprecated (TD-WS13-001)" instead of dropping it, so older code keeps working during the transition. |
| Reason | Dropping it in Phase 0 would add risk to the coupled M07/M10 deployment for no benefit. |
| Impact | Two sources of Journey state until removed; a risk of new code reading the wrong one. |
| Suggested Resolution | After WS13 is complete and no code reads `status`, drop it with a reviewed migration (Archie Q-JW-01). |
| Suggested Release / Sprint | Release 1.4 (proposed; Product Owner to confirm) |
| Owner | Rad (Archie reviews the migration) |
| Status | Open |
| Date Logged | 30-Sep-2026 |

### TD-WS13-003 — Unused `fetchWorkspaceUserRole` helper

| Field | Value |
|---|---|
| ID | `TD-WS13-003` |
| Title | Remove unused `fetchWorkspaceUserRole` |
| Category | Code Quality |
| Workstream | WS13 — Journey Workspace (Phase 0, OBS-P0-03) |
| Priority | Very Low |
| Description | Phase 0 replaced `fetchWorkspaceUserRole` with `fetchWorkspaceUserAccess` (which also reads deactivation). The old function is no longer called but was left in place to keep the change minimal. |
| Reason | Dead code only; no behaviour impact. |
| Impact | Risk that new code uses the old helper and misses the deactivation check. |
| Suggested Resolution | Delete the function in the next change that touches the auth helpers. |
| Suggested Release / Sprint | WS13 Phase 1 (opportunistic), otherwise Release 1.4 |
| Owner | Rad |
| Status | Open |
| Date Logged | 30-Sep-2026 |

### TD-WS13-004 — Conversion success toast not announced to screen readers

| Field | Value |
|---|---|
| ID | `TD-WS13-004` |
| Title | Add a live region to Workspace success toasts |
| Category | Accessibility |
| Workstream | WS13 — Journey Workspace (Phase 0 QA, OBS-P0-QA-01) |
| Priority | Low |
| Description | The "Journey JRN-xxxx created." toast has no ARIA live region, so screen readers do not announce it. Found by Keerthi in Phase 0 QA. |
| Reason | Keyboard flow passed; the toast is confirmation, not the only path to the result. The visible-duration / missing-reference part is a UX question tracked as carry-forward WS13-P1-G, not here. |
| Impact | Screen-reader users get no confirmation that the Journey was created. |
| Suggested Resolution | Use a polite live region (`role="status"`) for success toasts, in the shared toast component. |
| Suggested Release / Sprint | WS13 Phase 1 (with Journey screens) |
| Owner | Rad (Sophie confirms pattern) |
| Status | Open |
| Date Logged | 1-Oct-2026 |

### TD-WS13-005 — Browser session kept after authorisation refusal

| Field | Value |
|---|---|
| ID | `TD-WS13-005` |
| Title | Sign out the browser session when a deactivated or unprovisioned user is refused |
| Category | Security |
| Workstream | WS13 — Journey Workspace (Phase 0 QA, OBS-P0-QA-06) |
| Priority | Low |
| Description | When a deactivated user signs in, Workspace refuses access correctly, but the Supabase session stays in the browser. |
| Reason | Every page and API still refuses the user (P0-INACT-01..03 Passed), so there is no access gap. It is session hygiene. |
| Impact | A leftover valid session on a shared device; possible confusion if the account is reactivated. |
| Suggested Resolution | Call sign-out when access is refused for `unauthorized` / deactivated, then show the refusal message. |
| Suggested Release / Sprint | WS13 Phase 1 (with deactivated-user behaviour, `OD-R1.3-7`) |
| Owner | Rad |
| Status | Open |
| Date Logged | 1-Oct-2026 |


### TD-WS13-006 — Deactivation not enforced in RLS read policies

| Field | Value |
|---|---|
| ID | `TD-WS13-006` |
| Title | Make `workspace_current_user_role()` return no role for a deactivated user |
| Category | Security |
| Workstream | WS13 — Journey Workspace (Phase 1 architecture review, Archie AR-F1, `EBC-R1.3-WS13-020A`) |
| Priority | Medium |
| Description | `workspace_current_user_role()` (`20260916090000`) returns the caller's role whether or not `deactivated_at` is set; M01 added `deactivated_at` without changing it. Read policies that test `workspace_current_user_role() is not null` (Journey child tables, the summary view through `security_invoker`, configuration tables), and the `using (true)` read policies, therefore still admit a deactivated user who holds a valid Supabase session. Through the permissive WS12 UPDATE policies (`TD-WS12-004`), that user could also edit Journey Planning records. |
| Reason | Pre-existing, not introduced by M11. Every Workspace page and API refuses deactivated users, and every Journey write checks deactivation in the database. Phase 1 signs the session out on refusal (`TD-WS13-005`), which closes the normal path. Changing the function changes the meaning of every policy across WS11–WS13 and needs its own regression, so it is not done inside M11 (`DEC-R1.3-026`, ND-12). |
| Impact | Low likelihood (a deliberate insider calling the REST API after deactivation); medium impact (read access to traveller data; Journey Planning edits). |
| Suggested Resolution | On the RLS hardening card, with `TD-WS12-004` and `TD-WS12-005`: a reviewed change to `workspace_current_user_role()` (return null when deactivated) plus WS11–WS13 regression. The same card should review `OBS-P1-04` (`workspace_audit_log` and `workspace_tasks` SELECT `using (true)` for any authenticated session; `EBC-R1.3-WS13-020` §10, §18). |
| Suggested Release / Sprint | Security hardening card before WS13 Phase 3 |
| Owner | Archie (design), Rad (build) |
| Status | Open |
| Date Logged | 4-Oct-2026 |

---

## 10B. WS12 Security Posture Entries (logged from WS13 architecture review)

Source: `EBC-R1.3-WS13-003` §3 (SEC-02, SEC-03) and `EBC-R1.3-WS13-004` GO-09. SEC-01 was fixed in Phase 0 (conversion v2); SEC-04 is mitigated by deactivation replacing deletion (AD-WS13-007) and is not logged.

### TD-WS12-004 — Journey Planning UPDATE policies are `using (true) with check (true)` (SEC-02)

| Field | Value |
|---|---|
| ID | `TD-WS12-004` |
| Title | Add record-scoped RLS to Journey Planning UPDATE policies |
| Category | Security |
| Workstream | WS12 — Journey Planning (found in WS13 architecture review) |
| Priority | Medium |
| Description | Journey Planning tables allow any authenticated Workspace user to update any row at database level; record-scoped authorisation exists only in application code. |
| Reason | Application checks enforce the rules today, and WS13 tables do not repeat the pattern (AD-WS13-002). It is a defence-in-depth gap, not an open exploit through the UI. |
| Impact | A client that calls the API directly with a valid session could bypass application-level ownership rules. |
| Suggested Resolution | A security hardening card: replace the permissive policies with owner/Administrator-scoped policies or move writes to self-authorising RPCs, with WS12 regression. |
| Suggested Release / Sprint | Security hardening card — Release 1.3 or 1.4 (Archie Q-JW-02; Product Owner to decide) |
| Owner | Archie (design), Rad (build) |
| Status | Open |
| Date Logged | 30-Sep-2026 |

### TD-WS12-005 — `workspace_notifications` INSERT is `with check (true)` (SEC-03)

| Field | Value |
|---|---|
| ID | `TD-WS12-005` |
| Title | Restrict who can insert Workspace notifications |
| Category | Security |
| Workstream | WS12 — Journey Planning / WS11 Foundation (found in WS13 architecture review) |
| Priority | Medium |
| Description | Any authenticated user can insert a notification addressed to any other user. |
| Reason | No UI writes notifications directly; WS13 system alerts are written by RPC or service role (AD-WS13-005). |
| Impact | A direct API caller could create misleading notifications for other users. |
| Suggested Resolution | Limit INSERT to RPC / service role (or to rows where the caller is the actor), in the same hardening card as `TD-WS12-004`, ideally before Phase 3 (alerts). |
| Suggested Release / Sprint | Same as `TD-WS12-004`; before WS13 Phase 3 recommended |
| Owner | Archie (design), Rad (build) |
| Status | Open |
| Date Logged | 30-Sep-2026 |

---

## 11. Cross-References Established by This Card

Per this card's own Deliverable 6 ("Update any relevant engineering governance documentation if necessary to reference the new Technical Debt Register"), two single-line cross-reference updates are made — no product backlog item content, priority, or status is changed by either:

1. **`docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9** — a short pointer note added ahead of its existing content, directing new engineering technical debt to this register while confirming `TD-R1.3-001`–`009` remain unchanged, historical, and closed to new entries (see Section 6 above for the full rationale). Recorded as that document's own v1.11 Change History row.
2. **`docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md`** — its "Distinct from" table's "Technical debt" row (Section 2.1) updated to also name this document, alongside its existing `RELEASE-1.3-BACKLOG.md` §9 pointer. Recorded as that document's own v1.1 Change History row.

**Considered and not done:** `docs/00-Project-Compass/DOCUMENT-INDEX.md` does not systematically catalogue individual `docs/10-Backlog/` files (only one entry exists there, for a Decision Log), so no update was made there — consistent with `PRODUCT-EVOLUTION-BACKLOG.md`'s own precedent of not requiring one. `docs/10-Backlog/RELEASE-1.3.md` (the live Release Tracker) was also considered; no update was made, since this is a housekeeping/registry establishment rather than a workstream status change, and the tracker's own convention (Section 5/§15) is to record workstream and feature status, not the existence of supporting backlog documents.

---

## 12. Quality Checklist

- [x] Repository connected
- [x] Repository updated (this document, at its canonical path, plus two cross-reference-only edits)
- [x] Existing documentation conventions followed (Document Information/Change History header block, supersede-not-erase convention, cross-referencing style)
- [x] Purpose, ownership, prioritisation, lifecycle, and both relationship sections (Product Backlog, Release Planning) defined
- [x] Nine categories defined
- [x] Standard entry format defined
- [x] Three initial WS12 entries seeded, source disclosed transparently where the card's own text was the only available evidence
- [x] No repository folder created, moved, or renamed
- [x] No product backlog item content, priority, or status modified — only single-line cross-references added
- [x] No product enhancement, feature request, roadmap item, or future-release scope recorded in this register

---

## 13. Handover

This register is now ready for ongoing engineering use throughout future releases. Rad may log new items as they are found during any future implementation or validation pass, citing the originating EBC. Tiger will review this register at each workstream's engineering-phase closure to move items through the lifecycle in Section 5 and to keep prioritisation current against release planning.

---

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014CQZsVKR51uH4yidUW6nkh
