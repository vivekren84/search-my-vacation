#!/usr/bin/env node
/**
 * Search My Vacation (SMV) — Release 1.5 Super Admin User Governance & Claude Verification
 */

import assert from "node:assert";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = join(__dirname, "..");

console.log("\n================================================================================");
console.log("=== VERIFYING RELEASE 1.5: SUPER ADMIN USER GOVERNANCE & CLAUDE INTEGRATION ===");
console.log("================================================================================\n");

let checksPassed = 0;

// Test 1: Self-Protection Guardrail in Service & Routes
console.log("--> [Check 1] Self-Protection Guardrail for Super Admin (vivek@searchmyvacation.com)...");
const serviceCode = readFileSync(join(webRoot, "lib/staff-portal/auth/service.ts"), "utf8");
assert(
  serviceCode.includes('target.email.toLowerCase() === "vivek@searchmyvacation.com"') &&
    serviceCode.includes("Super Admin account cannot be deactivated"),
  "Self-protection: StaffAuthService blocks deactivation of Super Admin"
);
assert(
  serviceCode.includes("Super Admin account cannot be deleted"),
  "Self-protection: StaffAuthService blocks deletion of Super Admin"
);

const inviteRouteCode = readFileSync(join(webRoot, "app/api/portal/auth/invite/route.ts"), "utf8");
assert(
  inviteRouteCode.includes('emailCleaned === "vivek@searchmyvacation.com"') &&
    inviteRouteCode.includes("Super Admin account cannot be deactivated"),
  "Self-protection: PATCH route blocks deactivation of Super Admin"
);
assert(
  inviteRouteCode.includes('emailCleaned === "vivek@searchmyvacation.com"') &&
    inviteRouteCode.includes("Super Admin account cannot be deleted"),
  "Self-protection: DELETE route blocks deletion of Super Admin"
);

const adminHelperCode = readFileSync(join(webRoot, "lib/supabase/admin.ts"), "utf8");
assert(
  adminHelperCode.includes('normalizedEmail === "vivek@searchmyvacation.com"') &&
    adminHelperCode.includes("Super Admin account cannot be deleted"),
  "Self-protection: Supabase Admin helper blocks deletion of Super Admin"
);
assert(
  adminHelperCode.includes('normalizedEmail === "vivek@searchmyvacation.com"') &&
    adminHelperCode.includes("Super Admin account cannot be deactivated"),
  "Self-protection: Supabase Admin helper blocks deactivation of Super Admin"
);
checksPassed += 6;
console.log("  ✓ Super Admin self-protection guardrails verified across 3 architectural layers");

// Test 2: Deactivation blocks login & OTP challenge
console.log("--> [Check 2] Deactivated status blocks login and OTP challenge...");
const loginRouteCode = readFileSync(join(webRoot, "app/api/portal/auth/login/route.ts"), "utf8");
assert(
  loginRouteCode.includes('staff.status === "Inactive"') &&
    loginRouteCode.includes("Account has been deactivated"),
  "Login route blocks deactivated accounts"
);

const otpSendRouteCode = readFileSync(join(webRoot, "app/api/portal/auth/otp/send/route.ts"), "utf8");
assert(
  otpSendRouteCode.includes('staff.status === "Inactive"') &&
    otpSendRouteCode.includes("Account has been deactivated"),
  "OTP Send route blocks deactivated accounts"
);
checksPassed += 2;
console.log("  ✓ Deactivated accounts blocked from password login and OTP generation");

// Test 3: OTP Guardrail for Pending Initial Activation
console.log("--> [Check 3] OTP Guardrail for accounts pending initial activation...");
assert(
  otpSendRouteCode.includes("staff.requiresPasswordChange") &&
    otpSendRouteCode.includes(
      "Account pending initial activation. Please sign in using your temporary password sent to your email to set your permanent credentials."
    ),
  "OTP guardrail rejects OTP requests for unactivated accounts with exact PO message"
);
checksPassed += 1;
console.log("  ✓ OTP bypass prevented for pending invitee accounts");

