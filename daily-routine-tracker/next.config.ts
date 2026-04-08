import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import pkg from "./package.json";

function resolveCommitSha(): string {
  if (process.env.APP_COMMIT_SHA) return process.env.APP_COMMIT_SHA;
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_APP_COMMIT: resolveCommitSha(),
  },
};

export default nextConfig;
