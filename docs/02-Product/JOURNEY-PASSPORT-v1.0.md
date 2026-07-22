# Search My Vacation — Journey Passport

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v1.0 |
| **Status** | Approved product and UX specification |
| **Owner** | Search My Vacation — Product & Experience |
| **Last updated** | 22 July 2026 |
| **Purpose** | Define the enduring product intent, traveller experience, interaction model, language, information boundaries, handoff and future direction of Journey Passport v1.0. |

> **Audience:** Product Managers, UX Designers, Content Designers, Developers, AI Engineers, Journey Directors, Operations leaders and future custodians of the Search My Vacation experience.

---

## 2. The Journey Passport Promise

The Journey Passport is not a booking form.

It is the first conversation between a traveller and their Journey Director.

Its purpose is not to collect information.

Its purpose is to understand the traveller well enough to recommend experiences that feel personal, thoughtful and memorable.

Every question exists for a reason.

Every interaction should feel effortless.

Every response should reassure the traveller that they are understood.

When a traveller completes the Journey Passport they should feel:

> **“They listened to me before suggesting where I should go.”**

This promise is the standard against which every version of Journey Passport must be judged. A technically complete flow that leaves a traveller feeling processed has failed. A concise experience that creates trust, curiosity and a sense of being understood has succeeded.

Journey Passport begins before an itinerary, quotation or booking exists. It occupies a delicate moment: the traveller has an aspiration but may not yet have the language, confidence or information to describe it. Search My Vacation must meet that uncertainty with warmth. We do not require the traveller to become a travel expert before we can help them. We create a safe, inspiring way for them to tell us what matters.

The experience should feel closer to an attentive opening conversation in a private travel studio than to a lead-generation questionnaire. It should reveal enough about the traveller to make the next recommendation meaningful, while deliberately leaving planning details for a human conversation after discovery.

Journey Passport v1.0 therefore makes a clear product commitment:

- Discovery comes before planning.
- Understanding comes before recommendation.
- Recommendations come before logistics.
- Deterministic recommendation logic generates three journey possibilities in Release 1.
- A human Journey Director remains responsible for consultation, refinement, itinerary design and the final traveller handoff.

---

## 3. Product Vision

### 3.1 Why Journey Passport exists

Most travel experiences begin with inventory. They ask for a destination, dates, number of travellers and budget, then return a list of products. This is efficient when a traveller already knows precisely what to buy. It is inadequate when the traveller is seeking inspiration, celebrating something meaningful, travelling with people whose needs differ, or simply wants expert guidance.

Search My Vacation begins from a different belief:

> Travel begins with understanding the traveller, not choosing the destination.

Journey Passport turns that belief into a product experience. It gives travellers a considered way to express how they want to feel, who they will share the journey with, what kinds of memories matter, how they prefer to travel, when they may travel and whether a destination is already in mind. It converts an uncertain aspiration into a useful human story.

The Passport is not intended to produce a final itinerary on its own. It creates the foundation from which deterministic Release 1 logic can generate three relevant journey possibilities and a human Journey Director can continue consultation and planning intelligently.

### 3.2 Problems it solves

#### The traveller does not always know what to ask for

Many travellers begin with a feeling rather than a place: “We need time together,” “I want the children to experience something new,” or “I want this anniversary to feel unforgettable.” Traditional forms force those intentions into logistical fields too early. Journey Passport gives emotional intent a legitimate place in discovery.

#### Generic enquiries create generic follow-up

A name, phone number and destination do not tell a Journey Director enough to begin a personal conversation. The result is repetitive qualification, predictable recommendations and a weak first impression. Journey Passport provides context before contact, so the first human response can demonstrate understanding.

#### Long forms exhaust trust

Every additional field asks the traveller to spend attention and disclose information. When the reason is unclear, the interaction feels extractive. Journey Passport limits itself to high-value discovery questions and explains why personal information is requested.

#### Recommendation engines often begin with insufficient context

Automated systems can rank inventory, but meaningful recommendations require a model of the traveller. The Passport establishes a structured but human-readable foundation for governed deterministic matching in Release 1 and future intelligence, without making the experience feel mechanical or impersonal.

#### Travel planning becomes logistical too soon

When budget, airports, room configurations and flight preferences dominate the opening experience, imagination collapses into administration. Journey Passport protects the discovery moment. Planning begins only after possibilities have been presented.

### 3.3 Difference from a traditional enquiry form

| Traditional enquiry form | Journey Passport |
| --- | --- |
| Begins with logistics | Begins with the traveller |
| Optimises for data capture | Optimises for understanding |
| Uses system labels and validation | Uses human questions and reassuring guidance |
| Treats all fields as equivalent | Includes only questions that improve discovery |
| Often asks for a destination first | Makes destination the final discovery question |
| Ends with “Submit” | Ends with **✨ Discover My Possibilities** |
| Produces a lead | Begins a relationship |
| Expects the traveller to define the solution | Invites Search My Vacation to guide the traveller |

### 3.4 Relationship with the Journey Director

The Passport and deterministic recommendation logic do not replace the Journey Director. They make the Journey Director’s first conversation better.

In Release 1, deterministic recommendation logic interprets the completed Passport, applies operational eligibility rules and generates three journey possibilities: **The Perfect Match**, **A Different Rhythm** and **A Pleasant Surprise**. Each possibility must be traceable to the traveller’s signals and grounded in destinations and regions Search My Vacation can confidently deliver.

The human Journey Director remains responsible for consultation, refinement, itinerary design and the final traveller handoff. For example, “relaxation,” “family,” “adventure” and “exact dates” may create tensions that deterministic matching can surface but should not silently resolve through unsupported assumptions. The Passport provides evidence, the recommendation logic creates governed possibilities and the Journey Director turns the selected direction into empathy, advice and a thoughtfully designed journey.

### 3.5 Relationship with future AI

Journey Passport creates a high-quality consented context layer for future AI-assisted experiences. AI may eventually help interpret preferences, identify compatible destinations, explain trade-offs, generate possibility narratives or prepare a Journey Director briefing. It must not reduce the traveller to a score or replace the care that defines the brand.

Future intelligence should follow three rules:

1. **Make understanding visible.** Recommendations must be traceable to what the traveller shared.
2. **Keep people in control.** The traveller and Journey Director can correct, refine or reject an interpretation.
3. **Use automation to increase care, not distance.** AI should free Journey Directors to spend more time on judgement and relationships.

---

## 4. Product Philosophy

### 4.1 Understand before recommending

Recommendations carry meaning only when the traveller can see why they fit. Journey Passport gathers the minimum emotional and situational context required to make the first set of possibilities feel considered.

This principle means that Search My Vacation should never rush from a homepage preference directly to an inventory grid. The experience must first establish who is travelling, what they value and what constraints genuinely shape discovery.

### 4.2 Conversation before collection

