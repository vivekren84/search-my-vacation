# JOURNEY DIRECTOR EXPERIENCE

## 1. Document Header

| Document Field | Value |
| --- | --- |
| **Document Name** | Journey Director Experience |
| **Document ID** | JDE-001 |
| **Version** | v1.0 |
| **Status** | Draft for Product and UX Review |
| **Owner** | Search My Vacation – Product & Experience |
| **Last Updated** | 21 July 2026 |
| **Document Type** | User Experience Specification |
| **Experience Stage** | Post–Journey Passport Recommendation Experience |
| **Purpose** | Define the experience vision, goals, principles and end-to-end journey for the first Journey Director experience presented after a traveller completes the Journey Passport. |

> **Audience:** Product Managers, Journey Directors, UX Designers, Content Strategists, Frontend Developers, Solution Architects, Quality Engineers, Operations Leaders and future custodians of the Search My Vacation recommendation experience.

### 1.1 Document Purpose

This document defines how the Journey Director should feel and behave from the moment a traveller submits the Journey Passport until they are invited to continue with a human Journey Designer.

It establishes the emotional and structural foundation for the experience before visual design, recommendation logic and technical implementation begin.

The specification is intentionally implementation-independent.

It describes the experience Search My Vacation must create regardless of whether recommendations are prepared manually, supported by business rules or assisted by artificial intelligence in future releases.

This document answers five foundational questions:

1. What should the Journey Director experience make the traveller feel?
2. What outcomes should the experience achieve?
3. Which principles should guide every product, content and design decision?
4. How should the traveller move from Passport submission to recommendation and human handoff?
5. What must remain true as the experience evolves?

Detailed screen specifications, interaction behaviours, content patterns and future enhancements may extend this document in later sections without changing the foundations defined here.

---

### 1.2 Scope

Version 1.0 covers the experience that begins when the traveller selects **Discover My Possibilities** after completing the Journey Passport.

It includes:

- acknowledgement that the Journey Passport has been received;
- a purposeful transition into the Journey Director experience;
- reflection of the traveller's story and priorities;
- introduction of a curated destination recommendation;
- introduction of the most suitable city, region or area within that destination;
- explanation of why the recommendation fits;
- presentation of signature experience possibilities;
- presentation of a small number of carefully considered alternatives, when appropriate;
- a clear invitation to continue with a human Journey Designer; and
- graceful handling of incomplete, unavailable or low-confidence recommendation states.

Version 1.0 does not define:

- the complete recommendation scoring model;
- destination ranking weights;
- AI model selection or prompt design;
- final itinerary creation;
- live hotel or flight inventory;
- real-time pricing;
- booking or payment flows; or
- the internal Journey Designer workspace.

Those capabilities may connect to the Journey Director experience, but they are not part of this UX specification.

---

### 1.3 Related Product Documents

| Document | Relationship to the Journey Director Experience |
| --- | --- |
| **Product Vision** | Defines why Search My Vacation exists and the value it promises to travellers. |
| **Journey Passport v1.0** | Defines how Search My Vacation listens to and understands the traveller before making recommendations. |
| **Destination Knowledge Base** | Defines the destinations, regions, emotional identities and experiences Search My Vacation can confidently recommend. |
| **Journey Director Decision Engine** | Future document defining how traveller signals and destination intelligence are evaluated to produce recommendations. |
| **EBC-003 – Journey Director Implementation** | Future build card translating the approved experience into implementation requirements. |

The Journey Director Experience is the bridge between traveller understanding and destination intelligence.

The Journey Passport answers:

> **Who is this traveller, and what are they hoping to experience?**

The Destination Knowledge Base answers:

> **Which destinations and regions can Search My Vacation confidently deliver?**

The Journey Director Experience answers:

> **How should that understanding be reflected back to the traveller in a way that feels personal, credible and inspiring?**

---

### 1.4 Product Commitments

The Journey Director Experience makes the following commitments:

- It will listen before it recommends.
- It will recommend only destinations Search My Vacation actively serves.
- It will recommend at the most meaningful level possible, including a city, region or area when that improves the quality of the guidance.
- It will explain why each recommendation fits the traveller.
- It will favour a few confident possibilities over an exhaustive catalogue.
- It will never present generated content as confirmed operational truth without validation.
- It will preserve a visible and intentional path to a human Journey Designer.
- It will treat the traveller's attention, personal information and trust with care.

---

### 1.5 Revision History

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| v1.0 | 21 July 2026 | Search My Vacation – Product & Experience | Initial UX specification covering Document Header, Experience Vision, Experience Goals, Experience Principles and Journey Flow. |

---

## 2. Experience Vision

The Journey Director is the moment when listening becomes understanding.

Until this point, the traveller has shared information through the Journey Passport: who they are travelling with, what kind of memories they hope to create, how they like to travel and what matters most to them.

The Journey Director must demonstrate that this information was not merely collected.

It was heard.

It was considered.

It shaped the recommendation.

The desired traveller reaction is not:

> “I received a list of destinations.”

It is:

> **“Someone understood the journey I have been trying to imagine.”**

That feeling is the defining outcome of the experience.

