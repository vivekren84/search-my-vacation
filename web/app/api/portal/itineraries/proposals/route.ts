import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * POST /api/portal/itineraries/proposals
 * Persists a white-label proposal snapshot in public.workspace_proposal_versions (US-010).
 * Strictly strips all supplier vendor_name, vendor_contact, net_cost, markup_percent, and markup_amount.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itineraryId } = body;

    if (!itineraryId) {
      return NextResponse.json(
        { ok: false, message: "itineraryId is required to export a proposal." },
        { status: 400 }
      );
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json(
        { ok: false, message: "Database configuration missing." },
        { status: 500 }
      );
    }

    const { projectUrl, secretKey } = config;
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const [itinRes, daysRes, segsRes, propRes] = await Promise.all([
      fetch(`${projectUrl}/rest/v1/workspace_itineraries?id=eq.${encodeURIComponent(itineraryId)}&select=*`, {
        headers,
        signal: AbortSignal.timeout(5000),
      }),
      fetch(
        `${projectUrl}/rest/v1/workspace_itinerary_days?itinerary_id=eq.${encodeURIComponent(itineraryId)}&select=*&order=day_number.asc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_itinerary_segments?itinerary_id=eq.${encodeURIComponent(itineraryId)}&select=*&order=order_index.asc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_proposal_versions?itinerary_id=eq.${encodeURIComponent(itineraryId)}&select=version_label`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
    ]);

    const itins: any[] = itinRes.ok ? await itinRes.json() : [];
    if (!itins.length) {
      return NextResponse.json({ ok: false, message: "Itinerary not found." }, { status: 404 });
    }
    const itin = itins[0];
    const days: any[] = daysRes.ok ? await daysRes.json() : [];
    const segments: any[] = segsRes.ok ? await segsRes.json() : [];
    const existingProps: any[] = propRes.ok ? await propRes.json() : [];

    // Compute next version label (v1.0, v1.1, v1.2, ...)
    const nextVersion = `v1.${existingProps.length}`;

    let grossSellingPrice = 0;
    for (const s of segments) {
      grossSellingPrice += Number(s.selling_price || 0);
    }
    grossSellingPrice = Math.round(grossSellingPrice * 100) / 100;

    // White-label client snapshot: ZERO vendor names, net costs, or markup percentages (US-010)
    const whiteLabelSnapshot = {
      title: itin.title,
      circuitSummary: itin.circuit_summary || "",
      startDate: itin.start_date || null,
      endDate: itin.end_date || null,
      durationDays: itin.duration_days,
      currency: itin.currency || "INR",
      grossSellingPrice,
      days: days.map((d) => ({
        dayNumber: d.day_number,
        title: d.title,
        destination: d.destination,
        notes: d.notes || "",
        experiences: segments
          .filter((s) => s.day_id === d.id)
          .map((s) => ({
            segmentType: s.segment_type,
            title: s.title,
            description: s.description || "",
          })),
      })),
    };

    const insertRes = await fetch(`${projectUrl}/rest/v1/workspace_proposal_versions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        itinerary_id: itineraryId,
        version_label: nextVersion,
        gross_selling_price: grossSellingPrice,
        currency: itin.currency || "INR",
        client_snapshot: whiteLabelSnapshot,
        is_override_approved: true,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to export proposal: ${errText}` },
        { status: 502 }
      );
    }

    const [createdProposal] = await insertRes.json();

    // Update itinerary version & status
    await fetch(
      `${projectUrl}/rest/v1/workspace_itineraries?id=eq.${encodeURIComponent(itineraryId)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          current_version: nextVersion,
          status: itin.status === "draft" ? "proposal_sent" : itin.status,
          updated_at: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    return NextResponse.json({
      ok: true,
      proposal: createdProposal,
      whiteLabelSnapshot,
      versionLabel: nextVersion,
      message: `White-label proposal ${nextVersion} exported and archived.`,
    });
  } catch (err: any) {
    console.error("Proposal export POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to export proposal." },
      { status: 500 }
    );
  }
}
