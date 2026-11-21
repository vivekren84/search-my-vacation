/**
 * OTP Provider Error Classification & Diagnostics (Release 1.4 — TD-04)
 *
 * Distinguishes configuration, runtime, timeout, rate-limit, and provider
 * rejection outcomes for support diagnostics with PII-safe user messages and
 * actionable recovery guidance.
 */

import { maskPhoneForDiagnostics } from "../phone/phone-normalization.js";

export type OtpDiagnosticCode =
  | "CONFIG_ERROR"
  | "GATEWAY_TIMEOUT"
  | "RATE_LIMITED"
  | "CODE_MISMATCH"
  | "CODE_EXPIRED"
  | "ATTEMPTS_EXHAUSTED"
  | "PROVIDER_REJECTED"
  | "SESSION_NOT_FOUND"
  | "GENERIC_ERROR";

export type OtpDiagnosticCategory =
  | "configuration"
  | "network_timeout"
  | "rate_limiting"
  | "verification_failure"
  | "provider_rejection"
  | "lifecycle";

export interface OtpDiagnosticDetail {
  code: OtpDiagnosticCode;
  category: OtpDiagnosticCategory;
  httpStatus: number;
  userMessage: string;
  recoveryAction: string;
  isRetryable: boolean;
  retryDelaySeconds?: number;
}

export const OTP_DIAGNOSTIC_REGISTRY: Readonly<Record<OtpDiagnosticCode, OtpDiagnosticDetail>> = {
  CONFIG_ERROR: {
    code: "CONFIG_ERROR",
    category: "configuration",
    httpStatus: 503,
    userMessage: "Our instant verification service is undergoing maintenance. Please reach our journey team on WhatsApp.",
    recoveryAction: "Connect on WhatsApp or try again shortly.",
    isRetryable: false,
  },
  GATEWAY_TIMEOUT: {
    code: "GATEWAY_TIMEOUT",
    category: "network_timeout",
    httpStatus: 504,
    userMessage: "Network connection to the SMS gateway timed out. Please check your signal and request a new code.",
    recoveryAction: "Wait a moment and tap Resend Code.",
    isRetryable: true,
    retryDelaySeconds: 15,
  },
  RATE_LIMITED: {
    code: "RATE_LIMITED",
    category: "rate_limiting",
    httpStatus: 429,
    userMessage: "For your security, verification attempts are temporarily throttled. Please wait a moment before requesting another code.",
    recoveryAction: "Wait for the countdown timer before retrying.",
    isRetryable: true,
    retryDelaySeconds: 30,
  },
  CODE_MISMATCH: {
    code: "CODE_MISMATCH",
    category: "verification_failure",
    httpStatus: 400,
    userMessage: "The verification code entered does not match our records. Please double-check the 6-digit code.",
    recoveryAction: "Review SMS code and re-enter.",
    isRetryable: true,
  },
  CODE_EXPIRED: {
    code: "CODE_EXPIRED",
    category: "lifecycle",
    httpStatus: 410,
    userMessage: "This verification code has expired. Please request a fresh code to proceed.",
    recoveryAction: "Tap Resend Code for a fresh 6-digit code.",
    isRetryable: true,
  },
  ATTEMPTS_EXHAUSTED: {
    code: "ATTEMPTS_EXHAUSTED",
    category: "verification_failure",
    httpStatus: 429,
    userMessage: "Maximum verification attempts reached for this code. Please request a new code.",
    recoveryAction: "Request a new verification code.",
    isRetryable: true,
    retryDelaySeconds: 30,
  },
  PROVIDER_REJECTED: {
    code: "PROVIDER_REJECTED",
    category: "provider_rejection",
    httpStatus: 502,
    userMessage: "The mobile network could not deliver the SMS. Please ensure your number can receive SMS messages or contact support.",
    recoveryAction: "Verify mobile number format or switch to WhatsApp assistance.",
    isRetryable: true,
    retryDelaySeconds: 20,
  },
  SESSION_NOT_FOUND: {
    code: "SESSION_NOT_FOUND",
    category: "lifecycle",
    httpStatus: 404,
    userMessage: "Verification session could not be located or has expired. Please submit your details again.",
    recoveryAction: "Restart contact verification.",
    isRetryable: true,
  },
  GENERIC_ERROR: {
    code: "GENERIC_ERROR",
    category: "lifecycle",
    httpStatus: 500,
    userMessage: "We could not verify your code right now. Please try again in a moment.",
    recoveryAction: "Retry in a few moments.",
    isRetryable: true,
    retryDelaySeconds: 15,
  },
};

export function getOtpDiagnosticDetail(code: OtpDiagnosticCode): OtpDiagnosticDetail {
  return OTP_DIAGNOSTIC_REGISTRY[code] ?? OTP_DIAGNOSTIC_REGISTRY.GENERIC_ERROR;
}

export function classifyOtpOutcome(outcome: string, statusCode?: number): OtpDiagnosticDetail {
  switch (outcome) {
    case "resend_too_soon":
    case "resend_limit_exceeded":
    case "rate_limit_exceeded":
    case "cooldown_lockout":
      return OTP_DIAGNOSTIC_REGISTRY.RATE_LIMITED;
    case "otp_unavailable":
    case "not-configured":
      return OTP_DIAGNOSTIC_REGISTRY.CONFIG_ERROR;
    case "incorrect":
      return OTP_DIAGNOSTIC_REGISTRY.CODE_MISMATCH;
    case "expired":
      return OTP_DIAGNOSTIC_REGISTRY.CODE_EXPIRED;
    case "exhausted":
      return OTP_DIAGNOSTIC_REGISTRY.ATTEMPTS_EXHAUSTED;
    case "not_found":
      return OTP_DIAGNOSTIC_REGISTRY.SESSION_NOT_FOUND;
    case "provider_rejected":
      return OTP_DIAGNOSTIC_REGISTRY.PROVIDER_REJECTED;
    case "gateway_timeout":
    case "timeout":
      return OTP_DIAGNOSTIC_REGISTRY.GATEWAY_TIMEOUT;
    default:
      if (statusCode === 429) return OTP_DIAGNOSTIC_REGISTRY.RATE_LIMITED;
      if (statusCode === 504) return OTP_DIAGNOSTIC_REGISTRY.GATEWAY_TIMEOUT;
      if (statusCode === 503) return OTP_DIAGNOSTIC_REGISTRY.CONFIG_ERROR;
      if (statusCode === 404) return OTP_DIAGNOSTIC_REGISTRY.SESSION_NOT_FOUND;
      return OTP_DIAGNOSTIC_REGISTRY.GENERIC_ERROR;
  }
}

export function formatPiiSafeDiagnosticLog(
  code: OtpDiagnosticCode,
  mobileNumber?: string,
  extraContext?: Record<string, unknown>,
): Record<string, unknown> {
  const detail = getOtpDiagnosticDetail(code);
  return {
    diagnosticCode: detail.code,
    category: detail.category,
    httpStatus: detail.httpStatus,
    maskedMobile: mobileNumber ? maskPhoneForDiagnostics(mobileNumber) : undefined,
    isRetryable: detail.isRetryable,
    ...extraContext,
  };
}
