"use client";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Client Component-callable Workspace auth actions.

import { createWorkspaceSupabaseBrowserClient } from "../supabase/browser";
import { validateWorkspaceSignInCredentials } from "./validation";

export class WorkspaceSignInError extends Error {
  constructor(readonly code: string) {
    super("Workspace sign-in failed");
    this.name = "WorkspaceSignInError";
  }
}

export async function signInWorkspaceUserWithPassword(email: string, password: string): Promise<void> {
  const credentials = validateWorkspaceSignInCredentials(email, password);
  const supabase = createWorkspaceSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw new WorkspaceSignInError(error.message);
  }
}
