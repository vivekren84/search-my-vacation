import type { ReactNode } from "react";

import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation.
// Route group `(dashboard)` adds no URL segment (still /workspace,
// /workspace/journey-planning, ...); it exists purely to give every
// authenticated Workspace screen the shared WorkspaceShell, while
// /workspace/sign-in and /workspace/reset-password stay outside it under
// the existing bare top-level app/workspace/layout.tsx (EBC-R1.3-WS11-007),
// which must not enforce authentication itself to avoid the sign-in
// redirect loop already documented there. This is a framework-native
// mechanism with zero URL impact, not a new architectural pattern — it
// extends that same existing "sign-in/reset-password need to be reachable
// without a session" reasoning to the rest of /workspace/**, rather than
// duplicating shell-rendering code into every page under this group.
//
// requireWorkspaceUser() is re-checked here (in addition to the proxy) per
// this codebase's established convention (see rbac/guard.ts's own comment:
// "every protected entry point re-checks for itself").
export default async function WorkspaceDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireWorkspaceUser();

  return (
    <WorkspaceShell displayName={user.displayName} role={user.role}>
      {children}
    </WorkspaceShell>
  );
}
