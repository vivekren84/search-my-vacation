import type { JourneyRecommendationSet, JourneySessionSnapshot, JourneySynopsis } from "@/types/journey-director";

const referenceAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function referencePart(length: number) {
  const values = new Uint32Array(length);
  globalThis.crypto?.getRandomValues?.(values);
  return Array.from(values, (value, index) => referenceAlphabet[(value || Math.floor(Math.random() * referenceAlphabet.length) + index) % referenceAlphabet.length]).join("");
}

export function createJourneyReference() {
  return `SMV-${referencePart(8)}`;
}

export function isJourneyReference(value: unknown): value is string {
  return typeof value === "string" && /^SMV-[A-Z2-9]{8}$/.test(value);
}

function isRecoverableJourneyReference(value: unknown): value is string {
  return isJourneyReference(value) || (typeof value === "string" && /^JY-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(value));
}

export function createJourneySynopsis(set: JourneyRecommendationSet, activePossibilityId: string): JourneySynopsis | null {
  const possibility = set.possibilities.find((item) => item.id === activePossibilityId) ?? set.possibilities[0];
  const passport = set.traveller;
  if (!passport || !possibility) return null;
  return {
    travellerFirstName: passport.name.trim(), travellingParty: passport.companion,
    approximatePartySize: "to-be-confirmed", travelTiming: passport.timing,
    journeyIntent: set.reflection, preferredComfort: "to-be-discussed", preferredPace: "to-be-discussed",
    ...(passport.destinationMode === "known" && passport.destination.trim() ? { knownDestination: passport.destination.trim() } : {}),
    recommendedPossibility: { id: possibility.id, destination: possibility.destination, region: possibility.region, personality: possibility.personality, personalityLabel: possibility.personalityLabel, whyThisFits: possibility.reasons.map((reason) => reason.description), planningConsiderations: [...possibility.cautions] },
    createdAt: new Date().toISOString(),
  };
}

export function isJourneySessionSnapshot(value: unknown): value is JourneySessionSnapshot {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<JourneySessionSnapshot>;
  const callback = session.callbackPreference;
  // Callback preferences are optional, non-essential session data. Keep a valid
  // Journey Session recoverable even when an older or malformed preference needs
  // to be discarded by the presentation layer.
  const hasRecoverableCallback = callback === null || (typeof callback === "object" && !Array.isArray(callback));
  return session.version === 2 && Boolean(session.passport) && isRecoverableJourneyReference(session.journeyReference) && Boolean(session.journeySynopsis) && typeof session.journeySynopsis?.travellerFirstName === "string" && typeof session.journeySynopsis?.recommendedPossibility?.id === "string" && typeof session.activePossibilityId === "string" && (session.activeRecommendationPersonality === "perfect-match" || session.activeRecommendationPersonality === "different-rhythm" || session.activeRecommendationPersonality === "pleasant-surprise") && (session.selectedRecommendationPersonality === null || session.selectedRecommendationPersonality === "perfect-match" || session.selectedRecommendationPersonality === "different-rhythm" || session.selectedRecommendationPersonality === "pleasant-surprise") && Array.isArray(session.visitedPossibilityIds) && session.visitedPossibilityIds.every((id) => typeof id === "string") && typeof session.handoffConsent === "boolean" && hasRecoverableCallback;
}
