import type { JourneyPassportSnapshot } from "../../types/journey-director";
import type { EnginePossibility } from "./engine";

/**
 * EBC-017C Part B — presentation-only card copy generation.
 *
 * Everything in this file is a pure, deterministic function of data the
 * engine has already computed and attached to an EnginePossibility (themes,
 * emotions, memory goals, pace signals via scoreBreakdown) plus the
 * traveller's own Passport answers. Nothing here changes scoring,
 * eligibility, ranking, or Journey Passport behaviour — it only decides how
 * an already-finalized possibility is *worded*.
 *
 * Two of the traveller-facing sections (experience tags, closing message)
 * include a small number of hand-authored, destination-specific overrides
 * for regions this EBC explicitly names copy for (Kabini, Masinagudi, Goa,
 * Bali). Every other destination falls back to a template driven entirely by
 * real structured data already present in the catalogue — no invented
 * factual claims (e.g. no fabricated activity names) for destinations this
 * EBC did not supply copy for. See the EBC-017C engineering report for the
 * full list of what's instructed content vs. generated template.
 */

type CandidateEvidence = EnginePossibility["fitEvidence"][number];

const THEME_CATEGORY_PRIORITY = [
  "wildlife",
  "beach",
  "mountain",
  "heritage",
  "wellness",
  "adventure",
  "city",
  "food",
  "nature",
] as const;

export type ThemeCategory = (typeof THEME_CATEGORY_PRIORITY)[number] | "general";

const THEME_CATEGORY_MEMBERS: Record<Exclude<ThemeCategory, "general">, readonly string[]> = {
  wildlife: ["wildlife", "safari"],
  beach: ["beaches", "islands", "cruises", "water-sports"],
  mountain: ["mountains", "hills", "snow-experiences"],
  heritage: ["heritage", "architecture", "spiritual", "culture", "festivals", "local-communities", "villages"],
  wellness: ["wellness", "slow-travel"],
  adventure: ["adventure", "road-trips", "scenic-drives"],
  city: ["city-break", "nightlife", "shopping"],
  food: ["food", "coffee-estates", "tea-estates"],
  nature: ["nature", "forests", "lakes", "rivers", "backwaters", "desert"],
};

const THEME_PHRASES: Record<string, string> = {
  wildlife: "wildlife encounters",
  safari: "safari moments",
  nature: "time in nature",
  forests: "quiet forest time",
  beaches: "beach days",
  islands: "island time",
  mountains: "mountain views",
  hills: "hillside calm",
  heritage: "heritage and history",
  culture: "local culture",
  spiritual: "quiet, reflective moments",
  architecture: "striking architecture",
  food: "local food",
  photography: "photographs worth keeping",
  adventure: "an adventurous edge",
  wellness: "time to reset",
  "slow-travel": "an unhurried pace",
  "city-break": "city discovery",
  festivals: "local celebration",
  shopping: "local markets",
  cruises: "days on the water",
  "water-sports": "time on the water",
  "road-trips": "the open road",
  lakes: "lakeside calm",
  rivers: "riverside moments",
  backwaters: "backwater calm",
  desert: "desert stillness",
  "coffee-estates": "coffee-country calm",
  "tea-estates": "tea-country calm",
  villages: "village life",
  "local-communities": "local community life",
  luxury: "a touch of indulgence",
  nightlife: "evening energy",
  "family-attractions": "family-friendly moments",
  "scenic-drives": "scenic drives",
  "snow-experiences": "snow and mountain air",
};

const PACE_PHRASES: Record<string, string> = {
  relaxed: "at an easy, unhurried pace",
  balanced: "at a comfortable, balanced pace",
  explorer: "with plenty of room to explore",
  "fast-paced": "with energy and momentum",
};

const COMPANION_PHRASES: Record<string, string> = {
  Solo: "your solo trip",
  Couple: "your trip as a couple",
  Family: "your family trip",
  Friends: "your trip with friends",
  Business: "your travelling group",
};

// Conversational phrasing for each selectable travel style, used to build
// the traveller-link clause naturally across *all* of the traveller's
// selections rather than just the first (EBC-017C follow-up refinement).
// Keys match TRAVEL_STYLE_MAP in engine.rules.ts; unrecognised values fall
// back to a lowercased version of the raw label.
const STYLE_PHRASES: Record<string, string> = {
  Relaxation: "relaxed moments",
  Adventure: "a little adventure",
  "Food & Dining": "good food",
  "Culture & Heritage": "culture and heritage",
  Photography: "photography",
  Nature: "time in nature",
  Wildlife: "wildlife",
  "Beaches & Islands": "beaches and islands",
  Celebrations: "celebration",
};

