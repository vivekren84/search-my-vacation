// EBC-R1.2-WS6-09 (Rad, Phase 2). Verifies the pure selection logic in
// ../selection.ts against the business rules it documents (order
// preservation, silent dedup, the approved 5-item soft cap, individual
// removal). This is the codebase's established verify*.ts convention
// (no unit-test framework exists here) applied to a module small and pure
// enough that no live database or React rendering is required to check it.

import type { GeoSearchResult, SelectedDestination } from "../types";
import { addSelection, formatDisambiguation, MAX_PREFERRED_DESTINATIONS, removeSelection } from "../selection";

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

function place(id: string, name: string, overrides: Partial<GeoSearchResult> = {}): GeoSearchResult {
  return {
    geoPlaceId: id,
    canonicalName: name,
    placeType: "city",
    countryCode: "IN",
    admin1Name: null,
    admin2Name: null,
    population: null,
    matchedAlias: null,
    ...overrides,
  };
}

function runVerification() {
  assert(MAX_PREFERRED_DESTINATIONS === 5, "the approved soft cap (EBC-R1.2-WS6-08 Addendum 01 A2.2) is 5");

  // Order preservation (AC-06 / DEC-R1.2-005).
  let selections: SelectedDestination[] = [];
  const bali = place("1", "Bali");
  const thailand = place("2", "Thailand");
  selections = addSelection(selections, bali).next;
  selections = addSelection(selections, thailand).next;
  assert(selections.map((s) => s.canonicalName).join(",") === "Bali,Thailand", "selections preserve the order they were added in");

  // Duplicate selection is a silent no-op, not an error (EBC-R1.2-WS6-05 §7.2).
  const duplicateResult = addSelection(selections, bali);
  assert(duplicateResult.outcome === "duplicate", "re-selecting an already-selected destination reports 'duplicate'");
  assert(duplicateResult.next.length === 2, "a duplicate selection attempt does not add a second entry");
  assert(duplicateResult.next.map((s) => s.canonicalName).join(",") === "Bali,Thailand", "a duplicate selection attempt does not disturb existing order");

  // Individual removal never disturbs the order of what remains (AC-05 / DEC-R1.2-005).
  selections = addSelection(selections, place("3", "Kerala")).next;
  assert(selections.length === 3, "three distinct destinations are selected");
  selections = removeSelection(selections, "2"); // remove Thailand (the middle entry)
  assert(selections.map((s) => s.canonicalName).join(",") === "Bali,Kerala", "removing one destination preserves the relative order of the rest");

  // The approved 5-item soft cap (EBC-R1.2-WS6-08 Addendum 01 A2.2).
  let capTest: SelectedDestination[] = [];
  for (let i = 0; i < 5; i += 1) {
    capTest = addSelection(capTest, place(`cap-${i}`, `Place ${i}`)).next;
  }
  assert(capTest.length === 5, "five destinations can be selected");
  const sixthAttempt = addSelection(capTest, place("cap-5", "Place 5"));
  assert(sixthAttempt.outcome === "cap-reached", "a sixth selection attempt reports 'cap-reached'");
  assert(sixthAttempt.next.length === 5, "a sixth selection attempt does not add a sixth entry");

  // A custom maxSelections parameter is honoured (defensive — the UI layer
  // is the source of truth for the approved cap, but the function itself
  // must not hard-code it unreachably).
  const customCapResult = addSelection([place("a", "A")], place("b", "B"), 1);
  assert(customCapResult.outcome === "cap-reached", "a custom maxSelections argument is respected");

  // Removing an id that was never selected is a safe no-op.
  const noopRemoval = removeSelection(selections, "does-not-exist");
  assert(noopRemoval.length === selections.length, "removing a non-existent id changes nothing");
  assert(noopRemoval.map((s) => s.geoPlaceId).join(",") === selections.map((s) => s.geoPlaceId).join(","), "removing a non-existent id preserves every existing entry and its order");

  // Disambiguation formatting (EBC-R1.2-WS6-05 §4.2 — "Coorg — Kodagu
  // District, Karnataka" / "Bali — Indonesia" — now led by a plain-language
  // place-type label per EBC-R1.2-WS6-IMP-03, e.g. "City, Kodagu District,
  // Karnataka", so that two same-named results with different placeType
  // values (EBC-R1.2-WS6-QA-01 D2) are no longer visually identical).
  assert(
    formatDisambiguation(place("x", "Coorg", { admin1Name: "Karnataka", admin2Name: "Kodagu District" })) === "City, Kodagu District, Karnataka",
    "district + state disambiguation leads with the place-type label, then joins admin2 then admin1",
  );
  assert(
    formatDisambiguation(place("y", "Bali", { countryCode: "ID", admin1Name: null, admin2Name: null })) === "City, Indonesia",
    "a place with no admin hierarchy leads with the place-type label, then falls back to its readable country name, not the raw ISO code (EBC-R1.2-WS6-11 DEF-02)",
  );
  assert(
    formatDisambiguation(place("z", "Nowhere", { countryCode: null })) === "City",
    "a place with no admin hierarchy and no country code disambiguates to the place-type label alone, never an empty string (EBC-R1.2-WS6-IMP-03)",
  );
  assert(
    formatDisambiguation(place("w", "Chennai", { placeType: "district", admin1Name: "Tamil Nadu", admin2Name: null })) === "District, Tamil Nadu",
    "a different placeType label (district vs. city) is what distinguishes two otherwise-identical-looking results (EBC-R1.2-WS6-QA-01 D2)",
  );

  console.log(`Geo-validation selection logic verification passed (${checks} checks).`);
}

runVerification();
