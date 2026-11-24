"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import SiteBrand from "@/components/brand/SiteBrand";
import { StaffAvatar, AvatarPresetId } from "@/components/portal/StaffAvatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

interface StaffProfile {
  userId: string;
  email: string;
  fullName: string;
  phoneE164: string;
  role: string;
  professionalTitle: string;
  department: string;
  destinationSpecializations: string[];
  spokenLanguages: string[];
  signatureArchetype: string;
  clientBio: string;
  timezoneWorkingHours: string;
  emergencyStandbyContact: string;
  avatarPresetId: AvatarPresetId;
  avatarImageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const PRESET_OPTIONS: Array<{ id: AvatarPresetId; label: string; desc: string }> = [
  {
    id: "monogram",
    label: "Monogram Crest",
    desc: "Dynamic user initials in an artisanal double-ring crest",
  },
  {
    id: "compass",
    label: "Compass Rose",
    desc: "Eight-point slow-travel expedition nautical compass",
  },
  {
    id: "chinar",
    label: "Chinar Leaf",
    desc: "Artisanal Kashmiri Chinar leaf slow-travel heritage motif",
  },
  {
    id: "contour",
    label: "Horizon Contour",
    desc: "Sunset mountain ridge topography and horizon arc",
  },
];

export default function StaffProfilePage() {
  const router = useRouter();
  const { themePreference, setThemePreference } = useTheme();

  const [session, setSession] = useState<{ email: string; fullName: string; role: string } | null>(
    null
  );
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Locked governance notice modal
  const [showGovernanceNotice, setShowGovernanceNotice] = useState(false);
  const [governanceFieldClicked, setGovernanceFieldClicked] = useState("");

  // In-place password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // New tag inputs
  const [newDestinationTag, setNewDestinationTag] = useState("");
  const [newLanguageTag, setNewLanguageTag] = useState("");

  // Image file upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Load session & fetch profile
  useEffect(() => {
    try {
      const raw = localStorage.getItem("smv_staff_session");
      if (!raw) {
        router.replace("/portal/login");
        return;
      }
      const parsed = JSON.parse(raw);
      setSession(parsed);
      loadProfile(parsed.email);
    } catch {
      router.replace("/portal/login");
    }
  }, [router]);

  async function loadProfile(email: string) {
    setIsLoading(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/portal/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.profile) {
          setProfile(data.profile);
        }
      } else {
        setSaveError("Failed to retrieve profile data from workspace service.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Network error loading profile.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Save Editable Profile
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          email: profile.email,
          fullName: profile.fullName,
          professionalTitle: profile.professionalTitle,
          department: profile.department,
          destinationSpecializations: profile.destinationSpecializations,
          spokenLanguages: profile.spokenLanguages,
          signatureArchetype: profile.signatureArchetype,
          clientBio: profile.clientBio,
          timezoneWorkingHours: profile.timezoneWorkingHours,
          emergencyStandbyContact: profile.emergencyStandbyContact,
          avatarPresetId: profile.avatarPresetId,
          avatarImageUrl: profile.avatarImageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSaveSuccess("Advisor atelier profile successfully updated.");
        // Sync local session display name if modified
        if (session && profile.fullName !== session.fullName) {
          const updatedSession = { ...session, fullName: profile.fullName };
          localStorage.setItem("smv_staff_session", JSON.stringify(updatedSession));
          setSession(updatedSession);
        }
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveError(data.message || "Failed to update atelier profile.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  // Client-side crop to 1:1 WebP (400x400) and strip EXIF via Canvas
  async function handleAvatarFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      setSaveError("Please upload a PNG, JPEG, or WebP photo.");
      return;
    }

    setIsUploadingAvatar(true);
    setSaveError(null);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });

      // Canvas 1:1 center-crop to 400x400
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize image processing canvas.");

      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 400, 400);
      URL.revokeObjectURL(objectUrl);

