# Workspace User Journeys

| Document Information | |
|---|---|
| Document Name | Workspace User Journeys |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 |
| Last Updated | 14 September 2026 |
| Predecessor | Workspace Navigation Model v1.0 |

---

## 1. Purpose

This document maps the seven principal Workspace activities this EBC requires as end-to-end user journeys: Managing a new Inquiry, Qualifying an Inquiry, Creating Proposals, Traveller Acceptance, Journey Creation, Managing an Active Journey, and Completing a Journey. Each journey traces to its approved lifecycle stage, business rule and Functional Requirement.

Each journey is described as a sequence of user goals and system responses — not as wireframes (Screen Inventory) or as detailed step interactions (Interaction Flows).

## 2. Journey 1 — Managing a New Inquiry

**Trigger:** An external interaction through any approved channel (Journey Passport submission, website enquiry, WhatsApp, telephone, email, walk-in, returning traveller, manual entry or vendor referral) creates a new Inquiry.

**Lifecycle stage:** Inquiry Created (PD-JP-005, stage 1).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | See that a new Inquiry exists | Inquiry appears in the Journey Planning queue awaiting ownership. Where appropriate, the Dashboard also surfaces the newly created Inquiry as actionable work.
| 2 | Understand where it came from | Lead record shows its originating source; for Journey Passport submissions, the originating Passport context is shown (FR-WS-009, Traveller Hub) |
| 3 | Take ownership | Claim the item (BR-002, Generic Ownership Model); item shows the Workspace User as Owner and leaves the unclaimed pool (FR-WS-014) |
| 4 | Confirm this is (or is not) a duplicate/returning Traveller | Traveller Hub surfaces a repeat-traveller or potential-duplicate flag where mobile-number matching applies (BR-001, FR-WS-008) |
| 5 | Begin work | A Journey Planning Record is established for this Traveller and this destination/region (PD-JP-001) |

**Exit:** Lifecycle advances to Discovery (stage 2). **Not accepted path:** none at this stage — every Lead becomes a Journey Planning Record once claimed; rejection/loss is a later-stage outcome (Journey 7 does not apply here; see Journey 2 for early disqualification).

## 3. Journey 2 — Qualifying an Inquiry

**Trigger:** A claimed Journey Planning Record enters Discovery.

**Lifecycle stage:** Discovery → Planning (PD-JP-005, stages 2–3).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Understand traveller requirements | Requirements captured: destination, travel dates, flexibility, duration, budget, companions, special requests, flight preferences (PD-JP-006) |
| 2 | Record discovery conversation detail | Discovery Notes captured against the Journey Planning Record |
| 3 | Determine whether this Inquiry can proceed | Workspace User advances the record to Planning (deliberate stage action, FR-WS-016), or closes it early as Lost/On Hold if the Traveller disengages or requirements cannot be met (BR-005, Inquiry Outcomes) |
| 4 | Bring in supporting knowledge | Reference an existing Master Itinerary (PD-IS-002, Reuse Over Recreation) or an approved Destination Profile where one exists |

**Exit:** Either advances to Planning (Journey 3 begins), or closes as Lost/On Hold/Cancelled without ever reaching a Journey (BR-007 — closed records are archived, never deleted).

## 4. Journey 3 — Creating Proposals

**Trigger:** A qualified Journey Planning Record in the Planning stage.

**Lifecycle stage:** Planning → Proposal Shared (PD-JP-005, stages 3–4).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Build a personalised itinerary | Create or select a Traveller Itinerary by copying and customising an approved Master Itinerary (PD-IS-003); the source Master Itinerary is unaffected |
| 2 | Bring in commercial input | Request/record Vendor Quotations (commercial information *from* vendors) — kept distinct from the Proposal Version itself (PD-JP-003) |
| 3 | Prepare the traveller-facing proposal | Create a Proposal Version (traveller-facing, created by Search My Vacation, PD-JP-002) |
| 4 | Share it | Sending a Proposal Version is a deliberate, logged action (BR-004 principle, carried from the legacy "sending a Quotation" FR pending rewrite per RTM FR-WS-023) |
| 5 | Track iterations | Multiple Proposal Versions may exist; exactly one is current/active; prior versions remain available for historical reference (PD-JP-002) |

**Exit:** Advances to Revision (if the traveller requests changes) or directly to Decision.

## 5. Journey 4 — Traveller Acceptance (Decision)

**Trigger:** A shared Proposal Version awaiting the traveller's decision.

