# EBC-003 — Journey Director

## 1. Metadata

| Field | Value |
| --- | --- |
| **EBC Number** | EBC-003 |
| **Title** | Journey Director Implementation |
| **Card type** | Engineering Build Card / implementation contract |
| **Release** | Release 1 |
| **Sprint** | Journey Director implementation sprint — number to be assigned by the Product Owner |
| **Status** | Ready for implementation |
| **Repository** | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| **Target branch** | `feature/ebc-003-journey-director` |
| **Owner** | Team Satvi |
| **Reviewers** | Tiger — Engineering; Archie — Architecture; Sophie — UX; Sri — Traveller Experience; Product Owner — Approval |
| **Primary dependency** | EBC-002 — Journey Passport v1.0 |
| **Last updated** | 22 July 2026 |

> This card is the canonical engineering contract for Journey Director Release 1. It translates approved product and UX specifications into implementation requirements. It does not redefine recommendation behaviour, destination knowledge, Journey Passport fields or the traveller experience.

### 1.1 Reference Authority

The following documents are mandatory sources of truth:

1. `docs/00-Project-Compass/DECISION-LOG.md`
2. `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`
3. `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`
4. `docs/02-Product/JOURNEY-DIRECTOR-DECISION-ENGINE.md`
5. `docs/04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md`
6. `docs/09-Development/EBC-EXECUTION-STANDARD.md`

Supporting design authorities remain:

- `docs/07-Design/BRAND-IDENTITY.md`
- `docs/07-Design/DESIGN-PRINCIPLES.md`
- `docs/04-UX/DESIGN-TOKENS.md`
- `docs/04-UX/COLOR-SYSTEM.md`
- `docs/04-UX/TYPOGRAPHY.md`
- `docs/04-UX/IMAGERY-GUIDELINES.md`
- `docs/04-UX/ICONOGRAPHY.md`

### 1.2 Authority and Conflict Rule

If this card appears to conflict with an approved source:

1. Decision-005 governs the Release 1 responsibility boundary.
2. Journey Passport governs traveller inputs and completion behaviour.
3. Destination Knowledge Base governs destination eligibility and destination or region facts.
4. Journey Director Decision Engine governs deterministic matching, scoring, personalities, confidence, Story Packets, overrides and fallbacks.
5. Journey Director Experience governs traveller-facing sequence, interaction, content hierarchy and responsive behaviour.
6. EBC Execution Standard governs execution, validation, review and stop conditions.

Implementation convenience must never introduce new product behaviour. Any unresolved contradiction must be returned to Product before code proceeds.

### 1.3 Approved Release 1 Decision

Release 1 uses deterministic recommendation logic to generate up to three qualified journey possibilities:

- **The Perfect Match**;
- **The Beautiful Puzzle**; and
- **The Hidden Gem**.

The normal result contains all three. When governed eligibility, evidence or confidence requirements cannot support three responsible results, the documented fallback returns fewer rather than manufacturing a weak possibility.

A human Journey Director remains responsible for consultation, refinement, itinerary design and the final traveller handoff. Routine generation and display of Release 1 possibilities must not depend on pre-display human preparation or autonomous AI.

---

## 2. Objective

Implement the complete Release 1 Journey Director experience that begins after a valid Journey Passport is completed.

The implementation must:

- recover and validate the completed Journey Passport;
- translate Passport answers into versioned traveller signals;
- read governed destination and region knowledge;
- deterministically filter, score and rank eligible candidates;
- assign the three approved recommendation personalities;
- build a complete Story Packet for every displayed possibility;
- present the approved seven-screen Journey Director flow;
- make Screens 5–7 fully dynamic from the active `possibilityId`;
- preserve one reusable layout while the selected story changes;
- carry the traveller's selected context into an honest human Journey Director handoff; and
- recover gracefully when data, content, session or recommendation preparation is incomplete.

The implementation is complete only when the recommendation result is evidence-backed, reproducible for the same versioned inputs, operationally eligible and usable across supported devices and assistive technologies.

---

## 3. Product Promise

The Journey Director is the moment when listening becomes understanding.

After completing the Journey Passport, the traveller should feel:

> **“They listened to me, understood what matters and showed me possibilities chosen for my journey—not simply destinations they wanted to sell.”**

The product promise requires the implementation to demonstrate understanding before revealing destinations, explain every possibility in the traveller's language, recommend at destination and region level, and remain honest about what has not yet been confirmed.

The Journey Director is not:

- an OTA result grid;
- a random destination carousel;
- a chatbot;
- an AI demonstration;
- an itinerary builder;
- a quotation or availability engine; or
- a substitute for human consultation.

The visible service identity is **Journey Director**. Traveller-facing copy must not expose internal scores, algorithm terminology, model names, prompts or confidence bands.

---

## 4. Scope

### 4.1 Included

EBC-003 includes:

- the `/journey-director` route and its complete Release 1 experience;
- Journey Passport completion handoff into Journey Director;
- session-scoped, versioned Journey Passport persistence and recovery;
- runtime validation of restored Passport and Decision Result data;
- Journey Passport normalisation using only approved v1.0 fields;
- typed, governed destination and region data derived from the Destination Knowledge Base;
- operational status and eligibility gates;
- destination scoring, penalties and deterministic tie-breaking;
- region eligibility, scoring and selection;
- recommendation confidence assessment;
- personality assignment for The Perfect Match, The Beautiful Puzzle and The Hidden Gem;
- honest one-result, two-result, no-result and system-failure states;
- explanation evidence and Decision Trace generation;
- Story Packet generation and validation;
- approved destination and region imagery references;
- Screens 1–4 shared Journey Director narrative;
- dynamic Screens 5–7 driven by the active possibility;
- possibility exploration and explicit preference selection;
- contextual human Journey Director handoff payload;
- permitted, auditable manual override logic without building an internal dashboard;
- responsive desktop, tablet and mobile layouts;
- keyboard, screen-reader, focus, contrast and reduced-motion support;
- deterministic unit, contract and scenario tests; and
- all validation and delivery reporting required by the EBC Execution Standard.

