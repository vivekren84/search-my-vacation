import type { JourneyCallbackLead, JourneyCallbackNotifier, JourneyLeadNotifier, ValidatedJourneyLead } from "./types";
import { isValidNotificationSender, parseNotificationRecipients } from "./validation";

export class JourneyLeadNotificationError extends Error {
  constructor(readonly code: string) {
    super("Journey lead notification failed");
    this.name = "JourneyLeadNotificationError";
  }
}

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function displayValue(value: string | undefined, fallback = "Not shared") {
  const clean = value?.trim();
  return clean ? clean : fallback;
}

export function createJourneyLeadEmail(lead: ValidatedJourneyLead) {
  const summary = lead.passportSummary;
  const destination = summary.destinationMode === "known" ? displayValue(summary.destination) : "Open to discovery";
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
  }).format(new Date(summary.completedAt));
  const travellingWith = displayValue(summary.companion);
  const experiences = summary.travelStyles.length ? summary.travelStyles.join(", ") : "Not shared";
  const timing = summary.startDate && summary.endDate
    ? `${summary.timing} (${summary.startDate} to ${summary.endDate})`
    : displayValue(summary.timing);
  const rows = [
    ["Passport ID", lead.passportReference], ["Guest", lead.guestName], ["Mobile", lead.mobileNumber],
    ["Traveller type", summary.entryContext?.feeling ?? "Not specified"], ["Travelling with", travellingWith],
    ["Journey feeling", summary.dreamJourney], ["Experiences", experiences], ["Timing", timing],
    ["Destination in mind", destination], ["Status", "Entered Journey Director"],
    ["Source", "Journey Passport"], ["Submitted at", `${submittedAt} IST`],
  ] as const;
  const text = [
    "A guest has entered the Journey Director.", "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:8px 16px 8px 0;color:#705c47;font-weight:600;vertical-align:top">${escapeEmailHtml(label)}</th><td style="padding:8px 0;color:#2d2117">${escapeEmailHtml(value)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;color:#2d2117"><p style="font-size:18px;line-height:1.6">A guest has entered the Journey Director.</p><table style="border-collapse:collapse;width:100%;font-size:15px;line-height:1.5">${htmlRows}</table></div>`;
  return { subject: `New Journey Passport Lead — ${lead.passportReference}`, text, html };
}

export function createJourneyCallbackEmail(callback: JourneyCallbackLead, originalMessageId: string) {
  const comments = displayValue(callback.additionalComments);
  const rows = [
    ["Passport Reference", callback.passportReference],
    ["Traveller", callback.guestName],
    ["Mobile", callback.mobileNumber],
    ["Preferred callback", `${callback.preferredDate} · ${callback.preferredTimeWindow}`],
    ["Additional comments", comments],
  ] as const;
  const text = [
    "📞 Callback Request Received", "",
    ...rows.flatMap(([label, value]) => [label, value, ""]),
    "This callback request has been added to the existing Journey Passport.",
  ].join("\n");
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:8px 16px 8px 0;color:#705c47;font-weight:600;vertical-align:top">${escapeEmailHtml(label)}</th><td style="padding:8px 0;color:#2d2117">${escapeEmailHtml(value)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;color:#2d2117"><p style="font-size:20px;line-height:1.5;font-weight:700">📞 Callback Request Received</p><table style="border-collapse:collapse;width:100%;font-size:15px;line-height:1.5">${htmlRows}</table><p style="margin-top:24px;color:#705c47;line-height:1.6">This callback request has been added to the existing Journey Passport.</p></div>`;
  return {
    subject: `Re: New Journey Passport • ${callback.passportReference}`,
    text,
    html,
    headers: { "In-Reply-To": originalMessageId, References: originalMessageId },
  };
}

type NotificationEnvironment = {
  RESEND_API_KEY?: string;
  JOURNEY_LEAD_FROM_EMAIL?: string;
  JOURNEY_LEAD_NOTIFICATION_EMAILS?: string;
};

export function createJourneyLeadNotifier(
  environment: NotificationEnvironment,
  fetcher: typeof fetch = fetch,
): JourneyLeadNotifier & JourneyCallbackNotifier {
  const recipients = parseNotificationRecipients(environment.JOURNEY_LEAD_NOTIFICATION_EMAILS);
  const sender = environment.JOURNEY_LEAD_FROM_EMAIL?.trim();
  const apiKey = environment.RESEND_API_KEY?.trim();
  if (!apiKey || !isValidNotificationSender(sender) || recipients.length === 0) {
    return {
      send: async () => ({ status: "not-configured" }),
      sendCallback: async () => ({ status: "not-configured" }),
    };
  }

  async function retrieveMessageId(providerRequestId: string) {
    let response: Response;
    try {
      response = await fetcher(`https://api.resend.com/emails/${encodeURIComponent(providerRequestId)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(7000),
      });
    } catch {
      return undefined;
    }
    if (!response.ok) return undefined;
    try {
      const body = await response.json() as { message_id?: unknown };
      const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
      return messageId.length > 2 && messageId.length <= 500 && !/[\r\n]/.test(messageId)
        ? messageId
        : undefined;
    } catch {
      return undefined;
    }
  }

  return {
    async send(lead) {
      const email = createJourneyLeadEmail(lead);
      let response: Response;
      try {
        response = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: sender, to: recipients, ...email }),
          signal: AbortSignal.timeout(7000),
        });
      } catch {
        throw new JourneyLeadNotificationError("provider_unavailable");
      }
      if (!response.ok) {
        throw new JourneyLeadNotificationError(response.status === 429 ? "provider_rate_limited" : "provider_rejected");
      }
      let providerRequestId: string | undefined;
      try {
        const body = await response.json() as { id?: unknown };
        if (typeof body.id === "string" && body.id.length <= 100) providerRequestId = body.id;
      } catch {
        // A successful provider response without a readable ID remains successful.
      }
      const messageId = providerRequestId ? await retrieveMessageId(providerRequestId) : undefined;
      return { status: "sent", ...(providerRequestId ? { providerRequestId } : {}), ...(messageId ? { messageId } : {}) };
    },

    async sendCallback(callback) {
      const originalMessageId = callback.initialMessageId ?? (
        callback.initialProviderRequestId ? await retrieveMessageId(callback.initialProviderRequestId) : undefined
      );
      if (!originalMessageId) throw new JourneyLeadNotificationError("thread_reference_missing");
      const email = createJourneyCallbackEmail(callback, originalMessageId);
      let response: Response;
      try {
        response = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `callback/${callback.passportReference}/${callback.fingerprint}`,
          },
          body: JSON.stringify({ from: sender, to: recipients, ...email }),
          signal: AbortSignal.timeout(7000),
        });
      } catch {
        throw new JourneyLeadNotificationError("provider_unavailable");
      }
      if (!response.ok) {
        throw new JourneyLeadNotificationError(response.status === 429 ? "provider_rate_limited" : "provider_rejected");
      }
      let providerRequestId: string | undefined;
      try {
        const body = await response.json() as { id?: unknown };
        if (typeof body.id === "string" && body.id.length <= 100) providerRequestId = body.id;
      } catch {
        // A successful provider response without a readable ID remains successful.
      }
      const messageId = providerRequestId ? await retrieveMessageId(providerRequestId) : undefined;
      return {
        status: "sent",
        originalMessageId,
        ...(providerRequestId ? { providerRequestId } : {}),
        ...(messageId ? { messageId } : {}),
      };
    },
  };
}
