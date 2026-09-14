# WS3 Product Specification / RTM Impact Assessment

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 – Workspace Product Specification

**Document Type:** Impact Assessment

**Prepared By:** Arjun – Product and Business Analyst

**Source Evidence:** WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md v1.0; WS3-DELIVERY-GOVERNANCE-CONSISTENCY-REVIEW.md v1.0

**Status:** Draft for Product Owner / Tiger Approval

**Version:** 1.0

**Stage:** EBC-R1.3-WS3-004B, Stage 3 of 5

---

## 1. Purpose and Boundary

This document identifies the changes that will be required to `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md` and `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md` as a result of the completed Product Owner Review (Modules 3–9).

**No change has been made to either document.** Neither file has been opened for editing during this assessment. This document is a plan for Stage 4, not the update itself, per the explicit instruction to stop after the impact assessment and await approval.

Three items identified during the Delivery Governance Consistency Review require a decision from Tiger or the Product Owner before Stage 4 can proceed on the affected sections; these are listed in Section 3 and must not be silently resolved during drafting.

---

## 2. Scope of Impact — Overview

| Area | Current State (existing baseline) | Required Change | Blocking? |
|---|---|---|---|
| Module coverage | 2 of 9 modules specified (Dashboard, Traveller Hub) | Add 7 modules: Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence, Notifications, Settings | No |
| Business Objects | Itinerary, Destination Knowledge, (no Vendor, Notification, Journey Planning Record objects yet defined) | Rename Itinerary → Master Itinerary + add Traveller Itinerary; rename Destination Knowledge → Destination Profile; add Vendor, Notification, Workspace Configuration, Personal Preferences | No (rename), Yes (Destination Profile governance model, see §3.1) |
| Business Rules | BR-007 (Administrator permanent delete of Archived records) | Reconcile against new PD-JP-007 | Yes, see §3.3 |
| Open Questions | OQ-005, OQ-007, OQ-008, OQ-012, OQ-013 open | OQ-005, OQ-013 close; OQ-007 closes but in a way requiring architecture confirmation; OQ-008, OQ-012 remain open | Partially, see §3.1 |
| Functional Requirements | 38 approved (Dashboard 6+2 pending, Traveller Hub 5+3 pending) | Approved scope rises to 223 total; ~212 are approved by count/topic-group only and have no drafted wording anywhere in the evidence | Yes, see §4 |
| Governance Principles table | 7 rows, 3 Approved / 4 Proposed | All 7 rows move to Approved; 1 new principle (9th) added | No |
| Product Decision Register | 16 decisions (PD-GEN, PD-DASH, PD-HUB) | 57 total decisions across 10 groups | No |
| Terminology | Vendor lifecycle not yet specified | New "Inactive" state vs. existing "Deactivated" wording elsewhere in the baseline needs reconciling | Yes, see §3.2 |

---

## 3. Blocking Items Requiring a Decision Before Drafting

These three items were identified in the Delivery Governance Consistency Review (§8, §9.1, §3.3 of that document) and are restated here as the formal set that must be resolved, or explicitly deferred with a recorded risk acceptance, before the affected Specification sections are drafted at Stage 4.

### 3.1 Destination Intelligence governance model vs. WS1 Bootstrap Generator architecture

**Nature of the impact:** The Product Owner Review approves a Destination Profile object with a Draft → Under Review → Approved lifecycle, authored and progressed by Workspace Users inside the Workspace. The already-built WS1 Bootstrap Generator / Travel Region / `geo_places` pipeline treats destination content as externally curated and delivered via a repository-generated Bootstrap Workbook that Product enriches, not an object authored through Workspace screens.

**Specification sections affected if unresolved:** §5.7 Destination Intelligence (new), the Business Object model, and potentially the data architecture referenced by Archie's WS1 architecture decision record.

**Decision required:** Archie must confirm whether (a) the Destination Profile authoring model described in the Product Owner Review supersedes the WS1 pipeline, (b) the two coexist with the Bootstrap Generator feeding an initial Draft state that Workspace Users then progress through Under Review/Approved, or (c) the Product Owner Review's description needs to be revisited against the existing architecture before being reflected in the Specification.

**Recommendation:** Do not draft §5.7 of the updated Specification until Archie's decision is recorded. Drafting this section ahead of that decision risks the Specification stating an authoring model that is either technically already superseded or in conflict with production architecture.

### 3.2 Vendor lifecycle terminology: "Inactive" vs. "Deactivated"

**Nature of the impact:** The Product Owner Review approves Prospective → Active → Inactive as the Vendor lifecycle. The existing Specification baseline uses "Deactivated" for what appears to be the same operational end-state.

**Specification sections affected if unresolved:** §5.6 Vendor Management (new) lifecycle definition, and any RTM row that references the Vendor deactivation state.

