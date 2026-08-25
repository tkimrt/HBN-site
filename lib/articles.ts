import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { articles as articlesTable } from "../db/schema";
import { staticArticles, staticArticleBySlug } from "../content/articles";
import type { Article } from "../content/articles/types";

export type { Article };
export { formatArticleDate, CATEGORIES } from "../content/articles/types";

/**
 * Articles come from two places: the ten pieces migrated from the hbnnet.com
 * archive (compiled into the bundle) and anything added through /admin (D1).
 *
 * Every read degrades gracefully. Until the D1 database is provisioned and
 * migrated, the site still serves the full static archive rather than erroring.
 */

export type ArticleSource = "archive" | "database";
export type StoredArticle = Article & { source: ArticleSource; published: boolean };

function fromRow(row: typeof articlesTable.$inferSelect): StoredArticle {
  return {
    slug: row.slug,
    title: row.title,
    kicker: row.kicker,
    category: row.category,
    author: row.author,
    date: row.date,
    cover: row.cover,
    pdf: row.pdf,
    body: row.body,
    minutes: readingMinutes(row.body),
    published: row.published,
    source: "database",
  };
}

export function readingMinutes(body: string): number {
  const words = body.replace(/[#>\-*!\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

const archive: StoredArticle[] = staticArticles.map((a) => ({
  ...a,
  source: "archive",
  published: true,
}));

async function readDatabase(): Promise<StoredArticle[]> {
  try {
    const rows = await getDb()
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.createdAt), desc(articlesTable.id));
    return rows.map(fromRow);
  } catch {
    // No binding yet, or the migration has not been applied. The archive stands alone.
    return [];
  }
}

export async function listArticles({ includeDrafts = false } = {}): Promise<StoredArticle[]> {
  const stored = await readDatabase();
  const merged = [...stored, ...archive];
  return includeDrafts ? merged : merged.filter((a) => a.published);
}

export async function getArticle(slug: string): Promise<StoredArticle | null> {
  const fromArchive = staticArticleBySlug.get(slug);
  if (fromArchive) return { ...fromArchive, source: "archive", published: true };

  try {
    const [row] = await getDb()
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.slug, slug))
      .limit(1);
    return row ? fromRow(row) : null;
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<string[]> {
  const all = await listArticles();
  return [...new Set(all.map((a) => a.category))].sort();
}

export type ArticleInput = {
  slug: string;
  title: string;
  kicker: string;
  category: string;
  author: string;
  date: string;
  cover: string;
  pdf: string;
  body: string;
  published: boolean;
};

export async function saveArticle(input: ArticleInput): Promise<StoredArticle> {
  if (staticArticleBySlug.has(input.slug)) {
    throw new Error(
      `"${input.slug}" is an archive article compiled into the site. Choose a different URL slug.`
    );
  }

  const db = getDb();
  const now = new Date().toISOString();
  const [row] = await db
    .insert(articlesTable)
    .values({ ...input, createdAt: now, updatedAt: now })
    .onConflictDoUpdate({
      target: articlesTable.slug,
      set: { ...input, updatedAt: now },
    })
    .returning();

  return fromRow(row);
}

export async function deleteArticle(slug: string): Promise<void> {
  await getDb().delete(articlesTable).where(eq(articlesTable.slug, slug));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
