export type JourneyChapterId =
  | "welcome"
  | "about-you"
  | "companions"
  | "dream-journey"
  | "travel-style"
  | "timing"
  | "comfort"
  | "profile"
  | "contact"
  | "journey-begins";

export type JourneyChapterType =
  | "welcome"
  | "name"
  | "single-select"
  | "multi-select"
  | "timing"
  | "comfort"
  | "summary"
  | "contact"
  | "complete";

export type JourneyOption = {
  value: string;
  label: string;
  description?: string;
  imageSrc?: string;
};

export type JourneyBudgetOption = {
  value: string;
  label: string;
};

export type JourneyPassportState = {
  name: string;
  companion: string;
  dreamJourney: string;
  travelStyles: string[];
  timing: string;
  startDate: string;
  endDate: string;
  comfort: string;
  budget: string;
  preferences: Record<string, string>;
  contact: {
    name: string;
    phone: string;
    email: string;
    city: string;
  };
  feeling?: string;
};

export type JourneyChapter = {
  id: JourneyChapterId;
  number: number;
  navigationLabel: string;
  title: string;
  description?: string;
  type: JourneyChapterType;
  required: boolean;
  nextLabel: string;
  options?: JourneyOption[];
  validate: (state: JourneyPassportState) => boolean;
};

export type JourneyFieldErrors = Partial<Record<"name" | "phone" | "email" | "city" | "startDate" | "endDate", string>>;
