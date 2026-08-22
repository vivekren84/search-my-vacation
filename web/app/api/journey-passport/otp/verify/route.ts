import { journeyPassportOtpConfig } from "@/config/journey-passport-otp.config";
import { consumeJourneyLeadRateLimit, journeyLeadRateLimitKey } from "@/lib/journey-leads/rate-limit";
import { createSupabaseJourneyPassportOtpRepository } from "@/lib/journey-passport-otp/repository";
import { processJourneyPassportOtpVerify } from "@/lib/journey-passport-otp/service";
import { parseJourneyPassportOtpVerifyRequest } from "@/lib/journey-passport-otp/validation";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 2 * 1024;
const FAILURE_MESSAGE = "We couldn’t check that code just now. Please try again.";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
  if (!consumeJourneyLeadRateLimit(`otp-verify:${journeyLeadRateLimitKey(request)}`)) return json({ ok: false, message: FAILURE_MESSAGE }, 429);

  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return json({ ok: false, message: FAILURE_MESSAGE }, 413);
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, message: FAILURE_MESSAGE }, 400);
  }

  const parsed = parseJourneyPassportOtpVerifyRequest(raw);
  if (!parsed.ok) return json({ ok: false, code: parsed.code, message: FAILURE_MESSAGE }, 400);

  try {
    const repository = createSupabaseJourneyPassportOtpRepository(
      { NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY },
      journeyPassportOtpConfig,
    );
    const result = await processJourneyPassportOtpVerify(parsed.value.mobileNumber, parsed.value.challengeId, parsed.value.code, repository);
    return json({
      ok: true,
      outcome: result.outcome,
      ...(result.verificationToken ? { verificationToken: result.verificationToken } : {}),
      ...(typeof result.attemptsRemaining === "number" ? { attemptsRemaining: result.attemptsRemaining } : {}),
    }, 200);
  } catch {
    console.error("Journey Passport OTP verify failed.", { operation: "otp_verify" });
    return json({ ok: false, message: FAILURE_MESSAGE }, 503);
  }
}
