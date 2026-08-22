export type JourneyPassportOtpSendOutcome = "sent" | "resend_too_soon" | "resend_limit_exceeded" | "invalid_request";
export type JourneyPassportOtpVerifyOutcome = "verified" | "incorrect" | "expired" | "exhausted" | "not_found";

export type JourneyPassportOtpChallengeResult = {
  challengeId: string;
  resendCount: number;
  outcome: JourneyPassportOtpSendOutcome;
};

export type JourneyPassportOtpVerifyResult = {
  outcome: JourneyPassportOtpVerifyOutcome;
  verificationToken?: string;
  attemptsRemaining?: number;
};

export interface JourneyPassportOtpRepository {
  createOrResendChallenge(mobileNumber: string, otpHash: string): Promise<JourneyPassportOtpChallengeResult>;
  verifyChallenge(mobileNumber: string, challengeId: string, otpHash: string): Promise<JourneyPassportOtpVerifyResult>;
  consumeVerificationToken(mobileNumber: string, verificationToken: string): Promise<boolean>;
}

export interface JourneyPassportOtpSmsProvider {
  send(mobileNumber: string, code: string): Promise<{ status: "sent" } | { status: "not-configured" }>;
}
