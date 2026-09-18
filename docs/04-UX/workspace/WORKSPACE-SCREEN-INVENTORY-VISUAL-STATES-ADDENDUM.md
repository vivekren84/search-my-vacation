# Workspace Screen Inventory — Visual States Addendum

| Document Information | |
|---|---|
| Document Name | Workspace Screen Inventory — Visual States Addendum |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie / Tiger / Product Owner review |
| Version | 1.0 (addendum to Workspace Screen Inventory v1.0) |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |
| Base Document | `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` (v1.0, Product Owner Review Comments recorded, unchanged by this addendum) |

---

## 1. Why an Addendum, Not an Edit

`WORKSPACE-SCREEN-INVENTORY.md` v1.0 is an approved baseline carrying its own Product Owner Review Comments (per `EBC-R1.3-WS4-002`'s tracker synchronisation). Per Project Instructions §32 ("do not rewrite history... clearly distinguish current decisions, approved instructions, proposals, history"), this refinement adds a new document rather than editing the approved one. This addendum records the **visual states** now relevant for the screens that have actually been implemented since v1.0 was approved (`EBC-R1.3-WS11-007` through `-011`) — states v1.0 correctly did not attempt to define, since at that time no screen had been built yet ("No visual design, layout or wireframe is produced at this stage," v1.0 §1).

## 2. DASH-01 — Dashboard (My Work)

Now implemented (`web/app/workspace/(dashboard)/page.tsx`). States relevant to this screen, per the visual refinement in this EBC:

| State | Description |
|---|---|
| Default | Welcome section, five KPI cards (all literal `0`), Recent Activity and Upcoming Tasks in their empty state, five Quick Actions | 
| Empty (Recent Activity / Upcoming Tasks) | Per Workspace Empty State Library §3.1–3.2 — this is, at present, the *only* state these two cards can be in, since no data source populates them yet in Release 1.3 |
| Responsive — Desktop (≥1024px) | Full 5-column KPI grid, 2-column card row |
| Responsive — Tablet (~834px) | KPI grid reflows to 2 columns; card row stacks to 1 column |
| Responsive — Phone (<768px) | Navigation rail hidden (documented limitation, not in this screen's own validation scope — see UX Review Notes WS11A-12) |

**DASH-02 — Dashboard (Team)** remains Not Implemented in Release 1.3 (the My Work/Team toggle is Proposed, FR-DASH-06, Role TBC per OQ-001) — no visual state to record.

## 3. New Screens Not Present in v1.0's Inventory (all pre-Dashboard, Workspace-wide)

v1.0's inventory (per its own §1 scope) enumerated only the nine business modules' screens — it did not anticipate the authentication and shell-chrome screens engineering would need. These are recorded here for completeness, since Rad's own implementation reports (`-007` through `-011`) treat them as first-class Workspace screens:

| Screen | Path | States |
|---|---|---|
| Sign In (page) | `web/app/workspace/sign-in/page.tsx` | Default; error (`reason=unauthorized`/`expired` banner); redirect-preserving (`redirectTo` param) |
| Sign In (header modal) | `web/components/auth/SignInModal.tsx` | Sign In view; Reset Password (email entry) view; Check Your Email view; loading (spinner, disabled submit); error banner; already fully refined by `EBC-R1.3-WS11-010` — not touched by this EBC |
| Reset Password | `web/app/workspace/reset-password/page.tsx` | Choose New Password form; mismatched-confirmation validation error; success ("Password updated..."); invalid/expired link |
| Coming Soon (×6: Journey Planning, Journey Workspace, Traveller Hub, Itinerary Studio, Vendor Management, Destination Intelligence) | `web/app/workspace/(dashboard)/{module}/page.tsx` | Default (per Empty State Library §3.3, refined by this EBC); active-nav-item state on the rail while viewing |

## 4. Navigation Rail — States (applies across every screen inside the `(dashboard)` route group)

| State | Trigger | Visual treatment reference |
|---|---|---|
| Default (unselected) | Any nav item not matching the current route | UX Specification §3 |
| Hover | Pointer over an unselected item | UX Specification §3 / UX Review Notes WS11A-10 |
| Active (selected) | `pathname === item.href` | UX Specification §3 / UX Review Notes WS11A-09 |

## 5. Header User Menu — States

| State | Trigger | Notes |
|---|---|---|
| Closed | Default | Avatar, name, role pill, caret |
| Open | Click/tap on the trigger | Dropdown with Profile · Settings · (Administrator only: User Management) · Sign Out — content unchanged by this EBC |
| Closing/transition | New in this EBC (UX Review Notes, Design Language §8) | Brief fade/rise entrance, matching `SignInModal`'s established motion pattern |

## 6. What This Addendum Does Not Do

- It does not renumber, remove, or alter any DASH/JP/JW/TH/IS/DI/VM/NOT/SET screen ID from v1.0.
- It does not define states for any screen not yet implemented (e.g. JP-01 onward remain exactly as v1.0 left them — structural only, no visual states, since no code exists yet for those modules).
- It does not resolve DASH-02's Role TBC/OQ-001 status — that remains open exactly as v1.0 and `EBC-R1.3-WS11-005` both already record it.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*
