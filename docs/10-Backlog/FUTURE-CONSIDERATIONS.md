# Future Considerations Register — Release 1.3

```text
Document Type : Governance Register (documentation only — no code, no configuration, no schema change)
Release       : 1.3 (established during Workstream 1/2 governance activity; intended to remain live across future releases)
Persona       : Tiger — Programme and Delivery Lead
Status        : ESTABLISHED — initial population complete
Owner         : Tiger (Programme and Delivery Lead)
Related documents : docs/10-Backlog/RELEASE-1.3-BACKLOG.md; docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md; docs/10-Backlog/RELEASE-1.3-WORKSTREAM-PLAN.md; docs/10-Backlog/RELEASE-1.3.md
Distinct from : RELEASE-1.3-BACKLOG.md (the product/UX/engineering-technical-debt backlog) and RELEASE-1.3-GOVERNANCE-BACKLOG.md (governance-playbook recommendations arising from EBC-R1.2-GOV-001) — this register is specifically for enhancements, governance recommendations, architectural-evolution ideas and implementation opportunities explicitly named and intentionally deferred during completed Release 1.3 workstream governance reviews (Workstream 1, Workstream 2). It does not duplicate, renumber, or supersede either of those documents.
```

## Document Information

| Field | Value |
|---|---|
| Origin EBC | `EBC-R1.3-WS0-001` — Future Considerations Register (FCR) Establishment |
| Ratified source | `FCR-R1.3-001-TIGER-Future-Considerations-Register` (Claude Project, `claude/` namespace) — this repository document is that ratified content, copied in per the repository-synchronisation activity below |
| Explicitly out of scope | Release prioritisation, backlog refinement, engineering implementation, product redesign, architecture review, estimation, release assignment. No entry below carries a target release, a priority, or an effort estimate. |

