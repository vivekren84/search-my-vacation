import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import {
  getAdminHeaders,
  hasProhibitedBrandTerm,
  logTripEvent,
  resolveStaffCaller,
} from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

async function syncBookedSummaryStrings(projectUrl: string, secretKey: string, tripId: string) {
  const headers = getAdminHeaders(secretKey);
  const res = await fetch(
    `${projectUrl}/rest/v1/workspace_trip_bookings?trip_id=eq.${encodeURIComponent(tripId)}&booking_status=neq.Cancelled&order=start_date.asc.nullslast`,
    { headers, signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) return;
  const rows: any[] = await res.json();

  const stays = rows
    .filter((r) => r.booking_type === "Stay")
    .map((r) => (r.confirmation_ref ? `${r.client_facing_title} (${r.confirmation_ref})` : r.client_facing_title));
  const transport = rows
    .filter((r) => r.booking_type === "Transport/Cab" || r.booking_type === "Flight/Rail")
    .map((r) => (r.confirmation_ref ? `${r.client_facing_title} (${r.confirmation_ref})` : r.client_facing_title));

  await fetch(`${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(tripId)}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      booked_properties: stays.length > 0 ? stays.join(" • ") : null,
      booked_transport: transport.length > 0 ? transport.join(" • ") : null,
      updated_at: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(5000),
  });
}

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
    const res = await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_bookings?trip_id=eq.${encodeURIComponent(id)}&order=start_date.asc.nullslast,created_at.asc`,
      { headers: getAdminHeaders(config.secretKey), signal: AbortSignal.timeout(5000) }
    );
    const bookings = res.ok ? await res.json() : [];
    return NextResponse.json({ ok: true, bookings });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to load bookings." }, { status: 500 });
  }
}

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
      bookingType = "Stay",
      clientFacingTitle,
      internalVendorDmc,
      confirmationRef,
      startDate,
      endDate,
      bookingStatus = "Pending",
      operationalNotes,
      callerEmail,
      callerName,
      callerRole,
    } = body;

    if (!clientFacingTitle || !String(clientFacingTitle).trim()) {
      return NextResponse.json({ ok: false, message: "Client-facing title is required." }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });

    const insertRes = await fetch(`${config.projectUrl}/rest/v1/workspace_trip_bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip_id: id,
        booking_type: bookingType,
        client_facing_title: String(clientFacingTitle).trim(),
        internal_vendor_dmc: internalVendorDmc?.trim() || null,
        confirmation_ref: confirmationRef?.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        booking_status: bookingStatus,
        operational_notes: operationalNotes?.trim() || null,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ ok: false, message: `Failed to add booking: ${errText}` }, { status: 502 });
    }

    const [booking] = await insertRes.json();
    await syncBookedSummaryStrings(config.projectUrl, config.secretKey, id);

    await logTripEvent({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
      actorId: caller.userId,
      actorName: caller.displayName,
      eventType: "BOOKING_UPDATED",
      newState: { booking_type: booking.booking_type, title: booking.client_facing_title, status: booking.booking_status },
      comment: `Added ${booking.booking_type}: ${booking.client_facing_title} (${booking.booking_status})`,
    });

    return NextResponse.json({ ok: true, booking, message: `${booking.booking_type} allocation added.` });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to add booking." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    if (hasProhibitedBrandTerm(body)) {
      return NextResponse.json({ ok: false, message: "Brand Tone Guardrail: Prohibited terminology detected." }, { status: 400 });
    }

    const { bookingId, bookingStatus, confirmationRef, internalVendorDmc, clientFacingTitle, operationalNotes, callerEmail, callerName, callerRole } = body;
    if (!bookingId) {
      return NextResponse.json({ ok: false, message: "bookingId is required." }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });

    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    if (bookingStatus !== undefined) patch.booking_status = bookingStatus;
    if (confirmationRef !== undefined) patch.confirmation_ref = confirmationRef?.trim() || null;
    if (internalVendorDmc !== undefined) patch.internal_vendor_dmc = internalVendorDmc?.trim() || null;
    if (clientFacingTitle !== undefined) patch.client_facing_title = clientFacingTitle?.trim();
    if (operationalNotes !== undefined) patch.operational_notes = operationalNotes?.trim() || null;

    const res = await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_bookings?id=eq.${encodeURIComponent(bookingId)}&trip_id=eq.${encodeURIComponent(id)}`,
      { method: "PATCH", headers, body: JSON.stringify(patch), signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) {
      return NextResponse.json({ ok: false, message: "Failed to update booking." }, { status: 502 });
    }
    const [booking] = await res.json();
    await syncBookedSummaryStrings(config.projectUrl, config.secretKey, id);

    await logTripEvent({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
      actorId: caller.userId,
      actorName: caller.displayName,
      eventType: "BOOKING_UPDATED",
      newState: { booking_id: bookingId, status: booking?.booking_status },
      comment: `Updated ${booking?.client_facing_title || "booking"} → ${booking?.booking_status}`,
    });

    return NextResponse.json({ ok: true, booking, message: "Booking allocation updated." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to update booking." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ ok: false, message: "bookingId is required." }, { status: 400 });
    }
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }
    const headers = getAdminHeaders(config.secretKey);
    await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_bookings?id=eq.${encodeURIComponent(bookingId)}&trip_id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers, signal: AbortSignal.timeout(5000) }
    );
    await syncBookedSummaryStrings(config.projectUrl, config.secretKey, id);
    return NextResponse.json({ ok: true, message: "Booking allocation removed." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to delete booking." }, { status: 500 });
  }
}
