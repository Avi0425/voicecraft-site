import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/voicecraft-site",
  images: { unoptimized: true },
};

export default nextConfig;
