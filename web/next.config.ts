import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.82"],
  async redirects() {
    return [
      // Temporary public retirement of Experiences (DEC-R1.2-009 / DEC-R1.2-012, EBC R1.2-010).
      // Guests are redirected to the Homepage; the /experiences page, its route and its
      // implementation are intentionally NOT deleted and remain reachable in the codebase
      // for a future redesign. `permanent: false` (307) is deliberate: this is a temporary
      // retirement, not a permanent URL removal, so it must not be cached as a 308/301 by
      // browsers or search engines.
      { source: "/experiences", destination: "/", permanent: false },
      { source: "/experiences/:path*", destination: "/", permanent: false },
      { source: "/logos/:path*", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
      { source: "/brand/logos/:path*", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
      { source: "/brand/icons/:path*", destination: "/brand/official/logo/icon-mark-transparent-2000px.png", permanent: true },
      { source: "/brand/master/smv-logo-horizontal-master.svg", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
      { source: "/brand/social/:path*", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
      { source: "/brand/exports/:path*", destination: "/brand/official/logo/icon-mark-transparent-2000px.png", permanent: true },
      { source: "/brand/preview/:path*", destination: "/brand/official/logo/icon-mark-transparent-2000px.png", permanent: true },
      { source: "/brand/favicon/favicon.svg", destination: "/brand/official/favicon/favicon.ico", permanent: true },
      { source: "/brand/favicon/favicon-16x16.png", destination: "/brand/official/favicon/favicon-16.png", permanent: true },
      { source: "/brand/favicon/favicon-32x32.png", destination: "/brand/official/favicon/favicon-32.png", permanent: true },
      { source: "/brand/favicon/apple-touch-icon.png", destination: "/brand/official/favicon/apple-touch-icon-180.png", permanent: true },
      { source: "/brand/favicon/app-icon-192.png", destination: "/brand/official/favicon/favicon-192.png", permanent: true },
      { source: "/brand/favicon/app-icon-512.png", destination: "/brand/official/app/app-icon-rounded-512.png", permanent: true },
    ];
  },
};

export default nextConfig;
