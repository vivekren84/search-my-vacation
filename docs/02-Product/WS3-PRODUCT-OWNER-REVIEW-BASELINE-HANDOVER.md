# Search My Vacation — SMV Workspace: Product Owner Review Baseline Handover

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v1.0 (Complete) |
| **Status** | **Complete Product Owner Review Baseline — all nine Workspace modules Approved.** This document is the authoritative Release 1.3 Product Baseline for the SMV Workspace, pending the Delivery Governance Consistency Review (§0.2) and Product Owner sign-off on the items it raises. |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 13 September 2026 |
| **Purpose** | Consolidate the complete Product Owner Review — Phase 1, Phase 2, and all nine Module reviews — into a single authoritative baseline, preserving both the approved decisions and the business reasoning behind them, ready to drive one coordinated update to the Product Specification and RTM (`EBC-R1.3-WS3-004`, Stage 4). |
| **Prepared under** | `EBC-R1.3-WS3-004A` (v0.1) and `EBC-R1.3-WS3-004B` / Tiger's consolidated execution brief (v1.0) |
| **Source material** | v0.1 of this document (Phase 1, Phase 2, Dashboard, Traveller Hub, from Tiger's chat handover); `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md` through `PO-REVIEW-09-Settings.md`; `docs/02-Product/reviews/README.md` |
| **Predecessor documents** | `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md`; `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md` |
| **Successor** | `EBC-R1.3-WS3-004`, Stage 4 — one coordinated Product Specification (v1.1) and RTM update, only after the Impact Assessment (a companion document to this one) is reviewed and approved |

### 1.1 How to read this document

Unchanged from v0.1:

| Label | Meaning |
| --- | --- |
| **Approved** | A decision the source material states the Product Owner has actually made, for a module or topic the source material states has been reviewed. |
| **Arjun's framing** | Organisational language added to present the approved decisions in a consistent cross-module structure — never a new decision. |
| **Flagged for Stage 2/3** | A place where this document's own construction surfaced a terminology gap, an unresolved interaction with existing approved material, or a dependency the Product Owner/Tiger/Archie should confirm before Stage 4. Flagging is not resolving — nothing under this label is treated as decided by this document. |

### 1.2 What changed since v0.1

v0.1 covered Phase 1, Phase 2 (cross-cutting decisions) and two of nine modules (Dashboard, Traveller Hub), with the remaining seven explicitly marked Not Yet Reviewed. This version incorporates the seven supplied Product Owner Review Notes (`PO-REVIEW-03` through `PO-REVIEW-09`), completing all nine modules. Nothing in the Dashboard or Traveller Hub sections is changed in substance — only cross-references to the newly-reviewed modules are added where §5.1/§5.2 originally deferred them (e.g., Dashboard's dependency on the Journey Planning and Vendor Confirmations queues, now themselves Approved).

---

## 0. Governance Trail

### 0.1 Escalations this document resolves

Two escalations preceded this baseline:

1. `EBC-R1.3-WS3-004-ARJUN-Product-Specification-Baseline-Consolidation-ESCALATION.md` (13 Sep 2026) — raised because the original `EBC-R1.3-WS3-004` card asserted a completed nine-module Product Owner Review with no corroborating evidence anywhere in the repository or this Project.
2. The v0.1 handover itself, which documented only two of nine modules for the same reason, and two further request cycles (`EBC-R1.3-WS3-004B`, first without and then with the actual review notes attached).

Both are resolved by the seven `PO-REVIEW-0x` documents now supplied and present in the repository at `docs/02-Product/reviews/`, each carrying its own approval record (Prepared by Tiger, Reviewed with Vivek, Status: Product Owner Approved). This document treats them as authoritative source material, per Tiger's instruction, and does not re-open or second-guess the decisions they record.

**Worth noting for the audit trail, not as a concern:** the Functional Requirement totals in the supplied notes (Journey Planning 30, Journey Workspace 31, Itinerary Studio 36, Vendor Management 30, Destination Intelligence 35, Notifications 24, Settings 21) are the same figures originally cited in the very first `EBC-R1.3-WS3-004` card, which at the time had no discoverable source anywhere. They now do have a source — these seven documents — which is exactly the outcome the original escalation asked for.

### 0.2 What this document does not resolve

Building this consolidated baseline surfaced several places where a newly-Approved module decision interacts with existing repository content (the current Product Specification, an existing Open Question, or another workstream's already-approved architecture) in a way that is not itself addressed by the supplied review notes. These are **not treated as resolved by this document** — they are recorded in §8 (Governance Principles), §9 (Product Decision Register notes) and, in full, in the companion **Delivery Governance Consistency Review** and **Impact Assessment** documents produced alongside this one. The most significant is flagged here up front because it affects a decision Archie, not Arjun, owns:

> **Destination Profile governance vs. the WS1 Destination Intelligence pipeline.** `PO-REVIEW-07` approves Destination Intelligence as an organisationally-governed object with its own authoring/review/approval lifecycle (Draft → Under Review → Approved) inside the Workspace. The existing Product Specification (§6.6) — and the entire WS1 workstream (Bootstrap Generator, Travel Region model, `geo_places` architecture) already delivered by Rad — treated destination content authorship as living outside the Workspace, in the Bootstrap/Operational Workbook pipeline, with the Workspace as a read-only consumer. This document records the Product Owner Review decision faithfully (§5.7) but does not decide how it reconciles with WS1's already-built architecture — that is an architecture question for Archie, raised here rather than silently assumed either way.

---

## 2. Executive Summary

**Purpose.** Capture every Product Owner Review decision for the SMV Workspace (Release 1.3) across all nine modules, preserving the reasoning behind each, so the eventual Product Specification/RTM update reflects what was actually decided and why — not a re-derivation.

**Scope.** Complete: Phase 1 and Phase 2 cross-cutting decisions; all nine Module reviews (Dashboard, Traveller Hub, Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence, Notifications, Settings).

**Review participants.** Tiger (Delivery Manager, facilitating and recording) and Vivek (Product Owner, deciding), per the source handovers and the seven `PO-REVIEW-0x` documents.

**Outcome.** All nine modules are Product Owner Approved. This document is now the complete Release 1.3 Product Owner Review Baseline. It is not yet the Product Specification/RTM update itself — per Tiger's explicit instruction, that is a separate, single coordinated Stage 4 activity gated on review of the companion Impact Assessment.

---

## 3. Workspace Philosophy

**Approved**, now substantiated across all nine modules (extending v0.1 §3, which could only state these as headings):

- **Relationship-first platform.** Unchanged from v0.1 — the Traveller is the long-term relationship entity; Leads, Journey Planning Records and Journeys are lifecycle events attached to it.
- **Operational workspace.** Unchanged — the Dashboard remains the work-oriented entry point, now with confirmed dependencies on the Journey Planning, Active Journeys/Journey Workspace, Vendor Confirmation and Notifications queues, all themselves Approved.
- **Continuous, organisational learning.** Now fully substantiated: Itinerary Studio's Learning Repository (`PO-REVIEW-05` §6, PD-IS-005) and Destination Intelligence's Continuous Learning decision (`PO-REVIEW-07` PD-DI-006) both describe the same pattern — operational experience is captured, reviewed, and only becomes organisational knowledge after approval. Vendor Management's Supplier Performance decision (PD-VM-004) is the same pattern applied to vendors.
- **Knowledge-driven travel business.** Now fully substantiated: Itinerary Studio (Master Itineraries as reusable organisational assets, PD-IS-001/002), Destination Intelligence (Destination Profiles as organisational knowledge, PD-DI-001), and Vendor Management (supplier intelligence as organisational memory, PD-VM-005) together establish that the Workspace's core asset is curated, governed knowledge — not individual records.

---

## 4. Cross-Module Design Principles

**Approved**, updated from v0.1's provisional list now that all nine modules have been reviewed:

1. **Separation of business policy from implementation.** Unchanged from v0.1 — reaffirmed by every module's separate "Product Owner Decisions" vs. "Governance Decisions" treatment.
2. **Generic ownership model.** Unchanged — Journey Planning (`PO-REVIEW-03` §7) explicitly reaffirms Claim/Assign/Reassign as the Workspace-standard ownership mechanism, applied here to Journey Planning Records.
3. **Organisational ownership vs. individual ownership.** Now substantiated across three more modules: Itinerary Studio's Master Itineraries (PD-IS-001, "belong to the Workspace rather than individual Workspace Users"), Vendor Management's supplier intelligence (PD-VM-005), and Destination Intelligence's Destination Profiles (PD-DI-001) all use the identical pattern — organisationally-owned knowledge objects, distinct from individually-owned operational records (Journey Planning Records, Journeys, Tasks).
4. **Reuse over recreation.** **Now Approved**, was previously a named-but-unsubstantiated heading. Itinerary Studio's PD-IS-002 states this as an explicit principle: new traveller itineraries should normally begin from an existing Master Itinerary rather than being authored from scratch.
5. **Historical integrity.** **Now Approved workspace-wide**, was previously approved only at the Traveller level (v0.1). Independently reaffirmed by Journey Planning (proposal and quotation history preserved, PD-JP-002/003 and §8), Journey Workspace (operational history never overwritten, PD-JW-006), Itinerary Studio (version history for both Master and Traveller Itineraries, PD-IS-006), Vendor Management (supplier history preserved regardless of lifecycle, §8), and Destination Intelligence (knowledge evolves while preserving history, §7).
6. **Independent business concepts.** Unchanged in kind, now reaffirmed with new examples: Journey Planning's Planning Status / Ownership / Proposal Versions / Vendor Quotations (§8); Vendor Management's Lifecycle vs. Preferred Partner designation (PD-VM-003, §8); Notifications' Notification vs. Task (PD-NO-002); Settings' Organisational Configuration vs. Personal Preferences (PD-ST-004). This is now clearly the Workspace's single most-repeated governance pattern — every module keeps its status/lifecycle field independent from ownership, designations, and awareness signals.
7. **Configuration over code changes.** **Now Approved**, was previously an unsubstantiated heading. Settings' PD-ST-001 states this explicitly as a Product Owner-approved principle, extended by PD-ST-005 to configurable reference data generally.
8. **Notifications represent awareness; Tasks represent work.** **Now Approved** exactly as stated. Notifications' PD-NO-002 states this distinction in almost these words, with the added and important refinement (PD-NO-004) that a Notification does not resolve merely by being viewed — only the underlying business condition resolves it.

**One additional principle emerged that v0.1 did not anticipate and is added here:**

9. **Operational designations are independent of lifecycle status.** Traveller Hub's Operational Flags (v0.1, "Potential Duplicate") and Vendor Management's Preferred Partner designation (PD-VM-003, explicitly *not* a lifecycle state) are the same underlying pattern applied to two different objects. Recommend this be named as its own cross-module principle in the eventual Product Specification, generalising beyond the two modules that happen to instantiate it today.

---

## 5. Module Reviews

### 5.1 Dashboard — Approved, Complete

*(Unchanged from v0.1 — see that version's §5.1 for full detail: KPIs, Quick Actions, post-login landing page, and the recommendation to draft two new FRs for these capabilities.)* Cross-reference update: the Dashboard's dependency on Operational Queues (v0.1 FR-WS-005) can now be fully resolved, since Journey Planning, Journey Workspace/Active Journeys, Vendor Confirmations and Notifications are all themselves Approved (§5.3–§5.4, §5.6, §5.8).

### 5.2 Traveller Hub — Approved, Complete

*(Unchanged from v0.1 — see that version's §5.2 for full detail: Traveller Timeline, Traveller Snapshot, Operational Flags, companion/family handling, duplicate management.)*

### 5.3 Journey Planning — Approved, Complete

**Vision.** The Workspace capability for discovering, qualifying, designing and commercialising a proposed journey before any operational commitment is made — an iterative planning workspace, not a booking management tool (`PO-REVIEW-03` §2).

**Business Purpose.** Understand traveller requirements, coordinate planning activities, manage proposal iterations, coordinate vendor quotations, guide commercial discussions, and convert a qualified proposal into a confirmed Journey, while preserving the complete planning history (§3).

**Business Object — Journey Planning Record.** The primary object: one Traveller planning one destination or destination region.

- **Identity:** Planning ID, Traveller, Destination/Region, Owner, Created Date, Current Status.
- **Requirements captured:** travel dates, date flexibility, duration, budget, companions, special requests, and — a specific Product Owner inclusion — **flight preferences** (e.g. non-stop, preferred transit). "Purpose of travel" was specifically considered and **not** included as essential for Release 1.3 (PD-JP-006).
- **Planning activities:** Discovery Notes, Activities, Proposal Versions, Vendor Quotations, Follow-ups, Tasks.
- **Documents:** may be associated (passport copies, visa documentation) but the Product Owner clarified these vary by journey type and are not mandatory for domestic travel.
- **Lifecycle:** Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed (Confirmed / Lost / Archived) (PD-JP-005).
- **Ownership:** the generic Workspace model — Claim, Assign, Reassign — independent of lifecycle status (§7).

**Product Owner Decisions:**

- **PD-JP-001 — One Planning Record Per Destination.** A Journey Planning Record covers exactly one destination or destination region per Traveller (e.g. Traveller→Bali is one record; a single record spanning Bali+Singapore+Malaysia is not accepted). A second destination means a second record.
- **PD-JP-002 — Proposal Versions.** Multiple proposal versions may exist per record, representing the evolution of the discussion with the traveller; exactly one is the current active proposal; prior versions remain available for historical reference.
- **PD-JP-003 — Vendor Quotations are distinct from Proposal Versions.** Vendor Quotations are commercial information *received* from vendors; Proposal Versions are traveller-facing documents *created by* Search My Vacation. The two remain separate throughout the Workspace.
- **PD-JP-004 — Traveller Relationship.** Journey Planning references the Traveller; it does not create or own it — Traveller information stays in Traveller Hub's ownership.
- **PD-JP-005 — Planning Lifecycle.** As above.
- **PD-JP-006 — Planning Scope.** As above (flight preferences in; purpose-of-travel out for R1.3).
- **PD-JP-007 — Archive Behaviour.** Planning Records are never deleted as part of normal operations; closed records remain available for history and analysis. **Flagged for Stage 2:** this document does not state whether the existing Admin-only permanent-delete rule (Product Specification BR-07 / RTM BR-007) still applies to a Journey Planning Record in the Archived state, or whether "never deleted" for this object type is meant to exclude even that exceptional path. Recommend Tiger/Vivek confirm before Stage 4, since it changes whether BR-007 applies uniformly or has an explicit named exception.

**Governance Decisions:** Separation of Planning Status, Ownership, Proposal Versions and Vendor Quotations as independent concepts; historical integrity for proposals, quotations and planning generally; relationship integrity — Journey Planning creates confirmed Journeys, Traveller Hub owns the relationship, Journey Workspace owns confirmed-journey operations, each module keeping its own responsibility.

**Business Principles:** reuse of the generic ownership model; the Workspace-wide independent-concepts pattern (§4.6); historical integrity (§4.5).

**Functional Requirement Summary.** **30 Functional Requirements, all Must Have**, approved during Product Owner Review, covering: planning creation, traveller association, requirement capture, proposal management, vendor quotation management, ownership, follow-ups, tasks, status management, search, audit history, and governance (one additional governance-related requirement was approved during review, folded into the 30). The existing baseline carries 5 FRs for this module (`FR-WS-012`–`016`); **the specific wording of the remaining ~25 is not present in the supplied evidence** — only the count and the twelve topic groups above. Drafting the individual FR statements is Stage 4 work and is called out as a dependency in the companion Impact Assessment.

**Cross-Module Relationships:** Traveller Hub (traveller identity/relationship); Journey Workspace (receives confirmed planning records on conversion); Vendor Management (quotations, commercial input); Itinerary Studio (reusable itinerary assets for customisation); Notifications (planning-activity alerts); Dashboard (operational visibility into planning workload).

**Product Owner Outcome:** **Approved.** No outstanding Product Owner questions recorded for this module (one Stage-2 flag raised by this document, above, is Arjun's own cross-reference check, not an open item the review itself left).

### 5.4 Journey Workspace — Approved, Complete

**Vision.** The operational execution module managing confirmed journeys from commercial confirmation to operational closure — coordinating bookings, traveller support and operational readiness (`PO-REVIEW-04` §2).

**Business Purpose.** Manage confirmed journeys, coordinate operational readiness, monitor booking progress, manage traveller servicing, coordinate suppliers, support travellers before/during/after travel, preserve operational history (§3).

**Business Object — Journey.** The primary object: a commercially confirmed travel commitment, created only after a Journey Planning Record is successfully confirmed.

- **Identity:** Journey ID, Traveller, Journey Planning Reference, Owner, Destination, Travel Dates, Current Status.
- **Operational information:** booking confirmations, accommodation, transportation, activities, traveller documents, communications, operational notes.
- **Child objects:** Tasks, Activities, Operational Notes, Vendor Bookings, Documents, Notifications — each independently identified but linked to the Journey.
- **Operational readiness tracking:** booking confirmations, documentation completion, traveller readiness, supplier readiness — to minimise pre-departure risk.

**Product Owner Decisions:**

- **PD-JW-001 — Journey Creation.** A Journey is created *only* through successful conversion of a Journey Planning Record; Workspace Users cannot create Journeys directly. **This resolves the existing Open Question OQ-013** (whether Journey Planning and Journey are one data object or two): they are confirmed as two distinct objects with a one-way conversion, not a single record whose stage crosses a phase boundary.
- **PD-JW-002 — Operational Scope.** Journey Workspace begins after commercial confirmation; commercial/proposal activity stays in Journey Planning. **This resolves Open Question OQ-005**, but not in the direction the Product Specification's Proposed language assumed: OQ-005 asked whether Journey Workspace was the *Phase 1+2* working record; the Product Owner has instead confirmed Journey Workspace is *Phase 2 only*, cleanly split from Journey Planning's Phase 1. This is a correction to carry into the Product Specification update, not a confirmation of what was drafted.
- **PD-JW-003 — Journey Changes (minor).** Operational refinements after confirmation (hotel changes, sightseeing adjustments, sequencing) stay within the same Journey — no new Journey needed.
- **PD-JW-004 — Material Scope Changes.** A fundamentally different destination requested post-confirmation does not modify the existing Journey; instead the Journey may be placed On Hold, and a new Journey Planning Record is created and runs through the standard process.
- **PD-JW-005 — Journey Completion.** A Journey concludes as Successfully Completed, Cancelled, or Archived. Post-confirmation cancellation is expected to be rare but must be supported for historical accuracy.
- **PD-JW-006 — Operational History.** A complete, permanent operational history is preserved; post-confirmation activity is never overwritten.

**Governance Decisions:** clean separation of Journey Planning (commercial) from Journey Workspace (operational) as a Workspace-wide rule, not a per-feature convenience; preservation of history; Journey integrity — operational refinements stay in-Journey, fundamental destination changes require a new planning cycle.

**Functional Requirement Summary.** **31 Functional Requirements, all Must Have**, covering: journey creation, operational management, booking coordination, traveller servicing, vendor coordination, operational readiness, task management, notifications, search, audit history, governance, and operational alerts. The Product Owner specifically endorsed **operational alerts** as a capability meant to make the Workspace the team's primary daily tool. Existing baseline carries 4 FRs (`FR-WS-017`–`020`); wording for the remaining ~27 is not in the supplied evidence — same Stage 4 dependency as Journey Planning.

**Cross-Module Relationships:** Journey Planning (receives confirmed records); Traveller Hub (relationship context); Itinerary Studio (approved operational itinerary); Vendor Management (supplier coordination/booking fulfilment); Notifications (departures, confirmations, traveller support alerts); Dashboard (active-journey visibility).

**Product Owner Outcome:** **Approved.**

### 5.5 Itinerary Studio — Approved, Complete

**Vision.** The organisational capability for creating, maintaining, governing and continuously improving Search My Vacation's reusable itinerary knowledge — building assets that are reused, personalised and enhanced over time, not isolated customer documents. The Product Owner confirmed the module name **"Itinerary Studio"** is retained (`PO-REVIEW-05` §2).

**Business Purpose.** Create reusable Master Itineraries, personalise them per traveller, preserve organisational travel knowledge, incorporate learnings from completed journeys, reduce repeated effort, continuously improve the traveller experience (§3).

**Business Object — Master Itinerary.** **This is a change from the existing Product Specification's "Itinerary" object** (§7.6, one Itinerary per Journey). The Master Itinerary is now the organisation's approved knowledge for a destination or destination combination; Traveller Itineraries are derived copies, not the same record.

- **Identity:** Itinerary ID, Title, Destination Scope, Domestic/International Classification, Travel Style, Duration, Budget Category, Approval Status.
- **Destination scope:** a Master Itinerary may represent a single destination or a defined combination (e.g. Amritsar; or Munnar+Kochi+Alappuzha) — identity is the complete combination, not a single state or country.
- **Structure:** destinations covered, day-by-day plan, accommodation recommendations, meal plans, recommended cafés, suggested experiences, optional activities, traveller guidance.
- **Knowledge assets:** operational recommendations, traveller insights, seasonal advice, local experiences, trusted vendors, practical guidance.
- **Learning Repository:** a newly-approved concept — operational learnings from completed journeys (best season, unsuitable periods, exceptional experiences, operational risks — positive *and* negative) are captured, reviewed, and incorporated into future Master Itinerary revisions.

**Product Owner Decisions:**

- **PD-IS-001 — Organisational Ownership.** Master Itineraries belong to the Workspace, not individual Workspace Users; shared organisational assets.
- **PD-IS-002 — Reuse Over Recreation.** New traveller itineraries should normally start from an existing Master Itinerary rather than being built from scratch.
- **PD-IS-003 — Traveller Personalisation.** Traveller itineraries are created by copying and customising an approved Master Itinerary (removing destinations, changing accommodation/sightseeing/sequence, incorporating preferences); the Master Itinerary itself is unchanged by this.
- **PD-IS-004 — New Destinations.** Where no Master Itinerary exists yet for a destination Search My Vacation begins operating in, a new one may be created as the organisation's starting knowledge, to be improved by future operational learning.
- **PD-IS-005 — Continuous Learning.** As described above (Learning Repository).
- **PD-IS-006 — Version History.** Version history exists for both Master and Traveller Itineraries.
- **PD-IS-007 — Master Itinerary Governance.** Master Itineraries evolve incrementally through operational learning; fundamental structural changes require governance, not ad-hoc editing.
- **PD-IS-008 — Promotion of Successful Itineraries.** A Traveller Itinerary that consistently outperforms may be promoted to become the new Master Itinerary, but only with explicit Administrator approval; the previous Master Itinerary remains available as historical knowledge.

**Governance Decisions:** Master Itinerary (organisational knowledge) vs. Traveller Itinerary (personalised customer document) kept as separate business objects; review required before any operational learning is adopted into the Master Itinerary (Workspace Users may recommend, only approved reviewers/Administrators adopt); historical preservation of prior versions.

**Functional Requirement Summary.** **36 Functional Requirements, all Must Have**, covering: Master Itinerary management, traveller itinerary creation, personalisation, version management, learning capture, governance, search, approval, and organisational knowledge preservation — including one requirement specifically approved to capture operational learnings from completed journeys. Existing baseline carries 4 FRs (`FR-WS-021`–`024`) written against the old single-Itinerary-per-Journey model; **these will need to be substantially rewritten, not just supplemented**, to reflect the Master/Traveller Itinerary split — flagged as a larger-than-usual Stage 4 item in the Impact Assessment.

**Cross-Module Relationships:** Journey Planning (reusable assets for proposals); Journey Workspace (operational itinerary for confirmed journeys); Destination Intelligence (consumes destination knowledge to improve itineraries); Traveller Hub (personalisation support); Vendor Management (preferred supplier recommendations); Notifications (itinerary-update alerts).

**Product Owner Outcome:** **Approved.**

### 5.6 Vendor Management — Approved, Complete

**Vision.** The capability for establishing, maintaining and continuously improving Search My Vacation's supplier ecosystem — the organisational memory of supplier relationships, not merely a contact directory (`PO-REVIEW-06` §2).

**Business Purpose.** Maintain supplier information, support commercial planning, coordinate supplier relationships, preserve performance history, identify preferred partners, improve operational consistency, strengthen long-term relationships (§3).

**Business Object — Vendor.** An external organisation/service provider supplying travel-related services (DMCs, hotels, transport, visa partners, insurance, cruise operators, eSIM providers, activity operators). The Product Owner explicitly required support for varied vendor types, not an assumption that every vendor is a full-service DMC.

- **Identity:** Vendor ID, Organisation Name, Vendor Type, Service Categories, Geographic Coverage, Contact Information.
- **Relationship information:** Preferred Partner designation, primary contacts, commercial relationship notes, active engagements.
- **Journey relationships:** may associate with Journey Planning Records, Journeys, Master Itineraries, Destination Profiles — for commercial and operational traceability.
- **Performance information:** reliability, service quality, commercial responsiveness, traveller experience, operational feedback — for internal use only.

**Product Owner Decisions:**

- **PD-VM-001 — Multi-Service Vendors.** A Vendor may offer one or more service categories; the Workspace shall not assume all vendors provide all services.
- **PD-VM-002 — Geographic Coverage.** Each Vendor records the destinations/regions it supports, so Journey Planning and Journey Workspace can identify appropriate partners.
- **PD-VM-003 — Preferred Partner.** **Not** a lifecycle status — an independent operational designation, orthogonal to lifecycle. (Note the terminology overlap with Traveller Hub's Operational Flags — see §4.9 above.)
- **PD-VM-004 — Supplier Performance.** Preserved as organisational knowledge (reliability, responsiveness, competitiveness, traveller feedback, operational quality) — internal use only.
- **PD-VM-005 — Organisational Memory.** Supplier intelligence belongs to Search My Vacation, not individual Workspace Users.

**Lifecycle:** Prospective → Active → Inactive. The Product Owner explicitly rejected "Preferred" as a lifecycle state. **Flagged for Stage 2:** the existing Product Specification's Vendor object (§7.7) uses "Active → Deactivated"; the new lifecycle uses "Inactive" and adds "Prospective" as an entry state. Recommend harmonising terminology (Deactivated vs. Inactive) in the Stage 4 update rather than carrying both spellings forward.

**Governance Decisions:** lifecycle and Preferred Partner designation kept fully independent (an Active Vendor may or may not be Preferred; an Inactive Vendor retains its history); supplier history preserved regardless of lifecycle state; organisational, not individual, ownership of vendor knowledge.

**Functional Requirement Summary.** **30 Functional Requirements, all Must Have**, covering: vendor creation, maintenance, service category management, geographic coverage, Preferred Partner management, performance recording, search, operational relationships, governance, audit history. Existing baseline carries 4 FRs (`FR-WS-028`–`031`); wording for the remaining ~26 is not in the supplied evidence.

**Cross-Module Relationships:** Journey Planning (quotations, commercial options); Journey Workspace (confirmed bookings); Itinerary Studio (preferred-supplier recommendations); Destination Intelligence (trusted destination-specific supplier knowledge); Notifications (supplier-related alerts); Dashboard (follow-up visibility).

**Product Owner Outcome:** **Approved.**

### 5.7 Destination Intelligence — Approved, Complete

**Vision.** The organisational capability for creating, governing and continuously improving Search My Vacation's destination knowledge — trusted operational knowledge supporting planning, itinerary creation and decision-making, not a static repository (`PO-REVIEW-07` §2).

**Business Purpose.** Maintain trusted destination information, support Journey Planning, improve Master Itineraries, preserve operational learnings, guide traveller recommendations, provide organisational destination expertise (§3).

**Business Object — Destination Profile.** **The Product Owner approved renaming the primary object from "Destination Knowledge" to "Destination Profile"**, and — more materially — approved a full authoring/governance model for it inside the Workspace. This is the single largest architectural departure from the existing Product Specification in this batch of reviews; see §0.2 above and the Impact Assessment for the full implication.

- **Identity:** Destination ID, Destination Name, Geographic Scope, Domestic/International Classification, Approval Status.
- **Content:** overview, destinations covered, best travel periods, seasonal guidance, traveller suitability, travel considerations, operational recommendations.
- **Knowledge assets:** traveller insights, operational advice, destination highlights, common traveller questions, planning recommendations, practical guidance.
- **Relationships:** Master Itineraries, Journey Planning, Journeys, Preferred Vendors, traveller feedback, operational learnings.

**Product Owner Decisions:**

- **PD-DI-001 — Organisational Ownership.** Destination Profiles belong to Search My Vacation, not individual Workspace Users.
- **PD-DI-002 — Governance Before Publication.** Operational learnings do not automatically become organisational knowledge; Workspace Users may recommend, but changes require review and approval before becoming part of the approved knowledge base.
- **PD-DI-003 — Destination Profile Creation.** A Destination Profile may be created *before* Search My Vacation has sold the destination, to allow research and governance ahead of commercial launch.
- **PD-DI-004 — Destination Profile Lifecycle.** Draft → Under Review → Approved. "Archived" was **deliberately excluded** for Release 1.3 — Destination Profiles are meant to keep evolving, not be retired.
- **PD-DI-005 — Supporting Media.** Intentionally deferred from Release 1.3 — the Product Owner determined destination images/media do not materially improve the internal Workspace this release and should not be mandatory content.
- **PD-DI-006 — Continuous Learning.** Destination knowledge evolves through completed journeys, traveller feedback, operational experience, vendor insights, seasonal observations — all subject to governance review before incorporation.

**Governance Decisions:** Destination Profiles become the single source of truth other modules consume from; a strict Recommendation → Review → Approval → Publication pipeline; historical preservation of destination-knowledge changes with audit traceability.

**Functional Requirement Summary.** **35 Functional Requirements, all Must Have**, covering: Destination Profile management, knowledge governance, review and approval, destination search, destination relationships, organisational learning, audit history, search, lifecycle management, governance. Existing baseline carries 3 FRs (`FR-WS-025`–`027`), written on the assumption that this module is a **read-only** surface into an externally-governed Destination Knowledge Base (Product Specification §6.6, and Open Question OQ-007). **This assumption is now explicitly superseded** — PD-DI-002/003/004 describe an authoring and governance workflow *inside* the Workspace itself. OQ-007 is resolved, but in the opposite direction from what was Proposed. This is the most significant single item for Archie's attention before Stage 4 (see §0.2).

**Cross-Module Relationships:** Journey Planning (trusted information during planning); Itinerary Studio (destination knowledge feeding Master Itineraries); Journey Workspace (operational guidance during confirmed journeys); Vendor Management (destination-specific supplier knowledge); Traveller Hub (destination-based recommendations); Notifications (governance/review/approval alerts).

**Product Owner Outcome:** **Approved**, with the architectural reconciliation against WS1 flagged in §0.2 for Archie before Stage 4 treats this module's FRs as ready to draft.

### 5.8 Notifications — Approved, Complete

**Vision.** Timely awareness of operational events and business conditions requiring attention — improving responsiveness by surfacing issues proactively rather than requiring manual discovery. Supports awareness, does not replace task management (`PO-REVIEW-08` §2).

**Business Purpose.** Provide timely operational awareness, highlight conditions requiring attention, reduce missed activities, support decision-making, improve responsiveness, and — explicitly — encourage Workspace Users to make the Workspace their primary operational environment (§3).

**Business Object — Notification.** A system-generated indication that a business condition exists; informational, never a record of work ownership.

- **Identity:** Notification ID, Notification Type, Source Module, Creation Date, Current State.
- **Context:** related business object, originating module, message, severity, timestamp.
- **Relationships:** may reference Traveller, Journey Planning Record, Journey, Vendor, Destination Profile, Task, Workspace User — without owning any of them.

**Product Owner Decisions:**

- **PD-NO-001 — System Generated.** Notifications are always system-generated; users cannot manually create them (manual reminders belong to Tasks).
- **PD-NO-002 — Separation from Tasks.** Notifications = awareness; Tasks = work — kept as separate capabilities.
- **PD-NO-003 — Notification Types.** Two categories: **Informational** (acknowledge-once-reviewed, e.g. Journey confirmed, Destination Profile approved, Vendor activated) and **Action Required** (stays active until the underlying condition resolves, e.g. outstanding traveller documents, overdue vendor quotation, approaching departure with incomplete readiness, a review awaiting approval).
- **PD-NO-004 — Resolution Behaviour.** A Notification does not disappear merely because it was viewed/acknowledged — it remains active until the underlying business condition is actually resolved. The Product Owner specifically rejected "dismiss without resolving" as undermining operational effectiveness.
- **PD-NO-005 — Workspace Awareness.** Notifications exist partly to drive daily engagement with the Workspace as the team's primary tool.

**Governance Decisions:** Notification (awareness) vs. Task (work) kept strictly separate Workspace-wide; condition-based lifecycle (viewing ≠ resolving); notification generation behaviour kept consistent across modules rather than left to per-module implementation.

**Functional Requirement Summary.** **24 Functional Requirements, all Must Have**, covering: notification generation, classification, Action Required handling, Informational handling, search/filtering, lifecycle, audit history, governance, operational visibility. The Product Owner specifically approved the condition-based (not view-based) resolution model. Existing baseline carries 4 FRs (`FR-WS-032`–`035`) plus the Open Question OQ-008 (delivery channels — in-Workspace vs. external); **OQ-008 is not addressed by `PO-REVIEW-08`** and remains open into Stage 4.

**Cross-Module Relationships:** Dashboard (outstanding-notification visibility); Journey Planning, Journey Workspace, Vendor Management, Destination Intelligence (each generates notifications for its own events); Settings (notification configuration).

**Product Owner Outcome:** **Approved**, with OQ-008 (delivery channel) still open — not resolved by this review, carried forward as-is.

### 5.9 Settings — Approved, Complete

**Vision.** The administrative and configuration capability required to operate the Workspace — authorised administrators manage organisational configuration; individual Workspace Users manage personal preferences without affecting the wider Workspace. Configurable business concepts stay configurable rather than requiring application changes (`PO-REVIEW-09` §2).

**Business Purpose.** Administer the Workspace, manage Workspace Users, maintain configurable business concepts, manage organisational and personal preferences, provide controlled administration (§3).

**Business Object — Workspace Configuration.** The organisational settings and configurable concepts governing Workspace operation; Personal User Preferences are maintained separately but remain part of this module.

- **Organisational configuration:** organisation settings, business configuration, configurable reference data, operational preferences, system defaults.
- **User administration:** Workspace User management, role assignment, permission management, user activation/deactivation.
- **Personal preferences:** profile information, password, profile photograph, appearance (Light/Dark Mode), personal Workspace preferences.
- **Audit:** administrative configuration changes are recorded for governance; personal preference updates stay associated with the individual user.

**Product Owner Decisions:**

- **PD-ST-001 — Configuration Over Code.** Business concepts expected to evolve should be managed through configuration wherever practical — approved explicitly to reduce future development effort and improve adaptability.
- **PD-ST-002 — Workspace Administration.** Authorised administrators manage Workspace Users, roles/permissions, business configuration, organisational preferences — under access control.
- **PD-ST-003 — Personal User Preferences.** Individual users manage their own preferences (password, photo, appearance, personal settings) with no effect on organisational configuration.
- **PD-ST-004 — Separation of Administration and Personal Preferences.** Organisation-wide configuration and individual configuration are kept as independent responsibilities.
- **PD-ST-005 — Administrator Managed Concepts.** Configurable business/reference data is administrator-managed rather than hard-coded.

**Governance Decisions:** controlled administration (only authorised administrators change organisation-wide configuration, independent of operational ownership); clean separation of organisation vs. user scope; configuration-driven behaviour as a stated architectural principle for future scalability.

**Functional Requirement Summary.** **21 Functional Requirements, all Must Have**, covering: Workspace administration, user management, role management, permission management, personal preferences, password management, profile management, configuration management, audit history, governance. This is a real scope increase over the existing baseline (`FR-WS-036`–`038`, 3 FRs limited to profile editing, viewing the user list, and queue-composition configuration) — the Product Owner specifically approved extending Settings to include full personal profile/preference management and user activation/deactivation, neither of which the existing Product Specification described.

**Cross-Module Relationships:** interacts with all eight other modules by providing shared or module-specific configuration (explicitly listed per-module in `PO-REVIEW-09` §8).

**Product Owner Outcome:** **Approved.**

---

## 6. Knowledge Architecture

**Now complete.** Traveller Hub, Destination Intelligence, Vendor Management and Itinerary Studio together form the Workspace's organisational knowledge model, each governing a different facet:

- **Traveller Hub** — who the traveller is (relationship history, preferences, timeline).
- **Destination Intelligence** — where the business operates (Destination Profiles, governed Draft→Review→Approved).
- **Vendor Management** — who the business operates through (supplier intelligence, performance history, Preferred Partner designation).
- **Itinerary Studio** — what the business has planned before and learned from (Master Itineraries, the Learning Repository, promotion of successful traveller itineraries).

All four now share the identical governance shape: organisationally owned (not individually owned), evolving through a recommend → review → approve pipeline, with history preserved rather than overwritten. This is a genuinely coherent model — the strongest piece of consistency to come out of this review round — and is worth stating explicitly as a named architectural pattern in the Product Specification update, rather than four separately-described modules that happen to resemble each other.

## 7. Operational Architecture

**Now complete.** Dashboard, Journey Planning, Journey Workspace and Notifications form the Workspace's day-to-day operational loop:

- **Journey Planning** owns commercial, pre-confirmation work (Phase 1).
- **Journey Workspace** owns confirmed, operational work (Phase 2) — cleanly split from Journey Planning per PD-JW-001/002, resolving OQ-005 and OQ-013 (§5.4).
- **Notifications** surfaces conditions from both (and from Vendor Management and Destination Intelligence) that need attention.
- **Dashboard** is the shared entry point summarising all of the above, plus Vendor Confirmations and Tasks.

The two-phase Journey lifecycle (Planning → Workspace) is now unambiguous: a Journey Planning Record and a Journey are two distinct objects with a one-way, Owner-driven conversion between them — not a single record whose stage crosses a boundary, as the original Product Specification had left open.

## 8. Governance Principles

Updated from v0.1 — every row is now Approved:

| Principle | Status | Source |
| --- | --- | --- |
| **Ownership** | Approved | Generic Ownership Model (Claim/Assign/Reassign), reaffirmed by Journey Planning §7 |
| **Lifecycle** | Approved | System-controlled, independent of Ownership/Designations, reaffirmed by every module |
| **Operational Flags / Designations** | Approved | Traveller Hub's Operational Flags + Vendor Management's Preferred Partner — now a named cross-module principle (§4.9) |
| **Configuration** | **Approved** (new) | Settings PD-ST-001/005 |
| **Knowledge Governance** | **Approved** (new) | Destination Intelligence PD-DI-002, Itinerary Studio PD-IS-007/008 |
| **Approval** | **Approved** (new) | Destination Intelligence's Recommendation→Review→Approval→Publication pipeline; Itinerary Studio's Administrator-approved promotion; Settings' controlled administration |
| **Historical Preservation** | **Approved workspace-wide** (was Traveller-only in v0.1) | Reaffirmed independently by Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence |

---

## 9. Product Decision Register

All decisions from v0.1 are carried forward unchanged (`PD-GEN-001`–`005`, `PD-DASH-001`–`003`, `PD-HUB-001`–`007`) and are not repeated here. New decisions from the seven newly-reviewed modules, using each source document's own identifiers:

**Journey Planning:** PD-JP-001 (One Planning Record Per Destination), PD-JP-002 (Proposal Versions), PD-JP-003 (Vendor Quotations Distinct), PD-JP-004 (Traveller Relationship — reference, not ownership), PD-JP-005 (Planning Lifecycle), PD-JP-006 (Planning Scope — flight preferences in, purpose-of-travel out), PD-JP-007 (Archive Behaviour — flagged, §5.3).

**Journey Workspace:** PD-JW-001 (Journey Creation — conversion-only, resolves OQ-013), PD-JW-002 (Operational Scope — Phase 2 only, resolves OQ-005), PD-JW-003 (Minor Journey Changes stay in-Journey), PD-JW-004 (Material Scope Changes require new planning), PD-JW-005 (Journey Completion outcomes), PD-JW-006 (Operational History permanence).

**Itinerary Studio:** PD-IS-001 (Organisational Ownership of Master Itineraries), PD-IS-002 (Reuse Over Recreation), PD-IS-003 (Traveller Personalisation via copy), PD-IS-004 (New Destinations — new Master Itinerary), PD-IS-005 (Continuous Learning / Learning Repository), PD-IS-006 (Version History), PD-IS-007 (Master Itinerary Governance), PD-IS-008 (Promotion of Successful Itineraries — Admin-approved).

**Vendor Management:** PD-VM-001 (Multi-Service Vendors), PD-VM-002 (Geographic Coverage), PD-VM-003 (Preferred Partner — not a lifecycle state), PD-VM-004 (Supplier Performance, internal-only), PD-VM-005 (Organisational Memory).

**Destination Intelligence:** PD-DI-001 (Organisational Ownership), PD-DI-002 (Governance Before Publication), PD-DI-003 (Profile Creation before commercial sale), PD-DI-004 (Lifecycle — Draft/Under Review/Approved, no Archived), PD-DI-005 (Supporting Media deferred), PD-DI-006 (Continuous Learning). **Flagged: this whole set requires Archie's review before Stage 4 (§0.2).**

**Notifications:** PD-NO-001 (System Generated only), PD-NO-002 (Separation from Tasks), PD-NO-003 (Notification Types — Informational / Action Required), PD-NO-004 (Resolution Behaviour — condition-based, not view-based), PD-NO-005 (Workspace Awareness / daily engagement intent).

**Settings:** PD-ST-001 (Configuration Over Code), PD-ST-002 (Workspace Administration scope), PD-ST-003 (Personal User Preferences), PD-ST-004 (Separation of Administration and Personal Preferences), PD-ST-005 (Administrator Managed Concepts).

Total: 5 cross-cutting + 3 Dashboard + 7 Traveller Hub + 7 Journey Planning + 6 Journey Workspace + 8 Itinerary Studio + 5 Vendor Management + 6 Destination Intelligence + 5 Notifications + 5 Settings = **57 Product Decisions**, all Approved.

---

## 10. Functional Requirement Summary

| Module | Existing baseline (RTM v1.0) | Approved total (this review) | Wording status |
| --- | --- | --- | --- |
| Dashboard | 6 | 6 confirmed + 2 new capabilities pending drafting | Partially drafted (v0.1) |
| Traveller Hub | 5 | 5 confirmed + 3 new capabilities pending drafting | Partially drafted (v0.1) |
| Journey Planning | 5 | **30** | Count + 12 topic groups only — individual FRs not drafted |
| Journey Workspace | 4 | **31** | Count + 12 topic groups only — individual FRs not drafted |
| Itinerary Studio | 4 | **36** | Count + 9 topic groups only — individual FRs not drafted; existing 4 need rewriting, not just extending (Master/Traveller Itinerary split) |
| Vendor Management | 4 | **30** | Count + 10 topic groups only — individual FRs not drafted |
| Destination Intelligence | 3 | **35** | Count + 10 topic groups only — individual FRs not drafted; existing 3 need rewriting (read-only assumption superseded, §5.7) |
| Notifications | 4 | **24** | Count + 9 topic groups only — individual FRs not drafted; OQ-008 still open |
| Settings | 3 | **21** | Count + 10 topic groups only — individual FRs not drafted; real scope increase over existing 3 |
| **Total** | **38** | **223** (11 partially drafted + 212 approved-by-count-only) | |

**This is the central Stage 3/4 dependency.** For seven of nine modules, the Product Owner Review approved a *count* and a set of *topic groups* per module, explicitly deferring the individual Functional Requirement wording to "the consolidation phase" (each `PO-REVIEW-0x` document's own words). That wording does not exist yet anywhere in the supplied evidence. Stage 4 cannot simply "add the approved FRs" for these seven modules — someone has to draft roughly 195 individual requirement statements (223 minus the 5+4+11+... already-drafted baseline, more precisely 212 net-new) within the approved counts and topic groups, and that drafting work has not been authorised or scoped by any of the documents supplied so far. This is spelled out in full in the companion Impact Assessment, with a recommendation on how to sequence it.

---

## 11. Product Owner Review Summary

**Major product improvements:** the Master Itinerary / Learning Repository model (Itinerary Studio) and the Destination Profile governance model (Destination Intelligence) both turn what were previously static reference objects into actively-curated organisational knowledge with a real review/approval workflow — a materially stronger vision than the original Product Specification's "read-only reference" framing for either. The Journey Planning / Journey Workspace split is now unambiguous, closing two long-standing Open Questions (OQ-005, OQ-013) with a clean answer rather than leaving them for Archie to guess at.

**Major governance improvements:** "Configuration over code" and "Notifications = awareness, Tasks = work" are now first-class, Product Owner-approved principles rather than untested headings. Historical preservation is now explicitly approved at the Workspace level, not module-by-module. The Preferred Partner / Operational Flag pattern is now visibly a reusable Workspace concept, not a one-off Traveller Hub feature.

**Major architectural implications (for Archie, not decided here):** the Destination Profile governance model's relationship to the already-built WS1 Bootstrap Generator/Travel Region pipeline (§0.2); the Master Itinerary data-model shift from one-Itinerary-per-Journey to a shared/derived model; the Vendor lifecycle terminology (Inactive vs. the existing Deactivated).

---

## 12. Handover to Product Specification

Per Tiger's explicit instruction, this document does **not** trigger any Product Specification or RTM change on its own. It is the complete input for Stage 4 (`EBC-R1.3-WS3-004`), which proceeds only after the companion Impact Assessment is reviewed and approved. That assessment enumerates, section by section, what changes in the Product Specification and RTM, including the FR-drafting dependency in §10 above and the architecture flag in §0.2.

## 13. Handover to Tiger

This document is ready for the Delivery Governance Consistency Review (Stage 2), which is delivered as a companion document alongside this one rather than folded into it, per the instruction that Stage 2 is a distinct activity from completing the baseline. Three items need a decision before Stage 4 can proceed cleanly:

1. Whether Destination Intelligence's approved governance model is compatible with, or needs to be reconciled against, the already-built WS1 Destination Intelligence Evolution architecture (Archie's call, §0.2).
2. Who drafts the ~212 net-new individual Functional Requirements implied by the approved counts, and under what review process (Tiger's sequencing call, §10).
3. The Journey Planning "never deleted" vs. existing Admin-permanent-delete rule interaction (§5.3, PD-JP-007) — a small item, but worth a one-line confirmation before Stage 4.

## 14. Final Validation

- [x] All nine modules present and Approved.
- [x] Every Product Decision traced to its source document and ID — no decision invented or reworded beyond organisational framing.
- [x] Terminology consistency checked across all nine modules — two genuine gaps found and flagged rather than silently harmonised (Vendor lifecycle wording, §5.6; Journey Planning archive/delete interaction, §5.3).
- [x] Cross-module relationships cross-checked against each module's own "Cross Module Relationships" section — consistent, no contradictions found.
- [x] Knowledge Architecture (§6) and Operational Architecture (§7) completed now that all dependent modules are reviewed.
- [x] No FR wording invented for the seven newly-reviewed modules — counts and topic groups only, exactly as the source documents state them.
- [x] The one material architecture question (Destination Intelligence vs. WS1) is flagged for Archie, not silently resolved either way.

## 15. Open Items for Tiger / Product Owner / Archie

1. Destination Intelligence governance model vs. WS1 architecture (§0.2, §5.7) — **Archie**.
2. FR-drafting ownership and process for ~212 net-new requirements (§10) — **Tiger**.
3. Journey Planning archive vs. Admin permanent-delete interaction (§5.3) — **Product Owner**.
4. Vendor lifecycle terminology: "Inactive" (new) vs. "Deactivated" (existing Product Specification) — **Arjun to harmonise at Stage 4, flagged here for visibility**.
5. Notifications delivery channel (OQ-008) remains open — not addressed by this review round.

---

## 16. Files Changed

- `docs/02-Product/WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` — updated in place, v0.1 → v1.0 (this document).
- `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md` through `PO-REVIEW-09-Settings.md`, and `docs/02-Product/reviews/README.md` — supplied by Tiger, already present in the repository; reviewed and consolidated, not modified.

No Product Specification or RTM file is created, modified, or deleted by this document.

---

## 17. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v0.1 | 13-Sep-2026 | Arjun | `EBC-R1.3-WS3-004A` | Initial partial baseline — Phase 1/2, Dashboard, Traveller Hub only; remaining seven modules explicitly Not Yet Reviewed. |
| v1.0 | 13-Sep-2026 | Arjun | `EBC-R1.3-WS3-004B` | Complete baseline — all nine modules incorporated from the supplied `PO-REVIEW-03`–`09` documents. Knowledge Architecture and Operational Architecture sections completed. 40 new Product Decisions added (57 total). One material architecture flag raised (Destination Intelligence vs. WS1) and two terminology/interaction gaps flagged for Stage 2/4. FR Functional Requirement Summary updated to reflect 223 total approved FRs, of which ~212 are approved by count/topic-group only and not yet drafted — identified as the central Stage 4 dependency. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004A`/`004B`. It is the complete Release 1.3 Product Owner Review Baseline. It is evidence, not itself the Product Specification or RTM — Stage 4 consolidation proceeds only after the companion Delivery Governance Consistency Review and Impact Assessment are reviewed.*