### 4.2 Not Included

Do not implement:

- autonomous or generative AI recommendation logic;
- AI-written traveller-facing copy;
- live airfare, hotel or activity inventory;
- live pricing, quotation or package calculation;
- itinerary generation or day-by-day planning;
- booking, payment or reservation flows;
- visa, weather or availability guarantees;
- CRM, WhatsApp, email or callback integration unless a separately approved dependency already exists;
- an internal Journey Director administration workspace;
- destination activation or operational-status editing in the traveller interface;
- authentication, accounts or cross-device saved journeys;
- traveller profiling from third-party data;
- analytics collection without approved consent and event definitions;
- redesign of Journey Passport, homepage, global navigation or unrelated sections; or
- destinations, regions or experiences absent from approved governed data.

### 4.3 Deferred

The following remain future work:

- AI-assisted signal interpretation and grounded narrative variation;
- backend persistence and cross-device resumption;
- CRM and communication-channel integrations;
- saved or emailed recommendation pages;
- human override workspace and operational dashboards;
- live operational feeds;
- hotel and itinerary intelligence;
- traveller history and memory;
- advanced analytics and recommendation calibration tooling;
- final animation, typography and image-crop polish; and
- production performance tuning beyond the Release 1 targets.

Deferred capabilities may have typed extension points. They must not appear active, be simulated to travellers or increase the current scope.

### 4.4 Constraints

- Do not add, remove or rename Journey Passport questions.
- Do not infer Passport inputs that v1.0 does not collect.
- Do not use contact information as a recommendation input.
- Do not expose `COMING_SOON`, `INACTIVE`, unsupported or operationally held destinations.
- Do not hard-code production recommendations in UI components or adapters.
- Do not use demo or sample traveller data as a production fallback.
- Do not fill a three-card layout with an unqualified candidate.
- Do not mix content or imagery between possibilities.
- Do not make the UI responsible for scoring or eligibility decisions.
- Do not change screen structure based on destination.
- Do not imply human review, confirmed availability, confirmed itinerary, price or booking when none occurred.
- Do not introduce a new runtime dependency when TypeScript, React, Next.js or existing project tooling is sufficient.
- Do not modify unrelated completed features.

---

## 5. Technical Architecture

### 5.1 Canonical Data Flow

```text
Journey Passport
        ↓
Journey Session
        ↓
Passport Normalisation
        ↓
Eligibility → Destination Scoring → Region Ranking
        ↓
Personality Assignment → Confidence and Fallback Assessment
        ↓
Decision Result + Decision Trace
        ↓
Story Packet Validation
        ↓
Journey Director UI
        ↓
Selected Possibility Handoff
        ↓
Human Journey Director
```

Each boundary must have an explicit TypeScript contract. No presentation component may reach around a boundary to read unvalidated raw data.

### 5.2 Journey Passport Boundary

The engine accepts only the versioned Journey Passport v1.0 contract.

The implemented input includes:

- preferred name;
- optional homepage entry context;
- companion;
- dream journey character;
- one to three travel styles;
- timing choice;
- exact dates when selected;
- destination mode;
- known destination text when applicable;
- schema version; and
- completion metadata.

Pace and comfort are not explicit Journey Passport v1.0 fields. Derived pace must carry lower evidence strength. Traveller comfort must remain `UNKNOWN` unless a separately governed explicit signal exists. The engine must never invent either value.

### 5.3 Journey Session Boundary

Journey Session preserves the completed Passport and the minimum Journey Director state required for refresh-safe continuity.

Requirements:

- use `sessionStorage`, not permanent local storage;
- use explicit schema and storage-key versions;
- validate parsed data before use;
- ignore or clear incompatible data safely;
- preserve the traveller's completed Passport across route navigation and refresh;
- preserve the generated Decision Result or regenerate it deterministically from the same versioned inputs;
- preserve the active and explicitly preferred `possibilityId` where appropriate;
- never persist demo data as traveller data;
- remain usable in memory when browser storage is unavailable; and
- avoid hydration mismatch or a flash of unrelated sample content.

Direct access without a recoverable Passport must show an honest recovery state with a route back to Journey Passport. It must not silently substitute a sample traveller or production-looking recommendation.

### 5.4 Governed Destination Data

The Destination Knowledge Base is the business source of truth.

The implementation must create a typed, reviewable representation for active, coming-soon and inactive destination and region records. It must preserve the controlled vocabulary, destination status, emotional identity, themes, traveller suitability, pace, comfort, region intelligence, signature experiences, content references and operational confidence needed by the Decision Engine.

Rules:

- maintained data belongs outside UI components;
- stable IDs are required for destinations, regions and experiences;
- status and service-confidence gates must be centrally enforced;
- only approved image references may enter Story Packets;
- unknown knowledge must remain unknown rather than defaulting to a favourable value;
- a content record may not activate a destination; and
- changes to governed data must be reviewable without editing scoring functions.

### 5.5 Decision Engine Boundary

Decision functions should be pure wherever practical.

Given identical:

- Passport schema and values;
- Destination Knowledge Base version;
- operational snapshot;
- rules and thresholds version; and
- content-template version;

the engine must return the same ranking, personality assignment, confidence assessment and Story Packets.

The engine owns:

