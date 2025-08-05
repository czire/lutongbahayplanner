import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable strict ESLint rules for deployment
  },
};

export default nextConfig;
