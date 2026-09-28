// EBC-R1.3-WS13-005 Phase 0 (WP-0.5, AD-WS13-006): read-only bootstrap
// "settings" module types. The WS11 Data Architecture assigned
// workspace_configuration to a `settings` module; this is its first,
// read-only slice (no configuration UI in Release 1.3, DEP-12).
// Mirrors supabase/migrations/20260928100400_workspace_settings_configuration.sql.

export type ReferenceListKey =
  | "service_categories"
  | "document_type_categories"
  | "document_types"
  | "vendor_service_types"
  | "change_categories"
  | "task_categories";

export const REFERENCE_LIST_KEYS: readonly ReferenceListKey[] = [
  "service_categories",
  "document_type_categories",
  "document_types",
  "vendor_service_types",
  "change_categories",
  "task_categories",
];

export interface ReferenceListItem {
  code: string;
  label: string;
  active: boolean;
  sort: number;
  // document_types only: the Document Type category code (POD-03).
  category?: string;
  // task_categories only: the default task kind (FR-JW-24 AC2).
  defaultKind?: "task" | "follow_up";
}

export type ReferenceLists = Record<ReferenceListKey, ReferenceListItem[]>;

export interface AlertThresholds {
  readinessWindowDays: number; // AL-03
  documentWindowDays: number; // AL-04
  bookingDaysInStatus: number; // AL-05
  endDateGraceDays: number; // AL-07
  postTravelDays: number; // AL-08
  onHoldDays: number; // AL-09
}

export interface WorkspaceSettings {
  businessTimeZone: string;
  departureWindowDays: number;
  archiveRetentionDays: number;
  alertThresholds: AlertThresholds;
  referenceLists: ReferenceLists;
}

export interface ReadinessTemplate {
  id: string;
  code: string;
  name: string;
  active: boolean;
  sort: number;
}

export interface ConfigurationRow {
  key: string;
  value: unknown;
}