## Document Change History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 08-Sep-2026 | Tiger | Initial establishment, produced in the Claude Project per `EBC-R1.3-WS0-001`. 17 deferred items captured, drawn from all five completed Workstream 1 (Destination Intelligence Evolution) governance cards and the relevant completed Workstream 2 (Traveller Stories) cards, each traced to its originating document. |
| 1.1 | 08-Sep-2026 | Tiger | Committed to the repository (this document), per the Product Owner's repository-synchronisation instruction. Content carried over verbatim from the Claude-Project-ratified v1.0 — identifiers, traceability, entry text, governance guidance and status definitions unchanged. Workspace Readiness Check (§0) re-run against the now-connected local repository; repository placement rationale added (§0.1). |
| 1.2 | 08-Sep-2026 | Tiger | Formalised the workstream-closure review as a mandatory, explicitly-recorded step (§5, trigger 1) and added §5.1 Workstream Closure Review Log, per the Product Owner's Future Governance closure instruction. Seeded the log retrospectively for Workstream 2 and Workstream 1, both already reflected in this register's existing §3 population. No entries in §3 changed; no scope, priority or estimate introduced. |
| 1.3 | 08-Sep-2026 | Tiger | WS1 full closure review, per `EBC-R1.3-WS1-011`. Added FCR-018, FCR-019, FCR-020 (§3.4 Engineering), sourced from `EBC-R1.3-WS1-009`/`WS1-010` (Engineering Implementation, QA Remediation and Final Sign-off — completed since this register's v1.0–1.2). Updated the Traceability Matrix (§4) and the Workstream Closure Review Log (§5.1) accordingly. No existing entry changed; no scope, priority or estimate introduced. |
| 1.4 | 09-Sep-2026 | Tiger | Documentation Reconciliation, per `EBC-R1.3-WS1-013` (implementing `EBC-R1.3-WS1-012`'s Repository Artefact Reconciliation review). Added FCR-021 (§3.5 Documentation) — the dormant `TravellerStory.experience` field has no reader anywhere in the application — the one new candidate `WS1-012` identified. Updated the Traceability Matrix (§4) and the Workstream Closure Review Log (§5.1) accordingly. No existing entry changed; no scope, priority or estimate introduced. |
| 1.5 | 13-Sep-2026 | Tiger | Workstream Closure Review Log entry for Workstream 11 (SMV Workspace), per `EBC-R1.3-WS3-006` Delivery Readiness Review. Outcome: None identified — no new FCR entry added. This is the first closure-log entry logged contemporaneously with its own workstream closure review, rather than retroactively. No existing entry changed; no scope, priority or estimate introduced. |
| 1.6 | 14-Sep-2026 | Tiger | Workstream Closure Review Log entry for Workstream 11 (SMV Workspace — UX Architecture Phase Closure), per `EBC-R1.3-WS4-002` UX Baseline & Tracker Synchronisation. Outcome: Addition made — FCR-022 (§3.3 UX): Low-Fidelity Wireframes, UX Standards and a standalone UX Review Document, explicitly deferred by `WORKSPACE-SCREEN-INVENTORY.md`'s own text to a future wireframing stage, not produced within `EBC-R1.3-WS4-001`'s scope. Updated the Traceability Matrix (§4) and the Workstream Closure Review Log (§5.1) accordingly. No existing entry changed; no scope, priority or estimate introduced. |

---

## 0. Workspace Readiness Check

| Check | Result |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed, folder connected this session |
| Branch | `main` |
| Working tree before this task | Clean, except one pre-existing, unrelated untracked file (`Claude outputs/EBC-R1.3-WS1-006.md`) — not created or touched by this activity |
| Remote sync | `main` up to date with `origin/main` (fetched and confirmed this session) |
| Last commit before this task | `190d81d` — "docs(r1.3): establish release tracker and separate planning from execution" |
| Branch switch performed | No |

### 0.1 Repository Placement Rationale

The Product Owner's instruction recommended `docs/10-Backlog/FUTURE-CONSIDERATIONS.md`, with discretion to identify a more appropriate location if the current repository structure suggested one. Two candidate homes were considered:

- **`docs/30-Governance/`** — holds standing, cross-release governance/operational registers (`Provider-Dependency-Register.md`, `External-Integration-Definition-of-Done.md`, per that folder's own `README.md`). Rejected as the home for this register: its own stated purpose is definitions that apply "across the release" as standing operational fact, not a register of items surfaced by, and traceable to, specific completed workstream cards within a single release.
- **`docs/10-Backlog/` (recommended location, confirmed).** This folder already holds exactly this shape of document: `RELEASE-1.3-GOVERNANCE-BACKLOG.md` is an existing, direct precedent — a governance register, explicitly distinct from the product backlog (`RELEASE-1.3-BACKLOG.md`), recommendations-only, no release commitment, produced by Tiger from a specific originating EBC (`EBC-R1.2-GOV-001`). This Future Considerations Register follows the identical pattern: Tiger-owned, recommendations-only, explicitly distinct from both existing Backlog documents, produced from specific originating EBCs (§4 below).

**Confirmed: `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` is the correct location**, consistent with this repository's own established convention for this class of document.

---

## 1. Purpose and Scope

The Future Considerations Register (FCR) is the canonical, single repository for enhancements, governance recommendations, architectural evolution ideas, Product ideas, and implementation opportunities that were **intentionally identified and intentionally deferred** during completed Release 1.3 governance activity — captured so they are consciously evaluated at future release planning, rather than forgotten or silently rediscovered.

**The FCR is explicitly not:**

- a backlog (it carries no priority, no estimation, no release commitment);
- a release plan (nothing here is scheduled);
- a substitute for `RELEASE-1.3-BACKLOG.md` / `RELEASE-1.3-GOVERNANCE-BACKLOG.md` (this repository's existing pre-execution planning documents) or for the Release 1.3 Backlog Consolidation already performed at the Release 1.2 → 1.3 boundary (`EBC-R1.2-WS6-04-TIGER-Release-1.3-Backlog-Consolidation.md`, its Tier A/B/C register of Product-vision-level items such as Google Ads conversion tracking, region-level destination intelligence evolution, Journey Clusters, Authentication Roadmap, etc.). Those items are **not duplicated here** — they already have a governed home, consistent with Project Instructions §32 ("do not create duplicate documents"). This register begins where that one leaves off: items surfaced *during* Release 1.3's own workstream execution (Workstreams 1 and 2 to date), not items carried in from Release 1.2.
- a mechanism for creating new ideas. Every entry below is a consideration some prior EBC, review, or governance document already explicitly named and explicitly declined to resolve in-line — nothing in this register was invented for it.

This register was established with every known deferred item from Release 1.3's completed governance activity to date (Workstream 1 — Destination Intelligence Evolution, and Workstream 2 — Traveller Stories, both complete or at a closed governance gate as of establishment), and is intended to remain live and additive across the rest of Release 1.3 and into Release 1.4+ planning.

---

## 2. Register Structure — Field Definitions

Every entry in Section 3 carries:

| Field | Definition |
|---|---|
| **ID** | Stable identifier, `FCR-0##`, assigned once and never reused or renumbered, even if an entry is later rejected or actioned. |
| **Category** | One of: Product, Architecture, Engineering, Governance, QA, UX, Operations, Documentation. An entry spanning more than one is assigned its primary/originating discipline; cross-discipline notes are carried in Description. |
| **Title** | Short, specific name. |
| **Description** | What the consideration actually is, in enough detail that a future reader does not need to re-open the originating document to understand it. |
| **Originating EBC/ADR** | The specific document(s) that first raised it, cited by exact filename. |
| **Reason for Deferral** | Why this was not actioned inside its originating workstream — e.g. non-blocking per the reviewing persona's own assessment, requires a decision outside that card's authority, speculative ahead of a concrete need, or explicitly scoped as Release 1.4+. |
| **Dependencies** | What (if anything) needs to happen before this item is even ready to be evaluated for a future release — a concrete candidate emerging, another item resolving first, a Product decision, etc. |
| **Suggested Review Timing** | Optional. When it becomes sensible to revisit, if the originating document named one. |
| **Status** | Always **Deferred** at initial population. (See §7 for the status vocabulary and how an entry's status changes going forward.) |

No entry below is assigned a target release. Per this register's own establishing instruction, assigning a release is a future release-planning act, not a registry-establishment act.

---

## 3. Initial Population — Deferred Items Register

### 3.1 Architecture

**FCR-001 — Taxonomy / vocabulary / governance sheet gap in the Bootstrap Workbook**
*Description:* The existing 8-sheet Operational Layer workbook (`Journey Director Intelligence Enriched.xlsx`) carries six sheets not covered by the new Bootstrap Workbook specification: four controlled-vocabulary/taxonomy sheets (`Traveller Types`, `Emotional Goals`, `Desired Experiences`, `Compatibility Matrix`) and two governance/audit sheets (`Source Register`, `Review Register`). If the Bootstrap Workbook becomes the Operational Layer (per Model A, already adopted), these six sheets need an explicit new home — either migrated as-is, or made KB-derived the same way the Travel Regions/Places sheets are.
*Originating EBC/ADR:* `EBC-R1.3-WS1-002-ARCHIE-Bootstrap-Workbook-Architecture-Review.md` §4, §9; consolidated as **OD-4** in `EBC-R1.3-WS1-004-TIGER-Delivery-Governance-Consolidation-Engineering-Readiness.md` §7, §8.4.
*Reason for Deferral:* Explicitly assessed by Archie as not blocking Phase 1 (Sheets 1–2, identity/hierarchy layer). The follow-on card Archie originally suggested for this scope (`EBC-R1.3-WS1-003`) was, by ID-allocation accident, assigned to a differently-scoped Product review instead — the gap remains genuinely open, not resolved elsewhere.
*Dependencies:* None blocking; can be commissioned once Phase 1 (Sheets 1–2) is underway.
*Suggested Review Timing:* Once Phase 1 of the Bootstrap Generator ships.
*Status:* Deferred.

**FCR-002 — Narrower, read-only Supabase database role for the Bootstrap Generator**
*Description:* The Bootstrap Generator's only available credential (`service_role`) carries `INSERT`/`UPDATE` grants on `geo_places`/`geo_aliases`, granted for a different consumer's benefit (`importGeoNames.ts`). The Generator itself has no database-enforced barrier stopping it from writing to these tables — only a code-level, code-review-enforced convention. A narrower, genuinely read-only database role/credential is a legitimate future hardening step.
*Originating EBC/ADR:* `EBC-R1.3-WS1-005-ARCHIE-Geo-Places-Access-Pattern-Architecture-Decision.md` §5, Risk 3.
*Reason for Deferral:* Explicitly named as "a schema/grant change outside this card's minimal scope" — a residual item, not actioned.
*Dependencies:* None.
*Suggested Review Timing:* A future security-hardening pass, not tied to any specific release.
*Status:* Deferred.

**FCR-003 — Retire the two-file curated-testimonial mapping layer (Runtime Simplification)**
*Description:* `travellerStories.data.ts` + `getTestimonial.ts` form a hand-maintained, two-file, journey-ID-keyed mapping layer for curated testimonial text. This is exactly the class of artefact that produced a real regression during Release 1.3 (a single stale mapping key for JRN-025 broke every Traveller Story detail page at once, caught and fixed during `EBC-R1.3-WS2-T2`). Recommend retiring this layer in favour of a single canonical, journey-keyed content source (e.g. one file per journey, or the quote folded directly into each journey's `metadata.json`) — removing the separate ID-mapping table entirely.
*Originating EBC/ADR:* `EBC-R1.3-WS2-04-ARJUN-Traveller-Story-Content-Migration-Analysis.md` §6 (Option 4), §10, §11 (Decision 5); concurred as Future Consideration #2 in `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` §4.
*Reason for Deferral:* A genuine architecture change (new data shape, possibly a new build step) — judged higher risk to make under Release 1.3's delivery pressure than an in-line fix. Explicitly recommended as Release 1.4+ Architecture work, not Release 1.3 scope.
*Dependencies:* None blocking; independent of the taxonomy-unification item below, though both touch the same subsystem and would sensibly be scoped together.
*Suggested Review Timing:* Release 1.4+ Architecture review.
*Status:* Deferred.

**FCR-004 — Unify the two parallel experience-taxonomy systems**
*Description:* `metadata.json`'s free-text `experienceType: string` field (34 distinct values observed across 52 journeys, unvalidated) and `travellerStories.data.ts`'s closed 8-value `ExperienceType` union are two parallel, non-reconciled taxonomies for the same underlying concept, with different consumers. Recommend unifying into one canonical, validated type.
*Originating EBC/ADR:* `EBC-R1.3-WS2-04-ARJUN-Traveller-Story-Content-Migration-Analysis.md` §5; named as Future Consideration #2 in `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` §4 (Archie's ADR Question 5 / Option 4).
*Reason for Deferral:* Widening or restructuring the runtime `ExperienceType` union was explicitly rejected as Release 1.3 scope (architecture-material change under Project Instructions §21, disproportionate blast radius for a UI element — a category badge — the Product-approved workbook doesn't even define as a requirement). Recorded as Release 1.4+ backlog by both Arjun and Archie, independently.
*Dependencies:* Sensible to scope alongside FCR-003 (Runtime Simplification), since both touch the same data layer; not strictly blocking on it.
*Suggested Review Timing:* Release 1.4+ Architecture review.
*Status:* Deferred.

### 3.2 Product

**FCR-005 — Travel Region "graduation" process**
*Description:* Should a Place (Sheet 2 of the Bootstrap Workbook) later warrant promotion to its own top-level Travel Region (Sheet 1) — the "Coorg-from-Karnataka" scenario the original ADR named as an open question — no governance process yet defines how that promotion happens. Both Archie and Arjun independently recommend this go through the same KB change-control path as new-region onboarding, not a workbook-internal move.
*Originating EBC/ADR:* `EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md` §12 (original open question); `EBC-R1.3-WS1-002-ARCHIE-Bootstrap-Workbook-Architecture-Review.md` §5; `EBC-R1.3-WS1-003-ARJUN-Product-Bootstrap-Workbook-Review-Destination-Governance.md` §1, §3; consolidated as **OD-6** in `EBC-R1.3-WS1-004` §7.
*Reason for Deferral:* Both reviewing personas explicitly recommend deferring design until a concrete graduation candidate actually emerges from WS1 Tasks 1.1/1.2 (Karnataka/Tamil Nadu/Himachal Pradesh, then Kerala/Rajasthan expansion) — designing it speculatively now was assessed as premature.
*Dependencies:* A concrete candidate Place from WS1 Task 1.1 or 1.2's expansion work.
*Suggested Review Timing:* Once WS1 Tasks 1.1/1.2 produce a real candidate.
*Status:* Deferred.

**FCR-006 — Traveller Stories cross-reference field on the Destination Intelligence workbook**
*Description:* `PRW-R1.3-001-Traveller-Stories.xlsx` (the WS2 Product Review Workbook precedent) has no field linking a traveller story to a `travelRegionId`/`placeId` in the Destination Intelligence workbook, and the new Bootstrap Workbook specification does not add one either. A future integration need (e.g. surfacing traveller stories from a destination page, or vice versa) may want this link.
*Originating EBC/ADR:* `EBC-R1.3-WS1-003-ARJUN-Product-Bootstrap-Workbook-Review-Destination-Governance.md` §7.
*Reason for Deferral:* Explicitly assessed as speculative complexity ahead of a concrete integration need — "adding one now... would be exactly the speculative complexity this review area's own instruction warns against." Recorded as a candidate Future Reserved field only.
*Dependencies:* A concrete cross-referencing need being scoped first.
*Suggested Review Timing:* Not scheduled; revisit only if a concrete integration need is identified.
*Status:* Deferred.

**FCR-007 — Whether "Celebrations" (and other Missing experience values) should become permanent `ExperienceType` categories**
*Description:* Of the traveller-story `experienceType` values with no fit in the current 8-value runtime enum, `Celebrations` (3 journeys) was assessed by Archie as architecturally the strongest candidate for eventually earning a genuine, permanent enum slot — a coherent, recurring concept distinct from `Family Holiday` — as opposed to a generic catch-all like the rejected `Vacation`.
*Originating EBC/ADR:* `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` §2 (Question 4), §4 (Future Consideration #1).
*Reason for Deferral:* Explicitly named as "a Product/business-taxonomy judgment, not an architecture one" — Archie declined to decide it under this EBC's authority. Carried into Future Considerations rather than resolved.
*Dependencies:* Product decision; sensibly bundled with FCR-004 (taxonomy unification) if/when that work is scoped.
*Suggested Review Timing:* Alongside any future taxonomy-unification work (FCR-004).
*Status:* Deferred.

**FCR-008 — Journey Snapshot: permanent rendering mode or mandatory pre-publish curation gate?**
*Description:* Should the metadata-only "Journey Snapshot" card remain a permanent, acceptable rendering mode for any future traveller journey with no curated testimonial, or should testimonial curation become a mandatory gate before a journey can be published at all? This is a standing Product policy question, not specific to any one journey.
*Originating EBC/ADR:* `EBC-R1.3-WS2-04-ARJUN-Traveller-Story-Content-Migration-Analysis.md` §5, §11 (Decision 4); reaffirmed as Future Consideration #3 in `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` §4.
*Reason for Deferral:* Explicitly non-blocking for Release 1.3's own content-migration work; both Arjun and Archie frame it as governing how *future* Traveller Story EBCs are scoped, not a Release 1.3 decision.
*Dependencies:* None.
*Suggested Review Timing:* Before the next Traveller Story content-authoring workstream is scoped.
*Status:* Deferred.

**FCR-009 — Deferred mapping for the "Memory Makers" and "International Private Tour" ambiguous experience values**
*Description:* Of the four Ambiguous experience-category values reviewed in detail, two (`Memory Makers` — 3 journeys; `International Private Tour` — 1 journey) were explicitly left unmapped rather than assigned a best-guess category, because no confident single mapping was supported by the evidence and a wrong badge was assessed as a worse outcome than no badge. (The other two — `Kerala Getaway`, `Relaxing Getaway` — received specific recommended mappings and are not carried here as open items.)
*Originating EBC/ADR:* `EBC-R1.3-WS2-05-ADDENDUM-01-ARJUN-Ambiguous-Experience-Values-Product-Review.md` §2, §3, §6.
*Reason for Deferral:* No visible output currently depends on this decision (the curated `ExperienceType` union field is not rendered anywhere on the live site today — see FCR-010). Recommended revisiting only once a future category-badge feature is actually designed, at which point Sophie's input on handling a marketing-style label would also be useful.
*Dependencies:* A future badge feature being designed (see FCR-004/FCR-010's broader taxonomy-unification context).
*Suggested Review Timing:* At the time a category-badge UI feature is designed.
*Status:* Deferred.

### 3.3 UX

**FCR-010 — Standardise or clean up the raw `experienceType` "kicker" text shown to travellers**
*Description:* The free-text `metadata.json` `experienceType` value (not the curated `ExperienceType` union) is what travellers actually see today — rendered verbatim as the bold kicker line on story cards, the detail-page headline, the Journey Summary facts panel, and the Journey Snapshot fallback sentence. Values like "Memory Makers," "Kerala Getaway," "Celebrations," and "Global Escapes" are live, unfiltered marketing/destination-style labels. Whether this raw text itself should be cleaned up or standardised — independent of any decision about the separate curated union — was raised as an open question, not resolved.
*Originating EBC/ADR:* `EBC-R1.3-WS2-05-ADDENDUM-01-ARJUN-Ambiguous-Experience-Values-Product-Review.md`, opening finding.
*Reason for Deferral:* Explicitly raised "as an observation, not a recommendation... outside this addendum's requested scope." Arjun notes Archie and Sophie would need to weigh in on whether this is content (Product) or presentation (UX/Architecture) before it can even be scoped.
*Dependencies:* A joint Product/Sophie/Archie framing of whether this is a content or presentation question, before any design work begins.
*Suggested Review Timing:* Not scheduled; raised for awareness.
*Status:* Deferred.

**FCR-022 — Low-Fidelity Wireframes, UX Standards and a standalone UX Review Document not yet produced for Journey Workspace**
*Description:* The Journey Workspace UX Design Brief (`docs/02-Product/workspace/JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md` §8) names eight Expected Deliverables for the UX phase. The completed UX Architecture package (`EBC-R1.3-WS4-001`, `docs/04-UX/workspace/`) produced five of them directly — Information Architecture, Navigation Model, User Journey Maps, Screen Inventory, Interaction Flow Diagrams — plus a UX Discovery document not originally named in the Brief. The remaining three — Low-Fidelity Wireframes, UX Standards, and a standalone UX Review Document — were not produced within this EBC's actual scope. `WORKSPACE-SCREEN-INVENTORY.md` explicitly names this: "No wireframe, layout or visual design is included, per this EBC's Out of Scope instruction; this inventory is the structural handoff to that future stage," and describes itself as "the final input Sophie's future low-fidelity wireframing stage will consume."
*Originating EBC/ADR:* `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` §1, §12 (explicit deferral language); cross-checked against `docs/02-Product/workspace/JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md` §8 (Expected Deliverables) during `EBC-R1.3-WS4-002` (Tiger, UX Baseline & Tracker Synchronisation).
*Reason for Deferral:* The UX Architecture EBC scoped its own deliverables to the six structural documents and explicitly treated wireframing, UX standards and a formal review document as a distinct, later stage — not an oversight, but a disclosed scope decision made within that EBC's own text.
*Dependencies:* Solution Architecture (`EBC-R1.3-WS4-002`'s recommended next step for WS11) proceeding far enough that wireframing has concrete component/technical constraints to work within.
*Suggested Review Timing:* Before Journey Workspace Engineering implementation begins — wireframes and UX Standards are natural prerequisites for Rad's estimation and build.
*Status:* Deferred.

### 3.4 Engineering

**FCR-011 — One-time narrative-content migration (Bootstrap Workbook adoption)**
*Description:* Adopting the Bootstrap Workbook as the Operational Layer's canonical seed (Model A) requires a structured, verifiable, one-time copy of the ~24 already-approved destinations' 45+ narrative columns (First Impression, Shared Moment, Journey High Point, etc.) from the existing `Journey Director Intelligence Enriched.xlsx` into the new workbook. This is real, currently-unscoped work — a structured copy, not a re-authoring exercise, but not yet named as a distinct task.
*Originating EBC/ADR:* `EBC-R1.3-WS1-002-ARCHIE-Bootstrap-Workbook-Architecture-Review.md` §4, §8; consolidated as **OD-5** in `EBC-R1.3-WS1-004-TIGER-Delivery-Governance-Consolidation-Engineering-Readiness.md` §7, §8.4.
*Reason for Deferral:* Explicitly assessed as not blocking Phase 1 (Sheets 1–2), but flagged as "must not be silently dropped" given the ID-allocation confusion that has already affected this card family (see FCR-017).
*Dependencies:* Gated on Model A's ratification (already given, per `EBC-R1.3-WS1-002` D1) and on Phase 1 (Sheets 1–2) being underway; should be scoped as a distinct Rad task, not folded silently into the Bootstrap Generator implementation card.
*Suggested Review Timing:* Once Phase 1 of the Bootstrap Generator ships.
*Status:* Deferred.

**FCR-012 — `kbApprovedRegions.ts` effort estimate (structured source for the ~89 already-KB-documented Places)**
*Description:* Sheet 1 of the Bootstrap Workbook has a clean, structured, machine-readable row source (`kbApprovedPortfolio.ts`). Sheet 2 does not have an equivalent for the ~89 Places the Knowledge Base already documents by name — leaving `geo_places` fuzzy name-matching as the only mechanism that will ever mark an existing KB region `existsInKB = Yes`, which repository inspection later confirmed cannot work even in principle for the KB's compound, curated Place names (e.g. "North Goa — Candolim / Sinquerim"). Building a small structured transcription (`kbApprovedRegions.ts`, mirroring `kbApprovedPortfolio.ts`'s pattern) was recommended as the durable fix, with a mandatory manual cross-check as the fallback. Rad's rough effort estimate for building it has still not been produced by any card.
*Originating EBC/ADR:* `EBC-R1.3-WS1-003-ARJUN-Product-Bootstrap-Workbook-Review-Destination-Governance.md` §8.3; consolidated as **OD-3** in `EBC-R1.3-WS1-004-TIGER-Delivery-Governance-Consolidation-Engineering-Readiness.md` §7; sharpened by direct repository evidence in `EBC-R1.3-WS1-006-TIGER-RAD-KB-Region-Matching-Strategy-Engineering-Readiness.md` §1.1, §3.3, which confirms this is the *only* mechanism that can ever correctly reconcile the legacy 89 Places (independent of, and complementary to, the `geoScope` Place→Travel-Region matching mechanism `WS1-006` separately approved).
*Reason for Deferral:* `EBC-R1.3-WS1-006` §5.2 confirms this does not block Rad's implementation card (WS1 Tasks 1.1/1.2's actual purpose — discovering *new* candidates — is fully served by the separately-approved `geoScope` mechanism); the legacy-89 reconciliation can proceed under the manual-cross-check fallback for an initial batch without waiting on this estimate.
*Dependencies:* Rad's own standard implementation-readiness check, to be produced once implementation begins, per `EBC-R1.3-WS1-006` §5.3.
*Suggested Review Timing:* At the start of Rad's Bootstrap Generator implementation.
*Status:* Deferred.

**FCR-013 — Light validation on `experienceType` at the point of authoring**
*Description:* A lint/check step when a new traveller folder's `metadata.json` is created, validating its `experienceType` value against the (future, unified — see FCR-004) canonical taxonomy. This is what would have caught the current 34-value vocabulary drift early, instead of letting it accumulate silently across 49 traveller folders.
*Originating EBC/ADR:* `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` §4, Future Consideration #4.
*Reason for Deferral:* Explicitly "not proposed as Release 1.3 or even necessarily Release 1.4 work; recorded so it isn't lost." Depends on the canonical taxonomy (FCR-004) existing first.
*Dependencies:* FCR-004 (taxonomy unification) must be resolved first — this cannot be built against two parallel, unreconciled taxonomies.
*Suggested Review Timing:* After FCR-004 is actioned.
*Status:* Deferred.

**FCR-014 — Additional automation for Product Review Workbook validation**
*Description:* Beyond the manual reconciliation discipline established across WS2 (workbook-vs-repository row counts, name/destination cross-checks), further automation of Product Review Workbook validation was named as a good practice to carry forward, without being specified further.
*Originating EBC/ADR:* `EBC-R1.3-WS2-CLOSE-01-TIGER-Traveller-Stories-Workstream-Closure-Release-Tracker-Update.md` §8 (Lessons Learned).
*Reason for Deferral:* Named at workstream closure as a "carried to Release 1.4+ consideration" item — no design or scoping performed.
*Dependencies:* None named.
*Suggested Review Timing:* Release 1.4+ tooling/process review.
*Status:* Deferred.

**FCR-018 — Bootstrap Workbook `aliases` field — repository-layer read function needed**
*Description:* Sheet 2's `aliases` column (`geo_aliases` rows for a matched `geo_place_id`, rolled up, semicolon-separated) is architecturally pre-approved but has no implementation — `bootstrapRepository.ts` has no existing query against `geo_aliases` to roll up. Implementing it correctly means adding a new read function against the repository access layer, which the `WS1-009` remediation card's own scope explicitly excluded ("Repository access layer" and "Supabase integration" both named Out of Scope there).
*Originating EBC/ADR:* `EBC-R1.3-WS1-009-RAD-Workbook-Protection-Product-Editability-Remediation.md` §3, §7 Item 1; architectural pre-approval already given in `EBC-R1.3-WS1-005-ARCHIE-Geo-Places-Access-Pattern-Architecture-Decision.md` §4.
*Reason for Deferral:* Explicitly out of `WS1-009`'s own stated scope boundary; Rad recommended a small, explicitly-scoped follow-on card rather than building a repository-layer change inside a workbook-generation-layer fix.
*Dependencies:* None architecturally (the access-layer extension is already pre-approved) — needs its own scoped Rad implementation card.
*Suggested Review Timing:* Next Bootstrap Workbook / Destination Intelligence engineering card, or at Release 1.4 planning if not picked up sooner.
*Status:* Deferred.

**FCR-019 — `kbSectionRef` on Bootstrap Workbook Sheet 2 — ratify or remove**
*Description:* Sheet 2 carries an undocumented `kbSectionRef` column, added unilaterally by Rad during `WS1-007` as a traceability aid mirroring Sheet 1's own `kbSectionRef`, never put to Arjun/Tiger against the literal `EBC-R1.3-WS3-001` §4.2 column table. The implementation does not contradict the approved specification — it adds one field beyond it. Needs an explicit decision: ratify it as a formal Sheet 2 specification addition, or direct its removal.
*Originating EBC/ADR:* `EBC-R1.3-WS1-009-RAD-Workbook-Protection-Product-Editability-Remediation.md` §3, §7 Item 2; reaffirmed as still-open in `EBC-R1.3-WS1-010-KEERTHI-Engineering-Remediation-Verification-Final-QA-Sign-off.md` §4, Item 2.
*Reason for Deferral:* Non-blocking either way — Rad documented the decision needed directly in code (`types.ts`) rather than unilaterally removing a working field.
*Dependencies:* None — a Product/Arjun/Tiger decision only.
*Suggested Review Timing:* Before the next Bootstrap Workbook Sheet 2 engineering card.
*Status:* Deferred.

**FCR-020 — Live Supabase (`geo_places`/`geo_aliases`) reachability gap in the current engineering/QA environment**
*Description:* Every live query against `geo_places` fails in the current engineering/QA working environment (no egress to `*.supabase.co`), observed identically and independently across four separate sessions (`WS1-007`, `WS1-008`, `WS1-009`, `WS1-010`). This is disclosed and explicitly excluded from scoring against each of those cards individually, but the underlying network/egress-allowlist condition itself has never been assigned as its own action item.
*Originating EBC/ADR:* `EBC-R1.3-WS1-010-KEERTHI-Engineering-Remediation-Verification-Final-QA-Sign-off.md` §1, §4 Item 3; independently reconfirmed in `EBC-R1.3-WS1-009-RAD-Workbook-Protection-Product-Editability-Remediation.md` §7 Item 3.
*Reason for Deferral:* Not a defect against any Bootstrap Generator card — a standing environment condition every one of those cards correctly declined to score against itself. Recommended by both Rad and Keerthi as its own separate action item, not resolvable by a further Bootstrap Generator card.
*Dependencies:* Confirmation of the correct egress-allowlist entry for the project's live Supabase host from whichever environment will run the generator in practice — an infrastructure/access action, not an engineering-implementation one.
*Suggested Review Timing:* Before the Bootstrap Generator is next required to validate against live geo-identity data (e.g. the legacy-89 Places reconciliation, FCR-012).
*Status:* Deferred.

### 3.5 Documentation

**FCR-015 — ADR addendum recording the new Destination Intelligence ↔ geo-truth dependency edge**
*Description:* The Bootstrap Generator's approved live-query access to `geo_places`/`geo_aliases` is the first dependency edge ever created between the Destination Intelligence/Operational Layer tooling and the geo-truth system, which the original ADR (`ADR-R1.2-WS3-001`) and `EBC-R1.2-WS6-03`'s geo/Journey-Director boundary work deliberately kept unconnected. A short addendum note against that existing architecture record was recommended, so a future reviewer does not have to rediscover this coupling as an unexplained anomaly.
*Originating EBC/ADR:* `EBC-R1.3-WS1-005-ARCHIE-Geo-Places-Access-Pattern-Architecture-Decision.md` §5, Risk 1.
*Reason for Deferral:* A documentation-currency action, not gating the decision itself (the decision is already made and in force); simply not yet actioned.
*Dependencies:* None.
*Suggested Review Timing:* Next documentation-maintenance pass touching `ADR-R1.2-WS3-001` or `EBC-R1.2-WS6-03`.
*Status:* Deferred.

**FCR-016 — `travellerStories.data.ts` header citation cleanup**
*Description:* The file header of `travellerStories.data.ts` still cites its content as sourced from "Client Testimonials.xlsx" — an older file not present anywhere in the current repository — rather than the now-canonical `PRW-R1.3-001-Traveller-Stories.xlsx` Product Review Workbook. A cosmetic, low-risk documentation correction.
*Originating EBC/ADR:* `EBC-R1.3-WS2-04-ARJUN-Traveller-Story-Content-Migration-Analysis.md` §3; reaffirmed as an open item in `EBC-R1.3-WS2-CLOSE-01-TIGER-Traveller-Stories-Workstream-Closure-Release-Tracker-Update.md` §8 (Lessons Learned).
*Reason for Deferral:* Recommended to be corrected "once migration completes" (i.e. once the remaining 37 testimonials are migrated, per FCR-011's sibling Traveller Stories migration work) — sequenced after, not blocking, that work.
*Dependencies:* Completion of the outstanding 37-testimonial migration (a Release 1.3 in-flight item, tracked in the Workstream Plan, not itself an FCR entry since it is committed Release 1.3 work, not deferred).
*Suggested Review Timing:* Immediately once the outstanding testimonial migration completes.
*Status:* Deferred.

**FCR-021 — Document that `TravellerStory.experience` currently has no reader anywhere in the application**
*Description:* The curated `ExperienceType` union field (`TravellerStory.experience`, populated for 35 of 52 journeys after the Release 1.3 testimonial migration) is written into the data but has no reader anywhere in `web/app` or `web/components` — confirmed by direct repository search. What travellers actually see is a different, unrelated field: `metadata.json`'s raw, unvalidated `experienceType` string, rendered verbatim in four places (story-card kicker, detail-page headline, Journey Summary facts panel, Journey Snapshot fallback sentence). The field's own doc comment in `travellerStories.data.ts` explains why it is optional but does not state that it is currently inert, risking a future engineer assuming it has a visible effect.
*Originating EBC/ADR:* `EBC-R1.3-WS2-05-ADDENDUM-01-ARJUN-Ambiguous-Experience-Values-Product-Review.md`, opening finding; independently confirmed via repository review in `EBC-R1.3-WS1-012-TIGER-Repository-Artefact-Reconciliation-Documentation-Lineage-Review.md` §4 (Gap 2).
*Reason for Deferral:* A documentation-clarity action only, not gating any decision already made — the field's dormancy does not affect the Release 1.3 experience-category mapping decisions (see `RELEASE-1.3.md` §7, `DEC-R1.3-003`). `EBC-R1.3-WS1-013` assessed this candidate against this register's inclusion criteria (deferred, non-blocking, future engineering/Product value, traceable) and confirmed it qualifies, but could not action the code-comment fix itself: the target file (`web/config/travellerStories.data.ts`) is implementation code, and this EBC's own Repository Areas scope excludes modifying implementation code. That conflict is recorded rather than silently resolved — see `EBC-R1.3-WS1-013`'s Documentation Reconciliation Report §6.
*Dependencies:* None — a small, self-contained doc-comment edit; alternatively resolved incidentally if/when a future badge feature is built against this field (see FCR-004/FCR-009), whichever comes first.
*Suggested Review Timing:* Next engineering card touching `web/config/travellerStories.data.ts`, or actioned immediately as a standalone one-line documentation fix by Rad.
*Status:* Deferred.

### 3.6 Governance

**FCR-017 — Adopt a distinct, collision-free ID family for the WS1 Destination Intelligence card group**
*Description:* The WS1 Destination Intelligence card family carries two disclosed, non-blocking naming defects: (a) the specification card is filed under its supplied native ID `EBC-R1.3-WS3-001` despite covering Workstream 1 subject matter (cited correctly by all downstream cards as `EBC-R1.3-WS3-001`, never renumbered); (b) two different cards (`EBC-R1.3-WS3-001` and `EBC-R1.3-WS1-002`) each independently define their own "D1–D4" decision labels for different questions, disambiguated only by always citing the source document alongside the label (`WS3-001 D1` vs. `WS1-002 D1`). Neither caused a substantive error, but both are exactly the kind of drift that should not recur.
*Originating EBC/ADR:* `EBC-R1.3-WS3-001-TIGER-Product-Bootstrap-Workbook-Definition-Extraction-Strategy.md` §0; `EBC-R1.3-WS1-004-TIGER-Delivery-Governance-Consolidation-Engineering-Readiness.md` §0, §3.1, §7 (**OD-7**).
*Reason for Deferral:* Explicitly recorded as "open, cosmetic," not blocking any implementation decision. Recommended resolution: adopt a distinct ID family (e.g. `EBC-R1.3-WS1-DI-00x`) for future cards in this family, or confirm the current pattern is intentional.
*Dependencies:* None — a Product Owner/Tiger naming-convention decision only.
*Suggested Review Timing:* Before the next card is opened in this family (e.g. the taxonomy-sheet follow-on, FCR-001, or the narrative-migration task, FCR-011).
*Status:* Deferred.

---

## 4. Traceability Matrix — Originating EBC/ADR → FCR Entry

| Originating EBC / ADR | FCR Entries Raised |
|---|---|
| `EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md` (ADR source) | FCR-005 |
| `EBC-R1.3-WS3-001-TIGER-Product-Bootstrap-Workbook-Definition-Extraction-Strategy.md` | FCR-017 |
| `EBC-R1.3-WS1-002-ARCHIE-Bootstrap-Workbook-Architecture-Review.md` | FCR-001, FCR-005, FCR-011 |
| `EBC-R1.3-WS1-003-ARJUN-Product-Bootstrap-Workbook-Review-Destination-Governance.md` | FCR-005, FCR-006, FCR-012 |
| `EBC-R1.3-WS1-004-TIGER-Delivery-Governance-Consolidation-Engineering-Readiness.md` | FCR-001, FCR-005, FCR-011, FCR-012, FCR-017 |
| `EBC-R1.3-WS1-005-ARCHIE-Geo-Places-Access-Pattern-Architecture-Decision.md` | FCR-002, FCR-015 |
| `EBC-R1.3-WS1-006-TIGER-RAD-KB-Region-Matching-Strategy-Engineering-Readiness.md` | FCR-012 |
| `EBC-R1.3-WS1-009-RAD-Workbook-Protection-Product-Editability-Remediation.md` | FCR-018, FCR-019, FCR-020 |
| `EBC-R1.3-WS1-010-KEERTHI-Engineering-Remediation-Verification-Final-QA-Sign-off.md` | FCR-019, FCR-020 |
| `EBC-R1.3-WS2-04-ARJUN-Traveller-Story-Content-Migration-Analysis.md` | FCR-003, FCR-004, FCR-008, FCR-016 |
| `EBC-R1.3-WS2-05-ADDENDUM-01-ARJUN-Ambiguous-Experience-Values-Product-Review.md` | FCR-009, FCR-010, FCR-021 |
| `EBC-R1.3-WS2-06-ARCHIE-Experience-Taxonomy-Architecture-Review.md` | FCR-003, FCR-004, FCR-007, FCR-008, FCR-013 |
| `EBC-R1.3-WS2-CLOSE-01-TIGER-Traveller-Stories-Workstream-Closure-Release-Tracker-Update.md` | FCR-014, FCR-016 |
| `EBC-R1.3-WS1-012-TIGER-Repository-Artefact-Reconciliation-Documentation-Lineage-Review.md` | FCR-021 (independent confirmation) |
| `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` (via `EBC-R1.3-WS4-002`) | FCR-022 |

Every FCR entry above traces to at least one specific, completed governance document — no entry in Section 3 was originated by this register itself.

---

## 5. Governance Guidelines — Maintaining the FCR

**When entries are added.** A new FCR entry is added when a completed EBC, architecture review, product review, QA report, or governance consolidation explicitly names something as deferred, out of scope, a future consideration, a backlog candidate, or a recommendation not actioned within its own card — never speculatively, and never as a substitute for that document's own Out of Scope / Explicitly Deferred section. If a document doesn't itself flag something as deferred, it does not belong in the FCR merely because a later reader thinks it should have been.

**Who may add entries.** Any Team Satvi persona may propose an FCR entry, sourced from their own completed work (Archie from an architecture review, Arjun from a product review, Rad from an engineering report, Keerthi/Sri from validation findings). Tiger is responsible for reviewing each proposed entry against this register's field definitions (§2) before it is recorded, and for the periodic consolidation pass described below — mirroring the same role Tiger already plays consolidating multi-persona findings elsewhere in this project (Project Instructions §31).

**When the register is reviewed.** Two triggers:
1. **At every workstream closure** (the same moment a `*-CLOSE-*` or equivalent closure card is produced) — the closing persona explicitly assesses whether their own workstream's completed cards named any deferred item not yet captured. This assessment is mandatory and must be recorded either way: if a new item is found, it is added to §3 and logged in §5.1 below; if none is found, that is also explicitly recorded in §5.1 — a workstream closure must never pass without an FCR assessment being logged, and "no items were reviewed" is not an acceptable substitute for "no items were found." This is a required step of the standard workstream closure lifecycle (Project Instructions §12), alongside Tiger's, Keerthi's and Sri's other closure-stage responsibilities.
2. **At the start of every future release's delivery planning** (the Release 1.4+ equivalent of `EBC-R1.3-001`/`RELEASE-1.3-WORKSTREAM-PLAN.md`) — Tiger reviews the full FCR as a required input, alongside the existing Release Backlog and Governance Backlog documents, per Project Instructions §13/§17.

**How items transition into future release planning.** An FCR entry never moves directly into a release plan. The transition is always: FCR entry → raised for evaluation during a future release's delivery-planning workstream (the Release 1.4+ equivalent of `EBC-R1.3-001`) → if the Product Owner elects to pursue it, it is promoted into that release's Backlog/Workstream Plan with a Commitment/Candidate classification and, only then, a release-inclusion decision. An FCR entry gaining a target release without going through that planning workstream should not happen — this register carries no authority to commit anything on its own, consistent with this card's own Explicitly Out of Scope instruction (§6 below) and Project Instructions §10 (release-inclusion is the Product Owner's authority alone).

**How completed or rejected items are managed.** An entry's `Status` field changes, but the entry itself is never deleted — this register is a historical record as much as a live one:
- **Deferred** — initial and default state.
- **Promoted** — accepted into a specific release's Backlog/Workstream Plan; record which release and cross-reference the accepting document.
- **Actioned** — implemented; record the implementing EBC/IMP.
- **Rejected** — the Product Owner or the relevant persona-authority explicitly declines to pursue it; record who declined it and why, in one line — never silently removed.
- **Superseded** — a later decision makes the item moot (e.g. an architecture change that removes the need for a workaround); record what superseded it.

No entry should ever simply disappear from this register. A future reader should always be able to see not just what is currently open, but what was once considered and what happened to it.

### 5.1 Workstream Closure Review Log

Per the closure-trigger rule above, every workstream closure logs an explicit outcome here — whether it added FCR entries or found none. This log is append-only; entries are never removed or overwritten, only added to.

| Workstream / Closure Event | Closure Card | Reviewed By | Date | Outcome |
|---|---|---|---|---|
| Workstream 2 — Traveller Stories | `EBC-R1.3-WS2-CLOSE-01-TIGER-Traveller-Stories-Workstream-Closure-Release-Tracker-Update.md` | Tiger | 06-Sep-2026 | Additions made (retrospective) — FCR-003, FCR-004, FCR-007, FCR-008, FCR-009, FCR-010, FCR-013, FCR-014, FCR-016 all originate from Workstream 2 closure-stage documents, captured in this register's initial population (§3). No separate contemporaneous log entry was made at the time, as this closure-log requirement did not yet exist; recorded here for completeness when the requirement was formalised. |
| Workstream 1 — Destination Intelligence Evolution (Governance Phase) | This register's own establishment, `EBC-R1.3-WS0-001`, and its repository-synchronisation follow-on | Tiger | 08-Sep-2026 | Additions made — FCR-001, FCR-002, FCR-005, FCR-006, FCR-011, FCR-012, FCR-015, FCR-017 all originate from Workstream 1 governance-phase documents, captured in this register's initial population (§3). This is also the first closure-log entry made under the formalised requirement itself, recorded at the point Workstream 1's Governance Phase is confirmed complete and the workstream transitions to Engineering Execution (see `RELEASE-1.3.md` §5). |
| Workstream 1 — Destination Intelligence Evolution (full closure — Governance + Engineering + QA) | `EBC-R1.3-WS1-011-TIGER-Repository-Documentation-Closure-Release-Tracker-Synchronisation` | Tiger | 08-Sep-2026 | Additions made — FCR-018 (`aliases` repository-layer gap), FCR-019 (`kbSectionRef` ratify-or-remove decision), FCR-020 (live Supabase reachability gap in the engineering/QA environment), sourced from `EBC-R1.3-WS1-009` and `EBC-R1.3-WS1-010`. Both items named in this closure's own EBC (`aliases`, `kbSectionRef`) confirmed not already present before adding; a third item (live-Supabase-reachability) also found explicitly named as deferred across four sessions and added on the same review, consistent with this register's completeness intent. |

| Documentation Reconciliation (not a new workstream closure — a reconciliation pass following the WS1-012 review) | `EBC-R1.3-WS1-012-TIGER-Repository-Artefact-Reconciliation-Documentation-Lineage-Review.md` (review); `EBC-R1.3-WS1-013` (implementation) | Tiger | 09-Sep-2026 | Addition made — FCR-021 (document that `TravellerStory.experience` has no reader anywhere in the application), the one new candidate `EBC-R1.3-WS1-012` identified beyond the register's existing 20 entries. Logged here for completeness even though this is a reconciliation activity rather than a workstream-closure trigger, consistent with this register's intent that no FCR-relevant review go unrecorded. |
| Workstream 11 — SMV Workspace (Product Baseline Closure — Product/Business-Analysis phase) | `EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md` (this review; closes out the `EBC-R1.3-WS3-002`–`WS3-CLOSURE` card sequence, including Arjun's own `WS3-CLOSURE` housekeeping, which had not itself logged this mandatory assessment) | Tiger | 13-Sep-2026 | **None identified** — reviewed, no new deferred Architecture/Engineering/Governance/QA/UX/Operations/Documentation item found beyond what is already correctly tracked as Product Open Questions (OQ-018–022) in the Specification/RTM's own register, which is the correct home for those per this register's own §1 scope statement. The one governance item this review did find (no workstream number assigned to `FEAT-R1.3-013`) was resolved directly within the same review — WS11 assigned in `RELEASE-1.3.md` §5 — rather than deferred, so no new FCR entry was needed. |

| Workstream 11 — SMV Workspace (UX Architecture Phase Closure) | `EBC-R1.3-WS4-002-TIGER-UX-Baseline-Tracker-Synchronisation.md` (this review; closes out `EBC-R1.3-WS4-001`, the Journey Workspace UX Architecture & Experience Discovery phase) | Tiger | 14-Sep-2026 | **Addition made** — FCR-022 (§3.3 UX): Low-Fidelity Wireframes, UX Standards and a standalone UX Review Document, named as Expected Deliverables in the Journey Workspace UX Design Brief §8 but explicitly deferred by `WORKSPACE-SCREEN-INVENTORY.md`'s own text to a future wireframing stage, not produced within this EBC's scope. No other deferred item found beyond what is already correctly tracked as Product Open Questions (OQ-018–022, the last surfaced during this UX phase) in the Specification/RTM's own register. |

Future rows follow the same pattern, including an explicit "None identified" outcome where applicable (e.g. `| Workstream N — <name> | <closure card> | <persona> | <date> | None identified — reviewed, no new deferred items named. |`).

---

## 6. Explicitly Out of Scope (confirmed)

Per this register's own establishing instruction (`EBC-R1.3-WS0-001`): release prioritisation, backlog refinement, engineering implementation, product redesign, architecture review, estimation, and release assignment. None of these were performed. No FCR entry above has been assigned a target release, a priority, or an effort estimate — every one is recorded exactly as its originating document left it, with reason-for-deferral and dependency stated, and nothing more.

This register also does not duplicate, re-open, or re-litigate any decision already ratified in its source documents (e.g. the `geoScope` matching strategy, the Consolidated Ownership Matrix, the Q1/Q2 taxonomy approvals) — only the items those same documents themselves left open or explicitly deferred are captured here.

---

## 7. Acceptance Criteria Mapping

- [x] The Future Considerations Register has been established.
- [x] All known deferred items from completed Release 1.3 governance reviews have been captured — 21 entries (§3) as of v1.4 (17 at initial v1.0 population; FCR-018–FCR-020 added at `EBC-R1.3-WS1-011` closure; FCR-021 added at this `EBC-R1.3-WS1-013` reconciliation), drawn from all completed Workstream 1 and Workstream 2 governance cards to date. Corrected as a cross-reference fix during `EBC-R1.3-WS1-013` — this line had not been updated when FCR-018–020 were added at v1.3.
- [x] Every entry includes traceability back to its originating EBC or ADR — §3 (per-entry) and §4 (consolidated matrix).
- [x] Governance rules for maintaining the register have been documented — §5.
- [x] No future release commitments have been made — confirmed, §6.
- [x] The register is suitable for use during Release 1.4 (or later) planning — structured, categorised, and cross-referenced for exactly that purpose (§1, §5).
- [x] Committed to the project repository as the authoritative, version-controlled home for this register (per the repository-synchronisation activity recorded in the Document Change History above), superseding the Claude Project copy as the canonical source per this project's stated principle that the Git repository is authoritative for approved project documentation.

---

## 8. Confirmations

- This document was produced by copying the ratified Claude Project content (`FCR-R1.3-001-TIGER-Future-Considerations-Register`, v1.0) verbatim into the repository, with only framing/header conventions added to match this repository's documentation standard (Document Information, Document Change History, §0.1 placement rationale) — no entry's identifier, description, originating citation, reason for deferral, dependency, or status was altered.
- Every entry in §3 is traced to a specific, already-completed governance document (see §4). No item was invented for this register.
- This register does not duplicate `RELEASE-1.3-BACKLOG.md`, `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, or the existing Release 1.2→1.3 backlog consolidation (`EBC-R1.2-WS6-04`) — see §1's explicit scope boundary.

---

*Prepared by Tiger, Programme and Delivery Lead, on behalf of Team Satvi. This register is the canonical, repository-held Future Considerations Register for Search My Vacation, to be maintained per §5 going forward and reviewed as a required input to every future release's delivery-planning workstream.*
