import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * POST /api/portal/crm/trips/sync-in-travel
 * Frontend hydration sync: promotes any Booked/Won trips whose start_date <= today (IST) to In Travel.
 */
export async function POST() {
  try {
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const res = await fetch(`${config.projectUrl}/rest/v1/rpc/promote_due_trips_to_in_travel`, {
      method: "POST",
      headers: getAdminHeaders(config.secretKey),
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ ok: false, message: errText }, { status: 502 });
    }

    const result = await res.json();
    return NextResponse.json({
      ok: true,
      promotedCount: Number(result?.promoted_count ?? 0),
      promotedRefs: Array.isArray(result?.promoted_refs) ? result.promoted_refs : [],
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Sync failed." }, { status: 500 });
  }
}
