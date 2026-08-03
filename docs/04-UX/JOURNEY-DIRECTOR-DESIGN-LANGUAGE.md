# Journey Director Design Language

**Document ID:** UX-JD-DL-001

**Version:** 1.0

**Status:** Approved for Release 1

**Owner:** Search My Vacation Product & Experience Team

**Last Updated:** July 2026

---

# Revision History

| Version | Date | Summary |
|----------|------|---------|
| 1.0 | July 2026 | Initial Design Language defining the philosophy, emotional principles, recommendation model, visual language and experience guidelines for the Journey Director. |

---

# 1. Purpose

The Journey Director is not simply another recommendation engine.

It represents the digital embodiment of Search My Vacation's travel expertise.

This document establishes the design language, emotional principles and experience standards that govern every Journey Director interaction. It ensures that every recommendation, every screen, every piece of copy and every visual element consistently reflects the Search My Vacation brand philosophy.

Unlike implementation specifications, this document intentionally focuses on **how the Journey Director should feel**, **how travellers should experience it**, and **what principles should guide future design decisions**.

It serves as the long-term reference for designers, developers, product owners and future contributors involved in evolving the Journey Director.

---

# 2. Vision

The Journey Director exists to recreate the feeling of speaking with an experienced travel consultant who genuinely listens before making thoughtful recommendations.

Rather than overwhelming travellers with hundreds of destinations, filters or package comparisons, the Journey Director carefully understands the traveller's aspirations and curates a small number of highly relevant possibilities.

The ultimate goal is not simply helping travellers choose a destination.

The goal is helping travellers feel understood.

By the end of the experience, travellers should naturally feel:

> "This recommendation feels like it was made specifically for me."

The Journey Director should inspire confidence through thoughtful curation, personal understanding and emotional storytelling rather than through technology, algorithms or sales techniques.

---

# 3. Product Philosophy

Search My Vacation believes that every traveller is unique.

Therefore, every journey should be unique.

The Journey Director exists to transform that belief into a digital experience.

Its responsibility is not to predict where somebody should travel.

Its responsibility is to understand the traveller well enough to recommend experiences that genuinely align with their aspirations.

Every recommendation should demonstrate three qualities:

- Personal
- Explainable
- Actionable

Recommendations should never appear random.

Likewise, they should never appear artificially generated.

Instead, they should feel like the outcome of thoughtful consideration by an experienced travel advisor.

The Journey Director should consistently communicate one message:

> "We've listened carefully to what matters most to you, and these are the journeys we genuinely believe you'll enjoy."

---

# 4. Experience-First Recommendation Philosophy

Traditional travel websites begin with destinations.

The Journey Director begins with people.

Instead of asking:

> "Where would you like to go?"

the Journey Director asks:

> "What kind of journey are you hoping to experience?"

This subtle shift changes the entire experience.

Travellers rarely dream about countries.

They dream about feelings.

They imagine peaceful mornings, meaningful family moments, breathtaking landscapes, cultural discoveries, celebrations, relaxation or adventure.

Destinations become meaningful only because they enable those emotions.

For this reason, the Journey Director always prioritises the traveller's desired experience before considering geography.

The recommendation journey therefore follows a deliberate hierarchy:

```
Traveller

↓

Intent

↓

Experience

↓

Destination

↓

Stay Area

↓

Personalised Narrative
```

Every recommendation presented by the Journey Director should be a natural outcome of this experience-first philosophy.

---

# 5. Core Design Principles

The following principles govern every current and future Journey Director experience.

These principles are considered foundational and should remain consistent across future releases unless intentionally revised.

---

## Principle 1 — Understand Before Recommending

The Journey Director should never rush into recommendations.

Travellers should feel that enough information has been gathered to understand their aspirations before destinations are introduced.

Every recommendation should feel earned.

---

## Principle 2 — Inspire, Never Sell

The Journey Director should never sound like a sales brochure.

Recommendations should inspire curiosity and excitement rather than promote packages or discounts.

The focus should always remain on experiences, memories and possibilities.

Avoid language such as:

- Our Packages
- Best Deal
- Lowest Price
- Limited Offer
- Book Now

Instead favour language such as:

- Discover
- Imagine
- Experience
- Explore
- Enjoy
- Create Memories

---

## Principle 3 — Explain Every Recommendation

Recommendations should never feel mysterious.

Travellers should always understand why a destination has been recommended.

