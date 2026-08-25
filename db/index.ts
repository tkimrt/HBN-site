import { mkdirSync } from "node:fs";
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

/**
 * Postgres everywhere: Supabase in production (DATABASE_URL — use the pooled
 * connection string), embedded PGlite under .data/pg for `next dev` and the
 * test harness. Same dialect in both, so behavior cannot drift.
 */

export type Db = PostgresJsDatabase<typeof schema>;

/** One instance per process, shared across Next's per-route module copies.
 *  PGlite is single-connection — two instances on one data directory cannot
 *  see each other's writes — and the Postgres pool shouldn't multiply either. */
const globalDb = globalThis as unknown as { __hbnDb?: Db };

/** Local-file mode is explicit: `next dev`, or LOCAL_DATA=1 (used by the test
 *  harness and local `next start`). Never inferred from the host — a managed
 *  container's disk accepts writes and then loses them on restart. */
function localDataAllowed(): boolean {
  return process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}

export function getDb(): Db {
  let db = globalDb.__hbnDb;
  if (!db) {
    if (process.env.DATABASE_URL) {
      // prepare:false keeps Supabase's transaction pooler (port 6543) happy.
      const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 5 });
      db = drizzlePostgres(client, { schema });
    } else if (localDataAllowed()) {
      // Runtime-compatible with the postgres-js instance for every query the
      // app makes; the cast spares call sites a two-driver union type.
      mkdirSync(".data/pg", { recursive: true }); // PGlite's own mkdir is not recursive
      db = drizzlePglite(new PGlite(".data/pg"), { schema }) as unknown as Db;
    } else {
      throw new Error(
        "DATABASE_URL is not configured. Set it in the host's environment variables."
      );
    }
    globalDb.__hbnDb = db;
  }
  return db;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1";
}
