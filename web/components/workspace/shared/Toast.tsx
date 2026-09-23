"use client";

// EBC-R1.3-WS12-010: QA Defect Resolution — Defect D4 (Poor Error
// Handling). Keerthi's WS12-009 QA cycle found action failures surfaced
// only via `window.alert()`, an ungraceful, blocking pattern inconsistent
// with the rest of the Workspace's inline, on-brand error treatment (e.g.
// the reset-password form's inline error banner). This is the
// Workspace-standard toast/notification pattern referenced by the EBC:
// a small, shared, dismissing-itself banner stack, placed under
// components/workspace/shared/ (not journey-planning/) so any future
// Workspace module can reuse it rather than reinventing its own —
// consistent with this module's established "shared/ for anything not
// module-specific" convention (shared/audit, shared/notifications, etc.).
//
// Deliberately NOT the same thing as workspace_notifications (the
// persistent, database-backed in-app notification store from Phase 1):
// this is an ephemeral, client-only UI toast for surfacing the result of
// the action the user just took, in the same tab, right now.
//
// EBC-R1.3-WS12-013 Product Owner smoke-test correction (Workspace-wide
// notification-standard fix, not Journey-Planning-specific — this file is
// this Workspace's ONLY toast implementation, confirmed by a repository
// search before this change; every future consumer inherits the fix).
// Two rounds of feedback, both addressed here:
//
// Round 1 — the stack originally sat at `top-4`, inside
// WorkspaceHeader.tsx's own 64px (`h-16`) header band, and at a higher
// z-index (50) than the header's `z-30`, so it rendered on top of and
// obscured the Workspace logo/title. First fix moved it to `top-20`
// (below the header) at `z-40`.
//
// Round 2 (this revision) — even correctly positioned below the header,
// a top-anchored toast still felt disconnected from the action that
// triggered it: Workspace Detail screens are long and scrollable (e.g.
// Trip Basics' own "Save" button, WS12-013), so the confirmation and the
// click that caused it were often at opposite ends of the viewport. Moved
// to `fixed bottom-6 right-4`/`sm:right-6` — bottom-right, near where a
// user's attention and cursor already are after acting lower on a page,
// and structurally independent of WorkspaceHeader.tsx's height forever
// (no future header change can ever reintroduce the Round 1 overlap,
// since this no longer measures itself against the header at all). `z-40`
// is unchanged — WorkspaceUserMenu.tsx's dropdown tier, above ordinary
// content, below the reserved modal/drawer tier (z-50). No footer exists
// in WorkspaceShell.tsx to collide with at the bottom edge.
//
// Presentation (Round 1, unchanged since): toasts are right-aligned and
// shrink to their content (`w-fit`, capped at `max-w-sm`) rather than
// spanning the full available width.
//
// Contrast (Round 1, unchanged since): the "success" variant uses this
// design system's dedicated `--color-success` token (globals.css),
// mirroring the "error" variant's own existing border/tint/text treatment
// exactly (same opacity/mix values), rather than the low-contrast
// amber/CTA tint it originally reused.
//
// Auto-dismiss timing (6s) and click-to-dismiss behaviour are unchanged
// throughout both rounds.

import { useCallback, useRef, useState } from "react";

export type ToastVariant = "error" | "success" | "info";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  message: string;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  error: "border-[var(--color-error)]/30 bg-[color-mix(in_srgb,var(--color-error)_10%,white)] text-[var(--color-error)]",
  success: "border-[var(--color-success)]/30 bg-[color-mix(in_srgb,var(--color-success)_10%,white)] text-[var(--color-success)]",
  info: "border-[var(--color-border-warm)] bg-white text-[var(--color-espresso)]",
};

// Local, per-component toast state — no shared/global store, since a
// toast is scoped to the screen the action happened on. Auto-dismisses
// after 6 seconds; also dismissible by click, since a validation message
// someone needs to read shouldn't vanish before they finish reading it.
export function useWorkspaceToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant = "error") => {
      const id = `toast-${nextId.current++}`;
      setToasts((current) => [...current, { id, variant, message }]);
      window.setTimeout(() => dismissToast(id), 6000);
    },
    [dismissToast],
  );

  return { toasts, pushToast, dismissToast };
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2 sm:right-6">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={`w-fit max-w-sm rounded-[var(--radius-lg)] border px-4 py-3 text-left text-sm shadow-[0_12px_32px_rgb(42_33_28_/_12%)] ${VARIANT_STYLES[toast.variant]}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
