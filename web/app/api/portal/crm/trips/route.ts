import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import {
  ADMIN_ONLY_ROLES,
  DIRECT_FINANCIAL_ROLES,
  getAdminHeaders,
  hasProhibitedBrandTerm,
  logTripEvent,
  resolveStaffCaller,
} from "@/lib/portal/trip-helpers";
import { normalizeDestinationServer } from "@/lib/portal/destination-normalize";

export const runtime = "nodejs";

const VALID_DEAL_STAGES = new Set([
  "Enquiry",
  "In Progress",
  "Booked/Won",
  "Lost",
  "On Hold",
  "Cancelled",
]);
const VALID_PAYMENT_STATUSES = new Set([
  "To Start",
  "In Progress",
  "Won",
  "Lost",
  "On Hold",
  "Cancelled",
]);
const VALID_TRIP_STATUSES = new Set([
  "To Start",
  "In Progress",
  "Complete",
  "Lost",
  "On Hold",
  "Cancelled",
]);
const VALID_PARTY_TYPES = new Set(["Solo", "Family", "Group", "Corporate", "Other"]);

function countChecklistReady(checklist: Record<string, any> | null | undefined): number {
  if (!checklist || typeof checklist !== "object") return 0;
  const keys = [
    "stays_confirmed",
    "transport_assigned",
    "roster_verified",
    "itinerary_exported",
    "payment_settled",
    "voucher_published",
  ];
  return keys.filter((k) => Boolean(checklist[k])).length;
}

