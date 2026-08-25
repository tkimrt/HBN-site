import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

/**
 * Articles written or uploaded through /admin. The pieces migrated from the
 * old hbnnet.com archive live in `content/articles/` and are compiled into the
 * bundle; this table holds everything added since.
 *
 * Timestamps are ISO-8601 text: the app writes them explicitly and only ever
 * sorts and displays them, and text kept the rows byte-compatible through the
 * D1 -> Postgres migration.
 */
export const articles = pgTable("articles", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  kicker: text("kicker").notNull().default(""),
  category: text("category").notNull().default("Strategy"),
  author: text("author").notNull().default("Al Trellis"),
  /** "YYYY-MM-DD", or empty when the piece is undated. */
  date: text("date").notNull().default(""),
  cover: text("cover").notNull().default(""),
  pdf: text("pdf").notNull().default(""),
  /** Markdown, rendered by app/markdown.tsx. */
  body: text("body").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`now()::text`),
  updatedAt: text("updated_at").notNull().default(sql`now()::text`),
});

export type ArticleRow = typeof articles.$inferSelect;

/**
 * Speaking engagements managed through /admin/events. The seeded session in
 * `content/events.ts` keeps the Speaking page and the home page band rendering
 * before the database is provisioned.
 */
export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  /** Conference or host, e.g. "PCBC San Diego". */
  name: text("name").notNull(),
  /** Session title. */
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  location: text("location").notNull().default(""),
  /** "YYYY-MM-DD". Used to sort and to decide what is still upcoming. */
  date: text("date").notNull(),
  /** Optional registration or session link. */
  url: text("url").notNull().default(""),
  cover: text("cover").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`now()::text`),
  updatedAt: text("updated_at").notNull().default(sql`now()::text`),
});

export type EventRow = typeof events.$inferSelect;

/**
 * Contact form submissions. Every enquiry is written here first and emailed
 * second, so a mail outage or a missing provider key can never lose one — the
 * admin inbox at /admin/enquiries reads straight from this table.
 */
export const enquiries = pgTable("enquiries", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  interest: text("interest").notNull().default(""),
  message: text("message").notNull().default(""),
  /** "sent", "skipped" (no provider configured), or "failed: <reason>". */
  emailStatus: text("email_status").notNull().default(""),
  handled: boolean("handled").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`now()::text`),
});

export type EnquiryRow = typeof enquiries.$inferSelect;
