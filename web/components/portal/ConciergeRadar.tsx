"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface RadarTripSummary {
  id: string;
  dealReferenceId: string;
  customerName: string;
  destination: string;
  dealStage: string;
  startDate?: string | null;
  followUpDate?: string | null;
  readinessCount?: number;
  leadOwnerName?: string;
}

interface ConciergeRadarProps {
  trips: RadarTripSummary[];
  onOpenTrip: (tripId: string) => void;
}

interface RadarOffset {
  right: number;
  bottom: number;
}

const STORAGE_KEY = "smv_radar_pos_r155";
const DEFAULT_OFFSET: RadarOffset = { right: 24, bottom: 24 };
const PINNED_DESTINATIONS = ["Kashmir", "Rajasthan", "Kerala", "Ladakh", "Sri Lanka", "Andaman"];

function getInitials(name?: string): string {
  if (!name) return "SMV";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function clampOffset(offset: RadarOffset, panelWidth: number, panelHeight: number): RadarOffset {
  if (typeof window === "undefined") return offset;
  const maxRight = Math.max(16, window.innerWidth - panelWidth - 16);
  const maxBottom = Math.max(16, window.innerHeight - panelHeight - 16);
  return {
    right: Math.min(Math.max(offset.right, 16), maxRight),
    bottom: Math.min(Math.max(offset.bottom, 16), maxBottom),
  };
}

function getTodayIst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function addDaysIso(baseIso: string, days: number): string {
  const d = new Date(`${baseIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDays(fromIso: string, toIso: string): number {
  const a = new Date(`${fromIso}T00:00:00Z`).getTime();
  const b = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
}

export function ConciergeRadar({ trips, onOpenTrip }: ConciergeRadarProps) {
  const [minimized, setMinimized] = useState(true);
  const [offset, setOffset] = useState<RadarOffset>(DEFAULT_OFFSET);
  const [activeTab, setActiveTab] = useState<"live" | "destinations">("live");
  const [activeDestination, setActiveDestination] = useState("Kashmir");
  const [destSearch, setDestSearch] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    startRight: number;
    startBottom: number;
  }>({ active: false, moved: false, startX: 0, startY: 0, startRight: 24, startBottom: 24 });

  const getPanelSize = useCallback((isMin: boolean) => {
    if (typeof window === "undefined") return { width: 48, height: 48 };
    if (isMin) return { width: 48, height: 48 };
    return {
      width: Math.min(384, window.innerWidth - 32),
      height: Math.min(500, window.innerHeight - 32),
    };
  }, []);

  // Load persisted { right, bottom } and clamp on mount & window.resize
  useEffect(() => {
    let initial = DEFAULT_OFFSET;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.right === "number" && typeof parsed?.bottom === "number") {
          initial = parsed;
        }
      }
    } catch {}
    const { width, height } = getPanelSize(true);
    setOffset(clampOffset(initial, width, height));
  }, [getPanelSize]);

  useEffect(() => {
    function handleResize() {
      const { width, height } = getPanelSize(minimized);
      setOffset((prev) => clampOffset(prev, width, height));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minimized, getPanelSize]);

  const persistOffset = useCallback((next: RadarOffset) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  function handleExpand() {
    const { width, height } = getPanelSize(false);
    setOffset((prev) => {
      const clamped = clampOffset(prev, width, height);
      persistOffset(clamped);
      return clamped;
    });
    setMinimized(false);
  }

  function handleMinimize() {
    setMinimized(true);
  }

  function handleResetPosition(e: React.MouseEvent) {
    e.stopPropagation();
    const { width, height } = getPanelSize(minimized);
    const clamped = clampOffset(DEFAULT_OFFSET, width, height);
    setOffset(clamped);
    persistOffset(clamped);
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startRight: offset.right,
      startBottom: offset.bottom,
    };

    const onMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragRef.current.moved = true;
      }
      const { width, height } = getPanelSize(minimized);
      const next = clampOffset(
        {
          right: dragRef.current.startRight - dx,
          bottom: dragRef.current.startBottom - dy,
        },
        width,
        height
      );
      setOffset(next);
    };

    const onUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setOffset((latest) => {
        persistOffset(latest);
        return latest;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const todayIst = getTodayIst();
  const in14Ist = addDaysIso(todayIst, 14);
  const in7Ist = addDaysIso(todayIst, 7);

  const liveTrips = useMemo(() => {
    return trips
      .filter((t) => {
        if (t.dealStage === "In Travel") return true;
        if (
          t.dealStage === "Booked/Won" &&
          t.startDate &&
          t.startDate >= todayIst &&
          t.startDate <= in14Ist
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (a.dealStage === "In Travel" && b.dealStage !== "In Travel") return -1;
        if (a.dealStage !== "In Travel" && b.dealStage === "In Travel") return 1;
        return (a.startDate || "").localeCompare(b.startDate || "");
      });
  }, [trips, todayIst, in14Ist]);

  const dueHolds = useMemo(
    () => trips.filter((t) => t.dealStage === "On Hold" && t.followUpDate && t.followUpDate <= in7Ist),
    [trips, in7Ist]
  );

  const filteredPinned = useMemo(() => {
    const q = destSearch.trim().toLowerCase();
    if (!q) return PINNED_DESTINATIONS;
    return PINNED_DESTINATIONS.filter((d) => d.toLowerCase().includes(q));
  }, [destSearch]);

  const showDynamicLookupPrompt =
    destSearch.trim().length >= 2 &&
    !PINNED_DESTINATIONS.some((d) => d.toLowerCase() === destSearch.trim().toLowerCase());

  async function runDestinationLookup(query: string) {
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/portal/radar/destination?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data?.ok) {
        setLookupResult(data);
        setActiveDestination(data.destinationMeta?.canonical_name || query);
      }
    } catch {
      // Ignore transient network errors
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <div
      style={{ right: `${offset.right}px`, bottom: `${offset.bottom}px`, position: "fixed" }}
      className="z-50 select-none"
    >
      {minimized ? (
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onClick={() => {
            if (!dragRef.current.moved) handleExpand();
          }}
          aria-label={`Expand Concierge Radar (${liveTrips.length} active/upcoming)`}
          title="Concierge Radar (Tap to expand, drag to move)"
          className="relative w-12 h-12 rounded-full bg-white dark:bg-[#121215] border-2 border-[#F5951C] shadow-2xl flex items-center justify-center text-[#0F172A] dark:text-white hover:scale-105 transition cursor-grab active:cursor-grabbing"
        >
          <span className="text-lg leading-none" aria-hidden="true">📡</span>
          <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          {(liveTrips.length > 0 || dueHolds.length > 0) && (
            <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F5951C] text-[#0F172A] text-[10px] font-bold flex items-center justify-center shadow">
              {liveTrips.length + dueHolds.length}
            </span>
          )}
        </button>
      ) : (
        <div className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/15 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Draggable Header */}
          <div
            onPointerDown={handlePointerDown}
            className="p-3 bg-[#0F172A] border-b border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Concierge Radar
              </span>
            </div>
            <div
              className="flex items-center gap-1.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleResetPosition}
                title="Reset Radar Position"
                className="text-[11px] text-white/75 hover:text-white px-2 py-0.5 rounded border border-white/20"
              >
                ⌖ Reset
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className="text-[11px] text-white/75 hover:text-white px-2 py-0.5 rounded border border-white/20"
              >
                Minimize
              </button>
            </div>
          </div>

          {/* Primary Tabs */}
          <div className="flex border-b border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`flex-1 py-2 px-3 transition ${
                activeTab === "live"
                  ? "text-[#0F172A] dark:text-white border-b-2 border-[#F5951C] bg-white dark:bg-[#121215]"
                  : "text-[#475569] dark:text-zinc-400"
              }`}
            >
              Live Radar ({liveTrips.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("destinations")}
              className={`flex-1 py-2 px-3 transition ${
                activeTab === "destinations"
                  ? "text-[#0F172A] dark:text-white border-b-2 border-[#F5951C] bg-white dark:bg-[#121215]"
                  : "text-[#475569] dark:text-zinc-400"
              }`}
            >
              Destinations
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-3.5 space-y-2.5 text-xs max-h-80 overflow-y-auto">
            {activeTab === "live" ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
                  Live Radar: Active &amp; Departing ≤ 14 Days
                </p>

                {liveTrips.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-zinc-400 text-[11px]">
                    No active or departing journeys in the next 14 days.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {liveTrips.map((t) => {
                      const isActiveNow = t.dealStage === "In Travel";
                      const daysOut = t.startDate ? diffDays(todayIst, t.startDate) : null;
                      const readiness = Number(t.readinessCount ?? 0);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onOpenTrip(t.id)}
                          className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 hover:border-[#F5951C] transition space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#F5951C]">
                              {t.dealReferenceId}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                isActiveNow
                                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              }`}
                            >
                              {isActiveNow
                                ? "ACTIVE NOW"
                                : daysOut === 0
                                  ? "DEPARTS TODAY"
                                  : `DEPARTS IN ${daysOut}d`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-[#0F172A] dark:text-white truncate">
                              {t.customerName} • {t.destination}
                            </p>
                            <span className="px-1.5 py-0.5 rounded bg-[#E2E8F0] dark:bg-white/10 text-[9px] font-bold text-[#0F172A] dark:text-white shrink-0">
                              {getInitials(t.leadOwnerName)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span
                              className={`font-semibold ${
                                readiness < 6
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {readiness}/6 Ready
                            </span>
                            {t.startDate && (
                              <span className="font-mono text-[#64748B] dark:text-zinc-400">
                                {t.startDate}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {dueHolds.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold">
                      ⏰ On Hold Follow-Ups Due ({dueHolds.length})
                    </p>
                    {dueHolds.slice(0, 3).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => onOpenTrip(h.id)}
                        className="w-full text-left text-[11px] text-[#0F172A] dark:text-white hover:text-[#F5951C] flex justify-between items-center"
                      >
                        <span className="truncate font-semibold">
                          {h.dealReferenceId} • {h.customerName}
                        </span>
                        <span className="font-mono text-[10px] shrink-0 ml-1">{h.followUpDate}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => {
                    setDestSearch(e.target.value);
                    setLookupResult(null);
                  }}
                  placeholder="Search destination..."
                  className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-[#F8FAFC] dark:bg-[#09090B] px-3 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none"
                />

                <div className="flex flex-wrap gap-1.5">
                  {filteredPinned.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setActiveDestination(dest);
                        runDestinationLookup(dest);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        activeDestination === dest
                          ? "bg-[#F5951C] text-[#0F172A]"
                          : "bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-zinc-300"
                      }`}
                    >
                      {dest}
                    </button>
                  ))}
                </div>

                {showDynamicLookupPrompt && (
                  <button
                    type="button"
                    onClick={() => runDestinationLookup(destSearch.trim())}
                    disabled={lookupLoading}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[#F5951C]/15 border border-[#F5951C]/40 text-[#0F172A] dark:text-white font-semibold hover:bg-[#F5951C]/25 transition"
                  >
                    {lookupLoading
                      ? `Searching "${destSearch.trim()}"...`
                      : `🔍 Search "${destSearch.trim()}" in Radar`}
                  </button>
                )}

                {lookupResult && (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A] dark:text-white">
                        {lookupResult.destinationMeta?.canonical_name || lookupResult.query}
                      </span>
                      <span className="text-[10px] font-mono text-[#F5951C]">
                        {lookupResult.destinationMeta?.iana_timezone || "Asia/Kolkata"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] dark:text-zinc-400">
                      Vetted Vendors: <strong>{lookupResult.vendorCount}</strong> • Trips:{" "}
                      <strong>{lookupResult.tripCount}</strong> ({lookupResult.activeOrBookedTrips} active/booked)
                    </p>
                    {Array.isArray(lookupResult.vendors) && lookupResult.vendors.length > 0 && (
                      <div className="pt-1 border-t border-[#E2E8F0] dark:border-white/10 space-y-0.5">
                        {lookupResult.vendors.map((v: any) => (
                          <p key={v.id} className="text-[10px] text-[#334155] dark:text-zinc-300 truncate">
                            • {v.name} ({v.category})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
