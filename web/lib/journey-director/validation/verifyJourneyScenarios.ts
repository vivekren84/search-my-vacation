import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { JourneyPassportSnapshot, JourneyRecommendationSet } from "../../../types/journey-director";
import { RELEASE1_CATALOGUE_METADATA, release1JourneyCandidates } from "../catalogue";
import { generateJourneyRecommendations, type CandidateCapabilities, type EngineResult } from "../engine";
import { adaptJourneyRecommendations } from "../recommendation-adapter";

const executionTimestamp = "2026-08-02T00:00:00.000Z";
const context = {
  knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
  operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
  generatedAt: executionTimestamp,
  evaluationDate: executionTimestamp.slice(0, 10),
};

const basePassport: JourneyPassportSnapshot = {
  name: "Scenario Guest",
  companion: "Couple",
  dreamJourney: "Mountain Retreat",
  travelStyles: ["Nature", "Photography"],
  timing: "I’m Flexible",
  startDate: "",
  endDate: "",
  destinationMode: "discovery",
  destination: "",
  completedAt: executionTimestamp,
  source: "journey-passport",
};

type ScenarioOutput = { engine: EngineResult; publicSet: JourneyRecommendationSet };
type Scenario = {
  id: number;
  name: string;
  passport: JourneyPassportSnapshot;
  validate: (output: ScenarioOutput) => readonly string[];
};

function passport(overrides: Partial<JourneyPassportSnapshot>): JourneyPassportSnapshot {
  return { ...basePassport, ...overrides };
}

function run(passportInput: JourneyPassportSnapshot): ScenarioOutput {
  const engine = generateJourneyRecommendations(passportInput, release1JourneyCandidates, context);
  return { engine, publicSet: adaptJourneyRecommendations({ passport: passportInput, engineResult: engine }) };
}

function capabilityFor(output: ScenarioOutput, capability: keyof CandidateCapabilities) {
  return output.engine.possibilities.every((possibility) => {
    const candidate = release1JourneyCandidates.find((item) => item.id === possibility.candidateId);
    const region = candidate?.regions.find((item) => item.id === possibility.regionId);
    return region?.capabilities?.[capability] === true;
  });
}

function hasResults(output: ScenarioOutput) {
  return output.engine.possibilities.length >= 1 && output.engine.possibilities.length <= 3;
}

function served(output: ScenarioOutput, recommended?: boolean) {
  return output.engine.destinationResolution.status === "served" &&
    (recommended === undefined || output.engine.destinationResolution.recommended === recommended);
}

function failures(...checks: readonly [boolean, string][]) {
  return checks.filter(([passed]) => !passed).map(([, message]) => message);
}

