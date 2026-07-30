import type { JourneyPassportSnapshot } from "../../../types/journey-director";
import { release1JourneyCandidates, RELEASE1_CATALOGUE_METADATA } from "../catalogue";
import {
  generateJourneyRecommendations,
  normalizeJourneyPassport,
  type EngineExecutionContext,
  type EngineResult,
  type JourneyCandidate,
} from "../engine";
import { representativeProfiles } from "./representativeProfiles";

const executionContext: EngineExecutionContext = {
  knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
  operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
  generatedAt: "2026-07-30T09:00:00.000Z",
  evaluationDate: "2026-07-30",
};

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

function generate(
  passport: JourneyPassportSnapshot,
): EngineResult {
  return generateJourneyRecommendations(
    passport,
    release1JourneyCandidates,
    executionContext,
  );
}

function generateWithCatalogue(
  passport: JourneyPassportSnapshot,
  catalogue: readonly JourneyCandidate[],
) {
  return generateJourneyRecommendations(passport, catalogue, executionContext);
}

function assertRejectedBeforeScoring(
  result: EngineResult,
  candidateIds: readonly string[],
  label: string,
) {
  const rankedIds = new Set(
    result.trace.rankedCandidates.map((candidate) => candidate.candidate.id),
  );
  const shortlistedIds = new Set(
    result.possibilities.map((candidate) => candidate.candidateId),
  );

  candidateIds.forEach((candidateId) => {
    assert(
      result.trace.rejectedBeforeScoring.some(
        (candidate) =>
          candidate.candidateId === candidateId &&
          candidate.stage === "CONTRADICTION_FAILURE",
      ),
      `${label}: ${candidateId} has a contradiction rejection trace`,
    );
    assert(!rankedIds.has(candidateId), `${label}: ${candidateId} never reaches ranking`);
    assert(!shortlistedIds.has(candidateId), `${label}: ${candidateId} is never shortlisted`);
  });
}

function verifyCoreIntentExclusions() {
  const mountain = generate(representativeProfiles.mountainCelebration);
  assert(
    mountain.trace.detectedCoreIntent.intent === "MOUNTAIN" &&
      mountain.trace.detectedCoreIntent.strength === "STRONG",
    "mountain celebration detects a strong mountain intent",
  );
  assertRejectedBeforeScoring(
    mountain,
    ["goa", "dubai", "singapore", "pondicherry"],
    "mountain",
  );

  const beach = generate(representativeProfiles.beachExplorer);
  assert(
    beach.trace.detectedCoreIntent.intent === "BEACH" &&
      beach.trace.detectedCoreIntent.strength === "STRONG",
    "beach exploration detects a strong beach intent",
  );
  assertRejectedBeforeScoring(
    beach,
    ["kashmir", "himachal-pradesh"],
    "beach",
  );

  const wildlife = generate(representativeProfiles.activeFriends);
  assert(
    wildlife.trace.detectedCoreIntent.intent === "WILDLIFE",
    "wildlife profile detects wildlife as the dominant specific intent",
  );
  assert(
    wildlife.trace.rankedCandidates.every(
      (candidate) => candidate.selectedRegion.region.capabilities?.wildlife,
    ),
    "wildlife ranking contains only regions with meaningful wildlife capability",
  );
}

