/**
 * Staff Portal Single-Channel Smart OTP Service (Release 1.5 — US-002 & US-003)
 *
 * Enforces:
 * - Mutually exclusive single-channel selection (Email OR Mobile).
 * - 6-digit cryptographic code.
 * - 10-minute TTL (600s).
 * - 60-second cooldown timer.
 * - Max 5 verification attempts.
 */

import { createHash, randomInt } from "node:crypto";
import { staffPortalConfig } from "../../../config/staff-portal.config";
import type { StaffOtpChannel, StaffOtpPurpose, WorkspaceUserRecord } from "../../../types/staff-portal.types";
import { globalMockStaffOtpDispatcher } from "./test-doubles";

export interface ActiveStaffOtpChallenge {
  id: string;
  userId: string;
  channel: StaffOtpChannel;
  codeHash: string;
  expiresAt: number; // epoch ms
  cooldownUntil: number; // epoch ms
  attempts: number;
  purpose: StaffOtpPurpose;
  verifiedAt: number | null;
}

export function hashStaffOtp(code: string): string {
  return createHash("sha256").update(code.trim()).digest("hex");
}

export function generateStaffOtpCode(): string {
  return randomInt(100000, 1000000).toString();
}

/**
 * In-memory challenge store for instant $0.00 zero-network test execution
 */
const inMemoryChallenges = new Map<string, ActiveStaffOtpChallenge>();

export class StaffOtpService {
  constructor(private readonly dispatcher = globalMockStaffOtpDispatcher) {}

  /**
   * Request Single-Channel OTP challenge
   */
  async requestOtpChallenge(params: {
    user: WorkspaceUserRecord;
    channel: StaffOtpChannel;
    purpose?: StaffOtpPurpose;
    nowMs?: number;
  }): Promise<{
    challengeId: string;
    channel: StaffOtpChannel;
    maskedRecipient: string;
    expiresInSeconds: number;
    cooldownSeconds: number;
  }> {
    const now = params.nowMs ?? Date.now();
    const purpose = params.purpose ?? "login";

    // 1. Guardrail: User must be active
    if (params.user.deactivatedAt) {
      throw new Error("account_deactivated: User account has been deactivated by an Administrator");
    }

    // 2. Resolve recipient based on selected channel
    let recipient: string;
    let maskedRecipient: string;

    if (params.channel === "email") {
      recipient = params.user.email;
      const [local, domain] = recipient.split("@");
      const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`;
      maskedRecipient = `${maskedLocal}@${domain}`;
    } else {
      if (!params.user.registeredMobile) {
        throw new Error("mobile_not_registered: Staff member has no registered mobile number on record");
      }
      recipient = params.user.registeredMobile;
      maskedRecipient =
        recipient.length > 6
          ? `${recipient.slice(0, 4)}***${recipient.slice(-2)}`
          : `${recipient.slice(0, 2)}****`;
    }

    // 3. Cooldown check: Has a previous challenge been requested within the last 60 seconds?
    for (const ch of inMemoryChallenges.values()) {
      if (ch.userId === params.user.userId && ch.purpose === purpose && !ch.verifiedAt) {
        if (now < ch.cooldownUntil) {
          const remainingSeconds = Math.ceil((ch.cooldownUntil - now) / 1000);
          throw new Error(`cooldown_active: Please wait ${remainingSeconds}s before requesting a new OTP`);
        }
      }
    }

    // 4. Generate code and calculate timestamps
    const code = generateStaffOtpCode();
    const codeHash = hashStaffOtp(code);
    const challengeId = `stf_otp_${Date.now()}_${randomInt(1000, 9999)}`;
    const expiresAt = now + staffPortalConfig.otp.expirySeconds * 1000;
    const cooldownUntil = now + staffPortalConfig.otp.cooldownSeconds * 1000;

    const challengeRecord: ActiveStaffOtpChallenge = {
      id: challengeId,
      userId: params.user.userId,
      channel: params.channel,
      codeHash,
      expiresAt,
      cooldownUntil,
      attempts: 0,
      purpose,
      verifiedAt: null,
    };

    inMemoryChallenges.set(challengeId, challengeRecord);

    // 5. Dispatch ONLY to the selected single channel (Mutual Exclusivity)
    await this.dispatcher.dispatch({
      channel: params.channel,
      recipient,
      code,
      purpose,
    });

    return {
      challengeId,
      channel: params.channel,
      maskedRecipient,
      expiresInSeconds: staffPortalConfig.otp.expirySeconds,
      cooldownSeconds: staffPortalConfig.otp.cooldownSeconds,
    };
  }

  /**
   * Verify Single-Channel OTP challenge
   */
  async verifyOtpChallenge(params: {
    challengeId: string;
    enteredCode: string;
    nowMs?: number;
  }): Promise<{
    success: boolean;
    userId: string;
    channel: StaffOtpChannel;
    purpose: StaffOtpPurpose;
  }> {
    const now = params.nowMs ?? Date.now();
    const challenge = inMemoryChallenges.get(params.challengeId);

    if (!challenge) {
      throw new Error("challenge_not_found: Invalid or expired OTP session");
    }

    if (challenge.verifiedAt) {
      throw new Error("challenge_already_used: This OTP has already been verified");
    }

    if (now > challenge.expiresAt) {
      throw new Error("otp_expired: The verification code has expired (10-minute validity exceeded)");
    }

    if (challenge.attempts >= staffPortalConfig.otp.maxAttempts) {
      throw new Error("max_attempts_exceeded: Too many incorrect attempts. Please request a new code");
    }

    const enteredHash = hashStaffOtp(params.enteredCode);
    if (enteredHash !== challenge.codeHash) {
      challenge.attempts++;
      const remaining = staffPortalConfig.otp.maxAttempts - challenge.attempts;
      throw new Error(`invalid_code: Incorrect verification code (${remaining} attempts remaining)`);
    }

    // Mark as verified
    challenge.verifiedAt = now;

    return {
      success: true,
      userId: challenge.userId,
      channel: challenge.channel,
      purpose: challenge.purpose,
    };
  }

  getChallenge(challengeId: string): ActiveStaffOtpChallenge | undefined {
    return inMemoryChallenges.get(challengeId);
  }

  clearAll(): void {
    inMemoryChallenges.clear();
    this.dispatcher.clear();
  }
}

export const staffOtpService = new StaffOtpService();
