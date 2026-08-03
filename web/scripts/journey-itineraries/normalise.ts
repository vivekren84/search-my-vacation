import { createHash } from "node:crypto";

import type { CellValue, DurationValue } from "./types.js";

export const CANONICAL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function text(value: CellValue | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .trim();
}

export function normalizedKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugify(value: string): string {
  return normalizedKey(value).replace(/\band\b/g, " ").replace(/\s+/g, "-");
}

export function splitSemicolon(value: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  value.split(";").map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const key = normalizedKey(part);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(part);
    }
  });
  return result;
}

export function parseBoolean(value: string): boolean | undefined {
  const normalized = normalizedKey(value);
  if (normalized === "yes") return true;
  if (normalized === "no") return false;
  return undefined;
}

export function parseDuration(value: string): DurationValue | undefined {
  const match = value.trim().match(/^(\d+)\s*(?:days?|d)\s*[\/\-]\s*(\d+)\s*(?:nights?|n)$/i);
  if (!match) return undefined;
  return { display: value.trim(), days: Number(match[1]), nights: Number(match[2]) };
}

export function excelDateToIso(value: CellValue | undefined): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + Math.round(value * 86_400_000)).toISOString().slice(0, 10);
  }
  const raw = text(value);
  if (!raw) return "";
  const parsed = new Date(raw);
  return Number.isFinite(parsed.valueOf()) ? parsed.toISOString().slice(0, 10) : raw;
}

export function normalizeMonths(values: string[]): { months: string[]; unknown: string[] } {
  const lookup = new Map(CANONICAL_MONTHS.map((month) => [normalizedKey(month), month]));
  const months: string[] = [];
  const unknown: string[] = [];
  for (const value of values) {
    const month = lookup.get(normalizedKey(value));
    if (month && !months.includes(month)) months.push(month);
    else if (!month) unknown.push(value);
  }
  return { months, unknown };
}

export function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function compareStrings(left: string, right: string): number {
  return left.localeCompare(right, "en-US");
}

export function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalizedKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
