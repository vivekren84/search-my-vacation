import { NextResponse } from "next/server";
import { AUTHORIZED_STAFF_ACCOUNTS, portalOtpStore, findStaffByEmailOrPhone } from "../store";
import { getSupabaseStaffUserByEmailOrPhone } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, code } = body;

    if (!identifier || typeof identifier !== "string" || !code || typeof code !== "string") {
      return NextResponse.json(
        { ok: false, message: "Identifier and verification code are required." },
        { status: 400 }
      );
    }

    let staff = findStaffByEmailOrPhone(identifier);

    // Fallback lookup in Supabase auth.users & workspace_users
    if (!staff) {
      const dbStaff = await getSupabaseStaffUserByEmailOrPhone(identifier);
      if (dbStaff) {
        AUTHORIZED_STAFF_ACCOUNTS[dbStaff.email.toLowerCase()] = dbStaff;
        staff = dbStaff;
      }
    }

    if (!staff) {
      return NextResponse.json(
        { ok: false, message: "Account not recognized. Traveller accounts opening soon" },
        { status: 404 }
      );
    }

    // Try looking up challenge by email or phone
    const challenge =
      portalOtpStore.getChallenge(staff.email) || portalOtpStore.getChallenge(staff.phoneE164);

    const inputCode = code.trim();

    // Check code match (or developer test code 123456 if in dev/preview)
    const isDevMatch =
      process.env.NODE_ENV !== "production" && inputCode === "123456";

    if ((challenge && challenge.code === inputCode) || isDevMatch) {
      // Clear challenge after successful verification
      portalOtpStore.deleteChallenge(staff.email);
      portalOtpStore.deleteChallenge(staff.phoneE164);

      return NextResponse.json({
        ok: true,
        staff: {
          fullName: staff.fullName,
          email: staff.email,
          role: staff.role,
          phoneE164: staff.phoneE164,
        },
      });
    }

    if (challenge) {
      challenge.attempts += 1;
      if (challenge.attempts >= 5) {
        portalOtpStore.deleteChallenge(staff.email);
        portalOtpStore.deleteChallenge(staff.phoneE164);
        return NextResponse.json(
          { ok: false, message: "Maximum verification attempts exceeded. Please request a new code." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { ok: false, message: "Invalid verification code. Please check your email or phone and try again." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Portal OTP verify error:", err);
    return NextResponse.json(
      { ok: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