- normalisation;
- eligibility;
- scoring;
- penalties;
- region selection;
- deterministic tie-breaking;
- personality assignment;
- confidence and fallbacks;
- explanation evidence;
- Decision Trace; and
- Story Packet assembly.

The UI owns none of these decisions.

### 5.6 Decision Result Contract

The public Decision Result must contain:

- result status;
- version metadata;
- traveller reflection inputs safe for presentation;
- zero to three presentable Story Packets;
- fallback or clarification state when applicable;
- generated timestamp;
- active possibility default when possibilities exist; and
- a reference to an internal Decision Trace.

The internal Decision Trace must preserve:

- normalised signals and their evidence strength;
- eligible and excluded destinations;
- exclusion and suppression reasons;
- dimension scores and penalties;
- region scores;
- ranking and tie-break decisions;
- personality assignment evidence;
- confidence assessment;
- unresolved trade-offs;
- Story Packet validation results; and
- any override record.

Internal scores and traces must not be rendered to travellers.

### 5.7 Story Packet Contract

Every possibility displayed on Screen 4 must have a complete Story Packet for Screens 5–7.

At minimum, the contract includes:

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

The production types may extend this contract only where the Decision Engine specification requires it. They must not weaken or rename its approved meaning.

A Story Packet validator must block a possibility when required content, approved imagery, evidence, region context or handoff data is absent or inconsistent.

### 5.8 Journey Director UI Boundary

The UI consumes a Decision Result and Story Packets. It must not import raw fixture recommendations in production.

Screens 1–4 share the Journey Director narrative structure. Screens 5–7 use the active Story Packet.

Changing `possibilityId` must replace destination-specific content atomically while preserving:

- the reusable layout;
- Journey Passport state;
- shortlist;
- focus and interaction model;
- responsive structure; and
- explicit preferred selection.

### 5.9 Human Journey Director Boundary

The handoff payload must carry:

- selected or most recently explored `possibilityId`;
- explicit preference state;
- destination and region identifiers;
- recommendation personality;
- fit summary and evidence references;
- material trade-offs and unresolved questions;
- complete original Passport context;
- relevant version metadata; and
- contact and consent data only when separately collected for the handoff.

If no backend handoff channel exists, the UI must describe only the action it can actually complete. A local confirmation must not claim that a person, CRM, WhatsApp account or email system was notified.

### 5.10 Recommended Module Separation

The exact filenames may follow existing repository conventions, but the following responsibilities must remain separate:

```text
web/
├── types/
│   └── journey-director.ts
├── config/
│   ├── destinations.ts
│   ├── journey-director-rules.ts
│   └── journey-director-content.ts
├── lib/journey-director/
│   ├── normalize-passport.ts
│   ├── eligibility.ts
│   ├── score-destination.ts
│   ├── score-region.ts
│   ├── assign-personalities.ts
│   ├── confidence.ts
│   ├── explanation.ts
│   ├── build-story-packet.ts
│   ├── decision-trace.ts
│   └── recommend-journeys.ts
├── context/
│   └── JourneySessionContext.tsx
├── components/journey-director/
│   └── reusable presentation components
└── app/journey-director/
    └── route entry
```

This tree is guidance, not permission to duplicate existing modules. Reuse or refactor current files where their responsibility is already correct.

---

## 6. Implementation Phases

### Phase 1 — Session Recovery and Contracts

Implement or stabilise:

- versioned Journey Passport snapshot adapter;
- runtime snapshot validation;
- session-scoped persistence;
- hydration-safe restoration;
- direct-route recovery;
- active and preferred possibility state contracts; and
- deterministic regeneration inputs.

**Exit gate:** A completed Passport survives navigation and refresh. Missing, corrupt or incompatible session data never produces demo recommendations and always offers a clear recovery path.

### Phase 2 — Governed Decision Engine

Implement:

- typed Destination Knowledge Base records;
- controlled vocabulary mappings;
- operational eligibility filters;
- destination score dimensions and penalties;
- region eligibility and scoring;
- deterministic ranking and tie-breaking;
- confidence bands and thresholds; and
- Decision Trace output.

All values and formulas must come from the approved Decision Engine specification.

**Exit gate:** Pure-engine tests prove that identical versioned inputs return identical eligible candidates, scores, exclusions, regions and ranking.

### Phase 3 — Recommendation and Story Packet Generation

Implement:

- The Perfect Match assignment;
- The Beautiful Puzzle diversity calculation and assignment;
- The Hidden Gem novelty and evidence-readiness calculation and assignment;
- one- and two-result fallbacks;
- no-result and clarification states;
- evidence-backed explanations;
- approved imagery selection;
- Story Packet assembly; and
- Story Packet integrity validation.

**Exit gate:** Every displayed possibility has a complete, internally consistent Story Packet. Weak or incomplete candidates are suppressed rather than relabelled.

### Phase 4 — Dynamic Journey Director UI

Implement the approved seven-screen contract:

1. Journey Director arrival and Passport acknowledgement;
2. traveller reflection;
3. matching journey qualities;
4. journey possibilities;
5. why the active possibility fits;
6. imagine the active journey; and
7. contextual human Journey Director handoff.

Implement possibility switching, explicit preference selection, correction routes, recovery states and reduced-motion behaviour.

**Exit gate:** Selecting any possibility replaces all Screen 5–7 story content without changing the reusable layout or mixing destination data.

### Phase 5 — Human Journey Director Handoff

Implement:

- selected-context handoff payload;
- explicit consent boundary for contact details;
- honest action labels and confirmation copy;
- unresolved-question and trade-off preservation;
- no-duplicate-data behaviour; and
- manual override contract and audit record support.

Do not build an internal administration workspace or pretend an external integration exists.

**Exit gate:** The handoff preserves the exact possibility the traveller explored or selected and accurately states what occurred.

