"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): JW-17 legacy adoption,
// Administrator only (UX Rev 4a §16, §36.2; BR-036, BR-040, BR-043;
// EBC-R1.3-WS13-020B C-14; PO Decision 5). Owner (pre-filled from the
// current owner when active), confirmed start and end dates with the
// nights note beneath them, readiness template, Service Category
// (required, no pre-selection, never suggested) and the Primary
// Operational Contact (pre-filled from the existing contact or the party).
// "Adopt Journey" moves the Journey to Confirmed (M11 adopt_legacy).

import { useId, useMemo, useState } from "react";

import { validateOperationalContactInput } from "@/lib/workspace/journey-workspace/validation";
import type { JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { SidePanel } from "../Dialog";
import { postJson, type ApiFailure, type DirectoryUser, type JourneyReferenceData } from "../journeyApi";
import { daysBetweenDates } from "../journeyWorkspaceLabels";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FieldError, INPUT, SECTION_TITLE, Spinner } from "../primitives";
import ContactFields, { contactErrorsFrom, contactInputFrom, type ContactDraft, type ContactErrors } from "./ContactFields";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function initialContact(detail: JourneyDetail): ContactDraft {
  if (detail.contact) {
    return {
      contactType: detail.contact.contactType,
      name: detail.contact.name,
      organisation: detail.contact.organisation ?? "",
      phone: detail.contact.phone ?? "",
      email: detail.contact.email ?? "",
    };
  }
  const corporate = detail.party.kind === "corporate";
  return {
    contactType: corporate ? "corporate_organisation" : "individual_traveller",
    name: detail.party.name ?? "",
    organisation: corporate ? (detail.party.companyName ?? "") : "",
    phone: "",
    email: "",
  };
}

type FieldErrors = Partial<Record<"ownerId" | "confirmedStartDate" | "confirmedEndDate" | "serviceCategory" | "readinessTemplateId", string>>;

