# EBC-R1.3-WS13-003A — Product Documentation Synchronisation Summary (Post-Architecture Product Owner Decisions)

**Persona:** Arjun, Product and Business Analyst
**Prepared by (card):** Tiger
**Release / Workstream:** 1.3 / WS13, Journey Workspace
**Date:** 26 September 2026
**Input:** Product Owner decisions POD-01 to POD-06, taken after Architecture Validation (`EBC-R1.3-WS13-003`); POD-07 and POD-08 from Tiger's validation checkpoint (§8)
**Hand-over to:** Tiger, for validation before `EBC-R1.3-WS13-004` (Rad, Engineering Planning)

---

## 1. What was done

The six Product Owner decisions were synchronised into the canonical Product artefacts. **No new scope was introduced, and Product Discovery was not reopened.** Each fact was written once, in its canonical source; other documents refer to it. No identifier was renumbered. Replaced text is retained, following the supersede-not-delete convention.

## 2. Artefacts updated

| Artefact | Path | Change |
|---|---|---|
| WS13 Product Discovery and Business Analysis (Product Specification for WS13: FRs, BRs, reference data, decision register) | `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md` | **Revision 3** (details in §3) |
| Workspace Product Specification | `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | **Additive §20** Vendor baseline note (POD-05) and a revision row. No existing text rewritten. |
| Requirements Traceability Matrix | `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | §16 synchronised; revision row "v2.1 (003A)" (details in §4) |
| This summary | `docs/09-Development/EBC-R1.3-WS13-003A-ARJUN-Product-Documentation-Synchronisation-Summary.md` | Created |

**Where the card's artefacts live.** No separate "Business Rules", "Product Decision Register" or "Product Reference Data" document exists in the repository. Their canonical homes are sections of WS13-001: §14 (Business Rules), the new §26.3 (Product Decision Register, POD) and the new §11.2 (Product Reference Data). The Vendor object is owned by the Workspace Product Specification (§7.7), so POD-05 is recorded there (§20), not in WS13-001. **The Document Index needed no change**, because it lists none of these documents individually.

## 3. Change log: WS13-001, Revision 3

| Location | Change | Decision |
|---|---|---|
| Header, Revision History | Revision 3 status and history row | — |
| §6 Terminology | Readiness Template, Change Record, Vendor Booking and Document Readiness amended. Added: Journey Readiness, Document Type, Journey Document, Service Category, Change Category, Vendor Code (pointer to the Spec). | POD-01 to POD-05 |
| §11 Business Objects | Journey gains a **primary Service Category**. Readiness Template and Readiness Item gain Mandatory/Optional designations and Not Applicable on permitted items; readiness is calculated and never stored. "Document Requirement" renamed **Journey Document**, referencing a Document Type (one-to-many). Change Record gains a Change Category. Vendor Booking "service category" renamed **service type** (I-06). | POD-01 to POD-05 |
| **§11.2 new: Product Reference Data** | Canonical lists: Readiness Templates, Service Categories, Document Type categories, Change Categories. All configurable. | POD-01 to POD-04 |
| §12 FRs | Amended: `FR-JW-01` (Service Category), `06` (AC6 no-owner rejection; AC7 dates–nights block), `09` and `22` (Mandatory applicable only; Optional never blocks; calculated and never stored), `12` (AC6 replacement defaults), `13` (Change Category; category never decides behaviour), `15` (service type), `21` (Journey Document and Document Type), `23` (Mandatory/Optional; Not Applicable only on permitted items). **No FR added.** | POD-01 to POD-06 |
| §13.3 | POD-01 to POD-06 mapped to FRs, BRs and sections | — |
| §14.2 BRs | Amended: `BR-026` (Policy 1), `BR-027` (Policy 2), `BR-028` and `BR-041` (readiness framework), `BR-039` (Policy 3). **New:** `BR-043` Primary Service Category, `BR-044` Document Types and Journey Documents, `BR-045` Change Category as classification only. | POD-01 to POD-04, POD-06 |
| §14.3, §14.4 | Defaults for the replacement planning record and the vendor migration; validation rows for Creation, Gates, Vendor Booking, Document Readiness and Change Record | POD-01, 03, 04, 05, 06 |
| §21 | **CM-05** (POD-06 affects the WS12 conversion: engineering). **CM-06** (Vendor baseline recorded in Spec §20). | POD-05, POD-06 |
| §23, §24 | Traceability of the nine amended FRs; gap **G-10** for Archie and Rad | — |
| **§26.3 new: Product Decision Register** | POD-01 to POD-06, with their relation to Archie's `PD-ARC` defaults and their canonical location | All |
| §26.4 new | Interpretations **I-05** (definition of "consistent" dates and nights), **I-06** (service type rename) and **I-07** (Service Category timing; not decided) | — |
| §31, §33.1 | Consistency rows for Revision 3; files changed | — |
| **Appendix B new** | Revision 2 text of every line Revision 3 replaced (41 entries). Appendix A (Revision 1) untouched. | — |

