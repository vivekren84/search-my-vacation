import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * GET /api/portal/radar/destination?q=<query>
 * Dynamic on-demand intelligence lookup across destinations, workspace_vendors, and workspace_trips.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    if (!q) {
      return NextResponse.json({ ok: false, message: "Query is required." }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const headers = getAdminHeaders(config.secretKey);
    const encoded = encodeURIComponent(`*${q}*`);

    const [destRes, vendorsRes, tripsRes] = await Promise.all([
      fetch(
        `${config.projectUrl}/rest/v1/destinations?canonical_name=ilike.${encoded}&select=id,canonical_name,country,category,iana_timezone,aliases&limit=5`,
        { headers, signal: AbortSignal.timeout(4000) }
      ),
      fetch(
        `${config.projectUrl}/rest/v1/workspace_vendors?or=(destination.ilike.${encoded},region.ilike.${encoded})&is_active=eq.true&select=id,name,category,destination,poc_name&limit=10`,
        { headers, signal: AbortSignal.timeout(4000) }
      ),
      fetch(
        `${config.projectUrl}/rest/v1/workspace_trips?destination=ilike.${encoded}&is_archived=eq.false&select=id,deal_reference_id,deal_stage,start_date&limit=25`,
        { headers, signal: AbortSignal.timeout(4000) }
      ),
    ]);

    const destinations = destRes.ok ? await destRes.json() : [];
    const vendors = vendorsRes.ok ? await vendorsRes.json() : [];
    const trips = tripsRes.ok ? await tripsRes.json() : [];

    return NextResponse.json({
      ok: true,
      query: q,
      destinationMeta: Array.isArray(destinations) ? destinations[0] || null : null,
      vendorCount: Array.isArray(vendors) ? vendors.length : 0,
      vendors: Array.isArray(vendors) ? vendors.slice(0, 4) : [],
      tripCount: Array.isArray(trips) ? trips.length : 0,
      activeOrBookedTrips: Array.isArray(trips)
        ? trips.filter((t: any) => t.deal_stage === "Booked/Won" || t.deal_stage === "In Travel").length
        : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Radar lookup failed." }, { status: 500 });
  }
}
