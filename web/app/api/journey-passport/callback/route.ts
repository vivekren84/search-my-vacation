import { createJourneyLeadNotifier } from "@/lib/journey-leads/email";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyLeadRepository, maskPassportReference } from "@/lib/journey-leads/repository";
import { JourneyCallbackProcessingError, processJourneyCallback } from "@/lib/journey-leads/service";
import { parseJourneyCallbackSubmission } from "@/lib/journey-leads/validation";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 4 * 1024;
const FAILURE_MESSAGE = "We couldn’t save your callback preference just now. Please try again.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
  if (!consumeJourneyLeadRateLimit(`callback:${journeyLeadRateLimitKey(request)}`)) return json({ ok: false, message: FAILURE_MESSAGE }, 429);

  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  const parsed = parseJourneyCallbackSubmission(raw);
  if (!parsed.ok) return json({ ok: false, message: FAILURE_MESSAGE }, 400);

  try {
    const repository = createSupabaseJourneyLeadRepository({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    });
    const notifier = createJourneyLeadNotifier({
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      JOURNEY_LEAD_FROM_EMAIL: process.env.JOURNEY_LEAD_FROM_EMAIL,
      JOURNEY_LEAD_NOTIFICATION_EMAILS: process.env.JOURNEY_LEAD_NOTIFICATION_EMAILS,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    });
    const result = await processJourneyCallback(parsed.value, { repository, notifier });
    return json({ ok: true, passportReference: parsed.value.passportReference, notificationStatus: result.notificationStatus }, 200);
  } catch (error) {
    console.error("Journey callback preference storage failed.", {
      passportReference: maskPassportReference(parsed.value.passportReference),
      operation: error instanceof JourneyCallbackProcessingError ? error.code : "callback_storage",
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, error instanceof JourneyCallbackProcessingError ? 409 : 503);
  }
}
