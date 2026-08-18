# EBC R1.2-03.03-EBC-RAD — Destination Intelligence Source Comparison & Runtime Trace Analysis

**Persona:** Rad — Engineering and Implementation Specialist
**Type:** Technical Investigation & Evidence Collection (strictly read-only — no repository files, runtime configuration, documentation, workbooks, generators, or application code modified)
**Workstream:** WS3 — Destination Intelligence
**Date:** 17 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session & Repository Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`.
- Working tree confirmed clean at session start except the same pre-existing untracked items noted in every recent EBC on this branch (`_to_delete/`, `docs/09-Development/EBCR1.2-009-EXPERIENCES-RETIREMENT-IMPLEMENTATION.md`) plus the `EBC-R1.2-03.02-RAD-...` report filed under the immediately prior EBC. None of these were touched by this investigation.
- No repository files, runtime configuration, documentation, workbooks, generators, or application code were modified. Strictly read-only, per this EBC's Explicit Constraints. The only filesystem effect of this EBC is the report file itself, added as a new file, once delivery is authorised in the same way as the prior EBC.
- All Repository Prerequisites paths were inspected directly: `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, `docs/10-Backlog/RELEASE-1.2.md`, `web/scripts/`, `web/scripts/journey-intelligence/` (all 18 files), `web/lib/` (`web/lib/journey-director/` in full — 37 files), `web/config/`, `outputs/` (including the workbook itself, opened and queried directly). `web/data/` and `web/content/` do not exist in this repository (re-confirmed; consistent with the prior audit).

## 0.1 Framing — this EBC's task label and its relationship to the tracker

This EBC self-identifies as task `R1.2-03.03`. In the current `RELEASE-1.2.md` (v1.7), task `R1.2-03.03` is defined as *"CTA review"* (Owner: Sophie, Priority P2, depends on 03.02) — a UX task, not an engineering investigation, and not owned by Rad. This is the same pattern already identified and escalated in the immediately prior EBC (`R1.2-03.02-EBC-RAD`), where the tracker's `R1.2-03.02` slot ("Define suggested-journey mapping per destination", Owner: Arjun) also did not literally match that EBC's actual audit content. Per Project Instructions Section 35, this mismatch is named rather than silently resolved, and — as with the prior EBC — it carries no risk of corrupting tracker content: this EBC is strictly read-only and produces a report only, with no instruction to edit `RELEASE-1.2.md`. This investigation is also a direct, well-motivated continuation: it is explicitly framed in its own Background section as following on from the `R1.2-03.02` Rad Audit's findings, and its purpose (support the upcoming Destination Knowledge Governance decision) is coherent with Workstream 3's overall intent. This audit proceeds on its merits, repeating the recommendation that Tiger reconcile the `R1.2-03.0x` task numbering, ownership, and descriptions against what Workstream 3 has actually produced, the next time `RELEASE-1.2.md` is updated.

---

## 1. Executive Summary

This investigation traces Destination Intelligence end-to-end — Knowledge Base → seed workbook → enrichment → generator → generated runtime JSON → candidate-building code → deterministic engine → traveller recommendation — and, going beyond the prior `R1.2-03.02` audit, opens the workbook directly and reads the generator and candidate-building source line by line. The result is a **precise, code-level account of exactly where and why the runtime diverges from the approved Knowledge Base**, not just that it diverges.

**Two sources, not one, and the divergence starts before generation.** "Source B" in this EBC's brief is really two artefacts: the original seed workbook `Journey Director Intelligence Input-2.xlsx` (evidenced only by its checksum and filename in the workbook's own `Source Register` sheet — the file itself is not in this repository and never has been, per this and the prior audit) and the derived `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx`, which layers Knowledge Base content on top of the seed workbook's structure. The Enriched workbook — the only workbook artefact this repository contains, and the one every generated runtime file is built from — was opened directly for this investigation (`openpyxl`, 8 sheets, 122-column `Destination Intelligence` sheet, 107 destination-region rows, 298 `Review Register` rows). This is new evidence: the prior audit inferred the drift from generation reports and generated JSON; this audit confirms it from the workbook's own data.

**Finding 1 — the exclusion mechanism is one line of code, and it is a status filter, not a content filter.** `web/scripts/journey-intelligence/generateJourneyDNA.ts:112-113` filters `model.destinationIntelligence` to rows where `journeyBaseStatus === "Yes"` before anything becomes a `JourneyDNA` record. Every subsequent artefact and every candidate the engine ever sees is built only from what survives that one filter. The workbook records the reason for each destination's fate in its own words:
  - **Amritsar** — 3 rows, `Journey Base Status: No`, `Record Type: Attraction`, confidence note *"identity is supported, but this record must not be treated as an independent journey base."* This is a structural decision seeded from `Journey Director Intelligence Input-2.xlsx` itself (per the `Source Register`), not something the enrichment step introduced.
  - **Assam** — 2 rows (`Northeast → Assam`, `Wildlife Tours → Assam`), both `Journey Base Status: Review Required`, `Operational Confidence: REVIEW_REQUIRED`. The `Source Register` records the enrichment step's own verdict: *"Repository knowledge is insufficient for full region-level approval; routed to Review Register."* Both are also flagged in `Review Register` as a "Potential semantic duplicate" (`review-0285`, `review-0286`) — the workbook cannot decide whether Assam belongs under Northeast, Wildlife Tours, or as its own destination, which is exactly how the Knowledge Base treats it (KB Section 10.13, its own destination entry).
  - **Corbett and Darjeeling** — **not present anywhere in the workbook.** Not one row, in any of its 8 sheets. `Review Register` entry `review-0292` names this directly: *"Corbett... is present in approved repository knowledge but absent from the seed catalogue."* No equivalent entry exists for Darjeeling at all — it is not even a known gap in the workbook's own review process.

  All four are KB-approved, ACTIVE region members with full narrative detail (KB Sections 10.3, 10.13, 10.11, 10.18) equal in richness to peer regions that *do* work today (Meghalaya, Sikkim, Kabini, Bandipur, Masinagudi all carry `Journey Base Status: Yes`). Three of the four (Amritsar, Assam, Corbett) already have live, warmly-written public destination cards and approved hero imagery. This is the same headline finding as `R1.2-03.02`, now traced to its exact origin.

**Finding 2 (new in this investigation) — even where the vocabulary *does* match the Knowledge Base, most of it can never appear.** `R1.2-03.02` found the runtime `TravellerType` code type carries 5 values against the Knowledge Base's 9. This investigation went further and checked the other two controlled vocabularies (`EmotionId`, 17 values; `ThemeId`, 36 values) that `R1.2-03.02` confirmed match the Knowledge Base exactly in the type system. They do — but the *data path* does not. The workbook's own `Emotional Goals` and `Desired Experiences` sheets define only 11 and 15 labels respectively (not the KB's 17/36, and not using the KB's vocabulary — "Healing", "Slow Living", "Escape" have no KB equivalent by that name). `web/lib/journey-director/catalogue/release1Candidates.ts:58-88` hand-maps those labels onto `EmotionId`/`ThemeId` via two small constant tables (`EMOTION_BY_LABEL`, `THEMES_BY_LABEL`). Because the map can only ever produce what the workbook supplies, **7 of the 17 approved `EmotionId` values (awe, gratitude, indulgence, joy, majesty, spirituality, wonder — 41%) and 19 of the 36 approved `ThemeId` values (53%, including backwaters, forests, hills, lakes, cruises, desert, nightlife, snow-experiences, water-sports, and 10 more) can never be assigned to any generated candidate, regardless of what the Knowledge Base says about a destination.** Kerala's own KB entry, for example, names "Wonder" as an emotional fit for Munnar (Section 10.10) — "wonder" cannot reach a runtime candidate today.