**Decision required:** Tiger or the Product Owner to confirm whether "Inactive" is the corrected, intended terminology (in which case "Deactivated" should be retired from the Specification) or whether the two terms describe different states that were conflated during review.

**Recommendation:** Low risk either way, but must be settled before drafting to avoid introducing two labels for one state.

### 3.3 Journey Planning Record deletion (PD-JP-007) vs. existing Business Rule BR-007

**Nature of the impact:** PD-JP-007 states Journey Planning Records shall never be deleted. Existing BR-007 permits an Administrator to permanently delete an Archived Journey Planning Record. As recorded, these conflict.

**Specification sections affected if unresolved:** §5.3 Journey Planning (new) Business Rules, and the existing Business Rules section carrying BR-007.

**Decision required:** Tiger or the Product Owner to confirm whether PD-JP-007 is an absolute rule that supersedes and retires BR-007, or whether PD-JP-007 applies to non-Administrator roles only, leaving BR-007's Administrator exception intact.

**Recommendation:** Do not draft the Journey Planning Business Rules subsection, and do not retire or amend BR-007, until this is confirmed.

---

## 4. The Undrafted Functional Requirement Dependency

This is flagged as the single largest Stage 4 dependency, separate from the three blocking items above because it affects every module rather than a specific decision.

The Product Owner Review approves Functional Requirement **counts and topic groupings** for each of the seven new modules (30 for Journey Planning, 31 for Journey Workspace, 36 for Itinerary Studio, 30 for Vendor Management, 35 for Destination Intelligence, 24 for Notifications, 21 for Settings — 207 in total, plus 5 pending FRs already noted against Dashboard and Traveller Hub in v0.1, bringing the full approved scope to 223 against an existing baseline of 38).

None of the `PO-REVIEW-0X` documents, nor the handover, contains the individual wording of these ~212 Functional Requirements — only the approved topic groups (for example, Vendor Management's 30 FRs are grouped under "Vendor creation, Vendor maintenance, Service category management, Geographic coverage, Preferred Partner management, Performance recording, Search, Operational relationships, Governance, Audit history" with no per-requirement statement).

**This is a real gap, not an oversight to route around.** Arjun's role does not include inventing Functional Requirement wording to fill approved topic groups — doing so would mean originating requirements rather than documenting Product Owner decisions, which Tiger's instructions and Arjun's own operating rules both prohibit.

**Decision required from Tiger:** who drafts the ~212 individual Functional Requirements, and under what review process, before they are entered into the Specification and RTM. Options as I understand them, not as a recommendation of one over the others:

- Arjun drafts candidate FR wording from the approved topic groups and Business Object/Decision detail already in the review evidence, with each drafted FR explicitly labelled Proposed (not Approved) until the Product Owner reviews and approves the wording — this keeps FR authorship traceable to Arjun rather than to the original Product Owner Review.
- A further Product Owner Review pass is scheduled specifically to approve individual FR wording, module by module, before Stage 4 drafting begins.
- The Specification is updated at Stage 4 with the approved topic groups and counts recorded as placeholders, and the individual FR text is tracked as a separate, explicitly-flagged follow-on activity with its own EBC.

This choice materially affects how large and how risky Stage 4 will be, so it is raised here rather than assumed.

---

## 5. Section-by-Section Impact on the Product Specification

### 5.1 Module Sections (§ per module)

Seven new module sections are required, following the existing Dashboard/Traveller Hub structure: Vision, Business Purpose, Business Object, Product Owner Decisions, Business Rules, Lifecycle (where applicable), Cross-Module Relationships, Functional Requirement Summary. Source: the seven `PO-REVIEW-0X` documents via the v1.0 handover §5.3–5.9.

### 5.2 Business Object Model

Add: Vendor, Notification, Workspace Configuration, Personal Preferences, Traveller Itinerary (as a derived object). Rename: Itinerary → Master Itinerary; Destination Knowledge → Destination Profile (subject to §3.1 above before finalising the Destination Profile section specifically).

### 5.3 Two-Tier Object Structure (new pattern)

The Specification's object-model section does not currently express a parent/derived relationship (Master Itinerary → Traveller Itinerary is a copy-and-personalise relationship, not a simple reference). This will need either a new subsection or an extension of the existing object-model notation. This is a structural gap identified in the Governance Consistency Review (§4), not a contradiction.

### 5.4 Governance Principles Table

Update all 7 existing rows from Proposed/mixed to Approved, and add the 9th principle: "Operational designations are independent of lifecycle status," generalising Traveller Hub's Operational Flags and Vendor Management's Preferred Partner.

### 5.5 Open Questions Register

Close OQ-005 and OQ-013 with reference to PD-JW-002 and PD-JW-001 respectively. Note explicitly in the closure text that OQ-005 is resolved in the opposite direction to the Specification's original Proposed assumption, not a simple confirmation. Close OQ-007 with reference to the Destination Profile decisions, subject to and after §3.1 is resolved — do not close this Open Question with Specification wording that assumes an authoring model Archie has not yet confirmed. Leave OQ-008 and OQ-012 open.

### 5.6 Ownership Model Section

Confirm with Tiger/Product Owner (per the Governance Consistency Review §6) whether the Generic Ownership Model (Claim/Assign/Reassign) applies uniformly to Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence records, or whether any module uses a variant, before extending the existing Ownership Model section to cover them.

### 5.7 Business Rules

Add new Business Rules drawn from each module's Governance Decisions (for example, Vendor Management's "Separation of Lifecycle and Designation," Itinerary Studio's "Review Before Knowledge Adoption," Notifications' "Condition-Based Lifecycle"). Reconcile BR-007 per §3.3 above before finalising the Journey Planning Business Rules.

