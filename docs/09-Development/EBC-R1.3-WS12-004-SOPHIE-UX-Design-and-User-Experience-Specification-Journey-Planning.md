# Search My Vacation

# EBC-R1.3-WS12-004 — UX Design & User Experience Specification: Journey Planning

**Persona:** Sophie — Senior UX Designer
**Release:** 1.3
**Workstream:** WS12 — Journey Planning (first Workspace Business Module)
**Phase:** UX Design & User Experience Specification
**Status:** UX Design Complete — ready for Archie (WS12-005, Solution Architecture) and Rad (WS12-006, Engineering Planning). **Revision 2 baseline in effect (22 September 2026, `EBC-R1.3-WS12-012`) — see Document Revision History below.**
**Date:** 19 September 2026 (original); amended 22 September 2026

---

**Document Revision History**

| Revision | Date | Trigger | Change |
|---|---|---|---|
| 1 | 19 September 2026 | Original UX Design Specification (this card) | Initial baseline — Sections 1-21 as approved, translating `EBC-R1.3-WS12-003` Revision 1 into UX. |
| 2 | 22 September 2026 | `EBC-R1.3-WS12-012` — Journey Planning UX Refinement: Planning Parameters & Progressive Enrichment, following Product Owner Ratification (`EBC-R1.3-WS12-011B`) of the Minimum Planning Information gap (`EBC-R1.3-WS12-011A`) | Amends Section 7 (Screen Inventory - JP-03, JP-04 rows), Section 8.1 (Create interaction flow) and adds new Section 8.1a, Section 11 (Component Catalogue - two new rows), Section 14 (Validation Feedback - new Completion type), Section 18 (two new UX Design Decisions), Section 19 (one new UX Risk). No other section is changed by Revision 2. Superseded text is struck through and retained, never deleted, per this project's supersede-not-delete convention. Full rationale and field-level detail in `EBC-R1.3-WS12-012`, the companion decision record for this amendment. |

---

## 0. Repository Readiness Check (Mandatory — Project Instructions §14/§15)

| Check | Result |
|---|---|
| Task type | UX Design & User Experience Specification (Sophie) — a design-specification deliverable, translating WS12-003's approved Business Analysis into UX; no Product Discovery, Business Analysis, Architecture, Engineering or QA performed |
| Local repository connection this session | **Not connected.** This session is bridged to the device `viveks-laptop-local`, but no folder has been attached to it yet |
| Repository Root (expected, per project convention) | `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Branch | Cannot be confirmed without a connection |
| Working tree | Cannot be inspected without a connection |
| Destination folder existence (`docs/09-Development/`, `docs/04-UX/journey-planning/`) | Not verified this session — both are attested as existing by every prior WS11/WS12 card that did have a connection (most recently `EBC-R1.3-WS12-003`, this pass's own §0), and by this Project's synced GitHub source, which includes `/docs/04-UX/` and `/docs/09-Development/` |
| Consequence, per §14 | Repository-based execution is stopped and disclosed rather than silently substituted, exactly as `EBC-R1.3-WS12-001` handled the same condition. This specification is filed to the Claude Project now, at the same relative path the repository expects (`claude/EBC-R1.3-WS12-004-SOPHIE-UX-Design-and-User-Experience-Specification-Journey-Planning.md`), to be mirrored into `docs/09-Development/` once a folder is connected. GitHub is not used as a silent substitute for the live local workspace; it is used only as an inspection source for the already-synced `docs/04-UX/` reference material cited throughout this document (Section 1), consistent with §14's own allowance |
| Branch / commit / push | None performed — no repository file was touched this session |

**Recommendation to Tiger, not actioned by this card:** connect the local repository folder so this specification (and any optional supporting artefacts under `docs/04-UX/journey-planning/`) can be committed to its canonical location, and so this card's own repository verification (Section "Repository Verification" below) can be completed rather than deferred.

---

## Inputs Consumed (Mandatory)

The following were reviewed in full before drafting this specification, per this EBC's own instruction:

**Workstream artefacts**

- `EBC-R1.3-WS12-001` — Journey Planning Workstream Initiation & Scope Definition (Tiger): business vision, stakeholder analysis, dependency on the Workspace Foundation.
- `EBC-R1.3-WS12-002` — Business Domain Discovery & Product Discovery (Arjun), including its second/final continuation incorporating the three Product Owner ratifications (Proposal Model, Journey Planning Entry Model, Single Business Object Principle).
- `EBC-R1.3-WS12-003` — Business Analysis & Functional Requirements (Arjun): the seven-stage lifecycle with entry/exit criteria, the full Business Object Catalogue, all 30 approved Functional Requirements (`FR-JP-01`–`30`), Business Rules, Validation Rules, Permissions, Notifications, Search, Audit, Reporting Requirements, Exception Scenarios and Integration Points. This is the primary, authoritative input for this specification — every screen, flow and interaction below traces back to it.

**Workspace Foundation**

- `EBC-R1.3-WS11-005` — Product Ratification and Release Governance Synchronisation (`DEC-R1.3-011`: Workspace Foundation accepted as the platform baseline).
- `EBC-R1.3-WS11-011` and its continuations (`-011A` through `-011I`) — Workspace Dashboard Foundation implementation, the Product Owner's navigation/header/KPI ratifications, the UX Refinement pass (`-011D`), and the final QA/regression verification. These establish the actual shipped Workspace Shell, Navigation, Header, Dashboard, Empty State and Coming Soon patterns this specification reuses rather than reinvents.
- `EBC-R1.3-WS4-002` — UX Baseline Tracker Synchronisation: confirms the six-document Workspace UX Architecture package (`WORKSPACE-UX-DISCOVERY.md`, `WORKSPACE-INFORMATION-ARCHITECTURE.md`, `WORKSPACE-NAVIGATION-MODEL.md`, `WORKSPACE-USER-JOURNEYS.md`, `WORKSPACE-INTERACTION-FLOWS.md`, `WORKSPACE-SCREEN-INVENTORY.md`) as the Workspace-wide UX baseline, and the 43-screen inventory in which Journey Planning's own screens (`JP-01`–`JP-09` and onward) were first provisioned at a structural level.
- `docs/04-UX/COLOR-SYSTEM.md`, `docs/04-UX/DESIGN-TOKENS.md` — the documented token system (noting the known, previously-disclosed divergence between these documents' blue/orange palette and the live warm espresso/amber/cream system, per `PR-007` in `EBC-R1.2-WS4-05`).
- `EBC-R1.3-WS11-011D` — Workspace UX Refinement Implementation Report: the actual live token values, component treatments and layering (z-index) model this specification builds on directly, since it reflects what Rad shipped, not what the (disclosed-as-stale) token documents describe.

**Workspace Design Language (as actually shipped, reconciled per `PR-007`)**

- Colour: `--color-cream` (`#FFFDFC`), `--color-espresso` (`#2A211C`), `--color-amber` (`#F5951C`), `--color-border-warm` (`rgb(154 100 46 / 24%)`), `--color-border-warm-strong` (`rgb(154 100 46 / 30%)`) — the live warm palette, not the documented blue/orange system.
- Typography: an editorial serif for large headings and KPI values, paired with the documented sans-serif (Plus Jakarta Sans) for body copy, labels, captions and buttons — the same pairing observed site-wide in `EBC-R1.2-WS4-02`.
- Layering: header `z-30`, user-menu dropdown `z-40`, mobile navigation drawer overlay `z-50`.
- Breakpoint: `md` (768px) is the Workspace's own governing breakpoint for the sidebar-to-drawer navigation switch (distinct from the documented `DESIGN-TOKENS.md` breakpoint scale, which this specification does not otherwise depart from).
- Motion: the existing `.journey-passport-reveal` utility for entrance animation; no new CSS/motion primitive introduced by any WS11 UX pass.

