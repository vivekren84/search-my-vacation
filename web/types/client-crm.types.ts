/**
 * Search My Vacation — Client CRM & Lead Briefing Types (Release 1.5 — Milestone 2)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Governs Decoupled Master Client Profiles (US-004), Preference Tags (US-005),
 * Activity Feed (US-006), and Advisor Handoff Lead Briefing (GAP-04).
 */

export type LeadSource =
  | "founder_network"
  | "client_referral"
  | "instagram"
  | "website"
  | "concierge_partner"
  | "other";

export type TagCategory = "dietary" | "pace" | "accommodation" | "comfort" | "general";

export type ActivityType = "system" | "call" | "whatsapp" | "meeting" | "note";

export type CompanionRelationship = "spouse" | "child" | "parent" | "friend" | "colleague" | "other";

export interface ClientCompanionRecord {
  id?: string;
  clientId?: string;
  fullName: string;
  relationship: CompanionRelationship;
  dob?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface ClientTagRecord {
  id?: string;
  clientId?: string;
  category: TagCategory;
  tagValue: string;
  createdAt?: string;
}

export interface ClientActivityRecord {
  id: string;
  clientId: string;
  journeyId: string | null;
  authorId: string | null;
  activityType: ActivityType;
  body: string;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSize?: number;
  }>;
  createdAt: string;
}

export interface MasterClientProfile {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  phoneE164: string | null;
  nationality: string | null;
  dob: string | null;
  leadSource: LeadSource | null;
  isVip: boolean;
  companions: ClientCompanionRecord[];
  tags: ClientTagRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadBriefingRecord {
  leadId: string;
  passportReference: string;
  guestName: string;
  mobileE164: string;
  moodArchetype: {
    title: string;
    badge: string;
  };
  pilotRegion: {
    primary: string;
    secondary?: string;
    tertiary?: string;
    primaryWeight: number;
  };
  comfortSignals: string[];
  extractedThemes: string[];
  indicativeDuration: string;
  travelParty: string;
  destinationFreeText: string | null;
  submittedAt: string;
}

export interface DuplicateDetectionResult {
  hasDuplicate: boolean;
  matchedClientId?: string;
  matchReason?: "phone" | "email";
  matchedClientName?: string;
  warningMessage?: string;
}
