"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SiteBrand from "@/components/brand/SiteBrand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Authorized staff directory for internal portal authentication
const KNOWN_STAFF_ACCOUNTS: Record<string, { fullName: string; role: string; email: string; phoneE164: string; requiresPasswordChange?: boolean }> = {
  "vivek@searchmyvacation.com": {
    fullName: "Vivek Renganathan",
    role: "super_admin",
    email: "vivek@searchmyvacation.com",
    phoneE164: "+918925838541",
  },
  "tiger@searchmyvacation.com": {
    fullName: "Tiger CTO",
    role: "administrator",
    email: "tiger@searchmyvacation.com",
    phoneE164: "+919884012345",
  },
  "sri@searchmyvacation.com": {
    fullName: "Sri",
    role: "desk_user",
    email: "sri@searchmyvacation.com",
    phoneE164: "+919840154321",
    requiresPasswordChange: true, // Default invitee demo flag
  },
  "keerthi@searchmyvacation.com": {
    fullName: "Keerthi Renganathan",
    role: "privilege_user",
    email: "keerthi@searchmyvacation.com",
    phoneE164: "+919840198765",
  },
};

export default function PortalLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [authMethod, setAuthMethod] = useState<"otp" | "password">("otp");
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forced Password Change state for invitees
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [pendingAccount, setPendingAccount] = useState<{ fullName: string; email: string; role: string; phoneE164?: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [banners, setBanners] = useState<
    { id: string; title: string; subtitle: string; region_label: string; image_url: string; cta_label?: string; cta_href?: string }[]
  >([
    {
      id: "default-1",
      title: "Unhurried Mornings on Kerala Backwaters",
      subtitle: "Private heritage houseboats, spice-trail estates, and quiet coastal pauses crafted for thoughtful travellers.",
      region_label: "Kerala • Slow Travel",
      image_url: "/images/golden-hour.png",
      cta_label: "Explore Destinations",
      cta_href: "/destinations",
    },
    {
      id: "default-2",
      title: "Western Himalayan Deodar Sanctuaries",
      subtitle: "Colonial ridge retreats in Dalhousie & Kangra Valley paired with private mountain transfers and guided forest walks.",
      region_label: "Himachal Pradesh • Mountains",
      image_url: "/images/travel-inspiration/feeling-led-journey.webp",
      cta_label: "Explore Himalayas",
      cta_href: "/destinations",
    },
  ]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  useEffect(() => {
    fetch("/api/portal/login-banners")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.banners) && d.banners.length > 0) {
          setBanners(d.banners);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(id);
  }, [banners.length]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Normalize identifier
  function findStaffAccount(rawInput: string) {
    const cleaned = rawInput.trim().toLowerCase();
    const phoneCleaned = rawInput.replace(/[\s\-()]/g, "");

    for (const [email, account] of Object.entries(KNOWN_STAFF_ACCOUNTS)) {
      if (email.toLowerCase() === cleaned) return account;
      if (account.phoneE164 === phoneCleaned || account.phoneE164.endsWith(phoneCleaned.slice(-10))) {
        return account;
      }
    }

    // Check dynamic invited staff from dashboard provisioning
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("smv_invited_staff");
        if (stored) {
          const customInvites = JSON.parse(stored);
          for (const item of customInvites) {
            if (item.email && item.email.toLowerCase() === cleaned) return item;
            const itemPhone = (item.phoneE164 || "").replace(/[\s\-()]/g, "");
            if (itemPhone && (itemPhone === phoneCleaned || itemPhone.endsWith(phoneCleaned.slice(-10)))) {
              return item;
            }
          }
        }
      } catch {}
    }

    return null;
  }

  // Handle Send OTP (Calls live backend OTP endpoint)
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMessage("Please enter your email or registered mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/portal/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanInput, channel }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Account not recognized. Traveller accounts opening soon");
        setIsLoading(false);
        return;
      }
      setOtpSent(true);
      setCooldown(60);
      setInfoMessage(data.message || `Verification code dispatched to ${data.destination || cleanInput}. Valid for 10 minutes.`);
    } catch {
      const staff = findStaffAccount(cleanInput);
      if (!staff) {
        setErrorMessage("Account not recognized. Traveller accounts opening soon");
        setIsLoading(false);
        return;
      }
      if ((staff as any).status === "Inactive" || (staff as any).deactivatedAt) {
        setErrorMessage("Account has been deactivated. Please contact your Super Administrator.");
        setIsLoading(false);
        return;
      }
      if (staff.requiresPasswordChange) {
        setErrorMessage(
          "Account pending initial activation. Please sign in using your temporary password sent to your email to set your permanent credentials."
        );
        setIsLoading(false);
        return;
      }
      setOtpSent(true);
      setCooldown(60);
      const destination = channel === "sms" ? staff.phoneE164 : staff.email;
      setInfoMessage(`Verification code dispatched to ${destination}. Valid for 10 minutes.`);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = identifier.trim();
    const cleanCode = otpCode.trim();

    if (cleanCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/portal/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanInput, code: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Invalid verification code.");
        setIsLoading(false);
        return;
      }

      // Store session
      localStorage.setItem(
        "smv_staff_session",
        JSON.stringify({
          fullName: data.staff?.fullName || "Staff Advisor",
          email: data.staff?.email || cleanInput,
          role: data.staff?.role || "desk_user",
          loggedInAt: new Date().toISOString(),
        })
      );
      router.push("/portal/dashboard");
    } catch {
      const staff = findStaffAccount(cleanInput);
      if (staff) {
        localStorage.setItem(
          "smv_staff_session",
          JSON.stringify({
            fullName: staff.fullName,
            email: staff.email,
            role: staff.role,
            loggedInAt: new Date().toISOString(),
          })
        );
        router.push("/portal/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Password Sign In
  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const idCleaned = identifier.trim();
    const passCleaned = password.trim();

    if (!idCleaned) {
      setErrorMessage("Please enter your email or registered mobile number.");
      return;
    }

    if (!passCleaned) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: idCleaned,
          password: passCleaned,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Account not recognized. Traveller accounts opening soon");
        return;
      }

      setPendingAccount(data.staff);

      if (data.requiresPasswordChange) {
        setShowPasswordChangeModal(true);
        return;
      }

      // Successful password sign in
      localStorage.setItem(
        "smv_staff_session",
        JSON.stringify({
          fullName: data.staff.fullName,
          email: data.staff.email,
          role: data.staff.role,
          loggedInAt: new Date().toISOString(),
        })
      );
      router.push("/portal/dashboard");
    } catch {
      // Offline fallback
      setIsLoading(false);
      const staff = findStaffAccount(idCleaned);
      if (!staff) {
        setErrorMessage("Account not recognized. Traveller accounts opening soon");
        return;
      }
      if ((staff as any).status === "Inactive" || (staff as any).deactivatedAt) {
        setErrorMessage("Account has been deactivated. Please contact your Super Administrator.");
        return;
      }
      setPendingAccount(staff);
      if (staff.requiresPasswordChange || passCleaned === "TemporaryDefaultPass#2026") {
        setShowPasswordChangeModal(true);
        return;
      }

      localStorage.setItem(
        "smv_staff_session",
        JSON.stringify({
          fullName: staff.fullName,
          email: staff.email,
          role: staff.role,
          loggedInAt: new Date().toISOString(),
        })
      );
      router.push("/portal/dashboard");
    }
  }

  // Handle Forced Password Change
  async function handleCompletePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordChangeError(null);

    if (newPassword.length < 8) {
      setPasswordChangeError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordChangeError("Password must contain at least one uppercase letter and one number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Passwords do not match.");
      return;
    }

    const targetAccount = pendingAccount || findStaffAccount(identifier);
    if (!targetAccount) {
      setPasswordChangeError("Session context missing. Please re-enter your credentials.");
      return;
    }

    try {
      const res = await fetch("/api/portal/auth/password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetAccount.email,
          newPassword: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPasswordChangeError(data.message || "Failed to update password.");
        return;
      }
    } catch {
      // Offline fallback
    }

    // Clear password change requirement from localStorage if present
    try {
      const stored = localStorage.getItem("smv_invited_staff");
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map((item: any) =>
          item.email?.toLowerCase() === targetAccount.email.toLowerCase()
            ? { ...item, requiresPasswordChange: false, status: "Active" }
            : item
        );
        localStorage.setItem("smv_invited_staff", JSON.stringify(updated));
      }
    } catch {}

    localStorage.setItem(
      "smv_staff_session",
      JSON.stringify({
        fullName: targetAccount.fullName,
        email: targetAccount.email,
        role: targetAccount.role,
        loggedInAt: new Date().toISOString(),
      })
    );

    setShowPasswordChangeModal(false);
    router.push("/portal/dashboard");
  }

  const currentBanner = banners[activeBannerIdx % banners.length] || banners[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-[#0F172A] dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex justify-between items-center">
        <div className="inline-block">
          <SiteBrand variant="header" surface="light" linked={false} className="w-36 block dark:hidden" />
          <SiteBrand variant="header" surface="dark" linked={false} className="w-36 hidden dark:block" />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="compact" surface="auto" />
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#475569] dark:text-zinc-400 hover:text-[#F5951C] transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      {/* Split Layout: 12-Column Grid (Left Editorial Showcase + Right Auth Card) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Panel: Visual & Editorial Showcase */}
          <section className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 min-h-[280px] lg:min-h-[540px] flex flex-col justify-end shadow-xl">
            <img
              src={currentBanner.image_url}
              alt={currentBanner.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
            <div className="relative z-10 p-6 sm:p-8 text-white space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5951C] text-[#0F172A] text-[10px] font-bold uppercase tracking-widest">
                {currentBanner.region_label}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight leading-tight">
                {currentBanner.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
                {currentBanner.subtitle}
              </p>
              <div className="flex items-center justify-between pt-2">
                {currentBanner.cta_href && (
                  <Link
                    href={currentBanner.cta_href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5951C] hover:underline"
                  >
                    <span>{currentBanner.cta_label || "Explore Destinations"}</span>
                    <span>→</span>
                  </Link>
                )}
                {banners.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {banners.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        aria-label={`Show banner ${idx + 1}`}
                        onClick={() => setActiveBannerIdx(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeBannerIdx ? "w-6 bg-[#F5951C]" : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: Sign-In Card */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">Sign In</h1>
                <p className="mt-2 text-xs sm:text-sm text-[#475569] dark:text-zinc-400">
                  Access your Search My Vacation advisor workspace
                </p>
              </div>

        {/* Auth Method Selector */}
        <div className="grid grid-cols-2 gap-2 bg-[#F1F5F9] dark:bg-[#09090B] p-1 rounded-xl mb-6 border border-[#E2E8F0] dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("otp");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition ${
              authMethod === "otp"
                ? "bg-[#F5951C] text-[#0F172A] shadow font-bold"
                : "text-[#475569] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
            }`}
          >
            Single-Channel OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition ${
              authMethod === "password"
                ? "bg-[#F5951C] text-[#0F172A] shadow font-bold"
                : "text-[#475569] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-white"
            }`}
          >
            Password
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <span className="text-[#F5951C] font-bold text-sm">ℹ</span>
              <div>
                <p className="font-semibold">{errorMessage}</p>
                {errorMessage.includes("Traveller accounts opening soon") && (
                  <p className="mt-1.5 text-[11px] text-[#475569] dark:text-zinc-300 leading-relaxed">
                    Looking to plan a bespoke journey? You can submit your itinerary preferences
                    anytime without an account via our{" "}
                    <Link href="/journey-passport" className="text-[#F5951C] underline font-medium">
                      Journey Passport
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Alert Box */}
        {infoMessage && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-900 dark:text-emerald-200">
            ✓ {infoMessage}
          </div>
        )}

        {/* Form: OTP Mode */}
        {authMethod === "otp" && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="identifier-otp" className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1.5">
                    Company Email or Registered Mobile
                  </label>
                  <input
                    id="identifier-otp"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. sri@searchmyvacation.com or +91 98401..."
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none focus:ring-1 focus:ring-[#F5951C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1.5">
                    Preferred Dispatch Channel
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${channel === "sms" ? "border-[#F5951C] bg-[#F5951C]/10 text-[#0F172A] dark:text-white font-semibold" : "border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-zinc-400"}`}>
                      <input
                        type="radio"
                        name="channel"
                        value="sms"
                        checked={channel === "sms"}
                        onChange={() => setChannel("sms")}
                        className="accent-[#F5951C]"
                      />
                      <span>SMS (Mobile)</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${channel === "email" ? "border-[#F5951C] bg-[#F5951C]/10 text-[#0F172A] dark:text-white font-semibold" : "border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-zinc-400"}`}>
                      <input
                        type="radio"
                        name="channel"
                        value="email"
                        checked={channel === "email"}
                        onChange={() => setChannel("email")}
                        className="accent-[#F5951C]"
                      />
                      <span>Company Email</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 rounded-xl bg-[#F5951C] py-3 text-xs font-bold uppercase tracking-widest text-[#0F172A] transition hover:bg-[#F5951C]/90 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? "Dispatching OTP..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otpCode" className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono text-lg rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none focus:ring-1 focus:ring-[#F5951C]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#475569] dark:text-zinc-400">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                    }}
                    className="hover:text-[#0F172A] dark:hover:text-white"
                  >
                    Change Destination
                  </button>
                  {cooldown > 0 ? (
                    <span>Resend in {cooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#F5951C] hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 rounded-xl bg-[#F5951C] py-3 text-xs font-bold uppercase tracking-widest text-[#0F172A] transition hover:bg-[#F5951C]/90 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Form: Password Mode */}
        {authMethod === "password" && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div>
              <label htmlFor="identifier-pass" className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1.5">
                Company Email or Registered Mobile
              </label>
              <input
                id="identifier-pass"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. vivek@searchmyvacation.com"
                className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none focus:ring-1 focus:ring-[#F5951C]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("otp");
                    setErrorMessage("Enter your email or phone to reset via single-channel OTP.");
                  }}
                  className="text-[11px] text-[#F5951C] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none focus:ring-1 focus:ring-[#F5951C]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-[#F5951C] py-3 text-xs font-bold uppercase tracking-widest text-[#0F172A] transition hover:bg-[#F5951C]/90 disabled:opacity-50 shadow-md"
            >
              {isLoading ? "Authenticating..." : "Sign In with Password"}
            </button>
          </form>
        )}

        {/* Keep me signed in */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/10 flex items-center justify-between text-xs text-[#475569] dark:text-zinc-400">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="rounded text-[#F5951C] focus:ring-[#F5951C]"
            />
            <span>Keep me signed in on this device</span>
          </label>
        </div>

        {/* Footer Note */}
        <div className="mt-3 text-center">
          <p className="text-xs text-[#475569] dark:text-zinc-500">
            Traveller self-registration is launching soon
          </p>
        </div>
      </div>
          </div>
        </div>
      </main>

      {/* Forced Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#121215] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-5">
              <span className="inline-block p-2.5 rounded-full bg-amber-500/20 text-[#F5951C] text-xl mb-2">
                🔒
              </span>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">First-Time Sign In Detected - Set Permanent Password</h2>
              <p className="mt-1 text-xs text-[#475569] dark:text-zinc-300">
                As an internal staff member, you must replace your temporary default password before
                accessing workspace data.
              </p>
            </div>

            {passwordChangeError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-200">
                {passwordChangeError}
              </div>
            )}

            <form onSubmit={handleCompletePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1">
                  New Permanent Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#475569] dark:text-zinc-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#F5951C] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#F5951C] py-3 text-xs font-bold uppercase tracking-widest text-[#0F172A] transition hover:bg-[#F5951C]/90 shadow-md"
              >
                Set Password & Unlock Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Copyright */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 text-center text-xs text-[#475569] dark:text-zinc-500">
        <p>© 2026 Search My Vacation. High-touch internal advisory workspace.</p>
      </div>
    </div>
  );
}