The traveller should encounter questions, acknowledgements and invitations—not database labels. “Who will be sharing this journey with you?” creates a different relationship from “Party type.” The information may be structured underneath, but the visible experience remains human.

Conversation also means responding to what has already been shared. A transition such as “Perfect. We can already picture the kind of experience you’re looking for” is not decoration; it demonstrates listening and gives emotional continuity to the flow.

### 4.3 Personalisation before planning

Journey Passport personalises the opening conversation before asking the traveller to participate in detailed planning. It uses the traveller’s name appropriately, carries forward homepage choices and adapts later moments to earlier answers.

Personalisation is not the insertion of a name into every heading. It is the removal of irrelevant questions, the preservation of known context and the quality of the resulting possibilities.

### 4.4 Experiences before logistics

The Passport explores feelings, companions, journey character, travel style, timing and destination intent. It does not begin with flight numbers, hotel categories or room counts. Those details matter later, but they should support an experience—not define it before the traveller has imagined it.

### 4.5 Discovery is not planning

Journey Passport is a discovery experience. Its conclusion should create qualified possibilities and a reason to continue the conversation. It is not a self-service itinerary builder, quotation engine or booking tool.

Planning begins after recommendations. This boundary is essential. Without it, the Passport will accumulate fields, become exhausting and lose the emotional quality that makes it distinctive.

### 4.6 Human judgement remains visible

Release 1 uses deterministic recommendation logic to generate three journey possibilities and then continues into human Journey Director consultation. Human interpretation, accountability and advice remain explicit: the Journey Director refines the selected direction, designs the itinerary and owns the final traveller handoff. Search My Vacation’s advantage is not merely knowing more options; it is caring which option is right for this traveller.

---

## 5. Experience Principles

### 5.1 Every Question Has a Purpose

Every question must improve at least one of the following:

- the relevance of initial destination possibilities;
- the Journey Director’s understanding of the traveller;
- the confidence or comfort of the traveller;
- the ability to adapt the remaining experience.

If a question does not improve discovery, it does not belong in Journey Passport. It may belong later in Journey Director Planning or Journey Builder.

**Example:** Asking who is travelling changes the meaning of pace, accommodation and activities. Asking for a passport number does not improve discovery and introduces unnecessary sensitivity, so it is deferred.

**Product test:** Before adding a field, complete the sentence: “We need this now because it will change…” If the answer is vague, remove or defer the field.

### 5.2 Emotion Comes From The Experience

Premium emotion is created by the full choreography: useful questions, confident restraint, clear choices, respectful pacing, beautiful imagery, responsive acknowledgements and a meaningful conclusion. It does not come from adding decorative animation to a generic form.

**Example:** A success transition after selecting travel styles feels rewarding because it reflects a completed act of self-expression. A sparkle animation on an unexplained mandatory field does not.

Design should use visual richness to support comprehension and anticipation. Motion, imagery and language must never conceal ambiguity or delay progress for spectacle.

### 5.3 The Passport Becomes Progressively More Personal

The opening moment is universal and welcoming. Each answer then gives permission for the experience to become more specific. The traveller’s name appears after it is shared. Homepage intent is recognised. Later prompts and acknowledgements reflect companions, timing or destination certainty where useful.

The progression should feel earned. Using personal information before context is established can feel intrusive; failing to use information after asking for it can feel indifferent.

**Example:** After a traveller shares their name, “We’ll use your name to make every conversation feel personal” explains the benefit. Later, a light acknowledgement such as “That gives us a lovely starting point, Priya” may be appropriate. Repeating “Priya” on every screen is not.

### 5.4 Never Ask Twice Without Context

Known information must be carried forward. If the homepage has captured a feeling, Journey Passport should acknowledge and preserve it. If a traveller has entered their name, later contact details should reuse that name. If a destination is already known, the final destination moment must reflect that state rather than pretending it is unknown.

When confirmation is necessary, explain why:

> “You mentioned Japan earlier. Shall we keep that as your starting point, or would you like us to widen the search?”

This principle protects trust. Repetition without context signals that the system was not listening.

### 5.5 Replace System Feedback With Human Conversation

System feedback describes the interface: “Maximum selections reached,” “Invalid input,” “Required field.” Human conversation guides the traveller: “Beautiful combination. We’ll begin with these three,” or “Choose up to three styles so we can keep your possibilities focused.”

Journey Passport uses no hard errors for ordinary discovery choices. It prevents invalid actions gracefully, explains limits before they become frustrating and turns completed choices into positive acknowledgement.

This does not mean hiding important constraints. It means communicating them with clarity and care.

### 5.6 Spend Interaction Budget Wisely

Every click, pause, transition and disclosure consumes attention. Premium experiences are not necessarily longer; they are more intentional.

High-value interactions deserve space: choosing travel style, deciding whether a destination is known, or reviewing a possibility. Low-value interactions should disappear: redundant confirmations, unnecessary modal windows, repeated consent or decorative screens that add no meaning.

**Example:** Travel Style allows up to three selections because prioritisation improves recommendations. The interface supports that meaningful choice with a counter and a success state. It should not add an additional “Are you sure?” step.

---

## 6. Emotional Journey Map

| Moment | Desired traveller emotion | Expected outcome |
| --- | --- | --- |
| Homepage invitation | Curious, recognised | The traveller understands that the experience begins with how they want to feel. |
| Welcome | Calm, intrigued | The Passport feels like an invitation, not an obligation. |
| About You | Safe, personally welcomed | The traveller shares a name and understands how it will be used. |
| Travel Companions | Certain, considered | The traveller sees their social context represented without judgement. |
| Dream Journey | Inspired | The traveller chooses the broad character of the journey they are imagining. |
| Travel Style | Expressive, delighted | The traveller identifies up to three priorities and feels rewarded for choosing. |
| Perfect Timing | Reassured, in control | The traveller can be exact or flexible without being treated as incomplete. |
| Destination | Hopeful, open | The traveller can name a place or invite Search My Vacation to inspire them. |
| Completion transition | Understood, confident | The experience confirms that enough has been learned to begin meaningful discovery. |
| Discover My Possibilities | Anticipation, trust | The traveller deliberately hands the conversation to Search My Vacation. |
| Journey Director follow-up | Valued, excited | The first response proves that the Passport was read and understood. |
| Recommendation review | Confident, pleasantly surprised | Possibilities feel connected to the traveller’s stated intent. |

The emotional arc moves from curiosity to self-expression, then from reassurance to anticipation. It must never collapse into administrative fatigue at the end.

---

## 7. Complete Experience Walkthrough

### 7.1 Moment One — Welcome

**Purpose**  
Establish the Journey Passport as a distinctive discovery experience and set expectations before asking for information.

**Traveller emotion**  
Calm curiosity. The traveller should feel invited to begin, not trapped in an unknown process.

