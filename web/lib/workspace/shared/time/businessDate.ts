// EBC-R1.3-WS13-005 Phase 0 (WP-0.12; WS13-003 §4.4; R-ENG-JW-06): the
// business-time-zone date helper. Date gates and alerts are evaluated in
// the configured business time zone (Asia/Kolkata for Release 1.3,
// DEC-R1.3-020), never in UTC, which is what Vercel functions and
// Postgres now() use. The SQL twin is public.workspace_business_today()
// (supabase/migrations/20260928100400_workspace_settings_configuration.sql);
// keep both in lockstep.
//
// Pure: no I/O, so it is verifiable by verify:journey-workspace-dates and
// usable from server code, client components and the future cron route.

export const DEFAULT_BUSINESS_TIME_ZONE = "Asia/Kolkata";

const ISO_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Today's calendar date (YYYY-MM-DD) in `timeZone`, at instant `now`.
export function businessDateOf(now: Date, timeZone: string = DEFAULT_BUSINESS_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

// Whole days from `from` to `to` (both YYYY-MM-DD). to - from; negative
// when `to` is earlier. Calendar arithmetic in UTC, so no DST effects.
export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

// I-05 (WS13-001 Revision 3): confirmed dates are consistent with the
// Number of Nights when end - start, counted in nights, equals nights.
export function nightsBetween(startDate: string, endDate: string): number {
  return daysBetween(startDate, endDate);
}