### Phase 6 — Validation and Stabilisation

Complete:

- unit tests for pure decision functions;
- contract tests for Passport, destination data, Decision Result and Story Packet schemas;
- scenario tests from the Decision Engine specification;
- dynamic Screen 5–7 integrity tests;
- fallback and recovery tests;
- manual desktop, tablet and mobile walkthroughs;
- accessibility validation;
- regression checks for Journey Passport and homepage entry;
- lint, TypeScript and production build; and
- final delivery report.

**Exit gate:** All applicable acceptance criteria and validation commands pass with no undocumented exception.

---

## 7. Functional Requirements

### 7.1 Session and Entry

- **FR-001:** Journey Director begins only from a valid completed Journey Passport or a valid restored Journey Session.
- **FR-002:** Journey Passport completion creates a versioned snapshot before route navigation.
- **FR-003:** Refresh restores the traveller's valid completed context without replaying sample data.
- **FR-004:** Missing or invalid context produces a recovery state, not a production demo fallback.
- **FR-005:** Returning to Journey Passport preserves or intentionally resets state according to the Passport specification.
- **FR-006:** The engine does not run on an incomplete Passport unless the approved fallback explicitly supports clarification.

### 7.2 Normalisation and Evidence

- **FR-007:** Normalisation uses only fields collected by Journey Passport v1.0.
- **FR-008:** Original values and wording remain available beside normalised signals.
- **FR-009:** Derived signals record derivation source and lower evidence strength than explicit signals.
- **FR-010:** Missing pace or comfort is not silently converted into a favourable default.
- **FR-011:** Sensitive or contact data does not influence ranking.
- **FR-012:** An explicit traveller statement overrides a conflicting derived inference.

### 7.3 Eligibility

- **FR-013:** Eligibility runs before scoring.
- **FR-014:** Only `ACTIVE` destinations with sufficient service confidence may be presented.
- **FR-015:** `COMING_SOON`, `INACTIVE`, unsupported and operationally held destinations receive no traveller-facing score.
- **FR-016:** Safety, legal, accessibility, explicit exclusions and essential feasibility rules cannot be outweighed by preference scoring.
- **FR-017:** Every exclusion is recorded with a stable reason code.
- **FR-018:** Commercial preference, supplier commission or inventory pressure never improves candidate ranking.

### 7.4 Destination and Region Scoring

- **FR-019:** Destination scoring implements the approved dimensions, weights, compatibility values and penalties without alteration.
- **FR-020:** Unknown values follow the unknown-data rules and never receive assumed full credit.
- **FR-021:** Ranking is deterministic for identical inputs and versions.
- **FR-022:** Ties follow the approved deterministic tie-break sequence.
- **FR-023:** Region eligibility and scoring occur within each eligible destination.
- **FR-024:** A qualified region is required unless an approved transparent low-specificity fallback applies.
- **FR-025:** Region selection follows traveller fit rather than popularity or commercial visibility.
- **FR-026:** Multi-region support remains limited to the approved supporting-region rule and does not become itinerary design.

### 7.5 Recommendation Personalities

- **FR-027:** The Perfect Match is the strongest qualified overall alignment.
- **FR-028:** The Beautiful Puzzle preserves the core emotional need while differing meaningfully on approved diversity axes.
- **FR-029:** The Hidden Gem meets its fit, novelty, evidence-readiness and operational-confidence requirements.
- **FR-030:** One candidate cannot occupy more than one personality.
- **FR-031:** Personality assignment order and tie-breaking follow the Decision Engine specification.
- **FR-032:** Failure to fill a personality returns the approved fallback; it never weakens thresholds.
- **FR-033:** The traveller-facing personalities use the approved labels exactly.

### 7.6 Confidence and Fallbacks

- **FR-034:** Confidence is assessed separately from destination fit score.
- **FR-035:** Only high- or moderate-confidence results that pass personality thresholds may be displayed automatically.
- **FR-036:** One or two qualified results are presented honestly without empty placeholders.
- **FR-037:** No qualified result produces the approved human-led fallback.
- **FR-038:** Unsupported requested destinations are acknowledged but never recommended.
- **FR-039:** Missing regional intelligence suppresses high-confidence regional presentation.
- **FR-040:** Content, image and system failures preserve the Passport and never mix another possibility's content.

### 7.7 Explanations and Story Packets

- **FR-041:** Every possibility connects traveller evidence, destination or region knowledge and the reason the possibility deserves consideration.
- **FR-042:** Every explanation is traceable to approved evidence.
- **FR-043:** Traveller-facing content does not expose scores or technical processing language.
- **FR-044:** Every Screen 4 possibility has a complete Story Packet before display.
- **FR-045:** Story Packet imagery, reasons, moments and handoff copy share the same destination and region context.
- **FR-046:** Destination-specific content lives in governed data or content modules, not UI branches.
- **FR-047:** Story Packet validation fails closed: incomplete packets are suppressed.

### 7.8 Dynamic Experience

- **FR-048:** Screens 1–4 render from shared structures and the current Decision Result.
- **FR-049:** Selecting **Explore This Journey** makes that `possibilityId` active.
- **FR-050:** Screens 5–7 render solely from the active Story Packet.
- **FR-051:** Switching possibilities replaces narrative, imagery, fit reasons, moments, trade-off and handoff copy together.
- **FR-052:** The component structure, focus order, semantics and responsive layout remain reusable across possibilities.
- **FR-053:** Switching does not restart Journey Passport or regenerate unrelated state.
- **FR-054:** Exploration does not imply preference.
- **FR-055:** **This Feels Right**, or the approved equivalent, explicitly records preference.
- **FR-056:** The active and preferred possibilities remain distinguishable without colour alone.

