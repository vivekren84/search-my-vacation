"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B: browser-side calls to the
// Milestone A Journey Workspace API (app/api/workspace/journey-workspace/**,
// EBC-R1.3-WS13-023 §7). One place turns every response into either data
// or a typed failure carrying the API's error code, its S-5 message and any
// field issues, so screens never show a raw or generic error.

import { useEffect, useState } from "react";

import { JOURNEY_WORKSPACE_ERROR_MESSAGES } from "@/lib/workspace/journey-workspace/messages";
import type { JourneyFieldIssue, JourneyWorkspaceErrorCode, OperationalContactType } from "@/lib/workspace/journey-workspace/types";

export type ApiFailure = {
  ok: false;
  status: number;
  code: JourneyWorkspaceErrorCode | "not_signed_in" | "no_access";
  message: string;
  issues: JourneyFieldIssue[];
};
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

export async function callJourneyApi<T>(url: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: init.body ? { "Content-Type": "application/json", ...(init.headers ?? {}) } : init.headers,
    });
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (response.ok && body.ok) return { ok: true, data: body as T };
    if (response.status === 401) {
      return { ok: false, status: 401, code: "not_signed_in", message: "Your session has ended. Sign in again to continue.", issues: [] };
    }
    const code = (body.code as JourneyWorkspaceErrorCode | undefined) ?? (response.status === 403 ? "no_access" : "operation_failed");
    const message =
      typeof body.message === "string" && body.code
        ? body.message
        : code === "no_access"
          ? (typeof body.message === "string" ? body.message : JOURNEY_WORKSPACE_ERROR_MESSAGES.not_authorised)
          : JOURNEY_WORKSPACE_ERROR_MESSAGES.operation_failed;
    return { ok: false, status: response.status, code, message, issues: (body.issues as JourneyFieldIssue[] | undefined) ?? [] };
  } catch {
    return { ok: false, status: 0, code: "operation_failed", message: JOURNEY_WORKSPACE_ERROR_MESSAGES.operation_failed, issues: [] };
  }
}

export function postJson<T>(url: string, body: unknown, method: "POST" | "PATCH" = "POST") {
  return callJourneyApi<T>(url, { method, body: JSON.stringify(body) });
}

// ---- Reference data and the user directory (loaded once per screen) ----

export interface ReadinessTemplateOption {
  id: string;
  code: string;
  name: string;
  itemCount: number;
}

export interface JourneyReferenceData {
  serviceCategories: Array<{ code: string; label: string }>;
  readinessTemplates: ReadinessTemplateOption[];
  contactTypes: OperationalContactType[];
}

export interface DirectoryUser {
  userId: string;
  displayName: string;
  role: "administrator" | "privilege_user";
  isActive: boolean;
}

type Loadable<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error" };

export function useReferenceData(): Loadable<JourneyReferenceData> {
  const [state, setState] = useState<Loadable<JourneyReferenceData>>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    void callJourneyApi<{
      referenceLists: { service_categories?: Array<{ code: string; label: string }> };
      readinessTemplates: ReadinessTemplateOption[];
      contactTypes: OperationalContactType[];
    }>("/api/workspace/journey-workspace/reference-data").then((result) => {
      if (cancelled) return;
      setState(
        result.ok
          ? {
              status: "ready",
              data: {
                serviceCategories: (result.data.referenceLists.service_categories ?? []).map(({ code, label }) => ({ code, label })),
                readinessTemplates: result.data.readinessTemplates ?? [],
                contactTypes: result.data.contactTypes ?? [],
              },
            }
          : { status: "error" },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

export function useDirectory(): Loadable<DirectoryUser[]> {
  const [state, setState] = useState<Loadable<DirectoryUser[]>>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    void callJourneyApi<{ users: DirectoryUser[] }>("/api/workspace/users/directory").then((result) => {
      if (!cancelled) setState(result.ok ? { status: "ready", data: result.data.users } : { status: "error" });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

export function serviceCategoryLabel(reference: Loadable<JourneyReferenceData>, code: string | null): string | null {
  if (!code) return null;
  if (reference.status !== "ready") return code;
  return reference.data.serviceCategories.find((item) => item.code === code)?.label ?? code;
}
