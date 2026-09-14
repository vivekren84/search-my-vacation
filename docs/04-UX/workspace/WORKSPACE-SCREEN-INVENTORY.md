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