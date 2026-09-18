// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Shared Workspace types. Framework-level only — no module-specific business
// entities (Section 8.9 of this EBC).

export type WorkspaceRole = "administrator" | "privilege_user";

export const WORKSPACE_ROLES: readonly WorkspaceRole[] = ["administrator", "privilege_user"];

export interface WorkspaceUser {
  id: string;
  email: string | null;
  role: WorkspaceRole;
  // EBC-R1.3-WS11-011: Workspace Dashboard Foundation. The Dashboard's
  // Welcome Section (Scope item 6) needs a display name, and
  // deriveWorkspaceDisplayName() (auth/displayName.ts) already computes
  // exactly this from Supabase Auth's user_metadata for the public
  // header's client-side hook (useWorkspaceAuthUser). Adding it here lets
  // getWorkspaceAuthState() (the Server Component-side source of truth)
  // reuse that same function rather than a Server Component inventing its
  // own copy (Project Instructions §18 — no duplicate logic).
  displayName: string;
}

export interface WorkspaceSession {
  user: WorkspaceUser;
}
