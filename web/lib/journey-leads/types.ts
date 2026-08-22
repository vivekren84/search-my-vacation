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
    // EBC-030: governed Travel Inspiration stable IDs (replaces the previous
    // ad-hoc Mountains/Beaches/Wildlife/Romance/Relaxation set).
    inspiration?:
      | "feeling-led"
      | "slow-unhurried"
      | "family-time"
      | "short-restorative-escape"
      | "food-culture-local"
      | "nature-led"
      | "travel-celebration"
      | "first-international";
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
  /** Single-use token from a successful POST /api/journey-passport/otp/verify (DEC-R1.2-006). */
  verificationToken: string;
  passportSummary: JourneyLeadPassportSummary;
};

export type ValidatedJourneyLead = Omit<JourneyLeadSubmission, "passportSummary"> & {
  passportSummary: JourneyLeadPassportSummary & { source: "journey-passport" };
  mobileNormalized: string;
  /**
   * E.164-formatted mobile number (e.g. "+919000000000"), derived at validation time via
   * libphonenumber-js. Dual-field strategy (EBC-R1.2-WS5-03 Product Owner resolution):
   * mobileNumber/mobileNormalized retain their original bare-national-number format for
   * backward compatibility with the existing Callback RPC (claim_journey_passport_callback);
   * mobileE164 is a separate, additive field used for OTP verification / SMS delivery and
   * intended for progressive adoption by future features.
   */
  mobileE164: string;
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
