# EBC-R1.3-WS2-04 — Arjun — Traveller Story Content Migration Analysis

```text
Persona       : Arjun — Product and Business Analyst
Status        : ANALYSIS COMPLETE — no files changed, no repository modification (per EBC scope)
Repository    : /Users/viveksophu/Documents/Projects/SearchMyVacation
Branch        : main
Workbook      : docs/06-Product-Reviews/PRW-R1.3-001-Traveller-Stories.xlsx
```

## Workspace Readiness

Local repository access was not connected at session start; access was requested and granted for this task only, per §14 of the Project Instructions. Repository root, branch (`main`), and working-tree status were confirmed before inspection began.

**Repository Reality — two things to disclose before the findings below are read as final:**

1. **The workbook is currently open on your machine.** A LibreOffice/Excel lock file (`docs/06-Product-Reviews/.~lock.PRW-R1.3-001-Traveller-Stories.xlsx#`) is present. This analysis read the file as last saved to disk; if you have unsaved edits open right now, this analysis does not reflect them.
2. **The working tree is not clean**, and none of it was touched by this session. It already contains the uncommitted Google Review CTA changes from `EBC-R1.3-WS2-IMP-02`/`IMP-02A` (3 code files — `getTravellerJourneys.ts`, `GoogleReviewsCTA.tsx`, `page.tsx` — plus `googleReviewUrl` additions across 37 `metadata.json` files, plus a resave of the workbook itself), awaiting your commit authorisation. This analysis is based on the repository exactly as it stands, including these pending changes, per §17 ("existing implementation" outranks assuming a clean baseline) — but flagging it because none of this EBC's findings should be read as new regressions; they're the pre-existing state.

## Inputs Reviewed

- `docs/06-Product-Reviews/PRW-R1.3-001-Traveller-Stories.xlsx` — both sheets (`Traveller Stories Review`, `Business Rules`)
- `web/public/traveller-stories/*/metadata.json` — all 49 traveller folders (52 journeys)
- `web/config/travellerStories.data.ts` — canonical curated testimonial data
- `web/lib/traveller-stories/getTestimonial.ts` — journeyId → testimonial mapping
- `web/lib/traveller-stories/getTravellerJourneys.ts` — listing/Journey Snapshot data loader
- `web/app/traveller-stories/[slug]/page.tsx` — detail-page rendering logic
- Prior EBCs: `EBC-R1.3-WS2-IMP-02B-RAD-Blocker-Report.md`, `EBC-R1.3-WS2-T2-RAD-Repository-Validation-Workbook-Reconciliation.md`, `EBC-R1.3-WS2-IMP-02-RAD-Google-Review-CTA-Alignment.md`

---

## 1. Repository Reconciliation (Counts)

| Source | Count |
|---|---|
| Workbook rows (`Traveller Stories Review` sheet) | 52 |
| Repository journeys (`metadata.json`, 49 traveller folders) | 52 |
| Curated testimonials wired into runtime (`travellerStories.data.ts` + `getTestimonial.ts`) | 15 |
| Journeys rendering via Journey Snapshot fallback (metadata-only card) | 37 |
| Workbook rows with no matching repository journey | 0 |
| Repository journeys with no matching workbook row | 0 |
| Retired ID absent from both sources by design | `JRN-038` (not a gap) |

The workbook and repository are in **full 1:1 agreement** (52/52, zero orphans either direction), reconfirming `EBC-R1.3-WS2-T2`'s Activity 3 closure. **The gap is entirely inside the curation layer** — the 37-journey shortfall is not a missing-content problem, it is a migration problem.

## 2. Content Coverage

| Measure | Count | % |
|---|---|---|
| Journeys with curated story text wired to the runtime quote card | 15 | 28.8% |
| Journeys on Journey Snapshot fallback (metadata-only card) | 37 | 71.2% |
| Journeys with **no** curated content anywhere, including the workbook | 0 | 0% |
| Journeys requiring migration to reach parity with the approved workbook | 37 | 71.2% |

Product has already approved full testimonial text for **all 52** journeys — the workbook shows `Testimonial Text Present = Yes`, `Testimonial Complete = Yes`, and `Review Status = Approved` on every one of its 52 rows. Nothing is missing from Product's side; 37 approved testimonials have simply never been carried into the code.