The Journey Director should feel like a thoughtful travel expert who has taken a moment to reflect before speaking. It should create anticipation without theatre for its own sake, confidence without overclaiming and inspiration without overwhelming the traveller.

It is not a search-results page.

It is not a chatbot response.

It is not a catalogue of packages.

It is a carefully paced recommendation conversation.

---

### 2.1 The Experience Promise

The Journey Director Experience promises to turn the traveller's story into a small set of meaningful possibilities.

Every traveller should leave the experience understanding:

- what Search My Vacation heard;
- what kind of journey may suit them;
- which destination is being recommended;
- which city, region or area within that destination is the strongest fit;
- why that recommendation reflects their priorities;
- which experiences may bring the journey to life; and
- what happens next if they choose to continue.

The recommendation must feel considered even when the underlying technology is simple.

Sophistication should be experienced through clarity, relevance and care rather than through visible complexity.

---

### 2.2 The Emotional Arc

The Journey Director should guide the traveller through five emotional stages.

| Stage | Traveller Feeling | Experience Responsibility |
| --- | --- | --- |
| **Acknowledgement** | “My Passport has been received.” | Confirm the traveller's action immediately and remove uncertainty. |
| **Anticipation** | “Something is being thoughtfully prepared.” | Use a calm, purposeful transition that signals care without creating artificial delay. |
| **Recognition** | “They understood what matters to me.” | Reflect the traveller's priorities in clear, human language before revealing a destination. |
| **Possibility** | “I can imagine myself there.” | Reveal the destination, region and signature experiences as an emotionally coherent recommendation. |
| **Confidence** | “I know why this fits and what to do next.” | Explain the reasoning, acknowledge important considerations and offer a clear human handoff. |

The traveller should not move directly from form submission to a destination card.

The recommendation should feel earned through recognition.

The Journey Director first demonstrates understanding.

Then it offers direction.

---

### 2.3 The Signature Moment

The signature moment occurs immediately before the primary destination is revealed.

The Journey Director reflects one meaningful insight from the traveller's Passport, such as:

> **“One thing stood out: you are not simply looking for a holiday. You are looking for unhurried time together, surrounded by nature, with enough comfort for everyone to truly relax.”**

Only after this reflection should the recommendation appear:

> **“Because of that, we believe Kerala could be a wonderful fit — especially the quiet backwaters around Alleppey.”**

This sequence differentiates the Journey Director from an online travel agency.

It connects the recommendation to the traveller's life before introducing the destination.

The destination is not presented as inventory.

It is presented as an answer.

---

### 2.4 Destination and Region as One Recommendation

The Journey Director should recommend at the most meaningful level available.

In many cases, a country or state is too broad to express the intended experience.

Bali may suit a traveller, but Ubud, Seminyak and Nusa Dua offer meaningfully different journeys.

Kerala may suit a traveller, but Munnar, Alleppey and Kovalam create different memories.

The experience should therefore treat the destination and its recommended region as one connected recommendation:

> **Bali, beginning in Ubud**

> **Kerala, centred around Alleppey**

> **Thailand, with Krabi as the heart of the journey**

The destination provides recognition.

The region provides relevance.

When region-level intelligence is not yet sufficiently confident, the experience may recommend the broader destination and clearly reserve the regional decision for the Journey Designer.

It must never imply false precision.

---

### 2.5 Human, Not Artificial

The Journey Director may be supported by technology, but the experience should never ask the traveller to admire the technology.

The traveller should encounter:

- warmth rather than novelty;
- guidance rather than computation;
- reasons rather than scores;
- possibilities rather than predictions; and
- a human next step rather than a dead end.

Terms such as **AI-generated**, **algorithmic match**, **confidence score**, **prompt**, **model** or **recommendation engine** should not appear in the traveller-facing experience.

The visible identity is the Journey Director: a trusted expression of Search My Vacation's collective destination knowledge and human travel expertise.

Technology may assist behind the scenes.

Accountability remains with Search My Vacation.

---

### 2.6 Premium Without Pretence

The experience should feel premium because it is composed, clear and attentive.

Premium does not mean excessive animation, ornamental language or artificial suspense.

It means:

- every transition has a purpose;
- every sentence contributes meaning;
- imagery supports the recommendation rather than decorating it;
- the traveller remains oriented throughout the experience;
- motion respects accessibility and device capability;
- the experience performs reliably; and
- the path to human support is always clear.

The Journey Director should create a sense of occasion while remaining honest about what has occurred.

If a recommendation is already available, the interface should not force a long loading sequence merely to appear intelligent.

If additional time is genuinely required, the experience should communicate progress calmly and provide a safe continuation path.

---

### 2.7 The Long-Term Vision

The Journey Director Experience should remain recognisable as capabilities grow.

Future releases may introduce richer destination intelligence, multiple recommendation strategies, dynamic imagery, voice, video, collaborative planning, maps, live availability and AI-assisted personalisation.

Those enhancements should deepen the conversation without changing its sequence of trust:

**Listen**

↓

**Reflect**

↓

**Recommend**

↓

**Explain**

↓

**Invite**

The Journey Director should become more capable over time without becoming less human.

---

## 3. Experience Goals

The Journey Director Experience must create value for the traveller and for Search My Vacation at the same time.

Traveller value comes from feeling understood, discovering relevant possibilities and gaining confidence in the next step.

