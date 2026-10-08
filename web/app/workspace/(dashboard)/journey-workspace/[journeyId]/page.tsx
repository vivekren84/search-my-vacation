// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): one Journey — JW-02
// header and Overview, JW-03 Itinerary and JW-08 History via `?tab=`
// (UX Rev 4a §8; EBC-R1.3-WS13-020B C-01). requireWorkspaceUser() is
// called here, on top of the (dashboard)/layout.tsx call, because the
// client view needs the signed-in user's id and role (same pattern as the
// Journey Planning record page). The view loads the Journey through the
// Milestone A API, which re-checks access for every request.

import { Suspense } from "react";

import JourneyWorkspaceView from "@/components/workspace/journey-workspace/journey/JourneyWorkspaceView";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

export default async function WorkspaceJourneyPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const user = await requireWorkspaceUser();
  const { journeyId } = await params;

  return (
    <Suspense fallback={null}>
      <JourneyWorkspaceView journeyId={journeyId} viewer={{ id: user.id, role: user.role }} />
    </Suspense>
  );
}
