// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).

export const WORKSPACE_ROUTE_PREFIX = "/workspace";
export const WORKSPACE_SIGN_IN_PATH = "/workspace/sign-in";

// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement — self-service
// password reset (Section 5). This is the redirectTo target Supabase Auth's
// native resetPasswordForEmail() sends the reset link to; it must be added to
// the Supabase project's Auth > URL Configuration > Redirect URLs allow-list
// for every environment (localhost dev, any preview domains, production) or
// Supabase will reject the redirect — a Product Owner/Supabase-project-admin
// action outside this repository, disclosed in the EBC-R1.3-WS11-010
// implementation report as a dependency, not performed here.
export const WORKSPACE_RESET_PASSWORD_PATH = "/workspace/reset-password";

// EBC-R1.3-WS11-009: Unified Authentication Entry Experience — header
// dropdown menu destinations (Section 6). Several of these paths have no
// page implementation yet (Profile, Administration, User Management,
// Settings are future Engineering Phases per EBC-R1.3-WS11-006's phasing);
// they are declared centrally here now so the menu component and any future
// page work reference the same single source, rather than the route
// strings being duplicated or invented ad hoc later.
export const WORKSPACE_PROFILE_PATH = "/workspace/profile";
export const WORKSPACE_ADMINISTRATION_PATH = "/workspace/administration";
export const WORKSPACE_USER_MANAGEMENT_PATH = "/workspace/administration/users";
export const WORKSPACE_SETTINGS_PATH = "/workspace/settings";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation — left-navigation
// module destinations. Product ratification (Vivek, Product Owner, 17
// September 2026, resolving this EBC's own navigation-conflict escalation)
// supersedes this EBC's originally drafted flat navigation list with the
// already-approved Workspace Navigation Model / Information Architecture
// structure (Sophie/Arjun): Dashboard, an "Operational" group (Journey
// Planning, Journey Workspace) and a "Knowledge" group (Traveller Hub,
// Itinerary Studio, Vendor Management, Destination Intelligence). None of
// these six modules is implemented yet (Out of Scope for this EBC); each
// path renders the approved "Coming Soon" placeholder
// (components/workspace/shared/ComingSoon.tsx) until its own future EBC.
export const WORKSPACE_JOURNEY_PLANNING_PATH = "/workspace/journey-planning";
export const WORKSPACE_JOURNEY_WORKSPACE_PATH = "/workspace/journey-workspace";
export const WORKSPACE_TRAVELLER_HUB_PATH = "/workspace/traveller-hub";
export const WORKSPACE_ITINERARY_STUDIO_PATH = "/workspace/itinerary-studio";
export const WORKSPACE_VENDOR_MANAGEMENT_PATH = "/workspace/vendor-management";
export const WORKSPACE_DESTINATION_INTELLIGENCE_PATH = "/workspace/destination-intelligence";
