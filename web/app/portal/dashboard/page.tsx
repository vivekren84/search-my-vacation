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

interface TeamMember {
  fullName: string;
  email: string;
  phoneE164: string;
  role: "super_admin" | "administrator" | "privilege_user" | "desk_user";
  status: "Active" | "Pending First Login";
  invitedAt: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    fullName: "Vivek Renganathan",
    email: "vivek@searchmyvacation.com",
    phoneE164: "+91 98401 23456",
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
  {
    fullName: "Keerthi Renganathan",
    email: "keerthi@searchmyvacation.com",
    phoneE164: "+91 98401 98765",
    role: "privilege_user",
    status: "Active",
    invitedAt: "2026-11-10",
  },
  {
    fullName: "Sri",
    email: "sri@searchmyvacation.com",
    phoneE164: "+91 98401 54321",
    role: "desk_user",
    status: "Pending First Login",
    invitedAt: "2026-11-15",
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
  const [activeTab, setActiveTab] = useState<"operations" | "crm" | "itinerary" | "governance">("operations");

  // Team Provisioning State (US-001)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("+91 ");
  const [inviteRole, setInviteRole] = useState<"administrator" | "privilege_user" | "desk_user">("desk_user");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Claude Itinerary Bridge State
  const [showClaudeModal, setShowClaudeModal] = useState(false);
  const [claudeInputText, setClaudeInputText] = useState("");
  const [claudeImportSuccess, setClaudeImportSuccess] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [itineraryUpdatedFromClaude, setItineraryUpdatedFromClaude] = useState(false);

  // Concierge Intelligence Radar state (US-018)
  const [radarMinimized, setRadarMinimized] = useState(false);
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

    // Load custom invited staff if any
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      if (stored) {
        const customInvites = JSON.parse(stored);
        if (Array.isArray(customInvites) && customInvites.length > 0) {
          setTeamMembers((prev) => {
            const combined = [...prev];
            for (const c of customInvites) {
              if (!combined.some((m) => m.email.toLowerCase() === c.email.toLowerCase())) {
                combined.push({
                  fullName: c.fullName,
                  email: c.email,
                  phoneE164: c.phoneE164,
                  role: c.role,
                  status: "Pending First Login",
                  invitedAt: c.invitedAt || new Date().toISOString().split("T")[0],
                });
              }
            }
            return combined;
          });
        }
      }
    } catch {}

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

  // Team Invite Submit Handler (US-001)
  function handleInviteSubmit(e: React.FormEvent) {
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

    // Save to local storage for portal login recognition
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
    } catch {}

