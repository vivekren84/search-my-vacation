/**
 * Journey Passport OTP Test Doubles & Regression Harness (Release 1.4 — TD-02)
 *
 * Authored for Tiger (CTO) & Keerthi (QA Lead)
 * Guarantees zero live SMS costs ($0.00) and enables deterministic, zero-network
 * integration and E2E regression testing across the Passport and OTP lifecycle.
 */

import { hashOtpCode } from "./repository.js";
import type {
  JourneyPassportOtpChallengeResult,
  JourneyPassportOtpRepository,
  JourneyPassportOtpSmsProvider,
  JourneyPassportOtpVerifyResult,
} from "./types.js";

export interface SentSmsRecord {
  mobileNumber: string;
  code: string;
  timestamp: number;
  status: "sent" | "not-configured";
}

/**
 * In-memory Mock SMS Provider (Zero Live Charges)
 */
export class MockJourneyPassportOtpSmsProvider implements JourneyPassportOtpSmsProvider {
  private sentMessages: SentSmsRecord[] = [];
  public failureMode: "none" | "throw_error" | "not_configured" = "none";

  async send(mobileNumber: string, code: string): Promise<{ status: "sent" } | { status: "not-configured" }> {
    if (this.failureMode === "throw_error") {
      throw new Error("Simulated SMS Gateway 504 Timeout");
    }
    const status: "sent" | "not-configured" = this.failureMode === "not_configured" ? "not-configured" : "sent";
    this.sentMessages.push({
      mobileNumber,
      code,
      timestamp: Date.now(),
      status,
    });
    return { status };
  }

  getSentMessages(): readonly SentSmsRecord[] {
    return [...this.sentMessages];
  }

  getLastSentCode(mobileNumber?: string): string | undefined {
    if (mobileNumber) {
      const match = this.sentMessages.slice().reverse().find((m) => m.mobileNumber === mobileNumber);
      return match?.code;
    }
    return this.sentMessages[this.sentMessages.length - 1]?.code;
  }

  clear(): void {
    this.sentMessages = [];
    this.failureMode = "none";
  }
}

interface StoredChallenge {
  challengeId: string;
  mobileNumber: string;
  otpHash: string;
  resendCount: number;
  attemptsRemaining: number;
  createdAt: number;
  expiresAt: number;
  verified: boolean;
  verificationToken?: string;
}

/**
 * In-memory OTP Repository implementing Supabase RPC logic deterministically.
 */
export class InMemoryJourneyPassportOtpRepository implements JourneyPassportOtpRepository {
  private challenges = new Map<string, StoredChallenge>();
  private challengeByMobile = new Map<string, string>();
  private sendHistory: { mobileNumber: string; timestamp: number }[] = [];
  private consumedTokens = new Set<string>();

  public simulatedNow: number = Date.now();
  public ttlMs: number = 10 * 60 * 1000; // 10 minutes (approved SMV standard)
  public resendDelayMs: number = 60 * 1000; // 60 seconds
  public maxResends: number = 3;
  public hourlyLimit: number = 5;
  public dailyLimit: number = 10;

  getNow(): number {
    return this.simulatedNow || Date.now();
  }

  setSimulatedNow(time: number): void {
    this.simulatedNow = time;
  }

  advanceTime(ms: number): void {
    this.simulatedNow += ms;
  }

  async createOrResendChallenge(mobileNumber: string, otpHash: string): Promise<JourneyPassportOtpChallengeResult> {
    const now = this.getNow();

    // Check hourly & daily rate limits
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const hourlySends = this.sendHistory.filter((s) => s.mobileNumber === mobileNumber && s.timestamp >= oneHourAgo).length;
    const dailySends = this.sendHistory.filter((s) => s.mobileNumber === mobileNumber && s.timestamp >= oneDayAgo).length;

    if (hourlySends >= this.hourlyLimit) {
      return { challengeId: "", resendCount: 0, outcome: "cooldown_lockout" };
    }
    if (dailySends >= this.dailyLimit) {
      return { challengeId: "", resendCount: 0, outcome: "rate_limit_exceeded" };
    }

    const existingId = this.challengeByMobile.get(mobileNumber);
    const existing = existingId ? this.challenges.get(existingId) : undefined;

    if (existing && !existing.verified && now < existing.expiresAt) {
      const timeSinceLast = now - existing.createdAt;
      if (timeSinceLast < this.resendDelayMs) {
        return {
          challengeId: existing.challengeId,
          resendCount: existing.resendCount,
          outcome: "resend_too_soon",
        };
      }
      if (existing.resendCount >= this.maxResends) {
        return {
          challengeId: existing.challengeId,
          resendCount: existing.resendCount,
          outcome: "resend_limit_exceeded",
        };
      }

      // Valid resend
      existing.resendCount += 1;
      existing.otpHash = otpHash;
      existing.createdAt = now;
      existing.expiresAt = now + this.ttlMs;
      existing.attemptsRemaining = 3;
      this.sendHistory.push({ mobileNumber, timestamp: now });

      return {
        challengeId: existing.challengeId,
        resendCount: existing.resendCount,
        outcome: "sent",
      };
    }

    // New challenge
    const challengeId = `mock-chal-${Math.random().toString(36).substring(2, 10)}`;
    const newChallenge: StoredChallenge = {
      challengeId,
      mobileNumber,
      otpHash,
      resendCount: 0,
      attemptsRemaining: 3,
      createdAt: now,
      expiresAt: now + this.ttlMs,
      verified: false,
    };

    this.challenges.set(challengeId, newChallenge);
    this.challengeByMobile.set(mobileNumber, challengeId);
    this.sendHistory.push({ mobileNumber, timestamp: now });

    return {
      challengeId,
      resendCount: 0,
      outcome: "sent",
    };
  }

