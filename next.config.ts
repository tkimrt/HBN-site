import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle. Azure Static Web Apps' hybrid Next.js
  // hosting requires it to stay under its 250 MB app cap; Vercel ignores it
  // and uses its own build output. Local `next start` is unaffected.
  output: "standalone",
};

export default nextConfig;
