import { createJourneyLeadNotifier } from "@/lib/journey-leads/email";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyLeadRepository } from "@/lib/journey-leads/repository";
import { JourneyCallbackProcessingError, processJourneyCallback } from "@/lib/journey-leads/service";
import { parseJourneyCallbackSubmission } from "@/lib/journey-leads/validation";
import { emitDiagnosticLog, resolveCorrelationId } from "@/lib/observability/diagnostics";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 4 * 1024;
const FAILURE_MESSAGE = "We couldn’t save your callback preference just now. Please try again.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const startTime = performance.now();
  const correlationId = resolveCorrelationId(request);

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
  if (!consumeJourneyLeadRateLimit(`callback:${journeyLeadRateLimitKey(request)}`)) {
    emitDiagnosticLog({
      event: "callback_rate_limited",
      level: "warn",
      correlationId,
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 429);
  }

  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  const parsed = parseJourneyCallbackSubmission(raw);
  if (!parsed.ok) {
    emitDiagnosticLog({
      event: "callback_validation_failed",
      level: "warn",
      correlationId,
      context: { code: parsed.code },
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  try {
    const repository = createSupabaseJourneyLeadRepository({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
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
    emitDiagnosticLog({
      event: "callback_preference_saved",
      level: "info",
      correlationId,
      context: {
        passportReference: parsed.value.passportReference,
        notificationStatus: result.notificationStatus,
      },
      durationMs: performance.now() - startTime,
    });
    return json({ ok: true, passportReference: parsed.value.passportReference, notificationStatus: result.notificationStatus }, 200);
  } catch (error) {
    emitDiagnosticLog({
      event: "callback_preference_error",
      level: "error",
      correlationId,
      context: {
        passportReference: parsed.value.passportReference,
        operation: error instanceof JourneyCallbackProcessingError ? error.code : "callback_storage",
      },
      error,
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, error instanceof JourneyCallbackProcessingError ? 409 : 503);
  }
}
