import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "About" };

const team = [
  {
    initials: "AT",
    name: "Al Trellis",
    role: "Founder & President — Strategy & Construction",
    copy: "Over five decades as a custom builder, engineer and consultant, and teacher. Al created the 15 Functions of Home Building framework and the Totally Integrated Neighborhood Solutions methodology, has authored several books and more than 200 articles, and is recognized across the industry for finding profit and productivity where others see none.",
  },
  {
    initials: "BW",
    name: "Bill Watkins",
    role: "Founder & Vice President — Design & Land Planning",
    copy: "An engineer and former builder who specializes in plans that are genuinely buildable and genuinely cost-effective, and in land strategies coordinated with the product that will sit on them. Bill’s particular strength is developing targeted product offerings for specific markets.",
  },
  {
    initials: "BT",
    name: "Brad Trellis",
    role: "Principal & Operations Manager",
    copy: "Project coordination, scheduling and budget management across every engagement — plus production of the marketing material that comes out of them, including renderings, graphic design and print coordination.",
  },
];

export default function AboutPage() {
  return <PageShell>
    <SubpageHero
      eyebrow="About Home Builders Network"
      title="Building. Developing. Product. Advising. Coaching."
      intro="Home design, land planning and marketing under one vision — because a builder has to meet today’s buyer expectations across all three at once."
      tone="green"
    />

    <section className="profile-section">
      <div className="profile-card">
        <span className="profile-initials">AT</span>
        <div><p>Al Trellis</p><span>Founder &amp; President</span><span>Home Builders Network</span></div>
      </div>
      <div className="profile-copy">
        <p className="lead">Al is the founder and president of Home Builders Network, working with 48 home building companies across the United States and Canada—from 10-unit custom builders to a 525-unit-per-year production operation.</p>
        <div className="two-col-copy">
          <p>Over the course of his career, Al has been a partner in eight residential developments and advised on the sale of 10 homebuilding companies. He created the 15 Functions of Home Building framework and the Totally Integrated Neighborhood Solutions methodology for land planning.</p>
          <p>He has authored more than 200 articles and speaks frequently at IBS, PCBC, and state and regional HBA events. His work spans land, product, pricing, sales, construction, finance, and organizational leadership.</p>
        </div>
      </div>
    </section>

    <section className="team-section">
      <SectionHeading
        eyebrow="The team"
        title="One vision, three disciplines."
      />
      <div className="team-grid">
        {team.map((person) => (
          <article key={person.name}>
            <span className="team-initials">{person.initials}</span>
            <h3>{person.name}</h3>
            <p className="team-role">{person.role}</p>
            <p>{person.copy}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="quote-block compact">
      <div className="quote-symbol">“</div>
      <blockquote>Excellence is doing ordinary things extraordinarily well.</blockquote>
      <p>John W. Gardner</p>
    </section>

    <section className="number-wall">
      <SectionHeading eyebrow="By the numbers" title="Experience, applied." />
      <div className="number-grid">
        <div><strong>54</strong><span>years in the industry</span></div>
        <div><strong>35</strong><span>years as HBN</span></div>
        <div><strong>48</strong><span>active clients</span></div>
        <div><strong>3</strong><span>countries served</span></div>
      </div>
    </section>
  </PageShell>;
}
