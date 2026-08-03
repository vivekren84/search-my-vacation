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

const fullDimensions = { width: 1440, height: 500 };
const compactDimensions = { width: 980, height: 230 };

export default function SiteBrand({
  variant = "full",
  surface = "light",
  linked = true,
  preload = false,
  className = "",
}: SiteBrandProps) {
  const isHeader = variant === "header";
  const useCompact = variant === "compact";
  const fullSource =
    surface === "dark"
      ? siteBrand.assets.lightLockup
      : siteBrand.assets.primaryLockup;

  const imageAlt = linked ? "" : siteBrand.accessibleLabel;
  const content = isHeader ? (
    <>
      <Image
        src={siteBrand.assets.compactLockup}
        alt={imageAlt}
        {...compactDimensions}
        preload={preload}
        sizes="(max-width: 1279px) 224px, 0px"
        className="h-auto w-full xl:hidden"
      />
      <Image
        src={fullSource}
        alt={imageAlt}
        {...fullDimensions}
        preload={preload}
        sizes="(min-width: 1280px) 336px, 0px"
        className="hidden h-auto w-full xl:block"
      />
    </>
  ) : (
    <Image
      src={useCompact ? siteBrand.assets.compactLockup : fullSource}
      alt={imageAlt}
      {...(useCompact ? compactDimensions : fullDimensions)}
      preload={preload}
      sizes={useCompact ? "224px" : "336px"}
      className="h-auto w-full"
    />
  );

  const sharedClassName = `block ${className}`.trim();

  if (!linked) {
    return <span className={sharedClassName}>{content}</span>;
  }

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
