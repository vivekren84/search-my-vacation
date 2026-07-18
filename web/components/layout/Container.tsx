/**
 * Container
 *
 * Purpose:
 * Provides a consistent maximum width and horizontal spacing
 * across all pages and sections of the Search My Vacation website.
 */

import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({
  children,
}: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
      {children}
    </div>
  );
}