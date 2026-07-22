# JOURNEY-DIRECTOR-DECISION-ENGINE.md

## 1. Document Header

| Document Field | Value |
| --- | --- |
| **Version** | v1.0 |
| **Status** | Approved Product Decision Specification |
| **Owner** | Search My Vacation – Product & Experience |
| **Last Updated** | 21 July 2026 |
| **Module** | Journey Director |
| **Purpose** | Define the deterministic matching, eligibility, ranking, regional selection, explanation and governance rules that connect Journey Passport inputs with journey possibilities from the Destination Knowledge Base. |

> **Audience:** Product Managers, Journey Directors, UX Designers, Developers, AI Engineers, Content Strategists, Destination Operations Leaders, Quality Assurance Teams and future custodians of the Search My Vacation recommendation experience.

### 1.1 Related Specifications

This specification should be read alongside:

- `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`, which defines how Search My Vacation understands the traveller.
- `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, which defines the destinations, regions and experiences Search My Vacation can confidently deliver.
- `docs/04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md`, which defines how recommendations are revealed to the traveller.

These documents have separate responsibilities.

Journey Passport captures the traveller's story.

Destination Knowledge Base describes the journeys Search My Vacation can deliver.

Journey Director Decision Engine decides which possibilities deserve to be presented and why.

Journey Director Experience turns those decisions into a warm, guided discovery experience.

---

# 2. The Decision Engine Promise

The Journey Director Decision Engine is not designed to find the most popular destination.

It is designed to identify the journeys most likely to feel meaningful to a particular traveller, from the destinations Search My Vacation can confidently deliver today.

Its role is not to produce a single answer and persuade the traveller to accept it.

Its role is to create a small, thoughtful set of possibilities through which the traveller can recognise the journey that feels right.

> **The Journey Director is a discovery engine, not a selling engine.**

Every result must therefore be:

- grounded in what the traveller shared;
- operationally deliverable by Search My Vacation;
- distinct enough to expand the traveller's imagination;
- specific enough to recommend the right region, city or area;
- explainable in human language;
- honest about uncertainty; and
- suitable for review or refinement by a human Journey Director.

The engine succeeds when the traveller thinks:

> **“These possibilities feel like different versions of the journey I had in mind.”**

It fails when the traveller feels that destinations were chosen because Search My Vacation wanted to sell them.

---

# 3. Purpose and Scope

## 3.1 Purpose

This document defines the complete decision framework between Journey Passport submission and Journey Director presentation.

It establishes:

- how traveller inputs are interpreted;
- how traveller signals are normalised;
- which destinations are operationally eligible;
- how destinations and regions are scored;
- how the three journey personalities are assigned;
- how recommendation evidence is preserved;
- how explanations and destination-specific content are assembled;
- how uncertainty, conflicts and missing information are handled;
- how a human Journey Director may review or override a result; and
- how Release 1 can evolve safely into an AI-assisted system.

The specification is implementation-aware but technology-independent.

The product rules should remain valid whether matching is performed through TypeScript configuration, a service, an internal planning tool or a future AI-assisted recommendation layer.

## 3.2 In Scope

Release 1 decisioning includes:

- structured and free-text signals from the Journey Passport;
- active destinations and regions from the Destination Knowledge Base;
- operational eligibility filters;
- deterministic scoring and ranking;
- a shortlist of up to three journey possibilities;
- recommendation personality assignment;
- region-level matching;
- explanation evidence;
- dynamic content selection for the post-selection experience;
- confidence assessment;
- fallbacks and review states;
- manual Journey Director intervention; and
- auditable decision traces.

## 3.3 Out of Scope for Release 1

The following are intentionally excluded from Release 1:

- real-time airfare or hotel pricing;
- live inventory availability;
- itinerary generation;
- automated booking;
- autonomous AI recommendations without deterministic safeguards;
- traveller profiling based on third-party behavioural data;
- ranking influenced by supplier commission or commercial preference;
- unreviewed recommendations for destinations that are not operationally active; and
- guarantees about weather, visas, availability or price.

These capabilities may be introduced later without changing the central promise of the Decision Engine.

---

# 4. Product Principles

## 4.1 Understand Before Recommending

The engine must begin with the traveller's story, not the destination catalogue.

Companions, emotional goals, desired memories, travel style, comfort, pace, timing and explicit preferences must be interpreted before a destination is scored.

## 4.2 Eligibility Before Suitability

A destination may be emotionally suitable and still be operationally ineligible.

Search My Vacation must never recommend a destination it cannot confidently curate at the time of recommendation.

Operational eligibility is a hard gate.

It cannot be overcome by a high matching score, commercial preference or AI-generated enthusiasm.

## 4.3 Emotion First, Geography Second

The engine should first understand the feeling and character of the desired journey.

Geography becomes the expression of that need.

This prevents recommendations from becoming a catalogue search disguised as personalisation.

## 4.4 Recommend at the Most Meaningful Level

The recommendation must not stop at a country, state or broad destination when a particular region better expresses the traveller's needs.

Bali should become Ubud, Seminyak, Nusa Dua or another appropriate region.

Kerala should become Alleppey, Munnar, Thekkady, Kovalam or another appropriate region.

The engine recommends the destination and the region together whenever regional intelligence is available.

## 4.5 Three Possibilities, Three Valid Futures

The three recommendation personalities are not first, second and third place.

Each represents a different but credible interpretation of the traveller's story:

- **The Perfect Match** reflects the closest overall alignment.
- **A Different Rhythm** fulfils the same core emotional need through a meaningfully different setting or travel expression.
- **A Pleasant Surprise** introduces a less obvious but well-supported possibility.

No personality may be filled merely to complete the set.

## 4.6 Explain Every Recommendation

Every recommendation must retain the evidence that caused it to be selected.

The engine must be able to answer:

> **“What did the traveller share, what does this destination offer, and how are those two things connected?”**

If the connection cannot be explained truthfully, the recommendation should not be shown.

## 4.7 Confidence Over Coverage

It is better to present two strong possibilities than three weak ones.

It is better to request clarification than to manufacture confidence.

It is better to hand the traveller to a human Journey Director than to present a destination that may not suit them.

## 4.8 Traveller Agency Without Decision Fatigue

The engine should guide without constraining.

Three carefully chosen possibilities create agency while preserving calm.

The traveller is invited to explore, compare and recognise what feels right without being presented with an exhaustive destination catalogue.

## 4.9 The Layout Remains Stable; the Story Changes

The Journey Director uses one reusable experience structure across every destination.

Once a traveller selects a possibility, the destination and region determine the explanations, imagery, experiences and handoff language that follow.

> **Screens 5 onward are dynamically driven by the traveller's selected possibility. The layout, interaction pattern, transition rhythm and component structure remain reusable and unchanged; only the story content changes.**

This is a foundational product and engineering rule, not an optional enhancement.

## 4.10 Human Judgement Remains Accountable

The Decision Engine supports a Journey Director.

It does not replace professional judgement.

A human Journey Director remains responsible for resolving ambiguity, recognising special circumstances, validating operational reality and improving recommendations where structured rules are insufficient.

---

# 5. Decision Architecture

The Decision Engine connects three forms of intelligence.

```text
Journey Passport
        │
        ▼
Traveller Signal Profile
        │
        ▼
Operational Eligibility Filters
        │
        ▼
Destination Candidate Scoring
        │
        ▼
Destination Shortlist
        │
        ▼
Region-Level Selection
        │
        ▼
Recommendation Personality Assignment
        │
        ▼
Evidence and Explanation Assembly
        │
        ▼
Journey Possibility Story Packets
        │
        ▼
Journey Director Experience
        │
        ▼
