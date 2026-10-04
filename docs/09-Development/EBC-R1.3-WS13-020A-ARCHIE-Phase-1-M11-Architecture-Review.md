# EBC-R1.3-WS13-020A — Phase 1 Migration M11: Architecture Review

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | Architecture review (addendum to `EBC-R1.3-WS13-020`) |
| Prepared by | Archie — Technical Architect |
| Requested by | Rad (`WS13-020` Rev 1, §9, request A-1) and the Product Owner (review of 4-Oct-2026: "Archie — review and approve the proposed M11 engineering design") |
| Reviewed artefact | `EBC-R1.3-WS13-020-RAD-Phase-1-Engineering-Execution-Plan.md` Revision 1, §8–§10 and §13 |
| Architecture baseline | AD-WS13-001…007 (ratified, `DEC-R1.3-020`); `EBC-R1.3-WS13-003`, `-004A` |
| Repository state inspected | `feature/r1.3-ws13-journey-workspace` at `d533a95`; migrations M01–M10 (`20260928100000` … `20260928100900`) and the WS11/WS12 migrations they extend |
| Date | 4 October 2026 |
| Outcome | **Approved with conditions** (AC-1 … AC-9, §4). No architecture decision changes. No new AD is needed. |

Archie does not approve engineering completion, UX or release. This review covers the **design** of M11. The SQL itself is reviewed again at Milestone A code review (AC-9).

---

## 1. Scope of the Review

| In scope | Out of scope |
|---|---|
| The nine M11 functions (§9.1–§9.2 of the plan): signatures, guard order, checks, writes, audit, notifications | UX copy and screen behaviour (Sophie) |
| POC editing path and its audit content (§9.2, request A-4) | Product rules (Arjun / Product Owner) |
| Data strategy, compatibility, rollback (§9.3–§9.4) | Deployment runbook content (Tiger, governance backlog §2.10) |
| Security review (§10) | The region question beyond confirming it stays out of Phase 1 (request A-3, after the baseline) |
| Read models touching architecture (§8.3) | TL-06 email visibility (request A-2 — no longer needed: the Product Owner kept TL-06 out of Phase 1, Decision 2) |

---

## 2. Conformance with the Architecture Baseline

| Decision | What M11 must respect | Plan Rev 1 | Finding |
|---|---|---|---|
| AD-WS13-001 Lifecycle persistence | Stage unchanged while On Hold; terminal = `journey_closed` or outcome; `closed_at` only on entering `journey_closed`; archive is an overlay | Resume clears the overlay; cancel clears hold before setting the outcome; close sets `closed_at`; cancel does not | ✅ Conforms. Cancelling from On Hold must clear the hold columns **before** the outcome is set, in one `update`, or the M07 `workspace_journeys_on_hold_check` fails. The plan states this. |
| AD-WS13-002 Self-authorising RPCs | Actor from `auth.uid()`; owner-or-Administrator inside the function (Administrator-only for adoption); transition table and gates inside; audit in the same transaction; `workspace_journeys` keeps no UPDATE grant | Guard G1–G7; no `p_actor_id`; audit and notification in the same transaction | ✅ Conforms. Deriving the actor from `auth.uid()` (RB-01) is the AD's wording. The `p_actor_id` parameter of conversion v2 was carried from WS12 and is not a pattern to repeat. |
| AD-WS13-002 Single-row child writes | POC edit through RLS keyed on `workspace_can_edit_journey()`, audit written by the service | §9.2 POC editor | ✅ Conforms. The non-atomic audit is the trade-off the AD accepted. |
| AD-WS13-003 Reference and supersession | `supersedes_journey_id` on the replacement; `replaces_journey_id` on the planning record; one open replacement per Journey | `replacement_open` guard on resume and cancel | ✅ Conforms, and it is the right protection: without it, cancelling or resuming the original while a replacement record is open would make that record's later conversion fail with `original_not_on_hold`. |
| AD-WS13-004 Derived state | Readiness, counts and eligibility derived from one view and one TS module, never stored | Readiness gate reads the summary view | ✅ Conforms. See finding AR-F2 on cost. |
| AD-WS13-005 Notifications | Informational notifications inserted directly; condition alerts are Phase 3 | IN-02/03/04 inserted by M11 | ✅ Conforms. See AR-F5 on deactivated recipients. |
| AD-WS13-006 Configuration | Lists and templates are configuration; validation through `workspace_config_has_code()` | Service Category and template checks use configuration | ✅ Conforms |
| AD-WS13-007 Directory and deactivation | Deactivation, not deletion; directory exposes no email | Pickers active-only; G1 rejects deactivated callers; new owner must be active | ✅ Conforms. See AR-F1 for a pre-existing gap. |