Every destination should include a concise narrative connecting the traveller's preferences with the destination's strengths.

The Journey Director should answer:

- Why this destination?
- Why this stay area?
- Why does this suit me?

before encouraging any further action.

---

## Principle 4 — Recommend What We Can Deliver

Every recommendation made by the Journey Director must represent an experience that Search My Vacation can confidently design and deliver today.

The Journey Director is **not** a destination discovery platform.

It is the digital travel consultant for Search My Vacation.

Accordingly, recommendations must only come from destinations that are currently supported by the business.

For example:

Supported:

- Bali
- Dubai
- Vietnam
- Kerala
- Rajasthan

Not currently supported:

- China
- Japan
- Peru
- Iceland

Unsupported destinations must never appear in traveller recommendations until they become part of the official Search My Vacation destination catalogue.

This principle ensures that every recommendation is immediately actionable by the Journey Director team and maintains complete alignment between the digital experience and the services offered by the business.

---

## Principle 5 — Recommend Experiences, Not Just Destinations

Travellers do not create memories inside political boundaries.

They create memories within neighbourhoods, islands, towns, valleys, beaches and mountain villages.

Accordingly, recommendations should move beyond simply identifying destinations.

Whenever appropriate, recommendations should identify the most suitable stay area within the destination.

For example:

Instead of recommending:

> Bali

the Journey Director should recommend:

> Bali — Ubud

or

> Bali — Seminyak

depending on the traveller's aspirations.

This additional level of specificity transforms recommendations from generic suggestions into thoughtfully curated travel advice.

The preferred stay area becomes an essential part of the recommendation rather than an itinerary detail.

---

## Principle 6 — Multiple Right Answers

Travel is deeply personal.

There is rarely a single perfect answer.

The Journey Director should therefore present a carefully curated shortlist of possibilities rather than a single definitive recommendation.

Each recommendation should feel equally valid while offering a different perspective on the traveller's aspirations.

Rather than competing against one another, the recommendations should complement each other and encourage thoughtful exploration.

The Journey Director should behave like an experienced consultant saying:

> "Here are three journeys I genuinely think you'll love, and here's why each one is special."

---

## Principle 7 — Confidence Without Pressure

Travellers should never feel rushed.

Recommendations should build confidence rather than urgency.

Avoid pressure-oriented interactions including countdowns, scarcity messaging or aggressive calls to action.

The Journey Director should always leave travellers feeling comfortable, informed and excited about continuing the conversation with Search My Vacation.

Its purpose is to begin a trusted relationship—not to force an immediate booking.

---

# 6. Recommendation Hierarchy

Every recommendation generated by the Journey Director should follow a consistent hierarchy.

The objective is to gradually transform a traveller's aspirations into a carefully curated recommendation that feels both personal and credible.

The recommendation hierarchy is intentionally designed to mirror the way experienced travel consultants naturally think.

```
Traveller

↓

Traveller Intent

↓

Experience Profile

↓

Destination

↓

Preferred Stay Area

↓

Experience Anchors

↓

Personalised Narrative
```

Each stage progressively narrows the possibilities until the Journey Director confidently presents a small number of highly relevant journeys.

This hierarchy should remain consistent across all future releases.

---

## 6.1 Traveller Intent

The Journey Passport captures explicit traveller preferences such as:

- Travel companions
- Dream journey
- Desired memories
- Travel timing
- Comfort expectations
- Journey pace
- Personal preferences

Collectively these responses describe the traveller's intent rather than their preferred destination.

The Journey Director should always interpret these responses as emotional signals instead of simple survey answers.

---

## 6.2 Experience Profile

Traveller intent is translated into an internal Experience Profile.

The Experience Profile represents the types of experiences the traveller is seeking.

Examples include:

- Nature
- Beaches
- Mountains
- Wellness
- Romance
- Family Time
- Celebration
- Adventure
- Wildlife
- Culture
- Food
- Luxury
- Slow Travel
- Photography
- Spiritual Experiences

The Journey Director should think in terms of experiences before considering destinations.

---

## 6.3 Destination Selection

Once the desired experiences are understood, the Journey Director identifies the destinations that best support those aspirations.

Importantly, destination selection should always be constrained by the destinations currently served by Search My Vacation.

This ensures every recommendation can immediately progress into a professionally designed itinerary without disappointing the traveller.

The recommendation engine therefore answers:

