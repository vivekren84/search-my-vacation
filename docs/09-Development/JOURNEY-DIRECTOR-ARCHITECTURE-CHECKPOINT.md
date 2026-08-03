# Journey Director Architecture Checkpoint

## 1. Document Control

| Field | Value |
| --- | --- |
| **Document** | Journey Director Architecture Checkpoint |
| **Delivery boundary** | EBC-003C |
| **Release** | Release 1 |
| **Status** | Implemented checkpoint |
| **Repository** | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| **Target branch** | `feature/ebc-003-journey-director` |
| **Owner** | Team Satvi |
| **Architecture reviewer** | Archie |
| **Engineering reviewer** | Tiger |
| **UX authority** | Sophie |
| **Traveller experience authority** | Sri |
| **Last updated** | 23 July 2026 |

> This checkpoint records the Release 1 boundary between the deterministic Journey Director engine and the traveller-facing experience. It does not change approved recommendation behaviour or redefine the Journey Director UX.

### 1.1 Governing Sources

This checkpoint is subordinate to:

1. `docs/00-Project-Compass/DECISION-LOG.md`;
2. `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`;
3. `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`;
4. `docs/02-Product/JOURNEY-DIRECTOR-DECISION-ENGINE.md`;
5. `docs/04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md`;
6. `docs/09-Development/EBC-003-JOURNEY-DIRECTOR.md`; and
7. `docs/09-Development/EBC-EXECUTION-STANDARD.md`.

If an implementation detail conflicts with an approved source, the approved source remains authoritative.

---

## 2. Checkpoint Purpose

EBC-003A established the deterministic recommendation engine. EBC-003C establishes how an approved engine result crosses into the Journey Director presentation without weakening that engine contract.

The checkpoint has five purposes:

- preserve eligibility, ranking, scoring and personality decisions made by the engine;
- transform engine output into a stable presentation contract;
- produce a deterministic traveller reflection from verified Journey Passport evidence;
- keep presentation metadata separate from governed destination knowledge; and
- prepare a clean boundary for the dynamic Journey Director UI and later human handoff.

The adapter is not a second decision engine. It is a translation boundary.

---

## 3. Architecture Decision

### 3.1 Approved Release 1 Flow

```text
Journey Passport
        ↓
Journey Session
        ↓
Passport Normalisation
        ↓
Deterministic Decision Engine
        ↓
Engine Result + Decision Trace
        ↓
Recommendation Adapter
        ├── Traveller Reflection
        └── Presentation Metadata
        ↓
Journey Recommendation Set
        ↓
Journey Director UI
        ↓
Human Journey Director
```

Release 1 uses deterministic recommendation logic to generate up to three qualified journey possibilities. A human Journey Director remains responsible for consultation, refinement, itinerary design and final traveller handoff.

### 3.2 Responsibility by Layer

| Layer | Owns | Must not own |
| --- | --- | --- |
| **Journey Passport** | Approved traveller answers and homepage entry context | Destination scoring or inferred uncollected preferences |
| **Journey Session** | Session-scoped persistence and recovery | Recommendation logic |
| **Decision Engine** | Normalisation, eligibility, scoring, regional ranking, personality assignment, confidence, exclusions and trace | React, Next.js, browser APIs or traveller-facing layout |
| **Recommendation Adapter** | Deterministic translation from `EngineResult` to the presentation contract | Rescoring, reranking, candidate substitution or fabricated recommendations |
| **Traveller Reflection** | Controlled narrative assembled from Passport and normalised engine evidence | Generative copy, unsupported assumptions or hidden traveller profiling |
| **Presentation Metadata** | Approved images, alt text, evidence-supported journey moments and handoff wording | Destination status, service confidence, score weights or operational eligibility |
| **Journey Director UI** | Rendering, navigation, interaction, responsive behaviour and accessibility | Recommendation decisions or hard-coded production results |
| **Human Journey Director** | Consultation, refinement, itinerary design and final handoff | Retroactive claims that automated results were manually reviewed |

---

## 4. Before and After

### 4.1 Before This Checkpoint

The early UI prototype was connected to fixed presentation fixtures. Those fixtures were useful for validating the experience shape, but they were not a production recommendation boundary.

The prototype could:

- display three visually complete examples;
- demonstrate the seven-screen experience; and
- exercise destination, region, reason and moment layouts.

It could not:

