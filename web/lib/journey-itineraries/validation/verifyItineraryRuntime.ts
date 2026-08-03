import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import manifest from "../../../generated/journey-itineraries/itinerary-manifest.json";
import {
  findBestItineraryForRecommendation,
  getAllItineraries,
  getItinerariesForDestination,
  getItineraryById,
} from "../index";
import type { ItineraryMatchInput } from "../types";

function expectMatch(expectedId: string, input: ItineraryMatchInput): void {
  const first = findBestItineraryForRecommendation(input);
  const second = findBestItineraryForRecommendation(input);
  assert.equal(first.itinerary?.id, expectedId, JSON.stringify({ expectedId, input, result: first }));
  assert.deepEqual(first, second, `Match must be deterministic for ${expectedId}`);
}

async function main(): Promise<void> {
  assert.equal(getAllItineraries().length, 49);
  assert.equal(new Set(getAllItineraries().map((item) => item.id)).size, 49);
  assert.equal(new Set(getAllItineraries().map((item) => item.destinationCode)).size, 49);
  assert.equal(getItineraryById("kerala-munnar")?.source.worksheet, "Kerala - Munnar");
  assert.deepEqual(getItinerariesForDestination("KL-MUN").map((item) => item.id), ["kerala-munnar"]);
  assert.equal(manifest.totalWorkbookSheets, 52);
  assert.equal(manifest.totalControlSheets, 3);
  assert.equal(manifest.totalItinerarySheets, 49);
  assert.equal(manifest.indexRows, 49);
  assert.equal(manifest.includedRecords, 49);
  assert.equal(manifest.errors, 0);

  expectMatch("kerala-munnar", { destinationId: "kerala", regionId: "india-kerala-munnar", destinationName: "Munnar" });
  expectMatch("kerala-munnar-alleppey-kochi", { destinationId: "kerala", destinationName: "Munnar, Alleppey and Kochi route", primaryDream: "backwaters" });
  expectMatch("kerala-wayanad", { destinationId: "kerala", regionId: "india-kerala-wayanad", destinationName: "Wayanad" });

  expectMatch("karnataka-kabini", { destinationId: "wildlife", destinationName: "Kabini" });
  expectMatch("karnataka-bandipur", { destinationId: "wildlife", destinationName: "Bandipur" });
  expectMatch("tamil-nadu-masinagudi", { destinationId: "wildlife", destinationName: "Masinagudi" });
  expectMatch("uttarakhand-corbett-national-park", { destinationId: "wildlife", destinationName: "Jim Corbett" });
  expectMatch("assam-wildlife-tour", { destinationId: "wildlife", destinationName: "Kaziranga" });
  expectMatch("assam-heritage-city-tour", { destinationId: "assam", destinationName: "Guwahati", primaryDream: "heritage and culture" });

  expectMatch("gujarat-gir-forest", { destinationId: "gujarat", destinationName: "Gir National Park", primaryDream: "wildlife" });
  expectMatch("gujarat-panch-dwarka", { destinationId: "gujarat", destinationName: "Panch Dwarka", primaryDream: "spiritual heritage" });
  expectMatch("gujarat-rann-of-kutch", { destinationId: "gujarat", destinationName: "Rann of Kutch", primaryDream: "white desert" });

  expectMatch("karnataka-hampi", { destinationId: "karnataka", regionId: "india-karnataka-hampi", destinationName: "Hampi" });
  expectMatch("karnataka-coorg", { destinationId: "karnataka", regionId: "india-karnataka-coorg", destinationName: "Coorg" });
  expectMatch("karnataka-bengaluru", { destinationId: "karnataka", destinationName: "Bengaluru" });

  expectMatch("rajasthan-jaipur-jodhpur-udaipur", { destinationId: "rajasthan", destinationName: "Jaipur, Jodhpur and Udaipur" });
  expectMatch("rajasthan-udaipur-kumbhalgarh-mount-abu", { destinationId: "rajasthan", destinationName: "Udaipur, Kumbhalgarh and Mount Abu" });
  expectMatch("rajasthan-jaipur-jodhpur-jaisalmer", { destinationId: "rajasthan", destinationName: "Jaipur, Jodhpur and Jaisalmer" });

  expectMatch("tamil-nadu-ooty", { destinationId: "tamil-nadu", destinationName: "Ooty" });
  expectMatch("tamil-nadu-kodaikanal", { destinationId: "tamil-nadu", destinationName: "Kodaikanal" });
  expectMatch("tamil-nadu-kotagiri", { destinationId: "tamil-nadu", destinationName: "Kotagiri" });
  expectMatch("northeast-sikkim", { destinationId: "northeast", destinationName: "Sikkim" });

  expectMatch("bali", { destinationId: "bali", destinationName: "Ubud" });
  expectMatch("malaysia-kuala-lumpur", { destinationId: "malaysia", regionId: "malaysia-kuala-lumpur", destinationName: "Kuala Lumpur" });
  expectMatch("malaysia-kuala-lumpur-langkawi", { destinationId: "malaysia", regionId: "malaysia-langkawi", destinationName: "Langkawi", primaryDream: "beach and island" });
  expectMatch("sri-lanka-ramayana-trail", { destinationId: "sri-lanka", destinationName: "Ramayana Trail" });
  expectMatch("sri-lanka-southern-circuit", { destinationId: "sri-lanka", destinationName: "Bentota and Galle", primaryDream: "southern beaches" });
  expectMatch("sri-lanka-north-east-circuit", { destinationId: "sri-lanka", destinationName: "Jaffna and Trincomalee" });
  expectMatch("thailand-phuket-krabi", { destinationId: "thailand", destinationName: "Phuket or Krabi", primaryDream: "beach and island" });
  expectMatch("thailand-bangkok-pattaya", { destinationId: "thailand", destinationName: "Bangkok or Pattaya", primaryDream: "city entertainment" });
  expectMatch("vietnam-phu-quoc", { destinationId: "vietnam", destinationName: "Phu Quoc" });
  expectMatch("vietnam-da-nang", { destinationId: "vietnam", destinationName: "Da Nang or Hoi An" });
  expectMatch("vietnam-hanoi", { destinationId: "vietnam", destinationName: "Hanoi and Ha Long Bay" });
  expectMatch("vietnam-ho-chi-minh-city", { destinationId: "vietnam", destinationName: "Ho Chi Minh City and Mekong Delta" });

  const direct = findBestItineraryForRecommendation({ destinationId: "KL-MUN" });
  assert.equal(direct.matchType, "destination-code");
  expectMatch("kerala-munnar", { destinationId: "munnar" });
  const noMatch = findBestItineraryForRecommendation({ destinationId: "not-served", destinationName: "Somewhere new" });
  assert.equal(noMatch.matchType, "none");
  assert.equal(noMatch.itinerary, undefined);

  for (const path of ["loader.ts", "matcher.ts", "aliases.ts", "index.ts"]) {
    const source = await readFile(resolve("lib/journey-itineraries", path), "utf8");
    assert.equal(/fast-xml-parser|fflate|\.xlsx|readWorkbook/i.test(source), false, `${path} must not parse Excel at runtime`);
  }

  console.log(JSON.stringify({ status: "PASS", catalogueRecords: 49, matchingScenarios: 36, noExcelRuntime: true }));
}

main().catch((error: unknown) => {
  console.error(JSON.stringify({ status: "FAILED", component: "ItineraryRuntimeVerification", message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }));
  process.exitCode = 1;
});
