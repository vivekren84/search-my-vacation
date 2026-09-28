// EBC-R1.3-WS13-005 Phase 0 (WP-0.13; WS13-004 §7, §10.2):
// npm run verify:journey-workspace-config
// Configuration parsing and fallbacks (settings/validation.ts). A malformed
// Administrator edit must never crash a page (AD-WS13-006, DEP-12).

import { isActiveReferenceCode, parseReferenceList, parseWorkspaceSettings } from "../../settings/validation";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace configuration verification failed: ${message}`);
}

// Approved seed shape (M05).
const seeded = parseWorkspaceSettings([
  { key: "business_timezone", value: "Asia/Kolkata" },
  { key: "departure_window_days", value: 14 },
  { key: "archive_retention_days", value: 60 },
  { key: "alert_thresholds", value: { "AL-03": { readinessWindowDays: 14 }, "AL-05": { daysInStatus: 3 }, "AL-09": { daysOnHold: 14 } } },
  {
    key: "service_categories",
    value: [
      { code: "family", label: "Family", active: true, sort: 50 },
      { code: "domestic", label: "Domestic", active: true, sort: 10 },
      { code: "retired", label: "Retired", active: false, sort: 90 },
    ],
  },
  { key: "document_types", value: [] },
]);
assert(seeded.businessTimeZone === "Asia/Kolkata", "time zone");
assert(seeded.departureWindowDays === 14 && seeded.archiveRetentionDays === 60, "windows");
assert(seeded.alertThresholds.readinessWindowDays === 14 && seeded.alertThresholds.bookingDaysInStatus === 3, "thresholds");
assert(seeded.alertThresholds.documentWindowDays === 21, "missing threshold falls back to the approved default (AL-04 21 days)");
assert(seeded.referenceLists.service_categories.map((item) => item.code).join() === "domestic,family,retired", "sorted by sort");
assert(isActiveReferenceCode(seeded.referenceLists.service_categories, "family"), "active code");
assert(!isActiveReferenceCode(seeded.referenceLists.service_categories, "retired"), "retired code is not active");
assert(!isActiveReferenceCode(seeded.referenceLists.service_categories, "nope"), "unknown code");
assert(seeded.referenceLists.document_types.length === 0, "empty content list stays empty (EP-02 pending)");
assert(seeded.referenceLists.change_categories.length === 0, "absent key -> empty list");

// Malformed values fall back instead of throwing.
const broken = parseWorkspaceSettings([
  { key: "business_timezone", value: "Not/AZone" },
  { key: "departure_window_days", value: "fourteen" },
  { key: "archive_retention_days", value: -5 },
  { key: "alert_thresholds", value: "oops" },
  { key: "service_categories", value: { not: "a list" } },
]);
assert(broken.businessTimeZone === "Asia/Kolkata", "invalid time zone -> Asia/Kolkata");
assert(broken.departureWindowDays === 14 && broken.archiveRetentionDays === 60, "invalid numbers -> defaults");
assert(broken.alertThresholds.onHoldDays === 14, "invalid thresholds -> defaults");
assert(broken.referenceLists.service_categories.length === 0, "non-list -> empty");

// Item-level filtering.
const items = parseReferenceList([
  { code: "ok_code", label: "OK" },
  { code: "Bad Code", label: "Bad" },
  { code: "no_label" },
  "string",
  { code: "typed", label: "Typed", category: "travel", defaultKind: "follow_up" },
]);
assert(items.length === 2, "invalid entries dropped");
assert(items[0].active === true, "active defaults to true");
assert(items.find((item) => item.code === "typed")?.defaultKind === "follow_up", "defaultKind kept");

console.log(`Journey Workspace configuration verification passed (${checks} checks).`);
