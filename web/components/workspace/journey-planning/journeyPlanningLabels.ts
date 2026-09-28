// EBC-R1.3-WS12-007 Phase 5: Journey Planning UI — shared label maps.
// Kept as plain data, not a component, so every screen (Queue, Detail,
// Decision) renders the same stage/outcome copy from one source.
//
// EBC-R1.3-WS12-013: adds Trip Basics field labels/helper text (WS12-012
// §4.2) and the trip_basics_updated audit event label.

import type {
  JourneyPlanningGatedParameterField,
  JourneyPlanningOriginChannel,
  JourneyPlanningOutcome,
  JourneyPlanningStage,
} from "@/lib/workspace/journey-planning/types";
import type { WorkspaceAuditEventType } from "@/lib/workspace/shared/audit/types";

export const STAGE_LABELS: Record<JourneyPlanningStage, string> = {
  lead_created: "Lead Created",
  discovery: "Discovery",
  planning: "Planning",
  proposal_shared: "Proposal Shared",
  revision: "Revision",
  decision: "Decision",
  closed: "Closed",
};

export const OUTCOME_LABELS: Record<JourneyPlanningOutcome, string> = {
  confirmed: "Confirmed",
  lost: "Lost",
  archived: "Archived",
};

// FR-JP-06 (WS12-003): the eight ratified origin channels.
export const ORIGIN_CHANNEL_LABELS: Record<JourneyPlanningOriginChannel, string> = {
  website_enquiry: "Website enquiry",
  whatsapp: "WhatsApp",
  phone: "Phone",
  walk_in: "Walk-in",
  referral: "Referral",
  existing_traveller: "Existing Traveller",
  corporate_enquiry: "Corporate enquiry",
  manual_workspace_initiation: "Manual Workspace initiation",
};

// EBC-R1.3-WS12-010 Defect D1a: History/Audit UI labels.
export const AUDIT_EVENT_LABELS: Record<WorkspaceAuditEventType, string> = {
  created: "Record created",
  claimed: "Ownership claimed",
  reassigned: "Record reassigned",
  stage_transition: "Stage changed",
  proposal_version_created: "Proposal version created",
  proposal_sent: "Proposal sent",
  vendor_quotation_recorded: "Vendor quotation recorded",
  record_converted: "Converted to Journey",
  record_closed: "Record closed",
  archived: "Archived",
  task_created: "Task created",
  task_updated: "Task updated",
  trip_basics_updated: "Trip Basics updated",
  // EBC-R1.3-WS13-005 Phase 0 (M02): Journey Workspace events. The Journey
  // History screen (Phase 1) owns their final presentation; these labels
  // keep this map complete and are what a Journey Planning record shows if
  // one ever appears in its own History.
  journey_created: "Journey created",
  journey_stage_changed: "Stage changed",
  journey_stage_stepped_back: "Stepped back",
  journey_on_hold: "Placed on hold",
  journey_resumed: "Resumed",
  journey_cancelled: "Journey cancelled",
  journey_closed: "Marked as Completed",
  journey_superseded: "Journey superseded",
  journey_reassigned: "Journey reassigned",
  journey_archived: "Journey archived",
  journey_service_category_changed: "Service Category changed",
  journey_contact_changed: "Primary Operational Contact changed",
  journey_template_assigned: "Readiness template assigned",
  journey_template_changed: "Readiness template changed",
  journey_legacy_adopted: "Legacy Journey adopted",
  readiness_item_updated: "Readiness item updated",
  vendor_booking_created: "Vendor booking added",
  vendor_booking_status_changed: "Vendor booking status changed",
  vendor_booking_updated: "Vendor booking updated",
  document_added: "Document added",
  document_status_changed: "Document status changed",
  document_updated: "Document updated",
  document_reference_updated: "External reference updated",
  change_record_created: "Operational change recorded",
  activity_logged: "Activity logged",
  note_added: "Note added",
  material_change_started: "Material change started",
  alert_raised: "Alert raised",
  alert_resolved: "Alert resolved",
  legacy_backfilled: "Legacy record prepared",
};

// EBC-R1.3-WS12-013 / WS12-012 §4.2: user-facing labels and helper text
// for the five Discovery→Planning-gated Planning Parameters. Number of
// Adults is deliberately not in this map — WS12-012 §4.3 treats it as
// "Required" (creation-blocking), a distinct tag from the "Needed before
// Planning" tag these five carry, so it is labelled directly in each
// screen rather than through this gated-fields map.
export const PLANNING_PARAMETER_LABELS: Record<JourneyPlanningGatedParameterField, string> = {
  children: "Number of Children",
  infants: "Number of Infants",
  intendedTravelMonth: "Intended Travel Month",
  nights: "Number of Nights",
  preferredDepartureCity: "Preferred Departure City",
};

export const PLANNING_PARAMETER_HELPER_TEXT: Record<JourneyPlanningGatedParameterField, string> = {
  children: "Add now if you know — you can fill this in later during Discovery.",
  infants: "Add now if you know — you can fill this in later during Discovery.",
  intendedTravelMonth: "An approximate month is fine — exact dates come later.",
  nights: "Roughly how many nights, even as an estimate.",
  preferredDepartureCity: "Where the group will be flying from.",
};
