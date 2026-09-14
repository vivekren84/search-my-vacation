# Workspace Navigation Model

| Document Information | |
|---|---|
| Document Name | Workspace Navigation Model |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 |
| Last Updated | 14 September 2026 |
| Predecessor | Workspace Information Architecture v1.0 |

---

## 1. Purpose

This document specifies the Workspace's navigation model in detail — the persistent navigation surfaces, their states, and how navigation behaves through a Workspace User's working day. It translates the Workspace Information Architecture's structure into a navigation model a Workspace User actually experiences, and satisfies this EBC's separate requirement to define the Workspace Experience across a working day.

## 2. Navigation Surfaces

### 2.1 Primary Navigation Rail

Persistent, left-hand (desktop-first per UX Design Brief §9), always visible except where a full-screen contextual flow (e.g., first-time setup) temporarily suppresses it.

```
┌────────────────────────┐
│  [Logo]                │
├────────────────────────┤
│  ⌂ Dashboard           │
├────────────────────────┤
│  OPERATIONAL           │
│  ▸ Journey Planning    │
│  ▸ Journey Workspace   │
├────────────────────────┤
│  KNOWLEDGE              │
│  ▸ Traveller Hub        │
│  ▸ Itinerary Studio     │
│  ▸ Vendor Management    │
│  ▸ Destination Intel.   │
├────────────────────────┤
│  (spacer)              │
├────────────────────────┤
│  ⚙ Settings            │
└────────────────────────┘
```

