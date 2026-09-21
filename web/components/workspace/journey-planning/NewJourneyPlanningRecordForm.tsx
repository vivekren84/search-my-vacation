"use client";

// EBC-R1.3-WS12-007 Phase 5: Journey Planning UI — Create (WS12-004 UX
// screen JP-03). Workspace-native form only (DEC-R1.3-014).
//
// Known limitation (disclosed in the WS12-007 implementation report): this
// form always creates a NEW bootstrap Traveller/Corporate Contact inline
// (AD-WS12-001/AD-WS12-003) rather than offering a search-and-select
// picker over existing ones — Traveller Hub (WS14) does not exist yet, so
// there is no traveller directory to search. Re-planning for an existing
// traveller therefore currently creates a second bootstrap row rather than
// reusing one; this is flagged for QA and for the future WS14 migration.

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { WORKSPACE_JOURNEY_PLANNING_PATH } from "@/lib/workspace/shared/constants";
import type { JourneyPlanningRecordKind } from "@/lib/workspace/journey-planning/types";

export default function NewJourneyPlanningRecordForm() {
  const router = useRouter();
  const [recordKind, setRecordKind] = useState<JourneyPlanningRecordKind>("individual");
  const [title, setTitle] = useState("");
  const [destinationRegion, setDestinationRegion] = useState("");
  const [travellerFullName, setTravellerFullName] = useState("");
  const [travellerEmail, setTravellerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const body =
      recordKind === "individual"
        ? {
            recordKind,
            title,
            destinationRegion: destinationRegion || undefined,
            newTraveller: { fullName: travellerFullName, email: travellerEmail || undefined },
          }
        : {
            recordKind,
            title,
            destinationRegion: destinationRegion || undefined,
            newCorporateContact: {
              companyName,
              contactName,
              contactEmail: contactEmail || undefined,
            },
          };

    try {
      const response = await fetch("/api/workspace/journey-planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setError(result.message ?? "Could not create the record.");
        setSubmitting(false);
        return;
      }
      router.push(`${WORKSPACE_JOURNEY_PLANNING_PATH}/${result.record.id}`);
    } catch {
      setError("Could not reach the Workspace API.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <fieldset className="flex gap-4 text-sm text-[var(--color-espresso)]">
        <legend className="mb-1 text-sm font-semibold">Record type</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="recordKind"
            checked={recordKind === "individual"}
            onChange={() => setRecordKind("individual")}
          />
          Individual traveller
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="recordKind"
            checked={recordKind === "corporate"}
            onChange={() => setRecordKind("corporate")}
          />
          Corporate
        </label>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
        Title
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded border border-[var(--color-border-warm)] px-3 py-2"
          placeholder="e.g. Sharma family — Kerala backwaters, Nov"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
        Destination region (optional)
        <input
          value={destinationRegion}
          onChange={(event) => setDestinationRegion(event.target.value)}
          className="rounded border border-[var(--color-border-warm)] px-3 py-2"
          placeholder="e.g. Southeast Asia"
        />
      </label>

      {recordKind === "individual" ? (
        <>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Traveller full name
            <input
              required
              value={travellerFullName}
              onChange={(event) => setTravellerFullName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Traveller email (optional)
            <input
              type="email"
              value={travellerEmail}
              onChange={(event) => setTravellerEmail(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
        </>
      ) : (
        <>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Company name
            <input
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Corporate contact name
            <input
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Corporate contact email (optional)
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
        </>
      )}

      {error ? (
        <p className="rounded-lg bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-fit rounded-full bg-[var(--color-amber)] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[#e88a16] disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Record"}
      </button>
    </form>
  );
}
