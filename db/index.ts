import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * libSQL everywhere: Turso in production (DATABASE_URL + DATABASE_AUTH_TOKEN),
 * a local file during development. Same SQLite dialect as the original D1
 * deployment, so the schema and drizzle/ migrations are unchanged.
 */

let client: Client | undefined;

export function getDb() {
  client ??= createClient(
    process.env.DATABASE_URL
      ? { url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN }
      : { url: "file:.data/local.db" }
  );
  return drizzle(client, { schema });
}

/** True when a real (remote) database is configured, or we're on a dev machine
 *  where the file fallback works. On Vercel without DATABASE_URL the filesystem
 *  is not writable, so publishing genuinely is unavailable. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || !process.env.VERCEL;
}