Business value comes from demonstrating expertise, improving recommendation quality and creating a more intentional path to a human conversation.

The experience should not optimise one at the expense of the other.

---

### 3.1 Goal One – Make the Traveller Feel Understood

The first responsibility of the Journey Director is to prove that the Journey Passport mattered.

Before presenting a destination, the experience should reflect the traveller's priorities in a concise and recognisable way.

The reflection should be specific enough to feel personal but restrained enough to remain accurate.

It should draw from information the traveller actually provided.

It must not invent motivations, relationships, constraints or emotional states.

The goal is achieved when the traveller can recognise their own intent in the Journey Director's summary.

**Experience indicators:**

- The summary references the traveller's selected companion type, desired journey character or stated memory goal where relevant.
- The summary uses natural language rather than repeating form labels.
- The traveller can correct or revisit their Passport if the reflection does not feel right.
- The destination reveal follows the reflection rather than preceding it.

---

### 3.2 Goal Two – Create Anticipation with Purpose

The transition between Passport submission and recommendation should mark a meaningful change in the experience.

It should feel like the Journey Director is considering the traveller's story, not like the website is waiting for a page to load.

Anticipation should be created through pacing, language and visual continuity.

It should never depend on an unnecessarily long delay.

**Experience indicators:**

- Submission receives immediate acknowledgement.
- Progress messages describe traveller-centred consideration rather than technical processing.
- The transition remains calm and legible on mobile devices.
- Reduced-motion preferences are respected.
- The traveller is never trapped in an indefinite loading state.

---

### 3.3 Goal Three – Present Recommendations with Confidence

The Journey Director should make a recommendation, not return search results.

The primary destination must be visually and narratively clear.

Alternatives may be offered when they add genuine value, but they should not compete equally with the primary recommendation or recreate decision fatigue.

Confidence does not require pretending certainty.

When traveller inputs are incomplete, preferences conflict or destination suitability is close, the Journey Director should explain that thoughtful alternatives exist and invite human refinement.

**Experience indicators:**

- One recommendation is clearly identified as the strongest fit.
- The recommended region, city or area is named when supported by the Destination Knowledge Base.
- No inactive or coming-soon destination is shown.
- Alternatives are limited and meaningfully differentiated.
- Uncertainty is communicated through helpful language rather than hidden behind generic claims.

---

### 3.4 Goal Four – Explain Why the Recommendation Fits

A destination without reasoning is a suggestion.

A destination connected to the traveller's priorities becomes a recommendation.

The Journey Director must explain why the destination and region fit by connecting traveller signals to destination characteristics.

The explanation should be short enough to understand immediately and rich enough to establish credibility.

It should answer:

- Which traveller priorities influenced the recommendation?
- What qualities of the destination respond to those priorities?
- Why is the recommended region more suitable than other regions within the destination?
- What kind of memories may this journey create?

**Experience indicators:**

- Every primary recommendation includes a plain-language rationale.
- Region-level recommendations include a region-specific reason.
- Claims remain consistent with approved destination intelligence.
- The rationale avoids generic superlatives and unsupported certainty.

---

### 3.5 Goal Five – Help the Traveller Imagine the Journey

The experience should move beyond destination names and introduce a small number of signature experiences that make the recommendation tangible.

Travellers should be able to picture moments rather than process an itinerary.

Examples may include:

- a quiet morning on the backwaters;
- a walk through tea estates;
- a private wildlife safari;
- a food-led exploration of a historic neighbourhood;
- a sunset by the sea; or
- time set aside for a family celebration.

These are possibilities, not confirmed inclusions.

The language should inspire without implying that a final itinerary, price or booking has already been created.

**Experience indicators:**

- Each recommendation highlights a focused set of relevant experiences.
- Experiences are selected because they support the traveller's intent.
- The distinction between inspiration and confirmed itinerary is clear.
- The experience does not overwhelm the traveller with daily schedules or package detail.

---

### 3.6 Goal Six – Reduce Decision Fatigue

The Journey Director exists to narrow possibilities thoughtfully.

It should not transfer the burden of research back to the traveller.

The primary recommendation should lead the experience, followed by no more than the minimum number of alternatives required to create useful choice.

When alternatives are shown, each should have a distinct role.

For example:

- **Primary Recommendation** – the strongest overall fit;
- **Consider This Too** – a close alternative with a meaningful trade-off; and
- **A Different Possibility** – an optional wildcard that fulfils the traveller's intent in an unexpected way.

The labels should communicate purpose rather than ranking anxiety.

**Experience indicators:**

- The traveller is not presented with a grid of undifferentiated destinations.
- Alternatives explain how they differ from the primary recommendation.
- The primary call to action remains clear throughout.
- Secondary exploration does not interrupt the main narrative.

---

### 3.7 Goal Seven – Build Trust Through Operational Honesty

Every visible recommendation must fall within the active Search My Vacation portfolio.

The experience must distinguish between inspiration, recommendation and confirmed travel arrangements.

It should never imply that availability, pricing, visa conditions, weather or inclusions have been validated unless the relevant systems or Journey Designer have confirmed them.

Operational limits should be expressed as responsible guidance rather than legalistic warnings.

**Experience indicators:**

