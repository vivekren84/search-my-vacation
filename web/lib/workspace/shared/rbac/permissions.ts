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

// EBC-R1.3-WS12-007: Journey Planning Engineering Implementation (Phase 1,
// Shared Foundation) — first record-scoped (not just role-scoped)
// authorization logic in this codebase, per WS12-005 Solution Architecture
// Section 10.2, flagged in WS12-006's Security Review as the module's
// highest security-design-attention item.
//
// Written against a minimal structural shape (OwnedWorkspaceRecord) rather
// than importing Journey Planning's own types, so this stays a genuine
// shared/RBAC module any future owner-scoped Workspace module can reuse
// (Reuse Before Build), not a Journey-Planning-specific file living in the
// wrong folder.
//
// Engineering-authority defaults (WS12-005 Section 10.2 establishes that
// these six actions must be record-scoped, but does not itself specify the
// per-action rule; no separate Product/Architecture decision narrows it
// further). Following WS11-007's own conservative-default convention
// (OQ-001: "every gated action defaults to Administrator-only until the
// screen implementing it defines, and the Product Owner approves, its
// actual capability"): Administrator may always act. A Workspace User
// ("privilege_user") may act only on a record they currently own, with two
// exceptions — claiming an unowned record (open to any Workspace User, so
// the queue is actually workable) and archiving outside the normal Decision
// stage closure (Administrator-only, since it bypasses the approved
// lifecycle). These are engineering implementation defaults, not Product
// decisions; recorded in the WS12-007 Engineering Decision Log for Product
// Owner visibility, not as a request for re-approval.

export interface OwnedWorkspaceRecord {
  ownerId: string | null;
}

interface RbacUser {
  id: string;
  role: WorkspaceRole;
}

function isRecordOwner(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  return record.ownerId !== null && record.ownerId === user.id;
}

export function canClaimRecord(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  if (isWorkspaceAdministrator(user.role)) return true;
  return record.ownerId === null;
}

export function canReassignRecord(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  if (isWorkspaceAdministrator(user.role)) return true;
  return isRecordOwner(user, record);
}

export function canEditRecord(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  if (isWorkspaceAdministrator(user.role)) return true;
  return isRecordOwner(user, record);
}

export function canAdvanceStage(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  if (isWorkspaceAdministrator(user.role)) return true;
  return isRecordOwner(user, record);
}

export function canRecordDecision(user: RbacUser, record: OwnedWorkspaceRecord): boolean {
  if (isWorkspaceAdministrator(user.role)) return true;
  return isRecordOwner(user, record);
}

export function canArchiveOutsideNormalClosure(user: RbacUser): boolean {
  return isWorkspaceAdministrator(user.role);
}
