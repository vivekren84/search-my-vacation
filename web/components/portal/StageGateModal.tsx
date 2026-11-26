"use client";

import { useState } from "react";

interface StageGateModalProps {
  trip: {
    id: string;
    dealReferenceId: string;
    customerName: string;
    dealStage: string;
    quotePrice: number;
    startDate?: string | null;
    endDate?: string | null;
    travelMonth?: string | null;
    nights?: number;
    durationLabel?: string | null;
    balanceDue?: number;
  };
  targetStage: "Booked/Won" | "On Hold" | "Lost" | "Cancelled" | "In Progress" | "Complete";
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
  onCompleted: (message: string) => void;
}

export function StageGateModal({
  trip,
  targetStage,
  callerEmail,
  callerName,
  callerRole,
  onClose,
  onCompleted,
}: StageGateModalProps) {
  const isReopen =
    (trip.dealStage === "Lost" || trip.dealStage === "On Hold") &&
    targetStage === "In Progress";

  const [holdReason, setHoldReason] = useState("Awaiting Dates");
  const [followUpDate, setFollowUpDate] = useState("");
  const [lossReason, setLossReason] = useState("Budget Mismatch");
  const [cancellationReason, setCancellationReason] = useState("Client Change of Mind");
  const [cancellationDate, setCancellationDate] = useState(new Date().toISOString().slice(0, 10));
  const [cancellationFee, setCancellationFee] = useState("0");
  const [refundAmount, setRefundAmount] = useState("0");
  const [reopenReason, setReopenReason] = useState("");
  const [notes, setNotes] = useState("");

  // Booked/Won gate overrides if missing
  const [quotePrice, setQuotePrice] = useState(String(trip.quotePrice || ""));
  const [startDate, setStartDate] = useState(trip.startDate || "");
  const [nights, setNights] = useState(String(trip.nights || 5));

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const payload: Record<string, any> = {
        id: trip.id,
        dealStage: targetStage === "Complete" ? "Booked/Won" : targetStage,
        callerEmail,
        callerName,
        callerRole,
      };

      if (targetStage === "Complete") {
        payload.tripStatus = "Complete";
      } else if (targetStage === "Booked/Won") {
        payload.quotePrice = Number(quotePrice) || 0;
        if (startDate) payload.startDate = startDate;
        payload.nights = Number(nights) || 0;
      } else if (targetStage === "On Hold") {
        payload.holdReason = holdReason;
        payload.followUpDate = followUpDate || null;
        payload.notes = notes.trim() || undefined;
      } else if (targetStage === "Lost") {
        payload.lossReason = lossReason;
        payload.notes = notes.trim() || undefined;
      } else if (targetStage === "Cancelled") {
        payload.cancellationReason = cancellationReason;
        payload.cancellationDate = cancellationDate;
        payload.cancellationFee = Number(cancellationFee) || 0;
        payload.refundAmount = Number(refundAmount) || 0;
        payload.notes = notes.trim() || undefined;
      } else if (isReopen) {
        if (!reopenReason.trim()) {
          setErrorMsg("Please provide a reason to re-open this deal.");
          setSubmitting(false);
          return;
        }
        payload.reopenReason = reopenReason.trim();
        payload.tripStatus = "To Start";
        payload.paymentStatus = "To Start";
      }

      const res = await fetch("/api/portal/crm/trips", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Stage transition blocked by governance gate.");
        return;
      }

      onCompleted(data.message || `${trip.dealReferenceId} moved to ${targetStage}.`);
    } catch {
      setErrorMsg("Network error while updating stage.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
              Stage Gate: {isReopen ? "Re-Open Deal" : `Move to ${targetStage}`}
            </h3>
            <p className="text-[11px] font-mono text-[#F5951C]">
              {trip.dealReferenceId} • {trip.customerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {targetStage === "Booked/Won" && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                Confirm commercial quote and travel window to unlock the 6-Point Readiness Checklist and Active Voucher shell.
              </p>
              <div>
                <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                  Confirmed Quote Price (₹) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                    Nights *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {targetStage === "On Hold" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                  Hold Reason *
                </label>
                <select
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                >
                  <option value="Awaiting Dates">Awaiting Dates</option>
                  <option value="Budget Review">Budget Review</option>
                  <option value="Visa/Flight Check">Visa/Flight Check</option>
                  <option value="Deferred Season">Deferred Season</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                  Follow-Up Reminder Date (Concierge Radar)
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Context for putting this journey on hold..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
          )}

          {targetStage === "Lost" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                  Loss Reason *
                </label>
                <select
                  value={lossReason}
                  onChange={(e) => setLossReason(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                >
                  <option value="Budget Mismatch">Budget Mismatch</option>
                  <option value="Chose Competitor">Chose Competitor</option>
                  <option value="Plan Dropped">Plan Dropped</option>
                  <option value="Unresponsive">Unresponsive</option>
                  <option value="Chose Alternate SMV Quote">Chose Alternate SMV Quote</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder="Loss notes for pipeline intelligence..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
          )}

          {targetStage === "Cancelled" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                  Cancellation Reason *
                </label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                >
                  <option value="Medical/Emergency">Medical/Emergency</option>
                  <option value="Visa Rejection">Visa Rejection</option>
                  <option value="Force Majeure">Force Majeure</option>
                  <option value="Client Change of Mind">Client Change of Mind</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                    Cancel Date
                  </label>
                  <input
                    type="date"
                    value={cancellationDate}
                    onChange={(e) => setCancellationDate(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2 py-1.5 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                    Retained Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cancellationFee}
                    onChange={(e) => setCancellationFee(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2 py-1.5 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-[#475569] dark:text-zinc-400">
                    Refund Due (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2 py-1.5 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Supplier retention & refund settlement notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              />
            </div>
          )}

          {targetStage === "Complete" && (
            <div className="space-y-2">
              {Number(trip.balanceDue || 0) > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold">
                  ⚠️ Warning: This journey still has ₹{Number(trip.balanceDue).toLocaleString("en-IN")} balance due. You can still mark it Complete, or settle the payment tranche first.
                </div>
              )}
              <p className="text-[#475569] dark:text-zinc-400">
                Mark {trip.dealReferenceId} as <strong>Complete</strong> (post-travel)?
              </p>
            </div>
          )}

          {isReopen && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                Re-opening preserves the original <strong>{trip.dealReferenceId}</strong> and logs a <code>STAGE_REOPENED</code> audit event.
              </p>
              <textarea
                rows={2}
                placeholder="Reason for re-opening this journey *"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                required
              />
            </div>
          )}

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
              className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Confirm Transition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
