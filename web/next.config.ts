import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.82"],
  async redirects() {
    return [
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
