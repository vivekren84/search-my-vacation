"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import SiteBrand from "@/components/brand/SiteBrand";

interface StaffSession {
  fullName: string;
  email: string;
  role: string;
  loggedInAt: string;
}

export default function PortalDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [activeTab, setActiveTab] = useState<"operations" | "crm" | "itinerary" | "governance">("operations");

  // Concierge Intelligence Radar state (US-018)
  const [radarMinimized, setRadarMinimized] = useState(false);
  const [radarExpanded, setRadarExpanded] = useState(false);
  const [radarPos, setRadarPos] = useState({ x: 0, y: 0, isCustom: false });
  const [activeDestination, setActiveDestination] = useState("Kashmir");
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });

  // Inactivity Watchdog (30 Minutes)
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    // Check staff session
    const raw = typeof window !== "undefined" ? localStorage.getItem("smv_staff_session") : null;
    if (!raw) {
      router.replace("/portal/login");
      return;
    }
    try {
      setSession(JSON.parse(raw));
    } catch {
      router.replace("/portal/login");
    }

    // Inactivity event listeners
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Watchdog interval: check every 15s for 30m idle (1800000ms)
    const watchdogTimer = setInterval(() => {
      const idleTimeMs = Date.now() - lastActivityRef.current;
      if (idleTimeMs >= 30 * 60 * 1000) {
        // Forced logout after 30 mins
        localStorage.removeItem("smv_staff_session");
        // Reset radar back to bottom-right origin
        setRadarPos({ x: 0, y: 0, isCustom: false });
        alert("Session terminated: You have been logged out due to 30 minutes of inactivity.");
        router.replace("/portal/login");
      }
    }, 15000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(watchdogTimer);
    };
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

  if (!session) {
    return (
      <div className="min-h-screen bg-[#2A211C] flex items-center justify-center text-white/60 text-sm">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2A211C] text-white flex flex-col font-sans">
      {/* Top Staff Navbar */}
      <header className="border-b border-white/10 bg-[#362B25] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/">
            <SiteBrand variant="header" surface="dark" className="w-36 text-white" />
          </Link>
          <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest font-semibold text-[#F5951C]">
            Staff Advisor Portal
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{session.fullName}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/50">{session.role.replace("_", " ")}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:border-[#F5951C] hover:text-[#F5951C] transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace Navigation */}
      <div className="border-b border-white/10 bg-[#2E241F] px-4 sm:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5">
          {[
            { id: "operations", label: "Operations & Kanban", icon: "📋" },
            { id: "crm", label: "Master Client CRM", icon: "👥" },
            { id: "itinerary", label: "Itinerary & Margin Engine", icon: "🗺️" },
            { id: "governance", label: "Vendors & Financials", icon: "💼" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "bg-[#F5951C] text-[#2A211C] shadow"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Workspace Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-28">
        {/* TAB 1: OPERATIONS & KANBAN (US-011, US-012, US-013) */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Trip Lifecycle Pipeline</h2>
                <p className="text-xs text-white/60">Manage bookings through verified operational stages</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Active Departures: 4
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  SLA Alerts: 2
                </span>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {[
                { stage: "Proposal Sent", count: 1, value: "₹380,000", client: "Ananya Sharma", trip: "Kashmir Serenity" },
                { stage: "Deposit Received", count: 2, value: "₹720,000", client: "Rajesh Singhania", trip: "Rajasthan Heritage" },
                { stage: "Booked Confirmed", count: 1, value: "₹450,000", client: "Vikram Malhotra", trip: "Kerala Backwaters" },
                { stage: "In Travel", count: 1, value: "₹650,000", client: "Sunita Roy", trip: "Himachal High Passes" },
                { stage: "Returned Closed", count: 12, value: "₹4.8M", client: "Deepak Verma", trip: "Golden Triangle" },
              ].map((col, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#362B25] p-3.5 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">{col.stage}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">{col.count}</span>
                    </div>
                    <div className="rounded-xl bg-[#2A211C] p-3 border border-white/5 space-y-1.5">
                      <p className="text-xs font-bold text-[#F5951C]">{col.client}</p>
                      <p className="text-[11px] text-white/70">{col.trip}</p>
                      <p className="text-[10px] font-mono text-emerald-400">{col.value}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/5 text-[10px] text-white/40 text-center">
                    Auto-synced with vouchers
                  </div>
                </div>
              ))}
            </div>

            {/* Vouchers & Emergency Hub */}
            <div className="rounded-2xl border border-white/10 bg-[#362B25] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <span>🎫</span> Segment Voucher Vault & Emergency Contacts (US-012)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>VOUCH-SRI-001 (Nigeen Houseboat)</span>
                    <span className="text-emerald-400">Confirmed</span>
                  </div>
                  <p className="text-white/60">Duty Manager: Tariq Butt • 24x7: +91 94190 12345</p>
                  <p className="text-[11px] text-white/40">VIP Pier transfer meeting at Srinagar Gate 2</p>
                </div>
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>VOUCH-UDR-002 (Taj Lake Palace)</span>
                    <span className="text-emerald-400">Confirmed</span>
                  </div>
                  <p className="text-white/60">Duty Manager: Vikram Rathore • 24x7: +91 98290 11223</p>
                  <p className="text-[11px] text-white/40">Private boat transfer included upon jetty arrival</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT CRM & BRIEFING (US-004, US-005, US-006, GAP-04) */}
        {activeTab === "crm" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Master Client Directory</h2>
                <p className="text-xs text-white/60">Decoupled CRM profiles, preference tags & communication timeline</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#362B25] overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#2E241F]">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Client Dossier</span>
                <span className="text-xs text-white/50">Mandatory Lead Source: Instagram Campaign</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Ananya Sharma</h3>
                    <p className="text-xs text-white/60">ananya.sharma@example.com • +91 98401 12233 • Bengaluru</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#F5951C]/20 text-[#F5951C] border border-[#F5951C]/30">Family Comfort</span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Slow Travel</span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Vegetarian Focus</span>
                  </div>
                </div>

                {/* Companions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Linked Companions (2)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                      <p className="font-semibold text-white">Rohan Sharma (Spouse)</p>
                      <p className="text-[11px] text-white/50">Adult • Pure Veg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                      <p className="font-semibold text-white">Aarav Sharma (Child)</p>
                      <p className="text-[11px] text-white/50">Age 7 • Kid-Easy Pace Required</p>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Chronological Activity Feed (US-006)</h4>
                  <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 text-xs space-y-1">
                    <p className="text-[#F5951C] font-semibold">📞 Discovery Call Completed (Sri)</p>
                    <p className="text-white/70">Aligned on 8-day slow-travel Kashmir autumn circuit. Client requested interconnected suites.</p>
                    <p className="text-[10px] text-white/40">Today at 14:30 • Verified zero external API cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ITINERARY & PRICING (US-007, US-008, US-009, US-010) */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Bespoke Itinerary & Commercial Governance</h2>
                <p className="text-xs text-white/60">Day-by-day scheduler, line-item pricing & white-label proposal exports</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#362B25] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">8-Day Kashmir Autumn Serenity Circuit</h3>
                  <p className="text-xs text-white/60">Client: Ananya Sharma • Oct 10 - Oct 17, 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    🟢 Margin Healthy (18.2%)
                  </span>
                  <button className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2A211C]">
                    Export Proposal (v1.0)
                  </button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">Net Supplier Cost</p>
                  <p className="text-sm font-bold font-mono text-white mt-1">₹312,000</p>
                </div>
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">Agency Markup</p>
                  <p className="text-sm font-bold font-mono text-[#F5951C] mt-1">₹69,500</p>
                </div>
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">Estimated GST</p>
                  <p className="text-sm font-bold font-mono text-white/70 mt-1">₹12,510</p>
                </div>
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">Gross Selling Price</p>
                  <p className="text-sm font-bold font-mono text-emerald-400 mt-1">₹394,010</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/10 bg-[#2A211C] text-xs text-white/60">
                🔒 <strong className="text-white">Commercial Privacy Guardrail (US-010):</strong> White-label client exports automatically strip all supplier vendor names, net costs, and markup percentages.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VENDORS & FINANCIALS (US-014, US-015, US-016) */}
        {activeTab === "governance" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Vendors & Executive Financials</h2>
                <p className="text-xs text-white/60">Vetted contracted rates, financial analytics & encrypted document vault</p>
              </div>
              <button className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:border-[#F5951C]">
                📥 Export Financial CSV (US-015)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#362B25] p-5 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>🏢</span> Vetted Vendor Directory (RBAC)
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Nigeen Heritage Floats (DMC)</p>
                      <p className="text-white/50">Kashmir • Net Contract Active</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">-20% Negotiated</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Himalayan Passes Aviation</p>
                      <p className="text-white/50">Charter • Contract Net 30</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">-15% Negotiated</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#362B25] p-5 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>🔐</span> Encrypted Document Vault & Step-Up (US-016)
                </h3>
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Ananya Sharma (Passport)</span>
                    <span className="text-white/50 font-mono">XXXX-4567</span>
                  </div>
                  <p className="text-[11px] text-white/50">Auto-masked by default. Step-Up OTP authorization required for unmasked view.</p>
                  <button className="w-full py-1.5 rounded-lg border border-white/15 text-[11px] font-semibold text-[#F5951C] hover:bg-white/5">
                    Request Step-Up Unmasking (5-Min Window)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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
            : "fixed bottom-6 right-6 z-50 select-none"
        }
      >
        {/* State A: Minimized Draggable Pill */}
        {radarMinimized ? (
          <div
            onMouseDown={startDragging}
            className="cursor-move rounded-full bg-[#362B25] border-2 border-[#F5951C] px-4 py-2.5 shadow-2xl flex items-center gap-2.5 text-xs text-white hover:shadow-[#F5951C]/20 transition"
            title="Drag anywhere on screen. Re-login resets to Bottom-Right."
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5951C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F5951C]"></span>
            </span>
            <span className="font-bold">Radar: {activeDestination}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRadarMinimized(false);
                setRadarExpanded(true);
              }}
              className="text-[#F5951C] hover:underline font-semibold ml-1"
            >
              Expand
            </button>
          </div>
        ) : (
          /* State B: Expanded Dock */
          <div className="w-80 sm:w-96 rounded-2xl bg-[#362B25] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="p-3.5 bg-[#2E241F] border-b border-white/10 flex justify-between items-center">
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
                  className="text-xs text-white/60 hover:text-white px-2 py-0.5 rounded border border-white/10"
                >
                  Minimize
                </button>
              </div>
            </div>

            {/* Context Selector */}
            <div className="p-3 bg-[#2A211C] border-b border-white/5 flex gap-2 overflow-x-auto text-xs">
              {["Kashmir", "Rajasthan", "Kerala", "Ladakh"].map((dest) => (
                <button
                  key={dest}
                  onClick={() => setActiveDestination(dest)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    activeDestination === dest
                      ? "bg-[#F5951C] text-[#2A211C]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Live Context Cards */}
            <div className="p-4 space-y-3 text-xs max-h-72 overflow-y-auto">
              {/* Weather */}
              <div className="p-2.5 rounded-xl bg-[#2A211C] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[11px] text-white/50 uppercase font-semibold">Live Weather</p>
                  <p className="font-bold text-white mt-0.5">14°C • Golden Autumn Skies</p>
                </div>
                <span className="text-2xl">🍂</span>
              </div>

              {/* Flights */}
              <div className="p-2.5 rounded-xl bg-[#2A211C] border border-white/5 space-y-1">
                <p className="text-[11px] text-white/50 uppercase font-semibold">Flight Intelligence</p>
                <div className="flex justify-between items-center text-white">
                  <span>DEL ➔ SXR (AI-825)</span>
                  <span className="text-emerald-400 font-bold">On Time</span>
                </div>
              </div>

              {/* Ground Notice */}
              <div className="p-2.5 rounded-xl bg-[#2A211C] border border-white/5 space-y-1">
                <p className="text-[11px] text-white/50 uppercase font-semibold">Local Supplier Advisory</p>
                <p className="text-white/80">Srinagar-Gulmarg Highway: Clear, private chauffeured escort confirmed.</p>
              </div>
            </div>

            {/* Inactivity Notice */}
            <div className="p-2.5 bg-[#2E241F] border-t border-white/5 text-[10px] text-white/40 text-center">
              Permanent dock. 30-min idle watchdog resets position to Bottom-Right.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
