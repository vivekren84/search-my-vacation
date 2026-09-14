# Workspace UX Discovery

| Document Information | |
|---|---|
| Document Name | Workspace UX Discovery |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Reviewers | Vivek (Product Owner), Tiger (Delivery), Arjun (Business Analysis) |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 — Journey Workspace UX Architecture & Experience Discovery |
| Last Updated | 14 September 2026 |
| Related Documents | Journey Workspace Business Lifecycle v1.0; Journey Workspace UX Design Brief v1.0; SMV Workspace Product Specification v2.0; SMV Workspace Requirements Traceability Matrix v2.0; RELEASE-1.3-PRODUCT-BASELINE.md; PO-REVIEW-03 through PO-REVIEW-09 |
| Repository Baseline | Repository state reviewed prior to UX Architecture commencement |

---

## 1. Purpose

This document is the first deliverable of EBC-R1.3-WS4-001. It demonstrates Sophie's understanding of Journey Workspace — its business intent, its users, its lifecycle, its core objects, and the UX goals and constraints that govern the UX Architecture phase — before any information architecture, navigation or interaction design work begins.

This document does not introduce new business decisions. Every statement below traces to the Journey Workspace Business Lifecycle, the Journey Workspace UX Design Brief, the SMV Workspace Product Specification v2.0, the Requirements Traceability Matrix v2.0, or the nine `PO-REVIEW-0X` module review notes. Where this document must make a UX-level judgement call to reconcile two source documents, that judgement is disclosed explicitly in Section 9 (Assumptions) rather than applied silently.

## 2. Repository Review Completed

Per this EBC's Repository First Principle, the following were read in full before this document was drafted:

- `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`
- `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md`
- `docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md`
- `docs/02-Product/reviews/README.md` and `PO-REVIEW-03-Journey-Planning.md` through `PO-REVIEW-09-Settings.md`
- `docs/02-Product/workspace/JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`
- `docs/02-Product/workspace/JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md`
- `docs/10-Backlog/RELEASE-1.3.md` (Section 5 WS11 row, Section 7 Product Decision Log entries DEC-R1.3-004/005/006, Section 15 FEAT-R1.3-013)
- `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` (FEAT-R1.3-013 entry)

No architecture, engineering or implementation documentation was reviewed, consistent with this EBC's Out of Scope instruction.

## 3. Understanding of Journey Workspace

Journey Workspace is the operational platform through which the Search My Vacation team plans, delivers and manages traveller journeys day to day. It is not a traditional CRM and not a booking-management tool; it is the operational centre of the business — the single place where every traveller relationship is managed from first enquiry through planning, delivery and future travel opportunities.

The Business Lifecycle document frames this at the business-truth level around two core objects, **Inquiry** and **Journey**. The Product Specification expresses the same lifecycle in more granular, data-model terms: **Lead** (the raw external interaction) matures into a **Journey Planning Record** (one Traveller planning one destination or region), which — only on traveller acceptance of a proposal — converts into a **Journey** (a confirmed, operational commitment). Section 9 (Assumptions) records how this UX Architecture reconciles the two vocabularies.

The Workspace's nine approved MVP modules (Dashboard, Traveller Hub, Journey Planning, Journey Workspace, Itinerary Studio, Destination Intelligence, Vendor Management, Notifications, Settings) fall into two governance patterns the Product Specification names explicitly (§8):

- **Operational Architecture** — Dashboard, Journey Planning, Journey Workspace and Notifications form the day-to-day operational loop: Journey Planning owns pre-confirmation commercial work, Journey Workspace owns confirmed operational work, Notifications surfaces conditions needing attention from across the Workspace, and Dashboard is the shared entry point.
- **Knowledge Architecture** — Traveller Hub, Destination Intelligence, Vendor Management and Itinerary Studio form the Workspace's organisational memory: who the traveller is, where the business operates, who it operates through, and what it has planned and learned before. All four share a recommend → review → approve governance shape with preserved history.

Settings sits outside both patterns as the administrative/configuration layer serving all eight other modules.

## 4. Business Objectives

Directly from the Business Lifecycle (§2) and UX Design Brief (§2–§3):

