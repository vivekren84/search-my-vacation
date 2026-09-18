# EBC-R1.3-WS11-011D — Workspace UX Refinement Implementation Report

| Document Information | |
|---|---|
| Document Name | Workspace UX Refinement — Implementation Report |
| Persona | Rad — Engineering and Implementation Specialist |
| Status | Complete — for Archie review, Tiger delivery review, Vivek product approval |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011D |
| Date | 17 September 2026 |
| Inputs | `docs/04-UX/workspace/*` (Sophie, v1.0), `docs/09-Development/EBC-R1.3-WS11-011B-ARCHIE-Workspace-UX-Architecture-Review-Engineering-Readiness.md`, `docs/30-Governance/PRR-R1.3-WS11-001-Workspace-UX-Ratification.md` (Vivek, approved 17 Sep 2026) |

---

## 0. Addendum — Product Owner Corrections (17 September 2026)

Following the Product Owner walkthrough of this EBC, three corrections were requested and are addressed below; the remainder of this report is unchanged from the original submission.

**1. User Menu Layering (Mandatory) — Fixed.** Root cause: `WorkspaceHeader.tsx`'s `backdrop-blur-sm` (`backdrop-filter`) creates a new CSS stacking context on the `<header>` element even though it stays `position: static`. Because the header carried no explicit `z-index`, that stacking context painted at "stack level 0" alongside every other `position: relative` descendant in the page that also has `z-index: auto` — including `KpiCard.tsx`'s outer `relative` wrapper (used for its decorative corner accent). Painting order among same-level participants follows DOM order, and the Dashboard's KPI cards sit later in the DOM than the header, so they painted over the top of the header's contents, including the open `WorkspaceUserMenu` dropdown nested inside it. This is a layering defect exactly as diagnosed — not a UX change.

Fix applied:
- `web/components/workspace/layout/WorkspaceHeader.tsx` — `<header>` now carries `relative z-30` (previously no position/z-index), lifting the header's entire stacking context to an explicit positive z-index so it always paints above the z-index:auto Workspace content that follows it.
- `web/components/workspace/layout/WorkspaceUserMenu.tsx` — the dropdown itself now carries an explicit `z-40` (higher than the header's `z-30`), so it also sits above the header bar's own other controls and is defended against any future z-index added elsewhere in the header.
- Resulting scale, matching the Product Owner's expected order exactly: Workspace content (z-index:auto) < Workspace Header (`z-30`) < User Menu Dropdown (`z-40`) < any future Modal Overlay (reserved at `z-50+`, not yet needed by any current screen).
- No `overflow: hidden` container was found on any ancestor of the header, dropdown, or dashboard cards, so none needed adjustment. No other component in this EBC's scope carries an explicit `z-index`, so no other conflict exists.
- Verified via `npx tsc --noEmit` and `npx eslint` (both clean, Section 3) and via a faithful static reproduction of the exact bug (the same `position: relative` + `backdrop-filter` + DOM-order structure, confirmed with `document.elementFromPoint` before and after the fix) — delivered as `EBC-WS11-011D-user-menu-layering-fix.png` alongside this report.

**2. `web/app/workspace/page.tsx` — Clarification.** This file does not appear in this EBC's (WS11-011D's) own change set — it was removed under the earlier `EBC-R1.3-WS11-011` (Workspace Dashboard Foundation), and its deletion is only visible in the working tree's cumulative `git diff --stat` because these EBCs remain uncommitted together, per this project's standing convention. The file itself carried its own header comment stating exactly this intent: *"Temporary foundation-verification placeholder — not an approved screen... Replaced by the approved Dashboard... in a later Engineering Phase"* (from `EBC-R1.3-WS11-007`). Its 35 lines of inline placeholder markup (a bare `<main>` with hard-coded Tailwind gray classes) have been replaced by the route-group page at `web/app/workspace/(dashboard)/page.tsx`, which composes the reusable shared Workspace components (`WorkspaceShell`, `WorkspaceHeader`, `KpiGrid`, `RecentActivityCard`, etc.) that this EBC refines. This is an architectural simplification — replacing a one-off inline placeholder with the shared, reusable component structure — not a removal of Product functionality; the authentication, RBAC and sign-out behaviour that file exercised are preserved, now inside the shared components.