### 7.9 Human Handoff

- **FR-057:** The handoff uses Journey Director terminology consistently.
- **FR-058:** The handoff preserves the selected or most recently explored possibility according to the approved rule.
- **FR-059:** The handoff payload contains Passport, possibility, evidence, trade-off and version context.
- **FR-060:** Contact details and consent are collected only at the intentional handoff when required.
- **FR-061:** The action label describes the implemented action accurately.
- **FR-062:** No confirmation claims human notification or external delivery unless that integration succeeded.
- **FR-063:** The traveller can explore another possibility or return to the Passport without losing recoverable work.

### 7.10 Manual Override

- **FR-064:** Permitted overrides remain within active eligibility boundaries.
- **FR-065:** Material overrides record original and updated result, actor, time, reason, affected IDs and governing versions.
- **FR-066:** Prohibited overrides cannot reactivate a destination, bypass safety or accessibility constraints, invent capabilities or introduce commercial bias.
- **FR-067:** The override contract is testable without requiring an internal Release 1 dashboard.

---

## 8. UI Requirements

### 8.1 UX Authority

`docs/04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md` governs screen order, hierarchy, content direction, emotional pacing, correction paths, fallbacks and responsive narrative behaviour.

This card does not approve alternative screen concepts or copy rewrites.

### 8.2 Screen Contract

| Screen | Required responsibility |
| --- | --- |
| **1 — Arrival** | Acknowledge Passport receipt and introduce Journey Director without false claims or artificial delay |
| **2 — Reflection** | Demonstrate understanding using supported Passport evidence |
| **3 — Matching Qualities** | Explain the journey character sought within the active portfolio |
| **4 — Possibilities** | Present the qualified recommendation personalities and honest fallback count |
| **5 — Why This Fits** | Show active destination, region, narrative, evidence-backed reasons and material trade-off |
| **6 — Imagine Your Journey** | Show only active-packet imagery and memory moments |
| **7 — Human Handoff** | Preserve selected context and explain the real next action |

### 8.3 Shared and Dynamic Content

Screens 5–7 are a dynamic branch, not separate destination pages.

The following remain shared:

- page and section structure;
- component hierarchy;
- heading hierarchy;
- interaction placement;
- focus sequence;
- semantic roles;
- responsive rules; and
- motion pattern.

The following come from the active Story Packet:

- destination and region;
- personality;
- palette accent where approved;
- hero and supporting imagery;
- explanation narrative;
- fit reasons;
- signature experiences and memory moments;
- trade-off;
- contextual CTA and handoff copy; and
- saved or sent context where later supported.

### 8.4 Content Rules

- Show understanding before destinations.
- Use warm, calm, specific and invitational language.
- Use the traveller's name sparingly and respectfully.
- Explain reasons rather than scores.
- Describe possibilities, not guarantees.
- Use meaningful image alternative text.
- Avoid generic superlatives and urgency language.
- Avoid “AI-generated”, “algorithm”, “model”, “confidence score” and similar traveller-facing terminology.
- Do not claim availability, pricing, weather, visa outcomes or itinerary confirmation.

### 8.5 Interaction Rules

- The traveller controls progression through meaningful stages.
- Arrival motion must never delay already available content unnecessarily.
- Possibility cards expose a clear exploration action.
- The active possibility switcher is keyboard and touch operable.
- Switching does not cause a full reload.
- The traveller can return to all possibilities.
- The traveller can correct the Journey Passport with prior answers preserved.
- Back and refresh behaviour must not resubmit or erase the Passport.
- Failure states provide retry, correction or human-help routes as approved.

### 8.6 UX Review Lens — Sophie

UX review should confirm:

- the flow feels like one composed narrative rather than disconnected cards;
- the reveal feels earned through reflection;
- three possibilities create focus rather than comparison anxiety;
- active-story switching is clear but visually calm;
- destination imagery supports, rather than substitutes for, reasoning;
- motion is purposeful and reduced-motion-safe; and
- the handoff feels like a continuation, not a lead form.

### 8.7 Traveller Review Lens — Sri

Traveller review should answer:

- Can I recognise what I shared in the reflection?
- Do I understand why each possibility was selected for me?
- Can I see why this region suits me better than a generic destination label?
- Do the three personalities feel meaningfully different rather than ranked as good, average and weak?
- Can I explore without losing my place or feeling pressured?
- Do I know what is inspirational and what has actually been confirmed?
- Do I understand what a human Journey Director will do next?
- Can I recover if I refresh, leave or change my mind?

---

## 9. Technical Requirements and Architecture Review

### 9.1 Separation of Responsibilities

- UI components render typed presentation contracts only.
- Adapters translate external or previous-layer data; they do not make product decisions.
- Normalisation, eligibility, scoring, region ranking, personalities, confidence and Story Packet generation remain independent modules.
- Destination knowledge, rules, thresholds and content are configuration or data, not component conditionals.
- Session persistence is isolated from recommendation logic.
- Handoff construction is isolated from display components.

### 9.2 TypeScript Models

Define explicit types for:

- Journey Passport snapshot;
- normalised traveller signals and evidence strength;
- destination and region records;
- eligibility result and exclusion reason;
- score dimensions and penalties;
- ranked candidate;
- personality assignment;
- confidence record;
- Decision Trace;
- Story Packet and its nested content;
- Decision Result and fallback states;
- session envelope;
- preferred possibility state;
- handoff payload; and
- override record.

Avoid broad `string`, `Record<string, unknown>` and unchecked type assertions where a controlled union or runtime validator is appropriate.

### 9.3 Governed Configuration

