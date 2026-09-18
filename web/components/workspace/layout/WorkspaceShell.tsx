import type { ReactNode } from "react";

import type { WorkspaceRole } from "@/lib/workspace/shared/types";
import NotificationAreaPlaceholder from "@/components/workspace/shared/NotificationAreaPlaceholder";
import WorkspaceNav from "@/components/workspace/navigation/WorkspaceNav";

import WorkspaceHeader from "./WorkspaceHeader";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 2 —
// "Permanent Workspace Shell: reusable layout with Left Navigation | Top
// Header | Main Content Area | Notification Area (placeholder). All future
// modules render inside this layout." Product Ratification #5 makes this
// component canonical: future EBCs extend it (new nav destinations, real
// notification content) rather than replacing or redesigning it.
//
// The left navigation rail is hidden below the `md` breakpoint by design —
// this EBC's own Manual Validation Checklist asks for desktop and tablet
// only, not phone width; a full mobile navigation affordance (an overlay or
// drawer) is a reasonable follow-up for a future EBC, not fabricated here.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01, WS11A-04 — see docs/04-UX/workspace/WORKSPACE-UX-REVIEW-NOTES.md
// and EBC-R1.3-WS11-011B §14). Background moves from a hard-coded Tailwind
// default grey (#F9FAFB — not part of the SMV brand system) to the SMV
// cream token, and the main content area carries a very subtle warm radial
// wash, matching the restrained treatment already used by the public
// site's `.golden-inspiration-surface` pattern. No structural change —
// same three regions, same responsive behaviour, same nav/header children.
type WorkspaceShellProps = {
  displayName: string;
  role: WorkspaceRole;
  children: ReactNode;
};

export default function WorkspaceShell({ displayName, role, children }: WorkspaceShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      <WorkspaceHeader displayName={displayName} role={role} />
      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border-warm)] bg-[var(--color-cream)]/60 md:block">
          <WorkspaceNav />
        </aside>
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_8%_0%,rgb(245_149_28_/_6%),transparent_32rem)] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <NotificationAreaPlaceholder />
      </div>
    </div>
  );
}
