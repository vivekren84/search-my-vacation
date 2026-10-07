// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2):
// npm run verify:journey-workspace-errors
// Lockstep check between the M11 SQL and the application error model:
//   - every `raise exception 'workspace_journey_<code>'` in M11 maps to its
//     own JourneyWorkspaceErrorCode (never "operation_failed");
//   - every SQL-raisable code in the TypeScript model is raised by M11;
//   - every code has an HTTP status (plan §8.2) and user-facing copy (S-5);
//   - unknown or foreign messages map to "operation_failed".
// Run from web/ (npm scripts do); reads ../supabase/migrations.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  fieldIssue,
  JOURNEY_WORKSPACE_ERROR_CODES,
  JOURNEY_WORKSPACE_ERROR_STATUS,
  journeyValidationError,
  JourneyWorkspaceError,
  mapJourneyRpcError,
} from "../errors";
import { JOURNEY_WORKSPACE_ERROR_MESSAGES } from "../messages";
import type { JourneyWorkspaceErrorCode } from "../types";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace error verification failed: ${message}`);
}

const M11 = join(process.cwd(), "..", "supabase", "migrations", "20261004100000_workspace_journey_lifecycle_rpcs.sql");
const sql = readFileSync(M11, "utf8");
const raised = new Set([...sql.matchAll(/raise exception 'workspace_journey_([a-z_]+)'/g)].map((match) => match[1]));
const APPLICATION_ONLY: JourneyWorkspaceErrorCode[] = ["invalid_request", "operation_failed"];

assert(raised.size > 0, "no raise statements found in M11");

for (const code of raised) {
  assert(mapJourneyRpcError(`workspace_journey_${code}`) === code, `SQL code ${code} does not map to itself`);
}

for (const code of JOURNEY_WORKSPACE_ERROR_CODES) {
  assert(typeof JOURNEY_WORKSPACE_ERROR_STATUS[code] === "number", `${code} has no HTTP status`);
  const message = JOURNEY_WORKSPACE_ERROR_MESSAGES[code];
  assert(typeof message === "string" && message.trim().length > 0, `${code} has no message`);
  assert(!/workspace_journey_|_/.test(message), `${code} message exposes an internal identifier: ${message}`);
  if (APPLICATION_ONLY.includes(code)) {
    assert(!raised.has(code), `${code} is application-only but M11 raises it`);
    assert(mapJourneyRpcError(`workspace_journey_${code}`) === "operation_failed", `${code} must not be accepted from SQL`);
  } else {
    assert(raised.has(code), `${code} is in the TypeScript model but M11 never raises it`);
  }
}
assert(
  JOURNEY_WORKSPACE_ERROR_CODES.length === raised.size + APPLICATION_ONLY.length,
  `code count ${JOURNEY_WORKSPACE_ERROR_CODES.length} != SQL ${raised.size} + application ${APPLICATION_ONLY.length}`,
);

// Plan §8.2 status classes.
assert(JOURNEY_WORKSPACE_ERROR_STATUS.not_authorised === 403, "not_authorised must be 403");
assert(JOURNEY_WORKSPACE_ERROR_STATUS.not_found === 404, "not_found must be 404");
assert(JOURNEY_WORKSPACE_ERROR_STATUS.operation_failed === 500, "operation_failed must be 500");
for (const code of ["stale", "archived", "terminal", "legacy_pending", "on_hold", "readiness_incomplete", "replacement_open"] as const) {
  assert(JOURNEY_WORKSPACE_ERROR_STATUS[code] === 409, `${code} must be 409`);
}
for (const code of ["reason_required", "contact_invalid", "dates_nights_mismatch", "template_invalid", "booking_invalid"] as const) {
  assert(JOURNEY_WORKSPACE_ERROR_STATUS[code] === 400, `${code} must be 400`);
}

// Unknown and foreign messages never leak.
for (const message of [
  "",
  null,
  undefined,
  "permission denied for function workspace_journey_transition",
  "workspace_journey_",
  "workspace_journey_something_new",
  'duplicate key value violates unique constraint "x"',
  " workspace_journey_stale ",
]) {
  const expected = message === " workspace_journey_stale " ? "stale" : "operation_failed";
  assert(mapJourneyRpcError(message) === expected, `message ${JSON.stringify(message)} → ${mapJourneyRpcError(message)}`);
}

// Error objects.
const stale = new JourneyWorkspaceError("stale");
assert(stale.status === 409 && stale.message === JOURNEY_WORKSPACE_ERROR_MESSAGES.stale, "JourneyWorkspaceError carries status and copy");
const multi = journeyValidationError([fieldIssue("reason", "reason_required"), fieldIssue("note", "note_too_long")]);
assert(multi.code === "reason_required" && multi.fieldIssues.length === 2 && multi.status === 400, "validation error keeps every issue");
assert(journeyValidationError([]).code === "invalid_request", "empty issue list falls back to invalid_request");

console.log(`Journey Workspace error verification passed (${checks} checks; ${raised.size} SQL codes).`);
