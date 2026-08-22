import { createHash, randomInt } from "node:crypto";

import type {
  JourneyPassportOtpChallengeResult,
  JourneyPassportOtpRepository,
  JourneyPassportOtpSendOutcome,
  JourneyPassportOtpVerifyOutcome,
  JourneyPassportOtpVerifyResult,
} from "./types";

const EXPECTED_SUPABASE_URL = "https://jbsefolhlfkplawiuvlu.supabase.co";

export class JourneyPassportOtpRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Journey Passport OTP repository operation failed");
    this.name = "JourneyPassportOtpRepositoryError";
  }
}

type SupabaseEnvironment = { NEXT_PUBLIC_SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string };
type OtpRpcConfig = { expirySeconds: number; resendDelaySeconds: number; maxResends: number; maxVerifyAttempts: number };

function createHeaders(secretKey: string) {
  return { apikey: secretKey, Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" };
}

/** Server-generated only, 6 digits, `crypto.randomInt` — never `Math.random()` (WS5-01 §4.1). */
export function generateOtpCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/**
 * Salted with the mobile number (per-challenge context) rather than a
 * separate stored salt column — the code is single-use and short-lived, so
 * this keeps the schema minimal while still never persisting a bare,
 * unsalted hash (WS5-01 §4.2). Never log the input or output of this
 * function — only the challenge id and a masked mobile number.
 */
export function hashOtpCode(code: string, mobileNumber: string) {
  return createHash("sha256").update(`${mobileNumber}:${code}`).digest("hex");
}

export function maskJourneyPassportOtpMobile(mobileNumber: string) {
  return mobileNumber.length > 5 ? `${mobileNumber.slice(0, 3)}****${mobileNumber.slice(-2)}` : "****";
}

export function createSupabaseJourneyPassportOtpRepository(
  environment: SupabaseEnvironment,
  config: OtpRpcConfig,
  fetcher: typeof fetch = fetch,
): JourneyPassportOtpRepository {
  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();
  if (projectUrl !== EXPECTED_SUPABASE_URL || !secretKey) throw new JourneyPassportOtpRepositoryError("database_not_configured");
  // Re-bind as explicitly-typed consts so TS retains the narrowing across the
  // nested rpc() closure below (mirrors journey-leads/repository.ts's shape,
  // but this file's tsconfig/nesting combination otherwise widens both back
  // to `string | undefined` inside the closure).
  const verifiedProjectUrl: string = projectUrl;
  const verifiedSecretKey: string = secretKey;

  async function rpc(name: string, body: Record<string, unknown>, code: string) {
    let response: Response;
    try {
      response = await fetcher(`${verifiedProjectUrl}/rest/v1/rpc/${name}`, {
        method: "POST", headers: createHeaders(verifiedSecretKey), body: JSON.stringify(body), signal: AbortSignal.timeout(7000),
      });
    } catch {
      throw new JourneyPassportOtpRepositoryError("database_unavailable");
    }
    if (!response.ok) throw new JourneyPassportOtpRepositoryError(code);
    return response.json();
  }

  return {
    async createOrResendChallenge(mobileNumber, otpHash): Promise<JourneyPassportOtpChallengeResult> {
      const rows = await rpc("send_journey_passport_otp", {
        p_mobile_number: mobileNumber,
        p_otp_hash: otpHash,
        p_expiry_seconds: config.expirySeconds,
        p_resend_delay_seconds: config.resendDelaySeconds,
        p_max_resends: config.maxResends,
      }, "otp_send_failed") as Array<{ challenge_id: string | null; resend_count: number | null; outcome: string }>;
      const row = rows[0];
      if (!row) throw new JourneyPassportOtpRepositoryError("otp_send_failed");
      return {
        challengeId: row.challenge_id ?? "",
        resendCount: row.resend_count ?? 0,
        outcome: row.outcome as JourneyPassportOtpSendOutcome,
      };
    },

    async verifyChallenge(mobileNumber, challengeId, otpHash): Promise<JourneyPassportOtpVerifyResult> {
      const rows = await rpc("verify_journey_passport_otp", {
        p_mobile_number: mobileNumber,
        p_challenge_id: challengeId,
        p_otp_hash: otpHash,
        p_max_attempts: config.maxVerifyAttempts,
      }, "otp_verify_failed") as Array<{ outcome: string; verification_token: string | null; attempts_remaining: number | null }>;
      const row = rows[0];
      if (!row) throw new JourneyPassportOtpRepositoryError("otp_verify_failed");
      const result: JourneyPassportOtpVerifyResult = { outcome: row.outcome as JourneyPassportOtpVerifyOutcome };
      if (row.verification_token) result.verificationToken = row.verification_token;
      if (typeof row.attempts_remaining === "number") result.attemptsRemaining = row.attempts_remaining;
      return result;
    },

    async consumeVerificationToken(mobileNumber, verificationToken) {
      const result = await rpc("consume_journey_passport_otp_token", {
        p_mobile_number: mobileNumber,
        p_verification_token: verificationToken,
      }, "otp_token_consume_failed");
      return result === true;
    },
  };
}
