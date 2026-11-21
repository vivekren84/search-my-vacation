/**
 * Family & Multi-Generational Comfort Signals Configuration (Release 1.4 — PO-03)
 *
 * Governs structured comfort and dietary signals across destinations and
 * discovery cards, helping families and multi-generational travellers identify
 * senior-friendly pacing, toddler comfort, pure vegetarian/Jain readiness,
 * and visa ease without clunky filtering.
 */

export type ComfortSignalId =
  | "senior-friendly-pace"
  | "kid-friendly"
  | "pure-veg-jain-available"
  | "first-international-easy"
  | "visa-easy";

export interface ComfortSignalDefinition {
  id: ComfortSignalId;
  label: string;
  shortTag: string;
  icon: string;
  description: string;
}

export const COMFORT_SIGNAL_DEFINITIONS: Readonly<Record<ComfortSignalId, ComfortSignalDefinition>> = {
  "senior-friendly-pace": {
    id: "senior-friendly-pace",
    label: "Senior-Friendly Pace",
    shortTag: "Senior Friendly",
    icon: "🕊️",
    description: "Unhurried daily rhythm, elevator-equipped heritage stays, and minimal steep terrain.",
  },
  "kid-friendly": {
    id: "kid-friendly",
    label: "Toddler & Kid Easy",
    shortTag: "Kid Easy",
    icon: "🎈",
    description: "Spacious family suites, gentle transfer durations, and child-safe experiential activities.",
  },
  "pure-veg-jain-available": {
    id: "pure-veg-jain-available",
    label: "Pure Veg & Jain Ready",
    shortTag: "Pure Veg / Jain",
    icon: "🌿",
    description: "Verified pure vegetarian kitchens or dedicated Jain culinary preparations available on request.",
  },
  "first-international-easy": {
    id: "first-international-easy",
    label: "First International Trip Easy",
    shortTag: "First Overseas Trip",
    icon: "✈️",
    description: "Short direct flight connections, English-friendly navigation, and welcoming arrival infrastructure.",
  },
  "visa-easy": {
    id: "visa-easy",
    label: "Visa on Arrival / Hassle-Free",
    shortTag: "Visa Easy",
    icon: "🛂",
    description: "Visa-free entry, instant eVisa, or effortless Visa on Arrival for Indian passport holders.",
  },
};

export const ALL_COMFORT_SIGNALS: readonly ComfortSignalDefinition[] = [
  COMFORT_SIGNAL_DEFINITIONS["senior-friendly-pace"],
  COMFORT_SIGNAL_DEFINITIONS["kid-friendly"],
  COMFORT_SIGNAL_DEFINITIONS["pure-veg-jain-available"],
  COMFORT_SIGNAL_DEFINITIONS["first-international-easy"],
  COMFORT_SIGNAL_DEFINITIONS["visa-easy"],
];

export const DESTINATION_COMFORT_SIGNALS: Readonly<Record<string, readonly ComfortSignalId[]>> = {
  // India Core
  agra: ["senior-friendly-pace", "pure-veg-jain-available"],
  amritsar: ["senior-friendly-pace", "pure-veg-jain-available"],
  andaman: ["kid-friendly"],
  assam: ["kid-friendly"],
  goa: ["kid-friendly"],
  gujarat: ["senior-friendly-pace", "pure-veg-jain-available"],
  "himachal-pradesh": ["senior-friendly-pace", "pure-veg-jain-available"],
  hyderabad: ["senior-friendly-pace"],
  karnataka: ["senior-friendly-pace", "pure-veg-jain-available"],
  kashmir: ["senior-friendly-pace"],
  kerala: ["senior-friendly-pace", "kid-friendly"],
  northeast: [],
  pondicherry: ["senior-friendly-pace"],
  rajasthan: ["senior-friendly-pace", "pure-veg-jain-available"],
  "tamil-nadu": ["senior-friendly-pace", "pure-veg-jain-available"],
  vizag: ["senior-friendly-pace"],

  // International
  bali: ["kid-friendly", "first-international-easy", "visa-easy"],
  dubai: ["senior-friendly-pace", "kid-friendly", "pure-veg-jain-available", "first-international-easy", "visa-easy"],
  malaysia: ["kid-friendly", "first-international-easy", "visa-easy"],
  singapore: ["senior-friendly-pace", "kid-friendly", "pure-veg-jain-available", "first-international-easy", "visa-easy"],
  "sri-lanka": ["senior-friendly-pace", "first-international-easy", "visa-easy"],
  thailand: ["kid-friendly", "first-international-easy", "visa-easy"],
  vietnam: ["first-international-easy", "visa-easy"],

  // Wildlife & Nature
  bandipur: ["kid-friendly"],
  corbett: ["kid-friendly", "pure-veg-jain-available"],
  kabini: ["kid-friendly", "senior-friendly-pace"],
  masinagudi: ["kid-friendly"],
  wildlife: ["kid-friendly"],
};

export function getComfortSignalsForDestination(destinationId?: string): readonly ComfortSignalDefinition[] {
  if (!destinationId) return [];
  const signalIds = DESTINATION_COMFORT_SIGNALS[destinationId.toLowerCase()] ?? [];
  return signalIds.map((id) => COMFORT_SIGNAL_DEFINITIONS[id]).filter(Boolean);
}

export function getComfortSignalById(id: ComfortSignalId): ComfortSignalDefinition | undefined {
  return COMFORT_SIGNAL_DEFINITIONS[id];
}

export function destinationMatchesComfortSignal(destinationId: string, signalId: ComfortSignalId): boolean {
  const signals = DESTINATION_COMFORT_SIGNALS[destinationId.toLowerCase()] ?? [];
  return signals.includes(signalId);
}
