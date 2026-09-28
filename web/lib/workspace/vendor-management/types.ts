// EBC-R1.3-WS13-005 Phase 0 (WP-0.6; AD-WS13-006; POD-05; Spec v2.0 §20):
// read-only bootstrap "vendor-management" module (Bootstrap Ownership
// Principle, DEC-R1.3-013). Vendor Management (WS16) owns the Vendor
// object; Journey Workspace only reads Active vendors through this module
// and never queries workspace_vendors directly (AD-WS11-004).
// Mirrors supabase/migrations/20260928100500_workspace_vendors_baseline.sql.

export type VendorLifecycleState = "prospective" | "active" | "inactive";

export interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  lifecycleState: VendorLifecycleState;
  serviceType: string | null;
  destinationsServed: string[];
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  contractedRatesLink: string | null;
}