- Provide a single, unified environment for managing every traveller relationship from first enquiry through planning, journey execution and future travel opportunities.
- Give the team daily decision support, not just record storage.
- Establish operational data (leads, journeys, vendors, bookings, tasks) in one authoritative place.
- Support the team collaborating on shared operational work rather than working in disconnected tools.
- Make the state of the business's operational work visible to the people who need to see it.
- Enable Workspace Users to confidently create exceptional traveller experiences — not simply to manage travel enquiries.

## 5. Primary Workspace Users

The Product Specification confirms a two-role user model for Release 1.3 MVP: **Administrator** and **Privilege User**, both referred to generically as **Workspace User** throughout the Business Lifecycle, UX Design Brief and all nine PO Review documents.

**Open item, disclosed rather than assumed:** the detailed capability split between Administrator and Privilege User (Open Question OQ-001) was not addressed by the Product Owner Review and remains open in both the Specification (v2.0 §4) and the RTM (v2.0 §9).

Accordingly, this UX Architecture is designed around the generic **Workspace User**, with Administrator and Privilege User representing the initial Release 1.3 role implementations.

Administrator-only capabilities explicitly identified within the Product Specification (such as Destination Profile approval, Workspace Configuration, user activation/deactivation, Master Itinerary promotion and Vendor lifecycle administration) are preserved. All remaining capabilities are treated as **Role TBC (OQ-001)** until the Product Owner formally approves a detailed role-capability model.

The UX Architecture intentionally adopts a **role-capability driven approach** rather than hard-coding assumptions around the current Release 1.3 role model. This allows future Workspace User roles to be introduced without requiring fundamental changes to the Workspace Information Architecture.

## 6. Business Lifecycle

The approved high-level business lifecycle (Business Lifecycle §5):

```
External Interaction → Inquiry → Qualification → Proposal Creation → Traveller Decision
                                                                          │
                                                        ┌─────────────────┴─────────────────┐
                                                     Accepted                          Not Accepted
                                                        │                                    │
                                                        ▼                                    ▼
                                                 Journey Created                Inquiry Closed / Lost / On Hold
                                                        │
                                                        ▼
                                    Planning → Operations → Travel → Journey Completion
                                                        │
                                                        ▼
                                        Future Traveller Relationship
```

The Product Specification's Phase 1 (Journey Planning) lifecycle, PD-JP-005, gives this the same shape at a finer grain — **Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed (Confirmed / Lost / Archived)** — and is the Product-Owner-approved stage list this UX Architecture uses for Journey Planning's queue and stage model.

Phase 2 (Journey Workspace / Delivery) has confirmed completion outcomes (Successfully Completed, Cancelled, Archived — PD-JW-005) but no Product-Owner-approved granular stage breakdown; the Specification carries an illustrative six-stage Phase 2 model (Booking Confirmed → Vendor Confirmation in Progress → Pre-Departure Ready → In-Journey → Post-Journey Follow-up → Closed) as **Proposed (Arjun)**, not yet confirmed. This UX Architecture treats that illustrative breakdown as a working design assumption for Phase 2 stage visualisation (Section 9, A-UX-03), pending Product Owner confirmation.

## 7. Core Business Objects

| Object | Definition | Source |
|---|---|---|
| Inquiry / Lead | The entry point for every external interaction, regardless of source (Journey Passport, website, WhatsApp, phone, email, walk-in, returning traveller, manual entry, vendor referral). | Business Lifecycle §4; Specification §7.1 |
| Journey Planning Record | One Traveller planning one destination or destination region — the working record from claim through conversion or closure. Owns Proposal Versions, Vendor Quotations, Discovery Notes, Follow-ups, Tasks. | Specification §7.3, PO-REVIEW-03 |
| Journey | A commercially confirmed travel commitment, created only by converting a Journey Planning Record. Covers Phase 2 (Delivery) only. | Specification §7.4, PO-REVIEW-04 |
| Traveller | The person(s) travelling; owned by Traveller Hub, referenced (not owned) by Journey Planning and Journey. | Specification §7.2 |
| Master Itinerary / Traveller Itinerary | Organisational reusable itinerary knowledge, and its personalised copy for one Journey Planning Record/Journey. | Specification §7.6/§7.6a, PO-REVIEW-05 |
| Destination Profile | The organisation's governed destination knowledge, progressed Draft → Under Review → Approved. | Specification §7.14, PO-REVIEW-07 |
| Vendor | An external supplier, lifecycle Prospective → Active → Inactive, with an independent Preferred Partner designation. | Specification §7.7, PO-REVIEW-06 |
| Notification | A system-generated indication of a business condition — Informational (acknowledge once reviewed) or Action Required (active until the condition resolves). | Specification §7.12, PO-REVIEW-08 |
| Workspace Configuration / Personal Preferences | Organisation-wide configuration vs. an individual Workspace User's own settings — kept fully independent. | Specification §7.15/§7.16, PO-REVIEW-09 |
| Task / Follow-up / Document / Booking | Supporting operational objects, unchanged from the Specification's v1.0 baseline. | Specification §7.9–§7.11, §7.13 |

