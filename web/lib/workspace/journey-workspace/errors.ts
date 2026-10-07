// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): Journey Workspace error
// model. Pure (no I/O) so routes, services and the verify script share it
// (verify:journey-workspace-errors).
//
// The M11 RPCs (supabase/migrations/20261004100000_workspace_journey_
// lifecycle_rpcs.sql) raise `workspace_journey_<code>` as the exception
// message. mapJourneyRpcError() turns that into a JourneyWorkspaceErrorCode;
// anything unrecognised becomes "operation_failed" and is never shown raw.

import { JOURNEY_WORKSPACE_ERROR_MESSAGES } from "./messages";
import type { JourneyFieldIssue, JourneyWorkspaceErrorCode } from "./types";

export type JourneyWorkspaceHttpStatus = 400 | 403 | 404 | 409 | 500;

// Plan EBC-R1.3-WS13-020 Rev 2 §8.2 error mapping.
export const JOURNEY_WORKSPACE_ERROR_STATUS: Readonly<Record<JourneyWorkspaceErrorCode, JourneyWorkspaceHttpStatus>> = {
  not_authorised: 403,
  not_found: 404,
  archived: 409,
  terminal: 409,
  legacy_pending: 409,
  not_legacy: 409,
  stale: 409,
  on_hold: 409,
  already_on_hold: 409,
  not_on_hold: 409,
  transition_not_allowed: 409,
  hold_not_allowed: 409,
  cancel_not_allowed: 409,
  close_not_allowed: 409,
  readiness_incomplete: 409,
  start_date_not_reached: 409,
  end_date_not_reached: 409,
  template_already_assigned: 409,
  owner_unchanged: 409,
  service_category_unchanged: 409,
  replacement_open: 409,
  template_invalid: 400,
  new_owner_invalid: 400,
  service_category_invalid: 400,
  service_category_required: 400,
  reason_required: 400,
  reason_too_long: 400,
  note_too_long: 400,
  booking_invalid: 400,
  dates_required: 400,
  dates_invalid: 400,
  dates_nights_mismatch: 400,
  contact_invalid: 400,
  invalid_request: 400,
  operation_failed: 500,
};

export const JOURNEY_WORKSPACE_ERROR_CODES = Object.keys(JOURNEY_WORKSPACE_ERROR_STATUS) as JourneyWorkspaceErrorCode[];

// Codes that only the application raises (never a SQL exception message).
const APPLICATION_ONLY_CODES: ReadonlySet<JourneyWorkspaceErrorCode> = new Set(["invalid_request", "operation_failed"]);

const RPC_PREFIX = "workspace_journey_";

export function mapJourneyRpcError(message: string | null | undefined): JourneyWorkspaceErrorCode {
  const raw = (message ?? "").trim();
  if (!raw.startsWith(RPC_PREFIX)) return "operation_failed";
  const code = raw.slice(RPC_PREFIX.length) as JourneyWorkspaceErrorCode;
  return code in JOURNEY_WORKSPACE_ERROR_STATUS && !APPLICATION_ONLY_CODES.has(code) ? code : "operation_failed";
}

export class JourneyWorkspaceError extends Error {
  readonly status: JourneyWorkspaceHttpStatus;

  constructor(
    readonly code: JourneyWorkspaceErrorCode,
    readonly fieldIssues: JourneyFieldIssue[] = [],
  ) {
    super(JOURNEY_WORKSPACE_ERROR_MESSAGES[code]);
    this.name = "JourneyWorkspaceError";
    this.status = JOURNEY_WORKSPACE_ERROR_STATUS[code];
  }
}

// Several field problems reported together (PRA-01 precedent). The
// error's code is the first issue's code; every issue is in fieldIssues.
export function journeyValidationError(issues: JourneyFieldIssue[]): JourneyWorkspaceError {
  return new JourneyWorkspaceError(issues[0]?.code ?? "invalid_request", issues);
}

export function fieldIssue(field: string, code: JourneyWorkspaceErrorCode, message?: string): JourneyFieldIssue {
  return { field, code, message: message ?? JOURNEY_WORKSPACE_ERROR_MESSAGES[code] };
}
