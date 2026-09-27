# EBC-R1.3-WS13-001 — Journey Workspace Product Discovery & Business Analysis

**Persona:** Arjun, Product and Business Analyst
**Release:** 1.3
**Workstream:** WS13, Journey Workspace
**Feature:** `FEAT-R1.3-013`, SMV Workspace
**Phase:** Product Discovery & Business Analysis. **Revision 3** is the current Product Owner–ratified baseline (Revision 2 plus the post-architecture Product Owner decisions POD-01 to POD-06).
**Date:** 24 September 2026 (Revision 1); 24 September 2026 (Revision 2, `EBC-R1.3-WS13-001B`); 26 September 2026 (Revision 3, `EBC-R1.3-WS13-003A`)
**Status:** **Revision 3: Product Baseline synchronised with the post-architecture Product Owner decisions POD-01 to POD-08 and the Architecture Clarification decisions PD-A to PD-E and O-A2 to O-A5 (`EBC-R1.3-WS13-004A`) (`EBC-R1.3-WS13-003A`, authorised synchronisation of the frozen WS13 Product Baseline). No new scope. Awaiting Tiger's validation before Engineering Planning (`EBC-R1.3-WS13-004`).**

---

**Document Revision History**

| Revision | Date | Trigger | Change |
|---|---|---|---|
| 1 | 24-Sep-2026 | `EBC-R1.3-WS13-001` | Initial discovery and business analysis. The proposed lifecycle, `FR-JW-05`–`34`, `BR-025`–`036` and decisions `D-01`–`D-13` were submitted for Product Owner review. |
| 2 | 24-Sep-2026 | `EBC-R1.3-WS13-001B`: Product Owner Review decision record for D-01 to D-13 (all approved, several refined) | Synchronises the approved decisions into §1, §6, §7, §9, §10, §11, §12–§19, §23 and §26–§28. Journey lifecycle replaced (D-01). Confirmed-travel-date gate moved to conversion (D-02). Ownership always inherited, with no unassigned Journeys (D-03). Readiness Templates made configuration-driven (D-04). Alerts made configurable, now covering payment reminders and follow-ups (D-05). Operational-versus-material change boundary defined (D-06). Vendor Booking lifecycle added (D-07). Archive redefined as an administrative state (D-08). Dashboard purpose defined and "Create Journey" removed (D-09). Document Readiness scope set (D-10). `FR-JW-32`–`34` approved (D-11). Primary Operational Contact introduced (D-12). **Superseded** outcome added for material replacement (D-13). New rules `BR-037`–`BR-042`. No existing FR or BR identifier is renumbered. Replaced Revision 1 text is kept in **Appendix A** for traceability, following the project's supersede-not-delete convention. |
| 3 | 26-Sep-2026 | `EBC-R1.3-WS13-003A`: Product Owner decisions POD-01 to POD-06, taken after Architecture Validation (`EBC-R1.3-WS13-003`), and POD-07 and POD-08 from Tiger's validation checkpoint. **Final WS13 synchronisation, 27-Sep-2026:** Product Owner decisions PD-A to PD-E and O-A2 to O-A5 approved during the Architecture Clarification (`EBC-R1.3-WS13-004A`) | Synchronisation only; no new scope. Readiness framework clarified: Mandatory and Optional items, Not Applicable on permitted items, readiness calculated and never stored (POD-01). Primary Service Category and its reference list added (POD-02). Document Types defined as reference data; the Journey object "Document Requirement" becomes **Journey Document** (POD-03). Change Categories added as classification only (POD-04). Vendor baseline recorded in the canonical Vendor object (Spec v2.0 §20; POD-05); the Vendor Booking field "service category" renamed **service type** to avoid a clash with POD-02. Conversion and replacement policies added (POD-06). Service Category operational behaviour: optional in planning, mandatory at conversion, editable afterwards with history, never a Replacement Journey (POD-07). Template change retains manual items and recalculates template items; Archived Journeys are read-only, and restoration is outside Release 1.3 (POD-08). Rules `BR-026`, `027`, `028`, `038`, `039`, `041` amended; `BR-043`–`045` added. FRs `FR-JW-01`, `06`, `09`, `12`, `13`, `15`, `21`, `22`, `23`, `30`, `31` amended; no FR added or renumbered. New §11.2 (Product Reference Data) and §26.3 (Product Decision Register, POD). Final synchronisation (WS13-004A decisions): Number of Nights required at conversion (PD-A); legacy Journeys may stay unclassified (PD-C); replacement inheritance, vendor quotation baseline, document status reset and proposal-review guidance (PD-B, O-A2 to O-A5; new `BR-046`, `BR-047`); Vendor Code format recorded in Spec v2.0 §20 (PD-D); no unarchive confirmed (PD-E). Product Owner clarifications O-12 (Vendor Code `VEN-00001`: five numeric digits, sequential, zero-padded) and O-13 (Service Category assigned by the Journey Owner at legacy adoption). Replaced Revision 2 text kept in **Appendix B**. |

---

## 0. Workspace Readiness Check (Project Instructions §14/§15)

| Check | Result |
|---|---|
| Local repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, connected |
| Branch | `main` (last commit `20cc249`) |
| Working tree before Revision 2 | Revision 1 of this document (untracked) and the RTM v2.1 addendum (modified), both from `EBC-R1.3-WS13-001` and verified byte-identical to what Arjun wrote. Also Tiger's three pre-existing uncommitted governance edits (`RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, `RELEASE-1.3-WORKSTREAM-PLAN.md`), which were not touched. |
| Authorised changes | Product artefacts only. No UX, Architecture, Engineering, Release Tracker, Feature Register or governance document was modified. |

---

## 1. Executive Summary

Journey Workspace (WS13) is the Workspace's **post-confirmation operational execution module**. It manages a Journey from its creation, when a Journey Planning Record closes as Confirmed, until a terminal outcome: **Journey Closed, Cancelled or Superseded**. **Archived** is a separate administrative state (`PO-REVIEW-04`; D-01, D-08, D-13).

Revision 2 records the Product Owner's approved baseline.

- **Lifecycle (D-01):** Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed. Supporting states: On Hold (a temporary pause), Cancelled (terminal) and Archived (administrative). Superseded is added as a terminal outcome by D-13.
- **Entry conditions (D-02, D-03):** a Journey exists only with confirmed travel dates and an owner inherited from Journey Planning. No Journey is ever unassigned or undated.
- **Operational versus material change (D-06, D-13):** operational changes are logged as Change Records. Material changes (dates, nights, traveller count, destination, hotel category, room type, meal plan, flight class, major itinerary changes) are **not** edited on the Journey. They go through a replacement Journey, created by Journey Planning conversion, and the original becomes **Superseded**. The full Journey Amendment capability remains `PEB-001`.
- **Vendor Booking (D-07):** one object with the lifecycle Draft → Requested → Pending Information → Confirmed → Booked, with Cancelled as terminal.
- **Configuration-driven operations (D-04, D-05, D-08):** Readiness Templates, alert thresholds and the archive retention period (default 60 days) are configuration, not code.
- **Document Readiness (D-10):** status, required documents, external references and links, and notes. No file storage.
- **Primary Operational Contact (D-12):** one per Journey, distinct from the Journey Owner and the Travellers.
- **Dashboard (D-09, D-11):** an operational management view. It has no capability to create a Journey. `FR-JW-32`–`34` are approved.

Everything in this revision traces to a Product Owner decision. Four points needed an interpretation to write testable requirements (Section 26.2, `I-01`–`I-04`). Only **`I-01` (what "Payments" means in Release 1.3)** needs a short Product Owner confirmation, because no payment business object exists anywhere in the approved Workspace baseline. The other three apply existing approved rules and can be verified by Tiger.

---

## 2. Sources and Precedence

Revision 1 sources are unchanged (Appendix A lists them). **The highest-precedence source for Revision 2 is the Product Owner Review decision record for D-01 to D-13, received 24-Sep-2026 as the instruction for `EBC-R1.3-WS13-001B`** (Project Instructions §17, rank 1). Where that record refines an earlier approved decision, Revision 2 follows the record and names the refinement in Section 27.2.

---

## 3. How to Read This Document

| Label | Meaning |
|---|---|
| **Confirmed** | A decision approved before this workstream: a `PD-JW-*`, a `DEC-R1.3-*`, or Spec v2.0 "Approved" content |
| **Approved (D-nn)** | A Product Owner Review decision from 24-Sep-2026, as synchronised in Revision 2 |
| **Interpretation (I-nn)** | Wording Arjun applied so that an approved decision becomes testable. Section 26.2 lists each one with its reasoning. |
| **Open Question** | Unresolved, with a named owner (Section 27). Each is classified as blocking or not blocking UX. |
| **Implementation Evidence** | What the repository does today. Informative only, never a source of requirements. |

Identifier series: `FR-JW-01`–`34`, `BR-025`–`042`, `OQ-023`–`030`. **No identifier issued in Revision 1 has been renumbered or reused.**

---

# PART A — PRODUCT DISCOVERY

## 4. Review of the Existing Foundation

### 4.1 Approved baseline for Journey Workspace

| Item | Status | Source |
|---|---|---|
| Vision, purpose, primary object (Journey), `PD-JW-001`–`006`, object structure, 31 Must-Have FRs across 12 topic groups | Confirmed | `PO-REVIEW-04` |
| `FR-JW-01`–`04`, `BR-012`, `BR-013` | Confirmed | Spec v2.0 §6.4, §9 |
| Phase 2 lifecycle | **Approved (D-01)**, which closes `OQ-004` | Section 10 |
| Journey completion outcomes | `PD-JW-005` **refined by D-01, D-08 and D-13**. Successful completion is realised as **Journey Closed**, Cancelled is unchanged, Archived becomes an administrative state, and Superseded is added. | Section 10, Section 27.2 |
| Confirmed travel dates | **Approved (D-02)**: mandatory before a Journey is created. This refines the `BR-024` Forward Allocation (`DEC-R1.3-015`). | Section 27.2 |
| Screens `JW-01`–`JW-08` | Approved UX baseline (`DEC-R1.3-007`). Relabelling is for Sophie in WS13-002. | Screen Inventory §4 |
| Journey Amendment | `PEB-001`, a future capability. D-06 and D-13 define the Release 1.3 boundary. | Section 10.6 |

### 4.2 Reusable Foundation and WS12 capabilities

Unchanged from Revision 1 (Appendix A). This covers the shell and navigation, RBAC and record-scoped permission helpers, the Generic Ownership Model service, the append-only audit log, Informational/Action Required notifications, shared Tasks & Follow-ups, the Dashboard shell, the Journey Planning queue pattern, the conversion RPC, the bootstrap `workspace_journeys` and `workspace_vendors` tables (extend, do not recreate, `DEC-R1.3-013`), the Proposal Version immutable itinerary snapshot (`DEC-R1.3-014`), and Workspace-native components (`DEC-R1.3-014`).

---

## 5. Business Context, Vision and Purpose

**Confirmed** (`PO-REVIEW-04` §2–§3). Journey Workspace is the operational execution module. It manages confirmed journeys from commercial confirmation until operational closure: coordinating bookings, supporting travellers before, during and after travel, monitoring readiness, and preserving operational history. **Approved (D-05):** Workspace reminders exist to *reduce* operational effort, never to create overhead. This is the governing principle for every alert in Section 16.

---

## 6. Terminology (Revision 2)

| Term | Approved meaning | Source |
|---|---|---|
| **Journey Workspace** (module) | Module 4: post-confirmation operations only | Spec v2.0 §6.4 |
| **Journey Workspace Dashboard** | The operational management dashboard named in D-09. It summarises Active Leads, Journey Planning, Active Journeys, Tasks, Payments, Vendor Bookings, Alerts and Recent Activity, and has no Journey creation capability. The same surface as the Workspace Dashboard (`DASH-01`/`02`). | D-09 |
| **Journey Owner** | The Workspace User responsible for the Journey. Always present, and inherited from Journey Planning. | D-03 |
| **Primary Operational Contact (POC)** | The single person or entity SMV coordinates the Journey with: an individual traveller, a corporate organisation, a B2B travel partner or another authorised coordinating entity. Distinct from the Journey Owner and from the Traveller(s). | D-12 |
| **Corporate Point of Contact** | The WS12 object (Journey Planning, Ratified Decision 2). **Always written in full, never abbreviated to "POC"**, so it is not confused with the Primary Operational Contact. | WS12-003 §6.6 |
| **Vendor Booking** | The single object for any service booked with a Vendor for a Journey. "Vendor Confirmation" is not a separate object; "confirmed" is a status of a Vendor Booking. Each booking carries a **service type** from the Vendor Service Type list (POD-05). | D-07, POD-05 |
| **Change Record** | A logged operational change that does not affect commercial agreements, pricing, vendor commitments, traveller composition or travel schedule. Classified by a **Change Category** (§11.2), which never decides whether a change is operational or material. | D-06, POD-04 |
| **Material Change** | A change to meal plan, room type, destination, number of nights, travel dates, traveller count, hotel category, flight class, or a major itinerary change. Handled through the replacement path (Section 10.6), never edited on the Journey. | D-06, D-13 |
| **Superseded** | Terminal outcome of an original Journey replaced after a material change | D-13 |
| **Archived** | An administrative state, outside the operational lifecycle. An Archived Journey remains viewable, searchable and available for reporting and audit, and is **read-only**. Restoration is outside Release 1.3. | D-08, POD-08 |
| **Archive Eligible** | A Journey Closed for longer than the configured retention period (Release 1.3 default: 60 days) | D-08 |
| **Readiness Template** | The configured set of readiness items. Domestic and International defaults exist, and exactly one template is active per Journey. Each item is **Mandatory** or **Optional**, and the template marks which items may be set Not Applicable. | D-04, POD-01 |
| **Journey Readiness** | The Journey's readiness state, **calculated dynamically** from its template and item statuses whenever it is needed. It is never stored. Only Mandatory applicable items determine it; Optional items never block it. | POD-01 |
| **Document Readiness** | Tracking of the Journey's **Journey Documents** by status, external reference, external link and note. No file storage (binary storage deferred). | D-10, POD-03 |
| **Document Type** | Configurable master reference data (§11.2). A Journey Document always references one Document Type. | POD-03 |
| **Journey Document** | One document tracked for a Journey (or a named traveller), referencing a Document Type. A Journey may hold several Journey Documents of the same Document Type. Replaces the Revision 2 term "Document Requirement". | POD-03 |
| **Service Category** | The classification of the traveller experience a Journey delivers (§11.2). One primary Service Category per Journey. Independent of destination geography. | POD-02 |
| **Change Category** | The classification of the nature of a Change Record (§11.2). Classification only. | POD-04 |
| **Vendor Code** | The system-generated, immutable, business-friendly identifier of a Vendor. Defined in the canonical Vendor object, Spec v2.0 §7.7 as amended by §20. | POD-05 |
| **Inquiry**, Business Lifecycle `BR-001`–`006`, **Travel Date** | As in Revision 1 (Appendix A). Travel dates are now the Journey's **Confirmed Travel Start Date and End Date**, present from creation (D-02). | — |

---

## 7. Journey Workspace Scope

### 7.1 Included capabilities (Release 1.3)

| # | Capability | Basis |
|---|---|---|
| C-01 | Journey intake from Journey Planning conversion only, with owner and confirmed dates guaranteed | `PD-JW-001`, D-02, D-03 |
| C-02 | Active Journeys list, with assign and reassign actions. There is no unclaimed pool because Journeys are never unassigned. | `FR-JW-03`, D-03 |
| C-03 | Journey details: the single working record, including the Primary Operational Contact | `FR-JW-01`, D-12 |
| C-04 | Phase 2 lifecycle, On Hold, and the terminal outcomes Journey Closed, Cancelled and Superseded | D-01, D-13 |
| C-05 | Readiness Templates (configuration-driven) and operational readiness | D-04 |
| C-06 | Vendor Bookings with the approved lifecycle | D-07 |
| C-07 | Traveller servicing: communications, activities and notes | `PO-REVIEW-04` §3 |
| C-08 | Change Records for operational changes | D-06, `PD-JW-003` |
| C-09 | Material-change replacement path: On Hold, a new Journey Planning Record, a replacement Journey, and the original marked Superseded with links both ways | D-13, `PD-JW-004` |
| C-10 | Document Readiness Management | D-10 |
| C-11 | Tasks and Follow-ups, including payment and traveller follow-up reminders | D-05, `BR-008`/`009`, I-01 |
| C-12 | Configurable operational alerts | D-05 |
| C-13 | Search and filters | Topic "search" |
| C-14 | Journey Timeline and full audit history | `PD-JW-006` |
| C-15 | Administrative archive, with archive-due reminders | D-08 |
| C-16 | Dashboard contribution and the summary strip on the Active Journeys list | D-09, D-11 |

### 7.2 Excluded capabilities

| Excluded | Reason |
|---|---|
| Any capability to create a Journey outside the Journey Planning workflow, including the Dashboard "Create Journey" quick action | D-09, `PD-JW-001` |
| Editing a material element of a Journey in place | D-06, D-13 |
| The full Journey Amendment capability: amending a Journey in place, with re-quotation and traveller re-approval | `PEB-001` (D-06) |
| File upload, internal document storage, OCR, document versioning | D-10, `PEB-006` |
| Payment processing, payment records, ledgers, gateways, invoices and refunds | No approved payment object exists (I-01) |
| Commercial and proposal work | Journey Planning, `BR-013` |
| Traveller-facing or vendor-facing access | Workspace is internal |
| Vendor master data | WS16 (D-07) |
| Itinerary authoring | WS15 |
| Traveller identity | WS14 |
| Hard-coded thresholds or templates | D-04, D-05 |
| Automatic, time-driven stage changes | `BR-004` |
| Multiple Primary Operational Contacts | D-12 (future release) |

### 7.3 Assumptions

A-WS13-01 to A-WS13-07 are unchanged (Appendix A). **A-WS13-08 is revised:** Journeys created by WS12 before WS13 is released are brought into the WS13 lifecycle under `BR-036` (Revision 2).

### 7.4 Constraints

The constraints from Revision 1 still apply: no deletion, extend the bootstrap table, Workspace-native components, the immutable accepted Proposal Version, reuse of shared services, and brand unchanged. Revision 2 adds three: thresholds, templates and the retention period are **configuration** (D-04, D-05, D-08); **no Journey may exist without an owner and confirmed dates** (D-02, D-03); and **no Journey creation capability exists anywhere in the Workspace except Journey Planning conversion** (D-09).

### 7.5 Dependencies

DEP-01 to DEP-11 are unchanged except as listed here.

- **DEP-02 is revised.** D-02 requires Journey Planning's conversion to capture and require confirmed travel dates. This is a product change to Journey Planning (Section 21, CM-01).
- **DEP-09 is resolved** by D-10: Document Readiness is status and external reference only.
- **DEP-11 is resolved** by the D-01 to D-13 decision record.
- **DEP-12 (new):** configuration capability for templates, thresholds and retention. Release 1.3 ships defaults; an editing surface is a Settings concern.

---

## 8. Actors and User Goals

The actors from Revision 1 remain. Two are added and one clarified.

| Actor | Type | Goals / role | Source |
|---|---|---|---|
| **Primary Operational Contact** | External, no access | The person or entity SMV coordinates the Journey with. Receives servicing and communications. | D-12 |
| **Authorised user (archive)** | Internal | Archives Journeys and receives archive-due reminders. Release 1.3 maps this to Administrator (I-03). | D-08 |
| **Workspace User** | Internal | Owns Journeys inherited from their Journey Planning work. No longer "claims" unowned Journeys (D-03). | D-03 |

---

# PART B — BUSINESS ANALYSIS

## 9. Business Process Analysis

### 9.1 End-to-end workflow (Revision 2)

```
Journey Planning Record — Decision stage
  (claimed; confirmed travel start/end dates recorded — D-02, CM-01)
        │  Owner records Confirmed → atomic conversion (BR-012)
        ▼
CONFIRMED ── Journey Owner = planning owner (D-03); Primary Operational Contact initialised (D-12)
        │  Readiness Template assigned (D-04, BR-041)
        ▼
IN PREPARATION ── Vendor Bookings (Draft→Requested→Pending Information→Confirmed→Booked, D-07)
        │         Document Readiness (D-10), servicing, Change Records (D-06)
        ▼  all readiness items resolved (BR-028)
READY TO TRAVEL
        ▼  start date reached — owner action
TRAVELLING ── in-trip support
        ▼  end date reached — owner action
TRAVEL COMPLETE ── travel has ended
        ▼  owner begins post-travel follow-up
POST TRAVEL ── feedback, follow-ups, learning offer
        ▼
JOURNEY CLOSED  ── terminal (successful completion)
        │  after the retention period (default 60 days): Archive Eligible → reminder to authorised users (D-08)
        ▼
ARCHIVED (administrative state — may also be applied at any time, with reason)

Confirmed … Travelling / On Hold ──► CANCELLED (terminal, reason)
Confirmed / In Preparation / Ready to Travel ──► ON HOLD ──► resume to the held-from stage
Material change (D-06): ON HOLD → new Journey Planning Record → converts → REPLACEMENT JOURNEY
                        → original marked SUPERSEDED (terminal, reason "Material Amendment"),
                          with links both ways (D-13)
```

### 9.2 Lifecycle interactions with other modules

As Revision 1, with these changes.

- **At conversion:** the Journey receives confirmed dates, the owner and the initial Primary Operational Contact.
- **Material change:** hand-back to Journey Planning produces a replacement Journey, and the original is Superseded.
- **Vendor Management (WS16):** supplies Vendors. WS13 owns Journey Vendor Bookings.
- **Dashboard:** receives the D-09 areas.

### 9.3 Navigation flows

N-01, N-03, N-04, N-05, N-06, N-08 and N-09 are unchanged.

- **N-02 revised:** Active Journeys list filtered to *Mine* → open a Journey. There is no claim step because Journeys arrive owned.
- **N-07 revised:** Journey → "Material change" → the Journey is placed On Hold and a pre-filled Journey Planning Record opens. On that record's conversion, the replacement Journey opens and the original shows *Superseded by [replacement]*.
- **N-10 (new):** Archive-due reminder → Journey → Archive (with reason).

### 9.4 Operational scenarios (Revision 2)

| ID | Scenario | Expected behaviour | FRs / BRs |
|---|---|---|---|
| S-01 | Domestic happy path | Created with owner, dates and the Domestic template → In Preparation → bookings reach Booked → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed → Archive Eligible after 60 days | FR-JW-05–11, 15–16, 22–23; BR-025, 037, 038 |
| S-02 | International with visas | International template. Visa is a required document with an external reference. An alert fires when the document window opens with the visa still outstanding, and the Journey cannot enter Ready to Travel. | FR-JW-21–23, 26; BR-028 |
| S-03 | Vendor slow to respond | Booking sits in Requested or Pending Information beyond the configured threshold → Action Required alert. The alert resolves when the booking moves on or is cancelled. | FR-JW-15–17, 26; BR-037 |
| S-04 | Operational change (same-category hotel swap, same room type, same dates) | A Change Record is logged. The affected Vendor Booking re-enters Requested and progresses until Booked again. The Journey is unchanged. | FR-JW-13, 16; BR-032, 037 |
| S-05 | Material change (destination, nights, dates, traveller count, room type, hotel category, meal plan, flight class) | On Hold → new Journey Planning Record → converts → replacement Journey. Original becomes Superseded with reason "Material Amendment", with links both ways. | FR-JW-10, 12; BR-031, 039 |
| S-06 | Cancellation after confirmation | Cancelled with a reason. Open bookings are flagged for vendor cancellation tasks. | FR-JW-11; BR-030 |
| S-07 | Owner leaves | An Administrator reassigns the Journey (allowed before any terminal outcome). The change is audited and the new owner is notified. | FR-JW-31; BR-026 |
| S-08 | In-trip support | Activity logged. Optional task. | FR-JW-19, 24 |
| S-09 | Corporate / B2B journey | The party association is inherited. The Primary Operational Contact is set to the corporate organisation or B2B partner. | FR-JW-06; BR-034, 040 |
| S-10 | Legacy Journey from WS12 | Adopted under `BR-036`: owner and dates completed during adoption, then the normal lifecycle applies | BR-036 |
| S-11 | Erroneous Journey | Authorised user archives it at any time, with a reason. The planning record is not reopened. | FR-JW-31; BR-038 |
| S-12 | Payment due from traveller | Owner creates a *Payment* follow-up with a due date. A payment reminder alert fires on the due date and resolves when the follow-up is completed (I-01). | FR-JW-24, 26 |

---

## 10. Journey Lifecycle (Phase 2) — Approved (D-01)

### 10.1 Stages

| Stage | Business meaning | Entry | Exit (to next stage) |
|---|---|---|---|
| **1. Confirmed** | The Journey exists after traveller acceptance. Operational work has not started. | Only by conversion (`BR-012`), with an owner (D-03) and confirmed dates (D-02) always present | Readiness Template assigned (`BR-041`) |
| **2. In Preparation** | Bookings, documents and traveller preparation are in progress | From Confirmed, or resumed from On Hold | All readiness items resolved (`BR-028`) |
| **3. Ready to Travel** | Everything needed for departure is in place | From In Preparation, or resumed from On Hold | Confirmed start date reached, and the owner marks Travelling |
| **4. Travelling** | Traveller is on the Journey; support mode | From Ready to Travel, on or after the start date | Confirmed end date reached, and the owner marks Travel Complete |
| **5. Travel Complete** | Travel has ended; the traveller has returned | From Travelling, on or after the end date | Owner begins post-travel follow-up → Post Travel |
| **6. Post Travel** | Post-travel follow-up: feedback, open follow-ups, learning offer | From Travel Complete | Owner closes → Journey Closed |
| **7. Journey Closed** | **Terminal.** Successful completion (realises `PD-JW-005` "Successfully Completed"). | From Post Travel | None. Never reopened. |

**Supporting states**

| State | Kind | Rule |
|---|---|---|
| **On Hold** | Temporary operational pause (status overlay) | Allowed from Confirmed, In Preparation or Ready to Travel, with a reason. Resume returns the Journey to the held-from stage. (`BR-029`) |
| **Cancelled** | Terminal outcome | Allowed from Confirmed, In Preparation, Ready to Travel, Travelling or On Hold, with a reason. (`BR-030`) |
| **Superseded** | Terminal outcome | Applied to the original Journey when its replacement Journey is created after a material change. The reason "Material Amendment" is mandatory. (`BR-039`, D-13) |
| **Archived** | **Administrative state, not part of the lifecycle** | May be applied by an authorised user at any time, with a reason. It hides the Journey from active views and keeps its stage and history. The Journey remains viewable, searchable and available for reporting and audit, and becomes **read-only**. Every archive action is audited. **Restoration (unarchive) is outside Release 1.3** (POD-08). (`BR-038`, D-08, POD-08) |

### 10.2 Allowed and invalid transitions

| From | Allowed to | Invalid |
|---|---|---|
| Confirmed | In Preparation (gate `BR-041`); On Hold; Cancelled | Any later stage; Journey Closed |
| In Preparation | Ready to Travel (gate `BR-028`); On Hold; Cancelled | Back to Confirmed; any later stage |
| Ready to Travel | Travelling (start date ≤ today); back to In Preparation (a readiness item re-opened); On Hold; Cancelled | Travelling before the start date; any later stage |
| Travelling | Travel Complete (end date ≤ today); Cancelled (trip aborted) | On Hold; any earlier stage |
| Travel Complete | Post Travel | Cancelled; On Hold; earlier stages |
| Post Travel | Journey Closed | Cancelled; On Hold; earlier stages |
| On Hold | Resume to the held-from stage; Cancelled; Superseded (replacement created) | Any other stage |
| Journey Closed, Cancelled, Superseded | None (terminal) | Every transition |

Archive acts on the administrative state and is valid in any stage (`BR-038`). There is no unarchive transition in Release 1.3 (POD-08).

### 10.3 Gates summary

| Gate | Where | Rule |
|---|---|---|
| Confirmed travel dates | **At conversion, inside Journey Planning** | `BR-027` (Revision 2); CM-01 |
| Owner present | At conversion (inherited) and at all times afterwards | `BR-026` (Revision 2) |
| Readiness Template assigned | Confirmed → In Preparation | `BR-041` |
| Readiness resolved | → Ready to Travel | `BR-028` |
| Start date reached / end date reached | → Travelling / → Travel Complete | `FR-JW-09` |

### 10.4 Date-driven prompts

Unchanged from Revision 1. Reaching the start or end date raises a configurable milestone alert. It never changes the stage automatically (`BR-004`).

### 10.5 Travel dates after creation

