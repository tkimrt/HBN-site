#!/usr/bin/env node
/**
 * Copy events and enquiries from the live Cloudflare D1 database into the
 * libSQL database (local file by default; Turso when DATABASE_URL is set).
 *
 *   npm exec wrangler -- d1 execute hbn-db --remote --yes \
 *     --command "SELECT ... FROM events"   > (see README)
 *
 * Simpler: node scripts/import-data.mjs   — it shells out to wrangler itself.
 * Idempotent: rows already present (same natural key) are skipped.
 */
import { createClient } from "@libsql/client";
import { execFileSync } from "node:child_process";

function d1(sql) {
  const out = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "hbn-db", "--remote", "--yes", "--json", "--command", sql],
    { encoding: "utf8" }
  );
  return JSON.parse(out)[0].results;
}

const url = process.env.DATABASE_URL ?? "file:.data/local.db";
const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

const events = d1("SELECT name,title,summary,location,date,url,cover,published FROM events");
for (const e of events) {
  await db.execute({
    sql: `INSERT INTO events (name,title,summary,location,date,url,cover,published)
          SELECT ?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM events WHERE name=? AND date=?)`,
    args: [e.name, e.title, e.summary, e.location, e.date, e.url, e.cover, e.published, e.name, e.date],
  });
}

const enquiries = d1("SELECT name,company,email,phone,interest,message,email_status,handled,created_at FROM enquiries");
for (const q of enquiries) {
  await db.execute({
    sql: `INSERT INTO enquiries (name,company,email,phone,interest,message,email_status,handled,created_at)
          SELECT ?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM enquiries WHERE created_at=? AND email=?)`,
    args: [q.name, q.company, q.email, q.phone, q.interest, q.message, q.email_status, q.handled, q.created_at, q.created_at, q.email],
  });
}

const articles = d1("SELECT slug,title,kicker,category,author,date,cover,pdf,body,published FROM articles");
for (const a of articles) {
  await db.execute({
    sql: `INSERT INTO articles (slug,title,kicker,category,author,date,cover,pdf,body,published)
          SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug=?)`,
    args: [a.slug, a.title, a.kicker, a.category, a.author, a.date, a.cover, a.pdf, a.body, a.published, a.slug],
  });
}

console.log(`imported into ${url}: ${events.length} events, ${enquiries.length} enquiries, ${articles.length} articles`);
db.close();