- Only destinations marked **ACTIVE** are eligible for traveller-facing recommendations.
- Coming-soon and inactive destinations remain hidden.
- Dynamic facts are validated before display or deferred to the Journey Designer.
- The experience clearly positions the recommendation as the beginning of personalised planning.
- No unsupported guarantee is made.

---

### 3.8 Goal Eight – Create an Intentional Human Handoff

The Journey Director should not end with “Submit your details.”

The traveller has already shared their story.

The next step should feel like a continuation of the experience: inviting a Journey Designer to shape the recommendation into a real journey.

The handoff should explain what the human expert will do and what the traveller can expect next.

For example:

> **“A Journey Designer can now turn this possibility into a journey shaped around your dates, pace and priorities.”**

The call to action should feel collaborative rather than transactional.

**Experience indicators:**

- The next step is visible and understandable.
- Existing Passport information is carried forward without unnecessary re-entry.
- The traveller understands whether the next action starts a conversation, requests a callback or begins itinerary design.
- A lower-commitment path is available for travellers who are not ready to speak immediately.

---

### 3.9 Goal Nine – Remain Inclusive, Accessible and Resilient

The experience should preserve its meaning across devices, abilities, connection qualities and motion preferences.

Its emotional value must not depend on animation, audio or high-resolution imagery.

Every essential message and action should remain available through clear text and accessible controls.

**Experience indicators:**

- The experience supports keyboard and assistive-technology navigation.
- Text contrast and focus visibility meet the project's accessibility standard.
- Motion can be reduced without losing information or sequence.
- Meaning is not conveyed by colour alone.
- Slow or failed media does not block the recommendation.
- Error states preserve Passport information and offer recovery.

---

### 3.10 Experience Success Measures

Release 1 should establish a baseline for both qualitative and behavioural success.

Recommended measures include:

| Measure | What It Helps Us Understand |
| --- | --- |
| **Recommendation continuation rate** | Whether travellers choose to move from the reveal into a conversation with a Journey Designer. |
| **Passport-to-reveal completion rate** | Whether the transition and narrative help travellers reach the recommendation successfully. |
| **Recommendation relevance feedback** | Whether travellers feel the recommendation reflects what they shared. |
| **Passport correction rate** | Whether reflection helps travellers identify information they want to revise. |
| **Alternative exploration rate** | Whether alternatives are useful without distracting from the primary recommendation. |
| **Time to meaningful content** | How quickly the traveller receives acknowledgement, recognition and a useful recommendation. |
| **Human handoff completion rate** | Whether the next step is clear and appropriately timed. |
| **Accessibility and recovery success** | Whether all travellers can complete the experience and recover from interruptions. |

Metrics should inform refinement without encouraging manipulative pacing or unnecessary urgency.

The primary measure of success remains recommendation quality and traveller trust.

---

## 4. Experience Principles

The following principles govern all product, design, content and implementation decisions within the Journey Director Experience.

When individual requirements conflict, these principles should guide resolution.

---

### 4.1 Listen Before Recommending

The Journey Director must demonstrate understanding before revealing a destination.

The traveller has invested attention and personal context in the Journey Passport. The experience should honour that investment by reflecting the most relevant signals first.

**Therefore:**

- begin with acknowledgement and reflection;
- connect the reflection to information the traveller provided;
- allow the traveller to revisit or correct their Passport; and
- never open with a generic destination grid.

---

### 4.2 Human Before Technology

The Journey Director should feel like expert guidance, not a demonstration of automation.

The experience may be powered by rules, data, AI or human review. Those implementation choices should remain behind the experience unless disclosure is required for trust, safety or compliance.

**Therefore:**

- use human, natural language;
- explain recommendations through reasons, not scores;
- avoid technical processing terminology;
- preserve human review where operational judgement is required; and
- make the Journey Designer handoff visible and meaningful.

---

### 4.3 Emotion First, Destination Second

The Journey Director begins with the journey the traveller wants to experience.

Destinations are considered only after emotional intent, companion needs, pace and travel style have been understood.

**Therefore:**

- reflect the desired outcome before naming the place;
- describe destinations through the experiences they enable;
- avoid popularity-led recommendations; and
- never treat geography as a substitute for traveller understanding.

---

### 4.4 Recommend Only What We Can Deliver

Search My Vacation's credibility is more valuable than appearing to offer unlimited choice.

The Journey Director must recommend only active destinations that the organisation can confidently curate and support.

**Therefore:**

- filter operational status before ranking suitability;
- hide coming-soon and inactive destinations from traveller-facing flows;
- avoid redirecting travellers toward unsupported destinations; and
- use the closest suitable active experience only when it genuinely fulfils the traveller's intent.

If no responsible match exists, the experience should invite human guidance rather than manufacture a recommendation.

---

### 4.5 Recommend at the Most Meaningful Level

A broad destination may create interest.

A well-chosen region creates relevance.

The Journey Director should recommend the city, town, island, park, coast or region that most clearly delivers the intended experience.

**Therefore:**

- pair destination and region when region intelligence is available;
- explain why the selected region is a stronger fit than common alternatives;
- support multi-region journeys only when the combination improves the recommendation; and
- avoid false precision when regional confidence is low.

