import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { curatedDestinationImageForJourney } from "./curatedDestinationImage";

/**
 * Traveller Stories — journey data loader
 *
 * Reads the canonical traveller-story metadata under
 * `web/public/traveller-stories/<traveller>/metadata.json` and produces one
 * card-ready entry per approved journey.
 *
 * This is the single source of truth for the `/traveller-stories` listing.
 * Do not hardcode journeys or duplicate this dataset elsewhere.
 *
 * A traveller record is included only when `status === "approved"`. Pending
 * traveller records are excluded because their `permissions.story` flag is
 * `false` — the traveller has not consented to their story being published.
 *
 * Hero image resolution, per journey, in priority order (EBC: Traveller
 * Stories Experience Completion & UX Polish):
 * 1. Journey-specific traveller photo — that journey's own `heroImage`
 *    override (use this when one traveller has multiple journeys that
 *    should show different photos).
 * 2. Journey-specific destination photo — the first `media.destinationPhotos`
 *    entry tagged with that journey's ID.
 * 3. Traveller photo — the traveller-wide `media.travellerPhoto`.
 * 4. SMV curated destination image — an approved, publicly-used destination
 *    image keyed by destination (see `curatedDestinationImage.ts`), used
 *    only when neither the traveller nor the journey has its own photo.
 * 5. No image — the card falls back to the monogram treatment.
 */

const TRAVELLER_STORIES_DIR = path.join(process.cwd(), "public", "traveller-stories");

interface DestinationPhoto {
  file: string;
  journeyId: string;
  caption?: string;
}

interface TravellerMetadata {
  travellerId: string;
  displayName: string;
  fullName: string;
  status: "approved" | "pending" | string;
  journeys: Array<{
    journeyId: string;
    title: string;
    destination: string;
    travelMonth: string;
    travelYear: number;
    duration: string;
    experienceType: string;
    travellerType: string;
    featured: boolean;
    /**
     * Optional explicit hero image for this specific journey, as a filename
     * relative to the traveller's directory (e.g. "family-01.jpg").
     *
     * Use this when a traveller has multiple journeys and a single
     * traveller-wide `media.travellerPhoto` would otherwise be shown as the
     * hero for all of them. When present, it takes priority over
     * `media.destinationPhotos` and `media.travellerPhoto` for this journey
     * only. Gated by `permissions.travellerPhoto`, same as
     * `media.travellerPhoto`.
     */
    heroImage?: string;
  }>;
  media: {
    travellerPhoto: {
      file: string | null;
      available: boolean;
      approvedForWebsite: boolean;
    };
    destinationPhotos: DestinationPhoto[];
  };
  permissions: {
    story: boolean;
    travellerPhoto: boolean;
    destinationPhotos: boolean;
  };
}

export interface TravellerJourneyCard {
  slug: string;
  journeyId: string;
  travellerId: string;
  travellerDir: string;
  title: string;
  travellerName: string;
  destination: string;
  duration: string;
  travellerType: string;
  experienceType: string;
  travelMonth: string;
  travelYear: number;
  featured: boolean;
  heroImage: { src: string; alt: string; width: number | null; height: number | null } | null;
  /**
   * True when `heroImage` came from tier 4 (SMV curated destination image)
   * rather than a real photo submitted by or of the traveller. The detail
   * page and gallery use this to avoid presenting a stock/curated image as
   * if it were an authentic traveller photo.
   */
  heroImageIsCurated: boolean;
  /**
   * Additional approved destination photos for this journey, beyond the one
   * used as the hero image. Used by the journey detail page to render a
   * supporting gallery. Empty when only one (or zero) approved photo exists
   * for this journey, or when `permissions.destinationPhotos` is false.
   */
  galleryImages: { src: string; alt: string }[];
}

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * Maps a travel month name (e.g. "December") to 0-11 for sorting. Unknown or
 * malformed month strings sort last (-1) rather than throwing, so a data
 * error in one journey's travelMonth can't break the whole listing.
 */
