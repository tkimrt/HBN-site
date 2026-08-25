import { deleteArticle, saveArticle, slugify } from "../../../../lib/articles";
import { CATEGORIES } from "../../../../content/articles/types";

// TODO(auth): this route is intentionally ungated for now. Before this site goes
// live, put an authentication check here and in app/admin — anyone who can reach
// these endpoints can publish to the public article library.

type Payload = Partial<Record<string, unknown>>;

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const title = str(payload.title);
  const body = str(payload.body);
  if (!title) return Response.json({ error: "A title is required." }, { status: 400 });
  if (!body) return Response.json({ error: "The article body is empty." }, { status: 400 });

  const slug = slugify(str(payload.slug) || title);
  if (!slug) {
    return Response.json({ error: "Could not build a URL from that title." }, { status: 400 });
  }

  const category = str(payload.category, "Strategy");
  const date = str(payload.date);
  if (date && !/^\d{4}(-\d{2}){0,2}$/.test(date)) {
    return Response.json({ error: "Date must look like 2026-07 or 2026-07-29." }, { status: 400 });
  }

  try {
    const article = await saveArticle({
      slug,
      title,
      kicker: str(payload.kicker),
      category: (CATEGORIES as readonly string[]).includes(category) ? category : "Strategy",
      author: str(payload.author, "Al Trellis"),
      date,
      cover: str(payload.cover),
      pdf: str(payload.pdf),
      body,
      published: payload.published !== false,
    });
    return Response.json({ article }, { status: 201 });
  } catch (error) {
    return Response.json({ error: describe(error) }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return Response.json({ error: "Missing ?slug." }, { status: 400 });

  try {
    await deleteArticle(slug);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: describe(error) }, { status: 400 });
  }
}

function describe(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table")) {
    return "The articles table does not exist yet. Run `npm run db:generate` and deploy so the platform applies the migration to D1.";
  }
  return message;
}
