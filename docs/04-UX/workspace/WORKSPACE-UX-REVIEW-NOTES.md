# Workspace UX Review Notes — Engineering Handover

| Document Information | |
|---|---|
| Document Name | Workspace UX Review Notes |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie Architecture Review, Tiger Delivery Review, Vivek Product Acceptance |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |
| Related | Workspace UX Specification v1.0; Workspace Design Language v1.0; Workspace Component Inventory v1.0; Workspace Empty State Library v1.0 |

---

## 1. Purpose and How to Use This Document

This is the single document Rad should work from to implement this EBC. Every recommendation is classified **Mandatory**, **Recommended**, or **Optional**, per this EBC's own instruction, and every recommendation states its rationale, user benefit, engineering impact, and implementation complexity, so Rad can implement without seeking further clarification. Recommendation IDs (`WS11A-01` etc.) are referenced from the Specification, Design Language, Component Inventory and Empty State Library documents where relevant.

**Classification definitions used consistently below:**
- **Mandatory** — required for this EBC to satisfy its own stated Design Objective and Areas Requiring Refinement; skipping it leaves the "generic SaaS" problem unresolved.
- **Recommended** — materially improves the result and is low-to-moderate effort; Rad may defer with a disclosed reason, but should not silently drop.
- **Optional** — a genuine nice-to-have; may be dropped at Rad's or Vivek's discretion with no need to justify.

**Complexity scale:** Trivial (single-file, class/token swap) · Low (one component, no new state) · Medium (new prop/state, still one component) · High (touches multiple components or introduces new interaction behaviour).

## 2. Colour, Token and Typography Foundation

### WS11A-01 — Replace hard-coded Tailwind gray-scale with SMV tokens across the entire Workspace shell
- **Classification:** Mandatory
- **Current state:** `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceUserMenu`, `WorkspaceNav`, `KpiCard`, `RecentActivityCard`, `UpcomingTasksCard`, `QuickActions`, `EmptyState`, `ComingSoon` all use raw hex values (`#F9FAFB`, `#E5E7EB`, `#9CA3AF`, `#4B5563`) that are Tailwind's default neutral palette and do not exist anywhere in `app/globals.css`.
- **Recommended change:** Replace with `var(--color-cream)` (backgrounds), a warm border value (`rgb(154 100 46 / 20%)`, matching `SignInModal.module.css`), and espresso-based text at full/62%/42% opacity for primary/secondary/muted text — see Design Language §4 for the full mapping table.
- **Rationale:** This single change is the direct, evidenced cause of the Product Owner's "generic SaaS administration dashboard" observation (Design Language §3). Every other recommendation in this document is secondary to this one.
- **User benefit:** The Workspace immediately reads as part of the same premium product as the public site and the already-refined Sign-In experience, rather than a disconnected internal tool.
- **Engineering impact:** Pure class/value substitution; zero logic change; zero prop changes; zero risk to RBAC, routing or data.
- **Complexity:** Low — mechanical find-and-replace of colour classes across ~10 files, verifiable by `tsc`/`eslint`/visual diff alone.

### WS11A-02 — Extend the editorial serif heading to Dashboard card headings and KPI values
- **Classification:** Mandatory
- **Current state:** Only `WelcomeSection`'s `<h1>` uses `font-serif`/`var(--font-editorial)`; every other heading and the KPI values use the default sans body font.
- **Recommended change:** Apply serif to "Recent Activity", "Upcoming Tasks", "Quick Actions" card headings and to each KPI's numeric value (not its label).
- **Rationale:** One isolated serif heading on an otherwise all-sans screen reads as an accident, not a system; extending it consistently is what makes it read as intentional brand voice (Design Language §5).
- **User benefit:** Visual coherence across a single screen — the Dashboard should feel like one considered surface, not a heading style applied once and forgotten.
- **Engineering impact:** None beyond adding a class already defined and used elsewhere in this same file tree.
- **Complexity:** Trivial.

