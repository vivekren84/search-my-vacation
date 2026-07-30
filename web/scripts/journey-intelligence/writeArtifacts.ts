import {
  access,
  mkdir,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

import { ARTIFACT_NAMES } from "./artifactNames.js";
import { generateManifest } from "./generateManifest.js";
import type {
  GeneratedArtifacts,
  GenerationResult,
  ValidationReport,
  WorkbookModel,
} from "./types.js";
import { JourneyIntelligenceError } from "./types.js";
import { serializeJson, sha256File } from "./utils.js";
import { verifyArtifactPackage } from "./verifyArtifacts.js";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function validateOutputDirectory(outputDirectory: string): void {
  const resolved = resolve(outputDirectory);
  if (
    resolved === "/" ||
    resolved === resolve(".") ||
    basename(resolved).trim().length === 0
  ) {
    throw new JourneyIntelligenceError({
      component: "ArtifactWriter",
      message: `Unsafe output directory: ${resolved}`,
    });
  }
}

export async function writeArtifacts(input: {
  model: WorkbookModel;
  validation: ValidationReport;
  artifacts: GeneratedArtifacts;
  outputDirectory: string;
  generatedAt: string;
  durationMilliseconds: number;
}): Promise<GenerationResult> {
  const outputDirectory = resolve(input.outputDirectory);
  validateOutputDirectory(outputDirectory);
  const parentDirectory = dirname(outputDirectory);
  const temporaryDirectory = join(
    parentDirectory,
    `.journey-intelligence-temp-${process.pid}`,
  );
  const backupDirectory = join(
    parentDirectory,
    `.journey-intelligence-backup-${process.pid}`,
  );

  await mkdir(parentDirectory, { recursive: true });
  await rm(temporaryDirectory, { recursive: true, force: true });
  await rm(backupDirectory, { recursive: true, force: true });
  await mkdir(temporaryDirectory, { recursive: true });

  const nonManifestArtifacts = {
    journeyDNA: {
      filename: ARTIFACT_NAMES.journeyDNA,
      value: input.artifacts.journeyDNA,
    },
    compatibilityMatrix: {
      filename: ARTIFACT_NAMES.compatibilityMatrix,
      value: input.artifacts.compatibilityMatrix,
    },
    constraintLibrary: {
      filename: ARTIFACT_NAMES.constraintLibrary,
      value: input.artifacts.constraintLibrary,
    },
    reasonLibrary: {
      filename: ARTIFACT_NAMES.reasonLibrary,
      value: input.artifacts.reasonLibrary,
    },
    journeySeeds: {
      filename: ARTIFACT_NAMES.journeySeeds,
      value: input.artifacts.journeySeeds,
    },
    journeyTemplates: {
      filename: ARTIFACT_NAMES.journeyTemplates,
      value: input.artifacts.journeyTemplates,
    },
  } as const;

  try {
    for (const artifact of Object.values(nonManifestArtifacts)) {
      await writeFile(
        join(temporaryDirectory, artifact.filename),
        serializeJson(artifact.value),
        "utf8",
      );
    }

    const checksums = {
      journeyDNA: {
        path: `generated/${ARTIFACT_NAMES.journeyDNA}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.journeyDNA),
        ),
      },
      compatibilityMatrix: {
        path: `generated/${ARTIFACT_NAMES.compatibilityMatrix}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.compatibilityMatrix),
        ),
      },
      constraintLibrary: {
        path: `generated/${ARTIFACT_NAMES.constraintLibrary}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.constraintLibrary),
        ),
      },
      reasonLibrary: {
        path: `generated/${ARTIFACT_NAMES.reasonLibrary}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.reasonLibrary),
        ),
      },
      journeySeeds: {
        path: `generated/${ARTIFACT_NAMES.journeySeeds}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.journeySeeds),
        ),
      },
      journeyTemplates: {
        path: `generated/${ARTIFACT_NAMES.journeyTemplates}`,
        checksum: await sha256File(
          join(temporaryDirectory, ARTIFACT_NAMES.journeyTemplates),
        ),
      },
      metadata: {
        path: `generated/${ARTIFACT_NAMES.metadata}`,
        checksum: "",
      },
    };

    await writeFile(
      join(temporaryDirectory, ARTIFACT_NAMES.metadata),
      serializeJson(input.artifacts.metadata),
      "utf8",
    );
    checksums.metadata.checksum = await sha256File(
      join(temporaryDirectory, ARTIFACT_NAMES.metadata),
    );

    const contradictionsGenerated =
      input.artifacts.constraintLibrary.records.filter(
        (record) => record.severity === "Contradiction",
      ).length;
    const manifest = generateManifest(
      input.model,
      input.artifacts.metadata.recordCounts,
      input.validation,
      checksums,
      input.generatedAt,
      input.durationMilliseconds,
      contradictionsGenerated,
    );
    await writeFile(
      join(temporaryDirectory, ARTIFACT_NAMES.manifest),
      serializeJson(manifest),
      "utf8",
    );

    await verifyArtifactPackage(temporaryDirectory, input.model.workbookPath);

    const hadActivePackage = await exists(outputDirectory);
    if (hadActivePackage) await rename(outputDirectory, backupDirectory);
    try {
      await rename(temporaryDirectory, outputDirectory);
    } catch (error) {
      if (hadActivePackage && (await exists(backupDirectory))) {
        await rename(backupDirectory, outputDirectory);
      }
      throw error;
    }
    if (await exists(backupDirectory)) {
      await rm(backupDirectory, { recursive: true, force: true });
    }

    await verifyArtifactPackage(outputDirectory, input.model.workbookPath);
    const artifactSizes: Record<string, number> = {};
    for (const filename of await readdir(outputDirectory)) {
      artifactSizes[filename] = (await stat(join(outputDirectory, filename))).size;
    }

    return {
      manifest,
      artifactSizes,
      outputDirectory,
      reportPath: null,
    };
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    if (
      !(await exists(outputDirectory)) &&
      (await exists(backupDirectory))
    ) {
      await rename(backupDirectory, outputDirectory);
    }
    throw new JourneyIntelligenceError({
      component: "ArtifactWriter",
      message:
        error instanceof Error ? error.message : `Serialization failed: ${error}`,
    });
  }
}
