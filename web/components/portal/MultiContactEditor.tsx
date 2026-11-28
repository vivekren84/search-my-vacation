"use client";

export interface StructuredContact {
  id: string;
  name: string;
  designation: string;
  emails: string[];
  phones: string[];
  is_primary: boolean;
}

interface MultiContactEditorProps {
  contacts: StructuredContact[];
  onChange: (next: StructuredContact[]) => void;
  maxContacts: number;
  addButtonLabel?: string;
}

export function MultiContactEditor({
  contacts,
  onChange,
  maxContacts,
  addButtonLabel = "+ Add Contact",
}: MultiContactEditorProps) {
  function addContact() {
    if (contacts.length >= maxContacts) return;
    onChange([
      ...contacts,
      {
        id: crypto.randomUUID(),
        name: "",
        designation: contacts.length === 0 ? "Primary Contact" : "Secondary Contact",
        emails: [""],
        phones: [""],
        is_primary: contacts.length === 0,
      },
    ]);
  }

  function removeContact(idx: number) {
    const next = contacts.filter((_, i) => i !== idx);
    if (next.length > 0 && !next.some((c) => c.is_primary)) {
      next[0] = { ...next[0], is_primary: true };
    }
    onChange(next);
  }

  function updateField(idx: number, patch: Partial<StructuredContact>) {
    onChange(contacts.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function updateArrayItem(idx: number, field: "emails" | "phones", itemIdx: number, val: string) {
    const target = contacts[idx];
    const nextArr = [...target[field]];
    nextArr[itemIdx] = val;
    updateField(idx, { [field]: nextArr });
  }

  function addArrayItem(idx: number, field: "emails" | "phones") {
    const target = contacts[idx];
    updateField(idx, { [field]: [...target[field], ""] });
  }

  function removeArrayItem(idx: number, field: "emails" | "phones", itemIdx: number) {
    const target = contacts[idx];
    updateField(idx, { [field]: target[field].filter((_, j) => j !== itemIdx) });
  }

  const inputCls =
    "w-full rounded-lg border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#09090B] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white focus:border-[#F5951C] focus:outline-none";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
          Structured Contacts ({contacts.length}/{maxContacts}) — All Optional
        </span>
        <button
          type="button"
          onClick={addContact}
          disabled={contacts.length >= maxContacts}
          className="px-2.5 py-1 rounded-lg bg-[#F5951C]/15 text-[#F5951C] border border-[#F5951C]/40 text-[11px] font-bold hover:bg-[#F5951C]/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {addButtonLabel}
        </button>
      </div>

      {contacts.length === 0 && (
        <p className="text-[11px] text-[#64748B] dark:text-zinc-500 italic">
          No contacts added yet. Click &ldquo;{addButtonLabel}&rdquo; to add one (optional).
        </p>
      )}

      {contacts.map((contact, idx) => (
        <div
          key={contact.id || idx}
          className="p-3 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#121215] space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-white">
              {contact.is_primary ? "★ Primary Contact" : `Contact #${idx + 1}`}
            </span>
            <button
              type="button"
              onClick={() => removeContact(idx)}
              className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Contact Name"
              value={contact.name}
              onChange={(e) => updateField(idx, { name: e.target.value })}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="Designation (e.g. Reservations / Sales)"
              value={contact.designation}
              onChange={(e) => updateField(idx, { designation: e.target.value })}
              className={inputCls}
            />
          </div>

          {/* Multiple Emails */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#475569] dark:text-zinc-400">
                Emails
              </span>
              <button
                type="button"
                onClick={() => addArrayItem(idx, "emails")}
                className="text-[10px] font-bold text-[#F5951C] hover:underline"
              >
                + Email
              </button>
            </div>
            {(contact.emails.length > 0 ? contact.emails : [""]).map((em, ei) => (
              <div key={ei} className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="email@domain.com"
                  value={em}
                  onChange={(e) => updateArrayItem(idx, "emails", ei, e.target.value)}
                  className={inputCls}
                />
                {contact.emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(idx, "emails", ei)}
                    className="px-2 py-1 text-xs text-rose-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Multiple Phones */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#475569] dark:text-zinc-400">
                Phone / Mobile Numbers
              </span>
              <button
                type="button"
                onClick={() => addArrayItem(idx, "phones")}
                className="text-[10px] font-bold text-[#F5951C] hover:underline"
              >
                + Phone
              </button>
            </div>
            {(contact.phones.length > 0 ? contact.phones : [""]).map((ph, pi) => (
              <div key={pi} className="flex items-center gap-1.5">
                <input
                  type="tel"
                  placeholder="+91 98400 12345"
                  value={ph}
                  onChange={(e) => updateArrayItem(idx, "phones", pi, e.target.value)}
                  className={inputCls}
                />
                {contact.phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(idx, "phones", pi)}
                    className="px-2 py-1 text-xs text-rose-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
