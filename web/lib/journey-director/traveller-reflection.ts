import type {
  EngineResult,
  NormalizedJourneyPassport,
} from "./engine";
import type {
  JourneyEvidenceReference,
  JourneyPassportSnapshot,
  TravellerInsight,
  TravellerReflection,
  TravellerSummary,
} from "../../types/journey-director";
import type { JourneyFeeling } from "../../types/journey-passport.types";

type ReflectionLanguage = {
  statement: string;
  quality: string;
  summary: string;
};

const companionLanguage: Readonly<Record<string, ReflectionLanguage>> = {
  Solo: {
    statement:
      "You want the freedom to follow your own rhythm while still feeling thoughtfully supported.",
    quality: "Freedom with reassurance",
    summary: "travelling independently",
  },
  Couple: {
    statement:
      "You value uninterrupted time together more than a long list of attractions.",
    quality: "Time for two",
    summary: "sharing the journey as a couple",
  },
  Family: {
    statement:
      "You are looking for shared memories, with enough ease for everyone to enjoy them.",
    quality: "Meaningful family time",
    summary: "travelling with family",
  },
  Friends: {
    statement:
      "You want a journey with stories, laughter, and space for everyone’s idea of a good day.",
    quality: "Moments worth sharing",
    summary: "travelling with friends",
  },
  Business: {
    statement:
      "You want purposeful travel to leave room for connection, comfort, and renewal.",
    quality: "Purpose with breathing room",
    summary: "travelling with colleagues",
  },
};

const dreamLanguage: Readonly<Record<string, ReflectionLanguage>> = {
  "Tropical Escape": {
    statement:
      "Warmth, open skies, and slower mornings are at the heart of the journey you described.",
    quality: "A warm, unhurried escape",
    summary: "a tropical escape",
  },
  "Mountain Retreat": {
    statement:
      "You are drawn to fresh air, far-reaching views, and the perspective mountains can create.",
    quality: "Space to breathe",
    summary: "a mountain retreat",
  },
  "City Discovery": {
    statement:
      "You want the energy of a new place, with culture and stories waiting around every corner.",
    quality: "Meaningful urban discovery",
    summary: "a city discovery",
  },
  "Cruise Voyage": {
    statement:
      "You are imagining a graceful journey where the horizon changes without the experience feeling rushed.",
    quality: "Effortless variety",
    summary: "a cruise voyage",
  },
  "Winter Wonderland": {
    statement:
      "A beautiful change of season and pace is part of what makes this journey feel special.",
    quality: "A magical change of scene",
    summary: "a winter journey",
  },
  "Wildlife Adventure": {
    statement:
      "You want to feel close to wild places and return with stories that could not happen at home.",
    quality: "Wild discovery",
    summary: "a wildlife adventure",
  },
};

const timingLanguage: Readonly<Record<string, ReflectionLanguage>> = {
  "Within the Next Month": {
    statement:
      "You are ready for a change of scene without turning planning into another task.",
    quality: "Simple, confident planning",
    summary: "within the next month",
  },
  "In the Next 2–3 Months": {
    statement:
      "There is something special ahead, with enough time to shape it thoughtfully.",
    quality: "Thoughtful anticipation",
    summary: "in the next two to three months",
  },
  "Later This Year": {
    statement:
      "You are giving this journey the time it deserves rather than rushing the decision.",
    quality: "A journey shaped with care",
    summary: "later this year",
  },
  "I’m Flexible": {
    statement:
      "You are open to possibility and want to recognise the right journey before choosing its date.",
    quality: "Choice without pressure",
    summary: "with flexible timing",
  },
  "Exact Dates": {
    statement:
      "Your timing is clear, so the experience can be shaped around what matters most.",
    quality: "A journey ready to take shape",
    summary: "on the dates you selected",
  },
};

