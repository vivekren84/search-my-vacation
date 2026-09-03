import Image from "next/image";
import { siteContact } from "@/config/contact.config";

/**
 * Homepage Trust Strip (Release 1.1 — R1.1 Homepage Trust Strip EBC;
 * visual treatment refreshed under EBC R1.2-003 — Premium Trust Strip
 * Visual Refresh).
 *
 * A single, premium credibility strip that sits directly beneath the
 * Traveller Stories "Explore All Traveller Stories" CTA and bridges into the
 * next homepage section. It intentionally reads as one connected strip (a
 * shared card, divided into four columns with thin dividers) rather than
 * separate promotional CTA cards — visual benchmark supplied by the project
 * owner during the review pass on this EBC.
 *
 * Content order is fixed by the EBC and must not change:
 *   1. Google Reviews — the only interactive item; opens SMV's canonical
 *      Google Reviews profile in a new tab.
 *   2. 45+ Destinations Served — informational only, never a link.
 *   3. 300+ Trips Completed — informational only, never a link.
 *   4. 800+ Happy Travellers — informational only, never a link.
 *
 * The Google Reviews URL is sourced from the single canonical
 * `siteContact.googleReviewsUrl` config entry (same source already used by
 * `components/traveller-stories/GoogleReviewsCTA.tsx`) — never hardcode it
 * here. The external-link treatment (target/rel/aria-label describing the
 * destination and "opens in a new tab") mirrors that same component and
 * `components/contact/SocialLinks.tsx`, which are this project's
 * established safe external-link pattern.
 *
 * The 4.9/5, 27, 45+, 300+ and 800+ values are approved fixed content for
 * this EBC and are not sourced from live data. Only the "Domestic &
 * International" and "(27 reviews)" sub-labels were explicitly approved by
 * the project owner — the other two items intentionally have no sub-label.
 *
 * R1.2-003 image swap: the four flat medallion icons are replaced with
 * premium photographic cut-outs (antique brass globe, leather passport with
 * boarding passes, a travelling family) sharing one warm colour grade and a
 * single soft champagne drop-shadow token (`iconShadowClassName`), so all
 * four read as one consistent, premium set rather than four unrelated
 * icons. The Google mark is untouched (official branding, not a photo) but
 * now shares that same shadow token for visual consistency. Because the new
 * assets are real photographic cut-outs rather than square medallions, each
 * item defines its own aspect-correct size in `iconSize` instead of sharing
 * one fixed square class — sized for balanced optical weight against each
 * other rather than identical pixel dimensions (the EBC's explicit
 * direction). Layout, spacing, container dimensions, typography, the
 * statistics themselves, the Google Reviews link behaviour and responsive
 * structure are all unchanged from the R1.1 implementation above — this
 * pass only touches image sources, per-image sizing, the shared shadow
 * token, and the divider colour (softened, see `divide-[#e4d2b5]/45` below).
 */

const numberClassName = "text-xl font-extrabold tracking-[-0.01em] text-[#2A211C] sm:text-2xl";
const labelClassName = "text-[0.78rem] font-semibold text-[#2A211C] sm:text-sm";
const subLabelClassName = "text-[0.68rem] text-[#2A211C]/55";

// Shared premium shadow for every trust-strip icon (Google mark + the three
// photographic cut-outs): a soft, warm champagne shadow rather than the
// tighter, darker shadow the flat medallions used, so all four icons read
// as belonging to the same premium set.
const iconShadowClassName = "drop-shadow-[0_8px_20px_rgba(191,149,79,.15)]";

const googleIconClassName = `h-12 w-12 shrink-0 ${iconShadowClassName} sm:h-14 sm:w-14`;

const staticItems = [
  {
    key: "destinations",
    image: "/images/trust-strip/globe-cutout.webp",
    imageWidth: 233,
    imageHeight: 324,
    // Globe: a rounded, portrait-oriented object — sized a touch taller
    // than the Google mark so its full silhouette (crown, sphere, stand)
    // reads clearly rather than shrinking to an indistinct dot.
    iconClassName: `h-14 w-auto shrink-0 ${iconShadowClassName} sm:h-16`,
    value: "45+",
    label: "Destinations Served",
    subLabel: "Domestic & International",
  },
  {
    key: "trips",
    image: "/images/trust-strip/passport-cutout.webp",
    imageWidth: 231,
    imageHeight: 328,
    // Passport: the tallest-aspect object of the four — given the same
    // height as the globe so the pair reads as a matched pair in scale.
    iconClassName: `h-14 w-auto shrink-0 ${iconShadowClassName} sm:h-16`,
    value: "300+",
    label: "Trips Completed",
    subLabel: null,
  },
  {
    key: "travellers",
    image: "/images/trust-strip/family-cutout.webp",
    imageWidth: 301,
    imageHeight: 330,
    // Family: the widest and most detailed cut-out (three figures), given
    // the most visual weight of the four — deliberately larger, not
    // identical, per the approved sizing direction for this refresh.
    iconClassName: `h-16 w-auto shrink-0 ${iconShadowClassName} sm:h-[4.5rem]`,
    value: "800+",
    label: "Happy Travellers",
    subLabel: null,
  },
] as const;

export default function TrustStrip() {
  return (
    <section
      aria-label="Search My Vacation traveller trust indicators"
      className="bg-[#FFFDFC] py-8 sm:py-12"
    >
      <div className="layout-container">
        <div className="mx-auto flex max-w-[62rem] flex-col divide-y divide-[#e4d2b5]/45 rounded-[1.5rem] border border-[#e4d2b5] bg-white shadow-[0_8px_24px_rgba(91,55,18,.05)] sm:flex-row sm:divide-x sm:divide-y-0">
          <a
            href={siteContact.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See Search My Vacation's 4.9 out of 5 rating from 27 Google Reviews — opens in a new tab"
            className="group flex flex-1 flex-col items-center gap-2 px-6 py-6 text-center transition hover:bg-[#faf3e6] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2A211C] sm:py-7"
          >
            <span className={googleIconClassName} aria-hidden="true">
              <Image
                src="/images/trust-strip/google-medallion.webp"
                alt=""
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </span>
            <div className="flex flex-col items-center gap-0.5">
              <span aria-hidden="true" className="text-xs tracking-[0.15em] text-[#986328]">
                ★★★★★
              </span>
              <p className={numberClassName}>4.9/5</p>
              <p
                className={`${labelClassName} inline-flex items-center gap-1 underline decoration-transparent underline-offset-4 transition group-hover:text-[#986328] group-hover:decoration-[#986328]`}
              >
                Google Reviews
                <span aria-hidden="true">↗</span>
              </p>
              <p className={subLabelClassName}>(27 reviews)</p>
            </div>
          </a>

          {staticItems.map(({ key, image, imageWidth, imageHeight, iconClassName, value, label, subLabel }) => (
            <div
              key={key}
              className="flex flex-1 flex-col items-center gap-2 px-6 py-6 text-center sm:py-7"
            >
              <span className={iconClassName} aria-hidden="true">
                <Image
                  src={image}
                  alt=""
                  width={imageWidth}
                  height={imageHeight}
                  className="h-full w-auto object-contain"
                />
              </span>
              <div className="flex flex-col items-center gap-0.5">
                <p className={numberClassName}>{value}</p>
                <p className={labelClassName}>{label}</p>
                {subLabel ? <p className={subLabelClassName}>{subLabel}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