**Schema impact:** M11 adds functions only. Every audit event type it writes already exists in the M02 CHECK (`journey_stage_changed`, `journey_stage_stepped_back`, `journey_on_hold`, `journey_resumed`, `journey_cancelled`, `journey_closed`, `journey_reassigned`, `journey_service_category_changed`, `journey_contact_changed`, `journey_template_assigned`, `journey_legacy_adopted`, `task_created`). I verified the CHECK in `20260928100100`. **No table, column, constraint, index, policy or grant changes. No architecture approval is needed for a schema change because there is none.**

---

## 3. Findings

### AR-F1 — Deactivation is enforced by the application, not by every database policy (pre-existing; not introduced by M11)

**Evidence.** `workspace_current_user_role()` (`20260916090000`) returns the caller's role whether or not `deactivated_at` is set. M01 added `deactivated_at` but did not change that function. Read policies on the Journey child tables, the summary view (through `security_invoker`) and the configuration tables test `workspace_current_user_role() is not null`. `workspace_journeys`, `workspace_audit_log`, `workspace_tasks` and the Journey Planning tables have `using (true)` read policies, and Journey Planning keeps `using (true) with check (true)` UPDATE policies (TD-WS12-004).

**What is protected today.** Every Workspace page and API refuses a deactivated user (`auth/service.ts`). Every Journey **write** checks deactivation in the database: `workspace_can_edit_journey()`, conversion v2, and M11 (guard G1).

**What is not.** A deactivated user who still holds a valid Supabase session (TD-WS13-005: the session is kept after refusal) could call the REST API directly and **read** Workspace data, and could **update** Journey Planning records through the permissive WS12 policy.

**Assessment.** Low likelihood (a deliberate insider using the REST API after deactivation), medium impact (read access to traveller data; JP edits). M11 does not widen it.

**Recommendation.** Do not change `workspace_current_user_role()` inside M11: it changes the meaning of every existing policy across WS11, WS12 and WS13 and needs its own regression. Instead:
1. Phase 1 already signs the session out on refusal (TD-WS13-005, WP-1.9). That closes the normal path.
2. Log **TD-WS13-006** "Deactivation not enforced in RLS read policies" and add it to the RLS hardening card with TD-WS12-004/-005, before Phase 3. The fix is a reviewed change to `workspace_current_user_role()` (return null when deactivated) plus regression.

This is a Product Owner risk decision (ND-12 in plan Rev 2). My recommendation is the hardening card.

### AR-F2 — The readiness gate reads a view that aggregates every Journey

**Evidence.** In `workspace_journey_operational_summary`, the `bookings` and `documents` CTEs are referenced twice (by the `readiness` CTE and by the final select). PostgreSQL 12+ materialises a CTE referenced more than once, so a filter on `journey_id` is not pushed into those aggregates: every query of the view aggregates all bookings, documents and readiness items.

**Assessment.** At internal scale (tens to low hundreds of Journeys) the cost is small, and the view is the single source of truth (AD-WS13-004). A second, per-Journey copy of the readiness expression would be faster but would drift from the view.

**Decision.** Keep the gate on the view (`select … from public.workspace_journey_operational_summary where journey_id = p_journey_id`). Rad includes the view in the profiling baseline (plan §13.3 B-8). If profiling shows cost, the remedy is a view revision (for example `not materialized` CTEs or lateral per-Journey aggregates) reviewed by me, not a duplicate expression. **AC-3.**

### AR-F3 — Shared template-item derivation

Functions 7 (Start preparation) and 9 (adoption) both create readiness items from a template. Two copies of that insert would drift.

**Decision.** One internal function, `workspace_journey_derive_template_items(p_journey_id uuid, p_template_id uuid, p_actor_id uuid) returns integer` (items created), `security definer`, **execute revoked from `public`, `anon` and `authenticated`**. It is callable only by the M11 functions, which run as the owner. **AC-2.**

### AR-F4 — POC audit content (request A-4)