- prove that recommendations came from the deterministic engine;
- preserve engine exclusions and scores;
- distinguish success, partial and unavailable outcomes;
- prove that reflection copy came from the current traveller; or
- prevent a demo possibility from becoming a production fallback.

### 4.2 After This Checkpoint

The presentation layer now consumes a `JourneyRecommendationSet` created from:

- one completed `JourneyPassportSnapshot`;
- one governed `EngineResult`; and
- optional presentation metadata that cannot affect recommendation decisions.

The adapter:

- preserves engine order;
- preserves personality assignments;
- preserves scores, confidence, cautions and evidence;
- rejects an engine contract violation where an excluded candidate is also returned;
- exposes typed success, partial, insufficient and unavailable states;
- never creates missing possibilities;
- never replaces an excluded destination;
- never invokes a demo recommendation fallback; and
- remains independent of React, Next.js and browser APIs.

---

## 5. Contract Ownership

### 5.1 Engine-Owned Contracts

The deterministic engine remains the authority for:

- `EngineResult`;
- `EngineStatus`;
- `EnginePossibility`;
- `RecommendationPersonality`;
- `CandidateExclusionSummary`;
- `DecisionTrace`;
- `ScoreFactor`;
- `JourneyCandidate`;
- `RegionCandidate`; and
- engine and rules version metadata.

Presentation code may read these contracts. It must not reinterpret their business meaning.

### 5.2 Presentation-Owned Contracts

The presentation boundary owns:

- `JourneyRecommendationSet`;
- `JourneyRecommendationState`;
- `JourneyPossibility`;
- `JourneyPossibilityPersonality`;
- `JourneyReason`;
- `JourneyEvidenceReference`;
- `TravellerSummary`;
- `TravellerReflection`;
- `TravellerInsight`;
- `JourneyPresentationMetadata`; and
- `JourneyPresentationCatalogue`.

These contracts describe how approved decisions are carried to the UI. They do not create the decision.

### 5.3 Evidence Continuity

Every traveller-facing reason created by the adapter retains at least one reference to:

- governed candidate evidence from the engine; or
- a positive score factor when candidate evidence is unavailable.

Every controlled traveller insight retains a reference to the Journey Passport field that produced it.

Presentation moments are displayed only when their declared evidence identifiers are present in the selected engine possibility. Metadata alone cannot make a moment eligible for display.

---

## 6. Recommendation Adapter

### 6.1 Input

The primary adapter accepts:

```text
JourneyPassportSnapshot
+
EngineResult
+
Optional JourneyPresentationCatalogue
```

The Passport and engine result are required. The presentation catalogue is optional and defaults to the governed presentation-only configuration.

### 6.2 Output

The adapter returns one serialisable `JourneyRecommendationSet` containing:

- presentation state;
- traveller snapshot;
- traveller summary;
- structured traveller reflection;
- matching qualities and evidence-backed insights;
- zero to three ordered possibilities;
- excluded candidate identifiers;
- recovery guidance;
- engine, rules, knowledge-base and operational snapshot versions; and
- a compatibility flag that can never activate production demo data.

### 6.3 Invariants

For the same Passport, engine result and presentation catalogue, the adapter must always return the same output.

The adapter must:

- map possibilities in engine order;
- use the engine's personality without reassignment;
- expose the engine score without recalculation;
- retain confidence and cautions;
- preserve exclusion identifiers;
- return fewer than three possibilities when the engine does;
- return no possibilities for insufficient or unavailable results; and
- remain free of time, randomness and environmental state.

The adapter must never:

- read destination operational status directly;
- call the scoring pipeline;
- compare candidate scores;
- reorder candidates;
- inject a missing personality;
- fill an empty state with a sample destination; or
- infer an uncollected Passport field.

---

## 7. Traveller Reflection

### 7.1 Purpose

The traveller reflection demonstrates that Search My Vacation listened before presenting a destination.

Release 1 reflection is deterministic. It is assembled from controlled language associated with:

- traveller name;
- companion type;
- dream journey;
- selected travel styles;
- travel timing;
- permitted homepage feeling; and
- normalised signals already produced by the engine.

### 7.2 Evidence Priority

Explicit Journey Passport selections take priority over supporting homepage intent.

For example:

```text
Homepage feeling: Relax
Journey Passport travel style: Adventure

Result:
Adventure shapes the primary reflection.
Relax may remain supporting engine evidence.
```

