// EBC-R1.3-WS12-007 Phase 7: Integration — Create screen (JP-03).

import NewJourneyPlanningRecordForm from "@/components/workspace/journey-planning/NewJourneyPlanningRecordForm";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

export default async function NewJourneyPlanningRecordPage() {
  await requireWorkspaceUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)]">
        New Journey Planning Record
      </h1>
      <NewJourneyPlanningRecordForm />
    </div>
  );
}