**3. Production Build — Wording Retained.** Per the Product Owner's direction: the implementation has already been validated through a successful local production build performed by the Product Owner. This remote execution environment's inability to independently reproduce that result is a limitation of its own network egress (no route to `fonts.googleapis.com` for the pre-existing, untouched `next/font/google` imports in `app/layout.tsx`) — not a defect in this EBC's implementation. The implementation itself is not considered blocked by Google Fonts. Section 4 below is retained as originally written for the technical record, read together with this note.

---

## 1. Summary

This EBC is an implementation card only, per its own instruction: *"No Product, UX or Architecture decisions remain open."* All required source documents (the Mandatory Repository Review list) were read in full before any code was touched. No ambiguity was encountered that required an Engineering Blocking Card — the UX Specification, Empty State Library, Component Inventory and Archie's Architecture Review together were sufficient to implement every Mandatory and applicable Recommended item without inventing any Product, UX or Architecture decision.

Scope delivered: visual-only refinement of the Workspace shell (Header, User Menu, Navigation rail, Dashboard, Empty States, Coming Soon), consuming semantic design tokens throughout in place of hard-coded Tailwind gray values, including the Mandatory new `--color-border-warm` / `--color-border-warm-strong` tokens. Navigation structure, Dashboard information architecture, KPI selection, authentication flow, RBAC and routing are all unchanged, verified by diff.

## 2. Files Changed

| File | Change |
|---|---|
| `web/app/globals.css` | Added `--color-border-warm` and `--color-border-warm-strong` tokens (Mandatory, Archie §6.2). No other line touched — see diff in Section 5. |
| `web/components/workspace/layout/WorkspaceShell.tsx` | Background token swap (`#F9FAFB` → `var(--color-cream)`), warm border on the shell, subtle radial accent on `<main>`. Structure unchanged. |
| `web/components/workspace/layout/WorkspaceHeader.tsx` | Warm border/background tokens on header bar, search field and notification button; added disabled mobile icon-only search affordance (WS11A-20) and a decorative (non-functional) unread dot on the notification icon (WS11A-07). Both pre-existing `disabled` attributes and `aria-label`s preserved exactly. **Addendum:** `<header>` now carries `relative z-30` (Product Owner Correction 1, Section 0). |
| `web/components/workspace/layout/WorkspaceUserMenu.tsx` | Amber/orange gradient avatar, warm role pill, warm dropdown surface, entrance motion via the existing `.journey-passport-reveal` utility (no new CSS). Menu items, Administrator-only conditional, and `handleSignOut` unchanged. **Addendum:** dropdown now carries `z-40` (Product Owner Correction 1, Section 0). |
| `web/components/workspace/navigation/WorkspaceNav.tsx` | Warm hover/active palette plus a 3px amber active-item accent bar. `WORKSPACE_NAV_GROUPS` data and `isActive` logic unchanged. |
| `web/components/workspace/dashboard/KpiCard.tsx` | New optional `icon?: ReactNode` prop (additive, backward-compatible); warm border/shadow tokens; value set in editorial serif. |
| `web/components/workspace/dashboard/KpiGrid.tsx` | Added five small inline-SVG icons, one per KPI, passed via the new `icon` prop. `WORKSPACE_DASHBOARD_KPIS` labels, order and literal `0` values unchanged. |
| `web/components/workspace/dashboard/WelcomeSection.tsx` | Amber eyebrow, espresso sub-copy token. `greetingForHour` logic unchanged. |
| `web/components/workspace/dashboard/RecentActivityCard.tsx` | Serif heading; passes Empty State Library §3.1 copy/icon to `EmptyState`. |
| `web/components/workspace/dashboard/UpcomingTasksCard.tsx` | Same pattern, Empty State Library §3.2 copy. |
| `web/components/workspace/dashboard/QuickActions.tsx` | "New Lead" rendered as the single primary (amber) action per the approved Inquiry First principle; remaining four as warm-outline secondary actions. `WORKSPACE_QUICK_ACTIONS` labels/order unchanged. |
| `web/components/workspace/shared/EmptyState.tsx` | Two new optional props, `icon?: ReactNode` and `action?: { label: string; href: string }` — additive, backward-compatible per Archie §5.1. Visual re-skin per Empty State Library §2. |
| `web/components/workspace/shared/ComingSoon.tsx` | Empty State Library §3.3 copy; adds a "Back to Dashboard" action via `EmptyState`'s new `action` prop. `moduleName` prop and its six call sites unchanged. |

**Not touched:** `NotificationAreaPlaceholder.tsx` (Notifications engine remains Out of Scope), all authentication components (`SignInModal`, sign-in/reset-password pages — already refined by `EBC-R1.3-WS11-010`), all RBAC (`isWorkspaceAdministrator` and its call sites), all routing, all business logic, all data models.

