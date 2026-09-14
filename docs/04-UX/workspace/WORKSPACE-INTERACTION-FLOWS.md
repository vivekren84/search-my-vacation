# Workspace Interaction Flows

| Document Information | |
|---|---|
| Document Name | Workspace Interaction Flows |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 |
| Last Updated | 14 September 2026 |
| Predecessor | Workspace User Journeys v1.0 |

---

## 1. Purpose

This document specifies user behaviour — not visual presentation — for the five interaction flows this EBC names: New Inquiry, Proposal Revision, Journey Creation, Vendor Assignment, and Journey Completion. Each flow decomposes a step from the User Journeys document into the sequence of user actions and system state changes a Workspace User actually performs, at the level of detail Rad's future engineering estimation and Keerthi's future test design will need, without prescribing UI layout (Screen Inventory) or visual treatment.

Each flow uses the notation: **[User Action]** → *(System Response)* → **[User Action]** ...

## 2. Flow — New Inquiry

**Preconditions:** An external interaction has occurred through any recognised source.

**Flow:**

1. *(System)* *(System)* A new Inquiry is created automatically from the originating interaction (Journey Passport, WhatsApp, telephone, email, walk-in, returning traveller, manual entry or vendor referral). No Workspace User action is required to create the Inquiry.
2. *(System)* If the interaction includes a mobile number, mobile-number matching runs against existing Traveller records (BR-001).
   - **If a match is found:** the Lead is linked to the existing Traveller and Traveller Hub's history is available immediately.
   - **If no match is found:** a new Traveller record is created in Traveller Hub.
3. *(System)* The Lead appears in Journey Planning's unclaimed pool, visible to every Workspace User (BR-002).
4. **[Workspace User]** Reviews the unclaimed pool (from Journey Planning directly, or from a Dashboard card summarising it).
5. **[Workspace User]** Claims the Lead.
6. *(System)* The Workspace User is set as Owner; the item leaves the unclaimed pool and now appears only in that Owner's (and, on the Team view, everyone's) scope.
7. *(System)* A Journey Planning Record is established, in the Lead Created stage, referencing the Traveller (PD-JP-004 — referenced, not owned/duplicated).
8. **[Workspace User]** Begins Discovery (captures requirements — see Workspace User Journeys, Journey 2).

**Exception path — manual entry with no traveller contact detail yet:** the Workspace User may create the Journey Planning Record with partial requirements and complete Traveller identity details before or during Discovery; mobile-number matching (step 2) runs again once a mobile number is supplied.

**Postconditions:** A claimed Journey Planning Record exists, in the Discovery stage, linked to a Traveller record (new or existing).

## 3. Flow — Proposal Revision

**Preconditions:** A Proposal Version has been shared with the Traveller (Journey Planning Record in the Proposal Shared stage) and the traveller has requested changes rather than accepting or declining outright.

**Flow:**

1. **[Workspace User]** Records that the traveller has requested changes (moves the Journey Planning Record to the Revision stage — a deliberate stage action, FR-WS-016).
2. **[Workspace User]** Opens the current active Proposal Version's underlying Traveller Itinerary.
3. **[Workspace User]** Makes the requested adjustments (e.g., accommodation change, sequence change, removing/adding a destination within the same combination) — this is Traveller Itinerary personalisation (PD-IS-003); the source Master Itinerary is never altered by this action.
4. *(Conditional)* **[Workspace User]** If the revision requires new commercial input, requests or records an updated Vendor Quotation, kept distinct from the Proposal Version itself (PD-JP-003/BR-011).
5. **[Workspace User]** Creates a new Proposal Version reflecting the changes.
6. *(System)* The new Proposal Version becomes the current active proposal; the previous version(s) are retained, unmodified, for historical reference — never overwritten (PD-JP-002).
7. **[Workspace User]** Sends the new Proposal Version to the traveller — a deliberate, logged action.
8. *(System)* The Journey Planning Record returns to Proposal Shared (or advances to Decision, if this is presented as final).

