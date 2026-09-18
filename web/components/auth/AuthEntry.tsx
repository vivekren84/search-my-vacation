"use client";

// EBC-R1.3-WS11-009: Unified Authentication Entry Experience.
// The single entry point Section 5/6 asks for, rendered once by Header.tsx
// so it appears, positioned top-right, on every public page that uses the
// shared header (Section 5) — desktop and mobile alike (see Header.tsx for
// how one instance covers both breakpoints).
//
// Signed out: a "Sign In" control that opens SignInModal. No Register
// option (Section 5).
//
// Signed in: "{Display Name} ▾" replacing Sign In (Section 6), opening a
// role-appropriate menu. The menu is built from WORKSPACE_ROLE_MENU_ITEMS
// below, keyed by role, specifically so a future Traveller role is one new
// map entry, not a rewritten component (Section 6: "extensible... without
// redesign").
//
// Several menu destinations (Profile, Administration, User Management,
// Settings) have no page implementation yet — they are future Engineering
// Phases (EBC-R1.3-WS11-006's phasing), not this EBC's scope (Section 2 is
// the entry *experience*, not those screens). They are still rendered here
// because Section 6 specifies these exact labels as approved header
// behaviour; visiting one today reaches Next's normal not-found handling
// inside the authenticated area rather than exposing anything — disclosed
// in this EBC's implementation report, not silently done less than spec.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { signOutCurrentWorkspaceUserFromClient } from "@/lib/workspace/shared/auth/client";
import {
  WORKSPACE_PROFILE_PATH,
  WORKSPACE_ROUTE_PREFIX,
  WORKSPACE_SETTINGS_PATH,
  WORKSPACE_USER_MANAGEMENT_PATH,
} from "@/lib/workspace/shared/constants";
import { describeWorkspaceRoleLabel } from "@/lib/workspace/shared/rbac/roles";
import type { WorkspaceRole } from "@/lib/workspace/shared/types";
import { useWorkspaceAuthUser } from "@/hooks/useWorkspaceAuthUser";

import SignInModal from "./SignInModal";

type WorkspaceMenuItem = { label: string; href: string };

// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement, Section 6
// re-states the ratified header menu contents explicitly: Administrator
// gets Workspace / User Management (placeholder) / Profile / Settings
// (placeholder) / Sign Out — no separate "Administration" item. This
// supersedes EBC-R1.3-WS11-009's menu, which additionally listed
// "Administration" as its own entry; that item is removed here to match
// this EBC's explicit, ratified list (Project Instructions §17: latest
// explicit Product Owner instruction is the top source of truth). The
// WORKSPACE_ADMINISTRATION_PATH constant itself is left defined in
// constants.ts, unused for now, in case a future Administration screen
// still wants that exact path.
const WORKSPACE_ROLE_MENU_ITEMS: Record<WorkspaceRole, WorkspaceMenuItem[]> = {
  administrator: [
    { label: "Workspace", href: WORKSPACE_ROUTE_PREFIX },
    { label: "User Management", href: WORKSPACE_USER_MANAGEMENT_PATH },
    { label: "Profile", href: WORKSPACE_PROFILE_PATH },
    { label: "Settings", href: WORKSPACE_SETTINGS_PATH },
  ],
  privilege_user: [
    { label: "Workspace", href: WORKSPACE_ROUTE_PREFIX },
    { label: "Profile", href: WORKSPACE_PROFILE_PATH },
  ],
};

export default function AuthEntry() {
  const state = useWorkspaceAuthUser();
  const router = useRouter();

  const [signInTrigger, setSignInTrigger] = useState<HTMLButtonElement | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuContainerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOutCurrentWorkspaceUserFromClient();
    router.refresh();
  }

  function handleSignInSuccess() {
    setSignInTrigger(null);
    // Section 5: identity/role resolution is a system responsibility.
    // Every successful sign-in from this entry point requests /workspace;
    // the existing server-side guard (requireWorkspaceUser) and proxy
    // (updateWorkspaceSession) — both already built in
    // EBC-R1.3-WS11-007/008 — resolve Administrator vs Workspace User vs
    // not-yet-authorised and route accordingly. Nothing here decides that.
    router.push(WORKSPACE_ROUTE_PREFIX);
  }

  if (state.status === "signed-in") {
    const menuItems = WORKSPACE_ROLE_MENU_ITEMS[state.user.role] ?? [];
    const roleLabel = describeWorkspaceRoleLabel(state.user.role);

    return (
      <div className="relative" ref={menuContainerRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label={`Account menu for ${state.user.displayName}, ${roleLabel}`}
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-white transition-colors duration-300 hover:text-white/75"
        >
          {state.user.displayName}
          <span aria-hidden="true" className="text-xs">▾</span>
        </button>

        {isMenuOpen ? (
          <div
            role="menu"
            aria-label="Account"
            className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-2xl border border-white/15 bg-[#2A211C]/95 p-2 shadow-xl shadow-black/25 backdrop-blur-md"
          >
            <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              {roleLabel}
            </p>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
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
                  className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
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

  return (
    <>
      <button
        type="button"
        onClick={(event) => setSignInTrigger(event.currentTarget)}
        className="whitespace-nowrap text-sm font-medium text-white transition-colors duration-300 hover:text-white/75"
      >
        Sign In
      </button>

      {signInTrigger ? (
        <SignInModal
          onClose={() => setSignInTrigger(null)}
          onSuccess={handleSignInSuccess}
          triggerElement={signInTrigger}
        />
      ) : null}
    </>
  );
}
