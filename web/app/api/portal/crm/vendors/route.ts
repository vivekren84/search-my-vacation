import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { normalizeDestinationServer } from "@/lib/portal/destination-normalize";

export const runtime = "nodejs";

/**
 * GET /api/portal/crm/vendors
 * Returns vendor directory list with optional search and category filters.
 * Accessible to ALL staff (super_admin, administrator, privilege_user, desk_user).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim().toLowerCase();
    const query = searchParams.get("query")?.trim().toLowerCase();

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

    let url = `${projectUrl}/rest/v1/workspace_vendors?select=*&order=name.asc`;
    if (category && category !== "all") {
      url += `&category=eq.${encodeURIComponent(category)}`;
    }

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to query vendors: ${errText}` },
        { status: 502 }
      );
    }

    const vendors: any[] = await res.json();

    const filtered = query
      ? vendors.filter((v) => {
          return (
            (v.name && v.name.toLowerCase().includes(query)) ||
            (v.vendor_code && v.vendor_code.toLowerCase().includes(query)) ||
            (v.destination && v.destination.toLowerCase().includes(query)) ||
            (v.region && v.region.toLowerCase().includes(query)) ||
            (v.poc_name && v.poc_name.toLowerCase().includes(query)) ||
            (v.poc_mobile && v.poc_mobile.includes(query)) ||
            (v.email && v.email.toLowerCase().includes(query))
          );
        })
      : vendors;

    return NextResponse.json({
      ok: true,
      vendors: filtered,
      count: filtered.length,
      totalCount: vendors.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/crm/vendors
 * Creates a new vendor record in public.workspace_vendors.
 * RBAC: Restricted to super_admin, administrator, privilege_user. (Blocked for desk_user).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const callerRole = (request.headers.get("x-staff-role") || body.callerRole || "").toLowerCase().trim();
    const callerEmail = (request.headers.get("x-staff-email") || body.callerEmail || "").toLowerCase().trim();

    // RBAC Check: desk_user cannot add vendors
    if (callerRole === "desk_user" && callerEmail !== "vivek@searchmyvacation.com") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Permission Denied: Desk Users cannot register vendors. Only Privilege Users, Administrators, and Super Admin hold vendor onboarding authorization.",
        },
        { status: 403 }
      );
    }

    const {
      name,
      category,
      destination,
      region,
      star_rating,
      poc_name,
      poc_mobile,
      office_phone,
      email,
      website,
      address,
      rate_card_link,
      b2b_rates,
      comments,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, message: "Vendor name is required." },
        { status: 400 }
      );
    }

    const validCategories = ["property", "cab", "dmc", "agency", "activity", "other"];
    const normalizedCategory = category?.toLowerCase().trim() || "property";
    if (!validCategories.includes(normalizedCategory)) {
      return NextResponse.json(
        { ok: false, message: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    // Brand tone check: ZERO occurrences of forbidden term
    const payloadStr = JSON.stringify(body).toLowerCase();
    if (/\bluxury\b/.test(payloadStr)) {
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
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const normalizedVendorDest = destination?.trim()
      ? await normalizeDestinationServer(destination, projectUrl, secretKey, {
          allowTitleCaseUnlisted: true,
        })
      : null;

    const vendorPayload = {
      name: name.trim(),
      category: normalizedCategory,
      destination: normalizedVendorDest,
      region: region?.trim() || null,
      star_rating: star_rating?.trim() || null,
      poc_name: poc_name?.trim() || null,
      poc_mobile: poc_mobile?.trim() || null,
      office_phone: office_phone?.trim() || null,
      email: email?.trim() || null,
      website: website?.trim() || null,
      address: address?.trim() || null,
      rate_card_link: rate_card_link?.trim() || null,
      b2b_rates: b2b_rates?.trim() || null,
      comments: comments?.trim() || null,
      is_active: true,
    };

    const res = await fetch(`${projectUrl}/rest/v1/workspace_vendors`, {
      method: "POST",
      headers,
      body: JSON.stringify(vendorPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to create vendor: ${errText}` },
        { status: 502 }
      );
    }

    const [created] = await res.json();
    return NextResponse.json({
      ok: true,
      message: `Vendor ${created.name} (${created.vendor_code}) created successfully.`,
      vendor: created,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portal/crm/vendors
 * Updates an existing vendor record.
 * RBAC: Restricted to super_admin, administrator, privilege_user. (Blocked for desk_user).
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const callerRole = (request.headers.get("x-staff-role") || body.callerRole || "").toLowerCase().trim();
    const callerEmail = (request.headers.get("x-staff-email") || body.callerEmail || "").toLowerCase().trim();

    // RBAC Check: desk_user cannot edit vendors
    if (callerRole === "desk_user" && callerEmail !== "vivek@searchmyvacation.com") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Permission Denied: Desk Users cannot edit vendor records. Editing requires Privilege User, Administrator, or Super Admin authorization.",
        },
        { status: 403 }
      );
    }

    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Vendor ID is required for updates." },
        { status: 400 }
      );
    }

    // Brand tone check: ZERO occurrences of forbidden term
    const payloadStr = JSON.stringify(updates).toLowerCase();
    if (/\bluxury\b/.test(payloadStr)) {
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
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    delete updates.callerRole;
    delete updates.callerEmail;
    if (typeof updates.destination === "string" && updates.destination.trim()) {
      updates.destination = await normalizeDestinationServer(
        updates.destination,
        projectUrl,
        secretKey,
        { allowTitleCaseUnlisted: true }
      );
    }
    updates.updated_at = new Date().toISOString();

    const res = await fetch(`${projectUrl}/rest/v1/workspace_vendors?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to update vendor: ${errText}` },
        { status: 502 }
      );
    }

    const updated = await res.json();
    return NextResponse.json({
      ok: true,
      message: "Vendor record successfully updated.",
      vendor: updated[0] || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portal/crm/vendors
 * Permanently deletes a vendor record.
 * RBAC: Restricted STRICTLY to super_admin (Vivek Renganathan) ONLY.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const callerRole = (request.headers.get("x-staff-role") || searchParams.get("role") || "").toLowerCase().trim();
    const callerEmail = (request.headers.get("x-staff-email") || searchParams.get("email") || "").toLowerCase().trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // Strict Super Admin check
    const isSuperAdmin = callerRole === "super_admin" || callerEmail === "vivek@searchmyvacation.com";
    if (!isSuperAdmin) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Governance Lock: Vendor records can only be permanently deleted by the Super Admin (Vivek Renganathan).",
        },
        { status: 403 }
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
    };

    const res = await fetch(`${projectUrl}/rest/v1/workspace_vendors?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, message: `Failed to delete vendor: ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Vendor record permanently removed from atelier directory.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
