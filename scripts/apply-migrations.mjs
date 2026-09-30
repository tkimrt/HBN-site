#!/usr/bin/env node
/**
 * Apply the drizzle/ migrations.
 *
 *   DATABASE_URL=postgres://... node scripts/apply-migrations.mjs   # Supabase
 *   LOCAL_DATA=1 node scripts/apply-migrations.mjs                  # local PGlite
 *
 * Uses drizzle's official migrator, so applied migrations are journaled and
 * re-running is a no-op.
 */
const url = process.env.DATABASE_URL;

if (url) {
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");
  const { default: postgres } = await import("postgres");
  const client = postgres(url, { prepare: false, max: 1 });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.end();
  console.log("migrations applied to", url.replace(/:[^:@/]+@/, ":****@"));
} else if (process.env.LOCAL_DATA === "1" || !process.env.CI) {
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(".data/pg", { recursive: true });
  const client = new PGlite(".data/pg");
  // Supabase provides these PostgREST roles. Mirror them in the local database
  // so security migrations are exercised by the same migration path in tests.
  for (const role of ["anon", "authenticated"]) {
    const result = await client.query(
      "select 1 from pg_roles where rolname = $1",
      [role],
    );
    if (result.rows.length === 0) {
      await client.query(`create role "${role}" nologin`);
    }
  }
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.close();
  console.log("migrations applied to local PGlite (.data/pg)");
} else {
  console.error("Set DATABASE_URL (Supabase) or LOCAL_DATA=1 (local PGlite).");
  process.exit(1);
}
