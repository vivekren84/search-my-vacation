/**
 * Search My Vacation — Bespoke Itinerary Builder, Dynamic Pricing Engine & Margin Governance Service
 * (Release 1.5 — Milestone 3)
 *
 * Implements:
 * - US-007: Modular Day-by-Day Itinerary Builder & Live Reordering
 * - US-008: Dynamic Net Cost, Markup & Margin Engine
 * - US-009: Margin Override & Privileged Approval Workflow
 * - US-010: White-Label Proposal Export & Version Snapshotting
 */

import type { StaffRole } from "../../../types/staff-portal.types.js";
import type {
  ClientFacingProposal,
  ClientFacingSegment,
  CommercialPricingSummary,
  ItineraryDayRecord,
  ItinerarySegmentRecord,
  ItineraryStatus,
  MarginOverrideRecord,
  MarginOverrideStatus,
  MarginStatus,
  MasterItineraryRecord,
  SegmentType,
} from "../../../types/itinerary-pricing.types.js";
import { staffAuditLogger } from "../audit/logger.js";

// In-memory stores for $0.00 zero-cost automated tests
const inMemoryItineraries = new Map<string, MasterItineraryRecord>();
const inMemoryOverrides = new Map<string, MarginOverrideRecord>();
const inMemoryProposalVersions = new Map<string, ClientFacingProposal[]>();

const DEFAULT_FLOOR_MARGIN = 12.0; // 12.00% hard floor

