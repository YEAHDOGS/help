import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

// To enable Sentry source-map upload on Vercel, wrap the config:
//
//   import { withSentryConfig } from "@sentry/nextjs";
//   export default withSentryConfig(nextConfig, { silent: true });
//
// and set SENTRY_AUTH_TOKEN / SENTRY_ORG / SENTRY_PROJECT in your env.