The difference between **Ubud and Kuta** is not supplementary detail.

It is part of the recommendation itself.

---

### 4.6 Explain Every Recommendation

No recommendation should appear without a clear connection to the traveller's priorities.

Reasoning establishes trust and allows the traveller to participate in the decision.

**Therefore:**

- connect each recommendation to relevant Passport signals;
- use approved destination and region intelligence;
- explain trade-offs when alternatives are shown;
- distinguish facts from interpretation; and
- avoid generic statements that could apply to any traveller.

---

### 4.7 Confidence Over Quantity

The Journey Director should reduce uncertainty, not display the size of the destination portfolio.

**Therefore:**

- lead with one primary recommendation;
- introduce alternatives only when they serve a clear purpose;
- differentiate alternatives through meaningful trade-offs;
- avoid endless browsing within the core reveal; and
- make the recommended next step more prominent than continued comparison.

Fewer, better possibilities are a feature of the experience.

---

### 4.8 Story Before Itinerary

The first recommendation should help the traveller imagine the journey before presenting schedules, hotels or package details.

**Therefore:**

- reveal the emotional fit first;
- introduce a small number of signature moments;
- defer detailed planning to the next stage;
- avoid presenting a day-by-day itinerary as though it were final; and
- preserve room for the Journey Designer to shape the journey collaboratively.

---

### 4.9 Anticipation Without Artificial Delay

Pacing should create emotional transition, but performance and honesty remain essential.

**Therefore:**

- acknowledge submission immediately;
- begin useful processing as soon as possible;
- reveal content when it is ready;
- do not enforce a long animation solely to create drama;
- provide reduced-motion and low-bandwidth experiences; and
- offer a recoverable path if recommendation preparation takes longer than expected.

The traveller's time is part of the premium experience.

---

### 4.10 Personal Without Becoming Intrusive

Personalisation should come from relevance, not from excessive repetition of personal details.

**Therefore:**

- use the traveller's name sparingly and naturally;
- reflect only information they intentionally shared;
- avoid inferring sensitive personal circumstances;
- do not expose private Passport details unnecessarily on shared screens; and
- allow the traveller to control what is corrected, saved or shared.

The Journey Director should feel attentive, not watchful.

---

### 4.11 Inspire Without Overpromising

The recommendation should help the traveller imagine possibilities while remaining clear about what has and has not been confirmed.

**Therefore:**

- describe signature experiences as possibilities until included in an itinerary;
- avoid guaranteed outcomes such as perfect weather, sightings or availability;
- validate time-sensitive operational information before presenting it as fact;
- use specific, grounded language rather than superlatives; and
- position the Journey Designer as the person who will confirm and shape the details.

---

### 4.12 Calm Is a Feature

The Journey Director should create focus through visual and verbal restraint.

**Therefore:**

- maintain one clear focal point at each stage;
- use whitespace, hierarchy and pacing intentionally;
- limit simultaneous calls to action;
- avoid urgency devices, countdowns and scarcity messaging; and
- allow travellers to absorb the recommendation at their own pace.

The experience should feel considered rather than busy.

---

### 4.13 Accessibility Is Part of the Experience

The Journey Director's meaning must remain available without animation, audio, imagery or precise pointer interaction.

**Therefore:**

- preserve the narrative order in semantic content;
- provide descriptive text for meaningful imagery;
- ensure controls have clear accessible names;
- respect reduced-motion preferences;
- maintain visible focus and sufficient contrast; and
- prevent automatic transitions from removing content before the traveller has understood it.

Accessibility is not a parallel version of the experience.

It is the experience.

---

### 4.14 Recovery Should Preserve Trust

Connection failures, expired sessions and incomplete data should not erase the traveller's effort or abandon them at a blank screen.

**Therefore:**

- preserve Passport responses whenever safely possible;
- explain errors in plain language;
- provide a clear retry or human-support path;
- avoid blaming the traveller; and
- resume at the nearest meaningful stage after recovery.

A graceful recovery can reinforce trust as strongly as a flawless first attempt.

---

### 4.15 The Human Handoff Is a Continuation

The call to action should continue the recommendation conversation rather than abruptly convert the traveller into a lead.

**Therefore:**

- explain the value of speaking with a Journey Designer;
- carry relevant context forward;
- set expectations for the next step;
- avoid requesting information already provided; and
- offer an appropriate lower-commitment alternative when the traveller is not ready.

The Journey Director opens the possibility.

The Journey Designer helps make it real.

---

## 5. Journey Flow

The Journey Director Experience begins at the moment the traveller completes the Journey Passport and ends when they choose a meaningful next step.

The experience is a single connected narrative.

It should not feel like a sequence of unrelated pages.

Each stage has one clear responsibility and prepares the traveller for the next.

---

### 5.1 Canonical End-to-End Flow

```text
Journey Passport Complete

↓

Discover My Possibilities

↓

Passport Received

↓

Thoughtful Transition

↓

Journey Director Welcome

↓

Traveller Understanding

↓

Journey Character

↓

Primary Destination Reveal

↓

Recommended Region / City / Area

↓

Why This Fits

↓

Signature Experience Possibilities

↓

Alternative Possibilities, When Helpful

↓

Human Journey Designer Handoff

↓

Save, Revisit or Continue
```

