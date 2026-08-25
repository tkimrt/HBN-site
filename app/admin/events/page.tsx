import Link from "next/link";
import { ArrowIcon, PageShell } from "../../components";
import { formatEventDate, listEvents } from "../../../lib/events";
import { seedEvents } from "../../../content/events";

export const metadata = { title: "Speaking events" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await listEvents({ includeDrafts: true });
  const today = new Date().toISOString().slice(0, 10);
  // Seed ids are negative: still the compiled placeholder, not a database row.
  const isSeeded = events.some((e) => e.id < 0);

  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.date < today);

  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin">← Admin</Link>
        <h1>Speaking events.</h1>
        <p className="admin-intro">
          What appears on <Link href="/speaking">Speaking</Link> and in the band on the home page.
          The next upcoming event is the one featured on the home page.
        </p>
      </div>
      <Link className="button button-dark" href="/admin/events/new">Add event <ArrowIcon /></Link>
    </section>

    {isSeeded && (
      <section className="admin-status">
        <div className="is-warn">
          <strong>Not yet in the database</strong>
          <span>
            The PCBC session below ships with the site as a placeholder. Import it to edit or
            delete it — after that the database is the only source.{" "}
            <Link href={`/admin/events/new?seed=${seedEvents[0]?.id ?? ""}`}>Import it now</Link>.
          </span>
        </div>
      </section>
    )}

    <section className="admin-list">
      <h2>Upcoming <span className="admin-count">{upcoming.length}</span></h2>
      {upcoming.length === 0 ? (
        <p className="admin-empty">
          Nothing scheduled. <Link href="/admin/events/new">Add an event</Link>.
        </p>
      ) : (
        <div className="admin-rows">
          {upcoming.map((event) => (
            <div className={`admin-row ${event.id < 0 ? "is-locked" : ""}`} key={`${event.id}-${event.date}`}>
              <div>
                <p className="tag">
                  {formatEventDate(event.date)}
                  {event.location && ` · ${event.location}`}
                  {!event.published && " · hidden"}
                  {event.id < 0 && " · seeded"}
                </p>
                <h3>{event.name}</h3>
                <p className="admin-slug">{event.title}</p>
              </div>
              <div className="admin-actions">
                {event.id > 0
                  ? <Link href={`/admin/events/${event.id}`}>Edit</Link>
                  : <Link href={`/admin/events/new?seed=${event.id}`}>Import</Link>}
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="admin-archive-head">Past <span className="admin-count">{past.length}</span></h2>
          <div className="admin-rows">
            {past.map((event) => (
              <div className="admin-row is-locked" key={`${event.id}-${event.date}`}>
                <div>
                  <p className="tag">{formatEventDate(event.date)}</p>
                  <h3>{event.name}</h3>
                  <p className="admin-slug">{event.title}</p>
                </div>
                <div className="admin-actions">
                  {event.id > 0 && <Link href={`/admin/events/${event.id}`}>Edit</Link>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  </PageShell>;
}