**Title**  
Welcome to Your Journey Passport

**Subtitle**  
Every memorable journey begins with understanding the traveller behind it.

**Supporting message**  
We take the time to understand what matters to you, so we can discover experiences that feel truly yours.

**Primary action**  
Begin My Journey

**Questions**  
None.

**Interaction**  
A single clear action begins the Passport. The welcome should allow a brief moment of orientation without forcing the traveller to read extensive instructions.

**Validation**  
None. Beginning is always available.

**Microcopy**  
“A thoughtfully designed beginning.”

**Developer notes**  
Treat Welcome as the entry state, not as a numbered data question. Preserve any eligible homepage context when the traveller proceeds. Returning to Welcome must not erase completed answers.

**Design notes**  
Use confident space, warm travel imagery and restrained motion. The action must remain unmistakable. Avoid progress language that resembles a software setup wizard.

**Future enhancements**  
An adaptive welcome may acknowledge a returning traveller, an invitation source or a homepage selection. It must never reveal sensitive memory unexpectedly.

### 7.2 Moment Two — About You

**Purpose**  
Create a human basis for the conversation and establish permission for light personalisation.

**Traveller emotion**  
Recognised and safe.

**Title**  
First, tell us about you.

**Subtitle**  
We’ll use your name to make every conversation feel personal.

**Question**  
What should we call you?

**Interaction**  
The traveller enters the name they want Search My Vacation to use. The field should accept real-world names without imposing culturally narrow rules.

**Validation**  
Progress becomes available when a meaningful name has been entered. Avoid hard, alarming or overly technical error language. If guidance is needed: “Please share the name you’d like us to use.”

**Microcopy**  
“We’ll use your name to make every conversation feel personal.”

**Developer notes**  
The name has one canonical value throughout the Passport. Contact and handoff moments reuse it rather than creating a second copy. Preserve whitespace within names and support international characters.

**Design notes**  
This moment should feel quiet and conversational. One strong input is preferable to a card or form panel filled with supplementary fields.

**Future enhancements**  
Optional preferred form of address, pronunciation support and recognised returning-traveller identity after login.

### 7.3 Moment Three — Travel Companions

**Purpose**  
Understand the social context of the journey, which affects pace, shared priorities and the meaning of the experience.

**Traveller emotion**  
Seen and represented.

**Title**  
Who will be sharing this journey with you?

**Subtitle**  
Every journey feels different depending on who is beside you.

**Choices**  
Solo; Couple; Family; Friends; Business.

**Interaction**  
Single selection. Choosing a card changes its state but does not advance automatically. The traveller remains in control and uses the common continuation action.

**Validation**  
One choice is required. Before selection, continuation is calmly unavailable. There is no error banner.

**Microcopy**  
- Solo — “Just you, and the world slowing down.”
- Couple — “Moments meant only for two.”
- Family — “Memories that stay for a lifetime.”
- Friends — “Stories you’ll talk about forever.”
- Business — “Purposeful travel with room to reconnect and recharge.”

**Developer notes**  
The value represents the principal travel context, not a complete party composition. Do not infer children, relationship status or room requirements.

**Design notes**  
Photography must make each choice immediately understandable and should represent travellers with dignity and breadth. Business imagery should feel like premium travel, not a generic office.

**Future enhancements**  
Mixed-group contexts, multi-generational travel, group invitations and collaborative Passport completion.

### 7.4 Moment Four — Dream Journey

**Purpose**  
Translate an abstract desire into a broad journey character without requiring destination expertise.

**Traveller emotion**  
Inspired and optimistic.

**Title**  
What kind of journey has been living in your heart lately?

**Subtitle**  
Choose the one that excites you most right now.

**Choices**  
Tropical Escape; Mountain Retreat; City Discovery; Cruise Voyage; Winter Wonderland; Wildlife Adventure.

**Interaction**  
Single selection. A chosen card receives a clear selected state; continuation remains explicit.

**Validation**  
One journey character is required. No automatic advance and no hard error.

**Microcopy**  
- Tropical Escape — “Warm water, slower mornings and open skies.”
- Mountain Retreat — “Fresh air, far-reaching views and room to breathe.”
- City Discovery — “New neighbourhoods, culture and stories around every corner.”
- Cruise Voyage — “A graceful way to let the horizon lead.”
- Winter Wonderland — “Quiet landscapes and a beautiful change of pace.”
- Wildlife Adventure — “Wild places that make the everyday feel far away.”

**Developer notes**  
These are discovery archetypes, not inventory categories. The taxonomy may evolve, but its values must remain interpretable in a Journey Director briefing.

**Design notes**  
Every image must correspond clearly to its label. The collection should feel visually related in quality, treatment and crop. Ambiguous or mismatched photography undermines trust.

**Future enhancements**  
Adaptive archetypes based on homepage intent, seasonal storytelling and illustrated transitions between journey moods.

### 7.5 Moment Five — Travel Style

**Purpose**  
Identify the experiences and memories the traveller wants to prioritise while encouraging meaningful focus.

**Traveller emotion**  
Expressive, playful and understood.

**Title**  
What kind of memories would you love to bring back?

**Subtitle**  
Choose up to three. We’ll use them to keep your possibilities beautifully focused.

**Choices**  
Relaxation; Adventure; Food & Dining; Culture & Heritage; Photography; Nature; Wildlife; Beaches & Islands; Celebrations.

**Interaction**  
Multi-select with a maximum of three selections. The counter begins as guidance, updates with each selection and changes into a success state when the third choice is made. Once three are selected, remaining cards become muted and unavailable. Deselecting one restores the available state.

**Validation**  
At least one selection is required. Three is a maximum, not a target the traveller is forced to reach. Attempting a fourth selection does not generate a hard error.

**Microcopy**  
- Initial: “Choose up to three.”
- One selected: “1 of 3 — a lovely start.”
- Two selected: “2 of 3 — your journey is taking shape.”
- Three selected: “Perfect. We can already picture the kind of experience you’re looking for.”

**Developer notes**  
Selection order may be retained as a weak signal of priority but must not be presented as an explicit ranking in v1.0. Muted cards remain legible. The limit must be enforced consistently across pointer, touch and keyboard interaction.

**Design notes**  
The success state should feel rewarding without celebration theatre. Muting uses more than colour alone and must not make unselected labels unreadable.

**Future enhancements**  
Adaptive illustrations, contextual examples and optional preference strength in a later planning experience.

### 7.6 Moment Six — Perfect Timing

**Purpose**  
Understand how timing shapes discovery without forcing artificial precision.

**Traveller emotion**  
In control and reassured that flexibility is acceptable.

**Title**  
When would you love this journey to begin?

**Subtitle**  
An exact date is wonderful. A general idea is enough too.

**Choices**  
The timing model should support broad windows and an Exact Dates option. Suitable broad choices may include a near-term window, a meaningful season or “I’m flexible,” provided their language is unambiguous for the traveller’s market.

