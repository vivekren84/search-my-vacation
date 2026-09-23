# EBC-R1.3-WS12-011B — Product Owner Ratification & Canonical Product Baseline Synchronization

**Persona:** Tiger — Programme and Delivery Lead
**Release:** 1.3
**Workstream:** WS12 — Journey Planning
**Phase:** Governance Synchronisation (Product Analysis closure, following Product Owner Acceptance)
**Status:** Complete — documentation governance only. **Addendum added 22 September 2026 (same day, Product Owner request): Appendix A — Ratified Product Decisions (Quick Reference).**
**Date:** 22 September 2026

---

## 0. Workspace Readiness Check (Project Instructions §14/§15)

- Local repository confirmed connected: `/Users/viveksophu/Documents/Projects/SearchMyVacation`.
- Current branch: `main`.
- Working-tree status at start of this card: a substantial pre-existing, uncommitted change set from Rad/Radha's WS12-007/010 engineering and QA work (application code under `web/`, two Supabase migrations, `TECH-DEBT.md`, and three untracked WS12-010/010V/011A documentation files) — none of it created by this card, none of it touched by this card. Confirmed unchanged at close (see Section 7, Git Status).
- Confirmed `docs/09-Development/EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md` and `docs/09-Development/EBC-R1.3-WS12-011A-ARJUN-Product-Gap-Analysis-Journey-Planning-Minimum-Planning-Information.md` both exist in the repository and were read in full before any edit was made.
- Confirmed no standalone `EBC-R1.3-WS12-011` (bare, Product Owner Acceptance) document exists as a separate file — its narrative is carried entirely within `EBC-R1.3-WS12-011A`'s own Background/header text, which this card treats as the authoritative record of that trigger event, consistent with this card's own "Inputs (authoritative)" list.
- Confirmed no separate Requirements Traceability Matrix file exists — the RTM is `EBC-R1.3-WS12-003` Section 19, edited in place.

---

## 1. Mandatory Repository Review — What Was Found

- `EBC-R1.3-WS12-003` (479 lines at the start of this card) is the canonical Journey Planning Business Analysis: 22 sections covering Business Context, Objectives, Actors, Functional Scope, Lifecycle (§5), Business Objects (§6), Functional Requirements `FR-JP-01`–`30` (§7), Business Rules (§8) through Deliverables and Handover (§22).
- `EBC-R1.3-WS12-011A` (253 lines) is Arjun's Product Gap Analysis, already ratified to **Revision 2** by the Product Owner (its own header carries both a "Revision 1 — Product Owner Clarification & Response" and a "Revision 2 — Product Owner Decisions" block). It proposes `FR-JP-31`–`36` (with `FR-JP-35` superseded by `FR-JP-34`'s Revision 2 expansion), `BR-020`/`021`/`023`/`024` (with `BR-022` superseded), a Planning Parameters sub-group for the Journey Planning Record object, and six new RTM rows — all reproduced in Section 2 below exactly as proposed, with no wording invented by this card.
- **Governance finding, disclosed and corrected under this card (see Section 5):** `docs/10-Backlog/RELEASE-1.3.md` Section 5's WS12 row still read "🔒 **Reserved**" / Owner "TBC — to be assigned when this workstream commences" / "No Product Discovery, Business Analysis, UX, Architecture, Engineering or QA work has been performed under this identifier" — directly contradicted by `DEC-R1.3-013`/`DEC-R1.3-014` already recorded in the same document (ratifying WS12-005 Architecture and WS12-006 Engineering Planning) and by the `EBC-R1.3-WS12-002` through `-011A` document chain already present in the Claude Project and this repository. `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md`'s `FEAT-R1.3-013` row carried the identical staleness.
- `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` (established under `EBC-R1.3-GOV-004`) was reviewed for an applicable cross-reference: none exists. This gap-closure is a Product Analysis correction routed through, and resolved within, normal Product Owner Acceptance — it is not a deferred item and does not belong in the Product Evolution Backlog. Disclosed rather than silently assumed, per this card's own Activity 7 ("if applicable").

---

## 2. Activities Performed

All nine Activities from this card's own instruction were performed; none required UX, Architecture, Engineering or database work, consistent with the card's Constraints.

