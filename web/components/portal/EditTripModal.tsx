"use client";

import { useState } from "react";

export interface StaffOption {
  userId: string;
  displayName: string;
  role: string;
}

export interface EditableTrip {
  id: string;
  dealReferenceId: string;
  dealChannel: "DIRECT" | "VENDOR";
  customerId: string;
  customerCode: string;
  customerName: string;
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
}

interface EditTripModalProps {
  trip: EditableTrip;
  staffOptions: StaffOption[];
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/**
 * Formula 1 (PO Confirmed):
 * Gross Margin (incl. GST) = Quote - Actual Cost
 * GST (5% inside margin)   = Gross Margin - (Gross Margin / 1.05)
 * Net Profit (excl. GST)   = Gross Margin / 1.05
 * Pre-Tax Amount           = Quote - GST
 */
function computeFormula1Financials(quote: number, cost: number) {
  const grossMargin = quote - cost;
  if (grossMargin <= 0) {
    return {
      gstAmount: 0,
      profit: Math.round(grossMargin * 100) / 100,
      preTaxAmount: Math.round(quote * 100) / 100,
    };
  }
  const netProfit = grossMargin / 1.05;
  const gst = grossMargin - netProfit;
  const preTax = quote - gst;
  return {
    gstAmount: Math.round(gst * 100) / 100,
    profit: Math.round(netProfit * 100) / 100,
    preTaxAmount: Math.round(preTax * 100) / 100,
  };
}

export function EditTripModal({
  trip,
  staffOptions,
  callerEmail,
  callerName,
  callerRole,
  onClose,
  onSaved,
}: EditTripModalProps) {
  const isDeskUser =
    callerRole.toLowerCase() === "desk_user" &&
    callerEmail.toLowerCase() !== "vivek@searchmyvacation.com";
  const isSuperAdmin =
    callerRole.toLowerCase() === "super_admin" ||
    callerEmail.toLowerCase() === "vivek@searchmyvacation.com";

  const todayIso = new Date().toISOString().slice(0, 10);
  const isTripActiveNow =
    trip.tripStatus === "In Progress" ||
    (trip.dealStage === "Booked/Won" &&
      Boolean(trip.startDate) &&
      Boolean(trip.endDate) &&
      todayIso >= (trip.startDate || "") &&
      todayIso <= (trip.endDate || ""));
  const canEditDates = !isTripActiveNow || isSuperAdmin;

  const [destination, setDestination] = useState(trip.destination || "");
  const [travelYear, setTravelYear] = useState(String(trip.travelYear || new Date().getFullYear()));
  const [travelMonth, setTravelMonth] = useState(trip.travelMonth === "—" ? "" : trip.travelMonth || "");
  const [startDate, setStartDate] = useState(trip.startDate || "");
  const [endDate, setEndDate] = useState(trip.endDate || "");
  const [durationLabel, setDurationLabel] = useState(trip.durationLabel === "—" ? "" : trip.durationLabel || "");
  const [nights, setNights] = useState(String(trip.nights || 0));
  const [travelPartyType, setTravelPartyType] = useState(trip.travelPartyType || "Family");
  const [paxAdults, setPaxAdults] = useState(String(trip.paxAdults || 1));
  const [paxChildren, setPaxChildren] = useState(String(trip.paxChildren || 0));
  const [leadOwnerId, setLeadOwnerId] = useState(trip.leadOwnerId || "");

  const [dealStage, setDealStage] = useState(trip.dealStage || "Enquiry");
  const [paymentStatus, setPaymentStatus] = useState(trip.paymentStatus || "To Start");
  const [tripStatus, setTripStatus] = useState(trip.tripStatus || "To Start");

  const [bookedProperties, setBookedProperties] = useState(
    trip.bookedProperties === "—" ? "" : trip.bookedProperties || ""
  );
  const [bookedTransport, setBookedTransport] = useState(
    trip.bookedTransport === "—" ? "" : trip.bookedTransport || ""
  );
  const [notes, setNotes] = useState(trip.notes || "");

  const [quotePrice, setQuotePrice] = useState(String(trip.quotePrice || 0));
  const [actualCost, setActualCost] = useState(String(trip.actualCost ?? 0));
  const [preTaxAmount, setPreTaxAmount] = useState(String(trip.preTaxAmount ?? 0));
  const [gstAmount, setGstAmount] = useState(String(trip.gstAmount ?? 0));
  const [profit, setProfit] = useState(String(trip.profit ?? 0));
  const [autoCalcGst, setAutoCalcGst] = useState(true);
  const [financialJustification, setFinancialJustification] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleQuoteOrCostChange(nextQuoteStr: string, nextCostStr: string) {
    setQuotePrice(nextQuoteStr);
    setActualCost(nextCostStr);
    if (autoCalcGst) {
      const q = Number(nextQuoteStr) || 0;
      const c = Number(nextCostStr) || 0;
      const calc = computeFormula1Financials(q, c);
      setGstAmount(String(calc.gstAmount));
      setProfit(String(calc.profit));
      setPreTaxAmount(String(calc.preTaxAmount));
    }
  }

  function handleApplyFormula1Now() {
    const q = Number(quotePrice) || 0;
    const c = Number(actualCost) || 0;
    const calc = computeFormula1Financials(q, c);
    setGstAmount(String(calc.gstAmount));
    setProfit(String(calc.profit));
    setPreTaxAmount(String(calc.preTaxAmount));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/crm/trips", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify({
          id: trip.id,
          destination,
          travelYear: Number(travelYear) || trip.travelYear,
          travelMonth,
          startDate: canEditDates ? startDate || null : undefined,
          endDate: canEditDates ? endDate || null : undefined,
          durationLabel,
          nights: Number(nights) || 0,
          travelPartyType,
          paxAdults: Number(paxAdults) || 1,
          paxChildren: Number(paxChildren) || 0,
          leadOwnerId: leadOwnerId || null,
          dealStage,
          paymentStatus,
          tripStatus,
          bookedProperties,
          bookedTransport,
          notes,
          quotePrice: Number(quotePrice) || 0,
          actualCost: Number(actualCost) || 0,
          preTaxAmount: Number(preTaxAmount) || 0,
          gstAmount: Number(gstAmount) || 0,
          profit: Number(profit) || 0,
          financialJustification: isDeskUser ? financialJustification : undefined,
          callerEmail,
          callerName,
          callerRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to update trip deal.");
        setSaving(false);
        return;
      }

      onSaved(data.message || `Trip ${trip.dealReferenceId} updated.`);
    } catch (err: any) {
      setError(err?.message || "Network error while updating trip.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none";
  const labelClass = "block text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-3xl w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-[#E2E8F0] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30">
                {trip.dealReferenceId}
              </span>
              <span className="font-mono text-[11px] text-[#475569] dark:text-zinc-400">
                {trip.customerName} ({trip.customerCode})
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-1.5">
              Edit Journey & Financials
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* 1. Journey & Party */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
              1. Journey & Party Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Destination <span className="text-[#F5951C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Lead Owner</label>
                <select
                  value={leadOwnerId}
                  onChange={(e) => setLeadOwnerId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Unassigned</option>
                  {staffOptions.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.displayName} ({s.role.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Travel Month</label>
                <input
                  type="text"
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  placeholder="e.g. Dec"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Travel Year</label>
                <input
                  type="number"
                  value={travelYear}
                  onChange={(e) => setTravelYear(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Duration Label</label>
                <input
                  type="text"
                  value={durationLabel}
                  onChange={(e) => setDurationLabel(e.target.value)}
                  placeholder="e.g. 6N/7D"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nights</label>
                <input
                  type="number"
                  min={0}
                  value={nights}
                  onChange={(e) => setNights(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#0F172A] dark:text-white/80">
                    Start Date (Drives In-Travel Stage)
                  </label>
                  {!canEditDates && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      🔒 Super Admin Only (Trip Active)
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={startDate}
                  disabled={!canEditDates}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#0F172A] dark:text-white/80">
                    End Date
                  </label>
                  {!canEditDates && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      🔒 Locked
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={endDate}
                  disabled={!canEditDates}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Party Type</label>
                <select
                  value={travelPartyType}
                  onChange={(e) => setTravelPartyType(e.target.value)}
                  className={inputClass}
                >
                  <option value="Family">Family</option>
                  <option value="Solo">Solo</option>
                  <option value="Group">Group</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Adults</label>
                <input
                  type="number"
                  min={1}
                  value={paxAdults}
                  onChange={(e) => setPaxAdults(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Children</label>
                <input
                  type="number"
                  min={0}
                  value={paxChildren}
                  onChange={(e) => setPaxChildren(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 2. Status Pipeline */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
              2. Operational Status Pipeline (Syncs Kanban & Vouchers)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Deal Stage</label>
                <select
                  value={dealStage}
                  onChange={(e) => setDealStage(e.target.value)}
                  className={inputClass}
                >
                  <option value="Enquiry">Enquiry</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Booked/Won">Booked/Won</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="To Start">To Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Won">Won</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Trip Status</label>
                <select
                  value={tripStatus}
                  onChange={(e) => setTripStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="To Start">To Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Financials (Formula 1: 5% GST inside margin) */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
                  3. Commercials & 5% Margin-Inclusive GST (Formula 1)
                </h4>
                <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                  Margin = Quote − Cost • GST (5% inside margin) = Margin − (Margin ÷ 1.05) • Net Profit = Margin ÷ 1.05
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0F172A] dark:text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCalcGst}
                    onChange={(e) => setAutoCalcGst(e.target.checked)}
                    className="rounded text-[#F5951C] focus:ring-[#F5951C]"
                  />
                  Auto-calc GST & Profit
                </label>
                <button
                  type="button"
                  onClick={handleApplyFormula1Now}
                  className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[10px] font-bold uppercase tracking-wider text-[#F5951C] hover:bg-[#F5951C]/10 transition"
                >
                  Recalculate
                </button>
              </div>
            </div>

            {isDeskUser && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px]">
                <strong>Approval Workflow:</strong> As a Desk User, any financial changes you submit will be routed to the Privilege User / Administrator approval queue for single-concurrence review before going live.
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className={labelClass}>Client Quote (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={quotePrice}
                  onChange={(e) => handleQuoteOrCostChange(e.target.value, actualCost)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Actual Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={actualCost}
                  onChange={(e) => handleQuoteOrCostChange(quotePrice, e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Pre-Tax (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={preTaxAmount}
                  onChange={(e) => setPreTaxAmount(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>GST 5% (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Net Profit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={profit}
                  onChange={(e) => setProfit(e.target.value)}
                  className={`${inputClass} font-mono font-bold text-emerald-700 dark:text-emerald-400`}
                />
              </div>
            </div>

            {isDeskUser && (
              <div>
                <label className={labelClass}>Financial Change Justification (For Reviewer)</label>
                <input
                  type="text"
                  value={financialJustification}
                  onChange={(e) => setFinancialJustification(e.target.value)}
                  placeholder="e.g. Updated vendor net rates from Kumarakom property & airport transfer quote"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* 4. Fulfilment & Notes */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5951C]">
              4. Fulfilment Logistics & Notes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Booked Properties</label>
                <textarea
                  rows={2}
                  value={bookedProperties}
                  onChange={(e) => setBookedProperties(e.target.value)}
                  placeholder="e.g. Niraamaya Retreats Kumarakom (2N), Spice Village Thekkady (2N)"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Booked Transport</label>
                <textarea
                  rows={2}
                  value={bookedTransport}
                  onChange={(e) => setBookedTransport(e.target.value)}
                  placeholder="e.g. Private Innova Crysta (COK-COK) with vetted chauffeur"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Advisor Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests, dietary notes, or voucher reminders..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/20 text-xs font-semibold text-[#475569] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50 shadow-md"
            >
              {saving ? "Saving..." : "💾 Save Journey Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
