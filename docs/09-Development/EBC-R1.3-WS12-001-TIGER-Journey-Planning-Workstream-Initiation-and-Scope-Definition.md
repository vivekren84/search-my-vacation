# Search My Vacation

# EBC-R1.3-WS12-001 — Journey Planning Workstream Initiation & Scope Definition

**Persona:** Tiger — Programme and Delivery Lead
**Release:** 1.3
**Workstream:** WS12 — Journey Planning (first Workspace Business Module)
**Phase:** Workstream Initiation & Scope Definition
**Status (this card):** Initiation — governance framing only
**Date:** 19 September 2026
**Type:** Governance and delivery-planning activity only. No Product Discovery, Business Analysis, UX, Architecture, Engineering or QA work has been performed under this card.

---

## 0. Workspace Readiness Check (Project Instructions §14 / §15)

| Check | Result |
|---|---|
| Task type | Workstream initiation and scope-framing (Tiger) — a governance/planning deliverable, not repository inspection, implementation, or repository-based validation |
| Local repository connection this session | **Not connected.** This session is bridged to the device `viveks-laptop-local`, but no folder has been attached to it yet |
| Repository-based execution required by this card | No. This EBC's own scope explicitly excludes Product Discovery, UX, Architecture, Engineering and QA, and instructs that no solution design be performed. The charter below is built entirely from this card's own text and the Claude Project's existing governance record (Section 1) |
| Repository Root (expected, per project convention) | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Consequence | Per §14, repository-based execution is stopped and disclosed rather than silently substituted. This charter is filed to the Claude Project now, under the same convention used for `FCR-R1.3-001` when no repository connection was available. The single repository artefact this EBC calls for — `docs/09-Development/EBC-R1.3-WS12-001-TIGER-Journey-Planning-Workstream-Initiation-and-Scope-Definition.md` — has **not** been created in the repository and remains an open follow-up until a folder is connected (Section 9) |
| Branch / commit / push | None performed — no repository file was touched |

---

## 1. Mandatory Review — What Was Found in the Governance Record

Before drafting, the following Claude Project documents were reviewed as evidence, per Project Instructions §17 (Source of Truth) and §35 (do not ask when evidence exists):

- **`EBC-R1.3-WS11-015`** (Workspace Foundation Governance Transition & Release Synchronisation) — confirms WS11 formally closed 18-Sep-2026, the Workspace Foundation **Accepted with Conditions**, and recorded as `DEC-R1.3-011`: the approved platform baseline for all future Workspace modules. The two closure conditions were both repository-governance items (committing the WS11 engineering change set and its evidentiary reports) — not outstanding product or engineering defects.
- **`EBC-R1.3-GOV-003`** (Workspace Business Module Workstream Allocation & Release Governance Synchronisation) — confirms Workstream identifiers WS12–WS17 are **reserved** (`DEC-R1.3-012`) for the six Workspace Business Modules, with WS12 specifically allocated to **Journey Planning**. That card is explicit that the WS12–WS17 order is not a delivery commitment — only the identifiers are fixed. It also discloses that the Product Owner has since committed the Workspace Foundation to git (commit `73f5431`, 18-Sep-2026), which independently corroborates the Foundation's completion.
- **`FCR-R1.3-001`** (Future Considerations Register) — reviewed for any already-identified, intentionally-deferred item bearing on Journey Planning. None exists yet: the register's current entries trace to Release 1.3 Workstreams 1 (Destination Intelligence) and 2 (Traveller Stories) only. Journey Planning has no open Future Consideration to inherit at this time.

This confirms the two facts this EBC's Background section asserts — WS11's closure and WS12's reservation — are independently corroborated in the governance record, not merely restated from the card's own text.

---

## 2. Executive Summary

Workstream 11 (Workspace Foundation) is formally closed and stands as the accepted platform baseline for all Workspace development. Workstream identifier **WS12** is reserved for **Journey Planning**, the first of six Workspace Business Modules. This card opens WS12 at the governance level only: it defines why Journey Planning exists, what it must eventually do, who it serves, what it depends on, and how it will move through Team Satvi's delivery lifecycle. It authorises no design, no data model, no code, and no QA activity — those begin at WS12-002 (Product Discovery) onward, each requiring its own EBC and its own persona sign-off.

Journey Planning is the operational bridge between traveller acquisition and journey execution: it is where a raw enquiry becomes a qualified, proposed, and ultimately approved journey, without the Workspace user ever leaving the tool.

---

## 3. Business Vision

Journey Planning is the first operational capability built on the Workspace Foundation. It exists to let a Workspace user take a traveller from first contact to an approved journey — enquiry receipt, qualification, traveller communication, follow-up management, planning-task tracking, proposal creation, and conversion into an approved journey — entirely inside the Workspace, with no parallel tooling required.

