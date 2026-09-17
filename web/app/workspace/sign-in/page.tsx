"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  signInWorkspaceUserWithPassword,
  WorkspaceSignInError,
} from "@/lib/workspace/shared/auth/client";
import { WorkspaceSignInValidationError } from "@/lib/workspace/shared/auth/validation";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Temporary, unstyled verification harness — not an approved Sophie screen.
// Proves the Supabase SSR authentication mechanism end-to-end for this
// Engineering Phase. Replaced once UX delivers the approved sign-in design.
export default function WorkspaceSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWorkspaceUserWithPassword(email, password);
      router.push("/workspace");
      router.refresh();
    } catch (err) {
      if (err instanceof WorkspaceSignInValidationError) {
        setError(
          err.code === "invalid_email"
            ? "Enter a valid email address."
            : "Password must be at least 8 characters.",
        );
      } else if (err instanceof WorkspaceSignInError) {
        setError("Invalid email or password.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-8">
      <h1 className="text-lg font-semibold">SMV Workspace — Sign In</h1>
      <p className="mt-1 text-sm text-gray-500">
        Engineering foundation verification form (EBC-R1.3-WS11-007) — not the approved sign-in design.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
