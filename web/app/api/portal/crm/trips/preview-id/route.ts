import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * GET /api/portal/crm/trips/preview-id?channel=DIRECT|VENDOR
 * Returns the non-authoritative preview of the next Trip ID (DDSMV-YY-XXX / VDSMV-YY-XXX).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel")?.toUpperCase() === "VENDOR" ? "VENDOR" : "DIRECT";

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const res = await fetch(`${config.projectUrl}/rest/v1/rpc/preview_next_deal_reference_id`, {
      method: "POST",
      headers: getAdminHeaders(config.secretKey),
      body: JSON.stringify({ p_deal_channel: channel }),
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ ok: false, message: errText }, { status: 502 });
    }

    const previewId = await res.json();
    return NextResponse.json({ ok: true, previewId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Failed to preview Trip ID." }, { status: 500 });
  }
}