Confirmed Travel Start and End Dates are carried from conversion. **A change to travel dates or number of nights is a Material Change (D-06)** and follows Section 10.6. The dates are never edited on the Journey.

### 10.6 Operational change versus material change (D-06, D-13)

| Change type | Examples (D-06) | Handling in Release 1.3 |
|---|---|---|
| **Operational** | Anything that does not affect commercial agreements, pricing, vendor commitments, traveller composition or travel schedule. Examples: pickup time, sightseeing order, a same-category, same-room-type hotel substitution that keeps pricing, contact details. | A **Change Record** on the same Journey (`FR-JW-13`, `BR-032`). Any affected Vendor Booking re-enters the Vendor Booking lifecycle until reconfirmed (D-07). |
| **Material** | Meal plan; hotel room type; destination; number of nights; travel dates; traveller count; hotel category; flight class; major itinerary changes | **Replacement path** (I-02): the original Journey is placed On Hold → a new Journey Planning Record is created, linked and pre-filled → standard planning → conversion creates the **replacement Journey** (`BR-012` preserved) → the original is marked **Superseded**, reason "Material Amendment", with links both ways (`BR-039`). The replacement Journey continues the operational lifecycle from Confirmed. The in-place amendment capability remains `PEB-001`. |

### 10.7 Archive (D-08)

- **Archive Eligible** = Journey Closed for longer than the configured retention period (Release 1.3 default **60 days**, configurable).
- The Workspace **reminds authorised users** when archival is due (alert AL-15).
- Authorised users may archive **at any time**, including before eligibility, and for Cancelled or Superseded Journeys.
- Every archive action records **reason, user, timestamp** and an audit history entry.
- Archiving never deletes and never changes the stage or outcome.
- **An Archived Journey is read-only** (POD-08): it remains viewable, searchable and available for reporting and audit, but no field, item, booking, task, note or ownership can be changed.
- **Restoration is outside Release 1.3.** Any future restoration capability will be an administrative operation (POD-08).

---

## 11. Business Objects (Revision 2; Revision 3 amendments marked)

