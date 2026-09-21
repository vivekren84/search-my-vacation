// EBC-R1.3-WS12-007 Phase 5: Journey Planning UI — shared label maps.
// Kept as plain data, not a component, so every screen (Queue, Detail,
// Decision) renders the same stage/outcome copy from one source.

import type { JourneyPlanningOutcome, JourneyPlanningStage } from "@/lib/workspace/journey-planning/types";

export const STAGE_LABELS: Record<JourneyPlanningStage, string> = {
  lead_created: "Lead Created",
  discovery: "Discovery",
  planning: "Planning",
  proposal_shared: "Proposal Shared",
  revision: "Revision",
  decision: "Decision",
  closed: "Closed",
};

export const OUTCOME_LABELS: Record<JourneyPlanningOutcome, string> = {
  confirmed: "Confirmed",
  lost: "Lost",
  archived: "Archived",
};
