import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Uploaded files (article PDFs, cover images) go to Vercel Blob in production
 * and to .data/uploads/ during local development. Files that shipped with the
 * site (the migrated archive, the builder-tool handouts) are static assets
 * under public/ and never touch this storage.
 */

const LOCAL_DIR = path.join(process.cwd(), ".data", "uploads");

function blobToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN ?? "";
}

/** Local-file mode is explicit (next dev, or LOCAL_DATA=1) — see db/index.ts. */
function localMode(): boolean {
  if (blobToken()) return false;
  return process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}

export function hasStorage(): boolean {
  return Boolean(blobToken()) || localMode();
}

export { hasDatabase } from "./index";

/** Stores a file and returns the public URL to reference it by. */
export async function storeFile(
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> {
  if (blobToken()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  }
  if (localMode()) {
    const target = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(data));
    return `/files/${key}`;
  }
  throw new Error(
    "File storage is not configured. Set BLOB_READ_WRITE_TOKEN in the host's environment variables."
  );
}

/** Reads a locally stored file; null when absent. Blob files are served by
 *  their absolute URL and never come through here. */
export async function readLocalFile(key: string): Promise<Buffer | null> {
  const target = path.join(LOCAL_DIR, key);
  // Keep reads inside the uploads dir even if a crafted path gets through.
  if (!target.startsWith(LOCAL_DIR + path.sep)) return null;
  try {
    return await readFile(target);
  } catch {
    return null;
  }
}
