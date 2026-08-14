import Image from "next/image";
import { siteContact } from "@/config/contact.config";

/**
 * Homepage Trust Strip (Release 1.1 — R1.1 Homepage Trust Strip EBC).
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
 */

const numberClassName = "text-xl font-extrabold tracking-[-0.01em] text-[#2A211C] sm:text-2xl";
const labelClassName = "text-[0.78rem] font-semibold text-[#2A211C] sm:text-sm";
const subLabelClassName = "text-[0.68rem] text-[#2A211C]/55";
const medallionClassName = "size-12 shrink-0 drop-shadow-[0_4px_7px_rgba(83,49,18,.22)] sm:size-14";

const staticItems = [
  {
    key: "destinations",
    image: "/images/trust-strip/destinations-medallion.png",
    value: "45+",
    label: "Destinations Served",
    subLabel: "Domestic & International",
  },
  {
    key: "trips",
    image: "/images/trust-strip/trips-medallion.png",
    value: "300+",
    label: "Trips Completed",
    subLabel: null,
  },
  {
    key: "travellers",
    image: "/images/trust-strip/travellers-medallion.png",
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
        <div className="mx-auto flex max-w-[62rem] flex-col divide-y divide-[#e4d2b5] rounded-[1.5rem] border border-[#e4d2b5] bg-white shadow-[0_8px_24px_rgba(91,55,18,.05)] sm:flex-row sm:divide-x sm:divide-y-0">
          <a
            href={siteContact.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See Search My Vacation's 4.9 out of 5 rating from 27 Google Reviews — opens in a new tab"
            className="group flex flex-1 flex-col items-center gap-2 px-6 py-6 text-center transition hover:bg-[#faf3e6] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2A211C] sm:py-7"
          >
            <span className={medallionClassName} aria-hidden="true">
              <Image
                src="/images/trust-strip/google-medallion.png"
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

          {staticItems.map(({ key, image, value, label, subLabel }) => (
            <div
              key={key}
              className="flex flex-1 flex-col items-center gap-2 px-6 py-6 text-center sm:py-7"
            >
              <span className={medallionClassName} aria-hidden="true">
                <Image
                  src={image}
                  alt=""
                  width={56}
                  height={56}
                  className="size-full object-contain"
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