function monthIndex(monthName: string): number {
  return MONTH_NAMES.indexOf((monthName ?? "").trim().toLowerCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the real pixel dimensions of an image file on disk. Used so the
 * detail-page hero (Traveller Stories Final Hero Quality & Turbopack Source
 * Repair EBC) can choose a presentation appropriate to the actual source —
 * a wide frame with `object-cover` for genuinely landscape photos, and a
 * contained, non-upscaled treatment for portrait or low-resolution ones —
 * instead of forcing every photo into the same full-bleed 21:9 crop
 * regardless of what it actually is. Returns `null` on any read/parsing
 * failure so a corrupt or unreadable file degrades to the safe default
 * (contained, not stretched) rather than breaking the page.
 */
async function getImageDimensions(absolutePath: string): Promise<{ width: number; height: number } | null> {
  try {
    const { width, height } = await sharp(absolutePath).metadata();
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

async function resolveHeroImage(
  travellerDir: string,
  journeyId: string,
  title: string,
  destination: string,
  travellerName: string,
  metadata: TravellerMetadata,
  journeyHeroImage: string | undefined,
): Promise<{ src: string; alt: string; isCurated: boolean; width: number | null; height: number | null } | null> {
  const { media, permissions } = metadata;

  // Tier 1 — Journey-specific traveller photo: an explicit per-journey hero
  // override always wins. This is what lets a traveller with multiple
  // journeys show a different hero photo for each one, instead of every
  // journey falling back to the same traveller-wide photo or to whichever
  // destination photo happens to be listed first.
  if (journeyHeroImage && permissions.travellerPhoto) {
    const absolutePath = path.join(TRAVELLER_STORIES_DIR, travellerDir, journeyHeroImage);

    if (await fileExists(absolutePath)) {
      const dimensions = await getImageDimensions(absolutePath);
      return {
        src: `/traveller-stories/${travellerDir}/${journeyHeroImage}`,
        alt: `${travellerName} on the ${title} journey`,
        isCurated: false,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
      };
    }
  }

  // Tier 2 — Journey-specific destination photo.
  if (permissions.destinationPhotos) {
    const destinationPhoto = media.destinationPhotos.find(
      (photo) => photo.journeyId === journeyId,
    );

    if (destinationPhoto) {
      const absolutePath = path.join(TRAVELLER_STORIES_DIR, travellerDir, destinationPhoto.file);

      if (await fileExists(absolutePath)) {
        const dimensions = await getImageDimensions(absolutePath);
        return {
          src: `/traveller-stories/${travellerDir}/${destinationPhoto.file}`,
          alt: destinationPhoto.caption || `${title} — ${destination}`,
          isCurated: false,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
        };
      }
    }
  }

  // Tier 3 — Traveller photo (traveller-wide, not journey-specific).
  const travellerPhoto = media.travellerPhoto;

  if (
    permissions.travellerPhoto &&
    travellerPhoto.file &&
    travellerPhoto.available &&
    travellerPhoto.approvedForWebsite
  ) {
    const absolutePath = path.join(TRAVELLER_STORIES_DIR, travellerDir, travellerPhoto.file);

    if (await fileExists(absolutePath)) {
      const dimensions = await getImageDimensions(absolutePath);
      return {
        src: `/traveller-stories/${travellerDir}/${travellerPhoto.file}`,
        alt: `${travellerName} on the ${title} journey`,
        isCurated: false,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
      };
    }
  }

  // Tier 4 — SMV curated destination image. Only used when neither the
  // journey nor the traveller has a real photo of their own.
  const curated = curatedDestinationImageForJourney(journeyId, travellerName);
  if (curated) {
    const absolutePath = path.join(process.cwd(), "public", curated.src);
    const dimensions = await getImageDimensions(absolutePath);
    return { ...curated, isCurated: true, width: dimensions?.width ?? null, height: dimensions?.height ?? null };
  }

  // Tier 5 — monogram (handled by the caller when heroImage is null).
  return null;
}

/**
 * Builds the detail-page gallery for a journey: the traveller/family photo
 * first (when the hero is an authentic photo, not a curated destination
 * image), then that journey's own destination photos in their listed order.
 * Gated by `permissions.destinationPhotos` and existence-checked the same
 * way as `resolveHeroImage`. Strictly scoped to this one journey's
 * `journeyId` — a traveller with multiple journeys never has another
 * journey's photos leak into this gallery.
 */
async function resolveGalleryImages(
  travellerDir: string,
  journeyId: string,
  title: string,
  destination: string,
  metadata: TravellerMetadata,
  hero: { src: string; alt: string; isCurated: boolean } | null,
): Promise<{ src: string; alt: string }[]> {
  const { media, permissions } = metadata;

  const gallery: { src: string; alt: string }[] = [];
  const seen = new Set<string>();

  // The hero photo leads the gallery, but only when it's a genuine
  // traveller/trip photo (tiers 1–3) — a curated/generic destination image
  // (tier 4) is never presented as if it were an authentic gallery photo.
  if (hero && !hero.isCurated) {
    gallery.push({ src: hero.src, alt: hero.alt });
    seen.add(hero.src);
  }

  if (!permissions.destinationPhotos) return gallery;

  const matches = media.destinationPhotos.filter((photo) => photo.journeyId === journeyId);

  for (const photo of matches) {
    const src = `/traveller-stories/${travellerDir}/${photo.file}`;
    if (seen.has(src)) continue;

    const absolutePath = path.join(TRAVELLER_STORIES_DIR, travellerDir, photo.file);
    if (await fileExists(absolutePath)) {
      gallery.push({ src, alt: photo.caption || `${title} — ${destination}` });
      seen.add(src);
    }
  }

  return gallery;
}

/**
 * Loads every approved traveller journey as a listing-ready card, sorted:
 * 1. Travel year, descending (newest first)
 * 2. Travel month, descending
 * 3. Traveller name, ascending (A–Z)
 */
export async function getApprovedTravellerJourneys(): Promise<TravellerJourneyCard[]> {
  let travellerDirs: string[] = [];

  try {
    const entries = await readdir(TRAVELLER_STORIES_DIR, { withFileTypes: true });
    travellerDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }

  const cards: TravellerJourneyCard[] = [];
  const usedSlugs = new Set<string>();

  for (const travellerDir of travellerDirs) {
    const metadataPath = path.join(TRAVELLER_STORIES_DIR, travellerDir, "metadata.json");

    let metadata: TravellerMetadata;

    try {
      const raw = await readFile(metadataPath, "utf8");
      metadata = JSON.parse(raw) as TravellerMetadata;
    } catch {
      // Malformed or missing metadata for this traveller must not break the
      // page for everyone else — skip this traveller only.
      continue;
    }

    if (metadata.status !== "approved") continue;
    if (!metadata.permissions?.story) continue;

    for (const journey of metadata.journeys ?? []) {
      const heroImage = await resolveHeroImage(
        travellerDir,
        journey.journeyId,
        journey.title,
        journey.destination,
        metadata.displayName,
        metadata,
        journey.heroImage,
      );

      let slug = slugify(journey.title);
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${slugify(journey.journeyId)}`;
      }
      usedSlugs.add(slug);

      const galleryImages = await resolveGalleryImages(
        travellerDir,
        journey.journeyId,
        journey.title,
        journey.destination,
        metadata,
        heroImage,
      );

      cards.push({
        slug,
        journeyId: journey.journeyId,
        travellerId: metadata.travellerId,
        travellerDir,
        title: journey.title,
        travellerName: metadata.displayName,
        destination: journey.destination,
        duration: journey.duration,
        travellerType: journey.travellerType,
        experienceType: journey.experienceType,
        travelMonth: journey.travelMonth,
        travelYear: journey.travelYear,
        featured: Boolean(journey.featured),
        heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt, width: heroImage.width, height: heroImage.height } : null,
        heroImageIsCurated: heroImage?.isCurated ?? false,
        galleryImages,
      });
    }
  }

  return cards.sort((a, b) => {
    if (a.travelYear !== b.travelYear) return b.travelYear - a.travelYear;
    const monthDiff = monthIndex(b.travelMonth) - monthIndex(a.travelMonth);
    if (monthDiff !== 0) return monthDiff;
    return a.travellerName.localeCompare(b.travellerName);
  });
}

export async function getTravellerJourneyBySlug(
  slug: string,
): Promise<TravellerJourneyCard | undefined> {
  const journeys = await getApprovedTravellerJourneys();
  return journeys.find((journey) => journey.slug === slug);
}
