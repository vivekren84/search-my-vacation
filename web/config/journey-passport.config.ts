import type { JourneyBudgetOption, JourneyChapter, JourneyOption, JourneyPassportState } from "@/types/journey-passport.types";

const image = (name: string) => `/images/journey-experience/${name}`;

export const companionOptions: JourneyOption[] = [
  { value: "Couple", label: "Couple", description: "Moments meant only for two.", imageSrc: image("couple-golden-hour.png") },
  { value: "Family", label: "Family", description: "Memories that stay for a lifetime.", imageSrc: image("family-golden-hour.png") },
  { value: "Friends", label: "Friends", description: "Stories you’ll talk about forever.", imageSrc: image("friends-golden-hour.png") },
  { value: "Solo", label: "Solo", description: "Just you, and the world slowing down.", imageSrc: image("solo-golden-hour.png") },
  { value: "Business", label: "Business", description: "A considered pause between meaningful work.", imageSrc: image("elevated.png") },
];

export const dreamJourneyOptions: JourneyOption[] = [
  { value: "Tropical Escape", label: "Tropical Escape", description: "Warm water, slower mornings and open skies.", imageSrc: image("bali-preview.png") },
  { value: "Mountain Retreat", label: "Mountain Retreat", description: "Fresh air, far-reaching views and room to breathe.", imageSrc: image("switzerland-preview.png") },
  { value: "City Discovery", label: "City Discovery", description: "New neighbourhoods, culture and stories around every corner.", imageSrc: image("exploring.png") },
  { value: "Cruise Voyage", label: "Cruise Voyage", description: "A graceful way to let the horizon lead.", imageSrc: image("luxury.png") },
  { value: "Winter Wonderland", label: "Winter Wonderland", description: "Quiet peaks and a beautiful change of pace.", imageSrc: image("later.png") },
  { value: "Wildlife Adventure", label: "Wildlife Adventure", description: "Wild places that make the everyday feel far away.", imageSrc: image("now.png") },
];

export const travelStyleOptions: JourneyOption[] = [
  { value: "Relaxation", label: "Relaxation" },
  { value: "Adventure", label: "Adventure" },
  { value: "Food and Dining", label: "Food and Dining" },
  { value: "Culture and Heritage", label: "Culture and Heritage" },
  { value: "Photography", label: "Photography" },
  { value: "Nature", label: "Nature" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Beaches and Islands", label: "Beaches and Islands" },
  { value: "Celebrations", label: "Celebrations" },
];

export const timingOptions: JourneyOption[] = [
  { value: "Next Month", label: "Next Month", description: "A gentle change of scene, soon." },
  { value: "Summer Holidays", label: "Summer Holidays", description: "A season set aside for time together." },
  { value: "Winter", label: "Winter", description: "A different kind of light and landscape." },
  { value: "Flexible", label: "Flexible", description: "Open to the right moment and the right place." },
  { value: "Specific Dates", label: "Specific Dates", description: "You already have a time in mind." },
];

export const comfortOptions: JourneyOption[] = [
  { value: "Comfortable", label: "Comfortable", description: "Thoughtful, relaxed and well-crafted." },
  { value: "Premium", label: "Premium", description: "A few more beautiful details along the way." },
  { value: "Luxury", label: "Luxury", description: "Private, considered and unforgettable." },
  { value: "Ultra Luxury", label: "Ultra Luxury", description: "Exceptional experiences shaped around you." },
];

export const budgetOptions: JourneyBudgetOption[] = [
  { value: "Under ₹1 lakh", label: "Under ₹1 lakh" },
  { value: "₹1–2 lakhs", label: "₹1–2 lakhs" },
  { value: "₹2–4 lakhs", label: "₹2–4 lakhs" },
  { value: "₹4–7 lakhs", label: "₹4–7 lakhs" },
  { value: "₹7 lakhs+", label: "₹7 lakhs+" },
  { value: "I'd like guidance", label: "I’d like guidance" },
];

const hasDates = (state: JourneyPassportState) => state.timing !== "Specific Dates" || Boolean(state.startDate && state.endDate);

export const journeyChapters: JourneyChapter[] = [
  { id: "welcome", number: 1, navigationLabel: "Welcome", title: "Welcome to Your Journey Passport", type: "welcome", required: false, nextLabel: "Begin My Journey", validate: () => true },
  { id: "about-you", number: 2, navigationLabel: "About You", title: "First, tell us about you.", description: "This helps us personalise your Journey Passport and every recommendation that follows.", type: "name", required: true, nextLabel: "Continue", validate: (state) => state.name.trim().length >= 2 },
  { id: "companions", number: 3, navigationLabel: "Companions", title: "Who will be sharing this journey with you?", type: "single-select", required: true, nextLabel: "Continue", options: companionOptions, validate: (state) => Boolean(state.companion) },
  { id: "dream-journey", number: 4, navigationLabel: "Dream Journey", title: "What kind of journey has been living in your heart lately?", description: "Choose the one that excites you most right now.", type: "single-select", required: true, nextLabel: "Continue", options: dreamJourneyOptions, validate: (state) => Boolean(state.dreamJourney) },
  { id: "travel-style", number: 5, navigationLabel: "Travel Style", title: "What kind of memories would you love to bring back?", description: "Select everything that feels like you.", type: "multi-select", required: true, nextLabel: "Continue", options: travelStyleOptions, validate: (state) => state.travelStyles.length > 0 },
  { id: "timing", number: 6, navigationLabel: "Timing", title: "When are you hoping to travel?", type: "timing", required: true, nextLabel: "Continue", options: timingOptions, validate: (state) => Boolean(state.timing) && hasDates(state) },
  { id: "comfort", number: 7, navigationLabel: "Comfort", title: "Tell us about your comfort and preferences.", description: "This helps us shape an experience that feels right for you.", type: "comfort", required: true, nextLabel: "Continue", validate: (state) => Boolean(state.comfort && state.budget) },
  { id: "profile", number: 8, navigationLabel: "Profile", title: "Here’s what we understand about your journey so far.", type: "summary", required: false, nextLabel: "Continue to contact details", validate: () => true },
  { id: "contact", number: 9, navigationLabel: "Let’s Connect", title: "We’ve got a wonderful starting point.", type: "contact", required: true, nextLabel: "Stamp My Journey Passport", validate: (state) => Boolean(state.contact.name.trim() && state.contact.phone.trim() && state.contact.email.trim() && state.contact.city.trim()) },
  { id: "journey-begins", number: 10, navigationLabel: "Journey Begins", title: "Your Journey Begins Here.", type: "complete", required: false, nextLabel: "", validate: () => true },
];

export const passportStampConfig = {
  city: "CHENNAI · INDIA",
  brand: "SEARCH MY VACATION",
  title: "JOURNEY PASSPORT",
  message: "JOURNEY BEGINS",
};
