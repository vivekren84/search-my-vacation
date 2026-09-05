# Search My Vacation

# Release 1.3 Workstream Planning

---

## Document Information

| Item | Value |
|---|---|
| Release | 1.3 (active implementation release — Release 1.2 closed 02-Sep-2026 per `RELEASE-1.2.md` §18) |
| Status | Draft — for Product Owner review. No workstream, task, priority, estimate or scope is committed by this document. |
| Purpose | Convert `RELEASE-1.3-BACKLOG.md` (a carry-forward catalogue) into a delivery-oriented workstream and task decomposition, so that future EBCs and IMPs can reference stable workstream boundaries rather than re-deriving structure each time. |
| Product Owner | Vivek |
| Programme and Delivery Lead | Tiger |
| Source EBC | `EBC-R1.3-001` (Tiger, Release 1.3 Delivery Planning & Workstream Definition) |
| Companion Document | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` — remains the canonical catalogue of deferred decisions, candidate features, technical debt and product vision. This document does not replace, edit, renumber, or duplicate it; every task below carries a citation back to its source section there (or to `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, or to `RELEASE-1.2.md`'s closure record, where that is the true source). |
| Explicit Out of Scope | This document creates no implementation EBCs, no IMPs, no engineering estimates. It approves no Release 1.3 scope, assigns no priority beyond the three-tier classification Activity 5 asks for, marks nothing committed beyond what the backlog already records as committed (Google Ads Conversion Tag), changes no architecture, and authorises no implementation. |

---

## Document Change History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 04-Sep-2026 | Tiger | Initial creation, per `EBC-R1.3-001`. Reviews the complete Release 1.3 backlog (`RELEASE-1.3-BACKLOG.md` v1.10, `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, and `RELEASE-1.2.md`'s closure record §18), confirms the ten-workstream proposal from `EBC-R1.3-001` with two structural questions flagged for Product Owner decision, decomposes every workstream into product/UX/engineering/QA/traveller-validation tasks, cross-references every task to its backlog source, and recommends a three-tier scope classification (Commitment / Candidate / Future) for every task. Recommends this document as a permanent companion to `RELEASE-1.3-BACKLOG.md`, per `EBC-R1.3-001`'s own stated recommendation. |

---

## Purpose and How to Read This Document

`RELEASE-1.3-BACKLOG.md` answers *what has been approved, decided, or captured as vision*. This document answers a different question: *how would that work actually be organised into deliverable workstreams and tasks, if the Product Owner chose to open Release 1.3 planning today*. Nothing here is a commitment. The Suggested Release Grouping in `RELEASE-1.3-BACKLOG.md` §8 (Tier A / Tier B) already did a first pass at "ready vs. needs scoping" — this document goes one level deeper, turning each Tier A/B item into named tasks with an owner, a type (Product / Architecture / UX / Engineering / QA / Traveller Validation), and an explicit readiness note.

Three markers are used consistently below:

- **[READY]** — enough is already known (an approved decision, an existing architecture review, an existing UX spec, a root-caused engineering finding) that an EBC could be drafted without further discovery.
- **[NEEDS DISCOVERY]** — an Arjun-led requirements pass, an Archie-led architecture pass, or an explicit Product Owner decision is needed before an EBC could be meaningfully drafted.
- **[COMMITTED]** — already a Product Owner commitment per `RELEASE-1.3-BACKLOG.md`, not merely a candidate; still subject to the normal architecture/implementation review gate named there.

---

# Activity 1 — Backlog Review Findings

