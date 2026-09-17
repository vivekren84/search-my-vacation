// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Shared Workspace types. Framework-level only — no module-specific business
// entities (Section 8.9 of this EBC).

export type WorkspaceRole = "administrator" | "privilege_user";

export const WORKSPACE_ROLES: readonly WorkspaceRole[] = ["administrator", "privilege_user"];

export interface WorkspaceUser {
  id: string;
  email: string | null;
  role: WorkspaceRole;
}

export interface WorkspaceSession {
  user: WorkspaceUser;
}
