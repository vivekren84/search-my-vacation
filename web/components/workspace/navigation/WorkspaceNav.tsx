"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  WORKSPACE_DESTINATION_INTELLIGENCE_PATH,
  WORKSPACE_ITINERARY_STUDIO_PATH,
  WORKSPACE_JOURNEY_PLANNING_PATH,
  WORKSPACE_JOURNEY_WORKSPACE_PATH,
  WORKSPACE_ROUTE_PREFIX,
  WORKSPACE_TRAVELLER_HUB_PATH,
  WORKSPACE_VENDOR_MANAGEMENT_PATH,
} from "@/lib/workspace/shared/constants";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 3 (Left
// Navigation). Product ratification (Vivek, Product Owner, 17 September
// 2026) supersedes this EBC's own originally drafted flat list and instead
// ratifies the already-approved Workspace Navigation Model / Information
// Architecture structure (Sophie/Arjun): Dashboard, then a grouped
// "Operational" section and a grouped "Knowledge" section. Settings is
// deliberately not here — it lives in the header's user dropdown
// (WorkspaceUserMenu), per the same ratification. Notifications and Tasks
// are deliberately not here either: Notifications is the header bell only,
// and Tasks is contextual to its owning record (Journey, Vendor,
// Traveller), not a standalone module — both per the same ratification.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-09 Mandatory / WS11A-10 Recommended, per EBC-R1.3-WS11-011B §14).
// WORKSPACE_NAV_GROUPS, its items, their order and the `isActive` logic
// below are unchanged — only the active/hover/default state palette moves
// from a flat, hard-coded Tailwind tint to the SMV semantic token set, with
// a leading amber accent bar marking the active item.
//
// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation. Added the
// optional `onNavigate` prop so this exact same component — same data,
// same isActive logic, same markup — can be reused unchanged inside
// WorkspaceMobileNav.tsx's slide-in drawer (WS11A-12's recommendation: "a
// presentation change, not a new navigation model"). It closes the drawer
// after a link is clicked; the desktop sidebar usage passes nothing and
// behaves exactly as before.
type WorkspaceNavItem = { label: string; href: string };
type WorkspaceNavGroup = { heading?: string; items: WorkspaceNavItem[] };

const WORKSPACE_NAV_GROUPS: WorkspaceNavGroup[] = [
  { items: [{ label: "Dashboard", href: WORKSPACE_ROUTE_PREFIX }] },
  {
    heading: "Operational",
    items: [
      { label: "Journey Planning", href: WORKSPACE_JOURNEY_PLANNING_PATH },
      { label: "Journey Workspace", href: WORKSPACE_JOURNEY_WORKSPACE_PATH },
    ],
  },
  {
    heading: "Knowledge",
    items: [
      { label: "Traveller Hub", href: WORKSPACE_TRAVELLER_HUB_PATH },
      { label: "Itinerary Studio", href: WORKSPACE_ITINERARY_STUDIO_PATH },
      { label: "Vendor Management", href: WORKSPACE_VENDOR_MANAGEMENT_PATH },
      { label: "Destination Intelligence", href: WORKSPACE_DESTINATION_INTELLIGENCE_PATH },
    ],
  },
];

export default function WorkspaceNav({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace primary navigation" className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
      {WORKSPACE_NAV_GROUPS.map((group, index) => (
        <div key={group.heading ?? `group-${index}`}>
          {group.heading ? (
            <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-espresso)]/40">
              {group.heading}
            </p>
          ) : null}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={`relative block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-[linear-gradient(135deg,rgb(245_149_28_/_14%),rgb(40_3_54_/_6%))] text-[var(--color-primary)]"
                        : "text-[var(--color-espresso)]/60 hover:bg-[rgb(245_149_28_/_7%)] hover:text-[var(--color-espresso)]"
                    }`}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-0 top-1 w-[3px] rounded-full bg-[var(--color-amber)]"
                      />
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
