import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/portal/crm/trips
 * Returns trip deals joined with customer details and financial governance
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim().toLowerCase();
    const stage = searchParams.get("stage")?.trim();
    const channel = searchParams.get("channel")?.trim();
    const callerRole = searchParams.get("role")?.trim() || "desk_user";

    const isFinancialAuthorized =
      callerRole === "super_admin" || callerRole === "administrator";

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

    // 1. Fetch Trips
    let tripsUrl = `${projectUrl}/rest/v1/workspace_trips?select=*&order=created_at.desc`;
    if (stage) tripsUrl += `&deal_stage=eq.${encodeURIComponent(stage)}`;
    if (channel) tripsUrl += `&deal_channel=eq.${encodeURIComponent(channel)}`;

    const tripsRes = await fetch(tripsUrl, {
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (!tripsRes.ok) {
      const errText = await tripsRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to query trips: ${errText}` },
        { status: 502 }
      );
    }

    const trips: any[] = await tripsRes.json();

    // 2. Fetch Customers to join
    const custRes = await fetch(`${projectUrl}/rest/v1/workspace_customers?select=*`, {
      headers,
      signal: AbortSignal.timeout(6000),
    });
    const customers: any[] = custRes.ok ? await custRes.json() : [];
    const custMap = new Map<string, any>(customers.map((c) => [c.id, c]));

    // 3. Fetch Staff users to join lead owners
    const staffRes = await fetch(
      `${projectUrl}/rest/v1/workspace_users?select=user_id,display_name,role`,
      { headers, signal: AbortSignal.timeout(6000) }
    );
    const staffList: any[] = staffRes.ok ? await staffRes.json() : [];
    const staffMap = new Map<string, any>(staffList.map((s) => [s.user_id, s]));

    const tripItems = trips.map((t) => {
      const cust = custMap.get(t.customer_id) || {};
      const staff = t.lead_owner_id ? staffMap.get(t.lead_owner_id) : null;

      const baseItem = {
        id: t.id,
        dealReferenceId: t.deal_reference_id,
        dealChannel: t.deal_channel,
        customerId: t.customer_id,
        customerCode: cust.customer_code || "—",
        customerName: cust.primary_name || "—",
        customerMobile: cust.primary_mobile || "—",
        customerEmail: cust.primary_email || "—",
        leadOwnerId: t.lead_owner_id,
        leadOwnerName: staff?.display_name || "Unassigned",
        destination: t.destination,
        travelYear: t.travel_year,
        travelMonth: t.travel_month || "—",
        durationLabel: t.duration_label || "—",
        nights: t.nights || 0,
        travelPartyType: t.travel_party_type || "Family",
        paxAdults: t.pax_adults || 1,
        paxChildren: t.pax_children || 0,
        dealStage: t.deal_stage,
        paymentStatus: t.payment_status,
        tripStatus: t.trip_status,
        bookedProperties: t.booked_properties || "—",
        bookedTransport: t.booked_transport || "—",
        notes: t.notes || "",
        quotePrice: Number(t.quote_price || 0),
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      };

      // Financial columns governed by role
      if (isFinancialAuthorized) {
        return {
          ...baseItem,
          actualCost: Number(t.actual_cost || 0),
          preTaxAmount: Number(t.pre_tax_amount || 0),
          gstAmount: Number(t.gst_amount || 0),
          profit: Number(t.profit || 0),
          isFinancialRestricted: false,
        };
      } else {
        return {
          ...baseItem,
          actualCost: null,
          preTaxAmount: null,
          gstAmount: null,
          profit: null,
          isFinancialRestricted: true,
        };
      }
    });

    // Optional query filtering
    const filtered = query
      ? tripItems.filter(
          (t) =>
            t.dealReferenceId.toLowerCase().includes(query) ||
            t.destination.toLowerCase().includes(query) ||
            t.customerName.toLowerCase().includes(query) ||
            t.customerCode.toLowerCase().includes(query) ||
            t.customerMobile.includes(query)
        )
      : tripItems;

    return NextResponse.json({ ok: true, trips: filtered });
  } catch (err: any) {
    console.error("Trips GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load trips." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/crm/trips
 * Creates a new trip with atomic deal reference trigger
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      // If customerId is not passed, create/find customer
      primaryName,
      primaryMobile,
      secondaryMobile,
      primaryEmail,
      // Trip fields
      dealChannel = "DIRECT",
      destination,
      travelYear = new Date().getFullYear(),
      travelMonth,
      durationLabel,
      nights = 0,
      travelPartyType = "Family",
      paxAdults = 1,
      paxChildren = 0,
      dealStage = "Enquiry",
      paymentStatus = "To Start",
      tripStatus = "To Start",
      bookedProperties,
      bookedTransport,
      notes,
      leadOwnerId,
      // Financials
      actualCost = 0,
      quotePrice = 0,
      preTaxAmount = 0,
      gstAmount = 0,
      profit = 0,
    } = body;

    if (!destination || typeof destination !== "string" || !destination.trim()) {
      return NextResponse.json(
        { ok: false, message: "Trip destination is required." },
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

    let resolvedCustomerId = customerId;

    // 1. Resolve Customer if not provided
    if (!resolvedCustomerId) {
      if (!primaryName || typeof primaryName !== "string" || !primaryName.trim()) {
        return NextResponse.json(
          { ok: false, message: "Client primary name is required for new customer." },
          { status: 400 }
        );
      }

      // Check if customer already exists by mobile
      if (primaryMobile) {
        const findCustRes = await fetch(
          `${projectUrl}/rest/v1/workspace_customers?primary_mobile=eq.${encodeURIComponent(
            primaryMobile.trim()
          )}&select=id`,
          { headers }
        );
        if (findCustRes.ok) {
          const found = await findCustRes.json();
          if (found && found.length > 0) {
            resolvedCustomerId = found[0].id;
          }
        }
      }

      // If still not resolved, insert new customer
      if (!resolvedCustomerId) {
        const createCustRes = await fetch(`${projectUrl}/rest/v1/workspace_customers`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            primary_name: primaryName.trim(),
            primary_mobile: primaryMobile?.trim() || null,
            secondary_mobile: secondaryMobile?.trim() || null,
            primary_email: primaryEmail?.trim() || null,
          }),
        });

        if (!createCustRes.ok) {
          const errText = await createCustRes.text();
          return NextResponse.json(
            { ok: false, message: `Failed to create customer: ${errText}` },
            { status: 500 }
          );
        }

        const [newCust] = await createCustRes.json();
        resolvedCustomerId = newCust.id;
      }
    }

    // 2. Insert Trip without deal_reference_id (trigger auto-generates DDSMV-YY-XXX / VDSMV-YY-XXX)
    const tripPayload: Record<string, any> = {
      customer_id: resolvedCustomerId,
      deal_channel: dealChannel === "VENDOR" ? "VENDOR" : "DIRECT",
      destination: destination.trim(),
      travel_year: Number(travelYear),
      travel_month: travelMonth?.trim() || null,
      duration_label: durationLabel?.trim() || null,
      nights: Number(nights) || 0,
      travel_party_type: travelPartyType,
      pax_adults: Number(paxAdults) || 1,
      pax_children: Number(paxChildren) || 0,
      deal_stage: dealStage,
      payment_status: paymentStatus,
      trip_status: tripStatus,
      booked_properties: bookedProperties?.trim() || null,
      booked_transport: bookedTransport?.trim() || null,
      notes: notes?.trim() || null,
      actual_cost: Number(actualCost) || 0,
      quote_price: Number(quotePrice) || 0,
      pre_tax_amount: Number(preTaxAmount) || 0,
      gst_amount: Number(gstAmount) || 0,
      profit: Number(profit) || 0,
    };

    if (leadOwnerId) {
      tripPayload.lead_owner_id = leadOwnerId;
    }

    const createTripRes = await fetch(`${projectUrl}/rest/v1/workspace_trips`, {
      method: "POST",
      headers,
      body: JSON.stringify(tripPayload),
    });

    if (!createTripRes.ok) {
      const errText = await createTripRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to create trip: ${errText}` },
        { status: 500 }
      );
    }

    const [createdTrip] = await createTripRes.json();

    return NextResponse.json({
      ok: true,
      trip: createdTrip,
      dealReferenceId: createdTrip.deal_reference_id,
      message: `Trip deal ${createdTrip.deal_reference_id} successfully cataloged and linked.`,
    });
  } catch (err: any) {
    console.error("Trips POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to create trip deal." },
      { status: 500 }
    );
  }
}
