// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — notification repository.
// Same SDK-query-builder-against-cookie-session-client pattern as
// shared/audit and shared/auth; RLS (workspace_notifications_*) governs
// access, not a service-role bypass.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateWorkspaceNotificationInput, WorkspaceNotification } from "./types";

export class WorkspaceNotificationRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace notification repository operation failed");
    this.name = "WorkspaceNotificationRepositoryError";
  }
}

function mapRow(row: Record<string, unknown>): WorkspaceNotification {
  return {
    id: row.id as string,
    recipientUserId: row.recipient_user_id as string,
    notificationType: row.notification_type as WorkspaceNotification["notificationType"],
    category: row.category as string,
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    message: row.message as string,
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
    readAt: (row.read_at as string | null) ?? null,
    // EBC-R1.3-WS13-005 Phase 0 (M03). `?? null` keeps this safe against a
    // database where M03 is not yet applied (columns absent from `*`).
    conditionKey: (row.condition_key as string | null) ?? null,
    resolvedAt: (row.resolved_at as string | null) ?? null,
    resolution: (row.resolution as WorkspaceNotification["resolution"]) ?? null,
  };
}

export async function insertWorkspaceNotification(
  supabase: SupabaseClient,
  input: CreateWorkspaceNotificationInput,
): Promise<void> {
  const { error } = await supabase.from("workspace_notifications").insert({
    recipient_user_id: input.recipientUserId,
    notification_type: input.notificationType,
    category: input.category,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    message: input.message,
  });

  if (error) {
    throw new WorkspaceNotificationRepositoryError("workspace_notification_insert_failed");
  }
}

export async function listWorkspaceNotificationsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceNotification[]> {
  const { data, error } = await supabase
    .from("workspace_notifications")
    .select("*")
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new WorkspaceNotificationRepositoryError("workspace_notification_list_failed");
  }

  return (data ?? []).map(mapRow);
}

export async function markWorkspaceNotificationRead(
  supabase: SupabaseClient,
  notificationId: string,
): Promise<void> {
  const { error } = await supabase
    .from("workspace_notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) {
    throw new WorkspaceNotificationRepositoryError("workspace_notification_mark_read_failed");
  }
}
