// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Session-refresh and route-protection mechanism for /workspace/**, called
// from the project's proxy/middleware entry point. Kept independent of that
// entry point's exact file name / export name (see EBC-R1.3-WS11-006 v1.2
// Section 6.4 / Section 12 — that naming point is a logged Architecture
// observation, not resolved by Engineering) so this logic does not need to
// change once that naming is settled. Framework mechanism only — carries no
// business logic.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { WORKSPACE_ROUTE_PREFIX, WORKSPACE_SIGN_IN_PATH } from "../constants";

export async function updateWorkspaceSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const pathname = request.nextUrl.pathname;
  const isWorkspaceRoute = pathname.startsWith(WORKSPACE_ROUTE_PREFIX);
  const isSignInRoute = pathname.startsWith(WORKSPACE_SIGN_IN_PATH);

  if (!url || !publishableKey) {
    // Fails closed: an unconfigured Supabase project must not silently allow
    // Workspace access.
    if (isWorkspaceRoute && !isSignInRoute) {
      return NextResponse.redirect(new URL(WORKSPACE_SIGN_IN_PATH, request.url));
    }
    return response;
  }

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

  if (isWorkspaceRoute && !isSignInRoute && !user) {
    const redirectUrl = new URL(WORKSPACE_SIGN_IN_PATH, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isSignInRoute && user) {
    return NextResponse.redirect(new URL(WORKSPACE_ROUTE_PREFIX, request.url));
  }

  return response;
}