**Lifecycle stage:** Decision → Closed (PD-JP-005, stages 6–7).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Record the traveller's response | Workspace User records Accepted or Not Accepted against the current Proposal Version |
| 2 | If Not Accepted | Record the outcome (Lost, On Hold, Cancelled, or Future Follow-up — BR-005); the Journey Planning Record closes without creating a Journey; nothing is deleted (BR-007) |
| 3 | If Accepted | The business event of traveller acceptance — not itinerary creation, not quotation sending — is what creates a Journey (BR-004/PD-JP-005's own text: "Traveller acceptance is the business event that creates a Journey") |

**Exit:** Either the Inquiry closes without a Journey (loop ends, Traveller Hub retains the history for future follow-up), or the record converts — see Journey 5.

## 6. Journey 5 — Journey Creation

**Trigger:** Traveller acceptance of a Proposal Version.

**Lifecycle transition:** Journey Planning Record (Closed — Confirmed) → new Journey (BR-012/PD-JW-001).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Confirm the conversion | The accepted Journey Planning Record converts one-way into a Journey; Workspace Users cannot create a Journey directly by any other route (PD-JW-001) |
| 2 | Carry forward what matters | The accepted Proposal Version's Traveller Itinerary becomes the Journey's operational itinerary; the Traveller reference, destination and travel dates carry forward; the full planning history (prior proposal versions, vendor quotations, discovery notes) remains attached to the originating Journey Planning Record for traceability (BR-003/PD-JP-003) |
| 3 | Land in the right place | The new Journey appears in Journey Workspace's Active Journeys queue (FR-WS-019), unclaimed by default unless ownership is carried forward automatically — this hand-off behaviour is specified in the Interaction Flows document ("Journey Creation") |
| 4 | See the planning record's new status | The originating Journey Planning Record shows Closed (Confirmed) and a visible link to the Journey it produced |

**Business Principle**

The Journey represents the beginning of operational delivery rather than the end of planning.

Planning history remains permanently associated with the originating Inquiry and Journey Planning Record for complete business traceability.

**Exit:** A Journey now exists in Phase 2 (Delivery); Journey Planning's role in this traveller relationship ends unless a second, separate destination is later planned (PD-JP-001 — a new destination requires a new Journey Planning Record).

## 7. Journey 6 — Managing an Active Journey

**Trigger:** A confirmed Journey in Journey Workspace.

**Lifecycle stage:** Operational (Phase 2 — Delivery; granular stages provisional per Discovery A-UX-03).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Take or confirm ownership | Same Claim/Assign/Reassign model as Journey Planning (FR-WS-019) |
| 2 | Coordinate bookings | Record Vendor Confirmations against the Journey for an on-record Vendor (FR-WS-029); the Vendor Confirmations queue surfaces Journeys with an outstanding confirmation (FR-WS-030) |
| 3 | Track operational readiness | Monitor booking confirmations, documentation completion, traveller readiness, supplier readiness ahead of departure |
| 4 | Support the traveller | Record traveller servicing activity, operational notes, communications |
| 5 | Handle minor changes | Hotel changes, sightseeing adjustments, sequencing — stay within the same Journey (PD-JW-003) |
| 6 | Handle a fundamentally different destination request | Do not modify the existing Journey; place it On Hold where appropriate and start a new Journey Planning Record instead (PD-JW-004) |
| 7 | Stay aware without hunting for problems | Operational alerts (Notifications) surface outstanding traveller documents, overdue vendor quotations, or an approaching departure with incomplete readiness (PD-NO-003) |

**Workspace Experience**

Throughout operational delivery, the Workspace should proactively surface information requiring attention while allowing Workspace Users to remain focused on the current Journey.

Operational awareness should minimise unnecessary navigation and reinforce the feeling of calm confidence described in the UX Design Brief.

**Exit:** Journey concludes (Journey 7) or is placed On Hold pending a new planning cycle for a different destination.

## 8. Journey 7 — Completing a Journey

**Trigger:** A Journey reaches one of its three approved completion outcomes.

**Lifecycle stage:** Successfully Completed / Cancelled / Archived (PD-JW-005).

| Step | Workspace User goal | System response |
|---|---|---|
| 1 | Close out the Journey | Workspace User records the outcome: Successfully Completed (the expected common case), Cancelled (rare but supported post-confirmation), or Archived |
| 2 | Preserve the record | A complete, permanent operational history is preserved; nothing post-confirmation is overwritten (PD-JW-006) |
| 3 | Capture what was learned | For a Successfully Completed Journey, the Workspace User is offered the option to capture an operational learning (best season, an exceptional experience, an operational risk) into Itinerary Studio's Learning Repository (PD-IS-005) — an offered next action, not a forced step |
| 4 | Continue the relationship | Traveller Hub reflects the completed Journey in the Traveller's history, supporting the Business Lifecycle's "Future Traveller Relationship" loop (§5) — the natural place a Workspace User would return to start a new Journey Planning Record for the same Traveller |

**Exit:** The Journey leaves the Active Journeys queue but remains permanently reachable via Traveller Hub and search (BR-006/BR-007 — archival only, never permanent deletion of operational history).

## 9. Journey Design Principles

The Workspace User Journeys are governed by the following principles.

- Every Journey begins with an Inquiry.
- Traveller acceptance is the only business event that creates a Journey.
- Operational work should remain centred on the Journey once it has been created.
- Business history is preserved rather than replaced as work progresses.
- Workspace Users should remain focused on achieving business outcomes rather than navigating application structure.
- Every completed Journey strengthens the Traveller relationship and provides the starting point for future travel opportunities.

## 10. Cross-Journey Observations

- Every journey above ends either at a terminal, preserved state (Closed/Archived/Completed/Cancelled) or by advancing to the next journey in this sequence — there is no path in the approved lifecycle that deletes a record outright.
- The same ownership interaction (Claim/Assign/Reassign) recurs in Journeys 1, 2, 3 and 6, giving Workspace Users one interaction pattern to learn across the entire operational lifecycle.
- Journeys 3–5 (Creating Proposals → Traveller Acceptance → Journey Creation) are the only point in the lifecycle where a business event (traveller acceptance), not a user action, creates a new primary object — this is the single most important moment to get right in the Interaction Flows document, since it is easy to mis-design as "the user creates a Journey" rather than "the traveller's acceptance creates it."

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS4-001.*
