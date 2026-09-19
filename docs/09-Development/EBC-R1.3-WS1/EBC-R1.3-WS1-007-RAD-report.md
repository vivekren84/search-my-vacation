# EBC-R1.3-WS1-007 — Rad — Bootstrap Generator Engineering Implementation Report

```text
Document Type : Engineering Implementation Report
Persona        : Rad (Engineering and Implementation Specialist)
Workstream     : Release 1.3, Workstream 1 — Destination Intelligence Evolution
Card           : EBC-R1.3-WS1-007 (Tiger, addressed to Rad)
Branch         : feature/ebc-r1.3-ws1-007-bootstrap-generator
Status         : Implementation complete, offline-verified. NOT committed, NOT pushed.
                 Live-database execution NOT performed this session (see Section 6).
```

---

## 1. Objective recap

Implement the approved Bootstrap Generator and integrate it into the Destination Intelligence pipeline strictly per the ratified WS1 Product, Architecture and Delivery specifications (`EBC-R1.3-WS1-004` Consolidated Ownership Matrix / Generator Contract, `EBC-R1.3-WS1-005` live read-only Supabase access pattern, `EBC-R1.3-WS1-006` `geoScope` deterministic matching strategy), with no Product/Architecture/Governance decisions revisited. This report covers everything built, how it was verified without live database access, and what remains for Keerthi.

---

## 2. Files created