Each item shows an unclaimed/attention-needed count badge where the underlying queue supports one (Journey Planning, Journey Workspace, Vendor Management's Vendor Confirmations queue); Traveller Hub, Itinerary Studio and Destination Intelligence show a badge only where a governance action is pending on an item owned or assignable to the current Workspace User (e.g., a Destination Profile awaiting their review).

### 2.2 Header Bar

Persistent across every screen:

```
┌───────────────────────────────────────────────────────────┐
│  [Section title]     [Global Search]   🔔[n]   [My/Team]  👤 │
└───────────────────────────────────────────────────────────┘
```

- **Section title** — reflects current module/object (e.g., "Journey Planning", or a specific Traveller's name when inside their record).
- **Global Search** — supports searching Travellers (name/mobile), Inquiries, Journey Planning Records, Journeys, Vendors and Destination Profiles.
Search results should present the matching business object together with sufficient contextual information to allow the Workspace User to immediately identify the correct record.
- **Notification bell** — badge count reflects Action Required notifications only (Informational notifications are visible in the log but do not inflate the count a Workspace User must clear, consistent with PD-NO-003's distinction).
- **My Work / Team toggle** — visible on Dashboard only (FR-DASH-02); shown greyed/inactive elsewhere to preserve header consistency without implying it affects the current module.
- **User menu (👤)** — Personal Preferences (profile, password, photo, appearance), sign-out.

### 2.3 Contextual Tab Bar

Appears when a Workspace User opens a specific record (a Journey Planning Record, Journey, Master/Traveller Itinerary, Vendor, or Destination Profile). Replaces nothing in the Primary Navigation Rail or Header — it is additive, appearing beneath the header within the module's own screen. Tab sets are defined per-object in the Screen Inventory (Section 6 there) and summarised in the Information Architecture (§6).

## 3. Navigation States

| State | Behaviour |
|---|---|
| Default (no unread Action Required) | Bell icon unbadged; rail items show only count badges where a queue has unclaimed/overdue items |
| Action Required notification(s) pending | Bell shows a count badge; badge persists (does not clear on hover/click alone — only when the underlying condition resolves, per BR-017/PD-NO-004) |
| Item claimed by current user | Item's card/row shows the current user as Owner; item leaves the "unclaimed" visual treatment across Dashboard and its home queue simultaneously |
| Item reassigned away from current user | Item disappears from the current user's "My Work" scope on next view; a Notification is generated to the new owner (FR-NOT-03) |
| Record in a terminal state (Closed/Lost/Archived; Successfully Completed/Cancelled/Archived) | Removed from the active queue view by default; remains reachable via Traveller Hub, search, or an explicit "show closed/archived" queue filter — never removed from the system (BR-006/BR-007) |

## 4. Workspace Experience Across a Working Day

Per this EBC's requirement and the UX Design Brief §4, the Workspace's navigation and default views are built to support four moments occurring, in practice, in a repeating cycle rather than strictly once per day.

### 4.1 First Login

Landing view: **Dashboard**, "My Work" scope by default (FR-DASH-02 default state). Cards summarise Journey Planning, Journey Workspace/Active Journeys, Vendor Confirmations, Tasks and Follow-ups owned by or unclaimed and relevant to this Workspace User (FR-DASH-05), each with a visible owner (FR-DASH-03) and a recommended next action (FR-DASH-04). This is the concrete realisation of "I know exactly what is happening today" (UX Design Brief §4).

### 4.2 Receiving New Work

A new Inquiry arriving through any approved external channel (Journey Passport, WhatsApp, telephone, email, walk-in, returning traveller or manual entry) appears in the Journey Planning queue awaiting qualification.

### 4.3 Managing Inquiries

Within Journey Planning, the Workspace User works a claimed Journey Planning Record through its approved lifecycle stages (PD-JP-005: Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed) using the contextual tab bar (Requirements, Proposal Versions, Vendor Quotations, Discovery Notes, Tasks & Follow-ups, History). Stage progression is always a deliberate action (FR-WS-016/BR-004/BR-005), never an implicit or free-text edit.

### 4.4 Progressing Work Toward Journeys

On traveller acceptance, the Journey Planning Record converts to a Journey (BR-012). The Workspace User's navigation experience of this moment — what they see, what confirmation step exists, and where they land afterward — is specified in the Interaction Flows document ("Journey Creation").

### 4.5 Managing Active Journeys

Journey Workspace's Active Journeys queue (FR-WS-019) uses the same claim/ownership interaction as Journey Planning. The contextual tab bar (Overview, Itinerary, Vendor Confirmations, Operational Readiness, Tasks & Follow-ups, Documents, History) supports the day-to-day operational work PO-REVIEW-04 approved: booking coordination, traveller servicing, vendor coordination, operational readiness tracking.

### 4.6 Operational Awareness

Throughout the day, the Notification bell and Dashboard cards are the two channels through which the Workspace surfaces conditions needing attention (outstanding traveller documents, an overdue vendor quotation, an approaching departure with incomplete readiness, a governance review awaiting approval) without the Workspace User needing to check each module proactively — the "calm coworker" behaviour the Business Lifecycle (§3) and UX Design Brief (§5) both specify.
Operational awareness should remain proactive rather than reactive.
Workspace Users should not be required to navigate through multiple modules to determine whether action is required. The Workspace should surface important operational conditions at the earliest appropriate moment while avoiding unnecessary interruptions.

### 4.7 Completing Work

A Journey Planning Record closing (Confirmed/Lost/Archived) or a Journey concluding (Successfully Completed/Cancelled/Archived) is a deliberate, owner-driven action, never an automatic timeout. On completion, the record leaves the active queue but remains fully reachable (Section 3 above), and — for a Successfully Completed Journey — Itinerary Studio's Learning Repository (PD-IS-005) becomes the natural next-navigation point for capturing operational learnings, surfaced as a suggested action rather than a forced step.

### 4.8 End-of-Day Confidence

Because every unresolved condition remains visible (persistent Notification badge, unclaimed-item counts, Dashboard cards) rather than silently expiring, a Workspace User can confirm — by simply looking at the Dashboard and the bell icon — that nothing owned by them is in an unaddressed state before logging out. This is the direct navigation-level realisation of the Business Lifecycle's "Nothing Important Missed" principle (§3) and the UX Design Brief's end-of-day target feeling (§4).

## 4.9 Navigation Philosophy

The Journey Workspace Navigation Model is designed around business activity rather than application structure.
Navigation should always minimise unnecessary context switching while enabling Workspace Users to remain focused on their current task.
The navigation experience should support the Product Owner's guiding principles of:

- organised working
- calm confidence
- progressive disclosure
- journey-centric operations
- relationship-first thinking

Every navigation decision should reinforce the feeling that the Workspace is a trusted coworker helping the user manage work rather than simply presenting application functionality.

## 5. Navigation Consistency Rules

- The Primary Navigation Rail's grouping (Operational / Knowledge) never changes based on role, module state, or time of day — only badge counts change.
- The Header Bar's structure (title, search, bell, toggle, user menu) is identical on every screen; only the section title and the My/Team toggle's visibility state change.
- A contextual tab bar never removes or replaces the Primary Navigation Rail or Header — a Workspace User can always reach any other module in one click regardless of how deep they are inside a record.
- Every claim/assign/reassign action produces the same visual result (owner shown, item state updated) regardless of which module it occurs in.

## 6. Open Items Carried From Discovery

- Role-based navigation-item visibility (which items or actions are Administrator-only) is marked **Role TBC** pending OQ-001, and applies to: Vendor lifecycle changes, Destination Profile approval, Workspace Configuration, user activation/deactivation, Operational Queue configuration, Master Itinerary promotion (PD-IS-008), Dashboard's Team-filter (FR-DASH-06, itself still Proposed).
- Phase 2 (Journey Workspace) stage-badge granularity in the contextual tab bar's History view reflects the illustrative, not-yet-approved six-stage model (Discovery A-UX-03) until Product Owner confirmation.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS4-001.*
