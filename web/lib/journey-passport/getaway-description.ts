// EBC-R1.2-WS6-09 (Rad, Phase 3). Canonical data shape and normalisation
// logic for the "Describe your ideal getaway" free-text field, per
// EBC-R1.2-WS6-03 Addendum 01 §1 (Archie, Technical Architect) and
// EBC-R1.2-WS6-08 Addendum 01 A2.3 (Product Owner, finalised).
//
// Deliberately standalone: not exported from, and not imported into,
// types/journey-passport.types.ts, hooks/useJourneyPassport.ts, or
// lib/journey-passport/entry-context.ts. Per this phase's explicit
// instruction ("Do not integrate with Journey Passport yet"), wiring
// `getawayDescription` into the live JourneyPassportState and its
// sessionStorage draft mechanism (`smv:journey-passport:v1`) is Phase 4's
// scope ("Journey Passport Integration"). This module defines the model
// Phase 4 will use, so that integration has an unambiguous, already-agreed
// target rather than one invented at wiring time.
//
// Per Archie's addendum, no new persistence mechanism is required for this
// field: "never persisted unless edited" (A2.3) falls out automatically of
// the same trim().length === 0 emptiness check every other optional field
// in JourneyPassportState already uses (EBC-002 §5.3) — there is no
// separate "was this field touched" flag, here or anywhere else in the
// Passport.

export const GETAWAY_DESCRIPTION_MAX_LENGTH = 500;

/**
 * Clamps raw input to the approved 500-character cap (A2.3). This is a
 * defence-in-depth safeguard for values that can arrive without having
 * passed through the textarea's own `maxLength` attribute (e.g. a paste
 * event in some browsers, or a future non-DOM caller such as a restored
 * session draft) — it never trims interior whitespace or otherwise
 * rewrites what the traveller wrote, consistent with EBC-002 §7.4's
 * "do not erase input" principle.
 */
export function sanitizeGetawayDescription(raw: string): string {
  return raw.slice(0, GETAWAY_DESCRIPTION_MAX_LENGTH);
}

/**
 * The sole, sufficient "untouched" signal for this field, matching every
 * other optional field in JourneyPassportState (EBC-002 §5.3) and Archie's
 * addendum §2. A whitespace-only value is treated identically to an empty
 * one; no separate "was this edited" flag is needed or introduced.
 */
export function isGetawayDescriptionEmpty(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * The persisted shape this field will occupy once Phase 4 wires it into
 * JourneyPassportState (per EBC-R1.2-WS6-03 Addendum 01 §1: a single
 * `getawayDescription: string` field, structurally identical in kind to
 * `dreamJourney` and stored as-is, raw). Documented here, ahead of that
 * integration, so Phase 4 has an agreed target rather than an implicit one.
 */
export type GetawayDescriptionField = {
  getawayDescription: string;
};
