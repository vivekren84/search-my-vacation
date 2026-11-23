export interface StaffOtpChallenge {
  identifier: string;
  code: string;
  channel: "email" | "sms";
  expiresAt: number;
  attempts: number;
  staff: {
    fullName: string;
    email: string;
    role: string;
    phoneE164: string;
    requiresPasswordChange?: boolean;
  };
}

export interface AuthorizedStaffAccount {
  fullName: string;
  role: string;
  email: string;
  phoneE164: string;
  requiresPasswordChange?: boolean;
  password?: string;
  status?: "Active" | "Pending First Login" | "Inactive";
  deactivatedAt?: string | null;
  invitedAt?: string;
}

// Global in-memory challenge store persisting across route requests in the Node runtime
const globalChallenges: Map<string, StaffOtpChallenge> =
  (globalThis as any)._smvPortalOtpChallenges || new Map<string, StaffOtpChallenge>();

(globalThis as any)._smvPortalOtpChallenges = globalChallenges;

export const portalOtpStore = {
  saveChallenge(challenge: StaffOtpChallenge) {
    globalChallenges.set(challenge.identifier.toLowerCase(), challenge);
  },

  getChallenge(identifier: string): StaffOtpChallenge | undefined {
    const key = identifier.toLowerCase();
    const challenge = globalChallenges.get(key);
    if (!challenge) return undefined;
    if (Date.now() > challenge.expiresAt) {
      globalChallenges.delete(key);
      return undefined;
    }
    return challenge;
  },

  deleteChallenge(identifier: string) {
    globalChallenges.delete(identifier.toLowerCase());
  },
};

// Global in-memory authorized staff directory persisting across serverless invocations
const initialAccounts: Record<string, AuthorizedStaffAccount> = {
  "vivek@searchmyvacation.com": {
    fullName: "Vivek Renganathan",
    role: "super_admin",
    email: "vivek@searchmyvacation.com",
    phoneE164: "+918925838541",
    password: "TemporaryDefaultPass#2026",
    status: "Active",
    requiresPasswordChange: false,
    invitedAt: "2026-11-01",
  },
  "tiger@searchmyvacation.com": {
    fullName: "Tiger CTO",
    role: "administrator",
    email: "tiger@searchmyvacation.com",
    phoneE164: "+919884012345",
    password: "TemporaryDefaultPass#2026",
    status: "Active",
    requiresPasswordChange: false,
    invitedAt: "2026-11-05",
  },
};

export const AUTHORIZED_STAFF_ACCOUNTS: Record<string, AuthorizedStaffAccount> =
  (globalThis as any)._smvAuthorizedStaffAccounts || initialAccounts;

// Cleanse any old persisted demo accounts across warm runtime instances
delete AUTHORIZED_STAFF_ACCOUNTS["sri@searchmyvacation.com"];
delete AUTHORIZED_STAFF_ACCOUNTS["keerthi@searchmyvacation.com"];

(globalThis as any)._smvAuthorizedStaffAccounts = AUTHORIZED_STAFF_ACCOUNTS;

export function findStaffByEmailOrPhone(identifier: string): AuthorizedStaffAccount | null {
  const cleaned = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");

  // 1. Direct email match
  if (AUTHORIZED_STAFF_ACCOUNTS[cleaned]) {
    return AUTHORIZED_STAFF_ACCOUNTS[cleaned];
  }

  // 2. Iterate all registered accounts
  for (const account of Object.values(AUTHORIZED_STAFF_ACCOUNTS)) {
    if (account.email.toLowerCase() === cleaned) {
      return account;
    }
    const accDigits = account.phoneE164.replace(/\D/g, "");
    if (digits.length >= 10 && accDigits.length >= 10) {
      if (accDigits.slice(-10) === digits.slice(-10)) {
        return account;
      }
    }
    if (accDigits && accDigits === digits) {
      return account;
    }
  }

  return null;
}
