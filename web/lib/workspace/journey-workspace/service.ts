// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace service. Phase 0
// exposes only the reads Journey Planning needs at its entry point
// (WS13-004A AC-01; UX Rev 4a §36.3): the Journey created from a planning
// record, and the original Journey a replacement planning record replaces.
// Journey lifecycle services arrive in Phase 1 (RPC-backed, AD-WS13-002).

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  fetchJourneyReferenceSummaryById,
  fetchJourneyReferenceSummaryByPlanningRecordId,
} from "./repository";
import type { JourneyReferenceSummary } from "./types";

export async function getJourneyCreatedFromPlanningRecord(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<JourneyReferenceSummary | null> {
  return fetchJourneyReferenceSummaryByPlanningRecordId(supabase, journeyPlanningRecordId);
}

export async function getJourneyReferenceSummary(
  supabase: SupabaseClient,
  journeyId: string,
): Promise<JourneyReferenceSummary | null> {
  return fetchJourneyReferenceSummaryById(supabase, journeyId);
}
