"use client";

// EBC-R1.3-WS12-007 Phase 5: Journey Planning UI — Create (WS12-004 UX
// screen JP-03). Workspace-native form only (DEC-R1.3-014).
//
// EBC-R1.3-WS12-010 Defect D3 fix: adds the Origin Channel field
// (FR-JP-06/FR-JP-07), missing from the original WS12-007 delivery per
// Keerthi's WS12-009 QA finding. Options are filtered by record type: the
// "Corporate enquiry" channel is only offered for Corporate records,
// matching the validation.ts rule that ties the two together.
//
// EBC-R1.3-WS12-013 / WS12-012 §4: adds the "Trip Basics" panel — Number
// of Adults (required), Number of Children/Infants/Nights (present, not
// required, unset-vs-explicit-zero per BR-023), Intended Travel Month
// (month picker), Preferred Departure City (optional text) — placed after
// the existing Destination Region field and before Submit, exactly as
// WS12-012 §4.1 specifies. Budget and Exact Travel Date are deliberately
// absent (FR-JP-32/36, BR-020/024) — see WS12-012 §4.2/§7.
//
// EBC-R1.3-WS12-016 / PRA-01: the error banner shown on a failed submit
// now renders every field-specific validation message the API returns
// (validation.ts's JourneyPlanningFieldIssue list), not one generic
// "Invalid Journey Planning record." line — the SAME banner element as
// before, just a list inside it when there is more than one message. No
// new notification framework, no browser alert.
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
import {
  JOURNEY_PLANNING_ORIGIN_CHANNELS,
  type JourneyPlanningOriginChannel,
  type JourneyPlanningRecordKind,
} from "@/lib/workspace/journey-planning/types";

import { ORIGIN_CHANNEL_LABELS } from "./journeyPlanningLabels";
import TripBasicsPanel, { type TripBasicsValues, EMPTY_TRIP_BASICS_VALUES } from "./TripBasicsPanel";
import { useServiceCategoryOptions } from "./useServiceCategoryOptions";

