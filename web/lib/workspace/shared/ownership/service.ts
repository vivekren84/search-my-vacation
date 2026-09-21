// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — Generic Ownership Model.
//
// Implements Claim/Reassign as a single database-resolved conditional
// UPDATE rather than a read-then-write, per WS12-006's R-ENG-JP-04
// mitigation: two Workspace Users claiming the same unowned record
// concurrently cannot both "win" a race, because exactly one
// `UPDATE ... WHERE owner_id IS NULL` can affect a given row.
//
// Deliberately entity-agnostic (table name passed in) so this is genuinely
// shared/ownership logic reusable by any future owner_id-bearing Workspace
// table, not Journey-Planning-specific code living in the wrong folder —
// mirrors the same design choice already made for shared/audit and
// shared/notifications.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimOwnedRecordResult } from "./types";

export class WorkspaceOwnershipError extends Error {
  constructor(readonly code: string) {
    super("Workspace ownership operation failed");
    this.name = "WorkspaceOwnershipError";
  }
}

export async function claimOwnedWorkspaceRecord(
  supabase: SupabaseClient,
  table: string,
  recordId: string,
  userId: string,
): Promise<ClaimOwnedRecordResult> {
  const { data, error } = await supabase
    .from(table)
    .update({ owner_id: userId })
    .eq("id", recordId)
    .is("owner_id", null)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new WorkspaceOwnershipError("workspace_ownership_claim_failed");
  }

  return { claimed: data !== null };
}

export async function reassignOwnedWorkspaceRecord(
  supabase: SupabaseClient,
  table: string,
  recordId: string,
  newOwnerId: string,
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .update({ owner_id: newOwnerId })
    .eq("id", recordId);

  if (error) {
    throw new WorkspaceOwnershipError("workspace_ownership_reassign_failed");
  }
}
