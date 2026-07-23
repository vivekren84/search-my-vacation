import { isJourneyFeeling } from "../../../types/journey-passport.types";
import type { JourneyPassportSnapshot } from "../../../types/journey-director";

import {
  ALLOWED_COMPANIONS,
  ALLOWED_DREAM_JOURNEYS,
  ALLOWED_TIMING,
  ALLOWED_TRAVEL_STYLES,
  COMPANION_MAP,
  DREAM_JOURNEY_MAP,
  HOMEPAGE_FEELING_MAP,
  TRAVEL_STYLE_MAP,
} from "./engine.rules";
import {
  JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
  type DestinationIntent,
  type EmotionId,
  type MemoryGoalId,
  type NormalizedJourneyPassport,
  type NormalizedTiming,
  type PassportNormalizationResult,
  type PassportValidationIssue,
  type SignalEvidence,
  type ThemeId,
  type TravelPace,
  type TravellerType,
  type WeightedSignal,
} from "./engine.types";

type MutableSignal<T extends string> = {
  id: T;
  strength: number;
  evidence: SignalEvidence[];
};

function addSignal<T extends string>(
  collection: Map<T, MutableSignal<T>>,
  id: T,
  strength: number,
  evidence: SignalEvidence,
) {
  const existing = collection.get(id);

  if (existing) {
    existing.strength = Math.min(1, Math.max(existing.strength, strength));
    existing.evidence.push(evidence);
    return;
  }

  collection.set(id, { id, strength, evidence: [evidence] });
}

