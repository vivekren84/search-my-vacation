import { NextResponse } from "next/server";
import { PATCH as handleInvitePatch, DELETE as handleInviteDelete } from "../invite/route";
import { AUTHORIZED_STAFF_ACCOUNTS } from "../otp/store";

export const runtime = "nodejs";

/**
 * GET /api/portal/auth/users
 * Returns list of authorized staff accounts (without password hashes)
 */
export async function GET() {
  const users = Object.values(AUTHORIZED_STAFF_ACCOUNTS).map((u) => ({
    fullName: u.fullName,
    email: u.email,
    phoneE164: u.phoneE164,
    role: u.role,
    status: u.status || "Active",
    requiresPasswordChange: u.requiresPasswordChange || false,
    invitedAt: u.invitedAt,
    deactivatedAt: u.deactivatedAt || null,
  }));

  return NextResponse.json({ ok: true, users });
}

/**
 * PATCH /api/portal/auth/users
 * Toggles user active / inactive status with database sync and session invalidation
 */
export async function PATCH(request: Request) {
  return handleInvitePatch(request);
}

/**
 * DELETE /api/portal/auth/users
 * Permanently deletes user across server registry and Supabase database (auth.users & workspace_users)
 */
export async function DELETE(request: Request) {
  return handleInviteDelete(request);
}
