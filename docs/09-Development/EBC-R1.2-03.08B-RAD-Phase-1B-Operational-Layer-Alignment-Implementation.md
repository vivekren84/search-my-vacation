# EBC R1.2-03.08B-EBC-RAD — Phase 1B: Operational Layer Alignment Implementation Report

## 1. EBC Information

| Field | Value |
|---|---|
| Release | Release 1.2 |
| Workstream | WS3 — Destination Intelligence |
| Phase | Phase 1B — Operational Layer Alignment |
| Task ID | R1.2-03.08B |
| EBC ID | R1.2-03.08B-EBC-RAD |
| Owner | Rad (Destination Operational Steward, DEC-R1.2-014) |
| Reviewer | Tiger |
| Business Owner | Vivek |
| Status | **Implemented** |
| Type | Engineering Implementation |
| Report Date | 18 August 2026 |

---

## 0. Repository / Workspace Confirmation

| Item | Value |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Branch | `feature/ebcr1.2-003-trust-strip-visual-refresh` |
| Working-tree status before this EBC | Clean except pre-existing untracked items (`_to_delete/`, one unrelated EBC-009 doc, and this workstream's uncommitted `EBC-R1.2-03.08` report) |
| **Governance prerequisite verified, not just trusted** | This EBC's Background claims Outstanding Decision 1 was closed and Rad appointed Destination Operational Steward. Before touching anything, I independently confirmed this against the actual repository — commit `749e421` (`R1.2-019: Close ADR-R1.2-WS3-001 Outstanding Decision 1`), and read the live ADR text: §8 Artefact Ownership Matrix line 169 ("Destination Operational Steward — Rad, assigned 18 August 2026"), new §8.1 Governance Roles table, and §15 Decision 1 ("Status: Closed – Approved... Rad is appointed Destination Operational Steward **for Release 1.2**, approved by Vivek and Tiger"). RELEASE-1.2.md's `DEC-R1.2-014` and `R1.2-019` entries corroborate independently. Only having verified this directly did implementation proceed. |
| Mandatory reading completed in full | `ADR-R1.2-WS3-001` (current, post-update version); `DESTINATION-KNOWLEDGE-BASE.md` §10.11, §10.3; `EBC-R1.2-03.02`, `03.03`, `03.05`, `03.07`, `03.08` (all previously authored this workstream) |

---

## 2. Files Planned for Modification (Mandatory Step 0)

Produced after directly inspecting the operational workbook (read-before-change) to establish precise, row-level ground truth, and before any cell was edited.

| File | Reason for Change | Type of Change | Expected Impact |
|---|---|---|---|
| `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` | Resolve the Assam structural misalignment identified in `EBC-R1.2-03.08` and already flagged, pre-existing, in the workbook's own Review Register (`review-0135`, `review-0206`, `review-0285`, `review-0286`, `review-0291`) — Assam is currently split across two other destinations' region lists rather than existing as its own destination, contradicting `DESTINATION-KNOWLEDGE-BASE.md` §10.11's explicit text. Four sheets within this one file are touched: `Destination Intelligence`, `Destination Catalogue` (structural ID/name fields only), `Source Register`, `Review Register` (provenance and review-closure bookkeeping) | Data/content change (Operational Layer) | Workbook's own checksum changes (see Section 4). **No runtime, generated-JSON, or recommendation-eligibility impact** — regeneration was not run (out of scope), and `Journey Base Status` was deliberately left unchanged on both affected rows (see Section 3). |
| `docs/09-Development/EBC-R1.2-03.08B-RAD-Phase-1B-Operational-Layer-Alignment-Implementation.md` | This implementation report | Documentation (new file) | None |

**Files considered and NOT modified, with reasons:**

| Item | Considered for | Why not touched this pass |
|---|---|---|
| Amritsar's 3 operational rows (`Record Type: Attraction`, `Journey Base Status: No`) | WP-1B.2 (approved gaps) | Unlike Assam, there is **no pre-existing Review Register recommendation** proposing a structural change for Amritsar — its current classification may be a deliberate, if dated, operational choice rather than a confirmed error. Re-classifying it without that same class of evidence would be a product judgment call, not a "directly supported by approved business documentation" structural fix. Left open as a follow-up recommendation (Section 8). |
| Darjeeling (zero operational rows) | WP-1B.2 (approved gaps) | Fully authored in the KB (§10.11) but has zero rows and zero Review Register awareness in the operational layer. Adding it requires authoring a new, complete ~122-column record from scratch — content creation, not structural alignment, and a materially different scale/risk of work than relabeling existing rows. Deferred (Section 8), not attempted here. |
| Corbett (zero operational rows) | WP-1B.2 (approved gaps) | Same reasoning as Darjeeling; the workbook's own `review-0292` already names this as a known, open "Potential addition" — left `Open`, not resolved, for the same content-authorship reason. |
| `Journey Base Status` field on the two edited Assam rows | WP-1B.1 (workbook alignment) | Deliberately **left unchanged** ("Review Required" on both). This field is the exact mechanism (`generateJourneyDNA.ts`'s `journeyBaseStatus === "Yes"` filter, traced in `EBC-R1.2-03.03`) that determines recommendation-eligibility at generation time. Changing it would cross into "expand destination coverage" / "alter recommendation logic" — both explicitly listed as Out of Scope for this EBC (Section 8 of the EBC) and reserved, by the EBC's own text, for "later implementation phases." Structural correctness (which destination a row belongs to) and recommendation-readiness (whether it should be generated into the candidate pool) are treated here as two separate questions; only the first was in scope. |
| `web/generated/*.json`, any runtime code | Explicitly out of scope | Not touched; the generator was not run |

No additional files became necessary beyond the two planned above.

---

## 3. Summary of Operational Layer Alignment (WP-1B.1)

**Ground truth established by direct inspection** (not assumption) of the live workbook before any edit:

| Field | Row — general Assam | Row — wildlife/Kaziranga Assam |
|---|---|---|
| Before — Destination ID / Destination | `india-northeast` / "Northeast" | `india-wildlife-tours` / "Wildlife Tours" |
| Before — Region ID / Region | `india-northeast-assam` / "Assam" | `india-wildlife-tours-assam` / "Assam" |
| After — Destination ID / Destination | `india-assam` / "Assam" | `india-assam` / "Assam" |
| After — Region ID / Region | `india-assam-assam` / "Assam" | `india-assam-kaziranga` / "Kaziranga" |
| Parent Region | Assam (was: Northeast) | Assam (was: Wildlife Tours) |
| Record Type | Region (unchanged) | Region (unchanged) |
| **Journey Base Status** | **Review Required (unchanged)** | **Review Required (unchanged)** |
| All ~110 remaining descriptive/scoring columns (Journey Identity, Best For, Emotional Outcomes, all Traveller/Emotion/Experience scores, etc.) | Unchanged — content already specific and accurate to Assam | Unchanged — content already specific and accurate to wildlife/Kaziranga |

**Why this specific split, and not a merge into one row:** the workbook's own `review-0206` explicitly recommended identifying "a reserve such as Kaziranga" for the wildlife-flavoured entry "after approval" — that approval now exists (KB §10.11 confirms Assam as a standalone destination that itself includes Kaziranga, per KB §10.13's own area table). `review-0285`/`review-0286` explicitly instructed "confirm one canonical ownership model **without deleting source rows**" — both rows were kept, differentiated, and reassigned to one canonical destination, exactly as instructed. No row was added or deleted; no descriptive content was invented — the general-Assam row's content was already specific to Assam (not copied from elsewhere), and the Kaziranga row's existing wildlife/nature/photography content already matched what the KB independently says about Kaziranga.

**Read-before-change note:** an earlier internal draft of this row-lookup used the wrong offset and briefly pulled Sikkim's and Ranthambore's data under the Assam rows' row numbers — caught and corrected before any file was written, by re-deriving the correct row indices from content matching rather than trusting an arithmetic offset. No incorrect data reached the delivered file; verification in Section 5 re-confirms the final saved file against the intended values.

---

## 4. List of Operational Gaps Resolved

| Review Register ID | What it asked for | Resolution |
|---|---|---|
| `review-0135` | "Assam is maintained separately in repository knowledge; review parent structure." | **Resolved.** Reclassified as standalone `india-assam`. |
| `review-0206` | "Assam is too broad for a wildlife-region record; identify a reserve such as Kaziranga after approval." | **Resolved.** Row renamed to Kaziranga under `india-assam`. |
| `review-0285` | "Region name also appears under: Wildlife Tours. Confirm one canonical ownership model without deleting source rows." | **Resolved.** Both rows now sit under one canonical destination; neither was deleted. |
| `review-0286` | Mirror of `review-0285` from the Wildlife Tours side. | **Resolved.** |
| `review-0291` | "Add Assam as a distinct destination if the approved repository model remains authoritative." | **Resolved.** KB §10.11 confirms the model remains authoritative; Assam is now a distinct operational destination. |

Each resolved item's `Status` was set to `Resolved` and its `Recommendation` cell was appended (not overwritten) with a dated resolution note citing this EBC and the KB section relied on, preserving the original recommendation text for audit purposes. Four corresponding `Source Register` provenance rows (2 per relocated region) had their `Destination ID`/`Region ID` keys updated to match, with a resolution note appended to the "insufficient for full region-level approval" note that had routed them to the Review Register in the first place.

**Deliberately left open (not resolved) in this pass:**

| ID | Why still Open |
|---|---|
| `review-0136`, `review-0207` (Operational Confidence) | Structural relocation doesn't change operational-confidence readiness; still requires genuine operational review |
| `review-0137`/`0138`, `review-0208`–`0210` (Accessibility, Extension, Food/Cultural Moment) | Unrelated to structure; still require supplier/content-specific review |
| `review-0292` (Corbett) | Requires new-row content authorship, deferred (Section 2, Section 8) |

---

## 5. Controlled Vocabulary Alignment Summary (WP-1B.3)

No vocabulary field (`Primary Experiences`, `Emotional Outcomes`, `Best For`, or any of the Traveller/Emotion/Experience score-and-reason columns) was modified in this pass — only identity/structural fields (`Destination ID`, `Region ID`, `Destination`, `Region`, `Parent Region`). Since the generator dynamically loads the operational layer's own taxonomy sheets rather than validating against a separately hardcoded list (`loadWorkbook.ts`'s `loadTaxonomies()`, confirmed in `EBC-R1.2-03.03`), nothing about this structural change affects vocabulary validity.

