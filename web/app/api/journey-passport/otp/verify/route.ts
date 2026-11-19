import { journeyPassportOtpConfig } from "@/config/journey-passport-otp.config";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyPassportOtpRepository } from "@/lib/journey-passport-otp/repository";
import { processJourneyPassportOtpVerify } from "@/lib/journey-passport-otp/service";
import { parseJourneyPassportOtpVerifyRequest } from "@/lib/journey-passport-otp/validation";
import { emitDiagnosticLog, resolveCorrelationId } from "@/lib/observability/diagnostics";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 2 * 1024;
const FAILURE_MESSAGE = "We couldn’t check that code just now. Please try again.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const startTime = performance.now();
  const correlationId = resolveCorrelationId(request);

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);

  if (!consumeJourneyLeadRateLimit(`otp-verify:${journeyLeadRateLimitKey(request)}`)) {
    emitDiagnosticLog({
      event: "otp_verify_ip_rate_limited",
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

  const parsed = parseJourneyPassportOtpVerifyRequest(raw);
  if (!parsed.ok) {
    emitDiagnosticLog({
      event: "otp_verify_validation_rejected",
      level: "warn",
      correlationId,
      context: { code: parsed.code },
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, code: parsed.code, message: FAILURE_MESSAGE }, 400);
  }

  try {
    const repository = createSupabaseJourneyPassportOtpRepository(
      {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      },
      journeyPassportOtpConfig,
    );
    const result = await processJourneyPassportOtpVerify(parsed.value.mobileNumber, parsed.value.challengeId, parsed.value.code, repository);

    emitDiagnosticLog({
      event: "otp_verify_result",
      level: result.outcome === "verified" ? "info" : "warn",
      correlationId,
      context: {
        outcome: result.outcome,
        mobile: parsed.value.mobileNumber,
        challengeId: parsed.value.challengeId,
        attemptsRemaining: result.attemptsRemaining,
      },
      durationMs: performance.now() - startTime,
    });

    return json({
      ok: true,
      outcome: result.outcome,
      ...(result.verificationToken ? { verificationToken: result.verificationToken } : {}),
      ...(typeof result.attemptsRemaining === "number" ? { attemptsRemaining: result.attemptsRemaining } : {}),
    }, 200);
  } catch (error) {
    emitDiagnosticLog({
      event: "otp_verify_error",
      level: "error",
      correlationId,
      context: { mobile: parsed.value.mobileNumber, challengeId: parsed.value.challengeId },
      error,
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 503);
  }
}