**Exception path — traveller requests changes beyond the current destination/region's scope:** per PD-JP-001, a fundamentally different destination is not accommodated as a "revision" — it requires a new, separate Journey Planning Record; the Workspace User is guided to start a new record rather than force an out-of-scope revision into the existing one.

**Postconditions:** A new current Proposal Version exists; all prior versions remain available; the Journey Planning Record's full proposal history is intact.

## 4. Flow — Journey Creation

**Preconditions:** A Journey Planning Record's current Proposal Version has been accepted by the traveller.

**Flow:**

1. **[Workspace User]** Records the traveller's acceptance against the current Proposal Version (this recorded business event, not any prior action, is what triggers creation — PD-JP-005/BR-004).
2. *(System)* The Journey Planning Record's stage advances to Decision, then Closed (Confirmed).
3. *(System)* A new Journey is created (BR-012/PD-JW-001) — this is the **only** route by which a Journey comes into existence; there is no direct "create Journey" action available to a Workspace User.

**Business Principle**

The Workspace User records traveller acceptance.

The system creates the Journey.

This distinction is intentional and reflects the Product Owner's business rule that Journeys are created by a business event rather than by direct user action.

4. *(System)* The Journey is populated from the conversion: Traveller reference, the accepted Traveller Itinerary (becoming the Journey's operational itinerary), destination, and travel dates carry forward automatically.
5. *(System)* A reference from the new Journey back to its originating Journey Planning Record is preserved (Journey Planning Reference, §7.4 identity field), and a reference forward from the closed Journey Planning Record to the new Journey is shown, so either record can be reached from the other.
6. *(System)* The new Journey appears in Journey Workspace's Active Journeys queue, in an unclaimed state by default (ownership is not assumed to carry over automatically, since Journey Planning and Journey Workspace may be worked by different Workspace Users — flagged for Product Owner confirmation as part of OQ-022's Generic Ownership Model scope).
7. **[Workspace User]** Claims the new Journey (in Journey Workspace) to begin operational management (Workspace User Journeys, Journey 6).
8. *(System)* The Journey Planning Record's planning history (all prior Proposal Versions, Vendor Quotations, Discovery Notes) remains attached to it, not duplicated onto the Journey, preserving the historical-integrity governance decision (PO-REVIEW-03 §8).

**Exception path — traveller declines instead of accepting:** no Journey is created; the Journey Planning Record closes as Lost, On Hold, Cancelled, or Future Follow-up (BR-005); flow ends without step 3 onward.

**Postconditions:** Exactly one new Journey exists, correctly linked to its originating Journey Planning Record; the Journey Planning Record is Closed (Confirmed) and no longer active.

## 5. Flow — Vendor Assignment

**Preconditions:** A confirmed Journey (Journey Workspace) requires a supplier booking, or a Journey Planning Record requires a commercial quotation from a supplier.

**Flow (Journey Workspace — confirming a booking):**

1. **[Workspace User]** Opens the Journey's Vendor Confirmations context.
2. **[Workspace User]** Selects a Vendor already on record with the appropriate service category and geographic coverage (PD-VM-001/PD-VM-002).
   - *(System)* Only Active Vendors are selectable (FR-WS-031); an Inactive Vendor cannot be chosen for a new confirmation, though any of its existing confirmations remain visible and unaffected.
3. **[Workspace User]** Records the Vendor Confirmation against the Journey (FR-WS-029).
4. *(System)* The Vendor Confirmations queue reflects the Journey no longer having this particular confirmation outstanding, once recorded (FR-WS-030 shows Journeys with an *outstanding* confirmation, so a completed one drops off that queue view).
5. *(Conditional)* **[Workspace User]** If no suitable Vendor exists on record for this destination/service, is directed to Vendor Management to create a new Vendor record before returning to complete the assignment — this cross-navigation follows PD-VM-005 (organisational memory belongs to the Workspace, so a new Vendor discovered mid-Journey is captured as a durable record, not a one-off note).

