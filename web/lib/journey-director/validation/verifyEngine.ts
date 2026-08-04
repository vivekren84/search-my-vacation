import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  journeyThemeForDestinationCategory,
  publicDestinationGroups,
  resolvePublicDestinationPassportContext,
} from "../../../config/public-destinations.config";
import {
  JOURNEY_ENTRY_EXPERIENCES,
  JOURNEY_ENTRY_INSPIRATIONS,
  JOURNEY_FEELINGS,
  JOURNEY_PASSPORT_SCHEMA_VERSION,
  type JourneyFeeling,
  type JourneyPassportState,
} from "../../../types/journey-passport.types";
import { createInitialJourneyPassportState, JOURNEY_ENTRY_ADVISORY, resolveJourneyEntryPreselection } from "../../journey-passport/entry-context";
import {
  createJourneyPassportSnapshot,
  isJourneyPassportSnapshot,
} from "../passport-adapter";
import { generateJourneyRecommendations, normalizeJourneyPassport } from "../engine";
import type { EngineExecutionContext, EngineResult } from "../engine";
import { representativeProfiles } from "./representativeProfiles";
import { verificationCandidates } from "./verificationCandidates";

const executionContext: EngineExecutionContext = {
  knowledgeBaseVersion: "verification-fixture-1.0",
  operationalSnapshotId: "verification-2026-07-22",
  generatedAt: "2026-07-22T10:00:00.000Z",
  evaluationDate: "2026-07-22",
};

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

function stableResult(result: EngineResult) {
  return {
    status: result.status,
    versions: result.versions,
    normalizedInputSummary: result.normalizedInputSummary,
    possibilities: result.possibilities,
    destinationResolution: result.destinationResolution,
    exclusions: result.exclusions,
    recovery: result.recovery,
    trace: result.trace,
  };
}

function completedPassportState(
  feeling?: JourneyFeeling,
  overrides: Partial<JourneyPassportState> = {},
): JourneyPassportState {
  return {
    schemaVersion: JOURNEY_PASSPORT_SCHEMA_VERSION,
    currentMoment: "discover",
    name: "Vivek",
    companion: "Family",
    dreamJourney: "Tropical Escape",
    travelStyles: ["Relaxation", "Nature", "Food & Dining"],
    timing: "I’m Flexible",
    startDate: "",
    endDate: "",
    destinationMode: "discovery",
    destination: "",
    mobile: "+91 98765 43210",
    journeyReference: "SMV-ABCD2345",
    entryContext: {
      ...(feeling ? { feeling } : {}),
      source: feeling ? "homepage" : "direct",
    },
    visitedMoments: [
      "welcome",
      "about-you",
      "companions",
      "dream-journey",
      "pace-and-timing",
      "destination",
      "discover",
    ],
    completion: "idle",
    navigationDirection: "forward",
    updatedAt: 1_774_166_400_000,
    ...overrides,
  };
}

function verifyReconciledScores(result: EngineResult) {
  result.trace.rankedCandidates.forEach((candidate) => {
    const contributionTotal = candidate.breakdown.reduce(
      (sum, factor) => sum + factor.finalContribution,
      0,
    );
    const penaltyTotal = candidate.penalties.reduce((sum, penalty) => sum + penalty.points, 0);
    const expectedTotal = Math.max(0, Math.min(100, candidate.baseScore - penaltyTotal));

    assert(Math.abs(contributionTotal - candidate.baseScore) < 0.02, `${candidate.candidate.id} base score reconciles`);
    assert(Math.abs(expectedTotal - candidate.totalScore) < 0.02, `${candidate.candidate.id} final score reconciles`);
    assert(
      candidate.breakdown.every((factor) =>
        Math.abs(factor.rawMatch * factor.weight - factor.finalContribution) < 0.02,
      ),
      `${candidate.candidate.id} factor contributions reconcile`,
    );
  });
}

