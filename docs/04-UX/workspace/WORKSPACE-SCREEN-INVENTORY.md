# Workspace Screen Inventory

| Document Information | |
|---|---|
| Document Name | Workspace Screen Inventory |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 |
| Last Updated | 14 September 2026 |
| Predecessor | Workspace Interaction Flows v1.0 |

---

## 1. Purpose

This document enumerates every screen required to support the approved Release 1.3 business lifecycle across all nine Workspace modules. It records each screen's purpose, primary user, major interactions and navigation relationships. No visual design, layout or wireframe is produced at this stage, per this EBC's Out of Scope instruction — this is a structural inventory only, the final input Sophie's future low-fidelity wireframing stage will consume.

Screens are grouped by module, in the same order as the Information Architecture (§3). Each screen ID is prefixed by a module code for traceability into future wireframe and engineering work: `DASH`, `JP` (Journey Planning), `JW` (Journey Workspace), `TH` (Traveller Hub), `IS` (Itinerary Studio), `DI` (Destination Intelligence), `VM` (Vendor Management), `NOT` (Notifications), `SET` (Settings).

This inventory intentionally represents logical Workspace screens rather than implementation-specific pages. During Engineering and Frontend implementation, multiple logical screens may be realised using tabs, drawers, dialogs or responsive layouts without changing the business purpose recorded within this inventory.

## 2. Dashboard

> **WS13 revision (EBC-R1.3-WS13-002, 24-Sep-2026):** The Dashboard's Quick Action "Create Journey" is removed (D-09, CM-03) and DASH-01/02 become the Journey Workspace Dashboard. See *WS13 Revision* at the end of this document.


| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| DASH-01 | Dashboard (My Work) | Default landing screen; business-first summary of what needs the current user's attention today. Acts as the Workspace User's operational home and primary decision-support surface. | Every Workspace User | Toggle to Team view; claim an unclaimed item directly from a card; open any card's underlying record | Entry point from login; links out to any Journey Planning Record, Journey, Vendor Confirmation, Task or Follow-up a card summarises |
| DASH-02 | Dashboard (Team) | Same summary, scoped to the whole team rather than one user | Every Workspace User (filter by member: Role TBC, OQ-001) | Filter by team member (Proposed, FR-DASH-06); same card interactions as My Work | Same link targets as DASH-01 |

## 3. Journey Planning

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| JP-01 | Journey Planning Queue | List/board of all Journey Planning Records, grouped by lifecycle stage (PD-JP-005) | Every Workspace User | Claim an unclaimed record; filter/search by stage, owner, destination; open a record | From: Primary Nav, Dashboard cards. To: JP-02 |
| JP-02 | Journey Planning Record — Overview | Record summary: Traveller, destination/region, stage, owner, key dates | Owner / any Workspace User (view) | Advance stage (deliberate action); reassign; open any contextual tab | To: JP-03–JP-07; Traveller Hub (TH-02); Itinerary Studio (IS-02); Vendor Management (VM-02) |
| JP-03 | Journey Planning Record — Requirements | Captured traveller requirements: dates, flexibility, duration, budget, companions, special requests, flight preferences (PD-JP-006) | Owner | Edit requirements | Back to JP-02 |
| JP-04 | Journey Planning Record — Proposal Versions | List of all Proposal Versions with current-active indicator (PD-JP-002) | Owner | Create new version; mark current; view a specific version; send to traveller (logged action) | To: JP-05; from: JP-02 |
| JP-05 | Proposal Version Detail / Editor | Author or review one Proposal Version, built from a Traveller Itinerary | Owner | Attach/personalise a Traveller Itinerary (from a Master Itinerary); attach Vendor Quotations as commercial input; send | To: Itinerary Studio (IS-03) for the underlying Traveller Itinerary; JP-06 for quotations |
| JP-06 | Journey Planning Record — Vendor Quotations | Commercial quotations received from vendors, kept distinct from Proposal Versions (PD-JP-003/BR-011) | Owner | Record a new Vendor Quotation; link a Vendor | To: Vendor Management (VM-02); back to JP-05 |
| JP-07 | Journey Planning Record — Discovery Notes / Activities | Free-form and structured discovery conversation record | Owner | Add discovery notes; log activities | Back to JP-02 |
| JP-08 | Journey Planning Record — Tasks & Follow-ups | Structured follow-ups and hybrid (system + manual) tasks against the record (BR-008/BR-009) | Owner, assignable to others | Create task/follow-up; assign; mark complete | Generates Notifications (NOT-01) |
| JP-09 | Journey Planning Record — History | Full stage-transition and audit history | Any Workspace User (view) | None (read-only) | Back to JP-02 |

