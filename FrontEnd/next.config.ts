import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    devtoolSegmentExplorer: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jeokljjaxyrulkrzvfkr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
