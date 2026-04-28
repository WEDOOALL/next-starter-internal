import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reactives Next.js 15 — instrumentation.ts is enabled by default.
  reactStrictMode: true,

  // Tighter security defaults.
  poweredByHeader: false,

  // Allow images from supabase-internal Storage + Cloudflare-served origins.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase-internal.wedooall.com",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Useful when /api/health is called by Coolify health probe with stale cache.
  async headers() {
    return [
      {
        source: "/api/health",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
