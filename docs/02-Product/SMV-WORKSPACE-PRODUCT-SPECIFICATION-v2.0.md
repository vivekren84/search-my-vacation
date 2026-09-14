# Search My Vacation — SMV Workspace: Product Specification

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v2.0 |
| **Status** | Consolidated Baseline Update — incorporates the complete Release 1.3 Product Owner Review (all nine Workspace modules). Sections marked **Approved (Product Owner Review)** carry Product Owner authority via the source evidence cited. Sections still marked **Proposed (Arjun)** or **Open Question** have not been touched by the Product Owner Review and retain their v1.0 status. |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 13 September 2026 |
| **Purpose** | Consolidate the approved Release 1.3 Product Owner Review (Modules 1–9) into the SMV Workspace Product Specification, replacing Proposed content with Approved content wherever the Product Owner Review provides it, while explicitly preserving — not inventing — the detailed Functional Requirement wording still pending as a separate Business Analysis activity. |
| **Prepared under** | `EBC-R1.3-WS3-004`, Stage 4 (Consolidated Baseline Update), following Tiger's decision summary of 13 September 2026 on the four Stage 3 escalations |
| **Predecessor** | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md` (10 September 2026) |
| **Source evidence for this update** | `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` v1.0; `WS3-DELIVERY-GOVERNANCE-CONSISTENCY-REVIEW.md` v1.0; `WS3-PRODUCT-SPECIFICATION-RTM-IMPACT-ASSESSMENT.md` v1.0; `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md` through `PO-REVIEW-09-Settings.md` |
| **Related** | `docs/10-Backlog/RELEASE-1.3.md` §7, §15; `docs/00-Project-Compass/GLOSSARY.md`; `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`; `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` (companion update) |

> **Audience:** Sophie (UX), Archie (Architecture), Tiger (Delivery Planning), Rad (Engineering estimation), Keerthi (QA planning), and the Product Owner.

### 1.1 How to read this document

| Label | Meaning |
| --- | --- |
| **Confirmed** | Recorded verbatim, or as a direct restatement, of a decision already approved in Product Discovery or `RELEASE-1.3.md`. Carried from v1.0 unchanged. |
| **Approved (Product Owner Review)** | A decision recorded in one of the seven `PO-REVIEW-0X` documents (or the Phase 1/2 cross-cutting decisions and Dashboard/Traveller Hub reviews consolidated in the Baseline Handover), approved by the Product Owner during the Release 1.3 Product Owner Review. Carries the same authority as Confirmed. |
| **Proposed (Arjun)** | A specification this document adds to close a gap the Product Owner Review did not address. Requires explicit Product Owner confirmation before Sophie, Archie or Rad treat it as approved. Unchanged in meaning from v1.0; many v1.0 Proposed items are promoted to Approved in this version, but any not explicitly promoted below remain Proposed. |
| **Legacy — pending rewrite** | A Functional Requirement drafted in v1.0 against an assumption the Product Owner Review has since superseded (the pre-review single-Itinerary-per-Journey model; the read-only Destination Intelligence assumption). Retained for continuity, not deleted, but should not be treated as reflecting current approved scope. |
| **Assumption** | A statement this document relies on that was not stated by any source document, disclosed so it can be corrected rather than silently carried forward. |
| **Open Question** | A genuine unresolved item requiring a Product Owner or cross-persona decision — see Section 14. |

No content below invents destination information, architecture, or visual design, and — per Tiger's explicit Stage 4 instruction — no content below invents detailed Functional Requirement wording for the ~212 Functional Requirements the Product Owner Review approved by count and topic group only. Where that wording does not exist in the evidence, this document says so and records the approved count/topic groups instead, preserving traceability without fabricating text. Drafting that wording is tracked as a separate, not-yet-started Business Analysis activity (§14, OQ-018).

---

## 2. Product Vision

**Confirmed** (unchanged from v1.0):

The SMV Workspace is the operational platform for Search My Vacation — the internal system through which the Search My Vacation team plans, delivers and manages traveller journeys, day to day.

Guiding principles, as agreed:

- **Single operational workspace** — one platform for the team's day-to-day operational work, rather than work spread across disconnected tools.
- **Daily decision support** — the Workspace actively supports the decisions the team needs to make each day, not just stores records.
- **Single source of truth** — operational data (leads, journeys, vendors, bookings, tasks) lives in one authoritative place.
- **Team collaboration** — the Workspace supports the team working together on shared operational work, not just individual record-keeping.
- **Operational visibility** — the state of the business's operational work is visible to the people who need to see it.

**Approved (Product Owner Review) — reinforced by the completed review:** the Product Owner Review's Knowledge Architecture (Traveller Hub, Destination Intelligence, Vendor Management, Itinerary Studio) and Operational Architecture (Dashboard, Journey Planning, Journey Workspace, Notifications) findings confirm this vision is realised through two coherent, cross-module patterns rather than nine independent modules — see §8.

---

## 3. Business Context

### 3.1 Why the SMV Workspace exists

**Confirmed / Approved (Product Owner Review), unchanged from v1.0:** the SMV Workspace is the concrete realisation of the CRM capability named in `GLOSSARY.md` GL-015. The Product Owner Review has not revisited this framing; it stands.

### 3.2 Business problems solved

Unchanged from v1.0 — Fragmentation, No daily decision support, Lost continuity, No visibility for the business. The Product Owner Review's approval of all nine modules, rather than two, strengthens rather than changes this framing: the review confirms the Workspace is intended to solve all four problems across the full operational surface, not only Dashboard and Traveller Hub.

### 3.3 Target users

Unchanged from v1.0. **Open Question OQ-001 (formerly OQ-01)** — the detailed Administrator / Privilege User capability split — was not addressed by the Product Owner Review's seven module documents, which speak in terms of "Workspace User" without revisiting the two-role model. This Open Question remains open; it is not resolved by this update.

### 3.4 Operational goals

Unchanged from v1.0.

---

## 4. User Personas

Unchanged from v1.0. **Open Question OQ-001** (§3.3 above) still governs this section — the Administrator/Privilege User capability lists in §4.1/§4.2 remain **Proposed (Arjun)**, not Approved, because no Product Owner Review evidence addressed them directly. This is called out explicitly rather than assumed resolved by the fact that surrounding modules were approved.

---

## 5. Functional Modules — Overview

**Confirmed / Approved (Product Owner Review):** the nine Release 1.3 MVP modules are unchanged in name and count. All nine now have Product Owner–approved Vision, Business Purpose, primary Business Object, and either full or count/topic-group-level Functional Requirement scope (§6).

| # | Module | One-line purpose | Product Owner Review Status |
| --- | --- | --- | --- |
| 1 | Dashboard | Business-first daily entry point answering "what needs attention, who owns it, what's next" | Approved, complete |
| 2 | Traveller Hub | The single record of a Traveller and their relationship history with Search My Vacation | Approved, complete |
| 3 | Journey Planning | Operational Queues and workflow for Phase 1 of the Journey Lifecycle | Approved, complete |
| 4 | Journey Workspace | The working record of a confirmed Journey — Phase 2 (Delivery) only | Approved, complete |
| 5 | Itinerary Studio | Authoring and governance surface for Master Itineraries, Traveller Itineraries and Quotations | Approved, complete |
| 6 | Destination Intelligence | Governed organisational knowledge surface for Destination Profiles | Approved, complete (architecture reconciliation pending — see §6.6) |
| 7 | Vendor Management | Vendor master records, Preferred Partner designation, and Vendor Confirmations | Approved, complete |
| 8 | Notifications | System-generated, condition-based alerts for operational events | Approved, complete (delivery channel still open — see §6.8) |
| 9 | Settings | Workspace administration/configuration and personal user preferences | Approved, complete |

---

## 6. Functional Modules and Requirements

### 6.1 Dashboard

**Approved (Product Owner Review)**, unchanged in substance from v1.0's Confirmed content. Business-first, operationally prioritising, built around a **My Work / Team toggle**, composed of dashboard cards, answering *What needs attention? Who owns it? What's the next best action?*

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-DASH-01 | The Dashboard shall present operational information as cards, not dense tables. | Approved |
| FR-DASH-02 | The Dashboard shall provide a toggle between "My Work" and "Team". | Approved |
| FR-DASH-03 | Every card shown shall make the item's owner visible. | Approved |
| FR-DASH-04 | The Dashboard shall surface a recommended next action for each attention-worthy item shown. | Approved |
| FR-DASH-05 | The Dashboard shall summarise the Operational Queues named in §6.3–§6.4/§6.7 (Journey Planning, Active Journeys, Vendor Confirmations, Tasks, Follow-ups) as distinct cards or card groups. | Approved — dependency queues (Journey Planning, Journey Workspace/Active Journeys, Vendor Confirmations, Notifications) are now themselves Approved, so this requirement is no longer blocked. |
| FR-DASH-06 | Administrators viewing "Team" shall be able to filter by team member. | Proposed (Arjun) — not addressed by the Product Owner Review; still requires confirmation (OQ-001). |

**New capabilities approved but not yet drafted as FRs:** the Product Owner Review approved a post-login landing page and named sets of KPIs and Quick Actions (five each) for the Dashboard, beyond the six FRs above. Per Tiger's Stage 4 instruction, individual FR wording for these is not invented here; they are tracked as part of the FR-drafting dependency (§14, OQ-018). Full narrative detail is in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.1.

**Depends on:** Lead, Journey Planning Record, Journey, Task, Follow-up, Vendor (read-summarised); all Business Rules.

### 6.2 Traveller Hub

**Approved (Product Owner Review)**, unchanged in substance from v1.0's proposed content, now confirmed.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-HUB-01 | The Traveller Hub shall provide a single record per Traveller, consolidating their Leads, Journeys (past and current), and Follow-up history. | Approved |
| FR-HUB-02 | The Traveller Hub shall implement Mobile number matching (BR-001). | Approved |
| FR-HUB-03 | The Traveller Hub shall display the originating Journey Passport context for site-originated Leads. | Approved |
| FR-HUB-04 | A team member shall be able to search for a Traveller by name or mobile number. | Approved |
| FR-HUB-05 | The Traveller Hub shall show a Traveller's repeat-traveller status. | Approved |

**New capabilities approved but not yet drafted as FRs:** a Traveller Timeline, a Traveller Snapshot, and Operational Flags (including a "Potential Duplicate" flag) were approved as new Traveller Hub capabilities. Relationship Health scoring was explicitly deferred (out of scope for Release 1.3). Duplicate management is manual-only — the system flags a potential duplicate but does not merge records automatically. Companion/family traveller handling was also reviewed and approved. As with Dashboard, individual FR wording for the Timeline/Snapshot/Operational Flags capabilities is not invented here (§14, OQ-018); full detail is in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.2.

**Depends on:** Traveller, Lead, Journey, Journey Passport, Follow-up; BR-001.

### 6.3 Journey Planning

**Approved (Product Owner Review)** (`PO-REVIEW-03-Journey-Planning.md`).

**Vision.** The Workspace capability for discovering, qualifying, designing and commercialising a proposed journey before any operational commitment is made — an iterative planning workspace, not a booking management tool.

**Business Purpose.** Understand traveller requirements, coordinate planning activities, manage proposal iterations, coordinate vendor quotations, guide commercial discussions, and convert a qualified proposal into a confirmed Journey, while preserving the complete planning history.

Approved Product Owner Decisions PD-JP-001 through PD-JP-007 are carried into the Business Objects (§7.3) and Business Rules (§9) sections below; see `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.3 for the full narrative and reasoning behind each.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-JP-01 | The Journey Planning module shall present the Journey Planning queue, grouped by lifecycle stage. | Approved — stage grouping now follows the confirmed PD-JP-005 lifecycle (§10.1), not the illustrative v1.0 breakdown. |
| FR-JP-02 | Unclaimed items shall be visible to every Privilege User/Workspace User and claimable by any of them (Claim ownership, generalised as the Workspace's Generic Ownership Model, §8). | Approved |
| FR-JP-03 | Once claimed, an item shall show its Owner and no longer appear in the unclaimed pool. | Approved |
| FR-JP-04 | The Journey Planning queue shall follow the Product Owner–approved lifecycle stages (§10.1). | Approved — supersedes the v1.0 illustrative 6-stage breakdown; see §10.1. |
| FR-JP-05 | Progressing an item to its next stage shall be a deliberate action taken by its Owner, not a free-text status edit. | Approved |

**Functional Requirement Summary.** The Product Owner Review approved **30 Functional Requirements, all Must Have**, covering: planning creation, traveller association, requirement capture, proposal management, vendor quotation management, ownership, follow-ups, tasks, status management, search, audit history, and governance. The five FRs above are the existing drafted subset; the wording for the remaining approximately 25 is not present anywhere in the evidence and is not invented here (§14, OQ-018).

**Cross-Module Relationships:** Traveller Hub (traveller identity/relationship — reference only, §7.3); Journey Workspace (receives confirmed planning records on conversion, §7.4); Vendor Management (quotations, commercial input); Itinerary Studio (reusable itinerary assets for customisation); Notifications (planning-activity alerts); Dashboard (operational visibility into planning workload).

**Depends on:** Journey Planning Record, Traveller, Journey; BR-002 (Claim ownership), BR-004 (Action-driven workflow), BR-005 (System-controlled statuses), BR-010, BR-011 (new — §9).

### 6.4 Journey Workspace

**Approved (Product Owner Review)** (`PO-REVIEW-04-Journey-Workspace.md`). **This section corrects a v1.0 assumption — see the note immediately below.**

> **Correction from v1.0:** v1.0 proposed, as an unconfirmed assumption (OQ-005), that Journey Workspace was the working record spanning *both* Journey Lifecycle phases. The Product Owner Review confirms the opposite: Journey Workspace begins only after commercial confirmation and covers **Phase 2 (Delivery) only**. Phase 1 (commercial/proposal activity) stays entirely in Journey Planning (§6.3). This is a correction, not a refinement — anywhere v1.0 described Journey Workspace as covering "both phases," that description is superseded by this section.

**Vision.** The operational execution module managing confirmed journeys from commercial confirmation to operational closure — coordinating bookings, traveller support and operational readiness.

**Business Purpose.** Manage confirmed journeys, coordinate operational readiness, monitor booking progress, manage traveller servicing, coordinate suppliers, support travellers before/during/after travel, preserve operational history.

Approved Product Owner Decisions PD-JW-001 through PD-JW-006 are carried into §7.4 and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.4.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-JW-01 | The Journey Workspace shall be the single working record for one Journey: its Traveller(s), current Phase 2 stage, linked Itinerary/Quotation, linked Vendor Confirmations, and Tasks/Follow-ups. | Approved — corrected to Phase 2 scope only. |
| FR-JW-02 | The Journey Workspace shall show the Journey's full stage history. | Approved |
| FR-JW-03 | The Journey Workspace shall present the Active Journeys queue (Phase 2 only) with the same claim/ownership behaviour as Journey Planning. | Approved |
| FR-JW-04 | A Journey's status field shall be system-derived, never a freely editable dropdown. | Approved |

**Functional Requirement Summary.** The Product Owner Review approved **31 Functional Requirements, all Must Have**, covering: journey creation, operational management, booking coordination, traveller servicing, vendor coordination, operational readiness, task management, notifications, search, audit history, governance, and **operational alerts** (specifically endorsed by the Product Owner as a capability making the Workspace the team's primary daily tool). The four FRs above are the existing drafted subset; wording for the remaining approximately 27 is not invented here (§14, OQ-018).

**Cross-Module Relationships:** Journey Planning (receives confirmed records via one-way conversion only, never created directly — PD-JW-001); Traveller Hub (relationship context); Itinerary Studio (approved operational itinerary); Vendor Management (supplier coordination/booking fulfilment); Notifications (departures, confirmations, traveller support alerts); Dashboard (active-journey visibility).

**Depends on:** Journey, Master Itinerary, Traveller Itinerary, Quotation, Vendor, Task, Follow-up; BR-002, BR-005, BR-012, BR-013 (new — §9).

### 6.5 Itinerary Studio

**Approved (Product Owner Review)** (`PO-REVIEW-05-Itinerary-Studio.md`). **This section replaces the v1.0 single-Itinerary-per-Journey model — see the note below.**

> **Correction from v1.0:** v1.0's Business Object §7.6 ("Itinerary") described one Itinerary belonging to one Journey. The Product Owner Review approves a materially different, two-tier model: a **Master Itinerary** is organisational knowledge (approved content for a destination or destination combination, shared and reused), and a **Traveller Itinerary** is a personalised copy made for a specific Journey. The Master Itinerary is not consumed or changed by any one Journey. See §7.6/§7.6a below.

**Vision.** The organisational capability for creating, maintaining, governing and continuously improving Search My Vacation's reusable itinerary knowledge — building assets that are reused, personalised and enhanced over time, not isolated customer documents. The module name **"Itinerary Studio"** is retained.

**Business Purpose.** Create reusable Master Itineraries, personalise them per traveller, preserve organisational travel knowledge, incorporate learnings from completed journeys, reduce repeated effort, continuously improve the traveller experience.

Approved Product Owner Decisions PD-IS-001 through PD-IS-008 are carried into §7.6/§7.6a and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.5.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-IS-01 | *(Legacy — pending rewrite)* Originally: author a day-wise Itinerary for an owned Journey. | Superseded in spirit by PD-IS-001–003 (Master Itinerary authored organisationally; Traveller Itinerary created by copying and personalising it). Not rewritten here — see §14 OQ-018. |
| FR-IS-02 | *(Legacy — pending rewrite)* Originally: generate a Quotation from an Itinerary. | The relationship between a Traveller Itinerary and a Quotation still needs restating against the new two-tier model; not rewritten here. See also §7.8 note on Quotation/Proposal Version terminology. |
| FR-IS-03 | *(Legacy — pending rewrite)* Originally: sending a Quotation is a deliberate, logged action. | Principle (Action-driven workflow, BR-004) still holds; requirement text needs updating to the new object model. |
| FR-IS-04 | *(Legacy — pending rewrite)* Originally: reference Destination Intelligence content without duplicating it. | Principle still holds; requirement text should reference Destination Profile (§7.14), not the pre-review Destination object. |

**Functional Requirement Summary.** The Product Owner Review approved **36 Functional Requirements, all Must Have**, covering: Master Itinerary management, traveller itinerary creation, personalisation, version management, learning capture, governance, search, approval, and organisational knowledge preservation. The four legacy FRs above were written against the pre-review model and require substantial rewriting, not simple extension — flagged in the Impact Assessment as a larger-than-usual Stage 4/5 item. Individual FR wording for the approved 36 (legacy or new) is not invented here (§14, OQ-018).

**Cross-Module Relationships:** Journey Planning (reusable assets for proposals); Journey Workspace (operational itinerary for confirmed journeys); Destination Intelligence (consumes destination knowledge to improve itineraries); Traveller Hub (personalisation support); Vendor Management (preferred supplier recommendations); Notifications (itinerary-update alerts).

**Depends on:** Master Itinerary, Traveller Itinerary, Quotation, Journey, Destination Profile (reference); BR-004, BR-014, BR-015 (new — §9).

### 6.6 Destination Intelligence

**Approved (Product Owner Review)** (`PO-REVIEW-07-Destination-Intelligence.md`), **with one item explicitly not decided here.**

> **Correction from v1.0, and an explicit architecture flag:** v1.0 assumed (OQ-007) that this module is a read-only Workspace surface into the existing, externally-governed Destination Knowledge Base. The Product Owner Review approves a different business model: a **Destination Profile** object, renamed from "Destination Knowledge," authored and governed **inside** the Workspace through a Draft → Under Review → Approved lifecycle. This directly conflicts with the already-implemented WS1 Bootstrap Generator / Travel Region / `geo_places` pipeline, in which destination content is externally curated via a repository-generated Bootstrap Workbook. Per Tiger's explicit Stage 3 decision (13 September 2026): *"This is an Architecture concern rather than a Product concern. Carry this forward to Archie during Technical Architecture Review. No Product Specification changes are required at this stage"* regarding the reconciliation itself. Accordingly, this section records the **approved business/governance decisions** below without asserting how they are technically implemented or how they reconcile with the WS1 pipeline — that determination belongs to Archie's Technical Architecture Review, not to this Specification.

**Vision.** The organisational capability for creating, governing and continuously improving Search My Vacation's destination knowledge — trusted operational knowledge supporting planning, itinerary creation and decision-making, not a static repository.

**Business Purpose.** Maintain trusted destination information, support Journey Planning, improve Master Itineraries, preserve operational learnings, guide traveller recommendations, provide organisational destination expertise.

Approved Product Owner Decisions PD-DI-001 through PD-DI-006 are carried into §7.14 and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.7.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-DI-01 | *(Legacy — pending rewrite)* Originally: look up a destination's Product-approved knowledge, read-only. | Superseded in spirit by PD-DI-001–004 (Destination Profile as a governed, Workspace-progressed object). Not rewritten here pending Archie's architecture decision. |
| FR-DI-02 | *(Legacy — pending rewrite)* Originally: respect existing ACTIVE/COMING_SOON/INACTIVE status gating. | The relationship between this existing status model and the new Draft/Under Review/Approved lifecycle (PD-DI-004) is not addressed by the evidence and should not be assumed to be the same thing. |
| FR-DI-03 | *(Legacy — pending rewrite)* Originally: no authoring/approval capability inside the Workspace. | **Directly contradicted** by PD-DI-002/003/004, which approve an authoring and governance workflow inside the Workspace. Retained here only to show what is superseded, not as current guidance. |

**Functional Requirement Summary.** The Product Owner Review approved **35 Functional Requirements, all Must Have**, covering: Destination Profile management, knowledge governance, review and approval, destination search, destination relationships, organisational learning, audit history, search, lifecycle management, governance. All three legacy FRs above are superseded in whole or in part; individual FR wording for the approved 35 is not invented here and should not be drafted until Archie's architecture review resolves the WS1 reconciliation (§14, OQ-019).

**Cross-Module Relationships:** Journey Planning (trusted information during planning); Itinerary Studio (destination knowledge feeding Master Itineraries); Journey Workspace (operational guidance during confirmed journeys); Vendor Management (destination-specific supplier knowledge); Traveller Hub (destination-based recommendations); Notifications (governance/review/approval alerts).

**Depends on:** Destination Profile (§7.14 — object model pending Archie); BR-015 (new — §9).

### 6.7 Vendor Management

**Approved (Product Owner Review)** (`PO-REVIEW-06-Vendor-Management.md`).

**Vision.** The capability for establishing, maintaining and continuously improving Search My Vacation's supplier ecosystem — the organisational memory of supplier relationships, not merely a contact directory.

**Business Purpose.** Maintain supplier information, support commercial planning, coordinate supplier relationships, preserve performance history, identify preferred partners, improve operational consistency, strengthen long-term relationships.

Approved Product Owner Decisions PD-VM-001 through PD-VM-005 are carried into §7.7 and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.6.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-VM-01 | Administrators shall be able to create, edit and mark Vendor master records **Inactive**. | Approved — terminology updated from "deactivate"/"Deactivated" to **Inactive**, per Tiger's terminology decision (13 September 2026). |
| FR-VM-02 | A Privilege User/Workspace User shall be able to record a Vendor Confirmation against a Journey for a Vendor already on record. | Approved |
| FR-VM-03 | The Vendor Confirmations queue shall surface Journeys with an outstanding (unconfirmed) Vendor Confirmation. | Approved |
| FR-VM-04 | An **Inactive** Vendor shall no longer be selectable for new Vendor Confirmations; existing Confirmations referencing it remain visible and unaffected. | Approved — terminology updated (was "deactivated Vendor"). |

**Functional Requirement Summary.** The Product Owner Review approved **30 Functional Requirements, all Must Have**, covering: vendor creation, maintenance, service category management, geographic coverage, Preferred Partner management, performance recording, search, operational relationships, governance, audit history. The four FRs above are the existing drafted subset, now terminology-corrected; wording for the remaining approximately 26 is not invented here (§14, OQ-018).

**Cross-Module Relationships:** Journey Planning (quotations, commercial options); Journey Workspace (confirmed bookings); Itinerary Studio (preferred-supplier recommendations); Destination Intelligence (trusted destination-specific supplier knowledge); Notifications (supplier-related alerts); Dashboard (follow-up visibility).

**Depends on:** Vendor, Journey; BR-006, BR-016 (new — §9).

### 6.8 Notifications

**Approved (Product Owner Review)** (`PO-REVIEW-08-Notifications.md`).

**Vision.** Timely awareness of operational events and business conditions requiring attention — improving responsiveness by surfacing issues proactively rather than requiring manual discovery. Supports awareness; does not replace task management.

**Business Purpose.** Provide timely operational awareness, highlight conditions requiring attention, reduce missed activities, support decision-making, improve responsiveness, and encourage Workspace Users to make the Workspace their primary operational environment.

Approved Product Owner Decisions PD-NO-001 through PD-NO-005 are carried into §7.12 and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.8.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-NOT-01 | The system shall generate a Notification when a Lead is unclaimed longer than an Administrator-configured threshold. | Approved |
| FR-NOT-02 | The system shall generate a Notification when a Follow-up becomes due. | Approved |
| FR-NOT-03 | The system shall generate a Notification when a Task/item is reassigned. | Approved |
| FR-NOT-04 | Administrators shall be able to configure which notification types are active and their recipients. | Approved |
| FR-NOT-05 | Notification delivery channel (in-Workspace only vs. also external). | **Still Open — OQ-008.** Not addressed by `PO-REVIEW-08`; explicitly confirmed as still open by the Product Owner Review itself. |

**New, Product Owner–approved notification model (supersedes the simple Unread/Read state in v1.0 §7.12):** Notifications are always system-generated (never manual — manual reminders are Tasks); classified as **Informational** (acknowledge once reviewed) or **Action Required** (remains active until the underlying business condition is resolved, not merely viewed); and are never used as a substitute for Task-based work tracking.

**Functional Requirement Summary.** The Product Owner Review approved **24 Functional Requirements, all Must Have**, covering: notification generation, classification, Action Required handling, Informational handling, search/filtering, lifecycle, audit history, governance, operational visibility. The condition-based (not view-based) resolution model was specifically approved. The four drafted FRs above cover part of this scope; wording for the remaining approximately 20 is not invented here (§14, OQ-018). OQ-008 (delivery channel) remains open regardless of Stage 4 progress on wording.

**Cross-Module Relationships:** Dashboard (outstanding-notification visibility); Journey Planning, Journey Workspace, Vendor Management, Destination Intelligence (each generates notifications for its own events); Settings (notification configuration).

**Depends on:** Notification, Lead, Follow-up, Task; BR-003, BR-017 (new — §9).

### 6.9 Settings

**Approved (Product Owner Review)** (`PO-REVIEW-09-Settings.md`). **This section is a real scope increase over v1.0 — see the note below.**

> **Correction from v1.0:** v1.0's "Basic Settings" was limited to profile editing, viewing the user list, and queue-composition configuration (3 FRs). The Product Owner Review approves a substantially larger scope: full personal profile/preference management (password, photo, appearance/Light-Dark Mode) and Workspace User activation/deactivation, neither of which v1.0 described. The module is renamed **Settings** (dropping "Basic") to reflect this.

**Vision.** The administrative and configuration capability required to operate the Workspace — authorised administrators manage organisational configuration; individual Workspace Users manage personal preferences without affecting the wider Workspace. Configurable business concepts stay configurable rather than requiring application changes.

**Business Purpose.** Administer the Workspace, manage Workspace Users, maintain configurable business concepts, manage organisational and personal preferences, provide controlled administration.

Approved Product Owner Decisions PD-ST-001 through PD-ST-005 are carried into §7.16/§7.17 and §9; full narrative in `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.9.

| ID | Functional Requirement | Status |
| --- | --- | --- |
| FR-SET-01 | Every user shall be able to view and edit their own profile and personal notification preferences. | Approved — scope now explicitly includes password, profile photograph, and appearance (Light/Dark Mode), per PD-ST-003. |
| FR-SET-02 | Administrators shall be able to view the list of internal users and their role assignment. | Approved — extended by PD-ST-002 to include user activation/deactivation, not previously described. |
| FR-SET-03 | Administrators shall be able to configure the composition of Operational Queues. | Approved |
| FR-SET-04 | "Basic" Settings excludes advanced configuration. | **Superseded** — the module is no longer scoped as "Basic"; PD-ST-001/005 (Configuration Over Code) explicitly extend configurability. OQ-010 (deferred-scope candidate) is narrowed accordingly but not fully closed — see §14. |

**Functional Requirement Summary.** The Product Owner Review approved **21 Functional Requirements, all Must Have**, covering: Workspace administration, user management, role management, permission management, personal preferences, password management, profile management, configuration management, audit history, governance. The three still-current FRs above (FR-SET-01–03) cover only a fraction of this; wording for the remainder is not invented here (§14, OQ-018).

**Cross-Module Relationships:** interacts with all eight other modules by providing shared or module-specific configuration.

**Depends on:** Workspace Configuration, Personal Preferences; BR-018, BR-019 (new — §9).

---

## 7. Business Objects

**Confirmed / Approved (Product Owner Review) mix, as marked per object.** Field, relationship and state definitions not covered by the Product Owner Review remain **Proposed (Arjun)**.

### 7.1 Lead

Unchanged from v1.0. Open Question OQ-012 (relationship to `journey_passport_leads`) remains open.

### 7.2 Traveller

Unchanged from v1.0.

### 7.3 Journey Planning Record

**Approved (Product Owner Review)**, renamed for clarity from v1.0's "Journey Planning" to **Journey Planning Record** (matching `PO-REVIEW-03`'s own terminology; no change of meaning).

- **Definition:** one Traveller planning one destination or destination region — the working record from Lead claim through to conversion into a Journey or closure as Lost.
- **Identity:** Planning ID, Traveller, Destination/Region, Owner, Created Date, Current Status.
- **Requirements captured:** travel dates, date flexibility, duration, budget, companions, special requests, and flight preferences (e.g., non-stop, preferred transit) — a specific Product Owner inclusion. "Purpose of travel" was specifically considered and **not** included as essential for Release 1.3 (PD-JP-006).
- **Planning activities:** Discovery Notes, Activities, Proposal Versions, Vendor Quotations, Follow-ups, Tasks.
- **Key rule — PD-JP-001, One Planning Record Per Destination:** a Journey Planning Record covers exactly one destination or destination region per Traveller. A second destination requires a second record.
- **Key rule — PD-JP-002, Proposal Versions:** multiple proposal versions may exist per record; exactly one is the current active proposal; prior versions remain available for historical reference.
- **Key rule — PD-JP-003, Vendor Quotations are distinct from Proposal Versions:** Vendor Quotations are commercial information *received from* vendors; Proposal Versions are traveller-facing documents *created by* Search My Vacation. **Terminology note, newly identified during this update, not previously flagged:** the existing §7.8 "Quotation" object (defined in v1.0 as "a priced proposal sent to a Traveller") appears to describe the same concept as the newly-named "Proposal Version," not "Vendor Quotation" — but neither `PO-REVIEW-03` nor any other source evidence states this explicitly. Recorded as a new Open Question (§14, OQ-020) rather than silently merged or renamed.
- **Key rule — PD-JP-004, Traveller Relationship:** Journey Planning references the Traveller; it does not create or own it — Traveller information stays in Traveller Hub's ownership.
- **Lifecycle — PD-JP-005:** Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed (Confirmed / Lost / Archived). This supersedes the illustrative six-stage breakdown in v1.0 §9.1 — see §10.1.
- **Archival — PD-JP-007:** Planning Records are never deleted as part of normal operations; closed records remain available for history and analysis. See §9 BR-007 (rewritten) for how this interacts with permanent deletion.
- **Ownership:** the Workspace's Generic Ownership Model — Claim, Assign, Reassign — independent of lifecycle status (§8).
- **Relationships:** converts into exactly one Journey once confirmed (§7.4); one Journey Planning Record per claimed Lead.

### 7.4 Journey

**Approved (Product Owner Review)**, materially corrected from v1.0.

> **Correction from v1.0:** v1.0 described a Journey as spanning "both Journey Lifecycle phases." Per PD-JW-002, a Journey Workspace record covers **Phase 2 (Delivery) only** — commercial/proposal activity is Journey Planning's exclusive concern (§7.3). Per PD-JW-001, a Journey is created **only** through successful conversion of a Journey Planning Record; Workspace Users cannot create a Journey directly. This resolves the former Open Question OQ-013 (Journey Planning and Journey are confirmed as two distinct objects, not one record crossing a phase boundary) and OQ-005 (Journey Workspace's scope), the latter in the opposite direction from v1.0's Proposed assumption.

- **Definition:** a commercially confirmed travel commitment, created only after a Journey Planning Record is successfully confirmed — the object the Journey Workspace module (§6.4) is built around.
- **Identity:** Journey ID, Traveller, Journey Planning Reference, Owner, Destination, Travel Dates, Current Status.
- **Operational information:** booking confirmations, accommodation, transportation, activities, traveller documents, communications, operational notes.
- **Child objects:** Tasks, Activities, Operational Notes, Vendor Bookings, Documents, Notifications.
- **Key rule — PD-JW-003, Minor Journey Changes:** operational refinements after confirmation (hotel changes, sightseeing adjustments, sequencing) stay within the same Journey.
- **Key rule — PD-JW-004, Material Scope Changes:** a fundamentally different destination requested post-confirmation does not modify the existing Journey; the Journey may be placed On Hold, and a new Journey Planning Record is created.
- **Completion — PD-JW-005:** a Journey concludes as Successfully Completed, Cancelled, or Archived. Post-confirmation cancellation is expected to be rare but must be supported.
- **History — PD-JW-006:** a complete, permanent operational history is preserved; post-confirmation activity is never overwritten.
- **Ownership:** the Workspace User currently responsible; may change via Reassignment (§9 BR-003).

### 7.5 Journey Passport

Unchanged from v1.0.

### 7.6 Master Itinerary

**Approved (Product Owner Review)**, replacing v1.0's "Itinerary" (§7.6) as the module's primary object.

- **Definition:** the organisation's approved knowledge for a destination or destination combination — an organisationally-owned, reusable asset, not tied to any one Journey.
- **Identity:** Itinerary ID, Title, Destination Scope, Domestic/International Classification, Travel Style, Duration, Budget Category, Approval Status.
- **Destination scope (PD-IS structural detail):** a Master Itinerary may represent a single destination or a defined combination (e.g., Amritsar; or Munnar+Kochi+Alappuzha); identity is the complete combination, not a single state or country.
- **Structure:** destinations covered, day-by-day plan, accommodation recommendations, meal plans, recommended cafés, suggested experiences, optional activities, traveller guidance.
- **Knowledge assets:** operational recommendations, traveller insights, seasonal advice, local experiences, trusted vendors, practical guidance.
- **Learning Repository (PD-IS-005):** operational learnings from completed journeys (best season, unsuitable periods, exceptional experiences, operational risks — positive and negative) are captured, reviewed, and incorporated into future revisions.
- **Key rule — PD-IS-001, Organisational Ownership:** belongs to the Workspace, not individual Workspace Users.
- **Key rule — PD-IS-002, Reuse Over Recreation:** new traveller itineraries should normally start from an existing Master Itinerary.
- **Key rule — PD-IS-004, New Destinations:** where no Master Itinerary exists yet, a new one may be created as the organisation's starting knowledge.
- **Key rule — PD-IS-006, Version History:** version history exists for both Master and Traveller Itineraries.
- **Key rule — PD-IS-007, Governance:** evolves incrementally through operational learning; fundamental structural changes require governance, not ad-hoc editing.
- **Key rule — PD-IS-008, Promotion:** a Traveller Itinerary that consistently outperforms may be promoted to become the new Master Itinerary, with explicit Administrator approval; the previous Master Itinerary remains available as historical knowledge.

### 7.6a Traveller Itinerary

**Approved (Product Owner Review)** — new object, derived from Master Itinerary.

- **Definition:** a personalised copy of a Master Itinerary, customised for one specific Journey/Journey Planning Record.
- **Key rule — PD-IS-003:** created by copying and customising an approved Master Itinerary (removing destinations, changing accommodation/sightseeing/sequence, incorporating preferences); the source Master Itinerary itself is unchanged.
- **Relationship:** many Traveller Itineraries may derive from one Master Itinerary; one Traveller Itinerary belongs to one Journey Planning Record/Journey.
- **Structural note:** the Specification's object-model notation does not otherwise express a parent/derived relationship between two objects; this pairing is the first instance of that pattern in the Workspace object model. No new notation is introduced here — recorded as Open Question OQ-021 for Archie/Sophie's eventual data-model and UX treatment.

### 7.7 Vendor

**Approved (Product Owner Review)**, lifecycle and terminology updated.

- **Definition:** an external supplier (accommodation, transport, activity, local operator, DMC, visa partner, insurance partner, cruise operator, eSIM provider, etc.) Search My Vacation contracts with. The Product Owner explicitly required support for varied vendor types (PD-VM-001) — the Workspace shall not assume every Vendor is a full-service DMC.
- **Key fields:** Vendor ID, Organisation Name, Vendor Type, Service Categories, Geographic Coverage (PD-VM-002), Contact Information, Preferred Partner designation.
- **Lifecycle:** **Prospective → Active → Inactive.** The Product Owner explicitly rejected "Preferred" as a lifecycle state. **Terminology decision (Tiger, 13 September 2026): standardise on Active/Inactive throughout this Specification; "Deactivated" is retired.**
- **Key rule — PD-VM-003, Preferred Partner:** an independent operational designation, orthogonal to lifecycle — not itself a lifecycle state. An Active Vendor may or may not be a Preferred Partner; an Inactive Vendor retains its Preferred Partner history.
- **Key rule — PD-VM-004, Supplier Performance:** preserved as organisational knowledge (reliability, responsiveness, competitiveness, traveller feedback, operational quality) for internal use only.
- **Key rule — PD-VM-005, Organisational Memory:** supplier intelligence belongs to Search My Vacation, not individual Workspace Users.
- **Relationships:** may associate with Journey Planning Records, Journeys, Master Itineraries, Destination Profiles.

### 7.8 Quotation

Unchanged from v1.0, **with a terminology note carried over from §7.3:** this object's definition ("a priced proposal sent to a Traveller, generated from an Itinerary") appears to overlap with the newly-introduced "Proposal Version" concept (PD-JP-002) rather than the newly-introduced "Vendor Quotation" concept (PD-JP-003), which is commercial information received *from* a vendor. This is not resolved here — see Open Question OQ-020 (§14).

### 7.9 Booking

Unchanged from v1.0.

### 7.10 Task

Unchanged from v1.0.

### 7.11 Follow-up

Unchanged from v1.0.

### 7.12 Notification

**Approved (Product Owner Review)**, lifecycle model materially extended from v1.0.

> **Correction from v1.0:** v1.0 described a simple Unread → Read state. The Product Owner Review approves a richer, condition-based model instead.

- **Definition:** a system-generated indication that a business condition exists — informational only, never a record of work ownership (PD-NO-001, PD-NO-002).
- **Identity:** Notification ID, Notification Type, Source Module, Creation Date, Current State.
- **Types — PD-NO-003:** **Informational** (acknowledge once reviewed — e.g., Journey confirmed, Destination Profile approved, Vendor activated) and **Action Required** (remains active until the underlying condition resolves — e.g., outstanding traveller documents, overdue vendor quotation, approaching departure with incomplete readiness, a review awaiting approval).
- **Key rule — PD-NO-004, Resolution Behaviour:** a Notification does not disappear merely because it was viewed or acknowledged — it remains active until the underlying business condition is actually resolved.
- **Relationships:** may reference Traveller, Journey Planning Record, Journey, Vendor, Destination Profile, Task, Workspace User — without owning any of them.

### 7.13 Document

Unchanged from v1.0. Open Question OQ-014 remains open.

### 7.14 Destination Profile

**Approved (Product Owner Review) — business/governance decisions only; technical implementation explicitly pending Archie.** Renamed from v1.0's "Destination Knowledge" reference concept, which was not previously a full Workspace-owned Business Object.

- **Definition:** the organisation's governed knowledge for a destination — approved via PD-DI-001–006 to be owned and progressed by the Workspace, not merely referenced read-only from an external source. **How this is technically implemented, and how it reconciles with the existing WS1 Bootstrap Generator / `geo_places` pipeline, is not decided by this Specification** — see §6.6 and Open Question OQ-019.
- **Identity:** Destination ID, Destination Name, Geographic Scope, Domestic/International Classification, Approval Status.
- **Content:** overview, destinations covered, best travel periods, seasonal guidance, traveller suitability, travel considerations, operational recommendations.
- **Lifecycle — PD-DI-004:** Draft → Under Review → Approved. "Archived" was deliberately excluded — Destination Profiles are meant to keep evolving, not be retired.
- **Key rule — PD-DI-002, Governance Before Publication:** operational learnings do not automatically become organisational knowledge; changes require review and approval.
- **Key rule — PD-DI-003:** a Destination Profile may be created before Search My Vacation has sold the destination, to allow research and governance ahead of commercial launch.
- **Key rule — PD-DI-005, Supporting Media:** intentionally deferred from Release 1.3 — destination images/media are not mandatory content this release.
- **Relationships:** Master Itineraries, Journey Planning Records, Journeys, Preferred Vendors, traveller feedback, operational learnings.

### 7.15 Workspace Configuration

**Approved (Product Owner Review)** — new object.

- **Definition:** the organisational settings and configurable concepts governing Workspace operation (PD-ST-001, PD-ST-005).
- **Contents:** organisation settings, business configuration, configurable reference data, operational preferences, system defaults, Workspace User management, role assignment, permission management, user activation/deactivation.
- **Key rule — PD-ST-002:** managed only by authorised administrators, under access control.
- **Key rule — PD-ST-004, Separation:** kept fully independent of Personal Preferences (§7.16).

### 7.16 Personal Preferences

**Approved (Product Owner Review)** — new object.

- **Definition:** an individual Workspace User's own settings — profile information, password, profile photograph, appearance (Light/Dark Mode), personal Workspace preferences (PD-ST-003).
- **Key rule — PD-ST-004, Separation:** updates here have no effect on organisational Workspace Configuration (§7.15).
- **Ownership:** the individual Workspace User.

---

## 8. Cross-Module Governance Principles

**New section — Approved (Product Owner Review).** These principles are not attached to any single module; they describe patterns the Product Owner Review confirmed operate consistently across the Workspace, per `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §6–§8.

### 8.1 Generic Ownership Model

Every claimable Workspace record (Lead, Journey Planning Record, Task) uses the same **Claim / Assign / Reassign** mechanism, reaffirmed explicitly by Journey Planning (§6.3). **Open Question (§14, OQ-022):** whether Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence records also follow this exact mechanism, or a module-specific variant, was not explicitly confirmed by those modules' review documents and should be checked rather than assumed before Archie finalises the data model.

### 8.2 Lifecycle Independent of Ownership and Designation

A record's lifecycle state (e.g., a Vendor's Prospective/Active/Inactive) is a separate concern from who owns it and from any operational designation attached to it (e.g., Preferred Partner). This is reaffirmed by every module that carries both a lifecycle and a designation.

### 8.3 Operational Designations Independent of Lifecycle

Traveller Hub's Operational Flags (including "Potential Duplicate") and Vendor Management's Preferred Partner designation (PD-VM-003) are two applications of the same underlying principle: an operational designation may be attached to a record regardless of that record's lifecycle state, and removing the designation does not change the lifecycle state or vice versa.

### 8.4 Knowledge Architecture

Traveller Hub, Destination Intelligence, Vendor Management and Itinerary Studio together form the Workspace's organisational knowledge model:

- **Traveller Hub** — who the traveller is (relationship history, preferences, timeline).
- **Destination Intelligence** — where the business operates (Destination Profiles, governed Draft → Under Review → Approved).
- **Vendor Management** — who the business operates through (supplier intelligence, performance history, Preferred Partner designation).
- **Itinerary Studio** — what the business has planned before and learned from (Master Itineraries, the Learning Repository, promotion of successful traveller itineraries).

All four share the same governance shape: organisationally owned (not individually owned), evolving through a **recommend → review → approve** pipeline, with history preserved rather than overwritten.

### 8.5 Operational Architecture

Dashboard, Journey Planning, Journey Workspace and Notifications form the Workspace's day-to-day operational loop:

- **Journey Planning** owns commercial, pre-confirmation work (Phase 1).
- **Journey Workspace** owns confirmed, operational work (Phase 2) — cleanly split from Journey Planning per PD-JW-001/002.
- **Notifications** surfaces conditions from both (and from Vendor Management and Destination Intelligence) that need attention.
- **Dashboard** is the shared entry point summarising all of the above, plus Vendor Confirmations and Tasks.

### 8.6 Configuration Over Code

Business concepts expected to evolve should be managed through configuration wherever practical (PD-ST-001), reducing future development effort and improving adaptability.

### 8.7 Historical Preservation, Workspace-wide

Confirmed independently by Journey Planning (PD-JP-007), Journey Workspace (PD-JW-006), Itinerary Studio (PD-IS-006), Vendor Management (PD-VM-004), and Destination Intelligence (PD-DI-006): operational and knowledge history is preserved, not overwritten, across every module — not only within Traveller Hub as v1.0 had described.

---

## 9. Business Rules

Business Rules BR-001 through BR-009 carry their v1.0 numbering (shown here as `BR-0XX` to match the RTM's identifier scheme; the Product Specification's own working IDs `BR-01`–`BR-09` remain valid legacy references).

### BR-001 — Mobile number matching

Unchanged from v1.0.

### BR-002 — Claim ownership

Unchanged from v1.0, **reaffirmed and generalised as the Generic Ownership Model (§8.1)** by the Product Owner Review.

### BR-003 — Reassignment

Unchanged from v1.0.

### BR-004 — Action-driven workflow

Unchanged from v1.0.

### BR-005 — System-controlled statuses

Unchanged from v1.0.

### BR-006 — Archive before delete

**Updated.** No Workspace User may permanently delete a record of the types listed in BR-007 below. "Deleting" such a record moves it to an Archived state — hidden from active queues and dashboards, but retained and reversible.

### BR-007 — Admin permanent delete

**Rewritten per Tiger's explicit Stage 3 decision (13 September 2026), replacing the v1.0 rule.**

> **v1.0 text (superseded):** "Only an Administrator may perform a true, irreversible permanent delete, and only on a record already in the Archived state — never directly from an active state."

**v2.0 text (Approved):** Journey Planning Records, Journeys, Traveller History, Proposal History, Vendor History, and Destination Profiles shall support archival but **not** permanent deletion, by any role, at any time — this preserves operational business history workspace-wide and directly implements PD-JP-007's "never deleted" principle, extended consistently to the equivalent record types in the other modules rather than left as a Journey Planning–only exception. Any remaining permanent-deletion capability is restricted to administrative or configuration data (for example, a mistakenly created Workspace Configuration entry, or a stale queue-configuration record) where appropriate, and does not apply to any operational or knowledge business object listed above.

**This rewrite resolves the conflict previously flagged between PD-JP-007 and the original BR-007** (Delivery Governance Consistency Review §8; Impact Assessment §3.3), in favour of PD-JP-007's principle, generalised workspace-wide as Tiger and the Product Owner directed.

### BR-008 — Hybrid task creation

Unchanged from v1.0.

### BR-009 — Structured follow-ups

Unchanged from v1.0.

### New Business Rules from the Release 1.3 Product Owner Review

The following rules are newly formalised from the Product Owner Review's module-level decisions, to give Rad and Keerthi a testable, cross-referenced rule set rather than leaving these decisions only as narrative. Each is a direct restatement of the cited Product Decision(s), not a new invention.

| RTM-style ID | Business Rule | Source |
| --- | --- | --- |
| BR-010 | One Journey Planning Record per destination or destination region per Traveller. | PD-JP-001 |
| BR-011 | Proposal Versions (traveller-facing, created by Search My Vacation) and Vendor Quotations (commercial information received from vendors) are distinct and never merged into one record type. | PD-JP-003 |
| BR-012 | A Journey may be created only by converting a confirmed Journey Planning Record; Workspace Users cannot create a Journey directly. | PD-JW-001 |
| BR-013 | Commercial/proposal activity stays in Journey Planning; a Journey (Journey Workspace) begins only after commercial confirmation. Minor post-confirmation changes stay in the same Journey; material scope changes require a new Journey Planning Record instead of modifying the existing Journey. | PD-JW-002, PD-JW-003, PD-JW-004 |
| BR-014 | A Master Itinerary is organisational knowledge, not tied to any Journey; a Traveller Itinerary is a personalised copy created from it. Personalising a Traveller Itinerary never changes its source Master Itinerary. | PD-IS-001, PD-IS-003 |
| BR-015 | Operational learnings and destination/itinerary knowledge updates require review and approval before becoming part of the organisation's approved knowledge; a Workspace User may recommend a change, but adoption requires an approved reviewer or Administrator. | PD-IS-007, PD-DI-002 |
| BR-016 | An operational designation (e.g., Preferred Partner) is independent of lifecycle state; changing one never changes the other. | PD-VM-003, §8.3 |
| BR-017 | A Notification remains active until the underlying business condition is resolved; viewing or acknowledging a Notification alone does not resolve it. | PD-NO-004 |
| BR-018 | Business concepts expected to evolve are managed through Workspace Configuration rather than requiring application code changes, wherever practical. | PD-ST-001, PD-ST-005 |
| BR-019 | Organisation-wide Workspace Configuration and an individual Workspace User's Personal Preferences are kept as fully independent responsibilities; changing one has no effect on the other. | PD-ST-004 |

---

## 10. Journey Lifecycle

### 10.1 Phase 1 — Journey Planning

**Approved (Product Owner Review), PD-JP-005 — supersedes the v1.0 illustrative breakdown.**

| Stage | Business intent |
| --- | --- |
| 1. Lead Created | A new expression of interest exists. |
| 2. Discovery | The team is understanding traveller requirements. |
| 3. Planning | Requirements are being translated into a proposal. |
| 4. Proposal Shared | A Proposal Version has been sent to the Traveller. |
| 5. Revision | The proposal is being iterated based on traveller feedback. |
| 6. Decision | The Traveller is deciding whether to proceed. |
| 7. Closed (Confirmed / Lost / Archived) | The Journey Planning Record reaches a final outcome: Confirmed (converts to a Journey, §7.4), Lost, or Archived. |

This is the Product Owner–approved stage list; it replaces the v1.0 illustrative six-stage breakdown (Lead Captured → Claimed → Requirements Understood → Itinerary Drafted → Quotation Sent → Confirmed/Lost), which is no longer current. Former Open Question OQ-004 (confirm the Journey Lifecycle stage breakdown) is **resolved for Phase 1** by PD-JP-005.

### 10.2 Phase 2 — Journey Workspace (Delivery)

**Partially Approved (Product Owner Review).** PD-JW-005 confirms three Journey completion outcomes — **Successfully Completed, Cancelled, Archived** — but the Product Owner Review evidence does not provide the same level of granular, named-stage detail for Phase 2 that PD-JP-005 provides for Phase 1. The v1.0 illustrative six-stage Phase 2 breakdown (Booking Confirmed → Vendor Confirmation in Progress → Pre-Departure Ready → In-Journey → Post-Journey Follow-up → Closed) is **not confirmed or contradicted** by the Product Owner Review — it remains **Proposed (Arjun)**, pending confirmation. Former Open Question OQ-004 therefore remains **partially open**: closed for Phase 1, still open for Phase 2's granular stage detail. Open Question OQ-017 (precise travel-date tracking) also remains open, unaddressed by this review.

---

## 11. Non-Functional Requirements

Unchanged from v1.0. The Product Owner Review did not address non-functional requirements.

---

## 12. User Stories

Unchanged from v1.0. Extending the nine epics to reflect the seven newly-approved modules' full scope is out of scope for this Stage 4 consolidation — it depends on the same FR-drafting activity flagged throughout this document (§14, OQ-018) and should be sequenced alongside it, not invented ahead of it.

---

## 13. Assumptions

Revised from v1.0:

1. The Workspace has no traveller-facing surface; it is entirely internal — Confirmed, unchanged.
2. Only two roles (Administrator, Privilege User) are in scope for Release 1.3 MVP — **still an assumption**; the Product Owner Review's module documents use "Workspace User" generically and do not revisit the two-role model (OQ-001 remains open).
3. ~~"Destination Intelligence" in the Workspace is a read-oriented reference into the existing, separately-governed Destination Knowledge Base~~ — **retired.** The Product Owner Review approves a Workspace-governed authoring model instead (§6.6, §7.14); the open item now is the technical reconciliation with WS1, not the product intent.
4. The existing `journey_passport_leads` production table is functionally the same concept as this specification's "Lead" business object — unchanged, still an assumption (OQ-012).
5. No numeric performance, uptime or scale target was supplied — unchanged.
6. The Journey Lifecycle Phase 2 stage breakdown in §10.2 is illustrative only, not Product Owner–approved — carried forward from v1.0, now explicitly distinguished from the Approved Phase 1 breakdown (§10.1).
7. **New:** the existing "Quotation" business object (§7.8) is assumed, but not confirmed, to be the same concept as the newly-approved "Proposal Version" (PD-JP-002) rather than "Vendor Quotation" (PD-JP-003) — see OQ-020.
8. **New:** the Generic Ownership Model (Claim/Assign/Reassign) is assumed, but not confirmed, to apply uniformly to Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence records — see OQ-022.

---

## 14. Open Questions

Updated from v1.0's seventeen. Closed items are marked; new items added by this Stage 4 update are numbered OQ-018 onward, continuing the existing sequence.

| ID | Open Question | Status | Owner |
| --- | --- | --- | --- |
| OQ-001 (was OQ-01) | Confirm or amend the proposed Administrator / Privilege User capability lists (§4.1, §4.2). | **Still Open** — not addressed by the Product Owner Review. | Product Owner |
| OQ-002 (was OQ-02) | Confirm the Dashboard must summarise every Operational Queue, or a subset. | **Resolved (Approved)** — §6.1, FR-DASH-05, now unblocked. | — |
| OQ-003 (was OQ-03) | Confirm the Traveller Hub's proposed functional requirements. | **Resolved (Approved)** — §6.2. | — |
| OQ-004 (was OQ-04) | Confirm or amend the proposed Journey Lifecycle stage breakdown. | **Partially Resolved** — Phase 1 Approved (§10.1, PD-JP-005); Phase 2 granular detail still open (§10.2). | Product Owner (Phase 2 only) |
| OQ-005 (was OQ-05) | Confirm "Journey Workspace" is the Phase 1+2 working record. | **Resolved — in the opposite direction from the original assumption.** Journey Workspace is Phase 2 only (§6.4, §7.4, PD-JW-002). | — |
| OQ-006 (was OQ-06) | Confirm whether an Itinerary may have multiple Quotation versions, or exactly one. | **Still Open** — the Master/Traveller Itinerary split (§7.6/§7.6a) changes the shape of this question; not directly addressed by the evidence. | Product Owner / Archie |
| OQ-007 (was OQ-07) | Confirm Destination Intelligence is read-only against an external source. | **Resolved — in the opposite direction from the original assumption**, but with the technical implementation explicitly deferred to Archie (§6.6, §7.14). | Archie |
| OQ-008 (was OQ-08) | Confirm Notification delivery channels. | **Still Open** — explicitly confirmed as unaddressed by `PO-REVIEW-08` itself. | Product Owner / Archie |
| OQ-009 (was OQ-09) | Confirm whether `GLOSSARY.md` GL-015 should cross-reference the SMV Workspace. | Still Open. | Tiger |
| OQ-010 (was OQ-10) | Confirm what, if anything, is explicitly deferred out of the nine confirmed MVP modules. | **Narrowed but not closed** — Settings' scope increase (§6.9) reduces what might have been deferred there, but no module has an explicit deferred-item list. | Product Owner |
| OQ-011 (was OQ-11) | Confirm or amend the Business Object definitions. | **Substantially Resolved** for the objects the Product Owner Review addressed (§7.3–§7.4, §7.6–§7.7, §7.12, §7.14–§7.16); still open for objects the review did not touch (Lead, Traveller, Journey Passport, Quotation, Booking, Task, Follow-up, Document). | Product Owner / Archie |
| OQ-012 (was OQ-12) | Confirm the architectural relationship between "Lead" and `journey_passport_leads`. | Still Open. | Archie |
| OQ-013 (was OQ-13) | Confirm whether Journey Planning and Journey are one data object or two. | **Resolved (Approved)** — two distinct objects, one-way conversion (§7.3, §7.4, PD-JW-001). | — |
| OQ-014 (was OQ-14) | Confirm whether "Document" requires file upload/storage at MVP. | Still Open. | Product Owner / Archie |
| OQ-015 (was OQ-15) | Confirm or amend the nine proposed Business Rule definitions. | **Resolved for BR-001–BR-009 and the ten new rules** (§9) to the extent the Product Owner Review addressed them; BR-007 specifically re-confirmed via Tiger's Stage 3 decision. | — |
| OQ-016 (was OQ-16) | Confirm whether Reassignment should be a named rule or a separately tracked one. | Still Open — not addressed by the Product Owner Review. | Product Owner |
| OQ-017 (was OQ-17) | Confirm whether precise travel-date tracking is required for the "In-Journey" stage. | Still Open. | Product Owner / Archie |
| **OQ-018 (new)** | Who drafts the approximately 195 net-new individual Functional Requirements implied by the approved per-module counts and topic groups (§6.3–§6.9), and under what review process? Tiger's Stage 3 decision confirms this is a separate Business Analysis activity following this Specification update, but does not yet name an owner, timeline, or review process. | Open. | Tiger |
| **OQ-019 (new)** | Reconcile the Destination Profile Workspace-authoring governance model (§6.6, §7.14, PD-DI-001–006) with the existing WS1 Bootstrap Generator / `geo_places` architecture. | Open. | Archie |
| **OQ-020 (new)** | Confirm whether the existing "Quotation" object (§7.8) is the same concept as the newly-approved "Proposal Version" (PD-JP-002), distinct from "Vendor Quotation" (PD-JP-003) — identified during this update, not previously flagged. | Open. | Product Owner / Archie |
| **OQ-021 (new)** | Confirm the data-model and UX notation for a parent/derived object relationship (Master Itinerary → Traveller Itinerary, §7.6/§7.6a) — the first instance of this pattern in the Workspace object model. | Open. | Archie / Sophie |
| **OQ-022 (new)** | Confirm whether the Generic Ownership Model (Claim/Assign/Reassign, §8.1) applies uniformly to Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence records, or whether any module uses a variant. | Open. | Product Owner / Archie |

---

## 15. Requirements Traceability

| Product Specification Section | Traces to | Status |
| --- | --- | --- |
| §2 Product Vision | Product Discovery §4 | Confirmed, unchanged |
| §6.1–§6.2 Dashboard, Traveller Hub | Product Owner Review (Baseline Handover §5.1–§5.2) | Approved |
| §6.3–§6.9 Journey Planning through Settings | Product Owner Review (`PO-REVIEW-03` through `PO-REVIEW-09`) | Approved (business/governance decisions); detailed FR wording pending (OQ-018) |
| §7 Business Objects | Product Discovery §9 (unchanged objects) + Product Owner Review (new/updated objects, §7.3–§7.4, §7.6–§7.7, §7.12, §7.14–§7.16) | Mixed — see per-object status |
| §8 Cross-Module Governance Principles | Product Owner Review (Baseline Handover §6–§8) | Approved, new section |
| §9 Business Rules | Product Discovery §10 (BR-001–009) + Product Owner Review (BR-010–019) | Approved (names and, for BR-007, full behaviour); BR-001–006, 008, 009 behaviour still Proposed pending explicit confirmation beyond what §9 states |
| §10 Journey Lifecycle | Product Discovery §8 + Product Owner Review PD-JP-005/PD-JW-005 | Phase 1 Approved; Phase 2 Proposed |
| §14 Open Questions | Carried and updated from v1.0 §13 | 6 of 17 original items resolved or substantially resolved; 5 new items added |

**Updated gap-closure summary** (v1.0's five discovery gaps):

| Gap | v1.0 status | v2.0 status |
| --- | --- | --- |
| 1. User Model capabilities | Proposed, OQ-01 open | **Still open** — Product Owner Review did not address personas (OQ-001) |
| 2. Journey Lifecycle stage detail | Proposed, OQ-04/OQ-17 open | **Phase 1 closed** (PD-JP-005); Phase 2 and OQ-017 still open |
| 3. Business Object definitions | Proposed, multiple OQs open | **Substantially advanced** — 7 of 13 original objects plus 3 new objects now Approved or materially updated |
| 4. Business Rule definitions | Proposed, OQ-15/OQ-16 open | **BR-007 fully resolved; 10 new rules added**; OQ-016 still open |
| 5. MVP deferred capabilities | Not closed, OQ-10 | **Still not closed** — narrowed by Settings' scope increase, not resolved |

---

## 16. Acceptance Criteria Mapping (this Stage 4 update)

- [x] Every Stage 3 escalation Tiger decided on is reflected: Destination Intelligence routed to Archie without a Specification architecture decision (§6.6); Vendor terminology standardised to Active/Inactive (§6.7, §7.7); BR-007 rewritten to preserve business history workspace-wide (§9); no detailed FR wording invented (§6.3–§6.9, §14 OQ-018).
- [x] All nine modules now carry Approved (or, for two items, explicitly-flagged partially-Approved) Vision, Business Purpose, and primary Business Object content.
- [x] No Product Owner decision was reworded beyond organisational framing; every Approved statement traces to a named `PO-REVIEW-0X` document or the Baseline Handover.
- [x] New terminology and structural gaps discovered while drafting this update (Quotation/Proposal Version overlap, OQ-020; Master/Traveller Itinerary notation, OQ-021; Ownership Model uniformity, OQ-022) are disclosed as new Open Questions, not silently resolved.
- [x] Ready for Sophie, Archie, Rad, Keerthi — each persona's outstanding dependencies are named explicitly in §14 rather than assumed closed.

---

## 17. What Changed in v2.0 — Consolidated Change Log

Prepared per Tiger's Stage 4 instruction to "produce a consolidated change log."

**Modules:** seven modules added in full (Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence, Notifications, Settings); Dashboard and Traveller Hub promoted from Proposed to Approved with no content change; Settings renamed from "Basic Settings" to "Settings" reflecting a real scope increase.

**Business Objects:** "Itinerary" (§7.6 in v1.0) replaced by **Master Itinerary** plus new derived object **Traveller Itinerary** (§7.6a); "Destination Knowledge" renamed to **Destination Profile** with a materially different (Workspace-governed) lifecycle, technical implementation explicitly deferred to Archie; **Vendor** lifecycle extended to Prospective/Active/Inactive, "Deactivated" retired in favour of "Inactive"; **Notification** lifecycle extended from simple Unread/Read to a condition-based Informational/Action Required model; two new objects added, **Workspace Configuration** and **Personal Preferences**; **Journey** corrected from a Phase 1+2 object to Phase 2 only; **Journey Planning Record** confirmed as a distinct object from Journey, converting one-way.

**Business Rules:** BR-007 rewritten (permanent deletion restricted to administrative/configuration data; Journey Planning Records, Journeys, Traveller History, Proposal History, Vendor History and Destination Profiles support archival only); BR-006 updated to match; ten new Business Rules added (BR-010–BR-019), each traced to a specific Product Decision.

**Journey Lifecycle:** Phase 1 stage breakdown replaced with the Product Owner–approved PD-JP-005 sequence; Phase 2 stage breakdown left as Proposed (Arjun), explicitly distinguished from the now-Approved Phase 1.

**New section:** §8, Cross-Module Governance Principles, added — did not exist in v1.0.

**Open Questions:** OQ-002, OQ-003, OQ-005, OQ-007, OQ-013 resolved (OQ-005 and OQ-007 resolved in the opposite direction from their original Proposed assumptions); OQ-004 and OQ-011 partially resolved; five new Open Questions added (OQ-018–OQ-022).

**What this update deliberately does not do:** it does not invent wording for the approximately 195 net-new Functional Requirements the Product Owner Review approved by count and topic group only (§14, OQ-018); it does not decide the Destination Intelligence/WS1 architecture question (§14, OQ-019); it does not resolve the newly-identified Quotation/Proposal Version terminology overlap (§14, OQ-020); and it does not touch the Administrator/Privilege User capability lists (§4, OQ-001), since none of these were within the Product Owner Review's evidence or Tiger's Stage 3 decision.

**Recommended version promotion:** given the scope of this update (seven modules added, one business rule substantively rewritten, five business objects added/materially changed, a new cross-cutting section added), this document recommends promotion to **v2.0** rather than an incremental v1.1, for both this Specification and its companion RTM. This is a recommendation for Tiger/the Product Owner to confirm, not a unilateral decision.

---

## 18. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v1.0 | 10-Sep-2026 | Arjun | `EBC-R1.3-WS3-002` | Initial Product Specification, built from the approved Product Discovery capture. |
| v2.0 | 13-Sep-2026 | Arjun | `EBC-R1.3-WS3-004`, Stage 4 | Consolidated Baseline Update incorporating the complete Release 1.3 Product Owner Review (all nine modules) and Tiger's Stage 3 decisions on Vendor terminology, Business Rule BR-007, Destination Intelligence architecture routing, and the Functional-Requirement-drafting deferral. Seven modules added in full; two promoted from Proposed to Approved; five Business Objects added or materially corrected; ten new Business Rules added; one Business Rule (BR-007) rewritten; a new Cross-Module Governance Principles section added; six Open Questions resolved or partially resolved; five new Open Questions raised. No detailed Functional Requirement wording invented for the ~195 items approved by count/topic-group only — tracked as a separate, not-yet-scoped Business Analysis activity (OQ-018). |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004` Stage 4. It consolidates the Release 1.3 Product Owner Review into the Product Specification. Content still labelled Proposed or Open Question has not been touched by the Product Owner Review and requires the same confirmation it required in v1.0.*
