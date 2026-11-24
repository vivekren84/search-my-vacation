import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/portal/profile?email=... OR ?userId=...
 * Returns full atelier profile + governance fields
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const userId = searchParams.get("userId")?.trim();

    if (!email && !userId) {
      return NextResponse.json(
        { ok: false, message: "Email or userId query parameter is required." },
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
    };

    // 1. Fetch Auth Users to match email/userId
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (!authRes.ok) {
      return NextResponse.json(
        { ok: false, message: "Failed to query auth service." },
        { status: 502 }
      );
    }

    const authData = await authRes.json();
    const authUsers: any[] = authData.users || [];
    const matchedAuthUser = authUsers.find((u) => {
      if (userId && u.id === userId) return true;
      if (email && u.email?.toLowerCase().trim() === email) return true;
      return false;
    });

    if (!matchedAuthUser) {
      return NextResponse.json(
        { ok: false, message: "Staff user account not found." },
        { status: 404 }
      );
    }

    const resolvedUserId = matchedAuthUser.id;
    const normalizedEmail = matchedAuthUser.email.toLowerCase().trim();

    // 2. Fetch workspace_users record
    const wuRes = await fetch(
      `${projectUrl}/rest/v1/workspace_users?user_id=eq.${resolvedUserId}&select=*`,
      { headers, signal: AbortSignal.timeout(6000) }
    );

    let wuRecord: any = null;
    if (wuRes.ok) {
      const wuData = await wuRes.json();
      if (wuData && wuData.length > 0) wuRecord = wuData[0];
    }

    const meta = matchedAuthUser.user_metadata || {};
    const role =
      normalizedEmail === "vivek@searchmyvacation.com"
        ? "super_admin"
        : (wuRecord?.role || meta.role || "desk_user");

    const profile = {
      userId: resolvedUserId,
      email: normalizedEmail,
      fullName: wuRecord?.display_name || meta.full_name || normalizedEmail.split("@")[0],
      phoneE164: wuRecord?.registered_mobile || meta.registered_mobile || "",
      role,
      professionalTitle: wuRecord?.professional_title || "Travel Atelier Advisor",
      department: wuRecord?.department || "Bespoke Travel Atelier",
      destinationSpecializations: wuRecord?.destination_specializations || [
        "Kashmir",
        "Vietnam",
        "Rajasthan",
      ],
      spokenLanguages: wuRecord?.spoken_languages || ["English", "Tamil"],
      signatureArchetype:
        wuRecord?.signature_archetype || "Slow-Paced Cultural Immersion",
      clientBio:
        wuRecord?.client_bio ||
        "Dedicated slow-travel atelier curator specializing in unhurried journeys, cultural heritage, and bespoke private moments.",
      timezoneWorkingHours:
        wuRecord?.timezone_working_hours || "Asia/Kolkata (09:30 - 18:30)",
      emergencyStandbyContact: wuRecord?.emergency_standby_contact || "",
      avatarPresetId: wuRecord?.avatar_preset_id || "monogram",
      avatarImageUrl: wuRecord?.avatar_image_url || null,
      createdAt: wuRecord?.created_at || matchedAuthUser.created_at,
      updatedAt: wuRecord?.updated_at || matchedAuthUser.updated_at,
    };

    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    console.error("Profile GET error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to load profile." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/portal/profile
 * Updates editable atelier fields
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      email,
      fullName,
      professionalTitle,
      department,
      destinationSpecializations,
      spokenLanguages,
      signatureArchetype,
      clientBio,
      timezoneWorkingHours,
      emergencyStandbyContact,
      avatarPresetId,
      avatarImageUrl,
      // Attempted governance mutations (must be verified or rejected)
      role,
      phoneE164,
    } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { ok: false, message: "User identifier is required." },
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

    // Determine target user ID
    let targetUserId = userId;
    if (!targetUserId && email) {
      const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        headers,
      });
      if (authRes.ok) {
        const data = await authRes.json();
        const found = (data.users || []).find(
          (u: any) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
        );
        if (found) targetUserId = found.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { ok: false, message: "User not found in system." },
        { status: 404 }
      );
    }

    // Verify existing record to protect governance fields
    const existingRes = await fetch(
      `${projectUrl}/rest/v1/workspace_users?user_id=eq.${targetUserId}&select=role,registered_mobile`,
      { headers }
    );
    const existing = existingRes.ok ? (await existingRes.json())[0] : null;

    // Check if non-super_admin tried to mutate locked governance fields
    const callerEmail = email?.toLowerCase().trim();
    const isSuperAdmin = callerEmail === "vivek@searchmyvacation.com";

    if (!isSuperAdmin) {
      if (role && existing && role !== existing.role) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Governance lock: Permission tier cannot be changed from the profile page. Please contact the Super Admin.",
          },
          { status: 403 }
        );
      }
      if (phoneE164 && existing && phoneE164 !== existing.registered_mobile) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Governance lock: Registered OTP mobile number cannot be modified without Super Admin authorization.",
          },
          { status: 403 }
        );
      }
    }

    // Patch public.workspace_users
    const patchBody: Record<string, any> = {
      display_name: fullName?.trim(),
      professional_title: professionalTitle?.trim(),
      department: department?.trim(),
      destination_specializations: destinationSpecializations,
      spoken_languages: spokenLanguages,
      signature_archetype: signatureArchetype?.trim(),
      client_bio: clientBio?.trim(),
      timezone_working_hours: timezoneWorkingHours?.trim(),
      emergency_standby_contact: emergencyStandbyContact?.trim(),
      avatar_preset_id: avatarPresetId || "monogram",
      avatar_image_url: avatarImageUrl || null,
      updated_at: new Date().toISOString(),
    };

    if (isSuperAdmin && role) {
      patchBody.role = role === "super_admin" ? "administrator" : role;
    }
    if (isSuperAdmin && phoneE164) {
      patchBody.registered_mobile = phoneE164.trim();
    }

    const patchRes = await fetch(
      `${projectUrl}/rest/v1/workspace_users?user_id=eq.${targetUserId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(patchBody),
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return NextResponse.json(
        { ok: false, message: `Database update failed: ${errText}` },
        { status: 500 }
      );
    }

    // Update full_name in auth user metadata as well
    if (fullName) {
      try {
        await fetch(`${projectUrl}/auth/v1/admin/users/${targetUserId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            user_metadata: {
              full_name: fullName.trim(),
            },
          }),
        });
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      message: "Atelier profile updated successfully.",
    });
  } catch (err: any) {
    console.error("Profile PUT error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
