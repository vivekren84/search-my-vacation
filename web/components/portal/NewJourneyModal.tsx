"use client";

import { useEffect, useMemo, useState } from "react";
import { StaffOption } from "./EditTripModal";
import { DestinationAutocomplete } from "./DestinationAutocomplete";

export interface CustomerLookupOption {
  id: string;
  customerCode: string;
  primaryName: string;
  primaryMobile?: string | null;
  primaryEmail?: string | null;
}

interface NewJourneyModalProps {
  customers: CustomerLookupOption[];
  staffOptions: StaffOption[];
  preselectedCustomer?: CustomerLookupOption | null;
  defaultLeadOwnerId?: string | null;
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
  onCreated: (result: { tripId: string; dealReferenceId: string; message: string }) => void;
}

export function NewJourneyModal({
  customers,
  staffOptions,
  preselectedCustomer = null,
  defaultLeadOwnerId = "",
  callerEmail,
  callerName,
  callerRole,
  onClose,
  onCreated,
}: NewJourneyModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLookupOption | null>(
    preselectedCustomer
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Quick-Create Customer fields
  const [newCustName, setNewCustName] = useState("");
  const [newCustMobile, setNewCustMobile] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [duplicatePrompt, setDuplicatePrompt] = useState<{
    id: string;
    customerCode: string;
    primaryName: string;
  } | null>(null);

  // Journey Intake fields
  const [dealChannel, setDealChannel] = useState<"DIRECT" | "VENDOR">("DIRECT");
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/portal/crm/trips/preview-id?channel=${dealChannel}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.previewId) setPreviewId(d.previewId);
      })
      .catch(() => {});
  }, [dealChannel]);
  const [tripScope, setTripScope] = useState<"Domestic" | "International">("Domestic");
  const [destination, setDestination] = useState("");
  const [windowMode, setWindowMode] = useState<"exact" | "tentative">("exact");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelYear, setTravelYear] = useState(String(new Date().getFullYear()));
  const [travelMonth, setTravelMonth] = useState("");
  const [nights, setNights] = useState("5");
  const [durationLabel, setDurationLabel] = useState("");
  const [travelPartyType, setTravelPartyType] = useState("Family");
  const [paxAdults, setPaxAdults] = useState("2");
  const [paxChildren, setPaxChildren] = useState("0");
  const [leadSource, setLeadSource] = useState("Referral");
  const [leadOwnerId, setLeadOwnerId] = useState(defaultLeadOwnerId || "");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return customers.slice(0, 8);
    return customers
      .filter(
        (c) =>
          c.primaryName.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          (c.primaryMobile && c.primaryMobile.includes(q))
      )
      .slice(0, 10);
  }, [customers, customerSearch]);

  function handleDateChange(nextStart: string, nextEnd: string) {
    setStartDate(nextStart);
    setEndDate(nextEnd);
    if (nextStart) {
      setTravelYear(nextStart.slice(0, 4));
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const mIdx = Number(nextStart.slice(5, 7)) - 1;
      if (mIdx >= 0 && mIdx < 12) setTravelMonth(monthNames[mIdx]);
    }
    if (nextStart && nextEnd) {
      const d1 = new Date(nextStart);
      const d2 = new Date(nextEnd);
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setNights(String(diffDays));
        setDurationLabel(`${diffDays}N/${diffDays + 1}D`);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setDuplicatePrompt(null);

    if (!selectedCustomer && !showQuickCreate) {
      setErrorMsg("Please select an existing customer or click '+ Quick-Create Customer'.");
      return;
    }
    if (!destination.trim()) {
      setErrorMsg("Destination is required.");
      return;
    }
    if (!selectedCustomer && showQuickCreate && (!newCustName.trim() || !newCustMobile.trim())) {
      setErrorMsg("New customer name and mobile number are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/crm/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify({
          customerId: selectedCustomer ? selectedCustomer.id : undefined,
          primaryName: selectedCustomer ? undefined : newCustName.trim(),
          primaryMobile: selectedCustomer ? undefined : newCustMobile.trim(),
          primaryEmail: selectedCustomer ? undefined : newCustEmail.trim() || undefined,
          dealChannel,
          tripScope,
          destination: destination.trim(),
          travelYear: Number(travelYear) || new Date().getFullYear(),
          travelMonth: travelMonth.trim() || undefined,
          startDate: windowMode === "exact" && startDate ? startDate : undefined,
          endDate: windowMode === "exact" && endDate ? endDate : undefined,
          nights: Number(nights) || 0,
          durationLabel: durationLabel.trim() || (nights ? `${nights}N/${Number(nights) + 1}D` : undefined),
          travelPartyType,
          paxAdults: Number(paxAdults) || 1,
          paxChildren: Number(paxChildren) || 0,
          leadSource,
          leadOwnerId: leadOwnerId || undefined,
          notes: notes.trim() || undefined,
          callerEmail,
          callerName,
          callerRole,
        }),
      });

      const data = await res.json();
      if (res.status === 409 && data.duplicateCustomer) {
        setDuplicatePrompt(data.duplicateCustomer);
        setErrorMsg(data.message);
        return;
      }
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Failed to initiate journey.");
        return;
      }

      onCreated({
        tripId: data.tripId,
        dealReferenceId: data.dealReferenceId,
        message: data.message,
      });
    } catch {
      setErrorMsg("Network error while creating journey.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-white/10 flex justify-between items-center bg-[#F8FAFC] dark:bg-[#09090B]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2 flex-wrap">
              <span>🧭</span> Initiate New Journey
              {previewId && (
                <span className="px-2 py-0.5 rounded-full bg-[#F5951C]/15 border border-[#F5951C]/40 font-mono text-[11px] text-[#F5951C]">
                  Next ID: {previewId}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
              Auto-sequences DDSMV / VDSMV Deal ID and links to Customer Master (CUST-XXXXX)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-2">
              <p className="font-semibold">{errorMsg}</p>
              {duplicatePrompt && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer({
                      id: duplicatePrompt.id,
                      customerCode: duplicatePrompt.customerCode,
                      primaryName: duplicatePrompt.primaryName,
                    });
                    setShowQuickCreate(false);
                    setDuplicatePrompt(null);
                    setErrorMsg(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#F5951C] text-[#0F172A] font-bold text-[11px]"
                >
                  Link to {duplicatePrompt.primaryName} ({duplicatePrompt.customerCode})
                </button>
              )}
            </div>
          )}

          {/* 1. Customer Selection / Quick-Create */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                1. Customer Master Link *
              </label>
              {!preselectedCustomer && !selectedCustomer && (
                <button
                  type="button"
                  onClick={() => setShowQuickCreate((v) => !v)}
                  className="text-[11px] font-bold text-[#F5951C] hover:underline"
                >
                  {showQuickCreate ? "← Search Existing Customer" : "+ Quick-Create Customer"}
                </button>
              )}
            </div>

            {selectedCustomer ? (
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 mr-2">
                    {selectedCustomer.customerCode}
                  </span>
                  <span className="font-bold text-[#0F172A] dark:text-white">
                    {selectedCustomer.primaryName}
                  </span>
                  {selectedCustomer.primaryMobile && (
                    <span className="text-[#475569] dark:text-zinc-400 ml-2">
                      • {selectedCustomer.primaryMobile}
                    </span>
                  )}
                </div>
                {!preselectedCustomer && (
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="text-[11px] text-[#475569] dark:text-zinc-400 hover:text-rose-500 font-semibold"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : showQuickCreate ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile (+91...) *"
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search by customer name, mobile, or CUST-XXXXX..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#121215] px-3 py-2 text-[#0F172A] dark:text-white"
                />
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCustomer(c)}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#F5951C]/15 flex justify-between items-center text-[#0F172A] dark:text-white transition"
                    >
                      <span>
                        <strong className="font-mono text-[#F5951C] mr-2">{c.customerCode}</strong>
                        {c.primaryName}
                      </span>
                      <span className="text-[11px] text-[#64748B] dark:text-zinc-400 font-mono">
                        {c.primaryMobile || "No mobile"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Channel, Scope & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Deal Channel
              </label>
              <select
                value={dealChannel}
                onChange={(e) => setDealChannel(e.target.value as "DIRECT" | "VENDOR")}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              >
                <option value="DIRECT">Direct Deal (DDSMV)</option>
                <option value="VENDOR">Vendor / Partner (VDSMV)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Trip Scope
              </label>
              <select
                value={tripScope}
                onChange={(e) => setTripScope(e.target.value as "Domestic" | "International")}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Destination(s) *
              </label>
              <DestinationAutocomplete
                value={destination}
                onChange={setDestination}
                placeholder="e.g. Kashmir, Sri Lanka, Dharamshala"
                required
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
          </div>

          {/* 3. Travel Window */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-[#475569] dark:text-zinc-400">
                Travel Window
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setWindowMode("exact")}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    windowMode === "exact"
                      ? "bg-[#F5951C] text-[#0F172A]"
                      : "bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-zinc-400"
                  }`}
                >
                  Exact Dates
                </button>
                <button
                  type="button"
                  onClick={() => setWindowMode("tentative")}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    windowMode === "tentative"
                      ? "bg-[#F5951C] text-[#0F172A]"
                      : "bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-zinc-400"
                  }`}
                >
                  Tentative Month
                </button>
              </div>
            </div>

            {windowMode === "exact" ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-500">Start Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e.target.value, endDate)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-500">End Date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(startDate, e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-500">Nights</span>
                  <input
                    type="number"
                    min={0}
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-500">Duration Label</span>
                  <input
                    type="text"
                    placeholder="6N/7D"
                    value={durationLabel}
                    onChange={(e) => setDurationLabel(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Month (e.g. Oct)"
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={travelYear}
                  onChange={(e) => setTravelYear(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Nights"
                  value={nights}
                  onChange={(e) => setNights(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
              </div>
            )}
          </div>

          {/* 4. Party, Pax, Source, Owner */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Party Type
              </label>
              <select
                value={travelPartyType}
                onChange={(e) => setTravelPartyType(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-2 text-[#0F172A] dark:text-white"
              >
                <option value="Family">Family</option>
                <option value="Solo">Solo</option>
                <option value="Group">Group</option>
                <option value="Corporate">Corporate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Adults
              </label>
              <input
                type="number"
                min={1}
                value={paxAdults}
                onChange={(e) => setPaxAdults(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Children
              </label>
              <input
                type="number"
                min={0}
                value={paxChildren}
                onChange={(e) => setPaxChildren(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Lead Source
              </label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-2 text-[#0F172A] dark:text-white"
              >
                <option value="Referral">Referral</option>
                <option value="Instagram">Instagram</option>
                <option value="Repeat Client">Repeat Client</option>
                <option value="Website">Website</option>
                <option value="Partner">Partner</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
                Lead Owner
              </label>
              <select
                value={leadOwnerId}
                onChange={(e) => setLeadOwnerId(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-2 text-[#0F172A] dark:text-white"
              >
                <option value="">Auto / Self</option>
                {staffOptions.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#475569] dark:text-zinc-400 mb-1">
              Curated Intake Notes
            </label>
            <textarea
              rows={2}
              placeholder="Slow-travel preferences, pace, special occasions, or handoff context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Journey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
