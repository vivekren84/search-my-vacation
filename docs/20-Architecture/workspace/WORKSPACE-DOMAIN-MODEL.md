# SMV Workspace — Domain Model

| Document Information | |
|---|---|
| Document Name | SMV Workspace Domain Model |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 |
| Last Updated | 14 September 2026 |
| Predecessor | `WORKSPACE-SOLUTION-ARCHITECTURE.md` v1.0 |

---

## 1. Purpose

This document defines SMV Workspace's core business entities, their relationships, aggregate boundaries, ownership and lifecycle, and the business invariants the data model must enforce. It does not redefine any Approved Product concept (Project Instructions, this EBC's explicit constraint) — every entity below traces to a named Business Object in the Product Specification v2.0 §7, unless explicitly marked as an Archie-introduced architectural entity (§2.12) required to implement an approved capability that has no corresponding Product Business Object of its own.

This Domain Model serves as the conceptual representation of SMV Workspace's business domain. It establishes the business entities and their relationships independently of database implementation, ensuring that the approved Product concepts remain the primary drivers of the underlying technical design.

**Vocabulary note (carried from Architecture Discovery §12, A-ARCH-04):** this document uses the Product Specification/RTM's vocabulary — Lead, Journey Planning Record, Journey — as the canonical entity names. `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`'s "Inquiry" refers to the same underlying business concept as Lead/Journey Planning Record at a business-narrative level; it is not modelled as a separate entity. This is a code-naming default for this EBC's deliverables only, not a resolution of the documentation-governance question Sophie already flagged (A-UX-02) — that remains open for Tiger/Arjun.

## 2. Core Business Entities

The entities described below represent the approved business concepts within SMV Workspace. Unless explicitly identified as an architecture-introduced entity, every entity traces directly to the Product Specification Business Objects and retains the ownership boundaries established during Product Discovery.

### 2.1 Lead

- **Definition (Specification §7.1):** the entry point for every external interaction, regardless of source.
- **Identity:** `lead_id` (surrogate key).
- **Key attributes:** source channel, originating reference (nullable — see relationship below), mobile number, created timestamp.
- **Lifecycle:** exists briefly before being claimed into a Journey Planning Record (BR-002); not itself a long-lived, stateful business object beyond that.
- **Relationships:** may reference a `journey_passport_leads` row (site-originated Leads only — Integration Architecture document, OQ-012); one Lead becomes exactly one Journey Planning Record once claimed.
- **Open dependency:** OQ-012 (identity vs. reference relationship with `journey_passport_leads`) — this document proposes the reference relationship (Architecture Discovery §13); not Product-Owner-confirmed.

### 2.2 Traveller

- **Definition (Specification §7.2):** the person(s) travelling; owned by Traveller Hub, referenced — not owned — by Journey Planning and Journey.
- **Identity:** `traveller_id`.
- **Key attributes:** name, mobile number (matched via BR-001), repeat-traveller status (derived), Operational Flags (including Potential Duplicate).
- **Lifecycle:** long-lived; never deleted.
- **Relationships:** one Traveller has many Journey Planning Records and many Journeys (past and current, per FR-WS-007).

### 2.3 Journey Planning Record

