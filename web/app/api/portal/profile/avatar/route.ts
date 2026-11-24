import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 524288; // 500 KB limit
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * POST /api/portal/profile/avatar
 * Handles client-cropped studio portrait uploads into staff-avatars storage bucket
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, imageBase64, mimeType = "image/webp" } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { ok: false, message: "Image data is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unsupported format. Please upload WebP, PNG, or JPEG.",
        },
        { status: 400 }
      );
    }

    // Strip data URI scheme prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9.-]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          message: `Avatar file exceeds 500 KB limit (${Math.round(buffer.length / 1024)} KB). Please crop or compress before uploading.`,
        },
        { status: 400 }
      );
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json(
        { ok: false, message: "Storage service configuration missing." },
        { status: 500 }
      );
    }

    const { projectUrl, secretKey } = config;
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
    };

    // Resolve userId if only email was passed
    let targetUserId = userId;
    if (!targetUserId && email) {
      const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        headers: { ...headers, "Content-Type": "application/json" },
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
        { ok: false, message: "Staff user not found for avatar upload." },
        { status: 404 }
      );
    }

    const ext = mimeType === "image/png" ? "png" : mimeType === "image/jpeg" ? "jpg" : "webp";
    const fileName = `avatar-${Date.now()}.${ext}`;
    const storagePath = `${targetUserId}/${fileName}`;

    // Upload to Supabase Storage bucket: staff-avatars
    const uploadRes = await fetch(
      `${projectUrl}/storage/v1/object/staff-avatars/${storagePath}`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": mimeType,
          "x-upsert": "true",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json(
        { ok: false, message: `Failed to upload to storage: ${errText}` },
        { status: 500 }
      );
    }

    // Public URL
    const publicUrl = `${projectUrl}/storage/v1/object/public/staff-avatars/${storagePath}`;

    // Update avatar_image_url in workspace_users
    await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${targetUserId}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_image_url: publicUrl,
        updated_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      ok: true,
      avatarUrl: publicUrl,
      message: "Studio portrait successfully uploaded and updated.",
    });
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to process avatar upload." },
      { status: 500 }
    );
  }
}
