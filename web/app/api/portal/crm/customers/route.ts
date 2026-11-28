import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/portal/crm/customers
 * Returns customer master list with linked trips count
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim().toLowerCase();

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

    // 1. Fetch Customers
    const custRes = await fetch(
      `${projectUrl}/rest/v1/workspace_customers?select=*&order=created_at.desc`,
      { headers, signal: AbortSignal.timeout(6000) }
    );

    if (!custRes.ok) {
      const errText = await custRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to query customers: ${errText}` },
        { status: 502 }
      );
    }

    const customers: any[] = await custRes.json();

    // 2. Fetch Trips for count & summary
    const tripsRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trips?select=id,customer_id,deal_reference_id,destination,travel_year,deal_stage,payment_status,trip_status,quote_price&order=travel_year.desc`,
      { headers, signal: AbortSignal.timeout(6000) }
    );

    const trips: any[] = tripsRes.ok ? await tripsRes.json() : [];

    // Map trips by customer_id
    const tripsByCust = new Map<string, any[]>();
    for (const t of trips) {
      if (!tripsByCust.has(t.customer_id)) {
        tripsByCust.set(t.customer_id, []);
      }
      tripsByCust.get(t.customer_id)!.push(t);
    }

    const customerItems = customers.map((c) => {
      const custTrips = tripsByCust.get(c.id) || [];
      return {
        id: c.id,
        customerCode: c.customer_code,
        primaryName: c.primary_name,
        primaryMobile: c.primary_mobile,
        secondaryMobile: c.secondary_mobile,
        primaryEmail: c.primary_email,
        contacts: Array.isArray(c.contacts) ? c.contacts : [],
        zohoSynced: c.zoho_synced,
        needsContactEnrichment: c.needs_contact_enrichment,
        tripsCount: custTrips.length,
        recentTrips: custTrips.slice(0, 3).map((t) => ({
          dealReferenceId: t.deal_reference_id,
          destination: t.destination,
          travelYear: t.travel_year,
          dealStage: t.deal_stage,
          paymentStatus: t.payment_status,
          tripStatus: t.trip_status,
        })),
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };
    });

    // Optional query filtering
    const filtered = query
      ? customerItems.filter(
          (c) =>
            c.primaryName.toLowerCase().includes(query) ||
            c.customerCode.toLowerCase().includes(query) ||
            (c.primaryMobile && c.primaryMobile.includes(query)) ||
            (c.secondaryMobile && c.secondaryMobile.includes(query)) ||
            (c.primaryEmail && c.primaryEmail.toLowerCase().includes(query))
        )
      : customerItems;

    return NextResponse.json({ ok: true, customers: filtered });
  } catch (err: any) {
    console.error("Customers GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load customers." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portal/crm/customers
 * Updates customer master contact details (primary_name, primary_mobile, secondary_mobile, primary_email).
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      primaryName,
      primaryMobile,
      secondaryMobile,
      primaryEmail,
      contacts,
      needsContactEnrichment,
    } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { ok: false, message: "Customer ID is required for updates." },
        { status: 400 }
      );
    }

    if (!primaryName || typeof primaryName !== "string" || !primaryName.trim()) {
      return NextResponse.json(
        { ok: false, message: "Customer primary name is required." },
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

    const cleanedPrimaryMobile = primaryMobile?.trim() || null;
    const cleanedSecondaryMobile = secondaryMobile?.trim() || null;
    const cleanedEmail = primaryEmail?.trim() || null;
    const cleanedContacts = Array.isArray(contacts) ? contacts.slice(0, 2) : undefined;

    const patchPayload: Record<string, any> = {
      primary_name: primaryName.trim(),
      primary_mobile: cleanedPrimaryMobile,
      secondary_mobile: cleanedSecondaryMobile,
      primary_email: cleanedEmail,
      ...(cleanedContacts !== undefined ? { contacts: cleanedContacts } : {}),
      updated_at: new Date().toISOString(),
    };

    if (typeof needsContactEnrichment === "boolean") {
      patchPayload.needs_contact_enrichment = needsContactEnrichment;
    } else if (cleanedPrimaryMobile || cleanedEmail) {
      patchPayload.needs_contact_enrichment = false;
    }

    const res = await fetch(
      `${projectUrl}/rest/v1/workspace_customers?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(patchPayload),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 409 || errText.includes("23505") || errText.includes("idx_workspace_customers_primary_mobile")) {
        return NextResponse.json(
          {
            ok: false,
            message: "Another customer profile already uses this primary mobile number.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { ok: false, message: `Failed to update customer: ${errText}` },
        { status: 502 }
      );
    }

    const updated = await res.json();
    return NextResponse.json({
      ok: true,
      customer: updated[0] || null,
      message: "Customer master dossier updated successfully.",
    });
  } catch (err: any) {
    console.error("Customers PATCH error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to update customer." },
      { status: 500 }
    );
  }
}