function verifyGeographicScope() {
  const international = generate(representativeProfiles.internationalOnly);
  assert(
    international.trace.normalizedTravelScope === "INTERNATIONAL",
    "international scope remains explicit in the trace",
  );
  assert(
    international.trace.rankedCandidates.length > 0 &&
      international.trace.rankedCandidates.every(
      (candidate) => candidate.candidate.category === "INTERNATIONAL",
      ) &&
      international.possibilities.every((candidate) =>
        release1JourneyCandidates.some(
          (catalogueCandidate) =>
            catalogueCandidate.id === candidate.candidateId &&
            catalogueCandidate.category === "INTERNATIONAL",
        ),
      ),
    "international scope never ranks or returns a domestic candidate",
  );

  const domestic = generate(representativeProfiles.domesticOnly);
  assert(
    domestic.trace.normalizedTravelScope === "DOMESTIC",
    "domestic scope remains explicit in the trace",
  );
  assert(
    domestic.trace.rankedCandidates.length > 0 &&
      domestic.trace.rankedCandidates.every(
      (candidate) => candidate.candidate.category === "DOMESTIC",
      ) &&
      domestic.possibilities.every((candidate) =>
        release1JourneyCandidates.some(
          (catalogueCandidate) =>
            catalogueCandidate.id === candidate.candidateId &&
            catalogueCandidate.category === "DOMESTIC",
        ),
      ),
    "domestic scope never ranks or returns an international candidate",
  );

  const invalidScope = {
    ...representativeProfiles.relaxedFamily,
    travelScope: "WORLDWIDE",
  } as unknown as JourneyPassportSnapshot;
  const normalized = normalizeJourneyPassport(
    invalidScope,
    executionContext.evaluationDate,
  );
  assert(
    normalized.status === "valid" && normalized.passport.travelScope === "ANY",
    "invalid non-visual scope safely normalizes to ANY",
  );
  const ambiguous = normalizeJourneyPassport(
    representativeProfiles.relaxedFamily,
    executionContext.evaluationDate,
  );
  assert(
    ambiguous.status === "valid" &&
      ambiguous.passport.coreIntent.strength === "AMBIGUOUS" &&
      ambiguous.passport.coreIntent.intent === undefined,
    "genuinely mixed physical preferences do not create a hard core intent",
  );

  const anyWildlife = generate(representativeProfiles.activeFriends);
  assert(
    anyWildlife.trace.rankedCandidates.length > 0 &&
      anyWildlife.trace.rankedCandidates.every(
        (candidate) => candidate.candidate.category === "DOMESTIC",
      ) &&
      anyWildlife.possibilities.every((candidate) =>
        release1JourneyCandidates.some(
          (catalogueCandidate) =>
            catalogueCandidate.id === candidate.candidateId &&
            catalogueCandidate.category === "DOMESTIC",
        ),
      ),
    "ANY does not force an incompatible international wildlife result",
  );

  const internationalWithKnownDomestic = generate({
    ...representativeProfiles.internationalOnly,
    destinationMode: "known",
    destination: "Goa",
  });
  assertRejectedBeforeScoring(
    internationalWithKnownDomestic,
    ["goa"],
    "international known destination",
  );
  assert(
    internationalWithKnownDomestic.trace.rankedCandidates.every(
      (candidate) => candidate.candidate.category === "INTERNATIONAL",
    ),
    "known domestic text cannot override explicit international scope",
  );
}

function verifyOperationalEligibility() {
  const base = release1JourneyCandidates.find(
    (candidate) => candidate.id === "goa",
  );
  assert(
    base !== undefined,
    "operational gate fixture uses the served Goa candidate",
  );
  const profile = representativeProfiles.relaxedFamily;

  const cases: readonly {
    label: string;
    candidate: JourneyCandidate;
    reasonCode: string;
  }[] = [
    {
      label: "paused service",
      candidate: { ...base, serviceConfidence: "PAUSED" },
      reasonCode: "SERVICE_CONFIDENCE_BELOW_AUTOMATIC_THRESHOLD",
    },
    {
      label: "incomplete data",
      candidate: { ...base, dataQuality: "INCOMPLETE" },
      reasonCode: "DESTINATION_DATA_INCOMPLETE",
    },
    {
      label: "stale data",
      candidate: { ...base, dataQuality: "STALE" },
      reasonCode: "DESTINATION_DATA_STALE",
    },
    {
      label: "expired review",
      candidate: { ...base, reviewValidUntil: "2026-07-29" },
      reasonCode: "DESTINATION_DATA_STALE",
    },
    {
      label: "confirmed companion exclusion",
      candidate: {
        ...base,
        bestFor: [
          ...base.bestFor.filter((item) => item.travellerType !== "family"),
          { travellerType: "family", level: "UNSUITABLE" },
        ],
      },
      reasonCode: "COMPANION_CONFIRMED_UNSUITABLE",
    },
    {
      label: "no active region",
      candidate: {
        ...base,
        regions: base.regions.map((region) => ({
          ...region,
          status: "INACTIVE",
        })),
      },
      reasonCode: "NO_ELIGIBLE_REGION",
    },
  ];

  cases.forEach(({ label, candidate, reasonCode }) => {
    const result = generateWithCatalogue(profile, [candidate]);
    assert(
      result.exclusions.some(
        (excluded) =>
          excluded.candidateId === candidate.id &&
          excluded.stage === "ELIGIBILITY_FAILURE" &&
          excluded.reasons.some((reason) => reason.code === reasonCode),
      ),
      `${label} produces a machine-readable eligibility rejection`,
    );
    assert(
      result.trace.rankedCandidates.length === 0,
      `${label} is rejected before scoring`,
    );
  });

  const seasonalProfile: JourneyPassportSnapshot = {
    ...profile,
    timing: "Exact Dates",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
  };
  const unavailableSeason: JourneyCandidate = {
    ...base,
    seasonality: base.seasonality.map((entry) => ({
      ...entry,
      guidance: "NOT_RECOMMENDED",
    })),
  };
  const seasonal = generateWithCatalogue(seasonalProfile, [unavailableSeason]);
  assert(
    seasonal.exclusions.some((excluded) =>
      excluded.reasons.some(
        (reason) => reason.code === "DESTINATION_SEASON_NOT_RECOMMENDED",
      ),
    ),
    "confidently unavailable fixed-date season is a hard eligibility rejection",
  );
  assert(
    seasonal.trace.rankedCandidates.length === 0,
    "seasonal eligibility rejection never reaches scoring",
  );
}

