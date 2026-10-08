"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): JW-12 lifecycle action
// dialogs, config-driven per action (UX Rev 4a §9.3 "Dialog content";
// EBC-R1.3-WS13-020B S-4, S-5 and §3). Each dialog says what will happen,
// asks for any required input, and confirms. Field problems stay in the
// dialog; any other refusal (stale page, permission, gate re-opened) is
// handed to the page, which shows a toast and reloads (UX §9.3, §24).
//
// Phase 1 copy decisions (disclosed in EBC-R1.3-WS13-026):
// - Mark as Completed: "This can't be undone." only — the archive-
//   eligibility sentence returns with Archive (Phase 3).
// - Place on hold: the Rev 4a reminder sentence is not shown — reminders
//   arrive with alerts (Phase 3); the dialog states only what happens now.
// - Cancel Journey: no open-bookings list — Vendor Bookings arrive in
//   Phase 2, so the request always carries an empty booking list.

import { useId, useState, type ReactNode } from "react";

import { JOURNEY_NOTE_MAX_LENGTH, JOURNEY_REASON_MAX_LENGTH } from "@/lib/workspace/journey-workspace/validation";
import type { JourneyActionKind, JourneyDetail, JourneyStage } from "@/lib/workspace/journey-workspace/types";

import { Dialog } from "../Dialog";
import { postJson, type ApiFailure, type ReadinessTemplateOption } from "../journeyApi";
import { actionLabel, JOURNEY_STAGE_LABELS } from "../journeyWorkspaceLabels";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FieldError, INPUT, Spinner } from "../primitives";

export type LifecycleDialogKind = Exclude<JourneyActionKind, "reassign" | "edit_service_category" | "edit_contact" | "adopt">;

type InputKind = "none" | "reason" | "note" | "template";

interface DialogConfig {
  input: InputKind;
  url: string;
  body: (state: { reason: string; note: string; templateId: string }) => Record<string, unknown>;
}

const TRANSITION_TARGET: Partial<Record<LifecycleDialogKind, JourneyStage>> = {
  mark_ready_to_travel: "ready_to_travel",
  mark_travelling: "travelling",
  mark_travel_complete: "travel_complete",
  begin_post_travel: "post_travel",
  step_back: "in_preparation",
};

function configFor(kind: LifecycleDialogKind, journeyId: string, expectedStage: JourneyStage): DialogConfig {
  const base = `/api/workspace/journey-workspace/${journeyId}`;
  switch (kind) {
    case "start_preparation":
      return { input: "template", url: `${base}/start-preparation`, body: ({ templateId }) => ({ expectedStage, templateId }) };
    case "place_on_hold":
      return { input: "reason", url: `${base}/hold`, body: ({ reason }) => ({ expectedStage, reason }) };
    case "resume":
      return { input: "none", url: `${base}/resume`, body: () => ({ expectedStage }) };
    case "cancel":
      return { input: "reason", url: `${base}/cancel`, body: ({ reason }) => ({ expectedStage, reason, cancellationTaskBookingIds: [] }) };
    case "mark_completed":
      return { input: "none", url: `${base}/close`, body: () => ({ expectedStage }) };
    case "step_back":
      return { input: "note", url: `${base}/transition`, body: ({ note }) => ({ expectedStage, toStage: "in_preparation", note }) };
    default:
      return { input: "none", url: `${base}/transition`, body: () => ({ expectedStage, toStage: TRANSITION_TARGET[kind] }) };
  }
}

