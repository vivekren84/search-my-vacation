/**
 * Search My Vacation — Master Client CRM & Lead Briefing Service (Release 1.5 — Milestone 2)
 *
 * Implements:
 * - Decoupled Master Client Profiles with Duplicate Detection (US-004)
 * - Structured Preference Tagging & Lead Attribution (US-005)
 * - Chronological Activity Feed (US-006)
 * - Structured Journey Designer Handoff Briefing View (GAP-04)
 */

import { normalizeE164 } from "../../phone/phone-normalization.js";
import type {
  ActivityType,
  ClientActivityRecord,
  ClientCompanionRecord,
  ClientTagRecord,
  DuplicateDetectionResult,
  LeadBriefingRecord,
  LeadSource,
  MasterClientProfile,
  TagCategory,
} from "../../../types/client-crm.types";

// In-memory CRM store for $0.00 zero-network test execution
const inMemoryClients = new Map<string, MasterClientProfile>();
const inMemoryActivities = new Map<string, ClientActivityRecord>();

export class ClientCrmService {
  /**
   * US-004: Detect existing client records by normalized E.164 phone or email
   */
  detectDuplicate(params: { email?: string | null; phone?: string | null }): DuplicateDetectionResult {
    const normalizedEmail = params.email?.trim().toLowerCase();
    const normalizedPhone = params.phone ? normalizeE164(params.phone) : null;

    for (const client of inMemoryClients.values()) {
      if (normalizedPhone && client.phoneE164 === normalizedPhone) {
        return {
          hasDuplicate: true,
          matchedClientId: client.id,
          matchReason: "phone",
          matchedClientName: client.fullName,
          warningMessage: `Existing client record found matching mobile ${client.phoneE164}: "${client.fullName}". Would you like to link this inquiry?`,
        };
      }

      if (normalizedEmail && client.email && client.email.toLowerCase() === normalizedEmail) {
        return {
          hasDuplicate: true,
          matchedClientId: client.id,
          matchReason: "email",
          matchedClientName: client.fullName,
          warningMessage: `Existing client record found matching email ${client.email}: "${client.fullName}". Would you like to link this inquiry?`,
        };
      }
    }

    return { hasDuplicate: false };
  }

