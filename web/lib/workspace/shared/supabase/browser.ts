// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Supabase browser client for Client Components under /workspace/**. Same
// publishable key as the server client — RLS, not key secrecy, is the
// access boundary (AD-WS11-002). Never import SUPABASE_SECRET_KEY here.

import { createBrowserClient } from "@supabase/ssr";
import { WorkspaceSupabaseConfigError } from "./errors";

export function createWorkspaceSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new WorkspaceSupabaseConfigError("workspace_supabase_not_configured");
  }
  return createBrowserClient(url, publishableKey);
}
