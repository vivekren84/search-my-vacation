// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — audit trail types.
// event_type values must stay in lockstep with the CHECK constraint in
// supabase/migrations/20260921060000_workspace_shared_audit_log.sql; add to
// both together.

export type WorkspaceAuditEventType =
  | "created"
  | "claimed"
  | "reassigned"
  | "stage_transition"
  | "proposal_version_created"
  | "proposal_sent"
  | "vendor_quotation_recorded"
  | "record_converted"
  | "record_closed"
  | "archived";

export interface WorkspaceAuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  eventType: WorkspaceAuditEventType;
  actorId: string;
  eventData: Record<string, unknown>;
  createdAt: string;
}

export interface RecordWorkspaceAuditEventInput {
  entityType: string;
  entityId: string;
  eventType: WorkspaceAuditEventType;
  actorId: string;
  eventData?: Record<string, unknown>;
}
