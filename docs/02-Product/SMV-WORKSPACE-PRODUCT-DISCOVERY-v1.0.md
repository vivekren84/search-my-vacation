# Search My Vacation — SMV Workspace: Product Discovery Capture

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v1.1 |
| **Status** | Discovery capture — approved Product Owner decisions from workshop discussion, confirmed as final and permanently associated with `FEAT-R1.3-013` (SMV Workspace) by Product Owner decision `DEC-R1.3-005`; not yet a full Product Specification |
| **Owner** | Tiger, on behalf of Team Satvi (reconciliation) — content authored by the Product Owner during discovery workshops |
| **Last updated** | 09 September 2026 |
| **Purpose** | Reconcile the Product Owner's Product Discovery workshop decisions for the SMV Workspace into a durable repository record, so that Arjun's Product Specification work begins from approved decisions rather than conversational context. |
| **Prepared under** | `EBC-R1.3-RM-002` (Product Discovery Documentation Reconciliation) |
| **Related** | `docs/10-Backlog/RELEASE-1.3.md` Section 7 (Product Decision Log) and Section 15 (Feature Register) · `docs/00-Project-Compass/GLOSSARY.md` · `docs/02-Product/PRODUCT-ROADMAP.md` |

> **Audience:** Arjun (Product Specification), Archie (Architecture), Sophie (UX), Rad (Engineering), Tiger (Delivery), and the Product Owner.

---

## 2. Naming Note — Resolved by Product Owner Decision

`EBC-R1.3-RM-002`'s own Objective named this discovery as covering "Customer Identity & Member Experience," but every decision captured below describes an internal, staff-facing operational platform — Administrators and Privilege Users, Journey Planning/Delivery queues, Vendor Confirmations, Traveller Hub, Itinerary Studio. This mismatch was flagged (not silently resolved) when this document was first filed.

**Resolved 09-Sep-2026 (Product Owner decision, `DEC-R1.3-005` in `RELEASE-1.3.md` Section 7):** this document is correctly classified as the SMV Workspace discovery capture and remains permanently associated with `RELEASE-1.3.md` Section 15's `FEAT-R1.3-013`, which has been renamed from "Team Member Portal" to **SMV Workspace** to match this agreed product vision. `FEAT-R1.3-007` (Customer Identity & Member Experience) remains a fully separate feature, requiring its own dedicated Product Discovery workshop focused exclusively on the customer-facing experience — no content from this document applies to it, and none has been moved.

---

## 3. Scope of This Document

This is a **discovery capture**, not a Product Specification. It records, at the level of detail the discovery workshop reached, the decisions the Product Owner made about the SMV Workspace. Per `EBC-R1.3-RM-002`'s own instruction, it documents only what reached consensus; it does not invent missing requirement detail. Where the workshop named a concept but did not go on to define its full behaviour (for example, the specific capabilities of each user role, or the full definition of each business rule), that gap is recorded explicitly in Section 8 (Not Yet Captured) rather than filled in here. Closing those gaps is Arjun's Product Specification work, not this reconciliation's.

---

## 4. Workspace Vision

The SMV Workspace is the operational platform for Search My Vacation — the internal system through which the Search My Vacation team plans, delivers and manages traveller journeys, day to day.

**Guiding principles, as agreed:**

- **Single operational workspace** — one platform for the team's day-to-day operational work, rather than work spread across disconnected tools.
- **Daily decision support** — the Workspace should actively support the decisions the team needs to make each day, not just store records.
- **Single source of truth** — operational data (leads, journeys, vendors, bookings, tasks) lives in one authoritative place.
- **Team collaboration** — the Workspace supports the team working together on shared operational work, not just individual record-keeping.
- **Operational visibility** — the state of the business's operational work should be visible to the people who need to see it.

---

## 5. User Model

Two roles are agreed:

- **Administrator**
- **Privilege User**

The discovery workshop distinguished these two roles and agreed that Administrators hold capabilities that Privilege Users do not. **The specific list of agreed capabilities per role, and the specific list of Admin-only capabilities, were not included in the material available for this reconciliation** — see Section 8 (Not Yet Captured). Recording the two-role model here as the agreed structure; the capability detail within it is Arjun's Product Specification work.

---

## 6. Dashboard Philosophy

The Workspace dashboard is agreed to be:

- **Business-first** — organised around business priorities, not system structure.
- **Operationally prioritising** — surfaces what matters most right now, not everything at once.
- Built around a **My Work / Team toggle** — a user can switch between their own work and the team's.
- Composed of **dashboard cards rather than cluttered tables** — a visual, scannable presentation rather than dense tabular data.

The dashboard is agreed to answer three questions:

1. What needs attention?
2. Who owns it?
3. What's the next best action?

---

## 7. Operational Queues

Operational Queues are agreed as a foundational UX principle of the Workspace — the primary way operational work is organised and surfaced to the team.

Agreed example queues:

- Journey Planning
- Active Journeys
- Vendor Confirmations
- Tasks
- Follow-ups

The full set of queues, their exact composition, and their relationship to the Journey Lifecycle (Section 8) and Business Objects (Section 9) below are Product Specification work, not decided at this discovery level.

---

## 8. Journey Lifecycle

The Journey Lifecycle is agreed to have two phases:

- **Phase 1 — Journey Planning**
- **Phase 2 — Journey Delivery**

No further breakdown of stages within each phase was included in the material available for this reconciliation — see Section 10 (Not Yet Captured).

---

