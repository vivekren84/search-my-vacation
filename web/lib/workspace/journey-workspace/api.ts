// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): Route Handler support
// for the Journey Workspace API (app/api/workspace/journey-workspace/…).
// One place for body parsing and the error → response mapping, so every
// route answers the same way (plan §8.2 error mapping):
//   { ok: false, code, message, issues? } with 400 / 403 / 404 / 409 / 500.
// Unexpected failures are logged with the operation name and error class
// only (no request body, no personal data) and returned as
// "operation_failed" without the raw database message.

import { jsonResponse } from "../shared/api/respond";
import { JourneyWorkspaceError } from "./errors";
import { JOURNEY_WORKSPACE_ERROR_MESSAGES } from "./messages";
import { JourneyWorkspaceRepositoryError } from "./repository";

export type JourneyRouteParams = { params: Promise<{ journeyId: string }> };

// A JSON object body, or null when the body is missing, not JSON, or not
// an object (arrays and primitives are rejected).
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function invalidBodyResponse(): Response {
  return jsonResponse({ ok: false, code: "invalid_request", message: JOURNEY_WORKSPACE_ERROR_MESSAGES.invalid_request }, 400);
}

export function journeyWorkspaceErrorResponse(error: unknown, operation: string): Response {
  if (error instanceof JourneyWorkspaceError && error.code !== "operation_failed") {
    return jsonResponse(
      {
        ok: false,
        code: error.code,
        message: error.message,
        ...(error.fieldIssues.length > 0 ? { issues: error.fieldIssues } : {}),
      },
      error.status,
    );
  }
  console.error("Journey Workspace request failed.", {
    operation,
    errorClass: error instanceof Error ? error.name : typeof error,
    ...(error instanceof JourneyWorkspaceRepositoryError ? { repositoryCode: error.code } : {}),
  });
  return jsonResponse({ ok: false, code: "operation_failed", message: JOURNEY_WORKSPACE_ERROR_MESSAGES.operation_failed }, 500);
}
