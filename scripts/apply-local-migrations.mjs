#!/usr/bin/env node
/**
 * Apply the generated Drizzle migrations to the local Miniflare D1 database.
 *
 *   node scripts/apply-local-migrations.mjs
 *
 * Local dev only. On the hosting platform the control plane applies whatever
 * `npm run db:generate` produced under drizzle/ — this script just gets the same
 * schema into the sqlite file that `vinext dev` simulates D1 with.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const stateDir = path.join(root, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");

if (!existsSync(stateDir)) {
  console.error("No local D1 state yet. Start `npm run dev` and load a page first.");
  process.exit(1);
}

const dbFile = readdirSync(stateDir).find(
  (name) => name.endsWith(".sqlite") && name !== "metadata.sqlite"
);
if (!dbFile) {
  console.error("No local D1 database file found in .wrangler/state.");
  process.exit(1);
}

const migrationsDir = path.join(root, "drizzle");
const migrations = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
if (!migrations.length) {
  console.error("No migrations in drizzle/. Run `npm run db:generate` first.");
  process.exit(1);
}

for (const file of migrations) {
  // Drizzle separates statements with `--> statement-breakpoint`.
  const sql = readFileSync(path.join(migrationsDir, file), "utf8")
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim().replace(/;+\s*$/, ""))
    .filter(Boolean)
    // Re-running should be a no-op rather than an error.
    .map((statement) =>
      statement
        .replace(/^CREATE TABLE\s+/i, "CREATE TABLE IF NOT EXISTS ")
        .replace(/^CREATE UNIQUE INDEX\s+/i, "CREATE UNIQUE INDEX IF NOT EXISTS ")
        .replace(/^CREATE INDEX\s+/i, "CREATE INDEX IF NOT EXISTS ")
    )
    .join(";\n");

  execFileSync("sqlite3", [path.join(stateDir, dbFile)], { input: `${sql};`, stdio: ["pipe", "inherit", "inherit"] });
  console.log(`applied ${file}`);
}

console.log("Local D1 is up to date.");
