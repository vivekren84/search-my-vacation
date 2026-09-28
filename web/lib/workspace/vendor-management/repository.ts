// EBC-R1.3-WS13-005 Phase 0 (WP-0.6): vendor read repository.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Vendor, VendorLifecycleState } from "./types";

export class VendorRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Vendor repository operation failed");
    this.name = "VendorRepositoryError";
  }
}

function mapVendorRow(row: Record<string, unknown>): Vendor {
  return {
    id: row.id as string,
    vendorCode: row.vendor_code as string,
    name: row.name as string,
    lifecycleState: row.lifecycle_state as VendorLifecycleState,
    serviceType: (row.service_type as string | null) ?? null,
    destinationsServed: (row.destinations_served as string[] | null) ?? [],
    contactEmail: (row.contact_email as string | null) ?? null,
    contactPhone: (row.contact_phone as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    contractedRatesLink: (row.contracted_rates_link as string | null) ?? null,
  };
}

export async function listVendorsByLifecycleState(
  supabase: SupabaseClient,
  state: VendorLifecycleState,
): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("workspace_vendors")
    .select("*")
    .eq("lifecycle_state", state)
    .order("name", { ascending: true });
  if (error) {
    throw new VendorRepositoryError("vendor_list_failed");
  }
  return (data ?? []).map(mapVendorRow);
}

export async function fetchVendorById(supabase: SupabaseClient, vendorId: string): Promise<Vendor | null> {
  const { data, error } = await supabase.from("workspace_vendors").select("*").eq("id", vendorId).maybeSingle();
  if (error) {
    throw new VendorRepositoryError("vendor_fetch_failed");
  }
  return data ? mapVendorRow(data) : null;
}
