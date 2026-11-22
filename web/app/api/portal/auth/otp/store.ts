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

export const AUTHORIZED_STAFF_ACCOUNTS: Record<
  string,
  { fullName: string; role: string; email: string; phoneE164: string; requiresPasswordChange?: boolean }
> = {
  "vivek@searchmyvacation.com": {
    fullName: "Vivek Renganathan",
    role: "super_admin",
    email: "vivek@searchmyvacation.com",
    phoneE164: "+918925838541",
  },
  "tiger@searchmyvacation.com": {
    fullName: "Tiger CTO",
    role: "administrator",
    email: "tiger@searchmyvacation.com",
    phoneE164: "+919884012345",
  },
  "sri@searchmyvacation.com": {
    fullName: "Sri",
    role: "desk_user",
    email: "sri@searchmyvacation.com",
    phoneE164: "+919840154321",
    requiresPasswordChange: true,
  },
  "keerthi@searchmyvacation.com": {
    fullName: "Keerthi Renganathan",
    role: "privilege_user",
    email: "keerthi@searchmyvacation.com",
    phoneE164: "+919840198765",
  },
};
