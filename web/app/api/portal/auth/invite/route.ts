import { NextResponse } from "next/server";
import { AUTHORIZED_STAFF_ACCOUNTS } from "../otp/store";

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

    // Register into active staff directory
    AUTHORIZED_STAFF_ACCOUNTS[emailCleaned] = {
      fullName: fullName.trim(),
      email: emailCleaned,
      phoneE164: phoneCleaned,
      role: role || "desk_user",
      requiresPasswordChange: true,
    };

    let emailSent = false;
    let smsSent = false;

    // 1. Dispatch real invitation email via Resend
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
                    <p style="font-size: 11px; text-transform: uppercase; tracking: 1px; color: rgba(255,255,255,0.5); margin: 0 0 8px;">
                      Your Temporary Login Credentials:
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

    // 2. Dispatch SMS notification via MSG91
    const smsApiKey = process.env.SMS_PROVIDER_API_KEY;
    const senderId = process.env.SMS_PROVIDER_SENDER_ID;
    const templateId = process.env.SMS_PROVIDER_TEMPLATE_ID;

    if (smsApiKey && senderId && templateId && phoneCleaned) {
      try {
        const mobileDigits = phoneCleaned.replace(/^\+/, "").replace(/[\s\-()]/g, "");
        const smsRes = await fetch("https://control.msg91.com/api/v5/otp", {
          method: "POST",
          headers: {
            authkey: smsApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobileDigits,
            sender: senderId,
            template_id: templateId,
            otp: "123456",
            otp_expiry: 60,
          }),
        });
        if (smsRes.ok) {
          smsSent = true;
        }
      } catch (smsErr) {
        console.error("Invite SMS error:", smsErr);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      smsSent,
      message: `Invitation successfully dispatched to ${emailCleaned}. Account provisioned as ${(role || "desk_user").replace("_", " ")}.`,
    });
  } catch (err: any) {
    console.error("Staff invite error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to dispatch invitation. Please try again." },
      { status: 500 }
    );
  }
}
