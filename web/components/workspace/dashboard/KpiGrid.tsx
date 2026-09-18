import type { ReactNode } from "react";

import KpiCard from "./KpiCard";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 5. Exactly
// the five named KPIs, reconfirmed unchanged by Vivek's Product ratification
// (17 September 2026). Every value is a literal 0 (Product Ratification #3:
// "display 0 rather than fabricated sample data") — none of the modules a
// real value would read from (Journey Planning, Journey Workspace, Vendor
// Management, Tasks) exists yet in Release 1.3 (Out of Scope: Database
// writes, Real data).
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-05, Recommended, per EBC-R1.3-WS11-011B §14). The five labels,
// their order, and every value are unchanged — this only adds one small
// inline-SVG icon per card, matching the inline-SVG convention already
// established in WorkspaceHeader.tsx (no icon library exists or is
// introduced — Architecture Review §9).
function ActiveJourneysIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m13-2-2-2m-9-9-2-2" />
    </svg>
  );
}
function NewLeadsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 13l9-5.5M4.5 6h15A1.5 1.5 0 0 1 21 7.5v9A1.5 1.5 0 0 1 19.5 18h-15A1.5 1.5 0 0 1 3 16.5v-9A1.5 1.5 0 0 1 4.5 6Z" />
    </svg>
  );
}
function UpcomingDeparturesIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21.75 6.75-8.735 8.735a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L19.1 4.15a1.5 1.5 0 0 1 2.652 2.6Z"
      />
    </svg>
  );
}
function PendingVendorConfirmationsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <circle cx="12" cy="12" r="8.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.5" />
    </svg>
  );
}
function TasksDueTodayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

const WORKSPACE_DASHBOARD_KPIS: ReadonlyArray<{ label: string; value: number; icon: ReactNode }> = [
  { label: "Active Journeys", value: 0, icon: <ActiveJourneysIcon /> },
  { label: "New Leads", value: 0, icon: <NewLeadsIcon /> },
  { label: "Upcoming Departures", value: 0, icon: <UpcomingDeparturesIcon /> },
  { label: "Pending Vendor Confirmations", value: 0, icon: <PendingVendorConfirmationsIcon /> },
  { label: "Tasks Due Today", value: 0, icon: <TasksDueTodayIcon /> },
];

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {WORKSPACE_DASHBOARD_KPIS.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} icon={kpi.icon} />
      ))}
    </div>
  );
}
