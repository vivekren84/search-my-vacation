"use client";
/* Session hydration restores the completed Passport once browser storage is available. */
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { isJourneyPassportSnapshot } from "@/lib/journey-director/passport-adapter";
import type { JourneyPassportSnapshot } from "@/types/journey-director";

type JourneySessionContextValue = {
  passport: JourneyPassportSnapshot | null;
  isHydrated: boolean;
  savePassport: (passport: JourneyPassportSnapshot) => void;
  clearPassport: () => void;
};

const JOURNEY_SESSION_KEY = "smv:journey-director:session:v1";
const JourneySessionContext = createContext<JourneySessionContextValue | null>(null);

export function JourneySessionProvider({ children }: { children: React.ReactNode }) {
  const [passport, setPassport] = useState<JourneyPassportSnapshot | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedPassport = sessionStorage.getItem(JOURNEY_SESSION_KEY);
      if (storedPassport) {
        const parsedPassport: unknown = JSON.parse(storedPassport);
        if (isJourneyPassportSnapshot(parsedPassport)) setPassport(parsedPassport);
        else sessionStorage.removeItem(JOURNEY_SESSION_KEY);
      }
    } catch {
      // Continue without persistence when browser storage is unavailable or malformed.
    }

    setIsHydrated(true);
  }, []);

  const savePassport = useCallback((nextPassport: JourneyPassportSnapshot) => {
    setPassport(nextPassport);
    try {
      sessionStorage.setItem(JOURNEY_SESSION_KEY, JSON.stringify(nextPassport));
    } catch {
      // The current in-memory journey remains available when browser storage is unavailable.
    }
  }, []);

  const clearPassport = useCallback(() => {
    setPassport(null);
    try {
      sessionStorage.removeItem(JOURNEY_SESSION_KEY);
    } catch {
      // The in-memory state has already been cleared.
    }
  }, []);

  const value = useMemo(
    () => ({
      passport,
      isHydrated,
      savePassport,
      clearPassport,
    }),
    [clearPassport, isHydrated, passport, savePassport],
  );

  return (
    <JourneySessionContext.Provider value={value}>
      {children}
    </JourneySessionContext.Provider>
  );
}

export function useJourneySession() {
  const context = useContext(JourneySessionContext);

  if (!context) {
    throw new Error("useJourneySession must be used inside JourneySessionProvider");
  }

  return context;
}
