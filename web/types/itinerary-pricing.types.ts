/**
 * Search My Vacation — Itinerary Builder & Commercial Pricing Types (Release 1.5 — Milestone 3)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Governs Modular Day-by-Day Itinerary Builder (US-007),
 * Automated Net Cost & Margin Engine (US-008),
 * Margin Override Workflow (US-009), and White-Label Proposal Export (US-010).
 */

export type SegmentType = "hotel" | "transfer" | "activity" | "guide" | "dining" | "aviation";

export type MarginStatus = "healthy" | "moderate" | "breached";

export type MarginOverrideStatus = "pending" | "approved" | "rejected";

export type ItineraryStatus = "draft" | "proposal_sent" | "confirmed" | "archived";

export interface ItinerarySegmentRecord {
  id: string;
  dayId: string;
  itineraryId: string;
  orderIndex: number;
  segmentType: SegmentType;
  title: string;
  description?: string | null;
  vendorName?: string | null; // Internal only
  vendorContact?: string | null; // Internal only
  netCost: number;
  markupPercent: number;
  markupAmount: number;
  taxPercent: number;
  taxAmount: number;
  sellingPrice: number;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface ItineraryDayRecord {
  id: string;
  itineraryId: string;
  dayNumber: number;
  title: string;
  destination: string;
  notes?: string | null;
  segments: ItinerarySegmentRecord[];
  createdAt?: string;
}

export interface CommercialPricingSummary {
  totalNetCost: number;
  totalMarkupAmount: number;
  totalTaxAmount: number;
  grossSellingPrice: number;
  grossProfit: number;
  realizedMarginPercent: number;
  marginStatus: MarginStatus;
  floorMarginPercent: number; // Defaults to 12.00%
  isBreached: boolean;
  isOverrideRequired: boolean;
  isExportLocked: boolean;
}

export interface MarginOverrideRecord {
  id: string;
  itineraryId: string;
  requestedBy: string;
  targetSellingPrice: number;
  netCost: number;
  proposedMarginPercent: number;
  floorMarginPercent: number;
  justification: string;
  status: MarginOverrideStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
}

export interface MasterItineraryRecord {
  id: string;
  clientId: string;
  journeyId?: string | null;
  createdBy?: string | null;
  title: string;
  circuitSummary?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  durationDays: number;
  currency: string;
  status: ItineraryStatus;
  currentVersion: string;
  customSellingPrice?: number | null;
  days: ItineraryDayRecord[];
  pricing: CommercialPricingSummary;
  activeMarginOverride?: MarginOverrideRecord | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sanitized client-facing presentation DTO (US-010)
 * GUARANTEE: Zero internal net rates, supplier names, or margin percentages leak here.
 */
export interface ClientFacingSegment {
  dayNumber: number;
  segmentType: SegmentType;
  title: string;
  description?: string | null;
  destination: string;
}

export interface ClientFacingProposal {
  itineraryId: string;
  version: string;
  title: string;
  circuitSummary: string;
  guestName: string;
  travelDates: string;
  duration: string;
  currency: string;
  allInclusiveSellingPrice: number;
  curatedDays: Array<{
    dayNumber: number;
    title: string;
    destination: string;
    experiences: ClientFacingSegment[];
  }>;
  inclusions: string[];
  exclusions: string[];
  terms: string[];
  exportedAt: string;
}