- Destination data must correspond to the approved Destination Knowledge Base.
- Controlled terms must use stable IDs or unions.
- Rules and thresholds must be centrally versioned.
- Content-template and imagery references must be centrally maintained.
- Runtime code must never activate a destination based only on content presence.
- Configuration changes must be testable independently of presentation.

### 9.4 No Hard-Coded Production Recommendations

Production execution must not return a fixed Kerala, Bali and Sri Lanka set—or any other fixed set—regardless of the Passport.

Fixtures may exist only in test, Storybook or explicitly development-only modules that cannot be reached by production recommendation code.

The route must never use a demo traveller when Journey Session recovery fails.

### 9.5 Determinism and Versioning

- Pure functions return the same result for the same inputs.
- Sorting never depends on object insertion order when a documented tie-break is required.
- Random selection is prohibited.
- Dates and operational snapshots are explicit inputs rather than hidden global state where they influence results.
- Decision Result records all governing versions.
- Tests freeze the relevant clock or snapshot when time affects outcomes.

### 9.6 Runtime Validation

Validate untrusted data at:

- session restoration;
- Journey Passport adapter input;
- governed destination-data loading;
- Decision Result storage restoration;
- Story Packet display boundary; and
- handoff construction.

Invalid data should fail into a typed recovery state. Traveller-facing UI must not expose stack traces, internal IDs or raw validation errors.

### 9.7 Performance

- Deterministic recommendation and Story Packet assembly should normally complete in under one second in the local application environment.
- Recommendation computation should not rerun for presentation-only state changes.
- Images must use the existing Next.js image optimisation path and appropriate responsive sizes.
- Non-critical imagery may load lazily.
- The designed transition must not conceal avoidable processing latency.
- Production bundles must not include test fixtures or duplicate knowledge sources.

### 9.8 Privacy and Security

- Store only the minimum session data required for continuity.
- Do not use permanent local storage for Release 1 Journey Session.
- Do not place Passport data in query strings.
- Do not log sensitive free text or contact information to the browser console.
- Do not expose the internal Decision Trace to travellers.
- Treat session data as untrusted on restoration.
- Apply consent rules before analytics or communication handoff.

### 9.9 Error Handling

- Distinguish incomplete Passport, no match, insufficient confidence, content failure, storage failure and technical failure.
- Preserve recoverable Passport context.
- Never replace failed content with another destination's story.
- Provide calm, specific traveller-facing recovery language.
- Log internal reason codes through the available project mechanism without exposing them in the UI.

### 9.10 Architecture Review Lens — Archie

Architecture review should confirm:

- knowledge, decision logic and presentation are separate;
- no second destination source competes with the governed configuration;
- pure functions are independently testable;
- Story Packets form the only destination-story input to Screens 5–7;
- versioned contracts support safe future migration;
- fallbacks are typed outcomes rather than UI exceptions;
- session recovery does not create hydration mismatch;
- production cannot access demo fallback data; and
- future AI assistance can be added without bypassing deterministic eligibility or Story Packet validation.

---

## 10. Responsive Requirements

Responsive support is mandatory. Preserve the narrative order across desktop, tablet and mobile.

### 10.1 Desktop

- Use the approved expansive Journey Director composition without allowing imagery to obscure reasoning.
- Three possibility cards may share a row when available width supports legible content and usable actions.
- Screens 5–7 may use split visual-and-content layouts.
- Sticky or persistent possibility controls must not cover headings, actions or browser focus.
- Long content must remain readable at zoom and large text sizes.
- No overlapping, clipping or unintended horizontal scrolling is permitted.

### 10.2 Tablet

- Reflow possibility cards and story sections according to available width rather than preserving desktop columns.
- Maintain balanced spacing and clear active-state visibility.
- Ensure imagery scales without hiding its meaningful focal point.
- Keep switcher controls touch-friendly and visible without obscuring content.
- Preserve destination, region and personality context while scrolling.
- Support portrait and landscape orientations.

### 10.3 Mobile

- Design mobile as a composed narrative, not a reduced desktop canvas.
- Present one clear idea at a time.
- Stack possibility cards vertically when needed.
- Place essential text before decorative imagery where reading order requires it.
- Keep actions within comfortable reach and at least the project minimum touch size.
- Do not require horizontal page scrolling.
- A horizontal possibility switcher is acceptable only when semantic order, keyboard access and visible affordance remain clear.
- Respect safe-area insets for edge-aligned or fixed controls.
- Ensure browser navigation and refresh do not resubmit or erase the Passport.
- Prevent clipped headings, buttons and status messages at narrow and short viewports.

### 10.4 Responsive Validation Viewports

At minimum, validate:

- a narrow mobile viewport around 320px wide;
- a common mobile viewport around 375–430px wide;
- tablet portrait and landscape;
- a standard desktop viewport;
- a wide desktop viewport; and
- a short landscape viewport where vertical space is constrained.

Exact visual polish may be deferred. Stability, readability and usability may not.

---

## 11. Accessibility

### 11.1 Keyboard

- Every action is reachable and operable by keyboard.
- Possibility cards do not rely on click-only containers.
- The active possibility switcher exposes a predictable tab order.
- Back, explore, preference and handoff actions have visible focus.
- Escape behaviour is implemented only where it has an unambiguous, non-destructive meaning.
- No keyboard trap exists in the experience.

### 11.2 Semantics and ARIA

- Use semantic headings, sections, lists, navigation and buttons before ARIA.
- Maintain one logical heading hierarchy across the reusable layout.
- Use `aria-current`, `aria-pressed`, status messaging or an equivalent appropriate pattern for active and preferred states.
- Announce recommendation preparation, recovery and active-story changes without excessive repetition.
- Do not place critical information only in an image or decorative pseudo-element.
- Decorative imagery uses empty alternative text; meaningful imagery uses concise destination-specific alternatives.