Reviewed in full: `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (v1.10, 348 lines, all 14 sections), `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` (94 lines), and `docs/10-Backlog/RELEASE-1.2.md` §15–§18 (the closure record, confirming Release 1.2 is now **closed** and Release 1.3 is the active release). Also reviewed: `docs/02-Product/PRODUCT-ROADMAP.md` (Milestone structure, for Authentication and long-horizon alignment) and the Claude Project's `ARCHIE-R1.3-WS3-01-Search-Ranking-Weighted-Model-Architecture-Review.md` (an architecture review already produced against a Release 1.3 backlog item, ahead of this planning card).

## 1.1 Duplication

None found that `RELEASE-1.3-BACKLOG.md` v1.9's own duplicate check (Document Change History, row 1.9, Activity 7) had not already caught. One near-duplicate pair is worth naming explicitly because it affects workstream shape, not because it is a defect: **Decision 9 / §2 (Google Ads Conversion Tag)** and **§3's separate "Journey Director CTA integration" row (WhatsApp + Journey Director)** are two distinct integrations sharing one integration point (Journey Passport completion, immediately before Journey Director/WhatsApp handoff) — not a duplicate, but a natural single task cluster. Decomposed together below (Workstream 5, Task 5.1).

## 1.2 Overlap

- **Decision 1 (region-level Destination Intelligence Evolution) and Decision 2 (Journey Intelligence Engine, minus its AI-execution half) overlap in their underlying data extension** — both need the same `geo_places` region/admin-hierarchy depth already partially designed in `EBC-R1.2-WS6-03`. `RELEASE-1.3-BACKLOG.md` §14 Recommendation 2 already says to treat these as one initiative for future EBC planning. Honoured below: Workstream 1 decomposes both under one initiative with named phases, rather than as two competing initiatives.
- **Destination Intelligence Model Phase 3/4 (§3 candidate) overlaps in subject matter, but is explicitly distinct in scope**, from Decision 1's broader vision — §3 itself already draws this line ("distinct from the broader Destination Intelligence Evolution vision item"). Phase 3/4 is Workstream 3's already-architected (`ADR-R1.2-WS3-001`, Accepted) weighted Primary/Secondary/Tertiary preference model, deferred at Phase 2. Kept as its own task within Workstream 1, not merged into the region-level vision item.
- **Section 7's AI Vision items overlap heavily with each other by the backlog's own admission** ("Consolidated against what already exists in the record, to avoid recording the same idea twice"). Decomposed below as a single AI-capability initiative split across Workstream 1 (destination-side: theme extraction, regional/seasonal recommendations) and Workstream 5 (recommendation-side: intent classification, traveller preference learning, AI-assisted recommendations), matching how the backlog's own table already splits "already exists in the record as" citations between destination knowledge documents and Journey Director/Passport documents.

## 1.3 Missing Decomposition

Every item in `RELEASE-1.3-BACKLOG.md` §4–§7 (Product/UX/Technical/AI Vision) is a single paragraph with no task breakdown — this is expected; those sections are explicitly vision, not scoped work, by the backlog document's own "Purpose and How to Read This Document." Activity 3 below performs the first decomposition pass for every one of them. Two items carry a backlog-recorded scoping dependency that this document preserves rather than resolves:

- **Authentication Roadmap** (Decision 7) — `RELEASE-1.3-BACKLOG.md` §14 Recommendation 4 already states a future Arjun-led review must confirm whether its five topics are one initiative or several, before Archie architects anything. Workstream 6 below is decomposed as a single product-discovery task, deliberately not pre-split into five, honouring that recommendation.
- **Region-level Destination Intelligence Evolution** — only 3 of the platform's served states (Karnataka, Tamil Nadu, Himachal Pradesh) have illustrative regional treatment approved; the remaining served states (Kerala, Rajasthan, "and others") have none yet. Workstream 1 decomposes this as a phased, state-by-state initiative rather than one monolithic task, to avoid hiding this scope gap inside a single line item.

## 1.4 Implementation Readiness

Reviewed against three tiers — see the markers defined above. Headline findings, expanded per-task in Activity 3:

- **Most execution-ready single item in the entire backlog:** Destination Ranking Refinement (`OBS-R1.3-WS3-01`) already has a complete architecture proposal (`ARCHIE-R1.3-WS3-01`, Claude Project) — root cause confirmed against the live function body, a proposed three-tier scoring model, verified against every named acceptance case, a stated migration approach, and a risk assessment. It needs only Arjun/Tiger sign-off on two named open questions (place-type weight ladder; whether alias-exact and name-exact merge into one tier) before it is an approved Rad implementation card.
- **Readiest cluster:** the nine Engineering Technical Debt items (`TD-R1.3-001`–`009`) are all already root-caused by WS5 Engineering Review 1 — each has a confirmed defect mechanism and a named source observation. No further discovery needed; only sequencing and estimation (both explicitly out of this card's scope).
- **Readiest UX cluster:** the nine Section 10 UX Improvements are all sourced from completed WS5/WS6 reviews with existing UX specifications (`EBC-R1.2-WS6-05`) or existing engineering-review evidence — ready for EBC drafting without further product discovery, though two (Journey Passport Completion Experience; Cross-Step Intent Synchronization) are explicitly evaluation-only and may resolve to "no change" rather than an implementation.
- **Least ready:** Authentication Roadmap (needs an Arjun scoping split first) and the six Governance Playbooks (each explicitly contingent on a feature that is not yet planned — per `RELEASE-1.3-GOVERNANCE-BACKLOG.md` §3's own instruction not to write a playbook ahead of its feature).

---

# Activity 2 — Release 1.3 Workstreams

The ten workstreams proposed in `EBC-R1.3-001` are confirmed against the evidence above, with two structural questions flagged for Product Owner decision rather than resolved unilaterally (Tiger may recommend sequencing and grouping; only the Product Owner approves workstream structure, per Project Instructions §10/§14).

| # | Workstream | Confirmed? | Note |
|---|---|---|---|
| WS1 | Destination Intelligence Evolution | Confirmed | Largest and most strategic workstream; genuinely multi-phase, see Activity 3. |
| WS2 | Traveller Stories | Confirmed, but thin | Currently exactly one backlog item (Traveller Stories Quality Gate). See Decision Point D1 below. |
| WS3 | Premium Homepage Experience | Confirmed | Absorbs the four Homepage Improvements items plus Custom Background Music and Traveller Inspiration. |
| WS4 | Journey Passport Evolution | Confirmed | Largest single cluster of ready UX/engineering items (9 UX items + Passport-specific technical debt). |
| WS5 | Journey Director Evolution | Confirmed | Absorbs the Journey Director CTA/WhatsApp integration, Itinerary Builder, Journey Director recovery messaging, and the recommendation-side half of AI Vision. |
| WS6 | Authentication & User Accounts | Confirmed, needs discovery | No task below this workstream is engineering-ready; first task is product discovery, per backlog Recommendation 4. |
| WS7 | Marketing & Analytics | Confirmed, but thin | Currently exactly one backlog item (Google Ads Conversion Tag), which also touches WS4/WS5 at its integration point. See Decision Point D1 below. |
| WS8 | Search Behaviour | Confirmed | Smallest and most execution-ready workstream — one item already has a complete architecture review pending sign-off. |
| WS9 | Engineering Technical Debt | Confirmed | Absorbs `TD-R1.3-001`–`009`, Legacy Passport Reference Cleanup, the orphaned `Experiences.tsx` cleanup, and Release-1.2-closure documentation housekeeping now unblocked by Release 1.2's closure. |
| WS10 | Platform & Design System | Confirmed | Absorbs Design Token Reconciliation and the six Governance Playbooks (operational/platform readiness, not product features). |

## Decision Point D1 — Workstream 2 and Workstream 7 are currently thin

Workstream 2 (Traveller Stories) and Workstream 7 (Marketing & Analytics) each currently contain exactly one Release 1.3 backlog item. Both are real, named workstreams in the Product Owner's own initial proposal and may simply be early — Arjun-led product discovery during Release 1.3 could grow either one. Tiger's recommendation, offered for Product Owner decision rather than assumed: **keep both as named workstreams for now** (a thin workstream is not a defect, and folding them into WS3/WS5 respectively would bury a Marketing-specific and a Traveller-Stories-specific concern inside larger, differently-scoped workstreams), but flag both explicitly for the Product Owner as candidates for a short Arjun discovery pass early in Release 1.3, specifically to confirm whether more belongs in either before delivery sequencing is finalised.

---

# Activity 3 — Workstream Decomposition

## Workstream 1 — Destination Intelligence Evolution

**Objective.** Evolve Search My Vacation's destination model from state-level entries to region-level destination intelligence, and extend the destination-intelligence engine's recommendation behaviour and AI-assisted enrichment, without ever exposing the underlying grouping mechanism to travellers.

**Implementation Areas.** `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`; `geo_places` schema and its region/admin-hierarchy depth; Journey Director's weighted Primary/Secondary/Tertiary preference model (`ADR-R1.2-WS3-001`); the `deriveIntentSignalsFromText` extension point (`EBC-R1.2-WS6-03` Addendum 01 §3).

**Governing constraint (applies to every task below, not a task itself):** Journey Clusters are an internal construct and must never be exposed in traveller-facing UI, in name or in concept (`RELEASE-1.3-BACKLOG.md` §1 Decision 2a, §4). Any UX or copy review of Tasks 1.3/1.4 must explicitly check for this before scoping is considered complete.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 1.1 | Region-level destination intelligence — Phase A: Karnataka, Tamil Nadu, Himachal Pradesh (illustrative regional treatment already approved for planning) | Product + Engineering | Arjun (mapping) / Rad (implementation) | §1 Decision 1, §4 | NEEDS DISCOVERY — approved as direction; no per-region content plan yet beyond illustrative examples |
| 1.2 | Region-level destination intelligence — Phase B: Kerala, Rajasthan, and remaining served states | Product + Engineering | Arjun / Rad | §1 Decision 1, §4 | NEEDS DISCOVERY — no illustrative treatment approved yet for these states; genuinely later phase |
| 1.3 | Journey Intelligence Engine — Journey Clusters & Companion Destinations product discovery | Product + Architecture | Arjun / Archie | §1 Decision 2, §4 | NEEDS DISCOVERY |
| 1.4 | Journey Intelligence Engine — Journey Feasibility Intelligence & Regional Journey Recommendations product discovery | Product + Architecture | Arjun / Archie | §1 Decision 2, §4 | NEEDS DISCOVERY — reasonably a later phase than 1.3 |
| 1.5 | Destination Intelligence Model Phase 3 (Runtime Alignment) implementation | Engineering + Architecture approval | Rad (implementation) / Archie (required architecture review before start) | §3 candidate | READY — architecture already Accepted (`ADR-R1.2-WS3-001`); Phase 3 itself was explicitly deferred, not started; needs Archie's explicit go-ahead per the backlog's own prerequisite, not fresh discovery |
| 1.6 | Destination Intelligence Model Phase 4 (Recommendation Behaviour) implementation | Engineering + Architecture approval | Rad / Archie | §3 candidate | READY, contingent on 1.5 completing first (sequential phases) |
| 1.7 | AI enrichment of "Describe your ideal getaway" free text (theme/intent extraction) | Engineering | Rad | §1 Decision 4, §3 candidate, §7 | READY — already architecturally scoped and confirmed zero-migration-compatible (`EBC-R1.2-WS6-03` Addendum 01 §3) |
| 1.8 | Seasonal recommendation engine (destination-side half of the Seasonal Favourites / Traveller Inspiration capability — see Workstream 3, Task 3.6, for the traveller-facing surface) | Product + Engineering | Arjun / Rad | §1 Decision 3, §7 | NEEDS DISCOVERY |

## Workstream 2 — Traveller Stories

**Objective.** Ensure every Traveller Story (testimonial) rendered to travellers is complete and meaningful; never render an empty or partial card.

**Implementation Areas.** Testimonial data source and the homepage/traveller-stories rendering component.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 2.1 | Traveller Stories Quality Gate — hide incomplete testimonials; never render an empty testimonial card; skip incomplete records gracefully | Engineering + QA | Not yet assigned (Rad, by pattern) | §1 Decision 5, §3 candidate | READY — concrete, unambiguous acceptance criteria already recorded verbatim in the backlog |

## Workstream 3 — Premium Homepage Experience

**Objective.** Close the four confirmed, non-blocking Homepage Architecture Validation Review findings, evaluate homepage ambient music, and give the Traveller Inspiration vision its first UX pass.

**Implementation Areas.** `Header` component and its responsive breakpoints; Trust Strip section; Contact Preview section; the orphaned `web/components/sections/Experiences/` component; homepage audio; a possible future `EditorialCardGrid`-based inspiration surface.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 3.1 | Header tablet-range CTA breakpoint — move the persistent nav/CTA breakpoint from `xl` (1280px) to `lg` (1024px) so the full tablet range regains one-tap access | UX + Engineering | Sophie (design) / Rad (implementation) | §11, `OPEN-R1.2-007` | READY — finding, root cause and fix already fully specified |
| 3.2 | Trust Points icon treatment & imagery — Product/Design decision (proper icon set vs. photography vs. deliberate text-only), then implementation | Product + UX decision, then Engineering | Sophie (design) / Arjun+Vivek (photography direction decision) | §11, `OPEN-R1.2-008` | NEEDS DISCOVERY for the decision itself; implementation is small once decided |
| 3.3 | Contact Preview CTA routing — decide whether the CTA should also/instead link to `/contact`, then implement | Product decision, then Engineering | Arjun (routing decision) / Rad (implementation) | §11, `OPEN-R1.2-009` | READY — small, well-bounded decision |
| 3.4 | Remove the orphaned, unused `Experiences.tsx`/`ExperienceCard.tsx` component (not imported anywhere; live `/experiences` route uses `EditorialCardGrid`) | Engineering | Rad | §11; cross-referenced under Workstream 9 | READY — legacy cleanup, no product decision needed |
| 3.5 | Custom Background Music — evaluate tasteful ambient homepage music; investigate internally-generated (e.g. Suno) composition only, no third-party copyrighted music; must support autoplay policies; fully optional with an easy, visible mute/pause control | Product + UX evaluation | Not yet assigned | §1 Decision 6, §3 candidate, §5 | NEEDS DISCOVERY — investigation only, no implementation authorised by the backlog |
| 3.6 | Traveller Inspiration surface — Seasonal Favourites, inspiration-based discovery, guided suggestions; UX wording not finalised. `EditorialCardGrid`/`EditorialCardItem` noted as a precedent worth considering, not a decision | Product + UX | Sophie / Arjun | §1 Decision 3, §4, §5 | NEEDS DISCOVERY — depends on Workstream 1 Task 1.8's seasonal engine for full realisation, though a first UX pass could proceed independently |

## Workstream 4 — Journey Passport Evolution

**Objective.** Close the traveller-facing recovery, continuity and polish gaps identified during WS5/WS6 Engineering Review and Product Owner exploratory validation, without weakening the OTP-gates-recommendations-and-lead-creation security guardrail.

**Implementation Areas.** `JourneyPassport.tsx` and its wizard steps; the OTP sub-flow; `Preferred Destinations`/`Describe your ideal getaway` fields; the Passport-stamp/closure screen; the Companion selection step. Journey-Passport-specific engineering technical debt (`TD-R1.3-001`, `-003`, `-005`, `-006`, `-007`, `-009`, and the Passport-route portion of `-008`) is tracked once, under Workstream 9, to avoid duplicating the same item in two workstreams — cross-referenced here, not repeated.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 4.1 | Journey Passport Recovery Experience — eliminate the retry dead-end after successful OTP verification but unsuccessful lead creation; surface "Resend code" as the working recovery action | UX + Engineering | Sophie / Rad | §10, `OBS-7-01` | READY |
| 4.2 | OTP Response Recovery — when the first successful "send code" response is lost in transit, give the traveller a clear path (surfacing "Change number") rather than landing them unable to verify with no guidance | UX + Engineering | Sophie / Rad | §10, `OBS-9-02` | READY |
| 4.3 | Journey Passport Cross-Step Intent Synchronization — reflect earlier-step traveller intent (Mood, Dream Journey) meaningfully in later steps (Pace & Timing, Recommended Experiences), without automatically overriding traveller choices | UX + Product + Engineering | Sophie / Arjun / Rad | §10 | READY for scoping — explicitly not a defect; evaluation of *how much* personalisation to add is the open question, not *whether* |
| 4.4 | Pending-Chip Experience for carried-forward destinations — replace the plain-text landing with the designed "pending suggestion chip" inside Preferred Destinations, with inline Keep/Not quite actions | UX + Engineering | Sophie / Rad | §10 (originally `EBC-R1.2-WS6-05` §4.4) | READY — full design already exists, deferred only for time |
| 4.5 | Auto-Growing Textarea for Describe Your Ideal Getaway — expand toward ~8 rows before scrolling, rather than a fixed row count | UX + Engineering | Sophie / Rad | §10 (originally `EBC-R1.2-WS6-05` §5.3) | READY |
| 4.6 | Near-Limit Character Counter for Describe Your Ideal Getaway — show a counter only once the traveller is within ~20% of the 500-character limit | UX + Engineering | Sophie / Rad | §10 (originally `EBC-R1.2-WS6-05` §5.3) | READY |
| 4.7 | Journey Passport Completion Experience — evaluate separating the Passport-stamp emotional milestone from OTP verification's security milestone; **OTP remains mandatory before recommendations and lead creation regardless of outcome** | UX evaluation + Architecture (security-boundary confirmation) | Sophie / Archie / Rad | §10 | NEEDS DISCOVERY — explicitly an evaluation, not yet a committed direction |
| 4.8 | Journey Passport Companion Card visual selection consistency — fix the cosmetic border-highlight retention on an unselected card after another is selected | Engineering | Sophie (visual spec) / Rad (fix) | §10 (`EBC-R1.2-WS8-05`, production smoke test) | READY — low severity, cosmetic only, no data or selection-state impact |
| 4.9 | Destination entry mode toggle (`destinationMode` "known"/"discovery") — settle its future now that both destination fields are independently optional | UX | Sophie | §5 (originally `EBC-R1.2-WS6-03` Addendum 01) | NEEDS DISCOVERY — an open interaction-design question, not yet scoped as a Release 1.3 item in its own right |

## Workstream 5 — Journey Director Evolution

**Objective.** Extend Journey Director's completion flow with the CTA integrations already directed by the Product Owner, close its recovery-messaging gap, and scope its future AI-assisted recommendation layer on the recommendation side of the model.

**Implementation Areas.** Journey Director's completion state and CTA row; `sessionStorage` passport-handoff mechanism; the Lovable AI itinerary-builder investigation; the recommendation engine's scoring/eligibility boundary (must remain downstream of deterministic eligibility, scoring and evidence per `JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md` §12.3).

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 5.1 | Journey Director CTA integration — WhatsApp deep-link + Journey Director completion-state integration at Journey Passport completion. **Shares one integration point with Workstream 7's Task 7.1 (Google Ads Conversion Tag)** — `RELEASE-1.3-BACKLOG.md` §14 Recommendation 1 already directs that both be routed into architecture review together, not sequenced separately | Architecture + Engineering | Archie (integration architecture) / Rad (implementation) | §1 Decision 9, §3 candidate, §6 | READY — builds directly on an already-shipped pattern (`EBC-039`'s WhatsApp-in-new-tab fix) |
| 5.2 | Journey Director Recovery Messaging — restore the accurate "your possibilities need a little more care" message on a reload-during-recovery, instead of the generic "no completed travel story" message, by writing a minimal passport-only `sessionStorage` entry at arrival | UX + Engineering | Sophie / Rad | §10, `OBS-8-01` | READY — root cause and a candidate fix direction already recorded |
| 5.3 | Itinerary Builder — investigate integrating the existing Lovable AI itinerary builder as a possible technical path toward the already-approved future "Journey Builder" concept (`JOURNEY-PASSPORT-v1.0.md` §12.5) | Architecture investigation | Archie | §1 Decision 8, §6 | NEEDS DISCOVERY — investigation only, no technical decision made |
| 5.4 | AI capability initiative, recommendation-side — intent classification, traveller preference learning, AI-assisted destination recommendations, always downstream of deterministic eligibility/scoring/evidence | Product + Architecture | Arjun / Archie | §1 Decision 10, §7 | NEEDS DISCOVERY |
| 5.5 | Cross-reference: Destination Intelligence Model Phase 3/4 (Workstream 1, Tasks 1.5–1.6) changes Journey Director's runtime recommendation behaviour directly — Workstream 5 should be consulted during that implementation even though Workstream 1 owns it | Coordination note | Tiger (sequencing) | §3 candidate | N/A — tracking note, not an independent task |

## Workstream 6 — Authentication & User Accounts

**Objective.** Determine what, if anything, of the five named authentication topics should actually be scoped for Release 1.3, before any architecture work begins.

**Implementation Areas.** None yet committed. `PRODUCT-ROADMAP.md` Milestone 2 already names customer-facing authentication (Register, Login, Customer Profile) as a longer-horizon item, separate in that document's own structure from operational/internal tooling.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 6.1 | Authentication Roadmap scoping — confirm whether Internal Team Login, Customer Registration, Customer Login, Permissions, and Administration are one initiative or several, and which (if any) belong in Release 1.3 vs. a later milestone, before any architecture task is opened | Product discovery | Arjun | §1 Decision 7, §6 | NEEDS DISCOVERY — deliberately the single task for this workstream, per `RELEASE-1.3-BACKLOG.md` §14 Recommendation 4 |

## Workstream 7 — Marketing & Analytics

**Objective.** Deliver the Product Owner's committed Google Ads Conversion Tag integration.

**Implementation Areas.** Journey Passport completion flow (integration point only — implementation ownership is Workstream 5/Archie's architecture review, since the point of integration is Journey Director's completion state, shared with Task 5.1).

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 7.1 | Google Ads Conversion Tag integration, at the successful completion of the Journey Passport flow, immediately before the traveller transitions to Journey Director or WhatsApp | Architecture + Engineering | Archie (architecture/implementation review) / Rad (implementation) | §1 Decision 9, §2, §3 candidate, §6 | **COMMITTED** — a named Release 1.3 feature per the Product Owner's explicit 23-Aug-2026 direction, subject to the normal architecture/implementation review gate; deferrable only via an approved Tiger EBC, not by default |

## Workstream 8 — Search Behaviour

**Objective.** Resolve the two destination-search ranking observations carried forward from Release 1.2 Workstream 3's closure.

**Implementation Areas.** `search_geo_places()` (Supabase function, `supabase/migrations/20260823150000_geo_places_geo_aliases.sql`); `web/lib/geo-validation/repository.ts`.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 8.1 | Destination Ranking Refinement — resolve administrative-division names (e.g. "Bangalore Urban District") outranking the city travellers actually mean (e.g. Bengaluru, reachable only via its alias) for ambiguous or globally-common search terms | Architecture (complete) + Engineering | Archie (review complete, `ARCHIE-R1.3-WS3-01`) / Rad (implementation, pending sign-off) | §12, `OBS-R1.3-WS3-01` | **READY** — a full architecture proposal already exists (three-tier composite scoring model, verified against every named acceptance case, migration approach and risk assessment stated); needs only Arjun/Tiger sign-off on two named open questions (place-type weight ladder; whether alias-exact and name-exact merge into one tier) before it is an approved Rad implementation card |
| 8.2 | Country-Level Search Behaviour — a search for "India" returns textual place-name matches before the country-level result itself; root cause (ranking factor vs. dataset completeness) not yet confirmed | Architecture + Engineering | Archie (root-cause confirmation) / Rad (implementation) | §12, `OBS-R1.3-WS3-02` | NEEDS DISCOVERY — Archie must confirm the cause before this can be scoped as precisely as Task 8.1; likely benefits from the same architecture pass since both touch `search_geo_places()` |

## Workstream 9 — Engineering Technical Debt

**Objective.** Close the nine root-caused engineering technical debt items from WS5 Engineering Review 1, plus legacy cleanup and the documentation housekeeping now unblocked by Release 1.2's closure. All nine `TD-R1.3` items are Journey-Passport/OTP-specific in subject matter (see Workstream 4's note); they are tracked once, here, to avoid duplication, per Activity 1's own duplication check.

**Implementation Areas.** `JourneyPassport.tsx` and its OTP sub-flow; `journey-leads/validation.ts`; the OTP provider service layer; `otp/send`, `otp/verify`, `leads` API routes; Journey Director's recommendation-engine failure path; the orphaned `Experiences.tsx` component; `RELEASE-1.3-BACKLOG.md`'s own two open citation instances; `RELEASE-1.2.md`'s Workstream 5 task table.

| Task | Description | Priority (as recorded) | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 9.1 | `TD-R1.3-001` — Refactor Journey Passport into modular components (extract wizard navigation, closure-screen animation, contact-details sub-form, and the OTP sub-flow into dedicated components/hooks) | High | Rad | §9 | READY |
| 9.2 | `TD-R1.3-002` — Automated regression suite for Journey Passport & OTP (no `verify:*` script currently covers the OTP module or entry-stage validators) | High | Rad | §9 | READY |
| 9.3 | `TD-R1.3-003` — Centralize mobile number normalization (three duplicated implementations; `normalizeJourneyMobile` already exists and should be reused) | Medium | Rad | §9 | READY |
| 9.4 | `TD-R1.3-004` — Improve OTP provider error classification (differentiate configuration, runtime, timeout and provider-rejection failure modes, client- and service-layer) | Medium | Rad | §9 | READY |
| 9.5 | `TD-R1.3-005` — Standardize Journey Passport validation rules (traveller-name check differs between the wizard and the closure-screen re-entry point) | Low | Rad | §9 | READY |
| 9.6 | `TD-R1.3-006` — Document canonical mobile number representation (E.164) as a concise engineering reference | Medium | Rad | §9 | READY |
| 9.7 | `TD-R1.3-007` — Persistent, database-backed, mobile-number-keyed OTP rate limiting (replacing the current in-memory, IP-only, per-process limiter); close the resend-cap gap on terminal `exhausted`/`expired` states; align with WS5 Architecture Review §6.5's three-layer defence model | High | Rad (Archie alignment already recorded) | §9 | READY |
| 9.8 | `TD-R1.3-008` — Improve WS5 production observability: Journey Director recommendation-failure logging is production-gated to zero output; `otp/send`, `otp/verify` and `leads` each discard the causal error object before logging, in every environment | High | Rad | §9 | READY |
| 9.9 | `TD-R1.3-009` — Strengthen OTP endpoint validation & abuse protection (no server-side bare-10-digit/India-format pre-gate if endpoints are called directly, bypassing client validation) | Medium | Rad | §9 | READY |
| 9.10 | Legacy Passport Reference Cleanup — clean up the legacy passport-reference format identified during Workstream 4 (Release 1.2) technical discovery | Not yet prioritised | Rad | §3 candidate, §6 | READY — already explicitly approved and labelled "Release 1.3 / Backlog" (`IPP-R1.2-WS4-001` §4.2, IMP-009) |
| 9.11 | Remove the orphaned, unused `Experiences.tsx`/`ExperienceCard.tsx` component | Low | Rad | §11 (cross-referenced from Workstream 3, Task 3.4) | READY |
| 9.12 | Documentation housekeeping — correct the two remaining fabricated-citation instances (`RISK-R1.2-014`/`015`): one in `RELEASE-1.3-BACKLOG.md` itself, one in `docs/09-Development/EBC-R1.2-GOV-001-STATUS-RECONCILIATION.md` | Non-blocking | Tiger | `RELEASE-1.2.md` §18.4/§18.10 | READY — Release 1.2 closure item, now unblocked; not new Release 1.3 scope in the product/engineering sense |
| 9.13 | Documentation housekeeping — produce the dedicated Workstream 7 retrospective/Lessons-Learned document (distinct from `RELEASE-1.2.md` §18.8's summary) | Non-blocking | Tiger | `RELEASE-1.2.md` §18.9, items `07.02`/`07.03` | READY — Release 1.2 closure follow-up, not Release 1.3 product scope |
| 9.14 | Documentation housekeeping — reconcile `RELEASE-1.2-BACKLOG.md` (the historical pre-execution planning roadmap) against what Release 1.2 actually delivered | Non-blocking | Tiger | `RELEASE-1.2.md` §18.9, item `07.04` | READY — Release 1.2 closure follow-up |
| 9.15 | Documentation housekeeping — reconcile `RELEASE-1.2.md` §6.5's Workstream 5 task table (35 rows, only 3 flipped to Complete) against Workstream 5's own "Complete — Product Owner Accepted" header status, mirroring the Workstream 4 precedent (§16–§17) | Non-blocking | Tiger | `RELEASE-1.2.md` §18.8, §18.10 residual gap 1 | READY |
| 9.16 | Documentation housekeeping — the `RELEASE-1.2.md`/`RELEASE-1.2-BACKLOG.md` naming/consolidation task, deliberately deferred by the Product Owner until Release 1.2 closed. **Release 1.2 is now closed** (`RELEASE-1.2.md` §18.7) — this item is now unblocked and ready to schedule | Non-blocking | Tiger | `RELEASE-1.3-BACKLOG.md` §13.1 | READY — explicitly named as blocked-until-closure; the blocking condition no longer holds |

**Note on Tasks 9.12–9.16:** these five are Release 1.2 closure housekeeping, not Release 1.3 product or engineering scope in the sense the rest of this document uses the term. They are included here so that nothing named in the evidence trail is lost (per Activity 4), and because Workstream 9 (Engineering Technical Debt) is this project's established home for exactly this kind of documentation-hygiene item — not because the Product Owner has asked for them to be scheduled inside Release 1.3 delivery.

## Workstream 10 — Platform & Design System

**Objective.** Reconcile design-system inconsistencies, and hold the governance playbooks that should be written once (and only once) their corresponding feature is actually planned.

**Implementation Areas.** Design tokens (Sophie/Archie's shared ownership); `docs/30-Governance/External-Integration-Definition-of-Done.md`; `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`.

| Task | Description | Type | Owner | Backlog Reference | Readiness |
|---|---|---|---|---|---|
| 10.1 | Design Token Reconciliation — reconcile design tokens surfaced as inconsistent during Workstream 4 (Release 1.2) review | UX + Engineering | Sophie / Archie | §3 candidate, §6 | READY — already explicitly approved and labelled "Release 1.3 / Backlog" (`IPP-R1.2-WS4-001` §4.2, IMP-008) |
| 10.2 | Payment Gateway Playbook — merchant onboarding/KYC, PCI-DSS scope, webhook verification, refund flow, sandbox-to-production transition | Governance | Archie / Vivek / Rad | Governance Backlog §2.1 | FUTURE — no payment feature is currently planned for Release 1.3; write only once one is |
| 10.3 | Email Provider Playbook — consolidate existing Resend operational knowledge (SPF/DKIM/DMARC, deliverability, template conventions) into a standalone runbook | Governance | Rad / Tiger | Governance Backlog §2.2 | READY — the provider is already live; this is documentation consolidation, not new-integration risk |
| 10.4 | WhatsApp Provider Playbook — if a formal WhatsApp Business API integration is pursued (beyond today's WhatsApp-deep-link pattern used by Workstream 5, Task 5.1) | Governance | Arjun / Archie / Vivek | Governance Backlog §2.3 | FUTURE — contingent on Workstream 5's WhatsApp integration growing beyond the existing deep-link pattern |
| 10.5 | OAuth Provider Playbook — if third-party sign-in is introduced | Governance | Archie / Rad | Governance Backlog §2.4 | FUTURE — contingent on Workstream 6 scoping a sign-in feature |
| 10.6 | Maps API Playbook — if a maps/geocoding provider is integrated | Governance | Archie / Rad | Governance Backlog §2.5 | FUTURE — contingent on a Workstream 1 destination-visualisation feature requiring one |
| 10.7 | Third-Party Service Operational Standards — add an explicit reference to the External Integration Definition of Done in the standard EBC template for any new-provider proposal | Governance | Tiger | Governance Backlog §2.6 | READY — low effort; the two underlying documents already exist, only the EBC-template cross-reference is missing |

---

# Activity 4 — Backlog Coverage Verification

Every section of `RELEASE-1.3-BACKLOG.md` and `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, and every non-blocking residual item named in `RELEASE-1.2.md`'s closure record (§18), is accounted for in Activity 3 above. This table is the traceability check Activity 4 asks for — confirming nothing is lost, not repeating each item's full task-level detail (already given per-task above).