export default function NewJourneyPlanningRecordForm() {
  const router = useRouter();
  const [recordKind, setRecordKind] = useState<JourneyPlanningRecordKind>("individual");
  const [title, setTitle] = useState("");
  const [destinationRegion, setDestinationRegion] = useState("");
  const [originChannel, setOriginChannel] = useState<JourneyPlanningOriginChannel | "">("");
  const [travellerFullName, setTravellerFullName] = useState("");
  const [travellerEmail, setTravellerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [tripBasics, setTripBasics] = useState<TripBasicsValues>(EMPTY_TRIP_BASICS_VALUES);
  const [submitting, setSubmitting] = useState(false);
  // EBC-R1.3-WS13-005 Phase 0 (CM-07): Service Category options.
  const serviceCategories = useServiceCategoryOptions();
  const [error, setError] = useState<string[] | null>(null);

  const availableOriginChannels = JOURNEY_PLANNING_ORIGIN_CHANNELS.filter(
    (channel) => recordKind === "corporate" || channel !== "corporate_enquiry",
  );

  function handleRecordKindChange(kind: JourneyPlanningRecordKind) {
    setRecordKind(kind);
    if (kind === "individual" && originChannel === "corporate_enquiry") {
      setOriginChannel("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const tripBasicsFields = {
      adults: tripBasics.adults === "" ? undefined : Number(tripBasics.adults),
      children: tripBasics.children === "" ? undefined : Number(tripBasics.children),
      infants: tripBasics.infants === "" ? undefined : Number(tripBasics.infants),
      intendedTravelMonth: tripBasics.intendedTravelMonth || undefined,
      nights: tripBasics.nights === "" ? undefined : Number(tripBasics.nights),
      preferredDepartureCity: tripBasics.preferredDepartureCity || undefined,
      // EBC-R1.3-WS13-005 Phase 0 (CM-07): optional while planning.
      serviceCategory: tripBasics.serviceCategory || undefined,
    };

    const body =
      recordKind === "individual"
        ? {
            recordKind,
            title,
            destinationRegion: destinationRegion || undefined,
            originChannel,
            newTraveller: { fullName: travellerFullName, email: travellerEmail || undefined },
            ...tripBasicsFields,
          }
        : {
            recordKind,
            title,
            destinationRegion: destinationRegion || undefined,
            originChannel,
            newCorporateContact: {
              companyName,
              contactName,
              contactEmail: contactEmail || undefined,
            },
            ...tripBasicsFields,
          };

    try {
      const response = await fetch("/api/workspace/journey-planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        // EBC-R1.3-WS12-016 / PRA-01: prefer the structured per-field
        // issues list when the API supplies one; fall back to the single
        // message for any error shape that does not (e.g. a 500, or a
        // network-level failure below).
        const issues: string[] = Array.isArray(result.issues) && result.issues.length > 0
          ? result.issues.map((issue: { message: string }) => issue.message)
          : [result.message ?? "Could not create the record."];
        setError(issues);
        setSubmitting(false);
        return;
      }
      router.push(`${WORKSPACE_JOURNEY_PLANNING_PATH}/${result.record.id}`);
    } catch {
      setError(["Could not reach the Workspace API."]);
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
            id="recordKind-individual"
            name="recordKind"
            checked={recordKind === "individual"}
            onChange={() => handleRecordKindChange("individual")}
          />
          Individual traveller
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            id="recordKind-corporate"
            name="recordKind"
            checked={recordKind === "corporate"}
            onChange={() => handleRecordKindChange("corporate")}
          />
          Corporate
        </label>
      </fieldset>

      <label htmlFor="title" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
        Title
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded border border-[var(--color-border-warm)] px-3 py-2"
          placeholder="e.g. Sharma family — Kerala backwaters, Nov"
        />
      </label>

      <label htmlFor="originChannel" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
        Origin channel
        <select
          id="originChannel"
          name="originChannel"
          required
          value={originChannel}
          onChange={(event) => setOriginChannel(event.target.value as JourneyPlanningOriginChannel)}
          className="rounded border border-[var(--color-border-warm)] px-3 py-2"
        >
          <option value="" disabled>
            Select how this opportunity arrived…
          </option>
          {availableOriginChannels.map((channel) => (
            <option key={channel} value={channel}>
              {ORIGIN_CHANNEL_LABELS[channel]}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="destinationRegion" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
        Destination region (optional)
        <input
          id="destinationRegion"
          name="destinationRegion"
          value={destinationRegion}
          onChange={(event) => setDestinationRegion(event.target.value)}
          className="rounded border border-[var(--color-border-warm)] px-3 py-2"
          placeholder="e.g. Southeast Asia"
        />
      </label>

      {recordKind === "individual" ? (
        <>
          <label htmlFor="travellerFullName" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Traveller full name
            <input
              id="travellerFullName"
              name="travellerFullName"
              required
              value={travellerFullName}
              onChange={(event) => setTravellerFullName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label htmlFor="travellerEmail" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Traveller email (optional)
            <input
              id="travellerEmail"
              name="travellerEmail"
              type="email"
              value={travellerEmail}
              onChange={(event) => setTravellerEmail(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
        </>
      ) : (
        <>
          <label htmlFor="companyName" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Company name
            <input
              id="companyName"
              name="companyName"
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label htmlFor="contactName" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Corporate contact name
            <input
              id="contactName"
              name="contactName"
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label htmlFor="contactEmail" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Corporate contact email (optional)
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
        </>
      )}

      <TripBasicsPanel
        values={tripBasics}
        onChange={setTripBasics}
        mode="create"
        serviceCategoryOptions={serviceCategories.options}
        serviceCategoryLoadFailed={serviceCategories.failed}
      />

      {error ? (
        <div className="rounded-lg bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-error)]">
          {error.length === 1 ? (
            <p>{error[0]}</p>
          ) : (
            <ul className="list-disc pl-4">
              {error.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
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