**Finding 3 (new) — a generated artefact that is loaded, validated, checksummed, and then unused.** `compatibility-matrix.json` (690KB, 3,382 records) is generated with three scoring categories: `TravellerType`, `EmotionalGoal`, `DesiredExperience`. `loadRuntimeIntelligence.ts` loads and indexes all of it. But a repository-wide search confirms only `release1Candidates.ts:201` reads from that index, and it explicitly discards every record whose category is not `TravellerType` (`if (item.category !== "TravellerType" || item.score < 2) return [];`). The `EmotionalGoal` and `DesiredExperience` category records — the majority of the file — are built, verified, and shipped in the production bundle, and never read again.

**Overall verdict:** the Knowledge Base is not the runtime's source of truth in practice, and this investigation locates the override precisely: it is a single status filter in the generator (`journeyBaseStatus === "Yes"`, itself downstream of decisions made in the un-repository'd seed workbook and the enrichment step), plus two small hand-authored label-mapping tables in application code that silently cap which parts of the Knowledge Base's own controlled vocabulary can ever reach a traveller. Every one of these mechanisms is legitimate, deliberate engineering — not a bug in the conventional sense — but none of them was ever reconciled back against the Knowledge Base after being written, and nothing in the repository currently checks that they stay reconciled.

---

## 2. Investigation Part 1 — Source Comparison Matrix

### 2.1 Sources compared

