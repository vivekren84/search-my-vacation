# Search My Vacation

# EBC-R1.3-WS13-002 — Journey Workspace UX Design & Experience Specification

**Persona:** Sophie, Senior UX Designer (UX, UI and Frontend Experience Specialist)
**Release:** 1.3
**Workstream:** WS13, Journey Workspace
**Feature:** `FEAT-R1.3-013`, SMV Workspace
**Phase:** UX Design & Experience Specification
**Status:** **UX Design Complete. Ready for Tiger's review, Archie's Architecture validation (`WS13-003`) and Rad's Engineering Planning (`WS13-004`).** **Revision 3 (26 September 2026): ACCEPTED by Tiger and the Product Owner. EBC complete; handed to Archie for WS13-003.** Refinements UX-01 to UX-08 incorporated (§35).
**Revision 4 (27 September 2026): UX synchronisation UXA-01 to UXA-06** with the final Product baseline (WS13-001 Rev 3: POD-01–08, PD-A–E, O-A2–O-A5) and the Architecture Clarification (WS13-004A). Documentation alignment only; no workflow redesign (§36). **Accepted by Tiger and the Product Owner (27-Sep-2026) subject to OBS-S2 and OBS-S4, both now completed (§36.12).** Sophie does not approve her own work.
**Date:** 24 September 2026
**Product baseline consumed:** `EBC-R1.3-WS13-001` **Revision 2** (FR-JW-01 to 34, BR-025 to 042, D-01 to D-13), as synchronised by `EBC-R1.3-WS13-001B` and frozen for UX per this card. **Nothing in the baseline is changed by this document.**

---

**Document Revision History**

| Revision | Date | Trigger | Change |
|---|---|---|---|
| 1 | 24-Sep-2026 | `EBC-R1.3-WS13-002` | Initial Journey Workspace UX baseline: screen inventory JW-01 to JW-17, Dashboard specification, lifecycle, tasks, vendor bookings, readiness, documents, alerts, people model, replacement and supersession, archive, flows, wireframes, decisions, coverage and handover. Additive revision notes placed in eight approved Workspace UX documents (Section 33). |
| 2 | 26-Sep-2026 | Tiger and Product Owner visual review of WS13-002 (accepted with minor refinements) | UX-01 My Work Quick Action removed; UX-03 one action per operational context (duplicate View readiness removed); UX-04 user-facing label **Completed** for the Journey Closed state; UX-05 stronger Confirmed vs Booked distinction; UX-06 task category icons; UX-07 material-change CTA "Create Replacement Journey"; FEAT-WS-FUTURE-001 recorded as a Product opportunity only. UX-02 no change. Affected sections: §4, §6.1, §6.5, §8.1, §8.2, §9, §10.2, §11, §14.2, §19, §20, §22, §27, §30, §33, §34 and new §35. Wireframes WF-01 and WF-03 to WF-07 re-rendered. |
| 3 | 26-Sep-2026 | Final Product Owner review: UX package accepted | UX-08: the action "Close Journey" is renamed **Mark as Completed**, matching the other lifecycle actions (Mark ready to travel, Mark travelling). Affected: §5 (JW-12), §8.2, §9.3, §17.2, §18, §19 (IF-04), §26, §35. No wireframe shows this button, so none changed. EBC-R1.3-WS13-002 closed as complete. |
| 4 | 27-Sep-2026 | Tiger: WS13 UX synchronisation (UXA-01 to UXA-06) after WS13-003, 003A, 004 and 004A | Archive without Unarchive, irreversibility copy and read-only Archived Journeys (UXA-01); Service Category in Journey Planning, conversion, the Journey and legacy adoption (UXA-02), including the Journey Planning Decision dialog (closes UXO-11); provenance labels for replacement Journeys (UXA-03); document re-verification guidance (UXA-04); non-blocking guidance on the carried Version 1 proposal (UXA-05); copy alignment with Change Category, service type, Document Type, Mandatory/Optional readiness and Vendor Code (UXA-06). Replaced text is struck through and kept. Affected: §3, §5, §8.1, §8.7, §9.2, §11, §12, §14.1, §15, §16, §21, §26, §27, §30, §33 and new §36. New wireframe WF-08; WF-03 and WF-04 re-rendered. |
| 4a | 27-Sep-2026 | Tiger governance review of Revision 4 (UXA-01 to UXA-06 accepted) | OBS-S2 resolved by the Product Owner: an Archived Journey is fully read-only, including its Tasks and Follow-ups (§36.1, §36.12). OBS-S4: a navigation cross-reference was added to `EBC-R1.3-WS12-004`. OBS-S1, S3 and S5 accepted with no change. |

---

## 0. Workspace Readiness Check (Project Instructions §14 / §15)

| Check | Result |
|---|---|
| Task | UX Design and Experience Specification for Journey Workspace. Documentation only. |
| Active persona | Sophie. Supporting personas: none performing work. Arjun's baseline consumed as input; Archie, Rad, Keerthi and Sri are hand-over recipients. |
| Local repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, **connected** this session |
| Branch | `main`, last commit `20cc249` ("feat(ws12): complete Journey Planning workstream") |
| Working tree at start | Pre-existing, not created by this card: Arjun's WS13-001/001B product changes (Spec v2.0, RTM, WS12-003 modified; WS13-001 and 001B untracked) and Tiger's three governance edits (`RELEASE-1.3.md`, Feature Register, Workstream Plan). **None touched.** |
| Governance freeze record (`EBC-R1.3-WS13-001C`) | **Not found** in the repository or in Project Knowledge at the time of this work. This card states the baseline is frozen through 001C, so Sophie proceeds on that instruction (Source of Truth rank 1–2). One consequence is disclosed in §30 (UXO-01): the `I-01` Payments interpretation is treated as frozen as Arjun wrote it. |
| Code changes authorised | **No.** No application code, schema, migration, configuration or governance document is changed. |
| Folder changes | None. No folder created, renamed or reorganised. New files are placed only in existing folders (`docs/09-Development/`, `docs/04-UX/workspace/mockups/`, `docs/04-UX/workspace/mockups/source/`). |
| Commit / push | **None.** Left for the Product Owner. |

## Inputs Consumed

