import { travelStyleOptions } from "../../config/journey-passport.config";
import { JOURNEY_PASSPORT_SCHEMA_VERSION, type JourneyMomentId, type JourneyPassportEntryContext, type JourneyPassportState } from "../../types/journey-passport.types";

export type JourneyEntryPreselection =
  | { moment: JourneyMomentId; field: "companion" | "dreamJourney" | "timing"; value: string }
  | { moment: JourneyMomentId; field: "travelStyles"; values: string[] };

/**
 * EBC-030 (Travel Inspiration → Journey Passport Pre-population): the
 * architecture previously supported exactly one Travel Style default per
 * entry point. The approved Inspiration Mapping Catalogue below requires
 * up to three (Food & Dining + Culture & Heritage together), so the
 * `travelStyles` field of `JourneyEntryPreselection` now carries a
 * `values: string[]` array instead of a single `value`. Every existing
 * Experience/Mood mapping that used a single Travel Style default has been
 * updated to the equivalent one-element array — their resolved behaviour is
 * unchanged, only the shape is generalised. `companion` / `dreamJourney` /
 * `timing` stay single-valued: nothing in the approved mapping matrix (this
 * EBC or prior ones) ever needs more than one of those at a time.
 *
 * `travelStyleDefaults` is the single governed constructor for a
 * `travelStyles` preselection: it deduplicates, rejects any value that is
 * not a real Travel Style option (fails fast, at module load, rather than
 * silently pre-selecting something the traveller can't see in the Pace &
 * Timing step), preserves the order the catalogue lists values in, and caps
 * at 3 — the same limit `PaceAndTimingMoment` already enforces for manual
 * selection.
 */
const travelStyleValueSet = new Set(travelStyleOptions.map((option) => option.value));

function travelStyleDefaults(moment: JourneyMomentId, values: readonly string[]): JourneyEntryPreselection {
  const deduped = [...new Set(values)];
  const invalid = deduped.filter((value) => !travelStyleValueSet.has(value));
  if (invalid.length > 0) {
    throw new Error(`Invalid Travel Style default(s) in the governed entry-context catalogue: ${invalid.join(", ")}`);
  }
  return { moment, field: "travelStyles", values: deduped.slice(0, 3) };
}

