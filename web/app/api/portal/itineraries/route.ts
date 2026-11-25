import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function computeSegmentPricing(seg: any) {
  const netCost = Number(seg.netCost ?? seg.net_cost ?? 0) || 0;
  const markupPercent = Number(seg.markupPercent ?? seg.markup_percent ?? 15) || 0;
  const taxPercent = Number(seg.taxPercent ?? seg.tax_percent ?? 5) || 0;

  // Markup amount on net cost; Formula 1 5% GST inside margin if taxPercent === 5
  const markupAmount = Math.round(netCost * (markupPercent / 100) * 100) / 100;
  const grossMargin = markupAmount;
  const taxAmount =
    taxPercent > 0
      ? Math.round((grossMargin - grossMargin / (1 + taxPercent / 100)) * 100) / 100
      : 0;
  const sellingPrice = Math.round((netCost + markupAmount) * 100) / 100;

  return {
    netCost,
    markupPercent,
    markupAmount,
    taxPercent,
    taxAmount,
    sellingPrice,
  };
}

/**
 * GET /api/portal/itineraries
 * Returns persisted itineraries with days, segments, customer/trip joins, and pricing rollups.
 */
export async function GET() {
  try {
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
    };

    const [itinRes, daysRes, segsRes, custRes, tripsRes, propRes] = await Promise.all([
      fetch(`${projectUrl}/rest/v1/workspace_itineraries?select=*&order=updated_at.desc`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_itinerary_days?select=*&order=day_number.asc`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_itinerary_segments?select=*&order=order_index.asc`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_customers?select=id,customer_code,primary_name`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_trips?select=id,deal_reference_id,destination`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_proposal_versions?select=*&order=created_at.desc`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    if (!itinRes.ok) {
      const errText = await itinRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to query itineraries: ${errText}` },
        { status: 502 }
      );
    }

    const itineraries: any[] = await itinRes.json();
    const days: any[] = daysRes.ok ? await daysRes.json() : [];
    const segments: any[] = segsRes.ok ? await segsRes.json() : [];
    const customers: any[] = custRes.ok ? await custRes.json() : [];
    const trips: any[] = tripsRes.ok ? await tripsRes.json() : [];
    const proposals: any[] = propRes.ok ? await propRes.json() : [];

    const custMap = new Map<string, any>(customers.map((c) => [c.id, c]));
    const tripMap = new Map<string, any>(trips.map((t) => [t.id, t]));

    const segsByDay = new Map<string, any[]>();
    for (const s of segments) {
      if (!segsByDay.has(s.day_id)) segsByDay.set(s.day_id, []);
      segsByDay.get(s.day_id)!.push({
        id: s.id,
        dayId: s.day_id,
        itineraryId: s.itinerary_id,
        orderIndex: s.order_index,
        segmentType: s.segment_type,
        title: s.title,
        description: s.description || "",
        vendorName: s.vendor_name || "",
        vendorContact: s.vendor_contact || "",
        netCost: Number(s.net_cost || 0),
        markupPercent: Number(s.markup_percent || 0),
        markupAmount: Number(s.markup_amount || 0),
        taxPercent: Number(s.tax_percent || 0),
        taxAmount: Number(s.tax_amount || 0),
        sellingPrice: Number(s.selling_price || 0),
      });
    }

    const daysByItin = new Map<string, any[]>();
    for (const d of days) {
      if (!daysByItin.has(d.itinerary_id)) daysByItin.set(d.itinerary_id, []);
      daysByItin.get(d.itinerary_id)!.push({
        id: d.id,
        itineraryId: d.itinerary_id,
        dayNumber: d.day_number,
        title: d.title,
        destination: d.destination,
        notes: d.notes || "",
        segments: segsByDay.get(d.id) || [],
      });
    }

    const propsByItin = new Map<string, any[]>();
    for (const p of proposals) {
      if (!propsByItin.has(p.itinerary_id)) propsByItin.set(p.itinerary_id, []);
      propsByItin.get(p.itinerary_id)!.push(p);
    }

    const enriched = itineraries.map((it) => {
      const cust = custMap.get(it.client_id);
      const trip = it.trip_id ? tripMap.get(it.trip_id) : null;
      const itinDays = daysByItin.get(it.id) || [];

      let totalNetCost = 0;
      let totalMarkupAmount = 0;
      let totalTaxAmount = 0;
      let grossSellingPrice = 0;

      for (const d of itinDays) {
        for (const s of d.segments) {
          totalNetCost += s.netCost;
          totalMarkupAmount += s.markupAmount;
          totalTaxAmount += s.taxAmount;
          grossSellingPrice += s.sellingPrice;
        }
      }

      const marginPercent =
        grossSellingPrice > 0
          ? Math.round((totalMarkupAmount / grossSellingPrice) * 1000) / 10
          : 0;

      return {
        id: it.id,
        clientId: it.client_id,
        customerCode: cust?.customer_code || "—",
        customerName: cust?.primary_name || "—",
        tripId: it.trip_id || null,
        dealReferenceId: trip?.deal_reference_id || null,
        title: it.title,
        circuitSummary: it.circuit_summary || "",
        startDate: it.start_date || "",
        endDate: it.end_date || "",
        durationDays: it.duration_days || itinDays.length || 1,
        currency: it.currency || "INR",
        status: it.status || "draft",
        currentVersion: it.current_version || "v1.0",
        days: itinDays,
        proposals: propsByItin.get(it.id) || [],
        pricing: {
          totalNetCost: Math.round(totalNetCost * 100) / 100,
          totalMarkupAmount: Math.round(totalMarkupAmount * 100) / 100,
          totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
          grossSellingPrice: Math.round(grossSellingPrice * 100) / 100,
          marginPercent,
        },
        createdAt: it.created_at,
        updatedAt: it.updated_at,
      };
    });

    return NextResponse.json({ ok: true, itineraries: enriched });
  } catch (err: any) {
    console.error("Itineraries GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load itineraries." },
      { status: 500 }
    );
  }
}

