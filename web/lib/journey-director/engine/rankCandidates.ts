import type { NormalizedJourneyPassport, RankedCandidate, ServiceConfidence } from "./engine.types";

const serviceConfidenceRank: Record<ServiceConfidence, number> = {
  CONFIDENT: 4,
  SUPPORTED: 3,
  LIMITED: 2,
  PAUSED: 1,
};

function compareIds(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function materialTradeOffCount(candidate: RankedCandidate) {
  return candidate.penalties.filter((penalty) => penalty.severity === "material").length;
}

export function compareRankedCandidates(left: RankedCandidate, right: RankedCandidate) {
  const scoreDifference = right.totalScore - left.totalScore;
  if (Math.abs(scoreDifference) > 0.5) return scoreDifference;

  const emotionDifference = right.primaryEmotionMatch - left.primaryEmotionMatch;
  if (emotionDifference !== 0) return emotionDifference;

  const regionDifference = right.selectedRegion.score - left.selectedRegion.score;
  if (regionDifference !== 0) return regionDifference;

  const tradeOffDifference = materialTradeOffCount(left) - materialTradeOffCount(right);
  if (tradeOffDifference !== 0) return tradeOffDifference;

  const memoryDifference = right.memoryGoalMatch - left.memoryGoalMatch;
  if (memoryDifference !== 0) return memoryDifference;

  const operationalDifference =
    serviceConfidenceRank[right.candidate.serviceConfidence] -
    serviceConfidenceRank[left.candidate.serviceConfidence];
  if (operationalDifference !== 0) return operationalDifference;

  return compareIds(left.candidate.id, right.candidate.id);
}

export function rankCandidates(candidates: readonly RankedCandidate[], passport?: NormalizedJourneyPassport): readonly RankedCandidate[] {
  const mountainPriority = (candidate: RankedCandidate) => {
    if (passport?.coreIntent.strength !== "STRONG" || passport.coreIntent.intent !== "MOUNTAIN") return 0;
    const value = `${candidate.candidate.id} ${candidate.candidate.name} ${candidate.selectedRegion.region.id} ${candidate.selectedRegion.region.name}`.toLocaleLowerCase("en-US");
    if (/kashmir|ladakh/.test(value)) return 100;
    if (/himachal|manali|shimla|spiti/.test(value)) return 95;
    if (/sikkim/.test(value)) return 90;
    if (/meghalaya/.test(value)) return 85;
    if (/ooty|kodaikanal|kotagiri/.test(value)) return 80;
    if (/munnar/.test(value)) return 60;
    return 40;
  };
  return [...candidates]
    .sort((left, right) => mountainPriority(right) - mountainPriority(left) || compareRankedCandidates(left, right))
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
}