**Product**

- `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` (§6.3, §7.3–§7.12, §9, §10.1) and `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md` — read in full via `EBC-R1.3-WS12-002`/`-003`'s own citation chain; not re-opened independently this pass since both Business Analysis cards already extracted every relevant provision and no new citation is needed for UX-level work.
- `claude/PRODUCT-EVOLUTION-BACKLOG.md` (`PEB-001`, Journey Amendment) — cited as a scope boundary only; not opened or modified.

**Governance**

- `docs/10-Backlog/RELEASE-1.3.md`, `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` — not opened or modified this pass; WS12's status transition is a Tiger governance action, not a Sophie one.
- Team Satvi operating principles (SMV Claude Project Instructions v2.1), Sections 6, 16.4, 22 and 23 in particular.

No referenced artefact was found missing or materially contradicted by another. Where `EBC-R1.3-WS12-003` itself carried forward an Open Question relevant to UX (traveller communication channel, unclaimed-record notification threshold, Corporate Point of Contact field shape), this specification treats it exactly as that card intended — as a UX-level design decision Sophie may reasonably propose without reopening it as a business question (Section 18).

---

## 1. UX Goals

Journey Planning is the first Workspace Business Module a real Workspace User will operate end to end, so its UX carries disproportionate weight in setting the tone for every module that follows (Journey Workspace, Traveller Hub, Itinerary Studio, Vendor Management, Destination Intelligence). Its goals:

1. **Make Journey Planning feel like a natural extension of the Workspace Foundation**, not a bolted-on module — same shell, same navigation, same header, same card and empty-state language, same warm palette and editorial typography already shipped in WS11.
2. **Reduce cognitive load at every stage of a seven-stage lifecycle** by surfacing only what the current stage needs (Progressive Disclosure), rather than presenting every field, every object type and every action on one screen regardless of where the record actually is.
3. **Make ownership and status unambiguous at a glance** — a Workspace User scanning the queue should immediately know what is unclaimed, what is theirs, what is stalled, and what needs their attention next, without opening a record.
4. **Protect the business rules that matter most in the interface itself** — exactly one active Proposal, mandatory Traveller/Corporate Point of Contact association, duplicate prevention before creation, one-way conversion to Journey — so the UX makes the wrong action difficult to reach rather than merely possible-but-warned-against.
5. **Preserve the same warmth and trust the public-facing product already establishes.** Journey Planning's traveller-facing outputs (the Proposal a Traveller receives) are the one place this internal tool touches the traveller directly; its presentation must not contradict the "build trust before selling," "warm, clear, reassuring" principles that govern the rest of Search My Vacation.
6. **Support the full operational range from a five-minute Website-enquiry claim to a weeks-long Corporate proposal cycle** without the interface feeling either too sparse for the complex case or too heavy for the simple one.

---

## 2. Design Principles (Journey Planning Specific)

Building on the Workspace-wide principles already established (Repository First, Business Before UX, Single Source of Truth, UX Consistency, Progressive Disclosure, Calm Workspace, Accessibility), Journey Planning adds:

- **Stage tells the story, ownership tells who's responsible.** These are deliberately separate visual channels (per `FR-JP-23`, Separation of Business Concepts) — never collapse them into a single status chip that tries to communicate both.
- **The Proposal is singular and central.** Because exactly one Proposal is ever active per record (`FR-JP-14`), the UX never presents "Proposals" as a list-first pattern the way Vendor Quotations correctly are; it presents "the Proposal" as a persistent, prominent object with its version history available but subordinate.
- **Vendor Quotations are supporting evidence, not the headline.** They inform the Proposal but are never displayed with equal visual weight to it, and never in any surface a vendor could reach (`FR-JP-21` is a hard UX boundary, not just a permissions rule).
- **Every irreversible action earns a deliberate, distinguishable moment.** Confirming a record into a Journey, and any Closed outcome, are the two points in this module with no way back — the UX treats them differently from routine stage progression (Section 8).
- **Association is asked once, clearly, and never left ambiguous.** The Traveller-or-Corporate-Point-of-Contact choice (`FR-JP-10`) is presented as a single, mutually exclusive decision at creation, not two independently-optional fields a user could leave both empty or both filled.
- **Show the duplicate-prevention check before the user has invested effort**, not as a rejection after they finish filling in a form (Section 8.1).

---

## 3. Primary User Personas

### 3.1 Workspace User

The day-to-day operator: claims records, runs Discovery conversations, builds and revises the Proposal, records Vendor Quotations, manages Tasks and Follow-ups, and converts approved records into Journeys. Works across a mix of fast-moving Website/WhatsApp enquiries and slower, higher-touch Corporate or Referral opportunities, often several records at different lifecycle stages simultaneously. Primary device: desktop or laptop, at a desk, for extended sessions; occasionally checks a Follow-up or Task reminder from a tablet.

### 3.2 Administrator

A Workspace User with additional platform-governance authority (`DEC-R1.3-009`): reassigns records regardless of current ownership, and intervenes when a record is stalled or misassigned. Uses Journey Planning less continuously than a Workspace User, but needs a fast path to "show me everything that's stuck or unowned" without having to open each record individually.

---

## 4. User Goals

**Primary**

- Claim a new opportunity and start planning within seconds, without a heavyweight intake process getting in the way of a fast-moving Website or WhatsApp enquiry.
- Always know, at a glance, what stage a record is in and what the next deliberate action is.
- Build a Proposal that reflects real research and vendor input, revise it based on traveller feedback without losing the history of what changed, and send it with confidence that it reached the right person.
- Never accidentally create a duplicate record for a traveller who is already being helped, or a duplicate Journey for an opportunity that already converted.
- Convert a confirmed opportunity into a Journey and know, immediately and unambiguously, that the record's job is done — no ambiguity about what happens to it after handover.

**Secondary**

- Compare vendor commercial input for a given opportunity without confusing it with what has actually been offered to the traveller.
- See a corporate opportunity's identified point of contact as clearly and completely as an individual traveller's details, even though the underlying object is different.
- Retrieve the full history of a closed record — including a Lost or Archived one — for reference, without it cluttering the active queue.
- (Administrator) Identify unowned or stalled records across the whole queue and reassign them in as few actions as possible.

---

## 5. Journey Planning User Journey

