# EBC-R1.3-WS13-028 — Phase 1 WP-1.9 Carry-Forward: Implementation Authorisation

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Issued by | Tiger — Delivery Manager |
| Issued to | Rad — Engineering and Implementation Specialist |
| Authority | Product Owner, 8-Oct-2026: `EBC-R1.3-WS13-027` §11 PO-5; `DEC-R1.3-031` (3). Frozen baseline `EBC-R1.3-WS13-020` Rev 2 (WP-1.9, §11), with `-020A` and `-020B`; `DEC-R1.3-026` |
| Date | 8 October 2026 |
| Status | **Issued.** Implementation may start only after the preservation prerequisite P-1 is met (§5). |

Rad's completion of this card does not equal Keerthi's functional approval, Sri's experience approval or Product Owner acceptance.

---

## 1. Objective

Deliver plan work package **WP-1.9**: the Phase 1 carry-forward items that the frozen Engineering Baseline dispositions as **In** (`020` §11). This closes SC-10 for these items and is plan phase **E6**.

## 2. Business Context

These items touch Journey Planning (WS12) and the Workspace sign-in and authentication path (WS11). Each was deferred from Phase 0 with a recorded owner. Each has an approved design in `020B` or an approved default in `DEC-R1.3-026`. None is new product scope.

## 3. Scope (exactly these items)

| # | Item | Approved specification | Acceptance criteria |
|---|---|---|---|
| 1 | **TL-01** — Journey Owner in the Journey Planning Confirm dialog shows "You" or a raw user id | `020` §11; use the M01 user directory (`workspace_user_directory()` / `getActiveWorkspaceUsers()`) | AC-1.1: the dialog shows the owner's display name. AC-1.2: no raw id is shown in any case. AC-1.3: if the owner is deactivated, the name still shows, following 020B C-13 wording if a marker is shown. |
| 2 | **TL-02** — Replacement banner reference is plain text | 020B S-3: "Replacement planning for JRN-···· · The original Journey is on hold until this is confirmed. [Open JRN-····]". Wording unchanged (Rev 4a §36.3). | AC-2.1: the reference is a link to `/workspace/journey-workspace/[journeyId]`. AC-2.2: the wording is otherwise unchanged. |
| 3 | **TL-05** — Header / user menu does not read `workspace_users.display_name` | `020` §11 | AC-3.1: the header and user menu show `display_name`. AC-3.2: the fallback when `display_name` is empty is the current behaviour (Rad states which in the report). |
| 4 | **WS13-P1-G / C-11** (and **WS13-P1-C**, ED-03) — the conversion toast disappears after 6 s and the JRN reference is lost | 020B C-11: "Journey JRN-1047 created." with the action link **"Open Journey"**; a toast with an action does not auto-dismiss; toasts without an action keep current behaviour; all toasts announced politely (`role="status"`) | AC-4.1: after conversion, the toast shows the reference and "Open Journey", which opens the Journey. AC-4.2: it stays until closed or the user navigates away. AC-4.3: other toasts are unchanged. AC-4.4: the announcement is made through the live region already in `Toast.tsx` (TD-WS13-004, Milestone B). |
| 5 | **WS13-P1-G / C-12** — no permanent Journey reference on the converted planning record | 020B C-12: under the stage pill of a closed record with outcome Confirmed: **"Converted to Journey JRN-1047 →"**, linking to the Journey | AC-5.1: the line appears only on Confirmed records that have a Journey. AC-5.2: it links to the Journey. AC-5.3: Lost and other records are unchanged. |
| 6 | **WS13-P1-I** — the refusal reads "Not provisioned as Workspace staff." for both deactivated and never-provisioned users | `DEC-R1.3-026` (plan §12.3 default, confirmed): one neutral message, **"You don't have access to the SMV Workspace. If you think this is a mistake, please contact an Administrator."** | AC-6.1: the sign-in refusal shows exactly this message for both cases. AC-6.2: the API 403 body for both cases is neutral and discloses no account state. Rad uses the same sentence unless Sophie specifies a different API wording before implementation. |
| 7 | **TD-WS13-005** — the browser session is kept after refusal | `TECH-DEBT.md`; plan §10 | AC-7.1: on refusal of a deactivated or unprovisioned user, the Supabase session is signed out, then the message in item 6 is shown. AC-7.2: a later visit does not reuse the session. |
| 8 | **TD-WS13-003** — unused `fetchWorkspaceUserRole` | `TECH-DEBT.md` | AC-8.1: `useWorkspaceAuthUser` uses `fetchWorkspaceUserAccess`. AC-8.2: `fetchWorkspaceUserRole` is removed with no remaining reference. AC-8.3: behaviour is unchanged. |

**Already implemented, verify only.** TD-WS13-004 (Toast live region) went into `Toast.tsx` in Milestone B (`026` §12; accepted `DEC-R1.3-030`). This card re-uses it and does not re-implement it.

## 4. Out of Scope

