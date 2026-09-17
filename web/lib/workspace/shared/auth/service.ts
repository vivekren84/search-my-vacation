// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).

import { createWorkspaceSupabaseServerClient } from "../supabase/server";
import type { WorkspaceUser } from "../types";
import { fetchWorkspaceUserRole } from "./repository";

// Returns null both for "not signed in" and for "signed in but not yet
// provisioned as Workspace staff" — this phase does not distinguish the two
// in the UI (that is a UX decision for whichever screen first needs to
// explain the difference; Administrator-initiated provisioning itself is
// WS-Eng-1 scope, not this EBC).
export async function getCurrentWorkspaceUser(): Promise<WorkspaceUser | null> {
  const supabase = await createWorkspaceSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = await fetchWorkspaceUserRole(supabase, user.id);
  if (!role) return null;

  return { id: user.id, email: user.email ?? null, role };
}

export async function signOutCurrentWorkspaceUser(): Promise<void> {
  const supabase = await createWorkspaceSupabaseServerClient();
  await supabase.auth.signOut();
}
