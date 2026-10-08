"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): the three people cards
// in the Journey header (UX Rev 4a §13; D-12; UXD-JW-13). Journey Owner,
// Primary Operational Contact and Travellers are always three separate,
// labelled cards, even when the contact is also travelling. Owner
// deactivated: name, then muted "Account deactivated"; only an
// Administrator sees Reassign (020B C-13). "Corporate Point of Contact" is
// always written in full (baseline §6).

import type { JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { CONTACT_TYPE_LABELS, pluralise } from "../journeyWorkspaceLabels";
import { Avatar, CARD, SECTION_TITLE } from "../primitives";

const CARD_ACTION =
  "rounded-full border border-[var(--color-border-warm)] px-3 py-1 text-xs font-semibold text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_8%)]";

export function partyDisplayName(detail: JourneyDetail): string {
  const { party } = detail;
  if (party.kind === "corporate") return party.companyName ?? party.name ?? "Corporate Journey";
  return party.name ?? "Traveller";
}

function normalise(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export default function PeopleCards({
  detail,
  isAdministrator,
  onAssign,
  onEditContact,
}: {
  detail: JourneyDetail;
  isAdministrator: boolean;
  onAssign: (() => void) | null;
  onEditContact: (() => void) | null;
}) {
  const { owner, contact, party, journey } = detail;
  const alsoTravelling =
    contact !== null &&
    contact.contactType === "individual_traveller" &&
    party.kind === "traveller" &&
    normalise(contact.name) !== "" &&
    normalise(contact.name) === normalise(party.name);
  const assignLabel = isAdministrator ? "Reassign…" : "Assign…";
  const counts = [
    journey.adults !== null ? pluralise(journey.adults, "adult") : null,
    journey.children !== null ? pluralise(journey.children, "child", "children") : null,
    journey.infants !== null ? pluralise(journey.infants, "infant") : null,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <section className={`${CARD} flex flex-col gap-2 px-4 py-3`} aria-labelledby="people-owner">
        <h2 id="people-owner" className={SECTION_TITLE}>
          Journey Owner
        </h2>
        {owner ? (
          <div className="flex items-start gap-3">
            <Avatar name={owner.name} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-espresso)]">
                <span className="truncate">{owner.name}</span>
                <span className="rounded-full bg-[var(--color-espresso)]/8 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-[var(--color-espresso)]/70">
                  SMV
                </span>
              </p>
              {!owner.active ? <p className="text-xs text-[var(--color-espresso)]/55">Account deactivated</p> : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-espresso)]/60">Set during adoption</p>
        )}
        {onAssign && (owner?.active !== false || isAdministrator) ? (
          <div>
            <button type="button" className={CARD_ACTION} onClick={onAssign}>
              {assignLabel}
            </button>
          </div>
        ) : null}
      </section>

      <section className={`${CARD} flex flex-col gap-2 px-4 py-3`} aria-labelledby="people-contact">
        <h2 id="people-contact" className={SECTION_TITLE}>
          Primary Operational Contact
        </h2>
        {contact ? (
          <div className="flex items-start gap-3">
            <ContactGlyph />
            <div className="min-w-0 flex-1 text-sm text-[var(--color-espresso)]">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{contact.name}</span>
                <span className="rounded-full border border-[var(--color-border-warm)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--color-espresso)]/75">
                  {CONTACT_TYPE_LABELS[contact.contactType]}
                </span>
              </p>
              {contact.organisation && contact.contactType !== "individual_traveller" ? (
                <p className="text-[var(--color-espresso)]/75">{contact.organisation}</p>
              ) : null}
              <p className="break-words text-xs text-[var(--color-espresso)]/70">
                {[contact.phone, contact.email].filter(Boolean).join(" · ")}
              </p>
              {alsoTravelling ? <p className="mt-1 text-xs text-[var(--color-espresso)]/55">Also travelling</p> : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-espresso)]/60">
            {journey.adoptionStatus === "legacy_pending" ? "Set during adoption" : "No Primary Operational Contact recorded."}
          </p>
        )}
        {onEditContact && contact ? (
          <div>
            <button type="button" className={CARD_ACTION} onClick={onEditContact}>
              Edit
            </button>
          </div>
        ) : null}
      </section>

      <section className={`${CARD} flex flex-col gap-2 px-4 py-3`} aria-labelledby="people-travellers">
        <h2 id="people-travellers" className={SECTION_TITLE}>
          Travellers
        </h2>
        <p className="text-sm text-[var(--color-espresso)]">
          <span className="text-[var(--color-espresso)]/60">{party.kind === "corporate" ? "Corporate Point of Contact: " : "Traveller: "}</span>
          <span className="font-semibold">{party.name ?? "—"}</span>
          {party.kind === "corporate" && party.companyName ? <span className="text-[var(--color-espresso)]/75"> · {party.companyName}</span> : null}
        </p>
        {counts.length > 0 ? <p className="text-xs text-[var(--color-espresso)]/70">{counts.join(" · ")}</p> : null}
      </section>
    </div>
  );
}

// Contact card glyph (inline SVG convention, UX §22).
function ContactGlyph() {
  return (
    <span aria-hidden="true" className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-espresso)]/6 text-[var(--color-espresso)]/70">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1.25" y="2.25" width="11.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="6.25" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.75 10c.5-1.2 1.3-1.75 2.25-1.75S6.75 8.8 7.25 10M8.75 5.5h2.5M8.75 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