Homepage intent must not overwrite an explicit Passport answer.

### 7.3 Unknown Information

Journey Passport v1.0 does not collect:

- comfort level;
- food restrictions;
- accessibility requirements;
- general preference notes;
- explicit exclusions; or
- budget.

The reflection and traveller summary therefore leave these details unknown. They must not infer or invent them from destination, companion, dream journey or homepage intent.

### 7.4 Copy Safety

Controlled templates may interpret an approved answer in warm traveller-facing language. They must not claim:

- that a human has already reviewed the Passport;
- that availability is confirmed;
- that a destination is booked or reserved;
- that an itinerary has been created;
- that a price has been checked; or
- that the system knows personal details the traveller did not provide.

---

## 8. Result-State Mapping

| Engine status | Presentation state | Possibilities | Traveller treatment |
| --- | --- | --- | --- |
| `success` | `success` | Three qualified possibilities | Present the approved narrative and exploration flow |
| `partial` | `partial` | One or two qualified possibilities | Present only qualified results and explain that the shortlist is focused |
| `insufficient-input` | `insufficient` | None | Ask for the missing traveller context through graceful recovery |
| `insufficient-candidates` | `unavailable` | None | Explain that the active collection did not produce a confident automatic match |
| `invalid-input` | `unavailable` | None | Require Passport review before recommendations are shown |

No result state may manufacture a destination to preserve a three-card layout.

---

## 9. Presentation Metadata Boundary

### 9.1 Permitted Metadata

The presentation catalogue may contain:

- hero image reference;
- hero image alternative text;
- image crop position;
- approved summary;
- evidence-supported journey moments;
- Journey Director handoff headline;
- Journey Director handoff message; and
- call-to-action label.

### 9.2 Prohibited Metadata

The presentation catalogue must not contain or override:

- destination operational status;
- service confidence;
- candidate or region eligibility;
- recommendation score;
- score weights or penalties;
- recommendation rank;
- personality;
- confidence band; or
- exclusion reasons.

### 9.3 Governed Destination Knowledge

Release 1 production destination facts belong in the governed knowledge-base implementation derived from `DESTINATION-KNOWLEDGE-BASE.md`.

The EBC-003C presentation catalogue is not that production knowledge base. It contains only the approved display material required to enrich a recommendation that has already passed the engine.

If no supported presentation record exists, the adapter may use neutral fallback presentation assets and engine evidence. It may not change the selected destination or invent a journey moment.

---

## 10. UI Integration Boundary

The UI receives the stable presentation contract and must remain unaware of:

- scoring weights;
- eligibility gates;
- penalty calculations;
- tie-breaking;
- region ranking;
- candidate catalogue ordering; and
- operational destination status.

The UI may:

- render the state;
- show the traveller reflection;
- switch between approved possibilities;
- display reasons and journey moments;
- preserve the active `possibilityId`;
- provide accessible navigation; and
- initiate the human Journey Director handoff.

Until a route-level engine orchestration layer supplies a governed `EngineResult`, the existing compatibility entry point returns an unavailable state with no possibilities. This is intentional. A production demo fallback is not permitted.

---

## 11. Deterministic Guarantees

The EBC-003C verification harness proves that:

- identical inputs produce identical presentation output;
- engine order and scores are preserved;
- engine personality assignments are preserved;
- exclusions do not reappear;
- traveller-facing reasons retain evidence references;
- success, partial, insufficient-input, insufficient-candidates and invalid-input states map correctly;
- partial results do not fabricate recommendations;
- uncollected Passport details remain empty;
- explicit Passport signals outrank conflicting homepage intent;
- the presentation model survives JSON serialisation;
- the compatibility boundary does not return demo recommendations; and
- the adapter and reflection modules contain no React, Next.js, browser, random or clock dependency.

The verification command is:

```bash
npm run verify:journey-presentation
```

This complements, and does not replace:

```bash
npm run verify:journey-engine
```

---

## 12. Future Extension Boundaries

### 12.1 Production Knowledge Base

A later delivery may replace verification candidates with a complete governed destination catalogue. It must satisfy the existing `JourneyCandidate` and `RegionCandidate` contracts or use an explicit domain adapter.

The recommendation adapter does not need to change when the catalogue expands.

### 12.2 Story Packet

The `JourneyRecommendationSet` is a presentation-ready precursor to the complete Story Packet required by EBC-003. Later work may add:

