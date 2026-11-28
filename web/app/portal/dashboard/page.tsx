"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import SiteBrand from "@/components/brand/SiteBrand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { StaffAvatar } from "@/components/portal/StaffAvatar";
import { SessionIdleGuard } from "@/components/portal/SessionIdleGuard";
import { EditTripModal, EditableTrip, StaffOption } from "@/components/portal/EditTripModal";
import { EditCustomerModal, EditableCustomer } from "@/components/portal/EditCustomerModal";
import { EditStaffModal, EditableStaffMember } from "@/components/portal/EditStaffModal";
import { ItineraryBuilderPanel } from "@/components/portal/ItineraryBuilderPanel";
import { NewJourneyModal, CustomerLookupOption } from "@/components/portal/NewJourneyModal";
import { JourneyDetailDrawer } from "@/components/portal/JourneyDetailDrawer";
import { StageGateModal } from "@/components/portal/StageGateModal";

interface StaffSession {
  fullName: string;
  email: string;
  role: string;
  loggedInAt: string;
}

interface TeamMember {
  fullName: string;
  email: string;
  phoneE164: string;
  role: "super_admin" | "administrator" | "privilege_user" | "desk_user";
  status: "Active" | "Pending First Login" | "Inactive";
  invitedAt: string;
  deactivatedAt?: string | null;
}

interface ClientCompanion {
  id?: string;
  fullName: string;
  relationship: string;
  notes?: string | null;
}

interface ClientTag {
  category: "dietary" | "pace" | "accommodation" | "comfort" | "general";
  tagValue: string;
}

interface ClientProfileItem {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  phoneE164: string | null;
  nationality: string | null;
  dob?: string | null;
  leadSource: string;
  isVip: boolean;
  companions: ClientCompanion[];
  tags: ClientTag[];
  initialActivityNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmTripItem {
  id: string;
  dealReferenceId: string;
  dealChannel: "DIRECT" | "VENDOR";
  customerId: string;
  customerCode: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  leadOwnerId?: string | null;
  leadOwnerName: string;
  destination: string;
  travelYear: number;
  travelMonth: string;
  startDate?: string | null;
  endDate?: string | null;
  durationLabel: string;
  nights: number;
  travelPartyType: string;
  paxAdults: number;
  paxChildren: number;
  dealStage: string;
  paymentStatus: string;
  tripStatus: string;
  bookedProperties: string;
  bookedTransport: string;
  notes: string;
  quotePrice: number;
  actualCost: number | null;
  preTaxAmount: number | null;
  gstAmount: number | null;
  profit: number | null;
  isFinancialRestricted: boolean;
  tripScope?: "Domestic" | "International";
  leadSource?: string | null;
  followUpDate?: string | null;
  verifiedPaidAmount?: number;
  pendingPaidAmount?: number;
  balanceDue?: number;
  readinessCount?: number;
  createdAt: string;
}

export interface CrmCustomerItem {
  id: string;
  customerCode: string;
  primaryName: string;
  primaryMobile: string | null;
  secondaryMobile: string | null;
  primaryEmail: string | null;
  zohoSynced: boolean;
  needsContactEnrichment: boolean;
  tripsCount: number;
  recentTrips: Array<{
    dealReferenceId: string;
    destination: string;
    travelYear: number;
    dealStage: string;
    paymentStatus: string;
    tripStatus: string;
  }>;
  createdAt: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    fullName: "Vivek Renganathan",
    email: "vivek@searchmyvacation.com",
    phoneE164: "+91 89258 38541",
    role: "super_admin",
    status: "Active",
    invitedAt: "2026-11-01",
  },
  {
    fullName: "Tiger CTO",
    email: "tiger@searchmyvacation.com",
    phoneE164: "+91 98840 12345",
    role: "administrator",
    status: "Active",
    invitedAt: "2026-11-05",
  },
];

const SAMPLE_CLAUDE_ITINERARY = `### 8-Day Kashmir Autumn Serenity Circuit (Client: Ananya Sharma)

Day 1: Arrival in Srinagar & Traditional Shikara Circuit on Nigeen Lake
- Private chauffeured transfer from Sheikh ul-Alam Airport to Nigeen Lake.
- Check-in to interconnecting suites at Nigeen Heritage Floats.
- Sunset Shikara ride with authentic Kashmiri Kahwa and pure vegetarian appetizers.

Day 2: Historic Srinagar Mughal Heritage & Old Town Walk
- Morning private tour of Nishat Bagh & Shalimar Bagh chinar groves.
- Afternoon slow-paced walk through Jamia Masjid and artisan copper bazaars.
- Evening traditional Kashmiri vegetarian wazwan-style family dinner.

Day 3: Scenic Ascent to Gulmarg & Affarwat Meadow
- Private transfer via Tangmarg pine forests (2 hrs).
- Check-in to premier mountain resort with heated suites.
- Phase 1 Gondola ride to Kongdoori meadow, gentle pace for child.

Day 4: Gulmarg Alpine Leisure & Pine Trail Walk
- Relaxed morning pony trail through Strawberry Valley.
- Afternoon fireside high tea and indoor heated pool leisure.

Day 5: Drive to Pahalgam (Valley of Shepherds)
- Journey through Pampore saffron fields and Awantipora ruins.
- Check-in to Pahalgam Pine Palace interconnecting cottages.
- Evening riverside stroll along the Lidder River.

Day 6: Aru Valley & Betaab Valley Leisure Circuit
- Excursion to picturesque Aru Valley with dedicated child-safe walking trail.
- Gourmet vegetarian picnic in Betaab Valley cedar glades.

Day 7: Return to Srinagar & Floating Artisan Bazaars
- Morning return transfer to Srinagar.
- Afternoon visit to Pashmina weaving studio & walnut woodcarvers.
- Farewell private dinner on the houseboat deck.

Day 8: Departure from Srinagar
- Morning breakfast on the veranda overlooking the Himalayas.
- Private airport escort to Srinagar Sheikh ul-Alam Airport for return flight.`;

