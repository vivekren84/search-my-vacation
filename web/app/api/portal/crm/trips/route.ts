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
      callerRole === "super_admin" ||
      callerRole === "administrator" ||
      callerRole === "privilege_user";

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

    return NextResponse.json({
      ok: true,
      trips: filtered,
      staffOptions: staffList.map((s) => ({
        userId: s.user_id,
        displayName: s.display_name,
        role: s.role,
      })),
    });
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

const VALID_DEAL_STAGES = new Set(["Enquiry", "In Progress", "Booked/Won", "Lost", "On Hold"]);
const VALID_PAYMENT_STATUSES = new Set(["To Start", "In Progress", "Won", "Lost", "On Hold"]);
const VALID_TRIP_STATUSES = new Set(["To Start", "In Progress", "Complete", "Lost", "On Hold"]);
const VALID_PARTY_TYPES = new Set(["Solo", "Family", "Group", "Corporate", "Other"]);
const DIRECT_FINANCIAL_ROLES = new Set(["super_admin", "administrator", "privilege_user"]);

/**
 * PATCH /api/portal/crm/trips
 * Updates an existing trip deal's operational details and financials.
 * - super_admin, administrator, privilege_user: direct financial & operational updates.
 * - desk_user: operational updates save directly; financial changes create a Pending Approval
 *   in workspace_trip_financial_approvals for single-concurrence review.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      destination,
      travelYear,
      travelMonth,
      durationLabel,
      nights,
      travelPartyType,
      paxAdults,
      paxChildren,
      dealStage,
      paymentStatus,
      tripStatus,
      bookedProperties,
      bookedTransport,
      leadOwnerId,
      notes,
      quotePrice,
      actualCost,
      preTaxAmount,
      gstAmount,
      profit,
      financialJustification,
      callerEmail,
      callerName,
      callerRole,
    } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { ok: false, message: "Trip ID is required for updates." },
        { status: 400 }
      );
    }

    if (destination !== undefined && (!destination || typeof destination !== "string" || !destination.trim())) {
      return NextResponse.json(
        { ok: false, message: "Trip destination cannot be empty." },
        { status: 400 }
      );
    }

    if (dealStage && !VALID_DEAL_STAGES.has(dealStage)) {
      return NextResponse.json({ ok: false, message: `Invalid deal stage: ${dealStage}` }, { status: 400 });
    }
    if (paymentStatus && !VALID_PAYMENT_STATUSES.has(paymentStatus)) {
      return NextResponse.json({ ok: false, message: `Invalid payment status: ${paymentStatus}` }, { status: 400 });
    }
    if (tripStatus && !VALID_TRIP_STATUSES.has(tripStatus)) {
      return NextResponse.json({ ok: false, message: `Invalid trip status: ${tripStatus}` }, { status: 400 });
    }
    if (travelPartyType && !VALID_PARTY_TYPES.has(travelPartyType)) {
      return NextResponse.json({ ok: false, message: `Invalid travel party type: ${travelPartyType}` }, { status: 400 });
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

    // Fetch existing trip row
    const existingRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}&select=*`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    if (!existingRes.ok) {
      return NextResponse.json({ ok: false, message: "Failed to locate trip record." }, { status: 502 });
    }
    const existingRows: any[] = await existingRes.json();
    if (!existingRows || existingRows.length === 0) {
      return NextResponse.json({ ok: false, message: "Trip record not found." }, { status: 404 });
    }
    const existingTrip = existingRows[0];

    // Verify caller role against workspace_users when email is provided
    const resolvedEmail = (request.headers.get("x-staff-email") || callerEmail || "").toLowerCase().trim();
    let effectiveRole = (request.headers.get("x-staff-role") || callerRole || "desk_user").toLowerCase().trim();
    let resolvedUserId: string | null = null;
    let resolvedName: string | null = callerName || null;

    if (resolvedEmail === "vivek@searchmyvacation.com") {
      effectiveRole = "super_admin";
      resolvedName = resolvedName || "Vivek Renganathan";
    } else if (resolvedEmail) {
      try {
        const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
          headers,
          signal: AbortSignal.timeout(5000),
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          const match = (authData.users || []).find(
            (u: any) => u.email?.toLowerCase().trim() === resolvedEmail
          );
          if (match) {
            resolvedUserId = match.id;
            const wuRes = await fetch(
              `${projectUrl}/rest/v1/workspace_users?user_id=eq.${match.id}&select=role,display_name`,
              { headers, signal: AbortSignal.timeout(5000) }
            );
            if (wuRes.ok) {
              const wuRows = await wuRes.json();
              if (wuRows?.[0]) {
                effectiveRole = (wuRows[0].role || effectiveRole).toLowerCase().trim();
                resolvedName = wuRows[0].display_name || resolvedName;
              }
            }
          }
        }
      } catch {}
    }

    const nowIso = new Date().toISOString();
    const tripPatch: Record<string, any> = { updated_at: nowIso };

    if (destination !== undefined) tripPatch.destination = destination.trim();
    if (travelYear !== undefined) tripPatch.travel_year = Number(travelYear) || existingTrip.travel_year;
    if (travelMonth !== undefined) tripPatch.travel_month = travelMonth?.trim() || null;
    if (durationLabel !== undefined) tripPatch.duration_label = durationLabel?.trim() || null;
    if (nights !== undefined) tripPatch.nights = Number(nights) || 0;
    if (travelPartyType !== undefined) tripPatch.travel_party_type = travelPartyType;
    if (paxAdults !== undefined) tripPatch.pax_adults = Math.max(1, Number(paxAdults) || 1);
    if (paxChildren !== undefined) tripPatch.pax_children = Math.max(0, Number(paxChildren) || 0);
    if (dealStage !== undefined) tripPatch.deal_stage = dealStage;
    if (paymentStatus !== undefined) tripPatch.payment_status = paymentStatus;
    if (tripStatus !== undefined) tripPatch.trip_status = tripStatus;
    if (bookedProperties !== undefined) tripPatch.booked_properties = bookedProperties?.trim() || null;
    if (bookedTransport !== undefined) tripPatch.booked_transport = bookedTransport?.trim() || null;
    if (notes !== undefined) tripPatch.notes = notes?.trim() || null;
    if (leadOwnerId !== undefined) tripPatch.lead_owner_id = leadOwnerId || null;

    // Check if financials were included and changed
    const hasFinancialPayload =
      quotePrice !== undefined ||
      actualCost !== undefined ||
      preTaxAmount !== undefined ||
      gstAmount !== undefined ||
      profit !== undefined;

    const nextQuote = quotePrice !== undefined ? Number(quotePrice) || 0 : Number(existingTrip.quote_price || 0);
    const nextCost = actualCost !== undefined ? Number(actualCost) || 0 : Number(existingTrip.actual_cost || 0);
    const nextPreTax = preTaxAmount !== undefined ? Number(preTaxAmount) || 0 : Number(existingTrip.pre_tax_amount || 0);
    const nextGst = gstAmount !== undefined ? Number(gstAmount) || 0 : Number(existingTrip.gst_amount || 0);
    const nextProfit = profit !== undefined ? Number(profit) || 0 : Number(existingTrip.profit || 0);

    const financialsChanged =
      hasFinancialPayload &&
      (nextQuote !== Number(existingTrip.quote_price || 0) ||
        nextCost !== Number(existingTrip.actual_cost || 0) ||
        nextPreTax !== Number(existingTrip.pre_tax_amount || 0) ||
        nextGst !== Number(existingTrip.gst_amount || 0) ||
        nextProfit !== Number(existingTrip.profit || 0));

    let pendingFinancialApproval = false;

    if (DIRECT_FINANCIAL_ROLES.has(effectiveRole)) {
      if (quotePrice !== undefined) tripPatch.quote_price = nextQuote;
      if (actualCost !== undefined) tripPatch.actual_cost = nextCost;
      if (preTaxAmount !== undefined) tripPatch.pre_tax_amount = nextPreTax;
      if (gstAmount !== undefined) tripPatch.gst_amount = nextGst;
      if (profit !== undefined) tripPatch.profit = nextProfit;
    } else if (financialsChanged) {
      // desk_user financial proposal -> route to Pending Approval Queue
      pendingFinancialApproval = true;

      // Supersede any existing pending proposal for this trip
      await fetch(
        `${projectUrl}/rest/v1/workspace_trip_financial_approvals?trip_id=eq.${encodeURIComponent(id)}&status=eq.pending`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: "superseded", updated_at: nowIso }),
          signal: AbortSignal.timeout(5000),
        }
      );

      const approvalRes = await fetch(`${projectUrl}/rest/v1/workspace_trip_financial_approvals`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          trip_id: id,
          deal_reference_id: existingTrip.deal_reference_id,
          requested_by_user_id: resolvedUserId,
          requested_by_email: resolvedEmail || "desk@searchmyvacation.com",
          requested_by_name: resolvedName || resolvedEmail || "Desk User",
          proposed_quote_price: nextQuote,
          proposed_actual_cost: nextCost,
          proposed_pre_tax_amount: nextPreTax,
          proposed_gst_amount: nextGst,
          proposed_profit: nextProfit,
          previous_quote_price: Number(existingTrip.quote_price || 0),
          previous_actual_cost: Number(existingTrip.actual_cost || 0),
          previous_profit: Number(existingTrip.profit || 0),
          justification: financialJustification?.trim() || "Financial update submitted for approval",
          status: "pending",
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!approvalRes.ok) {
        const errText = await approvalRes.text();
        return NextResponse.json(
          { ok: false, message: `Failed to submit financial approval request: ${errText}` },
          { status: 502 }
        );
      }
    }

    const patchRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(tripPatch),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to update trip: ${errText}` },
        { status: 502 }
      );
    }

    const updatedRows = await patchRes.json();
    const updatedTrip = updatedRows[0] || existingTrip;

    return NextResponse.json({
      ok: true,
      trip: updatedTrip,
      pendingFinancialApproval,
      message: pendingFinancialApproval
        ? `Trip ${existingTrip.deal_reference_id} operational details saved. Financial changes submitted to the Privilege/Admin approval queue.`
        : `Trip ${existingTrip.deal_reference_id} updated successfully.`,
    });
  } catch (err: any) {
    console.error("Trips PATCH error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to update trip." },
      { status: 500 }
    );
  }
}
