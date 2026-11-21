/**
 * Standardized Journey Passport Validation Rules (Release 1.4 — TD-05)
 *
 * Single source of truth for validating traveller inputs across:
 * 1. Initial Moment Steps (StepAboutYou, StepCompanions, PaceAndTiming)
 * 2. Editable Review Screens (DiscoverMoment)
 * 3. Pre-OTP Closure Contact Details Capture (ClosureContactStage / JourneyPassport)
 * 4. Draft Restoration & Sanitation (useJourneyPassport)
 */

import { isValidMobileNumber, normalizeNationalDigits } from "../phone/phone-normalization";
import { hasNumericCharacter, sanitizeTravellerName } from "./traveller-name";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;

export const PASSPORT_VALIDATION_MESSAGES = {
  NAME_REQUIRED: "Please share the name you would like us to use.",
  NAME_INVALID: "Please enter a valid name using letters, spaces, or hyphens (2–80 characters).",
  MOBILE_REQUIRED: "Please enter your mobile number to receive your verification code.",
  MOBILE_INVALID: "Please enter a valid 10-digit mobile number.",
  DATES_REQUIRED: "Please select both a start date and an end date.",
  DATES_PAST: "Departure date cannot be in the past.",
  DATES_SEQUENCE: "Return date must be after your departure date.",
  TRAVEL_STYLES_COUNT: "Please choose between 1 and 3 travel styles that feel right for you.",
} as const;

export function getLocalToday(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

/**
 * Validates a traveller name against canonical SMV rules (DEC-R1.2-011):
 * - 2 to 80 characters
 * - Must contain at least one Unicode letter (\p{L})
 * - Must NOT contain any decimal digits (\p{Nd})
 */
export function validateTravellerName(rawName: string): { isValid: boolean; error?: string } {
  if (typeof rawName !== "string") {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.NAME_REQUIRED };
  }

  const cleaned = rawName.trim();
  if (cleaned.length < NAME_MIN_LENGTH) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.NAME_REQUIRED };
  }

  if (cleaned.length > NAME_MAX_LENGTH || !/\p{L}/u.test(cleaned) || hasNumericCharacter(cleaned)) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.NAME_INVALID };
  }

  return { isValid: true };
}

export function isValidTravellerName(rawName: string): boolean {
  return validateTravellerName(rawName).isValid;
}

/**
 * Validates a traveller mobile number (TD-03 & TD-05):
 * Must be a 10-digit mobile-capable number (or valid E.164) that is non-zeroed.
 */
export function validateTravellerMobile(rawMobile: string): { isValid: boolean; error?: string } {
  if (typeof rawMobile !== "string") {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.MOBILE_REQUIRED };
  }

  const trimmed = rawMobile.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.MOBILE_REQUIRED };
  }

  const digits = normalizeNationalDigits(trimmed);
  if (digits.length !== 10 || digits === "0000000000" || !isValidMobileNumber(trimmed)) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.MOBILE_INVALID };
  }

  return { isValid: true };
}

export function isValidTravellerMobile(rawMobile: string): boolean {
  return validateTravellerMobile(rawMobile).isValid;
}

/**
 * Validates travel dates when timing is 'Exact Dates'.
 */
export function validatePassportDates(
  timing: string,
  startDate?: string,
  endDate?: string,
): { isValid: boolean; error?: string } {
  if (timing !== "Exact Dates") {
    return { isValid: true };
  }

  if (!startDate || !endDate) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.DATES_REQUIRED };
  }

  const today = getLocalToday();
  if (startDate < today) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.DATES_PAST };
  }

  if (endDate <= startDate) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.DATES_SEQUENCE };
  }

  return { isValid: true };
}

export function hasValidPassportDates(timing: string, startDate?: string, endDate?: string): boolean {
  return validatePassportDates(timing, startDate, endDate).isValid;
}

/**
 * Validates travel styles selection (1 to 3 items).
 */
export function validateTravelStyles(styles: string[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(styles) || styles.length < 1 || styles.length > 3) {
    return { isValid: false, error: PASSPORT_VALIDATION_MESSAGES.TRAVEL_STYLES_COUNT };
  }
  return { isValid: true };
}

export function hasValidTravelStyles(styles: string[]): boolean {
  return validateTravelStyles(styles).isValid;
}

export { sanitizeTravellerName };
