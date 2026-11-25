"use client";

import { useEffect, useState } from "react";

interface SegmentDraft {
  segmentType: "hotel" | "transfer" | "activity" | "guide" | "dining" | "aviation";
  title: string;
  description: string;
  vendorName: string;
  netCost: number;
  markupPercent: number;
  taxPercent: number;
}

interface DayDraft {
  dayNumber: number;
  title: string;
  destination: string;
  notes: string;
  segments: SegmentDraft[];
}

interface PersistedItinerary {
  id: string;
  clientId: string;
  customerCode: string;
  customerName: string;
  tripId: string | null;
  dealReferenceId: string | null;
  title: string;
  circuitSummary: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  currency: string;
  status: "draft" | "proposal_sent" | "confirmed" | "archived";
  currentVersion: string;
  days: Array<{
    id: string;
    dayNumber: number;
    title: string;
    destination: string;
    notes: string;
    segments: Array<{
      id: string;
      segmentType: SegmentDraft["segmentType"];
      title: string;
      description: string;
      vendorName: string;
      netCost: number;
      markupPercent: number;
      markupAmount: number;
      taxPercent: number;
      taxAmount: number;
      sellingPrice: number;
    }>;
  }>;
  proposals: Array<{
    id: string;
    version_label: string;
    gross_selling_price: number;
    created_at: string;
  }>;
  pricing: {
    totalNetCost: number;
    totalMarkupAmount: number;
    totalTaxAmount: number;
    grossSellingPrice: number;
    marginPercent: number;
  };
}

interface ItineraryBuilderPanelProps {
  customers: Array<{ id: string; customerCode: string; primaryName: string }>;
  trips: Array<{ id: string; dealReferenceId: string; customerId: string; destination: string }>;
  importedClaudeText?: string | null;
  onClearImportedClaude?: () => void;
}

function calcSegmentTotals(seg: SegmentDraft) {
  const net = Number(seg.netCost) || 0;
  const markupPct = Number(seg.markupPercent) || 0;
  const taxPct = Number(seg.taxPercent) || 0;
  const markupAmount = Math.round(net * (markupPct / 100) * 100) / 100;
  const taxAmount =
    taxPct > 0
      ? Math.round((markupAmount - markupAmount / (1 + taxPct / 100)) * 100) / 100
      : 0;
  const sellingPrice = Math.round((net + markupAmount) * 100) / 100;
  return { markupAmount, taxAmount, sellingPrice };
}

function parseClaudeDays(rawText: string): DayDraft[] {
  const lines = rawText.split("\n");
  const days: DayDraft[] = [];
  let current: DayDraft | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const dayMatch = trimmed.match(/^Day\s+(\d+)\s*:\s*(.+)$/i);
    if (dayMatch) {
      if (current) days.push(current);
      current = {
        dayNumber: Number(dayMatch[1]),
        title: dayMatch[2].trim(),
        destination: dayMatch[2].split(" ")[0] || "Bespoke Circuit",
        notes: "",
        segments: [],
      };
    } else if (current && trimmed.startsWith("-")) {
      const itemText = trimmed.replace(/^-\s*/, "").trim();
      if (itemText) {
        current.segments.push({
          segmentType: itemText.toLowerCase().includes("check-in") || itemText.toLowerCase().includes("suite")
            ? "hotel"
            : itemText.toLowerCase().includes("transfer") || itemText.toLowerCase().includes("drive")
            ? "transfer"
            : "activity",
          title: itemText,
          description: "",
          vendorName: "",
          netCost: 0,
          markupPercent: 18,
          taxPercent: 5,
        });
      }
    }
  }
  if (current) days.push(current);
  return days;
}

