import type {
  JourneyCallbackNotification,
  JourneyLeadEventType,
  JourneyLeadNotification,
  JourneyLeadNotificationStatus,
  JourneyPassportRepository,
  ValidatedJourneyCallback,
  ValidatedJourneyLead,
} from "./types";

const EXPECTED_SUPABASE_URL = "https://jbsefolhlfkplawiuvlu.supabase.co";

export class JourneyLeadRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Journey lead repository operation failed");
    this.name = "JourneyLeadRepositoryError";
  }
}

type SupabaseEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
};

function createHeaders(secretKey: string, prefer?: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export function createSupabaseJourneyLeadRepository(
  environment: SupabaseEnvironment,
  fetcher: typeof fetch = fetch,
): JourneyPassportRepository {
  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();
  if (projectUrl !== EXPECTED_SUPABASE_URL || !secretKey) throw new JourneyLeadRepositoryError("database_not_configured");

  async function request(path: string, init: RequestInit, code: string) {
    let response: Response;
    try {
      response = await fetcher(`${projectUrl}${path}`, { ...init, signal: AbortSignal.timeout(7000) });
    } catch {
      throw new JourneyLeadRepositoryError("database_unavailable");
    }
    if (!response.ok) throw new JourneyLeadRepositoryError(code);
    return response;
  }

  return {
    async upsertLead(lead) {
      await request("/rest/v1/journey_passport_leads?on_conflict=passport_reference", {
        method: "POST",
        headers: createHeaders(secretKey, "resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify({
          passport_reference: lead.passportReference,
          guest_name: lead.guestName,
          mobile_number: lead.mobileNumber,
          mobile_normalized: lead.mobileNormalized,
          traveller_type: lead.passportSummary.entryContext?.feeling ?? null,
          companions: { selection: lead.passportSummary.companion },
          primary_dream: lead.passportSummary.dreamJourney,
          travel_styles: lead.passportSummary.travelStyles,
          timing: { preference: lead.passportSummary.timing },
          exact_dates: lead.passportSummary.startDate && lead.passportSummary.endDate
            ? { startDate: lead.passportSummary.startDate, endDate: lead.passportSummary.endDate }
            : null,
          destination_mode: lead.passportSummary.destinationMode,
          destination_free_text: lead.passportSummary.destination || null,
          entry_context: lead.passportSummary.entryContext ?? {},
          passport_summary: lead.passportSummary,
          source: lead.source,
          status: lead.status,
          updated_at: new Date().toISOString(),
        }),
      }, "lead_upsert_failed");
    },

    async recordEvent(passportReference, eventType, payload = {}) {
      await request("/rest/v1/journey_passport_events?on_conflict=passport_reference,event_type", {
        method: "POST",
        headers: createHeaders(secretKey, "resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify({ passport_reference: passportReference, event_type: eventType, event_payload: payload }),
      }, "event_write_failed");
    },

    async claimNotification(passportReference, claimToken) {
      const response = await request("/rest/v1/rpc/claim_journey_passport_notification", {
        method: "POST",
        headers: createHeaders(secretKey),
        body: JSON.stringify({ p_passport_reference: passportReference, p_claim_token: claimToken }),
      }, "notification_claim_failed");
      const result: unknown = await response.json();
      return result === true;
    },

    async updateNotification(passportReference, claimToken, status, errorCode, notification) {
      const query = `passport_reference=eq.${encodeURIComponent(passportReference)}&notification_claim_token=eq.${encodeURIComponent(claimToken)}`;
      await request(`/rest/v1/journey_passport_leads?${query}`, {
        method: "PATCH",
        headers: createHeaders(secretKey, "return=minimal"),
        body: JSON.stringify({
          notification_status: status,
          notification_error_code: errorCode ?? null,
          notification_sent_at: status === "sent" ? new Date().toISOString() : null,
          ...(notification?.providerRequestId ? { initial_notification_email_id: notification.providerRequestId } : {}),
          ...(notification?.messageId ? { initial_notification_message_id: notification.messageId } : {}),
          updated_at: new Date().toISOString(),
        }),
      }, "notification_status_failed");
    },

    async markWhatsAppHandoff(passportReference) {
      const response = await request(`/rest/v1/journey_passport_leads?passport_reference=eq.${encodeURIComponent(passportReference)}&select=passport_reference`, {
        method: "PATCH",
        headers: createHeaders(secretKey, "return=representation"),
        body: JSON.stringify({ whatsapp_handoff_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
      }, "whatsapp_update_failed");
      const rows: unknown = await response.json();
      return Array.isArray(rows) && rows.length > 0;
    },

    async claimCallback(callback, fingerprint, claimToken) {
      const response = await request("/rest/v1/rpc/claim_journey_passport_callback", {
        method: "POST",
        headers: createHeaders(secretKey),
        body: JSON.stringify({
          p_passport_reference: callback.passportReference,
          p_guest_name: callback.guestName,
          p_mobile_normalized: callback.mobileNormalized,
          p_preferred_date: callback.preferredDate,
          p_preferred_time_window: callback.preferredTimeWindow,
          p_additional_comments: callback.additionalComments,
          p_fingerprint: fingerprint,
          p_claim_token: claimToken,
        }),
      }, "callback_claim_failed");
      const result: unknown = await response.json();
      if (!Array.isArray(result) || result.length === 0 || !result[0] || typeof result[0] !== "object") {
        return { status: "not-found" } as const;
      }
      const row = result[0] as Record<string, unknown>;
      if (row.notification_claimed !== true) return { status: "duplicate" } as const;

      let initialProviderRequestId = typeof row.initial_provider_request_id === "string"
        ? row.initial_provider_request_id
        : undefined;
      const initialMessageId = typeof row.initial_message_id === "string" ? row.initial_message_id : undefined;
      if (!initialProviderRequestId) {
        const eventResponse = await request(
          `/rest/v1/journey_passport_events?passport_reference=eq.${encodeURIComponent(callback.passportReference)}&event_type=eq.notification_sent&select=event_payload&limit=1`,
          { method: "GET", headers: createHeaders(secretKey) },
          "notification_thread_lookup_failed",
        );
        const events: unknown = await eventResponse.json();
        const payload = Array.isArray(events) && events[0] && typeof events[0] === "object"
          ? (events[0] as { event_payload?: unknown }).event_payload
          : undefined;
        if (payload && typeof payload === "object" && "requestId" in payload && typeof payload.requestId === "string") {
          initialProviderRequestId = payload.requestId;
        }
      }

      return {
        status: "claimed",
        callback: {
          ...callback,
          fingerprint,
          ...(initialProviderRequestId ? { initialProviderRequestId } : {}),
          ...(initialMessageId ? { initialMessageId } : {}),
        },
      } as const;
    },

    async updateCallbackNotification(callback, claimToken, status, errorCode, notification) {
      const query = `passport_reference=eq.${encodeURIComponent(callback.passportReference)}&callback_notification_claim_token=eq.${encodeURIComponent(claimToken)}`;
      await request(`/rest/v1/journey_passport_leads?${query}`, {
        method: "PATCH",
        headers: createHeaders(secretKey, "return=minimal"),
        body: JSON.stringify({
          callback_notification_status: status,
          callback_notification_error_code: errorCode ?? null,
          callback_notification_sent_at: status === "sent" ? new Date().toISOString() : null,
          callback_notified_fingerprint: callback.fingerprint,
          ...(notification?.providerRequestId ? { callback_notification_email_id: notification.providerRequestId } : {}),
          ...(notification?.messageId ? { callback_notification_message_id: notification.messageId } : {}),
          ...(notification?.originalMessageId ? { initial_notification_message_id: notification.originalMessageId } : {}),
          updated_at: new Date().toISOString(),
        }),
      }, "callback_status_failed");
    },
  } satisfies JourneyPassportRepository;
}

export function safeNotificationErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code.slice(0, 80);
  }
  return "notification_unknown";
}

export function maskPassportReference(reference: string) {
  return `${reference.slice(0, 4)}****${reference.slice(-2)}`;
}

export type {
  JourneyCallbackNotification,
  JourneyLeadEventType,
  JourneyLeadNotification,
  JourneyLeadNotificationStatus,
  ValidatedJourneyCallback,
  ValidatedJourneyLead,
};
