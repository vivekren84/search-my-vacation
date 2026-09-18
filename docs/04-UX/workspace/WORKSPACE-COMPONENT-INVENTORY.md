# Workspace Component Inventory

| Document Information | |
|---|---|
| Document Name | Workspace Component Inventory |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie / Tiger / Product Owner review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |

---

## 1. Purpose

This inventory lists every implemented Workspace UI component (as of `EBC-R1.3-WS11-007` through `-011`, verified by direct repository inspection) and states, per component, whether this refinement touches it, and how. It is the file-level companion to the Workspace UX Specification — that document describes screens and areas; this one is a checklist Rad can work through file by file.

No file listed below changes its props, behaviour, or position in the component tree as a result of this refinement, unless explicitly noted (the two additive, backward-compatible prop additions in Section 3 are the only exceptions, and both are optional props with safe defaults).

## 2. Inventory

| Component | Path | Touched by this refinement? | Nature of change |
|---|---|---|---|
| `WorkspaceShell` | `web/components/workspace/layout/WorkspaceShell.tsx` | Yes | Background token swap only (`#F9FAFB` → `var(--color-cream)`); no structural change |
| `WorkspaceHeader` | `web/components/workspace/layout/WorkspaceHeader.tsx` | Yes | Colour/border tokens on the header bar, search field and notification button (Section 2 of the UX Specification) |
| `WorkspaceUserMenu` | `web/components/workspace/layout/WorkspaceUserMenu.tsx` | Yes | Avatar/role-pill palette, dropdown surface styling, open/close motion — menu items, hrefs, and the Administrator conditional are untouched |
| `WorkspaceNav` | `web/components/workspace/navigation/WorkspaceNav.tsx` | Yes | Hover/active state palette (Section 3 of the UX Specification) — the `WORKSPACE_NAV_GROUPS` data structure, its items, and their order are untouched |
| `KpiCard` | `web/components/workspace/dashboard/KpiCard.tsx` | Yes | Card border/shadow tokens, icon chip added, value set in editorial serif |
| `KpiGrid` | `web/components/workspace/dashboard/KpiGrid.tsx` | No (pass-through only) | The `WORKSPACE_DASHBOARD_KPIS` data (labels, literal-`0` values, grid breakpoints) is unchanged; only its child `KpiCard` changes |
| `WelcomeSection` | `web/components/workspace/dashboard/WelcomeSection.tsx` | Yes (minor) | Eyebrow colour (amber), sub-copy colour token; greeting logic (`greetingForHour`) untouched |
| `RecentActivityCard` | `web/components/workspace/dashboard/RecentActivityCard.tsx` | Yes | Card heading typography (serif); passes new copy/icon props to `EmptyState` (Section 3.1, Empty State Library) |
| `UpcomingTasksCard` | `web/components/workspace/dashboard/UpcomingTasksCard.tsx` | Yes | Same pattern as `RecentActivityCard`, per Empty State Library §3.2 |
| `QuickActions` | `web/components/workspace/dashboard/QuickActions.tsx` | Yes | Visual hierarchy — one primary (amber) + four secondary buttons; the `WORKSPACE_QUICK_ACTIONS` label list and order are unchanged |
| `EmptyState` | `web/components/workspace/shared/EmptyState.tsx` | Yes | Two new **optional** props (`icon?: ReactNode`, `action?: { label: string; href: string }`), both backward-compatible — existing callers that don't pass them render exactly as before; visual re-skin per Empty State Library §2 |
| `ComingSoon` | `web/components/workspace/shared/ComingSoon.tsx` | Yes | Copy per Empty State Library §3.3; adds a "Back to Dashboard" action using `EmptyState`'s new optional `action` prop; the `moduleName` prop and its six call sites are unchanged |
| `NotificationAreaPlaceholder` | `web/components/workspace/shared/NotificationAreaPlaceholder.tsx` | No | Remains a hidden, empty region exactly as `EBC-R1.3-WS11-011` specified — Notifications content is Out of Scope for this card too |
| `AuthEntry` | `web/components/auth/AuthEntry.tsx` | No | Public-site header component, out of this EBC's Workspace-only scope; already uses the refined token language this document asks the Workspace shell to adopt |
| `SignInModal` / `SignInModal.module.css` | `web/components/auth/SignInModal.tsx` / `.module.css` | No | Already fully refined by `EBC-R1.3-WS11-010` — this is the pattern being *extended*, not itself a subject of change |

## 3. Additive API Changes (for Rad's awareness — not a design decision, a note on scope of code touched)

Only one component's public interface changes, and only by addition:

```
// EmptyState.tsx — before
type EmptyStateProps = { title: string; description?: string; className?: string };

// EmptyState.tsx — after (additive, backward-compatible)
type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;               // new, optional
  action?: { label: string; href: string }; // new, optional
};
```

Every other component listed above changes only its internal JSX/class names — no prop, export, or call-site signature changes.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*
