import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fareshare",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