- **Definition (Specification §7.3):** one Traveller planning one destination or destination region — the working record from claim through conversion or closure.
- **Identity:** `journey_planning_record_id`.
- **Key attributes:** Traveller reference, destination/region, owner (`workspace_user_id`, nullable while unclaimed), current stage, requirements (dates, flexibility, duration, budget, companions, special requests, flight preferences — PD-JP-006), created/closed timestamps.
- **Lifecycle (PD-JP-005):** Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed (Confirmed / Lost / Archived). Stage transitions are deliberate, owner-driven actions only (FR-WS-016), never a free-text edit.
- **Business invariant (BR-010/PD-JP-001):** exactly one Journey Planning Record per destination or destination region per Traveller — enforced by a partial unique constraint on `(traveller_id, destination_region_key)` where `status != 'closed_lost'` (exact enforcement shape confirmed once destination/region identity is finalised against Destination Intelligence's own model, §2.9).
- **Relationships:** owns many Proposal Versions, many Vendor Quotations, Discovery Notes, Tasks/Follow-ups (aggregate root, §3). Converts one-way into exactly one Journey (BR-012).
Journey Planning Record represents the primary operational aggregate during the pre-confirmation lifecycle and therefore acts as the central coordination point for all planning activities.
- **Ownership:** Generic Ownership Model applies (Claim/Assign/Reassign), confirmed by Journey Planning's own module review.

### 2.4 Journey

- **Definition (Specification §7.4):** a commercially confirmed travel commitment, created only by converting a Journey Planning Record. Covers **Phase 2 (Delivery) only** (PD-JW-002).
- **Identity:** `journey_id`.
- **Key attributes:** Traveller reference, Journey Planning Record reference (`journey_planning_reference` — the identity field the Specification names explicitly, §7.4), owner, destination, travel dates, current status.
- **Lifecycle (PD-JW-005):** created (Active) → Successfully Completed / Cancelled / Archived. No granular Product-Owner-approved stage breakdown exists yet for the active-delivery period itself (Specification §10.2, "Partially Approved") — the illustrative six-stage model is treated as a UI-presentation concern (already handled provisionally by the UX package, A-UX-03), not a hard schema constraint; this document models the active period with a flexible `operational_stage` free-form-but-enumerated field rather than a rigid state machine, so the schema does not need to change if/when the Product Owner confirms the granular breakdown.
- **Business invariant (BR-012/PD-JW-001):** a Journey row can only ever be inserted by the one server-side conversion operation described in §4 — there is no application code path that lets a Workspace User create a Journey row directly.
- **Relationships:** references exactly one originating Journey Planning Record (never duplicated); owns Vendor Confirmations, Operational Readiness items, Tasks/Follow-ups, Documents (aggregate root, §3).
Journey becomes the primary operational aggregate after commercial confirmation, ensuring a clear separation between planning activities and delivery activities throughout the traveller lifecycle.
- **Ownership:** Generic Ownership Model applies; **not assumed to carry over automatically from the originating Journey Planning Record's owner** (per the Interaction Flows document's own explicit flag, tied to OQ-022) — the new Journey is created unclaimed by default.

### 2.5 Proposal Version

- **Definition (Specification §7.3, PD-JP-002):** a traveller-facing document created by Search My Vacation, built from a Traveller Itinerary. Distinct from Vendor Quotation (BR-011).
- **Identity:** `proposal_version_id`.
- **Key attributes:** Journey Planning Record reference, Traveller Itinerary reference, version number, current-active flag (exactly one active per record), sent timestamp (sending is a deliberate, logged action).
- **Lifecycle:** append-only — a revision creates a new row and flips the previous row's current-active flag off; no row is ever overwritten in place (Specification §8.7, historical preservation).

### 2.6 Vendor Quotation

- **Definition (Specification §7.3, PD-JP-003):** commercial information received *from* a Vendor. Kept distinct from Proposal Version (BR-011).
- **Identity:** `vendor_quotation_id`.
- **Key attributes:** Journey Planning Record reference, Vendor reference, received timestamp, commercial detail (amount/terms — field-level detail pending OQ-018).
- **Open dependency (OQ-020):** whether the legacy "Quotation" object name (Specification §7.8) refers to this entity or to Proposal Version is unconfirmed. This Domain Model does **not** create or reuse a "Quotation" table; it implements the two distinct entities the Product Owner Review approved (Proposal Version, Vendor Quotation) and leaves the legacy object's disposition to that Open Question, per the Product Owner's explicit instruction not to merge or redesign these objects ahead of that review.

### 2.7 Master Itinerary and Traveller Itinerary