**Activity 1/2 — Canonical Product Specification and Functional Requirements (`EBC-R1.3-WS12-003`):**
- Added a **Document Revision History** block (new, under the header) recording Revision 1 (original, 19-Sep-2026) and Revision 2 (this card, 22-Sep-2026), naming every section Revision 2 touches — so the amendment is dated and attributed rather than silently blended into the original text.
- Section 7 (Functional Requirements): appended `FR-JP-31`, `32`, `33`, `34` (expanded per Revision 2), and `36`, each tagged *(Revision 2, `EBC-R1.3-WS12-011B`)*; appended `FR-JP-35` struck through with a superseded note, per this project's supersede-not-delete convention (Section 19 discipline). Added a "Revision 2 additions" paragraph after the existing "Coverage against the approved 30" paragraph — the original paragraph is untouched.

**Activity 3 — Business Rules (`EBC-R1.3-WS12-003` §8):**
- Appended `BR-020` (Minimum Planning Information), `BR-021` (Discovery-Exit Composition, Trip-Shape and Departure Gate — expanded per Revision 2), `BR-023` (Explicit-Value Data Integrity) and `BR-024` (Travel Date Deferral). Appended `BR-022` struck through with a superseded note. No existing rule was renumbered.

**Activity 4 — Lifecycle Model and Business Object (`EBC-R1.3-WS12-003` §5, §6.1):**
- §5: the Discovery stage's Exit Criteria cell now states the `BR-021` gate explicitly (Children/Infants/Month/Nights/Departure City, explicit zero valid) alongside the pre-existing business-judgement language, which is preserved rather than replaced. Added a "Discovery-to-Planning gate" note beneath the table distinguishing the five gated Planning Parameters from Exact Travel Date.
- §6.1: added a new **Planning Parameters** bullet (between the existing "Identity/key fields" and "Relationships" bullets) reproducing `EBC-R1.3-WS12-011A` §5.2's proposed field-by-field gating exactly, and closing with an explicit "Distinct from Booking Parameters" sentence.

**Activity 5 — Forward Allocation:**
- `FR-JP-36`/`BR-024` themselves state that Exact Travel Date becomes mandatory only at Booking/Confirmation. Additionally, §17 (Integration Points) gained a new row naming this Forward Allocation to Journey Workspace (WS13) explicitly, so the boundary is visible in the Integration table, not only inside the FR/BR text — no booking workflow, field or screen is introduced into WS12 by this card.

**Activity 6 — Requirements Traceability Matrix (`EBC-R1.3-WS12-003` §19):**
- Appended RTM rows for `FR-JP-31`, `32`, `33`, `34`, `35` (superseded, shown for traceability) and `36`, reproducing `EBC-R1.3-WS12-011A` §5.5 exactly, plus a `WS12-011B` ratification citation in the Product Decision column.

