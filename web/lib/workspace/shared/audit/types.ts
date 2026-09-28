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
  | "archived"
  // EBC-R1.3-WS12-010 Defect D1b: task events, added when the shared
  // Tasks module (WS12-007 Phase 1) got its first real consumer.
  | "task_created"
  | "task_updated"
  // EBC-R1.3-WS12-013: Planning Parameters ("Trip Basics") in-place edit.
  | "trip_basics_updated"
  // EBC-R1.3-WS13-005 Phase 0 (M02, EBC-R1.3-WS13-004 §6.4): Journey
  // Workspace events. Must stay in lockstep with the CHECK constraint in
  // supabase/migrations/20260928100100_workspace_audit_log_ws13_events.sql.
  | "journey_created"
  | "journey_stage_changed"
  | "journey_stage_stepped_back"
  | "journey_on_hold"
  | "journey_resumed"
  | "journey_cancelled"
  | "journey_closed"
  | "journey_superseded"
  | "journey_reassigned"
  | "journey_archived"
  | "journey_service_category_changed"
  | "journey_contact_changed"
  | "journey_template_assigned"
  | "journey_template_changed"
  | "journey_legacy_adopted"
  | "readiness_item_updated"
  | "vendor_booking_created"
  | "vendor_booking_status_changed"
  | "vendor_booking_updated"
  | "document_added"
  | "document_status_changed"
  | "document_updated"
  | "document_reference_updated"
  | "change_record_created"
  | "activity_logged"
  | "note_added"
  | "material_change_started"
  // System events: actorId is null (AD-WS13-005), shown as
  // "Workspace (automatic)".
  | "alert_raised"
  | "alert_resolved"
  | "legacy_backfilled";

export interface WorkspaceAuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  eventType: WorkspaceAuditEventType;
  // EBC-R1.3-WS13-005 Phase 0 (M02): null only for system events
  // (alert_raised, alert_resolved, legacy_backfilled).
  actorId: string | null;
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
