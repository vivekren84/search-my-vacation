// EBC-R1.3-WS13-005 Phase 0 (WP-0.5, AD-WS13-006): read-only settings
// service. Configuration is read per request (small table, no cache) so an
// Administrator's data change takes effect on the next request with no
// code change or deployment (FR-JW-26 AC3, FR-JW-23 AC1).

import type { SupabaseClient } from "@supabase/supabase-js";

import { listConfigurationRows, listReadinessTemplateRows } from "./repository";
import type { ReadinessTemplate, ReferenceListItem, ReferenceListKey, WorkspaceSettings } from "./types";
import { isActiveReferenceCode, parseWorkspaceSettings } from "./validation";

export async function getWorkspaceSettings(supabase: SupabaseClient): Promise<WorkspaceSettings> {
  return parseWorkspaceSettings(await listConfigurationRows(supabase));
}

export async function getReferenceList(
  supabase: SupabaseClient,
  key: ReferenceListKey,
  options: { activeOnly?: boolean } = {},
): Promise<ReferenceListItem[]> {
  const settings = await getWorkspaceSettings(supabase);
  const list = settings.referenceLists[key];
  return options.activeOnly ? list.filter((item) => item.active) : list;
}

export async function isActiveServiceCategory(supabase: SupabaseClient, code: string): Promise<boolean> {
  const list = await getReferenceList(supabase, "service_categories");
  return isActiveReferenceCode(list, code);
}

export async function listReadinessTemplates(
  supabase: SupabaseClient,
  options: { activeOnly?: boolean } = {},
): Promise<ReadinessTemplate[]> {
  const templates = await listReadinessTemplateRows(supabase);
  return options.activeOnly ? templates.filter((template) => template.active) : templates;
}