      // Export as WebP
      const webpBase64 = canvas.toDataURL("image/webp", 0.9);

      // Upload via API
      const res = await fetch("/api/portal/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          email: profile.email,
          imageBase64: webpBase64,
          mimeType: "image/webp",
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.avatarUrl) {
        setProfile({
          ...profile,
          avatarImageUrl: data.avatarUrl,
        });
        setSaveSuccess("Studio portrait successfully uploaded and updated.");
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveError(data.message || "Failed to upload avatar image.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Error processing image file.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Handle In-Place Password Rotation
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setIsChangingPassword(true);
    setPasswordChangeSuccess(null);
    setPasswordChangeError(null);

    try {
      const res = await fetch("/api/portal/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setPasswordChangeSuccess(
          "Password successfully updated. Your new credentials are active immediately."
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordChangeSuccess(null), 5000);
      } else {
        setPasswordChangeError(data.message || "Password change failed.");
      }
    } catch (err: any) {
      setPasswordChangeError(err.message || "Network error updating password.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  // Tag Helpers
  function handleAddDestinationTag(e: React.KeyboardEvent | React.MouseEvent) {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const tag = newDestinationTag.trim();
    if (tag && profile && !profile.destinationSpecializations.includes(tag)) {
      setProfile({
        ...profile,
        destinationSpecializations: [...profile.destinationSpecializations, tag],
      });
      setNewDestinationTag("");
    }
  }

  function handleRemoveDestinationTag(tagToRemove: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      destinationSpecializations: profile.destinationSpecializations.filter(
        (t) => t !== tagToRemove
      ),
    });
  }

  function handleAddLanguageTag(e: React.KeyboardEvent | React.MouseEvent) {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const tag = newLanguageTag.trim();
    if (tag && profile && !profile.spokenLanguages.includes(tag)) {
      setProfile({
        ...profile,
        spokenLanguages: [...profile.spokenLanguages, tag],
      });
      setNewLanguageTag("");
    }
  }

  function handleRemoveLanguageTag(tagToRemove: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      spokenLanguages: profile.spokenLanguages.filter((t) => t !== tagToRemove),
    });
  }

  function triggerLockedNotice(fieldName: string) {
    setGovernanceFieldClicked(fieldName);
    setShowGovernanceNotice(true);
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] flex items-center justify-center text-[#0F172A] dark:text-[#F4F4F5] text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#F5951C] border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-[#475569] dark:text-[#94A3B8]">
            Loading Atelier Advisor Profile...
          </span>
        </div>
      </div>
    );
  }

  const roleLabel =
    profile.role === "super_admin"
      ? "Super Admin / Atelier Principal"
      : profile.role === "administrator"
      ? "Administrator"
      : profile.role === "privilege_user"
      ? "Senior Travel Designer"
      : "Travel Atelier Advisor";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-[#0F172A] dark:text-[#F4F4F5] flex flex-col font-sans transition-colors duration-200">
      {/* Anchored Top Header: Dusk Horizon Split */}
      <header className="border-b border-white/10 bg-[#0F172A] dark:bg-[#09090B] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/portal/dashboard" className="inline-block">
            <SiteBrand variant="header" surface="dark" className="w-32 sm:w-36 text-white" />
          </Link>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#F5951C] font-semibold">
              Atelier Workspace
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-white/80 text-xs font-medium">Advisor Profile</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="compact" />
          <Link
            href="/portal/dashboard"
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 hover:border-[#F5951C] transition shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Page Heading & Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F172A] dark:text-white">
              Advisor Workspace Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              Manage your Slow-Travel Atelier credentials, signature archetypes, executive visuals,
              and security settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#F5951C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition shadow-md disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </div>

        {/* Feedback Banners */}
        {saveSuccess && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <span className="font-semibold">✓ {saveSuccess}</span>
            <button onClick={() => setSaveSuccess(null)} className="text-emerald-700 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {saveError && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-900 dark:text-red-200 flex items-center justify-between">
            <span className="font-semibold">⚠ {saveError}</span>
            <button onClick={() => setSaveError(null)} className="text-red-700 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Visual Avatar Suite & Locked Governance */}
          <div className="space-y-6">
            {/* Visual Studio Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                  Executive Avatar
                </h2>
                <span className="text-[11px] font-semibold text-[#F5951C]">Studio Suite</span>
              </div>

              {/* Active Avatar Display */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#09090B] rounded-2xl border border-[#E2E8F0] dark:border-white/5 space-y-3">
                <StaffAvatar
                  avatarUrl={profile.avatarImageUrl}
                  presetId={profile.avatarPresetId}
                  name={profile.fullName}
                  size="2xl"
                  className="shadow-xl"
                />
                <div className="text-center">
                  <p className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {profile.fullName}
                  </p>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    {profile.professionalTitle}
                  </p>
                  <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5951C]/15 text-[#F5951C]">
                    {profile.avatarImageUrl ? "Custom Portrait" : `Preset: ${profile.avatarPresetId}`}
                  </span>
                </div>
              </div>

              {/* Custom Studio Portrait Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#0F172A] dark:text-white">
                    Upload Studio Portrait
                  </label>
                  {profile.avatarImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, avatarImageUrl: null })}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Revert to Preset
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#E2E8F0] dark:border-white/20 bg-[#F8FAFC] dark:bg-[#09090B] px-4 py-3 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C] hover:text-[#F5951C] transition"
                >
                  {isUploadingAvatar ? (
                    <span>Cropping & Uploading (400×400 WebP)...</span>
                  ) : (
                    <>
                      <span>📷 Select Photo (WebP, PNG, JPG)</span>
                      <span className="text-[10px] text-[#475569] dark:text-white/50">• Max 500 KB</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] text-center">
                  Photos are cropped client-side to 1:1 WebP (EXIF stripped) into the{" "}
                  <code className="text-[#F5951C]">staff-avatars</code> bucket.
                </p>
              </div>

              {/* Curated 4 Executive Presets */}
              <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0] dark:border-white/10">
                <label className="text-xs font-semibold text-[#0F172A] dark:text-white">
                  Curated Executive SVG Presets
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_OPTIONS.map((opt) => {
                    const isSelected =
                      profile.avatarPresetId === opt.id && !profile.avatarImageUrl;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            avatarPresetId: opt.id,
                            avatarImageUrl: null,
                          })
                        }
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 text-center transition ${
                          isSelected
                            ? "border-[#F5951C] bg-[#F5951C]/10 text-[#0F172A] dark:text-white font-bold ring-1 ring-[#F5951C]"
                            : "border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] text-[#475569] dark:text-white/70 hover:border-white/30"
                        }`}
                      >
                        <StaffAvatar
                          presetId={opt.id}
                          name={profile.fullName}
                          size="md"
                        />
                        <span className="text-[11px] leading-tight">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Locked Governance Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">🔒</span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                    Governance Locks
                  </h2>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#475569] dark:text-white/60">
                  Read Only
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Core identity and authorization fields are locked at the database layer to ensure
                compliance and OTP verification integrity.
              </p>

              {/* Locked Field 1: Company Email */}
              <div
                onClick={() => triggerLockedNotice("Company Email")}
                className="p-3 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] cursor-pointer hover:border-amber-500/50 transition group space-y-1"
              >
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-white/50">
                  <span>Company Email</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[#F5951C] transition">
                    Locked 🔒
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-white truncate">
                  {profile.email}
                </p>
              </div>

              {/* Locked Field 2: Registered Mobile */}
              <div
                onClick={() => triggerLockedNotice("Registered Mobile")}
                className="p-3 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] cursor-pointer hover:border-amber-500/50 transition group space-y-1"
              >
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-white/50">
                  <span>Registered Mobile (OTP Challenge Target)</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[#F5951C] transition">
                    Locked 🔒
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-white">
                  {profile.phoneE164 || "Not Registered"}
                </p>
              </div>

              {/* Locked Field 3: Permission Role Tier */}
              <div
                onClick={() => triggerLockedNotice("Permission Role Tier")}
                className="p-3 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] cursor-pointer hover:border-amber-500/50 transition group space-y-1"
              >
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-white/50">
                  <span>Permission Role Tier</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[#F5951C] transition">
                    Locked 🔒
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                    {roleLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5951C]/15 text-[#F5951C] font-semibold">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Workspace Theme Preference Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                  Workspace Theme
                </h2>
                <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Active: <strong className="capitalize text-[#F5951C]">{themePreference}</strong>
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Switch between Dusk Horizon Editorial Split (Light) and Sunset Horizon Obsidian (Dark).
              </p>
              <div className="pt-2">
                <ThemeToggle variant="segmented" className="w-full justify-between" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Editable Atelier Fields & Security Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Atelier Fields Form */}
            <form
              onSubmit={handleSaveProfile}
              className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                    Atelier Professional Details
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    These details curate your advisor signature on client proposals, journey itineraries,
                    and communications.
                  </p>
                </div>
              </div>

              {/* Row 1: Full Name & Professional Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="e.g. Vivek Renganathan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Advisor Professional Title
                  </label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, professionalTitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="e.g. Senior Slow-Travel Atelier Curator"
                  />
                </div>
              </div>

              {/* Row 2: Department & Signature Archetype */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Department / Atelier Desk
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="e.g. Bespoke Slow-Travel Atelier"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Signature Journey Archetype
                  </label>
                  <input
                    type="text"
                    value={profile.signatureArchetype}
                    onChange={(e) =>
                      setProfile({ ...profile, signatureArchetype: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="e.g. Slow-Paced Cultural Immersion & Heritage"
                  />
                </div>
              </div>

              {/* Destination Specializations (Interactive Tags) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80">
                  Regional Destination Specializations
                </label>
                <div className="flex flex-wrap gap-2 items-center p-3 rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B]">
                  {profile.destinationSpecializations.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveDestinationTag(tag)}
                        className="text-xs hover:text-red-500 font-bold"
                        title={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={newDestinationTag}
                      onChange={(e) => setNewDestinationTag(e.target.value)}
                      onKeyDown={handleAddDestinationTag}
                      placeholder="+ Add region and press Enter"
                      className="w-full text-xs bg-transparent text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:outline-none"
                    />
                    {newDestinationTag.trim() && (
                      <button
                        type="button"
                        onClick={handleAddDestinationTag}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5951C] text-[#0F172A]"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Spoken Languages (Interactive Tags) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80">
                  Spoken Languages
                </label>
                <div className="flex flex-wrap gap-2 items-center p-3 rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B]">
                  {profile.spokenLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-white/10"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguageTag(lang)}
                        className="text-xs hover:text-red-500 font-bold"
                        title={`Remove ${lang}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={newLanguageTag}
                      onChange={(e) => setNewLanguageTag(e.target.value)}
                      onKeyDown={handleAddLanguageTag}
                      placeholder="+ Add language and press Enter"
                      className="w-full text-xs bg-transparent text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:outline-none"
                    />
                    {newLanguageTag.trim() && (
                      <button
                        type="button"
                        onClick={handleAddLanguageTag}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5951C] text-[#0F172A]"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Client-Facing Bio / Quote */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                  Client-Facing Atelier Bio / Quote
                </label>
                <textarea
                  rows={3}
                  value={profile.clientBio}
                  onChange={(e) => setProfile({ ...profile, clientBio: e.target.value })}
                  className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] p-3 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none"
                  placeholder="Share a short slow-travel philosophy or personal introduction shown to travellers on journey documents..."
                />
              </div>

              {/* Row 3: Timezone & Emergency Standby */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Timezone & Working Hours
                  </label>
                  <input
                    type="text"
                    value={profile.timezoneWorkingHours}
                    onChange={(e) =>
                      setProfile({ ...profile, timezoneWorkingHours: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="Asia/Kolkata (09:30 - 18:30)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1.5">
                    Secondary / Emergency Standby Contact
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyStandbyContact}
                    onChange={(e) =>
                      setProfile({ ...profile, emergencyStandbyContact: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    placeholder="e.g. +91 98401 22334 (Operations Duty Desk)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-[#E2E8F0] dark:border-white/10">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#F5951C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition shadow-md disabled:opacity-50"
                >
                  {isSaving ? "Saving Atelier Profile..." : "Update Atelier Profile"}
                </button>
              </div>
            </form>

            {/* In-Place Password Rotation Security Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#F5951C]/15 text-[#F5951C] text-sm">
                    🔐
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                      Security & Password Rotation
                    </h2>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                      Rotate your permanent account password with verified session authorization.
                    </p>
                  </div>
                </div>
              </div>

              {passwordChangeSuccess && (
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200">
                  ✓ {passwordChangeSuccess}
                </div>
              )}

              {passwordChangeError && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-900 dark:text-red-200">
                  ⚠ {passwordChangeError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1">
                    Current Active Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1">
                      New Permanent Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-white/80 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#09090B] px-3.5 py-2 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password Policy Checklist */}
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] text-xs space-y-1.5">
                  <p className="font-semibold text-[#0F172A] dark:text-white">
                    Password Security Policy:
                  </p>
                  <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <li
                      className={
                        newPassword.length >= 8
                          ? "text-emerald-600 font-semibold"
                          : "text-[#475569] dark:text-white/50"
                      }
                    >
                      {newPassword.length >= 8 ? "✓" : "○"} 8+ Characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(newPassword)
                          ? "text-emerald-600 font-semibold"
                          : "text-[#475569] dark:text-white/50"
                      }
                    >
                      {/[A-Z]/.test(newPassword) ? "✓" : "○"} Uppercase (A-Z)
                    </li>
                    <li
                      className={
                        /[0-9]/.test(newPassword)
                          ? "text-emerald-600 font-semibold"
                          : "text-[#475569] dark:text-white/50"
                      }
                    >
                      {/[0-9]/.test(newPassword) ? "✓" : "○"} Number (0-9)
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(newPassword)
                          ? "text-emerald-600 font-semibold"
                          : "text-[#475569] dark:text-white/50"
                      }
                    >
                      {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} Symbol (!@#$)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword || !newPassword}
                    className="rounded-xl border border-[#F5951C] bg-[#F5951C]/15 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#F5951C] hover:bg-[#F5951C] hover:text-[#0F172A] transition disabled:opacity-50"
                  >
                    {isChangingPassword ? "Verifying..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Locked Governance Notice Modal */}
      {showGovernanceNotice && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-amber-500/20 text-[#F5951C] text-xl">
                🔒
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                  Governance Policy Lock
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Field: <strong className="text-[#F5951C]">{governanceFieldClicked}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-white/80 leading-relaxed">
              To prevent authorization drift and protect OTP authentication channels,{" "}
              <strong>Company Email</strong>, <strong>Registered Mobile</strong>, and{" "}
              <strong>Permission Role Tiers</strong> are locked against direct staff modification.
            </p>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 text-xs text-[#475569] dark:text-[#94A3B8] space-y-1">
              <p className="font-semibold text-[#0F172A] dark:text-white">
                Authorized Governance Desk:
              </p>
              <p>
                Please contact the Super Admin / Atelier Principal:
              </p>
              <p className="font-mono text-[#F5951C]">
                Vivek Renganathan — vivek@searchmyvacation.com
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowGovernanceNotice(false)}
                className="rounded-xl bg-[#F5951C] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:bg-[#e08515] transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
