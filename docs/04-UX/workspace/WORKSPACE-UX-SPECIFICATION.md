# Workspace UX Specification (Visual Refinement)

| Document Information | |
|---|---|
| Document Name | Workspace UX Specification — Visual Refinement |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie / Tiger / Product Owner review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |
| Predecessor | Workspace Navigation Model v1.0; Workspace Screen Inventory v1.0; `EBC-R1.3-WS11-011-RAD-Workspace-Dashboard-Foundation-Implementation-Report.md` |
| Related | Workspace Design Language v1.0; Workspace Component Inventory v1.0; Workspace Empty State Library v1.0; Workspace UX Review Notes v1.0 |

---

## 1. Purpose and Boundary

This specification describes the **visual refinement** of the Workspace shell already implemented in `EBC-R1.3-WS11-011` (and its predecessors `-007` through `-010`). It is scoped exactly as this EBC instructs: colour, typography, spacing, elevation, motion and copy — never navigation structure, dashboard information architecture, KPI selection, authentication flow, routing, permissions, or RBAC, all of which remain exactly as ratified by Vivek on 17 September 2026 and implemented by Rad. Every item below is a refinement of an existing, named component; nothing here introduces a new screen, module or business capability.

Each area below states the **current, as-shipped behaviour** (verified by direct code inspection, not assumed) and the **refined behaviour**. Engineering classification (Mandatory/Recommended/Optional) and full handover detail for every numbered item live in the companion **Workspace UX Review Notes** document — this specification is the "what," that document is the "how much it matters and how hard it is."

## 2. Header (`WorkspaceHeader.tsx`, `WorkspaceUserMenu.tsx`)

**Structure — unchanged.** Logo | "Workspace" label | search (disabled placeholder) | notification bell (disabled placeholder) | user menu. No item is added, removed or reordered.

| Element | Current | Refined |
|---|---|---|
| Header background/border | White, `#E5E7EB` border | `var(--color-cream)` with a soft translucent backdrop and warm border (Design Language §4.2) — mirrors the header treatment already used across the public site |
| "Workspace" label | Plain gray text | Set in the utility font (already inherited) at reduced-opacity espresso, separated from the logo by a thin warm divider, echoing how the public header separates brand from wordmark |
| Search input (disabled) | Cold gray (`#F9FAFB` background, `#E5E7EB` border, `#9CA3AF` placeholder) | Warm-tinted (amber-at-6%-opacity background, warm border), same disabled/non-functional state — **Search itself remains Out of Scope; only its idle visual treatment changes** |
| Notification bell (disabled) | Cold gray icon button | Warm-tinted icon button, matching the search field's new treatment; optional decorative unread-dot (Review Notes item, Optional) — **the Notifications engine remains entirely Out of Scope** |
| User menu trigger | Avatar (espresso-on-primary-tint circle) + name + role pill + caret | Same information, warmer palette (amber/orange gradient avatar, warm role pill), plus a proper open/close transition (Design Language §8) |
| User menu dropdown items | Profile · Settings · (Administrator: + User Management) · Sign Out | **Unchanged** — content, order, and Administrator-only conditional rendering are exactly as Vivek ratified; only the dropdown surface's colour, radius and entrance motion are refined |

## 3. Primary Navigation Rail (`WorkspaceNav.tsx`)

**Structure — unchanged.** Dashboard, then "Operational" (Journey Planning, Journey Workspace), then "Knowledge" (Traveller Hub, Itinerary Studio, Vendor Management, Destination Intelligence). No item added, removed, renamed or regrouped. Settings and Notifications remain deliberately absent from this rail, exactly as ratified.

| State | Current | Refined |
|---|---|---|
| Default item | Espresso text, no background | Unchanged |
| Hover | Flat Tailwind `gray-100` background | Warm amber-tinted background (Design Language §4), consistent with the header's warm-tinted controls |
| Active item | Flat `#280336` at 10% opacity, no other indicator | Warm gradient background (primary-to-amber wash) **plus** a 3px amber accent bar on the leading edge — the same "which one is current" information, communicated with the brand's own accent colour instead of a flat opacity trick |
| Group headings ("Operational"/"Knowledge") | Muted gray, uppercase, small | Unchanged in behaviour; colour updated to the muted-espresso token (Design Language §4.2) |

**Responsive note (unchanged constraint, documented for clarity):** the rail is hidden below the `md` breakpoint in the current implementation, which `WorkspaceShell.tsx`'s own code comment already discloses as an intentional, EBC-scoped limitation (desktop/tablet only). This specification does not change that behaviour — see Review Notes for a Recommended (not Mandatory) forward-looking note on a future mobile drawer, explicitly deferred to a later EBC.

## 4. Dashboard (`page.tsx`, `WelcomeSection`, `KpiGrid`/`KpiCard`, `RecentActivityCard`, `UpcomingTasksCard`, `QuickActions`)

**Information architecture — unchanged.** Welcome section, five KPI cards (Active Journeys, New Leads, Upcoming Departures, Pending Vendor Confirmations, Tasks Due Today — every value a literal `0`, per Product Ratification), Recent Activity, Upcoming Tasks, Quick Actions (five items: New Lead, Create Journey, Add Traveller, New Vendor, My Work). No card added, removed or reordered; no real data is introduced.