function titleCase(value: string): string {
  return value
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function joinNaturally(items: readonly string[]): string {
  const values = items.filter((item) => item.trim().length > 0);
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

/**
 * Evidence attached to a possibility comes from two sources: the
 * actually-selected region (id-prefixed "<regionId>-...") and the broader
 * candidate record (id-prefixed "<candidateId>-generated-..."), which for
 * multi-region candidates can name a different place than the one the
 * traveller is actually shown (see EBC-017B). Presentation must prefer the
 * selected-region's own evidence so a card never narrates another
 * destination. Falls back to the full mixed set only if the region's own
 * evidence doesn't clear the same >=2 threshold used elsewhere for
 * traveller-facing fit explanations, so this never produces fewer reasons
 * than before.
 */
export function regionScopedEvidence(possibility: EnginePossibility): readonly CandidateEvidence[] {
  const ownRegionEvidence = possibility.fitEvidence.filter((evidence) =>
    evidence.id.startsWith(`${possibility.regionId}-`),
  );
  return ownRegionEvidence.length >= 2 ? ownRegionEvidence : possibility.fitEvidence;
}

function regionThemes(possibility: EnginePossibility): readonly string[] {
  const strengths = regionScopedEvidence(possibility).find((evidence) =>
    evidence.id.endsWith("-strengths"),
  );
  return strengths?.themes ?? [];
}

export function themeCategoryFor(possibility: EnginePossibility): ThemeCategory {
  const themes = new Set(regionThemes(possibility));
  for (const category of THEME_CATEGORY_PRIORITY) {
    if (THEME_CATEGORY_MEMBERS[category].some((theme) => themes.has(theme))) {
      return category;
    }
  }
  return "general";
}

function paceSignal(possibility: EnginePossibility): string | undefined {
  const factor = possibility.scoreBreakdown.find(
    (item) => item.factorId === "travel-pace-alignment",
  );
  return factor?.supportingCandidateSignals[0];
}

/**
 * "The Memories You Want To Make" — replaces the raw, boilerplate evidence
 * text (literally "Wildlife, Nature, Photography; balanced / explorer
 * rhythm; region context." sourced straight from the generated data) with a
 * sentence built from the same underlying signals, worded naturally.
 */
export function memoriesText(evidence: CandidateEvidence, possibility: EnginePossibility): string {
  const themePhrases = (evidence.themes ?? [])
    .map((theme) => THEME_PHRASES[theme] ?? titleCase(theme).toLowerCase())
    .slice(0, 3);
  const paceText = PACE_PHRASES[paceSignal(possibility) ?? ""] ?? "at a pace shaped around you";
  const phraseList = joinNaturally(themePhrases);

  if (!phraseList) {
    return `In ${possibility.regionName}, expect memories shaped around what matters most to you, carried ${paceText}.`;
  }
  return `In ${possibility.regionName}, expect memories built around ${phraseList}, carried ${paceText}.`;
}

// Hand-authored, region-specific experience tags for the two regions this
// EBC explicitly supplies copy for. Every other region falls back to its own
// real theme set below rather than inventing activity names that aren't in
// the source data.
const CURATED_EXPERIENCE_TAGS: Record<string, readonly string[]> = {
  "india-karnataka-kabini": ["River Safari", "Bird Watching", "Jungle Lodge", "Boat Safari"],
  "india-wildlife-tours-kabini": ["River Safari", "Bird Watching", "Jungle Lodge", "Boat Safari"],
  "india-tamilnadu-masinagudi": ["Elephant Corridors", "Forest Safari", "Nilgiri Landscapes", "Wildlife Photography"],
};

/**
 * "Experiences You'll Enjoy" — the engine's own experienceHighlights takes
 * only the region's first 3 themes, and many wildlife-capable regions share
 * the same top 2-3 theme labels, which is why unrelated destinations were
 * showing identical tags. This surfaces the region's *full* theme set
 * (primary + secondary experiences, which the truncated version was
 * silently dropping) for real differentiation, and uses the two explicitly
 * curated tag sets above where this EBC supplied them.
 */
export function experienceTags(possibility: EnginePossibility): readonly string[] {
  const curated = CURATED_EXPERIENCE_TAGS[possibility.regionId];
  if (curated) return curated;

  const themes = regionThemes(possibility);
  if (themes.length === 0) return [...possibility.experienceHighlights];

  const seen = new Set<string>();
  const tags: string[] = [];
  themes.forEach((theme) => {
    const label = titleCase(theme);
    if (!seen.has(label)) {
      seen.add(label);
      tags.push(label);
    }
  });
  return tags.slice(0, 5);
}

const TRAVEL_STYLE_MATRIX: Record<ThemeCategory, Partial<Record<string, string>>> = {
  wildlife: {
    relaxed: "Quiet Wildlife Watching",
    balanced: "Nature Immersion",
    explorer: "Wildlife Trail Explorer",
    "fast-paced": "Safari-Led Adventure",
  },
  beach: {
    relaxed: "Relaxed Coastal Escape",
    balanced: "Easy Coastal Rhythm",
    explorer: "Coastal Discovery",
    "fast-paced": "Island-Hopping Energy",
  },
  mountain: {
    relaxed: "Slow Mountain Retreat",
    balanced: "Mountain Balance",
    explorer: "Slow Explorer",
    "fast-paced": "Peak-to-Peak Adventure",
  },
  heritage: {
    relaxed: "Unhurried Heritage Trail",
    balanced: "Heritage & Culture Balance",
    explorer: "Cultural Wandering",
    "fast-paced": "Heritage Deep Dive",
  },
  wellness: {
    relaxed: "Slow Wellness Reset",
    balanced: "Relaxed Discovery",
    explorer: "Mindful Exploration",
    "fast-paced": "Active Wellness",
  },
  adventure: {
    relaxed: "Adventure at Your Pace",
    balanced: "Adventure Balance",
    explorer: "Full Adventure Mode",
    "fast-paced": "Non-Stop Adventure",
  },
  city: {
    relaxed: "Easy City Days",
    balanced: "City Rhythm",
    explorer: "City Discovery",
    "fast-paced": "Fast-Paced City Life",
  },
  food: {
    relaxed: "Slow Food Trail",
    balanced: "Flavour-Led Balance",
    explorer: "Food & Culture Discovery",
    "fast-paced": "Food-First Adventure",
  },
  nature: {
    relaxed: "Relaxed Nature Escape",
    balanced: "Nature Immersion",
    explorer: "Nature-Led Exploration",
    "fast-paced": "Active Outdoors",
  },
  general: {
    relaxed: "Relaxed Discovery",
    balanced: "Balanced Discovery",
    explorer: "Slow Explorer",
    "fast-paced": "Full and Active",
  },
};

/**
 * "Recommended Travel Style" — the engine's own travelStyle() only looks at
 * pace (4 fixed strings, regardless of destination), which is why "Balanced,
 * with time to pause" repeated across unrelated destinations. This combines
 * pace with the region's dominant theme category for real variation.
 */
export function travelStyleLabel(possibility: EnginePossibility): string {
  const category = themeCategoryFor(possibility);
  const pace = paceSignal(possibility);
  const label = pace ? TRAVEL_STYLE_MATRIX[category][pace] : undefined;
  return label ?? possibility.recommendedTravelStyle;
}

const CLOSING_MESSAGE_BY_CATEGORY: Record<ThemeCategory, string> = {
  wildlife: "Some of the richest moments happen when nothing is scheduled.",
  beach: "Leave space for a morning that starts later than planned.",
  mountain: "Let the pace slow down once the altitude does.",
  heritage: "The best discoveries are rarely the ones on the map.",
  wellness: "Give yourself permission to do less, on purpose.",
  adventure: "Keep one afternoon free for whatever the day suggests.",
  city: "The city opens up once you stop rushing through it.",
  food: "Some of the best conversations happen over a long meal.",
  nature: "A quiet morning here is easier to find than you'd expect.",
  general: "There's room in this journey for whatever the day brings.",
};

// Hand-authored, exact closing lines this EBC supplied for specific
// destinations. Kabini is named directly in the EBC (not by candidateId,
// since the same region can be reached via two different candidates — see
// the EBC-017C Part C findings); Goa and Bali are handled through the
// curated presentation catalogue itself (Part A) rather than here.
const CLOSING_MESSAGE_BY_REGION_ID: Record<string, string> = {
  "india-karnataka-kabini": "A quieter pace lets the wildlife come to you.",
  "india-wildlife-tours-kabini": "A quieter pace lets the wildlife come to you.",
};

/**
 * "Closing Message" (the handoffMessage shown at the very end of a
 * possibility) — previously identical templated reassurance
 * ("A Journey Director can refine X...") on every card.
 */
export function closingMessage(possibility: EnginePossibility): string {
  const exact = CLOSING_MESSAGE_BY_REGION_ID[possibility.regionId];
  if (exact) return exact;
  return CLOSING_MESSAGE_BY_CATEGORY[themeCategoryFor(possibility)];
}

/**
 * "Hero Summary" traveller-linking clause — appended to the destination's
 * own summary text so it also reflects the traveller's actual selections,
 * not just the destination.
 */
export function travellerLinkClause(passport: JourneyPassportSnapshot): string {
  const companionPhrase = COMPANION_PHRASES[passport.companion] ?? "your journey";
  const styles = passport.travelStyles.filter((value) => value && value.trim().length > 0);
  if (styles.length === 0) {
    return ` Shaped around ${companionPhrase}.`;
  }
  const phrases = styles.map((style) => STYLE_PHRASES[style] ?? style.toLowerCase());
  return ` Shaped around ${companionPhrase} and your love for ${joinNaturally(phrases)}.`;
}

