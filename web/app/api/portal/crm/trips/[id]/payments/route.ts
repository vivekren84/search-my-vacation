import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import {
  DIRECT_FINANCIAL_ROLES,
  getAdminHeaders,
  hasProhibitedBrandTerm,
  logTripEvent,
  resolveStaffCaller,
  syncTripPaymentStatus,
} from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

const VALID_MODES = new Set(["UPI", "NEFT/IMPS", "Card", "Payment Gateway", "Cash"]);

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
      `${config.projectUrl}/rest/v1/workspace_trip_payments?trip_id=eq.${encodeURIComponent(id)}&order=payment_date.desc,created_at.desc`,
      { headers: getAdminHeaders(config.secretKey), signal: AbortSignal.timeout(5000) }
    );
    const payments = res.ok ? await res.json() : [];
    return NextResponse.json({ ok: true, payments });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to load payments." }, { status: 500 });
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
      trancheLabel,
      amountInr,
      paymentMode = "UPI",
      transactionRef,
      paymentDate,
      dueDate,
      notes,
      callerEmail,
      callerName,
      callerRole,
    } = body;

    if (!trancheLabel || !String(trancheLabel).trim()) {
      return NextResponse.json({ ok: false, message: "Tranche label is required." }, { status: 400 });
    }
    const amount = Number(amountInr);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, message: "Valid payment amount (> ₹0) is required." }, { status: 400 });
    }
    if (!VALID_MODES.has(paymentMode)) {
      return NextResponse.json({ ok: false, message: `Invalid payment mode: ${paymentMode}` }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const isDirect = DIRECT_FINANCIAL_ROLES.has(caller.role);
    const nowIso = new Date().toISOString();
    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });

    const insertRes = await fetch(`${config.projectUrl}/rest/v1/workspace_trip_payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip_id: id,
        tranche_label: String(trancheLabel).trim(),
        amount_inr: amount,
        payment_mode: paymentMode,
        transaction_ref: transactionRef?.trim() || null,
        payment_date: paymentDate || nowIso.slice(0, 10),
        due_date: dueDate || null,
        verification_status: isDirect ? "Verified" : "Pending Verification",
        recorded_by: caller.userId,
        recorded_by_name: caller.displayName,
        verified_by: isDirect ? caller.userId : null,
        verified_by_name: isDirect ? caller.displayName : null,
        verified_at: isDirect ? nowIso : null,
        notes: notes?.trim() || null,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ ok: false, message: `Failed to record payment: ${errText}` }, { status: 502 });
    }

    const [payment] = await insertRes.json();
    const syncResult = await syncTripPaymentStatus({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
    });

    await logTripEvent({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
      actorId: caller.userId,
      actorName: caller.displayName,
      eventType: "PAYMENT_LOGGED",
      newState: {
        tranche_label: payment.tranche_label,
        amount_inr: payment.amount_inr,
        verification_status: payment.verification_status,
      },
      comment: `${payment.tranche_label}: ₹${amount.toLocaleString("en-IN")} via ${paymentMode} (${payment.verification_status})`,
    });

    return NextResponse.json({
      ok: true,
      payment,
      syncResult,
      message: isDirect
        ? `Payment tranche "${payment.tranche_label}" verified and balance synced.`
        : `Payment tranche "${payment.tranche_label}" logged as Pending Verification.`,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to record payment." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { paymentId, decision, callerEmail, callerName, callerRole } = body;

    if (!paymentId || (decision !== "Verified" && decision !== "Rejected")) {
      return NextResponse.json(
        { ok: false, message: "paymentId and decision ('Verified' | 'Rejected') are required." },
        { status: 400 }
      );
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    if (!DIRECT_FINANCIAL_ROLES.has(caller.role)) {
      return NextResponse.json(
        { ok: false, message: "Permission Denied: Only Privilege User, Administrator, or Super Admin can verify payments." },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();
    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });

    const patchRes = await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_payments?id=eq.${encodeURIComponent(paymentId)}&trip_id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          verification_status: decision,
          verified_by: caller.userId,
          verified_by_name: caller.displayName,
          verified_at: nowIso,
          updated_at: nowIso,
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return NextResponse.json({ ok: false, message: `Failed to verify payment: ${errText}` }, { status: 502 });
    }

    const [payment] = await patchRes.json();
    const syncResult = await syncTripPaymentStatus({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
    });

    await logTripEvent({
      projectUrl: config.projectUrl,
      secretKey: config.secretKey,
      tripId: id,
      actorId: caller.userId,
      actorName: caller.displayName,
      eventType: "PAYMENT_LOGGED",
      newState: { tranche_label: payment?.tranche_label, verification_status: decision },
      comment: `Payment tranche "${payment?.tranche_label}" marked ${decision}.`,
    });

    return NextResponse.json({
      ok: true,
      payment,
      syncResult,
      message: `Payment tranche marked ${decision}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to verify payment." }, { status: 500 });
  }
}
