import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import { publicDestinationGroups } from "../../../config/public-destinations.config";
import {
  getAllItineraries,
  getDefaultItineraryForDestination,
  getItinerariesForDestination,
  publicItineraryLabel,
  resolveDestinationItinerarySelection,
} from "../index";

function ids(destinationId: string, destinationName?: string): string[] {
  return getItinerariesForDestination({ destinationId, destinationName }).map((itinerary) => itinerary.id);
}

function expectCount(destinationId: string, count: number, destinationName?: string): void {
  const first = getItinerariesForDestination({ destinationId, destinationName });
  const second = getItinerariesForDestination({ destinationId, destinationName });
  assert.equal(first.length, count, `${destinationName ?? destinationId} should resolve ${count} itineraries`);
  assert.deepEqual(first.map((item) => item.id), second.map((item) => item.id), `${destinationId} order must be deterministic`);
  assert.equal(new Set(first.map((item) => item.id)).size, first.length, `${destinationId} must not contain duplicates`);
  assert.equal(first.every((item) => item.source.status !== "archived"), true);
}

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat().filter((path) => /\.(?:ts|tsx)$/.test(path));
}

async function main(): Promise<void> {
  const broadCounts: Record<string, number> = {
    kerala: 3,
    assam: 2,
    gujarat: 3,
    "himachal-pradesh": 2,
    karnataka: 5,
    northeast: 2,
    rajasthan: 3,
    "tamil-nadu": 6,
    malaysia: 2,
    "sri-lanka": 3,
    thailand: 2,
    vietnam: 4,
    wildlife: 6,
  };
  Object.entries(broadCounts).forEach(([destinationId, count]) => expectCount(destinationId, count));

  expectCount("goa", 1, "Goa");
  expectCount("bali", 1, "Bali");
  expectCount("dubai", 1, "Dubai");
  expectCount("kashmir", 1, "Kashmir");
  expectCount("hyderabad", 1, "Hyderabad");
  assert.deepEqual(ids("kabini", "Kabini"), ["karnataka-kabini"]);
  assert.deepEqual(ids("bandipur", "Bandipur"), ["karnataka-bandipur"]);
  assert.deepEqual(ids("ooty", "Ooty"), ["tamil-nadu-ooty"]);
  assert.deepEqual(ids("phuket", "Phuket"), ["thailand-phuket-krabi"]);
  assert.deepEqual(ids("langkawi", "Langkawi"), ["malaysia-kuala-lumpur-langkawi"]);

  assert.deepEqual(ids("kerala", "Kerala"), ["kerala-munnar", "kerala-munnar-alleppey-kochi", "kerala-wayanad"]);
  assert.deepEqual(ids("karnataka", "Karnataka"), ["karnataka-bengaluru", "karnataka-bandipur", "karnataka-coorg", "karnataka-hampi", "karnataka-kabini"]);
  assert.deepEqual(ids("rajasthan", "Rajasthan"), ["rajasthan-jaipur-jodhpur-udaipur", "rajasthan-udaipur-kumbhalgarh-mount-abu", "rajasthan-jaipur-jodhpur-jaisalmer"]);

  const defaults: Record<string, string> = {
    kerala: "kerala-munnar-alleppey-kochi",
    assam: "assam-heritage-city-tour",
    gujarat: "gujarat-rann-of-kutch",
    karnataka: "karnataka-coorg",
    rajasthan: "rajasthan-jaipur-jodhpur-udaipur",
    "tamil-nadu": "tamil-nadu-temple-tour",
    malaysia: "malaysia-kuala-lumpur",
    "sri-lanka": "sri-lanka-southern-circuit",
    thailand: "thailand-bangkok-pattaya",
    vietnam: "vietnam-hanoi",
  };
  Object.entries(defaults).forEach(([destinationId, expected]) => assert.equal(getDefaultItineraryForDestination(destinationId)?.id, expected));

  const kerala = getItinerariesForDestination("kerala");
  const opened = resolveDestinationItinerarySelection({ previous: undefined, destinationId: "kerala", lookup: { destinationId: "kerala" }, itineraries: kerala });
  assert.equal(opened.itineraryId, "kerala-munnar-alleppey-kochi");
  const switched = resolveDestinationItinerarySelection({ previous: opened, destinationId: "kerala", requestedItineraryId: "kerala-wayanad", lookup: { destinationId: "kerala" }, itineraries: kerala });
  assert.equal(switched.itineraryId, "kerala-wayanad");
  assert.deepEqual(resolveDestinationItinerarySelection({ previous: switched, destinationId: "kerala", lookup: { destinationId: "kerala" }, itineraries: kerala }), switched);
  const tamilNadu = getItinerariesForDestination("tamil-nadu");
  const reset = resolveDestinationItinerarySelection({ previous: switched, destinationId: "tamil-nadu", lookup: { destinationId: "tamil-nadu" }, itineraries: tamilNadu });
  assert.equal(reset.itineraryId, "tamil-nadu-temple-tour");
  assert.notEqual(reset.itineraryId, switched.itineraryId);
  assert.deepEqual(getItinerariesForDestination({ destinationId: "not-served", destinationName: "Somewhere new" }), []);

  const multiParentNames = new Set(Object.entries(Object.groupBy(getAllItineraries(), (item) => item.destination.parentDestination ?? item.destination.displayName)).filter(([, records]) => (records?.length ?? 0) > 1).map(([parent]) => parent));
  const publicBroadTitles = new Set(publicDestinationGroups.flatMap((group) => group.cards).filter((card) => broadCounts[card.destinationId] && card.destinationId !== "wildlife").map((card) => card.title));
  const parentToCard: Record<string, string> = { "Northeast India": "Northeast", "Tamil Nadu": "Tamil Nadu", "Himachal Pradesh": "Himachal Pradesh" };
  multiParentNames.forEach((parent) => assert.equal(publicBroadTitles.has(parentToCard[parent] ?? parent), true, `${parent} needs a broad public card`));

  const publicLabels = getAllItineraries().map(publicItineraryLabel);
  assert.equal(publicLabels.some((label) => /\b(?:JJU|UKM|JJJ)\b|TamilNadu\s*-/i.test(label)), false);
  assert.deepEqual(getItinerariesForDestination("rajasthan").map(publicItineraryLabel), ["Jaipur, Jodhpur & Udaipur", "Udaipur, Kumbhalgarh & Mount Abu", "Jaipur, Jodhpur & Jaisalmer"]);
  assert.deepEqual(getItinerariesForDestination("tamil-nadu").map(publicItineraryLabel), ["Chennai City", "Kodaikanal", "Kotagiri", "Masinagudi", "Ooty", "Temple Tour"]);

  const destinationsSource = await readFile(resolve("components/destinations/DestinationsExperience.tsx"), "utf8");
  const destinationModalSource = await readFile(resolve("components/destinations/DestinationItineraryModal.tsx"), "utf8");
  const destinationModalStyles = await readFile(resolve("components/destinations/DestinationItineraryModal.module.css"), "utf8");
  const destinationDetailSource = await readFile(resolve("components/destinations/DestinationItinerarySection.tsx"), "utf8");
  const editorialCardsSource = await readFile(resolve("components/discovery/EditorialCards.tsx"), "utf8");
  const journeyDirectorSource = await readFile(resolve("components/journey-director/JourneyDirectorExperience.tsx"), "utf8");
  const sharedRendererSource = await readFile(resolve("components/journey-director/SuggestedItinerarySection.tsx"), "utf8");
  const loaderSource = await readFile(resolve("lib/journey-itineraries/loader.ts"), "utf8");
  assert.match(destinationsSource, /DestinationItineraryModal/);
  assert.match(destinationsSource, /triggerElement/);
  assert.match(destinationsSource, /detailId="destination-itinerary-modal"/);
  assert.doesNotMatch(destinationsSource, /destination-itinerary-detail-|groupContainsSelection|scroll-mt-24/);
  assert.doesNotMatch(destinationsSource, /generated\/journey-itineraries/);
  assert.match(editorialCardsSource, /aria-haspopup="dialog"/);
  assert.match(editorialCardsSource, /event\.currentTarget/);
  assert.match(destinationModalSource, /lazy\(\(\) => import\("\.\/DestinationItinerarySection"\)\)/);
  assert.match(destinationModalSource, /<dialog/);
  assert.match(destinationModalSource, /role="dialog"/);
  assert.match(destinationModalSource, /aria-modal="true"/);
  assert.match(destinationModalSource, /aria-labelledby=\{headingId\}/);
  assert.match(destinationModalSource, /dialog\.showModal\(\)/);
  assert.match(destinationModalSource, /onCancel=/);
  assert.match(destinationModalSource, /window\.addEventListener\("keydown", closeOnEscape\)/);
  assert.match(destinationModalSource, /window\.removeEventListener\("keydown", closeOnEscape\)/);
  assert.match(destinationModalSource, /event\.target === event\.currentTarget/);
  assert.match(destinationModalSource, /body\.style\.overflow = "hidden"/);
  assert.match(destinationModalSource, /root\.style\.overflow = "hidden"/);
  assert.match(destinationModalSource, /window\.requestAnimationFrame\(\(\) => \{/);
  assert.match(destinationModalSource, /window\.scrollTo\(0, scrollPosition\)/);
  assert.match(destinationModalSource, /triggerElement\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(destinationModalSource, /Preparing this journey…/);
  assert.match(destinationModalSource, /<Suspense fallback=/);
  assert.match(destinationModalSource, /onItineraryChange=\{returnToItineraryStart\}/);
  assert.doesNotMatch(destinationModalSource, /generated\/journey-itineraries/);
  assert.match(destinationModalStyles, /width: min\(1000px, calc\(100vw - 48px\)\)/);
  assert.match(destinationModalStyles, /max-height: calc\(100svh - 48px\)/);
  assert.match(destinationModalStyles, /height: calc\(100svh - 8px\)/);
  assert.match(destinationModalStyles, /overflow-y: auto/);
  assert.match(destinationDetailSource, /aria-pressed/);
  assert.match(destinationDetailSource, /<select/);
  assert.match(destinationDetailSource, /aria-live="polite"/);
  assert.match(destinationDetailSource, /onItineraryChange\?\.\(\)/);
  assert.match(destinationDetailSource, /key=\{selected\.id\}/);
  assert.match(destinationDetailSource, /routeTitle=\{publicItineraryLabel\(selected\)\}/);
  assert.match(destinationDetailSource, /A personalised day-by-day journey will be shaped around this destination/);
  assert.doesNotMatch(journeyDirectorSource, /DestinationItineraryModal|DestinationItinerarySection|Explore journeys in|publicItineraryLabel/);
  assert.match(sharedRendererSource, /mode="journey-director"/);
  assert.doesNotMatch(loaderSource, /fast-xml-parser|fflate|\.xlsx|readWorkbook/i);

  const passportFiles = await sourceFiles(resolve("components/journey-passport"));
  for (const path of passportFiles) {
    const source = await readFile(path, "utf8");
    assert.doesNotMatch(source, /DestinationItineraryModal|DestinationItinerarySection|Explore journeys in|SuggestedItineraryContent/);
  }

  console.log(JSON.stringify({ status: "PASS", publicCards: publicDestinationGroups.flatMap((group) => group.cards).length, broadDestinations: Object.keys(broadCounts).length, catalogueRecords: getAllItineraries().length, modal: { nativeDialog: true, scrollLock: true, focusRestoration: true, bottomPageDetail: false }, isolation: { journeyDirectorSingle: true, journeyPassportSelector: false }, lazyLoaded: true }));
}

main().catch((error: unknown) => {
  console.error(JSON.stringify({ status: "FAILED", component: "DestinationItineraryVerification", message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }));
  process.exitCode = 1;
});
