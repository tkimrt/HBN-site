import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle. Azure Static Web Apps' hybrid Next.js
  // hosting requires it to stay under its 250 MB app cap; Vercel ignores it
  // and uses its own build output. Local `next start` is unaffected.
  output: "standalone",
  // PGlite locates its WASM relative to import.meta.url; bundling it into the
  // route graphs breaks that resolution. Left external, it loads from
  // node_modules at runtime (dev/test only — production uses DATABASE_URL).
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
