import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders, hasProhibitedBrandTerm } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    if (hasProhibitedBrandTerm(body)) {
      return NextResponse.json({ ok: false, message: "Brand Tone Guardrail: Prohibited terminology detected." }, { status: 400 });
    }

    const {
      companionId,
      customerId,
      fullName,
      relationship = "spouse",
      dob,
      notes,
      isLeadTraveller = false,
      dietaryNotes,
      mobilityNotes,
    } = body;

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }
    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });

    let resolvedCompanionId = companionId;

    if (!resolvedCompanionId) {
      if (!customerId || !fullName || !String(fullName).trim()) {
        return NextResponse.json(
          { ok: false, message: "customerId and fullName are required to create a companion." },
          { status: 400 }
        );
      }
      const createCompRes = await fetch(`${config.projectUrl}/rest/v1/workspace_client_companions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          client_id: customerId,
          full_name: String(fullName).trim(),
          relationship,
          dob: dob || null,
          notes: notes?.trim() || null,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!createCompRes.ok) {
        const errText = await createCompRes.text();
        return NextResponse.json({ ok: false, message: `Failed to create companion: ${errText}` }, { status: 502 });
      }
      const [createdComp] = await createCompRes.json();
      resolvedCompanionId = createdComp.id;
    }

    const linkRes = await fetch(`${config.projectUrl}/rest/v1/workspace_trip_companions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip_id: id,
        companion_id: resolvedCompanionId,
        is_lead_traveller: Boolean(isLeadTraveller),
        dietary_notes: dietaryNotes?.trim() || null,
        mobility_notes: mobilityNotes?.trim() || null,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!linkRes.ok) {
      const errText = await linkRes.text();
      return NextResponse.json({ ok: false, message: `Failed to link co-traveller: ${errText}` }, { status: 502 });
    }

    const [linked] = await linkRes.json();
    return NextResponse.json({ ok: true, linked, message: "Co-traveller linked to journey." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to link co-traveller." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("linkId");
    if (!linkId) {
      return NextResponse.json({ ok: false, message: "linkId is required." }, { status: 400 });
    }
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }
    await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_companions?id=eq.${encodeURIComponent(linkId)}&trip_id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers: getAdminHeaders(config.secretKey), signal: AbortSignal.timeout(5000) }
    );
    return NextResponse.json({ ok: true, message: "Co-traveller removed from journey." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to remove co-traveller." }, { status: 500 });
  }
}
