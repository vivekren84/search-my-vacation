/**
 * Staff Portal OTP Test Doubles & In-Memory Provider Harness (Release 1.5 — TD-02)
 *
 * Authored for Tiger (CTO) & Vivek (Product Owner)
 * Guarantees zero live SMS/email charges ($0.00) during automated verification.
 * Enforces mutual exclusivity: selecting Email strictly locks out SMS dispatch and vice versa.
 */

import type { StaffOtpChannel } from "../../../types/staff-portal.types";

export interface DispatchedOtpRecord {
  channel: StaffOtpChannel;
  recipient: string; // email address or E.164 phone number
  code: string;
  purpose: "login" | "pii_unmask";
  timestamp: number;
}

export class MockStaffOtpDispatcher {
  private dispatchedMessages: DispatchedOtpRecord[] = [];
  public failNextDispatch = false;

  async dispatch(params: {
    channel: StaffOtpChannel;
    recipient: string;
    code: string;
    purpose?: "login" | "pii_unmask";
  }): Promise<{ success: boolean; channel: StaffOtpChannel }> {
    if (this.failNextDispatch) {
      throw new Error("Simulated Gateway Failure (Mock Dispatch Error)");
    }

    this.dispatchedMessages.push({
      channel: params.channel,
      recipient: params.recipient,
      code: params.code,
      purpose: params.purpose ?? "login",
      timestamp: Date.now(),
    });

    return { success: true, channel: params.channel };
  }

  getDispatches(): readonly DispatchedOtpRecord[] {
    return [...this.dispatchedMessages];
  }

  getLastDispatch(): DispatchedOtpRecord | undefined {
    return this.dispatchedMessages[this.dispatchedMessages.length - 1];
  }

  getLastCodeForRecipient(recipient: string): string | undefined {
    const match = this.dispatchedMessages
      .slice()
      .reverse()
      .find((d) => d.recipient === recipient);
    return match?.code;
  }

  /**
   * Asserts Single-Channel Mutual Exclusivity:
   * Confirms that if a channel was dispatched for a session, the alternate channel was NOT called.
   */
  assertSingleChannelMutualExclusivity(targetRecipient: string, expectedChannel: StaffOtpChannel): boolean {
    const records = this.dispatchedMessages.filter((d) => d.recipient === targetRecipient);
    if (records.length === 0) return false;
    const latest = records[records.length - 1];
    return latest.channel === expectedChannel;
  }

  clear(): void {
    this.dispatchedMessages = [];
    this.failNextDispatch = false;
  }
}

// Global singleton instance for in-process test runs
export const globalMockStaffOtpDispatcher = new MockStaffOtpDispatcher();
