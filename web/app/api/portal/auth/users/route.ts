import { NextResponse } from "next/server";
import { PATCH as handleInvitePatch, DELETE as handleInviteDelete } from "../invite/route";
import { AUTHORIZED_STAFF_ACCOUNTS } from "../otp/store";
import { getSupabaseStaffUsers } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/portal/auth/users
 * Returns list of authorized staff accounts synchronized with Supabase database
 */
export async function GET() {
  const dbUsers = await getSupabaseStaffUsers();

  const userMap = new Map<string, any>();

  // 1. Add in-memory authorized accounts first (Vivek, Tiger, and any warm invites)
  for (const u of Object.values(AUTHORIZED_STAFF_ACCOUNTS)) {
    if (u.email === "sri@searchmyvacation.com" || u.email === "keerthi@searchmyvacation.com") continue;
    userMap.set(u.email.toLowerCase(), {
      fullName: u.fullName,
      email: u.email,
      phoneE164: u.phoneE164,
      role: u.role,
      status: u.status || "Active",
      requiresPasswordChange: u.requiresPasswordChange || false,
      invitedAt: u.invitedAt,
      deactivatedAt: u.deactivatedAt || null,
    });
  }

  // 2. Overlay live Supabase database accounts
  for (const dbu of dbUsers) {
    if (dbu.email === "sri@searchmyvacation.com" || dbu.email === "keerthi@searchmyvacation.com") continue;
    userMap.set(dbu.email.toLowerCase(), dbu);
  }

  // Always ensure Super Admin Vivek is at the top
  const users = Array.from(userMap.values()).sort((a, b) => {
    if (a.email.toLowerCase() === "vivek@searchmyvacation.com") return -1;
    if (b.email.toLowerCase() === "vivek@searchmyvacation.com") return 1;
    return a.fullName.localeCompare(b.fullName);
  });

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
