import { JOURNEY_PASSPORT_SCHEMA_VERSION, type JourneyMomentId, type JourneyPassportEntryContext, type JourneyPassportState } from "../../types/journey-passport.types";

export type JourneyEntryPreselection = {
  moment: JourneyMomentId;
  field: "companion" | "dreamJourney" | "travelStyles" | "timing";
  value: string;
};

const experiencePreselections = {
  "Memory Makers": { moment: "pace-and-timing", field: "travelStyles", value: "Photography" },
  "Celebration Moments": { moment: "pace-and-timing", field: "travelStyles", value: "Celebrations" },
  "Family Time": { moment: "companions", field: "companion", value: "Family" },
  "Weekend Getaways": { moment: "pace-and-timing", field: "timing", value: "Within the Next Month" },
  "Global Escapes": { moment: "dream-journey", field: "dreamJourney", value: "City Discovery" },
  "Nature & Serenity": { moment: "pace-and-timing", field: "travelStyles", value: "Nature" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["experience"]>, JourneyEntryPreselection>;

const moodPreselections = {
  relax: { moment: "pace-and-timing", field: "travelStyles", value: "Relaxation" },
  explore: { moment: "pace-and-timing", field: "travelStyles", value: "Adventure" },
  celebrate: { moment: "pace-and-timing", field: "travelStyles", value: "Celebrations" },
  romance: { moment: "companions", field: "companion", value: "Couple" },
  escape: { moment: "dream-journey", field: "dreamJourney", value: "Tropical Escape" },
  // EBC-036 (D-08): Memory Maker previously bypassed this shared mood
  // mapping entirely — its homepage card linked to
  // `?experience=Memory%20Makers`, which resolves through
  // `experiencePreselections` instead (a mechanism built for the
  // unrelated "Begin with what matters" homepage tiles, not for Journey
  // Mood). That accidental reuse produced "Photography" as the Pace &
  // Timing pre-selection, which has no thematic connection to Memory
  // Maker. Memory Maker now uses `?mood=memory`, the same routing
  // mechanism as the other five moods, and "Culture & Heritage" as a
  // pre-selection that fits "moments made together" without duplicating
  // another mood's exact value (Relax already owns Relaxation, Explore
  // owns Adventure, Celebrate owns Celebrations).
  memory: { moment: "pace-and-timing", field: "travelStyles", value: "Culture & Heritage" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["feeling"]>, JourneyEntryPreselection>;

const inspirationPreselections = {
  Mountains: { moment: "dream-journey", field: "dreamJourney", value: "Mountain Retreat" },
  Beaches: { moment: "pace-and-timing", field: "travelStyles", value: "Beaches & Islands" },
  Wildlife: { moment: "dream-journey", field: "dreamJourney", value: "Wildlife Adventure" },
  Romance: { moment: "companions", field: "companion", value: "Couple" },
  Relaxation: { moment: "pace-and-timing", field: "travelStyles", value: "Relaxation" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["inspiration"]>, JourneyEntryPreselection>;

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
    case "travelStyles": return state.travelStyles.includes(preselection.value);
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
    travelStyles: preselection?.field === "travelStyles" ? [preselection.value] : [],
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
