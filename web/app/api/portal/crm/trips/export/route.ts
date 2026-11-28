import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { DIRECT_FINANCIAL_ROLES, getAdminHeaders, resolveStaffCaller } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

function diffDays(startIso: string, endIso: string): number {
  const a = new Date(`${startIso}T00:00:00Z`).getTime();
  const b = new Date(`${endIso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
}

function matchesSelectedStatus(trip: any, selectedStatuses: string[]): boolean {
  if (selectedStatuses.includes("all")) return true;
  const ds = String(trip.deal_stage || "").toLowerCase();
  const ts = String(trip.trip_status || "").toLowerCase();

  for (const st of selectedStatuses) {
    if (st === "enquiries" && ds === "enquiry") return true;
    if (st === "planning" && ds === "in progress") return true;
    if (st === "confirmed" && ds === "booked/won" && ts !== "complete") return true;
    if (st === "in_travel" && ds === "in travel") return true;
    if (st === "completed" && (ts === "complete" || ds === "completed")) return true;
    if (st === "on_hold" && ds === "on hold") return true;
    if (st === "cancelled" && ds === "cancelled") return true;
    if (st === "lost" && (ds === "lost" || trip.is_archived)) return true;
  }
  return false;
}

/**
 * POST /api/portal/crm/trips/export
 * Generates SMV_Trips_Export_<Tenure>_<YYYYMMDD>.xlsx.
 * RBAC: Strictly privilege_user, administrator, super_admin (desk_user excluded).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const caller = await resolveStaffCaller(request, body.callerEmail, body.callerName, body.callerRole);

    if (!DIRECT_FINANCIAL_ROLES.has(caller.role)) {
      return NextResponse.json(
        { ok: false, message: "Permission Denied: Excel export is restricted to Privilege Users, Administrators, and Super Admin." },
        { status: 403 }
      );
    }

    const {
      statuses = ["all"],
      dateBasis = "start_date",
      startDate,
      endDate,
      tenureLabel = "Custom",
    } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ ok: false, message: "Start Date and End Date are required." }, { status: 400 });
    }

    const spanDays = diffDays(String(startDate), String(endDate));
    if (spanDays < 0) {
      return NextResponse.json({ ok: false, message: "End Date must be on or after Start Date." }, { status: 400 });
    }
    if (spanDays > 365) {
      return NextResponse.json(
        { ok: false, message: "Custom range cannot exceed 1 year (365 days)." },
        { status: 400 }
      );
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const headers = getAdminHeaders(config.secretKey);
    const [tripsRes, custRes, staffRes, payRes] = await Promise.all([
      fetch(`${config.projectUrl}/rest/v1/workspace_trips?select=*&order=created_at.desc`, {
        headers,
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`${config.projectUrl}/rest/v1/workspace_customers?select=id,customer_code,primary_name,primary_mobile,primary_email`, {
        headers,
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`${config.projectUrl}/rest/v1/workspace_users?select=user_id,display_name`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${config.projectUrl}/rest/v1/workspace_trip_payments?select=trip_id,amount_inr,verification_status`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    if (!tripsRes.ok) {
      return NextResponse.json({ ok: false, message: "Failed to query trips for export." }, { status: 502 });
    }

    const trips: any[] = await tripsRes.json();
    const customers: any[] = custRes.ok ? await custRes.json() : [];
    const staff: any[] = staffRes.ok ? await staffRes.json() : [];
    const payments: any[] = payRes.ok ? await payRes.json() : [];

    const custMap = new Map<string, any>(customers.map((c) => [c.id, c]));
    const staffMap = new Map<string, string>(staff.map((s) => [s.user_id, s.display_name]));
    const paidMap = new Map<string, number>();
    for (const p of payments) {
      if (p.verification_status === "verified") {
        paidMap.set(p.trip_id, (paidMap.get(p.trip_id) || 0) + Number(p.amount_inr || 0));
      }
    }

    const filtered = trips.filter((t) => {
      if (!matchesSelectedStatus(t, Array.isArray(statuses) ? statuses : ["all"])) return false;
      const dateVal =
        dateBasis === "created_at"
          ? String(t.created_at || "").slice(0, 10)
          : String(t.start_date || "").slice(0, 10);
      if (!dateVal) return false;
      return dateVal >= String(startDate) && dateVal <= String(endDate);
    });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("SMV Trips Export");

    ws.columns = [
      { header: "Trip ID", key: "tripId", width: 16 },
      { header: "Customer ID", key: "customerId", width: 14 },
      { header: "Client Name", key: "clientName", width: 24 },
      { header: "Primary Mobile", key: "mobile", width: 16 },
      { header: "Primary Email", key: "email", width: 26 },
      { header: "Category", key: "category", width: 14 },
      { header: "Destination", key: "destination", width: 24 },
      { header: "Travel Start Date", key: "startDate", width: 15 },
      { header: "Travel End Date", key: "endDate", width: 15 },
      { header: "Duration (N/D)", key: "duration", width: 15 },
      { header: "Pax (Adults/Children)", key: "pax", width: 18 },
      { header: "Current Stage", key: "stage", width: 18 },
      { header: "Advisor / Owner", key: "owner", width: 20 },
      { header: "Quote Price (INR)", key: "quote", width: 18 },
      { header: "Verified Collected (INR)", key: "collected", width: 22 },
      { header: "Balance Due (INR)", key: "balance", width: 18 },
      { header: "Net Profit (INR)", key: "profit", width: 18 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];
    ws.getRow(1).font = { bold: true };

    for (const t of filtered) {
      const cust = custMap.get(t.customer_id);
      const quote = Number(t.quote_price || 0);
      const collected = paidMap.get(t.id) || 0;
      const balance = Math.max(0, quote - collected);
      const stageLabel =
        t.trip_status === "Complete"
          ? "Completed Journeys"
          : t.deal_stage === "In Travel"
            ? "In Travel / Active"
            : t.deal_stage;

      ws.addRow({
        tripId: t.deal_reference_id,
        customerId: cust?.customer_code || "—",
        clientName: cust?.primary_name || "Unknown",
        mobile: cust?.primary_mobile || "—",
        email: cust?.primary_email || "—",
        category: t.trip_scope || "Domestic",
        destination: t.destination,
        startDate: t.start_date || "—",
        endDate: t.end_date || "—",
        duration: t.duration_label || (t.nights ? `${t.nights}N/${Number(t.nights) + 1}D` : "—"),
        pax: `${t.pax_adults || 1}A / ${t.pax_children || 0}C`,
        stage: stageLabel,
        owner: staffMap.get(t.lead_owner_id) || "Unassigned",
        quote,
        collected,
        balance,
        profit: Number(t.profit || 0),
        createdAt: String(t.created_at || "").slice(0, 10),
      });
    }

    const buffer = await wb.xlsx.writeBuffer();
    const safeTenure = String(tenureLabel).replace(/[^a-zA-Z0-9_-]/g, "_");
    const dateStamp = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" })
      .format(new Date())
      .replace(/-/g, "");
    const filename = `SMV_Trips_Export_${safeTenure}_${dateStamp}.xlsx`;

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Export failed." }, { status: 500 });
  }
}