It sits at the seam between two halves of the SMV business:

```
Traveller Acquisition  →  Journey Planning  →  Journey Execution
```

Everything upstream of Journey Planning (public site discovery, Journey Passport, Journey Director) generates the enquiry. Everything downstream (the Journey Workspace, Itinerary Studio, Vendor Management) executes what Journey Planning approves. Journey Planning's business value is specifically in that middle bridge — without it, an enquiry has nowhere structured to go once it leaves the public-facing product.

This vision, and the object list, lifecycle sketch and stakeholder list below, are stated exactly as the originating EBC framed them (per Project Instructions §17, the EBC itself is a primary source). None of it has been elaborated, re-interpreted, or extended beyond what the card itself already asserts — that elaboration is explicitly Product Discovery's job (WS12-002, Arjun), not this card's.

---

## 4. Scope Definition

### 4.1 In Scope for This Card (WS12-001)

- Workstream vision and business objective (Sections 3, 5)
- Scope boundary for the workstream as a whole (this section)
- Stakeholder identification (Section 6)
- Dependency analysis on the Workspace Foundation (Section 7)
- Success criteria for this initiation card (Section 8)
- Recommended workstream lifecycle and persona sequencing (Section 9)
- Governance recommendation and Product Owner decision points (Sections 10–11)

### 4.2 Explicitly Out of Scope for This Card

Per the EBC's own instruction, none of the following have been performed under WS12-001:

- UX design or interaction specification
- Technical architecture, data model, schema, or API design
- Screen design or component design
- Engineering implementation of any kind
- QA or functional validation
- Any repository change beyond this one governance document

Any of the above surfaced informally while drafting this charter is recorded as an observation or open question for the appropriate future persona (Sections 6.3, 7.3) — never actioned here.

### 4.3 Workstream-Level Scope (for WS12 as a whole, to be refined at each subsequent stage)

Journey Planning is expected to eventually enable Workspace users to:

- receive traveller enquiries into the Workspace;
- qualify enquiries against fit and priority;
- communicate with travellers from within the Workspace;
- manage follow-ups and planning tasks against an enquiry;
- create and manage proposals;
- convert an approved enquiry into a created journey, handed off to the Journey Workspace.

This is a business-objective-level scope statement only. The initial business objects Product Discovery is expected to analyse — Lead, Traveller, Journey, Planning Task, Follow-up, Proposal, Activity, Note — are listed in Section 7.2 as **candidates for analysis**, not an approved data model; per the EBC, "No data model shall be produced" under this card.

---

## 5. Business Objective

Enable Workspace users to move a traveller enquiry through qualification, communication, follow-up, proposal, and conversion into an approved journey — without leaving the Workspace — in a way that preserves the same principles governing every other SMV surface: build trust before selling, treat every traveller as unique, and keep the experience warm, clear and non-pushy even in an internal operational tool.

---

## 6. Stakeholder Analysis

| Stakeholder | Role in Journey Planning | Nature of Interest |
|---|---|---|
| Workspace Administrator (internal) | Configures and oversees Workspace usage for Journey Planning | Needs the module to fit inside the existing RBAC, navigation and dashboard shell delivered by WS11, without reopening Foundation scope |
| Workspace User (internal) | Primary day-to-day operator: qualifies enquiries, communicates with travellers, manages tasks, builds proposals, converts journeys | Needs an efficient, low-friction operational tool; is the direct user of every capability in Section 4.3 |
| Traveller (external) | Subject of the enquiry-to-journey lifecycle; receives communication and proposals generated inside Journey Planning | Needs continuity and consistency with their upstream experience (Journey Passport / Journey Director) — the SMV principle of "warm, clear, reassuring" applies to Journey Planning's traveller-facing outputs (e.g. proposals, communications) even though the tool itself is internal |
| Vendors / DMCs / Tour Operators (future) | Not active in this workstream; named in the source EBC as a future stakeholder group | No current interest — flagged only so a future workstream does not have to re-discover this dependency |
| Product Owner (Vivek) | Final decision and release authority across all of Team Satvi's work, including this workstream | Owns every scope, sequencing, and release decision named in Section 11 |

### 6.1 Persona Stakeholders (Internal to Delivery)

Per Section 2 of the source EBC and the standing Team Satvi model, the personas with a defined role across WS12's lifecycle are Tiger (this card), Arjun (Product Discovery/Business Analysis), Sophie (UX), Archie (Architecture), Rad (Engineering) and Keerthi (QA). Each owns only its own discipline per Project Instructions §2; none may approve another's work.

### 6.2 Stakeholders Not Yet Engaged

No stakeholder beyond the Product Owner has been consulted for this card, consistent with its governance-only nature. Traveller-facing and Workspace-user-facing requirements gathering is Arjun's responsibility at WS12-002.

