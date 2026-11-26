import type { NextConfig } from "next";

// For GitHub Pages the site lives under /<repo>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/ALI_Portfolio. Leave it empty for a custom domain or Vercel.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // fully static site (out/), deployable to any static host
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  transpilePackages: ["three"],
};

export default nextConfig;
