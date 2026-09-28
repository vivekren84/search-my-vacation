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
