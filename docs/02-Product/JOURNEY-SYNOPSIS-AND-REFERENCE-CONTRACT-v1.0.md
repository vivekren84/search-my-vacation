# Journey Synopsis and Journey Reference Contract

| Document Field | Value |
| --- | --- |
| **Version** | v1.0 |
| **Status** | Release 1 product contract |
| **Owner** | Search My Vacation — Product & Experience |
| **Purpose** | Define the traveller-centred continuation artefacts created after Journey Director recommendations. |
| **Last Updated** | 25 July 2026 |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Philosophy](#2-product-philosophy)
3. [Journey Synopsis Contract](#3-journey-synopsis-contract)
4. [Journey Reference Contract](#4-journey-reference-contract)
5. [Lifecycle](#5-lifecycle)
6. [Persistence](#6-persistence)
7. [Consent](#7-consent)
8. [Human Handoff](#8-human-handoff)
9. [WhatsApp Continuation](#9-whatsapp-continuation)
10. [Callback Continuation](#10-callback-continuation)
11. [Future Compatibility](#11-future-compatibility)
12. [Out of Scope](#12-out-of-scope)
13. [Open Product Decisions](#13-open-product-decisions)
14. [Revision History](#14-revision-history)

## 1. Executive Summary

The Journey Synopsis and Journey Reference preserve the value of a traveller’s completed discovery conversation without turning that person into a technical record or making them repeat themselves.

A **Journey Synopsis** is a human-readable travel brief. It captures what matters to the traveller at a particular moment, the considered possibility they explored, and the questions a human Journey Designer should take forward.

A **Journey Reference** is a short, non-personal identifier for that journey. It allows a traveller and a Search My Vacation team member to refer to the same conversation clearly over WhatsApp, phone or a future support channel.

The Synopsis carries meaning. The Reference carries identity. Neither is a booking, quotation, itinerary, confirmation or guarantee of availability.

## 2. Product Philosophy

Search My Vacation listens before it recommends. The Synopsis continues that conversation in a form a traveller can recognise and a human Journey Designer can use with care.

The Journey Synopsis is not:

- raw Journey Passport answers;
- a technical payload;
- a scoring report;
- a CRM record;
- a booking, quotation or confirmed itinerary.

The Journey Synopsis is:

- a human-readable travel brief;
- a continuation of the traveller’s conversation;
- a snapshot of the journey at that moment;
- an honest record of what is understood, what remains open and what requires human refinement.

It must make the traveller feel understood without exposing internal recommendation mechanics. It must not imply that availability, price, visa conditions, accommodation, routing or any operational fact has been confirmed.

## 3. Journey Synopsis Contract

### 3.1 Creation point

A Journey Synopsis is created only after a valid Journey Passport has produced a Journey Director result. It reflects the active possibility the traveller is exploring. When the traveller explicitly chooses **This Feels Right**, that selected possibility becomes the preferred handoff context.

If the traveller has not made an explicit preference, the Synopsis may identify the most recently explored possibility as the current conversation context, while making clear that alternatives remain open.

### 3.2 Canonical fields

| Information | Product requirement | Audience |
| --- | --- | --- |
| Traveller first name | The name the traveller asked Search My Vacation to use. | Traveller-visible; Journey Designer-visible |
| Travelling party | The companion type or group context shared in Journey Passport. | Traveller-visible; Journey Designer-visible |
| Approximate party size | Shown only when the traveller has explicitly provided it during a later conversation or handoff. Otherwise state that it is to be confirmed; never infer it from companion type. | Journey Designer-visible |
| Travel timing | The timing the traveller shared, including exact dates only when provided. | Traveller-visible; Journey Designer-visible |
| Journey emotion / intent | A concise human interpretation of the desired feeling, journey character and meaningful memories. | Traveller-visible; Journey Designer-visible |
| Preferred comfort level | An explicit comfort preference when one has been separately and appropriately collected. Otherwise record it as unknown or to be discussed; never infer it from destination or traveller type. | Journey Designer-visible; traveller-visible only when meaningful and confirmed |
| Preferred pace | An explicit preference where available. A cautiously derived pace may support human planning only when described as an interpretation, not a stated fact. | Traveller-visible; Journey Designer-visible |
| Known destination | A destination or destination idea supplied by the traveller, if any. | Traveller-visible; Journey Designer-visible |
| Recommended possibility | The active or explicitly preferred destination and region. | Traveller-visible; Journey Designer-visible |
| Recommendation personality | **The Perfect Match**, **A Different Rhythm**, or **A Pleasant Surprise**. | Traveller-visible; Journey Designer-visible |
| Why this fits | Two to four grounded reasons expressed in traveller language. | Traveller-visible; Journey Designer-visible |
| Key planning considerations | Important trade-offs, unanswered questions or conditions requiring human validation. | Traveller-visible where relevant; Journey Designer-visible |
| Timestamp | The moment the Synopsis was prepared or materially updated. | Journey Designer-visible; traveller-visible where useful |

### 3.3 Audience boundaries

#### Traveller-visible

The traveller may see their name, journey story, the active recommendation, its personality, reasons it fits, meaningful considerations, and a clear explanation of the next human step. The tone must be calm, specific and honest.

#### Journey Designer-visible

The Journey Designer receives the traveller-facing Synopsis plus the information necessary to continue planning without reopening the discovery conversation: known timing, travelling-party context, stated destination context, the selected or current possibility, open questions, and any traveller notes provided for the handoff.

#### Internal only

Internal material may support responsible operation and review, but must never appear in a traveller-facing Synopsis. This includes engine trace, scores, ranking, confidence bands, diagnostics, exclusion reasons, operational metadata, version information and similar decision-support evidence.

Internal information must not be used to make a traveller feel judged, scored or categorised.

### 3.4 Truthfulness rules

- The Synopsis must distinguish stated information from careful interpretation and from information still to be confirmed.
- It must preserve uncertainty rather than filling gaps with favourable assumptions.
- It must remain tied to the active possibility so that destination, region, reasons, moments and handoff context never mix across alternatives.
- It must not promise price, availability, route, accommodation, visa outcome or booking status.

## 4. Journey Reference Contract

### 4.1 Purpose

The Journey Reference allows a traveller and Search My Vacation to identify the same journey conversation quickly and confidently. It is designed for a phone call, WhatsApp continuation, callback request and future service records.

### 4.2 Business requirements

The Journey Reference must:

- uniquely identify one journey conversation;
- be short, human-readable and easy to quote aloud;
- remain stable for the life of that journey conversation unless a material restart is clearly communicated;
- contain no traveller name, phone number, destination, date of birth, booking number or other personal information;
- not reveal internal scoring, commercial terms, supplier identity or operational status;
- be recognisable in written and spoken support conversations.

Illustrative formats are `JY-4827` and `JOURNEY-84KQ`. These examples describe the desired character only; this contract does not prescribe a generation method.

## 5. Lifecycle

```text
Journey Passport
        ↓
Journey Session
        ↓
Journey Director
        ↓
Journey Synopsis
        ↓
Journey Reference
        ↓
Human Journey Designer
        ↓
Future CRM
        ↓
Future AI Concierge
```

The Journey Session carries the traveller’s in-progress context through the immediate recommendation experience. Journey Director turns that context into governed possibilities. The Journey Synopsis carries forward the meaningful, human-readable result; the Journey Reference lets that result be continued safely across channels.

## 6. Persistence

### 6.1 Release 1 expectations

Within the active browser session, a completed Journey Passport, its current Journey Director result and the selected or preferred possibility should survive refresh and route changes where the session remains valid.

A traveller should not be shown an unrelated recommendation or be asked to repeat the completed discovery conversation merely because the page refreshed.

Across a browser restart, Release 1 does not promise automatic recovery unless the traveller has chosen a consented continuation method. Where no continuation has been chosen, the product should be honest about what cannot be recovered.

### 6.2 Future expectations

With explicit consent, a Journey Reference and Synopsis may support secure recovery across devices, repeat conversations, CRM continuity, authenticated accounts and future concierge assistance. The traveller must remain able to understand and control the continuation they are choosing.

## 7. Consent

The Synopsis remains inside the immediate Journey Session until the traveller chooses a continuation action that requires sharing it.

Explicit consent is required when:

- a concise continuation is prepared for WhatsApp;
- a callback request carries journey context to the human team;
- contact details and a Synopsis are retained beyond the active browser session;
- a future CRM, account or concierge service uses the information for a new purpose.

The consent moment must state what will be shared, with whom, through which channel, and what the traveller can expect next. Choosing to explore a possibility is not consent to contact the traveller. A selected preference alone is not consent to persist contact context.

Internal quality, safety and governance records remain internal and must be handled according to applicable privacy requirements. They are not part of a traveller-facing Synopsis.

## 8. Human Handoff

When a traveller chooses to continue with a human Journey Designer, the handoff contains:

- Journey Reference;
- Journey Synopsis;
- selected recommendation, or the most recently explored possibility if no preference was selected;
- any traveller notes intentionally supplied for the handoff;
- clear open questions that need human refinement.

The handoff must not send raw Journey Passport answers as a replacement for the Synopsis. It must not expose internal engine information, scoring, ranking, confidence or diagnostics.

The Journey Designer uses the handoff to begin with understanding, confirm the details that still matter, validate operational reality and shape an itinerary responsibly.

## 9. WhatsApp Continuation

A WhatsApp message is a concise invitation to continue, not a copy of the entire traveller record. It should include:

- a friendly acknowledgement;
- Journey Reference;
- the selected or current destination and region, where appropriate;
- a one-line statement of the journey intent or next conversation;
- a clear request for the human Journey Designer to continue the conversation.

The full Journey Synopsis, raw Passport answers, internal reasoning, diagnostics, scoring and a full recommendation set remain outside the WhatsApp message. Details are shared only as needed and with the traveller’s explicit consent.

## 10. Callback Continuation

A callback request may accompany:

- Journey Reference;
- traveller first name;
- chosen callback date and time window;
- selected or current possibility;
- a short traveller note, if intentionally supplied.

The callback request must not expose raw Journey Passport answers, internal reasoning, scores, ranking, diagnostics or a full recommendation set. The human Journey Designer receives the Synopsis through the approved internal continuation process, not through a public callback confirmation.

## 11. Future Compatibility

The same product contracts can support future CRM continuity, repeat travellers, an AI Concierge and authenticated accounts without changing what the traveller recognises as their journey story.

Future capabilities may add secure recovery, permissioned history, richer preference refinement and more contextual assistance. They must preserve the core boundary: the Journey Synopsis remains a human-readable brief, the Journey Reference remains non-personal, and a traveller’s consent governs new uses of their information.

## 12. Out of Scope

This contract does not define:

- storage model or retention implementation;
- database schema;
- TypeScript types;
- API contracts;
- identifier-generation algorithm;
- CRM configuration;
- WhatsApp provider integration;
- callback system implementation;
- analytics or event-tracking implementation.

These belong to engineering and operational design after product approval.

## 13. Open Product Decisions

1. What consent wording and acknowledgement are approved for WhatsApp and callback continuation?
2. What traveller-facing retention period applies after a consented human handoff?
3. When should a materially revised Passport create a new Journey Reference rather than update the existing conversation?
4. Who may access a Synopsis internally, and what service-level expectation applies to a callback continuation?
5. Which future account or CRM capabilities require a new consent moment rather than relying on the original handoff consent?

## 14. Revision History

| Version | Date | Owner | Summary |
| --- | --- | --- | --- |
| v1.0 | 25 July 2026 | Search My Vacation — Product & Experience | Initial Release 1 contract for Journey Synopsis and Journey Reference. |
