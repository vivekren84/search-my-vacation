// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — task/follow-up types.
// Must stay in lockstep with the CHECK constraint in
// supabase/migrations/20260921060200_workspace_shared_tasks_and_follow_ups.sql.

export type WorkspaceTaskStatus = "open" | "completed" | "cancelled";

// EBC-R1.3-WS13-005 Phase 0 (M04, AD-WS13-006): a follow-up requires a
// due date (FR-JW-24 AC2), enforced by the database CHECK.
export type WorkspaceTaskKind = "task" | "follow_up";

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
  // EBC-R1.3-WS13-005 Phase 0 (M04): category code from the configured
  // task_categories list; null = Operational (every pre-WS13 task).
  category: string | null;
  kind: WorkspaceTaskKind;
}

export interface CreateWorkspaceTaskInput {
  entityType: string;
  entityId: string;
  title: string;
  description?: string;
  dueAt?: string;
  assignedToUserId?: string;
  createdByUserId: string;
  // EBC-R1.3-WS13-005 Phase 0 (M04). Optional; omitted keys are not sent,
  // so Journey Planning task creation is byte-for-byte unchanged.
  category?: string;
  kind?: WorkspaceTaskKind;
}
