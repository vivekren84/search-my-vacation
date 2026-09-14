# WS3 Stage 4 — Consolidated Change Log

**Search My Vacation — SMV Workspace Product Specification & RTM, v1.0 → v2.0**

**Prepared By:** Arjun, Product and Business Analyst

**EBC:** `EBC-R1.3-WS3-004`, Stage 4 (Consolidated Baseline Update)

**Date:** 13 September 2026

---

## 1. Purpose

This is the standalone consolidated change log Tiger's Stage 4 instruction requested, summarising the changes made to both `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` and `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` in one place. Full detail lives in each document's own §17/§15 (respectively); this is the cross-document summary for a reader who needs the whole picture without opening both files.

## 2. What Triggered This Update

Tiger's decision summary (13 September 2026) on the four Stage 3 escalations raised in the Impact Assessment:

1. Destination Intelligence vs. WS1 Bootstrap Generator architecture — routed to Archie's Technical Architecture Review; no Specification architecture decision made here.
2. Vendor lifecycle terminology — approved: standardise on Active/Inactive, retire "Deactivated."
3. Journey Planning Record deletion — approved: rewrite BR-007 so Journey Planning Records, Journeys, Traveller History, Proposal History, Vendor History and Destination Profiles support archival but not permanent deletion; remaining permanent-deletion capability restricted to administrative/configuration data.
4. Detailed Functional Requirement wording — confirmed: do not invent it; track as a separate Business Analysis activity.

## 3. Scope of This Update

Both documents were updated in one coordinated pass, as Tiger originally specified back in the Stage 1 sequencing instruction ("perform one consolidated update to the Product Specification and one consolidated update to the Requirements Traceability Matrix").

## 4. Product Specification: v1.0 → v2.0 — Summary

- Seven modules added in full (Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence, Notifications, Settings); Dashboard and Traveller Hub promoted from Proposed to Approved with no content change.
- Business Objects: Master Itinerary + Traveller Itinerary (replacing Itinerary); Destination Profile (replacing Destination Knowledge, governance model changed, technical implementation deferred to Archie); Vendor lifecycle extended (Prospective/Active/Inactive); Notification lifecycle extended (Informational/Action Required, condition-based); two new objects (Workspace Configuration, Personal Preferences); Journey corrected to Phase 2-only; Journey Planning Record confirmed distinct from Journey.
- Business Rules: BR-007 rewritten; BR-006 updated to match; ten new rules added (BR-010–019).
- New section: Cross-Module Governance Principles (§8).
- Journey Lifecycle: Phase 1 stage breakdown replaced with the approved PD-JP-005 sequence; Phase 2 remains Proposed.
- Open Questions: OQ-002, OQ-003, OQ-005, OQ-007, OQ-013 resolved; OQ-004, OQ-011 partially resolved; five new items raised (OQ-018–022).

## 5. Requirements Traceability Matrix: v1.0 → v2.0 — Summary

- All 38 existing drafted Functional Requirements re-statused (most promoted to Approved; Itinerary Studio's 4 and Destination Intelligence's 3 marked Legacy — pending rewrite; Vendor Management's terminology corrected to Inactive).
- New Functional Requirement Topic Group Register added (§6 of the RTM), recording the full 223-FR approved scope by module, count and topic group — without assigning individual IDs or inventing wording for the ~185 not yet drafted.
- Ten new Business Rules added (BR-010–019), each traced to its source Product Decision(s).
- Five new Open Questions added (OQ-018–022); six existing ones resolved or partially resolved.
- No `.xlsx` companion created — the individually-traceable item count (64: 38 FR + 7 NFR + 19 BR) remains below the 75-item threshold set in v1.0.

## 6. What Was Deliberately Not Done

- No wording was invented for the approximately 185 net-new Functional Requirements approved by count/topic-group only. This is the single largest remaining gap and is tracked as Open Question OQ-018 in both documents, with no owner or process yet assigned — that is Tiger's decision to make, not this update's to assume.
- No architecture decision was made about Destination Intelligence vs. the WS1 Bootstrap Generator pipeline (OQ-019) — the Specification records the approved business/governance decisions only and explicitly defers the technical question to Archie.
- No change was made to the Administrator/Privilege User capability lists (§4 of the Specification) — the Product Owner Review's module evidence did not address personas, so this remains exactly as it was in v1.0 (OQ-001).
- Two new terminology/structural gaps were discovered while drafting this update and are disclosed as new Open Questions rather than silently resolved: whether the existing "Quotation" object is the same concept as the newly-approved "Proposal Version" (OQ-020), and how the Master Itinerary → Traveller Itinerary parent/derived relationship should be modelled (OQ-021).

## 7. Recommended Version Promotion

Given the scope of this update — seven modules added, five Business Objects added or materially changed, one Business Rule substantively rewritten, ten new Business Rules added, one new cross-cutting section added — this update recommends promoting both documents to **v2.0** (rather than an incremental v1.1). This is a recommendation for Tiger/the Product Owner to confirm, consistent with the original Stage 4 instruction to "recommend promotion of both documents to the next baseline version" rather than decide it unilaterally.

## 8. What Happens Next

Per Tiger's Stage 3 decision, the following is not part of this Stage 4 update and awaits separate scoping:

1. Drafting the ~185 net-new individual Functional Requirements (OQ-018) — owner and process to be decided by Tiger.
2. Archie's Technical Architecture Review of the Destination Intelligence/WS1 reconciliation (OQ-019).
3. Confirmation of the Quotation/Proposal Version terminology question (OQ-020) and the Master/Traveller Itinerary data-model notation (OQ-021), both newly raised by this update.

## 9. Files Delivered With This Change Log

- `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`
- `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md`
- `WS3-STAGE4-CONSOLIDATED-CHANGE-LOG.md` (this document)

All three are committed to `docs/02-Product/` in the repository, alongside (not replacing) the v1.0 versions of the Specification and RTM, which remain as historical baseline per Project Instructions §32 (do not rewrite history).

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004` Stage 4.*
