"use client";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// EBC-R1.3-WS11-009: Unified Authentication Entry Experience — added
// describeWorkspaceSignInError() (shared by /workspace/sign-in and the new
// header SignInModal, so the same credential form doesn't grow two copies
// of the same error-to-message mapping — Project Instructions §18) and
// signOutCurrentWorkspaceUserFromClient() for the header's Sign Out, which
// runs from public pages that are not under /workspace and so cannot call
// the existing Server Action in app/workspace/page.tsx. Signing out through
// the browser Supabase client (rather than a Server Action) is deliberate:
// it fires this client's own onAuthStateChange immediately, which is what
// useWorkspaceAuthUser (web/hooks/) listens on to update the header without
// a full page reload — a server-side signOut alone would clear cookies but
// not notify this already-loaded browser client.
// Client Component-callable Workspace auth actions.

import { createWorkspaceSupabaseBrowserClient } from "../supabase/browser";
import {
  validateWorkspaceEmail,
  validateWorkspaceNewPassword,
  validateWorkspaceSignInCredentials,
  WorkspacePasswordResetValidationError,
  WorkspaceSignInValidationError,
} from "./validation";

export class WorkspaceSignInError extends Error {
  constructor(readonly code: string) {
    super("Workspace sign-in failed");
    this.name = "WorkspaceSignInError";
  }
}

export async function signInWorkspaceUserWithPassword(email: string, password: string): Promise<void> {
  const credentials = validateWorkspaceSignInCredentials(email, password);
  const supabase = createWorkspaceSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw new WorkspaceSignInError(error.message);
  }
}

export async function signOutCurrentWorkspaceUserFromClient(): Promise<void> {
  const supabase = createWorkspaceSupabaseBrowserClient();
  await supabase.auth.signOut();
}

// Plain engineering-level copy, in the same register as this form's other
// messages — not approved business copy. Shared so both sign-in surfaces
// stay in sync automatically rather than by two people remembering to edit
// both files.
export function describeWorkspaceSignInError(err: unknown): string {
  if (err instanceof WorkspaceSignInValidationError) {
    return err.code === "invalid_email"
      ? "Enter a valid email address."
      : "Password must be at least 8 characters.";
  }
  if (err instanceof WorkspaceSignInError) {
    return "Invalid email or password.";
  }
  return "Sign-in failed. Please try again.";
}

// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement, Section 5 —
// self-service password reset, using Supabase Auth's own native capability
// (resetPasswordForEmail / exchangeCodeForSession / updateUser) rather than
// a bespoke reset mechanism. No new authentication provider, no new backend
// route: the browser Supabase client already used above for sign-in/sign-out
// is reused unchanged.
export class WorkspacePasswordResetError extends Error {
  constructor(readonly code: string) {
    super("Workspace password reset failed");
    this.name = "WorkspacePasswordResetError";
  }
}

export async function requestWorkspacePasswordReset(email: string, redirectTo: string): Promise<void> {
  const validatedEmail = validateWorkspaceEmail(email);
  const supabase = createWorkspaceSupabaseBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, { redirectTo });
  if (error) {
    throw new WorkspacePasswordResetError(error.message);
  }
}

// Called once, on mount, by the reset-password page when the incoming link
// carries Supabase's PKCE `?code=` param. If the link instead used the
// implicit/hash flow, the browser Supabase client resolves the recovery
// session on its own (the fragment never reaches the server at all) and
// this is simply not called — the page checks for an existing session
// either way (see app/workspace/reset-password/page.tsx).
export async function exchangeWorkspacePasswordResetCode(code: string): Promise<void> {
  const supabase = createWorkspaceSupabaseBrowserClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw new WorkspacePasswordResetError(error.message);
  }
}

export async function updateCurrentWorkspaceUserPassword(password: string, confirmPassword: string): Promise<void> {
  const validatedPassword = validateWorkspaceNewPassword(password, confirmPassword);
  const supabase = createWorkspaceSupabaseBrowserClient();
  const { error } = await supabase.auth.updateUser({ password: validatedPassword });
  if (error) {
    throw new WorkspacePasswordResetError(error.message);
  }
}

// Plain engineering-level copy, matching describeWorkspaceSignInError's own
// register — not approved business copy.
export function describeWorkspacePasswordResetError(err: unknown): string {
  if (err instanceof WorkspacePasswordResetValidationError) {
    if (err.code === "invalid_email") return "Enter a valid email address.";
    if (err.code === "password_mismatch") return "Passwords do not match.";
    return "Password must be at least 8 characters.";
  }
  if (err instanceof WorkspacePasswordResetError) {
    return "That link is invalid or has expired. Please request a new one.";
  }
  return "Something went wrong. Please try again.";
}
