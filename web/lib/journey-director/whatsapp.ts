import { siteContact } from "../../config/contact.config.js";

/**
 * WhatsApp Continuation Deep-Link Module (P-03)
 *
 * Implements dual-path WhatsApp continuation:
 * 1. General Handoff: Immediate connection with a Journey Designer regarding the verified Journey Passport.
 * 2. Possibility-Specific Handoff: Destination-focused continuation based on an active or selected recommendation.
 *
 * All links open directly in WhatsApp with human, unpressured micro-copy and official SMV- reference tagging.
 */

export interface GeneralWhatsAppParams {
  travellerName: string;
  journeyReference: string;
  travellingParty: string;
  travelTiming: string;
  journeyIntent?: string;
}

export interface PossibilityWhatsAppParams {
  travellerFirstName: string;
  journeyReference: string;
  travellingParty: string;
  travelTiming: string;
  selectedDestination: string;
  selectedRegion: string;
  personalityLabel: string;
  journeyIntent: string;
  knownDestination?: string;
  preferredPace?: string;
  preferredComfort?: string;
  whyThisFits?: string;
}

export function createGeneralWhatsAppMessage({
  travellerName,
  journeyReference,
  travellingParty,
  travelTiming,
  journeyIntent,
}: GeneralWhatsAppParams): string {
  const lines = [
    "Hello Search My Vacation,",
    "",
    `I’m ${travellerName.trim()}, and I’ve completed my Journey Passport on your website.`,
    `Journey Reference: ${journeyReference}`,
    `Travelling: ${travellingParty} · ${travelTiming}`,
    ...(journeyIntent ? [`Journey Vision: ${journeyIntent}`] : []),
    "",
    "I’d love to connect with my Journey Designer to discuss curated possibilities.",
  ];

  return lines.join("\n");
}

export function createPossibilityWhatsAppMessage({
  travellerFirstName,
  journeyReference,
  travellingParty,
  travelTiming,
  selectedDestination,
  selectedRegion,
  personalityLabel,
  journeyIntent,
  knownDestination,
  preferredPace,
  preferredComfort,
  whyThisFits,
}: PossibilityWhatsAppParams): string {
  const lines = [
    "Hello Search My Vacation,",
    "",
    `I’m ${travellerFirstName.trim()}, and I’m ready to continue planning my journey.`,
    `Journey Reference: ${journeyReference}`,
    `Travelling: ${travellingParty} · ${travelTiming}`,
    ...(knownDestination ? [`Starting point shared: ${knownDestination}`] : []),
    `Selected journey: ${selectedDestination}, ${selectedRegion}`,
    `Recommendation: ${personalityLabel}`,
    `What matters to me: ${journeyIntent}`,
    ...(preferredPace && preferredPace !== "to-be-discussed" ? [`Preferred pace: ${preferredPace}`] : []),
    ...(preferredComfort && preferredComfort !== "to-be-discussed" ? [`Preferred comfort: ${preferredComfort}`] : []),
    ...(whyThisFits ? [`Why this fits: ${whyThisFits}`] : []),
    "",
    "Please help me continue the conversation with my Journey Designer.",
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string, customBaseHref?: string): string {
  const base = customBaseHref || siteContact.whatsappHref;
  const cleanBase = base.endsWith("?") ? base.slice(0, -1) : base;
  const separator = cleanBase.includes("?") ? "&" : "?";
  return `${cleanBase}${separator}text=${encodeURIComponent(message)}`;
}
