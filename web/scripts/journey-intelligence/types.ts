export const SCHEMA_VERSION = "1.0" as const;
export const GENERATOR_VERSION = "1.0.0" as const;

export const REQUIRED_SHEETS = [
  "Traveller Types",
  "Emotional Goals",
  "Desired Experiences",
  "Destination Catalogue",
  "Destination Intelligence",
  "Compatibility Matrix",
  "Source Register",
  "Review Register",
] as const;

export type RequiredSheetName = (typeof REQUIRED_SHEETS)[number];
export type CellValue = string | number | boolean | null;
export type Score = 0 | 1 | 2 | 3 | 4 | 5;
export type TravelScope = "Domestic" | "International";
export type JourneyBaseStatus = "Yes" | "No" | "Review Required";
export type RecordType =
  | "Attraction"
  | "City"
  | "Experience Cluster"
  | "Island"
  | "Journey Base"
  | "Region";
export type CompatibilityCategory =
  | "TravellerType"
  | "EmotionalGoal"
  | "DesiredExperience"
  | "JourneyComfort"
  | "JourneyPace";
export type ConstraintType =
  | "Traveller"
  | "Emotion"
  | "Experience"
  | "Pace"
  | "Comfort"
  | "Operational"
  | "DestinationScope";
export type ConstraintSeverity =
  | "Contradiction"
  | "Strong Penalty"
  | "Moderate Penalty"
  | "Soft Preference";
export type ReasonCategory =
  | "Traveller"
  | "Emotion"
  | "Experience"
  | "Constraint"
  | "Comfort"
  | "Pace"
  | "Operational"
  | "Season"
  | "Journey DNA";
export type HierarchyNodeType =
  | "Country"
  | "State"
  | "Island"
  | "Region"
  | "Journey Base"
  | "Attraction"
  | "Experience Cluster"
  | "City";

export interface GeneratorErrorContext {
  component: string;
  message: string;
  recordId?: string;
  sheetName?: string;
}

export class JourneyIntelligenceError extends Error {
  readonly context: GeneratorErrorContext;

  constructor(context: GeneratorErrorContext) {
    super(
      [
        context.component,
        context.sheetName ? `sheet=${context.sheetName}` : "",
        context.recordId ? `record=${context.recordId}` : "",
        context.message,
      ]
        .filter(Boolean)
        .join(" | "),
    );
    this.name = "JourneyIntelligenceError";
    this.context = context;
  }
}

export interface RawSheet {
  name: RequiredSheetName;
  rows: CellValue[][];
}

export interface WorkbookFileMetadata {
  filename: string;
  version: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
}

export interface TravellerType {
  id: string;
  name: string;
  characteristics: string;
}

export interface EmotionalGoal {
  id: string;
  name: string;
}

export interface DesiredExperience {
  id: string;
  name: string;
}

export interface DestinationCatalogueRow {
  workbookRow: number;
  destination: string;
  region: string;
}

export interface WorkbookCompatibility {
  category: Extract<
    CompatibilityCategory,
    "TravellerType" | "EmotionalGoal" | "DesiredExperience"
  >;
  key: string;
  score: Score;
  reasonCode: string;
  reasonDescription: string;
  scoreColumn: string;
  reasonColumn: string;
}

