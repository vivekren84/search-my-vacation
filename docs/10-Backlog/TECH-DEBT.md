# Search My Vacation

# Technical Debt Register

```text
Document Type : Engineering Governance Register (documentation only — no code, no configuration, no schema change)
Release       : Established during Release 1.3 (`EBC-R1.3-WS12-008`); intended to remain live and release-independent across future releases
Persona       : Tiger — Programme and Delivery Lead
Status        : ESTABLISHED — register created; three initial WS12 items seeded, none yet actioned
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
