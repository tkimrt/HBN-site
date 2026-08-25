import { PageShell, SectionHeading, SubpageHero } from "../components";
import { formatEventDate, listUpcomingEvents } from "../../lib/events";
import { FORMAT_ORDER, PROGRAM_FORMATS, programs, type ProgramFormat } from "../../content/programs";

/** One glyph per program length, used both in the key and beside each title. */
function FormatIcon({ format }: { format: ProgramFormat }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (format === "keynote") {
    // A literal key — bow on the upper right, shaft running down to the wards.
    return <svg {...common}><circle cx="15.5" cy="8.5" r="4.5" /><path d="M12.3 11.7 4 20" /><path d="M7.5 16.5 10 19" /><path d="M5.5 18.5 8 21" /></svg>;
  }
  if (format === "industry") {
    return <svg {...common}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 16v4" /><path d="M8 20h8" /></svg>;
  }
  return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 5.6A3 3 0 0 1 17 11.3" /><path d="M17 19a5.6 5.6 0 0 0-1.6-3.8" /></svg>;
}

export const metadata = { title: "Speaking & 20 Clubs" };

const corporate = [
  ["At the Intersection of Leadership and Change", "For audiences of 20 to 500. What changes, what does not, and how leaders hold their footing through both."],
  ["The Art of War", "Sun Tzu, Napoleon and Clausewitz on strategy, competition and execution under uncertainty."],
];

export default async function SpeakingPage() {
  const upcoming = await listUpcomingEvents();
  const [featured, ...alsoUpcoming] = upcoming;

  return <PageShell>
    <SubpageHero
      eyebrow="Speaking & presentations"
      title="Make the room smarter."
      intro="Al has delivered more than 500 presentations to building and corporate audiences. Every program is customised to the client."
      image="/images/speaking.jpg"
      imageAlt="A conference audience facing a lit stage"
      tone="green"
    />

    {featured && (
      <section className="upcoming-event">
        <div>
          <p className="eyebrow">Upcoming · {formatEventDate(featured.date)}</p>
          <h2>{featured.name}</h2>
          {featured.location && <p className="event-location">{featured.location}</p>}
        </div>
        <div>
          <h3>{featured.title}</h3>
          {featured.summary && <p>{featured.summary}</p>}
          {featured.url && (
            <a className="inline-link" href={featured.url} target="_blank" rel="noreferrer noopener">
              Registration <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
    )}

    {alsoUpcoming.length > 0 && (
      <section className="event-list-section">
        <SectionHeading eyebrow="Also coming up" title="Where Al will be next." />
        <div className="event-list">
          {alsoUpcoming.map((event) => (
            <article key={event.id}>
              <p className="tag">{formatEventDate(event.date)}{event.location && ` · ${event.location}`}</p>
              <h3>{event.name}</h3>
              <p>{event.title}</p>
              {event.url && (
                <a className="inline-link" href={event.url} target="_blank" rel="noreferrer noopener">
                  Registration <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    )}

    <section className="format-strip" aria-label="Program formats">
      {FORMAT_ORDER.map((format) => (
        <div key={format}>
          <span className="format-icon"><FormatIcon format={format} /></span>
          <strong>{PROGRAM_FORMATS[format].length}</strong>
          <span>{PROGRAM_FORMATS[format].label}</span>
        </div>
      ))}
    </section>

    <section className="talks-section">
      <SectionHeading
        eyebrow="Home building industry programs"
        title="The business of building, without the boilerplate."
        text="These programs have reached more than 50,000 builder professionals."
      />
      {/* <details> gives click-to-expand summaries with no client JS, and stays
          keyboard-accessible for free. */}
      <div className="program-list">
        {programs.map((program) => (
          <details className="program" key={program.title}>
            <summary>
              <h3>{program.title}</h3>
              <span className="program-formats">
                {program.formats.map((format) => (
                  <span className="program-format" key={format} title={PROGRAM_FORMATS[format].label}>
                    <FormatIcon format={format} />
                    <span className="sr-only">{PROGRAM_FORMATS[format].label}</span>
                  </span>
                ))}
              </span>
              <span className="program-toggle" aria-hidden="true" />
            </summary>
            <p className="program-summary">{program.summary}</p>
          </details>
        ))}
      </div>
    </section>

    <section className="quote-block compact">
      <div className="quote-symbol">“</div>
      <blockquote>Al Trellis is the best national speaker on home building and sales that I’ve ever seen.</blockquote>
      <p>Chris Kemmerly · Miramonte Homes</p>
    </section>

    <section className="engagements">
      <SectionHeading eyebrow="Corporate presentations" title="Not just for builders." />
      <div className="engagement-grid">
        {corporate.map(([title, copy]) => (
          <article key={title}><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </div>
    </section>

    <section className="club-section">
      <div><p className="eyebrow light">20 Club facilitation</p><h2>Candid advice among non-competing peers.</h2></div>
      <div>
        <p>Al facilitates builder groups that share financial data, best practices, and hard-won lessons. Each meeting combines benchmarking, operational deep-dives, structured problem solving, and individual coaching.</p>
        <p className="club-callout">15–20 builders. Different markets. Shared accountability.</p>
      </div>
    </section>
  </PageShell>;
}
