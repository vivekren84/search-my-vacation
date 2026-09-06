# EBC-R1.3-WS2-05 — Arjun — Experience Taxonomy Matrix & Architecture Readiness

```text
Persona       : Arjun — Product and Business Analyst
Status        : ANALYSIS COMPLETE — no files changed, no repository modification, no new runtime enum introduced
Repository    : /Users/viveksophu/Documents/Projects/SearchMyVacation
Branch        : main
```

## Workspace Readiness

The repository was not re-connected for this task. All data below is drawn directly from the read-only repository inspection already performed in this same session for `EBC-R1.3-WS2-04` — the same 52 `metadata.json` journeys, the same `travellerStories.data.ts`/`getTestimonial.ts` curated set, and the same runtime enum — with no repository changes made or claimed in between. No new file was read that wasn't already verified in that prior pass; this EBC reprocesses that evidence into the taxonomy-specific view Tiger asked for. Nothing here required, or made, a repository connection.

## Inputs

- `web/public/traveller-stories/*/metadata.json` (49 traveller folders, 52 journeys) — `experienceType` field
- `web/config/travellerStories.data.ts` — `ExperienceType` union (8 values) and the 15 curated entries' `experience` field
- `web/lib/traveller-stories/getTravellerJourneys.ts` — confirms `experienceType` is typed as a plain, unvalidated `string` at the listing layer
- `docs/06-Product-Reviews/PRW-R1.3-001-Traveller-Stories.xlsx` — confirmed in `EBC-R1.3-WS2-04` to carry no experience/category column at all

---

## Deliverable 1 — Experience Taxonomy Matrix

Runtime enum (`travellerStories.data.ts`, `ExperienceType`, 8 values): `Family Holiday`, `Honeymoon`, `Solo`, `Weekend Getaway`, `Spiritual / Heritage`, `Heritage & Luxury`, `Adventure Vacation`, `Girls' Getaway`.

Rows are grouped by confidence, strongest evidence first, so Archie can approve whole groups at once rather than reading 34 rows in isolation. **"Precedent"** means an existing, already-curated (live) journey uses this exact metadata value today and has already been mapped to that enum value — this is not Arjun's judgment, it's what the runtime already does.

### Exact matches (string is already an enum value) — 4 values, 7 journeys

| Metadata Experience Value | # Journeys | Runtime Enum Match | Recommended Mapping | Confidence | Architecture Decision Required |
|---|---|---|---|---|---|
| Adventure Vacation | 3 | Yes | Adventure Vacation | Exact | No |
| Honeymoon | 2 | Yes | Honeymoon | Exact | No |
| Heritage & Luxury | 1 | Yes | Heritage & Luxury | Exact | No |
| Weekend Getaway | 1 | Yes | Weekend Getaway | Exact | No |

### Precedent (already mapped in production by a curated journey) — 10 values, 13 journeys

| Metadata Experience Value | # Journeys | Runtime Enum Match | Recommended Mapping | Confidence | Architecture Decision Required |
|---|---|---|---|---|---|
| Family Vacation | 3 | No | Family Holiday | Precedent (JRN-010, JRN-011) | No |
| International Family Vacation | 2 | No | Family Holiday | Precedent (JRN-012) | No |
| Family & Spiritual | 1 | No | Spiritual / Heritage | Precedent (JRN-008) | No |
| Girls-only International Vacation | 1 | No | Girls' Getaway | Precedent (JRN-013) | No |
| Holiday / Family | 1 | No | Family Holiday | Precedent (JRN-001) | No |
| Last-minute Family Vacation | 1 | No | Family Holiday | Precedent (JRN-025) | No |
| Multi-generational Family Trip | 1 | No | Family Holiday | Precedent (JRN-002) | No |
| Romantic / Family Getaway | 1 | No | Family Holiday | Precedent (JRN-005) | No |
| Solo Adventure | 1 | No | Solo | Precedent (JRN-003) | No |
| Spiritual & Heritage | 1 | No | Spiritual / Heritage | Precedent (JRN-006) | No |

### Compatible (no precedent yet, but a single low-risk fit) — 11 values, 13 journeys

| Metadata Experience Value | # Journeys | Runtime Enum Match | Recommended Mapping | Confidence | Architecture Decision Required |
|---|---|---|---|---|---|
| Family Time | 3 | No | Family Holiday | Compatible | No |
| Adventure & Culture | 1 | No | Adventure Vacation | Compatible | No |
| Adventure & Nature | 1 | No | Adventure Vacation | Compatible | No |
| Adventure Getaway | 1 | No | Adventure Vacation | Compatible | No |
| Nature & Culture | 1 | No | Adventure Vacation | Compatible | No |
| Family / Leisure Vacation | 1 | No | Family Holiday | Compatible | No |
| Heritage Vacation | 1 | No | Heritage & Luxury | Compatible | No |
| Senior-friendly Family Vacation | 1 | No | Family Holiday | Compatible | No |
| Senior-friendly Spiritual Trip | 1 | No | Spiritual / Heritage | Compatible | No |
| Solo Vacation | 1 | No | Solo | Compatible | No |
| Weekend Getaways | 1 | No | Weekend Getaway | Compatible | No |

