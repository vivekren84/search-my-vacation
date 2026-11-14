const SUPABASE_PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/;

/**
 * Return the canonical Supabase URL only when it belongs to the project ref
 * selected by the current Vercel/local environment. Keeping the ref in
 * environment configuration prevents application code from pinning itself
 * to Production while still failing closed on mismatched credentials.
 */
export function resolveSupabaseProjectUrl(
  urlValue: string | undefined,
  projectRefValue: string | undefined,
): string | null {
  const projectRef = projectRefValue?.trim();
  const candidate = urlValue?.trim().replace(/\/+$/, "");
  if (!projectRef || !SUPABASE_PROJECT_REF_PATTERN.test(projectRef) || !candidate) return null;

  try {
    const url = new URL(candidate);
    if (
      url.protocol !== "https:" ||
      url.hostname !== `${projectRef}.supabase.co` ||
      url.port !== "" ||
      url.pathname !== "/" ||
      url.search !== "" ||
      url.hash !== "" ||
      url.username !== "" ||
      url.password !== ""
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}
