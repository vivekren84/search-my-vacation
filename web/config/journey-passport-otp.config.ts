// EBC-R1.2-WS5-03 §5: every Journey Passport OTP operational value is
// environment-variable-configurable (Release 1.2's first precedent for a
// behavioural, not compile-time, config module — see EBC-R1.2-WS5-01 §2.5).
// Read once at module load, validated and defaulted, never re-read
// mid-request, and consumed only through this module — never scattered
// `process.env` reads across files.

function readPositiveInt(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < min || parsed > max) {
    console.error(`Invalid ${name}="${raw}" — falling back to default ${fallback}.`);
    return fallback;
  }
  return parsed;
}

export const journeyPassportOtpConfig = {
  /** JOURNEY_PASSPORT_OTP_EXPIRY_SECONDS — default 300 (5 min). */
  expirySeconds: readPositiveInt("JOURNEY_PASSPORT_OTP_EXPIRY_SECONDS", 300, 30, 3600),
  /** JOURNEY_PASSPORT_OTP_RESEND_DELAY_SECONDS — default 30. */
  resendDelaySeconds: readPositiveInt("JOURNEY_PASSPORT_OTP_RESEND_DELAY_SECONDS", 30, 0, 3600),
  /** JOURNEY_PASSPORT_OTP_MAX_RESENDS — default 2, per the approved decision. */
  maxResends: readPositiveInt("JOURNEY_PASSPORT_OTP_MAX_RESENDS", 2, 0, 10),
  /** JOURNEY_PASSPORT_OTP_MAX_VERIFY_ATTEMPTS — default 5. */
  maxVerifyAttempts: readPositiveInt("JOURNEY_PASSPORT_OTP_MAX_VERIFY_ATTEMPTS", 5, 1, 20),
  /** JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS — default 600. */
  rateLimitWindowSeconds: readPositiveInt("JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS", 600, 10, 86400),
  /** JOURNEY_PASSPORT_OTP_RATE_LIMIT_MAX — default 5. */
  rateLimitMax: readPositiveInt("JOURNEY_PASSPORT_OTP_RATE_LIMIT_MAX", 5, 1, 1000),
  /** JOURNEY_PASSPORT_OTP_PROVIDER_TIMEOUT_MS — default 7000, matching the existing AbortSignal.timeout(7000) convention. */
  providerTimeoutMs: readPositiveInt("JOURNEY_PASSPORT_OTP_PROVIDER_TIMEOUT_MS", 7000, 1000, 30000),
} as const;