const scenarios: readonly Scenario[] = [
  {
    id: 1,
    name: "Business + Mountain Retreat + Celebration",
    passport: passport({ companion: "Business", dreamJourney: "Mountain Retreat", travelStyles: ["Celebrations", "Photography"] }),
    validate: (output) => failures(
      [hasResults(output), "expected one to three results"],
      [capabilityFor(output, "mountain"), "every result must be a genuine mountain region"],
      [["kashmir", "himachal-pradesh", "northeast", "tamil-nadu"].includes(output.engine.possibilities[0]?.candidateId ?? ""), "lead should be a priority highland candidate"],
    ),
  },
  {
    id: 2,
    name: "Known Goa + Mountain Retreat",
    passport: passport({ destinationMode: "known", destination: "Goa" }),
    validate: (output) => failures(
      [served(output, false), "Goa must be acknowledged as served but advisory"],
      [capabilityFor(output, "mountain"), "alternatives must preserve mountain intent"],
      [output.engine.possibilities.every((item) => item.candidateId !== "goa"), "Goa must not be presented as the mountain match"],
    ),
  },
  {
    id: 3,
    name: "International + Mountain Retreat",
    passport: passport({ travelScope: "INTERNATIONAL" }),
    validate: (output) => failures(
      [hasResults(output), "expected a useful transparent fallback"],
      [capabilityFor(output, "mountain"), "fallback must preserve mountain intent"],
      [output.engine.trace.internationalPolicy.decision.includes("transparent fallback"), "fallback must be explicitly explained"],
      [output.publicSet.destinationResolution.message.includes("explicitly widened") && output.publicSet.destinationResolution.message.includes("domestic mountain alternatives"), "the guest-facing advisory must state the domestic fallback"],
    ),
  },
  {
    id: 4,
    name: "Known Kashmir + Beach Exploration",
    passport: passport({ dreamJourney: "Tropical Escape", travelStyles: ["Beaches & Islands", "Adventure"], destinationMode: "known", destination: "Kashmir" }),
    validate: (output) => failures(
      [served(output, false), "Kashmir must be acknowledged as served but advisory"],
      [capabilityFor(output, "beach"), "alternatives must be coastal or island fits"],
      [output.engine.possibilities.every((item) => item.candidateId !== "kashmir"), "Kashmir must not be presented as a beach match"],
    ),
  },
  {
    id: 5,
    name: "Couple + Beach + Reconnection",
    passport: passport({ companion: "Couple", dreamJourney: "Tropical Escape", travelStyles: ["Beaches & Islands", "Relaxation"] }),
    validate: (output) => failures([hasResults(output), "expected coastal results"], [capabilityFor(output, "beach"), "every result must support beaches"]),
  },
  {
    id: 6,
    name: "Family + Wildlife Discovery",
    passport: passport({ companion: "Family", dreamJourney: "Wildlife Adventure", travelStyles: ["Wildlife", "Nature"] }),
    validate: (output) => failures(
      [hasResults(output), "expected wildlife results"],
      [capabilityFor(output, "wildlife"), "every result must support wildlife"],
      [output.engine.possibilities.some((item) => /bandipur|kabini|masinagudi|gir|ranthambore/i.test(item.regionName)), "expected a governed wildlife region"],
    ),
  },
  {
    id: 7,
    name: "Business + Wildlife",
    passport: passport({ companion: "Business", dreamJourney: "Wildlife Adventure", travelStyles: ["Wildlife", "Photography"] }),
    validate: (output) => failures([hasResults(output), "expected wildlife results"], [capabilityFor(output, "wildlife"), "traveller type must not suppress wildlife intent"]),
  },
  {
    id: 8,
    name: "Typed Kerala and Kerala aliases",
    passport: passport({ dreamJourney: "City Discovery", travelStyles: ["Culture & Heritage", "Food & Dining"], destinationMode: "known", destination: "Kerala" }),
    validate: (output) => {
      const aliases = ["Kerala", "Thekkady", "Alleppey", "Alappuzha", "Kochi", "Cochin", "Wayanad", "Kovalam", "Kumarakom"];
      return failures(
        [served(output), "Kerala must be served"],
        [aliases.every((destination) => served(run({ ...basePassport, dreamJourney: "Cruise Voyage", travelStyles: ["Relaxation"], destinationMode: "known", destination }))), "every governed Kerala alias must resolve as served"],
      );
    },
  },
  {
    id: 9,
    name: "Typed Munnar",
    passport: passport({ destinationMode: "known", destination: "Munnar" }),
    validate: (output) => failures(
      [served(output, true), "Munnar must resolve as a recommended served Kerala region"],
      [output.engine.possibilities[0]?.candidateId === "kerala" && output.engine.possibilities[0]?.regionName === "Munnar", "Kerala/Munnar must lead"],
    ),
  },
  {
    id: 10,
    name: "Typed Bali + Wellness",
    passport: passport({ dreamJourney: "Cruise Voyage", travelStyles: ["Relaxation", "Food & Dining"], destinationMode: "known", destination: "Bali" }),
    validate: (output) => failures(
      [served(output), "Bali must be served"],
      [output.engine.possibilities.some((item) => item.candidateId === "bali" && item.regionName === "Ubud"), "Ubud should represent the Bali wellness fit"],
    ),
  },
  {
    id: 11,
    name: "Typed Bali + Beach Celebration",
    passport: passport({ dreamJourney: "Tropical Escape", travelStyles: ["Beaches & Islands", "Celebrations"], destinationMode: "known", destination: "Bali" }),
    validate: (output) => failures(
      [served(output), "Bali must be served"],
      [output.engine.possibilities.some((item) => item.candidateId === "bali" && ["Nusa Dua", "Uluwatu", "Seminyak"].includes(item.regionName)), "a suitable coastal Bali region should be selected"],
    ),
  },
  {
    id: 12,
    name: "Typed Nusa Dua",
    passport: passport({ dreamJourney: "Tropical Escape", travelStyles: ["Beaches & Islands", "Celebrations"], destinationMode: "known", destination: "Nusa Dua" }),
    validate: (output) => failures(
      [served(output), "Nusa Dua must resolve under Bali"],
      [output.engine.destinationResolution.status !== "unserved", "Nusa Dua must never be called unserved"],
      [output.engine.possibilities.some((item) => item.candidateId === "bali" && item.regionName === "Nusa Dua"), "Nusa Dua should be presented consistently"],
    ),
  },
  {
    id: 14,
    name: "International-only scope",
    passport: passport({ dreamJourney: "City Discovery", travelStyles: ["Culture & Heritage", "Food & Dining"], travelScope: "INTERNATIONAL" }),
    validate: (output) => failures(
      [hasResults(output), "expected international results"],
      [output.engine.possibilities.every((item) => release1JourneyCandidates.find((candidate) => candidate.id === item.candidateId)?.category === "INTERNATIONAL"), "international-only must not silently return domestic results"],
    ),
  },
  {
    id: 15,
    name: "Domestic-only scope",
    passport: passport({ dreamJourney: "City Discovery", travelStyles: ["Culture & Heritage", "Food & Dining"], travelScope: "DOMESTIC" }),
    validate: (output) => failures(
      [hasResults(output), "expected domestic results"],
      [output.engine.possibilities.every((item) => release1JourneyCandidates.find((candidate) => candidate.id === item.candidateId)?.category === "DOMESTIC"), "domestic-only must not return international results"],
    ),
  },
];