## 4. RTM updates

- **Nine FR rows** (`FR-JW-01`, `06`, `09`, `12`, `13`, `15`, `21`, `22`, `23`): the requirement summary, status ("amended by 003A (Rev 3)"), product decisions and business rules were refreshed.
- **Five BR rows** (`BR-026`, `027`, `028`, `039`, `041`): the statements were refreshed.
- **Three rows added:** `BR-043`–`045`. §16.2 is now titled `BR-025`–`BR-045`.
- The header, status note, Version and Last-updated fields were updated, and a "v2.1 (003A)" revision row was added.
- **No FR added. No screen mapping changed. No identifier renumbered.** POD-05 has no WS13 rule; it traces to `FR-JW-15` and Spec §20.

## 5. Confirmations

- **Product scope unchanged.** The only new product elements are the ones the Product Owner decided: the Service Category attribute and the reference lists. No FR was added.
- **UX unchanged.** No UX document or mockup was modified.
- **Architecture unchanged.** No architecture document was modified, including where POD-06 Policy 2 differs from Archie's default (O-01).
- **Engineering, release scope and governance unchanged.** Not modified: WS12 documents, `RELEASE-1.3.md`, the Feature Register, the Backlog, the Decision Log and the Document Index.
- **Nothing committed or pushed.**

## 6. Observations and recommendations for Tiger

| ID | Observation | Recommendation / owner |
|---|---|---|
| **O-01** | POD-06 Policy 2 (**block** on a dates–nights mismatch) overrides Archie's default PD-ARC-02 (**warn only**). The architecture document still states the warning. | Archie to align WS13-003 before, or as part of, WS13-004; Rad to implement the block |
| **O-02** | POD-02 adds a **primary Service Category** to the Journey. It appears neither in the UX Specification (Rev 3) nor in Archie's data model. The decision does not say when it is set, or whether it is mandatory at conversion (I-07). | Product Owner to confirm the timing; Sophie to add the UX addendum; Archie to add the data element |
| **O-03** | Revision 2 called the Vendor Booking field "service category". It is renamed **service type** to avoid a clash with POD-02. Archie's configuration list (AD-WS13-006) may use the old term. | Archie to align the terminology; the Service Type values are content to supply (EP-02) |
| **O-04** | The Service Category cannot select the Readiness Template (`BR-043`), because Domestic/International and Honeymoon/Family are different dimensions. PD-ARC-05 (the owner chooses the template) therefore stands. | None; noted for Sophie and Rad |
| **O-05** | PD-ARC-04 (template change keeps manual items; an archived Journey is read-only) is not covered by POD-01 to POD-06. Archie's defaults remain in force. | Product Owner confirmation recommended |
| **O-06** | Reference content is still missing: the individual Document Types, the items of the Domestic and International templates (with Mandatory, Optional and Not-Applicable-permitted flags), the Vendor Service Type values and the vendor spreadsheet | Product Owner content (EP-02, EP-03) before Rad needs it |
| **O-07** | POD-01 to POD-06 are not yet logged as `DEC-R1.3` entries in `RELEASE-1.3.md` §7 | Tiger, at a governance point of Tiger's choosing |
| **O-08** | Policies 1–3 change the WS12 conversion and replacement behaviour (CM-05), alongside CM-01 and CM-02. The WS12 product documentation is left historically correct, as instructed. | Include in the WS13-004 engineering plan |

## 7. Recommendation

The Product documentation is **synchronised with POD-01 to POD-06 and ready for Tiger's validation**. Subject to O-01 (Archie alignment) and O-02 (Service Category timing), it can support `EBC-R1.3-WS13-004` (Rad, Engineering Planning).


## 8. Addendum: POD-07 and POD-08 (26 September 2026)

Tiger validated this submission and brought two further Product Owner decisions from the validation checkpoint. Both are incorporated into the same documents, still as **Revision 3** of WS13-001 (the revision row now names POD-01 to POD-08).