## 8. UX Goals

Drawn directly from the UX Design Brief (§3–§4, §10):

- Help Workspace Users understand what requires attention, know what to do next, complete work efficiently, remain focused, and feel confident nothing important has been missed.
- Create three distinct emotional moments: **organised, informed, inspired** at login; **focused, productive, supported, in control** while working; **satisfied, relaxed, confident** at logout.
- Make the Workspace continuously answer "what should I do next?" without requiring unnecessary searching.
- Never feel noisy, cluttered or overwhelming.

## 9. Design Principles

As named in the UX Design Brief (§6), each of which is applied consistently across the deliverables produced under this EBC:

- **Journey First** — navigation and information architecture revolve around active Journeys once a traveller commits.
- **Inquiry First** — every new piece of work enters as an Inquiry/Lead; the Workspace supports natural progression to a Journey without forcing unnecessary steps.
- **Progressive Disclosure** — show only what the current task needs; allow deeper exploration on demand.
- **Action Before Analytics** — prioritise actionable work over reporting.
- **Calm by Design** — whitespace, hierarchy and simplicity reduce cognitive load.
- **Consistency** — navigation, terminology and interaction patterns repeat identically across modules.

## 10. Assumptions

Disclosed UX-level judgement calls this Discovery relies on, none of which alter approved business rules or lifecycle:

- **A-UX-01 — Inquiry, Journey Planning Record and Journey progression.** The Business Lifecycle document intentionally describes the Workspace at a business level, whereas the Product Specification defines a more detailed business object model.
For UX purposes, these concepts are presented as a continuous business progression rather than independent, unrelated entities.

```
External Interaction
        ↓
     Inquiry
        ↓
Journey Planning Record
        ↓
      Journey
```

The Inquiry represents work entering Search My Vacation.
The Journey Planning Record represents qualified work progressing through traveller discovery, itinerary planning and proposal management.
Only after traveller acceptance does a Journey become the primary operational business object.
The UX Architecture shall present this progression naturally while preserving the underlying business semantics defined within the Product Specification and Business Lifecycle.
This is a presentation-layer interpretation only and does not modify the approved business model.
- **A-UX-02 — Business Rule numbering collision.** The Business Lifecycle document defines its own BR-001 through BR-006 (Entry Point, Inquiry Ownership, Proposal Ownership, Journey Creation, Inquiry Outcomes, Journey Ownership), which are business-narrative restatements, not the same rules as the Specification/RTM's BR-001 through BR-019 (Mobile number matching, Claim ownership, Reassignment, etc.) — the two documents use the same ID scheme for different content. This UX Architecture and its successor deliverables cite Business Rules by the **Specification/RTM's BR-0XX numbering** for traceability, and refer to the Business Lifecycle's rules by name only, to avoid conflating the two registers. Flagged for Tiger/Arjun as a documentation-governance item, not resolved here.
- **A-UX-03 — Phase 2 (Journey Workspace) stage visualisation.** Pending Product Owner confirmation of Phase 2's granular stage breakdown (Open Question OQ-004, partially open), this UX Architecture uses the Specification's illustrative six-stage model (Booking Confirmed → Vendor Confirmation in Progress → Pre-Departure Ready → In-Journey → Post-Journey Follow-up → Closed) as a working design reference for the Journey Workspace screen hierarchy and interaction flows, clearly labelled as provisional wherever it appears.
- **A-UX-04 — Generic Ownership Model scope.** Per Open Question OQ-022, this UX Architecture assumes Claim/Assign/Reassign applies uniformly to Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence records, consistent with §8.1 of the Specification, pending Archie/Product Owner confirmation.
- **A-UX-05 — Role boundaries.** Where a screen or action's Administrator/Privilege User boundary is not confirmed (OQ-001), this UX Architecture marks it **Role TBC** rather than assigning a boundary.