export interface DestinationIntelligenceRow {
  workbookRow: number;
  sourceRow: number;
  destinationId: string;
  regionId: string;
  destination: string;
  region: string;
  travelScope: TravelScope;
  recordType: RecordType;
  journeyBaseStatus: JourneyBaseStatus;
  parentRegion: string | null;
  journeyIdentity: string;
  primaryExperiences: string;
  secondaryExperiences: string | null;
  signatureExperiences: string;
  bestFor: string;
  emotionalOutcomes: string;
  strengths: string;
  avoidWhen: string;
  comfortRange: string;
  journeyPace: string;
  suggestedMinimumDuration: string;
  suggestedIdealDuration: string;
  bestSeason: string;
  shoulderSeason: string;
  seasonalCautions: string;
  operationalConfidence: string;
  confidenceExplanation: string;
  airportOrArrivalGateway: string;
  typicalTransferComplexity: string;
  familyFriendliness: string;
  seniorFriendliness: string;
  accessibilityConsiderations: string;
  businessTravelSuitability: string;
  connectivityReliability: string;
  foodVariety: string;
  vegetarianFriendliness: string;
  shoppingStrength: string;
  nightlifeStrength: string;
  wellnessStrength: string;
  adventureIntensity: string;
  physicalActivityLevel: string;
  arrival: string;
  firstImpression: string;
  sharedMoment: string;
  signatureExperienceSeed: string;
  relaxationMoment: string;
  localDiscovery: string;
  foodOrCulturalMoment: string;
  journeyHighPoint: string;
  journeyEnding: string;
  whyThisRegion: string;
  worthConsidering: string;
  potentialTradeOff: string;
  suggestedDuration: string;
  journeyRhythm: string;
  arrivalPhase: string;
  discoveryPhase: string;
  signatureDay: string;
  slowOrRecoveryPhase: string;
  optionalExtension: string;
  departurePhase: string;
  compatibility: WorkbookCompatibility[];
}

export interface CompatibilityMatrixRow {
  workbookRow: number;
  destinationId: string;
  regionId: string;
  scores: Map<string, Score>;
  operationalConfidence: string;
  reasonReference: string;
}

export interface WorkbookModel {
  workbookPath: string;
  workbookChecksum: string;
  workbookMetadata: WorkbookFileMetadata;
  sheetCount: number;
  travellerTypes: TravellerType[];
  emotionalGoals: EmotionalGoal[];
  desiredExperiences: DesiredExperience[];
  destinationCatalogue: DestinationCatalogueRow[];
  destinationIntelligence: DestinationIntelligenceRow[];
  compatibilityMatrix: CompatibilityMatrixRow[];
  sourceRegisterRegionIds: string[];
  reviewRegisterRegionIds: string[];
}

export interface ValidationWarning {
  code: string;
  message: string;
  recordId?: string;
  sheetName?: RequiredSheetName;
}

export interface ValidationReport {
  status: "PASS";
  workbookLoaded: true;
  sheetCount: number;
  rowCounts: Record<RequiredSheetName, number>;
  duplicateChecks: number;
  schemaChecks: number;
  checksExecuted: number;
  checksPassed: number;
  warnings: ValidationWarning[];
  failures: never[];
  reviewRequiredRecords: number;
}

export interface ArtifactHeader {
  schemaVersion: typeof SCHEMA_VERSION;
  generatorVersion: typeof GENERATOR_VERSION;
  workbookChecksum: string;
}

export interface RegionHierarchyNode {
  nodeId: string;
  parentId: string | null;
  nodeType: HierarchyNodeType;
  name: string;
  destinationId: string | null;
  travelScope: TravelScope | null;
  recommendationEligible: boolean;
  sourceRow: number | null;
}

export interface JourneyDNA {
  sourceRow: number;
  destinationId: string;
  regionId: string;
  destination: string;
  region: string;
  travelScope: TravelScope;
  recordType: RecordType;
  journeyIdentity: string;
  primaryExperiences: string[];
  secondaryExperiences: string[];
  signatureExperiences: string;
  emotionalOutcomes: string[];
  strengths: string;
  avoidWhen: string;
  comfortRange: string[];
  journeyPace: string[];
  suggestedDuration: {
    minimum: string;
    ideal: string;
    display: string;
  };
  bestSeason: string;
  shoulderSeason: string;
  seasonalCautions: string;
  operationalConfidence: string;
  compatibilityReferenceId: string;
}

export interface JourneyDNAArtifact extends ArtifactHeader {
  hierarchy: RegionHierarchyNode[];
  records: JourneyDNA[];
}

export interface CompatibilityRecord {
  regionId: string;
  category: CompatibilityCategory;
  key: string;
  score: Score;
  reasonCode: string;
  sourceRow: number;
}

export interface CompatibilityArtifact extends ArtifactHeader {
  scoreModel: {
    0: "Contradiction";
    1: "Weak Match";
    2: "Limited Match";
    3: "Suitable";
    4: "Strong Match";
    5: "Exceptional Match";
  };
  records: CompatibilityRecord[];
}

