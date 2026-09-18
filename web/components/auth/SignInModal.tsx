"use client";

// EBC-R1.3-WS11-009: Unified Authentication Entry Experience.
// The lightweight modal Section 5 asked for: Email, Password, Forgot
// Password, Sign In. No Traveller registration, no social login, no OTP —
// all explicitly out of scope (Section 9).
//
// Modal mechanics (native <dialog>, showModal(), scroll lock, Escape,
// backdrop-click-to-close, focus restored to the trigger on close) copy
// components/destinations/DestinationItineraryModal.tsx's established
// pattern, rather than introducing a second modal implementation.
//
// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement.
//   - Section 4 (Modal Visual Design / Behaviour / Loading Experience):
//     restyled via SignInModal.module.css against the SMV brand tokens
//     already defined in app/globals.css, added a subtle open/close
//     transition (see the module's [data-state="closing"] handling below),
//     a small inline spinner while a request is in flight, and disabled
//     buttons for the duration of that request (duplicate-submission
//     guard).
//   - Section 5 (Forgot Password): a real, in-modal "enter your email /
//     send reset link" step using Supabase Auth's native
//     resetPasswordForEmail(). The remaining two steps (open the emailed
//     link, choose a new password) happen outside this modal, handled by
//     app/workspace/reset-password/page.tsx.
//
// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation. The actual
// sign-in experience (fields, forgot-password flow, copy, Supabase calls)
// has moved into the shared WorkspaceSignInPanel component, so this file
// now owns only the <dialog> chrome: open/close mechanics, scroll lock,
// Escape handling, backdrop-click-to-close and the exit-animation timing.
// app/workspace/sign-in/page.tsx renders the same WorkspaceSignInPanel
// inside its own (non-dialog) chrome, so a person redirected there from a
// protected route sees an identical authentication experience to opening
// this modal from the Homepage header (Remediation Item 2/3).
import { useCallback, useEffect, useRef, useState } from "react";

import WorkspaceSignInPanel from "./WorkspaceSignInPanel";

import styles from "./SignInModal.module.css";

type SignInModalProps = {
  onClose: () => void;
  onSuccess: () => void;
  triggerElement: HTMLElement | null;
};

// Matches the module's [data-state="closing"] exit animation duration, so
// the actual close()/unmount happens exactly when the animation finishes
// rather than being cut off or leaving a visible gap.
const CLOSE_ANIMATION_MS = 160;

export default function SignInModal({ onClose, onSuccess, triggerElement }: SignInModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = "workspace-sign-in-modal-heading";

  const [isClosing, setIsClosing] = useState(false);
  // Guards against a double-close (e.g. two rapid Escape presses) scheduling
  // onClose twice. A ref rather than the isClosing state itself, so the
  // check always reads the current value without requestClose needing
  // isClosing as a dependency.
  const closingRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const body = document.body;
    const root = document.documentElement;
    const scrollPosition = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const previousBodyStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      root.style.overflow = previousRootOverflow;
      window.requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
        triggerElement?.focus({ preventScroll: true });
      });
    };
  }, [triggerElement]);

  // Plays the exit animation before actually asking the parent to unmount
  // this component (which is what onClose ultimately does — see
  // AuthEntry.tsx). Guarded so Escape, backdrop-click and the close button
  // can't each start a second overlapping timer. useCallback (rather than a
  // plain function plus an eslint-disable on the effect below) keeps this
  // stable across renders so the Escape-key effect's dependency array is
  // both correct and complete.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      requestClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [requestClose]);

  return (
    <dialog
      ref={dialogRef}
      id="workspace-sign-in-modal"
      className={styles.dialog}
      data-state={isClosing ? "closing" : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className={styles.surface}>
        <WorkspaceSignInPanel headingId={headingId} onSuccess={onSuccess} onRequestClose={requestClose} />
      </div>
    </dialog>
  );
}
