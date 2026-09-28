// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — notification types.
// Must stay in lockstep with the CHECK constraint in
// supabase/migrations/20260921060100_workspace_shared_notifications.sql.

export type WorkspaceNotificationType = "action_required" | "informational";

export interface WorkspaceNotification {
  id: string;
  recipientUserId: string;
  notificationType: WorkspaceNotificationType;
  category: string;
  entityType: string | null;
  entityId: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  // EBC-R1.3-WS13-005 Phase 0 (M03, AD-WS13-005): condition-keyed Action
  // Required alerts. All three are null for informational notifications
  // and every pre-WS13 row. Reading never resolves an alert (BR-017).
  conditionKey: string | null;
  resolvedAt: string | null;
  resolution: WorkspaceNotificationResolution | null;
}

export type WorkspaceNotificationResolution = "condition_cleared" | "journey_terminal" | "superseded";

export interface CreateWorkspaceNotificationInput {
  recipientUserId: string;
  notificationType: WorkspaceNotificationType;
  category: string;
  entityType?: string;
  entityId?: string;
  message: string;
}
