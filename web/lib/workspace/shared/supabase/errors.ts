// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Shared by both server.ts and browser.ts. Kept in its own file (rather than
// defined in server.ts) so that browser.ts — imported into Client Components
// — never has to import server.ts, which pulls in next/headers and would
// break the client bundle.

export class WorkspaceSupabaseConfigError extends Error {
  constructor(readonly code: string) {
    super("Workspace Supabase client could not be created");
    this.name = "WorkspaceSupabaseConfigError";
  }
}
