import { parsePhoneNumberFromString } from "libphonenumber-js/max";

import { isCallbackTimeWindow, isValidCallbackDate } from "../callback-preferences";

import type { JourneyCallbackSubmission, JourneyLeadPassportSummary, JourneyLeadSubmission, ValidatedJourneyCallback, ValidatedJourneyLead } from "./types";

const PASSPORT_REFERENCE_PATTERN = /^(?:SMV-[A-Z2-9]{8}|JY-[A-Z2-9]{4}-[A-Z2-9]{4})$/;
// Journey Passport leads (parseJourneyLeadSubmission) AND Callback Request
// (parseJourneyCallbackSubmission) both use this bare-10-digit/India-only
// pattern for mobileNumber/mobileNormalized. This is deliberate: the Product
// Owner approved a dual-field strategy (EBC-R1.2-WS5-03 architectural
// deviation resolution) after implementation surfaced that widening this
// format to E.164 silently broke the existing Callback RPC's equality match
// against mobile_normalized (claim_journey_passport_callback). mobileNumber/
// mobileNormalized therefore keep their original bare-digit contract
// unchanged for BOTH paths; a separate mobileE164 field (Journey Passport
// leads only, see parseJourneyPassportMobile below) carries the E.164 form
// for OTP verification / SMS delivery and future international-phone use.
const MOBILE_NUMBER_PATTERN = /^\d{10}$/;
const MOBILE_REJECTED_NUMBERS = new Set(["0000000000"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TOP_LEVEL_KEYS = new Set(["passportReference", "guestName", "mobileNumber", "verificationToken", "passportSummary"]);
const SUMMARY_KEYS = new Set([
  "name", "mobile", "journeyReference", "companion", "dreamJourney", "travelStyles", "timing",
  "startDate", "endDate", "destinationMode", "destination", "travelScope", "entryContext", "completedAt", "source",
]);
const ENTRY_KEYS = new Set(["feeling", "experience", "inspiration", "destination", "destinationTheme", "source"]);
// EBC-036 (D-08): Memory Maker now enters via `?mood=memory` (see
// entry-context.ts moodPreselections), so "memory" is a legitimate feeling
// value that must be accepted here — otherwise every Memory Maker lead
// submission would be rejected as an invalid passport summary.
const FEELINGS = new Set(["relax", "explore", "celebrate", "romance", "escape", "memory"]);
const EXPERIENCES = new Set(["Memory Makers", "Celebration Moments", "Family Time", "Weekend Getaways", "Global Escapes", "Nature & Serenity"]);
// EBC-030: governed Travel Inspiration stable IDs (replaces the previous
// ad-hoc Mountains/Beaches/Wildlife/Romance/Relaxation set).
const INSPIRATIONS = new Set([
  "feeling-led",
  "slow-unhurried",
  "family-time",
  "short-restorative-escape",
  "food-culture-local",
  "nature-led",
  "travel-celebration",
  "first-international",
]);
const DESTINATION_THEMES = new Set(["Tropical Escape", "Mountain Retreat", "City Discovery", "Wildlife Adventure"]);
const CALLBACK_KEYS = new Set([
  "passportReference", "guestName", "mobileNumber", "preferredDate", "preferredTimeWindow", "additionalComments",
]);

// EBC-R1.2-WS5-01 §3 / DEC-R1.2-002: default country India, full E.164
// storage. The country-selector UI itself (R1.2-05.01–05.14) is a separate,
// out-of-scope track for this brief — this only changes how a bare national
// number is *parsed and stored*, not the input field's UI.
const DEFAULT_MOBILE_COUNTRY = "IN";

export type JourneyLeadValidationResult =
  | { ok: true; value: ValidatedJourneyLead }
  | { ok: false; code: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function cleanSingleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function boundedString(value: unknown, min: number, max: number) {
  return typeof value === "string" && cleanSingleLine(value).length >= min && cleanSingleLine(value).length <= max;
}

export function isJourneyPassportReference(value: unknown): value is string {
  return typeof value === "string" && PASSPORT_REFERENCE_PATTERN.test(value);
}

export function normalizeJourneyMobile(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Journey Passport-only E.164 phone parsing (libphonenumber-js, DEC-R1.2-017),
 * default country India (DEC-R1.2-002). Used as an ADDITIONAL gate on top of
 * MOBILE_NUMBER_PATTERN (not a replacement for it — see the dual-field note
 * above): rejects fixed-line-shaped 10-digit numbers that would otherwise
 * pass the bare digit-count pattern (SMS/OTP delivery is meaningless to a
 * landline), and supplies the E.164 string stored separately as mobileE164
 * for OTP verification / SMS delivery (EBC-R1.2-WS5-01 §3). Returns null for
 * anything libphonenumber-js cannot parse as a structurally valid number.
 */
export function parseJourneyPassportMobile(value: string): { e164: string; national: string } | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const parsed = parsePhoneNumberFromString(value.trim(), DEFAULT_MOBILE_COUNTRY);
  if (!parsed || !parsed.isValid()) return null;
  // The default/`min` libphonenumber-js metadata bundle has no type-classification
  // data, so isValid() alone accepts many non-mobile-shaped numbers (e.g. India
  // fixed-line ranges). The `/max` bundle imported above restores getType(), so we
  // additionally require a genuinely mobile-capable number here — OTP delivery via
  // SMS is meaningless to a fixed-line number.
  const type = parsed.getType();
  if (type !== "MOBILE" && type !== "FIXED_LINE_OR_MOBILE") return null;
  return { e164: parsed.number, national: parsed.nationalNumber };
}

export function isValidJourneyPassportMobile(value: string): boolean {
  return parseJourneyPassportMobile(value) !== null;
}

export function parseNotificationRecipients(value: string | undefined) {
  if (!value) return [];
  const seen = new Set<string>();
  return value.split(",").map((item) => item.trim()).filter((item) => {
    const normalized = item.toLowerCase();
    if (!EMAIL_PATTERN.test(item) || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function isValidNotificationSender(value: string | undefined): value is string {
  return typeof value === "string" && EMAIL_PATTERN.test(value.trim());
}

function parseEntryContext(value: unknown): JourneyLeadPassportSummary["entryContext"] | null {
  if (value === undefined) return {};
  if (!isRecord(value) || !hasOnlyKeys(value, ENTRY_KEYS)) return null;
  if (value.feeling !== undefined && (typeof value.feeling !== "string" || !FEELINGS.has(value.feeling))) return null;
  if (value.experience !== undefined && (typeof value.experience !== "string" || !EXPERIENCES.has(value.experience))) return null;
  if (value.inspiration !== undefined && (typeof value.inspiration !== "string" || !INSPIRATIONS.has(value.inspiration))) return null;
  if (value.destination !== undefined && !boundedString(value.destination, 0, 100)) return null;
  if (value.destinationTheme !== undefined && (typeof value.destinationTheme !== "string" || !DESTINATION_THEMES.has(value.destinationTheme))) return null;
  if (value.source !== undefined && value.source !== "homepage" && value.source !== "direct" && value.source !== "experience" && value.source !== "mood" && value.source !== "inspiration" && value.source !== "destination") return null;
  return {
    ...(typeof value.feeling === "string" ? { feeling: value.feeling as NonNullable<JourneyLeadPassportSummary["entryContext"]>["feeling"] } : {}),
    ...(typeof value.experience === "string" ? { experience: value.experience as NonNullable<JourneyLeadPassportSummary["entryContext"]>["experience"] } : {}),
    ...(typeof value.inspiration === "string" ? { inspiration: value.inspiration as NonNullable<JourneyLeadPassportSummary["entryContext"]>["inspiration"] } : {}),
    ...(typeof value.destination === "string" ? { destination: cleanSingleLine(value.destination) } : {}),
    ...(typeof value.destinationTheme === "string" ? { destinationTheme: value.destinationTheme as NonNullable<JourneyLeadPassportSummary["entryContext"]>["destinationTheme"] } : {}),
    ...(value.source === "homepage" || value.source === "direct" || value.source === "experience" || value.source === "mood" || value.source === "inspiration" || value.source === "destination" ? { source: value.source } : {}),
  };
}

function parseSummary(value: unknown): (JourneyLeadPassportSummary & { source: "journey-passport" }) | null {
  if (!isRecord(value) || !hasOnlyKeys(value, SUMMARY_KEYS)) return null;
  const entryContext = parseEntryContext(value.entryContext);
  if (
    !boundedString(value.name, 2, 80) || typeof value.mobile !== "string" || !boundedString(value.journeyReference, 11, 12) ||
    !boundedString(value.companion, 1, 100) || !boundedString(value.dreamJourney, 1, 100) ||
    !Array.isArray(value.travelStyles) || value.travelStyles.length > 3 ||
    !value.travelStyles.every((item) => boundedString(item, 1, 100)) || !boundedString(value.timing, 1, 100) ||
    typeof value.startDate !== "string" || typeof value.endDate !== "string" ||
    (value.startDate !== "" && !DATE_PATTERN.test(value.startDate)) || (value.endDate !== "" && !DATE_PATTERN.test(value.endDate)) ||
    (value.destinationMode !== "known" && value.destinationMode !== "discovery") || typeof value.destination !== "string" ||
    cleanSingleLine(value.destination).length > 100 ||
    (value.destinationMode === "known" && cleanSingleLine(value.destination).length < 2) ||
    (value.travelScope !== undefined && value.travelScope !== "DOMESTIC" && value.travelScope !== "INTERNATIONAL" && value.travelScope !== "ANY") ||
    entryContext === null || typeof value.completedAt !== "string" || Number.isNaN(Date.parse(value.completedAt)) ||
    value.source !== "journey-passport"
  ) return null;

  return {
    name: cleanSingleLine(value.name as string), mobile: cleanSingleLine(value.mobile),
    journeyReference: cleanSingleLine(value.journeyReference as string), companion: cleanSingleLine(value.companion as string),
    dreamJourney: cleanSingleLine(value.dreamJourney as string),
    travelStyles: value.travelStyles.map((item) => cleanSingleLine(item as string)), timing: cleanSingleLine(value.timing as string),
    startDate: value.startDate, endDate: value.endDate, destinationMode: value.destinationMode,
    destination: cleanSingleLine(value.destination), ...(value.travelScope ? { travelScope: value.travelScope } : {}),
    ...(entryContext && Object.keys(entryContext).length ? { entryContext } : {}), completedAt: new Date(value.completedAt).toISOString(),
    source: "journey-passport",
  };
}

export function parseJourneyLeadSubmission(value: unknown): JourneyLeadValidationResult {
  if (!isRecord(value) || !hasOnlyKeys(value, TOP_LEVEL_KEYS)) return { ok: false, code: "invalid_request" };
  const passportReference = typeof value.passportReference === "string" ? cleanSingleLine(value.passportReference) : "";
  const guestName = typeof value.guestName === "string" ? cleanSingleLine(value.guestName) : "";
  // Bare, traveller-entered mobile string — this is what is stored in mobile_number/
  // mobile_normalized (dual-field strategy, see the MOBILE_NUMBER_PATTERN comment
  // above) and what the passport-summary cross-check below compares against.
  const mobileNumber = typeof value.mobileNumber === "string" ? cleanSingleLine(value.mobileNumber) : "";
  const mobileNormalized = normalizeJourneyMobile(mobileNumber);
  const verificationToken = typeof value.verificationToken === "string" ? value.verificationToken.trim() : "";
  const passportSummary = parseSummary(value.passportSummary);

  if (!isJourneyPassportReference(passportReference)) return { ok: false, code: "invalid_passport_reference" };
  if (guestName.length < 2 || guestName.length > 80 || !/\p{L}/u.test(guestName)) return { ok: false, code: "invalid_guest_name" };
  if (!MOBILE_NUMBER_PATTERN.test(mobileNumber) || MOBILE_REJECTED_NUMBERS.has(mobileNormalized)) return { ok: false, code: "invalid_mobile_number" };
  // Additional MOBILE-type gate (rejects fixed-line-shaped numbers) and the E.164
  // source for the new, separate mobileE164 field — see parseJourneyPassportMobile.
  const mobileParsed = parseJourneyPassportMobile(mobileNumber);
  if (!mobileParsed) return { ok: false, code: "invalid_mobile_number" };
  if (!UUID_PATTERN.test(verificationToken)) return { ok: false, code: "invalid_verification_token" };
  if (!passportSummary) return { ok: false, code: "invalid_passport_summary" };
  if (
    passportSummary.journeyReference !== passportReference || passportSummary.name !== guestName ||
    passportSummary.mobile !== mobileNumber
  ) return { ok: false, code: "passport_summary_mismatch" };

  return {
    ok: true,
    value: {
      passportReference, guestName,
      mobileNumber, mobileNormalized, mobileE164: mobileParsed.e164,
      verificationToken, passportSummary,
      source: "journey-passport", status: "entered-journey-director",
    },
  };
}

export type JourneyCallbackValidationResult =
  | { ok: true; value: ValidatedJourneyCallback }
  | { ok: false; code: string };

export function parseJourneyCallbackSubmission(value: unknown): JourneyCallbackValidationResult {
  if (!isRecord(value) || !hasOnlyKeys(value, CALLBACK_KEYS)) return { ok: false, code: "invalid_request" };
  const passportReference = typeof value.passportReference === "string" ? cleanSingleLine(value.passportReference) : "";
  const guestName = typeof value.guestName === "string" ? cleanSingleLine(value.guestName) : "";
  const mobileNumber = typeof value.mobileNumber === "string" ? cleanSingleLine(value.mobileNumber) : "";
  const mobileNormalized = normalizeJourneyMobile(mobileNumber);
  const preferredDate = typeof value.preferredDate === "string" ? value.preferredDate : "";
  const preferredTimeWindow = typeof value.preferredTimeWindow === "string" ? cleanSingleLine(value.preferredTimeWindow) : "";
  const additionalComments = typeof value.additionalComments === "string" ? cleanSingleLine(value.additionalComments) : "";

  if (!isJourneyPassportReference(passportReference)) return { ok: false, code: "invalid_passport_reference" };
  if (guestName.length < 2 || guestName.length > 80 || !/\p{L}/u.test(guestName)) return { ok: false, code: "invalid_guest_name" };
  if (!MOBILE_NUMBER_PATTERN.test(mobileNumber) || MOBILE_REJECTED_NUMBERS.has(mobileNormalized)) return { ok: false, code: "invalid_mobile_number" };
  if (!isValidCallbackDate(preferredDate)) return { ok: false, code: "invalid_callback_date" };
  if (!isCallbackTimeWindow(preferredTimeWindow)) return { ok: false, code: "invalid_callback_time" };
  if (additionalComments.length > 500) return { ok: false, code: "invalid_callback_comments" };

  return {
    ok: true,
    value: { passportReference, guestName, mobileNumber, mobileNormalized, preferredDate, preferredTimeWindow, additionalComments },
  };
}

export function toJourneyLeadSubmission(value: JourneyLeadSubmission) {
  return value;
}

export function toJourneyCallbackSubmission(value: JourneyCallbackSubmission) {
  return value;
}
