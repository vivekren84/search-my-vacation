// EBC-R1.3-WS11-009: Unified Authentication Entry Experience.
// Section 6 asks the header to show a "Display Name" once signed in.
// workspace_users carries no name column (Data Architecture's WS-Eng-0
// migration is role/timestamps only), and adding one is a schema change —
// an Escalation Rules §11 trigger this EBC does not need to hit, because
// Supabase Auth already carries an optional `user_metadata` object with no
// schema change required. Today no account has anything set there (every
// current account was provisioned by hand through the Supabase dashboard,
// per EBC-R1.3-WS11-007's own notes), so every display name currently
// falls back to the email's local part — disclosed in this EBC's
// implementation report as a stand-in, not asserted as the final design.
// If/when Administrator-initiated user creation (a future Engineering
// Phase) collects a real name, setting it in `user_metadata.full_name` (or
// `.name`) at that point makes it appear here with no further change.
type WorkspaceAuthDisplayNameSource = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export function deriveWorkspaceDisplayName(user: WorkspaceAuthDisplayNameSource): string {
  const metadata = user.user_metadata ?? {};
  const fromMetadata = metadata.full_name ?? metadata.name;
  if (typeof fromMetadata === "string" && fromMetadata.trim().length > 0) {
    return fromMetadata.trim();
  }

  const email = user.email?.trim();
  if (email) {
    const localPart = email.split("@")[0];
    if (localPart) return localPart;
  }

  return "Workspace User";
}
