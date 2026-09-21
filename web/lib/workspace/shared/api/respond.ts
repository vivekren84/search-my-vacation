// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// Small, shared Route Handler helpers so every Workspace API route
// authenticates and responds the same way, rather than each of the eight
// Journey Planning routes reimplementing this. Placed under shared/, not
// journey-planning/, because nothing here is Journey-Planning-specific —
// any future Workspace module's API routes can reuse it (Reuse Before
// Build).
//
// Unlike getWorkspaceAuthState()'s existing caller
// (shared/rbac/guard.ts's requireWorkspaceUser(), used by Server
// Components/Actions, which redirects on failure), a Route Handler must
// return a JSON response instead of calling next/navigation's redirect(),
// so this helper wraps the same underlying state function without
// redirecting.

import { createWorkspaceSupabaseServerClient } from "../supabase/server";
import { getWorkspaceAuthState } from "../auth/service";
import type { WorkspaceUser } from "../types";

export function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export type WorkspaceApiAuthResult =
  | { ok: true; user: WorkspaceUser; supabase: Awaited<ReturnType<typeof createWorkspaceSupabaseServerClient>> }
  | { ok: false; response: Response };

export async function authenticateWorkspaceApiRequest(): Promise<WorkspaceApiAuthResult> {
  const supabase = await createWorkspaceSupabaseServerClient();
  const state = await getWorkspaceAuthState();

  if (state.status === "unauthenticated") {
    return { ok: false, response: jsonResponse({ ok: false, message: "Not signed in." }, 401) };
  }
  if (state.status === "unauthorized") {
    return { ok: false, response: jsonResponse({ ok: false, message: "Not provisioned as Workspace staff." }, 403) };
  }

  return { ok: true, user: state.user, supabase };
}
