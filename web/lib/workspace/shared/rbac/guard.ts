// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — authorization
// helper.
//
// Call at the top of every protected Server Component, Server Action or
// Route Handler. Proxy/middleware (see ../supabase/session.ts) already
// redirects unauthenticated /workspace/** requests, but Next.js's own
// guidance for this framework version is not to rely on that alone — a
// routing change can silently remove that coverage — so every protected
// entry point re-checks for itself.

import { redirect } from "next/navigation";

import { WORKSPACE_SIGN_IN_PATH } from "../constants";
import type { WorkspaceUser } from "../types";
import { getCurrentWorkspaceUser } from "../auth/service";

export async function requireWorkspaceUser(): Promise<WorkspaceUser> {
  const user = await getCurrentWorkspaceUser();
  if (!user) {
    redirect(WORKSPACE_SIGN_IN_PATH);
  }
  return user;
}
