/**
 * Free-Text Intent & Theme Enrichment Engine (Release 1.4 — P-05)
 *
 * Extracts structured themes and nuanced travel intent signals from
 * 'Describe your ideal getaway' downstream of deterministic scoring.
 *
 * Strict Guardrails:
 * 1. Downstream Only: Does not modify deterministic candidate eligibility gates.
 * 2. Zero Destination Hallucination: Unserved destinations mentioned in text are
 *    never activated or added to the catalogue.
 * 3. Advisor Fidelity: Translates traveller words into structured preferences
 *    for advisor handoff and possibility evidence refinement.
 */

export interface EnrichedThemeSignal {
  tag: string;
  category: "stay_preference" | "dietary" | "activity" | "atmosphere";
  matchedPhrase: string;
  confidence: number;
}

export interface EnrichedFreeTextIntent {
  rawText: string;
  hasEnrichment: boolean;
  signals: readonly EnrichedThemeSignal[];
  dietaryNotes: readonly string[];
  stayPreferences: readonly string[];
  advisorBrief: string;
}

interface PatternRule {
  tag: string;
  category: EnrichedThemeSignal["category"];
  pattern: RegExp;
  humanLabel: string;
}

const ENRICHMENT_RULES: readonly PatternRule[] = [
  // Stay Preferences
  {
    tag: "private-pool",
    category: "stay_preference",
    pattern: /\b(?:private\s+pools?|plunge\s+pools?|pool\s+villas?)\b/i,
    humanLabel: "Private Pool / Plunge Villa",
  },
  {
    tag: "heritage-bungalow",
    category: "stay_preference",
    pattern: /\b(?:heritage\s+bungalows?|colonial\s+stays?|plantation\s+bungalows?|havelis?|palace\s+stays?)\b/i,
    humanLabel: "Heritage Bungalow / Palace Stay",
  },
  {
    tag: "waterfront-villa",
    category: "stay_preference",
    pattern: /\b(?:beachfront|sea\s+facing|ocean\s+views?|water\s+villas?|riverfront|lakeside\s+cottages?)\b/i,
    humanLabel: "Waterfront / Ocean-Facing Stay",
  },
  {
    tag: "eco-treehouse",
    category: "stay_preference",
    pattern: /\b(?:treehouses?|eco\s+lodges?|glamping|safari\s+tents?|wooden\s+cottages?)\b/i,
    humanLabel: "Eco-Lodge / Treehouse",
  },

  // Dietary Preferences
  {
    tag: "pure-veg",
    category: "dietary",
    pattern: /\b(?:pure\s+veg|pure\s+vegetarian|strictly\s+veg|vegetarian\s+meals?)\b/i,
    humanLabel: "Pure Vegetarian Kitchen Preferred",
  },
  {
    tag: "jain-food",
    category: "dietary",
    pattern: /\b(?:jain\s+food|jain\s+meals?|no\s+onion\s+no\s+garlic)\b/i,
    humanLabel: "Jain Food / No Onion No Garlic",
  },

  // Activities & Pace
  {
    tag: "wildlife-safari",
    category: "activity",
    pattern: /\b(?:tiger\s+safaris?|game\s+drives?|birding|jungle\s+safaris?|elephant\s+sanctuar(?:y|ies))\b/i,
    humanLabel: "Dedicated Wildlife Safaris",
  },
  {
    tag: "tea-estate-walks",
    category: "activity",
    pattern: /\b(?:(?:tea|coffee|spice)\s+(?:plantations?|estates?|gardens?|tastings?|trails?)|plantation\s+walks?)\b/i,
    humanLabel: "Plantation & Estate Walking Trails",
  },
  {
    tag: "ayurveda-spa",
    category: "activity",
    pattern: /\b(?:ayurveda|panchakarma|holistic\s+wellness|spa\s+treatments?|yoga\s+retreats?)\b/i,
    humanLabel: "Ayurvedic & Holistic Wellness",
  },
  {
    tag: "heritage-temple-walks",
    category: "activity",
    pattern: /\b(?:heritage\s+walks?|temple\s+architecture|artisan\s+studios?|monaster(?:y|ies)|craft\s+villages?)\b/i,
    humanLabel: "Living Heritage & Artisan Walks",
  },

  // Atmosphere
  {
    tag: "unhurried-quiet",
    category: "atmosphere",
    pattern: /\b(?:quiet|unhurried|peaceful|slow\s+travel|secluded|tranquil|no\s+rush)\b/i,
    humanLabel: "Quiet & Unhurried Atmosphere",
  },
  {
    tag: "romantic-private",
    category: "atmosphere",
    pattern: /\b(?:candlelight|private\s+dinner|honeymoon|anniversary|romantic\s+setting)\b/i,
    humanLabel: "Intimate & Romantic Setting",
  },
];

export function enrichFreeTextIntent(rawDescription?: string): EnrichedFreeTextIntent {
  if (!rawDescription || rawDescription.trim().length === 0) {
    return {
      rawText: "",
      hasEnrichment: false,
      signals: [],
      dietaryNotes: [],
      stayPreferences: [],
      advisorBrief: "",
    };
  }

  const text = rawDescription.trim();
  const matchedSignals: EnrichedThemeSignal[] = [];

  for (const rule of ENRICHMENT_RULES) {
    const match = text.match(rule.pattern);
    if (match) {
      matchedSignals.push({
        tag: rule.tag,
        category: rule.category,
        matchedPhrase: match[0],
        confidence: 0.95,
      });
    }
  }

  const dietaryNotes = matchedSignals
    .filter((signal) => signal.category === "dietary")
    .map((signal) => signal.matchedPhrase);

  const stayPreferences = matchedSignals
    .filter((signal) => signal.category === "stay_preference")
    .map((signal) => signal.matchedPhrase);

  let advisorBrief = "";
  if (matchedSignals.length > 0) {
    const labels = matchedSignals.map((s) => {
      const rule = ENRICHMENT_RULES.find((r) => r.tag === s.tag);
      return rule ? rule.humanLabel : s.tag;
    });
    advisorBrief = `Traveller expressed clear intent for: ${labels.join(", ")}.`;
  }

  return {
    rawText: text,
    hasEnrichment: matchedSignals.length > 0,
    signals: matchedSignals,
    dietaryNotes,
    stayPreferences,
    advisorBrief,
  };
}