## 4. Journey Workspace

> **WS13 revision (EBC-R1.3-WS13-002, 24-Sep-2026):** JW-01 has no claim step (Journeys arrive owned, D-03); JW-04 is renamed **Vendor Bookings** (D-07); JW-05 **Readiness**; JW-07 **Document Readiness** (no upload, D-10); new logical screens JW-09 to JW-17 are added. See *WS13 Revision* at the end of this document.


| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| JW-01 | Active Journeys Queue | List/board of all confirmed Journeys (Phase 2 only), same claim/ownership pattern as Journey Planning | Every Workspace User | Claim; filter/search; open a Journey | From: Primary Nav, Dashboard cards, Journey Creation flow (from JP-04/05 conversion). To: JW-02 |
| JW-02 | Journey — Overview | Journey summary: Traveller, current stage, linked itinerary, linked confirmations, owner, link back to originating Journey Planning Record. Represents the operational centre of an active Journey. | Owner / any Workspace User (view) | Reassign; open any contextual tab | To: JW-03–JW-08; Traveller Hub (TH-02); back-reference to JP-02 (closed) |
| JW-03 | Journey — Itinerary | The Journey's operational Traveller Itinerary (carried from conversion) | Owner | View; request an itinerary change (routes to Itinerary Studio) | To: Itinerary Studio (IS-03) |
| JW-04 | Journey — Vendor Confirmations | Confirmations recorded against on-record, Active Vendors (FR-WS-029) | Owner | Record a confirmation; select a Vendor; view outstanding-confirmation status | To: Vendor Management (VM-02); generates Notifications on overdue status |
| JW-05 | Journey — Operational Readiness | Tracks booking confirmations, documentation completion, traveller readiness, supplier readiness ahead of departure | Owner | Mark readiness items complete; view outstanding items | Surfaces in Dashboard and Notifications |
| JW-06 | Journey — Tasks & Follow-ups | Same pattern as JP-08, scoped to operational (Phase 2) work | Owner, assignable to others | Create; assign; complete | Generates Notifications |
| JW-07 | Journey — Documents | Supporting documentation (traveller documents, confirmations) associated with the Journey | Owner | Attach/view documents (OQ-014, file storage requirement still open) | Back to JW-02 |
| JW-08 | Journey — History | Full stage-transition and operational audit history | Any Workspace User (view) | None (read-only) | Back to JW-02 |

## 5. Traveller Hub

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| TH-01 | Traveller Search / List | Find a Traveller by name or mobile number (FR-WS-010) | Every Workspace User | Search; open a record | From: Global Search, Primary Nav |
| TH-02 | Traveller Record — Overview / Snapshot | Single consolidated record: Leads, Journeys (past/current), Follow-up history, repeat-traveller status, Operational Flags (e.g., Potential Duplicate) | Every Workspace User | View; flag/unflag (Administrator-scoped where a flag requires resolution — Role TBC) | To: any of the Traveller's Journey Planning Records (JP-02) or Journeys (JW-02); TH-03 |
| TH-03 | Traveller Timeline | Chronological view of every interaction and Journey across the relationship | Every Workspace User (view) | None beyond navigation | Back to TH-02 |