## 9. Business Objects

The following business vocabulary is agreed as the Workspace's core object model:

- Lead
- Traveller
- Journey Planning
- Journey
- Journey Passport
- Itinerary
- Vendor
- Quotation
- Booking
- Task
- Follow-up
- Notification
- Document

**Note:** `Journey Passport` here refers to the same product concept already defined in `docs/02-Product/JOURNEY-PASSPORT-v1.0.md` — this is the Workspace-side (internal, operational) view of that same object, not a redefinition of it. This vocabulary list is not yet reconciled against `docs/00-Project-Compass/GLOSSARY.md`; doing so is recommended as a follow-up (Section 11), not performed here, as it was not part of this EBC's Deliverables.

Definitions of each object (fields, relationships, states) are Product Specification work, not decided at this discovery level.

---

## 10. Business Rules

The following business rules are agreed by name/label. Their full behavioural definition is Product Specification work — recording the rule names here as the agreed, named decisions the workshop reached:

- **Mobile number matching**
- **Claim ownership**
- **Action-driven workflow**
- **System-controlled statuses**
- **Archive before delete**
- **Admin permanent delete**
- **Hybrid task creation**
- **Structured follow-ups**

---

## 11. MVP Scope (Release 1.3)

The agreed Release 1.3 MVP modules for the SMV Workspace:

- Dashboard
- Traveller Hub
- Journey Planning
- Journey Workspace
- Itinerary Studio
- Destination Intelligence
- Vendor Management
- Notifications
- Basic Settings

**Deferred capabilities:** no specific list of deferred capabilities was included in the material available for this reconciliation — see Section 12 (Not Yet Captured). Nothing outside the nine modules above should be assumed to be either in-scope or explicitly deferred; that determination is Product Specification / Tiger sequencing work.

---

## 12. Not Yet Captured — Gaps for Arjun's Product Specification

Per `EBC-R1.3-RM-002`'s own instruction not to invent missing requirement detail, the following were referenced by the discovery card but their content was not included in the material available for this reconciliation. These are flagged here rather than filled in, so Arjun's Product Specification starts from an honest baseline:

| Gap | What was asked for | What is recorded here instead |
|---|---|---|
| User Model capabilities | "Record agreed capabilities" and "Record Admin-only capabilities" for the two roles | Only the two role names (Administrator, Privilege User) and the fact that Admin holds capabilities Privilege User does not |
| Journey Lifecycle detail | "Include the agreed lifecycle" | Only the two phase names (Journey Planning, Journey Delivery) — no stage-level breakdown within each phase |
| Business Object definitions | Implied by capturing "the approved business vocabulary" | Only the 13 object names — no field, relationship or state definitions |
| Business Rule definitions | Implied by capturing the 8 named rules | Only the 8 rule names/labels — no behavioural definition of what each rule actually enforces |
| MVP deferred capabilities | "Clearly distinguish deferred capabilities" | Only the 9 in-scope MVP modules — no explicit deferred list was provided |

None of these gaps block filing this discovery capture — the EBC's own purpose is to give Arjun an approved starting point, not a complete specification. They should be closed during Arjun's Product Specification, not silently inferred here.

---

## 13. Traceability and Follow-Up Recommendations

- **Feature Register:** confirmed. `RELEASE-1.3.md` Section 15's `FEAT-R1.3-013` (renamed SMV Workspace, per `DEC-R1.3-005`) is this discovery capture's permanent home; `FEAT-R1.3-007` (Customer Identity & Member Experience) is confirmed unrelated — see Section 2 above.
- **Product Decision Log:** this discovery capture is recorded as `DEC-R1.3-004`; its Feature Register resolution is recorded as `DEC-R1.3-005` — both in `RELEASE-1.3.md` Section 7.
- **Glossary reconciliation (recommended, not performed here):** the Business Objects list in Section 9 should eventually be reconciled against `docs/00-Project-Compass/GLOSSARY.md` so the project maintains one vocabulary, not two.
- **Next step:** Arjun's Product Specification, closing the five gaps in Section 12 as refinement items — per the Product Owner's explicit decision (`DEC-R1.3-005`), these gaps are not grounds to reopen Product Discovery — before any Archie architecture review or Sophie UX work begins (per the standard Team Satvi delivery lifecycle, Project Instructions Section 12).

---

## 14. Revision History

| Version | Date | Author | EBC | Summary |
|---|---|---|---|---|
| v1.0 | 09-Sep-2026 | Tiger | `EBC-R1.3-RM-002` | Initial creation. Captures the Product Owner's Product Discovery workshop decisions for the SMV Workspace: vision, user model (partial), dashboard philosophy, operational queues, journey lifecycle (partial), business objects, business rules (named only), and MVP scope. Flags the Customer Identity & Member Experience / Team Member Portal naming discrepancy and five specific content gaps rather than inventing them. Documentation only. |
| v1.1 | 09-Sep-2026 | Tiger | (Product Owner decision, `DEC-R1.3-005`) | Resolved the naming discrepancy flagged in v1.0: confirmed this document's permanent association with `FEAT-R1.3-013`, renamed to SMV Workspace; confirmed `FEAT-R1.3-007` fully separate and unaffected. Confirmed the five gaps in Section 12 are Arjun Product Specification refinement items, not grounds to reopen discovery. Documentation only. |

---

*This document is maintained by Tiger, Programme and Delivery Lead, on behalf of Team Satvi, reconciling Product Owner decisions from Product Discovery workshops.*
