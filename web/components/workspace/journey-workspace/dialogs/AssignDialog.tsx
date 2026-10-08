"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.6): JW-17 Assign / Reassign
// (UX Rev 4a §16; FR-JW-03, FR-JW-31; BR-026). User picker of active
// Workspace Users only (020B C-13), optional note. The confirm button stays
// disabled until a different user is chosen (020B S-5: owner_unchanged has
// no message). Calls POST …/reassign with the owner the page showed, so a
// colleague's change in the meantime comes back as `stale`.

import { useId, useState } from "react";

import { JOURNEY_NOTE_MAX_LENGTH } from "@/lib/workspace/journey-workspace/validation";
import type { JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { Dialog } from "../Dialog";
import { postJson, type ApiFailure, type DirectoryUser } from "../journeyApi";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FieldError, INPUT, Spinner } from "../primitives";

export default function AssignDialog({
  journeyId,
  journeyReference,
  currentOwnerId,
  isAdministrator,
  users,
  onClose,
  onSuccess,
  onFailure,
}: {
  journeyId: string;
  journeyReference: string;
  currentOwnerId: string | null;
  isAdministrator: boolean;
  users: DirectoryUser[] | null;
  onClose: () => void;
  onSuccess: (detail: JourneyDetail, newOwnerName: string) => void;
  onFailure: (failure: ApiFailure) => void;
}) {
  const [newOwnerId, setNewOwnerId] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const selectId = useId();
  const noteId = useId();

  const options = (users ?? []).filter((user) => user.isActive).sort((a, b) => a.displayName.localeCompare(b.displayName));
  const unchanged = newOwnerId === "" || newOwnerId === currentOwnerId;
  const noteTooLong = note.trim().length > JOURNEY_NOTE_MAX_LENGTH;
  const reason = newOwnerId === "" ? "Choose a Workspace User" : unchanged ? "Choose a different owner" : noteTooLong ? "Keep the note under 1,000 characters." : null;

  async function submit() {
    if (reason || busy) return;
    setBusy(true);
    setFieldError(null);
    const result = await postJson<{ journey: JourneyDetail }>(`/api/workspace/journey-workspace/${journeyId}/reassign`, {
      expectedOwnerId: currentOwnerId,
      newOwnerId,
      note,
    });
    setBusy(false);
    if (result.ok) {
      onSuccess(result.data.journey, options.find((user) => user.userId === newOwnerId)?.displayName ?? "the new owner");
      return;
    }
    if (result.code === "new_owner_invalid" || result.code === "note_too_long") {
      setFieldError(result.message);
      return;
    }
    onFailure(result);
  }

  return (
    <Dialog
      title={isAdministrator ? "Reassign Journey" : "Assign Journey"}
      onClose={onClose}
      description={<>Choose who owns {journeyReference}. Only active Workspace Users are listed.</>}
      footer={
        <>
          <button type="button" className={BUTTON_SECONDARY} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={BUTTON_PRIMARY}
            aria-disabled={Boolean(reason) || busy || undefined}
            title={reason ?? undefined}
            onClick={submit}
          >
            {busy ? <Spinner /> : null}
            {isAdministrator ? "Reassign" : "Assign"}
          </button>
        </>
      }
    >
      <div>
        <label htmlFor={selectId} className="text-sm font-semibold text-[var(--color-espresso)]">
          New owner
        </label>
        {users === null ? (
          <p className="mt-1 text-sm text-[var(--color-espresso)]/60">Loading Workspace Users…</p>
        ) : (
          <select
            id={selectId}
            data-autofocus
            value={newOwnerId}
            onChange={(event) => setNewOwnerId(event.target.value)}
            className={`${INPUT} mt-1`}
            aria-describedby={fieldError ? `${selectId}-error` : undefined}
          >
            <option value="">Choose a Workspace User</option>
            {options.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.displayName}
                {user.userId === currentOwnerId ? " (current owner)" : ""}
              </option>
            ))}
          </select>
        )}
        <FieldError id={`${selectId}-error`} message={fieldError} />
      </div>
      <div>
        <label htmlFor={noteId} className="text-sm font-semibold text-[var(--color-espresso)]">
          Note <span className="font-normal text-[var(--color-espresso)]/60">(optional)</span>
        </label>
        <textarea id={noteId} value={note} onChange={(event) => setNote(event.target.value)} rows={3} className={`${INPUT} mt-1`} />
        <p className="mt-1 text-xs text-[var(--color-espresso)]/60">The change and the note are recorded in History.</p>
      </div>
    </Dialog>
  );
}