### 5.8 Product Decision Register

Add all 41 new Product Decisions (PD-JP through PD-ST) to the existing register of 16, bringing the total to 57. This is a direct transcription from the v1.0 handover §9 with no drafting judgement required.

---

## 6. Impact on the Requirements Traceability Matrix

### 6.1 New Traceability Rows

Once Functional Requirement wording exists for a module (see §4 dependency), each FR requires a corresponding RTM row tracing it to its Business Object, Product Decision ID, and acceptance criteria, consistent with the existing RTM structure for Dashboard and Traveller Hub.

### 6.2 Terminology Propagation

Any RTM row referencing Vendor state, Destination content, or Itinerary must use the terminology confirmed at Stage 4 (Master Itinerary vs. Itinerary; Destination Profile vs. Destination Knowledge; Inactive vs. Deactivated per §3.2).

### 6.3 Cross-Module Traceability

The RTM does not currently have a mechanism to express the cross-module relationships now approved across all nine modules (for example, a Vendor Management FR that also touches Journey Planning). Whether this needs a new RTM column or can be handled through existing free-text linkage is a structural question for Stage 4, not answered here.

---

## 7. Items Explicitly Not Assessed Here

- **Architecture-level implications** of the Destination Intelligence conflict (§3.1) — reserved for Archie, referenced but not analysed further in this Product/RTM-focused assessment.
- **UX/interaction implications** of the new modules — reserved for Sophie, not in scope for Arjun's Impact Assessment.
- **Individual FR wording** — reserved per the decision required in §4.
- **Engineering effort or sequencing** of the eventual Specification/RTM update — reserved for Tiger's delivery planning once Stage 4 is authorised.

---

## 8. Recommended Sequencing for Stage 4 (Not a Decision, a Suggestion)

If and when Stage 4 is authorised, the dependency order below is suggested purely to reduce rework, and remains subject to Tiger's actual sequencing decision:

1. Resolve the three blocking items in §3 (Destination Intelligence architecture, Vendor terminology, Journey Planning deletion rule).
2. Resolve the FR-drafting approach in §4.
3. Update the Business Object Model and Governance Principles table (no blocking dependencies).
4. Draft the seven new module sections in the Specification, in the same order as the Product Owner Review (Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence, Notifications, Settings) — deferring the Destination Intelligence section specifically until §3.1 is resolved.
5. Update the Open Questions register and Product Decision Register.
6. Extend the RTM once FR wording exists.
7. Produce the consolidated change log and recommend the next baseline version number for both documents.

---

## 9. Final Validation

- [x] No change made to `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md`.
- [x] No change made to `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md`.
- [x] All three blocking items from the Governance Consistency Review are restated here as explicit decisions required, not resolved.
- [x] The undrafted-FR dependency is stated as a decision required, not filled in with invented wording.
- [x] No recommendation in this document constitutes a Product Specification change; all recommendations are sequencing or process suggestions pending Tiger/Product Owner authorisation.

---

## 10. Awaiting Approval

This Impact Assessment, together with the v1.0 Product Owner Review Baseline Handover and the Delivery Governance Consistency Review, completes Stages 1–3 of EBC-R1.3-WS3-004B.

Per the agreed sequence, work stops here. Stage 4 (Consolidated Baseline Update to the Product Specification and RTM) will not begin until:

1. The three blocking items in Section 3 are resolved or an explicit risk-accepted deferral is recorded for each; and
2. The Functional Requirement drafting approach in Section 4 is decided; and
3. Tiger and/or the Product Owner explicitly approve commencement of Stage 4.

---

## 11. Revision History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-13 | Initial Impact Assessment, produced against WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md v1.0 and the Delivery Governance Consistency Review v1.0. |

---

**End of Document**
