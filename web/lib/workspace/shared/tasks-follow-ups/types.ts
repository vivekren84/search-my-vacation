// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — task/follow-up types.
// Must stay in lockstep with the CHECK constraint in
// supabase/migrations/20260921060200_workspace_shared_tasks_and_follow_ups.sql.

export type WorkspaceTaskStatus = "open" | "completed" | "cancelled";

export interface WorkspaceTask {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  status: WorkspaceTaskStatus;
  assignedToUserId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateWorkspaceTaskInput {
  entityType: string;
  entityId: string;
  title: string;
  description?: string;
  dueAt?: string;
  assignedToUserId?: string;
  createdByUserId: string;
}
