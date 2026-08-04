import Image from "next/image";
import Link from "next/link";

import { siteBrand } from "@/config/brand.config";

type SiteBrandProps = {
  variant?: "header" | "footer" | "compact" | "full";
  surface?: "dark" | "light";
  linked?: boolean;
  preload?: boolean;
  className?: string;
};

const imageDetails = {
  header: { width: 1384, height: 310 },
  full: { width: 3232, height: 518 },
  compact: { width: 2215, height: 380 },
  footer: { width: 3232, height: 518 },
} as const;

export default function SiteBrand({
  variant = "full",
  surface = "light",
  linked = true,
  preload = false,
  className = "",
}: SiteBrandProps) {
  const source = variant === "footer"
    ? siteBrand.assets.fullDarkSurface
    : variant === "header"
      ? surface === "dark" ? siteBrand.assets.headerDarkSurface : siteBrand.assets.headerLightSurface
      : variant === "compact"
        ? surface === "dark" ? siteBrand.assets.compactDarkSurface : siteBrand.assets.compactLightSurface
        : surface === "dark" ? siteBrand.assets.fullDarkSurface : siteBrand.assets.fullLightSurface;
  const dimensions = imageDetails[variant];
  const imageAlt = linked ? "" : siteBrand.accessibleLabel;
  const content = (
    <Image
      src={source}
      alt={imageAlt}
      {...dimensions}
      preload={preload}
      sizes={variant === "footer" ? "240px" : variant === "header" ? "(max-width: 1279px) 224px, 336px" : "224px"}
      className="h-auto w-full"
    />
  );
  const sharedClassName = `block ${className}`.trim();

  if (variant === "footer") {
    const footerLogo = linked ? (
      <Link
        href="/"
        aria-label={`${siteBrand.name} home`}
        className="block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        {content}
      </Link>
    ) : content;

    return (
      <span className={sharedClassName}>
        {footerLogo}
        <span className="mt-3 block font-serif text-base leading-6 tracking-[0.01em] text-white/85">{siteBrand.tagline}</span>
      </span>
    );
  }

  if (!linked) return <span className={sharedClassName}>{content}</span>;

  return (
    <Link
      href="/"
      aria-label={`${siteBrand.name} home`}
      className={`${sharedClassName} rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`}
    >
      {content}
    </Link>
  );
}
