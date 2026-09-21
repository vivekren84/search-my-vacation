// EBC-R1.3-WS12-007 Phase 7: Integration — Record Detail (JP-02/04/05/06/07/13).

import JourneyPlanningRecordDetailView from "@/components/workspace/journey-planning/JourneyPlanningRecordDetailView";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

type PageParams = { params: Promise<{ recordId: string }> };

export default async function JourneyPlanningRecordDetailPage({ params }: PageParams) {
  const user = await requireWorkspaceUser();
  const { recordId } = await params;

  return <JourneyPlanningRecordDetailView recordId={recordId} currentUserId={user.id} />;
}
