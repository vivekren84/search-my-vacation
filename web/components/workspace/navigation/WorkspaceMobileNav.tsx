"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import WorkspaceNav from "./WorkspaceNav";

// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation, Remediation
// Item 1 (Mobile Navigation). Fixes OBS-011E-04 (Keerthi,
// EBC-R1.3-WS11-011E): below the `md` breakpoint the primary navigation
// rail disappears with no alternative access, trapping an authenticated
// user on the Dashboard.
//
// Implements exactly the Recommended-but-deferred pattern already on
// record (WS11A-12, docs/04-UX/workspace/WORKSPACE-UX-REVIEW-NOTES.md
// §4): "a slide-in drawer, triggered by a header hamburger control,
// reusing the exact same WORKSPACE_NAV_GROUPS data and item list already
// defined in WorkspaceNav.tsx — i.e., a presentation change, not a new
// navigation model." This component renders the trigger and the drawer;
// the drawer's body is literally <WorkspaceNav /> — the same component,
// same data, same isActive logic used by the desktop sidebar — so the
// mobile drawer can never drift out of sync with desktop navigation.
//
// EBC-R1.3-WS11-011H: Mobile Navigation Overlay Remediation.
// Root cause (identified independently, confirming Keerthi's live DOM
// diagnosis in EBC-R1.3-WS11-011G / OBS-011G-01): this component is
// mounted inside WorkspaceHeader.tsx's <header>, and that <header> carries
// `backdrop-blur-sm` (backdrop-filter: blur(...)). Per the CSS spec,
// backdrop-filter — like filter, transform, perspective and
// will-change: transform — establishes a new containing block for any
// `position: fixed` descendant. The drawer overlay below was previously
// `position: fixed` while still nested inside that header, so `inset-0`
// was resolving against the header's own ~64px box instead of the
// viewport, collapsing the entire drawer (and its full nav list) to a
// ~63px sliver. The header comment this replaces incorrectly asserted
// that backdrop-filter does not create a containing block for fixed
// descendants — it does; that assumption was wrong and is corrected here.
//
// Fix: the trigger button stays exactly where it was (first item in the
// header's left-hand group, in WorkspaceHeader.tsx), but the scrim +
// drawer overlay is now rendered through a React portal directly into
// `document.body`, entirely outside the header's DOM subtree. This
// removes it from the header's backdrop-filter containing block, so its
// `fixed inset-0` resolves against the real viewport again, without
// touching the header's own visual treatment (its blur/branding is
// unchanged — Sophie's approved header design was not altered) and
// without changing WorkspaceHeader/WorkspaceShell's component structure.
// `createPortal` is part of `react-dom` (already a project dependency;
// no new package). The portal is only ever mounted while `isOpen` is
// true, and `isOpen` only ever becomes true from a browser click handler,
// so `document` is always available when this runs — there is no
// server-rendering/hydration concern here.
export default function WorkspaceMobileNav() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={isOpen}
        aria-controls="workspace-mobile-nav-drawer"
        aria-label="Open Workspace navigation"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-border-warm)] bg-[rgb(245_149_28_/_6%)] text-[var(--color-espresso)]/70 md:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {isOpen
        ? createPortal(
            // z-50 (not the header's z-30 / user-menu dropdown's z-40 tier):
            // now that this overlay is portaled to document.body it is a
            // true top-level, full-viewport modal surface, not part of the
            // header's own stacking context — z-50 is this design system's
            // reserved "modal overlay" tier (see WorkspaceHeader.tsx's
            // z-index note), which this now genuinely is.
            <div className="fixed inset-0 z-50 md:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-[var(--color-espresso)]/40 backdrop-blur-[1px]"
              />
              <div
                id="workspace-mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Workspace navigation"
                className="workspace-drawer-reveal absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[var(--color-cream)] shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border-warm)] px-4 py-4">
                  <span className="text-sm font-semibold text-[var(--color-espresso)]/70">Workspace</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-border-warm)] text-[var(--color-espresso)]"
                  >
                    <span aria-hidden="true" style={{ fontSize: "1.1rem", lineHeight: 1 }}>
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <WorkspaceNav onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