  async verifyChallenge(mobileNumber: string, challengeId: string, otpHash: string): Promise<JourneyPassportOtpVerifyResult> {
    const now = this.getNow();
    const challenge = this.challenges.get(challengeId);

    if (!challenge || challenge.mobileNumber !== mobileNumber) {
      return { outcome: "not_found" };
    }
    if (now > challenge.expiresAt) {
      return { outcome: "expired" };
    }
    if (challenge.attemptsRemaining <= 0) {
      return { outcome: "exhausted", attemptsRemaining: 0 };
    }

    if (challenge.otpHash !== otpHash) {
      challenge.attemptsRemaining -= 1;
      if (challenge.attemptsRemaining <= 0) {
        return { outcome: "exhausted", attemptsRemaining: 0 };
      }
      return { outcome: "incorrect", attemptsRemaining: challenge.attemptsRemaining };
    }

    // Verified
    challenge.verified = true;
    const verificationToken = `mock-tok-${Math.random().toString(36).substring(2, 12)}`;
    challenge.verificationToken = verificationToken;

    return {
      outcome: "verified",
      verificationToken,
      attemptsRemaining: challenge.attemptsRemaining,
    };
  }

  async consumeVerificationToken(mobileNumber: string, verificationToken: string): Promise<boolean> {
    if (this.consumedTokens.has(verificationToken)) {
      return false; // Already consumed
    }
    for (const challenge of this.challenges.values()) {
      if (challenge.mobileNumber === mobileNumber && challenge.verificationToken === verificationToken && challenge.verified) {
        this.consumedTokens.add(verificationToken);
        return true;
      }
    }
    return false;
  }

  getChallenge(challengeId: string): StoredChallenge | undefined {
    return this.challenges.get(challengeId);
  }

  clear(): void {
    this.challenges.clear();
    this.challengeByMobile.clear();
    this.sendHistory = [];
    this.consumedTokens.clear();
  }
}

/**
 * Creates a zero-cost Mock fetcher for testing client OTP functions
 * (`sendJourneyPassportOtp` and `verifyJourneyPassportOtp`) completely in-memory.
 */
export function createMockOtpFetcher(options?: {
  overrideSendOutcome?: "sent" | "resend_too_soon" | "resend_limit_exceeded" | "rate_limit_exceeded" | "cooldown_lockout";
  overrideVerifyOutcome?: "verified" | "incorrect" | "expired" | "exhausted" | "not_found";
  mockVerificationToken?: string;
  expectedCode?: string;
  networkError?: boolean;
}): typeof fetch {
  const repo = new InMemoryJourneyPassportOtpRepository();
  const sms = new MockJourneyPassportOtpSmsProvider();
  const expectedCode = options?.expectedCode || "555555";
  let activeChallengeId = "mock-active-challenge-123";

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (options?.networkError) {
      throw new Error("Network offline (simulated)");
    }

    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const bodyText = typeof init?.body === "string" ? init.body : "{}";
    const body = JSON.parse(bodyText) as Record<string, unknown>;

    // Send Endpoint
    if (url.includes("/api/journey-passport/otp/send")) {
      const mobileNumber = String(body.mobileNumber || "");
      if (options?.overrideSendOutcome && options.overrideSendOutcome !== "sent") {
        return new Response(
          JSON.stringify({
            ok: true,
            outcome: options.overrideSendOutcome,
            challengeId: activeChallengeId,
            resendDelaySeconds: 60,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      const res = await repo.createOrResendChallenge(mobileNumber, hashOtpCode(expectedCode, mobileNumber));
      activeChallengeId = res.challengeId;
      await sms.send(mobileNumber, expectedCode);

      return new Response(
        JSON.stringify({
          ok: true,
          outcome: res.outcome,
          challengeId: res.challengeId,
          resendDelaySeconds: 60,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify Endpoint
    if (url.includes("/api/journey-passport/otp/verify")) {
      const mobileNumber = String(body.mobileNumber || "");
      const challengeId = String(body.challengeId || activeChallengeId);
      const code = String(body.code || "");

      if (options?.overrideVerifyOutcome) {
        return new Response(
          JSON.stringify({
            ok: true,
            outcome: options.overrideVerifyOutcome,
            verificationToken: options.overrideVerifyOutcome === "verified" ? options.mockVerificationToken || "mock-token-xyz" : undefined,
            attemptsRemaining: options.overrideVerifyOutcome === "incorrect" ? 2 : undefined,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      const verifyRes = await repo.verifyChallenge(mobileNumber, challengeId, hashOtpCode(code, mobileNumber));
      return new Response(
        JSON.stringify({
          ok: true,
          outcome: verifyRes.outcome,
          verificationToken: verifyRes.verificationToken,
          attemptsRemaining: verifyRes.attemptsRemaining,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Leads endpoint
    if (url.includes("/api/journey-passport/leads")) {
      const verificationToken = String(body.verificationToken || "");
      const mobileNumber = String(body.mobileNumber || "");
      const success = await repo.consumeVerificationToken(mobileNumber, verificationToken);

      return new Response(
        JSON.stringify({
          ok: success || verificationToken.startsWith("mock-"),
          leadId: "lead_mock_12345",
          reference: "SMV-MOCK88",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: false, error: "Not Found" }), { status: 404 });
  };
}