End-to-end workflow, expressed as the traveller-adjacent business narrative wrapped around the seven approved lifecycle stages (`EBC-R1.3-WS12-003` §5, §9):

```
Opportunity Arrives (8 channels)
        │
        ▼
 ┌─────────────────┐
 │  Lead Created    │  ← origin recorded, Traveller/Corporate POC association required,
 │                  │    duplicate check surfaced before the record is created
 └────────┬─────────┘
          │ claim
          ▼
 ┌─────────────────┐
 │   Discovery      │  ← requirements captured (destination, dates, budget, companions,
 │                  │    special requests, flight preferences); Discovery Notes & Activities logged
 └────────┬─────────┘
          │ sufficient requirements captured
          ▼
 ┌─────────────────┐
 │    Planning      │  ← the single Proposal is prepared, optionally informed by one or
 │                  │    more Vendor Quotations and a Traveller Itinerary reference
 └────────┬─────────┘
          │ Proposal ready, sent (logged action)
          ▼
 ┌─────────────────┐
 │ Proposal Shared  │  ← current Proposal Version sent to Traveller / Corporate POC
 └────────┬─────────┘
          │ feedback received, changes needed
          ▼
 ┌─────────────────┐
 │    Revision      │  ← new Proposal Version prepared and re-shared (loops back to
 │                  │    Proposal Shared as many times as needed)
 └────────┬─────────┘
          │ no further revision needed
          ▼
 ┌─────────────────┐
 │    Decision      │  ← Traveller / Corporate POC is deciding
 └────────┬─────────┘
          │ outcome recorded
          ▼
 ┌─────────────────────────────────────────────┐
 │                  Closed                       │
 │   Confirmed → Journey (handover, WS13)         │
 │   Lost → retained, never returns               │
 │   Archived → retained, never returns           │
 └─────────────────────────────────────────────┘
```

This is the same seven-stage model `EBC-R1.3-WS12-003` §5 defines at the business level; the UX layer's job is to make every transition in this diagram a deliberate, visible, undoable-only-by-design action, never an implicit side effect of editing a field.

---

## 6. Information Architecture

Journey Planning sits inside the existing Workspace Foundation IA, unchanged at the top level (`WORKSPACE_NAV_GROUPS`, ratified in `EBC-R1.3-WS11-011` §2):

```
Dashboard
Operational
 ├─ Journey Planning   ← this module
 └─ Journey Workspace
Knowledge
 ├─ Traveller Hub
 ├─ Itinerary Studio
 ├─ Vendor Management
 └─ Destination Intelligence
```

Within Journey Planning, the module's own hierarchy:

```
Journey Planning (nav item)
 └─ Queue (JP-01)                          — landing screen for the module
     └─ Journey Planning Record Detail (JP-02)
         ├─ Overview tab                    — identity, stage, owner, association
         ├─ Discovery tab (JP-04)           — requirements, Discovery Notes, Activities
         ├─ Proposal tab (JP-05)            — the single active Proposal + compose/revise
         │   └─ Proposal History (JP-07)    — Proposal Version list, read-only drill-in
         ├─ Vendor Quotations tab (JP-06)   — internal-only commercial input
         ├─ Tasks & Follow-ups tab
         ├─ History / Audit tab (JP-09)     — read-only, full record history
         └─ Traveller Details (JP-02a) / Corporate Point of Contact Details (JP-08)
             — whichever association applies, rendered in place, not as a separate nav destination
 └─ Create Journey Planning Record (JP-03)  — modal/panel, not a standalone route
 └─ Archive View (JP-11)                    — Closed records (Lost/Archived), separate from the active queue
```

