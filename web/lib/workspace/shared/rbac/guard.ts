// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — authorization
// helper.
// EBC-R1.3-WS11-008: extended to redirect with a `reason` query param so the
// sign-in screen can show a distinct Unauthorized message (Section 5, Error
// Handling), instead of collapsing "no session" and "no Workspace role"
// into the same silent redirect.
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
import { getWorkspaceAuthState } from "../auth/service";

export async function requireWorkspaceUser(): Promise<WorkspaceUser> {
  const state = await getWorkspaceAuthState();

  if (state.status === "unauthorized") {
    redirect(`${WORKSPACE_SIGN_IN_PATH}?reason=unauthorized`);
  }
  if (state.status === "unauthenticated") {
    redirect(WORKSPACE_SIGN_IN_PATH);
  }

  return state.user;
}
