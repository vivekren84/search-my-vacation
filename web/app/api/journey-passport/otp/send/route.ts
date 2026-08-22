import { journeyPassportOtpConfig } from "@/config/journey-passport-otp.config";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyPassportOtpRepository } from "@/lib/journey-passport-otp/repository";
import { createJourneyPassportOtpSmsProvider } from "@/lib/journey-passport-otp/sms";
import { processJourneyPassportOtpSend } from "@/lib/journey-passport-otp/service";
import { parseJourneyPassportOtpSendRequest } from "@/lib/journey-passport-otp/validation";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 2 * 1024;
const FAILURE_MESSAGE = "We couldn’t send that code just now. Please try again in a moment.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
  // Distinct, OTP-specific rate-limit key from the lead-submission limiter
  // (EBC-R1.2-WS5-01 §6.5) — OTP send/resend abuse costs SMV real SMS spend,
  // unlike a rejected lead submission.
  if (!consumeJourneyLeadRateLimit(`otp-send:${journeyLeadRateLimitKey(request)}`)) return json({ ok: false, message: FAILURE_MESSAGE }, 429);

  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  const parsed = parseJourneyPassportOtpSendRequest(raw);
  if (!parsed.ok) return json({ ok: false, code: parsed.code, message: FAILURE_MESSAGE }, 400);

  try {
    const repository = createSupabaseJourneyPassportOtpRepository(
      { NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY },
      journeyPassportOtpConfig,
    );
    const smsProvider = createJourneyPassportOtpSmsProvider(
      {
        SMS_PROVIDER_API_KEY: process.env.SMS_PROVIDER_API_KEY,
        SMS_PROVIDER_SENDER_ID: process.env.SMS_PROVIDER_SENDER_ID,
        SMS_PROVIDER_TEMPLATE_ID: process.env.SMS_PROVIDER_TEMPLATE_ID,
      },
      journeyPassportOtpConfig.providerTimeoutMs,
      journeyPassportOtpConfig.expirySeconds,
    );
    const result = await processJourneyPassportOtpSend(parsed.value.mobileNumber, { repository, smsProvider });

    if (result.outcome !== "sent") {
      return json({ ok: true, outcome: result.outcome }, 200);
    }
    if (result.smsStatus === "not-configured") {
      // Fail closed (EBC-R1.2-WS5-03 §9 leaves this choice explicitly open —
      // this is the resolution Rad chose, flagged for Archie confirmation):
      // no code was actually delivered, so the traveller must not be let
      // into the verify step. DEC-R1.2-006 requires a *verified* submission,
      // so silently bypassing delivery would defeat that decision.
      console.error("Journey Passport OTP send skipped — SMS provider not configured.");
      return json({ ok: true, outcome: "otp_unavailable" }, 200);
    }
    return json({ ok: true, outcome: "sent", challengeId: result.challengeId, resendDelaySeconds: journeyPassportOtpConfig.resendDelaySeconds }, 200);
  } catch {
    console.error("Journey Passport OTP send failed.", { operation: "otp_send" });
    return json({ ok: false, message: FAILURE_MESSAGE }, 503);
  }
}
