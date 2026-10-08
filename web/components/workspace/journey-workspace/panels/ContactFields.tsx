"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): the Primary Operational
// Contact fields (UX Rev 4a §13 JW-15; BR-040), shared by the contact
// editor and the legacy adoption panel so both validate and read the same.
// Type (four options), name (required), organisation (required for
// Corporate organisation and B2B travel partner), phone and/or email.

import { useId } from "react";

import { OPERATIONAL_CONTACT_TYPES, type OperationalContactType } from "@/lib/workspace/journey-workspace/types";

import { CONTACT_TYPE_LABELS } from "../journeyWorkspaceLabels";
import { FieldError, INPUT } from "../primitives";

export interface ContactDraft {
  contactType: OperationalContactType | "";
  name: string;
  organisation: string;
  phone: string;
  email: string;
}

export type ContactErrors = Partial<Record<"contactType" | "name" | "organisation" | "phone", string>>;

export function organisationRequired(type: ContactDraft["contactType"]): boolean {
  return type === "corporate_organisation" || type === "b2b_travel_partner";
}

export default function ContactFields({
  value,
  onChange,
  errors,
  contactTypes,
  autoFocus = false,
}: {
  value: ContactDraft;
  onChange: (next: ContactDraft) => void;
  errors: ContactErrors;
  contactTypes?: OperationalContactType[];
  autoFocus?: boolean;
}) {
  const id = useId();
  const types = contactTypes && contactTypes.length > 0 ? contactTypes : OPERATIONAL_CONTACT_TYPES;
  const set = (patch: Partial<ContactDraft>) => onChange({ ...value, ...patch });
  const errorId = (field: keyof ContactErrors) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <div className="flex flex-col gap-4">
      <fieldset aria-describedby={errorId("contactType")}>
        <legend className="text-sm font-semibold text-[var(--color-espresso)]">Contact type</legend>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {types.map((type, index) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-warm)] bg-white px-3 py-2 text-sm text-[var(--color-espresso)] has-[:checked]:border-[var(--color-amber)] has-[:checked]:bg-[rgb(245_149_28_/_8%)]"
            >
              <input
                type="radio"
                name={`${id}-type`}
                value={type}
                checked={value.contactType === type}
                onChange={() => set({ contactType: type })}
                data-autofocus={autoFocus && (value.contactType === type || (value.contactType === "" && index === 0)) ? true : undefined}
                className="accent-[var(--color-amber)]"
              />
              {CONTACT_TYPE_LABELS[type]}
            </label>
          ))}
        </div>
        <FieldError id={`${id}-contactType-error`} message={errors.contactType} />
      </fieldset>

      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-semibold text-[var(--color-espresso)]">
          Name
        </label>
        <input
          id={`${id}-name`}
          value={value.name}
          onChange={(event) => set({ name: event.target.value })}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={errorId("name")}
          autoComplete="off"
          className={`${INPUT} mt-1`}
        />
        <FieldError id={`${id}-name-error`} message={errors.name} />
      </div>

      <div>
        <label htmlFor={`${id}-organisation`} className="text-sm font-semibold text-[var(--color-espresso)]">
          Organisation{" "}
          {organisationRequired(value.contactType) ? null : <span className="font-normal text-[var(--color-espresso)]/60">(optional)</span>}
        </label>
        <input
          id={`${id}-organisation`}
          value={value.organisation}
          onChange={(event) => set({ organisation: event.target.value })}
          aria-invalid={Boolean(errors.organisation) || undefined}
          aria-describedby={errorId("organisation")}
          autoComplete="off"
          className={`${INPUT} mt-1`}
        />
        <FieldError id={`${id}-organisation-error`} message={errors.organisation} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className="text-sm font-semibold text-[var(--color-espresso)]">
            Phone
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            value={value.phone}
            onChange={(event) => set({ phone: event.target.value })}
            aria-invalid={Boolean(errors.phone) || undefined}
            aria-describedby={errorId("phone")}
            autoComplete="off"
            className={`${INPUT} mt-1`}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-semibold text-[var(--color-espresso)]">
            Email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            value={value.email}
            onChange={(event) => set({ email: event.target.value })}
            aria-invalid={Boolean(errors.phone) || undefined}
            aria-describedby={errorId("phone")}
            autoComplete="off"
            className={`${INPUT} mt-1`}
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-[var(--color-espresso)]/60">Add a phone number, an email address, or both.</p>
      <FieldError id={`${id}-phone-error`} message={errors.phone} />
    </div>
  );
}

// Field issues from validateOperationalContactInput or the API (optionally
// prefixed "contact." by the adoption route) → per-field messages.
export function contactErrorsFrom(issues: Array<{ field: string; message: string }>, prefix = ""): ContactErrors {
  const errors: ContactErrors = {};
  for (const issue of issues) {
    const field = prefix && issue.field.startsWith(prefix) ? issue.field.slice(prefix.length) : issue.field;
    if (field === "contactType" || field === "name" || field === "organisation" || field === "phone") errors[field] ??= issue.message;
  }
  return errors;
}

export function contactInputFrom(draft: ContactDraft) {
  return {
    contactType: draft.contactType,
    name: draft.name,
    organisation: draft.organisation,
    phone: draft.phone,
    email: draft.email,
  };
}
