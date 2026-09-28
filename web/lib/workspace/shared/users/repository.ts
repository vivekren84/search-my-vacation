// EBC-R1.3-WS13-005 Phase 0 (WP-0.1, AD-WS13-007): Workspace User
// directory repository. Reads through the caller's session-bound client;
// the SECURITY DEFINER function returns rows only to provisioned Workspace
// Users and exposes no email address.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { WorkspaceRole } from "../types";
import type { WorkspaceDirectoryUser } from "./types";

export class WorkspaceDirectoryRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace user directory operation failed");
    this.name = "WorkspaceDirectoryRepositoryError";
  }
}

export async function listWorkspaceDirectoryUsers(supabase: SupabaseClient): Promise<WorkspaceDirectoryUser[]> {
  const { data, error } = await supabase.rpc("workspace_user_directory");
  if (error) {
    throw new WorkspaceDirectoryRepositoryError("workspace_user_directory_failed");
  }
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    userId: row.user_id as string,
    displayName: row.display_name as string,
    role: row.role as WorkspaceRole,
    isActive: row.is_active as boolean,
  }));
}