export default function LifecycleDialog({
  kind,
  detail,
  templates,
  onClose,
  onSuccess,
  onFailure,
}: {
  kind: LifecycleDialogKind;
  detail: JourneyDetail;
  templates: ReadinessTemplateOption[] | null;
  onClose: () => void;
  onSuccess: (detail: JourneyDetail) => void;
  onFailure: (failure: ApiFailure) => void;
}) {
  const { journey, summary } = detail;
  const config = configFor(kind, journey.id, journey.stage);
  const label = actionLabel(kind, journey.stage);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const presetTemplate = journey.readinessTemplateId;
  const [templateId, setTemplateId] = useState(presetTemplate ?? "");
  const [busy, setBusy] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const inputId = useId();
  const groupId = useId();

  const chosenTemplate = (templates ?? []).find((template) => template.id === templateId) ?? null;
  const presetName = presetTemplate ? (detail.readinessTemplate?.name ?? chosenTemplate?.name ?? "the current template") : null;

  const disabledReason =
    config.input === "template" && templateId === ""
      ? "Choose a template"
      : config.input === "reason" && reason.trim() === ""
        ? "Add a reason."
        : config.input === "reason" && reason.trim().length > JOURNEY_REASON_MAX_LENGTH
          ? "Keep the reason under 500 characters."
          : config.input === "note" && note.trim().length > JOURNEY_NOTE_MAX_LENGTH
            ? "Keep the note under 1,000 characters."
            : null;

  async function submit() {
    if (disabledReason || busy) return;
    setBusy(true);
    setFieldError(null);
    const result = await postJson<{ journey: JourneyDetail }>(config.url, config.body({ reason, note, templateId }));
    setBusy(false);
    if (result.ok) {
      onSuccess(result.data.journey);
      return;
    }
    const fieldIssue = result.issues.find((issue) => ["reason", "note", "templateId"].includes(issue.field));
    if (fieldIssue) {
      setFieldError(fieldIssue.message);
      return;
    }
    if (["reason_required", "reason_too_long", "note_too_long", "template_invalid"].includes(result.code)) {
      setFieldError(result.message);
      return;
    }
    onFailure(result);
  }

  let description: ReactNode = null;
  switch (kind) {
    case "start_preparation":
      description = presetName ? null : "Choose the readiness template for this Journey.";
      break;
    case "mark_ready_to_travel":
      description =
        summary.readinessMandatoryTotal === 0
          ? "This template has no readiness items yet, so nothing was checked."
          : "All mandatory readiness items are resolved. The Journey moves to Ready to Travel.";
      break;
    case "mark_travelling":
      description = "The Journey moves to Travelling.";
      break;
    case "mark_travel_complete":
      description = "The Journey moves to Travel Complete.";
      break;
    case "begin_post_travel":
      description = "The Journey moves to Post Travel for follow-up.";
      break;
    case "mark_completed":
      description = "This can't be undone.";
      break;
    case "step_back":
      description = "Use this if something that was ready no longer is — for example a visa refused.";
      break;
    case "place_on_hold":
      description = `The Journey stays at ${JOURNEY_STAGE_LABELS[journey.stage]} until you resume it.`;
      break;
    case "resume":
      description = `Returns to ${JOURNEY_STAGE_LABELS[journey.stage]}.`;
      break;
    case "cancel":
      description = "Cancelling can't be undone. The Journey and its history are kept.";
      break;
  }

  return (
    <Dialog
      title={label}
      onClose={onClose}
      description={description}
      footer={
        <>
          <button type="button" className={BUTTON_SECONDARY} onClick={onClose}>
            {kind === "cancel" ? "Keep Journey" : "Cancel"}
          </button>
          <span className="inline-flex flex-col items-end gap-1">
            <button
              type="button"
              className={BUTTON_PRIMARY}
              aria-disabled={Boolean(disabledReason) || busy || undefined}
              aria-describedby={disabledReason ? `${inputId}-reason` : undefined}
              title={disabledReason ?? undefined}
              onClick={submit}
              data-autofocus={config.input === "none" ? true : undefined}
            >
              {busy ? <Spinner /> : null}
              {label}
            </button>
            {disabledReason ? (
              <span id={`${inputId}-reason`} className="sr-only">
                {disabledReason}
              </span>
            ) : null}
          </span>
        </>
      }
    >
      {config.input === "template" ? (
        presetName ? (
          <p className="text-sm text-[var(--color-espresso)]">
            Template: <span className="font-semibold">{presetName}</span> (set at adoption)
          </p>
        ) : (
          <fieldset aria-describedby={`${groupId}-help`}>
            <legend className="text-sm font-semibold text-[var(--color-espresso)]">Readiness template</legend>
            {templates === null ? (
              <p className="mt-2 text-sm text-[var(--color-espresso)]/60">Loading templates…</p>
            ) : templates.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--color-espresso)]/70">No readiness templates are available. Ask an Administrator.</p>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {templates.map((template, index) => (
                  <label
                    key={template.id}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-warm)] px-3 py-2.5 text-sm text-[var(--color-espresso)] has-[:checked]:border-[var(--color-amber)] has-[:checked]:bg-[rgb(245_149_28_/_8%)]"
                  >
                    <input
                      type="radio"
                      name={groupId}
                      value={template.id}
                      checked={templateId === template.id}
                      onChange={() => setTemplateId(template.id)}
                      data-autofocus={index === 0 ? true : undefined}
                      className="accent-[var(--color-amber)]"
                    />
                    {template.name}
                  </label>
                ))}
              </div>
            )}
            <p id={`${groupId}-help`} className="mt-2 text-xs text-[var(--color-espresso)]/60">
              The readiness template is chosen separately from the Service Category.
            </p>
          </fieldset>
        )
      ) : null}

      {config.input === "template" && chosenTemplate && chosenTemplate.itemCount === 0 ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--color-espresso)]/5 px-3 py-2 text-sm text-[var(--color-espresso)]/80">
          This template doesn&apos;t have readiness items yet, so nothing will be checked before Ready to Travel.
        </p>
      ) : null}

      {config.input === "reason" ? (
        <div>
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-espresso)]">
            Reason
          </label>
          <textarea
            id={inputId}
            data-autofocus
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-invalid={Boolean(fieldError) || undefined}
            aria-describedby={fieldError ? `${inputId}-error` : undefined}
            className={`${INPUT} mt-1`}
          />
          <FieldError id={`${inputId}-error`} message={fieldError} />
        </div>
      ) : null}

      {config.input === "note" ? (
        <div>
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-espresso)]">
            Note <span className="font-normal text-[var(--color-espresso)]/60">(optional)</span>
          </label>
          <textarea
            id={inputId}
            data-autofocus
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-describedby={fieldError ? `${inputId}-error` : undefined}
            className={`${INPUT} mt-1`}
          />
          <FieldError id={`${inputId}-error`} message={fieldError} />
        </div>
      ) : null}

      {config.input !== "reason" && config.input !== "note" && fieldError ? (
        <FieldError id={`${inputId}-error`} message={fieldError} />
      ) : null}
    </Dialog>
  );
}
