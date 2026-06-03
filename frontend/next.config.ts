import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    // unoptimized allows <img> tags to work with local /public paths
    unoptimized: true,
  },
  reactStrictMode: true,
  // Use webpack for production builds (Turbopack has issues with @tailwindcss/postcss)
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
