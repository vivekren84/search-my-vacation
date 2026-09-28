// EBC-R1.3-WS13-005 Phase 0 (WP-0.6): vendor read service. First consumer
// is the Phase 2 Add Booking panel (FR-JW-15 AC1: Active vendors only).

import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchVendorById, listVendorsByLifecycleState } from "./repository";
import type { Vendor } from "./types";

export async function listActiveVendors(supabase: SupabaseClient): Promise<Vendor[]> {
  return listVendorsByLifecycleState(supabase, "active");
}

export async function getVendorById(supabase: SupabaseClient, vendorId: string): Promise<Vendor | null> {
  return fetchVendorById(supabase, vendorId);
}
