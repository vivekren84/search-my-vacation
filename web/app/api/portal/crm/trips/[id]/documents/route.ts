import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAdminHeaders, resolveStaffCaller } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

const VALID_CATEGORIES = new Set([
  "Hotel Voucher",
  "Cab/Transfer",
  "Tickets",
  "Visa/Insurance",
  "Client ID",
  "Accepted Itinerary",
]);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = String(formData.get("category") || "Hotel Voucher");
    const callerEmail = String(formData.get("callerEmail") || "");
    const callerName = String(formData.get("callerName") || "");
    const callerRole = String(formData.get("callerRole") || "");

    if (!file) {
      return NextResponse.json({ ok: false, message: "File is required." }, { status: 400 });
    }
    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json({ ok: false, message: `Invalid document category: ${category}` }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, message: "File exceeds 10 MB limit." }, { status: 400 });
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const caller = await resolveStaffCaller(request, callerEmail, callerName, callerRole);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${id}/${Date.now()}_${safeName}`;
    const arrayBuf = await file.arrayBuffer();

    const uploadRes = await fetch(
      `${config.projectUrl}/storage/v1/object/trip-documents/${storagePath}`,
      {
        method: "POST",
        headers: {
          apikey: config.secretKey,
          Authorization: `Bearer ${config.secretKey}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: arrayBuf,
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json({ ok: false, message: `Storage upload failed: ${errText}` }, { status: 502 });
    }

    const headers = getAdminHeaders(config.secretKey, { Prefer: "return=representation" });
    const insertRes = await fetch(`${config.projectUrl}/rest/v1/workspace_trip_documents`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip_id: id,
        category,
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type || null,
        file_size: file.size,
        uploaded_by: caller.userId,
        uploaded_by_name: caller.displayName,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ ok: false, message: `Metadata save failed: ${errText}` }, { status: 502 });
    }

    const [doc] = await insertRes.json();

    // Auto-check itinerary_exported readiness flag when an Accepted Itinerary is attached
    if (category === "Accepted Itinerary") {
      try {
        const tripRes = await fetch(
          `${config.projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}&select=readiness_checklist`,
          { headers, signal: AbortSignal.timeout(4000) }
        );
        if (tripRes.ok) {
          const [tripRow] = await tripRes.json();
          const nextChecklist = {
            ...(tripRow?.readiness_checklist || {}),
            itinerary_exported: true,
          };
          await fetch(
            `${config.projectUrl}/rest/v1/workspace_trips?id=eq.${encodeURIComponent(id)}`,
            {
              method: "PATCH",
              headers,
              body: JSON.stringify({ readiness_checklist: nextChecklist, updated_at: new Date().toISOString() }),
              signal: AbortSignal.timeout(4000),
            }
          );
        }
      } catch {
        // Non-blocking readiness auto-sync
      }
    }

    return NextResponse.json({ ok: true, document: doc, message: `Uploaded ${file.name} to ${category}.` });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Document upload failed." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get("docId");
    const storagePath = searchParams.get("storagePath");

    if (!docId) {
      return NextResponse.json({ ok: false, message: "docId is required." }, { status: 400 });
    }
    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const headers = getAdminHeaders(config.secretKey);
    if (storagePath) {
      await fetch(`${config.projectUrl}/storage/v1/object/trip-documents/${storagePath}`, {
        method: "DELETE",
        headers,
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }

    await fetch(
      `${config.projectUrl}/rest/v1/workspace_trip_documents?id=eq.${encodeURIComponent(docId)}&trip_id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers, signal: AbortSignal.timeout(5000) }
    );

    return NextResponse.json({ ok: true, message: "Document deleted." });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || "Failed to delete document." }, { status: 500 });
  }
}
