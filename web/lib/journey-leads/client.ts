import type { JourneyCallbackSubmission, JourneyLeadSubmission } from "./types";

export const JOURNEY_LEAD_FAILURE_MESSAGE = "We couldn’t connect your Passport just yet. Your details are still here—please try once more.";

export class JourneyLeadSubmissionError extends Error {
  constructor() {
    super(JOURNEY_LEAD_FAILURE_MESSAGE);
    this.name = "JourneyLeadSubmissionError";
  }
}

export async function submitJourneyPassportLead(
  submission: JourneyLeadSubmission,
  fetcher: typeof fetch = fetch,
) {
  let response: Response;
  try {
    response = await fetcher("/api/journey-passport/leads", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission),
    });
  } catch {
    throw new JourneyLeadSubmissionError();
  }
  if (!response.ok) throw new JourneyLeadSubmissionError();
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) throw new JourneyLeadSubmissionError();
  return true;
}

export function recordJourneyPassportEvent(
  passportReference: string,
  eventType: "journey_director_entered" | "whatsapp_handoff_opened",
  fetcher: typeof fetch = fetch,
) {
  return fetcher("/api/journey-passport/events", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passportReference, eventType }), keepalive: true,
  }).then(() => undefined).catch(() => undefined);
}

export type JourneyCallbackSubmissionStatus = "sent" | "duplicate" | "failed" | "not-configured";

export async function submitJourneyCallbackPreference(
  submission: JourneyCallbackSubmission,
  fetcher: typeof fetch = fetch,
): Promise<JourneyCallbackSubmissionStatus> {
  let response: Response;
  try {
    response = await fetcher("/api/journey-passport/callback", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission),
    });
  } catch {
    throw new JourneyLeadSubmissionError();
  }
  if (!response.ok) throw new JourneyLeadSubmissionError();
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true || !("notificationStatus" in result)) {
    throw new JourneyLeadSubmissionError();
  }
  const status = result.notificationStatus;
  if (status !== "sent" && status !== "duplicate" && status !== "failed" && status !== "not-configured") {
    throw new JourneyLeadSubmissionError();
  }
  return status;
}
