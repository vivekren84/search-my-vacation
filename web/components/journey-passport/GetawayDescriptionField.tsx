"use client";

// EBC-R1.2-WS6-09 (Rad, Phase 3). The "Describe your ideal getaway"
// free-text field, per EBC-R1.2-WS6-05 §5 (Sophie, UX Specification) and
// its architectural counterpart in EBC-R1.2-WS6-03 Addendum 01 §1 (Archie).
// Field label and helper text are Product Owner / approved-UX-spec copy,
// reproduced verbatim, not authored here.
//
// Phase 3 scope, per this EBC's explicit instruction, covers exactly:
// textarea, helper text, placeholder, placeholder-ignore behaviour, and
// the field's persistence model (../../lib/journey-passport/getaway-description.ts).
// Two items the approved UX spec separately *recommends* — auto-grow
// beyond the fixed row count, and a near-limit character counter — are
// explicitly NOT implemented here: neither is in this phase's five-item
// scope, and the spec itself (§5.3) flags both as recommendations for
// Tiger/Arjun to confirm, not settled requirements. A future phase or a
// dedicated polish EBC can add either without changing this field's data
// contract.
//
// NOT YET WIRED into JourneyPassportMoments.tsx / JourneyPassportState —
// that integration is Phase 4's explicit scope ("Journey Passport
// Integration"). This component is self-contained and controlled entirely
// by its own props, mirroring the precedent set by PreferredDestinationsField
// in Phase 2, so Phase 4 can wire it in without further changes here.
//
// Visual language (label, helper text, input border/background/focus
// styling) is reused verbatim from PreferredDestinationsField.tsx (this
// same workstream, Phase 2) and the existing textarea precedent in
// components/contact/CallbackRequest.tsx, per EBC-R1.2-WS6-05 §3.2's
// instruction that both destination fields share "the same card treatment,
// same label typography, same spacing rhythm."

import { useId } from "react";

import { GETAWAY_DESCRIPTION_MAX_LENGTH, sanitizeGetawayDescription } from "@/lib/journey-passport/getaway-description";

type Props = {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  className?: string;
};

// Approved copy, EBC-R1.2-WS6-05 §5.1 / §6 and A2.3 (Product Owner, finalised).
const LABEL = "Describe your ideal getaway";
const HELPER_TEXT =
  "Somewhere peaceful with beaches? Cherry blossoms in spring? A hidden mountain village? However you picture it, tell us in your own words — there’s no wrong answer here.";

// Final placeholder copy, per direct Product Owner instruction following
// Phase 3 approval (superseding the interim EBC-R1.2-WS6-05 §5.1 string and
// resolving the A2.5 "curated ~four examples" item this phase's completion
// report flagged as open). Static only — explicitly no rotation, no
// additional examples beyond these four, per the Product Owner's own
// instruction. This is now approved Release 1.2 copy.
const PLACEHOLDER_TEXT =
  "e.g. An island that feels forgotten by time • Mountains that vanish into morning cloud • Snow settling quietly over lantern-lit streets • A place where the sea meets the mountains";

export function GetawayDescriptionField({ value, onChange, maxLength = GETAWAY_DESCRIPTION_MAX_LENGTH, className = "" }: Props) {
  const fieldId = useId();
  const helpId = useId();

  return (
    <div className={className || "mx-auto mt-6 max-w-2xl rounded-[1.5rem] border border-[#e1ceb0] bg-white/85 p-5 sm:p-6"}>
      <label htmlFor={fieldId} className="text-lg font-semibold text-[#2A211C]">
        {LABEL} <span className="text-sm font-normal text-[#6e5a46]">(Optional)</span>
      </label>
      <p id={helpId} className="mt-2 text-sm leading-6 text-[#6e5a46]">
        {HELPER_TEXT}
      </p>

      {/*
        Placeholder-ignore behaviour: `value` is always the controlled,
        real field value (default "" from the caller — see Phase 4 wiring
        note above). `placeholder` is a separate, display-only DOM
        attribute the browser renders only while `value` is empty; it is
        never read from, written into, or synchronised with `value.` A
        traveller who never types anything submits "" (or an omitted key),
        never the placeholder text — matching the same, already-approved
        pattern the current `destination` field's placeholder already uses
        (EBC-R1.2-WS6-03 Addendum 01 §2) and requiring no new mechanism.
      */}
      {/*
        EBC-R1.2-WS6-09 (Rad, Phase 7 -- Accessibility & Interaction
        Validation). SS5.3/SS9 of EBC-R1.2-WS6-05 specify four visible rows on
        desktop, three on mobile, so the field invites writing without
        pushing Continue an uncomfortable distance down the page on a small
        screen. rows={3} is the semantic/mobile-safe HTML default; the
        already-approved desktop min-h-28 (Phase 3) now only applies from
        the sm: breakpoint up, with a smaller mobile-only min-h-24 added
        alongside it -- the desktop value itself is unchanged.
      */}
      <textarea
        id={fieldId}
        name="getaway-description"
        rows={3}
        value={value}
        onChange={(event) => onChange(sanitizeGetawayDescription(event.target.value))}
        maxLength={maxLength}
        aria-describedby={helpId}
        placeholder={PLACEHOLDER_TEXT}
        className="mt-3 min-h-24 w-full resize-y rounded-xl border border-[#d8c4a7] bg-[#FFFDFC] px-4 py-3 text-base text-[#2A211C] placeholder:text-[#6e5a46]/70 focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C] sm:min-h-28"
      />
    </div>
  );
}
