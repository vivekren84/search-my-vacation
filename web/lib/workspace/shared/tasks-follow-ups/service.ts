// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — task/follow-up service.

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  insertWorkspaceTask,
  listWorkspaceTasksForEntity,
  updateWorkspaceTaskStatus,
} from "./repository";
import type { CreateWorkspaceTaskInput, WorkspaceTask, WorkspaceTaskStatus } from "./types";

export async function createWorkspaceTask(
  supabase: SupabaseClient,
  input: CreateWorkspaceTaskInput,
): Promise<WorkspaceTask> {
  return insertWorkspaceTask(supabase, input);
}

export async function getWorkspaceTasksForEntity(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
): Promise<WorkspaceTask[]> {
  return listWorkspaceTasksForEntity(supabase, entityType, entityId);
}

export async function setWorkspaceTaskStatus(
  supabase: SupabaseClient,
  taskId: string,
  status: WorkspaceTaskStatus,
): Promise<void> {
  await updateWorkspaceTaskStatus(supabase, taskId, status);
}
