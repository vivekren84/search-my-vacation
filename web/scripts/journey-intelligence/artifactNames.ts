export const ARTIFACT_NAMES = {
  journeyDNA: "journey-dna.json",
  compatibilityMatrix: "compatibility-matrix.json",
  constraintLibrary: "constraint-library.json",
  reasonLibrary: "reason-library.json",
  journeySeeds: "journey-seeds.json",
  journeyTemplates: "journey-templates.json",
  metadata: "metadata.json",
  manifest: "intelligence-manifest.json",
} as const;

export const EXPECTED_ARTIFACT_FILENAMES = Object.values(ARTIFACT_NAMES).sort(
  (left, right) => left.localeCompare(right, "en-US"),
);
