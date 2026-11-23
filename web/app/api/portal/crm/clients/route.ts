import { NextResponse } from "next/server";
import { clientCrmService } from "@/lib/staff-portal/crm/service";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import type { LeadSource, TagCategory, MasterClientProfile } from "@/types/client-crm.types";

export const runtime = "nodejs";

const DEFAULT_ANANYA_PROFILE: Parameters<typeof clientCrmService.createClientProfile>[0] = {
  fullName: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  phone: "+91 98401 12233",
  nationality: "Bengaluru, India",
  leadSource: "instagram",
  isVip: false,
  companions: [
    { fullName: "Rohan Sharma", relationship: "spouse", notes: "Adult • Pure Veg" },
    { fullName: "Aarav Sharma", relationship: "child", notes: "Age 7 • Kid-Easy Pace Required" },
  ],
  tags: [
    { category: "pace", tagValue: "Family Comfort" },
    { category: "pace", tagValue: "Slow Travel" },
    { category: "dietary", tagValue: "Pure Vegetarian" },
  ],
  initialActivityNote:
    "Discovery Call Completed: Aligned on 8-day slow-travel Kashmir autumn circuit. Client requested interconnected suites.",
};

let hasSeededDefaultClient = false;

async function ensureDefaultClient() {
  if (hasSeededDefaultClient) return;
  const existing = await clientCrmService.listClientProfiles();
  if (existing.length === 0) {
    try {
      await clientCrmService.createClientProfile(DEFAULT_ANANYA_PROFILE);
    } catch {}
  }
  hasSeededDefaultClient = true;
}

/**
 * GET /api/portal/crm/clients
 * Returns client profiles with query search & tag filtering
 */
export async function GET(request: Request) {
  try {
    await ensureDefaultClient();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const leadSource = (searchParams.get("leadSource") as LeadSource) || undefined;

    const inMemoryClients = await clientCrmService.listClientProfiles({
      query,
      tagValue: tag,
      leadSource,
    });

    const clientMap = new Map<string, MasterClientProfile>();
    for (const c of inMemoryClients) {
      clientMap.set(c.id, c);
    }

    // Attempt to query Supabase workspace_travellers for persistent DB clients
    const config = getSupabaseAdminConfig();
    if (config) {
      try {
        const { projectUrl, secretKey } = config;
        const headers = {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        };

        const travellersRes = await fetch(
          `${projectUrl}/rest/v1/workspace_travellers?select=*&order=created_at.desc`,
          { method: "GET", headers, signal: AbortSignal.timeout(5000) }
        );

        if (travellersRes.ok) {
          const dbTravellers: any[] = await travellersRes.json();
          for (const t of dbTravellers) {
            if (t.full_name && t.full_name !== "Test User") {
              const matchedId = t.id;
              if (!clientMap.has(matchedId)) {
                clientMap.set(matchedId, {
                  id: t.id,
                  fullName: t.full_name,
                  email: t.email || null,
                  phone: t.phone || null,
                  phoneE164: t.phone_e164 || t.phone || null,
                  nationality: t.nationality || null,
                  dob: t.dob || null,
                  leadSource: t.lead_source || "other",
                  isVip: Boolean(t.is_vip),
                  companions: [],
                  tags: [],
                  createdAt: t.created_at,
                  updatedAt: t.updated_at,
                });
              }
            }
          }
        }
      } catch (err: any) {
        console.warn("Supabase travellers query warning:", err.message);
      }
    }

    const clients = Array.from(clientMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ ok: true, clients });
  } catch (err: any) {
    console.error("CRM clients GET error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch client profiles." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/crm/clients
 * Creates a new client profile with companions, tags, and initial activity log
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      nationality,
      dob,
      leadSource,
      isVip,
      companions,
      tags,
      initialActivityNote,
      authorId,
    } = body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { ok: false, message: "Client full name is mandatory." },
        { status: 400 }
      );
    }

    if (!leadSource || typeof leadSource !== "string") {
      return NextResponse.json(
        { ok: false, message: "Lead Source attribution is mandatory on new inquiries." },
        { status: 400 }
      );
    }

    // Duplicate check
    const duplicateCheck = clientCrmService.detectDuplicate({ email, phone });
    if (duplicateCheck.hasDuplicate) {
      return NextResponse.json(
        {
          ok: false,
          isDuplicate: true,
          duplicate: duplicateCheck,
          message: duplicateCheck.warningMessage || "Duplicate client record detected.",
        },
        { status: 409 }
      );
    }

    const createdClient = await clientCrmService.createClientProfile({
      fullName: fullName.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      nationality: nationality?.trim() || null,
      dob: dob || null,
      leadSource: leadSource as LeadSource,
      isVip: Boolean(isVip),
      companions: companions || [],
      tags: tags || [],
      initialActivityNote: initialActivityNote?.trim() || undefined,
      authorId: authorId || undefined,
    });

    // Synchronize to Supabase workspace_travellers if configured
    const config = getSupabaseAdminConfig();
    if (config) {
      try {
        const { projectUrl, secretKey } = config;
        const headers = {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        };

        await fetch(`${projectUrl}/rest/v1/workspace_travellers`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            id: createdClient.id.startsWith("clt_")
              ? undefined // Let DB generate UUID if table enforces UUID
              : createdClient.id,
            full_name: createdClient.fullName,
            email: createdClient.email,
            phone: createdClient.phone,
            phone_e164: createdClient.phoneE164,
            nationality: createdClient.nationality,
            dob: createdClient.dob,
            lead_source: createdClient.leadSource,
            is_vip: createdClient.isVip,
            created_at: createdClient.createdAt,
            updated_at: createdClient.updatedAt,
            metadata: {
              tags: createdClient.tags,
              companions: createdClient.companions,
              initialNote: initialActivityNote,
            },
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (dbErr: any) {
        console.warn("Supabase workspace_travellers sync warning:", dbErr.message);
      }
    }

    return NextResponse.json({
      ok: true,
      client: createdClient,
      message: `Client dossier for ${createdClient.fullName} successfully created and cataloged.`,
    });
  } catch (err: any) {
    console.error("CRM clients POST error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to create client profile." },
      { status: 500 }
    );
  }
}
