"use client";

import { useEffect, useState } from "react";

const DESTINATION_TIMEZONE_MAP: Record<string, { timeZone: string; abbr: string }> = {
  // India (Domestic)
  india: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  agra: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  amritsar: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  andaman: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  assam: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  auli: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  bandipur: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  bengaluru: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  bangalore: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  chennai: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  chikmagalur: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  coorg: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  corbett: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  dalhousie: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  dehradun: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  delhi: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  dharamshala: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  gangtok: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  goa: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  gujarat: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  guwahati: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  "himachal pradesh": { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  hyderabad: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  jaipur: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kabini: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kanyakumari: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  karnataka: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kashmir: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kasol: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kerala: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kochi: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kodaikanal: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kolkata: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kotagiri: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  kumbhalgarh: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  ladakh: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  "leh ladakh": { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  lakshadweep: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  madurai: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  manali: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  mangaluru: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  masinagudi: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  meghalaya: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  mumbai: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  munnar: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  mussoorie: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  mysuru: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  northeast: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  odisha: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  ooty: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  pondicherry: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  pune: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  rajasthan: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  ranthambore: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  rishikesh: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  shimla: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  shirdi: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  sikkim: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  "tamil nadu": { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  thekkady: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  udaipur: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  uttarakhand: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  varanasi: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  varkala: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  vizag: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  wayanad: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },
  yercaud: { timeZone: "Asia/Kolkata", abbr: "IST +0:00" },

  // International
  "sri lanka": { timeZone: "Asia/Colombo", abbr: "IST +0:00" },
  colombo: { timeZone: "Asia/Colombo", abbr: "IST +0:00" },
  bali: { timeZone: "Asia/Makassar", abbr: "WITA +2:30" },
  indonesia: { timeZone: "Asia/Makassar", abbr: "WITA +2:30" },
  dubai: { timeZone: "Asia/Dubai", abbr: "GST -1:30" },
  uae: { timeZone: "Asia/Dubai", abbr: "GST -1:30" },
  "abu dhabi": { timeZone: "Asia/Dubai", abbr: "GST -1:30" },
  singapore: { timeZone: "Asia/Singapore", abbr: "SGT +2:30" },
  malaysia: { timeZone: "Asia/Kuala_Lumpur", abbr: "MYT +2:30" },
  "kuala lumpur": { timeZone: "Asia/Kuala_Lumpur", abbr: "MYT +2:30" },
  thailand: { timeZone: "Asia/Bangkok", abbr: "ICT +1:30" },
  bangkok: { timeZone: "Asia/Bangkok", abbr: "ICT +1:30" },
  phuket: { timeZone: "Asia/Bangkok", abbr: "ICT +1:30" },
  krabi: { timeZone: "Asia/Bangkok", abbr: "ICT +1:30" },
  vietnam: { timeZone: "Asia/Ho_Chi_Minh", abbr: "ICT +1:30" },
  hanoi: { timeZone: "Asia/Ho_Chi_Minh", abbr: "ICT +1:30" },
  maldives: { timeZone: "Indian/Maldives", abbr: "MVT -0:30" },
  bhutan: { timeZone: "Asia/Thimphu", abbr: "BTT +0:30" },
  nepal: { timeZone: "Asia/Kathmandu", abbr: "NPT +0:15" },
  pokhara: { timeZone: "Asia/Kathmandu", abbr: "NPT +0:15" },
  japan: { timeZone: "Asia/Tokyo", abbr: "JST +3:30" },
  tokyo: { timeZone: "Asia/Tokyo", abbr: "JST +3:30" },
  switzerland: { timeZone: "Europe/Zurich", abbr: "CET" },
  europe: { timeZone: "Europe/Zurich", abbr: "CET" },
  riyadh: { timeZone: "Asia/Riyadh", abbr: "AST -2:30" },
  "saudi arabia": { timeZone: "Asia/Riyadh", abbr: "AST -2:30" },
  cambodia: { timeZone: "Asia/Phnom_Penh", abbr: "ICT +1:30" },
  bangladesh: { timeZone: "Asia/Dhaka", abbr: "BST +0:30" },
};

function resolveTimezoneForDestination(destinationName?: string | null): { timeZone: string; abbr: string } | null {
  if (!destinationName || !destinationName.trim()) return null;
  const cleaned = destinationName.trim().toLowerCase();

  if (DESTINATION_TIMEZONE_MAP[cleaned]) {
    return DESTINATION_TIMEZONE_MAP[cleaned];
  }

  // Check tokens inside multi-destination strings (e.g., "Dharamshala, Manali" or "Phuket, Thailand")
  const tokens = cleaned
    .split(/[,/|&-]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  for (const token of tokens) {
    if (DESTINATION_TIMEZONE_MAP[token]) {
      return DESTINATION_TIMEZONE_MAP[token];
    }
  }

  // Substring match against known keys (longest key first for accuracy)
  const keys = Object.keys(DESTINATION_TIMEZONE_MAP).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (cleaned.includes(k)) {
      return DESTINATION_TIMEZONE_MAP[k];
    }
  }

  return null;
}

function formatDestinationNow(timeZone: string, abbr: string): string | null {
  try {
    const formatted = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
    // Normalize "Fri, 27 Nov, 10:11 pm" -> "Fri, 27 Nov • 10:11 PM (abbr)"
    const parts = formatted.split(",");
    if (parts.length >= 3) {
      const datePart = `${parts[0].trim()}, ${parts[1].trim()}`;
      const timePart = parts.slice(2).join(",").trim().toUpperCase();
      return `${datePart} • ${timePart} (${abbr})`;
    }
    return `${formatted} (${abbr})`;
  } catch {
    return null;
  }
}

export function useDestinationClock(destinationName?: string | null): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const resolved = resolveTimezoneForDestination(destinationName);
    if (!resolved) {
      setLabel(null);
      return;
    }

    const update = () => {
      setLabel(formatDestinationNow(resolved.timeZone, resolved.abbr));
    };

    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, [destinationName]);

  return label;
}
