/**
 * SMV Observability & Diagnostic Logging (Release 1.3 Milestone 1 — TD-08)
 *
 * Implements structured, machine-parseable logging for critical API routes
 * (OTP, lead storage, callback preferences, Journey Director).
 *
 * Strict Privacy & Governance Guardrails:
 * 1. Zero raw PII in production logs: mobile numbers, guest names, tokens, and
 *    passwords/hashes must never appear in unredacted form.
 * 2. Causal Error Preservation: preserves error codes, messages, and names
 *    from underlying services (Supabase/PostgREST, SMS gateway, Resend).
 * 3. Request Correlation: attaches `correlationId` to trace requests end-to-end.
 */

import { randomUUID } from "node:crypto";

const SENSITIVE_KEYS = new Set([
  "mobilenumber",
  "mobile",
  "mobilee164",
  "mobilenormalized",
  "phone",
  "phonenumber",
  "guestname",
  "name",
  "otp",
  "code",
  "otphash",
  "hash",
  "verificationtoken",
  "token",
  "secretkey",
  "apikey",
  "authorization",
]);

import { maskPhoneForDiagnostics } from "../phone/phone-normalization";

/**
 * Masks a mobile number to show only country prefix and last 2 digits.
 * Example: "+919876543210" -> "+91 ****** 10"
 * Centralized in web/lib/phone/phone-normalization.ts (Release 1.4 - TD-03)
 */
export function maskDiagnosticsMobile(value: unknown): string {
  return maskPhoneForDiagnostics(value);
}

/**
 * Masks a guest name to initials only.
 * Example: "Vivek Renganathan" -> "V. R."
 */
export function maskDiagnosticsName(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) return "[empty]";
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase()}.`)
    .join(" ");
}

/**
 * Masks a passport reference, preserving prefix and last 2 characters.
 * Example: "SMV-ABCD2345" -> "SMV-AB****45"
 */
export function maskDiagnosticsReference(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) return "[empty]";
  const trimmed = value.trim();
  if (trimmed.length <= 6) return "******";
  return `${trimmed.slice(0, 6)}****${trimmed.slice(-2)}`;
}

/**
 * Safely extracts causal error details without dropping error codes or messages.
 */
export function extractCausalError(error: unknown): Record<string, unknown> {
  if (!error) return { message: "unknown_error" };
  if (error instanceof Error) {
    const details: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };
    if ("code" in error && typeof (error as Record<string, unknown>).code === "string") {
      details.code = (error as Record<string, unknown>).code;
    }
    if ("status" in error && typeof (error as Record<string, unknown>).status === "number") {
      details.status = (error as Record<string, unknown>).status;
    }
    if (process.env.NODE_ENV !== "production" && error.stack) {
      details.stack = error.stack;
    }
    return details;
  }
  if (typeof error === "object") {
    return { ...error };
  }
  return { message: String(error) };
}

/**
 * Recursively redacts sensitive keys from log contexts.
 */
export function redactSensitiveContext(obj: unknown, depth = 0): unknown {
  if (depth > 5) return "[max_depth]";
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveContext(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      if (lowerKey.includes("mobile") || lowerKey.includes("phone")) {
        result[key] = maskDiagnosticsMobile(val);
      } else if (lowerKey.includes("name")) {
        result[key] = maskDiagnosticsName(val);
      } else {
        result[key] = "[REDACTED]";
      }
    } else if (lowerKey.includes("reference") || lowerKey.includes("passport")) {
      result[key] = maskDiagnosticsReference(val);
    } else if (typeof val === "object" && val !== null) {
      result[key] = redactSensitiveContext(val, depth + 1);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export type DiagnosticLogLevel = "info" | "warn" | "error";

export interface DiagnosticLogEvent {
  event: string;
  level: DiagnosticLogLevel;
  correlationId: string;
  context?: Record<string, unknown>;
  error?: unknown;
  durationMs?: number;
}

/**
 * Resolves or generates a correlation ID from request headers.
 */
export function resolveCorrelationId(request?: Request): string {
  if (!request) return randomUUID();
  const fromHeader = request.headers.get("x-smv-correlation-id") || request.headers.get("x-request-id");
  if (fromHeader && fromHeader.trim().length > 0) {
    return fromHeader.trim().slice(0, 64);
  }
  return randomUUID();
}

/**
 * Emits a structured diagnostic log event.
 */
export function emitDiagnosticLog({
  event,
  level,
  correlationId,
  context,
  error,
  durationMs,
}: DiagnosticLogEvent): void {
  const payload: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    event,
    correlationId,
  };

  if (typeof durationMs === "number") {
    payload.durationMs = Math.round(durationMs * 100) / 100;
  }

  if (context) {
    payload.context = redactSensitiveContext(context);
  }

  if (error) {
    payload.error = extractCausalError(error);
  }

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}