| Element | Current | Refined |
|---|---|---|
| Welcome heading | Serif `<h1>`, gray-scale eyebrow/sub-copy | Eyebrow set in amber (small-caps, letter-spaced), heading unchanged in size/weight, sub-copy in secondary-espresso rather than gray |
| KPI cards | White card, gray label, plain bold value | Warm-bordered card with a small icon chip (Design Language §7) above the label; **value set in the editorial serif** to match the Welcome heading's typographic voice; a very subtle decorative corner accent (Optional — see Review Notes) |
| Recent Activity / Upcoming Tasks cards | White card, plain sans `<h2>`, dashed-gray empty state with generic copy | Card heading in editorial serif (Design Language §5); empty state restyled and re-copied per the **Workspace Empty State Library** — see Section 6 below |
| Quick Actions | Five visually identical outline buttons | One primary (amber-filled) action — "New Lead," reflecting the approved "Inquiry First" design principle from the original UX Discovery — and four secondary (warm-outline) actions; **exact five labels and their order are unchanged** |

## 5. Coming Soon Pages (`ComingSoon.tsx`, six module routes)

**Behaviour — unchanged.** Each of the six not-yet-built modules (Journey Planning, Journey Workspace, Traveller Hub, Itinerary Studio, Vendor Management, Destination Intelligence) renders the shared `ComingSoon` component inside the full Workspace shell when its nav item is selected — exactly as Vivek ratified.

Refinement: restyle via the same shared `EmptyState` treatment (Section 6) and replace the single generic sentence ("`{module}` isn't built yet. We'll let you know as soon as it's ready.") with the module-specific copy in the Empty State Library, so each Coming Soon screen reads as considered rather than templated — while remaining, deliberately, the same structural placeholder.

## 6. Empty States (shared `EmptyState.tsx`)

See the standalone **Workspace Empty State Library** document for the full pattern and every piece of copy. In summary: one shared visual recipe (icon chip + title + description + optional call-to-action), applied to Recent Activity, Upcoming Tasks, and every Coming Soon module, replacing the current dashed-border-box-with-generic-sentence treatment. This directly answers this EBC's own instruction: *"Avoid generic placeholder text. Provide meaningful product guidance."*

## 7. Notifications (entry point only)

Per this EBC's Out of Scope, no notification content, logic, or engine is specified here. The only in-scope item is the header bell's **idle visual state** (Section 2) and, optionally, a purely decorative unread-indicator dot with no data behind it yet (Review Notes, Optional item) — both cosmetic, both already inert in the current implementation and remaining inert after this refinement.

## 8. Search (entry point only)

Per this EBC's Out of Scope, no search functionality is specified. The only in-scope item is the header search field's **idle visual state** (Section 2) — it remains `disabled` with the same `aria-label="Search (coming soon)"`.

## 9. User Menu

Covered in Section 2. No change to menu contents, Administrator-conditional item, or Sign Out behaviour — visual treatment (avatar, role pill, dropdown surface, motion) only.

## 10. Responsive Behaviour

| Breakpoint | Current, verified behaviour | Refined |
|---|---|---|
| Desktop (≥1024px) | Full shell: rail + header + 5-column KPI grid + 2-column Recent Activity/Upcoming Tasks | Same layout; token/colour refinement only |
| Tablet (~834px) | KPI grid reflows to 2 columns; Recent Activity/Upcoming Tasks stack to 1 column (confirmed via Rad's own static mockups, `EBC-R1.3-WS11-011` §7) | Same reflow behaviour; token/colour refinement only. **Recommendation (Recommended, not Mandatory):** the header's search field currently disappears entirely below `sm` — consider collapsing it to an icon-only affordance instead of vanishing, so the "search exists" cue survives at tablet width. See Review Notes. |
| Phone (<768px) | Navigation rail is hidden entirely; explicitly out of this EBC's and the predecessor EBC's validation scope | **Unchanged.** A mobile navigation pattern (e.g. a drawer reusing the exact same nav groups) is documented as a Recommended forward-looking item in the Review Notes for a *future* EBC — not built or specified in detail here, since this EBC's Out of Scope excludes new interaction patterns beyond visual refinement of what exists |

## 11. Alignment with UX Design Principles

Cross-checked against the approved Journey Workspace UX Design Brief and this EBC's own Design Objective ("calm, confidence, premium, organised, trustworthy, operational excellence"):

- **Calm / organised** — preserved: no new density, no new information, only warmer, higher-contrast-with-purpose colour use in place of flat gray-scale.
- **Premium / trustworthy** — directly addressed: the refinement's entire purpose is to close the gap between the Workspace shell and the already-premium public site and auth surfaces.
- **Inquiry First** — reinforced concretely in the Quick Actions hierarchy (Section 4) by giving "New Lead" the single primary visual treatment.
- **Consistency** — reinforced by extending the *same* tokens, radii, shadows and motion already shipped in `SignInModal.module.css` into the Dashboard shell, rather than introducing a third visual language.

## 12. Visual Reference

Static mock-ups illustrating this specification (built from the real token values named above, not the as-shipped gray-scale) are provided alongside this document:

- `docs/04-UX/workspace/mockups/WORKSPACE-DASHBOARD-MOCKUP-DESKTOP.png` (1440px)
- `docs/04-UX/workspace/mockups/WORKSPACE-DASHBOARD-MOCKUP-TABLET.png` (834px)
- `docs/04-UX/workspace/mockups/WORKSPACE-NAVIGATION-MOCKUP.png` (rail close-up, default/hover/active states)
- `docs/04-UX/workspace/mockups/WORKSPACE-EMPTY-STATE-LIBRARY-MOCKUP.png` (four empty-state contexts)
- HTML sources for the above are provided under `docs/04-UX/workspace/mockups/source/` for Rad's direct visual reference (not for reuse as production markup — production implementation should use the repository's actual component structure and Tailwind conventions, not these static demonstration files)

These are disclosed as illustrative static reproductions built outside the live Next.js application (the same disclosed technique Rad's own prior EBCs used for their verification screenshots), not a pixel-perfect design file — final spacing/sizing judgment during implementation remains Rad's, guided by the Design Language document's tokens.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*
