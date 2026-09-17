import type { ReactNode } from "react";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Foundation-only shell. The approved Primary Navigation Rail and Header Bar
// (Solution Architecture) have not been wireframed by Sophie yet (FCR-022) —
// this layout intentionally invents no navigation chrome and adds nothing
// beyond a plain wrapper, per Project Instructions §15 (UX Governance:
// "shall not... invent new layouts"). It deliberately does not enforce
// authentication itself (see app/workspace/page.tsx) so that
// /workspace/sign-in, which is also under this layout, is not caught in a
// redirect loop.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
