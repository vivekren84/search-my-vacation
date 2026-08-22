export const JOURNEY_PASSPORT_OTP_FAILURE_MESSAGE = "We couldn’t send that code just now. Please try again in a moment.";

export class JourneyPassportOtpError extends Error {
  constructor(readonly code: string = "otp_failed") {
    super(JOURNEY_PASSPORT_OTP_FAILURE_MESSAGE);
    this.name = "JourneyPassportOtpError";
  }
}

export type JourneyPassportOtpSendResponse = {
  outcome: "sent" | "resend_too_soon" | "resend_limit_exceeded" | "otp_unavailable";
  challengeId?: string;
  resendDelaySeconds?: number;
};

export async function sendJourneyPassportOtp(
  mobileNumber: string,
  fetcher: typeof fetch = fetch,
): Promise<JourneyPassportOtpSendResponse> {
  let response: Response;
  try {
    response = await fetcher("/api/journey-passport/otp/send", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobileNumber }),
    });
  } catch {
    throw new JourneyPassportOtpError("network_error");
  }
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("ok" in result)) throw new JourneyPassportOtpError();
  const body = result as Record<string, unknown>;
  if (body.ok !== true) throw new JourneyPassportOtpError(typeof body.code === "string" ? body.code : "otp_failed");
  return {
    outcome: body.outcome as JourneyPassportOtpSendResponse["outcome"],
    challengeId: typeof body.challengeId === "string" ? body.challengeId : undefined,
    resendDelaySeconds: typeof body.resendDelaySeconds === "number" ? body.resendDelaySeconds : undefined,
  };
}

export type JourneyPassportOtpVerifyResponse = {
  outcome: "verified" | "incorrect" | "expired" | "exhausted" | "not_found";
  verificationToken?: string;
  attemptsRemaining?: number;
};

export async function verifyJourneyPassportOtp(
  mobileNumber: string,
  challengeId: string,
  code: string,
  fetcher: typeof fetch = fetch,
): Promise<JourneyPassportOtpVerifyResponse> {
  let response: Response;
  try {
    response = await fetcher("/api/journey-passport/otp/verify", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobileNumber, challengeId, code }),
    });
  } catch {
    throw new JourneyPassportOtpError("network_error");
  }
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("ok" in result)) throw new JourneyPassportOtpError();
  const body = result as Record<string, unknown>;
  if (body.ok !== true) throw new JourneyPassportOtpError(typeof body.code === "string" ? body.code : "otp_failed");
  return {
    outcome: body.outcome as JourneyPassportOtpVerifyResponse["outcome"],
    verificationToken: typeof body.verificationToken === "string" ? body.verificationToken : undefined,
    attemptsRemaining: typeof body.attemptsRemaining === "number" ? body.attemptsRemaining : undefined,
  };
}