| Source Section | Content | Decomposed Into |
|---|---|---|
| `RELEASE-1.3-BACKLOG.md` §1, Decisions 1–2, 2a | Destination Intelligence Evolution, Journey Intelligence Engine, Journey Clusters constraint | Workstream 1, Tasks 1.1–1.4 (constraint applied as a governing note) |
| §1, Decision 3 | Traveller Inspiration | Workstream 3, Task 3.6 (traveller-facing surface); Workstream 1, Task 1.8 (engine) |
| §1, Decision 4 | Structured + Unstructured Destination Intent | Already implemented (Workstream 6, Release 1.2) — recorded for completeness only; its AI-enrichment opportunity is Workstream 1, Task 1.7 |
| §1, Decision 5 | Traveller Stories Quality Gate | Workstream 2, Task 2.1 |
| §1, Decision 6 | Custom Background Music | Workstream 3, Task 3.5 |
| §1, Decision 7 | Authentication Roadmap | Workstream 6, Task 6.1 |
| §1, Decision 8 | Itinerary Builder | Workstream 5, Task 5.3 |
| §1, Decision 9 / §2 | Google Ads Conversion Tag; Journey Director CTA | Workstream 7, Task 7.1 (Google Ads); Workstream 5, Task 5.1 (WhatsApp/Journey Director CTA) |
| §1, Decision 10 / §7 | Future AI Roadmap | Workstream 1, Task 1.8 / Task 1.7 (destination-side); Workstream 5, Task 5.4 (recommendation-side) |
| §3 | R1.3 Candidate Features | Each row already cross-referenced individually in its owning workstream's task table above |
| §4 | Product Vision Items | Workstream 1 (destination items), Workstream 3 (Traveller Inspiration) |
| §5 | UX Vision Items | Workstream 3 (Traveller Inspiration, music), Workstream 1 (Journey Cluster presentation, folded into Task 1.3/1.4's discovery scope), Workstream 4 (destination entry mode toggle, Task 4.9) |
| §6 | Technical Vision Items | Workstream 6 (Authentication), Workstream 5 (Itinerary Builder, Journey Director CTA technical shape), Workstream 9/10 (Design Token Reconciliation, Legacy Passport Cleanup) |
| §7 | AI Vision Items | Workstream 1, Task 1.7/1.8; Workstream 5, Task 5.4 |
| §8 | Suggested Release Grouping (Tier A/B) | Superseded in granularity by this document's per-task classification (Activity 5) — not contradicted; every Tier A item classified Candidate or Committed below, every Tier B item classified Future or Needs Discovery |
| §9 | Engineering Technical Debt (`TD-R1.3-001`–`009`) | Workstream 9, Tasks 9.1–9.9 |
| §10 | UX Improvements | Workstream 4, Tasks 4.1–4.9 (Journey Passport items); Workstream 5, Task 5.2 (Journey Director Recovery Messaging) |
| §11 | Homepage Improvements | Workstream 3, Tasks 3.1–3.4 |
| §12 | WS3 Search Behaviour Observations | Workstream 8, Tasks 8.1–8.2 |
| §13 | Governance Notes | §13.1 → Workstream 9, Task 9.16; §13.2 → no task (canonical-location note only); §13.3 → `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, decomposed into Workstream 10, Tasks 10.2–10.7; §13.4 → deliberately not duplicated here, remains tracked at its source in `RELEASE-1.2.md`'s own Workstream 3 Deferred Items Register, per that section's own instruction |
| §14 | Recommendations | Recommendation 1 → honoured in Workstream 5/7's shared-integration-point note; Recommendation 2 → honoured in Workstream 1's overlap note (Activity 1.2); Recommendation 3 → honoured, Task 1.7 is scoped ahead of the broader vision items; Recommendation 4 → honoured, Workstream 6 Task 6.1; Recommendations 5–7 → superseded by this document's own Activity 5/6, per this EBC's purpose |
| `RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.1–2.6 | Six governance playbooks | Workstream 10, Tasks 10.2–10.7 |
| `RELEASE-1.2.md` §18.9, items `07.02`–`07.04` | Release 1.2 closure documentation follow-ups | Workstream 9, Tasks 9.13–9.14 |
| `RELEASE-1.2.md` §18.10, residual gaps 1 and 4 | WS5 task-table reconciliation; `RISK-R1.2-014`/`015` citations | Workstream 9, Tasks 9.15, 9.12 |

**Confirmation:** every decision, candidate feature, vision item, technical-debt item, UX improvement, homepage finding, search-behaviour observation, governance-note action item, governance-playbook recommendation, and disclosed Release 1.2 closure residual has a home in exactly one workstream above (cross-references noted, not duplicated as independent tasks). Nothing reviewed in Activity 1 is missing from Activity 3.

---

# Activity 5 — Scope Classification Recommendation

Per task, not per workstream — a workstream can (and here, mostly does) contain a mix. This is Tiger's recommendation only; no task below is committed by this document. "Release 1.3 Commitment" is used only where the backlog itself already records a Product Owner commitment (Task 7.1); every other READY task is recommended as a **Candidate**, not a commitment, because readiness is a precondition for scoping, not a substitute for the Product Owner's own sequencing decision.

## Release 1.3 Commitment

| Task | Why |
|---|---|
| 7.1 Google Ads Conversion Tag integration | Explicit, dated Product Owner direction (`RELEASE-1.3-BACKLOG.md` §2); remains a commitment unless a Tiger EBC recommending deferral is approved |

## Release 1.3 Candidates (recommended — small, concrete, and either READY or one short discovery step from it)

Workstream 2 (Task 2.1); Workstream 3 (Tasks 3.1, 3.3, 3.4); Workstream 4 (Tasks 4.1, 4.2, 4.4, 4.5, 4.6, 4.8); Workstream 5 (Tasks 5.1, 5.2); Workstream 8 (Tasks 8.1, 8.2); Workstream 9 (Tasks 9.1–9.11); Workstream 10 (Tasks 10.1, 10.3, 10.7).

Two READY items are recommended as Candidates with an explicit gate rather than unconditionally, because their own backlog entry names a precondition: Task 1.5/1.6 (Destination Intelligence Model Phase 3/4) requires Archie's explicit go-ahead before implementation begins, even though architecture is already Accepted; Task 4.7 (Journey Passport Completion Experience) and Task 4.3 (Cross-Step Intent Synchronization) are evaluation tasks that may resolve to "no implementation" rather than a build.

## Needs one further step before it can be classified as a Candidate

Task 3.2 (Trust Points icon/imagery — needs the Product/Design decision named in its own row first); Task 4.9 (destination entry mode toggle — an open interaction-design question, not yet even a named Release 1.3 item); Task 8.2 (Country-Level Search Behaviour — needs Archie's root-cause confirmation first); Task 9.12–9.16 (Release 1.2 closure housekeeping — readiness is not in question, but whether these belong inside Release 1.3 delivery sequencing or run alongside it as pure housekeeping is a Product Owner call, not assumed here).

## Future / Release 2.0 (recommended — needs discovery, is explicitly investigation-only in the backlog, or is contingent on a feature not yet planned)

Workstream 1 (Tasks 1.1–1.4, 1.8); Workstream 3 (Tasks 3.5, 3.6); Workstream 5 (Tasks 5.3, 5.4); Workstream 6 (Task 6.1 — discovery itself could run in Release 1.3, but any resulting build is very unlikely to fit inside it, per `PRODUCT-ROADMAP.md`'s own longer-horizon placement of customer-facing authentication); Workstream 10 (Tasks 10.2, 10.4, 10.5, 10.6 — each explicitly contingent on a feature that is not currently planned).

**Note:** Task 1.7 (AI enrichment of free-text intent) is the one exception inside an otherwise-Future workstream — it is READY and recommended as a **Candidate**, consistent with `RELEASE-1.3-BACKLOG.md` §14 Recommendation 3's own instruction to route it ahead of the broader Destination Intelligence/AI vision.

---

# Activity 6 — Planning Recommendation

**Confirmed: create a new companion document; do not expand `RELEASE-1.3-BACKLOG.md`.** This document *is* that companion document. Rationale, unchanged from `EBC-R1.3-001`'s own stated recommendation: `RELEASE-1.3-BACKLOG.md` remains the canonical catalogue of deferred decisions, candidate features, technical debt and product vision — its role as source of truth for *what has been carried forward* is preserved intact, unedited by this card. `RELEASE-1.3-WORKSTREAM-PLAN.md` (this document) is the delivery-planning document — workstreams, objectives, task decomposition, dependencies, ownership and (recommended, not committed) scope classification. Where the two differ on a factual matter (a decision's wording, an owner, a status), `RELEASE-1.3-BACKLOG.md` governs, per its own §13.2 canonical-location convention; this document should be read as a delivery lens applied on top of that source of truth, not a competing record of it.

---

# Sequencing Recommendation (non-binding)

Ordered by readiness, not by business priority — priority remains the Product Owner's decision (Activity 5 explicitly assigns no priority beyond the three-tier classification). Four natural readiness bands emerge from Activity 3:

1. **Immediately EBC-able with no further discovery:** Workstream 8 Task 8.1 (Destination Ranking Refinement — architecture already written, needs only sign-off); Workstream 2 Task 2.1; Workstream 9's engineering technical debt (Tasks 9.1–9.9) and cleanup (9.10–9.11); Workstream 4's Section 10-sourced UX items (4.1, 4.2, 4.4–4.6, 4.8); Workstream 3's homepage findings (3.1, 3.3, 3.4); Workstream 10 Task 10.1.
2. **One short discovery/decision step, then EBC-able:** Workstream 5 Task 5.1 and Workstream 7 Task 7.1 (route into architecture review together, per the backlog's own Recommendation 1); Workstream 8 Task 8.2; Workstream 3 Task 3.2; Workstream 1 Tasks 1.5–1.6 (pending Archie's explicit go-ahead); Workstream 5 Task 5.2.
3. **Needs a dedicated Arjun-led discovery pass before scoping:** Workstream 6 Task 6.1; Workstream 1 Task 1.7 (though technically READY, benefits from being scoped alongside the discovery-stage items per its stated dependency-free positioning); Workstream 4 Task 4.9; Workstream 3 Task 3.6.
4. **Genuinely longer-horizon, likely spanning beyond Release 1.3:** Workstream 1 Tasks 1.1–1.4, 1.8; Workstream 5 Tasks 5.3–5.4; Workstream 3 Task 3.5; Workstream 10's contingent playbooks (10.2, 10.4–10.6).

Housekeeping (Workstream 9, Tasks 9.12–9.16) can run in parallel with any band above — it depends on Tiger's own availability, not on engineering or product sequencing.

---

# Decisions Required from the Product Owner

Per Project Instructions §35, these are surfaced rather than assumed:

1. **Decision Point D1 (Activity 2):** keep Workstream 2 (Traveller Stories) and Workstream 7 (Marketing & Analytics) as their own workstreams despite currently thin content, or fold them into Workstream 3 and Workstream 5 respectively for Release 1.3 and revisit as standalone workstreams later? Tiger's recommendation: keep them, with a short Arjun discovery pass early in Release 1.3 to confirm whether more belongs in either.
2. **Approve, adjust, or reject the ten-workstream structure itself** (Activity 2) — this document treats the Product Owner's own `EBC-R1.3-001` proposal as confirmed by the evidence, but workstream structure is explicitly the Product Owner's decision to make, not Tiger's to finalise unilaterally.
3. **Formal sequencing and release-inclusion decision** — this document deliberately assigns no priority beyond the three-tier scope classification (Activity 5) and no release date (per this EBC's Explicit Out of Scope). When the Product Owner is ready to formally open Release 1.3 delivery, the Sequencing Recommendation above is offered as a starting point, not a schedule.
4. **Whether to schedule Workstream 9's Release-1.2-closure housekeeping (Tasks 9.12–9.16) inside Release 1.3 delivery, or run it separately** as pure governance follow-up outside release-scoped sequencing.
5. **Archie's explicit go-ahead for Destination Intelligence Model Phase 3/4** (Workstream 1, Tasks 1.5–1.6) — architecture is already Accepted, but the backlog's own entry names this go-ahead as a stated prerequisite this document does not itself grant.

---

# Explicit Out of Scope — Confirmed

Consistent with `EBC-R1.3-001`'s own Explicit Out of Scope: this document creates no implementation EBCs and no IMPs; assigns no engineering estimate to any task; approves no Release 1.3 scope (Activity 5's classifications are recommendations, not approvals); assigns no priority beyond the three-tier scope classification Activity 5 itself asks for; marks no work committed beyond what `RELEASE-1.3-BACKLOG.md` §2 already records as committed (Task 7.1); changes no architecture; and authorises no implementation. Those decisions follow only after Product Owner review, per this EBC's own stated boundary.

---

# Completion Report

**Workspace readiness check:** repository root confirmed at `/Users/viveksophu/Documents/Projects/SearchMyVacation` (reached via the connected local folder for this session); branch `main`; working tree clean before this session began; last commit `622343d` ("docs(r1.2): release 1.2 release notes and release 1.3 transition documentation") before this document was added.

**Documents reviewed (read-only):** `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (full, all 348 lines); `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` (full); `docs/10-Backlog/RELEASE-1.2.md` §1–§18 (Document Information, Change History, Release Vision/Goals, all eight Workstream sections, the Risk Register, and the full closure record §15–§18, confirming Release 1.2 is closed and Release 1.3 is the active release); `docs/02-Product/PRODUCT-ROADMAP.md` (full); and, via the Claude Project, `ARCHIE-R1.3-WS3-01-Search-Ranking-Weighted-Model-Architecture-Review.md`.

**Files created:** `docs/10-Backlog/RELEASE-1.3-WORKSTREAM-PLAN.md` (this document, repository, new).

**Files modified:** none. `RELEASE-1.3-BACKLOG.md` was reviewed only, never edited, consistent with this document's own Activity 6 recommendation and with the established pattern in this project's prior closure cards (`EBC-R1.2-WS8-04` §18.1, §18.7) of treating that file as reviewed-not-edited by planning cards.

**Confirmation: no code, configuration, schema, dependency, or architecture change was made.** This document is the sole output of this session.

**Confirmation: no implementation EBC, IMP, engineering estimate, priority assignment, scope commitment, or architecture decision was created.** Every classification in Activity 5 is offered as a recommendation, per this EBC's own Explicit Out of Scope.

**Confirmation: no branches, commits, or pushes were performed by this session.** The file exists on disk, uncommitted, exactly as authored above — staging and committing remain the Product Owner's or a future session's explicit action.

**Confirmation: no temporary folders, scratch repositories, or test projects were created.**

---

*This document is maintained by Tiger, Programme and Delivery Lead, on behalf of Team Satvi. It authorises no implementation, architecture, UX, or code change. It is a companion to, not a replacement for, `docs/10-Backlog/RELEASE-1.3-BACKLOG.md`, which remains the canonical source of truth for Release 1.3 decisions and vision items wherever the two differ. Source EBC: `EBC-R1.3-001` (Release 1.3 Delivery Planning & Workstream Definition).*