Human Journey Director Handoff
```

## 5.1 Decision Stages

The engine proceeds through nine stages.

1. **Validate the Journey Passport.** Confirm that sufficient information exists to begin matching.
2. **Normalise traveller signals.** Convert structured selections and free-text responses into a consistent Traveller Signal Profile.
3. **Apply operational eligibility filters.** Remove destinations and regions Search My Vacation cannot confidently deliver.
4. **Score eligible destinations.** Evaluate suitability across the defined matching dimensions.
5. **Select candidate regions.** Find the most meaningful regional expression within each leading destination.
6. **Apply diversity and personality rules.** Create up to three distinct, defensible possibilities.
7. **Assess confidence.** Determine whether results may be shown, require clarification or require human review.
8. **Assemble explanations and story content.** Preserve traveller evidence and destination evidence for every claim.
9. **Record the decision trace.** Store enough information to reproduce, inspect and govern the recommendation.

The order matters.

Later stages must never reintroduce a candidate removed by an earlier hard eligibility filter.

---

# 6. Traveller Input Model

The Journey Passport contains traveller language.

The Decision Engine requires consistent signals.

The Traveller Input Model preserves both.

Original responses must remain available for explanation and human review, while normalised signals support deterministic matching.

## 6.1 Source Inputs

The engine may receive the following Journey Passport inputs.

### Traveller Identity

- Traveller name
- Contact context, where separately consented and required for handoff
- Returning traveller identifier, when available in a future release

Identity personalises the experience but must not influence destination ranking unless a future, consented preference history explicitly supports it.

### Travel Companions

- Solo Traveller
- Couple
- Honeymoon
- Family
- Friends
- Multi-generation Family
- Senior Travellers
- Corporate or group context, where supported
- Other companion detail supplied in free text

Companion information affects traveller suitability, pace, accessibility, privacy, activity balance and regional logistics.

### Dream Journey

The traveller's own description of what they hope the journey will feel like or create.

This may include:

- emotional needs;
- desired memories;
- celebration context;
- preferred environments;
- cultural or activity interests;
- people-centred goals;
- explicit destinations;
- destinations or experiences to avoid; and
- special circumstances.

Free-text content is valuable evidence, but Release 1 must not silently infer unsupported details from it.

### Travel Style

Travel style selections may express preferences such as:

- relaxation;
- nature;
- culture and heritage;
- food;
- beaches and islands;
- mountains;
- wildlife;
- wellness;
- adventure;
- shopping;
- nightlife;
- road trips;
- spirituality;
- family attractions;
- hidden gems; and
- premium or distinctive experiences.

The exact selectable vocabulary remains governed by the Journey Passport specification.

The Decision Engine maps each selection to the controlled Emotion and Theme Libraries in the Destination Knowledge Base.

### Travel Pace

- Relaxed
- Balanced
- Explorer
- Fast Paced

Where the Journey Passport does not ask for pace directly, pace may be derived cautiously from selected travel styles and free-text statements.

Derived pace must carry lower evidence strength than an explicit selection.

### Comfort Preference

- Simple
- Balanced
- Premium

Comfort represents the expected style of travel, not a precise budget.

The engine must not translate comfort into a promised price without current commercial data.

### Timing

- Known travel dates
- Travel month or season
- Approximate travel window
- Flexible timing
- Undecided timing
- Ideal duration, when supplied

Timing influences season suitability, operational feasibility and trip rhythm.

Unknown timing should reduce certainty but should not automatically prevent inspiration-stage recommendations.

### Destination Certainty

- Open to possibilities
- Considering one or more destinations
- Already decided on a destination
- Explicitly excluding a destination or journey type

Destination certainty changes the interpretation of the request.

A traveller who is open to possibilities receives discovery-led recommendations.

A traveller who names a destination should receive either:

- the most suitable region within that active destination;
- thoughtfully related alternatives, when the experience permits them; or
- a transparent operational fallback when Search My Vacation does not currently serve the requested destination.

## 6.2 Normalised Traveller Signal Profile

Release 1 should transform Journey Passport responses into the following conceptual profile.

```ts
interface TravellerSignalProfile {
  travellerId: string;
  travellerName?: string;
  companions: WeightedSignal<TravellerType>[];
  emotions: WeightedSignal<Emotion>[];
  themes: WeightedSignal<Theme>[];
  memoryGoals: EvidenceBackedSignal[];
  pacePreferences: WeightedSignal<TravelPace>[];
  comfortPreferences: WeightedSignal<ComfortLevel>[];
  timing: TimingProfile;
  destinationIntent: DestinationIntent;
  explicitPreferences: PreferenceConstraint[];
  explicitExclusions: PreferenceConstraint[];
  accessibilityNeeds: Requirement[];
  specialConsiderations: Requirement[];
  sourceEvidence: TravellerEvidence[];
  completeness: number;
}
```

This interface is illustrative.

The final implementation may use different names, but it must preserve the same product meaning.

## 6.3 Signal Strength

Not every signal should carry equal confidence.

| Signal Source | Default Strength | Decision Treatment |
| --- | ---: | --- |
| Explicit Journey Passport selection | 1.00 | Strongest preference evidence |
| Explicit free-text statement | 0.90 | Strong evidence when unambiguous |
| Repeated preference across fields | Up to 1.00 | Reinforced evidence, capped to prevent double counting |
| Cautious inference from free text | 0.60 | Supporting evidence only |
| Default introduced because a field is missing | 0.25 | Must not drive a recommendation on its own |

Signal strength influences the weight of a preference.

It does not change a hard requirement into a soft preference.

## 6.4 Hard Requirements and Soft Preferences

Traveller signals must be classified before matching.

### Hard Requirements

Examples include:

- accessibility needs;
- explicit exclusions;
- travel dates that cannot move;
- companion safety requirements;
- destinations the traveller will not consider;
- operational or documentation constraints known at the time of review; and
- any requirement the traveller explicitly describes as essential.

Hard requirements must either be satisfied or escalated.

### Soft Preferences

Examples include:

- preferred themes;
- desired emotion;
- ideal pace;
- comfort style;
- preference for quieter areas;
- interest in food, culture, nature or shopping; and
- openness to a different travel expression.

Soft preferences influence scoring and trade-offs.

They do not independently disqualify a destination unless the associated mismatch would make the recommendation misleading.

## 6.5 Evidence Preservation

Every normalised signal must retain its source.

For example:

```text
Signal: Reconnection
Strength: 0.90
Source: Dream Journey
Evidence: “We want uninterrupted time together as a family.”
```

Evidence preservation allows the engine to generate explanations without inventing traveller motivations.

It also allows a Journey Director to understand why the engine interpreted the Passport in a particular way.

## 6.6 Sensitive Inputs

The engine must not derive or use sensitive personal characteristics that the traveller did not intentionally provide for journey planning.

It must not infer religion, health status, financial status, ethnicity, sexuality or other sensitive traits from names, language, companions or free text.

When a traveller voluntarily shares a relevant need, the information should be used only to improve suitability and must be handled according to Search My Vacation privacy and consent requirements.

---

# 7. Destination Candidate Model

The Decision Engine consumes destination and region intelligence from the Destination Knowledge Base.

It must not maintain a conflicting destination taxonomy inside the matching code.

## 7.1 Required Destination Attributes

Each destination candidate should provide:

- Destination ID
- Destination Name
- Status
- Category
- Operational Service Confidence
- Primary Emotion
- Supporting Emotions
- Themes
- Traveller Suitability
- Supported Comfort Levels
- Supported Travel Paces
- Best Seasons and recommended months
- Typical Duration
- Signature Experiences
- Destination Personality
- Regions
- Journey Director Notes
- Last Reviewed Date

## 7.2 Required Region Attributes

Each region should provide:

- Region ID
- Region Name
- Parent Destination ID
- Operational availability
- Emotional personality
- Themes
- Best traveller types
- Supported pace and comfort
- Seasonal guidance
- Signature experiences
- Ideal stay
- Transfer or mobility notes
- Traveller notes
- Destination-specific imagery references
- Dynamic content references for Screens 5–7

## 7.3 Unknown and Missing Knowledge

Missing destination knowledge is not a match.

The engine must distinguish between:

- a confirmed negative attribute;
- a confirmed positive attribute; and
- an unknown or unreviewed attribute.

Unknown attributes should contribute no positive score.

They may reduce confidence when the missing field is material to the traveller's request.

This prevents incomplete records from outperforming carefully maintained destinations.

---

# 8. Operational Eligibility Filters

Operational eligibility determines which destinations may enter scoring.

These filters protect traveller trust and Search My Vacation's ability to deliver.

They are applied before suitability ranking.

## 8.1 Destination Status

| Status | Recommendation Treatment |
| --- | --- |
| **ACTIVE** | Eligible when all other hard filters pass |
| **COMING_SOON** | Never shown to travellers; retained only for internal knowledge and future readiness |
| **INACTIVE** | Excluded from all recommendations |

China, Japan, East Africa, Australia and New Zealand remain unavailable for recommendation while their status is `COMING_SOON`, regardless of destination fit or supplier relationships.

Having a DMC relationship is not equivalent to operational readiness.

## 8.2 Service Confidence

An active destination must meet the minimum internal service-confidence requirement established by Operations.

Service confidence may consider:

- current operational ownership;
- trusted destination partner readiness;
- product knowledge;
- support capability;
- itinerary feasibility;
- known service disruptions; and
- recency of destination review.

A destination that falls below the operational threshold should be temporarily suppressed until reviewed.

Release 1 should use the following controlled service-confidence states.

| Service Confidence | Automatic Recommendation Treatment | Scoring Value After Eligibility |
| --- | --- | ---: |
| **CONFIDENT** | Eligible | 1.00 |
| **SUPPORTED** | Eligible when all other hard filters pass | 0.75 |
| **LIMITED** | Not eligible for automatic presentation; human review only | Not scored |
| **PAUSED** | Excluded | Not scored |

Operational leaders may change the labels in implementation, but the four distinct behaviours must remain.

## 8.3 Timing and Seasonal Feasibility

When the traveller provides fixed dates, the engine must exclude a destination or region if Search My Vacation has marked it operationally unsuitable for that period.

A merely imperfect season is not always a hard exclusion.

The Destination Knowledge Base must distinguish:

- **Preferred:** strongly suitable;
- **Possible with guidance:** suitable with a transparent trade-off;
- **Not recommended:** exclude for the stated timing; and
- **Unknown:** require review when timing is material.

## 8.4 Companion and Accessibility Feasibility

A destination or region must be excluded when it cannot satisfy a declared hard companion or accessibility requirement.

Examples include:

- a mobility need incompatible with the proposed experience;
- transfer conditions unsuitable for the travelling party;
- an experience that cannot safely accommodate the stated age group; or
- an operational constraint confirmed by the Journey Director or destination owner.

The engine must not use age or companion type as a crude exclusion when a suitable experience remains possible.

## 8.5 Duration Feasibility

When duration is known, the engine should remove destinations whose minimum practical journey length exceeds the traveller's available time.

Where a shorter regional experience remains credible, the region may remain eligible even if the broader destination normally supports a longer journey.

## 8.6 Explicit Traveller Exclusions

Destinations, regions, climates, activities or journey types explicitly excluded by the traveller must not be recommended.

An alternative may be offered only when it respects the reason behind the exclusion.

## 8.7 Critical Data Quality

A destination may be temporarily excluded when essential matching information is missing or stale.

Examples include:

- no verified operational status;
- no usable region record when region specificity is required;
- no current seasonal guidance for fixed travel dates; or
- an expired review date for a destination with known operational volatility.

## 8.8 Commercial Neutrality

Supplier commission, margin, promotional pressure and inventory targets must not override traveller suitability or operational eligibility.

If commercial information is used in future optimisation, it may operate only after traveller fit and operational confidence are protected, and its use must be disclosed internally and governed separately.

---

# 9. Destination Scoring Dimensions

Eligible destinations are scored against the Traveller Signal Profile.

Scoring converts evidence into a consistent comparison.

It does not replace judgement.

## 9.1 Release 1 Weighted Score

The Release 1 Destination Fit Score uses a 100-point model.

| Dimension | Weight | What It Measures |
| --- | ---: | --- |
| **Emotional Alignment** | 24 | How strongly the destination supports the traveller's primary and supporting emotional goals |
| **Theme and Experience Alignment** | 16 | How well the destination's themes and signature experiences reflect stated interests |
| **Traveller and Companion Suitability** | 12 | Suitability for the stated companion group and journey context |
| **Travel Pace Alignment** | 10 | Compatibility with relaxed, balanced, explorer or fast-paced preferences |
| **Comfort Alignment** | 10 | Ability to deliver the preferred simple, balanced or premium experience |
| **Season and Timing Suitability** | 10 | Quality of fit for known travel dates or season |
| **Region Match Quality** | 8 | Strength of at least one region capable of expressing the traveller's needs |
| **Memory Goal Alignment** | 6 | Ability to create the memories described in the traveller's own language |
| **Operational Confidence** | 4 | Relative confidence among candidates that already passed hard operational filters |
| **Total** | **100** | Overall destination suitability |

Weights are product configuration.

They should not be scattered through presentation components or copied into destination records.

## 9.2 Dimension Calculation

Each dimension receives a normalised value between `0.00` and `1.00`.

The weighted contribution is:

```text
Dimension Contribution = Dimension Match × Dimension Weight
```

The base score is:

```text
Destination Fit Score = Sum of all Dimension Contributions
```

The maximum base score is 100.

### Canonical Compatibility Coefficients

Release 1 should use the following coefficients unless a dimension defines a more specific matrix.

| Compatibility | Coefficient | Meaning |
| --- | ---: | --- |
| **Direct match** | 1.00 | Destination or region clearly supports the signal |
| **Strong supporting match** | 0.80 | Not the primary identity, but well-supported through reviewed attributes or experiences |
| **Partial or adjacent match** | 0.50 | Can be delivered credibly with some compromise |
| **Weak match** | 0.25 | Limited evidence; must not drive the recommendation |
| **Unknown** | 0.00 | No verified knowledge; contributes no positive score |
| **Confirmed conflict** | 0.00 plus penalty or exclusion | Reviewed evidence conflicts with the signal |

For a dimension containing several traveller signals, calculate weighted coverage as:

```text
Dimension Match =
  Sum of (Traveller Signal Strength × Compatibility Coefficient)
  ÷
  Sum of Traveller Signal Strengths