async function insertDaysAndSegments(
  projectUrl: string,
  headers: Record<string, string>,
  itineraryId: string,
  days: any[]
) {
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const dayRes = await fetch(`${projectUrl}/rest/v1/workspace_itinerary_days`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        itinerary_id: itineraryId,
        day_number: Number(d.dayNumber || i + 1),
        title: (d.title || `Day ${i + 1}`).trim(),
        destination: (d.destination || "Bespoke Circuit").trim(),
        notes: d.notes?.trim() || null,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!dayRes.ok) {
      const errText = await dayRes.text();
      throw new Error(`Failed to save day ${i + 1}: ${errText}`);
    }

    const [createdDay] = await dayRes.json();
    const segments = Array.isArray(d.segments) ? d.segments : [];

    for (let sIdx = 0; sIdx < segments.length; sIdx++) {
      const s = segments[sIdx];
      const pricing = computeSegmentPricing(s);
      const segRes = await fetch(`${projectUrl}/rest/v1/workspace_itinerary_segments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          day_id: createdDay.id,
          itinerary_id: itineraryId,
          order_index: sIdx,
          segment_type: s.segmentType || "hotel",
          title: (s.title || "Curated Experience").trim(),
          description: s.description?.trim() || null,
          vendor_name: s.vendorName?.trim() || null,
          vendor_contact: s.vendorContact?.trim() || null,
          net_cost: pricing.netCost,
          markup_percent: pricing.markupPercent,
          markup_amount: pricing.markupAmount,
          tax_percent: pricing.taxPercent,
          tax_amount: pricing.taxAmount,
          selling_price: pricing.sellingPrice,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!segRes.ok) {
        const errText = await segRes.text();
        throw new Error(`Failed to save segment ${sIdx + 1}: ${errText}`);
      }
    }
  }
}

/**
 * POST /api/portal/itineraries
 * Creates a new persisted itinerary with days and line-item segments.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      tripId,
      title,
      circuitSummary,
      startDate,
      endDate,
      durationDays,
      status = "draft",
      days = [],
    } = body;

    if (!clientId || !title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { ok: false, message: "Customer (clientId) and itinerary title are required." },
        { status: 400 }
      );
    }

    const payloadStr = JSON.stringify(body).toLowerCase();
    if (/\bluxury\b/.test(payloadStr)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Brand Tone Guardrail: Prohibited terminology detected. Use terms like premier, artisanal, bespoke, or high-touch.",
        },
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

    const createRes = await fetch(`${projectUrl}/rest/v1/workspace_itineraries`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        client_id: clientId,
        trip_id: tripId || null,
        title: title.trim(),
        circuit_summary: circuitSummary?.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        duration_days: Number(durationDays) || Math.max(1, days.length),
        status,
        current_version: "v1.0",
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to create itinerary: ${errText}` },
        { status: 502 }
      );
    }

    const [created] = await createRes.json();
    if (Array.isArray(days) && days.length > 0) {
      await insertDaysAndSegments(projectUrl, headers, created.id, days);
    }

    return NextResponse.json({
      ok: true,
      itineraryId: created.id,
      message: `Itinerary "${created.title}" saved to database.`,
    });
  } catch (err: any) {
    console.error("Itineraries POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to create itinerary." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portal/itineraries
 * Updates itinerary metadata and atomically replaces days & segments.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      circuitSummary,
      startDate,
      endDate,
      durationDays,
      status,
      tripId,
      days,
    } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Itinerary ID is required." },
        { status: 400 }
      );
    }

    const payloadStr = JSON.stringify(body).toLowerCase();
    if (/\bluxury\b/.test(payloadStr)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Brand Tone Guardrail: Prohibited terminology detected. Use terms like premier, artisanal, bespoke, or high-touch.",
        },
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

    const patchBody: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) patchBody.title = title.trim();
    if (circuitSummary !== undefined) patchBody.circuit_summary = circuitSummary?.trim() || null;
    if (startDate !== undefined) patchBody.start_date = startDate || null;
    if (endDate !== undefined) patchBody.end_date = endDate || null;
    if (durationDays !== undefined) patchBody.duration_days = Number(durationDays) || 1;
    if (status !== undefined) patchBody.status = status;
    if (tripId !== undefined) patchBody.trip_id = tripId || null;

    const patchRes = await fetch(
      `${projectUrl}/rest/v1/workspace_itineraries?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(patchBody),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to update itinerary: ${errText}` },
        { status: 502 }
      );
    }

    if (Array.isArray(days)) {
      // Clear existing days (cascades to segments) and re-insert
      await fetch(
        `${projectUrl}/rest/v1/workspace_itinerary_days?itinerary_id=eq.${encodeURIComponent(id)}`,
        { method: "DELETE", headers, signal: AbortSignal.timeout(6000) }
      );
      if (days.length > 0) {
        await insertDaysAndSegments(projectUrl, headers, id, days);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Itinerary and schedule updated in database.",
    });
  } catch (err: any) {
    console.error("Itineraries PATCH error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to update itinerary." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portal/itineraries?id=...
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, message: "Itinerary ID is required." }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json(
        { ok: false, message: "Database configuration missing." },
        { status: 500 }
      );
    }

    const { projectUrl, secretKey } = config;
    const res = await fetch(
      `${projectUrl}/rest/v1/workspace_itineraries?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to delete itinerary: ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, message: "Itinerary deleted." });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to delete itinerary." },
      { status: 500 }
    );
  }
}