const experiencePreselections = {
  "Memory Makers": travelStyleDefaults("pace-and-timing", ["Photography"]),
  "Celebration Moments": travelStyleDefaults("pace-and-timing", ["Celebrations"]),
  "Family Time": { moment: "companions", field: "companion", value: "Family" },
  "Weekend Getaways": { moment: "pace-and-timing", field: "timing", value: "Within the Next Month" },
  "Global Escapes": { moment: "dream-journey", field: "dreamJourney", value: "City Discovery" },
  "Nature & Serenity": travelStyleDefaults("pace-and-timing", ["Nature"]),
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["experience"]>, JourneyEntryPreselection>;

const moodPreselections = {
  relax: travelStyleDefaults("pace-and-timing", ["Relaxation"]),
  explore: travelStyleDefaults("pace-and-timing", ["Adventure"]),
  celebrate: travelStyleDefaults("pace-and-timing", ["Celebrations"]),
  romance: { moment: "companions", field: "companion", value: "Couple" },
  // EBCR1.2-004 (DEC-R1.2-007): the Escape mood card has been removed from
  // the Homepage/Journey Mood Card set — Product's stated rationale is that
  // no strong Journey Passport mapping ever existed for it; the previous
  // mapping simply pointed to the Dream Journey "Tropical Escape" archetype,
  // which has no thematic link to "escape" as a feeling. Retired to
  // `undefined` (the same pattern already used below for `feeling-led` /
  // `first-international`) rather than removed from this Record outright,
  // so a stale `?mood=escape` link — from a bookmark, cached page, or old
  // marketing asset — still resolves cleanly to "no pre-selection" instead
  // of a type error or a misleading default. Tropical Escape itself is
  // untouched: it remains a fully independent, traveller-selectable Dream
  // Journey option inside Journey Passport (see
  // `JOURNEY_ENTRY_DESTINATION_THEMES` in `types/journey-passport.types.ts`)
  // and Journey Director's scoring for it (see `DREAM_JOURNEY_MAP` in
  // `lib/journey-director/engine/engine.rules.ts`) — neither is affected by
  // this retirement.
  escape: undefined,
  // EBCR1.2-004 (DEC-R1.2-008): the "Memory Maker / Family" homepage card is
  // renamed "Memory Makers" and its Journey Passport mapping is updated to
  // "Photography" — Product's stated rationale is that Photography best
  // represents the emotional intent of preserving memories across all
  // traveller types. This supersedes the "Culture & Heritage" mapping set
  // under EBC-036 (D-08). Photography is also the exact default already
  // used by the separate "Memory Makers" Experience tile
  // (`experiencePreselections["Memory Makers"]` above), so both "Memory
  // Makers" entry points on the site now resolve to the same pre-selection.
  memory: travelStyleDefaults("pace-and-timing", ["Photography"]),
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["feeling"]>, JourneyEntryPreselection | undefined>;

/**
 * EBC-030 — governed Inspiration Mapping Catalogue.
 *
 * Replaces the previous ad-hoc `inspiration` mapping (Mountains / Beaches /
 * Wildlife / Romance / Relaxation — only "Relaxation" and "Wildlife" were
 * ever actually linked from the Travel Inspiration page; the other three
 * were unused). Travel Inspiration entries are editorial, not concrete
 * itineraries, so only the eight approved stable IDs below may resolve a
 * preselection, and every value here is exactly what Product approved —
 * nothing is inferred from title, imagery, or copy.
 *
 * `undefined` for `feeling-led` and `first-international` is intentional
 * and explicit (Product approval: "Nothing" / "No defaults. Everything
 * blank.") — both still carry `source: "inspiration"` and their stable ID
 * end to end (see `app/travel-inspiration/page.tsx`), they simply resolve
 * no preselection, identical to a standard "Plan My Experience" entry.
 *
 * "nature-led" replaces the removed "Wildlife" mapping (Travel Style
 * "Nature" instead of the Dream Journey "Wildlife Adventure") — Product
 * decision: Nature replaces Wildlife.
 */
const inspirationPreselections = {
  "feeling-led": undefined,
  "slow-unhurried": travelStyleDefaults("pace-and-timing", ["Relaxation"]),
  "family-time": { moment: "companions", field: "companion", value: "Family" },
  "short-restorative-escape": travelStyleDefaults("pace-and-timing", ["Relaxation"]),
  "food-culture-local": travelStyleDefaults("pace-and-timing", ["Food & Dining", "Culture & Heritage"]),
  "nature-led": travelStyleDefaults("pace-and-timing", ["Nature"]),
  "travel-celebration": travelStyleDefaults("pace-and-timing", ["Celebrations"]),
  "first-international": undefined,
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["inspiration"]>, JourneyEntryPreselection | undefined>;

export const JOURNEY_ENTRY_ADVISORY = "We've pre-selected this based on how you started your journey. Feel free to change it anytime.";

export function resolveJourneyEntryPreselection(entryContext: JourneyPassportEntryContext): JourneyEntryPreselection | undefined {
  if (entryContext.destinationTheme) return { moment: "dream-journey", field: "dreamJourney", value: entryContext.destinationTheme };
  if (entryContext.experience) return experiencePreselections[entryContext.experience];
  if (entryContext.inspiration) return inspirationPreselections[entryContext.inspiration];
  if (entryContext.feeling) return moodPreselections[entryContext.feeling];
  return undefined;
}

/**
 * EBC-036 (D-06): the entry-advisory banner ("We've pre-selected this…")
 * must only appear while the pre-selection it describes is still genuinely
 * reflected in the traveller's current answer — not merely because they
 * arrived at a moment that *has* a pre-selection defined for it.
 *
 * Previously, `showEntryAdvisory` was computed purely from
 * `entryPreselection?.moment === currentMomentId`, with no check against the
 * actual state value. On a fresh, untouched visit this happened to look
 * correct (the pre-selected value and the current value are the same thing
 * at that point), which is why it read as "working" on first load. But the
 * banner never turned itself off once a traveller changed their answer — it
 * kept claiming a pre-selection was active long after it no longer was,
 * which is the "banner without a genuinely real selection" defect. This one
 * helper is now the single source of truth for that check, reused
 * identically across every moment that can carry a pre-selection (Companions,
 * Dream Journey, Pace & Timing) and every mood that can produce one.
 *
 * EBC-030: the `travelStyles` case now checks `values.some(...)` rather than
 * a single value — for a multi-default entry (e.g. food-culture-local) the
 * advisory stays visible as long as at least one governed default is still
 * selected, and disappears only once every governed default has been
 * removed, per the approved Advisory Behaviour.
 */
export function isJourneyEntryPreselectionActive(
  preselection: JourneyEntryPreselection | undefined,
  momentId: JourneyMomentId,
  state: JourneyPassportState,
): boolean {
  if (!preselection || preselection.moment !== momentId) return false;

  switch (preselection.field) {
    case "companion": return state.companion === preselection.value;
    case "dreamJourney": return state.dreamJourney === preselection.value;
    case "travelStyles": return preselection.values.some((value) => state.travelStyles.includes(value));
    case "timing": return state.timing === preselection.value;
    default: return false;
  }
}

export function createInitialJourneyPassportState(entryContext: JourneyPassportEntryContext = {}): JourneyPassportState {
  const preselection = resolveJourneyEntryPreselection(entryContext);
  return {
    schemaVersion: JOURNEY_PASSPORT_SCHEMA_VERSION,
    currentMoment: "welcome",
    name: "",
    companion: preselection?.field === "companion" ? preselection.value : "",
    dreamJourney: preselection?.field === "dreamJourney" ? preselection.value : "",
    travelStyles: preselection?.field === "travelStyles" ? [...preselection.values] : [],
    timing: preselection?.field === "timing" ? preselection.value : "",
    startDate: "",
    endDate: "",
    destinationMode: entryContext.destination ? "known" : "",
    destination: entryContext.destination ?? "",
    mobile: "",
    journeyReference: "",
    entryContext,
    visitedMoments: ["welcome"],
    completion: "idle",
    navigationDirection: "none",
    updatedAt: Date.now(),
  };
}
