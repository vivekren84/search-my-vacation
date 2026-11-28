"use client";

import { useState } from "react";

interface ZohoGstImportModalProps {
  callerEmail: string;
  callerName: string;
  callerRole: string;
  onClose: () => void;
  onSynced: (message: string) => void;
}

export function ZohoGstImportModal({
  callerEmail,
  callerName,
  callerRole,
  onClose,
  onSynced,
}: ZohoGstImportModalProps) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"ready" | "conflicts" | "unmatched">("ready");
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setCsvText(text);
    setPreview(null);
    setErrorMsg(null);
  }

  async function runPreview() {
    if (!csvText.trim()) {
      setErrorMsg("Please upload a Zoho Books Vendors CSV file first.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/portal/crm/vendors/zoho-gst-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify({
          csvText,
          mode: "preview",
          callerEmail,
          callerName,
          callerRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Dry-run preview failed.");
        return;
      }
      setPreview(data);
    } catch {
      setErrorMsg("Network error while analyzing Zoho CSV.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/portal/crm/vendors/zoho-gst-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-staff-email": callerEmail,
          "x-staff-role": callerRole,
        },
        body: JSON.stringify({
          csvText,
          mode: "commit",
          overwriteExisting,
          callerEmail,
          callerName,
          callerRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Failed to commit Zoho GST updates.");
        return;
      }
      onSynced(`Zoho GST Sync complete: ${data.updatedCount} vendors updated.`);
    } catch {
      setErrorMsg("Network error during Zoho GST commit.");
    } finally {
      setLoading(false);
    }
  }

  function downloadUnmatchedCsv() {
    if (!preview?.unmatched?.length) return;
    const header = "Zoho Contact ID,Vendor Name,Email,Phone,GST Treatment,GSTIN\n";
    const lines = preview.unmatched
      .map(
        (u: any) =>
          `"${u.zohoContactId}","${(u.vendorName || "").replace(/"/g, '""')}","${u.email}","${u.phone}","${u.gstTreatment}","${u.gstin}"`
      )
      .join("\n");
    const blob = new Blob([header + lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SMV_Zoho_Unmatched_GST_Vendors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#E2E8F0] dark:border-white/15 bg-white dark:bg-[#121215] shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
              Import GST from Zoho Books CSV
            </h3>
            <p className="text-[11px] text-[#475569] dark:text-zinc-400">
              3-Tier Matcher (Email → Last-10-Digit Phone → Normalized Name) • Ignores <code>business_none</code> / empty GSTIN
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

        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="text-xs text-[#0F172A] dark:text-white flex-1"
            />
            <button
              type="button"
              onClick={runPreview}
              disabled={!csvText || loading}
              className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] font-bold uppercase tracking-wider hover:bg-[#e08515] disabled:opacity-40"
            >
              {loading ? "Analyzing..." : fileName ? "Run Dry-Run Preview" : "Analyze CSV"}
            </button>
          </div>

          {preview && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#475569] dark:text-zinc-400">
                <span>
                  Ignored <strong>{preview.ignoredBusinessNone}</strong> <code>business_none</code> / empty-GSTIN rows.
                </span>
                <label className="flex items-center gap-1.5 font-semibold text-[#0F172A] dark:text-white">
                  <input
                    type="checkbox"
                    checked={overwriteExisting}
                    onChange={(e) => setOverwriteExisting(e.target.checked)}
                  />
                  Overwrite existing GST conflicts ({preview.conflicts.length})
                </label>
              </div>

              <div className="flex gap-2 border-b border-[#E2E8F0] dark:border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("ready")}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    activeTab === "ready"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "text-[#475569] dark:text-zinc-400"
                  }`}
                >
                  Matched &amp; Ready ({preview.matchedReady.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("conflicts")}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    activeTab === "conflicts"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      : "text-[#475569] dark:text-zinc-400"
                  }`}
                >
                  Existing GST Conflict ({preview.conflicts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("unmatched")}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    activeTab === "unmatched"
                      ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      : "text-[#475569] dark:text-zinc-400"
                  }`}
                >
                  Unmatched Rows ({preview.unmatched.length})
                </button>
              </div>

              {activeTab === "unmatched" && preview.unmatched.length > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={downloadUnmatchedCsv}
                    className="px-3 py-1 rounded-lg border border-[#CBD5E1] dark:border-white/15 font-semibold text-[#0F172A] dark:text-white hover:border-[#F5951C]"
                  >
                    ⬇ Download Unmatched CSV
                  </button>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {(activeTab === "ready"
                  ? preview.matchedReady
                  : activeTab === "conflicts"
                    ? preview.conflicts
                    : preview.unmatched
                ).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-[#0F172A] dark:text-white">
                        {item.vendorName}
                        {item.vendorCode && (
                          <span className="ml-2 font-mono text-[10px] text-[#F5951C]">{item.vendorCode}</span>
                        )}
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-zinc-400">
                        {item.matchTier
                          ? `${item.matchTier} • Zoho: ${item.zohoName}${
                              item.newPhonesToAdd?.length ? ` • +${item.newPhonesToAdd.length} phone(s)` : ""
                            }`
                          : `${item.email || "No email"} • ${item.phone || "No phone"}`}
                      </p>
                    </div>
                    <div className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      {item.existingGst ? `${item.existingGst} → ` : ""}
                      {item.gstin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-xs font-semibold text-[#475569] dark:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={!preview || loading || (preview.matchedReady.length === 0 && (!overwriteExisting || preview.conflicts.length === 0))}
            className="px-4 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515] disabled:opacity-40"
          >
            {loading ? "Syncing..." : "Commit GST Updates"}
          </button>
        </div>
      </div>
    </div>
  );
}
