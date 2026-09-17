// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Supabase server client for Server Components, Server Actions and Route
// Handlers under /workspace/**. Uses the publishable (anon-equivalent) key
// only — every read/write through this client is subject to Row Level
// Security for the signed-in user's own session, per AD-WS11-002. Never use
// SUPABASE_SECRET_KEY here.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { WorkspaceSupabaseConfigError } from "./errors";

function readWorkspaceSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new WorkspaceSupabaseConfigError("workspace_supabase_not_configured");
  }
  return { url, publishableKey };
}

export async function createWorkspaceSupabaseServerClient() {
  const { url, publishableKey } = readWorkspaceSupabaseEnvironment();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Thrown when called from a Server Component, where cookies() is
          // read-only. Session-cookie refresh for that case is handled by
          // the proxy/middleware entry point instead (see ./session.ts), so
          // this is expected and safe to ignore here.
        }
      },
    },
  });
}
