# EBC-R1.3-WS12-003 — Business Analysis & Functional Requirements for Journey Planning

**Persona:** Arjun — Senior Product & Business Analyst
**Release:** 1.3
**Workstream:** WS12 — Journey Planning
**Phase:** Business Analysis & Functional Requirements (final business-analysis activity before UX Design)
**Status:** Business Analysis Complete — Journey Planning's canonical business specification, ready for Sophie (WS12-004), Archie (WS12-005), Rad (WS12-006) and Keerthi. **Revision 2 baseline in effect (22 September 2026, `EBC-R1.3-WS12-011B`) — see Document Revision History below.**
**Date:** 19 September 2026 (original); amended 22 September 2026

---

**Document Revision History**

| Revision | Date | Trigger | Change |
|---|---|---|---|
| 1 | 19 September 2026 | Original Business Analysis (this card) | Initial canonical baseline — Sections 1-22 as approved by the Product Owner and validated through Engineering (WS12-006/007), QA (WS12-009/010) and Regression (WS12-010R/010C). |
| 2 | 22 September 2026 | `EBC-R1.3-WS12-011B` — Product Owner Ratification & Canonical Product Baseline Synchronization, following a business capability gap identified during Product Owner Acceptance (WS12-011) and closed via `EBC-R1.3-WS12-011A` Revision 2 (Product Gap Analysis: Minimum Planning Information) | Amends Section 5 (Discovery-to-Planning exit gate), Section 6.1 (adds the Planning Parameters sub-group), Section 7 (adds `FR-JP-31`, `32`, `33`, `34`, `36`; supersedes `FR-JP-35`), Section 8 (adds `BR-020`, `021`, `023`, `024`; supersedes `BR-022`), Section 17 (Forward Allocation note to WS13), and Section 19 (RTM rows for the new FRs). No other section is changed by Revision 2. Superseded items are struck through and retained, never deleted, per this project's supersede-not-delete convention. |
| 3 | 24 September 2026 | `EBC-R1.3-WS13-001B` — WS13 Product Baseline Synchronisation of Product Owner decisions D-02 and D-13 (Journey Workspace review) | Cross-module refinement note only (see below). `FR-JP-36` and `BR-024` are annotated *refined by D-02*; no FR or BR renumbered, deleted or reworded. Journey Planning (WS12) remains closed; any implementation change is scheduled separately by Tiger. |


**Revision 3 refinement note (24 September 2026, `EBC-R1.3-WS13-001B`) — cross-module impact of WS13 Product Owner decisions:**

- **D-02 (CM-01):** Confirmed travel start and end dates are mandatory **before** a Journey Planning Record closes as Confirmed; no Journey may be created without them (WS13 `BR-027`). This refines `FR-JP-36` and `BR-024`: the "booking/confirmation stage" at which the travel date becomes mandatory is now the Decision → Closed (Confirmed) conversion at the end of Journey Planning. Intended Travel Date remains optional at every earlier stage.
- **D-13 (CM-02):** When a confirmed Journey needs a material change, Journey Planning receives a new, linked planning record; its conversion creates the replacement Journey (`BR-012` preserved) and marks the original Journey Superseded (WS13 `BR-039`).
- Full detail: `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` Revision 2, §21 and §27.2.

---

## 0. Repository Readiness Check (Mandatory — Project Instructions §14/§15, and Tiger's new standing instruction)

| Check | Result |
|---|---|
| Repository connected | **Yes.** Folder `/Users/viveksophu/Documents/Projects/SearchMyVacation` already attached to this session |
| Branch identified | `main` |
| Working tree inspected (read-only) | **Clean.** `git status` returns no pending changes — everything previously observed as uncommitted or untracked has since been committed by the Product Owner. Confirmed via `git log` before any write this pass |
| Existing document located | **Yes.** `docs/09-Development/EBC-R1.3-WS12-002-ARJUN-Business-Domain-Discovery-and-Product-Discovery-Journey-Planning.md` — now at its canonical filename (the non-canonical-filename observation raised in the WS12-002 continuations has been resolved; the file was renamed and committed, single commit `e70246e`, "Release 1.3: Complete WS12 Journey Planning discovery and governance baseline") |
| Destination folder verified | **Yes.** `docs/09-Development/` exists and is the correct location for this card's deliverable, matching the repository's own convention for every prior EBC in this workstream |

**Material finding, disclosed rather than silently worked around (Project Instructions §17, "do not silently resolve material conflicts"):** the committed repository copy of `EBC-R1.3-WS12-002` (411 lines, single commit `e70246e`) reflects only the **first** WS12-002 continuation (repository validation and canonical-source resolution — the seven-stage lifecycle, `BR-010`, Task/Follow-up/Activity, vendor touchpoint). It does **not** contain the **second** WS12-002 continuation's three Product Owner ratifications (Proposal Model, Journey Planning Entry Model, Single Business Object Principle) — a targeted repository search this pass found no trace of "Corporate Point of Contact," "Manual Creation Policy," "Journey Entry Model," or "Single Business Object Principle" anywhere in the committed repository. The one exception is `PEB-001` (Journey Amendment), which **is** correctly committed, in `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` (`EBC-R1.3-GOV-004`).

**This does not block this card.** This EBC's own Prerequisites section restates all three ratified decisions directly and in full — Proposal Model, Vendor Quotation Model, Journey Entry Model, Manual Creation Policy, Corporate Point of Contact, and Single Business Object Principle — as a direct Product Owner instruction. Per Project Instructions §17, the latest explicit instruction from the project owner is the highest-precedence Source of Truth, ranking above even an approved EBC's committed text. This Business Analysis therefore proceeds on the ratifications exactly as restated in this card, cross-checked against the second WS12-002 continuation's fuller working (preserved in the Claude Project, `claude/EBC-R1.3-WS12-002-ARJUN-...md`) for consistency, and against `PEB-001`'s committed text for the Journey Amendment boundary.

**Recommendation to Tiger, not actioned by this card:** the committed `EBC-R1.3-WS12-002` repository copy should be brought into line with its ratified content in a short, separate housekeeping pass, so the repository's own record of WS12-002 matches what this WS12-003 card (and any future reader) relies on. This card does not modify `EBC-R1.3-WS12-002` — doing so is outside this card's authorised scope (its Repository Impact is this document only).

---

## 1. Business Context

Journey Planning is the first Workspace Business Module to reach Business Analysis. It is the operational bridge between Traveller Acquisition (the live public Journey Passport / Journey Director product, now confirmed as one of eight recognised origin channels) and Journey Execution (Journey Workspace, WS13). Its business purpose, per `PO-REVIEW-03` §3 and unchanged by this pass: understand traveller requirements, coordinate planning activities, manage a single active Proposal (with its Proposal Version revision history), coordinate Vendor Quotations, guide commercial discussions, and convert a qualified Proposal into a confirmed Journey — while preserving the complete planning history.

This card's job is to turn that approved business domain (`EBC-R1.3-WS12-002` plus this card's own ratifications) into implementation-ready business requirements: the complete functional behaviour of Journey Planning, expressed as Functional Requirements, Business Rules, validation rules, actor permissions, and the supporting behavioural detail (notifications, search, audit, reporting, exceptions) that UX, Architecture and Engineering will build against. No screens, no data model, no code — business behaviour only, per this card's own repeated instruction ("Business before UX," "Business before Engineering").

**Prerequisites confirmed complete**, per this card's own list:

| Prerequisite | Status |
|---|---|
| WS11 — Workspace Foundation | ✅ Closed (`DEC-R1.3-011`) |
| WS12-001 — Workstream Initiation | ✅ Closed |
| WS12-002 — Business Domain Discovery | ✅ Closed (with the repository-lag finding above disclosed, not blocking) |
| `DEC-R1.3-011` | Confirmed — WS11 Foundation closure and platform-baseline decision, `docs/10-Backlog/RELEASE-1.3.md` §7 |
| `DEC-R1.3-012` | Confirmed — WS12–WS17 reserved-identifier decision, `docs/10-Backlog/RELEASE-1.3.md` §7. WS12 is a reserved identifier; this card is the first substantive work performed under it |

