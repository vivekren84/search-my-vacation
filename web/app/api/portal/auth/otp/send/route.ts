import { NextResponse } from "next/server";
import { AUTHORIZED_STAFF_ACCOUNTS, portalOtpStore } from "../store";

export const runtime = "nodejs";

function findStaff(identifier: string) {
  const cleaned = identifier.trim().toLowerCase();
  const phoneCleaned = identifier.replace(/[\s\-()+]/g, "");

  // Match by email
  if (AUTHORIZED_STAFF_ACCOUNTS[cleaned]) {
    return AUTHORIZED_STAFF_ACCOUNTS[cleaned];
  }

  // Match by phone number
  for (const account of Object.values(AUTHORIZED_STAFF_ACCOUNTS)) {
    const accPhone = account.phoneE164.replace(/[\s\-()+]/g, "");
    if (
      accPhone === phoneCleaned ||
      (phoneCleaned.length >= 10 && accPhone.endsWith(phoneCleaned.slice(-10)))
    ) {
      return account;
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, channel } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { ok: false, message: "Please enter your email or registered mobile number." },
        { status: 400 }
      );
    }

    const staff = findStaff(identifier);
    if (!staff) {
      // PO MANDATED MESSAGE
      return NextResponse.json(
        { ok: false, message: "Account not recognized. Traveller accounts opening soon" },
        { status: 404 }
      );
    }

    // Generate cryptographic 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in memory challenges cache for both email and phone identifiers
    portalOtpStore.saveChallenge({
      identifier: staff.email,
      code,
      channel: channel === "sms" ? "sms" : "email",
      expiresAt,
      attempts: 0,
      staff,
    });
    portalOtpStore.saveChallenge({
      identifier: staff.phoneE164,
      code,
      channel: channel === "sms" ? "sms" : "email",
      expiresAt,
      attempts: 0,
      staff,
    });

    const destination = channel === "sms" ? staff.phoneE164 : staff.email;

    // Dispatch via Resend for email channel
    if (channel === "email" || !channel) {
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.JOURNEY_LEAD_FROM_EMAIL || "bookings@searchmyvacation.com";

      if (resendApiKey) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `Search My Vacation Staff Portal <${fromEmail}>`,
              to: [staff.email],
              subject: `Search My Vacation — Verification Code: ${code}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #2A211C; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                  <div style="padding: 28px 32px; background-color: #362B25; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: center;">
                    <h1 style="color: #F5951C; font-size: 16px; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-weight: 700;">
                      Search My Vacation
                    </h1>
                    <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
                      Staff Advisor Portal Access
                    </p>
                  </div>
                  <div style="padding: 32px;">
                    <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 20px;">
                      Hello <strong>${staff.fullName}</strong>,
                    </p>
                    <p style="font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; margin: 0 0 24px;">
                      Use the 6-digit single-channel verification code below to authenticate into the Staff Advisor Portal. This code is valid for 10 minutes.
                    </p>
                    <div style="background-color: #1F1713; border: 2px dashed #F5951C; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
                      <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #F5951C;">
                        ${code}
                      </span>
                    </div>
                    <p style="font-size: 11px; color: rgba(255,255,255,0.4); line-height: 1.5; margin: 0;">
                      🔒 <strong>Security Notice:</strong> If you did not initiate this login request, please contact your Super Admin immediately. Never share your verification code with anyone.
                    </p>
                  </div>
                  <div style="padding: 16px 32px; background-color: #241B16; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 11px; color: rgba(255,255,255,0.4);">
                    Search My Vacation • Internal Advisor Security Protocol
                  </div>
                </div>
              `,
              text: `Search My Vacation — Staff Advisor Portal Verification Code\n\nHello ${staff.fullName},\n\nYour 6-digit verification code is: ${code}\n\nThis code is valid for 10 minutes.\nIf you did not request this code, please inform your Super Admin immediately.`,
            }),
          });

          if (!emailResponse.ok) {
            console.error("Resend delivery failed:", await emailResponse.text());
          }
        } catch (err) {
          console.error("Resend API error:", err);
        }
      }
    }

    // Dispatch via SMS provider for sms channel if configured
    if (channel === "sms") {
      const smsApiKey = process.env.SMS_PROVIDER_API_KEY;
      const senderId = process.env.SMS_PROVIDER_SENDER_ID;
      const templateId = process.env.SMS_PROVIDER_TEMPLATE_ID;

      if (smsApiKey && senderId && templateId) {
        try {
          const mobileDigits = staff.phoneE164.replace(/^\+/, "");
          await fetch("https://control.msg91.com/api/v5/otp", {
            method: "POST",
            headers: {
              authkey: smsApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mobile: mobileDigits,
              sender: senderId,
              template_id: templateId,
              otp: code,
              otp_expiry: 10,
            }),
          });
        } catch (smsErr) {
          console.error("MSG91 SMS delivery error:", smsErr);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      destination,
      channel: channel === "sms" ? "sms" : "email",
      message: `Verification code dispatched to ${destination}. Valid for 10 minutes.`,
    });
  } catch (err: any) {
    console.error("Portal OTP send error:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    );
  }
}