| Source | Location | Status |
| --- | --- | --- |
| **Source A** — Destination Knowledge Base | `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, v1.0.1, approved 22 Jul 2026 | Approved business source of truth |
| **Source B (seed)** — `Journey Director Intelligence Input-2.xlsx` | Not present in this repository. Evidenced only via the Enriched workbook's own `Source Register` sheet: filename, per-row source references (e.g. *"Destination Catalogue row 3"*), a single checksum (`04fe08e2…5a1f8a8`) shared across every seed-sourced field, and the author's local path (`/Users/viveksophu/Downloads/Journey Director Intelligence Input-2.xlsx`) | Original business seed catalogue and structural identity data. Absent from version control. |
| **Source B (enriched)** — `Journey Director Intelligence Enriched.xlsx` | `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` (155,288 bytes; workbook checksum `b90a6af3…d5a1f8a8`, matches `web/generated/metadata.json`) | Combines the seed workbook's identity/catalogue structure with Knowledge-Base-sourced enrichment for Journey DNA and compatibility fields. This is the only workbook this repository's generator ever reads (`web/scripts/journey-intelligence/index.ts:42`, default path). Its own governing report (`JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md`) states it *"should not be integrated into production until the open Review Register items are resolved or formally accepted."* |

### 2.2 Status comparison — every KB-listed destination/collection member vs the Enriched workbook's `Destination Catalogue`

`ACTIVE` in this table means KB Section 7.2's hard product rule ("eligible after all other gates pass") applies — i.e. the destination is approved for recommendation once other gates pass. "In workbook" means the name appears anywhere in the Enriched workbook's `Destination Catalogue` sheet (107 rows). "Journey Base" means at least one of that destination's workbook rows carries `Journey Base Status: Yes`, i.e. it can produce a `journey-dna.json` record at all.

| # | KB name | KB status (§10/§11) | In workbook? | Any row Journey Base = Yes? | Runtime `destinationId` present? |
| --- | --- | --- | --- | --- | --- |
| 1 | Agra | Destination / ACTIVE | Yes | Yes | `india-agra` |
| 2 | Amritsar | Destination / ACTIVE | Yes (3 Attraction rows) | **No — all 3 rows "No"** | **Absent** |
| 3 | Andaman | Destination / ACTIVE | Yes | Yes | `india-andaman` |
| 4 | Goa | Destination / ACTIVE | Yes | Yes (Panjim is Review Required and excluded; others Yes) | `india-goa` |
| 5 | Gujarat | Destination / ACTIVE | Yes | Yes (Dwaraka, Nishkal Mahadev, Byet Dwaraka are Review Required and excluded; others Yes) | `india-gujarat` |
| 6 | Himachal Pradesh | Destination / ACTIVE | Yes | Yes (Leh, Ladakh Review Required and excluded; others Yes) | `india-himachal-pradesh` |
| 7 | Karnataka | Destination / ACTIVE | Yes | Yes | `india-karnataka` |
| 8 | Kashmir | Destination / ACTIVE | Yes | Yes | `india-kashmir` |
| 9 | Kerala | Destination / ACTIVE | Yes | Yes (Allappey Review Required, Houseboats "No"; Kochi/Munnar/Wayanad/Nilambur Yes) | `india-kerala` |
| 10 | Northeast (collection: Meghalaya, Sikkim, **Darjeeling**) | Collection / ACTIVE | Meghalaya, Sikkim only | Meghalaya, Sikkim Yes; **Darjeeling not in workbook** | `india-northeast` (Darjeeling has no region record within it) |
| 11 | Pondicherry | Destination / ACTIVE | Yes | Yes | `india-pondicherry` |
| 12 | **Assam** | Destination / ACTIVE (KB §10.13, its own destination entry) | Yes, but only as a sub-region under two *other* destinations | **No — both rows "Review Required"** | **Absent** |
| 13 | Rajasthan | Destination / ACTIVE | Yes | Yes (Kumbalgarh Review Required and excluded; others Yes) | `india-rajasthan` |
| 14 | Tamil Nadu | Destination / ACTIVE | Yes | Yes (Chennai, Temple Tour Review Required and excluded; others Yes) | `india-tamilnadu` |
| 15 | Hyderabad | Destination / ACTIVE | Yes (as "Telangana") | Yes | `india-telangana` |
| 16 | Vizag | Destination / ACTIVE | Yes (as "Andhra Pradesh") | Yes | `india-andhra-pradesh` |
| 17 | Wildlife (collection: Kabini, **Corbett**, Bandipur, Masinagudi) | Collection / ACTIVE | Kabini, Bandipur, Masinagudi, +Assam, Ranthambore, Gir National Park | Kabini/Bandipur/Masinagudi/Ranthambore/Gir Yes; Assam Review Required and excluded; **Corbett not in workbook** | `india-wildlife-tours` (Corbett has no region record within it) |
| 18 | Dubai | Destination / ACTIVE | Yes (as "UAE") | Abu Dabhi Review Required and excluded; Dubai Yes | `united-arab-emirates` |
| 19 | Bali | Destination / ACTIVE | Yes (4 of 6 KB regions: Ubud, Nusa Dua, Seminyak, Uluwatu; **Sanur, Kuta not in workbook**) | Yes | `indonesia-bali` |
| 20 | Malaysia | Destination / ACTIVE | Yes | Yes | `malaysia` |
| 21 | Singapore | Destination / ACTIVE | Yes | Yes | `singapore` |
| 22 | Sri Lanka | Destination / ACTIVE | Yes | Trinconmalee Review Required and excluded; others Yes | `sri-lanka` |
| 23 | Thailand | Destination / ACTIVE | Yes | Yes | `thailand` |
| 24 | Vietnam | Destination / ACTIVE | Yes | Yes | `vietnam` |

**Confirmed absent from `web/generated/journey-dna.json` (22 distinct `destinationId` values, checked directly via `jq`):** `india-amritsar`, `india-assam`/Assam-as-own-destination, Corbett (no `destinationId` of its own — it is meant to live inside `india-wildlife-tours`, which exists but has no Corbett region), Darjeeling (same pattern, inside `india-northeast`). No other KB-approved destination or named collection member is missing; the remaining drift is at individual-region granularity (e.g. Kerala's Thekkady, Kumarakom, Varkala/Kovalam; Bali's Sanur, Kuta) and does not remove an entire destination from recommendation, only narrows the regions available within it.

### 2.3 Controlled vocabulary comparison

| Vocabulary | KB (§8) | Runtime **type** (`engine.types.ts`) | Enriched workbook's own sheet | Reachable in a generated candidate |
| --- | --- | --- | --- | --- |
| Traveller Types | 9 (§8.5) | **5** (`solo-traveller, couple, family, friends, corporate-group`) | 5 (`Solo, Couple, Family, Friends, Business`) | 5 of 9 (56%) — type system itself caps this, matching the workbook, not the KB |
| Emotions | 17 (§8.1) | 17 — matches KB exactly | 11 (`Healing, Celebration, Freedom, Escape, Adventure, Discovery, Reconnection, Slow Living, Relax, Explore, Romance`) | **10 of 17 (59%)** via `EMOTION_BY_LABEL` (§6.2 below); 7 (awe, gratitude, indulgence, joy, majesty, spirituality, wonder) can never appear |
| Themes | 36 (§8.2) | 36 — matches KB exactly | 15 (`Beach, Mountains, Wildlife, Culture, Food, Wellness, Luxury, Shopping, Spiritual, Adventure, Photography, Island Hopping, Heritage, Nature, Celebrations`) | **17 of 36 (47%)** via `THEMES_BY_LABEL` + record-type inference (§6.2 below); 19 can never appear |

Missing from the runtime traveller-type type: **Honeymoon, Multi-generation Family, Senior Travellers, Educational Group.** All four appear in destination-level KB "Best for" guidance already read for this investigation — e.g. Kerala names Honeymoon, Multi-generation Family and Senior Travellers (§10.10); Bali names Honeymoon and Multi-generation Family (§11.3); Northeast's Darjeeling entry names Senior Travellers (§10.11); Wildlife names Multi-generation Families (§10.18).

---

## 3. Investigation Part 1 (continued) — Destination Reconciliation Detail: the six mandatory destinations

### 3.1 Kerala — working example, region-level drift only

KB (§10.10) approves 7 regions: Kochi/Fort Kochi, Munnar, Thekkady/Periyar, Alappuzha, Kumarakom, Varkala/Kovalam, Wayanad. Workbook `Destination Catalogue` rows 47–52 carry 6 different entries: Allappey, Houseboats, Kochi, Munnar, Wayanad, **Nilambur** (not a KB region at all). Overlap is 3 names (Kochi, Munnar, Wayanad, allowing for the Allappey/Alappuzha spelling difference — itself flagged `review-0018`-style in `Destination Intelligence` row for `india-kerala-allappey`: *"Consider canonical spelling Alappuzha, retaining Alleppey/Allappey as aliases"*). Thekkady/Periyar, Kumarakom, and Varkala/Kovalam — three of the KB's seven approved regions — have no workbook row of any kind. Kerala recommends successfully today only because 4 of its 6 workbook rows carry `Journey Base Status: Yes` (Kochi, Munnar, Wayanad, Nilambur); Allappey (Review Required) and Houseboats ("No", Experience Cluster) are excluded the same way Amritsar and Assam are, just without removing the whole destination.

### 3.2 Bali — working example, minor region-level drift

KB (§11.3) approves 6 regions: Ubud, Seminyak, Nusa Dua, Uluwatu/Jimbaran, Sanur, Kuta. Workbook rows 83–86 carry exactly 4: Ubud, Nusa Dua, Seminyak, Uluwatu — all `Journey Base Status: Yes`. Sanur and Kuta have no workbook row. Bali is one of the 5 `CONFIDENT_APPROVAL_CANDIDATE_IDS` (`release1Candidates.ts:50-56`) and works cleanly for the regions it has; two of six KB-approved regions are simply never offered.

### 3.3 Amritsar — full-destination exclusion, KB vs seed-workbook structural conflict

KB (§10.3, read in full for the prior audit): `Destination` / `ACTIVE`, primary emotion Gratitude, themes Spiritual/Heritage/Food/Culture, 2–3 night indicative stay — modelled identically in structure to every other working KB destination.

Workbook: 3 rows (`Golden Temple`, `Wagah Border`, `Jallianwala Bagh`), each `Record Type: Attraction`, `Journey Base Status: No`, confidence note *"this record must not be treated as an independent journey base."* The `Source Register` shows this structure was inherited from the seed workbook (`Journey Director Intelligence Input-2.xlsx`, rows 3–5) — i.e. whoever built the original seed catalogue modelled Amritsar as three attractions rather than as a journey base, before the Knowledge Base was ever consulted for enrichment. The enrichment step *did* pull KB content in for Amritsar's Journey DNA/compatibility fields (`Source Register`: *"Existing trusted repository knowledge used as the primary governed enrichment reference"*) — the exclusion is not a content gap, it is a record-type/structure decision that predates and survives the KB-informed enrichment.

Runtime: `india-amritsar` has zero rows in `journey-dna.json`. `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` logs this explicitly as a generation-time warning: `DESTINATION_WITHOUT_JOURNEY_BASE (india-amritsar)`. Public-facing: a live destination card (`web/config/public-destinations.config.ts`) and an approved hero image (`web/public/images/journey-director/amritsar.webp`, referenced in `web/config/destination-images.config.ts`) exist and are unused by Journey Director.

### 3.4 Assam — full-destination exclusion, active and open governance question

KB (§10.13, read in full for the prior audit): `Destination` / `ACTIVE`, its own top-level entry, primary emotion Discovery, themes River/Tea Estates/Wildlife/Culture, 4–7 night indicative stay.

Workbook: modelled as a *region*, twice, under two different parent destinations — `Northeast → Assam` and `Wildlife Tours → Assam` — never as its own destination row. Both carry `Journey Base Status: Review Required` / `Operational Confidence: REVIEW_REQUIRED`. `Review Register` carries 9 open rows for Assam (`review-0135`, `-0136`, `-0138`, `-0206`, `-0207`, `-0209`, `-0210`, `-0285`, `-0286`), all `Status: Open`, `Priority: High` for the structural ones. `review-0291` (`portfolio-review` category, "Potential addition") states directly: *"Assam — Not present in source catalogue — Add Assam as a distinct destination if the approved repository model remains authoritative."* This is the workbook's own review process explicitly flagging the KB/workbook mismatch and asking exactly the governance question this EBC's Part 8 raises — it has been open, unresolved, since generation (30 Jul 2026).

Runtime: `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` logs `REVIEW_REQUIRED_RECORD (india-northeast-assam)` and `REVIEW_REQUIRED_RECORD (india-wildlife-tours-assam)` as warnings — generation proceeds, Assam is silently absent from output, no build failure. Public-facing: live destination card and approved hero image (`assam.webp`) exist and are unused.

### 3.5 Corbett — never entered the workbook; known, named, unresolved gap

KB (§10.18): named member of the Wildlife collection, `ACTIVE`, full detail (emotional fit Adventure/Discovery, best for Families/Friends/Wildlife enthusiasts, 2–3 night stay, director note *"Match zone and stay location carefully; avoid using the Corbett name without access clarity."*) — the KB itself already anticipates and instructs on the operational nuance that would need workbook representation.

Workbook: **zero rows, in any of the 8 sheets** (confirmed by direct search of every sheet's every cell for this investigation). `Review Register` entry `review-0292` (`portfolio-review`, "Potential addition", Priority Medium, Status Open) names it directly: *"Corbett — Not present in source catalogue — Review adding Corbett to the Wildlife collection; it is present in approved repository knowledge but absent from the seed catalogue."* This is a known, tracked gap — but it originates in the seed workbook (`Input-2.xlsx`), before enrichment, and nothing in this repository's pipeline can close it without a new workbook edit.

Runtime: no `destinationId`/`regionId` anywhere in any generated artefact. Public-facing: live destination card in the Wildlife group and an approved hero image (`corbett.webp`) exist and are unused.

### 3.6 Darjeeling — never entered the workbook; unknown, unnamed gap

KB (§10.11): named member of the Northeast collection for Release 1 alongside Meghalaya and Sikkim, `ACTIVE`, full detail (emotional fit Discovery/Wonder, best for Families/Couples/**Senior Travellers**, 3–4 night stay, director note *"Use for tea heritage, Himalayan character, and classic hill-station atmosphere."*).

Workbook: **zero rows, in any of the 8 sheets, and zero mentions anywhere — including `Review Register`.** Unlike Corbett, Darjeeling's absence was never logged as a known gap by the enrichment process at all.

Runtime: no `destinationId`/`regionId` anywhere in any generated artefact; no generation-time warning names it (the generation report's 16 warnings do not mention Darjeeling — it is invisible to the pipeline, not flagged by it). Public-facing: **two** approved image variants exist unused (`darjeeling.webp`, `darjeeling-v2.webp`, both in `retainedJourneyImageAlternatives` per the prior audit's config read) but there is no live public destination card for Darjeeling specifically (it is presented only within the Northeast KB narrative, not as its own `public-destinations.config.ts` entry) — so its user-facing exposure today is lower than Amritsar/Assam/Corbett, but its invisibility to the governance/review process is total.

---

## 4. Investigation Part 2 — Runtime Trace Diagrams

Stage order: **Knowledge Base → Seed Workbook → Enriched Workbook → Generator → Generated Runtime Files → Journey Director Candidate → Traveller Recommendation.**

### 4.1 Kerala (working)

| Stage | Exists? | What changed | Why |
| --- | --- | --- | --- |
| Knowledge Base §10.10 | Yes | — | Source |
| Seed workbook | Presumed yes (Source Register cites seed rows for Kochi/Munnar/Wayanad/Allappey/Houseboats/Nilambur) | Region set narrower than KB (6 vs 7); "Nilambur" added, not a KB region | Seed catalogue authored independently of KB region list |
| Enriched workbook | Yes | KB content merged into Journey DNA/compatibility fields for surviving rows | Per Source Register, "existing trusted repository knowledge used as the primary governed enrichment reference" |
| Generator (`generateJourneyDNA.ts:112-113`) | Runs | Drops Allappey (Review Required) and Houseboats (No); keeps Kochi, Munnar, Wayanad, Nilambur | `journeyBaseStatus !== "Yes"` filter |
| `journey-dna.json` | 4 Kerala region records | — | — |
| `release1Candidates.ts` | Builds `kerala` candidate from the 4 surviving records | Emotions/themes narrowed by `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` (§6.2) | Label-mapping tables |
| Engine (`evaluateEligibility.ts` → `scoreCandidate.ts` → `selectPossibilities.ts`) | Runs | Kerala is a normal, eligible, `CONFIDENT_APPROVAL_CANDIDATE_IDS` candidate | — |
| Traveller Recommendation | **Can appear** | Only 4 of 7 KB-approved regions ever offered; some KB-named emotional fits (e.g. Wonder for Munnar) cannot appear | Intentional exclusion at region level; vocabulary cap at emotion level |

### 4.2 Bali (working)

Same shape as Kerala: seed workbook narrower than KB by 2 regions (Sanur, Kuta absent); all 4 surviving rows `Journey Base Status: Yes`; `bali` is confident-approval; recommendable today with 4 of 6 KB-approved regions.

### 4.3 Amritsar (excluded)

| Stage | Exists? | What changed | Why |
| --- | --- | --- | --- |
| Knowledge Base §10.3 | Yes, full `Destination`/`ACTIVE` entry | — | Source |
| Seed workbook | Yes — 3 rows, modelled as `Attraction`, not journey base | Structural decision, not a content gap | Made in `Input-2.xlsx` before KB enrichment |
| Enriched workbook | Yes | KB content merged for narrative fields; structural `Journey Base Status: No` preserved unchanged | Enrichment adds content, does not revisit structure |
| Generator | Runs, filters all 3 rows out | `journeyBaseStatus !== "Yes"` | Same single-line filter as every other exclusion |
| `journey-dna.json` | **0 Amritsar records** | — | — |
| Generation report | Logs `DESTINATION_WITHOUT_JOURNEY_BASE (india-amritsar)` as a **warning**, not a failure | Generation proceeds successfully despite the omission | By design — warnings do not block the build |
| `release1Candidates.ts` | No `india-amritsar` entry in `journeyDNAByDestinationId` | Nothing to build | — |
| Engine | Never sees Amritsar | — | — |
| Traveller Recommendation | **Cannot appear, ever, for any traveller profile** | — | Root cause: seed-workbook structure |

### 4.4 Assam (excluded)

Same shape as Amritsar from the generator stage onward, but the upstream cause differs: both workbook rows are present and carry `Review Required` status (not "No"), the enrichment step explicitly logged its own review verdict ("Repository knowledge is insufficient for full region-level approval"), and the gap is actively tracked as 9 open, unresolved `Review Register` items — including two flagging that Assam appears in two places at once and one (`review-0291`) directly asking whether Assam should become its own destination, matching the KB's model. Generation report logs `REVIEW_REQUIRED_RECORD` for both rows as warnings; build proceeds; Assam has zero `journey-dna.json` presence and cannot appear for any traveller.

### 4.5 Corbett (excluded — never entered)

| Stage | Exists? |
| --- | --- |
| Knowledge Base §10.18 | Yes, full member-region entry within the Wildlife collection |
| Seed workbook | **No** |
| Enriched workbook | **No** — confirmed by exhaustive search of all 8 sheets |
| Generator | Nothing to filter — no row exists |
| `journey-dna.json` | **No `india-wildlife-tours-corbett` (or equivalent) record** |
| Generation report | **No warning names Corbett** — it is not a filtered-out row, it was never a row |
| Review Register | `review-0292` names the gap directly (Priority Medium, Status Open) |
| Traveller Recommendation | **Cannot appear, ever** |

### 4.6 Darjeeling (excluded — never entered, and unflagged)

Identical shape to Corbett through the generated-artefact stages, with one difference: no `Review Register` entry exists for Darjeeling at all. It is invisible to the pipeline at every stage, including the workbook's own review/governance layer — the only one of the six mandatory destinations with no documented awareness of its own absence anywhere in the repository.

---

## 5. Investigation Part 3 — Generator Behaviour

- **Initiating file:** `web/scripts/journey-intelligence/index.ts`. Line 42 sets the default workbook path: `"../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx"`, overridable only via an explicit `--workbook` CLI flag (no override was in use for the current `web/generated/*.json` — confirmed by `metadata.json`'s `generatedFrom: "Journey Director Intelligence Enriched.xlsx"`).
- **Workbook read:** `web/scripts/journey-intelligence/loadWorkbook.ts`. Parses the `.xlsx` OOXML directly (no external Excel library — hand-rolled `unzip`/XML parsing), builds `WorkbookModel` from all 8 required sheets, computes `workbookChecksum` via SHA-256 of the file. Notably, `loadTaxonomies()` (lines 356-417) reads `Traveller Types`, `Emotional Goals`, `Desired Experiences` **dynamically from the workbook's own sheets** — the pipeline does not hardcode 5/11/15, it reads whatever the workbook defines and builds every downstream column header (`compatibilityHeaders()`, lines 419-438) from that. This means the 5/11/15 narrowness is entirely a workbook-authoring fact, not a generator or code limitation — if the workbook defined all 9/17/36 KB values with matching names, the generator would carry them through unchanged.
- **Configuration controlling generation:** no separate config file; behaviour is fully determined by (a) the `--workbook` CLI argument/default and (b) the workbook's own content. `validateWorkbook.ts` (13,842 bytes, checked for structure) enforces sheet/column presence and value shape but does not enforce any cross-check against `DESTINATION-KNOWLEDGE-BASE.md`.
- **Warnings produced (16 total, confirmed via `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md`):** 15 × `REVIEW_REQUIRED_RECORD` (Goa-Panjim, Gujarat-Dwaraka, Gujarat-Nishkal Mahadev, Gujarat-Byet Dwaraka, Himachal-Leh, Himachal-Ladakh, Kerala-Allappey, Kerala-Houseboats, Northeast-Assam, Rajasthan-Kumbalgarh, TamilNadu-Chennai, TamilNadu-Temple Tour, Wildlife Tours-Assam, UAE-Abu Dabhi, Sri Lanka-Trinconmalee) + 1 × `DESTINATION_WITHOUT_JOURNEY_BASE` (Amritsar).
- **Which warnings become runtime exclusions:** all 16 — every warned row is absent from `journey-dna.json`. The mechanism is not the warning itself; the warning and the exclusion share a common cause (`generateJourneyDNA.ts:112-113`'s `journeyBaseStatus === "Yes"` filter) and are logged independently.
- **Which warnings are ignored:** none are ignored in the sense of being suppressed — all 16 are logged and all 16 result in exclusion. What *is* effectively ignored is the **absence** case (Corbett, Darjeeling): because no row exists, there is nothing to warn about, so these two exclusions produce **zero generation-time signal** — a stricter gap than the 16 that at least surface a warning.
- **Runtime files generated (8, confirmed via `writeArtifacts.ts` and file listing):** `journey-dna.json`, `compatibility-matrix.json`, `constraint-library.json`, `reason-library.json`, `journey-seeds.json`, `journey-templates.json`, `metadata.json`, `intelligence-manifest.json`. Determinism is separately verified (`verifyDeterminism.ts`): the generation report shows 2 executions produced identical output.
- **Dependencies:** `generateJourneyDNA.ts` depends only on `WorkbookModel.destinationIntelligence`; `generateCompatibility.ts` depends on `WorkbookModel.compatibilityMatrix` (built in `loadWorkbook.ts:601-662` from the `Compatibility Matrix` sheet, itself keyed off the same dynamically-loaded `travellerTypes`/`emotionalGoals`/`desiredExperiences` taxonomies); `generateConstraints.ts`/`generateReasons.ts`/`generateTemplates.ts`/`generateJourneySeeds.ts` were inspected structurally and depend on the same `WorkbookModel`, so they inherit the identical set of included/excluded destinations as `generateJourneyDNA.ts` — there is no artefact in the generated set that includes Amritsar, Assam, Corbett, or Darjeeling by a different path.

---

## 6. Investigation Part 4 — Runtime Consumption

### 6.1 Entry point and configuration loading

- **Top-level entry point:** `web/lib/journey-director/createJourneyRecommendationSet.ts`. Takes a `JourneyPassportSnapshot` and an execution timestamp; calls `generateJourneyRecommendations(passport, release1JourneyCandidates, executionContext)`, then adapts the engine result for presentation via `recommendation-adapter.ts`.
- **Configuration loading:** `web/lib/journey-director/intelligence/loadRuntimeIntelligence.ts` statically imports all 8 `web/generated/*.json` files (`import ... from "../../../generated/....json"`) — these are bundled at **build time**, not read from disk at request time. It verifies manifest, schema versions, per-artefact SHA-256 checksums, record counts, hierarchy, and index consistency, throwing `RuntimeIntelligenceIntegrityError` on any mismatch. There is no code path that re-reads the workbook, the Knowledge Base, or any file outside `web/generated/` at runtime.
- **Recommendation engine inputs:** `release1JourneyCandidates` (`web/lib/journey-director/catalogue/release1Candidates.ts:383-387`) — a module-level `const`, computed once at import time by mapping every entry of `runtimeJourneyIntelligence.indexes.journeyDNAByDestinationId` (built from `journey-dna.json`) through `buildCandidate()`. This is the **entire and only** candidate pool for every Journey Director request; it is fixed for the lifetime of the deployed build and identical for every traveller.
- **Fallback behaviour:** none found. If a destination has no `journey-dna.json` records (Amritsar, Assam, Corbett, Darjeeling), it simply has no entry in `journeyDNAByDestinationId`, so `release1JourneyCandidates` never contains it — there is no fallback to Knowledge-Base-authored content, no "coming soon" synthetic candidate, no manual override list. `release1ExcludedPortfolio` (lines 389-422) is the only manually-maintained exclusion list in this file, and it covers a different, disjoint set of destinations (Australia & New Zealand, China, East Africa, Japan — all `COMING_SOON` per the KB, matching the prior audit's finding) — it does not include, and was never intended to cover, Amritsar/Assam/Corbett/Darjeeling.
- **How runtime decides what can/cannot be recommended:** `evaluateCandidateEligibility()` (`engine/evaluateEligibility.ts`) checks `candidate.status !== "ACTIVE"`, `serviceConfidence`, `dataQuality`, review-date expiry, seasonal fit, and companion suitability — entirely against fields set in `buildCandidate()`/`buildRegion()` (`release1Candidates.ts:238-287, 309-381`), which are themselves populated only from the already-filtered `journey-dna.json` records. Every candidate that reaches this stage is hardcoded `status: "ACTIVE"`, `dataQuality: "COMPLETE"` (lines 250-251, 337-338) — i.e. once a destination survives the generator's `journeyBaseStatus` filter, it is treated by the eligibility engine as fully approved and complete, regardless of how many of its KB-approved regions were actually excluded upstream. There is no code-level distinction between "Kerala, fully represented" and "Kerala, missing 3 of 7 regions" at the eligibility stage — both present as `dataQuality: "COMPLETE"`.

---

## 7. Investigation Part 5 — Root Cause Register

| # | Discrepancy | Root cause category | Evidence |
| --- | --- | --- | --- |
| RC-1 | Amritsar has zero runtime presence | **Manual synchronization failure** (seed-workbook structure never reconciled against KB's destination-level approval) | Seed workbook models Amritsar as 3 Attraction rows, `Journey Base Status: No`, per Source Register tracing to `Input-2.xlsx`; KB §10.3 models it as a full ACTIVE destination |
| RC-2 | Assam has zero runtime presence | **Intentional exclusion, pending review** (workbook explicitly routes it to Review Register rather than silently dropping it) | `Journey Base Status: Review Required`; 9 open Review Register rows; enrichment note "insufficient for full region-level approval" |
| RC-3 | Corbett has zero runtime presence | **Manual synchronization failure** (KB approved after/without corresponding seed-workbook update) | Zero rows in workbook; `review-0292` names it as a known, unresolved gap |
| RC-4 | Darjeeling has zero runtime presence | **Manual synchronization failure**, with an additional **unknown** component (no review-process awareness at all) | Zero rows in workbook; zero mentions anywhere in Review Register, Source Register, or generation warnings |
| RC-5 | Traveller Type: 5 in runtime type vs 9 in KB | **Generator/workbook limitation propagated into runtime code** | `Traveller Types` workbook sheet defines only 5 rows; `engine.types.ts` `TravellerType` union was authored to match the workbook's 5, not the KB's 9 |
| RC-6 | 7 of 17 Emotions, 19 of 36 Themes unreachable despite matching runtime types | **Configuration drift** (a hand-authored label-mapping table, `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`, was scoped to the workbook's 11/15 labels and never extended as the type system grew to the KB's full 17/36) | `release1Candidates.ts:58-88`; workbook `Emotional Goals`/`Desired Experiences` sheets |
| RC-7 | `compatibility-matrix.json`'s `EmotionalGoal`/`DesiredExperience` categories are generated but never consumed | **Generator limitation / dead artefact** — likely built in anticipation of a consumption path that was never implemented, or superseded when `release1Candidates.ts` chose to derive emotions/themes from `journey-dna.json`'s free-text fields instead | `release1Candidates.ts:201` filters to `category === "TravellerType"` only; no other file references these categories |
| RC-8 | Kerala/Bali/others missing individual KB-approved regions (Thekkady, Kumarakom, Varkala/Kovalam, Sanur, Kuta, etc.) | **Workbook newer/narrower than Knowledge Base at region granularity** (seed workbook's region list was never kept in step with KB region additions) | Direct row-count comparison, §3.1–3.2 |
| RC-9 | `dataQuality: "COMPLETE"` is hardcoded for every surviving candidate regardless of how many regions were excluded | **Runtime limitation** (the eligibility/scoring model has no signal for "partially represented") | `release1Candidates.ts:251, 338` |
| RC-10 | The canonical seed workbook (`Input-2.xlsx`) is not in version control | **Configuration drift / process gap** (evidenced only by a local author path in Source Register: `/Users/viveksophu/Downloads/...`) | `Source Register` sheet, every row |

No finding in this register was classified **Bug** — every mechanism inspected behaves exactly as its code reads; the divergence is a product of unreconciled data and scoped-too-narrow mappings, not a defect in program logic.

---

## 8. Investigation Part 6 — Impact Assessment

| Issue | Business Impact | Traveller Impact | Recommendation Impact | Operational Impact | Release Impact | Severity | Likelihood | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Amritsar/Assam/Corbett/Darjeeling unrecommendable | Marketed, imagery-ready destinations generate zero Journey Director conversions; public cards create an expectation Journey Director cannot fulfil | A traveller who reads the Amritsar/Assam/Corbett public card and then uses Journey Director will never see it recommended, with no visible explanation | 4 of 24 approved destinations (17%) permanently absent from every recommendation set | None today (silent) — becomes a support/trust issue if noticed by a traveller or reviewer | Directly blocks any Workstream 3 "confident" release claim for these 4 destinations | **Critical** | Certain (already occurring) | **P1** |
| Traveller Type gap (5 vs 9) | Cannot target Honeymoon, Multi-generation Family, Senior Travellers, or Educational Group segments at all via Journey Director, despite KB guidance naming them for specific regions (Kerala, Bali, Darjeeling, Wildlife) | These traveller segments receive generic suitability scoring instead of the tailored guidance the KB already wrote for them | Suitability scoring (`bestFor`) structurally cannot reflect 4 of 9 approved traveller types | None visible without deliberate testing | Affects any future weighting/ranking work (R1.2-03.07+) that assumes traveller-type suitability is complete | **High** | Certain | **P1** |
| 7/17 Emotions, 19/36 Themes unreachable | Narrower, more repetitive-feeling recommendation reasoning than the KB's design intends | Recommendation narrative and signature-experience tagging draws from a smaller emotional/thematic palette than approved | Every candidate's `primaryEmotion`/`themes` set is drawn from a reduced pool, regardless of destination | None visible without deliberate testing | Same as above — compounds with any future scoring refinement | **Medium** | Certain | **P2** |
| `compatibility-matrix.json` dead categories | Wasted generation/validation/bundle-size cost; no functional risk | None directly | None directly | Minor: larger generated artefact, more surface area validated for no runtime benefit | None blocking | **Low** | Certain | **P3** |
| Region-level gaps (Kerala, Bali, others) | Narrower regional offering than KB approves within otherwise-working destinations | Some travellers seeking a KB-named region (e.g. Kumarakom) will not receive it | Reduces regional diversity of recommendations within working destinations | None visible without deliberate testing | Lower urgency than full-destination gaps | **Medium** | Certain | **P2** |
| Seed workbook absent from repository | No reproducible way to regenerate or audit the seed catalogue independent of the Enriched derivative | None directly | None directly | Any future workbook edit for Amritsar/Assam/Corbett/Darjeeling requires locating or rebuilding `Input-2.xlsx` from scratch | Blocks any near-term fix to RC-1/RC-3/RC-4 | **High** | Certain | **P1** |

---

## 9. Investigation Part 7 — Architecture Evidence

**1. Which source currently behaves as the runtime's source of truth?** The Enriched workbook (`outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx`), filtered through `generateJourneyDNA.ts`'s `journeyBaseStatus === "Yes"` gate, and further narrowed by `release1Candidates.ts`'s hand-authored label-mapping tables. This is evidenced directly: `metadata.json.generatedFrom` names the Enriched workbook; every generated artefact's checksum traces to it; `loadRuntimeIntelligence.ts` statically imports only `web/generated/*.json`, never the Knowledge Base.

**2. Which source should logically be the source of truth?** Outside this EBC's scope to design, but the evidence gathered narrows the question usefully: the Enriched workbook's own `Source Register` already treats the Knowledge Base as the *enrichment* authority for Journey DNA/compatibility content ("existing trusted repository knowledge used as the primary governed enrichment reference") — it is only the *catalogue/structural* layer (which destinations and regions exist at all, and their `Journey Base Status`) that is currently inherited unreviewed from the un-versioned seed workbook. The KB is already, in practice, treated as authoritative for destination *content*; it is not currently consulted for destination *inclusion*.

**3. Which intermediate artefacts appear redundant?** `compatibility-matrix.json`'s `EmotionalGoal` and `DesiredExperience` category records (RC-7) — generated, checksummed, loaded, and never read by any consuming code. This is the only artefact in the traced pipeline found to be wholly unused; every other generated file (`journey-dna.json`, `journey-seeds.json`, `journey-templates.json`, `constraint-library.json`, `reason-library.json`, `metadata.json`, `intelligence-manifest.json`, and `compatibility-matrix.json`'s `TravellerType` category) is consumed somewhere in `web/lib/journey-director/`.

**4. Which artefacts require manual synchronization?** The seed workbook's `Destination Catalogue` and `Destination Intelligence.Journey Base Status` columns (require manual editing to add Amritsar/Corbett/Darjeeling as journey bases, or to resolve Assam's Review Required status) and `release1Candidates.ts`'s `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`/`TRAVELLER_BY_LABEL` constant tables (require manual editing to extend reachable vocabulary beyond what the workbook happens to define, or, alternatively, the workbook's `Emotional Goals`/`Desired Experiences`/`Traveller Types` sheets would need manual extension to the KB's full 17/36/9 — either side requires a human edit; neither updates automatically from the other).

**5. Which artefacts could eventually be generated automatically?** `journey-dna.json`, `compatibility-matrix.json`, and the other 6 generated files already are automatically generated — the gap is not in that generation step, it is in the two upstream manual layers (workbook authoring, label-mapping tables) that determine what the automatic generation step is given to work with. A generator that read `DESTINATION-KNOWLEDGE-BASE.md` directly (or a structured export of it) for destination/region inclusion and vocabulary, rather than treating an un-versioned Excel file as the seed, would remove the current two-source model entirely — noted here as an observation the evidence supports, not a proposed implementation.

---

## 10. Investigation Part 8 — Questions for Governance

### Q1. Why does the runtime differ from the approved Knowledge Base?

Two independent mechanisms, both traced to specific code/data locations in this investigation: (a) a generator-level status filter (`generateJourneyDNA.ts:112-113`) that only carries forward workbook rows marked `Journey Base Status: Yes`, and (b) two application-code label-mapping tables (`release1Candidates.ts:58-88`) that can only translate the workbook's own (narrower) emotion/theme/traveller-type vocabulary into the engine's KB-matching type system, never beyond it. Both mechanisms are downstream of an un-versioned seed workbook whose destination/region catalogue and taxonomy sheets were authored independently of, and have never been reconciled against, the Knowledge Base.

### Q2. What specifically overrides the approved Knowledge Base?

At the destination-inclusion level: the `Journey Base Status` column in the Enriched workbook's `Destination Intelligence` sheet, as read by `generateJourneyDNA.ts:112-113`. At the vocabulary level: the `Traveller Types`/`Emotional Goals`/`Desired Experiences` sheets in the same workbook (read dynamically by `loadWorkbook.ts:356-417`), combined with the `EMOTION_BY_LABEL`, `THEMES_BY_LABEL`, and `TRAVELLER_BY_LABEL` constant tables in `release1Candidates.ts:58-96`, and the `TravellerType` union itself in `engine.types.ts:65-70`.

### Q3. Where does that override occur?

Precisely: `web/scripts/journey-intelligence/generateJourneyDNA.ts` line 113 (`.filter((record) => record.journeyBaseStatus === "Yes")`) for inclusion; `web/lib/journey-director/catalogue/release1Candidates.ts` lines 58-96 for vocabulary; `web/lib/journey-director/engine/engine.types.ts` lines 65-70 for the `TravellerType` type definition itself.

### Q4. Is the override intentional? Provide evidence.

Mixed, and the evidence supports different answers for different parts:
- The **generator filter itself** is clearly intentional, deliberate engineering — it is a one-line, clearly-named, correctly-functioning status gate, and its purpose (don't recommend unapproved journey bases) is sound.
- **Which specific rows fail that gate** is, for Assam, an intentional and actively-tracked review-in-progress decision (9 open Review Register rows, an explicit enrichment-step verdict). For Amritsar, it is an inherited structural decision from the seed workbook that was never revisited once the KB approved Amritsar as a full destination. For Corbett, it is a named, tracked, but unresolved gap (`review-0292`). For Darjeeling, there is no evidence of intent at all — nothing in the workbook, the review register, or the generation report shows anyone decided to exclude it; it appears to have simply never been added.
- The **vocabulary-narrowing label maps** show no evidence of being a deliberate governance decision to restrict the KB's approved vocabulary — they read as a pragmatic, correctly-scoped-to-their-input engineering choice (map what the workbook gives you) that was never revisited as a governance question when the KB's fuller 17/36/9 vocabulary was approved separately.

### Q5. Could the runtime operate directly from the Knowledge Base? Feasibility only, no design.

The Knowledge Base is currently a prose Markdown document with tables, not a structured data source — `loadWorkbook.ts` requires named sheets, fixed column headers, and per-cell values, none of which the Markdown document provides natively today. Feasibility observations from evidence gathered in this investigation: the Enriched workbook's own `Source Register` already demonstrates that KB content can be mapped into the workbook's Journey DNA/compatibility fields by a human process ("existing trusted repository knowledge used as the primary governed enrichment reference") — so the KB's *content* is not structurally incompatible with the pipeline's needs. What is missing is (a) a structured, machine-readable form of the KB (or an equivalent authoring surface) covering destination/region inclusion and the full 9/17/36 controlled vocabularies, and (b) removal or reconciliation of the current un-versioned seed-workbook layer that introduces catalogue/structure decisions the KB does not control today. Both are feasibility factors only; no implementation is proposed here per this EBC's constraints.

### Q6. What are the risks of keeping the current approach?

Continuing to generate from the Enriched workbook without reconciliation: (1) any future weighting/ranking work built on `release1JourneyCandidates` (Workstream 3's R1.2-03.07 onward) inherits and compounds every gap in this register; (2) the 4 fully-excluded destinations continue accumulating public-facing marketing exposure (cards, imagery) with zero corresponding recommendation capability, which is a traveller-trust risk if noticed; (3) the un-versioned seed workbook is a single point of failure — if the author's local copy (`/Users/viveksophu/Downloads/Journey Director Intelligence Input-2.xlsx`) is lost, there is no way to regenerate a future Enriched workbook from a known-good structural base without reconstructing it; (4) `Review Register`'s 298 rows (per the prior audit) and the 10 open items directly discussed in this report continue to age without an owner or resolution process visible in this repository.

### Q7. What assumptions currently exist that are not documented?

(1) That `Journey Base Status: Yes/No/Review Required` in the workbook is an equivalent or superior gate to the KB's own `ACTIVE`/`COMING_SOON`/`INACTIVE` status (§7.2) — nowhere is this equivalence stated or justified; the two status systems are simply used at different stages without being reconciled. (2) That a destination excluded by `journeyBaseStatus` should be treated identically to one that was never in the workbook at all (Amritsar/Assam vs Corbett/Darjeeling) — the runtime code makes no distinction, though the underlying situations (actively-reviewed vs never-considered) are materially different. (3) That the workbook's 5/11/15-value taxonomies are an acceptable long-term subset of the KB's 9/17/36 — nothing in the repository states this is a deliberate, approved scope reduction rather than an unfinished workbook. (4) That `dataQuality: "COMPLETE"` is an accurate label for every surviving candidate, regardless of how many KB-approved regions within it were excluded (§6.1) — this assumption is embedded directly in `release1Candidates.ts` code, not stated anywhere as policy.

### Q8. What decisions must Tiger and Vivek make before synchronization work begins?

1. Whether the Knowledge Base or the workbook/generator pipeline is the authoritative source for destination **inclusion** (not just content) going forward — today neither is formally designated for that specific decision.
2. Whether Amritsar and the Northeast/Wildlife Tours treatment of Assam should be restructured in the workbook to match the KB's model (each as an independent destination), and who owns making and approving that edit.
3. Whether Corbett and Darjeeling should be added to the workbook at all for this release, deferred, or the KB's own approval of them revisited — and whether their existing live public destination cards and imagery should be pulled back in the meantime given they cannot currently be recommended.
4. Whether the runtime's `TravellerType` set should be expanded to the KB's 9, and, separately, whether `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` should be extended toward the KB's full 17/36 (which itself requires the workbook's own taxonomy sheets to grow first) — or whether the KB's vocabulary should instead be formally scoped down for Release 1.
5. Who owns locating, versioning, or reconstructing `Journey Director Intelligence Input-2.xlsx`, and whether it should be brought into the repository so the seed layer is no longer a single point of failure on one person's local machine.
6. Whether `compatibility-matrix.json`'s unused `EmotionalGoal`/`DesiredExperience` categories should be retired from generation (Rad-level implementation work, once authorised) or are being held for a planned future consumer not yet built.
7. What review/resolution process, if any, should apply to the workbook's 298 `Review Register` rows (and specifically the 10 discussed in this report) going forward, and who owns it.

---

## 11. Supporting Repository References

- `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` (v1.0.1) — Sections 7.2 (status rule), 8.1/8.2/8.5 (controlled vocabularies), 10.1/10.3/10.10/10.11/10.13/10.18 (portfolio overview, Amritsar, Kerala, Northeast/Darjeeling, Assam, Wildlife/Corbett), 11.1/11.3 (international portfolio, Bali).
- `docs/02-Product/JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md` — governing statement on the Enriched workbook's non-production status.
- `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` — opened directly for this investigation; 8 sheets (`Traveller Types`, `Emotional Goals`, `Desired Experiences`, `Destination Catalogue`, `Compatibility Matrix`, `Destination Intelligence`, `Source Register`, `Review Register`); 107 destination-region rows; 298 Review Register rows; workbook checksum `b90a6af3…d5a1f8a8`.
- `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` — 16 generation-time warnings, determinism verification.
- `web/scripts/journey-intelligence/index.ts:42` — default workbook path.
- `web/scripts/journey-intelligence/loadWorkbook.ts:356-417` — dynamic taxonomy loading from workbook sheets.
- `web/scripts/journey-intelligence/generateJourneyDNA.ts:112-113` — the single-line inclusion filter.
- `web/lib/journey-director/catalogue/release1Candidates.ts:58-96, 201, 238-287, 309-381, 383-422` — label-mapping tables, compatibility-category filter, candidate/region builders, excluded-portfolio list.
- `web/lib/journey-director/engine/engine.types.ts:8-70` — `EmotionId`, `ThemeId`, `TravellerType`, `TravelPace`, `ComfortLevel` type definitions.
- `web/lib/journey-director/engine/evaluateEligibility.ts` — eligibility gate logic (read in full for the prior audit; re-verified against `buildCandidate()`'s hardcoded `status`/`dataQuality` for this investigation).
- `web/lib/journey-director/createJourneyRecommendationSet.ts` — top-level entry point.
- `web/lib/journey-director/intelligence/loadRuntimeIntelligence.ts` — static import and integrity verification of all 8 generated files; `compatibilityByRegionId` index construction.
- `web/generated/journey-dna.json`, `compatibility-matrix.json`, `metadata.json` — queried directly via `jq` for this investigation (distinct `destinationId` values; `category`/`key` distinct values for `TravellerType`/`EmotionalGoal`/`DesiredExperience`).
- `web/config/public-destinations.config.ts`, `web/config/destination-images.config.ts` — public card and approved-imagery presence for Amritsar/Assam/Corbett/Darjeeling (re-confirmed from the prior audit).
- `docs/10-Backlog/RELEASE-1.2.md` (v1.7) lines 403-405 — current `R1.2-03.01`–`03.03` task-table definitions, referenced for the Section 0.1 framing note.

---

## 12. Open Questions

1. Does a copy of `Journey Director Intelligence Input-2.xlsx` exist anywhere accessible to the team (a shared drive, another machine), or is the author's local `Downloads` folder copy referenced in `Source Register` the only surviving copy?
2. Is there a standing owner for the Enriched workbook's `Review Register` (298 rows total; 10 discussed directly in this report), or has it been static since generation on 30 Jul 2026 with no resolution workflow?
3. Was the decision to model Amritsar as three `Attraction` records (rather than a journey base) made deliberately for this release, or is it simply how the original seed catalogue happened to be structured before the KB approved Amritsar as a full destination?
4. Were `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` in `release1Candidates.ts` scoped to the workbook's 11/15 labels as a deliberate Release 1 decision, or because the workbook was the only vocabulary available at the time those tables were written?
5. Is `compatibility-matrix.json`'s unused `EmotionalGoal`/`DesiredExperience` category data expected to be consumed by planned-but-not-yet-built functionality (e.g. a future emotion-driven scoring pass distinct from the current theme/emotion derivation), or is it safe to treat as dead weight?
6. Should the public destination cards and approved imagery for Amritsar, Assam, and Corbett (Darjeeling has no dedicated public card) carry any interim in-product signal that Journey Director cannot currently recommend them, given the gap between marketing presence and recommendation capability is already live in production?

---

## 13. Technical Recommendations (analysis only — no implementation authorised or performed under this EBC)

1. Prioritise resolving Amritsar/Assam/Corbett/Darjeeling ahead of any Workstream 3 scoring/weighting work (R1.2-03.07+), since that work will build directly on `release1JourneyCandidates` and will silently inherit every gap identified here.
2. Treat "seed-workbook structural gap" (Amritsar, Corbett, Darjeeling) and "actively under review" (Assam) as two different governance tracks — the first needs someone to physically add missing rows to a workbook; the second needs someone to resolve 9 already-open Review Register items.
3. Consider whether `dataQuality: "COMPLETE"` in `release1Candidates.ts` should be replaced with a computed value reflecting actual KB-region coverage, so partially-represented destinations (Kerala, Bali, and others per §3.1-3.2) are distinguishable from fully-represented ones at the eligibility/scoring stage — this is a data-modelling question for Archie, not a decision made here.
4. Consider retiring `EmotionalGoal`/`DesiredExperience` category generation from `compatibility-matrix.json`, or documenting the intended future consumer, once Tiger/Vivek confirm which applies (Open Question 5).
5. Bring `Journey Director Intelligence Input-2.xlsx` (or its structural equivalent) into version control or a durable, shared location, independent of any decision on long-term architecture — its absence is a standing single-point-of-failure risk regardless of what synchronization approach is eventually chosen.
6. Any future synchronization work should define, in advance, how it will detect *new* KB approvals (destinations, regions, or vocabulary) that have not yet reached the workbook — nothing in the current pipeline surfaces that automatically today except by chance discovery, as this investigation and the prior `R1.2-03.02` audit both were.

---

## Acceptance Criteria Mapping

| Acceptance Criterion | Status | Evidence |
| --- | --- | --- |
| Every major destination intelligence source has been compared | Met | §2 (24 KB destinations/collections vs 107-row workbook catalogue), §2.3 (3 controlled vocabularies) |
| The runtime data flow has been fully traced | Met | §4 (6 mandatory destinations, full 7-stage trace each) |
| Every significant discrepancy has a documented root cause | Met | §7 (10-item Root Cause Register, all 10 categories drawn from the EBC's allowed list where applicable, none classified Bug) |
| The runtime source of truth has been identified with evidence | Met | §9 Q1, §10 Q1-Q4 |
| Every governance question has been answered with repository-backed findings | Met | §10, Q1-Q8, each citing specific files/lines/sheet rows |
| Tiger and Vivek can make a Destination Knowledge Governance decision without requiring any additional technical investigation | Believed met — every decision point in §10 Q8 is traced to specific evidence; residual uncertainty is captured explicitly in §12 Open Questions rather than left implicit |