## 6. Itinerary Studio

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| IS-01 | Master Itinerary Library | Searchable list of all Master Itineraries by destination/combination, travel style, budget category, approval status | Every Workspace User | Search/filter; open; start a new Traveller Itinerary from one (PD-IS-002) | From: Primary Nav, JP-05 |
| IS-02 | Master Itinerary — Detail | Full itinerary content: day-by-day plan, accommodation, meals, experiences, knowledge assets | Every Workspace User (view); Administrator/authorised reviewer (edit governance) | View; propose a structural change (routes to governance review, PD-IS-007) | To: IS-03 (derived Traveller Itineraries); IS-04 (version history) |
| IS-03 | Traveller Itinerary — Editor | Personalise a copy of a Master Itinerary for one Journey Planning Record/Journey (PD-IS-003) | Owner of the originating record | Remove/add destinations, change accommodation/sightseeing/sequence, incorporate preferences | Back-reference "based on [Master Itinerary]" (IS-02); linked from JP-05 and JW-03 |
| IS-04 | Master/Traveller Itinerary — Version History | Version history for both object types (PD-IS-006) | Every Workspace User (view) | View a prior version | Back to IS-02/IS-03 |
| IS-05 | Learning Repository — Submit Learning | Capture an operational learning from a completed Journey (PD-IS-005) | Any Workspace User (typically the Journey's owner, offered at Journey Completion) | Submit a learning (best season, exceptional experience, operational risk) | From: Journey Completion flow (JW-02); to: IS-06 (governance review) |
| IS-06 | Learning / Itinerary Governance Review | Review and approve/reject a submitted learning or a proposed Master Itinerary change before adoption (PD-IS-007/BR-015) | Administrator / authorised reviewer (Role TBC) | Approve, reject, request revision | Updates IS-02 on approval; generates Notifications |
| IS-07 | Itinerary Promotion Review | Review a Traveller Itinerary that has consistently outperformed, for promotion to Master Itinerary status (PD-IS-008) | Administrator | Approve promotion (explicit approval required); view prior Master Itinerary retained as history | Produces a new/updated IS-02; prior version retained via IS-04 |

## 7. Destination Intelligence

**Note:** these screens describe the Workspace-facing governance surface the Product Owner Review approved (§6.6/§7.14 of the Specification). Their technical implementation and reconciliation with the existing WS1 Bootstrap Generator pipeline is Open Question OQ-019, owned by Archie — not decided by this inventory.

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| DI-01 | Destination Profile Library | Searchable list of Destination Profiles by name, geographic scope, domestic/international classification, approval status | Every Workspace User | Search/filter; open; create a new Draft (PD-DI-003, may precede commercial launch) | From: Primary Nav, JP-05, IS-02 |
| DI-02 | Destination Profile — Detail | Full destination content: overview, best travel periods, seasonal guidance, traveller suitability, operational recommendations | Every Workspace User (view) | View; recommend a change | To: DI-03 (edit, if Draft); DI-04 (review queue) |
| DI-03 | Destination Profile — Editor (Draft) | Author or revise a Destination Profile before it enters review | Administrator / authorised author (Role TBC) | Edit content; submit for review (Draft → Under Review, PD-DI-004) | To: DI-04 |
| DI-04 | Destination Profile — Review / Approval Queue | Governance queue for profiles Under Review (PD-DI-002) | Administrator / authorised reviewer | Approve (Under Review → Approved) or return for revision | Updates DI-02; generates Notifications |

## 8. Vendor Management

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| VM-01 | Vendor Directory | Searchable list of Vendors by service category, geographic coverage, lifecycle state, Preferred Partner designation | Every Workspace User | Search/filter; open; create a new Vendor | From: Primary Nav, JP-06, JW-04, IS-02 |
| VM-02 | Vendor — Detail | Vendor identity, service categories, geographic coverage, contact information, lifecycle state, Preferred Partner designation, performance history | Every Workspace User (view); Administrator (lifecycle/Preferred Partner changes) | Mark Active/Inactive (Administrator); designate/remove Preferred Partner (independent of lifecycle, BR-016); record performance | To: VM-03 |
| VM-03 | Vendor — Performance / History | Reliability, responsiveness, commercial competitiveness, traveller feedback, operational quality, retained regardless of lifecycle state (PD-VM-004) | Every Workspace User (view) | View; add a performance note | Back to VM-02 |
| VM-04 | Vendor Confirmations Queue (global) | Cross-Journey view of all outstanding Vendor Confirmations (FR-WS-030) | Every Workspace User | Open the underlying Journey (JW-04) to resolve | From: Dashboard card, Primary Nav (within Vendor Management) |

## 9. Notifications

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| NOT-01 | Notification Log | Full list of Notifications, filterable by Informational/Action Required, source module, state | Every Workspace User | Filter; open a notification's source record; (Administrator) configure types/recipients | Every notification's click target is its source record (JP-*, JW-*, VM-*, DI-*, IS-*) |
| NOT-02 | Notification Configuration | Configure which notification types are active and their recipients (FR-WS-035) | Administrator | Enable/disable types; assign recipients; set thresholds (e.g., unclaimed-Lead threshold, FR-WS-032) | From: Settings (SET-02) |

## 10. Settings

| ID | Screen | Purpose | Primary User | Major Interactions | Navigation Relationships |
|---|---|---|---|---|---|
| SET-01 | Personal Preferences | Every user's own profile, password, photo, appearance (Light/Dark Mode) — fully independent of organisational configuration (PD-ST-003/PD-ST-004) | Every Workspace User | Edit profile; change password; upload photo; toggle appearance | From: header user menu |
| SET-02 | Workspace Configuration — Users & Roles | Manage the internal user list, role assignment, activation/deactivation (PD-ST-002) | Administrator | Add/deactivate user; assign role | From: Primary Nav (Settings) |
| SET-03 | Workspace Configuration — Operational Queues | Configure the composition of Operational Queues (FR-WS-038) | Administrator | Edit queue composition/filters | Affects JP-01, JW-01, VM-04 |
| SET-04 | Workspace Configuration — Notification Settings | Organisation-wide notification configuration, distinct from an individual's personal notification preferences | Administrator | Configure org-wide defaults | Links to NOT-02 |

## 10.1 Screen Design Principles

Every screen within the Journey Workspace should support the following principles.

- Present information according to business priority rather than technical structure.
- Minimise unnecessary navigation between related activities.
- Preserve business context throughout the user's workflow.
- Encourage proactive working rather than reactive searching.
- Reinforce the Journey as the primary operational business object after traveller commitment.
- Support the Product Owner's desired Workspace experience of being organised, calm and in control.

## 11. Screen Count Summary

| Module | Screens |
|---|---|
| Dashboard | 2 |
| Journey Planning | 9 |
| Journey Workspace | 8 |
| Traveller Hub | 3 |
| Itinerary Studio | 7 |
| Destination Intelligence | 4 |
| Vendor Management | 4 |
| Notifications | 2 |
| Settings | 4 |
| **Total** | **43** |

## 12. Traceability and Open Items

- Every screen above supports at least one Approved Functional Requirement, Product Decision, or Business Rule named in the Specification v2.0 or a `PO-REVIEW-0X` document; no screen invents scope beyond what is Approved or explicitly named as an approved topic group (RTM §6).
- Screens marked **Role TBC** (Traveller Hub flag resolution, Itinerary/Destination governance review and edit, several Settings screens) have their exact Administrator/Privilege User boundary pending Open Question OQ-001 and should not be treated as finalised role assignments.
- This inventory does not include screens for the ~185 Functional Requirements still at Topic-Group-Only status (RTM §6, OQ-018); once that wording is drafted, this inventory will need a corresponding review pass to confirm no additional screen is required.
- No wireframe, layout or visual design is included, per this EBC's Out of Scope instruction; this inventory is the structural handoff to that future stage.

---

*Prepared by Sophie (UX, UI and Frontend Experience Specialist) on behalf of Team Satvi.*
*Reviewed by the Product Owner as part of the Release 1.3 UX Architecture Review.*
*This document completes the Release 1.3 UX Architecture package and provides the structural screen inventory that will guide Solution Architecture, Engineering planning and future low-fidelity wireframing.*
*Status: Approved.*

---

## WS13 Revision — EBC-R1.3-WS13-002 (24 September 2026)

*Additive revision by Sophie (UX). The original text above is kept unchanged, following the project's supersede-not-delete convention. Where this section differs, it governs for Journey Workspace. Source: `docs/09-Development/EBC-R1.3-WS13-002-SOPHIE-Journey-Workspace-UX-Design-and-Experience-Specification.md`, built on the frozen product baseline `EBC-R1.3-WS13-001` Revision 2 (D-01 to D-13).*

### A. Dashboard (DASH-01 / DASH-02)

| Change | Detail |
|---|---|
| Purpose | Operational management view (D-09): Active Journeys, Journey Planning (Active Leads), Today's Tasks, Upcoming Departures, Pending Vendor Bookings, Payments Due (Payment follow-ups, I-01), Operational Alerts, Recent Activity |
| Quick Actions | "Create Journey" removed (CM-03) and "My Work" removed (UX-01, Product Owner review 26-Sep-2026). Remaining: New Lead, Add Traveller, New Vendor (ratified order kept) |
| Interactions | "Claim an unclaimed item directly from a card" no longer applies to Journeys (none are unclaimed); still applies to Journey Planning records |

### B. Journey Workspace screens JW-01 to JW-08 (revised)

| ID | Revised name | Change |
|---|---|---|
| JW-01 | Active Journeys | Summary strip (FR-JW-34); owner filter Mine / named user; **no claim, no create**. "From: Journey Creation flow" now means Journeys appear automatically after Journey Planning conversion. |
| JW-02 | Journey — Header and Overview | Sticky header with Journey Owner, **Primary Operational Contact** and Travellers shown separately (D-12), seven-stage lifecycle stepper (D-01), primary action, alert banner |
| JW-03 | Journey — Itinerary | Read-only accepted Proposal Version snapshot. "Request an itinerary change (routes to Itinerary Studio)" is not offered in Release 1.3; operational changes go to JW-09, material changes to JW-13 |
| JW-04 | Journey — **Vendor Bookings** (was Vendor Confirmations) | Booking lifecycle Draft → Requested → Pending Information → Confirmed → Booked; Cancelled (D-07) |
| JW-05 | Journey — **Readiness** | Configuration-driven Readiness Template (D-04), four categories, derived Not Ready / At Risk / Ready |
| JW-06 | Journey — Tasks & Follow-ups | Categories Operational, Traveller follow-up, Payment (D-05, I-01) |
| JW-07 | Journey — **Documents (Document Readiness)** | Status, external reference, external link, notes. **No upload** (D-10); OQ-014 resolved for Journey Workspace |
| JW-08 | Journey — History (Journey Timeline) | Adds supersession pin, POC changes, booking transitions, archive events (FR-JW-30) |

### C. New logical screens

| ID | Screen | Realised as |
|---|---|---|
| JW-09 | Journey — Activity & Changes (communications, notes, Change Records) | Tab |
| JW-10 | Search & Filters | Control on JW-01 / JW-11 |
| JW-11 | Closed & Archived Journeys | Page |
| JW-12 | Lifecycle action dialogs | Dialogs |
| JW-13 | Material change (replacement path) | Dialog + On Hold state |
| JW-14 | Archive ~~/ Unarchive~~ (Administrator) — **Rev 4:** no Unarchive in Release 1.3 | Dialog |
| JW-15 | Primary Operational Contact editor | Side panel |
| JW-16 | Vendor Booking detail | Drawer |
| JW-17 | Assign / Reassign and Legacy adoption | Dialog / panel |

### D. Screen count

Journey Workspace: 8 → **17** logical screens. Workspace total: 43 → **52**. VM-04 "Vendor Confirmations Queue" is read as the cross-Journey view of Vendor Bookings in Requested or Pending Information (FR-JW-17); its relabel belongs to WS16.

### Revision 2 update (26-Sep-2026, Product Owner review of WS13-002)

- UX-01: Dashboard Quick Actions are New Lead, Add Traveller, New Vendor.
- UX-03: each action appears once per operational context (e.g. *View readiness* only once on JW-02).
- UX-04: the terminal state **Journey Closed** is shown to Workspace Users as **Completed** (label only; lifecycle unchanged). JW-11 outcome filter: Completed / Cancelled / Superseded.
- UX-05: JW-04 distinguishes **Confirmed** (outline pill) from **Booked** (solid pill + reference).
- UX-06: task category chips carry icons (Operational, Payment, Traveller follow-up).
- UX-07: JW-13 primary button reads **Create Replacement Journey**.

### Revision 4 update (27-Sep-2026, WS13 UX synchronisation UXA-01 to UXA-06)

*Alignment with WS13-001 Rev 3 (POD-01–08, PD-A–E, O-A2–O-A5) and WS13-004A. Detail: `EBC-R1.3-WS13-002` §36. No workflow redesign.*

- **JW-14 Archive:** irreversible in Release 1.3 (POD-08, PD-E). Reason required; acknowledgement checkbox for Journeys that are not Completed, Cancelled or Superseded. Archived Journeys are read-only, viewable and searchable.
- **JW-17 adoption panel:** adds a required Service Category with no pre-selection (PD-C, BR-036/043).
- **JW-02 header:** Service Category chip, editable by the owner or an Administrator, with a History entry (POD-07).
- **JW-07 Documents:** Document Type picker; replacement Journeys show "Carried from JRN-…, re-verify" and "Review required" (BR-046).
- **JW-09 Change Record:** Change Category picker (POD-04). **JW-04:** "Service type" and Vendor Code in the vendor picker (I-06, PD-D).
- **Journey Planning touchpoints (WS13-driven, WS12 documents unchanged):** JP-03/JP-04 optional Service Category ("Needed to confirm"); JP-13 Confirmed dialog with confirmed dates and the owner, nights, dates–nights and Service Category checks; replacement record banner and provenance labels; guidance on the carried Version 1 proposal (BR-047, non-blocking). Wireframe: `mockups/EBC-R1.3-WS13-002-WF-08-Replacement-Provenance-Service-Category-Archive.png`.