export default function AdoptionPanel({
  detail,
  users,
  reference,
  onClose,
  onSuccess,
  onFailure,
}: {
  detail: JourneyDetail;
  users: DirectoryUser[] | null;
  reference: JourneyReferenceData | null;
  onClose: () => void;
  onSuccess: (detail: JourneyDetail) => void;
  onFailure: (failure: ApiFailure) => void;
}) {
  const id = useId();
  const storedNights = detail.journey.nights;
  const activeUsers = useMemo(
    () => (users ?? []).filter((user) => user.isActive).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [users],
  );
  const [ownerId, setOwnerId] = useState(detail.owner?.active ? detail.owner.id : "");
  const [start, setStart] = useState(detail.journey.confirmedStartDate ?? "");
  const [end, setEnd] = useState(detail.journey.confirmedEndDate ?? "");
  const [templateId, setTemplateId] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState<ContactDraft>(() => initialContact(detail));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [busy, setBusy] = useState(false);

  const datesValid = ISO_DATE.test(start) && ISO_DATE.test(end);
  const span = datesValid && end >= start ? daysBetweenDates(start, end) : null;
  const datesError = datesValid && end < start ? "The end date can't be before the start date." : null;
  const mismatch = span !== null && storedNights !== null && span !== storedNights;

  const missing =
    ownerId === ""
      ? "Choose an owner"
      : !datesValid
        ? "Enter both the start and end dates."
        : datesError
          ? datesError
          : mismatch
            ? "Change the dates so they match the nights."
            : templateId === ""
              ? "Choose a template"
              : category === ""
                ? "Choose a Service Category."
                : null;

  async function submit() {
    if (busy || missing) return;
    const checkedContact = validateOperationalContactInput(contactInputFrom(contact));
    if ("issues" in checkedContact) {
      setContactErrors(contactErrorsFrom(checkedContact.issues));
      return;
    }
    setContactErrors({});
    setErrors({});
    setBusy(true);
    const result = await postJson<{ journey: JourneyDetail }>(`/api/workspace/journey-workspace/${detail.journey.id}/adopt`, {
      ownerId,
      confirmedStartDate: start,
      confirmedEndDate: end,
      serviceCategory: category,
      readinessTemplateId: templateId,
      contact: checkedContact.value,
    });
    setBusy(false);
    if (result.ok) {
      onSuccess(result.data.journey);
      return;
    }
    if (result.issues.length > 0) {
      const next: FieldErrors = {};
      for (const issue of result.issues) {
        if (issue.field in { ownerId: 1, confirmedStartDate: 1, confirmedEndDate: 1, serviceCategory: 1, readinessTemplateId: 1 }) {
          next[issue.field as keyof FieldErrors] ??=
            issue.code === "dates_nights_mismatch" && span !== null && storedNights !== null
              ? nightsMismatchText(span, storedNights)
              : issue.message;
        }
      }
      setErrors(next);
      setContactErrors(contactErrorsFrom(result.issues, "contact."));
      return;
    }
    if (result.code === "new_owner_invalid") {
      setErrors({ ownerId: result.message });
      return;
    }
    if (result.code === "dates_nights_mismatch" || result.code === "dates_invalid" || result.code === "dates_required") {
      setErrors({ confirmedEndDate: result.code === "dates_nights_mismatch" && span !== null && storedNights !== null ? nightsMismatchText(span, storedNights) : result.message });
      return;
    }
    if (result.code === "template_invalid") {
      setErrors({ readinessTemplateId: result.message });
      return;
    }
    if (result.code === "service_category_invalid" || result.code === "service_category_required") {
      setErrors({ serviceCategory: result.message });
      return;
    }
    if (result.code === "contact_invalid") {
      setContactErrors(contactErrorsFrom(result.issues, "contact."));
      return;
    }
    onFailure(result);
  }

  const nightsNote =
    storedNights !== null
      ? `The original record says ${storedNights} night${storedNights === 1 ? "" : "s"}. The dates must cover ${storedNights} night${storedNights === 1 ? "" : "s"}.`
      : span !== null
        ? `No nights were recorded. They'll be set from these dates: ${span} night${span === 1 ? "" : "s"}.`
        : "No nights were recorded. They'll be set from these dates.";

  const endError = errors.confirmedEndDate ?? datesError ?? (mismatch && span !== null && storedNights !== null ? nightsMismatchText(span, storedNights) : null);

  return (
    <SidePanel
      title="Complete adoption"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={BUTTON_SECONDARY} onClick={onClose}>
            Cancel
          </button>
          <span className="inline-flex flex-col items-end gap-1">
            <button
              type="button"
              className={BUTTON_PRIMARY}
              aria-disabled={Boolean(missing) || busy || undefined}
              aria-describedby={missing ? `${id}-missing` : undefined}
              title={missing ?? undefined}
              onClick={submit}
            >
              {busy ? <Spinner /> : null}
              Adopt Journey
            </button>
            {missing ? (
              <span id={`${id}-missing`} className="text-xs text-[var(--color-espresso)]/60">
                {missing}
              </span>
            ) : null}
          </span>
        </>
      }
    >
      <p className="text-sm text-[var(--color-espresso)]/75">
        {detail.journey.journeyReference} was created before the Journey Workspace. Adopting it moves it to Confirmed.
      </p>

      <div>
        <label htmlFor={`${id}-owner`} className="text-sm font-semibold text-[var(--color-espresso)]">
          Journey Owner
        </label>
        <select
          id={`${id}-owner`}
          data-autofocus
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
          aria-describedby={errors.ownerId ? `${id}-owner-error` : undefined}
          className={`${INPUT} mt-1`}
        >
          <option value="">{users === null ? "Loading Workspace Users…" : "Choose a Workspace User"}</option>
          {activeUsers.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.displayName}
            </option>
          ))}
        </select>
        <FieldError id={`${id}-owner-error`} message={errors.ownerId} />
      </div>

      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-start`} className="text-sm font-semibold text-[var(--color-espresso)]">
              Confirmed travel start
            </label>
            <input
              id={`${id}-start`}
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              aria-describedby={`${id}-nights${errors.confirmedStartDate ? ` ${id}-start-error` : ""}`}
              className={`${INPUT} mt-1`}
            />
            <FieldError id={`${id}-start-error`} message={errors.confirmedStartDate} />
          </div>
          <div>
            <label htmlFor={`${id}-end`} className="text-sm font-semibold text-[var(--color-espresso)]">
              Confirmed travel end
            </label>
            <input
              id={`${id}-end`}
              type="date"
              value={end}
              min={start || undefined}
              onChange={(event) => setEnd(event.target.value)}
              aria-invalid={Boolean(endError) || undefined}
              aria-describedby={`${id}-nights${endError ? ` ${id}-end-error` : ""}`}
              className={`${INPUT} mt-1`}
            />
          </div>
        </div>
        <p id={`${id}-nights`} className="mt-2 text-xs text-[var(--color-espresso)]/70" aria-live="polite">
          {nightsNote}
        </p>
        <FieldError id={`${id}-end-error`} message={endError} />
      </div>

      <fieldset aria-describedby={errors.readinessTemplateId ? `${id}-template-error` : undefined}>
        <legend className="text-sm font-semibold text-[var(--color-espresso)]">Readiness template</legend>
        <div className="mt-2 flex flex-col gap-2">
          {(reference?.readinessTemplates ?? []).map((template) => (
            <label
              key={template.id}
              className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-warm)] bg-white px-3 py-2 text-sm text-[var(--color-espresso)] has-[:checked]:border-[var(--color-amber)] has-[:checked]:bg-[rgb(245_149_28_/_8%)]"
            >
              <input
                type="radio"
                name={`${id}-template`}
                checked={templateId === template.id}
                onChange={() => setTemplateId(template.id)}
                className="accent-[var(--color-amber)]"
              />
              {template.name}
            </label>
          ))}
          {reference === null ? <p className="text-sm text-[var(--color-espresso)]/60">Loading templates…</p> : null}
        </div>
        <p className="mt-2 text-xs text-[var(--color-espresso)]/60">The readiness template is chosen separately from the Service Category.</p>
        <FieldError id={`${id}-template-error`} message={errors.readinessTemplateId} />
      </fieldset>

      <div>
        <label htmlFor={`${id}-category`} className="text-sm font-semibold text-[var(--color-espresso)]">
          Service Category
        </label>
        <select
          id={`${id}-category`}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-describedby={`${id}-category-help${errors.serviceCategory ? ` ${id}-category-error` : ""}`}
          className={`${INPUT} mt-1`}
        >
          <option value="">Choose a Service Category</option>
          {(reference?.serviceCategories ?? []).map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
        <p id={`${id}-category-help`} className="mt-1 text-xs text-[var(--color-espresso)]/60">
          Choose the category that best describes this traveller experience. It isn&apos;t set automatically.
        </p>
        <FieldError id={`${id}-category-error`} message={errors.serviceCategory} />
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border-warm)] pt-4">
        <h3 className={SECTION_TITLE}>Primary Operational Contact</h3>
        <ContactFields value={contact} onChange={setContact} errors={contactErrors} contactTypes={reference?.contactTypes} />
      </div>
    </SidePanel>
  );
}

// 020B S-5 dates_nights_mismatch (adoption).
function nightsMismatchText(span: number, stored: number): string {
  return `These dates cover ${span} night${span === 1 ? "" : "s"}, but the original record says ${stored}. Change the dates so they match.`;
}