| Object | Status | Definition and key business fields | Relationships |
|---|---|---|---|
| **Journey** | Confirmed; refined by D-01, D-02, D-03, D-12, D-13, **POD-02** | A commercially confirmed travel commitment. **Identity:** Journey ID (human-readable reference format: `OQ-024`, Archie); Traveller *or* Corporate Point of Contact (party, inherited); Journey Planning Reference; **Journey Owner (always present)**; Destination/Region; **primary Service Category (POD-02, §11.2)**; **Confirmed Travel Start Date and End Date (always present)**; Current Stage; On Hold flag and reason; Outcome and reason (Cancelled / Superseded); Archived flag, reason, user and timestamp. **Carried trip parameters:** adults, children, infants, nights, departure city. **Links:** accepted Proposal Version; *Supersedes* / *Superseded by* Journey (D-13). | 1 ↔ 1 originating Journey Planning Record. Aggregate root for the objects below. |
| **Primary Operational Contact** | **Approved (D-12)** | Exactly one per Journey in Release 1.3. Contact type: Individual traveller / Corporate organisation / B2B travel partner / Other authorised coordinating entity. Fields: name, organisation (where applicable), contact details. Distinct from the Journey Owner and the Traveller(s). Initialised at conversion from the originating record's party (I-04), editable by the owner, and every change audited. | Belongs to one Journey |
| **Vendor Booking** | **Approved (D-07)** | The single object for a service booked with a Vendor for a Journey. Fields: Vendor (Active only when new), **service type** (from the Vendor Service Type list, POD-05; renamed in Revision 3 from "service category" to avoid confusion with the Journey's Service Category), service date(s), booking reference, status, status reason, notes. | Belongs to one Journey (owned by WS13). References one Vendor (owned by WS16). |
| **Readiness Template** | **Approved (D-04, POD-01)** | A configuration item: a named set of readiness items across the four confirmed categories (Booking confirmations, Documentation, Traveller readiness, Supplier readiness). Each item is **Mandatory** or **Optional**, and selected items are marked as permitting **Not Applicable**. For Documentation, the template states whether each Document Type is Mandatory, Optional or Not Applicable for the Journey. Release 1.3 defaults: **Domestic** and **International**. New templates are added by configuration, without code. | Exactly one active template per Journey |
| **Readiness Item** | Confirmed (`PO-REVIEW-04` §6); model per D-04, POD-01 | One checkpoint from the Journey's template, plus any manual additions. Carries its Mandatory or Optional designation. Status: Outstanding / Complete / Not Applicable (with reason; only on items the template permits). Source is either system-derived or manual. The Journey's overall readiness is **calculated from its items and never stored** (POD-01). | Belongs to one Journey |
| **Journey Document** *(Revision 2: "Document Requirement")* | **Approved (D-10, POD-03)** | A document tracked for the Journey or a named traveller. Fields: **Document Type** (reference, §11.2); traveller(s) concerned; **document status** (Outstanding / Received / Verified / Not Applicable); **external reference** (e.g., passport number *reference*, visa application ID); **external link** (e.g., a shared-drive location); **operational notes**. **No file upload, internal storage, OCR or versioning** (binary storage deferred). | Belongs to one Journey; references one Document Type (one Document Type → many Journey Documents); feeds Documentation readiness |
| **Change Record** | **Approved (D-06, POD-04)** | A logged **operational** change: **Change Category** (§11.2), what changed, why, requested by (traveller / SMV / vendor), logged by, when. Never used for material changes. | Belongs to one Journey |
| **Operational Note**, **Activity**, **Task / Follow-up**, **Notification** | Confirmed | As in Revision 1. Task and Follow-up gain a configurable **category** used by alerts, e.g., Payment, Traveller follow-up, Operational (D-05, I-01). | — |

### 11.1 Vendor Booking lifecycle — Approved (D-07)

| Status | Meaning | Allowed next | Rule |
|---|---|---|---|
| **Draft** | Booking being prepared; vendor not yet contacted | Requested; Cancelled | — |
| **Requested** | Request sent to the vendor | Pending Information; Confirmed; Cancelled | — |
| **Pending Information** | Vendor needs more information before confirming | Requested (information supplied); Confirmed; Cancelled | Reason (what is pending) recorded |
| **Confirmed** | Vendor has confirmed availability and terms | Booked; Requested (re-entry); Cancelled | — |
| **Booked** | Reservation is final and committed; booking reference held | Requested (re-entry); Cancelled | Booking reference mandatory |
| **Cancelled** | **Terminal** | None | Reason mandatory. Retained, never deleted. |

**Re-entry rule (D-07):** there is **no "Amended" status**. When an operational change, or in future a `PEB-001` amendment, affects a Confirmed or Booked booking, that booking re-enters the lifecycle at **Requested** and progresses again until reconfirmed. Every transition is logged.

**Derived terms:** *Pending Vendor Confirmations* = bookings in Requested or Pending Information. *Supplier readiness complete* = every non-Cancelled booking is Booked.

### 11.2 Product Reference Data (Release 1.3) — Approved (POD-01 to POD-04)

**Canonical source** for the Journey Workspace reference lists. All lists are **configurable reference data**: values can be added in future by configuration, without code. Behaviour is defined only by the Business Rules cited; a reference value never carries behaviour of its own. The Vendor reference data (lifecycle, attributes, Vendor Code, Service Type) is canonical in the Vendor object, Spec v2.0 §7.7 as amended by §20 (POD-05), and is not repeated here.

| List | Initial values (Release 1.3) | Rules | Decision |
|---|---|---|---|
| **Readiness Templates** | Domestic; International | Structure and readiness calculation: `BR-028`, `BR-041`. Template items (content) are Product Owner content, still to be supplied. | POD-01 |
| **Service Categories** | Domestic; International; Weekend Getaway; Honeymoon; Family; Solo; Pilgrimage | One primary Service Category per Journey. Classifies the traveller experience; destination geography remains independent (`BR-043`). | POD-02 |
| **Document Type categories** | Traveller Identity; Travel; Accommodation; Activities; Insurance & Health; Financial / Booking; Internal Operational | Document Types are master reference data grouped by these categories. The individual Document Types within each category are Product Owner content, still to be supplied (`BR-044`). | POD-03 |
| **Change Categories** | Itinerary; Traveller; Accommodation; Transport; Activities; Operational; Documentation | Classify the nature of a Change Record only (`BR-045`). | POD-04 |

**Reading the lists together.** "Domestic" and "International" appear both as Readiness Templates and as Service Categories. They are separate lists with separate purposes: the Service Category describes the traveller experience, the Readiness Template defines the checklist. A Service Category does not select a template (`BR-043`).

---

## 12. Functional Requirements (Revision 2; Revision 3 amendments marked)

**Status:** `FR-JW-01`–`04` were Confirmed previously. `FR-JW-05`–`31` fill the approved 31, and `FR-JW-32`–`34` were **approved by D-11**. All 34 are **Approved — baseline synchronised by `EBC-R1.3-WS13-001B`**, subject to Tiger's verification (`001C`). All are Must Have. Rows marked **(Rev 2, D-nn)** changed in Revision 2; the Revision 1 wording of every changed row is kept in Appendix A. Rows marked **(Rev 3, POD-nn)** changed in Revision 3; their Revision 2 wording is kept in Appendix B. Revision 3 adds no FR.

### 12.1 Journey List, Details, Status

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-01** *(FR-WS-017; Rev 2, D-12; Rev 3, POD-02, POD-07)* | The Journey Workspace shall be the single working record for one Journey: its party and **Primary Operational Contact**, current stage, linked itinerary, linked Vendor Bookings, and Tasks/Follow-ups. | Single source of truth | AC1 Overview shows party, Primary Operational Contact, destination, **primary Service Category**, confirmed dates, stage, On Hold, owner, readiness summary, active alerts, a link to the originating planning record, and Supersedes/Superseded-by links where present. AC2 Contextual sections: Itinerary, Vendor Bookings, Readiness, Documents, Tasks & Follow-ups, Notes & Activity, Change Records, History. AC3 The Primary Operational Contact is displayed separately from the Journey Owner and the Travellers. AC4 The Journey holds exactly one primary Service Category from the configured list (`BR-043`). AC5 An authorised Workspace user (the owner or an Administrator) may change the Service Category after creation; the change is recorded in the Journey History and never starts a Replacement Journey (`BR-043`). | DEP-02, DEP-03 |
| **FR-JW-02** *(FR-WS-018)* | The Journey Workspace shall show the Journey's full stage history. | `PD-JW-006` | Unchanged from Revision 1 | Audit log |
| **FR-JW-03** *(FR-WS-019; Rev 2, D-03)* | The Journey Workspace shall present the Active Journeys queue (Phase 2 only) with the Generic Ownership Model's assign and reassign behaviour. **Because every Journey is created owned, there is no unclaimed pool.** | Operational list | AC1 Lists every Journey not in a terminal outcome and not Archived. On Hold is shown and marked. AC2 Groupable by the D-01 stages. AC3 Every row shows its owner. No row is ever unassigned. AC4 Terminal and Archived Journeys are excluded by default and reachable via filters. | Ownership service |
| **FR-JW-04** *(FR-WS-020)* | A Journey's status field shall be system-derived, never a freely editable dropdown. | `BR-005` | Unchanged | — |

### 12.2 Journey creation

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-05** *(Rev 2, D-09)* | A Journey shall be created only by the Confirmed closure of a Journey Planning Record. The Workspace, including the Journey Workspace Dashboard, shall provide **no capability to create a Journey**, and the "Create Journey" concept is removed. | `PD-JW-001`, D-09 | AC1 No "Create Journey" action, quick action or entry point exists anywhere in the Workspace. AC2 Creation by any other route is rejected. | WS12 conversion |
| **FR-JW-06** *(Rev 2, D-02, D-12; Rev 3, POD-06, POD-07, PD-A, PD-B)* | On creation the Journey shall carry from the originating record: party (Traveller or Corporate Point of Contact); Destination/Region; **Confirmed Travel Start and End Dates**; trip parameters; the accepted Proposal Version reference; the **primary Service Category**; and an **initial Primary Operational Contact** (I-04). Conversion shall be validated before the Journey is created. | Continuity; `DEC-R1.3-014` | AC1 A Journey never exists without confirmed dates. AC2 Links exist both ways between Journey and planning record. AC3 Planning history stays on the planning record. AC4 Later Journey updates never alter the closed planning record. AC5 The Primary Operational Contact is populated at creation (for a replacement Journey, carried from the original Journey, `BR-046`) and editable afterwards, with audit. **AC6** Conversion of a planning record with no assigned Journey Owner is rejected with a validation message (`BR-026`). **AC7** If the Number of Nights is missing, or the Confirmed Travel Dates are inconsistent with it, conversion is blocked with a validation message, and the user must resolve the mismatch; neither value is corrected automatically (`BR-027`). **AC8** Service Category is optional during Journey Planning but mandatory for conversion: a planning record without one cannot convert, and the user receives a validation message (`BR-043`). | CM-01; CM-05; DEP-03 |
| **FR-JW-07** *(Rev 2, D-03)* | A newly created Journey shall enter **Confirmed**, owned by **the Journey Planning Record's current owner**, and shall raise an Informational "Journey confirmed" notification to that owner. | D-03 | AC1 Owner equals the planning owner at the moment of conversion. AC2 No Journey is ever created unassigned. AC3 A notification is sent to the owner. | Conversion |

### 12.3 Operational and status management

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-08** *(Rev 2, D-01, D-13)* | The Journey shall follow the approved lifecycle (Section 10): Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed, with On Hold, Cancelled and Superseded. It shall reject any transition not allowed by Section 10.2. | `BR-025` | AC1 Only allowed transitions are offered. AC2 Disallowed attempts are rejected with a reason. AC3 Every transition is logged. | — |
| **FR-JW-09** *(Rev 2, D-01, D-04; Rev 3, POD-01)* | Advancing a Journey shall be a deliberate action by its owner or an Administrator, subject to these gates: Readiness Template assigned before leaving Confirmed; all **Mandatory applicable** readiness items resolved before Ready to Travel; start date reached for Travelling; end date reached for Travel Complete. | `BR-004`, `BR-028`, `BR-041` | AC1 An unmet gate disables the action and gives field-specific guidance. AC2 A Not Applicable item (with reason, where the template permits it) satisfies the readiness gate. AC3 Non-owners who are not Administrators cannot advance. **AC4** Outstanding Optional items never block Ready to Travel. | — |
| **FR-JW-10** | Place On Hold (from Confirmed, In Preparation or Ready to Travel) with a reason; resume to the held-from stage. | `PD-JW-004`; `BR-029` | Unchanged from Revision 1. Milestone and readiness alerts are suspended while On Hold, and the On Hold duration alert applies instead. | Configuration |
| **FR-JW-11** *(Rev 2, D-01, D-08)* | Closing shall use exactly one terminal outcome valid for the current stage: **Journey Closed** (from Post Travel) or **Cancelled** (reason required). **Superseded** is set only through `FR-JW-12`. Archived is **not** a closing outcome (`FR-JW-31`). No terminal outcome can be reopened. | D-01, `BR-030` | AC1 Outcome options follow Section 10.2. AC2 Cancelled needs a reason and flags any open Vendor Bookings for cancellation tasks. AC3 No reopen action exists. AC4 Terminal Journeys leave the default list but remain searchable. | — |
| **FR-JW-12** *(Rev 2, D-06, D-13; Rev 3, POD-06, PD-B)* | For a **material change** (Section 10.6), the Workspace shall support: placing the Journey On Hold; creating a linked, pre-filled Journey Planning Record; and, when that record converts, marking the original Journey **Superseded** with reason "Material Amendment" and links both ways to the replacement Journey. | `PD-JW-004`, D-13 | AC1 Material fields (destination, dates, nights, traveller count) are never editable on a Journey. AC2 One action places the Journey On Hold (reason: Material change) and opens the pre-filled planning record. AC3 On conversion, the original becomes Superseded automatically as part of the same business event, and both Journeys show the link. AC4 The original is never Cancelled for this reason. AC5 The replacement starts at Confirmed. **AC6** The replacement planning record is created with Origin Channel = Existing Traveller, stage = Lead Created, Journey Owner inherited from the original Journey, and an auto-generated title that references the original Journey. Traceability is through the replacement relationship; no new lifecycle stage is introduced (`BR-039`). **AC7** The replacement inherits the approved operational context of the original Journey as defined in `BR-046` (vendor quotation baseline from Booked bookings with Active vendors only; Journey Documents with Verified → Received and Not Applicable → Outstanding). The original Journey's records are never altered. | CM-02; CM-05 |
| **FR-JW-13** *(Rev 2, D-06; Rev 3, POD-04)* | **Operational changes**, meaning those not affecting commercial agreements, pricing, vendor commitments, traveller composition or travel schedule, shall be recorded as Change Records on the same Journey, each classified by a **Change Category**. A change flagged as material shall be refused as a Change Record and directed to `FR-JW-12`. | D-06; `BR-032`; `BR-045` | AC1 A Change Record captures Change Category, what, why, requested by, who and when. AC2 Changes affecting a Confirmed or Booked Vendor Booking send it back to Requested (`BR-037`). AC3 The accepted Proposal Version is never modified. AC4 Material changes, as defined by `BR-032` (Section 10.6), cannot be recorded as Change Records. The Change Category does not decide whether a change is material, and it never triggers a Replacement Journey, an Operational Update or a Readiness Update (`BR-045`). | — |

### 12.4 Booking and vendor coordination

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-14** *(Rev 2, D-02, D-06)* | The Journey shall display its Confirmed Travel Start and End Dates, set at creation. They are **not editable** in Journey Workspace, and a date change is a material change (`FR-JW-12`). | D-02, D-06 | AC1 Dates are always present. AC2 No edit control exists. AC3 The planning record's Intended Travel Month is shown for reference only. | CM-01 |
| **FR-JW-15** *(Rev 2, D-07; Rev 3, POD-05)* | The owner shall create one or more Vendor Bookings for the Journey: Vendor (Active only), **service type**, service date(s) and notes. Each starts in **Draft**. | D-07; `FR-VM-02`/`04` | AC1 Only Active Vendors can be selected. Bookings with Vendors that later became Inactive stay visible. AC2 Multiple bookings are allowed. AC3 Service dates outside the confirmed travel window produce a warning. AC4 Service type values come from the Vendor Service Type list (Spec v2.0 §20). | DEP-05 |
| **FR-JW-16** *(Rev 2, D-07)* | Vendor Booking status shall change only by deliberate, logged actions following Section 11.1. Booked requires a booking reference; Pending Information and Cancelled require a reason; re-entry to Requested applies after a change. There is no "Amended" status, and bookings are never deleted. | D-07; `BR-033`, `BR-037` | AC1 Only Section 11.1 transitions are allowed. AC2 Mandatory fields are enforced. AC3 No delete action exists. AC4 Every change appears in the Timeline. | — |
| **FR-JW-17** *(Rev 2, D-07)* | The Journey shall show its booking status summary (counts by status), and bookings in Requested or Pending Information shall feed the Pending Vendor Confirmations KPI and the Workspace-wide Vendor Bookings view. | `FR-VM-03`, `FR-DASH-05` | AC1 The Overview shows "n of m Booked". AC2 Every Requested or Pending Information booking on an active, not-On-Hold Journey is counted. AC3 Counts update immediately on status change. | — |
| **FR-JW-18** | Log vendor coordination activity against a Vendor Booking. | Supplier coordination | Unchanged | — |

### 12.5 Traveller servicing and Document Readiness

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-19** *(Rev 2, D-12)* | Log communications and servicing activity with the Traveller(s) or the Primary Operational Contact, before, during and after travel. | `PO-REVIEW-04` §3 | AC1 Each entry records who was contacted (a Traveller or the Primary Operational Contact). AC2 Entries are append-only. AC3 The Workspace sends no messages (`OQ-008`). | — |
| **FR-JW-20** | Operational Notes are append-only; corrections are made as new notes. | `PD-JW-006` | Unchanged | — |
| **FR-JW-21** *(Rev 2, D-10; Rev 3, POD-03)* | The owner shall manage **Document Readiness**: **Journey Documents** per Journey or per traveller, each referencing a configured **Document Type** and carrying document status (Outstanding / Received / Verified / Not Applicable), external reference, external link and operational notes. A Journey may hold several Journey Documents of the same Document Type. File upload, internal storage, OCR and versioning shall not be provided. | D-10; POD-03 | AC1 The Journey's Readiness Template determines whether each Document Type is Mandatory, Optional or Not Applicable for the Journey; the owner may add further Journey Documents. AC2 Reference, link and notes can be recorded. AC3 No upload control exists. AC4 Every status change is logged. AC5 Verified = the owner has checked the document is valid for this Journey. AC6 Every Journey Document references exactly one Document Type (`BR-044`). | D-04 |

### 12.6 Operational readiness

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-22** *(Rev 2, D-04; Rev 3, POD-01)* | The Journey shall present readiness across the four categories, derived from its **single active Readiness Template**, with an overall state of Not Ready, At Risk or Ready. | `PO-REVIEW-04` §6; D-04; POD-01 | AC1 Exactly one active template per Journey. AC2 The overall state is **calculated dynamically** from the template and item statuses, never set manually and never stored. AC3 The state is shown in the list and the Overview. **AC4** Only Mandatory applicable items determine the state; Optional items are shown but never block Ready. | Configuration |
| **FR-JW-23** *(Rev 2, D-04; Rev 3, POD-01, POD-08)* | Readiness Templates shall be configuration-driven, with Domestic and International defaults, extensible without code changes. Each template item is **Mandatory** or **Optional**. The owner assigns the template while the Journey is Confirmed; the default is proposed from the destination's domestic or international classification where known. Items are system-derived or manual, and **items the template permits** may be marked Not Applicable with a reason. | D-04; POD-01; `BR-018` | AC1 Adding a new template requires configuration only. AC2 A template change on a Journey recalculates the template-generated items according to the newly assigned template; manually created items are retained and are never removed automatically; the change is logged (`BR-041`). AC3 System items update automatically: all bookings Booked; all Mandatory applicable Journey Documents Received or Verified. AC4 Not Applicable is offered only on items the template permits. | Configuration |

### 12.7 Tasks

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-24** *(Rev 2, D-05)* | The owner shall create Tasks and Follow-ups on a Journey, assign them to any Workspace User, and complete or cancel them. Each carries a configurable category (at minimum Operational, Traveller follow-up and Payment). | `BR-008`/`009`; D-05 | AC1 Uses the shared capability. AC2 Follow-ups need a purpose and a due date. AC3 The category drives the alert coverage in Section 16. | Shared tasks; I-01 |
| **FR-JW-25** | Journey task overview; Journey tasks included in Tasks Due Today and Upcoming Tasks. | `FR-DASH-05` | Unchanged | — |

### 12.8 Notifications and alerts

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-26** *(Rev 2, D-05, D-08)* | The Workspace shall raise **configurable** Action Required alerts covering journey milestones, payment reminders, traveller follow-ups, operational tasks, vendor bookings, document readiness, On Hold duration and archive-due (Section 16). Each resolves only when its condition resolves. Thresholds are configuration with Release 1.3 defaults, never hard-coded. | D-05, `BR-017`, `BR-042` | AC1 One active alert per condition per Journey. AC2 Viewing does not resolve an alert. AC3 Changing a threshold needs no code change. AC4 Alerts go to the owner; archive-due alerts go to authorised users. | Configuration; shared notifications |
| **FR-JW-27** *(Rev 2, D-13)* | Informational notifications: Journey confirmed; assigned or reassigned to you; placed On Hold or resumed; Journey Closed or Cancelled; **Journey Superseded**; archived. | `PD-NO-003` | AC1 Acknowledgeable. AC2 Clicking opens the Journey. | — |
| **FR-JW-28** | Alert banner on the Journey and an at-risk indicator in the list. | Operational alerts | Unchanged | FR-JW-26 |

### 12.9 Search, audit, governance

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-29** *(Rev 2, D-01, D-08, D-12, D-13)* | Search by Journey reference, traveller name or mobile, Corporate Point of Contact, **Primary Operational Contact**, and destination. Filter by stage, owner (Mine / named user), On Hold, readiness, departure date range, alert status, **outcome (Journey Closed / Cancelled / Superseded)** and **Archived**. Default sort: departure date. Journeys are also found through global search. | Topic "search" | AC1 Terminal and Archived Journeys are included when their filters are on, and always in global search. AC2 Filters combine with AND. AC3 Empty results use the Workspace empty-state pattern. | Section 18 |
| **FR-JW-30** *(Rev 2; Rev 3, POD-07, POD-08)* | Journey Timeline covering all events, as in Revision 1, plus Primary Operational Contact changes, **Service Category changes**, Vendor Booking lifecycle transitions, Readiness Template assignment and changes, supersession links, and archive (reason, user, timestamp). | `PD-JW-006`; D-08; POD-07 | AC1 Every event shows actor, time, and before/after values. AC2 Read-only for all roles. AC3 The Timeline of an Archived Journey remains viewable. | Audit log |
| **FR-JW-31** *(Rev 2, D-03, D-08; Rev 3, POD-08)* | No permanent deletion of any Journey data. Ownership may be reassigned at any time **before a terminal outcome**, with every change audited. **Archive** is an administrative action by authorised users at any time, requiring a reason and recording user and timestamp. Archiving never changes the stage or outcome. **An Archived Journey is read-only** and remains viewable, searchable and available for reporting and audit. **Restoration is outside Release 1.3.** | `BR-007`, D-03, D-08, POD-08 | AC1 No delete action. AC2 Reassignment is blocked after Journey Closed, Cancelled or Superseded. AC3 Archive requires a reason, and user and timestamp are captured. AC4 Archived Journeys are hidden from active views but searchable. **AC5** No change of any kind is accepted on an Archived Journey. **AC6** No unarchive or restore action exists in Release 1.3. | RBAC; I-03 |

### 12.10 Dashboard contributions — Approved (D-11)

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-32** *(Rev 2, D-09, D-11)* | The **Journey Workspace Dashboard** is an operational management view (D-09) summarising **Active Leads, Journey Planning, Active Journeys, Tasks, Payments, Vendor Bookings, Alerts and Recent Activity**. Journey Workspace shall supply the Active Journeys, Upcoming Departures and Pending Vendor Confirmations KPIs (Section 17), Journey cards with owner and next action, and the Journey-sourced Tasks, Payments (I-01), Vendor Bookings and Alerts content. | D-09, D-11; `FR-DASH-03`–`05` | AC1 KPI values match the Section 17 definitions for the My Work or Team scope. AC2 Selecting a KPI opens the pre-filtered list. AC3 No Journey creation capability appears. AC4 Active Leads and Journey Planning content come from Journey Planning (WS12) and are unchanged. | Dashboard (WS11) |
| **FR-JW-33** *(Rev 2)* | Journey events (confirmed, reassigned, stage change, On Hold or resume, booking Booked, Superseded, closure, archive) appear in Dashboard Recent Activity. | D-11 | Unchanged from Revision 1 except for the event list | FR-JW-30 |
| **FR-JW-34** *(Rev 2, D-01)* | The Active Journeys list opens with a summary strip showing counts per D-01 stage, At Risk, Departing within the configured window, and On Hold. Each count is a one-click filter. | D-11 | AC1 Counts equal the filtered list size. AC2 No analytics charts. | FR-JW-29 |

---

## 13. Coverage

### 13.1 Card areas → FRs

Unchanged from Revision 1. Revision 2 adds: Primary Operational Contact → FR-JW-01, 06, 19, 29. Document Readiness → FR-JW-21. Archive → FR-JW-31. Vendor Booking lifecycle → FR-JW-15–17.

### 13.2 Approved topic groups → FRs

Unchanged. **31 of 31**, plus `FR-JW-32`–`34` approved by D-11 as completing, not expanding, the approved scope.

### 13.3 Decision → artefact incorporation

| Decision | FRs revised | BRs | Sections |
|---|---|---|---|
| D-01 Lifecycle | 03, 08, 09, 11, 29, 34 | 025, 029, 030 | 9.1, 10 |
| D-02 Confirmed dates | 06, 14 | 027 | 10.3, 10.5, 21 (CM-01) |
| D-03 Ownership | 03, 07, 31 | 026, 035, 036 | 9.3, 15 |
| D-04 Readiness Templates | 09, 22, 23 | 028, 041 | 11 |
| D-05 Alerts | 24, 26 | 042 | 16, 17 |
| D-06 Operational vs material | 12, 13, 14 | 031, 032 | 10.6 |
| D-07 Vendor Booking | 15, 16, 17 | 033, 037 | 11.1 |
| D-08 Archive | 11, 26, 30, 31 | 038 | 10.7, 16 |
| D-09 Dashboard | 05, 32 | — | 6, 7.2 |
| D-10 Document Readiness | 21 | — | 11 |
| D-11 Additional FRs | 32, 33, 34 approved | — | 12.10 |
| D-12 Primary Operational Contact | 01, 06, 19, 29 | 034, 040 | 6, 11 |
| D-13 Material replacement | 08, 12, 27, 29 | 039 | 10.6, 21 (CM-02) |
| **POD-01** Readiness framework | 09, 22, 23 | 028, 041 | 6, 11, 11.2 |
| **POD-02** Service Categories | 01 | 043 | 6, 11, 11.2 |
| **POD-03** Document Types | 21, 23 | 044 | 6, 11, 11.2 |
| **POD-04** Change Categories | 13 | 045 | 6, 11, 11.2, 14.4 |
| **POD-05** Vendor baseline | 15 | — (canonical in Spec v2.0 §20) | 6, 11, 21 (CM-06) |
| **POD-06** Operational policies | 06, 12 | 026, 027, 039 | 14.3, 14.4, 21 (CM-05) |
| **POD-07** Service Category behaviour | 01, 06, 30 | 043 | 14.3, 14.4, 15, 21 (CM-07) |
| **POD-08** Template change and archive | 23, 30, 31 | 038, 041 | 6, 10.1, 10.7, 14.1, 15, 16 |
| **PD-A** Conversion completeness | 06 | 027 | 14.4 |
| **PD-B**, **O-A2**–**O-A4** Replacement inheritance | 06, 12 | 039, 046 | 14.3, 21 (CM-08) |
| **O-A5** Proposal review guidance | — | 047 | 14.2 |
| **PD-C** Legacy Service Category | — | 036, 043 | 14.2 |
| **PD-D** Vendor Code | 15 (via Spec) | — (canonical in Spec v2.0 §20) | 6 |
| **PD-E** No unarchive | 31 | 038 | confirms POD-08 |

---

## 14. Business Rules (Revision 2; Revision 3 amendments marked)

### 14.1 Existing rules applied

As in Revision 1: `BR-002`–`009`, `BR-012`, `BR-013`, `BR-016`, `BR-017`, `BR-018`, the Single Business Object Principle and `FR-VM-04`. Two are refined:

- **`BR-024`** (Travel Date Deferral) is refined by D-02: the booking/confirmation point is now the Journey Planning → Journey conversion. See CM-01.
- **`BR-006`** (archive is reversible) is **refined for Journeys by POD-08**: in Release 1.3 an Archived Journey is read-only and cannot be restored; any future restoration will be an administrative operation. `BR-006` is unchanged for other Workspace records.

### 14.2 WS13 rules

| Rule | Category | Statement (Revision 2) | Source | Change |
|---|---|---|---|---|
| **BR-025** | Status transitions | **Journey lifecycle.** Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed. Supporting states: On Hold (pause), Cancelled (terminal) and Superseded (terminal). Archived is an administrative state outside the lifecycle. Only Section 10.2 transitions are allowed. | D-01, D-08, D-13 | Revised |
| **BR-026** | Journey ownership | **No unassigned Journey.** Every Journey has an owner from creation: the Journey Planning owner at conversion. **Conversion of a Journey Planning Record that has no assigned Journey Owner is rejected, and the user receives a validation message.** Ownership may be reassigned at any time before a terminal outcome. Every ownership change is audited. | D-03; POD-06 Policy 1 | Revised (was the "Ownership Gate"); **Rev 3: rejection behaviour added** |
| **BR-027** | Validation | **Confirmed Travel Dates at confirmation.** A Journey may not be created without a Confirmed Travel Start Date and End Date (End ≥ Start). The dates are captured in Journey Planning before the record closes as Confirmed. **At conversion the Number of Nights must be present (a missing value blocks conversion), and the Confirmed Travel Dates are validated against it; if they are inconsistent, conversion is blocked and the user must resolve the mismatch. Neither value is corrected automatically.** | D-02; POD-06 Policy 2; PD-A | Revised (gate moved from leaving Confirmed to conversion); **Rev 3: dates–nights consistency and nights required added** |
| **BR-028** | Status transitions | **Readiness gate.** A Journey cannot enter Ready to Travel while any **Mandatory applicable** item of its active Readiness Template is Outstanding. **Optional items never block readiness.** Not Applicable with a reason, available on the items the template permits, counts as resolved. **Readiness is calculated dynamically from the template and item statuses and is never stored.** | `PO-REVIEW-04` §6; D-04; POD-01 | **Rev 3: Mandatory/Optional and calculation added** |
| **BR-029** | Status transitions | **On Hold.** A temporary pause, allowed from Confirmed, In Preparation or Ready to Travel, with a reason. The Journey resumes to its held-from stage, or ends as Cancelled or Superseded. | `PD-JW-004`; D-01 | Revised (adds Superseded as an exit) |
| **BR-030** | Status transitions | **Terminal outcomes.** Journey Closed (only from Post Travel), Cancelled (reason; allowed from Confirmed through Travelling, or On Hold) and Superseded (`BR-039`) are final and irreversible. Archived is not a terminal outcome (`BR-038`). A traveller returning after cancellation starts a new Journey Planning Record. | D-01, D-08 | Revised |
| **BR-031** | Workspace rule | **Material elements immutable.** A Journey's destination, confirmed travel dates, number of nights and traveller count cannot be changed on the Journey. Any material change follows `BR-039`. | `PD-JW-004`; D-06 | Revised (extended from destination only) |
| **BR-032** | Workspace rule | **Operational versus material change.** Changes that do not affect commercial agreements, pricing, vendor commitments, traveller composition or travel schedule are Change Records on the same Journey. Material changes (meal plan, hotel room type, destination, nights, travel dates, traveller count, hotel category, flight class, major itinerary changes) are never Change Records. They follow `BR-039` in Release 1.3; the in-place amendment capability is `PEB-001`. | D-06 | Revised |
| **BR-033** | Workspace rule | **Booking history preservation.** Vendor Bookings are never deleted or overwritten. Booked requires a booking reference. | `PD-JW-006`; D-07 | Unchanged in substance |
| **BR-034** | Validation | **Journey party.** A Journey carries exactly one of Traveller or Corporate Point of Contact, inherited at conversion and never changed. This is distinct from the Primary Operational Contact (`BR-040`). | WS12 Decision 2; D-12 | Clarified |
| **BR-035** | Visibility / permissions | **Collaborative visibility, owner-scoped change.** Every Workspace User can view every Journey. Changes are limited to the owner and Administrators. There is no "claim" action on Journeys (`BR-026`). | Data Architecture §5; D-03 | Revised |
| **BR-036** | Default behaviour | **Legacy Journey adoption.** Journeys created before WS13's release are adopted as part of release: owner = the originating planning record's owner (an Administrator assigns one if absent), confirmed dates recorded, Readiness Template assigned, stage = Confirmed, and Primary Operational Contact initialised from the party. Until adopted, a legacy Journey is flagged "Incomplete legacy record" and cannot progress. No historical data is lost. **A legacy Journey may remain without a Service Category until it enters the Journey Workspace through adoption. During adoption, the Journey Owner must explicitly assign the Service Category. No automatic classification or backfilling occurs (PD-C, clarified by O-13).** | F-02; D-02, D-03; PD-C; O-13 | Revised; **Rev 3: legacy Service Category (PD-C)** |
| **BR-037** | Status transitions | **Vendor Booking lifecycle.** Draft → Requested → Pending Information → Confirmed → Booked, with Cancelled terminal (Section 11.1). There is no "Amended" status: a change to a Confirmed or Booked booking returns it to Requested until reconfirmed. | D-07 | **New** |
| **BR-038** | Workspace rule | **Archive is administrative.** Archived is outside the lifecycle and never changes stage or outcome. Authorised users may archive at any time, with a reason; user, timestamp and audit entry are recorded. A Journey becomes Archive Eligible when it has been Journey Closed for longer than the configured retention period (Release 1.3 default 60 days), and authorised users are then reminded. **An Archived Journey remains viewable, searchable and available for reporting and audit, and is read-only. Restoration is outside Release 1.3; any future restoration is an administrative operation.** | D-08; POD-08 Decision 2 | New; **Rev 3: read-only; restoration outside Release 1.3 (replaces "reversible, `BR-006`")** |
| **BR-039** | Workspace rule | **Material replacement and supersession.** When a material change requires a replacement Journey: the original is placed On Hold; a linked Journey Planning Record is created and follows standard planning; its conversion creates the replacement Journey (preserving `BR-012`); the original is marked **Superseded** (not Cancelled) with reason "Material Amendment"; the two Journeys are linked both ways; and the replacement continues the operational lifecycle. **The replacement Journey Planning Record defaults to Origin Channel = Existing Traveller and stage = Lead Created, inherits the Journey Owner, and receives an auto-generated title that references the original Journey. Traceability is through the replacement relationship; no new lifecycle stage is introduced. The replacement inherits the original Journey's approved operational context (`BR-046`).** | D-13, `PD-JW-004`; POD-06 Policy 3; PD-B | New; **Rev 3: replacement defaults added** |
| **BR-040** | Validation | **Primary Operational Contact.** Each Journey has exactly one Primary Operational Contact in Release 1.3, of type Individual traveller, Corporate organisation, B2B travel partner or Other authorised coordinating entity. It is distinct from the Journey Owner and the Traveller(s). Changes are audited. | D-12 | **New** |
| **BR-041** | Validation | **One active Readiness Template.** Each Journey uses exactly one active Readiness Template, assigned before it leaves Confirmed. Templates are configuration (Domestic and International defaults) and extensible without code. **Each template defines Mandatory Items and Optional Items and marks which items permit Not Applicable. The framework supports further templates in future without change to these rules. When a Journey's template changes, template-generated items are recalculated according to the new template; manually created items are retained and are never removed automatically.** | D-04; POD-01; POD-08 Decision 1 | New; **Rev 3: template structure and template-change behaviour added** |
| **BR-042** | Workspace rule | **Configurable, low-overhead alerts.** Alert conditions, thresholds, windows and the archive retention period are configuration with Release 1.3 business defaults, never hard-coded. Reminders exist to reduce operational effort, so no alert may duplicate another for the same condition. | D-05, D-08 | **New** |
| **BR-043** | Validation | **Primary Service Category.** Each Journey has exactly one primary Service Category from the configured Service Category list (§11.2). **Exception:** a legacy Journey may remain unclassified until adoption, when the Journey Owner must explicitly assign it (`BR-036`, PD-C, O-13). Service Category is **optional during Journey Planning** and **mandatory before Journey conversion**. After creation it may be changed by an authorised Workspace user (the owner or an Administrator), and every change is recorded in the Journey History. A change of Service Category is a business classification, not a structural change, so it never requires a Replacement Journey. The Service Category classifies the traveller experience only; destination geography is recorded independently and is never derived from, or constrained by, the Service Category. The Service Category does not select the Readiness Template. | POD-02; POD-07; PD-C; O-13 | **New (Rev 3)** |
| **BR-044** | Validation | **Document Types and Journey Documents.** Document Types are configurable master reference data, grouped by the categories in §11.2. Every Journey Document references exactly one Document Type, and one Document Type may be referenced by many Journey Documents on the same Journey. The Journey's Readiness Template determines whether a Document Type is Mandatory, Optional or Not Applicable for that Journey. No document content is stored in Release 1.3. | POD-03, D-10 | **New (Rev 3)** |
| **BR-045** | Workspace rule | **Change Category is classification only.** Every Change Record carries one Change Category from the configured list (§11.2). The category describes the nature of the change. It never determines whether a change is operational or material (`BR-032` does), and it never triggers a Replacement Journey, an Operational Update or a Readiness Update. | POD-04 | **New (Rev 3)** |
| **BR-046** | Workspace rule | **Replacement Journey inheritance.** A Replacement Journey Planning Record, and the Replacement Journey it converts into, inherit the approved operational context of the original Journey, so that planning restarts from what was agreed rather than from nothing. The inherited context is: the travel dates and trip parameters as editable defaults; the party, destination and Service Category; the accepted itinerary as the starting proposal (Version 1); the Operational Notes; a vendor quotation baseline; and, at conversion, the Primary Operational Contact and the Journey Documents. **Vendor quotations:** only vendor bookings in **Booked** status generate replacement quotations (Confirmed-but-not-Booked bookings are not converted), and only for vendors whose lifecycle is **Active** (inactive vendors generate none). **Journey Documents:** on replacement conversion, a **Verified** document becomes **Received** and a **Not Applicable** document becomes **Outstanding**, so every Replacement Journey goes through an operational document review after a material change. Historical records of the original Journey are never altered. The technical mapping is defined in `EBC-R1.3-WS13-004A` §4 and is not repeated here. | PD-B; O-A2; O-A3; O-A4 | **New (Rev 3, final sync)** |
| **BR-047** | Operational guidance | **Review the carried proposal before sharing.** The proposal copied into a Replacement Journey Planning Record is the planner's starting point. Workspace users are expected to review and update it before sharing it with the traveller. This is an **operational expectation, not a system-enforced workflow**: Release 1.3 adds no rule requiring Version 1 to be revised before sharing. Any future enforcement will be considered in a later release. | O-A5 | **New (Rev 3, final sync)** |

### 14.3 Default behaviour

| Behaviour | Default | Source |
|---|---|---|
| Stage at creation | Confirmed | D-01 |
| Owner at creation | Journey Planning owner (never unassigned) | D-03 |
| Service Category | Optional in Journey Planning; required at conversion and carried to the Journey (`BR-043`) | POD-07 |
| Travel dates at creation | Always present (captured in Journey Planning) | D-02 |
| Primary Operational Contact at creation | The originating record's party: the Traveller (type Individual traveller) or the Corporate Point of Contact (type Corporate organisation). Editable afterwards. **Replacement Journey:** carried from the original Journey's current Primary Operational Contact (`BR-046`). | D-12, I-04, PD-B |
| Readiness Template | Proposed from the destination's domestic or international classification where known; confirmed by the owner before leaving Confirmed | D-04 |
| Active Journeys list | Journeys not terminal and not Archived (On Hold marked), sorted by start date | Revision 1 |
| Alert thresholds and windows | Configuration defaults in Section 16 | D-05 |
| Archive retention | 60 days after Journey Closed (configurable) | D-08 |
| Replacement Journey Planning Record (material change) | Origin Channel Existing Traveller; stage Lead Created; owner inherited; auto-generated title referencing the original Journey (`BR-039`) | POD-06 |
| Vendor lifecycle on migration | Existing imported Vendors default to Active unless explicitly overridden (Spec v2.0 §20) | POD-05 |

### 14.4 Validation rules

| Category | Rule |
|---|---|
| Creation | Only via conversion; one Journey per planning record; owner, confirmed dates and Service Category required; no owner → conversion rejected with a validation message; Number of Nights missing, or dates inconsistent with it → conversion blocked until resolved, never auto-corrected (`BR-012`, `BR-026`, `BR-027`, `BR-043`) |
| Party / Primary Operational Contact | Party inherited and immutable (`BR-034`). Exactly one Primary Operational Contact with a valid type (`BR-040`). |
| Material fields | Destination, dates, nights and traveller count are not editable (`BR-031`) |
| Stage | Only D-01 values; only allowed transitions (`BR-025`) |
| Gates | Template (`BR-041`), readiness on Mandatory applicable items only (`BR-028`), start date for Travelling, end date for Travel Complete |
| Hold / closure | Reasons for On Hold, Cancelled and Superseded; no reopen (`BR-029`, `BR-030`, `BR-039`) |
| Archive | Reason required; user and timestamp captured. Every change to an Archived Journey is rejected (read-only). No unarchive in Release 1.3 (`BR-038`) |
| Vendor Booking | Active Vendor; service type required (Vendor Service Type list); Section 11.1 transitions only; Booked needs a reference; Pending Information and Cancelled need a reason (`BR-037`) |
| Document Readiness | Document Type (from reference data) and traveller(s) required; status from the defined set; external link must be a well-formed URL; no file content accepted (D-10, `BR-044`) |
| Change Record | Change Category required, from the configured list (`BR-045`). Material changes are rejected by the `BR-032` criteria, never by the category (`BR-032`, `BR-045`) |
| Feedback | Field-specific messages, several at once (PRA-01 precedent) |

---

## 15. Permissions (Revision 2)

| Capability | Workspace User | Administrator |
|---|---|---|
| View any Journey, the list, the Timeline, terminal and Archived Journeys | ✅ | ✅ |
| Search and filter | ✅ | ✅ |
| ~~Claim an unowned Journey~~ (no unowned Journeys, D-03) | — | — |
| Assign own Journey to another user (before a terminal outcome) | ✅ (owner) | ✅ |
| Reassign any Journey (before a terminal outcome) | ❌ | ✅ |
| Maintain Primary Operational Contact, Service Category (POD-07), bookings, documents, readiness, notes, activities, Change Records, template | ✅ (owner) | ✅ |
| Tasks and Follow-ups | ✅ (owner; assignees complete their own) | ✅ |
| Advance or step back a stage; On Hold / resume; initiate the material replacement path | ✅ (owner) | ✅ |
| Close as Journey Closed or Cancelled | ✅ (owner) | ✅ |
| Archive (authorised users, D-08). Unarchive is not available in Release 1.3 (POD-08). | ❌ | ✅ (I-03) |
| Delete Journey data; create a Journey directly | ❌ | ❌ |

**Archived Journeys (POD-08):** every change capability above is unavailable on an Archived Journey, for all roles. Viewing, search, reporting and audit remain available.

---

## 16. Operational Alerts (Revision 2, D-05)

All thresholds and windows are **configuration** with the Release 1.3 business defaults below. Changing them requires no product or code change (`BR-042`). Coverage follows D-05: journey milestones, payment reminders, traveller follow-ups and operational tasks, plus the vendor, document, hold and archive conditions already in scope.

| # | Coverage | Condition | Type | Recipient | Resolves when | R1.3 default (configurable) |
|---|---|---|---|---|---|---|
| ~~AL-01~~ | — | ~~Journey unclaimed~~ **Retired**: no unassigned Journeys (D-03) | — | — | — | — |
| AL-02 | Legacy | Legacy Journey not yet adopted (`BR-036`) | Action Required | Administrators | Adopted | On release |
| AL-03 | Journey milestone | Departure within the readiness window and readiness not Ready | Action Required | Owner | Ready, On Hold, or terminal | 14 days before start |
| AL-04 | Document readiness | Required document Outstanding within the document window | Action Required | Owner | Received, Verified or N/A | 21 days before start |
| AL-05 | Vendor booking | Booking in Requested or Pending Information beyond the threshold | Action Required | Owner | Confirmed, Booked or Cancelled | 3 days in status |
| AL-06 | Journey milestone | Start date reached, Journey not Travelling | Action Required | Owner | Travelling, On Hold or terminal | On start date |
| AL-07 | Journey milestone | End date passed, Journey still Travelling | Action Required | Owner | Travel Complete or terminal | 1 day after end |
| AL-08 | Journey milestone | Travel Complete or Post Travel not progressed beyond the threshold | Action Required | Owner | Journey Closed | 7 days after end |
| AL-09 | Operational | On Hold beyond the threshold | Action Required | Owner and Administrators | Resumed or terminal | 14 days on hold |
| AL-12 | **Payment reminder** | Payment-category Task or Follow-up due or overdue (I-01) | Action Required | Assignee | Task or Follow-up completed or cancelled | On due date |
| AL-13 | **Traveller follow-up** | Traveller-follow-up-category Follow-up due or overdue | Action Required | Assignee | Completed | On due date (reuses `FR-NOT-02`) |
| AL-14 | **Operational task** | Operational Task due or overdue | Action Required | Assignee | Completed or cancelled | On due date |
| AL-16 | Operational | Journey Owner's user account deactivated (the Journey stays assigned until reassigned, D-03) | Action Required | Administrators | Reassigned | On deactivation |
| AL-15 | Archive | Journey Archive Eligible (Closed more than the retention period) | Action Required | Authorised users (I-03) | Archived | 60 days after Journey Closed |
| IN-01–04 | — | Confirmed; assigned or reassigned; On Hold or resumed; Closed or Cancelled | Informational | Owner | Acknowledged | — |
| IN-05 | — | Journey Superseded (with a link to its replacement) | Informational | Owner(s) of both Journeys | Acknowledged | — |
| IN-06 | — | Journey archived | Informational | Owner | Acknowledged | — |

AL-03 to AL-08 are suspended while a Journey is On Hold. Every AL alert resolves automatically when the Journey reaches a terminal outcome, except AL-15.

---

## 17. KPI Definitions (Revision 2)

| KPI | Definition | Scope |
|---|---|---|
| **Active Journeys** | Journeys not in a terminal outcome and not Archived, including On Hold | My Work: owned by the viewer. Team: all. |
| **Upcoming Departures** | Active, not-On-Hold Journeys whose start date is within the configurable departure window (default equal to the AL-03 readiness window). This resolves `OQ-030`. | As above |
| **Pending Vendor Confirmations** | Vendor Bookings in Requested or Pending Information on active, not-On-Hold Journeys | As above |
| **Tasks Due Today** (contributes) | Open Journey Tasks and Follow-ups, including the Payment category, due today or overdue | Assignee |
| New Leads | Journey Planning (WS12), unchanged | — |

The Dashboard areas (D-09) and their sources are specified in `FR-JW-32`.

---

## 18. Search and Filters

As Revision 1. Search keys add **Primary Operational Contact**. Filters: outcome = Journey Closed / Cancelled / Superseded; Archived yes/no. Stage values follow D-01. The Owner filter options are Mine or a named user; the Unclaimed option is removed.

## 19. Journey Timeline

As Revision 1. The event list follows `FR-JW-30` (Revision 2). The Supersedes / Superseded-by link is shown at the top of both Journeys' Timelines.

---

## 20. Exception Scenarios (Revision 2)

| # | Exception | Expected behaviour |
|---|---|---|
| E-01 | Partial failure after conversion | As Revision 1 |
| E-02 | Vendor becomes Inactive mid-booking | The booking stays actionable; no new bookings can use that Vendor |
| E-03 | Travel dates need to change | **Material change** → `BR-039` replacement path. Dates are not edited in place (D-06). |
| E-04 | Readiness regresses after Ready to Travel | Item re-opens; AL-03; the owner may step back to In Preparation |
| E-05 | Trip aborted during travel | Cancelled with a reason |
| E-06 | Owner deactivated | The Journey keeps its owner (never unassigned). Administrators receive AL-16 to reassign. The Journey remains assigned until then. |
| E-07 | Material change requested while Travelling | Not permitted (On Hold is not allowed while Travelling). Record an Activity and, where required, start a new Journey Planning Record after travel. |
| E-08 | Traveller cancels, returns later | A new Journey Planning Record is created; the Cancelled Journey stays closed |
| E-09 | Journey created in error | An authorised user archives it at any time, with a reason (`BR-038`) |
| E-10 | Replacement planning record is Lost or Archived in Journey Planning | The original Journey stays On Hold (not Superseded). The owner resumes or cancels it; AL-09 reminds them. |
| E-11 | Booked service changes (operational) | The booking re-enters Requested (`BR-037`) and progresses again |

---

## 21. Integration Points and Cross-Module Impacts

Integration points are unchanged from Revision 1, with Vendor Management now "WS16 owns Vendors; WS13 owns Journey Vendor Bookings" (D-07). **Cross-module product impacts created by the approved decisions**, recorded so no contradiction is left silent:

| ID | Impact | Affected artefact | Handling in this synchronisation |
|---|---|---|---|
| **CM-01** | D-02 requires confirmed travel start and end dates **before** a Journey Planning Record may close as Confirmed. This refines WS12's `FR-JP-36` / `BR-024` ("Intended Travel Date … mandatory only at the booking/confirmation stage, outside Journey Planning"). The confirmation point now sits at the end of Journey Planning's Decision stage. | `EBC-R1.3-WS12-003` (Journey Planning BA), a product artefact | **Revision 3 note added** to WS12-003: `FR-JP-36` and `BR-024` are marked *refined by D-02 / BR-027*. No WS12 FR or BR is renumbered or deleted. **Implementation of the gate in the WS12 conversion is an Engineering change for Tiger to schedule.** WS12 remains closed. |
| **CM-02** | D-13 requires Journey Planning to create a planning record linked to an On Hold Journey and, on conversion, to mark the original Journey Superseded | WS12 creation and conversion behaviour | Recorded here and in the WS12-003 Revision 3 note. Architecture and Engineering are for Archie and Rad. |
| **CM-03** | D-09 removes the "Create Journey" Dashboard quick action. It was shipped in WS11 as a ratified label (PRR-R1.3-WS11-001). | WS11 Dashboard (UI) | Product decision recorded (`FR-JW-05`, `FR-JW-32`). The UI change belongs to Sophie and Rad. No UX document was modified. |
| **CM-04** | D-01, D-08 and D-13 refine `PD-JW-005` (outcomes) and close Spec v2.0 §10.2 (Phase 2 stages, `OQ-004`) | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §6.4, §7.4, §10.2, §14 | **Additive §19 synchronisation note** added to the Specification, pointing to this baseline. No existing text rewritten. |
| **CM-05** | POD-06 Policies 1 and 2 add validations to the Journey Planning → Journey conversion (no owner → reject; dates inconsistent with nights → block). Policy 3 sets the defaults of the replacement planning record created under CM-02. | WS12 conversion and replacement-record creation (engineering) | Recorded in `BR-026`, `BR-027`, `BR-039`. The WS12 product documentation is not changed (it stays historically correct). Implementation is an Engineering dependency alongside CM-01 and CM-02. **Policy 2 overrides Architecture default PD-ARC-02 (warn only)**; see the 003A summary, O-01. |
| **CM-06** | POD-05 sets the Vendor baseline (lifecycle migration default, Vendor Code, minimum attributes, Release 1.3 limits). The Vendor object is owned by WS16 and defined in Spec v2.0 §7.7. | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | **Additive §20 note** added to the Specification, the canonical source. Not repeated in this document. |
| **CM-07** | POD-07 makes Service Category an optional Journey Planning field that must be present at conversion | WS12 Journey Planning capture and conversion (UX and engineering) | Recorded in `BR-043` and `FR-JW-06` AC8. The WS12 product documentation is not changed (it stays historically correct). Capture in Journey Planning is a UX and Engineering dependency, alongside CM-05. |
| **CM-08** | PD-B and O-A2 to O-A5 define what a Replacement Journey Planning Record inherits, including Journey Planning data (proposal Version 1, notes, vendor quotations) | WS12 Journey Planning data (engineering; mapping in `EBC-R1.3-WS13-004A`) | Recorded in `BR-046` and `BR-047`. The WS12 product documentation is not changed (it stays historically correct). |

## 22. Non-Functional Requirements

Unchanged. `NFR-WS-001`–`007` apply.

---

# PART C — TRACEABILITY

## 23. Requirements Traceability (Revision 2; Revision 3 amendments marked)

All rows trace to Feature `FEAT-R1.3-013`, Workstream WS13 and the Product Vision (Spec §2: **V1** single operational workspace, **V2** daily decision support, **V3** single source of truth, **V4** collaboration, **V5** operational visibility). Status for every row: **Approved, baseline synchronised by `001B`**, pending `001C` verification.

| FR | Vision | Product decision(s) | Business rules | Screen(s) |
|---|---|---|---|---|
| FR-JW-01 | V1, V3 | Spec §6.4; D-12; POD-02; POD-07 | BR-005, BR-040, BR-043 | JW-02 |
| FR-JW-02 | V3, V5 | PD-JW-006 | NFR-WS-004 | JW-08 |
| FR-JW-03 | V4, V5 | Spec §6.4; D-03 | BR-026, BR-035 | JW-01 |
| FR-JW-04 | V3 | Spec §6.4 | BR-005 | JW-02 |
| FR-JW-05 | V3 | PD-JW-001; D-09 | BR-012 | JW-01; DASH-01 |
| FR-JW-06 | V3 | PD-JW-001; D-02; D-12; DEC-R1.3-014; POD-06; POD-07; PD-A; PD-B | BR-012, BR-026, BR-027, BR-034, BR-040, BR-043, BR-046 | JW-02, JW-03 |
| FR-JW-07 | V2, V5 | PD-JW-001; D-03 | BR-025, BR-026 | JW-01 |
| FR-JW-08 | V2 | PD-JW-005; D-01; D-13 | BR-025 | JW-02, JW-08 |
| FR-JW-09 | V2 | D-01; D-04; POD-01 | BR-004, BR-028, BR-041 | JW-02, JW-05 |
| FR-JW-10 | V2 | PD-JW-004 | BR-029 | JW-02 |
| FR-JW-11 | V3 | PD-JW-005; D-01; D-08 | BR-030 | JW-02 |
| FR-JW-12 | V3 | PD-JW-004; D-06; D-13; POD-06; PD-B; O-A2–O-A4 | BR-031, BR-039, BR-012, BR-046 | JW-02 → JP-02 |
| FR-JW-13 | V3 | PD-JW-003; D-06; POD-04 | BR-032, BR-037, BR-045 | JW-02 |
| FR-JW-14 | V2 | D-02; D-06 | BR-027, BR-031 | JW-02 |
| FR-JW-15 | V1, V3 | PO-REVIEW-04 §6; D-07; POD-05 | BR-033, BR-037 | JW-04 |
| FR-JW-16 | V3 | PD-JW-006; D-07 | BR-033, BR-037 | JW-04 |
| FR-JW-17 | V5 | FR-VM-03; FR-DASH-05; D-07 | BR-037 | JW-02, JW-04, VM-04 |
| FR-JW-18 | V1 | PO-REVIEW-04 §3 | — | JW-04 |
| FR-JW-19 | V1, V4 | PO-REVIEW-04 §3; D-12 | BR-040 | JW-02 |
| FR-JW-20 | V3 | PD-JW-006 | BR-007 | JW-02 |
| FR-JW-21 | V2 | PO-REVIEW-04 §6; D-10; POD-03 | BR-044 | JW-07 |
| FR-JW-22 | V2, V5 | PO-REVIEW-04 §6; D-04; POD-01 | BR-028, BR-041 | JW-05 |
| FR-JW-23 | V2 | D-04; POD-01; POD-03; POD-08 | BR-018, BR-041, BR-044 | JW-05 |
| FR-JW-24 | V4 | BR-008/009; D-05 | BR-042 | JW-06 |
| FR-JW-25 | V2, V5 | FR-DASH-05 | — | JW-06, DASH-01 |
| FR-JW-26 | V2, V5 | PD-NO-003/004; D-05; D-08 | BR-017, BR-042 | NOT-01, JW-02 |
| FR-JW-27 | V5 | PD-NO-003; D-13 | BR-017 | NOT-01 |
| FR-JW-28 | V2 | PO-REVIEW-04 §9 | BR-017 | JW-01, JW-02 |
| FR-JW-29 | V1 | Topic "search"; D-01; D-08; D-12; D-13 | BR-001 | JW-01, global search |
| FR-JW-30 | V3, V5 | PD-JW-006; D-08; POD-07; POD-08 | NFR-WS-004, BR-043 | JW-08 |
| FR-JW-31 | V3, V4 | BR-007; D-03; D-08; POD-08 | BR-007, BR-026, BR-035, BR-038 | all JW |
| FR-JW-32 | V2, V5 | PO-REVIEW-04 §8; D-09; D-11 | — | DASH-01/02 |
| FR-JW-33 | V5 | D-11 | — | DASH-01/02 |
| FR-JW-34 | V2, V5 | D-01; D-11 | — | JW-01 |

**Reverse checks.** Every `PD-JW-00n` and every D-01 to D-13 decision maps to at least one FR or BR (Section 13.3). Every screen `JW-01`–`08` is used. No new screen is required by the product baseline; relabelling for the D-01 stages and D-07 "Vendor Bookings" is Sophie's in WS13-002.

**RTM:** `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` §16 (v2.1 addendum) has been synchronised to this revision: statuses, `BR-025`–`045`, and Open Question dispositions. Revision 3 changes the traceability of eleven FRs (`FR-JW-01`, `06`, `09`, `12`, `13`, `15`, `21`, `22`, `23`, `30`, `31`) and adds `BR-043`–`045`; no screen mapping changes.

## 24. Implementation Evidence and Gaps (for Archie and Rad)

G-01 to G-07 are as in Revision 1, with these updates. **G-02** now also requires carrying confirmed dates (CM-01) and the initial Primary Operational Contact. **G-08 (new):** conversion must support the D-13 replacement link and supersession (CM-02). **G-09 (new):** configuration storage for Readiness Templates, alert thresholds and archive retention (D-04, D-05, D-08). **G-10 (Rev 3):** reference data for Service Categories, Document Types and Change Categories; Mandatory/Optional and Not-Applicable-permitted flags on template items; the conversion validations and replacement defaults of POD-06 (CM-05); the Vendor baseline of POD-05 (CM-06). Architecture and Engineering are Archie's and Rad's.

---

# PART D — PRODUCT OWNER REVIEW RECORD AND SYNCHRONISATION

## 25. Summary

The Product Owner reviewed and **approved all thirteen decisions** on 24-Sep-2026, several with refinements. Revision 2 synchronises them into this baseline, the RTM, and two additive consistency notes (Spec v2.0 §19 and WS12-003 Revision 3). No requirement beyond the decision record has been introduced.

## 26. Decisions Incorporated

### 26.1 Decision record

| ID | Approved outcome (summary) | Differs from Revision 1 recommendation? | Incorporated in |
|---|---|---|---|
| D-01 | Lifecycle: Confirmed → In Preparation → Ready to Travel → Travelling → **Travel Complete** → Post Travel → **Journey Closed**. On Hold, Cancelled and Archived as supporting states. | Yes: adds Travel Complete, renames the terminal stage, moves Archived out of the lifecycle | §10; BR-025 |
| D-02 | Confirmed travel dates are mandatory **before** Journey confirmation. No Journey without them. | Yes: earlier than recommended (conversion, not on leaving Confirmed) | BR-027; FR-JW-06, 14; CM-01 |
| D-03 | Ownership inherited from Journey Planning; no unassigned Journey; reassignable before closure; audited | As recommended, strengthened | BR-026; FR-JW-03, 07, 31 |
| D-04 | Configuration-driven Readiness Templates (Domestic and International defaults), extensible, one active per Journey | As recommended, formalised | BR-041; FR-JW-22, 23 |
| D-05 | Configurable alerts with simple defaults, covering milestones, **payment reminders**, traveller follow-ups and operational tasks. Reminders reduce effort. | Extended coverage | BR-042; §16; FR-JW-24, 26 |
| D-06 | Operational changes → Change Records. Material changes (listed) → Journey Amendment (`PEB-001`). | Yes: broader material list | BR-031, 032; §10.6; FR-JW-12, 13, 14 |
| D-07 | One Vendor Booking object; Draft → Requested → Pending Information → Confirmed → Booked, Cancelled terminal; no Amended status; WS13 owns bookings, WS16 owns Vendors | Yes: full lifecycle added | BR-037; §11.1; FR-JW-15–17 |
| D-08 | Archived is administrative. Archive Eligible after Journey Closed plus retention (default 60 days). Reminder. Archive any time with reason, user, timestamp and audit. | Yes: not a closing outcome | BR-038; §10.7; FR-JW-11, 26, 31 |
| D-09 | Operational management dashboard; no Journey creation; "Create Journey" removed; focus areas listed | Yes: removal rather than relabelling | FR-JW-05, 32; CM-03 |
| D-10 | Document Readiness: status, required documents, external references and links, notes. No uploads, storage, OCR or versioning. | As recommended, detailed | FR-JW-21; §11 |
| D-11 | `FR-JW-32`–`34` approved; they complete, not expand, WS13 scope | As recommended | §12.10 |
| D-12 | One **Primary Operational Contact** per Journey (individual, corporate, B2B partner, other), distinct from the Owner and the Travellers; multiple contacts in future | Yes: new concept replacing the narrower corporate question | BR-040; FR-JW-01, 06, 19, 29 |
| D-13 | Material replacement: new Journey; original **Superseded** (not Cancelled), reason "Material Amendment"; links both ways; replacement continues | Yes: Superseded rather than Cancelled | BR-039; FR-JW-12, 27; CM-02 |

### 26.2 Interpretations applied (for Tiger's 001C verification)

The decision record is complete, but four points needed exact wording to be testable. Each interpretation stays within the record and reuses already-approved rules.

| ID | Point | Interpretation applied | Why | Needs Product Owner confirmation? |
|---|---|---|---|---|
| **I-01** | "Payments" (D-09) and "payment reminders" (D-05) | In Release 1.3, payments are represented as **Payment-category Tasks and Follow-ups** with due dates. The Dashboard "Payments" area and AL-12 reminders come from them. No payment record, amount ledger, gateway or invoice is introduced. | No payment business object exists in any approved Workspace module; payments were outside WS13's approved evidence. Creating one would introduce a new requirement, which this card forbids. | **Yes: a one-line confirmation.** This is the only product point where a different intent (a real payment object) would change scope. |
| **I-02** | D-06 says material changes "require the future Journey Amendment capability (`PEB-001`)"; D-13 defines replacement | In Release 1.3, **every** material change uses the D-13 replacement path (On Hold → new planning record → replacement Journey → original Superseded). The in-place amendment capability stays `PEB-001`. | Without this, a Release 1.3 material change (e.g., room type) would have no supported path. The replacement path uses only approved decisions (`PD-JW-004`, D-13) and preserves `BR-012`. | No; Tiger can verify. The Product Owner may say otherwise at 001C. |
| **I-03** | "Authorised users" for archive (D-08) | Administrator in Release 1.3 | Follows the ratified conservative default (OQ-001: gated actions are Administrator-only until approved otherwise) and the WS12 precedent (`canArchiveOutsideNormalClosure`). A wider grant is configuration or permission change later. | No |
| **I-04** | Initial Primary Operational Contact (D-12) | Initialised at conversion from the originating record's party (Traveller → Individual traveller; Corporate Point of Contact → Corporate organisation), then editable by the owner | Every Journey must have one, and this reuses data already captured. It avoids re-keying and introduces no new data. | No |

### 26.3 Product Decision Register — Post-Architecture Product Owner Decisions (Revision 3, `EBC-R1.3-WS13-003A`)

Decisions taken by the Product Owner after Architecture Validation (`EBC-R1.3-WS13-003`). They clarify the approved WS13 scope and introduce no new scope. Where they settle a point Archie had defaulted (`PD-ARC-nn`), the relationship is shown. The artefacts that carry each decision are listed in §13.3. POD-07 and POD-08 were approved at Tiger's validation checkpoint for `EBC-R1.3-WS13-003A`.

| ID | Approved decision (summary) | Relation to Architecture defaults | Canonical location |
|---|---|---|---|
| **POD-01** | **Journey Readiness Framework.** Domestic and International Readiness Templates. Readiness is calculated dynamically, never stored, and template-driven. Templates hold Mandatory and Optional Items; only Mandatory applicable items determine readiness, and Optional items never block it. Selected items support Not Applicable. Designed for future template expansion. | Consistent with AD-WS13-002 (templates as configuration) | §11, §11.2; `BR-028`, `BR-041` |
| **POD-02** | **Service Categories.** Initial list: Domestic, International, Weekend Getaway, Honeymoon, Family, Solo, Pilgrimage. Configurable reference data. One primary Service Category per Journey. Categories classify the traveller experience; destination geography stays independent. Future categories supported. | New Journey attribute; not in the Architecture model (O-02) | §11.2; `BR-043` |
| **POD-03** | **Document Types.** Configurable master reference data; binary storage deferred. Readiness Templates decide Mandatory, Optional or Not Applicable. A Journey may hold several Journey Documents of the same Document Type (Document Type → Journey Document, one-to-many). Initial categories: Traveller Identity, Travel, Accommodation, Activities, Insurance & Health, Financial / Booking, Internal Operational. | Consistent | §11, §11.2; `BR-044` |
| **POD-04** | **Change Categories.** Itinerary, Traveller, Accommodation, Transport, Activities, Operational, Documentation. Categories classify the nature of a change; Business Rules determine behaviour. Categories never determine a Replacement Journey, an Operational Update or a Readiness Update. | Consistent | §11.2; `BR-045` |
| **POD-05** | **Vendor Baseline.** Lifecycle Prospective / Active / Inactive; existing imported Vendors default to Active unless explicitly overridden. Minimum attributes: Vendor Code, Vendor Name, Service Type, Destination(s) Served, Address, Phone Number, Email, Contracted Rates Link (Google Drive). Vendor Code is system-generated, immutable and business-friendly; Vendor Name is editable; internal relationships use the system identifier. Initial source: the Product Owner spreadsheet. Release 1.3: no Vendor Creation UI; native document attachments remain future scope. | Consistent with AD-WS13-007 (`lifecycle_state`) | **Spec v2.0 §20** (Vendor object, canonical) |
| **POD-06** | **Operational Policies.** (1) Conversion is rejected when the planning record has no assigned Journey Owner, with a validation message. (2) Conversion validates Confirmed Dates against Number of Nights; a mismatch blocks conversion until the user resolves it; no automatic correction. (3) Replacement Journey Planning defaults: Origin Channel Existing Traveller; stage Lead Created; Journey Owner inherited; auto-generated title referencing the original Journey; traceability through the replacement relationship; no new lifecycle stage. | Policy 1 = PD-ARC-01. **Policy 2 overrides PD-ARC-02 (warn only) with block** (O-01). Policy 3 = PD-ARC-03. | `BR-026`, `BR-027`, `BR-039`; §14.3, §14.4 |
| **POD-07** | **Service Category Operational Behaviour.** Optional during Journey Planning; mandatory before Journey conversion. Every Journey has exactly one primary Service Category. It may be updated after creation by an authorised Workspace user, and every change is recorded in the Journey History. A change does not require a Replacement Journey, because it is a business classification rather than a structural change. | New planning field and conversion check (CM-07); resolves O-02 and I-07 | `BR-043`; §14.3, §14.4, §15 |
| **POD-08** | **Readiness Template and Archive Behaviour.** (1) On a template change, manually created items are retained, template-generated items are recalculated for the new template, and manually added operational items are never removed automatically. (2) Archived Journeys remain viewable, searchable and available for reporting and audit, and become read-only. Future restoration would be an administrative operation and is outside Release 1.3. | Decision 1 = PD-ARC-04 (template). Decision 2 confirms read-only, but **removes unarchive from Release 1.3**, which UX JW-14 and Architecture (`…_unarchive`) still include (O-09). Resolves O-05. | `BR-038`, `BR-041`; §10.1, §10.7, §15 |

**Architecture Clarification decisions (`EBC-R1.3-WS13-004A`, accepted 27-Sep-2026).** Approved by the Product Owner during the Architecture Clarification and recorded here as the final WS13 Product synchronisation. The technical mapping stays in `EBC-R1.3-WS13-004A`.

| ID | Approved decision (summary) | Relation | Canonical location |
|---|---|---|---|
| **PD-A** | Conversion requires owner, Service Category, Number of Nights and Confirmed Dates, all present and consistent; otherwise conversion is blocked | Completes POD-06 and POD-07 (nights must be present) | `BR-027`; `FR-JW-06` AC7 |
| **PD-B** | Replacement Journey Planning inherits the approved operational context of the original Journey, using the implementation approach defined by Architecture | 004A AC-01 to AC-07 | `BR-046`, `BR-039` |
| **PD-C** | Legacy Journeys without a Service Category stay unclassified until explicitly classified. **Clarified (O-13):** they may remain without one until adoption; during adoption the Journey Owner must explicitly assign it; no automatic classification or backfilling | Exception to POD-07 "exactly one" for legacy Journeys | `BR-036`, `BR-043` |
| **PD-D** | Vendor Code `VEN-XXXXX`, **clarified (O-12) as `VEN-00001`**: five numeric digits, sequential, zero-padded; system-generated, immutable after creation, unique business identifier, independent of Vendor Service Type | Completes POD-05 | **Spec v2.0 §20** |
| **PD-E** | Journey unarchive is out of Release 1.3 | Confirms POD-08 | `BR-038` |
| **O-A2** | Replacement quotations only for vendors whose lifecycle is Active; inactive vendors generate none; historical Journey records unchanged | 004A AC-05 default accepted | `BR-046` |
| **O-A3** | Only Booked vendor bookings generate replacement quotations; Confirmed-but-not-Booked are not converted | 004A AC-05 default accepted | `BR-046` |
| **O-A4** | On replacement conversion, Verified documents become Received and Not Applicable documents become Outstanding | 004A AC-06 default accepted | `BR-046` |
| **O-A5** | No workflow rule requires Version 1 to be revised before sharing; users are expected to review and update it (operational expectation, not system-enforced) | 004A O-A5 | `BR-047` |

### 26.4 Interpretations applied in Revision 3 (for Tiger's validation)

| ID | Point | Interpretation applied | Why | Needs Product Owner confirmation? |
|---|---|---|---|---|
| **I-05** | "Consistent" dates and nights (POD-06 Policy 2) | Consistent means End Date minus Start Date, counted in nights, equals Number of Nights | The usual travel-industry reading; it is the only definition that makes the check testable | No; Tiger can verify |
| **I-06** | "Service category" on a Vendor Booking (Revision 2) versus POD-02 Service Category | The Vendor Booking field is renamed **service type** and takes its values from the POD-05 Vendor Service Type list. The Journey's Service Category (POD-02) is a different list. | Two lists with the same name would confuse users and data; POD-05 already names the vendor-side attribute "Service Type" | No; terminology alignment only |
| **I-07** | When the primary Service Category is set (POD-02) | **Resolved by POD-07:** optional in Journey Planning, mandatory at conversion, editable afterwards with history | — | No (decided) |
| **I-08** | "Authorised Workspace user" who may change the Service Category (POD-07) | The Journey Owner or an Administrator, as for every other Journey change (`BR-035`) | Reuses the approved permission model; introduces no new role | No; Tiger can verify |
| **I-09** | "Explicitly classified" (PD-C) for a legacy Journey | **Resolved by the Product Owner clarification O-13:** classification happens at adoption, by the Journey Owner, explicitly; no automatic classification or backfilling | — | No (decided) |

## 27. Open Questions — Disposition

| ID | Question | Disposition |
|---|---|---|
| OQ-023 | Is Spec §7.9 "Booking" the same as Vendor Booking? | **Resolved by D-07.** One object, Vendor Booking. |
| OQ-024 | Human-readable Journey reference format | **Reclassified to Architecture (Archie).** Not a product ambiguity; does not block UX. |
| OQ-025 | Journey stores its own trip parameters or reads the planning record | **Reclassified to Architecture (Archie).** The business rule is already fixed: the closed planning record never changes (FR-JW-06 AC4). |
| OQ-026 | Meaning of "Verified" | **Resolved by D-10 synchronisation.** Verified = the owner has checked the document is valid for this Journey (FR-JW-21 AC5). |
| OQ-027 | Per-traveller documents without Traveller Hub companions | **Resolved by D-10.** Required documents can be per Journey or per named traveller. Where companions are not individually recorded, the entry names the traveller in its notes. |
| OQ-028 | Must open tasks or bookings be resolved before Journey Closed? | **Resolved by D-01.** The approved lifecycle defines no such gate: Post Travel → Journey Closed is an owner action. Open Tasks and Follow-ups remain visible in their own queues. |
| OQ-029 | Vendor cancellation costs | **Resolved as out of scope.** No payment or commercial object in Release 1.3 (I-01). Captured as notes on the Cancelled booking. |
| OQ-030 | Upcoming Departures window | **Resolved by D-05.** A configurable window, defaulting to the readiness window (Section 17). |

Existing register items: **OQ-004 closed** (D-01). **OQ-017 closed** (D-02). **OQ-022 answered for Journey Workspace** (D-03). OQ-008 (delivery channel, in-Workspace only) and OQ-001 (fine-grained role matrix; Release 1.3 uses the conservative default, I-03) remain Workspace-wide items, **neither blocking WS13 UX**.

### 27.2 Earlier approved decisions refined by the record

| Earlier decision | Refinement | Treatment |
|---|---|---|
| `PD-JW-005`: outcomes Successfully Completed / Cancelled / Archived | Successful completion becomes **Journey Closed**; Archived becomes administrative (D-08); Superseded added (D-13) | Recorded here and in Spec v2.0 §19 (additive) |
| `PD-JW-004`: material destination change → On Hold + new planning record | Extended to all material changes, and the original ends **Superseded** (D-06, D-13) | BR-039 |
| `FR-JP-36` / `BR-024` (WS12): travel date mandatory only after Journey Planning | Now mandatory before confirmation (D-02) | WS12-003 Revision 3 note (CM-01) |
| WS11 Dashboard quick action "Create Journey" (ratified 17-Sep-2026) | Removed (D-09) | CM-03 |

## 28. Disclosed Findings — Status

| ID | Finding | Status after Revision 2 |
|---|---|---|
| F-01 | "Create Journey" quick action | Decided (D-09). UI change for Sophie and Rad (CM-03). |
| F-02 | Bootstrap journeys table narrow; legacy Journeys | Rule decided (BR-036). Schema is Archie's. |
| F-03 | PD-JW-003 vs PEB-001 | Decided (D-06, D-13; I-02). |
| F-04 | Business Lifecycle terminology | Unchanged. Tiger housekeeping, non-blocking. |
| F-05 | No Journey audit event at conversion | Unchanged. Rad. |
| F-06 | RTM lacks WS12 FRs | Unchanged. Tiger housekeeping, non-blocking. |
| F-07 | FCR-022 wireframes due now | Unchanged. Tiger / Sophie (WS13-002). |
| F-08 | UX package assumes the old six-stage model | Now definitive: relabel to D-01 in WS13-002. |

## 29. Risks

R-01 to R-06 are as in Revision 1. **R-07 (new):** CM-01 and CM-02 change the closed WS12 conversion; this needs a scheduled engineering card, or WS13 cannot enforce D-02 and D-13. **R-08 (new):** if I-01 is confirmed differently (a real payment object), scope grows beyond WS13's approved 31 + 3 FRs.

## 30. Success Criteria (EBC-R1.3-WS13-001B)

| Criterion | Status |
|---|---|
| All thirteen Product Owner decisions incorporated | ✅ §26.1, §13.3 |
| No Product ambiguities remain | ✅ with one declared item: **I-01 (Payments) awaits a one-line Product Owner confirmation.** I-02 to I-04 are interpretations within approved rules, for Tiger to verify. All WS13 Open Questions are resolved or reclassified to Architecture (§27). |
| RTM complete | ✅ RTM §16 synchronised: 34 FRs, `BR-025`–`042`, OQ dispositions |
| Product artefacts internally consistent | ✅ Section 31 |
| Ready for UX Design | ✅ subject to Tiger's 001C verification and I-01 |

## 31. Consistency Review (Activity 3)

| Pair | Check | Result |
|---|---|---|
| Discovery ↔ FRs | Scope §7 capabilities C-01 to C-16 each map to FRs; exclusions have no FR | Consistent |
| FRs ↔ BRs | Every revised FR cites its rule, and every rule is cited by at least one FR (§23) | Consistent |
| BRs ↔ lifecycle | BR-025, 029, 030, 038 and 039 match §10.1–10.2 exactly | Consistent |
| RTM ↔ this document | 34 FR rows, 18 WS13 BRs and the OQ dispositions match | Consistent |
| WS13 ↔ Workspace Foundation | Reuses ownership, RBAC, audit, notifications and tasks. No Foundation rule contradicted. The Dashboard change is recorded as CM-03. | Consistent (CM-03 pending UI) |
| WS13 ↔ Journey Planning | D-02 and D-13 refine WS12. Recorded in WS12-003 Revision 3 as refinements, not silent changes. BR-012 is preserved. The Journey Amendment boundary (`PEB-001`) is preserved. | Consistent at product level; CM-01 and CM-02 engineering pending |
| WS13 ↔ Spec v2.0 | PD-JW-005 refinement and the Phase 2 closure are recorded in the additive Spec §19 note | Consistent |
| Identifiers | No FR, BR or OQ renumbered; superseded Revision 1 text kept in Appendix A | Consistent |
| Revision 3 ↔ Architecture (`WS13-003`) | POD-01, 03, 04, 05 and POD-06 Policies 1 and 3 are consistent with Archie's model and defaults. POD-06 Policy 2 differs from PD-ARC-02 (the Product Owner decision governs). POD-02 adds a Journey attribute the architecture does not yet hold. | Consistent at product level; **O-01, O-02 for Archie and Sophie** |
| Revision 3 ↔ UX and Architecture on archive | POD-08 removes unarchive from Release 1.3; UX (JW-14, "Unarchive…") and Architecture (`…_unarchive`) still include it | **Product consistent; UX and Architecture alignment needed (O-09)** |
| Revision 3 ↔ WS12 | Policies 1–3 are recorded in WS13 rules; WS12 documents unchanged | Consistent; CM-05 engineering pending |

## 32. Handover to Tiger

Product Synchronisation Summary: `docs/09-Development/EBC-R1.3-WS13-001B-ARJUN-Product-Baseline-Synchronisation-Summary.md`. Tiger's next steps:

1. Product Governance Verification (`EBC-R1.3-WS13-001C`).
2. Obtain the I-01 confirmation.
3. Authorise `EBC-R1.3-WS13-002` (Sophie).
4. At a governance point of Tiger's choosing, schedule the engineering follow-ups for CM-01 and CM-02 and the Release 1.3 governance updates.

## 33. Files Changed (Revision 2)

| File | Change |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` | Revision 2 (this document) |
| `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | §16 addendum synchronised (v2.1) |
| `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | Additive §19 WS13 synchronisation note (CM-04) |
| `docs/09-Development/EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md` | Revision 3 history row and refinement notes on `FR-JP-36` / `BR-024` (CM-01, CM-02) |
| `docs/09-Development/EBC-R1.3-WS13-001B-ARJUN-Product-Baseline-Synchronisation-Summary.md` | Created |

Not modified: UX, Architecture, Engineering, `RELEASE-1.3.md`, Feature Register, Backlog, Workstream Plan and governance documents. Nothing committed or pushed.

### 33.1 Files Changed (Revision 3, `EBC-R1.3-WS13-003A`)

| File | Change |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` | Revision 3 (this document); Revision 2 text of changed rows kept in Appendix B |
| `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | Additive §20 Vendor baseline note (POD-05, CM-06; Vendor Code policy PD-D) and revision rows |
| `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | §16 synchronised: eleven FR rows and seven BR rows amended, `BR-043`–`047` added, revision rows |
| `docs/09-Development/EBC-R1.3-WS13-003A-ARJUN-Product-Documentation-Synchronisation-Summary.md` | Created (handover to Tiger); §8 addendum for POD-07 and POD-08; §9 final synchronisation (WS13-004A decisions) |

Not modified: UX, Architecture, Engineering, WS12 documents, `RELEASE-1.3.md`, Feature Register, Backlog, Document Index, Decision Log and governance documents. Nothing committed or pushed.

---

*Prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi. Revision 2 synchronises the Product Owner's approved decisions D-01 to D-13. Revision 3 synchronises the post-architecture decisions POD-01 to POD-08. No new requirements introduced.*

---

# APPENDIX A — Revision 1 Text (retained verbatim for traceability)

The complete Revision 1 document follows, unchanged. **Where Revision 2 (above) differs, Revision 2 governs.** Sections referred to above as "unchanged" or "as in Revision 1" (sources, reusable components, assumptions, dependencies, scenarios, integration points) are read from here.

## EBC-R1.3-WS13-001 — Journey Workspace Product Discovery & Business Analysis

**Persona:** Arjun — Product and Business Analyst
**Release:** 1.3
**Workstream:** WS13 — Journey Workspace (reserved 18-Sep-2026, `EBC-R1.3-GOV-003` / `DEC-R1.3-012`)
**Feature:** `FEAT-R1.3-013` — SMV Workspace
**Phase:** Product Discovery & Business Analysis (first substantive work under WS13)
**Date:** 24 September 2026
**Status:** **Business Analysis Complete — Pending Product Owner Review and Approval.** This document does not claim Product Owner approval. Every item is labelled Confirmed, Proposed (Arjun), Assumption or Open Question (Section 3). Thirteen Product Owner decisions are required (Part D, Section 26); six of them block UX Design.

---

### 0. Workspace Readiness Check (Project Instructions §14/§15)

| Check | Result |
|---|---|
| Local repository connected | **Yes** — `/Users/viveksophu/Documents/Projects/SearchMyVacation`, granted this session |
| Branch | `main` |
| Last commit | `20cc249` — "feat(ws12): complete Journey Planning workstream" |
| Working tree at session start | Three pre-existing, uncommitted modifications not created by this card: `docs/10-Backlog/RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, `RELEASE-1.3-WORKSTREAM-PLAN.md` (Tiger's WS12-015B governance edits awaiting the Product Owner's commit). Left untouched. |
| Code changes authorised | **No.** Documentation only. No application code, schema, migration or configuration was modified. |
| Repository impact of this card | (1) This document, created at `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md`. (2) An additive WS13 addendum to `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` (RTM v2.0 → v2.1). Both left uncommitted for the Product Owner's review, per §26. |

---

### 1. Executive Summary

Journey Workspace (WS13) is the Workspace's **post-confirmation operational execution module**: it manages a Journey from the moment a Journey Planning Record closes as Confirmed until the Journey closes as Successfully Completed, Cancelled or Archived (`PO-REVIEW-04`, `PD-JW-001`–`006`, Spec v2.0 §6.4/§7.4). Its vision, purpose, primary object, governance and a count of **31 Must-Have Functional Requirements** were approved in the Release 1.3 Product Owner Review; only four of those 31 (`FR-JW-01`–`04`) were ever drafted. This card:

1. Reviews the approved Foundation and WS12 implementation and identifies what WS13 reuses (Section 4).
2. Defines WS13 scope, exclusions, assumptions, constraints and dependencies (Section 7).
3. Documents business processes, lifecycle interactions, navigation flows and ten operational scenarios (Section 9).
4. Proposes the **Phase 2 Journey lifecycle** — the one piece of the Journey model the Product Owner Review left open (Spec v2.0 §10.2, `OQ-004` remainder) — with three options and a recommendation (Section 10).
5. Drafts **`FR-JW-05`–`FR-JW-31`**, completing the approved 31, plus **three proposed additions (`FR-JW-32`–`34`)** needed to satisfy this card's Dashboard / KPI / Recent Activity scope, which require explicit ratification (Section 12).
6. Documents twelve new Business Rules (`BR-025`–`BR-036`), validation rules, a permission matrix, operational alerts, KPI definitions, search/filter specification and Journey Timeline rules (Sections 14–19).
7. Maintains traceability back to Feature Register, Workstream and Product Vision, and updates the Workspace RTM (Part C).
8. Records Product Owner Review Notes: 13 decisions, 8 new Open Questions, 8 disclosed findings (Part D).

**Most material findings (disclosed, not silently resolved):**

- **F-01** — The Workspace Dashboard's shipped Quick Action **"Create Journey"** contradicts `PD-JW-001`/`BR-012` (Journeys cannot be created directly). Decision `D-09`.
- **F-02** — The bootstrap `workspace_journeys` table created by WS12 is narrower than the shape WS12's own approved architecture specified (`EBC-R1.3-WS12-005`): no owner, destination, travel dates, On Hold or Archived status. Every Journey converted since WS12 went live therefore has no owner and no dates. WS13 must extend it (Archie/Rad), not recreate it, and must define how existing Journeys enter the new lifecycle (`BR-036`).
- **F-03** — `PD-JW-003` (minor changes stay in the same Journey — approved for R1.3) and `PEB-001` (Journey Amendment — future, not R1.3) overlap. This card proposes a boundary; decision `D-06`.
- **F-04** — `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md` uses "Journey Workspace" to mean the whole Workspace, "Inquiry" for the pre-sales object, and a `BR-001`–`006` numbering that collides with the Specification's rules. This card treats the Specification v2.0 and `PO-REVIEW-04` as canonical for the module (Section 6).

---

### 2. Sources Reviewed and Precedence

Precedence applied per Project Instructions §17.

| Rank | Source | Use in this card |
|---|---|---|
| 1 | This EBC's own text (Product Owner instruction) | Scope of analysis; required FR areas |
| 2 | `docs/02-Product/reviews/PO-REVIEW-04-Journey-Workspace.md` (Product Owner Approved) | Vision, purpose, `PD-JW-001`–`006`, object structure, 31-FR count and topic groups |
| 2 | `RELEASE-1.3.md` §7 — `DEC-R1.3-009`, `-011`, `-012`, `-013`, `-014`, `-015`, `-016`, `-017` | Ratified principles (Bootstrap Ownership, Proposal Version immutable itinerary snapshot, Workspace-native components, Ownership Gate precedent, Forward Allocation of Travel Date) |
| 3 | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` (§6.1, §6.4, §6.7, §6.8, §7.4, §7.12, §8, §9, §10.2, §14) | Approved FRs `FR-JW-01`–`04`, `FR-DASH-01`–`06`, `FR-VM-02`–`04`, `FR-NOT-*`, `BR-001`–`019`, Open Questions |
| 3 | `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | FR-WS identifiers, Topic Group Register |
| 3 | `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` §5.4 | Narrative for `PD-JW-*` |
| 3 | `PO-REVIEW-05`/`-06`/`-08` | Cross-module relationships (itinerary, vendor, notifications — `PD-NO-003` examples) |
| 4 | `docs/02-Product/workspace/JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`, `JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md` | Experience principles ("Calm Confidence", "Nothing Important Missed", "Action Before Analytics") |
| 4 | `docs/04-UX/workspace/` — Screen Inventory (`JW-01`–`08`), Information Architecture, Navigation Model, User Journeys 5–7, Interaction Flows (Journey Creation, Vendor Assignment, Journey Completion) | Existing UX commitments for Journey Workspace |
| 4 | `docs/20-Architecture/workspace/` — Domain Model §2.4, Data Architecture | Journey aggregate, audit, archival-only rules |
| 4 | `EBC-R1.3-WS12-003` (Rev 2), `-005`, `-011A` | Conversion boundary, `FR-JP-28`/`36`, `BR-024`, bootstrap table shape |
| 5 | `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` (`PEB-001`, `PEB-002`, `PEB-006`), `FUTURE-CONSIDERATIONS.md` (`FCR-022`) | Boundaries; deferred items |
| 6 | Implementation: `supabase/migrations/20260921070300_workspace_bootstrap_journeys.sql`, `…070600_workspace_journey_planning_conversion.sql`, `…060100/060200` (shared notifications, tasks), `web/components/workspace/dashboard/*`, `web/lib/workspace/shared/rbac/permissions.ts`, `web/app/workspace/(dashboard)/journey-workspace/page.tsx` ("Coming Soon") | Current behaviour; reuse; gaps |

---

### 3. How to Read This Document

| Label | Meaning |
|---|---|
| **Confirmed** | Direct restatement of a Product Owner–approved decision (a `PD-JW-*`, a `DEC-R1.3-*`, or Spec v2.0 "Approved" content). |
| **Proposed (Arjun)** | Business analysis added by this card to complete approved-but-undrafted scope. Requires Product Owner ratification before Sophie, Archie or Rad treat it as approved. |
| **Assumption** | Relied on but not stated by any source; disclosed so it can be corrected. |
| **Open Question** | Unresolved; needs a named decision owner (Section 27). |
| **Implementation Evidence** | What the repository currently does — informative only, never a requirement source. |

Identifier conventions: Functional Requirements continue the module's existing `FR-JW-nn` series (`FR-JW-01`–`04` = `FR-WS-017`–`020`). Business Rules continue the Workspace-wide series after WS12's `BR-024`, starting at `BR-025`. Open Questions continue the Workspace register after `OQ-022`, starting at `OQ-023`. Decisions for the Product Owner use `D-01`… local to this card. No existing identifier is renumbered or reused.

---

## PART A — PRODUCT DISCOVERY

### 4. Review of the Existing Foundation

#### 4.1 What is already approved for Journey Workspace

| Item | Status | Source |
|---|---|---|
| Vision, Business Purpose, primary object (Journey) | **Confirmed** | `PO-REVIEW-04` §2–§4 |
| `PD-JW-001` Journey created only by conversion; `PD-JW-002` post-confirmation scope; `PD-JW-003` minor changes in-Journey; `PD-JW-004` material change → On Hold + new planning record; `PD-JW-005` outcomes Successfully Completed / Cancelled / Archived; `PD-JW-006` permanent operational history | **Confirmed** | `PO-REVIEW-04` §5 |
| Journey identity (ID, Traveller, Journey Planning Reference, Owner, Destination, Travel Dates, Current Status), operational information, child objects (Tasks, Activities, Operational Notes, Vendor Bookings, Documents, Notifications), operational readiness tracking | **Confirmed** | `PO-REVIEW-04` §6 |
| `FR-JW-01`–`04` (single working record; stage history; Active Journeys queue with claim; system-derived status) | **Confirmed** | Spec v2.0 §6.4 |
| 31 FRs, all Must Have, across 12 topic groups incl. **operational alerts** (specifically endorsed) | **Confirmed (count/topics only)** | `PO-REVIEW-04` §9 |
| `BR-012`, `BR-013` | **Confirmed** | Spec v2.0 §9 |
| Phase 2 granular stages | **Open** — v1.0 six-stage breakdown remains Proposed | Spec v2.0 §10.2, `OQ-004` |
| Screens `JW-01`–`JW-08`, contextual tabs (Overview · Itinerary · Vendor Confirmations · Operational Readiness · Tasks & Follow-ups · Documents · History) | **Approved UX baseline** (`DEC-R1.3-007`) | Screen Inventory §4; IA §6 |
| Travel Date mandatory at booking/confirmation — owned by WS13 | **Confirmed (Forward Allocation)** | `DEC-R1.3-015`; `FR-JP-36`, `BR-024` |
| Journey Amendment belongs to WS13 but is future scope | **Recommended — pending ratification** | `PEB-001` |

#### 4.2 Reusable Foundation and WS12 capabilities

| Capability | Where it lives today | WS13 reuse | Source |
|---|---|---|---|
| Workspace shell, header, desktop/mobile navigation, "Journey Workspace" nav item (currently "Coming Soon") | WS11 | Reuse unchanged; replace placeholder page | `DEC-R1.3-010/011` |
| Authentication, roles (`administrator`, `privilege_user`), RBAC guard | `workspace_users`, `lib/workspace/shared/rbac` | Reuse | `DEC-R1.3-009` |
| Record-scoped permission helpers (`canClaimRecord`, `canReassignRecord`, `canEditRecord`, `canAdvanceStage`, `canArchiveOutsideNormalClosure`) | `shared/rbac/permissions.ts` (written generically for "any future owner-scoped module") | Reuse for Journey | WS12-007 |
| Generic Ownership Model (claim/assign/reassign) service | `shared/ownership` | Reuse | Spec §8.1 |
| Append-only audit log (`workspace_audit_log`) | `shared/audit` | Reuse as the Journey Timeline source | Data Architecture §6 |
| Notifications (Informational / Action Required, condition-based) | `workspace_notifications`, `shared/notifications` | Reuse for operational alerts | `PD-NO-003/004` |
| Tasks & Follow-ups (polymorphic `entity_type`/`entity_id`) | `workspace_tasks`, `shared/tasks-follow-ups` | Reuse with `entity_type = journey` | `BR-008/009` |
| Dashboard shell: 5 KPI tiles (all literal 0), Quick Actions, Recent Activity (empty), Upcoming Tasks (empty) | `components/workspace/dashboard/*` | WS13 supplies real values for 3 KPIs and Journey items for Recent Activity / Upcoming Tasks | PRR-R1.3-WS11-001 |
| Queue pattern (stage filter, unassigned-only toggle, table) | `JourneyPlanningQueueView.tsx` | Pattern reference for `JW-01` | WS12-004/007 |
| Conversion RPC (atomic JPR → Journey) | `workspace_convert_journey_planning_record` | Entry point to WS13; extension required (F-02) | `BR-012`, WS12-005 §6.5 |
| Bootstrap `workspace_journeys` | migration `20260921070300` | **Extend, do not recreate** (table comment and `DEC-R1.3-013` Bootstrap Ownership Principle) | `DEC-R1.3-013` |
| Bootstrap `workspace_vendors` (`prospective`/`active`/`inactive`) | migration `20260921070000` | Reference for Vendor Bookings | `DEC-R1.3-013` |
| Proposal Version immutable `itinerary_snapshot` | `workspace_proposal_versions` | The accepted version's snapshot is the Journey's operational itinerary until Itinerary Studio exists | `DEC-R1.3-014` |
| Workspace-native components (no data-grid library) | — | Mandatory constraint | `DEC-R1.3-014` |

#### 4.3 Dependencies identified

See Section 7.5 for the full dependency register.

---

### 5. Business Context, Vision and Purpose

**Confirmed** (`PO-REVIEW-04` §2–§3; Spec v2.0 §6.4):

> Journey Workspace is the operational execution module responsible for managing confirmed journeys from the point of commercial confirmation until operational closure. It enables Workspace Users to coordinate bookings, manage traveller support, monitor operational readiness, and ensure successful journey delivery. Unlike Journey Planning, Journey Workspace manages committed operational work rather than commercial planning.

Business purpose: manage confirmed journeys; coordinate operational readiness; monitor booking progress; manage traveller servicing; coordinate suppliers; support travellers before, during and after travel; preserve operational history.

**Business problem (Proposed, Arjun — synthesis, not stated by source):** today, WS12 can confirm a Journey, but the moment it converts, the Journey disappears into a table nobody can see. There is no owner, no travel date, no booking status and no warning before departure. The traveller has said yes and trusted SMV; the operational period after that yes is exactly where "Build trust before selling" turns into "keep the promise". WS13 closes that gap and delivers the Product Owner's endorsed intent that operational alerts make the Workspace the team's primary daily tool (`PO-REVIEW-04` §9; `PD-NO-005`).

**Experience intent (Confirmed, Business Lifecycle §3, UX Design Brief §4–§6):** Journey-centric; Traveller Relationship First; Organised Workspace; Calm Confidence; Nothing Important Missed; Action Before Analytics; Progressive Disclosure.

---

### 6. Terminology Reconciliation

| Term | Canonical meaning in this card | Conflict found | Resolution in this card |
|---|---|---|---|
| **Journey Workspace** | Module 4 — post-confirmation (Phase 2) only | `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md` and the UX Design Brief use "Journey Workspace" for the entire Workspace (Inquiry → Journey → Completion) | Spec v2.0 §6.4 / `PO-REVIEW-04` govern module scope (higher precedence, later consolidation). The Business Lifecycle remains valid as Workspace-wide experience narrative. Recommend Tiger add a one-line clarifying note to that document (F-04) — not done here. |
| **Inquiry** | Business-narrative synonym for Lead / Journey Planning Record | Business Lifecycle §4 | Already treated this way by the Domain Model §1 (A-ARCH-04). Not used as an object in WS13. |
| **Business Lifecycle BR-001–006** | Local numbering in the Business Lifecycle doc | Collides with Spec `BR-001`–`006` | This card cites them as "Lifecycle-BR-00n" where needed. |
| **Vendor Booking** vs **Vendor Confirmation** | `PO-REVIEW-04` §6 names the child object *Vendor Bookings*; Spec `FR-VM-02`–`04`, Screen `JW-04` and the Dashboard KPI use *Vendor Confirmation* | Two names, one concept? | **Proposed:** one object, **Vendor Booking**, whose confirmation status reaches *Confirmed*. "Pending Vendor Confirmations" = Vendor Bookings not yet Confirmed. Decision `D-07`. |
| **Completed** | `PD-JW-005`: *Successfully Completed* | Bootstrap table uses `completed` | Business name is "Successfully Completed"; storage value is Archie/Rad's concern (F-02). |
| **Booking** (Spec §7.9) | Legacy v1.0 object "unchanged" | Not revisited by PO Review | Treated as the same concept as Vendor Booking; `OQ-023`. |
| **On Hold** | A suspension state named in `PD-JW-004` | Not in any lifecycle list | Modelled as a non-terminal status (Section 10). |
| **Travel Date** | Journey Planning: optional *Intended Travel Date* / *Intended Travel Month* | WS13: **Confirmed Travel Start Date / End Date** (mandatory at booking/confirmation, `BR-024`) | Distinct fields; the planning values are never overwritten (`PD-JW-006`). |

---

### 7. Journey Workspace Scope

#### 7.1 Included capabilities (Release 1.3)

| # | Capability | Basis |
|---|---|---|
| C-01 | Journey intake from the Journey Planning conversion (the only entry route) | `PD-JW-001`, `BR-012` — Confirmed |
| C-02 | Active Journeys list (queue) with claim / assign / reassign | `FR-JW-03` — Confirmed |
| C-03 | Journey details — single working record with contextual sections | `FR-JW-01`, Screens `JW-02`–`JW-08` — Confirmed |
| C-04 | Phase 2 lifecycle and status management, including On Hold and the three closure outcomes | `PD-JW-004/005`, `FR-JW-04` — Confirmed; granular stages **Proposed** (Section 10) |
| C-05 | Confirmed Travel Dates capture (the booking/confirmation gate forward-allocated from WS12) | `BR-024`, `DEC-R1.3-015` — Confirmed allocation; gate position **Proposed** |
| C-06 | Booking coordination — Vendor Bookings against the Journey and their confirmation status | `PO-REVIEW-04` §6 (Vendor Bookings), `FR-VM-02`–`04` — Confirmed |
| C-07 | Traveller servicing — communications and servicing activity before, during and after travel | `PO-REVIEW-04` §3 — Confirmed |
| C-08 | Operational Notes and minor operational change log | `PD-JW-003`, `PD-JW-006` — Confirmed; logging model **Proposed** |
| C-09 | Traveller documents tracking (status-level) | `PO-REVIEW-04` §6 — Confirmed; storage **Open** (`OQ-014`) |
| C-10 | Operational readiness tracking across booking, documentation, traveller and supplier readiness | `PO-REVIEW-04` §6 — Confirmed; model **Proposed** |
| C-11 | Tasks & Follow-ups on a Journey, and a Journey task overview | Topic "task management" — Confirmed |
| C-12 | Operational alerts and notifications | Topics "notifications", "operational alerts" — Confirmed |
| C-13 | Search and filters over Journeys | Topic "search" — Confirmed |
| C-14 | Journey Timeline / audit history | `FR-JW-02`, `PD-JW-006` — Confirmed |
| C-15 | Material scope change hand-back to Journey Planning (On Hold + new planning record) | `PD-JW-004` — Confirmed |
| C-16 | Journey Workspace contribution to the Workspace Dashboard (KPIs, cards, Recent Activity, Upcoming Tasks) and a summary strip on the Active Journeys list | `PO-REVIEW-04` §8 (Dashboard relationship), `FR-DASH-05` — Confirmed relationship; FRs **Proposed additions** |
| C-17 | Journey completion hand-off (offer to capture a learning; Traveller relationship continues) | User Journey 7, Interaction Flow "Journey Completion" — Approved UX; target module (Itinerary Studio) not built |

#### 7.2 Excluded capabilities

| Excluded | Reason / where it belongs |
|---|---|
| Creating a Journey directly (any screen, any role, any quick action) | `PD-JW-001` |
| Commercial / proposal work, re-quoting, re-pricing | Journey Planning (WS12), `PD-JW-002`, `BR-013` |
| **Journey Amendment** as a formal workflow (re-quote, new Proposal Version, traveller re-approval of changed commercial terms) | `PEB-001` — future Product Evolution item |
| Changing a Journey's destination | `PD-JW-004` — new Journey Planning Record instead |
| Payments, invoicing, receipts, refunds | Not in any approved WS13 evidence |
| Traveller-facing portal or traveller self-service | Workspace is internal only (Spec §13 Assumption 1) |
| Vendor-facing access; vendor master data maintenance; Preferred Partner; performance recording | Vendor Management (WS16) |
| Itinerary authoring / editing / versioning; Master Itinerary learning governance | Itinerary Studio (WS15) |
| Traveller identity, Traveller Timeline, duplicate management | Traveller Hub (WS14) |
| Destination Profile content | Destination Intelligence (WS17) |
| Document file storage/management platform | `OQ-014` / `PEB-006` — unless the Product Owner decides otherwise (`D-10`) |
| External notification delivery (email/WhatsApp/SMS) | `OQ-008` still open; in-Workspace only |
| Business-reporting analytics dashboards | "Action Before Analytics" (UX Brief §6); only operational KPIs in scope |
| Notification-configuration screens (`NOT-02`, `SET-04`) | Notifications / Settings modules |
| Automatic (time-based) stage changes | `BR-004` action-driven workflow; Navigation Model §4.7 "never an automatic timeout" |

#### 7.3 Assumptions

| ID | Assumption |
|---|---|
| A-WS13-01 | The Workspace remains internal-only; travellers and vendors never access Journey Workspace. |
| A-WS13-02 | Two roles only (`administrator`, `privilege_user`, referred to as Workspace User) — per `DEC-R1.3-009`. |
| A-WS13-03 | Until Itinerary Studio (WS15) exists, a Journey's operational itinerary is the immutable itinerary snapshot of the Proposal Version current at conversion (`DEC-R1.3-014`). |
| A-WS13-04 | Vendor records exist in the bootstrap `workspace_vendors` table; WS13 does not create or maintain Vendors. |
| A-WS13-05 | Notifications are delivered in-Workspace only (bell + Dashboard) for Release 1.3. |
| A-WS13-06 | "Travel Dates" in `PO-REVIEW-04` §6 means the confirmed start and end dates of travel. |
| A-WS13-07 | Journey Workspace is desktop-first, with the Foundation's existing responsive/mobile navigation (UX Brief §9). |
| A-WS13-08 | Journeys already created by WS12's conversion in any environment must be brought into the WS13 lifecycle without data loss (`BR-036`). |

#### 7.4 Constraints

- No permanent deletion of Journeys or operational history by any role (`BR-007` rewritten, `PD-JW-006`).
- Extend the bootstrap `workspace_journeys` table; do not recreate (`DEC-R1.3-013`).
- Workspace-native components only; no data-grid library (`DEC-R1.3-014`).
- Accepted Proposal Version and its itinerary snapshot are immutable (`DEC-R1.3-014`).
- Configuration over code for thresholds and readiness templates, where practical (`BR-018`).
- Reuse shared audit, notifications, tasks, ownership and RBAC services — no module-specific re-implementation (Project Instructions §18).
- Brand and Workspace design language unchanged (`DEC-R1.3-010`; §23).

#### 7.5 Dependency register

| ID | Dependency | Type | Status | Impact if absent |
|---|---|---|---|---|
| DEP-01 | WS11 Workspace Foundation | Platform | ✅ Complete (`DEC-R1.3-011`) | — |
| DEP-02 | WS12 conversion RPC and bootstrap `workspace_journeys` | Entry point / data | ✅ Complete (`DEC-R1.3-017`) — **needs extension** (F-02) | No Journeys to manage |
| DEP-03 | Archie — Journey schema extension, legacy-Journey migration, conversion RPC extension (owner/dates/snapshot reference) | Architecture | Not started | Blocks Engineering |
| DEP-04 | Sophie — WS13 UX (wireframes for `JW-01`–`08`; `FCR-022` says wireframes/UX standards before Journey Workspace Engineering) | UX | Not started | Blocks Engineering |
| DEP-05 | Vendor records (WS16 or bootstrap seeding) | Data | Bootstrap only; no Vendor creation UI | Vendor Bookings cannot be recorded without at least one Active Vendor |
| DEP-06 | Itinerary Studio (WS15) | Module | Reserved, not started | "Request itinerary change" (`JW-03`) and learning capture (`IS-05`) have no destination; R1.3 falls back to A-WS13-03 and a logged change |
| DEP-07 | Traveller Hub (WS14) | Module | Reserved | Traveller link opens a minimal record only; not blocking |
| DEP-08 | Notification delivery channel (`OQ-008`) | Decision | Open | In-Workspace only |
| DEP-09 | Document storage (`OQ-014`) | Decision | Open | Documents are status-only (`D-10`) |
| DEP-10 | Settings / notification configuration UI | Module | Not built | Thresholds held as configuration defaults, not user-editable in R1.3 |
| DEP-11 | Product Owner decisions `D-01`–`D-13` | Decision | Open | Six block UX (Section 26) |

---

### 8. Actors and User Goals

| Actor | Type | Goals in Journey Workspace | Source |
|---|---|---|---|
| **Workspace User** (`privilege_user`) | Internal | Take ownership of confirmed Journeys; secure bookings; keep the traveller ready and informed; know what needs attention today; close Journeys cleanly | `DEC-R1.3-009`; UX Brief §3 |
| **Administrator** | Internal | Everything a Workspace User can do on any Journey; reassign any Journey; archive; correct mistakes; oversee team workload | `DEC-R1.3-009`; WS12 precedent |
| **Traveller / Corporate Point of Contact** | External, no access | Receives servicing and communications; the subject of the Journey | `PO-REVIEW-04`; WS12 Decision 2 |
| **Vendor** | External, no access | Provides the booked service; its confirmation is recorded by a Workspace User | `PD-VM-*`; WS12 Ratified Decision 1 (internal-only) |
| **Journey Planning (system)** | System | Creates the Journey by conversion; receives a new planning record on material change | `BR-012`, `PD-JW-004` |
| **Notifications (system)** | System | Raises and resolves operational alerts by condition | `PD-NO-001/004` |

---

## PART B — BUSINESS ANALYSIS

### 9. Business Process Analysis

#### 9.1 End-to-end business workflow

```
Journey Planning Record (Decision) ──[Owner records Confirmed]──► atomic conversion (BR-012)
                                                                  │
                                                                  ▼
                                               Journey — CONFIRMED (Active Journeys list)
                                                                  │  claim / ownership carried (D-03)
                                                                  │  confirmed travel dates recorded (BR-027)
                                                                  ▼
                                               IN PREPARATION ── bookings, vendor confirmations,
                                                                  │  documents, readiness, servicing
                                                                  │  (minor changes logged — PD-JW-003)
                                                                  ▼  all readiness items resolved (BR-028)
                                               READY TO TRAVEL
                                                                  ▼  on/after start date (owner action)
                                               TRAVELLING ── in-trip support, servicing log
                                                                  ▼  on/after end date (owner action)
                                               POST-TRAVEL ── wrap-up, feedback, learning offer
                                                                  ▼
                                               CLOSED — Successfully Completed
                                                                  │
                                                                  ▼
                                               Traveller Hub history → future Journey Planning

  Any non-terminal stage ──► CANCELLED (reason required)          ──► terminal
  Confirmed / In Preparation / Ready to Travel ──► ON HOLD ──► resume to held stage, or Cancelled
  Material destination change: ON HOLD + new Journey Planning Record (PD-JW-004)
  Administrator: any non-terminal ──► ARCHIVED (reason required)  ──► terminal
```
Stage names are the **recommended option** of decision `D-01` (Section 10).

#### 9.2 Journey lifecycle interactions with other modules

| Moment | Interaction | Direction | Source |
|---|---|---|---|
| Conversion | Journey Planning closes record as Confirmed and creates the Journey atomically; closed record shows a forward link, Journey shows back-reference | JP → JW | `BR-012`; Interaction Flow "Journey Creation" steps 5–6 |
| Conversion | Accepted Proposal Version (and its itinerary snapshot) becomes the Journey's operational itinerary reference; planning history stays on the planning record, not copied | JP → JW | User Journey 5 step 2; `DEC-R1.3-014` |
| Operations | Vendor Bookings reference Active Vendors | VM → JW | `FR-VM-02/04` |
| Operations | Outstanding Vendor Bookings feed the global Vendor Confirmations queue (`VM-04`) and the Dashboard KPI | JW → VM, Dashboard | `FR-VM-03`, `FR-DASH-05` |
| Operations | Alerts raised/resolved by condition | JW → Notifications | `PD-NO-003/004` |
| Material change | Journey placed On Hold; new Journey Planning Record created for the same Traveller/Corporate POC and new destination, linked back | JW → JP | `PD-JW-004` |
| Itinerary change (minor) | Logged as a Journey change record; formal re-versioning waits for Itinerary Studio / `PEB-001` | JW → IS (future) | `PD-JW-003`, `D-06` |
| Completion | Offer to capture a learning (Itinerary Studio, future); Traveller Hub shows the completed Journey | JW → IS, TH | User Journey 7 |

#### 9.3 Workspace interactions and navigation flows

| Flow | Path | Source |
|---|---|---|
| N-01 Start of day | Sign-in → Dashboard (My Work) → Journey card / KPI tile → Journey (`JW-02`) | Navigation Model §4.1 |
| N-02 Pick up new confirmed work | Primary nav "Journey Workspace" → Active Journeys (`JW-01`) filtered "Unclaimed" → Claim (in place, no intermediate screen) → `JW-02` | IA §9 |
| N-03 From planning to operations | Closed planning record (`JP-02`) → "View Journey" link → `JW-02` | Interaction Flow step 5 |
| N-04 Act on an alert | Bell / Dashboard alert → source Journey section that resolves it (e.g. Vendor Bookings, Documents, Readiness) | IA §9, `BR-017` |
| N-05 Work a Journey | `JW-02` Overview → contextual sections → back to Overview; History always available | IA §6 |
| N-06 Find a Journey | Global search or `JW-01` search → `JW-02` (closed Journeys included) | IA §5.3 |
| N-07 Material change | `JW-02` → "Different destination requested" → Journey placed On Hold → new planning record opens in Journey Planning, pre-linked | `PD-JW-004` |
| N-08 Close out | `JW-02` → Close Journey → outcome → (Successfully Completed) optional learning offer → Journey leaves active list | Interaction Flow "Journey Completion" |
| N-09 Context jump | Inline chips on `JW-02`: Traveller (`TH-02`), Vendor (`VM-02`), originating planning record (`JP-02`) | IA §9 |

#### 9.4 Operational scenarios

| ID | Scenario | Expected business behaviour | FRs / BRs |
|---|---|---|---|
| S-01 | **Happy path, domestic.** Planning record confirmed; owner carried forward; dates recorded; hotel + cab booked and confirmed; no documents required; readiness complete; family travels; returns; closed Successfully Completed | Every step is an owner action; alerts clear as conditions resolve; Timeline shows full history | FR-JW-05–11, 14–16, 22–23, 30 |
| S-02 | **International with visas.** Passports and visas required for 2 adults, 1 child; departure in 10 days, one visa outstanding | Documents readiness "Outstanding"; Action Required alert "Traveller documents outstanding" and "Departure approaching with incomplete readiness"; cannot mark Ready to Travel | FR-JW-21, 22, 26; BR-028 |
| S-03 | **Vendor not confirming.** Hotel booking requested 5 days ago, still Pending | Booking counts in Pending Vendor Confirmations KPI and `VM-04`; alert after threshold; resolves only when booking is Confirmed or Cancelled | FR-JW-15–17, 26; BR-017 |
| S-04 | **Minor change.** Traveller swaps a hotel two weeks before departure | Old booking Cancelled (retained), new booking added; change logged with reason; same Journey; accepted proposal snapshot unchanged | FR-JW-13, 16; BR-032 |
| S-05 | **Material change.** Traveller now wants Bali instead of Kerala | Destination not editable; Journey placed On Hold with reason; new planning record created for Bali, linked; Kerala Journey later Cancelled or resumed per `D-13` | FR-JW-10, 12; BR-029, 031 |
| S-06 | **Post-confirmation cancellation.** Traveller cancels for personal reasons | Owner closes as Cancelled with reason; open bookings flagged for manual vendor cancellation tasks; nothing deleted | FR-JW-11; BR-030 |
| S-07 | **Unclaimed Journey.** Converted Journey not owned (if `D-03` = unclaimed, or legacy Journey) | Visible to all in Unclaimed filter; Action Required alert after threshold; cannot leave Confirmed until owned | FR-JW-03, 26; BR-026 |
| S-08 | **Owner on leave.** Administrator reassigns five Journeys | Reassignment logged per Journey; new owner gets Informational notification; stages unchanged | FR-JW-31; BR-035 |
| S-09 | **In-trip support.** Traveller calls from Munnar — driver late | Owner logs a servicing activity (channel, summary); optional task; Timeline shows it | FR-JW-19, 24 |
| S-10 | **Corporate journey.** Planning record was for a Corporate Point of Contact | Journey inherits the Corporate POC association; behaves identically otherwise (`D-12`) | FR-JW-06; BR-034 |
| S-11 | **Legacy Journey.** Journey converted under WS12 before WS13, with no owner or dates | Appears in Confirmed, Unclaimed, "Travel dates missing" alert; normal lifecycle thereafter | BR-036 |
| S-12 | **Erroneous conversion.** Journey created by mistake | Administrator archives with reason; history preserved; planning record is not reopened (Single Business Object Principle) | FR-JW-11; BR-030 |

---

### 10. Journey Lifecycle (Phase 2) — Status Management

#### 10.1 What is Confirmed vs open

- **Confirmed:** A Journey starts on conversion (`PD-JW-001`); may be placed **On Hold** (`PD-JW-004`); ends as **Successfully Completed, Cancelled or Archived** (`PD-JW-005`); status is system-controlled and changed only by deliberate actions (`FR-JW-04`, `BR-004`, `BR-005`); history is permanent (`PD-JW-006`).
- **Open (`OQ-004` remainder):** the named stages between creation and closure. The v1.0 illustrative breakdown (Booking Confirmed → Vendor Confirmation in Progress → Pre-Departure Ready → In-Journey → Post-Journey Follow-up → Closed) was neither confirmed nor rejected.

#### 10.2 Options — Decision `D-01`

| Option | Stages | Pros | Cons |
|---|---|---|---|
| **A — v1.0 illustrative model** | Booking Confirmed → Vendor Confirmation in Progress → Pre-Departure Ready → In-Journey → Post-Journey Follow-up → Closed | Already in the approved Spec as Proposed; UX History tab already assumes it | "Booking Confirmed" as the *first* stage is misleading — at creation nothing has been booked; stage 2 is vendor-centric, while documents and traveller readiness matter equally |
| **B — Recommended** | **Confirmed → In Preparation → Ready to Travel → Travelling → Post-Travel → Closed** (Successfully Completed / Cancelled / Archived), with **On Hold** as a suspension status | Maps 1:1 onto Option A (so the UX package needs relabelling, not restructuring); names describe what the team is doing; aligns with the Business Lifecycle's "Operations → Travel → Journey Completion"; each gate is a clear business checkpoint (ownership + dates; readiness; travel window) | New labels need Product Owner ratification |
| **C — Minimal** | Active → Closed only, with readiness as a separate indicator | Simplest to build | Loses queue grouping by stage (`FR-JW-03` pattern), weakens "what should I do next?"; Dashboard "Upcoming Departures"/"Travelling now" views harder to explain |

**Recommendation: Option B.** It preserves every approved concept, does not introduce a new business object, and keeps the Journey Planning pattern (stage-grouped queue, deliberate transitions, named gates) that the team has just learned in WS12 — consistency is itself a UX Brief principle.

#### 10.3 Stage definitions (Option B — Proposed, Arjun)

| Stage | Business meaning | Entry criteria | Exit criteria |
|---|---|---|---|
| **1. Confirmed** | Traveller has accepted; the Journey exists but operational work has not started | Created by conversion (`BR-012`) — the only entry | Owner assigned (`BR-026`) **and** confirmed travel start/end dates recorded (`BR-027`) |
| **2. In Preparation** | Bookings, vendor confirmations, documents and traveller preparation in progress | From Confirmed (gates met) or resumed from On Hold | All readiness items resolved — Complete or Not Applicable (`BR-028`) |
| **3. Ready to Travel** | Everything needed for departure is in place | From In Preparation (gate met), or resumed from On Hold | Travel start date reached and owner marks Travelling |
| **4. Travelling** | Traveller is on the Journey; support mode | From Ready to Travel on/after the confirmed start date | Travel end date reached and owner marks Post-Travel |
| **5. Post-Travel** | Traveller has returned; wrap-up, feedback, learning offer | From Travelling on/after the confirmed end date | Owner closes as Successfully Completed |
| **6. Closed** | Terminal: **Successfully Completed / Cancelled / Archived** | See transitions | None — terminal, never reopened |
| **On Hold** (status overlay) | Operational work paused — typically a material scope change (`PD-JW-004`) or traveller-requested pause | From Confirmed, In Preparation or Ready to Travel, with reason | Resume (returns to the stage it was held from) or Cancel / Archive |

#### 10.4 Allowed and invalid transitions

| From | Allowed to | Actor | Invalid (rejected) |
|---|---|---|---|
| Confirmed | In Preparation (gates `BR-026`, `BR-027`); On Hold; Cancelled; Archived | Owner / Admin; Archived Admin only | Any later stage directly; Successfully Completed |
| In Preparation | Ready to Travel (gate `BR-028`); On Hold; Cancelled; Archived | Owner / Admin | Back to Confirmed; Travelling; Successfully Completed |
| Ready to Travel | Travelling (start date ≤ today); back to In Preparation (a readiness item re-opened); On Hold; Cancelled; Archived | Owner / Admin | Travelling before start date; Successfully Completed |
| Travelling | Post-Travel (end date ≤ today); Cancelled (trip aborted); Archived | Owner / Admin | On Hold (a trip in progress is not paused); back to earlier stages |
| Post-Travel | Successfully Completed; Archived | Owner / Admin | Cancelled (travel happened); earlier stages |
| On Hold | Resume to held-from stage; Cancelled; Archived | Owner / Admin | Any stage other than the held-from stage |
| Closed (any outcome) | — | — | Every transition (`BR-030`) |

The single backward move allowed (Ready to Travel → In Preparation) exists because readiness can genuinely regress (a vendor withdraws, a visa is refused). It is a deliberate, logged action, never automatic (`BR-004`).

#### 10.5 Date-driven prompts, not automatic transitions

Reaching the start or end date does **not** change the stage by itself (`BR-004`; Navigation Model §4.7). Instead the system raises an Action Required alert ("Departure date reached — confirm the traveller is travelling"; "Travel ended — move to Post-Travel") that resolves when the owner acts (`BR-017`).

---

### 11. Business Objects

| Object | Status | Definition and key business fields | Relationships |
|---|---|---|---|
| **Journey** | **Confirmed** (identity, operational info, child objects — `PO-REVIEW-04` §6); stage model **Proposed** | A commercially confirmed travel commitment. Identity: Journey ID (human-readable reference **Proposed**), Traveller *or* Corporate Point of Contact (`D-12`), Journey Planning Reference, Owner, Destination/Region, Confirmed Travel Start Date, Confirmed Travel End Date, Current Stage, On Hold flag + reason, Outcome + reason. **Carried trip parameters (Proposed):** adults, children, infants, nights, departure city, intended travel month — as known at conversion | 1 ↔ 1 originating Journey Planning Record (never repointed); references the accepted Proposal Version (itinerary snapshot); aggregate root for the child objects below |
| **Vendor Booking** | **Confirmed to exist** (`PO-REVIEW-04` §6); fields **Proposed** | A service booked with a Vendor for this Journey. Fields: Vendor (Active only at creation), service category (accommodation, transport, activity, flights, visa, insurance, other — list **configurable**, `BR-018`), service date(s), booking reference, confirmation status **Requested → Confirmed**, or **Cancelled** (with reason), notes | Belongs to one Journey; references one Vendor (WS16-owned) |
| **Readiness Item** | Readiness tracking **Confirmed**; item model **Proposed** | One checkpoint in one of four **Confirmed** categories: Booking confirmations, Documentation, Traveller readiness, Supplier readiness. Status: Outstanding / Complete / Not Applicable (reason). Source: *system-derived* (e.g., "all Vendor Bookings confirmed", "all required documents received") or *manual* | Belongs to one Journey |
| **Traveller Document Requirement** | Documents **Confirmed** as a child object; status model **Proposed** | A document the Journey requires (passport, visa, ID, insurance certificate, other) per traveller or per party; status Outstanding / Received / Verified / Not Applicable; optional file only if `D-10` approves storage | Belongs to one Journey; feeds Documentation readiness |
| **Operational Note** | **Confirmed** (`PO-REVIEW-04` §6) | Free-text note by a Workspace User; append-only — corrections are new notes referencing the earlier one | Belongs to one Journey |
| **Activity** (communication / servicing) | **Confirmed** (Activities, traveller communications) | Timestamped log of an action: type (call, WhatsApp, email, meeting, in-trip support, other), direction, summary, logged by | Belongs to one Journey; reuses the WS12 Activity concept |
| **Journey Change Record** | **Proposed** — implements `PD-JW-003` | What changed (itinerary element, booking, dates, party), why, requested by (traveller / SMV / vendor), logged by, when. Never edits the accepted Proposal Version | Belongs to one Journey |
| **Task / Follow-up** | **Confirmed** (`BR-008`, `BR-009`) | Shared Workspace object linked to the Journey | Reuses `workspace_tasks` |
| **Notification** | **Confirmed** (`PD-NO-*`) | Informational or Action Required; references the Journey without owning it | Reuses `workspace_notifications` |

---

### 12. Functional Requirements

`FR-JW-01`–`04` are restated from Spec v2.0 §6.4 (Approved). `FR-JW-05`–`31` are drafted by this card to complete the Product Owner's approved count of 31, each within one of the 12 approved topic groups. **Their wording is Proposed (Arjun) and requires ratification**, exactly as `FR-JP-06`–`30` were ratified in WS12. `FR-JW-32`–`34` are **proposed additions beyond the approved 31**, needed to deliver this card's Dashboard, KPI and Recent Activity scope; they follow the WS12 Revision 2 precedent (additive, ratified separately) — decision `D-11`. All are proposed **Must Have** for Release 1.3, matching the approved classification.

Column key — **EBC area** maps each FR to this card's required areas (Dashboard, Journey List, Journey Details, Journey Timeline, Status Management, Search, Filters, Workspace KPIs, Recent Activity, Task Overview); **Topic** = `PO-REVIEW-04` §9 topic group.

#### 12.1 Journey List, Details, Status (approved subset — restated)

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-01** *(FR-WS-017, Approved)* | The Journey Workspace shall be the single working record for one Journey: its Traveller(s), current Phase 2 stage, linked Itinerary/Quotation, linked Vendor Confirmations, and Tasks/Follow-ups. | One source of truth after confirmation (Vision: single source of truth) | AC1 Opening a Journey shows Overview with Traveller/Corporate POC, destination, confirmed dates, stage, On Hold status, owner, readiness summary, open alerts, and a link to the originating planning record. AC2 Contextual sections exist for Itinerary, Vendor Bookings, Readiness, Tasks & Follow-ups, Documents, Notes & Activity, History. AC3 No Journey data is edited on any other module's screen. — *EBC area:* Journey Details · *Topic:* operational management | DEP-02, DEP-03 |
| **FR-JW-02** *(FR-WS-018, Approved)* | The Journey Workspace shall show the Journey's full stage history. | Auditability; `PD-JW-006` | AC1 Every stage change, hold, resume and closure appears with previous value, new value, actor and timestamp. AC2 History is read-only for all roles. — *EBC area:* Journey Timeline · *Topic:* audit history | Shared audit log |
| **FR-JW-03** *(FR-WS-019, Approved)* | The Journey Workspace shall present the Active Journeys queue (Phase 2 only) with the same claim/ownership behaviour as Journey Planning. | Operational list of all live commitments | AC1 Lists every non-terminal Journey (including On Hold, visibly marked). AC2 Groupable by stage (`D-01` stages). AC3 Unclaimed Journeys claimable in place by any Workspace User; after claim, owner shown and Journey leaves the Unclaimed view. AC4 Closed Journeys excluded by default (reachable via filter `FR-JW-29`). — *EBC area:* Journey List · *Topic:* operational management | Shared ownership |
| **FR-JW-04** *(FR-WS-020, Approved)* | A Journey's status field shall be system-derived, never a freely editable dropdown. | `BR-005` | AC1 No free-text or free-select status control exists. AC2 Status changes only through named actions (`FR-JW-08`–`11`). — *EBC area:* Status Management · *Topic:* governance | — |

#### 12.2 Journey creation

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-05** | A Journey shall be created only by the Confirmed closure of a Journey Planning Record; no screen, quick action, API or role shall offer direct Journey creation. | `PD-JW-001`, `BR-012` | AC1 No "Create Journey" action exists in Journey Workspace. AC2 Any Workspace entry point labelled as creating a Journey routes to Journey Planning instead (`D-09`). AC3 Attempting creation by any other route is rejected. — *Topic:* journey creation | WS12 conversion; `D-09` |
| **FR-JW-06** | On creation, the Journey shall carry forward from the originating record: the Traveller or Corporate Point of Contact association; Destination/Region; the known trip parameters (adults, children, infants, nights, departure city, intended travel month); and a reference to the Proposal Version current at conversion, whose itinerary snapshot becomes the Journey's operational itinerary. | Continuity from planning; no re-keying; `DEC-R1.3-014` | AC1 All listed values are visible on the new Journey. AC2 The closed planning record shows a link to the Journey and the Journey a link back. AC3 Planning history (Proposal Versions, Vendor Quotations, Discovery Notes) stays on the planning record and is reachable, not duplicated. AC4 Later operational updates on the Journey never alter the closed planning record. — *Topic:* journey creation | DEP-03 |
| **FR-JW-07** | A newly created Journey shall enter the **Confirmed** stage in the Active Journeys list, with initial ownership per decision `D-03`, and shall raise an Informational "Journey confirmed" notification. | Nothing important missed at hand-off; `PD-NO-003` example | AC1 Journey appears in Active Journeys within the same user session as the conversion. AC2 Owner = carried-forward planning owner (recommended) or unclaimed (alternative), per `D-03`. AC3 Informational notification to the owner (or all Workspace Users if unclaimed). — *Topic:* journey creation | `D-03` |

#### 12.3 Operational management and status management

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-08** | The Journey shall follow the Product Owner–approved Phase 2 stages (Section 10, `D-01`) and shall reject any transition not listed as allowed for its current stage. | `BR-025`; data integrity | AC1 Only allowed transitions (Section 10.4) are offered. AC2 A disallowed transition attempt is rejected with a clear reason. AC3 Every transition is logged (`FR-JW-30`). — *EBC area:* Status Management · *Topic:* operational management | `D-01` |
| **FR-JW-09** | Advancing a Journey shall be a deliberate action by its Owner or an Administrator, subject to the named gates: ownership and confirmed travel dates to leave Confirmed; all readiness items resolved to enter Ready to Travel; start date reached to enter Travelling; end date reached to enter Post-Travel. | `BR-004`, `BR-026`–`028`; PRA-02 precedent | AC1 An unmet gate disables the action and states, field by field, what is missing (PRA-01 precedent). AC2 An explicit Not Applicable readiness item satisfies the gate. AC3 Non-owners (non-Admin) cannot advance. — *EBC area:* Status Management · *Topic:* operational readiness | `D-01`, `D-02` |
| **FR-JW-10** | The Owner or an Administrator shall be able to place a Journey On Hold (from Confirmed, In Preparation or Ready to Travel) with a mandatory reason, and resume it to the stage it was held from. | `PD-JW-004`; `BR-029` | AC1 Hold requires reason. AC2 On Hold Journeys are visibly marked in list and detail. AC3 Date- and readiness-based alerts are suspended while On Hold; an "On Hold for more than N days" alert applies instead (`D-05`). AC4 Resume returns to the held-from stage only. — *EBC area:* Status Management · *Topic:* operational management | `D-05` |
| **FR-JW-11** | Closing a Journey shall require exactly one outcome — Successfully Completed, Cancelled or Archived — subject to Section 10.4; Cancelled and Archived require a reason; Archived is Administrator-only; a closed Journey can never be reopened. | `PD-JW-005`, `BR-030` | AC1 Outcome selection limited to those valid for the current stage. AC2 Reason mandatory for Cancelled/Archived. AC3 On Cancelled, any Vendor Booking not already Cancelled is flagged and a follow-up task is offered for vendor cancellation. AC4 No reopen action exists. AC5 Closed Journey leaves the default list but stays searchable. — *EBC area:* Status Management · *Topic:* governance | `D-08` |
| **FR-JW-12** | When a fundamentally different destination is requested, the Workspace shall support placing the Journey On Hold and creating a new Journey Planning Record for the same Traveller/Corporate POC and the new destination, linked to the held Journey; the held Journey's destination shall not be editable. | `PD-JW-004`, `BR-031` | AC1 Destination is read-only on every Journey. AC2 One action places the Journey On Hold (reason "Material scope change") and opens a pre-filled new planning record in Journey Planning (Lead Created, party carried). AC3 Both records show the link. AC4 Duplicate-prevention rules of Journey Planning still apply. — *Topic:* governance | WS12 creation API; `D-13` |
| **FR-JW-13** | Minor operational changes (hotel change, sightseeing adjustment, sequence change, operational refinement) shall be recorded on the same Journey as Journey Change Records — what, why, requested by, who, when — without creating a new Journey and without modifying the accepted Proposal Version. | `PD-JW-003`, `BR-032`; `DEC-R1.3-014` | AC1 A change record can be added from the Journey. AC2 Changes appear in the Timeline. AC3 The accepted proposal snapshot remains unchanged and viewable. AC4 No re-quote or traveller re-approval workflow is offered (`PEB-001`). — *Topic:* operational management | `D-06` |

#### 12.4 Booking coordination and vendor coordination

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-14** | The Owner shall record the Journey's Confirmed Travel Start Date and End Date; both are mandatory before the Journey leaves Confirmed, end date must not precede start date, and changes after entry are logged with a reason. | `BR-024` forward allocation, `BR-027` | AC1 Gate blocks Confirmed → In Preparation until both dates exist. AC2 End < Start is rejected. AC3 Date change shows previous/new values and reason in Timeline. AC4 Intended Travel Month from planning is shown alongside, not overwritten. — *Topic:* booking coordination | `D-02` |
| **FR-JW-15** | The Owner shall record one or more Vendor Bookings against the Journey — Vendor (Active only), service category, service date(s), booking reference, notes — each starting as **Requested**. | `PO-REVIEW-04` §6; `FR-VM-02`, `FR-VM-04` | AC1 Only Active Vendors selectable; Inactive Vendors' existing bookings stay visible. AC2 Multiple bookings per Journey. AC3 Service dates outside the confirmed travel window produce a warning, not a block. — *Topic:* booking coordination | DEP-05 |
| **FR-JW-16** | A Vendor Booking's status shall change only by deliberate, logged actions — Requested → Confirmed (booking reference required), or → Cancelled (reason required); a cancelled or replaced booking is retained, never deleted. | `BR-033`, `PD-JW-006` | AC1 Confirm requires a reference. AC2 Cancel requires a reason. AC3 No delete action exists. AC4 Every change appears in Timeline. — *Topic:* booking coordination | — |
| **FR-JW-17** | The Journey shall show its outstanding (Requested) Vendor Bookings, and these shall feed the Workspace-wide Vendor Confirmations view and the Pending Vendor Confirmations KPI. | `FR-VM-03`, `FR-DASH-05` | AC1 Journey Overview shows "n of m bookings confirmed". AC2 Every Requested booking on a non-terminal, non-held Journey is counted in the KPI (Section 17). AC3 Confirming or cancelling removes it from the outstanding count immediately. — *Topic:* vendor coordination | `D-07` |
| **FR-JW-18** | The Owner shall log vendor coordination activity (contacted, awaiting reply, reconfirmed, issue raised) against a Vendor Booking. | Supplier coordination is part of the approved purpose | AC1 Entries are timestamped and attributed. AC2 Visible on the booking and in the Timeline. — *Topic:* vendor coordination | — |

#### 12.5 Traveller servicing and documents

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-19** | The Owner shall log traveller communications and servicing activity before, during and after travel — type, channel, direction, summary. | Approved purpose: support travellers before/during/after travel | AC1 Activity types include in-trip support. AC2 Entries are append-only and in the Timeline. AC3 No message is sent to the traveller by the Workspace (`OQ-008`). — *Topic:* traveller servicing | — |
| **FR-JW-20** | Any Workspace User with edit rights shall add Operational Notes to a Journey; notes are append-only, and corrections are added as new notes referencing the original. | `PD-JW-006` | AC1 No edit/delete of an existing note. AC2 Correction note links to original. — *Topic:* traveller servicing | — |
| **FR-JW-21** | The Owner shall maintain the Journey's Traveller Document Requirements — document type, which traveller(s), status Outstanding / Received / Verified / Not Applicable. Documents are not mandatory for domestic Journeys by default. | `PO-REVIEW-04` §6; `PO-REVIEW-03` §6 domestic clarification | AC1 Domestic Journey starts with no required documents. AC2 International Journey starts with passport (per traveller) required, visa added by the Owner where applicable (`D-04`). AC3 Status changes logged. AC4 File attachment only if `D-10` approves storage. — *Topic:* traveller servicing | `D-04`, `D-10`, `OQ-014` |

#### 12.6 Operational readiness

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-22** | The Journey shall present operational readiness across four categories — Booking confirmations, Documentation, Traveller readiness, Supplier readiness — with an overall readiness state: **Not Ready**, **At Risk** (departure within the alert window and items outstanding) or **Ready**. | `PO-REVIEW-04` §6 ("minimise operational risk before departure") | AC1 Each category shows outstanding/complete counts. AC2 Overall state derived, never manually set. AC3 State visible in list (`FR-JW-03`) and Overview. — *Topic:* operational readiness | `D-04`, `D-05` |
| **FR-JW-23** | Readiness items shall be either system-derived (all Vendor Bookings Confirmed; all required documents Received/Verified; confirmed travel dates present) or manual (added by the Owner from a configurable default template); any item may be marked Not Applicable with a reason. | Configuration over code (`BR-018`); explicit N/A mirrors WS12 explicit-value integrity (`BR-023`) | AC1 System-derived items update automatically when the underlying condition changes and cannot be manually ticked. AC2 Manual items can be added, completed, marked N/A (reason). AC3 Template defaults are configuration, not code. — *Topic:* operational readiness | `D-04` |

#### 12.7 Task management

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-24** | The Owner shall create Tasks and Follow-ups against a Journey (manual or system-generated), assign them to any Workspace User, and complete or cancel them. | `BR-008`, `BR-009`; shared capability | AC1 Uses the shared Tasks & Follow-ups capability with the Journey as the linked record. AC2 Follow-ups require purpose and due date. AC3 Overdue items visibly marked. — *EBC area:* Task Overview · *Topic:* task management | Shared tasks |
| **FR-JW-25** | Each Journey shall show a task overview — open, overdue and next-due Tasks/Follow-ups — and Journey tasks shall be included in the Dashboard's Tasks Due Today KPI and Upcoming Tasks card. | Task visibility where work happens; `FR-DASH-05` | AC1 Overview shows counts and next due item. AC2 Journey tasks appear in "My Work" for their assignee. AC3 Completed/cancelled tasks excluded from counts. — *EBC area:* Task Overview, Workspace KPIs · *Topic:* task management | Dashboard |

#### 12.8 Notifications and operational alerts

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-26** | The Workspace shall raise **Action Required** notifications for Journey conditions listed in Section 16 (unclaimed Journey; travel dates missing; departure approaching with incomplete readiness; traveller documents outstanding; Vendor Booking unconfirmed beyond threshold; departure/end date reached without stage action; On Hold beyond threshold), each resolving only when its condition resolves. | `PD-NO-003`, `PD-NO-004`, `BR-017`; PO-endorsed operational alerts | AC1 Each condition raises exactly one active notification per Journey (no duplicates). AC2 Viewing/acknowledging never resolves it. AC3 Resolving the condition resolves it automatically. AC4 Recipient = owner (all Workspace Users if unclaimed). — *Topic:* notifications / operational alerts | `D-05`; shared notifications |
| **FR-JW-27** | The Workspace shall raise **Informational** notifications for: Journey confirmed (created); Journey assigned/reassigned to you; Journey placed On Hold/resumed; Journey closed (any outcome). | `PD-NO-003` | AC1 Can be acknowledged once reviewed. AC2 Click-through opens the Journey. — *Topic:* notifications | Shared notifications |
| **FR-JW-28** | Active operational alerts shall be visible in context: an alert banner on the Journey (with the action that resolves it) and an at-risk indicator on the Journey's row in the Active Journeys list. | "Calm coworker" — surface, don't hunt (Navigation Model §4.6) | AC1 Banner lists active alerts with a link to the resolving section. AC2 List row shows an indicator when ≥1 Action Required alert is active. AC3 No alert shown for closed Journeys. — *Topic:* operational alerts | FR-JW-26 |

#### 12.9 Search, filters, audit history, governance

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-29** | Journey Workspace shall support searching Journeys by Journey reference, traveller name or mobile number, Corporate Point of Contact, and destination; and filtering by stage, owner (Mine / Unclaimed / specific user), On Hold, readiness state, departure date range, alert status and outcome (closed); sorted by default on departure date ascending. Journeys shall also be findable from global search. | Topic "search"; IA §5.3 | AC1 Search includes closed Journeys when "Include closed" is on, and always from global search. AC2 Filters combine (AND). AC3 Journeys without dates sort last. AC4 Empty results show the Workspace empty-state pattern. — *EBC area:* Search, Filters · *Topic:* search | Section 18 |
| **FR-JW-30** | Each Journey shall have a chronological, read-only **Journey Timeline** of every business event: creation (with link to the planning history), ownership changes, stage transitions, holds/resumes, date changes, bookings and their status changes, readiness and document changes, change records, notes, activities, tasks, notifications raised/resolved, closure. | `PD-JW-006`, `FR-JW-02`, `NFR-WS-004` | AC1 Every event shows actor, timestamp, and before/after where applicable. AC2 Filterable by event type. AC3 No event can be edited or removed by any role. — *EBC area:* Journey Timeline · *Topic:* audit history | Shared audit log |
| **FR-JW-31** | Journeys and all their child operational records shall never be permanently deleted by any role; ownership shall be independent of stage; any Workspace User may view any Journey; changes are limited per the permission matrix (Section 15). | `BR-007`, Spec §8.2, `BR-035` | AC1 No delete action on any Journey object. AC2 Changing owner never changes stage and vice versa. AC3 Permission matrix enforced for every action. — *Topic:* governance | Shared RBAC |

#### 12.10 Proposed additions beyond the approved 31 (require ratification — `D-11`)

| ID | Requirement | Business rationale | Acceptance criteria | Dependencies |
|---|---|---|---|---|
| **FR-JW-32** *(Proposed addition)* | Journey Workspace shall supply the Workspace Dashboard with live values for the **Active Journeys**, **Upcoming Departures** and **Pending Vendor Confirmations** KPIs (definitions, Section 17) and with Journey cards for My Work / Team, each showing owner and recommended next action. | `PO-REVIEW-04` §8 (Dashboard relationship); `FR-DASH-03/04/05`; replaces today's literal-0 tiles | AC1 KPI values match Section 17 definitions for the viewer's scope (My Work / Team). AC2 Selecting a KPI opens the Active Journeys list pre-filtered accordingly. AC3 Each card shows owner and a next action derived from stage/alerts. — *EBC area:* Dashboard, Workspace KPIs | Dashboard (WS11) |
| **FR-JW-33** *(Proposed addition)* | Significant Journey events — confirmed, claimed/reassigned, stage change, On Hold/resume, booking confirmed, closure — shall appear in the Dashboard **Recent Activity** feed, newest first, each linking to the Journey. | Recent Activity card exists but has no source; "know what's moved since you last looked" (Empty State copy) | AC1 Events appear once each. AC2 My Work shows events on the viewer's Journeys; Team shows all. AC3 Feed drawn from the Timeline events, not a second record. — *EBC area:* Recent Activity | FR-JW-30 |
| **FR-JW-34** *(Proposed addition)* | The Active Journeys list shall open with a summary strip — counts of Unclaimed, per stage, At Risk, Departing within the alert window and On Hold — each acting as a one-click filter. | Module landing "dashboard" requested by this card without adding a new screen or analytics surface (Action Before Analytics) | AC1 Counts equal the filtered list size. AC2 Selecting a count applies that filter. AC3 No charts or trend analytics. — *EBC area:* Dashboard, Workspace KPIs | FR-JW-29 |

---

### 13. Coverage Matrices

#### 13.1 This card's required areas → FRs

| EBC area | Covered by |
|---|---|
| Dashboard | FR-JW-32 (Workspace Dashboard), FR-JW-34 (module landing summary) — both Proposed additions |
| Journey List | FR-JW-03, FR-JW-34 |
| Journey Details | FR-JW-01, FR-JW-06, FR-JW-13–23 (contextual sections) |
| Journey Timeline | FR-JW-02, FR-JW-30 |
| Status Management | FR-JW-04, FR-JW-08–11 |
| Search | FR-JW-29 |
| Filters | FR-JW-29, FR-JW-34 |
| Workspace KPIs | FR-JW-17, FR-JW-25, FR-JW-32, FR-JW-34 |
| Recent Activity | FR-JW-33 |
| Task Overview | FR-JW-24, FR-JW-25 |

#### 13.2 Approved topic groups (`PO-REVIEW-04` §9) → FRs (31)

| Topic group | FRs | Count |
|---|---|---|
| Journey creation | 05, 06, 07 | 3 |
| Operational management | 01, 03, 08, 10, 13 | 5 |
| Booking coordination | 14, 15, 16 | 3 |
| Traveller servicing | 19, 20, 21 | 3 |
| Vendor coordination | 17, 18 | 2 |
| Operational readiness | 09, 22, 23 | 3 |
| Task management | 24, 25 | 2 |
| Notifications | 26, 27 | 2 |
| Operational alerts | 28 | 1 |
| Search | 29 | 1 |
| Audit history | 02, 30 | 2 |
| Governance | 04, 11, 12, 31 | 4 |
| **Total** | | **31** ✅ matches approved count |

---

### 14. Business Rules

#### 14.1 Existing rules applied to Journey Workspace (Confirmed — cited, not restated with new wording)

| Rule | Application in WS13 |
|---|---|
| `BR-002` Claim ownership / Generic Ownership Model (Spec §8.1) | Journeys are claimable, assignable, reassignable. `OQ-022` (uniformity across modules) is answered for Journey Workspace by `FR-JW-03` (Approved: "same claim/ownership behaviour as Journey Planning"). |
| `BR-003` Reassignment | Administrator may reassign any Journey; owner may assign own Journey. |
| `BR-004` Action-driven workflow | All stage changes are deliberate actions; dates prompt, never auto-transition. |
| `BR-005` System-controlled statuses | Journey stage, readiness state and booking status are never free-edited. |
| `BR-006` / `BR-007` Archive, never permanent delete | Journeys, bookings, notes, documents status, change records, activities. |
| `BR-008` / `BR-009` Hybrid tasks; structured follow-ups | Journey tasks and follow-ups. |
| `BR-012` Journey only by conversion | `FR-JW-05`. |
| `BR-013` Phase boundary; minor vs material change | `FR-JW-12`, `FR-JW-13`. |
| `BR-016` Designation independent of lifecycle | On Hold is a status overlay independent of owner; Preferred Partner does not affect booking eligibility. |
| `BR-017` Condition-based notification resolution | All operational alerts (`FR-JW-26`). |
| `BR-018` Configuration over code | Alert thresholds, readiness templates, service categories, document types. |
| `BR-024` Travel Date Deferral (forward allocation) | Implemented by `BR-027`. |
| Single Business Object Principle (WS12 Decision 3); `PEB-001` boundary | No duplicate Journey; Journey never returns to Journey Planning; amendment workflow out of scope. |
| `FR-VM-04` Inactive Vendors not selectable | `FR-JW-15`. |

#### 14.2 New Business Rules (Proposed, Arjun — require ratification)

| Rule | Category | Statement | Source / rationale |
|---|---|---|---|
| **BR-025** | Status transitions | **Journey Phase 2 Lifecycle.** A Journey progresses Confirmed → In Preparation → Ready to Travel → Travelling → Post-Travel → Closed (Successfully Completed / Cancelled / Archived), using only the transitions in Section 10.4. | Completes `OQ-004`; `PD-JW-005`; `D-01` |
| **BR-026** | Status transitions | **Journey Ownership Gate.** A Journey cannot leave Confirmed unless it has an Owner. | Mirrors ratified PRA-02 (`DEC-R1.3-017`) |
| **BR-027** | Validation | **Confirmed Travel Dates Gate.** A Journey cannot leave Confirmed unless Confirmed Travel Start Date and End Date are both recorded and End ≥ Start. | Implements `BR-024`; `D-02` |
| **BR-028** | Status transitions | **Readiness Gate.** A Journey cannot enter Ready to Travel while any readiness item is Outstanding; Not Applicable (with reason) counts as resolved. | `PO-REVIEW-04` §6 |
| **BR-029** | Status transitions | **On Hold.** On Hold is a non-terminal suspension, allowed from Confirmed, In Preparation or Ready to Travel, with a mandatory reason; resuming returns the Journey to the stage it was held from; a Travelling Journey cannot be placed On Hold. | `PD-JW-004` |
| **BR-030** | Status transitions | **Terminal Outcomes.** Closed outcomes are final and irreversible. Cancelled requires a reason and is not available from Post-Travel. Archived requires a reason and is Administrator-only. A closed Journey is never reopened; a traveller returning after cancellation starts a new Journey Planning Record. | `PD-JW-005`; Single Business Object Principle; WS12 `canArchiveOutsideNormalClosure` precedent; `D-08` |
| **BR-031** | Workspace rule | **Destination Immutability.** A Journey's Destination/Region cannot be changed after creation; a fundamentally different destination requires a new Journey Planning Record while the Journey is placed On Hold. | `PD-JW-004` |
| **BR-032** | Workspace rule | **Minor Change Logging.** Minor operational changes are recorded as Journey Change Records on the same Journey; they never modify the accepted Proposal Version or its itinerary snapshot, and never trigger re-quotation. A formal amendment workflow is `PEB-001`, not Release 1.3. | `PD-JW-003`; `DEC-R1.3-014`; `PEB-001`; `D-06` |
| **BR-033** | Workspace rule | **Booking History Preservation.** A Vendor Booking is never deleted or overwritten; a change of supplier or service is a Cancelled booking plus a new booking. A booking can be Confirmed only with a booking reference. | `PD-JW-006` |
| **BR-034** | Validation | **Journey Party Association.** A Journey carries exactly one of Traveller or Corporate Point of Contact, inherited from the originating record at conversion, and it is never changed afterwards. | WS12 Decision 2; `D-12` |
| **BR-035** | Journey visibility / permissions | **Collaborative Visibility, Owner-scoped Change.** Every Workspace User can view every Journey (active and closed); modifying actions are limited to the Owner and Administrators, except claiming an unowned Journey (any Workspace User). | Data Architecture §5 ("read access collaborative by default"); WS12 permission precedent |
| **BR-036** | Default behaviour | **Legacy Journey Adoption.** Any Journey created before WS13 is released enters the Journey Phase 2 lifecycle at Confirmed, unclaimed, with no confirmed dates, and is then subject to all WS13 gates and alerts; no historical data is altered or lost. | F-02; A-WS13-08 |

#### 14.3 Default behaviour

| Behaviour | Default | Status |
|---|---|---|
| Journey stage at creation | Confirmed | Proposed (`BR-025`) |
| Owner at creation | Carried forward from the planning record's owner (recommended) — alternative: unclaimed | **Decision `D-03`** |
| Active Journeys list default view | Non-terminal Journeys (On Hold included, marked), all owners, sorted by Confirmed Travel Start Date ascending, Journeys without dates last | Proposed |
| "My Work" scope on Dashboard | Journeys owned by the viewer plus unclaimed Journeys | Proposed (consistent with Navigation Model §4.1) |
| Readiness template, domestic | Booking confirmations (system), Supplier readiness (system), Traveller readiness — final itinerary shared with traveller (manual) | Proposed — `D-04` |
| Readiness template, international | As domestic plus Documentation (system: passport per traveller; visa added by Owner where applicable) | Proposed — `D-04` |
| Alert thresholds | Configurable; values required from the Product Owner (Section 16) | **Decision `D-05`** |
| Closed Journeys | Hidden from default list; always in search, Traveller Hub and Timeline | Proposed |

#### 14.4 Validation rules

| Category | Rule |
|---|---|
| Creation | Only via conversion; exactly one Journey per originating planning record (`BR-012`; existing unique constraint) |
| Party | Exactly one of Traveller / Corporate POC; immutable (`BR-034`) |
| Destination | Required; immutable after creation (`BR-031`) |
| Dates | Start and End both required before leaving Confirmed; End ≥ Start; changes require reason (`BR-027`, `FR-JW-14`) |
| Stage | Only Section 10 values; only allowed transitions (`BR-025`) |
| Gates | Ownership (`BR-026`), dates (`BR-027`), readiness (`BR-028`), start date reached for Travelling, end date reached for Post-Travel |
| Hold | Reason required; only from allowed stages; resume only to held-from stage (`BR-029`) |
| Closure | Outcome required; reason for Cancelled/Archived; Archived Admin-only; no reopen (`BR-030`) |
| Vendor Booking | Active Vendor; service category required; Confirmed requires booking reference; Cancelled requires reason (`BR-033`) |
| Readiness item | Not Applicable requires reason; system-derived items cannot be manually completed (`FR-JW-23`) |
| Document requirement | Type and traveller(s) required; status from the defined set |
| Validation feedback | Field-specific messages, able to show several at once (PRA-01 precedent, `DEC-R1.3-017`) |

---

### 15. Permissions

Consistent with `DEC-R1.3-009` (Administrators govern the platform; Workspace Users operate the business) and the WS12 record-scoped precedent. Final per-screen matrix remains subject to `OQ-001`.

| Capability | Workspace User | Administrator |
|---|---|---|
| View Active Journeys list, any Journey, Timeline, closed Journeys | ✅ | ✅ |
| Search and filter Journeys | ✅ | ✅ |
| Claim an unowned Journey | ✅ | ✅ |
| Assign own Journey to another user | ✅ (owner) | ✅ |
| Reassign a Journey owned by someone else | ❌ | ✅ |
| Record dates, bookings, documents, readiness, notes, activities, change records | ✅ (owner) | ✅ |
| Create/manage Journey Tasks & Follow-ups | ✅ (owner; assignable to anyone) — assignees may complete their own tasks | ✅ |
| Advance / step back stage (within Section 10.4) | ✅ (owner) | ✅ |
| Place On Hold / resume | ✅ (owner) | ✅ |
| Initiate material scope change (new planning record) | ✅ (owner) | ✅ |
| Close as Successfully Completed or Cancelled | ✅ (owner) | ✅ |
| Close as Archived | ❌ | ✅ |
| Delete any Journey data | ❌ | ❌ |
| Create a Journey directly | ❌ | ❌ |

---

### 16. Notifications and Operational Alerts

Business-level triggers only; delivery channel stays in-Workspace (`OQ-008`). Threshold values are **not invented** — the Product Owner supplies them (`D-05`); Arjun's suggested starting values are shown for convenience and are clearly Proposed.

| # | Condition | Type | Recipient | Resolves when | Threshold (suggested, `D-05`) |
|---|---|---|---|---|---|
| AL-01 | Journey unclaimed beyond threshold | Action Required | All Workspace Users | Journey claimed | 1 working day |
| AL-02 | Journey in Confirmed without confirmed travel dates beyond threshold | Action Required | Owner | Both dates recorded | 2 days after creation |
| AL-03 | Departure within the readiness window and readiness not Ready | Action Required | Owner | Readiness Ready, Journey On Hold, or closed | 14 days before start |
| AL-04 | Required traveller document Outstanding within the document window | Action Required | Owner | Document Received/Verified/N/A | 21 days before start (international) |
| AL-05 | Vendor Booking Requested beyond threshold | Action Required | Owner | Booking Confirmed or Cancelled | 3 days after request |
| AL-06 | Start date reached, Journey not yet Travelling | Action Required | Owner | Stage → Travelling, On Hold, or closed | On start date |
| AL-07 | End date passed, Journey still Travelling | Action Required | Owner | Stage → Post-Travel or closed | 1 day after end |
| AL-08 | Post-Travel not closed beyond threshold | Action Required | Owner | Journey closed | 7 days after end |
| AL-09 | On Hold beyond threshold | Action Required | Owner and Administrators | Resumed or closed | 14 days on hold |
| IN-01 | Journey confirmed (created) | Informational | Owner (or all if unclaimed) | Acknowledged | — |
| IN-02 | Journey assigned/reassigned to you | Informational | New owner | Acknowledged | — |
| IN-03 | Journey placed On Hold / resumed | Informational | Owner (if actor is not owner) | Acknowledged | — |
| IN-04 | Journey closed | Informational | Owner (if actor is not owner) | Acknowledged | — |

Suppression: AL-02 to AL-08 are suspended while a Journey is On Hold; all AL-* resolve automatically on closure.

---

### 17. Workspace KPI Definitions

The five Dashboard KPIs are Product Owner–ratified labels (PRR-R1.3-WS11-001, 17-Sep-2026); none has a written definition. Three are sourced from Journey Workspace. **Proposed definitions — `D-05`/`D-11`:**

| KPI | Definition (Proposed) | Scope |
|---|---|---|
| **Active Journeys** | Journeys not Closed, including On Hold | My Work: owned by viewer · Team: all |
| **Upcoming Departures** | Active, not On Hold Journeys whose Confirmed Travel Start Date is today or within the readiness window (AL-03) | As above |
| **Pending Vendor Confirmations** | Vendor Bookings in Requested status on Active, not On Hold Journeys | As above |
| **Tasks Due Today** (contributes) | Open Journey tasks/follow-ups due today or overdue, for the assignee | My Work: assigned to viewer |
| New Leads (not WS13) | Owned by Journey Planning — unchanged | — |

Module summary strip (`FR-JW-34`): Unclaimed · Confirmed · In Preparation · Ready to Travel · Travelling · Post-Travel · At Risk · Departing soon · On Hold.

---

### 18. Search and Filter Specification

| Element | Specification |
|---|---|
| Search keys | Journey reference; traveller name; traveller mobile (normalised, `BR-001` matching); Corporate POC name/organisation; destination/region |
| Filters | Stage (multi); Owner: Mine / Unclaimed / named user; On Hold (yes/no); Readiness: Not Ready / At Risk / Ready; Departure date range; Has active alert; Include closed + Outcome (Successfully Completed / Cancelled / Archived) |
| Sort | Departure date (default, ascending), created date, last activity |
| Result row | Reference, Traveller/Corporate POC, destination, dates, stage, owner, readiness state, alert indicator, On Hold marker |
| Global search | Journeys included alongside Travellers and Journey Planning Records (IA §5.3) |

---

### 19. Journey Timeline and Audit

- Single append-only chronology per Journey (`FR-JW-30`) drawing on the shared audit log; the same events feed Recent Activity (`FR-JW-33`) — one source, no second record.
- The Journey Timeline starts at conversion and links (not copies) to the planning history on the originating record.
- **Distinct from the Traveller Timeline** (Traveller Hub, WS14), which spans all of a traveller's records.
- Implementation evidence: the WS12 conversion writes audit entries only against the Journey Planning Record; a `journey`-entity creation event is needed (F-05).

---

### 20. Exception Scenarios

| # | Exception | Expected behaviour |
|---|---|---|
| E-01 | Conversion succeeds but a later operational update fails | The Journey remains valid in Confirmed; the failed action reports a specific error; no partial state (atomic operations — Archie) |
| E-02 | Vendor becomes Inactive after a booking was Requested | Booking stays visible and actionable (confirm/cancel); no new bookings with that Vendor |
| E-03 | Confirmed dates change after bookings exist | Change logged with reason; bookings whose service dates fall outside the new window are flagged for review |
| E-04 | Readiness regresses after Ready to Travel (e.g., visa refused) | Item reopens; AL-03 raised; owner may step back to In Preparation |
| E-05 | Trip aborted mid-travel | Close as Cancelled with reason; history retained |
| E-06 | Owner deactivated (Settings) | Journeys become unclaimed-visible to Administrators for reassignment; AL-01 raised |
| E-07 | Two users claim the same Journey simultaneously | First claim wins; second sees the new owner, no duplicate ownership |
| E-08 | Material change requested while Travelling | Not permitted (`BR-029`); owner records the situation as activity/change record and, if needed, starts a new planning record without holding the Journey |
| E-09 | Traveller cancels, then returns a week later | Cancelled Journey stays closed; a new Journey Planning Record is created (`BR-030`) |
| E-10 | Journey created by mistake | Administrator archives with reason; the planning record is not reopened |

---

### 21. Integration Points

| Module | Integration | Owner of the data |
|---|---|---|
| Journey Planning (WS12) | Inbound conversion; outbound new planning record on material change; bidirectional links | WS12 owns planning record; WS13 owns Journey |
| Traveller Hub (WS14) | Traveller reference and link; Journey appears in Traveller history | WS14 |
| Itinerary Studio (WS15) | Journey itinerary = accepted Proposal Version snapshot (R1.3); future: Traveller Itinerary reference, change requests, learning capture | WS15 (future) |
| Vendor Management (WS16) | Vendor reference for bookings; outstanding bookings feed `VM-04` | WS16 owns Vendor; WS13 owns Vendor Booking (`D-07`) |
| Destination Intelligence (WS17) | Destination reference only | WS17 |
| Notifications | Raises/resolves AL-* and IN-* | Shared |
| Dashboard | KPIs, cards, Recent Activity, Upcoming Tasks | Dashboard renders; WS13 supplies |
| Settings | Thresholds, templates, categories (configuration) | Settings (future UI) |

---

### 22. Non-Functional Requirements

No new NFRs. Existing `NFR-WS-001`–`007` apply unchanged (notably `NFR-WS-004`, every stage transition and reassignment recorded). Two carried constraints from ratified decisions: Workspace-native components (`DEC-R1.3-014`); desktop-first with existing responsive navigation (UX Brief §9).

---

## PART C — TRACEABILITY

### 23. Requirements Traceability (WS13)

Vision principles (Spec §2, Confirmed): **V1** Single operational workspace · **V2** Daily decision support · **V3** Single source of truth · **V4** Team collaboration · **V5** Operational visibility. All rows trace to **Feature `FEAT-R1.3-013`** and **Workstream WS13**.

| FR | Vision | Product Decision / source | Business Rules | Screen(s) (UX baseline) | Status |
|---|---|---|---|---|---|
| FR-JW-01 | V1, V3 | Spec §6.4 | BR-005 | JW-02 | Approved |
| FR-JW-02 | V3, V5 | Spec §6.4; PD-JW-006 | NFR-WS-004 | JW-08 | Approved |
| FR-JW-03 | V4, V5 | Spec §6.4 | BR-002, BR-035 | JW-01 | Approved |
| FR-JW-04 | V3 | Spec §6.4 | BR-005 | JW-02 | Approved |
| FR-JW-05 | V3 | PD-JW-001 | BR-012 | JW-01; DASH-01 (Quick Actions) | Proposed wording |
| FR-JW-06 | V3 | PD-JW-001; DEC-R1.3-014/015 | BR-012, BR-034 | JW-02, JW-03 | Proposed wording |
| FR-JW-07 | V2, V5 | PD-JW-001; PD-NO-003 | BR-025, BR-002 | JW-01 | Proposed wording |
| FR-JW-08 | V2 | PD-JW-005 | BR-025 | JW-02, JW-08 | Proposed wording |
| FR-JW-09 | V2 | PO-REVIEW-04 §6 | BR-004, BR-026–028 | JW-02, JW-05 | Proposed wording |
| FR-JW-10 | V2 | PD-JW-004 | BR-029 | JW-02 | Proposed wording |
| FR-JW-11 | V3 | PD-JW-005 | BR-030 | JW-02 | Proposed wording |
| FR-JW-12 | V3 | PD-JW-004 | BR-031, BR-013 | JW-02 → JP-02 | Proposed wording |
| FR-JW-13 | V3 | PD-JW-003; PEB-001 | BR-032 | JW-02, JW-03 | Proposed wording |
| FR-JW-14 | V2 | DEC-R1.3-015 (Forward Allocation) | BR-024, BR-027 | JW-02 | Proposed wording |
| FR-JW-15 | V1, V3 | PO-REVIEW-04 §6; FR-VM-02/04 | BR-033 | JW-04 | Proposed wording |
| FR-JW-16 | V3 | PD-JW-006 | BR-033 | JW-04 | Proposed wording |
| FR-JW-17 | V5 | FR-VM-03; FR-DASH-05 | — | JW-02, JW-04, VM-04 | Proposed wording |
| FR-JW-18 | V1 | PO-REVIEW-04 §3 | — | JW-04 | Proposed wording |
| FR-JW-19 | V1, V4 | PO-REVIEW-04 §3 | — | JW-02 (Notes & Activity) | Proposed wording |
| FR-JW-20 | V3 | PO-REVIEW-04 §6; PD-JW-006 | BR-007 | JW-02 | Proposed wording |
| FR-JW-21 | V2 | PO-REVIEW-04 §6; PO-REVIEW-03 §6 | — | JW-07 | Proposed wording |
| FR-JW-22 | V2, V5 | PO-REVIEW-04 §6 | BR-028 | JW-05 | Proposed wording |
| FR-JW-23 | V2 | PO-REVIEW-04 §6 | BR-018, BR-028 | JW-05 | Proposed wording |
| FR-JW-24 | V4 | Topic "task management" | BR-008, BR-009 | JW-06 | Proposed wording |
| FR-JW-25 | V2, V5 | FR-DASH-05 | — | JW-02, JW-06, DASH-01 | Proposed wording |
| FR-JW-26 | V2, V5 | PD-NO-003/004; PO-REVIEW-04 §9 | BR-017 | NOT-01, JW-02 | Proposed wording |
| FR-JW-27 | V5 | PD-NO-003 | BR-017 | NOT-01 | Proposed wording |
| FR-JW-28 | V2 | PO-REVIEW-04 §9 (operational alerts) | BR-017 | JW-01, JW-02 | Proposed wording |
| FR-JW-29 | V1 | Topic "search"; IA §5.3 | BR-001 | JW-01, global search | Proposed wording |
| FR-JW-30 | V3, V5 | PD-JW-006 | NFR-WS-004 | JW-08 | Proposed wording |
| FR-JW-31 | V3, V4 | BR-007; Spec §8.2 | BR-007, BR-035 | all JW | Proposed wording |
| FR-JW-32 | V2, V5 | PO-REVIEW-04 §8; FR-DASH-03–05 | — | DASH-01/02 | Proposed addition |
| FR-JW-33 | V5 | Dashboard Recent Activity (PRR-R1.3-WS11-001) | — | DASH-01/02 | Proposed addition |
| FR-JW-34 | V2, V5 | This EBC (Dashboard area) | — | JW-01 | Proposed addition |

**Reverse check:** every `PD-JW-00n` is implemented by at least one FR — PD-JW-001 → 05–07; PD-JW-002 → scope §7; PD-JW-003 → 13; PD-JW-004 → 10, 12; PD-JW-005 → 08, 11; PD-JW-006 → 02, 16, 20, 30. Every screen `JW-01`–`JW-08` is used by at least one FR. No new screen is required (FR-JW-34 lives on JW-01).

**RTM update:** the Workspace RTM (`SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md`) receives an additive **v2.1 WS13 addendum** (§16 of that document) carrying the rows above, `BR-025`–`036` and `OQ-023`–`030`. `FR-JW-nn` identifiers are used as the stable module identifiers (the Specification already uses `FR-JW-01`–`04`); new `FR-WS-0nn` numbers are **not** assigned, because WS12's 31 new FRs never received them either (F-06) and assigning WS13 numbers first would pre-empt Tiger's numbering decision.

### 24. Implementation Evidence and Gaps (for Archie and Rad — not requirements)

| # | Current implementation | Required by this analysis / by approved WS12-005 | Owner |
|---|---|---|---|
| G-01 | `workspace_journeys` has: id, planning record id (unique), traveller id, corporate contact id, status (`active`/`completed`/`cancelled`), timestamps | WS12-005 §6.3 (approved) specified also `destination_region`, `travel_dates`, `owner_id`, status incl. `successfully_completed`/`archived`; this card adds stage, On Hold, outcome reason, carried trip parameters, accepted Proposal Version reference | Archie |
| G-02 | Conversion RPC sets no owner, no destination, no dates, no proposal reference | `FR-JW-06`, `FR-JW-07`, `D-03` | Archie / Rad |
| G-03 | Conversion audit entries are written against the planning record only | Journey-entity creation event for the Timeline (`FR-JW-30`) | Rad |
| G-04 | No Vendor Booking, Readiness, Document Requirement, Change Record structures | `FR-JW-15`–`23` | Archie |
| G-05 | Dashboard KPIs are literal 0; Recent Activity / Upcoming Tasks empty; "Create Journey" quick action present | `FR-JW-32`/`33`, `FR-JW-25`, `D-09` | Sophie / Rad |
| G-06 | `journey-workspace/page.tsx` renders "Coming Soon" | WS13 module | Rad |
| G-07 | Shared RBAC helpers are generic and reusable | Reuse for Journey (no new permission framework) | Rad |

---

## PART D — PRODUCT OWNER REVIEW NOTES

### 25. Summary for the Product Owner

WS13's vision, purpose, object and 31-FR scope were already approved by you. This card drafts the wording you have not yet seen, proposes the one missing piece of the model (Phase 2 stages), and surfaces decisions. **Nothing here changes an approved decision.** Please review the decisions below; once ratified, Tiger can synchronise the baseline and hand to Sophie.

### 26. Decisions Required

**Blocks UX Design (please decide first):**

| ID | Decision | Options | Arjun's recommendation | Impact |
|---|---|---|---|---|
| **D-01** | Phase 2 Journey stages | A v1.0 six-stage · **B Confirmed → In Preparation → Ready to Travel → Travelling → Post-Travel → Closed (+On Hold)** · C Active/Closed only | **B** — maps 1:1 to A, clearer names, clear gates | Stage grouping, gates, KPIs, alerts all depend on it |
| **D-02** | Where Confirmed Travel Dates become mandatory (`BR-024`) | (a) at conversion — reopens WS12 · **(b) before leaving Confirmed** · (c) before Ready to Travel | **(b)** — bookings cannot be made without exact dates; WS12 untouched | `BR-027` |
| **D-03** | Owner of a newly created Journey | Unclaimed (current UX/Architecture default, flagged for your confirmation) · **Carried forward from the planning owner, reassignable** | **Carry forward** — relationship continuity, no orphan Journeys at the moment of greatest trust | `FR-JW-07`; conversion change |
| **D-06** | Minor change vs Journey Amendment | **R1.3 logs minor changes as Change Records only; formal amendment (re-quote/re-approval) stays `PEB-001`** · or bring amendment into R1.3 | **Log only** — honours both `PD-JW-003` and `PEB-001` | `FR-JW-13`, `BR-032` |
| **D-07** | Vendor Booking vs Vendor Confirmation; module split with WS16 | **One object "Vendor Booking" (owned by WS13) whose status reaches Confirmed; WS16 owns Vendors and the global queue view** · or two objects | **One object** | `FR-JW-15`–`17`; relabel `JW-04` |
| **D-09** | Dashboard "Create Journey" Quick Action conflicts with `PD-JW-001` | Remove · **Route it to Journey Planning "new record"** and relabel (e.g., "Start Planning") · keep as-is (not recommended) | **Relabel and route to Journey Planning** | WS11 Dashboard change (small) |

**Needed before Engineering (not UX-blocking):**

| ID | Decision | Recommendation |
|---|---|---|
| **D-04** | Default readiness template and document defaults (domestic vs international) | Accept Section 14.3 defaults as configuration |
| **D-05** | Alert thresholds and KPI windows (AL-01–09, Upcoming Departures) | Provide values; Section 16 suggestions offered as a starting point |
| **D-08** | Archived outcome — Administrator-only, reason required, used for erroneous/abandoned Journeys | Approve as stated |
| **D-10** | Documents in R1.3 — status tracking only, or file upload/storage (`OQ-014`, `PEB-006`) | Status-only for R1.3 |
| **D-11** | Ratify `FR-JW-32`–`34` as additions beyond the approved 31 | Approve — needed for the Dashboard, KPI and Recent Activity scope in this card |
| **D-12** | Journeys may belong to a Corporate Point of Contact (inherited from WS12), though `PO-REVIEW-04` lists Traveller only | Approve — WS12 already converts corporate records |
| **D-13** | Held Journey after a material-change replacement converts | Owner closes it as Cancelled with reason "Replaced by new Journey" (manual), with an AL-09 reminder | 

### 27. Open Questions (new — continue Workspace register)

| ID | Question | Owner |
|---|---|---|
| OQ-023 | Is the legacy Spec §7.9 "Booking" object the same concept as Vendor Booking? (Proposed: yes — retire §7.9 wording) | Product Owner / Arjun |
| OQ-024 | Format of a human-readable Journey reference (e.g., for phone conversations) | Product Owner / Archie |
| OQ-025 | Journey holds its own copy of trip parameters vs reads them from the closed planning record (business need: planning record must never change) | Archie |
| OQ-026 | What "Verified" means for a traveller document and who may mark it | Product Owner |
| OQ-027 | Per-traveller document tracking needs named companions — Traveller Hub companion handling is approved but not built; R1.3 fallback is party-level entries | Product Owner / WS14 |
| OQ-028 | Should Successfully Completed require all open tasks/bookings to be resolved first? (Proposed: warn, not block) | Product Owner |
| OQ-029 | Vendor cancellation costs/penalties on a Cancelled Journey — explicitly out of R1.3 (payments excluded)? | Product Owner |
| OQ-030 | Upcoming Departures KPI window — same as the readiness alert window (AL-03) or separate? | Product Owner |

Existing questions this card touches: `OQ-004` (Phase 2 — answered by D-01 once ratified); `OQ-022` (ownership model — answered for Journey Workspace by approved `FR-JW-03`); `OQ-008`, `OQ-014`, `OQ-017` (dates — answered by D-02 once ratified); `OQ-001` unchanged.

### 28. Disclosed Findings

| ID | Finding | Recommended action | Owner |
|---|---|---|---|
| F-01 | Dashboard Quick Action "Create Journey" contradicts `PD-JW-001` | `D-09` | Product Owner → Sophie/Rad |
| F-02 | Bootstrap `workspace_journeys` narrower than approved WS12-005 shape; converted Journeys have no owner/dates | Extend table; adopt legacy Journeys via `BR-036` | Archie |
| F-03 | `PD-JW-003` vs `PEB-001` overlap | `D-06` | Product Owner |
| F-04 | Business Lifecycle doc terminology/BR numbering conflicts with Spec (open since A-UX-02) | Add a clarifying note to that doc; no rewrite | Tiger |
| F-05 | Conversion writes no Journey-entity audit event | Add at WS13 implementation | Rad |
| F-06 | Workspace RTM v2.0 was never updated with WS12's `FR-JP-06`–`36` / `BR-020`–`024` | Separate RTM housekeeping card; WS13 addendum added now | Tiger |
| F-07 | `FCR-022` (wireframes, UX standards) names "before Journey Workspace Engineering" as its review point — that point is now | Include wireframes in the WS13 UX card | Tiger / Sophie |
| F-08 | UX History tab and Navigation Model assume the unapproved six-stage model | Relabel after `D-01` | Sophie |

### 29. Risks

| ID | Risk | Mitigation |
|---|---|---|
| R-01 | WS13 is the largest Workspace module so far (31 + 3 FRs) | Tiger to consider phased delivery: (1) list, details, ownership, stages, dates, timeline; (2) bookings, readiness, documents, alerts; (3) Dashboard feeds |
| R-02 | No Vendor creation UI (WS16 not started) | Seed Active Vendors or pull a minimal Vendor create into scope — Tiger/Product Owner |
| R-03 | Without Itinerary Studio, itinerary changes are notes only | Accepted by `D-06`; revisit when WS15 starts |
| R-04 | Legacy Journeys without owner/dates | `BR-036`; AL-01/AL-02 surface them |
| R-05 | Poorly chosen thresholds create alert noise, undermining "calm coworker" | `D-05` values plus configuration; review after first weeks of use |
| R-06 | Duplication between WS13 and WS16 around vendor confirmations | `D-07` ownership split |

### 30. Success Criteria — Status

| Criterion (this EBC) | Status |
|---|---|
| Journey Workspace scope fully defined | ✅ Section 7 |
| Functional requirements complete | ✅ 31 of 31 approved-count FRs worded + 3 proposed additions (Section 12) — wording pending ratification |
| Business rules documented | ✅ Section 14 (visibility, transitions, permissions, defaults, workspace, validation) |
| Dependencies identified | ✅ Section 7.5, 21 |
| Traceability maintained | ✅ Section 23; RTM v2.1 addendum |
| Documentation internally consistent | ✅ Section 31 checklist |
| **Product Owner approval obtained** | ⏳ **Pending** — cannot be claimed by Arjun; see Section 26 |

### 31. Quality and Consistency Checklist

- [x] No approved Product Owner decision reworded or reversed; every Confirmed statement cites its source.
- [x] Every drafted FR sits inside an approved topic group; the 31 count is exact (Section 13.2); additions are labelled and separated.
- [x] Every FR has description, rationale, acceptance criteria and dependencies.
- [x] No architecture, schema, UI layout or code decision made; implementation gaps listed as evidence for Archie/Rad only.
- [x] No destination, pricing or commercial content invented; threshold values presented as suggestions pending `D-05`.
- [x] Terminology conflicts disclosed, not silently resolved (Section 6, F-04).
- [x] Identifier series continued without renumbering (`FR-JW-05`+, `BR-025`+, `OQ-023`+).
- [x] Foundation artefacts reused, not duplicated (Section 4.2).

### 32. Recommended Next Steps (for Tiger)

1. **EBC-R1.3-WS13-001A (Tiger)** — Product Owner review and ratification of `D-01`–`D-13`, `FR-JW-05`–`34`, `BR-025`–`036`; synchronise `RELEASE-1.3.md` (WS13 row: Reserved → In Progress) and the Feature Register.
2. **WS13-002 (Sophie)** — UX Design for `JW-01`–`JW-08` including low-fidelity wireframes and UX standards (closes `FCR-022`), Dashboard KPI/Recent Activity wiring, `D-09` relabel.
3. **WS13-003 (Archie)** — Solution Architecture: extend `workspace_journeys`, new child structures, conversion RPC extension, legacy adoption, alert evaluation approach.
4. **WS13-004 (Rad)** — Engineering Planning; then Implementation, Keerthi QA, Sri experience review, Product Owner acceptance — the WS12 pattern.
5. Separate housekeeping: F-04 (Business Lifecycle note), F-06 (RTM WS12 back-fill).

### 33. Files Changed

| File | Change |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` | Created (this document) |
| `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | Additive v2.1 WS13 addendum (new §16), header version/date, §4 and §6 Journey Workspace rows annotated, revision history row. No existing row renumbered or removed. |

No application code, migration, configuration, `RELEASE-1.3.md` or Feature Register changed (governance synchronisation is Tiger's, after ratification). Nothing committed or pushed.

**Suggested commit message (for the Product Owner):**

```
docs(ws13): Journey Workspace product discovery and business analysis (EBC-R1.3-WS13-001)

Adds the WS13 Journey Workspace discovery and business analysis:
scope, processes, proposed Phase 2 lifecycle, FR-JW-05..31 completing
the approved 31 FRs, three proposed additions (FR-JW-32..34),
BR-025..036, permissions, alerts, KPI definitions and PO decisions
D-01..D-13. Adds an additive v2.1 WS13 addendum to the Workspace RTM.
Documentation only; pending Product Owner ratification.
```

---

*Prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi. Business analysis only — no UX, architecture, engineering or QA work performed. Awaiting Product Owner review.*

---

# APPENDIX B — Revision 2 Text Replaced by Revision 3 (retained verbatim for traceability)

Each entry below is the complete Revision 2 text of a line that Revision 3 (`EBC-R1.3-WS13-003A`) replaced. **Where Revision 3 differs, Revision 3 governs.** Lines Revision 3 only added are not listed.

**Header — Phase**

**Phase:** Product Discovery & Business Analysis. **Revision 2** is the Product Owner–ratified baseline.

**Header — Date**

**Date:** 24 September 2026 (Revision 1); 24 September 2026 (Revision 2, `EBC-R1.3-WS13-001B`)

**Header — Status**

**Status:** **Revision 2: Product Baseline synchronised with the Product Owner Review decisions D-01 to D-13. Awaiting Tiger's Product Baseline Verification (`EBC-R1.3-WS13-001C`) before UX Design (`EBC-R1.3-WS13-002`) begins.**

**§6 Terminology — Vendor Booking**

| | | |
|---|---|---|
| **Vendor Booking** | The single object for any service booked with a Vendor for a Journey. "Vendor Confirmation" is not a separate object; "confirmed" is a status of a Vendor Booking. | D-07 |

**§6 Terminology — Change Record**

| | | |
|---|---|---|
| **Change Record** | A logged operational change that does not affect commercial agreements, pricing, vendor commitments, traveller composition or travel schedule | D-06 |

**§6 Terminology — Readiness Template**

| | | |
|---|---|---|
| **Readiness Template** | The configured set of readiness items. Domestic and International defaults exist, and exactly one template is active per Journey. | D-04 |

**§6 Terminology — Document Readiness**

| | | |
|---|---|---|
| **Document Readiness** | Tracking of required documents by status, external reference, external link and note. No file storage. | D-10 |

**§11 Business Objects — Journey**

| | | | |
|---|---|---|---|
| **Journey** | Confirmed; refined by D-01, D-02, D-03, D-12, D-13 | A commercially confirmed travel commitment. **Identity:** Journey ID (human-readable reference format: `OQ-024`, Archie); Traveller *or* Corporate Point of Contact (party, inherited); Journey Planning Reference; **Journey Owner (always present)**; Destination/Region; **Confirmed Travel Start Date and End Date (always present)**; Current Stage; On Hold flag and reason; Outcome and reason (Cancelled / Superseded); Archived flag, reason, user and timestamp. **Carried trip parameters:** adults, children, infants, nights, departure city. **Links:** accepted Proposal Version; *Supersedes* / *Superseded by* Journey (D-13). | 1 ↔ 1 originating Journey Planning Record. Aggregate root for the objects below. |

**§11 Business Objects — Vendor Booking**

| | | | |
|---|---|---|---|
| **Vendor Booking** | **Approved (D-07)** | The single object for a service booked with a Vendor for a Journey. Fields: Vendor (Active only when new), service category (configurable), service date(s), booking reference, status, status reason, notes. | Belongs to one Journey (owned by WS13). References one Vendor (owned by WS16). |

**§11 Business Objects — Readiness Template**

| | | | |
|---|---|---|---|
| **Readiness Template** | **Approved (D-04)** | A configuration item: a named set of readiness items across the four confirmed categories (Booking confirmations, Documentation, Traveller readiness, Supplier readiness). Release 1.3 defaults: **Domestic** and **International**. New templates are added by configuration, without code. | Exactly one active template per Journey |

**§11 Business Objects — Readiness Item**

| | | | |
|---|---|---|---|
| **Readiness Item** | Confirmed (`PO-REVIEW-04` §6); model per D-04 | One checkpoint from the Journey's template, plus any manual additions. Status: Outstanding / Complete / Not Applicable (with reason). Source is either system-derived or manual. | Belongs to one Journey |

**§11 Business Objects — Document Requirement**

| | | | |
|---|---|---|---|
| **Document Requirement** | **Approved (D-10)** | A required document for the Journey or a named traveller. Fields: document type; traveller(s) concerned; **document status** (Outstanding / Received / Verified / Not Applicable); **external reference** (e.g., passport number *reference*, visa application ID); **external link** (e.g., a shared-drive location); **operational notes**. **No file upload, internal storage, OCR or versioning.** | Belongs to one Journey; feeds Documentation readiness |

**§11 Business Objects — Change Record**

| | | | |
|---|---|---|---|
| **Change Record** | **Approved (D-06)** | A logged **operational** change: what changed, why, requested by (traveller / SMV / vendor), logged by, when. Never used for material changes. | Belongs to one Journey |

**FR-JW-01**

| | | | | |
|---|---|---|---|---|
| **FR-JW-01** *(FR-WS-017; Rev 2, D-12)* | The Journey Workspace shall be the single working record for one Journey: its party and **Primary Operational Contact**, current stage, linked itinerary, linked Vendor Bookings, and Tasks/Follow-ups. | Single source of truth | AC1 Overview shows party, Primary Operational Contact, destination, confirmed dates, stage, On Hold, owner, readiness summary, active alerts, a link to the originating planning record, and Supersedes/Superseded-by links where present. AC2 Contextual sections: Itinerary, Vendor Bookings, Readiness, Documents, Tasks & Follow-ups, Notes & Activity, Change Records, History. AC3 The Primary Operational Contact is displayed separately from the Journey Owner and the Travellers. | DEP-02, DEP-03 |

**FR-JW-06**

| | | | | |
|---|---|---|---|---|
| **FR-JW-06** *(Rev 2, D-02, D-12)* | On creation the Journey shall carry from the originating record: party (Traveller or Corporate Point of Contact); Destination/Region; **Confirmed Travel Start and End Dates**; trip parameters; the accepted Proposal Version reference; and an **initial Primary Operational Contact** (I-04). | Continuity; `DEC-R1.3-014` | AC1 A Journey never exists without confirmed dates. AC2 Links exist both ways between Journey and planning record. AC3 Planning history stays on the planning record. AC4 Later Journey updates never alter the closed planning record. AC5 The Primary Operational Contact is populated at creation and editable afterwards, with audit. | CM-01; DEP-03 |

**FR-JW-09**

| | | | | |
|---|---|---|---|---|
| **FR-JW-09** *(Rev 2, D-01, D-04)* | Advancing a Journey shall be a deliberate action by its owner or an Administrator, subject to these gates: Readiness Template assigned before leaving Confirmed; all readiness items resolved before Ready to Travel; start date reached for Travelling; end date reached for Travel Complete. | `BR-004`, `BR-028`, `BR-041` | AC1 An unmet gate disables the action and gives field-specific guidance. AC2 A Not Applicable item (with reason) satisfies the readiness gate. AC3 Non-owners who are not Administrators cannot advance. | — |

**FR-JW-12**

| | | | | |
|---|---|---|---|---|
| **FR-JW-12** *(Rev 2, D-06, D-13)* | For a **material change** (Section 10.6), the Workspace shall support: placing the Journey On Hold; creating a linked, pre-filled Journey Planning Record; and, when that record converts, marking the original Journey **Superseded** with reason "Material Amendment" and links both ways to the replacement Journey. | `PD-JW-004`, D-13 | AC1 Material fields (destination, dates, nights, traveller count) are never editable on a Journey. AC2 One action places the Journey On Hold (reason: Material change) and opens the pre-filled planning record. AC3 On conversion, the original becomes Superseded automatically as part of the same business event, and both Journeys show the link. AC4 The original is never Cancelled for this reason. AC5 The replacement starts at Confirmed. | CM-02 |

**FR-JW-13**

| | | | | |
|---|---|---|---|---|
| **FR-JW-13** *(Rev 2, D-06)* | **Operational changes**, meaning those not affecting commercial agreements, pricing, vendor commitments, traveller composition or travel schedule, shall be recorded as Change Records on the same Journey. A change flagged as material shall be refused as a Change Record and directed to `FR-JW-12`. | D-06; `BR-032` | AC1 A Change Record captures what, why, requested by, who and when. AC2 Changes affecting a Confirmed or Booked Vendor Booking send it back to Requested (`BR-037`). AC3 The accepted Proposal Version is never modified. AC4 Material categories (Section 10.6) cannot be recorded as Change Records. | — |

**FR-JW-15**

| | | | | |
|---|---|---|---|---|
| **FR-JW-15** *(Rev 2, D-07)* | The owner shall create one or more Vendor Bookings for the Journey: Vendor (Active only), service category, service date(s) and notes. Each starts in **Draft**. | D-07; `FR-VM-02`/`04` | AC1 Only Active Vendors can be selected. Bookings with Vendors that later became Inactive stay visible. AC2 Multiple bookings are allowed. AC3 Service dates outside the confirmed travel window produce a warning. | DEP-05 |

**FR-JW-21**

| | | | | |
|---|---|---|---|---|
| **FR-JW-21** *(Rev 2, D-10)* | The owner shall manage **Document Readiness**: required documents per Journey or per traveller, each with document status (Outstanding / Received / Verified / Not Applicable), external reference, external link and operational notes. File upload, internal storage, OCR and versioning shall not be provided. | D-10 | AC1 The required-document list comes from the Journey's Readiness Template and can be supplemented by the owner. AC2 Reference, link and notes can be recorded. AC3 No upload control exists. AC4 Every status change is logged. AC5 Verified = the owner has checked the document is valid for this Journey. | D-04 |

**FR-JW-22**

| | | | | |
|---|---|---|---|---|
| **FR-JW-22** *(Rev 2, D-04)* | The Journey shall present readiness across the four categories, derived from its **single active Readiness Template**, with an overall state of Not Ready, At Risk or Ready. | `PO-REVIEW-04` §6; D-04 | AC1 Exactly one active template per Journey. AC2 The overall state is derived and never set manually. AC3 The state is shown in the list and the Overview. | Configuration |

**FR-JW-23**

| | | | | |
|---|---|---|---|---|
| **FR-JW-23** *(Rev 2, D-04)* | Readiness Templates shall be configuration-driven, with Domestic and International defaults, extensible without code changes. The owner assigns the template while the Journey is Confirmed; the default is proposed from the destination's domestic or international classification where known. Items are system-derived or manual, and any item may be marked Not Applicable with a reason. | D-04; `BR-018` | AC1 Adding a new template requires configuration only. AC2 A template change on a Journey re-derives its items and is logged. AC3 System items update automatically: all bookings Booked; all required documents Received or Verified. | Configuration |

**BR-026**

| | | | | |
|---|---|---|---|---|
| **BR-026** | Journey ownership | **No unassigned Journey.** Every Journey has an owner from creation: the Journey Planning owner at conversion. Ownership may be reassigned at any time before a terminal outcome. Every ownership change is audited. | D-03 | Revised (was the "Ownership Gate") |

**BR-027**

| | | | | |
|---|---|---|---|---|
| **BR-027** | Validation | **Confirmed Travel Dates at confirmation.** A Journey may not be created without a Confirmed Travel Start Date and End Date (End ≥ Start). The dates are captured in Journey Planning before the record closes as Confirmed. | D-02 | Revised (gate moved from leaving Confirmed to conversion) |

**BR-028**

| | | | | |
|---|---|---|---|---|
| **BR-028** | Status transitions | **Readiness gate.** A Journey cannot enter Ready to Travel while any item of its active Readiness Template is Outstanding. Not Applicable with a reason counts as resolved. | `PO-REVIEW-04` §6; D-04 | Unchanged in substance |

**BR-039**

| | | | | |
|---|---|---|---|---|
| **BR-039** | Workspace rule | **Material replacement and supersession.** When a material change requires a replacement Journey: the original is placed On Hold; a linked Journey Planning Record is created and follows standard planning; its conversion creates the replacement Journey (preserving `BR-012`); the original is marked **Superseded** (not Cancelled) with reason "Material Amendment"; the two Journeys are linked both ways; and the replacement continues the operational lifecycle. | D-13, `PD-JW-004` | **New** |

**BR-041**

| | | | | |
|---|---|---|---|---|
| **BR-041** | Validation | **One active Readiness Template.** Each Journey uses exactly one active Readiness Template, assigned before it leaves Confirmed. Templates are configuration (Domestic and International defaults) and extensible without code. | D-04 | **New** |

**§14.4 — Creation**

| | |
|---|---|
| Creation | Only via conversion; one Journey per planning record; owner and confirmed dates required (`BR-012`, `BR-026`, `BR-027`) |

**§14.4 — Vendor Booking**

| | |
|---|---|
| Vendor Booking | Active Vendor; category required; Section 11.1 transitions only; Booked needs a reference; Pending Information and Cancelled need a reason (`BR-037`) |

**§14.4 — Document Readiness**

| | |
|---|---|
| Document Readiness | Type and traveller(s) required; status from the defined set; external link must be a well-formed URL; no file content accepted (D-10) |

**§14.4 — Change Record**

| | |
|---|---|
| Change Record | Category must be operational; material categories are rejected (`BR-032`) |

**§14.4 — Gates**

| | |
|---|---|
| Gates | Template (`BR-041`), readiness (`BR-028`), start date for Travelling, end date for Travel Complete |

**§23 — FR-JW-01**

| | | | | |
|---|---|---|---|---|
| FR-JW-01 | V1, V3 | Spec §6.4; D-12 | BR-005, BR-040 | JW-02 |

**§23 — FR-JW-06**

| | | | | |
|---|---|---|---|---|
| FR-JW-06 | V3 | PD-JW-001; D-02; D-12; DEC-R1.3-014 | BR-012, BR-027, BR-034, BR-040 | JW-02, JW-03 |

**§23 — FR-JW-09**

| | | | | |
|---|---|---|---|---|
| FR-JW-09 | V2 | D-01; D-04 | BR-004, BR-028, BR-041 | JW-02, JW-05 |

**§23 — FR-JW-12**

| | | | | |
|---|---|---|---|---|
| FR-JW-12 | V3 | PD-JW-004; D-06; D-13 | BR-031, BR-039, BR-012 | JW-02 → JP-02 |

**§23 — FR-JW-13**

| | | | | |
|---|---|---|---|---|
| FR-JW-13 | V3 | PD-JW-003; D-06 | BR-032, BR-037 | JW-02 |

**§23 — FR-JW-15**

| | | | | |
|---|---|---|---|---|
| FR-JW-15 | V1, V3 | PO-REVIEW-04 §6; D-07 | BR-033, BR-037 | JW-04 |

**§23 — FR-JW-21**

| | | | | |
|---|---|---|---|---|
| FR-JW-21 | V2 | PO-REVIEW-04 §6; D-10 | — | JW-07 |

**§23 — FR-JW-22**

| | | | | |
|---|---|---|---|---|
| FR-JW-22 | V2, V5 | PO-REVIEW-04 §6; D-04 | BR-028, BR-041 | JW-05 |

**§23 — FR-JW-23**

| | | | | |
|---|---|---|---|---|
| FR-JW-23 | V2 | D-04 | BR-018, BR-041 | JW-05 |

**Added to Appendix B at POD-07 / POD-08 synchronisation** (lines first replaced at that point; lines already listed above are not repeated).

**§6 Terminology — Archived**

| | | |
|---|---|---|
| **Archived** | An administrative state, outside the operational lifecycle | D-08 |

**§10.1 — Archived**

| | | |
|---|---|---|
| **Archived** | **Administrative state, not part of the lifecycle** | May be applied by an authorised user at any time, with a reason. It hides the Journey from active views and keeps its stage and history. It is reversible under the existing `BR-006`, and every archive or unarchive is audited. (`BR-038`, D-08) |

**§10.2 — archive note**

Archive and unarchive act on the administrative state and are valid in any stage (`BR-038`).

**FR-JW-30**

| | | | | |
|---|---|---|---|---|
| **FR-JW-30** *(Rev 2)* | Journey Timeline covering all events, as in Revision 1, plus Primary Operational Contact changes, Vendor Booking lifecycle transitions, Readiness Template assignment and changes, supersession links, and archive and unarchive (reason, user, timestamp). | `PD-JW-006`; D-08 | AC1 Every event shows actor, time, and before/after values. AC2 Read-only for all roles. | Audit log |

**FR-JW-31**

| | | | | |
|---|---|---|---|---|
| **FR-JW-31** *(Rev 2, D-03, D-08)* | No permanent deletion of any Journey data. Ownership may be reassigned at any time **before a terminal outcome**, with every change audited. **Archive** is an administrative action by authorised users at any time, requiring a reason and recording user and timestamp. Archive is reversible under `BR-006`. Archiving never changes the stage or outcome. | `BR-007`, D-03, D-08 | AC1 No delete action. AC2 Reassignment is blocked after Journey Closed, Cancelled or Superseded. AC3 Archive requires a reason, and user and timestamp are captured. AC4 Archived Journeys are hidden from active views but searchable. | RBAC; I-03 |

**§14.1 — BR-006**

- **`BR-006`** (archive is reversible) applies to the D-08 administrative archive.

**BR-038**

| | | | | |
|---|---|---|---|---|
| **BR-038** | Workspace rule | **Archive is administrative.** Archived is outside the lifecycle and never changes stage or outcome. Authorised users may archive at any time, with a reason; user, timestamp and audit entry are recorded. A Journey becomes Archive Eligible when it has been Journey Closed for longer than the configured retention period (Release 1.3 default 60 days), and authorised users are then reminded. Archive is reversible (`BR-006`). | D-08 | **New** |

**§14.4 — Archive**

| | |
|---|---|
| Archive | Reason required; user and timestamp captured (`BR-038`) |

**§15 — Maintain row**

| | | |
|---|---|---|
| Maintain Primary Operational Contact, bookings, documents, readiness, notes, activities, Change Records, template | ✅ (owner) | ✅ |

**§15 — Archive row**

| | | |
|---|---|---|
| Archive / unarchive (authorised users, D-08) | ❌ | ✅ (I-03) |

**§16 — IN-06**

| | | | | | | |
|---|---|---|---|---|---|---|
| IN-06 | — | Journey archived or unarchived | Informational | Owner | Acknowledged | — |

**§26.4 — I-07**

| | | | | |
|---|---|---|---|---|
| **I-07** | When the primary Service Category is set (POD-02) | Not specified by the decision. Recorded as held on the Journey and set by the Journey Owner. No new gate is introduced. | Adding a conversion or stage gate would add scope | **Yes, recommended** (O-02): confirm whether it must be present at conversion |

**Added to Appendix B at the final WS13 synchronisation (WS13-004A decisions)**

**BR-036**

| | | | | |
|---|---|---|---|---|
| **BR-036** | Default behaviour | **Legacy Journey adoption.** Journeys created before WS13's release are adopted as part of release: owner = the originating planning record's owner (an Administrator assigns one if absent), confirmed dates recorded, Readiness Template assigned, stage = Confirmed, and Primary Operational Contact initialised from the party. Until adopted, a legacy Journey is flagged "Incomplete legacy record" and cannot progress. No historical data is lost. | F-02; D-02, D-03 | Revised |

**§14.3 — Primary Operational Contact at creation**

| | | |
|---|---|---|
| Primary Operational Contact at creation | The originating record's party: the Traveller (type Individual traveller) or the Corporate Point of Contact (type Corporate organisation). Editable afterwards. | D-12, I-04 |
