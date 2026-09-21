// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — audit trail repository.
// Follows the same pattern as
// web/lib/workspace/shared/auth/repository.ts: the Supabase SDK
// query-builder against a cookie-session-bound client, relying on RLS
// (workspace_audit_log_insert_own) rather than a service-role bypass —
// this is a Workspace/RLS-governed table, not a public-site table.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { RecordWorkspaceAuditEventInput } from "./types";

export class WorkspaceAuditRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace audit repository operation failed");
    this.name = "WorkspaceAuditRepositoryError";
  }
}

export async function insertWorkspaceAuditLogEntry(
  supabase: SupabaseClient,
  input: RecordWorkspaceAuditEventInput,
): Promise<void> {
  const { error } = await supabase.from("workspace_audit_log").insert({
    entity_type: input.entityType,
    entity_id: input.entityId,
    event_type: input.eventType,
    actor_id: input.actorId,
    event_data: input.eventData ?? {},
  });

  if (error) {
    throw new WorkspaceAuditRepositoryError("workspace_audit_log_insert_failed");
  }
}