### 11.3 Focus Management

- Arrival focus begins at the Journey Director heading or the appropriate route landmark.
- After an explicit stage transition, focus moves to the new stage heading when this improves orientation.
- Changing the active possibility moves or announces focus predictably without unexpectedly resetting the entire page.
- Recovery errors move focus to a clear message or heading.
- Returning to all possibilities restores a sensible focus target.

### 11.4 Contrast and Non-Colour Cues

- Text, controls, focus indicators and status labels meet applicable WCAG AA contrast.
- Active, visited and preferred possibilities use text, iconography, shape or position in addition to colour.
- Text remains legible over imagery in every supported crop.
- Disabled controls remain understandable without appearing active.

### 11.5 Reduced Motion

- Respect `prefers-reduced-motion`.
- Remove non-essential parallax, smooth scrolling and reveal motion when reduced motion is requested.
- Do not require animation to understand stage change or active possibility.
- Content remains immediately accessible if motion fails or is disabled.
- No artificial delay is introduced solely to preserve an animation sequence.

### 11.6 Zoom, Resize and Assistive Validation

- Content remains usable at 200% browser zoom.
- Text resize does not clip essential content or actions.
- Screen-reader smoke testing covers arrival, possibilities, switching, preference, fallback and handoff.
- Keyboard-only testing covers the complete flow.
- Touch targets and spacing remain usable on mobile.

---

## 12. Acceptance Criteria

### 12.1 Functional

- [ ] A valid Journey Passport enters Journey Director with its original context intact.
- [ ] Refresh restores valid session context without showing demo data.
- [ ] Direct access without context shows an honest recovery state.
- [ ] Only active, serviceable destinations and approved regions are eligible.
- [ ] Destination and region ranking follows approved deterministic rules.
- [ ] The same versioned inputs produce the same result.
- [ ] The three approved personalities are assigned only to qualified, distinct candidates.
- [ ] One-, two- and no-result fallbacks behave as specified.
- [ ] Unsupported destination intent never activates an unsupported recommendation.
- [ ] Every displayed possibility has a complete Story Packet.
- [ ] Every explanation has traceable evidence.
- [ ] Selecting a possibility drives all Screens 5–7 content.
- [ ] Switching possibilities never mixes destination content.
- [ ] Explicit preference is distinct from exploration.
- [ ] Handoff preserves the selected context and states the real action honestly.
- [ ] Permitted overrides are recorded; prohibited overrides are blocked.

### 12.2 Visual and UX

- [ ] The experience acknowledges Passport completion before revealing destinations.
- [ ] Traveller reflection precedes the possibility set.
- [ ] The three personality labels use approved terminology.
- [ ] Destination and region are presented as one meaningful recommendation.
- [ ] Fit reasons are readable and specific.
- [ ] Signature moments inspire without implying itinerary confirmation.
- [ ] The active possibility is clear throughout its story.
- [ ] The layout remains calm and reusable when content changes.
- [ ] Fallbacks preserve trust and offer a clear next step.
- [ ] The human handoff feels like a continuation, not a generic lead form.

### 12.3 Technical

- [ ] UI, data, decision logic, persistence and handoff concerns are separated.
- [ ] Production recommendation code contains no fixed recommendation set.
- [ ] Production route contains no demo traveller fallback.
- [ ] Governed destination records are typed and centrally maintained.
- [ ] Passport, destination, Decision Result, Story Packet and session boundaries are runtime validated.
- [ ] Decision Result records governing versions and timestamp.
- [ ] Decision Trace records exclusions, scores, regions, assignments, confidence and overrides.
- [ ] Pure decision functions have unit tests.
- [ ] Scenario tests cover the Decision Engine's Release 1 cases.
- [ ] Dynamic Screen 5–7 integrity tests pass.
- [ ] No unrelated application feature is changed.

### 12.4 Responsive

- [ ] Desktop has no overlap, clipping or unusable actions.
- [ ] Tablet layouts reflow with balanced spacing and usable imagery.
- [ ] Mobile preserves narrative order and has no horizontal page scroll.
- [ ] Narrow mobile and short landscape layouts remain usable.
- [ ] Switcher controls remain operable by touch and keyboard.
- [ ] Safe areas are respected where applicable.
- [ ] Browser Back and refresh do not erase or resubmit the Passport.

### 12.5 Accessibility

- [ ] Complete flow is keyboard operable.
- [ ] Focus is visible and stage transitions preserve orientation.
- [ ] Headings and landmarks form a logical structure.
- [ ] Active, visited and preferred states do not depend on colour alone.
- [ ] Meaningful imagery has accurate active-packet alternative text.
- [ ] Dynamic changes and failures are announced appropriately.
- [ ] Reduced-motion mode remains complete and usable.
- [ ] Contrast meets applicable WCAG AA requirements.
- [ ] 200% zoom and text resize do not hide essential content.

### 12.6 Regression

- [ ] Homepage entry continues to open Journey Passport correctly.
- [ ] All eight Journey Passport moments remain functional.
- [ ] Journey Passport validation, draft recovery and completion remain intact.
- [ ] Existing global header, homepage and unrelated routes remain stable.
- [ ] Asset paths resolve with correct filename casing.
- [ ] No new temporary, absolute-machine or generated-workspace path is introduced.

---

## 13. Validation

### 13.1 Required Commands

Run from `web/`:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

All three commands must pass before EBC-003 may be marked complete.

If an automated test command is introduced or already available, it must also pass and be included in the delivery report.

### 13.2 Automated Test Coverage

At minimum, automated tests must cover:

