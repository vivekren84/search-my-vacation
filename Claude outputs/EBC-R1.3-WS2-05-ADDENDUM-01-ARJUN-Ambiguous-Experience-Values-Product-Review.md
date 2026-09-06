# EBC-R1.3-WS2-05 — Addendum 01 — Arjun — Ambiguous Experience Values: Product Review Package

```text
Persona       : Arjun — Product and Business Analyst
Status        : ADDENDUM COMPLETE — no files changed, no repository modification, no decision made on Vivek's behalf
Repository    : /Users/viveksophu/Documents/Projects/SearchMyVacation
Branch        : main (re-verified this session — see Workspace Readiness)
Scope         : The 4 Ambiguous experience values only, per Vivek's request following EBC-R1.3-WS2-05/06
```

## Workspace Readiness

The repository was re-connected and re-verified for this addendum (branch `main`, working tree unchanged since `EBC-R1.3-WS2-04`'s disclosed pre-existing uncommitted `IMP-02`/`IMP-02A` changes — nothing new introduced by this session). This addendum required going back to the live code, not just the WS2-04/05 data tables, to answer your Section 4 (Business Impact) question accurately — see the finding below, which is new since WS2-05/06.

## Important — a finding that changes the answer to your Section 4 question

Before the per-value detail: while confirming exactly what a traveller sees, I found that **the taxonomy decision in EBC-R1.3-WS2-05/06 (the 8-value `ExperienceType` union in `travellerStories.data.ts`) is not currently rendered anywhere on the site.** I searched every page and component that touches an experience-type field and confirmed `TravellerStory.experience` (the curated union field Archie's review calls the "badge") has no reader anywhere in `web/app` or `web/components` — it is written into the 15 curated data entries but never displayed.

What **is** displayed — prominently, on every one of the 52 journeys, already, today — is a *different* field: `metadata.json`'s raw `experienceType` string (the same free-text value the taxonomy matrix analysed), surfaced unfiltered in four places:

- The bold orange kicker line above every card's title on the `/traveller-stories` listing grid (`TravellerStoryCards.tsx`) and the homepage preview (`TravellerStories.tsx`).
- The same kicker line at the top of each journey's own detail page, above the headline (`page.tsx` line 172).
- The "Experience type" row in the Journey Summary facts panel on every detail page (`JourneySummary.tsx`), labelled exactly `Experience type: <value>`.
- The Journey Snapshot fallback sentence — *"A [duration] [experience type] experience, crafted around what [traveller] was hoping to feel…"* — shown only on journeys without a curated testimonial (`page.tsx` line 226).

It is also used as a third-tier (lowest-priority) signal in the "Related Stories" recommendation logic (`relatedJourneys.ts`), after traveller-type and destination-category matches.

**Practical consequence for your decision:** whichever way Q3/Q4 are resolved for the 8-value union, it changes nothing a traveller currently sees. "Memory Makers," "Kerala Getaway," "Relaxing Getaway" and "International Private Tour" are already live, exact, unmapped text on the site today, and will remain so regardless of how the curated union is populated — because nothing reads that union field. I want you to have this before reviewing Section 4 below, since it's the direct evidence for "what does the traveller see" — and because it suggests today's Q3/Q4 decision is lower-stakes for the *current* UI than Archie's review (reasonably) assumed, while raising a different question worth a short answer alongside it: **should the raw kicker text itself ever be cleaned up or standardised, independent of the union question?** I raise this as an observation, not a recommendation — it's outside this addendum's requested scope, and Archie/Sophie would need to weigh in on whether the kicker is content (Product) or presentation (UX/Architecture).

---

## 1. Exact Ambiguous Values

| Experience Value | # Journeys | Journey IDs | Traveller Names | Destination |
|---|---|---|---|---|
| `Memory Makers` | 3 | JRN-042, JRN-049, JRN-053 | Hariharan R; Thiyagarajan Sambasivam; Ahilandeshwari V | Mangalore & Murudeshwar, Karnataka; Bhubaneswar, Odisha; Sri Lanka |
| `International Private Tour` | 1 | JRN-023 | Dinesh Chandrasekaran | Malaysia & Singapore |
| `Kerala Getaway` | 1 | JRN-027 | Sunoj S M | Munroe Island & Varkala, Kerala |
| `Relaxing Getaway` | 1 | JRN-033 | Sridevi Mohanty | Munnar, Kerala |

Additional facts relevant to the sections below (re-verified this session, not previously reported):

| Journey ID | Duration | Traveller Type | `featured` flag |
|---|---|---|---|
| JRN-042 | 6 Days / 5 Nights | Family | **true** |
| JRN-049 | 3 Days / 2 Nights | Family | false |
| JRN-053 | 6 Days / 5 Nights | Family | false |
| JRN-023 | 7 Days / 6 Nights | Couple | **true** |
| JRN-027 | 3 Days / 2 Nights | Family | **true** |
| JRN-033 | 5 Days / 4 Nights | Family | false |

Three of the six (JRN-042, JRN-023, JRN-027) are flagged `featured: true`. `getHomepageTravellerStories.ts` only pulls from journeys that already have a curated testimonial — none of these 6 qualify today, but per the migration Product already approved (`EBC-R1.3-WS2-04` §11 Decision 1), all 6 will gain curated text, and the three featured ones will then become **homepage-eligible**, carrying their raw `experienceType` kicker text onto the homepage. This is a materially higher-visibility outcome than a detail-page-only view and is new information for this addendum.

## 2. Why It Is Ambiguous

**`Memory Makers` (3 journeys).** The label reads as a marketing/emotional-outcome phrase ("trips that make lasting memories") rather than a trip-type description, and it is applied across three journeys that share almost nothing else in common: a coastal Karnataka break, a heritage-city trip to Bhubaneswar, and an international Sri Lanka holiday. A single label spanning that much variety is itself evidence the term isn't functioning as a category — it could plausibly fold into `Family Holiday` (all three are Family-type) but that would erase the international/heritage/coastal distinction the site otherwise seems to care about (see `relatedJourneys.ts`'s destination-category logic). I did not recommend a direct mapping because there is no confirmed business rule that "Memory Makers" means "Family Holiday" specifically — it's a plausible default, not a verified one.

**`International Private Tour` (1 journey).** "Private Tour" describes a service-delivery attribute (private guide/vehicle vs. a group tour) — it says nothing about occasion or trip type, the dimension the runtime enum actually models. Candidate categories are `Family Holiday` (poor fit — traveller type is Couple, not Family) or `Honeymoon` (unconfirmed; nothing in the record states this was a honeymoon). I did not recommend a mapping because neither candidate has supporting evidence, and guessing "Honeymoon" without confirmation risks stating something about the traveller that may not be true.

**`Kerala Getaway` (1 journey).** The label names the destination region, which the journey already has its own `destination` field for (`Munroe Island & Varkala, Kerala`) — it doesn't describe an occasion or trip style at all. Candidates: `Family Holiday` (matches traveller type) or `Weekend Getaway` (matches the "Getaway" wording and is supported by the short 3-day/2-night duration confirmed above). Both are plausible; nothing in the record picks one over the other.

**`Relaxing Getaway` (1 journey).** Similar shape to Kerala Getaway — "Getaway" suggests `Weekend Getaway`, but at 5 Days/4 Nights this is longer than the other confirmed `Weekend Getaway` precedent (Kannama Rubesh's Kabini trip, a shorter break), which weakens that fit; "Relaxing" and the Family traveller type both point toward `Family Holiday` instead. I did not recommend either because the duration evidence pulls in the opposite direction from the traveller-type evidence, and no approved rule says which one wins.

## 3. Candidate Mapping Options

| Experience Value | Possible Runtime Category | Confidence | Rationale |
|---|---|---|---|
| Memory Makers | Family Holiday | Medium | All 3 journeys are Family-traveller-type; matches the most common fallback used elsewhere for generic family-trip labels (Precedent tier, WS2-05). |
| Memory Makers | Adventure Vacation | Low | Only plausible for JRN-042 (coastal Karnataka); does not fit JRN-049 (heritage city) or JRN-053 (international) — would require splitting one label across two categories, which the source data gives no basis for. |
| Memory Makers | *(no mapping / per-journey Product call)* | — | Recommended path; see §6. |
| International Private Tour | Honeymoon | Low | No confirmation this was a honeymoon; traveller type "Couple" alone is not sufficient evidence per Arjun's mandate not to treat an assumption as a confirmed requirement. |
| International Private Tour | Family Holiday | Low | Traveller type is Couple, not Family — poor fit on the one signal that's actually confirmed. |
| International Private Tour | *(no mapping / Product to confirm occasion)* | — | Recommended path; see §6. |
| Kerala Getaway | Family Holiday | Medium | Matches confirmed traveller type (Family). |
| Kerala Getaway | Weekend Getaway | Medium | Matches the "Getaway" wording and the confirmed short duration (3D/2N), consistent with the one other `Weekend Getaway` precedent in the dataset. |
| Relaxing Getaway | Family Holiday | Medium | Matches confirmed traveller type (Family); duration (5D/4N) is closer to typical Family Holiday length than to the shorter Weekend Getaway precedent. |
| Relaxing Getaway | Weekend Getaway | Low-Medium | Matches the "Getaway" wording, but duration is longer than the dataset's one confirmed Weekend Getaway precedent, weakening this fit relative to Kerala Getaway's. |

No option above is presented as a recommendation — each is a possibility with its supporting and opposing evidence stated, per your request.

## 4. Business Impact

Read together with the finding at the top of this addendum: **for the current site, "what the traveller sees" is identical whether or not the 8-value union mapping is resolved**, because that union is not rendered. The business impact that *is* real and immediate concerns the raw `experienceType` kicker text, which is unaffected by this decision either way (it will read "Memory Makers" etc. regardless of what Q3/Q4 decide). I'm answering both angles below: the real, current-UI impact, and the impact if/when a future badge component is built from the curated union (Archie's Future Considerations, EBC-06 §4).

**Memory Makers (3 journeys).** *Traveller sees today, either way:* "Memory Makers" as the bold kicker on the card and detail page, plus the fact-panel row "Experience type: Memory Makers" — unaffected by mapping. *If a future badge used the mapped union value instead:* mapped → the badge would read "Family Holiday," losing the distinction between the coastal, heritage-city and international versions of this trip; unmapped → no badge, or the badge component would need its own fallback design. *Inconsistency risk:* two of these three journeys are `featured` in only one case (JRN-042) — once migrated, that one may reach the homepage still reading "Memory Makers" verbatim, independent of this decision.

**International Private Tour (1 journey, `featured: true`).** *Traveller sees today, either way:* "International Private Tour" verbatim, and — because this journey is featured — it is likely to appear on the homepage once its testimonial is migrated, regardless of the union decision. *If a future badge used the mapped value:* mapping to "Family Holiday" here would be visibly wrong (the traveller type is Couple), which is precisely the "wrong badge is worse than no badge" risk Archie's review already flagged — this journey is the clearest single example of that risk in the dataset.

**Kerala Getaway (1 journey, `featured: true`).** *Traveller sees today, either way:* "Kerala Getaway" verbatim; also homepage-eligible once migrated (featured). *If mapped:* "Weekend Getaway" would slightly undersell a 3-day trip that already reads fine as a short getaway; "Family Holiday" would lose the "getaway" framing the traveller's own trip length actually supports. Neither mapping is inconsistent with the facts, which is different from the other three values here — this is the one ambiguous case where either candidate is defensible rather than clearly wrong.

**Relaxing Getaway (1 journey).** *Traveller sees today, either way:* "Relaxing Getaway" verbatim, on the detail page only (not featured, so not homepage-bound under the current flag). *If mapped:* "Family Holiday" fits the confirmed facts (traveller type, duration) better than "Weekend Getaway" does here, unlike the Kerala Getaway case above — worth noting since the two "Getaway"-named values don't resolve the same way once duration is checked.

**Overall:** none of the four options — map now, leave unmapped, defer, or escalate — changes what any traveller currently sees on the live pages, since the affected field is dormant. The decision's real stakes are (a) whether a future badge feature (not yet built) inherits an honest gap or a possibly-wrong label for these 6 journeys, and (b) the "Related Stories" matching signal, which is a low-priority (third) tier behind traveller-type and destination-category matches — in practice, most of these journeys' related-story slots are already filled by those two higher tiers before `experienceType` is ever consulted, so the incremental effect there is small.

## 5. Cross-Discipline Inputs

**Product (Vivek).**
- Decision required: whether "Memory Makers," "International Private Tour," "Kerala Getaway" and "Relaxing Getaway" should be retired as authoring labels for *future* traveller folders (a content-standards question, separate from today's 6 journeys), and whether any of the candidate mappings in §3 should be confirmed now or left open.
- Mandatory vs. preference: **not mandatory for Release 1.3** — per the finding above, no visible output depends on this decision today. It becomes mandatory only once a badge feature is actually built from the curated union (a Future Consideration, not in scope now). Vivek's review is valuable for setting the standing content-classification convention, but nothing in Release 1.3 is blocked on it.

**Architecture (Archie).**
- No architectural impact beyond EBC-06 exists from this addendum — no new fields, no new components, no code paths inspected here that weren't already covered in EBC-06 §2–§3.
- The dormant-union finding above doesn't change Archie's Q1–Q5 decisions; it changes only how much those decisions currently matter in practice. Worth a brief acknowledgment from Archie that the "badge" language in EBC-06 §1 refers to a not-yet-built feature, so a future reader of that EBC isn't misled into thinking a badge exists today.

**Engineering (Rad).**
- No additional implementation beyond the planned mechanical migration (EBC-06 §3) is required by anything in this addendum.
- No code changes are needed if Vivek approves a mapping for any of these four values — per EBC-06 Q4's mechanism, an approved mapping is simply an additional row in the lookup table Rad was already going to build; an unmapped value is simply an absent row. Either outcome uses the same mechanism already authorised.

**QA (Keerthi).**
- Once the 6 journeys' testimonial text is migrated, Keerthi should confirm the existing kicker text ("Memory Makers," etc.) still renders correctly for each — this is pre-existing display behaviour, not new, so it is a regression check, not new test-case design.
- If any of the three `featured: true` journeys (JRN-042, JRN-023, JRN-027) becomes homepage-eligible after migration, Keerthi should verify the homepage preview renders that journey's kicker and excerpt correctly (per `getHomepageTravellerStories.ts`'s existing selection rule) — this is a natural consequence of the already-approved migration, not of this taxonomy decision.
- No new validation is required specifically for the mapping decision itself, since (per §4) it has no current visible output to check.

## 6. Recommendation

- **Memory Makers (3 journeys) — Recommend deferring.** The three journeys are too dissimilar for one confident mapping, and nothing is currently blocked by leaving it open. Revisit if/when a badge feature is designed, at which point Sophie's input on how to handle a marketing-style label would also be useful.
- **International Private Tour (1 journey) — Recommend leaving unmapped.** Both candidate mappings are weakly or poorly supported (see §2–§3); this is the clearest case where a wrong mapping is worse than no mapping, consistent with Archie's own stated principle in EBC-06.
- **Kerala Getaway (1 journey) — Recommend mapping to Weekend Getaway.** This is the one ambiguous value where the evidence (short 3-day/2-night duration, "Getaway" wording, and an existing same-category precedent) reasonably converges on a single answer, low risk either way.
- **Relaxing Getaway (1 journey) — Recommend mapping to Family Holiday.** Confirmed traveller type and duration both support this over the "Getaway" reading; unlike Kerala Getaway, the facts here point one direction.

None of these four recommendations block the Release 1.3 testimonial migration Product already approved (`EBC-R1.3-WS2-04` §11 Decision 1) — per §4 above, they affect only a currently-unrendered data field, so Tiger can route the migration forward independent of how quickly this specific review closes.

---

## Explicitly Out of Scope — Confirmed

No repository files were modified. No metadata was changed. No workbook values were changed. No mapping was applied. No decision was made — every recommendation in §6 is Arjun's input for Vivek's decision, not a resolution.

---

*Prepared by Arjun (Product and Business Analyst), Team Satvi — Search My Vacation SMV 2.0.*