> "Which of our destinations best delivers this experience?"

rather than:

> "Which destination exists in the world?"

---

## 6.4 Preferred Stay Area

Destinations should not represent the final recommendation.

Instead, the Journey Director should identify the most appropriate stay area within the destination.

Different stay areas often provide completely different experiences despite belonging to the same destination.

For example:

### Bali

Possible stay areas include:

- Ubud
- Seminyak
- Nusa Dua
- Kuta
- Uluwatu
- Jimbaran

Each of these areas serves different traveller expectations.

Similarly:

### Kerala

Possible stay areas include:

- Munnar
- Thekkady
- Kumarakom
- Alleppey
- Wayanad
- Kochi

Likewise:

### Thailand

Possible stay areas include:

- Phuket
- Krabi
- Chiang Mai
- Koh Samui
- Pattaya

The Journey Director should recommend the stay area that most naturally aligns with the traveller's aspirations rather than simply recommending the destination itself.

---

## 6.5 Recommendation Personalities

When three qualified possibilities are available, the Journey Director presents them with these exact traveller-facing names:

- **The Perfect Match** — the destination with the strongest overall alignment to the traveller's expressed needs and preferences.
- **The Beautiful Puzzle** — a destination that fits strongly while introducing a thoughtful contrast, trade-off or unexpected dimension that makes the option compelling.
- **The Hidden Gem** — a credible, served and well-supported destination that may be less obvious but still aligns meaningfully with the traveller.

These are recommendation personalities, not first, second and third place. Their names must remain consistent across shortlist cards, detailed stories, saved journey summaries, handoff copy and accessibility text.

The deterministic engine continues to own eligibility, scoring, diversity, novelty, confidence and fallback behaviour. Presentation must never manufacture a personality merely to fill the shortlist.

---

# 7. Experience Anchors

Experience Anchors are the emotional building blocks of the Journey Director.

Every supported stay area should be described using a structured collection of emotional and experiential characteristics.

These anchors provide the foundation for recommendation quality and consistency.

Rather than relying on subjective judgement, every recommendation should reference predefined Experience Anchors.

---

## 7.1 Purpose

Experience Anchors allow the Journey Director to answer an important question:

> "What does this place genuinely feel like?"

They define the emotional personality of a destination rather than merely listing tourist attractions.

This allows recommendations to feel deeply personal while remaining completely deterministic.

---

## 7.2 Experience Anchor Categories

Each supported stay area should document structured information including:

### Emotional Atmosphere

Examples:

- Peaceful
- Romantic
- Vibrant
- Adventurous
- Luxurious
- Spiritual
- Cultural
- Energetic
- Family Friendly

---

### Signature Experiences

Examples:

- Sunrise viewpoints
- Rice terraces
- Wildlife safaris
- Boutique resorts
- Local markets
- Temple visits
- Luxury dining
- Scenic train journeys
- Beach sunsets
- Heritage walks

---

### Ideal Traveller Types

Examples:

- Couples
- Families
- Solo Travellers
- Friends
- Multi-generation Families
- Luxury Travellers
- Nature Lovers
- Food Enthusiasts

---

### Companion Suitability

Document how suitable the stay area is for:

- Solo Travel
- Couples
- Families
- Friends
- Senior Travellers
- Children

---

### Comfort Positioning

Examples:

- Simple
- Balanced
- Premium
- Luxury

---

### Journey Pace

Examples:

- Relaxed
- Balanced
- Active

---

### Typical Trip Duration

Examples:

- Weekend
- Four Nights
- One Week
- Extended Journey

---

### Seasonal Strengths

Document when the destination performs best and whether certain experiences become significantly stronger during specific seasons.

This information allows recommendations to remain practical as well as inspirational.

---

## 7.3 Example

Example:

### Bali — Ubud

Emotional Atmosphere

- Peaceful
- Cultural
- Reflective
- Romantic

Signature Experiences

- Rice terraces
- Boutique wellness retreats
- Balinese culture
- Local cafés
- Artisan villages

Ideal Traveller Types

- Couples
- Honeymooners
- Wellness Travellers
- Slow Travellers

Comfort Positioning

- Balanced
- Premium

Journey Pace

- Relaxed

This structured representation allows the Journey Director to explain not only why Bali is suitable, but why Ubud is a stronger recommendation than another stay area within Bali.

---

## 7.4 Future Reuse