## 3. Source of Truth Assessment

| Element | Current runtime source | Assessment / Recommendation |
|---|---|---|
| Testimonial (quote) text | `web/config/travellerStories.data.ts` — its own header states it is sourced from **"Client Testimonials.xlsx"**, a different, older file not present anywhere in this repository | Recommend `PRW-R1.3-001-Traveller-Stories.xlsx` (Product-approved, frozen, git-tracked) become the sole canonical source going forward; the file header comment should be corrected once migration completes. |
| Journey Snapshot (metadata-only card) | `getTravellerJourneys.ts`, reading `web/public/traveller-stories/*/metadata.json` | Correct already — this is genuinely the single source for listing data. No change recommended. |
| Google Review URL | `metadata.json`'s per-journey `googleReviewUrl` field (added by `IMP-02`/`IMP-02A`, currently uncommitted), originally populated by hand from the workbook's `Google Review URL` column | Correct architecture already, per Rad's own note in `IMP-02A`: the workbook's URLs are for Product tracking, and `metadata.json` is the runtime carrier — this is a data-hygiene sync, not a live integration. No change recommended. |
| Experience category | `metadata.json`'s freeform `experienceType` string (34 distinct values across 52 journeys, `string`-typed, unvalidated) **and separately** `travellerStories.data.ts`'s closed 8-value `ExperienceType` union (used only by the 15 curated cards) | Two parallel, non-reconciled taxonomies for the same concept. Flagged for Architecture decision — see §4/§6. |
| Traveller metadata (name, travel month/year, duration, traveller type) | `metadata.json`, one location | Correct already, single canonical source, no competing source found. |

**One data-model finding worth flagging directly to Archie:** each traveller's `source: { testimonialRepository, googleReview, websiteStory }` block in `metadata.json` is stored **once per traveller, not per journey** — confirmed directly: Karthik Ramanathan's `source.testimonialRepository` is `true` for his whole record, yet it covers both `JRN-009` (curated) and `JRN-017` (not curated). **This field cannot be used as a signal of which specific journey is actually curated** — the only authoritative answer to "is this journey curated" is whether its `journeyId` appears as a key in `getTestimonial.ts`. Any future migration tooling or reporting must key off that map, never off the `source` flags.

## 4. Experience Category Analysis

**Runtime enum** (`travellerStories.data.ts`, `ExperienceType`, 8 fixed values): `Family Holiday`, `Honeymoon`, `Solo`, `Weekend Getaway`, `Spiritual / Heritage`, `Heritage & Luxury`, `Adventure Vacation`, `Girls' Getaway`.

**Workbook**: the `Traveller Stories Review` sheet has **no experience/category column at all** — its 13 columns are `ID`, `Traveller Name`, `Destination / Trip`, `Testimonial Text`, `Testimonial Text Present`, `Testimonial Complete`, `Google Review Present`, `Google Review URL`, `Show Story Card`, `Show Google Review Button`, `Review Status`, `Notes`, `Priority`. Experience categorisation has never been a Product-approved workbook value — it exists only in `metadata.json`, entered ad hoc per journey by whoever created that traveller's folder.

**Metadata**: 34 distinct freeform `experienceType` strings across the 52 journeys (`Vacation` alone appears 6 times; 21 of the 34 values appear exactly once). Only **7 of 52 journeys (13.5%)** have a metadata `experienceType` that is an exact string match to one of the 8 runtime enum values (`Adventure Vacation` ×3, `Honeymoon` ×2, `Weekend Getaway` ×1, `Heritage & Luxury` ×1).

Classifying the 37 uncurated journeys' metadata values against the runtime enum:

- **Exact match** (already one of the 8 values): 4 journeys
- **Compatible** (clearly maps to one existing value with reasonable confidence): 14 journeys
- **Ambiguous** (plausibly maps to more than one value, or the label itself is a marketing/destination term rather than a trip-type description — e.g. `Memory Makers`, `Kerala Getaway`): 9 journeys
- **Missing** (no existing enum value reasonably fits — e.g. `Celebrations`, `Global Escapes`, the bare `Vacation`): 10 journeys

Full per-journey detail is in the Experience Mapping Matrix (§9).

## 5. Product Impact Assessment

