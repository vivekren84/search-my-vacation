// EBC-R1.3-WS13-005 Phase 0 (WP-0.5, AD-WS13-006): settings repository.
// Session-bound client; RLS allows provisioned Workspace Users to read.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ConfigurationRow, ReadinessTemplate } from "./types";

export class WorkspaceSettingsRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Workspace settings repository operation failed");
    this.name = "WorkspaceSettingsRepositoryError";
  }
}

export async function listConfigurationRows(supabase: SupabaseClient): Promise<ConfigurationRow[]> {
  const { data, error } = await supabase.from("workspace_configuration").select("key, value");
  if (error) {
    throw new WorkspaceSettingsRepositoryError("workspace_configuration_read_failed");
  }
  return (data ?? []).map((row) => ({ key: row.key as string, value: row.value as unknown }));
}

export async function listReadinessTemplateRows(supabase: SupabaseClient): Promise<ReadinessTemplate[]> {
  const { data, error } = await supabase
    .from("workspace_readiness_templates")
    .select("id, code, name, active, sort")
    .order("sort", { ascending: true });
  if (error) {
    throw new WorkspaceSettingsRepositoryError("workspace_readiness_templates_read_failed");
  }
  return (data ?? []).map((row) => ({
    id: row.id as string,
    code: row.code as string,
    name: row.name as string,
    active: row.active as boolean,
    sort: row.sort as number,
  }));
}

// EBC-R1.3-WS13-025 Phase 1 Milestone B (Sophie EBC-R1.3-WS13-020B S-4):
// active item count per Readiness Template, so the Start preparation dialog
// can say "This template doesn't have readiness items yet…" only when true.
export async function countActiveReadinessTemplateItems(supabase: SupabaseClient): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from("workspace_readiness_template_items")
    .select("template_id")
    .eq("active", true);
  if (error) {
    throw new WorkspaceSettingsRepositoryError("workspace_readiness_template_items_read_failed");
  }
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const id = row.template_id as string;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}