  /**
   * US-004 & US-005: Create Decoupled Master Client Profile
   */
  async createClientProfile(params: {
    fullName: string;
    email?: string | null;
    phone?: string | null;
    nationality?: string | null;
    dob?: string | null;
    leadSource: LeadSource;
    isVip?: boolean;
    companions?: ClientCompanionRecord[];
    tags?: Array<{ category: TagCategory; tagValue: string }>;
    initialActivityNote?: string;
    authorId?: string;
  }): Promise<MasterClientProfile> {
    if (!params.fullName || params.fullName.trim().length === 0) {
      throw new Error("validation_failed: Client full name is mandatory");
    }

    // Mandatory Lead Attribution (US-005)
    if (!params.leadSource) {
      throw new Error("validation_failed: Lead Source attribution is mandatory on new inquiries");
    }

    const clientId = `clt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    const phoneE164 = params.phone ? normalizeE164(params.phone) : null;

    const companions: ClientCompanionRecord[] = (params.companions ?? []).map((c, idx) => ({
      id: `comp_${Date.now()}_${idx}`,
      clientId,
      fullName: c.fullName.trim(),
      relationship: c.relationship,
      dob: c.dob ?? null,
      notes: c.notes ?? null,
      createdAt: nowIso,
    }));

    const tags: ClientTagRecord[] = (params.tags ?? []).map((t, idx) => ({
      id: `tag_${Date.now()}_${idx}`,
      clientId,
      category: t.category,
      tagValue: t.tagValue.trim(),
      createdAt: nowIso,
    }));

    const client: MasterClientProfile = {
      id: clientId,
      fullName: params.fullName.trim(),
      email: params.email?.trim().toLowerCase() ?? null,
      phone: params.phone?.trim() ?? null,
      phoneE164,
      nationality: params.nationality?.trim() ?? null,
      dob: params.dob ?? null,
      leadSource: params.leadSource,
      isVip: params.isVip ?? false,
      companions,
      tags,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    inMemoryClients.set(clientId, client);

    // Initial activity log if provided (US-006)
    if (params.initialActivityNote) {
      await this.addActivity({
        clientId,
        authorId: params.authorId ?? null,
        activityType: "note",
        body: params.initialActivityNote,
      });
    }

    return client;
  }

  /**
   * Fetch Master Client Profile by ID
   */
  async getClientProfile(clientId: string): Promise<MasterClientProfile | null> {
    return inMemoryClients.get(clientId) ?? null;
  }

  /**
   * US-005: Add tags to a client record
   */
  async addClientTags(
    clientId: string,
    tagsToAdd: Array<{ category: TagCategory; tagValue: string }>,
  ): Promise<MasterClientProfile> {
    const client = inMemoryClients.get(clientId);
    if (!client) throw new Error("client_not_found");

    const nowIso = new Date().toISOString();
    for (const t of tagsToAdd) {
      const exists = client.tags.some(
        (existing) => existing.category === t.category && existing.tagValue.toLowerCase() === t.tagValue.toLowerCase(),
      );
      if (!exists) {
        client.tags.push({
          id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          clientId,
          category: t.category,
          tagValue: t.tagValue.trim(),
          createdAt: nowIso,
        });
      }
    }
    client.updatedAt = nowIso;
    return client;
  }

  /**
   * US-005: Remove tag from a client record
   */
  async removeClientTag(clientId: string, tagIdOrValue: string): Promise<MasterClientProfile> {
    const client = inMemoryClients.get(clientId);
    if (!client) throw new Error("client_not_found");

    client.tags = client.tags.filter(
      (t) => t.id !== tagIdOrValue && t.tagValue.toLowerCase() !== tagIdOrValue.toLowerCase(),
    );
    client.updatedAt = new Date().toISOString();
    return client;
  }

  /**
   * US-004: Add companion to existing client record
   */
  async addCompanion(
    clientId: string,
    companion: Omit<ClientCompanionRecord, "id" | "clientId" | "createdAt">,
  ): Promise<ClientCompanionRecord> {
    const client = inMemoryClients.get(clientId);
    if (!client) throw new Error("client_not_found");

    const newCompanion: ClientCompanionRecord = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId,
      fullName: companion.fullName.trim(),
      relationship: companion.relationship,
      dob: companion.dob ?? null,
      notes: companion.notes ?? null,
      createdAt: new Date().toISOString(),
    };

    client.companions.push(newCompanion);
    client.updatedAt = new Date().toISOString();
    return newCompanion;
  }

  /**
   * US-004: Update master client profile details (e.g. VIP status, contact info)
   */
  async updateClientProfile(
    clientId: string,
    updates: Partial<{
      fullName: string;
      email: string | null;
      phone: string | null;
      nationality: string | null;
      dob: string | null;
      isVip: boolean;
    }>,
  ): Promise<MasterClientProfile> {
    const client = inMemoryClients.get(clientId);
    if (!client) throw new Error("client_not_found");

    if (updates.fullName !== undefined) {
      if (!updates.fullName.trim()) throw new Error("validation_failed: Client full name cannot be empty");
      client.fullName = updates.fullName.trim();
    }
    if (updates.email !== undefined) {
      client.email = updates.email ? updates.email.trim().toLowerCase() : null;
    }
    if (updates.phone !== undefined) {
      client.phone = updates.phone ? updates.phone.trim() : null;
      client.phoneE164 = updates.phone ? normalizeE164(updates.phone) : null;
    }
    if (updates.nationality !== undefined) {
      client.nationality = updates.nationality ? updates.nationality.trim() : null;
    }
    if (updates.dob !== undefined) {
      client.dob = updates.dob ?? null;
    }
    if (updates.isVip !== undefined) {
      client.isVip = updates.isVip;
    }

    client.updatedAt = new Date().toISOString();
    return client;
  }

  /**
   * US-006: Add an activity note to the client chronological feed
   */
  async addActivity(params: {
    clientId: string;
    journeyId?: string | null;
    authorId?: string | null;
    activityType: ActivityType;
    body: string;
    attachments?: Array<{ fileName: string; fileUrl: string; fileSize?: number }>;
  }): Promise<ClientActivityRecord> {
    const client = inMemoryClients.get(params.clientId);
    if (!client) throw new Error("client_not_found");

    const activityId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: ClientActivityRecord = {
      id: activityId,
      clientId: params.clientId,
      journeyId: params.journeyId ?? null,
      authorId: params.authorId ?? null,
      activityType: params.activityType,
      body: params.body.trim(),
      attachments: params.attachments ?? [],
      createdAt: new Date().toISOString(),
    };

    inMemoryActivities.set(activityId, record);
    return record;
  }

  /**
   * US-006: Get chronological activity stream for a client
   */
  async getClientActivities(clientId: string): Promise<readonly ClientActivityRecord[]> {
    return Array.from(inMemoryActivities.values())
      .filter((a) => a.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * GAP-04: Transform raw public Passport lead into structured advisor briefing
   */
  formatLeadBriefing(rawLead: {
    id: string;
    passport_reference: string;
    guest_name: string;
    mobile_normalized?: string;
    mobile_e164?: string;
    destination_free_text?: string | null;
    passport_summary?: any;
    travel_styles?: any;
    timing?: any;
    companions?: any;
    created_at?: string;
  }): LeadBriefingRecord {
    const summary = rawLead.passport_summary ?? {};
    const archetype = summary.archetype ?? {
      title: "Heritage Splendour & Royal Sanctuaries",
      badge: "Royal Sanctuary",
    };
    const regions = summary.pilotRegions ?? {
      primary: "Rajasthan Regal Circuit",
      secondary: "Himachal Highlands",
      tertiary: "Kerala Backwaters",
      primaryWeight: 50,
    };
    const comfortSignals = summary.comfortSignals ?? ["Pure Veg / Jain Cuisine", "Connecting Suites"];
    const extractedThemes = summary.extractedThemes ?? [
      "Private lake cruise",
      "Royal palace dinner",
      "Artisan workshop for children",
    ];

    const mobile = rawLead.mobile_e164 ?? rawLead.mobile_normalized ?? "+919820144821";

    return {
      leadId: rawLead.id,
      passportReference: rawLead.passport_reference,
      guestName: rawLead.guest_name,
      mobileE164: mobile,
      moodArchetype: archetype,
      pilotRegion: regions,
      comfortSignals,
      extractedThemes,
      indicativeDuration: summary.duration ?? "10-12 Days",
      travelParty: summary.travelParty ?? "2 Adults, 2 Children (Ages 8 & 11)",
      destinationFreeText: rawLead.destination_free_text ?? null,
      submittedAt: rawLead.created_at ?? new Date().toISOString(),
    };
  }

  /**
   * Filter and search client directory
   */
  async searchClients(params?: {
    query?: string;
    leadSource?: LeadSource;
    tagValue?: string;
  }): Promise<readonly MasterClientProfile[]> {
    let result = Array.from(inMemoryClients.values());

    if (params?.leadSource) {
      result = result.filter((c) => c.leadSource === params.leadSource);
    }

    if (params?.tagValue) {
      const targetTag = params.tagValue.toLowerCase();
      result = result.filter((c) => c.tags.some((t) => t.tagValue.toLowerCase() === targetTag));
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phoneE164 && c.phoneE164.includes(q)),
      );
    }

    return result;
  }

  clearAllForTesting(): void {
    inMemoryClients.clear();
    inMemoryActivities.clear();
  }
}

export const clientCrmService = new ClientCrmService();