| Migration candidate | Decision required |
|---|---|
| Mechanical text migration of the 37 approved testimonials (verbatim from the workbook) into `travellerStories.data.ts`/`getTestimonial.ts` | **No Product decision on the content itself** — it is already approved. **Product approval is required to confirm scope**: this formally supersedes the original "Authentic Story Rule" EBC's design, which treated Journey Snapshot as the correct, permanent state for these 37. Rad already asked this exact question in `IMP-02B` and it is still open. |
| Experience-category mapping for the 18 Exact/Compatible journeys | No Product decision required if you accept Arjun's proposed mapping as a batch (§9). |
| Experience-category mapping for the 19 Ambiguous/Missing journeys | **Product approval required**, either row-by-row or via the policy decision below. |
| Whether to widen/redefine the `ExperienceType` union so metadata's own categories can be used directly | **Architecture review required** (Archie) plus **Product approval** of the resulting canonical value set. This single decision resolves all 19 ambiguous/missing rows at once and removes the need for row-by-row category calls on every future journey. |
| Whether Journey Snapshot remains a permanent, acceptable rendering mode for a future journey with no curated testimonial, or whether curation becomes a mandatory pre-publish gate | **Product decision required** — does not block this EBC, but governs how future Traveller Story EBCs are scoped. |
| Visual/UX consistency check once all 52 journeys show a full quote card | **UX review recommended** (Sophie) — non-blocking; only 15 of 52 quote-card treatments have ever been visually validated in production. |

## 6. Migration Strategy

**Option 1 — Direct migration (recommended for this release).** Copy the workbook's already-approved verbatim text for the 37 journeys into `travellerStories.data.ts`, and add matching `journeyId` entries to `getTestimonial.ts`, using the exact name/destination verification discipline that file's own header already documents for the existing 15.
*Benefits:* mechanical, lowest architectural risk, no new tooling, matches the precedent already set. *Risks:* 37 hand-typed entries is meaningfully more transcription surface than the 15 done so far — recommend batching (e.g. 2 batches of ~18–19) with a full lint/`tsc`/diff review after each batch, the same way `IMP-02`/`T2` were verified.

**Option 2 — Generated migration.** Script a one-off export from the workbook directly into the `TravellerStory[]` data structure, removing manual transcription entirely.
*Benefits:* every quote becomes byte-identical to the approved workbook cell, eliminating transcription risk. *Risks:* introduces a new build-time or one-off tooling dependency, which itself needs Archie's assessment under §21 of the Project Instructions before use; still requires the same category-taxonomy decision as Option 1.

**Option 3 — Incremental migration.** Migrate only the 18 Exact/Compatible journeys now; hold the 19 Ambiguous/Missing ones until the category decision lands.
*Benefits:* unblocks half the gap immediately without waiting on a Product/Architecture decision. *Risks:* leaves the Traveller Stories section visibly inconsistent (some journeys upgraded, others still Snapshot) for an indefinite second phase, and touches the same two files twice.

