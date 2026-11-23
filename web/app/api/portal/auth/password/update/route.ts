import { NextResponse } from "next/server";
import { AUTHORIZED_STAFF_ACCOUNTS } from "../../otp/store";
import { updateSupabaseUserPassword, getSupabaseStaffUserByEmailOrPhone } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || typeof email !== "string" || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { ok: false, message: "Email and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number.",
        },
        { status: 400 }
      );
    }

    const emailCleaned = email.trim().toLowerCase();
    let staff = AUTHORIZED_STAFF_ACCOUNTS[emailCleaned];

    if (!staff) {
      const dbStaff = await getSupabaseStaffUserByEmailOrPhone(emailCleaned);
      if (dbStaff) {
        AUTHORIZED_STAFF_ACCOUNTS[emailCleaned] = dbStaff;
        staff = dbStaff;
      }
    }

    if (!staff) {
      return NextResponse.json(
        { ok: false, message: "Staff account not found." },
        { status: 404 }
      );
    }

    // Update password and clear forced rotation flag
    staff.password = newPassword;
    staff.requiresPasswordChange = false;
    staff.status = "Active";

    // Synchronize password with Supabase auth
    await updateSupabaseUserPassword(emailCleaned, newPassword);

    return NextResponse.json({
      ok: true,
      message: "Password successfully updated and account activated.",
      staff: {
        fullName: staff.fullName,
        email: staff.email,
        role: staff.role,
        phoneE164: staff.phoneE164,
      },
    });
  } catch (err: any) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to update password." },
      { status: 500 }
    );
  }
}
