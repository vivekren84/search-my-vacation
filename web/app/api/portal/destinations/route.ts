import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * GET /api/portal/destinations
 * Returns canonical destinations and aliases from public.destinations.
 */
export async function GET() {
  try {
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const res = await fetch(
      `${config.projectUrl}/rest/v1/destinations?select=id,canonical_name,aliases,country,category,iana_timezone,is_public_featured&order=canonical_name.asc`,
      { headers: getAdminHeaders(config.secretKey), signal: AbortSignal.timeout(5000) }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ ok: false, message: errText }, { status: 502 });
    }

    const destinations = await res.json();
    return NextResponse.json({ ok: true, destinations: Array.isArray(destinations) ? destinations : [] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Failed to load destinations." }, { status: 500 });
  }
}
