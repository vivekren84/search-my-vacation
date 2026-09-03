# Destination Knowledge Base

> **Search My Vacation — Product Intelligence Specification**

| Document field | Value |
| --- | --- |
| **Document** | `DESTINATION-KNOWLEDGE-BASE.md` |
| **Version** | v1.0.1 |
| **Status** | Approved for Release 1 implementation |
| **Owner** | Search My Vacation — Product & Experience |
| **Module** | Journey Director |
| **Last updated** | 22 July 2026 |
| **Purpose** | Define the destination intelligence, operating boundaries, classification system, region-level guidance, and recommendation principles used by the Journey Director. |
| **Audience** | Product managers, Journey Directors, journey designers, UX designers, engineers, content strategists, operations leaders, and future custodians of the recommendation engine. |

---

## Contents

1. [Document Purpose](#1-document-purpose)
2. [The Destination Knowledge Promise](#2-the-destination-knowledge-promise)
3. [Product Vision](#3-product-vision)
4. [Product Philosophy](#4-product-philosophy)
5. [Experience Principles](#5-experience-principles)
6. [Recommendation Framework](#6-recommendation-framework)
7. [Destination Intelligence Model](#7-destination-intelligence-model)
8. [Controlled Vocabulary](#8-controlled-vocabulary)
9. [Region Intelligence](#9-region-intelligence)
10. [Domestic Destination Portfolio](#10-domestic-destination-portfolio)
11. [International Destination Portfolio](#11-international-destination-portfolio)
12. [Coming Soon Portfolio](#12-coming-soon-portfolio)
13. [Recommendation Rules](#13-recommendation-rules)
14. [Content and Narrative Guidelines](#14-content-and-narrative-guidelines)
15. [Governance, Quality, and Roadmap](#15-governance-quality-and-roadmap)
16. [Stewardship Questions](#16-stewardship-questions)
17. [Revision History](#17-revision-history)

---

# 1. Document Purpose

The Destination Knowledge Base is the product intelligence layer behind the Search My Vacation Journey Director.

It gives the organisation one shared understanding of:

- which destinations Search My Vacation currently serves;
- which destinations must remain hidden until operational readiness is confirmed;
- the emotional character of every active destination;
- the regions, cities, or areas that best deliver different kinds of journeys;
- the traveller types, themes, comfort levels, and travel pace each destination supports;
- the rules that turn destination knowledge into trustworthy recommendations.

This document is the business source of truth for destination recommendation behaviour.

It is deliberately implementation-independent. The deterministic Release 1 engine, a human Journey Director refining the selected direction, and a future AI-assisted engine should all apply destination knowledge according to the same principles.

This document does not replace live operational checks. Air access, hotel availability, weather, permits, visa rules, safety conditions, attraction closures, and commercial readiness must be validated before a recommendation becomes a confirmed journey.

> **The Knowledge Base identifies what may be a strong fit. The human Journey Director confirms what can be responsibly delivered for the guest's dates and circumstances.**

---

# 2. The Destination Knowledge Promise

The Destination Knowledge Base is not a catalogue of places.

It is the collective travel intelligence that powers the Journey Director.

Its purpose is not merely to store destinations.

Its purpose is to understand destinations deeply enough to recommend experiences that feel intentional, personal, and trustworthy.

Every destination exists for a reason.

Every region has a personality.

Every recommendation must have an explanation.

When a traveller receives a recommendation, they should feel:

> **“This is not simply somewhere I can travel. This feels like somewhere chosen for me.”**

A technically valid recommendation that lists popular places without connecting them to the traveller has failed.

A recommendation that reflects the traveller's story, narrows the choice thoughtfully, and can be confidently delivered has succeeded.

Release 1 therefore makes six commitments:

1. Recommend only destinations that Search My Vacation currently serves.
2. Begin with the experience the traveller wants, not with destination inventory.
3. Recommend the most meaningful region, city, or area within a destination.
4. Explain every recommendation in language connected to the traveller.
5. Use deterministic recommendation logic to generate **The Perfect Match**, **The Beautiful Puzzle**, and **The Hidden Gem**, subject to documented confidence and fallback rules.
6. Preserve human judgement for consultation, refinement, itinerary design, and the final traveller handoff before any recommendation becomes a promise.

---

# 3. Product Vision

## 3.1 Why this Knowledge Base exists

Traditional travel websites begin with inventory.

They present destinations, hotels, activities, and prices, leaving the traveller to decide what might fit.

That approach serves travellers who already know exactly where they want to go. It is far less helpful to people who know how they want to feel but do not yet know where that feeling lives.

Search My Vacation follows a different belief:

> **Meaningful journeys begin with understanding the traveller, not searching the inventory.**

The Knowledge Base translates that belief into repeatable destination intelligence.

Instead of asking only:

> “Which destinations do we sell?”

it asks:

> “Which place within our active portfolio can best create the experience this traveller hopes to remember?”

This shift turns destination selection into thoughtful guidance.

## 3.2 Problems it solves

### Travellers often know the feeling before the place

Journeys commonly begin with statements such as:

- “I need a real break.”
- “We want to celebrate.”
- “I want my parents to experience something unforgettable.”
- “We need time together without rushing.”
- “I want to see something completely different.”

The Journey Director should translate those intentions into suitable possibilities.

### A country or state is often too broad

“Bali” does not distinguish the calm, cultural rhythm of Ubud from the polished beach comfort of Nusa Dua or the dining and evening energy of Seminyak.

“Kerala” does not distinguish Munnar's tea-covered hills from Kumarakom's quiet backwaters or Fort Kochi's heritage character.

Region intelligence makes the recommendation useful.

### Generic recommendations weaken trust

If different travellers receive the same list, the Journey Passport becomes decorative rather than meaningful.

The Knowledge Base ensures that each recommendation can be traced back to the traveller's emotions, companions, pace, themes, and comfort preferences.

### Operational reality matters

A beautiful recommendation is not valuable if Search My Vacation cannot confidently deliver it.

The recommendation system must optimise for suitability **and** operational readiness. A place with strong emotional fit but an ineligible status cannot enter the guest-facing shortlist.

## 3.3 Difference from an Online Travel Agency

| Traditional OTA | Search My Vacation Journey Intelligence |
| --- | --- |
| Begins with inventory | Begins with traveller intent |
| Optimises search results | Optimises recommendation quality |
| Treats destinations as products | Treats destinations as distinct experiences |
| Presents broad places | Selects a destination and its best-fit region |
| Focuses primarily on availability | Balances suitability with deliverability |
| Rewards volume of choice | Rewards confidence and clarity |
| Describes the destination | Explains why the destination suits the traveller |
| Drives directly toward transaction | Builds trust before planning |

## 3.4 Relationship with the Journey Passport

The Journey Passport understands the traveller.

The Destination Knowledge Base understands the destinations.

The Journey Director connects the two.

| Product asset | Primary question |
| --- | --- |
| **Journey Passport** | Who is this traveller, and what are they hoping to feel or remember? |
| **Destination Knowledge Base** | Which active destinations and regions can credibly deliver that experience? |
| **Decision Engine** | How should the eligible possibilities be scored, compared, and selected? |
| **Journey Director Experience** | How should the recommendation be explained with warmth and confidence? |

## 3.5 Release philosophy

Release 1 uses deterministic recommendation logic to generate three journey possibilities: **The Perfect Match**, **The Beautiful Puzzle**, and **The Hidden Gem**. A human Journey Director remains responsible for consultation, refinement, itinerary design, and the final traveller handoff.

Future releases may use AI to assist with matching, trade-off analysis, and narrative creation.

The interface may evolve. The reasoning standard should not.

Technology supports judgement.

It does not remove accountability.

---

# 4. Product Philosophy

## 4.1 Emotion first

The Journey Director begins with the emotional outcome the traveller seeks.

Destination follows emotion.

Region follows destination.

Experience follows region.

Planning follows inspiration.

## 4.2 Recommend only what Search My Vacation can deliver

Every recommendation carries the reputation of Search My Vacation.

The Journey Director must never recommend a destination whose operational status is not `ACTIVE`.

Having a DMC contact, a possible itinerary, or future intent does not make a destination active.

Operational confidence is more valuable than the appearance of unlimited choice.

## 4.3 Recommend at the most meaningful level

A destination name is the beginning of a recommendation, not the conclusion.

Where region intelligence exists, the Journey Director should identify the city, town, island, neighbourhood, or landscape that best matches the traveller.

> **Bali → Ubud** for reconnection, wellness, culture, and a slower rhythm.

> **Bali → Nusa Dua** for resort-led comfort, calm beaches, and an easy premium family or couple experience.

> **Bali → Seminyak** for dining, shopping, beach sunsets, and lively evenings.

## 4.4 Explain every recommendation

The recommendation should never appear arbitrary.

The Journey Director must be able to answer:

> **“Why this destination, why this region, and why for this traveller?”**

If the connection cannot be explained clearly, the recommendation should not be presented.

## 4.5 Prefer fewer, stronger possibilities

The Journey Director is not a search-results page.

Release 1 generates three differentiated journey possibilities when each candidate satisfies its confidence and evidence requirements:

1. **The Perfect Match** — the strongest overall alignment;
2. **The Beautiful Puzzle** — the same central need expressed through a meaningfully different journey; and
3. **The Hidden Gem** — a less obvious but well-supported possibility the traveller may not have considered.

When the governed portfolio cannot support three responsible results, the documented fallback may present fewer. Three weak recommendations are not better than one strong recommendation.

## 4.6 Preserve imagination before administration

Budget, dates, flight schedules, availability, visa rules, and transfer time are essential.

They should refine an inspired possibility, not erase the traveller's story from the conversation.

The Journey Director first identifies emotional and experiential fit. It then applies feasibility and operational validation before anything is promised.

## 4.7 Be honest about trade-offs

No destination is perfect for every preference.

A premium resort may offer ease but less local immersion.

A remote landscape may offer wonder but require longer transfers.

A vibrant city may offer food and discovery but not serenity.

Thoughtful guidance includes these trade-offs without diminishing the recommendation.

---

# 5. Experience Principles

## 5.1 Every destination has a personality

Every destination must have:

- one primary emotion;
- supporting emotions;
- a clear destination personality;
- relevant journey themes;
- suitable traveller profiles;
- supported comfort levels;
- a natural travel pace;
- region-level distinctions;
- signature experiences;
- meaningful cautions or trade-offs.

## 5.2 Every recommendation has a reason

The explanation should reflect the traveller's aspirations rather than repeat generic destination copy.

**Generic**

> Bali has temples, beaches, and rice terraces.

**Journey Director**

> Because you are looking for time to slow down, reconnect, and experience local culture without rushing, Ubud gives your Bali journey the calm and meaning you described.

## 5.3 Regions are not interchangeable

The same destination may support very different journeys.

The region selected must reflect the guest's desired pace, themes, companions, and comfort.

## 5.4 Suitability guides; it does not stereotype

Traveller profiles are recommendation aids, not exclusions.

“Best for couples” does not mean “not for families.”

The Journey Director should interpret the full story and avoid assumptions based only on age, relationship, or group type.

## 5.5 Safety, dignity, and accessibility override scoring

No recommendation score can override a known safety, accessibility, health, legal, or operational concern.

The Journey Director must surface uncertainty and involve a human Journey Director whenever material needs are not represented in the Knowledge Base.

## 5.6 The Knowledge Base must remain explainable

Structured scores may support comparison, but the recommendation must remain understandable to a human.

The Journey Director should be able to identify the decisive signals, any trade-offs, and why an alternative ranked lower.

## 5.7 Knowledge must continue to grow

The Knowledge Base is a living product asset.

Guest feedback, Journey Director experience, supplier changes, seasonality, and operational learning should strengthen future versions without weakening the governing philosophy.

---

# 6. Recommendation Framework

The Journey Director does not begin by recommending destinations.

It begins by understanding the journey.

```text
Traveller Story
      ↓
Traveller Intent
      ↓
Desired Emotions and Memories
      ↓
Companions, Pace, Themes, and Comfort
      ↓
Operational Eligibility Gate
      ↓
Destination Match
      ↓
Region Match
      ↓
Signature Experience Match
      ↓
      Confidence and Fallback Assessment
      ↓
Journey Director Narrative
```

## 6.1 Stage One — Understand the traveller

The Journey Passport provides the context for recommendation.

The deterministic recommendation logic receives:

- who is travelling;
- why the journey matters now;
- desired emotions and memories;
- preferred themes and activities;
- preferred pace;
- comfort expectations;
- likely duration and timing;
- destination certainty;
- any constraints or needs already shared.

The objective is not to force the traveller into a persona.

The objective is to understand the experience they hope to create.

## 6.2 Stage Two — Build the journey intent

The deterministic recommendation logic derives:

- the **primary emotional outcome**;
- up to three **supporting emotions**;
- the most important **tangible themes**;
- the likely **pace and comfort profile**;
- companion needs that materially influence the journey.

Example:

```text
Multi-generation family
+ Reconnection
+ Nature
+ Relaxed pace
+ Balanced-to-premium comfort
+ Low transfer fatigue
```

This becomes the experience profile against which destinations are compared.

## 6.3 Stage Three — Apply the eligibility gate

Before fit is scored, every candidate must pass the operational gate.

A destination is eligible only when:

- its destination status is `ACTIVE`;
- the proposed region is approved for recommendation;
- Search My Vacation can currently support the journey type;
- no known operational hold applies to the relevant dates or guest needs.

`COMING_SOON` and `INACTIVE` destinations receive no guest-facing score. They are excluded.

## 6.4 Stage Four — Match the destination

Eligible destinations are compared across multiple dimensions.

| Dimension | Release 1 guidance |
| --- | --- |
| **Primary emotion** | Strongest signal; prefer destinations whose identity directly reflects the traveller's main desired outcome. |
| **Supporting emotions** | Use to distinguish destinations with similar primary fit. |
| **Themes** | Match tangible interests such as culture, beaches, wildlife, food, or mountains. |
| **Traveller suitability** | Consider companions and life-stage needs without stereotyping. |
| **Pace** | Avoid recommending a naturally demanding journey to a traveller seeking ease unless the itinerary can be redesigned credibly. |
| **Comfort** | Confirm that the destination can support the expected service and accommodation style. |
| **Seasonal suitability** | Use as a feasibility modifier, never from stale assumptions. |
| **Operational confidence** | Human-owned release gate; uncertainty lowers confidence or blocks the recommendation. |

## 6.5 Stage Five — Match the region

The destination is not complete until its best-fit region or route is identified.

Region selection uses the same emotional and experiential signals at a finer level.

Example:

```text
Destination: Bali

Candidate regions:
- Ubud — reconnection, wellness, culture, nature
- Seminyak — lifestyle, dining, shopping, vibrant evenings
- Nusa Dua — premium resort comfort, calm beach time, family ease

Traveller intent:
- Reconnection
- Slow travel
- Culture
- Nature

Recommended region: Ubud
```

## 6.6 Stage Six — Match signature experiences

Experiences help the traveller imagine memories rather than logistics.

The deterministic recommendation logic should select two to four approved signature experiences that reinforce each possibility, such as:

- a tea-estate walk;
- a backwater stay;
- a guided heritage walk;
- a private or small-group safari;
- a local food experience;
- island hopping;
- a scenic drive;
- a wellness ritual;
- a quiet sunrise or sunset experience.

Experiences are inspirational until availability and operating conditions are confirmed.

## 6.7 Stage Seven — Human consultation and refinement

After the deterministic possibilities are presented and a direction is explored or selected, the human Journey Director remains responsible for:

- resolving conflicting preferences;
- validating operational readiness;
- checking seasonal and date-specific realities;
- considering mobility, health, dietary, or accessibility needs;
- calibrating transfer intensity;
- refining the destination, region, and experience direction with the traveller;
- designing the itinerary; and
- owning the final traveller handoff.

---

# 7. Destination Intelligence Model

The Destination Intelligence Model defines the minimum knowledge required for a destination to participate in Journey Director recommendations.

## 7.1 Destination record

| Field | Type | Required | Definition |
| --- | --- | --- | --- |
| `id` | String | Yes | Stable, machine-readable identifier. Never reuse an identifier for a different destination. |
| `name` | String | Yes | Guest-facing destination name. |
| `status` | Enum | Yes | `ACTIVE`, `COMING_SOON`, or `INACTIVE`. |
| `category` | Enum | Yes | `DOMESTIC` or `INTERNATIONAL`. |
| `recordType` | Enum | Yes | `DESTINATION` or `COLLECTION`. |
| `country` | String | Yes | Country in which the destination sits; `India` for domestic records. |
| `primaryEmotion` | Emotion ID | Yes | The clearest emotional promise of the destination. |
| `supportingEmotions` | Emotion ID[] | Yes | Additional credible emotional outcomes. |
| `personality` | String | Yes | Concise internal description of the journey character. |
| `themes` | Theme ID[] | Yes | Tangible experience categories supported by the destination. |
| `bestFor` | Traveller Type[] | Yes | Profiles most naturally supported. Guidance, not exclusion. |
| `pace` | Pace[] | Yes | Natural travel rhythms the destination can credibly support. |
| `comfort` | Comfort[] | Yes | Service and accommodation styles commonly supportable. |
| `idealDuration` | String | Yes | Indicative planning range, not a promise. |
| `seasonGuidance` | String | Yes | Broad internal guidance requiring validation for actual dates. |
| `signatureExperiences` | String[] | Yes | Experiences that express the destination identity. |
| `regions` | Region[] | Yes | Approved region, city, area, or route records. |
| `tradeOffs` | String[] | Yes | Important limitations, contrasts, or planning cautions. |
| `operationsOwner` | String | No | Internal accountable owner. |
| `lastReviewed` | Date | Yes | Date on which the record was last checked. |

## 7.2 Destination status

| Status | Guest-facing behaviour | Meaning |
| --- | --- | --- |
| `ACTIVE` | Eligible after all other gates pass | SMV currently serves the destination and has approved it for Journey Director use. |
| `COMING_SOON` | Never recommend or tease by default | Knowledge may be prepared, but operating confidence has not been approved. |
| `INACTIVE` | Hidden | Previously served, paused, or deliberately removed from recommendation. |

Status is a hard product rule.

It must be checked before scoring, not after a recommendation has been written.

## 7.3 Record types

### Destination

A geographic destination represented directly to the traveller, such as Bali, Kerala, or Dubai.

### Collection

An SMV portfolio grouping used to simplify discovery while preserving region-level recommendations.

Release 1 collections are:

- **Northeast** — Meghalaya, Sikkim, and Darjeeling;
- **Wildlife** — Kabini, Corbett, Bandipur, and Masinagudi.

A collection must never erase the identity of its member places. The guest-facing recommendation should name the most suitable member region.

## 7.4 Region record

| Field | Required | Definition |
| --- | --- | --- |
| `id` | Yes | Stable identifier scoped to its destination. |
| `name` | Yes | Guest-facing region, city, neighbourhood, island, or route name. |
| `status` | Yes | `ACTIVE`, `COMING_SOON`, or `INACTIVE`. |
| `primaryEmotion` | Yes | Most distinctive emotional fit. |
| `supportingEmotions` | Yes | Other credible emotional outcomes. |
| `themes` | Yes | Tangible journey themes. |
| `bestFor` | Yes | Most natural traveller profiles. |
| `pace` | Yes | Natural pace of the region. |
| `comfort` | Yes | Supported comfort levels. |
| `recommendedStay` | Yes | Indicative number of nights. |
| `signatureExperiences` | Yes | Inspirational experiences associated with the region. |
| `directorNote` | Yes | How and when the Journey Director should use the region. |
| `tradeOffs` | Yes | Material cautions or contrasts. |

## 7.5 Future operational fields

The following belong in a governed operational extension rather than in guest-facing content:

- service confidence score;
- preferred DMC and backup DMC;
- contracting status;
- hotel depth by comfort level;
- transfer reliability;
- visa complexity and change date;
- accessibility and mobility notes;
- permits and restricted-area requirements;
- seasonal closure risks;
- flight access and gateway resilience;
- emergency and escalation contacts.

These fields must be owner-controlled and time-stamped.

---

# 8. Controlled Vocabulary

Controlled vocabulary keeps the Journey Passport, Knowledge Base, decision logic, and guest narrative aligned.

Terms should not be added casually. New values require a definition, a clear distinction from existing values, and product-owner approval.

## 8.1 Emotional Library

| Emotion | Definition | Common journey signals | Avoid when |
| --- | --- | --- | --- |
| **Adventure** | Energy created by exploration, challenge, or the unfamiliar. | Active days, nature, discovery, outdoor experiences. | The traveller explicitly prioritises low effort or predictable routines. |
| **Awe** | A sense of being moved by dramatic nature, scale, or beauty. | Mountains, islands, iconic landscapes, monumental settings. | The destination fit relies mainly on shopping or convenience. |
| **Celebration** | Shared energy around a milestone or occasion. | Birthdays, anniversaries, reunions, group experiences. | Quiet privacy is the dominant need. |
| **Curiosity** | Pleasure in learning, observing, and encountering something new. | City exploration, museums, neighbourhoods, attractions. | The traveller wants near-total retreat. |
| **Discovery** | The satisfaction of exploring unfamiliar places, cultures, and stories. | Heritage, food, local communities, varied routes. | The trip must be extremely static or resort-only. |
| **Escape** | Relief created by meaningful distance from everyday life. | Islands, beaches, remote landscapes, unhurried stays. | The proposed journey is dense, urban, or highly scheduled. |
| **Freedom** | A sense of flexibility, movement, and self-directed exploration. | Road trips, island combinations, flexible days. | The itinerary requires rigid timing throughout. |
| **Gratitude** | Reflection, humility, or thankfulness inspired by a place or shared moment. | Spiritual sites, meaningful family journeys, sunrise rituals. | The narrative would impose spirituality the traveller did not express. |
| **Indulgence** | Pleasure created by exceptional comfort, service, dining, or exclusivity. | Premium resorts, private experiences, spa, design-led stays. | The guest prioritises simplicity, local immersion, or value over polish. |
| **Joy** | Lightness, fun, and easy shared enjoyment. | Beaches, attractions, food, groups, playful activities. | The trip's primary purpose is solitude or deep reflection. |
| **Majesty** | Grandeur associated with royal, historic, architectural, or desert settings. | Palaces, forts, monumental heritage, iconic skylines. | The traveller primarily seeks intimate nature or understated simplicity. |
| **Reconnection** | Renewed closeness with oneself or with travelling companions. | Slow pace, nature, wellness, conversation, shared rituals. | The itinerary is crowded, fragmented, or transfer-heavy. |
| **Relaxation** | Physical and mental release from everyday demands. | Beaches, backwaters, resorts, wellness, open time. | The proposed plan depends on constant movement. |
| **Romance** | Intimacy, beauty, privacy, and shared meaning for a couple. | Scenic stays, sunsets, private dining, unhurried moments. | The narrative assumes romance without the traveller indicating it. |
| **Serenity** | Quiet emotional balance created by calm surroundings and gentle rhythm. | Lakes, forests, hills, spiritual settings, uncrowded stays. | The region is chosen mainly for nightlife or high energy. |
| **Spirituality** | Connection to faith, reflection, ritual, or inner meaning. | Sacred places, contemplative experiences, heritage rituals. | The traveller has not signalled interest or the language risks appropriation. |
| **Wonder** | Delight and amazement prompted by the new, imaginative, or iconic. | Family attractions, islands, distinctive cities, natural beauty. | The destination offers little beyond familiarity for that traveller. |

Each destination receives one primary emotion. Supporting emotions should normally be limited to four.

## 8.2 Theme Library

| Theme group | Approved themes |
| --- | --- |
| **Landscape** | Beaches, Islands, Mountains, Hills, Forests, Lakes, Rivers, Backwaters, Desert, Scenic Drives |
| **Culture** | Culture, Heritage, Architecture, Spiritual, Festivals, Villages, Local Communities |
| **Nature and activity** | Nature, Wildlife, Safari, Adventure, Water Sports, Snow Experiences, Photography |
| **Lifestyle** | Food, Shopping, Nightlife, City Break, Wellness, Luxury, Slow Travel |
| **Special interest** | Tea Estates, Coffee Estates, Family Attractions, Road Trips, Cruises |

Themes describe what the traveller may experience. Emotions describe what the experience may help the traveller feel.

## 8.3 Comfort levels

| Comfort | Definition |
| --- | --- |
| **Simple** | Clean, dependable, value-conscious choices where experience takes priority over extensive amenities. |
| **Balanced** | Reliable comfort, thoughtful location, and a considered mix of experience and convenience. |
| **Premium** | High-touch service, stronger privacy or design, premium accommodation, and greater ease where available. |

Comfort does not equal budget. A remote or operationally complex destination may carry premium cost without providing a conventionally luxurious experience.

## 8.4 Travel pace

| Pace | Definition |
| --- | --- |
| **Relaxed** | Fewer bases, generous free time, and low daily pressure. |
| **Balanced** | A considered mix of exploration and rest. |
| **Explorer** | Active discovery with fuller days and meaningful movement. |
| **Fast-paced** | High coverage and frequent transitions; use only when the traveller explicitly values breadth. |

## 8.5 Traveller types

- Solo Traveller
- Couple
- Honeymoon
- Family
- Friends
- Multi-generation Family
- Senior Travellers
- Corporate Group
- Educational Group

Traveller type must never be used as a proxy for mobility, budget, interests, or comfort. Those attributes require their own signals.

---

# 9. Region Intelligence

Region intelligence is the feature that turns a broad destination suggestion into experienced advice.

## 9.1 Region selection principle

The Journey Director should select a region when:

- the destination contains clearly different journey personalities;
- the region materially changes pace, comfort, or theme fit;
- naming the region helps the traveller imagine the experience;
- Search My Vacation has sufficient operating confidence in that region.

## 9.2 Region-level contrast

Region selection should make meaningful contrasts visible.

| Destination | Traveller signal | Prefer | Over | Reason |
| --- | --- | --- | --- | --- |
| Bali | Wellness, culture, reconnection, slow pace | Ubud | Kuta | Ubud better supports calm, nature, and cultural immersion. |
| Bali | Premium beach ease, family or honeymoon | Nusa Dua | Seminyak | Nusa Dua better supports resort-led comfort and quieter beach time. |
| Kerala | Tea landscapes, cool hills, gentle exploration | Munnar | Kochi | Munnar is the stronger nature-led emotional match. |
| Kerala | Slow living and shared time | Kumarakom or Alappuzha | Munnar | The backwaters better express stillness and reconnection. |
| Thailand | Scenic beaches and island exploration with a calmer base | Krabi | Patong | Krabi better supports landscape-led escape. |
| Tamil Nadu | Quiet couple or small-family hill retreat | Kodaikanal or Kotagiri | Ooty | The quieter rhythm may fit serenity better than a busier classic hill-station experience. |
| Wildlife | First safari with balanced comfort and a nature-led stay | Kabini | Masinagudi | Kabini can provide a more contained, lodge-led experience when operating conditions fit. |

These are recommendation tendencies, not permanent truths. Dates, crowd patterns, accommodation, access, and guest needs must still be checked.

## 9.3 Multi-region journeys

Multiple regions should be combined only when the contrast creates value.

Good combinations may offer:

- culture plus beach;
- mountains plus heritage;
- wildlife plus relaxation;
- city discovery plus an unhurried retreat.

Do not add regions merely to increase coverage.

Every additional base introduces transfer time, packing, check-in effort, and the risk of weakening the desired emotion.

---

# 10. Domestic Destination Portfolio

All destinations in this section are `ACTIVE` for Release 1, subject to live operational validation.

Season guidance is intentionally broad. It must not be copied into guest-facing advice without date-specific review.

## 10.1 Portfolio overview

| Destination | Record type | Primary emotion | Core themes | Comfort | Indicative duration |
| --- | --- | --- | --- | --- | --- |
| Agra | Destination | Majesty | Heritage, Architecture, Romance | Balanced, Premium | 1–2 nights |
| Amritsar | Destination | Gratitude | Spiritual, Heritage, Food, Culture | Simple, Balanced, Premium | 2–3 nights |
| Andaman | Destination | Escape | Islands, Beaches, Water Sports, Nature | Balanced, Premium | 5–7 nights |
| Goa | Destination | Joy | Beaches, Food, Nightlife, Wellness | Simple, Balanced, Premium | 3–6 nights |
| Gujarat | Destination | Discovery | Heritage, Culture, Wildlife, Spiritual, Desert | Simple, Balanced, Premium | 5–9 nights |
| Himachal Pradesh | Destination | Freedom | Mountains, Nature, Road Trips, Adventure | Simple, Balanced, Premium | 5–9 nights |
| Karnataka | Destination | Discovery | Heritage, Coffee Estates, Nature, Beaches | Simple, Balanced, Premium | 4–8 nights |
| Kashmir | Destination | Awe | Mountains, Lakes, Nature, Scenic Drives | Balanced, Premium | 5–8 nights |
| Kerala | Destination | Reconnection | Backwaters, Hills, Wellness, Nature, Culture | Balanced, Premium | 5–9 nights |
| Northeast | Collection | Wonder | Hills, Nature, Culture, Road Trips | Simple, Balanced, Premium | 5–10 nights |
| Pondicherry | Destination | Serenity | Heritage, Food, Beaches, Slow Travel | Simple, Balanced, Premium | 2–4 nights |
| Assam | Destination | Discovery | River, Tea Estates, Wildlife, Culture | Simple, Balanced, Premium | 4–7 nights |
| Rajasthan | Destination | Majesty | Palaces, Forts, Desert, Culture, Food | Balanced, Premium | 6–10 nights |
| Tamil Nadu | Destination | Spirituality | Temples, Heritage, Hills, Beaches, Food | Simple, Balanced, Premium | 5–10 nights |
| Hyderabad | Destination | Discovery | Food, Heritage, Architecture, Shopping | Simple, Balanced, Premium | 2–4 nights |
| Vizag | Destination | Relaxation | Beaches, Hills, City Break, Scenic Drives | Simple, Balanced, Premium | 3–5 nights |
| Wildlife | Collection | Adventure | Safari, Wildlife, Forests, Photography | Balanced, Premium | 2–4 nights per reserve |

## 10.2 Agra

**Identity:** Monumental heritage made personal through awe, history, and romance.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Romance, Gratitude |
| **Best for** | Couples, Families, Multi-generation Families, Senior Travellers, Educational Groups |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Generally strongest in the cooler part of the year; heat, haze, crowding, and monument conditions require live review. |
| **Signature experiences** | Taj Mahal at a thoughtfully selected time, Agra Fort, Mughal heritage interpretation, local craft or food story. |
| **Trade-offs** | A rushed day trip can reduce the experience to a checklist; crowd and road conditions affect pace. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Taj East Gate / Tajganj** | Wonder, Romance | First-time visitors, Couples, Families | 1–2 nights | Prefer when proximity and an atmospheric monument experience matter. |
| **Agra Fort and old-city heritage** | Discovery, Majesty | Heritage travellers, Educational Groups | Included within stay | Add when the traveller wants context beyond the Taj Mahal. |

## 10.3 Amritsar

**Identity:** A deeply felt journey of faith, history, hospitality, and food.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Spirituality, Discovery, Reconnection |
| **Best for** | Families, Multi-generation Families, Senior Travellers, Solo Travellers, Educational Groups |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Cooler months are often more comfortable; religious observances, local events, and heat require review. |
| **Signature experiences** | Golden Temple at a quiet hour, community kitchen context, Partition Museum, heritage and food exploration. |
| **Trade-offs** | Sacred experiences require respectful framing; border ceremony crowds and intensity may not suit every traveller. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Golden Temple precinct** | Gratitude, Spirituality | All reflective journeys | 2–3 nights in Amritsar | The emotional heart of the recommendation. Encourage unhurried, respectful time. |
| **Old City** | Discovery, Joy | Food and heritage travellers | Included within stay | Use for living culture and food, with mobility and crowd considerations. |
| **Attari–Wagah corridor** | Celebration, Wonder | Families, First-time visitors | Half-day | Offer as an optional high-energy contrast, not an automatic inclusion. |

## 10.4 Andaman

**Identity:** An island escape where sea, nature, and distance from routine create release.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Relaxation, Romance, Wonder, Adventure |
| **Best for** | Couples, Honeymoon, Families, Friends |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Sea and weather conditions directly affect ferries and water activities; live validation is mandatory. |
| **Signature experiences** | Beach time, snorkelling or diving where suitable, island crossings, marine landscapes, historical context in Port Blair. |
| **Trade-offs** | Inter-island logistics can create fatigue; weather disruption and activity suitability must be discussed honestly. |

| Region or island | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Port Blair** | Discovery | First-time visitors, Families | 1–2 nights | Use as gateway and for historical context, not as the emotional centre of a beach-led journey. |
| **Swaraj Dweep (Havelock)** | Escape, Romance | Couples, Honeymoon, Families | 3–4 nights | Primary recommendation for a polished island-and-beach experience. |
| **Shaheed Dweep (Neil)** | Serenity, Reconnection | Slow travellers, Couples | 1–2 nights | Prefer for a quieter, smaller-scale island rhythm. |

## 10.5 Goa

**Identity:** Easy coastal joy with multiple personalities, from celebration to quiet restoration.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Celebration, Relaxation, Freedom, Reconnection |
| **Best for** | Couples, Families, Friends, Solo Travellers, Corporate Groups |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Beach conditions, monsoon character, events, and crowd peaks materially change the experience. |
| **Signature experiences** | Beach time, neighbourhood dining, Portuguese-era heritage, local food, wellness, music, and slow days. |
| **Trade-offs** | “Goa” is too broad; selecting the wrong coast or neighbourhood can invert the intended journey. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **North Goa — Candolim / Sinquerim** | Joy, Relaxation | Families, Couples, First-time visitors | 3–5 nights | Balanced access to beaches, dining, and activity without defaulting to the busiest party pockets. |
| **North Goa — Anjuna / Vagator** | Freedom, Celebration | Friends, Couples, Lifestyle travellers | 3–5 nights | Use for design, music, cafés, and lively evenings; validate noise and event expectations. |
| **Panaji / Fontainhas** | Discovery | Culture and food travellers | 1–2 nights or day experience | Use to deepen Goa beyond beaches. |
| **South Goa** | Relaxation, Reconnection | Couples, Honeymoon, Families, Senior Travellers | 3–6 nights | Prefer for quieter resort time and a slower beach rhythm. |

## 10.6 Gujarat

**Identity:** A varied discovery journey joining living culture, monumental heritage, sacred places, wildlife, and open landscapes.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Majesty, Gratitude, Wonder |
| **Best for** | Families, Senior Travellers, Educational Groups, Culture travellers, Wildlife travellers |
| **Pace** | Balanced, Explorer |
| **Season guidance** | Heat, festival demand, desert conditions, wildlife access, and long road sectors require route-specific review. |
| **Signature experiences** | Ahmedabad heritage, Kutch landscapes and crafts, Gir wildlife, Dwarka or Somnath, stepwells and architectural heritage. |
| **Trade-offs** | Distances are substantial; Gujarat should be recommended as a focused route, not a single undifferentiated destination. |

| Region or route | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Ahmedabad and heritage corridor** | Discovery, Majesty | Culture, Architecture, Food travellers | 2–3 nights | Strong introduction to design, history, and urban culture. |
| **Kutch** | Wonder, Freedom | Photographers, Culture travellers, Families | 3–5 nights | Prefer for open landscapes, crafts, and distinctive seasonal character. |
| **Gir and Junagadh** | Adventure, Discovery | Wildlife travellers, Families | 2–3 nights | Wildlife access and park operating conditions must be checked. |
| **Dwarka–Somnath** | Spirituality, Gratitude | Families, Senior Travellers | 3–4 nights | Use for a purpose-led sacred route, not as a generic sightseeing addition. |

## 10.7 Himachal Pradesh

**Identity:** Mountain freedom expressed through scenic roads, forest stays, adventure, and restorative air.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Serenity, Adventure, Reconnection, Awe |
| **Best for** | Couples, Families, Friends, Solo Travellers, Honeymoon |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Road conditions, altitude, snow, monsoon risk, and local access require live validation. |
| **Signature experiences** | Mountain views, forest walks, café towns, village stays, scenic drives, soft adventure. |
| **Trade-offs** | Transfer time is part of the experience; altitude and winding roads may not suit every guest. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Shimla / Mashobra** | Relaxation, Serenity | Families, Couples, Senior Travellers | 2–4 nights | Use for accessible hill-station character and gentler exploration. |
| **Manali / Naggar** | Adventure, Wonder | Couples, Families, Friends | 3–5 nights | Match to mountain activity and scenic variety; do not hide congestion realities. |
| **Dharamshala / McLeod Ganj** | Serenity, Spirituality | Solo Travellers, Couples, Culture travellers | 3–4 nights | Prefer for reflective mountain time and Tibetan cultural context. |
| **Spiti Valley** | Awe, Adventure | Experienced explorers, Photographers | 6–9 nights | High-intensity, altitude-sensitive route requiring explicit operational approval. |

## 10.8 Karnataka

**Identity:** Layered discovery across royal cities, ancient ruins, coffee hills, forests, and coast.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Serenity, Reconnection |
| **Best for** | Families, Couples, Friends, Culture travellers, Nature travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Conditions differ significantly between coast, Western Ghats, and interior heritage routes. |
| **Signature experiences** | Hampi ruins, Mysuru heritage, Coorg coffee country, coastal temples and beaches, Bengaluru food and design. |
| **Trade-offs** | The state is too diverse for a generic recommendation; choose one coherent route or a purposeful contrast. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Bengaluru** | Curiosity, Discovery | City-break, Food, Design travellers | 1–3 nights | Use as a city experience or gateway, not automatically as the centre of a nature journey. |
| **Mysuru** | Majesty, Discovery | Families, Senior Travellers, Culture travellers | 2–3 nights | Strong for royal heritage and an easy cultural pace. |
| **Coorg** | Reconnection, Serenity | Couples, Families, Multi-generation Families | 3–4 nights | Prefer for coffee landscapes, nature, and a relaxed stay. |
| **Hampi** | Wonder, Discovery | Culture travellers, Photographers, Families | 2–3 nights | Best for monumental history; heat and walking intensity require consideration. |
| **Gokarna / coastal Karnataka** | Escape, Serenity | Couples, Friends, Slow travellers | 2–4 nights | Use for a quieter coastal rhythm, with seasonal beach conditions checked. |

## 10.9 Kashmir

**Identity:** Landscape-led awe softened by lakes, gardens, valleys, and generous pauses.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Romance, Serenity, Wonder, Reconnection |
| **Best for** | Couples, Honeymoon, Families, Multi-generation Families, Photographers |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Weather, road access, snow conditions, local advisories, and seasonal openings require immediate validation. |
| **Signature experiences** | Srinagar lake experience, gardens, valley drives, mountain viewpoints, local craft and cuisine. |
| **Trade-offs** | Seasonal access and external conditions may change quickly; route confidence must be current. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Srinagar** | Serenity, Discovery | Families, Couples, Senior Travellers | 2–3 nights | Use for lakes, gardens, food, and a gentler introduction. |
| **Gulmarg** | Wonder, Adventure | Couples, Families, Snow travellers | 2–3 nights | Match to mountain scenery or snow intent; activity access is condition-dependent. |
| **Pahalgam** | Reconnection, Serenity | Families, Couples, Nature travellers | 2–3 nights | Prefer for valley calm and slower nature-led time. |
| **Sonamarg** | Awe, Adventure | Scenic travellers, Photographers | Day visit or 1–2 nights | Use only when access and route conditions support it. |

## 10.10 Kerala

**Identity:** Reconnection through water, green landscapes, wellness, culture, and an unhurried rhythm.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Relaxation, Serenity, Discovery, Romance |
| **Best for** | Couples, Honeymoon, Families, Multi-generation Families, Senior Travellers, Solo Travellers |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Hills, coast, and backwaters respond differently to rain and heat; wellness journeys may value quieter seasons. |
| **Signature experiences** | Backwater stay, tea landscapes, spice country, responsible wildlife experiences, heritage and food, Ayurveda or wellness where appropriate. |
| **Trade-offs** | Too many one-night stops undermine Kerala's strongest emotional promise. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Kochi / Fort Kochi** | Discovery | Culture, Food, First-time visitors | 1–2 nights | Use as a living heritage introduction rather than only an airport stop. |
| **Munnar** | Serenity, Wonder | Couples, Families, Nature travellers | 2–3 nights | Prefer for tea hills, cool landscapes, and gentle exploration. |
| **Thekkady / Periyar** | Discovery, Adventure | Families, Nature travellers | 1–2 nights | Use for forest and spice-country contrast; frame wildlife responsibly. |
| **Alappuzha** | Relaxation, Romance | Couples, Honeymoon, Families | 1–2 nights | Use for the iconic moving backwater experience; set realistic expectations about route and vessel style. |
| **Kumarakom** | Reconnection, Serenity | Multi-generation Families, Couples, Senior Travellers | 2–3 nights | Prefer for a still, resort-led backwater stay with less movement. |
| **Varkala / Kovalam** | Escape, Relaxation | Couples, Families, Wellness travellers | 2–4 nights | Choose between character-led cliff setting and resort-led beach ease according to guest intent. |
| **Wayanad** | Reconnection, Serenity | Families, Couples, Friends | 2–4 nights | Prefer for forested landscapes and a quieter inland retreat. |

## 10.11 Northeast

**Identity:** A collection of distinct Himalayan and hill journeys united by wonder, living culture, and scenic discovery.

The Northeast collection includes **Meghalaya, Sikkim, and Darjeeling** for Release 1. Assam remains a separate destination record.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Discovery, Serenity, Freedom, Adventure |
| **Best for** | Couples, Families, Friends, Solo Travellers, Photographers |
| **Pace** | Balanced, Explorer |
| **Season guidance** | Rain, fog, landslides, altitude, road conditions, and permits vary by region and require live checks. |
| **Signature experiences** | Living root landscapes, mountain views, monasteries, tea heritage, village and local culture, scenic drives. |
| **Trade-offs** | Road journeys can be long; the collection must never be presented as one homogeneous culture or landscape. |

| Member region | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Meghalaya — Shillong / Sohra** | Wonder, Discovery | Nature travellers, Friends, Families | 4–6 nights | Prefer for waterfalls, caves, living landscapes, music, and road-led exploration. |
| **Meghalaya — Dawki / Mawlynnong belt** | Curiosity, Wonder | Explorers, Photographers | 1–2 nights within route | Use selectively; access, crowd patterns, and seasonal water conditions matter. |
| **Sikkim — Gangtok** | Discovery, Serenity | Families, Couples, First-time Himalayan travellers | 2–3 nights | Gateway for monasteries, viewpoints, and regional exploration. |
| **Sikkim — Pelling** | Serenity, Awe | Couples, Families, Photographers | 2–3 nights | Prefer for slower mountain views and cultural sites. |
| **Darjeeling** | Discovery, Wonder | Families, Couples, Senior Travellers | 3–4 nights | Use for tea heritage, Himalayan character, and classic hill-station atmosphere. |

## 10.12 Pondicherry

**Identity:** A small-scale coastal pause shaped by heritage streets, cafés, reflection, and slow days.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Romance, Discovery, Reconnection |
| **Best for** | Couples, Solo Travellers, Friends, Families |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Heat, humidity, rain, weekends, and festival demand strongly affect comfort and atmosphere. |
| **Signature experiences** | Heritage-quarter walks, Tamil-quarter context, cafés and food, promenade time, nearby spiritual or beach experiences. |
| **Trade-offs** | The shoreline experience is not interchangeable with a resort beach holiday; set expectations carefully. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **French Quarter / White Town** | Romance, Discovery | Couples, Solo Travellers, Design and food travellers | 2–3 nights | Primary recommendation for walkable heritage character. |
| **Tamil Quarter** | Discovery, Curiosity | Culture and architecture travellers | Included within stay | Add depth beyond the most photographed streets. |
| **Auroville corridor** | Reconnection, Spirituality | Reflective travellers | Half-day or longer by intent | Use only when values and expectations genuinely align. |

## 10.13 Assam

**Identity:** A river-and-land journey of tea, wildlife, culture, and broad landscapes.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Adventure, Gratitude |
| **Best for** | Families, Couples, Wildlife travellers, Culture travellers, Photographers |
| **Pace** | Balanced, Explorer |
| **Season guidance** | Flood patterns, park calendars, river conditions, and road access require current checks. |
| **Signature experiences** | Brahmaputra perspectives, tea-estate life, Kaziranga when operationally suitable, Majuli culture, Sivasagar heritage. |
| **Trade-offs** | Distances and seasonal conditions require a focused route; wildlife sightings are never guaranteed. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Guwahati** | Discovery, Spirituality | First-time visitors, Families | 1–2 nights | Gateway with river and sacred context; avoid treating it only as transit. |
| **Kaziranga** | Adventure, Wonder | Wildlife travellers, Families | 2–3 nights | Recommend only during confirmed operating periods and with responsible wildlife language. |
| **Majuli / Jorhat** | Reconnection, Discovery | Culture travellers, Slow travellers | 2–3 nights | Prefer for living culture and a gentler rural rhythm; river logistics matter. |
| **Dibrugarh tea country** | Serenity, Discovery | Couples, Families, Tea and heritage travellers | 2–3 nights | Use for estate-led calm and regional depth. |

## 10.14 Rajasthan

**Identity:** Majesty expressed through forts, palaces, desert horizons, colour, craft, and living culture.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Celebration, Romance, Discovery, Wonder |
| **Best for** | Couples, Honeymoon, Families, Multi-generation Families, Friends, Senior Travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Heat and festival demand strongly influence route design; desert nights and city conditions differ. |
| **Signature experiences** | Forts and palaces, design-led heritage stays, desert landscapes, craft, food, lake views, guided old-city exploration. |
| **Trade-offs** | Excessive city-hopping creates fatigue; select a route with emotional coherence. |

| Region or city | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Jaipur** | Majesty, Discovery | First-time visitors, Families, Shoppers | 2–3 nights | Strong for architecture, craft, and an energetic introduction. |
| **Udaipur** | Romance, Serenity | Couples, Honeymoon, Multi-generation Families | 2–3 nights | Prefer for lake-led beauty, slower luxury, and shared celebration. |
| **Jodhpur** | Discovery, Majesty | Culture travellers, Photographers | 2–3 nights | Use for fort, old-city character, and a strong visual identity. |
| **Jaisalmer** | Wonder, Adventure | Couples, Friends, Families | 2–3 nights | Prefer for desert atmosphere; avoid reducing the region to a generic camp night. |
| **Ranthambore** | Adventure, Wonder | Wildlife travellers, Families | 2–3 nights | Safari operations and sightings require careful expectation setting. |
| **Bikaner / rural Rajasthan** | Discovery, Curiosity | Repeat visitors, Slow travellers | 2–3 nights | Wildcard for deeper heritage and fewer obvious choices when operationally suitable. |

## 10.15 Tamil Nadu

**Identity:** A culturally rooted journey joining sacred architecture, living heritage, food, coast, and restorative hills.

Tamil Nadu includes **Ooty, Kotagiri, and Kodaikanal** within its active region intelligence.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Discovery, Gratitude, Serenity, Wonder |
| **Best for** | Families, Multi-generation Families, Senior Travellers, Couples, Educational Groups |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Heat, temple calendars, hill-station demand, rain, and road conditions vary significantly by route. |
| **Signature experiences** | Temple architecture, living faith, classical culture, regional food, heritage towns, hill stays, coastal landscapes. |
| **Trade-offs** | Sacred routes and hill retreats serve different intents; do not combine them without a clear journey story. |

| Region or city | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Chennai** | Discovery | Food, Culture, Business-plus-leisure travellers | 1–3 nights | Use for urban culture, arts, food, and coastal context. |
| **Mamallapuram** | Wonder, Discovery | Families, Culture travellers | 1–2 nights | Prefer for accessible coastal heritage and architecture. |
| **Madurai** | Spirituality, Discovery | Families, Senior Travellers, Culture travellers | 1–2 nights | Use for living temple culture and food; prepare guests for sensory intensity. |
| **Thanjavur / Chettinad corridor** | Majesty, Discovery | Architecture, Craft, Food travellers | 2–4 nights | Strong for deep cultural journeys rather than checklist touring. |
| **Rameswaram** | Gratitude, Spirituality | Families, Senior Travellers | 1–2 nights | Use for purpose-led journeys; practical and ritual expectations require sensitivity. |
| **Ooty** | Joy, Wonder | Families, Multi-generation Families | 2–3 nights | Classic hill-station choice with broad appeal; discuss peak crowding. |
| **Kotagiri** | Serenity, Reconnection | Couples, Small families, Slow travellers | 2–3 nights | Prefer for quieter Nilgiri time and a less hurried rhythm. |
| **Kodaikanal** | Romance, Serenity | Couples, Families | 2–3 nights | Prefer for intimate hill landscapes, gentle exploration, and shared quiet. |

## 10.16 Hyderabad

**Identity:** A compact city discovery shaped by food, layered history, monumental architecture, and modern energy.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Joy, Curiosity, Majesty |
| **Best for** | Families, Friends, Couples, Corporate Groups, Food travellers |
| **Pace** | Balanced, Explorer |
| **Season guidance** | Heat, traffic, events, and monument timings require practical planning. |
| **Signature experiences** | Old-city heritage, Charminar context, Golconda, regional cuisine, bazaars, contemporary city contrast. |
| **Trade-offs** | Traffic and heat can undermine an overfilled itinerary; food preferences require thoughtful curation. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Old City / Charminar** | Discovery, Curiosity | Food and heritage travellers | Included within 2–4 nights | Emotional centre for history and street-level culture; plan sensitively for crowds and mobility. |
| **Golconda / Qutb Shahi belt** | Majesty, Wonder | Families, Architecture travellers | Half-day to full day | Use for scale, story, and historical depth. |
| **Banjara Hills / HITEC City** | Indulgence, Joy | Premium, Corporate, Dining travellers | Base by purpose | Choose for modern comfort and dining, not as a substitute for heritage exploration. |

## 10.17 Vizag

**Identity:** An easy coastal break where beaches, hills, city comforts, and scenic drives coexist.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Joy, Discovery, Reconnection |
| **Best for** | Families, Couples, Friends, Senior Travellers |
| **Pace** | Relaxed, Balanced |
| **Season guidance** | Heat, humidity, rain, cyclone conditions, and beach safety require current validation. |
| **Signature experiences** | Coastal road, beach viewpoints, Kailasagiri, local food, museum or naval context, Araku extension where suitable. |
| **Trade-offs** | Set clear expectations between a city beach break and a secluded resort escape. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **RK Beach / city coast** | Joy, Discovery | Families, First-time visitors | 2–3 nights | Use for accessible city-and-sea energy. |
| **Rushikonda / northern coast** | Relaxation, Freedom | Couples, Families | 2–3 nights | Prefer for a more leisure-led coastal base, subject to beach conditions. |
| **Araku Valley extension** | Discovery, Wonder | Families, Nature travellers | 1–2 nights | Add only when transfer rhythm and seasonal conditions support the contrast. |

## 10.18 Wildlife

**Identity:** A collection of forest journeys where anticipation, observation, and respect for the natural world create adventure.

The Wildlife collection includes **Kabini, Corbett, Bandipur, and Masinagudi**.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Discovery, Gratitude, Reconnection |
| **Best for** | Families, Couples, Friends, Photographers, Multi-generation Families |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Park calendars, zones, permits, weather, fire or monsoon closures, and wildlife regulations require live checks. |
| **Signature experiences** | Responsible safari, forest lodge rhythm, birding, naturalist-led interpretation, quiet observation. |
| **Trade-offs** | Sightings are never guaranteed; early starts, rough tracks, and permit constraints must be explained. |

| Member region | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Kabini** | Wonder, Reconnection | First-time safari guests, Couples, Families | 2–3 nights | Prefer for a lodge-led, nature-immersive stay with balanced comfort where available. |
| **Corbett** | Adventure, Discovery | Families, Friends, Wildlife enthusiasts | 2–3 nights | Match zone and stay location carefully; avoid using the Corbett name without access clarity. |
| **Bandipur** | Discovery, Serenity | Families, Couples, Road-trip travellers | 2–3 nights | Strong as a focused forest stay or a coherent Karnataka route. |
| **Masinagudi** | Adventure, Freedom | Repeat wildlife travellers, Nature-led guests | 2–3 nights | Use for a more rustic, landscape-led feel only when guest expectations and operations align. |

---

# 11. International Destination Portfolio

All destinations in this section are `ACTIVE` for Release 1, subject to live operational, visa, safety, and date-specific validation.

## 11.1 Portfolio overview

| Destination | Primary emotion | Core themes | Comfort | Indicative duration |
| --- | --- | --- | --- | --- |
| Dubai | Indulgence | City Break, Luxury, Shopping, Desert, Family Attractions | Balanced, Premium | 4–6 nights |
| Bali | Reconnection | Culture, Nature, Wellness, Beaches, Food | Balanced, Premium | 5–8 nights |
| Malaysia | Discovery | City Break, Food, Islands, Nature, Culture | Simple, Balanced, Premium | 5–8 nights |
| Singapore | Curiosity | Family Attractions, City Break, Food, Shopping, Architecture | Balanced, Premium | 4–6 nights |
| Sri Lanka | Discovery | Culture, Wildlife, Hills, Beaches, Scenic Drives | Simple, Balanced, Premium | 6–10 nights |
| Thailand | Freedom | Beaches, Islands, Food, Culture, Nightlife | Simple, Balanced, Premium | 5–9 nights |
| Vietnam | Discovery | Culture, Food, Heritage, Nature, City Break | Simple, Balanced, Premium | 7–11 nights |

## 11.2 Dubai

**Identity:** Polished urban wonder where landmark experiences, family ease, desert contrast, and premium comfort meet.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Celebration, Joy, Majesty |
| **Best for** | Families, Couples, Friends, Multi-generation Families, Corporate Groups |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Heat, outdoor operating comfort, religious calendars, events, and demand peaks require current review. |
| **Signature experiences** | Skyline landmarks, desert experience, design and shopping, family attractions, beach or resort time, old-city contrast. |
| **Trade-offs** | Premium imagery can create budget assumptions; travel time between areas and outdoor heat must be planned honestly. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Downtown Dubai** | Wonder, Majesty | First-time visitors, Families, Couples | 2–4 nights or city base | Prefer for iconic skyline, landmark access, and polished city energy. |
| **Palm Jumeirah** | Indulgence, Relaxation | Families, Honeymoon, Premium travellers | 2–4 nights | Prefer for resort-led luxury, beach time, and self-contained ease. |
| **Dubai Marina / JBR** | Joy, Celebration | Couples, Friends, Families | 3–5 nights | Use for walkable evenings, dining, beach access, and an energetic base. |
| **Old Dubai / Al Seef** | Discovery, Curiosity | Culture and food travellers | Half-day to 1 night | Add meaningful contrast to the contemporary city; do not overstate it as a preserved historic enclave. |
| **Desert conservation area** | Wonder, Reconnection | Couples, Families, Premium travellers | Experience or 1 night | Use as a deliberate change of pace; supplier practices must meet SMV standards. |

## 11.3 Bali

**Identity:** Reconnection through living culture, nature, wellness, coast, and a rhythm that can be either restorative or celebratory.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Serenity, Romance, Discovery, Joy |
| **Best for** | Couples, Honeymoon, Families, Friends, Solo Travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Rain, sea conditions, traffic, ceremonies, and local crowd patterns affect itinerary design. |
| **Signature experiences** | Temple and cultural context, rice landscapes, wellness, food, coastal sunsets, craft, selected water experiences. |
| **Trade-offs** | Traffic can make apparently short distances tiring; region choice is decisive. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Ubud** | Reconnection, Serenity | Couples, Solo Travellers, Families, Wellness and culture travellers | 3–4 nights | Primary choice for culture, nature, wellbeing, and a slower emotional centre. |
| **Seminyak** | Celebration, Joy | Couples, Friends, Food and lifestyle travellers | 2–4 nights | Prefer for dining, shopping, design, sunset venues, and lively evenings. |
| **Nusa Dua** | Indulgence, Relaxation | Honeymoon, Families, Multi-generation Families | 2–4 nights | Prefer for premium resort ease, calmer beach time, and a contained stay. |
| **Uluwatu / Jimbaran** | Romance, Wonder | Couples, Honeymoon, Premium travellers | 2–3 nights | Use for cliffs, sunsets, beaches, and a more spacious southern-coast feeling. |
| **Sanur** | Serenity, Ease | Families, Senior Travellers, Slow travellers | 2–4 nights | Prefer for a gentler coastal rhythm and straightforward access. |
| **Kuta** | Joy, Celebration | Budget-conscious first-time visitors, Friends | 1–3 nights | Use only when activity, convenience, and price outweigh the need for calm or cultural depth. |

## 11.4 Malaysia

**Identity:** Approachable discovery through multicultural cities, distinctive food, heritage streets, islands, and rainforest contrasts.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Curiosity, Joy, Escape, Wonder |
| **Best for** | Families, Couples, Friends, Multi-generation Families, Food travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Rain and sea conditions vary by coast and island; public holidays and regional demand require review. |
| **Signature experiences** | Kuala Lumpur skyline and neighbourhoods, Penang heritage and food, Langkawi beaches and nature, selected highland or rainforest extensions. |
| **Trade-offs** | “Malaysia” requires a clear city–heritage–island choice; east- and west-coast seasonality differs. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Kuala Lumpur** | Curiosity, Joy | Families, First-time international travellers, Shoppers | 2–3 nights | Use for an accessible city introduction, food, and family appeal. |
| **Penang / George Town** | Discovery, Joy | Food, Culture, Couples, Friends | 2–3 nights | Prefer for layered heritage, street food, and neighbourhood exploration. |
| **Langkawi** | Escape, Relaxation | Couples, Honeymoon, Families | 3–4 nights | Prefer for island comfort, nature, and an easy beach-led finish. |
| **Cameron Highlands** | Serenity, Reconnection | Families, Couples, Nature travellers | 2 nights | Use as a cool-climate, landscape contrast when road time is acceptable. |

## 11.5 Singapore

**Identity:** Effortless curiosity in a compact city where futuristic design, neighbourhood culture, food, nature, and family attractions coexist.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Wonder, Joy, Discovery, Indulgence |
| **Best for** | Families, Multi-generation Families, Couples, Senior Travellers, First-time international travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Tropical rain and humidity are year-round considerations; events and school holidays affect demand. |
| **Signature experiences** | Marina Bay, Gardens by the Bay, neighbourhood food and culture, Sentosa, museums, design, shopping. |
| **Trade-offs** | Attraction-heavy schedules can become exhausting and transactional; preserve neighbourhood and free time. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Marina Bay** | Wonder, Indulgence | First-time visitors, Couples, Families | 2–4 nights or city base | Prefer for skyline, iconic design, and premium city theatre. |
| **Sentosa** | Joy, Escape | Families, Multi-generation Families, Resort travellers | 2–3 nights or day visits | Use for attractions and resort ease; avoid assuming every family wants a full Sentosa stay. |
| **Civic District / Singapore River** | Discovery, Majesty | Culture travellers, Couples | 2–4 nights or city base | Strong for heritage, museums, and walkable city context. |
| **Chinatown / Little India / Kampong Gelam** | Discovery, Curiosity | Food and culture travellers | Neighbourhood experiences | Use to make Singapore feel lived-in rather than only futuristic. |

## 11.6 Sri Lanka

**Identity:** A compact but richly varied discovery journey through heritage, hills, wildlife, coast, and warm local character.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Serenity, Wonder, Reconnection, Adventure |
| **Best for** | Couples, Families, Friends, Multi-generation Families, Wildlife and culture travellers |
| **Pace** | Relaxed, Balanced, Explorer |
| **Season guidance** | Weather patterns differ across coasts and hills; rail, road, wildlife, and local conditions require route-specific review. |
| **Signature experiences** | Cultural Triangle, Kandy, tea country, scenic rail where appropriate, safari, Galle, coast. |
| **Trade-offs** | Short map distances can involve slow roads; trying to cover the entire island weakens the journey. |

| Region or route | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Cultural Triangle — Sigiriya / Dambulla** | Wonder, Discovery | Families, Culture travellers | 2–3 nights | Prefer for iconic heritage and landscape; steps and heat require consideration. |
| **Kandy** | Spirituality, Discovery | Families, Senior Travellers, Culture travellers | 1–2 nights | Use for living culture and a transition into hill country. |
| **Nuwara Eliya / Ella** | Serenity, Wonder | Couples, Families, Nature travellers | 2–3 nights | Choose according to desired pace, scenery, and transfer rhythm; do not promise a rail experience before confirmation. |
| **Yala / Udawalawe** | Adventure, Wonder | Wildlife travellers, Families | 2 nights | Select reserve based on route and operating context; sightings are not guaranteed. |
| **Galle and the south coast** | Discovery, Romance | Couples, Families, Culture and beach travellers | 2–4 nights | Use for heritage-plus-coast contrast. |
| **Bentota / west-coast resort belt** | Relaxation, Serenity | Families, Couples, Senior Travellers | 2–4 nights | Prefer for a straightforward resort-led beach finish when seasonal conditions fit. |

## 11.7 Thailand

**Identity:** Freedom to combine city energy, generous food culture, islands, beaches, wellness, nightlife, and northern discovery.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Joy, Relaxation, Celebration, Discovery |
| **Best for** | Couples, Honeymoon, Families, Friends, Solo Travellers |
| **Pace** | Relaxed, Balanced, Explorer, Fast-paced |
| **Season guidance** | Rain and sea conditions vary by coast; air quality, heat, events, and ferry conditions require current checks. |
| **Signature experiences** | Bangkok neighbourhoods and food, northern culture, islands, beaches, wellness, markets, selected nightlife. |
| **Trade-offs** | Choosing the wrong beach base can conflict sharply with the desired emotion; avoid overloading island transfers. |

| Region or area | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Bangkok** | Discovery, Joy | First-time visitors, Food travellers, Families, Friends | 2–4 nights | Use for high-energy culture, food, temples, markets, and modern city contrast. |
| **Chiang Mai** | Discovery, Serenity | Couples, Families, Solo Travellers | 3–4 nights | Prefer for northern culture, craft, food, and nature with a gentler city rhythm. |
| **Phuket — quieter beach zones** | Relaxation, Serenity | Families, Couples, Honeymoon | 3–5 nights | Match the exact coast or beach to guest intent; Phuket is not one personality. |
| **Patong** | Celebration, Joy | Friends, Nightlife travellers | 2–4 nights | Recommend only when lively evenings and density are explicit positives. |
| **Krabi / Ao Nang / Railay access** | Escape, Wonder | Couples, Families, Friends | 3–5 nights | Prefer for limestone scenery, island experiences, and a landscape-led beach journey. |
| **Koh Samui** | Relaxation, Indulgence | Couples, Honeymoon, Families | 3–5 nights | Use for resort-led island ease when seasonal conditions align. |

## 11.8 Vietnam

**Identity:** Layered discovery through food, history, energetic cities, heritage towns, dramatic landscapes, and a strong sense of place.

| Attribute | Guidance |
| --- | --- |
| **Supporting emotions** | Curiosity, Wonder, Freedom, Joy |
| **Best for** | Couples, Friends, Families, Solo Travellers, Culture and food travellers |
| **Pace** | Balanced, Explorer, Fast-paced |
| **Season guidance** | The country's length creates major regional weather differences; route-level validation is essential. |
| **Signature experiences** | Hanoi streets and food, Ha Long or alternative bay experience, Hoi An heritage, central coast, Ho Chi Minh City, selected countryside or island extension. |
| **Trade-offs** | Domestic movement can consume the journey; a focused north, central, or south route may outperform national coverage. |

| Region or route | Emotional fit | Best for | Recommended stay | Director note |
| --- | --- | --- | --- | --- |
| **Hanoi** | Discovery, Curiosity | Food and culture travellers, Couples, Friends | 2–3 nights | Prefer for atmospheric streets, history, cafés, and northern context. |
| **Ha Long / Lan Ha area** | Wonder, Serenity | Couples, Families, First-time visitors | 1–2 nights | Select experience style and route carefully; weather and crowd expectations matter. |
| **Hoi An** | Romance, Discovery | Couples, Families, Culture and food travellers | 2–4 nights | Prefer for heritage, food, craft, and a slower central-Vietnam base. |
| **Da Nang** | Joy, Relaxation | Families, Couples, Friends | 2–4 nights | Use for accessible beach-city comfort and as a practical central base. |
| **Ho Chi Minh City** | Joy, Discovery | Friends, Food travellers, Repeat city travellers | 2–3 nights | Prefer for contemporary energy, history, nightlife, and southern food. |
| **Phu Quoc** | Escape, Relaxation | Couples, Honeymoon, Families | 3–4 nights | Use for a beach-led finish when seasonal and operational conditions align. |

---

# 12. Coming Soon Portfolio

The following destinations are represented for portfolio planning only.

They are not eligible for Journey Director recommendations in Release 1.

| Destination | Status | Current position | Activation requirement |
| --- | --- | --- | --- |
| China | `COMING_SOON` | DMC relationship exists; no SMV-operated trip completed. | Complete operating assessment, route validation, commercial readiness, support model, and explicit product approval. |
| Japan | `COMING_SOON` | DMC relationship exists; no SMV-operated trip completed. | Complete operating assessment, route validation, commercial readiness, support model, and explicit product approval. |
| East Africa | `COMING_SOON` | DMC relationships exist; no SMV-operated trip completed. | Define country and safari scope, validate partners and safety standards, complete operations, and explicitly approve each supported route. |
| Australia & New Zealand | `COMING_SOON` | DMC relationships exist; no SMV-operated trip completed. | Separate country-level knowledge, validate routes and suppliers, complete operations, and explicitly approve supported products. |

## 12.1 Hard exclusion rule

`COMING_SOON` records must not:

- enter guest-facing ranking;
- appear as a primary, alternative, or wildcard recommendation;
- be described as a destination SMV serves;
- be surfaced because an AI model considers them an obvious fit;
- be enabled by content publication alone.

## 12.2 Activation checklist

A destination may move to `ACTIVE` only when all required owners approve:

- destination scope and supported regions are defined;
- DMC and supplier readiness are validated;
- service and escalation model is documented;
- commercial and contracting requirements are complete;
- sample itineraries have been operationally reviewed;
- comfort claims are supported by actual inventory depth;
- seasonal, visa, safety, and accessibility dependencies have owners;
- Journey Director training is complete;
- a go-live date and accountable destination owner are recorded;
- Product & Experience explicitly changes the status.

Having operated one isolated request does not automatically activate an entire country or region.

---

# 13. Recommendation Rules

Recommendation rules convert knowledge into consistent judgement.

They should guide the Journey Director without reducing travel design to rigid formulas.

## 13.1 Mandatory gates

Apply in this order:

1. **Status gate** — destination and region must be `ACTIVE`.
2. **Safety and legal gate** — known safety, entry, permit, or legal constraints must be supportable.
3. **Operational gate** — SMV must be able to service the route and guest needs.
4. **Seasonal gate** — conditions for the proposed dates must be acceptable or clearly explained.
5. **Guest-needs gate** — mobility, health, dietary, accessibility, and companion needs must be supportable.
6. **Fit scoring** — only eligible destinations may be compared for emotional and experiential fit.

## 13.2 Positive matching rules

| Traveller signals | Strong candidates | Region guidance |
| --- | --- | --- |
| Reconnection + nature + relaxed pace | Kerala, Bali, Coorg, Kashmir | Kumarakom, Ubud, Coorg, Pahalgam |
| Romance + serenity + premium comfort | Bali, Rajasthan, Kerala, Kashmir | Uluwatu or Nusa Dua, Udaipur, Kumarakom, Pahalgam |
| Family + joy + ease + attractions | Singapore, Dubai, Malaysia | Sentosa/Marina Bay, Downtown/Palm, Kuala Lumpur/Langkawi |
| Culture + food + balanced exploration | Vietnam, Malaysia, Hyderabad, Tamil Nadu | Hanoi/Hoi An, Penang, Old City, Madurai/Thanjavur |
| Majesty + heritage + photography | Rajasthan, Agra, Gujarat | Udaipur/Jodhpur/Jaisalmer, Taj precinct, Kutch/Ahmedabad |
| Wildlife + photography + nature-led stay | Wildlife collection, Assam, Sri Lanka, Gujarat | Kabini/Corbett, Kaziranga, selected reserve, Gir |
| Beaches + celebration + friends | Goa, Thailand, Bali | Anjuna/Vagator, Patong only if nightlife is explicit, Seminyak |
| Beaches + quiet + couple or family | Andaman, Bali, Thailand, Sri Lanka, Malaysia | Swaraj/Shaheed Dweep, Nusa Dua/Sanur, Krabi/Samui, Bentota, Langkawi |
| Mountains + wonder + road journey | Himachal Pradesh, Kashmir, Northeast | Manali/Spiti when suitable, Gulmarg/Pahalgam, Sikkim/Meghalaya/Darjeeling |
| Spirituality + family + gratitude | Amritsar, Tamil Nadu, Gujarat | Golden Temple precinct, Madurai/Rameswaram, Dwarka–Somnath |

## 13.3 Conflict rules

When traveller signals conflict, the Journey Director should not silently choose one.

Examples:

- **Relaxation + maximum coverage** — propose fewer bases and explain the trade-off.
- **Simple comfort + remote luxury imagery** — separate accommodation expectation from destination cost and access.
- **Senior travellers + high-altitude road trip** — pause recommendation until mobility, health, and transfer tolerance are understood.
- **Young children + nightlife-led beach area** — prefer a family-suitable region unless the adults explicitly value that energy.
- **Wildlife + guaranteed sighting expectation** — reset the promise before proceeding.
- **Beach + monsoon dates** — validate conditions and offer an honest alternative if the experience is materially compromised.

## 13.4 Region preference rules

- If the traveller values culture, wellness, and slow travel in Bali, prefer **Ubud** over Kuta.
- If the traveller values premium family or honeymoon beach ease in Bali, prefer **Nusa Dua**.
- If the traveller values dining, shopping, and evening energy in Bali, prefer **Seminyak**.
- If the traveller values stillness and shared time in Kerala, prefer **Kumarakom or Alappuzha** over a multi-stop route.
- If the traveller values tea landscapes and cool hills in Kerala, prefer **Munnar**.
- If the traveller values quieter island landscapes in Thailand, prefer **Krabi or a suitable quieter Phuket zone** over Patong.
- If the traveller values nightlife explicitly in Thailand, Patong may become appropriate; never infer this from age alone.
- If the traveller values serenity in the Nilgiris, consider **Kotagiri** before busier Ooty.
- If the traveller values classic family hill-station familiarity, consider **Ooty**.
- If the traveller values romance and quiet hills, consider **Kodaikanal**.
- If the traveller is new to safari and wants lodge-led balanced comfort, consider **Kabini** when operations fit.

## 13.5 Beautiful Puzzle and Hidden Gem rules

**The Beautiful Puzzle** should preserve the traveller's most important outcome while changing one meaningful dimension.

Example:

- The Perfect Match: Ubud for reconnection and culture.
- The Beautiful Puzzle: Kumarakom for reconnection with gentler logistics and a domestic journey.

**The Hidden Gem** should reveal a credible possibility, not demonstrate cleverness.

It must:

- remain within the active portfolio;
- match the primary emotion strongly;
- differ in a way worth explaining;
- not introduce avoidable operational risk;
- satisfy the deterministic Hidden Gem confidence and evidence thresholds.

## 13.6 Suppression rules

Suppress a destination when:

- the destination or proposed region is not active;
- its strongest value conflicts with the guest's non-negotiable need;
- required transfers undermine the requested pace;
- seasonal conditions materially weaken the intended experience;
- the comfort expectation cannot be supported honestly;
- a safety, permit, health, or accessibility issue remains unresolved;
- the recommendation narrative requires hiding a significant trade-off.

---

# 14. Content and Narrative Guidelines

The Journey Director should sound like a thoughtful travel expert who has read the traveller's story.

It should not sound like an advertisement, a search engine, or a model producing generic destination copy.

## 14.1 Narrative sequence

Each recommendation should follow this order:

1. Reflect what the traveller appears to want.
2. Name the destination and recommended region.
3. Explain the connection using the traveller's own signals.
4. Introduce two to four experiences that express the match.
5. Acknowledge one useful trade-off or planning consideration.
6. Invite the human Journey Director to refine the possibility.

## 14.2 Recommended structure

```text
What we heard

You are looking for...

Our recommendation

Bali — with Ubud as the heart of your journey.

Why this fits you

Because...

Moments we can imagine

- ...
- ...
- ...

One thing to consider

...

What happens next

Your Journey Director will validate the best route, stay style, and timing.
```

## 14.3 Tone principles

Use language that is:

- warm but not theatrical;
- confident but not absolute;
- personal but not invasive;
- imaginative but not misleading;
- specific but not overloaded;
- honest about uncertainty.

## 14.4 Language to prefer

- “Because you told us...”
- “The part of Bali that best reflects this is Ubud...”
- “We believe this is the stronger fit because...”
- “This gives you...”
- “One consideration is...”
- “Your Journey Director will confirm...”

## 14.5 Language to avoid

- “Perfect for everyone.”
- “Guaranteed wildlife sighting.”
- “Best time” without date-specific validation.
- “Hidden gem” for a place that is neither hidden nor operationally understood.
- “Authentic” as an unsupported marketing shortcut.
- “Luxury” when the actual service and accommodation depth has not been validated.
- “Safe” as an absolute claim.
- “AI recommends...”
- “Based on our algorithm...”

## 14.6 Example recommendation

> From what you shared, this journey is less about covering sights and more about having quiet, meaningful time together in a place that still feels culturally rich.
>
> **We recommend Bali, with Ubud as the heart of your journey.**
>
> Ubud aligns with your preference for a slower pace, nature, wellbeing, and experiences that create conversation rather than rush. We can imagine mornings among green landscapes, thoughtful cultural experiences, a gentle wellness ritual, and enough open time for the journey to feel like a break.
>
> One consideration is that Bali traffic can make short distances feel longer. Your Journey Director will therefore keep the route focused and validate the right stay location for your dates.

---

# 15. Governance, Quality, and Roadmap

## 15.1 Ownership

| Responsibility | Accountable owner |
| --- | --- |
| Product philosophy and taxonomy | Product & Experience |
| Destination status | Product & Experience with Operations approval |
| Region and experience knowledge | Destination owner / Journey Design |
| Supplier and service readiness | Operations |
| Seasonal and date-specific validation | Journey Director for each enquiry |
| Technical representation and tests | Engineering |
| Guest-facing narrative quality | Content & Experience |

**Downstream governance:** this section covers Business Layer ownership only. Ownership and change authority for everything downstream — the operational workbook, the generator, generated runtime artefacts, and the runtime candidate catalogue — is governed by `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (Status: Accepted). That ADR also names the current ownership gap for the operational workbook (the "Destination Operational Steward" role, not yet assigned to any Team Satvi persona — ADR Section 15, Outstanding Decision 1); this document does not resolve that gap.

## 15.2 Review cadence

| Review | Minimum cadence | Trigger examples |
| --- | --- | --- |
| Destination status | Monthly and before release | New DMC, paused operations, service failure, launch approval |
| Region intelligence | Quarterly | Guest feedback, new route, crowd or access change |
| Season guidance | Before each selling season | Weather pattern, closure, permit, or schedule change |
| Narrative examples | Quarterly | Repetition, low engagement, misleading language |
| Full specification | Every six months | Portfolio expansion, new Journey Passport fields, engine redesign |

High-risk changes must not wait for the next scheduled review.

## 15.3 Change control

Every material change should record:

- what changed;
- why it changed;
- who approved it;
- which destinations or rules are affected;
- whether technical configuration must also change;
- the effective date.

Destination status changes require explicit approval and a corresponding implementation update.

## 15.4 Quality checks

Before publication or release, verify:

- every active portfolio destination has exactly one primary emotion;
- every destination has at least one active region or an approved destination-level exception;
- every `COMING_SOON` destination is excluded from guest-facing fixtures and tests;
- collection members are correctly mapped;
- Assam is not incorrectly absorbed into the Northeast collection;
- Ooty, Kotagiri, and Kodaikanal remain under Tamil Nadu;
- Kabini, Corbett, Bandipur, and Masinagudi remain under Wildlife;
- recommendation rules use only controlled vocabulary;
- season and duration fields are labelled as indicative;
- narrative examples do not promise availability, weather, wildlife, safety, or visa outcomes.

## 15.5 Release 1 acceptance criteria

Release 1 is ready when:

- the application reads destination status from a single governed source;
- non-active destinations cannot enter recommendation output;
- every recommendation includes destination, region, and an explainable reason;
- the system deterministically generates **The Perfect Match**, **The Beautiful Puzzle**, and **The Hidden Gem** without duplicates when all three meet governed thresholds;
- documented fallback behaviour presents fewer possibilities rather than manufacturing a weak result;
- Hidden Gem recommendations require explicit deterministic logic, strong evidence, and sufficient confidence;
- structured output records the signals that led to the match;
- a Journey Director can override the ranking with a recorded reason;
- automated tests cover portfolio status, collection membership, and suppression rules.

## 15.6 Success measures

The Journey Director should be measured by quality, not only conversion.

Recommended measures include:

- traveller response to “this feels like me”;
- percentage of recommendations accepted for human refinement;
- percentage requiring complete replacement by a Journey Director;
- region-level recommendation usefulness;
- operational rejection rate after recommendation;
- repeated or generic recommendation rate;
- time required for a Journey Director to prepare the first response;
- conversion after recommendation;
- post-trip alignment between promised and experienced journey character.

## 15.7 Roadmap

### Release 1 — Governed rule-based intelligence

- Active portfolio and hard status gate.
- Controlled vocabulary.
- Destination and region profiles.
- Deterministic generation of three differentiated journey possibilities.
- Human consultation, refinement, itinerary design, and final traveller handoff.
- Explainable match reasons.

### Release 2 — Operational depth

- Destination owners and confidence scoring.
- Region-level service depth.
- Transfer intensity.
- Accessibility and mobility notes.
- Seasonal operating windows with review dates.

### Release 3 — AI-assisted recommendation

- Structured extraction from the Journey Passport.
- Ranked destination and region candidates.
- Explanation of decisive signals and trade-offs.
- Human approval workflow.
- Evaluation against a curated recommendation test set.

### Future intelligence

- Hotel and stay-style collections.
- Experience and guide intelligence.
- Flight and gateway practicality.
- Visa and permit services with reliable freshness controls.
- Budget bands and value intelligence.
- Weather and crowd suitability.
- Traveller feedback loops.
- Personalisation from prior journeys with explicit consent.

AI must never activate a destination, override an operational hold, or turn uncertain knowledge into a promise.

---

# 16. Stewardship Questions

Before adding, changing, or using destination intelligence, ask:

## Traveller value

- Does this help the traveller feel understood?
- Does the recommendation reflect the emotion and memory they want?
- Is the region more meaningful than the broad destination name?
- Are we presenting a useful choice rather than more choice?

## Recommendation integrity

- Can we explain why this destination advanced?
- Can we explain why its region is stronger than another region?
- Have we acknowledged material trade-offs?
- Are we using controlled vocabulary consistently?

## Operational confidence

- Is the destination and region currently active?
- Can Search My Vacation confidently deliver this for the guest's dates and needs?
- Is the underlying knowledge current enough to use?
- Does a human need to validate a changing condition before the recommendation is shown?

## Trust

- Are we implying certainty where only possibility exists?
- Would a Journey Director make the same recommendation after reading the Passport?
- Would we be comfortable explaining this recommendation face to face?
- Does the narrative sound like guidance rather than marketing?

The final stewardship principle is simple:

> **Recommend the journey that best fits the traveller from the places Search My Vacation can proudly deliver today.**

---

# 17. Revision History

| Version | Date | Author / Owner | Status | Description |
| --- | --- | --- | --- | --- |
| v1.0.1 | 22 July 2026 | Search My Vacation — Product & Experience | Approved for Release 1 implementation | Clarified deterministic generation of three journey personalities and the human Journey Director's consultation, refinement, itinerary, and handoff responsibilities. |
| v1.0 | 21 July 2026 | Search My Vacation — Product & Experience | Approved for Release 1 implementation | Established the Journey Director destination philosophy, eligibility model, controlled vocabulary, active domestic and international portfolio, region intelligence, coming-soon exclusions, recommendation rules, content guidance, governance, and roadmap. |

---

**End of document**
