// EBC-R1.3-WS13-005 Phase 0 (WP-0.1, AD-WS13-007): Workspace User
// directory types. Mirrors public.workspace_user_directory()
// (supabase/migrations/20260928100000_workspace_users_directory_and_deactivation.sql).

import type { WorkspaceRole } from "../types";

export interface WorkspaceDirectoryUser {
  userId: string;
  displayName: string;
  role: WorkspaceRole;
  isActive: boolean;
}
