# EBC-R1.3-WS13-020 — Phase 1 Engineering Execution Plan (Authorisation Card)

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Card type | Engineering Planning authorisation — **planning only** |
| Issued by | Tiger — Delivery Manager |
| Assigned to | Rad — Engineering and Implementation Specialist |
| Supporting personas | Arjun (requirements traceability, decision analysis), Sophie (UX confirmations), Archie (architecture review of migration M11; TL-06 privacy decision) |
| Decision authority | Vivek — Product Owner |
| Authorised by | `DEC-R1.3-025` (3-Oct-2026), following `EBC-R1.3-WS13-019` |
| Date issued | 3 October 2026 |
| Status | **Authorised — open** |

> **Engineering Planning is authorised. Engineering implementation remains subject to approval of the Phase 1 Engineering Execution Plan.**
> Readiness → Tiger · Planning → Rad · Approval → Product Owner · Implementation → Engineering

---

## 1. Objective

Produce the **Phase 1 Engineering Execution Plan**. This is the implementation-ready plan for Journey Core that the Product Owner will approve before any Phase 1 code or migration is written.

The plan refines `EBC-R1.3-WS13-004` §4 "P1 — Journey core" against the repository as it is after Phase 0. It also closes the planning conditions of `DEC-R1.3-025`.

---

## 2. Boundaries

| Permitted | Not permitted |
|---|---|
| Read the repository, migrations, Project Knowledge and governance records | Any change to application code, migrations, configuration or environment variables |
| Read-only checks (`git log`, `git status` with `GIT_OPTIONAL_LOCKS=0`, `npm run lint`, `tsc`, `npm run build`, existing `verify:*` scripts) | Applying, dry-running or drafting migrations into `supabase/migrations/` |
| Read-only inspection of Vercel deployments and of Supabase project settings, such as region | Any database write, including QA data |
| Writing the plan document and its Project Knowledge copy | Commit or push (Product Owner authorises) |
| Recording observations, risks and backlog proposals | Changing a Product, UX or Architecture decision, or silently expanding Phase 1 |

---

## 3. Inputs (authoritative, do not modify)

