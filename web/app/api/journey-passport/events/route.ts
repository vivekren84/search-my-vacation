import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyLeadRepository } from "@/lib/journey-leads/repository";
import { processJourneyLeadEvent } from "@/lib/journey-leads/service";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 1024;

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return Response.json({ ok: false }, { status: 413 });
  if (!consumeJourneyLeadRateLimit(`event:${journeyLeadRateLimitKey(request)}`)) return Response.json({ ok: false }, { status: 429 });
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return Response.json({ ok: false }, { status: 413 });
    const raw: unknown = JSON.parse(body);
    const repository = createSupabaseJourneyLeadRepository({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    });
    const accepted = await processJourneyLeadEvent(raw, repository);
    return Response.json({ ok: accepted }, { status: accepted ? 202 : 400, headers: { "Cache-Control": "no-store" } });
  } catch {
    // Tracking is intentionally best-effort and never returns database details.
    return Response.json({ ok: false }, { status: 202, headers: { "Cache-Control": "no-store" } });
  }
}