Experience Anchors are intended to become a shared knowledge framework across the Search My Vacation platform.

They should support:

- Journey Director recommendations
- Destination pages
- Itinerary generation
- Future AI experiences
- Internal travel consultant guidance
- Marketing storytelling
- Content strategy

Maintaining a single source of truth ensures consistency across every traveller touchpoint.

---

# 8. Emotional Journey

The Journey Director should gradually guide travellers through a sequence of carefully designed emotional states.

Each stage should naturally prepare the traveller for the next.

| Stage | Desired Emotion |
|--------|-----------------|
| Journey Passport Complete | Curiosity |
| Recommendation Introduction | Anticipation |
| Journey Shortlist | Discovery |
| Why This Fits You | Understanding |
| Imagine Yourself Here | Excitement |
| Connect With Us | Confidence |

The emotional progression should always feel calm, optimistic and reassuring.

Travellers should never feel overwhelmed or pressured.

Instead, each recommendation should reinforce the belief that Search My Vacation genuinely understands what they are looking for.

---

# 9. Visual Design Language

The Journey Director should present recommendations with the warmth and confidence of an experienced travel consultant.

Its visual identity should feel more refined than a traditional travel booking website while remaining approachable and human.

The overall aesthetic should communicate:

- Premium
- Trustworthy
- Editorial
- Cinematic
- Authentic
- Aspirational

Visual design should prioritise emotional storytelling over promotional graphics.

Large destination imagery should establish atmosphere before supporting information appears.

Generous spacing, restrained typography and immersive photography should encourage travellers to pause, absorb and imagine themselves within each destination rather than simply scanning content.

Every visual decision should reinforce one central idea:

> "This journey was thoughtfully chosen for you."

---

# 10. Typography Language

Typography plays a significant role in shaping the emotional tone of the Journey Director.

Rather than presenting information in a dense, transactional format, typography should encourage travellers to pause, reflect and imagine themselves experiencing each journey.

The visual hierarchy should remain clean, spacious and highly readable across desktop, tablet and mobile devices.

---

## 10.1 Hierarchy

The Journey Director should consistently use three primary levels of typography.

### Level 1 — Emotional Headline

Purpose:

Capture attention through emotion rather than information.

Examples:

> Imagine waking up to mist-covered rice terraces.

> A journey designed around the memories you want to create.

Characteristics:

- Largest text on the screen
- Strong visual presence
- Short and memorable
- One or two lines where possible

---

### Level 2 — Supporting Narrative

Purpose:

Explain the recommendation in a warm and conversational tone.

Examples:

> Based on everything you've shared, Ubud feels like the perfect place to slow down, reconnect and experience the quieter side of Bali.

Characteristics:

- Comfortable reading length
- Natural language
- Friendly and reassuring

---

### Level 3 — Supporting Information

Purpose:

Provide practical information without competing with the emotional narrative.

Examples include:

- Stay area
- Journey duration
- Comfort level
- Best season
- Signature experiences

Supporting information should remain visually secondary throughout the experience.

---

# 11. Motion Language

Motion should reinforce confidence rather than attract attention.

Animations should feel calm, deliberate and purposeful.

The objective is to guide the traveller naturally from one moment to the next without creating unnecessary distraction.

---

## 11.1 Principles

Motion should feel:

- Smooth
- Elegant
- Predictable
- Unhurried
- Human

Avoid motion that feels playful or exaggerated.

The Journey Director is a premium travel consultant—not an entertainment interface.

---

## 11.2 Recommended Motion

Preferred transitions include:

- Gentle fade-ins
- Soft upward movement
- Subtle scale transitions
- Progressive content reveal
- Staggered appearance of recommendation cards

These animations help establish rhythm without overwhelming the traveller.

---

## 11.3 Motion to Avoid

Avoid:

- Bounce animations
- Rapid zoom effects
- Rotating elements
- Flashing transitions
- Excessive parallax
- Distracting hover effects

Every animation should support understanding rather than demand attention.

---

# 12. Recommendation Card Design Language

Recommendation cards represent the most important visual component within the Journey Director.

Each card should feel like a thoughtfully prepared travel suggestion rather than a product listing.

The design should encourage exploration and emotional connection before practical evaluation.

---

## 12.1 Card Structure

Every recommendation card should consistently present:

1. Hero destination image

2. Destination name

3. Preferred stay area

4. Emotional recommendation statement

5. Signature experiences

6. Primary action