- validated narrative blocks;
- selected possibility state;
- handoff context;
- story packet schema version;
- persistence metadata; and
- runtime recovery validation.

Those additions must preserve the engine result and evidence chain.

### 12.3 AI Assistance

Future AI may assist with grounded narrative variation only after an approved architecture decision.

AI must remain downstream of:

- Passport validation;
- deterministic eligibility;
- deterministic scoring;
- regional ranking;
- personality assignment; and
- evidence selection.

AI must not activate destinations, change scores, bypass exclusions or invent traveller facts.

### 12.4 Human Handoff

The final human handoff should carry:

- the completed Journey Passport reference;
- selected `possibilityId`;
- destination and region identifiers;
- recommendation versions;
- evidence and cautions;
- traveller reflection context; and
- explicit traveller preference, when captured.

The handoff must distinguish automated recommendation generation from subsequent human consultation.

### 12.5 Extension Readiness Assessment

| Future capability | Boundary readiness | Engine rewrite required? | Required future work |
| --- | --- | --- | --- |
| **Production destination knowledge base** | Ready through the typed candidate input boundary | No | Governed catalogue implementation, validation and operational stewardship |
| **Larger candidate pools** | Ready because ranking accepts a candidate collection rather than fixed identifiers | No | Performance checks and broader deterministic fixtures |
| **Manually curated recommendations** | Partially ready through a future audited post-engine workflow | No, provided the deterministic result remains preserved | Explicit override contract, authority, reason capture and traveller-facing disclosure |
| **AI-assisted explanation** | Ready downstream of evidence and adapter contracts | No | Grounding, safety, deterministic fallback and approval decision |
| **Multilingual copy** | Ready at the controlled presentation-language boundary | No | Locale-aware template catalogue, content review and fallback rules |
| **Analytics and recommendation feedback** | Ready at the presentation and handoff boundaries | No | Consent, approved event model, data retention and feedback governance |
| **Human Journey Director review** | Ready through versioned result, evidence and handoff context | No | Review workflow, status contract and persistence |
| **Versioned recommendation rules** | Ready through existing engine and rules metadata | No | Rule-release governance, migration policy and compatibility testing |

None of these capabilities is implemented by EBC-003C. The assessment confirms that each can be added at an existing boundary without moving presentation concerns into the deterministic engine.

---

## 13. Known Limitations at This Checkpoint

- The route-level Journey Session → engine → adapter orchestration is not completed in EBC-003C.
- The current UI compatibility boundary intentionally shows no recommendation until a governed engine result is supplied.
- The presentation catalogue contains a focused set of approved display records, not the full production destination knowledge base.
- Journey Passport v1.0 does not collect comfort, restrictions, accessibility needs, budget or general preference notes.
- Complete Story Packet persistence and runtime validation remain later EBC-003 work.
- Human handoff transport and CRM integration remain out of scope.
- Final responsive, accessibility, motion and visual-polish acceptance belongs to the UI implementation phases.

These limitations must not be concealed through fixtures, inferred data or traveller-facing claims.

---

## 14. Checkpoint Decisions

The following decisions are now fixed for subsequent EBC-003 work:

1. The deterministic engine remains the only Release 1 recommendation authority.
2. The adapter is pure and presentation-facing.
3. Engine order, personalities, scores, exclusions and confidence are immutable at the adapter boundary.
4. Traveller reflection is deterministic and evidence-led.
5. Explicit Passport answers outrank supporting homepage intent.
6. Uncollected traveller details remain unknown.
7. Presentation metadata can enrich only evidence already carried by the selected possibility.
8. No production demo fallback is permitted.
9. The UI consumes a stable presentation contract and contains no recommendation logic.
10. Future AI remains downstream of deterministic decisions and governed evidence.

---

## 15. Checkpoint Acceptance

This architecture checkpoint is complete when:

- the presentation contracts compile;
- the recommendation adapter is implemented;
- traveller reflection is implemented;
- presentation metadata is separated from recommendation data;
- the focused presentation verification passes;
- the deterministic engine verification continues to pass;
- lint, TypeScript and production build validations pass; and
- the repository diff contains no whitespace errors.

Completion of this checkpoint does not declare the full EBC-003 Journey Director experience complete. It confirms that subsequent UI and Story Packet work can proceed on a stable, evidence-preserving architecture boundary.
