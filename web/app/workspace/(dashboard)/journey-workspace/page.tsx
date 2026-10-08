// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): JW-01 Journey list.
// Replaces the ComingSoon placeholder (EBC-R1.3-WS11-011) with the Journey
// Workspace list. requireWorkspaceUser() is called again here, on top of
// the (dashboard)/layout.tsx call, because the client list view needs the
// signed-in user's id and role for the Mine / Team default and the row
// Assign / Reassign menu (same pattern as the Journey Planning page).

import { Suspense } from "react";

import JourneyListView from "@/components/workspace/journey-workspace/list/JourneyListView";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

export default async function WorkspaceJourneyWorkspacePage() {
  const user = await requireWorkspaceUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)]">Journey Workspace</h1>
      <Suspense fallback={null}>
        <JourneyListView viewer={{ id: user.id, role: user.role }} />
      </Suspense>
    </div>
  );
}
