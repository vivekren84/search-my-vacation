"use client";

// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement, Section 5 —
// self-service password reset ("Engineering shall leverage Supabase's
// native password reset capability... No Administrator intervention should
// normally be required").
//
// This page is where Supabase's reset-password email link lands
// (WORKSPACE_RESET_PASSWORD_PATH, passed as `redirectTo` to
// requestWorkspacePasswordReset in SignInModal.tsx). Two Supabase link
// shapes are both handled, since this repository's Supabase client
// configuration is unchanged by this EBC and neither flow type is assumed:
//   - PKCE: the link carries `?code=...`; exchangeWorkspacePasswordResetCode
//     exchanges it for a session on mount.
//   - Implicit/hash: the link carries `#access_token=...&type=recovery` in
//     the URL fragment, which never reaches the server and is resolved
//     automatically by the Supabase browser client itself. This page does
//     not need to read that fragment directly — it just checks whether a
//     session now exists.
// Either way, once a session exists, updateCurrentWorkspaceUserPassword
// calls Supabase's own auth.updateUser({ password }) — no bespoke reset
// mechanism, no new backend route, no new authentication provider. On
// success this page immediately signs that recovery session back out
// (Engineering Review follow-up, 17 September 2026) so "Return to Sign In"
// requires the person to actually sign in again with their new password,
// rather than the reset itself acting as an implicit login.
//
// This route is exempt from the ordinary /workspace/** authentication
// requirement in lib/workspace/shared/supabase/session.ts (the same
// exemption mechanism already used for /workspace/sign-in), because a
// visitor arriving here from the emailed link does not yet have an
// ordinary Workspace session.
//
// Still deliberately simple, brand-consistent styling (warm cream
// background, editorial heading, the same input treatment as the header
// SignInModal) rather than a full page design — this EBC's Section 4 asks
// for the modal's visual design specifically; this page exists only so the
// emailed link has somewhere functional and on-brand to land, disclosed in
// the implementation report as a proportionate, minimal-scope choice.
import Link from "next/link";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import {
  describeWorkspacePasswordResetError,
  exchangeWorkspacePasswordResetCode,
  signOutCurrentWorkspaceUserFromClient,
  updateCurrentWorkspaceUserPassword,
} from "@/lib/workspace/shared/auth/client";
import { createWorkspaceSupabaseBrowserClient } from "@/lib/workspace/shared/supabase/browser";
import { WORKSPACE_SIGN_IN_PATH } from "@/lib/workspace/shared/constants";

type PageState = "checking" | "invalid" | "form" | "success";

export default function WorkspaceResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceResetPasswordForm />
    </Suspense>
  );
}

function WorkspaceResetPasswordForm() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const hasAttemptedExchange = useRef(false);

  useEffect(() => {
    if (hasAttemptedExchange.current) return;
    hasAttemptedExchange.current = true;

    const code = searchParams.get("code");

    async function establishRecoverySession() {
      try {
        if (code) {
          await exchangeWorkspacePasswordResetCode(code);
        }
        // Covers both flow shapes (see header comment): after an explicit
        // code exchange, or after the Supabase browser client has resolved
        // an implicit-flow recovery fragment on its own, a session should
        // now exist either way.
        const supabase = createWorkspaceSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setState(session ? "form" : "invalid");
      } catch {
        setState("invalid");
      }
    }

    void establishRecoverySession();
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateCurrentWorkspaceUserPassword(password, confirmPassword);
      // Engineering Review follow-up (17 September 2026): the Supabase
      // recovery link leaves this browser with a live, authenticated
      // session (that's what lets updateUser() work at all) — but the
      // Product Owner's ratified baseline is a single, deliberate Sign In
      // entry point, not an implicit sign-in as a side effect of resetting
      // a password. Signing out here, before showing "Password updated",
      // ensures "Return to Sign In" actually requires the person to sign
      // in again with their new password rather than silently landing them
      // in an already-authenticated /workspace session.
      await signOutCurrentWorkspaceUserFromClient();
      setState("success");
    } catch (err) {
      setError(describeWorkspacePasswordResetError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 py-16">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-[rgb(154_100_46_/_24%)] bg-white p-8 shadow-[0_32px_110px_rgb(42_33_28_/_14%)]">
        <h1 className="font-[var(--font-editorial)] text-2xl font-normal text-[#2A211C]">
          {state === "success" ? "Password updated" : "Choose a new password"}
        </h1>

        {state === "checking" ? (
          <p className="mt-4 text-sm text-[#2A211C]/70">Verifying your reset link…</p>
        ) : null}

        {state === "invalid" ? (
          <>
            <p className="mt-4 text-sm text-[#2A211C]/70">
              That link is invalid or has expired. Please request a new one from the Sign In window.
            </p>
            <Link
              href={WORKSPACE_SIGN_IN_PATH}
              className="mt-6 inline-block rounded-full bg-[#F5951C] px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-[#2A211C] transition hover:bg-[#F5951C]/90"
            >
              Return to Sign In
            </Link>
          </>
        ) : null}

        {state === "form" ? (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#2A211C]">
              New password
              <input
                type="password"
                autoFocus
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-[#e8d7bd] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5951C]"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#2A211C]">
              Confirm new password
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded border border-[#e8d7bd] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5951C]"
              />
            </label>

            {error ? (
              <p className="rounded-lg bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-error)]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-[#F5951C] px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-[#2A211C] transition hover:bg-[#F5951C]/90 disabled:opacity-50"
            >
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : null}

        {state === "success" ? (
          <>
            <p className="mt-4 text-sm text-[#2A211C]/70">
              Your password has been updated. Please sign in again with your new password.
            </p>
            <Link
              href={WORKSPACE_SIGN_IN_PATH}
              className="mt-6 inline-block rounded-full bg-[#F5951C] px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-[#2A211C] transition hover:bg-[#F5951C]/90"
            >
              Return to Sign In
            </Link>
          </>
        ) : null}
      </div>
    </main>
  );
}
