import Link from "next/link";
import { PageShell } from "../../../components";
import { EventEditor } from "../../event-editor";
import { seedEvents } from "../../../../content/events";

export const metadata = { title: "Add speaking event" };

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed } = await searchParams;
  // Importing the compiled placeholder: prefill the form, but save as a new row.
  const seeded = seed ? seedEvents.find((e) => String(e.id) === seed) : undefined;

  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin/events">← Speaking events</Link>
        <h1>{seeded ? "Import event." : "Add event."}</h1>
        {seeded && (
          <p className="admin-intro">
            Prefilled from the placeholder that ships with the site. Saving writes it to the
            database, after which it is fully editable.
          </p>
        )}
      </div>
    </section>
    <section className="editor-section">
      <EventEditor initial={seeded ? { ...seeded, id: 0 } : undefined} />
    </section>
  </PageShell>;
}
