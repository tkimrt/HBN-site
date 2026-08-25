#!/usr/bin/env node
/**
 * Copy articles, events and enquiries from the legacy Cloudflare D1 database
 * into Postgres (Supabase when DATABASE_URL is set, local PGlite otherwise).
 * Requires `npx wrangler login` for the D1 read. Idempotent — rows already
 * present under their natural key are skipped.
 */
import { execFileSync } from "node:child_process";

function d1(sql) {
  const out = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "hbn-db", "--remote", "--yes", "--json", "--command", sql],
    { encoding: "utf8" }
  );
  return JSON.parse(out)[0].results;
}

const bool = (v) => Boolean(Number(v));

let client, sql;
if (process.env.DATABASE_URL) {
  const { default: postgres } = await import("postgres");
  sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  client = { query: (q, args) => sql.unsafe(q, args), end: () => sql.end() };
} else {
  const { PGlite } = await import("@electric-sql/pglite");
  const pg = new PGlite(".data/pg");
  client = { query: (q, args) => pg.query(q, args), end: () => pg.close() };
}

const events = d1("SELECT name,title,summary,location,date,url,cover,published FROM events");
for (const e of events) {
  await client.query(
    `INSERT INTO events (name,title,summary,location,date,url,cover,published)
     SELECT $1,$2,$3,$4,$5,$6,$7,$8 WHERE NOT EXISTS (SELECT 1 FROM events WHERE name=$1 AND date=$5)`,
    [e.name, e.title, e.summary, e.location, e.date, e.url, e.cover, bool(e.published)]
  );
}

const enquiries = d1("SELECT name,company,email,phone,interest,message,email_status,handled,created_at FROM enquiries");
for (const q of enquiries) {
  await client.query(
    `INSERT INTO enquiries (name,company,email,phone,interest,message,email_status,handled,created_at)
     SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE NOT EXISTS (SELECT 1 FROM enquiries WHERE created_at=$9 AND email=$3)`,
    [q.name, q.company, q.email, q.phone, q.interest, q.message, q.email_status, bool(q.handled), q.created_at]
  );
}

const articles = d1("SELECT slug,title,kicker,category,author,date,cover,pdf,body,published FROM articles");
for (const a of articles) {
  await client.query(
    `INSERT INTO articles (slug,title,kicker,category,author,date,cover,pdf,body,published)
     SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug=$1)`,
    [a.slug, a.title, a.kicker, a.category, a.author, a.date, a.cover, a.pdf, a.body, bool(a.published)]
  );
}

console.log(`imported: ${events.length} events, ${enquiries.length} enquiries, ${articles.length} articles`);
await client.end();
