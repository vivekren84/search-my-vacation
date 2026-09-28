// EBC-R1.3-WS13-005 Phase 0 (WS13-004 §8.2, AD-WS13-006): GET
// /api/workspace/journey-workspace/reference-data — the configured
// reference lists (active entries only) for pickers. First consumer: the
// Journey Planning Service Category field (CM-07, UX Rev 4a §36.2).
// Read-only; configuration is edited as data (no UI, DEP-12).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { getWorkspaceSettings } from "@/lib/workspace/settings/service";
import { REFERENCE_LIST_KEYS, type ReferenceLists } from "@/lib/workspace/settings/types";

export const runtime = "nodejs";

export async function GET() {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  try {
    const settings = await getWorkspaceSettings(auth.supabase);
    const referenceLists = Object.fromEntries(
      REFERENCE_LIST_KEYS.map((key) => [key, settings.referenceLists[key].filter((item) => item.active)]),
    ) as ReferenceLists;
    return jsonResponse({ ok: true, referenceLists }, 200);
  } catch {
    console.error("Workspace reference data fetch failed.", { operation: "workspace_reference_data" });
    return jsonResponse({ ok: false, message: "Could not load reference data." }, 500);
  }
}