### 6.3 Open Question (flagged for Arjun, not resolved here)

The source EBC names "Vendors / DMCs / Tour Operators" as future stakeholders but gives no indication of whether any vendor-facing touchpoint is expected within Journey Planning itself (as opposed to a later Vendor Management module, already reserved as WS16). This is noted as an open question for Product Discovery rather than assumed either way.

---

## 7. Dependency Analysis

### 7.1 Confirmed Dependency: Workspace Foundation (WS11)

Journey Planning depends on the Workspace Foundation, specifically:

- Authentication
- RBAC (role-based access control)
- Navigation
- Dashboard
- Workspace Shell
- Shared Components

**Status of this dependency, independently verified against the governance record (Section 1):** WS11 is formally closed and the Foundation is recorded as the Product Owner's Accepted-with-Conditions baseline (`DEC-R1.3-011`). The two closure conditions were repository-governance matters (committing the engineering change set and its evidentiary reports), not functional gaps in Authentication, RBAC, Navigation, Dashboard, Workspace Shell or Shared Components — none of the six named Foundation capabilities themselves is recorded as incomplete or at risk. This dependency is therefore **satisfied** for the purpose of opening WS12 at the governance level.

### 7.2 Initial Business Objects (Candidates for Product Discovery — Not a Data Model)

The source EBC names the following objects as expected subjects of Product Discovery: Lead, Traveller, Journey, Planning Task, Follow-up, Proposal, Activity, Note. These are recorded here exactly as candidates, per the EBC's own instruction that "No data model shall be produced" under this card. Confirming, renaming, merging or extending this list is Arjun's task at WS12-002, in consultation with Archie once architecture review begins (WS12-005 in the proposed lifecycle).

### 7.3 Dependency Risk Note (disclosed, not acted on)

WS11's closure record (`EBC-R1.3-WS11-015`) named two repository-governance conditions at closure time. `EBC-R1.3-GOV-003` subsequently disclosed that the Product Owner had committed the Foundation to git (commit `73f5431`), which appears to satisfy those conditions, but no card in this Project's record has explicitly re-verified and closed them out. This is not a blocker to opening WS12 — the underlying Foundation capabilities are functionally complete and accepted — but it is flagged here as a small outstanding governance reconciliation item, consistent with how `EBC-R1.3-GOV-003` itself disclosed it (Section 6 of that card) rather than silently correcting it outside its own scope. Recommendation: a future Tiger governance card can close this out; it does not need to block Arjun's Product Discovery start.

### 7.4 No Other Dependencies Identified

No dependency on any other reserved Workspace Business Module (WS13–WS17) has been identified. The source EBC and `EBC-R1.3-GOV-003` both confirm the six reserved identifiers carry no implied sequencing — Journey Planning does not require any of the other five modules to exist first.

---

## 8. Success Criteria (for This Card)

- [x] WS12 formally initiated as a workstream, distinct from WS11 and from the other five reserved Workspace Business Modules
- [x] Workstream vision and business objective defined (Sections 3, 5)
- [x] Scope boundary agreed — in scope, out of scope, and workstream-level scope distinguished (Section 4)
- [x] Stakeholders identified, internal and external, current and future (Section 6)
- [x] Dependency on the Workspace Foundation identified and independently verified as satisfied (Section 7)
- [x] Workstream lifecycle and persona sequencing established (Section 9)
- [x] Repository unchanged — no file created or modified in the repository by this card (Section 0)
- [x] No Product Discovery, Business Analysis, UX, Architecture, Engineering or QA activity performed
- [x] No solution design performed; no data model produced

This workstream is ready to proceed to Product Discovery (WS12-002) once the Product Owner reviews this charter.

---

## 9. Recommended Workstream Lifecycle

The following sequence follows the source EBC's own proposed lifecycle table, expanded with each stage's exit criteria.

| Stage | Persona | Purpose | Exit Criteria |
|---|---|---|---|
| WS12-001 | Tiger | Workstream initiation and scope definition (this card) | Product Owner reviews and accepts this charter |
| WS12-002 | Arjun (Product Discovery) | Confirm business intent, business rules, actors, triggers, exceptions; resolve the object list in Section 7.2; produce acceptance-criteria-ready requirements | Requirements complete and traceable; open questions (Section 6.3) resolved or explicitly deferred |
| WS12-003 | Arjun (continued, if requirements work spans more than one card) | Detailed functional requirements and business rules | As above |
| WS12-004 | Sophie | UX structure, interaction design, information architecture for the approved requirements | UX recommendations ready for architecture and engineering handoff |
| WS12-005 | Archie | Architecture review — component boundaries, data flow, integration and data-model implications of the objects in Section 7.2 | Architecture approach approved; any new dependency justified |
| WS12-006 | Rad | Engineering planning and implementation strategy | Implementation plan ready for approved-EBC execution |
| WS12-007+ | Rad | Engineering implementation, in approved-EBC increments | Each EBC's acceptance criteria met; lint/type/build checks pass |
| QA | Keerthi | Independent functional validation and regression | Passed / Failed / Blocked recorded per Project Instructions §29 |
| Product Acceptance | Vivek | Final decision authority | Accept / Rework / Defer / Accept Known Risk |
| Governance Closure | Tiger | Consolidate findings, synchronise release governance documents, formally close WS12 | Governance record matches implemented and accepted state |