export function ItineraryBuilderPanel({
  customers,
  trips,
  importedClaudeText,
  onClearImportedClaude,
}: ItineraryBuilderPanelProps) {
  const [itineraries, setItineraries] = useState<PersistedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // Editor state for selected itinerary
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<PersistedItinerary["status"]>("draft");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editTripId, setEditTripId] = useState("");
  const [editDays, setEditDays] = useState<DayDraft[]>([]);

  // New itinerary form state
  const [newClientId, setNewClientId] = useState("");
  const [newTripId, setNewTripId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [whiteLabelPreview, setWhiteLabelPreview] = useState<any | null>(null);

  async function loadItineraries(preferId?: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/itineraries");
      const data = await res.json();
      if (data?.ok && Array.isArray(data.itineraries)) {
        setItineraries(data.itineraries);
        const target =
          (preferId && data.itineraries.find((i: PersistedItinerary) => i.id === preferId)) ||
          data.itineraries[0] ||
          null;
        if (target) {
          selectItinerary(target);
        } else {
          setSelectedId(null);
        }
      }
    } catch {
      setError("Failed to load persisted itineraries.");
    } finally {
      setLoading(false);
    }
  }

  function selectItinerary(it: PersistedItinerary) {
    setSelectedId(it.id);
    setEditTitle(it.title);
    setEditStatus(it.status);
    setEditStartDate(it.startDate || "");
    setEditEndDate(it.endDate || "");
    setEditTripId(it.tripId || "");
    setEditDays(
      it.days.map((d) => ({
        dayNumber: d.dayNumber,
        title: d.title,
        destination: d.destination,
        notes: d.notes || "",
        segments: d.segments.map((s) => ({
          segmentType: s.segmentType,
          title: s.title,
          description: s.description || "",
          vendorName: s.vendorName || "",
          netCost: s.netCost,
          markupPercent: s.markupPercent,
          taxPercent: s.taxPercent,
        })),
      }))
    );
  }

  useEffect(() => {
    loadItineraries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply Claude Studio import into active editor or open new form
  useEffect(() => {
    if (!importedClaudeText) return;
    const parsedDays = parseClaudeDays(importedClaudeText);
    if (parsedDays.length > 0 && selectedId) {
      setEditDays(parsedDays);
      setNotice(`Imported ${parsedDays.length} days from Claude Studio. Click "Save Itinerary" to persist to database.`);
    } else if (parsedDays.length > 0) {
      setShowNewForm(true);
    }
  }, [importedClaudeText, selectedId]);

  const selectedItinerary = itineraries.find((i) => i.id === selectedId) || null;

  // Live commercial rollup from editDays
  const livePricing = editDays.reduce(
    (acc, d) => {
      for (const s of d.segments) {
        const t = calcSegmentTotals(s);
        acc.totalNetCost += Number(s.netCost) || 0;
        acc.totalMarkupAmount += t.markupAmount;
        acc.totalTaxAmount += t.taxAmount;
        acc.grossSellingPrice += t.sellingPrice;
      }
      return acc;
    },
    { totalNetCost: 0, totalMarkupAmount: 0, totalTaxAmount: 0, grossSellingPrice: 0 }
  );

  const liveMarginPct =
    livePricing.grossSellingPrice > 0
      ? Math.round((livePricing.totalMarkupAmount / livePricing.grossSellingPrice) * 1000) / 10
      : 0;

  async function handleCreateItinerary(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientId || !newTitle.trim()) {
      setError("Please select a customer and enter an itinerary title.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const initialDays: DayDraft[] = importedClaudeText
        ? parseClaudeDays(importedClaudeText)
        : [
            {
              dayNumber: 1,
              title: "Arrival & Bespoke Welcome",
              destination: "Arrival City",
              notes: "",
              segments: [
                {
                  segmentType: "transfer",
                  title: "Private Chauffeur Airport Escort",
                  description: "",
                  vendorName: "",
                  netCost: 4500,
                  markupPercent: 20,
                  taxPercent: 5,
                },
              ],
            },
          ];

      const res = await fetch("/api/portal/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: newClientId,
          tripId: newTripId || null,
          title: newTitle.trim(),
          startDate: newStartDate || null,
          endDate: newEndDate || null,
          durationDays: initialDays.length,
          days: initialDays,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to create itinerary.");
        return;
      }
      setShowNewForm(false);
      setNewTitle("");
      setNewClientId("");
      setNewTripId("");
      onClearImportedClaude?.();
      setNotice(data.message || "Itinerary created and saved.");
      await loadItineraries(data.itineraryId);
    } catch (err: any) {
      setError(err?.message || "Network error creating itinerary.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveChanges() {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/itineraries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          title: editTitle,
          status: editStatus,
          startDate: editStartDate || null,
          endDate: editEndDate || null,
          durationDays: Math.max(1, editDays.length),
          tripId: editTripId || null,
          days: editDays,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to save itinerary.");
        return;
      }
      onClearImportedClaude?.();
      setNotice("Itinerary schedule & pricing saved to Supabase.");
      await loadItineraries(selectedId);
    } catch (err: any) {
      setError(err?.message || "Network error saving itinerary.");
    } finally {
      setSaving(false);
    }
  }

  async function handleExportProposal() {
    if (!selectedId) return;
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/itineraries/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itineraryId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to export proposal.");
        return;
      }
      setWhiteLabelPreview({
        versionLabel: data.versionLabel,
        snapshot: data.whiteLabelSnapshot,
      });
      setNotice(data.message || `Exported ${data.versionLabel}`);
      await loadItineraries(selectedId);
    } catch (err: any) {
      setError(err?.message || "Network error exporting proposal.");
    } finally {
      setExporting(false);
    }
  }

  function addDay() {
    setEditDays((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: `Day ${prev.length + 1} Curated Experience`,
        destination: prev[prev.length - 1]?.destination || "Circuit",
        notes: "",
        segments: [],
      },
    ]);
  }

  function removeDay(idx: number) {
    setEditDays((prev) =>
      prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function addSegment(dayIdx: number) {
    setEditDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              segments: [
                ...d.segments,
                {
                  segmentType: "hotel",
                  title: "Boutique Stay / Experience",
                  description: "",
                  vendorName: "",
                  netCost: 0,
                  markupPercent: 18,
                  taxPercent: 5,
                },
              ],
            }
          : d
      )
    );
  }

  function updateSegment(dayIdx: number, segIdx: number, field: keyof SegmentDraft, val: any) {
    setEditDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              segments: d.segments.map((s, si) =>
                si === segIdx ? { ...s, [field]: val } : s
              ),
            }
          : d
      )
    );
  }

  function removeSegment(dayIdx: number, segIdx: number) {
    setEditDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, segments: d.segments.filter((_, si) => si !== segIdx) } : d
      )
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none";

  return (
    <div className="space-y-4">
      {notice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex justify-between items-center">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="hover:opacity-75">✕</button>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Selector & New Itinerary Toolbar */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
            Saved Itineraries ({itineraries.length}):
          </span>
          {itineraries.length > 0 ? (
            <select
              value={selectedId || ""}
              onChange={(e) => {
                const found = itineraries.find((it) => it.id === e.target.value);
                if (found) selectItinerary(found);
              }}
              className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none max-w-md"
            >
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.title} — {it.customerName} ({it.currentVersion})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-[#64748B] dark:text-zinc-500">
              {loading ? "Loading..." : "No persisted itineraries yet"}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowNewForm((prev) => !prev)}
          className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition shadow-sm"
        >
          {showNewForm ? "Close New Form" : "➕ New Persisted Itinerary"}
        </button>
      </div>

      {/* Create New Persisted Itinerary Form */}
      {showNewForm && (
        <form
          onSubmit={handleCreateItinerary}
          className="rounded-2xl border border-[#F5951C]/40 bg-white dark:bg-[#121215] p-5 space-y-4 shadow-sm text-xs"
        >
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
            Create New Database-Persisted Itinerary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Customer Master <span className="text-[#F5951C]">*</span>
              </label>
              <select
                required
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.primaryName} ({c.customerCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Link to Trip Deal (Optional)
              </label>
              <select
                value={newTripId}
                onChange={(e) => setNewTripId(e.target.value)}
                className={inputClass}
              >
                <option value="">No linked trip</option>
                {trips
                  .filter((t) => !newClientId || t.customerId === newClientId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.dealReferenceId} — {t.destination}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Itinerary Title <span className="text-[#F5951C]">*</span>
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 6-Day Kerala Backwater Serenity"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50"
            >
              {saving ? "Creating..." : "💾 Create & Save Itinerary"}
            </button>
          </div>
        </form>
      )}

      {/* Selected Persisted Itinerary Editor */}
      {selectedItinerary && (
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 space-y-5 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30">
                  {selectedItinerary.customerName} ({selectedItinerary.customerCode})
                </span>
                {selectedItinerary.dealReferenceId && (
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    {selectedItinerary.dealReferenceId}
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#475569] dark:text-zinc-400">
                  Version: {selectedItinerary.currentVersion}
                </span>
              </div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-base font-bold text-[#0F172A] dark:text-white bg-transparent border-b border-transparent focus:border-[#F5951C] focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="confirmed">Confirmed</option>
                <option value="archived">Archived</option>
              </select>
              <span
                className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                  liveMarginPct >= 12
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                }`}
              >
                {liveMarginPct >= 12 ? "🟢" : "🟡"} Margin ({liveMarginPct}%)
              </span>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveChanges}
                className="rounded-xl border border-[#CBD5E1] dark:border-white/20 bg-black/5 dark:bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#0F172A] dark:text-white hover:border-[#F5951C] transition"
              >
                {saving ? "Saving..." : "💾 Save Itinerary"}
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportProposal}
                className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition"
              >
                {exporting ? "Exporting..." : `Export Proposal (${selectedItinerary.currentVersion})`}
              </button>
            </div>
          </div>

          {/* 4-Card Commercial Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-white/50 font-semibold">
                Net Supplier Cost
              </p>
              <p className="text-sm font-bold font-mono text-[#0F172A] dark:text-white mt-1">
                ₹{livePricing.totalNetCost.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-white/50 font-semibold">
                Agency Margin (Incl. GST)
              </p>
              <p className="text-sm font-bold font-mono text-[#F5951C] mt-1">
                ₹{livePricing.totalMarkupAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-white/50 font-semibold">
                GST (5% Inside Margin)
              </p>
              <p className="text-sm font-bold font-mono text-[#334155] dark:text-white/70 mt-1">
                ₹{livePricing.totalTaxAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-white/50 font-semibold">
                Gross Selling Price
              </p>
              <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{livePricing.grossSellingPrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Day-by-Day Interactive Builder */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-white/70">
                Day-by-Day Itinerary Schedule ({editDays.length} Days)
              </h4>
              <button
                type="button"
                onClick={addDay}
                className="px-3 py-1 rounded-lg border border-[#F5951C]/40 text-[#F5951C] text-xs font-semibold hover:bg-[#F5951C]/10 transition"
              >
                + Add Day
              </button>
            </div>

            <div className="space-y-3">
              {editDays.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-bold text-[#F5951C] shrink-0">
                        Day {day.dayNumber}:
                      </span>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) =>
                          setEditDays((prev) =>
                            prev.map((x, i) => (i === dIdx ? { ...x, title: e.target.value } : x))
                          )
                        }
                        className={inputClass}
                        placeholder="Day title"
                      />
                      <input
                        type="text"
                        value={day.destination}
                        onChange={(e) =>
                          setEditDays((prev) =>
                            prev.map((x, i) =>
                              i === dIdx ? { ...x, destination: e.target.value } : x
                            )
                          )
                        }
                        className={`${inputClass} max-w-[160px]`}
                        placeholder="Destination"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addSegment(dIdx)}
                        className="text-[11px] font-semibold text-[#F5951C] hover:underline"
                      >
                        + Add Line Item
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDay(dIdx)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Remove Day
                      </button>
                    </div>
                  </div>

                  {day.segments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-white/5">
                      {day.segments.map((seg, sIdx) => {
                        const t = calcSegmentTotals(seg);
                        return (
                          <div
                            key={sIdx}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                          >
                            <div className="sm:col-span-2">
                              <select
                                value={seg.segmentType}
                                onChange={(e) =>
                                  updateSegment(dIdx, sIdx, "segmentType", e.target.value)
                                }
                                className={inputClass}
                              >
                                <option value="hotel">Hotel</option>
                                <option value="transfer">Transfer</option>
                                <option value="activity">Activity</option>
                                <option value="guide">Guide</option>
                                <option value="dining">Dining</option>
                                <option value="aviation">Aviation</option>
                              </select>
                            </div>
                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                value={seg.title}
                                onChange={(e) => updateSegment(dIdx, sIdx, "title", e.target.value)}
                                placeholder="Item title"
                                className={inputClass}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                value={seg.vendorName}
                                onChange={(e) =>
                                  updateSegment(dIdx, sIdx, "vendorName", e.target.value)
                                }
                                placeholder="Vendor (internal)"
                                className={inputClass}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="number"
                                value={seg.netCost}
                                onChange={(e) =>
                                  updateSegment(dIdx, sIdx, "netCost", Number(e.target.value) || 0)
                                }
                                placeholder="Net ₹"
                                className={`${inputClass} font-mono`}
                              />
                            </div>
                            <div className="sm:col-span-1">
                              <input
                                type="number"
                                value={seg.markupPercent}
                                onChange={(e) =>
                                  updateSegment(
                                    dIdx,
                                    sIdx,
                                    "markupPercent",
                                    Number(e.target.value) || 0
                                  )
                                }
                                title="Markup %"
                                className={`${inputClass} font-mono`}
                              />
                            </div>
                            <div className="sm:col-span-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 text-right">
                              ₹{t.sellingPrice.toLocaleString("en-IN")}
                            </div>
                            <div className="sm:col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => removeSegment(dIdx, sIdx)}
                                className="text-[#64748B] hover:text-rose-500 p-1"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] text-xs text-[#475569] dark:text-white/60">
            🔒 <strong className="text-[#0F172A] dark:text-white">Commercial Privacy Guardrail (US-010):</strong> White-label client exports automatically strip all supplier vendor names, net costs, and markup percentages.
          </div>
        </div>
      )}

      {/* White-Label Proposal Preview Modal */}
      {whiteLabelPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-2xl w-full p-6 text-[#0F172A] dark:text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start border-b border-[#E2E8F0] dark:border-white/10 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  White-Label Client Proposal • {whiteLabelPreview.versionLabel}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-1.5">
                  {whiteLabelPreview.snapshot.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWhiteLabelPreview(null)}
                className="text-[#475569] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex justify-between items-center text-xs">
              <span className="font-semibold text-[#475569] dark:text-zinc-400">
                Total Curated Journey Investment (All Taxes Included):
              </span>
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                ₹{Number(whiteLabelPreview.snapshot.grossSellingPrice || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {(whiteLabelPreview.snapshot.days || []).map((d: any) => (
                <div
                  key={d.dayNumber}
                  className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/5 space-y-1"
                >
                  <p className="font-bold text-[#0F172A] dark:text-white">
                    <span className="text-[#F5951C]">Day {d.dayNumber}:</span> {d.title}
                  </p>
                  {d.experiences?.map((ex: any, i: number) => (
                    <p key={i} className="text-[#475569] dark:text-zinc-400 pl-3">
                      • {ex.title}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515]"
              >
                🖨️ Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setWhiteLabelPreview(null)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/20 text-xs font-semibold text-[#475569] dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
