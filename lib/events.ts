import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { events as eventsTable } from "../db/schema";
import { seedEvents, type SpeakingEvent } from "../content/events";

export type { SpeakingEvent };
export { formatEventDate, formatEventMonth } from "../content/events";

/**
 * Speaking engagements. Mirrors lib/articles.ts: the database is the source of
 * truth once it holds anything, and a compiled seed keeps the Speaking page and
 * the home page band populated before D1 is provisioned.
 */

async function readDatabase(): Promise<SpeakingEvent[]> {
  try {
    const rows = await getDb().select().from(eventsTable).orderBy(desc(eventsTable.date));
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      title: row.title,
      summary: row.summary,
      location: row.location,
      date: row.date,
      url: row.url,
      cover: row.cover,
      published: row.published,
    }));
  } catch {
    return [];
  }
}

const identity = (e: SpeakingEvent) => `${e.name.toLowerCase().trim()}|${e.date}`;

export async function listEvents({ includeDrafts = false } = {}): Promise<SpeakingEvent[]> {
  const stored = await readDatabase();
  // Seeded events keep showing alongside database ones, so adding a first event
  // never silently drops the placeholder. A stored row with the same name and
  // date supersedes its seed — that is what "Import" produces.
  const claimed = new Set(stored.map(identity));
  const all = [...stored, ...seedEvents.filter((e) => !claimed.has(identity(e)))];
  const visible = includeDrafts ? all : all.filter((e) => e.published);
  return visible.sort((a, b) => b.date.localeCompare(a.date));
}

/** Today in UTC as "YYYY-MM-DD"; events on today still count as upcoming. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isUpcoming(date: string): boolean {
  return date >= today();
}

export async function listUpcomingEvents(): Promise<SpeakingEvent[]> {
  const now = today();
  return (await listEvents())
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function listPastEvents(): Promise<SpeakingEvent[]> {
  const now = today();
  return (await listEvents()).filter((e) => e.date < now);
}

/** The next engagement, used for the home page band. */
export async function getNextEvent(): Promise<SpeakingEvent | null> {
  const upcoming = await listUpcomingEvents();
  if (upcoming.length > 0) return upcoming[0];
  // Nothing scheduled — fall back to the most recent so the band is never empty.
  const all = await listEvents();
  return all[0] ?? null;
}

export async function getEvent(id: number): Promise<SpeakingEvent | null> {
  try {
    const [row] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, id)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      title: row.title,
      summary: row.summary,
      location: row.location,
      date: row.date,
      url: row.url,
      cover: row.cover,
      published: row.published,
    };
  } catch {
    return null;
  }
}

export type EventInput = Omit<SpeakingEvent, "id"> & { id?: number };

export async function saveEvent(input: EventInput): Promise<SpeakingEvent> {
  const db = getDb();
  const now = new Date().toISOString();
  const values = {
    name: input.name,
    title: input.title,
    summary: input.summary,
    location: input.location,
    date: input.date,
    url: input.url,
    cover: input.cover,
    published: input.published,
    updatedAt: now,
  };

  const [row] =
    input.id && input.id > 0
      ? await db.update(eventsTable).set(values).where(eq(eventsTable.id, input.id)).returning()
      : await db.insert(eventsTable).values({ ...values, createdAt: now }).returning();

  if (!row) throw new Error("Event not found.");
  return { ...values, id: row.id };
}

export async function deleteEvent(id: number): Promise<void> {
  await getDb().delete(eventsTable).where(eq(eventsTable.id, id));
}
