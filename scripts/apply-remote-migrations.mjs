#!/usr/bin/env node
/**
 * Apply the generated Drizzle migrations to the real (remote) D1 database.
 *
 *   CF_D1_DATABASE_NAME=hbn-db npm run db:migrate:remote
 *
 * Runs each file in drizzle/ through `wrangler d1 execute --remote`. Statements
 * are made idempotent the same way the local runner does it, so re-running is
 * safe and only new migrations take effect.
 *
 * Requires `npx wrangler login` first.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const database = process.env.CF_D1_DATABASE_NAME;

if (!database) {
  console.error(
    "Set CF_D1_DATABASE_NAME to the D1 database you created, e.g.\n" +
      "  CF_D1_DATABASE_NAME=hbn-db npm run db:migrate:remote"
  );
  process.exit(1);
}

const migrationsDir = path.join(root, "drizzle");
const migrations = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
if (!migrations.length) {
  console.error("No migrations in drizzle/. Run `npm run db:generate` first.");
  process.exit(1);
}

const scratch = mkdtempSync(path.join(tmpdir(), "hbn-d1-"));

for (const file of migrations) {
  const sql = readFileSync(path.join(migrationsDir, file), "utf8")
    .split("--> statement-breakpoint")
    // Drizzle already terminates each statement; a second ';' makes D1 reject
    // the file with "SQL code did not contain a statement".
    .map((statement) => statement.trim().replace(/;+\s*$/, ""))
    .filter(Boolean)
    .map((statement) =>
      statement
        .replace(/^CREATE TABLE\s+/i, "CREATE TABLE IF NOT EXISTS ")
        .replace(/^CREATE UNIQUE INDEX\s+/i, "CREATE UNIQUE INDEX IF NOT EXISTS ")
        .replace(/^CREATE INDEX\s+/i, "CREATE INDEX IF NOT EXISTS ")
    )
    .join(";\n");

  const target = path.join(scratch, file);
  writeFileSync(target, `${sql};\n`);

  console.log(`applying ${file} to ${database}…`);
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", database, "--remote", "--yes", "--file", target],
    { stdio: "inherit", cwd: root }
  );
}

console.log(`\nRemote D1 "${database}" is up to date.`);
