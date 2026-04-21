import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Instrumentation hook (observability)
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
