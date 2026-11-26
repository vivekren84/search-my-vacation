import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import {
  computeFormula1Financials,
  DIRECT_FINANCIAL_ROLES,
  getAdminHeaders,
  hasProhibitedBrandTerm,
  logTripEvent,
  resolveStaffCaller,
} from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * GET /api/portal/crm/trips/[id]
 * Returns unified journey workspace payload: trip, customer, events, payments, bookings, companions, documents, itineraries.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const { projectUrl, secretKey } = config;
    const headers = getAdminHeaders(secretKey);

    const tripRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}&select=*`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    if (!tripRes.ok) {
      return NextResponse.json({ ok: false, message: "Failed to query journey." }, { status: 502 });
    }
    const tripRows = await tripRes.json();
    const trip = tripRows?.[0];
    if (!trip) {
      return NextResponse.json({ ok: false, message: "Journey not found." }, { status: 404 });
    }

    const [
      custRes,
      eventsRes,
      paymentsRes,
      bookingsRes,
      tripCompRes,
      clientCompRes,
      docsRes,
      itinRes,
    ] = await Promise.all([
      fetch(`${projectUrl}/rest/v1/workspace_customers?id=eq.${trip.customer_id}&select=*`, {
        headers,
        signal: AbortSignal.timeout(5000),
      }),
      fetch(
        `${projectUrl}/rest/v1/workspace_trip_events?trip_id=eq.${id}&order=created_at.desc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_trip_payments?trip_id=eq.${id}&order=payment_date.desc,created_at.desc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_trip_bookings?trip_id=eq.${id}&order=start_date.asc.nullslast,created_at.asc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(`${projectUrl}/rest/v1/workspace_trip_companions?trip_id=eq.${id}`, {
        headers,
        signal: AbortSignal.timeout(5000),
      }),
      fetch(
        `${projectUrl}/rest/v1/workspace_client_companions?client_id=eq.${trip.customer_id}&order=created_at.asc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_trip_documents?trip_id=eq.${id}&order=created_at.desc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetch(
        `${projectUrl}/rest/v1/workspace_itineraries?trip_id=eq.${id}&order=updated_at.desc`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
    ]);

    const customer = custRes.ok ? (await custRes.json())?.[0] || null : null;
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const payments = paymentsRes.ok ? await paymentsRes.json() : [];
    const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
    const tripCompanions = tripCompRes.ok ? await tripCompRes.json() : [];
    const clientCompanions = clientCompRes.ok ? await clientCompRes.json() : [];
    const documentsRaw: any[] = docsRes.ok ? await docsRes.json() : [];
    const itineraries = itinRes.ok ? await itinRes.json() : [];

    // Generate 1-hour signed URLs for documents
    const documents = await Promise.all(
      documentsRaw.map(async (doc) => {
        let signedUrl: string | null = null;
        try {
          const signRes = await fetch(
            `${projectUrl}/storage/v1/object/sign/trip-documents/${doc.storage_path}`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({ expiresIn: 3600 }),
              signal: AbortSignal.timeout(4000),
            }
          );
          if (signRes.ok) {
            const signData = await signRes.json();
            if (signData?.signedURL) {
              signedUrl = `${projectUrl}/storage/v1${signData.signedURL}`;
            }
          }
        } catch {}
        return { ...doc, signedUrl };
      })
    );

    return NextResponse.json({
      ok: true,
      trip,
      customer,
      events,
      payments,
      bookings,
      tripCompanions,
      clientCompanions,
      documents,
      itineraries,
    });
  } catch (err: any) {
    console.error("Trip detail GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load journey workspace." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/crm/trips/[id]
 * Handles Journey Drawer actions: clone, add_note, toggle_pin_note, log_amendment, publish_voucher.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, callerEmail, callerName, callerRole } = body;

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
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const { projectUrl, secretKey } = config;
    const headers = getAdminHeaders(secretKey, { Prefer: "return=representation" });
    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);

    const tripRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}&select=*`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const trip = tripRes.ok ? (await tripRes.json())?.[0] : null;
    if (!trip) {
      return NextResponse.json({ ok: false, message: "Journey not found." }, { status: 404 });
    }

    // 1. Clone Journey (US-154-02)
    if (action === "clone") {
      const rpcRes = await fetch(
        `${projectUrl}/rest/v1/rpc/create_journey_with_optional_customer`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            p_customer_id: trip.customer_id,
            p_deal_channel: trip.deal_channel,
            p_trip_scope: trip.trip_scope || "Domestic",
            p_destination: trip.destination,
            p_travel_year: trip.travel_year,
            p_travel_month: trip.travel_month,
            p_start_date: trip.start_date,
            p_end_date: trip.end_date,
            p_duration_label: trip.duration_label,
            p_nights: trip.nights,
            p_travel_party_type: trip.travel_party_type,
            p_pax_adults: trip.pax_adults,
            p_pax_children: trip.pax_children,
            p_lead_source: trip.lead_source,
            p_lead_owner_id: trip.lead_owner_id || caller.userId,
            p_notes: trip.notes ? `[Cloned from ${trip.deal_reference_id}] ${trip.notes}` : `Cloned from ${trip.deal_reference_id}`,
            p_actor_id: caller.userId,
            p_actor_name: caller.displayName,
            p_quote_price: Number(trip.quote_price || 0),
            p_actual_cost: Number(trip.actual_cost || 0),
            p_pre_tax_amount: Number(trip.pre_tax_amount || 0),
            p_gst_amount: Number(trip.gst_amount || 0),
            p_profit: Number(trip.profit || 0),
            p_cloned_from_trip_id: trip.id,
          }),
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!rpcRes.ok) {
        const errText = await rpcRes.text();
        return NextResponse.json({ ok: false, message: `Clone failed: ${errText}` }, { status: 500 });
      }
      const cloned = await rpcRes.json();

      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: trip.id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: "CLONED",
        newState: { cloned_to_deal_reference_id: cloned.deal_reference_id },
        comment: `Cloned into ${cloned.deal_reference_id}`,
      });

      return NextResponse.json({
        ok: true,
        clonedTripId: cloned.trip_id,
        dealReferenceId: cloned.deal_reference_id,
        message: `Journey cloned as ${cloned.deal_reference_id}.`,
      });
    }

    // 2. Add Operational Note (US-154-09)
    if (action === "add_note") {
      const noteText = String(body.comment || "").trim();
      if (!noteText) {
        return NextResponse.json({ ok: false, message: "Note text is required." }, { status: 400 });
      }
      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: "NOTE_ADDED",
        comment: noteText,
      });
      return NextResponse.json({ ok: true, message: "Note added to journey timeline." });
    }

    // 3. Pin / Unpin Handoff Note (max 2 pinned notes, US-154-09)
    if (action === "toggle_pin_note") {
      const currentPinned: any[] = Array.isArray(trip.pinned_notes) ? trip.pinned_notes : [];
      const noteId = body.noteId;
      let nextPinned = currentPinned;

      if (noteId && currentPinned.some((n) => n.id === noteId)) {
        nextPinned = currentPinned.filter((n) => n.id !== noteId);
      } else {
        const text = String(body.text || "").trim();
        if (!text) {
          return NextResponse.json({ ok: false, message: "Pinned note text is required." }, { status: 400 });
        }
        if (currentPinned.length >= 2) {
          return NextResponse.json(
            { ok: false, message: "Maximum of 2 pinned handoff notes allowed per journey. Unpin one first." },
            { status: 400 }
          );
        }
        nextPinned = [
          ...currentPinned,
          {
            id: crypto.randomUUID(),
            text,
            author: caller.displayName,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      await fetch(`${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ pinned_notes: nextPinned, updated_at: new Date().toISOString() }),
        signal: AbortSignal.timeout(5000),
      });

      return NextResponse.json({ ok: true, pinnedNotes: nextPinned, message: "Pinned handoff notes updated." });
    }

    // 4. Post-Booking Scope Amendment (US-154-04)
    if (action === "log_amendment") {
      if (trip.deal_stage !== "Booked/Won") {
        return NextResponse.json(
          { ok: false, message: "Scope amendments are only applicable to Booked/Won journeys." },
          { status: 400 }
        );
      }

      const quoteDelta = Number(body.quoteDelta || 0);
      const costDelta = Number(body.costDelta || 0);
      const scopeSummary = String(body.scopeSummary || "").trim();
      if (!scopeSummary) {
        return NextResponse.json({ ok: false, message: "Amendment summary is required." }, { status: 400 });
      }

      const prevQuote = Number(trip.quote_price || 0);
      const prevCost = Number(trip.actual_cost || 0);
      const nextQuote = Math.max(0, prevQuote + quoteDelta);
      const nextCost = Math.max(0, prevCost + costDelta);
      const f1 = computeFormula1Financials(nextQuote, nextCost);
      const nowIso = new Date().toISOString();

      if (DIRECT_FINANCIAL_ROLES.has(caller.role)) {
        await fetch(`${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            quote_price: nextQuote,
            actual_cost: nextCost,
            pre_tax_amount: f1.preTaxAmount,
            gst_amount: f1.gstAmount,
            profit: f1.profit,
            updated_at: nowIso,
          }),
          signal: AbortSignal.timeout(5000),
        });

        await logTripEvent({
          projectUrl,
          secretKey,
          tripId: id,
          actorId: caller.userId,
          actorName: caller.displayName,
          eventType: "AMENDMENT_LOGGED",
          previousState: { quote_price: prevQuote, actual_cost: prevCost, profit: Number(trip.profit || 0) },
          newState: { quote_price: nextQuote, actual_cost: nextCost, profit: f1.profit },
          comment: `Scope Amendment: ${scopeSummary} (Quote Δ ₹${quoteDelta}, Cost Δ ₹${costDelta})`,
        });

        return NextResponse.json({
          ok: true,
          pendingApproval: false,
          message: `Scope amendment applied to ${trip.deal_reference_id}.`,
        });
      } else {
        // Route desk_user amendment through US-153-04 Financial Approval Queue
        await fetch(`${projectUrl}/rest/v1/workspace_trip_financial_approvals`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            trip_id: id,
            deal_reference_id: trip.deal_reference_id,
            requested_by_user_id: caller.userId,
            requested_by_email: caller.email || "desk@searchmyvacation.com",
            requested_by_name: caller.displayName,
            proposed_quote_price: nextQuote,
            proposed_actual_cost: nextCost,
            proposed_pre_tax_amount: f1.preTaxAmount,
            proposed_gst_amount: f1.gstAmount,
            proposed_profit: f1.profit,
            previous_quote_price: prevQuote,
            previous_actual_cost: prevCost,
            previous_profit: Number(trip.profit || 0),
            justification: `Scope Amendment: ${scopeSummary} (Quote Δ ₹${quoteDelta}, Cost Δ ₹${costDelta})`,
            status: "pending",
          }),
          signal: AbortSignal.timeout(5000),
        });

        await logTripEvent({
          projectUrl,
          secretKey,
          tripId: id,
          actorId: caller.userId,
          actorName: caller.displayName,
          eventType: "AMENDMENT_LOGGED",
          previousState: { quote_price: prevQuote, actual_cost: prevCost },
          newState: { proposed_quote_price: nextQuote, proposed_actual_cost: nextCost, status: "pending_approval" },
          comment: `Scope Amendment submitted for approval: ${scopeSummary}`,
        });

        return NextResponse.json({
          ok: true,
          pendingApproval: true,
          message: "Scope amendment submitted to the Financial Approval Queue.",
        });
      }
    }

    // 5. Publish / Refresh Active Voucher (US-154-08 & US-010 White-Label Masking)
    if (action === "publish_voucher") {
      const [bookingsRes, itinRes] = await Promise.all([
        fetch(
          `${projectUrl}/rest/v1/workspace_trip_bookings?trip_id=eq.${id}&booking_status=neq.Cancelled&order=start_date.asc.nullslast`,
          { headers, signal: AbortSignal.timeout(5000) }
        ),
        fetch(
          `${projectUrl}/rest/v1/workspace_itineraries?trip_id=eq.${id}&order=updated_at.desc&limit=1`,
          { headers, signal: AbortSignal.timeout(5000) }
        ),
      ]);

      const bookings: any[] = bookingsRes.ok ? await bookingsRes.json() : [];
      const itineraries: any[] = itinRes.ok ? await itinRes.json() : [];

      // Strictly exclude internal_vendor_dmc and operational_notes (US-010 / US-154-06)
      const clientSafeBookings = bookings.map((b) => ({
        id: b.id,
        bookingType: b.booking_type,
        title: b.client_facing_title,
        confirmationRef: b.confirmation_ref || null,
        startDate: b.start_date || null,
        endDate: b.end_date || null,
        status: b.booking_status,
      }));

      const voucherPayload = {
        dealReferenceId: trip.deal_reference_id,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        publishedAt: new Date().toISOString(),
        itineraryTitle: itineraries[0]?.title || null,
        bookings: clientSafeBookings,
      };

      const nextChecklist = {
        ...(trip.readiness_checklist || {}),
        voucher_published: true,
      };

      await fetch(`${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          voucher_payload: voucherPayload,
          voucher_published_at: voucherPayload.publishedAt,
          readiness_checklist: nextChecklist,
          updated_at: voucherPayload.publishedAt,
        }),
        signal: AbortSignal.timeout(5000),
      });

      await logTripEvent({
        projectUrl,
        secretKey,
        tripId: id,
        actorId: caller.userId,
        actorName: caller.displayName,
        eventType: "VOUCHER_PUBLISHED",
        newState: { bookings_count: clientSafeBookings.length },
        comment: `Active Voucher published with ${clientSafeBookings.length} white-labeled booking items.`,
      });

      return NextResponse.json({
        ok: true,
        voucherPayload,
        readinessChecklist: nextChecklist,
        message: `Active Voucher published for ${trip.deal_reference_id}.`,
      });
    }

    return NextResponse.json({ ok: false, message: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("Trip detail POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to execute journey action." },
      { status: 500 }
    );
  }
}
