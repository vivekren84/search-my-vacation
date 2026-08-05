"use client";
/* Session hydration intentionally updates local React state once after browser storage is available. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { companionOptions, dreamJourneyOptions, journeyMomentIndex, journeyMoments, timingOptions, travelStyleOptions } from "@/config/journey-passport.config";
import { createInitialJourneyPassportState } from "@/lib/journey-passport/entry-context";
import { isJourneyEntryDestinationTheme, isJourneyEntryExperience, isJourneyEntryInspiration, isJourneyFeeling, JOURNEY_PASSPORT_SCHEMA_VERSION, type DestinationMode, type JourneyMomentId, type JourneyPassportDraft, type JourneyPassportEntryContext, type JourneyPassportState } from "@/types/journey-passport.types";

export const JOURNEY_PASSPORT_SESSION_KEY = "smv:journey-passport:v1";
export const JOURNEY_PASSPORT_ENTRY_KEY = "smv:journey-passport:entry:v1";
const MAX_DRAFT_AGE = 24 * 60 * 60 * 1000;

type UpdateValue = Partial<Pick<JourneyPassportState, "name" | "companion" | "dreamJourney" | "timing" | "startDate" | "endDate" | "destination" | "mobile" | "journeyReference">>;
type Action =
  | { type: "update"; value: UpdateValue }
  | { type: "toggle-style"; value: string }
  | { type: "set-destination-mode"; value: DestinationMode }
  | { type: "go-to"; value: JourneyMomentId; direction: "forward" | "backward" }
  | { type: "set-completion"; value: JourneyPassportState["completion"] }
  | { type: "restore"; value: JourneyPassportState }
  | { type: "reset"; value: JourneyPassportEntryContext };

const touched = (state: JourneyPassportState) => ({ ...state, updatedAt: Date.now() });
function reducer(state: JourneyPassportState, action: Action): JourneyPassportState {
  switch (action.type) {
    case "update": return touched({ ...state, ...action.value });
    case "toggle-style": { const selected = state.travelStyles.includes(action.value); if (!selected && state.travelStyles.length >= 3) return state; return touched({ ...state, travelStyles: selected ? state.travelStyles.filter((value) => value !== action.value) : [...state.travelStyles, action.value] }); }
    case "set-destination-mode": return touched({ ...state, destinationMode: action.value });
    case "go-to": return touched({ ...state, currentMoment: action.value, navigationDirection: action.direction, visitedMoments: state.visitedMoments.includes(action.value) ? state.visitedMoments : [...state.visitedMoments, action.value] });
    case "set-completion": return touched({ ...state, completion: action.value });
    case "restore": return action.value;
    case "reset": return createInitialJourneyPassportState(action.value);
  }
}

const allowed = (options: { value: string }[]) => new Set(options.map((option) => option.value));
const companionValues = allowed(companionOptions);
const dreamValues = allowed(dreamJourneyOptions);
const styleValues = allowed(travelStyleOptions);
const timingValues = allowed(timingOptions);
const momentValues = new Set(journeyMoments.map((moment) => moment.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitiseEntryContext(value: unknown): JourneyPassportEntryContext {
  if (!isRecord(value)) return {};

  return {
    ...(isJourneyFeeling(value.feeling) ? { feeling: value.feeling } : {}),
    ...(isJourneyEntryExperience(value.experience) ? { experience: value.experience } : {}),
    ...(isJourneyEntryInspiration(value.inspiration) ? { inspiration: value.inspiration } : {}),
    ...(typeof value.destination === "string" ? { destination: value.destination.slice(0, 100) } : {}),
    ...(isJourneyEntryDestinationTheme(value.destinationTheme) ? { destinationTheme: value.destinationTheme } : {}),
    ...(value.source === "homepage" || value.source === "direct" || value.source === "experience" || value.source === "mood" || value.source === "inspiration" || value.source === "destination" ? { source: value.source } : {}),
  };
}

function sanitiseDraft(value: unknown): JourneyPassportDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as Partial<JourneyPassportDraft>;
  if (draft.schemaVersion !== JOURNEY_PASSPORT_SCHEMA_VERSION || !draft.state || typeof draft.savedAt !== "number" || Date.now() - draft.savedAt > MAX_DRAFT_AGE) return null;
  const raw = draft.state as Partial<JourneyPassportState>;
  const currentMoment = momentValues.has(raw.currentMoment as JourneyMomentId) ? raw.currentMoment as JourneyMomentId : "welcome";
  const entryContext = sanitiseEntryContext(raw.entryContext);
  const state: JourneyPassportState = {
    ...createInitialJourneyPassportState(entryContext), currentMoment,
    name: typeof raw.name === "string" ? raw.name.slice(0, 80) : "",
    companion: companionValues.has(raw.companion ?? "") ? raw.companion! : "",
    dreamJourney: dreamValues.has(raw.dreamJourney ?? "") ? raw.dreamJourney! : "",
    travelStyles: Array.isArray(raw.travelStyles) ? [...new Set(raw.travelStyles.filter((item): item is string => typeof item === "string" && styleValues.has(item)))].slice(0, 3) : [],
    timing: timingValues.has(raw.timing ?? "") ? raw.timing! : "",
    startDate: typeof raw.startDate === "string" ? raw.startDate : "", endDate: typeof raw.endDate === "string" ? raw.endDate : "",
    destinationMode: raw.destinationMode === "known" || raw.destinationMode === "discovery" ? raw.destinationMode : "",
    destination: typeof raw.destination === "string" ? raw.destination.slice(0, 100) : "",
    mobile: typeof raw.mobile === "string" ? raw.mobile.replace(/\D/g, "").slice(0, 10) : "",
    journeyReference: typeof raw.journeyReference === "string" ? raw.journeyReference.slice(0, 12) : "",
    visitedMoments: Array.isArray(raw.visitedMoments) ? raw.visitedMoments.filter((id): id is JourneyMomentId => momentValues.has(id as JourneyMomentId)) : ["welcome"],
    completion: "idle", navigationDirection: "none", updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : draft.savedAt,
  };
  const currentIndex = journeyMomentIndex(state.currentMoment);
  const earliestInvalid = journeyMoments.slice(1, currentIndex).findIndex((moment) => !moment.validate(state));
  if (earliestInvalid >= 0) state.currentMoment = journeyMoments[earliestInvalid + 1].id;
  return { schemaVersion: JOURNEY_PASSPORT_SCHEMA_VERSION, state, savedAt: draft.savedAt };
}

export function useJourneyPassport(initialEntryContext: JourneyPassportEntryContext = {}) {
  const entryContextRef = useRef(initialEntryContext);
  const [state, dispatch] = useReducer(reducer, initialEntryContext, createInitialJourneyPassportState);
  const [hydrated, setHydrated] = useState(false);
  const [resumeDraft, setResumeDraft] = useState<JourneyPassportDraft | null>(null);
  const currentIndex = journeyMomentIndex(state.currentMoment);
  const moment = journeyMoments[currentIndex];
  const isValid = moment.validate(state);

  useEffect(() => {
    let entryContext = entryContextRef.current;
    try {
      const storedEntry = sessionStorage.getItem(JOURNEY_PASSPORT_ENTRY_KEY);
      if (storedEntry) { const parsedEntry: unknown = JSON.parse(storedEntry); entryContext = { ...entryContext, ...sanitiseEntryContext(parsedEntry) }; sessionStorage.removeItem(JOURNEY_PASSPORT_ENTRY_KEY); dispatch({ type: "reset", value: entryContext }); }
      const storedDraft = sessionStorage.getItem(JOURNEY_PASSPORT_SESSION_KEY);
      if (storedDraft) { const safe = sanitiseDraft(JSON.parse(storedDraft)); if (safe) setResumeDraft(safe); else sessionStorage.removeItem(JOURNEY_PASSPORT_SESSION_KEY); }
    } catch { sessionStorage.removeItem(JOURNEY_PASSPORT_SESSION_KEY); }
    window.history.replaceState({ ...(window.history.state ?? {}), journeyMoment: "welcome" }, "");
    setHydrated(true);
  }, []); // Initial browser hydration only.

  useEffect(() => {
    if (!hydrated || state.completion !== "idle" || state.currentMoment === "welcome") return;
    try { const draft: JourneyPassportDraft = { schemaVersion: JOURNEY_PASSPORT_SCHEMA_VERSION, state, savedAt: Date.now() }; sessionStorage.setItem(JOURNEY_PASSPORT_SESSION_KEY, JSON.stringify(draft)); } catch { /* In-memory flow remains available. */ }
  }, [hydrated, state]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const id = event.state?.journeyMoment as JourneyMomentId | undefined;
      if (!id || !momentValues.has(id)) return;
      const target = journeyMomentIndex(id);
      const direction = target < journeyMomentIndex(state.currentMoment) ? "backward" : "forward";
      const canOpen = target <= 0 || journeyMoments.slice(1, target + 1).every((candidate) => candidate.validate(state));
      if (canOpen) dispatch({ type: "go-to", value: id, direction });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [state]);

  const completedMoments = useMemo(() => journeyMoments.filter((candidate, index) => index < currentIndex && candidate.validate(state)).map((candidate) => candidate.id), [currentIndex, state]);
  const navigate = (id: JourneyMomentId, direction: "forward" | "backward", history: "push" | "none" = "push") => { dispatch({ type: "go-to", value: id, direction }); if (history === "push") window.history.pushState({ ...(window.history.state ?? {}), journeyMoment: id }, ""); };
  const next = () => { if (!isValid || currentIndex >= journeyMoments.length - 1) return false; navigate(journeyMoments[currentIndex + 1].id, "forward"); return true; };
  const previous = () => { if (currentIndex <= 0) return false; window.history.back(); return true; };
  const goTo = (id: JourneyMomentId) => { const target = journeyMomentIndex(id); if (target < 0 || target > currentIndex) return; navigate(id, target < currentIndex ? "backward" : "forward"); };
  const resume = () => {
    if (!resumeDraft) return;
    dispatch({ type: "restore", value: resumeDraft.state });
    const target = journeyMomentIndex(resumeDraft.state.currentMoment);
    window.history.replaceState({ ...(window.history.state ?? {}), journeyMoment: "welcome" }, "");
    journeyMoments.slice(1, target + 1).forEach((candidate) => window.history.pushState({ ...(window.history.state ?? {}), journeyMoment: candidate.id }, ""));
    setResumeDraft(null);
  };
  const startAgain = () => { try { sessionStorage.removeItem(JOURNEY_PASSPORT_SESSION_KEY); } catch {} setResumeDraft(null); dispatch({ type: "reset", value: initialEntryContext }); };
  const clearDraft = () => { try { sessionStorage.removeItem(JOURNEY_PASSPORT_SESSION_KEY); } catch {} };

  return { state, moment, currentIndex, completedMoments, isValid, hydrated, resumeDraft, dispatch, next, previous, goTo, resume, startAgain, clearDraft };
}
