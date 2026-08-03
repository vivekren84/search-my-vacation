/**
 * Container
 *
 * Purpose:
 * Provides a consistent maximum width and horizontal spacing
 * across all pages and sections of the Search My Vacation website.
 */

import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  variant?: "standard" | "wide" | "reading";
};

export default function Container({
  children,
  className = "",
  variant = "standard",
}: ContainerProps) {
  const variantClass = variant === "standard" ? "" : `layout-container--${variant}`;

  return (
    <div className={["layout-container", variantClass, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
