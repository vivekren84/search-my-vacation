import type { JourneyMoment, JourneyOption, JourneyPassportState } from "@/types/journey-passport.types";

const journeyPassportImage = (group: "companions" | "dream-journeys" | "travel-styles" | "timing", name: string) =>
  `/images/journey-passport/${group}/${name}.webp`;

export const companionOptions: JourneyOption[] = [
  { value: "Solo", label: "Solo", description: "Just you, and the world slowing down.", imageSrc: journeyPassportImage("companions", "solo") },
  { value: "Couple", label: "Couple", description: "Moments meant only for two.", imageSrc: journeyPassportImage("companions", "couple") },
  { value: "Family", label: "Family", description: "Memories that stay for a lifetime.", imageSrc: journeyPassportImage("companions", "family") },
  { value: "Friends", label: "Friends", description: "Stories you’ll talk about forever.", imageSrc: journeyPassportImage("companions", "friends") },
  { value: "Business", label: "Business", description: "Purposeful travel with room to reconnect and recharge.", imageSrc: journeyPassportImage("companions", "business") },
];

export const dreamJourneyOptions: JourneyOption[] = [
  { value: "Tropical Escape", label: "Tropical Escape", description: "Warm water, slower mornings and open skies.", imageSrc: journeyPassportImage("dream-journeys", "tropical-escape") },
  { value: "Mountain Retreat", label: "Mountain Retreat", description: "Fresh air, far-reaching views and room to breathe.", imageSrc: journeyPassportImage("dream-journeys", "mountain-retreat") },
  { value: "City Discovery", label: "City Discovery", description: "New neighbourhoods, culture and stories around every corner.", imageSrc: journeyPassportImage("dream-journeys", "city-discovery") },
  { value: "Cruise Voyage", label: "Cruise Voyage", description: "A graceful way to let the horizon lead.", imageSrc: journeyPassportImage("dream-journeys", "cruise-voyage") },
  { value: "Winter Wonderland", label: "Winter Wonderland", description: "Quiet landscapes and a beautiful change of pace.", imageSrc: journeyPassportImage("dream-journeys", "winter-wonderland") },
  { value: "Wildlife Adventure", label: "Wildlife Adventure", description: "Wild places that make the everyday feel far away.", imageSrc: journeyPassportImage("dream-journeys", "wildlife-adventure") },
];

export const travelStyleOptions: JourneyOption[] = [
  { value: "Relaxation", label: "Relaxation", imageSrc: journeyPassportImage("travel-styles", "relaxation") },
  { value: "Adventure", label: "Adventure", imageSrc: journeyPassportImage("travel-styles", "adventure") },
  { value: "Food & Dining", label: "Food & Dining", imageSrc: journeyPassportImage("travel-styles", "food-dining") },
  { value: "Culture & Heritage", label: "Culture & Heritage", imageSrc: journeyPassportImage("travel-styles", "culture-heritage") },
  { value: "Photography", label: "Photography", imageSrc: journeyPassportImage("travel-styles", "photography") },
  { value: "Nature", label: "Nature", imageSrc: journeyPassportImage("travel-styles", "nature") },
  { value: "Wildlife", label: "Wildlife", imageSrc: journeyPassportImage("travel-styles", "wildlife") },
  { value: "Beaches & Islands", label: "Beaches & Islands", imageSrc: journeyPassportImage("travel-styles", "beaches-islands") },
  { value: "Celebrations", label: "Celebrations", imageSrc: journeyPassportImage("travel-styles", "celebrations") },
];

export const timingOptions: JourneyOption[] = [
  { value: "Within the Next Month", label: "Within the Next Month", description: "A gentle change of scene, soon.", imageSrc: journeyPassportImage("timing", "within-next-month"), imageAlt: "Traveller calmly preparing a small bag for a near-term escape" },
  { value: "In the Next 2–3 Months", label: "In the Next 2–3 Months", description: "Enough time to shape something thoughtful.", imageSrc: journeyPassportImage("timing", "next-two-three-months"), imageAlt: "Traveller planning a considered journey with a map and notebook" },
  { value: "Later This Year", label: "Later This Year", description: "A journey to look forward to.", imageSrc: journeyPassportImage("timing", "later-this-year"), imageAlt: "Traveller looking toward a distant landscape and a journey later this year" },
  { value: "I’m Flexible", label: "I’m Flexible", description: "Open to the right moment and place.", imageSrc: journeyPassportImage("timing", "flexible-timing"), imageAlt: "Traveller pausing on an open route with several possible journeys ahead" },
  { value: "Exact Dates", label: "Exact Dates", description: "You already have a time in mind.", imageSrc: journeyPassportImage("timing", "exact-dates"), imageAlt: "Traveller confidently confirming a specific journey on a calendar and itinerary" },
];

