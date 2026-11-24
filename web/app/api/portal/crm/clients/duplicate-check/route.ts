import { NextResponse } from "next/server";
import { clientCrmService } from "@/lib/staff-portal/crm/service";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { normalizeE164 } from "@/lib/phone/phone-normalization";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const phone = searchParams.get("phone")?.trim();

    // 1. In-memory check
    const memResult = clientCrmService.detectDuplicate({ email, phone });
    if (memResult.hasDuplicate) {
      return NextResponse.json({ ok: true, duplicate: memResult });
    }

    // 2. Query Supabase workspace_customers & workspace_trips
    const config = getSupabaseAdminConfig();
    if (config && (phone || email)) {
      const { projectUrl, secretKey } = config;
      const headers = {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      };

      const normalizedPhone = phone ? normalizeE164(phone) : null;
      let queryFilter = "";

      if (normalizedPhone) {
        queryFilter = `or=(primary_mobile.eq.${encodeURIComponent(
          normalizedPhone
        )},secondary_mobile.eq.${encodeURIComponent(normalizedPhone)})`;
      } else if (email) {
        queryFilter = `primary_email=eq.${encodeURIComponent(email)}`;
      }

      if (queryFilter) {
        const custRes = await fetch(
          `${projectUrl}/rest/v1/workspace_customers?${queryFilter}&select=*&limit=1`,
          { headers, signal: AbortSignal.timeout(5000) }
        );

        if (custRes.ok) {
          const found = await custRes.json();
          if (found && found.length > 0) {
            const customer = found[0];

            // Fetch past trips for this customer
            const tripsRes = await fetch(
              `${projectUrl}/rest/v1/workspace_trips?customer_id=eq.${customer.id}&select=deal_reference_id,destination,travel_year,deal_stage,payment_status&order=travel_year.desc`,
              { headers, signal: AbortSignal.timeout(5000) }
            );

            const pastTrips: any[] = tripsRes.ok ? await tripsRes.json() : [];

            return NextResponse.json({
              ok: true,
              duplicate: {
                hasDuplicate: true,
                isDatabaseCustomer: true,
                matchedCustomerId: customer.id,
                matchedCustomerCode: customer.customer_code,
                matchedCustomerName: customer.primary_name,
                matchedMobile: customer.primary_mobile,
                secondaryMobile: customer.secondary_mobile,
                matchedEmail: customer.primary_email,
                pastTripsCount: pastTrips.length,
                pastTrips: pastTrips.map((t) => ({
                  dealReferenceId: t.deal_reference_id,
                  destination: t.destination,
                  travelYear: t.travel_year,
                  dealStage: t.deal_stage,
                  paymentStatus: t.payment_status,
                })),
                warningMessage: `Returning traveller detected (${customer.customer_code}): "${customer.primary_name}" (${customer.primary_mobile}). Would you like to link this new journey to their existing dossier?`,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ ok: true, duplicate: { hasDuplicate: false } });
  } catch (err: any) {
    console.error("Duplicate check error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to check duplicates." },
      { status: 500 }
    );
  }
}
