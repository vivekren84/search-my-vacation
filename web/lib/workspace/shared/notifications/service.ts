// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — notification service.
// Thin orchestration layer, mirroring shared/audit's service shape.

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  insertWorkspaceNotification,
  listWorkspaceNotificationsForUser,
  markWorkspaceNotificationRead,
} from "./repository";
import type { CreateWorkspaceNotificationInput, WorkspaceNotification } from "./types";

export async function notifyWorkspaceUser(
  supabase: SupabaseClient,
  input: CreateWorkspaceNotificationInput,
): Promise<void> {
  await insertWorkspaceNotification(supabase, input);
}

export async function getWorkspaceNotificationsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceNotification[]> {
  return listWorkspaceNotificationsForUser(supabase, userId);
}

export async function markWorkspaceNotificationAsRead(
  supabase: SupabaseClient,
  notificationId: string,
): Promise<void> {
  await markWorkspaceNotificationRead(supabase, notificationId);
}
