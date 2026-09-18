import type { ReactNode } from "react";
import Link from "next/link";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation.
// Shared empty-state block, reused by every "nothing here yet" moment on
// the Dashboard (Recent Activity, Upcoming Tasks) and by ComingSoon, so the
// approved plain-language tone (Scope item 10: "avoid technical language")
// lives in one place rather than being retyped per screen.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-17 Mandatory, per EBC-R1.3-WS11-011B §5.1/§14). Two new, optional,
// backward-compatible props (`icon`, `action`) — every existing caller that
// omits them continues to render exactly as before. Visual treatment moves
// from a flat dashed grey box to the SMV warm-token recipe (see
// docs/04-UX/workspace/WORKSPACE-EMPTY-STATE-LIBRARY.md §2).
type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
  action?: { label: string; href: string };
};

export default function EmptyState({ title, description, className = "", icon, action }: EmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-warm)] bg-[linear-gradient(160deg,rgb(245_149_28_/_4.5%),rgb(255_253_252_/_50%))] px-6 py-10 text-center ${className}`}
    >
      {icon ? (
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-amber)]/14 text-[var(--color-amber)]">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-semibold text-[var(--color-espresso)]">{title}</p>
      {description ? <p className="mt-1 text-sm text-[var(--color-espresso)]/60">{description}</p> : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-4 inline-block rounded-full bg-[var(--color-amber)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[#e88a16]"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
