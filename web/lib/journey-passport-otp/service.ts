import { generateOtpCode, hashOtpCode, maskJourneyPassportOtpMobile } from "./repository";
import type {
  JourneyPassportOtpRepository,
  JourneyPassportOtpSendOutcome,
  JourneyPassportOtpSmsProvider,
  JourneyPassportOtpVerifyResult,
} from "./types";

export type JourneyPassportOtpSendServiceResult = {
  challengeId: string;
  outcome: JourneyPassportOtpSendOutcome;
  /** Present only when outcome === "sent". */
  smsStatus?: "sent" | "not-configured";
};

export async function processJourneyPassportOtpSend(
  mobileNumber: string,
  dependencies: { repository: JourneyPassportOtpRepository; smsProvider: JourneyPassportOtpSmsProvider },
): Promise<JourneyPassportOtpSendServiceResult> {
  const { repository, smsProvider } = dependencies;
  const code = generateOtpCode();
  const otpHash = hashOtpCode(code, mobileNumber);
  const result = await repository.createOrResendChallenge(mobileNumber, otpHash);

  if (result.outcome !== "sent") {
    return { challengeId: result.challengeId, outcome: result.outcome };
  }

  try {
    const delivery = await smsProvider.send(mobileNumber, code);
    return { challengeId: result.challengeId, outcome: "sent", smsStatus: delivery.status };
  } catch (error) {
    console.error("Journey Passport OTP SMS delivery failed.", {
      mobile: maskJourneyPassportOtpMobile(mobileNumber),
      code: error instanceof Error ? error.message : "unknown",
    });
    // The challenge row is already `pending` with a valid, unexpired code
    // (WS5-01 §7: "Challenge row remains pending; traveller sees a clear,
    // non-technical failure message and a retry/resend option"). We do not
    // invalidate it here — a resend (or the provider recovering) can still
    // succeed against the same challenge.
    return { challengeId: result.challengeId, outcome: "sent", smsStatus: "not-configured" };
  }
}

export async function processJourneyPassportOtpVerify(
  mobileNumber: string,
  challengeId: string,
  code: string,
  repository: JourneyPassportOtpRepository,
): Promise<JourneyPassportOtpVerifyResult> {
  const otpHash = hashOtpCode(code, mobileNumber);
  return repository.verifyChallenge(mobileNumber, challengeId, otpHash);
}
