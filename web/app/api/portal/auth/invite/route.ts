import { NextResponse } from "next/server";
import { AUTHORIZED_STAFF_ACCOUNTS } from "../otp/store";
import { staffAuthService } from "@/lib/staff-portal/auth/service";
import { deleteSupabaseUserByEmail, setSupabaseUserActiveStatus } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phoneE164, role, temporaryPassword } = body;

    if (!fullName || !email || !phoneE164) {
      return NextResponse.json(
        { ok: false, message: "Full Name, Company Email, and Registered Mobile are required." },
        { status: 400 }
      );
    }

    const emailCleaned = email.trim().toLowerCase();
    const phoneCleaned = phoneE164.trim();
    const pass = temporaryPassword || "TemporaryDefaultPass#2026";

    // Register into active server staff directory
    AUTHORIZED_STAFF_ACCOUNTS[emailCleaned] = {
      fullName: fullName.trim(),
      email: emailCleaned,
      phoneE164: phoneCleaned,
      role: role || "desk_user",
      requiresPasswordChange: true,
      password: pass,
      status: "Pending First Login",
      deactivatedAt: null,
      invitedAt: new Date().toISOString().split("T")[0],
    };

    let emailSent = false;

    // 1. Dispatch real invitation email via Resend (NO OTP, Welcome & Credentials Only)
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.JOURNEY_LEAD_FROM_EMAIL || "bookings@searchmyvacation.com";

    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Search My Vacation Staff Portal <${fromEmail}>`,
            to: [emailCleaned],
            subject: `Welcome to Search My Vacation — Staff Advisor Workspace Invitation`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #2A211C; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div style="padding: 28px 32px; background-color: #362B25; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: center;">
                  <h1 style="color: #F5951C; font-size: 18px; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-weight: 700;">
                    Search My Vacation
                  </h1>
                  <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
                    Staff Advisor Workspace Invitation
                  </p>
                </div>
                <div style="padding: 32px;">
                  <p style="font-size: 15px; color: rgba(255,255,255,0.9); margin: 0 0 16px;">
                    Hello <strong>${fullName}</strong>,
                  </p>
                  <p style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 20px;">
                    You have been provisioned as a <strong>${(role || "desk_user").replace("_", " ")}</strong> in the Search My Vacation Staff Advisor Portal.
                  </p>
                  <div style="background-color: #1F1713; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 0 0 24px;">
                    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.5); margin: 0 0 8px;">
                      Your Login Credentials:
                    </p>
                    <p style="font-size: 13px; margin: 0 0 6px;">
                      <strong>Login URL:</strong> <a href="https://www.searchmyvacation.com/portal/login" style="color: #F5951C;">https://www.searchmyvacation.com/portal/login</a>
                    </p>
                    <p style="font-size: 13px; margin: 0 0 6px;">
                      <strong>Email:</strong> <span style="color: #F5951C;">${emailCleaned}</span>
                    </p>
                    <p style="font-size: 13px; margin: 0 0 6px;">
                      <strong>Registered Mobile:</strong> <span style="color: #F5951C;">${phoneCleaned}</span>
                    </p>
                    <p style="font-size: 13px; margin: 0;">
                      <strong>Temporary Password:</strong> <code style="background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 6px; font-family: monospace; color: #F5951C;">${pass}</code>
                    </p>
                  </div>
                  <div style="text-align: center; margin: 0 0 24px;">
                    <a href="https://www.searchmyvacation.com/portal/login" style="display: inline-block; background-color: #F5951C; color: #2A211C; padding: 12px 28px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-decoration: none;">
                      Sign In to Advisor Workspace
                    </a>
                  </div>
                  <p style="font-size: 11px; color: rgba(255,255,255,0.4); line-height: 1.5; margin: 0;">
                    🔒 <strong>Security Policy:</strong> You will be required to configure your own permanent password upon your initial sign-in.
                  </p>
                </div>
                <div style="padding: 16px 32px; background-color: #241B16; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 11px; color: rgba(255,255,255,0.4);">
                  Search My Vacation • Operations & Advisor Governance
                </div>
              </div>
            `,
            text: `Welcome to Search My Vacation Staff Advisor Workspace\n\nHello ${fullName},\n\nYou have been invited to the Search My Vacation Advisor Portal as ${(role || "desk_user").replace("_", " ")}.\n\nSign In: https://www.searchmyvacation.com/portal/login\nEmail: ${emailCleaned}\nTemporary Password: ${pass}\n\nYou will be prompted to set a permanent password upon first login.`,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
        } else {
          console.error("Invite email failed:", await resendRes.text());
        }
      } catch (err) {
        console.error("Invite email error:", err);
      }
    }

    // Explicit invariant: ZERO mobile OTP dispatched on invitation
    return NextResponse.json({
      ok: true,
      emailSent,
      message: "Invitation dispatched via email. Temporary password provided. No mobile OTP required.",
    });
  } catch (err: any) {
    console.error("Staff invite error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to dispatch invitation. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { email, status, action } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, message: "Valid email is required." }, { status: 400 });
    }

    const emailCleaned = email.trim().toLowerCase();

    // Self-Protection Guardrail: Super Admin cannot be deactivated
    if (emailCleaned === "vivek@searchmyvacation.com") {
      return NextResponse.json(
        { ok: false, message: "Super Admin account cannot be deactivated." },
        { status: 403 }
      );
    }

    const shouldDeactivate = status === "Inactive" || action === "deactivate";
    const nowIso = new Date().toISOString();

    // 1. Update in-memory authorized staff registry
    const account = AUTHORIZED_STAFF_ACCOUNTS[emailCleaned];
    if (account) {
      account.status = shouldDeactivate ? "Inactive" : "Active";
      account.deactivatedAt = shouldDeactivate ? nowIso : null;
    }

    // 2. Sync with staffAuthService
    try {
      const authUser = await staffAuthService.getUserByEmail(emailCleaned);
      if (authUser) {
        const adminUser = await staffAuthService.getUserByEmail("vivek@searchmyvacation.com");
        const adminId = adminUser?.userId || "89782ecc-b5f9-4e44-b9e5-db3e310a933e";
        if (shouldDeactivate) {
          await staffAuthService.deactivateStaffUser({
            actorAdminId: adminId,
            targetUserId: authUser.userId,
            reason: "Deactivated via Super Admin Governance",
          });
        } else {
          await staffAuthService.reactivateStaffUser({
            actorAdminId: adminId,
            targetUserId: authUser.userId,
            reason: "Reactivated via Super Admin Governance",
          });
        }
      }
    } catch (e: any) {
      console.warn("staffAuthService status sync warning:", e.message);
    }

    // 3. Sync with Supabase database (public.workspace_users & public.workspace_audit_log)
    await setSupabaseUserActiveStatus(emailCleaned, !shouldDeactivate);

    return NextResponse.json({
      ok: true,
      status: shouldDeactivate ? "Inactive" : "Active",
      message: `Staff account ${emailCleaned} status updated to ${shouldDeactivate ? "Inactive" : "Active"}.`,
    });
  } catch (err: any) {
    console.error("Staff status update error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to update staff account status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, message: "Valid email is required." }, { status: 400 });
    }

    const emailCleaned = email.trim().toLowerCase();

    // Self-Protection Guardrail: Super Admin cannot be deleted
    if (emailCleaned === "vivek@searchmyvacation.com") {
      return NextResponse.json(
        { ok: false, message: "Super Admin account cannot be deleted." },
        { status: 403 }
      );
    }

    // 1. Remove from in-memory server registry
    delete AUTHORIZED_STAFF_ACCOUNTS[emailCleaned];

    // 2. Remove from staffAuthService
    try {
      const authUser = await staffAuthService.getUserByEmail(emailCleaned);
      if (authUser) {
        const adminUser = await staffAuthService.getUserByEmail("vivek@searchmyvacation.com");
        const adminId = adminUser?.userId || "89782ecc-b5f9-4e44-b9e5-db3e310a933e";
        await staffAuthService.deleteStaffUser({
          actorAdminId: adminId,
          targetUserId: authUser.userId,
          reason: "Deleted via Super Admin Governance",
        });
      }
    } catch (e: any) {
      console.warn("staffAuthService delete warning:", e.message);
    }

    // 3. Delete from Supabase public.workspace_users & auth.users via Service Role
    const dbResult = await deleteSupabaseUserByEmail(emailCleaned);

    return NextResponse.json({
      ok: true,
      message: dbResult.message || `Staff account ${emailCleaned} removed from directory and database.`,
    });
  } catch (err: any) {
    console.error("Staff deletion error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to remove staff account." },
      { status: 500 }
    );
  }
}
