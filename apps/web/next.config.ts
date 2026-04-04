import "@my-better-t-app/env/web";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ["@my-better-t-app/api", "@my-better-t-app/db", "@my-better-t-app/auth", "@my-better-t-app/env"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
