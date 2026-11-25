import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const AUTHORIZED_APPROVER_ROLES = new Set(["super_admin", "administrator", "privilege_user"]);

async function resolveCallerAuthority(
  projectUrl: string,
  headers: Record<string, string>,
  callerEmail?: string,
  fallbackRole?: string
) {
  let role = (fallbackRole || "desk_user").toLowerCase().trim();
  let userId: string | null = null;
  let displayName: string | null = null;

  if (callerEmail) {
    const emailLower = callerEmail.toLowerCase().trim();
    if (emailLower === "vivek@searchmyvacation.com") {
      return { role: "super_admin", userId: null as string | null, displayName: "Vivek Renganathan" };
    }
    try {
      const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        headers,
        signal: AbortSignal.timeout(5000),
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        const match = (authData.users || []).find(
          (u: any) => u.email?.toLowerCase().trim() === emailLower
        );
        if (match) {
          userId = match.id;
          const wuRes = await fetch(
            `${projectUrl}/rest/v1/workspace_users?user_id=eq.${match.id}&select=user_id,role,display_name`,
            { headers, signal: AbortSignal.timeout(5000) }
          );
          if (wuRes.ok) {
            const wuRows = await wuRes.json();
            if (wuRows?.[0]) {
              role = (wuRows[0].role || role).toLowerCase().trim();
              displayName = wuRows[0].display_name || null;
            }
          }
        }
      }
    } catch {}
  }

  return { role, userId, displayName };
}

/**
 * GET /api/portal/crm/trips/approvals
 * Returns pending (and recent) desk_user financial proposals for single-concurrence review.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status")?.trim() || "pending";

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

    let url = `${projectUrl}/rest/v1/workspace_trip_financial_approvals?select=*&order=created_at.desc`;
    if (statusFilter !== "all") {
      url += `&status=eq.${encodeURIComponent(statusFilter)}`;
    }

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to load financial approvals: ${errText}` },
        { status: 502 }
      );
    }

    const approvals: any[] = await res.json();

    // Enrich with trip destination & customer name
    const tripIds = Array.from(new Set(approvals.map((a) => a.trip_id).filter(Boolean)));
    const tripMap = new Map<string, any>();
    const custMap = new Map<string, any>();

    if (tripIds.length > 0) {
      const tripsRes = await fetch(
        `${projectUrl}/rest/v1/workspace_trips?select=id,customer_id,destination,deal_reference_id`,
        { headers, signal: AbortSignal.timeout(5000) }
      );
      if (tripsRes.ok) {
        for (const t of await tripsRes.json()) tripMap.set(t.id, t);
      }
      const custRes = await fetch(
        `${projectUrl}/rest/v1/workspace_customers?select=id,customer_code,primary_name`,
        { headers, signal: AbortSignal.timeout(5000) }
      );
      if (custRes.ok) {
        for (const c of await custRes.json()) custMap.set(c.id, c);
      }
    }

    const enriched = approvals.map((a) => {
      const trip = tripMap.get(a.trip_id);
      const cust = trip ? custMap.get(trip.customer_id) : null;
      return {
        ...a,
        destination: trip?.destination || "—",
        customerName: cust?.primary_name || "—",
        customerCode: cust?.customer_code || "—",
      };
    });

    return NextResponse.json({ ok: true, approvals: enriched });
  } catch (err: any) {
    console.error("Financial approvals GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load financial approvals." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portal/crm/trips/approvals
 * Single-concurrence approve/reject for a pending desk_user financial proposal.
 * Once any one privilege_user / administrator / super_admin approves or rejects,
 * it is resolved and removed from everyone's pending queue.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, decision, reviewNotes, callerEmail, callerRole } = body;

    if (!id || (decision !== "approved" && decision !== "rejected")) {
      return NextResponse.json(
        { ok: false, message: "Valid approval id and decision ('approved' | 'rejected') are required." },
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

    const resolvedCaller = await resolveCallerAuthority(
      projectUrl,
      headers,
      request.headers.get("x-staff-email") || callerEmail,
      request.headers.get("x-staff-role") || callerRole
    );

    if (!AUTHORIZED_APPROVER_ROLES.has(resolvedCaller.role)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Permission Denied: Only Privilege Users, Administrators, or Super Admin can approve or reject financial proposals.",
        },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();

    // Atomic single-concurrence claim: only update if status is still 'pending'
    const claimRes = await fetch(
      `${projectUrl}/rest/v1/workspace_trip_financial_approvals?id=eq.${encodeURIComponent(id)}&status=eq.pending`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          status: decision,
          reviewed_by_user_id: resolvedCaller.userId,
          reviewed_by_email: (request.headers.get("x-staff-email") || callerEmail || "").toLowerCase().trim() || null,
          reviewed_by_name: resolvedCaller.displayName || callerEmail || "Authorized Reviewer",
          reviewed_at: nowIso,
          review_notes: reviewNotes?.trim() || null,
          updated_at: nowIso,
        }),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!claimRes.ok) {
      const errText = await claimRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to process approval: ${errText}` },
        { status: 502 }
      );
    }

    const claimedRows: any[] = await claimRes.json();
    if (!claimedRows || claimedRows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          alreadyResolved: true,
          message: "This financial proposal has already been reviewed by another authorized team member.",
        },
        { status: 409 }
      );
    }

    const approval = claimedRows[0];

    // If approved, apply proposed financials to workspace_trips immediately
    if (decision === "approved") {
      const tripUpdateRes = await fetch(
        `${projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(approval.trip_id)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            quote_price: Number(approval.proposed_quote_price || 0),
            actual_cost: Number(approval.proposed_actual_cost || 0),
            pre_tax_amount: Number(approval.proposed_pre_tax_amount || 0),
            gst_amount: Number(approval.proposed_gst_amount || 0),
            profit: Number(approval.proposed_profit || 0),
            updated_at: nowIso,
          }),
          signal: AbortSignal.timeout(6000),
        }
      );

      if (!tripUpdateRes.ok) {
        const errText = await tripUpdateRes.text();
        return NextResponse.json(
          { ok: false, message: `Approval recorded, but trip update failed: ${errText}` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      approval,
      message:
        decision === "approved"
          ? `Financial update for ${approval.deal_reference_id} approved and applied.`
          : `Financial proposal for ${approval.deal_reference_id} rejected.`,
    });
  } catch (err: any) {
    console.error("Financial approvals PATCH error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to process financial approval." },
      { status: 500 }
    );
  }
}