- **Master Itinerary (Specification §7.6):** organisational knowledge for a destination or destination combination — not tied to any one Journey. **Identity:** `master_itinerary_id`. **Key attributes:** title, destination scope (single or combination — an array or junction table, not a single foreign key, per the Specification's own "identity is the complete combination" language), domestic/international classification, travel style, duration, budget category, approval status.
- **Traveller Itinerary (Specification §7.6a):** a personalised copy of one Master Itinerary for one Journey Planning Record/Journey. **Identity:** `traveller_itinerary_id`. **Key attributes:** `source_master_itinerary_id` (not-null foreign key), Journey Planning Record reference, personalisation detail (destinations removed/added, accommodation, sequencing).
- **Relationship modelling (OQ-021 — the first parent/derived object pair in this domain model):** this Domain Model proposes a plain, explicit foreign key (`traveller_itineraries.source_master_itinerary_id → master_itineraries.id`) plus a `copy_provenance` metadata column recording the source itinerary's version at copy time — deliberately **not** inventing new generic "parent/derived" schema notation, consistent with the UX package's own "based on [Master Itinerary]" plain-language treatment (A-UX-04). This is proposed for Product Owner/Sophie confirmation, not assumed final (Architectural Decisions document, AD-WS11-009).
- **Version history (PD-IS-006):** both objects use an append-only `workspace_itinerary_versions` table (§2.11) rather than in-place field mutation, consistent with historical preservation.

### 2.8 Vendor

- **Definition (Specification §7.7):** an external supplier. **Identity:** `vendor_id`. **Key attributes:** organisation name, vendor type, service categories, geographic coverage, contact information, lifecycle state.
- **Lifecycle:** Prospective → Active → **Inactive** (terminology corrected per Tiger's 13-Sep-2026 decision; "Deactivated" is not used anywhere in this schema).
- **Preferred Partner designation:** a separate boolean/timestamp pair on the Vendor row, explicitly independent of lifecycle state (BR-016/PD-VM-003) — changing one must never change the other; enforced by keeping them as genuinely separate columns with no shared trigger or constraint linking them.

### 2.9 Destination Profile

- **Definition (Specification §7.14):** the organisation's governed operational destination knowledge for a Search My Vacation destination, authored and maintained inside SMV Workspace.

A Destination Profile represents the unit through which Search My Vacation plans, governs, recommends and commercially operates a destination. It is intentionally distinct from canonical geographic identity and instead captures the organisation's operational knowledge, traveller guidance and commercial readiness.
- **Identity:** `destination_profile_id`.
- **Key attributes:** destination name, geographic scope, domestic/international classification, approval status, content (overview, best travel periods, seasonal guidance, traveller suitability, operational recommendations).
- **Lifecycle (PD-DI-004):** Draft → Under Review → Approved (no "Archived" state, by explicit Product decision).
- **Relationship with `geo_places` (Product Owner Approved):** Destination Profile and `geo_places` represent two distinct business concepts with independent ownership.

`geo_places`, managed through the WS1 Bootstrap Generator, remains the authoritative source for canonical geographic identity, including place existence, canonical naming, aliases and geographic hierarchy.

`workspace_destination_profiles` represents Search My Vacation's operational destination knowledge, including traveller suitability, operational recommendations, seasonal guidance, governance workflow and commercial readiness.

A Destination Profile may reference one or more geographic places where appropriate. This allows the Workspace to model:

- a single geographic destination
- a destination region
- a commercially-defined travel experience spanning multiple geographic places

while preserving the independent ownership of geographic identity (WS1) and operational destination knowledge (WS11).

This relationship has been approved by the Product Owner as the architectural baseline for Release 1.3.


### 2.10 Notification

- **Definition (Specification §7.12):** a system-generated indication that a business condition exists — never a record of work ownership.
- **Identity:** `notification_id`.
- **Key attributes:** type (Informational / Action Required, PD-NO-003), source module, referenced entity (polymorphic — `entity_type` + `entity_id`, since a Notification may reference a Journey Planning Record, Journey, Vendor, Destination Profile, Task, or Workspace User without owning any of them), current state.
- **Business invariant (BR-017/PD-NO-004):** an Action Required Notification's `resolved_at` is set only by the underlying condition actually resolving (enforced in `shared/notifications` service logic, not by a UI "mark as read" action alone) — viewing/acknowledging alone never sets it.

### 2.11 Supporting Entities

| Entity | Specification ref | Notes |
|---|---|---|
| Task | §7.10 | Hybrid system+manual creation (BR-008); assignable independent of the record it's attached to |
| Follow-up | §7.11 | Structured (BR-009) |
| Document | §7.13 | Metadata-only in this release (file storage deferred — OQ-014, Integration Architecture) |
| Workspace Configuration | §7.15 | Administrator-managed; runtime, database-backed (not `web/config/*.ts`) per BR-018, "Configuration Over Code" |
| Personal Preferences | §7.16 | Per-Workspace-User; fully independent of Workspace Configuration (BR-019/PD-ST-004) |
| `workspace_itinerary_versions` | Implements PD-IS-006 | Append-only version history for both Master and Traveller Itineraries |

### 2.12 Workspace User — Archie-Introduced Entity

**Not a Product Specification Business Object** — the Specification and UX package refer generically to "Workspace User" as a role concept, not a data entity, because Product Discovery/Review never had cause to specify one. Ownership (Claim/Assign/Reassign), authentication, and role enforcement all require an actual account entity to reference. This Domain Model introduces `WorkspaceUser` (`workspace_users` table, `workspace_user_id`) as the architectural entity every ownership, authorship and audit reference resolves to, linked one-to-one with a Supabase Auth identity (Data Architecture document). This is disclosed explicitly as an architecture-introduced object, not a silent Product decision — it carries no business capability beyond what "Administrator" and "Privilege User" already Approved-imply (identity, role), and Archie is not asserting any capability split beyond that (OQ-001 remains Product's to confirm).
Its inclusion enables implementation of approved ownership, accountability and security capabilities without introducing any new business behaviour beyond the approved Product scope.

## 3. Aggregate Boundaries

Aggregate boundaries are defined according to business ownership and lifecycle responsibility rather than database normalisation or implementation convenience.

| Aggregate root | Owned (child) entities | Rationale |
|---|---|---|
| Journey Planning Record | Proposal Versions, Vendor Quotations, Discovery Notes, its own Tasks/Follow-ups | Matches the Specification's own "Planning activities" list (§7.3) exactly; nothing here is independently addressable outside its parent record |
| Journey | Vendor Confirmations, Operational Readiness items, its own Tasks/Follow-ups, Documents | Matches the Specification's own "Child objects" list (§7.4) exactly |
| Master Itinerary | its own version history, Learning Repository entries attached to it | PD-IS-005/006 — learnings and versions belong to the itinerary they were captured against |
| Traveller Itinerary | its own version history | Distinct aggregate from Master Itinerary, related by reference only (§2.7) — personalising it never mutates its source |
| Vendor | performance notes | PD-VM-004 — retained regardless of the Vendor's own lifecycle state |
| Destination Profile | (none — flat, versioned in place via its own status lifecycle, not a child-table version history, since PD-DI-004's Draft→Under Review→Approved is itself the change-history mechanism for Release 1.3) | Simpler shape; no Product Owner Review evidence names a separate version-history requirement for Destination Profile the way PD-IS-006 names one explicitly for Itineraries |
| Traveller | Operational Flags, Timeline (derived/read-model, not a separately owned write-table) | Traveller Hub owns identity and relationship history; Journeys/Journey Planning Records reference it, they do not extend it |

Cross-aggregate references (e.g. `journeys.journey_planning_record_id`, `traveller_itineraries.source_master_itinerary_id`) are always simple foreign keys to another aggregate's root — never an embedded/duplicated copy of another aggregate's data, consistent with the Solution Architecture's module-dependency rules (§4.2 there) and the Specification's own "references, does not own" language used throughout §7.

## 4. Ownership and Lifecycle

Ownership and lifecycle are modelled as independent business concerns, allowing responsibility, workflow progression and operational state to evolve without unnecessary coupling.

### 4.1 Generic Ownership Model (§8.1 of the Specification; OQ-022)

Modelled as a reusable, opt-in column set (`owner_id → workspace_users.id`, `claimed_at`, `assigned_at`) rather than a bespoke mechanism per table. This document proposes it is applied to: Journey Planning Record, Journey, Task (all three explicitly named or clearly implied by the Specification and PO Reviews). Whether it also applies uniformly to Itinerary Studio, Vendor Management and Destination Intelligence records (OQ-022's actual question) is **not decided here** — the column set can be added to any of those tables later without a structural redesign, so this architecture does not block on that Product decision.

### 4.2 Lifecycle Independent of Ownership and Designation (§8.2–§8.3)

Enforced structurally, not just by convention: lifecycle-state columns (e.g. `vendors.lifecycle_state`) and designation columns (e.g. `vendors.is_preferred_partner`) are separate columns with no foreign-key or trigger relationship between them, and no single "status" enum conflates the two concepts anywhere in this model — directly preventing the class of bug where changing one accidentally changes the other.

### 4.3 Historical Preservation, Workspace-wide (§8.7; BR-006/BR-007)

Journey Planning Record, Journey, Traveller History, Proposal History, Vendor History, and Destination Profile support **archival only, never permanent deletion**, by any role, at any time (BR-007, rewritten). This is enforced at the data-access layer: `repository.ts` for these six object types exposes no `delete()` function at all — only `archive()` — so the constraint is structural (the capability does not exist in the code path), not merely policy. Permanent deletion remains available only for administrative/configuration data (e.g. a mistakenly created Workspace Configuration entry), implemented as an genuinely separate, narrowly-scoped repository function.

## 5. Business Invariants Summary

| Rule | Enforcement mechanism |
|---|---|
| BR-010 — one Journey Planning Record per destination/region per Traveller | Partial unique index (§2.3) |
| BR-011 — Proposal Version and Vendor Quotation never merged | Two distinct tables, no shared identity (§2.5–§2.6) |
| BR-012/PD-JW-001 — a Journey is created only by converting a Journey Planning Record | Single server-side conversion function is the only INSERT path (§2.4; Solution Architecture §6) |
| BR-013/PD-JW-002–004 — commercial work stays in Journey Planning; minor Journey changes stay in the same Journey; material changes require a new Journey Planning Record | Enforced in `journey-workspace/service.ts` business logic — no schema-level "convert back" path exists |
| BR-014/PD-IS-001,003 — Master Itinerary is organisational; personalising a Traveller Itinerary never changes its source | Traveller Itinerary has its own row/version chain; no write path from Traveller Itinerary back to Master Itinerary except the explicit, Administrator-approved Promotion action (PD-IS-008) |
| BR-016/PD-VM-003 — designation independent of lifecycle | Separate columns, no shared trigger (§4.2) |
| BR-017/PD-NO-004 — Notification resolution is condition-based | `resolved_at` set only by the originating module's own resolution logic (§2.10) |
| BR-006/BR-007 — archive, never delete, for the six named object types | No `delete()` function exists for these types at the repository layer (§4.3) |

These invariants define the business rules that every implementation must preserve regardless of future changes to technology, user interface or persistence mechanisms.

## 6. What This Domain Model Deliberately Does Not Do

- It does not assign concrete SQL column types, constraints or migration scripts — that is the Data Architecture document.
- It does not resolve OQ-001, OQ-006, OQ-012, OQ-014, OQ-019, OQ-020, OQ-021 or OQ-022 — each is addressed with a proposed architectural approach that does not block implementation, not a Product decision.
- It does not invent field-level detail for the ~185 undrafted Functional Requirements (OQ-018) — entities carry the attributes the Specification and PO Reviews explicitly name, and no more.

With these conceptual boundaries established, the subsequent Data Architecture document can focus exclusively on persistence strategy, schema design and database implementation without redefining the business domain described here.

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*
*Every entity above traces to a named Product Specification Business Object, except `WorkspaceUser` (§2.12), which is disclosed explicitly as an architecture-introduced entity required to implement Approved ownership and role capabilities.*

---

## 7. WS13 Revision Note (`EBC-R1.3-WS13-003`, 26 September 2026)

*Additive note following the supersede-not-delete convention. §2.4 and §3 above are retained as written for traceability.*

- **§2.4 Journey: ownership superseded by D-03.** A Journey is **owned at creation** by the Journey Planning record's owner and is never unassigned. The sentence "the new Journey is created unclaimed by default" no longer applies.
- **§2.4 Journey: lifecycle superseded by D-01.** The flexible `operational_stage` field is replaced by the approved seven-stage lifecycle (Confirmed → … → Journey Closed), with Cancelled and Superseded as terminal outcomes and On Hold and Archived as overlays (AD-WS13-001). "Completed" is a UX label for `journey_closed` only.
- **§3 Journey aggregate children, renamed per the WS13 baseline:** Vendor Booking (was "Vendor Confirmation", D-07); Readiness Item with a Readiness Template (was "Operational Readiness item", D-04); Document Requirement (metadata only, D-10); Change Record (D-06); Primary Operational Contact (D-12); Journey Activity; Tasks/Follow-ups (shared).
- **New relationship:** replacement Journey → `supersedes_journey_id` → original Journey (D-13); Journey Planning Record → `replaces_journey_id` → held Journey (CM-02).
- Full detail: `docs/09-Development/EBC-R1.3-WS13-003-…-Architecture-Validation-and-Solution-Alignment.md` §4.1, §6.

### 7.1 Alignment note (`EBC-R1.3-WS13-004A`, 27 September 2026)

*Additive.*
- **Journey** gains one primary **Service Category** (POD-02/07). Legacy Journeys may remain unclassified until explicitly classified (PD-C).
- **Journey Document** references a **Document Type** (one Document Type to many Journey Documents, POD-03).
- **Archived** Journeys are read-only, with no restoration in Release 1.3 (POD-08, PD-E).
- A **Replacement Journey** inherits operational context from the original (PD-B). The planning record is pre-filled with trip parameters, destination, Service Category, a proposal Version 1 copied from the accepted snapshot, carried notes and vendor-quotation baselines. At conversion, the contact and Journey Documents are copied. The original aggregate is never modified beyond its hold and supersession fields (WS13-004A §4).