The flow is progressive.

The traveller should understand each idea before the next one is introduced.

The primary recommendation remains the centre of the experience from reveal through handoff.

---

### 5.2 Entry Conditions

The traveller enters the Journey Director Experience after:

- completing all Journey Passport fields required for a responsible recommendation;
- providing any required consent;
- selecting **Discover My Possibilities**; and
- receiving successful confirmation that the Passport has been accepted.

Before navigation begins, the experience should prevent duplicate submission and preserve the traveller's responses.

If required information is missing, the traveller should remain within the Passport and receive clear, field-level guidance.

The Journey Director should not begin with knowingly incomplete information unless the product explicitly supports a low-confidence human-review pathway.

---

### 5.3 Stage One – Passport Acknowledgement

**Purpose**

Confirm immediately that the Journey Passport has been received and that the traveller's action was successful.

**Traveller need**

> “Did that work?”

**Experience response**

The submission control moves into a clear success state and the interface acknowledges receipt.

Recommended message:

> **Journey Passport received**
>
> We are taking a thoughtful look at what you shared.

The acknowledgement should be immediate, calm and unambiguous.

It should not wait for recommendation preparation to finish.

**Flow requirements**

- prevent accidental duplicate submissions;
- preserve all Passport responses;
- announce success accessibly;
- provide a visible transition into the next stage; and
- retain a recovery route if subsequent loading fails.

---

### 5.4 Stage Two – Thoughtful Transition

**Purpose**

Create a clear emotional transition from sharing information to receiving guidance.

**Traveller need**

> “What is happening with what I shared?”

**Experience response**

The interface enters a focused transition state. Short messages explain the nature of the consideration taking place.

Recommended message sequence:

1. **Reading your travel story...**
2. **Understanding what matters most to you...**
3. **Matching those priorities with journeys we know well...**
4. **Preparing your possibilities...**

Messages should reflect real stages where possible.

They should not claim human review, destination availability checks or other activity that has not occurred.

**Timing guidance**

- Immediate recommendations should appear as soon as the minimum transition has established context.
- The experience should not force a fixed cinematic delay when content is ready.
- Longer processing should show continued reassurance and a clear recovery path.
- Automatic message changes must allow sufficient reading time.
- Reduced-motion settings should replace animated transitions with stable, sequential content.

**Flow requirements**

- maintain orientation;
- avoid percentages that imply false precision;
- allow safe retry after failure;
- keep essential information available without decorative media; and
- never leave the traveller in an indefinite loading state.

---

### 5.5 Stage Three – Journey Director Welcome

**Purpose**

Introduce the Journey Director as the trusted guide for the recommendation experience.

**Traveller need**

> “Who is guiding me, and what should I expect?”

**Experience response**

The transition settles into a warm introduction.

Recommended content direction:

> **Meet your Journey Director**
>
> We have taken a thoughtful look at the journey you described. Before we share where it may lead, here is what we heard.

The welcome should be brief.

It should establish confidence without delaying the traveller from reaching meaningful content.

A supporting trust statement may clarify the operational promise:

> Every possibility we share comes from destinations Search My Vacation confidently designs and supports.

**Flow requirements**

- present the Journey Director as a service identity, not a fictional individual;
- avoid technical language about how the recommendation was generated;
- make the traveller's ability to revisit the Passport available without making it the primary action; and
- continue naturally into the understanding summary.

---

### 5.6 Stage Four – Traveller Understanding

**Purpose**

Demonstrate that the Journey Passport was understood before introducing a destination.

**Traveller need**

> “Did you understand the journey I am trying to create?”

**Experience response**

The Journey Director reflects a concise interpretation of the traveller's strongest signals.

The reflection may combine:

- who is travelling;
- the dominant emotional goal;
- desired pace;
- preferred journey themes;
- comfort expectations;
- timing or flexibility; and
- a specific memory the traveller hopes to create.

Example:

> **You are looking for more than a change of scenery.**
>
> This journey is about giving your family unhurried time together, with nature close by and enough comfort for everyone to relax into the experience.

The summary should prioritise meaning over completeness.

It should not repeat every answer from the Passport.

**Correction path**

A secondary action such as **Adjust my Passport** allows the traveller to revisit their responses.

If changes are saved, the recommendation should be reconsidered and the traveller returned to the nearest meaningful stage.

**Flow requirements**

- use only supported Passport information;
- avoid sensitive or speculative inferences;
- keep the summary concise enough to scan;
- preserve a clear correction path; and
- continue into journey character rather than destination reveal without context.

---

### 5.7 Stage Five – Journey Character

**Purpose**

Translate the traveller's inputs into a simple statement describing the kind of journey being sought.

**Traveller need**

> “What does all of this mean for the kind of holiday that may suit me?”

**Experience response**

The Journey Director identifies the dominant character of the journey before naming a place.

Example:

> **We looked for a journey with slow mornings, beautiful natural surroundings and experiences your family can share without feeling rushed.**

This statement becomes the bridge between recognition and recommendation.

It explains what the Journey Director searched for within the active portfolio.

**Flow requirements**

- describe the desired journey in experiential language;
- avoid exposing taxonomy labels as though they were diagnoses;
- include only the strongest decision factors; and
- create a natural lead-in to the destination reveal.