```

Only signals relevant to that dimension enter the denominator.

The result is capped between `0.00` and `1.00`.

Repeated evidence may strengthen one traveller signal up to `1.00`, but it must not create duplicate signals that multiply the same preference.

## 9.3 Emotional Alignment

Emotional Alignment should give additional importance to the destination's Primary Emotion without ignoring supporting emotions.

Release 1 may calculate this dimension as:

```text
60% × Primary Traveller Emotion Match
+
40% × Supporting Emotion Coverage
```

Where multiple traveller emotions exist, signal strength determines their contribution.

The engine must cap repeated evidence so the same preference is not counted once as free text, again as a style selection and again as a memory goal without limit.

## 9.4 Theme and Experience Alignment

Theme matching should reward both thematic coverage and the presence of credible signature experiences.

A destination should not receive full credit for a theme merely because the word appears in its tags.

At least one region or signature experience must substantiate a strong theme match.

## 9.5 Traveller and Companion Suitability

This score considers whether the destination naturally supports the stated companion group.

It may include:

- privacy for honeymoon travellers;
- variety and manageable logistics for families;
- pace and mobility considerations for senior travellers;
- sociability and flexibility for friends;
- depth and independence for solo travellers; and
- balanced interests for multi-generation families.

Companion suitability must never rely on stereotypes.

It should be based on reviewed destination characteristics and explicit traveller needs.

Release 1 should map reviewed suitability as follows:

| Destination or Region Suitability | Match Value |
| --- | ---: |
| Listed as **Best For** the companion profile | 1.00 |
| Listed as suitable | 0.80 |
| Possible with a material planning adjustment | 0.50 and applicable penalty |
| Unknown | 0.00 and reduced confidence |
| Confirmed unsuitable for a hard companion need | Exclude |

## 9.6 Travel Pace Alignment

Exact pace matches receive the highest score.

Adjacent pace matches may receive partial credit where the destination or region can be shaped accordingly.

A destination should receive a significant penalty when its natural rhythm conflicts with an explicit, strongly weighted pace preference and no suitable region resolves the conflict.

Release 1 should use this ordered pace compatibility matrix.

| Difference Between Preferred and Supported Pace | Match Value |
| --- | ---: |
| Exact pace supported | 1.00 |
| One adjacent pace supported | 0.70 |
| Two pace levels apart | 0.35 |
| Opposite end of the pace range | 0.10 plus material conflict penalty |
| Supported pace unknown | 0.00 and reduced confidence |

The ordered pace range is `Relaxed → Balanced → Explorer → Fast Paced`.

When a destination supports several paces, the best verified regional pace match is used.

## 9.7 Comfort Alignment

A destination supporting the selected comfort level receives full credit.

A destination with only adjacent comfort options may receive partial credit when the Journey Director can confidently curate the experience.

The engine must not assume that an international destination is premium or that a domestic destination is simple.

Comfort is derived from available journey design, not geography.

Release 1 should use:

| Comfort Compatibility | Match Value |
| --- | ---: |
| Selected comfort level explicitly supported | 1.00 |
| Adjacent comfort level can be curated credibly | 0.60 |
| Only a materially different comfort level is supported | 0.20 plus material conflict penalty |
| Comfort support unknown | 0.00 and reduced confidence |
| Essential comfort requirement cannot be met | Exclude |

The ordered comfort range is `Simple → Balanced → Premium`.

## 9.8 Season and Timing Suitability

When dates are known, confirmed destination seasonality should drive the score.

When timing is flexible, the engine may give moderate credit to destinations with several suitable windows.

When timing is unknown, the dimension should use a neutral value and reduce total confidence rather than falsely assuming ideal conditions.

Release 1 should translate maintained seasonal guidance as follows:

| Seasonal Guidance | Match Value | Behaviour |
| --- | ---: | --- |
| **Preferred** | 1.00 | No qualification required |
| **Possible with guidance** | 0.60 | Preserve the trade-off and apply a season penalty when material |
| **Unknown for fixed dates** | 0.00 | Human review required |
| **Not recommended** | — | Exclude for the stated timing |
| **Traveller timing unknown** | 0.50 | Neutral inspiration-stage value; reduce confidence |

## 9.9 Region Match Quality

The best eligible region within the destination contributes the Region Match Quality value.

A broad destination should not rank highly if none of its active regions meaningfully expresses the traveller's needs.

## 9.10 Memory Goal Alignment

Memory goals represent the experiences the traveller hopes to remember.

Examples include:

- uninterrupted family time;
- a meaningful celebration;
- discovering food together;
- seeing wildlife for the first time;
- finding quiet after a demanding period; or
- experiencing culture beyond tourist checklists.

The score must be backed by an actual region or signature experience.

## 9.11 Operational Confidence

Operational Confidence differentiates eligible candidates using current internal confidence.

Its intentionally small weight ensures that suitability remains dominant while giving a modest preference to destinations Search My Vacation knows particularly well.

Operational Confidence cannot rescue a poor traveller fit.

## 9.12 Penalties

Penalties apply after the base score and before ranking.

| Penalty Category | Permitted Severity | Example |
| --- | --- | --- |
| Strong soft-preference conflict | Moderate or Material | Nightlife-led region for a traveller explicitly seeking quiet |
| Transfer or pace friction | Minor, Moderate or Material | Significant movement for a short, relaxed journey |
| Incomplete material knowledge | Moderate or Material | Region suitability unknown for a strongly stated preference |
| Season trade-off | Minor, Moderate or Material | Possible but meaningfully less suitable travel period |
| Weak regional expression | Moderate or Material | Destination matches broadly but no region strongly supports the story |

Hard conflicts are exclusions, not penalties.

To keep Release 1 deterministic, every applicable conflict should first be classified by severity.

| Severity | Penalty | Definition |
| --- | ---: | --- |
| **Minor** | −3 | Noticeable but unlikely to change the overall journey experience |
| **Moderate** | −7 | Requires planning adjustment or a clear traveller-facing trade-off |
| **Material** | −12 | Meaningfully conflicts with a strong preference but does not violate a hard requirement |

Only the highest penalty in each penalty category is applied.

Different categories may accumulate.

The internal Decision Trace must record the category, severity, evidence and points deducted.

If a team member cannot classify a conflict using maintained rules, the candidate requires human review rather than an improvised penalty.

## 9.13 Final Score

```text
Final Destination Score = Base Destination Fit Score − Applicable Penalties
```

Scores are capped between 0 and 100.

Internal scores support consistency and governance.

They should not be shown as percentages to travellers, because numeric precision may imply certainty that the product does not possess.

---

# 10. Candidate Generation and Ranking

## 10.1 Candidate Generation

Every operationally eligible destination is scored.

For each destination, the engine also identifies its highest-scoring eligible region before final destination ranking.

The candidate record should include:

- destination score;
- selected region score;
- matched traveller signals;
- material unmatched signals;
- trade-offs;
- operational evidence;
- confidence indicators;
- diversity characteristics; and
- explanation evidence.

## 10.2 Ranking Order

Candidates are ordered by Final Destination Score.

Ranking must be deterministic for the same:

- Journey Passport version;
- Destination Knowledge Base version;
- Decision Engine rules version; and
- operational configuration.

Where scores are equal within 0.5 points, the tie-break order is:

1. stronger match to the traveller's highest-confidence emotional signal;
2. stronger region-level score;
3. fewer material trade-offs;
4. stronger memory-goal evidence;
5. higher operational confidence; and
6. stable alphabetical Destination ID ordering for technical determinism only.

Alphabetical order must never be presented as a product preference.

## 10.3 Shortlist Size

The desired shortlist contains three possibilities.

The engine may return fewer when confidence or eligibility is insufficient.

It must never lower core standards merely to fill all three personalities.

## 10.4 Destination Diversity

The three possibilities should normally represent three different destinations.

Multiple regions within the same destination may be offered only when:

- the traveller has explicitly decided on that destination;
- the regions create materially different journey expressions; or
- fewer than three eligible destinations meet the confidence threshold and a human Journey Director approves the regional alternatives.

The traveller must never see duplicate possibilities that differ only cosmetically.

## 10.5 Diversity Without Randomness

The shortlist should vary in a meaningful dimension such as:

- setting;
- cultural expression;
- travel rhythm;
- primary theme;
- geography;
- style of signature experience; or
- degree of familiarity.

Diversity must not weaken the traveller's core emotional, companion, comfort or operational requirements.

---

# 11. Recommendation Personalities

The recommendation personalities give each possibility a purpose.

They should feel like three invitations, not a podium.

## 11.1 The Perfect Match

**Traveller-facing description:**

> *This feels closest to everything you shared.*

The Perfect Match is the eligible destination-region pair with the strongest overall alignment and sufficient confidence.

It should:

- match the primary emotional goal;
- respect all hard requirements;
- strongly support the companion profile;
- align with pace and comfort;
- contain a region that clearly expresses the traveller's story;
- offer evidence-backed signature experiences; and
- meet the Perfect Match confidence threshold.

The highest numerical score is not automatically a Perfect Match when a material preference remains unresolved.

## 11.2 A Different Rhythm

**Traveller-facing description:**

> *The same emotions, expressed through a different kind of journey.*

A Different Rhythm should preserve the traveller's central emotional need while changing how that need is experienced.

Examples include:

- backwater calm expressed as cultural and wellness immersion;
- mountain serenity expressed as coastal slow living;
- family discovery expressed through a compact city experience rather than a road journey; or
- celebration expressed through food and culture rather than nightlife.

Selection rules:

- all hard requirements must pass;
- the primary emotional goal must remain strongly supported;
- the destination must exceed the Different Rhythm threshold;
- at least one meaningful diversity dimension must differ from The Perfect Match;
- the difference must be explained positively; and
- the option must never be described as second best.

## 11.3 A Pleasant Surprise

**Traveller-facing description:**

> *A journey you may not have considered, but one we think could become unforgettable.*

A Pleasant Surprise expands the traveller's imagination without becoming speculative.

It may be selected because:

- the destination was not named by the traveller;
- the region is less obvious but strongly aligned;
- the destination combines desired themes in an unexpected way;
- it offers a distinctive signature experience connected to a memory goal; or
- it satisfies the traveller's central needs through a culturally or geographically different expression.

Selection rules:

- every hard requirement must pass;
- primary emotion, companion and comfort requirements must remain credible;
- the option must exceed the Pleasant Surprise threshold;
- at least two evidence-backed reasons must explain the recommendation;
- operational confidence must be strong; and
- surprise must never be manufactured by choosing a weak or unsuitable candidate.

## 11.4 Personality Assignment Order

Release 1 should assign personalities in this sequence:

1. Select The Perfect Match from the highest-confidence leading candidate.
2. Select A Different Rhythm from remaining candidates that preserve core alignment while maximising meaningful difference.
3. Select A Pleasant Surprise from remaining candidates that meet core thresholds and provide credible novelty.

The same candidate cannot occupy more than one personality.

### Perfect Match Selection Value

The Perfect Match is selected using the highest Final Destination Score after confidence and material-conflict checks.

No separate novelty or diversity modifier applies.

### Different Rhythm Selection Value

After The Perfect Match is selected, each remaining qualified candidate receives a Diversity Score from `0.00` to `1.00`.

The Diversity Score is the average difference across the following maintained axes:

- setting and geography;
- journey rhythm;
- dominant theme;
- signature experience style; and
- cultural expression.

For each axis:

- `0.00` means substantially the same expression;
- `0.50` means meaningfully different; and
- `1.00` means strongly different while remaining suitable.

The selection value is:

```text
Different Rhythm Selection Value =
  (Normalised Final Destination Score × 0.75)
  +
  (Diversity Score × 0.25)
