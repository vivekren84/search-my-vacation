"use client";

import { useState } from "react";

export interface EditableStaffMember {
  fullName: string;
  email: string;
  phoneE164: string;
  role: string;
}

interface EditStaffModalProps {
  member: EditableStaffMember;
  callerEmail: string;
  onClose: () => void;
  onSaved: (updated: { email: string; fullName: string; phoneE164: string }, message: string) => void;
}

export function EditStaffModal({ member, callerEmail, onClose, onSaved }: EditStaffModalProps) {
  const [fullName, setFullName] = useState(member.fullName || "");
  const [phoneE164, setPhoneE164] = useState(member.phoneE164 || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phoneE164.trim()) {
      setError("Full Name and Registered Mobile are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/auth/invite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
        },
        body: JSON.stringify({
          email: member.email,
          fullName: fullName.trim(),
          phoneE164: phoneE164.trim(),
          callerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to update staff details.");
        setSaving(false);
        return;
      }

      onSaved(
        { email: member.email, fullName: fullName.trim(), phoneE164: phoneE164.trim() },
        data.message || `Updated details for ${fullName.trim()}.`
      );
    } catch (err: any) {
      setError(err?.message || "Network error while updating staff details.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-md w-full p-6 text-[#0F172A] dark:text-white shadow-2xl relative">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-[#E2E8F0] dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
              Edit Staff Member Details
            </h3>
            <p className="text-xs text-[#475569] dark:text-zinc-400">
              {member.email} • {member.role.replace("_", " ")}
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
              Display Name <span className="text-[#F5951C]">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
              Registered Mobile (E.164) <span className="text-[#F5951C]">*</span>
            </label>
            <input
              type="tel"
              required
              value={phoneE164}
              onChange={(e) => setPhoneE164(e.target.value)}
              placeholder="+918925838542"
              className={`${inputClass} font-mono`}
            />
            <p className="text-[10px] text-[#64748B] dark:text-zinc-400 mt-1">
              Used for single-channel SMS OTP authentication.
            </p>
          </div>

          <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/20 font-semibold text-[#475569] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] transition disabled:opacity-50 shadow-md"
            >
              {saving ? "Saving..." : "💾 Save Staff Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