**Interaction**  
Single selection. The calendar remains hidden unless Exact Dates is chosen. Selecting Exact Dates reveals a date range in context, without moving the traveller to a separate planning screen.

**Validation**  
A timing choice is required. Exact Dates requires a valid departure and return range. The return cannot precede departure. Use calm guidance rather than hard error styling.

**Microcopy**  
- Flexible: “Keeping your travel dates flexible gives us more possibilities to explore.”
- Exact Dates: “Wonderful. Share the dates you already have in mind.”
- Invalid range: “Your return should come after your departure.”

**Developer notes**  
Seasonal terms must not assume a universal school calendar or hemisphere. Dates should be preserved exactly and described in the traveller’s readable locale.

**Design notes**  
Timing cards may use simple contextual symbols. Full photography is optional and must not compete with the calendar when revealed.

**Future enhancements**  
School-holiday awareness, event-aware timing, flexible date windows, availability intelligence and “best time to travel” guidance.

### 7.7 Moment Seven — Destination

**Purpose**  
Conclude discovery by learning whether the traveller already has a place in mind or wants Search My Vacation to lead with inspiration.

**Traveller emotion**  
Hopeful, supported and free from the pressure to know the answer.

**Title**  
Is there somewhere already calling you?

**Subtitle**  
Tell us what you have in mind, or invite us to help you discover somewhere special.

**Choices and questions**  
- “I know where I’d like to go.”
- “Help me discover somewhere special.”

When the destination is known, invite the traveller to name the place. When it is not, no text field is required.

**Interaction**  
Destination is always the final question. The experience adapts if a destination was carried forward from an earlier entry point: confirm it with context and offer a clear way to widen the search.

**Validation**  
A known-destination path requires a meaningful place name. The discovery path is valid through selection alone. Avoid rejecting informal destination language; “somewhere warm in Europe” can be useful context.

**Microcopy**  
- Open path: “Help me discover somewhere special.”
- Known path: “I already have somewhere in mind.”
- Carried-forward confirmation: “You mentioned Japan earlier. Shall we keep that as your starting point?”

**Developer notes**  
Destination is intentionally last. Do not reorder it ahead of emotional discovery in future releases without a documented product decision. Retain both the raw traveller wording and any later normalised destination reference.

**Design notes**  
The open path must feel equally confident and desirable; it is not a fallback. Avoid visual hierarchy that implies knowledgeable travellers are more valid.

**Future enhancements**  
Natural-language destination intent, map-based inspiration, region suggestions and AI-assisted clarification when the traveller’s idea is broad.

### 7.8 Moment Eight — Discover My Possibilities

**Purpose**  
Confirm that Search My Vacation has enough context to generate three governed journey possibilities and enter the Journey Director experience.

**Traveller emotion**  
Understood, excited and confident.

**Title**  
Wonderful. We have everything we need to begin crafting your journey.

**Subtitle**  
We’ll bring together possibilities shaped around what matters most to you.

**Summary**  
Reflect a concise, conversational interpretation of the traveller’s answers. Do not reproduce every response as a database record. The summary should help the traveller recognise themselves and correct anything materially wrong.

**Primary action**  
**✨ Discover My Possibilities**

**Interaction**  
The final action completes the Journey Passport, starts deterministic recommendation logic and transitions into the Journey Director experience. It does not begin booking or imply that a human has already reviewed the Passport. Contact permission or details belong at the intentional human handoff and must be explained in direct relation to the Journey Director consultation. Do not end with “Submit.”

**Validation**  
Any missing requirement should be addressed in its original moment where possible. Final action feedback should be calm, human and unambiguous.

**Microcopy**  
- “Wonderful. We have everything we need to begin crafting your journey.”
- “We’ll use the choices that matter most to you to prepare three thoughtful possibilities.”
- “Discover My Possibilities.”

**Developer notes**  
Completion must preserve the traveller’s original language, create the versioned input required for deterministic matching and generate three journey possibilities using approved eligibility, destination and regional rules. The experience must not claim AI involvement, confirmed availability, a completed itinerary, human review that has not occurred or a response time that the current release cannot guarantee.

**Design notes**  
The closing moment should feel earned but restrained. The transition should prepare the traveller for three carefully differentiated possibilities rather than a catalogue of competing destinations or promotional links.

**Future enhancements**  
Passport stamping, adaptive completion illustrations, AI-assisted interpretation within deterministic safeguards and a saved Journey Passport for authenticated travellers.

---

## 8. Conversation Library

Journey Passport language should sound like an attentive Journey Director: warm without being overly familiar, confident without sounding absolute, and evocative without becoming vague. The library below is the v1.0 source of truth for important conversational moments. Exact wording may be refined through research, but the intention and emotional function must be preserved.

### 8.1 Voice characteristics

- **Human:** Use words a thoughtful person would say naturally.
- **Specific:** Explain why information matters rather than relying on generic reassurance.
- **Invitational:** Offer a path forward without pressure.
- **Economical:** One useful sentence is better than three decorative sentences.
- **Optimistic:** Create anticipation without promising outcomes that have not been confirmed.
- **Non-judgemental:** Never imply that a flexible, uncertain or modest answer is inferior.

### 8.2 Welcome and orientation

| Purpose | Approved or recommended copy |
| --- | --- |
| Experience title | “Welcome to Your Journey Passport” |
| Promise | “Every memorable journey begins with understanding the traveller behind it.” |
| Supporting thought | “We take the time to understand what matters to you, so we can discover experiences that feel truly yours.” |
| Opening action | “Begin My Journey” |
| Brand line | “More Than a Trip. It’s an Experience.” |

### 8.3 Personal introduction

| Purpose | Approved or recommended copy |
| --- | --- |
| Moment title | “First, tell us about you.” |
| Name question | “What should we call you?” |
| Reason | “We’ll use your name to make every conversation feel personal.” |
| Gentle correction | “Please share the name you’d like us to use.” |
| Positive transition | “Lovely to meet you, {name}.” |

Use the traveller’s name sparingly. It should signal recognition, not simulate intimacy.

### 8.4 Companion conversation

| Purpose | Approved or recommended copy |
| --- | --- |
| Question | “Who will be sharing this journey with you?” |
| Context | “Every journey feels different depending on who is beside you.” |
| Transition | “Wonderful. That helps us understand the journey from everyone’s point of view.” |

### 8.5 Journey character

| Purpose | Approved or recommended copy |
| --- | --- |
| Question | “What kind of journey has been living in your heart lately?” |
| Guidance | “Choose the one that excites you most right now.” |
| Transition | “Perfect. We can already picture the kind of experience you’re looking for.” |

The word “dream” may be used as an invitation, but avoid language that makes the experience feel financially unrealistic or unattainable.

