"use client";

// EBC-R1.3-WS13-005 Phase 0 (CM-07; UX Rev 4a §36.2): loads the active
// configured Service Categories for the Journey Planning create form and
// Trip Basics panel from GET /api/workspace/journey-workspace/reference-data.
// `options` is null while loading or on failure; `failed` tells the panel
// to show its load-failure helper instead of the normal one.

import { useEffect, useState } from "react";

import type { ServiceCategoryOption } from "./TripBasicsPanel";

export function useServiceCategoryOptions(): { options: ServiceCategoryOption[] | null; failed: boolean } {
  const [options, setOptions] = useState<ServiceCategoryOption[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const response = await fetch("/api/workspace/journey-workspace/reference-data", { cache: "no-store" });
        const body = await response.json();
        if (cancelled) return;
        if (!response.ok || !body.ok) {
          setFailed(true);
          return;
        }
        const list = (body.referenceLists?.service_categories ?? []) as Array<{ code: string; label: string }>;
        setOptions(list.map((item) => ({ code: item.code, label: item.label })));
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { options, failed };
}
