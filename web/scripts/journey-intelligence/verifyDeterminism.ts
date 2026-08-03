import { execFileSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { EXPECTED_ARTIFACT_FILENAMES } from "./artifactNames.js";
import { JourneyIntelligenceError } from "./types.js";

export interface DeterminismReport {
  status: "PASS";
  generatorExecutions: 2;
  comparedArtifacts: number;
  volatileFieldsFixed: ["generatedAt", "durationMilliseconds"];
}

export async function verifyDeterminism(
  workbookPath: string,
): Promise<DeterminismReport> {
  const root = await mkdtemp(join(tmpdir(), "smv-journey-intelligence-"));
  const first = join(root, "first");
  const second = join(root, "second");
  await mkdir(first);
  await mkdir(second);
  const compiledIndex = join(dirname(__filename), "index.js");
  const generatedAt = "2000-01-01T00:00:00.000Z";

  try {
    for (const output of [first, second]) {
      execFileSync(
        process.execPath,
        [
          compiledIndex,
          "--workbook",
          resolve(workbookPath),
          "--output",
          output,
          "--generated-at",
          generatedAt,
          "--duration-ms",
          "0",
          "--skip-determinism",
          "--no-report",
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          maxBuffer: 16 * 1024 * 1024,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
    }

    for (const filename of EXPECTED_ARTIFACT_FILENAMES) {
      const firstBytes = await readFile(join(first, filename));
      const secondBytes = await readFile(join(second, filename));
      if (!firstBytes.equals(secondBytes)) {
        throw new JourneyIntelligenceError({
          component: "DeterminismVerification",
          message: `${filename} differs between identical generator executions`,
        });
      }
    }

    return {
      status: "PASS",
      generatorExecutions: 2,
      comparedArtifacts: EXPECTED_ARTIFACT_FILENAMES.length,
      volatileFieldsFixed: ["generatedAt", "durationMilliseconds"],
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const workbookPath = option("--workbook");
  if (!workbookPath) {
    throw new JourneyIntelligenceError({
      component: "DeterminismVerification",
      message: "--workbook is required",
    });
  }
  console.log(JSON.stringify(await verifyDeterminism(workbookPath)));
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(
      JSON.stringify({
        component: "DeterminismVerification",
        status: "FAILED",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  });
}
