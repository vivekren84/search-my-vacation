// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).

export class WorkspaceSignInValidationError extends Error {
  constructor(readonly code: string) {
    super("Workspace sign-in request failed validation");
    this.name = "WorkspaceSignInValidationError";
  }
}

export interface ValidatedWorkspaceSignInCredentials {
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWorkspaceSignInCredentials(
  email: string,
  password: string,
): ValidatedWorkspaceSignInCredentials {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
    throw new WorkspaceSignInValidationError("invalid_email");
  }
  if (!password || password.length < 8) {
    throw new WorkspaceSignInValidationError("invalid_password");
  }

  return { email: trimmedEmail, password };
}
