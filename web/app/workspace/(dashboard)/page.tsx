import KpiGrid from "@/components/workspace/dashboard/KpiGrid";
import QuickActions from "@/components/workspace/dashboard/QuickActions";
import RecentActivityCard from "@/components/workspace/dashboard/RecentActivityCard";
import UpcomingTasksCard from "@/components/workspace/dashboard/UpcomingTasksCard";
import WelcomeSection from "@/components/workspace/dashboard/WelcomeSection";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation. Replaces the
// EBC-R1.3-WS11-007 verification placeholder that previously lived at this
// route. Every KPI is a literal 0 (Product Ratification #3) — none of the
// modules a real value would be read from (Journey Planning, Journey
// Workspace, Vendor Management, Tasks) is implemented yet in Release 1.3
// (Out of Scope: Database writes, Real data).
//
// requireWorkspaceUser() is called again here (on top of the parent
// (dashboard)/layout.tsx's own call) specifically because this page needs
// the resolved user's displayName for the Welcome Section — the layout
// cannot pass extra props down to a page in the App Router. The six
// "Coming Soon" leaf pages alongside this one do not repeat the call: they
// render no user-specific data, so the shared layout's single guard already
// covers them (disclosed in the Implementation Report).
export default async function WorkspaceDashboardPage() {
  const user = await requireWorkspaceUser();

  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection displayName={user.displayName} />
      <KpiGrid />
      <QuickActions />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivityCard />
        <UpcomingTasksCard />
      </div>
    </div>
  );
}
