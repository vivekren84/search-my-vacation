# EBC-R1.3-WS1-009 — Rad — Workbook Protection & Product Editability Remediation Report

```text
Document Type : Engineering Remediation Report
Persona        : Rad (Engineering and Implementation Specialist)
Workstream     : Release 1.3, Workstream 1 — Destination Intelligence Evolution
Card           : EBC-R1.3-WS1-009 (Tiger, addressed to Rad)
Predecessor    : EBC-R1.3-WS1-008 (Keerthi — QA Validation, PASS WITH OBSERVATIONS)
Branch         : feature/ebc-r1.3-ws1-007-bootstrap-generator (unchanged — same branch as WS1-007)
Status         : Remediation complete. Verified live against real Supabase data. NOT committed, NOT pushed.
```

---

## 1. Root cause

All three workbook-structure defects (QA-2 High, QA-3 Medium, and part of QA-1 Medium) traced to **one bug**, in `xlsxWriter.ts`'s `sheetXml()`:

```ts
// before
if (cell.value === null || cell.value === "") return "";
```

A blank cell was written as *no `<c>` element at all*. In OOXML, a cell with no `<c>` element inherits the sheet's default formatting — `cellXfs` index 0 — which this workbook's own style table defines as `protection locked="1"`. Every Category B/C column is blank on a first-generation run (Product hasn't curated anything yet), except `kbStatus`, which always carries a value (`"ACTIVE"` seeded, or Product's own correction). That is exactly why QA-2 found only `kbStatus` unlocked: it was the *only* Category B/C column guaranteed to have a non-blank cell, so it was the only one that ever got its own `s="3"` (unlocked) attribute written. Every Reserved column is *always* blank by design, so it never got its `s="4"` (yellow-fill) attribute either — that is QA-3, the same root cause.

**Fix:** every cell now gets an explicit `<c r="ref" s="styleIndex">` element regardless of value — blank cells are written self-closing (`<c r="ref" s="styleIndex"/>`, no `<v>` child), which is valid OOXML for an empty-but-styled cell. One four-line change in one function.

## 2. Files modified

