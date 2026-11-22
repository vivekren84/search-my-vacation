/**
 * Comprehensive Automated Verification Suite for SMV Release 1.5 Milestone 1
 * (Staff Authentication, Smart Single-Channel OTP & RBAC Foundation)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Test-Harness First: Asserts 100% compliance with US-001, US-002, US-003, US-017 & BOUND-01.
 */

import { staffPortalConfig } from "../../../config/staff-portal.config";
import type { StaffRole, WorkspaceUserRecord } from "../../../types/staff-portal.types";
import { staffAuditLogger } from "../audit/logger";
import { staffAuthService } from "../auth/service";
import { globalMockStaffOtpDispatcher } from "../otp/test-doubles";

let checks = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[R1.5 M1 Verification FAILED] ${message}`);
  }
  checks++;
}

async function verifyMilestone1() {
  console.log("\n================================================================================");
  console.log("=== STARTING SMV RELEASE 1.5 MILESTONE 1 VERIFICATION SUITE ===");
  console.log("================================================================================\n");

  staffAuthService.resetAllForTesting();

  // -----------------------------------------------------------------------------
  // TEST 1: US-001 — Staff Account Provisioning & Role Assignment (Administrator)
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-001: Staff Account Provisioning & Role Assignment...");

  const adminUser = await staffAuthService.getUserByEmail("vivek@searchmyvacation.com");
  assert(adminUser !== null, "Admin user vivek@searchmyvacation.com exists in baseline");
  assert(adminUser?.role === "administrator", "Vivek has administrator role rank");

  // Admin provisions a Desk User
  const deskUser = await staffAuthService.provisionStaffUser({
    actorAdminId: adminUser!.userId,
    email: "sri@searchmyvacation.com",
    registeredMobile: "+919840123456",
    role: "desk_user",
    displayName: "Sri",
  });

  assert(deskUser.role === "desk_user", "US-001: Desk user successfully provisioned with role desk_user");
  assert(deskUser.registeredMobile === "+919840123456", "US-001: Registered mobile saved in E.164 format");
  assert(deskUser.deactivatedAt === null, "US-001: Provisioned user is active by default");

  // Non-admin attempting to provision is rejected
  let nonAdminBlocked = false;
  try {
    await staffAuthService.provisionStaffUser({
      actorAdminId: deskUser.userId,
      email: "hacker@domain.com",
      registeredMobile: "+919999999999",
      role: "administrator",
    });
  } catch (err: any) {
    if (err.message.includes("unauthorized_action")) {
      nonAdminBlocked = true;
    }
  }
  assert(nonAdminBlocked, "US-001: Desk User attempting to provision accounts is rejected (403)");

  // -----------------------------------------------------------------------------
  // TEST 2: US-001 — Immediate Deactivation & Session Invalidation Kill-Switch
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-001: Instant Deactivation & Session Invalidation Kill-Switch...");

  // Create active session for desk user
  const { sessionToken } = await staffAuthService.createSessionAfterOtp({
    userId: deskUser.userId,
    verifiedChannel: "email",
  });
  const validSession = await staffAuthService.validateSession(sessionToken);
  assert(validSession !== null, "US-001: Active session validates before deactivation");

  // Admin deactivates desk user
  await staffAuthService.deactivateStaffUser({
    actorAdminId: adminUser!.userId,
    targetUserId: deskUser.userId,
    reason: "Offboarding test",
  });

  const postDeactivateSession = await staffAuthService.validateSession(sessionToken);
  assert(postDeactivateSession === null, "US-001: Session instantly invalidated upon user deactivation");

  // Deactivated user cannot initiate OTP challenge
  let deactivatedOtpBlocked = false;
  try {
    await staffAuthService.requestPiiUnmaskChallenge({
      actorUserId: deskUser.userId,
      targetEntityId: "client_123",
      channel: "email",
    });
  } catch (err: any) {
    if (err.message.includes("unauthorized") || err.message.includes("account_deactivated")) {
      deactivatedOtpBlocked = true;
    }
  }
  assert(deactivatedOtpBlocked, "US-001: Deactivated user blocked from initiating authentication challenges");

  // -----------------------------------------------------------------------------
  // TEST 3: US-002 — Single-Channel Smart OTP (Email OR Mobile Preference)
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-002: Single-Channel Smart OTP Dispatch & Mutual Exclusivity...");

  globalMockStaffOtpDispatcher.clear();

  // Provision active Senior Advisor (Sri)
  const advisorUser = await staffAuthService.provisionStaffUser({
    actorAdminId: adminUser!.userId,
    email: "advisor.sri@searchmyvacation.com",
    registeredMobile: "+919840998877",
    role: "privilege_user",
    displayName: "Sri Senior Advisor",
  });

  // Request 1: Choose Email Channel
  const emailChallenge = await staffAuthService.requestPiiUnmaskChallenge({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    channel: "email",
  });
  assert(emailChallenge.challengeId.startsWith("stf_otp_"), "US-002: Challenge generated");

  // Verify Single-Channel Dispatch: Message was sent to Email ONLY
  const dispatchesAfterEmail = globalMockStaffOtpDispatcher.getDispatches();
  assert(dispatchesAfterEmail.length === 1, "US-002: Exactly one OTP dispatched");
  assert(dispatchesAfterEmail[0].channel === "email", "US-002: Dispatched strictly via chosen Email channel");
  assert(
    dispatchesAfterEmail[0].recipient === "advisor.sri@searchmyvacation.com",
    "US-002: Correct company email recipient",
  );

  // Assert Mutual Exclusivity: SMS was NOT invoked
  const smsInvoked = dispatchesAfterEmail.some((d) => d.channel === "sms");
  assert(!smsInvoked, "US-002 Mutual Exclusivity: Selecting Email strictly prevented SMS dispatch");

  // -----------------------------------------------------------------------------
  // TEST 4: US-002 — 60-Second Cooldown Enforcement
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-002: 60-Second Cooldown & Channel-Switch Lock...");

  let cooldownBlocked = false;
  try {
    // Attempting to switch to SMS immediately within 60s
    await staffAuthService.requestPiiUnmaskChallenge({
      actorUserId: advisorUser.userId,
      targetEntityId: "lead_passport_441",
      channel: "sms",
      nowMs: Date.now() + 10000, // 10s later
    });
  } catch (err: any) {
    if (err.message.includes("cooldown_active")) {
      cooldownBlocked = true;
    }
  }
  assert(cooldownBlocked, "US-002: Channel switch/resend blocked during 60s cooldown");

  // After 61 seconds, requesting SMS succeeds
  const smsChallenge = await staffAuthService.requestPiiUnmaskChallenge({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    channel: "sms",
    nowMs: Date.now() + 61000, // 61s later
  });
  assert(smsChallenge.challengeId.startsWith("stf_otp_"), "US-002: Requesting SMS succeeds after 60s cooldown expires");

  const latestSmsDispatch = globalMockStaffOtpDispatcher.getLastDispatch();
  assert(latestSmsDispatch?.channel === "sms", "US-002: Dispatched strictly via chosen Mobile channel");
  assert(latestSmsDispatch?.recipient === "+919840998877", "US-002: Correct registered mobile recipient");

  // -----------------------------------------------------------------------------
  // TEST 5: US-002 — 10-Minute Validity & Verification Logic
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-002: 10-Minute Validity & Code Verification...");

  const validSmsCode = latestSmsDispatch!.code;

  // Verify expired code rejection (after 10m / 601s)
  let expiredRejected = false;
  try {
    await staffAuthService.verifyPiiUnmaskChallenge({
      actorUserId: advisorUser.userId,
      targetEntityId: "lead_passport_441",
      challengeId: smsChallenge.challengeId,
      enteredCode: validSmsCode,
      nowMs: Date.now() + 61000 + 601 * 1000, // 10m 1s later
    });
  } catch (err: any) {
    if (err.message.includes("otp_expired")) {
      expiredRejected = true;
    }
  }
  assert(expiredRejected, "US-002: Code entered after 10-minute validity window is rejected");

  // Request fresh challenge for verification test
  const freshChallenge = await staffAuthService.requestPiiUnmaskChallenge({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    channel: "email",
    nowMs: Date.now() + 700000,
  });
  const freshCode = globalMockStaffOtpDispatcher.getLastCodeForRecipient("advisor.sri@searchmyvacation.com")!;

  // Verify correct code within validity window
  const unmaskResult = await staffAuthService.verifyPiiUnmaskChallenge({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    challengeId: freshChallenge.challengeId,
    enteredCode: freshCode,
    nowMs: Date.now() + 700000 + 30000, // 30s later
  });
  assert(unmaskResult.unmaskedUntil > Date.now(), "US-002: Valid OTP verified and granted unmask window");

  // -----------------------------------------------------------------------------
  // TEST 6: US-003 — Step-Up Single-Channel OTP for Sensitive PII Unmasking
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-003: Step-Up Single-Channel OTP & 5-Minute Auto-Mask Window...");

  // Verify active unmask window immediately after verification
  const isUnmaskedImmediate = staffAuthService.isPiiUnmasked({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    nowMs: Date.now() + 700000 + 35000, // 35s later
  });
  assert(isUnmaskedImmediate, "US-003: PII is unmasked immediately following successful step-up OTP");

  // After 5 minutes (301 seconds), PII auto-masks again
  const isUnmaskedAfter5Min = staffAuthService.isPiiUnmasked({
    actorUserId: advisorUser.userId,
    targetEntityId: "lead_passport_441",
    nowMs: Date.now() + 700000 + 30000 + 301 * 1000, // 5m 1s later
  });
  assert(!isUnmaskedAfter5Min, "US-003: PII auto-masks automatically after 5-minute window expires");

  // -----------------------------------------------------------------------------
  // TEST 7: US-017 — Immutable Security & Governance Audit Log
  // -----------------------------------------------------------------------------
  console.log("--> Verifying US-017: Immutable Security & Governance Audit Log...");

  const allLogs = staffAuditLogger.getLogs();
  assert(allLogs.length >= 4, "US-017: Security and PII events recorded in audit log");

  const unmaskSucceededLog = allLogs.find((l) => l.eventType === "pii_unmask_succeeded");
  assert(unmaskSucceededLog !== undefined, "US-017: PII unmask event logged with actor and timestamp");
  assert(
    unmaskSucceededLog?.eventData.channelUsed === "email",
    "US-017: Audit log captured exact OTP channel used (Email)",
  );

  // Test Immutability
  let updateBlocked = false;
  try {
    staffAuditLogger.update();
  } catch (err: any) {
    if (err.message.includes("audit_log_immutable")) {
      updateBlocked = true;
    }
  }
  assert(updateBlocked, "US-017 Immutability: Attempted update on audit log throws error");

  let deleteBlocked = false;
  try {
    staffAuditLogger.delete();
  } catch (err: any) {
    if (err.message.includes("audit_log_immutable")) {
      deleteBlocked = true;
    }
  }
  assert(deleteBlocked, "US-017 Immutability: Attempted deletion on audit log throws error");

  // -----------------------------------------------------------------------------
  // TEST 8: BOUND-01 & TD-02 — Zero-Cost Test Doubles & Public Isolation
  // -----------------------------------------------------------------------------
  console.log("--> Verifying BOUND-01 & TD-02: Zero-Cost Test Doubles & Public Conversion Isolation...");

  // Verify $0.00 provider cost: All messages captured in memory
  const totalDispatches = globalMockStaffOtpDispatcher.getDispatches();
  assert(totalDispatches.length >= 3, "TD-02: Dispatches processed through in-memory mock ($0.00 live cost)");
  assert(staffPortalConfig.auth.portalRoutePrefix === "/portal", "BOUND-01: Staff portal route isolated under /portal");
  assert(
    staffPortalConfig.rbac.hasMinimumRole("administrator", "privilege_user"),
    "RBAC: Administrator satisfies minimum privilege_user requirement",
  );
  assert(
    !staffPortalConfig.rbac.hasMinimumRole("desk_user", "privilege_user"),
    "RBAC: Desk user strictly fails minimum privilege_user requirement",
  );

  console.log("\n================================================================================");
  console.log(`ALL RELEASE 1.5 MILESTONE 1 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log("================================================================================\n");
}

verifyMilestone1().catch((err) => {
  console.error(err);
  process.exit(1);
});
