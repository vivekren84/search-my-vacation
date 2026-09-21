// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — task/follow-up repository.
// Same SDK-query-builder-against-cookie-session-client pattern as the rest
// of shared/*; RLS (workspace_tasks_*) governs access.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateWorkspaceTaskInput, WorkspaceTask, WorkspaceTaskStatus } from "./types";

export class WorkspaceTaskRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace task repository operation failed");
    this.name = "WorkspaceTaskRepositoryError";
  }
}

function mapRow(row: Record<string, unknown>): WorkspaceTask {
  return {
    id: row.id as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    dueAt: (row.due_at as string | null) ?? null,
    status: row.status as WorkspaceTaskStatus,
    assignedToUserId: (row.assigned_to_user_id as string | null) ?? null,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    completedAt: (row.completed_at as string | null) ?? null,
  };
}

export async function insertWorkspaceTask(
  supabase: SupabaseClient,
  input: CreateWorkspaceTaskInput,
): Promise<WorkspaceTask> {
  const { data, error } = await supabase
    .from("workspace_tasks")
    .insert({
      entity_type: input.entityType,
      entity_id: input.entityId,
      title: input.title,
      description: input.description ?? null,
      due_at: input.dueAt ?? null,
      assigned_to_user_id: input.assignedToUserId ?? null,
      created_by_user_id: input.createdByUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new WorkspaceTaskRepositoryError("workspace_task_insert_failed");
  }

  return mapRow(data);
}

export async function listWorkspaceTasksForEntity(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
): Promise<WorkspaceTask[]> {
  const { data, error } = await supabase
    .from("workspace_tasks")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("due_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new WorkspaceTaskRepositoryError("workspace_task_list_failed");
  }

  return (data ?? []).map(mapRow);
}

export async function updateWorkspaceTaskStatus(
  supabase: SupabaseClient,
  taskId: string,
  status: WorkspaceTaskStatus,
): Promise<void> {
  const { error } = await supabase
    .from("workspace_tasks")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  if (error) {
    throw new WorkspaceTaskRepositoryError("workspace_task_update_status_failed");
  }
}