No new files, folders, renames or moves — per this EBC's Repository Governance constraint.

## 3. Engineering Checks

| Check | Result |
|---|---|
| `npx eslint .` | **Pass.** 0 errors, 0 warnings introduced. 4 pre-existing warnings remain in unrelated files (`lib/geo-validation/bootstrapRepository.ts`, `scripts/bootstrap-workbook/writeWorkbook.ts`) — identical to every prior Workspace EBC's own disclosed baseline, not touched by this card. |
| `npx tsc --noEmit` | **Pass.** Exit 0, no output. |
| `npm run build` | **Blocked by a pre-existing, environment-only limitation unrelated to this EBC.** See Section 4. |

## 4. Build Validation — Status and Disclosure

`npm run build` was initially blocked by an `EPERM: operation not permitted, unlink '.next/build/...'` error. Root cause: this session's local-device shell cannot delete files inside the connected repository folder without the user granting permission (a stale `.next` cache from a prior session's aborted build). I requested and received that permission (`device_request_delete_permission`), cleared `.next`, and re-ran the build.

With that resolved, the build now proceeds all the way through compilation of every route and fails only on:

```
next/font: error: Failed to fetch `Inter` from Google Fonts.
next/font: error: Failed to fetch `Poppins` from Google Fonts.
```

This is a network-egress limitation of this environment (no route to `fonts.googleapis.com`), triggered by `app/layout.tsx`'s existing `next/font/google` imports — a file this EBC does not touch and a limitation every prior Workspace EBC building in this same environment has independently hit and disclosed. It is not caused by, or related to, any change in this EBC's scope: the failure occurs identically on the unmodified `app/layout.tsx` and is upstream of every component this card changed. I have not weakened, disabled or worked around this check — it is reported exactly as it occurred.

**Residual risk:** low. The change set here is limited to Tailwind class names and two new CSS custom properties consumed via `var()` — none of it can affect Turbopack's ability to resolve `next/font`. Rad recommends this build be re-run in an environment with access to Google Fonts (e.g. CI/Vercel) before Vivek's release decision, consistent with how prior Workspace EBCs' build validation was ultimately confirmed.

## 5. `globals.css` Diff (Mandatory Architecture Decision, Archie §6.2)

```diff
   --color-espresso: #2A211C;
   --color-cream: #FFFDFC;
 
+  /* EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation.
+     Mandatory addition per EBC-R1.3-WS11-011B (Architecture Review) §6.2:
+     semantic border tokens so Workspace components (and any future
+     consumer) reference one source of truth instead of re-typing this
+     literal warm-brown rgb() value, as SignInModal.module.css currently
+     does in three separate places. Values match that already-shipped
+     component's own border colour exactly (rgb(154 100 46 / 24%) /
+     rgb(154 100 46 / 30%)) — no new colour is introduced. */
+  --color-border-warm: rgb(154 100 46 / 24%);
+  --color-border-warm-strong: rgb(154 100 46 / 30%);
+
   /* ----------------------------------------------------------
      Neutral Colors
      ---------------------------------------------------------- */
```

No other line in `globals.css` was touched by this EBC.

## 6. Acceptance Criteria Mapping