| Document | Change | Decision |
|---|---|---|
| WS13-001 | **`BR-043`**: Service Category optional in Journey Planning, mandatory at conversion, exactly one per Journey, editable afterwards by an authorised user (owner or Administrator, I-08), every change recorded in the Journey History, never a Replacement Journey. **`FR-JW-01`** AC5, **`FR-JW-06`** AC8 (conversion validation), **`FR-JW-30`** (Service Category changes in the Timeline). §14.3, §14.4 and §15 rows. **CM-07** (Journey Planning captures the optional field; WS12 documents unchanged). I-07 resolved. | POD-07 (resolves O-02) |
| WS13-001 | **`BR-041`** and **`FR-JW-23`** AC2: on a template change, template-generated items are recalculated and manual items are retained, never removed automatically. | POD-08 Decision 1 (resolves O-05) |
| WS13-001 | **`BR-038`**, **`FR-JW-31`** (AC5, AC6), §6, §10.1, §10.2, §10.7, §14.1 (`BR-006` refined for Journeys), §14.4, §15, §16 IN-06, **`FR-JW-30`**: an Archived Journey is viewable, searchable, reportable and auditable, and read-only. Unarchive is removed from Release 1.3; any future restoration is an administrative operation. | POD-08 Decision 2 (resolves O-05) |
| WS13-001 | §13.3, §23, §26.3 (POD-07 and POD-08 rows), §31. Appendix B: 12 further Revision 2 lines retained. | — |
| RTM §16 | `FR-JW-01`, `06`, `23`, `30`, `31` and `BR-038`, `041`, `043` refreshed; status note and revision row updated. Total amended: eleven FR rows and six BR rows, plus `BR-043`–`045` added. | — |

**Specification v2.0 is not changed.** Workspace-wide `BR-006` (reversible archive) stays as it is for other records; the Journey-specific refinement is canonical in WS13-001 §14.1 and `BR-038`.

**Observation O-01 (Architecture alignment for POD-06 Policy 2):** no Product references needed changing. The Product documents already state "block".

### 8.1 New observations

| ID | Observation | Recommendation / owner |
|---|---|---|
| **O-09** | POD-08 removes unarchive from Release 1.3. The approved Revision 2 baseline had made archive reversible under `BR-006`. The UX specification (JW-14 "Archive / Unarchive" dialog, "Unarchive…" action, Administrator capability) and the Architecture (`…_unarchive` function, Phase 3 plan) still include it. I did not change either. | Sophie and Archie to align, alongside O-01 |
| **O-10** | D-08 allows archiving **at any time, including a non-terminal Journey**. With no restoration in Release 1.3, archiving an active Journey by mistake cannot be undone, and the Journey stays read-only. This follows directly from D-08 and POD-08 and is not a new rule. | Product Owner awareness. Sophie may want a clear irreversibility statement in the JW-14 dialog (her UXO-07 already raises archived non-terminal Journeys). |
| **O-11** | POD-08 says future restoration will be an administrative operation. It is not yet recorded as a future capability. | Tiger to decide whether to record it in the Product Evolution Backlog |

### 8.2 Confirmations

- **Product scope unchanged** beyond the Product Owner's own decisions. POD-08 narrows Release 1.3 by removing unarchive. That is the Product Owner's decision, recorded as such.
- **UX and Architecture decisions not modified.** No UX, architecture, engineering, WS12, governance or release document was edited. O-01 and O-09 are for Sophie and Archie.
- **POD-01 to POD-08 are all reflected** in the canonical Product documentation: WS13-001 §26.3 is the register and §13.3 maps each decision to its FRs, BRs and sections. POD-05 is canonical in Spec v2.0 §20.
- **Nothing committed or pushed.**


## 9. Final WS13 Product Synchronisation: Architecture Clarification decisions (27 September 2026)

Tiger asked for the Product Owner decisions approved during `EBC-R1.3-WS13-004A` (accepted and closed) to be recorded in the canonical Product baseline. This is not a new EBC. WS13-001 stays at **Revision 3**; its revision row now covers these decisions.

