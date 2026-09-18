// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).

export class WorkspaceSignInValidationError extends Error {
  constructor(readonly code: string) {
    super("Workspace sign-in request failed validation");
    this.name = "WorkspaceSignInValidationError";
  }
}

// EBC-R1.3-WS11-010: Workspace Authentication UX Refinement, Section 5
// (self-service password reset) reuses the same email-format and
// minimum-password-length rules already enforced for sign-in, rather than
// this EBC inventing a second copy of either — extracted here as their own
// functions so both validateWorkspaceSignInCredentials (unchanged below)
// and the new password-reset flow (auth/client.ts) call the same checks.
export class WorkspacePasswordResetValidationError extends Error {
  constructor(readonly code: string) {
    super("Workspace password reset request failed validation");
    this.name = "WorkspacePasswordResetValidationError";
  }
}

export interface ValidatedWorkspaceSignInCredentials {
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_WORKSPACE_PASSWORD_LENGTH = 8;

export function validateWorkspaceEmail(email: string): string {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
    throw new WorkspaceSignInValidationError("invalid_email");
  }
  return trimmedEmail;
}

export function validateWorkspaceSignInCredentials(
  email: string,
  password: string,
): ValidatedWorkspaceSignInCredentials {
  const trimmedEmail = validateWorkspaceEmail(email);

  if (!password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH) {
    throw new WorkspaceSignInValidationError("invalid_password");
  }

  return { email: trimmedEmail, password };
}

export function validateWorkspaceNewPassword(password: string, confirmPassword: string): string {
  if (!password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH) {
    throw new WorkspacePasswordResetValidationError("invalid_password");
  }
  if (password !== confirmPassword) {
    throw new WorkspacePasswordResetValidationError("password_mismatch");
  }
  return password;
}
