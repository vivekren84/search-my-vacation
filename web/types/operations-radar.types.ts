/**
 * Search My Vacation — Operations Command Center & Concierge Radar Types (Release 1.5 — Milestone 4)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Governs Trip Pipeline Kanban (US-011), Voucher Vault (US-012), SLA Risk Alerts (US-013),
 * Concierge Intelligence Radar (US-018), Vetted Vendor Directory (US-014),
 * Executive Financial Summary (US-015), and Encrypted Document Masking (US-016).
 */

export type PipelineStage =
  | "inquiry"
  | "proposal_sent"
  | "deposit_paid"
  | "vendors_confirmed"
  | "in_transit"
  | "post_trip";

export type VoucherStatus = "pending" | "confirmed" | "issued" | "cancelled";

export type AlertType =
  | "unconfirmed_vendor_72h"
  | "overdue_deposit"
  | "missing_document_14d"
  | "ground_advisory"
  | "flight_delay";

export type AlertSeverity = "critical" | "warning" | "info";

export type VendorCategory =
  | "hospitality"
  | "aviation"
  | "yachts"
  | "guides"
  | "fleet"
  | "dining"
  | "experiences";

export type VendorTier =
  | "signature_palace"
  | "heritage_sanctuary"
  | "executive_charter"
  | "curated_artisan";

export type DocumentType = "passport" | "visa" | "id_card" | "insurance";

export interface TripPipelineRecord {
  id: string;
  itineraryId: string;
  clientId: string;
  clientName: string;
  assignedAdvisorId?: string | null;
  stage: PipelineStage;
  tripTitle: string;
  departureDate: string; // ISO date YYYY-MM-DD
  returnDate: string;
  totalValue: number;
  depositCollected: number;
  balanceDue: number;
  depositDueDate?: string | null;
  isVip: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentVoucherRecord {
  id: string;
  segmentId: string;
  itineraryId: string;
  bookingReference: string;
  vendorContactName: string;
  emergencyPhoneE164: string;
  voucherStatus: VoucherStatus;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileSizeBytes?: number;
  }>;
  notes?: string | null;
  confirmedAt?: string | null;
  createdAt: string;
}

export interface OperationalAlertRecord {
  id: string;
  tripId?: string | null;
  itineraryId?: string | null;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
}

export interface VendorRecord {
  id: string;
  vendorName: string;
  destination: string;
  category: VendorCategory;
  tier: VendorTier;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhoneE164?: string | null;
  contractedNetRateTerms: string;
  cancellationPolicy: string;
  paymentTerms: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDocumentRecord {
  id: string;
  clientId: string;
  documentType: DocumentType;
  fileName: string;
  storagePath: string;
  fileSizeBytes?: number;
  maskedIdentifier: string; // e.g. "XXXX-8421"
  rawDocumentNumber: string; // Encrypted in DB; step-up unmasked
  uploadedBy?: string | null;
  createdAt: string;
}

export interface ConciergeRadarFlightStatus {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: "on_time" | "delayed" | "landed" | "cancelled";
  gate?: string | null;
  terminal?: string | null;
  delayMinutes?: number;
}

export interface ConciergeRadarWeather {
  destination: string;
  currentTempC: number;
  condition: string;
  precipitationProbPercent: number;
  windKmh: number;
  humidityPercent: number;
  outlook7Day: Array<{
    day: string;
    highC: number;
    lowC: number;
    condition: string;
  }>;
}

export interface ConciergeRadarGroundAdvisory {
  id: string;
  destination: string;
  advisoryType: "monument_closure" | "traffic_diversion" | "weather_hazard" | "special_event";
  title: string;
  description: string;
  effectiveDates: string;
  isUrgent: boolean;
}

export interface ConciergeRadarState {
  isPersistent: true; // Hard invariant: cannot be disabled
  position: { x: number; y: number } | "bottom_right_default";
  isExpanded: boolean;
  activeTripsCount: number;
  weatherMonitored: ConciergeRadarWeather[];
  flightsMonitored: ConciergeRadarFlightStatus[];
  groundAdvisories: ConciergeRadarGroundAdvisory[];
  lastRefreshedAt: string;
}

export interface ExecutiveFinancialSummary {
  totalGrossBookings: number;
  totalVendorPayables: number;
  totalRealizedMargin: number;
  averageMarginPercent: number;
  depositsCollected: number;
  pendingClientBalances: number;
  upcomingVendorPayouts: number;
  tripsCount: number;
  csvExportData: string;
}