const travellerTypes = ["Solo", "Couple", "Family", "Friends", "Business"] as const;
const primaryExperiences = ["Tropical Escape", "Mountain Retreat", "City Discovery", "Cruise Voyage", "Winter Wonderland", "Wildlife Adventure"] as const;
const generalMatrix = travellerTypes.flatMap((companion) => primaryExperiences.map((dreamJourney) => {
  const travelStyles = dreamJourney === "Wildlife Adventure" ? ["Wildlife", "Nature"] : dreamJourney === "Tropical Escape" ? ["Beaches & Islands", "Relaxation"] : dreamJourney === "Cruise Voyage" ? ["Relaxation", "Food & Dining"] : ["Nature", "Photography"];
  const output = run(passport({ companion, dreamJourney, travelStyles }));
  return { companion, dreamJourney, output, passed: hasResults(output) };
}));

const scenarioOutputs = scenarios.map((scenario) => {
  const output = run(scenario.passport);
  return { scenario, output, errors: scenario.validate(output) };
});

const hardContradictionErrors = scenarioOutputs.flatMap(({ scenario, output }) => {
  const passedIds = new Set(output.engine.trace.contradictionEvaluations.filter((item) => item.passed).map((item) => item.candidateId));
  return output.engine.possibilities.filter((item) => !passedIds.has(item.candidateId)).map((item) => `Scenario ${scenario.id} selected contradiction failure ${item.candidateId}`);
});
const matrixErrors = generalMatrix.filter((item) => !item.passed).map((item) => `${item.companion} + ${item.dreamJourney} returned no possibility`);

