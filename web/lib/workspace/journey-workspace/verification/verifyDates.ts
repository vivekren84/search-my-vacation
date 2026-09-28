// EBC-R1.3-WS13-005 Phase 0 (WP-0.13; WS13-004 §10.2; R-ENG-JW-06):
// npm run verify:journey-workspace-dates
// Business-time-zone dates around the IST midnight boundary (18:30 UTC),
// and the conversion date/nights rules (BR-027, POD-06 Policy 2, PD-A,
// I-05) including the UX Rev 4a §36.3 messages.

import { checkConversionDates } from "../validation";
import { businessDateOf, daysBetween, isIsoDate, nightsBetween } from "../../shared/time/businessDate";
import {
  datesNightsMismatchMessage,
  getConversionPrerequisiteIssues,
} from "../../journey-planning/validation";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace date verification failed: ${message}`);
}

// IST = UTC+05:30. 18:29 UTC is still the same IST day + 23:59; 18:30 UTC is the next IST day.
assert(businessDateOf(new Date("2026-09-28T18:29:59Z")) === "2026-09-28", "18:29:59 UTC is 28 Sep in IST");
assert(businessDateOf(new Date("2026-09-28T18:30:00Z")) === "2026-09-29", "18:30:00 UTC is 29 Sep in IST");
assert(businessDateOf(new Date("2026-09-28T18:30:00Z"), "UTC") === "2026-09-28", "same instant in UTC is still 28 Sep");
assert(businessDateOf(new Date("2026-12-31T19:00:00Z")) === "2027-01-01", "year boundary in IST");

assert(isIsoDate("2026-02-28") && !isIsoDate("2026-02-30") && !isIsoDate("2026-13-01") && !isIsoDate("12/10/2026"), "ISO date validation");
assert(isIsoDate("2028-02-29") && !isIsoDate("2027-02-29"), "leap years");
assert(daysBetween("2026-10-12", "2026-10-18") === 6, "6 days");
assert(nightsBetween("2026-10-12", "2026-10-18") === 6, "12-18 Oct is 6 nights (I-05)");
assert(nightsBetween("2026-12-30", "2027-01-02") === 3, "across year end");
assert(nightsBetween("2026-10-12", "2026-10-12") === 0, "same-day trip is 0 nights");

// Conversion date checks (same order as the M10 RPC).
assert(checkConversionDates({ confirmedStartDate: "2026-10-12", confirmedEndDate: "2026-10-18", nights: 6 }).length === 0, "consistent dates pass");
assert(checkConversionDates({ confirmedStartDate: undefined, confirmedEndDate: "2026-10-18", nights: 6 }).join() === "dates_required", "missing start");
assert(checkConversionDates({ confirmedStartDate: "2026-10-18", confirmedEndDate: "2026-10-12", nights: 6 }).join() === "dates_invalid", "end before start");
assert(checkConversionDates({ confirmedStartDate: "2026-10-12", confirmedEndDate: "2026-10-19", nights: 6 }).join() === "dates_nights_mismatch", "7 nights vs 6 -> block, never auto-corrected");
assert(checkConversionDates({ confirmedStartDate: "2026-10-12", confirmedEndDate: "2026-10-18", nights: null }).join() === "nights_required", "PD-A nights required");
assert(checkConversionDates({ confirmedStartDate: "", confirmedEndDate: "", nights: null }).join() === "dates_required,nights_required", "several issues at once");

// All prerequisites reported together, with the UX Rev 4a §36.3 copy.
const issues = getConversionPrerequisiteIssues({
  ownerId: null,
  nights: 6,
  serviceCategory: null,
  confirmedStartDate: "2026-10-12",
  confirmedEndDate: "2026-10-19",
});
assert(issues.map((issue) => issue.code).join() === "owner_required,dates_nights_mismatch,service_category_required", "owner, mismatch and category reported together");
assert(issues[1].message === "These dates cover 7 nights, but Trip Basics says 6. Change the dates or the nights so they match.", "mismatch copy");
assert(datesNightsMismatchMessage(7, 6) === issues[1].message, "mismatch helper");
assert(issues[0].message === "Assign an owner before confirming. A Journey always has an owner.", "owner copy");
assert(issues[2].message === "Choose a Service Category before confirming.", "category copy");
assert(
  getConversionPrerequisiteIssues({ ownerId: "u", nights: 6, serviceCategory: "family", confirmedStartDate: "2026-10-12", confirmedEndDate: "2026-10-18" }).length === 0,
  "all prerequisites met",
);

console.log(`Journey Workspace date verification passed (${checks} checks).`);