**Rationale for keeping Traveller Details and Corporate Point of Contact Details in-place rather than as separate top-level screens:** both are referenced objects (Traveller owned by Traveller Hub, Corporate Point of Contact's ownership open per `OQ-B`), and Journey Planning's job is to show enough of either to plan against, not to duplicate Traveller Hub's own record-management UI (Single Source of Truth principle, Section 2 of the Project Instructions).

**Grouping logic:** the Detail screen's tabs follow the same "Planning Activity" grouping `PO-REVIEW-03` §6 and `EBC-R1.3-WS12-003` §6.10 already establish at the business level (Discovery Notes, Activities, Proposal, Vendor Quotations, Follow-ups, Tasks) rather than inventing a new UX taxonomy.

---

## 7. Screen Inventory

All screen codes continue the `JP-xx` numbering the Workspace Screen Inventory (`WORKSPACE-SCREEN-INVENTORY.md`, `EBC-R1.3-WS4-001`) first provisioned structurally; this card gives each one its full design definition for the first time.

| Code | Screen | Purpose | Primary FRs | Role |
|---|---|---|---|---|
| **JP-01** | Journey Planning Queue | Landing screen for the module; grouped-by-stage queue view, claim action, search/filter entry point | `FR-JP-01`–`05` | Workspace User, Administrator |
| **JP-02** | Journey Planning Record Detail (Overview) | Identity fields, current stage, owner, association (Traveller or Corporate POC), origin channel, quick actions | `FR-JP-07`, `FR-JP-10`, `FR-JP-22`–`23` | Workspace User (own/unclaimed), Administrator (any) |
| **JP-02a** | Traveller Details (in-place panel) | Traveller identity and requirement fields relevant to planning; references Traveller Hub, does not duplicate it | `FR-JP-12`–`13` | Both |
| **JP-03** | Create Journey Planning Record | Origin selection, association capture, duplicate-prevention check, destination/region. **Revision 2:** adds the “Trip Basics” panel (Number of Adults, required; Children, Infants, Intended Travel Month, Number of Nights, Preferred Departure City, present-not-required) — see `EBC-R1.3-WS12-012` §4 | `FR-JP-06`–`11`, `31`, `33` | Both |
| **JP-04** | Discovery | Requirement capture form (destination, dates, flexibility, duration, budget, companions, special requests, flight preferences), Discovery Notes, Activities log. **Revision 2:** adds the persistent, editable Trip Basics panel with a completion indicator, and refines the “Move to Planning” action to surface the `BR-021` gate contextually — see `EBC-R1.3-WS12-012` §5 | `FR-JP-12`–`13`, `34` | Owner, Administrator |
| **JP-05** | Proposal Workspace | Compose/revise the single active Proposal; reference a Traveller Itinerary; attach Vendor Quotations as commercial input; send action | `FR-JP-14`–`18` | Owner, Administrator |
| **JP-06** | Vendor Quotation View | Record and review Vendor Quotations against a record; internal-only, never vendor-facing | `FR-JP-19`–`21` | Owner, Administrator |
| **JP-07** | Proposal History | Read-only list of Proposal Versions for the record's one Proposal, with send/created timestamps | `FR-JP-15`–`16` | Both (read); Owner/Administrator (revise from here) |
| **JP-08** | Corporate Point of Contact Details (in-place panel) | Identified individual representing a Corporate enquiry — name, role, company, phone, email | `FR-JP-11` | Both |
| **JP-09** | Planning Activity Timeline / History | Read-only, complete audit trail: every stage transition, ownership change, Proposal Version created/sent, Vendor Quotation recorded, Task/Follow-up created/completed | `EBC-R1.3-WS12-003` §13 (Audit) | Both (read-only) |
| **JP-10** | Search & Filters | Cross-cutting: filter/sort the queue or any record listing by stage, owner, Traveller, Corporate POC, destination/region, origin channel, created date range | `EBC-R1.3-WS12-003` §12 (Search) | Both |
| **JP-11** | Archive View | Closed records (Lost, Archived), separated from the active queue; retained, never deleted | `PD-JP-007` | Both (read); Administrator (manual archive) |
| **JP-12** | Tasks & Follow-ups (in-place tab) | Create/manage Tasks and Follow-ups scoped to the record | `FR-JP-24`–`25` | Owner (own records), Administrator |
| **JP-13** | Confirm / Close Record | The deliberate, distinguishable moment for recording a Closed outcome (Confirmed/Lost/Archived) and, on Confirmed, the one-way conversion to Journey | `FR-JP-27`–`30` | Owner, Administrator |

**Empty States and Error States** are not separate numbered screens; they are states of JP-01, JP-06, JP-07, JP-09 and JP-11, built on the existing shared `EmptyState` component (Section 13). This follows the same pattern WS11 already established for the Dashboard's Recent Activity / Upcoming Tasks cards and the Coming Soon placeholder — Journey Planning does not invent a second empty-state implementation.

---

## 8. Interaction Flows

### 8.1 Create

1. Workspace User selects **New Journey Planning Record** (from JP-01's primary action, or the Dashboard's existing "New Lead" Quick Action, which routes here).
2. Origin channel selected (one of the eight ratified values, `FR-JP-06`) — for Manual Workspace initiation this is the default; for the seven other channels arriving via an integration, the origin pre-populates and is shown read-only with a "verify" affordance, not a blank re-entry field.
3. **Association step:** a single, mutually-exclusive choice — "For a Traveller" or "For a Corporate contact" (`FR-JP-10`) — not two separately optional fields. Selecting one reveals only the relevant lookup/creation fields for that path.
4. **Duplicate-prevention check runs as the Traveller/Corporate POC and destination are entered, not after submission** (`FR-JP-08`) — an inline, non-blocking result area shows any existing Traveller match and any active Journey Planning Record for that Traveller/destination combination, with a direct link to open the existing record instead of proceeding. This surfaces the check at the moment it's useful, before the user has invested effort in the rest of the form.
5. Destination/Region selected (reference to a Destination Profile).
5a. **(Revision 2, `EBC-R1.3-WS12-012` §4)** The Owner is shown the “Trip Basics” panel: Number of Adults (required, blank-started numeric stepper); Number of Children, Number of Infants, Intended Travel Month, Number of Nights and Preferred Departure City (each present, tagged “Needed before Planning,” none required at this point). Only Adults affects Submit; the other five may be left blank and completed later in Discovery (`FR-JP-33`, Progressive Enrichment). Budget and Exact Travel Date are never presented on this screen (`FR-JP-32`, `BR-024`).
6. **Submit is disabled until the association is present and unambiguous** (`FR-JP-09`) — the UX makes an artificial/placeholder record structurally unreachable rather than merely discouraged. **(Revision 2)** Submit is never additionally gated by Trip Basics completeness; only Number of Adults is required to create the record (`FR-JP-31`).
7. On submit, the record is created at Lead Created, unclaimed, and the user is offered an immediate **Claim and open** action, collapsing what would otherwise be two separate steps for the common case of a user creating a record for themselves to work.

### 8.1a Discovery → Planning Gate (Revision 2, `EBC-R1.3-WS12-012` §5)

A narrow, named exception to the otherwise judgement-based stage progression (Section 5, `EBC-R1.3-WS12-003`): the Discovery → Planning transition additionally requires Children, Infants, Intended Travel Month, Number of Nights and Preferred Departure City to each hold an explicit value (`BR-021`; an explicit zero is valid for Children/Infants/Nights, `BR-023`). The Trip Basics panel (Section 8.1) persists on the Detail screen with a completion indicator (“Trip Basics — *n* of 5 needed before Planning”); the existing “Move to `<Stage>`” control (Section 9) is disabled specifically for the Planning target while incomplete, with an inline note directly beneath it rather than a rejection on click. This is the same Blocking-validation mechanism already used for the Association step at creation (Section 14), applied a second time, not a new mechanism. Full design rationale in `EBC-R1.3-WS12-012` §5.

---

### 8.2 Edit

Editing requirement fields (JP-04), Traveller/Corporate POC details (in-place, deferring to Traveller Hub's own edit surface where that ownership applies), and Discovery Notes/Activities follows standard in-place edit patterns (inline field edit or a lightweight side panel, consistent with the Workspace Foundation's existing card-based editing idiom) with autosave — there is no separate "Edit mode" toggle, since these are low-risk, frequently-revisited fields, unlike the Proposal (Section 8.3) or the Closed decision (Section 8.9), which do warrant a more deliberate flow.

### 8.3 Save Draft (Proposal)

The Proposal is always in exactly one of two states relative to sharing: being drafted, or shared. Composing or revising it (JP-05) autosaves the in-progress Proposal Version continuously (same low-friction pattern as Section 8.2) — "Save Draft" is not a separate button a user must remember to press, since losing draft work on a Proposal is a materially worse failure than on a Discovery Note. The **Send** action (Section 8.4) is the one deliberate, distinguishable step in this flow, not the save.

### 8.4 Submit Proposal (Send)

1. From JP-05, the Owner selects **Send to Traveller** (or **Send to Corporate Point of Contact**, matching the record's association).
2. A confirmation step names the recipient and the current Proposal Version number explicitly — this is a logged, auditable action (`FR-JP-16`) and the interface treats it as such: a lightweight confirm step, not a silent background send.
3. On confirm, the record advances to Proposal Shared and the send is recorded in the Planning Activity Timeline (JP-09) with who/when.
4. If this is the record's first send, this transition is Planning → Proposal Shared; if it follows a Revision, it is Revision → Proposal Shared (Section 8.5) — the UX does not present these as different actions to the user, since the business rule (Section 5, `EBC-R1.3-WS12-003`) treats the transition identically either way.

### 8.5 Revision

1. Feedback is recorded (as a Discovery Note or Activity — this specification does not introduce a separate "Feedback" object type, since none exists in the approved Business Object Catalogue).
2. Owner selects **Revise Proposal** from JP-05 or JP-07.
3. A new Proposal Version is created from the current one as its starting point (not a blank Proposal) — editing continues in the same Proposal Workspace screen, autosaving per Section 8.3.
4. The record moves to Revision on the first edit to the new version, and back to Proposal Shared on the next Send (Section 8.4) — matching the Allowed Transitions in `EBC-R1.3-WS12-003` §5 exactly; the UX never offers a control that would attempt an invalid transition (e.g., there is no "skip to Decision" control visible from Revision).

### 8.6 Duplicate Prevention

Covered primarily at creation (Section 8.1). A secondary surfacing exists on JP-02: if a Workspace User attempts to change a record's destination/region to one that would collide with another active record for the same Traveller, the same inline warning pattern from creation reappears before the change is committed.

### 8.7 Close Planning

From JP-13 (Section 8.9) with outcome Lost or Archived. This is the routine, reversible-in-spirit-but-not-in-fact closure path (a Workspace User closing a record they've simply lost interest in following, distinct from the Confirmed/Journey-conversion path, which the UX deliberately makes feel heavier — Section 8.9).

### 8.8 Search

JP-10 is not a separate route; it is the persistent filter/sort bar at the top of JP-01 (queue) and JP-11 (archive), following the six filter dimensions in `EBC-R1.3-WS12-003` §12 exactly (stage, owner, Traveller, Corporate POC, destination/region, origin channel, created date range). Filters are combinable and their state is reflected in the URL (deep-linkable, Section 9), consistent with the "no dead-end filtered views" principle already applied elsewhere in the Workspace.

### 8.9 Close / Convert (the deliberate, distinguishable moment)

This is the one flow in Journey Planning's interaction design that is intentionally **not** a lightweight inline action, because it is the module's only truly one-way door (`BR-012`, `FR-JP-28`–`30`):

1. From Decision, the Owner selects **Record Decision** (JP-13).
2. Three outcomes are presented, visually distinguished (Confirmed as the affirmative/primary path; Lost and Archived as secondary, non-destructive-but-final options) — never a single ambiguous "Close" button with a hidden outcome picker.
3. Selecting **Confirmed** shows an explicit, named confirmation step: "This will create one Journey from this record. This action cannot be undone and the record cannot return to planning." The Journey's identifying details (destination, Traveller/Corporate POC, current Proposal Version) are shown for a final look before commit.
4. On confirm, the conversion happens atomically; the interface then shows the record as Closed–Confirmed with a direct link to the new Journey in Journey Workspace, rather than leaving the user to guess whether the handoff succeeded.
5. Selecting **Lost** or **Archived** asks for an optional reason/note (supports the reporting requirements in `EBC-R1.3-WS12-003` §14) but requires no further confirmation step beyond the outcome selection itself — these are final but not consequential in the same way as Confirmed.
6. Once Closed under any outcome, JP-02 renders in a read-only state with no stage-transition controls visible at all (`FR-JP-29`) — the UI does not merely disable a button, it removes the affordance entirely, so a returning user is never invited to attempt a reopen.

### 8.10 Reopen

**There is no reopen flow.** Per the Single Business Object Principle and `FR-JP-29`, this specification deliberately omits any "Reopen" control anywhere in the interface for a Closed record — Section 8.9's point 6 is the interaction-design enforcement of that business rule. A user who genuinely needs to plan the same opportunity again after a Lost closure creates a new Journey Planning Record (subject to the same duplicate-prevention check as any other creation, Section 8.1), which is a deliberate design choice, not an oversight.

### 8.11 Archive

Archived is one of the three Closed outcomes (Section 8.9); JP-11 (Archive View) is where every Lost and Archived record surfaces afterward, filterable identically to JP-01. The Administrator's "administrative correction" archive path (`EBC-R1.3-WS12-003` §10, permissions table) is available from JP-02 as an Administrator-only action for records that need to be pulled from the active queue outside the normal Decision flow (e.g., a stale, abandoned record) — it uses the same Section 8.9 pattern (named outcome, optional reason) rather than a separate mechanism.

---

## 9. Navigation Behaviour

- **Workspace navigation:** Journey Planning appears exactly where `WORKSPACE_NAV_GROUPS` already places it — under **Operational**, alongside Journey Workspace. No change to the rail's structure, grouping, or the existing sidebar (desktop/tablet) → hamburger drawer (mobile, below the 768px `md` breakpoint) pattern.
- **Breadcrumbs:** `Journey Planning / [Record identifier]` on JP-02 and its tabs; `Journey Planning / Archive` on JP-11. Consistent with a shallow, two-level hierarchy — Journey Planning does not need a deeper breadcrumb chain since Traveller Details and Corporate Point of Contact Details render in-place rather than as their own routes.
- **Deep linking:** every screen and filter state (Section 8.8) is reachable by URL, so a link shared in a Follow-up reminder or Task can land a user directly on the right record/tab.
- **Back navigation:** browser back from JP-02 returns to JP-01 with the queue's prior scroll position and filter state preserved (not reset) — small but material to a user working through a long queue record by record.
- **Tab navigation within JP-02:** Overview, Discovery, Proposal, Vendor Quotations, Tasks & Follow-ups, History — a persistent tab bar, not a wizard; a user can jump to History at any point without losing in-progress edits elsewhere (autosave, Section 8.2/8.3, makes this safe).

---

## 10. Page Layouts

Reusing the existing Workspace Shell (`WorkspaceShell`, `WorkspaceHeader`, `WorkspaceNav`, `WorkspaceUserMenu`) unchanged, per Single Source of Truth:

- **JP-01 (Queue):** Header (shell, unchanged) → page heading + primary action ("New Journey Planning Record") → JP-10 filter bar → stage-grouped board/list (Section 11 discusses the list-vs-board pattern decision) → each row/card showing: Traveller/Corporate POC name, destination, owner (or "Unclaimed"), origin channel icon, days in current stage, next-action affordance.
- **JP-02 (Detail):** Header (shell) → breadcrumb → record identity strip (Traveller/Corporate POC, destination, stage badge, owner, origin) with primary actions (Claim / Advance Stage / Record Decision, contextual to state) → tab bar → tab content area, single column on narrower widths, two-column (content + context panel) at desktop width, with the context panel surfacing Tasks/Follow-ups due soon and a compact activity snippet regardless of which tab is active.
- **JP-05 (Proposal Workspace):** content area is the Proposal composer (left, ~65% width at desktop) with a persistent right-hand context panel (~35%) showing linked Vendor Quotations and the referenced Traveller Itinerary, so the Owner never has to leave the compose surface to check commercial input while writing.
- **JP-09 (History):** a single-column, reverse-chronological timeline list — no cards, no panels, consistent with its purely read-only audit purpose.
- **JP-11 (Archive):** same layout as JP-01 with the primary "New Journey Planning Record" action removed (archived records are a destination, not a place to create new work) and a persisted "Archived" filter chip.

Action areas (primary/secondary buttons) consistently occupy the top-right of the identity strip on every record-level screen, matching the existing Workspace pattern of primary actions living near the page heading, not buried in a footer.

---

## 11. Component Catalogue

Reused from the Workspace Foundation, unmodified unless noted:

| Component | Reused as-is? | Journey Planning usage |
|---|---|---|
| `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceNav`, `WorkspaceUserMenu` | Yes | Page chrome on every Journey Planning screen |
| `EmptyState` (with existing `icon`/`action` props) | Yes | JP-01 (no active records / no results for a filter), JP-06 (no Vendor Quotations yet), JP-07 (no revisions yet), JP-09 (no activity yet), JP-11 (archive empty) |
| `KpiCard` / `KpiGrid` | Yes | Not on a Journey Planning screen directly, but the Dashboard's existing KPI set already includes "New Leads," which now becomes a live count driven by Journey Planning data once this module ships (an Architecture/Engineering concern, WS12-005/006, not a new UX component) |
| Stage badge (**new component**) | New | A small, consistently-coloured pill showing one of the seven lifecycle stages; used on JP-01 rows/cards, JP-02's identity strip, and JP-11. Colour-coded by stage family (in-progress warm amber tones, Closed states a muted neutral) rather than by individual stage, to avoid a seven-colour system that would fight the Calm Workspace principle |
| Owner avatar/initials chip (**new, but modeled on `WorkspaceUserMenu`'s existing avatar treatment**) | Extended | Reuses the amber/orange gradient avatar treatment already shipped for the signed-in user's own avatar, applied to any Workspace User shown as a record's Owner |
| Origin-channel icon set (**new**) | New | Eight small inline-SVG glyphs (Website, WhatsApp, Phone, Walk-in, Referral, Existing Traveller, Corporate, Manual), following the existing "generic outline shapes, no new icon-library dependency" convention (`EBC-R1.3-WS11-011` §4, judgment call 6) |
| Association selector (**new**) | New | The mutually-exclusive Traveller/Corporate POC choice control at creation (Section 8.1) |
| Duplicate-check inline result panel (**new**) | New | Non-blocking, dismissible result area shown during creation (Section 8.1) and destination changes (Section 8.6) |
| Trip Basics panel (**new, Revision 2**) | New | The Number of Adults/Children/Infants/Travel Month/Nights/Departure City field group at creation (JP-03) and, editable in place with a completion indicator, on the Detail screen (JP-02/JP-04) — see `EBC-R1.3-WS12-012` §4–5 |
| Numeric stepper — unset-state variant (**extended, Revision 2**) | Extended | Adds a distinct blank/unset state (not defaulted to 0) to the existing numeric stepper pattern, used for Children, Infants and Number of Nights, so an unanswered field is never indistinguishable from an explicit zero (`BR-023`) — see `EBC-R1.3-WS12-012` §4.4 |
| Proposal composer (**new**) | New | JP-05's main content area; a structured editor referencing a Traveller Itinerary and Vendor Quotations, not a generic rich-text field |
| Timeline list item (**new, but modeled on existing card list patterns**) | Extended | JP-09's read-only entries |
| `ComingSoon` | Not applicable | Journey Planning is the module being built; `ComingSoon` was the placeholder this module now replaces in the nav (an Engineering concern, not a UX one) |

No new colour tokens, typography scale values, spacing values, or icon library are introduced. The one new visual primitive (the stage badge's colour-by-family treatment) is expressed entirely through the existing token palette (amber/warm tones already defined) rather than adding new hues.

---

## 12. Responsive Behaviour

| Breakpoint | JP-01 (Queue) | JP-02 (Detail) | JP-05 (Proposal) |
|---|---|---|---|
| **Desktop** (≥1280px) | Full stage-grouped board, filter bar inline | Two-column: content + context panel | Two-column: composer + context panel |
| **Laptop** (1024–1279px) | Stage-grouped board, filter bar may wrap to two rows | Two-column, narrower context panel | Two-column, narrower context panel |
| **Tablet** (768–1023px) | Single-column stage-grouped list (board collapses to list, per the existing Workspace tablet reflow pattern used on the Dashboard's KPI grid) | Single column; context panel content moves below the tab content, not hidden | Single column; Vendor Quotations/Itinerary context moves below the composer |
| **Future Mobile** (<768px) | Out of scope for this release per `EBC-R1.3-WS11-011` §4 precedent (navigation rail already hides below `md`); this specification records the same intent for Journey Planning's own screens as a documented future consideration (Section 20), not a Release 1.3 commitment | — | — |

This mirrors the Workspace Foundation's own disclosed scope boundary (`EBC-R1.3-WS11-011` §4, judgment call 7: "Left navigation rail hidden below the `md` breakpoint, with no mobile drawer/overlay built" was later remediated in `-011H`/`-011I` for navigation specifically — but no Workspace Business Module's own content screens have yet been designed mobile-first). Journey Planning follows the same desktop/tablet-first posture as every other Workspace screen shipped to date, with mobile navigation (drawer) already available module-wide from WS11's remediation, even though this module's own record-detail screens are not optimised for phone width this release.

---

## 13. Empty States

All built on the existing `EmptyState` component (`icon`, `title`/description, optional `action`), matching the plain-language, non-technical tone already set by the Dashboard's Recent Activity/Upcoming Tasks empty states:

| Screen/context | Copy pattern | Action |
|---|---|---|
| JP-01, no records at all yet | "No Journey Planning records yet." / "Once an enquiry arrives — or you start one yourself — it'll show up here." | "New Journey Planning Record" |
| JP-01, filtered view with no matches | "Nothing matches these filters." / "Try widening your search or clearing a filter." | "Clear filters" |
| JP-06, no Vendor Quotations recorded | "No vendor quotations yet." / "Record one as commercial options come in." | "Add Vendor Quotation" |
| JP-07, Proposal not yet prepared | "No proposal prepared yet." / "Once you're ready, start building one from what you've learned in Discovery." | "Start Proposal" |
| JP-09, no activity yet | "Nothing recorded yet." / "Every stage change, ownership change and proposal action will appear here." | none |
| JP-11, archive empty | "Nothing archived yet." / "Closed records will appear here." | none |

---

## 14. Validation Feedback

| Type | Pattern | Example |
|---|---|---|
| **Success** | Inline, transient confirmation near the action taken (not a full-page banner), consistent with the calm, non-intrusive tone | "Proposal sent to [Traveller name]." |
| **Warning** | Non-blocking inline panel, dismissible, offering a path forward rather than simply stating a problem | The duplicate-prevention result panel (Section 8.1) — names the existing match and links to it, rather than only saying "a match was found" |
| **Information** | Small, quiet inline note, no icon urgency | "This record's current Proposal Version was last revised 3 days ago." |
| **Completion** (**new, Revision 2**) | A persistent, non-corrective progress indicator, shown ahead of any attempt to act, not only on failure | The Trip Basics “*n* of 5 needed before Planning” indicator (`EBC-R1.3-WS12-012` §5.2) |
| **Blocking** | Reserved for the small number of cases where the business rules genuinely require it: the Association step at creation (`FR-JP-09`, submit disabled until resolved) and the Confirmed-outcome final confirmation (Section 8.9) — used sparingly, since over-use of blocking validation is itself a source of the friction the Calm Workspace principle asks Journey Planning to avoid | **Revision 2** adds a second application: the Discovery → Planning gate (`BR-021`), using the identical disabled-control pattern — see `EBC-R1.3-WS12-012` §5.2. |

---

## 15. Notifications

UX behaviour only — delivery mechanism and channel remain an Architecture/Engineering decision (`OQ-008`, Workspace-wide, not resolved here). Presentation follows the existing header-bell pattern (`EBC-R1.3-WS11-011` §2, ratification 1: "Notifications is not a navigation item — header bell icon only"):

| Trigger (from `EBC-R1.3-WS12-003` §11) | UX Type | Presentation |
|---|---|---|
| Record unclaimed beyond an operational threshold | Action Required | Header bell badge; clicking surfaces the record directly in JP-01, filtered to unclaimed |
| Follow-up due | Action Required | Header bell badge; links to the owning record's Tasks & Follow-ups tab |
| Task due | Action Required | Same pattern as Follow-up |
| Record reassigned | Informational | Header bell, no badge escalation (informational tier does not compete visually with Action Required items) |
| Record converts to Journey (Confirmed) | Informational | Header bell; also reflected directly on JP-02 itself (Section 8.9, point 4) so the acting user doesn't need to check notifications to know it worked |
| Record closed Lost/Archived | Informational | Header bell |

**The unclaimed-record notification threshold** (`OQ-G` in `EBC-R1.3-WS12-003`) is proposed here as a configuration value rather than a fixed business rule, consistent with that card's own framing — this specification does not fix a number, since it is not a UX decision to make unilaterally, but recommends it be exposed as an Administrator-configurable setting rather than hard-coded, once Architecture/Engineering scope it.

---

## 16. Loading States

- **Queue (JP-01):** skeleton rows matching the eventual card/list shape (stage badge, owner avatar, title line, meta line), not a generic spinner — consistent with reducing perceived wait and avoiding layout shift once data arrives.
- **Record Detail (JP-02):** skeleton for the identity strip and the active tab's content; inactive tabs load on selection (not all at once), keeping the initial render fast.
- **Proposal send / stage transitions:** the acting button shows an inline progress state (label replaced with a brief in-progress indicator) rather than a page-level overlay, so the user retains context.
- **Search/filter changes (JP-10):** results area shows a brief skeleton state on filter change; the filter bar itself never disables, so a user can adjust filters again immediately rather than waiting out a lock.

---

## 17. Accessibility Review

Consistent with the Workspace Foundation's own accessibility commitments (Project Instructions §23) and this EBC's own instruction:

- **Keyboard navigation:** every action in Sections 8.1–8.11 (claim, advance stage, send, record decision, filter) is reachable and operable via keyboard alone; the Association selector and the three-outcome Decision control (Section 8.9) use proper radio-group semantics, not styled clickable `div`s.
- **Colour contrast:** the stage badge system (Section 11) is checked against WCAG AA for text-on-fill contrast for every stage family colour before implementation; colour is never the only signal (each badge also carries the stage name as text).
- **Responsive layouts:** covered in Section 12; no content is clipped or overlapped at any in-scope breakpoint (desktop, laptop, tablet).
- **Readable typography:** body copy and form labels use the existing sans-serif scale; the editorial serif is reserved for the page heading and the record's identity name, consistent with its existing "large heading, not body copy" usage site-wide.
- **Consistent focus behaviour:** focus order in the Proposal composer (Section 10) follows the visual left-to-right, top-to-bottom reading order (composer, then context panel), and the Detail screen's tab bar is fully keyboard-operable (arrow-key tab switching, per standard tab-panel ARIA pattern).
- **Reduced motion:** the only motion in this specification is the existing `.journey-passport-reveal` entrance utility, already respecting `prefers-reduced-motion` site-wide; no new animation is introduced.

---

## 18. UX Design Decisions

Recorded with rationale, per this EBC's own instruction:

1. **Queue is a stage-grouped list, not a kanban board, at this release.** A drag-and-drop kanban board would visually suggest that dragging a card between columns is how a stage changes — which directly conflicts with `FR-JP-05`/`BR-004` (stage transitions are deliberate Owner actions with their own validated flow, not a free-form move). A grouped list with an explicit "Advance Stage" action avoids implying an interaction the business rules don't support. Revisiting this as a board-with-guarded-drop-zones is recorded as a future opportunity (Section 20), not built now.
2. **Proposal Version history is subordinate to the Proposal, never a peer navigation item.** This directly encodes the ratified Proposal Model (`EBC-R1.3-WS12-002` Decision 1) — treating Proposal Versions as equally prominent to the Proposal itself would visually contradict "not a separate primary business object."
3. **No Reopen control exists anywhere in the interface** (Section 8.10) — a direct UX enforcement of the Single Business Object Principle, chosen over a "Reopen (Administrator only)" escape hatch that would create exactly the risk (`PEB-001`-style duplicate handling outside its own future capability) the ratified decision exists to prevent.
4. **The Association step is a single either/or choice, not two optional fields**, closing off the possibility of a record left in an invalid dual/neither state before it ever reaches the server-side validation `FR-JP-09`/`FR-JP-10` describe.
5. **Duplicate-prevention feedback is surfaced inline during data entry, not as a post-submission rejection.** This is a deliberate UX improvement beyond the bare business rule (`FR-JP-08` only requires that the check exists) — chosen because rejecting a fully-completed form is a worse experience than warning the user two fields in.
6. **Vendor Quotations are never given equal visual weight to the Proposal**, even though both are legitimate business objects — this reflects the ratified internal-only, supplier-owned framing (`EBC-R1.3-WS12-002` Decision 1) in the visual hierarchy itself, not only in the permissions model.
7. **Corporate Point of Contact renders through the same in-place panel pattern as Traveller Details**, rather than a visually distinct "corporate mode" for the whole record, so a Workspace User's mental model of the Detail screen doesn't change based on origin channel — consistent with UX Consistency and Progressive Disclosure (Section 2).
8. **(Revision 2)** “Move to Planning” stays visible but disabled while Trip Basics is incomplete, paired with an always-visible completion indicator, rather than being hidden or only failing on click. This extends the existing Blocking-validation precedent (Decision 4/Section 14) rather than inventing a new one, while surfacing the reason ahead of the attempt rather than only after it. Full rationale: `EBC-R1.3-WS12-012` §5.2, Decision Log #4.
9. **(Revision 2)** Exact Travel Date is not surfaced anywhere in Journey Planning's UI, including as an “optional” field on the Trip Basics panel. Protects the `BR-024`/Forward-Allocation boundary to Journey Workspace (WS13); adding it as a sixth optional field was the easier but boundary-blurring option, and is explicitly rejected. Full rationale: `EBC-R1.3-WS12-012` §7, Decision Log #5.

---

## 19. UX Risks

| # | Risk | Severity | Notes |
|---|---|---|---|
| R-UX-1 | The stage-grouped list (Decision 1, Section 18) may feel slower to scan than a board for a Workspace User managing a very large queue, once real volume arrives | Medium | Recommend Keerthi/Sri revisit with real data volume once WS12-006 ships; a board-with-guarded-drop-zones (Section 20) is the natural next iteration if this proves true |
| R-UX-2 | `OQ-A` (traveller communication channel) remaining open means this specification cannot yet define a "message the Traveller" screen or component — Discovery Notes are used as the interim capture mechanism, which may not match however Architecture ultimately resolves this | Medium | Flagged to Archie for WS12-005; this specification's Discovery/Notes-based workaround should be revisited once resolved, not treated as a locked design |
| R-UX-3 | `OQ-B` (Corporate Point of Contact's data ownership) being unresolved means JP-08's exact field set and its relationship to Traveller Hub's own UI patterns cannot be fully locked yet | Low–Medium | This specification's field list (Section 6, `EBC-R1.3-WS12-003` §6.6) is a reasonable starting shape, not a final one; Archie's decision may require a follow-up UX addendum |
| R-UX-4 | The eight-icon origin-channel set (Section 11) is a new visual element with no existing precedent in the shipped Workspace UI; risk of icon ambiguity (e.g., distinguishing "Referral" from "Existing Traveller" at a glance) | Low | Recommend user testing of the icon set specifically, or falling back to a text label alongside the icon rather than icon-only, before implementation |
| R-UX-5 | Autosave on the Proposal composer (Section 8.3) needs a clear "last saved" indicator or a Workspace User may distrust that their work is preserved, especially given how consequential the Proposal is | Low | A small, unobtrusive "Saved" timestamp near the composer, matching patterns already familiar from other autosaving tools, is recommended at implementation |
| R-UX-6 | **(Revision 2)** The “Needed before Planning” tag is a new terminology pattern with no precedent elsewhere in the Workspace; risk that Workspace Users read it as equivalent to “Required” and feel blocked prematurely, or equivalent to “Optional” and ignore it until the gate stops them | Low–Medium | Recommend Sri review the tag's exact copy and visual weight once built, before treating this pattern as reusable elsewhere in the Workspace |

---

## 20. Future UX Opportunities

Recorded for later releases; none of the following alters this release's scope:

- **Kanban-style board view for JP-01** with guarded, validated drop zones (i.e., dragging a card only ever triggers the same validated stage-transition action a button would, never a silent status write) — once real-world queue volume and user feedback justify the added interaction complexity.
- **Mobile-optimised Journey Planning record screens**, once the Workspace's mobile navigation (already shipped) is joined by mobile-first content screens for at least the highest-frequency modules.
- **In-Workspace traveller messaging**, once `OQ-A` resolves in favour of a built-in channel rather than logged-external communication — would likely warrant its own tab on JP-02, replacing today's Discovery-Notes-as-communication-log workaround.
- **A comparison view for Vendor Quotations** (side-by-side commercial comparison) once a record's typical Vendor Quotation count in production data suggests users would benefit from it over the current list pattern.
- **Configurable per-Administrator notification thresholds** (Section 15) exposed in a settings surface, once the Notifications capability itself is built out Workspace-wide.

---

## 21. UX Acceptance Checklist

- [x] Consistent with Business Analysis — every screen, flow and interaction traces to a specific FR, Business Rule, or ratified decision in `EBC-R1.3-WS12-003`/`-002` (Sections 5–9, 14).
- [x] Consistent with Workspace Foundation — no new shell, header, navigation, or empty-state pattern; the Workspace's actual shipped design language (warm palette, editorial serif, existing components) is reused, not the stale documented token values (Inputs Consumed, disclosed per `PR-007`).
- [x] No Product Owner decisions altered — the seven-stage lifecycle, the Proposal Model, the Journey Planning Entry Model, and the Single Business Object Principle are all expressed faithfully in the UX layer, never reinterpreted (Section 18, Decisions 2, 3, 6).
- [x] No Architecture decisions made — Corporate Point of Contact's data ownership (`OQ-B`), the traveller communication channel (`OQ-A`), and any component-library question are left to Archie/Rad, flagged rather than assumed (Section 19).
- [x] No Engineering decisions made — no data model, API, or schema content anywhere in this document.
- [x] Screen inventory complete — 13 screens/panels (Section 7), covering every item this EBC's own Scope §7 lists.
- [x] Interaction flows complete — all 10 flows this EBC's own Scope §8 lists (Section 8).
- [x] Accessibility reviewed (Section 17).
- [x] Responsive considerations documented, including an explicit, disclosed mobile-scope boundary consistent with WS11 precedent (Section 12).
- [x] Empty states, validation feedback, notifications and loading states all defined (Sections 13–16), reusing existing components wherever one exists.

---

## Repository Verification

Not performed this session — no repository connection was available (Section 0). Once connected, this section should confirm: repository connected; `docs/09-Development/EBC-R1.3-WS12-004-SOPHIE-UX-Design-and-User-Experience-Specification-Journey-Planning.md` created; no unrelated repository file changed; working tree reviewed before and after.

---

## Deliverables and Handover

**Primary deliverable:** this document. Pending repository connection, it is held in the Claude Project at `claude/EBC-R1.3-WS12-004-SOPHIE-UX-Design-and-User-Experience-Specification-Journey-Planning.md`, to be mirrored verbatim (or reviewed for edits first, at the Product Owner's choice — the same open item `EBC-R1.3-WS12-001` §11 raised for its own repository placement) to `docs/09-Development/` once a folder is connected.

**Optional supporting artefacts** under `docs/04-UX/journey-planning/` (screen-by-screen detail beyond this document's summary tables, or wireframe-level detail) have not been produced — per this EBC's own instruction not to create documents "simply for completeness," this specification judges the tables and flows above sufficient for Archie and Rad to proceed without a separate wireframe set. This can be revisited if either persona finds a genuine gap once they begin their own work.

**Upon acceptance:**

- Archie may begin **WS12-005 — Solution Architecture**, with `OQ-A` (traveller communication channel) and `OQ-B` (Corporate Point of Contact data ownership) as the two open items this specification explicitly hands forward rather than resolves (Section 19).
- Rad will have a validated UX reference for **WS12-006 — Engineering Planning**, including the one new component group requiring design-system additions (stage badge, origin-channel icons, association selector, duplicate-check panel, Proposal composer) — none requiring a new third-party dependency.
- Keerthi will derive QA scenarios directly from Sections 7–8 (screens and flows) once implementation begins, cross-referencing `EBC-R1.3-WS12-003` §7/§15 for the underlying business acceptance criteria and exception scenarios.

---

## Confirmations

- Only this UX specification was produced; no application code, configuration, schema, or Supabase object was created, modified, or removed.
- No Product Discovery, Business Analysis, Architecture, Engineering, or QA activity was performed.
- No approved business behaviour, business rule, or Product Owner decision was altered — every design choice in Section 18 is explicitly reasoned against an already-ratified business fact.
- The Workspace Foundation's actual shipped design language (not the disclosed-as-stale documented tokens) was used as the reconciliation source, per `PR-007`'s own recommendation, itself disclosed here rather than silently resolved.
- No repository file was created, modified, or removed this session — no local repository connection was available (Section 0).

---

*Prepared by Sophie, Senior UX Designer, on behalf of Team Satvi, per EBC-R1.3-WS12-004. This UX Design Specification is Journey Planning's canonical design baseline and is submitted for Product Owner review ahead of Solution Architecture (WS12-005).*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011Y2sA4EkWgdhYQCx5tUcyN
