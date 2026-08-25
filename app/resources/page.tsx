import Link from "next/link";
import { ArrowIcon, DownloadIcon, PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Free Builder Tools" };

const handouts = [
  ["01", "The New Improved Builder Money Making Machine", "Ten ways for builders to increase their profits.", "/downloads/money-making-machine.pdf"],
  ["02", "It’s About Time", "Tips and techniques for using your time more efficiently and effectively.", "/downloads/its-about-time.pdf"],
  ["03", "The Builder’s Guide to Marketing Success", "Best practices for marketing and selling your homes and your services.", "/downloads/marketing-success.pdf"],
  ["04", "Lessons From the Real World", "What home builders can learn from the world of industry.", "/downloads/lessons-real-world.pdf"],
  ["05", "The Design Advantage", "Beat the competition and increase sales and profits through better design.", "/downloads/design-advantage.pdf"],
  ["06", "Profit Through Negotiation", "Dealing effectively with clients, employees, subcontractors and suppliers.", "/downloads/profit-negotiation.pdf"],
];

const elsewhere = [
  ["Values That Matter™", "More than 70 flexible, economical plans built over a thousand times by 30+ builders.", "https://www.valuesthatmatter.net"],
  ["52 Builder Tips", "One practical idea a week, for a year.", "http://52buildertips.com"],
  ["HBN Plans", "The searchable concept plan catalogue and neighbourhood collections.", "http://www.hbnplans.com/"],
  ["Builder to Builder", "The podcast and video conversations, on Facebook.", "https://www.facebook.com/BuildertoBuilder"],
  ["HBN on YouTube", "Recorded sessions and short takes from Al.", "https://www.youtube.com/user/HomeBuildersNetwork"],
];

export default function ResourcesPage() {
  return <PageShell>
    <SubpageHero
      eyebrow="Free builder tools"
      title="Take the thinking with you."
      intro="The same material we use in seminars and 20 Clubs. No form, no email capture."
      tone="green"
    />

    <section className="collection-section">
      <SectionHeading eyebrow="The handouts" title="Six guides, free to download." />
      <div className="handout-list">
        {handouts.map(([n, title, copy, href]) => (
          <a className="handout-row" key={n} href={href} download>
            <span className="handout-number">{n}</span>
            <div><h3>{title}</h3><p>{copy}</p></div>
            <span className="handout-action">PDF <DownloadIcon /></span>
          </a>
        ))}
      </div>
    </section>

    <section className="tins-band">
      <div>
        <p className="eyebrow">The methodology</p>
        <h2>Totally Integrated<br />Neighborhood Solutions.</h2>
        <p>The full TINS brochure — how the land plan, product lineup and pricing come together as one profit system.</p>
        <a className="button button-dark" href="/downloads/tins-brochure.pdf" download>
          Download the brochure <DownloadIcon />
        </a>
      </div>
      <div className="tins-band-link">
        <Link className="inline-link" href="/land-planning">See how TINS works <ArrowIcon /></Link>
      </div>
    </section>

    <section className="engagements">
      <SectionHeading eyebrow="Elsewhere" title="Other places we publish." />
      <div className="engagement-grid">
        {elsewhere.map(([title, copy, href]) => (
          <article key={title}>
            <h3><a href={href} target="_blank" rel="noreferrer noopener">{title} <ArrowIcon /></a></h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  </PageShell>;
}
