"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): JW-15 Primary
// Operational Contact editor, a side panel (UX Rev 4a §13; FR-JW-01,
// FR-JW-19; BR-040). Validated in the browser with the same function the
// API uses (validateOperationalContactInput), so every problem shows at
// once (PRA-01 precedent); the server stays the control. Exactly one POC
// exists: there is no "add another contact" (D-12).

import { useState } from "react";

import { validateOperationalContactInput } from "@/lib/workspace/journey-workspace/validation";
import type { JourneyDetail, OperationalContact, OperationalContactType } from "@/lib/workspace/journey-workspace/types";

import { SidePanel } from "../Dialog";
import { postJson, type ApiFailure } from "../journeyApi";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Spinner } from "../primitives";
import ContactFields, { contactErrorsFrom, contactInputFrom, type ContactDraft, type ContactErrors } from "./ContactFields";

function draftFrom(contact: OperationalContact): ContactDraft {
  return {
    contactType: contact.contactType,
    name: contact.name,
    organisation: contact.organisation ?? "",
    phone: contact.phone ?? "",
    email: contact.email ?? "",
  };
}

export default function ContactEditor({
  journeyId,
  contact,
  contactTypes,
  onClose,
  onSuccess,
  onFailure,
}: {
  journeyId: string;
  contact: OperationalContact;
  contactTypes?: OperationalContactType[];
  onClose: () => void;
  onSuccess: (detail: JourneyDetail, changed: boolean) => void;
  onFailure: (failure: ApiFailure) => void;
}) {
  const initial = draftFrom(contact);
  const [draft, setDraft] = useState<ContactDraft>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [busy, setBusy] = useState(false);
  const dirty = (Object.keys(initial) as Array<keyof ContactDraft>).some((key) => initial[key].trim() !== draft[key].trim());

  async function save() {
    if (busy || !dirty) return;
    const checked = validateOperationalContactInput(contactInputFrom(draft));
    if ("issues" in checked) {
      setErrors(contactErrorsFrom(checked.issues));
      return;
    }
    setErrors({});
    setBusy(true);
    const result = await postJson<{ journey: JourneyDetail }>(
      `/api/workspace/journey-workspace/${journeyId}/contact`,
      checked.value,
      "PATCH",
    );
    setBusy(false);
    if (result.ok) {
      onSuccess(result.data.journey, true);
      return;
    }
    if (result.issues.length > 0) {
      setErrors(contactErrorsFrom(result.issues));
      return;
    }
    onFailure(result);
  }

  return (
    <SidePanel
      title="Primary Operational Contact"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={BUTTON_SECONDARY} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={BUTTON_PRIMARY}
            aria-disabled={!dirty || busy || undefined}
            title={!dirty ? "No changes yet" : undefined}
            onClick={save}
          >
            {busy ? <Spinner /> : null}
            Save
          </button>
        </>
      }
    >
      <ContactFields value={draft} onChange={setDraft} errors={errors} contactTypes={contactTypes} autoFocus />
      <p className="text-xs text-[var(--color-espresso)]/60">Changes are recorded in History.</p>
    </SidePanel>
  );
}