This hierarchy should remain consistent across all recommendation screens.

---

## 12.2 Destination Imagery

Photography should always communicate atmosphere before location.

Images should:

- Feel editorial
- Be authentic
- Showcase real experiences
- Avoid excessive promotional styling
- Immediately communicate emotion

The traveller should recognise the feeling of the destination before analysing its details.

---

## 12.3 Preferred Stay Area

The preferred stay area should be displayed prominently beneath the destination name.

Example:

**Bali**

Recommended Stay:

**Ubud**

This reinforces the Journey Director's role as a knowledgeable travel advisor rather than a destination search engine.

---

## 12.4 Emotional Recommendation

Each recommendation card should contain a concise narrative explaining why the recommendation feels appropriate.

Examples:

> Perfect for slowing down and reconnecting with nature.

> Ideal if you're looking for a balance of culture, relaxation and boutique luxury.

This narrative should always feel personal rather than promotional.

---

## 12.5 Signature Experiences

Instead of listing facilities or attractions, recommendation cards should highlight memorable experiences.

Examples:

- Sunrise over the mountains
- Local culinary discoveries
- Boutique wellness retreats
- Scenic coastal drives
- Cultural storytelling
- Wildlife encounters

Experience-based language is significantly more engaging than feature-based descriptions.

---

# 13. Copywriting Language

The Journey Director should speak with warmth, confidence and empathy.

Every sentence should feel as though it comes from an experienced travel consultant who has listened carefully before offering advice.

---

## 13.1 Tone of Voice

The overall tone should be:

- Friendly
- Calm
- Thoughtful
- Knowledgeable
- Encouraging

Never overly formal.

Never overly casual.

Never sales-oriented.

---

## 13.2 Preferred Language

Prefer language such as:

- Discover
- Imagine
- Enjoy
- Experience
- Wander
- Unwind
- Celebrate
- Explore

These words encourage emotional engagement without creating pressure.

---

## 13.3 Language to Avoid

Avoid transactional language including:

- Best Package
- Lowest Price
- Limited Offer
- Book Today
- Hurry
- Cheapest
- Exclusive Deal

The Journey Director is focused on inspiring meaningful journeys rather than driving immediate sales.

---

## 13.4 Recommendation Narratives

Recommendation narratives should always answer three questions:

Why this destination?

Why this stay area?

Why does it suit this traveller?

Every recommendation should leave the traveller feeling understood.

---

# 14. Information Hierarchy

Information should always appear in the order that travellers naturally process decisions.

The recommended hierarchy is:

1. Emotional headline

2. Supporting narrative

3. Destination imagery

4. Destination

5. Preferred stay area

6. Signature experiences

7. Practical travel insights

8. Primary action

This order ensures that emotion leads, understanding follows and practical details support the decision.

---

# 15. Accessibility & Responsive Experience

The Journey Director should remain inclusive and enjoyable for all travellers regardless of device or accessibility requirements.

Accessibility should be considered a design requirement rather than a technical enhancement.

---

## 15.1 Readability

Maintain:

- Strong colour contrast
- Comfortable line lengths
- Clear spacing
- Consistent typography hierarchy

Avoid placing text over complex imagery without sufficient contrast.

---

## 15.2 Responsive Behaviour

The experience should adapt naturally across:

- Desktop
- Laptop
- Tablet
- Mobile

Recommendation cards should preserve their hierarchy regardless of screen size.

Images should scale gracefully without losing their emotional impact.

---

## 15.3 Touch Interaction

Interactive elements should remain easy to use on touch devices.

Buttons and cards should provide generous touch targets and consistent spacing.

Horizontal scrolling should be avoided unless it significantly improves usability.

---

## 15.4 Motion Accessibility

Travellers who prefer reduced motion should receive a simplified experience.

Animations should gracefully reduce while preserving the overall flow and emotional progression.

Accessibility preferences should never diminish the quality of the recommendations themselves.

---

# 16. Design Governance

The Journey Director is expected to evolve significantly over time.

New destinations will be added, traveller insights will become richer and future releases may introduce AI-assisted itinerary generation, adaptive storytelling and deeper personalisation.

To preserve a consistent traveller experience, every enhancement should continue to follow the design language established within this document.

The following governance principles are considered non-negotiable unless this document itself is formally revised.

---

## 16.1 Every Recommendation Must Be Explainable

Travellers should never wonder why a destination has been recommended.

