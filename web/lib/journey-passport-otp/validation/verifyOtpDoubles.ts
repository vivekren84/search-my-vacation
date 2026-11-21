/**
 * Journey Passport OTP Double & Regression Test (Release 1.4 — TD-02)
 *
 * Authored for Keerthi (QA Lead) & Tiger (CTO)
 * Exercises all OTP test doubles in memory to verify 100% zero-cost SMS testing.
 */

import {
  InMemoryJourneyPassportOtpRepository,
  MockJourneyPassportOtpSmsProvider,
  createMockOtpFetcher,
} from "../test-doubles.js";
import {
  processJourneyPassportOtpSend,
  processJourneyPassportOtpVerify,
} from "../service.js";
import {
  sendJourneyPassportOtp,
  verifyJourneyPassportOtp,
} from "../client.js";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) {
    throw new Error(`[TD-02 Verification FAILED] ${message}`);
  }
}

export async function testMockSmsProviderAndService() {
  const repository = new InMemoryJourneyPassportOtpRepository();
  const smsProvider = new MockJourneyPassportOtpSmsProvider();
  const mobile = "+919876543210";

  // Test send with mock SMS provider
  const sendRes = await processJourneyPassportOtpSend(mobile, {
    repository,
    smsProvider,
    codeGenerator: () => "789012",
  });

  assert(sendRes.outcome === "sent", "processJourneyPassportOtpSend returns sent");
  assert(sendRes.challengeId.startsWith("mock-chal-"), "Generates valid mock challenge ID");
  assert(sendRes.smsStatus === "sent", "SMS provider status is sent");

  const sent = smsProvider.getSentMessages();
  assert(sent.length === 1, "Mock SMS provider recorded exactly 1 sent message");
  assert(sent[0].code === "789012", "Sent code matches injected generator");
  assert(sent[0].mobileNumber === mobile, "Sent mobile matches input");

  // Test verification with correct code
  const verifyRes = await processJourneyPassportOtpVerify(mobile, sendRes.challengeId, "789012", repository);
  assert(verifyRes.outcome === "verified", "Verify with matching code returns verified");
  assert(Boolean(verifyRes.verificationToken), "Verified challenge produces verificationToken");

  // Test token consumption
  const token = verifyRes.verificationToken!;
  const consumedFirst = await repository.consumeVerificationToken(mobile, token);
  assert(consumedFirst === true, "Verification token successfully consumed once");
  const consumedSecond = await repository.consumeVerificationToken(mobile, token);
  assert(consumedSecond === false, "Verification token cannot be consumed a second time (single-use)");
}

export async function testRepositoryRateLimitsAndExhaustion() {
  const repository = new InMemoryJourneyPassportOtpRepository();
  const smsProvider = new MockJourneyPassportOtpSmsProvider();
  const mobile = "+919999988888";

  // Initial Send
  const res1 = await processJourneyPassportOtpSend(mobile, {
    repository,
    smsProvider,
    codeGenerator: () => "111111",
  });
  assert(res1.outcome === "sent", "Initial send succeeds");

  // Immediate Resend within 60 seconds -> resend_too_soon
  const resTooSoon = await processJourneyPassportOtpSend(mobile, {
    repository,
    smsProvider,
    codeGenerator: () => "222222",
  });
  assert(resTooSoon.outcome === "resend_too_soon", "Resend before 60s returns resend_too_soon");
  assert(resTooSoon.challengeId === res1.challengeId, "Preserves existing challenge ID on resend_too_soon");

  // Advance time by 61 seconds
  repository.advanceTime(61 * 1000);

  // Resend 1 succeeds
  const resend1 = await processJourneyPassportOtpSend(mobile, {
    repository,
    smsProvider,
    codeGenerator: () => "333333",
  });
  assert(resend1.outcome === "sent", "Resend after 60s succeeds");

  // Wrong code verification attempts
  const wrong1 = await processJourneyPassportOtpVerify(mobile, res1.challengeId, "000000", repository);
  assert(wrong1.outcome === "incorrect", "Wrong code returns incorrect");
  assert(wrong1.attemptsRemaining === 2, "Attempts remaining decrements to 2");

  const wrong2 = await processJourneyPassportOtpVerify(mobile, res1.challengeId, "000000", repository);
  assert(wrong2.outcome === "incorrect", "Second wrong code returns incorrect");
  assert(wrong2.attemptsRemaining === 1, "Attempts remaining decrements to 1");

  const wrong3 = await processJourneyPassportOtpVerify(mobile, res1.challengeId, "000000", repository);
  assert(wrong3.outcome === "exhausted", "Third wrong code exhausts challenge");
  assert(wrong3.attemptsRemaining === 0, "Attempts remaining is 0");
}

export async function testClientMockFetcherIntegration() {
  const mockFetcher = createMockOtpFetcher({
    expectedCode: "654321",
  });

  // Client send
  const sendRes = await sendJourneyPassportOtp("9876543210", mockFetcher);
  assert(sendRes.outcome === "sent", "Client send with mock fetcher succeeds");
  assert(Boolean(sendRes.challengeId), "Client send receives challengeId");

  // Client verify with wrong code
  const verifyWrong = await verifyJourneyPassportOtp("9876543210", sendRes.challengeId!, "000000", mockFetcher);
  assert(verifyWrong.outcome === "incorrect", "Client verify with wrong code returns incorrect");
  assert(verifyWrong.attemptsRemaining === 2, "Client verify returns attemptsRemaining = 2");

  // Client verify with correct code
  const verifyCorrect = await verifyJourneyPassportOtp("9876543210", sendRes.challengeId!, "654321", mockFetcher);
  assert(verifyCorrect.outcome === "verified", "Client verify with correct code returns verified");
  assert(Boolean(verifyCorrect.verificationToken), "Client verify receives verificationToken");
}

export async function runOtpDoubleVerification(): Promise<number> {
  checks = 0;
  console.log("--- Starting TD-02 OTP Test Double Harness Verification ---");
  await testMockSmsProviderAndService();
  console.log("✓ Mock SMS Provider and Service processing verified.");
  await testRepositoryRateLimitsAndExhaustion();
  console.log("✓ In-memory repository rate limits, cooldown, and exhaustion verified.");
  await testClientMockFetcherIntegration();
  console.log("✓ Client API integration with mock fetcher verified.");
  console.log(`ALL TD-02 OTP TEST DOUBLE CHECKS PASSED (${checks} checks).\n`);
  return checks;
}

if (process.argv[1]?.endsWith("verifyOtpDoubles.js") || process.argv[1]?.endsWith("verifyOtpDoubles.ts")) {
  void runOtpDoubleVerification();
}
