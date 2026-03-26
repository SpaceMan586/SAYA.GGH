import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    devtoolSegmentExplorer: false,
    optimizePackageImports: ["flowbite-react", "react-icons", "framer-motion"],
  },
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
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
