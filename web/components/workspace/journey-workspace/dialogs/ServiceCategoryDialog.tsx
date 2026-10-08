"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): Service Category picker
// opened from the header meta-line pencil (UX Rev 4a §36.2 "the only place
// it is edited"; FR-JW-30). Options come from configuration (UX §26). The
// confirm button stays disabled until the value changes (020B S-5:
// service_category_unchanged has no message).

import { useId, useState } from "react";

import type { JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { Dialog } from "../Dialog";
import { postJson, type ApiFailure } from "../journeyApi";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FieldError, Spinner } from "../primitives";

export default function ServiceCategoryDialog({
  journeyId,
  current,
  categories,
  onClose,
  onSuccess,
  onFailure,
}: {
  journeyId: string;
  current: string | null;
  categories: Array<{ code: string; label: string }> | null;
  onClose: () => void;
  onSuccess: (detail: JourneyDetail) => void;
  onFailure: (failure: ApiFailure) => void;
}) {
  const [value, setValue] = useState(current ?? "");
  const [busy, setBusy] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const groupId = useId();
  const reason = value === "" ? "Choose a Service Category." : value === current ? "Choose a different Service Category" : null;

  async function submit() {
    if (reason || busy) return;
    setBusy(true);
    setFieldError(null);
    const result = await postJson<{ journey: JourneyDetail }>(
      `/api/workspace/journey-workspace/${journeyId}/service-category`,
      { serviceCategory: value },
      "PATCH",
    );
    setBusy(false);
    if (result.ok) {
      onSuccess(result.data.journey);
      return;
    }
    if (result.code === "service_category_invalid" || result.code === "service_category_required") {
      setFieldError(result.message);
      return;
    }
    onFailure(result);
  }

  return (
    <Dialog
      title="Service Category"
      onClose={onClose}
      description="Changing the category is recorded in History. It doesn't change the itinerary or need a replacement Journey."
      footer={
        <>
          <button type="button" className={BUTTON_SECONDARY} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={BUTTON_PRIMARY} aria-disabled={Boolean(reason) || busy || undefined} title={reason ?? undefined} onClick={submit}>
            {busy ? <Spinner /> : null}
            Save
          </button>
        </>
      }
    >
      <fieldset>
        <legend className="sr-only">Service Category</legend>
        {categories === null ? (
          <p className="text-sm text-[var(--color-espresso)]/60">Loading Service Categories…</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.code}
                className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-warm)] px-3 py-2.5 text-sm text-[var(--color-espresso)] has-[:checked]:border-[var(--color-amber)] has-[:checked]:bg-[rgb(245_149_28_/_8%)]"
              >
                <input
                  type="radio"
                  name={groupId}
                  value={category.code}
                  checked={value === category.code}
                  onChange={() => setValue(category.code)}
                  data-autofocus={value === category.code || (value === "" && category === categories[0]) ? true : undefined}
                  className="accent-[var(--color-amber)]"
                />
                {category.label}
              </label>
            ))}
          </div>
        )}
      </fieldset>
      <FieldError id={`${groupId}-error`} message={fieldError} />
    </Dialog>
  );
}