The deeper question — full reachability between the KB's 17/36/9 controlled-vocabulary lists and the operational workbook's own smaller native taxonomy (5 Traveller Types / 11 Emotional Goals / 15 Desired Experiences sheets, unchanged: still 6/12/16 rows including headers) — remains explicitly out of this phase's scope, consistent with the approved implementation plan (`EBC-R1.2-03.05`), which places full vocabulary/generator alignment in **Phase 2**, not Phase 1B. Nothing here should be read as having closed that gap.

---

## 6. Operational Traceability (WP-1B.4)

The edit itself is the traceability improvement: every relocated row's `Source Register` entries now correctly key to `india-assam`, so a future reader tracing "where did this operational record come from" no longer lands on a stale `india-northeast`/`india-wildlife-tours` reference. The five resolved Review Register items each carry an explicit citation back to `DESTINATION-KNOWLEDGE-BASE.md §10.11` and `DEC-R1.2-014`, so the chain from Business Layer approval → Operational Layer change → governance decision that authorised it is readable directly from the workbook itself, not only from this report.

---

## 7. Validation Results

| Check | Result | Evidence |
|---|---|---|
| ESLint | ✅ **PASS** | `npm run lint` — zero warnings/errors (no code changed) |
| TypeScript (whole application) | ✅ **PASS** | `npx tsc --noEmit -p tsconfig.json` — zero errors |
| Workbook integrity after edit | ✅ **Confirmed** | Re-opened the saved file fresh (independent of the editing session) and verified: all 8 sheets present; `Destination Intelligence`/`Destination Catalogue` row counts unchanged (107 data rows, before and after); all 3,959 formula cells elsewhere in the workbook intact (edits were made without `data_only` mode specifically to avoid flattening formulas); an unrelated control row (Kerala/Munnar) confirmed byte-identical to before |
| Row-level verification | ✅ **Confirmed** | Re-read the two edited `Destination Intelligence` rows and their `Destination Catalogue` mirrors post-save; values match the intended after-state in Section 3 exactly; `Journey Base Status` confirmed unchanged; the five resolved and three deliberately-untouched Review Register items confirmed in their expected states |
| Runtime behaviour | ✅ **Unchanged** | The generator was not run; `web/generated/*.json` is untouched; the runtime never reads the workbook directly (confirmed architecture, `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §1) |
| Recommendation behaviour | ✅ **Unchanged** | Same reasoning; `Journey Base Status` — the sole inclusion-gate field — was not touched |
| Traveller-facing behaviour | ✅ **Unchanged** | No public config, presentation catalogue, or UI file was touched |

## 8. Build Results

Not re-run. No file under `web/` changed in this pass; the last full validation of the application (ESLint, whole-project TypeScript, dev-server startup, three runtime verification suites) was completed in `EBC-R1.2-03.07`, and the only thing that changed since is one binary data file outside `web/` entirely, plus this report. `next build`'s previously-documented sandbox network limitation (Google Fonts fetch) is unrelated and unchanged.

---

## 9. Files Modified — Planned vs Actual

**No difference.**

| File | Planned | Actual | Match |
|---|---|---|---|
| `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` | ✅ | ✅ | ✅ |
| `docs/09-Development/EBC-R1.2-03.08B-RAD-Phase-1B-Operational-Layer-Alignment-Implementation.md` | ✅ | ✅ (new file) | ✅ |

**Workbook checksum (for the record — this is expected to change, and is not itself a defect):**

| | SHA-256 |
|---|---|
| Before this EBC | `b90a6af3d661197dcdebe75b941eb060788fbe2cb209b67ae4167560d5a1f8a8` (matches `journey-intelligence-1.0.0-b90a6af3d661` already embedded in the currently-generated runtime manifest) |
| After this EBC | `17d4c5a5873354932ba739221b60e3baebb02bd12fd1916cc2ea2b84767a87b7` |

The currently-generated `web/generated/*.json` files still carry the *old* checksum in their manifest — that is expected and correct until a future, separately-scoped generation run picks up this workbook change (Phase 2, per the approved plan). The workbook and the generated artefacts being momentarily out of sync is exactly the "Operationally Authored, not yet Runtime Ready" lifecycle state the ADR (§12) describes, not a defect.

---

## 10. Follow-up Recommendations

1. **Amritsar** — still classified as 3 `Attraction` records with `Journey Base Status: No`, despite a fully-authored KB destination record (§10.3). Unlike Assam, no pre-existing Review Register item recommends a structural change here, so I did not treat this as "directly supported by approved documentation" in the same way. Recommend Arjun or Tiger confirm whether this was ever a deliberate business call (e.g., "Amritsar's attractions aren't ready to be a full Journey Base yet") or is simply an inherited seed-workbook gap like Assam was — that answer determines whether a future EBC should restructure it the same way.
2. **Darjeeling and Corbett** — both need genuinely new operational records authored (not just relabeled), which is a different scale and kind of work than this EBC's scope. Recommend a dedicated, appropriately-scoped follow-up (ideally with Arjun's or Sophie's input on narrative quality, consistent with Section 19's content-readiness discipline) rather than Rad drafting ~122 columns of new descriptive/scoring content unilaterally.
3. **Regeneration timing** — the workbook and the generated runtime artefacts are now intentionally out of sync (Section 9). Recommend Tiger sequence the next generation run deliberately (Phase 2), rather than someone running `npm run generate:journey-intelligence` ad hoc — this Assam change plus whatever Phase 1B/2 adds next should ideally regenerate together, not piecemeal.
4. **Review Register status vocabulary** — before this EBC, every entry in the Review Register used `Open` as its only status value; I introduced `Resolved` as a new, clear status. Recommend this becomes the documented convention for future review closures rather than something each implementer invents independently.

---

## 11. Validation Checklist (per EBC)

| Item | Status |
|---|---|
| Operational workbook aligns with the approved Knowledge Base | ✅ For Assam, specifically and completely; Amritsar/Darjeeling/Corbett remain open (Section 10) |
| Approved operational gaps are resolved | ✅ 5 of the directly-evidenced Assam-related gaps; others deliberately deferred with reasons given |
| Controlled vocabularies remain consistent | ✅ Untouched, therefore unchanged; deep KB-reachability alignment remains Phase 2 scope |
| Runtime behaviour is unchanged | ✅ |
| Recommendation behaviour is unchanged | ✅ |
| Traveller experience is unchanged | ✅ |
| Planned and actual file lists reconcile | ✅ Section 9 |

---

## 12. Acceptance Criteria Mapping

| Acceptance Criterion | Status |
|---|---|
| Operational-layer alignment has been completed | ✅ For the Assam gap specifically; not claimed for Amritsar/Darjeeling/Corbett, which remain open by design |
| Previously documented operational gaps have been addressed where authorised | ✅ — 5 Review Register items resolved with direct citations |
| Traceability between Business and Operational layers is improved | ✅ Section 6 |
| Runtime behaviour remains unchanged | ✅ |
| Validation passes successfully | ✅ Section 7 |
| Documentation accurately reflects the implemented changes | ✅ This report, plus the workbook's own updated Review/Source Register entries |

---

## 13. Commit

**Suggested commit message from the EBC** (`feat: align operational destination intelligence layer`) **is accurate for what was implemented and will be used as-is**, unlike the previous EBC's suggested message. Not committed yet — pending your go-ahead, same as every prior EBC this workstream.
