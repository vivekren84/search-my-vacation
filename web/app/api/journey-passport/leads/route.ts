import { journeyPassportOtpConfig } from "@/config/journey-passport-otp.config";
import { createJourneyLeadNotifier } from "@/lib/journey-leads/email";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyLeadRepository } from "@/lib/journey-leads/repository";
import { processJourneyLead } from "@/lib/journey-leads/service";
import { parseJourneyLeadSubmission } from "@/lib/journey-leads/validation";
import { createSupabaseJourneyPassportOtpRepository } from "@/lib/journey-passport-otp/repository";
import { emitDiagnosticLog, resolveCorrelationId } from "@/lib/observability/diagnostics";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 32 * 1024;
const FAILURE_MESSAGE = "We couldn’t connect your Passport just yet. Your details are still here—please try once more.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const startTime = performance.now();
  const correlationId = resolveCorrelationId(request);

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);

  if (!consumeJourneyLeadRateLimit(journeyLeadRateLimitKey(request))) {
    emitDiagnosticLog({
      event: "lead_submission_rate_limited",
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

  const parsed = parseJourneyLeadSubmission(raw);
  if (!parsed.ok) {
    emitDiagnosticLog({
      event: "lead_submission_validation_failed",
      level: "warn",
      correlationId,
      context: { code: parsed.code },
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  try {
    const otpRepository = createSupabaseJourneyPassportOtpRepository(
      {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      },
      journeyPassportOtpConfig,
    );

    // DEC-R1.2-006 / TD-07 / UX-01: Pass passportReference so token can be idempotently
    // retried within a 10-minute window if lead creation needs recovery.
    const verified = await otpRepository.consumeVerificationToken(
      parsed.value.mobileE164,
      parsed.value.verificationToken,
      parsed.value.passportReference,
    );

    if (!verified) {
      emitDiagnosticLog({
        event: "lead_submission_rejected_unverified",
        level: "warn",
        correlationId,
        context: {
          passportReference: parsed.value.passportReference,
          mobile: parsed.value.mobileE164,
        },
        durationMs: performance.now() - startTime,
      });
      return json({ ok: false, message: FAILURE_MESSAGE }, 403);
    }

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

    await processJourneyLead(parsed.value, { repository, notifier });

    emitDiagnosticLog({
      event: "lead_submission_success",
      level: "info",
      correlationId,
      context: {
        passportReference: parsed.value.passportReference,
        mobile: parsed.value.mobileE164,
      },
      durationMs: performance.now() - startTime,
    });

    return json({ ok: true, passportReference: parsed.value.passportReference }, 200);
  } catch (error) {
    emitDiagnosticLog({
      event: "lead_storage_failed",
      level: "error",
      correlationId,
      context: {
        passportReference: parsed.value.passportReference,
        mobile: parsed.value.mobileE164,
      },
      error,
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 503);
  }
}
