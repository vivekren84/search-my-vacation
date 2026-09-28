// EBC-R1.3-WS13-005 Phase 0 (WP-0.5, AD-WS13-006): defensive parsing of
// configuration values. Configuration is edited as data by an
// Administrator (no UI, DEP-12), so a malformed value must never crash a
// page: each value falls back to its approved Release 1.3 default
// (WS13-001 Revision 3 §16/§17, D-08, DEC-R1.3-020) and the caller may log
// the fallback. Pure: no I/O (verify:journey-workspace-config).

import { DEFAULT_BUSINESS_TIME_ZONE } from "../shared/time/businessDate";
import {
  REFERENCE_LIST_KEYS,
  type AlertThresholds,
  type ConfigurationRow,
  type ReferenceListItem,
  type ReferenceLists,
  type WorkspaceSettings,
} from "./types";

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  readinessWindowDays: 14,
  documentWindowDays: 21,
  bookingDaysInStatus: 3,
  endDateGraceDays: 1,
  postTravelDays: 7,
  onHoldDays: 14,
};

export const DEFAULT_DEPARTURE_WINDOW_DAYS = 14;
export const DEFAULT_ARCHIVE_RETENTION_DAYS = 60;

const CODE_PATTERN = /^[a-z][a-z0-9_]*$/;

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function parseReferenceList(value: unknown): ReferenceListItem[] {
  if (!Array.isArray(value)) return [];
  const items: ReferenceListItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const entry = raw as Record<string, unknown>;
    if (typeof entry.code !== "string" || !CODE_PATTERN.test(entry.code)) continue;
    if (typeof entry.label !== "string" || entry.label.trim().length === 0) continue;
    const item: ReferenceListItem = {
      code: entry.code,
      label: entry.label.trim(),
      active: entry.active !== false,
      sort: typeof entry.sort === "number" ? entry.sort : 0,
    };
    if (typeof entry.category === "string") item.category = entry.category;
    if (entry.defaultKind === "task" || entry.defaultKind === "follow_up") item.defaultKind = entry.defaultKind;
    items.push(item);
  }
  return items.sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
}

export function parseAlertThresholds(value: unknown): AlertThresholds {
  const source = value && typeof value === "object" ? (value as Record<string, Record<string, unknown>>) : {};
  const pick = (alert: string, field: string, fallback: number) => {
    const candidate = source[alert]?.[field];
    return isNonNegativeInteger(candidate) ? candidate : fallback;
  };
  return {
    readinessWindowDays: pick("AL-03", "readinessWindowDays", DEFAULT_ALERT_THRESHOLDS.readinessWindowDays),
    documentWindowDays: pick("AL-04", "documentWindowDays", DEFAULT_ALERT_THRESHOLDS.documentWindowDays),
    bookingDaysInStatus: pick("AL-05", "daysInStatus", DEFAULT_ALERT_THRESHOLDS.bookingDaysInStatus),
    endDateGraceDays: pick("AL-07", "daysAfterEnd", DEFAULT_ALERT_THRESHOLDS.endDateGraceDays),
    postTravelDays: pick("AL-08", "daysAfterEnd", DEFAULT_ALERT_THRESHOLDS.postTravelDays),
    onHoldDays: pick("AL-09", "daysOnHold", DEFAULT_ALERT_THRESHOLDS.onHoldDays),
  };
}

export function parseWorkspaceSettings(rows: readonly ConfigurationRow[]): WorkspaceSettings {
  const byKey = new Map(rows.map((row) => [row.key, row.value]));

  const referenceLists = Object.fromEntries(
    REFERENCE_LIST_KEYS.map((key) => [key, parseReferenceList(byKey.get(key))]),
  ) as ReferenceLists;

  const timeZone = byKey.get("business_timezone");
  const departureWindow = byKey.get("departure_window_days");
  const retention = byKey.get("archive_retention_days");

  return {
    businessTimeZone: isValidTimeZone(timeZone) ? timeZone : DEFAULT_BUSINESS_TIME_ZONE,
    departureWindowDays: isNonNegativeInteger(departureWindow) ? departureWindow : DEFAULT_DEPARTURE_WINDOW_DAYS,
    archiveRetentionDays: isNonNegativeInteger(retention) ? retention : DEFAULT_ARCHIVE_RETENTION_DAYS,
    alertThresholds: parseAlertThresholds(byKey.get("alert_thresholds")),
    referenceLists,
  };
}

// True when `code` is an ACTIVE entry of `list` (the same rule as the SQL
// helper public.workspace_config_has_code with p_active_only = true).
export function isActiveReferenceCode(list: readonly ReferenceListItem[], code: string): boolean {
  return list.some((item) => item.code === code && item.active);
}
