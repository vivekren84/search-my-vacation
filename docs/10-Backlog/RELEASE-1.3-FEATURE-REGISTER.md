# Search My Vacation

# Release 1.3 Feature Register

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.3 Feature Register (standalone) |
| Version | 1.0 |
| Status | **Active** — governance-audited feature-level register for Release 1.3 |
| Origin | `EBC-R1.3-GOV-001` (Tiger, Release 1.3 Feature Register & Workstream Alignment), Reviewers Vivek/Arjun |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | A single, audit-grade feature-level view of Release 1.3: what features exist, what backlog item each traces to, what lifecycle stage each has actually reached (evidence-based, never invented), and who owns it next. |
| Relationship to `RELEASE-1.3.md` §15 | This document **supersedes** `RELEASE-1.3.md` Section 15 (Feature Register) as the canonical Feature Register going forward. Section 15 is not deleted or rewritten by this card (Out of Scope — `RELEASE-1.3.md` is not to be modified by this exercise); it remains in place, superseded, until a future EBC formally retires it in favour of this document, per this project's supersede-not-erase convention. Feature IDs (`FEAT-R1.3-001`–`014`) are carried forward unchanged, not renumbered. |
| Related | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` — scope/backlog catalogue, canonical source of what has been decided or carried forward. `docs/10-Backlog/RELEASE-1.3-WORKSTREAM-PLAN.md` — task-level decomposition, canonical source for Activity 3 detail. `docs/10-Backlog/RELEASE-1.3.md` — live workstream tracker, canonical source for live workstream status (Section 5). `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` — deferred-item register; a distinct, complementary register, not a Feature source. `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md` — the full audit trail behind this document (classification, gap assessment, scope-drift findings, recommendations). |
| Explicit Out of Scope | This document does not rewrite the Release Backlog, reprioritise features, create new Product Decisions, modify Product Specifications or the RTM, modify EBC numbering, or modify any completed governance document. It does not estimate effort or create a Sprint Plan. It does not modify `RELEASE-1.3.md` — see the audit report's Section 7 for update recommendations only. |

---

## Document Change History

| Version | Date | Author | EBC | Summary |
|---|---|---|---|---|
| 1.0 | 14-Sep-2026 | Tiger | `EBC-R1.3-GOV-001` | Initial creation. Audits every item in `RELEASE-1.3-BACKLOG.md`, `RELEASE-1.3-WORKSTREAM-PLAN.md` and `RELEASE-1.3.md` §5/§15, and every completed Release 1.3 governance artefact through `EBC-R1.3-WS3-006`/`DEC-R1.3-006`, to produce this evidence-grounded, audit-grade Feature Register. Carries forward all 13 active Feature IDs from `RELEASE-1.3.md` §15.2 (`FEAT-R1.3-012` remains reserved/unassigned) with corrected/verified Current Lifecycle Stage, Current Status and Source Backlog Reference fields. Documentation only — no Product Specification, RTM, Release Backlog, or `RELEASE-1.3.md` content was changed. |

---

## 1. Purpose

`RELEASE-1.3-BACKLOG.md` records *what has been decided or carried forward*. `RELEASE-1.3-WORKSTREAM-PLAN.md` records *how that could be organised into tasks*. `RELEASE-1.3.md` §5 records *live workstream delivery status*. None of the three answers, on its own and with full traceability, the question this document exists to answer: **for every Product Owner commitment made for Release 1.3, what feature does it belong to, and what is that feature's actual, evidence-based delivery state today?**

This document is an audit product, not an authoring exercise. Every status and lifecycle-stage value below is backed by a named source document; where evidence does not exist for a claim, the field says so explicitly rather than inferring or estimating.

---

## 2. Governance Principles

1. **Feature ownership.** Every feature has exactly one Primary Owner persona at any given time, reflecting whichever lifecycle stage is currently active (Arjun during Product Analysis, Sophie during UX, Archie during Architecture, Rad during Engineering, Keerthi/Sri during QA). Ownership transfers as the feature moves stages; it does not accumulate co-owners indefinitely.
2. **Traceability.** Every feature traces to a named source in `RELEASE-1.3-BACKLOG.md` (a Decision, a §3 Candidate, a Section 9/10/11/12 item, or a Vision-item cluster) and to exactly one Master Workstream Tracker row (`RELEASE-1.3.md` §5), with two named release-level exceptions (FEAT-R1.3-013, FEAT-R1.3-014) that predate a workstream assignment or span all workstreams by nature.
3. **One Feature → One Workstream.** Each Feature Register entry maps to exactly one workstream. The reverse is not required: a workstream may contain more than one Feature (WS3 contains FEAT-R1.3-003 and FEAT-R1.3-004; this is by design, not a violation — see the audit report §4 for why these were kept separate rather than merged).
4. **Lifecycle progression is evidence-based, never inferred.** A feature's Current Lifecycle Stage reflects the furthest stage for which a named, completed artefact exists. A feature is not marked past a stage merely because a later stage's work has begun on part of it — see FEAT-R1.3-001's dual-scope entry below for the worked example this principle exists to prevent being glossed over.
5. **No feature is marked Complete on the strength of a related or adjacent artefact.** Completion requires a closure record for the specific scope claimed complete (a `*-CLOSE-*` card, a Final QA PASS, or equivalent).

---

## 3. Team Satvi Lifecycle (Delivery Stages — Not Workstreams)

This is the persona-driven delivery lifecycle every feature moves through. It is **not** the numbered Workstream structure (WS1–WS11) tracked in `RELEASE-1.3.md` §5 — a Workstream is a unit of release-tracker organisation; a Lifecycle Stage is a unit of delivery-discipline progress. A single Workstream typically contains features at different Lifecycle Stages simultaneously (e.g. WS11 today: Product Decisions stage complete, UX stage next).

```
Discovery
    ↓
