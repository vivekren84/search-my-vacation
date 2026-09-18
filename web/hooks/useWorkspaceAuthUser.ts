"use client";

// EBC-R1.3-WS11-009: Unified Authentication Entry Experience.
// Client-side auth state for the public site's shared header (Header.tsx /
// AuthEntry.tsx). This runs on every public page, not just under
// /workspace/**, so it cannot use the Server Component-only
// getWorkspaceAuthState() (lib/workspace/shared/auth/service.ts, which
// needs next/headers). It reuses the same browser Supabase client and the
// same RLS-scoped role lookup (fetchWorkspaceUserRole) that WS-Eng-0/1
// already built, rather than introducing a second way to read a Workspace
// role (Project Instructions §18/§21 — no duplicate authentication logic).
//
// A signed-in Supabase Auth user with no workspace_users row (not yet
// Workspace staff, and there is no Traveller identity to show instead
// today — Section 9 of this EBC excludes building one) is reported as
// "signed-out" here, matching the header's only two real states for now.
// This is disclosed in this EBC's implementation report as the current,
// intentionally narrow scope, not asserted as the final design once a
// Traveller identity exists.
//
// State is resolved entirely from the onAuthStateChange subscription
// callback rather than from a separate getUser() call in the effect body:
// Supabase's browser client fires that callback once immediately on
// subscribe with the current session (INITIAL_SESSION), so this is both
// sufficient and keeps every setState call inside the "external system"
// callback the effect subscribes to, not in the effect body itself.
//
// Client creation is wrapped rather than left to throw during render:
// Header.tsx renders on every public page (Section 10, "Existing public
// website behaviour remains unchanged"), so an unconfigured Supabase
// environment must degrade this hook to permanently "signed-out" rather
// than take down every public page — the same fail-closed principle
// session.ts already applies at the proxy layer.
import { useEffect, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { deriveWorkspaceDisplayName } from "@/lib/workspace/shared/auth/displayName";
import { fetchWorkspaceUserRole } from "@/lib/workspace/shared/auth/repository";
import { createWorkspaceSupabaseBrowserClient } from "@/lib/workspace/shared/supabase/browser";
import type { WorkspaceRole } from "@/lib/workspace/shared/types";

export type WorkspaceHeaderUser = {
  id: string;
  email: string | null;
  role: WorkspaceRole;
  displayName: string;
};

export type WorkspaceAuthUserState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: WorkspaceHeaderUser };

function createClientSafely(): SupabaseClient | null {
  try {
    return createWorkspaceSupabaseBrowserClient();
  } catch {
    return null;
  }
}

async function resolveStateForUser(supabase: SupabaseClient, user: User | null): Promise<WorkspaceAuthUserState> {
  if (!user) return { status: "signed-out" };

  const role = await fetchWorkspaceUserRole(supabase, user.id).catch(() => null);
  if (!role) return { status: "signed-out" };

  return {
    status: "signed-in",
    user: {
      id: user.id,
      email: user.email ?? null,
      role,
      displayName: deriveWorkspaceDisplayName(user),
    },
  };
}

export function useWorkspaceAuthUser(): WorkspaceAuthUserState {
  const [supabase] = useState(createClientSafely);
  const [state, setState] = useState<WorkspaceAuthUserState>(
    supabase ? { status: "loading" } : { status: "signed-out" },
  );

  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveStateForUser(supabase, session?.user ?? null).then((next) => {
        if (isMounted) setState(next);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return state;
}
