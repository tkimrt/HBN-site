import { deleteEvent, saveEvent } from "../../../../lib/events";

// TODO(auth): ungated alongside the rest of /admin. Gate before launch.

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const name = str(payload.name);
  const title = str(payload.title);
  const date = str(payload.date);

  if (!name) return Response.json({ error: "An event name is required." }, { status: 400 });
  if (!title) return Response.json({ error: "A session title is required." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Date must be YYYY-MM-DD." }, { status: 400 });
  }

  const url = str(payload.url);
  if (url && !/^https?:\/\//i.test(url)) {
    return Response.json({ error: "Link must start with http:// or https://" }, { status: 400 });
  }

  try {
    const event = await saveEvent({
      id: typeof payload.id === "number" && payload.id > 0 ? payload.id : undefined,
      name,
      title,
      summary: str(payload.summary),
      location: str(payload.location),
      date,
      url,
      cover: str(payload.cover),
      published: payload.published !== false,
    });
    return Response.json({ event }, { status: 201 });
  } catch (error) {
    return Response.json({ error: describe(error) }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Missing or invalid ?id." }, { status: 400 });
  }
  try {
    await deleteEvent(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: describe(error) }, { status: 400 });
  }
}

function describe(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table")) {
    return "The events table does not exist yet. Run `npm run db:generate` and deploy so the platform applies the migration to D1.";
  }
  return message;
}
