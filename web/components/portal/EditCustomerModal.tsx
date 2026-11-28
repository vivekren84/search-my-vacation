"use client";

import { useState } from "react";
import { MultiContactEditor, StructuredContact } from "./MultiContactEditor";

export interface EditableCustomer {
  id: string;
  customerCode: string;
  primaryName: string;
  primaryMobile: string | null;
  secondaryMobile: string | null;
  primaryEmail: string | null;
  contacts?: StructuredContact[];
  needsContactEnrichment: boolean;
}

interface EditCustomerModalProps {
  customer: EditableCustomer;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function EditCustomerModal({ customer, onClose, onSaved }: EditCustomerModalProps) {
  const [primaryName, setPrimaryName] = useState(customer.primaryName || "");
  const [primaryMobile, setPrimaryMobile] = useState(customer.primaryMobile || "");
  const [secondaryMobile, setSecondaryMobile] = useState(customer.secondaryMobile || "");
  const [primaryEmail, setPrimaryEmail] = useState(customer.primaryEmail || "");
  const [contacts, setContacts] = useState<StructuredContact[]>(
    Array.isArray(customer.contacts) ? customer.contacts : []
  );
  const [needsEnrichment, setNeedsEnrichment] = useState(Boolean(customer.needsContactEnrichment));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/crm/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customer.id,
          primaryName,
          primaryMobile,
          secondaryMobile,
          primaryEmail,
          contacts: contacts.map((c) => ({
            ...c,
            emails: c.emails.map((e) => e.trim()).filter(Boolean),
            phones: c.phones.map((p) => p.trim()).filter(Boolean),
          })),
          needsContactEnrichment: needsEnrichment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to update customer profile.");
        setSaving(false);
        return;
      }

      onSaved(data.message || `Customer ${customer.customerCode} updated.`);
    } catch (err: any) {
      setError(err?.message || "Network error while updating customer.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#CBD5E1] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#09090B] px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-white/40 focus:border-[#F5951C] focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-[#0F172A] dark:text-white shadow-2xl relative">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-[#E2E8F0] dark:border-white/10">
          <div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/30">
              {customer.customerCode}
            </span>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-1.5">
              Edit Customer Master Dossier
            </h3>
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
              Primary Name <span className="text-[#F5951C]">*</span>
            </label>
            <input
              type="text"
              required
              value={primaryName}
              onChange={(e) => setPrimaryName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Primary Mobile (E.164)
              </label>
              <input
                type="tel"
                value={primaryMobile}
                onChange={(e) => setPrimaryMobile(e.target.value)}
                placeholder="+91 98401 12233"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
                Secondary Mobile
              </label>
              <input
                type="tel"
                value={secondaryMobile}
                onChange={(e) => setSecondaryMobile(e.target.value)}
                placeholder="Optional alternate number"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-white/80 mb-1">
              Primary Email
            </label>
            <input
              type="email"
              value={primaryEmail}
              onChange={(e) => setPrimaryEmail(e.target.value)}
              placeholder="client@example.com"
              className={inputClass}
            />
          </div>

          <MultiContactEditor
            contacts={contacts}
            onChange={setContacts}
            maxContacts={2}
            addButtonLabel="+ Add Secondary Contact"
          />

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#475569] dark:text-zinc-300">
            <input
              type="checkbox"
              checked={needsEnrichment}
              onChange={(e) => setNeedsEnrichment(e.target.checked)}
              className="rounded text-[#F5951C] focus:ring-[#F5951C]"
            />
            <span>Flag as Needs Contact Enrichment</span>
          </label>

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
              {saving ? "Saving..." : "💾 Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