| File | Change |
|---|---|
| `web/scripts/bootstrap-workbook/xlsxWriter.ts` | Root-cause fix for QA-2/QA-3 (Section 1). |
| `web/scripts/bootstrap-workbook/types.ts` | Added `placeType` to `GeoIdentityFields`/`EMPTY_GEO_IDENTITY` and to `SHEET2_GENERATED_COLUMNS` (QA-1, partial). Added a documentation block on `SHEET2_COLUMNS` recording the `aliases`/`kbSectionRef` scope decisions (Section 3). |
| `web/scripts/bootstrap-workbook/buildTravelRegions.ts` | Plumbed `placeType` through the one `geoIdentity` construction (unused by Sheet 1's own column list, kept for type symmetry). |
| `web/scripts/bootstrap-workbook/buildPlaces.ts` | Plumbed `placeType` through all three `geoIdentity`/row-construction sites (known-KB-place lookup, explicit-seed rows, containment-discovered candidate rows) — the data was already returned by every existing repository call, just never carried onto the row. |
| `web/scripts/bootstrap-workbook/writeWorkbook.ts` | Added the `placeType` case to `placeValue()`'s column switch. |
| `web/scripts/bootstrap-workbook/verify/verifyBootstrapGenerator.ts` | Updated two fixture row literals for the new required `placeType` field; added a copy-out of the Check C workbook for the independent openpyxl structural check (Section 4). |

**No file outside `web/scripts/bootstrap-workbook/` was touched except the one addition above.** `bootstrapRepository.ts` (the repository/Supabase access layer) was **not modified** — see Section 3 for why, and for the one thing that still needs it.

## 3. Assessment of the two Medium observations (QA-1)

**`placeType` — implemented.** Already returned by every existing `bootstrapRepository.ts` call (`GeoAdminRow`/`GeoAdminMatch` both carry it); the only gap was that `buildTravelRegions.ts`/`buildPlaces.ts` never copied it onto the row. Pure workbook-generation-layer fix, squarely in scope. Verified present in Sheet 2's output (Section 4).

**`aliases` — intentionally NOT implemented this remediation, with rationale.** Per `EBC-R1.3-WS3-001` §4.2, `aliases` is "`geo_aliases` rows for a matched `geo_place_id`, rolled up, semicolon-separated" — there is no existing query against `geo_aliases` anywhere in `bootstrapRepository.ts` to roll up. Implementing it correctly means adding a new read function against `geo_aliases`, which is a change to the repository access layer — and **this card's own Out-of-Scope section (Section 10) explicitly excludes "Repository access layer" and "Supabase integration."** I judged the literal scope boundary this card drew for itself as the controlling instruction over the more general invitation in Section 7A to "implement the correction if omitted unintentionally" — adding a database query is a different kind of change than a workbook-generation-layer fix, even though `EBC-R1.3-WS1-005` §4 already pre-approved `aliases` as an in-scope Category A field for this exact access layer (so the *architecture* decision is not in question — only whether to build it inside a card whose own scope list forbids touching that layer). **Recommendation:** a small, explicitly-scoped follow-on card (e.g. `EBC-R1.3-WS1-010`, framed as a repository-layer addition, not a "workbook generation" fix) to add `aliases`. Flagged for Tiger to confirm or override this read of scope.

**`kbSectionRef` (undocumented addition, not the two missing columns QA-1 named) — left in place, flagged for a decision.** It was a deliberate WS1-007 traceability addition (mirrors Sheet 1's own `kbSectionRef`), never put to Arjun/Tiger against the literal `WS3-001` §4.2 table. Removing a working, arguably-useful field seemed a larger and less reversible change than documenting the gap and asking — so I left it and recorded the decision needed in a code comment (`types.ts`, above `SHEET2_COLUMNS`) for Tiger to either ratify as a spec addition or direct removed in a future card.

## 4. Verification performed this session

### 4.1 Build

```text
npm run build:bootstrap-workbook-generator
```
**PASSED, zero errors, zero warnings.**

### 4.2 Live CLI execution (real Supabase, not a fixture)

Ran the actual compiled generator three times against `web/.env.local`'s real credentials, output redirected to a disposable scratch path (never the repository's own output path), deleted after inspection — same protocol Keerthi's `WS1-008` review used:

1. **Run 1 (first generation):** 24 Travel Regions, 109 Places, 25 errors / 157 warnings — all 25 errors are `Bootstrap geo-validation repository operation failed` from the live-query layer. **This is the same environment network constraint Keerthi's `WS1-008` review disclosed (Section 1 of that report) — confirmed still present, unrelated to this remediation, not a regression.** The generator itself completed cleanly and wrote a structurally valid workbook regardless.
2. **Run 2 (regeneration, no edits — determinism check):** identical row counts (24/109); warning count dropped by exactly 24 (157 → 133), matching the `kbStatus`-seeded-once findings correctly not re-firing; error count held at 25 (same disclosed network condition, not drift).
3. **Manual edit, then Run 3 (Critical Acceptance Test):** edited 5 Product-owned cells directly in the workbook (`kbStatus` correction `ACTIVE`→`COMING_SOON`, two Sheet 1 Category C fields, a Sheet 2 `status`, a Sheet 2 Category C field), regenerated. **Result: all 5 survived byte-for-byte**, the generator's own log confirmed it (`travelRegionsWithProductData: 1, placesWithProductData: 1`, exactly the one edited row on each sheet), and — the actual point of this card — **every edited cell was still unlocked/editable after regeneration**, confirmed cell-by-cell (Section 4.3 below shows the values).

### 4.3 Independent protection/style verification (openpyxl, not my own code)

Rather than trust only the TypeScript reader I wrote, I ran a standalone Python/`openpyxl` script — the same tool Keerthi's `WS1-008` review used for its own reproduction steps — against the Run 3 workbook above. Key results:

```text
kbStatus:            COMING_SOON | locked: False
primaryEmotion (S1): Curiosity   | locked: False
lastReviewed:        2026-09-08  | locked: False
extractedAt:         <fresh ts>  | locked: True    (Category A — correctly still locked)
status (S2):         ACTIVE      | locked: False
primaryEmotion (S2): Awe         | locked: False
```

A second, separate openpyxl script ran 15 structural assertions against a full-24-region/115-place fixture-generated workbook (all `KB_APPROVED_PORTFOLIO` rows, not a hand-picked sample): all 13 Sheet 1 Category C columns unlocked on a blank row, all 12 Reserved columns locked *and* carrying a fill colour distinct from Category C's, all Sheet 2 non-generated columns unlocked, all Sheet 2 generated columns (including the new `placeType`) locked. **15/15 passed.**

### 4.4 Offline fixture harness (regression check on WS1-007's original 25 checks)

Re-ran `verifyBootstrapGenerator.js` (unchanged in method, updated only for the new required `placeType` field) after every code change: **25/25 still passing** — confirms this remediation introduced no regression in matching, regeneration-safety, or the full-pipeline pathways WS1-007 already proved.

## 5. Regression testing checklist (per EBC §8)

| Test | Result |
|---|---|
| TypeScript compilation | **PASS** — zero errors |
| Generator execution (`npm run generate:bootstrap-workbook`, live Supabase) | **PASS** — workbook + both reports generated on all 3 live runs, no runtime crash |
| Protection validation (engineering fields locked, Product fields editable, sheet protection on) | **PASS** — verified two independent ways (Section 4.2/4.3), live and fixture data |
| Product preservation validation (populate → regenerate → confirm unchanged) | **PASS** — live Critical Acceptance Test, 5/5 edits survived (Section 4.2.3) |
| Deterministic validation (repeat runs — stable structure/IDs, no duplicates/drift) | **PASS** — live runs 1→2 identical row counts, no duplicate `travelRegionId`/`placeId`, warning-count delta exactly explained by the seed-once mechanism |

## 6. Acceptance criteria (per EBC §9)

| Criterion | Status |
|---|---|
| All Product-owned fields are editable | **Met** — verified live and independently (Section 4.2/4.3) |
| Engineering-owned fields remain protected | **Met** |
| Worksheet protection remains enabled | **Met** — `ws.protection.sheet == True` confirmed both sheets |
| Product content preservation continues to function | **Met** — live Critical Acceptance Test passed |
| No regression in deterministic generation | **Met** |
| Build passes | **Met** |
| CLI passes | **Met** (with the same disclosed, unrelated network constraint as WS1-007/WS1-008 — not a regression) |
| Existing QA observations addressed or documented with rationale | **QA-2: fixed. QA-3: fixed (same root cause). QA-1: `placeType` fixed; `aliases` documented as out of this card's own stated scope, with a follow-on recommendation; `kbSectionRef` documented, flagged for a Tiger/Arjun decision, not unilaterally removed.** |

## 7. Residual items for Tiger / Vivek

1. **`aliases` (QA-1, remainder)** — needs a small follow-on card explicitly scoped to extend `bootstrapRepository.ts` with a `geo_aliases` read function (architecturally pre-approved by `EBC-R1.3-WS1-005` §4 already; this is an implementation gap, not an open architecture question).
2. **`kbSectionRef` on Sheet 2** — needs a yes/no: ratify as a Sheet 2 spec addition, or direct its removal. Not blocking; documented in code (`types.ts`) either way.
3. **The live-Supabase-reachability gap** — still open, unrelated to this card, now observed identically across three separate sessions (Rad/WS1-007, Keerthi/WS1-008, Rad/WS1-009). Recommend Tiger/Vivek treat this as its own small action item (confirm the correct egress allowlist entry for `jbsefolhlfkplawiuvlu.supabase.co` from whichever environment will run this generator in practice) rather than something any further Bootstrap Generator card can resolve by itself.
4. **A `.git/index.lock` file recurred** at the start of this session (present again despite Keerthi's `WS1-008` report recording it removed). I removed it again this session (with the project owner's implicit pre-authorisation already on record from `WS1-007`/`WS1-008` for this exact item) after requesting and receiving delete permission on the connected folder. If it recurs a third time, it may be worth checking whether some local git client or IDE integration on the machine is leaving it behind, rather than assuming each session's removal is definitive.

## 8. Git status

```text
Branch: feature/ebc-r1.3-ws1-007-bootstrap-generator (unchanged)
```

- 6 files modified (Section 2), 0 files created, 0 files deleted.
- **No commit has been made. No push has been made.** Per Project Instructions §26, pending your explicit authorisation.
- All live-run test artifacts (three workbooks, six report files) were written to and deleted from a disposable scratch path outside the repository — nothing generated by this session's testing was left in the working tree. `git status` confirms only `web/package.json` (unchanged from `WS1-007`, not touched again this session) plus the same untracked file set `WS1-007`/`WS1-008` already recorded.
- No secrets were read into any file, log, or report — `web/.env.local` was sourced into the shell environment only, exactly as `WS1-007`'s and `WS1-008`'s own precedent.

---

*Prepared by Rad, Engineering and Implementation Specialist, on behalf of Team Satvi. Recommend this report route back to Keerthi for the focused re-verification of QA-1/QA-2/QA-3 the closing paragraph of `EBC-R1.3-WS1-009` calls for, then to Tiger for the formal WS1 Closure Review — release and the two residual items in Section 7 remain Vivek's/Tiger's calls.*
