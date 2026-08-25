/**
 * Narrow declarations for the Cloudflare runtime surface this site touches.
 *
 * The starter ships without `@cloudflare/workers-types` — pulling the full
 * package in would override the DOM `Request`/`Response` types the app relies
 * on everywhere else. These cover only what db/storage.ts and the /files route
 * actually use. Delete this file if the project ever adopts the real types.
 */
declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    [key: string]: unknown;
  };
}

/** Used by worker/index.ts, which shipped with the starter. */
interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Database {
  prepare(query: string): unknown;
  batch(statements: unknown[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

interface R2HttpMetadata {
  contentType?: string;
}

interface R2Object {
  key: string;
  size: number;
  httpMetadata?: R2HttpMetadata;
}

interface R2ObjectBody extends R2Object {
  body: ReadableStream;
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string,
    options?: { httpMetadata?: R2HttpMetadata }
  ): Promise<R2Object>;
  delete(key: string): Promise<void>;
}
