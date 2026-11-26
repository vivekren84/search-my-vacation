import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const DIRECT_FINANCIAL_ROLES = new Set([
  "super_admin",
  "administrator",
  "privilege_user",
]);

export const ADMIN_ONLY_ROLES = new Set(["super_admin", "administrator"]);

export function hasProhibitedBrandTerm(payload: unknown): boolean {
  const str = typeof payload === "string" ? payload : JSON.stringify(payload || "");
  return /\bluxury\b/i.test(str);
}

export function normalizeMobileE164(raw?: string | null): string | null {
  if (!raw || !raw.trim()) return null;
  const digits = raw.trim().replace(/[^0-9+]/g, "");
  if (/^[0-9]{10}$/.test(digits)) return `+91${digits}`;
  if (/^91[0-9]{10}$/.test(digits)) return `+${digits}`;
  if (/^\+[0-9]{8,15}$/.test(digits)) return digits;
  return raw.trim();
}

export function computeFormula1Financials(quote: number, cost: number) {
  const grossMargin = quote - cost;
  if (grossMargin <= 0) {
    return {
      gstAmount: 0,
      profit: Math.round(grossMargin * 100) / 100,
      preTaxAmount: Math.round(quote * 100) / 100,
    };
  }
  const netProfit = grossMargin / 1.05;
  const gst = grossMargin - netProfit;
  const preTax = quote - gst;
  return {
    gstAmount: Math.round(gst * 100) / 100,
    profit: Math.round(netProfit * 100) / 100,
    preTaxAmount: Math.round(preTax * 100) / 100,
  };
}

export function getAdminHeaders(secretKey: string, extra?: Record<string, string>) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function resolveStaffCaller(
  request: Request,
  fallbackEmail?: string | null,
  fallbackName?: string | null,
  fallbackRole?: string | null
) {
  const config = getSupabaseAdminConfig();
  const email = (
    request.headers.get("x-staff-email") ||
    fallbackEmail ||
    ""
  )
    .toLowerCase()
    .trim();
  let role = (request.headers.get("x-staff-role") || fallbackRole || "desk_user")
    .toLowerCase()
    .trim();
  let userId: string | null = null;
  let displayName: string | null = fallbackName || null;

  if (email === "vivek@searchmyvacation.com") {
    return {
      email,
      role: "super_admin",
      userId: null as string | null,
      displayName: displayName || "Vivek Renganathan",
    };
  }

  if (email && config) {
    const headers = getAdminHeaders(config.secretKey);
    try {
      const authRes = await fetch(
        `${config.projectUrl}/auth/v1/admin/users?per_page=100`,
        { headers, signal: AbortSignal.timeout(5000) }
      );
      if (authRes.ok) {
        const authData = await authRes.json();
        const match = (authData.users || []).find(
          (u: any) => u.email?.toLowerCase().trim() === email
        );
        if (match) {
          userId = match.id;
          const wuRes = await fetch(
            `${config.projectUrl}/rest/v1/workspace_users?user_id=eq.${match.id}&select=role,display_name`,
            { headers, signal: AbortSignal.timeout(5000) }
          );
          if (wuRes.ok) {
            const wuRows = await wuRes.json();
            if (wuRows?.[0]) {
              role = (wuRows[0].role || role).toLowerCase().trim();
              displayName = wuRows[0].display_name || displayName;
            }
          }
        }
      }
    } catch {
      // Fall back to request headers/body if auth lookup times out
    }
  }

  return { email, role, userId, displayName: displayName || email || "Portal Staff" };
}

export async function logTripEvent(params: {
  projectUrl: string;
  secretKey: string;
  tripId: string;
  actorId?: string | null;
  actorName?: string | null;
  eventType: string;
  previousState?: Record<string, any> | null;
  newState?: Record<string, any> | null;
  reasonCode?: string | null;
  comment?: string | null;
}) {
  try {
    await fetch(`${params.projectUrl}/rest/v1/workspace_trip_events`, {
      method: "POST",
      headers: getAdminHeaders(params.secretKey),
      body: JSON.stringify({
        trip_id: params.tripId,
        actor_id: params.actorId || null,
        actor_name: params.actorName || "Portal Staff",
        event_type: params.eventType,
        previous_state: params.previousState || null,
        new_state: params.newState || null,
        reason_code: params.reasonCode || null,
        comment: params.comment || null,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("logTripEvent error:", err);
  }
}

export async function syncTripPaymentStatus(params: {
  projectUrl: string;
  secretKey: string;
  tripId: string;
}) {
  const headers = getAdminHeaders(params.secretKey);
  const [tripRes, payRes] = await Promise.all([
    fetch(
      `${params.projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(params.tripId)}&select=id,quote_price,deal_stage,payment_status,readiness_checklist`,
      { headers, signal: AbortSignal.timeout(5000) }
    ),
    fetch(
      `${params.projectUrl}/rest/v1/workspace_trip_payments?trip_id=eq.${encodeURIComponent(params.tripId)}&select=amount_inr,verification_status`,
      { headers, signal: AbortSignal.timeout(5000) }
    ),
  ]);

  if (!tripRes.ok || !payRes.ok) return null;
  const tripRows = await tripRes.json();
  const trip = tripRows?.[0];
  if (!trip) return null;

  const payments: any[] = await payRes.json();
  const totalVerified = payments
    .filter((p) => p.verification_status === "Verified")
    .reduce((sum, p) => sum + (Number(p.amount_inr) || 0), 0);
  const quotePrice = Number(trip.quote_price || 0);
  const balanceDue = Math.max(0, quotePrice - totalVerified);

  let nextPaymentStatus = trip.payment_status;
  if (trip.deal_stage !== "Lost" && trip.deal_stage !== "Cancelled") {
    if (totalVerified <= 0) {
      nextPaymentStatus = "To Start";
    } else if (quotePrice > 0 && balanceDue <= 0) {
      nextPaymentStatus = "Won";
    } else {
      nextPaymentStatus = "In Progress";
    }
  }

  const checklist = {
    ...(trip.readiness_checklist || {}),
    payment_settled: quotePrice > 0 && balanceDue <= 0,
  };

  await fetch(
    `${params.projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(params.tripId)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        payment_status: nextPaymentStatus,
        readiness_checklist: checklist,
        updated_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    }
  );

  return { totalVerified, balanceDue, paymentStatus: nextPaymentStatus, readinessChecklist: checklist };
}