---

### 5.8 Stage Six – Primary Destination Reveal

**Purpose**

Present the strongest destination match as the culmination of the preceding narrative.

**Traveller need**

> “Where could this journey come to life?”

**Experience response**

The primary destination is revealed with visual confidence and restrained celebration.

Recommended content structure:

> **We believe Kerala could be a wonderful fit.**
>
> It brings together the calm, nature and unhurried family time that stood out in your Journey Passport.

The reveal should include:

- destination name;
- a concise destination-level reason;
- purposeful imagery with appropriate alternative text;
- category or location context only when useful; and
- a visible continuation into the recommended region.

It should not begin with hotel prices, package durations or a list of attractions.

**Flow requirements**

- reveal only an active destination;
- preserve the primary recommendation as the clear focal point;
- ensure motion is optional and does not delay content access;
- avoid unsupported claims; and
- continue directly into region intelligence.

---

### 5.9 Stage Seven – Recommended Region, City or Area

**Purpose**

Make the destination recommendation meaningfully specific.

**Traveller need**

> “Where within this destination best matches the experience I want?”

**Experience response**

The Journey Director identifies the area that most strongly expresses the intended journey.

Example:

> **We would place Alleppey at the heart of your journey.**
>
> Its backwaters and slower rhythm create space for the relaxed family time you described, making it a stronger fit than a busier, sightseeing-led base.

The region recommendation should include:

- region, city or area name;
- emotional and experiential fit;
- a concise contrast when another commonly selected area offers a materially different experience; and
- recommended role within the broader journey, such as primary base, opening chapter or short extension.

The contrast should guide rather than criticise.

For example, the Journey Director may explain why **Ubud** is a stronger fit than **Kuta** for culture and slow travel without presenting Kuta negatively.

**Flow requirements**

- recommend only regions supported by approved destination intelligence;
- explain the regional choice;
- avoid false precision;
- support more than one region only when the combination is coherent; and
- allow the Journey Designer to refine the routing later.

---

### 5.10 Stage Eight – Why This Fits

**Purpose**

Make the reasoning behind the recommendation transparent and easy to understand.

**Traveller need**

> “Why is this right for me?”

**Experience response**

The Journey Director connects a small number of traveller priorities to destination and region qualities.

Recommended format:

| What You Shared | Why This Recommendation Responds |
| --- | --- |
| You want time to reconnect as a family. | Alleppey's slower pace creates room for shared, unhurried moments. |
| Nature matters more than nightlife. | Backwaters, palms and village landscapes remain central to the experience. |
| You prefer balanced comfort. | The region supports thoughtful stays without requiring an overly formal luxury experience. |

The interface need not use a table, but the conceptual relationship should remain clear.

**Flow requirements**

- connect reasons to actual Passport signals;
- keep the number of reasons focused;
- use language the traveller can understand immediately;
- distinguish suitability from certainty; and
- avoid displaying internal scores or ranking mechanics.

---

### 5.11 Stage Nine – Signature Experience Possibilities

**Purpose**

Help the traveller imagine what the recommended journey could feel like.

**Traveller need**

> “What moments might I experience there?”

**Experience response**

The Journey Director introduces a focused collection of signature experiences aligned with the traveller's priorities.

For example:

- wake to quiet backwater views;
- share an unhurried meal aboard a private houseboat;
- explore village life along the waterways; and
- pair the backwaters with a gentle stay in Munnar if the journey duration allows.

Experience possibilities should be evocative, specific and operationally plausible.

They should not be presented as confirmed itinerary inclusions.

**Flow requirements**

- prioritise relevance over destination completeness;
- limit the initial set to a manageable number;
- make the provisional nature of the ideas clear;
- ensure imagery does not create an inaccurate expectation; and
- avoid turning the reveal into an itinerary builder.

---

### 5.12 Stage Ten – Alternative Possibilities

**Purpose**

Offer meaningful choice when another active destination fulfils the traveller's intent through a distinct experience.

**Traveller need**

> “Is there another direction worth considering?”

**Experience response**

Alternatives appear after the primary recommendation has been understood.

They remain secondary in visual weight and narrative depth.

Each alternative should explain its role.

Example:

- **Consider this too:** Sri Lanka, for a broader mix of coast, culture and wildlife within one journey.
- **A different possibility:** Bali, centred around Ubud, if wellness and cultural immersion matter more than staying closer to home.

Alternatives should not be included merely to fill a fixed number of cards.

If the primary recommendation is clearly superior, the experience may proceed without them.

**Flow requirements**

- show only active destinations;
- differentiate each alternative through a meaningful trade-off;
- keep the primary recommendation prominent;
- avoid a comparison grid that recreates search behaviour; and
- allow the Journey Designer to explore alternatives in conversation.

---

### 5.13 Stage Eleven – Human Journey Designer Handoff

**Purpose**

Transform inspiration into a clear and trustworthy next step.

**Traveller need**

> “How does this become my journey?”

**Experience response**

The Journey Director invites the traveller to continue with a human Journey Designer.

Recommended content direction:

> **Let us shape this into your journey.**
>
> A Journey Designer can now refine the route around your dates, pace, comfort and priorities — and turn these possibilities into a thoughtful plan.