/**
 * GET /api/portal/crm/trips
 * Returns trip deals joined with customer details, payment balances, readiness, and financial governance.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim().toLowerCase();
    const stage = searchParams.get("stage")?.trim();
    const channel = searchParams.get("channel")?.trim();
    const includeArchived = searchParams.get("includeArchived") === "true";
    const callerRole = searchParams.get("role")?.trim() || "desk_user";

    const isFinancialAuthorized = DIRECT_FINANCIAL_ROLES.has(callerRole.toLowerCase());

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json(
        { ok: false, message: "Database configuration missing." },
        { status: 500 }
      );
    }

    const { projectUrl, secretKey } = config;
    const headers = getAdminHeaders(secretKey);

    let tripsUrl = `${projectUrl}/rest/v1/workspace_trips?select=*&order=created_at.desc`;
    if (!includeArchived) tripsUrl += `&is_archived=eq.false`;
    if (stage) tripsUrl += `&deal_stage=eq.${encodeURIComponent(stage)}`;
    if (channel) tripsUrl += `&deal_channel=eq.${encodeURIComponent(channel)}`;

    const [tripsRes, custRes, staffRes, payRes, bookRes] = await Promise.all([
      fetch(tripsUrl, { headers, signal: AbortSignal.timeout(6000) }),
      fetch(`${projectUrl}/rest/v1/workspace_customers?select=*`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_users?select=user_id,display_name,role`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(
        `${projectUrl}/rest/v1/workspace_trip_payments?select=trip_id,amount_inr,verification_status`,
        { headers, signal: AbortSignal.timeout(6000) }
      ),
      fetch(`${projectUrl}/rest/v1/workspace_trip_bookings?select=trip_id,booking_status`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    if (!tripsRes.ok) {
      const errText = await tripsRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to query trips: ${errText}` },
        { status: 502 }
      );
    }

    const trips: any[] = await tripsRes.json();
    const customers: any[] = custRes.ok ? await custRes.json() : [];
    const staffList: any[] = staffRes.ok ? await staffRes.json() : [];
    const payments: any[] = payRes.ok ? await payRes.json() : [];
    const bookings: any[] = bookRes.ok ? await bookRes.json() : [];

    const custMap = new Map<string, any>(customers.map((c) => [c.id, c]));
    const staffMap = new Map<string, any>(staffList.map((s) => [s.user_id, s]));

    const payByTrip = new Map<string, { verified: number; pending: number }>();
    for (const p of payments) {
      const cur = payByTrip.get(p.trip_id) || { verified: 0, pending: 0 };
      const amt = Number(p.amount_inr || 0);
      if (p.verification_status === "Verified") cur.verified += amt;
      else if (p.verification_status === "Pending Verification") cur.pending += amt;
      payByTrip.set(p.trip_id, cur);
    }

    const bookingsCountByTrip = new Map<string, number>();
    for (const b of bookings) {
      if (b.booking_status !== "Cancelled") {
        bookingsCountByTrip.set(b.trip_id, (bookingsCountByTrip.get(b.trip_id) || 0) + 1);
      }
    }

    const tripItems = trips.map((t) => {
      const cust = custMap.get(t.customer_id) || {};
      const staff = t.lead_owner_id ? staffMap.get(t.lead_owner_id) : null;
      const paySummary = payByTrip.get(t.id) || { verified: 0, pending: 0 };
      const quotePrice = Number(t.quote_price || 0);
      const balanceDue = Math.max(0, quotePrice - paySummary.verified);

      const baseItem = {
        id: t.id,
        dealReferenceId: t.deal_reference_id,
        dealChannel: t.deal_channel,
        tripScope: t.trip_scope || "Domestic",
        leadSource: t.lead_source || null,
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
        startDate: t.start_date || null,
        endDate: t.end_date || null,
        durationLabel: t.duration_label || "—",
        nights: t.nights || 0,
        travelPartyType: t.travel_party_type || "Family",
        paxAdults: t.pax_adults || 1,
        paxChildren: t.pax_children || 0,
        dealStage: t.deal_stage,
        paymentStatus: t.payment_status,
        tripStatus: t.trip_status,
        holdReason: t.hold_reason || null,
        lossReason: t.loss_reason || null,
        cancellationReason: t.cancellation_reason || null,
        cancellationDate: t.cancellation_date || null,
        cancellationFee: Number(t.cancellation_fee || 0),
        refundAmount: Number(t.refund_amount || 0),
        followUpDate: t.follow_up_date || null,
        clonedFromTripId: t.cloned_from_trip_id || null,
        readinessChecklist: t.readiness_checklist || {
          stays_confirmed: false,
          transport_assigned: false,
          roster_verified: false,
          itinerary_exported: false,
          payment_settled: false,
          voucher_published: false,
        },
        readinessCount: countChecklistReady(t.readiness_checklist),
        pinnedNotes: Array.isArray(t.pinned_notes) ? t.pinned_notes : [],
        isArchived: Boolean(t.is_archived),
        voucherPublishedAt: t.voucher_published_at || null,
        voucherPayload: t.voucher_payload || null,
        bookedProperties: t.booked_properties || "—",
        bookedTransport: t.booked_transport || "—",
        notes: t.notes || "",
        quotePrice,
        verifiedPaidAmount: paySummary.verified,
        pendingPaidAmount: paySummary.pending,
        balanceDue,
        bookingsCount: bookingsCountByTrip.get(t.id) || 0,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      };

      if (isFinancialAuthorized) {
        return {
          ...baseItem,
          actualCost: Number(t.actual_cost || 0),
          preTaxAmount: Number(t.pre_tax_amount || 0),
          gstAmount: Number(t.gst_amount || 0),
          profit: Number(t.profit || 0),
          isFinancialRestricted: false,
        };
      }
      return {
        ...baseItem,
        actualCost: null,
        preTaxAmount: null,
        gstAmount: null,
        profit: null,
        isFinancialRestricted: true,
      };
    });

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
 * Creates a new journey atomically via create_journey_with_optional_customer RPC.
 * Rejects manual dealReferenceId / customerCode and enforces Brand Tone + E.164 duplicate check (409).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.dealReferenceId !== undefined || body.deal_reference_id !== undefined || body.customerCode !== undefined || body.customer_code !== undefined) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "System Integrity Guardrail: deal_reference_id and customer_code are auto-sequenced and cannot be manually supplied.",
        },
        { status: 400 }
      );
    }

    if (hasProhibitedBrandTerm(body)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Brand Tone Guardrail: Prohibited terminology detected. Use terms like premier, artisanal, bespoke, or high-touch.",
        },
        { status: 400 }
      );
    }

    const {
      customerId,
      primaryName,
      primaryMobile,
      primaryEmail,
      dealChannel = "DIRECT",
      tripScope = "Domestic",
      destination,
      travelYear = new Date().getFullYear(),
      travelMonth,
      startDate,
      endDate,
      durationLabel,
      nights = 0,
      travelPartyType = "Family",
      paxAdults = 1,
      paxChildren = 0,
      leadSource,
      leadOwnerId,
      notes,
      quotePrice = 0,
      actualCost = 0,
      preTaxAmount = 0,
      gstAmount = 0,
      profit = 0,
      clonedFromTripId,
      callerEmail,
      callerName,
      callerRole,
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

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const { projectUrl, secretKey } = config;
    const headers = getAdminHeaders(secretKey);

    const normalizedDestination = await normalizeDestinationServer(destination, projectUrl, secretKey, {
      allowTitleCaseUnlisted: true,
    });

    const rpcPayload = {
      p_customer_id: customerId || null,
      p_primary_name: primaryName?.trim() || null,
      p_primary_mobile: primaryMobile?.trim() || null,
      p_primary_email: primaryEmail?.trim() || null,
      p_deal_channel: dealChannel === "VENDOR" ? "VENDOR" : "DIRECT",
      p_trip_scope: tripScope === "International" ? "International" : "Domestic",
      p_destination: normalizedDestination,
      p_travel_year: Number(travelYear) || new Date().getFullYear(),
      p_travel_month: travelMonth?.trim() || null,
      p_start_date: startDate?.trim() || null,
      p_end_date: endDate?.trim() || null,
      p_duration_label: durationLabel?.trim() || null,
      p_nights: Number(nights) || 0,
      p_travel_party_type: travelPartyType || "Family",
      p_pax_adults: Math.max(1, Number(paxAdults) || 1),
      p_pax_children: Math.max(0, Number(paxChildren) || 0),
      p_lead_source: leadSource?.trim() || null,
      p_lead_owner_id: leadOwnerId || caller.userId || null,
      p_notes: notes?.trim() || null,
      p_actor_id: caller.userId || null,
      p_actor_name: caller.displayName,
      p_quote_price: DIRECT_FINANCIAL_ROLES.has(caller.role) ? Number(quotePrice) || 0 : 0,
      p_actual_cost: DIRECT_FINANCIAL_ROLES.has(caller.role) ? Number(actualCost) || 0 : 0,
      p_pre_tax_amount: DIRECT_FINANCIAL_ROLES.has(caller.role) ? Number(preTaxAmount) || 0 : 0,
      p_gst_amount: DIRECT_FINANCIAL_ROLES.has(caller.role) ? Number(gstAmount) || 0 : 0,
      p_profit: DIRECT_FINANCIAL_ROLES.has(caller.role) ? Number(profit) || 0 : 0,
      p_cloned_from_trip_id: clonedFromTripId || null,
    };

    const rpcRes = await fetch(
      `${projectUrl}/rest/v1/rpc/create_journey_with_optional_customer`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(rpcPayload),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!rpcRes.ok) {
      const errBody = await rpcRes.json().catch(() => ({ message: "RPC failed" }));
      const msg = String(errBody.message || errBody.details || "");
      if (msg.includes("DUPLICATE_CUSTOMER:")) {
        const parts = msg.split("DUPLICATE_CUSTOMER:")[1].split(":");
        return NextResponse.json(
          {
            ok: false,
            duplicateCustomer: {
              id: parts[0],
              customerCode: parts[1],
              primaryName: parts[2],
            },
            message: `Customer ${parts[2]} (${parts[1]}) already exists with this mobile number. Link the journey to them instead.`,
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { ok: false, message: msg || "Failed to create journey." },
        { status: 400 }
      );
    }

    const result = await rpcRes.json();

    return NextResponse.json({
      ok: true,
      tripId: result.trip_id,
      dealReferenceId: result.deal_reference_id,
      customerId: result.customer_id,
      message: `Journey ${result.deal_reference_id} initiated and linked.`,
    });
  } catch (err: any) {
    console.error("Trips POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to create trip deal." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portal/crm/trips
 * Updates an existing trip deal with R1.5.4 Stage-Gate validations, RBAC, and Audit Events.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      destination,
      tripScope,
      leadSource,
      travelYear,
      travelMonth,
      startDate,
      endDate,
      durationLabel,
      nights,
      travelPartyType,
      paxAdults,
      paxChildren,
      dealStage,
      paymentStatus,
      tripStatus,
      holdReason,
      lossReason,
      cancellationReason,
      cancellationDate,
      cancellationFee,
      refundAmount,
      followUpDate,
      readinessChecklist,
      pinnedNotes,
      isArchived,
      reopenReason,
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

    if (hasProhibitedBrandTerm(body)) {
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
    const headers = getAdminHeaders(secretKey, { Prefer: "return=representation" });

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

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const effectiveRole = caller.role;
    const nowIso = new Date().toISOString();
    const tripPatch: Record<string, any> = { updated_at: nowIso };

    // Soft-Archive RBAC (super_admin / administrator only)
    if (isArchived !== undefined && Boolean(isArchived) !== Boolean(existingTrip.is_archived)) {
      if (!ADMIN_ONLY_ROLES.has(effectiveRole)) {
        return NextResponse.json(
          { ok: false, message: "Permission Denied: Only Administrators or Super Admin can archive journeys." },
          { status: 403 }
        );
      }
      tripPatch.is_archived = Boolean(isArchived);
      tripPatch.archived_at = isArchived ? nowIso : null;
    }

    if (destination !== undefined) {
      tripPatch.destination = await normalizeDestinationServer(destination, projectUrl, secretKey, {
        allowTitleCaseUnlisted: true,
      });
    }
    if (tripScope !== undefined) tripPatch.trip_scope = tripScope === "International" ? "International" : "Domestic";
    if (leadSource !== undefined) tripPatch.lead_source = leadSource?.trim() || null;
    if (travelYear !== undefined) tripPatch.travel_year = Number(travelYear) || existingTrip.travel_year;
    if (travelMonth !== undefined) tripPatch.travel_month = travelMonth?.trim() || null;

    // Date update RBAC for active in-flight trips
    if (startDate !== undefined || endDate !== undefined) {
      const nextStart = startDate ? String(startDate).trim() : null;
      const nextEnd = endDate ? String(endDate).trim() : null;
      const datesChanged =
        nextStart !== (existingTrip.start_date || null) ||
        nextEnd !== (existingTrip.end_date || null);

      if (datesChanged) {
        const todayIso = new Date().toISOString().slice(0, 10);
        const isTripActiveNow =
          existingTrip.trip_status === "In Progress" ||
          (existingTrip.deal_stage === "Booked/Won" &&
            Boolean(existingTrip.start_date) &&
            Boolean(existingTrip.end_date) &&
            todayIso >= existingTrip.start_date &&
            todayIso <= existingTrip.end_date);

        if (isTripActiveNow && effectiveRole !== "super_admin") {
          return NextResponse.json(
            {
              ok: false,
              message:
                "Governance Lock: Travel dates on an active in-flight journey can only be modified by the Super Admin.",
            },
            { status: 403 }
          );
        }

        if (startDate !== undefined) tripPatch.start_date = nextStart;
        if (endDate !== undefined) tripPatch.end_date = nextEnd;
      }
    }

    if (durationLabel !== undefined) tripPatch.duration_label = durationLabel?.trim() || null;
    if (nights !== undefined) tripPatch.nights = Number(nights) || 0;
    if (travelPartyType !== undefined) tripPatch.travel_party_type = travelPartyType;
    if (paxAdults !== undefined) tripPatch.pax_adults = Math.max(1, Number(paxAdults) || 1);
    if (paxChildren !== undefined) tripPatch.pax_children = Math.max(0, Number(paxChildren) || 0);
    if (bookedProperties !== undefined) tripPatch.booked_properties = bookedProperties?.trim() || null;
    if (bookedTransport !== undefined) tripPatch.booked_transport = bookedTransport?.trim() || null;
    if (notes !== undefined) tripPatch.notes = notes?.trim() || null;
    if (leadOwnerId !== undefined && (leadOwnerId || null) !== (existingTrip.lead_owner_id || null)) {
      if (leadOwnerId) {
        const ownerCheckRes = await fetch(
          `${projectUrl}/rest/v1/workspace_users?user_id=eq.${encodeURIComponent(leadOwnerId)}&select=user_id`,
          { headers, signal: AbortSignal.timeout(4000) }
        );
        const ownerRows: any[] = ownerCheckRes.ok ? await ownerCheckRes.json() : [];
        if (!ownerRows || ownerRows.length === 0) {
          return NextResponse.json(
            {
              ok: false,
              message:
                "Selected Lead Owner is not present in workspace_users. Please refresh and re-select a valid Lead Owner or Unassigned.",
            },
            { status: 400 }
          );
        }
      }
      tripPatch.lead_owner_id = leadOwnerId || null;
    }
    if (holdReason !== undefined) tripPatch.hold_reason = holdReason?.trim() || null;
    if (lossReason !== undefined) tripPatch.loss_reason = lossReason?.trim() || null;
    if (cancellationReason !== undefined) tripPatch.cancellation_reason = cancellationReason?.trim() || null;
    if (cancellationDate !== undefined) tripPatch.cancellation_date = cancellationDate?.trim() || null;
    if (cancellationFee !== undefined) tripPatch.cancellation_fee = Number(cancellationFee) || 0;
    if (refundAmount !== undefined) tripPatch.refund_amount = Number(refundAmount) || 0;
    if (followUpDate !== undefined) tripPatch.follow_up_date = followUpDate?.trim() || null;
    if (readinessChecklist !== undefined) tripPatch.readiness_checklist = readinessChecklist;
    if (pinnedNotes !== undefined) tripPatch.pinned_notes = Array.isArray(pinnedNotes) ? pinnedNotes.slice(0, 2) : [];

    // Financials & RBAC
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

    // Stage-Gate Validations (US-154-03 & US-154-04)
    const nextStage = dealStage ?? existingTrip.deal_stage;
    const stageChanged = dealStage !== undefined && dealStage !== existingTrip.deal_stage;
    const isReopening =
      stageChanged &&
      (existingTrip.deal_stage === "Lost" || existingTrip.deal_stage === "On Hold") &&
      nextStage === "In Progress";

    if (stageChanged) {
      if (isReopening && !DIRECT_FINANCIAL_ROLES.has(effectiveRole)) {
        return NextResponse.json(
          { ok: false, message: "Permission Denied: Only Privilege User, Administrator, or Super Admin can re-open a Lost or On Hold deal." },
          { status: 403 }
        );
      }

      if (nextStage === "Booked/Won") {
        const effectiveQuote = DIRECT_FINANCIAL_ROLES.has(effectiveRole) ? nextQuote : Number(existingTrip.quote_price || 0);
        const effectiveStart = tripPatch.start_date !== undefined ? tripPatch.start_date : existingTrip.start_date;
        const effectiveMonth = tripPatch.travel_month !== undefined ? tripPatch.travel_month : existingTrip.travel_month;
        const effectiveNights = tripPatch.nights !== undefined ? tripPatch.nights : existingTrip.nights;
        const effectiveDuration = tripPatch.duration_label !== undefined ? tripPatch.duration_label : existingTrip.duration_label;

        if (effectiveQuote <= 0) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: Quote Price must be greater than ₹0 before moving to Booked/Won." },
            { status: 400 }
          );
        }
        if (!effectiveStart && !effectiveMonth) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: Confirmed travel start date or travel month is required before moving to Booked/Won." },
            { status: 400 }
          );
        }
        if (!effectiveNights && !effectiveDuration && !(tripPatch.end_date || existingTrip.end_date)) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: Travel duration / nights is required before moving to Booked/Won." },
            { status: 400 }
          );
        }
        if (!existingTrip.readiness_checklist && !readinessChecklist) {
          tripPatch.readiness_checklist = {
            stays_confirmed: false,
            transport_assigned: false,
            roster_verified: false,
            itinerary_exported: false,
            payment_settled: false,
            voucher_published: false,
          };
        }
      } else if (nextStage === "On Hold") {
        const effectiveHold = tripPatch.hold_reason ?? existingTrip.hold_reason;
        if (!effectiveHold) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: A structured Hold Reason is required to move a journey On Hold." },
            { status: 400 }
          );
        }
      } else if (nextStage === "Lost") {
        const effectiveLoss = tripPatch.loss_reason ?? existingTrip.loss_reason;
        if (!effectiveLoss) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: A structured Loss Reason is required to mark a journey Lost." },
            { status: 400 }
          );
        }
        tripPatch.payment_status = "Lost";
        tripPatch.trip_status = "Lost";
      } else if (nextStage === "Cancelled") {
        const effectiveCancel = tripPatch.cancellation_reason ?? existingTrip.cancellation_reason;
        if (!effectiveCancel) {
          return NextResponse.json(
            { ok: false, message: "Stage Gate: A Cancellation Reason is required to cancel a confirmed journey." },
            { status: 400 }
          );
        }
        tripPatch.payment_status = "Cancelled";
        tripPatch.trip_status = "Cancelled";
        if (!tripPatch.cancellation_date && !existingTrip.cancellation_date) {
          tripPatch.cancellation_date = new Date().toISOString().slice(0, 10);
        }
      }
    }

    if (dealStage !== undefined) tripPatch.deal_stage = dealStage;
    if (paymentStatus !== undefined && !tripPatch.payment_status) tripPatch.payment_status = paymentStatus;
    if (tripStatus !== undefined && !tripPatch.trip_status) tripPatch.trip_status = tripStatus;

    let pendingFinancialApproval = false;

    if (DIRECT_FINANCIAL_ROLES.has(effectiveRole)) {
      if (quotePrice !== undefined) tripPatch.quote_price = nextQuote;
      if (actualCost !== undefined) tripPatch.actual_cost = nextCost;
      if (preTaxAmount !== undefined) tripPatch.pre_tax_amount = nextPreTax;
      if (gstAmount !== undefined) tripPatch.gst_amount = nextGst;
      if (profit !== undefined) tripPatch.profit = nextProfit;
    } else if (financialsChanged) {
      pendingFinancialApproval = true;
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
          requested_by_user_id: caller.userId,
          requested_by_email: caller.email || "desk@searchmyvacation.com",
          requested_by_name: caller.displayName,
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

    // Emit immutable audit events
    if (stageChanged) {
      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: isReopening ? "STAGE_REOPENED" : nextStage === "Cancelled" ? "CANCELLED" : "STAGE_CHANGED",
        previousState: { deal_stage: existingTrip.deal_stage, trip_status: existingTrip.trip_status },
        newState: { deal_stage: updatedTrip.deal_stage, trip_status: updatedTrip.trip_status },
        reasonCode:
          nextStage === "On Hold"
            ? updatedTrip.hold_reason
            : nextStage === "Lost"
            ? updatedTrip.loss_reason
            : nextStage === "Cancelled"
            ? updatedTrip.cancellation_reason
            : null,
        comment:
          reopenReason?.trim() ||
          notes?.trim() ||
          `Stage transitioned from ${existingTrip.deal_stage} to ${updatedTrip.deal_stage}`,
      });
    }

    if (leadOwnerId !== undefined && leadOwnerId !== existingTrip.lead_owner_id) {
      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: "LEAD_REASSIGNED",
        previousState: { lead_owner_id: existingTrip.lead_owner_id },
        newState: { lead_owner_id: updatedTrip.lead_owner_id },
        comment: notes?.trim() || "Lead owner reassigned",
      });
    }

    if (isArchived !== undefined && Boolean(isArchived) !== Boolean(existingTrip.is_archived)) {
      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: "ARCHIVED",
        newState: { is_archived: updatedTrip.is_archived },
        comment: updatedTrip.is_archived ? "Journey archived" : "Journey restored from archive",
      });
    }

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