export const destinationSuggestions = [
  "Bali", "Bhutan", "Dubai", "France", "Greece", "Iceland", "Italy", "Japan", "Maldives", "New Zealand", "Singapore", "South Africa", "Sri Lanka", "Switzerland", "Thailand", "Vietnam",
];

const hasValidName = (state: JourneyPassportState) => {
  const name = state.name.trim();
  return name.length >= 2 && name.length <= 80 && /\p{L}/u.test(name);
};

const localToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const hasValidDates = (state: JourneyPassportState) => state.timing !== "Exact Dates" || Boolean(state.startDate && state.endDate && state.startDate >= localToday() && state.endDate > state.startDate);
const hasValidDestination = (state: JourneyPassportState) => {
  const destination = state.destination.trim();
  return state.destinationMode === "discovery" || (state.destinationMode === "known" && destination.length >= 2 && destination.length <= 100 && /[\p{L}\p{N}]/u.test(destination));
};

export const journeyMoments: JourneyMoment[] = [
  { id: "welcome", number: 1, navigationLabel: "Welcome", title: "Welcome to Your Journey Passport", type: "welcome", nextLabel: "Begin My Journey", validate: () => true },
  { id: "about-you", number: 2, navigationLabel: "About You", title: "First, tell us about you.", description: "We’ll use your name to make every conversation feel personal.", type: "name", nextLabel: "Continue", validate: hasValidName },
  { id: "companions", number: 3, navigationLabel: "Companions", title: "Who will be sharing this journey with you?", description: "Every journey feels different depending on who is beside you.", type: "single-select", nextLabel: "Continue", options: companionOptions, validate: (state) => Boolean(state.companion) },
  { id: "dream-journey", number: 4, navigationLabel: "Dream Journey", title: "What kind of journey has been living in your heart lately?", description: "Choose the one that excites you most right now.", type: "single-select", nextLabel: "Continue", options: dreamJourneyOptions, validate: (state) => Boolean(state.dreamJourney) },
  { id: "pace-and-timing", number: 5, navigationLabel: "Pace & Timing", title: "How should this journey feel—and when might it begin?", description: "Choose up to three travel styles, then share the timing that feels right.", type: "pace-and-timing", nextLabel: "Continue", options: timingOptions, validate: (state) => state.travelStyles.length >= 1 && state.travelStyles.length <= 3 && Boolean(state.timing) && hasValidDates(state) },
  { id: "destination", number: 6, navigationLabel: "Destination", title: "Is there somewhere already calling you?", description: "Tell us what you have in mind, or invite us to help you discover somewhere special.", type: "destination", nextLabel: "Continue", validate: hasValidDestination },
  { id: "discover", number: 7, navigationLabel: "Review", title: "Wonderful. We have everything we need to begin crafting your journey.", description: "Review your Passport before we stamp it and begin discovering your possibilities.", type: "discover", nextLabel: "Stamp My Journey Passport", validate: (state) => journeyMoments.slice(1, -1).every((moment) => moment.validate(state)) },
];

export const journeyMomentIndex = (id: JourneyPassportState["currentMoment"]) => journeyMoments.findIndex((moment) => moment.id === id);

const requiredPassportMoments = journeyMoments.slice(1);

export const journeyProgressForMoment = (id: JourneyPassportState["currentMoment"]) => {
  if (id === "welcome") return 0;
  const completedMilestoneCount = requiredPassportMoments.findIndex((moment) => moment.id === id) + 1;
  return Math.round((completedMilestoneCount / requiredPassportMoments.length) * 96);
};