Primary action:

**Design My Journey**

Possible secondary actions:

- **Save My Possibilities**
- **Review My Journey Passport**
- **Explore the Recommendation**

The precise action label must reflect what actually happens next.

If the action requests a callback, starts a WhatsApp conversation or opens a planning form, that outcome should be stated clearly.

**Flow requirements**

- explain the value of the human next step;
- carry Passport and recommendation context forward;
- avoid requesting duplicate information;
- set an honest expectation for response timing where relevant; and
- provide a safe path for travellers who are not ready to continue immediately.

---

### 5.14 Completion States

The canonical experience may conclude in one of four states.

| Completion State | Definition | Required Outcome |
| --- | --- | --- |
| **Continue with a Journey Designer** | The traveller chooses the primary handoff action. | Preserve context, confirm the request and explain what happens next. |
| **Save and Revisit** | The traveller wants time before continuing. | Save the recommendation securely and provide a reliable return path. |
| **Revise the Journey Passport** | The traveller wants to change what they shared. | Return to the Passport with responses intact and regenerate or review the recommendation after changes. |
| **Leave the Experience** | The traveller exits without selecting a next step. | Preserve progress where consent and session rules allow; avoid manipulative exit prompts. |

Completion should feel deliberate in every state.

The traveller should never wonder whether their request was sent or their recommendation was saved.

---

### 5.15 Exception and Recovery Flows

The Journey Director should respond gracefully when the canonical flow cannot continue.

#### Incomplete Passport

Return the traveller to the relevant Passport section with clear guidance.

Do not discard completed responses.

#### No Responsible Destination Match

Do not manufacture a destination recommendation.

Explain that the traveller's preferences deserve a closer look and offer a human Journey Designer review.

Suggested direction:

> **Your journey deserves a little more thought.**
>
> The preferences you shared create an unusual combination, and we would rather have a Journey Designer review them than offer a generic suggestion.

#### Low-Confidence Region Match

Recommend the active destination when appropriate, but defer the city or region choice.

Explain that the Journey Designer will refine the location based on dates, pace and operational considerations.

#### Recommendation Preparation Failure

Preserve the Journey Passport and offer retry or human assistance.

Avoid technical error codes in the primary message.

#### Connection Interruption

Resume from the nearest completed stage when the session remains valid.

If resumption is not possible, restore the Passport or saved recommendation rather than forcing the traveller to begin again.

#### Destination Becomes Unavailable

Remove the affected recommendation before display where possible.

If availability changes after the traveller has saved a recommendation, explain the change transparently and invite the Journey Designer to propose the closest responsible alternative.

---

### 5.16 Returning Traveller Flow

When a traveller returns to a saved or recently completed recommendation, the experience should prioritise continuity over replay.

The traveller should land on a concise recommendation summary with access to:

- the understanding statement;
- the primary destination and region;
- why the recommendation fits;
- signature experience possibilities;
- any saved alternatives;
- the Journey Passport; and
- the human handoff action.

The full transition and reveal should not replay automatically.

The traveller may choose to replay the story if that capability is later introduced, but returning access should favour speed and orientation.

---

### 5.17 Responsive Journey Behaviour

The narrative order must remain consistent across desktop, tablet and mobile.

On smaller screens:

- one idea should occupy the primary viewport at a time;
- critical text should appear before decorative imagery;
- horizontal comparison patterns should become a vertical sequence;
- the primary call to action should remain easy to find without covering content;
- animation should be simplified where device capability or preferences require it; and
- browser navigation should not cause accidental Passport resubmission.

The mobile experience must feel intentionally composed rather than reduced from desktop.

---

### 5.18 Flow Guardrails

The following conditions must remain true throughout the Journey Director flow:

- The traveller always knows whether their Passport was received.
- The experience never reveals an inactive or coming-soon destination.
- The recommendation never appears without an explanation.
- Region guidance is included whenever reliable region intelligence improves the recommendation.
- The experience does not imply a confirmed itinerary, price or booking.
- The traveller can revisit what they shared.
- Essential meaning remains available without motion or imagery.
- Failures do not erase completed Passport information.
- The primary recommendation remains clearer than any alternatives.
- The human handoff explains what will happen next.

These guardrails are acceptance criteria for every future screen, prototype and implementation derived from this specification.

---

### 5.19 Journey Flow Acceptance Criteria

Sections 1–5 are considered successfully represented in design when:

1. The flow begins only after valid Journey Passport submission.
2. Submission success is acknowledged immediately.
3. The transition communicates purposeful consideration without artificial delay.
4. The Journey Director is introduced as a trusted service identity.
5. The traveller's intent is reflected before a destination is shown.
6. One primary active destination is clearly recommended.
7. A city, region or area is recommended when reliable intelligence is available.
8. The reason for both destination and region selection is understandable.
9. Signature experiences help the traveller imagine the journey without implying confirmation.
10. Alternatives are limited, differentiated and optional.
11. The next step with a human Journey Designer is clear.
12. The flow supports correction, saving, recovery and accessible completion.

---

> **Closing Principle**
>
> The Journey Director should never make the traveller feel processed.
>
> It should make them feel understood, guided and excited to take the next step.

