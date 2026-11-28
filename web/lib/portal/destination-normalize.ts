function adminHeaders(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
}

export interface DestinationCatalogEntry {
  id: string;
  canonical_name: string;
  aliases: string[];
  country: string;
  category: string;
  iana_timezone: string;
  is_public_featured: boolean;
}

const PRESERVED_PLACEHOLDERS = new Set([
  "bespoke journey",
  "under discussion",
  "no stay",
  "domestic",
  "multi",
  "multiple",
  "resort with activities",
  "ooty or any bacholer place to enjoy",
]);

function stripRichTextWrapper(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{"richText":')) return trimmed;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed?.richText)) {
      const joined = parsed.richText.map((e: any) => String(e?.text || "")).join("").trim();
      if (joined) return joined;
    }
  } catch {
    // Ignore malformed JSON
  }
  return trimmed;
}

function toTitleCaseShortPlace(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

/**
 * Normalizes a destination string against the loaded destinations catalog.
 * Handles exact/alias matches, delimited multi-destination strings, and richText artifacts.
 */
export function normalizeDestinationWithCatalog(
  raw: string,
  catalog: DestinationCatalogEntry[],
  options?: { allowTitleCaseUnlisted?: boolean }
): { normalized: string; matched: boolean } {
  const cleaned = stripRichTextWrapper(raw);
  if (!cleaned) return { normalized: "", matched: false };

  if (PRESERVED_PLACEHOLDERS.has(cleaned.toLowerCase())) {
    return { normalized: cleaned, matched: true };
  }

  const lookup = new Map<string, string>();
  for (const entry of catalog) {
    lookup.set(entry.canonical_name.toLowerCase().trim(), entry.canonical_name);
    for (const alias of entry.aliases || []) {
      const a = alias.toLowerCase().trim();
      if (a) lookup.set(a, entry.canonical_name);
    }
  }

  const direct = lookup.get(cleaned.toLowerCase());
  if (direct) return { normalized: direct, matched: true };

  if (cleaned.toLowerCase().startsWith("state of kerala")) {
    return { normalized: "Kerala", matched: true };
  }

  // Multi-destination delimited string
  if (/(\s*\|\s*|\s*\/\s*|\s*&\s*|,\s*)/.test(cleaned)) {
    const sep = cleaned.includes("|")
      ? " | "
      : cleaned.includes("/")
        ? " / "
        : cleaned.includes("&")
          ? " & "
          : ", ";
    const parts = cleaned
      .split(/\s*(?:\||\/|&|,)\s*/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length > 1) {
      let anyMatched = false;
      const mapped = parts.map((part) => {
        const hit = lookup.get(part.toLowerCase());
        if (hit) {
          anyMatched = true;
          return hit;
        }
        return options?.allowTitleCaseUnlisted && part.length <= 30 && !/[.!?]/.test(part)
          ? toTitleCaseShortPlace(part)
          : part;
      });
      return { normalized: mapped.join(sep), matched: anyMatched };
    }
  }

  // For short single unlisted client/advisor places (no sentence punctuation), normalize casing
  if (options?.allowTitleCaseUnlisted && cleaned.length <= 30 && !/[.!?\n]/.test(cleaned)) {
    return { normalized: toTitleCaseShortPlace(cleaned), matched: false };
  }

  return { normalized: cleaned, matched: false };
}

/**
 * Fetches the destinations master catalog from Supabase REST API.
 */
export async function fetchDestinationCatalog(
  projectUrl: string,
  secretKey: string
): Promise<DestinationCatalogEntry[]> {
  try {
    const res = await fetch(
      `${projectUrl}/rest/v1/destinations?select=id,canonical_name,aliases,country,category,iana_timezone,is_public_featured&order=canonical_name.asc`,
      {
        headers: adminHeaders(secretKey),
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

/**
 * Server-side helper: normalizes a destination string using Supabase fn_normalize_destination RPC,
 * falling back gracefully to trimmed input if unavailable.
 */
export async function normalizeDestinationServer(
  raw: string,
  projectUrl: string,
  secretKey: string,
  options?: { allowTitleCaseUnlisted?: boolean }
): Promise<string> {
  const cleaned = stripRichTextWrapper(raw);
  if (!cleaned) return "";

  const catalog = await fetchDestinationCatalog(projectUrl, secretKey);
  if (catalog.length > 0) {
    return normalizeDestinationWithCatalog(cleaned, catalog, options).normalized;
  }

  return cleaned;
}
