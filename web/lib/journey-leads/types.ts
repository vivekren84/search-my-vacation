export const JOURNEY_LEAD_EVENT_TYPES = [
  "passport_issued",
  "lead_saved",
  "notification_sent",
  "notification_failed",
  "journey_director_entered",
  "whatsapp_handoff_opened",
  "callback_preference_updated",
] as const;

export type JourneyLeadEventType = (typeof JOURNEY_LEAD_EVENT_TYPES)[number];
export type JourneyLeadNotificationStatus = "pending" | "sent" | "failed" | "not-configured";

export type JourneyLeadPassportSummary = {
  name: string;
  mobile: string;
  journeyReference: string;
  companion: string;
  dreamJourney: string;
  travelStyles: string[];
  timing: string;
  startDate: string;
  endDate: string;
  destinationMode: "known" | "discovery";
  destination: string;
  travelScope?: "DOMESTIC" | "INTERNATIONAL" | "ANY";
  entryContext?: {
    // EBC-036 (D-08): "memory" added alongside the other five moods now that
    // Memory Maker routes through the shared `?mood=` mechanism.
    feeling?: "relax" | "explore" | "celebrate" | "romance" | "escape" | "memory";
    experience?: "Memory Makers" | "Celebration Moments" | "Family Time" | "Weekend Getaways" | "Global Escapes" | "Nature & Serenity";
    inspiration?: "Mountains" | "Beaches" | "Wildlife" | "Romance" | "Relaxation";
    destination?: string;
    destinationTheme?: "Tropical Escape" | "Mountain Retreat" | "City Discovery" | "Wildlife Adventure";
    source?: "homepage" | "direct" | "experience" | "mood" | "inspiration" | "destination";
  };
  completedAt: string;
  source: "journey-passport" | "demo";
};

export type JourneyLeadSubmission = {
  passportReference: string;
  guestName: string;
  mobileNumber: string;
  passportSummary: JourneyLeadPassportSummary;
};

export type ValidatedJourneyLead = Omit<JourneyLeadSubmission, "passportSummary"> & {
  passportSummary: JourneyLeadPassportSummary & { source: "journey-passport" };
  mobileNormalized: string;
  source: "journey-passport";
  status: "entered-journey-director";
};

export type JourneyLeadNotification = {
  status: "sent" | "not-configured";
  providerRequestId?: string;
  messageId?: string;
};

export type JourneyCallbackPreference = {
  preferredDate: string;
  preferredTimeWindow: string;
  additionalComments: string;
};

export type JourneyCallbackSubmission = JourneyCallbackPreference & {
  passportReference: string;
  guestName: string;
  mobileNumber: string;
};

export type ValidatedJourneyCallback = JourneyCallbackSubmission & {
  mobileNormalized: string;
};

export type JourneyCallbackLead = ValidatedJourneyCallback & {
  fingerprint: string;
  initialProviderRequestId?: string;
  initialMessageId?: string;
};

export type JourneyCallbackClaim =
  | { status: "not-found" }
  | { status: "duplicate" }
  | { status: "claimed"; callback: JourneyCallbackLead };

export type JourneyCallbackNotification = {
  status: "sent" | "not-configured";
  providerRequestId?: string;
  messageId?: string;
  originalMessageId?: string;
};

export interface JourneyLeadNotifier {
  send(lead: ValidatedJourneyLead): Promise<JourneyLeadNotification>;
}

export interface JourneyCallbackNotifier {
  sendCallback(callback: JourneyCallbackLead): Promise<JourneyCallbackNotification>;
}

export interface JourneyLeadRepository {
  upsertLead(lead: ValidatedJourneyLead): Promise<void>;
  recordEvent(passportReference: string, eventType: JourneyLeadEventType, payload?: Record<string, string>): Promise<void>;
  claimNotification(passportReference: string, claimToken: string): Promise<boolean>;
  updateNotification(
    passportReference: string,
    claimToken: string,
    status: JourneyLeadNotificationStatus,
    errorCode?: string,
    notification?: JourneyLeadNotification,
  ): Promise<void>;
  markWhatsAppHandoff(passportReference: string): Promise<boolean>;
}

export interface JourneyCallbackRepository {
  recordEvent(passportReference: string, eventType: JourneyLeadEventType, payload?: Record<string, string>): Promise<void>;
  claimCallback(
    callback: ValidatedJourneyCallback,
    fingerprint: string,
    claimToken: string,
  ): Promise<JourneyCallbackClaim>;
  updateCallbackNotification(
    callback: JourneyCallbackLead,
    claimToken: string,
    status: JourneyLeadNotificationStatus,
    errorCode?: string,
    notification?: JourneyCallbackNotification,
  ): Promise<void>;
}

export type JourneyPassportRepository = JourneyLeadRepository & JourneyCallbackRepository;
