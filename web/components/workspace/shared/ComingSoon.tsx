import { WORKSPACE_ROUTE_PREFIX } from "@/lib/workspace/shared/constants";

import EmptyState from "./EmptyState";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation.
// Rendered by every left-navigation module that has no implemented screen
// yet (Scope item 3: "Items without implemented pages may display 'Coming
// Soon'"; Product ratification, Vivek, 17 September 2026: "Selecting them
// shall display the approved 'Coming Soon' placeholder"). Each module's
// route (see app/workspace/(dashboard)/**) renders this inside the
// permanent Workspace shell, so navigating to an unbuilt module still
// looks and feels like part of the Workspace, not a dead link or a 404.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-18 Mandatory, per EBC-R1.3-WS11-011B §14). Copy now matches the
// approved Workspace Empty State Library §3.3, and a "Back to Dashboard"
// action is added via EmptyState's new optional `action` prop (an
// already-existing route, not a new one) — the six call sites and the
// `moduleName` prop are unchanged.
type ComingSoonProps = { moduleName: string };

export default function ComingSoon({ moduleName }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-xl py-12">
      <EmptyState
        icon={
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"
            />
          </svg>
        }
        title="Coming Soon."
        description={`${moduleName} isn't built yet. We'll let you know the moment it's ready.`}
        action={{ label: "Back to Dashboard", href: WORKSPACE_ROUTE_PREFIX }}
      />
    </div>
  );
}
