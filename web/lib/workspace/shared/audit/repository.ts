// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — audit trail repository.
// Follows the same pattern as
// web/lib/workspace/shared/auth/repository.ts: the Supabase SDK
// query-builder against a cookie-session-bound client, relying on RLS
// (workspace_audit_log_insert_own) rather than a service-role bypass —
// this is a Workspace/RLS-governed table, not a public-site table.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { RecordWorkspaceAuditEventInput, WorkspaceAuditLogEntry } from "./types";

export class WorkspaceAuditRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace audit repository operation failed");
    this.name = "WorkspaceAuditRepositoryError";
  }
}

function mapAuditLogRow(row: Record<string, unknown>): WorkspaceAuditLogEntry {
  return {
    id: row.id as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string,
    eventType: row.event_type as WorkspaceAuditLogEntry["eventType"],
    actorId: row.actor_id as string,
    eventData: (row.event_data as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  };
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

// EBC-R1.3-WS12-010 Defect D1a: History/Audit UI. Lists every audit event
// for one entity in reverse-chronological order -- the read path this
// module's Phase 1 audit trail never had a consumer for until now.
export async function listWorkspaceAuditLogEntries(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
): Promise<WorkspaceAuditLogEntry[]> {
  const { data, error } = await supabase
    .from("workspace_audit_log")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new WorkspaceAuditRepositoryError("workspace_audit_log_list_failed");
  }

  return (data ?? []).map(mapAuditLogRow);
}