const styleLanguage: Readonly<Record<string, ReflectionLanguage>> = {
  Relaxation: {
    statement:
      "You want this journey to give something back to you, with room to exhale.",
    quality: "Restorative calm",
    summary: "rest and an easier rhythm",
  },
  Adventure: {
    statement:
      "You want discovery to feel active, memorable, and a little beyond the everyday.",
    quality: "A sense of adventure",
    summary: "active discovery",
  },
  "Food & Dining": {
    statement:
      "You want to understand a place through its flavours, tables, and local stories.",
    quality: "A journey rich in flavour",
    summary: "food-led discovery",
  },
  "Culture & Heritage": {
    statement:
      "You are looking for meaning behind the places you visit, not simply sights to collect.",
    quality: "Culture with context",
    summary: "culture and heritage",
  },
  Photography: {
    statement:
      "You notice atmosphere, light, and the details that make a place memorable.",
    quality: "Scenes worth remembering",
    summary: "photographic memories",
  },
  Nature: {
    statement:
      "Natural surroundings are part of how you disconnect, recharge, and feel present.",
    quality: "Nature that restores",
    summary: "time in nature",
  },
  Wildlife: {
    statement:
      "You are drawn to encounters with the natural world that feel respectful and special.",
    quality: "Thoughtful wildlife moments",
    summary: "wildlife encounters",
  },
  "Beaches & Islands": {
    statement:
      "Open water, warm light, and an easier daily rhythm are central to your idea of escape.",
    quality: "Time beside the water",
    summary: "beaches and islands",
  },
  Celebrations: {
    statement:
      "You want this journey to honour a moment in a way everyone will remember.",
    quality: "A sense of occasion",
    summary: "a meaningful celebration",
  },
};

const homepageFeelingQuality = {
  relax: "A restorative pause",
  explore: "Room to discover",
  celebrate: "A sense of occasion",
  romance: "Time to reconnect",
  escape: "A genuine change of scene",
  // EBC-036 (D-08): Memory Maker now enters via `?mood=memory` alongside the
  // other five moods, so it needs a matching Journey Director summary
  // quality — without this entry the lookup below would silently push
  // `undefined` into the traveller's "matching qualities" list.
  memory: "Moments made together",
} as const satisfies Record<JourneyFeeling, string>;

const signalLabels: Readonly<Record<string, string>> = {
  "active-discovery": "active discovery",
  adventure: "adventure",
  backwaters: "backwaters",
  beaches: "beaches",
  celebration: "celebration",
  "celebration-moments": "celebration memories",
  "city-break": "city discovery",
  culture: "culture",
  "cultural-discovery": "cultural discovery",
  discovery: "discovery",
  escape: "escape",
  "food-discovery": "food discovery",
  food: "food",
  islands: "islands",
  "island-escape": "island time",
  nature: "nature",
  "nature-connection": "connection with nature",
  "photographic-memories": "photographic memories",
  photography: "photography",
  reconnection: "reconnection",
  relaxation: "relaxation",
  "restorative-calm": "restorative calm",
  serenity: "serenity",
  "shared-time": "meaningful time together",
  wildlife: "wildlife",
  "wildlife-encounters": "wildlife encounters",
  wonder: "wonder",
};

function passportEvidence(id: string, explanation: string): JourneyEvidenceReference {
  return { source: "passport", id, explanation };
}

function recognizedStyles(passport: JourneyPassportSnapshot) {
  return passport.travelStyles
    .map((style) => ({ sourceValue: style, language: styleLanguage[style] }))
    .filter(
      (
        value,
      ): value is { sourceValue: string; language: ReflectionLanguage } =>
        Boolean(value.language),
    );
}

function normalizedPassport(result: EngineResult): NormalizedJourneyPassport | undefined {
  return result.trace.normalizedPassport;
}

function labels(values: readonly string[]) {
  return values.map((value) => signalLabels[value] ?? value.replaceAll("-", " "));
}