### 8.6 Travel style

| State | Approved or recommended copy |
| --- | --- |
| Prompt | “What kind of memories would you love to bring back?” |
| Limit guidance | “Choose up to three. We’ll use them to keep your possibilities beautifully focused.” |
| One selected | “1 of 3 — a lovely start.” |
| Two selected | “2 of 3 — your journey is taking shape.” |
| Three selected | “Perfect. We can already picture the kind of experience you’re looking for.” |
| At selection limit | “Beautiful combination. We’ll begin with these three.” |

Do not use “Maximum reached,” “Selection limit exceeded” or an error alert for the fourth choice. Remaining cards become muted, and the success state explains what happened.

### 8.7 Timing

| Purpose | Approved or recommended copy |
| --- | --- |
| Question | “When would you love this journey to begin?” |
| Reassurance | “An exact date is wonderful. A general idea is enough too.” |
| Exact-date reveal | “Wonderful. Share the dates you already have in mind.” |
| Flexible acknowledgement | “Keeping your travel dates flexible gives us more possibilities to explore.” |
| Range guidance | “Your return should come after your departure.” |

Avoid “Invalid date,” “Bad input” and other system-centred wording.

### 8.8 Destination

| Purpose | Approved or recommended copy |
| --- | --- |
| Final question | “Is there somewhere already calling you?” |
| Supporting line | “Tell us what you have in mind, or invite us to help you discover somewhere special.” |
| Open discovery action | “Help me discover somewhere special.” |
| Known destination action | “I already have somewhere in mind.” |
| Carried-forward context | “You mentioned {destination} earlier. Shall we keep that as your starting point?” |
| Widening the search | “I’m open to other possibilities.” |

“Help me discover somewhere special” must sound like a confident choice, not an admission that the traveller has failed to plan.

### 8.9 Completion and handoff

| Purpose | Approved or recommended copy |
| --- | --- |
| Completion title | “Wonderful. We have everything we need to begin crafting your journey.” |
| Understanding statement | “We’ll bring together possibilities shaped around what matters most to you.” |
| Journey Director context | “Your Journey Director will begin with the choices that matter most to you.” |
| Final CTA | “✨ Discover My Possibilities” |
| Success acknowledgement | “Your possibilities are now in thoughtful hands.” |
| Honest next step | “A Journey Director will review what you’ve shared and continue the conversation with you.” |

Do not promise an exact response time until the business has formally adopted and operationally supported that service level.

### 8.10 Navigation language

Navigation should remain predictable. Recommended actions include “Continue,” “Back,” “Begin My Journey” and the final “✨ Discover My Possibilities.” Do not use whimsical labels when they make the direction unclear.

Selection never causes an unexpected automatic page transition. The traveller confirms readiness through the common continuation action.

### 8.11 Language to avoid

- Submit
- Lead
- Customer data
- Required field
- Invalid input
- Maximum selections reached
- Processing request
- Cheapest
- Package type
- Qualification
- Your query has been received
- Our executive will contact you

These phrases either expose internal systems, sound transactional or weaken the Journey Director relationship.

---

## 9. Adaptive Behaviour

Adaptation is how Journey Passport demonstrates listening. It should reduce repetition, make later questions more relevant and provide timely acknowledgement. Adaptation must remain understandable; the traveller should never wonder why the experience changed or what the system inferred.

### 9.1 Homepage selections carried forward

When the traveller enters from a homepage invitation or mood selection, that choice should travel into the Passport. The Passport may acknowledge it briefly and use it to preselect or contextualise a related choice.

The answer must remain editable. Homepage context is a starting point, not a permanent classification.

**Desired behaviour:**

> “You’re looking for a journey that helps you unwind. Let’s understand what that means for you.”

**Undesired behaviour:** asking the same question again with no acknowledgement, or silently locking an answer.

### 9.2 Destination already known

If a destination was provided earlier, Destination remains the final moment but changes from an open question to a contextual confirmation.

The traveller can:

- retain the destination as the starting point;
- revise the destination;
- invite Search My Vacation to widen the search.

The Passport does not skip Destination entirely because confirmation protects against stale, accidental or overly narrow context. It does not ask twice without explaining why.

### 9.3 Travel Style maximum of three

Travel Style permits one, two or three choices.

- The counter shows the current number and the maximum.
- Copy becomes progressively more affirmative.
- At three, the counter becomes a success state.
- Remaining cards become muted and unavailable.
- Selected cards stay prominent and can be deselected.
- Deselecting restores the remaining cards immediately.
- No hard error is displayed.

This pattern turns a product constraint into useful prioritisation. It also prevents a traveller from selecting every option and producing recommendations with no meaningful focus.

### 9.4 Timing reveals the calendar only for Exact Dates

The date range is conditional. It must not occupy attention for travellers who are flexible or working with a broad period.

When Exact Dates is selected:

- the calendar or date-range inputs appear within the same moment;
- focus moves appropriately without surprising the traveller;
- the departure date informs the earliest valid return date;
- switching away from Exact Dates hides the calendar;
- previously entered dates may be retained temporarily in case the traveller changes back, but they are not treated as active timing unless Exact Dates remains selected.

### 9.5 Progressive personalisation

After About You, the name can appear in a small number of meaningful transitions. Companion and style selections may influence later summary language. Known context should affect the Journey Director handoff even when it does not alter visible copy.

The experience must not over-personalise through unsupported assumptions. Choosing “Family” does not mean there are children. Choosing “Celebration” does not reveal the occasion. Choosing “Luxury” in a future planning context would not justify assumptions about budget.

### 9.6 Human success states

Completion feedback should describe progress in the language of the journey:

- “A lovely start.”
- “Your journey is taking shape.”
- “Beautiful combination.”
- “We have everything we need to begin.”

System states still exist, but they are translated into useful human meaning. Accessibility announcements must remain clear and concise even when visual language is more expressive.

### 9.7 Backward and forward navigation

All answers persist when moving backward and forward. Editing an earlier answer updates any later dependent language or summary. The traveller is never punished for reconsidering.

If a changed answer makes a later answer irrelevant, preserve it cautiously until the dependency can be resolved transparently. Do not silently discard meaningful input.

### 9.8 Future adaptive behaviour placeholders

Future versions may adapt:

- imagery to companion type or travel style;
- question examples to the traveller’s region;
- destination inspiration to season and duration;
- follow-up prompts to uncertainty or conflicting preferences;
- language and cultural framing to locale;
- recommendations based on consented journey history;
- the amount of guidance to traveller confidence;
- Journey Director prompts to gaps or trade-offs.

All future adaptation must satisfy four conditions: it is relevant, explainable, reversible and respectful.

---

## 10. Information Captured

Journey Passport captures only information required for meaningful discovery and responsible follow-up. Labels below describe product intent, not a technical schema.

