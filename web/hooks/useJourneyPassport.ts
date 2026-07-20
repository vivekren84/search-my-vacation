"use client";

import { useState } from "react";

import { journeyChapters } from "@/config/journey-passport.config";
import type { JourneyPassportState } from "@/types/journey-passport.types";

const initialState = (feeling?: string): JourneyPassportState => ({
  name: "", companion: "", dreamJourney: "", travelStyles: [], timing: "", startDate: "", endDate: "", comfort: "", budget: "", preferences: {}, contact: { name: "", phone: "", email: "", city: "" }, feeling,
});

export function useJourneyPassport(feeling?: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<JourneyPassportState>(() => initialState(feeling));
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const chapter = journeyChapters[currentIndex];
  const isValid = chapter.validate(state);
  const isFinal = currentIndex === journeyChapters.length - 1;

  const update = (partial: Partial<JourneyPassportState>) => setState((current) => ({ ...current, ...partial }));
  const updateContact = (field: keyof JourneyPassportState["contact"], value: string) => setState((current) => ({ ...current, contact: { ...current.contact, [field]: value } }));
  const updatePreference = (key: string, value: string) => setState((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  const toggleTravelStyle = (value: string) => setState((current) => ({ ...current, travelStyles: current.travelStyles.includes(value) ? current.travelStyles.filter((item) => item !== value) : [...current.travelStyles, value] }));
  const next = () => {
    if (!isValid || isFinal) return false;
    setCompletedChapters((current) => current.includes(currentIndex) ? current : [...current, currentIndex]);
    setCurrentIndex((current) => Math.min(current + 1, journeyChapters.length - 1));
    return true;
  };
  const previous = () => setCurrentIndex((current) => Math.max(0, current - 1));
  const goTo = (index: number) => { if (index <= currentIndex || completedChapters.includes(index - 1)) setCurrentIndex(index); };

  return { state, chapter, currentIndex, completedChapters, isValid, isFinal, update, updateContact, updatePreference, toggleTravelStyle, next, previous, goTo };
}
