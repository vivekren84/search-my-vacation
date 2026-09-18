import SiteBrand from "@/components/brand/SiteBrand";
import WorkspaceMobileNav from "@/components/workspace/navigation/WorkspaceMobileNav";
import type { WorkspaceRole } from "@/lib/workspace/shared/types";

import WorkspaceUserMenu from "./WorkspaceUserMenu";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Top Header requirement
// (Workspace logo, Workspace title, search placeholder, current user, role
// badge, notification icon placeholder, Sign Out — "No additional menus").
// Search and the notification icon are both explicitly Out of Scope
// (Search; Notification engine) so both render disabled — visibly present,
// not wired to anything, per the EBC's own "placeholder" wording. No new
// icon dependency is introduced (Architecture Discovery R-ARCH-06: no
// component/icon library exists yet in this repository); all glyphs below
// are small inline SVGs, not a new package.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation.
// - WS11A-01 / WS11A-06 (Mandatory, per EBC-R1.3-WS11-011B §6.2/§14): the
//   header bar and its disabled search/notification controls now consume
//   the SMV semantic tokens (--color-cream, --color-border-warm,
//   --color-espresso, --color-amber) instead of hard-coded Tailwind
//   defaults. `disabled` state and both existing `aria-label`s are
//   unchanged.
// - WS11A-20 (Recommended): below the `sm` breakpoint, where the full
//   search field previously disappeared entirely, a disabled search
//   icon-button now takes its place, reusing the same disabled-icon-button
//   pattern already used for the notification bell in this file, so the
//   "search exists, coming soon" cue survives at narrower widths.
// - WS11A-07 (Recommended, conditional): a static, purely decorative
//   unread-indicator dot on the notification bell. It is NOT wired to any
//   data source — the Notifications engine remains entirely Out of Scope
//   for this card — and must not be read as a real unread count until a
//   future Notifications EBC gives this control real state.
// EBC-R1.3-WS11-011D Product Owner Correction: Workspace UX Refinement —
// User Menu Layering Fix. `backdrop-blur-sm` above uses `backdrop-filter`,
// which per the CSS spec creates a new stacking context on this <header>
// element even though it is `position: static`. Without an explicit
// z-index, that stacking context painted BELOW the later `<main>` sibling
// in WorkspaceShell.tsx (later flex items paint over earlier ones when both
// are z-index:auto), so the open WorkspaceUserMenu dropdown — nested inside
// this header — rendered behind the Dashboard's KPI/activity cards. Adding
// `relative z-30` here forces this header (and everything inside it,
// including the dropdown) to paint above the z-index:auto Workspace
// content that follows it in the DOM. See WorkspaceUserMenu.tsx for the
// dropdown's own z-40, and WorkspaceShell.tsx's <main> for the
// (unchanged, still z-index:auto) content layer this now sits above.
//
// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation, Remediation
// Item 1. WorkspaceMobileNav (hamburger trigger + slide-in drawer) is
// mounted here, first in the left-hand group, visible only below `md` —
// the exact inverse of WorkspaceShell.tsx's sidebar (`hidden md:block`),
// so exactly one presentation of the Workspace navigation is ever visible.
//
// EBC-R1.3-WS11-011H: Mobile Navigation Overlay Remediation. The trigger
// button above stays mounted here, but WorkspaceMobileNav's drawer/scrim
// overlay is no longer a DOM descendant of this <header> at open time — it
// is rendered through a React portal straight into document.body. Reason:
// this header's own `backdrop-blur-sm` (backdrop-filter) establishes a
// containing block for any `position: fixed` descendant, which was
// silently collapsing the drawer to this header's ~64px height instead of
// the full viewport (Keerthi, OBS-011G-01). Portaling the overlay out from
// under this header's backdrop-filter fixes that without changing this
// header's own visual treatment or z-30 stacking — see
// WorkspaceMobileNav.tsx for the full root-cause note and the fix itself.
// The header's z-30 and the user-menu dropdown's z-40 are otherwise
// unchanged; the portaled drawer now uses z-50 (this design system's
// reserved top-level modal-overlay tier) since it is a genuine full-screen
// overlay once outside this header's own stacking context.
type WorkspaceHeaderProps = { displayName: string; role: WorkspaceRole };

export default function WorkspaceHeader({ displayName, role }: WorkspaceHeaderProps) {
  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border-warm)] bg-[var(--color-cream)]/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <WorkspaceMobileNav />
        <SiteBrand variant="compact" surface="light" linked={false} className="w-28 shrink-0 sm:w-32" />
        <span className="hidden text-sm font-semibold text-[var(--color-espresso)]/60 sm:inline">Workspace</span>
      </div>

      <div className="hidden flex-1 justify-center px-4 sm:flex">
        <label className="relative w-full max-w-sm">
          <span className="sr-only">Search</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-espresso)]/40"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            disabled
            aria-label="Search (coming soon)"
            className="w-full rounded-full border border-[var(--color-border-warm)] bg-[rgb(245_149_28_/_6%)] py-2 pl-9 pr-4 text-sm text-[var(--color-espresso)]/60 placeholder:text-[var(--color-espresso)]/40"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          aria-label="Search (coming soon)"
          className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border-warm)] bg-[rgb(245_149_28_/_6%)] text-[var(--color-espresso)]/40 sm:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <button
          type="button"
          disabled
          aria-label="Notifications (coming soon)"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border-warm)] bg-[rgb(245_149_28_/_6%)] text-[var(--color-espresso)]/40"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {/* Decorative only (WS11A-07) — not bound to any notification
              data. Remove or replace once a real Notifications engine
              exists. */}
          <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" />
        </button>
        <WorkspaceUserMenu displayName={displayName} role={role} />
      </div>
    </header>
  );
}