function verifyPureEngineBoundary() {
  const engineDirectory = join(process.cwd(), "lib", "journey-director", "engine");
  const prohibited = [
    { pattern: /from ["']react["']/, label: "React import" },
    { pattern: /from ["']next(?:\/[^"']*)?["']/, label: "Next.js import" },
    { pattern: /sessionStorage|localStorage|window\.|document\./, label: "browser API" },
    { pattern: /Math\.random\(\)|Date\.now\(\)/, label: "hidden nondeterministic input" },
  ];

  readdirSync(engineDirectory)
    .filter((name) => name.endsWith(".ts"))
    .forEach((name) => {
      const source = readFileSync(join(engineDirectory, name), "utf8");
      prohibited.forEach(({ pattern, label }) => {
        assert(!pattern.test(source), `${name} contains no ${label}`);
      });
    });
}

function verifyJourneyEntryContext() {
  const experienceValues = ["Photography", "Celebrations", "Family", "Within the Next Month", "City Discovery", "Nature"];
  JOURNEY_ENTRY_EXPERIENCES.forEach((experience, index) => {
    const context = { experience, source: "experience" } as const;
    const preselection = resolveJourneyEntryPreselection(context);
    assert(preselection?.value === experienceValues[index], `${experience} resolves to its governed Passport preselection`);
    const state = createInitialJourneyPassportState(context);
    assert(state.currentMoment === "welcome" && state.visitedMoments.join("|") === "welcome", `${experience} starts at Welcome without skipping a Passport page`);
  });

  const moodValues = ["Relaxation", "Adventure", "Celebrations", "Couple", "Tropical Escape"];
  JOURNEY_FEELINGS.forEach((feeling, index) => {
    const context = { feeling, source: "mood" } as const;
    const preselection = resolveJourneyEntryPreselection(context);
    assert(preselection?.value === moodValues[index], `${feeling} resolves to its editable mood preselection`);
    const state = createInitialJourneyPassportState(context);
    assert(state.currentMoment === "welcome" && state.visitedMoments.join("|") === "welcome", `${feeling} starts at Welcome without skipping a Passport page`);
  });

  const inspirationValues = ["Mountain Retreat", "Beaches & Islands", "Wildlife Adventure", "Couple", "Relaxation"];
  JOURNEY_ENTRY_INSPIRATIONS.forEach((inspiration, index) => {
    const preselection = resolveJourneyEntryPreselection({ inspiration, source: "inspiration" });
    assert(preselection?.value === inspirationValues[index], `${inspiration} resolves to its governed inspiration preselection`);
  });

  const categoryExamples = [
    ["India · Beaches", "Tropical Escape"],
    ["India · Wildlife", "Wildlife Adventure"],
    ["India · Heritage", "City Discovery"],
    ["India · Islands", "Tropical Escape"],
    ["India · Hill Stations", "Mountain Retreat"],
    ["India · Spiritual", "City Discovery"],
    ["International · Cities", "City Discovery"],
  ] as const;
  categoryExamples.forEach(([label, expected]) => {
    assert(journeyThemeForDestinationCategory(label) === expected, `${label} resolves to ${expected}`);
  });

  const destinationCards = publicDestinationGroups.flatMap((group) => group.cards);
  destinationCards.forEach((card) => {
    const context = resolvePublicDestinationPassportContext(card.destinationId);
    assert(context?.destination === card.title, `${card.title} carries its verified destination name into the Passport`);
    assert(context?.source === "destination", `${card.title} records destination entry provenance`);
    assert(Boolean(context?.destinationTheme), `${card.title} resolves an editable Journey Theme`);
    const state = createInitialJourneyPassportState(context);
    assert(state.currentMoment === "welcome" && state.visitedMoments.join("|") === "welcome", `${card.title} starts at Welcome without skipping a Passport page`);
    assert(state.destinationMode === "known" && state.destination === card.title, `${card.title} defaults to a known editable destination`);
    assert(state.dreamJourney === context?.destinationTheme, `${card.title} pre-selects its governed Journey Theme`);
  });

  const kashmir = resolvePublicDestinationPassportContext("kashmir");
  assert(kashmir?.destination === "Kashmir" && kashmir.destinationTheme === "Mountain Retreat", "Kashmir carries forward with Mountain Retreat");
  assert(resolvePublicDestinationPassportContext("not-a-public-destination") === undefined, "unverified destination query context is ignored");

  const directState = createInitialJourneyPassportState({ source: "direct" });
  assert(resolveJourneyEntryPreselection({ source: "direct" }) === undefined, "standard Plan My Experience entry remains unselected");
  assert(directState.currentMoment === "welcome" && directState.companion === "" && directState.dreamJourney === "" && directState.travelStyles.length === 0 && directState.destinationMode === "", "standard Passport starts at Welcome with no inferred answers");
  assert(JOURNEY_ENTRY_ADVISORY === "We've pre-selected this based on how you started your journey. Feel free to change it anytime.", "entry advisory matches approved copy exactly");
}

function verifyProfile(name: string, profile: (typeof representativeProfiles)[keyof typeof representativeProfiles]) {
  const first = generateJourneyRecommendations(profile, verificationCandidates, executionContext);
  const second = generateJourneyRecommendations(profile, verificationCandidates, executionContext);
  const reordered = generateJourneyRecommendations(
    profile,
    [...verificationCandidates].reverse(),
    executionContext,
  );

  assert(JSON.stringify(stableResult(first)) === JSON.stringify(stableResult(second)), `${name} repeats deterministically`);
  assert(
    first.possibilities.map((possibility) => possibility.possibilityId).join("|") ===
      reordered.possibilities.map((possibility) => possibility.possibilityId).join("|"),
    `${name} result does not depend on catalogue insertion order`,
  );
  assert(first.status !== "invalid-input" && first.status !== "insufficient-input", `${name} is a valid v1.0 profile`);
  assert(first.possibilities.length <= 3, `${name} returns at most three qualified recommendations`);
  const rejectedIds = new Set(
    first.trace.rejectedBeforeScoring.map((candidate) => candidate.candidateId),
  );
  assert(
    first.trace.rankedCandidates.every(
      (candidate) => !rejectedIds.has(candidate.candidate.id),
    ),
    `${name} never scores an eligibility or contradiction rejection`,
  );
  assert(
    first.possibilities.every((possibility) =>
      first.trace.shortlistDecisions.some(
        (decision) =>
          decision.candidateId === possibility.candidateId &&
          decision.qualified &&
          decision.selectedPersonality === possibility.personality,
      ),
    ),
    `${name} shortlists only explicitly qualified candidates`,
  );
  assert(
    first.exclusions.some((candidate) =>
      candidate.candidateId === "japan" &&
      candidate.reasons.some((reason) => reason.code === "DESTINATION_NOT_ACTIVE"),
    ),
    `${name} hard-excludes the coming-soon destination`,
  );
  assert(!first.possibilities.some((possibility) => possibility.candidateId === "japan"), `${name} never recommends Japan`);
  verifyReconciledScores(first);
  return first;
}

function runVerification() {
  const passportBefore = JSON.stringify(representativeProfiles.relaxedFamily);
  const candidatesBefore = JSON.stringify(verificationCandidates);
  const relaxedFamily = verifyProfile("relaxed family", representativeProfiles.relaxedFamily);
  const cultureCouple = verifyProfile("culture couple", representativeProfiles.cultureCouple);
  const activeFriends = verifyProfile("active friends", representativeProfiles.activeFriends);
  const knownServedDestination = verifyProfile(
    "served known destination",
    representativeProfiles.knownServedDestination,
  );
  const unsupportedRequest = verifyProfile(
    "unsupported known destination",
    representativeProfiles.knownUnsupportedDestination,
  );

  assert(relaxedFamily.possibilities.length > 0, "relaxed family produces at least one qualified possibility");
  assert(relaxedFamily.possibilities.length <= 3, "normal qualified result contains at most three possibilities");
  assert(
    new Set(relaxedFamily.possibilities.map((possibility) => possibility.personality)).size ===
      relaxedFamily.possibilities.length,
    "returned personalities are distinct",
  );
  assert(
    new Set(relaxedFamily.possibilities.map((possibility) => possibility.candidateId)).size ===
      relaxedFamily.possibilities.length,
    "no candidate is duplicated across personalities",
  );
  assert(
    relaxedFamily.possibilities.every((possibility) => possibility.fitEvidence.length >= 2),
    "every presented possibility retains at least two evidence-backed reasons",
  );
  assert(JSON.stringify(representativeProfiles.relaxedFamily) === passportBefore, "Passport input remains immutable");
  assert(JSON.stringify(verificationCandidates) === candidatesBefore, "candidate catalogue remains immutable");
  assert(
    knownServedDestination.destinationResolution.status === "served" &&
      knownServedDestination.destinationResolution.matchedCandidateName === "Kerala",
    "a served free-text destination is acknowledged",
  );
  assert(
    knownServedDestination.destinationResolution.status === "served" &&
      (!knownServedDestination.destinationResolution.recommended || knownServedDestination.possibilities[0]?.candidateId === "kerala"),
    "a served free-text destination leads only when it is recommended for the primary intent",
  );
  assert(
    unsupportedRequest.destinationResolution.status === "unserved" &&
      unsupportedRequest.possibilities.length <= 3,
    "an unserved free-text destination receives only qualified served alternatives",
  );

  const normalized = normalizeJourneyPassport(representativeProfiles.relaxedFamily, executionContext.evaluationDate);
  assert(normalized.status === "valid", "valid Passport normalizes successfully");
  assert(normalized.status === "valid" && normalized.passport.comfortPreferences.length === 0, "uncollected comfort remains unknown");
  assert(
    normalized.status === "valid" && normalized.passport.pacePreferences.every((signal) => signal.strength <= 0.6),
    "derived pace never receives explicit evidence strength",
  );

  const homepageState = completedPassportState("relax");
  const homepageStateBefore = JSON.stringify(homepageState);
  const homepageSnapshot = createJourneyPassportSnapshot(homepageState);
  const homepageSnapshotBefore = JSON.stringify(homepageSnapshot);
  assert(homepageSnapshot.entryContext?.feeling === "relax", "snapshot preserves homepage feeling");
  assert(JSON.stringify(homepageState) === homepageStateBefore, "snapshot adapter does not mutate Passport state");
  assert(isJourneyPassportSnapshot(homepageSnapshot), "snapshot with governed homepage feeling satisfies session contract");

  const restoredHomepageSnapshot: unknown = JSON.parse(JSON.stringify(homepageSnapshot));
  assert(isJourneyPassportSnapshot(restoredHomepageSnapshot), "session JSON round-trip accepts governed homepage feeling");
  assert(restoredHomepageSnapshot.entryContext?.feeling === "relax", "session JSON round-trip preserves homepage feeling");

  const normalizedHomepage = normalizeJourneyPassport(
    restoredHomepageSnapshot,
    executionContext.evaluationDate,
  );
  assert(normalizedHomepage.status === "valid", "homepage feeling does not invalidate a completed Passport");
  assert(
    normalizedHomepage.status === "valid" && normalizedHomepage.passport.entryContext.feeling === "relax",
    "normalization preserves homepage feeling",
  );
  assert(
    normalizedHomepage.status === "valid" &&
      normalizedHomepage.passport.sourceEvidence.some(
        (evidence) => evidence.sourceField === "entryContext" && evidence.sourceValue === "relax",
      ),
    "homepage feeling remains traceable as source evidence",
  );
  assert(JSON.stringify(homepageSnapshot) === homepageSnapshotBefore, "normalization does not mutate completed snapshot");

  const missingFeelingSnapshot = createJourneyPassportSnapshot(completedPassportState());
  assert(isJourneyPassportSnapshot(missingFeelingSnapshot), "snapshot without homepage feeling remains session-valid");
  const normalizedMissingFeeling = normalizeJourneyPassport(
    missingFeelingSnapshot,
    executionContext.evaluationDate,
  );
  assert(normalizedMissingFeeling.status === "valid", "missing homepage feeling is neutral and valid");
  assert(
    normalizedMissingFeeling.status === "valid" && normalizedMissingFeeling.passport.entryContext.feeling === undefined,
    "missing homepage feeling produces no normalized value",
  );
  assert(
    normalizedMissingFeeling.status === "valid" &&
      normalizedMissingFeeling.passport.sourceEvidence.every((evidence) => evidence.sourceField !== "entryContext"),
    "missing homepage feeling produces no synthetic evidence",
  );

  JOURNEY_FEELINGS.forEach((feeling) => {
    const snapshot = createJourneyPassportSnapshot(completedPassportState(feeling));
    const result = generateJourneyRecommendations(snapshot, verificationCandidates, executionContext);
    assert(snapshot.entryContext?.feeling === feeling, `${feeling} survives the completed snapshot boundary`);
    assert(
      result.status !== "invalid-input" && result.status !== "insufficient-input",
      `${feeling} cannot create an invalid or fallback input state`,
    );
    assert(
      result.trace.normalizedPassport?.entryContext.feeling === feeling,
      `${feeling} survives into the normalized engine input`,
    );
  });

  const conflictSnapshot = createJourneyPassportSnapshot(
    completedPassportState("relax", { travelStyles: ["Adventure"] }),
  );
  const conflictSnapshotBefore = JSON.stringify(conflictSnapshot);
  const conflictNormalization = normalizeJourneyPassport(
    conflictSnapshot,
    executionContext.evaluationDate,
  );
  assert(conflictNormalization.status === "valid", "conflicting homepage and Passport signals remain valid");
  assert(
    conflictNormalization.status === "valid" && conflictNormalization.passport.emotions[0]?.id === "adventure",
    "explicit Passport emotion outranks conflicting homepage intent",
  );
  assert(
    conflictNormalization.status === "valid" &&
      conflictNormalization.passport.emotions.find((signal) => signal.id === "adventure")?.strength === 1 &&
      conflictNormalization.passport.emotions.find((signal) => signal.id === "relaxation")?.strength === 0.6,
    "conflict retains explicit 1.00 and supporting 0.60 evidence strengths",
  );
  const firstConflictResult = generateJourneyRecommendations(
    conflictSnapshot,
    verificationCandidates,
    executionContext,
  );
  const secondConflictResult = generateJourneyRecommendations(
    conflictSnapshot,
    verificationCandidates,
    executionContext,
  );
  assert(
    JSON.stringify(stableResult(firstConflictResult)) === JSON.stringify(stableResult(secondConflictResult)),
    "homepage intent participates deterministically",
  );
  assert(
    firstConflictResult.status !== "invalid-input" && firstConflictResult.status !== "insufficient-input",
    "signal conflict never triggers an invalid or fallback input state",
  );
  assert(JSON.stringify(conflictSnapshot) === conflictSnapshotBefore, "engine execution does not mutate homepage intent");

  const incomplete = generateJourneyRecommendations(
    representativeProfiles.incomplete,
    verificationCandidates,
    executionContext,
  );
  assert(incomplete.status === "insufficient-input", "incomplete Passport returns a typed insufficient-input state");
  assert(incomplete.possibilities.length === 0, "incomplete Passport never receives recommendations");

  const demoProfile = { ...representativeProfiles.relaxedFamily, source: "demo" as const };
  const demoResult = generateJourneyRecommendations(demoProfile, verificationCandidates, executionContext);
  assert(demoResult.status === "invalid-input", "demo traveller data is rejected by the production engine boundary");
  assert(demoResult.possibilities.length === 0, "demo data cannot activate a production recommendation fallback");

  const qualifiedCandidateId = relaxedFamily.possibilities[0].candidateId;
  const oneCandidateCatalogue = verificationCandidates.filter(
    (candidate) => candidate.id === qualifiedCandidateId,
  );
  const partial = generateJourneyRecommendations(
    representativeProfiles.relaxedFamily,
    oneCandidateCatalogue,
    executionContext,
  );
  assert(partial.status === "partial", "one qualified candidate returns a typed partial state");
  assert(partial.possibilities.length === 1, "partial state does not fabricate additional possibilities");

  const insufficient = generateJourneyRecommendations(
    representativeProfiles.relaxedFamily,
    verificationCandidates.filter((candidate) => candidate.status !== "ACTIVE"),
    executionContext,
  );
  assert(insufficient.status === "insufficient-candidates", "no eligible candidates returns a typed insufficient state");
  assert(insufficient.possibilities.length === 0, "insufficient result does not duplicate or fabricate candidates");

  assert(cultureCouple.possibilities.length <= 3, "couple profile returns at most three qualified roles");
  assert(activeFriends.possibilities.length <= 3, "active friends profile returns at most three qualified roles");
  assert(
    unsupportedRequest.exclusions.some((candidate) => candidate.candidateId === "japan"),
    "unsupported requested destination remains visible in the internal exclusion trace",
  );

  verifyPureEngineBoundary();
  verifyJourneyEntryContext();

  console.log(`Journey Director engine verification passed (${checks} checks).`);
  console.log("Profiles: relaxed family, culture couple, active friends, unsupported destination, incomplete Passport, homepage intent.");
  console.log("Result states: success, partial, insufficient-input, insufficient-candidates, invalid-input.");
}

runVerification();
