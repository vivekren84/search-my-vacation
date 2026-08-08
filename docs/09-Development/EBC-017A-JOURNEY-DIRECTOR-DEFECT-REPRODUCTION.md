# EBC-017A — Journey Director Defect Reproduction

## Scope and method

Reproduction-only investigation of three Journey Director defects reported by Keerthi (DEF-01, DEF-02, DEF-03). No fixes proposed. No code modified, staged, or committed. Branch `main`, local server `http://localhost:3000`, connected desktop Chrome browser.

Keerthi's exact original Passport inputs (companions, dream journey type, destination, timing) were not available anywhere in the repository or elsewhere provided — only her three travel-style tags (Photography, Relaxation, Adventure) were given, and DEF-01 named three specific recommendation outputs (Karnataka, Wildlife, Tamil Nadu). Per instruction, no best-effort guess was made from the tags alone. Instead, a structured engineering reproduction was performed:

1. The full Journey Director recommendation-engine source (`web/lib/journey-director/**`, `web/config/journey-director.config.ts`, `web/config/destination-images.config.ts`, `web/generated/journey-dna.json`) was read to identify every Passport field that influences recommendations, and how each visible card element (title, region tag, summary, hero image, expanded detail, "Why This Fits You" reasoning, top-of-page reflection) is generated.
2. That analysis identified a known, code-verified data-modeling condition: the codebase's own internal test fixture for a "Wildlife Adventure" traveller (`representativeProfiles.activeFriends` in `web/lib/journey-director/validation/representativeProfiles.ts`) reliably surfaces a wildlife-dominant, all-domestic shortlist drawn from exactly five wildlife-capable candidates: Karnataka (Bandipur/Kabini), Tamil Nadu (Masinagudi), Gujarat (Gir), Rajasthan (Ranthambore), and a duplicate "Wildlife" pseudo-candidate that repeats the same regions. This is the coverage path most likely to reach the exact Karnataka/Wildlife/Tamil Nadu combination named in DEF-01.
3. A live Passport was completed using: Companion = Friends, Dream Journey = **Wildlife Adventure**, Travel Styles = **Photography, Relaxation, Adventure** (Keerthi's exact three tags), Timing = Within the Next Month, Destination = discovery mode (no named destination). Passport ID **SMV-33J5PA6G**, traveller name "Keerthi Test1" (for traceability in this session only).
4. This single combination reproduced the exact Karnataka / Wildlife / Tamil Nadu shortlist on the first attempt, so no further matrix cells were required to reach the reported scenario. The traveller-input coverage matrix below documents what was varied and what would be tried next if this combination had not reproduced it.

### Coverage matrix

| Variable | Value used | Rationale |
|---|---|---|
| Companion | Friends | Matches the codebase's own wildlife test fixture; companion has low scoring weight (9pt) so unlikely to change which candidates surface |
| Dream Journey | Wildlife Adventure | Single largest scoring lever (28pt core-intent-alignment); the only dream-journey value that maps to the WILDLIFE core intent |
| Travel styles | Photography, Relaxation, Adventure | Keerthi's exact reported tags (DEF-03 requirement) — deliberately did **not** add "Wildlife" as a tag, to test whether Dream Journey alone is sufficient |
| Timing | Within the Next Month | Timing only affects seasonal eligibility, not candidate selection, for this scenario |
| Destination | Discovery (none named) | Required for the engine's un-prompted shortlist logic to run; a named destination would override/promote a specific pick |

Result: Karnataka / Wildlife / Tamil Nadu reproduced on the first combination tried. No additional matrix cells were needed.

---

## DEF-01 — Card title / destination tag / summary / image / expanded detail must all refer to the same destination

**Status: Reproduced.**

### Evidence

**Card 1 — "The Perfect Match"**
- Title: `Karnataka`
- Destination tag: `KABINI`
- Hero image: a Hampi-style stone temple against a mountain backdrop (heritage/architecture imagery) — **not** a Kabini/wildlife image.
- Summary text: *"A layered journey across heritage, coffee landscapes, cities, forests and coast. Bandipur is differentiated by wildlife, nature, photography."* — names **Bandipur**, not the card's own tag, **Kabini**.
- Expanded detail ("Journey highlights"): correctly Kabini-specific — *"Kabini reservoir boat safaris with large elephant herd sightings," "Leopard and tiger sighting opportunities in Nagarhole National Park,"* etc. This section is internally correct.

**Card 2 — "The Beautiful Puzzle"**
- Title: `Wildlife`
- Destination tag: `KABINI`
- Hero image: a safari jeep in open grassland — appropriately wildlife-themed and consistent with the tag.
- Summary text: *"A forest-led experience centred on responsible observation, naturalist context and lodge rhythm. Bandipur is differentiated by wildlife, nature, photography."* — again names **Bandipur**, not **Kabini**.
- Expanded detail: identical Kabini-specific itinerary content as Card 1 (correct, since both cards resolved to the same region).

**Card 3 — "The Hidden Gem"**
- Title: rendered as `TamilNadu` (missing the space present in every other reference to this state elsewhere in the product — a distinct, minor text/rendering defect, confirmed in the DOM via accessibility-tree inspection, not just a font-kerning illusion).
- Destination tag: `MASINAGUDI`
- Hero image: a Mahabalipuram-style coastal Shore Temple carving — heritage/coastal architecture, **not** wildlife/safari imagery, despite the tag being a wildlife safari region and the traveller having explicitly selected "Wildlife Adventure."
- Summary text: *"A culturally rooted journey joining sacred architecture, food, coast and hill retreats. Chidambaram is differentiated by spiritual, heritage, culture."* — names **Chidambaram**, an entirely different Tamil Nadu region with a completely different theme (spiritual/heritage vs. wildlife), not the card's own tag, **Masinagudi**.
- Expanded detail ("Journey highlights"): correctly Masinagudi-specific — *"A safari-led escape at the base of the Nilgiris, gateway to the Mudumalai Tiger Reserve."* This section is internally correct, in sharp contrast to the summary above it.

### Root Cause Assessment: **Mapping issue**

Confirmed by code review (`web/lib/journey-director/recommendation-adapter.ts`, `web/config/journey-director.config.ts`, `web/config/destination-images.config.ts`, `web/lib/journey-director/catalogue/release1Candidates.ts`):

- The hand-curated "presentation catalogue" (`journeyPresentationCatalogue` in `journey-director.config.ts`) that supplies polished, region-correct summaries and images has only 5 entries (Goa, Kerala, Bali, Sri Lanka, Vizag). Karnataka, Tamil Nadu, and "Wildlife" have **no entry**, so the app falls back to raw, un-curated evidence text and a generic per-**candidate** (not per-region) canonical image.
- The fallback hero image is looked up only by top-level candidate id (`journeyCanonicalImage(candidateId)`), never by the actually-selected region. Region-specific images for Bandipur, Kabini, and Masinagudi exist in `destination-images.config.ts` but are **never referenced by any code path** — they are dead entries.
- The fallback summary text is `fitEvidence[0]?.explanation`, and the candidate-level evidence used to build that fit-evidence is generated from `records[0]` — the alphabetically-first region in the source data for that candidate — not the region the engine actually selected and displays as the tag. For Karnataka/Wildlife that first region happens to be Bandipur (a near-miss, since Bandipur and Kabini are both wildlife regions); for Tamil Nadu it is Chidambaram, a spiritual/heritage region entirely unrelated to Masinagudi.

### Recommendation: **Immediate fix required**

This is not a cosmetic issue — for Tamil Nadu specifically, a traveller who asked for a wildlife adventure is shown a temple photo and spiritual/heritage copy on their "Hidden Gem" card, which actively misrepresents the recommended experience. Recommend keying both the hero image and the fallback summary/evidence lookup by the actually-selected region (not the first region or the top-level candidate id) for every candidate outside the 5-entry curated catalogue.

---

## DEF-02 — Summary → Expanded Detail → Why This Fits You → Destination should all describe the same journey

**Status: Reproduced** (and more severe than the DEF-01 evidence alone suggests — the inconsistency exists **within** a single card's own "Why This Fits You" list, not only between cards).

### Evidence

For every one of the three cards, the "Why This Fits You" section presents four numbered reasons. Verbatim text captured:

**Karnataka (tag: Kabini)**
1. *The feeling you want* — "A layered journey across heritage, coffee landscapes, cities, forests and coast. **Bandipur** is differentiated by wildlife, nature, photography."
2. *The memories you want to make* — "Wildlife, Nature, Photography; balanced / explorer rhythm; region context." (reads as raw internal label text, not natural prose)
3. *A rhythm that supports it* — "A layered journey across heritage, coffee landscapes, cities, forests and coast. **Kabini** is differentiated by wildlife, nature, photography."
4. *What could stay with you* — "Wildlife, Nature, Photography; balanced / explorer rhythm; region context." (identical boilerplate to reason 2)

Reasons 1 and 3 name two different regions (Bandipur vs. Kabini) for the same card.

**Wildlife (tag: Kabini)** — identical pattern: reason 1 names Bandipur, reason 3 names Kabini, reasons 2 and 4 are the same generic label-like boilerplate as above.

**Tamil Nadu (tag: Masinagudi)** — the clearest case:
1. *The feeling you want* — "A culturally rooted journey joining sacred architecture, food, coast and hill retreats. **Chidambaram** is differentiated by spiritual, heritage, culture."
2. *The memories you want to make* — "Spiritual, Heritage, Culture; balanced / explorer rhythm; journey base context."
3. *A rhythm that supports it* — "A culturally rooted journey joining sacred architecture, food, coast and hill retreats. **Masinagudi** is differentiated by wildlife, nature, photography."
4. *What could stay with you* — "Wildlife, Nature, Photography; balanced / explorer rhythm; region context."

Here, reasons 1–2 describe a spiritual/heritage/culture experience in a different region (Chidambaram), and reasons 3–4 correctly describe Masinagudi's wildlife experience — two contradictory narratives inside one card's reasoning list, for a traveller who never selected "spiritual," "heritage," or "culture" as an interest.

The itinerary section beneath each card ("One way your journey could unfold") was checked separately and is correctly and consistently region-specific in all three cases (Kabini content for Karnataka/Wildlife, Masinagudi content for Tamil Nadu) — the inconsistency is isolated to the summary and "Why This Fits You" reasoning layers, not the itinerary layer.

### Root Cause Assessment: **Recommendation engine** (evidence-matching logic), compounding the **mapping issue** in DEF-01

Confirmed by code review of `scoreCandidate.ts`'s `matchedEvidence()`: candidate-level evidence (built from the alphabetically-first region) and region-level evidence (from the actually-selected region) are concatenated into one array and both pass a generic relevance filter (matching on broad signals like "discovery," which is present in almost every region's profile). Both survive into the same `fitEvidence` list, and different `fitEvidence` entries are surfaced in different reason slots — producing the alternating, self-contradictory pattern seen above. This is a genuine defect in how evidence is selected and ordered, not a one-off content typo.

### Recommendation: **Immediate fix required**

A single card presenting two incompatible destination narratives to the traveller in the same reasoning list is a trust and clarity problem, not merely a polish issue.

---

## DEF-03 — Journey Director Summary → Recommendation Reasoning → Why This Fits You should all reference the traveller's actual selections

**Status: Partially Reproduced.**

### Evidence

The **top-of-page** reflection content correctly and specifically reflects the traveller's actual answers. Verbatim: *"Keerthi Test1, you seem to be looking for a wildlife adventure and travelling with friends. The character you described centres on photographic memories, rest and an easier rhythm, and active discovery, within the next month. The possibilities below carry forward the strongest signals around adventure, photography, and slow travel."* This is accurate: Friends ✓, Wildlife Adventure ✓, Photography ✓ ("photographic memories"), Relaxation ✓ ("rest and an easier rhythm"), Adventure ✓ ("active discovery"), timing ✓. The secondary "What we looked for" qualities list (Scenes worth remembering / Restorative calm / A sense of adventure / Wild discovery / etc.) is likewise correctly derived from the same selections.

The **per-card "Why This Fits You"** reasoning is where the defect lives, and it is card-dependent:
- For Karnataka and Wildlife, all four reasons at least mention themes the traveller actually selected (wildlife, nature, photography) — the defect there is purely the Bandipur/Kabini region-name inconsistency documented under DEF-02, not a failure to reflect the traveller's selections.
- For **Tamil Nadu**, reasons 1–2 fail this check outright: "spiritual, heritage, culture" was never selected by the traveller (who chose Photography, Relaxation, Adventure, and Wildlife Adventure as the dream journey) — this reasoning content does not reflect the traveller's actual input at all, only the wrong (Chidambaram) region's static profile.

### Root Cause Assessment: **Recommendation engine** for the Tamil Nadu case; **Not a defect** for the top-of-page summary and for the Karnataka/Wildlife per-card reasoning

The top-level reflection uses a direct, correct key-lookup templating system (`traveller-reflection.ts`) and reliably reflects real selections — confirmed working as designed. The per-card reasoning failure traces to the same evidence-matching root cause as DEF-02.

### Recommendation: **Immediate fix required** for the per-card reasoning (bundle with the DEF-02 fix, since they share a root cause); **Not a defect** — no action needed for the top-of-page Journey Director Summary.

---

## Summary table

| Defect | Status | Root Cause | Recommendation |
|---|---|---|---|
| DEF-01 | Reproduced | Mapping issue (image/summary keyed by wrong region or candidate id) | Immediate fix required |
| DEF-02 | Reproduced | Recommendation engine (evidence-matching pulls from both correct and incorrect regions into the same reasoning list) | Immediate fix required |
| DEF-03 | Partially Reproduced | Top-of-page summary: not a defect. Per-card reasoning: recommendation engine (same root cause as DEF-02) | Immediate fix required (per-card reasoning only) |

All three defects trace to the same two underlying mechanisms: (1) the 5-destination curated presentation catalogue leaves every other destination — including Karnataka, Tamil Nadu, and "Wildlife" — to a raw fallback that keys images and evidence text by the wrong identifier, and (2) the evidence-matching step accepts both the correct region's evidence and an unrelated, alphabetically-first region's evidence into the same result, with no mechanism to prefer or exclusively use the selected region's own content. A single fix addressing both mechanisms would very likely resolve all three reported defects together.
