import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createJourneyCallbackEmail, createJourneyLeadEmail, createJourneyLeadNotifier, JourneyLeadNotificationError } from "../email";
import { submitJourneyCallbackPreference, submitJourneyPassportLead } from "../client";
import { consumeJourneyLeadRateLimit } from "../rate-limit";
import { processJourneyCallback, processJourneyLead, processJourneyLeadEvent } from "../service";
import type {
  JourneyCallbackLead,
  JourneyCallbackNotifier,
  JourneyCallbackSubmission,
  JourneyLeadEventType,
  JourneyLeadNotificationStatus,
  JourneyLeadNotifier,
  JourneyLeadSubmission,
  JourneyPassportRepository,
  ValidatedJourneyCallback,
  ValidatedJourneyLead,
} from "../types";
import { isJourneyPassportReference, parseJourneyCallbackSubmission, parseJourneyLeadSubmission, parseNotificationRecipients } from "../validation";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey lead verification failed: ${message}`);
}

const rawSubmission: JourneyLeadSubmission = {
  passportReference: "SMV-ABCD2345",
  guestName: "Test Traveller",
  mobileNumber: "9000000000",
  passportSummary: {
    name: "Test Traveller",
    mobile: "9000000000",
    journeyReference: "SMV-ABCD2345",
    companion: "My partner",
    dreamJourney: "A quiet escape",
    travelStyles: ["Nature", "Slow travel"],
    timing: "Within three months",
    startDate: "",
    endDate: "",
    destinationMode: "discovery",
    destination: "",
    entryContext: { feeling: "escape", source: "direct" },
    completedAt: "2026-08-02T10:00:00.000Z",
    source: "journey-passport",
  },
};

const rawCallback: JourneyCallbackSubmission = {
  passportReference: rawSubmission.passportReference,
  guestName: rawSubmission.guestName,
  mobileNumber: rawSubmission.mobileNumber,
  preferredDate: "2099-12-08",
  preferredTimeWindow: "1:00 PM–4:00 PM",
  additionalComments: "Please call after lunch.",
};

function validLead(overrides: Record<string, unknown> = {}) {
  const result = parseJourneyLeadSubmission({ ...rawSubmission, ...overrides });
  assert(result.ok, "fixture parses as a valid lead");
  return result.value;
}

class MemoryRepository implements JourneyPassportRepository {
  leads = new Map<string, ValidatedJourneyLead>();
  events = new Map<string, { eventType: JourneyLeadEventType; payload: Record<string, string> }>();
  notification = new Map<string, JourneyLeadNotificationStatus>();
  claimed = new Set<string>();
  whatsApp = new Set<string>();
  failUpsert = false;
  failClaim = false;
  callbackClaims = new Map<string, string>();
  callbackNotified = new Map<string, string>();
  callbackNotification = new Map<string, JourneyLeadNotificationStatus>();

  async upsertLead(lead: ValidatedJourneyLead) {
    if (this.failUpsert) throw new Error("database unavailable");
    this.leads.set(lead.passportReference, lead);
    if (!this.notification.has(lead.passportReference)) this.notification.set(lead.passportReference, "pending");
  }
  async recordEvent(passportReference: string, eventType: JourneyLeadEventType, payload: Record<string, string> = {}) {
    this.events.set(`${passportReference}:${eventType}`, { eventType, payload });
  }
  async claimNotification(passportReference: string) {
    if (this.failClaim) throw new Error("claim unavailable");
    if (this.claimed.has(passportReference)) return false;
    this.claimed.add(passportReference);
    return true;
  }
  async updateNotification(passportReference: string, _claimToken: string, status: JourneyLeadNotificationStatus) {
    this.notification.set(passportReference, status);
  }
  async markWhatsAppHandoff(passportReference: string) {
    if (!this.leads.has(passportReference)) return false;
    this.whatsApp.add(passportReference);
    return true;
  }
  async claimCallback(callback: ValidatedJourneyCallback, fingerprint: string) {
    const lead = this.leads.get(callback.passportReference);
    if (!lead || lead.guestName !== callback.guestName || lead.mobileNormalized !== callback.mobileNormalized) {
      return { status: "not-found" } as const;
    }
    if (this.callbackNotified.get(callback.passportReference) === fingerprint || this.callbackClaims.get(callback.passportReference) === fingerprint) {
      return { status: "duplicate" } as const;
    }
    this.callbackClaims.set(callback.passportReference, fingerprint);
    return {
      status: "claimed",
      callback: {
        ...callback,
        fingerprint,
        initialProviderRequestId: "initial-provider-id",
        initialMessageId: "<initial-message@resend.test>",
      },
    } as const;
  }
  async updateCallbackNotification(callback: JourneyCallbackLead, _claimToken: string, status: JourneyLeadNotificationStatus) {
    this.callbackNotification.set(callback.passportReference, status);
    this.callbackNotified.set(callback.passportReference, callback.fingerprint);
  }
}

function withMobile(mobileNumber: string) {
  return { ...rawSubmission, mobileNumber, passportSummary: { ...rawSubmission.passportSummary, mobile: mobileNumber } };
}

async function verifyValidation() {
  const valid = parseJourneyLeadSubmission(rawSubmission);
  assert(valid.ok && valid.value.mobileNormalized === "9000000000", "valid lead is normalized to digits");
  assert(isJourneyPassportReference("SMV-ABCD2345"), "production Passport reference is accepted");
  assert(isJourneyPassportReference("JY-ABCD-2345"), "recoverable legacy Passport reference is accepted");
  assert(!isJourneyPassportReference("SMV-123"), "malformed Passport reference is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, guestName: " " }).ok, "blank name is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "" }).ok, "blank mobile is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "9000abc000" }).ok, "alphabetic mobile is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "12345" }).ok, "short mobile (5 digits) is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "123456789" }).ok, "short mobile (9 digits) is rejected");
  assert(parseJourneyLeadSubmission(withMobile("1234567890")).ok, "10-digit mobile is accepted");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "0000000000" }).ok, "all-zero mobile is rejected");
  assert(parseJourneyLeadSubmission(withMobile("3456789012")).ok, "mobile starting with 3 is accepted");
  assert(parseJourneyLeadSubmission(withMobile("9876543210")).ok, "mobile starting with 9 is accepted");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "12345678901" }).ok, "11-digit mobile is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "+91 9000000000" }).ok, "mobile with a country code prefix is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, mobileNumber: "900-000-0000" }).ok, "mobile with special characters is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, passportReference: undefined }).ok, "missing Passport reference is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, passportReference: "anything" }).ok, "arbitrary Passport reference is rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, unexpected: true }).ok, "unexpected request keys are rejected");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, passportSummary: { ...rawSubmission.passportSummary, travelStyles: "Nature" } }).ok, "malformed Passport summary is rejected");
  const destinationEntry = parseJourneyLeadSubmission({
    ...rawSubmission,
    passportSummary: {
      ...rawSubmission.passportSummary,
      dreamJourney: "Mountain Retreat",
      destinationMode: "known",
      destination: "Kashmir",
      entryContext: { destination: "Kashmir", destinationTheme: "Mountain Retreat", source: "destination" },
    },
  });
  assert(destinationEntry.ok && destinationEntry.value.passportSummary.entryContext?.destinationTheme === "Mountain Retreat", "verified destination context survives lead validation");
  assert(!parseJourneyLeadSubmission({ ...rawSubmission, passportSummary: { ...rawSubmission.passportSummary, entryContext: { destination: "Kashmir", destinationTheme: "Unverified", source: "destination" } } }).ok, "unverified destination theme is rejected");
  assert(parseNotificationRecipients("a@example.com, A@example.com, invalid, b@example.com").length === 2, "recipient values are validated and deduplicated");
  const callback = parseJourneyCallbackSubmission(rawCallback);
  assert(callback.ok && callback.value.mobileNormalized === "9000000000", "valid callback request is normalized");
  assert(!parseJourneyCallbackSubmission({ ...rawCallback, preferredDate: "2020-01-01" }).ok, "past callback dates are rejected");
  assert(!parseJourneyCallbackSubmission({ ...rawCallback, preferredTimeWindow: "Any time" }).ok, "unknown callback windows are rejected");
  assert(!parseJourneyCallbackSubmission({ ...rawCallback, additionalComments: "x".repeat(501) }).ok, "oversized callback comments are rejected");
}

async function verifyLeadService() {
  const repository = new MemoryRepository();
  let deliveries = 0;
  const notifier: JourneyLeadNotifier = { send: async () => { deliveries += 1; return { status: "sent", providerRequestId: "safe-test-id" }; } };
  const lead = validLead();
  const first = await processJourneyLead(lead, { repository, notifier, createClaimToken: () => "claim-1" });
  assert(first.stored && first.notificationStatus === "sent", "valid lead is stored and notified");
  assert(repository.leads.size === 1, "first submission creates one lead");
  assert(repository.notification.get(lead.passportReference) === "sent", "notification success is recorded");
  assert(repository.events.has(`${lead.passportReference}:passport_issued`), "Passport-issued event is created");
  assert(repository.events.has(`${lead.passportReference}:lead_saved`), "lead-saved event is created");
  assert(repository.events.has(`${lead.passportReference}:notification_sent`), "notification-sent event is created");

  await processJourneyLead(lead, { repository, notifier, createClaimToken: () => "claim-2" });
  assert(repository.leads.size === 1 && deliveries === 1, "duplicate Passport submission upserts once and does not resend");

  const updatedRaw = { ...rawSubmission, guestName: "Updated Traveller", passportSummary: { ...rawSubmission.passportSummary, name: "Updated Traveller" } };
  const updatedResult = parseJourneyLeadSubmission(updatedRaw);
  assert(updatedResult.ok, "updated existing lead remains valid");
  await processJourneyLead(updatedResult.value, { repository, notifier, createClaimToken: () => "claim-3" });
  assert(repository.leads.get(lead.passportReference)?.guestName === "Updated Traveller", "existing lead fields are updated by Passport reference");

  const notConfiguredRepository = new MemoryRepository();
  const notConfigured = await processJourneyLead(lead, {
    repository: notConfiguredRepository, notifier: { send: async () => ({ status: "not-configured" }) }, createClaimToken: () => "claim-4",
  });
  assert(notConfigured.stored && notConfigured.notificationStatus === "not-configured", "missing email configuration does not lose the lead");
  assert(notConfiguredRepository.notification.get(lead.passportReference) === "not-configured", "not-configured state is recorded");

  const failingNotificationRepository = new MemoryRepository();
  const originalError = console.error;
  console.error = () => undefined;
  const failedNotification = await processJourneyLead(lead, {
    repository: failingNotificationRepository,
    notifier: { send: async () => { throw new JourneyLeadNotificationError("provider_rejected"); } },
    createClaimToken: () => "claim-5",
  });
  console.error = originalError;
  assert(failedNotification.stored && failedNotification.notificationStatus === "failed", "email failure after storage still succeeds for the guest");
  assert(failingNotificationRepository.leads.size === 1, "email failure preserves the stored lead");
  assert(failingNotificationRepository.events.has(`${lead.passportReference}:notification_failed`), "email failure event is recorded");

  const failingDatabase = new MemoryRepository();
  failingDatabase.failUpsert = true;
  let databaseFailed = false;
  try { await processJourneyLead(lead, { repository: failingDatabase, notifier }); } catch { databaseFailed = true; }
  assert(databaseFailed, "database failure remains a critical submission failure");

  const failingClaim = new MemoryRepository();
  failingClaim.failClaim = true;
  console.error = () => undefined;
  const claimResult = await processJourneyLead(lead, { repository: failingClaim, notifier });
  console.error = originalError;
  assert(claimResult.stored && claimResult.notificationStatus === "failed", "notification claim failure does not block a stored lead");

  const acceptedEntry = await processJourneyLeadEvent({ passportReference: lead.passportReference, eventType: "journey_director_entered" }, repository);
  assert(acceptedEntry && repository.events.has(`${lead.passportReference}:journey_director_entered`), "Journey Director entry event is recorded");
  const acceptedWhatsApp = await processJourneyLeadEvent({ passportReference: lead.passportReference, eventType: "whatsapp_handoff_opened" }, repository);
  assert(acceptedWhatsApp && repository.whatsApp.has(lead.passportReference), "WhatsApp updates the existing lead");
  assert(repository.leads.size === 1, "WhatsApp tracking does not create another lead");
}

async function verifyCallbackService() {
  const repository = new MemoryRepository();
  const lead = validLead();
  await repository.upsertLead(lead);
  const parsed = parseJourneyCallbackSubmission(rawCallback);
  assert(parsed.ok, "callback service fixture is valid");
  let deliveries = 0;
  const notifier: JourneyCallbackNotifier = {
    sendCallback: async () => {
      deliveries += 1;
      return { status: "sent", providerRequestId: `callback-${deliveries}`, originalMessageId: "<initial-message@resend.test>" };
    },
  };

  const first = await processJourneyCallback(parsed.value, { repository, notifier, createClaimToken: () => "callback-claim-1" });
  assert(first.stored && first.notificationStatus === "sent", "first callback preference updates and notifies the existing Passport");
  assert(repository.leads.size === 1, "callback processing never creates another lead");
  assert(repository.events.has(`${lead.passportReference}:callback_preference_updated`), "callback event is recorded on the existing Passport");

  const duplicate = await processJourneyCallback(parsed.value, { repository, notifier, createClaimToken: () => "callback-claim-2" });
  assert(duplicate.notificationStatus === "duplicate" && deliveries === 1, "identical callback preference does not send twice");

  const changedResult = parseJourneyCallbackSubmission({ ...rawCallback, preferredDate: "2099-12-09" });
  assert(changedResult.ok, "changed callback fixture is valid");
  const changed = await processJourneyCallback(changedResult.value, { repository, notifier, createClaimToken: () => "callback-claim-3" });
  assert(changed.notificationStatus === "sent" && Number(deliveries) === 2, "changed callback preference sends exactly one new reply");
  assert(repository.leads.size === 1 && repository.events.size === 1, "updated callback reuses one lead and one idempotent callback event");

  const notConfiguredRepository = new MemoryRepository();
  await notConfiguredRepository.upsertLead(lead);
  const notConfigured = await processJourneyCallback(parsed.value, {
    repository: notConfiguredRepository,
    notifier: { sendCallback: async () => ({ status: "not-configured" }) },
    createClaimToken: () => "callback-claim-4",
  });
  assert(notConfigured.stored && notConfigured.notificationStatus === "not-configured", "missing mail configuration does not lose callback preference");
  assert(notConfiguredRepository.callbackNotification.get(lead.passportReference) === "not-configured", "callback notification failure state is persisted");

  const failedRepository = new MemoryRepository();
  await failedRepository.upsertLead(lead);
  const originalError = console.error;
  console.error = () => undefined;
  const failed = await processJourneyCallback(parsed.value, {
    repository: failedRepository,
    notifier: { sendCallback: async () => { throw new JourneyLeadNotificationError("thread_reference_missing"); } },
    createClaimToken: () => "callback-claim-5",
  });
  console.error = originalError;
  assert(failed.stored && failed.notificationStatus === "failed", "threading failure preserves the securely stored callback");
  assert(failedRepository.callbackNotified.size === 1, "failed identical callback is finalized against repeat spam");
}

async function verifyNotificationProvider() {
  const lead = validLead({
    guestName: "<Test & Traveller>",
    passportSummary: { ...rawSubmission.passportSummary, name: "<Test & Traveller>" },
  });
  const email = createJourneyLeadEmail(lead);
  assert(email.html.includes("&lt;Test &amp; Traveller&gt;") && !email.html.includes("<Test & Traveller>"), "notification HTML escapes guest values");
  assert(email.text.includes("Mobile: 9000000000"), "plain-text notification includes the guest contact");

  const missing = createJourneyLeadNotifier({});
  assert((await missing.send(lead)).status === "not-configured", "missing provider credentials return not-configured");
  const providerRequests: Array<{ input: string; init?: RequestInit }> = [];
  const configured = createJourneyLeadNotifier({
    RESEND_API_KEY: "test-key", JOURNEY_LEAD_FROM_EMAIL: "bookings@example.com",
    JOURNEY_LEAD_NOTIFICATION_EMAILS: "one@example.com, two@example.com, ONE@example.com",
  }, async (input, init) => {
    const url = String(input);
    providerRequests.push({ input: url, init });
    if (init?.method === "GET") {
      const messageId = url.includes("callback-provider-id") ? "<callback-message@resend.test>" : "<initial-message@resend.test>";
      return Response.json({ message_id: messageId });
    }
    const body = JSON.parse(String(init?.body ?? "{}")) as { subject?: string };
    return Response.json({ id: body.subject?.startsWith("Re:") ? "callback-provider-id" : "initial-provider-id" });
  });
  const initialNotification = await configured.send(lead);
  assert(initialNotification.status === "sent" && initialNotification.messageId === "<initial-message@resend.test>", "configured provider captures the original Message-ID");
  const initialPost = providerRequests.find((request) => request.init?.method === "POST");
  const parsedBody = JSON.parse(String(initialPost?.init?.body ?? "{}")) as { to: string[] };
  assert(parsedBody.to.length === 2, "provider receives only deduplicated recipients");

  const callbackLead: JourneyCallbackLead = {
    ...rawCallback,
    mobileNormalized: "9000000000",
    fingerprint: "a".repeat(64),
    initialProviderRequestId: "initial-provider-id",
    initialMessageId: "<initial-message@resend.test>",
  };
  const callbackEmail = createJourneyCallbackEmail(callbackLead, "<initial-message@resend.test>");
  assert(callbackEmail.subject === `Re: New Journey Passport • ${lead.passportReference}`, "callback subject uses the required Passport thread subject");
  assert(callbackEmail.text.includes("This callback request has been added to the existing Journey Passport."), "callback email contains the required lifecycle footer");
  const callbackNotification = await configured.sendCallback(callbackLead);
  assert(callbackNotification.status === "sent" && callbackNotification.originalMessageId === "<initial-message@resend.test>", "callback provider reports a threaded send");
  const callbackPost = providerRequests.filter((request) => request.init?.method === "POST").find((request) => String(request.init?.body).includes("Callback Request Received"));
  const callbackBody = JSON.parse(String(callbackPost?.init?.body ?? "{}")) as { headers?: Record<string, string>; subject?: string };
  assert(callbackBody.headers?.["In-Reply-To"] === "<initial-message@resend.test>", "callback reply uses the original Message-ID in In-Reply-To");
  assert(callbackBody.headers?.References === "<initial-message@resend.test>", "callback reply uses the original Message-ID in References");
  assert(callbackPost?.init?.headers && JSON.stringify(callbackPost.init.headers).includes(`callback/${lead.passportReference}/${callbackLead.fingerprint}`), "callback provider request uses a stable idempotency key");
}

async function verifyClientAndSecurity() {
  const success = await submitJourneyPassportLead(rawSubmission, async () => Response.json({ ok: true }));
  assert(success, "client accepts a successful lead-storage response");
  let rejected = false;
  try { await submitJourneyPassportLead(rawSubmission, async () => Response.json({ ok: false }, { status: 503 })); } catch { rejected = true; }
  assert(rejected, "client preserves retry flow when storage fails");
  const callbackStatus = await submitJourneyCallbackPreference(rawCallback, async () => Response.json({ ok: true, notificationStatus: "sent" }));
  assert(callbackStatus === "sent", "client accepts a stored and notified callback response");
  const duplicateStatus = await submitJourneyCallbackPreference(rawCallback, async () => Response.json({ ok: true, notificationStatus: "duplicate" }));
  assert(duplicateStatus === "duplicate", "client accepts an idempotent duplicate callback response");
  let callbackRejected = false;
  try { await submitJourneyCallbackPreference(rawCallback, async () => Response.json({ ok: false }, { status: 503 })); } catch { callbackRejected = true; }
  assert(callbackRejected, "client keeps callback preference retryable when secure storage fails");

  const rateKey = `verification-${Date.now()}`;
  for (let index = 0; index < 10; index += 1) assert(consumeJourneyLeadRateLimit(rateKey, 1000), "per-window request remains within the abuse limit");
  assert(!consumeJourneyLeadRateLimit(rateKey, 1000), "excessive repeated requests are limited");

  const root = process.cwd();
  const migration = readFileSync(join(root, "../supabase/migrations/20260802130000_journey_passport_leads.sql"), "utf8");
  const callbackMigration = readFileSync(join(root, "../supabase/migrations/20260803120000_journey_passport_callbacks.sql"), "utf8");
  assert((migration.match(/enable row level security/g) ?? []).length === 2, "RLS is enabled on both lead tables");
  assert(migration.includes("revoke all on table public.journey_passport_leads from anon, authenticated"), "public lead-table privileges are revoked");
  assert(!/create policy[\s\S]*using\s*\(\s*true\s*\)/i.test(migration), "migration contains no broad public read policy");
  assert(migration.includes("passport_reference text unique not null"), "Passport reference is the database idempotency key");
  assert(!callbackMigration.includes("create table"), "callback migration reuses the existing lead and event tables");
  assert(callbackMigration.includes("callback_preference_updated"), "callback event type is added to the existing event model");
  assert(callbackMigration.includes("claim_journey_passport_callback"), "callback notification claim is atomic in the database");
  assert(callbackMigration.includes("callback_notified_fingerprint is distinct from p_fingerprint"), "identical callback values are deduplicated by fingerprint");
  assert(callbackMigration.includes("from public, anon, authenticated"), "callback claim function is denied to public roles");

  const passportComponent = readFileSync(join(root, "components/journey-passport/JourneyPassport.tsx"), "utf8");
  const submitIndex = passportComponent.indexOf("await submitJourneyPassportLead");
  assert(submitIndex >= 0 && submitIndex < passportComponent.indexOf("savePassport(snapshot)", submitIndex), "client saves the Director snapshot only after server storage");
  assert(submitIndex < passportComponent.indexOf('setClosureStage("departing")', submitIndex), "Director transition starts only after storage");
  assert(passportComponent.includes("JOURNEY_LEAD_FAILURE_MESSAGE") && passportComponent.includes('setContactSubmission("idle")'), "storage failure restores a retryable form with preserved values");
  assert(passportComponent.includes('disabled={contactSubmission === "submitting" || contactSubmission === "success"}'), "submitting action is disabled against rapid double clicks");

  const browserSources = [
    passportComponent,
    readFileSync(join(root, "components/journey-director/JourneyDirectorExperience.tsx"), "utf8"),
    readFileSync(join(root, "lib/journey-leads/client.ts"), "utf8"),
  ].join("\n");
  assert(!browserSources.includes("SUPABASE_SECRET_KEY") && !browserSources.includes("RESEND_API_KEY"), "server credentials are absent from client source");
  assert(browserSources.includes('recordJourneyPassportEvent(journeyReference, "whatsapp_handoff_opened")'), "WhatsApp handoff records the existing Passport asynchronously");
  assert(browserSources.includes("submitJourneyCallbackPreference") && browserSources.includes("Your callback preference has been saved."), "Journey Director submits callbacks and shows the notified success message");
}

async function main() {
  await verifyValidation();
  await verifyLeadService();
  await verifyCallbackService();
  await verifyNotificationProvider();
  await verifyClientAndSecurity();
  console.log(`Journey lead verification passed (${checks} checks).`);
}

void main();
