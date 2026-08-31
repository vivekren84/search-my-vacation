// EBC-R1.2-WS6-09 (Rad, Phase 3). Verifies the pure "Describe your ideal
// getaway" logic in ../getaway-description.ts against A2.3 (Product Owner,
// finalised) and Archie's addendum (EBC-R1.2-WS6-03 Addendum 01 §2). This
// is the codebase's established verify*.ts convention (no unit-test
// framework exists here) applied to a module small and pure enough that no
// live database or React rendering is required to check it.

import { GETAWAY_DESCRIPTION_MAX_LENGTH, isGetawayDescriptionEmpty, sanitizeGetawayDescription } from "../getaway-description";

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

// --- GETAWAY_DESCRIPTION_MAX_LENGTH matches the approved A2.3 cap ---

assert(GETAWAY_DESCRIPTION_MAX_LENGTH === 500, "the approved character cap is 500 (A2.3)");

// --- sanitizeGetawayDescription: clamps without rewriting content ---

assert(sanitizeGetawayDescription("") === "", "sanitizing an empty string yields an empty string");
assert(sanitizeGetawayDescription("Somewhere quiet") === "Somewhere quiet", "a short value passes through unchanged");
assert(sanitizeGetawayDescription("  leading and trailing space  ") === "  leading and trailing space  ", "sanitize does not trim interior/edge whitespace — never erase what the traveller wrote");

const exactly500 = "a".repeat(500);
const over500 = "a".repeat(600);
assert(sanitizeGetawayDescription(exactly500).length === 500, "a value exactly at the cap is left unchanged");
assert(sanitizeGetawayDescription(exactly500) === exactly500, "a value exactly at the cap is not mutated");
assert(sanitizeGetawayDescription(over500).length === 500, "a value beyond the cap is clamped to exactly 500 characters");
assert(sanitizeGetawayDescription(over500) === "a".repeat(500), "clamping keeps the first 500 characters, not a rewritten value");

const multiline = "Line one\nLine two\nLine three".repeat(20);
assert(sanitizeGetawayDescription(multiline).length <= GETAWAY_DESCRIPTION_MAX_LENGTH, "clamping respects the cap even across multi-line input");

// --- isGetawayDescriptionEmpty: the sole "untouched" signal (Archie's addendum §2) ---

assert(isGetawayDescriptionEmpty("") === true, "an empty string is empty");
assert(isGetawayDescriptionEmpty("   ") === true, "whitespace-only is treated as empty, matching every other optional Passport field");
assert(isGetawayDescriptionEmpty("\n\t  \n") === true, "mixed whitespace/newlines-only is treated as empty");
assert(isGetawayDescriptionEmpty("Somewhere peaceful") === false, "genuine content is not empty");
assert(isGetawayDescriptionEmpty("  a  ") === false, "content surrounded by whitespace is not empty");
assert(isGetawayDescriptionEmpty("A hidden mountain village, cherry blossoms in spring") === false, "a full sentence is not empty");

// --- Placeholder-vs-value separation: the field's real value is never the placeholder copy ---
// This is a structural guarantee, not something these pure functions can violate on their
// own — sanitizeGetawayDescription/isGetawayDescriptionEmpty only ever see what the caller
// passes as the real value. This check documents that a plausible placeholder-shaped string
// is treated as ordinary content once it is genuinely the field's value (i.e. if a traveller
// happens to type something resembling the placeholder, that is correctly NOT "empty") —
// the actual placeholder/value separation is enforced by GetawayDescriptionField.tsx never
// assigning placeholder copy into the controlled `value` prop.
assert(isGetawayDescriptionEmpty("An island that feels forgotten by time") === false, "a traveller-typed value matching the placeholder's wording is still genuine content, not treated as untouched");

console.log(`Getaway description logic verification passed (${checks} checks).`);