```

The candidate must still meet all Different Rhythm gates.

Diversity cannot compensate for a failure to support the traveller's primary emotional goal.

### Pleasant Surprise Selection Value

After the first two personalities are assigned, each remaining qualified candidate receives:

- a **Novelty Score**, based only on the current Passport and shortlist; and
- an **Evidence Readiness Score**, based on explanation and Story Packet completeness.

Novelty is calculated from:

| Novelty Signal | Contribution |
| --- | ---: |
| Destination was not explicitly named or shortlisted by the traveller | 0.50 |
| Setting or cultural expression differs from the other selected possibilities | 0.25 |
| Signature experience style is unique within the shortlist | 0.25 |

The Novelty Score is capped at `1.00`.

The engine must not infer that a destination is unfamiliar merely because the traveller did not name it.

Evidence Readiness is `1.00` only when the candidate has:

- at least two strong traveller-to-destination reasons;
- a qualified region;
- approved imagery;
- sufficient Screen 6 memory moments; and
- no unresolved material content gap.

The selection value is:

```text
Pleasant Surprise Selection Value =
  (Normalised Final Destination Score × 0.70)
  +
  (Novelty Score × 0.20)
  +
  (Evidence Readiness Score × 0.10)
```

The candidate must still meet the Pleasant Surprise fit and confidence thresholds.

### Deterministic Personality Tie-Breaking

When personality selection values are equal within `0.005`, use:

1. stronger primary-emotion match;
2. higher Region Fit Score;
3. stronger evidence readiness;
4. higher operational confidence; and
5. stable Destination ID ordering.

## 11.5 Personality Rebalancing

If no candidate meets a personality's rules, the engine should:

- leave that personality unfilled;
- return a review or clarification state; or
- allow a human Journey Director to assign a defensible candidate with a recorded reason.

It must not relabel an unsuitable destination to preserve the visual design.

---

# 12. Region-Level Selection

The destination creates the broad possibility.

The region makes it personal.

Region selection is therefore a required decision stage whenever maintained regional intelligence exists.

## 12.1 Region Eligibility

A region must pass:

- active operational availability;
- timing and seasonal feasibility;
- accessibility and companion requirements;
- minimum duration practicality;
- explicit exclusion checks; and
- critical data-quality checks.

## 12.2 Region Fit Score

Eligible regions are scored within their parent destination using a 100-point model.

| Dimension | Weight | What It Measures |
| --- | ---: | --- |
| **Emotional Fit** | 30 | How well the region expresses the traveller's desired feeling |
| **Theme and Signature Experience Fit** | 20 | Strength of relevant, deliverable experiences |
| **Pace Fit** | 15 | Compatibility with the traveller's preferred rhythm |
| **Companion Suitability** | 10 | Suitability for the travelling party |
| **Memory Goal Fit** | 10 | Ability to create the moments described by the traveller |
| **Logistical Fit** | 10 | Transfer, duration and movement suitability |
| **Comfort Fit** | 5 | Ability to deliver the intended comfort style |
| **Total** | **100** | Overall regional suitability |

## 12.3 Selecting the Recommended Region

The highest-scoring eligible region is selected when:

- it meets the minimum Region Fit threshold;
- no material hard requirement remains unresolved; and
- its personality is meaningfully distinct and explainable.

If the leading two regions are within three points and offer materially different expressions, the engine should preserve the runner-up as an internal alternative for the Journey Director.

It should not automatically show both to the traveller unless the experience calls for an explicit destination-level comparison.

## 12.4 Ubud Over Kuta Principle

The region recommendation must reflect the traveller's desired experience rather than the destination's most famous or commercially visible locality.

For example:

- prefer **Ubud** over a nightlife-led Bali region for travellers seeking wellness, culture, nature and reconnection;
- prefer **Nusa Dua** for travellers seeking premium resort comfort and calm beaches;
- prefer **Seminyak** for travellers seeking dining, shopping and vibrant evenings;
- prefer **Alleppey** for slow backwater experiences and meaningful family time;
- prefer **Munnar** for tea landscapes, cooler weather and scenic nature; and
- prefer **Krabi** over a more active nightlife region when the traveller seeks quieter island experiences.

These are examples, not hard-coded universal truths.

Season, companions, duration, operational readiness and the maintained Destination Knowledge Base must remain authoritative.

## 12.5 Multi-Region Journeys

The Decision Engine recommends a primary region for emotional clarity.

It may also attach one compatible supporting region when:

- the duration supports it;
- movement does not conflict with the desired pace;
- the combination adds a meaningful second dimension; and
- Search My Vacation can confidently curate the connection.

The initial possibility card should still lead with one destination and one primary region.

Complex itinerary structure belongs to later journey design.

## 12.6 No Eligible Region

If a destination scores well but no region meets the Region Fit threshold, the destination must not be presented as a high-confidence possibility.

The engine should either:

- choose another destination;
- request human regional review; or
- present the broad destination only when the product experience explicitly supports a low-specificity inspiration state and the limitation is transparent.

Release 1 should prefer another well-supported destination.

---

# 13. Explanation Generation

The explanation layer transforms a decision trace into human language.

It must never invent certainty, traveller motivations or destination capabilities.

## 13.1 Explanation Contract

Every recommendation explanation must connect three elements.

```text
What the traveller shared
        +
What the destination and region genuinely offer
        =
Why this possibility deserves consideration
```

## 13.2 Evidence Types

An explanation may use:

- explicit Journey Passport selections;
- unambiguous traveller statements;
- reviewed destination attributes;
- reviewed region attributes;
- maintained signature experiences;
- confirmed seasonal suitability; and
- Journey Director notes approved for recommendation use.

It may not use:

- unsupported assumptions;
- stereotypes;
- unverified superlatives;
- live availability not actually checked;
- promises of weather, price or service;
- destination facts absent from approved sources; or
- sensitive inferences.

## 13.3 Explanation Structure

Each possibility should contain:

1. **Emotional reflection** – the central feeling recognised in the Passport.
2. **Destination connection** – why the destination expresses that feeling.
3. **Regional precision** – why the selected city, area or region is the meaningful fit.
4. **Personal reasons** – two to four short, evidence-backed reasons.
5. **Trade-off, when material** – a calm and honest note that helps the traveller compare.

## 13.4 Example

```text
You told us that uninterrupted family time, nature and a slower pace matter
more than ticking off attractions.