| Requirement (EBC §6–§11) | Status |
|---|---|
| Consume semantic tokens; no literal visual values where a token exists | Met — all touched components use `var(--color-*)`/`var(--radius-*)`/`var(--shadow-*)` or the two new border tokens |
| Introduce `--color-border-warm` / `--color-border-warm-strong` | Met — Section 5 |
| No charts, analytics or live data on the Dashboard | Met — no data source was added; all KPI values remain the literal `0` |
| Reuse shared `EmptyState`; no duplicate empty-state implementations | Met — `RecentActivityCard`, `UpcomingTasksCard` and `ComingSoon` all route through the same `EmptyState` component, extended additively |
| Extend existing components; avoid duplication; preserve backward compatibility | Met — `EmptyState` and `KpiCard` gained only optional props; every existing call site compiles and renders unchanged where it doesn't pass the new props |
| No new repository folders, renames, moves, or architectural layers | Met — no filesystem structure changes |
| No Journey Planning/Workspace/Traveller Hub/Vendor Management/Destination Intelligence/User Management functionality changes | Met — none of those modules' logic was touched |
| No Search, Notification engine, database, RBAC or routing changes | Met — verified by diff; `isWorkspaceAdministrator` and all `lib/workspace/shared/rbac/*` files are untouched by this EBC (any changes visible in the wider working tree predate this card, from earlier WS11 EBCs) |
| `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass | Lint and type-check pass clean; build passes through this EBC's own scope and is blocked only by the pre-existing, disclosed Google Fonts network limitation (Section 4) |

## 7. Manual/Visual Validation

Live-browser validation against a running dev server was attempted but is not possible in this environment: the connected-device shell's own `localhost` is not reachable from itself (a disclosed constraint of this session's remote-device bridge), so `next dev` starts successfully but cannot be curled or opened from either this shell or the cloud workspace.

In its place, and consistent with the static-mockup technique already disclosed and accepted for this EBC's own UX package (`EBC-R1.3-WS11-011A`), Rad reconstructed the Dashboard shell's **actual before/after markup and token values** (not Sophie's separate design mock-up) as two static HTML documents and rendered them with Playwright, to give Archie/Tiger/Vivek a direct visual comparison of exactly what changed:

- `EBC-WS11-011D-before-dashboard.png` — the as-shipped gray-scale treatment (flat `#E5E7EB` borders, `#9CA3AF`/`#4B5563` text, no icons, five identical outline Quick Action buttons), reconstructed from the original component source read at the start of this task.
- `EBC-WS11-011D-after-dashboard.png` — the refined treatment, reconstructed from the actual implemented component source and token values in Section 2/5 above (warm borders, amber/orange gradient avatar, serif KPI values and card headings, icon chips, restyled empty states, one primary + four secondary Quick Actions).

These are disclosed as static reproductions of the real markup/CSS, not live application screenshots or a pixel-perfect render (fonts fall back to system serif/sans since the editorial/body webfonts aren't loaded outside the Next.js app) — the same disclosure standard used throughout this project for environment-constrained visual evidence.

Code-level checks performed in place of live-browser QA:
- Confirmed via `tsc`/`eslint` that every new/changed JSX compiles and lints against the existing prop contracts.
- Confirmed via `grep`/direct reading that `WORKSPACE_NAV_GROUPS`, `WORKSPACE_DASHBOARD_KPIS`, `WORKSPACE_QUICK_ACTIONS`, `isActive`, `greetingForHour`, `isWorkspaceAdministrator` and `handleSignOut` are byte-for-byte unchanged in logic (only surrounding JSX/className changed).
- Confirmed the `EmptyState` and `KpiCard` prop-type extensions are optional (`?:`), so no existing caller needed updating and none was missed.

**Recommendation to Keerthi:** functional/regression validation (Administrator and Workspace User sign-in, Sign Out, Password Reset, navigation, responsive breakpoints, no console/hydration errors) should still be run against a live deployment (e.g. a Vercel preview), since this environment cannot host one. Rad's own change set touches no logic paths Keerthi would need to re-test beyond visual confirmation.

## 8. Git Status

Branch: `main` (unchanged — no branch was created or switched, consistent with how this repository's WS11 workstream has been carried in this environment to date). All Workspace-related files remain **uncommitted**, per this project's standing convention (no commit or push was performed; none was requested).

```
 M web/app/globals.css
?? web/components/workspace/          (contains this EBC's 11 changed files, all previously untracked from -007 through -011)
```

(Additional unrelated uncommitted changes exist elsewhere in the working tree from prior, separate EBCs — verified by diff to be untouched by this card.)

## 9. Known Limitations

1. `npm run build`'s Google Fonts network dependency cannot be validated in this environment (Section 4) — recommend re-running in CI/Vercel before release.
2. Live-browser functional/visual QA could not be performed in this environment (Section 7) — recommend Keerthi validate against a live preview deployment.
3. No new risk was introduced to RBAC, routing, authentication, or data — all verified unchanged by direct diff/reading.

## 10. Deliverables Checklist (EBC §16)

| Deliverable | Status |
|---|---|
| Updated Workspace UI | Complete — 11 component files |
| Updated semantic design tokens | Complete — `globals.css` |
| Updated shared components | Complete — `EmptyState`, `KpiCard` (additive) |
| Updated Workspace shell | Complete — `WorkspaceShell`, `WorkspaceHeader`, `WorkspaceUserMenu`, `WorkspaceNav` |
| Before/After screenshots | Complete — Section 7, delivered alongside this report |
| User Menu layering fix evidence | Complete — `EBC-WS11-011D-user-menu-layering-fix.png` (Addendum, Section 0) |
| Implementation Report | This document |

---

*Prepared by Rad, Engineering and Implementation Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011D.*