- **Milestone B parked observations OBS-B1 to OBS-B9**, and any microcopy from Sophie's confirmation of them. Per the Product Owner (PO-6, `DEC-R1.3-031` (4)), an observation does not become engineering scope because it was recorded during implementation. A Sophie-confirmed change enters engineering only through a separately approved amendment to this card.
- **WS13-P1-H** for the Journey Planning screens (backlog BP-P1-02, `DEC-R1.3-026`).
- **TL-06** (User Administration; out of Phase 1, PO Decision 2).
- **ED-02**: the shipped text is confirmed (020B S-2). No code change.
- Any change to M11, schema, RLS, RPCs, dependencies, environment variables, infrastructure, API contracts beyond the refusal message in item 6, or Journey Planning business rules.
- Any shared-database read or write, Preview or Production deployment, or push.
- TD-WS13-006 and the RLS hardening card.

## 5. Prerequisites

| # | Prerequisite | Owner | Status at issue |
|---|---|---|---|
| **P-1** | **Milestone B preserved:** the complete working tree transferred to the Mac branch `ws13-milestone-b` and committed locally (`DEC-R1.3-031` (1)). **No WP-1.9 change is made before this commit exists.** | Rad | Open |
| P-2 | Workspace Readiness Check on the Mac (Project Instructions §14–§15): root, branch `ws13-milestone-b`, `git status` clean after the preservation commit | Rad | — |
| P-3 | Read `web/AGENTS.md` and the relevant `node_modules/next/dist/docs/` guides before any new pattern (Next.js 16) | Rad | — |
| P-4 | Approved copy: items 4–6 use the wording in §3 exactly. Anything not in §3 needs Sophie first. | Rad / Sophie | Ready |

## 6. Engineering Constraints

1. **Branch.** Work on `ws13-milestone-b` on top of the Milestone B commit. Whether `feature/r1.3-ws13-journey-workspace` is fast-forwarded to it at Checkpoint 4 is decided at Checkpoint 3 (Checkpoint 3 package item 3-12; runbook B-D6).
2. **Preservation.** No work may exist only in a cloud container at the end of any working session or at any checkpoint. Either work directly on the Mac working tree, or sync to it before stopping (lesson from Milestone B, `EBC-R1.3-WS13-027` §3).
3. **Smallest complete change.** Reuse the existing directory, toast and auth helpers. No refactoring beyond the items.
4. **Testing.** Local only. Test records are named `QA-WS13-P1-*`. No credentials are handled by Team Satvi.

## 7. Validation Expectations (engineering side, plan §14.1 and §14.5)

| Check | Expectation |
|---|---|
| `tsc --noEmit`; `eslint .` | 0 errors; no new warnings |
| `verify:*` | All WS13 scripts pass; the four known Release 1.2 failures unchanged and still identical to `1f73a4b` |
| Production build (local) | Passes; state the limitations (fonts, stand-in) as in `026` §4.1 |
| WS12 focused regression (engineering side, `020` §14.5) | Conversion happy path and each block; Confirm dialog owner name (TL-01); replacement banner link (TL-02); converted-record line (C-12); Trip Basics; stage; claim; reassign; History |
| WS11 foundation regression (engineering side) | Sign-in; header name (TL-05); deactivated and unprovisioned refusal with sign-out (items 6–7); desktop and mobile navigation; Dashboard; Quick Actions (CM-03) |
| Milestone B regression | Journey page suite and Gate 1 actions re-run, since `Toast.tsx` and auth are shared |
| Accessibility | The toast action is reachable by keyboard; announcements are polite |

Preview-side regression and the live checks are plan **E7**, after Checkpoint 4. They are not part of this card.

## 8. Deliverables

| # | Deliverable |
|---|---|
| D-1 | Implementation of items 1–8 |
| D-2 | Completion report **`EBC-R1.3-WS13-029`** (Rad): files created, modified and deleted; mapping to AC-1.1 … AC-8.3; checks and exact results; regression results; limitations; Git status. Repository copy plus Project Knowledge copy. |
| D-3 | Commit: **requested in the report, not assumed.** Rad asks the Product Owner to authorise one local commit (no push) once the checks pass. |

## 9. Risks

| Risk | Mitigation |
|---|---|
| Auth and sign-out changes affect every Workspace page | WS11 regression in §7; deactivated and unprovisioned cases tested both before and after |
| `Toast.tsx` is shared by Journey Planning and Journey Workspace | Milestone B and WS12 regression |
| Loss of work if it is kept in a cloud copy | Constraint 6.2 |
| Scope creep from parked observations | §4; PO-6 |

## 10. Sequencing and Decision Points

Sequence (Product Owner, 8-Oct-2026): preservation commit → Checkpoint 3 → **WP-1.9 under this card** (may run in parallel with Checkpoint 3) → Checkpoint 4 → E7 Preview validation → regression and remaining Checkpoint 5 requirements → Tiger's Phase 1 Engineering Completion determination → QA handover.

| Decision | Owner | When |
|---|---|---|
| API 403 wording if it differs from AC-6.1 | Sophie | Before item 6 |
| Local commit of WP-1.9 | Vivek | On D-2 |
| Push and deployment | Vivek | Checkpoint 4 only. Separate from this card. |

---

*Issued by Tiger, Delivery Manager, on behalf of Team Satvi, 8 October 2026, under the Product Owner's authorisation PO-5.*