- Passport normalisation and evidence strength;
- every hard eligibility filter;
- destination dimension scores and penalties;
- deterministic ranking and tie-breaking;
- region eligibility and score selection;
- each personality assignment;
- personality rebalancing and insufficient-result fallbacks;
- unsupported requested destination;
- missing region intelligence;
- Story Packet validation;
- dynamic possibility switching;
- handoff payload integrity;
- session restoration and invalid-session recovery; and
- override allow and deny rules.

Tests must use approved test fixtures. Test data must not become the production fallback.

### 13.3 Manual Validation

Perform and record:

- end-to-end Passport-to-Journey-Director flow;
- refresh at Journey Director arrival, possibilities, active story and handoff;
- one-, two- and no-result fallbacks;
- possibility switching across all qualified results;
- preferred possibility selection and reversal;
- Passport correction and regeneration;
- direct route without session;
- corrupt or incompatible session;
- missing image or content recovery;
- keyboard-only flow;
- reduced-motion flow;
- screen-reader smoke test;
- desktop, tablet, mobile and short-landscape checks; and
- homepage and Journey Passport regression walkthrough.

### 13.4 Validation Report Format

The completion report must record:

| Validation | Result | Evidence / Notes |
| --- | --- | --- |
| Lint | Pass / Fail | Command and relevant output |
| TypeScript | Pass / Fail | Command and relevant output |
| Production build | Pass / Fail | Command and generated routes |
| Automated tests | Pass / Fail / Not available | Command and scenario count |
| Desktop | Pass / Fail | Viewports and observations |
| Tablet | Pass / Fail | Viewports and observations |
| Mobile | Pass / Fail | Viewports and observations |
| Accessibility | Pass / Fail | Keyboard, screen reader, contrast and motion checks |
| Regression | Pass / Fail | Homepage and Journey Passport checks |

Pre-existing issues must be identified explicitly. They may not be concealed by disabling checks or weakening configuration.

---

## 14. Definition of Done

EBC-003 is done only when:

- [ ] the deterministic recommendation engine is implemented;
- [ ] Journey Passport input is normalised without inventing missing fields;
- [ ] governed destination and region data is implemented and versioned;
- [ ] eligibility filtering excludes every non-presentable destination;
- [ ] destination scoring, penalties, ranking and tie-breaking are implemented;
- [ ] regional ranking selects qualified, explainable regions;
- [ ] The Perfect Match, The Beautiful Puzzle and The Hidden Gem are assigned according to approved rules;
- [ ] confidence, conflict and fallback handling are implemented;
- [ ] Decision Results and Decision Traces are generated;
- [ ] every displayed possibility produces a validated Story Packet;
- [ ] Journey Director Screens 1–4 render the shared narrative and current shortlist;
- [ ] Screens 5–7 are fully dynamic from the active Story Packet;
- [ ] one reusable layout supports every possibility;
- [ ] the traveller can explore, switch and explicitly prefer a possibility;
- [ ] session recovery works across navigation and refresh;
- [ ] no production demo fallback exists;
- [ ] no production recommendation is hard-coded;
- [ ] recovery and insufficient-result states preserve trust;
- [ ] the human Journey Director handoff preserves selected context and consent boundaries;
- [ ] manual override contracts and audit records are supported;
- [ ] automated decision, contract, scenario and dynamic-content tests pass;
- [ ] responsive desktop, tablet, mobile and short-landscape behaviour is verified;
- [ ] keyboard, ARIA, focus, contrast, zoom and reduced-motion requirements are verified;
- [ ] Journey Passport and homepage regressions pass;
- [ ] `npm run lint` passes;
- [ ] `npx tsc --noEmit --incremental false` passes;
- [ ] `npm run build` passes;
- [ ] the final delivery report is complete;
- [ ] Tiger, Archie, Sophie and Sri reviews are recorded; and
- [ ] Product Owner approval is recorded.

Passing the build alone does not satisfy Definition of Done. The engine, Story Packets, dynamic experience, recovery, accessibility and responsive acceptance criteria are equally mandatory.

---

## 15. Required Delivery Report

At implementation completion, provide:

1. outcome summary;
2. implementation phases completed;
3. files created, modified, moved or removed;
4. final module and data-flow summary;
5. governed destination-data coverage;
6. Decision Engine and Story Packet test coverage;
7. fallback and recovery results;
8. desktop, tablet and mobile validation;
9. accessibility validation;
10. lint, TypeScript, test and build results;
11. regression results;
12. known limitations;
13. deferred polish;
14. evidence that production has no demo fallback or fixed recommendation set;
15. Git status and safe staging guidance; and
16. reviewer observations and Product Owner decision.

Do not commit or push automatically. Product Owner approval follows the review sequence in the EBC Execution Standard.

---

## 16. Stop Conditions

Stop and return to Product or Architecture when:

- an approved source contradicts another source in a way this card does not resolve;
- required destination or region knowledge is absent or ambiguous;
- a scoring rule or threshold would need to be invented;
- production content would require an unsupported destination;
- a Story Packet cannot be grounded in approved evidence;
- an external handoff integration would need unapproved credentials, consent or behaviour;
- a proposed shortcut would introduce fixed production recommendations or demo fallback data; or
- satisfying the implementation would require changing Journey Passport product scope.

Once all acceptance criteria and Definition of Done items are satisfied, stop.

Do not:

- redesign adjacent experiences;
- add future AI capabilities;
- expand destination scope;
- build an itinerary or booking flow;
- polish unrelated components; or
- continue into deferred enhancements.

---

## Closing Engineering Principle

The Journey Director must remain deterministic enough to test, governed enough to trust and human enough to feel personal.

> **One Passport. Governed possibilities. One active story. A human Journey Director ready to take it forward.**