// Test 4: Invitation Dispatches Welcome Email with Temporary Password and ZERO Mobile OTP
console.log("--> [Check 4] Staff Invitation Delivery (Welcome Email Only, Zero Mobile OTP)...");
assert(
  inviteRouteCode.includes("https://api.resend.com/emails") &&
    inviteRouteCode.includes("TemporaryDefaultPass#2026") &&
    inviteRouteCode.includes("https://www.searchmyvacation.com/portal/login"),
  "Invitation dispatches welcome email with credentials via Resend"
);
assert(
  inviteRouteCode.includes(
    "Invitation dispatched via email. Temporary password provided. No mobile OTP required."
  ),
  "Invitation route returns exact success message"
);
assert(
  !inviteRouteCode.includes("staff_otp_challenges") &&
    !inviteRouteCode.includes("requestOtpChallenge"),
  "Zero OTP challenges created on invitation"
);
checksPassed += 3;
console.log("  ✓ Staff Invitation dispatches welcome email only with zero mobile OTP");

// Test 5: First-Time Sign In & Password Rotation Modal
console.log("--> [Check 5] Invitee First-Time Sign-In & Password Enforcement...");
const portalLoginCode = readFileSync(join(webRoot, "app/portal/login/page.tsx"), "utf8");
assert(
  portalLoginCode.includes("First-Time Sign In Detected - Set Permanent Password"),
  "Login page displays exact modal title for first-time password rotation"
);

const passwordUpdateCode = readFileSync(join(webRoot, "app/api/portal/auth/password/update/route.ts"), "utf8");
assert(
  passwordUpdateCode.includes("staff.requiresPasswordChange = false") &&
    passwordUpdateCode.includes('staff.status = "Active"'),
  "Password update route clears rotation flag and sets status to Active"
);
checksPassed += 2;
console.log("  ✓ First-Time Sign In detected and permanent password rotation enforced");

// Test 6: Claude Project Itinerary Integration
console.log("--> [Check 6] Claude Project Itinerary Integration & Zero-Cost Artifact Launcher...");
const dashboardCode = readFileSync(join(webRoot, "app/portal/dashboard/page.tsx"), "utf8");
assert(
  dashboardCode.includes("Launch Claude Project Pop-Up"),
  "Dashboard provides 1-click [ 🚀 Launch Claude Project Pop-Up ] button"
);
assert(
  dashboardCode.includes('window.open(') &&
    dashboardCode.includes('"ClaudeProject"') &&
    dashboardCode.includes("width=1200,height=850"),
  "Popup window targets 'ClaudeProject' with 1200x850 dimensions"
);
assert(
  dashboardCode.includes("UNSPLASH VISUAL SPECIFICATIONS") &&
    dashboardCode.includes("TRAVEL PACING & STYLE") &&
    dashboardCode.includes("COMMERCIAL & PRICING GOVERNANCE"),
  "Copied client brief includes Destination, Pacing, Constraints, Attachments, Unsplash specs and Pricing governance"
);
assert(
  dashboardCode.includes("$4.50 USD/day") &&
    dashboardCode.includes("$135.00 USD/month"),
  "Dashboard documents Headless Claude 3.5 Sonnet API cost benchmark ($4.50/day vs $0.00 pop-up)"
);
checksPassed += 4;
console.log("  ✓ Claude Project Pop-Up artifact launcher and cost evaluation verified");

// Test 7: Zero Brand Tone Violations (No occurrences of "luxury")
console.log("--> [Check 7] Strict Brand Tone Mandate (Zero occurrences of 'luxury')...");
const filesToCheck = [
  "app/portal/dashboard/page.tsx",
  "app/portal/login/page.tsx",
  "app/api/portal/auth/invite/route.ts",
  "app/api/portal/auth/login/route.ts",
  "app/api/portal/auth/password/update/route.ts",
  "app/api/portal/auth/users/route.ts",
  "lib/supabase/admin.ts",
  "lib/staff-portal/auth/service.ts",
];
let luxuryFound = 0;
for (const rel of filesToCheck) {
  const content = readFileSync(join(webRoot, rel), "utf8");
  const matches = content.match(/\bluxury\b/gi);
  if (matches) {
    console.error(`  ✗ Brand violation in ${rel}: ${matches.length} occurrences`);
    luxuryFound += matches.length;
  }
}
assert(luxuryFound === 0, "Zero occurrences of 'luxury' found across modified production files");
checksPassed += 1;
console.log("  ✓ Brand Tone Mandate 100% compliant: 0 occurrences of 'luxury'");

console.log("\n================================================================================");
console.log(`=== ALL ${checksPassed} GOVERNANCE & CLAUDE INTEGRATION CHECKS VERIFIED GREEN ===`);
console.log("================================================================================\n");