| Information | Why it is captured | How it should be interpreted |
| --- | --- | --- |
| Preferred name | Enables a human conversation and respectful handoff | The name the traveller wants Search My Vacation to use |
| Homepage intent or feeling, when available | Preserves the context that caused the traveller to begin | An initial signal, always editable |
| Travel companions | Establishes social context | Principal group character, not a full passenger list |
| Dream journey character | Identifies the broad experience being imagined | A discovery archetype, not a destination or product category |
| Travel styles | Identifies up to three experience priorities | A focused preference set, not a complete itinerary |
| Timing preference | Establishes whether timing is broad, seasonal, flexible or exact | A discovery constraint with varying precision |
| Exact date range, when selected | Supports time-sensitive possibilities | Active only when Exact Dates is the chosen timing mode |
| Destination intent | Establishes known-place versus open-discovery mode | May include a specific place or broad natural-language idea |
| Known destination text, when applicable | Preserves the traveller’s own expression | Retain raw wording even if later normalised |
| Entry source and completion context | Helps understand the experience and preserve continuity | Use for experience quality, not covert profiling |

The Journey Director briefing may contain a concise narrative derived from these fields. Derived interpretation must remain distinguishable from what the traveller explicitly said.

---

## 11. Information Intentionally Deferred

Journey Passport deliberately avoids logistical and highly detailed planning information. Deferral is not omission through incompleteness; it is a product decision that protects the quality of discovery.

### 11.1 Budget

Budget is intentionally not collected in Journey Passport v1.0. The opening conversation should establish aspiration and relevance before reducing the journey to a monetary range. Budget is nuanced: it depends on destination, duration, party composition, season, flight expectations and the trade-offs a traveller values.

A Journey Director can introduce investment in context, explain what different ranges enable and avoid making the traveller feel judged. Future research may identify a respectful discovery-stage role for budget, but it must not be added casually.

### 11.2 Departure airport

Departure location is logistical and may depend on route availability, traveller proximity, positioning flights or group composition. It belongs in planning after possibilities are selected.

### 11.3 Hotels and room preferences

Hotel brands, star categories, bedding, connecting rooms, villas and room views matter after the overall experience and destination direction are established. Early collection encourages travellers to specify solutions before receiving advice.

### 11.4 Flights

Cabin, airline, routing, baggage and schedule preferences belong to itinerary planning and live availability. Journey Passport should not imply that it is searching or holding flights.

### 11.5 Visa information

Visa needs depend on nationality, residency, destination and current rules. They require careful, current guidance and may involve sensitive information. A Journey Director should introduce this when a destination direction exists.

### 11.6 Passport information

Passport number, issue date, expiry date and identity-document images are not required for discovery and must never be requested in Journey Passport. They are sensitive booking-stage data subject to stricter handling.

### 11.7 Children’s ages

Choosing Family does not necessarily mean travelling with children. Ages become relevant to occupancy, fares, activities and pace during planning. The Journey Director should ask with context after understanding the family structure.

### 11.8 Meals and dietary details

Food & Dining may be selected as a style, but allergies, dietary restrictions, meal plans and cuisine requirements are planning details. They should be collected when Search My Vacation can explain how they will affect recommendations and supplier communication.

### 11.9 Insurance

Travel insurance is an important protection decision, not a discovery preference. It should be discussed transparently in planning or booking, with appropriate advice and regulatory care.

### 11.10 Special requests and accessibility details

Journey Passport should not ask travellers to document private medical or accessibility information before it is needed. A Journey Director must create a respectful context and explain how the information will be used. Future experiences may offer an optional early signal such as “I have requirements I’d like to discuss,” without demanding details.

### 11.11 Detailed celebrations

Celebration can be a travel-style signal. Names, dates, surprises, ceremonies and supplier requests belong in planning once the broad journey is selected.

### 11.12 Contact details and communication consent

Journey Passport v1.0 does not collect contact details as recommendation inputs. Contact channel and communication consent belong to the intentional human handoff after the traveller has explored or selected a possibility. Their purpose must be explained clearly, consent must be explicit where required and the Decision Engine must not use them to influence ranking.

### 11.13 Why these belong to Journey Director Planning

Deferred information shares one or more characteristics:

- it does not materially improve the first set of possibilities;
- it requires explanation, sensitivity or professional judgement;
- it depends on a destination or itinerary direction;
- it is likely to change through conversation;
- it carries privacy or regulatory risk;
- it makes the opening experience feel like administration.

Journey Director Planning is the appropriate place because context exists, value can be explained and the traveller has already chosen to continue.

---

## 12. Journey Director Handoff

### 12.1 What happens after “Discover My Possibilities”

The final action does not begin booking or claim human review. It signals that the traveller has completed the Passport and is ready for Search My Vacation’s deterministic Release 1 logic to interpret what they shared.

The recommendation input should include:

- the traveller’s own answers and original wording;
- a concise narrative summary;
- the entry context carried from the homepage;
- the chosen companion, journey character and travel styles;
- timing and destination certainty;
- any unresolved ambiguity worth discussing;
- a clear distinction between explicit answers and inferred observations.

The deterministic logic applies operational eligibility, destination and region matching, confidence and explanation rules to generate three journey possibilities: **The Perfect Match**, **A Different Rhythm** and **A Pleasant Surprise**. When a documented fallback prevents a responsible three-result set, the experience must preserve that state honestly rather than manufacture a weak recommendation.

After the traveller explores or selects a possibility, the human handoff should additionally preserve:

- the selected `possibilityId`;
- the destination and recommended region;
- the recommendation personality;
- why the possibility fits;
- relevant trade-offs or unresolved questions; and
- the traveller’s original Passport context;
- consented contact information and channel preference, when the traveller chooses the human handoff; and
- the consent record required for that communication.

The Journey Director must receive enough context to continue without asking the traveller to begin again.

### 12.2 Current Release — deterministic possibilities and human consultation

Release 1 is deterministic in recommendation and human-led in consultation, refinement and planning.

The recommendation logic:

1. validates and normalises the completed Passport;
2. excludes destinations and regions Search My Vacation cannot confidently deliver;
3. matches eligible destinations and regions to the traveller’s signals;
4. generates three differentiated journey possibilities;
5. preserves evidence explaining why each possibility fits; and
6. provides the selected possibility and its context to the human handoff.

The Journey Director:

1. reviews the Passport, recommendation evidence and the possibility the traveller explored or selected;
2. opens the consultation by reflecting what was understood;
3. validates tensions, exceptions and current operational reality;
4. refines the destination, region and journey direction with the traveller;
5. asks only the next questions needed for responsible planning;
6. designs the itinerary after a direction has been chosen; and
7. owns the final traveller handoff and ongoing relationship.

The first consultation is successful when it could not have been written to any generic traveller and does not require the traveller to repeat the Passport.

### 12.3 Release 1 deterministic boundaries