function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export class ItineraryPricingService {
  /**
   * US-007: Create Master Itinerary Record
   */
  async createItinerary(params: {
    clientId: string;
    journeyId?: string | null;
    createdBy?: string | null;
    title: string;
    circuitSummary?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    durationDays: number;
    currency?: string;
  }): Promise<MasterItineraryRecord> {
    if (!params.title || !params.title.trim()) {
      throw new Error("validation_failed: Itinerary title is mandatory");
    }
    if (!params.clientId) {
      throw new Error("validation_failed: Client ID is mandatory to link itinerary");
    }

    const itineraryId = `itin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    // Initialize days structure based on duration
    const days: ItineraryDayRecord[] = [];
    for (let d = 1; d <= params.durationDays; d++) {
      days.push({
        id: `day_${itineraryId}_${d}`,
        itineraryId,
        dayNumber: d,
        title: `Day ${d}: Curated Journey Exploration`,
        destination: "Destination TBD",
        notes: null,
        segments: [],
        createdAt: nowIso,
      });
    }

    const initialPricing: CommercialPricingSummary = {
      totalNetCost: 0,
      totalMarkupAmount: 0,
      totalTaxAmount: 0,
      grossSellingPrice: 0,
      grossProfit: 0,
      realizedMarginPercent: 0,
      marginStatus: "healthy",
      floorMarginPercent: DEFAULT_FLOOR_MARGIN,
      isBreached: false,
      isOverrideRequired: false,
      isExportLocked: false,
    };

    const itinerary: MasterItineraryRecord = {
      id: itineraryId,
      clientId: params.clientId,
      journeyId: params.journeyId ?? null,
      createdBy: params.createdBy ?? null,
      title: params.title.trim(),
      circuitSummary: params.circuitSummary?.trim() ?? null,
      startDate: params.startDate ?? null,
      endDate: params.endDate ?? null,
      durationDays: params.durationDays,
      currency: params.currency ?? "INR",
      status: "draft",
      currentVersion: "v1.0",
      days,
      pricing: initialPricing,
      activeMarginOverride: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    inMemoryItineraries.set(itineraryId, itinerary);
    return itinerary;
  }

  /**
   * Fetch itinerary by ID
   */
  async getItinerary(itineraryId: string): Promise<MasterItineraryRecord | null> {
    const itin = inMemoryItineraries.get(itineraryId);
    if (!itin) return null;
    this.refreshPricing(itin);
    return itin;
  }

  /**
   * Update Day Details (Title, Destination, Notes)
   */
  async updateDay(
    itineraryId: string,
    dayNumber: number,
    updates: { title?: string; destination?: string; notes?: string },
  ): Promise<ItineraryDayRecord> {
    const itin = inMemoryItineraries.get(itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    const day = itin.days.find((d) => d.dayNumber === dayNumber);
    if (!day) throw new Error(`day_${dayNumber}_not_found`);

    if (updates.title) day.title = updates.title.trim();
    if (updates.destination) day.destination = updates.destination.trim();
    if (updates.notes !== undefined) day.notes = updates.notes;

    itin.updatedAt = new Date().toISOString();
    return day;
  }

  /**
   * US-007 & US-008: Add Segment with Automated Line-Item Costing
   */
  async addSegment(
    itineraryId: string,
    dayNumber: number,
    segment: {
      segmentType: SegmentType;
      title: string;
      description?: string | null;
      vendorName?: string | null;
      vendorContact?: string | null;
      netCost: number;
      markupPercent?: number; // Defaults to 15.0%
      taxPercent?: number; // Defaults to 18.0% GST
      metadata?: Record<string, any>;
    },
  ): Promise<ItinerarySegmentRecord> {
    const itin = inMemoryItineraries.get(itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    const day = itin.days.find((d) => d.dayNumber === dayNumber);
    if (!day) throw new Error(`day_${dayNumber}_not_found`);

    const markupPercent = segment.markupPercent ?? 15.0;
    const taxPercent = segment.taxPercent ?? 18.0;

    const netCost = round2(segment.netCost);
    const markupAmount = round2(netCost * (markupPercent / 100));
    const taxAmount = round2((netCost + markupAmount) * (taxPercent / 100));
    const sellingPrice = round2(netCost + markupAmount + taxAmount);

    const segmentRecord: ItinerarySegmentRecord = {
      id: `seg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dayId: day.id,
      itineraryId,
      orderIndex: day.segments.length,
      segmentType: segment.segmentType,
      title: segment.title.trim(),
      description: segment.description?.trim() ?? null,
      vendorName: segment.vendorName?.trim() ?? null,
      vendorContact: segment.vendorContact?.trim() ?? null,
      netCost,
      markupPercent,
      markupAmount,
      taxPercent,
      taxAmount,
      sellingPrice,
      metadata: segment.metadata,
      createdAt: new Date().toISOString(),
    };

    day.segments.push(segmentRecord);
    this.refreshPricing(itin);
    itin.updatedAt = new Date().toISOString();
    return segmentRecord;
  }

  /**
   * US-007: Reorder Segments within a Day
   */
  async reorderSegments(itineraryId: string, dayNumber: number, orderedSegmentIds: string[]): Promise<ItineraryDayRecord> {
    const itin = inMemoryItineraries.get(itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    const day = itin.days.find((d) => d.dayNumber === dayNumber);
    if (!day) throw new Error(`day_${dayNumber}_not_found`);

    const segmentMap = new Map(day.segments.map((s) => [s.id, s]));
    const reordered: ItinerarySegmentRecord[] = [];

    orderedSegmentIds.forEach((id, idx) => {
      const seg = segmentMap.get(id);
      if (seg) {
        seg.orderIndex = idx;
        reordered.push(seg);
      }
    });

    day.segments = reordered;
    itin.updatedAt = new Date().toISOString();
    return day;
  }

  /**
   * US-008: Automated Net Cost, Markup & Margin Engine Calculation
   */
  private refreshPricing(itin: MasterItineraryRecord): void {
    let totalNet = 0;
    let totalMarkup = 0;
    let totalTax = 0;
    let calculatedSelling = 0;

    for (const day of itin.days) {
      for (const seg of day.segments) {
        totalNet += seg.netCost;
        totalMarkup += seg.markupAmount;
        totalTax += seg.taxAmount;
        calculatedSelling += seg.sellingPrice;
      }
    }

    totalNet = round2(totalNet);
    totalMarkup = round2(totalMarkup);
    totalTax = round2(totalTax);
    calculatedSelling = round2(calculatedSelling);

    const totalSelling = itin.customSellingPrice ?? calculatedSelling;
    const grossProfit = round2(totalSelling - totalNet - totalTax);

    let realizedMargin = 0;
    if (totalSelling > 0) {
      realizedMargin = round2(((totalSelling - totalNet) / totalSelling) * 100);
    }

    let status: MarginStatus = "healthy";
    if (realizedMargin < DEFAULT_FLOOR_MARGIN) {
      status = "breached";
    } else if (realizedMargin < 15.0) {
      status = "moderate";
    }

    const hasApprovedOverride =
      itin.activeMarginOverride?.status === "approved" &&
      itin.activeMarginOverride.targetSellingPrice <= totalSelling;

    const isBreached = status === "breached";
    const isExportLocked = isBreached && !hasApprovedOverride;

    itin.pricing = {
      totalNetCost: totalNet,
      totalMarkupAmount: totalMarkup,
      totalTaxAmount: totalTax,
      grossSellingPrice: totalSelling,
      grossProfit,
      realizedMarginPercent: realizedMargin,
      marginStatus: status,
      floorMarginPercent: DEFAULT_FLOOR_MARGIN,
      isBreached,
      isOverrideRequired: isBreached && !hasApprovedOverride,
      isExportLocked,
    };
  }

  /**
   * US-008: Update manual markup override or total selling price adjustment
   */
  async applyCustomDiscount(
    itineraryId: string,
    customSellingPrice: number,
  ): Promise<CommercialPricingSummary> {
    const itin = inMemoryItineraries.get(itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    const targetSelling = round2(customSellingPrice);
    const totalNet = itin.pricing.totalNetCost;

    if (totalNet <= 0) {
      throw new Error("pricing_error: Cannot apply discount to itinerary with zero net cost");
    }

    itin.customSellingPrice = targetSelling;
    this.refreshPricing(itin);
    itin.updatedAt = new Date().toISOString();
    return itin.pricing;
  }

  /**
   * US-009: Submit Margin Override Request
   */
  async requestMarginOverride(params: {
    itineraryId: string;
    requestedBy: string;
    targetSellingPrice: number;
    justification: string;
  }): Promise<MarginOverrideRecord> {
    const itin = inMemoryItineraries.get(params.itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    if (!params.justification || params.justification.trim().length < 5) {
      throw new Error("validation_failed: Detailed justification required for margin override");
    }

    const netCost = itin.pricing.totalNetCost;
    const targetSelling = round2(params.targetSellingPrice);
    const proposedMargin = round2(((targetSelling - netCost) / targetSelling) * 100);

    const overrideId = `ovr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const record: MarginOverrideRecord = {
      id: overrideId,
      itineraryId: params.itineraryId,
      requestedBy: params.requestedBy,
      targetSellingPrice: targetSelling,
      netCost,
      proposedMarginPercent: proposedMargin,
      floorMarginPercent: DEFAULT_FLOOR_MARGIN,
      justification: params.justification.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    inMemoryOverrides.set(overrideId, record);
    itin.activeMarginOverride = record;
    this.refreshPricing(itin);

    await staffAuditLogger.logEvent({
      actorId: params.requestedBy,
      entityType: "itinerary",
      entityId: params.itineraryId,
      eventType: "margin_override_requested",
      eventData: {
        overrideId,
        proposedMarginPercent: proposedMargin,
        justification: params.justification,
      },
    });

    return record;
  }

  /**
   * US-009: Review Margin Override Request (Privileged User / Administrator Only)
   */
  async reviewMarginOverride(params: {
    overrideId: string;
    reviewerId: string;
    reviewerRole: StaffRole;
    action: "approve" | "reject";
    reviewNotes?: string;
  }): Promise<MarginOverrideRecord> {
    // RBAC: Desk users cannot approve overrides (403)
    if (params.reviewerRole === "desk_user") {
      throw new Error("unauthorized_action: Only Privileged Users and Administrators can approve margin overrides");
    }

    const record = inMemoryOverrides.get(params.overrideId);
    if (!record) throw new Error("override_request_not_found");

    const itin = inMemoryItineraries.get(record.itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    const nowIso = new Date().toISOString();
    record.status = params.action === "approve" ? "approved" : "rejected";
    record.reviewedBy = params.reviewerId;
    record.reviewedAt = nowIso;
    record.reviewNotes = params.reviewNotes ?? null;

    if (params.action === "approve") {
      itin.pricing.isExportLocked = false;
      itin.pricing.isOverrideRequired = false;
    } else {
      itin.pricing.isExportLocked = true;
      itin.pricing.isOverrideRequired = true;
    }

    itin.activeMarginOverride = record;
    itin.updatedAt = nowIso;

    await staffAuditLogger.logEvent({
      actorId: params.reviewerId,
      entityType: "margin_override",
      entityId: params.overrideId,
      eventType: params.action === "approve" ? "margin_override_approved" : "margin_override_rejected",
      eventData: {
        itineraryId: record.itineraryId,
        reviewerRole: params.reviewerRole,
        reviewNotes: params.reviewNotes,
      },
    });

    return record;
  }

  /**
   * US-010: White-Label Proposal Export & Version Snapshotting
   * STRICT GUARDRAIL: Strips internal net rates, supplier names, and margins. Hard-locked if margin is breached.
   */
  async exportClientProposal(params: {
    itineraryId: string;
    exportedBy: string;
    guestName: string;
    travelDates?: string;
    versionLabel?: string;
  }): Promise<ClientFacingProposal> {
    const itin = inMemoryItineraries.get(params.itineraryId);
    if (!itin) throw new Error("itinerary_not_found");

    this.refreshPricing(itin);

    // Hard Gate: Locked if margin is breached without approved override
    if (itin.pricing.isExportLocked) {
      throw new Error(
        `export_locked: Proposal export is locked because realized margin (${itin.pricing.realizedMarginPercent}%) is below the ${itin.pricing.floorMarginPercent}% floor. Approval from a Privileged User or Administrator is required.`,
      );
    }

    const version = params.versionLabel ?? itin.currentVersion;

    const curatedDays = itin.days.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      destination: day.destination,
      experiences: day.segments.map((seg) => ({
        dayNumber: day.dayNumber,
        segmentType: seg.segmentType,
        title: seg.title,
        description: seg.description,
        destination: day.destination,
      })),
    }));

    const clientProposal: ClientFacingProposal = {
      itineraryId: itin.id,
      version,
      title: itin.title,
      circuitSummary: itin.circuitSummary ?? "Bespoke India Circuit",
      guestName: params.guestName,
      travelDates: params.travelDates ?? "Custom Dates",
      duration: `${itin.durationDays} Days / ${itin.durationDays - 1} Nights`,
      currency: itin.currency,
      allInclusiveSellingPrice: itin.pricing.grossSellingPrice,
      curatedDays,
      inclusions: [
        "All palace, sanctuary, and heritage resort suite accommodations",
        "Dedicated private aviation or executive chauffeur vehicle throughout",
        "Private heritage walks and curated culinary experiences",
        "Expert local guides and 24/7 dedicated concierge ground dispatch",
      ],
      exclusions: [
        "International airfare",
        "Personal incidental expenses and discretionary gratuities",
      ],
      terms: [
        "Proposal is valid for 14 days from generation.",
        "Confirmation subject to palace suite availability at the time of deposit.",
      ],
      exportedAt: new Date().toISOString(),
    };

    // Store version snapshot
    const existingVersions = inMemoryProposalVersions.get(itin.id) ?? [];
    existingVersions.push(clientProposal);
    inMemoryProposalVersions.set(itin.id, existingVersions);

    // Increment current version for subsequent edits
    const versionNum = parseFloat(version.replace("v", "")) || 1.0;
    itin.currentVersion = `v${(versionNum + 0.1).toFixed(1)}`;
    itin.status = "proposal_sent";
    itin.updatedAt = new Date().toISOString();

    await staffAuditLogger.logEvent({
      actorId: params.exportedBy,
      entityType: "proposal",
      entityId: itin.id,
      eventType: "financial_export_generated",
      eventData: {
        version,
        grossSellingPrice: itin.pricing.grossSellingPrice,
      },
    });

    return clientProposal;
  }

  /**
   * Retrieve all exported proposal versions for an itinerary
   */
  async getProposalVersions(itineraryId: string): Promise<ClientFacingProposal[]> {
    return inMemoryProposalVersions.get(itineraryId) ?? [];
  }

  clearAllForTesting(): void {
    inMemoryItineraries.clear();
    inMemoryOverrides.clear();
    inMemoryProposalVersions.clear();
  }
}

export const itineraryPricingService = new ItineraryPricingService();
