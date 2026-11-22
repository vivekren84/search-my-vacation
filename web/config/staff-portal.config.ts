/**
 * Search My Vacation — Staff Portal & Advisor Workspace Configuration (Release 1.5)
 *
 * Governs Smart OTP timeouts, cooldowns, trusted device lifespan,
 * and least-privilege RBAC role hierarchy.
 */

import type { StaffRole } from "../types/staff-portal.types";

export const staffPortalConfig = {
  auth: {
    portalRoutePrefix: "/portal",
    loginRoute: "/portal/login",
    dashboardRoute: "/portal/dashboard",
    adminRoutePrefix: "/portal/admin",
    sessionCookieName: "smv_staff_session",
    trustedDeviceCookieName: "smv_staff_trusted_device",
    /** 14-day trusted device validity (US-002 AC 5) */
    trustedDeviceDurationMs: 14 * 24 * 60 * 60 * 1000,
    /** Session cookie duration (8 hours of active work) */
    sessionDurationMs: 8 * 60 * 60 * 1000,
  },

  otp: {
    codeLength: 6,
    /** 10-minute validity for staff single-channel OTP (US-002 AC 4) */
    expirySeconds: 600,
    /** 60-second cooldown before resend or switching delivery channel (US-002 AC 4) */
    cooldownSeconds: 60,
    /** Maximum verify attempts before challenge is locked out */
    maxAttempts: 5,
  },

  pii: {
    /** 5-minute auto-masked viewing window after step-up OTP (US-003 AC 2) */
    unmaskWindowSeconds: 300,
  },

  rbac: {
    /**
     * Role hierarchy rank:
     * Administrator (3) > Privileged User (2) > Desk User (1)
     */
    hierarchy: {
      administrator: 3,
      privilege_user: 2,
      desk_user: 1,
    } as Record<StaffRole, number>,

    /**
     * Check if userRole meets or exceeds the requiredRole
     */
    hasMinimumRole(userRole: StaffRole, requiredRole: StaffRole): boolean {
      const userRank = staffPortalConfig.rbac.hierarchy[userRole] ?? 0;
      const requiredRank = staffPortalConfig.rbac.hierarchy[requiredRole] ?? 999;
      return userRank >= requiredRank;
    },
  },
} as const;
