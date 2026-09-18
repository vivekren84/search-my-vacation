import type { ReactNode } from "react";

// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation.
// - WS11A-01 / WS11A-03 (Mandatory, per EBC-R1.3-WS11-011B §14): border,
//   shadow, radius and text colours now consume the SMV semantic tokens
//   (--color-border-warm added to app/globals.css per that review's §6.2)
//   instead of hard-coded Tailwind defaults.
// - WS11A-02 (Mandatory): the value is now set in the editorial serif,
//   matching WelcomeSection's existing heading treatment.
// - WS11A-05 (Recommended): an optional `icon` prop, following the exact
//   additive pattern already used for EmptyState (Architecture Review
//   §5.1) — existing callers that omit it render exactly as before.
// - WS11A-16 (Recommended, purely decorative): a subtle corner accent.
type KpiCardProps = { label: string; value: number; icon?: ReactNode };

export default function KpiCard({ label, value, icon }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-warm)] bg-white px-5 py-4 shadow-[var(--shadow-sm)]">
      <span aria-hidden="true" className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[var(--color-amber)]/8" />
      {icon ? (
        <div className="relative mb-2 grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary)]/7 text-[var(--color-primary)]">
          {icon}
        </div>
      ) : null}
      <p className="relative text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-espresso)]/40">{label}</p>
      <p className="relative mt-2 font-serif text-3xl text-[var(--color-espresso)]">{value}</p>
    </div>
  );
}
