import type { JourneyPassportSnapshot } from "../../../types/journey-director";

const completedAt = "2026-07-22T09:00:00.000Z";

function passport(overrides: Partial<JourneyPassportSnapshot>): JourneyPassportSnapshot {
  return {
    name: "Vivek",
    companion: "Family",
    dreamJourney: "Tropical Escape",
    travelStyles: ["Relaxation", "Nature", "Food & Dining"],
    timing: "I’m Flexible",
    startDate: "",
    endDate: "",
    destinationMode: "discovery",
    destination: "",
    completedAt,
    source: "journey-passport",
    ...overrides,
  };
}

export const representativeProfiles = {
  relaxedFamily: passport({}),
  cultureCouple: passport({
    name: "Ananya",
    companion: "Couple",
    dreamJourney: "City Discovery",
    travelStyles: ["Culture & Heritage", "Food & Dining", "Photography"],
    timing: "Later This Year",
  }),
  activeFriends: passport({
    name: "Rohan",
    companion: "Friends",
    dreamJourney: "Wildlife Adventure",
    travelStyles: ["Adventure", "Wildlife", "Nature"],
    timing: "In the Next 2–3 Months",
  }),
  mountainCelebration: passport({
    name: "Ishita",
    companion: "Couple",
    dreamJourney: "Mountain Retreat",
    travelStyles: ["Celebrations", "Photography"],
  }),
  beachExplorer: passport({
    name: "Arjun",
    companion: "Friends",
    dreamJourney: "Tropical Escape",
    travelStyles: ["Beaches & Islands", "Adventure", "Photography"],
  }),
  internationalOnly: passport({
    name: "Naina",
    companion: "Couple",
    dreamJourney: "City Discovery",
    travelStyles: ["Culture & Heritage", "Food & Dining"],
    travelScope: "INTERNATIONAL",
  }),
  domesticOnly: passport({
    name: "Dev",
    companion: "Family",
    dreamJourney: "City Discovery",
    travelStyles: ["Culture & Heritage", "Food & Dining"],
    travelScope: "DOMESTIC",
  }),
  incompatibleKnownDestination: passport({
    name: "Maya",
    companion: "Couple",
    dreamJourney: "Mountain Retreat",
    travelStyles: ["Celebrations", "Photography"],
    destinationMode: "known",
    destination: "Goa",
  }),
  knownServedDestination: passport({
    name: "Leela",
    companion: "Couple",
    dreamJourney: "Tropical Escape",
    travelStyles: ["Relaxation", "Food & Dining", "Nature"],
    destinationMode: "known",
    destination: "Kerala",
  }),
  knownUnsupportedDestination: passport({
    name: "Meera",
    companion: "Couple",
    dreamJourney: "City Discovery",
    travelStyles: ["Culture & Heritage", "Food & Dining"],
    destinationMode: "known",
    destination: "Japan",
  }),
  incomplete: passport({
    name: "",
    travelStyles: [],
  }),
} as const;