### Ambiguous (plausibly maps to more than one value) — 4 values, 6 journeys

| Metadata Experience Value | # Journeys | Runtime Enum Match | Recommended Mapping | Confidence | Architecture Decision Required |
|---|---|---|---|---|---|
| Memory Makers | 3 | No | *(no single confident fit — reads as a marketing label, not a trip type)* | Ambiguous | **Yes** |
| International Private Tour | 1 | No | Possibly Family Holiday, no confirmed fit | Ambiguous | **Yes** |
| Kerala Getaway | 1 | No | Possibly Family Holiday, no confirmed fit — label is destination-flavoured, not experience-descriptive | Ambiguous | **Yes** |
| Relaxing Getaway | 1 | No | Possibly Weekend Getaway or Family Holiday, no confirmed fit | Ambiguous | **Yes** |

### Cannot reasonably map into the current 8-value model — 5 values, 13 journeys

| Metadata Experience Value | # Journeys | Runtime Enum Match | Recommended Mapping | Confidence | Architecture Decision Required |
|---|---|---|---|---|---|
| Vacation | 6 | No | *(none — too generic; spans Couple, Solo and Family traveller types)* | Missing | **Yes** |
| Celebrations | 3 | No | *(none — no anniversary/milestone category exists)* | Missing | **Yes** |
| Global Escapes | 2 | No | *(none confident — international-family framing not represented)* | Missing | **Yes** |
| International Vacation | 1 | No | *(none — generic international label, no family/solo/honeymoon signal)* | Missing | **Yes** |
| Wildlife / Short-notice Trip | 1 | No | *(none — no wildlife category exists)* | Missing | **Yes** |

---

## Deliverable 2 — Summary Statistics

| Measure | Value |
|---|---|
| Total distinct metadata `experienceType` values | 34 |
| Runtime enum values (`ExperienceType`) | 8 |
| Exact matches | 4 values / 7 journeys |
| Straightforward mappings (Precedent + Compatible) | 21 values / 26 journeys |
| — of which, Precedent (already live in production) | 10 values / 13 journeys |
| — of which, Compatible (no precedent, single safe fit) | 11 values / 13 journeys |
| Ambiguous mappings | 4 values / 6 journeys |
| Cannot reasonably map (Missing) | 5 values / 13 journeys |
| **Total** | **34 values / 52 journeys** |
| Unused runtime enum values | **0** — all 8 values are used by at least one journey once recommended mappings are applied. Lowest-utilisation value: `Girls' Getaway`, used by only 1 of 52 journeys even after full mapping. |

**39 of 52 journeys (75%)** — Exact + Precedent + Compatible — can be labelled with high confidence using the existing 8-value enum with no Architecture involvement. **13 of 52 (25%)**, across 9 distinct values, need an Architecture and/or Product decision before they can carry an experience label.

---

## Deliverable 3 — Analysis

**Why the taxonomy diverged.** `travellerStories.data.ts`'s 8-value `ExperienceType` union was defined once, early (its header identifies it as "Release 1 — Phase 3"), as a small closed set sized for the 15 testimonials curated at that time from a legacy file ("Client Testimonials.xlsx"). `metadata.json`'s `experienceType`, by contrast, is entered per-traveller as free text — most likely copied from booking records or CRM language — with no constraint to any fixed list, and `getTravellerJourneys.ts` (the Journey Snapshot listing loader) types it as a plain `string` with zero validation. Because only the 15 curated journeys ever needed a value from the closed union, the mismatch between the two models was invisible in production for the other 37 — Journey Snapshot happily displays whatever string is in `metadata.json`, so nothing broke, and nothing forced reconciliation until this migration made it necessary.

**Does the current runtime enum still reflect the Product model?** Partially, and better than a first read suggests. Read together with precedent (§Deliverable 1), the 8 values already absorb 21 of the 34 real-world values in use — 62% of the distinct vocabulary the business actually produces — without needing a single new category, including several non-obvious folds (`Family & Spiritual` → `Spiritual / Heritage`, `Solo Adventure` → `Solo`) that a prior curator already made and shipped. Where it falls short is the same handful of concepts recurring across 13 journeys: no category exists today for a generic, unqualified "Vacation" (the single most common raw value, used 6 times), for milestone-driven trips ("Celebrations", 3 uses), or for the "Global Escapes" / plain "International Vacation" framing used for two Dubai family trips and one Bali couple's trip.

**Can Release 1.3 safely continue with mappings?** Yes, for the 39 journeys in the Exact/Precedent/Compatible tiers — these carry no material risk of mis-categorising a traveller's story, since 20 of them are either an exact string match or already the live-and-shipped choice for the same value elsewhere in the dataset. The remaining 13 should not be force-mapped to a plausible-but-unconfirmed value merely to close the gap; doing so risks quietly mislabelling a traveller's experience (e.g. calling a Dubai family celebration a generic "Family Holiday" when Product may want a distinct treatment) in a way nothing would catch until a traveller or Sri notices it reads wrong.