Business Analysis
    ↓
Product Decisions
    ↓
UX
    ↓
Architecture
    ↓
Engineering
    ↓
QA
    ↓
Release Closure
```

- **Discovery** — the underlying business need or opportunity is identified and captured; no requirements yet.
- **Business Analysis** — Arjun translates the discovery into functional requirements, business rules, actors and acceptance criteria.
- **Product Decisions** — the Product Owner (or the delivery-lifecycle's built-in Product Owner Review step) ratifies the requirements as an approved baseline.
- **UX** — Sophie translates the approved baseline into interaction design, layout and visual hierarchy.
- **Architecture** — Archie confirms technical approach, component boundaries, data flow and integration impact (required only where the change is architecturally material, per Project Instructions §21).
- **Engineering** — Rad implements against the approved UX/Architecture baseline.
- **QA** — Keerthi (functional) and Sri (traveller experience) independently validate.
- **Release Closure** — Tiger consolidates findings and the Product Owner makes the release-inclusion decision.

A feature can legitimately skip a stage when that stage does not materially apply (e.g. a pure documentation/cleanup task may skip UX), but a skip must be named, not silent.

---

## 4. Feature Register

Estimation fields (Story Points, Estimated Hours, ROI) are intentionally omitted from this register, consistent with `RELEASE-1.3-WORKSTREAM-PLAN.md`'s own explicit statement that estimation is out of scope for every Release 1.3 workstream at this stage. Recording them here, even as placeholders, would misrepresent backlog state.

| Feature ID | Feature Name | Source Backlog Reference | Current Lifecycle Stage | Current Status | Primary Owner | Notes |
|---|---|---|---|---|---|---|
| FEAT-R1.3-001 | Destination Intelligence Evolution | `RELEASE-1.3-BACKLOG.md` §1 Decisions 1–2, §3 (Phase 3/4 candidate), §4, §7; Workstream Plan Tasks 1.1–1.8 | **Split status — see Notes.** Bootstrap Generator tooling sub-scope: Release Closure (complete). Region-level content sub-scope (Tasks 1.1–1.4, 1.8) and Phase 3/4 runtime/recommendation sub-scope (Tasks 1.5–1.6): Discovery (not yet begun). Task 1.7 (AI enrichment): Engineering-ready, not started. | Mixed — see Notes | Rad (tooling, closed) / Arjun (region content, not begun) / Archie (Phase 3/4 go-ahead, not given) | **This is the single largest lifecycle-stage overstatement risk in the current register.** `RELEASE-1.3.md` §15 lists FEAT-R1.3-001 as "✅ Complete," which is only true of the WS1-002–WS1-011 Bootstrap Workbook/Generator governance-tooling card family — the substantive region-level destination-intelligence content (Tasks 1.1–1.4, 1.8) and the already-architected Phase 3/4 runtime/recommendation-behaviour work (Tasks 1.5–1.6) have not started at all (Discovery stage). This is already correctly disclosed in `RELEASE-1.3.md` §5's own WS1 Notes and FEAT-R1.3-001's own Notes field — this entry preserves that disclosure rather than re-litigating it, but elevates it to the headline Status field rather than leaving it buried in a Notes paragraph, since a reader of the summary table alone would otherwise see only "✅ Complete." |
| FEAT-R1.3-002 | Traveller Stories | `RELEASE-1.3-BACKLOG.md` §1 Decision 5, §3 | Release Closure (complete) | ✅ Complete | Tiger (closed) | Closed 06-Sep-2026, `R1.3-WS2-CLOSE-01`; independently repository-verified (branch/commit/folder-count checks, `RELEASE-1.3-WORKSTREAM-PLAN.md` Workstream Delivery Status Log). No open items. |
| FEAT-R1.3-003 | Homepage Premium Experience | `RELEASE-1.3-BACKLOG.md` §11 (`OPEN-R1.2-007`, `-009`, `Experiences.tsx` cleanup); Workstream Plan Tasks 3.1, 3.3, 3.4 | Discovery / Business Analysis (Task 3.2 only — Trust Points icon/imagery decision still pending Arjun+Vivek) — otherwise Business Analysis complete, Engineering not started | Not Started | Sophie / Rad | Two of the four source `OPEN-R1.2-0xx` findings (Trust Points, Contact Preview CTA) remain formally **"Under Discussion"** in `RELEASE-1.2.md` §8 — not yet Product Owner decisions — a status this Feature entry's parent Workstream Plan already discloses but which the prior Feature Register's generic "Not Started" status did not surface. Traveller Inspiration (Task 3.6) is named in WS3's own objective but has no Feature entry of its own — see the audit report §4, Finding SD-3. |
| FEAT-R1.3-004 | Ambient Music Experience (Evaluation Only) | `RELEASE-1.3-BACKLOG.md` §1 Decision 6, §3 | Discovery (evaluation not yet begun) | Not Started — **Evaluation Only** | Sophie (evaluation) / Rad (feasibility) | Explicitly investigation-only; no acceptance criteria exist because the evaluation outcome determines whether any are drafted. Correctly kept separate from FEAT-R1.3-003 rather than folded in, since its "evaluation only, not a commitment" status would otherwise be lost inside a larger entry. |
| FEAT-R1.3-005 | Journey Passport Experience 2.0 | `RELEASE-1.3-BACKLOG.md` §10 (9 items); Workstream Plan Tasks 4.1–4.9 | Business Analysis complete (UX specifications exist for 6 of 9 tasks — 4.1, 4.2, 4.4–4.6, 4.8 — per completed WS5/WS6 reviews); Discovery for the remaining 3 (4.3, 4.7 evaluation-only; 4.9 unscoped) | Not Started | Sophie / Rad / Archie | Largest single UX/Engineering cluster in the release; 6 of 9 tasks are READY (Sequencing Recommendation Band 1) with existing UX specification, 3 are evaluation-only or unscoped. Security guardrail preserved throughout: OTP remains mandatory before recommendations/lead creation regardless of any Task 4.3/4.7 outcome. |
| FEAT-R1.3-006 | Destination Recommendation Engine | `RELEASE-1.3-BACKLOG.md` §1 Decisions 8–10, §2, §10 (`OBS-8-01`); Workstream Plan Tasks 5.1–5.4 | Business Analysis complete for Task 5.1 (WhatsApp/Journey Director CTA — builds on shipped `EBC-039` pattern) and Task 5.2 (Recovery Messaging — root cause already found); Discovery for Tasks 5.3–5.4 | Not Started | Archie / Rad / Sophie / Arjun | Task 5.1 shares one integration point with FEAT-R1.3-008 (Google Ads Conversion Tag) — both route into the same architecture review, per Backlog §14 Recommendation 1; the two features remain distinct entries because they are two Product Owner decisions from two different backlog sources sharing an implementation point, not one decision. Must remain downstream of deterministic eligibility/scoring/evidence (Project Instructions §24) for any Task 5.4 AI work. |
| FEAT-R1.3-007 | Customer Identity & Member Experience | `RELEASE-1.3.md` `DEC-R1.3-005` (Product Owner decision, 09-Sep-2026) | Discovery (not yet begun) | Approved – Discovery Pending | Arjun | Mapped to WS6 as the closest existing workstream; explicitly **not a confirmed 1:1** per the Product Owner's own accepted framing. Fully separate from FEAT-R1.3-013 (SMV Workspace) — confirmed by `DEC-R1.3-005`, no content shared between the two. No standalone business-case documentation exists in `RELEASE-1.3-BACKLOG.md`; this entry records an accepted release-level scope addition, not a backlog-sourced item — see audit report §4, Finding SD-1. |
| FEAT-R1.3-008 | Analytics & Conversion Tracking | `RELEASE-1.3-BACKLOG.md` §1 Decision 9, §2 (Google Ads Conversion Tag) | Business Analysis complete (Product Owner direction is explicit and dated); Architecture not yet scheduled | Not Started — **Release 1.3 Commitment** | Archie / Rad | The one item in the entire release explicitly classified a **Commitment**, not a Candidate, per the Product Owner's 23-Aug-2026 direction (`RELEASE-1.3-BACKLOG.md` §2). Deferrable only via an approved Tiger EBC recommending deferral — not by default, silent slippage, or any other route. No such EBC has been raised; the commitment stands. |
| FEAT-R1.3-009 | Search Behaviour | `RELEASE-1.3-BACKLOG.md` §12 (`OBS-R1.3-WS3-01`, `OBS-R1.3-WS3-02`); Workstream Plan Tasks 8.1–8.2 | Architecture complete for Task 8.1 (`ARCHIE-R1.3-WS3-01`, full three-tier scoring model, verified against every named acceptance case); Discovery for Task 8.2 (root cause not yet confirmed) | Not Started | Archie / Rad | Task 8.1 is the single most execution-ready item in the entire Release 1.3 backlog per the Workstream Plan's own Activity 1.4 finding — needs only Arjun/Tiger sign-off on two named open questions before an approved Rad implementation card. |
| FEAT-R1.3-010 | Technical Debt & Performance | `RELEASE-1.3-BACKLOG.md` §9 (`TD-R1.3-001`–`009`); Workstream Plan Tasks 9.1–9.16 | Business Analysis complete (all 9 `TD-R1.3` items root-caused, no further discovery needed); Engineering not started | Not Started | Rad / Tiger | **Scope note:** this feature's Business Objective, as carried from `RELEASE-1.3.md` §15, folds in Tasks 9.12–9.16 (five Release-1.2-closure documentation-housekeeping items), which the Workstream Plan itself explicitly states are "not Release 1.3 product or engineering scope in the sense the rest of this document uses the term." Retained here for completeness per the Workstream Plan's own instruction, but this is a scope-shape caveat worth a Product Owner sequencing decision — see audit report §4, Finding SD-2, and Open Decision `OD-R1.3-4` (unresolved). |
| FEAT-R1.3-011 | Design System Polish | `RELEASE-1.3-BACKLOG.md` §3 (Design Token Reconciliation); `RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.1–2.6 (six playbooks); Workstream Plan Tasks 10.1–10.7 | Business Analysis complete for Task 10.1 (already approved, `IPP-R1.2-WS4-001`) and Task 10.3/10.7 (ready, low-effort); Discovery/Future for Tasks 10.2, 10.4–10.6 (each contingent on a feature not yet planned) | Not Started | Sophie / Archie / Tiger | **This Feature's carried-forward Business Objective ("Polish and extend the shared design system and platform-level UI consistency") omits its own workstream's second half entirely** — the six Governance/Operational Playbooks (Payment Gateway, Email Provider, WhatsApp Provider, OAuth Provider, Maps API, Third-Party Service Operational Standards) that Workstream Plan Activity 3 explicitly assigns to WS10 alongside design-token work. This is a genuine drift between this Feature's stated objective and its own workstream's actual scope — see audit report §4, Finding SD-4 (the most material finding of this audit). |
| FEAT-R1.3-012 | *(reserved — unassigned)* | — | — | — | — | Deliberately left unassigned rather than invented to fill a numbering gap, per `RELEASE-1.3.md` §15.2's own original note: the ten-feature list originally supplied had no distinct "Journey Director" entry separate from the Recommendation Engine (FEAT-R1.3-006 already absorbs that full scope). Confirmed still correct on this audit — no tenth undiscovered feature was found. |
| FEAT-R1.3-013 | SMV Workspace | `RELEASE-1.3.md` `DEC-R1.3-004`/`DEC-R1.3-005`/`DEC-R1.3-006`; `docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md` | **Business Analysis / Product Decisions complete** (Discovery → Product Specification/RTM v2.0 → Product Owner Review, 9/9 modules → Delivery Governance Consistency Review → Impact Assessment → Stage 4 Consolidated Update → Baseline Index → Tiger Delivery Readiness Review, `EBC-R1.3-WS3-006`, **Ready for UX Architecture**); UX not yet begun | Approved – Product Baseline Complete (Ready for UX Architecture) | Sophie (UX, next) | Workstream WS11, assigned 13-Sep-2026 (`EBC-R1.3-WS3-006`/`DEC-R1.3-006`), resolving the prior collision with this tracker's own, unrelated "Workstream 3" (Homepage). Four scoped Open Questions remain (OQ-018–021 — see audit report §5 for a numbering-consistency finding against `FUTURE-CONSIDERATIONS.md` §5.1's own citation of this same baseline). OQ-018 alone represents the largest single unscheduled Business Analysis gap in the release: detailed FR wording for ~185 of the 223 approved Functional Requirements remains topic-group-level only. |
| FEAT-R1.3-014 | Governance & Release Closure | `RELEASE-1.3.md` §15 (release-level, no workstream) | Not Started (by definition — gated on all other features reaching Complete or an accepted deferral) | Not Started | Tiger / Keerthi / Sri / Vivek | **Categorical note, not a defect:** this entry is a release-governance milestone (consolidated status, independent QA, release decision), not a traveller-facing or business-capability Feature in the sense every other entry in this register uses the term. Retained under its existing Feature ID for continuity with `RELEASE-1.3.md` §15 rather than removed or reclassified, per this card's own Out-of-Scope instruction not to modify EBC/Feature numbering — flagged here as a categorical observation for a future Feature Register schema revision, not actioned. |