export interface ConstraintRule {
  constraintId: string;
  type: ConstraintType;
  source: string;
  target: string;
  severity: ConstraintSeverity;
  reasonCode: string;
  sourceRow: number | null;
}

export interface ConstraintArtifact extends ArtifactHeader {
  records: ConstraintRule[];
}

export interface ReasonCode {
  reasonCode: string;
  category: ReasonCategory;
  summary: string;
  description: string;
  context: string[];
}

export interface ReasonArtifact extends ArtifactHeader {
  records: ReasonCode[];
}

export interface JourneySeed {
  sourceRow: number;
  regionId: string;
  arrival: string;
  firstImpression: string;
  sharedMoment: string;
  signatureExperience: string;
  relaxationMoment: string;
  localDiscovery: string;
  foodOrCulturalMoment: string;
  journeyHighPoint: string;
  journeyEnding: string;
  whyThisRegion: string;
  worthConsidering: string;
  potentialTradeOff: string;
}

export interface JourneySeedArtifact extends ArtifactHeader {
  records: JourneySeed[];
}

export interface JourneyTemplate {
  sourceRow: number;
  regionId: string;
  minimumDurationDays: number | "REVIEW_REQUIRED";
  idealDurationDays: number | "REVIEW_REQUIRED";
  journeyRhythm: string;
  arrivalPhase: string;
  discoveryPhase: string;
  signaturePhase: string;
  slowOrRecoveryPhase: string;
  optionalExtension: string;
  departurePhase: string;
}

export interface JourneyTemplateArtifact extends ArtifactHeader {
  records: JourneyTemplate[];
}

export interface RecordCounts {
  destinationRegions: number;
  journeyBases: number;
  attractions: number;
  experienceClusters: number;
  islands: number;
  travellerTypes: number;
  emotionalGoals: number;
  desiredExperiences: number;
  journeyDNARecords: number;
  compatibilityRecords: number;
  constraintRecords: number;
  reasonCodes: number;
  journeySeedRecords: number;
  journeyTemplateRecords: number;
}

export interface MetadataArtifact extends ArtifactHeader {
  generatedFrom: string;
  generatedAt: string;
  recordCounts: RecordCounts;
  validation: {
    status: "PASS";
    warnings: number;
    reviewRequiredRecords: number;
  };
}

export interface ArtifactChecksum {
  path: string;
  checksum: string;
}

export interface IntelligenceManifest {
  schemaVersion: typeof SCHEMA_VERSION;
  generatorVersion: typeof GENERATOR_VERSION;
  generatedAt: string;
  generatedFromWorkbook: string;
  workbookChecksum: string;
  workbookMetadata: WorkbookFileMetadata;
  recordCounts: RecordCounts;
  artifacts: {
    journeyDNA: ArtifactChecksum;
    compatibilityMatrix: ArtifactChecksum;
    constraintLibrary: ArtifactChecksum;
    reasonLibrary: ArtifactChecksum;
    journeySeeds: ArtifactChecksum;
    journeyTemplates: ArtifactChecksum;
    metadata: ArtifactChecksum;
  };
  generation: {
    recordsProcessed: number;
    compatibilityRulesGenerated: number;
    contradictionsGenerated: number;
    validationRulesExecuted: number;
    durationMilliseconds: number;
  };
  validation: {
    status: "PASS";
    checksExecuted: number;
    checksPassed: number;
    checksFailed: 0;
    warnings: number;
    reviewRequiredRecords: number;
  };
}

export interface GeneratedArtifacts {
  journeyDNA: JourneyDNAArtifact;
  compatibilityMatrix: CompatibilityArtifact;
  constraintLibrary: ConstraintArtifact;
  reasonLibrary: ReasonArtifact;
  journeySeeds: JourneySeedArtifact;
  journeyTemplates: JourneyTemplateArtifact;
  metadata: MetadataArtifact;
}

export interface GenerationOptions {
  workbookPath: string;
  outputDirectory: string;
  reportPath: string | null;
  generatedAt: string;
  durationOverride: number | null;
}

export interface GenerationResult {
  manifest: IntelligenceManifest;
  artifactSizes: Record<string, number>;
  outputDirectory: string;
  reportPath: string | null;
}
