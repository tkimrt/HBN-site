import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * libSQL everywhere: Turso in production (DATABASE_URL + DATABASE_AUTH_TOKEN),
 * a local file during development. Same SQLite dialect as the original D1
 * deployment, so the schema and drizzle/ migrations are unchanged.
 */

let client: Client | undefined;

/** Local-file mode is explicit: `next dev`, or LOCAL_DATA=1 (used by the test
 *  harness and local `next start`). Never inferred from the host — a managed
 *  container's disk accepts writes and then loses them on restart. */
function localDataAllowed(): boolean {
  return process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}

export function getDb() {
  if (!client) {
    if (process.env.DATABASE_URL) {
      client = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });
    } else if (localDataAllowed()) {
      client = createClient({ url: "file:.data/local.db" });
    } else {
      throw new Error(
        "DATABASE_URL is not configured. Set it (with DATABASE_AUTH_TOKEN) in the host's environment variables."
      );
    }
  }
  return drizzle(client, { schema });
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}