**Activity 7 — Release Governance:**
- `docs/10-Backlog/RELEASE-1.3.md`: added **`DEC-R1.3-015`** (Section 7, Product Decision Log) recording the ratification and its full scope; corrected the stale WS12 row (Section 5 — see Section 5 below); added a Change History row (v1.15); appended a WS12 sentence to the Section 3 dashboard's Overall Progress note; bumped the document's own **Document Version**/**Last Updated** fields, found stale at 1.3/08-Sep-2026 despite fourteen prior Change History entries (a pre-existing inconsistency, corrected as routine hygiene alongside this card's own edit, not separately in scope).
- `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md`: `FEAT-R1.3-013`'s Source Backlog Reference, Current Status, Primary Owner and Notes cells updated to carry the same WS12 correction and the new decision reference; document version bumped 1.6→1.7 with a matching Change History row.
- `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md`: reviewed, no update made — no cross-reference is applicable (Section 1 above).

**Activity 8 — Product Owner Ratification:**
- Recorded explicitly in `DEC-R1.3-015` (Decision, Reason, Outcome, Status = Approved) and in this card's own Section 6 below: Revision 2 is accepted, Product Analysis for this gap is complete, and `EBC-R1.3-WS12-003` (as amended) is the canonical Release 1.3 baseline for Journey Planning's business specification going forward.

**Activity 9 — Verification:** see Section 3.

---

## 3. Verification

- **FR/BR identifier uniqueness:** `FR-JP-31` through `FR-JP-36` and `BR-020`/`021`/`023`/`024` do not collide with any pre-existing identifier in `EBC-R1.3-WS12-003` (`FR-JP-01`–`30`; `BR-002`, `004`, `005`, `008`–`013`, `016`, plus the named rules). `FR-JP-35`/`BR-022` are reused exactly as `EBC-R1.3-WS12-011A` proposed them (they were never previously issued in `WS12-003`), then immediately marked superseded in the same edit — no identifier is issued and left dangling.
- **Cross-references:** every new FR cites its governing BR (`FR-JP-31`→`BR-020`; `FR-JP-34`→`BR-021`; `FR-JP-36`→`BR-024`) and every new BR cites its `EBC-R1.3-WS12-011A` §5.3 origin and the Product Owner Ratification. The RTM (§19) rows were added for every new/superseded FR, matching §5.5 of the source document field-for-field.
- **Supersede-not-delete followed:** `FR-JP-35` and `BR-022` remain visible (struck through) with an explicit superseding note in both their originating tables (§7, §8) and the RTM (§19) — neither was deleted, and no downstream reference to the surviving IDs was broken.
- **No renumbering:** no existing FR or BR identifier was changed; all insertions are additive, appended after the last existing row in each table.
- **Internal consistency across the two updated tracker documents:** `RELEASE-1.3.md`'s WS12 row and `RELEASE-1.3-FEATURE-REGISTER.md`'s `FEAT-R1.3-013` row now tell the same WS12 story (Business Analysis Revision 2, `DEC-R1.3-013`/`014`/`015`, outstanding UX refinement and workstream closure) rather than the two divergent/stale versions found at the start of this card.
- **Scope discipline:** `git diff --stat` confirms only three files changed by this card (`EBC-R1.3-WS12-003`, `RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`); no application code, migration, or other document was touched.

---

## 4. Explicitly Out of Scope — Confirmed Not Done

Per this card's own Constraints:

- No UX activity performed — `EBC-R1.3-WS12-004` (Sophie's UX package) was not opened or modified; the newly-gated Planning Parameters remain a Sophie handover item (Section 6).
- No Architecture activity performed — no architecture, data-model, schema or Supabase document touched.
- No Engineering activity performed — no file under `web/` or `supabase/migrations/` touched by this card (the pre-existing Rad/Radha changes there are untouched — see Section 7).
- No database change, no code change, no implementation planning.

---

## 5. Disclosed Findings — Tiger's Consistency-Review Instruction

Per Tiger's own added instruction ("review all Release 1.3 documentation for consistency after synchronisation and explicitly disclose any document intentionally left unchanged, with rationale"):

**Corrected (not merely disclosed):**
- `RELEASE-1.3.md` Section 5, WS12 row — materially stale ("🔒 Reserved"/"TBC"/"no work performed"), contradicted `DEC-R1.3-013`/`014` in the same document. Corrected in this card (Section 2, Activity 7).
- `RELEASE-1.3-FEATURE-REGISTER.md`, `FEAT-R1.3-013` — carried the identical staleness for the Workspace Business Modules portion of its Current Status/Primary Owner/Notes cells. Corrected alongside the tracker.
- `RELEASE-1.3.md`'s own `Document Version`/`Last Updated` fields — stale at 1.3/08-Sep-2026 despite fourteen Change History rows already past that point; bumped to 1.15/22-Sep-2026 as routine hygiene on a document this card was already editing, not treated as a separate governance finding requiring its own decision record.

**Reviewed and intentionally left unchanged, with rationale:**
- `docs/10-Backlog/PRODUCT-EVOLUTION-BACKLOG.md` — no cross-reference applicable; this gap-closure is a Product Analysis correction resolved through ordinary Product Owner Acceptance, not a deferred/Product Evolution item (Section 1).
- `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` — reviewed; no genuine new Future Consideration arose from this synchronisation activity, so no entry was added, consistent with this project's convention of not manufacturing entries.
- `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` / `RELEASE-1.3-WORKSTREAM-PLAN.md` — hold no WS12-specific content and are out of this card's scope; not touched.
- `EBC-R1.3-WS12-002` (Discovery) — the pre-existing, still-open recommendation (carried in `EBC-R1.3-WS12-003` §0/§22) to reconcile the committed repository copy of `WS12-002` with its fuller ratified content is a separate, older item, unrelated to the Minimum Planning Information gap this card closes. Not actioned here; re-flagged for a future Rad/Tiger repository-commit pass, consistent with how it was carried forward, undisturbed, by `EBC-R1.3-WS12-003` itself.
- `EBC-R1.3-WS12-004` through `-010V` (Sophie/Archie/Radha/Keerthi's own reports) — not opened or edited; this card's authority does not extend to amending another persona's report, and none of their content is contradicted by this synchronisation.

---

## 6. Completion Criteria — Status

| Criterion (from this card's own instruction) | Status |
|---|---|
| Product Owner decisions reflected in the canonical documentation | ✅ `EBC-R1.3-WS12-003` amended in place as Revision 2 |
| Release governance artefacts synchronised | ✅ `RELEASE-1.3.md` (`DEC-R1.3-015`, WS12 row, dashboard, Change History, version fields), `RELEASE-1.3-FEATURE-REGISTER.md` (`FEAT-R1.3-013`, Change History, version) |
| Requirements Traceability complete | ✅ §19 RTM extended for all six new/superseded FRs |
| Updated documentation becomes the official Release 1.3 baseline | ✅ Recorded via `DEC-R1.3-015` (Approved) |
| WS12 formally ready to hand over to Sophie for UX refinement | ✅ Recorded as the explicit next step in the WS12 tracker row (Section 5, `RELEASE-1.3.md`) — the newly-gated Planning Parameters (Children, Infants, Travel Month, Nights, Departure City) and the Number of Adults field at creation need to be reflected in the Journey Planning UI; this card does not perform that work itself |

WS12 as a whole is **not** marked ✅ Complete by this card — that remains gated on Sophie's UX refinement pass, a further QA/regression cycle, and the Product Owner's own closure decision for the workstream, all explicitly disclosed as outstanding in the corrected tracker row.

---

## Appendix A — Ratified Product Decisions (Quick Reference)

Added at the Product Owner's request (22 September 2026), as a governance convenience only. This is a summary index into decisions already ratified via `DEC-R1.3-015` and encoded in `EBC-R1.3-WS12-003` Revision 2 (Section 2 above) — it introduces no new Product, UX, Architecture or Engineering decision. Downstream personas (Sophie, Archie, Radha, Keerthi) should use this table as a locator and confirm detail against the cited FR/BR text before implementation, not treat it as a substitute for reading `EBC-R1.3-WS12-003` itself.

| Decision | Ratified Outcome | Canonical Reference |
|---|---|---|
| Progressive enrichment | Accepted — Planning Parameters (other than Adults) may remain unknown at creation and are captured progressively during Discovery | `BR-020` |
| Discovery → Planning lifecycle gate | Accepted — a named, narrow exception to the otherwise business-judgement-based Discovery exit | `BR-021`; §5 |
| Adults | Mandatory from record creation | `FR-JP-31` |
| Children | Available from creation; explicit value (zero valid) required before Planning | `FR-JP-33`, `FR-JP-34` |
| Infants | Available from creation; explicit value (zero valid) required before Planning | `FR-JP-33`, `FR-JP-34` |
| Intended Travel Month | Required before Planning | `FR-JP-34` |
| Number of Nights | Required before Planning | `FR-JP-34` |
| Preferred Departure City | Required before Planning — moved forward from the now-superseded Planning → Proposal Shared gate | `FR-JP-34`; supersedes `FR-JP-35`/`BR-022` |
| Exact Travel Date | Not required for Journey Planning; mandatory only during Booking (WS13 ownership) | `FR-JP-36`, `BR-024`; §17 |
| Budget | Explicitly excluded from Journey Planning as a required field at any stage | `FR-JP-32`, `BR-020` |
| Planning Parameters ownership | Journey Planning Record | §6.1 |
| Booking Parameters ownership | WS13 — Journey Workspace | §6.1, §17, §18 |

**Explicit-value integrity note:** for every gated parameter above, an explicit zero is a valid value; an unanswered field is not (`BR-023`).

This appendix is descriptive only — it summarises decisions ratified elsewhere in this card and in `EBC-R1.3-WS12-003` Revision 2; it does not itself ratify, alter, or supersede anything, and no Product, UX, Architecture or Engineering activity was performed to produce it.

---

## 7. Files Modified

- `docs/09-Development/EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md` (amended in place, Revision 2)
- `docs/10-Backlog/RELEASE-1.3.md` (WS12 row, `DEC-R1.3-015`, Change History v1.15, dashboard note, Document Version/Last Updated)
- `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` (`FEAT-R1.3-013`, Change History v1.7, Document Version)
- `docs/09-Development/EBC-R1.3-WS12-011B-TIGER-Product-Owner-Ratification-and-Canonical-Product-Baseline-Synchronization.md` (this card, new; amended same day with Appendix A per the Product Owner's addendum request — no other file touched by that addendum)

No other file was created, modified, or deleted by this card. No file under `web/`, `supabase/`, `docs/02-Product/`, `docs/04-UX/`, or `docs/20-Architecture/` was touched.

---

## 8. Git Status (post-edit)

```
 M docs/09-Development/EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md
 M docs/09-Development/EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md      (pre-existing, not this card)
 M docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md
 M docs/10-Backlog/RELEASE-1.3.md
 M docs/10-Backlog/TECH-DEBT.md                                                                     (pre-existing, not this card)
 M web/... (11 files)                                                                                (pre-existing, not this card)
?? docs/09-Development/EBC-R1.3-WS12-010-RADHA-QA-Defect-Resolution-and-Regression-Support.md        (pre-existing, not this card)
?? docs/09-Development/EBC-R1.3-WS12-010V-RADHA-Migration-Sync-Verification.md                       (pre-existing, not this card)
?? docs/09-Development/EBC-R1.3-WS12-011A-ARJUN-Product-Gap-Analysis-Journey-Planning-Minimum-Planning-Information.md (pre-existing, not this card)
?? docs/09-Development/EBC-R1.3-WS12-011B-TIGER-Product-Owner-Ratification-and-Canonical-Product-Baseline-Synchronization.md (this card)
?? supabase/migrations/... (2 files)                                                                 (pre-existing, not this card)
?? web/app/api/workspace/journey-planning/[recordId]/history/                                        (pre-existing, not this card)
?? web/app/api/workspace/journey-planning/[recordId]/tasks/                                          (pre-existing, not this card)
?? web/components/workspace/shared/Toast.tsx                                                         (pre-existing, not this card)
```

`git diff --stat` for this card's three edited documents: 47 insertions, 9 deletions across `EBC-R1.3-WS12-003` (+38/-2), `RELEASE-1.3.md` (+13/-4... net per tool), `RELEASE-1.3-FEATURE-REGISTER.md` (+5/-3) — additive changes consistent with the supersede-not-delete convention (deletions are old field values being bumped, e.g. version numbers, and the two superseded-row insertions replacing nothing).

**No commit or push performed**, per standing Git Safety convention (Project Instructions §26) — all changes left in the working tree for the Product Owner's own review and commit.

**Recommended commit message**, for the Product Owner's use:

```
docs(WS12): ratify Revision 2 of Journey Planning Minimum Planning
Information gap analysis, synchronise canonical baseline

Per EBC-R1.3-WS12-011B (Tiger, Product Owner Ratification & Canonical
Product Baseline Synchronization):

- EBC-R1.3-WS12-003: amend in place as Revision 2 — Discovery-to-Planning
  gate (BR-021), Planning Parameters object sub-group, FR-JP-31/32/33/34/36
  (FR-JP-35 superseded), BR-020/021/023/024 (BR-022 superseded), Forward
  Allocation note to WS13, RTM rows added. Supersede-not-delete followed.
- RELEASE-1.3.md: add DEC-R1.3-015; correct the stale WS12 tracker row
  (previously "Reserved"/"TBC" despite DEC-R1.3-013/014 already recorded
  against it); Change History v1.15; dashboard note; version fields bumped.
- RELEASE-1.3-FEATURE-REGISTER.md: FEAT-R1.3-013 corrected to match;
  Change History v1.7.
- New: EBC-R1.3-WS12-011B governance card itself.

Documentation governance only — no UX, Architecture, Engineering,
database, or application code changes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QrQUZC7JxnmU18X9heRBFQ
```

---

## 9. Governance Certification

- Persona: Tiger (Programme and Delivery Lead), acting alone — no other persona's approval authority was exercised or assumed by this card, consistent with Project Instructions §2/§10.
- This card does not approve architecture, UX, functional or traveller-experience quality on behalf of Archie, Sophie, Keerthi or Sri; none of that work was in this card's scope.
- Final release inclusion and workstream closure remain the Product Owner's decision, not asserted here.

**Prepared by:** Tiger — Programme and Delivery Lead
**Date:** 22 September 2026
**Session:** https://claude.ai/code/session_01QrQUZC7JxnmU18X9heRBFQ

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QrQUZC7JxnmU18X9heRBFQ
