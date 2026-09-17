// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — RBAC role model.

import type { WorkspaceRole } from "../types";

export const WORKSPACE_ADMINISTRATOR: WorkspaceRole = "administrator";
export const WORKSPACE_PRIVILEGE_USER: WorkspaceRole = "privilege_user";

export function isWorkspaceAdministrator(role: WorkspaceRole | null | undefined): boolean {
  return role === WORKSPACE_ADMINISTRATOR;
}