function inputSummary(value: JourneyPassportSnapshot) {
  return `${value.companion}; ${value.dreamJourney}; ${value.travelStyles.join(", ")}; ${value.travelScope ?? "ANY"}; ${value.destinationMode === "known" ? value.destination : "open destination"}`;
}

function reportForScenario({ scenario, output, errors }: (typeof scenarioOutputs)[number]) {
  const normalized = output.engine.trace.detectedCoreIntent.intent ?? "NONE";
  const eligible = output.engine.trace.contradictionEvaluations.filter((item) => item.passed).map((item) => item.candidateId).join(", ") || "None";
  const excluded = output.engine.exclusions.map((item) => `${item.candidateName} (${item.reasons.map((reason) => reason.code).join(", ")})`).join("; ") || "None";
  const ranked = output.engine.trace.rankedCandidates.map((item) => `${item.rank}. ${item.candidate.name}/${item.selectedRegion.region.name} ${item.totalScore.toFixed(1)}`).join("; ") || "None";
  const selected = output.publicSet.possibilities.map((item) => `${item.destination}/${item.region} [${item.confidence}]`).join("; ") || "None";
  const mix = output.engine.possibilities.map((item) => release1JourneyCandidates.find((candidate) => candidate.id === item.candidateId)?.category ?? "UNKNOWN").join(" / ") || "None";
  return `## ${scenario.id}. ${scenario.name} — ${errors.length === 0 ? "PASS" : "FAIL"}\n\n- Passport input: ${inputSummary(scenario.passport)}\n- Normalised primary intent: ${normalized} (${output.engine.trace.detectedCoreIntent.strength})\n- Eligible candidates: ${eligible}\n- Excluded candidates and reasons: ${excluded}\n- Final ranked results: ${ranked}\n- Final selected areas: ${selected}\n- Domestic/international mix: ${mix}\n- Guest-facing explanation: ${output.publicSet.destinationResolution.message}\n- Validation: ${errors.length === 0 ? "Pass" : errors.join("; ")}\n`;
}

const matrixRows = generalMatrix.map((item) => `| ${item.companion} | ${item.dreamJourney} | ${item.output.publicSet.possibilities.map((possibility) => `${possibility.destination}/${possibility.region}`).join("; ") || "None"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
const allErrors = [...scenarioOutputs.flatMap((item) => item.errors.map((error) => `Scenario ${item.scenario.id}: ${error}`)), ...matrixErrors, ...hardContradictionErrors];
const report = `# EBC-007 Journey scenario audit\n\nGenerated deterministically at the fixed evaluation instant ${executionTimestamp}. Catalogue: ${RELEASE1_CATALOGUE_METADATA.catalogueVersion}.\n\nOverall result: **${allErrors.length === 0 ? "PASS" : "FAIL"}**\n\n${scenarioOutputs.map(reportForScenario).join("\n")}\n## 13. Every traveller type × every primary experience — ${matrixErrors.length === 0 ? "PASS" : "FAIL"}\n\n| Traveller | Primary experience | Results | Status |\n|---|---|---|---|\n${matrixRows}\n\n## 16. No hard contradiction — ${hardContradictionErrors.length === 0 ? "PASS" : "FAIL"}\n\n${hardContradictionErrors.length === 0 ? "Every selected candidate passed the final contradiction evaluation, including the explicitly documented international-mountain fallback evaluation." : hardContradictionErrors.join("\n")}\n`;

const reportDirectory = join(process.cwd(), "..", "docs", "02-Product");
mkdirSync(reportDirectory, { recursive: true });
const reportPath = join(reportDirectory, "EBC-007-JOURNEY-SCENARIO-AUDIT.md");
writeFileSync(reportPath, report);

if (allErrors.length > 0) throw new Error(`Journey scenario validation failed:\n${allErrors.join("\n")}`);
console.log(`Journey scenario validation passed (${scenarios.length + 2} required scenarios; ${generalMatrix.length} traveller/experience combinations).`);
console.log(`Report: ${reportPath}`);
