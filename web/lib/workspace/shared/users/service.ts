// EBC-R1.3-WS13-005 Phase 0 (WP-0.1, AD-WS13-007): Workspace User
// directory service. First consumers arrive in Phase 1 (owner names, the
// assign/reassign picker, AL-16); exposed now as the P0 foundation.

import type { SupabaseClient } from "@supabase/supabase-js";

import { listWorkspaceDirectoryUsers } from "./repository";
import type { WorkspaceDirectoryUser } from "./types";

export async function getWorkspaceUserDirectory(supabase: SupabaseClient): Promise<WorkspaceDirectoryUser[]> {
  return listWorkspaceDirectoryUsers(supabase);
}

export async function getActiveWorkspaceUsers(supabase: SupabaseClient): Promise<WorkspaceDirectoryUser[]> {
  const users = await listWorkspaceDirectoryUsers(supabase);
  return users.filter((user) => user.isActive);
}