That is why Kerala stood out—and why we would begin in Alleppey. Its gentle
backwater rhythm creates space to slow down together, while a houseboat stay
and village experiences turn the journey into shared memories rather than a
busy checklist.
```

The explanation is personal because it reflects stated preferences.

It is trustworthy because every destination claim comes from maintained knowledge.

## 13.5 Explanation Variants by Personality

### The Perfect Match

Lead with closeness of alignment.

Use language such as:

> “This feels closest to the journey you described because…”

### A Different Rhythm

Lead with the shared emotional goal and the intentionally different expression.

Use language such as:

> “This offers the same sense of reconnection through culture, wellness and a different rhythm…”

### A Pleasant Surprise

Lead with discovery and the specific evidence that made the less obvious option credible.

Use language such as:

> “You may not have mentioned this destination, but its combination of coast, culture and comfortable exploration connects beautifully with…”

## 13.6 Language Rules

The Journey Director voice should be:

- warm;
- observant;
- calm;
- specific;
- invitational;
- honest; and
- free from technical or algorithmic language.

Avoid:

- “The algorithm selected…”
- “Your compatibility score is…”
- “This is the best destination.”
- “You must choose…”
- “Limited-time package.”
- “People like you usually…”

Prefer:

- “From what you shared…”
- “One thing stood out…”
- “We think this could be a beautiful fit…”
- “Here is another way to imagine the same journey…”
- “This may surprise you, and here is why…”

## 13.7 Explanation Length

Release 1 should produce concise explanations suitable for progressive reveal.

Recommended limits:

- possibility-card emotional fit: 12–24 words;
- Screen 5 opening narrative: 45–90 words;
- Screen 5 reasons: two to four reasons, each 8–20 words;
- Screen 6 memory moments: three to five moments, each 6–16 words; and
- Screen 7 handoff line: 10–24 words.

Longer operational notes belong in the Journey Director view, not the cinematic traveller experience.

---

# 14. Dynamic Content Rules for Screens 5–7

The Journey Director experience becomes a dynamic branch when the traveller explores a possibility.

This behaviour is required in the live product.

It is not limited to mockups or UX prototypes.

## 14.1 Shared and Dynamic Portions of the Experience

Screens 1–4 use a shared narrative structure:

1. Journey Director Arrival
2. Traveller Reflection
3. Matching Journey Qualities
4. Three Journey Possibilities

Their layout remains common, while traveller reflection and shortlisted possibilities are populated from the current Journey Passport and Decision Engine result.

When the traveller selects **Explore This Journey** on Screen 4, the selected `possibilityId` becomes the active story context.

> **Everything from Screen 5 onward must be generated from the active possibility.**

This includes the selected destination, recommended region, personal explanation, imagery, signature moments, contextual handoff copy and any recommendation sent or saved.

## 14.2 Reusable Layout Rule

The UI must use the same components for every possibility.

The following remain unchanged:

- page and section structure;
- heading hierarchy;
- component positions;
- transition timing;
- animation rhythm;
- navigation behaviour;
- accessibility semantics;
- interaction labels, unless context requires a destination name; and
- responsive behaviour.

The following change dynamically:

- destination and region names;
- personality label;
- destination-specific palette accents, where permitted by design;
- hero and supporting imagery;
- explanation narrative;
- matched reasons;
- signature experiences;
- memory moments;
- trade-off note, where required;
- contextual call to action;
- contact handoff context; and
- saved or emailed recommendation content.

> **The layout never changes. Only the selected journey's story changes.**

## 14.3 Story Packet

Each shortlisted possibility must produce a complete Story Packet before it is shown on Screen 4.

```ts
interface JourneyPossibilityStoryPacket {
  possibilityId: string;
  personality: "PERFECT_MATCH" | "DIFFERENT_RHYTHM" | "PLEASANT_SURPRISE";
  destinationId: string;
  destinationName: string;
  regionId: string;
  regionName: string;
  card: PossibilityCardContent;
  whyThisFits: WhyThisFitsContent;
  imagineYourJourney: JourneyMomentContent[];
  handoff: HandoffContent;
  imagery: ApprovedImageReference[];
  tradeOff?: TravellerFacingTradeOff;
  evidence: ExplanationEvidence[];
  confidence: ConfidenceRecord;
}
```

A possibility must not appear on Screen 4 if its Story Packet lacks the minimum content required for Screens 5–7.

This prevents travellers from selecting a card that leads to generic, incomplete or incorrect follow-on content.

## 14.4 Screen 5 – Why This Fits You

Screen 5 must use the active Story Packet to display:

- selected destination;
- selected region;
- recommendation personality;
- a personalised opening explanation;
- two to four evidence-backed reasons;
- region-specific rationale; and
- a trade-off note when it would materially help the traveller compare.

For Kerala and Alleppey, reasons may emphasise slow family time, nature and backwater experiences.

For Bali and Ubud, reasons may emphasise reconnection, culture, wellness and nature.

For Dubai, reasons may emphasise celebration, premium comfort, family attractions and entertainment when those needs match the traveller.

The examples must never become static copy applied across destinations.

## 14.5 Screen 6 – Imagine Your Journey

Screen 6 must use the active Story Packet to display destination- and region-specific imagery and memory moments.

For example:

### Kerala – Alleppey

- waking gently on the backwaters;
- watching sunset from a houseboat;
- sharing Kerala cuisine;
- exploring quiet village life.

### Bali – Ubud

- walking through rice terraces;
- experiencing Balinese culture;
- finding calm through wellness;
- sharing a quiet sunset meal.

### Sri Lanka – Bentota and Galle

- unwinding beside the coast;
- exploring historic streets;
- discovering local flavours;
- balancing relaxation with gentle discovery.

Images, captions and experience moments must come from the same active possibility.

Content from different destinations must never be mixed.

## 14.6 Screen 7 – Human Handoff

Screen 7 must preserve the traveller's selected possibility.

The handoff should communicate:

- the selected destination and region;
- why the traveller connected with it;
- that a human Journey Director will help shape the journey;
- a contextual primary call to action; and
- secondary actions such as saving, emailing or exploring another possibility when supported.

Examples include:

> “Let’s shape your Kerala story together.”

> “Let’s turn this Bali possibility into a journey that feels entirely yours.”

The selected `possibilityId` must accompany the handoff so the human Journey Director receives the same context the traveller explored.

## 14.7 Switching Between Possibilities

The traveller must be able to explore another possibility without restarting the Journey Passport.

When a different option is selected:

1. update the active `possibilityId`;
2. replace the content for Screens 5–7 with the new Story Packet;
3. preserve the shortlist and Journey Passport state;
4. reset only destination-specific animation and local progress where necessary; and
5. record exploration behaviour only when the traveller has consented to analytics.

A small persistent switcher or an **Explore Another Possibility** action may support this behaviour.

The product should not frame exploration as indecision.

## 14.8 “This Feels Right” Selection

Exploration does not equal commitment.

The traveller should explicitly choose **This Feels Right** or an approved equivalent before the possibility becomes their preferred handoff context.

If the traveller reaches Screen 7 without making an explicit preference, the handoff may reference the most recently explored possibility while clearly allowing the Journey Director to discuss alternatives.

## 14.9 Dynamic Content Integrity

The implementation must validate that all visible content belongs to the active possibility.

At minimum, automated tests should confirm that:

- destination and region names are consistent across Screens 5–7;
- all images belong to the active destination or region;
- explanation reasons reference evidence from that possibility;
- signature experiences belong to the active region or approved destination context;
- the handoff payload contains the active possibility; and
- switching options replaces all destination-specific content without a full page reload.

---

# 15. Confidence Framework

Confidence indicates whether the engine has enough evidence to present a recommendation responsibly.

It is not the same as the Destination Fit Score.

A high-scoring destination may still have low confidence if critical information is missing.

## 15.1 Confidence Inputs

Confidence should consider:

- Journey Passport completeness;
- strength and consistency of traveller signals;
- destination score;
- region score;
- operational confidence;
- seasonal certainty;
- quantity and quality of explanation evidence;
- unresolved conflicts;
- data freshness; and
- separation between the leading candidates.

## 15.2 Release 1 Thresholds

| Result Type | Minimum Destination Score | Minimum Region Score | Additional Requirement |
| --- | ---: | ---: | --- |
| **The Perfect Match** | 78 | 75 | No unresolved material conflict; strong primary-emotion evidence |
| **A Different Rhythm** | 70 | 68 | Core emotional alignment retained; meaningful diversity established |
| **A Pleasant Surprise** | 68 | 68 | At least two evidence-backed reasons; strong operational confidence |
| **Human Review Candidate** | 60 | 60 | May be considered internally but not automatically presented |
| **Below Recommendation Threshold** | Under 60 | Under 60 | Do not present as a Journey Director possibility |

These values are Release 1 defaults.

They should be calibrated through testing and reviewed traveller outcomes rather than treated as permanent truths.

## 15.3 Confidence Bands

| Confidence Band | Internal Meaning | Product Behaviour |
| --- | --- | --- |
| **High** | Strong, consistent evidence and complete destination knowledge | May be presented automatically after standard validation |
| **Moderate** | Credible fit with limited uncertainty or a transparent trade-off | Present when thresholds pass; preserve trade-off and review metadata |
| **Low** | Missing material data, conflicting signals or weak evidence | Request clarification or human review |
| **Insufficient** | Hard requirements unresolved or no eligible match | Do not recommend; use fallback handling |

Confidence labels are internal by default.

The traveller should receive thoughtful language, not a technical score.

## 15.4 Shortlist Confidence

The shortlist itself must also be evaluated.

A valid three-option shortlist requires:

- one qualified Perfect Match;
- up to two additional candidates meeting their personality thresholds;
- no unresolved hard conflicts;
- complete Story Packets; and
- meaningful differentiation between possibilities.

Where only one or two candidates qualify, the experience should adapt honestly.

## 15.5 Ambiguity Trigger

Human review or clarification should be triggered when:

- primary emotions are unclear or contradictory;
- fixed dates materially weaken every candidate;
- a hard requirement cannot be evaluated;
- the leading candidate scores are unusually close but represent conflicting interpretations;
- destination intent conflicts with operational eligibility;
- no region meets the threshold;
- critical destination knowledge is stale; or
- the engine cannot generate at least two evidence-backed reasons.

---

# 16. Conflict Resolution

Traveller stories may contain preferences that pull in different directions.

Conflict resolution must be predictable, respectful and visible to a Journey Director.

## 16.1 Precedence Order

Release 1 resolves conflicts using the following order.

1. **Safety, legal, accessibility and operational constraints**
2. **Explicit hard traveller requirements and exclusions**
3. **Fixed timing and duration constraints**
4. **Companion suitability and essential comfort needs**
5. **Explicit traveller preferences**
6. **Repeated or strongly evidenced emotional and memory goals**
7. **Derived preferences and cautious inferences**
8. **Destination popularity or broad appeal**

Lower-order preferences cannot override higher-order requirements.

## 16.2 Explicit Statement Over Inference

An explicit traveller statement always overrides a conflicting derived signal.

If a traveller selects adventure but writes, “We do not want physically demanding activities,” the engine should interpret adventure as discovery or novelty rather than strenuous activity.

It must not recommend a physically demanding region based on the label alone.

## 16.3 Essential Need Over Theme Count

A destination matching five minor themes should not outrank a destination that strongly satisfies the traveller's central emotional need and all essential constraints.

The weighted model and evidence hierarchy should protect depth of fit over superficial tag coverage.

## 16.4 Companion Conflict

When members of a travelling party appear to have different needs, the engine should favour regions capable of supporting balance.

For example:

- a multi-generation family may need calm logistics alongside varied experiences;
- parents seeking relaxation and children seeking activity may benefit from a region supporting both without constant transfers; or
- friends combining nightlife and wellness may need a region or paired stay that preserves choice.

Where no responsible compromise exists, the engine should request clarification rather than silently choosing one traveller's preference.

## 16.5 Destination Certainty Conflict

If the traveller names a destination that conflicts with their stated journey needs, the engine should not reject the choice dismissively.

It should:

1. search for a better-fitting region within the requested active destination;
2. explain any material trade-off;
3. offer related possibilities when the traveller is open to them; and
4. invite human discussion when the choice remains important to the traveller.

## 16.6 Timing Conflict

When the desired destination is not suitable for fixed dates:

- do not conceal the conflict;
- do not recommend it as The Perfect Match;
- offer an active alternative capable of creating a similar emotional outcome; and
- allow a Journey Director to review whether a responsible version remains possible.

## 16.7 Unresolved Conflict

Unresolved material conflicts lower confidence and must be recorded in the Decision Trace.

They must never be erased merely because the scoring model produced a numerical winner.

---

# 17. Fallback Handling

Fallbacks preserve trust when the Decision Engine cannot responsibly create the ideal three possibilities.

## 17.1 No Eligible Destinations

When no destination passes hard eligibility filters, the engine must not display an empty or fabricated recommendation.

The experience should transition to a human-led message such as:

> “Your journey deserves a little more thought. A Journey Director would like to review what you shared and help identify the right possibility.”

The internal handoff must include the failed constraints and excluded candidates.

## 17.2 Only One Qualified Possibility

Present the qualified possibility only when it is genuinely useful and sufficiently confident.

Do not create weak alternatives.

The experience may say:

> “One journey stood out especially clearly. We would also love to explore it with you before you decide.”

## 17.3 Only Two Qualified Possibilities

Present two possibilities with their appropriate personalities.

Do not imply that a third option is loading, missing or withheld.

## 17.4 Requested Destination Is Not Served

When a traveller requests a `COMING_SOON`, `INACTIVE` or unsupported destination:

- acknowledge the intention behind the request;
- do not present the unavailable destination as a recommendation;
- identify active destinations that can create a similar emotional or thematic experience;
- explain that Search My Vacation recommends only journeys it can confidently deliver; and
- offer human conversation if the traveller wishes to discuss the original destination.

Suggested language:

> “The journey you described points to dramatic nature and meaningful discovery. We do not currently curate that destination, so we have looked for active possibilities that create a similar feeling and that our Journey Directors know well.”

## 17.5 Incomplete Journey Passport

If required fields are missing, the engine should request only the minimum clarification necessary.

It should not force the traveller to repeat the complete Passport.

If inspiration-stage recommendations remain responsible, the engine may present them at reduced confidence with an invitation to refine.

## 17.6 Unknown Timing

When timing is unknown:

- use season-neutral matching where possible;
- do not claim that a destination is ideal for the traveller's dates;
- mark timing suitability as unresolved internally; and
- invite the Journey Director to validate seasonality during planning.

## 17.7 Missing Region Intelligence

A destination without sufficient regional intelligence should not be presented as a fully personalised possibility.

The system should prefer a destination with a strong region match or route the candidate for content review.

## 17.8 Content or Image Failure

If a Story Packet is incomplete or destination imagery cannot be loaded:

- do not mix in content from another possibility;
- use an approved destination-level fallback asset only when it belongs to the same destination;
- preserve accessible text and the recommendation rationale;
- log the content failure; and
- allow the traveller to continue or explore another possibility.

## 17.9 System Failure

When decisioning fails technically, the user should receive a calm human fallback, not an error trace.

The Journey Passport submission should be preserved where consent and system design permit, and a Journey Director handoff should contain enough context to continue without asking the traveller to start again.

---

# 18. Manual Journey Director Override

Human override is an intentional part of Release 1.

It is not a workaround.

## 18.1 Permitted Override Actions

A Journey Director may:

- suppress a candidate;
- promote a qualified candidate;
- replace a recommendation personality;
- select a different region within an eligible destination;
- refine explanation copy while preserving evidence;
- add a transparent trade-off;
- request traveller clarification;
- reduce the shortlist to one or two possibilities; or
- hold all recommendations for further review.

## 18.2 Prohibited Overrides

A Journey Director may not:

- recommend a `COMING_SOON` or `INACTIVE` destination as though it were active;
- bypass a confirmed safety, legal or accessibility constraint;
- invent destination capabilities;
- remove a material trade-off solely to improve conversion;
- use sensitive assumptions;
- substitute a commercially preferred destination without traveller-fit evidence; or
- change operational status through the recommendation interface.

Operational eligibility changes require the separate Destination Knowledge Base governance process.

## 18.3 Override Record

Every material override must record:

- original recommendation;
- updated recommendation;
- Journey Director identity;
- timestamp;
- reason code;
- optional explanation;
- affected destination or region;
- rule version;
- Destination Knowledge Base version; and
- whether the override revealed a data or rule-quality issue.

## 18.4 Override Reason Codes

Recommended Release 1 reason codes include:

- traveller context not captured;
- destination knowledge outdated;
- operational update pending;
- companion or accessibility nuance;
- season or duration nuance;
- region preference refinement;
- explanation quality improvement;
- duplicate or insufficient diversity;
- traveller clarification received; and
- other, with mandatory note.

## 18.5 Learning From Overrides

Overrides should be reviewed as product evidence.

Repeated overrides may indicate:

- missing Journey Passport inputs;
- inaccurate destination attributes;
- inappropriate scoring weights;
- incomplete regional intelligence;
- weak confidence thresholds; or
- explanation templates that do not sound human.

Overrides must inform governance before they inform automation.

---

# 19. Release 1 Implementation Approach

Release 1 should be deterministic, configuration-driven and human-reviewable.

The goal is not to simulate intelligence.

The goal is to make the agreed product logic reliable, inspectable and easy to refine.

## 19.1 Recommended Architecture

Release 1 may use TypeScript modules with clear separation between:

- Journey Passport data;
- controlled taxonomies;
- destination and region knowledge;
- operational eligibility configuration;
- scoring weights and thresholds;
- decision functions;
- explanation templates;
- Story Packet assembly; and
- Journey Director presentation components.

Conceptual structure:

```text
journey-director/
├── model/
│   ├── traveller-signals.ts
│   ├── destination.ts
│   ├── recommendation.ts
│   └── decision-trace.ts
├── data/
│   ├── destinations.ts
│   ├── taxonomies.ts
│   └── operational-status.ts
├── engine/
│   ├── normalize-passport.ts
│   ├── eligibility.ts
│   ├── score-destination.ts
│   ├── score-region.ts
│   ├── assign-personalities.ts
│   ├── confidence.ts
│   └── build-story-packet.ts
├── content/
│   ├── explanation-templates.ts
│   └── approved-imagery.ts
└── ui/
    └── reusable Journey Director components