function regionProfile(
  destination: string,
  dreamJourney: JourneyPassportSnapshot["dreamJourney"],
  travelStyles: string[],
): JourneyPassportSnapshot {
  return {
    ...representativeProfiles.relaxedFamily,
    name: `Region ${destination}`,
    companion: "Couple",
    dreamJourney,
    travelStyles,
    destinationMode: "known",
    destination,
  };
}

function verifyRegionResolution() {
  const cases = [
    {
      request: "Nusa Dua",
      candidateId: "bali",
      regionId: "indonesia-bali-nusa-dua",
      profile: regionProfile(
        "Nusa Dua",
        "Tropical Escape",
        ["Beaches & Islands", "Relaxation"],
      ),
    },
    {
      request: "Chiang Mai",
      candidateId: "thailand",
      regionId: "thailand-chiang-mai",
      profile: regionProfile(
        "Chiang Mai",
        "City Discovery",
        ["Culture & Heritage", "Food & Dining"],
      ),
    },
    {
      request: "Munnar",
      candidateId: "kerala",
      regionId: "india-kerala-munnar",
      profile: regionProfile(
        "Munnar",
        "Mountain Retreat",
        ["Photography", "Food & Dining"],
      ),
    },
    {
      request: "Ooty",
      candidateId: "tamil-nadu",
      regionId: "india-tamilnadu-ooty",
      profile: regionProfile(
        "Ooty",
        "Mountain Retreat",
        ["Photography", "Food & Dining"],
      ),
    },
    {
      request: "Gulmarg",
      candidateId: "kashmir",
      regionId: "india-kashmir-gulmarg",
      profile: regionProfile(
        "Gulmarg",
        "Mountain Retreat",
        ["Photography", "Food & Dining"],
      ),
    },
  ] as const;

  cases.forEach(({ request, candidateId, regionId, profile }) => {
    const result = generate(profile);
    assert(
      result.trace.knownDestinationHandling.matchedCandidateId === candidateId &&
        result.trace.knownDestinationHandling.matchedRegionId === regionId,
      `${request} resolves to its actual catalogue region`,
    );
    const ranked = result.trace.rankedCandidates.find(
      (candidate) => candidate.candidate.id === candidateId,
    );
    assert(
      ranked?.selectedRegion.region.id === regionId,
      `${request} scores through the requested region`,
    );
    assert(
      result.destinationResolution.status === "served" &&
        result.possibilities[0]?.candidateId === candidateId &&
        result.possibilities[0]?.regionId === regionId,
      `${request} surfaces the requested compatible region`,
    );
  });
}

function verifyKnownDestinationAndDeterminism() {
  const incompatible = generate(
    representativeProfiles.incompatibleKnownDestination,
  );
  assert(
    incompatible.trace.knownDestinationHandling.matchedCandidateId === "goa" &&
      !incompatible.trace.knownDestinationHandling.preferenceApplied,
    "incompatible known Goa receives no preference for a mountain request",
  );
  assertRejectedBeforeScoring(incompatible, ["goa"], "known destination");
  assert(
    incompatible.possibilities[0]?.candidateId !== "goa",
    "incompatible known destination cannot lead the shortlist",
  );

  const repeated = generate(representativeProfiles.mountainCelebration);
  const repeatedAgain = generate(representativeProfiles.mountainCelebration);
  assert(
    JSON.stringify(repeated) === JSON.stringify(repeatedAgain),
    "identical normalized input produces an identical shortlist and trace",
  );
}

function runVerification() {
  verifyCoreIntentExclusions();
  verifyGeographicScope();
  verifyOperationalEligibility();
  verifyRegionResolution();
  verifyKnownDestinationAndDeterminism();

  console.log(
    `Journey Director intelligence steering verification passed (${checks} checks).`,
  );
  console.log(
    "Stages: eligibility → contradictions → ranking → qualified shortlist.",
  );
}

runVerification();