Release 1 recommendation logic is configuration-driven, deterministic, explainable and reviewable. Given the same versioned Passport, destination knowledge and rules, it should produce the same result.

It may normalise inputs, apply eligibility gates, score destinations and regions, assign the three recommendation personalities and assemble approved recommendation content. It must not generate an itinerary, promise availability, reactivate an unsupported destination, conceal missing evidence or imply that a Journey Director has reviewed the result when that has not occurred.

### 12.4 Future — AI-assisted Journey Director

AI may assist by:

- summarising the traveller’s intent;
- suggesting interpretation questions;
- surfacing destination candidates and trade-offs;
- drafting possibility narratives;
- checking whether a response reflects the Passport;
- learning from accepted and rejected recommendations.

The Journey Director remains accountable for appropriateness, accuracy, tone and advice. AI output must be reviewable, correctable and clearly governed.

### 12.5 Future — Journey Builder

Journey Builder begins after login and after a direction has been chosen. It turns selected possibilities into a living itinerary that the traveller and Journey Director can refine together.

Journey Builder is not Journey Passport. Passport discovers; Builder plans. Daily itinerary customisation, drag-and-drop editing, live pricing and saved variations all belong to Builder or later booking experiences.

---

## 13. Future Roadmap

The roadmap protects the v1.0 experience from premature expansion while recording ideas that may become valuable later. Sequence should be driven by traveller evidence, operational readiness and the strength of the Journey Director model.

### 13.1 Near-term experience refinement

- **Adaptive illustrations:** imagery that responds meaningfully to selected journey character or companion context.
- **Passport stamps:** an authentic, restrained completion symbol that marks discovery without implying border control or approval.
- **Purposeful animations:** transitions that reinforce progress, selection and handoff while respecting reduced-motion preferences.
- **Content experimentation:** research-led refinement of questions, card taxonomy and acknowledgements.
- **Accessibility refinement:** continuous testing with assistive technology, keyboard, touch and varied vision or motion needs.
- **Cross-device continuity:** secure resume-later capability where the traveller understands what is saved.

### 13.2 Traveller memory and relationship

- **Traveller memory:** consented preferences that can inform a future journey.
- **Journey history:** a view of prior Passports, recommendations and completed journeys.
- **Returning-traveller welcome:** recognition that avoids asking known questions again.
- **Preference evolution:** ability for travellers to correct what Search My Vacation remembers.
- **Household profiles:** respectful shared context for couples or families without collapsing individual preferences.
- **Privacy controls:** clear visibility into saved information and the ability to delete or update it.

### 13.3 AI Journey Director

- Conversational clarification of broad or conflicting preferences.
- Explainable destination matching.
- Journey Director brief generation.
- Personalised possibility narratives.
- Confidence and uncertainty indicators for internal review.
- Recommendation feedback learning.
- Safety, bias and cultural-sensitivity review.
- Multilingual discovery that preserves traveller meaning rather than translating labels mechanically.

AI Journey Director should first assist humans, then earn the right to take on traveller-facing responsibilities through evidence and governance.

### 13.4 Journey Builder

- Authenticated saved journeys.
- Collaborative traveller and Journey Director planning.
- Daily itinerary customisation.
- Drag-and-drop itinerary editing.
- Activity replacement and alternative suggestions.
- Travel-time and pace awareness.
- Live pricing and availability where reliable.
- Family or group collaboration.
- Comments, decisions and responsibility assignment.
- Version history.
- Saved itinerary variations.
- Side-by-side comparison of meaningful trade-offs.
- Approval milestones and change summaries.

### 13.5 Commercial and operational maturity

- CRM handoff with auditable consent.
- Journey Director workload and response orchestration.
- Recommendation outcome tracking.
- Supplier knowledge integration.
- Quotation and booking transitions that retain Passport context.
- Service-level communication based on actual capacity.
- Quality review of the relationship between Passport answers and recommendations.

### 13.6 Additional logical enhancements

- **Shared inspiration board:** travellers collect images or ideas after discovery, not during the core Passport.
- **Occasion pathways:** planning support for honeymoons, anniversaries, family milestones and reunions.
- **Accessibility planning pathway:** optional, private and context-rich support after discovery.
- **Sustainable travel preferences:** introduced when choices and trade-offs can be explained meaningfully.
- **Post-journey reflection:** capture what the traveller loved and use it—with consent—to improve future journeys.
- **Journey Passport export:** a beautiful human-readable record of the traveller’s starting intent.

---

## 14. Success Metrics

Metrics must measure both progression and the quality of understanding. A high completion rate is not sufficient if recommendations are generic or Journey Directors repeat every question.

### 14.1 Completion Rate

**Definition:** Percentage of travellers who begin the first discovery question and complete **✨ Discover My Possibilities**.

Track by entry source, device class, new versus returning traveller and relevant experience variant. Do not optimise completion by removing questions that are essential to recommendation quality.

### 14.2 Drop-off Rate

**Definition:** Percentage and count of travellers who leave at each moment.

Investigate qualitative causes: unclear choices, weak imagery, perceived sensitivity, technical friction, loss of relevance or excessive interaction cost. A pause at Destination may signal uncertainty rather than poor design and should be studied carefully.

### 14.3 Average Completion Time

**Definition:** Time from the first discovery question to final action, excluding obvious inactivity where possible.

The goal is not the shortest time. An experience completed so quickly that choices are meaningless is not successful. Use time to identify friction and compare pathways, especially known destination versus open discovery.

### 14.4 Recommendation Acceptance

**Definition:** Percentage of completed Passports that lead to at least one possibility the traveller wants to explore further.

This is a stronger measure of discovery quality than form completion. Track which aspects of the Passport contribute to accepted recommendations without reducing travellers to deterministic segments.

### 14.5 Journey Director Conversations

Measure:

- completed Passports that lead to a two-way conversation;
- time from completion to meaningful first response;
- proportion of first responses that reference Passport context;
- repeated-question rate;
- Journey Director assessment of briefing usefulness.

A decrease in repeated questions is a direct signal that the handoff is working.

### 14.6 Bookings

Measure completed bookings originating from Journey Passport, while recognising that booking conversion is affected by price, availability, timing and service quality beyond the Passport itself.

Avoid optimising discovery solely for immediate conversion. A traveller who receives honest advice and returns later may represent greater long-term value than a pressured booking.

### 14.7 Repeat Travellers

Measure the rate at which Passport travellers return for another journey and whether remembered context improves the next experience. Repeat use is evidence that the relationship, not merely the transaction, created value.

### 14.8 Experience-quality measures

Recommended qualitative and operational measures include:

- “Search My Vacation understood what I was looking for.”
- “The questions felt relevant.”
- “The experience was easy to complete.”
- “The possibilities felt personal.”
- Journey Director confidence in the handoff.
- Traveller corrections to the generated summary.
- Accessibility task success.
- Technical error and recovery rate.

