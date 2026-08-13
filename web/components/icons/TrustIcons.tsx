import type { SVGProps } from "react";

/**
 * Icon set for the Homepage Trust Strip (Release 1.1 — R1.1 Homepage Trust
 * Strip EBC, visual refinement pass).
 *
 * Hand-authored, dependency-free inline SVGs — same convention already
 * established by `components/icons/SocialIcons.tsx` ("The project has no
 * icon library dependency anywhere"). `GoogleGIcon` reproduces Google's
 * standard four-colour "G" mark (the same widely-reproduced path set used
 * in Google's own "Sign in with Google" / review-badge assets) so the
 * Google Reviews item is unambiguously identifiable as Google, matching
 * `SocialIcons.tsx`'s existing precedent of hand-drawing recognisable
 * third-party platform marks (Instagram/Facebook/YouTube) to identify a
 * genuine external profile — this is not an SMV brand asset and is not
 * covered by the SMV brand guardrails. The remaining icons are simple
 * monochrome line marks using `currentColor`, consistent with the site's
 * restrained icon style.
 */

export function GoogleGIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.57-5.17 3.57-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.32v3.09C3.29 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.33c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.68H1.32C.48 8.35 0 10.13 0 12.05s.48 3.7 1.32 5.37l3.99-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.29 2.7 1.32 6.68l3.99 3.09c.94-2.83 3.58-4.93 6.69-5.02z"
      />
    </svg>
  );
}

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
    </svg>
  );
}

export function RouteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 1 0 5 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.4 3-5.4 5.5-5.4s4.9 2 5.5 5.4" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.2 13.9c2 .2 3.6 1.9 4.1 4.4" />
    </svg>
  );
}
