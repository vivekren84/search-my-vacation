// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).

import type { SupabaseClient } from "@supabase/supabase-js";

import type { WorkspaceRole } from "../types";

export class WorkspaceUserRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace user repository operation failed");
    this.name = "WorkspaceUserRepositoryError";
  }
}

// Reads through the caller's own session-scoped Supabase client so Row
// Level Security — not this function — is what actually decides what is
// visible. This deliberately does not follow this repository's existing
// raw-fetch/secret-key pattern (e.g. web/lib/journey-leads/repository.ts):
// that pattern authenticates as the service role and bypasses RLS by
// design, which is correct for public-site writes but wrong here, where
// the whole point of AD-WS11-002 is that RLS — evaluated against the
// signed-in user's own JWT — is what enforces the Workspace access
// boundary.
export async function fetchWorkspaceUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceRole | null> {
  const { data, error } = await supabase
    .from("workspace_users")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new WorkspaceUserRepositoryError("workspace_user_lookup_failed");
  }

  return (data?.role as WorkspaceRole | undefined) ?? null;
}
