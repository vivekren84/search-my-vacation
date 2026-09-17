// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — RBAC permission
// framework.
//
// Framework only — there is no per-screen capability matrix yet (OQ-001).
// Every gated action defaults to Administrator-only until the screen
// implementing it defines, and the Product Owner approves, its actual
// capability, per EBC-R1.3-WS11-006 (WS-Eng-1 note) and OQ-001's ratified
// conservative-default recommendation. This file intentionally implements
// no business permission (Section 8.7 of this EBC: "Do not implement
// business permissions").

import type { WorkspaceRole } from "../types";
import { isWorkspaceAdministrator } from "./roles";

export function hasWorkspaceCapability(role: WorkspaceRole | null | undefined): boolean {
  return isWorkspaceAdministrator(role);
}
