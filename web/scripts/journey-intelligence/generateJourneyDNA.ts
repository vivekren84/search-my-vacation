import type {
  HierarchyNodeType,
  JourneyDNA,
  JourneyDNAArtifact,
  RegionHierarchyNode,
  TravelScope,
  WorkbookModel,
} from "./types.js";
import { artifactHeader, compareStrings, splitList } from "./utils.js";

const INDIA_STATES = new Set([
  "Goa",
  "Gujarat",
  "Himachal Pradesh",
  "Karnataka",
  "Kerala",
  "Rajasthan",
  "TamilNadu",
  "Telangana",
  "Andhra Pradesh",
]);

function countryFor(
  destinationId: string,
  destination: string,
  scope: TravelScope,
): { id: string; name: string } {
  if (scope === "Domestic") return { id: "country-india", name: "India" };
  if (destinationId === "indonesia-bali") {
    return { id: "country-indonesia", name: "Indonesia" };
  }
  if (destinationId === "united-arab-emirates") {
    return {
      id: "country-united-arab-emirates",
      name: "United Arab Emirates",
    };
  }
  return {
    id: `country-${destinationId}`,
    name: destination,
  };
}

function destinationNodeType(
  destination: string,
  scope: TravelScope,
): HierarchyNodeType {
  if (scope === "International") {
    return destination === "Bali" ? "Island" : "Region";
  }
  if (INDIA_STATES.has(destination)) return "State";
  if (destination === "Andaman") return "Island";
  return "Region";
}

function generateHierarchy(model: WorkbookModel): RegionHierarchyNode[] {
  const nodes = new Map<string, RegionHierarchyNode>();
  const destinationParents = new Map<string, string>();

  for (const record of model.destinationIntelligence) {
    const country = countryFor(
      record.destinationId,
      record.destination,
      record.travelScope,
    );
    nodes.set(country.id, {
      nodeId: country.id,
      parentId: null,
      nodeType: "Country",
      name: country.name,
      destinationId: null,
      travelScope: record.travelScope,
      recommendationEligible: false,
      sourceRow: null,
    });
    const destinationNodeId = `destination:${record.destinationId}`;
    destinationParents.set(record.destinationId, destinationNodeId);
    nodes.set(destinationNodeId, {
      nodeId: destinationNodeId,
      parentId: country.id,
      nodeType: destinationNodeType(
        record.destination,
        record.travelScope,
      ),
      name: record.destination,
      destinationId: record.destinationId,
      travelScope: record.travelScope,
      recommendationEligible: false,
      sourceRow: null,
    });
  }

  for (const record of model.destinationIntelligence) {
    nodes.set(record.regionId, {
      nodeId: record.regionId,
      parentId: destinationParents.get(record.destinationId)!,
      nodeType: record.recordType,
      name: record.region,
      destinationId: record.destinationId,
      travelScope: record.travelScope,
      recommendationEligible: record.journeyBaseStatus === "Yes",
      sourceRow: record.sourceRow,
    });
  }

  return [...nodes.values()].sort((left, right) =>
    compareStrings(left.nodeId, right.nodeId),
  );
}

export function generateJourneyDNA(model: WorkbookModel): JourneyDNAArtifact {
  const records: JourneyDNA[] = model.destinationIntelligence
    .filter((record) => record.journeyBaseStatus === "Yes")
    .map((record) => ({
      sourceRow: record.sourceRow,
      destinationId: record.destinationId,
      regionId: record.regionId,
      destination: record.destination,
      region: record.region,
      travelScope: record.travelScope,
      recordType: record.recordType,
      journeyIdentity: record.journeyIdentity,
      primaryExperiences: splitList(record.primaryExperiences),
      secondaryExperiences: splitList(record.secondaryExperiences),
      signatureExperiences: record.signatureExperiences,
      emotionalOutcomes: splitList(record.emotionalOutcomes),
      strengths: record.strengths,
      avoidWhen: record.avoidWhen,
      comfortRange: splitList(record.comfortRange),
      journeyPace: splitList(record.journeyPace),
      suggestedDuration: {
        minimum: record.suggestedMinimumDuration,
        ideal: record.suggestedIdealDuration,
        display: record.suggestedDuration,
      },
      bestSeason: record.bestSeason,
      shoulderSeason: record.shoulderSeason,
      seasonalCautions: record.seasonalCautions,
      operationalConfidence: record.operationalConfidence,
      compatibilityReferenceId: record.regionId,
    }))
    .sort((left, right) => compareStrings(left.regionId, right.regionId));

  return {
    ...artifactHeader(model.workbookChecksum),
    hierarchy: generateHierarchy(model),
    records,
  };
}
