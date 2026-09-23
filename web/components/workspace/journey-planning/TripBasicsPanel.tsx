"use client";

// EBC-R1.3-WS12-013 / EBC-R1.3-WS12-012 §4: the "Trip Basics" field group
// (Planning Parameters, FR-JP-31–34/36, BR-020/021/023/024). Shared by the
// Create Record form (NewJourneyPlanningRecordForm.tsx) and the Detail
// screen's in-place editing panel (JourneyPlanningRecordDetailView.tsx),
// per WS12-012 §5.2 ("the same fields, the same grouping and terminology"
// reappearing in both places) — one component, not two copies of the same
// field set.
//
// Implements:
//  - Two labelled sub-groups, "Who's travelling" and "When & where from"
//    (§4.2), inside one panel — not a wizard (Decision Log #1).
//  - Three-tag terminology: "Required" (Adults only), "Needed before
//    Planning" (the other five), no tag for ordinary-optional fields
//    (§4.3, Decision Log #2) — this panel only ever renders the first two,
//    since every field it owns is one or the other.
//  - The explicit-zero problem (§4.4, BR-023, Decision Log #3): Children,
//    Infants and Nights start unset (empty, shown via placeholder "—"
//    rather than a silent 0), with a "Set to 0" affordance that appears
//    only while the field is still unset.
//  - Intended Travel Month uses the native HTML month input, whose
//    `YYYY-MM` value format matches the stored column exactly (no custom
//    month-picker component exists in this codebase to reuse, and the
//    native control already satisfies "month + year, no day").
//
// Known limitation (disclosed in the WS12-013 engineering report):
// Preferred Departure City is a plain text field, not the "existing-value
// typeahead" WS12-012 §4.2 describes reusing from Destination/Region —
// Destination/Region itself (NewJourneyPlanningRecordForm.tsx) is also a
// plain text input today, with no typeahead component built anywhere in
// this codebase yet to reuse. Matching the actual current pattern (plain
// text) rather than inventing a new typeahead component was judged the
// smaller, more consistent change; flagged for Sri/Keerthi.

export interface TripBasicsValues {
  adults: string;
  children: string;
  infants: string;
  intendedTravelMonth: string;
  nights: string;
  preferredDepartureCity: string;
}

export const EMPTY_TRIP_BASICS_VALUES: TripBasicsValues = {
  adults: "",
  children: "",
  infants: "",
  intendedTravelMonth: "",
  nights: "",
  preferredDepartureCity: "",
};

interface TripBasicsPanelProps {
  values: TripBasicsValues;
  onChange: (values: TripBasicsValues) => void;
  // Purely documentary for now — every field below behaves identically at
  // creation and during Discovery editing (WS12-012 §5.2: "the same
  // fields... now editable in place"). Kept so call sites can state their
  // intent without this component needing to branch on it today.
  mode?: "create" | "detail";
}

const REQUIRED_TAG = (
  <span className="rounded-full bg-[var(--color-amber)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-espresso)]">
    Required
  </span>
);

const NEEDED_BEFORE_PLANNING_TAG = (
  <span className="rounded-full border border-dashed border-[var(--color-border-warm)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-espresso)]/60">
    Needed before Planning
  </span>
);

function ZeroValidNumberField({
  id,
  label,
  helperText,
  value,
  onChange,
}: {
  id: string;
  label: string;
  helperText: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
      <span className="flex items-center gap-2">
        {label}
        {NEEDED_BEFORE_PLANNING_TAG}
      </span>
      <span className="flex items-center gap-2">
        <input
          id={id}
          name={id}
          type="number"
          min={0}
          step={1}
          value={value}
          placeholder="—"
          onChange={(event) => onChange(event.target.value)}
          className="w-28 rounded border border-[var(--color-border-warm)] px-3 py-2"
        />
        {value === "" ? (
          <button
            type="button"
            onClick={() => onChange("0")}
            className="rounded-full border border-[var(--color-border-warm)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)]/70 hover:bg-black/5"
          >
            Set to 0
          </button>
        ) : null}
      </span>
      <span className="text-xs text-[var(--color-espresso)]/50">{helperText}</span>
    </label>
  );
}

export default function TripBasicsPanel({ values, onChange }: TripBasicsPanelProps) {
  function set<K extends keyof TripBasicsValues>(key: K, value: TripBasicsValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <fieldset className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] p-4">
      <legend className="px-1 text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">
        Trip Basics
      </legend>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)]/60">
          Who&apos;s travelling
        </p>
        <div className="flex flex-wrap gap-4">
          <label htmlFor="tripBasics-adults" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            <span className="flex items-center gap-2">Number of Adults {REQUIRED_TAG}</span>
            <input
              id="tripBasics-adults"
              name="tripBasics-adults"
              type="number"
              min={1}
              step={1}
              value={values.adults}
              placeholder="—"
              onChange={(event) => set("adults", event.target.value)}
              className="w-28 rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
            <span className="text-xs text-[var(--color-espresso)]/50">At least one traveller is always needed.</span>
          </label>

          <ZeroValidNumberField
            id="tripBasics-children"
            label="Number of Children"
            helperText="Add now if you know — you can fill this in later during Discovery."
            value={values.children}
            onChange={(next) => set("children", next)}
          />

          <ZeroValidNumberField
            id="tripBasics-infants"
            label="Number of Infants"
            helperText="Add now if you know — you can fill this in later during Discovery."
            value={values.infants}
            onChange={(next) => set("infants", next)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border-warm)] pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)]/60">
          When &amp; where from
        </p>
        <div className="flex flex-wrap gap-4">
          <label
            htmlFor="tripBasics-intendedTravelMonth"
            className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]"
          >
            <span className="flex items-center gap-2">Intended Travel Month {NEEDED_BEFORE_PLANNING_TAG}</span>
            <input
              id="tripBasics-intendedTravelMonth"
              name="tripBasics-intendedTravelMonth"
              type="month"
              value={values.intendedTravelMonth}
              onChange={(event) => set("intendedTravelMonth", event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
            <span className="text-xs text-[var(--color-espresso)]/50">
              An approximate month is fine — exact dates come later.
            </span>
          </label>

          <ZeroValidNumberField
            id="tripBasics-nights"
            label="Number of Nights"
            helperText="Roughly how many nights, even as an estimate."
            value={values.nights}
            onChange={(next) => set("nights", next)}
          />

          <label
            htmlFor="tripBasics-preferredDepartureCity"
            className="flex flex-1 min-w-[12rem] flex-col gap-1 text-sm text-[var(--color-espresso)]"
          >
            <span className="flex items-center gap-2">Preferred Departure City {NEEDED_BEFORE_PLANNING_TAG}</span>
            <input
              id="tripBasics-preferredDepartureCity"
              name="tripBasics-preferredDepartureCity"
              value={values.preferredDepartureCity}
              onChange={(event) => set("preferredDepartureCity", event.target.value)}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
              placeholder="e.g. Mumbai"
            />
            <span className="text-xs text-[var(--color-espresso)]/50">Where the group will be flying from.</span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}
