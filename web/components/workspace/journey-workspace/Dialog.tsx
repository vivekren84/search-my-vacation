"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.8): modal dialog and side
// panel (drawer) for Journey Workspace (UX Rev 4a §22, §25):
// role="dialog" + aria-modal, labelled by its title, focus moves inside on
// open, Tab is trapped, Escape closes, and focus returns to the element
// that opened it. Drawers reuse the existing 200ms entrance recipe
// (.journey-passport-reveal), disabled under prefers-reduced-motion.
// The modal/drawer tier is z-50 (Toast.tsx documents the z-index tiers).

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useDialogFocus(open: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    const preferred = container?.querySelector<HTMLElement>("[data-autofocus]");
    const first = preferred ?? container?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? container)?.focus();
    return () => {
      const target = returnFocusRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open]);

  return containerRef;
}

function trapTab(event: KeyboardEvent<HTMLDivElement>, container: HTMLDivElement | null, onClose: () => void) {
  if (event.key === "Escape") {
    event.stopPropagation();
    onClose();
    return;
  }
  if (event.key !== "Tab" || !container) return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function Dialog({
  title,
  onClose,
  children,
  footer,
  description,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  description?: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const ref = useDialogFocus(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={(event) => trapTab(event, ref.current, onClose)}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-6 shadow-[var(--shadow-lg)] focus:outline-none"
      >
        <h2 id={titleId} className="font-serif text-xl text-[var(--color-espresso)]">
          {title}
        </h2>
        {description ? (
          <div id={descriptionId} className="mt-2 text-sm text-[var(--color-espresso)]/75">
            {description}
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-4">{children}</div>
        <div className="mt-6 flex flex-wrap items-start justify-end gap-3">{footer}</div>
      </div>
    </div>
  );
}

export function SidePanel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  const titleId = useId();
  const ref = useDialogFocus(true);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={(event) => trapTab(event, ref.current, onClose)}
        className="journey-passport-reveal flex h-full w-full max-w-md flex-col border-l border-[var(--color-border-warm)] bg-[var(--color-cream)] shadow-[var(--shadow-lg)] focus:outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-warm)] px-5 py-4">
          <h2 id={titleId} className="font-serif text-xl text-[var(--color-espresso)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-lg text-[var(--color-espresso)]/70 hover:bg-[rgb(245_149_28_/_10%)]"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-4">{children}</div>
        </div>
        <div className="flex flex-wrap items-start justify-end gap-3 border-t border-[var(--color-border-warm)] px-5 py-4">{footer}</div>
      </div>
    </div>
  );
}
