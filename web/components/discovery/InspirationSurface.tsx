import type { ComponentPropsWithoutRef } from "react";

export default function InspirationSurface({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return <section className={`golden-inspiration-surface ${className}`} {...props}>{children}</section>;
}