Final numbering beyond WS12-006 will be determined during WS12-006's own implementation planning, per the source EBC.

Not every stage above requires a separate EBC in practice — Tiger will select and size stages at each handoff, per Project Instructions §12.

---

## 10. Governance Recommendation

1. **Open WS12 at the governance level now.** The Foundation dependency is satisfied (Section 7.1) and no blocker has been identified to starting Product Discovery.
2. **Route WS12-002 to Arjun** as the next card, scoped strictly to Product Discovery and Business Analysis — no UX, architecture, or engineering content.
3. **Carry the two open items forward explicitly** rather than resolving them here: the vendor-touchpoint question (Section 6.3) and the WS11 repository-governance reconciliation (Section 7.3). Neither blocks Product Discovery.
4. **Do not update `RELEASE-1.3.md` or `RELEASE-1.3-FEATURE-REGISTER.md` from this card.** This EBC's own Repository Impact section authorises creation of one file only; changing WS12's status from `🔒 Reserved` to `In Progress` in those governance documents is a small follow-up governance-synchronisation action, recommended once (a) the Product Owner accepts this charter and (b) a repository connection is available to make the edit against the live files rather than from a stale in-Project copy.
5. **Repository placement remains pending.** This document should be created at `docs/09-Development/EBC-R1.3-WS12-001-TIGER-Journey-Planning-Workstream-Initiation-and-Scope-Definition.md` once the local repository folder is connected to this session; until then it is held in the Claude Project only, per the precedent set by `FCR-R1.3-001`.

---

## 11. Product Owner Recommendations — Decisions Required

Per Project Instructions §31, only genuine decision points are listed; nothing here manufactures consensus where none exists.

| # | Decision Needed | Recommendation | Why It's the Product Owner's Call |
|---|---|---|---|
| 1 | Accept this charter and formally move WS12 from `🔒 Reserved` to `In Progress`? | Accept | Release-governance status change (Project Instructions §10) |
| 2 | Authorise Arjun to begin Product Discovery (WS12-002)? | Authorise | Scope/sequencing decision |
| 3 | Should the vendor-touchpoint question (Section 6.3) be resolved before or during Product Discovery? | During — treat it as a standard Arjun open question, not a pre-condition | Avoids delaying Product Discovery over a scoping detail Arjun is equipped to resolve |
| 4 | Should the WS11 repository-governance reconciliation (Section 7.3) be closed out now or deferred to a future Tiger governance card? | Defer — it does not block WS12 | Governance housekeeping, not a WS12 blocker |
| 5 | When a local repository connection is next available, should this charter be committed to `docs/09-Development/` verbatim, or reviewed for edits first? | Reviewer's choice — flagged here only so it isn't forgotten | Repository placement decision (Project Instructions §14/§27) |

---

## 12. Repository Impact (Confirmed)

| Expected by EBC | Actual, this card |
|---|---|
| Create `docs/09-Development/EBC-R1.3-WS12-001-TIGER-Journey-Planning-Workstream-Initiation-and-Scope-Definition.md` | **Not created** — no repository folder connected this session (Section 0). This document is instead saved to the Claude Project as `claude/EBC-R1.3-WS12-001-TIGER-Journey-Planning-Workstream-Initiation-and-Scope-Definition.md`, to be mirrored into the repository once a folder is connected |
| No other repository artefact modified | Confirmed — no other file was read, written, or staged |

---

## 13. Confirmations

- Only this governance/planning document was produced.
- No application code, configuration, schema, or Supabase object was created, modified, or removed.
- No UX, architecture, engineering, or QA activity was performed.
- No data model was produced; the object list in Section 7.2 is recorded as candidates only.
- No branch was created or switched; no commit or push was performed (no repository connection was available this session).
- The Workspace Foundation dependency was independently re-verified against the governance record rather than taken solely on the source EBC's own assertion (Section 1).

---

*Prepared by Tiger, Programme and Delivery Lead, on behalf of Team Satvi, per EBC-R1.3-WS12-001. This charter is submitted for Product Owner review and, on acceptance, sets up EBC-R1.3-WS12-002 — Journey Planning Product Discovery (Arjun).*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QrQUZC7JxnmU18X9heRBFQ