function sentenceList(values: readonly string[]) {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

export function buildTravellerInsights(
  passport: JourneyPassportSnapshot,
): TravellerInsight[] {
  const insights: TravellerInsight[] = [];
  const dream = dreamLanguage[passport.dreamJourney];
  const companion = companionLanguage[passport.companion];
  const timing = timingLanguage[passport.timing];
  const styles = recognizedStyles(passport);

  if (dream) {
    insights.push({
      id: "dream",
      eyebrow: "The journey in your heart",
      statement: dream.statement,
      evidence: [passportEvidence("dreamJourney", passport.dreamJourney)],
    });
  }

  if (companion) {
    insights.push({
      id: "companions",
      eyebrow: "Who this is for",
      statement: companion.statement,
      evidence: [passportEvidence("companion", passport.companion)],
    });
  }

  if (styles[0]) {
    insights.push({
      id: "memories",
      eyebrow: "What you want to bring home",
      statement: styles[0].language.statement,
      evidence: [passportEvidence("travelStyles", styles[0].sourceValue)],
    });
  }

  if (timing) {
    insights.push({
      id: "rhythm",
      eyebrow: "How it should unfold",
      statement: timing.statement,
      evidence: [passportEvidence("timing", passport.timing)],
    });
  }

  return insights;
}

export function buildMatchingQualities(passport: JourneyPassportSnapshot) {
  const qualities: string[] = [];
  const styles = recognizedStyles(passport);
  const dream = dreamLanguage[passport.dreamJourney];
  const companion = companionLanguage[passport.companion];
  const timing = timingLanguage[passport.timing];

  styles.forEach(({ language }) => qualities.push(language.quality));
  if (dream) qualities.push(dream.quality);
  if (companion) qualities.push(companion.quality);
  if (timing) qualities.push(timing.quality);

  if (styles.length === 0 && passport.entryContext?.feeling) {
    qualities.push(homepageFeelingQuality[passport.entryContext.feeling]);
  }

  return [...new Set(qualities)].slice(0, 6);
}

export function buildTravellerSummary(
  passport: JourneyPassportSnapshot,
  result: EngineResult,
): TravellerSummary {
  const normalized = normalizedPassport(result);

  return {
    ...(passport.name.trim() ? { name: passport.name.trim() } : {}),
    ...(passport.companion ? { companion: passport.companion } : {}),
    themes: labels(normalized?.themes.map((signal) => signal.id) ?? []),
    memoryPreferences: labels(
      normalized?.memoryGoals.map((signal) => signal.id) ?? [],
    ),
    ...(passport.timing ? { timing: passport.timing } : {}),
    comfort: labels(
      normalized?.comfortPreferences.map((signal) => signal.id) ?? [],
    ),
    pace: labels(normalized?.pacePreferences.map((signal) => signal.id) ?? []),
    // Journey Passport v1.0 does not collect these fields.
    restrictions: [],
    preferences: [],
  };
}

function outcomeMessage(result: EngineResult) {
  switch (result.status) {
    case "success":
      return "Three considered possibilities met the recommendation standard.";
    case "partial":
      return "A smaller set of possibilities met the recommendation standard, so we have kept the shortlist focused.";
    case "insufficient-input":
      return "A little more traveller context is needed before we can recommend with confidence.";
    case "insufficient-candidates":
      return "The current destination collection did not produce a confident automatic match.";
    case "invalid-input":
      return "This Journey Passport needs review before recommendations can be prepared.";
  }
}

export function buildTravellerReflection(
  passport: JourneyPassportSnapshot,
  result: EngineResult,
): TravellerReflection {
  const name = passport.name.trim();
  const companion = companionLanguage[passport.companion];
  const dream = dreamLanguage[passport.dreamJourney];
  const timing = timingLanguage[passport.timing];
  const styles = recognizedStyles(passport);
  const normalized = normalizedPassport(result);
  const subject = name ? `${name}, you seem` : "You seem";
  const intentParts = [
    dream?.summary,
    companion?.summary,
  ].filter((value): value is string => Boolean(value));
  const explicitStyleSummaries = styles.map(({ language }) => language.summary);
  const leadingSignals = labels([
    ...(normalized?.emotions.slice(0, 1).map((signal) => signal.id) ?? []),
    ...(normalized?.themes.slice(0, 2).map((signal) => signal.id) ?? []),
  ]);

  const openingRecognition = intentParts.length > 0
    ? `${subject} to be looking for ${sentenceList(intentParts)}.`
    : `${subject} to be looking for a journey shaped around the details you shared.`;

  const travelCharacter = explicitStyleSummaries.length > 0
    ? `The character you described centres on ${sentenceList(explicitStyleSummaries)}${timing ? `, ${timing.summary}` : ""}.`
    : timing
      ? `You are approaching this journey ${timing.summary}.`
      : "The Journey Director will preserve the choices you made without filling in details you did not provide.";

  const recommendationTransition = leadingSignals.length > 0
    ? `The possibilities below carry forward the strongest signals around ${sentenceList(leadingSignals)}.`
    : "The possibilities below reflect only the evidence available in your completed Journey Passport.";

  return {
    openingRecognition,
    travelCharacter,
    recommendationTransition,
    outcomeMessage: outcomeMessage(result),
  };
}