**Risks of widening the enum.** A wider (or open) `ExperienceType` would remove the 13-journey blocker immediately and let `metadata.json` and `travellerStories.data.ts` finally share one taxonomy — but it is a type-model change (§21 of the Project Instructions: architecture-material) that touches every place the union is consumed today, and a genuinely open string field reintroduces the same unconstrained-vocabulary problem that created this taxonomy drift in the first place; it would need to be a small, deliberately curated *addition* (e.g. a `Celebrations` value), not an unrestricted string, to avoid recreating 34 categories in code.

**Risks of retaining the current enum.** The 13 affected journeys simply cannot carry a category label under the current model — they would either stay unlabelled/on Journey Snapshot for their category dimension indefinitely, or require a per-journey Product override table that itself becomes a second small taxonomy to maintain. This is a smaller, safer change to make right now, but it does not close the gap Tiger's brief is aiming at, and defers the same decision to a later release.

---

## Deliverable 4 — Architecture Decision Register

Five questions, each answerable Approve / Reject / Modify. Arjun's recommendation is stated for each; none of these introduce a new runtime enum value themselves — that remains Archie's call in Q4.

**Q1 — Auto-apply Exact + Precedent mappings (20 journeys, 14 values) with no further review?**
These are either an identical string to an existing enum value, or a mapping already live in production for another journey with the same metadata value. *Recommendation: Approve.*

**Q2 — Approve the 11 Compatible mappings (13 journeys) as a batch (Family Time/Family-Leisure-Vacation/Senior-friendly Family Vacation → Family Holiday; Adventure & Culture/Adventure & Nature/Adventure Getaway/Nature & Culture → Adventure Vacation; Heritage Vacation → Heritage & Luxury; Senior-friendly Spiritual Trip → Spiritual / Heritage; Solo Vacation → Solo; Weekend Getaways → Weekend Getaway)?**
No precedent exists yet for these specific strings, but each has exactly one reasonable enum fit. *Recommendation: Approve as a batch; Modify to flag any single mapping Archie disagrees with.*

**Q3 — How should the 4 Ambiguous values (Memory Makers, International Private Tour, Kerala Getaway, Relaxing Getaway — 6 journeys) be handled?**
Options: (a) route to Product for a same-release, per-journey decision; (b) leave these 6 journeys without a category label / on Journey Snapshot's category dimension until Release 1.4; (c) force-map to a default value (e.g. Family Holiday) as a temporary placeholder, flagged for later correction. *Recommendation: Modify — this is a policy choice, not a binary approval; Arjun recommends (b) to avoid mislabelling, given all 6 are Family-traveller-type journeys where a wrong category is more visible than a missing one.*

**Q4 — Should the `ExperienceType` union be widened to accommodate the 5 Missing values (Vacation, Celebrations, Global Escapes, International Vacation, Wildlife / Short-notice Trip — 13 journeys, the largest single concentration, driven mainly by the generic "Vacation" value at 6 journeys)?**
Approve = widen the enum (Archie to decide the exact additions — likely not a literal "Vacation" catch-all); Reject = keep the current 8 values and leave these 13 journeys without a category label indefinitely; Modify = widen for specific values only (e.g. add `Celebrations`, but resolve `Vacation` per-journey with Product rather than adding a generic catch-all). *No recommendation offered — this is the core Architecture decision this EBC exists to enable.*

**Q5 — Should `getTravellerJourneys.ts`'s currently-unvalidated `experienceType: string` field eventually share the same canonical type as `travellerStories.data.ts`, closing the two-taxonomy gap identified in `EBC-R1.3-WS2-04` for good?**
*Recommendation: Modify — track as a Release 1.4+ backlog item, not a Release 1.3 blocker; consistent with the Runtime Simplification item already deferred in that EBC.*

---

## Explicitly Out of Scope — Confirmed

No repository files were modified. No metadata was changed. No workbook values were changed. No engineering implementation was performed. No experience was reclassified — every mapping above is a recommendation pending Q1–Q4. No new runtime enum value was introduced.

## Acceptance Criteria — Status

| Criterion | Status |
|---|---|
| Every distinct experience value analysed | Done — all 34 values, 52 journeys (§Deliverable 1) |
| Complete taxonomy matrix produced | Done (§Deliverable 1) |
| Straightforward and ambiguous mappings clearly separated | Done — Exact/Precedent/Compatible vs. Ambiguous vs. Missing, five distinct groups |
| Architecture receives a concise decision register | Done — 5 questions (§Deliverable 4), each Approve/Reject/Modify |
| No implementation recommendations require engineering interpretation | Confirmed — every recommendation is a data/category mapping choice, not a code-design choice |

This EBC is ready for **Archie** to review in one pass. Recommend Tiger route Q1–Q2 as a fast-track batch approval and reserve discussion time only for Q3–Q4.

---

*Prepared by Arjun (Product and Business Analyst), Team Satvi — Search My Vacation SMV 2.0.*
