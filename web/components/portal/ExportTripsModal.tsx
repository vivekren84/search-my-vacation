"use client";

import { useMemo, useState } from "react";

interface ExportTripsModalProps {
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Trips" },
  { id: "enquiries", label: "Enquiries & Discovery" },
  { id: "planning", label: "Curation & Quotes" },
  { id: "confirmed", label: "Confirmed & Booked" },
  { id: "in_travel", label: "In Travel / Active" },
  { id: "completed", label: "Completed Journeys" },
  { id: "on_hold", label: "On Hold (Follow-Up)" },
  { id: "cancelled", label: "Cancelled Trips" },
  { id: "lost", label: "Lost / Archived Trips" },
];

export function ExportTripsModal({
  callerEmail,
  callerName,
  callerRole,
  onClose,
}: ExportTripsModalProps) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["all"]);
  const [dateBasis, setDateBasis] = useState<"start_date" | "created_at">("start_date");
  const [tenureType, setTenureType] = useState<"custom" | "month" | "quarter" | "year">("year");

  const [customStart, setCustomStart] = useState(`${currentYear}-01-01`);
  const [customEnd, setCustomEnd] = useState(todayIso);
  const [monthYear, setMonthYear] = useState(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q4");
  const [quarterYear, setQuarterYear] = useState(String(currentYear));
  const [yearMode, setYearMode] = useState<"FY" | "CY">("CY");
  const [yearVal, setYearVal] = useState(String(currentYear));

  const [exporting, setExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { startDate, endDate, tenureLabel, customRangeInvalid } = useMemo(() => {
    if (tenureType === "custom") {
      const a = new Date(`${customStart}T00:00:00Z`).getTime();
      const b = new Date(`${customEnd}T00:00:00Z`).getTime();
      const diff = Number.isFinite(a) && Number.isFinite(b) ? Math.round((b - a) / 86400000) : 0;
      return {
        startDate: customStart,
        endDate: customEnd,
        tenureLabel: `${customStart}_to_${customEnd}`,
        customRangeInvalid: diff > 365 || diff < 0,
      };
    }
    if (tenureType === "month") {
      const [y, m] = monthYear.split("-").map(Number);
      const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const mm = String(m).padStart(2, "0");
      return {
        startDate: `${y}-${mm}-01`,
        endDate: `${y}-${mm}-${String(lastDay).padStart(2, "0")}`,
        tenureLabel: `${y}-${mm}`,
        customRangeInvalid: false,
      };
    }
    if (tenureType === "quarter") {
      const y = Number(quarterYear) || currentYear;
      const ranges: Record<string, [string, string]> = {
        Q1: [`${y}-01-01`, `${y}-03-31`],
        Q2: [`${y}-04-01`, `${y}-06-30`],
        Q3: [`${y}-07-01`, `${y}-09-30`],
        Q4: [`${y}-10-01`, `${y}-12-31`],
      };
      const [s, e] = ranges[quarter];
      return { startDate: s, endDate: e, tenureLabel: `${quarter}_${y}`, customRangeInvalid: false };
    }
    const y = Number(yearVal) || currentYear;
    if (yearMode === "FY") {
      return {
        startDate: `${y}-04-01`,
        endDate: `${y + 1}-03-31`,
        tenureLabel: `FY_${y}-${String((y + 1) % 100).padStart(2, "0")}`,
        customRangeInvalid: false,
      };
    }
    return {
      startDate: `${y}-01-01`,
      endDate: `${y}-12-31`,
      tenureLabel: `CY_${y}`,
      customRangeInvalid: false,
    };
  }, [tenureType, customStart, customEnd, monthYear, quarter, quarterYear, yearMode, yearVal, currentYear]);

  function toggleStatus(id: string) {
    if (id === "all") {
      setSelectedStatuses(selectedStatuses.includes("all") ? [] : ["all"]);
      return;
    }
    const withoutAll = selectedStatuses.filter((s) => s !== "all");
    if (withoutAll.includes(id)) {
      setSelectedStatuses(withoutAll.filter((s) => s !== id));
    } else {
      setSelectedStatuses([...withoutAll, id]);
    }
  }

  async function handleExport(e: React.FormEvent) {
    e.preventDefault();
    if (customRangeInvalid || selectedStatuses.length === 0) return;
    setExporting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/portal/crm/trips/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify({
          statuses: selectedStatuses,
          dateBasis,
          startDate,
          endDate,
          tenureLabel,
          callerEmail,
          callerName,
          callerRole,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err?.message || "Export failed.");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `SMV_Trips_Export_${tenureLabel}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      setErrorMsg("Network error while exporting Excel.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
              Export Trips Workbook (.xlsx)
            </h3>
            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
              Filter by status, date basis, and tenure (max 365 days for custom ranges)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleExport} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Trip Status Multi-Select */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
              1. Trip Status (Select All / Multi-Select)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_OPTIONS.map((opt) => {
                const checked = selectedStatuses.includes("all") || selectedStatuses.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] text-[#0F172A] dark:text-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStatus(opt.id)}
                    />
                    <span className="text-[11px] font-medium">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Basis */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
              2. Filter Date Basis
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDateBasis("start_date")}
                className={`py-2 px-3 rounded-xl border font-bold ${
                  dateBasis === "start_date"
                    ? "bg-[#F5951C] text-[#0F172A] border-[#F5951C]"
                    : "border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300"
                }`}
              >
                Travel Start Date
              </button>
              <button
                type="button"
                onClick={() => setDateBasis("created_at")}
                className={`py-2 px-3 rounded-xl border font-bold ${
                  dateBasis === "created_at"
                    ? "bg-[#F5951C] text-[#0F172A] border-[#F5951C]"
                    : "border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300"
                }`}
              >
                Enquiry Created Date
              </button>
            </div>
          </div>

          {/* Tenure Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
              3. Tenure / Date Filter
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["custom", "month", "quarter", "year"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenureType(t)}
                  className={`py-1.5 rounded-lg border font-bold capitalize ${
                    tenureType === t
                      ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] border-transparent"
                      : "border-[#CBD5E1] dark:border-white/15 text-[#475569] dark:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tenureType === "custom" && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                  />
                </div>
                {customRangeInvalid && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Custom range cannot exceed 1 year (365 days) and End Date must be ≥ Start Date.
                  </p>
                )}
              </div>
            )}

            {tenureType === "month" && (
              <input
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
              />
            )}

            {tenureType === "quarter" && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value as any)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                >
                  <option value="Q1">Q1 (Jan–Mar)</option>
                  <option value="Q2">Q2 (Apr–Jun)</option>
                  <option value="Q3">Q3 (Jul–Sep)</option>
                  <option value="Q4">Q4 (Oct–Dec)</option>
                </select>
                <input
                  type="number"
                  min={2020}
                  max={2035}
                  value={quarterYear}
                  onChange={(e) => setQuarterYear(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
              </div>
            )}

            {tenureType === "year" && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={yearMode}
                  onChange={(e) => setYearMode(e.target.value as any)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                >
                  <option value="CY">Calendar Year (CY)</option>
                  <option value="FY">Financial Year (FY Apr–Mar)</option>
                </select>
                <input
                  type="number"
                  min={2020}
                  max={2035}
                  value={yearVal}
                  onChange={(e) => setYearVal(e.target.value)}
                  className="rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-2 text-[#0F172A] dark:text-white"
                />
              </div>
            )}
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
              disabled={exporting || customRangeInvalid || selectedStatuses.length === 0}
              className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] disabled:opacity-40"
            >
              {exporting ? "Generating..." : "Download .xlsx"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