## 11. Risks

- **R-UX-01 — Undrafted Functional Requirements (OQ-018).** ~185 of the 223 approved Functional Requirements exist only as approved topic groups, not drafted wording. This UX Architecture designs to the module Vision, Business Purpose and named topic groups; where a specific interaction cannot be confirmed against a drafted FR, it is designed conservatively and flagged for revisit once FR wording exists.
- **R-UX-02 — Destination Intelligence architecture reconciliation (OQ-019).** The Destination Profile's Workspace-authoring model has not been reconciled with the existing WS1 Bootstrap Generator/`geo_places` pipeline. This UX Architecture designs Destination Intelligence's Workspace-facing screens (Draft/Under Review/Approved authoring and governance) without assuming a specific technical implementation; Archie's reconciliation may affect underlying data flow but should not change the approved governance-lifecycle UX.
- **R-UX-03 — Quotation / Proposal Version terminology (OQ-020).** This UX Architecture treats "Proposal Version" (traveller-facing, created by Search My Vacation) and "Vendor Quotation" (commercial information from vendors) as the two distinct concepts the Product Owner Review approved, and does not use the legacy "Quotation" object name in any new UX artefact.
- **R-UX-04 — Master/Traveller Itinerary UX notation (OQ-021).** No existing UX or data-model notation covers a parent/derived object pair. This UX Architecture introduces a plain-language "based on [Master Itinerary]" treatment for Traveller Itineraries rather than inventing new notation ahead of Archie's decision.

## 12. Opportunities

- The two governance patterns already named by the Product Specification (Operational Architecture, Knowledge Architecture) give this UX Architecture a ready-made, business-approved basis for the Workspace's top-level navigation grouping (Section 2 of the companion Information Architecture document).
- The consistent Claim/Assign/Reassign ownership model and the consistent Informational/Action Required notification model mean the same interaction pattern can be reused across every operational queue and every module's notifications, directly serving the UX Design Brief's Consistency principle.
- The Notification model's explicit condition-based resolution (never resolved by viewing alone) gives the Dashboard a natural, business-approved definition of "what needs attention" without inventing a new prioritisation model.

## 13. UX Success Measures

The success of the Journey Workspace UX should be measured by the quality of the Workspace User's daily experience rather than the visual appearance of individual screens.

The UX Architecture shall be considered successful if it enables Workspace Users to:

- Immediately understand the current state of their work when logging in.
- Clearly identify what requires attention without unnecessary searching.
- Progress naturally from Inquiry through Journey without confusion.
- Navigate confidently with minimal learning effort.
- Easily distinguish operational work from organisational knowledge.
- Feel organised and in control throughout the working day.
- Complete their work with confidence that travellers are well supported.
- Finish the day feeling satisfied that nothing important has been missed.

These measures represent the Product Owner's desired experience outcomes and should guide all subsequent UX decisions.

## 14. Readiness to Proceed

This Discovery confirms the prerequisites in Project Instructions §16.4 are met: approved product intent (Specification v2.0, Product Owner Review), target Workspace User (Administrator/Privilege User, role split open), target journeys (Business Lifecycle §5, the seven end-to-end journeys required by this EBC), applicable brand guidance (existing SMV brand system, unchanged for this internal tool per Project Instructions §23), existing design patterns (none yet built for Journey Workspace specifically — this is greenfield UX), required breakpoints (desktop-first per UX Design Brief §9, responsive behaviour considered), content/imagery readiness (not applicable — Journey Workspace is data-driven, not editorial), and accessibility expectations (existing interactive-control/keyboard/reduced-motion standard, NFR-WS-006). The UX Architecture phase (Sections 2 onward of the companion deliverables) may proceed.

---

*Prepared by Sophie (UX, UI and Frontend Experience Specialist) on behalf of Team Satvi.*
*This document represents the UX understanding phase of Journey Workspace and establishes the foundation for the subsequent Information Architecture, Navigation Model, User Journeys, Interaction Flows and Screen Inventory deliverables.*

*Status: Approved with Product Owner Review Comments.*
