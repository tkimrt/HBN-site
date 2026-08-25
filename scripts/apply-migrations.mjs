#!/usr/bin/env node
/**
 * Apply the generated Drizzle migrations to the libSQL database.
 *
 *   npm run db:migrate                          # local file (.data/local.db)
 *   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... npm run db:migrate
 *
 * Statements are made idempotent, so re-running is safe and only new
 * migrations take effect.
 */
import { createClient } from "@libsql/client";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const url = process.env.DATABASE_URL ?? "file:.data/local.db";

if (url.startsWith("file:")) {
  mkdirSync(path.join(root, path.dirname(url.slice(5))), { recursive: true });
}

const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

const migrationsDir = path.join(root, "drizzle");
const migrations = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
if (!migrations.length) {
  console.error("No migrations in drizzle/. Run `npm run db:generate` first.");
  process.exit(1);
}

for (const file of migrations) {
  const statements = readFileSync(path.join(migrationsDir, file), "utf8")
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim().replace(/;+\s*$/, ""))
    .filter(Boolean)
    .map((statement) =>
      statement
        .replace(/^CREATE TABLE\s+/i, "CREATE TABLE IF NOT EXISTS ")
        .replace(/^CREATE UNIQUE INDEX\s+/i, "CREATE UNIQUE INDEX IF NOT EXISTS ")
        .replace(/^CREATE INDEX\s+/i, "CREATE INDEX IF NOT EXISTS ")
    );
  console.log(`applying ${file}…`);
  await client.executeMultiple(statements.join(";\n") + ";");
}

console.log(`\n${url} is up to date.`);
client.close();
