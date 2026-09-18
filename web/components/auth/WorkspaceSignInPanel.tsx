"use client";

// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation, Remediation
// Item 2 (Workspace Sign-In Page) and Item 3 (Authentication Flow
// Consistency).
//
// Extracted from SignInModal.tsx's previously-inline three-view
// (sign-in / forgot-password / forgot-password-sent) content so the
// Homepage Sign-In modal and the dedicated /workspace/sign-in page render
// this exact same markup, styling and state machine. Product ratification
// (this EBC): "The user shall never know whether authentication originated
// from Homepage Login or Protected Route Redirect." Sharing one component
// for the actual sign-in experience is what makes that guaranteed rather
// than merely styled to look similar — there is only one implementation to
// keep in sync going forward.
//
// SignInModal.tsx wraps this in <dialog> chrome (open/close mechanics,
// backdrop, exit animation) and passes onRequestClose so a close button is
// shown. app/workspace/sign-in/page.tsx wraps it in a plain full-page card
// with no onRequestClose (there is nothing to close on a dedicated page)
// and, when arriving via a redirectTo/reason bounce, passes topBanner for
// the "unauthorized"/"expired" notice — a state the modal itself never has
// a reason to show, since opening it from the header is never the result
// of a redirected request. Both consumers style against the same
// SignInModal.module.css classes, so a change to one visual detail here
// updates both surfaces identically.
import { useState, type FormEvent } from "react";

import {
  describeWorkspacePasswordResetError,
  describeWorkspaceSignInError,
  requestWorkspacePasswordReset,
  signInWorkspaceUserWithPassword,
} from "@/lib/workspace/shared/auth/client";
import { WORKSPACE_RESET_PASSWORD_PATH } from "@/lib/workspace/shared/constants";

import styles from "./SignInModal.module.css";

type WorkspaceSignInPanelProps = {
  /** id applied to the view heading; the caller's dialog/page wires its own aria-labelledby to this. */
  headingId: string;
  onSuccess: () => void;
  /** Renders a close button when provided (modal use only). Omit for a full page with nothing to close. */
  onRequestClose?: () => void;
  /** Page-only informational banner (e.g. redirectTo's reason=unauthorized|expired). Never used by the modal. */
  topBanner?: string | null;
};

type PanelView = "sign-in" | "forgot-password" | "forgot-password-sent";

export default function WorkspaceSignInPanel({
  headingId,
  onSuccess,
  onRequestClose,
  topBanner = null,
}: WorkspaceSignInPanelProps) {
  const [view, setView] = useState<PanelView>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWorkspaceUserWithPassword(email, password);
      onSuccess();
    } catch (err) {
      setError(describeWorkspaceSignInError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const redirectTo = `${window.location.origin}${WORKSPACE_RESET_PASSWORD_PATH}`;
      await requestWorkspacePasswordReset(resetEmail, redirectTo);
      setView("forgot-password-sent");
    } catch (err) {
      setError(describeWorkspacePasswordResetError(err));
    } finally {
      setSubmitting(false);
    }
  }

  function switchToForgotPassword() {
    setError(null);
    setResetEmail(email);
    setView("forgot-password");
  }

  function switchToSignIn() {
    setError(null);
    setView("sign-in");
  }

  const heading =
    view === "sign-in" ? "Sign In" : view === "forgot-password" ? "Reset your password" : "Check your email";

  return (
    <>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Search My Vacation — Workspace</p>
          <h2 id={headingId} className={styles.title}>
            {heading}
          </h2>
        </div>
        {onRequestClose ? (
          <button type="button" onClick={onRequestClose} aria-label="Close" className={styles.closeButton}>
            <span aria-hidden="true" style={{ fontSize: "1.35rem", lineHeight: 1 }}>
              ×
            </span>
          </button>
        ) : null}
      </div>

      <div className={styles.body}>
        {topBanner ? <p className={styles.noticeBanner}>{topBanner}</p> : null}

        {view === "sign-in" ? (
          <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
            <label className={styles.field}>
              Email
              <input
                type="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </label>
            <label className={styles.field}>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </label>

            <button type="button" onClick={switchToForgotPassword} className={styles.forgotLink}>
              Forgot your password?
            </button>

            {error ? <p className={styles.errorBanner}>{error}</p> : null}

            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : null}

        {view === "forgot-password" ? (
          <form onSubmit={handleResetRequestSubmit} className="flex flex-col gap-4">
            <p className={styles.helperText}>
              Enter the email address on your Workspace account and we&rsquo;ll send you a link to choose a new
              password.
            </p>
            <label className={styles.field}>
              Email
              <input
                type="email"
                autoFocus
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className={styles.input}
              />
            </label>

            {error ? <p className={styles.errorBanner}>{error}</p> : null}

            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>

            <button type="button" onClick={switchToSignIn} className={styles.forgotLink}>
              Back to Sign In
            </button>
          </form>
        ) : null}

        {view === "forgot-password-sent" ? (
          <div className="flex flex-col gap-4">
            {/* Engineering Review follow-up (17 September 2026): reworded to
                be more user-friendly and security-conscious — it no longer
                echoes the entered address back (avoids confirming or
                denying that a specific email has a Workspace account) and
                reads as a deliberate, reassuring confirmation rather than a
                bare status line. */}
            <p className={styles.successBanner}>
              If an account exists for this email address, we&rsquo;ve sent a secure password reset link. Please
              check your inbox and follow the link to choose a new password.
            </p>
            <button type="button" onClick={switchToSignIn} className={styles.forgotLink}>
              Back to Sign In
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
