import { env } from "cloudflare:workers";

/**
 * R2 holds PDFs uploaded through /admin. Files that shipped with the site
 * (the migrated archive, the builder-tool handouts) are static assets under
 * public/ and never touch this bucket.
 */
export function getBucket(): R2Bucket {
  if (!env.BUCKET) {
    throw new Error(
      "Cloudflare R2 binding `BUCKET` is unavailable. Set the `r2` field in .openai/hosting.json to `BUCKET`, or upload the PDF to public/downloads/ and reference it by path instead."
    );
  }
  return env.BUCKET;
}

export function hasBucket(): boolean {
  return Boolean(env.BUCKET);
}

export function hasDatabase(): boolean {
  return Boolean(env.DB);
}