---

## 2. Objectives

1. Define the complete functional behaviour of Journey Planning as a set of numbered, traceable Functional Requirements, filling the ~25 not previously drafted (of the Product-Owner-approved 30, all Must Have — `PO-REVIEW-03` §10, v2.0 spec §6.3) alongside the 5 already drafted (`FR-JP-01`–`05`).
2. Consolidate every Business Rule bearing on Journey Planning — pre-existing (`BR-002`, `BR-004`–`BR-013`, `BR-016`) and newly ratified this pass (Mandatory Association, Origin Traceability, Duplicate Prevention, Single Business Object/No Duplication) — into one authoritative list, without duplication.
3. Fully define every Journey-Planning-relevant business object, incorporating the ratified Proposal Model (Proposal as primary, Proposal Version as revision history) and the new Corporate Point of Contact object.
4. Establish validation rules, a role/permission matrix, business-level notification, search, audit and reporting requirements, and exception-handling behaviour — all in business terms.
5. Produce a complete Requirement Traceability Matrix so every FR is defensible back to a business objective, a Business Rule, a Discovery finding, and (where one exists) a Product Decision.
6. Leave only genuine, unresolved business questions open — and explicitly confirm that no ratified Product Owner decision is reopened by this analysis.

---

## 3. Actors

| Actor | Description | Source |
|---|---|---|
| **Workspace User** | The primary operator. Claims, works, and progresses Journey Planning Records; captures requirements, Discovery Notes and Activities; manages the Proposal (and its Proposal Versions); records Vendor Quotations; manages Tasks and Follow-ups; converts an approved record into a Journey | `PO-REVIEW-03` §7; `EBC-R1.3-WS12-002` §6 |
| **Administrator** | A Workspace User with additional platform-governance authority: reassigns records regardless of current ownership, and holds the RBAC-level authority ratified for Administrators generally (`DEC-R1.3-009`: "Administrators govern the platform... Privilege Users operate the business") | `PO-REVIEW-03` §7; `DEC-R1.3-009` (`RELEASE-1.3.md` §5, WS11 row) |
| **Traveller** | External. The subject of the planning effort for the majority of origin channels. Provides requirements (directly or via a Workspace User); receives the Proposal; decides whether to proceed. Does not have direct Workspace access | `EBC-R1.3-WS12-002` §6 |
| **Corporate Point of Contact** | External. The alternative subject of the planning effort when the origin is a Corporate enquiry — an identified individual representing the corporate party. Plays the same role a Traveller plays in every other respect (receives the Proposal, decides whether to proceed), but is a distinct object because a corporate opportunity may not have a single named traveller at planning time | **Product Owner Ratification, Decision 2** (this card's Prerequisites; `EBC-R1.3-WS12-002` §6/§10, second continuation) |
| **External Vendor** — **interaction only, no Workspace access** | Supplies commercial pricing/availability information that a Workspace User records as a Vendor Quotation. Vendor Quotation is explicitly ratified as a supplier-owned object kept **internal** to Search My Vacation — no vendor-facing interface exists, is implied, or is in scope. A Vendor's own identity/lifecycle record is owned by the separate Vendor Management module (WS16), referenced by Journey Planning, not owned by it | **Product Owner Ratification, Decision 1**; `PO-REVIEW-03` §9 |
| **Journey Workspace (system actor)** | Receives the converted Journey on successful conversion. Not a human actor, but named because several Functional Requirements below describe the handoff boundary to it | `PO-REVIEW-03` §9; `WORKSPACE-DOMAIN-MODEL.md` §on Journey |

---

## 4. Functional Scope

Journey Planning's complete business capability set, consolidating `EBC-R1.3-WS12-002` §7 (Business Capability Map) with this card's ratifications:

1. **Opportunity intake** from eight recognised origin channels (Website enquiry, WhatsApp, Phone, Walk-in, Referral, Existing Traveller, Corporate enquiry, Manual Workspace initiation), with origin recorded for traceability.
2. **Mandatory subject association** — every Journey Planning Record is associated with an identified Traveller or an identified Corporate Point of Contact before planning proceeds; no artificial/placeholder Lead is permitted.
3. **Duplicate prevention** — checking for an existing Traveller and any active Journey Planning Record before a new one is created.
4. **Ownership** — Claim / Assign / Reassign, independent of lifecycle status.
5. **Requirement capture** — destination, travel dates, date flexibility, duration, budget, companions, special requests, flight preferences.
6. **Discovery** — Discovery Notes and Activities logged against the record.
7. **Proposal management** — a single active Proposal per record, with Proposal Versions as its revision history.
8. **Vendor Quotation management** — supplier-owned, internal-only records; a record may reference multiple Vendor Quotations.
9. **Task and Follow-up management** — using the pre-existing, Workspace-wide Task and Follow-up objects.
10. **Lifecycle progression** — seven deliberate, owner-driven stages.
11. **Approval and conversion** — one-way, atomic conversion of a confirmed record into exactly one Journey, with no duplicate Journey and no duplicate Journey Planning Record ever created.
12. **Retention** — archival, never permanent deletion.
13. **Search, audit and reporting** over all of the above (Sections 12–14).

---

## 5. Journey Planning Lifecycle

The seven-stage lifecycle is Confirmed and unchanged by this pass (`PD-JP-005`; `EBC-R1.3-WS12-002` §8). This section adds the entry/exit criteria and transition rules this card's scope requires, which `EBC-R1.3-WS12-002` (a Discovery document, not a Business Analysis one) did not itself specify.

| Stage | Entry Criteria | Exit Criteria (to next stage) | Allowed Transitions | Invalid Transitions |
|---|---|---|---|---|
| **1. Lead Created** | An opportunity is recorded via any of the eight origin channels; associated with an identified Traveller or Corporate Point of Contact; duplicate check performed; origin recorded | Record claimed by a Workspace User | → Discovery (on claim) | Direct entry to any stage other than Lead Created; creation without an identified Traveller/Corporate POC (Mandatory Association, Section 8) |
| **2. Discovery** | Record claimed; Owner assigned | Sufficient requirements captured for the Owner to begin translating them into a Proposal (a business judgement, not a system-enforced field count) — **and, as a named exception, Number of Children, Number of Infants, Intended Travel Month, Number of Nights and Preferred Departure City must each hold an explicit value (an explicit zero is valid for Children/Infants/Nights; unanswered is not valid for any of the five) — the Discovery-to-Planning gate, `BR-021` (Revision 2, `EBC-R1.3-WS12-011B`)** | → Planning | → Proposal Shared, Revision, Decision or Closed directly (skips Planning — invalid; a Proposal must exist first, Section 8 Proposal validation); → Planning without the `BR-021` gate satisfied (invalid, Revision 2) |
| **3. Planning** | Requirements captured; Owner is preparing the Proposal | The (single, active) Proposal has been prepared and is ready to share | → Proposal Shared | → Decision or Closed directly without a Proposal having been shared at least once |
| **4. Proposal Shared** | The current Proposal Version has been sent to the Traveller/Corporate Point of Contact (a logged action) | Traveller/Corporate Point of Contact has responded, or the Owner determines revision is needed | → Revision (feedback requires changes) or → Decision (no revision needed, Traveller/Corporate POC is deciding) | → Planning (a shared Proposal is not un-shared; a new cycle goes through Revision, not backward to Planning) |
| **5. Revision** | Feedback received on the shared Proposal; Owner is preparing a new Proposal Version of the same Proposal | New Proposal Version prepared and (re-)shared | → Proposal Shared | Revision creating a second Proposal (invalid — Section 8, "Proposal validation": exactly one active Proposal per record) |
| **6. Decision** | Traveller/Corporate Point of Contact is deciding whether to proceed | A decision is recorded | → Closed (Confirmed, Lost, or Archived) | Any transition other than to Closed |
| **7. Closed** (Confirmed / Lost / Archived) | A final outcome recorded | *(terminal — see below)* | **Confirmed:** one-way, atomic conversion into exactly one Journey (BR-012), record retained, never returns to an earlier stage. **Lost / Archived:** record retained, never returns to an earlier stage | Re-opening a Closed record to any earlier stage, under any outcome (Single Business Object Principle, Section 8) |

**Discovery-to-Planning gate (Revision 2, `BR-021`):** the five Planning Parameters named above are a narrow, named exception to this lifecycle's otherwise business-judgement-based Discovery exit; they do not include Exact Travel Date, which remains fully discretionary throughout Journey Planning's own lifecycle and becomes mandatory only when the broader sales process reaches Booking/Confirmation, a WS13 (Journey Workspace) concern outside this module's scope (`FR-JP-36`, `BR-024`; Section 17).

**Cross-cutting invalid transitions, applicable at every stage:** creating a second Journey Planning Record for the same Traveller/destination while one is already active (Duplicate Prevention); reopening a Journey that has already been booked into Journey Workspace back into Journey Planning, under any circumstance (Single Business Object Principle — post-booking changes are `PEB-001`, out of scope here, Section 18).

---

## 6. Business Objects

Full definitions, incorporating the ratified Proposal Model and the new Corporate Point of Contact object. Field lists beyond what a canonical source states are labelled **Proposed (Arjun)** — a reasonable business-level shape, not yet Product-Owner-confirmed at the field level, and should be read as a starting point for Sophie/Archie rather than a locked specification.

### 6.1 Journey Planning Record

**Confirmed** (`PO-REVIEW-03` §4/§6; Product Owner Ratification, this card).

- **Definition:** the central operational object — the Workspace-side representation of a single planning effort for one Traveller or Corporate Point of Contact and one destination or destination region, from intake through the seven-stage lifecycle to a Closed outcome.
- **Identity/key fields:** Planning ID; Traveller reference *or* Corporate Point of Contact reference (exactly one populated — Section 9); Origin channel (one of the eight ratified values); Destination/Region (reference to a Destination Profile, owned by Destination Intelligence); Owner; Created Date; Current Stage.
- **Planning Parameters (Proposed, Arjun; revised Revision 1; revised Revision 2, `EBC-R1.3-WS12-011B`) — gated as stated, not flat mandatory/optional:** Number of Adults (**mandatory at creation**, `FR-JP-31`); Number of Children (**present from creation, explicit value — which may be zero — required before Discovery-to-Planning**, `FR-JP-33`/`34`); Number of Infants (**present from creation, explicit value — which may be zero — required before Discovery-to-Planning**, `FR-JP-33`/`34`); Intended Travel Month (**explicit value required before Discovery-to-Planning**, `FR-JP-34`); Intended Travel Date (**optional throughout Journey Planning; mandatory only at the future booking/confirmation stage, outside this module**, `FR-JP-36`); Number of Nights (**explicit value required before Discovery-to-Planning**, `FR-JP-34`); Number of Days (derived from Nights, not independently stored — Open Question `OQ-011A-1`, `EBC-R1.3-WS12-011A`); Preferred Departure City (**explicit value required before Discovery-to-Planning**, `FR-JP-34` — moved forward from a Planning-to-Proposal-Shared gate in Revision 2, resolving `OQ-011A-5`). **Distinct from Booking Parameters:** these are Journey Planning's own Planning Parameters; Booking Parameters (including a confirmed Exact Travel Date) are a Journey Workspace (WS13) concern and are not part of this object (Section 17, Section 18).
- **Relationships:** owns Discovery Notes, Activities, the active Proposal (with its Proposal Versions), Vendor Quotations, Tasks and Follow-ups (aggregate root — consistent with `WORKSPACE-DOMAIN-MODEL.md` §on this object). Converts one-way into exactly one Journey.
- **Lifecycle:** the seven stages in Section 5.
- **Retention:** archival only, never permanently deleted (`PD-JP-007`).

### 6.2 Proposal — corrected model, primary object

**Confirmed** (Product Owner Ratification, Decision 1).

- **Definition:** the single, active, traveller-facing business object owned by Search My Vacation, representing what is currently being offered for a given Journey Planning Record.
- **Key fields — Proposed (Arjun):** Proposal ID; Journey Planning Record reference; current active Proposal Version reference; status (Draft / Shared / Superseded-by-decision); created date.
- **Cardinality:** exactly one active Proposal per Journey Planning Record (Section 8, Proposal validation).

### 6.3 Proposal Version — revision history, not a separate primary object

**Confirmed** (Product Owner Ratification, Decision 1).

- **Definition:** a single revision of the Proposal. Each preparation or revision of the Proposal creates a new Proposal Version; all prior versions remain available for historical reference.
- **Key fields — Proposed (Arjun):** Proposal Version ID; Proposal reference; version number; content reference (a Traveller Itinerary, per `PO-REVIEW-03` §5/§9 and UX evidence `JP-05`); linked Vendor Quotations used as commercial input; sent date (if shared); is-current flag.
- **Relationships:** belongs to exactly one Proposal; a Proposal Version being "sent" is a logged, auditable action (Section 13).

### 6.4 Vendor Quotation — supplier-owned, internal-only

**Confirmed** (Product Owner Ratification, Decision 1).

- **Definition:** a supplier-owned business object representing commercial pricing/availability information about a vendor, kept entirely internal to Search My Vacation.
- **Key fields — Proposed (Arjun):** Vendor Quotation ID; Journey Planning Record reference; Vendor reference (owned by Vendor Management, WS16); quoted items/pricing summary; validity date; received date.
- **Cardinality:** a Journey Planning Record may reference multiple Vendor Quotations. Kept permanently distinct from the Proposal — never merged into it (`BR-011`).

### 6.5 Traveller

**Confirmed**, owned by Traveller Hub (WS14), referenced not owned by Journey Planning (`PD-JP-004`). No field-level redefinition here — out of this card's scope, per §18 (avoid unnecessarily duplicating business rules/objects another module owns).

### 6.6 Corporate Point of Contact — new object

**Confirmed to exist and be required** (Product Owner Ratification, Decision 2); field-level shape below is **Proposed (Arjun)**, since the ratification confirms the object's necessity but not its fields or data ownership.

- **Definition:** the identified individual representing a corporate enquiry; the alternative a Journey Planning Record may carry instead of a Traveller when the origin is Corporate enquiry.
- **Key fields — Proposed (Arjun):** Corporate Point of Contact ID; full name; role/title; company name; phone; email; linked Journey Planning Record(s).
- **Open item (Section 20):** whether this object is owned by Traveller Hub (as a corporate-flavoured Traveller variant) or is a new, independent store is not decided by this ratification and is flagged for Archie during WS12-005, not decided here.

### 6.7 Destination (reference)

**Confirmed**, owned by Destination Intelligence (WS17) as a Destination Profile (`PD-DI-...`, v2.0 spec §7.9-area). Journey Planning references a Destination/Region on the Journey Planning Record's identity fields (Section 6.1); it does not own or redefine Destination Profile content here.

### 6.8 Task

**Confirmed**, pre-existing, Workspace-wide (v1.0 spec §7.10, unchanged in v2.0). A discrete unit of operational work, system-generated or manually created ("Hybrid task creation," `BR-008`); description, linked Journey/Lead (optional), Owner, due date, status, origin (System/Manual); states Open → Completed (or Archived). Used by Journey Planning as one of its Planning Activities.

### 6.9 Follow-up

**Confirmed**, pre-existing, Workspace-wide (v1.0 spec §7.11, unchanged in v2.0). A scheduled, structured, traveller-directed touchpoint ("Structured follow-ups," `BR-009`); linked Traveller, linked Journey (optional), purpose, due date, Owner, status; states Scheduled → Completed/Missed. Used by Journey Planning as one of its Planning Activities.

### 6.10 Planning Activity (umbrella term)

**Confirmed** (`PO-REVIEW-03` §6): the collective term for the six activity types a Journey Planning Record carries — Discovery Notes, Activities, the Proposal (with its Versions), Vendor Quotations, Follow-ups, Tasks. Not itself a separate stored object; a business-level grouping term used consistently in this document and in `PO-REVIEW-03`.

- **Discovery Note — Confirmed:** a note capturing what a Workspace User learns during consultation, against a specific Journey Planning Record.
- **Activity — Confirmed to exist, distinct from Discovery Note:** its field-level definition is **Proposed (Arjun)** here for the first time, since WS12-002 explicitly deferred it to this card: a lightweight, timestamped log entry of an action taken (e.g., "called traveller," "sent itinerary draft") distinct from a Discovery Note's substantive content-capture purpose. Key fields — Proposed (Arjun): Activity ID; Journey Planning Record reference; activity type; timestamp; logged by (Owner or Administrator).

### 6.11 Document Reference

**Confirmed to exist** (`PO-REVIEW-03` §6, "Documents"): supporting documentation (passport copies for international travel, visa documentation, other traveller documents) associated with a Journey Planning Record where applicable; **not mandatory for domestic travel** (`PO-REVIEW-03` §6, explicit Product Owner clarification). Field-level storage mechanism is an Open Question carried from the wider Workspace UX package (`OQ-014`, `JW-07`'s own note) — not decided by this card.

### 6.12 Journey — reference only

**Confirmed** (Product Owner Ratification, Decision 3): the single canonical business object, owned by Search My Vacation. Created exactly once, atomically and irreversibly, by converting a confirmed Journey Planning Record (`BR-012`). Out of this card's scope to redefine further — owned by Journey Workspace (WS13).

---

## 7. Functional Requirements

All 30 Product-Owner-approved Functional Requirements (`PO-REVIEW-03` §10; v2.0 spec §6.3: "30 Functional Requirements, all Must Have"). `FR-JP-01`–`05` are restated verbatim from the approved Specification; `FR-JP-06`–`30` are drafted by this card to complete the approved count, each traceable to a specific business capability, Business Rule, or ratified decision.

| ID | Requirement | Rationale | Trigger | Inputs | Outputs | Success Outcome |
|---|---|---|---|---|---|---|
| **FR-JP-01** | The Journey Planning module shall present the Journey Planning queue, grouped by lifecycle stage. | Workspace Users need a single operational view of all in-flight planning work | User navigates to Journey Planning | Journey Planning Records, current stage | Grouped queue view | User sees every active record organised by stage |
| **FR-JP-02** | Unclaimed items shall be visible to every Workspace User and claimable by any of them. | Generic Ownership Model — any user may take responsibility for unowned work | User views the queue | Unclaimed records | Claimable list | Any Workspace User can identify and act on unowned work |
| **FR-JP-03** | Once claimed, an item shall show its Owner and no longer appear in the unclaimed pool. | Prevents duplicate effort on the same record | User claims a record | Claim action | Owner assigned, record removed from unclaimed pool | Record has exactly one Owner; unclaimed pool reflects reality |
| **FR-JP-04** | The Journey Planning queue shall follow the Product Owner-approved lifecycle stages. | Consistency with `PD-JP-005` | Queue rendered | Record's Current Stage | Stage-grouped display | Queue groupings match the seven approved stages exactly |
| **FR-JP-05** | Progressing an item to its next stage shall be a deliberate action taken by its Owner, not a free-text status edit. | Prevents accidental/ambiguous stage changes; supports auditability | Owner initiates a stage transition | Current stage, target stage | Stage updated, transition logged | Stage changes only through an explicit, attributable action |
| **FR-JP-06** | Journey Planning shall accept an opportunity from any of eight recognised origin channels: Website enquiry, WhatsApp, Phone, Walk-in, Referral, Existing Traveller, Corporate enquiry, Manual Workspace initiation. | Ratified Entry Model — Journey Planning is not limited to automated Journey Passport ingestion | An opportunity arrives via any channel | Channel-specific opportunity data | New Journey Planning Record candidate | A record can be created from any of the eight channels |
| **FR-JP-07** | Every Journey Planning Record shall record its origin channel at creation. | Origin Traceability (ratified) | Record created | Selected/detected origin channel | Origin field populated | Every record's origin is retrievable for reporting (Section 14) |
| **FR-JP-08** | Before creating a new Journey Planning Record, the system shall support checking for an existing Traveller and any active Journey Planning Record for the same Traveller/destination. | Duplicate Prevention (ratified) | User begins creating a new record | Traveller identifier, destination | Existing-record/Traveller match results (if any) | Duplicate planning is avoidable before it happens |
| **FR-JP-09** | Journey Planning shall reject creation of a record with no identified Traveller and no identified Corporate Point of Contact. | Mandatory Association (ratified) — no artificial/placeholder Leads | Record creation attempted | Traveller reference or Corporate Point of Contact reference | Record created only if the association is present; otherwise blocked | No placeholder/artificial record ever exists in the system |
| **FR-JP-10** | A Journey Planning Record shall be associated with exactly one of: an identified Traveller, or an identified Corporate Point of Contact — never both, never neither. | Mandatory Association; keeps the "who is this for" question unambiguous | Record creation or edit | Traveller or Corporate Point of Contact selection | Exactly one association stored | No record is ever ambiguous about who it is for |
| **FR-JP-11** | When the origin channel is Corporate enquiry, Journey Planning shall require an identified Corporate Point of Contact before the record leaves the Lead Created stage. | Ratified Entry Model, Corporate association | Record with Corporate enquiry origin reaches end of Lead Created | Corporate Point of Contact details | Association recorded | Corporate opportunities are never planned against an anonymous company |
| **FR-JP-12** | The Owner shall be able to capture and edit traveller requirements against a Journey Planning Record: destination, travel dates, date flexibility, duration, budget, companions, special requests, flight preferences. | `PO-REVIEW-03` §6, `PD-JP-006` | Owner enters Discovery stage | Requirement field values | Requirements stored against the record | Requirements are captured in a structured, retrievable form |
| **FR-JP-13** | Journey Planning shall not require a "purpose of travel" field. | Explicit Product Owner exclusion (`PO-REVIEW-03` §5, `PD-JP-006`) | Requirement capture | — | — | The field is never presented as mandatory or required |
| **FR-JP-14** | A Journey Planning Record shall have exactly one active Proposal at any time. | Ratified Proposal Model — Proposal is the primary object, one per record | Proposal creation attempted | Existing active Proposal check | Creation blocked if an active Proposal already exists | No record ever has two competing active Proposals |
| **FR-JP-15** | Preparing or revising the Proposal shall create a new Proposal Version, retaining all prior versions for historical reference. | Ratified Proposal Model — Proposal Version is revision history, not a separate object | Owner prepares/revises the Proposal | Proposal content | New Proposal Version, prior versions retained | Full, retrievable revision history exists for every Proposal |
| **FR-JP-16** | Sending the current Proposal Version to the Traveller/Corporate Point of Contact shall be a logged action that advances the record to Proposal Shared. | Auditability; lifecycle alignment (Section 5) | Owner sends the Proposal Version | Proposal Version, recipient | Send logged, stage advanced | Every send is attributable, timestamped, and reflected in the record's stage |
| **FR-JP-17** | A Proposal Version may reference a Traveller Itinerary (from Itinerary Studio) as its content basis. | `PO-REVIEW-03` §9; UX evidence `JP-05` | Owner authors a Proposal Version | Traveller Itinerary reference | Linked reference stored | The Proposal's content basis is traceable to a specific itinerary |
| **FR-JP-18** | A Proposal Version may reference one or more Vendor Quotations as commercial input, without merging their content into the Proposal itself. | `BR-011` | Owner attaches commercial input | Vendor Quotation reference(s) | Linked references stored, objects remain distinct | Proposal and Vendor Quotation content never blend into one record |
| **FR-JP-19** | The Owner shall be able to record a Vendor Quotation against a Journey Planning Record, referencing an existing Vendor. | `PO-REVIEW-03` §5, `PD-JP-003` | Owner receives vendor pricing/availability | Vendor reference, quoted terms | Vendor Quotation created | Commercial input from vendors is captured in a structured, auditable form |
| **FR-JP-20** | A Journey Planning Record shall support referencing multiple Vendor Quotations. | Ratified Vendor Quotation Model | Multiple quotations received | Additional Vendor Quotation(s) | Multiple linked Vendor Quotations on one record | A record can compare commercial options from several vendors |
| **FR-JP-21** | Vendor Quotations shall never be exposed through any vendor-facing interface; a vendor cannot submit, view, or edit a Vendor Quotation directly. | Ratified Vendor Quotation Model — internal only | — (a negative/boundary requirement) | — | — | No vendor-facing access path to Vendor Quotation data exists anywhere in the system |
| **FR-JP-22** | An Administrator shall be able to reassign a Journey Planning Record to a different Workspace User regardless of who currently owns it. | Generic Ownership Model, `PO-REVIEW-03` §7 | Administrator initiates reassignment | Target Workspace User | Owner changed, reassignment logged | Ownership can always be corrected by an Administrator |
| **FR-JP-23** | Ownership of a Journey Planning Record shall be independent of its lifecycle stage; changing one shall never change the other. | `PO-REVIEW-03` §8 ("Separation of Business Concepts") | Any ownership or stage change | — | — | Owner and stage vary independently in every observed case |
| **FR-JP-24** | The Owner shall be able to create and manage Follow-ups against a Journey Planning Record. | `PO-REVIEW-03` §6; `BR-009` | Owner schedules a future touchpoint | Purpose, due date | Follow-up created, states Scheduled → Completed/Missed | Every planned future touchpoint is tracked to resolution |
| **FR-JP-25** | The Owner shall be able to create and manage Tasks (system-generated or manual) against a Journey Planning Record. | `PO-REVIEW-03` §6; `BR-008` | System event or manual entry | Task description, due date | Task created, states Open → Completed (or Archived) | Every unit of operational work is tracked to resolution |
| **FR-JP-26** | Journey Planning shall prevent a lifecycle stage transition that is not listed as valid for the record's current stage (Section 5). | Deliberate, owner-driven lifecycle; data integrity | Any stage-change attempt | Current stage, requested stage | Transition allowed or blocked | No record is ever observed in a stage sequence that violates Section 5 |
| **FR-JP-27** | Closing a Journey Planning Record shall require one of exactly three outcomes: Confirmed, Lost, or Archived. | `PD-JP-005` | Owner closes the record from Decision | Selected outcome | Record status set to Closed with the chosen outcome | Every closed record has one, and only one, unambiguous outcome |
| **FR-JP-28** | Closing a record as Confirmed shall trigger the one-way, atomic conversion of the Journey Planning Record into exactly one Journey; no other closure outcome shall create a Journey. | `BR-012`; Single Business Object Principle | Owner records a Confirmed decision | Journey Planning Record | Exactly one Journey created, linked back to the originating record | Every Confirmed record produces exactly one Journey, traceably |
| **FR-JP-29** | Once a Journey Planning Record has converted to a Journey, or has been closed as Lost or Archived, it shall never re-enter an earlier lifecycle stage. | Single Business Object Principle (ratified) | Any attempted reopening | Closed record | Reopening blocked | No closed record is ever observed back in an active stage |
| **FR-JP-30** | Journey Planning shall never create a duplicate Journey Planning Record or a duplicate Journey for the same underlying opportunity. | Single Business Object Principle; Duplicate Prevention (both ratified) | Any creation/conversion path | Existing record/Journey check | Creation blocked where a duplicate would result | No two records or Journeys are ever observed representing the same opportunity |
| **FR-JP-31** *(Revision 2, `EBC-R1.3-WS12-011B`)* | A Journey Planning Record shall require the Number of Adults at creation, in addition to the existing Traveller/Corporate Point of Contact association (`FR-JP-09`/`10`). | Closes the Minimum Planning Information gap identified during Product Owner Acceptance | Record creation | Number of Adults | Adults field populated at creation | No record exists without a known party size |
| **FR-JP-32** *(Revision 2)* | Journey Planning shall not require a Budget field at any lifecycle stage; Budget remains an optional field the Owner may capture through consultation, per the existing permission in `FR-JP-12`. | Preserves the consultative, non-transactional Budget philosophy (`JOURNEY-PASSPORT-v1.0.md`) | Requirement capture | — | — | Budget is never presented as mandatory or required, at any stage |
| **FR-JP-33** *(Revision 2)* | The Create Record screen shall present Number of Children and Number of Infants as available fields from record creation, but shall not require a value in either to create the record. | Makes composition visible/capturable from creation while supporting the later `BR-021` gate | Record creation | Number of Children, Number of Infants (optional at this point) | Fields available, not required | Composition can be captured immediately without blocking creation |
| **FR-JP-34** *(Revision 2, expanded)* | A Journey Planning Record shall not transition from Discovery to Planning unless Number of Children, Number of Infants, Intended Travel Month, Number of Nights and Preferred Departure City each hold an explicit value (an explicit zero is a valid value for Children/Infants/Nights; an unanswered field is not valid for any of the five). | `BR-021` — Discovery-Exit Composition, Trip-Shape and Departure Gate | Owner attempts Discovery to Planning transition | The five named Planning Parameters | Transition allowed only once all five hold explicit values | Planning never begins without composition, trip-shape and departure point known |
| ~~**FR-JP-35**~~ | ~~A Journey Planning Record shall not transition from Planning to Proposal Shared unless Preferred Departure City holds an explicit value.~~ | **Superseded, Revision 2** — Preferred Departure City's gate moved forward into `FR-JP-34`'s Discovery-to-Planning gate; retained here for traceability, per this project's supersede-not-delete convention. | — | — | — | — |
| **FR-JP-36** *(Revision 2; refined by D-02 — Revision 3 note)* | Intended Travel Date shall not be required at any point within Journey Planning's own lifecycle (Lead Created through Closed); it shall become mandatory only when the business process reaches the booking/confirmation stage. | `BR-024` — Travel Date Deferral; Forward Allocation to WS13 | Requirement capture, any stage | — | — | Intended Travel Date is never enforced as mandatory inside Journey Planning; WS13 owns its future mandatory point |

**Coverage against the approved 30, by topic group** (`PO-REVIEW-03` §10 / v2.0 spec §6.3 wording): planning creation — `FR-JP-06`–`09`; traveller association — `FR-JP-10`–`11`; requirement capture — `FR-JP-12`–`13`; proposal management — `FR-JP-14`–`18`; vendor quotation management — `FR-JP-19`–`21`; ownership — `FR-JP-02`–`03`, `22`–`23`; follow-ups — `FR-JP-24`; tasks — `FR-JP-25`; status management — `FR-JP-01`, `04`–`05`, `26`–`27`; search — Section 12 (search is a cross-cutting capability, not separately FR-numbered here since it operates over the objects above, consistent with the approved topic list treating it as one category rather than record-type-specific); audit history — Section 13; governance — `FR-JP-28`–`30`. All 30 FRs are Must Have, matching the approved classification.

**Revision 2 additions (`EBC-R1.3-WS12-011B`, 22 September 2026):** `FR-JP-31`-`34` and `FR-JP-36` close the Minimum Planning Information gap identified during Product Owner Acceptance (WS12-011) and analysed in `EBC-R1.3-WS12-011A` Revision 2; `FR-JP-35` is superseded by `FR-JP-34`'s expansion and retained above for traceability, not deleted. The approved-30 baseline is unchanged; these are additive, Product-Owner-ratified requirements bringing the active total to 35 (36 IDs issued, 1 superseded).

---

## 8. Business Rules

Consolidated. No rule is restated with new wording where an existing citation already governs it — each row below is either a pre-existing rule (cited to its origin) or new to this pass (cited to its ratification).

| Rule | Statement | Source |
|---|---|---|
| `BR-002` | Claim ownership — a Workspace User voluntarily assumes responsibility for an unowned record | `PO-REVIEW-03` §7 |
| `BR-004` | Action-driven workflow — stage transitions are deliberate Owner actions, never automatic | v2.0 spec §9; `EBC-R1.3-WS12-002` §8 |
| `BR-005` | System-controlled statuses — no free-text status editing | v2.0 spec §9 |
| `BR-008` | Hybrid task creation — Tasks may be system-generated or manually created | v1.0 spec §7.10 |
| `BR-009` | Structured follow-ups — Follow-ups always carry a due date and purpose | v1.0 spec §7.11 |
| `BR-010` | One Journey Planning Record per destination or destination region per Traveller | `PD-JP-001` |
| `BR-011` | The Proposal (with Proposal Versions as its revision history) and Vendor Quotations are distinct and never merged into one record type | `PD-JP-003`; restated per Product Owner Ratification, Decision 1 |
| `BR-012` | A Journey may be created only by converting a confirmed Journey Planning Record; no reverse transition exists | `PD-JW-001` |
| `BR-013` | Commercial/proposal activity stays in Journey Planning; a Journey begins only after commercial confirmation | `PD-JW-002`–`004` |
| `BR-016` | An operational designation (e.g., Preferred Partner) is independent of lifecycle state | `PD-VM-003` |
| **Mandatory Traveller/Corporate-POC Association** | A Journey Planning Record must be associated with an identified Traveller or Corporate Point of Contact before planning can proceed; no artificial/placeholder Leads | Product Owner Ratification, Decision 2 |
| **Origin Traceability** | The origin channel shall be recorded on every Journey Planning Record | Product Owner Ratification, Decision 2 |
| **Duplicate Prevention on Creation** | Check for existing Travellers/active records before creating a new one | Product Owner Ratification, Decision 2 |
| **Single Business Object / No Duplication** | Journey is canonical, owned by SMV; no duplicate Journey; no duplicate Journey Planning Record; a booked Journey never returns to Journey Planning | Product Owner Ratification, Decision 3 |
| **Generic Ownership Model** | Claim / Assign / Reassign, independent of lifecycle status | `PO-REVIEW-03` §7 |
| **Separation of business concepts** | Planning Status, Ownership, Proposal, and Vendor Quotations remain separate concepts, never combined into one status field | `PO-REVIEW-03` §8 |
| **Archival, not deletion** | Journey Planning Records support archival only; permanent deletion is restricted to administrative/configuration data | v2.0 spec §9 (BR-007, rewritten); `PD-JP-007` |
| **Journey Amendment boundary** | A Journey Amendment shall not create a second Journey; Journey Planning shall never reopen a booked Journey; Journey Amendment belongs to Journey Workspace (WS13), not Journey Planning (WS12) | `PEB-001`, `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` §9 — cited as a scope boundary on Journey Planning, not restated as a Journey Planning rule of its own |
| `BR-020` *(Revision 2, `EBC-R1.3-WS12-011B`)* | **Minimum Planning Information** — a Journey Planning Record shall carry a known Number of Adults from the point of creation; all other Planning Parameters (Children, Infants, Travel Month, Travel Date, Nights, Departure City) may remain unknown at creation and are captured progressively during Discovery. Intended Travel Date remains fully discretionary throughout Journey Planning (its future mandatory point is handled separately by `BR-024`); Children, Infants, Travel Month, Nights and Departure City are subject to the Discovery-exit gate at `BR-021`. Budget is explicitly and permanently excluded from this rule (`FR-JP-32`). | `EBC-R1.3-WS12-011A` §5.3, Product Owner Ratification Revision 2 |
| `BR-021` *(Revision 2, expanded)* | **Discovery-Exit Composition, Trip-Shape and Departure Gate** — a Journey Planning Record shall not transition from Discovery to Planning unless Number of Children, Number of Infants, Intended Travel Month, Number of Nights and Preferred Departure City each hold an explicit value (an explicit zero satisfies this rule for Children/Infants/Nights; an unanswered field does not satisfy it for any of the five). A narrow, named exception within Section 5's otherwise discretion-based Discovery-exit design. | `EBC-R1.3-WS12-011A` §5.3, Product Owner Ratification Revision 2 |
| ~~`BR-022`~~ | ~~**Planning-Exit Departure City Gate** — a Journey Planning Record shall not transition from Planning to Proposal Shared unless Preferred Departure City holds an explicit value.~~ | **Superseded, Revision 2** — moved forward into `BR-021`'s Discovery-to-Planning gate; retained for traceability, not deleted |
| `BR-023` *(Revision 2)* | **Explicit-Value Data Integrity** — any Planning Parameter subject to the stage-transition gate under `BR-021` (Children, Infants, Travel Month, Nights, Departure City) shall be capable of storing an "unanswered" state distinct from any valid entered value, including zero. | `EBC-R1.3-WS12-011A` §5.3, Product Owner Ratification Revision 2 |
| `BR-024` *(Revision 2; refined by D-02 — Revision 3 note)* | **Travel Date Deferral** — Intended Travel Date remains fully discretionary throughout Journey Planning's own lifecycle (Lead Created through Closed) and is not subject to any gate within this module; it becomes required only at the booking/confirmation stage of the broader sales process, a stage outside Journey Planning's currently defined lifecycle (WS13, Journey Workspace — Section 17). | `EBC-R1.3-WS12-011A` §5.3, Product Owner Ratification Revision 2 |

---

## 9. Validation Rules

| Category | Rule |
|---|---|
| **Mandatory fields** | Traveller reference or Corporate Point of Contact reference (exactly one); Origin channel; Destination/Region — all required at record creation (`FR-JP-06`–`10`) |
| **Duplicate prevention** | Creation is checked against existing Travellers and active Journey Planning Records for the same Traveller/destination before it completes (`FR-JP-08`; `BR-010`) |
| **Status validation** | Current Stage may only be one of the seven approved values (Section 5); no free-text status is ever accepted (`BR-005`) |
| **Lifecycle validation** | A stage transition is valid only if it appears in Section 5's Allowed Transitions for the record's current stage; all others are rejected (`FR-JP-26`) |
| **Traveller association** | A record's Traveller reference, once set, may not be cleared without also setting a Corporate Point of Contact reference (mutual exclusivity is enforced at all times, not only at creation) |
| **Corporate association** | A record with origin "Corporate enquiry" may not leave Lead Created without a Corporate Point of Contact reference (`FR-JP-11`) |
| **Proposal validation** | A record may have at most one active Proposal at any time; a second Proposal creation attempt while one is active is rejected, not silently allowed to create a competing one (`FR-JP-14`) |

---

## 10. Permissions

| Capability | Workspace User | Administrator |
|---|---|---|
| View the Journey Planning queue | ✅ | ✅ |
| Claim an unclaimed record | ✅ | ✅ |
| Assign a record they own to another user | ✅ (Assign, per Generic Ownership Model) | ✅ |
| Reassign a record they do not own | ❌ | ✅ (`FR-JP-22`) |
| Capture/edit requirements, Discovery Notes, Activities | ✅ (own records) | ✅ |
| Prepare/revise the Proposal, send a Proposal Version | ✅ (own records) | ✅ |
| Record a Vendor Quotation | ✅ (own records) | ✅ |
| Create/manage Tasks and Follow-ups | ✅ (own records; assignable to others) | ✅ |
| Advance the lifecycle stage | ✅ (own records only) | ✅ |
| Close a record (Confirmed/Lost/Archived) | ✅ (own records) | ✅ |
| Archive a record outside normal closure | ❌ | ✅ (administrative correction) |
| View any record's full history/audit trail | ✅ (read-only) | ✅ |

Role boundaries beyond this business-level split remain subject to the wider Workspace RBAC ratification (`DEC-R1.3-009`: Administrators govern the platform, Privilege Users/Workspace Users operate the business) and the per-screen/per-action "Role TBC" markers still open in the UX Screen Inventory — not resolved by this card, and not a Journey-Planning-specific gap (Section 20).

---

## 11. Notifications

Business-level triggers only — no delivery mechanism or channel is specified here (that is an Architecture/Engineering decision, and the delivery-channel Open Question, `OQ-008`, remains open at the Workspace-wide Notification level, not specific to Journey Planning).

| Trigger | Recipient | Type (per v2.0 spec §7.12 model) |
|---|---|---|
| A record remains unclaimed beyond an operational threshold | Workspace Users / Administrator | Action Required |
| A Follow-up becomes due | The Follow-up's Owner | Action Required |
| A Task becomes due | The Task's Owner | Action Required |
| A Proposal Version is sent | (Internal, logged — no external notification implied beyond the send action itself) | — |
| A Vendor Quotation is recorded | (Internal, logged) | Informational |
| A record is reassigned | New Owner | Informational |
| A record converts to a Journey (Confirmed) | Owner; Journey Workspace queue | Informational |
| A record is closed as Lost or Archived | Owner | Informational |

---

## 12. Search

Journey Planning shall support filtering and sorting the queue and any record listing by: lifecycle stage; Owner; Traveller; Corporate Point of Contact; Destination/Region; origin channel; created date range. This is a single, cross-cutting business capability rather than a further set of numbered FRs, consistent with `PO-REVIEW-03`/v2.0 spec treating "search" as one topic group.

---

## 13. Audit

Every Journey Planning Record shall maintain a complete, read-only history covering: every lifecycle stage transition (who, when, from/to stage); every ownership change (claim, assign, reassign — who, when); every Proposal Version created and every send action (who, when); every Vendor Quotation recorded; every Task/Follow-up created and completed. This is Confirmed as existing UX scope (`JP-09`, "Journey Planning Record — History," read-only) and is restated here in business terms as the audit requirement that screen supports, not as a new capability.

---

## 14. Reporting Requirements

**Proposed (Arjun)** — reasonable business reporting needs inferred from the approved capability set, not previously specified anywhere in the evidence reviewed, and offered for Product Owner confirmation rather than treated as already approved:

- Count of active Journey Planning Records by stage, at any point in time.
- Conversion rate: Closed-Confirmed as a proportion of all Closed records, over a selectable period.
- Average time spent in each lifecycle stage.
- Volume of opportunities by origin channel, over a selectable period.
- Count of records per Workspace User (workload visibility, supporting the Dashboard's existing operational-visibility purpose, `PO-REVIEW-03` §9).

---

## 15. Exception Scenarios

| Scenario | Business Handling |
|---|---|
| **Invalid lifecycle transition** | Rejected per `FR-JP-26`/Section 5; the record remains in its current stage; the attempted transition is not silently ignored — it should be surfaced to the user as invalid (a UX concern for WS12-004, not decided here) |
| **Duplicate Proposal** | Rejected per `FR-JP-14`; the existing active Proposal remains authoritative; a Workspace User revises it (creating a new Proposal Version) rather than starting a second Proposal |
| **Cancelled Planning** | A Workspace User closes the record with outcome Lost or Archived, per Section 5; no Journey is created; the record is retained, never deleted (`PD-JP-007`) |
| **Rejected Proposal** | The Traveller/Corporate Point of Contact declines during Decision; the Owner closes the record as Lost (if planning ends) or returns to Revision (if a further attempt is warranted) — the record does not return to an earlier stage than Revision once a Proposal has been shared (Section 5) |
| **Traveller withdrawal** | The Traveller withdraws interest at any stage; the Owner closes the record as Lost; the association with the Traveller is preserved for historical/relationship purposes (Traveller Hub retains the relationship regardless of this record's outcome) |
| **Corporate withdrawal** | Same handling as Traveller withdrawal, substituting the Corporate Point of Contact; the corporate relationship itself is not assumed to end because one planning effort did |

---

## 16. Business Constraints

Consolidated by reference rather than restated, per Team Satvi's "avoid duplicate requirements" principle:

- Exactly one active Proposal per Journey Planning Record (Section 8, Proposal validation; `FR-JP-14`).
- Exactly one Journey Planning Record per destination/region per Traveller while active (`BR-010`).
- No duplicate Journey Planning Record and no duplicate Journey for the same opportunity (Single Business Object Principle).
- Vendor Quotations are internal-only; never vendor-facing (Ratified Decision 1).
- No permanent deletion of Journey Planning Records, Journeys, or related history — archival only (`PD-JP-007`, BR-007 rewritten).
- A booked Journey never returns to Journey Planning (Single Business Object Principle; `PEB-001` boundary).

---

## 17. Integration Points

| Module | Nature of Integration | Source |
|---|---|---|
| **Journey Workspace** (WS13) | Receives the converted Journey on successful (Confirmed) closure; Journey Planning never manages a Journey after conversion | `PO-REVIEW-03` §9; `BR-012`/`BR-013` |
| **Journey Workspace** (WS13) — Booking/Confirmation Travel Date *(Revision 2, `EBC-R1.3-WS12-011B`, Forward Allocation)* | Exact Travel Date becomes mandatory only when the business process reaches Booking/Confirmation; that gate, and any booking workflow, belongs to Journey Workspace (WS13) and is explicitly not introduced into Journey Planning (WS12) | `FR-JP-36`, `BR-024`; Product Owner Ratification Revision 2, `EBC-R1.3-WS12-011B` |
| **Traveller Hub** (WS14) | Owns Traveller identity and relationship data; Journey Planning references, never owns, the Traveller | `PD-JP-004`; UX evidence `JP-02` → `TH-02` |
| **Vendor Management** (WS16) | Owns Vendor identity and lifecycle; Journey Planning references a Vendor when recording a Vendor Quotation | `PO-REVIEW-03` §9; UX evidence `JP-06` → `VM-02` |
| **Destination Intelligence** (WS17) | Owns Destination Profile content; Journey Planning references a Destination/Region on the Journey Planning Record | v2.0 spec §7.9-area; Section 6.7 above |
| **Itinerary Studio** (WS15) | Supplies the Traveller Itinerary a Proposal Version may reference as its content basis | `PO-REVIEW-03` §9; UX evidence `JP-05` → `IS-03` |
| **Documents** | Supporting documentation (Document Reference, Section 6.11) may be associated where applicable; storage mechanism is a wider, still-open Workspace question (`OQ-014`), not decided here |
| **Notifications** | Journey Planning generates the business-level triggers listed in Section 11; delivery is owned by the Notifications capability itself, not Journey Planning | v2.0 spec §7.12; `PO-REVIEW-03` §9 |

---

## 18. Out of Scope

Explicit exclusions, consistent with this card's own instruction:

- **Journey Amendment** — belongs to Journey Workspace (WS13), governed as `PEB-001` in the Product Evolution Backlog; Journey Planning shall never reopen a booked Journey.
- **Booking** — a Journey Workspace (WS13) concern, out of Journey Planning's scope entirely.
- **Payments** — not addressed by any Journey Planning evidence reviewed; out of scope.
- **Vendor negotiation** — Journey Planning records the outcome (a Vendor Quotation); it does not describe or own the negotiation process itself, which is a Vendor Management (WS16) concern if it exists at all.
- **Itinerary Studio editing** — Journey Planning references a Traveller Itinerary; authoring/editing one is Itinerary Studio's (WS15) capability, not Journey Planning's.
- **Traveller Portal** — no traveller-facing interface exists or is described anywhere in the evidence; Journey Planning is an internal Workspace capability only.
- UX design, Architecture, Engineering, and QA — per this card's own instruction; this document describes business behaviour only.

---

## 19. Requirement Traceability Matrix

| FR | Business Objective (Section 2) | Business Rule(s) | Discovery Finding (`EBC-R1.3-WS12-002`) | Product Decision |
|---|---|---|---|---|
| FR-JP-01 | Objective 1 | `BR-004` | §7, §8 (Capability Map, Lifecycle) | `PD-JP-005` |
| FR-JP-02 | Objective 1 | Generic Ownership Model | §7 | `PO-REVIEW-03` §7 |
| FR-JP-03 | Objective 1 | Generic Ownership Model | §7 | `PO-REVIEW-03` §7 |
| FR-JP-04 | Objective 1 | `BR-004` | §8 | `PD-JP-005` |
| FR-JP-05 | Objective 1 | `BR-004`, `BR-005` | §8 | `PD-JP-005` |
| FR-JP-06 | Objective 1 | Origin Traceability | §3, §5 (this card, ratified) | Product Owner Ratification, Decision 2 |
| FR-JP-07 | Objective 2 | Origin Traceability | as above | Decision 2 |
| FR-JP-08 | Objective 2 | Duplicate Prevention | as above | Decision 2 |
| FR-JP-09 | Objective 2 | Mandatory Association | as above | Decision 2 |
| FR-JP-10 | Objective 3 | Mandatory Association | §10 (Object Catalogue) | Decision 2 |
| FR-JP-11 | Objective 3 | Mandatory Association | §10 | Decision 2 |
| FR-JP-12 | Objective 1 | — | §9 (Process Narrative) | `PD-JP-006` |
| FR-JP-13 | Objective 1 | — | §9 | `PD-JP-006` |
| FR-JP-14 | Objective 3 | `BR-011` (restated) | §10 | Decision 1 |
| FR-JP-15 | Objective 3 | `BR-011` (restated) | §10 | Decision 1 |
| FR-JP-16 | Objective 1 | — | §9 | `PO-REVIEW-03` §9 |
| FR-JP-17 | Objective 1 | — | §9 | `PO-REVIEW-03` §9 |
| FR-JP-18 | Objective 3 | `BR-011` | §10, §11 | `PD-JP-003` |
| FR-JP-19 | Objective 1 | — | §9, §10 | `PD-JP-003` |
| FR-JP-20 | Objective 3 | Ratified Vendor Quotation Model | §10 (this card) | Decision 1 |
| FR-JP-21 | Objective 3 | Ratified Vendor Quotation Model | §6 (Stakeholders) | Decision 1 |
| FR-JP-22 | Objective 1 | Generic Ownership Model | §7 | `PO-REVIEW-03` §7 |
| FR-JP-23 | Objective 1 | Generic Ownership Model / Separation of concepts | §11 | `PO-REVIEW-03` §8 |
| FR-JP-24 | Objective 1 | `BR-009` | §7, §10 | `BR-009` |
| FR-JP-25 | Objective 1 | `BR-008` | §7, §10 | `BR-008` |
| FR-JP-26 | Objective 4 | `BR-004`, `BR-005` | §8 | `PD-JP-005` |
| FR-JP-27 | Objective 4 | — | §8 | `PD-JP-005` |
| FR-JP-28 | Objective 4 | `BR-012`, Single Business Object Principle | §8 | Decision 3, `BR-012` |
| FR-JP-29 | Objective 4 | Single Business Object Principle | §8 (this card) | Decision 3 |
| FR-JP-30 | Objective 4 | Single Business Object Principle, Duplicate Prevention | §8 (this card) | Decisions 2 & 3 |
| FR-JP-31 | Objective 1/2 (Minimum Planning Information) | `BR-020` | Confirmed implementation gap, `EBC-R1.3-WS12-011A` §1.1/1.2 | Product Owner Background, `WS12-011A`; Ratification, `WS12-011B` |
| FR-JP-32 | Objective 1 (consultative Budget) | Extends `FR-JP-13`'s existing pattern | `JOURNEY-PASSPORT-v1.0.md` budget-as-non-status-signal principle | Product Owner Background, `WS12-011A`; Ratification, `WS12-011B` |
| FR-JP-33 | Objective 1/3 (visible composition from creation) | Supports `BR-021`'s later gate | Product Owner clarification | Tiger/Product Owner clarification, Revision 1; Ratification, `WS12-011B` |
| FR-JP-34 | Objective 1/4 (composition, trip-shape, departure known before Planning) | `BR-021` (expanded) | `EBC-R1.3-WS12-011A` §4 Lifecycle Requirement Matrix | Revision 1 clarification; `OQ-011A-5` decision, Revision 2; Ratification, `WS12-011B` |
| ~~FR-JP-35~~ | superseded | ~~`BR-022`~~ (superseded) | superseded | superseded, Revision 2, `WS12-011B` |
| FR-JP-36 | Objective 4 (Travel Date not required in JP; future mandatory point recorded for WS13) | `BR-024` | `EBC-R1.3-WS12-011A` §4 Lifecycle Requirement Matrix | Product Owner decision, Revision 2; Ratification, `WS12-011B` |

---

## 20. Open Questions

Only genuine, unresolved business questions. **No ratified Product Owner decision is reopened by any item below** — each item is either a pre-existing gap `EBC-R1.3-WS12-002` already disclosed as such, or a new, narrowly-scoped question this Business Analysis surfaced while defining field-level detail the Discovery phase correctly left undone.

| # | Open Question | Status / Owner |
|---|---|---|
| OQ-A | Traveller communication channel — in-Workspace messaging vs. logged external communication | Carried from `EBC-R1.3-WS12-002` §7; still open; Product Owner / Archie |
| OQ-B | Corporate Point of Contact's data ownership — a new, independent store, or a corporate-flavoured variant within Traveller Hub | New this pass (Section 6.6); Archie, WS12-005 |
| OQ-C | Activity's field-level definition — this card proposes one (Section 6.10), not yet Product-Owner-confirmed | New this pass; Product Owner / Archie |
| OQ-D | `OQ-022` — whether the Generic Ownership Model's Claim/Assign/Reassign mechanism applies identically to other, not-yet-analysed Workspace Business Modules | Out of this module's own scope; not a Journey Planning blocker (`EBC-R1.3-WS12-002` §14) |
| OQ-E | `OQ-014` — file storage mechanism for Document Reference | Wider Workspace UX question, not Journey-Planning-specific; carried from the UX Screen Inventory (`JW-07`'s own note) |
| OQ-F | Reporting requirements (Section 14) are Proposed (Arjun), not yet Product-Owner-confirmed at the specific-metric level | New this pass; Product Owner |
| OQ-G | The unclaimed-record notification threshold (Section 11) is not specified anywhere in the evidence | New this pass; Product Owner / Sophie (as part of UX Design, since it may be a configuration value rather than a fixed business rule) |

**Explicitly not reopened:** the Proposal Model, the Journey Planning Entry Model (including Manual Creation Policy and the eight origin channels), the Single Business Object Principle, `BR-010`'s exact meaning, the seven lifecycle stage names, and the fate of Task/Follow-up/Activity as named objects — all are treated as settled Product Owner decisions throughout this document.

---

## 21. Quality Checklist

- [x] Repository connected
- [x] Repository updated (this document, at its canonical path)
- [x] Existing repository conventions followed (header block, Confirmed/Proposed/Open labelling, cross-referencing style)
- [x] No duplicate requirements — Section 16 references Sections 7/8 rather than restating; Section 8 references prior EBCs rather than re-deriving rules already stated
- [x] No duplicate Business Rules — each row in Section 8 cites a single origin
- [x] Product decisions preserved — Section 20 explicitly confirms none is reopened
- [x] Functional Requirements complete — all 30 approved FRs drafted (`FR-JP-01`–`30`)
- [x] RTM complete — Section 19 traces all 30 FRs
- [x] Scope boundaries respected — Section 18 lists explicit exclusions; no UX, Architecture, Engineering, or QA content anywhere in this document
- [x] Open Questions genuine — Section 20, with an explicit non-reopening statement
- [x] No UX
- [x] No Architecture
- [x] No Engineering
- [x] No QA

---

## 22. Deliverables and Handover

**Primary deliverable:** this document, at `docs/09-Development/EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md` — a repository update, no Claude-only deliverable, per this card's own instruction. (Also mirrored to the Claude Project for cross-surface visibility, consistent with this Project's established convention for every prior EBC in this workstream — not a substitute for the repository copy, which is authoritative.)

**Upon acceptance:**

- Sophie may begin UX Design (WS12-004) against Sections 4–7 and 9–15.
- Archie may perform Solution Architecture (WS12-005) against Sections 6–9, 16–17, and the two data-ownership Open Questions (OQ-B, OQ-D).
- Rad may plan Engineering (WS12-006) once WS12-004/005 complete.
- Keerthi may derive QA scenarios directly from Sections 7 (Functional Requirements) and 15 (Exception Scenarios).

**Recommendation to Tiger** (not actioned by this card): reconcile the committed `EBC-R1.3-WS12-002` repository copy with its ratified content (Section 0), so the repository's documentary record is internally consistent for any future reader who has not seen this card's own restatement of the ratifications.

---

*Prepared by Arjun, Senior Product & Business Analyst, on behalf of Team Satvi, per EBC-R1.3-WS12-003. This Business Analysis is Journey Planning's canonical business specification and is submitted for Product Owner review ahead of UX Design (WS12-004).*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014CQZsVKR51uH4yidUW6nkh
