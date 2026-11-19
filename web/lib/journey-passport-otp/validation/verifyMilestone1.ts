/**
 * Milestone 1 Comprehensive Verification Suite (Release 1.3 Core Conversion)
 *
 * Authored for Keerthi (QA Lead) & Sri (Traveller Experience Reviewer)
 * Validates all 7 Milestone 1 backlog items:
 * - TD-07: Persistent OTP rate limiting & resend caps (DB migration & repository)
 * - TD-08: Structured PII-redacted diagnostic logging with causal error preservation
 * - TD-09: OTP payload validation and strict abuse protection
 * - UX-01: Idempotent lead recovery window & emergency WhatsApp fallback
 * - UX-03: Challenge re-attachment on resend_too_soon
 * - P-07: Canonical SMV- vs Legacy JY- reference pattern separation
 * - GAP-02: Pre-OTP trust card, Option C SLA copy, and OTP reassurance
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  extractCausalError,
  maskDiagnosticsMobile,
  maskDiagnosticsName,
  maskDiagnosticsReference,
  redactSensitiveContext,
  resolveCorrelationId,
} from "../../observability/diagnostics.js";
import {
  CANONICAL_PASSPORT_REFERENCE_PATTERN,
  LEGACY_PASSPORT_REFERENCE_PATTERN,
  isCanonicalPassportReference,
  isJourneyPassportReference,
  isLegacyPassportReference,
} from "../../journey-leads/validation.js";
import {
  parseJourneyPassportOtpSendRequest,
  parseJourneyPassportOtpVerifyRequest,
} from "../validation.js";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`[M1 Verification FAILED] ${message}`);
}

async function verifyDatabaseAndMigration() {
  const root = process.cwd();
  const migrationPath = join(root, "../supabase/migrations/20261119000000_journey_passport_otp_rate_limiting.sql");
  const rollbackPath = join(root, "../supabase/rollbacks/20261119000000_journey_passport_otp_rate_limiting.rollback.sql");

  assert(existsSync(migrationPath), "TD-07: Migration file 20261119000000_journey_passport_otp_rate_limiting.sql exists");
  assert(existsSync(rollbackPath), "TD-07: Rollback file 20261119000000_journey_passport_otp_rate_limiting.rollback.sql exists");

  const migration = readFileSync(migrationPath, "utf8");
  const rollback = readFileSync(rollbackPath, "utf8");

  // TD-07 Rate Limiting SQL checks
  assert(migration.includes("passport_reference text"), "TD-07: Migration adds passport_reference column to challenges table");
  assert(migration.includes("v_hourly_count int;"), "TD-07: Migration inspects 1-hour rolling window count");
  assert(migration.includes("v_daily_count int;"), "TD-07: Migration inspects 24-hour rolling window count");
  assert(migration.includes("v_hourly_count >= 5"), "TD-07: 5 attempts per hour limit is enforced");
  assert(migration.includes("v_daily_count >= 10"), "TD-07: 10 attempts per 24 hours limit is enforced");
  assert(migration.includes("interval '15 minutes'"), "TD-07: 15-minute cooldown lockout is enforced upon hourly cap");
  assert(migration.includes("rate_limit_exceeded"), "TD-07: Explicit rate_limit_exceeded outcome is returned");
  assert(migration.includes("cooldown_lockout"), "TD-07: Explicit cooldown_lockout outcome is returned");

  // UX-03 Challenge ID preservation on resend_too_soon in RPC
  assert(migration.includes("v_existing.id") && migration.includes("'resend_too_soon'::text"), "UX-03: RPC returns challenge_id on resend_too_soon");

  // UX-01 Idempotent lead recovery in consume_journey_passport_otp_token
  assert(migration.includes("p_passport_reference text default null"), "UX-01: consume token RPC accepts p_passport_reference");
  assert(migration.includes("interval '10 minutes'"), "UX-01: 10-minute idempotent retry window is enforced");

  // Rollback fidelity
  assert(rollback.includes("drop column if exists passport_reference"), "TD-07: Rollback drops added passport_reference column");
  assert(rollback.includes("create or replace function public.send_journey_passport_otp"), "TD-07: Rollback restores send RPC");
  assert(rollback.includes("create or replace function public.consume_journey_passport_otp_token"), "TD-07: Rollback restores consume RPC");
}

async function verifyObservabilityAndDiagnostics() {
  // Mobile masking
  assert(maskDiagnosticsMobile("+919876543210") === "+91 ****** 10", "TD-08: E.164 mobile is masked with country code and last 2 digits");
  assert(maskDiagnosticsMobile("9876543210") === "****** 10", "TD-08: 10-digit mobile is masked with last 2 digits");
  assert(maskDiagnosticsMobile("") === "[empty]", "TD-08: Empty mobile returns [empty]");

  // Name masking
  assert(maskDiagnosticsName("Vivek Renganathan") === "V. R.", "TD-08: Full name is masked to initials");
  assert(maskDiagnosticsName("Sri") === "S.", "TD-08: Single name is masked to initial");
  assert(maskDiagnosticsName("") === "[empty]", "TD-08: Empty name returns [empty]");

  // Reference masking
  assert(maskDiagnosticsReference("SMV-ABCD2345") === "SMV-AB****45", "TD-08: Passport reference preserves prefix and last 2 characters");
  assert(maskDiagnosticsReference("JY-ABCD-EFGH") === "JY-ABC****GH", "TD-08: Legacy reference preserves prefix and last 2 characters");

  // Causal error extraction
  const customError = new Error("Database timeout on lead insert");
  (customError as unknown as Record<string, unknown>).code = "57014";
  (customError as unknown as Record<string, unknown>).status = 504;
  const extracted = extractCausalError(customError);
  assert(extracted.name === "Error", "TD-08: Preserves error name");
  assert(extracted.message === "Database timeout on lead insert", "TD-08: Preserves error message");
  assert(extracted.code === "57014", "TD-08: Preserves error code");
  assert(extracted.status === 504, "TD-08: Preserves error HTTP status");

  // Recursive context redaction
  const sensitiveContext = {
    guestName: "Vivek Renganathan",
    mobileNumber: "+919876543210",
    otp: "123456",
    verificationToken: "abcd-1234-token",
    passportReference: "SMV-ABCD2345",
    nested: {
      phone: "+919123456789",
      notes: "Vegetarian meals preferred",
    },
  };
  const redacted = redactSensitiveContext(sensitiveContext) as Record<string, unknown>;
  assert(redacted.guestName === "V. R.", "TD-08: Context guestName is masked to initials");
  assert(redacted.mobileNumber === "+91 ****** 10", "TD-08: Context mobileNumber is masked");
  assert(redacted.otp === "[REDACTED]", "TD-08: Context OTP code is completely redacted");
  assert(redacted.verificationToken === "[REDACTED]", "TD-08: Context verification token is completely redacted");
  assert(redacted.passportReference === "SMV-AB****45", "TD-08: Context passport reference is masked");
  const nestedRedacted = redacted.nested as Record<string, unknown>;
  assert(nestedRedacted.phone === "+91 ****** 89", "TD-08: Nested sensitive phone is masked");
  assert(nestedRedacted.notes === "Vegetarian meals preferred", "TD-08: Non-sensitive nested context is preserved");

  // Correlation ID resolution
  const syntheticReq = new Request("https://searchmyvacation.com/api/test", {
    headers: { "x-smv-correlation-id": "corr-uuid-123456" },
  });
  assert(resolveCorrelationId(syntheticReq) === "corr-uuid-123456", "TD-08: Resolves correlation ID from request header");
  assert(resolveCorrelationId().length >= 32, "TD-08: Generates unique UUID correlation ID when header is absent");
}

async function verifyEndpointValidationAndAbuse() {
  // TD-09 OTP send request validation
  assert(parseJourneyPassportOtpSendRequest({ mobileNumber: "9876543210" }).ok, "TD-09: Accepts valid 10-digit mobile");
  assert(parseJourneyPassportOtpSendRequest({ mobileNumber: "+919876543210" }).ok, "TD-09: Accepts valid E.164 mobile");
  assert(!parseJourneyPassportOtpSendRequest({ mobileNumber: "12345" }).ok, "TD-09: Rejects malformed mobile");
  assert(!parseJourneyPassportOtpSendRequest({ mobileNumber: "0000000000" }).ok, "TD-09: Rejects zeroed mobile");
  assert(!parseJourneyPassportOtpSendRequest({ mobileNumber: "9876543210", extraProp: "malicious" }).ok, "TD-09: Rejects payload with extra undeclared keys");
  assert(!parseJourneyPassportOtpSendRequest(null).ok, "TD-09: Rejects null payload");
  assert(!parseJourneyPassportOtpSendRequest("not-an-object").ok, "TD-09: Rejects string payload");

  // TD-09 OTP verify request validation
  const validUuid = "11111111-2222-4333-8444-555555555555";
  assert(parseJourneyPassportOtpVerifyRequest({ mobileNumber: "9876543210", challengeId: validUuid, code: "123456" }).ok, "TD-09: Accepts valid verify request");
  assert(!parseJourneyPassportOtpVerifyRequest({ mobileNumber: "9876543210", challengeId: "not-a-uuid", code: "123456" }).ok, "TD-09: Rejects non-UUID challenge ID");
  assert(!parseJourneyPassportOtpVerifyRequest({ mobileNumber: "9876543210", challengeId: validUuid, code: "12345" }).ok, "TD-09: Rejects non-6-digit code");
  assert(!parseJourneyPassportOtpVerifyRequest({ mobileNumber: "9876543210", challengeId: validUuid, code: "abcdef" }).ok, "TD-09: Rejects non-numeric code");
  assert(!parseJourneyPassportOtpVerifyRequest({ mobileNumber: "9876543210", challengeId: validUuid, code: "123456", injected: "evil" }).ok, "TD-09: Rejects extra keys in verify request");
}

async function verifyPassportReferencePartitioning() {
  // P-07 Canonical vs Legacy reference pattern separation
  assert(CANONICAL_PASSPORT_REFERENCE_PATTERN.test("SMV-ABCD2345"), "P-07: SMV- pattern matches canonical 8-character Base32");
  assert(!CANONICAL_PASSPORT_REFERENCE_PATTERN.test("JY-ABCD-EFGH"), "P-07: SMV- pattern does not match legacy JY- format");
  assert(LEGACY_PASSPORT_REFERENCE_PATTERN.test("JY-ABCD-EFGH"), "P-07: JY- pattern matches legacy format");
  assert(!LEGACY_PASSPORT_REFERENCE_PATTERN.test("SMV-ABCD2345"), "P-07: JY- pattern does not match canonical SMV- format");

  assert(isCanonicalPassportReference("SMV-A3K9W2X8"), "P-07: isCanonicalPassportReference identifies canonical SMV- reference");
  assert(!isCanonicalPassportReference("JY-ABCD-EFGH"), "P-07: isCanonicalPassportReference rejects legacy reference");
  assert(isLegacyPassportReference("JY-ABCD-EFGH"), "P-07: isLegacyPassportReference identifies legacy reference");
  assert(!isLegacyPassportReference("SMV-A3K9W2X8"), "P-07: isLegacyPassportReference rejects canonical reference");

  assert(isJourneyPassportReference("SMV-A3K9W2X8"), "P-07: isJourneyPassportReference accepts canonical reference");
  assert(isJourneyPassportReference("JY-ABCD-EFGH"), "P-07: isJourneyPassportReference accepts legacy reference");
  assert(!isJourneyPassportReference("INVALID-REF"), "P-07: isJourneyPassportReference rejects malformed reference");
}

async function verifyFrontendComponentsAndRecovery() {
  const root = process.cwd();
  const trustCardFile = join(root, "components/journey-passport/PreOtpTrustCard.tsx");
  const passportFile = join(root, "components/journey-passport/JourneyPassport.tsx");

  assert(existsSync(trustCardFile), "GAP-02: PreOtpTrustCard.tsx exists");
  const trustCardContent = readFileSync(trustCardFile, "utf8");
  const passportContent = readFileSync(passportFile, "utf8");

  // GAP-02: Option C SLA Microcopy check
  assert(trustCardContent.includes("Same business day, or next morning if submitted after 7 PM IST"), "GAP-02: Option C SLA is present in PreOtpTrustCard");
  assert(trustCardContent.includes("Why we verify your mobile number"), "GAP-02: Purpose explanation heading is present");
  assert(trustCardContent.includes("Private &amp; Tailored") || trustCardContent.includes("Private & Tailored"), "GAP-02: Private & Tailored value proposition is present");
  assert(trustCardContent.includes("Dedicated Human Designer"), "GAP-02: Dedicated Human Designer value proposition is present");
  assert(trustCardContent.includes("Zero Spam"), "GAP-02: Zero Spam commitment is present");

  // GAP-02 & UX-03 & UX-01: JourneyPassport.tsx integration checks
  assert(passportContent.includes("<PreOtpTrustCard />"), "GAP-02: JourneyPassport renders PreOtpTrustCard on closure details stage");
  assert(passportContent.includes("Expected response: Same business day (or tomorrow morning if after 7 PM IST)"), "GAP-02: OTP verification reassurance microcopy is present");

  // UX-03: Challenge ID re-attachment on resend_too_soon
  assert(passportContent.includes("setOtpNotice("), "UX-03: Sets friendly notice when existing challenge is re-attached");
  assert(passportContent.includes("A code was already sent to your mobile number"), "UX-03: Re-attachment copy explains that code was already sent");

  // UX-01: Resilient lead submission recovery & WhatsApp fallback
  assert(passportContent.includes("leadSubmissionFailed"), "UX-01: Tracks leadSubmissionFailed state");
  assert(passportContent.includes("lastVerifiedToken"), "UX-01: Preserves single-use token for idempotent retry");
  assert(passportContent.includes("Retry Connecting My Passport"), "UX-01: Renders Retry Connecting My Passport button");
  assert(passportContent.includes("Continue Directly via WhatsApp"), "UX-01: Renders Continue Directly via WhatsApp emergency button");
  assert(passportContent.includes("handleWhatsAppFallback"), "UX-01: Generates pre-populated Journey Synopsis on WhatsApp click");
  assert(passportContent.includes("whatsapp_handoff_opened"), "UX-01: Tracks whatsapp_handoff_opened event upon emergency handoff");

  // Golden Experience Invariant
  assert(trustCardContent.includes("#FFFDFC"), "Golden Experience: PreOtpTrustCard uses #FFFDFC warm ivory background");
  assert(trustCardContent.includes("#2A211C"), "Golden Experience: PreOtpTrustCard uses #2A211C deep espresso typography");
  assert(trustCardContent.includes("#F5951C"), "Golden Experience: PreOtpTrustCard uses #F5951C golden saffron accents");
  assert(trustCardContent.includes("#e4d2b5"), "Golden Experience: PreOtpTrustCard uses #e4d2b5 border");
}

async function main() {
  console.log("--- Starting Milestone 1 Comprehensive Verification Suite ---\n");
  await verifyDatabaseAndMigration();
  console.log("✓ TD-07 & Database Migration verification passed.");
  await verifyObservabilityAndDiagnostics();
  console.log("✓ TD-08 & Diagnostic Observability verification passed.");
  await verifyEndpointValidationAndAbuse();
  console.log("✓ TD-09 & Endpoint Abuse Protection verification passed.");
  await verifyPassportReferencePartitioning();
  console.log("✓ P-07 & Passport Reference Partitioning verification passed.");
  await verifyFrontendComponentsAndRecovery();
  console.log("✓ GAP-02, UX-01, UX-03 & Golden Experience verification passed.");

  console.log(`\n======================================================`);
  console.log(`ALL MILESTONE 1 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log(`======================================================\n`);
}

void main();