| Source | Use |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-001-…-Business-Analysis.md` **Revision 2** (all of Parts A–D) | Primary and authoritative. Every screen, flow and control below traces to an FR, BR, decision or interpretation in it. Appendix A (Revision 1) read only for context; Revision 2 governs. |
| `docs/09-Development/EBC-R1.3-WS13-001B-…-Synchronisation-Summary.md` | Decision incorporation map, CM-01 to CM-04, I-01 to I-04 |
| `docs/04-UX/workspace/` — Screen Inventory (+ Visual States Addendum), Information Architecture, Navigation Model, User Journeys, Interaction Flows, UX Specification, Design Language, Component Inventory, Empty State Library, UX Review Notes | Approved Workspace UX baseline, extended here rather than replaced |
| `EBC-R1.3-WS12-004` (Revision 2) and `EBC-R1.3-WS12-012` | Journey Planning UX patterns (stage badge, gated actions with inline reason, toast feedback, History list, deliberate Decision moment). Journey Workspace mirrors them for consistency. |
| Shipped code (read only): `web/components/workspace/**`, `web/app/workspace/**` | Real, shipped patterns: `WorkspaceShell`, `EmptyState` (with `icon`/`action`), `Toast`, `KpiGrid`/`KpiCard`, `QuickActions` (still contains "Create Journey"), `JourneyPlanningQueueView`, `JourneyPlanningRecordDetailView` (single-page sections, gated buttons with `title` tooltip plus inline note), Journey Workspace route rendering `ComingSoon` |
| `web/app/globals.css` tokens (via Design Language §4) | Colour, type, radius, shadow. No new token is introduced. |

**Traveller Hub consistency:** Traveller Hub (WS14) is not built. Consistency is therefore with its **approved** UX baseline (Screen Inventory TH-01 to TH-03, Information Architecture §6 "inline reference chips"), not with shipped UI.

---

## 1. UX Goals

1. **"I know which Journeys need me today, and why."** The Dashboard and the Active Journeys list surface conditions, not raw data.
2. **One Journey, one place.** Everything about a confirmed Journey is reachable from its Workspace (FR-JW-01) without hunting across modules.
3. **The lifecycle is visible and trustworthy.** A Workspace User can see where a Journey is, where it has been, what comes next, and what is blocking the next step.
4. **Every reminder earns its place** (D-05, BR-042). Alerts are grouped, shown once, carry the action that resolves them, and disappear when the condition resolves.
5. **The business rules are felt, not fought.** Gates explain themselves before the user tries. Actions that the rules forbid are never offered as if they were possible.

## 2. UX Principles Applied

| Product Owner principle (this card) | How it is realised |
|---|---|
| **Operational Workspace, not a creation environment** | No "Create Journey" anywhere: not on the Dashboard (Quick Action removed, CM-03), not on JW-01, not in any empty state. The only creative acts are operational records inside a Journey (bookings, tasks, documents, notes, Change Records). Material edits are never offered in place (§14). |
| **Progressive Disclosure** | Journey Overview shows summaries and the single next step; detail lives one tab away. Dashboard panels show at most five items plus "View all". Cancelled bookings, completed tasks and resolved alerts collapse by default. Configuration detail appears only where it explains behaviour. |
| **Operational Efficiency** | One-action gates (e.g., "Start preparation" confirms the template and advances in one deliberate dialog); relative-to-departure due-date presets; alerts link straight to the resolving control; the Journey header is sticky so actions are always one click away. |
| **Consistency** | Reuses the Workspace shell, Design Language tokens, `EmptyState`, `Toast`, the Journey Planning stage-badge and gated-action patterns, and the WS12 History list. Same labels as the Product baseline (§27). |
| **Configuration Awareness** | Template name, reminder thresholds and archive retention are shown as quiet, read-only context ("Reminder after 3 days · workspace setting"). Nothing technical is exposed; editing is a Settings concern (DEP-12). |
| Calm Confidence (UX Design Brief) | Two alert tiers only (Action Required, Informational). No red except for genuine errors. Superseded and Cancelled use neutral, informative treatments, not alarm colours. |

---

## 3. Users and Context

| User | What they need from Journey Workspace | Permissions that shape the UI (baseline §15) |
|---|---|---|
| **Workspace User (Journey Owner)** | Work their Journeys to departure and closure; know what is due; coordinate vendors, documents and the Primary Operational Contact | Full operational control over Journeys they own |
| **Workspace User (not owner)** | See any Journey (collaborative visibility, BR-035); complete tasks assigned to them; cover for a colleague by asking for reassignment | Read-only on others' Journeys, except completing their own assigned Tasks |
| **Administrator** | Everything an owner can do on any Journey; reassign; archive ~~and unarchive~~ (I-03; **Rev 4:** no unarchive in Release 1.3, POD-08); adopt legacy Journeys (BR-036); resolve AL-02, AL-15 and AL-16 | Full control |

**Working context:** desk-based, multi-Journey, interrupted by calls and messages. Travelling-stage support can happen away from the desk (see §23 responsive note).

---

## 4. Information Architecture

Journey Workspace stays exactly where the ratified navigation places it (`WORKSPACE_NAV_GROUPS`: Operational → Journey Workspace). No navigation change.

```
Journey Workspace (nav item)
 └─ Active Journeys (JW-01)                     landing screen; summary strip + list
     └─ Journey Workspace (one Journey)
         ├─ Journey Header (sticky)             identity, people, lifecycle, primary action, alerts
         ├─ Overview (JW-02)                    next step, summaries, POC, recent activity
         ├─ Itinerary (JW-03)                   accepted Proposal Version snapshot, read-only
         ├─ Vendor Bookings (JW-04)             booking lifecycle
         ├─ Readiness (JW-05)                   template, four categories, overall state
         ├─ Documents (JW-07)                   Document Readiness (no upload)
         ├─ Tasks & Follow-ups (JW-06)          Operational / Traveller follow-up / Payment
         ├─ Activity & Changes (JW-09, new)     communications, operational notes, Change Records
         └─ History (JW-08)                     Journey Timeline, read-only
 └─ Closed & Archived Journeys (JW-11, new)     Completed / Cancelled / Superseded / Archived
```

**Tab order rationale:** follows the operational rhythm of a Journey in preparation: *what was sold* (Itinerary) → *book it* (Vendor Bookings) → *is it ready* (Readiness, Documents) → *what do I owe* (Tasks) → *what happened* (Activity, History). Readiness sits before Documents because Documents is one of Readiness's four categories.

**Tab set change against the approved IA (§6 "Journey"):** "Vendor Confirmations" becomes **Vendor Bookings** (D-07); "Operational Readiness" becomes **Readiness**; **Activity & Changes** is added as the home for FR-JW-13, 19 and 20, which the approved tab set had no place for. Recorded as an additive revision in the IA (§33).

**Tabs, not one long page.** The shipped Journey Planning detail is a single scrolling page, disclosed in `WS12-007` as an MVP simplification rather than a UX decision. Journey Workspace has roughly twice the content (eight working areas), so this specification requires the **approved tab pattern** (Navigation Model §3 "Contextual tab bar"). See UXD-JW-03 and UXO-06.

---

## 5. Screen Inventory

`JW-01` to `JW-08` keep their approved IDs (renamed where D-07 or D-01 requires). `JW-09` onward are new logical screens, panels or dialogs. Per the Screen Inventory's own convention, logical screens may be realised as tabs, drawers or dialogs.

| ID | Screen / panel | Realised as | Purpose | Primary FRs / BRs | Role |
|---|---|---|---|---|---|
| **DASH-01 / 02** | Workspace Dashboard (My Work / Team) — **revised** | Page | Operational management view (D-09): KPIs, alerts, tasks, departures, bookings, payments, planning, activity. No Journey creation. | FR-JW-05, 25, 32, 33; FR-DASH-03–05 | All |
| **JW-01** | Active Journeys | Page | Summary strip (FR-JW-34), search and filters, Journey list. No create action. | FR-JW-03, 28, 29, 34 | All |
| **JW-02** | Journey — Header and Overview | Page (sticky header + default tab) | Identity, people (Owner / POC / Travellers), lifecycle stepper, primary action, alert banner, next step, summaries | FR-JW-01, 04, 06, 07, 08, 09, 14, 17, 22, 25, 28 | All (view); Owner/Admin (act) |
| **JW-03** | Journey — Itinerary | Tab | Accepted Proposal Version itinerary snapshot, read-only; link to planning history | FR-JW-01, 06; DEC-R1.3-014 | All (view) |
| **JW-04** | Journey — Vendor Bookings (was "Vendor Confirmations") | Tab | Bookings list, status actions, booking summary | FR-JW-15, 16, 17, 18; BR-033, 037 | Owner/Admin |
| **JW-05** | Journey — Readiness | Tab | Active template, four categories, overall state, manual items, Not Applicable | FR-JW-09, 22, 23; BR-028, 041 | Owner/Admin |
| **JW-06** | Journey — Tasks & Follow-ups | Tab | Categorised tasks and follow-ups, due dates, overdue | FR-JW-24, 25; BR-008/009 | Owner/Admin; assignees complete their own |
| **JW-07** | Journey — Documents (Document Readiness) | Tab | Required documents, status, external reference and link, notes. No upload. | FR-JW-21; D-10 | Owner/Admin |
| **JW-08** | Journey — History (Journey Timeline) | Tab | Read-only chronology with filters; supersession link pinned at top | FR-JW-02, 30; BR-030 | All (read-only) |
| **JW-09** *(new)* | Journey — Activity & Changes | Tab | Communications/servicing log, Operational Notes, Change Records | FR-JW-13, 19, 20; BR-032 | Owner/Admin (add); All (view) |
| **JW-10** *(new)* | Search & Filters | Cross-cutting control on JW-01 and JW-11 | Search keys and filters per FR-JW-29 | FR-JW-29 | All |
| **JW-11** *(new)* | Closed & Archived Journeys | Page (same list component as JW-01) | Terminal and Archived Journeys, outcome filter, Archive Eligible indicator | FR-JW-11, 29, 31; BR-038 | All (view); Admin (archive) |
| **JW-12** *(new)* | Lifecycle action dialogs | Dialogs | Start preparation, Mark ready to travel, Mark travelling, Mark travel complete, Begin post-travel, Mark as Completed, Step back, Place on hold, Resume, Cancel Journey | FR-JW-08–11; BR-025, 028–030 | Owner/Admin |
| **JW-13** *(new)* | Material change (replacement path) | Dialog + On Hold state | Explain, confirm, place On Hold, open pre-filled Journey Planning record | FR-JW-12; BR-031, 039; D-13 | Owner/Admin |
| **JW-14** *(new)* | Archive ~~/ Unarchive~~ | Dialog | Reason, user, timestamp; no stage change; **Rev 4:** irreversible in Release 1.3, Journey becomes read-only (§36.1) | FR-JW-31; BR-038 | Admin |
| **JW-15** *(new)* | Primary Operational Contact editor | Side panel | Type, name, organisation, contact details; audited | FR-JW-01, 06, 19; BR-040 | Owner/Admin |
| **JW-16** *(new)* | Vendor Booking detail | Side panel (drawer) | Full booking record, status history, coordination log, actions | FR-JW-16, 18 | Owner/Admin |
| **JW-17** *(new)* | Assign / Reassign and Legacy adoption | Dialog / panel | Owner change (before terminal); Administrator adoption of legacy Journeys (BR-036) | FR-JW-03, 31; BR-026, 036 | Owner (assign own) / Admin |

**Not a screen:** there is no "Create Journey" screen, dialog or route (FR-JW-05). The approved inventory's JW-01 note "From: Journey Creation flow" now means the Journey arrives there automatically after Journey Planning conversion.

---

## 6. Dashboard Specification (DASH-01 / DASH-02)

The Dashboard becomes the **Journey Workspace Dashboard** named in D-09: an operational management view. It is the same surface as the shipped Workspace Dashboard; this section replaces its literal-zero and empty placeholders with live operational content.

### 6.1 Layout (desktop ≥ 1280px)

```
┌ Welcome · date ·  [ My Work | Team ]  ─────────────────────────────────────────────┐
├ KPI row (5 ratified tiles, live values, each a link to a pre-filtered list) ──────┤
│ Active Journeys │ New Leads │ Upcoming Departures │ Pending Vendor Confirmations │ Tasks Due Today │
├──────────────────────────────────────────┬─────────────────────────────────────────┤
│ NEEDS ATTENTION (Operational alerts)     │ TODAY (Tasks & follow-ups due/overdue)  │
│ grouped by coverage, max 5 + View all    │ incl. Payment and Traveller follow-ups  │
├──────────────────────────────────────────┼─────────────────────────────────────────┤
│ UPCOMING DEPARTURES (next window)        │ PENDING VENDOR BOOKINGS                 │
│ Journey cards: dates, readiness, owner,  │ Requested / Pending Information,        │
│ next action                              │ days in status                          │
├──────────────────────────────────────────┼─────────────────────────────────────────┤
│ PAYMENTS DUE (Payment follow-ups, I-01)  │ JOURNEY PLANNING (Active Leads and      │
│                                          │ planning records by stage — from WS12)  │
├──────────────────────────────────────────┼─────────────────────────────────────────┤
│ ACTIVE JOURNEYS BY STAGE (mini strip)    │ RECENT ACTIVITY                         │
├──────────────────────────────────────────┴─────────────────────────────────────────┤
│ Quick Actions: [New Lead]  Add Traveller  New Vendor     (Create Journey and My Work removed) │
└────────────────────────────────────────────────────────────────────────────────────┘
```

Order follows "Action Before Analytics": what needs me (alerts, today) → what is coming (departures, vendors, payments) → pipeline and context (planning, stages, activity).

### 6.2 Areas

| Area (this EBC) | Dashboard element | Content and behaviour | Source | Empty state |
|---|---|---|---|---|
| **Active Journeys** | KPI tile (ratified label) + "Active Journeys by stage" strip | Count per baseline §17 definition. Strip shows the six active D-01 stages (Confirmed to Post Travel) plus On Hold; each count opens JW-01 filtered. | FR-JW-32, 34 | "No active Journeys yet." / "Confirmed Journeys will appear here automatically." |
| **Active Leads** | KPI tile "New Leads" (ratified, WS12-owned, unchanged) + Journey Planning panel | Panel shows Journey Planning records by stage group, with an "Unclaimed" count. Content and definitions are Journey Planning's (FR-JW-32 AC4). See UXO-03 on the "Active Leads" label. | WS12 | "No planning in progress." |
| **Active Journey Planning records** | Journey Planning panel | Lead Created · Discovery · Planning · Proposal Shared · Revision · Decision counts; each opens JP-01 filtered | WS12 | as above |
| **Today's Tasks** | KPI tile "Tasks Due Today" + **Today** panel | Open Tasks and Follow-ups due today or overdue for the viewer (assignee), all categories, overdue first. One-click "Done" for tasks assigned to the viewer. Category chip on every row. | FR-JW-25, 32 | "You're all caught up." (existing library copy) |
| **Upcoming Departures** | KPI tile + **Upcoming Departures** panel | Journey cards (FR-JW-32): party, destination, start date + "in n days", readiness chip, bookings "n of m Booked", owner avatar, next action. Sorted by start date. Window = configured departure window (default = readiness window). | FR-JW-32; baseline §17 | "No departures in the next 14 days." (window from configuration) |
| **Pending Vendor Bookings** | KPI tile "Pending Vendor Confirmations" (ratified label) + **Pending Vendor Bookings** panel | Bookings in Requested or Pending Information on active, not-On-Hold Journeys: vendor, service, Journey, status, days in status; rows past the AL-05 threshold carry the alert marker | FR-JW-17, 32 | "No vendor bookings waiting." / "Bookings waiting on a vendor will appear here until they're confirmed." |
| **Pending Payments** | **Payments Due** panel (not a KPI tile) | Open **Payment-category** Tasks and Follow-ups (I-01): purpose, Journey, due date, assignee, overdue marker. No amounts, no ledger, no payment status other than open/completed. | FR-JW-24, 32; I-01 | "No payment follow-ups due." / "Payment reminders you schedule on a Journey will appear here." |
| **Operational Alerts** | **Needs Attention** panel | Active Action Required alerts for Journey-level conditions (AL-02–09, AL-15, AL-16), grouped by coverage, each with its resolving action. Task-based alerts (AL-12/13/14) are shown in Today and Payments Due instead, so no condition appears twice (UXD-JW-07). | FR-JW-26, 28, 32 | "Nothing needs your attention right now." |
| **Recent Activity** | **Recent Activity** panel (existing card) | Journey events per FR-JW-33 (confirmed, reassigned, stage change, On Hold/resume, booking Booked, Superseded, closure, archive), newest first, each linking to the Journey. Drawn from Timeline events, not a second record. | FR-JW-33 | Existing library copy |

### 6.3 Scope toggle (My Work / Team)

- **My Work** (default): Journeys owned by the viewer; tasks assigned to the viewer. There is no "unclaimed" Journey scope (D-03).
- **Team:** all Journeys and tasks, with an owner filter. Who may see Team is `OQ-001` / `FR-DASH-06`, Role TBC; this does **not** block WS13 UX. Until decided, Rad should render Team for every role only if the Product Owner confirms; otherwise Administrator only (conservative default, matching I-03).

### 6.4 KPI tiles

- The five **ratified labels are unchanged** (PRR-R1.3-WS11-001). Values become live; each tile becomes a link to the matching pre-filtered list (FR-JW-32 AC2).
- A small caption under the value gives the scope and window, e.g. "Next 14 days", "Across your Journeys". Captions use the muted-text token.
- No trend arrows, sparklines or charts (FR-JW-34 AC2; Action Before Analytics).

### 6.5 Quick Actions (CM-03)

Remove **"Create Journey"** (D-09) and **"My Work"** (UX-01, Revision 2: the Dashboard itself is the user's work, so the action duplicated it). The remaining three keep their ratified labels and order: **New Lead** (primary, amber), Add Traveller, New Vendor. No replacement action is added.

### 6.6 Dashboard rules

- Every panel caps at 5 rows and shows "View all (n)" linking to the full, pre-filtered list.
- Items are never shown twice in the same panel; a Journey can legitimately appear in two different panels (for example Upcoming Departures and Needs Attention) because they answer different questions.
- Panels with nothing to show collapse to a single calm line (height ~64px), so an empty day looks empty, not broken.
- Loading: skeleton rows per panel; panels load independently so a slow source never blanks the whole page.

---

## 7. Active Journeys (JW-01)

### 7.1 Layout

```
Journey Workspace                                             [ Closed & Archived → ]
Summary strip:  Confirmed 3 · In Preparation 8 · Ready to Travel 2 · Travelling 1 ·
                Travel Complete 1 · Post Travel 2 · At Risk 2 · Departing ≤14d 4 · On Hold 1
[ Search Journeys… ]  Owner: [Mine ▾]  Stage ▾  Readiness ▾  Departure ▾  Alerts ▾   [Group by stage ☐]
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ ⚠2  JRN-····  Mehta family · Kerala     12–18 Oct · in 18 days   [In Preparation]      │
│     At Risk · 3 of 5 Booked · POC: Priya Mehta           Owner (AR)   Next: Confirm houseboat │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ⏸   JRN-····  Acme Corp offsite · Goa   …                [Ready to Travel · On Hold]   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

No "New Journey" / "Create Journey" button (FR-JW-05). The page's primary button slot is deliberately empty; "Closed & Archived" is a secondary link.

### 7.2 Behaviour

| Element | Specification |
|---|---|
| Default view | Journeys not terminal and not Archived, On Hold included and marked; **sorted by Confirmed Travel Start Date ascending** (baseline §14.3); owner filter defaults to **Mine** |
| Summary strip (FR-JW-34) | One chip per D-01 active stage (Confirmed → Post Travel), plus At Risk, Departing within the configured window, On Hold. Each chip is a toggle filter; selected chip uses the active-nav warm gradient; counts always equal the filtered list size. Journey Closed is not in the strip (terminal). |
| Group by stage | Optional toggle (FR-JW-03 AC2). Groups in D-01 order; On Hold Journeys appear within their held-from stage with the On Hold marker. Preference remembered per user in browser storage. |
| Row (list item) | Alert indicator (count), reference, party name (Traveller or Corporate Point of Contact organisation), destination, confirmed dates + relative days, stage badge (with On Hold overlay), readiness chip, bookings "n of m Booked", POC name (labelled "POC"), owner avatar + name, next action text |
| Row click | Opens the Journey on its Overview tab. Middle-click / Cmd-click opens a new tab (real links). |
| At-risk indicator (FR-JW-28) | Amber alert glyph with count at the row's leading edge when ≥1 Action Required alert is active; tooltip lists alert titles |
| Owner | Always shown; never "Unassigned" (D-03). Legacy un-adopted Journeys (BR-036) show "Incomplete legacy record" instead of a stage badge (§16). |
| Row actions | None inline except for owners and Administrators: an overflow menu with "Assign to…" (owner) / "Reassign…" (Admin). Lifecycle actions live inside the Journey only, so they are always taken with full context. |

---

## 8. Journey Workspace (JW-02 and tabs)

### 8.1 Journey Header (sticky, all tabs)

```
Journey Workspace / JRN-····                                          [⋯ More]
Mehta family · Kerala                                       [ Start preparation ]  ← primary action
12 Oct – 18 Oct 2026 · 6 nights · in 18 days · Domestic template
┌ JOURNEY OWNER ─────────┐ ┌ PRIMARY OPERATIONAL CONTACT ─────┐ ┌ TRAVELLERS ───────────────┐
│ (AR) Anita Rao · SMV    │ │ Priya Mehta · Individual traveller │ │ Traveller: Rahul Mehta ↗   │
│ [Assign…]              │ │ +91 ····· · priya@…  [Edit]        │ │ 2 adults · 1 child         │
└────────────────────────┘ └──────────────────────────────────┘ └──────────────────────────┘
Lifecycle: ●Confirmed ─ ◉In Preparation ─ ○Ready to Travel ─ ○Travelling ─ ○Travel Complete ─ ○Post Travel ─ ○Completed
┌ Needs attention (2) ──────────────────────────────────────────────────────────────────┐
│ ⚠ Readiness not complete and departure in 18 days → View readiness  (the only View readiness) │
│ ⚠ Houseboat booking Requested 4 days (reminder after 3 days) → Open booking           │
└───────────────────────────────────────────────────────────────────────────────────────┘
[ Overview | Itinerary | Vendor Bookings 3/5 | Readiness | Documents 2 | Tasks & Follow-ups 1 | Activity & Changes | History ]
```

| Part | Specification |
|---|---|
| Breadcrumb | `Journey Workspace / [reference]` (WS12 two-level pattern). The reference format is `OQ-024` (Archie); UI uses whatever format Architecture defines. |
| Title | Party name · destination, in the editorial serif (Design Language §5) |
| Meta line | **Rev 4:** Service Category chip first (e.g. "Honeymoon", with an edit pencil for the owner or an Administrator; §36.2). Confirmed dates, nights, relative departure ("in 18 days", "Travelling · day 3 of 7", "Returned 5 days ago"), active Readiness Template name. **Dates have no edit control** (FR-JW-14); hovering the dates shows "Dates are fixed at confirmation. Changing them is a material change." |
| People row | Three separately labelled cards (§13) |
| Lifecycle stepper | §9 |
| Primary action | The single next lifecycle action for the current stage, or disabled with its reason (§9.3). Hidden for non-owners (UXD-JW-06). |
| More (⋯) menu | Secondary lifecycle actions (Place on hold, Step back, Cancel Journey), **Material change…**, Assign / Reassign, Archive ~~/ Unarchive~~ (Admin), View planning record ↗. **Rev 4:** on an Archived Journey the menu shows only "View planning record ↗" (read-only, §36.1). |
| Alert banner | Active Action Required alerts for this Journey (FR-JW-28), max 3 visible + "Show n more"; each line: condition · configured threshold where relevant · resolving link. No dismiss control: alerts resolve only when their condition resolves (BR-017). Informational notifications are not shown here (they live in the bell). |
| Status banners | Replace the alert banner when a state dominates: **On Hold**, **Superseded**, **Cancelled**, **Completed** (Journey Closed), **Archived**, **Incomplete legacy record** (§9, §14, §15, §16) |
| Tab bar | Counts only where they help act: Vendor Bookings "Booked/total", Documents outstanding count, Tasks open count. No count on Itinerary, Activity or History. |
| **One action, one place** (UX-03, Revision 2) | Within one Journey view, the same action (e.g. *View readiness*) appears **once**. Precedence: alert banner line → Next step card → gate note. The gated primary button's note is plain text ("3 readiness items outstanding"), never a second link; the Next step card shows its sentence without a button when the alert banner already carries that action. Tabs remain the normal way into every section and are not counted as duplicates. |
| Stickiness | Header collapses to a single line (title · stage badge · primary action) after scrolling 120px, so the next step is always reachable. |

### 8.2 Overview tab (JW-02)

Two-column at desktop (content 2/3, context rail 1/3), matching WS12-004 §10.

**Main column**

1. **Next step card.** One sentence and one button, derived from stage and gates (table below). This is the "recommended next action" also shown on Dashboard cards and list rows (FR-JW-32).
2. **Readiness summary.** Overall state chip (Not Ready / At Risk / Ready) + four category rows with "n of m" (FR-JW-22 AC3). No separate "View readiness" link here (UX-03); the Readiness tab is the way in.
3. **Vendor Bookings summary.** "n of m Booked" (FR-JW-17 AC1) + counts by status as small pills; link to JW-04.
4. **Documents summary.** Outstanding / Received / Verified / N/A counts; link to JW-07.
5. **Recent activity on this Journey.** Last 5 Timeline events; link to JW-08.

**Context rail**

- **Tasks & Follow-ups due** (next 5, overdue first) with quick "Done" and "+ Add".
- **Journey facts:** reference, party, Journey Planning reference ↗ (FR-JW-06 AC2), Intended Travel Month from planning *for reference only* (FR-JW-14 AC3), trip parameters (adults, children, infants, nights, departure city), accepted Proposal Version ↗, Supersedes / Superseded-by link where present (FR-JW-01 AC1).

**Next step mapping**

| Stage / state | Next step copy | Button |
|---|---|---|
| Confirmed | "Confirm the readiness template to start preparing this Journey." | Start preparation |
| In Preparation, items outstanding | "n readiness items are still outstanding." | View readiness — **only when no readiness alert (AL-03) is showing**; otherwise sentence only (UX-03) |
| In Preparation, all resolved | "Everything is in place. Mark this Journey ready to travel." | Mark ready to travel |
| Ready to Travel, before start date | "Departure on 12 Oct. Nothing else is needed before then." | (none; primary shows disabled "Mark travelling · from 12 Oct") |
| Ready to Travel, on/after start date | "Departure day has arrived." | Mark travelling |
| Travelling | "Travelling · day n of m. Log any support you give." | Log activity |
| Travelling, end date reached | "The trip has ended. Mark travel complete." | Mark travel complete |
| Travel Complete | "Welcome them back and begin post-travel follow-up." | Begin post-travel |
| Post Travel | "When follow-up is done, mark the Journey as completed." | Mark as Completed |
| On Hold | "On hold since [date]: [reason]." (+ replacement status if material change) | Resume to [stage] |
| Terminal / Archived | Outcome sentence (§9.4) | none |

### 8.3 Itinerary tab (JW-03)

- Read-only render of the accepted Proposal Version's itinerary snapshot (`DEC-R1.3-014`, FR-JW-06). Header note: "This is the itinerary the traveller accepted. It never changes. Operational changes are recorded under Activity & Changes."
- Link: "View planning history ↗" (originating Journey Planning record; FR-JW-06 AC3).
- The approved JW-03 action "request an itinerary change (routes to Itinerary Studio)" is **not offered** in Release 1.3: Itinerary Studio does not exist and the baseline routes itinerary changes to Change Records (operational) or the replacement path (material). Instead: "Record an operational change" (→ JW-09) and "Material change…" (→ JW-13).

### 8.4 Vendor Bookings tab (JW-04)

See §11.

### 8.5 Readiness tab (JW-05) and Documents tab (JW-07)

See §12.

### 8.6 Tasks & Follow-ups tab (JW-06)

See §10.

### 8.7 Activity & Changes tab (JW-09)

One chronological stream with three entry types, filter chips at the top: **All · Communications · Notes · Change Records**.

| Entry type | Add control | Fields | Rules |
|---|---|---|---|
| **Communication / servicing** (FR-JW-19) | "+ Log activity" | Who was contacted: radio **Primary Operational Contact** / **Traveller** (named where known); type (call, WhatsApp, email, meeting, in-trip support, other); direction; summary | Append-only. Microcopy: "Logged here only — the Workspace doesn't send messages." (OQ-008) |
| **Operational Note** (FR-JW-20) | "+ Add note" | Text | Append-only; "Add correction" on an existing note creates a new note linked to it (no edit, no delete) |
| **Change Record** (FR-JW-13) | "+ Record operational change" | ~~What is changing (operational category)~~ **Rev 4: Change Category** (required, configured list; §36.7), what changed, why, requested by (Traveller / SMV / Vendor), affected Vendor Booking(s) (optional multi-select) | See the material-change guard in §14.1. On save, any affected Confirmed or Booked booking returns to **Requested** and the entry says so: "Houseboat booking returned to Requested for reconfirmation." (BR-037) |

### 8.8 History tab (JW-08)

See §21.

---

## 9. Journey Lifecycle UX (D-01, BR-025, BR-029, BR-030, BR-038, BR-039)

### 9.1 The lifecycle stepper

A horizontal, seven-step stepper in the Journey Header, in D-01 order:

```
Confirmed ─ In Preparation ─ Ready to Travel ─ Travelling ─ Travel Complete ─ Post Travel ─ Completed
```

**UX-04 (Revision 2):** the final step, badge and banner show the user-facing label **Completed**. The lifecycle state, data value, business rules and product documents keep the name **Journey Closed**; Completed is a presentation label only (tooltip on the badge: "Completed (Journey Closed)" for anyone cross-referencing the product baseline).

| Step state | Visual | Text / a11y |
|---|---|---|
| **Done** (step already passed) | Filled warm check disc, solid connector | Stage name; completion date beneath in muted text ("12 Sep") |
| **Current** | Ring in `--color-primary` with amber inner dot, bold label, "Now" caption | `aria-current="step"`; entry date ("since 14 Sep") |
| **Future** | Hollow neutral circle, dotted connector, muted label | Stage name only |
| **Gate between current and next** | Small lock glyph on the next connector while its gate is unmet; tooltip names the gate | e.g. "Needs: all readiness items resolved" |

Rendered as an ordered list (`<ol>`), so screen readers announce "step 2 of 7, In Preparation, current". Below 1024px it collapses to a compact form: "Stage 2 of 7 · In Preparation" + a thin progress bar, with the full list available on tap.

**Stage badge** (lists, cards, History): a text pill using the WS12 colour-by-family rule, never colour alone:

| Family | Stages | Treatment (existing tokens only) |
|---|---|---|
| Before travel | Confirmed, In Preparation, Ready to Travel | Warm amber tint, espresso text |
| On the journey | Travelling | `--color-primary` tint, primary text |
| After travel | Travel Complete, Post Travel | Warm neutral tint, espresso text |
| Finished | **Completed** (state: Journey Closed) | `--color-success` tint, success-dark text, ✓ glyph |
| Ended otherwise | Cancelled, Superseded | Outline only (neutral), with glyph: ✕ Cancelled, ⇢ Superseded |
| Overlays | On Hold, Archived | Dashed outline chip placed *next to* the stage badge: ⏸ On Hold, ▣ Archived |

### 9.2 Supporting states

| State | Stepper | Banner (replaces alert banner at top of tab content) | Primary action |
|---|---|---|---|
| **On Hold** (BR-029) | Held-from step stays "current" but greyed, with a ⏸ pause glyph over it; connectors after it dashed | Amber-outline banner: "On hold since 3 Oct · Reason: Traveller travel plans uncertain · 12 days (reminder after 14 days)". If the hold is for a material change, adds the replacement status (§14.2). | **Resume to [held-from stage]** |
| **Cancelled** (terminal) | Stepper frozen at the stage reached; a neutral ✕ end-cap replaces the final "Completed" step | Neutral banner: "Cancelled on 20 Oct by Anita Rao · Reason: …". Read-only notice under the tab bar. | none |
| **Superseded** (terminal, D-13) | Stepper frozen; ⇢ end-cap labelled "Superseded" | **Primary-tinted informational banner, not an error colour**: "This Journey was replaced after a material change. Superseded by JRN-···· on 22 Oct · Reason: Material Amendment · [Open replacement Journey →]". History of this Journey stays fully readable. | none |
| **Completed** (state Journey Closed, terminal) | All steps done; final step "Completed" filled success | Success-tint banner: "Completed on 2 Nov. Everything here is kept as a permanent record." | none |
| **Archived** (administrative, D-08) | **Unchanged** (Archived is not part of the lifecycle) | Dashed neutral banner above any other banner: "Archived on 5 Jan by [Admin] · Reason: … · Stage and outcome are unchanged." ~~Admin sees [Unarchive].~~ **Rev 4:** read-only; every action is hidden and there is no restoration in Release 1.3 (§36.1). | none new |

**Archived never appears as a step or as an outcome.** It appears only as an overlay chip and banner (this card's instruction; BR-038).

### 9.3 Lifecycle actions and gates (JW-12)

The primary button always shows the one forward action. When its gate is unmet, the button is **visible but disabled**, with a `title` tooltip and an inline note beneath it — the exact pattern shipped for Journey Planning's Discovery and Planning gates (WS12-012 §5.2, WS12-016 PRA-02).

| Current stage | Primary (forward) | Gate / disabled reason shown | Secondary (⋯ More) |
|---|---|---|---|
| Confirmed | **Start preparation** → dialog: confirm Readiness Template (pre-selected Domestic / International proposal, BR-041), then confirm | none beyond template choice inside the dialog | Place on hold · Material change… · Cancel Journey |
| In Preparation | **Mark ready to travel** | "3 readiness items outstanding" as plain text, no link (UX-03; BR-028). N/A with reason counts as resolved. | Place on hold · Material change… · Cancel Journey |
| Ready to Travel | **Mark travelling** | "Available from 12 Oct (departure date)" | Step back to In Preparation · Place on hold · Material change… · Cancel Journey |
| Travelling | **Mark travel complete** | "Available from 18 Oct (return date)" | Cancel Journey (trip ended early). Hold and Material change are **not listed**; a quiet note in the menu says "Hold and material changes aren't available while travelling." (E-07) |
| Travel Complete | **Begin post-travel follow-up** | — | none |
| Post Travel | **Mark as Completed** | — (no open-task gate, OQ-028). Dialog notes: "2 open follow-ups will stay in their task lists." | none |
| On Hold | **Resume to [stage]** | — | Cancel Journey |
| Completed (Journey Closed) / Cancelled / Superseded | none | — | Archive (Admin) |

Rules applied everywhere:

- Only transitions allowed by §10.2 of the baseline are ever rendered (FR-JW-08 AC1). There is no stage dropdown (FR-JW-04, BR-005).
- Non-owners who are not Administrators see no action buttons; a single line under the stepper reads "Owned by Anita Rao. Only the owner or an Administrator can change this Journey." (FR-JW-09 AC3)
- Every transition dialog is short: what will happen, any required reason, Confirm / Cancel. Success is confirmed with the existing `Toast` ("Journey marked Ready to Travel.") and the stepper animates one step (reduced-motion: instant).
- Server rejection (a stale page, a gate re-opened by a colleague) shows a toast with the specific reason and refreshes the header; the user never sees a generic error.

**Dialog content**

| Dialog | Required input | Copy highlights |
|---|---|---|
| Start preparation | Template (radio; proposal pre-selected with "Suggested for a domestic destination") | "The template sets this Journey's readiness checklist. You can change it later; items will be re-derived." |
| Mark ready to travel | — | Lists the four categories as ✓ |
| Step back to In Preparation | Optional note | "Use this if something that was ready no longer is — for example a visa refused." |
| Place on hold | Reason (required) | "Reminders about departure and readiness pause while the Journey is on hold." (FR-JW-10) |
| Resume | — | "Returns to [stage]." |
| Cancel Journey | Reason (required); list of open Vendor Bookings with a pre-ticked option "Create a vendor cancellation task for each" (FR-JW-11 AC2) | "Cancelling can't be undone. The Journey and its history are kept." |
| Mark as Completed | — | "This can't be undone. After [60] days it becomes eligible for archiving (workspace setting)." |

### 9.4 Terminal outcome copy

| Outcome | Sentence (Overview next-step card and list row) |
|---|---|
| Completed (Journey Closed) | "Completed on [date]." |
| Cancelled | "Cancelled on [date] · [reason]." |
| Superseded | "Replaced by [JRN-····] after a material change." |

---

## 10. Tasks & Follow-ups UX (JW-06; FR-JW-24, 25; D-05; I-01)

### 10.1 Structure

- Grouped list: **Overdue** → **Due today** → **Upcoming** → **No due date** (Tasks only) → **Completed / Cancelled** (collapsed).
- Every row: category chip, title/purpose, due date (relative: "Due tomorrow", "Overdue 2 days"), assignee avatar, reminder glyph when an alert is active, "Done" checkbox, overflow (Edit due date, Reassign, Cancel).
- Filter chips: **All · Operational · Traveller follow-up · Payment · Assigned to me**.

### 10.2 Categories (configurable, minimum three per FR-JW-24)

| Category | Chip | Typical use | Alert |
|---|---|---|---|
| **Operational** | Neutral | "Share final itinerary", "Cancel houseboat with vendor" | AL-14 on due date |
| **Traveller follow-up** | Primary tint | "Call Priya after return" | AL-13 on due date |
| **Payment** | Amber outline | "Collect balance before 1 Oct" | AL-12 on due date |

Category list is read from configuration (BR-018); the UI never hard-codes more than these three defaults.

**Category icons (UX-06, Revision 2).** Each chip leads with one small glyph to speed scanning; the text label always stays.

| Category | Icon | Notes |
|---|---|---|
| Operational | Clipboard with a tick | Neutral espresso stroke |
| Payment | Single coin (no currency symbol) | Amber stroke, matches the amber-outline chip |
| Traveller follow-up | Person with a small speech bubble | Primary stroke |

Rules: 14px inline SVG, 1.5px stroke, outline only (no fills), following the Workspace's existing inline-SVG convention (Design Language §7); no icon library and no new dependency. Icons are `aria-hidden`; the chip text is the accessible name. Categories added later by configuration show the chip without an icon until one is designed (a neutral dot), so configuration never waits on design. Same icons in the Dashboard Today and Payments Due panels, the Overview rail and the Tasks tab. These are functional UI glyphs approved by the Product Owner in this review; they are not brand assets and do not change the brand system.

### 10.3 Quick add (low overhead)

A single inline row at the top of the tab (and "+ Add" on the Overview rail and Dashboard Today panel):

```
[ What needs doing?                       ] [Operational ▾] [Due: Tomorrow ▾] [Assign: Me ▾] [Add]
```

- **Kind is implied, not asked:** a Follow-up needs a purpose and a due date (FR-JW-24 AC2); a Task may omit the due date. The form shows "Follow-up" automatically when category is Traveller follow-up or Payment, and makes Due required with an inline "Follow-ups need a due date."
- **Due-date presets** reduce effort: Today · Tomorrow · In 3 days · 1 week before departure · 3 days before departure · Day of return · Pick a date. Presets relative to the Journey's confirmed dates are computed in the UI; the stored value is an ordinary date.
- Enter submits; the new row appears in place with a brief highlight.

### 10.4 Payments (I-01)

- A Payment follow-up is an ordinary follow-up with category **Payment**. Fields: purpose, due date, assignee, optional note.
- **No amount, currency, invoice, receipt, gateway or "paid/part-paid" state is shown or captured** (baseline §7.2; I-01). "Done" means the follow-up is complete.
- Placeholder text in the purpose field guides without adding fields: "e.g. Collect balance payment from Priya".

### 10.5 Reminders and overdue

- "Reminder" in this Journey Workspace means the alert raised by a due or overdue task or follow-up (AL-12/13/14). There is **no separate reminder object** and no "snooze"; changing the due date is the honest way to postpone, and it is audited.
- Overdue treatment: text "Overdue n days" in espresso with an amber leading bar. Red is not used, to keep overdue items serious but calm.
- Assignees complete their own items from anywhere (Dashboard, Journey, bell) without opening the Journey.

---

## 11. Vendor Bookings UX (JW-04, JW-16; FR-JW-15–18; D-07; BR-033, BR-037)

### 11.1 Tab layout

```
Vendor Bookings   3 of 5 Booked   [Draft 0] [Requested 1] [Pending Information 1] [Confirmed 0] [Booked 3]      [+ Add booking]
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ Accommodation · Coconut Lagoon (vendor) · 12–14 Oct           ●───●───◉───○───○  Pending Information │
│ Waiting for: guest ID copies · 2 days in status                              [Information supplied] [⋯] │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Transport · Kerala Cabs · 12–18 Oct · Ref KC-2231             ●───●───●───●───●  Booked               │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
▸ Cancelled (1)
```

- One row per booking: ~~service category~~ **service type** (Rev 4, I-06), vendor name, service date(s), booking reference when present, a **five-dot mini-stepper** (Draft → Requested → Pending Information → Confirmed → Booked), status label, days in status, the one or two next actions, overflow.
- Pending Information is drawn as a dot on the path; a booking that goes Requested → Confirmed directly shows that dot as skipped (hollow, no fill), so the stepper never implies a step happened.
- **Cancelled** bookings collapse into a group at the bottom, retained and readable (BR-033). Never deleted: no delete action exists (FR-JW-16 AC3).
- Status pills in the summary act as filters.

### 11.2 Status actions

| From | Actions offered | Required input |
|---|---|---|
| Draft | **Mark requested** · Cancel booking | — / reason |
| Requested | **Mark confirmed** · Pending information · Cancel booking | — / what is pending / reason |
| Pending Information | **Information supplied** (→ Requested) · Mark confirmed · Cancel booking | — / — / reason |
| Confirmed | **Mark booked** · Request operational change · Cancel booking | booking reference / change record / reason |
| Booked | Request operational change · Cancel booking | change record / reason |
| Cancelled | none (terminal) | — |

- **No "Amended" status and no free status dropdown** (D-07).
- **"Request operational change"** opens the Change Record form (§8.7) pre-linked to this booking. On save the booking re-enters **Requested** with a line under it: "Re-requested after change on 4 Oct · CR note ↗". This is the "operational amendment request" of this card's scope, realised through the approved Change Record + re-entry rule (FR-JW-13 AC2, BR-037), not a new object.
- Booked requires a booking reference; Pending Information and Cancelled require a reason. Missing input shows a field-level message; several at once where applicable (PRA-01 precedent).

### 11.2a Confirmed versus Booked (UX-05, Revision 2)

Confirmed (vendor has agreed availability and terms) and Booked (reservation final, reference held) must be distinguishable at a glance:

| | **Confirmed** | **Booked** |
|---|---|---|
| Status pill | **Outline** pill, `--color-primary` border and text, open-circle-tick glyph (◯✓) | **Solid** pill, `--color-success` fill tint with success-dark text, filled-disc-tick glyph (●✓) |
| Mini-stepper dot | Primary ring, hollow centre | Solid success disc with outer ring (the only filled green dot) |
| Row | Next action "Mark booked" shown as the primary button | Booking reference shown in bold next to the pill ("Ref KC-2231") |
| Summary pills | "Confirmed n" outline | "Booked n" solid |

The difference is carried by **fill versus outline, glyph and text**, never colour alone, so it survives colour-blindness and greyscale. Both pills meet WCAG AA text contrast. Draft, Requested and Pending Information stay neutral or amber so that only these two use the primary/success pair.

### 11.3 Add booking

Side panel: Vendor (search by name or Vendor Code, shown as "Kerala Cabs · VEN-00012"; **Active vendors only**; inactive vendors are not listed, FR-JW-15 AC1), ~~service category~~ **service type** (Vendor Service Type list; Rev 4, I-06), service date(s), notes. Saves as **Draft**.

- Service dates outside the confirmed travel window show a **warning, not a block**: "These dates fall outside the Journey (12–18 Oct). Save anyway?" (FR-JW-15 AC3)
- No suitable vendor: helper text "Vendors are managed in Vendor Management." Vendor Management (WS16) is not built, so there is no in-flow vendor creation in Release 1.3 (Risk R-02 in the baseline; UXO-05).

### 11.4 Booking detail drawer (JW-16)

Opens from a row: all fields, status history (each transition with actor, time, reason), coordination log (FR-JW-18: contacted, awaiting reply, reconfirmed, issue raised, each timestamped) with "+ Log vendor contact", and the same status actions. A booking whose vendor later became Inactive shows a neutral "Vendor inactive" chip and remains fully actionable (E-02).

---

## 12. Readiness and Document Readiness UX

### 12.1 Readiness tab (JW-05; FR-JW-22, 23; BR-028, 041)

```
Readiness: [At Risk]  Departure in 12 days · 3 items outstanding          Template: Domestic  [Change template]
┌ Booking confirmations  2 of 3 ┐ ┌ Documentation  1 of 2 ┐ ┌ Traveller readiness  1 of 2 ┐ ┌ Supplier readiness  3 of 5 ┐
Items (grouped by category):
 ☐ All vendor bookings Booked                       System · updates automatically   → Vendor Bookings
 ☑ Final itinerary shared with traveller            Manual · done 4 Oct by Anita
 ⊘ Travel insurance                                 Not applicable · "Traveller has annual cover"
 [+ Add item]
```

| Element | Specification |
|---|---|
| Overall state | Derived chip: **Not Ready** (neutral), **At Risk** (amber: inside the readiness window with items outstanding), **Ready** (success). Never manually set (FR-JW-22 AC2). Tooltip explains the rule and window ("At Risk = departure within 14 days and items outstanding · workspace setting"). |
| Category cards | Four, fixed (baseline §11): count, mini progress bar, click filters the list |
| Item row | Checkbox (manual items only), label, source tag **System** or **Manual**, status (Outstanding / Complete / Not Applicable + reason), actor/date |
| System items | No checkbox; label "updates automatically" and a link to where the condition is resolved (Vendor Bookings, Documents). Cannot be ticked by hand (FR-JW-23). |
| Not Applicable | Overflow → "Not applicable…" → reason required. Shown with ⊘ and the reason. Counts as resolved for the gate (BR-028). **Rev 4:** offered only on items the template permits (FR-JW-23 AC4); elsewhere the option is absent. |
| Mandatory / Optional (Rev 4, POD-01) | Every item carries a small text tag, **Mandatory** or **Optional**. Only Mandatory applicable items drive the overall state and the Ready to Travel gate; Optional items are shown but never block (FR-JW-22 AC4). The gate note counts Mandatory items only: "3 mandatory items outstanding". |
| Template | Name shown in the tab header and the Journey Header meta line. **Change template** opens a dialog listing the available templates with a preview of the item set and the warning: "Items will be re-derived from the new template. This is recorded in History." (FR-JW-23 AC2). See UXO-04 on manual items. |
| While Confirmed | The tab shows a single card: "Choose a readiness template to begin" with the suggested template and **Start preparation** (same dialog as §9.3). |

### 12.2 Documents tab (JW-07; FR-JW-21; D-10)

```
Documents   Outstanding 2 · Received 1 · Verified 3 · N/A 0                      View: [By traveller | By document]   [+ Add document]
Rahul Mehta
  Passport       Verified   Ref: ····4521        ↗ Shared drive link     "Valid to 2031"     From template
  Visa           Outstanding Ref: —               —                                         From template   ⚠ within 21 days
Priya Mehta
  Passport       Received   Ref: ····8830        ↗ Shared drive link
Journey-level
  Travel insurance certificate  Outstanding …
```

| Element | Specification |
|---|---|
| Rows | **Document Type** (Rev 4: picked from the configured list, grouped by category; several documents of the same type are allowed, BR-044), traveller(s) concerned or "Journey-level", status, external reference, external link, operational notes, source tag (From template / Added) |
| Status control | Segmented control: **Outstanding · Received · Verified · Not Applicable** (N/A asks for a note). Verified tooltip: "You've checked this document is valid for this Journey." (FR-JW-21 AC5) |
| External reference | Free text, masked in list view to its last four characters by default with a "Show" toggle, because references such as passport numbers are sensitive (UXD-JW-10). Full value visible in the edit panel. |
| External link | Must be a well-formed URL (inline validation "Enter a full link starting with https://"). Opens in a new tab with the external-link glyph and `rel="noopener noreferrer"`. |
| **No upload** | There is no upload control, drop zone or file field anywhere (FR-JW-21 AC3). The empty and add states say so plainly: "Documents stay where they're stored. Record the reference or link here." |
| Per-traveller | Travellers not individually recorded (companions not in Traveller Hub) are named in the traveller field as free text ("Companion – child, age 8"), per OQ-027's resolution. |
| Alerts | A row inside the AL-04 document window shows an amber marker "Due before departure". |

---

## 13. People: Journey Owner, Primary Operational Contact, Travellers (D-12, BR-034, BR-040)

These are three different concepts and must never look interchangeable (this card, scope item 8).

| | Journey Owner | Primary Operational Contact (POC) | Traveller(s) |
|---|---|---|---|
| Who | Internal Workspace User responsible for the Journey | The one person or entity SMV coordinates the Journey with | The people travelling (and the Journey's party) |
| Header label | **JOURNEY OWNER** | **PRIMARY OPERATIONAL CONTACT** | **TRAVELLERS** |
| Visual anchor | Workspace avatar (amber gradient initials, as shipped for the user menu) + "SMV" tag | Contact card glyph + **contact type chip**: Individual traveller · Corporate organisation · B2B travel partner · Other authorised entity | Party link (Traveller ↗ or Corporate Point of Contact ↗) + counts "2 adults · 1 child · 0 infants" |
| Shows | Name, [Assign…] / [Reassign…] | Name, organisation (when not individual), phone, email, [Edit] | Party name (links to Traveller Hub when built), trip parameters |
| Editable by | Owner (assign own) / Admin | Owner / Admin via JW-15, audited | **Never** (party inherited and immutable, BR-034; traveller count is material, BR-031) |
| Abbreviation | none | "POC" allowed only in dense list rows, always with a tooltip "Primary Operational Contact" | **"Corporate Point of Contact" is always written in full** (baseline §6) |

**When the POC is also a traveller** (the common individual case), the POC card still stands alone and adds the note "Also travelling". The two cards are not merged, so the mental model never changes between Journeys.

**POC editor (JW-15):** side panel with type (radio, four options), name (required), organisation (required for Corporate organisation and B2B travel partner), phone and/or email (at least one), a read-only note "Changes are recorded in History." Saving shows a toast and adds a Timeline event (FR-JW-30). Exactly one POC exists; there is no "add another contact" affordance (multiple POCs are a future release, D-12).

**Where each appears**

| Place | Owner | POC | Travellers |
|---|---|---|---|
| Journey Header | ✓ card | ✓ card | ✓ card |
| JW-01 row / Dashboard card | Avatar + name | "POC: name" | Party name as the row title |
| Activity log entry (FR-JW-19) | as actor | selectable as "who was contacted" | selectable as "who was contacted" |
| Search (FR-JW-29) | Owner filter | POC search key | Traveller name / mobile, Corporate Point of Contact |

---

## 14. Material Change, Replacement and Superseded Journeys (D-06, D-13; FR-JW-12, 13; BR-031, 032, 039)

### 14.1 The operational / material boundary in the UI

Material elements (destination, confirmed dates, nights, traveller count) **have no edit control anywhere** (BR-031, FR-JW-12 AC1). The Change Record form makes the boundary visible at the moment of choice:

```
Record an operational change
What is changing?
 ( ) Pickup or transfer timing       ( ) Sightseeing order or activity timing
 ( ) Same-category hotel, same room type, same price   ( ) Contact or logistics details   ( ) Other operational detail
 ─────────────────────────────────────────────────────────────────────────────────────────
 Changing dates, nights, travellers, destination, room type, hotel category, meal plan,
 flight class, or a major part of the itinerary?  That's a material change.  [Start material change →]
```

- **Rev 4 (UXA-06):** the five radio options above are superseded by the **Change Category** picker (seven configured categories). The material-change sentence and link stay exactly as shown. See §36.7.
- Material categories are **not selectable options** in the Change Record form (FR-JW-13 AC4); they are listed as a sentence with a route to the correct path, so the user is redirected rather than rejected.
- Should the server still refuse a Change Record as material, the form shows: "This looks like a material change. Material changes go through a replacement Journey." with the same link.

### 14.2 Replacement path (JW-13)

**Entry:** ⋯ More → **Material change…**, available from Confirmed, In Preparation and Ready to Travel (not Travelling, not On Hold, not terminal; E-07).

**Dialog**

```
Material change
Material changes can't be made on a confirmed Journey. SMV replaces it instead:
 1  This Journey is placed on hold.
 2  A new Journey Planning record opens, pre-filled from this Journey, so you can re-plan and re-confirm with the traveller.
 3  When that record is confirmed, a replacement Journey is created and this one is marked Superseded — linked both ways.
What's changing? [ free text, required ]  e.g. "Traveller wants 8 nights instead of 6"
                                                       [Cancel]  [Create Replacement Journey]
```

- The primary button is labelled **Create Replacement Journey** (UX-07, Revision 2). The three numbered steps above it stay, so users see that the replacement Journey is actually created when re-planning is confirmed. Confirm places the Journey **On Hold** (reason "Material change: [text]") and opens the new, linked, pre-filled Journey Planning record (FR-JW-12 AC2). The user lands on the JP record; a toast confirms "JRN-···· placed on hold. Re-planning started."
- The original Journey then shows the **On Hold** banner with a replacement tracker:

```
⏸ On hold for a material change since 3 Oct · "8 nights instead of 6"
   Replacement planning: JP-···· · Stage: Proposal Shared · Owner: Anita Rao   [Open planning record →]
   When it's confirmed, this Journey will be marked Superseded automatically.
   [Resume this Journey instead]   [Cancel Journey]
```

- **E-10 (replacement planning closed without confirmation):** the tracker turns neutral: "Replacement planning JP-···· closed as Lost. This Journey is still on hold — resume or cancel it." AL-09 continues to remind.
- **On conversion** (automatic, same business event, FR-JW-12 AC3): the original becomes **Superseded** (banner in §9.2) and the replacement Journey starts at **Confirmed** (AC5) with a quiet chip in its header meta line: "Replaces JRN-···· ↗".
- **Never shown as Cancelled** (AC4): Superseded has its own badge (⇢, neutral outline), banner tone (primary, informational), list filter and History pin.

### 14.3 Superseded Journey — preserved history

- All tabs remain readable; all actions are removed; a read-only notice sits under the tab bar: "Superseded Journeys are kept as a permanent record."
- History (JW-08) pins at the top, on **both** Journeys: "Superseded by JRN-···· on 22 Oct (Material Amendment)" / "Replaces JRN-···· (superseded 22 Oct)" (baseline §19).
- JW-11 shows Superseded Journeys under the Outcome filter; global search always finds them (FR-JW-29 AC1).
- The replacement Journey's owner **and** the original's owner receive the Informational notification IN-05 with a link to the replacement.

### 14.4 Cross-module dependency

The pre-filled JP record banner ("Replacement planning for JRN-····") and the supersession on conversion are Journey Planning behaviour (CM-02). They need a Journey Planning UI touch scheduled by Tiger alongside the CM-01/CM-02 engineering follow-up. Specified here for completeness in §19 (IF-08); not a change to WS12's approved UX beyond that banner.

---

## 15. Archive UX (D-08; FR-JW-26, 31; BR-038; I-03)

| Element | Specification |
|---|---|
| Who | Administrator only in Release 1.3 (I-03). Workspace Users never see Archive controls. |
| Where | ⋯ More → **Archive…** on any Journey, any stage (D-08: at any time); also bulk-free single action from JW-11 rows marked Archive Eligible. |
| Dialog (JW-14) | Reason (required, free text). Read-only facts: "Archived by [you] · [today]". Statement: "Archiving hides this Journey from active views. It doesn't change its stage or outcome, and nothing is deleted. ~~You can unarchive it later.~~" Buttons: Cancel / **Archive**. **Rev 4:** copy replaced by the irreversible version in §36.1. |
| After archiving | Toast; Archived chip + banner (§9.2); Journey leaves JW-01 and Dashboard counts; stays in JW-11 (Archived filter) and global search (FR-JW-31 AC4). |
| Archive Eligible | On JW-11, Journey Closed rows past the retention period show a neutral "Archive eligible" chip with tooltip "Closed more than 60 days ago · workspace setting". Administrators receive AL-15; its action opens the Archive dialog. |
| ~~Unarchive~~ | ~~⋯ More → **Unarchive…** (Admin), optional note, audited (BR-006).~~ **Rev 4: removed.** Release 1.3 has no unarchive (POD-08, PD-E). Any future restoration is an administrative operation outside the Workspace UI. |
| Never | Archive is never offered as a closing outcome in the Close or Cancel dialogs (FR-JW-11). |

---

## 16. Administrative Situations

| Situation | UX |
|---|---|
| **Legacy Journey not yet adopted** (BR-036, AL-02) | List row and header show **"Incomplete legacy record"** instead of a stage badge; lifecycle actions are hidden. Administrators see a **Complete adoption** panel (JW-17): owner (pre-filled from the planning record's owner where present), confirmed start and end dates, readiness template, POC (pre-filled from the party), **Rev 4: Service Category (required, no pre-selection; §36.2)**. "Adopt Journey" moves it to Confirmed. Workspace Users see "Awaiting adoption by an Administrator." |
| **Owner deactivated** (E-06, AL-16) | The Journey keeps its owner (never unassigned). Owner card shows "Account deactivated" in muted text; Administrators see an alert "Reassign this Journey" whose action opens Reassign (JW-17). |
| **Assign / Reassign** (FR-JW-03, 31; BR-026) | Dialog: user picker (active Workspace Users), optional note. Owner may assign their own Journey; Administrator may reassign any. Blocked after a terminal outcome: the control is absent and History explains the owner at closure. New owner gets IN-02. |

---

## 17. Alerts and Notifications UX (FR-JW-26–28; D-05; BR-017, 042)

### 17.1 Where alerts appear

| Surface | Shows | Purpose |
|---|---|---|
| Header bell (existing) | All Action Required (count badge) and Informational (no badge escalation) notifications for the viewer | The personal inbox |
| Dashboard **Needs Attention** | Journey-level Action Required alerts (AL-02–09, 15, 16) | Triage across Journeys |
| Dashboard **Today** / **Payments Due** | Task-based alerts (AL-12, 13, 14) as overdue/due rows | Do the work |
| Journey Header alert banner | Action Required alerts for this Journey | Fix it here |
| JW-01 row indicator | Count + tooltip | Spot risk while scanning |
| NOT-01 Notification Log (existing screen) | Full list, filterable | Look back |

### 17.2 Alert anatomy

`[glyph]  Condition in plain words · configured threshold (when relevant) · → Resolving action`

Examples (copy is illustrative of pattern; thresholds come from configuration):

| Alert | Copy | Resolving action |
|---|---|---|
| AL-02 Legacy | "Legacy Journey needs adoption." | Complete adoption |
| AL-03 Readiness | "Departure in 12 days and readiness isn't complete." | View readiness |
| AL-04 Documents | "Visa for Rahul Mehta is still outstanding · departure in 18 days." | Open documents |
| AL-05 Vendor | "Houseboat booking has been Requested for 4 days · reminder after 3 days." | Open booking |
| AL-06 Start date | "Departure day has arrived — is the traveller travelling?" | Mark travelling |
| AL-07 End date | "The trip ended yesterday." | Mark travel complete |
| AL-08 Post-travel | "Returned 7 days ago and the Journey is still open." | Continue follow-up / Mark as Completed |
| AL-09 On Hold | "On hold for 15 days · reminder after 14 days." | Resume / Cancel |
| AL-12 Payment | "Payment follow-up due today: Collect balance from Priya." | Open follow-up / Done |
| AL-13 Traveller follow-up | "Follow-up due: Call Priya after return." | Open follow-up / Done |
| AL-14 Operational task | "Task overdue: Share final itinerary." | Open task / Done |
| AL-15 Archive due | "Closed 60 days ago and eligible for archiving." | Archive… |
| AL-16 Owner deactivated | "Owner's account is deactivated. Reassign this Journey." | Reassign |

### 17.3 Behaviour rules

- **Condition-based:** opening, reading or acknowledging never resolves an Action Required alert (FR-JW-26 AC2). Only resolving the condition does; the alert then leaves every surface at once.
- **One condition, one alert, one place per surface** (BR-042): the Dashboard shows task-based alerts only in Today / Payments Due, never also in Needs Attention (UXD-JW-07).
- **On Hold suspends** AL-03 to AL-08; the Journey instead shows the On Hold banner and AL-09 when due (FR-JW-10).
- **Grouping in Needs Attention:** Journey milestones · Vendor bookings · Documents · On hold · Administrative (legacy, archive, owner). Within a group, most urgent first (days overdue, then departure date). Max 5 rows per panel; "View all" opens NOT-01 filtered.
- **Informational** notifications (IN-01 to IN-06) appear only in the bell and NOT-01, are acknowledgeable, and click through to the Journey (FR-JW-27). IN-05 (Superseded) links to the replacement.
- Live updates use a polite `role="status"` region for count changes; alerts never interrupt with modal dialogs or sounds.

---

## 18. User Flows

| ID | Flow | Start → end | Screens |
|---|---|---|---|
| **UF-01** | Start the day | Sign in → Dashboard (My Work) → Needs Attention / Today → act on an item → return | DASH-01 → JW-02 tabs |
| **UF-02** | Receive a new Journey | Journey Planning record confirmed (WS12) → IN-01 "Journey confirmed" → Journey (Confirmed, owned by planner) → Start preparation (template) → In Preparation | JP-13 → bell → JW-02 → JW-12 |
| **UF-03** | Prepare a Journey | Add bookings (Draft) → request → confirm → book; add/verify documents; resolve readiness items → Mark ready to travel | JW-04, JW-16, JW-07, JW-05, JW-12 |
| **UF-04** | Chase a slow vendor | AL-05 on Dashboard → booking drawer → log vendor contact → Pending Information (reason) → Information supplied → Confirmed → Booked | DASH-01 → JW-16 |
| **UF-05** | Payment follow-up | Add Payment follow-up with "1 week before departure" preset → AL-12 on due date → Done from Dashboard | JW-06 → DASH-01 |
| **UF-06** | Travel and support | Departure day alert → Mark travelling → log in-trip support (Traveller / POC) → end-date alert → Mark travel complete | JW-12, JW-09 |
| **UF-07** | Post-travel and close | Begin post-travel → Traveller follow-up task → Mark as Completed → Journey Closed → (60 days) Archive eligible → Admin archives | JW-12, JW-06, JW-11, JW-14 |
| **UF-08** | Operational change | Record operational change (e.g. pickup time) → affected booking returns to Requested → reconfirm → Booked | JW-09, JW-04 |
| **UF-09** | Material change and supersession | Material change… → On Hold → JP record (pre-filled) → re-plan → confirm → replacement Journey (Confirmed) + original Superseded | JW-13 → JP-02 → JW-02 (both) |
| **UF-10** | Hold and resume | Place on hold (reason) → AL-09 if long → Resume to held-from stage | JW-12 |
| **UF-11** | Cancel after confirmation | Cancel Journey (reason, vendor cancellation tasks) → Cancelled → vendor tasks in Today | JW-12, JW-06 |
| **UF-12** | Cover for a colleague | Admin reassigns → new owner IN-02 → Journey appears in their My Work | JW-17 |
| **UF-13** | Find any Journey | Global search or JW-01/JW-11 search (reference, name, mobile, POC, destination) → Journey | JW-10 |
| **UF-14** | Adopt a legacy Journey | AL-02 → Complete adoption panel → Confirmed | JW-17 |

---

## 19. Interaction Flows (step level)

Notation: **[User]** action, *(System)* response. Every flow ends with a Timeline event (FR-JW-30).

**IF-01 Start preparation (Confirmed → In Preparation).** [User] Start preparation → *(System)* dialog with suggested template → [User] keeps or changes template → Confirm → *(System)* assigns template, derives items, transitions, toast, stepper advances. Cancel leaves the Journey unchanged.

**IF-02 Mark ready to travel.** *(System)* button disabled with "n readiness items outstanding" until all items are Complete or N/A → [User] resolves items in JW-05/JW-07/JW-04 → *(System)* enables button in place (no reload) → [User] confirms → Ready to Travel.

**IF-03 Travelling and travel complete.** *(System)* on start date raises AL-06 and enables Mark travelling → [User] confirms → Travelling. Same pattern for Mark travel complete on/after end date (AL-07). Before the date, the button is disabled with the date.

**IF-04 Post travel and close.** [User] Begin post-travel follow-up → Post Travel → [User] Mark as Completed → dialog notes open follow-ups remain → Confirm → Journey Closed (terminal banner).

**IF-05 Place on hold / resume.** [User] ⋯ → Place on hold → reason → Confirm → *(System)* On Hold overlay, milestone alerts suspended. [User] Resume to [stage] → returns to the held-from stage only.

**IF-06 Cancel Journey.** [User] ⋯ → Cancel Journey → reason (required) → sees open bookings with "create cancellation task" pre-ticked → Confirm → *(System)* Cancelled; one Operational task per selected booking ("Cancel [service] with [vendor]") assigned to the owner.

**IF-07 Vendor booking lifecycle.** [User] + Add booking → Draft → Mark requested → (Pending information: reason → Information supplied) → Mark confirmed → Mark booked (reference) → *(System)* updates "n of m Booked", Supplier readiness item and Pending Vendor Confirmations KPI immediately (FR-JW-17 AC3).

**IF-08 Material change and supersession.** [User] ⋯ → Material change… → describe change → Create Replacement Journey → *(System)* Journey On Hold; linked JP record created and opened (pre-filled) → [User] plans in Journey Planning → records Confirmed (dates captured, CM-01) → *(System)* creates replacement Journey (Confirmed, owner = planning owner), marks original Superseded (Material Amendment), links both, sends IN-05 → [User] opens replacement from toast or IN-05.

**IF-09 Operational change with booking re-entry.** [User] Record operational change (or "Request operational change" on a booking) → pick operational category → describe, requested by, affected booking(s) → Save → *(System)* Change Record logged; each affected Confirmed/Booked booking → Requested with "Re-requested after change" note.

**IF-10 Document readiness.** [User] + Add document (type, traveller, optional reference/link/notes) → status Outstanding → later Received → Verified → *(System)* Documentation readiness item updates when all required documents are Received/Verified (FR-JW-23 AC3).

**IF-11 Task / follow-up.** [User] quick-add (text, category, due preset, assignee) → Enter → *(System)* row appears; due-date alert raised on due date to assignee → [Assignee] Done (anywhere) → alert resolves.

**IF-12 Archive.** [Admin] AL-15 or ⋯ → Archive… → reason → Archive → *(System)* Archived overlay; leaves active views; audit (reason, user, timestamp).

**IF-13 POC change.** [User] Edit on POC card → JW-15 → change type/name/details → Save → *(System)* card updates; Timeline "Primary Operational Contact changed (before → after)".

**IF-14 Reassign.** [Owner/Admin] Assign / Reassign → pick user → Confirm → *(System)* owner card updates; IN-02 to new owner; blocked for terminal Journeys.

---

## 20. Search and Filters (JW-10; FR-JW-29)

| Element | Specification |
|---|---|
| Search box | Placeholder "Search by reference, traveller, mobile, contact or destination". Matches Journey reference, traveller name or mobile, Corporate Point of Contact, **Primary Operational Contact**, destination. Results update after a short pause; the filter bar never locks. |
| Filters | Stage (multi, D-01 values) · Owner: Mine / named user (no "Unclaimed") · On Hold · Readiness (Not Ready / At Risk / Ready) · Departure date range (presets: This week, Next 14 days, This month, Custom) · Alert status (Has active alert) · on JW-11: Outcome (Completed / Cancelled / Superseded) · Archived (yes/no) |
| Combining | AND (FR-JW-29 AC2). Active filters appear as removable chips with "Clear all". |
| Sort | Departure date (default, ascending) · Last activity · Created |
| URL state | Every filter and sort is in the URL, so Dashboard links and shared links land on the exact view; Back restores scroll and filters (WS12-004 §9). |
| Global search | Journeys appear alongside Travellers and Journey Planning records, including terminal and Archived ones, each with a stage/outcome badge (AC1). |
| No results | "Nothing matches these filters." / "Try widening your search or clearing a filter." [Clear filters] (WS12 copy reused) |

---

## 21. Journey Timeline / History (JW-08; FR-JW-02, 30)

- Reverse-chronological, single-column list (WS12 JP-09 pattern). Pinned at top when present: supersession link; "Created from Journey Planning record JP-···· ↗ (planning history lives there)".
- Each entry: event glyph, plain-language title, actor, timestamp (relative with absolute on hover), and **before → after** where applicable ("Stage: In Preparation → Ready to Travel"; "POC: Priya Mehta → Rahul Mehta").
- Filter chips: All · Stage & status · Ownership · Bookings · Readiness & documents · Tasks · Changes & notes · Contact · Archive · Alerts.
- Read-only for every role (AC2). No edit, delete or hide.
- Event coverage (FR-JW-30): creation, owner changes, stage transitions, On Hold/resume, POC changes, booking lifecycle transitions and coordination entries, readiness template assignment/change, readiness and document status changes, Change Records, notes, activities, tasks, alerts raised/resolved, supersession, closure, archive ~~/unarchive~~ (reason, user, timestamp), **Service Category changes (Rev 4, FR-JW-30)**.
- Long histories load in pages of 50 with "Load earlier events".

---

## 22. Component Catalogue

Reused from the Workspace Foundation unless marked new. **No new colour token, font, icon library or third-party dependency.** New visual primitives use existing tokens and the inline-SVG icon convention.

| Component | New / reused | Usage |
|---|---|---|
| `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceNav`, `WorkspaceMobileNav`, `WorkspaceUserMenu` | Reused | Chrome on every screen |
| `EmptyState` (`icon`, `action`) | Reused | All empty states (§24) |
| `Toast` | Reused | Action success and server-side rejection |
| `KpiGrid` / `KpiCard` | Reused, extended | Live values, tile becomes a link, caption line |
| `QuickActions` | Reused | "Create Journey" and "My Work" removed; three actions remain (UX-01) |
| `RecentActivityCard`, `UpcomingTasksCard` | Reused | Recent Activity; Today panel |
| **Dashboard panel** | New (card pattern) | Needs Attention, Upcoming Departures, Pending Vendor Bookings, Payments Due, Journey Planning, Stage strip. Shared: serif title, count, ≤5 rows, "View all", collapsed empty line. |
| **Journey stage badge** | Extended from WS12 stage badge | D-01 stages + Cancelled/Superseded outlines (§9.1) |
| **Overlay chip** | New | On Hold, Archived, Incomplete legacy record, Vendor inactive, Archive eligible |
| **Lifecycle stepper** | New | Journey Header; compact variant < 1024px |
| **Gated action button** | Reused pattern (WS12-012/016) | Disabled + `title` tooltip + inline note |
| **Status banner** | New | On Hold (with replacement tracker), Superseded, Cancelled, Closed, Archived, Legacy |
| **Alert banner / alert row** | New | Journey Header; Needs Attention panel |
| **People card** | New | Journey Owner / POC / Travellers, three variants with distinct labels and glyphs |
| **Readiness state chip + category card** | New | JW-05, Overview, lists |
| **Booking row with mini-stepper** | New | JW-04; five-dot variant of the lifecycle stepper |
| **Side panel (drawer)** | New pattern | JW-15 POC editor, JW-16 booking detail, add booking, add document |
| **Category chip with icon** | New | Tasks: Operational / Traveller follow-up / Payment, each with its glyph (UX-06) |
| **Booking status pill** | New | Outline Confirmed vs solid Booked variants (UX-05) |
| **Segmented status control** | New | Document status |
| **Quick-add row** | New | Tasks & Follow-ups |
| **Timeline list item** | Reused (WS12 History) | JW-08, Overview recent activity |
| **Summary strip (filter chips with counts)** | New | JW-01 (FR-JW-34) |
| **Masked reference field** | New | Document external reference |

---

## 23. Responsive Behaviour

| Breakpoint | Dashboard | JW-01 | Journey Workspace |
|---|---|---|---|
| **Desktop** ≥ 1280px | KPI row of 5; two-column panels | Full row layout, strip on one line | Header full (three people cards in a row, full stepper); Overview 2/3 + 1/3 rail |
| **Laptop** 1024–1279px | KPI row of 5 (compact); two-column panels | Row wraps meta to two lines; strip scrolls horizontally | Same, narrower rail; people cards shrink to name + key detail |
| **Tablet** 768–1023px | KPI grid 2 columns (shipped reflow); panels single column in the §6.1 order | Card-style rows; filters collapse into a "Filters (n)" button opening a sheet | Compact stepper; people cards stack; rail moves below main content; tabs become a horizontally scrollable bar |
| **Phone** < 768px | Shipped mobile drawer; single column | Card rows | **Must not break:** single column, no horizontal page scroll, primary action stays in the collapsed sticky header. Not optimised this release (WS12-004 §12 precedent). See R-UX-JW-04. |

---

## 24. Empty, Loading, Validation and Error States

**Empty states** (existing `EmptyState` pattern and Empty State Library tone rules; none offers to create a Journey):

| Context | Title / description | Action |
|---|---|---|
| JW-01, no active Journeys | "No active Journeys right now." / "Journeys appear here automatically when a Journey Planning record is confirmed." | Go to Journey Planning |
| JW-01, filters match nothing | "Nothing matches these filters." / "Try widening your search or clearing a filter." | Clear filters |
| JW-11, none | "No closed or archived Journeys yet." / "Completed, cancelled and replaced Journeys will be kept here." | — |
| JW-04, no bookings | "No vendor bookings yet." / "Add each service you need to book. It starts as a draft until you request it." | Add booking |
| JW-07, no documents | "No documents to track." / "Documents stay where they're stored — record what's needed and its reference or link here." | Add document |
| JW-06, none | "Nothing to do on this Journey." / "Tasks, traveller follow-ups and payment reminders you add will appear here." | (quick-add row is already visible) |
| JW-09, none | "Nothing logged yet." / "Calls, messages, notes and operational changes will build up here." | Log activity |
| JW-05, Confirmed | "Choose a readiness template to begin." / "It sets the checklist this Journey needs before departure." | Start preparation |

**Loading:** skeletons shaped like the final content (header strip, stepper, rows). Tabs load on selection; the header loads once. Action buttons show an inline progress state; no page-level overlays (WS12-004 §16).

**Validation:** field-level, several messages at once (PRA-01 precedent): reason required (hold, cancel, pending information, N/A, archive, material change), booking reference for Booked, due date for follow-ups, URL format for external links, at least one contact method for POC, organisation for corporate/B2B POC.

**Errors:** server rejections (stale state, gate re-opened, permission) show a `Toast` with the specific reason and refresh the affected area. Network failure on a list: inline "Couldn't load Journeys. [Try again]". Never `window.alert()` (WS12-010 D3/D4 precedent).

---

## 25. Accessibility

- All actions keyboard-operable; tab bar follows the ARIA tabs pattern (arrow keys); dialogs trap focus and return it to the trigger; drawers are labelled dialogs.
- Stepper is an ordered list with `aria-current="step"`; locked gates announced as text ("Next step needs all readiness items resolved").
- Status is never colour-only: every badge, chip and alert carries text and a glyph. Contrast of every badge family checked against WCAG AA before implementation (as required for the WS12 stage badge).
- Disabled gated buttons remain focusable (`aria-disabled="true"` rather than `disabled`) so keyboard and screen-reader users can reach the reason; the inline note is referenced by `aria-describedby`.
- Count changes (alerts, tasks) use a polite live region; no assertive announcements.
- Masked references expose a labelled "Show reference" toggle; external links announce "opens in a new tab".
- Motion: stepper advance and drawer open reuse the existing 220ms entrance recipe and are disabled under `prefers-reduced-motion`.
- Target sizes ≥ 44×44px for touch at tablet width.

---

## 26. Configuration Awareness (D-04, D-05, D-08; BR-018, 041, 042)

| Configured item | Where the user sees it | How |
|---|---|---|
| Readiness Templates | Header meta line, JW-05, Start preparation / Change template dialogs | By name, with item preview. Templates are listed from configuration; nothing hard-coded. |
| ~~Service categories~~ Vendor service types, Document Types, task categories, **Change Categories, Service Categories** (Rev 4) | Pickers in JW-04, JW-07, JW-06, JW-09, header and adoption panel, Journey Planning | Option lists read from configuration |
| Alert thresholds and windows | Alert text, readiness tooltip, Upcoming Departures caption | "reminder after 3 days · workspace setting" in muted text |
| Departure window | Dashboard caption, JW-01 "Departing ≤ n days" chip | Label derives from the configured value |
| Archive retention | Mark as Completed dialog, Archive eligible chip | "After 60 days (workspace setting)" |

No configuration is editable from Journey Workspace. Editing belongs to Settings (NOT-02 / SET-04; DEP-12). The phrase "workspace setting" is the only exposure, so users understand *why* without seeing *how*.

---

## 27. Terminology Register (UI labels)

| Use in UI | Never use | Source |
|---|---|---|
| Journey · Journey Workspace · Active Journeys | Trip, Booking (for the Journey), Package | baseline §6 |
| Confirmed · In Preparation · Ready to Travel · Travelling · Travel Complete · Post Travel · **Completed** (user-facing label for the state **Journey Closed**; UX-04) | Booking Confirmed, Pre-Departure Ready, In-Journey, Post-Journey Follow-up, Successfully Completed, Closed (alone) | D-01; UX-04 |
| On Hold · Cancelled · Superseded · Archived | Paused, Replaced (as a status), Deleted, Void | D-01, D-08, D-13 |
| Vendor Booking · Draft · Requested · Pending Information · Confirmed · Booked · Cancelled | Vendor Confirmation (as an object), Amended | D-07 |
| Pending Vendor Confirmations (KPI tile only, ratified label) | — | PRR-R1.3-WS11-001; see UXO-03 |
| Journey Owner | Assignee (for the Journey), Agent | D-03 |
| Primary Operational Contact (POC only in dense rows with tooltip) | Point of contact, Contact person, Lead contact | D-12 |
| Corporate Point of Contact (always in full) | POC, Corporate POC | baseline §6 |
| Readiness Template · Readiness · Not Ready / At Risk / Ready | Checklist template, Health | D-04 |
| Document Readiness · Outstanding / Received / Verified / Not Applicable | Upload, Attachment, File | D-10 |
| Change Record · operational change · material change | Amendment (for Change Records) | D-06 |
| Task · Follow-up · Operational · Traveller follow-up · Payment | Payment (as a record, amount or status) | D-05, I-01 |
| Archive · Archive eligible ~~· Unarchive~~ | Delete, Purge, **Unarchive, Restore** (Rev 4: not in Release 1.3) | D-08, POD-08 |
| **Service Category** (the Journey's traveller-experience classification) | Trip type, Package type, Category (alone) | POD-02, POD-07 |
| **Service type** (on a Vendor Booking) | Service category (on a booking) | I-06 |
| **Change Category** | Change type, Reason code | POD-04 |
| **Document Type** · **Journey Document** | Document requirement | POD-03 |
| **Mandatory** · **Optional** (readiness items) | Required, Nice to have | POD-01 |
| **Vendor Code** (VEN-00001) | Vendor ID, Supplier code | PD-D |
| **Pre-filled from / Carried from / Copied from JRN-…** · **Review required** | Imported, Inherited, Cloned, Duplicated | BR-046; §36.4 |

---

## 28. UX Design Decisions

Each decision works inside the frozen baseline; none changes a business rule.

| # | Decision | Rationale | Alternatives rejected |
|---|---|---|---|
| **UXD-JW-01** | No create affordance for Journeys anywhere, including empty states; JW-01's empty state points to Journey Planning instead | D-09, FR-JW-05. An empty list with no button could read as broken, so it explains where Journeys come from. | A disabled "Create Journey" button with tooltip (still implies the concept exists, which D-09 removed) |
| **UXD-JW-02** | JW-01 defaults to a flat list sorted by departure date; "Group by stage" is an optional toggle | Departure is the operational clock; the summary strip already gives the stage view in one glance (FR-JW-34) | Stage-grouped default (the JP pattern): pushes an urgent departure in "Ready to Travel" below a dozen "In Preparation" rows |
| **UXD-JW-03** | Journey detail uses the approved tab pattern, not the shipped Journey Planning single-page layout | Eight working areas; a single page would bury Documents and Tasks under Bookings. The tab pattern is the approved Workspace baseline; JP's single page was a disclosed MVP simplification. | Single long page with anchors (tested mentally against a 5-booking, 6-document Journey: > 4 screen heights) |
| **UXD-JW-04** | Lifecycle is a seven-step stepper; On Hold and Archived are overlays; Cancelled and Superseded are end-caps | Mirrors D-01 exactly: seven stages, a pause state, two alternative terminal outcomes, and an administrative state outside the lifecycle | Showing On Hold or Archived as steps (both would misrepresent the approved lifecycle) |
| **UXD-JW-05** | Superseded uses an informational (primary) tone and its own ⇢ glyph, never the Cancelled treatment | D-13: "Do not represent this as a cancelled Journey." A superseded Journey succeeded in a different form. | Reusing the Cancelled banner with a different sentence |
| **UXD-JW-06** | Non-owners who are not Administrators see no lifecycle buttons, only an explanatory line | Collaborative visibility without inviting actions that would fail (BR-035, FR-JW-09 AC3); keeps other people's Journeys calm to read | Disabled buttons for everyone (visual noise on every Journey a user merely looks at) |
| **UXD-JW-07** | On the Dashboard, task-based alerts appear in Today / Payments Due and never also in Needs Attention | BR-042: no duplicate reminders for one condition; D-05: reminders reduce effort | Showing every alert in Needs Attention (the same overdue payment would appear twice) |
| **UXD-JW-08** | "Start preparation" confirms the Readiness Template and advances in one deliberate dialog | Gate BR-041 and the transition always happen together in practice; one dialog halves the effort while each step stays explicit | Separate "Assign template" and "Start preparation" actions |
| **UXD-JW-09** | Material categories are not options in the Change Record form; a sentence routes to the material-change path | Redirect, don't reject (FR-JW-13 AC4); teaches the boundary at the moment it matters | Allowing selection then showing an error |
| **UXD-JW-10** | Document external references are masked to the last four characters in lists | References can be passport or visa numbers; Workspace screens are often visible to others in an office. No storage or rule change. | Showing in full everywhere |
| **UXD-JW-11** | Payments appear as a **Payments Due** panel of Payment follow-ups, not a KPI tile, and with no amount fields | I-01: no payment object exists; a KPI tile would need a definition the baseline does not have (baseline §17) | "Pending Payments" KPI tile; an optional amount field |
| **UXD-JW-12** | The five ratified KPI labels stay unchanged; D-09 areas are delivered as panels | Labels were ratified by the Product Owner (PRR-R1.3-WS11-001); changing them is a product decision (see PCR-UX-01) | Relabelling tiles to match this card's wording |
| **UXD-JW-13** | Owner, POC and Travellers are always three separate, labelled cards, even when the POC is also a traveller | D-12: distinct concepts that must never look interchangeable; one stable layout across Journeys | Merging POC into the Travellers card when they are the same person |
| **UXD-JW-14** | Action Required alerts cannot be dismissed or snoozed | BR-017 / FR-JW-26 AC2: only the condition resolves an alert. Postponing is done honestly by changing the due date. | Snooze (would contradict condition-based resolution) |
| **UXD-JW-15** | Lifecycle actions exist only inside the Journey, never as list-row shortcuts | Every lifecycle action has a gate or a reason; taking it with full context avoids mistakes | Row-level "Mark travelling" buttons |
| **UXD-JW-16** | JW-03 does not offer "request itinerary change"; it routes to Record operational change or Material change | Itinerary Studio is not built; the baseline gives these two paths (D-06, D-13) | Keeping the approved JW-03 action pointing at an unbuilt module |
| **UXD-JW-17** | Gated buttons use `aria-disabled` (focusable) with `aria-describedby` to the reason | Keyboard and screen-reader users can discover why an action is unavailable. A small accessibility refinement of the WS12 pattern, same visuals. | Native `disabled` (not focusable) |

---

## 29. Product Coverage and Validation

### 29.1 Functional Requirement coverage (all 34 Approved FRs)

| FR | Covered by | Section |
|---|---|---|
| FR-JW-01 Single working record, POC distinct | JW-02 header, people cards, tabs, facts rail | §8.1, §8.2, §13 |
| FR-JW-02 Stage history | JW-08 | §21 |
| FR-JW-03 Active Journeys, assign/reassign, never unassigned | JW-01, JW-17 | §7, §16 |
| FR-JW-04 System-derived status | No stage dropdown anywhere; actions only | §9.3 |
| FR-JW-05 No Journey creation | Quick Action removed; no create on JW-01; empty states | §6.5, §7.1, §24, UXD-JW-01 |
| FR-JW-06 Carried data, links both ways, initial POC | Facts rail, planning link, POC card | §8.2, §13 |
| FR-JW-07 Enters Confirmed, owned, notification | UF-02, IN-01 | §18, §17 |
| FR-JW-08 Approved lifecycle, only allowed transitions | Stepper, action matrix | §9 |
| FR-JW-09 Deliberate advance with gates | Gated primary button, dialogs | §9.3 |
| FR-JW-10 On Hold / resume | Hold dialog, banner, alert suspension | §9.2, §9.3 |
| FR-JW-11 Terminal outcomes, cancel with vendor flags, no reopen | Close / Cancel dialogs, banners | §9.3, §9.4 |
| FR-JW-12 Material change replacement path, Superseded | JW-13, banners, History pin | §14 |
| FR-JW-13 Operational Change Records, material refused | JW-09 form with guard | §8.7, §14.1 |
| FR-JW-14 Confirmed dates, not editable | Header meta line, no edit control, tooltip | §8.1 |
| FR-JW-15 Create Vendor Bookings (Draft, Active vendors, date warning) | Add booking panel | §11.3 |
| FR-JW-16 Booking status by deliberate logged actions, no Amended, no delete | Status actions, drawer | §11.2, §11.4 |
| FR-JW-17 Booking summary, KPI and global view feed | "n of m Booked", Pending Vendor Bookings panel, KPI | §8.2, §11.1, §6.2 |
| FR-JW-18 Vendor coordination log | Drawer coordination log | §11.4 |
| FR-JW-19 Communications with Traveller(s) or POC | JW-09 "who was contacted" | §8.7 |
| FR-JW-20 Append-only notes | JW-09 notes with correction | §8.7 |
| FR-JW-21 Document Readiness, no upload | JW-07 | §12.2 |
| FR-JW-22 Readiness across four categories, derived state | JW-05, Overview, lists | §12.1 |
| FR-JW-23 Configuration-driven templates, system/manual items, N/A | JW-05, template dialog | §12.1, §26 |
| FR-JW-24 Tasks and Follow-ups with categories | JW-06 | §10 |
| FR-JW-25 Journey task overview, Dashboard inclusion | Overview rail, Today panel, KPI | §8.2, §6.2 |
| FR-JW-26 Configurable Action Required alerts | Alert surfaces and rules | §17 |
| FR-JW-27 Informational notifications incl. Superseded | Bell, NOT-01 | §17.3 |
| FR-JW-28 Alert banner and at-risk list indicator | Journey Header, JW-01 row | §8.1, §7.2 |
| FR-JW-29 Search and filters incl. POC, outcome, Archived | JW-10, JW-11, global search | §20 |
| FR-JW-30 Journey Timeline events | JW-08 | §21 |
| FR-JW-31 No delete; reassign before terminal; archive with reason | No delete anywhere; JW-17; JW-14 | §15, §16 |
| FR-JW-32 Dashboard areas and Journey cards | DASH-01/02 | §6 |
| FR-JW-33 Recent Activity events | Recent Activity panel | §6.2 |
| FR-JW-34 Summary strip | JW-01 | §7.2 |

**Result: 34 of 34 covered.**

### 29.2 Business rules reflected

BR-025 (§9), BR-026 (§7.2, §16), BR-027 (§8.1; captured in Journey Planning, UXO-11), BR-028 (§9.3, §12.1), BR-029 (§9.2), BR-030 (§9.2–9.4), BR-031 (§8.1, §14.1), BR-032 (§8.7, §14.1), BR-033 (§11), BR-034 (§13), BR-035 (UXD-JW-06), BR-036 (§16), BR-037 (§11.2), BR-038 (§15), BR-039 (§14.2), BR-040 (§13), BR-041 (§9.3, §12.1), BR-042 (§17.3, UXD-JW-07). Also BR-004/005 (no automatic or free status changes), BR-006/007 (archive reversible, no delete), BR-017 (condition-based alerts).

### 29.3 Operational scenarios and exceptions represented

| Baseline scenario / exception | User flow |
|---|---|
| S-01 Domestic happy path | UF-02, 03, 06, 07 |
| S-02 International with visas | UF-03 (JW-07, AL-04, readiness gate) |
| S-03 Vendor slow | UF-04 |
| S-04 Operational change | UF-08 |
| S-05 Material change | UF-09 |
| S-06 Cancellation | UF-11 |
| S-07 Owner leaves | UF-12 |
| S-08 In-trip support | UF-06 |
| S-09 Corporate / B2B | §13 (POC type Corporate organisation / B2B partner; Corporate Point of Contact party) |
| S-10 Legacy Journey | UF-14 |
| S-11 Erroneous Journey | IF-12 (archive any time) |
| S-12 Payment due | UF-05 |
| E-02 Vendor inactive | §11.4 |
| E-03 Dates change | §8.1 tooltip → §14 |
| E-04 Readiness regresses | Step back (§9.3), AL-03 |
| E-05 Trip aborted | Cancel from Travelling (§9.3) |
| E-06 Owner deactivated | §16 |
| E-07 Material change while Travelling | Not offered; menu note (§9.3) |
| E-08 Traveller returns after cancel | No reopen; new planning record from Journey Planning |
| E-09 Created in error | Archive (§15) |
| E-10 Replacement planning Lost | §14.2 tracker |
| E-11 Booked service changes | IF-09 |

### 29.4 Validation expectations (this card)

| Expectation | Result |
|---|---|
| Every approved FR has UX coverage | ✅ 34/34 (§29.1) |
| Every operational workflow represented | ✅ 12 scenarios and the relevant exceptions (§29.3) |
| Dashboard actions align with the baseline | ✅ No Journey creation; Quick Action removed; KPIs link to filtered lists; D-09 areas all present (§6) |
| No UX bypasses the business lifecycle | ✅ Only allowed transitions rendered; no stage dropdown; no reopen; material fields never editable; Archive never an outcome; Superseded only via replacement; no auto-transition on dates (§9, §14, §15) |
| Terminology consistent with the baseline | ✅ §27; one known label tension disclosed, not resolved (UXO-03) |

---

## 30. UX Observations and Product Change Requests (for Tiger)

None of these blocks Architecture or Engineering Planning unless stated.

| ID | Observation | Owner | Blocking? | Sophie's recommendation |
|---|---|---|---|---|
| **UXO-01** | No `EBC-R1.3-WS13-001C` record exists in the repository or Project Knowledge. The I-01 Payments interpretation (Payment-category follow-ups) is treated as frozen. | Tiger | No, unless 001C recorded a different I-01 answer | File 001C. If a real payment object was intended, §6.2 Payments, §10.4 and UXD-JW-11 need a revision. |
| **UXO-02** | The approved JW-03 action "request an itinerary change (routes to Itinerary Studio)" has no destination in Release 1.3 | Tiger (note only) | No | Handled by UXD-JW-16 |
| **UXO-03** | **Label tension:** D-09 / this card say "Active Leads" and "Pending Vendor Bookings"; the ratified KPI tiles say "New Leads" and "Pending Vendor Confirmations" (baseline §17 keeps both). "Active Leads" has no written definition. | Arjun → Product Owner | No (UX uses ratified labels) | See PCR-UX-01 |
| **UXO-04** | FR-JW-23 AC2 says a template change "re-derives items" but not whether manual items and N/A decisions survive | Arjun | No (needed before Engineering of template change) | Keep manual items and N/A decisions for items that exist in both templates; show the effect in the dialog |
| **UXO-05** | No Vendor creation UI in Release 1.3 (WS16 not built). Without seeded Active vendors, JW-04 cannot be used | Tiger | **Yes for JW-04 usefulness** (baseline R-02) | Seed Active vendors or schedule a minimal vendor create |
| **UXO-06** | Journey Planning detail shipped as one page; Journey Workspace uses tabs. Two modules will differ until JP adopts tabs. | Tiger | No | Backlog a small JP layout alignment after WS13 |
| **UXO-07** | D-08 allows archiving a **non-terminal** Journey. The baseline doesn't say whether an archived active Journey stays editable or keeps raising alerts | Arjun | No (edge case) | **Resolved by POD-08 (Rev 4):** an Archived Journey is read-only; no unarchive in Release 1.3. Earlier recommendation: treat as read-only with alerts suspended until unarchived; confirm |
| **UXO-08** | Team scope visibility by role is still `OQ-001` / FR-DASH-06 | Product Owner | No | Administrator-only until decided (§6.3) |
| **UXO-09** | BR-036 says legacy Journeys are adopted "as part of release", which could mean a migration rather than an Administrator action | Archie | No | If migration adopts all, the JW-17 adoption panel covers only exceptions (e.g., no planning owner) |
| **UXO-10** | Travelling-stage support often happens on a phone; content screens are not phone-optimised this release | Tiger | No | Future backlog item (PCR-UX-02) |
| **UXO-11** | **CM-01 / CM-02 need Journey Planning UI changes**: (a) the Confirmed decision (JP-13) must capture Confirmed Travel Start and End Dates, End ≥ Start, both required, before conversion; (b) a banner on the pre-filled replacement JP record ("Replacement planning for JRN-····"). | Tiger to schedule; Sophie to write a short WS12-004 addendum when scheduled | **Yes for IF-08 and FR-JW-06/14 end-to-end** (baseline R-07) | For (a): two date fields inside the existing Decision dialog, with the Intended Travel Month shown as a hint |

**Product Change Requests (optional, for Product Owner review; not implemented)**

| ID | Request | Why | Impact |
|---|---|---|---|
| **PCR-UX-01** | Harmonise two ratified KPI labels with the WS13 baseline: "Pending Vendor Confirmations" → "Pending Vendor Bookings" (D-07 terminology), and confirm whether "Active Leads" (D-09) means the existing "New Leads" KPI | One vocabulary for one object; D-07 made "Vendor Confirmation" a status, not an object | Label and definition change only; KPI §17 wording |
| **FEAT-WS-FUTURE-001** *(Revision 2, Product opportunity only — do not implement)* | **Traveller Journey Timeline:** one end-to-end view of a traveller's whole relationship with SMV — Lead → Journey Planning → Journey → Travel → Post Travel → Feedback → Referral → Repeat Traveller | Identified in the Product Owner review of WS13-002. Would connect Journey Planning, Journey Workspace and the approved Traveller Hub Timeline (TH-03) into one relationship story. | Outside Release 1.3. **Hand back to Arjun** for Product Discovery and backlog refinement (Product Evolution Backlog). No WS13 UX, architecture or engineering work. |
| **PCR-UX-02** | Future: phone-optimised Travelling view (today's Journeys in trip, POC one-tap call, quick activity log) | In-trip support is the moment travellers most need SMV, and it rarely happens at a desk | New UX work in a later release; no Release 1.3 impact |

---

## 31. UX Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R-UX-JW-01 | Dashboard density (nine D-09 areas) could overwhelm | Medium | Order by urgency, five-row caps, collapsed empty panels; Sri to review with realistic data |
| R-UX-JW-02 | Poorly tuned thresholds create alert noise | Medium | Configuration (BR-042); UXD-JW-07 de-duplication; review after first weeks |
| R-UX-JW-03 | Users expect to edit dates or traveller counts in place | Medium | No edit control, explanatory tooltip, clear material-change route; Sri to test comprehension of "material change" |
| R-UX-JW-04 | Phone use during Travelling stage | Low–Medium | "Must not break" rule (§23); PCR-UX-02 |
| R-UX-JW-05 | CM-01 / CM-02 not scheduled → replacement flow and confirmed dates cannot work end to end | High (delivery) | UXO-11; Tiger to schedule |
| R-UX-JW-06 | Tab (WS13) versus single-page (WS12) inconsistency | Low | UXO-06 |

---

## 32. Hand-over Recommendations

### 32.1 For Archie (Architecture validation, WS13-003)

UX needs that have architectural consequences; Archie decides how:

1. **Counts** for the summary strip, KPIs and tab badges that exactly match filtered list sizes (FR-JW-34 AC1).
2. **Days in status** for Vendor Bookings (needs a status-changed timestamp) and **time on hold**.
3. **Next-action derivation** (stage + gates + alerts) used identically by Dashboard cards, list rows and the Overview card; one source of truth.
4. **Alert → resolving target** mapping so every alert deep-links to a tab and item (e.g. `…/journeys/[id]?tab=bookings&item=[bookingId]`).
5. **URL-addressable filters and tabs** (§20).
6. **Supersession links** readable from both Journeys, and replacement-planning status readable from the held Journey (§14.2).
7. **Archive Eligible** computed from Journey Closed date + configured retention.
8. **Sensitive references** (document external reference): masking is presentation only; Archie to confirm whether storage or access needs anything further.
9. **Configuration reads** for templates, categories, thresholds and retention, with labels suitable for display (§26).
10. Journey reference format (`OQ-024`) is used verbatim in breadcrumbs, rows and search.

### 32.2 For Rad (Engineering Planning, WS13-004)

- **CM-03 is independent and small:** remove "Create Journey" from `WORKSPACE_QUICK_ACTIONS` (`web/components/workspace/dashboard/QuickActions.tsx`). It can ship ahead of the rest.
- Suggested build order, matching the baseline's R-01 phasing: (1) JW-01, JW-02 header/Overview, lifecycle and dialogs, History, POC, reassign; (2) Vendor Bookings, Readiness, Documents, Tasks, Activity & Changes, alerts; (3) Dashboard panels and live KPIs, JW-11, archive, legacy adoption; (4) material change (after CM-01/CM-02).
- Reuse `EmptyState`, `Toast`, the WS12 stage-badge and gated-button patterns, and the existing tokens. Build the new primitives in §22 once, in `web/components/workspace/shared/` or a `journey-workspace/` component folder as Rad sees fit (no folder is created by this card).
- No new dependency is needed: stepper, drawers, segmented controls and chips are plain Workspace-native components (`DEC-R1.3-014`).
- Wireframes (§33) are low-fidelity structure references, not pixel specs; spacing and sizing follow the Design Language.

### 32.3 For Keerthi and Sri (later)

- Keerthi: derive test scenarios from §9.3 (action matrix incl. disabled states), §11.2 (booking transitions), §14 (replacement path), §17 (alert resolution), §29.3 (scenario map).
- Sri: focus on R-UX-JW-01 (Dashboard density), R-UX-JW-03 (material change comprehension) and the Superseded banner's tone.

---

## 33. Deliverables and Files

### 33.1 Wireframes (low fidelity, illustrative sample data)

Stored beside the existing Workspace mock-ups (existing folder, no new folder):

| File | Shows |
|---|---|
| `docs/04-UX/workspace/mockups/EBC-R1.3-WS13-002-WF-01-Dashboard.png` | DASH-01 My Work: KPI row, Needs Attention, Today, Upcoming Departures, Pending Vendor Bookings, Payments Due, Journey Planning, stage strip, Recent Activity, Quick Actions without Create Journey and My Work (three actions) |
| `…-WF-02-Active-Journeys.png` | JW-01: summary strip, filters, rows with alerts, On Hold, readiness, owner, POC, next action |
| `…-WF-03-Journey-Overview.png` | JW-02: sticky header, people cards, stepper, alert banner, tabs, next step, summaries, context rail |
| `…-WF-04-Lifecycle-States.png` | Stepper and banner variants: current, gated, On Hold (with replacement tracker), Cancelled, Superseded, Completed (Journey Closed), Archived overlay |
| `…-WF-05-Vendor-Bookings.png` | JW-04 with mini-steppers and status actions; booking drawer |
| `…-WF-06-Readiness-Documents-Tasks.png` | JW-05, JW-07 (no upload), JW-06 quick-add and categories |
| `…-WF-07-Material-Change-Superseded.png` | JW-13 dialog → On Hold tracker → Superseded original and replacement chip |
| `…-WF-08-Replacement-Provenance-Service-Category-Archive.png` *(Rev 4)* | Decision dialog with dates, nights and Service Category messages; replacement planning record provenance and Version 1 guidance; replacement Journey Documents to review; irreversible Archive dialog |
| `docs/04-UX/workspace/mockups/source/EBC-R1.3-WS13-002-wireframes.html` | HTML source for the above (reference only, not production markup) |

All names, destinations and references in wireframes are **illustrative sample data**, not production content.

### 33.2 Files created and modified

| File | Change |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-002-SOPHIE-Journey-Workspace-UX-Design-and-Experience-Specification.md` | **Created** (this document): UX specification, screen inventory, user and interaction flows, Dashboard and Journey Workspace specifications, design decisions, coverage, hand-over |
| `docs/04-UX/workspace/mockups/EBC-R1.3-WS13-002-WF-01…07-*.png` and `…/source/EBC-R1.3-WS13-002-wireframes.html` | **Created**: wireframes |
| `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` | **Additive revision** (§4 note + WS13 revision section): JW relabels, JW-09–JW-17, DASH Quick Action change. Original tables untouched. |
| `docs/04-UX/workspace/WORKSPACE-INFORMATION-ARCHITECTURE.md` | **Additive revision**: Journey tab set; lifecycle outcome names (§6, §8) |
| `docs/04-UX/workspace/WORKSPACE-NAVIGATION-MODEL.md` | **Additive revision**: §4.5 tab set and no-claim ownership; §4.7 outcomes; closes the A-UX-03 provisional-stage note |
| `docs/04-UX/workspace/WORKSPACE-INTERACTION-FLOWS.md` | **Additive revision**: Journey Creation step 6–7 (owner carried, no claim), Vendor Assignment → Vendor Booking lifecycle, Journey Completion outcomes |
| `docs/04-UX/workspace/WORKSPACE-USER-JOURNEYS.md` | **Additive revision**: Journeys 5, 6 and 7 aligned to D-01 to D-13 |
| `docs/04-UX/workspace/WORKSPACE-EMPTY-STATE-LIBRARY.md` | **Additive revision**: Journey Workspace empty states; VM queue copy relabel |
| `docs/04-UX/workspace/WORKSPACE-UX-SPECIFICATION.md` | **Additive revision**: §4 Quick Actions now four (CM-03) |
| `docs/04-UX/workspace/WORKSPACE-COMPONENT-INVENTORY.md` | **Additive revision**: new Journey Workspace components (planned, not implemented) |

Every revision follows the project's supersede-not-delete convention: original text is left in place, a short dated note under the affected heading points to a WS13 revision section at the end of the document. No approved document is duplicated.

**Not modified:** Product artefacts (WS13-001, RTM, Spec v2.0, WS12-003), Architecture, Engineering, `RELEASE-1.3.md`, Feature Register, Workstream Plan, Backlog, any application code. No folder created, renamed or reorganised. Nothing committed or pushed.

---

## 34. UX Completion Summary — Hand-over to Tiger

| Item | Summary |
|---|---|
| **UX artefacts** | This specification (primary); 7 wireframes + HTML source; additive WS13 revisions in 8 approved Workspace UX documents (§33.2) |
| **Product coverage** | 34 of 34 FRs covered; BR-025–042 reflected; 12 scenarios and relevant exceptions mapped; D-01 to D-13 all expressed in the UI; no conflict with the frozen baseline found |
| **Dashboard** | Operational management view: 5 ratified KPIs live, 9 D-09 areas as panels, "Create Journey" removed (CM-03), no creation capability |
| **Outstanding UX observations** | UXO-01 (001C record missing; I-01 assumed frozen), **UXO-05 (vendor seeding — blocks JW-04 usefulness)**, **UXO-11 (CM-01/CM-02 Journey Planning UI — blocks end-to-end replacement and dates)**, UXO-03/04/07/09 for Arjun/Archie; the rest are notes |
| **Product Change Requests** | PCR-UX-01 (KPI label harmonisation), PCR-UX-02 (future phone Travelling view), **FEAT-WS-FUTURE-001 Traveller Journey Timeline** (Product opportunity, for Arjun). None implemented. |
| **Revision 2 and 3** | Product Owner refinements UX-01 to UX-08 incorporated (§35). **UX package accepted by Tiger and the Product Owner on 26-Sep-2026; EBC complete.** |
| **Revision 4 (27-Sep-2026)** | UX synchronisation UXA-01 to UXA-06 with the final Product, Architecture and Engineering baselines (§36). Submitted to Tiger for acceptance. |
| **Recommendations for Engineering** | §32.2: ship CM-03 early; four-phase build; reuse WS11/WS12 components; no new dependency |
| **Architecture validation** | Recommended: ten UX-driven items in §32.1 for Archie (WS13-003) |
| **Next steps (Tiger)** | Review this card → Product Owner acceptance of the UX → Archie WS13-003 → Rad WS13-004; schedule CM-01/CM-02 (with a short Sophie addendum to WS12-004) and vendor seeding |

---

## 35. Revision 2 — Product Owner Review Refinements (26 September 2026)

Tiger and the Product Owner accepted WS13-002 with minor refinements. Each is incorporated exactly as approved; nothing else changed.

| Ref | Refinement | Where it now lives | Wireframe |
|---|---|---|---|
| UX-01 | Remove the **My Work** Quick Action. Remaining: New Lead, Add Traveller, New Vendor | §6.1, §6.5, §22 | WF-01 |
| UX-02 | Active Journeys: no change | — | WF-02 unchanged |
| UX-03 | Remove the duplicated **View readiness**; each action appears once per operational context | §8.1 ("One action, one place" rule), §8.2, §9.3 | WF-03 |
| UX-04 | User-facing label **Completed** replaces "Journey Closed"; lifecycle state and product terminology unchanged | §4, §8.1, §9.1–9.4, §20, §27 | WF-04 |
| UX-05 | Stronger visual distinction between **Confirmed** and **Booked** (outline vs solid, glyph, text) | §11.2a, §22 | WF-05 |
| UX-06 | Icons for task categories Operational, Payment, Traveller follow-up | §10.2, §22 | WF-01, WF-03, WF-06 |
| UX-07 | Material-change CTA becomes **Create Replacement Journey** | §14.2, §19 (IF-08) | WF-07 |
| UX-08 *(Revision 3)* | Post Travel action "Close Journey" renamed **Mark as Completed** (state remains Journey Closed; badge shows Completed) | §5, §8.2, §9.3, §17.2, §18, §19, §26 | none affected |
| FEAT-WS-FUTURE-001 | Traveller Journey Timeline, recorded as a Product opportunity only, for Arjun | §30 | — |

**Consistency check after Revision 2:** FR coverage still 34/34; no business rule, lifecycle state or product term changed (UX-04 is presentation only); no new dependency, token or brand asset (UX-06 icons follow the inline-SVG convention). The additive WS13 revision sections in the Screen Inventory, UX Specification and Component Inventory were updated for UX-01, UX-05 and UX-06, and the Information Architecture and Navigation Model revisions note UX-04.

---

## 36. Revision 4 — WS13 UX Synchronisation (UXA-01 to UXA-06), 27 September 2026

**Purpose.** This revision aligns the accepted UX (Revision 3) with the final, governance-complete baselines. It is **documentation alignment, not new design**. No workflow is redesigned. No Product, Architecture or Engineering decision is changed or added.

**Sources (read in full for this revision).**
- Product: WS13-001 Revision 3 (§6, §11, §11.2, §12, §14, §26.3), including POD-01–08, PD-A–E and O-A2–O-A5; BR-036, 038, 041, 043–047.
- Architecture: WS13-004A (AC-01 to AC-07 and O-A6); WS13-003 §15.
- Engineering: WS13-004 §8 (API error codes) and §9.3 (Rad's UX items).

**Traceability.** Tiger's UXA-01 to UXA-06 cover Rad's §9.3 items as follows:

| Rad §9.3 item | Where it is covered |
|---|---|
| UXA-01 (Decision dialog) | §36.3 |
| UXA-02 (Service Category) | §36.2 |
| UXA-03 (Archive dialog) | §36.1 |
| UXA-04 (Change Category) | §36.7 |
| UXA-05 (Adoption panel) | §36.2 |
| UXA-06 (Service type) | §36.7 |

Archie's O-A6 (provenance labels) is covered in §36.4 to §36.6.

### 36.1 UXA-01 — Archive without Unarchive (POD-08, PD-E, BR-038)

**What changes.** There is **no Unarchive** anywhere in Release 1.3:
- no menu item;
- no button on the Archived banner;
- no dialog;
- no Administrator capability.

Earlier references are struck through in §3, §5, §8.1, §9.2, §15, §21 and §27.

**Archive dialog (JW-14), final copy**

```
Archive this Journey?
Archiving can't be undone in this release.
The Journey leaves active views and becomes read-only. It stays searchable,
and its history, documents and timeline remain available.
Stage and outcome don't change, and nothing is deleted.

Reason (required)  [                                   ]
Archived by Vivek (Administrator) · today

[only when the Journey is not Completed, Cancelled or Superseded:]
⚠ This Journey is still active (In Preparation). Archiving stops all work on it.
☐ I understand this Journey can't be restored in this release.

                                         [Cancel]   [Archive Journey]
```

- The **Archive Journey** button stays disabled until:
  - a reason is entered; and
  - for a non-terminal Journey, the acknowledgement box is ticked.

  The acknowledgement protects against the one irreversible mistake the baseline allows: archiving an active Journey (O-10, R-ENG-JW-14). Routine archiving of Completed Journeys (AL-15) needs only the reason, so there is no extra friction for the common case.
- **Archived Journey = read-only** (BR-038):
  - every lifecycle, edit and add control is hidden, and the ⋯ menu shows only "View planning record ↗";
  - a single line under the tab bar reads: "Archived Journeys are read-only.";
  - **Tasks and Follow-ups are read-only too (Rev 4a, OBS-S2, Product Owner):** on an Archived Journey, open tasks and follow-ups cannot be completed, edited, reassigned, cancelled or created. See §36.12;
  - the banner reads: "▣ Archived on 5 Jan by Vivek · Reason: … · Stage and outcome are unchanged. Archived Journeys can't be restored in this release."
- **Unchanged:**
  - Archived Journeys stay viewable, searchable (JW-11 Archived filter, global search), reportable and auditable (Timeline viewable, FR-JW-30 AC3);
  - AL-15 still opens this dialog.

### 36.2 UXA-02 — Service Category (POD-02, POD-07, PD-A, PD-C, BR-036, BR-043)

The Service Category classifies the traveller experience. It is **one value per Journey**, taken from the configured list: Domestic, International, Weekend Getaway, Honeymoon, Family, Solo, Pilgrimage.

**Where it appears**

| Place | Behaviour | Copy |
|---|---|---|
| **Journey Planning: create form and Trip Basics panel** (JP-03 / JP-04) | Optional select field ("Not set" by default). It sits beside the other Trip Basics fields and carries a small tag, **Needed to confirm**. This reuses the WS12 "Needed before Planning" pattern. It does **not** count towards the five-field Planning gate (BR-021 is unchanged). | Helper: "Optional while planning. You'll need it to confirm the Journey." |
| **Journey Planning Decision dialog, Confirmed outcome** | Shown as a value. If it is missing, the dialog shows an inline error with a link that opens Trip Basics (§36.3). | "Choose a Service Category before confirming. [Set in Trip Basics]" |
| **Replacement planning record** | Pre-filled from the original Journey (AC-07) and editable. | Chip: "Pre-filled from JRN-····" |
| **Journey header meta line** | Chip, e.g. "Honeymoon". Owner and Administrator see an edit pencil, which opens a small picker dialog. **This is the only place it is edited.** It is shown read-only in the Overview facts rail. | Picker helper: "Changing the category is recorded in History. It doesn't change the itinerary or need a replacement Journey." |
| **Journey History** | Event "Service Category changed: Family → Honeymoon", with actor and time (FR-JW-30) | — |
| **Legacy Journey (not adopted)** | Header shows a muted "Not yet classified" in place of the chip. There is no edit pencil, because the category is set during adoption. | — |
| **Adoption panel (JW-17)** | **Required** field with no pre-selection and no suggestion. "Adopt Journey" stays disabled until it is chosen. | "Choose the category that best describes this traveller experience. It isn't set automatically." |

**Not shown:** no automatic classification, suggestion or default is ever shown (PD-C, O-13). The category is not a list filter, because FR-JW-29 does not include one.

**Distinct from the Readiness Template.** Domestic and International exist in both lists. The Start preparation dialog therefore adds one helper line: "The readiness template is chosen separately from the Service Category."

### 36.3 Journey Planning Decision dialog — Confirmed outcome (CM-01, CM-05, CM-07; PD-A; POD-06) — closes UXO-11 (a)

These are Journey Planning touchpoints required by the WS13 baseline. They extend the existing Decision dialog (JP-13). **The WS12 UX document is not edited** (§36.10, OBS-S4).

```
Confirm this Journey
Confirmed travel start  [12 Oct 2026]   Confirmed travel end  [18 Oct 2026]
   Pre-filled from JRN-···· · edit if the dates have changed        ← replacement records only
Number of nights   6     (from Trip Basics · Edit)
Service Category   Family (from Trip Basics · Edit)
Journey Owner      Anita Rao
Creating the Journey can't be undone. Planning history stays on this record.
                                                   [Cancel]  [Confirm & create Journey]
```

- **Editable here:** only the dates. The Decision request carries only the dates (WS13-004 §8.1).
- **Nights and Service Category:** shown as values, with an "Edit" link to Trip Basics. This introduces no new request field.
- **Validation:** checked as the user types, and shown together, one message per field (PRA-01 precedent). The server remains the control.

| Server code | Inline message |
|---|---|
| `dates_required` | "Add the confirmed start and end dates." |
| `dates_invalid` | "The end date can't be before the start date." |
| `nights_required` | "Add the number of nights in Trip Basics before confirming." |
| `dates_nights_mismatch` | "These dates cover 7 nights, but Trip Basics says 6. Change the dates or the nights so they match." (I-05; never auto-corrected) |
| `service_category_required` / `_invalid` | "Choose a Service Category before confirming." |
| `owner_required` | "Assign an owner before confirming. A Journey always has an owner." |
| `original_not_on_hold` | "The original Journey JRN-···· is no longer on hold, so this replacement can't be confirmed. Open JRN-···· to check its status." |

**Confirm & create Journey** stays disabled (with `aria-disabled` and the reason) while any message is present.

**Replacement record banner** (UXO-11 (b)): "Replacement planning for JRN-···· · The original Journey is on hold until this is confirmed. [Open JRN-····]"

### 36.4 UXA-03 — Provenance vocabulary for replacement Journeys (BR-046; WS13-004A AC-01 to AC-07)

One verb for each kind of inheritance, used everywhere:

| Label | Meaning for the user | Used for |
|---|---|---|
| **Pre-filled from JRN-····** | A starting value. Check it and change it if needed. | Journey Planning fields (party, destination, trip basics, month, departure city, Service Category); Decision dialog dates |
| **Carried from JRN-····** | Brought forward as the working starting point of this record. | Proposal Version 1; the Primary Operational Contact on the replacement Journey; Journey Documents; the vendor quotation baseline |
| **Copied from JRN-····** | A read-only historical copy for reference. | Operational Notes copied into the planning record as internal comments |

**Placement**

| Where | Visual | Text |
|---|---|---|
| JP Trip Basics / create fields | Small muted chip under each pre-filled field; it disappears once the user edits that field | "Pre-filled from JRN-····" |
| JP Proposal (Version 1) | Chip on the version row and at the top of the composer | "Carried from JRN-···· (accepted version v3)" + guidance (§36.6) |
| JP internal comments | Chip at the start of each copied note. The stored header ("Carried from JRN-#### · note by …, date") stays as written by AC-04. | "Copied from JRN-····" |
| JP Vendor Quotations | Chip on each baseline row. The amount shows "—". | "Carried from JRN-···· · Re-quote needed" |
| JP Vendor Quotations, no baseline | Quiet note when the original had no Booked bookings with Active vendors (O-14) | "No quotation baseline was carried from JRN-···· (no Booked vendors). See its bookings ↗" |
| Replacement Journey: POC card | Muted line under the contact | "Carried from JRN-····" |
| Replacement Journey: header | Existing chip | "Replaces JRN-···· ↗" |

**Rules**
- Chips are text, never colour alone.
- Each chip links to the original Journey where a link is useful.
- Chips never block or ask for confirmation.
- They use data the baseline already records, never new fields (see OBS-S1):
  - the replacement relationship;
  - AC-02 to AC-06 provenance text;
  - audit `event_data`.

### 36.5 UXA-04 — Journey Documents after a material change (BR-046, O-A4)

When the replacement Journey is created, carried documents arrive with Verified reset to Received and Not Applicable reset to Outstanding. The UX makes the review obvious without adding a status or a gate.

- **Documents tab banner** (replacement Journeys only; stays while any carried document still needs review):
  > "⚠ 4 documents were carried from JRN-···· after a material change; 3 still need review. Review each one — a document that was valid for the original trip may not be valid now." (counts are live)
- **Row chips:**
  - **"Carried from JRN-····, re-verify"** on every carried document, until it is set to Verified or, where permitted, Not Applicable.
  - **"Review required"** (amber outline) on rows the reset moved from Verified or Not Applicable.
  - The previous N/A reason is visible in the notes, as AC-06 stores it.
- **Tab badge:** "Documents 3 to review" replaces the plain outstanding count while reviews remain.
- **Overview:** the Documents summary adds "3 to review".
- **Guidance only.** The chips and banner never block the Ready to Travel gate. Readiness follows BR-028 and the template as before.

### 36.6 UXA-05 — Version 1 proposal guidance (BR-047, O-A5)

On a replacement planning record, while the current proposal version is the carried Version 1:

- **Composer header:** "Carried from JRN-···· (accepted version v3). This is the original trip's itinerary and price estimate. Review and update it before sharing it with the traveller."
- **Next to the Share / Send action:** a quiet inline note, "You're about to share the carried proposal. Have you updated it for the new plan?"
  - It has **no confirmation step and no disabled state**. Sharing works exactly as today (BR-047: not system-enforced).
- The guidance disappears once a new version exists.

### 36.7 UXA-06 — Copy alignment

| Area | Final wording / behaviour | Source |
|---|---|---|
| Change Record form | Field **Change Category** (required): Itinerary · Traveller · Accommodation · Transport · Activities · Operational · Documentation. Helper: "The category describes the change. It doesn't decide whether the change is material." The material-change sentence and link (§14.1) stay beneath it. | POD-04, BR-045 |
| Vendor Booking | "Service type" (never "service category"). Vendor picker shows "Name · VEN-00012", searchable by either. | I-06, PD-D |
| Readiness | Item tags **Mandatory / Optional**. Gate note: "n mandatory items outstanding". Tooltip on the state chip: "Calculated from mandatory items only." | POD-01, BR-028 |
| Readiness template change | Dialog: "Template items will be recalculated. Items you added yourself are kept." | POD-08 D1, BR-041 |
| Documents | "Document Type" picker grouped by category; **Add another** allowed for the same type | POD-03, BR-044 |
| Archive | §36.1 copy; no "Unarchive" or "Restore" wording anywhere | POD-08 |
| Superseded / replacement | Unchanged from Revision 3 ("Create Replacement Journey", "Superseded by JRN-····", "Replaces JRN-····") | D-13 |
| Terminal label | "Completed" for the Journey Closed state (unchanged from Revision 2) | UX-04 |
| Terminology register | New rows in §27 | — |

### 36.8 Wireframes

- **New:** `docs/04-UX/workspace/mockups/EBC-R1.3-WS13-002-WF-08-Replacement-Provenance-Service-Category-Archive.png`, covering:
  - the Decision dialog;
  - the replacement planning record with provenance and Version 1 guidance;
  - replacement Journey Documents under review;
  - the irreversible Archive dialog.
- **Re-rendered:**
  - WF-03: Service Category chip in the header meta line.
  - WF-04: panel F with no Unarchive; read-only note.

The HTML source is updated.

### 36.9 Observations before Engineering implementation

| ID | Observation | Owner | Blocking? |
|---|---|---|---|
| **OBS-S1** | Provenance chips (§36.4, §36.5) must come from data the baseline already records: the replacement relationship, the provenance text stored by AC-02 to AC-06, and audit `event_data`. If any chip cannot be derived without a schema change, render the stored provenance text line instead. No schema change is requested. | Rad, Archie | No |
| **OBS-S2** | ~~BR-038 makes an Archived Journey read-only, but doesn't say whether open Tasks and Follow-ups linked to it can still be completed from the Dashboard by their assignee. UX default: they remain visible and completable, because completing a task changes the task, not the Journey.~~ **Resolved (Rev 4a):** the Product Owner confirmed an Archived Journey is fully read-only; its open tasks cannot be completed, edited or created (§36.12). | Product Owner | Closed |
| **OBS-S3** | Received satisfies the documents readiness item (FR-JW-23 AC3), so a Verified → Received reset does not block Ready to Travel. The "Review required" guidance is therefore the main prompt to re-verify. This follows BR-046 and is not a gap. | Product Owner awareness | No |
| **OBS-S4** | Journey Planning touchpoints (§36.2, §36.3, §36.4, §36.6) are specified here as WS13-driven changes (CM-01, 05, 07, 08). `EBC-R1.3-WS12-004` is left historically unchanged. Tiger may want a one-line pointer added there. **Done (Rev 4a):** a navigation cross-reference was added to `EBC-R1.3-WS12-004` (§36.12). | Tiger | Closed |
| **OBS-S5** | Correction for the record: the Revision 3 file of this specification ("Mark as Completed") had not reached the repository in the 26-Sep hand-off. The repository copy still held Revision 2 text, although the Interaction Flows note and the Project Knowledge copy were correct. This commit carries Revision 3 and Revision 4 together. It has been verified on disk. | Tiger (note) | No |
| **OBS-S6** *(Rev 4a)* | Due-date alerts AL-12, 13 and 14 for tasks on an Archived Journey. The baseline says terminal outcomes resolve alerts, but archive is not a terminal outcome. UX assumes these alerts no longer surface, because nobody can act on them (§36.12). | Arjun, Archie to confirm | No |

### 36.10 Document-by-document change log (Revision 4)

| Document | Change |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-002-…-Specification.md` | Revision 4 row; struck-through replacements in §3, §5, §8.1, §8.7, §9.2, §11.1, §11.3, §12.1, §12.2, §14.1, §15, §16, §21, §26, §27, §30 (UXO-07 resolved); new §36; §33 and §34 updated |
| `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` | WS13 revision: JW-14 is "Archive" (no Unarchive), Archived Journeys read-only; JW-17 adds Service Category; JP-03/JP-04/JP-13 touchpoints noted |
| `docs/04-UX/workspace/WORKSPACE-INTERACTION-FLOWS.md` | WS13 revision: Journey Creation step 1a adds Service Category and the dates–nights block; replacement provenance; archive irreversible |
| `docs/04-UX/workspace/WORKSPACE-INFORMATION-ARCHITECTURE.md` | WS13 revision §8: Archived is read-only and cannot be restored in Release 1.3 |
| `docs/04-UX/workspace/WORKSPACE-USER-JOURNEYS.md` | Journey 6/7 notes: Service Category, replacement provenance, archive irreversible |
| `docs/04-UX/workspace/WORKSPACE-COMPONENT-INVENTORY.md` | Planned components: provenance chip, Service Category chip and picker, review-required chip, archive acknowledgement |
| `docs/04-UX/workspace/WORKSPACE-EMPTY-STATE-LIBRARY.md` | JP Vendor Quotations "no baseline carried" note |
| `docs/04-UX/workspace/mockups/` (+ `source/`) | WF-08 added; WF-03 and WF-04 re-rendered; HTML source updated |

**Not modified:**
- Product, Architecture and Engineering documents;
- WS12 documents;
- governance and release trackers;
- application code.

Nothing is committed or pushed.

### 36.11 Confirmations

- **No Product behaviour changed.** Every item restates an approved decision: POD-01–08, PD-A–E, O-A2–O-A5, BR-036/038/041/043–047.
- **No Architecture decision changed.** The labels follow AC-01 to AC-07. No field, table, status or event is introduced.
- **No Engineering assumption introduced:**
  - The Decision dialog sends only the dates already in the planned request (WS13-004 §8.1).
  - Messages map one-to-one to Rad's error codes.
  - Nights and Service Category are edited through the existing Trip Basics path.
  - The provenance fallback is stated (OBS-S1).
- **Release 1.3 scope unchanged.** Unarchive is removed, as decided by the Product Owner; nothing is added.

### 36.12 Revision 4a — Governance review follow-up (27 September 2026)

**OBS-S2: an Archived Journey is fully read-only (Product Owner clarification of BR-038).**

| Surface | Behaviour for tasks and follow-ups linked to an Archived Journey |
|---|---|
| Journey → Tasks & Follow-ups tab | The list is shown, with its category chips and due dates. The **quick-add row is removed**. **No "Done" checkbox**: a small lock glyph sits in its place. The overflow (Edit due date, Reassign, Cancel) is hidden. One line above the list reads: "This Journey is archived. Its tasks and follow-ups are read-only." |
| Journey → Overview context rail | Tasks are shown read-only. "+ Add" and "Done" are removed. |
| Dashboard: Today, Payments Due, Tasks Due Today KPI | **Not shown.** Archived Journeys are hidden from active views (BR-038), and these panels list only actionable work. A task that can never be completed must not sit in "Today" forever. |
| A task opened from a notification or a direct link | Opens on the archived Journey's Tasks tab in the read-only state above. No action is available. |
| Assignee who is not the owner | Same read-only state. The assignee's usual "complete your own task" permission does not apply on an Archived Journey. |

This refines §10.1, §10.3 and §10.5 for Archived Journeys only. Everywhere else, task behaviour is unchanged.

**Consequence for Engineering, stated for completeness (not a new rule).** The UX expects the read-only behaviour to be enforced by the service, not only hidden in the UI, as for every other Archived Journey write. Due-date reminders (AL-12, AL-13, AL-14) for tasks on an Archived Journey should not keep appearing to assignees who cannot act on them.

The baseline doesn't state whether those alerts are suppressed or resolved on archive. This is recorded as **OBS-S6** for Arjun and Archie to confirm. UX assumes they no longer surface. OBS-S6 is **not blocking**: the Dashboard and task UX above are fully specified either way.

**OBS-S4: WS12 cross-reference.** `docs/09-Development/EBC-R1.3-WS12-004-SOPHIE-UX-Design-and-User-Experience-Specification-Journey-Planning.md` now has a short **navigation note** under its revision history. It points to this document's §36.2 to §36.6 for the WS13-driven Journey Planning touchpoints:
- Service Category;
- the Confirmed decision dialog;
- the replacement record banner and provenance labels;
- the guidance on the carried Version 1 proposal.

It is a pointer only. WS12-004's text, revisions and approval status are unchanged. The Project Knowledge copy was updated the same way.

**Accepted as submitted:** OBS-S1 (provenance only from the existing data model, no schema change); OBS-S3 ("Review required" guidance is sufficient); OBS-S5 (repository correction acknowledged).

**Confirmations (unchanged):**
- no Product behaviour changed (OBS-S2 applies the Product Owner's clarification);
- no Architecture decision changed;
- no Engineering assumption introduced beyond restating read-only enforcement;
- Release 1.3 scope unchanged.

Nothing committed or pushed.


---

## Confirmations

- UX design only. No Product requirement, Business Rule, Functional Requirement, Architecture, Engineering, or Release Governance artefact was changed.
- No application code, schema, migration or configuration was touched.
- No folder was created, renamed or reorganised; files were added only to existing folders.
- The frozen baseline was not modified. Every product question found during UX is recorded in §30 for Tiger rather than resolved here.
- Brand system and Workspace Design Language unchanged: no new colour, font, icon library or asset.
- Nothing committed or pushed.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS13-002. UX design complete and handed to Tiger; not self-approved.*