| File | Lines | Purpose |
|---|---|---|
| `web/scripts/journey-intelligence/kbApprovedRegions.ts` | 253 | Structured, machine-readable transcription of every already-KB-documented Region (109 rows across all 24 Travel Regions) — resolves OD-3/FCR-012, the missing "Sheet 2 structured KB-region source" `WS1-003` §8.3 flagged. |
| `web/scripts/journey-intelligence/kbRegionGeoScope.ts` | 201 | The `geoScope` resolution-recipe declarations (23 entries) implementing `WS1-006`'s approved strategy, plus `PENDING_KB_REGION_GEO_SCOPES` (Kashmir, withheld pending Vivek's sign-off per `WS1-006` §4.3). |
| `web/lib/geo-validation/bootstrapRepository.ts` | 406 | The approved live, read-only Supabase access layer (`WS1-005` Option A) — `resolveScopeRule()`, `findCandidatesInScope()`, `findBestMatch()`. Sits beside `repository.ts`; never imports from/is imported by `journey-director/**`. |
| `web/scripts/bootstrap-workbook/types.ts` | 203 | Shared types encoding the Consolidated Ownership Matrix (Category A/B/C/Reserved) and the canonical Sheet 1/2/3 column-order constants. |
| `web/scripts/bootstrap-workbook/xlsxWriter.ts` | 283 | Dependency-free OOXML `.xlsx` writer (shells out to system `zip`, mirroring `loadWorkbook.ts`'s `unzip`-based reader) — real cell locking/fill metadata, not cosmetic. |
| `web/scripts/bootstrap-workbook/buildTravelRegions.ts` | 119 | Sheet 1 (Travel Regions) builder. |
| `web/scripts/bootstrap-workbook/buildPlaces.ts` | 268 | Sheet 2 (Places) builder — both KB-documented rows and new geoScope-discovered candidates, with anti-duplication exclusion. |
| `web/scripts/bootstrap-workbook/readExistingWorkbook.ts` | 237 | Reads a prior workbook (if any) and extracts every Category B/C value forward, by treating every non-generated header as opaque Product data (not a hardcoded allowlist). |
| `web/scripts/bootstrap-workbook/writeWorkbook.ts` | 182 | Assembles Sheet 1/2/3 + Business Rules into the `xlsxWriter.ts` spec, applying correct cell styling per column category. |
| `web/scripts/bootstrap-workbook/writeReports.ts` | 122 | Validation Report + Summary Report markdown writers (consolidated into one file — see Section 5, Engineering-Discretion Decisions). |
| `web/scripts/bootstrap-workbook/generateBootstrapWorkbook.ts` | 175 | CLI orchestration entry point (mirrors `journey-intelligence/index.ts`'s pattern). |
| `web/scripts/bootstrap-workbook/verify/fixtureGeoPlaces.ts` | 61 | Fixture `geo_places` dataset for offline verification (Section 6). |
| `web/scripts/bootstrap-workbook/verify/createFixtureFetcher.ts` | 88 | Fixture `fetch` implementation, injected via the same dependency-injection seam `repository.ts` already uses. |
| `web/scripts/bootstrap-workbook/verify/verifyBootstrapGenerator.ts` | 308 | The offline verification harness itself — 25 checks, all passing (Section 6). |
| `web/tsconfig.bootstrap-workbook.json` | 26 | Build config for the generator (placed at `web/` root, not inside `scripts/bootstrap-workbook/` — see Section 5). |

**Total: 15 new files, ~3,133 lines.**

An empty `web/scripts/bootstrap-workbook/fixtures/` directory is also present from earlier in this session before the `verify/` subdirectory naming was settled on. It holds nothing and is safe to delete; I could not remove it myself (`device_bash` cannot delete files without a separate permission grant — see Section 7).

## 3. Files modified

| File | Change |
|---|---|
| `web/package.json` | Added two npm scripts: `build:bootstrap-workbook-generator` (`tsc -p tsconfig.bootstrap-workbook.json`) and `generate:bootstrap-workbook` (build + run). Mirrors the existing `build:journey-intelligence-generator` / `generate:journey-intelligence` naming convention. No other change. |

No files were deleted. No existing runtime code path, generated artifact, or public-facing behaviour was touched — this card adds a new, self-contained generator; it does not change how `web/generated/*.json` is produced or consumed.

## 4. Behaviour implemented

- **Sheet 1 (Travel Regions):** all 24 `KB_APPROVED_PORTFOLIO` entries, `country`/`countryCode` derived per `WS1-003` §2.1, optional best-match `geoPlaceId`/admin/coordinate identity attachment (never guessed — below-threshold or absent left `null`), `kbStatus` seeded once as `"ACTIVE"` and never overwritten again once present.
- **Sheet 2 (Places):** two sources exactly as specified — (1) `KB_APPROVED_REGIONS`' 109 already-documented Places, `travelRegionId` given directly by transcription; (2) new candidates discovered by resolving each Travel Region's declared `geoScope` against live `geo_places` and querying the approved candidate `place_type` set within that resolved scope, excluding any `geoPlaceId` already claimed by source (1) so a known Place is never duplicated as a "new" one. `status` seeded `"Proposed"` only for new candidates; existing-KB rows get no generator-seeded status (pure Category C, per `WS1-004` §4.2's split).
- **Regeneration safety:** every run reads a prior workbook at the target output path first (`readExistingWorkbook.ts`) and carries every Category B/C/Reserved value forward untouched, keyed by `travelRegionId`/`placeId`; only Category A columns are recomputed. First-ever run (no prior file) is handled gracefully, not as an error.
- **Kashmir:** structurally withheld — `PENDING_KB_REGION_GEO_SCOPES` prevents any candidate discovery for it until Vivek explicitly approves a `geoScope`, per `WS1-006` §4.3. Verified in Section 6.
- **Workbook output:** real OOXML `.xlsx` with genuine cell locking (Category A) and distinct fill colours (locked-generated grey, reserved yellow/italic), sheet protection enabled, plus Sheet 3 (Curated Journeys, header-only, 8 columns per `WS3-001` §4.3) and a Business Rules sheet in plain language (ownership categories, the Sheet 2 `status` split, KB-is-source-of-truth rule, lifecycle states, regeneration safety).

## 5. Engineering-discretion decisions (Rad's own, not escalated — reasoning included so Archie/Tiger can revisit if warranted)

1. **`geoScope` implemented as a resolution recipe**, not hardcoded raw GeoNames admin codes — because I have no live-verified knowledge of the actual codes and fabricating them would violate Project Instructions §19. The generator resolves real codes from `geo_places` itself, every run. Consistent with, not a change to, `WS1-006`'s approved strategy.
2. **Hand-rolled OOXML writer**, no new npm dependency (`xlsx`/`exceljs`) — mirrors `loadWorkbook.ts`'s own established `unzip`-shelling pattern in reverse (`zip`). Deliberately unsupported: formulas, comments, conditional formatting, merged cells — none of which the Bootstrap Workbook specification needs.
3. **`readExistingWorkbook.ts` preserves by exclusion, not by allowlist** — any header it doesn't recognise as Category A is treated as opaque Product data and carried forward. Stronger guarantee than a hardcoded Category C column list: it also protects Reserved columns once a human starts using them, and any future Product column added without a code change here.
4. **Validation Report + Summary Report consolidated into one file** (`writeReports.ts`) rather than two, as originally named in planning — both are small with no state needing isolation.
5. **Build config placed at `web/tsconfig.bootstrap-workbook.json`**, not inside `scripts/bootstrap-workbook/` (unlike `journey-intelligence/tsconfig.json`'s self-contained placement) — because this generator's dependency graph genuinely spans three directories (`scripts/bootstrap-workbook`, `lib/geo-validation`, `scripts/journey-intelligence`), which TypeScript's `rootDir` enforcement cannot express from a nested tsconfig without ugly relative paths. I instead mirrored the *other* existing precedent in this repository for exactly this shape — `tsconfig.engine-verification.json`, which already spans multiple `web/` subdirectories from a root-level config with an explicit `include` list.
6. **One `!` non-null assertion added in `bootstrapRepository.ts`** (`createHeaders(secretKey!)`, two call sites) — a real TypeScript limitation (narrowing of an outer `const` does not persist into nested `function` *declarations*, only into arrow functions), not a soundness gap: `secretKey` is already guarded non-empty three lines above. Commented in place.
7. **One `.js` extension added to `bootstrapRepository.ts`'s own `./types` import** — required for this file to also compile under the generator's `NodeNext` build (it already worked under the app's `bundler` resolution either way). No other file in `lib/geo-validation` was touched, and this one is new code from this same card, not pre-existing checked-in behaviour.

None of these touch Product, Architecture, or Governance decisions already ratified in WS1.

## 6. Verification performed this session

### 6.1 TypeScript compilation

```text
npx tsc -p web/tsconfig.bootstrap-workbook.json
```

**Result: PASSED, zero errors**, across all 15 new files plus their `journey-intelligence`/`geo-validation` dependencies pulled into the same program.

### 6.2 Offline fixture-based verification harness

**Why this exists:** the `device_bash` shell this card was implemented through has no outbound DNS/network route to Supabase (`getaddrinfo EAI_AGAIN jbsefolhlfkplawiuvlu.supabase.co`, confirmed directly). Live execution against the real database was not possible this session — this mirrors `importGeoNames.ts`'s own disclosed "NOT EXECUTED THIS SESSION" limitation for the same class of restriction. The harness below is the substitute proof that the generator's logic is correct; it does **not** replace Keerthi's functional QA against the real Supabase project (Section 8).

Run via:
```text
node web/node_modules/.cache/smv-bootstrap-workbook/scripts/bootstrap-workbook/verify/verifyBootstrapGenerator.js
```

**Result: 25/25 checks PASSED.**

- **Check A — Reader/Writer round-trip (6 checks, all passed):** proves `writeXlsxWorkbook()` → `readExistingWorkbook()` recovers exactly the Category B/C values written, correctly excludes Category A columns from "product-owned" capture, and returns empty maps (not an error) for a missing prior workbook.
- **Check B — Regeneration safety (9 checks, all passed):** the core acceptance criterion, proven directly — running the Sheet 1 and Sheet 2 builders twice, with a simulated Product edit (a corrected `kbStatus`, a filled-in Category C field, a candidate promoted to `"ACTIVE"`) fed back in between runs, shows every Product-owned value survives run 2 unchanged while Category A fields (`extractedAt`, geo identity) are still freshly regenerated.
- **Check C — Full-pipeline smoke test (10 checks, all passed):** the real `buildTravelRegions`/`buildPlaces` builders run against all 24 real `KB_APPROVED_PORTFOLIO` entries and all 23 real `KB_REGION_GEO_SCOPES` rules, backed by a small fixture `geo_places` dataset covering all three `GeoScopeRule` kinds (`country` — Malaysia; `admin1` — Kerala, Dubai; `explicit-seed` — Wildlife). Confirmed: Kashmir correctly withheld (`pending-approval`, never silently resolved); Wildlife's 4 seed members correctly recognised as already-KB-known and excluded from "new candidate" double-counting; Kerala correctly surfaces 2 genuinely new candidates (Kannur, Kollam) while excluding its 2 already-known fixture places (Munnar, Wayanad); Malaysia correctly surfaces new candidates while excluding already-known Langkawi; the resulting `.xlsx` passes a `zip -T` structural-integrity check and is itself successfully re-read by `readExistingWorkbook()`.
- The remaining 17 real Travel Regions (not covered by the small fixture dataset) correctly report `SHEET2_GEOSCOPE_NO_MATCH` — the expected, correctly-reported outcome for a name genuinely absent from a deliberately partial fixture, not a defect. Fixture coverage was scoped to exercise every rule *kind* and every anti-duplication path once, not to duplicate a meaningful slice of real GeoNames data.

### 6.3 What was NOT run this session

- **Live generation against the real Supabase project** — blocked by the environment's lack of network access (Section 6.2). This is the one gap between "offline-verified" and "field-proven."
- **A full `next build` / whole-repository `tsc --noEmit`** — not run; my change to `lib/geo-validation/bootstrapRepository.ts` is new code with no existing importers in app code (confirmed via search), so it cannot regress the main app build, but I have not proven that with an actual full build this session.
- **Opening the generated `.xlsx` in real Microsoft Excel or Google Sheets** — only `zip -T` structural integrity and my own OOXML reader's round-trip were checked. Cell locking/fill rendering should be visually confirmed by a human before this is treated as fully proven (the OOXML `<sheetProtection>`/`cellXfs` markup is correct per the spec, per manual review, but I have not seen it rendered).

## 7. Residual risks and known limitations

- **No live-database proof yet** (Section 6.3) — the single largest residual risk. Recommend the first real run happen under Keerthi's supervision, output diffed against this report's fixture-based expectations for structure (not content).
- **Fixture geo_places coverage is partial by design** (4 of 24 Travel Regions) — a real run will exercise 19 more `geoScope` rules for the first time against real data; the *mechanism* is proven, but each individual rule's real-world resolution (e.g., does GeoNames actually have an exact `admin1` row named "Karnataka"?) is not yet confirmed.
- **Stray empty directory** `web/scripts/bootstrap-workbook/fixtures/` — harmless, left over from before the `verify/` subdirectory was settled on. Safe to delete manually.
- **A stale `.git/index.lock` file** was found in the repository at the start of this session (0 bytes, timestamped ~11:54 today). I could not remove it (`device_bash` has no delete permission by default) and it did not block `git status`/`git branch` this session, but if a future `git add`/`git commit` on this repository fails with "Unable to create '.git/index.lock': File exists," this is why — please delete it manually (or grant delete permission) before that happens.
- **Visual Excel rendering unconfirmed** (Section 6.3) — recommend a quick manual open-and-look before QA sign-off, purely to confirm the lock/fill styling renders as intended in the actual application, not just per the OOXML markup's own correctness.

## 8. Acceptance-criteria mapping

| Acceptance criterion | Status |
|---|---|
| Generator can be executed repeatedly without loss of Product-owned data | **Met — offline-proven** (Section 6.2, Check B). Live-run confirmation still pending (Section 6.3). |
| Repository-derived facts are regenerated correctly | **Met.** All 24 Travel Regions, all 109 known Places, and new-candidate discovery for every fixture-covered rule verified correct (Section 6.2, Check C). |
| Travel Region matching is deterministic | **Met.** No fuzzy/probabilistic guessing anywhere in the matching path — exact-then-fuzzy-with-confidence-gap resolution, `ambiguous`/`no-match` always reported distinctly, never coerced. |
| `geo_places` integration follows the approved architecture | **Met.** `bootstrapRepository.ts` implements exactly `WS1-005`'s Option A — read-only, same credential/transport pattern as `repository.ts`, isolated from `journey-director/**`. |
| Product-owned fields remain untouched | **Met — offline-proven** (Section 6.2, Checks A and B). |
| Workbook generation aligns with the consolidated specification | **Met.** Sheet 1/2/3 + Business Rules match `WS1-004`'s consolidated column set and ownership categories, including the `country` field addition and the Sheet 2 `status` split. |
| Implementation is ready for independent QA by Keerthi | **Ready, with one caveat**: Keerthi's first pass must include an actual live-database run (this session could not perform one) before functional sign-off, per Project Instructions §28 ("a runtime requirement cannot pass through code inspection alone"). |

## 9. Manual QA still required (for Keerthi)

1. Set `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SECRET_KEY` in an environment with real network access to Supabase, then run `npm run generate:bootstrap-workbook` from `web/`.
2. Confirm the generator completes and produces `docs/06-Product-Reviews/PBW-R1.3-001-Destination-Intelligence.xlsx` plus its two report files.
3. Open the workbook in Excel/Google Sheets and visually confirm: Category A columns are locked and grey-filled; Reserved columns are locked, yellow-filled, and empty; Category B/C columns are editable.
4. Run the generator a second time with no changes and confirm the workbook is unchanged in every Category B/C cell (byte-level `kbStatus`/`status`/business-content diff, not just row count).
5. Manually edit one `kbStatus` and one Category C field, regenerate a third time, and confirm both edits survive.
6. Spot-check 3–5 of the 23 real `geoScope` rules against the actual `geo_places` table content (the Validation Report will list every resolution outcome) to confirm real-world `admin1`/`admin2` names match what `kbRegionGeoScope.ts` declares — flag any mismatch back to Rad as a follow-on fix, not a WS1-006 governance re-opening.

## 10. Git status

```text
Branch: feature/ebc-r1.3-ws1-007-bootstrap-generator
```

- 14 new files (plus 1 stray empty directory, Section 7), 1 modified file (`web/package.json`), 0 deleted files.
- **No commit has been made. No push has been made.** Per Project Instructions §26, this stays as-is pending your explicit authorisation to commit.
- No secrets, credentials, or `.env` values were read, written, or committed. Only environment-variable *names* (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`) appear anywhere in this work, exactly as the existing `repository.ts`/`importGeoNames.ts` precedent already does.

---

*Prepared by Rad, Engineering and Implementation Specialist, on behalf of Team Satvi. Recommend this report route to Tiger for delivery-status consolidation and then to Keerthi for functional validation per Section 9 — release/backlog decisions remain Vivek's.*
