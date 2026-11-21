/**
 * Centralized Mobile Number Normalization & Parsing Utility (Release 1.4 — TD-03)
 *
 * Single shared source of truth for:
 * 1. E.164 normalization for Supabase storage and OTP provider delivery
 * 2. 10-digit national number extraction and sanitization
 * 3. Mobile capability validation (rejecting fixed-lines/landlines via libphonenumber-js/max)
 * 4. Masked UI formatting for traveller reassurance (+91 98765 ••210)
 * 5. PII-safe diagnostic log masking (+91 ****** 10)
 */

import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export const DEFAULT_PHONE_COUNTRY: CountryCode = "IN";

export interface ParsedMobilePhone {
  e164: string;
  nationalNumber: string;
  country: CountryCode;
  countryCallingCode: string;
}

/**
 * Strips all non-digit characters from a phone number string.
 */
export function normalizeNationalDigits(value: string): string {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "");
}

/**
 * Comprehensive parser for mobile numbers using libphonenumber-js/max.
 * Validates structural validity AND verifies the number is mobile-capable
 * (rejects fixed-line/landline numbers which cannot receive OTP SMS).
 */
export function parseMobileNumber(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): ParsedMobilePhone | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const trimmed = value.trim();
  const parsed = parsePhoneNumberFromString(trimmed, defaultCountry);

  if (!parsed || !parsed.isValid()) return null;

  const type = parsed.getType();
  // Ensure the phone is mobile-capable
  if (type !== "MOBILE" && type !== "FIXED_LINE_OR_MOBILE") {
    return null;
  }

  return {
    e164: parsed.number,
    nationalNumber: parsed.nationalNumber,
    country: (parsed.country as CountryCode) || defaultCountry,
    countryCallingCode: parsed.countryCallingCode,
  };
}

/**
 * Checks whether a phone number represents a valid, mobile-capable number.
 */
export function isValidMobileNumber(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): boolean {
  return parseMobileNumber(value, defaultCountry) !== null;
}

/**
 * Converts any valid mobile number string to strict canonical E.164 format.
 * Returns null if the number is invalid or cannot receive SMS.
 */
export function normalizeE164(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string | null {
  const parsed = parseMobileNumber(value, defaultCountry);
  return parsed ? parsed.e164 : null;
}

/**
 * Masks a mobile number for traveller-facing UI display (DEC-R1.2-017 / WS5-02 §2):
 * E.g. "+91 98765 ••210" (country code + leading 5 digits + last 3 digits visible).
 */
export function maskPhoneForDisplay(
  rawMobile: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string {
  if (typeof rawMobile !== "string") return "your number";

  const parsed = parseMobileNumber(rawMobile, defaultCountry);
  const nationalDigits = parsed ? parsed.nationalNumber : rawMobile.replace(/\D/g, "");
  const countryCode = parsed ? parsed.countryCallingCode : "91";

  if (nationalDigits.length !== 10) return "your number";

  const leading = nationalDigits.slice(0, 5);
  const last3 = nationalDigits.slice(-3);
  const maskedCount = Math.max(nationalDigits.length - leading.length - last3.length, 0);

  return `+${countryCode} ${leading} ${"•".repeat(maskedCount)}${last3}`;
}

/**
 * Masks a mobile number for diagnostic logging (PII protection - TD-08):
 * E.g. "+919876543210" -> "+91 ****** 10" or "9876543210" -> "****** 10"
 */
export function maskPhoneForDiagnostics(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) return "[empty]";
  const trimmed = value.trim();

  if (trimmed.startsWith("+91") && trimmed.length >= 5) {
    return `+91 ****** ${trimmed.slice(-2)}`;
  }
  if (trimmed.startsWith("+") && trimmed.length >= 6) {
    const match = trimmed.match(/^(\+\d{1,3})/);
    const prefix = match ? match[1] : "+";
    return `${prefix} ****** ${trimmed.slice(-2)}`;
  }
  if (trimmed.length >= 6) {
    return `****** ${trimmed.slice(-2)}`;
  }

  return "******";
}
