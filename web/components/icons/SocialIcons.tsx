import type { SVGProps } from "react";

/**
 * Minimal, monochrome, dependency-free social platform marks.
 *
 * The project has no icon library dependency anywhere (checked
 * `package.json` and every component — the Header's mobile menu "hamburger"
 * is even drawn as a plain CSS bar rather than an icon font/SVG package).
 * Per the "Footer Social Icons Finalisation" EBC ("Do not introduce a new
 * icon dependency solely for this task") and the project's architecture
 * principle to minimise dependencies, these are hand-authored inline SVGs
 * rather than a new npm package. All three use `currentColor` so they pick
 * up the same hover/focus treatment as the surrounding Footer links.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#2A211C" />
    </svg>
  );
}