**Flow (Journey Planning — requesting a commercial quotation):**

1. **[Workspace User]** Identifies a Vendor (existing or newly created) as a candidate for the traveller's itinerary.
2. **[Workspace User]** Records a Vendor Quotation received from that Vendor against the Journey Planning Record — kept as a distinct record type from any Proposal Version (BR-011/PD-JP-003).
3. **[Workspace User]** Uses the Vendor Quotation as commercial input when preparing or revising the traveller-facing Proposal Version (Section 3 above), without merging the two record types.

**Postconditions:** The Vendor Confirmation or Vendor Quotation is recorded and correctly attributed to the Journey or Journey Planning Record; Vendor lifecycle state (Active/Inactive) and Preferred Partner designation remain unaffected by the act of assignment (BR-016/PD-VM-003 — independent concerns).

## 6. Flow — Journey Completion

**Preconditions:** A Journey in Journey Workspace has reached the point of operational closure.

**Flow:**

1. **[Workspace User]** Confirms the Journey's outcome: Successfully Completed, Cancelled, or Archived (PD-JW-005).
2. *(System)* The Journey's status is set to the confirmed outcome; this is a system-derived status update triggered by the Workspace User's deliberate action, never a freely editable dropdown (FR-WS-020/BR-005).
3. *(System)* The Journey's complete operational history (bookings, communications, operational notes, all prior stage transitions) is preserved permanently and is never overwritten by this closure action (PD-JW-006).
4. *(System)* The Journey leaves the Active Journeys queue.
5. *(Conditional, Successfully Completed only)* **[Workspace User]** Is offered the option to capture an operational learning into Itinerary Studio's Learning Repository (best season, an exceptional experience, an operational risk — PD-IS-005) — presented as a suggested next action, not a mandatory step before the closure completes.
6. *(Conditional)* If the learning is submitted, it enters Itinerary Studio's recommend → review → approve governance pipeline (PD-IS-007/BR-015) rather than updating the Master Itinerary immediately.
7. *(System)* Traveller Hub reflects the completed Journey in the Traveller's history and timeline, supporting future follow-up or a new Journey Planning Record for the same Traveller.

**Relationship Principle**

Journey completion represents the completion of a travel experience, not the completion of the traveller relationship.

Future enquiries from the same Traveller naturally begin a new planning cycle while preserving the complete historical relationship.

**Exception path — Cancelled outcome:** the Workspace User records the cancellation reason as an operational note; the flow otherwise follows the same steps (2–4, 7), skipping the learning-capture offer in step 5 unless the Workspace User chooses to record a learning anyway (e.g., an operational risk that caused the cancellation).

**Postconditions:** The Journey is in a terminal, permanently preserved state; any submitted learning is queued for governance review, not yet part of the approved Master Itinerary.

## 7. Cross-Flow Notes

- **No flow above includes a permanent-delete action.** Every terminal state reached in these five flows is an archival or completion state (BR-006/BR-007); permanent deletion is restricted to administrative/configuration data outside the scope of these five flows entirely.
- **Every "creates a new [Proposal Version / Vendor Quotation / Journey]" step is additive, never a silent overwrite** — this recurring pattern (Proposal Revision, Journey Creation) is the interaction-level expression of the Specification's workspace-wide historical-preservation principle (§8.7).
- **Ownership (claim/assign) is never itself a step inside these five business flows** — it is treated as an independent, always-available action a Workspace User can take before or between these flows, consistent with the Generic Ownership Model being orthogonal to lifecycle progression (§8.2).

## 8. Interaction Design Principles

The interaction flows within Journey Workspace are guided by the following principles.

- System behaviour should minimise unnecessary Workspace User actions.
- User interactions should always produce predictable business outcomes.
- Business history is preserved through additive records rather than modification of existing records.
- Workspace Users should remain focused on traveller outcomes rather than application mechanics.
- Exception handling should be explicit and predictable.
- Every interaction should reinforce the Workspace principles of organisation, calm confidence and operational clarity.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS4-001.*