| Document | Change | Decision |
|---|---|---|
| WS13-001 | **New `BR-046` Replacement Journey inheritance.** The replacement inherits the original's approved operational context: dates and trip parameters as editable defaults; party, destination and Service Category; the accepted itinerary as Version 1; Operational Notes; a vendor quotation baseline; and, at conversion, the Primary Operational Contact and Journey Documents. Quotations come only from **Booked** bookings with **Active** vendors. Documents reset **Verified → Received** and **Not Applicable → Outstanding**. The original's records are never altered. The technical mapping stays in 004A §4 and is referenced, not repeated. | PD-B, O-A2, O-A3, O-A4 |
| WS13-001 | **New `BR-047` Review the carried proposal before sharing.** An operational expectation, explicitly not system-enforced; any future enforcement is for a later release. | O-A5 |
| WS13-001 | `BR-039` points to `BR-046`. `FR-JW-12` AC7 added. `FR-JW-06` AC5 (replacement contact carried from the original) and the Primary Operational Contact default in §14.3. **CM-08** added (Journey Planning data written by the replacement; WS12 documents unchanged). | PD-B |
| WS13-001 | `BR-027`, `FR-JW-06` AC7 and §14.4: a missing Number of Nights blocks conversion. | PD-A |
| WS13-001 | `BR-036` and `BR-043`: a legacy Journey may stay unclassified until explicitly classified; no default and no backfill. Interpretation **I-09** added. | PD-C |
| WS13-001 | §13.3 and §23 mappings; §26.3 register extended with PD-A to PD-E and O-A2 to O-A5; §33.1; Appendix B (2 more Revision 2 lines). | — |
| Spec v2.0 §20 | Vendor Code policy: `VEN-XXXXX`, system-generated, immutable after creation, unique, independent of Vendor Service Type. Revision row updated. | PD-D |
| RTM §16 | `FR-JW-06` and `FR-JW-12` refreshed; `BR-027`, `036`, `039`, `043` amended; `BR-046` and `BR-047` added; §16.2 now `BR-025`–`BR-047`; revision row "v2.1 (final sync)". | — |

PD-E (no unarchive) was already recorded under POD-08; it is registered in §26.3 as confirming it.

**Scope note.** Tiger's list named PD-B, PD-D and O-A2 to O-A5. I also recorded **PD-A** and **PD-C**, because Archie's note (O-A1) lists them as approved Product Owner decisions that were only implicit in the baseline. Without PD-C, `BR-043` ("every Journey has exactly one Service Category") would contradict the approved legacy behaviour. Both are recorded as given, with no new rule beyond their wording.

### 9.1 Observations

| ID | Observation | Recommendation / owner |
|---|---|---|
| **O-12** | "`VEN-XXXXX`" does not say whether X is a digit or an alphanumeric character. Architecture assumed five digits (`VEN-00001`, 004A §5.3). The Product documents record the format exactly as approved. | Product Owner to confirm, if it matters, before vendor migration |
| **O-13** | PD-C does not say whether a legacy Journey must be classified at adoption (I-09). Architecture requires it at adoption. | None needed unless the Product Owner intends otherwise |
| **O-14** | Under the O-A3 rule, a replacement for a Journey whose vendors are all still Confirmed (not yet Booked) starts with no quotation baseline. That is the approved behaviour; the planner re-quotes from the Superseded Journey's bookings, which stay one link away. | Awareness only (Sophie's O-A6 provenance labels help here) |

### 9.2 Confirmations

- **Product scope unchanged.** Only approved Product Owner decisions were recorded. No FR was added, and no identifier was renumbered.
- **UX unchanged.** No UX document was edited. O-A6 (provenance labels) remains with Sophie.
- **Architecture unchanged.** No architecture document was edited. The 004A mappings are referenced, not restated.
- **Engineering and release scope unchanged.** Not modified: WS12 documents, `RELEASE-1.3.md`, the Feature Register, the Backlog, the Decision Log and the Document Index.
- **All approved Product decisions are now reflected in the canonical Product baseline:** D-01 to D-13; POD-01 to POD-08; PD-A to PD-E; and O-A2 to O-A5. See WS13-001 §26.1 and §26.3, with Spec v2.0 §20 for the Vendor object.
- **Nothing committed or pushed.**


### 9.3 Product Owner clarifications O-12 and O-13 (27 September 2026)

Tiger accepted the final synchronisation, including PD-A and PD-C, and brought two clarifications from the Product Owner. O-14 was accepted as documented.

| Document | Change | Clarification |
|---|---|---|
| Spec v2.0 §20 | Vendor Code format made explicit: `VEN-` followed by five numeric digits, sequential and zero-padded, starting at `VEN-00001`; system-generated, immutable and unique. Revision row updated. | O-12 |
| WS13-001 | `BR-036` and `BR-043`: a legacy Journey may remain without a Service Category until adoption; during adoption the Journey Owner must explicitly assign it; no automatic classification or backfilling. §26.3 PD-C and PD-D rows annotated. I-09 marked resolved. Revision row updated. | O-13, O-12 |
| RTM §16 | `BR-036` and `BR-043` refreshed; "v2.1 (final sync)" revision row extended. | — |

No FR was added and no identifier was renumbered. No UX or architecture document was edited. The clarifications match Archie's existing mapping (`VEN-00001`; Service Category required at adoption), so no architecture alignment is needed. Nothing was committed or pushed.

---

*Arjun, Product and Business Analyst, Team Satvi. Synchronisation only; no new scope introduced.*
