// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — RBAC role model.
// EBC-R1.3-WS11-008 names the two supported roles "Administrator" and
// "Workspace User" in its Section 5. Product Decision (Vivek, Product
// Owner, 17 September 2026), recorded in this EBC's implementation report:
// "Workspace User" is product/business terminology for the existing
// technical role "privilege_user" — no rename, migration or RBAC redesign
// is approved for Release 1.3. This file's identifiers intentionally keep
// the technical name; only UX/product-facing copy should say
// "Workspace User".

import type { WorkspaceRole } from "../types";

export const WORKSPACE_ADMINISTRATOR: WorkspaceRole = "administrator";
export const WORKSPACE_PRIVILEGE_USER: WorkspaceRole = "privilege_user";

export function isWorkspaceAdministrator(role: WorkspaceRole | null | undefined): boolean {
  return role === WORKSPACE_ADMINISTRATOR;
}

// EBC-R1.3-WS11-009: Unified Authentication Entry Experience.
// Product-facing label for a role, per the Section 2 terminology mapping in
// EBC-R1.3-WS11-008's implementation report (Vivek, Product Owner, 17
// September 2026): UI copy says "Workspace User", never "privilege_user".
export function describeWorkspaceRoleLabel(role: WorkspaceRole): string {
  return isWorkspaceAdministrator(role) ? "Administrator" : "Workspace User";
}
