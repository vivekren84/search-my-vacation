// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): user-facing messages for
// Journey Workspace error codes. Copy from EBC-R1.3-WS13-020B (Sophie) §2
// S-5 and UX Rev 4a §9.3; where a message depends on screen context (the
// departure date, the number of outstanding items) the screen formats its
// own sentence and this text is the fallback. Pure; shared by API responses
// and the Milestone B screens so the copy lives in one place.

import type { JourneyWorkspaceErrorCode } from "./types";

export const JOURNEY_WORKSPACE_ERROR_MESSAGES: Readonly<Record<JourneyWorkspaceErrorCode, string>> = {
  not_authorised: "Only the owner or an Administrator can change this Journey.",
  not_found: "This Journey couldn't be found.",
  archived: "This Journey is archived. It can't be changed.",
  terminal: "This Journey is finished. It can't be changed.",
  legacy_pending: "This Journey is awaiting adoption by an Administrator.",
  not_legacy: "This Journey has already been adopted.",
  stale: "This Journey changed while you were viewing it. We've refreshed it — check the details and try again.",
  on_hold: "This Journey is on hold. Resume it first.",
  already_on_hold: "This Journey is already on hold.",
  not_on_hold: "This Journey isn't on hold.",
  transition_not_allowed: "That step isn't available from the Journey's current stage.",
  hold_not_allowed: "Holding isn't available at this stage.",
  cancel_not_allowed: "This Journey can't be cancelled at this stage.",
  close_not_allowed: "A Journey can be marked as Completed only during post-travel follow-up.",
  readiness_incomplete: "Some readiness items are still outstanding.",
  start_date_not_reached: "Available from the departure date.",
  end_date_not_reached: "Available from the return date.",
  template_invalid: "Choose a template.",
  template_already_assigned: "This Journey already has a different readiness template.",
  owner_unchanged: "Choose a different owner.",
  new_owner_invalid: "Choose an active Workspace User.",
  service_category_invalid: "Choose a Service Category from the list.",
  service_category_required: "Choose a Service Category.",
  service_category_unchanged: "Choose a different Service Category.",
  reason_required: "Add a reason.",
  reason_too_long: "Keep the reason under 500 characters.",
  note_too_long: "Keep the note under 1,000 characters.",
  booking_invalid: "One of the selected bookings can't be used for a cancellation task.",
  replacement_open: "A replacement planning record is open for this Journey. Finish or close it first.",
  dates_required: "Enter both the start and end dates.",
  dates_invalid: "The end date can't be before the start date.",
  dates_nights_mismatch: "These dates don't match the number of nights in the original record. Change the dates so they match.",
  contact_invalid: "Check the Primary Operational Contact details.",
  invalid_request: "That request wasn't valid.",
  operation_failed: "That didn't save. Please try again. If it keeps happening, tell an Administrator.",
};

// Field-level contact messages (EBC-R1.3-WS13-020B S-5, `contact_invalid`).
export const CONTACT_FIELD_MESSAGES = {
  contactType: "Choose a contact type.",
  name: "Enter a name.",
  organisation: "Enter the organisation.",
  phone: "Add a phone number or an email address.",
} as const;
