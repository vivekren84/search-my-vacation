import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

import {
  GENERATOR_VERSION,
  JourneyIntelligenceError,
  SCHEMA_VERSION,
  type ArtifactHeader,
  type CellValue,
  type Score,
} from "./types.js";

export function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function splitList(value: string | null): string[] {
  if (!value) return [];
  return [...new Set(value.split(/[,/]/).map((item) => item.trim()).filter(Boolean))];
}

export function normalizedTokens(value: string): string[] {
  return splitList(value).map((item) => slug(item));
}

export function asString(
  value: CellValue | undefined,
  context: { component: string; sheetName: string; field: string; recordId?: string },
): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  throw new JourneyIntelligenceError({
    component: context.component,
    sheetName: context.sheetName,
    recordId: context.recordId,
    message: `${context.field} must not be blank`,
  });
}

export function optionalString(value: CellValue | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim() || null;
}

export function asInteger(
  value: CellValue | undefined,
  context: { component: string; sheetName: string; field: string; recordId?: string },
): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  if (!Number.isInteger(parsed)) {
    throw new JourneyIntelligenceError({
      component: context.component,
      sheetName: context.sheetName,
      recordId: context.recordId,
      message: `${context.field} must be an integer`,
    });
  }
  return parsed;
}

export function asScore(
  value: CellValue | undefined,
  context: { sheetName: string; field: string; recordId: string },
): Score {
  const parsed = asInteger(value, {
    component: "WorkbookLoader",
    ...context,
  });
  if (parsed < 0 || parsed > 5) {
    throw new JourneyIntelligenceError({
      component: "WorkbookLoader",
      sheetName: context.sheetName,
      recordId: context.recordId,
      message: `${context.field} must be an integer from 0 to 5`,
    });
  }
  return parsed as Score;
}

export function reasonCodeFrom(value: string): string {
  const code = value.split(/\s+—\s+|\s+-\s+/)[0]?.trim() ?? "";
  if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
    throw new JourneyIntelligenceError({
      component: "WorkbookLoader",
      message: `Invalid reason code in "${value}"`,
    });
  }
  return code;
}

export function reasonDescriptionFrom(value: string): string {
  const parts = value.split(/\s+—\s+|\s+-\s+/);
  return parts.slice(1).join(" — ").trim() || value.trim();
}

export function parseDurationDays(value: string): number | "REVIEW_REQUIRED" {
  if (value.includes("REVIEW_REQUIRED")) return "REVIEW_REQUIRED";
  const matches = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  );
  if (matches.length === 0) return "REVIEW_REQUIRED";
  return Math.max(...matches.map((duration) => Math.ceil(duration)));
}

export function artifactHeader(workbookChecksum: string): ArtifactHeader {
  return {
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    workbookChecksum,
  };
}

function sortedJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedJsonValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en-US"))
        .map(([key, nested]) => [key, sortedJsonValue(nested)]),
    );
  }
  return value;
}

export function serializeJson(value: unknown): string {
  return `${JSON.stringify(sortedJsonValue(value), null, 2)}\n`;
}

export function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function sha256File(path: string): Promise<string> {
  return sha256(await readFile(path));
}

export function logEvent(
  event: string,
  status: "STARTED" | "PASSED" | "COMPLETE" | "FAILED",
  details: Record<string, unknown> = {},
): void {
  console.log(
    JSON.stringify({
      component: "JourneyIntelligenceGenerator",
      event,
      status,
      ...details,
    }),
  );
}

export function workbookFilename(path: string): string {
  return basename(path);
}

export function compareStrings(left: string, right: string): number {
  return left.localeCompare(right, "en-US");
}
