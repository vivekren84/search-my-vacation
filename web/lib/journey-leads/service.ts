import { createHash } from "node:crypto";

import { maskPassportReference, safeNotificationErrorCode } from "./repository";
import type {
  JourneyCallbackNotifier,
  JourneyCallbackRepository,
  JourneyLeadEventType,
  JourneyLeadNotifier,
  JourneyLeadRepository,
  ValidatedJourneyCallback,
  ValidatedJourneyLead,
} from "./types";
import { isJourneyPassportReference } from "./validation";

type JourneyLeadServiceDependencies = {
  repository: JourneyLeadRepository;
  notifier: JourneyLeadNotifier;
  createClaimToken?: () => string;
};

async function recordEventSafely(
  repository: Pick<JourneyLeadRepository, "recordEvent">,
  passportReference: string,
  eventType: JourneyLeadEventType,
  payload?: Record<string, string>,
) {
  try {
    await repository.recordEvent(passportReference, eventType, payload);
  } catch {
    console.error("Journey lead event recording failed.", {
      passportReference: maskPassportReference(passportReference), eventType,
    });
  }
}

export class JourneyCallbackProcessingError extends Error {
  constructor(readonly code: string) {
    super("Journey callback request could not be processed");
    this.name = "JourneyCallbackProcessingError";
  }
}

export function createJourneyCallbackFingerprint(callback: ValidatedJourneyCallback) {
  return createHash("sha256").update(JSON.stringify([
    callback.passportReference,
    callback.preferredDate,
    callback.preferredTimeWindow,
    callback.additionalComments,
  ])).digest("hex");
}

export async function processJourneyCallback(
  callback: ValidatedJourneyCallback,
  dependencies: {
    repository: JourneyCallbackRepository;
    notifier: JourneyCallbackNotifier;
    createClaimToken?: () => string;
  },
) {
  const { repository, notifier } = dependencies;
  const fingerprint = createJourneyCallbackFingerprint(callback);
  const claimToken = dependencies.createClaimToken?.() ?? crypto.randomUUID();
  const claim = await repository.claimCallback(callback, fingerprint, claimToken);
  if (claim.status === "not-found") throw new JourneyCallbackProcessingError("lead_not_found");
  if (claim.status === "duplicate") {
    return { stored: true as const, notificationStatus: "duplicate" as const };
  }

  const eventPayload = {
    preferredDate: callback.preferredDate,
    preferredTimeWindow: callback.preferredTimeWindow,
    fingerprint,
  };
  await recordEventSafely(repository, callback.passportReference, "callback_preference_updated", eventPayload);

  try {
    const notification = await notifier.sendCallback(claim.callback);
    if (notification.status === "not-configured") {
      await repository.updateCallbackNotification(
        claim.callback,
        claimToken,
        "not-configured",
        "notification_configuration_missing",
        notification,
      );
      await recordEventSafely(repository, callback.passportReference, "callback_preference_updated", {
        ...eventPayload,
        notificationStatus: "not-configured",
      });
      return { stored: true as const, notificationStatus: "not-configured" as const };
    }
    await repository.updateCallbackNotification(claim.callback, claimToken, "sent", undefined, notification);
    await recordEventSafely(repository, callback.passportReference, "callback_preference_updated", {
      ...eventPayload,
      notificationStatus: "sent",
      provider: "resend",
      ...(notification.providerRequestId ? { requestId: notification.providerRequestId } : {}),
    });
    return { stored: true as const, notificationStatus: "sent" as const };
  } catch (error) {
    const errorCode = safeNotificationErrorCode(error);
    try {
      await repository.updateCallbackNotification(claim.callback, claimToken, "failed", errorCode);
    } catch {
      console.error("Journey callback notification status recording failed.", {
        passportReference: maskPassportReference(callback.passportReference), code: errorCode,
      });
    }
    await recordEventSafely(repository, callback.passportReference, "callback_preference_updated", {
      ...eventPayload,
      notificationStatus: "failed",
      code: errorCode,
    });
    console.error("Journey callback notification failed.", {
      passportReference: maskPassportReference(callback.passportReference), code: errorCode,
    });
    return { stored: true as const, notificationStatus: "failed" as const };
  }
}

export async function processJourneyLead(lead: ValidatedJourneyLead, dependencies: JourneyLeadServiceDependencies) {
  const { repository, notifier } = dependencies;
  await repository.upsertLead(lead);
  await recordEventSafely(repository, lead.passportReference, "passport_issued");
  await recordEventSafely(repository, lead.passportReference, "lead_saved", { status: lead.status });

  const claimToken = dependencies.createClaimToken?.() ?? crypto.randomUUID();
  let claimed = false;
  try {
    claimed = await repository.claimNotification(lead.passportReference, claimToken);
  } catch {
    console.error("Journey lead notification claim failed.", {
      passportReference: maskPassportReference(lead.passportReference), operation: "notification_claim",
    });
    return { stored: true as const, notificationStatus: "failed" as const };
  }
  if (!claimed) return { stored: true as const, notificationStatus: "pending" as const };

  try {
    const notification = await notifier.send(lead);
    if (notification.status === "not-configured") {
      await repository.updateNotification(lead.passportReference, claimToken, "not-configured", "notification_configuration_missing");
      await recordEventSafely(repository, lead.passportReference, "notification_failed", { code: "not-configured" });
      return { stored: true as const, notificationStatus: "not-configured" as const };
    }
    await repository.updateNotification(lead.passportReference, claimToken, "sent", undefined, notification);
    await recordEventSafely(repository, lead.passportReference, "notification_sent", {
      provider: "resend",
      ...(notification.providerRequestId ? { requestId: notification.providerRequestId } : {}),
    });
    return { stored: true as const, notificationStatus: "sent" as const };
  } catch (error) {
    const errorCode = safeNotificationErrorCode(error);
    try {
      await repository.updateNotification(lead.passportReference, claimToken, "failed", errorCode);
    } catch {
      console.error("Journey lead notification status recording failed.", {
        passportReference: maskPassportReference(lead.passportReference), code: errorCode,
      });
    }
    await recordEventSafely(repository, lead.passportReference, "notification_failed", { code: errorCode });
    console.error("Journey lead notification failed.", {
      passportReference: maskPassportReference(lead.passportReference), code: errorCode,
    });
    return { stored: true as const, notificationStatus: "failed" as const };
  }
}

export async function processJourneyLeadEvent(
  value: unknown,
  repository: JourneyLeadRepository,
) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => key !== "passportReference" && key !== "eventType")) return false;
  if (!isJourneyPassportReference(record.passportReference)) return false;
  if (record.eventType !== "journey_director_entered" && record.eventType !== "whatsapp_handoff_opened") return false;
  if (record.eventType === "whatsapp_handoff_opened") {
    const updated = await repository.markWhatsAppHandoff(record.passportReference);
    if (!updated) return true;
  }
  await recordEventSafely(repository, record.passportReference, record.eventType);
  return true;
}
