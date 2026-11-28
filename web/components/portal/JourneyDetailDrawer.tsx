"use client";

import { useCallback, useEffect, useState } from "react";
import { StaffOption } from "./EditTripModal";
import { StageGateModal } from "./StageGateModal";
import { useDestinationClock } from "@/lib/portal/useDestinationClock";

interface JourneyDetailDrawerProps {
  tripId: string;
  staffOptions: StaffOption[];
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
  onRefreshDashboard: () => void;
  onOpenTripInDrawer: (tripId: string) => void;
  onOpenEditModal: (trip: any) => void;
  onOpenItineraryTab: () => void;
}

type DrawerTab =
  | "overview"
  | "itinerary"
  | "bookings"
  | "payments"
  | "travellers"
  | "activity";

const READINESS_ITEMS: Array<{ key: string; label: string }> = [
  { key: "stays_confirmed", label: "Stays Confirmed" },
  { key: "transport_assigned", label: "Transport / Cab Assigned" },
  { key: "roster_verified", label: "Traveller Roster Verified" },
  { key: "itinerary_exported", label: "White-Label Itinerary Exported" },
  { key: "payment_settled", label: "Payment Settled (Balance Due = ₹0)" },
  { key: "voucher_published", label: "Active Voucher Published" },
];

export function JourneyDetailDrawer({
  tripId,
  staffOptions,
  callerEmail,
  callerName,
  callerRole,
  onClose,
  onRefreshDashboard,
  onOpenTripInDrawer,
  onOpenEditModal,
  onOpenItineraryTab,
}: JourneyDetailDrawerProps) {
  const roleLower = callerRole.toLowerCase();
  const isSuperAdmin =
    roleLower === "super_admin" ||
    callerEmail.toLowerCase() === "vivek@searchmyvacation.com";
  const isAdminOrAbove = isSuperAdmin || roleLower === "administrator";
  const isPrivilegeOrAbove = isAdminOrAbove || roleLower === "privilege_user";

  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const destinationClock = useDestinationClock(data?.trip?.destination);
  const [toast, setToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [stageGateTarget, setStageGateTarget] = useState<
    "Booked/Won" | "On Hold" | "Lost" | "Cancelled" | "In Progress" | "Complete" | null
  >(null);

  // Amendment form state
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [amendSummary, setAmendSummary] = useState("");
  const [amendQuoteDelta, setAmendQuoteDelta] = useState("0");
  const [amendCostDelta, setAmendCostDelta] = useState("0");

  // Payment form state
  const [trancheLabel, setTrancheLabel] = useState("Token Advance");
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("UPI");
  const [payRef, setPayRef] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  // Booking form state
  const [bookingType, setBookingType] = useState("Stay");
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingVendor, setBookingVendor] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Confirmed");
  const [bookingNotes, setBookingNotes] = useState("");

  // Companion form state
  const [compName, setCompName] = useState("");
  const [compRel, setCompRel] = useState("spouse");
  const [compDietary, setCompDietary] = useState("");
  const [compMobility, setCompMobility] = useState("");
  const [compLead, setCompLead] = useState(false);

  // Document upload state
  const [docCategory, setDocCategory] = useState("Hotel Voucher");
  const [docFile, setDocFile] = useState<File | null>(null);

  // Activity note & pin state
  const [noteText, setNoteText] = useState("");
  const [pinText, setPinText] = useState("");

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(tripId)}`);
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.message || "Failed to load journey workspace.");
      } else {
        setData(json);
      }
    } catch {
      setErrorMsg("Network error loading journey workspace.");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const trip = data?.trip;
  const customer = data?.customer;
  const events: any[] = data?.events || [];
  const payments: any[] = data?.payments || [];
  const bookings: any[] = data?.bookings || [];
  const tripCompanions: any[] = data?.tripCompanions || [];
  const clientCompanions: any[] = data?.clientCompanions || [];
  const documents: any[] = data?.documents || [];
  const itineraries: any[] = data?.itineraries || [];

  const totalVerifiedPaid = payments
    .filter((p) => p.verification_status === "Verified")
    .reduce((s, p) => s + Number(p.amount_inr || 0), 0);
  const totalPendingPaid = payments
    .filter((p) => p.verification_status === "Pending Verification")
    .reduce((s, p) => s + Number(p.amount_inr || 0), 0);
  const quotePrice = Number(trip?.quote_price || 0);
  const balanceDue = Math.max(0, quotePrice - totalVerifiedPaid);

  const checklist: Record<string, boolean> = trip?.readiness_checklist || {
    stays_confirmed: false,
    transport_assigned: false,
    roster_verified: false,
    itinerary_exported: false,
    payment_settled: false,
    voucher_published: false,
  };
  const readinessCount = READINESS_ITEMS.filter((i) => Boolean(checklist[i.key])).length;

  async function handleCopyFolderSlug() {
    if (!trip || !customer) return;
    const slug = `${trip.deal_reference_id} | ${trip.destination} | ${customer.primary_name}`;
    try {
      await navigator.clipboard.writeText(slug);
      showToastMsg(`Copied: ${slug}`);
    } catch {
      showToastMsg(slug);
    }
  }

  async function handleCloneJourney() {
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        action: "clone",
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to clone journey.");
      return;
    }
    onRefreshDashboard();
    showToastMsg(json.message);
    if (json.clonedTripId) {
      onOpenTripInDrawer(json.clonedTripId);
    }
  }

  async function handleReassignOwner(nextOwnerId: string) {
    if (!trip) return;
    const res = await fetch("/api/portal/crm/trips", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        id: trip.id,
        leadOwnerId: nextOwnerId || null,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to reassign lead owner.");
      return;
    }
    showToastMsg("Lead owner reassigned.");
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleArchiveJourney() {
    if (!trip || !isAdminOrAbove) return;
    if (!confirm(`Archive ${trip.deal_reference_id}? It will be hidden from active CRM views.`)) return;
    const res = await fetch("/api/portal/crm/trips", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        id: trip.id,
        isArchived: true,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Archive failed.");
      return;
    }
    onRefreshDashboard();
    onClose();
  }

  async function handleToggleChecklist(key: string) {
    if (!trip) return;
    const nextChecklist = { ...checklist, [key]: !checklist[key] };
    const res = await fetch("/api/portal/crm/trips", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        id: trip.id,
        readinessChecklist: nextChecklist,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    if (res.ok) {
      loadWorkspace();
      onRefreshDashboard();
    }
  }

  async function handlePublishVoucher() {
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        action: "publish_voucher",
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to publish voucher.");
      return;
    }
    showToastMsg(json.message);
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleLogAmendment(e: React.FormEvent) {
    e.preventDefault();
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        action: "log_amendment",
        scopeSummary: amendSummary,
        quoteDelta: Number(amendQuoteDelta) || 0,
        costDelta: Number(amendCostDelta) || 0,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to log amendment.");
      return;
    }
    setShowAmendmentForm(false);
    setAmendSummary("");
    setAmendQuoteDelta("0");
    setAmendCostDelta("0");
    showToastMsg(json.message);
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        trancheLabel,
        amountInr: Number(payAmount),
        paymentMode: payMode,
        transactionRef: payRef,
        paymentDate: payDate,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to record payment.");
      return;
    }
    setPayAmount("");
    setPayRef("");
    showToastMsg(json.message);
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleVerifyPayment(paymentId: string, decision: "Verified" | "Rejected") {
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/payments`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        paymentId,
        decision,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to update payment status.");
      return;
    }
    showToastMsg(json.message);
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleAddBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        bookingType,
        clientFacingTitle: bookingTitle,
        internalVendorDmc: bookingVendor,
        confirmationRef: bookingRef,
        startDate: bookingStart || null,
        endDate: bookingEnd || null,
        bookingStatus,
        operationalNotes: bookingNotes,
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to add booking.");
      return;
    }
    setBookingTitle("");
    setBookingVendor("");
    setBookingRef("");
    setBookingNotes("");
    showToastMsg(json.message);
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleDeleteBooking(bookingId: string) {
    if (!trip) return;
    await fetch(
      `/api/portal/crm/trips/${encodeURIComponent(trip.id)}/bookings?bookingId=${encodeURIComponent(bookingId)}`,
      { method: "DELETE" }
    );
    showToastMsg("Booking item removed.");
    loadWorkspace();
    onRefreshDashboard();
  }

  async function handleLinkCompanion(companionId?: string) {
    if (!trip || !customer) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/companions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        companionId
          ? { companionId }
          : {
              customerId: customer.id,
              fullName: compName,
              relationship: compRel,
              isLeadTraveller: compLead,
              dietaryNotes: compDietary,
              mobilityNotes: compMobility,
            }
      ),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Failed to link co-traveller.");
      return;
    }
    setCompName("");
    setCompDietary("");
    setCompMobility("");
    setCompLead(false);
    showToastMsg(json.message);
    loadWorkspace();
  }

  async function handleUploadDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!trip || !docFile) return;
    const fd = new FormData();
    fd.append("file", docFile);
    fd.append("category", docCategory);
    fd.append("callerEmail", callerEmail);
    fd.append("callerName", callerName);
    fd.append("callerRole", callerRole);

    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/documents`, {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Document upload failed.");
      return;
    }
    setDocFile(null);
    showToastMsg(json.message);
    loadWorkspace();
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!trip || !noteText.trim()) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        action: "add_note",
        comment: noteText.trim(),
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    if (res.ok) {
      setNoteText("");
      showToastMsg("Note logged.");
      loadWorkspace();
    }
  }

  async function handleTogglePin(noteId?: string) {
    if (!trip) return;
    const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-staff-email": callerEmail,
        "x-staff-role": callerRole,
      },
      body: JSON.stringify({
        action: "toggle_pin_note",
        noteId,
        text: pinText.trim(),
        callerEmail,
        callerName,
        callerRole,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setErrorMsg(json.message || "Could not update pinned notes.");
      return;
    }
    setPinText("");
    loadWorkspace();
  }

  const whatsappHref = customer?.primary_mobile
    ? `https://wa.me/${customer.primary_mobile.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-full bg-white dark:bg-[#121215] border-l border-[#E2E8F0] dark:border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] space-y-3 shrink-0">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F5951C]/20 text-[#F5951C] border border-[#F5951C]/30">
                  {trip?.deal_reference_id || "..."}
                </span>
                {customer && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#0F172A] dark:text-white">
                    {customer.customer_code}
                  </span>
                )}
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                  {customer?.primary_name || "Loading..."}
                </span>
                {trip?.trip_scope && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
                    {trip.trip_scope}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#475569] dark:text-zinc-400">
                📍 {trip?.destination || "—"} • {trip?.travel_month || ""} {trip?.travel_year || ""} • {trip?.pax_adults || 1}A{trip?.pax_children > 0 ? `+${trip.pax_children}C` : ""}
                {destinationClock && (
                  <span className="text-[#0F172A] dark:text-zinc-200 font-medium">
                    {" "}• 🕒 {destinationClock}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/25"
                >
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={handleCopyFolderSlug}
                className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[11px] font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C]"
              >
                📋 Copy Slug
              </button>
              <button
                type="button"
                onClick={handleCloneJourney}
                className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[11px] font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C]"
              >
                🧬 Clone
              </button>
              {isAdminOrAbove && trip && (
                <button
                  type="button"
                  onClick={handleArchiveJourney}
                  className="px-2.5 py-1 rounded-lg border border-rose-500/30 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-xs font-bold text-[#475569] dark:text-zinc-300"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stage Stepper & Lead Owner */}
          {trip && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10 text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#475569] dark:text-zinc-400 mr-1">Stage:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F5951C]/20 text-[#F5951C] font-bold">
                  {trip.deal_stage}
                </span>
                {trip.deal_stage !== "Booked/Won" && trip.deal_stage !== "In Travel" && trip.deal_stage !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => setStageGateTarget("Booked/Won")}
                    className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    → Booked/Won
                  </button>
                )}
                {trip.deal_stage === "In Travel" && (
                  <button
                    type="button"
                    onClick={() => setStageGateTarget("Booked/Won")}
                    className="px-2 py-0.5 rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/10"
                  >
                    ← Revert to Booked/Won
                  </button>
                )}
                {trip.deal_stage !== "On Hold" && trip.deal_stage !== "Lost" && trip.deal_stage !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => setStageGateTarget("On Hold")}
                    className="px-2 py-0.5 rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold"
                  >
                    On Hold
                  </button>
                )}
                {trip.deal_stage !== "Lost" && trip.deal_stage !== "Booked/Won" && trip.deal_stage !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => setStageGateTarget("Lost")}
                    className="px-2 py-0.5 rounded-lg border border-rose-500/40 text-rose-700 dark:text-rose-300 font-semibold"
                  >
                    Mark Lost
                  </button>
                )}
                {(trip.deal_stage === "Booked/Won" || trip.deal_stage === "In Travel") && trip.trip_status !== "Complete" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStageGateTarget("Complete")}
                      className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold"
                    >
                      → Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageGateTarget("Cancelled")}
                      className="px-2 py-0.5 rounded-lg border border-rose-500/40 text-rose-700 dark:text-rose-300 font-semibold"
                    >
                      Cancel Trip
                    </button>
                  </>
                )}
                {(trip.deal_stage === "Lost" || trip.deal_stage === "On Hold") && isPrivilegeOrAbove && (
                  <button
                    type="button"
                    onClick={() => setStageGateTarget("In Progress")}
                    className="px-2 py-0.5 rounded-lg bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold"
                  >
                    ↻ Re-Open Deal
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#475569] dark:text-zinc-400">Owner:</span>
                <select
                  value={trip.lead_owner_id || ""}
                  onChange={(e) => handleReassignOwner(e.target.value)}
                  className="rounded-lg border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2 py-1 text-[11px] text-[#0F172A] dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {staffOptions.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pinned Handoff Notes Banner */}
          {Array.isArray(trip?.pinned_notes) && trip.pinned_notes.length > 0 && (
            <div className="space-y-1">
              {trip.pinned_notes.map((pn: any) => (
                <div
                  key={pn.id}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 flex justify-between items-center gap-2"
                >
                  <span>
                    📌 <strong>{pn.author}:</strong> {pn.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTogglePin(pn.id)}
                    className="text-[10px] underline shrink-0"
                  >
                    Unpin
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 6 Tabbed Panes */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {[
              { id: "overview", label: "Overview & Commercials" },
              { id: "itinerary", label: `Itinerary (${itineraries.length})` },
              { id: "bookings", label: `Stays & Transport (${bookings.length})` },
              { id: "payments", label: `Payments (${payments.length})` },
              { id: "travellers", label: `Travellers & Vault (${tripCompanions.length + documents.length})` },
              { id: "activity", label: `Activity Log (${events.length})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as DrawerTab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                  activeTab === t.id
                    ? "bg-[#F5951C] text-[#0F172A]"
                    : "bg-black/5 dark:bg-white/5 text-[#475569] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toast & Error */}
        {toast && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            ✓ {toast}
          </div>
        )}
        {errorMsg && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex justify-between items-center">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg(null)}>✕</button>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-5">
          {loading || !trip ? (
            <div className="p-6 sm:p-10 text-center text-[#475569] dark:text-zinc-400">
              Loading journey workspace...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & COMMERCIALS */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] uppercase text-[#64748B] dark:text-zinc-400 block">
                        Quote Price
                      </span>
                      <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
                        ₹{quotePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] uppercase text-[#64748B] dark:text-zinc-400 block">
                        Verified Collected
                      </span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{totalVerifiedPaid.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] uppercase text-[#64748B] dark:text-zinc-400 block">
                        Balance Due
                      </span>
                      <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                        ₹{balanceDue.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] uppercase text-[#64748B] dark:text-zinc-400 block">
                        Net Profit (F1)
                      </span>
                      <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
                        {isPrivilegeOrAbove
                          ? `₹${Number(trip.profit || 0).toLocaleString("en-IN")}`
                          : "Restricted"}
                      </span>
                    </div>
                  </div>

                  {/* Scope Amendment & Edit Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenEditModal({
                          ...trip,
                          dealReferenceId: trip.deal_reference_id,
                          dealChannel: trip.deal_channel,
                          customerId: trip.customer_id,
                          customerCode: customer?.customer_code || "—",
                          customerName: customer?.primary_name || "—",
                          leadOwnerId: trip.lead_owner_id,
                          leadOwnerName: "",
                          travelYear: trip.travel_year,
                          travelMonth: trip.travel_month || "—",
                          startDate: trip.start_date,
                          endDate: trip.end_date,
                          durationLabel: trip.duration_label || "—",
                          travelPartyType: trip.travel_party_type,
                          paxAdults: trip.pax_adults,
                          paxChildren: trip.pax_children,
                          dealStage: trip.deal_stage,
                          paymentStatus: trip.payment_status,
                          tripStatus: trip.trip_status,
                          bookedProperties: trip.booked_properties || "—",
                          bookedTransport: trip.booked_transport || "—",
                          quotePrice: Number(trip.quote_price || 0),
                          actualCost: isPrivilegeOrAbove ? Number(trip.actual_cost || 0) : null,
                          preTaxAmount: isPrivilegeOrAbove ? Number(trip.pre_tax_amount || 0) : null,
                          gstAmount: isPrivilegeOrAbove ? Number(trip.gst_amount || 0) : null,
                          profit: isPrivilegeOrAbove ? Number(trip.profit || 0) : null,
                          isFinancialRestricted: !isPrivilegeOrAbove,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 font-bold text-[#0F172A] dark:text-white hover:border-[#F5951C]"
                    >
                      ✏️ Full Edit Modal
                    </button>

                    {trip.deal_stage === "Booked/Won" && (
                      <button
                        type="button"
                        onClick={() => setShowAmendmentForm((v) => !v)}
                        className="px-3.5 py-2 rounded-xl bg-[#F5951C]/15 border border-[#F5951C]/30 font-bold text-[#F5951C]"
                      >
                        📝 Log Scope Amendment
                      </button>
                    )}
                  </div>

                  {showAmendmentForm && (
                    <form
                      onSubmit={handleLogAmendment}
                      className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#F5951C]/40 space-y-3"
                    >
                      <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                        Post-Booking Scope Amendment (Formula 1 Recalculation)
                      </h4>
                      <input
                        type="text"
                        placeholder="Scope change summary (e.g. +1 Night at Pahalgam, +1 Adult) *"
                        value={amendSummary}
                        onChange={(e) => setAmendSummary(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#64748B] dark:text-zinc-400">
                            +Quote Delta (₹)
                          </label>
                          <input
                            type="number"
                            value={amendQuoteDelta}
                            onChange={(e) => setAmendQuoteDelta(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#64748B] dark:text-zinc-400">
                            +Actual Cost Delta (₹)
                          </label>
                          <input
                            type="number"
                            value={amendCostDelta}
                            onChange={(e) => setAmendCostDelta(e.target.value)}
                            className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAmendmentForm(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] dark:border-white/15"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold"
                        >
                          {isPrivilegeOrAbove ? "Apply Amendment" : "Submit for Approval"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 6-Point Pre-Departure Readiness Checklist & Voucher Publisher (US-154-08) */}
                  {(trip.deal_stage === "Booked/Won" || trip.deal_stage === "In Travel") && (
                    <div className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                            6-Point Pre-Departure Readiness ({readinessCount}/6 Ready)
                          </h4>
                          <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                            {trip.voucher_published_at
                              ? `Voucher published ${new Date(trip.voucher_published_at).toLocaleDateString("en-IN")}`
                              : "Publish client-safe bookings into Active Vouchers Hub"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePublishVoucher}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                        >
                          🎫 Publish / Refresh Active Voucher
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {READINESS_ITEMS.map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/10 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(checklist[item.key])}
                              onChange={() => handleToggleChecklist(item.key)}
                              className="accent-[#F5951C] w-4 h-4"
                            />
                            <span
                              className={`font-semibold ${
                                checklist[item.key]
                                  ? "text-emerald-700 dark:text-emerald-300 line-through"
                                  : "text-[#0F172A] dark:text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancellation Summary if Cancelled */}
                  {trip.deal_stage === "Cancelled" && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 space-y-1">
                      <p className="font-bold">
                        Cancelled ({trip.cancellation_date || "—"}) — {trip.cancellation_reason}
                      </p>
                      <p>
                        Retained Fee: ₹{Number(trip.cancellation_fee || 0).toLocaleString("en-IN")} • Refund Due/Issued: ₹{Number(trip.refund_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ITINERARY & PROPOSALS */}
              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                      Linked Bespoke Itineraries (US-153-07)
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenItineraryTab();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold text-[11px]"
                    >
                      Open Itinerary Builder →
                    </button>
                  </div>
                  {itineraries.length === 0 ? (
                    <div className="p-5 sm:p-8 text-center rounded-xl border border-dashed border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-zinc-400">
                      No builder itinerary linked to {trip.deal_reference_id} yet. Open the Itinerary Builder or attach your already-shared &amp; accepted itinerary file below.
                    </div>
                  ) : (
                    itineraries.map((it) => (
                      <div
                        key={it.id}
                        className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-[#0F172A] dark:text-white">{it.title}</p>
                          <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                            {it.duration_days} Days • Version {it.current_version} • Status: {it.status}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenItineraryTab();
                          }}
                          className="px-3 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                    ))
                  )}

                  {/* Attach Shared / Accepted Itinerary Files */}
                  <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3">
                    <div>
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-[#0F172A] dark:text-white">
                        📎 Attached Shared / Accepted Itineraries
                      </h5>
                      <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                        Upload the final itinerary PDF/DOCX/image shared with and accepted by the guest. Auto-marks &ldquo;White-Label Itinerary Exported&rdquo; as Ready.
                      </p>
                    </div>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!trip || !docFile) return;
                        const fd = new FormData();
                        fd.append("file", docFile);
                        fd.append("category", "Accepted Itinerary");
                        fd.append("callerEmail", callerEmail);
                        fd.append("callerName", callerName);
                        fd.append("callerRole", callerRole);
                        const res = await fetch(`/api/portal/crm/trips/${encodeURIComponent(trip.id)}/documents`, {
                          method: "POST",
                          body: fd,
                        });
                        const json = await res.json();
                        if (!res.ok || !json.ok) {
                          setErrorMsg(json.message || "Failed to attach itinerary.");
                          return;
                        }
                        setDocFile(null);
                        showToastMsg(`Attached accepted itinerary: ${json.document?.file_name || "file"}`);
                        loadWorkspace();
                        onRefreshDashboard();
                      }}
                      className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                        className="text-xs text-[#0F172A] dark:text-white flex-1"
                        required
                      />
                      <button
                        type="submit"
                        disabled={!docFile}
                        className="px-3.5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold text-[11px] hover:bg-[#e08515] disabled:opacity-40"
                      >
                        Upload Itinerary
                      </button>
                    </form>
                    {documents.filter((d) => d.category === "Accepted Itinerary").length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {documents
                          .filter((d) => d.category === "Accepted Itinerary")
                          .map((d) => (
                            <div
                              key={d.id}
                              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/10"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-[#0F172A] dark:text-white truncate">
                                  📄 {d.file_name}
                                </p>
                                <p className="text-[10px] text-[#64748B] dark:text-zinc-400">
                                  Uploaded by {d.uploaded_by_name || "Staff"} •{" "}
                                  {new Date(d.created_at).toLocaleDateString("en-IN")}
                                </p>
                              </div>
                              {d.signedUrl && (
                                <a
                                  href={d.signedUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[11px] font-bold text-[#F5951C] hover:underline shrink-0"
                                >
                                  View / Download
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: STAYS, TRANSPORT & BOOKINGS (US-154-06) */}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleAddBooking}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3"
                  >
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                      + Add White-Labeled Booking Allocation
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <select
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      >
                        <option value="Stay">Stay</option>
                        <option value="Transport/Cab">Transport/Cab</option>
                        <option value="Activity/Experience">Activity/Experience</option>
                        <option value="Flight/Rail">Flight/Rail</option>
                        <option value="Visa/Insurance">Visa/Insurance</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Client-Facing Title (Voucher Safe) *"
                        value={bookingTitle}
                        onChange={(e) => setBookingTitle(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Internal DMC / Supplier (Masked)"
                        value={bookingVendor}
                        onChange={(e) => setBookingVendor(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        placeholder="Confirmation Ref"
                        value={bookingRef}
                        onChange={(e) => setBookingRef(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <input
                        type="date"
                        value={bookingStart}
                        onChange={(e) => setBookingStart(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <input
                        type="date"
                        value={bookingEnd}
                        onChange={(e) => setBookingEnd(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <select
                        value={bookingStatus}
                        onChange={(e) => setBookingStatus(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Requested">Requested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Internal operational notes (strictly excluded from client vouchers)"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="flex-1 rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex justify-between items-start gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                              {b.booking_type}
                            </span>
                            <span className="font-bold text-[#0F172A] dark:text-white">
                              {b.client_facing_title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              {b.booking_status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                            Ref: <strong>{b.confirmation_ref || "—"}</strong> • Dates: {b.start_date || "—"} to {b.end_date || "—"}
                          </p>
                          {b.internal_vendor_dmc && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-300">
                              🔒 Internal DMC/Vendor (Masked): {b.internal_vendor_dmc}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PAYMENTS & TRANCHES (US-154-05) */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-400 block">Verified Collected</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{totalVerifiedPaid.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-400 block">Pending Verification</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        ₹{totalPendingPaid.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-400 block">Balance Due</span>
                      <span className="font-mono font-bold text-[#0F172A] dark:text-white">
                        ₹{balanceDue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <form
                    onSubmit={handleRecordPayment}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-end"
                  >
                    <div>
                      <label className="text-[10px] text-[#64748B] dark:text-zinc-400">Tranche</label>
                      <input
                        type="text"
                        value={trancheLabel}
                        onChange={(e) => setTrancheLabel(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-2 text-[#0F172A] dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] dark:text-zinc-400">Amount (₹)</label>
                      <input
                        type="number"
                        min={1}
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-2 text-[#0F172A] dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] dark:text-zinc-400">Mode</label>
                      <select
                        value={payMode}
                        onChange={(e) => setPayMode(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-2 text-[#0F172A] dark:text-white"
                      >
                        <option value="UPI">UPI</option>
                        <option value="NEFT/IMPS">NEFT/IMPS</option>
                        <option value="Card">Card</option>
                        <option value="Payment Gateway">Payment Gateway</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] dark:text-zinc-400">Ref / UTR</label>
                      <input
                        type="text"
                        value={payRef}
                        onChange={(e) => setPayRef(e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-2 text-[#0F172A] dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold"
                    >
                      + Record
                    </button>
                  </form>

                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex justify-between items-center gap-3"
                      >
                        <div>
                          <p className="font-bold text-[#0F172A] dark:text-white">
                            {p.tranche_label} — ₹{Number(p.amount_inr).toLocaleString("en-IN")}
                          </p>
                          <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                            {p.payment_mode} • {p.payment_date} • Ref: {p.transaction_ref || "—"} • Logged by {p.recorded_by_name || "Staff"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.verification_status === "Verified"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : p.verification_status === "Rejected"
                                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {p.verification_status}
                          </span>
                          {isPrivilegeOrAbove && p.verification_status === "Pending Verification" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(p.id, "Verified")}
                                className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(p.id, "Rejected")}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TRAVELLERS & PRIVATE DOCUMENT VAULT (US-154-07) */}
              {activeTab === "travellers" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                      Co-Traveller Roster ({tripCompanions.length})
                    </h4>
                    {clientCompanions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {clientCompanions.map((cc) => {
                          const alreadyLinked = tripCompanions.some((tc) => tc.companion_id === cc.id);
                          return (
                            <button
                              key={cc.id}
                              type="button"
                              disabled={alreadyLinked}
                              onClick={() => handleLinkCompanion(cc.id)}
                              className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[#0F172A] dark:text-white text-[11px] disabled:opacity-50"
                            >
                              {alreadyLinked ? "✓ " : "+ Link "}
                              {cc.full_name} ({cc.relationship})
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="New Co-Traveller Name"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-[#0F172A] dark:text-white"
                      />
                      <select
                        value={compRel}
                        onChange={(e) => setCompRel(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-[#0F172A] dark:text-white"
                      >
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="friend">Friend</option>
                        <option value="colleague">Colleague</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Dietary notes"
                        value={compDietary}
                        onChange={(e) => setCompDietary(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-2.5 py-1.5 text-[#0F172A] dark:text-white"
                      />
                      <label className="flex items-center gap-1.5 text-[11px]">
                        <input
                          type="checkbox"
                          checked={compLead}
                          onChange={(e) => setCompLead(e.target.checked)}
                        />
                        Lead Traveller
                      </label>
                      <button
                        type="button"
                        onClick={() => handleLinkCompanion()}
                        className="px-3 py-1.5 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold"
                      >
                        + Add &amp; Link
                      </button>
                    </div>
                  </div>

                  {/* Private Document Vault */}
                  <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0F172A] dark:text-white">
                      Private Journey Document Vault (Staff-Only RLS)
                    </h4>
                    <form onSubmit={handleUploadDocument} className="flex flex-wrap gap-2 items-center">
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value)}
                        className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-1.5 text-[#0F172A] dark:text-white"
                      >
                        <option value="Hotel Voucher">Hotel Voucher</option>
                        <option value="Cab/Transfer">Cab/Transfer</option>
                        <option value="Tickets">Tickets</option>
                        <option value="Visa/Insurance">Visa/Insurance</option>
                        <option value="Client ID">Client ID</option>
                      </select>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                        className="text-[11px] text-[#475569] dark:text-zinc-300"
                        required
                      />
                      <button
                        type="submit"
                        disabled={!docFile}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold disabled:opacity-40"
                      >
                        Upload Document
                      </button>
                    </form>
                    <div className="space-y-1.5">
                      {documents.map((d) => (
                        <div
                          key={d.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/10 flex justify-between items-center"
                        >
                          <div>
                            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 text-[10px] font-bold mr-2">
                              {d.category}
                            </span>
                            <span className="font-semibold text-[#0F172A] dark:text-white">
                              {d.file_name}
                            </span>
                          </div>
                          {d.signedUrl && (
                            <a
                              href={d.signedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#F5951C] font-bold hover:underline"
                            >
                              Download ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: IMMUTABLE ACTIVITY LOG & PINNED NOTES (US-154-09) */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add chronological operational note..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="flex-1 rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold"
                      >
                        Log Note
                      </button>
                    </form>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Pin critical handoff alert to header (max 2)..."
                        value={pinText}
                        onChange={(e) => setPinText(e.target.value)}
                        className="flex-1 rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleTogglePin()}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold"
                      >
                        📌 Pin
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono font-bold text-[#F5951C]">
                            {ev.event_type}
                            {ev.reason_code ? ` (${ev.reason_code})` : ""}
                          </span>
                          <span className="text-[#64748B] dark:text-zinc-500">
                            {ev.actor_name || "System"} • {new Date(ev.created_at).toLocaleString("en-IN")}
                          </span>
                        </div>
                        {ev.comment && (
                          <p className="text-[#0F172A] dark:text-white">{ev.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {stageGateTarget && trip && (
        <StageGateModal
          trip={{
            id: trip.id,
            dealReferenceId: trip.deal_reference_id,
            customerName: customer?.primary_name || "Customer",
            dealStage: trip.deal_stage,
            quotePrice,
            startDate: trip.start_date,
            endDate: trip.end_date,
            travelMonth: trip.travel_month,
            nights: trip.nights,
            durationLabel: trip.duration_label,
            balanceDue,
          }}
          targetStage={stageGateTarget}
          callerEmail={callerEmail}
          callerName={callerName}
          callerRole={callerRole}
          onClose={() => setStageGateTarget(null)}
          onCompleted={(msg) => {
            setStageGateTarget(null);
            showToastMsg(msg);
            loadWorkspace();
            onRefreshDashboard();
          }}
        />
      )}
    </div>
  );
}
