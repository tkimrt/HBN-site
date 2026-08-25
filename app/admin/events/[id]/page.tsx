import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../../components";
import { EventEditor } from "../../event-editor";
import { getEvent } from "../../../../lib/events";

export const metadata = { title: "Edit speaking event" };
export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(Number(id));
  if (!event) notFound();

  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin/events">← Speaking events</Link>
        <h1>Edit event.</h1>
      </div>
    </section>
    <section className="editor-section">
      <EventEditor initial={event} />
    </section>
  </PageShell>;
}
