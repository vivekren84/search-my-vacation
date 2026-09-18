"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { signOutCurrentWorkspaceUserFromClient } from "@/lib/workspace/shared/auth/client";
import {
  WORKSPACE_PROFILE_PATH,
  WORKSPACE_SETTINGS_PATH,
  WORKSPACE_SIGN_IN_PATH,
  WORKSPACE_USER_MANAGEMENT_PATH,
} from "@/lib/workspace/shared/constants";
import { describeWorkspaceRoleLabel, isWorkspaceAdministrator } from "@/lib/workspace/shared/rbac/roles";
import type { WorkspaceRole } from "@/lib/workspace/shared/types";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Top Header requirement
// ("current user, role badge, ... Sign Out"). Product ratification (Vivek,
// Product Owner, 17 September 2026, resolving this EBC's Settings-placement
// question): "Settings is not a workspace module. It belongs in the
// authenticated user's header dropdown together with Profile and Sign Out
// ... For Administrator users, include an additional 'User Management' menu
// item in the same dropdown." This mirrors the public header's existing
// AuthEntry.tsx menu (EBC-R1.3-WS11-009/010) rather than inventing a new
// pattern, but is its own component per this EBC's mandatory
// components/workspace/ folder structure — the public Header's dark,
// public-site styling is not reused, since Workspace must "remain visually
// distinct from the public website" (UX Requirements).
//
// This receives the already-resolved user (displayName, role) as props from
// the Server Component that renders it, rather than re-deriving the role
// client-side the way the public header's useWorkspaceAuthUser hook must
// (that hook exists because the public header runs on pages outside
// /workspace/**, which this component never does).
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01, Mandatory, per EBC-R1.3-WS11-011B §14). Visual refinement
// only — the menuItems array, the isWorkspaceAdministrator gate, Sign Out
// behaviour and every route constant below are unchanged. The dropdown's
// entrance reuses the existing `.journey-passport-reveal` motion utility
// already defined in app/globals.css (a 200ms fade+rise that already
// respects prefers-reduced-motion) rather than introducing new animation.
type WorkspaceUserMenuProps = { displayName: string; role: WorkspaceRole };

// EBC-R1.3-WS11-011D Product Owner Correction: Workspace UX Refinement —
// User Menu Layering Fix. The dropdown below is given an explicit `z-40`
// (higher than WorkspaceHeader's `z-30`) so it always paints above the
// header bar itself, and — combined with the header's new stacking-context
// elevation (see WorkspaceHeader.tsx) — above the Workspace content area
// too. Reserved scale for this shell: content (z-index:auto/0) <
// WorkspaceHeader (z-30) < this dropdown (z-40) < any future modal overlay
// (intended to sit at z-50+, per Product Owner's expected layering order).
export default function WorkspaceUserMenu({ displayName, role }: WorkspaceUserMenuProps) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const roleLabel = describeWorkspaceRoleLabel(role);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleSignOut() {
    setOpen(false);
    await signOutCurrentWorkspaceUserFromClient();
    router.replace(WORKSPACE_SIGN_IN_PATH);
    router.refresh();
  }

  const menuItems = [
    { label: "Profile", href: WORKSPACE_PROFILE_PATH },
    { label: "Settings", href: WORKSPACE_SETTINGS_PATH },
    ...(isWorkspaceAdministrator(role) ? [{ label: "User Management", href: WORKSPACE_USER_MANAGEMENT_PATH }] : []),
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}, ${roleLabel}`}
        className="flex items-center gap-2 rounded-full border border-[var(--color-border-warm)] bg-[var(--color-cream)] py-1 pl-1 pr-3 transition hover:bg-[rgb(245_149_28_/_8%)]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-amber),var(--color-orange))] text-xs font-semibold text-white">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm font-medium text-[var(--color-espresso)]">{displayName}</span>
        <span className="rounded-full bg-[var(--color-amber)]/14 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--color-espresso)]/70">
          {roleLabel}
        </span>
        <span aria-hidden="true" className="text-xs text-[var(--color-espresso)]/40">▾</span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Account"
          className="journey-passport-reveal absolute right-0 top-[calc(100%+0.5rem)] z-40 w-52 rounded-[var(--radius-xl)] border border-[var(--color-border-warm)] bg-[var(--color-cream)] p-2 shadow-[var(--shadow-lg)]"
        >
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-espresso)] transition hover:bg-[rgb(245_149_28_/_8%)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--color-espresso)] transition hover:bg-[rgb(245_149_28_/_8%)]"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
