# Release 1.3 — SMV Workspace Product Baseline (Index)

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 — Workspace Product Specification

**Document Type:** Product Baseline Index

**Prepared By:** Arjun, Product and Business Analyst, on behalf of Team Satvi

**Status:** Accepted — the Release 1.3 Product Baseline (per Tiger's review outcome, 13 September 2026)

**Date:** 13 September 2026

---

## 1. Purpose

This document is the single entry point into the approved Release 1.3 SMV Workspace Product Baseline. It exists so that Sophie (UX Architecture & Interaction Design), Archie (Technical Architecture & Solution Design), Rad (Engineering Planning & Implementation) and Keerthi (QA Strategy, Traceability & Test Design) — and any future Team Satvi session — can find the authoritative product documents, their version numbers, and the currently open decisions without having to reconstruct the Workstream 3 history.

It does not add, change or reinterpret any product decision. Every statement below is a pointer to, or a direct restatement of, one of the documents it indexes.

---

## 2. The Release 1.3 Product Baseline — Document Set

All paths are relative to `docs/02-Product/` unless stated otherwise.

| # | Document | Version | Role |
| --- | --- | --- | --- |
| 1 | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | **v2.0** | The authoritative Product Specification — all nine Workspace modules, Business Objects, Cross-Module Governance Principles, Business Rules, Journey Lifecycle, Open Questions. **Primary document for downstream work.** |
| 2 | `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | **v2.0** | The authoritative Requirements Traceability Matrix — drafted Functional Requirements, the Functional Requirement Topic Group Register (approved-but-undrafted scope), Business Rules, Open Questions, with blank UX/Architecture/Engineering/QA reference columns for Sophie/Archie/Rad/Keerthi to populate. **Primary traceability document for downstream work.** |
| 3 | `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` | v1.0 (Complete) | The complete Product Owner Review evidence record — Vision, Business Purpose, Business Object, Product Owner Decisions, Governance Decisions and Functional Requirement Summary for all nine modules, with full source citations to the underlying `PO-REVIEW-0X` review notes. Read this for the *reasoning* behind a Specification statement. |
| 4 | `WS3-DELIVERY-GOVERNANCE-CONSISTENCY-REVIEW.md` | v1.0 | The nine-category consistency check performed across the completed Product Owner Review Baseline (terminology, business objects, cross-module relationships, ownership, lifecycle, governance principles, Product Decision IDs, cross-references, duplicate/conflicting decisions) before the Specification/RTM were updated. |
| 5 | `WS3-PRODUCT-SPECIFICATION-RTM-IMPACT-ASSESSMENT.md` | v1.0 | The section-by-section impact analysis that mapped the Product Owner Review onto required Specification/RTM changes, before those changes were made. Useful for understanding *why* a given v2.0 section changed the way it did. |
| 6 | `WS3-STAGE4-CONSOLIDATED-CHANGE-LOG.md` | — (one-off) | The consolidated summary of every change made in the v1.0 → v2.0 Specification/RTM update. Read this first for a fast overview before opening the full Specification or RTM. |
| 7 | `reviews/PO-REVIEW-03-Journey-Planning.md` through `reviews/PO-REVIEW-09-Settings.md`, and `reviews/README.md` | v1.0 (Product Owner Approved) | The seven original Product Owner Review Notes, prepared by Tiger and reviewed with Vivek — the primary source evidence for everything in items 1–3 above. Not modified by any Team Satvi persona; read these for the original wording of a specific Product Owner Decision. |

**Superseded, retained for history (Project Instructions §32 — do not rewrite history):**

| Document | Status |
| --- | --- |
| `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md` | Superseded by v2.0 (item 1). Retained as the historical pre-Product-Owner-Review baseline. |
| `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md` | Superseded by v2.0 (item 2). Retained as the historical pre-Product-Owner-Review baseline. |

**Referenced but not a repository file:**

| Document | Location |
| --- | --- |
| `EBC-R1.3-WS3-004-ARJUN-Product-Specification-Baseline-Consolidation-ESCALATION.md` | Search My Vacation — SMV 2.0 claude.ai Project, path `claude/EBC-R1.3-WS3-004-ARJUN-Product-Specification-Baseline-Consolidation-ESCALATION.md`. Cited in item 3's Governance Trail (§0.1) as part of the audit history. Not part of the repository document set. |

---

## 3. Open Questions Requiring a Future Decision (OQ-018 through OQ-021)

Both the Specification (v2.0 §14) and the RTM (v2.0 §9) carry the full twenty-two-item Open Questions register. The four raised by this workstream's Stage 3/4 work, and Tiger's Delivery decision on each (recorded 13 September 2026), are:

### OQ-018 — Detailed Functional Requirement Wording

**Decision: Remain open.** No additional Functional Requirements are to be invented during the current Product Specification consolidation. Drafting the approximately 185 net-new individually-worded Functional Requirements (recorded by count and topic group only in the RTM's Functional Requirement Topic Group Register, v2.0 §6) will be executed as a **separate Business Analysis activity under a future EBC.**

### OQ-019 — Destination Intelligence / Bootstrap Generator

**Decision: Remain open.** This is an Architecture concern, not a Product concern. It will be addressed by **Archie** during Technical Architecture & Solution Design. **No Product Specification changes are required** for this item.

### OQ-020 — Vendor Quotation vs. Proposal Version

**Decision: Remain open.** This will be reviewed jointly during Architecture and Domain Modelling. **Do not attempt to merge or redesign these business objects** ("Quotation," §7.8 of the Specification, and "Proposal Version"/"Vendor Quotation," PD-JP-002/003) ahead of that review.

### OQ-021 — Master Itinerary → Traveller Itinerary Relationship

**Decision: Remain open.** This is a data-modelling decision that will be addressed during Technical Architecture. **No Product Specification changes are required** for this item.

**All other Open Questions** (OQ-001 through OQ-017, and OQ-022) retain the status recorded in the Specification v2.0 §14 and RTM v2.0 §9 — this index does not change any of them; Tiger's 13 September decision addressed only OQ-018 through OQ-021.

---

## 4. Cross-Reference and Version Consistency Check

Performed as part of this closure activity, per Tiger's instruction:

- **Every `PO-REVIEW-0X` filename referenced** in the Baseline Handover, the Specification, and the RTM was checked against the actual files in `docs/02-Product/reviews/` — all seven resolve correctly, no broken references found.
- **Every other internal filename reference** across the six baseline documents (Specification, RTM, Handover, Governance Review, Impact Assessment, Change Log) was checked against the repository — all resolve correctly, with one expected exception: the escalation record referenced in the Handover's Governance Trail (§0.1) lives in the claude.ai Project, not the repository (§2 above, "Referenced but not a repository file" — this is correct by design, not a broken link).
- **Version references are consistent**: the Specification and RTM are both v2.0; the Handover, Governance Review and Impact Assessment are all v1.0; the Change Log and this index carry no independent version number, being one-off/point-in-time documents. No document references a version number of another baseline document that does not match that document's actual current header.
- **Release identification is consistent**: every one of the seven baseline documents identifies itself as Release 1.3, Workstream 3, in its own header.
- The one surviving reference to the superseded `docs/05-Product/` path naming question (inside the historical `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md`, §1.1) is a correct historical record of a decision already made and resolved at the time — not a current inconsistency, and is left untouched per Project Instructions §32 (do not rewrite history).

**No broken links, incorrect cross-references, or inconsistent version references were found.**

---

## 5. How to Use This Baseline (Guidance for Sophie, Archie, Rad, Keerthi)

- Start with the **Consolidated Change Log** (item 6) for a fast overview of what changed and why.
- Use the **Product Specification v2.0** (item 1) as the primary reference for module scope, business objects, business rules and governance principles.
- Use the **RTM v2.0** (item 2) to trace a requirement, populate your persona's reference column (UX/Architecture/Engineering/QA), and see exactly which of the 223 approved Functional Requirements are individually drafted today (38) versus approved by count/topic-group only (~185, RTM §6).
- Consult the **Product Owner Review Baseline Handover** (item 3) when you need the business reasoning behind a specific decision, not just the decision itself.
- Treat **Open Questions OQ-018–OQ-021** (§3 above) as live constraints on your own work: do not draft the undrafted Functional Requirements yourself (OQ-018); do not resolve the Destination Intelligence/Bootstrap Generator architecture question inside a UX or engineering task without Archie (OQ-019); do not merge or redesign Quotation/Proposal Version (OQ-020); do not invent a Master/Traveller Itinerary data-model notation ahead of Archie's decision (OQ-021).

---

## 6. Workstream 3 Closure Recommendation

All Stage 1–4 deliverables under `EBC-R1.3-WS3-004` (and its predecessor cards `WS3-002`, `WS3-003`, `WS3-004A`, `WS3-004B`) are complete, accepted by Tiger, and indexed above. The cross-reference and version consistency check (§4) found no defects. On that basis, **Arjun recommends Workstream 3 be formally closed**, with the Release 1.3 Product Baseline (§2) handed over to Sophie, Archie, Rad and Keerthi as Tiger's message directs. Formal closure itself is Tiger's action, not Arjun's — this section is a recommendation, not a closure declaration.

---

## 7. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v1.0 | 13-Sep-2026 | Arjun | `EBC-R1.3-WS3-004`, Final Housekeeping | Initial Release 1.3 Product Baseline index, created per Tiger's closure instruction. Indexes seven baseline documents, records Tiger's 13 September decisions on Open Questions OQ-018–OQ-021, and reports the cross-reference/version consistency check with no defects found. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004` Final Housekeeping. It is an index, not a source of new product decisions — every substantive statement traces to one of the documents listed in §2.*