Every recommendation must be supported by a clear narrative connecting the traveller's preferences with the destination's strengths.

The Journey Director should always be capable of answering:

- Why this destination?
- Why this stay area?
- Why this experience?

Transparency builds confidence.

Confidence builds trust.

---

## 16.2 Every Recommendation Must Be Actionable

Every recommendation must correspond to an experience that Search My Vacation can confidently design and deliver.

Recommendations should never include unsupported destinations simply because they achieve a high theoretical match.

Operational capability should always remain aligned with the digital experience.

---

## 16.3 Every Recommendation Must Include a Preferred Stay Area

Destination-level recommendations are intentionally incomplete.

Wherever appropriate, the Journey Director should recommend both:

- Destination
- Preferred Stay Area

Examples:

- Bali — Ubud
- Dubai — Palm Jumeirah
- Vietnam — Hoi An
- Kerala — Munnar

This additional level of guidance transforms recommendations into practical travel advice.

---

## 16.4 Every Stay Area Must Have Experience Anchors

A stay area should never exist within the recommendation engine without documented Experience Anchors.

These anchors ensure that recommendations remain:

- Consistent
- Explainable
- Deterministic
- Maintainable

Future destinations should not be introduced until their Experience Anchors have been fully documented.

---

## 16.5 The Journey Director Should Never Expose Internal Decision Logic

Travellers should experience thoughtful recommendations rather than technical processes.

Internal concepts such as:

- Scores
- Ranking
- Matching percentages
- Decision trees
- Algorithms
- Weightings

should remain implementation details.

The traveller should simply experience confident and well-explained recommendations.

---

## 16.6 Consistency Across Touchpoints

Recommendations generated by the Journey Director should remain consistent with:

- Destination Pages
- Travel Inspiration
- Future Itinerary Builder
- AI Assistants
- Marketing Campaigns
- Internal Consultant Guidance

A traveller should receive the same underlying recommendation regardless of where they interact with Search My Vacation.

---

# 17. Future Evolution

This document has been intentionally written to support future growth.

Potential future capabilities include:

- AI-assisted itinerary generation
- Dynamic recommendation refinement
- Seasonal recommendation adjustments
- Traveller preference learning
- Repeat traveller recognition
- Multi-country journey design
- Luxury journey specialisation
- Corporate travel experiences
- Educational journeys
- Wellness programmes
- Anniversary and celebration planning

These capabilities should enhance the Journey Director without changing its fundamental philosophy.

Regardless of future technology, the Journey Director should always feel like a trusted travel consultant rather than an automated recommendation engine.

---

# 18. Success Criteria

The Journey Director should ultimately be evaluated by the quality of the traveller's emotional experience rather than the complexity of its underlying technology.

A successful Journey Director enables travellers to say:

> "These recommendations genuinely feel like they were chosen for me."

It should also create confidence within the Search My Vacation team by ensuring every recommendation is:

- Personal
- Relevant
- Explainable
- Operationally achievable

The ideal Journey Director is one that travellers naturally trust before they ever speak with a human consultant.

Technology should quietly support that trust rather than become the focus of the experience.

---

# 19. Closing Statement

Search My Vacation was founded on a simple belief:

> Every traveller is unique. Every journey should be too.

The Journey Director exists to bring that belief to life.

Its purpose is not to replace the expertise of a travel consultant.

Its purpose is to extend that expertise into a thoughtful digital experience that listens first, understands deeply and recommends with confidence.

Every screen, every recommendation and every interaction should reinforce the feeling that the traveller is speaking with someone who genuinely understands what they are hoping to experience.

When designed and implemented according to the principles within this document, the Journey Director becomes more than a feature.

It becomes the digital embodiment of the Search My Vacation promise.

---

## Relationship with Other Journey Director Documents

This document defines the design philosophy and governing principles for the Journey Director.

It should be read alongside the following companion documents:

- **JOURNEY-DIRECTOR-EXPERIENCE.md** — Defines the traveller journey, screen flow, interaction patterns and user experience.
- **JOURNEY-DIRECTOR-DECISION-ENGINE.md** — Defines the deterministic recommendation engine, decision flow and implementation logic.
- **DESTINATION-KNOWLEDGE-BASE.md** — Defines supported destinations, preferred stay areas and their Experience Anchors.

Together, these documents form the complete functional, experiential and technical specification for the Journey Director.

---

**End of Document**
