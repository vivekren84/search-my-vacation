"use client";
/* Session hydration restores the completed Passport once browser storage is available. */
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { isJourneyPassportSnapshot } from "@/lib/journey-director/passport-adapter";
import { isJourneySessionSnapshot } from "@/lib/journey-director/journey-synopsis";
import type { JourneyPassportSnapshot, JourneySessionSnapshot } from "@/types/journey-director";

type JourneySessionContextValue = {
  passport: JourneyPassportSnapshot | null;
  journeySession: JourneySessionSnapshot | null;
  isHydrated: boolean;
  savePassport: (passport: JourneyPassportSnapshot) => void;
  saveJourneySession: (session: JourneySessionSnapshot) => void;
  clearPassport: () => void;
};

const JOURNEY_PASSPORT_KEY = "smv:journey-director:passport:v2";
const JOURNEY_SESSION_KEY = "smv:journey-director:session:v2";
const JourneySessionContext = createContext<JourneySessionContextValue | null>(null);

export function JourneySessionProvider({ children }: { children: React.ReactNode }) {
  const [passport, setPassport] = useState<JourneyPassportSnapshot | null>(null);
  const [journeySession, setJourneySession] = useState<JourneySessionSnapshot | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem(JOURNEY_SESSION_KEY);
      if (storedSession) {
        const parsedSession: unknown = JSON.parse(storedSession);
        if (isJourneySessionSnapshot(parsedSession) && isJourneyPassportSnapshot(parsedSession.passport)) {
          setPassport(parsedSession.passport);
          setJourneySession(parsedSession);
          setIsHydrated(true);
          return;
        } else {
          sessionStorage.removeItem(JOURNEY_SESSION_KEY);
        }
      }

      const storedPassport = sessionStorage.getItem(JOURNEY_PASSPORT_KEY);
      if (storedPassport) {
        const parsedPassport: unknown = JSON.parse(storedPassport);
        if (isJourneyPassportSnapshot(parsedPassport)) {
          setPassport(parsedPassport);
        } else {
          sessionStorage.removeItem(JOURNEY_PASSPORT_KEY);
        }
      }
    } catch {
      // Continue without persistence when browser storage is unavailable or malformed.
    }

    setIsHydrated(true);
  }, []);

  const savePassport = useCallback((nextPassport: JourneyPassportSnapshot) => {
    setPassport(nextPassport);
    setJourneySession(null);
    try {
      sessionStorage.setItem(JOURNEY_PASSPORT_KEY, JSON.stringify(nextPassport));
      sessionStorage.removeItem(JOURNEY_SESSION_KEY);
    } catch {
      // The current in-memory journey remains available when browser storage is unavailable.
    }
  }, []);

  const saveJourneySession = useCallback((nextSession: JourneySessionSnapshot) => {
    setPassport(nextSession.passport);
    setJourneySession(nextSession);
    try {
      sessionStorage.setItem(JOURNEY_PASSPORT_KEY, JSON.stringify(nextSession.passport));
      sessionStorage.setItem(JOURNEY_SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      // The current in-memory session remains available when browser storage is unavailable.
    }
  }, []);

  const clearPassport = useCallback(() => {
    setPassport(null);
    setJourneySession(null);
    try {
      sessionStorage.removeItem(JOURNEY_PASSPORT_KEY);
      sessionStorage.removeItem(JOURNEY_SESSION_KEY);
    } catch {
      // The in-memory state has already been cleared.
    }
  }, []);

  const value = useMemo(
    () => ({
      passport,
      journeySession,
      isHydrated,
      savePassport,
      saveJourneySession,
      clearPassport,
    }),
    [clearPassport, isHydrated, journeySession, passport, saveJourneySession, savePassport],
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
