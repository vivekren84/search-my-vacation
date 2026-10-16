"use client";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// EBC-R1.3-WS11-008: SMV Workspace Authentication & User Management —
// `redirectTo` after a successful sign-in, so a deep link into
// /workspace/** that bounced here comes back to where the person was
// headed, and a `reason` banner for the Unauthorized and Expired Session
// states. `redirectTo` is validated to be an internal /workspace path (and
// not the sign-in page itself) before use, to rule out an open redirect
// and a redirect loop.
//
// EBC-R1.3-WS11-011F: Workspace Foundation Final Remediation, Remediation
// Item 2 (Workspace Sign-In Page) and Item 3 (Authentication Flow
// Consistency). Product ratification (this EBC): "The user shall never
// know whether authentication originated from Homepage Login or Protected
// Route Redirect — both experiences shall appear identical." This page no
// longer has its own separate form/copy/styling — it renders the exact
// same WorkspaceSignInPanel component, inside the exact same
// SignInModal.module.css `.dialog`/`.surface` presentation, that the
// Homepage header's SignInModal uses. All prior engineering-placeholder
// wording (the "Engineering foundation verification form" notice, EBC
// references, plain-gray form styling) has been removed. Only the
// presentation changed: the redirectTo/reason query-param handling and
// validation below is byte-for-byte the same logic this page has used
// since EBC-R1.3-WS11-008 — Remediation Item 3 requires that behaviour be
// preserved exactly.
//
// EBC-R1.3-WS13-028 Phase 1 WP-1.9 (WS13-P1-I, TD-WS13-005): a refused
// account (deactivated or never provisioned, reason=unauthorized) is first
// signed out of its Supabase session, then shown the one neutral refusal
// (DEC-R1.3-026), so a later visit does not reuse the session.
//
// Wrapped in Suspense because useSearchParams() requires it for a fully
// client-rendered page.
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WorkspaceSignInPanel from "@/components/auth/WorkspaceSignInPanel";
import { signOutCurrentWorkspaceUserFromClient } from "@/lib/workspace/shared/auth/client";
import {
  WORKSPACE_ACCESS_REFUSED_MESSAGE,
  WORKSPACE_ROUTE_PREFIX,
  WORKSPACE_SIGN_IN_PATH,
} from "@/lib/workspace/shared/constants";

import modalStyles from "@/components/auth/SignInModal.module.css";

export default function WorkspaceSignInPage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceSignInPageContent />
    </Suspense>
  );
}

function WorkspaceSignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headingId = "workspace-sign-in-page-heading";

  const reason = searchParams.get("reason");
  const rawRedirectTo = searchParams.get("redirectTo");
  const redirectTo =
    rawRedirectTo &&
    rawRedirectTo.startsWith(WORKSPACE_ROUTE_PREFIX) &&
    !rawRedirectTo.startsWith(WORKSPACE_SIGN_IN_PATH)
      ? rawRedirectTo
      : WORKSPACE_ROUTE_PREFIX;

  // WP-1.9 (TD-WS13-005): the refusal shows once the sign-out has settled.
  // If the sign-out request itself fails, the message is still shown so the
  // page is never left without an explanation.
  const [refusalSignedOut, setRefusalSignedOut] = useState(false);
  useEffect(() => {
    if (reason !== "unauthorized") return;
    let cancelled = false;
    void signOutCurrentWorkspaceUserFromClient()
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setRefusalSignedOut(true);
      });
    return () => {
      cancelled = true;
    };
  }, [reason]);

  const banner =
    reason === "unauthorized"
      ? refusalSignedOut
        ? WORKSPACE_ACCESS_REFUSED_MESSAGE
        : null
      : reason === "expired"
        ? "Your session has expired. Please sign in again."
        : null;

  function handleSuccess() {
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="journey-passport-closure-page">
      <div className={modalStyles.dialog}>
        <div className={modalStyles.surface}>
          <WorkspaceSignInPanel headingId={headingId} onSuccess={handleSuccess} topBanner={banner} />
        </div>
      </div>
    </main>
  );
}