export default function PortalDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [activeTab, setActiveTab] = useState<"operations" | "crm" | "itinerary" | "governance" | "vendors">("operations");

  // Release 1.5.2 Client CRM Active Filter
  const [crmFilterMode, setCrmFilterMode] = useState<"active" | "all" | "booked" | "lost">("active");

  // Release 1.5.2 Vendors Directory State
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState("all");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any | null>(null);

  // Add Vendor Form State
  const [vendorFormName, setVendorFormName] = useState("");
  const [vendorFormCategory, setVendorFormCategory] = useState<"property" | "cab" | "dmc" | "agency" | "activity" | "other">("property");
  const [vendorFormDestination, setVendorFormDestination] = useState("");
  const [vendorFormRegion, setVendorFormRegion] = useState("");
  const [vendorFormStarRating, setVendorFormStarRating] = useState("4-Star Boutique");
  const [vendorFormPocName, setVendorFormPocName] = useState("");
  const [vendorFormPocMobile, setVendorFormPocMobile] = useState("");
  const [vendorFormOfficePhone, setVendorFormOfficePhone] = useState("");
  const [vendorFormEmail, setVendorFormEmail] = useState("");
  const [vendorFormWebsite, setVendorFormWebsite] = useState("");
  const [vendorFormAddress, setVendorFormAddress] = useState("");
  const [vendorFormRateCardLink, setVendorFormRateCardLink] = useState("");
  const [vendorFormB2bRates, setVendorFormB2bRates] = useState("");
  const [vendorFormComments, setVendorFormComments] = useState("");
  const [vendorSubmitLoading, setVendorSubmitLoading] = useState(false);
  const [vendorSubmitError, setVendorSubmitError] = useState<string | null>(null);
  const [vendorSubmitSuccess, setVendorSubmitSuccess] = useState<string | null>(null);

  // Team Provisioning State (US-001)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("+91 ");
  const [inviteRole, setInviteRole] = useState<"super_admin" | "administrator" | "privilege_user" | "desk_user">("desk_user");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [directoryNotice, setDirectoryNotice] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Master Client CRM State (US-004, US-005, US-006)
  const [clients, setClients] = useState<ClientProfileItem[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const [crmTagFilter, setCrmTagFilter] = useState("all");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientFormName, setClientFormName] = useState("");
  const [clientFormEmail, setClientFormEmail] = useState("");
  const [clientFormPhone, setClientFormPhone] = useState("+91 ");
  const [clientFormCity, setClientFormCity] = useState("");
  const [clientFormLeadSource, setClientFormLeadSource] = useState("instagram");
  const [clientFormIsVip, setClientFormIsVip] = useState(false);
  const [clientFormSelectedTags, setClientFormSelectedTags] = useState<string[]>([
    "Family Comfort",
    "Slow Travel",
    "Pure Vegetarian",
  ]);
  const [clientFormCustomTag, setClientFormCustomTag] = useState("");
  const [clientFormCompanions, setClientFormCompanions] = useState<
    Array<{ fullName: string; relationship: string; notes: string }>
  >([
    { fullName: "", relationship: "spouse", notes: "" }
  ]);
  const [clientFormInitialNote, setClientFormInitialNote] = useState("");
  const [clientSubmitLoading, setClientSubmitLoading] = useState(false);
  const [clientSubmitError, setClientSubmitError] = useState<string | null>(null);
  const [clientSubmitSuccess, setClientSubmitSuccess] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Release 1.5.1 Relational CRM State (Pillar A)
  const [crmTrips, setCrmTrips] = useState<CrmTripItem[]>([]);
  const [crmCustomers, setCrmCustomers] = useState<CrmCustomerItem[]>([]);
  const [crmViewMode, setCrmViewMode] = useState<"trips" | "customers">("trips");

  // Smart Lookup in Add Client modal
  const [matchedCustomer, setMatchedCustomer] = useState<{
    id: string;
    customerCode: string;
    primaryName: string;
    primaryMobile: string;
    secondaryMobile?: string;
    pastTripsCount: number;
    pastTrips?: any[];
  } | null>(null);
  const [isLinkedToExisting, setIsLinkedToExisting] = useState(false);

  // New Trip fields for Add Client modal
  const [tripFormDestination, setTripFormDestination] = useState("");
  const [tripFormChannel, setTripFormChannel] = useState<"DIRECT" | "VENDOR">("DIRECT");
  const [tripFormYear, setTripFormYear] = useState(new Date().getFullYear());
  const [tripFormMonth, setTripFormMonth] = useState("April");
  const [tripFormDuration, setTripFormDuration] = useState("6N/7D");
  const [tripFormAdults, setTripFormAdults] = useState(2);
  const [tripFormChildren, setTripFormChildren] = useState(0);
  const [tripFormStage, setTripFormStage] = useState("Enquiry");
  const [tripFormQuotePrice, setTripFormQuotePrice] = useState("");
  const [tripFormNotes, setTripFormNotes] = useState("");

  // Claude Itinerary & PDF Generator Studio State
  const [showClaudeModal, setShowClaudeModal] = useState(false);
  const [claudeProjectUrl, setClaudeProjectUrl] = useState("https://claude.ai");
  const [claudeInputText, setClaudeInputText] = useState("");
  const [claudeImportSuccess, setClaudeImportSuccess] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [itineraryUpdatedFromClaude, setItineraryUpdatedFromClaude] = useState(false);
  const [claudeBriefLocation, setClaudeBriefLocation] = useState("Kashmir Autumn Circuit (Srinagar, Gulmarg, Pahalgam)");
  const [claudeBriefDuration, setClaudeBriefDuration] = useState("8 Days / 7 Nights (Oct 10 - Oct 17, 2026)");
  const [claudeBriefAsks, setClaudeBriefAsks] = useState(
    "Pure vegetarian dining, family comfort pace for 7yo child, interconnecting boutique suites, scenic private mountain transfers, budget target: ₹3.8L - ₹4.0L"
  );
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([
    { name: "Client_Discovery_Notes_Ananya.pdf", size: "240 KB" },
    { name: "Flight_Schedule_DEL_SXR.pdf", size: "115 KB" },
  ]);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfReadyUrl, setPdfReadyUrl] = useState<string | null>(null);

  // Concierge Intelligence Radar state (US-018) — starts minimized as compact circle to avoid overlapping cards
  const [radarMinimized, setRadarMinimized] = useState(true);
  const [radarPos, setRadarPos] = useState({ x: 0, y: 0, isCustom: false });
  const [activeDestination, setActiveDestination] = useState("Kashmir");
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });

  // Milestone 1 Edit Modals & Financial Approval Queue
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [editingTrip, setEditingTrip] = useState<EditableTrip | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<EditableCustomer | null>(null);
  const [editingStaff, setEditingStaff] = useState<EditableStaffMember | null>(null);
  const [importedClaudeForBuilder, setImportedClaudeForBuilder] = useState<string | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [approvalActionId, setApprovalActionId] = useState<string | null>(null);
  const [crmNotice, setCrmNotice] = useState<string | null>(null);
  const didHydrationSyncRef = useRef(false);

  // Release 1.5.4: + New Journey, Unified Drawer, Stage Gates & Operational Quick-Filters
  const [showNewJourneyModal, setShowNewJourneyModal] = useState(false);
  const [newJourneyCustomer, setNewJourneyCustomer] = useState<CustomerLookupOption | null>(null);
  const [drawerTripId, setDrawerTripId] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<
    "all" | "mine" | "departing14" | "payment_due" | "on_hold" | "domestic" | "international" | "cancelled"
  >("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [kanbanDragTrip, setKanbanDragTrip] = useState<CrmTripItem | null>(null);
  const [kanbanStageGate, setKanbanStageGate] = useState<{
    trip: CrmTripItem;
    targetStage: "Booked/Won" | "On Hold" | "Lost" | "Cancelled" | "In Progress" | "Complete";
  } | null>(null);

  function refreshApprovalsData() {
    fetch("/api/portal/crm/trips/approvals?status=pending")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.approvals)) {
          setPendingApprovals(data.approvals);
        }
      })
      .catch(() => {});
  }

  async function handleApprovalDecision(approvalId: string, decision: "approved" | "rejected") {
    setApprovalActionId(approvalId);
    try {
      const res = await fetch("/api/portal/crm/trips/approvals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": session?.email || "",
          "x-staff-role": session?.role || "",
        },
        body: JSON.stringify({
          id: approvalId,
          decision,
          callerEmail: session?.email || "",
          callerRole: session?.role || "",
        }),
      });
      const data = await res.json();
      if (data?.message) {
        setCrmNotice(data.message);
        setTimeout(() => setCrmNotice(null), 5000);
      }
      refreshApprovalsData();
      refreshCrmData();
    } catch {
      setCrmNotice("Network error while processing approval.");
    } finally {
      setApprovalActionId(null);
    }
  }

  function refreshCrmData(role?: string) {
    setCrmLoading(true);
    const activeRole = role || session?.role || "desk_user";

    // 1. Fetch Relational Trips (Pillar A)
    fetch(`/api/portal/crm/trips?role=${encodeURIComponent(activeRole)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.trips)) {
          setCrmTrips(data.trips);
          if (!didHydrationSyncRef.current) {
            const todayIst = new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Kolkata",
            }).format(new Date());
            const hasDueBookedTrip = data.trips.some(
              (t: CrmTripItem) =>
                t.dealStage === "Booked/Won" &&
                t.tripStatus !== "Complete" &&
                Boolean(t.startDate) &&
                (t.startDate || "") <= todayIst
            );
            if (hasDueBookedTrip) {
              didHydrationSyncRef.current = true;
              fetch("/api/portal/crm/trips/sync-in-travel", { method: "POST" })
                .then((r) => r.json())
                .then((syncData) => {
                  if (syncData?.ok && syncData.promotedCount > 0) {
                    fetch(`/api/portal/crm/trips?role=${encodeURIComponent(activeRole)}`)
                      .then((r2) => r2.json())
                      .then((d2) => {
                        if (d2?.ok && Array.isArray(d2.trips)) setCrmTrips(d2.trips);
                      })
                      .catch(() => {});
                  }
                })
                .catch(() => {});
            }
          }
        }
        if (data && data.ok && Array.isArray(data.staffOptions)) {
          setStaffOptions(data.staffOptions);
        }
      })
      .catch(() => {});

    if (
      activeRole === "super_admin" ||
      activeRole === "administrator" ||
      activeRole === "privilege_user"
    ) {
      refreshApprovalsData();
    }

    // 2. Fetch Customer Master (Pillar A)
    fetch("/api/portal/crm/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.customers)) {
          setCrmCustomers(data.customers);
        }
      })
      .catch(() => {});

    // 3. Backward-compatible clients view
    fetch("/api/portal/crm/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.clients)) {
          setClients(data.clients);
        }
      })
      .catch(() => {})
      .finally(() => setCrmLoading(false));
  }

  function refreshVendorsData() {
    setVendorsLoading(true);
    fetch("/api/portal/crm/vendors")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.vendors)) {
          setVendors(data.vendors);
        }
      })
      .catch(() => {})
      .finally(() => setVendorsLoading(false));
  }

  function openAddVendorModal() {
    setEditingVendor(null);
    setVendorFormName("");
    setVendorFormCategory("property");
    setVendorFormDestination("");
    setVendorFormRegion("");
    setVendorFormStarRating("4-Star Boutique");
    setVendorFormPocName("");
    setVendorFormPocMobile("");
    setVendorFormOfficePhone("");
    setVendorFormEmail("");
    setVendorFormWebsite("");
    setVendorFormAddress("");
    setVendorFormRateCardLink("");
    setVendorFormB2bRates("");
    setVendorFormComments("");
    setVendorSubmitError(null);
    setVendorSubmitSuccess(null);
    setShowAddVendorModal(true);
  }

  function openEditVendorModal(v: any) {
    setEditingVendor(v);
    setVendorFormName(v.name || "");
    setVendorFormCategory(v.category || "property");
    setVendorFormDestination(v.destination || "");
    setVendorFormRegion(v.region || "");
    setVendorFormStarRating(v.star_rating || "4-Star Boutique");
    setVendorFormPocName(v.poc_name || "");
    setVendorFormPocMobile(v.poc_mobile || "");
    setVendorFormOfficePhone(v.office_phone || "");
    setVendorFormEmail(v.email || "");
    setVendorFormWebsite(v.website || "");
    setVendorFormAddress(v.address || "");
    setVendorFormRateCardLink(v.rate_card_link || "");
    setVendorFormB2bRates(v.b2b_rates || "");
    setVendorFormComments(v.comments || "");
    setVendorSubmitError(null);
    setVendorSubmitSuccess(null);
    setShowAddVendorModal(true);
  }

  async function handleDeleteVendor(id: string, name: string) {
    if (!isSuperAdmin) {
      alert("Permission Denied: Permanent deletion of vendor records is strictly restricted to Super Admin (Vivek Renganathan).");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete vendor partner "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portal/crm/vendors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-staff-role": session?.role || "super_admin",
          "x-staff-email": session?.email || "",
        },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || "Failed to delete vendor partner.");
        return;
      }
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err?.message || "An unexpected error occurred while deleting the vendor.");
    }
  }

  async function handleAddVendorSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVendorSubmitError(null);
    setVendorSubmitSuccess(null);

    if (!vendorFormName.trim()) {
      setVendorSubmitError("Vendor name is required.");
      return;
    }

    setVendorSubmitLoading(true);
    try {
      const isEdit = !!editingVendor;
      const url = "/api/portal/crm/vendors";
      const method = isEdit ? "PATCH" : "POST";
      const payload: any = {
        name: vendorFormName.trim(),
        category: vendorFormCategory,
        destination: vendorFormDestination.trim() || null,
        region: vendorFormRegion.trim() || null,
        star_rating: vendorFormStarRating.trim() || null,
        poc_name: vendorFormPocName.trim() || null,
        poc_mobile: vendorFormPocMobile.trim() || null,
        office_phone: vendorFormOfficePhone.trim() || null,
        email: vendorFormEmail.trim() || null,
        website: vendorFormWebsite.trim() || null,
        address: vendorFormAddress.trim() || null,
        rate_card_link: vendorFormRateCardLink.trim() || null,
        b2b_rates: vendorFormB2bRates.trim() || null,
        comments: vendorFormComments.trim() || null,
        callerRole: session?.role || "desk_user",
        callerEmail: session?.email || "",
      };
      if (isEdit) {
        payload.id = editingVendor.id;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-staff-role": session?.role || "desk_user",
          "x-staff-email": session?.email || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setVendorSubmitError(data.message || "Failed to process vendor partner.");
        return;
      }

      setVendorSubmitSuccess(
        isEdit
          ? `Vendor ${data.vendor?.name || vendorFormName} successfully updated.`
          : `Vendor ${data.vendor?.name} (${data.vendor?.vendor_code}) successfully registered.`
      );
      refreshVendorsData();

      // Reset form
      setEditingVendor(null);
      setVendorFormName("");
      setVendorFormDestination("");
      setVendorFormRegion("");
      setVendorFormPocName("");
      setVendorFormPocMobile("");
      setVendorFormOfficePhone("");
      setVendorFormEmail("");
      setVendorFormWebsite("");
      setVendorFormAddress("");
      setVendorFormRateCardLink("");
      setVendorFormB2bRates("");
      setVendorFormComments("");

      setTimeout(() => {
        setShowAddVendorModal(false);
        setVendorSubmitSuccess(null);
      }, 1800);
    } catch (err: any) {
      setVendorSubmitError(err?.message || "An unexpected error occurred.");
    } finally {
      setVendorSubmitLoading(false);
    }
  }

  useEffect(() => {
    // Check staff session
    const raw = typeof window !== "undefined" ? localStorage.getItem("smv_staff_session") : null;
    if (!raw) {
      router.replace("/portal/login");
      return;
    }
    let parsedRole = "desk_user";
    try {
      const parsed = JSON.parse(raw);
      setSession(parsed);
      parsedRole = parsed.role || "desk_user";
    } catch {
      router.replace("/portal/login");
    }

    // Load persisted Claude Project URL if set
    try {
      const savedClaudeUrl = localStorage.getItem("smv_claude_project_url");
      if (savedClaudeUrl) setClaudeProjectUrl(savedClaudeUrl);
    } catch {}

    // 1. Fetch live synchronized staff members from backend API & Supabase
    fetch("/api/portal/auth/users")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.users)) {
          let deletedStaff: string[] = [];
          try {
            deletedStaff = JSON.parse(localStorage.getItem("smv_deleted_staff") || "[]");
          } catch {}
          const filtered = data.users
            .filter(
              (u: any) =>
                u &&
                u.email &&
                !deletedStaff.includes(u.email.toLowerCase().trim()) &&
                u.email.toLowerCase().trim() !== "sri@searchmyvacation.com" &&
                u.email.toLowerCase().trim() !== "keerthi@searchmyvacation.com" &&
                u.email.toLowerCase().trim() !== "renganathanthyagarajan@gmail.com" &&
                u.email.toLowerCase().trim() !== "speeddevil.vicky@gmail.com"
            )
            .map((u: any) => {
              if (u.email?.toLowerCase().trim() === "vivek@searchmyvacation.com") {
                return { ...u, role: "super_admin" as const };
              }
              return u;
            });
          if (filtered.length > 0) {
            setTeamMembers(filtered);
          }
        }
      })
      .catch(() => {
        // Fallback to local storage if API is offline
        try {
          const stored = localStorage.getItem("smv_invited_staff");
          if (stored) {
            let customInvites = JSON.parse(stored);
            if (Array.isArray(customInvites) && customInvites.length > 0) {
              const purgedEmails = [
                "sri@searchmyvacation.com",
                "keerthi@searchmyvacation.com",
                "renganathanthyagarajan@gmail.com",
                "speeddevil.vicky@gmail.com",
              ];
              const activeCustomInvites = customInvites.filter(
                (c: any) => c && c.email && !purgedEmails.includes(c.email.toLowerCase().trim())
              );
              setTeamMembers((prev) => {
                const combined = [...prev];
                for (const c of activeCustomInvites) {
                  if (!combined.some((m) => m.email.toLowerCase() === c.email.toLowerCase())) {
                    combined.push({
                      fullName: c.fullName,
                      email: c.email,
                      phoneE164: c.phoneE164,
                      role: c.role,
                      status: c.status || "Pending First Login",
                      deactivatedAt: c.deactivatedAt || null,
                      invitedAt: c.invitedAt || new Date().toISOString().split("T")[0],
                    });
                  }
                }
                return combined;
              });
            }
          }
        } catch {}
      });

    // 2. Fetch live CRM trips, customers, and client profiles (Pillar A)
    refreshCrmData(parsedRole);

    // 3. Fetch live Vetted Vendors directory (Release 1.5.2)
    refreshVendorsData();
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem("smv_staff_session");
    // Reset radar position to default bottom-right
    setRadarPos({ x: 0, y: 0, isCustom: false });
    router.replace("/portal/login");
  }

  // Radar drag handler with 16px screen clamping
  function startDragging(e: React.MouseEvent) {
    if (!radarMinimized) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: radarPos.isCustom ? radarPos.x : window.innerWidth - 180,
      elemY: radarPos.isCustom ? radarPos.y : window.innerHeight - 80,
    };

    function onMouseMove(moveEvent: MouseEvent) {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;

      // 16px screen boundary clamp
      const rawX = dragStartRef.current.elemX + deltaX;
      const rawY = dragStartRef.current.elemY + deltaY;
      const clampedX = Math.max(16, Math.min(window.innerWidth - 160, rawX));
      const clampedY = Math.max(16, Math.min(window.innerHeight - 60, rawY));

      setRadarPos({ x: clampedX, y: clampedY, isCustom: true });
    }

    function onMouseUp() {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Team Invite Submit Handler (US-001)
  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);

    const emailTrimmed = inviteEmail.trim().toLowerCase();
    const phoneTrimmed = invitePhone.trim();

    if (!inviteName.trim()) {
      setInviteError("Please enter the full name.");
      return;
    }
    if (!emailTrimmed || !emailTrimmed.includes("@")) {
      setInviteError("Please enter a valid company email address.");
      return;
    }
    if (!phoneTrimmed || phoneTrimmed.length < 10) {
      setInviteError("Please enter a valid registered mobile number (E.164 format with country code).");
      return;
    }

    if (teamMembers.some((m) => m.email.toLowerCase() === emailTrimmed)) {
      setInviteError("A staff member with this email address already exists.");
      return;
    }

    const newMember: TeamMember = {
      fullName: inviteName.trim(),
      email: emailTrimmed,
      phoneE164: phoneTrimmed,
      role: inviteRole,
      status: "Pending First Login",
      invitedAt: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/portal/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newMember.fullName,
          email: newMember.email,
          phoneE164: newMember.phoneE164,
          role: newMember.role,
          temporaryPassword: "TemporaryDefaultPass#2026",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setInviteError(data.message || "Failed to dispatch invitation.");
        return;
      }
    } catch {
      // Offline fallback
    }

    // Save to local storage for portal login recognition & un-blacklist if previously deleted
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      const currentList = stored ? JSON.parse(stored) : [];
      currentList.push({
        fullName: newMember.fullName,
        email: newMember.email,
        phoneE164: newMember.phoneE164,
        role: newMember.role,
        requiresPasswordChange: true,
        invitedAt: newMember.invitedAt,
      });
      localStorage.setItem("smv_invited_staff", JSON.stringify(currentList));

      const deletedStored = localStorage.getItem("smv_deleted_staff");
      if (deletedStored) {
        const deletedList: string[] = JSON.parse(deletedStored);
        const filtered = deletedList.filter((e) => e !== emailTrimmed);
        localStorage.setItem("smv_deleted_staff", JSON.stringify(filtered));
      }
    } catch {}

    setTeamMembers((prev) => [...prev, newMember]);
    setInviteSuccess("Invitation dispatched via email. Temporary password provided. No mobile OTP required.");
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("+91 ");
  }

  // Toggle Staff User Active / Inactive Status (US-001)
  async function handleToggleActiveStatus(member: TeamMember) {
    const emailCleaned = member.email.trim().toLowerCase();

    // Self-Protection Guardrail: Super Admin cannot be deactivated
    if (emailCleaned === "vivek@searchmyvacation.com" || member.role === "super_admin") {
      alert("Self-Protection Guardrail: Super Admin account cannot be deactivated.");
      return;
    }

    const isCurrentlyInactive = member.status === "Inactive";
    const newStatus: "Active" | "Inactive" = isCurrentlyInactive ? "Active" : "Inactive";

    const promptMessage = isCurrentlyInactive
      ? `Are you sure you want to reactivate ${member.fullName} (${member.email})?`
      : `Are you sure you want to mark ${member.fullName} (${member.email}) as Inactive? They will be immediately blocked from signing in or maintaining an active session.`;

    if (!confirm(promptMessage)) {
      return;
    }

    const nowIso = new Date().toISOString();

    // 1. Update UI state
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.email.toLowerCase() === emailCleaned
          ? {
              ...m,
              status: newStatus,
              deactivatedAt: isCurrentlyInactive ? null : nowIso,
            }
          : m
      )
    );

    // 2. Update localStorage
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map((item: any) =>
          item.email?.toLowerCase() === emailCleaned
            ? {
                ...item,
                status: newStatus,
                deactivatedAt: isCurrentlyInactive ? null : nowIso,
              }
            : item
        );
        localStorage.setItem("smv_invited_staff", JSON.stringify(updated));
      }
    } catch {}

    // 3. Call backend PATCH endpoint (updates server registry & Supabase public.workspace_users)
    try {
      const res = await fetch("/api/portal/auth/invite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCleaned, status: newStatus }),
      });
      const data = await res.json();
      setDirectoryNotice(data.message || `Staff account status updated to ${newStatus}.`);
    } catch {
      setDirectoryNotice(`Staff account status updated to ${newStatus}.`);
    }
    setTimeout(() => setDirectoryNotice(null), 4000);
  }

  // Delete Staff User Permanently (US-001 with DB Sync)
  async function handleDeleteMember(member: TeamMember) {
    const emailCleaned = member.email.trim().toLowerCase();

    // Self-Protection Guardrail: Super Admin cannot be deleted
    if (emailCleaned === "vivek@searchmyvacation.com" || member.role === "super_admin") {
      alert("Self-Protection Guardrail: Super Admin account cannot be deleted.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to permanently delete ${member.fullName} (${member.email})? This action will remove the account from the directory and delete all records from the database.`
      )
    ) {
      return;
    }

    // 1. Remove from UI state
    setTeamMembers((prev) => prev.filter((m) => m.email.toLowerCase() !== emailCleaned));

    // 2. Remove from localStorage & add to permanent deletion blacklist
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.filter((item: any) => item.email?.toLowerCase() !== emailCleaned);
        localStorage.setItem("smv_invited_staff", JSON.stringify(updated));
      }
      const deletedStored = localStorage.getItem("smv_deleted_staff");
      const deletedList: string[] = deletedStored ? JSON.parse(deletedStored) : [];
      if (!deletedList.includes(emailCleaned)) {
        deletedList.push(emailCleaned);
        localStorage.setItem("smv_deleted_staff", JSON.stringify(deletedList));
      }
    } catch {}

    // 3. Call backend DELETE endpoint (removes from in-memory registry & deletes from Supabase auth.users & workspace_users)
    try {
      const res = await fetch("/api/portal/auth/invite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCleaned }),
      });
      const data = await res.json();
      setDirectoryNotice(data.message || `Staff account for ${emailCleaned} permanently deleted.`);
    } catch {
      setDirectoryNotice(`Staff account for ${emailCleaned} permanently deleted.`);
    }
    setTimeout(() => setDirectoryNotice(null), 4000);
  }

  // Update Staff User Role (Super Admin Delegation & Role Governance)
  async function handleRoleChange(member: TeamMember, newRole: TeamMember["role"]) {
    if (member.role === newRole) return;
    const emailCleaned = member.email.trim().toLowerCase();

    // Self-Protection Guardrail: Owner / Super Admin Vivek cannot be demoted
    if (emailCleaned === "vivek@searchmyvacation.com" && newRole !== "super_admin") {
      alert("Self-Protection Guardrail: Vivek Renganathan is the Search My Vacation Owner & Super Admin and cannot be demoted.");
      return;
    }

    const roleLabels: Record<string, string> = {
      super_admin: "Super Admin",
      administrator: "Administrator",
      privilege_user: "Privilege User",
      desk_user: "Desk User",
    };

    const confirmMessage =
      newRole === "super_admin"
        ? `Are you sure you want to promote ${member.fullName} (${member.email}) to Super Admin? They will have full administrative authority across Search My Vacation.`
        : `Are you sure you want to change ${member.fullName}'s role from ${roleLabels[member.role] || member.role} to ${roleLabels[newRole] || newRole}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // 1. Update UI state immediately
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.email.toLowerCase() === emailCleaned
          ? { ...m, role: newRole }
          : m
      )
    );

    // 2. Update localStorage if present
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map((item: any) =>
          item.email?.toLowerCase() === emailCleaned
            ? { ...item, role: newRole }
            : item
        );
        localStorage.setItem("smv_invited_staff", JSON.stringify(updated));
      }
    } catch {}

    // 3. Call backend PATCH endpoint to sync in-memory registry & Supabase auth.users metadata and public.workspace_users
    try {
      const res = await fetch("/api/portal/auth/invite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCleaned, role: newRole }),
      });
      const data = await res.json();
      setDirectoryNotice(data.message || `Role for ${member.fullName} updated to ${roleLabels[newRole] || newRole}.`);
    } catch {
      setDirectoryNotice(`Role for ${member.fullName} updated to ${roleLabels[newRole] || newRole}.`);
    }
    setTimeout(() => setDirectoryNotice(null), 4000);
  }

  // =========================================================================
  // MASTER CLIENT CRM HANDLERS (US-004, US-005, US-006)
  // =========================================================================

  function handleAddCompanionRow() {
    setClientFormCompanions((prev) => [
      ...prev,
      { fullName: "", relationship: "child", notes: "" },
    ]);
  }

  function handleUpdateCompanion(
    index: number,
    field: "fullName" | "relationship" | "notes",
    val: string
  ) {
    setClientFormCompanions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  }

  function handleRemoveCompanionRow(index: number) {
    setClientFormCompanions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleToggleTag(tagVal: string) {
    setClientFormSelectedTags((prev) =>
      prev.includes(tagVal) ? prev.filter((t) => t !== tagVal) : [...prev, tagVal]
    );
  }

  function handleAddCustomTag() {
    const trimmed = clientFormCustomTag.trim();
    if (trimmed && !clientFormSelectedTags.includes(trimmed)) {
      setClientFormSelectedTags((prev) => [...prev, trimmed]);
      setClientFormCustomTag("");
    }
  }

  async function handleBlurDuplicateCheck() {
    if (!clientFormEmail.trim() && (!clientFormPhone.trim() || clientFormPhone.trim() === "+91")) {
      return;
    }
    try {
      const res = await fetch(
        `/api/portal/crm/clients/duplicate-check?email=${encodeURIComponent(
          clientFormEmail.trim()
        )}&phone=${encodeURIComponent(clientFormPhone.trim())}`
      );
      const data = await res.json();
      if (data && data.ok && data.duplicate?.hasDuplicate) {
        setDuplicateWarning(data.duplicate.warningMessage || "Existing client record found.");
        if (data.duplicate.isDatabaseCustomer) {
          setMatchedCustomer({
            id: data.duplicate.matchedCustomerId,
            customerCode: data.duplicate.matchedCustomerCode,
            primaryName: data.duplicate.matchedCustomerName,
            primaryMobile: data.duplicate.matchedMobile,
            secondaryMobile: data.duplicate.secondaryMobile,
            pastTripsCount: data.duplicate.pastTripsCount || 0,
            pastTrips: data.duplicate.pastTrips || [],
          });
        }
      } else {
        setDuplicateWarning(null);
        setMatchedCustomer(null);
        setIsLinkedToExisting(false);
      }
    } catch {}
  }

  async function handleCreateClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientSubmitError(null);
    setClientSubmitSuccess(null);

    if (!clientFormName.trim()) {
      setClientSubmitError("Please enter the client's full name.");
      return;
    }
    if (!clientFormLeadSource) {
      setClientSubmitError("Lead Source attribution is mandatory.");
      return;
    }

    setClientSubmitLoading(true);

    const companionsToSubmit = clientFormCompanions
      .filter((c) => c.fullName.trim().length > 0)
      .map((c) => ({
        fullName: c.fullName.trim(),
        relationship: c.relationship,
        notes: c.notes?.trim() || null,
      }));

    const tagsToSubmit = clientFormSelectedTags.map((t) => {
      let category: "dietary" | "pace" | "accommodation" | "comfort" | "general" = "pace";
      const lower = t.toLowerCase();
      if (lower.includes("veg") || lower.includes("jain") || lower.includes("dining")) {
        category = "dietary";
      } else if (lower.includes("heritage") || lower.includes("hotel") || lower.includes("suite")) {
        category = "accommodation";
      } else if (lower.includes("transfer") || lower.includes("comfort") || lower.includes("private")) {
        category = "comfort";
      }
      return { category, tagValue: t };
    });

    try {
      // 1. Submit trip deal to relational CRM (Pillar A)
      const tripPayload = {
        customerId: isLinkedToExisting && matchedCustomer ? matchedCustomer.id : undefined,
        primaryName: clientFormName.trim(),
        primaryMobile: clientFormPhone.trim() || undefined,
        primaryEmail: clientFormEmail.trim() || undefined,
        dealChannel: tripFormChannel,
        destination: tripFormDestination.trim() || "Bespoke Slow-Travel Journey",
        travelYear: tripFormYear,
        travelMonth: tripFormMonth,
        durationLabel: tripFormDuration,
        paxAdults: tripFormAdults,
        paxChildren: tripFormChildren,
        dealStage: tripFormStage,
        quotePrice: Number(tripFormQuotePrice) || 0,
        notes: tripFormNotes.trim() || clientFormInitialNote.trim() || undefined,
      };

      const tripRes = await fetch("/api/portal/crm/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripPayload),
      });
      const tripData = await tripRes.json();

      // 2. Also register in client CRM for backward compatibility
      const res = await fetch("/api/portal/crm/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: clientFormName.trim(),
          email: clientFormEmail.trim() || null,
          phone: clientFormPhone.trim() || null,
          nationality: clientFormCity.trim() || null,
          leadSource: clientFormLeadSource,
          isVip: clientFormIsVip,
          companions: companionsToSubmit,
          tags: tagsToSubmit,
          initialActivityNote: clientFormInitialNote.trim() || undefined,
          authorId: session?.email,
        }),
      });

      const data = await res.json();

      const createdRef = tripData.dealReferenceId || "Deal";
      setClientSubmitSuccess(
        `Client and journey deal (${createdRef}) successfully cataloged and linked.`
      );

      // Refresh relational CRM lists
      refreshCrmData();

      // Reset form
      setClientFormName("");
      setClientFormEmail("");
      setClientFormPhone("+91 ");
      setClientFormCity("");
      setTripFormDestination("");
      setTripFormQuotePrice("");
      setTripFormNotes("");
      setMatchedCustomer(null);
      setIsLinkedToExisting(false);
      setClientFormLeadSource("instagram");
      setClientFormIsVip(false);
      setClientFormSelectedTags(["Family Comfort", "Slow Travel", "Pure Vegetarian"]);
      setClientFormCompanions([{ fullName: "", relationship: "spouse", notes: "" }]);
      setClientFormInitialNote("");
      setDuplicateWarning(null);

      setTimeout(() => {
        setShowAddClientModal(false);
        setClientSubmitSuccess(null);
      }, 1500);
    } catch (err: any) {
      setClientSubmitError(err.message || "Network error. Please try again.");
    } finally {
      setClientSubmitLoading(false);
    }
  }

  function handleLinkToItineraryStudio(client: ClientProfileItem) {
    setActiveTab("itinerary");
    setClaudeBriefLocation(`${client.fullName} Circuit (${client.nationality || "Bespoke Journey"})`);
    const tagSummary = client.tags.map((t) => t.tagValue).join(", ");
    const companionsSummary = client.companions.map((c) => `${c.fullName} (${c.relationship})`).join(", ");
    setClaudeBriefAsks(
      `Preferences: ${tagSummary || "Family comfort"}. Companions: ${companionsSummary || "None specified"}. ${client.initialActivityNote || "Bespoke pacing required."}`
    );
    setDirectoryNotice(`Loaded ${client.fullName}'s preferences into Itinerary Studio.`);
    setTimeout(() => setDirectoryNotice(null), 4000);
  }

  // Launch Claude Project Pop-Up & Copy Brief
  function handleLaunchClaudePopup() {
    const prompt = `SEARCH MY VACATION — BESPOKE ITINERARY CLIENT BRIEF

1. DESTINATION & REGION:
${claudeBriefLocation || "Kashmir Autumn Circuit (Srinagar, Gulmarg, Pahalgam)"}

2. TRIP DURATION & DATES:
${claudeBriefDuration || "8 Days / 7 Nights (Oct 10 - Oct 17, 2026)"}

3. TRAVEL PACING & STYLE:
- Pacing: Slow-Travel Pacing, unhurried mornings, buffer time between scenic mountain transfers
- Party Composition: Couple traveling with 7-year-old child (family comfort focus)
- Travel Style: Mindfully paced, culturally immersive, authentic bespoke journey

4. SPECIAL ASKS & CONSTRAINTS:
${claudeBriefAsks || "- Pure Vegetarian Dining Focus\n- Family Comfort & Slow-Travel Pacing (Child age 7)\n- Interconnecting boutique heritage suites\n- Scenic chauffeured transfers with buffer times\n- Budget target: ₹3,80,000 - ₹4,00,000 INR"}

5. CLIENT DOSSIER & ATTACHMENTS:
${attachedFiles.length > 0 ? attachedFiles.map((f) => `- ${f.name} (${f.size})`).join("\n") : "- Flight confirmation: AI-825 (DEL to SXR)\n- Client preference dossier: Ananya Sharma Family"}

6. UNSPLASH VISUAL SPECIFICATIONS:
- High-resolution authentic landscape and property imagery
- Aspect ratio: 16:9 for header heroes, 4:3 for property highlights
- Use integrated Unsplash API key to curate verified location photos for each day
- Zero generic stock photography

7. COMMERCIAL & PRICING GOVERNANCE:
- Transparent line-item pricing (Net DMC supplier liabilities, 18% SMV agency margin, 5% estimated GST)
- Zero hyperbolic cliches
- Output full 18-20 page proposal structure ready for PDF compilation.`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
    }
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);

    const targetUrl = claudeProjectUrl.trim() || "https://claude.ai";
    window.open(
      targetUrl,
      "ClaudeProject",
      "width=1200,height=850,top=60,left=100,resizable=yes,scrollbars=yes"
    );
  }

  // Copy Claude Prompt Handler
  function handleCopyClaudePrompt() {
    const prompt = `Search My Vacation — Bespoke Itinerary & Proposal Request

1. LOCATION / DESTINATION:
${claudeBriefLocation || "Kashmir Autumn Circuit (Srinagar, Gulmarg, Pahalgam)"}

2. TRIP DURATION:
${claudeBriefDuration || "8 Days / 7 Nights (Oct 10 - Oct 17, 2026)"}

3. SPECIAL ASKS & TRAVEL CONSTRAINTS:
${claudeBriefAsks || "- Pure Vegetarian Dining Focus\n- Family Comfort & Slow-Travel Pacing (Child age 7)\n- Interconnecting boutique heritage suites\n- Scenic chauffeured transfers with buffer times\n- Budget target: ₹3,80,000 - ₹4,00,000 INR"}

4. ATTACHMENTS & ASSETS:
${attachedFiles.length > 0 ? attachedFiles.map((f) => `- ${f.name} (${f.size})`).join("\n") : "- Flight confirmation: AI-825 (DEL to SXR)\n- Client preference dossier: Ananya Sharma Family"}

OUTPUT FORMAT:
Please produce the day-by-day travel itinerary and formatted proposal PDF structure according to Search My Vacation guidelines:
- Elegant day titles with morning, afternoon, and evening pacing
- Selected boutique and heritage accommodations
- Line-item commercial pricing (Net cost, 18% agency margin, estimated GST)
- Zero hyperbolic marketing cliches.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  }

  // Parse Claude Output Handler
  function handleParseClaudeInput() {
    if (!claudeInputText.trim()) return;
    const matches = claudeInputText.match(/Day \d+:[^\n]+/g) || [];
    const count = matches.length || 8;
    setImportedClaudeForBuilder(claudeInputText);
    setItineraryUpdatedFromClaude(true);
    setClaudeImportSuccess(
      `Successfully parsed ${count} days from your Claude Project. Day schedule, boutique properties, and slow-travel timings have been loaded into the SMV Itinerary Builder!`
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] flex items-center justify-center text-[#0F172A] dark:text-[#F5F2EB] text-sm">
        Authenticating session...
      </div>
    );
  }

  const canManageTeam =
    session.role === "super_admin" ||
    session.role === "administrator" ||
    session.email?.toLowerCase() === "vivek@searchmyvacation.com";
  const isSuperAdmin =
    session.role === "super_admin" ||
    session.email?.toLowerCase() === "vivek@searchmyvacation.com";
  const canManageVendors =
    isSuperAdmin ||
    session.role === "administrator" ||
    session.role === "privilege_user";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-[#0F172A] dark:text-white flex flex-col font-sans transition-colors duration-200 pb-24">
      {/* Top Staff Navbar — Fully Unified with Search My Vacation */}
      <header className="border-b border-[#E2E8F0] dark:border-white/10 bg-[#0F172A] dark:bg-[#09090B] px-3 sm:px-8 py-3 flex items-center justify-between gap-2 sticky top-0 z-40 shadow-md transition-colors">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link href="/" title="Go to Search My Vacation Home (Session Persists)" className="shrink-0">
            <SiteBrand variant="header" surface="dark" linked={false} className="w-24 sm:w-36 text-white" />
          </Link>

          {/* Integrated Main Site Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/destinations" className="hover:text-white transition">
              Destinations
            </Link>
            <Link href="/experiences" className="hover:text-white transition">
              Experiences
            </Link>
            <Link href="/travel-inspiration" className="hover:text-white transition">
              Inspiration
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
          {/* Invite Team Members Button (Super Admin & Admin Only) */}
          {canManageTeam && (
            <button
              onClick={() => {
                setShowInviteModal(true);
                setInviteSuccess(null);
                setInviteError(null);
              }}
              className="flex items-center gap-1 rounded-full bg-[#F5951C] px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition shadow-md whitespace-nowrap"
            >
              <span>➕</span>
              <span className="hidden sm:inline">Invite Team</span>
              <span className="sm:hidden">Invite</span>
            </button>
          )}

          <ThemeToggle variant="compact" />

          {/* Prominent Profile Access (Punch-List Item 2) */}
          <Link
            href="/portal/profile"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-white transition hover:border-[#F5951C] shadow-sm shrink-0"
            title="View / Edit Advisor Workspace Profile"
          >
            <StaffAvatar name={session.fullName} size="xs" />
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold leading-tight text-white flex items-center gap-1">
                <span>{session.fullName.split(" ")[0]}</span>
                <span className="text-[10px] text-white/50">⚙️</span>
              </p>
              <p className="text-[9px] uppercase tracking-wider text-[#F5951C] font-semibold leading-tight">
                {isSuperAdmin ? "Super Admin" : session.role.replace("_", " ")}
              </p>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="whitespace-nowrap rounded-full border border-white/20 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/80 hover:border-[#F5951C] hover:text-[#F5951C] transition shrink-0"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Navigation */}
      <div className="border-b border-[#E2E8F0] dark:border-white/10 bg-[#0F172A] px-4 sm:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 items-center">
          {[
            { id: "operations", label: "Operations & Kanban", icon: "📋" },
            { id: "crm", label: "Master Client CRM", icon: "👥" },
            { id: "vendors", label: `Vetted Vendors (${vendors.length > 0 ? vendors.length : "430+"})`, icon: "🏢" },
            { id: "itinerary", label: "Itinerary & Margin Engine", icon: "🗺️" },
            { id: "governance", label: "Team Governance", icon: "💼" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "bg-[#F5951C] text-[#0F172A] shadow"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          <Link
            href="/portal/profile"
            className="flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition ml-auto"
            title="Manage your advisor workspace profile & security settings"
          >
            <span>👤</span>
            <span>My Profile</span>
          </Link>
        </nav>
      </div>

      {/* Workspace Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-28">
        {/* TAB 1: OPERATIONS & KANBAN (US-011, US-012, US-013) */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            {(() => {
              const todayIso = new Date().toISOString().slice(0, 10);

              // Helper to assign each journey to EXACTLY ONE mutually exclusive stage
              function getKanbanStage(trip: CrmTripItem): "enquiries" | "planning" | "confirmed" | "travel" | "completed" | "closed" {
                const ts = (trip.tripStatus || "").toLowerCase();
                const ds = (trip.dealStage || "").toLowerCase();
                const ps = (trip.paymentStatus || "").toLowerCase();
                const notes = (trip.notes || "").toLowerCase();

                // 0. Closed / Paused (Lost or On Hold — kept out of active Enquiry queue)
                if (ds === "lost" || ds === "on hold" || ts === "lost" || ts === "on hold") {
                  return "closed";
                }

                // 1. Completed Journeys (Final state — strictly exclusive, takes highest precedence)
                if (
                  ts.includes("complete") ||
                  ts.includes("returned") ||
                  notes.includes("trip complete") ||
                  ds === "completed"
                ) {
                  return "completed";
                }

                // 2. In Travel / Active (Manual In Progress / In Travel OR Booked/Won within startDate..endDate)
                const isDateInFlight =
                  ds.includes("book") &&
                  Boolean(trip.startDate) &&
                  Boolean(trip.endDate) &&
                  todayIso >= (trip.startDate || "") &&
                  todayIso <= (trip.endDate || "");

                if (
                  isDateInFlight ||
                  ts === "in progress" ||
                  ts.includes("in travel") ||
                  ts.includes("travel") ||
                  ts.includes("active") ||
                  ts.includes("on tour") ||
                  ds.includes("in travel")
                ) {
                  return "travel";
                }

                // 3. Confirmed & Booked (Booked upcoming journeys yet to travel)
                if (
                  ds.includes("book") ||
                  ds.includes("won") ||
                  ds.includes("deposit") ||
                  ps.includes("advance") ||
                  ps.includes("paid") ||
                  ps.includes("won") ||
                  ts.includes("confirmed") ||
                  ts.includes("booked")
                ) {
                  return "confirmed";
                }

                // 4. Curation & Quotes (Proposals and customized itineraries under discussion)
                if (
                  ds.includes("proposal") ||
                  ds.includes("quote") ||
                  ds.includes("plan") ||
                  ds.includes("discussion") ||
                  ts.includes("quote")
                ) {
                  return "planning";
                }

                // 5. Enquiries & Discovery (New leads / discovery stage)
                return "enquiries";
              }

              // Group crmTrips dynamically into 5 mutually exclusive operational pipeline stages
              const stages = [
                {
                  id: "enquiries",
                  title: "1. Enquiries & Discovery",
                  badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
                  trips: crmTrips.filter((t) => getKanbanStage(t) === "enquiries"),
                },
                {
                  id: "planning",
                  title: "2. Curation & Quotes",
                  badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
                  trips: crmTrips.filter((t) => getKanbanStage(t) === "planning"),
                },
                {
                  id: "confirmed",
                  title: "3. Confirmed & Booked",
                  badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                  trips: crmTrips.filter((t) => getKanbanStage(t) === "confirmed"),
                },
                {
                  id: "travel",
                  title: "4. In Travel / Active",
                  badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
                  trips: crmTrips.filter((t) => getKanbanStage(t) === "travel"),
                },
                {
                  id: "completed",
                  title: "5. Completed Journeys",
                  badgeColor: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
                  trips: crmTrips.filter((t) => getKanbanStage(t) === "completed"),
                },
              ];

              const totalValuation = crmTrips.reduce((acc, t) => acc + (Number(t.quotePrice) || 0), 0);
              const closedCount = crmTrips.filter((t) => getKanbanStage(t) === "closed").length;
              const activeTrips = crmTrips.filter((t) => {
                const st = getKanbanStage(t);
                return st !== "completed" && st !== "closed";
              });
              const activeCount = activeTrips.length;
              const activeValuation = activeTrips.reduce((acc, t) => acc + (Number(t.quotePrice) || 0), 0);

              // Operational Vouchers & Emergency Hub (US-012): strictly for upcoming booked or currently in-flight active journeys (never completed)
              const voucherTrips = crmTrips
                .filter((t) => {
                  const stage = getKanbanStage(t);
                  return stage === "confirmed" || stage === "travel";
                });

              return (
                <div className="space-y-6">
                  {/* Pipeline Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                        <span>📋</span> Trip Operations Pipeline
                      </h2>
                      <p className="text-xs text-[#475569] dark:text-zinc-400">
                        Live dynamic Kanban synchronized with customer master records ({crmTrips.length} Total Journeys) • Drag cards across columns to trigger stage gates
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setNewJourneyCustomer(null);
                          setShowNewJourneyModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition shadow-sm"
                      >
                        + New Journey
                      </button>
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
                        ● Active Pipeline: {activeCount} Journeys
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 border border-[#E2E8F0] dark:border-white/10 font-semibold">
                        Paused / Lost: {closedCount}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30 font-bold font-mono">
                        Active Value: ₹{(activeValuation / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                  </div>

                  {/* Operational Quick-Filters & Omni-Search (US-154-10) */}
                  <div className="p-3 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] flex flex-wrap items-center gap-2 text-[11px]">
                    {[
                      { id: "all", label: "All Active" },
                      { id: "mine", label: "My Journeys" },
                      { id: "departing14", label: "Departing Next 14d" },
                      { id: "payment_due", label: "Payment Due" },
                      { id: "on_hold", label: "On Hold (Follow-Up)" },
                      { id: "domestic", label: "Domestic" },
                      { id: "international", label: "International" },
                    ].map((qf) => (
                      <button
                        key={qf.id}
                        type="button"
                        onClick={() => setQuickFilter(qf.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          quickFilter === qf.id
                            ? "bg-[#F5951C] text-[#0F172A]"
                            : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                        }`}
                      >
                        {qf.label}
                      </button>
                    ))}
                    <select
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      className="ml-auto rounded-lg border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] dark:text-white"
                    >
                      <option value="all">All Years</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>

                  {/* 5-Column Live Kanban Board */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                    {stages.map((col) => {
                      const todayIso = new Date().toISOString().slice(0, 10);
                      const in14Iso = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
                      const filteredColTrips = col.trips.filter((t) => {
                        if (yearFilter !== "all" && String(t.travelYear) !== yearFilter) return false;
                        if (quickFilter === "mine" && session?.fullName && !t.leadOwnerName.toLowerCase().includes(session.fullName.split(" ")[0].toLowerCase())) return false;
                        if (quickFilter === "departing14" && (!t.startDate || t.startDate < todayIso || t.startDate > in14Iso)) return false;
                        if (quickFilter === "payment_due" && Number(t.balanceDue ?? 0) <= 0) return false;
                        if (quickFilter === "on_hold" && t.dealStage !== "On Hold") return false;
                        if (quickFilter === "domestic" && (t.tripScope || "Domestic") !== "Domestic") return false;
                        if (quickFilter === "international" && t.tripScope !== "International") return false;
                        return true;
                      });
                      const colValue = filteredColTrips.reduce((acc, t) => acc + (Number(t.quotePrice) || 0), 0);
                      return (
                        <div
                          key={col.id}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (!kanbanDragTrip) return;
                            const target =
                              col.id === "confirmed"
                                ? "Booked/Won"
                                : col.id === "completed"
                                ? "Complete"
                                : col.id === "planning"
                                ? "In Progress"
                                : null;
                            if (target && session) {
                              if (kanbanDragTrip.dealStage === "In Travel" && target === "Booked/Won") {
                                const matchingStaff = staffOptions.find(
                                  (s) => s.displayName?.toLowerCase() === session.fullName?.toLowerCase()
                                );
                                const callerUid = matchingStaff?.userId || null;
                                const isOwnerOrSuperAdmin =
                                  session.role === "super_admin" ||
                                  session.email?.toLowerCase() === "vivek@searchmyvacation.com" ||
                                  (Boolean(callerUid) && kanbanDragTrip.leadOwnerId === callerUid);
                                if (!isOwnerOrSuperAdmin) {
                                  setCrmNotice("Only the assigned Travel Advisor or Super Admin can revert an Active journey.");
                                  setKanbanDragTrip(null);
                                  return;
                                }
                              }
                              setKanbanStageGate({ trip: kanbanDragTrip, targetStage: target });
                            }
                            setKanbanDragTrip(null);
                          }}
                          className={`rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-3 flex flex-col justify-between shadow-sm ${
                            filteredColTrips.length === 0
                              ? "min-h-0 xl:min-h-[380px]"
                              : "min-h-0 md:min-h-[260px] xl:min-h-[380px]"
                          }`}
                        >
                          <div>
                            {/* Column Header */}
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5">
                              <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                                  {col.title}
                                </h3>
                                <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                                  ₹{(colValue / 100000).toFixed(1)}L
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                              >
                                {filteredColTrips.length}
                              </span>
                            </div>

                            {/* Cards in Column */}
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                              {filteredColTrips.length === 0 ? (
                                <div className="py-2.5 px-3 text-center border border-dashed border-[#E2E8F0] dark:border-white/10 rounded-xl text-[11px] text-[#94A3B8] dark:text-zinc-500">
                                  No journeys in this stage
                                </div>
                              ) : (
                                filteredColTrips.slice(0, 10).map((trip) => (
                                  <div
                                    key={trip.id}
                                    draggable
                                    onDragStart={() => setKanbanDragTrip(trip)}
                                    onClick={() => setDrawerTripId(trip.id)}
                                    className="rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] p-2.5 border border-[#E2E8F0] dark:border-white/5 space-y-1 hover:border-[#F5951C]/50 cursor-pointer transition"
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-mono text-[9px] font-bold text-[#F5951C]">
                                        {trip.dealReferenceId}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[9px] font-semibold text-[#475569] dark:text-zinc-400 truncate max-w-[70px]">
                                          {trip.leadOwnerName || "Vivek"}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingTrip(trip);
                                          }}
                                          title={`Edit ${trip.dealReferenceId}`}
                                          className="text-[10px] px-1 rounded hover:bg-[#F5951C]/20 text-[#475569] dark:text-zinc-400 hover:text-[#F5951C] transition"
                                        >
                                          ✏️
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                                      {trip.customerName}
                                    </p>
                                    <p className="text-[11px] text-[#475569] dark:text-zinc-400 truncate">
                                      📍 {trip.destination || "Bespoke Circuit"}
                                    </p>
                                    {(Number(trip.balanceDue || 0) > 0 || trip.dealStage === "Booked/Won") && (
                                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                        {Number(trip.balanceDue || 0) > 0 && (
                                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                            ₹{Number(trip.balanceDue).toLocaleString("en-IN")} Due
                                          </span>
                                        )}
                                        {trip.dealStage === "Booked/Won" && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                            {trip.readinessCount ?? 0}/6 Ready
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-[#E2E8F0] dark:border-white/5">
                                      <span className="text-[#64748B] dark:text-zinc-500">
                                        {trip.paxAdults}A{trip.paxChildren > 0 ? `+${trip.paxChildren}C` : ""} • {trip.durationLabel || "6N/7D"}
                                      </span>
                                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        ₹{Number(trip.quotePrice || 0).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                              {filteredColTrips.length > 10 && (
                                <button
                                  onClick={() => {
                                    setActiveTab("crm");
                                    setCrmSearchQuery(col.title.split(".")[1]?.trim() || "");
                                  }}
                                  className="w-full py-1 text-[10px] text-[#F5951C] hover:underline font-semibold text-center"
                                >
                                  + View {filteredColTrips.length - 10} more in CRM →
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/5 text-[10px] text-[#94A3B8] dark:text-zinc-500 text-center">
                            Synchronized with Supabase
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Operational Vouchers & Emergency Hub (Upcoming & In-Flight Journeys ONLY — US-012) */}
                  <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
                        <span>🎫</span> Confirmed Booking Logistics & Vouchers (US-012)
                      </h3>
                      <span className="text-xs text-[#F5951C] font-semibold">
                        {voucherTrips.length} Upcoming & In-Flight Bookings
                      </span>
                    </div>

                    {voucherTrips.length === 0 ? (
                      <div className="p-4 sm:p-5 text-center border border-dashed border-[#E2E8F0] dark:border-white/10 rounded-xl text-xs text-[#475569] dark:text-zinc-400">
                        No upcoming or in-flight bookings currently active in pipeline. Completed journeys are safely archived in stage 5.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        {voucherTrips.map((trip) => (
                          <div
                            key={trip.id}
                            className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 space-y-1.5"
                          >
                            <div className="flex justify-between items-center font-bold text-[#0F172A] dark:text-white">
                              <button
                                type="button"
                                onClick={() => setDrawerTripId(trip.id)}
                                className="font-mono text-[11px] text-[#F5951C] hover:underline"
                              >
                                {trip.dealReferenceId} ↗
                              </button>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                  {trip.readinessCount ?? 0}/6 Ready
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">● {trip.paymentStatus}</span>
                                <button
                                  type="button"
                                  onClick={() => setEditingTrip(trip)}
                                  title={`Edit ${trip.dealReferenceId}`}
                                  className="text-[10px] px-1.5 py-0.5 rounded border border-[#CBD5E1] dark:border-white/10 hover:border-[#F5951C] text-[#475569] dark:text-zinc-300 hover:text-[#F5951C] transition"
                                >
                                  ✏️ Edit
                                </button>
                              </div>
                            </div>
                            <p className="font-bold text-xs text-[#0F172A] dark:text-white">{trip.customerName}</p>
                            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                              📍 {trip.destination} • {trip.travelMonth} {trip.travelYear} ({trip.durationLabel})
                            </p>
                            {(trip.bookedProperties || trip.bookedTransport) && (
                              <p className="text-[10px] text-[#64748B] dark:text-zinc-400 italic pt-1 border-t border-[#E2E8F0] dark:border-white/5 line-clamp-1">
                                {trip.bookedProperties || trip.bookedTransport}
                              </p>
                            )}
                            <div className="flex justify-between items-center text-[10px] text-[#475569] dark:text-zinc-500 pt-1">
                              <span>Advisor: {trip.leadOwnerName || "Vivek"}</span>
                              <span className="font-mono font-semibold text-[#0F172A] dark:text-white">
                                {trip.customerMobile || "—"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: RELATIONAL CLIENT & TRIP CRM (Pillar A & Release 1.5.2 Item 4) */}
        {activeTab === "crm" && (
          <div className="space-y-6">
            {/* Header & Primary Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>🗺️</span> Master Client Atelier CRM
                </h2>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  1 Customer Master (CUST-XXXXX) → Many Trips (DDSMV/VDSMV) architecture with lead attribution
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewJourneyCustomer(null);
                    setShowNewJourneyModal(true);
                  }}
                  className="rounded-xl bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition flex items-center gap-2 shadow-md"
                >
                  <span>🧭</span>
                  <span>+ New Journey</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddClientModal(true);
                    setClientSubmitError(null);
                    setClientSubmitSuccess(null);
                    setDuplicateWarning(null);
                  }}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white hover:border-[#F5951C] transition flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Add Client</span>
                </button>
              </div>
            </div>

            {/* View Mode Switcher & Item 4 Filter Mode Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCrmViewMode("trips")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    crmViewMode === "trips"
                      ? "bg-[#F5951C] text-[#0F172A] shadow-md"
                      : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <span>✈️</span>
                  <span>Trips & Deals ({crmTrips.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCrmViewMode("customers")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    crmViewMode === "customers"
                      ? "bg-[#F5951C] text-[#0F172A] shadow-md"
                      : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <span>👥</span>
                  <span>Customer Master ({crmCustomers.length})</span>
                </button>
              </div>

              {/* Release 1.5.2 Punch-List Item 4: Curated View Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mr-1">Filter:</span>
                {[
                  { id: "active", label: "⚡ Active & Enquiry (Top 10)" },
                  { id: "all", label: `View All (${crmViewMode === "trips" ? crmTrips.length : crmCustomers.length})` },
                  { id: "booked", label: "Booked Only" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCrmFilterMode(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                      crmFilterMode === f.id
                        ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                        : "bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CRM Update Notice & Pending Financial Approval Queue (R1.5.3 M1) */}
            {crmNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex justify-between items-center">
                <span>✓ {crmNotice}</span>
                <button onClick={() => setCrmNotice(null)} className="hover:opacity-75">✕</button>
              </div>
            )}

            {canManageVendors && pendingApprovals.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <span>⏳</span> Pending Financial Approval Queue ({pendingApprovals.length})
                    </h3>
                    <p className="text-[11px] text-[#475569] dark:text-zinc-300">
                      Single-concurrence review: approval by any one Privilege User, Administrator, or Super Admin applies the update and clears the queue.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {pendingApprovals.map((pa) => (
                    <div
                      key={pa.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[#F5951C]">{pa.deal_reference_id}</span>
                          <span className="font-bold text-[#0F172A] dark:text-white">{pa.customerName}</span>
                          <span className="text-[#475569] dark:text-zinc-400">• {pa.destination}</span>
                        </div>
                        <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                          Proposed by <strong>{pa.requested_by_name || pa.requested_by_email}</strong>: Quote ₹{Number(pa.proposed_quote_price || 0).toLocaleString("en-IN")} • Cost ₹{Number(pa.proposed_actual_cost || 0).toLocaleString("en-IN")} • GST ₹{Number(pa.proposed_gst_amount || 0).toLocaleString("en-IN")} • Net Profit ₹{Number(pa.proposed_profit || 0).toLocaleString("en-IN")}
                        </p>
                        {pa.justification && (
                          <p className="text-[10px] italic text-[#64748B] dark:text-zinc-500">
                            &quot;{pa.justification}&quot;
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={approvalActionId === pa.id}
                          onClick={() => handleApprovalDecision(pa.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px] font-semibold hover:bg-rose-500/20 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={approvalActionId === pa.id}
                          onClick={() => handleApprovalDecision(pa.id, "approved")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                          ✓ Approve &amp; Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter & Global Search Bar */}
            <div className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={crmSearchQuery}
                  onChange={(e) => setCrmSearchQuery(e.target.value)}
                  placeholder="Global search by client name, mobile, reference (DDSMV/CUST), destination, city..."
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                />
                {crmSearchQuery && (
                  <button
                    onClick={() => setCrmSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: "all", label: `All Tags` },
                  { id: "vip", label: "⭐ VIP Only" },
                  { id: "family", label: "Family Comfort" },
                  { id: "slow", label: "Slow Travel" },
                  { id: "veg", label: "Pure Vegetarian" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setCrmTagFilter(filter.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      crmTagFilter === filter.id
                        ? "bg-[#F5951C] text-[#0F172A]"
                        : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Quick-Filters (US-154-10) */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {[
                { id: "all", label: "All Operational" },
                { id: "mine", label: "My Journeys" },
                { id: "departing14", label: "Departing 14d" },
                { id: "payment_due", label: "Payment Due" },
                { id: "on_hold", label: "On Hold" },
                { id: "domestic", label: "Domestic" },
                { id: "international", label: "International" },
                { id: "cancelled", label: "Cancelled" },
              ].map((qf) => (
                <button
                  key={qf.id}
                  type="button"
                  onClick={() => setQuickFilter(qf.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    quickFilter === qf.id
                      ? "bg-[#F5951C] text-[#0F172A]"
                      : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                  }`}
                >
                  {qf.label}
                </button>
              ))}
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="ml-auto rounded-lg border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] dark:text-white"
              >
                <option value="all">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            {/* Client Cards List & Relational Lists (Pillar A) */}
            {crmLoading ? (
              <div className="p-6 sm:p-10 text-center text-[#475569] dark:text-zinc-400 text-xs">
                Loading client profiles and trip deals...
              </div>
            ) : crmViewMode === "trips" ? (
              crmTrips.length === 0 ? (
                <div className="p-6 sm:p-10 text-center rounded-2xl border border-dashed border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] space-y-3">
                  <div className="text-3xl">✈️</div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">No Trip Deals Found</h3>
                  <p className="text-xs text-[#475569] dark:text-zinc-400 max-w-md mx-auto">
                    Create your first trip deal linked to a customer profile. Deal references (DDSMV/VDSMV) are auto-generated.
                  </p>
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="rounded-xl bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition"
                  >
                    ➕ Add First Trip Deal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Punch-List Item 4 Focused View Notification Banner */}
                  {crmFilterMode === "active" && !crmSearchQuery && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>
                          <strong>Focused View (Item 4):</strong> Showing top 10 active & enquiry journeys to maintain lightweight performance. ({crmTrips.length} total historical trips in database).
                        </span>
                      </div>
                      <button
                        onClick={() => setCrmFilterMode("all")}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-blue-700 transition w-fit"
                      >
                        View All {crmTrips.length} Journeys →
                      </button>
                    </div>
                  )}

                  {(() => {
                    const q = crmSearchQuery.toLowerCase().trim();
                    const todayIso = new Date().toISOString().slice(0, 10);
                    const in14Iso = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
                    let list = crmTrips.filter((t) => {
                      if (yearFilter !== "all" && String(t.travelYear) !== yearFilter) return false;
                      if (quickFilter === "mine" && session?.fullName && !t.leadOwnerName.toLowerCase().includes(session.fullName.split(" ")[0].toLowerCase())) return false;
                      if (quickFilter === "departing14" && (!t.startDate || t.startDate < todayIso || t.startDate > in14Iso)) return false;
                      if (quickFilter === "payment_due" && Number(t.balanceDue ?? 0) <= 0) return false;
                      if (quickFilter === "on_hold" && t.dealStage !== "On Hold") return false;
                      if (quickFilter === "domestic" && (t.tripScope || "Domestic") !== "Domestic") return false;
                      if (quickFilter === "international" && t.tripScope !== "International") return false;
                      if (quickFilter === "cancelled" && t.dealStage !== "Cancelled") return false;
                      if (!q) return true;
                      return (
                        t.dealReferenceId.toLowerCase().includes(q) ||
                        t.destination.toLowerCase().includes(q) ||
                        t.customerName.toLowerCase().includes(q) ||
                        t.customerCode.toLowerCase().includes(q) ||
                        t.customerMobile.includes(q)
                      );
                    });

                    if (!q && quickFilter === "all" && crmFilterMode === "active") {
                      list = list
                        .filter((t) => {
                          const s = (t.dealStage || "").toLowerCase();
                          const ts = (t.tripStatus || "").toLowerCase();
                          return (
                            !["completed", "complete", "closed won", "lost", "on hold", "cancelled", "archived"].includes(s) &&
                            !["completed", "complete", "returned", "lost", "on hold", "cancelled"].includes(ts)
                          );
                        })
                        .slice(0, 10);
                    } else if (!q && quickFilter === "all" && crmFilterMode === "booked") {
                      list = list.filter((t) => {
                        const s = (t.dealStage || "").toLowerCase();
                        const p = (t.paymentStatus || "").toLowerCase();
                        return (
                          s.includes("book") ||
                          s.includes("deposit") ||
                          p.includes("paid") ||
                          p.includes("advance")
                        );
                      });
                    }

                    if (list.length === 0) {
                      return (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-[#E2E8F0] dark:border-white/10 text-xs text-[#475569] dark:text-zinc-400">
                          No trip deals matched the selected filter or search term.
                        </div>
                      );
                    }

                    return list.map((trip) => (
                      <div
                        key={trip.id}
                        className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm space-y-4 hover:border-[#F5951C]/40 transition"
                      >
                        {/* Top Bar: Deal Ref, Channel, Customer */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E2E8F0] dark:border-white/10 pb-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setDrawerTripId(trip.id)}
                              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30 hover:bg-[#F5951C] hover:text-[#0F172A] transition"
                              title="Open Unified Journey Workspace Drawer"
                            >
                              {trip.dealReferenceId} ↗
                            </button>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                trip.dealChannel === "VENDOR"
                                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                                  : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                              }`}
                            >
                              {trip.dealChannel} DEAL
                            </span>
                            {Number(trip.balanceDue || 0) > 0 && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                ₹{Number(trip.balanceDue).toLocaleString("en-IN")} Due
                              </span>
                            )}
                            {trip.dealStage === "Booked/Won" && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                {trip.readinessCount ?? 0}/6 Ready
                              </span>
                            )}
                            <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                              {trip.customerName}
                            </span>
                            <span className="text-[11px] font-mono text-[#475569] dark:text-zinc-400">
                              ({trip.customerCode})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-[#475569] dark:text-zinc-400">
                              Lead:{" "}
                              <strong className="text-[#0F172A] dark:text-white">
                                {trip.leadOwnerName || "Vivek"}
                              </strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingTrip(trip)}
                              className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[11px] font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C] hover:text-[#F5951C] transition flex items-center gap-1"
                              title={`Edit ${trip.dealReferenceId} financials, status, or logistics`}
                            >
                              <span>✏️</span> Edit Trip
                            </button>
                          </div>
                        </div>

                        {/* Middle Grid: Destination, Dates, Pax, Statuses */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-zinc-400 block font-semibold">
                              Destination & Period
                            </span>
                            <p className="font-bold text-[#0F172A] dark:text-white mt-0.5">
                              {trip.destination}
                            </p>
                            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                              {trip.travelMonth} {trip.travelYear} • {trip.durationLabel}
                            </p>
                            {(trip.startDate || trip.endDate) && (
                              <p className="text-[10px] font-mono text-[#F5951C] mt-0.5">
                                {trip.startDate || "?"} → {trip.endDate || "?"}
                              </p>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-zinc-400 block font-semibold">
                              Travel Party & Pax
                            </span>
                            <p className="font-bold text-[#0F172A] dark:text-white mt-0.5">
                              {trip.travelPartyType}
                            </p>
                            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                              {trip.paxAdults} Adults
                              {trip.paxChildren > 0 ? `, ${trip.paxChildren} Children` : ""}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-zinc-400 block font-semibold">
                              Status Pipeline
                            </span>
                            <p className="font-bold text-[#0F172A] dark:text-white mt-0.5">
                              {trip.dealStage}
                            </p>
                            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                              Pay: {trip.paymentStatus} • Trip: {trip.tripStatus}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-zinc-400 block font-semibold">
                              Financials
                            </span>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              ₹{Number(trip.quotePrice || 0).toLocaleString("en-IN")}
                            </p>
                            {!trip.isFinancialRestricted ? (
                              <p className="text-[10px] text-[#475569] dark:text-zinc-400">
                                Cost: ₹{Number(trip.actualCost || 0).toLocaleString("en-IN")} •
                                Profit: ₹{Number(trip.profit || 0).toLocaleString("en-IN")}
                              </p>
                            ) : (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                🔒 Margin Restricted
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Logistics & Notes */}
                        {(trip.bookedProperties || trip.bookedTransport || trip.notes) && (
                          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 text-xs text-[#475569] dark:text-zinc-400 space-y-1">
                            {trip.bookedProperties && (
                              <p>
                                <strong className="text-[#0F172A] dark:text-white">
                                  Booked Properties:
                                </strong>{" "}
                                {trip.bookedProperties}
                              </p>
                            )}
                            {trip.bookedTransport && (
                              <p>
                                <strong className="text-[#0F172A] dark:text-white">
                                  Transport:
                                </strong>{" "}
                                {trip.bookedTransport}
                              </p>
                            )}
                            {trip.notes && <p className="italic">&quot;{trip.notes}&quot;</p>}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )
            ) : (
              crmCustomers.length === 0 ? (
                <div className="p-6 sm:p-10 text-center rounded-2xl border border-dashed border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] space-y-3">
                  <div className="text-3xl">👥</div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                    No Customers Master Records Yet
                  </h3>
                  <p className="text-xs text-[#475569] dark:text-zinc-400 max-w-md mx-auto">
                    Customers are unique traveller profiles (CUST-XXXXX) holding multiple journey dossiers.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Punch-List Item 4 Focused View Notification Banner for Customers */}
                  {crmFilterMode === "active" && !crmSearchQuery && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>
                          <strong>Focused View (Item 4):</strong> Showing top 10 active customer master dossiers ({crmCustomers.length} total customer master profiles in database).
                        </span>
                      </div>
                      <button
                        onClick={() => setCrmFilterMode("all")}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-blue-700 transition w-fit"
                      >
                        View All {crmCustomers.length} Customers →
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const q = crmSearchQuery.toLowerCase().trim();
                      let list = crmCustomers.filter((c) => {
                        if (!q) return true;
                        return (
                          c.primaryName.toLowerCase().includes(q) ||
                          c.customerCode.toLowerCase().includes(q) ||
                          (c.primaryMobile && c.primaryMobile.includes(q)) ||
                          (c.secondaryMobile && c.secondaryMobile.includes(q)) ||
                          (c.primaryEmail && c.primaryEmail.toLowerCase().includes(q))
                        );
                      });

                      if (!q && crmFilterMode === "active") {
                        list = list.slice(0, 10);
                      }

                      return list.map((cust) => (
                        <div
                          key={cust.id}
                          className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#F5951C]/40 transition"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30">
                                  {cust.customerCode}
                                </span>
                                <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mt-1.5">
                                  {cust.primaryName}
                                </h3>
                              </div>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#475569] dark:text-zinc-400">
                                {cust.tripsCount} {cust.tripsCount === 1 ? "Trip" : "Trips"}
                              </span>
                            </div>

                            <div className="text-xs text-[#475569] dark:text-zinc-400 space-y-0.5">
                              <p>
                                📱 Mobile:{" "}
                                <span className="font-mono font-semibold text-[#0F172A] dark:text-white">
                                  {cust.primaryMobile || "—"}
                                </span>
                                {cust.secondaryMobile && (
                                  <span className="font-mono text-[11px] text-[#475569] dark:text-zinc-400">
                                    {" "}
                                    / {cust.secondaryMobile}
                                  </span>
                                )}
                              </p>
                              {cust.primaryEmail && (
                                <p>
                                  ✉️ Email:{" "}
                                  <span className="text-[#0F172A] dark:text-white">
                                    {cust.primaryEmail}
                                  </span>
                                </p>
                              )}
                            </div>

                            {cust.recentTrips && cust.recentTrips.length > 0 && (
                              <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/5">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-zinc-400 block mb-1">
                                  Linked Journeys:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {cust.recentTrips.map((rt) => (
                                    <span
                                      key={rt.dealReferenceId}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 text-[#0F172A] dark:text-white"
                                    >
                                      {rt.dealReferenceId}: {rt.destination} ({rt.travelYear})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-[#E2E8F0] dark:border-white/10 flex justify-between items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingCustomer({
                                  id: cust.id,
                                  customerCode: cust.customerCode,
                                  primaryName: cust.primaryName,
                                  primaryMobile: cust.primaryMobile,
                                  secondaryMobile: cust.secondaryMobile,
                                  primaryEmail: cust.primaryEmail,
                                  needsContactEnrichment: cust.needsContactEnrichment,
                                })
                              }
                              className="text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[#0F172A] dark:text-white font-semibold hover:border-[#F5951C] hover:text-[#F5951C] transition"
                            >
                              ✏️ Edit Customer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewJourneyCustomer({
                                  id: cust.id,
                                  customerCode: cust.customerCode,
                                  primaryName: cust.primaryName,
                                  primaryMobile: cust.primaryMobile,
                                  primaryEmail: cust.primaryEmail,
                                });
                                setShowNewJourneyModal(true);
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition shadow-sm"
                            >
                              + New Journey
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 3: VETTED VENDORS DIRECTORY (Release 1.5.2 Item 5) */}
        {activeTab === "vendors" && (
          <div className="space-y-6">
            {/* Header & Primary Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>🏢</span> Vetted Vendor Atelier Directory
                </h2>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  Curated boutique slow-travel properties, verified fleet operators, DMCs & partner agencies ({vendors.length} Total Registered Partners)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {canManageVendors ? (
                  <button
                    onClick={openAddVendorModal}
                    className="rounded-xl bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition flex items-center gap-2 shadow-md"
                  >
                    <span>➕</span>
                    <span>Register Vendor Partner</span>
                  </button>
                ) : (
                  <span className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 shadow-sm">
                    <span>🔒</span>
                    <span>Directory View (Read-Only)</span>
                  </span>
                )}
                <button
                  onClick={refreshVendorsData}
                  disabled={vendorsLoading}
                  className="rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C] transition"
                  title="Reload live vendor directory from database"
                >
                  {vendorsLoading ? "Refreshing..." : "↻ Refresh"}
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={vendorSearchQuery}
                  onChange={(e) => setVendorSearchQuery(e.target.value)}
                  placeholder="Search vendors by name, code (VND-XXXX), destination, POC name, mobile..."
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                />
                {vendorSearchQuery && (
                  <button
                    onClick={() => setVendorSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: "all", label: `All (${vendors.length})` },
                  { id: "property", label: "Properties & Stays" },
                  { id: "cab", label: "Cab Fleets" },
                  { id: "dmc", label: "DMCs" },
                  { id: "agency", label: "Partner Agencies" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setVendorCategoryFilter(cat.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      vendorCategoryFilter === cat.id
                        ? "bg-[#F5951C] text-[#0F172A] font-bold"
                        : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Cards Grid */}
            {(() => {
              if (vendorsLoading && vendors.length === 0) {
                return (
                  <div className="p-6 sm:p-10 text-center text-[#475569] dark:text-zinc-400 text-xs">
                    Loading verified partner directory...
                  </div>
                );
              }

              const filtered = vendors.filter((v) => {
                if (vendorCategoryFilter !== "all" && v.category !== vendorCategoryFilter) {
                  return false;
                }
                const q = vendorSearchQuery.toLowerCase().trim();
                if (!q) return true;
                return (
                  (v.name && v.name.toLowerCase().includes(q)) ||
                  (v.vendor_code && v.vendor_code.toLowerCase().includes(q)) ||
                  (v.destination && v.destination.toLowerCase().includes(q)) ||
                  (v.region && v.region.toLowerCase().includes(q)) ||
                  (v.poc_name && v.poc_name.toLowerCase().includes(q)) ||
                  (v.poc_mobile && v.poc_mobile.includes(q)) ||
                  (v.email && v.email.toLowerCase().includes(q))
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-6 sm:p-10 text-center rounded-2xl border border-dashed border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] space-y-3">
                    <div className="text-3xl">🏢</div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">No Vendors Found</h3>
                    <p className="text-xs text-[#475569] dark:text-zinc-400 max-w-md mx-auto">
                      {vendorSearchQuery || vendorCategoryFilter !== "all"
                        ? "No vendor records matched your active filter or search query."
                        : "Register your first slow-travel property, fleet cab operator, or contracted DMC partner."}
                    </p>
                    <button
                      onClick={() => {
                        setShowAddVendorModal(true);
                        setVendorSubmitError(null);
                        setVendorSubmitSuccess(null);
                      }}
                      className="rounded-xl bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition"
                    >
                      ➕ Add First Vendor Partner
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#F5951C]/40 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5951C]/15 text-[#F5951C]">
                              {v.vendor_code}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                              {v.category}
                            </span>
                            {v.star_rating && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#475569] dark:text-zinc-300">
                                {v.star_rating}
                              </span>
                            )}
                          </div>
                          {v.is_active ? (
                            <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                              ● Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                              ● Inactive
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-[#0F172A] dark:text-white line-clamp-1">
                            {v.name}
                          </h3>
                          <p className="text-xs text-[#475569] dark:text-zinc-400 mt-0.5">
                            📍 {v.destination || "Pan India"}
                            {v.region ? ` (${v.region})` : ""}
                          </p>
                        </div>

                        {/* Contact details */}
                        <div className="text-xs text-[#475569] dark:text-zinc-400 space-y-1 pt-1 border-t border-[#E2E8F0] dark:border-white/5">
                          {v.poc_name && (
                            <p className="truncate">
                              👤 <strong>POC:</strong> {v.poc_name}
                            </p>
                          )}
                          {(v.poc_mobile || v.office_phone) && (
                            <p className="font-mono text-[11px] truncate">
                              📱 {v.poc_mobile || v.office_phone}
                            </p>
                          )}
                          {v.email && (
                            <p className="truncate">
                              ✉️{" "}
                              <a
                                href={`mailto:${v.email}`}
                                className="text-[#0F172A] dark:text-white hover:text-[#F5951C] underline decoration-[#F5951C]/50"
                              >
                                {v.email}
                              </a>
                            </p>
                          )}
                          {v.website && (
                            <p className="truncate text-[11px]">
                              🌐{" "}
                              <a
                                href={v.website.startsWith("http") ? v.website : `https://${v.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#F5951C] hover:underline"
                              >
                                {v.website.replace(/^https?:\/\//, "")}
                              </a>
                            </p>
                          )}
                        </div>

                        {/* Commercials / B2B Rates */}
                        {(v.rate_card_link || v.b2b_rates) && (
                          <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/5 space-y-1 text-xs">
                            {v.b2b_rates && (
                              <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                                <strong>Negotiated:</strong> {v.b2b_rates}
                              </p>
                            )}
                            {v.rate_card_link && (
                              <a
                                href={v.rate_card_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F5951C] hover:underline"
                              >
                                <span>📄</span> View Contracted Rate Card →
                              </a>
                            )}
                          </div>
                        )}

                        {v.comments && (
                          <p className="text-[10px] text-[#475569] dark:text-zinc-400 italic pt-1 border-t border-[#E2E8F0] dark:border-white/5 line-clamp-2">
                            &quot;{v.comments}&quot;
                          </p>
                        )}
                      </div>

                      {/* Vendor Card Actions (RBAC: Edit for Privilege/Admin/Super Admin, Delete for Super Admin ONLY) */}
                      {(canManageVendors || isSuperAdmin) && (
                        <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-end gap-2">
                          {canManageVendors && (
                            <button
                              type="button"
                              onClick={() => openEditVendorModal(v)}
                              className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/10 text-[11px] font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C] hover:text-[#F5951C] transition flex items-center gap-1"
                              title="Edit vendor details, rates, and POC"
                            >
                              <span>✏️</span> Edit
                            </button>
                          )}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteVendor(v.id, v.name)}
                              className="px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-semibold hover:bg-rose-500/20 transition flex items-center gap-1"
                              title="Permanently remove vendor partner (Super Admin Only)"
                            >
                              <span>🗑️</span> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: ITINERARY & PRICING (US-007, US-008, US-009, US-010 + CLAUDE AI INTEGRATION) */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">Bespoke Itinerary & Commercial Governance</h2>
                <p className="text-xs text-[#475569] dark:text-zinc-400">Day-by-day scheduler, line-item pricing & white-label proposal exports</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLaunchClaudePopup}
                  className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition flex items-center gap-1.5 shadow-md"
                  title="Copy client brief and open your Claude Project in pop-up window ($0.00 extra cost)"
                >
                  <span>🚀</span>
                  <span>{copiedPrompt ? "✓ Copied! Launching Pop-Up..." : "Launch Claude Project Pop-Up"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowClaudeModal(true);
                    setClaudeImportSuccess(null);
                  }}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/20 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition flex items-center gap-1.5"
                >
                  <span>⚙️</span>
                  <span>Studio & Sync</span>
                </button>
              </div>
            </div>

            {/* AI Itinerary Generator / Claude Project Integration Bridge Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-gradient-to-r from-white to-[#F8FAFC] dark:from-[#121215] dark:to-[#09090B] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F5951C]/20 border border-[#F5951C]/30 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Claude Project Integration Bridge</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        Zero API Cost Pop-Up Active
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] dark:text-zinc-400">
                      Copy your client brief directly into your custom Claude project to generate 18-20 page proposal PDFs with Unsplash visuals at $0.00 added cost.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={handleLaunchClaudePopup}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-[#e08515] transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🚀</span>
                    <span>{copiedPrompt ? "✓ Copied! Launching..." : "Launch Claude Project Pop-Up"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowClaudeModal(true);
                      setClaudeInputText(SAMPLE_CLAUDE_ITINERARY);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] dark:border-white/20 text-[#0F172A] dark:text-white/80 hover:border-[#F5951C] hover:text-[#F5951C] dark:hover:text-white transition"
                  >
                    View Sample Output
                  </button>
                </div>
              </div>

              {/* Headless API Evaluation Context */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#F1F5F9] dark:bg-black/30 border border-[#E2E8F0] dark:border-white/10 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>💡</span> Zero-Cost Pop-Up vs Headless API Cost Benchmark
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">100% Free Artifact Workflow</span>
                </div>
                <p className="text-[11px] text-[#475569] dark:text-white/70 leading-relaxed">
                  Generating 50 itineraries/day (18–20 pages each) via direct Anthropic Claude 3.5 Sonnet API would cost approximately <strong>$4.50 USD/day (~₹380 INR/day)</strong> or <strong>$135.00 USD/month (~₹11,400 INR/month)</strong>.
                  The <strong>Zero-Cost Pop-Up Artifact Launcher</strong> generates the same high-touch 18–20 page PDFs using your existing Claude project and Unsplash key at <strong>$0.00 additional API cost</strong>.
                </p>
              </div>

              {itineraryUpdatedFromClaude && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <span>✓ 8-Day itinerary synchronized from Claude Project output. Pacing, properties & activities active.</span>
                  <span className="text-[10px] font-mono opacity-80">Synced just now</span>
                </div>
              )}
            </div>

            {/* Live Persisted Itinerary Builder & Margin Engine (R1.5.3 M2) */}
            <ItineraryBuilderPanel
              customers={crmCustomers.map((c) => ({
                id: c.id,
                customerCode: c.customerCode,
                primaryName: c.primaryName,
              }))}
              trips={crmTrips.map((t) => ({
                id: t.id,
                dealReferenceId: t.dealReferenceId,
                customerId: t.customerId,
                destination: t.destination,
              }))}
              importedClaudeText={importedClaudeForBuilder}
              onClearImportedClaude={() => setImportedClaudeForBuilder(null)}
            />
          </div>
        )}

        {/* TAB 4: VENDORS & TEAM GOVERNANCE (US-001, US-014, US-015, US-016) */}
        {activeTab === "governance" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">Vendors & Team Governance</h2>
                <p className="text-xs text-[#475569] dark:text-zinc-400">Role-based staff directory, vetted contracted DMC rates & security step-up</p>
              </div>
              <div className="flex items-center gap-2.5">
                {canManageTeam && (
                  <button
                    onClick={() => {
                      setShowInviteModal(true);
                      setInviteSuccess(null);
                      setInviteError(null);
                    }}
                    className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>➕</span>
                    <span>Invite Team Member</span>
                  </button>
                )}
                <button className="rounded-xl border border-[#CBD5E1] dark:border-white/20 bg-black/5 dark:bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C]">
                  📥 Export Financial CSV (US-015)
                </button>
              </div>
            </div>

            {/* Section 1: Staff Directory & Security Governance (US-001) */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                      Internal Staff Directory & Access Roles (US-001)
                    </h3>
                    <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                      Super Admin & Administrator role-based provisioning with forced password rotation on first login
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#F5951C] font-semibold">
                  {teamMembers.length} Staff Accounts
                </span>
              </div>

              {directoryNotice && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex justify-between items-center">
                  <span>✓ {directoryNotice}</span>
                  <button onClick={() => setDirectoryNotice(null)} className="text-[#475569] dark:text-white/40 hover:text-[#0F172A] dark:hover:text-white">✕</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0F172A] dark:text-white text-sm">{member.fullName}</p>
                          {(member.role === "super_admin" || member.email.toLowerCase() === "vivek@searchmyvacation.com") && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F5951C]/20 text-[#F5951C] border border-[#F5951C]/40 text-[9px] font-bold">
                              OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-[#475569] dark:text-white/60 text-[11px]">{member.email}</p>
                        <p className="text-[#64748B] dark:text-white/40 text-[10px] font-mono mt-0.5">{member.phoneE164}</p>
                      </div>

                      {/* Interactive Role Switcher for Super Admin, or Styled Badge for viewers */}
                      {isSuperAdmin && member.email.toLowerCase() !== "vivek@searchmyvacation.com" ? (
                        <div className="relative flex items-center">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member, e.target.value as TeamMember["role"])}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition appearance-none pr-6 ${
                              member.role === "super_admin" || member.role === "administrator"
                                ? "bg-purple-950/90 text-purple-200 border-purple-500/40 hover:border-purple-400"
                                : member.role === "privilege_user"
                                ? "bg-blue-950/90 text-blue-200 border-blue-500/40 hover:border-blue-400"
                                : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 hover:border-emerald-400"
                            }`}
                            title={`Change ${member.fullName}'s role (Super Admin Privilege)`}
                          >
                            <option value="super_admin" className="bg-white dark:bg-[#09090B] text-purple-700 dark:text-purple-300">
                              Super Admin (Delegated)
                            </option>
                            <option value="administrator" className="bg-white dark:bg-[#09090B] text-purple-700 dark:text-purple-300">
                              Administrator
                            </option>
                            <option value="privilege_user" className="bg-white dark:bg-[#09090B] text-blue-700 dark:text-blue-300">
                              Privilege User (Senior)
                            </option>
                            <option value="desk_user" className="bg-white dark:bg-[#09090B] text-emerald-700 dark:text-emerald-300">
                              Desk User
                            </option>
                          </select>
                          <span className="pointer-events-none absolute right-2 text-[8px] text-white/70">▼</span>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          member.role === "super_admin" || member.email.toLowerCase() === "vivek@searchmyvacation.com" || member.role === "administrator"
                            ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                            : member.role === "privilege_user"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        }`}>
                          {member.email.toLowerCase() === "vivek@searchmyvacation.com"
                            ? "Super Admin"
                            : member.role === "super_admin"
                            ? "Super Admin"
                            : member.role.replace("_", " ")}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-[#64748B] dark:text-white/40">Provisioned: {member.invitedAt}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            member.status === "Active"
                              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                              : member.status === "Inactive"
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
                              : "text-amber-600 dark:text-amber-400 font-semibold"
                          }
                        >
                          ● {member.status}
                        </span>
                        {member.role !== "super_admin" &&
                        member.email.toLowerCase() !== "vivek@searchmyvacation.com" ? (
                          <div className="flex items-center gap-1.5">
                            {canManageTeam && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingStaff({
                                    fullName: member.fullName,
                                    email: member.email,
                                    phoneE164: member.phoneE164,
                                    role: member.role,
                                  })
                                }
                                className="px-2 py-0.5 rounded text-[10px] font-semibold transition border border-[#CBD5E1] dark:border-white/15 text-[#0F172A] dark:text-white hover:border-[#F5951C] hover:text-[#F5951C]"
                                title={`Edit ${member.fullName}'s name or mobile`}
                              >
                                ✏️ Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleActiveStatus(member)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition border ${
                                member.status === "Inactive"
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30"
                              }`}
                              title={
                                member.status === "Inactive"
                                  ? `Reactivate account for ${member.fullName}`
                                  : `Mark ${member.fullName} as Inactive (blocks session and login)`
                              }
                            >
                              {member.status === "Inactive" ? "Reactivate" : "Mark Inactive"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member)}
                              className="px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 text-[10px] font-semibold transition"
                              title={`Permanently delete ${member.fullName} from directory and database`}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[#475569] dark:text-white/50 border border-[#E2E8F0] dark:border-white/10 text-[9px] font-semibold flex items-center gap-1">
                            <span>🔒</span> Protected Super Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Vendors & Document Vault */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span>🏢</span> Vetted Vendor Directory (RBAC)
                  </h3>
                  <button
                    onClick={() => setActiveTab("vendors")}
                    className="text-xs font-semibold text-[#F5951C] hover:underline flex items-center gap-1"
                  >
                    Manage Directory ({vendors.length > 0 ? vendors.length : "430+"}) →
                  </button>
                </div>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  Curated registry of boutique slow-travel properties, verified fleet operators, and contracted destination management companies (DMCs).
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab("vendors")}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-[#e08515] transition"
                  >
                    View Vendor Directory
                  </button>
                  <button
                    onClick={() => {
                      setShowAddVendorModal(true);
                      setVendorSubmitError(null);
                      setVendorSubmitSuccess(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C] transition"
                  >
                    + Add New Vendor
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>🔐</span> Encrypted Document Vault & Step-Up (US-016)
                </h3>
                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0F172A] dark:text-white">Ananya Sharma (Passport)</span>
                    <span className="text-[#475569] dark:text-white/50 font-mono">XXXX-4567</span>
                  </div>
                  <p className="text-[11px] text-[#475569] dark:text-white/50">Auto-masked by default. Step-Up OTP authorization required for unmasked view.</p>
                  <button className="w-full py-1.5 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[11px] font-semibold text-[#F5951C] hover:bg-black/5 dark:hover:bg-white/5">
                    Request Step-Up Unmasking (5-Min Window)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: INVITE TEAM MEMBER MODAL (US-001) */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-lg w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>➕</span> Invite Team Member
                </h3>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  Role-based provisioning for Search My Vacation staff (US-001)
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#475569] hover:text-[#0F172A] dark:text-white/40 dark:hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-2">
                    <span>✓</span> Staff Member Provisioned Successfully
                  </p>
                  <p>{inviteSuccess}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-2 text-xs">
                  <p className="text-[#475569] dark:text-white/60 text-[11px] uppercase tracking-wider font-semibold">
                    Temporary Default Password:
                  </p>
                  <div className="flex justify-between items-center bg-[#0F172A] dark:bg-black/40 px-3 py-2 rounded-lg font-mono text-[#F5951C]">
                    <span>TemporaryDefaultPass#2026</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("TemporaryDefaultPass#2026");
                        setCopiedPass(true);
                        setTimeout(() => setCopiedPass(false), 2500);
                      }}
                      className="text-xs font-sans text-white/80 hover:text-white underline ml-2 cursor-pointer"
                    >
                      {copiedPass ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-white/40">
                    Security Mandate: The invited staff member will be required to configure their own permanent password upon their initial sign-in.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                {inviteError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
                    {inviteError}
                  </div>
                )}

                <div>
                  <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                    Full Name <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3.5 py-2.5 text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                    Company Email <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. ramesh@searchmyvacation.com"
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3.5 py-2.5 text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                    Registered Mobile (E.164) <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3.5 py-2.5 text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#64748B] dark:text-white/40 mt-1">Used for single-channel SMS OTP login challenges.</p>
                </div>

                <div>
                  <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                    Role & Permissions <span className="text-[#F5951C]">*</span>
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3.5 py-2.5 text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                  >
                    <option value="desk_user">Desk User — Client CRM & Itinerary Operations</option>
                    <option value="privilege_user">Privilege User — Senior Advisor (Margin Overrides & VIP Docs)</option>
                    <option value="administrator">Administrator — Full Operations & Team Management</option>
                    {isSuperAdmin && (
                      <option value="super_admin">Super Admin — Delegated Platform Ownership</option>
                    )}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#475569] dark:text-white/60">Temporary Default Password:</span>
                    <span className="font-mono text-[#F5951C] font-semibold">TemporaryDefaultPass#2026</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-white/40">
                    Invitees must configure a unique permanent password on first sign in.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-white/70 hover:text-[#0F172A] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CLAUDE AI ITINERARY & PROPOSAL PDF STUDIO */}
      {/* ========================================================================= */}
      {showClaudeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-2xl w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>🤖</span> Claude Project Itinerary & PDF Studio
                </h3>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  Connect your custom Claude project to generate and export client proposal PDFs
                </p>
              </div>
              <button
                onClick={() => setShowClaudeModal(false)}
                className="text-[#475569] hover:text-[#0F172A] dark:text-white/40 dark:hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {claudeImportSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
                  <p className="font-bold flex items-center gap-2 mb-1">
                    <span>✓</span> Itinerary & Proposal Synchronized!
                  </p>
                  <p>{claudeImportSuccess}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0F172A] dark:text-white">Proposal PDF Ready for Download:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Format: Official Client PDF</span>
                  </div>
                  <div className="p-3 bg-[#F1F5F9] dark:bg-black/40 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#F5951C]">8-Day_Kashmir_Serenity_Circuit_Proposal_v1.0.pdf</p>
                      <p className="text-[10px] text-[#475569] dark:text-white/50">Includes Day-by-Day schedule, boutique stays, pure-veg dining & GST pricing</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-[#e08515]"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowClaudeModal(false);
                      setClaudeImportSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-[#0F172A] dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-black/10 dark:hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* 0. Claude Project URL Configuration */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#F5951C]/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[#0F172A] dark:text-white font-bold text-xs flex items-center gap-1.5">
                      <span>🔗</span> Your Custom Claude Project URL:
                    </label>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">Zero API Surcharge ($0.00)</span>
                  </div>
                  <input
                    type="url"
                    value={claudeProjectUrl}
                    onChange={(e) => {
                      setClaudeProjectUrl(e.target.value);
                      try {
                        localStorage.setItem("smv_claude_project_url", e.target.value);
                      } catch {}
                    }}
                    placeholder="e.g. https://claude.ai/project/... or https://claude.ai"
                    className="w-full rounded-xl bg-white dark:bg-black/40 border border-[#CBD5E1] dark:border-white/15 px-3 py-2 text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 text-xs font-mono focus:border-[#F5951C] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#475569] dark:text-white/50">
                    Enter the URL of your existing Claude project. Clicking &quot;Launch Pop-Up&quot; will copy your client dossier and open this exact Claude project in a dedicated window.
                  </p>
                </div>

                {/* Brief Inputs matching Vivek's Claude Project settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                      1. Destination / Location <span className="text-[#F5951C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={claudeBriefLocation}
                      onChange={(e) => setClaudeBriefLocation(e.target.value)}
                      className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3 py-2 text-[#0F172A] dark:text-white text-xs focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                      2. Trip Duration <span className="text-[#F5951C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={claudeBriefDuration}
                      onChange={(e) => setClaudeBriefDuration(e.target.value)}
                      className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 px-3 py-2 text-[#0F172A] dark:text-white text-xs focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F172A] dark:text-white/70 font-semibold mb-1">
                    3. Special Asks & Client Constraints <span className="text-[#F5951C]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={claudeBriefAsks}
                    onChange={(e) => setClaudeBriefAsks(e.target.value)}
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 p-2.5 text-[#0F172A] dark:text-white text-xs focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                {/* Attachments Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[#0F172A] dark:text-white/70 font-semibold">
                      4. Linked Attachments & Reference Documents:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newName = prompt("Enter attachment file name (e.g. Flight_Voucher.pdf):", "Guest_Custom_Notes.pdf");
                        if (newName) {
                          setAttachedFiles((prev) => [...prev, { name: newName, size: "180 KB" }]);
                        }
                      }}
                      className="text-[11px] text-[#F5951C] hover:underline"
                    >
                      + Add File Attachment
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 text-[11px] text-[#0F172A] dark:text-white/80"
                      >
                        <span>📎</span>
                        <span>{file.name}</span>
                        <span className="text-[#64748B] dark:text-white/40 font-mono">({file.size})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Bar: Copy Prompt & Launch Pop-Up */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-white dark:from-[#09090B] dark:to-[#121215] border border-[#E2E8F0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-[11px] text-[#475569] dark:text-white/70">
                    {copiedPrompt ? "✓ Client dossier copied to clipboard!" : "Copy briefing dossier & launch in dedicated pop-up:"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyClaudePrompt}
                      className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#0F172A] dark:text-white font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition flex items-center gap-1.5 text-xs"
                    >
                      <span>📋</span>
                      <span>{copiedPrompt ? "Copied! ✓" : "Copy Brief"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLaunchClaudePopup}
                      className="px-4 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition flex items-center gap-1.5 text-xs shadow-md"
                    >
                      <span>🚀</span>
                      <span>{copiedPrompt ? "✓ Copied! Launching..." : "Launch Claude Project Pop-Up"}</span>
                    </button>
                  </div>
                </div>

                {/* Import / Paste Claude Output */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[#0F172A] dark:text-white/70 font-semibold">
                      5. Paste Claude Project Output (Markdown or JSON):
                    </label>
                    <button
                      onClick={() => setClaudeInputText(SAMPLE_CLAUDE_ITINERARY)}
                      className="text-[11px] text-[#F5951C] hover:underline"
                    >
                      Load Sample Output
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={claudeInputText}
                    onChange={(e) => setClaudeInputText(e.target.value)}
                    placeholder="Paste the output generated by your Claude project here..."
                    className="w-full rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#CBD5E1] dark:border-white/10 p-3 text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/30 font-mono text-[11px] focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-200 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>💡</span> Zero-Cost Pop-Up vs Headless API Evaluation
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-200/80 leading-relaxed">
                    1. <strong>Zero-Cost Pop-Up Artifact Launcher:</strong> $0.00/month. Directly leverages your existing Claude Project and Unsplash key with zero additional infrastructure or token costs.<br />
                    2. <strong>Headless API Cost Benchmark:</strong> Generating 50 bespoke itineraries/day (18–20 pages each) via direct Anthropic Claude 3.5 Sonnet API would cost approximately <strong>$4.50 USD/day (~₹380 INR/day)</strong> or <strong>$135.00 USD/month (~₹11,400 INR/month)</strong>.<br />
                    3. <strong>Interactive Workflow:</strong> 1-click copies the dossier and opens your Claude Project in a pop-up window (`ClaudeProject`, 1200x850). Paste with Cmd+V, generate your proposal, and parse it back into SMV at $0.00 cost!
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClaudeModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-white/70 hover:text-[#0F172A] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleParseClaudeInput}
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition"
                  >
                    Parse & Generate PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW CLIENT DOSSIER (US-004, US-005, US-006) */}
      {/* ========================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-2xl w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-5 pb-3 border-b border-[#E2E8F0] dark:border-white/10">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>➕</span> Add New Client Dossier
                </h3>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  Decoupled Master Client Profile with mandatory lead source attribution, preference tags & family companions
                </p>
              </div>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-[#475569] hover:text-[#0F172A] dark:text-white/40 dark:hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Notification Messages */}
            {clientSubmitSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <span>✓</span>
                <span>{clientSubmitSuccess}</span>
              </div>
            )}
            {clientSubmitError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{clientSubmitError}</span>
              </div>
            )}
            {duplicateWarning && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>⚠️</span> Existing Client Match Detected
                </p>
                <p>{duplicateWarning}</p>
              </div>
            )}

            {matchedCustomer && (
              <div className="mb-4 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <span>⭐</span> Returning Customer Detected ({matchedCustomer.customerCode})
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200">
                    {matchedCustomer.pastTripsCount} Previous Journeys
                  </span>
                </div>
                <p className="text-[#0F172A] dark:text-amber-100">
                  <strong>{matchedCustomer.primaryName}</strong> ({matchedCustomer.primaryMobile}) is already cataloged in our atelier.
                </p>
                {!isLinkedToExisting ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLinkedToExisting(true);
                      setClientFormName(matchedCustomer.primaryName);
                      if (matchedCustomer.primaryMobile) setClientFormPhone(matchedCustomer.primaryMobile);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-[#e08515] transition shadow-sm"
                  >
                    Link New Journey to {matchedCustomer.primaryName} ({matchedCustomer.customerCode})
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/40 p-2.5 rounded-lg text-emerald-800 dark:text-emerald-200">
                    <span className="font-semibold">✓ Linked to existing profile {matchedCustomer.customerCode}. New trip deal will be attached.</span>
                    <button
                      type="button"
                      onClick={() => setIsLinkedToExisting(false)}
                      className="text-[11px] underline text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                    >
                      Unlink
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateClientSubmit} className="space-y-5">
              {/* SECTION 1: PRIMARY IDENTIFICATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                  1. Client Identification (US-004)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                      Full Name <span className="text-[#F5951C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientFormName}
                      onChange={(e) => setClientFormName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                      Primary Email <span className="text-[#64748B] dark:text-white/40 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={clientFormEmail}
                      onChange={(e) => setClientFormEmail(e.target.value)}
                      onBlur={handleBlurDuplicateCheck}
                      placeholder="e.g. ananya.sharma@example.com"
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                      Registered Mobile (E.164) <span className="text-[#F5951C]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientFormPhone}
                      onChange={(e) => setClientFormPhone(e.target.value)}
                      onBlur={handleBlurDuplicateCheck}
                      placeholder="+91 98401 12233"
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                      City / Nationality
                    </label>
                    <input
                      type="text"
                      value={clientFormCity}
                      onChange={(e) => setClientFormCity(e.target.value)}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                      Mandatory Lead Source <span className="text-[#F5951C]">*</span>
                    </label>
                    <select
                      value={clientFormLeadSource}
                      onChange={(e) => setClientFormLeadSource(e.target.value)}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    >
                      <option value="instagram">Instagram Campaign</option>
                      <option value="client_referral">Client Referral</option>
                      <option value="founder_network">Founder Network</option>
                      <option value="website">Website Inbound</option>
                      <option value="concierge_partner">Concierge Partner</option>
                      <option value="other">Other Direct Channel</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A] dark:text-white/90">
                      <input
                        type="checkbox"
                        checked={clientFormIsVip}
                        onChange={(e) => setClientFormIsVip(e.target.checked)}
                        className="rounded border-[#CBD5E1] dark:border-white/20 bg-[#F8FAFC] dark:bg-[#09090B] text-[#F5951C] focus:ring-[#F5951C] h-4 w-4"
                      />
                      <span className="flex items-center gap-1">
                        <span>⭐</span> Mark as High-Touch VIP Client
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PREFERENCE & DIETARY TAGGING */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                  2. Travel Style & Preference Tagging (US-005)
                </h4>
                <p className="text-[11px] text-[#475569] dark:text-white/50">
                  Select key travel, dietary, and accommodation preferences for this client:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Family Comfort",
                    "Slow Travel",
                    "Pure Vegetarian",
                    "Jain Dining",
                    "Boutique Heritage",
                    "Private Transfers",
                    "Photography Focused",
                    "High Pacing",
                  ].map((tag) => {
                    const isSelected = clientFormSelectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                          isSelected
                            ? "bg-[#F5951C] text-[#0F172A] border-[#F5951C] font-bold"
                            : "bg-[#F8FAFC] dark:bg-[#09090B] text-[#475569] dark:text-white/70 border-[#CBD5E1] dark:border-white/10 hover:border-[#F5951C]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={clientFormCustomTag}
                    onChange={(e) => setClientFormCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Add custom tag (e.g. Interconnecting Rooms)..."
                    className="flex-1 rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] dark:border-white/20 bg-black/5 dark:bg-white/5 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* SECTION 3: LINKED COMPANIONS */}
              <div className="space-y-3 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                      3. Family & Travel Companions (US-004)
                    </h4>
                    <p className="text-[11px] text-[#475569] dark:text-white/50">
                      Link spouses, children, or travelling party members
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCompanionRow}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[#F5951C]/40 text-[#F5951C] hover:bg-[#F5951C]/10 transition"
                  >
                    + Add Companion
                  </button>
                </div>

                <div className="space-y-2">
                  {clientFormCompanions.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={comp.fullName}
                          onChange={(e) => handleUpdateCompanion(idx, "fullName", e.target.value)}
                          placeholder="Companion Name"
                          className="w-full rounded-lg border border-[#CBD5E1] dark:border-white/10 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <select
                          value={comp.relationship}
                          onChange={(e) => handleUpdateCompanion(idx, "relationship", e.target.value)}
                          className="w-full rounded-lg border border-[#CBD5E1] dark:border-white/10 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                        >
                          <option value="spouse">Spouse</option>
                          <option value="child">Child</option>
                          <option value="parent">Parent</option>
                          <option value="friend">Friend</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={comp.notes}
                          onChange={(e) => handleUpdateCompanion(idx, "notes", e.target.value)}
                          placeholder="Notes (e.g. Age 7, Pure Veg)"
                          className="w-full rounded-lg border border-[#CBD5E1] dark:border-white/10 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCompanionRow(idx)}
                          className="text-[#64748B] dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 text-sm p-1"
                          title="Remove companion"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: INITIAL DISCOVERY NOTE */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                  4. Initial Discovery & Trip Briefing (US-006)
                </h4>
                <textarea
                  rows={3}
                  value={clientFormInitialNote}
                  onChange={(e) => setClientFormInitialNote(e.target.value)}
                  placeholder="e.g. Discovery call completed. Client requested 8-day slow-travel Kashmir autumn circuit, interconnected rooms, pure vegetarian dining."
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] p-3 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/20 text-xs font-semibold text-[#475569] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={clientSubmitLoading}
                  className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {clientSubmitLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Saving Dossier...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Save Client Dossier</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD VETTED VENDOR MODAL (Release 1.5.2 Item 5) */}
      {/* ========================================================================= */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-2xl w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 border-b border-[#E2E8F0] dark:border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>🏢</span> {editingVendor ? `Edit Partner: ${editingVendor.name}` : "Register Vetted Vendor Partner"}
                </h3>
                <p className="text-xs text-[#475569] dark:text-zinc-400">
                  {editingVendor
                    ? `Updating details for atelier vendor partner (${editingVendor.vendor_code})`
                    : "Boutique slow-travel stays, fleet cab operators, DMCs & partner agencies"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddVendorModal(false);
                  setEditingVendor(null);
                }}
                className="text-[#475569] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {vendorSubmitSuccess ? (
              <div className="space-y-4 py-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                  <span>✓</span> {vendorSubmitSuccess}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVendorModal(false);
                    setVendorSubmitSuccess(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-[#e08515] transition"
                >
                  Close & Refresh
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddVendorSubmit} className="space-y-4 text-xs">
                {vendorSubmitError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                    {vendorSubmitError}
                  </div>
                )}

                {/* 1. Classification */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                    1. Partner Classification & Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Vendor / Property / Fleet Name <span className="text-[#F5951C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorFormName}
                        onChange={(e) => setVendorFormName(e.target.value)}
                        placeholder="e.g. Nigeen Heritage Floats / Taj Bekal Resort"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Category <span className="text-[#F5951C]">*</span>
                      </label>
                      <select
                        value={vendorFormCategory}
                        onChange={(e) => setVendorFormCategory(e.target.value as any)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                      >
                        <option value="property">Property / Resort / Boutique Hotel</option>
                        <option value="cab">Cab / Fleet Transport Operator</option>
                        <option value="dmc">Destination Management Company (DMC)</option>
                        <option value="agency">Partner Travel Agency</option>
                        <option value="activity">Activity / Experience Provider</option>
                        <option value="other">Other Service Vendor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Rating / Standard Tier
                      </label>
                      <input
                        type="text"
                        value={vendorFormStarRating}
                        onChange={(e) => setVendorFormStarRating(e.target.value)}
                        placeholder="e.g. 5-Star Premier, 4-Star Boutique, Heritage Estate"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Destination / City
                      </label>
                      <input
                        type="text"
                        value={vendorFormDestination}
                        onChange={(e) => setVendorFormDestination(e.target.value)}
                        placeholder="e.g. Srinagar, Munnar, Bentota"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Region / State
                      </label>
                      <input
                        type="text"
                        value={vendorFormRegion}
                        onChange={(e) => setVendorFormRegion(e.target.value)}
                        placeholder="e.g. Kashmir, Kerala, Sri Lanka"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contact Information */}
                <div className="space-y-3 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                    2. Key Contact & Communications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Point of Contact (POC) Name
                      </label>
                      <input
                        type="text"
                        value={vendorFormPocName}
                        onChange={(e) => setVendorFormPocName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        POC Direct Mobile
                      </label>
                      <input
                        type="tel"
                        value={vendorFormPocMobile}
                        onChange={(e) => setVendorFormPocMobile(e.target.value)}
                        placeholder="e.g. +91 98400 12345"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Office / Landline Phone
                      </label>
                      <input
                        type="tel"
                        value={vendorFormOfficePhone}
                        onChange={(e) => setVendorFormOfficePhone(e.target.value)}
                        placeholder="e.g. 0484 2345678"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={vendorFormEmail}
                        onChange={(e) => setVendorFormEmail(e.target.value)}
                        placeholder="e.g. reservations@hotel.com"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Website Link
                      </label>
                      <input
                        type="text"
                        value={vendorFormWebsite}
                        onChange={(e) => setVendorFormWebsite(e.target.value)}
                        placeholder="e.g. https://www.resort.com"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Physical Address
                      </label>
                      <input
                        type="text"
                        value={vendorFormAddress}
                        onChange={(e) => setVendorFormAddress(e.target.value)}
                        placeholder="e.g. Tea Estate Road, Munnar"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Commercials & Contracting */}
                <div className="space-y-3 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                    3. Commercial Contracts & B2B Rates
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Rate Card Link (Google Drive / PDF URL)
                      </label>
                      <input
                        type="url"
                        value={vendorFormRateCardLink}
                        onChange={(e) => setVendorFormRateCardLink(e.target.value)}
                        placeholder="e.g. https://drive.google.com/file/d/... or direct web link"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Negotiated B2B Rates / Terms
                      </label>
                      <input
                        type="text"
                        value={vendorFormB2bRates}
                        onChange={(e) => setVendorFormB2bRates(e.target.value)}
                        placeholder="e.g. 20% off rack, CP plan included, Net 15 days payment"
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                        Internal Operational Notes & Quality Observations
                      </label>
                      <textarea
                        rows={2}
                        value={vendorFormComments}
                        onChange={(e) => setVendorFormComments(e.target.value)}
                        placeholder="e.g. Excellent mountain views, trusted driver fleet, pure vegetarian breakfast curated."
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] p-2.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddVendorModal(false);
                      setEditingVendor(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/20 text-xs font-semibold text-[#475569] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={vendorSubmitLoading}
                    className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                  >
                    {vendorSubmitLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>{editingVendor ? "Saving Changes..." : "Registering Partner..."}</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>{editingVendor ? "Update Vendor Partner" : "Register Vendor Partner"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT CONCIERGE INTELLIGENCE RADAR (US-018) */}
      {/* Staff cannot permanently close or disable this dock. */}
      {/* ========================================================================= */}
      <div
        style={
          radarPos.isCustom
            ? { left: `${radarPos.x}px`, top: `${radarPos.y}px`, position: "fixed" }
            : {}
        }
        className={
          radarPos.isCustom
            ? "z-50 select-none"
            : "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none"
        }
      >
        {/* State A: Minimized Compact Circular Button */}
        {radarMinimized ? (
          (() => {
            const in7Iso = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
            const dueHoldCount = crmTrips.filter(
              (t) => t.dealStage === "On Hold" && t.followUpDate && t.followUpDate <= in7Iso
            ).length;
            return (
              <button
                type="button"
                onMouseDown={startDragging}
                onClick={() => setRadarMinimized(false)}
                aria-label={`Expand Concierge Radar (${activeDestination})`}
                title={`Concierge Radar: ${activeDestination} (Tap to expand, drag to move)`}
                className="relative w-12 h-12 rounded-full bg-white dark:bg-[#121215] border-2 border-[#F5951C] shadow-2xl flex items-center justify-center text-[#0F172A] dark:text-white hover:scale-105 transition cursor-pointer"
              >
                <span className="text-lg leading-none" aria-hidden="true">📡</span>
                <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {dueHoldCount > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {dueHoldCount}
                  </span>
                )}
              </button>
            );
          })()
        ) : (
          /* State B: Expanded Dock */
          <div className="w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/15 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="p-3.5 bg-[#0F172A] border-b border-[#E2E8F0] dark:border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Concierge Radar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRadarMinimized(true)}
                  className="text-xs text-white/70 hover:text-white px-2 py-0.5 rounded border border-white/20"
                >
                  Minimize
                </button>
              </div>
            </div>

            {/* Context Selector */}
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#09090B] border-b border-[#E2E8F0] dark:border-white/5 flex gap-2 overflow-x-auto text-xs">
              {["Kashmir", "Rajasthan", "Kerala", "Ladakh"].map((dest) => (
                <button
                  key={dest}
                  onClick={() => setActiveDestination(dest)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    activeDestination === dest
                      ? "bg-[#F5951C] text-[#0F172A]"
                      : "text-[#475569] dark:text-white/60 hover:text-[#0F172A] dark:hover:text-white"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Live Context Cards */}
            <div className="p-4 space-y-3 text-xs max-h-72 overflow-y-auto">
              {/* Weather */}
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[11px] text-[#475569] dark:text-white/50 uppercase font-semibold">Live Weather</p>
                  <p className="font-bold text-[#0F172A] dark:text-white mt-0.5">14°C • Golden Autumn Skies</p>
                </div>
                <span className="text-2xl">🍂</span>
              </div>

              {/* Flights */}
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 space-y-1">
                <p className="text-[11px] text-[#475569] dark:text-white/50 uppercase font-semibold">Flight Intelligence</p>
                <div className="flex justify-between items-center text-[#0F172A] dark:text-white">
                  <span>DEL ➔ SXR (AI-825)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">On Time</span>
                </div>
              </div>

              {/* Ground Notice */}
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 space-y-1">
                <p className="text-[11px] text-[#475569] dark:text-white/50 uppercase font-semibold">Local Supplier Advisory</p>
                <p className="text-[#334155] dark:text-white/80">Srinagar-Gulmarg Highway: Clear, private chauffeured escort confirmed.</p>
              </div>

              {/* On Hold Follow-Up Reminders (US-154-03) */}
              {(() => {
                const in7Iso = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
                const dueHolds = crmTrips.filter(
                  (t) => t.dealStage === "On Hold" && t.followUpDate && t.followUpDate <= in7Iso
                );
                if (dueHolds.length === 0) return null;
                return (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 uppercase font-bold">
                      ⏰ On Hold Follow-Ups Due ({dueHolds.length})
                    </p>
                    {dueHolds.slice(0, 3).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setDrawerTripId(h.id)}
                        className="w-full text-left text-[11px] text-[#0F172A] dark:text-white hover:text-[#F5951C] flex justify-between items-center"
                      >
                        <span className="truncate font-semibold">
                          {h.dealReferenceId} • {h.customerName}
                        </span>
                        <span className="font-mono text-[10px] shrink-0 ml-1">{h.followUpDate}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Inactivity Notice */}
            <div className="p-2.5 bg-[#0F172A] border-t border-[#E2E8F0] dark:border-white/5 text-[10px] text-white/60 text-center">
              Permanent dock. 30-min idle watchdog prompts before logout &amp; resets position.
            </div>
          </div>
        )}
      </div>

      {/* Release 1.5.4: + New Journey Modal, Unified Drawer & Kanban Stage Gate Modal */}
      {showNewJourneyModal && (
        <NewJourneyModal
          customers={crmCustomers.map((c) => ({
            id: c.id,
            customerCode: c.customerCode,
            primaryName: c.primaryName,
            primaryMobile: c.primaryMobile,
            primaryEmail: c.primaryEmail,
          }))}
          staffOptions={staffOptions}
          preselectedCustomer={newJourneyCustomer}
          callerEmail={session.email}
          callerName={session.fullName}
          callerRole={session.role}
          onClose={() => {
            setShowNewJourneyModal(false);
            setNewJourneyCustomer(null);
          }}
          onCreated={(res) => {
            setShowNewJourneyModal(false);
            setNewJourneyCustomer(null);
            setCrmNotice(res.message);
            setTimeout(() => setCrmNotice(null), 5000);
            refreshCrmData();
            setDrawerTripId(res.tripId);
          }}
        />
      )}

      {drawerTripId && (
        <JourneyDetailDrawer
          tripId={drawerTripId}
          staffOptions={staffOptions}
          callerEmail={session.email}
          callerName={session.fullName}
          callerRole={session.role}
          onClose={() => setDrawerTripId(null)}
          onRefreshDashboard={refreshCrmData}
          onOpenTripInDrawer={(nextId) => setDrawerTripId(nextId)}
          onOpenEditModal={(tripObj) => setEditingTrip(tripObj)}
          onOpenItineraryTab={() => setActiveTab("itinerary")}
        />
      )}

      {kanbanStageGate && (
        <StageGateModal
          trip={kanbanStageGate.trip}
          targetStage={kanbanStageGate.targetStage}
          callerEmail={session.email}
          callerName={session.fullName}
          callerRole={session.role}
          onClose={() => setKanbanStageGate(null)}
          onCompleted={(msg) => {
            setKanbanStageGate(null);
            setCrmNotice(msg);
            setTimeout(() => setCrmNotice(null), 5000);
            refreshCrmData();
          }}
        />
      )}

      {/* Milestone 1 Edit Modals */}
      {editingTrip && (
        <EditTripModal
          trip={editingTrip}
          staffOptions={staffOptions}
          callerEmail={session.email}
          callerName={session.fullName}
          callerRole={session.role}
          onClose={() => setEditingTrip(null)}
          onSaved={(msg) => {
            setEditingTrip(null);
            setCrmNotice(msg);
            setTimeout(() => setCrmNotice(null), 5000);
            refreshCrmData();
          }}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSaved={(msg) => {
            setEditingCustomer(null);
            setCrmNotice(msg);
            setTimeout(() => setCrmNotice(null), 5000);
            refreshCrmData();
          }}
        />
      )}

      {editingStaff && (
        <EditStaffModal
          member={editingStaff}
          callerEmail={session.email}
          onClose={() => setEditingStaff(null)}
          onSaved={(updated, msg) => {
            setEditingStaff(null);
            setTeamMembers((prev) =>
              prev.map((m) =>
                m.email.toLowerCase() === updated.email.toLowerCase()
                  ? { ...m, fullName: updated.fullName, phoneE164: updated.phoneE164 }
                  : m
              )
            );
            setDirectoryNotice(msg);
            setTimeout(() => setDirectoryNotice(null), 5000);
          }}
        />
      )}

      {/* 30-Min Inactivity Prompt + 2-Min Grace Countdown */}
      <SessionIdleGuard onLogout={handleSignOut} />
    </div>
  );
}