---

## 5. Lifecycle Definitions

See Section 3 above for the full eight-stage definition. Two additional conventions apply specifically to this register's Current Status column, distinct from the Lifecycle Stage column:

| Status | Meaning |
|---|---|
| Not Started | No lifecycle stage beyond Discovery (if even that) has begun. |
| Approved – Discovery Pending | Accepted into release scope by the Product Owner; Discovery has not yet begun. |
| Approved – Product Baseline Complete | Business Analysis and Product Decisions stages both complete and Product-Owner-accepted; the next stage (UX or Architecture) has an explicit go/next signal. |
| Release 1.3 Commitment | A named, dated Product Owner commitment (not merely a candidate) — deferrable only via an approved Tiger EBC. |
| ✅ Complete | A closure record exists for the specific scope claimed complete. |

---

## 6. Traceability Model

```
Release Backlog (RELEASE-1.3-BACKLOG.md)
        ↓  (Decision / §3 Candidate / Vision cluster)
Feature (this register)
        ↓  (One Feature → One Workstream, Governance Principle 3)
Workstream (RELEASE-1.3.md §5) → Tasks (RELEASE-1.3-WORKSTREAM-PLAN.md Activity 3)
        ↓
EBCs (Claude Project + repository docs/09-Development/)
        ↓
Evidence (commits, QA reports, architecture reviews, Product Owner Review records)
        ↓
Release Tracker Status Update (RELEASE-1.3.md §5/§7, by Tiger recommendation only —
        this register does not write to RELEASE-1.3.md itself)
```

Every arrow above must be traceable in both directions: from a Feature, a reader must be able to reach the backlog decision that authorised it and the workstream tasks that will deliver it; from a completed EBC, a reader must be able to reach the Feature it advances. Section 4 above is this model applied to all 13 active features; the audit report's Section 3 is the reverse direction — every completed piece of Release 1.3 work, traced back up to its Feature.

---

*This document is maintained by Tiger, Programme and Delivery Lead, on behalf of Team Satvi. It is an audit-grade companion to `RELEASE-1.3.md` §15, which it supersedes as the canonical Feature Register going forward without editing or deleting that section (Out of Scope for `EBC-R1.3-GOV-001`). Full audit trail, classification detail, gap assessment and `RELEASE-1.3.md` update recommendations: `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md`.*
