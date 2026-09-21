// EBC-R1.3-WS12-007 Phase 1: Shared Foundation — audit trail service.
//
// Engineering decision (see WS12-007 Engineering Decision Log): audit
// writes are not best-effort/fire-and-forget. An audit entry records
// something that already happened (a claim, a stage transition, a
// conversion); if the write itself fails, the caller must know, since a
// silently-missing audit entry is exactly the compliance gap this module
// exists to prevent. Callers invoking this after a business action has
// already committed should treat a thrown error here as "the action
// succeeded but its audit trail did not," and surface that distinction to
// the user/log rather than rolling back the business action or swallowing
// the error.

import type { SupabaseClient } from "@supabase/supabase-js";

import { insertWorkspaceAuditLogEntry } from "./repository";
import type { RecordWorkspaceAuditEventInput } from "./types";

export async function recordWorkspaceAuditEvent(
  supabase: SupabaseClient,
  input: RecordWorkspaceAuditEventInput,
): Promise<void> {
  await insertWorkspaceAuditLogEntry(supabase, input);
}
