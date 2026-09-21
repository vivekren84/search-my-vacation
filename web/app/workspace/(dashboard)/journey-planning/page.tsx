// EBC-R1.3-WS12-007 Phase 7: Integration.
// Replaces the ComingSoon placeholder (EBC-R1.3-WS11-011) with the real
// Journey Planning Queue (JP-01). requireWorkspaceUser() is called again
// here, on top of the parent (dashboard)/layout.tsx's own call, because
// this page needs the resolved user's id to pass to the client-side Queue
// view (same justification already used by the Dashboard page for
// displayName).

import JourneyPlanningQueueView from "@/components/workspace/journey-planning/JourneyPlanningQueueView";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

export default async function WorkspaceJourneyPlanningPage() {
  const user = await requireWorkspaceUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)]">Journey Planning</h1>
      <JourneyPlanningQueueView currentUserId={user.id} />
    </div>
  );
}