**Option 4 — Runtime simplification (recommend as a backlog item, not for this release).** Retire the separate, hand-maintained `travellerStories.data.ts` + `getTestimonial.ts` mapping layer, and have the detail page read testimonial text from a single canonical, journey-keyed content source (e.g. the frozen workbook exported once into a generated JSON, or the quote folded directly into each journey's `metadata.json`) — one file per journey, no separate ID-mapping table to keep in sync.
*Benefits:* this is the change that most directly answers Tiger's brief — it eliminates the entire class of "stale mapping key" regression that `R1.3-WS2-T2` had to fix for `JRN-025` (a single wrong id there broke every Traveller Story page). *Risks:* a genuine architecture change (new data shape, possibly a new build step); higher risk to make under release pressure than Options 1–3. Better suited to Release 1.4+ under Archie's review than as an in-line fix for this content gap.

**Recommendation:** Option 1 (Direct migration) to close the Release 1.3 content gap now, with Option 4 (Runtime simplification) recorded as a Release 1.4+ backlog item for Archie, consistent with Tiger's framing of this exercise as a single-source-of-truth governance question rather than only a content-backfill task.

**Estimated engineering effort:** the 37 outstanding testimonials average ~1,140 characters each (~42,000 characters / ~7,000 words total). Based on Rad's own effort note in `IMP-02B` (that this already runs well past a 30–45 minute estimate) and the added category-mapping dependency, a reasonable estimate is **2 Rad sessions of roughly 2–3 hours each** — one for the 18 Exact/Compatible journeys (can start as soon as Decision #1 in §11 is confirmed), one for the remaining 19 once the category-taxonomy decision (Decision #2) lands — plus Keerthi functional regression validation per §29 of the Project Instructions after each batch.

## 7. Risk Assessment

- **Runtime regression risk — Medium.** `R1.3-WS2-T2` showed that a single stale mapping key (`JRN-025`) can break every Traveller Story detail page at once, because `getTestimonial.ts` is imported module-wide. 37 new keys is 37 new opportunities for the same class of error. Mitigate with the same name/destination verification already documented in that file, plus a full lint/`tsc`/build pass per batch (not just per journey).
- **Product inconsistency risk — currently High, resolved by migration.** The live site is materially out of step with what Product has already approved — 71% of approved testimonials are not shown — which works against the project's own principle of building trust through honest, personalised presentation if a traveller ever compares the site to a review they know exists.
- **Duplicate content risk — Low.** §1 and the name-cross-check in this analysis found zero orphaned journeys and zero traveller-name mismatches between the workbook and metadata across all 37 candidates — verification for the migration itself should be straightforward.
- **Future maintenance burden — Medium-High under the current model.** Every future testimonial requires the same manual, two-file, human-verified edit (`travellerStories.data.ts` + `getTestimonial.ts`). This is the direct rationale for recording Option 4 as a backlog item rather than dropping it.
- **Governance implications.** This EBC's reconciliation reconfirms the workbook and repository are in full agreement (§1); the frozen workbook is fit to serve as the single canonical migration source Tiger asked this analysis to validate. The two open decisions in §11 are the only things separating "fully approved, mechanical migration" from further delay.

## 8. Content Gap Analysis

Every journey requiring migration (37), classified by whether it can proceed mechanically or needs a Product decision first:

| Journey ID | Traveller | Destination | Metadata `experienceType` | Proposed Mapping | Confidence | Classification |
|---|---|---|---|---|---|---|
| JRN-014 | CB Siva | Kodaikanal, Poombarai & Palani, Tamil Nadu | Family Vacation | Family Holiday | Compatible | Ready |
| JRN-015 | Lavi Rajan | Kuala Lumpur & Langkawi, Malaysia | Vacation | — | Missing | Needs Product Decision |
| JRN-016 | Anirudh S | Kashmir | Vacation | — | Missing | Needs Product Decision |
| JRN-017 | Karthik Ramanathan | Sri Lanka | International Family Vacation | Family Holiday | Compatible | Ready |
| JRN-018 | Sonia Negi | Ranthambore, Rajasthan | Wildlife / Short-notice Trip | — | Missing | Needs Product Decision |
| JRN-019 | Balaji Hariharan | Andaman Islands | Solo Vacation | Solo | Compatible | Ready |
| JRN-020 | Palwinder Singh | Goa | Honeymoon | Honeymoon | Exact | Ready |
| JRN-021 | Rami Reddy | Dubai & Abu Dhabi, UAE | Vacation | — | Missing | Needs Product Decision |
| JRN-022 | Padma Priya Govindaraju | Andaman Islands | Senior-friendly Family Vacation | Family Holiday | Compatible | Ready |
| JRN-023 | Dinesh Chandrasekaran | Malaysia & Singapore | International Private Tour | — | Ambiguous | Needs Product Decision |
| JRN-024 | Aru K | Andaman Islands | Adventure Vacation | Adventure Vacation | Exact | Ready |
| JRN-026 | Srividhya Subramanian | Bali, Indonesia | International Vacation | — | Missing | Needs Product Decision |
| JRN-027 | Sunoj S M | Munroe Island & Varkala, Kerala | Kerala Getaway | — | Ambiguous | Needs Product Decision |
| JRN-028 | Chitra Chandrasekaran | Madurai, Tamil Nadu | Senior-friendly Spiritual Trip | Spiritual / Heritage | Compatible | Ready |
| JRN-029 | Vaidyanath Balasubramanian | Rajasthan | Heritage Vacation | Heritage & Luxury | Compatible | Ready |
| JRN-030 | Lina Mahurkar | Manali, Himachal Pradesh | Adventure Getaway | Adventure Vacation | Compatible | Ready |
| JRN-031 | Sukumar K | Kodaikanal, Tamil Nadu | Vacation | — | Missing | Needs Product Decision |
| JRN-032 | Sridevi Vadhirajan | Manali, Himachal Pradesh | Vacation | — | Missing | Needs Product Decision |
| JRN-033 | Sridevi Mohanty | Munnar, Kerala | Relaxing Getaway | — | Ambiguous | Needs Product Decision |
| JRN-034 | Rajkumar Yadavalli | Araku Valley, Andhra Pradesh | Adventure & Nature | Adventure Vacation | Compatible | Ready |
| JRN-035 | Swathi Ramesh | Manali, Himachal Pradesh | Adventure Vacation | Adventure Vacation | Exact | Ready |
| JRN-036 | Ashika Hema | Meghalaya | Nature & Culture | Adventure Vacation | Compatible | Ready |
| JRN-037 | Abhinaya Murali | Sikkim | Adventure & Culture | Adventure Vacation | Compatible | Ready |
| JRN-039 | Manikantan Narasimhan | Manali, Himachal Pradesh | Vacation | — | Missing | Needs Product Decision |
| JRN-040 | Prabhu H | Ooty, Tamil Nadu | Family / Leisure Vacation | Family Holiday | Compatible | Ready |
| JRN-041 | Charuvasine | Shimla, Manali, Kullu & Kasol, Himachal Pradesh | Family Time | Family Holiday | Compatible | Ready |
| JRN-042 | Hariharan R | Mangalore & Murudeshwar, Karnataka | Memory Makers | — | Ambiguous | Needs Product Decision |
| JRN-043 | Harishankar | Visakhapatnam, Andhra Pradesh | Weekend Getaways | Weekend Getaway | Compatible | Ready |
| JRN-044 | KohilaDevi ArunKumar | Hyderabad, Telangana | Celebrations | — | Missing | Needs Product Decision |
| JRN-045 | Malleswari Reddy | Dubai & Abu Dhabi, UAE | Global Escapes | — | Missing | Needs Product Decision |
| JRN-046 | Matilda Dsouza | Ooty, Tamil Nadu | Celebrations | — | Missing | Needs Product Decision |
| JRN-047 | Praveen Kumar | Sri Lanka | Family Time | Family Holiday | Compatible | Ready |
| JRN-048 | Shankar Subramanian | Visakhapatnam, Andhra Pradesh | Family Time | Family Holiday | Compatible | Ready |
| JRN-049 | Thiyagarajan Sambasivam | Bhubaneswar, Odisha | Memory Makers | — | Ambiguous | Needs Product Decision |
| JRN-050 | Vidhya Karthi | Dubai & Abu Dhabi, UAE | Global Escapes | — | Missing | Needs Product Decision |
| JRN-051 | VidhyaLakshmi | Malaysia & Singapore | Celebrations | — | Missing | Needs Product Decision |
| JRN-053 | Ahilandeshwari V | Sri Lanka | Memory Makers | — | Ambiguous | Needs Product Decision |

**Summary: 18 Ready (mechanical), 19 Needs Product Decision, 37 total.** Every one of the 37 passed name/destination cross-verification against the workbook with zero mismatches (see §7) — the blocker is category classification, not content authenticity.

*No journey requires Architecture or UX review individually* — the union-widening question in §5/§6 is a single, one-time Architecture decision that applies across all 19 "Needs Product Decision" rows at once, not a per-journey review.

## 9. Experience Mapping Matrix

The workbook carries no experience/category column (§4), so every row below reads its starting value from `metadata.json` only.

| Metadata Value (count) | Runtime Recommendation | Product Decision Required |
|---|---|---|
| Adventure Vacation (3) | Adventure Vacation *(exact)* | No |
| Honeymoon (2, both already curated) | Honeymoon *(exact)* | No |
| Weekend Getaway (1) | Weekend Getaway *(exact)* | No |
| Heritage & Luxury (1, already curated) | Heritage & Luxury *(exact)* | No |
| Adventure & Culture, Adventure & Nature, Adventure Getaway, Nature & Culture (4) | Adventure Vacation | No — batch-approve as compatible |
| Family Vacation, Family / Leisure Vacation, Family Time (3 values, 7 journeys), Holiday / Family, Last-minute Family Vacation, Senior-friendly Family Vacation, International Family Vacation, Multi-generational Family Trip | Family Holiday | No — batch-approve as compatible |
| Heritage Vacation | Heritage & Luxury | No — batch-approve as compatible |
| Girls-only International Vacation | Girls' Getaway | No — batch-approve as compatible |
| Senior-friendly Spiritual Trip | Spiritual / Heritage | No — batch-approve as compatible |
| Solo Vacation | Solo | No — batch-approve as compatible |
| Weekend Getaways | Weekend Getaway | No — batch-approve as compatible |
| Celebrations (3), Global Escapes (2), International Vacation, Vacation (6), Wildlife / Short-notice Trip | *No fitting value exists* | **Yes** — needs either a per-journey Product call or the union-widening decision |
| Family & Spiritual, International Private Tour, Kerala Getaway, Memory Makers (3), Relaxing Getaway, Romantic / Family Getaway, Solo Adventure | *Plausibly maps to more than one value* | **Yes** — same as above |

Per-journey detail for all 37 is in §8.

## 10. Migration Recommendation (summary)

Execute **Option 1 (Direct migration)** for Release 1.3: migrate the 37 Product-approved testimonials verbatim from the frozen workbook, in two batches (18 Ready now, 19 once the category decision lands), using the existing verification discipline in `getTestimonial.ts`. Record **Option 4 (Runtime simplification)** — collapsing the two-file curated-testimonial layer into a single per-journey content source — as a Release 1.4+ Architecture backlog item for Archie, per Tiger's governance brief.

## 11. Product Decision Register

Decisions Vivek needs to make before Rad proceeds:

1. **Confirm migration scope.** Approve migrating the remaining 37 Product-approved testimonials into the site's canonical testimonial data, superseding the original "Authentic Story Rule" EBC's narrower design (which treated Journey Snapshot as correct and permanent for these 37). *Blocking — this is the same question Rad raised in `IMP-02B` and it is still open.*
2. **Decide the Experience Category approach for the 19 Ambiguous/Missing journeys.** Either (a) approve Arjun's proposed mapping for the 18 Compatible journeys as a batch, and separately resolve the 19 Ambiguous/Missing ones case-by-case, or (b) direct Archie to widen (or replace) the `ExperienceType` union so metadata's own categories can be used directly, removing the need for any row-by-row Product mapping call now or in future. *Blocking for the 19; not blocking for the 18.*
3. **Confirm sequencing.** Migrate all 37 in one pass, or in two batches (18 now, 19 after Decision 2)? *Non-blocking — a delivery-sequencing input for Tiger.*
4. **Decide the long-term rule for Journey Snapshot.** Should it remain a permanent, acceptable rendering mode for any future journey without curated text, or should testimonial curation become a mandatory pre-publish gate? *Non-blocking for this EBC; governs how future Traveller Story EBCs are scoped.*
5. **Approve or defer Runtime Simplification (Option 4)** — retiring the separate hand-maintained mapping layer in favour of one canonical per-journey content source — as a Release 1.4+ Architecture item. *Non-blocking; backlog input for Tiger/Archie.*

---

## Explicitly Out of Scope — Confirmed

No repository files were modified. No workbook content was changed. No engineering implementation was performed. No testimonials were rewritten. No journeys were reclassified — every mapping above is a recommendation pending Decision 2. No UX behaviour was changed.

## Acceptance Criteria — Status

| Criterion | Status |
|---|---|
| Repository content fully inventoried | Done (§1) |
| All content gaps identified | Done (§2, §8 — 37 journeys, none missing content, all missing migration) |
| Current runtime source of truth documented | Done (§3) |
| Experience category differences analysed | Done (§4, §9) |
| Migration candidates identified | Done (§8 — 18 Ready / 19 Needs Decision) |
| Engineering scope separated from Product decisions | Done (§5, §11) |
| Recommended migration strategy documented | Done (§6, §10) |
| Product approval items explicitly listed | Done (§11) |

This EBC is ready for **Tiger** to consolidate and route the Product Decision Register (§11) to Vivek. No implementation should begin until Decision 1 (and, for 19 of the 37 journeys, Decision 2) is made.

---

*Prepared by Arjun (Product and Business Analyst), Team Satvi — Search My Vacation SMV 2.0.*
