import { journeyPassportOtpConfig } from "@/config/journey-passport-otp.config";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyPassportOtpRepository } from "@/lib/journey-passport-otp/repository";
import { createJourneyPassportOtpSmsProvider } from "@/lib/journey-passport-otp/sms";
import { processJourneyPassportOtpSend } from "@/lib/journey-passport-otp/service";
import { parseJourneyPassportOtpSendRequest } from "@/lib/journey-passport-otp/validation";
import { emitDiagnosticLog, resolveCorrelationId } from "@/lib/observability/diagnostics";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 2 * 1024;
const FAILURE_MESSAGE = "We couldn’t send that code just now. Please try again in a moment.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const startTime = performance.now();
  const correlationId = resolveCorrelationId(request);

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);

  // In-memory burst protection (per IP)
  if (!consumeJourneyLeadRateLimit(`otp-send:${journeyLeadRateLimitKey(request)}`)) {
    emitDiagnosticLog({
      event: "otp_send_ip_rate_limited",
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

  const parsed = parseJourneyPassportOtpSendRequest(raw);
  if (!parsed.ok) {
    emitDiagnosticLog({
      event: "otp_send_validation_rejected",
      level: "warn",
      correlationId,
      context: { code: parsed.code },
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, code: parsed.code, message: FAILURE_MESSAGE }, 400);
  }

  try {
    const isMockAllowed =
      (process.env.VERCEL_ENV === "preview" ||
        process.env.NODE_ENV !== "production" ||
        process.env.ENABLE_TEST_OTP === "true") &&
      !process.env.SMS_PROVIDER_API_KEY;

    const repository = createSupabaseJourneyPassportOtpRepository(
      {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      },
      journeyPassportOtpConfig,
    );
    const smsProvider = isMockAllowed
      ? { async send() { return { status: "sent" as const }; } }
      : createJourneyPassportOtpSmsProvider(
          {
            SMS_PROVIDER_API_KEY: process.env.SMS_PROVIDER_API_KEY,
            SMS_PROVIDER_SENDER_ID: process.env.SMS_PROVIDER_SENDER_ID,
            SMS_PROVIDER_TEMPLATE_ID: process.env.SMS_PROVIDER_TEMPLATE_ID,
          },
          journeyPassportOtpConfig.providerTimeoutMs,
          journeyPassportOtpConfig.expirySeconds,
        );
    const result = await processJourneyPassportOtpSend(parsed.value.mobileNumber, {
      repository,
      smsProvider,
      ...(isMockAllowed ? { codeGenerator: () => "000000" } : {}),
    });

    if (result.outcome !== "sent") {
      emitDiagnosticLog({
        event: "otp_send_outcome_non_sent",
        level: "info",
        correlationId,
        context: { outcome: result.outcome, mobile: parsed.value.mobileNumber },
        durationMs: performance.now() - startTime,
      });

      // UX-03: Include challengeId on resend_too_soon so client recovers from dropped responses without second SMS
      return json({
        ok: true,
        outcome: result.outcome,
        ...(result.challengeId ? { challengeId: result.challengeId } : {}),
        resendDelaySeconds: journeyPassportOtpConfig.resendDelaySeconds,
      }, 200);
    }

    if (result.smsStatus === "not-configured") {
      emitDiagnosticLog({
        event: "otp_send_provider_not_configured",
        level: "warn",
        correlationId,
        context: { mobile: parsed.value.mobileNumber },
        durationMs: performance.now() - startTime,
      });
      return json({ ok: true, outcome: "otp_unavailable" }, 200);
    }

    emitDiagnosticLog({
      event: "otp_send_success",
      level: "info",
      correlationId,
      context: { mobile: parsed.value.mobileNumber, challengeId: result.challengeId },
      durationMs: performance.now() - startTime,
    });

    return json({
      ok: true,
      outcome: "sent",
      challengeId: result.challengeId,
      resendDelaySeconds: journeyPassportOtpConfig.resendDelaySeconds,
    }, 200);
  } catch (error) {
    emitDiagnosticLog({
      event: "otp_send_error",
      level: "error",
      correlationId,
      context: { mobile: parsed.value.mobileNumber },
      error,
      durationMs: performance.now() - startTime,
    });
    return json({ ok: false, message: FAILURE_MESSAGE }, 503);
  }
}