### WS11A-03 — Warm elevation (border + shadow) on every card
- **Classification:** Recommended
- **Current state:** `rounded-2xl` (a Tailwind default radius, not a token) + a hand-typed shadow value that happens to already equal `--shadow-sm`.
- **Recommended change:** `var(--radius-xl)` + `var(--shadow-sm)`, with `var(--shadow-md)` on hover for interactive cards (Quick Action buttons only — KPI/Recent Activity/Upcoming Tasks cards are not interactive and should not gain a hover elevation that implies clickability they don't have).
- **Rationale:** Token-driven values propagate automatically if the palette evolves later; hand-typed literals silently drift.
- **User benefit:** Indirect (consistency, maintainability) rather than directly visible.
- **Engineering impact:** None — the visual result at Radius/shadow values chosen is nearly identical to today's; this is a code-quality improvement more than a visual one.
- **Complexity:** Trivial.

### WS11A-04 — Subtle radial warm-tint wash behind Dashboard content
- **Classification:** Recommended
- **Current state:** Flat `#F9FAFB` background, no depth.
- **Recommended change:** A very low-opacity radial gradient (amber at ~5–7% opacity, large radius) behind the main content area, matching the restrained treatment already used on the public site's `.golden-inspiration-surface` utility class (reused, not reinvented) and visible in the Dashboard mock-up.
- **Rationale:** Lifts the "flat gray" feel without adding visual noise or reducing KPI legibility — restraint is itself one of the approved Design Principles ("calm," "organised").
- **User benefit:** Subconscious warmth/premium-ness; the screen feels considered rather than default.
- **Engineering impact:** A single background-image CSS rule on the main content container; no interaction with any component's logic.
- **Complexity:** Trivial.

### WS11A-05 — Icon chips inside KPI cards
- **Classification:** Optional
- **Current state:** No icon; label + value only.
- **Recommended change:** A small (2–2.1rem) rounded icon chip above the label, using the existing inline-SVG convention (Design Language §7) — one glyph per KPI, purely decorative/illustrative (no new meaning conveyed).
- **Rationale:** Aids quick visual scanning across five cards; a common, low-risk premium-dashboard pattern.
- **User benefit:** Marginal — faster visual parsing, not information gain (the label already fully identifies each KPI).
- **Engineering impact:** Five small inline SVGs (or one shared icon-chip component parameterised by glyph) — no data dependency, no new library.
- **Complexity:** Low.

## 3. Header

### WS11A-06 — Warm-tint the disabled Search field and Notification button
- **Classification:** Recommended
- **Current state:** Both use cold Tailwind gray (`#F9FAFB` background, `#E5E7EB` border, `#9CA3AF` icon/placeholder colour).
- **Recommended change:** Amber-at-6%-opacity background, warm border, espresso-toned icon — both remain fully `disabled`, `aria-label`s unchanged.
- **Rationale:** These two controls are the most visually prominent "cold gray" elements in the header after WS11A-01's broader pass; calling them out separately ensures they aren't missed since they're `disabled` (easy to deprioritise visually during implementation).
- **User benefit:** The header reads as "not yet available" rather than "broken/unstyled."
- **Engineering impact:** None — purely presentational; the `disabled` attribute and both ARIA labels are explicitly preserved.
- **Complexity:** Trivial.

### WS11A-07 — Decorative unread-indicator dot on the notification bell
- **Classification:** Optional
- **Current state:** Plain bell icon, no indicator.
- **Recommended change:** A small static amber dot in the corner of the bell icon, purely decorative — **not wired to any data**, since the Notifications engine is Out of Scope for this card.
- **Rationale:** Sets a visual expectation for the future feature without building it; explicitly disclosed as non-functional so it is never mistaken for a real unread count.
- **User benefit:** None today (it is decorative); avoids a future jarring visual change when Notifications ships.
- **Engineering impact:** A single `<span>`; must not read `aria-live` or imply real state — recommend an explicit code comment (matching this repository's own convention, e.g. the comments already in `NotificationAreaPlaceholder.tsx`) stating it is decorative-only until a future Notifications EBC gives it real data.
- **Complexity:** Trivial. **If Rad judges this could be misread as a real notification, it should be dropped — this is genuinely Optional, not a soft Mandatory.**

### WS11A-08 — Preserve header structure exactly
- **Classification:** Mandatory (a constraint, not a change)
- **Current state / Recommended change:** No change — logo, "Workspace" label, search, bell, user menu stay in their current order and composition.
- **Rationale:** Explicit Mandatory Product Ratification in this EBC's own text.
- **User benefit:** N/A (constraint).
- **Engineering impact:** None (nothing to build).
- **Complexity:** N/A.

## 4. Navigation

### WS11A-09 — Warm gradient + accent bar for the active nav item
- **Classification:** Mandatory
- **Current state:** Flat `#280336` at 10% opacity, no other visual marker.
- **Recommended change:** A subtle primary-to-amber gradient background plus a 3px amber bar on the item's leading edge (see `WORKSPACE-NAVIGATION-MOCKUP.png`).
- **Rationale:** A flat 10%-opacity tint is the single existing brand touch in the whole nav, but on its own reads as an accident rather than a deliberate active-state design; pairing it with the amber accent (already the Workspace's chosen "attention/currency" colour per Design Language §4.3) makes it legible as a designed state.
- **User benefit:** Clearer, more confident "you are here" signal.
- **Engineering impact:** CSS-only change to the existing conditional class in `WorkspaceNav.tsx` (`isActive ? ... : ...`); the `isActive` logic itself (`pathname === item.href`) is untouched.
- **Complexity:** Trivial.

### WS11A-10 — Warm hover state distinct from active state
- **Classification:** Recommended
- **Current state:** Hover uses Tailwind `gray-100` (`#F3F4F6`), unrelated to the brand palette and easily confused at a glance with a lighter version of "active."
- **Recommended change:** Amber-at-7%-opacity hover background, clearly lighter/different in hue from the active state's gradient (WS11A-09).
- **Rationale:** Hover and active must remain visually distinguishable; today's flat-gray hover already achieves this by accident, but only because it happens to differ from the equally-flat active tint — both should instead differ *intentionally* along the brand palette.
- **User benefit:** Reduces momentary ambiguity about which item is currently selected versus merely under the cursor.
- **Engineering impact:** CSS-only.
- **Complexity:** Trivial.

### WS11A-11 — Reserve (do not yet fill) an icon slot per nav item
- **Classification:** Optional
- **Current state:** Text-only nav items.
- **Recommended change:** Leave a small leading-icon slot in the markup (as shown in the mock-up's placeholder squares) so a future icon set can be dropped in without restructuring the component, but do **not** add an icon library as part of this card.
- **Rationale:** Architecture Discovery already notes no icon library exists in this repository; adding one is a dependency decision reserved for Archie (Project Instructions §21), not this UX card.
- **User benefit:** None today; reduces future engineering churn if icons are adopted later.
- **Engineering impact:** A reserved, currently-empty `<span>` per nav item — no visual change if left empty, no dependency added.
- **Complexity:** Trivial. **Rad may skip this entirely with no disclosure needed — it is a pure convenience for a hypothetical future change.**

### WS11A-12 — Document (do not build) a future mobile navigation pattern
- **Classification:** Recommended, scoped to *documentation only* — explicitly **not** implementation under this card
- **Current state:** The nav rail is hidden entirely below `md` (768px); `WorkspaceShell.tsx`'s own code comment already discloses this as an accepted, EBC-scoped gap, not a defect.
- **Recommended change:** No code change under this card. Recommend a future EBC introduce a slide-in drawer, triggered by a header hamburger control, reusing the *exact same* `WORKSPACE_NAV_GROUPS` data and item list already defined in `WorkspaceNav.tsx` — i.e., a presentation change, not a new navigation model.
- **Rationale:** This EBC's Out of Scope explicitly excludes new interaction patterns and mobile-specific work; raising it here (rather than silently doing nothing) satisfies this EBC's own instruction that "any ambiguity shall be escalated... rather than resolved by assumption" and its explicit request that recommendations flag good-but-out-of-scope opportunities.
- **User benefit:** N/A for this release; sets up a lower-friction future implementation.
- **Engineering impact:** None for this card.
- **Complexity:** N/A for this card (future: Medium, since it reuses existing nav data but adds new open/close interaction state).

## 5. Dashboard

### WS11A-13 — Preserve KPI selection, labels and literal-zero values exactly
- **Classification:** Mandatory (a constraint, not a change)
- **Rationale:** Explicit Mandatory Product Ratification (five named KPIs, values must remain literal `0` — Product Ratification #3, "display 0 rather than fabricated sample data").
- **Engineering impact / Complexity:** N/A — nothing to build; applies WS11A-01/02/05 styling only to the existing five cards.

### WS11A-14 — Replace generic empty-state copy on Recent Activity and Upcoming Tasks
- **Classification:** Mandatory
- **Current state:** "No recent activity yet." / "No pending tasks."
- **Recommended change:** See Workspace Empty State Library §3.1–3.2 for exact copy and icon.
- **Rationale:** This EBC's own text explicitly instructs: "Avoid generic placeholder text. Provide meaningful product guidance." The current copy is the textbook example of what it asks to avoid.
- **User benefit:** Sets correct expectations (what *will* appear, and why) instead of a bare negative statement.
- **Engineering impact:** Copy/prop change only — passes `title`, `description`, and the new optional `icon` prop (Component Inventory §3) into the existing `EmptyState` component.
- **Complexity:** Trivial.

### WS11A-15 — Visual hierarchy in Quick Actions (one primary, four secondary)
- **Classification:** Recommended
- **Current state:** Five visually identical outline buttons.
- **Recommended change:** "New Lead" rendered as the amber-filled primary action; the remaining four as warm-outline secondary actions. Labels, order, and count of five actions are unchanged.
- **Rationale:** Directly reflects the approved "Inquiry First" principle from the original UX Discovery — a new Inquiry is the Workspace's single most common and most important entry action, and the Dashboard should visually say so.
- **User benefit:** Faster recognition of the most likely next action, without removing any existing option.
- **Engineering impact:** A conditional class on the first item of the existing `WORKSPACE_QUICK_ACTIONS` map — no data structure change.
- **Complexity:** Trivial.

### WS11A-16 — Decorative corner accent on KPI cards
- **Classification:** Optional
- **Current state:** Flat card, no decorative element.
- **Recommended change:** A very subtle rounded corner-blob accent (visible faintly in the mock-up), purely decorative.
- **Rationale:** Minor visual richness; easily dropped if it reads as noise once implemented at real size.
- **User benefit:** Marginal aesthetic only.
- **Engineering impact:** A single pseudo-element or background shape.
- **Complexity:** Trivial. **Genuinely optional — drop without disclosure if it doesn't look right in practice.**

## 6. Empty States (Cross-Cutting)

### WS11A-17 — One shared empty-state pattern (icon + title + description + optional action)
- **Classification:** Mandatory
- **Current state:** Dashed-border box with title + optional description only; no icon, no action slot.
- **Recommended change:** Extend `EmptyState.tsx` with two optional, backward-compatible props (`icon`, `action`) per Component Inventory §3; apply the shared visual recipe from the Empty State Library.
- **Rationale:** A single, consistent empty-state language across Dashboard and Coming Soon is what makes "nothing here yet" feel designed rather than default across the whole product, not just on one card.
- **User benefit:** Predictability — a Workspace User learns the pattern once.
- **Engineering impact:** One component gains two optional props; all four existing call sites (`RecentActivityCard`, `UpcomingTasksCard`, `ComingSoon` ×6 routes) either pass the new props or continue to omit them safely.
- **Complexity:** Low.

### WS11A-18 — Replace ComingSoon's generic sentence with the library copy + a "Back to Dashboard" action
- **Classification:** Mandatory
- **Rationale/User benefit/Engineering impact:** As WS11A-14, applied to the six Coming Soon routes; see Empty State Library §3.3.
- **Complexity:** Trivial.

## 7. Responsive Behaviour

### WS11A-19 — Preserve existing breakpoint behaviour exactly
- **Classification:** Mandatory (a constraint, not a change)
- **Rationale:** This EBC asks for visual refinement "at" existing breakpoints, not new responsive behaviour; the 5→2 column KPI reflow and 2→1 column card stacking (verified in `EBC-R1.3-WS11-011` §7) must survive this refinement unchanged.
- **Engineering impact / Complexity:** N/A — verify after applying WS11A-01 through -18 that the same Tailwind breakpoint classes (`sm:grid-cols-2 lg:grid-cols-5`, `lg:grid-cols-2`) are still present; token/colour changes should not touch these classes at all.

### WS11A-20 — Collapse (rather than hide) the header search field at tablet width
- **Classification:** Recommended
- **Current state:** The search field is wrapped in `hidden sm:flex` — it disappears entirely below the `sm` breakpoint, with no substitute affordance.
- **Recommended change:** Below that breakpoint, show a search **icon button** (matching the existing disabled-bell-button pattern already in the same header) instead of nothing, so the "search exists, coming soon" cue survives at narrower widths. It remains `disabled`, identical in spirit to today's field.
- **Rationale:** A control that simply vanishes at narrower widths reads as an oversight; a consistently-present (even if disabled) icon reads as intentional responsive design.
- **User benefit:** Consistent expectation-setting across breakpoints.
- **Engineering impact:** A small conditional render, reusing the icon-button pattern already established for the notification bell in the same file — no new component.
- **Complexity:** Low.

## 8. Summary Table

| ID | Area | Classification | Complexity |
|---|---|---|---|
| WS11A-01 | Colour tokens, shell-wide | Mandatory | Low |
| WS11A-02 | Serif typography extension | Mandatory | Trivial |
| WS11A-03 | Card elevation tokens | Recommended | Trivial |
| WS11A-04 | Dashboard background wash | Recommended | Trivial |
| WS11A-05 | KPI icon chips | Optional | Low |
| WS11A-06 | Header search/bell warm-tint | Recommended | Trivial |
| WS11A-07 | Decorative unread dot | Optional | Trivial |
| WS11A-08 | Header structure preserved | Mandatory (constraint) | N/A |
| WS11A-09 | Nav active-state accent | Mandatory | Trivial |
| WS11A-10 | Nav hover-state | Recommended | Trivial |
| WS11A-11 | Nav icon slot (reserved, empty) | Optional | Trivial |
| WS11A-12 | Mobile nav — documented only | Recommended (doc only) | N/A this card |
| WS11A-13 | KPI content preserved | Mandatory (constraint) | N/A |
| WS11A-14 | Empty-state copy (Dashboard) | Mandatory | Trivial |
| WS11A-15 | Quick Actions hierarchy | Recommended | Trivial |
| WS11A-16 | KPI decorative accent | Optional | Trivial |
| WS11A-17 | Shared empty-state pattern | Mandatory | Low |
| WS11A-18 | Coming Soon copy + action | Mandatory | Trivial |
| WS11A-19 | Breakpoints preserved | Mandatory (constraint) | N/A |
| WS11A-20 | Header search tablet collapse | Recommended | Low |

Nine Mandatory items (three of which are explicit "preserve exactly" constraints requiring no new code), seven Recommended, four Optional. No item touches navigation structure, dashboard information architecture, authentication, routing, permissions, RBAC, or the database — consistent with this EBC's Mandatory Product Ratifications and Out of Scope sections.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*