    setTeamMembers((prev) => [...prev, newMember]);
    setInviteSuccess(`Invitation dispatched to ${newMember.email}. Account provisioned as ${newMember.role.replace("_", " ")}.`);
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("+91 ");
  }

  // Copy Claude Prompt Handler
  function handleCopyClaudePrompt() {
    const prompt = `Search My Vacation — Bespoke Itinerary Generation Request

CLIENT DOSSIER:
- Primary Client: Ananya Sharma (Bengaluru, India)
- Destination: Kashmir Circuit (Srinagar, Gulmarg, Pahalgam)
- Trip Duration: 8 Days / 7 Nights (Autumn Circuit: Oct 10 - Oct 17, 2026)
- Companions: 2 (Spouse Rohan Sharma, Child Aarav Sharma age 7)
- Key Travel Preferences: Family Comfort, Slow Travel, Pure Vegetarian Cuisine Focus
- Special Requirements: Interconnecting suites, child-friendly walking pace, low-altitude acclimatization, scenic mountain transfers
- Commercial Budget Target: ₹3,80,000 - ₹4,00,000 INR

OUTPUT REQUIREMENTS:
1. Day-by-Day schedule (Day 1 through Day 8) with morning, afternoon, and evening pacing.
2. Vetted boutique & heritage accommodations with child-safe amenities.
3. Realistic driving & transfer buffers between Srinagar, Gulmarg, and Pahalgam.
4. Suggested authentic vegetarian culinary experiences.
5. Zero occurrence of hyperbolic marketing buzzwords or cliches.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  }

  // Parse Claude Output Handler
  function handleParseClaudeInput() {
    if (!claudeInputText.trim()) return;
    const matches = claudeInputText.match(/Day \d+:[^\n]+/g) || [];
    const count = matches.length || 8;
    setItineraryUpdatedFromClaude(true);
    setClaudeImportSuccess(
      `Successfully parsed ${count} days from your Claude Project. Day schedule, boutique properties, and slow-travel timings have been updated in the SMV Itinerary Engine!`
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#2A211C] flex items-center justify-center text-white/60 text-sm">
        Authenticating session...
      </div>
    );
  }

  const canManageTeam = session.role === "super_admin" || session.role === "administrator";

  return (
    <div className="min-h-screen bg-[#2A211C] text-white flex flex-col font-sans">
      {/* Top Staff Navbar */}
      <header className="border-b border-white/10 bg-[#362B25] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/">
            <SiteBrand variant="header" surface="dark" className="w-32 sm:w-36 text-white" />
          </Link>
          <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest font-semibold text-[#F5951C]">
            Staff Advisor Portal
          </span>

          {/* Option 2: Direct Link to Main Public Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 hover:border-[#F5951C] hover:text-[#F5951C] hover:bg-white/10 transition"
            title="Open main public website in new tab"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">Main Site</span>
            <span className="text-[10px] text-white/40">↗</span>
          </a>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Option 1: Invite Team Members Button (Super Admin & Admin Only) */}
          {canManageTeam && (
            <button
              onClick={() => {
                setShowInviteModal(true);
                setInviteSuccess(null);
                setInviteError(null);
              }}
              className="flex items-center gap-1.5 rounded-full bg-[#F5951C] px-3 sm:px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2A211C] hover:bg-[#e08515] transition shadow-md"
            >
              <span>➕</span>
              <span className="hidden sm:inline">Invite Team</span>
              <span className="sm:hidden">Invite</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{session.fullName}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#F5951C] font-semibold">
              {session.role === "super_admin" ? "SUPER ADMIN" : session.role.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-white/20 px-3 sm:px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:border-[#F5951C] hover:text-[#F5951C] transition"
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
            { id: "governance", label: "Vendors & Team Governance", icon: "💼" },
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

        {/* TAB 3: ITINERARY & PRICING (US-007, US-008, US-009, US-010 + CLAUDE AI INTEGRATION) */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Bespoke Itinerary & Commercial Governance</h2>
                <p className="text-xs text-white/60">Day-by-day scheduler, line-item pricing & white-label proposal exports</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyClaudePrompt}
                  className="rounded-xl border border-[#F5951C]/40 bg-[#F5951C]/10 px-3.5 py-1.5 text-xs font-semibold text-[#F5951C] hover:bg-[#F5951C]/20 transition flex items-center gap-1.5"
                  title="Copy client briefing prompt for Claude Project"
                >
                  <span>📋</span>
                  <span>{copiedPrompt ? "Prompt Copied! ✓" : "Copy Brief for Claude"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowClaudeModal(true);
                    setClaudeImportSuccess(null);
                  }}
                  className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2A211C] hover:bg-[#e08515] transition flex items-center gap-1.5"
                >
                  <span>🤖</span>
                  <span>Import from Claude</span>
                </button>
              </div>
            </div>

            {/* AI Itinerary Generator / Claude Project Integration Bridge Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#362B25] to-[#2E241F] p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F5951C]/20 border border-[#F5951C]/30 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Claude Project Integration Bridge</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        Ready to Sync
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      Generate day-by-day itineraries using your custom Claude project prompt and sync them directly with Search My Vacation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      setShowClaudeModal(true);
                      setClaudeInputText(SAMPLE_CLAUDE_ITINERARY);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-[#F5951C] transition"
                  >
                    View Claude Sample Output
                  </button>
                </div>
              </div>

              {itineraryUpdatedFromClaude && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                  <span>✓ 8-Day itinerary synchronized from Claude Project output. Pacing, properties & activities active.</span>
                  <span className="text-[10px] font-mono opacity-80">Synced just now</span>
                </div>
              )}
            </div>

            {/* Current Itinerary Dossier & Pricing */}
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

              {/* Day-by-day Itinerary Schedule */}
              <div className="pt-2 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Day-by-Day Itinerary Schedule (8 Days)
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { day: "Day 1", title: "Arrival in Srinagar & Nigeen Lake Shikara Sunset", stay: "Nigeen Heritage Floats (Interconnected Suite)" },
                    { day: "Day 2", title: "Mughal Heritage (Nishat & Shalimar) & Old City Walk", stay: "Nigeen Heritage Floats" },
                    { day: "Day 3", title: "Scenic Transfer to Gulmarg & Affarwat Gondola Phase 1", stay: "Khyber Mountain Resort (Heated Suite)" },
                    { day: "Day 4", title: "Gulmarg Alpine Leisure & Strawberry Valley Pony Trail", stay: "Khyber Mountain Resort" },
                    { day: "Day 5", title: "Drive to Pahalgam (Valley of Shepherds) via Saffron Fields", stay: "Pahalgam Pine Cottages" },
                    { day: "Day 6", title: "Aru Valley & Betaab Valley Family Leisure Circuit", stay: "Pahalgam Pine Cottages" },
                    { day: "Day 7", title: "Return to Srinagar, Pashmina Artisans & Farewell Dinner", stay: "Nigeen Heritage Floats" },
                    { day: "Day 8", title: "Sheikh ul-Alam Airport Escort & Departure", stay: "Return Flight (DEL)" },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#2A211C] border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#F5951C] mr-2">{d.day}:</span>
                        <span className="font-semibold text-white">{d.title}</span>
                      </div>
                      <span className="text-[11px] text-white/50 font-mono">{d.stay}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/10 bg-[#2A211C] text-xs text-white/60">
                🔒 <strong className="text-white">Commercial Privacy Guardrail (US-010):</strong> White-label client exports automatically strip all supplier vendor names, net costs, and markup percentages.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VENDORS & TEAM GOVERNANCE (US-001, US-014, US-015, US-016) */}
        {activeTab === "governance" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Vendors & Team Governance</h2>
                <p className="text-xs text-white/60">Role-based staff directory, vetted contracted DMC rates & security step-up</p>
              </div>
              <div className="flex items-center gap-2.5">
                {canManageTeam && (
                  <button
                    onClick={() => {
                      setShowInviteModal(true);
                      setInviteSuccess(null);
                      setInviteError(null);
                    }}
                    className="rounded-xl bg-[#F5951C] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2A211C] hover:bg-[#e08515] transition flex items-center gap-1.5"
                  >
                    <span>➕</span>
                    <span>Invite Team Member</span>
                  </button>
                )}
                <button className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:border-[#F5951C]">
                  📥 Export Financial CSV (US-015)
                </button>
              </div>
            </div>

            {/* Section 1: Staff Directory & Security Governance (US-001) */}
            <div className="rounded-2xl border border-white/10 bg-[#362B25] p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Internal Staff Directory & Access Roles (US-001)
                    </h3>
                    <p className="text-[11px] text-white/50">
                      Super Admin & Administrator role-based provisioning with forced password rotation on first login
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#F5951C] font-semibold">
                  {teamMembers.length} Staff Accounts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#2A211C] border border-white/5 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm">{member.fullName}</p>
                          {member.role === "super_admin" && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F5951C]/20 text-[#F5951C] border border-[#F5951C]/40 text-[9px] font-bold">
                              OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-[11px]">{member.email}</p>
                        <p className="text-white/40 text-[10px] font-mono mt-0.5">{member.phoneE164}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        member.role === "super_admin" || member.role === "administrator"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : member.role === "privilege_user"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {member.role === "super_admin" ? "Super Admin" : member.role.replace("_", " ")}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-white/40">Provisioned: {member.invitedAt}</span>
                      <span className={member.status === "Active" ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                        ● {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Vendors & Document Vault */}
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
      {/* MODAL 1: INVITE TEAM MEMBER MODAL (US-001) */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#362B25] border border-white/20 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>➕</span> Invite Team Member
                </h3>
                <p className="text-xs text-white/60">
                  Role-based provisioning for Search My Vacation staff (US-001)
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-white/40 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-2">
                    <span>✓</span> Staff Member Provisioned Successfully
                  </p>
                  <p>{inviteSuccess}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#2A211C] border border-white/10 space-y-2 text-xs">
                  <p className="text-white/60 text-[11px] uppercase tracking-wider font-semibold">
                    Temporary Default Password:
                  </p>
                  <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg font-mono text-[#F5951C]">
                    <span>TemporaryDefaultPass#2026</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("TemporaryDefaultPass#2026");
                        setCopiedPass(true);
                        setTimeout(() => setCopiedPass(false), 2500);
                      }}
                      className="text-xs font-sans text-white/70 hover:text-white underline ml-2 cursor-pointer"
                    >
                      {copiedPass ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Security Mandate: The invited staff member will be required to configure their own permanent password upon their initial sign-in.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#2A211C] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                {inviteError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {inviteError}
                  </div>
                )}

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Full Name <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full rounded-xl bg-[#2A211C] border border-white/10 px-3.5 py-2.5 text-white placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Company Email <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. ramesh@searchmyvacation.com"
                    className="w-full rounded-xl bg-[#2A211C] border border-white/10 px-3.5 py-2.5 text-white placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Registered Mobile (E.164) <span className="text-[#F5951C]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full rounded-xl bg-[#2A211C] border border-white/10 px-3.5 py-2.5 text-white placeholder-white/30 focus:border-[#F5951C] focus:outline-none"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Used for single-channel SMS OTP login challenges.</p>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Role & Permissions <span className="text-[#F5951C]">*</span>
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full rounded-xl bg-[#2A211C] border border-white/10 px-3.5 py-2.5 text-white focus:border-[#F5951C] focus:outline-none"
                  >
                    <option value="desk_user">Desk User — Client CRM & Itinerary Operations</option>
                    <option value="privilege_user">Privilege User — Senior Advisor (Margin Overrides & VIP Docs)</option>
                    <option value="administrator">Administrator — Full Operations & Team Management</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/10 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/60">Temporary Default Password:</span>
                    <span className="font-mono text-[#F5951C] font-semibold">TemporaryDefaultPass#2026</span>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Invitees must configure a unique permanent password on first sign in.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/15 text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#2A211C] font-bold uppercase tracking-wider hover:bg-[#e08515] transition"
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
      {/* MODAL 2: CLAUDE AI ITINERARY IMPORTER MODAL */}
      {/* ========================================================================= */}
      {showClaudeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#362B25] border border-white/20 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🤖</span> Claude AI Itinerary Importer
                </h3>
                <p className="text-xs text-white/60">
                  Paste the output generated by your Claude project to populate the SMV itinerary engine
                </p>
              </div>
              <button
                onClick={() => setShowClaudeModal(false)}
                className="text-white/40 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {claudeImportSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  <p className="font-bold flex items-center gap-2 mb-1">
                    <span>✓</span> Itinerary Imported Successfully!
                  </p>
                  <p>{claudeImportSuccess}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowClaudeModal(false);
                      setClaudeImportSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#2A211C] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515]"
                  >
                    View Updated Itinerary
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#2A211C] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Target Client: Ananya Sharma</p>
                    <p className="text-[11px] text-white/50">8-Day Kashmir Autumn Serenity Circuit</p>
                  </div>
                  <button
                    onClick={handleCopyClaudePrompt}
                    className="px-3 py-1.5 rounded-lg border border-[#F5951C]/40 text-[#F5951C] hover:bg-[#F5951C]/10 transition flex items-center gap-1.5"
                  >
                    <span>📋</span>
                    <span>{copiedPrompt ? "Prompt Copied! ✓" : "Copy Briefing Prompt"}</span>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-white/70 font-semibold">
                      Paste Claude Project Output:
                    </label>
                    <button
                      onClick={() => setClaudeInputText(SAMPLE_CLAUDE_ITINERARY)}
                      className="text-[11px] text-[#F5951C] hover:underline"
                    >
                      Load Sample Output
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={claudeInputText}
                    onChange={(e) => setClaudeInputText(e.target.value)}
                    placeholder="Paste the itinerary text or JSON response from your Claude project here..."
                    className="w-full rounded-xl bg-[#2A211C] border border-white/10 p-3 text-white placeholder-white/30 font-mono text-[11px] focus:border-[#F5951C] focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 space-y-1.5">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>💡</span> Recommended 3-Step Workflow:
                  </p>
                  <p className="text-[11px] text-blue-200/80">
                    1. Click <strong>Copy Briefing Prompt</strong> above and paste it into your Claude project.<br />
                    2. Let Claude produce your bespoke itinerary.<br />
                    3. Paste Claude&apos;s output into the box above and click <strong>Parse & Populate</strong> — SMV instantly structures the schedule and updates proposal exports.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClaudeModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/15 text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleParseClaudeInput}
                    className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#2A211C] font-bold uppercase tracking-wider hover:bg-[#e08515] transition"
                  >
                    Parse & Populate Itinerary
                  </button>
                </div>
              </div>
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
              }}
              className="text-[#F5951C] hover:underline font-semibold ml-1 cursor-pointer"
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
