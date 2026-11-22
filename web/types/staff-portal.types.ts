/**
 * Search My Vacation — Staff Portal & Advisor Workspace Types (Release 1.5)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Governs RBAC, Single-Channel Smart OTP, PII Step-Up Unmasking, and Governance Audit Logging.
 * Preserves BOUND-01 Public Customer Decoupling.
 */

export type StaffRole = "administrator" | "privilege_user" | "desk_user";

export type StaffOtpChannel = "email" | "sms";

export type StaffOtpPurpose = "login" | "pii_unmask";

export interface WorkspaceUserRecord {
  userId: string;
  email: string;
  role: StaffRole;
  displayName: string | null;
  registeredMobile: string | null;
  deactivatedAt: string | null;
  lastLoginAt: string | null;
  lastOtpChannel: StaffOtpChannel | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffOtpChallengeRecord {
  id: string;
  userId: string;
  channel: StaffOtpChannel;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  cooldownUntil: string;
  verifiedAt: string | null;
  purpose: StaffOtpPurpose;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type StaffAuditEventType =
  | "staff_login_otp_dispatched"
  | "staff_login_succeeded"
  | "staff_login_failed"
  | "staff_session_invalidated"
  | "pii_unmask_requested"
  | "pii_unmask_succeeded"
  | "user_provisioned"
  | "user_deactivated"
  | "user_reactivated"
  | "role_changed"
  | "margin_override_requested"
  | "margin_override_approved"
  | "margin_override_rejected"
  | "financial_export_generated";

export interface StaffAuditLogEntry {
  id?: string;
  actorId: string | null;
  entityType: string;
  entityId: string;
  eventType: StaffAuditEventType;
  eventData: {
    channelUsed?: StaffOtpChannel;
    targetUserEmail?: string;
    targetRole?: StaffRole;
    ipAddress?: string;
    userAgent?: string;
    reason?: string;
    [key: string]: unknown;
  };
  createdAt?: string;
}

export interface StaffSessionTokenPayload {
  userId: string;
  email: string;
  role: StaffRole;
  displayName: string | null;
  sessionNonce: string;
  trustedUntil: number; // epoch ms (14-day trusted cookie)
  issuedAt: number;
}

export interface PiiUnmaskSessionPayload {
  userId: string;
  targetEntityId: string;
  verifiedChannel: StaffOtpChannel;
  expiresAt: number; // epoch ms (5-minute temporary unmask)
}
