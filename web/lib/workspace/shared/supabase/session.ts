// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// EBC-R1.3-WS11-008: SMV Workspace Authentication & User Management —
// extended with two Error Handling behaviours (Section 5):
//   1. Best-effort "expired session" detection: if the request already
//      carried a Supabase auth cookie but getUser() still came back with no
//      user, that cookie was presumably valid before and has since expired
//      or been revoked, rather than this being a first-time visitor. This
//      is a heuristic based on Supabase's own `sb-*-auth-token` cookie
//      naming convention, not a documented guarantee from Supabase — it is
//      recorded as such here, consistent with this file's existing practice
//      of not asserting untested guarantees (see the Implementation Report
//      for EBC-R1.3-WS11-007, Section 11).
//   2. Loop fix: the original "signed-in user visiting /workspace/sign-in
//      gets bounced to /workspace" rule assumed every authenticated
//      Supabase user is also an authorized Workspace user. That stopped
//      being true once an Unauthorized state became distinguishable
//      (EBC-008): a Supabase-authenticated person with no workspace_users
//      row, redirected to sign-in?reason=unauthorized by ../rbac/guard.ts,
//      would otherwise be bounced straight back to /workspace by this same
//      rule — an infinite loop. The bounce is now skipped specifically for
//      that query state. This intentionally does not add a workspace_users
//      lookup to this file — it stays framework/session mechanism only, no
//      business logic (see below) — the distinction is read from the URL
//      query state the RBAC layer itself already set, not from a fresh DB
//      read here.
//
// Session-refresh and route-protection mechanism for /workspace/**, called
// from the project's proxy/middleware entry point. Kept independent of that
// entry point's exact file name / export name (see EBC-R1.3-WS11-006 v1.2
// Section 6.4 / Section 12 — that naming point is a logged Architecture
// observation, not resolved by Engineering) so this logic does not need to
// change once that naming is settled. Framework mechanism only — carries no
// business logic.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { WORKSPACE_RESET_PASSWORD_PATH, WORKSPACE_ROUTE_PREFIX, WORKSPACE_SIGN_IN_PATH } from "../constants";

function requestHadSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => cookie.name.includes("-auth-token"));
}

export async function updateWorkspaceSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const pathname = request.nextUrl.pathname;
  const isWorkspaceRoute = pathname.startsWith(WORKSPACE_ROUTE_PREFIX);
  const isSignInRoute = pathname.startsWith(WORKSPACE_SIGN_IN_PATH);
  // EBC-R1.3-WS11-010: Workspace Authentication UX Refinement, Section 5
  // (self-service password reset). Supabase's reset-password link lands here
  // before the visitor has an ordinary Workspace session — either as a
  // `?code=` query param (PKCE) that the page itself exchanges client-side,
  // or as a URL fragment the server never sees at all (implicit flow), which
  // this proxy cannot inspect either way. The page must be reachable before a
  // session exists, so it needs the exact same proxy exemption already used
  // for /workspace/sign-in — this extends that existing exemption to a second
  // named path rather than introducing a new mechanism (no routing/session
  // redesign; see Section 2 of this EBC).
  const isResetPasswordRoute = pathname.startsWith(WORKSPACE_RESET_PASSWORD_PATH);

  if (!url || !publishableKey) {
    // Fails closed: an unconfigured Supabase project must not silently allow
    // Workspace access.
    if (isWorkspaceRoute && !isSignInRoute) {
      return NextResponse.redirect(new URL(WORKSPACE_SIGN_IN_PATH, request.url));
    }
    return response;
  }

  const hadAuthCookie = requestHadSupabaseAuthCookie(request);

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() (not getSession()): validates the token against Supabase
  // rather than trusting a locally-decoded cookie, per Supabase's own
  // guidance for exactly this call site.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isWorkspaceRoute && !isSignInRoute && !isResetPasswordRoute && !user) {
    const redirectUrl = new URL(WORKSPACE_SIGN_IN_PATH, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    if (hadAuthCookie) {
      redirectUrl.searchParams.set("reason", "expired");
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (isSignInRoute && user && request.nextUrl.searchParams.get("reason") !== "unauthorized") {
    return NextResponse.redirect(new URL(WORKSPACE_ROUTE_PREFIX, request.url));
  }

  return response;
}
