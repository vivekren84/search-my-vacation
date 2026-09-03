// EBC-R1.2-WS4-IMP-01 (Rad). DEC-R1.2-011: the Journey Passport traveller
// name field must reject numeric characters while continuing to accept
// genuine personal names — Unicode letters, spaces, apostrophes and
// hyphens (e.g. "José", "O'Brien", "Anne-Marie", "Świątek"). Per
// R1.2-WS4-AUD-01's finding, this rule was previously absent everywhere:
// neither name input filtered digits, and the shared validator
// (`hasValidName` in config/journey-passport.config.ts) only required at
// least one letter to be present, so "John123" passed unchanged.
//
// This is the single, shared implementation for every place a traveller's
// name is entered or restored — the About You step
// (JourneyPassportMoments.tsx), the post-completion contact-capture form
// (JourneyPassport.tsx), and the session-draft restore path
// (useJourneyPassport.ts's sanitiseDraft) — mirroring the existing
// sanitizeGetawayDescription pattern already used in this directory,
// rather than duplicating the same regex at each call site.
//
// Applied on every onChange (not a keydown guard): typing, paste and
// browser autofill all surface to React as the same onChange event on a
// controlled input, so one onChange-based filter covers all three
// identically, satisfying DEC-R1.2-011's "typing / paste / autofill"
// scope without separate handling for each. `\p{Nd}` matches every
// Unicode decimal-digit character (not only ASCII 0-9), so the rule holds
// for non-Latin numeral systems too.
//
// The pre-existing newline-stripping behaviour present at both name call
// sites before this change (`.replace(/[\r\n]+/g, " ")`) is preserved
// here rather than left duplicated — a single-line name field has never
// accepted embedded newlines, and that is unchanged by this card.

export function sanitizeTravellerName(raw: string): string {
  return raw.replace(/[\r\n]+/g, " ").replace(/\p{Nd}/gu, "");
}

/**
 * Used by `hasValidName` (config/journey-passport.config.ts) as a
 * defence-in-depth check alongside `sanitizeTravellerName`: a value can
 * reach `JourneyPassportState.name` without passing through either name
 * input's `onChange` (for example, a corrupted or hand-edited
 * `sessionStorage` draft is already re-sanitised on restore, but this
 * keeps validation itself independently correct rather than relying
 * solely on inputs being sanitised upstream).
 */
export function hasNumericCharacter(value: string): boolean {
  return /\p{Nd}/u.test(value);
}
