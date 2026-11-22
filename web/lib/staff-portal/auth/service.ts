/**
 * Staff Portal Auth & User Governance Service (Release 1.5 — US-001, US-002, US-003)
 *
 * Implements:
 * - Staff Account Provisioning & Role Assignment (US-001)
 * - Immediate Deactivation & Session Invalidation (US-001)
 * - Single-Channel Login & Trusted Device Sessions (US-002)
 * - Step-Up OTP for Sensitive PII Unmasking (US-003)
 */

import { staffPortalConfig } from "../../../config/staff-portal.config";
import type {
  PiiUnmaskSessionPayload,
  StaffOtpChannel,
  StaffRole,
  StaffSessionTokenPayload,
  WorkspaceUserRecord,
} from "../../../types/staff-portal.types";
import { staffAuditLogger } from "../audit/logger";
import { staffOtpService } from "../otp/service";

// In-memory user store initialized with existing production/preprod baseline users
const inMemoryUsers = new Map<string, WorkspaceUserRecord>([
  [
    "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
    {
      userId: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
      email: "vivek@searchmyvacation.com",
      role: "administrator",
      displayName: "Vivek",
      registeredMobile: "+918925838541",
      deactivatedAt: null,
      lastLoginAt: null,
      lastOtpChannel: null,
      createdAt: "2026-09-17T00:00:00Z",
      updatedAt: "2026-09-17T00:00:00Z",
    },
  ],
  [
    "4b4f7a20-f82d-4ce6-8aa6-ed2f9b86e045",
    {
      userId: "4b4f7a20-f82d-4ce6-8aa6-ed2f9b86e045",
      email: "vivek.renganathan@gmail.com",
      role: "privilege_user",
      displayName: "Tiger",
      registeredMobile: "+919820199999",
      deactivatedAt: null,
      lastLoginAt: null,
      lastOtpChannel: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    },
  ],
  [
    "7b0834bd-8087-4551-88ed-45fec056809e",
    {
      userId: "7b0834bd-8087-4551-88ed-45fec056809e",
      email: "bookings@searchmyvacation.com",
      role: "privilege_user",
      displayName: "Archie",
      registeredMobile: "+919820188888",
      deactivatedAt: null,
      lastLoginAt: null,
      lastOtpChannel: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    },
  ],
  [
    "f3c043ef-ff8a-4603-b983-56e1bbe8a9aa",
    {
      userId: "f3c043ef-ff8a-4603-b983-56e1bbe8a9aa",
      email: "speeddevil.vicky@gmail.com",
      role: "privilege_user",
      displayName: "Sneaky",
      registeredMobile: null,
      deactivatedAt: "2026-10-01T13:19:46Z",
      lastLoginAt: null,
      lastOtpChannel: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T13:19:46Z",
    },
  ],
]);

// Active sessions tracking for instantaneous deactivation invalidation
const activeSessions = new Map<string, StaffSessionTokenPayload>();

// Active PII unmask temporary grants
const activePiiUnmasks = new Map<string, PiiUnmaskSessionPayload>();

export class StaffAuthService {
  /**
   * Fetch workspace user by email or ID
   */
  async getUserByEmail(email: string): Promise<WorkspaceUserRecord | null> {
    const normalized = email.trim().toLowerCase();
    for (const u of inMemoryUsers.values()) {
      if (u.email.toLowerCase() === normalized) {
        return u;
      }
    }
    return null;
  }

  async getUserById(userId: string): Promise<WorkspaceUserRecord | null> {
    return inMemoryUsers.get(userId) ?? null;
  }

  /**
   * US-001: Admin provisions a new staff account
   */
  async provisionStaffUser(params: {
    actorAdminId: string;
    email: string;
    registeredMobile: string;
    role: StaffRole;
    displayName?: string;
  }): Promise<WorkspaceUserRecord> {
    // 1. Verify actor is an Administrator
    const actor = await this.getUserById(params.actorAdminId);
    if (!actor || actor.role !== "administrator" || actor.deactivatedAt) {
      throw new Error("unauthorized_action: Only active Administrators can provision staff accounts");
    }

    // 2. Validate email domain or presence
    const normalizedEmail = params.email.trim().toLowerCase();
    const existing = await this.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error("user_already_exists: A user with this email address already exists");
    }

