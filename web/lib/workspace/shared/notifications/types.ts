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
}

export interface CreateWorkspaceNotificationInput {
  recipientUserId: string;
  notificationType: WorkspaceNotificationType;
  category: string;
  entityType?: string;
  entityId?: string;
  message: string;
}
