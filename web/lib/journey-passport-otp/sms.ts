import type { JourneyPassportOtpSmsProvider } from "./types";

type SmsEnvironment = { SMS_PROVIDER_API_KEY?: string; SMS_PROVIDER_SENDER_ID?: string; SMS_PROVIDER_TEMPLATE_ID?: string };

export class JourneyPassportOtpSmsError extends Error {
  constructor(readonly code: string) {
    super("Journey Passport OTP SMS delivery failed");
    this.name = "JourneyPassportOtpSmsError";
  }
}

/**
 * DEC-R1.2-016: MSG91 is the approved SMS provider, but the implementation
 * constraint attached to that decision requires it to sit behind this
 * interface so a future provider swap (e.g. the Twilio fallback named in
 * EBC-R1.2-WS5-01 §4.3) never touches OTP business logic (send / verify /
 * resend / attempt rules) — only this file's internals would change.
 */
function createMsg91Provider(
  apiKey: string,
  senderId: string,
  templateId: string,
  expirySeconds: number,
  timeoutMs: number,
  fetcher: typeof fetch,
): JourneyPassportOtpSmsProvider {
  return {
    async send(mobileNumber, code) {
      // MSG91's SendOTP API (/api/v5/otp) is DLT-template-driven (India TRAI
      // compliance — WS5-01 §11) and `template_id` is a mandatory parameter,
      // not optional — a request without it is rejected. The template itself
      // is created/approved on the MSG91 dashboard (sender id, sender name,
      // and message body — including the OTP placeholder — are all bound to
      // it there), which is why `sender` is still sent alongside it below:
      // public MSG91 documentation is inconsistent on whether a per-request
      // `sender` is still read once a template is in play, so it is left in
      // as a harmless no-op if ignored rather than removed on an assumption.
      // This should be confirmed against the actual MSG91 dashboard/account
      // once one exists (see the Engineering Completion Report) — no live
      // call to this endpoint has been made from this codebase yet.
      //
      // The template id is operational/Vercel-env configuration (obtained
      // when the India DLT template is registered — WS5-01 §11), not a code
      // constant, and the approved template's message body is expected to
      // place the code as a standalone number near the start of the message
      // to support OS-level SMS autofill (WS5-02 §6).
      const mobileDigits = mobileNumber.replace(/^\+/, "");
      // MSG91's own otp_expiry is in MINUTES (minimum 1), independent of and
      // redundant with SMV's own DB-side expiry (journey_passport_otp_challenges
      // .expires_at, driven by the same expirySeconds) — SMV never calls
      // MSG91's verify/resend-OTP endpoints and owns the pass/fail decision
      // itself (WS5-01 §4.3), so this value only affects how long MSG91
      // itself considers the code current; it cannot make SMV accept an
      // already-expired code. Rounded up so a sub-60s config value (the
      // config module's own minimum is 30s) never sends an invalid 0.
      const otpExpiryMinutes = Math.max(1, Math.ceil(expirySeconds / 60));
      let response: Response;
      try {
        response = await fetcher("https://control.msg91.com/api/v5/otp", {
          method: "POST",
          headers: { authkey: apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: mobileDigits, sender: senderId, template_id: templateId, otp: code, otp_expiry: otpExpiryMinutes,
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch {
        throw new JourneyPassportOtpSmsError("provider_unavailable");
      }
      if (!response.ok) throw new JourneyPassportOtpSmsError(response.status === 429 ? "provider_rate_limited" : "provider_rejected");
      return { status: "sent" };
    },
  };
}

/**
 * Fails closed when unconfigured — mirrors `email.ts`'s notifier returning
 * `{status:"not-configured"}` when Resend is unconfigured. Callers must
 * treat "not-configured" as "no code was delivered" and must not let the
 * traveller proceed to the verify step (see the send route). `templateId` is
 * required on the same basis as the API key/sender id: MSG91's SendOTP API
 * rejects a request without a `template_id`, so a request sent without one
 * configured would only surface as an opaque provider_rejected failure at
 * send time — treating it as "not configured" up front is the same
 * fail-closed posture, just diagnosed earlier and more clearly.
 */
export function createJourneyPassportOtpSmsProvider(
  environment: SmsEnvironment,
  timeoutMs: number,
  expirySeconds: number,
  fetcher: typeof fetch = fetch,
): JourneyPassportOtpSmsProvider {
  const apiKey = environment.SMS_PROVIDER_API_KEY?.trim();
  const senderId = environment.SMS_PROVIDER_SENDER_ID?.trim();
  const templateId = environment.SMS_PROVIDER_TEMPLATE_ID?.trim();
  if (!apiKey || !senderId || !templateId) {
    return { async send() { return { status: "not-configured" }; } };
  }
  return createMsg91Provider(apiKey, senderId, templateId, expirySeconds, timeoutMs, fetcher);
}
