import { parseJourneyPassportMobile } from "@/lib/journey-leads/validation";

const TOP_LEVEL_SEND_KEYS = new Set(["mobileNumber"]);
const TOP_LEVEL_VERIFY_KEYS = new Set(["mobileNumber", "challengeId", "code"]);
const CHALLENGE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE_PATTERN = /^\d{6}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

export type JourneyPassportOtpSendValidationResult =
  // `mobileNumber` here is always the E.164-normalised form (e.g. "+919876543210"),
  // never the raw traveller-entered string — every downstream OTP module (repository,
  // service, SMS provider) keys strictly on E.164 to match the challenges table's
  // `^\+[1-9][0-9]{7,18}$` constraint.
  | { ok: true; value: { mobileNumber: string } }
  | { ok: false; code: string };

export function parseJourneyPassportOtpSendRequest(value: unknown): JourneyPassportOtpSendValidationResult {
  if (!isRecord(value) || !hasOnlyKeys(value, TOP_LEVEL_SEND_KEYS)) return { ok: false, code: "invalid_request" };
  const rawMobile = typeof value.mobileNumber === "string" ? value.mobileNumber.trim() : "";
  const parsed = parseJourneyPassportMobile(rawMobile);
  if (!parsed) return { ok: false, code: "invalid_mobile_number" };
  return { ok: true, value: { mobileNumber: parsed.e164 } };
}

export type JourneyPassportOtpVerifyValidationResult =
  | { ok: true; value: { mobileNumber: string; challengeId: string; code: string } }
  | { ok: false; code: string };

export function parseJourneyPassportOtpVerifyRequest(value: unknown): JourneyPassportOtpVerifyValidationResult {
  if (!isRecord(value) || !hasOnlyKeys(value, TOP_LEVEL_VERIFY_KEYS)) return { ok: false, code: "invalid_request" };
  const rawMobile = typeof value.mobileNumber === "string" ? value.mobileNumber.trim() : "";
  const challengeId = typeof value.challengeId === "string" ? value.challengeId.trim() : "";
  const code = typeof value.code === "string" ? value.code.trim() : "";
  const parsed = parseJourneyPassportMobile(rawMobile);
  if (!parsed) return { ok: false, code: "invalid_mobile_number" };
  if (!CHALLENGE_ID_PATTERN.test(challengeId)) return { ok: false, code: "invalid_challenge" };
  if (!CODE_PATTERN.test(code)) return { ok: false, code: "invalid_code" };
  return { ok: true, value: { mobileNumber: parsed.e164, challengeId, code } };
}
