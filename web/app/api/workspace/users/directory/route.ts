// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/users/directory — the Workspace User directory
// (AD-WS13-007; public.workspace_user_directory()): display names for owner
// and actor labels, and `isActive` so pickers offer active users only
// (assign/reassign, adoption owner). No email addresses are returned.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { getWorkspaceUserDirectory } from "@/lib/workspace/shared/users/service";

export const runtime = "nodejs";

export async function GET() {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  try {
    const users = await getWorkspaceUserDirectory(auth.supabase);
    return jsonResponse({ ok: true, users }, 200);
  } catch {
    console.error("Workspace user directory fetch failed.", { operation: "workspace_user_directory" });
    return jsonResponse({ ok: false, message: "Could not load the Workspace users." }, 500);
  }
}