    const newUserId = `stf_usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newUser: WorkspaceUserRecord = {
      userId: newUserId,
      email: normalizedEmail,
      role: params.role,
      displayName: params.displayName?.trim() || null,
      registeredMobile: params.registeredMobile.trim(),
      deactivatedAt: null,
      lastLoginAt: null,
      lastOtpChannel: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    inMemoryUsers.set(newUserId, newUser);

    // Audit log
    await staffAuditLogger.logEvent({
      actorId: params.actorAdminId,
      entityType: "workspace_user",
      entityId: newUserId,
      eventType: "user_provisioned",
      eventData: {
        targetUserEmail: normalizedEmail,
        targetRole: params.role,
        registeredMobile: params.registeredMobile,
      },
    });

    return newUser;
  }

  /**
   * US-001: Admin deactivates staff account with immediate session kill-switch
   */
  async deactivateStaffUser(params: {
    actorAdminId: string;
    targetUserId: string;
    reason?: string;
  }): Promise<WorkspaceUserRecord> {
    const actor = await this.getUserById(params.actorAdminId);
    if (!actor || actor.role !== "administrator" || actor.deactivatedAt) {
      throw new Error("unauthorized_action: Only active Administrators can deactivate staff accounts");
    }

    const target = await this.getUserById(params.targetUserId);
    if (!target) {
      throw new Error("user_not_found: Target staff user does not exist");
    }

    // Mark as deactivated
    target.deactivatedAt = new Date().toISOString();
    target.updatedAt = new Date().toISOString();

    // Kill all active sessions for this user immediately
    for (const [token, session] of activeSessions.entries()) {
      if (session.userId === target.userId) {
        activeSessions.delete(token);
      }
    }

    // Invalidate PII unmask grants
    for (const [key, grant] of activePiiUnmasks.entries()) {
      if (grant.userId === target.userId) {
        activePiiUnmasks.delete(key);
      }
    }

    // Audit log
    await staffAuditLogger.logEvent({
      actorId: params.actorAdminId,
      entityType: "workspace_user",
      entityId: target.userId,
      eventType: "user_deactivated",
      eventData: {
        targetUserEmail: target.email,
        reason: params.reason ?? "Administrative offboarding",
      },
    });

    return target;
  }

  /**
   * US-002: Create authenticated staff session upon successful OTP verification
   */
  async createSessionAfterOtp(params: {
    userId: string;
    verifiedChannel: StaffOtpChannel;
    nowMs?: number;
  }): Promise<{
    sessionToken: string;
    payload: StaffSessionTokenPayload;
  }> {
    const now = params.nowMs ?? Date.now();
    const user = await this.getUserById(params.userId);
    if (!user) throw new Error("user_not_found");
    if (user.deactivatedAt) throw new Error("account_deactivated");

    // Update user record
    user.lastLoginAt = new Date(now).toISOString();
    user.lastOtpChannel = params.verifiedChannel;

    const sessionToken = `stf_sess_${now}_${Math.random().toString(36).substring(2, 9)}`;
    const payload: StaffSessionTokenPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      sessionNonce: Math.random().toString(36).substring(2, 9),
      trustedUntil: now + staffPortalConfig.auth.trustedDeviceDurationMs,
      issuedAt: now,
    };

    activeSessions.set(sessionToken, payload);

    // Audit log
    await staffAuditLogger.logEvent({
      actorId: user.userId,
      entityType: "staff_session",
      entityId: sessionToken,
      eventType: "staff_login_succeeded",
      eventData: {
        channelUsed: params.verifiedChannel,
        role: user.role,
      },
    });

    return { sessionToken, payload };
  }

  /**
   * Validate staff session token & verify user is still active
   */
  async validateSession(sessionToken: string): Promise<StaffSessionTokenPayload | null> {
    const session = activeSessions.get(sessionToken);
    if (!session) return null;

    const user = await this.getUserById(session.userId);
    if (!user || user.deactivatedAt) {
      activeSessions.delete(sessionToken);
      return null;
    }

    return session;
  }

  /**
   * US-003: Step-Up Single-Channel OTP for Sensitive PII Access
   */
  async requestPiiUnmaskChallenge(params: {
    actorUserId: string;
    targetEntityId: string;
    channel: StaffOtpChannel;
    nowMs?: number;
  }): Promise<{ challengeId: string; maskedRecipient: string }> {
    const actor = await this.getUserById(params.actorUserId);
    if (!actor || actor.deactivatedAt) {
      throw new Error("unauthorized: Active staff session required");
    }

    // Role check: Only Privileged Users and Administrators are eligible for PII unmasking
    if (!staffPortalConfig.rbac.hasMinimumRole(actor.role, "privilege_user")) {
      throw new Error("insufficient_permissions: Desk Users cannot unmask raw client PII without privileged escalation");
    }

    // Audit request
    await staffAuditLogger.logEvent({
      actorId: actor.userId,
      entityType: "client_pii",
      entityId: params.targetEntityId,
      eventType: "pii_unmask_requested",
      eventData: {
        channelUsed: params.channel,
      },
    });

    const challenge = await staffOtpService.requestOtpChallenge({
      user: actor,
      channel: params.channel,
      purpose: "pii_unmask",
      nowMs: params.nowMs,
    });

    return {
      challengeId: challenge.challengeId,
      maskedRecipient: challenge.maskedRecipient,
    };
  }

  /**
   * Verify Step-Up OTP & grant 5-minute unmask window
   */
  async verifyPiiUnmaskChallenge(params: {
    actorUserId: string;
    targetEntityId: string;
    challengeId: string;
    enteredCode: string;
    nowMs?: number;
  }): Promise<{ unmaskedUntil: number }> {
    const now = params.nowMs ?? Date.now();
    const verification = await staffOtpService.verifyOtpChallenge({
      challengeId: params.challengeId,
      enteredCode: params.enteredCode,
      nowMs: now,
    });

    if (verification.userId !== params.actorUserId || verification.purpose !== "pii_unmask") {
      throw new Error("unmask_verification_mismatch: Challenge does not match actor or purpose");
    }

    const grantKey = `${params.actorUserId}:${params.targetEntityId}`;
    const unmaskedUntil = now + staffPortalConfig.pii.unmaskWindowSeconds * 1000;

    activePiiUnmasks.set(grantKey, {
      userId: params.actorUserId,
      targetEntityId: params.targetEntityId,
      verifiedChannel: verification.channel,
      expiresAt: unmaskedUntil,
    });

    // Audit log
    await staffAuditLogger.logEvent({
      actorId: params.actorUserId,
      entityType: "client_pii",
      entityId: params.targetEntityId,
      eventType: "pii_unmask_succeeded",
      eventData: {
        channelUsed: verification.channel,
        unmaskDurationSeconds: staffPortalConfig.pii.unmaskWindowSeconds,
      },
    });

    return { unmaskedUntil };
  }

  /**
   * Check if PII is currently unmasked for a given user and entity
   */
  isPiiUnmasked(params: { actorUserId: string; targetEntityId: string; nowMs?: number }): boolean {
    const now = params.nowMs ?? Date.now();
    const grantKey = `${params.actorUserId}:${params.targetEntityId}`;
    const grant = activePiiUnmasks.get(grantKey);
    if (!grant) return false;
    if (now > grant.expiresAt) {
      activePiiUnmasks.delete(grantKey);
      return false;
    }
    return true;
  }

  resetAllForTesting(): void {
    activeSessions.clear();
    activePiiUnmasks.clear();
    staffOtpService.clearAll();
    staffAuditLogger.clearForTesting();
  }
}

export const staffAuthService = new StaffAuthService();
