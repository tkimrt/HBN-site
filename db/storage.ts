import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Uploaded files (article PDFs, cover images) go to Supabase Storage in
 * production and to .data/uploads/ during local development. Files that
 * shipped with the site (the migrated archive, the builder-tool handouts) are
 * static assets under public/ and never touch this storage.
 */

const LOCAL_DIR = path.join(process.cwd(), ".data", "uploads");

function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Local-file mode is explicit (next dev, or LOCAL_DATA=1) — see db/index.ts. */
function localMode(): boolean {
  if (supabaseConfigured()) return false;
  return process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}

export function hasStorage(): boolean {
  return supabaseConfigured() || localMode();
}

export { hasDatabase } from "./index";

/** Stores a file and returns the public URL to reference it by. */
export async function storeFile(
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> {
  if (supabaseConfigured()) {
    const { createClient } = await import("@supabase/supabase-js");
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "files";
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const store = supabase.storage.from(bucket);
    let result = await store.upload(key, data, { contentType, upsert: true });
    if (result.error && /not found/i.test(result.error.message)) {
      // First upload ever: create the public bucket, then retry once.
      await supabase.storage.createBucket(bucket, { public: true });
      result = await store.upload(key, data, { contentType, upsert: true });
    }
    if (result.error) throw new Error(result.error.message);
    return store.getPublicUrl(key).data.publicUrl;
  }
  if (localMode()) {
    const target = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(data));
    return `/files/${key}`;
  }
  throw new Error(
    "File storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the host's environment variables."
  );
}

/** Reads a locally stored file; null when absent. Supabase files are served by
 *  their absolute URL and never come through here. */
export async function readLocalFile(key: string): Promise<Buffer | null> {
  const target = path.join(LOCAL_DIR, key);
  if (!target.startsWith(LOCAL_DIR + path.sep)) return null;
  try {
    return await readFile(target);
  } catch {
    return null;
  }
}
