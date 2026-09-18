// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// EBC-R1.3-WS11-008: SMV Workspace Authentication & User Management —
// extended with a discriminated auth state so callers can distinguish "not
// signed in" from "signed in but not provisioned as Workspace staff"
// (Section 5, Error Handling: Unauthenticated vs Unauthorized). WS-Eng-0
// deliberately merged these two states (see this EBC's Implementation
// Report, Section 1: "this phase does not distinguish the two in the UI") —
// this EBC's Error Handling requirement is what makes the split necessary.

import { createWorkspaceSupabaseServerClient } from "../supabase/server";
import type { WorkspaceUser } from "../types";
import { deriveWorkspaceDisplayName } from "./displayName";
import { fetchWorkspaceUserRole } from "./repository";

export type WorkspaceAuthState =
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | { status: "ok"; user: WorkspaceUser };

// "unauthenticated": no Supabase Auth session.
// "unauthorized": a valid Supabase Auth session exists, but the signed-in
// person has no workspace_users row yet (not provisioned as Workspace
// staff — Administrator-initiated provisioning is WS-Eng-1's user-creation
// flow, out of this EBC's scope per its Section 6).
export async function getWorkspaceAuthState(): Promise<WorkspaceAuthState> {
  const supabase = await createWorkspaceSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "unauthenticated" };

  const role = await fetchWorkspaceUserRole(supabase, user.id);
  if (!role) return { status: "unauthorized" };

  // EBC-R1.3-WS11-011: reuse the same display-name derivation the public
  // header's client-side hook already uses (auth/displayName.ts), rather
  // than a second implementation for Server Component callers.
  const displayName = deriveWorkspaceDisplayName(user);

  return { status: "ok", user: { id: user.id, email: user.email ?? null, role, displayName } };
}

// Convenience wrapper retained for callers that only need "is there a
// signed-in, provisioned Workspace user" and don't need to distinguish why
// not (kept behaviourally identical to WS-Eng-0's original function).
export async function getCurrentWorkspaceUser(): Promise<WorkspaceUser | null> {
  const state = await getWorkspaceAuthState();
  return state.status === "ok" ? state.user : null;
}

export async function signOutCurrentWorkspaceUser(): Promise<void> {
  const supabase = await createWorkspaceSupabaseServerClient();
  await supabase.auth.signOut();
}
