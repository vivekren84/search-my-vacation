export type ItineraryStatus = "draft" | "review" | "approved" | "archived";

export type ItineraryMatchType =
  | "exact-region"
  | "exact-destination"
  | "destination-code"
  | "alias"
  | "parent-destination"
  | "tag-fit"
  | "default"
  | "none";

export type SuggestedItinerary = {
  id: string;
  destinationCode: string;
  regionCode: string;
  source: {
    workbook: string;
    worksheet: string;
    indexRow: number;
    revision: number;
    lastUpdated: string;
    preparedBy: string;
    status: ItineraryStatus;
  };
  destination: {
    displayName: string;
    regionDisplayName: string;
    parentDestination?: string;
    journeyBases: string[];
  };
  summary: {
    title: string;
    introduction?: string;
    suggestedDuration: {
      display: string;
      days: number;
      nights: number;
    };
    idealTravellerTypes: string[];
    idealEmotions: string[];
    bestSeason: string;
    pace: string;
    difficulty: string;
    familyFriendly: boolean;
    coupleFriendly: boolean;
    seniorFriendly: boolean;
    childFriendly: boolean;
    customisable: boolean;
  };
  highlights: string[];
  days: Array<{
    day: number;
    overnightStay: string;
    suggestedExperience: string;
    meals?: string;
    notes?: string;
  }>;
  normallyIncludes: string[];
  normallyExcludes: string[];
  optionalExperiences: string[];
  importantNotes: string[];
  customisationIdeas: string[];
  matching: {
    primaryEmotionTags: string[];
    experienceTags: string[];
    companionTypes: string[];
    suggestedMonths: string[];
    relatedDestinations: string[];
    journeyDirectorCandidateIds: string[];
    journeyDirectorRegionIds: string[];
  };
};

export type ItineraryIndexRecord = {
  id: string;
  destinationCode: string;
  regionCode: string;
  destination: string;
  region: string;
  duration: string;
  journeyBases: string[];
  emotions: string[];
  experiences: string[];
  companions: string[];
  months: string[];
  status: ItineraryStatus;
};

export type ItineraryCatalogueArtifact = {
  generated: true;
  doNotEdit: string;
  schemaVersion: 1;
  generatorVersion: string;
  sourceWorkbookSha256: string;
  records: SuggestedItinerary[];
};

export type ItineraryIndexArtifact = {
  generated: true;
  doNotEdit: string;
  schemaVersion: 1;
  generatorVersion: string;
  sourceWorkbookSha256: string;
  records: ItineraryIndexRecord[];
};

export type ItineraryAliasesArtifact = {
  generated: true;
  doNotEdit: string;
  schemaVersion: 1;
  generatorVersion: string;
  sourceWorkbookSha256: string;
  aliases: Record<string, string[]>;
  destinationCodes: Record<string, string>;
  journeyDirectorCandidateIds: Record<string, string[]>;
  journeyDirectorRegionIds: Record<string, string[]>;
  parentDefaults: Record<string, string>;
};

export type ItineraryManifestArtifact = {
  generated: true;
  doNotEdit: string;
  schemaVersion: 1;
  generatorVersion: string;
  generatedAt: string;
  sourceWorkbook: string;
  sourceWorkbookSha256: string;
  totalWorkbookSheets: number;
  totalControlSheets: number;
  totalItinerarySheets: number;
  indexRows: number;
  includedRecords: number;
  excludedArchivedRecords: number;
  statusDistribution: Record<ItineraryStatus, number>;
  errors: number;
  reviewRequired: number;
  warnings: number;
  inclusionPolicy: {
    mode: "release-1" | "approved-only";
    includedStatuses: ItineraryStatus[];
    excludedStatuses: ItineraryStatus[];
    note: string;
  };
  artifacts: Record<string, { path: string; sha256: string; bytes: number }>;
};

export type ItineraryMatchInput = {
  destinationId: string;
  regionId?: string;
  destinationName?: string;
  regionName?: string;
  primaryDream?: string;
  styles?: string[];
  companions?: string[];
  timing?: string;
};

export type DestinationItineraryLookupInput = {
  destinationId?: string;
  destinationName?: string;
  regionName?: string;
};

export type ItineraryMatchResult =
  | {
      itinerary: SuggestedItinerary;
      matchType: Exclude<ItineraryMatchType, "none">;
      matchedOn: string;
      consideredItineraryIds: string[];
    }
  | {
      itinerary: undefined;
      matchType: "none";
      matchedOn: "no-governed-mapping";
      consideredItineraryIds: [];
    };