### 14.9 Guardrail metrics

Track contact opt-out, complaint rate, abandoned contact attempts, recommendation irrelevance, sensitive-data entry into free text and accessibility failures. Growth must not come at the cost of trust.

---

## 15. What We Never Want Travellers To Feel

### 15.1 Rushed

Travel often carries emotional and financial significance. The traveller must have control over progression and the freedom to reconsider. Automatic advancement, expiring choices and artificial urgency have no place in discovery.

### 15.2 Interrogated

A sequence of unexplained questions feels extractive even when each field is simple. The Passport explains why meaningful information helps and responds to answers so the experience feels reciprocal.

### 15.3 Judged

Uncertainty, flexibility, companion type, destination knowledge and future budget must never become status signals. The traveller should be equally welcome whether they arrive with a detailed idea or only a feeling.

### 15.4 Confused

Premium does not mean mysterious. Choices, limits, progress and next actions must be understandable. Evocative copy supports meaning; it never replaces it.

### 15.5 Overwhelmed

The Passport protects attention through progressive disclosure, focused choices and the maximum-of-three Travel Style rule. Logistics are deferred because presenting everything at once weakens both imagination and comprehension.

### 15.6 Sold To

The traveller has begun discovery, not entered a sales funnel. The experience must not introduce urgency, packages, discounts or manipulative contact prompts. Recommendations should demonstrate fit before commercial planning begins.

Avoiding these emotions is fundamental because Journey Passport exists to build trust before Search My Vacation asks the traveller to act on advice. Once trust is damaged in the first conversation, visual polish cannot restore it.

---

## 16. Appendix

### 16.1 Decision Summary

The following decisions are approved for Journey Passport v1.0 and must not be changed through incidental implementation work:

1. Journey Passport is a discovery experience, not a planning tool.
2. Planning begins after recommendations.
3. Release 1 uses deterministic recommendation logic to generate three journey possibilities; a human Journey Director remains responsible for consultation, refinement, itinerary design and the final traveller handoff.
4. Journey Builder is a future authenticated capability.
5. Daily itinerary customisation belongs to Journey Builder.
6. Journey Passport intentionally avoids logistical information.
7. Destination is the final question.
8. The final CTA is **✨ Discover My Possibilities**.
9. Travel Style allows a maximum of three selections.
10. The selection counter changes to a success state.
11. Remaining Travel Style cards become muted at the limit.
12. Ordinary choice constraints use no hard errors.
13. Human conversation replaces system messages.
14. Known information is not requested again without context.
15. Selection does not unexpectedly auto-advance.
16. The Passport becomes progressively more personal.

Any proposal to alter these decisions should include traveller evidence, Journey Director implications and a recorded product decision.

### 16.2 Design Evolution

Journey Passport began as a premium alternative to a travel enquiry form. Early thinking focused on improving the presentation of familiar fields. Product discussion revealed that visual treatment alone could not change the underlying relationship: a beautiful form still feels like a form when it asks for logistics before showing understanding.

The concept therefore evolved through several important shifts:

- from information capture to a first conversation;
- from Traveller Passport as a profile form to Journey Passport as the beginning of discovery;
- from destination-first questioning to traveller-first understanding;
- from immediate logistics to progressive emotional context;
- from inconsistent automatic progression to traveller-controlled navigation;
- from unrestricted preference collection to focused Travel Style prioritisation;
- from system validation to conversational guidance;
- from contact submission to **Discover My Possibilities**;
- from an implied or opaque automated result to governed deterministic possibilities followed by honest human Journey Director consultation;
- from itinerary ambitions inside the Passport to a separate future Journey Builder.

The immigration-style stamp explored during earlier design work remains a valuable future completion expression, but the enduring product value is the feeling of being understood. The stamp must never become more important than the conversation that earns it.

### 16.3 Future Ideas Parking Lot

The following ideas are intentionally recorded without being commitments:

- illustrated chapter transitions;
- ambient motion and optional sound with explicit control;
- physical-passport-inspired progress;
- destination storytelling previews;
- voice-guided Passport completion;
- multi-person preference reconciliation;
- private family voting;
- inspiration from prior journeys;
- destination confidence explanations;
- uncertainty-aware follow-up questions;
- Journey Director video or audio introductions;
- traveller-created possibility collections;
- shared planning sessions;
- post-trip Passport reflections;
- memory-based anniversary or milestone prompts;
- downloadable journey narrative;
- concierge availability scheduling;
- culturally adaptive copy;
- assisted completion for travellers who prefer a phone conversation.

Ideas remain parked until they support a validated traveller need and preserve the Passport’s interaction budget.

### 16.4 References

This specification should be read alongside the following repository documents:

- `docs/02-Product/PRODUCT-VISION.md` — traveller-first product belief and overall promise.
- `docs/02-Product/TRAVELLER-INTENT-FRAMEWORK.md` — emotional and situational intent foundations.
- `docs/02-Product/TRAVEL-JOURNEYS.md` — wider journey model.
- `docs/02-Product/PRODUCT-ROADMAP.md` — portfolio sequencing.
- `docs/01-Vision-Business/TRAVELLER-PROFILES.md` — traveller context and audience understanding.
- `docs/04-UX/DESIGN-TOKENS.md` — shared visual foundations.
- `docs/04-UX/TYPOGRAPHY.md` — typography principles.
- `docs/04-UX/IMAGERY-GUIDELINES.md` — photographic direction.
- `docs/07-Design/DESIGN-PRINCIPLES.md` — experience-wide design standards.
- `docs/10-Backlog/ANTI-GOALS.md` — behaviours and product directions to avoid.

### 16.5 Stewardship Questions

Before approving any Journey Passport change, ask:

1. Does this help us understand the traveller before recommending?
2. Does the traveller understand why we are asking?
3. Could this information wait until Journey Director Planning?
4. Are we using information the traveller has already shared?
5. Does the interaction feel like human conversation or system administration?
6. Is the adaptation explainable and reversible?
7. Does this improve recommendation quality enough to justify the attention it costs?
8. Will a Journey Director be able to act on the answer?
9. Are we promising anything the current service cannot reliably deliver?
10. Will the traveller finish feeling, “They listened to me before suggesting where I should go”?

If the final answer is no, the change does not belong in Journey Passport.

---

## Closing Principle

Journey Passport is the moment Search My Vacation proves its central belief.

We do not begin with a destination because the traveller is more important than the inventory. We do not begin with logistics because aspiration deserves room before administration. We do not end with a submission because discovery should open a relationship, not close a form.

The Passport succeeds when its presence is felt in everything that follows: the relevance of the possibilities, the quality of the Journey Director conversation, the confidence of the traveller and the sense that the journey was designed with care from its very first moment.

> **Understand first. Discover thoughtfully. Plan together.**