function finalizeSignals<T extends string>(collection: Map<T, MutableSignal<T>>): readonly WeightedSignal<T>[] {
  return [...collection.values()]
    .map((signal) => ({ ...signal, evidence: [...signal.evidence] }))
    // Modern ECMAScript sorting is stable, preserving the traveller's governed
    // selection order when two signals have the same evidence strength.
    .sort((left, right) => right.strength - left.strength);
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function monthFromIsoDate(value: string) {
  return Number(value.slice(5, 7));
}

function monthsBetween(startDate: string, endDate: string) {
  const current = new Date(`${startDate.slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(`${endDate.slice(0, 7)}-01T00:00:00Z`);
  const months: number[] = [];

  while (current <= end && months.length < 24) {
    months.push(current.getUTCMonth() + 1);
    current.setUTCMonth(current.getUTCMonth() + 1);
  }

  return [...new Set(months)];
}

function shiftedMonth(evaluationDate: string, offset: number) {
  const base = new Date(`${evaluationDate}T00:00:00Z`);
  base.setUTCMonth(base.getUTCMonth() + offset);
  return base.getUTCMonth() + 1;
}

function normalizeTiming(snapshot: JourneyPassportSnapshot, evaluationDate: string): NormalizedTiming {
  switch (snapshot.timing) {
    case "Within the Next Month":
      return {
        kind: "relative-window",
        sourceValue: snapshot.timing,
        months: [shiftedMonth(evaluationDate, 1)],
        fixed: false,
      };
    case "In the Next 2–3 Months":
      return {
        kind: "relative-window",
        sourceValue: snapshot.timing,
        months: [shiftedMonth(evaluationDate, 2), shiftedMonth(evaluationDate, 3)],
        fixed: false,
      };
    case "Later This Year": {
      const currentMonth = monthFromIsoDate(evaluationDate);
      const months = Array.from({ length: Math.max(0, 12 - currentMonth) }, (_, index) => currentMonth + index + 1);

      return {
        kind: "later-year",
        sourceValue: snapshot.timing,
        months,
        fixed: false,
      };
    }
    case "Exact Dates": {
      return {
        kind: "exact-dates",
        sourceValue: snapshot.timing,
        startDate: snapshot.startDate,
        endDate: snapshot.endDate,
        months: monthsBetween(snapshot.startDate, snapshot.endDate),
        fixed: true,
      };
    }
    case "I’m Flexible":
      return { kind: "flexible", sourceValue: snapshot.timing, months: [], fixed: false };
  }

  return { kind: "flexible", sourceValue: snapshot.timing, months: [], fixed: false };
}

function validatePassport(snapshot: JourneyPassportSnapshot, evaluationDate: string): PassportValidationIssue[] {
  const issues: PassportValidationIssue[] = [];

  if (snapshot.source !== "journey-passport") {
    issues.push({
      code: "PASSPORT_SOURCE_NOT_ALLOWED",
      field: "source",
      explanation: "The production engine accepts only a completed Journey Passport source.",
    });
  }

  if (snapshot.name.trim().length < 2) {
    issues.push({ code: "MISSING_NAME", field: "name", explanation: "A completed Passport requires a preferred name." });
  }

  if (!ALLOWED_COMPANIONS.has(snapshot.companion)) {
    issues.push({
      code: "INVALID_COMPANION",
      field: "companion",
      explanation: "The companion value is not part of Journey Passport v1.0.",
    });
  }

  if (!ALLOWED_DREAM_JOURNEYS.has(snapshot.dreamJourney)) {
    issues.push({
      code: "INVALID_DREAM_JOURNEY",
      field: "dreamJourney",
      explanation: "The Dream Journey value is not part of Journey Passport v1.0.",
    });
  }

  if (
    snapshot.travelStyles.length < 1 ||
    snapshot.travelStyles.length > 3 ||
    snapshot.travelStyles.some((style) => !ALLOWED_TRAVEL_STYLES.has(style))
  ) {
    issues.push({
      code: "INVALID_TRAVEL_STYLES",
      field: "travelStyles",
      explanation: "Journey Passport v1.0 requires one to three approved Travel Style selections.",
    });
  }

  if (!ALLOWED_TIMING.has(snapshot.timing)) {
    issues.push({ code: "INVALID_TIMING", field: "timing", explanation: "The timing value is not approved for v1.0." });
  }

  if (
    snapshot.timing === "Exact Dates" &&
    (!isIsoDate(snapshot.startDate) ||
      !isIsoDate(snapshot.endDate) ||
      snapshot.endDate <= snapshot.startDate ||
      snapshot.startDate < evaluationDate)
  ) {
    issues.push({
      code: "INVALID_EXACT_DATES",
      field: "startDate",
      explanation: "Exact Dates require a valid future start date and a later end date.",
    });
  }

  if (snapshot.destinationMode !== "known" && snapshot.destinationMode !== "discovery") {
    issues.push({
      code: "INVALID_DESTINATION_MODE",
      field: "destinationMode",
      explanation: "Destination intent must be known or discovery.",
    });
  } else if (snapshot.destinationMode === "known" && snapshot.destination.trim().length < 2) {
    issues.push({
      code: "MISSING_KNOWN_DESTINATION",
      field: "destination",
      explanation: "Known-destination mode requires the traveller's destination wording.",
    });
  }

  return issues;
}

function classifyIssues(issues: readonly PassportValidationIssue[]) {
  const insufficientCodes = new Set([
    "MISSING_NAME",
    "INVALID_TRAVEL_STYLES",
    "MISSING_KNOWN_DESTINATION",
  ]);

  return issues.every((issue) => insufficientCodes.has(issue.code)) ? "insufficient-input" as const : "invalid-input" as const;
}

export function normalizeJourneyPassport(
  snapshot: JourneyPassportSnapshot,
  evaluationDate: string,
): PassportNormalizationResult {
  const issues = validatePassport(snapshot, evaluationDate);

  if (issues.length > 0) {
    return { status: classifyIssues(issues), issues };
  }

  const companionSignals = new Map<TravellerType, MutableSignal<TravellerType>>();
  const emotionSignals = new Map<EmotionId, MutableSignal<EmotionId>>();
  const themeSignals = new Map<ThemeId, MutableSignal<ThemeId>>();
  const memorySignals = new Map<MemoryGoalId, MutableSignal<MemoryGoalId>>();
  const paceSignals = new Map<TravelPace, MutableSignal<TravelPace>>();
  const sourceEvidence: SignalEvidence[] = [];

  const companionEvidence: SignalEvidence = {
    sourceField: "companion",
    sourceValue: snapshot.companion,
    strengthKind: "explicit",
  };
  addSignal(companionSignals, COMPANION_MAP[snapshot.companion], 1, companionEvidence);
  sourceEvidence.push(companionEvidence);

  const homepageFeeling = snapshot.entryContext?.feeling;
  if (isJourneyFeeling(homepageFeeling)) {
    const homepageFeelingEvidence: SignalEvidence = {
      sourceField: "entryContext",
      sourceValue: homepageFeeling,
      strengthKind: "explicit",
    };
    addSignal(emotionSignals, HOMEPAGE_FEELING_MAP[homepageFeeling], 0.6, homepageFeelingEvidence);
    sourceEvidence.push(homepageFeelingEvidence);
  }

  const dreamMapping = DREAM_JOURNEY_MAP[snapshot.dreamJourney];
  const dreamEvidence: SignalEvidence = {
    sourceField: "dreamJourney",
    sourceValue: snapshot.dreamJourney,
    strengthKind: "derived",
  };
  dreamMapping.emotions.forEach((id) => addSignal(emotionSignals, id, 0.6, dreamEvidence));
  dreamMapping.themes.forEach((id) => addSignal(themeSignals, id, 0.6, dreamEvidence));
  dreamMapping.memoryGoals.forEach((id) => addSignal(memorySignals, id, 0.6, dreamEvidence));
  dreamMapping.paces.forEach((id) => addSignal(paceSignals, id, 0.6, dreamEvidence));
  sourceEvidence.push(dreamEvidence);

  snapshot.travelStyles.forEach((style) => {
    const mapping = TRAVEL_STYLE_MAP[style];
    const explicitEvidence: SignalEvidence = {
      sourceField: "travelStyles",
      sourceValue: style,
      strengthKind: "explicit",
    };
    const derivedEvidence: SignalEvidence = { ...explicitEvidence, strengthKind: "derived" };

    mapping.emotions.forEach((id) => addSignal(emotionSignals, id, 1, explicitEvidence));
    mapping.themes.forEach((id) => addSignal(themeSignals, id, 1, explicitEvidence));
    mapping.memoryGoals.forEach((id) => addSignal(memorySignals, id, 1, explicitEvidence));
    mapping.derivedPaces?.forEach((id) => addSignal(paceSignals, id, 0.6, derivedEvidence));
    sourceEvidence.push(explicitEvidence);
  });

  const timingEvidence: SignalEvidence = {
    sourceField: "timing",
    sourceValue: snapshot.timing,
    strengthKind: "explicit",
  };
  sourceEvidence.push(timingEvidence);

  const destinationIntent: DestinationIntent = {
    mode: snapshot.destinationMode,
    rawText: snapshot.destination.trim(),
  };

  if (snapshot.destinationMode === "known") {
    sourceEvidence.push({
      sourceField: "destination",
      sourceValue: snapshot.destination.trim(),
      strengthKind: "explicit",
    });
  }

  const normalized: NormalizedJourneyPassport = {
    schemaVersion: JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
    travellerName: snapshot.name.trim(),
    entryContext: homepageFeeling ? { feeling: homepageFeeling } : {},
    companions: finalizeSignals(companionSignals),
    emotions: finalizeSignals(emotionSignals),
    themes: finalizeSignals(themeSignals),
    memoryGoals: finalizeSignals(memorySignals),
    pacePreferences: finalizeSignals(paceSignals),
    // Comfort is intentionally unknown because Journey Passport v1.0 does not collect it.
    comfortPreferences: [],
    timing: normalizeTiming(snapshot, evaluationDate),
    destinationIntent,
    sourceEvidence,
    completeness: 1,
  };

  return { status: "valid", passport: normalized };
}
