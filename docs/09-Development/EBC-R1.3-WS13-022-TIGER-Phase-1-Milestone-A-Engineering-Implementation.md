# EBC-R1.3-WS13-022 — Phase 1 Milestone A Engineering Implementation (Administrative Record)

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | **Administrative engineering record** of the Milestone A implementation card |
| Issued by (original card) | Tiger — Delivery Manager, to Rad — Engineering and Implementation Specialist, 4-Oct-2026 |
| Authority | `DEC-R1.3-026`; `EBC-R1.3-WS13-021` §10 (Milestone A Authorisation) |
| Record created | 7 October 2026, by Tiger, at the Product Owner's direction (`DEC-R1.3-028`; Checkpoint 1 review `EBC-R1.3-WS13-024` GF-2) |
| Status | Card executed. Milestone A complete (`EBC-R1.3-WS13-023`); Checkpoint 1 passed (`DEC-R1.3-028`). |

> **Provenance.** The original card was handed to Rad as a chat attachment on 4-Oct-2026 and was not filed in the repository or Project Knowledge, and its text could not be recovered. This record restates the card from the authoritative sources: the Milestone A authorisation in `EBC-R1.3-WS13-021` §10–§11, and the deliverables, environment requirements and exit criteria that Rad's completion report `EBC-R1.3-WS13-023` cites against "card `022`". It is not a verbatim copy and adds nothing to the scope Rad worked to. Where wording is quoted from those sources, the source is named. This record is not a blocker to Phase 1 (Product Owner, 7-Oct-2026).

---

## 1. Objective

Implement **Phase 1 Milestone A** of the frozen Engineering Baseline (`EBC-R1.3-WS13-020` Rev 2): the server half of Journey Core. That means measuring the performance baseline, writing Migration M11 and proving it locally, and implementing the service and API layer. M11 is **not** applied to the shared database. Milestone A is then presented for review at Checkpoint 1 (`021` §10, §16).

## 2. Authorised Scope (`021` §10)

- Baseline response-time measurement (WP-1.0).
- Local implementation of Migration M11 (WP-1.1).
- Local validation of every database function: success path, every error code, RLS and grant checks.
- Service-layer implementation (WP-1.2).
- API implementation (WP-1.2).
- Engineering testing (lint, type-check, build, `verify:*`).
- SQL review by Archie (Checkpoint 2; `021` C-2; `020A` AC-9).

**Local engineering environment** (`023` §3 heading "card: Docker, local Supabase, migration history"): a local database environment able to replay the repository migration history and then M11.

## 3. Out of Scope

- Applying M11, or any migration, to the shared database. No shared-database migration occurs until Checkpoint 4 (`021` §10).
- Any screen, page or component. These are Milestone B, which waits for Checkpoint 1.
- Commit, push or Preview deployment.
- Optimisation of any kind. Measure only (PO Decision 8).
- Phase 2/3/4 functionality, User Administration (PO Decision 2), template management and Replacement Journey.

## 4. Deliverables (as cited in `023` §2)

| # | Deliverable |
|---|---|
| A | Performance Baseline Report (Preview) |
| B | Migration M11 |
| C | Local Engineering Validation Report |
| D | Service Layer |
| E | API Layer |
| F | Performance Profile |
| G | Engineering Findings |
| H | Updated Technical Documentation |

The completion report is `EBC-R1.3-WS13-023`.

## 5. Exit Criteria and Governance Constraints (as cited in `023` and `024` Rev 1 §3)

- M11 validated locally: success path, validation, permission, ownership, Administrator, errors, audit.
- Service and API layers implemented and validated.
- Performance measured, not optimised.
- No shared database modified.
- No Preview deployment executed.
- No credentials entered by Team Satvi; the Product Owner signs in (`DEC-R1.3-022` (1)).
- No genuine operational record modified; test records named `QA-WS13-P1-*` (PO Decision 7).
- Completion report `EBC-R1.3-WS13-023` submitted.

## 6. Outcome (for the record)

| Item | Result | Record |
|---|---|---|
| Deliverables A–H | Delivered | `023` Rev 1 |
| Shared-database schema | Unchanged; M11 local only | `023`, `023A`, `024` §9 |
| Shared-database data | One approved departure: the baseline's QA writes, approved by the Product Owner on 4-Oct-2026 | `DEC-R1.3-027` |
| Local environment | Docker and the Supabase CLI were not available. Substitute: PostgreSQL 17.6 + Supabase shim + PostgREST 12.2.3 (Phase 0 precedent). | `023` §3, F-08 |
| Checkpoint 2 (SQL review) | Approved with conditions SR-01, SR-02 | `EBC-R1.3-WS13-023A` |
| Checkpoint 1 | **Passed**; Milestone B authorised | `EBC-R1.3-WS13-024` Rev 3, `DEC-R1.3-028` |

---

*Administrative record prepared by Tiger, Delivery Manager, on behalf of Team Satvi, 7 October 2026.*