| Input | Reference |
|---|---|
| Product baseline | `EBC-R1.3-WS13-001` Rev 3; `WS13-003A` §9.3 (O-12, O-13) |
| UX baseline | `EBC-R1.3-WS13-002` Rev 4a, incl. §36 (UXA-02, UXA-05) |
| Architecture | `EBC-R1.3-WS13-003`, `-004A`; AD-WS13-001…007 (`DEC-R1.3-020`) |
| Engineering strategy | `EBC-R1.3-WS13-004` §4 P1, §5 WP-1.1…1.6, §6 (M11), §8, §9, §10, §11, §14 |
| Phase 0 as built | `EBC-R1.3-WS13-005-P0` Rev 3; `DEC-R1.3-021`, `-022`; QA `EBC-R1.3-WS13-015-QA` |
| Readiness review and decision | `EBC-R1.3-WS13-019` Rev 2; `DEC-R1.3-025` |
| Carry-forward and debt | `RELEASE-1.3.md` §6 (WS13 register); `TECH-DEBT.md` v1.4 |
| Process gates | `RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.10 (deployment runbook), §2.11 (QA playbook) |
| Repository baseline | `feature/r1.3-ws13-journey-workspace` at `753afe6` (verified 3-Oct-2026), plus this synchronisation once committed |

---

## 4. Phase 1 Scope (as approved)

Per `EBC-R1.3-WS13-004` §4 P1 and `DEC-R1.3-025`:

- **JW-01** Active Journeys list: summary strip, filters, search and sort held in the URL, Mine/Team scope
- **JW-02** Journey header (people cards, stepper, primary action, status banners, Service Category chip and edit) and **Overview**
- **JW-03** Itinerary, as a read-only snapshot of the accepted Proposal Version
- **JW-08** History: filters, paging 50, pinned links
- **JW-12** lifecycle dialogs: start preparation with template, advance, step back, hold, resume, cancel, Mark as Completed
- **JW-15** Primary Operational Contact editor
- **JW-17** assign and reassign; legacy adoption with Service Category required
- **Migration M11** lifecycle RPCs: transition, place on hold, resume, cancel, close, reassign, assign template, set Service Category, adopt legacy

**Core Workspace Tabs = Overview, Itinerary and History only** (`DEC-R1.3-025` Decision 2).

**Success criteria:** SC-1 to SC-11 (`EBC-R1.3-WS13-019` §12), approved.

## 5. Out of Scope

- Vendor Bookings, Readiness, Documents, Tasks, Activity & Changes tabs and alert display. These are Phase 2. Sophie confirms whether their tab slots are hidden or shown as unavailable in Phase 1; they are not built.
- Dashboard live data, Archive, notification delivery and cron. These are Phase 3.
- Material change and Replacement Journey. These are Phase 4.
- **P0-REPL-01**, which moves to the Replacement Journey phase QA. No database-prepared data (`DEC-R1.3-025` Decision 3).
- RLS hardening card TD-WS12-004 and -005 (before Phase 3). TD-WS13-001 and -002 (Release 1.4).

---

## 6. Required Plan Content (Deliverables)

| # | Deliverable | Notes / condition |
|---|---|---|
| D1 | **Workspace Readiness Check** (Project Instructions §14–§15) | Root, branch, HEAD, working tree, `web/AGENTS.md` / Next.js 16 guidance |
| D2 | **Post-Phase 0 re-baseline** of `WS13-004` P1 | What Phase 0 actually built (M01–M10, module skeleton, verify scripts) and any differences from the `WS13-004` plan that change Phase 1 |
| D3 | **Work package breakdown** (refined WP-1.1…1.6) | Files, relative size, sequence, dependencies; one implementation EBC or several (recommendation) |
| D4 | **Migration M11 specification** | Each RPC: signature, checks in order, error codes, audit events, notifications; additive only; backward-compatibility statement; rollback note; Archie review requested. **Gate: deployment runbook §2.10 approved before M11 is applied (C-6).** |
| D5 | **API and UI plan** | Routes and error-code mapping (`WS13-004` §8.2 for P1); page and component structure; gating via `getAvailableJourneyActions`; label mapping |
| D6 | **Carry-forward and debt disposition (C-3)** | Each item **In** (which WP) or **Deferred** (to where, why): TL-01, TL-02, TL-05, TL-06, TL-07, TL-08, WS13-P1-B, -C, -G, -H, -I, -J; TD-WS13-003, -004, -005 |
| D7 | **Decision schedule (C-4)** | `OD-R1.3-7`, WS13-P1-H, WS13-P1-I, UXO-08 (Team scope), TL-06 privacy (Archie). For each: owner, the WP that needs it, latest date, engineering default if any. Arjun prepares the Product decision analyses. |
| D8 | **Performance profiling plan and proposed target (C-5, SC-11)** | Measure current create, claim and stage-change times on Preview; confirm the Supabase project region against the Vercel function region `iad1`; propose a target. Any region or architecture change is a proposal for Archie and the Product Owner, not part of the plan's scope. |
| D9 | **Verification and test plan** | `verify:*` additions; live RPC contract checklist (success plus every error code) with QA identities; regression packs (WS12, WS11, Phase 0 conversion); QA data prefix `QA-WS13-P1-*`. **Gate: QA playbook §2.11 approved before the Phase 1 QA handover (C-6).** |
| D10 | **Success-criteria traceability** | SC-1…SC-11 → WP → verification method. Arjun supplies the FR/BR identifiers for each SC. |
| D11 | **Risks, dependencies and rollback** | Update the `WS13-004` §14 risks for Phase 1; include RISK-R1.3-005 and -006 |
| D12 | **Readiness recommendation and effort indication** | Ready / Ready with conditions / Not ready for implementation, with conditions listed |

---

## 7. Supporting Persona Requests

| Persona | Request | Needed by |
|---|---|---|
| Arjun | FR/BR mapping for SC-1…SC-11; decision analyses for `OD-R1.3-7`, WS13-P1-H, WS13-P1-I, UXO-08 (known / missing / options / recommendation) | Before the plan is submitted |
| Sophie | Treatment of Phase 2 tab slots in Phase 1; WS13-P1-C copy confirmations; WS13-P1-G toast and JRN reference; TL-06 user administration UX, or confirmation that TL-06 is deferred | Before the WP that uses each |
| Archie | Review of the M11 specification; TL-06 administrator email-visibility decision; architectural view if profiling points to a region or topology change | Before plan approval (M11); before the TL-06 WP |

Each supporting persona's output stays separately attributed in the plan. No persona approves its own work.

---

## 8. Acceptance Criteria for this Card

1. D1–D12 present, each traceable to its source.
2. Phase 1 scope matches §4. Anything beyond it is listed as an observation or backlog proposal, not planned.
3. Conditions C-3, C-4 and C-5 addressed. C-6 gates shown in the sequence.
4. No code, migration, configuration, database or deployment change. Nothing committed or pushed.
5. The plan is submitted to Tiger for validation. It is not self-approved.

## 9. Deliverable Location

- Repository: `docs/09-Development/EBC-R1.3-WS13-020-RAD-Phase-1-Engineering-Execution-Plan.md`
- Project Knowledge copy with the same name.

## 10. After this Card

1. Tiger validates the plan against this card and `DEC-R1.3-025`.
2. The Product Owner approves or rejects the plan. **That approval is the Phase 1 implementation authorisation.**
3. Tiger issues the Phase 1 implementation EBC(s). The deployment runbook (§2.10) must be approved before M11 is applied.

---

*Issued by Tiger, Delivery Manager, on behalf of Team Satvi, under `DEC-R1.3-025`. Planning only.*
