import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will allow the build to continue even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will allow the build to continue even with TypeScript errors
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