```

This structure is illustrative rather than prescriptive.

The central requirement is separation of knowledge, logic and presentation.

## 19.2 Deterministic Pipeline

Release 1 should behave conceptually as follows.

```ts
function recommendJourneys(
  passport: JourneyPassport,
  knowledgeBase: DestinationKnowledgeBase,
  rules: DecisionRules
): DecisionResult {
  const traveller = normalizePassport(passport, rules.taxonomies);
  const eligible = applyEligibilityFilters(
    knowledgeBase.destinations,
    traveller,
    rules.operationalPolicy
  );

  const candidates = eligible
    .map((destination) => scoreDestination(destination, traveller, rules))
    .map((candidate) => selectBestRegion(candidate, traveller, rules))
    .filter((candidate) => candidate.regionIsQualified);

  const ranked = rankCandidates(candidates, rules);
  const possibilities = assignRecommendationPersonalities(
    ranked,
    traveller,
    rules
  );

  const assessed = assessConfidence(possibilities, traveller, rules);
  const storyPackets = assessed.presentable.map((possibility) =>
    buildStoryPacket(possibility, traveller, knowledgeBase, rules)
  );

  return buildDecisionResult(storyPackets, assessed, traveller, rules);
}
```

## 19.3 Pure Decision Functions

Where practical, scoring and eligibility functions should be pure.

Given the same inputs and versions, they should return the same result.

This improves:

- testing;
- debugging;
- auditability;
- weight calibration;
- safe refactoring; and
- comparison between future engine versions.

## 19.4 Versioning

Every Decision Result should record:

- Journey Passport schema version;
- Destination Knowledge Base version;
- Decision Engine rules version;
- content-template version;
- operational snapshot identifier;
- generated timestamp; and
- any manual override version.

This allows Search My Vacation to reproduce why a recommendation was made.

## 19.5 Decision Trace

The internal Decision Trace should include:

- normalised traveller signals and evidence;
- eligible and excluded destinations;
- exclusion reasons;
- dimension scores;
- penalties;
- region scores;
- personality assignment reasons;
- confidence assessment;
- unresolved trade-offs;
- generated Story Packet references; and
- manual changes.

The Decision Trace is an internal quality tool.

It must not expose sensitive data or technical scoring to travellers.

## 19.6 Content Data Requirements

The UI must not contain hard-coded destination stories.

Destination-specific content belongs in approved data or content structures referenced by the Story Packet.

This includes:

- Screen 4 card content;
- Screen 5 explanations;
- Screen 6 imagery and memory moments;
- Screen 7 contextual handoff copy; and
- any emailed or saved recommendation summary.

## 19.7 Performance

Release 1 decisioning should complete quickly enough to support the intended Journey Director transition.

The cinematic pause must never conceal unnecessarily slow or unreliable processing.

Recommended product target:

- deterministic matching and Story Packet assembly should normally complete in under one second in the local application environment; and
- any deliberate arrival animation may proceed independently while the result is prepared and validated.

If the result is not ready at the end of the designed transition, the interface should continue with calm progress messaging and preserve accessibility.

## 19.8 Accessibility

Dynamic recommendation content must remain accessible.

Implementation should ensure:

- screen changes are announced appropriately;
- animations respect reduced-motion preferences;
- destination imagery has meaningful alternative text;
- the possibility switcher is keyboard accessible;
- focus moves predictably when the active possibility changes;
- content is not distinguished by colour alone; and
- the traveller can understand and operate Screens 5–7 without animation.

## 19.9 Release 1 Acceptance Criteria

Release 1 is complete when:

- only eligible active destinations can appear;
- the same input and versioned data produce the same ranking;
- up to three qualified personalities can be assigned;
- every possibility includes a qualified region or approved fallback state;
- every displayed claim has evidence;
- incomplete Story Packets are blocked;
- Screens 5–7 change completely when the active possibility changes;
- the reusable layout remains unchanged across destinations;
- the traveller can explore another possibility without restarting;
- manual overrides are recorded;
- fallbacks work for insufficient recommendations; and
- the complete flow passes the testing scenarios in this specification.

---

# 20. Future AI-Assisted Evolution

AI may help the Journey Director become more perceptive and expressive.

It must not weaken the operational boundaries or explainability established in Release 1.

## 20.1 Appropriate Future Uses

AI may assist with:

- extracting emotions, themes and memory goals from free text;
- recognising nuanced or conflicting traveller intent;
- suggesting evidence-backed explanation phrasing;
- identifying gaps in destination knowledge;
- surfacing similar past decision patterns using consented, de-identified data;
- helping a human Journey Director compare close candidates;
- proposing region or experience combinations from approved knowledge; and
- adapting tone and narrative length without changing factual meaning.

## 20.2 Responsibilities That Remain Deterministic

The following should remain enforced outside generative AI:

- destination status;
- operational eligibility;
- explicit exclusions;
- safety and accessibility constraints;
- scoring thresholds;
- permitted destination and region identifiers;
- content-source validation;
- final Story Packet schema;
- decision versioning; and
- override logging.

AI must never be able to reactivate or recommend an ineligible destination through persuasive language.

## 20.3 Grounded Generation

AI-generated explanations must be grounded only in:

- the traveller's consented Journey Passport evidence;
- the selected destination and region records;
- approved signature experiences;
- current operational notes permitted for traveller use; and
- the assigned recommendation personality.

Generated copy should be validated against the Story Packet before display.

## 20.4 AI Confidence and Human Review

AI confidence must not substitute for product confidence.

When AI interpretation materially changes traveller signals, selects between conflicting needs or introduces a novel recommendation rationale, the system should preserve the interpretation and allow human review.

## 20.5 Learning Boundaries

Future learning systems may improve weights and patterns only through governed data.

They must not optimise solely for clicks, conversions or commercially preferred destinations.

Recommended outcomes should include:

- traveller resonance;
- human Journey Director acceptance;
- recommendation diversity;
- low override rates for the right reasons;
- operational fulfilment quality; and
- post-journey satisfaction.

## 20.6 Explainability

Even when AI assists, Search My Vacation must be able to reconstruct:

- which traveller signals mattered;
- which destinations were eligible;
- why the selected region fit;
- why each personality was assigned;
- which evidence supported the explanation; and
- what a human changed.

The traveller-facing story may remain beautifully simple.

The internal reasoning must remain inspectable.

---

# 21. Governance

The Decision Engine is a living product system.

Its quality depends on disciplined stewardship across Product, Experience, Operations and Technology.

## 21.1 Ownership

Recommended ownership responsibilities:

| Area | Accountable Owner | Responsibility |
| --- | --- | --- |
| Product principles and thresholds | Product & Experience | Protect traveller-first decision policy |
| Destination and region knowledge | Destination Operations | Maintain accurate, current destination intelligence |
| Operational status | Operations Leadership | Approve activation, suppression and readiness |
| Scoring and implementation | Product Engineering | Implement deterministic, testable rules |
| Explanation voice | Content & Experience | Maintain warm, evidence-backed traveller language |
| Manual review and overrides | Journey Directors | Apply professional judgement and record rationale |
| Privacy and sensitive data | Designated governance owner | Ensure lawful, consented and minimal data use |
| Quality assurance | Product QA | Validate rules, content integrity and regressions |

## 21.2 Change Categories

Changes should be classified as:

- **Knowledge change:** destination, region, season or experience data;
- **Operational change:** status, availability or service confidence;
- **Rule change:** weight, threshold, penalty, tie-break or personality logic;
- **Content change:** explanation template, approved imagery or handoff copy;
- **Schema change:** Journey Passport, destination or Story Packet structure; or
- **Experience change:** layout, interaction or screen behaviour.

Each category requires targeted review and testing.

## 21.3 Review Cadence

Recommended minimum cadence:

- operational status: reviewed whenever service conditions change;
- active destination knowledge: reviewed at least quarterly;
- seasonal information: reviewed before relevant selling seasons;
- scoring and thresholds: reviewed after every meaningful pilot dataset and at least twice yearly;
- manual override patterns: reviewed monthly during early releases;
- explanation templates and imagery: reviewed quarterly; and
- full Decision Engine specification: reviewed at every major release.

## 21.4 Activation Governance

A destination may move from `COMING_SOON` to `ACTIVE` only after Operations confirms readiness and all required Destination Knowledge Base fields are complete.

Activation should require:

- named operational ownership;
- acceptable service confidence;
- verified region intelligence;
- reviewed seasonality;
- signature experiences;
- traveller suitability;
- approved imagery and Story Packet content readiness; and
- regression tests.

## 21.5 Rule Change Governance

Weights and thresholds must not be adjusted based on a single anecdote.

Every rule change should record:

- the problem observed;
- evidence supporting the change;
- expected impact;
- affected scenarios;
- before-and-after test results;
- approval; and
- effective rules version.

## 21.6 Auditability and Retention

Decision traces and override records should be retained only as long as required for product quality, support and applicable legal obligations.

Personally identifiable information should be minimised.

Governance reporting should use aggregated or de-identified data wherever possible.

## 21.7 Bias and Portfolio Review

Search My Vacation should periodically review whether the engine:

- over-recommends a small subset of destinations;
- under-recommends destinations because their knowledge records are incomplete;
- confuses popularity with suitability;
- produces stereotyped companion recommendations;
- favours international or premium journeys without evidence;
- assigns A Pleasant Surprise randomly rather than meaningfully; or
- creates hidden commercial bias.

Portfolio diversity should never be forced at the expense of individual traveller fit.

---

# 22. Testing Strategy and Scenarios

Testing must validate the product decision, not only the code path.

Every test should inspect eligibility, ranking, region selection, personality assignment, explanation evidence, confidence and dynamic content integrity.

## 22.1 Test Layers

### Unit Tests

Validate individual functions such as:

- signal normalisation;
- hard-filter behaviour;
- dimension scoring;
- penalties;
- region scoring;
- tie-breaking;
- confidence assessment; and
- Story Packet validation.

### Contract Tests

Validate compatibility between:

- Journey Passport and Traveller Signal Profile;
- Destination Knowledge Base and candidate model;
- Decision Result and Journey Director UI; and
- Story Packet and Screens 4–7.

### Scenario Tests

Use realistic traveller stories to validate the full pipeline.

### Content Integrity Tests

Ensure that explanations, imagery and experiences remain attached to the correct destination and region.

### Journey Director Review

Human Journey Directors should review whether the output feels credible, helpful and explainable.

## 22.2 Core Release 1 Scenarios

| Scenario | Traveller Signals | Expected Decision Behaviour |
| --- | --- | --- |
| **1. Relaxed family reconnection** | Family, nature, slow pace, balanced comfort, meaningful time | Strong calm-nature candidates; region such as Alleppey may outrank busier Kerala regions; all reasons tied to family time and pace |
| **2. Bali regional precision** | Couple, wellness, culture, nature, reconnection | Bali may qualify; Ubud should outrank a nightlife-led region when season and operations permit |
| **3. Premium celebration** | Family or couple, celebration, shopping, premium comfort, attractions | Dubai may qualify strongly; explanation must reference stated celebration and comfort needs rather than generic luxury claims |
| **4. Quiet Thailand** | Couple, relaxation, islands, quiet evenings | A calm region such as Krabi should be considered ahead of a nightlife-led region when maintained data supports it |
| **5. Multi-generation family** | Children, parents, senior travellers, balanced pace, low transfer appetite | Candidates with manageable logistics and varied experiences should rise; high-movement regions should be penalised or excluded |
| **6. Wildlife and photography** | Family or couple, discovery, nature, wildlife, premium comfort | An active wildlife region such as Kabini may qualify; region choice must use maintained safari and companion guidance |
| **7. Requested unsupported destination** | Traveller asks for Japan while status is `COMING_SOON` | Japan must be excluded; active alternatives should reflect the underlying culture, wonder or discovery need; transparent fallback language required |
| **8. Fixed timing conflict** | Traveller requests a destination during a period marked not recommended | Candidate excluded or downgraded according to hard seasonal policy; alternatives should preserve emotional intent |
| **9. Conflicting pace signals** | Selects adventure but explicitly asks to avoid rushing and strenuous activity | Explicit clarification should shape “adventure” as gentle discovery; strenuous regions must not be inferred |
| **10. Only one qualified result** | Narrow requirements leave one candidate above threshold | Present one honest possibility; do not manufacture Different Rhythm or Pleasant Surprise |
| **11. Incomplete Passport** | No clear emotion, timing or style | Request minimal clarification or human review; do not present a false Perfect Match |
| **12. Pleasant Surprise validity** | Traveller is open, seeks coast, culture and gentle discovery but names no destination | Surprise candidate must meet thresholds and have at least two evidence-backed reasons; novelty alone is insufficient |
| **13. Explicit destination, different region** | Traveller names Bali and describes quiet wellness | Honour destination intent where active, recommend the region that fits; show a trade-off only if needed |
| **14. Accessibility requirement** | Explicit mobility need | Any incompatible region must be excluded; unknown accessibility data triggers review rather than assumption |
| **15. Dynamic possibility switching** | Traveller explores Kerala, then Bali | Screens 5–7 must replace explanations, images, moments and handoff copy with Bali content while layout and Passport state remain unchanged |
| **16. Manual override** | Journey Director changes selected region due to current operational nuance | Override is allowed only within eligibility, logged with reason, and reflected consistently in the Story Packet |

## 22.3 Personality Tests

For every three-option result, verify:

- The Perfect Match has the strongest defensible overall alignment.
- A Different Rhythm preserves the central emotion while differing meaningfully.
- A Pleasant Surprise is less obvious but not weaker than its threshold.
- labels do not imply gold, silver and bronze;
- no destination appears twice without an approved reason; and
- each option has a complete and distinct explanation.

## 22.4 Dynamic Screens 5–7 Tests

The following tests are mandatory:

1. Selecting a possibility updates the active `possibilityId`.
2. Screen 5 uses only that possibility's destination, region and evidence.
3. Screen 6 uses only that possibility's approved imagery and moments.
4. Screen 7 carries the same possibility into the human handoff.
5. Switching possibilities replaces all destination-specific content.
6. The layout, focus order, semantics and responsive behaviour remain unchanged.
7. No stale copy or image from the previous possibility remains visible or accessible.
8. The traveller can return to the shortlist without losing Passport state.
9. **This Feels Right** records an explicit preference separately from exploration.
10. Saved or emailed recommendations match the selected possibility.

## 22.5 Regression Dataset

Search My Vacation should maintain a versioned set of representative, de-identified Journey Passports with approved expected outcomes.

Before any change to weights, thresholds, destination knowledge or schemas, the engine should compare:

- previous ranking;
- new ranking;
- eligibility changes;
- personality changes;
- region changes;
- explanation changes; and
- confidence changes.

Unexpected changes require review before release.

## 22.6 Quality Signals

Release evaluation may monitor:

- percentage of results requiring manual override;
- percentage of travellers exploring more than one possibility;
- percentage selecting **This Feels Right**;
- Journey Director acceptance of recommended destination and region;
- reasons for suppression or override;
- fallback frequency;
- incomplete Story Packet frequency;
- content mismatch defects;
- traveller feedback on feeling understood; and
- post-journey satisfaction when available and consented.

Conversion may be observed, but it must not become the only definition of recommendation quality.

---

# 23. Decision Examples

The examples below illustrate the framework.

They do not replace current Destination Knowledge Base records or operational review.

## 23.1 Example A – Family Reconnection

### Journey Passport Signals

- Multi-generation family
- Reconnection and relaxation
- Nature
- Relaxed pace
- Balanced to premium comfort
- Wants memories rather than a busy checklist
- Flexible timing

### Possible Result

#### The Perfect Match – Kerala, Alleppey

Closest alignment through slow backwater experiences, family time and gentle nature.

#### A Different Rhythm – Bali, Ubud

The same need for reconnection expressed through culture, wellness and tropical nature.

#### A Pleasant Surprise – Sri Lanka, Bentota and Galle

A less obvious combination of coast, heritage and comfortable family discovery.

### Why the Result Is Valid

- all destinations are active;
- each supports the central emotional need;
- each creates a different journey expression;
- regions are specific;
- comfort and companion needs remain credible; and
- every explanation can be grounded in traveller and destination evidence.

## 23.2 Example B – Bali Without Kuta

### Journey Passport Signals

- Couple
- Bali already considered
- Culture, nature and wellness
- Reconnection
- Relaxed pace
- Premium comfort

### Region Decision

Ubud should score strongly because its maintained emotional and theme profile expresses culture, nature, wellness and a slower rhythm.

A nightlife-led region should receive a strong preference-conflict penalty unless the traveller also expressed interest in nightlife.

Nusa Dua may remain an internal alternative when premium resort calm is more important than cultural immersion.

### Explanation Evidence

The engine may say:

> “Because you are looking for reconnection through nature, wellness and culture, we would begin with Ubud rather than a busier beach area.”

It may not say:

> “Ubud is always better than Kuta.”

The first statement is personalised and evidence-backed.

The second is an unsupported universal judgement.

## 23.3 Example C – Unsupported Destination

### Journey Passport Signals

- Traveller requests Japan
- Seeks wonder, culture, food and seasonal beauty
- Comfortable with a balanced pace

### Decision Behaviour

Japan is excluded while `COMING_SOON`.

The engine preserves the traveller's underlying signals and searches active destinations for credible expressions of culture, food, wonder and discovery.

The traveller receives transparent language explaining that Search My Vacation only recommends destinations it can currently deliver with confidence.

The unavailable destination must not appear as A Pleasant Surprise or in Screen 6 imagery.

---

# 24. Stewardship Questions

Before approving a Decision Engine change, recommendation rule or new destination activation, ask:

## Traveller Understanding

- Does the decision begin with what the traveller actually shared?
- Are explicit preferences distinguished from cautious inference?
- Have we preserved the traveller's own evidence?
- Are we avoiding stereotypes and sensitive assumptions?
- Would the traveller recognise themselves in the reflection?

## Recommendation Quality

- Does every possibility satisfy operational eligibility?
- Is The Perfect Match genuinely the closest fit?
- Does A Different Rhythm preserve the emotional need while changing the expression?
- Is A Pleasant Surprise credible rather than random?
- Are we presenting fewer, better possibilities?
- Can we explain why each destination moved forward and why another did not?

## Region Intelligence

- Are we recommending the most meaningful city, area or region?
- Does the region reflect the desired pace, emotion and companions?
- Are we choosing Ubud over a busier region for the right traveller-specific reasons rather than applying a universal rule?
- Is regional knowledge current and operationally verified?

## Dynamic Experience

- Does selecting a possibility drive everything from Screen 5 onward?
- Do Screen 5 explanations belong to the active destination and region?
- Do Screen 6 imagery and moments belong to the same possibility?
- Does Screen 7 preserve the selected context for human handoff?
- Does the layout remain reusable and unchanged while the story changes?
- Can the traveller explore another possibility without losing progress?

## Trust and Operations

- Can Search My Vacation confidently deliver every displayed journey?
- Have unavailable destinations been excluded regardless of fit?
- Are timing, accessibility and duration constraints respected?
- Are material trade-offs visible rather than hidden?
- Is the handoff to a human Journey Director clear and intentional?

## Governance

- Can this result be reproduced from versioned inputs?
- Is the scoring change supported by evidence?
- Have regression scenarios been reviewed?
- Are manual overrides recorded and analysed?
- Would we be comfortable explaining this recommendation to the traveller?

If the answer to the final question is no, the recommendation is not ready.

---

# 25. Closing Principle

The Journey Director should never behave as though travel has one correct answer.

The traveller has shared a story.

The Decision Engine listens for what matters within that story, protects the boundaries of what Search My Vacation can deliver, and reveals a small number of journeys that express those needs in different ways.

One may feel immediately familiar.

One may offer a different rhythm.

One may become a pleasant surprise.

The traveller remains free to explore.

The Journey Director remains ready to guide.

And when a possibility is selected, the experience becomes entirely about that story:

> **From Screen 5 onward, the selected destination and region dynamically drive every explanation, image, experience and handoff—while one calm, reusable layout remains unchanged.**

That is how Search My Vacation guides without selling.

That is how the Journey Director turns destination knowledge into personal discovery.

---

# 26. Revision History

| Version | Date | Owner | Description |
| --- | --- | --- | --- |
| v1.0 | 21 July 2026 | Search My Vacation – Product & Experience | Initial approved specification defining deterministic Journey Passport matching, operational eligibility, destination and region scoring, recommendation personalities, dynamic Screens 5–7, human override, Release 1 implementation and future AI-assisted evolution. |
