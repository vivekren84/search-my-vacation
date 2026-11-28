import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * GET /api/portal/login-banners
 * Returns active promotional/editorial banners for the split-layout /portal/login showcase.
 */
export async function GET() {
  try {
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: true, banners: [] });
    }

    const res = await fetch(
      `${config.projectUrl}/rest/v1/portal_login_banners?is_active=eq.true&order=sort_order.asc`,
      { headers: getAdminHeaders(config.secretKey), signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) {
      return NextResponse.json({ ok: true, banners: [] });
    }
    const banners = await res.json();
    return NextResponse.json({ ok: true, banners: Array.isArray(banners) ? banners : [] });
  } catch {
    return NextResponse.json({ ok: true, banners: [] });
  }
}