Approved: the audit entry records type, name and organisation before and after, **not** phone or email values. Add two booleans, `phone_changed` and `email_changed`, so History can say "Contact details updated" without storing personal data. Applies equally to the POC update inside adoption. **AC-5.**

### AR-F5 — Notifications to deactivated users

When an Administrator acts on a Journey whose owner is deactivated (the E-06 situation), IN-03/IN-04 would be addressed to a user who cannot sign in. Skip informational notifications to deactivated recipients. This is notification hygiene, not a product rule change. **AC-6.**

### AR-F6 — Cancellation-task assignee when the owner is deactivated

Function 4 assigns vendor-cancellation tasks to the owner. If the owner is deactivated, the tasks would sit with a user who cannot act. Engineering default: assign to the owner unless the owner is deactivated, in which case assign to the caller. The behaviour is not QA'd until Phase 2 (Product Owner Decision 6), so Arjun can confirm it before then. Raised for Arjun; not blocking.

### AR-F7 — Function hygiene

- `set search_path = public` matches every existing function. Keep it, and qualify every object in function bodies with `public.` (as M10 does). **AC-1.**
- PostgreSQL grants EXECUTE on new functions to `PUBLIC` by default. Each function needs `revoke all on function … from public, anon` before `grant execute … to authenticated`. The plan states this; it is repeated here because it is the control that keeps the functions off the anonymous key. **AC-1.**
- Parameter and variable prefixes (`p_`, `v_`) and no `RETURNS TABLE` names that shadow columns: required (Release 1.2 ambiguous-column defects). **AC-1.**

### AR-F8 — Nights derived at adoption (Product Owner Decision 5)

Writing `nights` inside function 9 is consistent with AD-WS13-001 (the column exists; the adopted-Journey CHECK does not require nights). The audit entry must carry `nights_source` (`stored` or `derived_from_dates`) **and** the derived value, so History can show it (Decision 5: "recorded in Journey History"). **AC-4.**

### AR-F9 — Read models (plan §8.3)

Composing names (party, POC, owner) in the service rather than widening the view is the right call: it keeps M09 unchanged and keeps the directory's no-email rule in one place. Search by collecting matching ids and filtering the view is acceptable at internal scale. Revisit only with profiling evidence. No condition.

### AR-F10 — Region (request A-3)

Confirmed facts: Vercel functions in `iad1`, Supabase in ap-northeast-2. Per Product Owner Decision 8, nothing changes in Phase 1. After Rad's baseline (E1) I will give an architectural view on options (for example moving the function region close to the database). Any change is a separate architecture decision with the Product Owner. No condition on Phase 1.

---

## 4. Conditions (to be incorporated in plan Revision 2)

| # | Condition | Finding |
|---|---|---|
| AC-1 | Function hygiene: `security definer`, `set search_path = public`, `public.`-qualified names, `revoke all … from public, anon`, `grant execute … to authenticated`, `p_`/`v_` naming | AR-F7 |
| AC-2 | One internal derivation helper, execute revoked from `public`, `anon`, `authenticated`; used by functions 7 and 9 | AR-F3 |
| AC-3 | Readiness gate reads the summary view; no duplicate readiness expression; view included in profiling | AR-F2 |
| AC-4 | Adoption audit carries `nights_source` and the derived value | AR-F8 |
| AC-5 | POC audit: type, name, organisation before/after plus `phone_changed`, `email_changed`; no phone or email values | AR-F4 |
| AC-6 | No informational notification to a deactivated recipient | AR-F5 |
| AC-7 | Rollback script drops the nine functions **and** the helper | §9.4 |
| AC-8 | TD-WS13-006 logged and routed to the RLS hardening card, unless the Product Owner decides otherwise (ND-12) | AR-F1 |
| AC-9 | Archie reviews the M11 SQL and the local test evidence at the Milestone A checkpoint, before M11 is applied | — |

---

## 5. Architecture Statement

> M11 as specified in `WS13-020` Rev 1 §9, with conditions AC-1 to AC-9, conforms to AD-WS13-001 to AD-WS13-007. It introduces no schema change, no new dependency, no environment variable and no change to the deployment architecture. It is backward compatible with the current Preview and with Production, and it can be applied without a freeze. **Approved with conditions.**
>
> — Archie, Technical Architect, 4 October 2026

*No Product, UX or engineering-completion decision is made in this review. The region question stays outside Phase 1 (Product Owner Decision 8).*
