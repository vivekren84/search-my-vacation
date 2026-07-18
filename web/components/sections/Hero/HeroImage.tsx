/**
 * HeroImage
 *
 * Purpose:
 * Renders the full-screen Golden Hour background
 * for the homepage Hero.
 */

import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="/images/hero/golden-hour1.png"
        alt="Golden hour overlooking a beautiful destination"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
}