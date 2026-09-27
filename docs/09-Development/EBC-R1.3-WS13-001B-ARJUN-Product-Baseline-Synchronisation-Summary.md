# EBC-R1.3-WS13-001B — Product Baseline Synchronisation Summary (WS13 Journey Workspace)

**Persona:** Arjun, Senior Product & Business Analyst
**Release / Workstream:** 1.3 / WS13, Journey Workspace
**Date:** 24 September 2026
**Input:** Product Owner Review decision record for D-01 to D-13 (all approved, 24-Sep-2026). This record is the authoritative source.
**Hand-over to:** Tiger, for Product Baseline Verification (`EBC-R1.3-WS13-001C`)

---

## 1. What was done

The thirteen approved decisions were synchronised into the canonical Product artefacts. **No requirement beyond the decision record was introduced.** No identifier was renumbered. Superseded Revision 1 text is retained verbatim, following the project's supersede-not-delete convention.

## 2. Artefacts updated

| Artefact | Path | Change |
|---|---|---|
| WS13 Product Discovery and Business Analysis (FRs, BRs, lifecycles, workflows) | `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` | **Revision 2.** Revision History block; §1, §6, §7, §9–§24 and §25–§33 synchronised; Revision 1 kept as Appendix A |
| Requirements Traceability Matrix | `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | §16 (v2.1) synchronised: 34 `FR-JW` rows Approved; `BR-025`–`042` (18 rules); OQ dispositions; revision row added |
| Workspace Product Specification | `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | **Additive** §19 note: Phase 2 lifecycle closed; `PD-JW-005` refined; OQ-004 and OQ-017 closed. No existing text rewritten. |
| Journey Planning Business Analysis (WS12) | `docs/09-Development/EBC-R1.3-WS12-003-…-Journey-Planning.md` | **Revision 3 note** (cross-module impact of D-02 and D-13); `FR-JP-36` and `BR-024` annotated "refined by D-02". Nothing renumbered or reworded. |
| This summary | `docs/09-Development/EBC-R1.3-WS13-001B-ARJUN-Product-Baseline-Synchronisation-Summary.md` | Created |

**Not touched, as instructed:** UX, Architecture, Engineering, `RELEASE-1.3.md`, Feature Register, Backlog, Workstream Plan and governance documents. Nothing committed or pushed.

## 3. Decisions incorporated

| Decision | Where it now lives |
|---|---|
| D-01 Journey lifecycle (… → Travel Complete → Post Travel → Journey Closed; On Hold, Cancelled; Archived administrative) | §10; BR-025, 029, 030; FR-JW-08, 09, 11, 34 |
| D-02 Confirmed travel dates before confirmation | BR-027; FR-JW-06, 14; CM-01 (WS12-003 Revision 3) |
| D-03 Ownership inherited, never unassigned | BR-026, 035, 036; FR-JW-03, 07, 31; unclaimed alert retired |
| D-04 Configuration-driven Readiness Templates | BR-041; FR-JW-22, 23 |
| D-05 Configurable operational alerts (milestones, payment reminders, follow-ups, tasks) | BR-042; §16 AL table; FR-JW-24, 26 |
| D-06 Operational vs material change | BR-031, 032; §10.6; FR-JW-12–14 |
| D-07 Vendor Booking (Draft → Requested → Pending Information → Confirmed → Booked; Cancelled) | BR-037; §11.1; FR-JW-15–17 |
| D-08 Archive as an administrative state (60-day default eligibility, reminder, reason/user/timestamp) | BR-038; §10.7; FR-JW-26, 30, 31 |
| D-09 Operational dashboard; "Create Journey" removed | FR-JW-05, 32; CM-03 |
| D-10 Document Readiness (no storage) | FR-JW-21; §11 |
| D-11 `FR-JW-32`–`34` approved | §12.10 |
| D-12 Primary Operational Contact | BR-040; FR-JW-01, 06, 19, 29 |
| D-13 Material replacement → original Superseded | BR-039; FR-JW-12, 27; CM-02 |

## 4. Consistency result

There are no remaining contradictions between Product Discovery, FRs, BRs, the RTM, the Workspace Foundation and Journey Planning at the **product** level (WS13-001 Revision 2, §31). Where an approved decision refines an earlier approved one, the refinement is recorded rather than left silent:

- `PD-JW-005`: outcomes refined. See the Spec §19 note.
- `PD-JW-004`: now covers all material changes, ending in Superseded.
- `FR-JP-36` / `BR-024`: the date gate moves to conversion. See WS12-003 Revision 3.
- The WS11 Dashboard quick action is removed (CM-03).

## 5. Product ambiguity status

| Item | Status |
|---|---|
| WS13 Open Questions OQ-023 to OQ-030 | All **resolved** by the decisions, or **reclassified to Architecture** (OQ-024 reference format, OQ-025 storage of trip parameters). Neither blocks UX. |
| OQ-004, OQ-017 | **Closed** |
| **I-01 — Payments** | **One declared item.** D-05 and D-09 mention payments, but no payment object exists in any approved Workspace module. Synchronised as **Payment-category Tasks and Follow-ups** with reminders. No payment record, ledger, invoice or gateway is introduced. **Needs a one-line Product Owner confirmation at 001C.** If a real payment object is intended, that is new scope and needs its own analysis. |
| I-02, I-03, I-04 | Interpretations within approved rules, for Tiger to verify. I-02: every material change uses the D-13 replacement path in Release 1.3. I-03: archive is Administrator-only by default. I-04: the Primary Operational Contact is initialised from the planning party. |

## 6. Items for Tiger (outside Product scope)

1. **CM-01 / CM-02:** D-02 and D-13 require changes to the **closed** WS12 conversion (date gate; replacement link and supersession). An engineering follow-up must be scheduled, or WS13 cannot enforce these decisions (Risk R-07).
2. **CM-03:** remove the "Create Journey" Dashboard quick action (Sophie and Rad).
3. **F-04, F-06:** housekeeping (Business Lifecycle terminology note; RTM back-fill for WS12). Non-blocking.
4. At a governance point of Tiger's choosing: update `RELEASE-1.3.md`, the Feature Register and the tracker. Not done here.

## 7. Recommendation

The WS13 Product Baseline is **ready for Tiger's Product Baseline Verification (001C)**. Subject to that verification and the I-01 confirmation, the documentation is ready for **EBC-R1.3-WS13-002 (Sophie, UX Design)**.

---

*Arjun, Product and Business Analyst, Team Satvi. Synchronisation only. No new requirements introduced.*
